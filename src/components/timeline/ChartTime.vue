<template>
  <div id="chart">
    <!-- {{ filters }} -->
    <div class="text-center my-10 py-4" v-if="loading">
      <vue-element-loading
        :active="loading"
        size="30"
        background-color="rgba(255, 255, 255, 0.5)"
        color="#17a2b891"
        spinner="bar-fade-scale"
      />
    </div>

    <b-row v-if="!loading">
      <b-col cols="12">
        <StaticTimeline :datachart="datachart" />
      </b-col>

      <b-col cols="12">
        <div class="text-left px-4">สถิติรายชั่วโมง</div>
        <apexchart
          ref="chart"
          type="line"
          height="350"
          :options="chartOptions"
          :series="series"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import axios from 'axios'
import StaticTimeline from '@/components/timeline/StaticTimeline.vue'

export default {
  components: {
    apexchart: VueApexCharts,
    StaticTimeline
  },

  props: {
    filters: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      datachart: null,
      loading: false,
      error: null,
      series: [],
      activeRange: null,
      lastPayload: null,

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

        // จัดแกนให้ตรงกับซีรีส์: 0=Posts, 1=Messages, 2=Engagement(opposite)
        yaxis: [
          {
            seriesName: 'Posts',
            title: { text: 'Posts' },
            min: 0,
            labels: { formatter: (val) => Math.round(val).toLocaleString() || 0 }
          },
          {
            seriesName: 'Messages',
            title: { text: 'Messages' },
            min: 0,
            labels: { formatter: (val) => Math.round(val).toLocaleString() || 0 }
          },
          {
            seriesName: 'Engagement',
            title: { text: 'Engagement' },
            min: 0,
            opposite: true,
            labels: { formatter: (val) => Math.round(val).toLocaleString() || 0 }
          }
        ],

        // ข้อความเริ่มต้น จะถูกเปลี่ยนแบบไดนามิก
        noData: { text: 'กำลังโหลดข้อมูล...' }
      }
    }
  },

  mounted() {
    // ผูก events + เปิด selection/zoom
    this.$nextTick(() => {
      const events = {
        selection: (chartCtx, { xaxis }) => this.onRangeSelected(xaxis),
        zoomed: (chartCtx, { xaxis }) => this.onRangeSelected(xaxis),

        click: () => {
          if (this.activeRange) this.clearRange()
        },

        dataPointSelection: (event, chartCtx, opts) => {
          const { seriesIndex, dataPointIndex, w } = opts
          const seriesName = w.config.series[seriesIndex]?.name || ''
          const x = w.config.series[seriesIndex]?.data?.[dataPointIndex]?.[0]
          const y = w.config.series[seriesIndex]?.data?.[dataPointIndex]?.[1]
          this.onPointClick({ seriesIndex, dataPointIndex, seriesName, x, y })
        },

        markerClick: (event, chartCtx, opts) => {
          const { seriesIndex, dataPointIndex, w } = opts
          const seriesName = w.config.series[seriesIndex]?.name || ''
          const x = w.config.series[seriesIndex]?.data?.[dataPointIndex]?.[0]
          const y = w.config.series[seriesIndex]?.data?.[dataPointIndex]?.[1]
          this.onPointClick({ seriesIndex, dataPointIndex, seriesName, x, y })
        }
      }

      const selectionAndZoom = {
        chart: {
           fontFamily: 'Prompt, FontAwesome, sans-serif',
          selection: {
            enabled: true,
            type: 'x',
            fill: { opacity: 0.2 },
            stroke: { width: 1 }
          },
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

    this.fetchData()
  },

  watch: {
    filters: {
      handler() {
        this.fetchData()
      },
      deep: true
    }
  },

  methods: {
    /** เปลี่ยนข้อความ noData แบบไดนามิก */
    setNoDataText(text) {
      const patch = { noData: { text } }

      if (this.$refs.chart?.updateOptions) {
        this.$refs.chart.updateOptions(patch, false, true)
      } else if (this.$refs.chart?.chart?.updateOptions) {
        this.$refs.chart.chart.updateOptions(patch, false, true)
      } else {
        // fallback ถ้า ref ยังไม่พร้อม
        this.chartOptions = { ...this.chartOptions, ...patch }
      }
    },

    async fetchData() {
      this.loading = true
      this.error = null
      this.series = []

      // ให้แสดง noData ทันทีถ้ามี
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

    /** ถือว่า "ไม่มีข้อมูล" หากทุกรายการเป็นศูนย์ */
    isAllZero(rows) {
      return (
        rows.length > 0 &&
        rows.every(
          (r) =>
            Number(r.post_count || 0) === 0 &&
            Number(r.engagement_sum || 0) === 0 &&
            Number(r.message_sum || 0) === 0
        )
      )
    },

    applyData(payload) {
      this.lastPayload = payload

      const tz = payload?.range?.timezone || '+07:00'
      const rows = Array.isArray(payload?.seriesHourly) ? payload.seriesHourly : []

      // กรณีไม่มีข้อมูลเลย
      if (!rows.length || this.isAllZero(rows)) {
        this.series = []
        this.setNoDataText('ไม่พบข้อมูล')
        return
      }

      // มีข้อมูล → ซ่อนข้อความ noData
      this.setNoDataText('')

      const offsetMs = this.parseOffsetToMs(tz)

      const keyOf = (d, t) => `${d} ${t.padStart(5, '0')}`

      const dataMap = new Map()
      rows.forEach((r) => {
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

      rows.forEach((r) => {
        const utc = toUtcMs(r.date, r.time)
        const local = localMsFromUtc(utc)
        if (local < minLocal) minLocal = local
        if (local > maxLocal) maxLocal = local
      })

      const HOUR = 3600000
      let gridStartLocal = Math.floor(minLocal / HOUR) * HOUR
      let gridEndLocal = Math.floor(maxLocal / HOUR) * HOUR

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

    /** เมื่อคลิกที่จุดข้อมูล */
    onPointClick({ seriesIndex, dataPointIndex, seriesName, x, y }) {
      if (!Number.isFinite(x)) return

      const tzStr = this.lastPayload?.range?.timezone || '+07:00'
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
        seriesIndex,
        dataPointIndex,
        seriesName,
        x,
        y,
        isoUtc,
        isoLocal, // เช่น "2025-09-10T01:00:00+07:00"
        localText, // เช่น "10 ก.ย. 2568 01:00"
        xLocalEpoch
      })
    },

    /** เมื่อมีการเลือกช่วง/ซูม */
    onRangeSelected(xaxis) {
      const start = xaxis.min
      const end = xaxis.max
      if (!Number.isFinite(start) || !Number.isFinite(end)) return

      this.activeRange = { start, end }

      const tzStr = this.lastPayload?.range?.timezone || '+07:00'
      const offsetMs = this.parseOffsetToMs(tzStr)

      const fmtLocal = (ms) =>
        new Intl.DateTimeFormat('th-TH', {
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
        start,
        end, // epoch ms (UTC)
        startUtcIso,
        endUtcIso, // ISO UTC
        startIsoLocal,
        endIsoLocal, // ISO local (+07:00)
        startLocalText: fmtLocal(start), // human-readable local
        endLocalText: fmtLocal(end)
      })
    },

    /** คลิกพื้นกราฟเพื่อล้างช่วง */
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

    // helper: "+07:00" -> milliseconds offset
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
  /* margin: 24px auto; */
}

@media only screen and (min-width: 0px) and (max-width: 800px) {
  #chart > div > div:nth-child(2) {
    padding-left: 0px;
    padding-right: 0px;
  }
}
</style>
