<!-- BarChartComponent.vue -->
<template>
    <div id="app">
      <apexchart
        type="bar"
        :options="chartOptions"
        :series="series"
        width="1200"
      ></apexchart>
    </div>
  </template>
  
  <script>
  import VueApexCharts from "vue-apexcharts"; // Ensure you have the VueApexCharts package installed
  
  export default {
    components: {
      apexchart: VueApexCharts,
    },
    data() {
      return {
        series: [
          {
            name: 'สัปดาห์ที่แล้ว', // Last Week
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 70]  // 10 data points
          },
          {
            name: 'สัปดาห์นี้', // This Week
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 110]  // 10 data points
          }
        ],
        chartOptions: {
            legend: { fontSize: '18px',},
            colors:['#FF9F66','#59C1BD'],
          chart: {
            type: 'bar',
            height: 350,
            fontFamily: "Prompt, FontAwesome, sans-serif",
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
              endingShape: 'rounded'
            },
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          xaxis: {
            categories: [
              'ประเด็นที่1', 
              'ประเด็นที่2', 
              'ประเด็นที่3', 
              'ประเด็นที่4', 
              'ประเด็นที่5', 
              'ประเด็นที่6', 
              'ประเด็นที่7', 
              'ประเด็นที่8', 
              'ประเด็นที่9', 
              'ประเด็นที่10'
            ],
   
            labels: {
              style: {
                fontSize: '16px'  // Adjust the font size for x-axis labels
              },
              show: true,
 


            },
            
          },
          yaxis: {
            title: {
              text: '',
              style: {
                fontSize: '16px'  // Adjust the font size for y-axis title
              }
            },
            labels: {
              style: {
                fontSize: '16px'  // Adjust the font size for y-axis labels
              }
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return "$ " + val + " thousands"
              }
            }
          }
        }
      };
    }
  };
  </script>
  
  <style scoped>
  /* Add any custom styles here */
  </style>
  