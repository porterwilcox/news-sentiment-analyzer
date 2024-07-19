import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import { Article } from "../../../models/Article";


if (!admin.apps.length) {
    admin.initializeApp();
}

const newsApiKey = functions.config().newsapi.apikey;
const topHeadlinesUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsApiKey}`;


export const scheduledNewsCollection = functions.pubsub.schedule('0 7,12,17 * * *')
    .timeZone('America/Denver')
    .onRun(async (context) => {
        try {
            await collectNews();
        } catch (e) {
            logger.error('Error collecting news', e);
        }
    });

export const requestNewsCollection = functions.https.onCall(async (data, context) => {
    try {
        await collectNews();
        return { result: 'News collected' };
    } catch (e) {
        logger.error('Error collecting news', e);
        return { error: 'Error collecting news' };
    }
});

const collectNews = async () => {
    const articles = await getTopHeadlines();
    const parsedArticles = parseArticles(articles);
    await saveArticlesIfNotExists(parsedArticles);
};

const getTopHeadlines = async () : Promise<any[]> => {
    const response = await axios.get(topHeadlinesUrl);
    if (response.status !== 200) {
        logger.error('Error fetching top headlines');
        return [];
    }
    return response.data.articles;
};

const parseArticles = (articles: any[]) : Article[] => {
    return articles
        .filter(article => article['source']['name'] != '[Removed]')
        .map(article => {
            return Article.fromApiData(article);
        });
};

const saveArticlesIfNotExists = async (articles: Article[]) => {
    const db = admin.firestore();
    const articlesCollection = db.collection('articles');
    const existingArticles = await articlesCollection.get();
    const existingArticleTitles = existingArticles.docs.map(doc => doc.data().title);
    const newArticles = articles.filter(article => !existingArticleTitles.includes(article.title));
    for (const article of newArticles) {
        await articlesCollection.add(article.pojo);
    }
};
