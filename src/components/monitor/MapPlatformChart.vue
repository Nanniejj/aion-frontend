<template>
  <div id="chart">
    <apexchart
      height="420"
      type="donut"
      :options="chartOptions2"
      :series="getSeries2"
    ></apexchart>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { mapGetters } from "vuex";
export default {
  watch: {
    // getDateReport() {
    //   this.chartData();
    // },
  },
  components: {
    apexchart: VueApexCharts,
  },
  computed: {
    ...mapGetters([
      "getMapStatic",
    ]),
    getSeries2() {
      let data = [
        this.getMapStatic.static.facebook_count??0,
        this.getMapStatic.static.twitter_count??0,
        this.getMapStatic.static.pantip_count??0,
        this.getMapStatic.static.news_count??0,
        this.getMapStatic.static.youtube_count??0,
        this.getMapStatic.static.instagram_count??0,
        this.getMapStatic.static.blockdit_count??0,
        this.getMapStatic.static.tiktok_count??0,
        this.getMapStatic.static.threads_count??0,
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
          "#f3b557",
          "#ff4c42",
          "#ff722c",
          "#336db6",
          "#3f2e4c",
          "#e75aa1"
        ],
        labels: [
          "facebook",
          "twitter",
          "board",
          "news",
          "youtube",
          "instagram",
          "blockdit",
          "tiktok",
          "threads"
        ],
        chart: {
          type: "donut",
          fontFamily: "Prompt, FontAwesome, sans-serif",
          toolbar: {
            show: true,
          },
        },
        legend: {
          fontSize: "15px",
          position: "bottom",
          horizontalAlign: "bottom",
          offsetX: 0,
          offsetY: 5,
          formatter: function(seriesName, opts) {
            return [seriesName, " - ", opts.w.globals.series[opts.seriesIndex]];
          },
          
        },

        tooltip: {
          y: {
            formatter: function(val, opt) {
              let selected = Number(
                opt.globals.seriesPercent[opt.seriesIndex].toLocaleString()
              );
              // console.log("selected", selected);
              return selected.toFixed(2) + "% " + " : " + val + " posts";
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
        //         position: "bottom",
        //         horizontalAlign: "bottom",
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
        this.getMapStatic.static.facebook_count,
        this.getMapStatic.static.twitter_count,
        this.getMapStatic.static.pantip_count,
        this.getMapStatic.static.news_count,
        this.getMapStatic.static.youtube_count,
        this.getMapStatic.static.instagram_count,
        this.getMapStatic.static.blockdit_count,
        this.getMapStatic.static.tiktok_count,
        this.getMapStatic.static.threads_count,
      ];
      this.series = data;
    },
  },
  created() {
    this.$emitter.on("callApiMap", (val) => {
      // console.log('chart ',val);
      this.chartData();
    });
  },
};
</script>

<style></style>
