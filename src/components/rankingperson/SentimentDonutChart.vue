<template>
  <div>
    <apexchart
      type="donut"
      :options="chartOptions"
      :series="series"
      height="130"
    />
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

export default {
  name: 'DonutChart',
  components: {
    apexchart: VueApexCharts
  },
  props: {
    // รับข้อมูลจาก parent ถ้าต้องการ
    sentimentSeries: {
      type: Array,
      default: () => []
    },
    labels: {
      type: Array,
      default: () => ['positive', 'neutral', 'negative']
    },
    height: {
      type: [String, Number],
      default: 350
    }
  },
  data() {
    return {
      series: this.sentimentSeries,
      chartOptions: {
        chart: {
          type: 'donut',
          toolbar: {
            show: false
          }
        },
        labels: this.labels,
          legend: {
            show: false,
            position: 'bottom'
        },
        plotOptions: {
          pie: {
            donut: {
              size: '80%',
              labels: {
                show: false,
                total: {
                  show: true,
                  label: 'Total',
                  formatter: (w) => {
                    // คำนวณรวมของ series
                    const total = w.globals.seriesTotals.reduce((a,b) => a + b, 0)
                    return total
                  }
                }
              }
            }
          }
        },
        dataLabels: {
          enabled: false,
          formatter: function (val, opts) {
            // แสดงเปอร์เซ็นต์ด้วยทศนิยม 1 ตำแหน่ง
            return val.toFixed(1) + '%'
          }
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300
              },
                legend: {
                show: false,
                position: 'bottom'
              }
            }
          }
        ],
        // ตัวอย่างสี (ถ้าต้องการกำหนด)
        colors: ['#53b993', '#368ab6', '#f06964'],
        tooltip: {
            enabled: true,
            style: {
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',     // ทำให้ตัวหนา
            },
            // y: {
            //     formatter: function (value, opts) {
            //         if (!opts || !opts.w || !opts.w.globals) {
            //             return value + ' %';
            //         }
            //         const total = opts.w.globals.seriesTotals.reduce((a, b) => a + b, 0);
            //         const percent = (value / total) * 100;
            //         return percent.toFixed(1) + ' %';
            //     }
            // }
        }
      }
    }
  },
  watch: {
    sentimentSeries(newVal) {
      this.series = newVal
    },
    labels(newVal) {
      this.chartOptions = Object.assign({}, this.chartOptions, { labels: newVal })
    }
  },
  methods: {
    // ตัวอย่างเมธอดอัปเดตข้อมูลแบบไดนามิก
    updateSeries(newSeries) {
      this.series = newSeries
    }
  }
}
</script>

<style scoped>
.apexcharts-tooltip {
  z-index: 9999 !important;
  pointer-events: none; /* ถ้าไม่อยากให้โดน block interaction */
}
/* ใส่สไตล์เพิ่มถ้าต้องการ */
</style>
