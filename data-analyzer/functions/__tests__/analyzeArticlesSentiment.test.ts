import * as admin from 'firebase-admin';
import { test } from '../testSetup';

const testArticles = [
    {
        title: 'Missing Hikers Found Healthy and Safe, Returned Home to their Families',
        expectedSentiment: 'positive',
    }, {
        title: 'Sawtooth National Forest Fire Burns 2,000 Acres, Still Not Contained',
        expectedSentiment: 'negative',
    }, {
        title: 'Local Library Announces New Hours',
        expectedSentiment: 'neutral',
    },
];

describe('analyzeArticlesSentiment', () => {
  const db = admin.firestore();

  beforeAll(async () => {
    const articles = await db.collection('articles').get();
    const batch = db.batch();
    articles.forEach(doc => {
      if (testArticles.some(article => article.title === doc.data().title)) {
        batch.delete(doc.ref);
      }
    });
    await batch.commit();
  });

  afterAll(async () => {
    await test.cleanup();
  });

  it('should analyze sentiment and update the article document', async () => {
    for (const article of testArticles) {
      const docRef = await db.collection('articles').add(article);

      // wait for 5 seconds to allow the onDocumentCreated function to complete
        await new Promise(resolve => setTimeout(resolve, 5000));

        const updatedDoc = await docRef.get();
        const data = updatedDoc.data();

        if (!data) {
            throw new Error('Document not found');
        }

        console.log(JSON.stringify(data));

        expect(data).toHaveProperty('sentiment');
        expect(data).toHaveProperty('severity');
        expect(data.sentiment).toEqual(article.expectedSentiment);
    }
  }, 1000 * 30);
});
