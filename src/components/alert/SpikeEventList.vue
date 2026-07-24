<template>
  <div class="se-panel">
    <div class="se-head">
      <div>
        <h5 class="se-title mb-0">Spike ล่าสุด</h5>
        <p class="se-desc mb-0">ความผิดปกติที่ตรวจพบจากถุงคำทั้งหมด</p>
      </div>
      <div class="se-filter-group" role="tablist">
        <button
          v-for="f in filters"
          :key="f.value"
          type="button"
          class="se-filter-chip"
          :class="{ active: statusFilter === f.value }"
          @click="statusFilter = f.value"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <div v-if="filteredEvents.length" class="se-list">
      <button
        v-for="event in filteredEvents"
        :key="event._id"
        type="button"
        class="se-item"
        :class="'sev-' + event.severity"
        @click="$emit('select', event)"
      >
        <span class="se-sev-dot" :class="'sev-' + event.severity"></span>

        <div class="se-item-body">
          <div class="se-item-top">
            <span class="se-bag-name">{{ event.bag_name }}</span>
            <span class="se-status-pill" :class="{ resolved: event.status === 'resolved' }">
              {{ event.status === 'resolved' ? 'แก้ไขแล้ว' : 'ใหม่' }}
            </span>
          </div>
          <div class="se-item-meta">
            <b-icon icon="clock-history" class="mr-1" />{{ formatWindow(event) }}
            <span class="se-dot-sep">·</span>
            <b-icon icon="graph-up-arrow" class="mr-1" />เพิ่มขึ้น
            <strong class="se-change" :class="'sev-text-' + event.severity">{{ event.change_percent }}%</strong>
            จาก baseline
          </div>
        </div>

        <b-icon icon="chevron-right" class="se-chevron" />
      </button>
    </div>

    <div v-else class="se-empty">
      <div class="se-empty-icon"><b-icon icon="activity" /></div>
      <div class="se-empty-title">
        {{ events.length === 0 ? 'ยังไม่มี spike ในตอนนี้' : 'ไม่พบ spike ตามตัวกรองนี้' }}
      </div>
      <p class="se-empty-desc mb-0">
        {{ events.length === 0
          ? 'ระบบจะแจ้งเตือนที่นี่ทันทีที่พบความผิดปกติ'
          : 'ลองเลือก "ทั้งหมด" เพื่อดู spike ทุกสถานะ' }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpikeEventList',
  props: {
    events: { type: Array, default: () => [] },
  },
  data() {
    return {
      statusFilter: '',
      filters: [
        { value: '', label: 'ทั้งหมด' },
        { value: 'new', label: 'ใหม่' },
        { value: 'resolved', label: 'แก้ไขแล้ว' },
      ],
    }
  },
  computed: {
    filteredEvents() {
      return this.statusFilter ? this.events.filter((e) => e.status === this.statusFilter) : this.events
    },
  },
  methods: {
    formatWindow(event) {
      const time = (d) => new Date(d).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      return `${time(event.window_start)} – ${time(event.window_end)}`
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Prompt:wght@600;700&family=Noto+Sans+Thai:wght@400;500;600&display=swap');

.se-panel {
  font-family: 'Noto Sans Thai', sans-serif;
  background: #ffffff;
  border-radius: 20px;
  padding: 24px 22px 22px;
  box-shadow: 0 12px 40px rgba(45, 32, 20, 0.08);
  height: 100%;
}

.se-head {
  margin-bottom: 16px;
}

.se-title {
  font-family: 'Prompt', sans-serif;
  font-weight: 600;
  font-size: 1.12rem;
  text-align: left;
  color: #2e2a26;
}

.se-desc {
  color: #8a8178;
  font-size: 0.82rem;
  text-align: left;
  margin-top: 2px;
}

.se-filter-group {
  display: flex;
  gap: 6px;
  background: #f5f1e9;
  padding: 4px;
  border-radius: 10px;
  margin-top: 14px;
}

.se-filter-chip {
  flex: 1;
  border: none;
  background: transparent;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #8a8178;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}
.se-filter-chip:focus-visible {
  outline: 2px solid #d9a441;
  outline-offset: 1px;
}
.se-filter-chip.active {
  background: #ffffff;
  color: #2e2a26;
  box-shadow: 0 2px 6px rgba(45, 32, 20, 0.1);
}

/* List */
.se-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 560px;
  overflow-y: auto;
  padding-right: 2px;
}

.se-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  text-align: left;
  background: #fffdfa;
  border: 1px solid #f0e9dc;
  border-left: 3px solid #d7d0c4;
  border-radius: 12px;
  padding: 12px 12px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}
.se-item:hover {
  transform: translateX(2px);
  box-shadow: 0 6px 16px rgba(45, 32, 20, 0.08);
}
.se-item.sev-high {
  border-left-color: #e2574c;
}
.se-item.sev-medium {
  border-left-color: #d9a441;
}
.se-item.sev-low {
  border-left-color: #b3aaa0;
}

.se-sev-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}
.se-sev-dot.sev-high {
  background: #e2574c;
  box-shadow: 0 0 0 0 rgba(226, 87, 76, 0.55);
  animation: se-pulse-red 2s ease-out infinite;
}
.se-sev-dot.sev-medium {
  background: #d9a441;
}
.se-sev-dot.sev-low {
  background: #b3aaa0;
}
@keyframes se-pulse-red {
  0% { box-shadow: 0 0 0 0 rgba(226, 87, 76, 0.5); }
  70% { box-shadow: 0 0 0 7px rgba(226, 87, 76, 0); }
  100% { box-shadow: 0 0 0 0 rgba(226, 87, 76, 0); }
}

.se-item-body {
  flex: 1;
  min-width: 0;
}

.se-item-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.se-bag-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #2e2a26;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.se-status-pill {
  flex-shrink: 0;
  font-size: 0.68rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  background: #fdeceb;
  color: #c94a3f;
}
.se-status-pill.resolved {
  background: #eaf3ee;
  color: #2b7a4b;
}

.se-item-meta {
  margin-top: 4px;
  font-size: 0.78rem;
  color: #8a8178;
  line-height: 1.5;
}

.se-dot-sep {
  margin: 0 4px;
}

.se-change {
  font-weight: 700;
}
.se-change.sev-text-high {
  color: #e2574c;
}
.se-change.sev-text-medium {
  color: #b8863a;
}
.se-change.sev-text-low {
  color: #8a8178;
}

.se-chevron {
  color: #cfc6b8;
  margin-top: 8px;
  flex-shrink: 0;
}

/* Empty state */
.se-empty {
  text-align: center;
  padding: 40px 12px;
}
.se-empty-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f5f1e9;
  color: #d9a441;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
  font-size: 1.15rem;
}
.se-empty-title {
  font-weight: 600;
  font-size: 0.92rem;
  margin-bottom: 4px;
}
.se-empty-desc {
  font-size: 0.8rem;
  color: #8a8178;
}

@media (prefers-reduced-motion: reduce) {
  .se-sev-dot.sev-high {
    animation: none;
  }
}

@media (max-width: 991px) {
  .se-panel {
    margin-top: 24px;
  }
  .se-list {
    max-height: none;
  }
}
</style>