<template>
  <div id="chart">
    <apexchart
      width="100%"
      type="radialBar"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import VueApexCharts from 'vue-apexcharts';

Vue.component('apexchart', VueApexCharts);

export default {
  name: 'RadialBarChart',
  data() {
    return {
      series: [79, 89, 64, 77,84],
      chartOptions: {
      
        chart: {
          height: 390,
          type: 'radialBar',
        },
        dataLabels: {
              name: {
                show: true,
              },
              value: {
                show: true,
              },
            },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
              margin: 5,
              size: '30%',
              background: 'transparent',
              image: undefined,
            },
            dataLabels: {
              name: {
                show: true,
              },
              value: {
                show: true,
              },
              
            },
            barLabels: {
              enabled: true,
              useSeriesColors: true,
              offsetX: -8,
              fontSize: '16px',
              formatter (seriesName, opts){
                console.log('seriesName',seriesName);
                
                return seriesName + ':  ' + opts.w.globals.series[opts.seriesIndex];
              },
            },
          },
        },
        colors: ["#7030a0", "#00b050", "#ffc000", "#0070c0", "#c00000"],
        labels: ['C', 'D', 'E', 'F','G'],
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                show: true,
              },
            },
          },
        ],
      },
    };
  },
};
</script>

<style scoped>
/* #chart {
  max-width: 650px;
  margin: 35px auto;
} */
</style>
