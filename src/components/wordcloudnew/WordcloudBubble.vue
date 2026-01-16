<template>
  <div class="bubble-box">
    <vue-element-loading
      :active="loading"
      size="80"
      background-color="rgba(255,255,255,0.5)"
      color="#b6ac9a"
    />

    <apexchart
      v-if="series[0].data.length"
      type="bubble"
      height="420"
      :options="options"
      :series="series"
    />

    <div v-else class="text-center text-muted py-4">
      ไม่พบข้อมูล Bubble
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  name: "WordcloudBubble",
  components: { apexchart: VueApexCharts },
  props: {
    // รับ items เป็น array ของ wordcloud data
    // [{ name, total, count:[{sentiment:1,count},{sentiment:0,count},{sentiment:-1,count}] }]
    items: { type: Array, default: () => [] },

    // topN จำกัดจำนวนจุด เพื่อไม่ให้หนัก
    topN: { type: Number, default: 60 },

    // ถ้าต้องการปรับขนาด bubble เพิ่ม/ลด
    sizeScale: { type: Number, default: 1.0 },

    loading: { type: Boolean, default: false }
  },

  computed: {
    normalized() {
      const get = (row, s) =>
        (row.count || []).find(x => x.sentiment === s)?.count || 0;

      return (this.items || [])
        .map(r => {
          const pos = Number(get(r, 1));
          const neu = Number(get(r, 0));
          const neg = Number(get(r, -1));
          const total = Number(r.total != null ? r.total : (pos + neu + neg)) || 0;
          const net = total ? (pos - neg) / total : 0; // -1..1

          return {
            name: r.name || "",
            pos, neu, neg,
            total,
            net: Number(net.toFixed(3))
          };
        })
        .filter(x => x.name && x.total > 0)
        .sort((a, b) => b.total - a.total)
        .slice(0, this.topN);
    },

    series() {
      // apex bubble: [{x, y, z, name}]
      return [
        {
          name: "Words",
          data: this.normalized.map(d => ({
            x: d.total,
            y: d.net,
            z: Math.max(5, Math.round(d.total * this.sizeScale)), // กันเล็กเกินไป
            name: d.name,
            meta: d // เก็บไว้ใช้ใน tooltip/click
          }))
        }
      ];
    },

    options() {
      return {
        chart: {
          toolbar: { show: true },
          zoom: { enabled: true },
          events: {
            dataPointSelection: (event, chartContext, config) => {
              const d = config?.w?.config?.series?.[config.seriesIndex]?.data?.[config.dataPointIndex];
              if (d?.name) this.$emit("select-word", d.name);
            }
          }
        },

        dataLabels: { enabled: false },

        xaxis: {
          title: { text: "Total Mentions" },
          labels: { formatter: v => Number(v).toLocaleString() }
        },

        yaxis: {
          min: -1,
          max: 1,
          title: { text: "Net Sentiment (pos-neg)/total" },
          labels: { formatter: v => Number(v).toFixed(2) }
        },

        tooltip: {
          custom: ({ seriesIndex, dataPointIndex, w }) => {
            const d = w.config.series[seriesIndex].data[dataPointIndex];
            const m = d.meta || {};
            const pct = (n) => (m.total ? ((n / m.total) * 100).toFixed(1) : "0.0");

            return `
              <div style="padding:10px 12px;min-width:220px">
                <div style="font-weight:700;margin-bottom:6px">${d.name}</div>
                <div>Total: <b>${Number(m.total||0).toLocaleString()}</b></div>
                <div>Net: <b>${Number(m.net||0).toFixed(2)}</b></div>
                <hr style="margin:8px 0;border:none;border-top:1px solid #eee" />
                <div>✅ Positive: ${Number(m.pos||0).toLocaleString()} (${pct(m.pos)}%)</div>
                <div>➖ Neutral: ${Number(m.neu||0).toLocaleString()} (${pct(m.neu)}%)</div>
                <div>❌ Negative: ${Number(m.neg||0).toLocaleString()} (${pct(m.neg)}%)</div>
                <div style="margin-top:8px;color:#777">คลิกเพื่อดูโพสต์คำนี้</div>
              </div>
            `;
          }
        },

        legend: { show: false }
      };
    }
  }
};
</script>

<style scoped>
.bubble-box {
  background: #fff;
  border-radius: 8px;
  padding: 8px;
}
</style>
