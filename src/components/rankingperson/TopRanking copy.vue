<template>
  <b-card class="shadow-sm">
    <b-row class="mb-2">
      <b-col cols="">
        <v-select ref="peopleSelect" :options="peopleOptions" label="text" :reduce="p => p.text" multiple
          v-model="selectedPeople" :placeholder="peopleLoading ? 'กำลังดึงรายชื่อ...' : 'เลือกบุคคล...'" class="sl-pp"
          :disabled="peopleLoading && peopleOptions.length === 0"
          @input="onPeoplePicked">
          <template #option="option">
            <div class="my-1 d-flex align-items-center">
              <b-avatar :src="option.photo" size="36px" class="mr-2"></b-avatar>
              <span>{{ option.text }}</span>
            </div>
          </template>
          <template #selected-option="option">
            <div class="d-flex align-items-center">
              <b-avatar :src="option.photo" size="20px" class="mr-1"></b-avatar>
              <span>{{ option.text }}</span>
            </div>
          </template>
          <template #list-footer>
            <div class="p-2 text-center" v-if="peopleOptions.length">
              <b-button size="sm" variant="outline-secondary" :disabled="peopleLoading || !peopleHasMore"
                @click.stop="loadMorePeople">
                <b-spinner small v-if="peopleLoading" class="mr-2" />
                {{ peopleHasMore ? 'โหลดเพิ่ม' : 'หมดแล้ว' }}
              </b-button>
            </div>
          </template>
          <template #no-options>
            <div class="px-3 py-2 text-muted">
              <span v-if="peopleLoading">กำลังดึงรายชื่อ...</span>
              <span v-else>ไม่พบรายการ</span>
            </div>
          </template>
        </v-select>
      </b-col>
      <b-col class="text-right" cols="auto">
        <b-button variant="outline-info" size="sm" class="ml-sm-2  mt-sm-0" @click="exportAllCSV"
          :disabled="items.length === 0 || exporting">
          <b-spinner small v-if="exporting" class="mr-2" />
           <i class="fa fa-download mr-1"></i> Export
        </b-button>
      </b-col>
    </b-row>


    <!-- ตาราง: server-side (ไม่ใช้ :filter) -->
    <b-table :items="items" :fields="fields" :busy="loading" responsive hover @sort-changed="onSort"
      :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" head-variant="light" class="mb-2" @row-clicked="onRowClick"
      :tbody-tr-class="rowClass">
      <template #table-busy>
        <div class="text-center my-3">
          <!-- <b-spinner class="mr-2" /> -->
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
            class="mr-2" />
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
      <b-pagination v-model="currentPage" :per-page="perPage" :total-rows="totalCount" size="sm" align="right" />
    </div>
  </b-card>
</template>

<script>
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

export default {
  name: 'TopRanking',
  components: { vSelect },
  props: {
    apiBase: { type: String, default: 'https://api2.cognizata.com' },
    endpoint: { type: String, default: '/api/v2/facerecognition/getFacePersonTop' },

    from: { type: String, required: true },
    to: { type: String, required: true },
    source: { type: Array },
    sentiment: { type: [Number, String, Array, null], default: () => [1, -1, 0] },

    // ถ้าพ่ออยากส่งรายชื่อบังคับมาก็ยังรองรับ แต่จะถูก override ด้วย selectedPeople เมื่อมีค่า
    names: { type: Array, default: () => [] },

    perPage: { type: Number, default: 20 }
  },
  data() {
    return {
      // ตาราง (server-side)
      items: [],
      loading: false,
      error: null,
      updatedAt: null,
      totalCount: 0,

      currentPage: 1,
      sortBy: null, // ใช้เพื่อขอเรียงจาก server (ผ่าน query) และ/หรือแสดงผล client
      sortDesc: true,

      fields: [
        { key: 'rank', label: '#', sortable: false, class: 'w-1' },
        { key: 'user', label: 'ชื่อบุคคล', sortable: false },
        { key: 'count', label: 'ถูกกล่าวถึง (โพสต์)', sortable: true, class: 'text-right' },
      ],

      canceler: null,
      defaultAvatar: 'https://ui-avatars.com/api/?background=random&name=?',

      // Export
      exporting: false,
      exportAllItems: [],
      exportPrepared: false,
      exportCanceler: null,
      lastQueryKey: '',

      // People options (remote, paging) — เพื่อให้ค้นหา/เลือกคนได้ครบ
      peopleEndpoint: 'https://api2.cognizata.com/api/v2/facerecognition/getFacePerson',
      peopleOptions: [],
      peopleLoading: false,
      peopleError: null,
      peoplePage: 1,
      peopleLimit: 'all',
      peopleHasMore: true,
      peopleQuery: '',
      peopleSearchParam: 'q', // เปลี่ยนได้ตาม API
      debounceTimer: null,

      // รายชื่อที่ “เลือกไว้” -> จะถูกส่งเป็น ?name=a,b,c ให้ API ของตาราง
      selectedPeople: []
    }
  },
  watch: {
    from: { handler() { this.fetchData({ resetPage: true }) } },
    to: { handler() { this.fetchData({ resetPage: true }) } },
    source: { handler() { this.fetchData({ resetPage: true }) } },
    sentiment: { handler() { this.fetchData({ resetPage: true }) }, deep: true },

    // เปลี่ยนหน้า → ยิง API ใหม่
    currentPage(newVal, oldVal) {
      if (newVal !== oldVal) this.fetchData({ resetPage: false })
    },

    // sort เปลี่ยน → prefetch export ใหม่
    sortBy() { this.prefetchExportAll() },
    sortDesc() { this.prefetchExportAll() }
  },
  mounted() {
    this.fetchData({ resetPage: true })
    this.resetAndFetchPeople('') // preload คนหน้าแรก
  },
  methods: {
    // ========== เมื่อเลือกคนให้โหลด “ตาราง” ใหม่ ==========
    onPeoplePicked() {
      this.fetchData({ resetPage: true })
    },

    // ========== Remote people options ==========
    onPeopleOpen() {
      if (!this.peopleOptions.length) this.resetAndFetchPeople(this.peopleQuery)
    },
    onPeopleSearch(searchText) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        this.resetAndFetchPeople(searchText || '')
      }, 300)
    },
    async resetAndFetchPeople(q = '') {
      this.peopleQuery = q
      this.peoplePage = 1
      this.peopleHasMore = true
      this.peopleOptions = []
      await this.fetchPeoplePage()
    },
    async loadMorePeople() {
      if (this.peopleLoading || !this.peopleHasMore) return
      this.peoplePage += 1
      await this.fetchPeoplePage()
      this.$nextTick(() => {
        this.$refs.peopleSelect && this.$refs.peopleSelect.toggleDropdown(true)
      })
    },
    async fetchPeoplePage() {
      this.peopleLoading = true
      this.peopleError = null
      try {
        const params = { limit: this.peopleLimit, page: this.peoplePage }
        if (this.peopleQuery && this.peopleSearchParam) params[this.peopleSearchParam] = this.peopleQuery
        const { data } = await axios.get(this.peopleEndpoint, {
          params,
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        const payload = Array.isArray(data) ? { data, total: data.length } : (data || {})
        const rows = payload.data || payload.items || []
        const mapped = (Array.isArray(rows) ? rows : []).map(p => ({
          value: p._id || p.id,
          text: p.name || p.fullname || `${p.firstName || ''} ${p.lastName || ''}`.trim(),
          photo: p.image_paths?.[0] || p.image_paths?.[1] || null
        }))
        this.peopleOptions = [...this.peopleOptions, ...mapped]
        this.peopleHasMore = mapped.length >= this.peopleLimit
      } catch (e) {
        this.peopleError = e?.response?.data?.message || e.message || 'ไม่สามารถโหลดรายชื่อบุคคลได้'
        this.peopleHasMore = false
      } finally {
        this.peopleLoading = false
      }
    },

    // ========== Helpers ==========
    sentimentToQuery(s) {
      if (s == null || s === '') return '1,0,-1'
      if (Array.isArray(s)) return s.join(',')
      return String(s).split(',').map(x => x.trim()).filter(Boolean).join(',')
    },
    sourcesToQuery(src) {
      if (!src || (Array.isArray(src) && src.length === 0)) return undefined
      return Array.isArray(src) ? src.join(',') : String(src)
    },
    makeQueryKey() {
      return JSON.stringify({
        endpoint: this.endpoint,
        from: this.from,
        to: this.to,
        source: this.sourcesToQuery(this.source),
        sentiment: this.sentimentToQuery(this.sentiment),
        // ใช้ selectedPeople เป็นหลัก
        names: (this.selectedPeople.length ? this.selectedPeople : (this.names || [])).slice().sort(),
        sort_by: this.sortBy || null,
        sort_dir: this.sortBy ? (this.sortDesc ? 'desc' : 'asc') : null
      })
    },

    openPersonInNewTab(item) {
      const name = item?.person_name || ''
      const from = this.from.slice(0, 10)
      const to = this.to.slice(0, 10)
      const source = this.sourcesToQuery(this.source)
      const sentiment = this.sentimentToQuery(this.sentiment)
      const query = { name, from, to, ...(source ? { source } : {}), ...(sentiment ? { sentiment } : {}), sort: 'desc', page: '1' }
      const routeObj = this.$router.resolve({ path: '/personranking/posts', query })
      window.open(routeObj.href, '_blank')
    },

    rowClass(item, type) { return (type === 'row' && item) ? 'row-clickable' : '' },
    onRowClick(item, index, evt) {
      if (evt && evt.target && evt.target.closest('a,button,[role="button],.form-control,.custom-control')) return
      this.openPersonInNewTab(item)
    },
    onSort(ctx) { this.sortBy = ctx.sortBy; this.sortDesc = ctx.sortDesc },

    // ========== URLs ==========
    buildUrl() {
      const url = new URL(this.endpoint, this.apiBase)
      if (this.from) url.searchParams.set('from', this.from)
      if (this.to) url.searchParams.set('to', this.to)
      const source = this.sourcesToQuery(this.source)
      if (source) url.searchParams.set('source', source)

      // ใช้ selectedPeople เป็นหลัก ถ้าไม่มีค่อย fallback names prop
      const effectiveNames = this.selectedPeople.length ? this.selectedPeople : (this.names || [])
      if (effectiveNames.length > 0) {
        url.searchParams.set('name', effectiveNames.join(','))
      }

      if (this.sentiment != null && this.sentiment !== '') {
        const s = Array.isArray(this.sentiment) ? this.sentiment.join(',') : String(this.sentiment)
        url.searchParams.set('sentiment', s)
      }

      // คุมหน้าและจำนวนต่อหน้า
      url.searchParams.set('page', String(this.currentPage))
      url.searchParams.set('limit', String(this.perPage))

      // ถ้าต้องการให้ server sort ให้ส่งด้วย
      if (this.sortBy) {
        url.searchParams.set('sort_by', this.sortBy)
        url.searchParams.set('sort_dir', this.sortDesc ? 'desc' : 'asc')
      }
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

    // ========== Data fetch (ตาราง) ==========
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
        if (this.totalCount <= this.items.length) {
          this.exportAllItems = this.items.slice()
          this.exportPrepared = true
          this.lastQueryKey = this.makeQueryKey()
          return
        }
        const key = this.makeQueryKey()
        if (this.exportPrepared && this.lastQueryKey === key && this.exportAllItems.length === this.totalCount) return

        if (this.exportCanceler) this.exportCanceler.cancel('Canceled export prefetch due to new request')
        this.exportCanceler = axios.CancelToken.source()

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
        this.exportPrepared = false
      }
    },

    // ========== Export ==========
    async exportAllCSV() {
      if (this.exporting) return
      this.exporting = true
      try {
        const key = this.makeQueryKey()
        if (!(this.exportPrepared && this.lastQueryKey === key && this.exportAllItems.length === this.totalCount)) {
          await this.fetchData({ resetPage: false })
          await this.prefetchExportAll()
        }
        const list = (this.exportPrepared && this.lastQueryKey === key) ? this.exportAllItems : this.items
        if (!list.length) return
        const header = ['อันดับ', 'ชื่อ', 'ถูกกล่าวถึง (โพสต์)']
        const csvRows = [
          header,
          ...list.map((it, idx) => [idx + 1, csvSafe(it.person_name || ''), it.count ?? ''])
        ]
        const csv = csvRows.map(r => r.join(',')).join('\n')
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

    // ========== Utils ==========
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

.row-clickable {
  cursor: pointer;
}

.shadow-sm {
  border-radius: 20px;
}

.sl-pp .vs__selected-options {
  overflow: auto;
  max-height: 64px;
}

button:disabled {
  opacity: .6;
  cursor: not-allowed;
}

@media only screen and (min-width: 0) and (max-width:1100px) {
  .form-group {
    margin-bottom: 0px;
  }
}
</style>
