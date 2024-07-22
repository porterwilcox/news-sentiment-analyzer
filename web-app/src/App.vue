<template>
  <div class="container-fluid bg-dark text-white h100">
    <h1>
      <router-link to="/"><i class="fa-solid fa-newspaper text-white"></i></router-link> 
      News Sentiment Analyzer
    </h1>
    <hr />
    <router-view />
  </div>
</template>

<style>
.h100 {
  min-height: 100vh;
}
</style>
