<template>
  <div id="overflow-page">
    <HomeNav id="navHome"  />
    <TopInfluencer v-if="getToSection=='toAion'"/>
  </div>
</template>

<script>
import HomeNav from "@/components/HomeNav.vue";
import TopInfluencer from "../components/influencer/TopInfluencer.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    HomeNav,
    TopInfluencer,
  },
  computed: {
    ...mapGetters(["getLoadStatus","getSelected","getTopInfluencer", "getDataTopInfluencer","getLinkTopInfluencer","getLinksDataTopInfluencer", "getToSection"]),
  },

};
</script>
