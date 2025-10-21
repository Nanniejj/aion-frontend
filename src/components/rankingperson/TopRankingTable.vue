<template>
  <b-card class="shadow-sm">
      <div class="mb-2">
        <h5 class="mb-0">Top User Ranking</h5>
        <small class="text-muted">แสดงอันดับบุคคลตามช่วงเวลาและตัวกรองที่เลือก</small>
      </div>



    <div class="d-flex justify-content-between align-items-center mb-2">
      <div>
        <b-form-input
          v-model="search"
          placeholder="ค้นหาในผลลัพธ์..."
          class="w-100 w-sm-50"
        />
      </div>
      <div>
        <b-button variant="outline-secondary" size="sm" class="mr-2" @click="exportCSV" :disabled="items.length===0">
          Export CSV
        </b-button>
        <b-button variant="outline-secondary" size="sm" @click="fetchData" :disabled="loading">
          รีเฟรช
        </b-button>
      </div>
    </div>
{{ pagedItems }}
    <b-table
      :items="pagedItems"
      :fields="fields"
      :busy="loading"
      responsive
      hover
      :filter="search"
      :per-page="perPage"
      :current-page="currentPage"
      @sort-changed="onSort"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      head-variant="light"
      class="mb-2"
    >
      <template #table-busy>
        <div class="text-center my-3">
          <b-spinner class="mr-2" />
          กำลังโหลดข้อมูล...
        </div>
      </template>

      <template #cell(rank)="data">
        <div class="d-flex align-items-center">
          <span class="mr-2 font-weight-bold">{{ data.index + 1 + ((currentPage-1) * perPage) }}</span>
          <span v-if="data.index + 1 === 1">🥇</span>
          <span v-else-if="data.index + 1 === 2">🥈</span>
          <span v-else-if="data.index + 1 === 3">🥉</span>
        </div>
      </template>

      <template #cell(user)="row">
        <div class="d-flex align-items-center">
          <b-avatar :src="row.item.avatar || defaultAvatar" class="mr-2" />
          <div>
            <div class="font-weight-600">{{ row.item.person_name || '—' }}</div>
            <small class="text-muted">{{ row.item.platform || filters.source || '—' }}</small>
          </div>
        </div>
      </template>

      <template #cell(mentions)="row">
        <b-badge variant="info" pill>{{ formatNumber(row.item.mentions) }}</b-badge>
      </template>

      <template #cell(score)="row">
        <span v-if="row.item.score != null">{{ formatNumber(row.item.score) }}</span>
        <span v-else class="text-muted">—</span>
      </template>

      <template #cell(lastSeen)="row">
        <span v-if="row.item.lastSeen">{{ formatDate(row.item.lastSeen) }}</span>
        <span v-else class="text-muted">—</span>
      </template>

      <template #cell(sample)="row">
        <b-button
          v-if="row.item.url"
          size="sm"
          variant="outline-primary"
          :href="row.item.url"
          target="_blank"
        >เปิดลิงก์</b-button>
        <span v-else class="text-muted">—</span>
      </template>
    </b-table>

    <div class="d-flex justify-content-between align-items-center">
      <small class="text-muted">
        {{ items.length }} รายการ • อัปเดตล่าสุด: <span v-if="updatedAt">{{ formatDate(updatedAt) }}</span><span v-else>—</span>
      </small>
      <b-pagination
        v-model="currentPage"
        :per-page="perPage"
        :total-rows="filteredCount"
        size="sm"
        align="right"
      />
    </div>

    <b-alert show variant="danger" v-if="error" class="mt-3">
      <div class="font-weight-bold">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>
      <div class="small">{{ error }}</div>
      <div class="mt-2">
        <b-button size="sm" variant="light" @click="fetchData">ลองใหม่</b-button>
      </div>
    </b-alert>
  </b-card>
</template>

<script>
// ต้องมี axios และ bootstrap-vue ติดตั้งไว้ในโปรเจกต์
// npm i axios bootstrap-vue
import axios from 'axios'

export default {
  name: 'TopUserRanking',
  props: {
    apiBase: {
      type: String,
      default: 'https://api2.cognizata.com'
    },
    endpoint: {
      type: String,
      default: '/api/v2/facerecognition/getFacePersonTop'
    },
    // ค่าเริ่มต้นตามที่ผู้ใช้ให้มา
    initialFrom: {
      type: String,
     // default: '2025-10-01T00:00:00.000Z'
    },
    initialTo: {
      type: String,
      default: '2025-10-01T23:59:59.999Z'
    },
    initialSource: {
      type: String,
      default: 'facebook'
    },
    initialSentiment: {
      type: [String, Number],
      default: -1
    },
    initialNames: {
      type: Array,
      default: () => ['อนุทิน ชาญวีรกูล','เท้ง ณัฐพงษ์','ธรรมนัส พรหมเผ่า']
    },
    initialLimit: {
      type: Number,
      default: 20
    },
    perPage: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      items: [],
      loading: false,
      error: null,
      updatedAt: null,

      // ฟิลเตอร์ที่ส่งจริง
      filters: {
        from: this.initialFrom,
        to: this.initialTo,
        source: this.initialSource,
        sentiment: this.initialSentiment,
        names: [...this.initialNames],
        limit: this.initialLimit
      },

      // UI model (แยกเพื่อรองรับ datetime-local)
      ui: {
        fromLocal: this.toLocalInput(this.initialFrom),
        toLocal: this.toLocalInput(this.initialTo),
        namesTags: [...this.initialNames]
      },

      search: '',
      currentPage: 1,
      sortBy: 'mentions',
      sortDesc: true,

      // ตาราง
      fields: [
        { key: 'rank', label: '#', sortable: false, class: 'w-1' },
        { key: 'user', label: 'ผู้ใช้', sortable: false },
        { key: 'count', label: 'เมนชัน', sortable: true, class: 'text-right' },
        { key: 'score', label: 'คะแนน', sortable: true, class: 'text-right' },
        { key: 'lastSeen', label: 'ล่าสุด', sortable: true },
        { key: 'sample', label: 'ตัวอย่าง', sortable: false }
      ],

      sourceOptions: [
        { value: 'facebook', text: 'Facebook' },
        { value: 'youtube', text: 'YouTube' },
        { value: 'tiktok', text: 'TikTok' },
        { value: 'x', text: 'X / Twitter' },
        { value: null, text: 'ทั้งหมด' }
      ],
      sentimentOptions: [
        { value: -1, text: 'ลบ' },
        { value: 0, text: 'กลาง' },
        { value: 1, text: 'บวก' },
        { value: null, text: 'ทั้งหมด' }
      ],

      canceler: null,
      defaultAvatar: 'https://ui-avatars.com/api/?background=random&name=?'
    }
  },
  computed: {
    filteredCount () {
      return this.items.length
    },
    pagedItems () {
      // client-side sort เพื่อความลื่น (API อาจยังไม่รองรับ sort)
      const arr = [...this.items]
      if (this.sortBy) {
        arr.sort((a, b) => {
          const av = a[this.sortBy]
          const bv = b[this.sortBy]
          // จัดการ null/undefined
          if (av == null && bv == null) return 0
          if (av == null) return 1
          if (bv == null) return -1
          if (typeof av === 'number' && typeof bv === 'number') {
            return this.sortDesc ? (bv - av) : (av - bv)
          }
          // เปรียบเทียบ string / date
          const as = String(av).toLowerCase()
          const bs = String(bv).toLowerCase()
          if (as < bs) return this.sortDesc ? 1 : -1
          if (as > bs) return this.sortDesc ? -1 : 1
          return 0
        })
      }
      // slice ตามหน้า
      const start = (this.currentPage - 1) * this.perPage
      return arr.slice(start, start + this.perPage)
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    // แปลง ISO -> local input value (YYYY-MM-DDTHH:mm)
    toLocalInput (iso) {
      try {
        if (!iso) return ''
        const d = new Date(iso)
        const pad = n => String(n).padStart(2, '0')
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
      } catch (e) { return '' }
    },
    // local -> ISO (UTC) สำหรับส่ง API
    toISOZ (localStr) {
      if (!localStr) return null
      const d = new Date(localStr)
      return d.toISOString()
    },
    onFilterChange () {
      // sync UI -> filters (เฉพาะวันที่)
      this.filters.from = this.toISOZ(this.ui.fromLocal)
      this.filters.to = this.toISOZ(this.ui.toLocal)
      this.currentPage = 1
    },
    onNamesChange (tags) {
      this.filters.names = (tags || []).filter(Boolean)
      this.currentPage = 1
    },
    onSort (ctx) {
      this.sortBy = ctx.sortBy
      this.sortDesc = ctx.sortDesc
    },
    buildUrl () {
      const url = new URL(this.endpoint, this.apiBase)
      if (this.filters.from) url.searchParams.set('from', this.filters.from)
      if (this.filters.to) url.searchParams.set('to', this.filters.to)
      if (this.filters.source) url.searchParams.set('source', this.filters.source)
      if (this.filters.sentiment != null && this.filters.sentiment !== '') {
        url.searchParams.set('sentiment', String(this.filters.sentiment))
      }
      if (this.filters.names && this.filters.names.length > 0) {
        url.searchParams.set('name', this.filters.names.join(','))
      }
      if (this.filters.limit) url.searchParams.set('limit', String(this.filters.limit))
      return url.toString()
    },
    async fetchData () {
      this.loading = true
      this.error = null
      this.updatedAt = null
      this.currentPage = 1

      // ยกเลิกคำขอเก่าถ้ายังไม่จบ
      if (this.canceler) {
        this.canceler.cancel('Canceled due to new request')
      }
      this.canceler = axios.CancelToken.source()

      try {
        const url = this.buildUrl()
        const { data } = await axios.get(url, {
          cancelToken: this.canceler.token,
          // ใส่ header เพิ่มได้ เช่น Authorization ถ้าจำเป็น
          // headers: { Authorization: `Bearer ${token}` }
        })
        const list = Array.isArray(data) ? data : (data?.data || data?.items || [])
        this.items = list
        this.updatedAt = new Date().toISOString()
      } catch (err) {
        if (!axios.isCancel(err)) {
          this.error = err?.message || 'ไม่สามารถโหลดข้อมูลได้'
          this.items = []
        }
      } finally {
        this.loading = false
      }
    },
    // ปรับรูปทรงข้อมูลให้เป็นมาตรฐานคอมโพเนนต์
   
    exportCSV () {
      if (!this.items.length) return
      const rows = [
        ['rank','name','platform','mentions','score','lastSeen','url'],
        ...this.items.map((it, idx) => [
          idx + 1,
          csvSafe(it.name),
          csvSafe(it.platform || ''),
          it.mentions != null ? it.mentions : '',
          it.score != null ? it.score : '',
          it.lastSeen ? this.formatDate(it.lastSeen) : '',
          csvSafe(it.url || '')
        ])
      ]
      const csv = rows.map(r => r.join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `top-user-ranking_${new Date().toISOString().slice(0,10)}.csv`
      a.click()
      URL.revokeObjectURL(a.href)

      function csvSafe (s) {
        const str = String(s).replace(/"/g, '""')
        return /[",\n]/.test(str) ? `"${str}"` : str
      }
    },
    // utils
    formatNumber (n) {
      if (n == null) return '—'
      return new Intl.NumberFormat().format(n)
    },
    formatDate (iso) {
      const d = new Date(iso)
      if (isNaN(d.getTime())) return '—'
      return d.toLocaleString()
    }
  }
}
</script>

<style scoped>
.font-weight-600 { font-weight: 600; }
.w-1 { width: 1%; }
</style>
