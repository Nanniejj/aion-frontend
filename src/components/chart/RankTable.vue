<template>
  <div id="chart">
    <apexchart type="bar" height="400" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import axios from "axios";

export default {
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      series: [],
      chartOptions: {
        chart: {
          type: "bar",
          fontFamily: "Prompt, sans-serif",
        },
        plotOptions: {
          bar: {
            columnWidth: '30',
            distributed: true,
            dataLabels: {
              position: 'top', // top, center, bottom
              enabled: true,
              formatter: function (val) {
                return val + "%";
              },
              offsetY: -20,
              style: {
                fontSize: '12px',
                colors: ["#304758"]
              }
            },
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val + "%";
          },
          offsetY: -50,
          style: {
            fontSize: '12px',
            colors: ["#304758"]
          }
        },

        title: {
          text: "จำนวนโพสต์ตาม Subdomain",
          align: "left",
        },
        xaxis: {
          type: 'category',
          categories: [],
          labels: {
            rotate: -45
          }
        },
        dataLabels: {
          enabled: true
        },
        tooltip: {
          y: {
            formatter: (val) => Number(val).toLocaleString()
          }
        },
      },
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v2/ranking/getSubdomainCount?domain_id=2&start=2025-06-01T00:00:00&end=2025-06-01T23:59:59"
        );
        const data = response.data.data;

        const categories = data.map(item => item.name);
        const counts = data.map(item => item.count);

        this.series = [{
          name: "จำนวนโพสต์",
          data: counts
        }];

        // ทำ deep copy chartOptions เพื่อ force reactivity
        this.chartOptions = {
          ...this.chartOptions,
          xaxis: {
            ...this.chartOptions.xaxis,
            categories
          }
        };

        // console.log("Chart updated:", this.chartOptions, this.series);

      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>
