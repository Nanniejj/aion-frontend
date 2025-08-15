<template>
  <div>
    <apexchart
      type="bar"
      height="350"
      :options="chartOptions"
      :series="seriesData"
    />
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  name: "SentimentBarChart",
  components: {
    apexchart: VueApexCharts
  },
  props: {
    chartData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chartOptions: {
          grid: { show: false },
        chart: {
          type: "bar",
          stacked: true,
          toolbar: { show: false },
          fontFamily: "Prompt, sans-serif"
        },
        plotOptions: {
            
          bar: {
            horizontal: true,
            borderRadius: 5,
            borderRadiusApplication: "end",
            barHeight: "80%"
          }
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              fontSize: "13px"
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: val => (val === 0 ? "" : this.formatCash(val))
        },
        colors: ["#53b993", "#368ab6", "#ea7668"], // Positive / Neutral / Negative
        tooltip: {
          y: { formatter: val => Number(val).toLocaleString() }
        },
        legend: { position: "bottom" }
      },
      seriesData: []
    };
  },
  watch: {
    chartData: {
      handler() {
        this.prepareChart();
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    prepareChart() {
      // เตรียม categories
      const categories = this.chartData.map((item, index) => {
        return item.name
          ? item.name.length > 15
            ? item.name.slice(0, 15) + "..."
            : item.name
          : `Item ${index + 1}`;
      });

      // เตรียม series
      const positive = this.chartData.map(
        item =>
          item.count.find(c => c.sentiment === 1)?.count || 0
      );
      const neutral = this.chartData.map(
        item =>
          item.count.find(c => c.sentiment === 0)?.count || 0
      );
      const negative = this.chartData.map(
        item =>
          item.count.find(c => c.sentiment === -1)?.count || 0
      );

      this.seriesData = [
        { name: "Positive", data: positive },
        { name: "Neutral", data: neutral },
        { name: "Negative", data: negative }
      ];

      this.chartOptions = {
        ...this.chartOptions,
        xaxis: { ...this.chartOptions.xaxis, categories }
      };
    },
    formatCash(n) {
      if (n < 1e3) return n;
      if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
      if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
      if (n >= 1e9) return +(n / 1e9).toFixed(1) + "B";
    }
  }
};
</script>
