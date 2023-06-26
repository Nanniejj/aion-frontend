<template>
  <div>
    <Home />
  </div>
</template>

<script>
import Home from "@/components/section/HomeSection.vue";
export default {
  components: {
    Home,
  },
  created() {
    this.$store.dispatch("fetchListIssue");
    this.$store.dispatch("fetchListDomain");
  },
};
</script>

<style></style>
