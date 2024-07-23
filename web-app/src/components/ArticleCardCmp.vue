<script setup lang="ts">
import { DocumentData } from 'firebase/firestore';

defineProps<{ article: DocumentData; }>()

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
      percentage = '74';
      break;
    case 0.4: 
      percentage = '77';
      break;
    case 0.5: 
      percentage = '80';
      break;
    case 0.6: 
      percentage = '83';
      break;
    case 0.7: 
      percentage = '86';
      break;
    case 0.8: 
      percentage = '89';
      break;
    case 0.9: 
      percentage = '92';
      break;
    case 1: 
      percentage = '95';
      break;
  }
  return percentage;
}

const calculateNuetralPosition = (severity: number) => {
  let percentage = '61';
  switch(severity) {
    case 0: 
      percentage = '61';
      break;
    case 0.1: 
      percentage = '59';
      break;
    case 0.2: 
      percentage = '57';
      break;
    case 0.3: 
      percentage = '55';
      break;
    case 0.4: 
      percentage = '52';
      break;
    case 0.5: 
      percentage = '49';
      break;
    case 0.6: 
      percentage = '46';
      break;
    case 0.7: 
      percentage = '43';
      break;
    case 0.8: 
      percentage = '40';
      break;
    case 0.9: 
      percentage = '37';
      break;
    case 1: 
      percentage = '34';
      break;
  }
  return percentage;
}

const calculateNegativePosition = (severity: number) => {
  let percentage = '28';
  switch(severity) {
    case 0: 
      percentage = '28';
      break;
    case 0.1: 
      percentage = '26';
      break;
    case 0.2: 
      percentage = '24';
      break;
    case 0.3: 
      percentage = '21';
      break;
    case 0.4: 
      percentage = '18';
      break;
    case 0.5: 
      percentage = '15';
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

const getLocalePublishedTime = (publishedAtDateString: string) => {
  const options: Intl.DateTimeFormatOptions = { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, /*year: 'numeric', month: 'numeric', day: 'numeric',*/ hour: 'numeric', minute: 'numeric' }
  const date = new Date(publishedAtDateString)
  return new Intl.DateTimeFormat('default', options).format(date)
}
</script>

<template>
  <div>
    <div class="card mb-4 mb-md-5 mx-1 bg-dark text-white" :class="article.sentiment + '-card'">
      <!-- <img v-if="article.urlToImage" :src="article.urlToImage" alt="Article Image" class="article-image" /> -->
      <div class="article-content">
          <h3 class="article-title mx-1 mb-0">{{ article.title }}</h3>
          <div class="mx-2">
            <p class="article-source text-end mb-0">- {{ article.source }}</p>
            <div class="d-flex justify-content-between">
              <a :href="article.url" target="_blank" :class="article.sentiment + '-link'"><b>Read more</b></a>
              <p class="article-date">{{ getLocalePublishedTime(article.publishedAt) }}</p>
            </div>
          </div>
          <div class="w-100 d-flex align-items-center sentiment-container position-relative">
            <i v-if="article.sentiment == 'positive'" class="fa-lg fa-regular fa-face-smile position-absolute text-black" :style="`left: ${calculatePositivePosition(article.severity)}%`"></i>
            <i v-if="article.sentiment == 'neutral'" class="fa-lg fa-regular fa-face-meh position-absolute text-black" :style="`left: ${calculateNuetralPosition(article.severity)}%`"></i>
            <i v-if="article.sentiment == 'negative'" class="fa-lg fa-regular fa-face-frown position-absolute text-black" :style="`left: ${calculateNegativePosition(article.severity)}%`"></i>
          </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: var(--bs-secondary-border-subtle);
  border: none;
  border-radius: 0;
}

.positive-card {
  border: 2px solid var(--bs-success);
  border-bottom: none;
  border-left: none;
}
.neutral-card {
  border-top: 2px solid var(--bs-warning);
}
.negative-card {
  border: 2px solid var(--bs-danger);
  border-bottom: none;
  border-right: none;

}

.positive-link {
  color: var(--bs-success);
}
.neutral-link {
  color: var(--bs-warning);
}
.negative-link {
  color: var(--bs-danger);
}

.sentiment-container {
  background: linear-gradient(to right, var(--bs-danger) 33.33%, var(--bs-warning) 33.33%, var(--bs-warning) 66.66%, var(--bs-success) 66.66%);
  min-height: 20px;
}
</style>