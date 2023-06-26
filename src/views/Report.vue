<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
    <div id="content" v-if="getRoleMion">
      <h1 class="title">Report</h1>
      <ReportStat />
    </div>
  </div>
</template>

<script>
import HomeNav from "@/components/HomeNavMion.vue";
import ReportStat from "@/components/report/ReportStat.vue";
import moment from "moment";

import { mapGetters } from "vuex";
export default {
  components: {
    HomeNav,
    ReportStat,
  },
  watch: {
    getDateReport() {
      this.$store.dispatch("fetchListTargetReport", {
        start: this.getDateReport[0],
        end: this.getDateReport[1],
      });
    },
  },
  data: function() {
    return {};
  },
  computed: {
    ...mapGetters(["getLoadStatus", "getRoleMion", "getDateReport"]),
  },
  methods: {},

  created() {
    let sdate =
      moment(new Date())
        .format()
        .slice(0, 10) + "T00:00:00";
    let edate =
      moment(new Date())
        .format()
        .slice(0, 10) + "T23:59:59";
    this.$store.dispatch("fetchListTargetReport", { start: sdate, end: edate });
  },
};
</script>

<style scoped>
.title-monitor {
  text-align: start;
  margin-left: 9%;
  margin-bottom: 20px !important;
}
.imgsocial {
  width: 40px;
}
* {
  font-family: "Prompt", "FontAwesome", sans-serif;
}
#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
  overflow: auto;
}
#navHome {
  z-index: 1;
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  #overflow-page {
    overflow: hidden;
  }
}
@media only screen and (min-width: 950px) and (max-width: 1150px) {
  .date {
    margin-top: 20pt;
    margin-left: 11.5rem;
    margin-bottom: 10pt;
  }
}
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .title {
    margin-bottom: 0px; 
  }
  
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
}
</style>
