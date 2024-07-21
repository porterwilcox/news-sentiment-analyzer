<script setup lang="ts">
import { onMounted } from 'vue'
import { useCollection, useFirestore } from 'vuefire'
import { collection, query, where, orderBy } from 'firebase/firestore'
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
</script>

<template>
  <div>
    <h1>News Sentiment Analyzer</h1>
    <hr />
    <h3>Top Headlines <span class="font-small">Processed 7am, 12pm, & 5pm MTN</span></h3>
    
    <div class="row card-columns" data-masonry='{"percentPosition": true }'>
        <ArticleCardCmp v-for="article in positiveNews" :article="article" :key="article.id" class="col-12 col-md-6 col-xl-4" />
        <ArticleCardCmp v-for="article in neutralNews" :article="article" :key="article.id" class="col-12 col-md-6 col-xl-4" />
        <ArticleCardCmp v-for="article in negativeNews" :article="article" :key="article.id" class="col-12 col-md-6 col-xl-4" />
    </div>    
  </div>
</template>

<style>
.font-small {
  font-size: small;
}
</style>