<template>
  <b-card class="shadow-sm">
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

    <!-- ❗️เอา :per-page และ :current-page ออกจาก b-table เพื่อไม่ให้ paginate ฝั่ง client -->
    <b-table
      :items="sortedItems"
  :fields="fields"
  :busy="loading"
  responsive
  hover
  :filter="search"
  @sort-changed="onSort"
  :sort-by.sync="sortBy"
  :sort-desc.sync="sortDesc"
  head-variant="light"
  class="mb-2"
  @row-clicked="onRowClick"
  :tbody-tr-class="rowClass"
    >
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
          <b-avatar
            :src="(row.item.image_paths && (row.item.image_paths[0] || row.item.image_paths[1] || row.item.image_paths[2])) || defaultAvatar"
            class="mr-2"
          />
          <div>
            <div class="font-weight-600">{{ row.item.person_name || '—' }}</div>
          </div>
        </div>
      </template>

      <template #cell(count)="row">
        {{ formatNumber(row.item.count) }}
      </template>
    </b-table>

    <div class="d-flex justify-content-between align-items-center">
      <small class="text-muted">
        {{ totalCount }} รายการทั้งหมด • อัปเดตล่าสุด:
        <span v-if="updatedAt">{{ formatDate(updatedAt) }}</span><span v-else>—</span>
      </small>
      <!-- ใช้ pagination ตัวเดียวกับตัวเลขจาก API -->
      <b-pagination
        v-model="currentPage"
        :per-page="perPage"
        :total-rows="totalCount"
        size="sm"
        align="right"
      />
    </div>
  </b-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TopRanking',
  props: {
    apiBase: { type: String, default: 'https://api2.cognizata.com' },
    endpoint: { type: String, default: '/api/v2/facerecognition/getFacePersonTop' },

    from: { type: String, required: true },
    to: { type: String, required: true },
    source: { type: Array  },
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

      search: '',
      currentPage: 1,          // คุมหน้าแสดงผลฝั่ง server
      sortBy: null,            // ใช้ sort ฝั่ง client เพียงเพื่อแสดงผลในหน้านั้น
      sortDesc: true,

      fields: [
        { key: 'rank', label: '#', sortable: false, class: 'w-1' },
        { key: 'user', label: 'ชื่อบุคคล', sortable: false },
        { key: 'count', label: 'เมนชัน (โพสต์)', sortable: true, class: 'text-right' },
      ],

      canceler: null,
      defaultAvatar: 'https://ui-avatars.com/api/?background=random&name=?'
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
    from:    { handler() { this.fetchData({ resetPage: true }) } },
    to:      { handler() { this.fetchData({ resetPage: true }) } },
    source:  { handler() { this.fetchData({ resetPage: true }) } },
    sentiment: { handler() { this.fetchData({ resetPage: true }) }, deep: true },
    names:     { handler() { this.fetchData({ resetPage: true }) }, deep: true },

    // เมื่อเปลี่ยนหน้า ให้ยิง API พร้อม page ใหม่
    currentPage(newVal, oldVal) {
      if (newVal !== oldVal) this.fetchData({ resetPage: false })
    }
  },
  mounted() {
    this.fetchData({ resetPage: true })
  },
  methods: {
 
    sentimentToQuery(s) {
    if (s == null || s === '') return '1,0,-1'
    if (Array.isArray(s)) return s.join(',')
    // string/number
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

  openPersonInNewTab(item) {
    const name = item?.person_name || ''
    // ส่งช่วงเวลาปัจจุบันที่ตารางใช้ ไปให้หน้าโพสต์
    const from = this.from.slice(0,10)
    const to  = this.to.slice(0,10)
    const source    = this.sourcesToQuery(this.source)
    const sentiment = this.sentimentToQuery(this.sentiment)

    // จัด query ให้ตรงกับหน้าโพสต์
    const query = {
      name,
      from,
      to,
      // ส่งเฉพาะเมื่อมีค่า
      ...(source ? { source } : {}),
      ...(sentiment ? { sentiment } : {}),
      sort: 'desc',
      page: '1'
    }

    // ใช้ vue-router resolve เพื่อสร้าง href ที่ถูกต้อง
    const routeObj = this.$router.resolve({
      path: '/rankingperson/posts',
      query
    })

    // เปิดแท็บใหม่
    window.open(routeObj.href, '_blank')
  },

     rowClass(item, type) {
    // ให้เฉพาะแถวข้อมูลมี cursor pointer
    if (type === 'row' && item) return 'row-clickable';
    return '';
  },

  onRowClick(item, index, evt) {
    // กันคลิกบนปุ่ม/ลิงก์/คอนโทรล ไม่ให้เปิดซ้ำ
    if (evt && evt.target && evt.target.closest('a,button,[role="button],.form-control,.custom-control')) {
      return;
    }
    this.openPersonInNewTab(item);
  },

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

      // ส่งพารามิเตอร์เพจไปเซิร์ฟเวอร์ (ใช้ limit เป็น page size)
      url.searchParams.set('page', String(this.currentPage))
      url.searchParams.set('limit', String(this.perPage))

      // ถ้าแบ็กเอนด์รองรับ sort server-side และอยากให้ตรงกับหัวตาราง:
      // if (this.sortBy) {
      //   url.searchParams.set('sort_by', this.sortBy)
      //   url.searchParams.set('sort_dir', this.sortDesc ? 'desc' : 'asc')
      // }

      return url.toString()
    },

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
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })

        // รองรับโครงสร้างหลายแบบจาก API
        const payload = Array.isArray(data) ? { items: data, total: data.length } : (data || {})
        const rows = payload.data || payload.items || []
        this.items = Array.isArray(rows) ? rows : []
        this.totalCount =
          payload.total_count ??
          payload.total ??
          payload.pagination?.total ??
          this.items.length

        this.updatedAt = new Date().toISOString()
      } catch (err) {
        if (!axios.isCancel(err)) {
          this.error = err?.message || 'ไม่สามารถโหลดข้อมูลได้'
          this.items = []
          this.totalCount = 0
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
          idx + 1 + ((this.currentPage - 1) * this.perPage),
          csvSafe(it.person_name || ''),
          csvSafe(it.platform || ''),
          it.count ?? '',     // แก้จาก it.mentions -> it.count ให้ตรงกับคีย์จริง
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
.font-weight-600 { font-weight: 600; }
.w-1 { width: 1%; }
</style>
