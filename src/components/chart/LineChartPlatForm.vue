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
    getArrDate: function() {
      var e = moment(new Date())
        .format()
        .slice(0, 10);
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
      colorp: [],
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
    ...mapGetters([
      "getClickDomain",
      "getSdateDm",
      "getEdateDm",
      "getArrDate",
      "getNamePlatform",
      "getDomainArr",
    ]),
    getSeries: function() {
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
      var config = {
        method: "get",
        url:
          "https://api2.cognizata.com/api/v2/userposts/getChartDataPlatform?source=" +
          this.getNamePlatform +
          sdate +
          edate +
          "&domain=" +
          this.getDomainArr,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      await this.axios(config).then((response) => {
        var _this = this;
        var getDaysArray = function(s, e) {
          for (
            var a = [], d = new Date(s);
            d <= e;
            d.setDate(d.getDate() + 1)
          ) {
            a.push({
              date: moment(d)
                .format()
                .slice(0, 10),
              count: _this.val,
            });
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
        };
      });
    },

    async startChart() {
      var currentTime = new Date();
      console.log("currentTime", currentTime);
      currentTime.setDate(currentTime.getDate() - 14);
      try {
        var config = {
          method: "get",
          url:
            "https://api2.cognizata.com/api/v2/userposts/getChartDataPlatform?source=" +
            this.getNamePlatform +
            "&domain=" +
            this.getDomainArr,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        };
        await this.axios(config).then((response) => {
          console.log("response.data", response.data);
          var _this = this;
          var getDaysArrays = function(s, e) {
            for (
              var a = [], d = new Date(s);
              d <= e;
              d.setDate(d.getDate() + 1)
            ) {
              a.push({
                date: moment(d)
                  .format()
                  .slice(0, 10),
                count: _this.val,
              });
            }
            return a;
          };
          let de = moment(new Date())
            .format()
            .slice(0, 10);
          let ds = moment(currentTime)
            .format()
            .slice(0, 10);
          var daylist = getDaysArrays(new Date(ds), new Date(de));

          let data = response.data;

          let results = daylist.map((key) => {
            return key;
          });

          var array3 = [...results, ...data];
          const distinctItems = [
            ...new Map(array3.map((item) => [item["date"], item])).values(),
          ];
          let datelist = distinctItems.map((item) => item.date);
          let countlist = distinctItems.map((item) => item.count);

          this.range = datelist[0] + " - " + datelist[datelist.length - 1];
          //console.log("array3", array3, distinctItems, datelist, countlist);
          this.series = [
            {
              name: "จำนวนโพสต์",
              data: countlist,
            },
          ];
          console.log("getNamePlatform", this.getNamePlatform);

          if (this.getNamePlatform == "twitter") {
            this.colorp = ["#919495"];
          } else if (this.getNamePlatform == "facebook") {
            this.colorp = ["#4c77bb"];
          } else if (this.getNamePlatform == "pantip") {
            this.colorp = ["#532d84"];
          } else if (this.getNamePlatform == "youtube") {
            this.colorp = ["#e24246"];
          } else if (this.getNamePlatform == "news") {
            this.colorp = ["#fdd072"];
          } else if (this.getNamePlatform == "instagram") {
            this.colorp = ["#ff9773"];
          } else if (this.getNamePlatform == "blockdit") {
            this.colorp = ["#396eb6"];
          } else if (this.getNamePlatform == "threads") {
            this.colorp = ["#e75aa1"];
          } else {
            this.colorp = ["#1f0043"];
          }

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
            colors: this.colorp,
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
          console.log("chart", this.chartOptions);
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
        // this.$toast.error("ไม่สามารถดึงข้อมูลกราฟได้ในขณะนี้ กรุณาลองใหม่ภายหลัง");
      }
    },
  },
  created: async function() {
    this.startChart();
  },
};
</script>
