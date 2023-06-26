<template>
  <div>
    <div class="title-report h4">Target Tracking</div>
    <b-container fluid class="width-box">
      <DateReport />
      <!-- <ColChart /> -->
      <SumReport :tabsMonitor="'tabProfile'" class="px-lg-5" />
      <TableReport />
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SumReport from "@/components/report/SumReport.vue";
// import ColChart from "@/components/chart/DomainColumnChart.vue";

import TableReport from "@/components/report/TableReport.vue";
import DateReport from "@/components/report/DateReport.vue";
export default {
  components: {
    SumReport,
    TableReport,
    DateReport,
    // ColChart
  },
  computed: {
    ...mapGetters(["getSocialMo"]),
  },
  async created() {
  //   if (this.getSocialMo == "") {
  //     await this.$store.dispatch("fatchListMonitor");
  //   } else {
  //     await this.$store.dispatch("fatchListMonitor", {
  //       source: this.social,
  //     });
  //   }
 },
};
</script>

<style scoped>
.width-box {
  width: 90%;
}
.title-report {
  text-align: start;
  margin-left: 9%;
  margin-bottom: 20px !important;
}
@media only screen and (min-width: 0px) and (max-width: 1200px) {
  .width-box {
    width: 100%;
  }
}
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .title-report{
    font-size: medium;
    margin-bottom:5px !important;
}
}
</style>
