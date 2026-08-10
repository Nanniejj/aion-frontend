<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
    <div id="content">
      <div class="kad-page py-5">
        <div class="idx">
          <b-link class="kad-back" @click="$router.push('/alert')">
            <b-icon icon="arrow-left" class="mr-1" />กลับไปหน้ารายการ keywords
          </b-link>

          <div v-if="loading" class="kad-loading">
            <b-spinner class="mr-2" />กำลังโหลดข้อมูล...
          </div>

          <b-alert v-else-if="error" show variant="danger" class="mt-3">{{ error }}</b-alert>

          <template v-else-if="bag">
            <div class="kad-panel kad-header-panel">
              <div class="kad-header-top">
                <div>
                  <div class="kad-status">
                    <span class="kb-dot" :class="{ pulse: bag.is_active }"></span>
                    <b-badge :variant="bag.is_active ? 'success' : 'secondary'" class="kb-badge">
                      {{ bag.is_active ? 'ทำงานอยู่' : 'ปิดใช้งาน' }}
                    </b-badge>
                    <b-badge :variant="bag.enable_alert ? 'info' : 'secondary'" class="kb-badge ml-1">
                      {{ bag.enable_alert ? 'เปิดแจ้งเตือน' : 'ปิดแจ้งเตือน' }}
                    </b-badge>
                  </div>
                  <h2 class="kad-title">{{ bag.name }}</h2>
                  <p v-if="bag.description" class="kad-desc">{{ bag.description }}</p>
                  <p class="kad-keyword">
                    <i class="fa fa-quote-left mr-1" aria-hidden="true"></i>{{ bag.keyword }}
                  </p>
                </div>
              </div>

              <div v-if="latestKeySummary" class="kad-latest-summary">
                <div class="kad-latest-summary-head">
                  <b-icon icon="stars" class="mr-1" />
                  สาระสำคัญล่าสุดที่แจ้งเตือน
                  <span class="kad-latest-summary-date">{{ formatDateTime(latestAlertEvent.detected_at) }}</span>
                </div>
                <p class="kad-latest-summary-text mb-0">{{ latestKeySummary }}</p>
              </div>
            </div>

            <div class="kad-panel mt-4">
              <KeywordAlertTimeseriesChart
                :keyword-id="bag._id"
                :keyword-name="bag.name"
              />
            </div>

            <div class="kad-panel mt-4">
              <div class="kad-history-head">
                <h5 class="kad-history-title mb-0">
                  <b-icon icon="bell" class="mr-1" />ประวัติการแจ้งเตือน
                </h5>
                <span class="kad-history-count" v-if="totalCount">ทั้งหมด {{ totalCount }} ครั้ง</span>
              </div>

              <div v-if="eventsLoading && events.length === 0" class="kad-loading">
                <b-spinner small class="mr-2" />กำลังโหลดประวัติ...
              </div>

              <b-alert v-else-if="eventsError" show variant="danger" class="mt-3">{{ eventsError }}</b-alert>

              <div v-else-if="events.length === 0" class="kad-empty">
                <b-icon icon="inbox" class="kad-empty-icon" />
                <p class="mb-0">ยังไม่มีประวัติการแจ้งเตือนสำหรับ keyword นี้</p>
              </div>

              <div v-else class="kad-history-list">
                <div
                  v-for="event in events"
                  :key="event._id"
                  :id="`spike-${event._id}`"
                  class="kad-history-item"
                  :class="{ 'kad-history-item-highlight': highlightedEventId === event._id }"
                >
                  <div class="kad-history-item-top">
                    <span class="kad-history-date">
                      <b-icon icon="clock-history" class="mr-1" />{{ formatDateTime(event.detected_at) }}
                    </span>
                    <b-badge :variant="statusVariant(event.status)">{{ statusLabel(event.status) }}</b-badge>
                  </div>

                  <div class="kad-history-stats">
                    <span><b-icon icon="file-post" class="mr-1" />{{ formatNumber(event.current_volume) }} โพสต์</span>
                    <span v-if="event.current_engagement">
                      <b-icon icon="heart" class="mr-1" />{{ formatNumber(event.current_engagement) }} engagement
                    </span>
                  </div>

                  <div v-if="event.ai_summary && event.ai_summary.headline" class="kad-headline">
                    {{ event.ai_summary.headline }}
                  </div>

                  <template v-if="event.ai_summary && event.ai_summary.summary">
                    <b-link class="kad-toggle" @click="toggleExpand(event._id)">
                      {{ expanded[event._id] ? 'ซ่อนข้อความที่วิเคราะห์' : 'ดูข้อความที่วิเคราะห์' }}
                      <b-icon :icon="expanded[event._id] ? 'chevron-up' : 'chevron-down'" class="ml-1" />
                    </b-link>

                    <b-collapse :visible="!!expanded[event._id]">
                      <div class="kad-summary-text">{{ event.ai_summary.summary }}</div>
                    </b-collapse>
                  </template>
                  <div v-else class="kad-no-summary text-muted">
                    ยังไม่มีข้อความสรุปวิเคราะห์สำหรับเหตุการณ์นี้
                  </div>
                </div>
              </div>

              <div v-if="canLoadMore" class="text-center mt-3">
                <b-button variant="outline-secondary" size="sm" :disabled="eventsLoading" @click="loadMoreEvents">
                  <b-spinner v-if="eventsLoading" small class="mr-1" />
                  โหลดเพิ่มเติม
                </b-button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HomeNav from '@/components/HomeNav.vue'
import KeywordAlertTimeseriesChart from '@/components/alert/KeywordAlertTimeseriesChart.vue'

const KEYWORD_BAG_BASE = 'http://localhost:3000/api/v2/alert'

// รายงานจาก Gemini (src/services/spikeAlertSummary.service.js) มีหลายหัวข้อ
// (หัวข้อข่าว/ช่วงเวลา/การสอบทาน/สถานะเดิม/สาระสำคัญ/เหตุผลเด่น/sentiment/สรุป/ลิงก์)
// คั่นด้วยบรรทัดขึ้นต้นด้วย emoji — ตัดมาเฉพาะพารากราฟใต้หัวข้อ "สาระสำคัญ"
// จนถึงหัวข้อถัดไป (หรือจบข้อความ)
function extractKeyParagraph(summaryText) {
  if (!summaryText) return ''

  const match = String(summaryText).match(
    /สาระสำคัญ\s*[:：]?\s*\n?([\s\S]*?)(?=\n\s*(?:🔥|🗣|📊|🔗|📌|📰|⏱|🔄)|$)/
  )

  if (!match) return ''

  return match[1].replace(/\s+/g, ' ').trim()
}

export default {
  name: 'KeywordAlertDetailView',

  components: { HomeNav, KeywordAlertTimeseriesChart },

  data() {
    return {
      bag: null,
      loading: true,
      error: '',

      events: [],
      eventsLoading: false,
      eventsError: '',
      eventsOffset: 0,
      eventsLimit: 20,
      totalCount: 0,
      expanded: {},
      highlightedEventId: '',
    }
  },

  computed: {
    keywordId() {
      return this.$route.params.id
    },

    canLoadMore() {
      return this.events.length < this.totalCount
    },

    // events เรียงจากใหม่ไปเก่า (backend sort detected_at: -1) — ตัวแรกคือแจ้งเตือนล่าสุด
    latestAlertEvent() {
      return this.events.length ? this.events[0] : null
    },

    latestKeySummary() {
      return extractKeyParagraph(this.latestAlertEvent?.ai_summary?.summary)
    },
  },

  async mounted() {
    await this.loadBag()
    if (this.bag) {
      await this.loadEvents()

      const targetEventId = this.$route.query.event
      if (targetEventId) {
        await this.revealEvent(targetEventId)
      }
    }
  },

  methods: {
    headers() {
      return {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      }
    },

    async loadBag() {
      this.loading = true
      this.error = ''
      try {
        const { data } = await this.axios.get(`${KEYWORD_BAG_BASE}/getKeywordBag`, {
          headers: this.headers(),
          params: { id: this.keywordId },
        })
        this.bag = data?.data || null
        if (!this.bag) {
          this.error = 'ไม่พบ keyword นี้'
        }
      } catch (err) {
        console.error('loadBag error:', err)
        this.error = err?.response?.data?.message || 'ไม่สามารถโหลดข้อมูล keyword ได้'
      } finally {
        this.loading = false
      }
    },

    async loadEvents() {
      this.eventsLoading = true
      this.eventsError = ''
      try {
        const { data } = await this.axios.get(`${KEYWORD_BAG_BASE}/getSpikeEvents`, {
          headers: this.headers(),
          params: {
            keyword_id: this.keywordId,
            offset: this.eventsOffset,
            limit: this.eventsLimit,
          },
        })
        const rows = data?.data || []
        this.events = this.eventsOffset === 0 ? rows : [...this.events, ...rows]
        this.totalCount = data?.totalCount || 0
      } catch (err) {
        console.error('loadEvents error:', err)
        this.eventsError = 'ไม่สามารถโหลดประวัติการแจ้งเตือนได้'
      } finally {
        this.eventsLoading = false
      }
    },

    async loadMoreEvents() {
      this.eventsOffset += this.eventsLimit
      await this.loadEvents()
    },

    toggleExpand(id) {
      this.$set(this.expanded, id, !this.expanded[id])
    },

    // เข้ามาจาก "Spike ล่าสุด" ด้วยลิงก์ที่ระบุ ?event=... — เหตุการณ์นั้นอาจไม่ได้
    // อยู่ในหน้าแรกที่โหลดมา ต้องโหลดเพิ่มไปเรื่อยๆ จนกว่าจะเจอ (จำกัดจำนวนรอบกันวนไม่รู้จบ)
    async revealEvent(eventId) {
      let attempts = 0
      while (!this.events.some((e) => e._id === eventId) && this.canLoadMore && attempts < 10) {
        await this.loadMoreEvents()
        attempts += 1
      }

      if (!this.events.some((e) => e._id === eventId)) return

      this.highlightedEventId = eventId
      this.$set(this.expanded, eventId, true)

      this.$nextTick(() => {
        const el = document.getElementById(`spike-${eventId}`)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    },

    formatNumber(n) {
      return Number(n || 0).toLocaleString('th-TH')
    },

    formatDateTime(value) {
      if (!value) return '-'
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return '-'
      return new Intl.DateTimeFormat('th-TH', {
        timeZone: 'Asia/Bangkok',
        hourCycle: 'h23',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    },

    statusLabel(status) {
      const labels = {
        detected: 'ตรวจพบ',
        summarizing: 'กำลังสรุป',
        ready: 'พร้อมแจ้งเตือน',
        notifying: 'กำลังแจ้งเตือน',
        completed: 'แจ้งเตือนแล้ว',
        partial_failed: 'แจ้งเตือนบางส่วน',
        failed: 'ล้มเหลว',
      }
      return labels[status] || status
    },

    statusVariant(status) {
      const variants = {
        completed: 'success',
        notifying: 'info',
        ready: 'info',
        summarizing: 'warning',
        detected: 'warning',
        partial_failed: 'warning',
        failed: 'danger',
      }
      return variants[status] || 'secondary'
    },
  },
}
</script>

<style scoped>
#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
}

.kad-page {
  color: var(--gp-charcoal, #2e2a26);
}

.kad-back {
  display: inline-flex;
  align-items: center;
  font-size: 0.88rem;
  color: #8a8178;
  cursor: pointer;
  margin-bottom: 18px;
}

.kad-back:hover {
  color: #2e2a26;
}

.kad-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #8a8178;
}

.kad-panel {
  background: #ffffff;
  border-radius: 20px;
  padding: 26px 28px;
  box-shadow: 0 12px 40px rgba(45, 32, 20, 0.08);
}

.kad-status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.kb-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #b3aaa0;
  flex-shrink: 0;
}

.kb-dot.pulse {
  background: #2bb673;
  box-shadow: 0 0 0 0 rgba(43, 182, 115, 0.6);
  animation: kb-pulse 2s ease-out infinite;
}

@keyframes kb-pulse {
  0% { box-shadow: 0 0 0 0 rgba(43, 182, 115, 0.55); }
  70% { box-shadow: 0 0 0 8px rgba(43, 182, 115, 0); }
  100% { box-shadow: 0 0 0 0 rgba(43, 182, 115, 0); }
}

.kb-badge {
  font-weight: 500;
  font-size: 0.72rem;
  padding: 4px 8px;
}

.kad-title {
  font-family: 'Prompt', sans-serif;
  font-weight: 600;
  text-align: left;
  margin-bottom: 4px;
}

.kad-desc {
  color: #8a8178;
  font-size: 0.9rem;
  text-align: left;
  margin-bottom: 6px;
}

.kad-keyword {
  color: #6b6259;
  font-size: 0.88rem;
  text-align: left;
  margin-bottom: 0;
}

.kad-latest-summary {
  margin-top: 18px;
  padding: 14px 16px;
  background: #fbf8f3;
  border: 1px solid #f0e9dc;
  border-left: 3px solid #d9a441;
  border-radius: 12px;
  text-align: left;
}

.kad-latest-summary-head {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #b8863a;
  margin-bottom: 6px;
}

.kad-latest-summary-date {
  margin-left: auto;
  font-weight: 400;
  font-size: 0.76rem;
  color: #8a8178;
}

.kad-latest-summary-text {
  font-size: 0.88rem;
  line-height: 1.6;
  color: #2e2a26;
}

.kad-history-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16px;
}

.kad-history-title {
  font-family: 'Prompt', sans-serif;
  font-weight: 600;
  text-align: left;
}

.kad-history-count {
  font-size: 0.82rem;
  color: #8a8178;
}

.kad-empty {
  text-align: center;
  padding: 40px 12px;
  color: #8a8178;
}

.kad-empty-icon {
  font-size: 1.4rem;
  margin-bottom: 8px;
  color: #d9a441;
}

.kad-history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.kad-history-item {
  background: #fbf8f3;
  border: 1px solid #f0e9dc;
  border-radius: 12px;
  padding: 14px 16px;
  text-align: left;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.kad-history-item-highlight {
  border-color: #d9a441;
  box-shadow: 0 0 0 3px rgba(217, 164, 65, 0.2);
}

.kad-history-item-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.kad-history-date {
  font-size: 0.85rem;
  color: #6b6259;
  font-weight: 500;
}

.kad-history-stats {
  display: flex;
  gap: 16px;
  font-size: 0.82rem;
  color: #8a8178;
  margin-top: 6px;
}

.kad-headline {
  margin-top: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #2e2a26;
}

.kad-toggle {
  display: inline-block;
  margin-top: 8px;
  font-size: 0.8rem;
  color: #d9a441;
  cursor: pointer;
}

.kad-summary-text {
  margin-top: 10px;
  padding: 12px 14px;
  background: #ffffff;
  border: 1px solid #f0e9dc;
  border-radius: 10px;
  font-size: 0.85rem;
  line-height: 1.6;
  white-space: pre-wrap;
  color: #4a453f;
}

.kad-no-summary {
  margin-top: 8px;
  font-size: 0.8rem;
}

@media (max-width: 576px) {
  .kad-panel {
    padding: 18px 16px;
  }
}
</style>
