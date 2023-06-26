<template>
  <div id="chart">
    <apexchart
      type="bar"
      height="350"
      :options="getOp"
      :series="getSeries"
    ></apexchart>
    <!-- {{getSeries}}
    {{ this.getDomainReportChart.domain}} -->
    <!-- {{ getDomainReportChart }} -->
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { mapGetters } from "vuex";
// import moment from "moment";
export default {
  components: {
    apexchart: VueApexCharts,
  },
  computed: {
    ...mapGetters(["getDomainReportChart"]),
    getSeries() {
      let count = this.getDomainReportChart.count;
      let se = [
        {
          name: "",
          data: count,
        }
      ]
      return se;
    },
    getOp() {
      let name = this.getDomainReportChart.domain;
      let chartOptions =   {
        chart: {
          height: 350,
          type: "bar",
          fontFamily: "Prompt, FontAwesome, sans-serif",
        },
        
         noData: {
          text: "Loading...",
        },
        plotOptions: {
          bar: {
            borderRadius:5,
            columnWidth: "50%",
             horizontal: true,
               dataLabels: {
          enabled: true,
        },
          },
        },
        dataLabels: {
         enabled: true,
          textAnchor: "middle",
          style: {
            colors: ["#000000"],
          },
          formatter: function(val) {
            return val.toLocaleString() ;
          },
        //   offsetX:50,
          dropShadow: {
            enabled: false,
          },
        },
        stroke: {
          width: 0,
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
        xaxis: {
      
          categories: name,
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
            formatter: (value) => {
              return value.toLocaleString();
            },
          },
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
        fill: {
          // colors: ['#85a4cb'],
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: ["#85a4cb"],
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [0, 100],
          },

        },
      }
      return chartOptions;
    },
  },
  data() {
    return {
      series: [
        {
          name: "",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          height: 250,
          type: "bar",
          fontFamily: "Prompt, FontAwesome, sans-serif",
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            columnWidth: "50%",
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 0,
        },

        grid: {
          row: {
            colors: ["#fff", "#f2f2f2"],
          },
        },

        yaxis: {
          title: {
            text: "Posts",
          },
        },
        fill: {
          // colors: ['#85a4cb'],
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: ["#85a4cb"],
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [0, 100],
          },
        },
      },
    };
  },
  mounted() {
    if (this.getDomainReportChart&&this.getDomainReportChart.domain) {
         this.chartOptions={
        chart: {
          height: 350,
          type: "bar",
          fontFamily: "Prompt, FontAwesome, sans-serif",
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            columnWidth: "50%",
             horizontal: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 0,
        },

        grid: {
          row: {
            colors: ["#fff", "#f2f2f2"],
          },
        },
        xaxis: {
          labels: {
            rotate: -45,
          },
          categories: this.getDomainReportChart.domain,
       
        },
        yaxis: {
          title: {
            text: "",
          },
        },
        fill: {
          // colors: ['#85a4cb'],
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: ["#85a4cb"],
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [0, 100],
          },
        },
      }
    }
   
  },
};
</script>

<style></style>
