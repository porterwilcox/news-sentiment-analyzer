<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCollection, useFirestore } from 'vuefire'
import { collection, query, where, orderBy, DocumentData } from 'firebase/firestore'
import ArticleCardCmp from '@/components/ArticleCardCmp.vue'

const db = useFirestore()

const today = new Date()
let todayMonth: string | number = today.getMonth() + 1
todayMonth = todayMonth < 10 ? '0' + todayMonth : todayMonth
let todayDate: string | number = today.getDate()
todayDate = todayDate < 10 ? '0' + todayDate : todayDate
const todayDateString = ref(today.getFullYear() + '-' + todayMonth + '-' + todayDate)
const articlesProcessedStartingDate = ref('2024-07-20')
const selectedDate = ref(today.getFullYear() + '-' + todayMonth + '-' + todayDate)
const getStartAndEndOfDay = (dateString: string) => {
  const date = new Date(dateString);
  const start = new Date(date.setHours(0, 0, 0, 0)).toISOString();
  const end = new Date(date.setHours(23, 59, 59, 999)).toISOString();
  return { start, end };
};

let positiveNews = ref([])
let neutralNews = ref([])
let negativeNews = ref([])

watch(selectedDate, (newDate) => {
  const { start, end } = getStartAndEndOfDay(newDate);

  const postiveNewsQuery = query(
    collection(db, 'articles'),
    where('sentiment', '==', 'positive'),
    where('publishedAt', '>=', start),
    where('publishedAt', '<=', end),
    orderBy('severity', 'desc'),
    orderBy('publishedAt', 'desc')
  );
  positiveNews = useCollection(postiveNewsQuery);

  const neutralNewsQuery = query(
    collection(db, 'articles'),
    where('sentiment', '==', 'neutral'),
    where('publishedAt', '>=', start),
    where('publishedAt', '<=', end),
    orderBy('severity', 'asc'),
    orderBy('publishedAt', 'desc')
  );
  neutralNews = useCollection(neutralNewsQuery);

  const negativeNewsQuery = query(
    collection(db, 'articles'),
    where('sentiment', '==', 'negative'),
    where('publishedAt', '>=', start),
    where('publishedAt', '<=', end),
    orderBy('severity', 'asc'),
    orderBy('publishedAt', 'desc')
  );
  negativeNews = useCollection(negativeNewsQuery);
}, { immediate: true });

const sentimentFilter = ref(3)  //1=All News, 2=Neutral & Positive, 3=Only Positive

const isWithinDateRange = (article: DocumentData, date: string) => {
  const publishedDate = new Date(article.publishedAt);

  const localDate = new Date(date);
  const startOfDay = new Date(localDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(localDate.setHours(23, 59, 59, 999));

  const publishedLocalDate = new Date(publishedDate.toLocaleString("en-US", { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));

  return publishedLocalDate >= startOfDay && publishedLocalDate <= endOfDay;
};

const filteredPositiveNews = computed(() => {
  return positiveNews.value.filter(article => isWithinDateRange(article, selectedDate.value))
})
const filteredNeutralNews = computed(() => {
  if (sentimentFilter.value == 3) return [];
  return neutralNews.value.filter(article => isWithinDateRange(article, selectedDate.value))
})
const filteredNegativeNews = computed(() => {
  if (sentimentFilter.value != 1) return [];
  return negativeNews.value.filter(article => isWithinDateRange(article, selectedDate.value))
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
  <h3>Top Headlines <span class="font-small">Every 4 hours from 4am-8pm MTN</span></h3>
  <p class="font-small m-0">This project began processing news headlines on 7/20/2024</p>
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
          <input type="date" id="date" v-model="selectedDate" :min="articlesProcessedStartingDate" :max="todayDateString" />
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
      <p v-if="selectedDate == todayDateString">The <a href="https://newsapi.org/" target="_blank">NewsAPI</a> likely hasn't returned any articles published today, yet.</p>
    </div>
  </div>
</template>

<style>
.font-small {
  font-size: small;
}
</style>
