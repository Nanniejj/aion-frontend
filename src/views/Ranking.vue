<template>
  <div id="overflow-page">
    <!-- {{domain}} -->
    <HomeNav id="navHome" />
    <RankingMenu />
  </div>
</template>

<script>
import HomeNav from "@/components/HomeNav.vue";
import RankingMenu from "@/components/ranking/RankingMenu.vue";
import { mapGetters } from "vuex";
// import VueElementLoading from "vue-element-loading";

export default {
  components: {
    HomeNav,
    RankingMenu,
    // VueElementLoading,
  },
  computed: {
    ...mapGetters([
      "getSelected",
      "getSentimentStat",
      "getLoadStatus",
      "getRanking",
    ]),
  },
   destroyed(){
    // this.$store.commit("setRanking",[]);
    this.tab_selected=false
    
  }
  // beforeCreate() {
  //   this.$store.dispatch("fetchSentimentStat", {
  //     start_date: "2021-03-15",
  //     end_date: "2021-03-16",
  //     domain: "การเมือง",
  //     source: ["facebook", "twitter", "news", "pantip", "instagram", "youtube"],
  //   });
  //   this.$store.dispatch("fetchRanking", {
  //     start_date: "2021-03-15",
  //     end_date: "2021-03-16",
  //     type: "daily",
  //     domain: "การเมือง",
  //     source: ["facebook", "twitter", "news", "pantip", "instagram", "youtube"],
  //     rankingtype: "object",
  //     subdomain: this.select_subdomain,
  //   });
  // },
};
</script>
