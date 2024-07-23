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
    <p class="px-4 ">Unit and Integration tests use the <a href="https://jestjs.io/" target="_blank">Jest</a> testing library, and <a href="https://docs.github.com/en/actions" target="_blank">GitHub Actions</a> is utilized for Continuous Integration.</p>

    <br />
    <h5 class="px-2">Structure</h5>
    <p class="px-4">The News Sentiment Analyzer consists of 3 indepent projects all working together to gather, analyze, and display top news headlines in the U.S.</p>
    <p class="px-4 mb-0">| news-sentiment-analyzer</p>
    <p class="px-4 mb-0">&emsp;&emsp;| <a href="https://github.com/porterwilcox/news-sentiment-analyzer/blob/main/data-collector/functions/src/index.ts" target="_blank">data-collector</a></p>
    <p class="px-4 mb-0">&emsp;&emsp;| <a href="https://github.com/porterwilcox/news-sentiment-analyzer/blob/main/data-analyzer/functions/src/index.ts" target="_blank">data-analyzer</a></p>
    <p class="px-4">&emsp;&emsp;| <a href="https://github.com/porterwilcox/news-sentiment-analyzer/tree/main/web-app" target="_blank">web-app</a></p>
    <p class="px-4">View the project at this GitHub <a href="https://github.com/porterwilcox/news-sentiment-analyzer" target="_blank">repository</a>.</p>

    <br />
    <h5 class="px-2">Unit Tests</h5>
    <p class="px-4 mb-0">Unit tests are written for the data-collector, utilizing emulators to locally serve an instance of a Firestore Database against which test articles are created, then fetched to ensure data persistence.</p>
    <p class="px-4"><a href="https://github.com/porterwilcox/news-sentiment-analyzer/blob/main/data-collector/functions/__tests__/newsCollection.test.ts" target="_blank">View Unit Test</a></p>
    <h6 class="px-4">Mock Utilization</h6>
    <p class="px-5">To practice implementing test mocks and to better confine the newsCollection unit test, a mock was created to simulate the HTTP request to the NewsAPI whereby the articles returned are all and only the test articles for the unit test.</p>


    <br />
    <h5 class="px-2">Integration Tests</h5>
    <p class="px-4 mb-0">Integration tests are written for the data-analyzer, utilizing emulators to locally serve an instance of a Firestore Database and an instance of the Cloud Functions. In this integration test, test articles are added to the database to initiate the onCreate Firestore Functions trigger of the analyzeArticleSentiment function.  The test articles are then processed against the openai API to gather the sentiment and severity of the article.  Because the articles are test articles, we declared an expected sentiment of each test article which we compare to the calculated sentiment value from the openai API.</p>
  </div>
</template>