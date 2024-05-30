<template>
  <div id="chart">
    <apexchart
      height="320"
      type="donut"
      :options="chartOptions2"
      :series="getSumReport2"
    ></apexchart>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { mapGetters } from "vuex";
export default {
  watch: {
    getDateReport() {
      this.chartData();
    },
  },
  components: {
    apexchart: VueApexCharts,
  },
  computed: {
    ...mapGetters([
      "getSumReport",
      "getListTargetReport",
      "getSumReport2",
      "getDateReport",
    ]),
    getSeries2() {
      let data = [
        this.getSumReport.fb,
        this.getSumReport.tw,
        this.getSumReport.pt,
        this.getSumReport.nw,
        this.getSumReport.yt,
        this.getSumReport.ig,
        this.getSumReport.bd,
        this.getSumReport.tt,
      ];
      return data;
    },
  },
  data() {
    return {
      series: [],

      chartOptions2: {
        noData: {
          text: "Loading...",
        },
        fontFamily: "Prompt",
        colors: [
          "#438afe",
          "#42c8f4",
          "#521d85",
          "#fed45c",
          "#fa675f",
          "#ffa67a",
          "#336db6",
          "#3f2e4c",
        ],
        labels: [
          "facebook",
          "twitter",
          "pantip",
          "news",
          "youtube",
          "instagram",
          "blockdit",
          "tiktok",
        ],
        chart: {
          type: "donut",
          toolbar: {
            show: true,
          },
        },
        legend: {
          position: "right",
          horizontalAlign: "right",
          offsetX: 0,
          offsetY: 0,
        },

        tooltip: {
          y: {
            formatter: function(val, opt) {
              let selected = Number(
                opt.globals.seriesPercent[opt.seriesIndex].toLocaleString()
              );
              // console.log("selected", selected);
              return selected.toFixed(2) + "% " + " : " + val + " users";
            },
          },
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  show: true,
                  label: "",
                  formatter: () => "",
                },
              },
            },
          },
        },
        // responsive: [
        //   {
        //     breakpoint: 800,
        //     options: {
        //       legend: {
        //         position: "right",
        //         horizontalAlign: "right",
        //         offsetX: 0,
        //         offsetY: 0,
        //       },
        //     },
        //   },
        // ],
      },
    };
  },
  methods: {
    chartData() {
      this.chartOptions2;
      let data = [
        this.getSumReport.fb,
        this.getSumReport.tw,
        this.getSumReport.pt,
        this.getSumReport.nw,
        this.getSumReport.yt,
        this.getSumReport.ig,
        this.getSumReport.bd,
        this.getSumReport.tt,
      ];
      this.series = data;
    },
  },
  created() {
    this.chartData();
  },
};
</script>

<style>

</style>
