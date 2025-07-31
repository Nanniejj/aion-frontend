<template>
  <div id="overflow-page">
    <HomeNav id="navHome"  />
    <div id="content">
        <InfluencerMain />
    </div>
  </div>
</template>

<script>
import HomeNav from "@/components/HomeNav.vue";
// import TopInfluencer from "../components/influencer/TopInfluencer.vue";
import InfluencerMain from "../components/influencerHub/InfluencerMain.vue";
// import { mapGetters } from "vuex";

export default {
  components: {
    HomeNav,
    InfluencerMain,
  },
//   computed: {
//     ...mapGetters(["getLoadStatus","getSelected","getTopInfluencer", "getDataTopInfluencer","getLinkTopInfluencer","getLinksDataTopInfluencer", "getToSection"]),
//   },

};
</script>
