<template>
  <b-container fluid class="py-3">
    <!-- Filters -->
    <b-card class="mb-3">
      <b-form @submit.prevent="applyFilters">
        <b-row>
          <b-col md="3">
            <b-form-group label="Source">
              <b-form-select v-model="form.source" :options="sourceOptions" multiple />
            </b-form-group>
          </b-col>

          <b-col md="3">
            <b-form-group label="Bot level">
              <b-form-select v-model="form.bot_level" :options="botLevelOptions" multiple />
            </b-form-group>
          </b-col>

          <b-col md="3">
            <b-form-group label="Account filter (uid / name / link_crawl)">
              <b-input-group>
                <b-form-input v-model.trim="form.account_query" placeholder="e.g. MahaChakriSirindhorn" />
                <b-input-group-append>
                  <b-button @click="form.account_query=''" variant="outline-secondary">Clear</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>

          <b-col md="3">
            <b-form-group label="Limit latest posts">
              <b-form-input type="number" min="1" max="1000" v-model.number="form.limit" />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="3">
            <b-form-group label="Start date (UTC ISO)">
              <b-form-input v-model="form.start_date" placeholder="2025-11-01T00:00:00Z" />
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="End date (UTC ISO)">
              <b-form-input v-model="form.end_date" placeholder="2025-11-06T23:59:59Z" />
            </b-form-group>
          </b-col>
          <b-col md="6" class="d-flex align-items-end">
            <div class="ml-auto">
              <b-button type="submit" variant="primary" class="mr-2" :disabled="loading">
                <b-spinner small v-if="loading" class="mr-1" /> Apply
              </b-button>
              <b-button variant="outline-secondary" @click="resetFilters" :disabled="loading">Reset</b-button>
            </div>
          </b-col>
        </b-row>
      </b-form>
    </b-card>

    <!-- KPI cards -->
    <b-row class="mb-3">
      <b-col md="3">
        <b-card class="text-center">
          <div class="h6 mb-1">Accounts (summary-by-account)</div>
          <div class="display-4">{{ summaryByAccountCount }}</div>
        </b-card>
      </b-col>
      <b-col md="3">
        <b-card class="text-center">
          <div class="h6 mb-1">Levels (summary-by-botlevel)</div>
          <div class="display-4">{{ summaryByLevelCount }}</div>
        </b-card>
      </b-col>
      <b-col md="3">
        <b-card class="text-center">
          <div class="h6 mb-1">Latest posts loaded</div>
          <div class="display-4">{{ latestPosts.length }}</div>
        </b-card>
      </b-col>
      <b-col md="3">
        <b-card class="text-center">
          <div class="h6 mb-1">Avg latency (hrs, latest)</div>
          <div class="display-4">{{ avgLatencyLatest }}</div>
        </b-card>
      </b-col>
    </b-row>

    <!-- Charts -->
    <b-row>
      <b-col md="6" class="mb-3">
        <b-card title="Avg Latency by Account (Top 20)">
          <apexchart type="bar" height="320" :options="chartAccount.options" :series="chartAccount.series"/>
        </b-card>
      </b-col>
      <b-col md="6" class="mb-3">
        <b-card title="Latency & Posts by Bot Level">
          <apexchart type="line" height="320" :options="chartLevel.options" :series="chartLevel.series"/>
        </b-card>
      </b-col>
    </b-row>

    <!-- Latest posts table -->
    <b-card class="mb-3" header="Latest posts (diff = (created_on+7h) - date)">
      <b-table
        :items="latestPosts"
        :fields="postFields"
        sticky-header="60vh"
        small
        responsive
        show-empty
      >
        <template #cell(account)="row">
          <div class="d-flex flex-column">
            <div class="font-weight-bold">{{ row.item.account.name || '-' }}</div>
            <div class="text-muted small">{{ row.item.account.uid || '' }}</div>
            <b-link v-if="row.item.account.link_crawl" :href="row.item.account.link_crawl" target="_blank">
              {{ row.item.account.link_crawl }}
            </b-link>
            <div class="small text-muted mt-1">Level: {{ row.item.account.bot_level == null ? 'N/A' : row.item.account.bot_level }}</div>
          </div>
        </template>

        <template #cell(post)="row">
          <div class="d-flex flex-column">
            <b-link :href="row.item.url_post" target="_blank">{{ row.item.title || '(no title)' }}</b-link>
            <div class="text-truncate small" style="max-width: 520px;">{{ row.item.full_text }}</div>
            <div v-if="row.item.photos && row.item.photos.length" class="small text-muted">
              📷 {{ row.item.photos.length }} photo(s)
            </div>
          </div>
        </template>

        <template #cell(meta)="row">
          <div class="small">
            <div>source: <b>{{ row.item.source }}</b></div>
            <div>date: <code>{{ fmtDate(row.item.date) }}</code></div>
            <div>created_on: <code>{{ fmtDate(row.item.created_on) }}</code></div>
            <div>(+7h): <code>{{ fmtDate(row.item.created_on_plus7) }}</code></div>
          </div>
        </template>

        <template #cell(latency)="row">
          <div class="h5 mb-1">
            {{ safeFixed(row.item.latencyHours, 3) }} h
          </div>
          <b-badge :variant="latencyBadge(row.item.latencyHours)">
            {{ latencyLabel(row.item.latencyHours) }}
          </b-badge>
        </template>

        <template #cell(engage)="row">
          <div class="small">
            👍 {{ asNum(row.item.likes_count) }}
            · 💬 {{ asNum(row.item.comments_count) }}
            · 🔁 {{ asNum(row.item.shares_count) }}
            <div v-if="row.item.engagement">Total: {{ asNum(row.item.engagement) }}</div>
          </div>
        </template>
      </b-table>
    </b-card>
  </b-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import VueApexCharts from 'vue-apexcharts'

export default {
  name: 'BotLatencyDashboard',
  components: {
    apexchart: VueApexCharts
  },
  data () {
    return {
      loading: false,
      form: {
        start_date: '',
        end_date: '',
        source: [],          // multiple
        bot_level: [],       // multiple (number)
        account_query: '',   // uid OR name OR link_crawl
        limit: 3000
      },
      latestPosts: [],
      summaryByAccount: [],
      summaryByLevel: [],
      sourceOptions: [
        { value: 'facebook', text: 'facebook' },
        { value: 'twitter', text: 'twitter' },
        { value: 'instagram', text: 'instagram' },
        { value: 'tiktok', text: 'tiktok' },
        { value: 'youtube', text: 'youtube' }
      ],
      botLevelOptions: [
        { value: 1, text: 'Level 1' },
        { value: 2, text: 'Level 2' },
        { value: 3, text: 'Level 3' }
      ],
      postFields: [
        { key: 'account', label: 'Account', thClass: 'w-25' },
        { key: 'post', label: 'Post', thClass: 'w-35' },
        { key: 'meta', label: 'Timestamp', thClass: 'w-25' },
        { key: 'latency', label: 'Diff (hours)', thClass: 'w-10' },
        { key: 'engage', label: 'Engagement', thClass: 'w-10' }
      ]
    }
  },
  computed: {
    summaryByAccountCount () {
      return this.summaryByAccount.length
    },
    summaryByLevelCount () {
      return this.summaryByLevel.length
    },
    avgLatencyLatest () {
      if (!this.latestPosts.length) return 0
      const s = this.latestPosts.reduce((acc, x) => acc + (x.latencyHours || 0), 0)
      return Number((s / this.latestPosts.length).toFixed(2))
    },

    // ----- Chart: by account -----
    chartAccount () {
      const sorted = [...this.summaryByAccount]
        .sort((a, b) => (Number(b.avgLatency) || 0) - (Number(a.avgLatency) || 0))
        .slice(0, 20)

      const cats  = sorted.map(x => (x.name || x.uid || x.link_crawl || '').slice(0, 30))
      const avg   = sorted.map(x =>
        (typeof x.avgLatency === 'number' && !isNaN(x.avgLatency))
          ? Number(x.avgLatency.toFixed(2))
          : 0
      )
      const posts = sorted.map(x => x.posts || 0)

      return {
        options: {
          chart: { toolbar: { show: false } },
          xaxis: { categories: cats, labels: { rotate: -25 } },
          yaxis: [
            { title: { text: 'Avg latency (hrs)' } },
            { opposite: true, title: { text: 'Posts' } }
          ],
          tooltip: { shared: true },
          stroke: { width: [0, 3] },
          dataLabels: { enabled: false },
          legend: { position: 'top' }
        },
        series: [
          { name: 'Avg latency (hrs)', type: 'column', data: avg },
          { name: 'Posts', type: 'line', data: posts }
        ]
      }
    },

    // ----- Chart: by level -----
    chartLevel () {
      const levels = this.summaryByLevel.map(x => (x._id == null ? 'N/A' : `L${x._id}`))
      const avg = this.summaryByLevel.map(x =>
        (typeof x.avgLatency === 'number' && !isNaN(x.avgLatency)) ? Number(x.avgLatency.toFixed(2)) : 0
      )
      const min = this.summaryByLevel.map(x =>
        (typeof x.minLatency === 'number' && !isNaN(x.minLatency)) ? Number(x.minLatency.toFixed(2)) : 0
      )
      const max = this.summaryByLevel.map(x =>
        (typeof x.maxLatency === 'number' && !isNaN(x.maxLatency)) ? Number(x.maxLatency.toFixed(2)) : 0
      )
      const posts = this.summaryByLevel.map(x => x.posts || 0)

      return {
        options: {
          chart: { toolbar: { show: false } },
          xaxis: { categories: levels },
          yaxis: [
            { title: { text: 'Latency (hrs)' } },
            { opposite: true, title: { text: 'Posts' } }
          ],
          tooltip: { shared: true },
          stroke: { width: [0, 2, 2, 3] }, // avg, min, max, posts
          dataLabels: { enabled: false },
          legend: { position: 'top' }
        },
        series: [
          { name: 'Avg latency', type: 'column', data: avg },
          { name: 'Min latency', type: 'line', data: min },
          { name: 'Max latency', type: 'line', data: max },
          { name: 'Posts', type: 'line', data: posts, yAxisIndex: 1 }
        ]
      }
    }
  },
  methods: {
    apiBase () {
      // ปรับตามจริง เช่น VUE_APP_API_BASE ใน .env
      return process.env.VUE_APP_API_BASE || 'http://localhost:3000/api'
    },
    buildQuery () {
      // map ฟิลด์ไปพารามิเตอร์ให้ตรงกับ buildLatencyMatch ของ backend
      const q = {}
      if (this.form.start_date) q.start_date = this.form.start_date
      if (this.form.end_date) q.end_date = this.form.end_date
      if (this.form.source.length) q.source = this.form.source.join(',')
      if (this.form.bot_level.length) q.bot_level = this.form.bot_level.join(',')
      if (this.form.account_query) {
        // backend รองรับ name/uid/link_crawl ใน buildLatencyMatch
        q.account = this.form.account_query
        q.link_crawl = this.form.account_query
        q.name = this.form.account_query
        q.uid = this.form.account_query
      }
      return q
    },
    async fetchSummaryByAccount () {
      const url = `${this.apiBase()}/bot-latency/summary-by-account`
      const params = { ...this.buildQuery(), limit: 200 }
      const { data } = await axios.get(url, { params })
      this.summaryByAccount = data.data || []
    },
    async fetchSummaryByLevel () {
      const url = `${this.apiBase()}/bot-latency/summary-by-botlevel`
      const params = { ...this.buildQuery() }
      const { data } = await axios.get(url, { params })
      this.summaryByLevel = data.data || []
    },
    async fetchLatest () {
      const url = `${this.apiBase()}/bot-latency/latest`
      const params = { ...this.buildQuery(), limit: this.form.limit }
      const { data } = await axios.get(url, { params })
      this.latestPosts = data.latest || []
    },
    async applyFilters () {
      try {
        this.loading = true
        await Promise.all([
        //   this.fetchSummaryByAccount(),
        //   this.fetchSummaryByLevel(),
          this.fetchLatest()
        ])
      } finally {
        this.loading = false
      }
    },
    resetFilters () {
      this.form = {
        start_date: '',
        end_date: '',
        source: [],
        bot_level: [],
        account_query: '',
        limit: 50
      }
      this.applyFilters()
    },
    fmtDate (d) {
      if (!d) return '-'
      return moment(d).utc().format('YYYY-MM-DD HH:mm:ss [UTC]')
    },
    latencyBadge (h) {
      if (h == null) return 'secondary'
      if (h <= 2) return 'success'
      if (h <= 6) return 'warning'
      return 'danger'
    },
    latencyLabel (h) {
      if (h == null) return 'N/A'
      if (h <= 2) return 'fast'
      if (h <= 6) return 'normal'
      return 'slow'
    },
    safeFixed (v, n = 2) {
      const num = Number(v)
      return isNaN(num) ? '0.00' : num.toFixed(n)
    },
    asNum (v) {
      // เผื่อเป็น { $numberLong: "123" } หรือ number
      if (v && typeof v === 'object' && v.$numberLong) return Number(v.$numberLong)
      return Number(v || 0)
    }
  },
  mounted () {
    this.applyFilters()
  }
}
</script>

<style scoped>
.table td, .table th { vertical-align: top; }
</style>
