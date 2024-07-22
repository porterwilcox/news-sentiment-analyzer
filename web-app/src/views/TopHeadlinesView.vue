<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCollection, useFirestore } from 'vuefire'
import { collection, query, where, orderBy, DocumentData } from 'firebase/firestore'
import ArticleCardCmp from '@/components/ArticleCardCmp.vue'

const db = useFirestore()

const postiveNewsQuery = query(
  collection(db, 'articles'),
  where('sentiment', '==', 'positive'),
  orderBy('severity', 'desc'),
  orderBy('publishedAt', 'desc')
)
const neutralNewsQuery = query(
  collection(db, 'articles'),
  where('sentiment', '==', 'neutral'),
  orderBy('severity', 'asc'),
  orderBy('publishedAt', 'desc')
)
const negativeNewsQuery = query(
  collection(db, 'articles'),
  where('sentiment', '==', 'negative'),
  orderBy('severity', 'asc'),
  orderBy('publishedAt', 'desc')
)

const positiveNews = useCollection(postiveNewsQuery)
const neutralNews = useCollection(neutralNewsQuery)
const negativeNews = useCollection(negativeNewsQuery)

const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)
let yesterdayMonth: string | number = yesterday.getMonth() + 1
yesterdayMonth = yesterdayMonth < 10 ? '0' + yesterdayMonth : yesterdayMonth
const date = ref(yesterday.getFullYear() + '-' + yesterdayMonth + '-' + yesterday.getDate())

const today = new Date()
let todayMonth: string | number = today.getMonth() + 1
todayMonth = todayMonth < 10 ? '0' + todayMonth : todayMonth
const todayDateString = ref(today.getFullYear() + '-' + todayMonth + '-' + today.getDate())
const articlesProcessedStartingDate = ref('2024-07-19')

const getClientLocaleDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, year: 'numeric', month: 'numeric', day: 'numeric' }
  const date = new Date(dateString)
  const localeDate = new Intl.DateTimeFormat('default', options).format(date)
  return new Date(localeDate)
}

const sentimentFilter = ref(3)  //1=All News, 2=Neutral & Positive, 3=Only Positive

const isWithinDateRange = (article: DocumentData, date: string) => {
  const publishedDate = getClientLocaleDate(article.publishedAt)
  const d = new Date(date)
  const tomorrow = new Date(d)
  tomorrow.setDate(d.getDate() + 1)
  return publishedDate >= d && publishedDate < tomorrow
}

const filteredPositiveNews = computed(() => {
  return positiveNews.value.filter(article => isWithinDateRange(article, date.value))
})
const filteredNeutralNews = computed(() => {
  if (sentimentFilter.value == 3) return [];
  return neutralNews.value.filter(article => isWithinDateRange(article, date.value))
})
const filteredNegativeNews = computed(() => {
  if (sentimentFilter.value != 1) return [];
  return negativeNews.value.filter(article => isWithinDateRange(article, date.value))
})

const articleCount = computed(() => {
  return filteredPositiveNews.value.length + filteredNeutralNews.value.length + filteredNegativeNews.value.length
})

onMounted(() => {
  const articlesContainer = document.getElementById('articles');
  if (!articlesContainer) return;
  articlesContainer.style.maxHeight = window.innerHeight - articlesContainer.getBoundingClientRect().top + 'px';
})
</script>

<template>
  <h3>Top Headlines <span class="font-small">Processed 7am, 12pm, & 5pm MTN</span></h3>
  <p class="font-small m-0">This project began processing news headlines on 7/19/2024</p>
  <div class="row">
    <div class="col-12 col-md-8">
      <hr/>

      <div class="row g-0">
        <div class="col-4">
          <button class="btn btn-all-news w-100" :class="sentimentFilter == 1 ? 'btn-danger' : 'btn-outline-danger'" @click="sentimentFilter = 1">All News</button>
        </div>
        <div class="col-4">
          <button class="btn btn-neutral-positive-news w-100" :class="sentimentFilter == 2 ? 'btn-warning' : 'btn-outline-warning'" @click="sentimentFilter = 2">>= Neutral</button>
        </div>
        <div class="col-4">
          <button class="btn btn-positive-news w-100" :class="sentimentFilter == 3 ? 'btn-success' : 'btn-outline-success'" @click="sentimentFilter = 3">Positive News</button>
        </div>
      </div>
      
      <div class="d-flex flex-row justify-content-between align-items-end my-3">
        <div class="d-flex align-items-end">
          <label for="date" class="me-2">Published Date:</label>
          <input type="date" id="date" v-model="date" :min="articlesProcessedStartingDate" :max="todayDateString" />
        </div>
        <div>
          <p class="mb-0">{{ articleCount }} Article{{ articleCount != 1 ? 's' : '' }}</p>
        </div>
      </div>

    </div>
  </div>
  
  <div class="row overflow-auto" id="articles">
    <ArticleCardCmp v-for="article in filteredPositiveNews" :article="article" :key="article.id" class="col-12" />
    <ArticleCardCmp v-for="article in filteredNeutralNews" :article="article" :key="article.id" class="col-12" />
    <ArticleCardCmp v-for="article in filteredNegativeNews" :article="article" :key="article.id" class="col-12" />

    <div v-if="!articleCount" class="my-5 py-5 text-center">
      <h4>No articles found for the selected date and sentiment filter</h4>
      <p v-if="date == todayDateString">The <a href="https://newsapi.org/" target="_blank">NewsAPI</a> likely hasn't returned any articles published today, yet.</p>
    </div>
  </div>
</template>

<style>
.font-small {
  font-size: small;
}
</style>
