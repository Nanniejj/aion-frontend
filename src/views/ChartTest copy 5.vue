<template>
  <div>
    <apexchart
      type="line"
      :options="chartOptions"
      :series="chartSeries"
      width="1000"
    ></apexchart>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartOptions: {
        chart: {
          fontFamily: "Prompt, FontAwesome, sans-serif",
          type: 'line',
          dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
          },
          zoom: {
            enabled: false
          },
          toolbar: {
            show: false
          },
          background: '#ffffff'
        },
        colors: ["#7030a0", "#00b050", "#ffc000", "#0070c0", "#c00000"],
        dataLabels: {
          enabled: true,
          formatter: function (val, opts) {
            const seriesIndex = opts.seriesIndex;
            const dataPointIndex = opts.dataPointIndex;
            const totalPoints = opts.w.config.series[seriesIndex].data.length;
            // Show data labels only for the last data point in each series
            if (dataPointIndex === totalPoints - 1) {
              return val;
            }
            return '';
          },
          style: {
            fontSize: '18px'
          },
          offsetY: -10
        },
        stroke: {
          curve: 'smooth'
        },
        title: {
          text: '',
          align: 'left',
          style: {
            fontSize: '16px'
          }
        },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
          },
          background: '#ffffff'
        },
        markers: {
          size: [5, 5, 5, 5, 5, 5, 7], // Set marker size larger for the last point
          hover: {
            size: 7
          }
        },
        xaxis: {
          categories: ['17 ก.ค. 67', '18 ก.ค. 67', '19 ก.ค. 67', '20 ก.ค. 67', '21 ก.ค. 67', '22 ก.ค. 67', '23 ก.ค. 67'],
          rotateAlways: true,
          rotate: -45,
          title: {
            text: 'Date',
            style: {
              fontSize: '14px'
            }
          },
          labels: {
            style: {
              fontSize: '18px'
            }
          }
        },
        yaxis: {
          title: {
            text: '',
            style: {
              fontSize: '19px'
            }
          },
          labels: {
            style: {
              fontSize: '18px'
            }
          },
          min: 0,
          max: 750
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -25,
          offsetX: -5
        }
      },
      chartSeries: [
        {
          name: 'Team C',
          data: [30, 60, 90, 120, 150, 180, 210]
        },
        {
          name: 'Team D',
          data: [45, 90, 135, 180, 225, 270, 315]
        },
        {
          name: 'Team E',
          data: [60, 120, 180, 240, 300, 360, 420]
        },
        {
          name: 'Team F',
          data: [75, 150, 225, 300, 375, 450, 650]
        },
        {
          name: 'Team G',
          data: [90, 180, 270, 360, 450, 540, 750]
        }
      ]
    };
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
