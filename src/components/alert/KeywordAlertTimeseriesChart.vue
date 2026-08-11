<template>
  <div class="kat-wrap">
    <div class="kat-head">
      <div class="text-left">
        <h5 class="kat-title mb-0 text-left">
          <b-icon icon="graph-up" class="mr-1" />
          กราฟติดตาม{{ keywordName ? `: ${keywordName}` : '' }}
        </h5>
        <p class="kat-sub mb-0">ปริมาณโพสต์และ Engagement ตามเวลา พร้อมจุดที่เคยแจ้งเตือน</p>
      </div>

      <div class="kat-controls">
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

        <b-form-select
          v-model="rangeDays"
          :options="rangeOptions"
          size="sm"
          class="kat-range-select"
        />
      </div>
    </div>

    <b-alert v-if="error" show variant="danger" class="mt-3 mb-0">{{ error }}</b-alert>

    <div v-else-if="loading" class="kat-loading">
      <b-spinner small class="mr-2" />กำลังโหลดข้อมูล...
    </div>

    <div v-else-if="!hasData" class="kat-empty">
      <b-icon icon="bar-chart-line" class="kat-empty-icon" />
      <p class="mb-0">ยังไม่มีข้อมูลสถิติในช่วงเวลาที่เลือก</p>
    </div>

    <apexchart
      v-else
      ref="chart"
      type="line"
      height="360"
      :options="chartOptions"
      :series="series"
    />

    <div v-if="spikes.length" class="kat-spike-list">
      <div class="kat-spike-title">
        <b-icon icon="bell-fill" class="mr-1" />
        แจ้งเตือนในช่วงนี้ ({{ spikes.length }})
      </div>

      <div class="kat-spike-item" v-for="spike in spikes" :key="spike._id">
        <span class="kat-spike-date">{{ formatDateTime(spike.detected_at) }}</span>
        <span class="kat-spike-vol">{{ formatNumber(spike.current_volume) }} โพสต์</span>
        <b-badge :variant="spikeStatusVariant(spike.status)" class="kat-spike-badge">
          {{ spikeStatusLabel(spike.status) }}
        </b-badge>
      </div>
    </div>
  </div>
</template>

<script>
const KEYWORD_BAG_BASE = 'https://api2.cognizata.com/api/v2/alert'

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
  name: 'KeywordAlertTimeseriesChart',

  props: {
    keywordId: {
      type: String,
      required: true,
    },
    keywordName: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      loading: false,
      error: '',
      bucket: 'day',
      rangeDays: 7,
      timeseries: [],
      spikes: [],

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
      return this.timeseries.length > 0
    },

    series() {
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

    spikeAnnotations() {
      return this.spikes.map((spike) => ({
        x: new Date(spike.detected_at).getTime(),
        borderColor: '#e2574c',
        label: {
          borderColor: '#e2574c',
          style: { color: '#fff', background: '#e2574c', fontSize: '10px' },
          text: 'แจ้งเตือน',
          orientation: 'horizontal',
        },
      }))
    },

    chartOptions() {
      const isHour = this.bucket === 'hour'

      return {
        colors: ['#24A19C', '#FF4E88'],
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
        yaxis: [
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
        annotations: {
          xaxis: this.spikeAnnotations,
        },
        noData: { text: 'ไม่พบข้อมูล' },
      }
    },
  },

  watch: {
    keywordId: {
      immediate: true,
      handler() {
        this.fetchData()
      },
    },
    bucket() {
      this.fetchData()
    },
    rangeDays() {
      this.fetchData()
    },
  },

  methods: {
    async fetchData() {
      if (!this.keywordId) return

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
          `${KEYWORD_BAG_BASE}/getKeywordAlertTimeseries`,
          {
            headers,
            params: {
              keyword_id: this.keywordId,
              bucket: this.bucket,
              start_date: startDate.toISOString(),
              end_date: endDate.toISOString(),
            },
          }
        )

        this.timeseries = data?.data?.timeseries || []
        this.spikes = data?.data?.spikes || []
      } catch (error) {
        console.error('KeywordAlertTimeseriesChart fetchData error:', error)
        this.error = error?.response?.data?.message || 'ไม่สามารถโหลดข้อมูลกราฟได้'
        this.timeseries = []
        this.spikes = []
      } finally {
        this.loading = false
      }
    },

    formatNumber(n) {
      return Number(n || 0).toLocaleString('th-TH')
    },

    formatDateTime(value) {
      return toThaiDateTime(value, {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    },

    spikeStatusLabel(status) {
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

    spikeStatusVariant(status) {
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
.kat-wrap {
  padding: 4px 2px;
}

.kat-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.kat-title {
  font-family: 'Prompt', sans-serif;
  font-weight: 600;
  font-size: 1.05rem;
  color: #2e2a26;
}

.kat-sub {
  font-size: 0.82rem;
  color: #8a8178;
  margin-top: 2px;
}

.kat-controls {
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

.kat-range-select {
  width: auto;
  border-radius: 8px;
}

.kat-loading,
.kat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8a8178;
  padding: 56px 20px;
  font-size: 0.9rem;
}

.kat-loading {
  flex-direction: row;
}

.kat-empty-icon {
  font-size: 1.6rem;
  margin-bottom: 10px;
  color: #d9a441;
}

.kat-spike-list {
  margin-top: 18px;
  border-top: 1px solid #f0e9dc;
  padding-top: 14px;
  max-height: 180px;
  overflow-y: auto;
}

.kat-spike-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b6259;
  margin-bottom: 8px;
}

.kat-spike-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.82rem;
  padding: 6px 0;
  border-bottom: 1px dashed #f2ede3;
}

.kat-spike-item:last-child {
  border-bottom: none;
}

.kat-spike-date {
  color: #6b6259;
  flex: 1;
}

.kat-spike-vol {
  color: #8a8178;
}

.kat-spike-badge {
  font-weight: 500;
}
</style>
