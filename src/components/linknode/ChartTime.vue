<template>
  <div id="chart">
    <!-- debug -->
    <!-- {{ series }} -->
    <apexchart type="line" height="350" :options="chartOptions" :series="series" />
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import axios from 'axios'

export default {
  components: { apexchart: VueApexCharts },
  props: {
    filters: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      loading: false,
      error: null,
      series: [],
      chartOptions: {
        colors: ['#438afe', '#17a2b8', '#e75aa1'],
        chart: {
          type: 'line',
          fontFamily: 'Prompt, FontAwesome, sans-serif',
          toolbar: { show: true, tools: { download: true, selection: true, zoom: true, pan: true, reset: true } }
        },
        stroke: { curve: 'smooth', width: 3 },
        markers: { size: 3 },
        legend: { position: 'top' },
        xaxis: {
          type: 'datetime',
          labels: {
            // ให้ Apex ใช้ค่า UTC ภายใน แล้ว formatter จะแสดงเวลาไทย (จะไม่ +7 ซ้ำ)
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
          { seriesName: 'Posts', title: { text: 'Posts' }, min: 0 },
          { seriesName: 'Engagement', title: { text: 'Engagement' }, min: 0, opposite: true },
          { seriesName: 'Messages', title: { text: 'Messages' }, min: 0 }
        ],
        noData: { text: 'กำลังโหลดข้อมูล...' }
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  watch: {
    // ถ้า filter เปลี่ยน ให้ยิงใหม่
    filters: { handler() { this.fetchData() }, deep: true }
  },
  methods: {
    async fetchData() {
      this.loading = true
      this.error = null
      const API_URL = 'http://localhost:3000/api/v2/userposts/getPostCharts'
      const params = this.filters

      try {
        const { data } = await axios.get(API_URL, { params })
        this.applyData(data)
      } catch (err) {
        console.error(err)
        this.error = 'โหลดข้อมูลไม่สำเร็จ'
        this.series = []
      } finally {
        this.loading = false
      }
    },

    /**
     * แปลง payload -> series 3 เส้น และเติม 0 ให้ชั่วโมงที่ขาด
     * หลักการเวลา:
     * - แปลง local time (+07:00) เป็น epoch (UTC) ครั้งเดียวตอน parse
     * - ใช้ datetimeUTC:true + formatter(timeZone='Asia/Bangkok') แสดงผลเป็นเวลาไทย
     */
    applyData(payload) {
      const tz = (payload && payload.range && payload.range.timezone) || '+07:00'
      const rows = Array.isArray(payload?.seriesHourly) ? payload.seriesHourly : []
      const offsetMs = this.parseOffsetToMs(tz)

      // key 'YYYY-MM-DD HH:mm' (เวลาท้องถิ่น)
      const keyOf = (d, t) => `${d} ${t.padStart(5, '0')}`
      const dataMap = new Map()

      // สร้างแผนที่ข้อมูลแบบ key=เวลาท้องถิ่น
      rows.forEach(r => {
        const key = keyOf(r.date, r.time)
        dataMap.set(key, {
          post: Number(r.post_count || 0),
          engagement: Number(r.engagement_sum || 0),
          msg: Number(r.message_sum || 0)
        })
      })

      if (!rows.length) {
        this.series = []
        return
      }

      // 1) หา "กรอบเวลาท้องถิ่น" จากข้อมูลจริง
      //    - แปลง local -> UTC ms ด้วย offset (ครั้งเดียว)
      const toUtcMs = (d, t) => Date.parse(`${d}T${t}:00${tz}`) // ex: '2025-09-01T00:00:00+07:00' -> epoch
      const localMsFromUtc = (utc) => utc + offsetMs            // timeline แบบท้องถิ่น (utc+offset trick)

      let minLocal = Infinity
      let maxLocal = -Infinity
      rows.forEach(r => {
        const utc = toUtcMs(r.date, r.time)
        const local = localMsFromUtc(utc)
        if (local < minLocal) minLocal = local
        if (local > maxLocal) maxLocal = local
      })

      // ปัดให้ตรงชั่วโมง
      let gridStartLocal = Math.floor(minLocal / 3600000) * 3600000
      let gridEndLocal = Math.floor(maxLocal / 3600000) * 3600000

      // 2) วนทุกชั่วโมงใน "ไทม์ไลน์ท้องถิ่น" แล้วเติม 0 ถ้าไม่มี
      const posts = []
      const engagements = []
      const messages = []

      for (let lt = gridStartLocal; lt <= gridEndLocal; lt += 3600000) {
        // แปลง lt (local timeline) -> key 'YYYY-MM-DD HH:mm'
        const iso = new Date(lt).toISOString()     // iso นี้จะเทียบเท่าเวลาท้องถิ่นเพราะเราเลื่อน offset มาแล้ว
        const d = iso.slice(0, 10)                  // YYYY-MM-DD
        const t = iso.slice(11, 16)                 // HH:mm
        const key = keyOf(d, t)

        const val = dataMap.get(key) || { post: 0, engagement: 0, msg: 0 }

        // แปลงกลับเป็น UTC ms สำหรับ Apex (เพราะเราใช้ datetimeUTC:true)
        const tsUTC = lt - offsetMs

        posts.push([tsUTC, val.post])
        engagements.push([tsUTC, val.engagement])
        messages.push([tsUTC, val.msg])
      }

      this.series = [
        { name: 'Posts', data: posts, yAxisIndex: 0 },
        { name: 'Engagement', data: engagements, yAxisIndex: 1 },
        { name: 'Messages', data: messages, yAxisIndex: 2 }
      ]
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
  margin: 24px auto;
}
</style>
