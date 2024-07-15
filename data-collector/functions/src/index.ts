import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import { Article } from "../../../models/Article";


admin.initializeApp();

const newsApiKey = functions.config().newsapi.apikey;
const topHeadlinesUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsApiKey}`;



export const scheduledNewsCollection = functions.pubsub.schedule('0 7,12,17 * * *')
    .timeZone('America/Denver')
    .onRun(async (_) => {
        try {
            await collectNews();
        } catch (e) {
            logger.error('Error collecting news', e);
        }       
    });

export const requestNewsCollection = functions.https.onRequest((req, res) => {
    collectNews()
        .then(() => res.status(200).send('News collected'))
        .catch(() => res.status(500).send('Error collecting news'));
});

const collectNews = async () => {
    const articles = await getTopHeadlines();
    const parsedArticles = parseArticles(articles);
    await saveArticlesIfNotExists(parsedArticles);
}

const getTopHeadlines = async () : Promise<any[]> => {
    const response = await axios.get(topHeadlinesUrl);
    if (response.status !== 200) {
        logger.error('Error fetching top headlines');
        return [];
    }
    return response.data.articles;
}

const parseArticles = (articles: any[]) : Article[] => {
    return articles
        .filter(article => article['source']['name'] != '[Removed]')
        .map(article => {
            return new Article(article); 
        });
}

const saveArticlesIfNotExists = async (articles: Article[]) => {
    const db = admin.firestore();
    const articlesCollection = db.collection('articles');
    const existingArticles = await articlesCollection.get();
    const existingArticleTitles = existingArticles.docs.map(doc => doc.data().title);
    const newArticles = articles.filter(article => !existingArticleTitles.includes(article.title));
    newArticles.forEach(async article => {
        await articlesCollection.add(article.pojo);
    });
}
