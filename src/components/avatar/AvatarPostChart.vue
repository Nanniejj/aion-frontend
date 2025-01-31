<template>
  <div>
    <apexchart
      type="bar"
      height="380"
      :options="chartOptions"
      :series="chartData"
    ></apexchart>
  </div>
</template>

<script>
import Vue from "vue";
import VueApexCharts from "vue-apexcharts";

Vue.component("apexchart", VueApexCharts);
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["getAvatar", "getSummaryAvatar", "getDataListAvatar"]),
  },
  data() {
    return {
      chartData: [
        {
          name: "posts",
          data: [],
        },
      ],
      chartOptions: {
        colors: [
          "#fd7786",
          "#dc54b1",
          "#3f65ca",
          "#1c44a8",
          "#019bcb",
          "#46c1c0",
          "#e91a5d",
          "#a033b0",
          "#009c9e",
          "#009f77",
          "#12bb90",
          "#91db69",
          "#fbff86",
          "#fbb954",
          "#cd683d",
          "#9e4539",
          "#905ea9",
          "#a884f3",
          "#eaaded",
          "#8fd3ff",
          "#4d9be6",
          "#4d65b4",
          "#0fb64e",
        ],
        plotOptions: {
          bar: {
            barHeight: "70px",
            distributed: true,
            horizontal: false,
            dataLabels: {
              position: "top",
            },
            borderRadius: 10,
          },
        },
        dataLabels: {
          enabled: true,
          textAnchor: "start",
          style: {
            colors: ["#2c3e50"],
            fontSize: "12px",
          },
          formatter: function(val) {
            return val > 0 ? val.toLocaleString() : "";
          },
          offsetX: -10,
          offsetY:-30,
          dropShadow: {
            enabled: false,
          },
        },
        chart: {
          type: "bar",
          height: 380,
          fontFamily: "Prompt, FontAwesome, sans-serif",
        },
        xaxis: {
          type: "category",
          position: "bottom",
          labels: {
            style: {
              fontSize: "12px", // Adjust the font size for x-axis labels
            },
          },
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return Number(val) 
            },
            style: {
              fontSize: "14px", // Adjust the font size for y-axis labels
            },
          },
        },
        title: {
          text: "จำนวนโพสต์ของแต่ละทีม",
        },
        tooltip: {
          x: {
            formatter: function (val) {
              return val;
            },
          },
        },
      },
    };
  },
  watch: {
    getDataListAvatar: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.chartPost) {
          this.updateChartData();
        }
      },
    },
  },
  methods: {
    updateChartData() {
      Vue.nextTick(() => {
        this.chartData = [
          {
            name: "posts",
            data: this.getDataListAvatar.chartPost,
          },
        ];
      });
    },
  },
  mounted() {
    // Initial check in case data is already available
    if (this.getDataListAvatar && this.getDataListAvatar.chartPost) {
      this.updateChartData();
    }
  },
};
</script>

<style scoped>
/* Add any custom styles if necessary */
</style>
