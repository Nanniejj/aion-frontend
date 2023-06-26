<template>
  <div>
    <b-row>
      <b-col cols="12">
        <GChart
          :settings="{ packages: ['line'] }"
          type="LineChart"
          :data="chartDataTimeline"
          :options="chartOptions"
          ref="FBgChartMonthLine"
          :createChart="(el, google) => new google.charts.Line(el)"
          @ready="onChartReady"
          :resizeDebounce="500"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { GChart } from "vue-google-charts";
export default {
  props: {
    // checkDate: {
    //   default: {
    //     day: "Today",
    //     week: "Last week",
    //     month: "1 month",
    //   },
    // },
    chartDataTimeline: {
      default: [
        ["Date", "Object", "y"],
        [0, 0, 0],
      ],
    },
  },
  data: function () {
    return {
      chartsLib: null,
      chartOptions: {
        height: 500,
        // width: 1000,
        hAxis: {
          gridlines: {
            count: 10,
          },
        },
        vAxis: {
          gridlines: {
            count: 10,
          },
        },
        theme: "material",
        legend: {
          position: "bottom",
        },
        // legend: {
        //   position: "top",
        // },
      },
    };
  },
  components: {
    GChart,
  },
  computed: {
    ...mapGetters(["getDateChoice", "getTrendRanking"]),
    chartType: function () {
      if (this.getDateChoice === "weekly") return "ColumnChart";
      else if (this.getDateChoice === "monthly") return "LineChart";
      else return "BarChart";
    },
    getCheckDate: function () {
      return [
        ["type", "total"],
        ["day", this.checkDate.day],
        ["week", this.checkDate.week],
        ["month", this.checkDate.month],
      ];
    },
  },
  methods: {
    onChartReady(chart, google) {
      this.chartsLib = google;
    },
  },
};
</script>

<style></style>
