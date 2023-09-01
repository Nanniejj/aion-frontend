<template>
<div id="overflow-page">
    <HomeNav id="navHome" />
    <div id="content">
    <KeywordMain />
    </div>
  </div>
</template>
<script>
import HomeNav from "@/components/HomeNav.vue";
import KeywordMain from "../components/monitor/KeywordMain.vue";
export default {
  components: {
    KeywordMain,HomeNav
  },
};
</script>
<style scoped>
#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
}
</style>
