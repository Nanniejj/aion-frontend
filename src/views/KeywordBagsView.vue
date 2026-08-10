<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
    <div id="content">
      <div class="kb-page">
        <div class="py-3 bg-content">
          <div class="idx">
            <b-row>
              <b-col cols="auto" md="6">
                <!-- <h1 class="title">Alert</h1> -->
                <div class="h1 bold text-left">Alert</div>

              </b-col>
              <b-col cols="auto" md="6">
                <div class="text-right">
                  <b-button variant="outline-secondary" class="mr-2" @click="showHowTo = true">
                    <i class="fa fa-info-circle mr-1" aria-hidden="true"></i>วิธีใช้งาน
                  </b-button>
                  <b-button variant="outline-info" @click="showChannelSettings = true">
                    <b-icon icon="bell" class="mr-1" />ตั้งค่าช่องทางแจ้งเตือน
                  </b-button>
                </div>
              </b-col>
            </b-row>

            <!-- <StatsOverview :bags="bags" :events="events" class="kb-stats mb-4" /> -->


            <b-modal v-model="showChannelSettings" size="lg" hide-footer title="ช่องทางแจ้งเตือน">
              <NotifyChannelSettings :account-email="userEmail" @status="onChannelStatus" line-id="@964ufjlg"
                lineQRUrl="https://line.me/R/ti/p/@964ufjlg" />
            </b-modal>

            <b-modal v-model="showHowTo" size="lg" hide-footer hide-header content-class="howto-modal">
              <button type="button" class="howto-close" aria-label="ปิด" @click="showHowTo = false">
                <b-icon icon="x" />
              </button>

              <div class="howto-head">
                <div class="howto-head-icon"><b-icon icon="bell" /></div>
                <div>
                  <h5 class="howto-title mb-0">วิธีใช้งานเมนู Alert</h5>
                  <p class="howto-subtitle mb-0">ตั้งค่าครั้งเดียว ระบบตรวจสอบและแจ้งเตือนให้อัตโนมัติ</p>
                </div>
              </div>

              <div class="howto-steps">
                <div class="howto-step howto-step-highlight">
                  <div class="howto-step-num howto-step-num-highlight">1</div>
                  <div class="howto-step-body">
                    <div class="howto-step-title">
                      <b-icon icon="qr-code-scan" class="howto-step-icon" />
                      เชื่อมต่อ LINE OA
                    </div>
                    <p class="howto-step-desc mb-0">
                      กดปุ่ม <b>“ตั้งค่าช่องทางแจ้งเตือน”</b> ด้านบน แล้วสแกน QR เพื่อรับข้อความแจ้งเตือนเข้า LINE
                      — ทำขั้นตอนนี้ก่อน ไม่งั้นจะไม่ได้รับการแจ้งเตือนแม้ตั้งค่าเสร็จแล้ว
                    </p>
                  </div>
                </div>

                <div class="howto-step">
                  <div class="howto-step-num">2</div>
                  <div class="howto-step-body">
                    <div class="howto-step-title">
                      <b-icon icon="plus-circle" class="howto-step-icon" />
                      เริ่มสร้างชุดคำค้นหา
                    </div>
                    <p class="howto-step-desc mb-0">
                      กดปุ่ม <b>“เพิ่มแจ้งเตือน”</b> เพื่อสร้าง keyword bag ใหม่
                    </p>
                  </div>
                </div>

                <div class="howto-step">
                  <div class="howto-step-num">3</div>
                  <div class="howto-step-body">
                    <div class="howto-step-title">
                      <b-icon icon="tag" class="howto-step-icon" />
                      ตั้งชื่อ keywords
                    </div>
                    <p class="howto-step-desc mb-0">
                      กรอก “ชื่อ keywords” และ “คำอธิบาย” (ถ้ามี) เพื่อให้จำได้ว่ากำลังติดตามเรื่องอะไร
                    </p>
                  </div>
                </div>

                <div class="howto-step">
                  <div class="howto-step-num">4</div>
                  <div class="howto-step-body">
                    <div class="howto-step-title">
                      <b-icon icon="search" class="howto-step-icon" />
                      กำหนดคำค้นหา
                    </div>
                    <p class="howto-step-desc mb-0">
                      ใส่ “คำค้นหา” (เว้นวรรคหรือ <code>+</code> = AND, <code>,</code> = OR),
                      “คำที่ไม่ต้องการ” เพื่อกรองคำที่ไม่เกี่ยวข้อง, Hashtags ที่จะติดตาม
                      และเลือก Sentiment (เชิงบวก / เป็นกลาง / เชิงลบ)
                    </p>
                  </div>
                </div>

                <div class="howto-step">
                  <div class="howto-step-num">5</div>
                  <div class="howto-step-body">
                    <div class="howto-step-title">
                      <b-icon icon="graph-up-arrow" class="howto-step-icon" />
                      ตั้งเงื่อนไขแจ้งเตือนความผิดปกติ
                    </div>
                    <p class="howto-step-desc mb-0">
                      เปิดใช้งานการแจ้งเตือน แล้วตั้งค่า “ข้อมูลที่ใช้ตรวจสอบ” (จำนวนโพสต์ / ยอด Engagement / ทั้งคู่),
                      “ตรวจสอบทุก” กี่นาที/ชั่วโมง/วัน, “จำนวนโพสต์ขั้นต่ำ” ที่ถือว่าผิดปกติ
                      และ “เว้นระยะการแจ้งเตือน” เพื่อไม่ให้แจ้งซ้ำถี่เกินไป
                    </p>
                  </div>
                </div>

                <div class="howto-step">
                  <div class="howto-step-num">6</div>
                  <div class="howto-step-body">
                    <div class="howto-step-title">
                      <b-icon icon="save" class="howto-step-icon" />
                      บันทึก
                    </div>
                    <p class="howto-step-desc mb-0">
                      ระบบจะตรวจสอบตามเงื่อนไขที่ตั้งไว้อัตโนมัติ และส่งข้อความแจ้งเตือนพร้อมสรุปข่าวเข้า LINE
                      ทันทีที่ข้อมูลเข้าเงื่อนไข
                    </p>
                  </div>
                </div>
              </div>

              <div class="howto-footnote">
                ดูสถานะหรือแก้ไขคำค้นหาที่มีอยู่ได้จากรายการด้านล่าง หรือกดที่การ์ดเพื่อดูกราฟและประวัติการแจ้งเตือน
              </div>
            </b-modal>
            <b-row class="kb-layout">
              <b-col lg="8">
                <div class="kb-panel">
                  <!-- Panel header -->
                  <div class="kb-panel-head">
                    <div>
                      <h2 class="kb-panel-title">ตั้งค่าแจ้งเตือน</h2>
                      <p class="kb-panel-desc">จัดการคำที่ติดตามและตั้งค่าการแจ้งเตือน</p>
                    </div>
                    <b-button variant="info" class="kb-new-btn" @click="openCreate">
                      <b-icon icon="plus" class="mr-1" />เพิ่มแจ้งเตือน
                    </b-button>
                  </div>

                  <!-- Controls -->
                  <div class="kb-controls">
                    <div class="kb-search">
                      <i class="fa fa-search kb-search-icon" aria-hidden="true"></i>
                      <input v-model="searchText" type="text" class="kb-search-input"
                        placeholder="ค้นหา keyword หรือ คำค้นหา..." />
                    </div>
                    <div class="kb-filter-group" role="tablist">
                      <button v-for="opt in statusFilters" :key="opt.value" type="button" class="kb-filter-chip"
                        :class="{ active: statusFilter === opt.value }" @click="statusFilter = opt.value">
                        {{ opt.label }}
                      </button>
                    </div>
                  </div>

                  <b-alert v-if="error" variant="danger" show class="mt-3">{{ error }}</b-alert>

                  <!-- Loading skeleton -->
                  <div v-if="loading" class="kb-grid mt-4">
                    <div class="kb-card kb-skeleton" v-for="n in 3" :key="n">
                      <div class="sk-line sk-w60"></div>
                      <div class="sk-line sk-w90"></div>
                      <div class="sk-line sk-w40"></div>
                    </div>
                  </div>

                  <!-- Empty state -->
                  <div v-else-if="filteredBags.length === 0" class="kb-empty">
                    <div class="kb-empty-icon">
                      <i class="fa fa-satellite-dish" aria-hidden="true"></i>
                    </div>
                    <h5 class="mb-1">
                      {{ bags.length === 0 ? 'ยังไม่มี keyword' : 'ไม่พบ keywordที่ตรงกับการค้นหา' }}
                    </h5>
                    <p class="text-muted mb-3">
                      {{ bags.length === 0
                        ? 'สร้าง keywordแรกเพื่อเริ่มติดตามและรับการแจ้งเตือน'
                        : 'ลองเปลี่ยนคำค้นหา หรือเลือก "ทั้งหมด" เพื่อดู keywordทั้งหมด' }}
                    </p>
                    <b-button v-if="bags.length === 0" variant="primary" @click="openCreate">
                      <b-icon icon="plus" class="mr-1" />สร้าง keywordแรก
                    </b-button>
                  </div>

                  <!-- Cards -->
                  <div v-else class="kb-grid mt-4">
                    <div v-for="item in filteredBags" :key="item._id" class="kb-card kb-card-clickable"
                      :class="{ 'is-active': item.is_active }" @click="goToDetail(item)">
                      <div class="kb-card-top">
                        <div class="kb-status">
                          <span class="kb-dot" :class="{ pulse: item.is_active }"></span>
                          <b-badge :variant="item.is_active ? 'success' : 'secondary'" class="kb-badge">
                            {{ item.is_active ? 'ทำงานอยู่' : 'ปิดใช้งาน' }}
                          </b-badge>
                        </div>
                        <div class="kb-card-actions">
                          <button class="kb-icon-btn" title="ดูกราฟ" @click.stop="openChart(item)">
                            <b-icon icon="graph-up" />
                          </button>
                          <button class="kb-icon-btn" title="แก้ไข" @click.stop="openEdit(item)">
                            <b-icon icon="pencil" />
                          </button>
                          <!-- <button class="kb-icon-btn" title="ตั้งค่าเพิ่มเติม"
                            @click="$router.push(`/keyword-bags/${item._id}/settings`)">
                            <b-icon icon="sliders" />
                          </button> -->
                          <!-- {{ item }} -->
                          <button class="kb-icon-btn kb-icon-danger" title="ลบ" @click.stop="remove(item)">
                            <b-icon icon="trash" />
                          </button>
                        </div>
                      </div>

                      <h5 class="kb-card-name">{{ item.name }}</h5>
                      <p class="kb-card-query" :title="item.keyword">
                        <i class="fa fa-quote-left mr-1" aria-hidden="true"></i>{{ item.keyword }}
                      </p>
                      <div class="kb-card-query">{{ item.description }}</div>
                      <!-- <div class="kb-card-meta text-right"style="font-size: 12px;">
                        <div > 
                             <small class="text-muted">
                          สร้าง: {{ formatDate(item.created_at) }}
                        </small>
                      <small class="text-muted">
                          อัปเดตล่าสุด: {{ formatDate(item.updated_at) }}
                        </small>
                      </div>
                       
                      </div> -->
                    </div>
                  </div>
                </div>
              </b-col>

              <b-col lg="4" class="mt-4 mt-lg-0">
                <SpikeEventList :bags="bags" :events="events" @select="onSelectEvent" />
              </b-col>
            </b-row>
          </div>
        </div>

        <b-modal v-model="showForm" hide-footer hide-header size="xl" content-class="kb-modal-content" body-class="p-0">
          <KeywordBagForm :value="editingBag" :channel-status="channelStatus" @saved="onSaved"
            @cancel="showForm = false" @open-channel-settings="onOpenChannelSettingsFromForm" />
        </b-modal>

        <b-modal v-model="showChart" size="xl" hide-footer :title="chartingBag ? chartingBag.name : 'กราฟติดตาม'">
          <KeywordAlertTimeseriesChart v-if="chartingBag" :keyword-id="chartingBag._id"
            :keyword-name="chartingBag.name" />
        </b-modal>
      </div>
      <ProjectAlertOverviewChart class="mb-4" />

    </div>
  </div>
</template>

<script>
import KeywordBagForm from '../components/alert/KeywordBagForm.vue'
import SpikeEventList from '../components/alert/SpikeEventList.vue'
import StatsOverview from '../components/alert/StatsOverview.vue'
import KeywordAlertTimeseriesChart from '../components/alert/KeywordAlertTimeseriesChart.vue'
import ProjectAlertOverviewChart from '../components/alert/ProjectAlertOverviewChart.vue'
import HomeNav from "@/components/HomeNav.vue"
import NotifyChannelSettings from '../components/alert/NotifyChannelSettings.vue'
import Swal from 'sweetalert2'
// ปรับ path ตรงนี้ที่เดียวถ้า backend ไม่ได้ mount ตาม default นี้
// dev: proxy ผ่าน vue.config.js -> http://localhost:8080
// (แก้: ตัด "/" ท้าย URL ออก กัน path ซ้อนเวลา component ต่อ "/xxx" เพิ่ม)
const KEYWORD_BAG_BASE = 'https://api2.cognizata.com/api/v2/alert'

// ⚠️ ยังไม่มี backend route ให้มาสำหรับ spike events — ต้อง implement เพิ่ม
const EVENTS_BASE = 'https://api2.cognizata.com/api/v2/alert'

export default {
  name: 'KeywordBagsView',
  components: { KeywordBagForm, SpikeEventList, StatsOverview, KeywordAlertTimeseriesChart, ProjectAlertOverviewChart, HomeNav, NotifyChannelSettings },
  data() {
    return {
      channelStatus: { telegram: false, email: true, line_oa: false },
      showChannelSettings: false,
      showHowTo: false,
      userEmail: '',
      bags: [],
      events: [],
      loading: true,
      error: '',
      showForm: false,
      editingBag: null,
      showChart: false,
      chartingBag: null,
      searchText: '',
      statusFilter: 'active',
      statusFilters: [
        { value: 'all', label: 'ทั้งหมด' },
        { value: 'active', label: 'ทำงานอยู่' },
        { value: 'inactive', label: 'ปิดใช้งาน' },
      ],
    }
  },
  computed: {
    filteredBags() {
      const q = this.searchText.trim().toLowerCase()
      return this.bags.filter((b) => {
        const matchesQuery =
          !q ||
          (b.name && b.name.toLowerCase().includes(q)) ||
          (b.keyword && b.keyword.toLowerCase().includes(q))
        const matchesStatus =
          this.statusFilter === 'all' ||
          (this.statusFilter === 'active' && b.is_active) ||
          (this.statusFilter === 'inactive' && !b.is_active)
        return matchesQuery && matchesStatus
      })
    },
  },
  async mounted() {
    await Promise.all([this.loadBags(), this.loadEvents()])
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    onChannelStatus({ telegram, email, line_oa }) {
      // เก็บสถานะทุกช่องทางที่ NotifyChannelSettings ส่งกลับมา
      // (ของเดิมรับแค่ telegram ตัวเดียว ทำให้ email/line_oa ค้างค่า default เสมอ)
      if (telegram !== undefined) this.channelStatus.telegram = telegram
      if (email !== undefined) this.channelStatus.email = email
      if (line_oa !== undefined) this.channelStatus.line_oa = line_oa
    },

    onOpenChannelSettingsFromForm() {
      this.showChannelSettings = true
    },

    // GET /getKeywordBagList
    async loadBags() {
      this.loading = true
      this.error = ''
      try {
        const headers = {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json',
        }
        const { data } = await this.axios.get(
          `${KEYWORD_BAG_BASE}/getKeywordBagList`,
          { headers, params: { includeInactive: true } }
        )
        this.bags = data?.data || []
      } catch (e) {
        console.error('loadBags error:', e)
        this.error = 'ไม่สามารถโหลด keywordได้ กรุณาลองใหม่อีกครั้ง'
      } finally {
        this.loading = false
      }
    },

    // GET /api/alert/event/list (⚠️ backend ยังไม่มี route นี้)
    // growth_percent ยังไม่ถูกคำนวณจริงจากฝั่ง worker (เป็น 0 เสมอ) เลยใช้อัตราส่วน
    // current_volume / min_volume แทน — เหมือน SpikeEventList.vue ใช้อยู่แล้ว
    mapSpikeSeverity(raw) {
      const currentVolume = Number(raw.current_volume) || 0
      const minVolume = Number(raw.min_volume) || 0
      const volumeRatio = minVolume > 0 ? currentVolume / minVolume : 0
      const severity = volumeRatio >= 3 ? 'high' : volumeRatio >= 1.5 ? 'medium' : 'low'
      return { ...raw, severity }
    },

    async loadEvents() {
      try {
        const headers = {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json',
        }
        const { data } = await this.axios.get(`${EVENTS_BASE}/getSpikeEvents`, {
          headers,
          params: { limit: 200 },
        })
        const rawEvents = Array.isArray(data?.data) ? data.data : []
        this.events = rawEvents.map(this.mapSpikeSeverity)
      } catch (e) {
        console.error('loadEvents error:', e)
        // ไม่ให้ error ของ spike event บล็อกการแสดงผล keywordหลัก
        this.events = []
      }
    },

    onSelectEvent(event) {
      if (event?.keyword_id) {
        this.$router.push(`/alert/keyword/${event.keyword_id}?event=${event._id}`)
      }
    },

    openCreate() {
      this.editingBag = null
      this.showForm = true
    },

    openEdit(bag) {
      // ส่ง copy ของ object ไปแทน reference ตรง ๆ กันฟอร์มแก้ค่าดิบใน list ก่อน save จริง
      this.editingBag = { ...bag }
      this.showForm = true
    },

    openChart(bag) {
      this.chartingBag = bag
      this.showChart = true
    },

    goToDetail(bag) {
      this.$router.push(`/alert/keyword/${bag._id}`)
    },

    // PUT /deleteKeywordBag?id=... (soft delete)
    remove(bag) {
      Swal.fire({
        title: 'ยืนยันการลบ keyword',
        html: `คุณต้องการลบ keyword <b>${bag.name}</b> หรือไม่?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ลบ',
        cancelButtonText: 'ยกเลิก',
        didOpen: () => {
          const iconContent = document.querySelector('.swal2-icon-content')
          if (iconContent) iconContent.style.display = 'none'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteBag(bag._id)
        }
      })
    },

    // PUT /deleteKeywordBag?id=... (soft delete)
    async deleteBag(id) {
      try {
        const headers = {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json',
        }
        await this.axios.put(
          `${KEYWORD_BAG_BASE}/deleteKeywordBag?id=${encodeURIComponent(id)}`,
          {},
          { headers }
        )
        await this.loadBags()
      } catch (e) {
        console.error('remove bag error:', e)
        this.error = 'ไม่สามารถลบ keywordได้ กรุณาลองใหม่อีกครั้ง'
      }
    },

    onSaved() {
      this.showForm = false
      this.editingBag = null
      this.loadBags()
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

.kb-page {
  color: var(--gp-charcoal, #2e2a26);
}

.brand-block {
  position: relative;
  z-index: 1;
}

.brand-title {
  font-family: 'Prompt', sans-serif;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.brand-tag {
  font-size: 1.05rem;
  font-style: italic;
  opacity: 0.85;
}

.kb-stats {
  margin-top: 24px;
  z-index: 99 !important;
}

.bg-content {
  position: relative;
  z-index: 99 !important;
}

.kb-layout {
  margin-top: 4px;
}

.kb-panel {
  position: relative;
  z-index: 1;
  background: #ffffff;
  border-radius: 20px;
  padding: 28px 28px 32px;
  box-shadow: 0 12px 40px rgba(45, 32, 20, 0.08);
  height: 100%;
}

.kb-panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.kb-panel-title {
  font-family: 'Prompt', sans-serif;
  font-weight: 600;
  font-size: 1.4rem;
  margin-bottom: 2px;
  text-align: left;
}

.kb-panel-desc {
  color: #8a8178;
  font-size: 0.92rem;
  margin-bottom: 0;
  text-align: left;
}

.kb-new-btn {
  /* background: #0ABAB5; */
  border: none;
  border-radius: 10px;
  font-weight: 600;
  padding: 10px 18px;
  box-shadow: 0 2px 6px rgba(217, 164, 65, 0.35);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.kb-new-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(217, 164, 65, 0.45);
}

.kb-controls {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 22px;
}

.kb-search {
  position: relative;
  flex: 1 1 260px;
  min-width: 220px;
}

.kb-search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #b3aaa0;
  font-size: 0.85rem;
}

.kb-search-input {
  width: 100%;
  border: 1px solid #ece5da;
  background: #fbf8f3;
  border-radius: 10px;
  padding: 10px 14px 10px 34px;
  font-size: 0.92rem;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.kb-search-input:focus {
  border-color: #d9a441;
  box-shadow: 0 0 0 3px rgba(217, 164, 65, 0.15);
}

.kb-filter-group {
  display: flex;
  gap: 6px;
  background: #f5f1e9;
  padding: 4px;
  border-radius: 10px;
}

.kb-filter-chip {
  border: none;
  background: transparent;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #8a8178;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.kb-filter-chip:focus-visible {
  outline: 2px solid #d9a441;
  outline-offset: 1px;
}

.kb-filter-chip.active {
  background: #ffffff;
  color: #2e2a26;
  box-shadow: 0 2px 6px rgba(45, 32, 20, 0.1);
}

.kb-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.kb-card {
  position: relative;
  background: #fffdfa;
  border: 1px solid #f0e9dc;
  border-radius: 14px;
  padding: 18px 18px 16px;
  border-top: 3px solid #d7d0c4;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.kb-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(45, 32, 20, 0.1);
}

.kb-card-clickable {
  cursor: pointer;
}

.kb-card.is-active {
  border-top-color: #2bb673;
}

.kb-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.kb-status {
  display: flex;
  align-items: center;
  gap: 7px;
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
  0% {
    box-shadow: 0 0 0 0 rgba(43, 182, 115, 0.55);
  }

  70% {
    box-shadow: 0 0 0 8px rgba(43, 182, 115, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(43, 182, 115, 0);
  }
}

.kb-badge {
  font-weight: 500;
  font-size: 0.72rem;
  padding: 4px 8px;
}

.kb-card-actions {
  display: flex;
  gap: 2px;
}

.kb-icon-btn {
  border: none;
  background: transparent;
  color: #8a8178;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.kb-icon-btn:hover {
  background: #f5f1e9;
  color: #2e2a26;
}

.kb-icon-btn.kb-icon-danger:hover {
  background: #fdeceb;
  color: #e2574c;
}

.kb-icon-btn:focus-visible {
  outline: 2px solid #d9a441;
  outline-offset: 1px;
}

.kb-card-name {
  font-family: 'Prompt', sans-serif;
  font-weight: 600;
  font-size: 1.02rem;
  margin-bottom: 6px;
  text-align: left;
}

.kb-card-query {
  color: #8a8178;
  font-size: 0.85rem;
  margin-bottom: 0;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kb-skeleton {
  border-top-color: #ece5da;
}

.sk-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f0ebe1 25%, #f7f3ea 37%, #f0ebe1 63%);
  background-size: 400% 100%;
  animation: sk-shimmer 1.4s ease infinite;
  margin-bottom: 10px;
}

.sk-w60 {
  width: 60%;
  height: 16px;
}

.sk-w90 {
  width: 90%;
}

.sk-w40 {
  width: 40%;
}

@keyframes sk-shimmer {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}

.kb-empty {
  text-align: center;
  padding: 56px 20px;
}

.kb-empty-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #f5f1e9;
  color: #d9a441;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 1.3rem;
}

@media (prefers-reduced-motion: reduce) {

  .kb-dot.pulse,
  .sk-line {
    animation: none;
  }
}

@media (max-width: 576px) {
  .kb-panel {
    padding: 20px 16px 24px;
  }

  .kb-panel-head {
    flex-direction: column;
  }

  .kb-new-btn {
    width: 100%;
  }
}

:deep(.howto-modal) {
  font-family: 'Noto Sans Thai', sans-serif;
  border-radius: 20px;
  border: none;
  padding: 28px 26px 24px;
}

.howto-close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background: #f5f1e9;
  color: #8a8178;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, color 0.15s ease;
}

.howto-close:hover {
  background: #f0e9dc;
  color: #2e2a26;
}

/* Header */
.howto-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
  padding-right: 28px;
}

.howto-head-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #f6d98b, #d9a441);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
  box-shadow: 0 6px 14px rgba(217, 164, 65, 0.35);
}

.howto-title {
  font-family: 'Prompt', sans-serif;
  font-weight: 600;
  font-size: 1.15rem;
  color: #2e2a26;
}

.howto-subtitle {
  font-size: 0.82rem;
  color: #8a8178;
  margin-top: 2px;
}

/* Steps */
.howto-steps {
  display: flex;
  flex-direction: column;
}

.howto-step {
  display: flex;
  gap: 14px;
  padding: 14px 4px;
  border-bottom: 1px dashed #f0e9dc;
  position: relative;
}

.howto-step:last-child {
  border-bottom: none;
}

.howto-step-num {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #f5f1e9;
  color: #b8863a;
  font-family: 'Prompt', sans-serif;
  font-weight: 600;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.howto-step-body {
  flex: 1;
  min-width: 0;
}

.howto-step-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-weight: 600;
  font-size: 0.92rem;
  color: #2e2a26;
  margin-bottom: 4px;
}

.howto-step-icon {
  color: #d9a441;
  font-size: 0.85rem;
}

.howto-step-desc {
  font-size: 0.84rem;
  line-height: 1.6;
  color: #6f665d;
}

.howto-step-desc code {
  background: #f5f1e9;
  color: #b8863a;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.82em;
}

/* Callout */
.howto-callout {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #fff8ec;
  border: 1px solid #f0dfb8;
}

.howto-callout-icon {
  color: #b8863a;
  font-size: 1.1rem;
  margin-top: 2px;
  flex-shrink: 0;
}

.howto-callout-title {
  font-weight: 600;
  font-size: 0.88rem;
  color: #2e2a26;
  margin-bottom: 2px;
}

.howto-callout-desc {
  font-size: 0.82rem;
  color: #8a7550;
  line-height: 1.55;
}

/* Footnote */
.howto-footnote {
  margin-top: 18px;
  font-size: 0.8rem;
  color: #8a8178;
  text-align: center;
  line-height: 1.6;
}

.howto-step-highlight {
  background: #ecfeff;
  border: 1px solid #b8e8f0;
  border-radius: 14px;
  padding: 14px 14px;
  margin-bottom: 4px;
}

.howto-step-highlight .howto-step-desc {
  color: #8a7550;
}

.howto-step-num-highlight {
  background: linear-gradient(135deg, #8bf3f6, #32bed1);
  color: #fff;
}
</style>