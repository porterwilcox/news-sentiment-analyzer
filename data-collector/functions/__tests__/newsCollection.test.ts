import * as admin from 'firebase-admin';
import { test } from '../testSetup';
import * as functions from '../src/index';
import axios from 'axios';

const apiTestArticles = [
    {
        source: { name: 'Test Source' },
        title: 'Test Title',
        url: 'example.com',
        urlToImage: 'example.com/image.jpg',
        publishedAt: '2024-07-19T00:00:00Z',
        sentiment: 'positive',
    }, {
        source: { name: 'Test Source 2' },
        title: 'Test Title 2',
        url: 'example.com/2',
        urlToImage: 'example.com/image2.jpg',
        publishedAt: '2024-07-19T00:00:00Z',
        sentiment: 'negative',
    }, {
        source: { name: '[Removed]' },
    },
];
jest.mock('axios');

describe('newsCollection', () => {
  const db = admin.firestore();

  beforeAll(async () => {
    await db.collection('articles').get().then(snapshot => {
      const batch = db.batch();
      snapshot.forEach(doc => batch.delete(doc.ref));
      return batch.commit();
    });
  });

  afterAll(async () => {
    await test.cleanup();
  });

  it('should fetch articles from NewsAPI, and save new articles to firebase emulator', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
        status: 200,
        data: {
          articles: apiTestArticles,
        },
      });

    const res = await test.wrap(functions.requestNewsCollection)({});
    expect(res).toEqual({ result: 'News collected' });

    const articlesSnapshot = await db.collection('articles').get();
    expect(articlesSnapshot.size).toBe(2);

    const articles = [articlesSnapshot.docs[0].data(), articlesSnapshot.docs[1].data()];
    const titles = articles.map(article => article.title);
    expect(titles).toContain(apiTestArticles[0].title);
    expect(titles).toContain(apiTestArticles[1].title);
  });
});
