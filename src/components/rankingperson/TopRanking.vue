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
          <!-- <b-button variant="outline-secondary" size="sm" @click="fetchData" :disabled="loading">รีเฟรช</b-button> -->
        </div>
      </b-col>
    </b-row>

    <!-- ✅ paginate ฝั่ง client -->
    <b-table :items="sortedItems" :fields="fields" :busy="loading" responsive hover :filter="search" stacked="md"
      @sort-changed="onSort" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" head-variant="light"
      class="mb-2 tb-person" @row-clicked="onRowClick" :tbody-tr-class="rowClass" :per-page="perPage"
      :current-page="currentPage" @filtered="onFiltered">
      <template #table-busy>
        <div class="text-center my-3">
          กำลังโหลดข้อมูล...
        </div>
      </template>

      <template #cell(number)="data">
        <div class="d-flex align-items-center">
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
          @click="openPersonInNewTab(row.item)"></span>
      </template>
    </b-table>

    <div class="d-flex justify-content-between align-items-center">
      <small class="text-muted">
        {{ items.length }} รายการทั้งหมด • อัปเดตล่าสุด:
        <span v-if="updatedAt">{{ formatDate(updatedAt) }}</span><span v-else>—</span>
      </small>

      <!-- ✅ ใช้ pagination client-side -->
      <b-pagination v-model="currentPage" :per-page="perPage" :total-rows="totalRows" size="sm" align="right" />
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
    full_text: { type: Boolean, default: false },
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

      // UI
      search: '',
      currentPage: 1,      // ใช้กับ client-side pagination
      sortBy: null,
      sortDesc: true,

      fields: [
        { key: 'number', label: 'อันดับ', sortable: false, class: 'w-1' },
        { key: 'user', label: 'ชื่อบุคคล', sortable: false },
        { key: 'count', label: 'ถูกกล่าวถึง (โพสต์)', class: 'text-right' }, // ไม่เปิด sortable โดย table
        { key: 'action', label: '' }
      ],

      // avatar
      defaultAvatar: 'https://ui-avatars.com/api/?background=random&name=?',

      // Export
      exporting: false,

      // สถานะและตัวช่วย client-side pagination + filter
      totalRows: 0,        // จำนวนรายการหลังกรอง (อัปเดตโดย @filtered)
    }
  },
  computed: {
    // จัดเรียง "ทั้งก้อน" ที่โหลดมาแล้ว (ไม่เรียงเฉพาะหน้า)
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
    from: { handler() { this.fetchData() } },
    to: { handler() { this.fetchData() } },
    source: { handler() { this.fetchData() } },
    sentiment: { handler() { this.fetchData() }, deep: true },
    names: { handler() { this.fetchData() }, deep: true },
    // full_text() { this.fetchData() },
    
    // เปลี่ยนการ sort ฝั่ง client → ไม่ต้องโหลดใหม่
    sortBy() { /* no-op */ },
    sortDesc() { /* no-op */ }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // ---------- helpers ----------
    sentimentToQuery(s) {
      if (s == null || s === '') return '1,0,-1'
      if (Array.isArray(s)) return s.join(',')
      return String(s).split(',').map(x => x.trim()).filter(Boolean).join(',')
    },

    sourcesToQuery(src) {
      if (!src || (Array.isArray(src) && src.length === 0)) return undefined
      if (Array.isArray(src)) return src.join(',')
      return String(src)
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
        ...(this.full_text ? { full_text: 'true' } : {}),
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

    onFiltered(filteredItems) {
      // อัปเดตจำนวนแถวที่ใช้กับ pagination (หลังกรอง)
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    // ---------- URL builders ----------
    buildBaseUrl() {
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
      if (this.full_text === true) {
        url.searchParams.set('full_text', 'true')
      }


      return url
    },

    // ---------- data fetch (โหลดครั้งเดียวให้หมด) ----------
    async fetchData() {
      this.loading = true
      this.error = null
      this.updatedAt = null
      this.currentPage = 1

      try {
        // 1) ยิงรอบแรกเพื่อรู้ total_count (และได้ข้อมูลชุดหนึ่งมาด้วย)
        const url1 = this.buildBaseUrl()
        // จะไม่พึ่ง pagination server อีกแล้ว เลยตั้ง limit พอสมควร
        url1.searchParams.set('page', '1')
        url1.searchParams.set('limit', '1000')

        const { data: d1 } = await axios.get(url1.toString(), {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })

        const payload1 = Array.isArray(d1) ? { items: d1, total: d1.length } : (d1 || {})
        const rows1 = payload1.data || payload1.items || []
        const totalCount =
          payload1.total_count ??
          payload1.total ??
          payload1.pagination?.total ??
          rows1.length

        // 2) ยิงรอบสอง “ครั้งเดียว” ดึงทั้งหมด (ถ้า totalCount เกินรอบแรก)
        let fullRows = rows1
        if (totalCount > rows1.length) {
          const urlAll = this.buildBaseUrl()
          urlAll.searchParams.set('page', '1')
          urlAll.searchParams.set('limit', String(totalCount))
          // ถ้าอยากให้สอดคล้องกับลำดับ sort บนตารางตอนแรก ให้ส่ง sort_by/dir ได้
          if (this.sortBy) {
            urlAll.searchParams.set('sort_by', this.sortBy)
            urlAll.searchParams.set('sort_dir', this.sortDesc ? 'desc' : 'asc')
          }

          const { data: dAll } = await axios.get(urlAll.toString(), {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })

          const payloadAll = Array.isArray(dAll) ? { items: dAll, total: dAll.length } : (dAll || {})
          fullRows = payloadAll.data || payloadAll.items || []
        }

        this.items = Array.isArray(fullRows) ? fullRows : []
        this.totalRows = this.items.length      // ค่าเริ่มต้นก่อนกรอง
        this.updatedAt = new Date().toISOString()
      } catch (err) {
        this.error = err?.message || 'ไม่สามารถโหลดข้อมูลได้'
        this.items = []
        this.totalRows = 0
      } finally {
        this.loading = false
      }
    },

    // ---------- export ----------
    async exportAllCSV() {
      if (this.exporting || !this.items.length) return
      this.exporting = true
      try {
        const header = ['อันดับ', 'ชื่อ', 'ถูกกล่าวถึง (โพสต์)']
        const csvRows = [
          header,
          ...this.items.map(it => [
            it.number,
            csvSafe(it.person_name || ''),
            it.count ?? 0
          ])
        ]
        const csv = csvRows.map(r => r.join(',')).join('\n')

        // ✅ BOM สำหรับ Excel UTF-8
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
