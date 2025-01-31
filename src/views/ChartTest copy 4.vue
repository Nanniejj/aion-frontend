<!-- BarChartComponent.vue -->
<template>
  <div id="chart">
    <apexchart
      type="bar"
      :options="chartOptions"
      :series="series"
      width="1000"
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
          name: "สัปดาห์ที่แล้ว", // This Week
          data: [130, 450, 200, 300, 500], // Scaled by 100
        },
        {
          name: "สัปดาห์นี้", // Last Week
          data: [200, 500, 350, 400, 600], // Scaled by 100
        },
      ],
      chartOptions: {
        dataLabels: {
          style: {
            fontSize: "15px",
            fontWeight: 600,
            colors: ["#000000"], // Adjust the font size for x-axis labels
          },
        },
        chart: {
          fontFamily: "Prompt, FontAwesome, sans-serif",
          style: {
            fontSize: "18px",
            color: "#000000", // Adjust the font size for x-axis labels
          },
          type: "bar",
          height: 600,
          stacked: true,
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: true,
          },
        },
        colors: ["#36BA98", "#F3AA60"], // Updated colors
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 10,
            borderRadiusApplication: "end", // 'around', 'end'
            borderRadiusWhenStacked: "last", // 'all', 'last'
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: "18px", // Adjusted font size for data labels
                  fontWeight: 900,
                  color: "#000000",
                },
              },
            },
          },
        },
        xaxis: {
          type: "",
          categories: [
            "ประเด็นที่1",
            "ประเด็นที่2",
            "ประเด็นที่3",
            "ประเด็นที่4",
            "ประเด็นที่5",
          ],
          rotateAlways: true,
          rotate: -45,
          labels: {
            style: {
              fontSize: "18px", // Adjusted font size for x-axis labels
              color: "#000000", // Set color to black
            },
          },
          title: {
            text: "",
            style: {
              fontSize: "18px", // Adjusted font size for x-axis title
              color: "#000000", // Set color to black
            },
          },
        },
        yaxis: {
          title: {
            text: "",
            style: {
              fontSize: "18px", // Adjusted font size for y-axis title
              color: "#000000", // Set color to black
            },
          },
          labels: {
            style: {
              fontSize: "18px", // Adjusted font size for y-axis labels
              color: "#000000", // Set color to black
            },
          },
        },
        legend: {
          position: "bottom",
          fontSize: "18px", // Adjusted font size for legend labels
          labels: {
            style: {
              fontSize: "18px", // Adjusted font size for legend labels
              color: "#000000", // Set color to black
            },
          },
        },
        fill: {
          opacity: 1,
        },
      },
    };
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
