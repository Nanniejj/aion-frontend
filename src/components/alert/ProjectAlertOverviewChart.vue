<template>
  <div class="pao-panel">
    <div class="pao-head">
      <div>
        <h5 class="pao-title mb-0">
          <b-icon icon="bar-chart-line" class="mr-1" />
          ภาพรวมทุก keyword ตามเวลา
        </h5>
        <p class="pao-sub mb-0">แนวโน้มปริมาณโพสต์และ Engagement รวมทุก keyword ในโปรเจกต์</p>
      </div>

      <div class="pao-controls">
        <div class="kf-filter-group" role="tablist">
          <button
            v-for="opt in viewOptions"
            :key="opt.value"
            type="button"
            class="kf-filter-chip"
            :class="{ active: viewMode === opt.value }"
            @click="viewMode = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>

        <div class="kf-filter-group" role="tablist">
          <button
            v-for="opt in bucketOptions"
            :key="opt.value"
            type="button"
            class="kf-filter-chip"
            :class="{ active: bucket === opt.value }"
            @click="bucket = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>

        <b-form-select v-model="rangeDays" :options="rangeOptions" size="sm" class="pao-range-select" />
      </div>
    </div>

    <div v-if="!loading && !error" class="pao-stats">
      <div class="pao-stat">
        <div class="pao-stat-value">{{ formatNumber(totals.post_count) }}</div>
        <div class="pao-stat-label">โพสต์ในช่วงนี้</div>
      </div>
      <div class="pao-stat">
        <div class="pao-stat-value">{{ formatNumber(totals.total_engagement) }}</div>
        <div class="pao-stat-label">Engagement ในช่วงนี้</div>
      </div>
      <div class="pao-stat">
        <div class="pao-stat-value">{{ formatNumber(totals.spike_count) }}</div>
        <div class="pao-stat-label">แจ้งเตือนในช่วงนี้</div>
      </div>
      <div class="pao-stat">
        <div class="pao-stat-value">{{ totals.active_keywords }}/{{ totals.total_keywords }}</div>
        <div class="pao-stat-label">keywords ที่ทำงานอยู่</div>
      </div>
    </div>

    <b-alert v-if="error" show variant="danger" class="mt-3 mb-0">{{ error }}</b-alert>

    <div v-else-if="loading" class="pao-loading">
      <b-spinner small class="mr-2" />กำลังโหลดข้อมูล...
    </div>

    <div v-else-if="!hasData" class="pao-empty">
      <b-icon icon="graph-up" class="pao-empty-icon" />
      <p class="mb-0">ยังไม่มีข้อมูลสถิติในช่วงเวลาที่เลือก</p>
    </div>

    <b-row v-else>
      <b-col :lg="viewMode === 'byKeyword' ? 8 : 12">
        <apexchart ref="chart" type="line" height="340" :options="chartOptions" :series="series" />
      </b-col>

      <b-col lg="4" v-if="viewMode === 'byKeyword'" class="mt-3 mt-lg-0">
        <div class="pao-leaderboard">
          <div class="pao-leaderboard-title">อันดับ keyword (โพสต์รวมในช่วงนี้)</div>
          <div v-for="(k, idx) in rankedKeywords" :key="k.keyword_id" class="pao-rank-item">
            <span class="pao-rank-index">{{ idx + 1 }}</span>
            <span class="pao-rank-name">{{ k.name }}</span>
            <span class="pao-rank-value">{{ formatNumber(k.total_post_count) }}</span>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
const KEYWORD_BAG_BASE = 'https://api2.cognizata.com/api/v2/alert'

const SERIES_COLORS = ['#d9a441', '#456a92', '#2b7a4b', '#c94a3f', '#7a5c9e', '#b3aaa0']

function toThaiDateTime(value, opts) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('th-TH', {
    timeZone: 'Asia/Bangkok',
    hourCycle: 'h23',
    ...opts,
  }).format(date)
}

export default {
  name: 'ProjectAlertOverviewChart',

  data() {
    return {
      loading: false,
      error: '',
      bucket: 'day',
      rangeDays: 7,
      viewMode: 'total',

      totals: { total_keywords: 0, active_keywords: 0, post_count: 0, total_engagement: 0, spike_count: 0 },
      timeseries: [],
      byKeyword: [],

      viewOptions: [
        { value: 'total', label: 'รวมทั้งหมด' },
        { value: 'byKeyword', label: 'แยกตาม keyword' },
      ],

      bucketOptions: [
        { value: 'day', label: 'รายวัน' },
        { value: 'hour', label: 'รายชั่วโมง' },
      ],

      rangeOptions: [
        { value: 3, text: '3 วันล่าสุด' },
        { value: 7, text: '7 วันล่าสุด' },
        { value: 14, text: '14 วันล่าสุด' },
        { value: 30, text: '30 วันล่าสุด' },
      ],
    }
  },

  computed: {
    hasData() {
      return this.viewMode === 'total'
        ? this.timeseries.length > 0
        : this.byKeyword.some((k) => k.timeseries.length > 0)
    },

    rankedKeywords() {
      return [...this.byKeyword].sort((a, b) => b.total_post_count - a.total_post_count)
    },

    series() {
      if (this.viewMode === 'byKeyword') {
        return this.rankedKeywords.map((k) => ({
          name: k.name,
          data: k.timeseries.map((row) => [new Date(row.date).getTime(), row.post_count || 0]),
        }))
      }

      return [
        {
          name: 'จำนวนโพสต์',
          data: this.timeseries.map((row) => [new Date(row.date).getTime(), row.post_count || 0]),
        },
        {
          name: 'Engagement',
          data: this.timeseries.map((row) => [new Date(row.date).getTime(), row.total_engagement || 0]),
          yAxisIndex: 1,
        },
      ]
    },

    chartOptions() {
      const isHour = this.bucket === 'hour'
      const isByKeyword = this.viewMode === 'byKeyword'

      return {
        colors: isByKeyword ? SERIES_COLORS : ['#24A19C', '#FF4E88'],
        chart: {
          type: 'line',
          fontFamily: 'Prompt, sans-serif',
          toolbar: {
            show: true,
            tools: { download: true, selection: true, zoom: true, pan: true, reset: true },
          },
        },
        stroke: { curve: 'smooth', width: 3 },
        markers: { size: 6 },
        legend: { position: 'top' },
        grid: { borderColor: '#f0e9dc' },
        xaxis: {
          type: 'datetime',
          labels: {
            datetimeUTC: false,
            formatter: (v) => {
              const ts = Number(v)
              if (!Number.isFinite(ts)) return ''
              return toThaiDateTime(ts, isHour
                ? { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }
                : { day: '2-digit', month: 'short' })
            },
          },
        },
        tooltip: {
          shared: true,
          x: {
            formatter: (v) => {
              const ts = Number(v)
              if (!Number.isFinite(ts)) return ''
              return toThaiDateTime(ts, {
                day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
              })
            },
          },
        },
        yaxis: isByKeyword
          ? { min: 0, title: { text: 'จำนวนโพสต์' }, labels: { formatter: (v) => Math.round(v).toLocaleString('th-TH') } }
          : [
              {
                seriesName: 'จำนวนโพสต์',
                title: { text: 'จำนวนโพสต์' },
                min: 0,
                labels: { formatter: (v) => Math.round(v).toLocaleString('th-TH') },
              },
              {
                seriesName: 'Engagement',
                title: { text: 'Engagement' },
                min: 0,
                opposite: true,
                labels: { formatter: (v) => Math.round(v).toLocaleString('th-TH') },
              },
            ],
        noData: { text: 'ไม่พบข้อมูล' },
      }
    },
  },

  watch: {
    bucket() {
      this.fetchData()
    },
    rangeDays() {
      this.fetchData()
    },
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      this.loading = true
      this.error = ''

      try {
        const headers = {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json',
        }

        const endDate = new Date()
        const startDate = new Date(endDate.getTime() - this.rangeDays * 24 * 60 * 60 * 1000)

        const { data } = await this.axios.get(
          `${KEYWORD_BAG_BASE}/getProjectAlertTimeseries`,
          {
            headers,
            params: {
              bucket: this.bucket,
              start_date: startDate.toISOString(),
              end_date: endDate.toISOString(),
              top: 5,
            },
          }
        )

        this.totals = data?.data?.totals || this.totals
        this.timeseries = data?.data?.timeseries || []
        this.byKeyword = data?.data?.byKeyword || []
      } catch (error) {
        console.error('ProjectAlertOverviewChart fetchData error:', error)
        this.error = error?.response?.data?.message || 'ไม่สามารถโหลดข้อมูลภาพรวมได้'
        this.timeseries = []
        this.byKeyword = []
      } finally {
        this.loading = false
      }
    },

    formatNumber(n) {
      return Number(n || 0).toLocaleString('th-TH')
    },
  },
}
</script>

<style scoped>
.pao-panel {
  background: #ffffff;
  border-radius: 20px;
  padding: 26px 28px;
  box-shadow: 0 12px 40px rgba(45, 32, 20, 0.08);
}

.pao-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.pao-title {
  font-family: 'Prompt', sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  color: #2e2a26;
  text-align: left;
}

.pao-sub {
  font-size: 0.82rem;
  color: #8a8178;
  margin-top: 2px;
  text-align: left;
}

.pao-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.kf-filter-group {
  display: flex;
  gap: 6px;
  background: #f5f1e9;
  padding: 4px;
  border-radius: 10px;
}

.kf-filter-chip {
  border: none;
  background: transparent;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 500;
  color: #8a8178;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.kf-filter-chip.active {
  background: #ffffff;
  color: #2e2a26;
  box-shadow: 0 2px 6px rgba(45, 32, 20, 0.1);
}

.pao-range-select {
  width: auto;
  border-radius: 8px;
}

.pao-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 18px;
}

.pao-stat {
  background: #fbf8f3;
  border: 1px solid #f0e9dc;
  border-radius: 12px;
  padding: 12px 14px;
  text-align: left;
}

.pao-stat-value {
  font-family: 'Prompt', sans-serif;
  font-weight: 700;
  font-size: 1.25rem;
  color: #2e2a26;
}

.pao-stat-label {
  font-size: 0.76rem;
  color: #8a8178;
  margin-top: 2px;
}

.pao-loading,
.pao-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8a8178;
  padding: 56px 20px;
  font-size: 0.9rem;
}

.pao-loading {
  flex-direction: row;
}

.pao-empty-icon {
  font-size: 1.6rem;
  margin-bottom: 10px;
  color: #d9a441;
}

.pao-leaderboard {
  background: #fbf8f3;
  border: 1px solid #f0e9dc;
  border-radius: 12px;
  padding: 14px 16px;
  height: 100%;
}

.pao-leaderboard-title {
  font-size: 0.82rem;
  font-weight: 600;
  color: #6b6259;
  margin-bottom: 10px;
}

.pao-rank-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
  border-bottom: 1px dashed #f0e9dc;
  font-size: 0.85rem;
}

.pao-rank-item:last-child {
  border-bottom: none;
}

.pao-rank-index {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #f5f1e9;
  color: #8a8178;
  font-size: 0.72rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pao-rank-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #2e2a26;
}

.pao-rank-value {
  color: #6b6259;
  font-weight: 600;
  flex-shrink: 0;
}

@media (max-width: 576px) {
  .pao-panel {
    padding: 18px 16px;
  }

  .pao-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
