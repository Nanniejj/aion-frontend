<template>
  <div>
    <b-row>
      <b-col cols="">
        <div class="py-2">
          <b-form-input v-model="search" size="sm" placeholder="ค้นหาในผลลัพธ์..." class="w-100 w-sm-50 " />
        </div>
      </b-col>
      <b-col cols="auto">
        <div class="py-2">
          <b-button variant="outline-info" size="sm" class="mr-2" @click="exportAllCSV"
            :disabled="items.length === 0 || exporting">
            <b-spinner small v-if="exporting" class="mr-2" />
            Export
          </b-button>
          <!-- <b-button variant="outline-secondary" size="sm" @click="fetchData" :disabled="loading">
          รีเฟรช
        </b-button> -->
        </div>
      </b-col>
    </b-row>


    <!-- ❗️ไม่ paginate ฝั่ง client -->
    <b-table :items="sortedItems" :fields="fields" :busy="loading" responsive hover :filter="search" stacked="md"
      @sort-changed="onSort" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" head-variant="light"
      class="mb-2 tb-person" @row-clicked="onRowClick" :tbody-tr-class="rowClass">
      <template #table-busy>
        <div class="text-center my-3">
          <!-- <b-spinner class="mr-2" /> -->
          กำลังโหลดข้อมูล...
        </div>
      </template>

      <template #cell(number)="data">
        <div class="d-flex align-items-center">
          <!-- <span class="mr-2 font-weight-bold">{{ data.index + 1 + ((currentPage - 1) * perPage) }}</span> -->
          <span class="mr-2 font-weight-bold">{{ data.item.number }} </span>
          <span v-if="data.item.number === 1">🥇</span>
          <span v-else-if="data.item.number === 2">🥈</span>
          <span v-else-if="data.item.number === 3">🥉</span>
        </div>
      </template>

      <template #cell(user)="row">
        <div class="d-flex align-items-center">
          <b-avatar
            :src="(row.item.image_paths && (row.item.image_paths[0] || row.item.image_paths[1] || row.item.image_paths[2])) || defaultAvatar"
            class="mr-2" />
          <div>
            <div class="text-name">{{ row.item.person_name || '—' }}</div>
          </div>
        </div>
      </template>

      <template #cell(count)="row">
        {{ formatNumber(row.item.count) }}
      </template>
      <template #cell(action)="row">
        <span class="fas fa-list-ul text-info" v-b-tooltip.hover title="ดูรายละเอียด" size="sm"
          @click="openPersonInNewTab(row.item)"> </span> </template>
    </b-table>

    <div class="d-flex justify-content-between align-items-center">
      <small class="text-muted">
        {{ totalCount }} รายการทั้งหมด • อัปเดตล่าสุด:
        <span v-if="updatedAt">{{ formatDate(updatedAt) }}</span><span v-else>—</span>
      </small>
      <!-- ใช้ pagination ตัวเดียวกับตัวเลขจาก API -->
      <b-pagination v-model="currentPage" :per-page="perPage" :total-rows="totalCount" size="sm" align="right" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import 'vue-select/dist/vue-select.css'
export default {
  name: 'TopRanking',
  props: {
    apiBase: { type: String, default: 'https://api2.cognizata.com' },
    endpoint: { type: String, default: '/api/v2/facerecognition/getFacePersonTop' },

    from: { type: String, required: true },
    to: { type: String, required: true },
    source: { type: Array },
    sentiment: { type: [Number, String, Array, null], default: () => [1, -1, 0] },
    names: { type: Array, default: () => [] },

    // page size (ต่อหน้า)
    perPage: { type: Number, default: 20 }
  },
  data() {
    return {
      items: [],
      loading: false,
      error: null,
      updatedAt: null,
      totalCount: 0,

      // UI
      search: '',
      currentPage: 1,   // คุมหน้าแสดงผลฝั่ง server
      sortBy: null,     // ใช้ sort ฝั่ง client เพียงเพื่อแสดงผลในหน้านั้น
      sortDesc: true,

      fields: [
        { key: 'number', label: 'อันดับ', sortable: false, class: 'w-1' },
        { key: 'user', label: 'ชื่อบุคคล', sortable: false },
        { key: 'count', label: 'ถูกกล่าวถึง (โพสต์)', class: 'text-right' },//sortable: true,
        { key: 'action', label: '' }
      ],

      // cancelers
      canceler: null,

      // avatar
      defaultAvatar: 'https://ui-avatars.com/api/?background=random&name=?',

      // Export states (cache)
      exporting: false,
      exportAllItems: [],
      exportPrepared: false,
      exportCanceler: null,
      lastQueryKey: ''
    }
  },
  computed: {
    // เรียงเฉพาะข้อมูลในหน้าที่ server ส่งมา (ไม่ตัดหน้า)
    sortedItems() {
      if (!this.sortBy) return this.items
      const arr = [...this.items]
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
      return arr
    }
  },
  watch: {
    from: { handler() { this.fetchData({ resetPage: true }) } },
    to: { handler() { this.fetchData({ resetPage: true }) } },
    source: { handler() { this.fetchData({ resetPage: true }) } },
    sentiment: { handler() { this.fetchData({ resetPage: true }) }, deep: true },
    names: { handler() { this.fetchData({ resetPage: true }) }, deep: true },

    // เมื่อเปลี่ยนหน้า ให้ยิง API พร้อม page ใหม่
    currentPage(newVal, oldVal) {
      if (newVal !== oldVal) this.fetchData({ resetPage: false })
    },

    // เมื่อ sort ในตารางเปลี่ยน (client-side) → ให้ prefetch ใหม่เพื่อให้ export ตรงลำดับ
    sortBy() { this.prefetchExportAll() },
    sortDesc() { this.prefetchExportAll() }
  },
  mounted() {
    this.fetchData({ resetPage: true })
  },
  methods: {
    // ---------- helpers ----------
    sentimentToQuery(s) {
      if (s == null || s === '') return '1,0,-1'
      if (Array.isArray(s)) return s.join(',')
      return String(s)
        .split(',')
        .map(x => x.trim())
        .filter(Boolean)
        .join(',')
    },

    sourcesToQuery(src) {
      if (!src || (Array.isArray(src) && src.length === 0)) return undefined
      if (Array.isArray(src)) return src.join(',')     // 'twitter,facebook'
      return String(src)
    },

    // query key สำหรับ cache export (ผูกกับเงื่อนไข/ตัวกรอง + sort)
    makeQueryKey() {
      return JSON.stringify({
        endpoint: this.endpoint,
        from: this.from,
        to: this.to,
        source: this.sourcesToQuery(this.source),
        sentiment: this.sentimentToQuery(this.sentiment),
        names: (this.names || []).slice().sort(),
        sort_by: this.sortBy || null,
        sort_dir: this.sortBy ? (this.sortDesc ? 'desc' : 'asc') : null
      })
    },

    // ---------- routing / ui ----------
    openPersonInNewTab(item) {
      const name = item?.person_name || ''
      const from = this.from.slice(0, 10)
      const to = this.to.slice(0, 10)
      const source = this.sourcesToQuery(this.source)
      const sentiment = this.sentimentToQuery(this.sentiment)

      const query = {
        name, from, to,
        ...(source ? { source } : {}),
        ...(sentiment ? { sentiment } : {}),
        sort: 'desc',
        page: '1'
      }

      const routeObj = this.$router.resolve({ path: '/personranking/posts', query })
      window.open(routeObj.href, '_blank')
    },

    rowClass(item, type) {
      if (type === 'row' && item) return 'row-clickable'
      return ''
    },

    onRowClick(item, index, evt) {
      if (evt && evt.target && evt.target.closest('a,button,[role="button],.form-control,.custom-control')) return
      this.openPersonInNewTab(item)
    },

    onSort(ctx) { this.sortBy = ctx.sortBy; this.sortDesc = ctx.sortDesc },

    // ---------- URL builders ----------
    buildUrl() {
      const url = new URL(this.endpoint, this.apiBase)
      if (this.from) url.searchParams.set('from', this.from)
      if (this.to) url.searchParams.set('to', this.to)

      const source = this.sourcesToQuery(this.source)
      if (source) url.searchParams.set('source', source)

      if (this.sentiment != null && this.sentiment !== '') {
        const s = Array.isArray(this.sentiment) ? this.sentiment.join(',') : String(this.sentiment)
        url.searchParams.set('sentiment', s)
      }
      if (this.names && this.names.length > 0) {
        url.searchParams.set('name', this.names.join(','))
      }

      url.searchParams.set('page', String(this.currentPage))
      url.searchParams.set('limit', String(this.perPage))
      return url.toString()
    },

    buildUrlWith(overrides = {}) {
      const base = new URL(this.buildUrl())
      if (overrides.page != null) base.searchParams.set('page', String(overrides.page))
      if (overrides.limit != null) base.searchParams.set('limit', String(overrides.limit))
      if (overrides.sort_by) base.searchParams.set('sort_by', overrides.sort_by)
      if (overrides.sort_dir) base.searchParams.set('sort_dir', overrides.sort_dir)
      return base.toString()
    },

    // ---------- data fetch ----------
    async fetchData({ resetPage = false } = {}) {
      if (resetPage) this.currentPage = 1
      this.loading = true
      this.error = null
      this.updatedAt = null

      if (this.canceler) this.canceler.cancel('Canceled due to new request')
      this.canceler = axios.CancelToken.source()

      try {
        const url = this.buildUrl()
        const { data } = await axios.get(url, {
          cancelToken: this.canceler.token,
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })

        const payload = Array.isArray(data) ? { items: data, total: data.length } : (data || {})
        const rows = payload.data || payload.items || []
        this.items = Array.isArray(rows) ? rows : []
        this.totalCount =
          payload.total_count ??
          payload.total ??
          payload.pagination?.total ??
          this.items.length

        this.updatedAt = new Date().toISOString()

        // ⬇️ เตรียมข้อมูล export ล่วงหน้า (ไม่บล็อก UI)
        this.prefetchExportAll()
      } catch (err) {
        if (!axios.isCancel(err)) {
          this.error = err?.message || 'ไม่สามารถโหลดข้อมูลได้'
          this.items = []
          this.totalCount = 0
          this.exportPrepared = false
          this.exportAllItems = []
        }
      } finally {
        this.loading = false
      }
    },

    async prefetchExportAll() {
      try {
        // ถ้าจำนวนในหน้าปัจจุบันเท่ากับทั้งหมดอยู่แล้ว ใช้ชุดนี้ได้เลย
        if (this.totalCount <= this.items.length) {
          this.exportAllItems = this.items.slice()
          this.exportPrepared = true
          this.lastQueryKey = this.makeQueryKey()
          return
        }

        const key = this.makeQueryKey()
        if (this.exportPrepared && this.lastQueryKey === key && this.exportAllItems.length === this.totalCount) {
          // มี cache ตรงเงื่อนไขแล้ว
          return
        }

        // ยกเลิกงาน prefetch เดิมถ้ามี
        if (this.exportCanceler) this.exportCanceler.cancel('Canceled export prefetch due to new request')
        this.exportCanceler = axios.CancelToken.source()

        // ดึงทั้งหมดด้วย limit = totalCount, page = 1 (พร้อม sort ถ้าต้องการให้ตรงกับตาราง)
        const urlAll = this.buildUrlWith({
          page: 1,
          limit: this.totalCount,
          ...(this.sortBy ? { sort_by: this.sortBy, sort_dir: this.sortDesc ? 'desc' : 'asc' } : {})
        })

        const { data } = await axios.get(urlAll, {
          cancelToken: this.exportCanceler.token,
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })

        const payload = Array.isArray(data) ? { items: data, total: data.length } : (data || {})
        const rows = payload.data || payload.items || []
        this.exportAllItems = Array.isArray(rows) ? rows : []
        this.exportPrepared = this.exportAllItems.length > 0
        this.lastQueryKey = key
      } catch (e) {
        // เงียบไว้ ไม่รบกวน UI; ปุ่ม export จะ fallback ไปใช้หน้า current ได้
        this.exportPrepared = false
      }
    },

    // ---------- export ----------
    async exportAllCSV() {
      if (this.exporting) return
      this.exporting = true
      try {
        const key = this.makeQueryKey()
        // ถ้า cache ไม่พร้อม/ไม่ตรงเงื่อนไข ให้พยายามเตรียมตอนนี้
        if (!(this.exportPrepared && this.lastQueryKey === key && this.exportAllItems.length === this.totalCount)) {
          await this.fetchData({ resetPage: false })
          await this.prefetchExportAll()
        }

        const list = (this.exportPrepared && this.lastQueryKey === key) ? this.exportAllItems : this.items
        if (!list.length) return

        const header = ['อันดับ', 'ชื่อ', 'ถูกกล่าวถึง (โพสต์)']
        const csvRows = [
          header,
          ...list.map((it, idx) => [
            it.number,
            csvSafe(it.person_name || ''),
            it.count ?? 0
          ])
        ]

        const csv = csvRows.map(r => r.join(',')).join('\n')

        // ✅ ใส่ BOM เพื่อให้ Excel รู้ว่าไฟล์นี้เป็น UTF-8
        const BOM = '\uFEFF'
        const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `top-user-ranking_full_${new Date().toISOString().slice(0, 10)}.csv`
        a.click()
        URL.revokeObjectURL(a.href)

        function csvSafe(s) {
          const str = String(s).replace(/"/g, '""')
          return /[",\n]/.test(str) ? `"${str}"` : str
        }
      } finally {
        this.exporting = false
      }
    },

    // ---------- utils ----------
    formatNumber(n) { return n == null ? '—' : new Intl.NumberFormat().format(n) },
    formatDate(iso) {
      const d = new Date(iso)
      return isNaN(d.getTime()) ? '—' : d.toLocaleString()
    }
  }
}
</script>

<style scoped>
.tb-person {
  font-size: 15px !important;
}

.font-weight-600 {
  font-weight: 600;
}

.w-1 {
  width: 1%;
}
</style>
