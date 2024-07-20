import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import OpenAI from "openai";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { ChatCompletionMessageParam, ChatCompletionTool } from "openai/resources";
import { ArticleSentimentAnalysis } from "../../../models/ArticleSentimentAnalysis";


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
                    enum: ['positive', 'negative', 'neutral'],
                },
                severity: {
                    type: 'number',
                    description: 'A number between 0 and 1 indicating the severity of the sentiment. Strongly positive or negative sentiment should have a higher severity. Generally life and death events, etc. should have a higher severity. Generally entermaintment, etc. should have a lower severity.',
                },
            },
            required: ['sentiment', 'severity'],
        },
    },
};

const exampleMessages: ChatCompletionMessageParam[] = [
    {
        role: 'user',
        content: 'Stock market crashes due to unexpected inflation rise',
    },
    {
        role: 'assistant',
        content: JSON.stringify({
            sentiment: 'negative',
            severity: 0.5,
        }),
    },
    {
        role: 'user',
        content: 'Worst apartment fire in over a decade - more than 13 killed and over 70 injured',
    },
    {
        role: 'assistant',
        content: JSON.stringify({
            sentiment: 'negative',
            severity: 1,
        }),
    },
    {
        role: 'user',
        content: 'New study shows chocolate improves brain function',
    },
    {
        role: 'assistant',
        content: JSON.stringify({
            sentiment: 'positive',
            severity: 0.3,
        }),
    },
    {
        role: 'user',
        content: 'Survivors of airplane crash rescued after 3 days in the wilderness',
    },
    {
        role: 'assistant',
        content: JSON.stringify({
            sentiment: 'positive',
            severity: 1,
        }),
    },
    {
        role: 'user',
        content: 'What happens next if Biden drops out of the presidential race',
    },
    {
        role: 'assistant',
        content: JSON.stringify({
            sentiment: 'nuetral',
            severity: .5,
        }),
    },
];


export const anazlyzeArticlesSentiment = onDocumentCreated('articles/{articleId}', async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        return;
    }

    const article = snapshot.data();
    if (!article) {
        return;
    }

    const analysis = await analyzeSentiment(article);
    if (!analysis) {
        logger.error('Error analyzing article sentiment');
        return;
    }

    const writeResult = await updateArticle(snapshot.ref, analysis);
    if (writeResult.writeTime) {
        logger.info('Article sentiment analysis complete');
    } else {
        logger.error('Error updating article sentiment');
    }
});


const analyzeSentiment = async (article: any) : Promise<ArticleSentimentAnalysis | null> => {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [
            ...exampleMessages,
            {
                role: 'user',
                content: article.title,
            },
        ],
        tools: [sentimentAnalyzerTool],
    });

    let args : ArticleSentimentAnalysis | null = null;
    if (response.choices[0].message.tool_calls?.length) {
        args = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments);
    }

    return args;
};

const updateArticle = async (ref: FirebaseFirestore.DocumentReference, analysis: ArticleSentimentAnalysis) => {
    return await ref.update({
        sentiment: analysis.sentiment,
        severity: analysis.severity,
    });
};
