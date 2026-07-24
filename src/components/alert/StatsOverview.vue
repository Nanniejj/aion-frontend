<template>
  <div class="ov-wrap">
    <div class="ov-grid">
      <div class="ov-card">
        <div class="ov-icon ov-icon-bags"><b-icon icon="collection" /></div>
        <div class="ov-body">
          <div class="ov-value">{{ totalBags }}</div>
          <div class="ov-label">ถุงคำทั้งหมด</div>
          <div class="ov-sub">
            <span class="ov-dot pulse"></span>ทำงานอยู่ {{ activeBags }} ถุง
          </div>
        </div>
      </div>

      <div class="ov-card">
        <div class="ov-icon ov-icon-new"><b-icon icon="bell" /></div>
        <div class="ov-body">
          <div class="ov-value">{{ newEvents }}</div>
          <div class="ov-label">Spike ใหม่ที่ยังไม่จัดการ</div>
          <div class="ov-sub">จากทั้งหมด {{ totalEvents }} spike</div>
        </div>
      </div>

      <div class="ov-card">
        <div class="ov-icon ov-icon-high"><b-icon icon="exclamation-triangle" /></div>
        <div class="ov-body">
          <div class="ov-value">{{ highSeverityNew }}</div>
          <div class="ov-label">ความรุนแรงสูง (ใหม่)</div>
          <div class="ov-sub">ควรตรวจสอบก่อน</div>
        </div>
      </div>

      <div class="ov-card">
        <div class="ov-icon ov-icon-resolved"><b-icon icon="check-circle" /></div>
        <div class="ov-body">
          <div class="ov-value">{{ resolvedRate }}%</div>
          <div class="ov-label">อัตราแก้ไขแล้ว</div>
          <div class="ov-sub">{{ resolvedEvents }} / {{ totalEvents }} spike</div>
        </div>
      </div>
    </div>

    <div class="ov-breakdown">
      <div class="ov-breakdown-head">
        <span class="ov-breakdown-title">สัดส่วนความรุนแรงของ Spike ทั้งหมด</span>
        <span class="ov-breakdown-total">{{ totalEvents }} รายการ</span>
      </div>

      <div v-if="totalEvents" class="ov-bar">
        <div
          v-for="seg in severitySegments"
          :key="seg.key"
          class="ov-bar-seg"
          :class="'sev-' + seg.key"
          :style="{ width: seg.percent + '%' }"
          v-b-tooltip.hover
          :title="`${seg.label}: ${seg.count} รายการ (${seg.percent}%)`"
        ></div>
      </div>
      <div v-else class="ov-bar ov-bar-empty"></div>

      <div class="ov-legend">
        <span v-for="seg in severitySegments" :key="'l' + seg.key" class="ov-legend-item">
          <span class="ov-legend-dot" :class="'sev-' + seg.key"></span>
          {{ seg.label }} <strong>{{ seg.count }}</strong>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatsOverview',
  props: {
    bags: { type: Array, default: () => [] },
    events: { type: Array, default: () => [] },
  },
  computed: {
    totalBags() {
      return this.bags.length
    },
    activeBags() {
      return this.bags.filter((b) => b.is_active).length
    },
    totalEvents() {
      return this.events.length
    },
    newEvents() {
      return this.events.filter((e) => e.status === 'new').length
    },
    resolvedEvents() {
      return this.events.filter((e) => e.status === 'resolved').length
    },
    resolvedRate() {
      if (!this.totalEvents) return 0
      return Math.round((this.resolvedEvents / this.totalEvents) * 100)
    },
    highSeverityNew() {
      return this.events.filter((e) => e.status === 'new' && e.severity === 'high').length
    },
    severitySegments() {
      const order = [
        { key: 'high', label: 'สูง' },
        { key: 'medium', label: 'กลาง' },
        { key: 'low', label: 'ต่ำ' },
      ]
      const total = this.totalEvents || 1
      return order.map((o) => {
        const count = this.events.filter((e) => (e.severity || 'low') === o.key).length
        return { ...o, count, percent: Math.round((count / total) * 100) }
      })
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Prompt:wght@600;700&family=Noto+Sans+Thai:wght@400;500;600&display=swap');

.ov-wrap {
  font-family: 'Noto Sans Thai', sans-serif;
}

/* Stat cards */
.ov-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.ov-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 16px;
  box-shadow: 0 10px 30px rgba(45, 32, 20, 0.07);
}

.ov-icon {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  flex-shrink: 0;
}
.ov-icon-bags {
  background: #f5f1e9;
  color: #d9a441;
}
.ov-icon-new {
  background: #fdf3dd;
  color: #b8863a;
}
.ov-icon-high {
  background: #fdeceb;
  color: #e2574c;
}
.ov-icon-resolved {
  background: #eaf3ee;
  color: #2b7a4b;
}

.ov-body {
  min-width: 0;
}

.ov-value {
  font-family: 'Prompt', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 1.1;
  color: #2e2a26;
}

.ov-label {
  font-size: 0.8rem;
  color: #6b6259;
  font-weight: 500;
  margin-top: 2px;
}

.ov-sub {
  font-size: 0.74rem;
  color: #a39a8f;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.ov-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2bb673;
  flex-shrink: 0;
}
.ov-dot.pulse {
  box-shadow: 0 0 0 0 rgba(43, 182, 115, 0.55);
  animation: ov-pulse 2s ease-out infinite;
}
@keyframes ov-pulse {
  0% { box-shadow: 0 0 0 0 rgba(43, 182, 115, 0.5); }
  70% { box-shadow: 0 0 0 6px rgba(43, 182, 115, 0); }
  100% { box-shadow: 0 0 0 0 rgba(43, 182, 115, 0); }
}

/* Breakdown bar */
.ov-breakdown {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 18px;
  margin-top: 14px;
  box-shadow: 0 10px 30px rgba(45, 32, 20, 0.07);
}

.ov-breakdown-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.ov-breakdown-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2e2a26;
}

.ov-breakdown-total {
  font-size: 0.76rem;
  color: #8a8178;
}

.ov-bar {
  display: flex;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: #f0ebe1;
}
.ov-bar-empty {
  opacity: 0.6;
}

.ov-bar-seg {
  height: 100%;
  transition: width 0.2s ease;
}
.ov-bar-seg.sev-high {
  background: #e2574c;
}
.ov-bar-seg.sev-medium {
  background: #d9a441;
}
.ov-bar-seg.sev-low {
  background: #b3aaa0;
}

.ov-legend {
  display: flex;
  gap: 18px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.ov-legend-item {
  font-size: 0.78rem;
  color: #6b6259;
  display: flex;
  align-items: center;
  gap: 6px;
}

.ov-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.ov-legend-dot.sev-high {
  background: #e2574c;
}
.ov-legend-dot.sev-medium {
  background: #d9a441;
}
.ov-legend-dot.sev-low {
  background: #b3aaa0;
}

@media (prefers-reduced-motion: reduce) {
  .ov-dot.pulse {
    animation: none;
  }
}

@media (max-width: 991px) {
  .ov-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .ov-grid {
    grid-template-columns: 1fr;
  }
  .ov-legend {
    gap: 12px;
  }
}
</style>