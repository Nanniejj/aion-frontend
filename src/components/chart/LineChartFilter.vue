<template>
  <div id="chart" class="mt-3">
    <apexchart
      id="chart-domain"
      type="line"
      height="400"
      :options="chartOptions"
      :series="series"
    ></apexchart>
    <!-- <apexchart
      v-else
      id="chart-domain"
      type="line"
      height="400"
      :options="chartOptions2"
      :series="series"
    ></apexchart> -->
  </div>
</template>
<script>
import VueApexCharts from "vue-apexcharts";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  components: {
    apexchart: VueApexCharts,
  },
  computed: {
    ...mapGetters(["getClickDomain", "getSdateDm", "getEdateDm", "getArrDate"]),
  },
  props: {
    typeChart: { type: String },
    label: { type: String },
  },
  watch: {
    getArrDate() {
      this.apiFilterChart();
      this.valdate = 0;
    },
    typeChart(val) {
      this.apiFilterChart();
      // if (val == "platform") {
      //   this.sourceFilter(this.source);
      // }
      // if (val == "sentiment") {
      //   this.sentimentFilter(this.sentiment);
      // }
    },
    label(val) {
      console.log("val", val);
      this.apiFilterChart();
    },
  },
  data() {
    return {
      valdate: 0,
      sentiment: [],
      source: [],
      series: [],
      chartOptions2: {
        chart: {
          type: "line",
          fontFamily: "Prompt, FontAwesome, sans-serif",
        },
        colors: [],
        dataLabels: {
          enabled: true,
        },
        series: [],
        title: {
          text: "จำนวนโพสต์ในแต่ละวัน",
        },
        noData: {
          text: "Loading...",
        },
        stroke: {
          curve: "smooth",
          width: 3,
        },
        markers: {
          size: 5,
        },
      },
      chartOptions: {
        chart: {
          type: "line",
          fontFamily: "Prompt, FontAwesome, sans-serif",
        },
        colors: [],
        dataLabels: {
          enabled: true,
        },
        series: [],
        title: {
          text: "จำนวนโพสต์ในแต่ละวัน",
        },
        noData: {
          text: "Loading...",
        },
        stroke: {
          curve: "smooth",
          width: 3,
        },
        markers: {
          size: 5,
        },
      },
    };
  },
  methods: {
    domainFilter(dataAll) {
      // console.log("dataAll", dataAll);
      // var getDaysArray = (s, e) => {
      //   console.log("dataAll2", this.valdate);
      //   for (var a = [], d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      //     a.push({
      //       date: moment(d)
      //         .format()
      //         .slice(0, 10),
      //       count: this.valdate,
      //     });
      //   }
      //   return a;
      // };
      // var daylist = getDaysArray(
      //   new Date(this.getSdateDm),
      //   new Date(this.getEdateDm)
      // );
      let data = dataAll;

      // let results = daylist.map((key) => {
      //   return key;
      // });
      // var array3 = [...results, ...data];
      // const distinctItems = [
      //   ...new Map(array3.map((item) => [item["date"], item])).values(),
      // ];
      let datelist = data.map((item) => item.date);
      let countlist = data.map((item) => item.count);
      let top3 = data.map((item) => item.TopHashtags);
      this.range = datelist[0] + " - " + datelist[datelist.length - 1];
      this.series = [
        {
          name: "จำนวนโพสต์",
          data: countlist,
        },
      ];

      let ytext = "จำนวนโพสต์";
      if (this.label == "posts") {
        ytext = "จำนวนโพสต์";
      } else {
        ytext = "จำนวน engagement";
      }
      this.chartOptions = {
        yaxis: {
          labels: {
            formatter: (value) => {
              return Number(value).toLocaleString();
            },
          },
        },
        title: {
          text: ytext + " วันที่ " + this.range,
          align: "left",
          fontFamily: "Prompt",
        },
        xaxis: {
          categories: datelist,
        },
        tooltip: {
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            let tophash, valpost, a, b, c, f;
            valpost = series[seriesIndex][dataPointIndex];
            if (top3[dataPointIndex]) {
              tophash = top3[dataPointIndex];
              if (tophash[0]) {
                a = "1. " + tophash[0] + "<br>";
              } else {
                a = "";
              }
              if (tophash[1]) {
                b = "2. " + tophash[1] + "<br>";
              } else {
                b = "";
              }
              if (tophash[2]) {
                c = "3. " + tophash[2] + "<br>";
              } else {
                c = "";
              }
              f = a + b + c;
            } else {
              f = " ไม่พบ";
            }

            return (
              '<div class="arrow_box m-2 p-1">' +
              "<div>" +
              w.globals.categoryLabels[dataPointIndex] +
              "<hr class='p-1 m-1'/>" +
              "</div>" +
              "<span>" +
                ytext+" : " +
              "<b>" +
              Number(valpost).toLocaleString() +
              "</b>" +
              "</span>" +
              "<div>" +
              "<b>" +
              "#Top3" +
              "</b>" +
              "<br>" +
              f +
              "</div>" +
              "</div>"
            );
          },
        },
        colors: ["#fed16e"],
        dataLabels: {
          enabled: true,
          style: {
            colors: ["#4c412b"],
          },
          formatter: (value) => {
            return Number(value).toLocaleString();
          },
        },
        stroke: {
          curve: "smooth",
        },
      };
    },
    sourceFilter(data) {
      console.log("data", data);
      let datearr = data[0].x;
      this.series = [...data].map((x) => {
        return { name: x.source, data: x.y };
      });

      let ytext = "จำนวนโพสต์";
      if (this.label == "posts") {
        ytext = "จำนวนโพสต์";
      } else {
        ytext = "จำนวน engagement";
      }

      this.chartOptions = {
        title: {
          text: ytext + " วันที่ " + this.range,
          align: "left",
          fontFamily: "Prompt",
        },
        yaxis: {
          labels: {
            formatter: (value) => {
              return Number(value).toLocaleString();
            },
          },
        },
        chart: {
          fontFamily: "Prompt, FontAwesome, sans-serif",
          type: "line",
          zoom: {
            enabled: true,
          },
          dropShadow: {
            enabled: true,
            color: "#000",
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2,
          },
        },
        colors: [
          "#eb363a",
          "#8050be",
          "#438afe",
          "#e18457",
          "#543b66",
          "#336db6",
          "#919495",
          "#ef9a1a",
        ],
        dataLabels: {
          enabled: false,
        },

        grid: {
          row: {
            colors: ["#ffffff", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
          padding: {
            left: 30, // or whatever value that works
          },
        },
        xaxis: {
          categories: datearr,
        },
        tooltip: {
          enabled: true,
          enabledOnSeries: undefined,
          shared: true,
          followCursor: false,
          intersect: false,
          inverseOrder: false,
          custom: undefined,
          fillSeriesColor: false,
          y: {
            formatter: (value) => {
              return Number(value).toLocaleString();
            },
          },
        },
      };
    },
    sentimentFilter(data) {
      console.log("เข้า sentiment ", data);
      this.series = [...data].map((x) => {
        if (x.sentiment == 0) {
          x.stm = "neutral";
        }
        if (x.sentiment == 1) {
          x.stm = "positive";
        }
        if (x.sentiment == -1) {
          x.stm = "negative";
        }
        return { name: x.stm, data: x.y };
      });
      let datearr = data[0].x;
      console.log("this.series", this.series, datearr);
      //   this.chartOptions.xaxis.categories=data[0].data
      //   this.chartOptions=this.chartOptions
      let ytext = "จำนวนโพสต์";
      if (this.label == "posts") {
        ytext = "จำนวนโพสต์";
      } else {
        ytext = "จำนวน engagement";
      }

      this.chartOptions = {
        title: {
          text: ytext + " วันที่ " + this.range,
          align: "left",
          fontFamily: "Prompt",
        },
        yaxis: {
          labels: {
            formatter: (value) => {
              return Number(value).toLocaleString();
            },
          },
        },
        chart: {
          fontFamily: "Prompt, FontAwesome, sans-serif",
          type: "line",
          zoom: {
            enabled: true,
          },
          dropShadow: {
            enabled: true,
            color: "#000",
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2,
          },
        },
        colors: ["#3cb185", "#1b678f", "#d94b39"],
        dataLabels: {
          enabled: true,
            style: {
              colors: undefined,
            },
          formatter: (value) => {
            return Number(value).toLocaleString();
          },
        },

        grid: {
          row: {
            colors: ["#ffffff", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
          padding: {
            left: 30, // or whatever value that works
          },
        },
        xaxis: {
          categories: datearr,
        },
        tooltip: {
          enabled: true,
          enabledOnSeries: undefined,
          shared: true,
          followCursor: false,
          intersect: false,
          inverseOrder: false,
          custom: undefined,
          fillSeriesColor: false,
          y: {
            formatter: (value) => {
              return Number(value).toLocaleString();
            },
          },
        },
      };
      console.log("this.series", this.series, data[0].data);
    },
    apiFilterChart(start) {
      // console.log('this.typeChart',this.typeChart);
      if (this.series.length !== 0) {
        this.series = [];
      }
      var axios = require("axios");
      let sdate, edate, label;
      if (this.getSdateDm || this.getEdateDm) {
        sdate = "&start=" + this.getSdateDm;
        edate = "&end=" + this.getEdateDm;
      } else {
        sdate = "";
        edate = "";
      }

      if (start == "start") {
        sdate = "";
        edate = "";
      }

      if (this.label) {
        label = "&label=" + this.label;
      } else {
        label = "";
      }

      var config = {
        method: "get",
        url:
          "http://139.59.103.67:3000/api/v2/userposts/getChartDataDomain?domain=" +
          this.getClickDomain +
          sdate +
          edate +
          label,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      axios(config)
        .then((response) => {
          this.sentiment = response.data[0].sentiment;
          this.source = response.data[0].source.result2;
          console.log("chartres", response.data);
          if (this.typeChart == "platform") {
            this.sourceFilter(response.data[0].source.result2);
          }
          if (this.typeChart == "sentiment") {
            this.sentimentFilter(response.data[0].sentiment);
          }
          if (this.typeChart == "domain") {
            this.domainFilter(response.data[0].data);
          }
          console.log("sourceFilter", response.data[0].source.result2);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  mounted() {
    this.apiFilterChart("start");
  },
};
</script>
<style></style>
