<template>
  <div id="chart" class="mt-3">
    <span class="mt-3 mb-3 box-domain">
      <div class="text-left px-3" v-if="$route.name == 'Report'">
        Total Posts
      </div>
      <b-row cols="12">
        <b-col cols="2">
          <div class="g-social">
            <img src="@/assets/cfb.png" class="imgs" />
            <img src="@/assets/ctw.png" class="imgs" />
            <img src="@/assets/cpt.png" class="imgs" />
            <img src="@/assets/cn.png" class="imgs" />
            <img src="@/assets/cyt.png" class="imgs" />
            <img src="@/assets/cig.png" class="imgs" />
            <img src="@/assets/Block.png" class="imgs" />
            <img src="@/assets/tt.png" class="imgs" />
          </div>
        </b-col>
        <b-col cols="10">
          <apexchart
          ref="myBarChart"
            id="chart-domain"
            type="bar"
            height="480"
            :options="chartOptions"
            :series="series"
          ></apexchart>
          <!-- {{ series }} -->
        </b-col>
      </b-row>
    </span>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { mapGetters } from "vuex";
import moment from "moment";
//import axios from "axios";
export default {
  name: "App",
  components: {
    apexchart: VueApexCharts,
  },
  watch: {
    getArrDate: function() {
      this.updateChart();
    },
    getDateReport() {
      this.updateChart();
    },
  },
  data() {
    return {
      sourcelist: [
        "facebook",
        "twitter",
        "pantip",
        "news",
        "youtube",
        "instagram",
        "blockdit",
        "tiktok",
      ],
      countlist: [],
      range: "",
      series: [],
      chartOptions: {
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
        chart: {
          height: 480,
          type: "bar",
          fontFamily: "Prompt, FontAwesome, sans-serif",
        },
        legend: {
          show: false,
        },
        plotOptions: {
          bar: {
            barHeight: "70px",
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: "top",
            },
            borderRadius: 10,
          },
        },
        dataLabels: {
          enabled: true,
        },
        series: [],
        title: {
          text: "",
        },
        noData: {
          text: "Loading...",
        },
        grid: {
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
      },
    };
  },
  computed: {
    ...mapGetters([
      "getClickDomain",
      "getSdateDm",
      "getEdateDm",
      "getArrDate",
      "getDateReport",
    ]),
    getSeries: function() {
      return [
        {
          name: "",
          data: [],
        },
      ];
    },
  },
  methods: {
    async updateChart() {
      let date;
      let startrp;
      let endrp;
      if (this.$route.name == "Report") {
        date = localStorage.getItem("dateReport").split(",");
        startrp = "start=" + date[0];
        endrp = "&end=" + date[1];
      }

      let sdate, edate;
      if (this.getSdateDm || this.getEdateDm) {
        sdate = "&start=" + this.getSdateDm;
        edate = "&end=" + this.getEdateDm;
      } else {
        sdate = "";
        edate = "";
      }
      this.series = [];
      let urlapi;
      if (this.$route.name == "Report") {
        urlapi =
          "https://api2.cognizata.com/api/v2/userposts/getTotalPostsTarget?" +
          startrp +
          endrp;
      } else {
        urlapi =
          "https://api2.cognizata.com/api/v2/userposts/getTotalPosts?domain=" +
          this.getClickDomain +
          sdate +
          edate;
      }

      var config = {
        method: "get",
        url: urlapi,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      await this.axios(config).then((response) => {
        let data = response.data;
        this.range = this.getSdateDm + " - " + this.getEdateDm;
        let tfb = 0,
          tn = 0,
          tpt = 0,
          ttw = 0,
          tyt = 0,
          tig = 0,
          tbd = 0,
          ttt = 0;
        this.countlist = data.map((item) => {
          if (item.source === "youtube") {
            tyt = item.count;
          }
          if (item.source === "facebook") {
            tfb = item.count;
          }
          if (item.source === "pantip") {
            tpt = item.count;
          }
          if (item.source === "news") {
            tn = item.count;
          }
          if (item.source === "twitter") {
            ttw = item.count;
          }
          if (item.source === "instagram") {
            tig = item.count;
          }
          if (item.source === "blockdit") {
            tbd = item.count;
          }
          if (item.source === "tiktok") {
            ttt = item.count;
          }
        });
        //console.log('ttttt',tfb,tn,tpt,ttw,tyt,tig);
        let temp = [
          0 + tfb,
          0 + ttw,
          0 + tpt,
          0 + tn,
          0 + tyt,
          0 + tig,
          0 + tbd,
          0 + ttt,
        ];
        // let temp = [0 + tfb, 0 + tn, 0 + tpt, 0 + ttw, 0 + tyt, 0 + tig,0 + tbd];

        this.series = [
          {
            name: "",
            data: temp,
          },
        ];
        this.chartOptions = {
          chart: {
            height: 480,
            type: "bar",
            fontFamily: "Prompt, FontAwesome, sans-serif",
          },
          title: {
            text: "",
            align: "left",
            fontFamily: "Prompt",
          },
          xaxis: {
            categories: this.sourcelist,
          },
        };
      });
    },
  },
  created: async function() {
    let date;
    let startrp;
    let endrp;
    if (this.$route.name == "Report") {
      date = localStorage.getItem("dateReport").split(",");
      startrp = "start=" + date[0];
      endrp = "&end=" + date[1];
    }

    let sdate, edate, today;
    today = moment(new Date())
      .format()
      .slice(0, 10);
    sdate = "&start=" + today + "T00:00:00";
    edate = "&end=" + today + "T23:59:59";
    // console.log("this.$route.name==", this.$route.name);
    let urlapi;
    if (this.$route.name == "Report") {
      urlapi =
        "https://api2.cognizata.com/api/v2/userposts/getTotalPostsTarget?" +
        startrp +
        endrp;
    } else {
      urlapi =
        "https://api2.cognizata.com/api/v2/userposts/getTotalPosts?domain=" +
        this.getClickDomain +
        sdate +
        edate;
    }
    var config = {
      method: "get",
      url: urlapi,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    };
    await this.axios(config).then((response) => {
      //console.log('response.data',response.data)
      let data = response.data;
      let tfb = 0,
        tn = 0,
        tpt = 0,
        ttw = 0,
        tyt = 0,
        tig = 0,
        tbd = 0,
        ttt = 0;
      this.countlist = data.map((item) => {
        if (item.source === "youtube") {
          tyt = item.count;
        }
        if (item.source === "facebook") {
          tfb = item.count;
        }
        if (item.source === "pantip") {
          tpt = item.count;
        }
        if (item.source === "news") {
          tn = item.count;
        }
        if (item.source === "twitter") {
          ttw = item.count;
        }
        if (item.source === "instagram") {
          tig = item.count;
        }
        if (item.source === "blockdit") {
          tbd = item.count;
        }
        if (item.source === "tiktok") {
          ttt = item.count;
        }
      });
      // console.log("ttttt", tfb, tn, tpt, ttw, tyt, tig);
      let temp = [
        0 + tfb,
        0 + ttw,
        0 + tpt,
        0 + tn,
        0 + tyt,
        0 + tig,
        0 + tbd,
        0 + ttt,
      ];

      this.series = [
        {
          name: "",
          data: temp,
        },
      ];
      // console.log("this.series", this.series);
      this.chartOptions = {
        legend: {
          show: false,
        },
        chart: {
          type: "bar",
          height: 480,
        },
        grid: {
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

        plotOptions: {
          bar: {
            barHeight: "70px",
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: "top",
            },
            borderRadius: 10,
          },
        },
        colors: [
          "#438afe",
          "#595a5b",
          "#521d85",
          "#f1a839",
          "#ef464a",
          "#f97b3e",
          "#336db6",
          "#3f2e4c",
        ],
        dataLabels: {
          enabled: true,
          textAnchor: "start",
          style: {
            colors: ["#000000"],
          },
          formatter: function(val) {
            return val.toLocaleString() + " posts";
          },
          offsetX: 20,
          dropShadow: {
            enabled: false,
          },
        },
        stroke: {
          width: 1,
          colors: ["#fff"],
        },
        xaxis: {
          categories: this.sourcelist,
          labels: {
            formatter: () => {
              return "";
            },
          },
          axisBorder: {
            show: false,
            color: "#78909C",
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            show: false,
            formatter: (value) => {
              return value.toLocaleString();
            },
          },
        },
        title: {
          text: "",
          align: "center",
          floating: true,
        },
        tooltip: {
          theme: "light",
          x: {
            show: true,
          },
          y: {
            formatter: (value) => {
              return value.toLocaleString() + " posts";
            },
            title: {
              formatter: function() {
                return "";
              },
            },
          },
        },
      };
    });
  },
  destroyed() {
    this.series = [];
  },
};
</script>
<style scoped>
.box-domain {
  width: 100%;
  height: auto;
  padding: 20px 20px 0px;
  border-radius: 7px;
  box-shadow: 0 4px 7px 0 rgb(0 0 0 / 20%);
  display: block;
}
.col-10 {
  right: 43px;
}
.g-social {
  margin-top: 35px;
}
.imgs {
  width: 38px;
  display: block;
  margin-bottom: 13px;
}
@media only screen and (min-width: 0px) and (max-width: 1220px) {
  .col-10 {
    right: 23px !important;
  }
}
@media only screen and (min-width: 0px) and (max-width: 991px) {
  .col-2 {
    text-align: -webkit-right;
  }
}
@media only screen and (min-width: 0px) and (max-width: 750px) {
}
</style>
