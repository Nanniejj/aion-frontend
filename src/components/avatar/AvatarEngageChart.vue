<template>
  <div id="chart">
    <apexchart
      type="bar"
      height="350"
      :options="chartOptions"
      :series="chartData"
    ></apexchart>
  </div>
</template>

<script>
import Vue from "vue";
import VueApexCharts from "vue-apexcharts";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters([
      "getAvatar",
      "getSummaryAvatar",
      "getDataListAvatar",
      "getAvatarSource",
    ]),
  },

  components: {
    apexchart: VueApexCharts,
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
  data() {
    return {
      chartOptions: {
        title: {
          text: "จำนวน Engagement ของแต่ละทีม",
        },
        colors: ["#E76F51", "#E9C46A", "#36BA98", "#18b3c7"],
        chart: {
          fontFamily: "Prompt, FontAwesome, sans-serif",

          type: "bar",
          height: 350,
          stacked: true,
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: true,
          },
        },

        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 10,
            borderRadiusApplication: "around", // 'around', 'end'
            borderRadiusWhenStacked: "all", // 'all', 'last'
            dataLabels: {
              enabled: true,
              style: {
                colors: ["#2c3e50"],
                fontSize: "14px",
              },
              total: {
                enabled: true,
                style: {
                  fontSize: "13px",
                  fontWeight: 900,
                  colors: ["#2c3e50"],
                },
              },
            },
          },
        },
        
        dataLabels: {
          enabled: true,
          total: { enabled: true },
          style: {
            colors: ["#2c3e50"],
            fontSize: "10px",
          },
          formatter: function(val) {
            return val > 0 ? val.toLocaleString() : "";
          },

          dropShadow: {
            enabled: false,
          },
        },

        xaxis: {
          categories: [], // ใส่ข้อมูลจาก getDataListAvatar.chartPost
        },
        legend: {
          position: "bottom",
          offsetY: 40,
        },
        fill: {
          opacity: 1,
        },
      },
      chartData: [
        {
          name: "Likes",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: "Reposts",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: "Comments",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
    };
  },
  methods: {
    updateChartData() {
      Vue.nextTick(() => {
        let likes = [...this.getDataListAvatar.avatar].map(
          (item) => item.likesCountSum
        );
        let reposts = [...this.getDataListAvatar.avatar].map(
          (item) => item.retweetsCountSum
        );
        let shares = [...this.getDataListAvatar.avatar].map(
          (item) => item.sharesCountSum
        );
        let comments = [...this.getDataListAvatar.avatar].map(
          (item) => item.commentsCountSum
        );
        let views = [...this.getDataListAvatar.avatar].map(
          (item) => item.viewsCountSum
        );
        this.chartOptions = {
          xaxis: {
            categories: [...this.getDataListAvatar.chartPost].map(
              (item) => item.x
            ), // ใส่ข้อมูลจาก getDataListAvatar.chartPost
          },
          legend: {
            position: "bottom",
            offsetY: 0,
          },
          fill: {
            opacity: 1,
          },
        };
        if (this.getAvatarSource == "twitter") {
          this.chartData = [
            {
              name: "Likes",
              data: likes,
            },
            {
              name: "Reposts",
              data: reposts,
            },
            {
              name: "Comments",
              data: comments,
            },
          ];
        }
        if (
          this.getAvatarSource == "facebook" ||
          this.getAvatarSource == "instagram"
        ) {
          this.chartData = [
            {
              name: "Likes",
              data: likes,
            },
            {
              name: "Reposts",
              data: reposts,
            },
            {
              name: "Comments",
              data: comments,
            },
          ];
        }

        if (this.getAvatarSource == "tiktok") {
          this.chartData = [
            {
              name: "Likes",
              data: likes,
            },
            {
              name: "Shares",
              data: shares,
            },
            {
              name: "Comments",
              data: comments,
            },
            {
              name: "views",
              data: views,
            },
          ];
        }
      });
    },
  },
  mounted() {
    // เรียกใช้งาน updateChartData เมื่อคอมโพเนนต์โหลดเสร็จสมบูรณ์
    if (this.getDataListAvatar && this.getDataListAvatar.chartPost) {
      this.updateChartData();
    }
  },
};
</script>

<style>
#chart {
  max-width: 100%;
  margin: 35px auto;
}
</style>
