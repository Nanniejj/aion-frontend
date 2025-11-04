<template>
  <div id="chart">
    <div class="text-center mt-10 py-4 pb-0" v-if="loading">
      <vue-element-loading :active="loading" size="30" background-color="rgba(255, 255, 255, 0.5)" color="#17a2b891"
        spinner="bar-fade-scale" />
    </div>

    <b-row v-if="!loading">
      <b-col cols="12">
        <StaticTimeline :datachart="datachart" />
      </b-col>

      <b-col cols="12">
        <div class="text-left px-4"> <span class="">สถิติรายชั่วโมง </span>
          <!-- <b-button class="text-left" id="popover-button-variant" href="#" tabindex="0" >  -->
          <b-icon icon="info-circle" variant="info" role="button" id="popover-button-variant" tabindex="0"
            class="flaot-right ml-2">
          </b-icon>
          <!-- </b-button> -->
        </div>

        <b-popover target="popover-button-variant" variant="info" triggers="focus">
          <template #title> <i class="fa fa-lightbulb-o" aria-hidden="true"></i> <b>Tip</b></template>
          <div> <i class="fa fa-plus-circle" aria-hidden="true"></i> ขยายข้อมูลกราฟ</div>
          <div> <i class="fa fa-minus-circle" aria-hidden="true"></i> ลดขนาดข้อมูลกราฟ</div>
          <div> <img width="15" height="15" src="https://img.icons8.com/ios/50/select-none.png" alt="select-none" />
            เลือกช่วงเวลาดูโพสต์ด้านล่าง</div>
          <div><b>double click</b> เพื่อเลือกช่วงเวลาที่จะดู</div>
          <div>
            <i class="fa fa-hand" aria-hidden="true"></i> ใช้เลื่อนดูกราฟ
          </div>
          <div> <i class="fa fa-home" aria-hidden="true"></i> reset กราฟ</div>


        </b-popover>
        <apexchart ref="chart" type="line" height="350" :options="chartOptions" :series="series" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import axios from 'axios'
import StaticTimeline from '@/components/timeline/StaticTimeline.vue'

export default {
  components: { apexchart: VueApexCharts, StaticTimeline },
  props: { filters: { type: Object, default: () => ({}) } },
  data() {
    return {
      datachart: null,
      loading: false,
      error: null,
      series: [],
      activeRange: null,
      lastPayload: null,

      // ===== Double-click detector (fixed) =====
      _dblDelay: 350,          // 300–450 ได้
      _clickMap: {},           // ใช้ {} ให้ Vue ตามทัน
      _flushTimer: null,
      // ========================================

      chartOptions: {
        colors: ['#ff962e', '#17a2b8', '#e75aa1'],
        chart: {
          type: 'line',
          fontFamily: 'Prompt, FontAwesome, sans-serif',
          toolbar: {
            show: true,
            tools: { download: true, selection: true, zoom: true, pan: true, reset: true }
          }
          // events จะถูกผูกใน mounted()
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
      }
    }
  },
  mounted() {
    // ผูก events + เปิด selection/zoom
    this.$nextTick(() => {
      const events = {
        selection: (chartCtx, { xaxis }) => this.onRangeSelected(xaxis),
        // zoomed: (chartCtx, { xaxis }) => this.onRangeSelected(xaxis),
        click: () => { if (this.activeRange) this.clearRange() },

        // รวม handler เดียว กันเคสยิงสลับกัน
        dataPointSelection: (event, chartCtx, opts) => this._handlePointEvent(opts),
        markerClick: (event, chartCtx, opts) => this._handlePointEvent(opts)
      }

      const selectionAndZoom = {
        chart: {
          selection: { enabled: true, type: 'x', fill: { opacity: 0.2 }, stroke: { width: 1 } },
          zoom: { enabled: true, type: 'x', autoScaleYaxis: true },
          toolbar: {
            show: true,
            tools: { selection: true, zoom: true, pan: true, reset: true, download: true },
            autoSelected: 'pan'
          },
          events
        }
      }

      if (this.$refs.chart?.updateOptions) {
        this.$refs.chart.updateOptions(selectionAndZoom, false, true)
      } else if (this.$refs.chart?.chart?.updateOptions) {
        this.$refs.chart.chart.updateOptions(selectionAndZoom, false, true)
      } else {
        this.chartOptions = { ...this.chartOptions, ...selectionAndZoom }
      }
    })

    // ผูกเป็น arrow function เพื่อให้ this ไม่หลุด
    this._flushTimer = setInterval(() => this._flushClickMap(), Math.max(this._dblDelay * 2, 1000))

    this.fetchData()
  },
  beforeDestroy() {
    if (this._flushTimer) { clearInterval(this._flushTimer); this._flushTimer = null }
    this._clickMap = {}
  },
  watch: {
    filters: { handler() { this.fetchData() }, deep: true }
  },
  methods: {
    // ---------- Double-click core ----------
    _pointKey(si, di) { return `${Number(si)}:${Number(di)}` },

    _flushClickMap() {
      // ถ้าโดนเรียกตอนคอมโพเนนต์กำลัง unmount
      if (!this || !this._clickMap) return
      const now = Date.now()
      for (const k in this._clickMap) {
        if (!Object.prototype.hasOwnProperty.call(this._clickMap, k)) continue
        const rec = this._clickMap[k]
        if (!rec || (now - rec.t) > this._dblDelay) {
          delete this._clickMap[k]
        }
      }
    },

    _handlePointEvent(opts) {
      try {
        // เผื่อ opts แปลก
        const seriesIndex = Number(opts?.seriesIndex)
        const dataPointIndex = Number(opts?.dataPointIndex)
        const w = opts?.w
        if (!Number.isFinite(seriesIndex) || !Number.isFinite(dataPointIndex) || !w?.config?.series) return

        const s = w.config.series[seriesIndex]
        const d = s?.data?.[dataPointIndex]
        const seriesName = s?.name ?? ''
        const x = Array.isArray(d) ? d[0] : (typeof d === 'object' && d ? d.x : undefined)
        const y = Array.isArray(d) ? d[1] : (typeof d === 'object' && d ? d.y : undefined)
        if (!Number.isFinite(x)) return

        // บูต _clickMap เผื่อโดน set เป็น null/undefined จากที่อื่น
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
      } catch (e) {
        // กัน UI พังถ้าเกิด edge case
        console.warn('[ChartTime] _handlePointEvent error:', e)
      }
    },
    // ---------------------------------------

    setNoDataText(text) {
      const patch = { noData: { text } }
      if (this.$refs.chart?.updateOptions) {
        this.$refs.chart.updateOptions(patch, false, true)
      } else if (this.$refs.chart?.chart?.updateOptions) {
        this.$refs.chart.chart.updateOptions(patch, false, true)
      } else {
        this.chartOptions = { ...this.chartOptions, ...patch }
      }
    },

    async fetchData() {
      this.loading = true
      this.error = null
      this.series = []
      this.setNoDataText('กำลังโหลดข้อมูล...')

      const API_URL = 'https://api2.cognizata.com/api/v2/userposts/getPostCharts'
      const params = this.filters

      try {
        const { data } = await axios.get(API_URL, { params })
        this.datachart = data
        this.applyData(data)
      } catch (err) {
        console.error(err)
        this.error = 'โหลดข้อมูลไม่สำเร็จ'
        this.series = []
        this.setNoDataText('โหลดข้อมูลไม่สำเร็จ')
      } finally {
        this.loading = false
      }
    },

    isAllZero(rows) {
      return rows.length > 0 && rows.every(r =>
        Number(r.post_count || 0) === 0 &&
        Number(r.engagement_sum || 0) === 0 &&
        Number(r.message_sum || 0) === 0
      )
    },

    applyData(payload) {
      this.lastPayload = payload
      const tz = (payload?.range?.timezone) || '+07:00'
      const rows = Array.isArray(payload?.seriesHourly) ? payload.seriesHourly : []

      if (!rows.length || this.isAllZero(rows)) {
        this.series = []
        this.setNoDataText('ไม่พบข้อมูล')
        return
      }

      this.setNoDataText('')

      const offsetMs = this.parseOffsetToMs(tz)
      const keyOf = (d, t) => `${d} ${t.padStart(5, '0')}`
      const dataMap = new Map()

      rows.forEach(r => {
        const key = keyOf(r.date, r.time)
        dataMap.set(key, {
          post: Number(r.post_count || 0),
          engagement: Number(r.engagement_sum || 0),
          msg: Number(r.message_sum || 0)
        })
      })

      const toUtcMs = (d, t) => Date.parse(`${d}T${t}:00${tz}`)
      const localMsFromUtc = (utc) => utc + offsetMs

      let minLocal = Infinity
      let maxLocal = -Infinity
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
    },

    onPointClick({ seriesIndex, dataPointIndex, seriesName, x, y }) {
      const tzStr = (this.lastPayload?.range?.timezone) || '+07:00'
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
        x, y,
        isoUtc,
        isoLocal,
        localText,
        xLocalEpoch
      })
    },

    onRangeSelected(xaxis) {
      const start = xaxis.min
      const end = xaxis.max
      if (!Number.isFinite(start) || !Number.isFinite(end)) return

      this.activeRange = { start, end }

      const tzStr = (this.lastPayload?.range?.timezone) || '+07:00'
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
      if (this.$refs.chart?.resetZoom) this.$refs.chart.resetZoom()
      if (this.$refs.chart?.updateOptions) {
        this.$refs.chart.updateOptions(patch, false, true)
      } else if (this.$refs.chart?.chart?.updateOptions) {
        this.$refs.chart.chart.updateOptions(patch, false, true)
      } else {
        this.chartOptions = { ...this.chartOptions, ...patch }
      }
      this.$emit('range-cleared')
    },

    parseOffsetToMs(tzStr) {
      const m = /^([+-])(\d{2}):?(\d{2})$/.exec(String(tzStr).trim())
      if (!m) return 0
      const sign = m[1] === '+' ? 1 : -1
      const hh = parseInt(m[2], 10) || 0
      const mm = parseInt(m[3], 10) || 0
      return sign * (hh * 60 + mm) * 60 * 1000
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
