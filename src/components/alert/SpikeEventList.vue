<template>
  <div class="se-panel">
    <div class="se-head">
      <div>
        <h5 class="se-title mb-0">Spike ล่าสุด</h5>
        <p class="se-desc mb-0">ความผิดปกติที่ตรวจพบจาก keyword ทั้งหมด</p>
      </div>
    </div>

    <div class="se-stats-wrap">
      <StatsOverview :bags="bags" :events="events" class="se-stats" />
    </div>

    <b-form-select
      v-model="keywordFilter"
      :options="keywordOptions"
      size="sm"
      class="se-keyword-select mb-3"
    />

    <div v-if="loading" class="se-loading">
      <b-spinner small class="mr-2" />กำลังโหลด spike ล่าสุด...
    </div>

    <b-alert v-else-if="loadError" show variant="danger" class="small mb-3">
      {{ loadError }}
      <b-link class="ml-1" @click="fetchEvents">ลองใหม่</b-link>
    </b-alert>

    <div v-else-if="sourceEvents.length" class="se-list">
      <button
        v-for="event in sourceEvents"
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
          </div>
          <div class="se-item-meta">
            <b-icon icon="clock-history" class="mr-1" />{{ formatWindow(event) }}
            <br>
            <!-- <span class="se-dot-sep">·</span> -->
            <b-icon icon="graph-up-arrow" class="mr-1" />ยอดโพสต์ในช่วงที่ตรวจพบ
            <strong class="se-change" :class="'sev-text-' + event.severity">{{ event.current_volume }}</strong>
            โพสต์
          </div>
        </div>

        <b-icon icon="chevron-right" class="se-chevron" />
      </button>
    </div>

    <div v-else class="se-empty">
      <div class="se-empty-icon"><b-icon icon="activity" /></div>
      <div class="se-empty-title">
        {{ keywordFilter ? 'ไม่พบ spike สำหรับคำนี้' : 'ยังไม่มี spike ในตอนนี้' }}
      </div>
      <p class="se-empty-desc mb-0">
        {{ keywordFilter
          ? 'ลองเลือก "ทุกคำ (ทุก keyword)" เพื่อดู spike ทั้งหมด'
          : 'ระบบจะแจ้งเตือนที่นี่ทันทีที่พบความผิดปกติ' }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import StatsOverview from './StatsOverview.vue'
// ปรับเป็น env-based ได้ทีหลังถ้าต้อง deploy หลาย environment — ตอนนี้ตั้งตายตัวตามที่ backend รันอยู่
const EVENTS_BASE = 'https://api2.cognizata.com/api/v2/alert'

// growth_percent ยังไม่ถูกคำนวณจริงจากฝั่ง worker (เป็น 0 เสมอ) เลยใช้อัตราส่วน
// current_volume / min_volume แทน — สะท้อนว่ายอดเกินเกณฑ์ที่ตั้งไว้กี่เท่า
function mapSeverity(volumeRatio) {
  if (volumeRatio >= 3) return 'high'
  if (volumeRatio >= 1.5) return 'medium'
  return 'low'
}

function mapSpikeEvent(raw) {
  const currentVolume = Number(raw.current_volume) || 0
  const minVolume = Number(raw.min_volume) || 0
  const volumeRatio = minVolume > 0 ? currentVolume / minVolume : 0

  return {
    _id: raw._id,
    keyword_id: raw.keyword_id,
    bag_name: raw.keyword_name || raw.keyword || 'ไม่ทราบชื่อ',
    current_volume: currentVolume,
    min_volume: minVolume,
    severity: mapSeverity(volumeRatio),
    status: raw.status,
    window_start: raw.window_start,
    window_end: raw.window_end,
    matched_post_count: raw.matched_post_count,
    detected_at: raw.detected_at,
  }
}

export default {
  name: 'SpikeEventList',
  props: {
    // fallback ก่อนที่จะโหลดจาก API จริงเสร็จ (เผื่อ parent ยังส่ง mock มาอยู่)
    events: { type: Array, default: () => [] },
    bags: { type: Array, default: () => [] },
  },
  components: { StatsOverview },
  data() {
    return {
      apiEvents: null, // null = ยังไม่เคย fetch, [] = fetch แล้วแต่ไม่พบ
      loading: false,
      loadError: '',
      keywordFilter: '',
      keywordOptions: [{ value: '', text: 'ทุกคำ (ทุก keyword)' }],
    }
  },
  computed: {
    sourceEvents() {
      return this.apiEvents !== null ? this.apiEvents : this.events
    },
  },
  watch: {
    keywordFilter() {
      this.fetchEvents()
    },
  },
  created() {
    this.fetchEvents()
  },
  methods: {
   // แยก format เป็นสองส่วน: วันที่ (date) กับ เวลา (time) เพื่อให้เลือกโชว์แยกกันได้
    // ทั้งคู่ดึงตัวเลขจาก string ตรงๆ ไม่ผ่านการแปลง timezone (ตามที่แก้ไปก่อนหน้านี้)
    parseRaw(d) {
      if (!d) return null
      const m = String(d).match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})/)
      if (!m) return null
      const [, y, mo, day, h, mi] = m.map(Number)
      return { y, mo, day, h, mi }
    },
    formatDatePart(p) {
      const rawDate = new Date(Date.UTC(p.y, p.mo - 1, p.day))
      return rawDate.toLocaleDateString('th-TH', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      })
    },
    formatTimePart(p) {
      const rawDate = new Date(Date.UTC(p.y, p.mo - 1, p.day, p.h, p.mi))
      return rawDate.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
      })
    },
    formatDateTime(d) {
      const p = this.parseRaw(d)
      if (!p) return '-'
      return `${this.formatDatePart(p)} ${this.formatTimePart(p)}`
    },
    formatWindow(event) {
      const start = this.parseRaw(event.window_start)
      const end = this.parseRaw(event.window_end)
      if (!start || !end) return '-'

      const sameDay = start.y === end.y && start.mo === end.mo && start.day === end.day

      if (sameDay) {
        // วันเดียวกัน: โชว์วันที่ครั้งเดียว แล้วตามด้วยช่วงเวลา เช่น
        // "10 ส.ค. 2569 12:34 – 13:34"
        return `${this.formatDatePart(start)} ${this.formatTimePart(start)} – ${this.formatTimePart(end)}`
      }

      // คนละวัน: โชว์วันที่-เวลาเต็มทั้งสองฝั่งเหมือนเดิม
      return `${this.formatDatePart(start)} ${this.formatTimePart(start)} – ${this.formatDatePart(end)} ${this.formatTimePart(end)}`
    },
    // เก็บตัวเลือก keyword สำหรับ dropdown filter จากผลลัพธ์แบบไม่กรอง (ครอบคลุมทุกคำ)
    buildKeywordOptions(rawEvents) {
      const seen = new Map()
      for (const raw of rawEvents) {
        if (raw.keyword_id && !seen.has(raw.keyword_id)) {
          seen.set(raw.keyword_id, raw.keyword_name || raw.keyword || raw.keyword_id)
        }
      }
      this.keywordOptions = [
        { value: '', text: 'ทุกคำ (ทุก keyword)' },
        ...Array.from(seen, ([value, text]) => ({ value, text })),
      ]
    },
    async fetchEvents() {
      this.loading = true
      this.loadError = ''
      try {
        const params = { limit: 50 }
        if (this.keywordFilter) params.keyword_id = this.keywordFilter

        const token = localStorage.getItem('token')
        const res = await axios.get(`${EVENTS_BASE}/getSpikeEvents`, {
          params,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })

        const rawEvents = res.data && Array.isArray(res.data.data) ? res.data.data : []
        this.apiEvents = rawEvents.map(mapSpikeEvent)

        // อัปเดตตัวเลือก keyword เฉพาะตอนที่ไม่ได้กรอง เพื่อไม่ให้ dropdown ยุบเหลือคำเดียว
        if (!this.keywordFilter) {
          this.buildKeywordOptions(rawEvents)
        }
      } catch (err) {
        console.error('SpikeEventList fetchEvents:', err)
        this.apiEvents = []
        this.loadError = 'โหลดข้อมูล spike ล่าสุดไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
      } finally {
        this.loading = false
      }
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

.se-stats-wrap {
  margin-bottom: 16px;
}

.se-stats {
  display: block;
}

.se-keyword-select {
  font-size: 0.82rem;
  border-color: #f0e9dc;
  border-radius: 10px;
}

.se-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
  color: #8a8178;
  font-size: 0.85rem;
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