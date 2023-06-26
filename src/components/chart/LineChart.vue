<template>
  <div id="chart" class="mt-3">
    <apexchart
      id="chart-domain"
      type="line"
      height="400"
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
  watch: {
    getArrDate: function () {
      var e = moment(new Date()).format().slice(0, 10);
      if (
        this.getSdateDm.slice(0, 10) == e &&
        this.getEdateDm.slice(0, 10) == e
      ) {
        this.startChart();
      } else {
        this.updateChart();
      }

      this.val = 0;
    },
  },
  data() {
    return {
      val: 0,
      range: "",
      series: [],
      chartOptions: {
        chart: {
          type: "line",
          fontFamily: "Prompt, FontAwesome, sans-serif",
        },
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
      },
    };
  },
  computed: {
    ...mapGetters(["getClickDomain", "getSdateDm", "getEdateDm", "getArrDate"]),
    getSeries: function () {
      return [
        {
          name: "จำนวนโพสต์",
          data: [],
        },
      ];
    },
  },
  methods: {
    async updateChart() {
      this.series = [];
      let sdate, edate;
      if (this.getSdateDm || this.getEdateDm) {
        sdate = "&start=" + this.getSdateDm;
        edate = "&end=" + this.getEdateDm;
      } else {
        sdate = "";
        edate = "";
      }
      // https://api2.cognizata.com/api/v2/userposts/getChartData?domain=
      var config = {
        method: "get",
        url:
          "https://api2.cognizata.com/api/v2/userposts/getChartDataDomain?domain=" +
          this.getClickDomain +
          sdate +
          edate,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      await this.axios(config).then((response) => {
        var _this = this;
        var getDaysArray = function (s, e) {
          for (
            var a = [], d = new Date(s);
            d <= e;
            d.setDate(d.getDate() + 1)
          ) {
            a.push({ date: moment(d).format().slice(0, 10), count: _this.val });
          }
          return a;
        };
        var daylist = getDaysArray(
          new Date(this.getSdateDm),
          new Date(this.getEdateDm)
        );
        let data = response.data;
        // let countlist = data.map((item) => item.count);
        // let datelist = data.map((item) => item.date);
        let results = daylist.map((key) => {
          return key;
        });
        var array3 = [...results, ...data];
        const distinctItems = [
          ...new Map(array3.map((item) => [item["date"], item])).values(),
        ];
        let datelist = distinctItems.map((item) => item.date);
        let countlist = distinctItems.map((item) => item.count);
        let top3 = distinctItems.map((item) => item.TopHashtags);
        this.range = datelist[0] + " - " + datelist[datelist.length - 1];
        this.series = [
          {
            name: "จำนวนโพสต์",
            data: countlist,
          },
        ];
        this.chartOptions = {
          title: {
            text: "จำนวนโพสต์ วันที่ " + this.range,
            align: "left",
            fontFamily: "Prompt",
          },
          xaxis: {
            categories: datelist,
          },
          tooltip: {
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
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
                "จำนวนโพสต์ : " +
                "<b>" +
                valpost.toLocaleString() +
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
        };
      });
    },

    async startChart() {
      var currentTime = new Date();
      console.log("currentTime", currentTime);
      currentTime.setDate(currentTime.getDate() - 14);
      //http://139.59.103.67:3000/api/userposts_test/getChartDataPlatform?domain=covid19&start=2021-11-19T00:00:00&end=2021-11-22T23:59:59
      //https://api2.cognizata.com/api/v2/userposts/getChartDataDomain?domain=การเมือง&start=2021-11-24T00:00:00&end=2021-11-24T23:59:59
      //http://139.59.103.67:3000/api/v2/domain/getChartData?start=2022-10-24T00:00:00&end=2022-11-07T23:59:59&domain=การเมือง
      var config = {
        method: "get",
        url:
          "https://api2.cognizata.com/api/v2/userposts/getChartDataDomain?domain=" +
          this.getClickDomain,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      await this.axios(config).then((response) => {
        console.log("response.data", response.data);
        var _this = this;
        var getDaysArrays = function (s, e) {
          for (
            var a = [], d = new Date(s);
            d <= e;
            d.setDate(d.getDate() + 1)
          ) {
            a.push({ date: moment(d).format().slice(0, 10), count: _this.val });
          }
          return a;
        };
        let de = moment(new Date()).format().slice(0, 10);
        let ds = moment(currentTime).format().slice(0, 10);
        var daylist = getDaysArrays(new Date(ds), new Date(de));

        let data = response.data;
        // let datelist = data.map((item) => item.date);
        // let countlist = data.map((item) => item.count);

        let results = daylist.map((key) => {
          return key;
        });

        var array3 = [...results, ...data];
        console.log("array3", ...data, ...results);
        const distinctItems = [
          ...new Map(array3.map((item) => [item["date"], item])).values(),
        ];

        console.log("array3", distinctItems);
        let datelist = distinctItems.map((item) => item.date);
        let countlist = distinctItems.map((item) => item.count);
        let top3 = distinctItems.map((item) => item.TopHashtags);
        console.log("top3", top3);
        this.range = datelist[0] + " - " + datelist[datelist.length - 1];

        this.series = [
          {
            name: "จำนวนโพสต์",
            data: countlist,
          },
        ];
        this.chartOptions = {
          yaxis: {
            labels: {
              formatter: (value) => {
                return value.toLocaleString();
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
          tooltip: {
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
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
                '<div class="arrow_box m-2 mr-3 ml-3">' +
                "<div>" +
                w.globals.categoryLabels[dataPointIndex] +
                "<hr class='m-1'/>" +
                "</div>" +
                "<span>" +
                "จำนวนโพสต์ : " +
                "<b>" +
                valpost.toLocaleString() +
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
              return value.toLocaleString();
            },
          },
          stroke: {
            curve: "smooth",
          },
          title: {
            text: "จำนวนโพสต์ วันที่ " + this.range,
            align: "left",
            fontFamily: "Prompt",
          },
          markers: {
            size: 1,
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
            categories: datelist,
          },
        };
      });
    },
  },
  created: async function () {
       this.startChart();
  },
};
</script>
<style scoped>
</style>