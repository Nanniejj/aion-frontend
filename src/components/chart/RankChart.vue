<template>
  <div id="chart">
    <div class="text-left mt-1 mb-2">
      <i class="fa fa-calendar" /> {{ range }}
    </div>
    <apexchart
      id="chart-domain"
      type="line"
      height="600"
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
    getDataTrend() {
      this.series = [];
      this.startChart();
      //this.updateChart();
    },
    // getArrDateRank() {
    //   this.series = [];
    //   this.updateChart();
    // },
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
        // dataLabels: {
        //   enabled: true,
        // },
        series: [],
        title: {
          text: "จำนวนโพสต์ในแต่ละวัน",
        },
        noData: {
          text: "Loading...",
        },
        legend: {
          position: "top",
          horizontalAlign: "left",
        },
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
    };
  },
  computed: {
    ...mapGetters([
      "getArrDate",
      "getRanking",
      "getDataTrend",
      "getWordCloudStartDate",
      "getWordCloudEndDate",
      "getArrDateRank",
    ]),
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
      var getDaysArray = function (s, e) {
        for (var a = [], d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
          a.push({ date: moment(d).format().slice(0, 10), count: 0 });
        }
        return a;
      };

      var daylist = getDaysArray(
        new Date(this.getWordCloudStartDate),
        new Date(this.getWordCloudEndDate)
      );
      let results = daylist.map((key) => {
        return key;
      });
      console.log("update", results);
      //sumy
      let data1 
      if(this.getDataTrend){
       data1 = this.getDataTrend.map((item) => {
        let sum = item.y.reduce((a, b) => a + b, 0);
        return { x: item.x, sumy: sum, data: item.y, name: item.label };
      });
}
      //sort value y
      data1.sort((a, b) => {
        return b.sumy - a.sumy;
      });

      data1 = data1.map((item) => {
        // return { data: item.data, name: item.name };
        return { data: item.data, name: item.name, date: item.x };
      });

      //let updatedata = data1.map((item) => item.date);
      console.log("updatedata", data1);

      // var array3 = [...results, ...data];
      // const distinctItems = [
      //   ...new Map(array3.map((item) => [item["date"], item])).values(),

      // ];
      let datelist = results.map((item) => item.date);
      let countlist = results.map((item) => item.count);
      console.log("relll", { date: datelist, data: countlist });

      this.range = datelist[0] + " - " + datelist[datelist.length - 1];
      console.log("datelist", datelist);
      this.series = data1.slice(0, 10);
      this.chartOptions = {
        title: {
          text: "จำนวนโพสต์",
          fontFamily: "Prompt",
        },
        noData: {
          text: "Loading...",
        },
        
       markers: {
  size: 5,
    colors: undefined,
},

        xaxis: {
          categories: datelist,
        },
        legend: {
          position: "top",
          horizontalAlign: "left",
        },
        colors: [
          "#feb019",
          "#775dd0",
          "#ff4560",
          "#fb7db7",
          "#f97c40",
          "#008ffb",
          "#00c1fb",
          "#1EAE98",
          "#0f9a27",
          "#8CBA51",
        ],
        stroke: {
          curve: "smooth",
          width: 3,
        },
        // dataLabels: {
        //   enabled: true,
        //   formatter: (value) => {
        //     return value.toLocaleString();
        //   },
        // },
      };
    },

    async startChart() {
      this.series = [];
      var currentTime = new Date();
      currentTime.setDate(currentTime.getDate() - 6);
      var getDaysArrays = function (s, e) {
        for (var a = [], d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
          a.push({ date: moment(d).format().slice(0, 10), data: 0 });
        }
        return a;
      };
      var daylist;
      if (this.getArrDateRank) {
        daylist = getDaysArrays(
          new Date(this.getWordCloudStartDate),
          new Date(this.getWordCloudEndDate)
        );
        console.log('มี arr');
      } else {
        let de = moment(new Date()).format().slice(0, 10);
        let ds = moment(currentTime).format().slice(0, 10);
        daylist = getDaysArrays(new Date(ds), new Date(de));
        console.log('ไม่มี arr');
      }

      let results = daylist.map((key) => {
        return key;
      });
      console.log("dataaaa", this.getDataTrend);
      //sumy
      console.log("dateee", results);
      let data1 = this.getDataTrend.map((item) => {
        let sum = item.y.reduce((a, b) => a + b, 0);
        return { x: item.x, sumy: sum, data: item.y, name: item.label };
      });

      //sort value y
      data1.sort((a, b) => {
        return b.sumy - a.sumy;
      });

      data1 = data1.map((item) => {
        // return { data: item.data, name: item.name };
        return { data: item.data, name: item.name, date: item.x };
      });

      console.log("rabknME", data1);
      //    let data2 = distinctItems.map((item) => item.x);
      // var array3 = [...results, ...data1];
      // console.log("array3", ...data1, ...results);
      // const distinctItems = [
      //   ...new Map(array3.map((item) => [item["date"], item])).values(),
      // ];
      // console.log("array3", array3);
      //   var distinctItems = this.getDataTrend;
      let datelist = results.map((item) => item.date);
      let countlist = results.map((item) => item.data);

      console.log("bbbbbbbbbb", datelist, countlist);

      this.range = datelist[0] + " - " + datelist[datelist.length - 1];
      //console.log("array3", array3, distinctItems, datelist, countlist);

      this.series = data1.slice(0, 10);

      console.log("llllll", this.series);
      this.chartOptions = {
        yaxis: {
          labels: {
            formatter: (value) => {
              return value;
            },
          },
        },
        chart: {
          fontFamily: "Prompt, FontAwesome, sans-serif",
          type: "line",
          zoom: {
            enabled: false,
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
        legend: {
          position: "top",
          horizontalAlign: "left",
        },
        colors: [
          "#feb019",
          "#775dd0",
          "#ff4560",
          "#fb7db7",
          "#f97c40",
          "#008ffb",
          "#00c1fb",
          "#1EAE98",
          "#0f9a27",
          "#8CBA51",
        ],
        stroke: {
          curve: "smooth",
          width: 3,
        },
        noData: {
          text: "Loading...",
        },

        // dataLabels: {
        //   enabled: false,
        //   formatter: (value) => {
        //     return value.toLocaleString();
        //   },
        // },

        title: {
          text: "จำนวนโพสต์ ",
          align: "left",
          fontFamily: "Prompt",
        },
       markers: {
  size: 5,
    colors: undefined,
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
    },
  },
  created: async function () {
    this.startChart();
  },
  destroyed() {
    this.$store.commit("setDataTrend",[]);
  },
};
</script>
