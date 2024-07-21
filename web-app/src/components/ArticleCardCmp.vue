<script setup lang="ts">
defineProps<{ article: object; }>()

const calculatePositivePosition = (severity: number) => {
  let percentage = '67';
  switch(severity) {
    case 0: 
      percentage = '67';
      break;
    case 0.1: 
      percentage = '69';
      break;
    case 0.2: 
      percentage = '71';
      break;
    case 0.3: 
      percentage = '73';
      break;
    case 0.4: 
      percentage = '75';
      break;
    case 0.5: 
      percentage = '78';
      break;
    case 0.6: 
      percentage = '80';
      break;
    case 0.7: 
      percentage = '82';
      break;
    case 0.8: 
      percentage = '85';
      break;
    case 0.9: 
      percentage = '87';
      break;
    case 1: 
      percentage = '90';
      break;
  }
  return percentage;
}

const calculateNuetralPosition = (severity: number) => {
  let percentage = '58';
  switch(severity) {
    case 0: 
      percentage = '58';
      break;
    case 0.1: 
      percentage = '55';
      break;
    case 0.2: 
      percentage = '52';
      break;
    case 0.3: 
      percentage = '49';
      break;
    case 0.4: 
      percentage = '46';
      break;
    case 0.5: 
      percentage = '44';
      break;
    case 0.6: 
      percentage = '42';
      break;
    case 0.7: 
      percentage = '40';
      break;
    case 0.8: 
      percentage = '37';
      break;
    case 0.9: 
      percentage = '35';
      break;
    case 1: 
      percentage = '33';
      break;
  }
  return percentage;
}

const calculateNegativePosition = (severity: number) => {
  let percentage = '24';
  switch(severity) {
    case 0: 
      percentage = '24';
      break;
    case 0.1: 
      percentage = '22';
      break;
    case 0.2: 
      percentage = '20';
      break;
    case 0.3: 
      percentage = '18';
      break;
    case 0.4: 
      percentage = '16';
      break;
    case 0.5: 
      percentage = '14';
      break;
    case 0.6: 
      percentage = '12';
      break;
    case 0.7: 
      percentage = '9';
      break;
    case 0.8: 
      percentage = '6';
      break;
    case 0.9: 
      percentage = '3';
      break;
    case 1: 
      percentage = '0';
      break;
  }
  return percentage;
}
</script>

<template>
  <div>
    <div class="card mb-3 mx-1 bg-secondary">
      <!-- <img v-if="article.urlToImage" :src="article.urlToImage" alt="Article Image" class="article-image" /> -->
      <div class="article-content">
          <h2 class="article-title mb-0">{{ article.title }}</h2>
          <div class="me-2">
            <p class="article-source text-end mb-0">- {{ article.source }}</p>
            <p class="article-date text-end">{{ new Date(article.publishedAt).toLocaleTimeString() + ' ' + new Date(article.publishedAt).toLocaleDateString() }}</p>
          </div>
          <div class="w-100 d-flex align-items-center sentiment-container position-relative">
            <i v-if="article.sentiment == 'positive'" class="fa-2x fa-regular fa-face-smile position-absolute" :style="`left: ${calculatePositivePosition(article.severity)}%`"></i>
            <i v-if="article.sentiment == 'neutral'" class="fa-2x fa-regular fa-face-meh position-absolute" :style="`left: ${calculateNuetralPosition(article.severity)}%`"></i>
            <i v-if="article.sentiment == 'negative'" class="fa-2x fa-regular fa-face-frown position-absolute" :style="`left: ${calculateNegativePosition(article.severity)}%`"></i>
          </div>
          <a :href="article.url" target="_blank" :class="article.sentiment"><b>Read more</b></a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sentiment-container {
  background: linear-gradient(to right, rgb(134, 1, 1) 33.33%, rgb(170, 170, 7) 33.33%, yellow 66.66%, green 66.66%);
  min-height: 40px;
}
.positive {
  color: darkgreen;
}
.neutral {
  color: rgb(170, 170, 7);
}
.negative {
  color: rgb(134, 1, 1);
}
</style>