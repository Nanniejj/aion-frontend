<template>
  <div id="chart" class="mt-1">
    <div class=" bold h5 text-left">Top 10</div>
    <!-- {{ typeMap }} -->
    <apexchart
      id="chart-map"
      type="bar"
      :height="hgt"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { mapGetters } from "vuex";
import moment from "moment";
// import axios from "axios";
export default {
  name: "App",
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    typeMap:{
      type: String,
    },
    code_id: {
      type: Array,
      default: [],
    },
    hgt: {
      type: Number,
      default: 0,
    },
    sdate: {
      type: String,
    },
    edate: {
      type: String,
    },
    keyword: {
      type: Array,
    },
  },
  watch: {
    hgt() {
      this.series = [];
    },
  },
  data() {
    return {
      // hgt: 350,
      series: [],
      chartOptions: {
        chart: {
          type: "bar",
          height: this.hgt,
          stacked: true,
          fontFamily: "Prompt, FontAwesome, sans-serif",
        },
        stroke: {
          width: 0.3,
          colors: ["#fff"],
        },
        dataLabels: {
          formatter: (val) => {
            return val;
          },
        },
        noData: {
          text: "Loading...",
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: "75%",
            borderRadius: 10,
            dataLabels: {
              total: {
                enabled: true,
                offsetX: 0,
                offsetY: 0,
                style: {
                  fontSize: "13px",
                  fontWeight: 900,             
                },
              },
            },
          },
        },
        xaxis: {
          categories: [],
        },
        fill: {
          opacity: 1,
        },
        colors: ["#5bb44a", "#f5a700", "#f06964"],
        yaxis: {
          labels: {
            style: {
              colors: [],
              fontSize: "15px",
              fontWeight: 400,
            },
            formatter: (val) => {
              return val;
            },
          },
        },
        grid: {
          show: false,
          xaxis: {
            lines: {
              show: false,
            },
          },
          yaxis: {
            lines: {
              show: false,
            },
          },
        },
        legend: {
          show: true,
          position: "top",
          horizontalAlign: "left",
          fontSize: "15px",
        },
      },
    };
  },
  computed: {
    ...mapGetters(["getLocationStat", "getLocationPost"]),
  },
  methods: {
    startChart(val) {
      let data = [...val]
        .sort(({ count: a }, { count: b }) => b - a)
        .slice(0, 10);
      // if (data.length < 10) {
      //   let diff = 10 - data.length;
      //   for (let i = 0; i < diff; i++) {
      //     data.push({
      //       positiveSentiment: 0,
      //       neutralSentiment: 0,
      //       negativeSentiment: 0,
      //       name: "",
      //     });
      //   }
      // }
      let pos = [...data].map((x) => x.positiveSentiment);
      let neu = [...data].map((x) => x.neutralSentiment);
      let neg = [...data].map((x) => x.negativeSentiment);
      let name = [...data].map((x) => x.name);
      console.log("startChart", data);
      this.series = [
        {
          name: "positive",
          data: pos,
        },
        {
          name: "neutral",
          data: neu,
        },
        {
          name: "negative",
          data: neg,
        },
      ];
      let _this =this
      this.chartOptions = {
        chart: {
          events: {
            dataPointSelection(event, chartContext, config) {
              // console.log('config',  config);
              let stm
              if(config.seriesIndex==0){
                stm ="1"
              }
              if(config.seriesIndex==1){
                stm ="0"
              }
              if(config.seriesIndex==2){
                stm ="-1"
              }
              let point = [...data];
              let payload = {
                start:  _this.sdate,
                end:  _this.edate,
                location: point[config.dataPointIndex].name,
                keyword: String( _this.keyword),
                sort_by: "",
                sentiment: stm,
                type:_this.typeMap,
                source:
                  "news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads",
              }
         
              localStorage.setItem("mappost", JSON.stringify(payload));
              const routeData =  _this.$router.resolve({
                name: "MapPost",
              });
              window.open(routeData.href, "_blank");

              console.log(config);
              console.log(point[config.dataPointIndex]);
            },
          },
          type: "bar",
          height: this.hgt,
          stacked: true,
          fontFamily: "Prompt, FontAwesome, sans-serif",
        },
        stroke: {
          width: 0,
          colors: ["#fff"],
        },
        dataLabels: {
          formatter: (val) => {
            return val !== 0 ? val : "";
          },
        },
        noData: {
          text: "Loading...",
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: "75%",
            borderRadius: 10,
            dataLabels: {
              total: {
                enabled: true,
                offsetX: 0,
                style: {
                  fontSize: "13px",
                  fontWeight: 900,
                  colors: ["#304758"],
                },
              },
            },
          },
        },
        xaxis: {
          categories: name,
        },
        fill: {
          opacity: 1,
        },
        colors: ["#5bb44a", "#f5a700", "#f06964"],
        yaxis: {
          labels: {
            show: true,
            align: "right",
            minWidth: 0,
            maxWidth: 160,
            style: {
              colors: [],
              fontSize: "15px",
              fontWeight: 400,
              cssClass: "apexcharts-yaxis-label",
            },
            offsetX: 0,
            offsetY: 0,
            rotate: 0,
            formatter: (val) => {
              return val;
            },
          },
        },
        grid: {
          show: false,
          xaxis: {
            lines: {
              show: false,
            },
          },
          yaxis: {
            lines: {
              show: false,
            },
          },
        },
        legend: {
          show: true,
          position: "top",
          horizontalAlign: "left",
          fontSize: "15px",
        },
      };
    },
  },
  created() {
    this.$emitter.on("callApiMap", (val) => {
      this.startChart(val);
    });
    // this.$emitter.on("fixChart", (val) => {
    //     this.hgt=val
    // });
  },
};
</script>
<style scoped>
@media only screen and (min-width: 0px) and (max-width: 990px) {
  .col-auto {
    padding-left: 9px;
    padding-right: 9px;
  }
}
</style>
<style>
.apexcharts-series{
  cursor: pointer;
}
#chart-map .apexcharts-text tspan {
  /* font-size: 15px !important; */
}
@media only screen and (min-width: 0px) and (max-width: 990px) {
  .font-icon {
    font-size: small;
  }
}
</style>
