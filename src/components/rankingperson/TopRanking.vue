<template>
  <b-card class="shadow-sm">
    <!-- <div class="d-flex flex-wrap align-items-end justify-content-between mb-3">
      <div class="mb-2">
        <h5 class="mb-0">Top User Ranking</h5>
        <small class="text-muted">แสดงอันดับบุคคลตามช่วงเวลาและตัวกรองที่เลือก</small>
      </div>
      <div class="d-flex flex-wrap align-items-end">
        <b-form-group label="จาก" label-for="from" class="mb-2 mr-2">
          <b-form-input id="from" type="datetime-local" v-model="ui.fromLocal" @change="onFilterChange" />
        </b-form-group>
        <b-form-group label="ถึง" label-for="to" class="mb-2 mr-2">
          <b-form-input id="to" type="datetime-local" v-model="ui.toLocal" @change="onFilterChange" />
        </b-form-group>
        <b-form-group label="แหล่ง" label-for="source" class="mb-2 mr-2">
          <b-form-select id="source" :options="sourceOptions" v-model="filters.source" @change="onFilterChange"/>
        </b-form-group>
        <b-form-group label="อารมณ์" label-for="sentiment" class="mb-2 mr-2">
          <b-form-select id="sentiment" :options="sentimentOptions" v-model="filters.sentiment" @change="onFilterChange"/>
        </b-form-group>
        <b-form-group label="ชื่อที่ต้องการ" label-for="names" class="mb-2 mr-2">
          <b-form-tags
            id="names"
            separator=",;"
            placeholder="พิมพ์ชื่อแล้วกด Enter"
            v-model="ui.namesTags"
            @input="onNamesChange"
          />
        </b-form-group>
        <b-form-group label="จำนวน" label-for="limit" class="mb-2 mr-2">
          <b-form-input id="limit" type="number" min="1" max="100" v-model.number="filters.limit" @change="onFilterChange"/>
        </b-form-group>
        <b-button variant="primary" class="mb-2" @click="fetchData" :disabled="loading">
          โหลดข้อมูล
        </b-button>
      </div>
    </div> -->

    <div class="d-flex justify-content-between align-items-center mb-2">
      <div>
        <b-form-input v-model="search" placeholder="ค้นหาในผลลัพธ์..." class="w-100 w-sm-50" />
      </div>
      <div>
        <b-button variant="outline-secondary" size="sm" class="mr-2" @click="exportCSV" :disabled="items.length === 0">
          Export CSV
        </b-button>
        <b-button variant="outline-secondary" size="sm" @click="fetchData" :disabled="loading">
          รีเฟรช
        </b-button>
      </div>
    </div>

    <b-table :items="pagedItems" :fields="fields" :busy="loading" responsive hover :filter="search" :per-page="perPage"
      :current-page="currentPage" @sort-changed="onSort" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
      head-variant="light" class="mb-2">
      <template #table-busy>
        <div class="text-center my-3">
          <b-spinner class="mr-2" />
          กำลังโหลดข้อมูล...
        </div>
      </template>

      <template #cell(rank)="data">
        <div class="d-flex align-items-center">
          <span class="mr-2 font-weight-bold">{{ data.index + 1 + ((currentPage - 1) * perPage) }}</span>
          <span v-if="data.index + 1 === 1">🥇</span>
          <span v-else-if="data.index + 1 === 2">🥈</span>
          <span v-else-if="data.index + 1 === 3">🥉</span>
        </div>
      </template>
      <template #cell(user)="row">
        <div class="d-flex align-items-center">
          <!-- {{ row.item.image_paths }} -->
          <b-avatar :src="row.item.image_paths[0] || defaultAvatar" class="mr-2" v-if="row.item.image_paths" />
          <div>
            <div class="font-weight-600">{{ row.item.person_name || '—' }}</div>
            <!-- <small class="text-muted">{{ row.item.platform || filters.source || '—' }}</small> -->
          </div>
        </div>
      </template>
      <template #cell(count)="row">
        <!-- <b-badge variant="info" pill></b-badge> -->
          {{ formatNumber(row.item.count) }}
      </template>
    </b-table>

    <div class="d-flex justify-content-between align-items-center">
      <small class="text-muted">
        {{ items.length }} รายการ • อัปเดตล่าสุด: <span v-if="updatedAt">{{ formatDate(updatedAt) }}</span><span
          v-else>—</span>
      </small>
      <b-pagination v-model="currentPage" :per-page="perPage" :total-rows="filteredCount" size="sm" align="right" />
    </div>

    <!-- <b-alert show variant="danger" v-if="error" class="mt-3">
      <div class="font-weight-bold">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>
      <div class="small">{{ error }}</div>
      <div class="mt-2">
        <b-button size="sm" variant="light" @click="fetchData">ลองใหม่</b-button>
      </div>
    </b-alert> -->
  </b-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TopRanking',
  props: {
    apiBase: { type: String, default: 'https://api2.cognizata.com' },
    endpoint: { type: String, default: '/api/v2/facerecognition/getFacePersonTop' },

    // รับตรงจากหน้าแม่ (แทน initial*)
    from: { type: String, required: true },
    to: { type: String, required: true },
    source: { type: [String, null], default: "" },        // ถ้าหน้าแม่มีหลาย platform ให้ส่งตัวแรก/หรือ null
    sentiment: { type: [Number, String, Array, null], default: [1, -1, 0] },
    names: { type: Array, default: () => [] },
    limit: { type: Number, default: 'all' },

    perPage: { type: Number, default: 20 }
  },
  data() {
    return {
      items: [],
      loading: false,
      error: null,
      updatedAt: null,

      // UI
      search: '',
      currentPage: 1,
      sortBy: 'mentions',
      sortDesc: true,

      // ✅ เปลี่ยนคีย์ 'count' -> 'mentions' ให้ตรงกับ slot และข้อมูล
      fields: [
        { key: 'rank', label: '#', sortable: false, class: 'w-1' },
        { key: 'user', label: 'ชื่อบุคคล', sortable: false },
        // { key: 'person_name', label: 'ผู้ใช้', sortable: false },
        { key: 'count', label: 'เมนชัน (โพสต์)', sortable: true, class: 'text-right' },
        // { key: 'score', label: 'คะแนน', sortable: true, class: 'text-right' },
        // { key: 'lastSeen', label: 'ล่าสุด', sortable: true },
        // { key: 'sample', label: 'ตัวอย่าง', sortable: false }
      ],

      canceler: null,
      defaultAvatar: 'https://ui-avatars.com/api/?background=random&name=?'
    }
  },
  computed: {
    filteredCount() { return this.items.length },
    pagedItems() {
      const arr = [...this.items]
      if (this.sortBy) {
        arr.sort((a, b) => {
          const av = a[this.sortBy], bv = b[this.sortBy]
          if (av == null && bv == null) return 0
          if (av == null) return 1
          if (bv == null) return -1
          if (typeof av === 'number' && typeof bv === 'number') return this.sortDesc ? (bv - av) : (av - bv)
          const as = String(av).toLowerCase(), bs = String(bv).toLowerCase()
          if (as < bs) return this.sortDesc ? 1 : -1
          if (as > bs) return this.sortDesc ? -1 : 1
          return 0
        })
      }
      const start = (this.currentPage - 1) * this.perPage
      return arr.slice(start, start + this.perPage)
    }
  },
  watch: {
    from: 'fetchData',
    to: 'fetchData',
    source: 'fetchData',
    sentiment: { handler: 'fetchData', deep: true },
    names: { handler: 'fetchData', deep: true },
    limit: 'fetchData'
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    onSort(ctx) { this.sortBy = ctx.sortBy; this.sortDesc = ctx.sortDesc },
    buildUrl() {
      const url = new URL(this.endpoint, this.apiBase)
      if (this.from) url.searchParams.set('from', this.from)
      if (this.to) url.searchParams.set('to', this.to)
      if (this.source) url.searchParams.set('source', this.source)
      if (this.sentiment != null && this.sentiment !== '') {
        const s = Array.isArray(this.sentiment) ? this.sentiment.join(',') : String(this.sentiment)
        url.searchParams.set('sentiment', s)
      }
      if (this.names && this.names.length > 0) {
        url.searchParams.set('name', this.names.join(','))
      }
      if (this.limit) url.searchParams.set('limit', String(this.limit))
      return url.toString()
    },
    async fetchData() {
      this.loading = true
      this.error = null
      this.updatedAt = null
      this.currentPage = 1

      if (this.canceler) this.canceler.cancel('Canceled due to new request')
      this.canceler = axios.CancelToken.source()

      try {
        const url = this.buildUrl()
        const { data } = await axios.get(url, {
          cancelToken: this.canceler.token,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        const raw = Array.isArray(data) ? data : (data?.data || data?.items || [])
        // ✅ normalize ให้ตารางใช้ field เดียวกัน
        this.items = raw
        this.updatedAt = new Date().toISOString()

        function pickNum(...nums) { for (const n of nums) { const v = Number(n); if (!isNaN(v)) return v } return 0 }
      } catch (err) {
        if (!axios.isCancel(err)) {
          this.error = err?.message || 'ไม่สามารถโหลดข้อมูลได้'
          this.items = []
        }
      } finally {
        this.loading = false
      }
    },
    exportCSV() {
      if (!this.items.length) return
      const rows = [
        ['rank', 'name', 'platform', 'mentions', 'score', 'lastSeen', 'url'],
        ...this.items.map((it, idx) => [
          idx + 1,
          csvSafe(it.person_name || ''),
          csvSafe(it.platform || ''),
          it.mentions ?? '',
          it.score ?? '',
          it.lastSeen ? this.formatDate(it.lastSeen) : '',
          csvSafe(it.url || '')
        ])
      ]
      const csv = rows.map(r => r.join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `top-user-ranking_${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(a.href)

      function csvSafe(s) {
        const str = String(s).replace(/"/g, '""')
        return /[",\n]/.test(str) ? `"${str}"` : str
      }
    },
    formatNumber(n) { return n == null ? '—' : new Intl.NumberFormat().format(n) },
    formatDate(iso) {
      const d = new Date(iso)
      return isNaN(d.getTime()) ? '—' : d.toLocaleString()
    }
  }
}
</script>

<style scoped>
.font-weight-600 {
  font-weight: 600;
}

.w-1 {
  width: 1%;
}
</style>
