<template>
  <GChart 
    type="PieChart" 
    :data="OverallData" 
    :options="chartOptionsPie" 
  />
</template>

<script>
import { mapGetters } from "vuex";
import { GChart } from "vue-google-charts";

export default {
  props: {
    OverallData: {
      defalut: [
        ["Socials", "Users"],
        ["", 0],
        ["", 0],
        ["", 0],
        ["", 0],
        ["", 0],
        ["", 0],
      ],
    },
  },
  data() {
    return {
      chartOptionsPie: {
        pieHole: 0.4,
        isStacked: true,
        chartArea: {
          left: 0,
          right: 0,
          bottom: 30,
          top: 0,
          width: "90%",
          height: "90%",
        },
        legend: { position: "none" },
        colors: [
          "#4867aa", //fb
          "#55adec", //tw
          "#ff9773", //ig
          "#522981", //pt
          "#fed16e", //nw
          "#f26666", //yt
          "#396eb6",//bd
          "#3f2e4c",//tt
        ],
        baselineColor: "#dddddd",
        hAxis: {
          gridlines: {
            count: 0,
          },
          textPosition: "none",
        },
        vAxis: {
          gridlines: {
            count: 0,
          },
          textPosition: "none",
        },
      }
      // cssText: `
      // @media print {
      //   .pie {
      //     margin-left: -100px;
      //   }
      // }
      // `
    };
  },
  components: {
    GChart,
  },
  computed: {
    ...mapGetters([
      "getWordCloud",
      "getSentiment",
      "getWordCloudHashtagChart",
      "getSentimentChart",
      "getSentimentHashtagChart",
      "getSentimentRankingChart",
    ]),
  },
};
</script>

<style scoped>
/* @media print {
  .pie {
    margin-left: -20px;
  }
} */
</style>
