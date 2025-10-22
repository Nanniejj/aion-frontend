<template>
  <!-- <b-row> -->
    <b-col cols="auto">
        <!-- <client-only> -->
          <apexchart type="donut" height="340" :options="chartOptions" :series="series" />
        <!-- </client-only> -->
    </b-col>
    <!-- {{ platform }} -->
  <!-- </b-row> -->
</template>

<script>

import VueApexCharts from "vue-apexcharts";

export default {
  name: "PlatformDonutChart",
  components: { apexchart: VueApexCharts },
  props: {
    // ตัวอย่าง: { facebook: 0, twitter: 0, ... }
    platform: {
      type: Object,
      required: true
    }
  },
  computed: {
    platformLabels() {
      return [
        "facebook", "twitter", "instagram", "pantip",
        "youtube", "news", "tiktok", "blockdit", "threads"
      ];
    },
    labelMap() {
      return {
        facebook: "Facebook",
        twitter: "X",
        instagram: "Instagram",
        pantip: "Pantip",
        youtube: "YouTube",
        news: "News",
        tiktok: "TikTok",
        blockdit: "Blockdit",
        threads: "Threads"
      };
    },
    colorMap() {
      return {
        facebook: "#4c77bb",
        twitter: "#727373",
        instagram: "#dc7848",
        pantip: "#532d84",
        youtube: "#e24246",
        news: "#f3b557",
        tiktok: "#5c4d67",
        blockdit: "#1F76BD",
        threads: "#e75aa1"
      };
    },
    series() {
      return this.platformLabels.map(k => Number(this.platform[k] || 0));
    },
    totalPosts() {
      return this.series.reduce((a, b) => a + b, 0);
    },
    chartOptions() {
      const labels = this.platformLabels.map(k => this.labelMap[k] || k);
      const colors = this.platformLabels.map(k => this.colorMap[k] || "#ccc");
      const self = this;

      return {
        chart: {
          type: "donut",
          toolbar: { show: false },
          fontFamily: "Prompt, sans-serif"
        },
        labels,
        colors,
        legend: {
          show: false,
          position: "right",
          horizontalAlign: "center",
          fontSize: "14px",
          formatter(seriesName, opts) {
            const w = opts && opts.w ? opts.w : {};
            const seriesArr = (w.globals && w.globals.series) || [];
            const idx = typeof opts?.seriesIndex === "number" ? opts.seriesIndex : -1;
            const val = idx >= 0 ? Number(seriesArr[idx] || 0) : 0;

            const total = self.totalPosts;
            const percent = total > 0 ? ((val / total) * 100).toFixed(1) : "0.0";
            return `${seriesName}: ${val} โพสต์ (${percent}%)`;
          }
        },
        tooltip: {
          y: {
            formatter(val, opts) {
              const w = opts && opts.w ? opts.w : {};
              const labels = (w.globals && w.globals.labels) || [];
              const idx = typeof opts?.seriesIndex === "number" ? opts.seriesIndex : -1;
              const name = idx >= 0 ? (labels[idx] || "") : "";

              const total = self.totalPosts;
              const percent = total > 0 ? ((val / total) * 100).toFixed(1) : "0.0";
              return `${name}: ${val} โพสต์ (${percent}%)`;
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter(val/*, opts */) {
            // val can be undefined very early; guard and format safely
            const num = Number.isFinite(val) ? val : 0;
            return `${num.toFixed(1)}%`;
          },
          background: {
            enabled: true,
            // สีตัวอักษร
            foreColor: "#000",
            // สีพื้นหลัง (ถ้าอยากให้เข้ม/อ่อน ปรับได้)
            fill: "#000",          // <— สีพื้นหลัง
            opacity: 0.85,         // ความทึบพื้นหลัง
            padding: 4,            // ระยะห่างด้านใน
            borderRadius: 6,       // มุมโค้ง
            borderWidth: 0,        // เส้นขอบ
            borderColor: "#000",   // สีเส้นขอบ (ถ้า borderWidth > 0)
            dropShadow: { enabled: false }
          },
          dropShadow: { enabled: false }
        }
        ,
        plotOptions: {
          pie: {
            donut: {
              size: "60%",
              labels: {
                show: true,
                name: { show: true, fontSize: "13px" },
                value: {
                  show: true,
                  fontSize: "18px",
                  formatter(val) {
                    return `${Number(val).toLocaleString()}`;
                  }
                },
                total: {
                  show: true,
                  label: "รวมโพสต์",
                  formatter() {
                    return self.totalPosts.toLocaleString();
                  }
                }
              }
            }
          }
        },
        stroke: { width: 1 },
        responsive: [
          {
            breakpoint: 890,
            options: {
              legend: { fontSize: "12px",  position: "bottom", }
            }
          }
        ]
      };
    }
    },
    methods: {
       
    }
};
</script>

<style scoped>
.img-issue {
  width: 24px;
  height: 24px;
}
.small-sub {
  font-size: x-small;
}
</style>