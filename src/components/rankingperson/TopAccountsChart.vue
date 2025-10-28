<!-- TopAccountsChart.vue -->
<template>
  <div>
    <apexchart
      ref="ac"
      type="bar"
      height="420"
      :options="chartOptions"
      :series="chartSeries"
    />
    <div class="text-right mt-2">
      <small class="text-muted">แสดงสูงสุด {{ limit }} บัญชี</small>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';

export default {
  name: 'TopAccountsChart',
  components: { apexchart: VueApexCharts },
  props: {
    /** items: [{ uid, name, count, source, profile_image, link_crawl }] */
    items: { type: Array, default: () => [] },
    limit: { type: Number, default: 15 }
  },
  computed: {
    // เรียงมาก → น้อย ก่อน แล้วค่อยตัดตาม limit
    chartRows() {
      const arr = [...(this.items || [])].sort(
        (a, b) => (Number(b?.count) || 0) - (Number(a?.count) || 0)
      );
      return arr.slice(0, this.limit);
    },
    chartSeries() {
      return [{ name: 'Mentions', data: this.chartRows.map(r => Number(r.count || 0)) }];
    },
    chartCategories() {
      return this.chartRows.map(r => `${(r.name || r.uid)} (@${r.uid})`);
    },
    chartOptions() {
      const self = this;
      return {
        chart: {
          type: 'bar',
          toolbar: { show: false },
          animations: { enabled: true },
          events: {
            dataPointSelection(event, chartCtx, config) {
              const idx = config?.dataPointIndex;
              const item = self.chartRows[idx];
              if (item) self.$emit('add-watch', item);
            }
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 6,
            barHeight: '65%',
            distributed: true
          }
        },
        dataLabels: {
          enabled: true,
          offsetX: -6,
          formatter: val => Number(val || 0).toLocaleString(),
          style: { fontSize: '12px' }
        },
        xaxis: {
          categories: self.chartCategories,
          labels: { formatter: v => Number(v).toLocaleString() },
          title: { text: 'Mention count' }
        },
        yaxis: {
          labels: { minWidth: 0, maxWidth: 320, style: { fontSize: '12px' } }
        },
        tooltip: {
          custom: ({ dataPointIndex }) => {
            const item = self.chartRows[dataPointIndex] || {};
            const img = item.profile_image
              ? `<img src="${item.profile_image}" class="ta-tip-avatar" />`
              : `<div class="ta-tip-initials bold">${self.initials(item.name || item.uid)}</div>`;
            const source = (item.source || 'unknown').toLowerCase();
            return `
              <div class="ta-tip px-2 py-2">
                <div class="ta-tip-left">${img}</div>
                <div class="ta-tip-right">
                  <div class="ta-tip-name">${(item.name || item.uid) || '-'}</div>
                  <div class="ta-tip-uid">@${item.uid || '-'}</div>
                  <div class="ta-tip-meta">
                    <span class="ta-tip-source ${source}">${source}</span>
                    <span class="ta-tip-count">mentions: <b>${(item.count || 0).toLocaleString()}</b></span>
                  </div>
                  ${item.link_crawl ? `<a href="${item.link_crawl}" target="_blank" rel="noopener noreferrer" class="ta-tip-link">เปิดลิงก์</a>` : ''}
                </div>
              </div>
            `;
          }
        },
        grid: { strokeDashArray: 3 },
        legend: { show: false }
      };
    }
  },
  methods: {
    initials(name) {
      const parts = String(name || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
      const first = (parts[0] || '').charAt(0);
      const last = parts.length > 1 ? (parts[parts.length - 1] || '').charAt(0) : '';
      return (first + last || first || '?').toUpperCase();
    }
  },
  watch: {
    // บังคับรีคอมพิวต์ options เวลา items/limit เปลี่ยน เพื่อให้ tooltip ใช้ข้อมูลล่าสุด
    items() { this.$nextTick(() => this.$refs.ac?.updateOptions(this.chartOptions, false, true)); },
    limit() { this.$nextTick(() => this.$refs.ac?.updateOptions(this.chartOptions, false, true)); }
  }
};
</script>

<style scoped>
/* Tooltip สวย ๆ พร้อมรูปโปรไฟล์ */
.ta-tip { display: flex; align-items: center; padding: 8px; gap: 10px; }
.ta-tip-left { flex: 0 0 auto; }
.ta-tip-avatar { width: 42px; height: 42px; border-radius: 50%; object-fit: cover; box-shadow: 0 0 0 2px #fff; }
.ta-tip-initials {
  width: 42px; height: 42px; border-radius: 50%;
  display:flex; align-items:center; justify-content:center;
  background:#eef2f7; color:#3c4a60; font-weight:700;
}
.ta-tip-right { display:flex; flex-direction:column; gap:2px; }
.ta-tip-name { font-weight:600; line-height:1.2; }
.ta-tip-uid { font-size:12px; color:#6c757d; }
.ta-tip-meta { display:flex; align-items:center; gap:8px; margin-top:2px; }
.ta-tip-source { font-size:11px; padding:2px 6px; border-radius:999px; color:#fff; background:#6c757d; text-transform:capitalize; }
.ta-tip-source.twitter { background:#17a2b8; }
.ta-tip-source.youtube { background:#dc3545; }
.ta-tip-source.facebook { background:#007bff; }
.ta-tip-source.instagram { background:#ffc107; color:#343a40; }
.ta-tip-source.unknown, .ta-tip-source.news { background:#6c757d; }
.ta-tip-link { display:inline-block; margin-top:4px; font-size:12px; }
</style>
