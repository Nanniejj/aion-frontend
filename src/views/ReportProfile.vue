<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
    <div id="content" v-if="getRoleMion">
      <h1 class="title">Report</h1>
      <h4 class="title-monitor">
        <span style="cursor: pointer"
          ><router-link to="/report">Target Tracking </router-link>
        </span>
        <i class="fas fa-angle-right" /><span id="active"> Profile </span>
      </h4>
      <StatProfileReport />
      <ListDomainReport class="mt-3" />
      <b-container><AllPostReport /></b-container>
    </div>
  </div>
</template>

<script>
import HomeNav from "@/components/HomeNavMion.vue";
import StatProfileReport from "@/components/report/StatProfileReport.vue";
import ListDomainReport from "@/components/report/ListDomainReport.vue";
import AllPostReport from "@/components/report/AllPostReport.vue";

import { mapGetters } from "vuex";
export default {
  components: {
    HomeNav,
    StatProfileReport,
    ListDomainReport,
    AllPostReport,
  },
  data: function () {
    return {};
  },
  computed: {
    ...mapGetters(["getLoadStatus", "getRoleMion", "getDateReport"]),
  },
  methods: {},

  created() {
    let date = localStorage.getItem("dateReport").split(",");
    this.$store.dispatch("fetchStatReport", {
      start: date[0],
      end: date[1],
      account_name: localStorage.getItem("uidReport"),
      source: localStorage.getItem("sourceReport"),
    });
  },
  destroyed() {
    localStorage.removeItem("uidReport");
    localStorage.removeItem("sourceReport");
    localStorage.removeItem("dateReport");
  },
};
</script>

<style scoped>
.title-monitor a {
  cursor: pointer;
  color: #2c3e50;
}
.title-monitor {
  text-align: start;
  margin-left: 9%;
  margin-bottom: 10px !important;
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
  .title-monitor {
    font-size: medium;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
}
</style>
