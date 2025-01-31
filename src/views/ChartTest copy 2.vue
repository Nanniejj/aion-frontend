<!-- ForecastChart.vue -->
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
          background: '#ffffff'  // Set background color to white
        },
        colors: ["#7030a0", "#00b050", "#ffc000", "#0070c0", "#c00000"],
        dataLabels: {
          enabled: false,
          formatter: function (val) {
            return val;
          },
          style: {
            fontSize: '12px'  // Adjust the font size for data labels
          }
        },
        stroke: {
          curve: 'smooth'
        },
        title: {
          text: '',
          align: 'left',
          style: {
            fontSize: '16px'  // Adjust the font size for the title
          }
        },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'], // Takes an array which will be repeated on columns
            opacity: 0.5
          },
          background: '#ffffff'  // Set grid background color to white
        },
        markers: {
          size: 5,
          hover: {
            size: 7
          }
        },
        xaxis: {
          categories: ['ก.ค.', 'ส.ค.', 'ก.ย.', 'เป้าหมาย'],
          title: {
            text: 'Month',
            style: {
              fontSize: '14px'  // Adjust the font size for the x-axis title
            }
          },
          labels: {
            style: {
              fontSize: '18px'  // Adjust the font size for x-axis labels
            }
          }
        },
        yaxis: {
          title: {
            text: '',
            style: {
              fontSize: '19px'  // Adjust the font size for the y-axis title
            }
          },
          labels: {
            style: {
              fontSize: '18px'  // Adjust the font size for y-axis labels
            }
          },
          min: 0,
          max: 750  // Adjusted to fit the highest values
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
          data: [30, 100, 200, 300]  // Randomized values
        },
        {
          name: 'Team D',
          data: [90, 180, 270, 500]  // Randomized values
        },
        {
          name: 'Team E',
          data: [110, 300, 500, 650]  // Randomized values
        },
        {
          name: 'Team F',
          data: [130, 220, 310, 600]  // Randomized values
        },
        {
          name: 'Team G',
           data: [150, 350, 550, 700]  // Randomized values
        }
      ]
      // chartSeries: [
      //   {
      //     name: 'Team C',
      //     data: [null, null, null, null]  // Randomized values
      //   },
      //   {
      //     name: 'Team D',
      //     data:  [null, null, null, null]  // Randomized values
      //   },
      //   {
      //     name: 'Team E',
      //     data:  [null, null, null, null]  // Randomized values
      //   },
      //   {
      //     name: 'Team F',
      //     data: [null, null, null, null]  // Randomized values
      //   },
      //   {
      //     name: 'Team G',
      //      data:  [null, null, null, null]  // Randomized values
      //   }
      // ]
    };
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
