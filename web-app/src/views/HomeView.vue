<script setup lang="ts">
</script>

<template>
  <div>
    <p class="px-2">Porter Ajeti's project for the University of Colorado's course Applications of Software Architecture for Big Data.</p>
    
    <br />
    <h3>Project Description</h3>
    <p class="px-2">In our data world where news spreads lightning fast the amount of negative news stories can be burdensome for many individuals.  Like all things in life, it’s important to find the balance of consuming the right amount of news stories to keep yourself knowledgeable while also not driving yourself crazy or into a depressed state.  The News Sentiment Analyzer will help individuals maintain their balance by gathering top news stories and analyzing the sentiment of the headline.  Whereas top media news outlets don’t provide the sentiment of articles nor allow for sorting or viewing only top headlines of a specific sentiment rating, the News Sentiment Analyzer will do exactly that.  Individuals generally or circumstantially more burdened by bad news may choose to not display the negative headlines.<br /><br />Note the sentiment analysis is not catered to any particular set of beliefs. More on this below.</p>

    <br />
    <br />
    <h3>See it in action</h3>
    <router-link class="px-2" to="/top-headlines">Top Headlines</router-link>

    <br />
    <br />
    <br />
    <h3>Project Details</h3>
    <h5 class="px-2">Technology</h5>
    <p class="px-4 mb-0">Built with <a href="https://firebase.google.com/" target="_blank">Firebase</a> for:</p>
    <ul class="px-4" style="list-style-type: none;">
      <li class="px-4">Firestore Database</li>
      <li class="px-4">Cloud Functions</li>
      <li class="px-4">Application Hosting</li>
      <li class="px-4">Production Monitoring & Analytics</li>
    </ul>
    <p class="px-4 ">This web app is built with <a href="https://v3.vuejs.org/" target="_blank">Vue 3</a>.</p>
    <p class="px-4 ">The collector and analyzer are built with <a href="https://www.typescriptlang.org/" target="_blank">Typescript</a> to run in a <a href="https://nodejs.org/en" target="_blank">Node</a> environment.</p>
    <p class="px-4 ">News headlines are retrieved from the <a href="https://newsapi.org/" target="_blank">NewsAPI</a>.</p>
    <p class="px-4 ">The sentiment analysis is powered by <a href="https://openai.com/" target="_blank">OpenAI</a>.</p>
    <p class="px-4 ">Unit and Integration tests use the <a href="https://jestjs.io/" target="_blank">Jest</a> testing library, and <a href="https://docs.github.com/en/actions" target="_blank">GitHub Actions</a> is utilized for Continuous Integration and Deployment.</p>
    <p class="px-4 ">The Firestore Database is a NoSQL style database, and this type of database was preferred over a relational database to limit the joins to other tables to gather the complete details to display a news article to the web-app user. Additional benefits of using the Firestore Database are detailed below in Event Collaboration.</p>

    <br />
    <h5 class="px-2">Structure</h5>
    <p class="px-4">The News Sentiment Analyzer consists of 3 indepent projects all working together to gather, analyze, and display top news headlines in the U.S.</p>
    <p class="px-4 mb-0">| news-sentiment-analyzer</p>
    <p class="px-4 mb-0">&emsp;&emsp;| <a href="https://github.com/porterwilcox/news-sentiment-analyzer/blob/main/data-collector/functions/src/index.ts" target="_blank">data-collector</a></p>
    <p class="px-4 mb-0">&emsp;&emsp;| <a href="https://github.com/porterwilcox/news-sentiment-analyzer/blob/main/data-analyzer/functions/src/index.ts" target="_blank">data-analyzer</a></p>
    <p class="px-4">&emsp;&emsp;| <a href="https://github.com/porterwilcox/news-sentiment-analyzer/tree/main/web-app" target="_blank">web-app</a></p>
    <p class="px-4">View the project at this GitHub <a href="https://github.com/porterwilcox/news-sentiment-analyzer" target="_blank">repository</a>.</p>
    <h6 class="px-4">Whiteboard Architecture</h6>
    <img class="px-5 mb-1" style="max-width: 95%;" src="https://github.com/porterwilcox/news-sentiment-analyzer/blob/main/web-app/src/assets/whiteboard-architecture.jpeg?raw=true" alt="Whiteboard Architecture" />

    <br />
    <br />
    <h5 class="px-2">Unit Tests</h5>
    <p class="px-4 mb-0">Unit tests are written for the data-collector, utilizing emulators to locally serve an instance of a Firestore Database against which test articles are created, then fetched to ensure data persistence.</p>
    <p class="px-4"><a href="https://github.com/porterwilcox/news-sentiment-analyzer/blob/main/data-collector/functions/__tests__/newsCollection.test.ts" target="_blank">View Unit Test</a></p>
    <h6 class="px-4">Mock Utilization</h6>
    <p class="px-5 mb-1">To practice implementing test mocks and to better confine the newsCollection unit test, a mock was created to simulate the HTTP request to the NewsAPI whereby the articles returned are all and only the test articles for the unit test.</p>
    <div class="code-block">
      <pre class="code-line">
  (axios.get as jest.Mock).mockResolvedValue({
    status: 200,
    data: {
      articles: apiTestArticles,
    },
  });
      </pre>
    </div>


    <br />
    <h5 class="px-2">Integration Tests</h5>
    <p class="px-4 mb-0">Integration tests are written for the data-analyzer, utilizing emulators to locally serve an instance of a Firestore Database and an instance of the Cloud Functions, to test the congruency between the data-collector and data-analyzer. Test articles are added to the database to initiate the onCreate Firestore Functions trigger of the analyzeArticleSentiment function. The test articles are then processed against the openai API to gather the sentiment and severity of the article. Because the articles are test articles, we declared an expected sentiment of each test article which we compare to the calculated sentiment value from the openai API.</p>
    <p class="px-4"><a href="https://github.com/porterwilcox/news-sentiment-analyzer/blob/main/data-analyzer/functions/__tests__/analyzeArticlesSentiment.test.ts" target="_blank">View Integration Test</a></p>
    <h6 class="px-4">Model "Training"</h6>
    <p class="px-5 mb-1">As mentioned above, the sentiment analyzer is not catered to any particular set of beliefs. Instead the model is provided several example prompts and responses which it consumes to process real world articles accordingly.<br /><br />This project could later be extended to allow users to agree with or change sentiment analyses such that their list of articles and sentiments could then be fed into the model to provide a catered experience for the particular user.</p>
    <div class="code-block">
      <pre class="code-line">
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
      </pre>
    </div>

    <br />
    <h5 class="px-2">Continuous Integration & Continuous Deployment</h5>
    <p class="px-4">GitHub Actions is utilized for Continuous Integration. The GitHub Actions workflow runs the unit tests for the data-collector on every commit pushed to the main branch that includes changes to any file in the data-collector directory. Continuous Deployment is then implemented when on a successful test the workflow deploys the data-collector functions to the cloud environment hosting the production instances of the functions.</p>
    <p class="px-4"><a href="https://github.com/porterwilcox/news-sentiment-analyzer/actions/runs/10051177409/job/27780334485#step:10:16" target="_blank">View CI Test Results</a></p>
    <p class="px-4"><a href="https://github.com/porterwilcox/news-sentiment-analyzer/actions/runs/10051177409/job/27780334485#step:11:61" target="_blank">View CD Deploy Results</a></p>
    <p class="px-4"><a href="https://github.com/porterwilcox/news-sentiment-analyzer/blob/main/.github/workflows/ci-cd-data-collector.yml" target="_blank">View CI/CD Config File</a></p>

    <br />
    <h5 class="px-2">Production Monitoring & Analytics</h5>
    <p class="px-4">Firebase provides a suite of tools for monitoring and analyzing the production environment. Just like Prometheus that we learned in this course for production monitoring, a Firebase web app must be configured correctly to utliize the Firebase Analytics tools. This project was configured accordingly and the analytics invocation occurrs on app start for each device that browses this website. But Firebase Analytics goes beyond Prometheus with tracking user engagement and retention. Detailled logs of crashes are also reported by this suite. Here are images of the Realtime Analytics dashboard and the Analytics Dashboard (not much data to be displayed in this view yet until more data is collected by users over time) for this project.</p>
    <img class="px-4 mb-1" style="max-width: 95%;" src="https://github.com/porterwilcox/news-sentiment-analyzer/blob/main/web-app/src/assets/realtime-analytics.png?raw=true" alt="Firebase Realtime Analytics" />
    <img class="px-4 mb-1" style="max-width: 95%;" src="https://github.com/porterwilcox/news-sentiment-analyzer/blob/main/web-app/src/assets/analytics-dashboard.png?raw=true" alt="Firebase Analytics Dashboard" />

    <br />
    <br />
    <h5 class="px-2">Event Collaboration</h5>
    <p class="px-4 mb-0">Firebase technologies allowed for seamless event collaboration between the several projects. For example, <a href="https://cloud.google.com/functions/docs/calling/cloud-firestore">Firestore triggers</a> are used in this project to notify the data-analyzer when a new news article has been recorded to the database from the data-collector. Additionally, the web-app uses an <a href="https://vuefire.vuejs.org/guide/realtime-data.html">observable</a> to the articles collection of the firestore database to immediately receive the latest database changes. With these tools as soon as the data-collector inserts a new article record, the web-app immediatelly displays that new article and the data-analyzer begins processessing it to calculate its sentiment.  Then once the sentiment is recorded to the database the article displayed on the web-app will again seamlessly update to display the sentiment of the news article.</p>

    <br />
    <br />
    <h3>Ready to see it in action</h3>
    <p class="px-2 mb-0 pb-3"><router-link to="/top-headlines">Top Headlines</router-link></p>
  </div>
</template>

<style>
.code-block {
  background-color: #2d2d2d;
  color: #f8f8f2;
  padding-top: 8px;
  border-radius: 0.25rem;
  overflow-x: auto;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 60px;
}

.code-block .code-line {
  margin: 0;
  padding: 0;
  white-space: pre;
}

@media (hover: none) and (pointer: coarse) {
  .code-block {
    margin: 0;
  }
}
</style>