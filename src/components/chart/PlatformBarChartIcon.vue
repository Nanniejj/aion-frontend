<template>
  <div>
    <apexchart
      ref="apex"
      type="bar"
      height="80"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>
<script>
import VueApexCharts from "vue-apexcharts";
export default {
  name: "PlatformBarChart",
  components: { apexchart: VueApexCharts },
  props: { platform: { type: Object, required: true } },

  data() {
    return {
      // ใช้ require กับ Vue2/webpack (ถ้าใช้ import ก็ได้ผลเหมือนกัน)
      iconMap: {
        facebook: require("@/assets/cfb.png"),
        twitter:  require("@/assets/ctw.png"),
        instagram: require("@/assets/cig.png"),
        pantip:   require("@/assets/cpt.png"),
        youtube:  require("@/assets/cyt.png"),
        news:     require("@/assets/cn.png"),
        tiktok:   require("@/assets/tt.png"),
        blockdit: require("@/assets/Block.png"),
        threads:  require("@/assets/ctd.png"),
      },
      chartOptions: null, // จะเซ็ตใน created()
    };
  },
  computed: {
    platformLabels() {
      return ["facebook","twitter","instagram","pantip","youtube","news","tiktok","blockdit","threads"];
    },
    labelMap() {
      return {
        facebook:"Facebook", twitter:"X", instagram:"Instagram", pantip:"Pantip",
        youtube:"YouTube", news:"News", tiktok:"TikTok", blockdit:"Blockdit", threads:"Threads"
      };
    },
    colorMap() {
      return {
        facebook:"#4c77bb", twitter:"#727373", instagram:"#dc7848", pantip:"#532d84",
        youtube:"#e24246", news:"#f3b557", tiktok:"#5c4d67", blockdit:"#1F76BD", threads:"#e75aa1"
      };
    },
    totalPosts() {
      return this.platformLabels.reduce((s,k)=> s + (this.platform[k] || 0), 0);
    },
    series() {
      return this.platformLabels.map(key => ({
        name: this.labelMap[key] || key,
        data: [this.platform[key] || 0],
      }));
    },
  },
  methods: {
    buildOptions() {
      const vm = this;
      const total  = vm.totalPosts;
      const colors = vm.platformLabels.map(k => vm.colorMap[k] || "#ccc");
      // ปิดค่า icons ตามลำดับ series ไว้ใน closure (กัน this/รีแอคทีฟเพี้ยน)
      const icons  = vm.platformLabels.map(k => vm.iconMap[k] || "");
      let callIndex = -1; // fallback counter

      return {
        chart: {
          type: "bar",
          stacked: true,
          stackType: "100%",
          toolbar: { show: false },
          fontFamily: "Prompt, sans-serif",
        },
        colors,
        plotOptions: { bar: { horizontal: true, barHeight: "85%", offsetY: 0 } },
        grid: { show: false },
        xaxis: { categories: [""], labels: { show: false }, axisTicks: { show: false }, axisBorder: { show: false } },
        yaxis: { show: false },
        dataLabels: { enabled: true, style: { colors: ["#fff"] } },
        tooltip: {
          y: {
            formatter(val, opts) {
              const sum = opts.w.globals.seriesTotals.reduce((a,b)=>a+b,0);
              const pct = sum > 0 ? ((val/sum)*100).toFixed(1) : 0;
              const name = opts.w.config.series[opts.seriesIndex].name;
              return ` ${val.toLocaleString()} โพสต์ (${pct}%)`;
            }
          }
        },
        legend: {
          show: false,
          position: "bottom",
          horizontalAlign: "left",
          fontSize: "13px",
          itemMargin: { horizontal: 10, vertical: 6 },
          markers: {
            // รองรับ arg ได้ทั้ง number, {seriesIndex}, หรือไม่มีเลย
            customHTML(arg) {
              let idx;
              if (typeof arg === "number") {
                idx = arg;
              } else if (arg && typeof arg.seriesIndex === "number") {
                idx = arg.seriesIndex;
              } else {
                callIndex += 1;
                idx = callIndex;
              }

              const src = icons[idx] || "";
              if (src) {
                // ใช้ background-image เพื่อความเสถียร
                return (
                  '<span style="display:inline-block;width:15px;height:15px;' +
                  "background-image:url('" + src + "');background-size:contain;" +
                  "background-repeat:no-repeat;background-position:center;border-radius:4px;" +
                  '"></span>'
                );
              }
              // Fallback เป็น badge ตัวอักษร
              const key = vm.platformLabels[idx] || "";
              const bg  = vm.colorMap[key] || "#ccc";
              const ch  = (key && key[0] ? key[0] : "?").toUpperCase();
              return (
                '<span style="display:inline-flex;align-items:center;justify-content:center;' +
                'width:15px;height:15px;border-radius:4px;background:' + bg + ';color:#fff;' +
                'font-weight:700;font-size:11px;line-height:1;">' + ch + "</span>"
              );
            },
            width: 18,
            height: 18,
          },
          // ให้รูปทำหน้าที่แทน label; ข้อความเป็นตัวเลขล้วน (ห้าม HTML)
          formatter(_seriesName, opts) {
            const val = opts.w.config.series[opts.seriesIndex].data[0] || 0;
            const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
            return `${val.toLocaleString()}  (${pct}%)`;
          },
        },
        fill: { opacity: 1 },
      };
    },
    rerenderLegend() {
      if (this.$refs.apex && this.$refs.apex.updateOptions) {
        this.$refs.apex.updateOptions(
          { legend: { markers: { customHTML: this.buildOptions().legend.markers.customHTML } } },
          false,
          true
        );
      }
    },
  },
  created() {
    // สร้าง options ด้วยค่าเริ่มต้น (ปิดค่าด้วย closure แล้ว)
    this.chartOptions = this.buildOptions();
  },
  mounted() {
    // บังคับให้ legend render อีกรอบ หลังทุกอย่างพร้อม
    this.$nextTick(() => this.rerenderLegend());
  },
  watch: {
    // ถ้าค่า platform เปลี่ยน ให้ rebuild options และ rerender
    platform: {
      deep: true,
      handler() {
        this.chartOptions = this.buildOptions();
        this.$nextTick(() => this.rerenderLegend());
      }
    }
  }
};
</script>
