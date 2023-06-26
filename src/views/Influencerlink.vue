<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
    <!-- <vue-element-loading
      :active="getLoadStatus"
      :is-full-screen="true"
      size="80"
      background-color="rgba(0, 0, 0, 0.3)"
      color="#fff"
      spinner="bar-fade-scale"
    /> -->
    <InfluencerLink v-if="getRoleMion"  />
  </div>
</template>

<script>
import HomeNav from "@/components/HomeNavMion.vue";
import InfluencerLink from '../components/influencer/InfluencerLink.vue';
import { mapGetters } from "vuex";

export default {
  components: {
    HomeNav,
    InfluencerLink
  },
  computed: {
    ...mapGetters(["getLoadStatus","getRoleMion"]),
  }
}
</script>
