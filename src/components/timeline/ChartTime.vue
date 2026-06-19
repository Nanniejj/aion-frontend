<template>
  <div id="chart">
    <!-- {{ filters }} -->
    <div class="text-center mt-10 py-4 pb-0" v-if="loading">
      <vue-element-loading :active="loading" size="30" background-color="rgba(255, 255, 255, 0.5)" color="#17a2b891"
        spinner="bar-fade-scale" />
    </div>

    <b-row v-if="!loading">
      <b-col cols="12">
        <StaticTimeline :datachart="datachart" />
      </b-col>

      <b-col cols="12">
        <div class="text-left px-4">
          <span class="">สถิติรายชั่วโมง </span>
          <b-icon icon="info-circle" variant="info" role="button" id="popover-button-variant" tabindex="0"
            class="flaot-right ml-2" />
        </div>

        <b-popover target="popover-button-variant" variant="info" triggers="focus">
          <template #title>
            <i class="fa fa-lightbulb-o" aria-hidden="true"></i> <b>Tip</b>
          </template>
          <div> <i class="fa fa-plus-circle" aria-hidden="true"></i> ขยายข้อมูลกราฟ</div>
          <div> <i class="fa fa-minus-circle" aria-hidden="true"></i> ลดขนาดข้อมูลกราฟ</div>
          <div>
            <img width="15" height="15" src="https://img.icons8.com/ios/50/select-none.png" alt="select-none" />
            เลือกช่วงเวลาดูโพสต์ด้านล่าง
          </div>
          <div><b>double click</b> เพื่อเลือกช่วงเวลาที่จะดู</div>
          <div><i class="fa fa-hand" aria-hidden="true"></i> ใช้เลื่อนดูกราฟ</div>
          <div><i class="fa fa-home" aria-hidden="true"></i> reset กราฟ</div>
        </b-popover>

        <apexchart ref="chart" type="line" height="350" :options="chartOptions" :series="series" />
      </b-col>

      <!-- กล่อง SummaryButton + TrendSummary: ยังคงผูกกับ series ตามเดิม -->
      <b-col v-if="series.length !== 0" cols="12" class="">
          <SummaryButton
            class="text-left mb-3"
            :hideTrandButton="series.length === 0"
            :posts="postsForAnalysis"
            :filters="filters"
            :loading="loading"
            :topN="5"
            :openTopUsers="openTopUsers"
            :openTrendSummary="openTrendSummary"
          />
        <b-collapse id="trendSummary" v-model="openTrendSummary" class="my-2">
            <TrendSummary
            :summary="summary"
            :filters="filters"
            :dates="dates"
            :totals-count="totals_count"
            />
        </b-collapse>
      </b-col>

      <!-- TopUsers: ย้ายออกมานอกเงื่อนไข series เพื่อให้โหลดข้อมูลของตัวเองได้ทันที ไม่ต้องรอกราฟ -->
      <b-col cols="12" class="">
        <b-collapse id="top-participants" v-model="openTopUsers" class="my-2">
            <TopUsers
                :filters="filters"
                @filterAccount="updateAccount"
            />
        </b-collapse>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import axios from 'axios'
import StaticTimeline from '@/components/timeline/StaticTimeline.vue'
import TrendSummary from '@/components/timeline/TrendSummary.vue'
import TopUsers from '@/components/timeline/TopUsers.vue'
import SummaryButton from "@/components/timeline/SummaryButton.vue";
import TopAccounts from "@/components/rankingperson/TopAccount.vue";

export default {
  components: { apexchart: VueApexCharts, StaticTimeline, TrendSummary,
    TopUsers,TopAccounts, SummaryButton },
    props: {
        filters: { type: Object, default: () => ({}) },
        postsForAnalysis: {type: [Array, Object], required: true}
    },
  data() {
      return {
        openTrendSummary: false,
        openTopUsers: true,
      username: "",
      dates: null,
      totals_count: null,
      datachart: null,
      loading: false,
      error: null,
      series: [],
      activeRange: null,
      lastPayload: null,

      // ===== Double-click detector =====
      _dblDelay: 350,
      _clickMap: {},
      _flushTimer: null,

      summary: { text: '', bullets: [], stats: null },

      // ---- Top posts (เฉพาะช่วงพีค) ----
      topPosts: [],
      topLoading: false,
      topError: null,
      topLimit: 10,
      topPage: 1,
      canNextTop: false,
      peakOnlyWindow: null, // { startUtcMs, endUtcMs, startLocalStr, endLocalStr }

      chartOptions: {
        colors: ['#ff962e', '#17a2b8', '#e75aa1'],
        chart: {
          type: 'line',
          fontFamily: 'Prompt, FontAwesome, sans-serif',
          toolbar: {
            show: true,
            tools: { download: true, selection: true, zoom: true, pan: true, reset: true }
          }
        },
        stroke: { curve: 'smooth', width: 3 },
        markers: { size: 5 },
        legend: { position: 'top' },
        xaxis: {
          type: 'datetime',
          labels: {
            datetimeUTC: true,
            formatter: (v) => {
              const ts = Number(v)
              if (!Number.isFinite(ts)) return ''
              return new Intl.DateTimeFormat('th-TH', {
                timeZone: 'Asia/Bangkok',
                hourCycle: 'h23',
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              }).format(ts)
            }
          }
        },
        tooltip: {
          shared: true,
          x: {
            formatter: (v) => {
              const ts = Number(v)
              if (!Number.isFinite(ts)) return ''
              return new Intl.DateTimeFormat('th-TH', {
                timeZone: 'Asia/Bangkok',
                hourCycle: 'h23',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }).format(ts)
            }
          }
        },
        yaxis: [
          { seriesName: 'Posts', title: { text: 'Posts' }, min: 0, labels: { formatter: v => Math.round(v).toLocaleString() || 0 } },
          { seriesName: 'Messages', title: { text: 'Messages' }, min: 0, labels: { formatter: v => Math.round(v).toLocaleString() || 0 } },
          { seriesName: 'Engagement', title: { text: 'Engagement' }, min: 0, opposite: true, labels: { formatter: v => Math.round(v).toLocaleString() || 0 } }
        ],
        noData: { text: 'กำลังโหลดข้อมูล...' }
      },

      // ตารางสรุปผู้มีส่วนร่วม
      peakSummaryFields: [
        { key: 'account_name', label: 'account_name' },
        { key: 'date', label: 'date' },
        { key: 'engage', label: 'engage', class: 'text-right' },
        { key: 'full_text', label: 'full_text' }
      ]
    }
  },
  computed: {
    peakSummaryItems() {
      return (this.topPosts || []).map(p => ({
        account_name: p.author || p.account_name || '-',
        date: this.fmtLocal(p.created_at),
        engage: this.fmtNum(p.engagement),
        full_text: p.text || '-'
      }))
    }
  },
    mounted() {
    this.username = localStorage.getItem("username");
    // events & zoom
    this.$nextTick(() => {
      const events = {
        selection: (chartCtx, { xaxis }) => this.onRangeSelected(xaxis),
        click: () => { if (this.activeRange) this.clearRange() },
        dataPointSelection: (e, ctx, opts) => this._handlePointEvent(opts),
        markerClick: (e, ctx, opts) => this._handlePointEvent(opts)
      }
      const selectionAndZoom = {
        chart: {
          selection: { enabled: true, type: 'x', fill: { opacity: 0.2 }, stroke: { width: 1 } },
          zoom: { enabled: true, type: 'x', autoScaleYaxis: true },
          toolbar: {
            show: true, tools: { selection: true, zoom: true, pan: true, reset: true, download: true },
            autoSelected: 'pan'
          },
          events
        }
      }
      if (this.$refs.chart && this.$refs.chart.updateOptions) {
        this.$refs.chart.updateOptions(selectionAndZoom, false, true)
      } else if (this.$refs.chart && this.$refs.chart.chart && this.$refs.chart.chart.updateOptions) {
        this.$refs.chart.chart.updateOptions(selectionAndZoom, false, true)
      } else {
        this.chartOptions = Object.assign({}, this.chartOptions, selectionAndZoom)
      }
    })

    this._flushTimer = setInterval(() => this._flushClickMap(), Math.max(this._dblDelay * 2, 1000))

    // โหลดข้อมูลกราฟ (เปิดใช้งานเพื่อให้ getPostCharts ยิงตั้งแต่เปิดหน้า
    // พร้อมๆ กับ getPostSentiment ของ TopUsers ที่ mount ทันทีแล้ว)
    this.fetchData()
  },
  beforeDestroy() {
    if (this._flushTimer) { clearInterval(this._flushTimer); this._flushTimer = null }
    this._clickMap = {}
  },
  watch: {
    filters: {
          handler(newVal, oldVal) {
        
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            this.topPage = 1
            this.fetchData()
            }
        },
      deep: true
    }
  },
    methods: {
    updateAccount(val) {
        this.filters.account = val 
            this.$emit('filter-account', val)
            this.fetchData();
    },
    // ---------- Double-click core ----------
    _pointKey(si, di) { return String(Number(si)) + ':' + String(Number(di)) },
    _flushClickMap() {
      if (!this || !this._clickMap) return
      const now = Date.now()
      for (const k in this._clickMap) {
        if (!Object.prototype.hasOwnProperty.call(this._clickMap, k)) continue
        const rec = this._clickMap[k]
        if (!rec || (now - rec.t) > this._dblDelay) delete this._clickMap[k]
      }
    },
    _handlePointEvent(opts) {
      try {
        const seriesIndex = Number(opts && opts.seriesIndex)
        const dataPointIndex = Number(opts && opts.dataPointIndex)
        const w = opts && opts.w
        if (!Number.isFinite(seriesIndex) || !Number.isFinite(dataPointIndex) || !(w && w.config && w.config.series)) return

        const s = w.config.series[seriesIndex]
        const d = s && s.data ? s.data[dataPointIndex] : null
        const seriesName = (s && s.name) ? s.name : ''
        const x = Array.isArray(d) ? d[0] : (d && typeof d === 'object' ? d.x : undefined)
        const y = Array.isArray(d) ? d[1] : (d && typeof d === 'object' ? d.y : undefined)
        if (!Number.isFinite(x)) return

        if (!this._clickMap) this._clickMap = {}
        const key = this._pointKey(seriesIndex, dataPointIndex)
        const now = Date.now()
        const prev = this._clickMap[key]

        if (!prev || (now - prev.t) > this._dblDelay) {
          this._clickMap[key] = { count: 1, t: now, payload: { seriesIndex, dataPointIndex, seriesName, x, y } }
          return
        }
        prev.count += 1
        prev.t = now
        if (prev.count >= 2) {
          const payload = prev.payload
          delete this._clickMap[key]
          this.onPointClick(payload)
        }
      } catch (e) { console.warn('[ChartTime] _handlePointEvent error:', e) }
    },
    // ---------------------------------------

    setNoDataText(text) {
      const patch = { noData: { text } }
      if (this.$refs.chart && this.$refs.chart.updateOptions) {
        this.$refs.chart.updateOptions(patch, false, true)
      } else if (this.$refs.chart && this.$refs.chart.chart && this.$refs.chart.chart.updateOptions) {
        this.$refs.chart.chart.updateOptions(patch, false, true)
      } else {
        this.chartOptions = Object.assign({}, this.chartOptions, patch)
      }
    },

    async fetchData() {
      this.loading = true
      this.error = null
      this.series = []
      this.summary = { text: '', bullets: [], stats: null }
      this.setNoDataText('กำลังโหลดข้อมูล...')

      const API_URL = 'https://api2.cognizata.com/api/v2/userposts/getPostCharts'
      const params = this.filters

      try {
        const { data } = await axios.get(API_URL, { params })
        this.datachart = data
        this.applyData(data) // คำนวณพีค -> สรุป -> ยิง API ช่วงพีค
      } catch (err) {
        console.error(err)
        this.error = 'โหลดข้อมูลไม่สำเร็จ'
        this.series = []
        this.setNoDataText('โหลดข้อมูลไม่สำเร็จ')
        this.summary = { text: '', bullets: [], stats: null }
      } finally {
        this.loading = false
      }
    },

    async fetchTopPosts() {
        console.log(
            "%c CALL → fetchTopPosts from:",
            "color: yellow; background: red;",
            new Error().stack.split("\n")[2] // บรรทัดที่เรียก
        );
      this.topLoading = true
      this.topError = null
      this.topPosts = []

      if (!this.peakOnlyWindow || !this.peakOnlyWindow.startLocalStr || !this.peakOnlyWindow.endLocalStr) {
        this.topLoading = false
        this.topError = 'ยังไม่พบช่วงพีคจากกราฟ'
        return
      }

      const API_URL = 'https://api2.cognizata.com/api/v2/userposts/getPostSentiment'
      const params = {
        sentiment: this.filters.sentiment || '1,0,-1',
        keyword: this.filters.keyword || '',
        
        sort_by: 'engagement',
        limit: this.topLimit,
        page: this.topPage,
        start: this.peakOnlyWindow.startLocalStr,
        end: this.peakOnlyWindow.endLocalStr
      }

      try {
        const { data } = await axios.get(API_URL, { params })
        const raw = Array.isArray(data) ? data
          : (data && Array.isArray(data.data)) ? data.data
            : (data && Array.isArray(data.items)) ? data.items
              : (data && Array.isArray(data.results)) ? data.results
                : []
        this.topPosts = raw.slice(0, 10)
        // this.topPosts = raw.slice(0, 10).map((p, idx) => this.normalizePost(p, idx))
        this.canNextTop = this.topPosts.length >= this.topLimit
      } catch (err) {
        console.error(err)
        this.topError = 'โหลดโพสต์แบบเต็มไม่สำเร็จ'
        this.canNextTop = false
      } finally {
        this.topLoading = false
      }
    },

    changeTopPage(newPage) {
      if (newPage < 1) return
      this.topPage = newPage
    //   this.fetchTopPosts()
    },

      normalizePost(p, idx) {
        console.log("post === ",p);
        
      const id = (p && (p._id || p.id)) ? (p._id || p.id) : ('row-' + idx)
      const text = (p && (p.message || p.content || p.full_text || p.text)) ? (p.message || p.content || p.full_text || p.text) : '-'
      const engagement = Number(
        (p && (p.engagement_sum != null ? p.engagement_sum : (p.engagement != null ? p.engagement : p.total_engagement))) || 0
      )
      const created_at = (p && (p.created_time || p.createdAt || p.posted_at || p.created_at)) ? (p.created_time || p.createdAt || p.posted_at || p.created_at) : null
      const author = (p && (p.author_name || p.author || p.page_name || p.account_name)) ? (p.author_name || p.author || p.page_name || p.account_name) : null
      const source = (p && (p.source || p.platform)) ? (p.source || p.platform) : null
      const sentiment = p.sentiment;
      const url = (p && (p.permalink_url || p.url)) ? (p.permalink_url || p.url) : null
      const photos = p.photos;
      const profile_image = p.profile_image;
      return { id,photos,profile_image, text, engagement, created_at, author, source, url, account_name: author, sentiment }
    },

    isAllZero(rows) {
      return rows.length > 0 && rows.every(r =>
        Number(r.post_count || 0) === 0 &&
        Number(r.engagement_sum || 0) === 0 &&
        Number(r.message_sum || 0) === 0
      )
    },

    applyData(payload) {
        console.log(
            "%c CALL → applyData from:",
            "color: yellow; background: red;",
            new Error().stack.split("\n")[2] // บรรทัดที่เรียก
        );
      this.lastPayload = payload
      const tz = (payload && payload.range && payload.range.timezone) ? payload.range.timezone : '+07:00'
      const rows = (payload && Array.isArray(payload.seriesHourly)) ? payload.seriesHourly : []

      if (!rows.length || this.isAllZero(rows)) {
        this.series = []
        this.setNoDataText('ไม่พบข้อมูล')
        this.summary = { text: 'ไม่พบข้อมูลในช่วงที่เลือก', bullets: [], stats: null }
        this.peakOnlyWindow = null
        return
      }

      this.setNoDataText('')

      const offsetMs = this.parseOffsetToMs(tz)
      const keyOf = (d, t) => d + ' ' + String(t).padStart(5, '0')
      const dataMap = new Map()

      rows.forEach(r => {
        const key = keyOf(r.date, r.time)
        dataMap.set(key, {
          post: Number(r.post_count || 0),
          engagement: Number(r.engagement_sum || 0),
          msg: Number(r.message_sum || 0)
        })
      })

      const toUtcMs = (d, t) => Date.parse(d + 'T' + t + ':00' + tz)
      const localMsFromUtc = (utc) => utc + offsetMs

      let minLocal = Infinity, maxLocal = -Infinity
      rows.forEach(r => {
        const utc = toUtcMs(r.date, r.time)
        const local = localMsFromUtc(utc)
        if (local < minLocal) minLocal = local
        if (local > maxLocal) maxLocal = local
      })

      const HOUR = 3600000
      const gridStartLocal = Math.floor(minLocal / HOUR) * HOUR
      const gridEndLocal = Math.floor(maxLocal / HOUR) * HOUR

      const posts = []
      const engagements = []
      const messages = []

      for (let lt = gridStartLocal; lt <= gridEndLocal; lt += HOUR) {
        const iso = new Date(lt).toISOString()
        const d = iso.slice(0, 10)
        const t = iso.slice(11, 16)
        const key = keyOf(d, t)
        const val = dataMap.get(key) || { post: 0, engagement: 0, msg: 0 }
        const tsUTC = lt - offsetMs

        posts.push([tsUTC, val.post])
        messages.push([tsUTC, val.msg])
        engagements.push([tsUTC, val.engagement])
      }

      this.series = [
        { name: 'Posts', data: posts, yAxisIndex: 0 },
        { name: 'Messages', data: messages, yAxisIndex: 1 },
        { name: 'Engagement', data: engagements, yAxisIndex: 2 }
      ]

      // ✅ สร้างสรุปแนวโน้ม (เพิ่ม "เริ่มพีคแรก" + "เริ่มพีคก่อนพีคสุด" + "พีคสุด")
      this.summary = this.buildSummaryFromSeries({ rows, tz, posts, messages, engagements })

      // ✅ คำนวณ “ช่วงพีคสูงสุด” (เฉพาะ 1 ชั่วโมงของพีค)
      const peak = this.findPeak(engagements) // {ts, value}
      if (peak && peak.ts != null) {
        const peakHourStartUtc = peak.ts
        const peakHourEndUtc = peakHourStartUtc + (59 * 60 * 1000) + (59 * 1000)
        const tzStr = tz || '+07:00'
        const startLocalStr = this.toLocalISOStringNoTZ(peakHourStartUtc, tzStr)
        const endLocalStr = this.toLocalISOStringNoTZ(peakHourEndUtc, tzStr)
        this.peakOnlyWindow = {
          startUtcMs: peakHourStartUtc,
          endUtcMs: peakHourEndUtc,
          startLocalStr,
          endLocalStr
        }
      } else {
        this.peakOnlyWindow = null
      }

      // 🔥 โหลดโพสต์เฉพาะช่วงพีคทันที
      this.topPage = 1
    //   this.fetchTopPosts()
    },

    // หาพีคสูงสุดจากคู่ [ts, value]
    findPeak(pairArr) {
      let maxV = -Infinity, maxTs = null
      for (let i = 0; i < pairArr.length; i++) {
        const ts = pairArr[i][0], v = pairArr[i][1]
        if (v > maxV) { maxV = v; maxTs = ts }
      }
      return { ts: maxTs, value: maxV }
    },

    onPointClick({ seriesIndex, dataPointIndex, seriesName, x, y }) {
      const tzStr = (this.lastPayload && this.lastPayload.range && this.lastPayload.range.timezone) ? this.lastPayload.range.timezone : '+07:00'
      const offsetMs = this.parseOffsetToMs(tzStr)

      const localText = new Intl.DateTimeFormat('th-TH', {
        timeZone: 'Asia/Bangkok',
        hourCycle: 'h23',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(x)

      const isoUtc = new Date(x).toISOString()
      const isoLocal = new Date(x + offsetMs).toISOString().replace('Z', tzStr)
      const xLocalEpoch = x + offsetMs

      this.$emit('point-click', {
        seriesIndex, dataPointIndex, seriesName,
        x, y, isoUtc, isoLocal, localText, xLocalEpoch
      })
    },

    onRangeSelected(xaxis) {
      const start = xaxis.min
      const end = xaxis.max
      if (!Number.isFinite(start) || !Number.isFinite(end)) return

      this.activeRange = { start, end }

      const tzStr = (this.lastPayload && this.lastPayload.range && this.lastPayload.range.timezone) ? this.lastPayload.range.timezone : '+07:00'
      const offsetMs = this.parseOffsetToMs(tzStr)

      const fmtLocal = (ms) => new Intl.DateTimeFormat('th-TH', {
        timeZone: 'Asia/Bangkok',
        hourCycle: 'h23',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(ms)

      const startUtcIso = new Date(start).toISOString()
      const endUtcIso = new Date(end).toISOString()
      const startIsoLocal = new Date(start + offsetMs).toISOString().replace('Z', tzStr)
      const endIsoLocal = new Date(end + offsetMs).toISOString().replace('Z', tzStr)

      this.$emit('range-selected', {
        start, end,
        startUtcIso, endUtcIso,
        startIsoLocal, endIsoLocal,
        startLocalText: fmtLocal(start),
        endLocalText: fmtLocal(end)
      })
    },

    clearRange() {
      this.activeRange = null
      const patch = {
        xaxis: { min: undefined, max: undefined },
        chart: { selection: { xaxis: { min: undefined, max: undefined } } }
      }
      if (this.$refs.chart && this.$refs.chart.resetZoom) this.$refs.chart.resetZoom()
      if (this.$refs.chart && this.$refs.chart.updateOptions) {
        this.$refs.chart.updateOptions(patch, false, true)
      } else if (this.$refs.chart && this.$refs.chart.chart && this.$refs.chart.chart.updateOptions) {
        this.$refs.chart.chart.updateOptions(patch, false, true)
      } else {
        this.chartOptions = Object.assign({}, this.chartOptions, patch)
      }
      this.$emit('range-cleared')
    },

    parseOffsetToMs(tzStr) {
      const m = String(tzStr || '').trim().match(/^([+-])(\d{2}):?(\d{2})$/)
      if (!m) return 0
      const sign = m[1] === '+' ? 1 : -1
      const hh = parseInt(m[2], 10) || 0
      const mm = parseInt(m[3], 10) || 0
      return sign * (hh * 60 + mm) * 60 * 1000
    },

    // ====== Utilities ======
    fmtNum(n) {
      const v = Number(n || 0)
      return Number.isFinite(v) ? v.toLocaleString('th-TH') : '0'
    },
    fmtLocal(ms) {
      if (!ms) return '-'
      const d = new Date(ms)
      if (isNaN(d)) return '-'
      return new Intl.DateTimeFormat('th-TH', {
        timeZone: 'Asia/Bangkok',
        hourCycle: 'h23',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(d)
    },
    toLocalISOStringNoTZ(ms, tzStr) {
      const tz = (String(tzStr || '+07:00').match(/^([+-])(\d{2}):?(\d{2})$/)) ? tzStr : '+07:00'
      const off = this.parseOffsetToMs(tz)
      const d = new Date(ms + off)
      const pad = (n) => String(n).padStart(2, '0')
      const yyyy = d.getUTCFullYear()
      const MM = pad(d.getUTCMonth() + 1)
      const dd = pad(d.getUTCDate())
      const HH = pad(d.getUTCHours())
      const mm = pad(d.getUTCMinutes())
      const ss = pad(d.getUTCSeconds())
      return `${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}`
    },


    // ====== สรุปแนวโน้ม พร้อมโหมดหา startPeak 2 แบบ และสรุปรอบแรก ======
    // START_PEAK_POLICY:
    //   'FIRST_GE100'              -> เริ่มพีค = ชั่วโมงแรกที่แตะ ≥ 100
    //   'FIRST_GT0_BEFORE_GE100'   -> เริ่มพีค = ชั่วโมงแรกที่ >0 ก่อน "ชั่วโมงแรกที่แตะ ≥100"
    // ====== สรุปแนวโน้ม + เงื่อนไขพีคแรก: >=100 และ > median ======
    buildSummaryFromSeries({ rows, tz, posts, messages, engagements }) {
      // --- ปรับค่าคอนฟิกเงื่อนไขพีคแรกที่นี่ ---
      const FIRST_PEAK_MIN = 10;       // พีคแรกต้องไม่น้อยกว่า 100
      const USE_POSITIVE_MEDIAN = true; // true = คิด median จากค่า > 0, false = รวมศูนย์ด้วย
      const REQUIRE_LOCAL_MAX = true;   // true = ต้องเป็น local maxima (≥ เพื่อนบ้าน)
      // --- เกณฑ์สรุปหลังพีค ---
      const PRE_HOURS = 3, POST_HOURS = 3;
      const FOLLOW_MIN_PCT = 15, STRONG_THRESHOLD = 25;

      // รวมยอด
      const totals = rows.reduce((acc, r) => {
        acc.post += Number(r.post_count || 0);
        acc.msg += Number(r.message_sum || 0);
        acc.eng += Number(r.engagement_sum || 0);
        return acc;
      }, { post: 0, msg: 0, eng: 0 });

      const fmtLocal = (ms) => new Intl.DateTimeFormat('th-TH', {
        timeZone: 'Asia/Bangkok', hourCycle: 'h23',
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }).format(ms);

      // ยูทิลคำนวณเฉลี่ยช่วง
      const avgRange = (arr, s, e) => {
        const slice = arr.slice(Math.max(0, s), Math.min(arr.length, e));
        if (!slice.length) return 0;
        const sum = slice.reduce((acc, it) => acc + Number(it[1] || 0), 0);
        return sum / slice.length;
      };

      // ยูทิล median
      const median = (nums) => {
        if (!nums.length) return 0;
        const a = nums.slice().sort((x, y) => x - y);
        const mid = Math.floor(a.length / 2);
        return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
      };

      // ---------- หา "พีคสูงสุด" ----------
      let peakEngIdx = -1, peakEngVal = -Infinity;
      for (let i = 0; i < engagements.length; i++) {
        const v = Number(engagements[i][1] || 0);
        if (v > peakEngVal) { peakEngVal = v; peakEngIdx = i; }
      }
      const peakEngTs = peakEngIdx >= 0 ? engagements[peakEngIdx][0] : null;

      // ---------- หา "พีคแรก" ด้วยเงื่อนไข ≥100 และ > median ----------
      const engValsAll = engagements.map(p => Number(p?.[1] || 0));
      const engValsPos = engValsAll.filter(v => v > 0);
      const med = median(USE_POSITIVE_MEDIAN ? engValsPos : engValsAll);

      let startPeakIdx = -1;
      for (let i = 0; i < engagements.length; i++) {
        const cur = Number(engagements[i][1] || 0);
        if (cur < FIRST_PEAK_MIN) continue;       // ต้อง ≥ 100
        if (!(cur > med)) continue;               // ต้อง > median

        if (REQUIRE_LOCAL_MAX) {
          const prev = i > 0 ? Number(engagements[i - 1][1] || 0) : -Infinity;
          const next = i + 1 < engagements.length ? Number(engagements[i + 1][1] || 0) : -Infinity;
          if (cur < prev || cur < next) continue; // ไม่ใช่ local maxima
        }
        startPeakIdx = i;                          // เจอตัวแรกตามเกณฑ์
        break;
      }

      // ถ้าไม่พบเลย ให้ fallback เป็น “ชั่วโมงแรกที่ ≥100” หรือ “ชั่วโมงแรกที่ >0”
      if (startPeakIdx === -1) {
        const idxGE100 = engagements.findIndex(p => Number(p?.[1] || 0) >= FIRST_PEAK_MIN);
        if (idxGE100 !== -1) startPeakIdx = idxGE100;
        else {
          const idxGT0 = engagements.findIndex(p => Number(p?.[1] || 0) > 0);
          if (idxGT0 !== -1) startPeakIdx = idxGT0;
        }
      }

      const startPeakTs = startPeakIdx >= 0 ? engagements[startPeakIdx][0] : null;

      // ---------- สรุปหลัก: เปรียบเทียบ “หลังพีคสูงสุด” ----------
      let text, surgeDetail = null;
      if (peakEngIdx >= 0 && posts.length === engagements.length) {
        const preStart = Math.max(0, peakEngIdx - PRE_HOURS);
        const preEndEx = peakEngIdx;
        const postStart = peakEngIdx + 1;
        const postEndEx = Math.min(posts.length, postStart + POST_HOURS);

        const postAvgBefore = avgRange(posts, preStart, preEndEx);
        const postAvgAfter = avgRange(posts, postStart, postEndEx);
        const postLiftPct = postAvgBefore === 0 ? (postAvgAfter > 0 ? 100 : 0)
          : ((postAvgAfter - postAvgBefore) / postAvgBefore) * 100;

        const enoughWindow = (preEndEx > preStart) && (postEndEx > postStart);
        this.totals_count = totals;

        if (enoughWindow) {
          const intensity = postLiftPct >= STRONG_THRESHOLD ? 'เพิ่มสูงมากขึ้น'
            : (postLiftPct >= FOLLOW_MIN_PCT ? 'เพิ่มขึ้น' : 'ไม่ได้พุ่งตามอย่างมีนัยสำคัญ');
          if (postLiftPct >= FOLLOW_MIN_PCT) {
            text = `Engagement มียอดสูงที่สุดช่วง ${fmtLocal(peakEngTs)} และหลังจากนั้นโพสต์${intensity} (${postLiftPct.toFixed(0)}%) เมื่อเทียบกับช่วงก่อนพีค`;
          } else {
            text = `แม้ Engagement จะมียอดสูงสุดช่วง ${fmtLocal(peakEngTs)} แต่โพสต์${intensity} (${postLiftPct.toFixed(0)}%)`;
          }
          surgeDetail = { peakEngTs, postAvgBefore, postAvgAfter, postLiftPct };
        } else {
          text = `พบ Engagement เริ่มพุ่งสูงขึ้นวันที่ ${fmtLocal(peakEngTs)} แต่ข้อมูลก่อน/หลังไม่เพียงพอสำหรับสรุปการดีดตัวของโพสต์`;
        }
      } else {
        // fallback แนวโน้มรวม
        const takeAvg = (arr, n, fromEnd = false) => {
          if (!arr.length) return 0;
          let slice = fromEnd ? arr.slice(-n) : arr.slice(0, n);
          if (!slice.length) slice = arr;
          const sum = slice.reduce((s, it) => s + Number(it[1] || 0), 0);
          return sum / slice.length;
        };
        const headN = 6, tailN = 6;
        const postAvgHead = takeAvg(posts, headN, false);
        const postAvgTail = takeAvg(posts, tailN, true);
        const postChange = postAvgHead === 0 ? (postAvgTail > 0 ? 100 : 0)
          : ((postAvgTail - postAvgHead) / postAvgHead) * 100;
        const trend = postChange > 10 ? `เพิ่มขึ้น ${postChange.toFixed(0)}%`
          : postChange < -10 ? `ลดลง ${Math.abs(postChange).toFixed(0)}%` : 'ทรงตัว';
        text = `ภาพรวมชั่วโมงล่าสุดที่แสดง: โพสต์รวม ${this.fmtNum(totals.post)} ข้อความรวม ${this.fmtNum(totals.msg)} และการมีส่วนร่วมรวม ${this.fmtNum(totals.eng)} โดยแนวโน้มโพสต์โดยรวม${trend}`;
      }

      // ---------- สรุป “รอบแรก” หลังเริ่มพีคครั้งแรก ----------
      // กันซ้ำถ้าจุดพีคเริ่ม = จุดพีคสูงสุด (เวลาเดียวกัน)
      const samePeak = (startPeakIdx >= 0 && peakEngIdx >= 0 && startPeakIdx === peakEngIdx);

      if (startPeakIdx >= 0 && posts.length === engagements.length) {
        const preStart2 = Math.max(0, startPeakIdx - PRE_HOURS);
        const preEndEx2 = startPeakIdx;
        const aftStart2 = startPeakIdx + 1;
        const aftEndEx2 = Math.min(posts.length, aftStart2 + POST_HOURS);
        if (preEndEx2 > preStart2 && aftEndEx2 > aftStart2) {
          const preAvg2 = avgRange(posts, preStart2, preEndEx2);
          const aftAvg2 = avgRange(posts, aftStart2, aftEndEx2);
          const pct2 = preAvg2 === 0 ? (aftAvg2 > 0 ? 100 : 0) : ((aftAvg2 - preAvg2) / preAvg2) * 100;
          const intensity2 = pct2 >= STRONG_THRESHOLD ? 'เพิ่มสูงมากขึ้น'
            : (pct2 >= FOLLOW_MIN_PCT ? 'เพิ่มขึ้น' : 'ไม่ได้พุ่งตามอย่างมีนัยสำคัญ');
          const firstRoundText = pct2 >= FOLLOW_MIN_PCT
            ? `Engagement เริ่มพุ่งสูงขึ้นตั้งแต่ประมาณ ${fmtLocal(startPeakTs)} โพสต์${intensity2} (${pct2.toFixed(0)}%) เมื่อเทียบกับช่วงก่อนหน้า`
            : `Engagement เริ่มพุ่งสูงขึ้นตั้งแต่ประมาณ ${fmtLocal(startPeakTs)} โพสต์${intensity2} (${pct2.toFixed(0)}%)`;

          // ถ้าเวลาเดียวกัน ให้แสดงแค่ข้อความเดียว ไม่พรีเพนด์ซ้ำ
          if (!samePeak) {
            text = text ? `${firstRoundText}\n${text}` : firstRoundText;
          } else if (!text) {
            // เผื่อกรณีข้อความหลักไม่ถูกตั้งค่า
            text = firstRoundText;
          }
        }
      }

      // ---------- bullets ----------
      const bullets = [];
      if (startPeakTs != null) {
        bullets.push(`Engagement เริ่มพุ่งสูงขึ้นช่วง ${fmtLocal(startPeakTs)} `);//(เกณฑ์: ≥${FIRST_PEAK_MIN} และ > ค่ากลาง ≈ ${this.fmtNum(Math.round(med))})
      }
      if (peakEngTs != null && Number.isFinite(peakEngVal)) {
        // ถ้าเวลาเดียวกัน ไม่ต้องเพิ่มบูลเล็ตซ้ำ
        if (!samePeak) {
          bullets.push(`Engagement พุ่งสูงสุดช่วง ${fmtLocal(peakEngTs)} (≈ ${this.fmtNum(peakEngVal)})`);
        }
      }

      // พีคของโพสต์
      let peakPostIdx = -1, peakPostVal = -Infinity;
      for (let i = 0; i < posts.length; i++) {
        const v = Number(posts[i][1] || 0);
        if (v > peakPostVal) { peakPostVal = v; peakPostIdx = i; }
      }
      if (peakPostIdx >= 0) {
        bullets.push(`ความถี่ในการโพสต์สูงสุดช่วง ${fmtLocal(posts[peakPostIdx][0])} (${this.fmtNum(peakPostVal)} โพสต์)`);
      }

      // เฉลี่ย/ช่วงเวลา
      const hourCount = posts.length || 1;
      bullets.push(`เฉลี่ยต่อชั่วโมง: โพสต์ ${this.fmtNum(Math.round(totals.post / hourCount))} | ข้อความ ${this.fmtNum(Math.round(totals.msg / hourCount))} | Engagement ${this.fmtNum(Math.round(totals.eng / hourCount))}`);
      if (posts.length > 1) {
        const start = posts[0][0], end = posts[posts.length - 1][0];
        this.dates = `ช่วงเวลา ${fmtLocal(start)} – ${fmtLocal(end)}`;
      }

      return {
        text,
        bullets,
        stats: {
          totals,
          startPeak: { index: startPeakIdx, ts: startPeakTs, medianUsed: med },
          peakEng: { index: peakEngIdx, ts: peakEngTs, value: peakEngVal },
          followFromPeak: surgeDetail
        }
      };
    }



  }
}
</script>

<style scoped>
#chart {
  max-width: 100%;
  margin: 24px auto;
}

#chart {
  margin-bottom: 0px;
}

@media only screen and (min-width: 0px) and (max-width: 800px) {
  #chart>div>div:nth-child(2) {
    padding-left: 0px;
    padding-right: 0px;
  }
}
</style>