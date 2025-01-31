<template>
    <div id="chart"></div>
  </template>
  
  <script>
  import ApexCharts from "apexcharts";
  
  export default {
    data() {
      return {
        options: {
          series: [
            {
              name: 'Actual',
              data: [
                {
                  x: 'C',
                  y: 5,
                 
                },
                {
                  x: 'D',
                  y: 4,
                 
                },
                {
                  x: 'E',
                  y: 2,
                 
                },
                {
                  x: 'F',
                  y: 2,
                 
                },
                {
                  x: 'G',
                  y: 15,
                
                }
              ]
            }
          ],
          chart: {
            height: 450,
            type: 'bar'
          },
          plotOptions: {
            bar: {
              columnWidth: '80%',
              distributed: true // Make sure each bar gets its own color
            }
          },
          colors: ["#7030a0", "#00b050", "#ffc000", "#0070c0", "#c00000"], // Different colors for each bar
          dataLabels: {
            enabled: false
          },
          legend: {
            show: true,
            showForSingleSeries: true,
            customLegendItems: ['Actual', 'Expected'],
            markers: {
              fillColors: ['#00E396', '#775DD0']
            }
          },
          xaxis: {
            categories: ['C', 'D', 'E', 'F', 'G'],
            labels: {
              style: {
                fontSize: '20px'
              }
            }
          },
          yaxis: {
            labels: {
              style: {
                fontSize: '18px'
              }
            }
          }
        }
      };
    },
    mounted() {
      const chart = new ApexCharts(document.querySelector("#chart"), this.options);
      chart.render();
    }
  };
  </script>
  
  <style scoped>
  /* #chart {
    max-width: 800px;
    margin: 35px auto;
  } */
  </style>
  