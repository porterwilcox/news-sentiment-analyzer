import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import OpenAI from "openai";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { ChatCompletionTool } from "openai/resources";


if (!admin.apps.length) {
    admin.initializeApp();
}

const openai = new OpenAI({
    organization: functions.config().openai.organizationid,
    project: functions.config().openai.projectid,
    apiKey: functions.config().openai.apikey,
});

const sentimentAnalyzerTool: ChatCompletionTool = {
    type: 'function',
    function: {
        name: 'sentiment-analysis',
        description: "Analyze the sentiment of the following news article headline. Consider the emotion conveyed by the language used. Indicate the sentiment of the headline.",
        parameters: {
            type: 'object',
            properties: {
                sentiment: {
                    type: 'string',
                    enum: ['positive', 'negative', 'neutral']
                },
                severity: {
                    type: 'number',
                    description: 'A number between 0 and 1 indicating the severity of the sentiment. Strongly positive or negative sentiment should have a higher severity. Generally life and death events, etc. should have a higher severity. Generally entermaintment, etc. should have a lower severity.',
                }
            },
            required: ['sentiment', 'severity']
        }
    }
};


export const anazlyzeArticlesSentiment = onDocumentCreated('articles/{articleId}', async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        return;
    }

    const article = snapshot.data();
    if (!article) {
        return;
    }

    await analyzeSentiment(article);
});


const analyzeSentiment = async (article: any) => {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [
            // { 
            //     role: 'system', 
            //     content: 'As an AI with expertise in language and emotion analysis, your task is to analyze the sentiment of the following news article headline. Please consider the emotion conveyed by the language used. Indicate the sentiment of the headline in one word, either positive, negative, or neutral.' 
            // },
            { 
                role: 'user', 
                content: article.title 
            },
        ],
        tools: [sentimentAnalyzerTool],
    });

    console.log(JSON.stringify(response));
    //@ts-ignore
    const args : { sentiment: string, severity: string } = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments);
    logger.info(`Sentiment of article ${article.title}: ${args.sentiment}, severity: ${args.severity}`);
    console.log(`Sentiment of article ${article.title}: ${args.sentiment}, severity: ${args.severity}`);
};