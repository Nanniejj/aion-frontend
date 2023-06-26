<template>
  <b-col sm="12" md="12" lg="11" align-self="center" class="chart">
    <GChart
      type="ColumnChart"
      :data="chartDataColumn"
      :options="chartOption"
    />
  </b-col>
</template>

<script>
import { mapGetters } from "vuex";
import { GChart } from "vue-google-charts";

export default {
  props: {
    chartDataColumn:{  
      default:[
        ["Name", "Positive", "Neutral", "Negative"],
        ["", 0, 0, 0],
      ]
    },
  },
  data: function () {
    return {
      chartOption:{
        isStacked: true,
        chartArea: {
          top: 15,
          height: "75%",
        },
        legend: { position: "none" },
        colors: ["#54c69d", "#3a86ad", "#f7776a"],
        baselineColor: "#dddddd",
        curveType: "function",
        backgroundColor: "transparent",
        hAxis: {
          slantedText: true,
          gridlines: {
            count: 0,
          },
          textPosition: "out",
          textStyle : {
            fontSize: 13
          }
        },
        vAxis: {
          gridlines: {
            count: 0,
          },
          textPosition: "none",
        },
      },
    };
  },
  components: {
    GChart,
  },
  methods: {
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
    // stmbtn(sentiment,source){
    //         var type = this.type;
    //         this.$router.push({
    //           name: "Post",
    //           query: { type: type, sentiment: sentiment, source: source },
    //         });
    //         }
  },
  computed: {
    ...mapGetters(["getSentimentRanking","getWordCloud","getWordCloudWordChart","getWordCloudHashtagChart"]),
  },
};
</script>

<style scoped>
/* @media print {
  .chart{
    margin-right: 30%;
  }
} */
</style>
