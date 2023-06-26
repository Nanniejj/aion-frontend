<template>
  <div>
    <b-row> 
      <b-col sm="12" md="12" lg="12" >
        <GChart
          type="BarChart"
          :data="getChartData"
          :options="chartOption"
          :events="chartEvents"
          ref="gChart"
          
        />
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col cols="2" class="bl-txt md-font">
        <img
          src="@/assets/Positive.png"
          class="img-size"
          @click="stmbtn({ sentiment: 1, source: source })"
        />
        <div>Positive</div>
        <div class="bold">
          {{ getShortNumber.positive}}
        </div>
      </b-col>
      <b-col cols="2" class="bl-txt md-font">
        <img
          src="@/assets/Neutral.png"
          class="img-size"
          @click="stmbtn({ sentiment: 0, source: source })"
        />
        <div>Neutral</div>
        <div class="bold">
          {{ getShortNumber.neutral }}
        </div>
      </b-col>
      <b-col cols="2" class="bl-txt md-font">
        <img
          src="@/assets/Negative.png"
          class="img-size"
          @click="stmbtn({ sentiment: -1, source: source })"
        />
        <div>Negative</div>
        <div class="bold">
          {{ getShortNumber.negative}}
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { GChart } from "vue-google-charts";
export default {
  props: {
    chartData: {
      default: {
        positive: 0,
        neutral: 0,
        negative: 0,
      },
    },
    pageType: {
      type: String,
    },
    source: {
      type: String,
    },
  },
  data: function () {
    return {
      chartOption: {
   annotations: {
        alwaysOutside: false,
        textStyle: {
            fontSize: 14,
            auraColor: 'none'
        }
    },
        hAxis: {
           minValue: 0,
           textStyle : {
            fontSize: 13 
        },
          gridlines: {
            count: 0,
          },
        },
        vAxis: {
          
          gridlines: {
            count: 0,
          },
        },
        bar: {groupWidth: "75%"},
        legend: { position: "none" },
        baselineColor: "#dddddd",
        curveType: "function",
        colors: ["#54c69d", "#3a86ad", "#f7776a"],
        backgroundColor: "transparent",
      },
      chartEvents: {
        'select': () => {
          if (this.pageType == "DashboardPage") {
          const table = this.$refs.gChart.chartObject;
          const selection = table.getSelection();    
          if (selection[0].row === 0){
            this.stmbtn({ sentiment: 1, source: this.source })
          }
          if (selection[0].row === 1){
            this.stmbtn({ sentiment: 0, source: this.source })
          }
          if (selection[0].row === 2){
            this.stmbtn({ sentiment: -1, source: this.source })
          }
        }
         if (this.pageType == "RankPost") {
          const table = this.$refs.gChart.chartObject;
          const selection = table.getSelection();    
          if (selection[0].row === 0){
            this.stmbtn({ sentiment: 1, source: this.source })
          }
          if (selection[0].row === 1){
            this.stmbtn({ sentiment: 0, source: this.source })
          }
          if (selection[0].row === 2){
            this.stmbtn({ sentiment: -1, source: this.source })
          }
        }
        }
      }
    };
  },
  components: {
    GChart
  },
  methods: {
    stmbtn(datas) {
      console.log(datas);
      // if (this.pageType == "DashboardPage") {
      //   this.$router.push({
      //     name: "DashboardPost",
      //     params: datas,
      //   });
      //   }

      //   if (this.pageType == "RankPost") {
      //   this.$router.push({
      //     name: "RankingPost",
      //     params: datas,
      //   });
      // }

      // } else if (this.pageType == "RankPost") {
      //   this.$router.push({
      //     name: "RankingPost",
      //     params: datas,
      //   });
      // } else if (this.pageType == "WordPost") {
      //   this.$router.push({
      //     name: "WordCloudPost",
      //     params: datas,
      //   });
      // } else {
      //   this.$router.push({
      //     name: "HashtagPost",
      //     params: datas,
      //   });
      // }
    },
    getChangeFormat(num) {
      if (num >= 1000 && num < 1000000) {
        return Math.abs(num) > 999
          ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "K"
          : Math.sign(num) * Math.abs(num);
      } else if (num >= 1000000) {
        return Math.abs(num) > 9999
          ? Math.sign(num) * (Math.abs(num) / 10000).toFixed(1) + "M"
          : Math.sign(num) * Math.abs(num);
      } else {
        return num;
      }
    },
    
  },
  computed: {
    getChartData: function () {
      return [
        ["type", "total", { role: 'annotation'} ,{ role: "style" }],
        ["Positive", this.chartData.positive,this.chartData.positive, "#54c69d"],
        ["Neutral", this.chartData.neutral,this.chartData.neutral, "#3a86ad"],
        ["Negative", this.chartData.negative,this.chartData.negative, "#f7776a"],
      ];
    },

    getShortNumber: function () {
      return {
        positive: this.getChangeFormat(this.chartData.positive),
        neutral: this.getChangeFormat(this.chartData.neutral),
        negative: this.getChangeFormat(this.chartData.negative),
      };
    },
  },
};
</script>

<style scoped>

.img-size {
  width: 30px;
  cursor: pointer;
}

.bl-txt {
  color: black;
  text-align: center;
}

.mb-2 {
  margin: auto;
}

.bg_title img {
  position: absolute;
  width: 40%;
  top: 13px;
  left: 140px;
}
.bg_summarize img {
  width: 118px;
  position: absolute;
}

.bold a {
  color: #695a3d;
}

.legend-first {
  margin-top: 2.9rem !important;
}

.legend {
  margin-top: 1.2rem;
  font-size: 11pt;
  font-weight: bold;
  color: black;
}

.legend a {
  color: #695a3d;
  margin-left: 3px;
}

.legend-bottom {
  padding-left: 400px;
  color: black;
}

.legend-bottom span {
  margin-left: 30px;
}

.legend-bottom span img {
  width: 30px;
}

@media only screen and (min-width: 820px) and (max-width: 990px) {
  .md-font {
    font-size: 1.5vw !important;
  }
}

@media only screen and (min-device-width: 770px) and (max-width: 850px) {
  div #g-chart {
    margin-left: -44px !important;
  }
  .md-font {
    font-size: 2.2vw !important;
  }
  .legend a {
    display: block;
  }
  .img-size {
    width: 5vw !important;
  }
}

@media only screen and (min-device-width: 768px) and (max-device-width: 1000px) {
  .md-font {
    font-size: 2vw !important;
  }
  .legend {
    font-size: 1.7vw !important;
  }
}

@media only screen and (min-width: 375px) and (max-width: 815px) {
  div #g-chart {
    width: 336px;
    overflow: hidden;
    margin-left: -64px !important;
  }
  .bl-txt md-font {
    margin-top: -28px;
    margin-bottom: 10px;
  }
  .bg_title img[data-v-aae30ed8] {
    left: 120px;
  }
  .legend {
    font-size: 1.7vw !important;
  }
  .bl-txt {
    font-size: 2vw !important;
  }
  .legend a {
    display: block;
    margin-left: -4px;
    font-size: 1.5vw !important;
  }
  .md-font {
    font-size: 1.7vw !important;
  }
  .legend {
    margin-top: 11px;
  }
}

@media only screen and (min-width: 0px) and (max-width: 600px) {
  div #g-chart {
    width: 336px;
    overflow: hidden;
    margin-left: -64px !important;
  }
  .bl-txt md-font {
    margin-top: -28px;
    margin-bottom: 10px;
  }
  .bg_title img[data-v-aae30ed8] {
    left: 120px;
  }
  .legend {
    font-size: 3vw !important;
  }
  .bl-txt {
    font-size: 3vw !important;
  }
  .legend a {
    display: block;
    margin-left: -4px;
    font-size: 2.5vw !important;
  }
  .md-font {
    font-size: 3vw !important;
  }
  .legend {
    margin-top: 11px;
  }
}
</style>
