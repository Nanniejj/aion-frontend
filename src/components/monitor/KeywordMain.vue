<template>
  <div>
    <div class="mb-4">
    <h1 class="title">Keyword</h1>
    <h4 class="title-monitor mb-">
      <router-link :to="{ name: 'Monitor' }">Monitor </router-link>
      <i class="fas fa-angle-right" /><span id="active">Keyword </span>
    </h4></div>
    <KeywordPost class="mt-2" />
  </div>
</template>
<script>
import KeywordPost from "./KeywordPost.vue";
export default {
  components: {
    KeywordPost,
  },
  destroyed() {
    localStorage.removeItem("keywordName")
  },
};
</script>
<style>
#active {
  font-weight: 800;
  margin-left: 10px;
}
.title-monitor a {
  cursor: pointer;
  color: #2c3e50;
}
.title-monitor {
  text-align: start;
  margin-left: 9%;
  margin-bottom: 20px !important;
}
.title {
  margin-left: 9%;
}
</style>
