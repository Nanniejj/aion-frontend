<template>
  <div class="container my-3">

    <div class="text-center mb-3 mt-md-5">
      <h4 class="mb-0 ">
        <b-img src="@/assets/searchimg.png" style="width: 40px;"></b-img>
        Image Search
      </h4>
    </div>
    <div class="mt-2 text-left h6">
      <span class="bold" @click="$router.push('/imagesearch')" style="cursor: pointer;">Image Search </span> >
      <span>Posts</span>
    </div>
    <div ref="printArea">
        <div>
        <b-row class="mx-0 mb-3">
            <b-col v-if="dataImg && dataImg.image && dataImg.image.url" cols="12" lg="auto" class="">
            <b-avatar button :src="dataImg.image.url" size="20" class="iconimg my-3 justify-content-start w-auto" rounded="lg"
                @click="onClick(0, dataImg.image.url)" />
            <vue-gallery-slideshow :images="dataPhoto" :index="index" @close="index = null"></vue-gallery-slideshow>
            </b-col>
            <b-col v-if="datachart && datachart.totals" class="py-3 px-0" cols="12" lg="">
                <b-row>
                    <b-col cols="12" lg="">
                        <b-col cols="12" sm="12" lg="">
                            <b-row cols="2" cols-sm="4" cols-md="4" class="small py-2">
                                <b-col>
                                    <div><i class="far fa-comments "></i>
                                    <span class="h6 bold"> {{
                                        datachart.totals.message_sum || 0 | numFormat }}</span>
                                    </div> messages
                                </b-col>
                                <b-col>
                                    <div><i class="far fa-paper-plane "></i>
                                    <span class="h6 bold"> {{
                                        datachart.totals.posts || 0 | numFormat }}</span>
                                    </div> posts
                                </b-col>
                                <b-col>
                                    <div> <i class="far fa-comment " aria-hidden="true"></i>
                                    <span class="h6 bold"> {{
                                        (datachart.totals.message_sum - datachart.totals.posts) || 0 | numFormat }}</span>
                                    </div>
                                    comments
                                </b-col>
                                <b-col>
                                    <div> <i class="fas fa-chart-line "></i>
                                    <span class="h6 bold"> {{
                                        datachart.totals.engagement_sum || 0 | numFormat }}</span>
                                    </div> engages
                                </b-col>
                            </b-row>
                            <SentimentBar :positive="datachart.totals.positiveSentiment || 0"
                            :neutral="datachart.totals.neutralSentiment || 0" :negative="datachart.totals.negativeSentiment || 0"
                            class="py-3 stm-sm mb-3" />
                        </b-col>

                        <b-row cols="6" cols-md="9"  class="mx-0">
                            <!-- Facebook -->
                            <b-col>
                                <b-row>
                                <b-col cols="12">
                                    <div class="text-center">
                                    <div class="h3">
                                        <img src="@/assets/cfb.png" class="img-issue" />
                                    </div>
                                    <div class="small">
                                        {{ datachart.totals.facebook | numFormat }}
                                    </div>
                                    <div class="small-sub p-0">({{ pct(datachart.totals.facebook) }})</div>
                                    </div>
                                </b-col>
                                </b-row>
                            </b-col>
        
                            <!-- Twitter -->
                            <b-col>
                                <b-row>
                                <b-col cols="12">
                                    <div class="text-center">
                                    <div class="h3">
                                        <img src="@/assets/ctw.png" class="img-issue" />
                                    </div>
                                    <div class="small">
                                        {{ datachart.totals.twitter | numFormat }}
                                    </div>
                                    <div class="small-sub p-0">({{ pct(datachart.totals.twitter) }})</div>
                                    </div>
                                </b-col>
                                </b-row>
                            </b-col>
        
                            <!-- Instagram -->
                            <b-col>
                                <b-row>
                                <b-col cols="12">
                                    <div class="text-center">
                                    <div class="h3">
                                        <img src="@/assets/cig.png" class="img-issue" />
                                    </div>
                                    <div class="small">
                                        {{ datachart.totals.instagram | numFormat }}
                                    </div>
                                    <div class="small-sub p-0">({{ pct(datachart.totals.instagram) }})</div>
                                    </div>
                                </b-col>
                                </b-row>
                            </b-col>
        
                            <!-- Pantip -->
                            <b-col>
                                <b-row>
                                <b-col cols="12">
                                    <div class="text-center">
                                    <div class="h3">
                                        <img src="@/assets/cpt.png" class="img-issue" />
                                    </div>
                                    <div class="small">
                                        {{ datachart.totals.pantip | numFormat }}
                                    </div>
                                    <div class="small-sub p-0">({{ pct(datachart.totals.pantip) }})</div>
                                    </div>
                                </b-col>
                                </b-row>
                            </b-col>
        
                            <!-- YouTube -->
                            <b-col>
                                <b-row>
                                <b-col cols="12">
                                    <div class="text-center">
                                    <div class="h3">
                                        <img src="@/assets/cyt.png" class="img-issue" />
                                    </div>
                                    <div class="small">
                                        {{ datachart.totals.youtube | numFormat }}
                                    </div>
                                    <div class="small-sub p-0">({{ pct(datachart.totals.youtube) }})</div>
                                    </div>
                                </b-col>
                                </b-row>
                            </b-col>
        
                            <!-- News -->
                            <b-col>
                                <b-row>
                                <b-col cols="12">
                                    <div class="text-center">
                                    <div class="h3">
                                        <img src="@/assets/cn.png" class="img-issue" />
                                    </div>
                                    <div class="small">
                                        {{ datachart.totals.news | numFormat }}
                                    </div>
                                    <div class="small-sub p-0">({{ pct(datachart.totals.news) }})</div>
                                    </div>
                                </b-col>
                                </b-row>
                            </b-col>
        
                            <!-- TikTok -->
                            <b-col>
                                <b-row>
                                <b-col cols="12">
                                    <div class="text-center">
                                    <div class="h3">
                                        <img src="@/assets/tt.png" class="img-issue" />
                                    </div>
                                    <div class="small">
                                        {{ datachart.totals.tiktok | numFormat }}
                                    </div>
                                    <div class="small-sub p-0">({{ pct(datachart.totals.tiktok) }})</div>
                                    </div>
                                </b-col>
                                </b-row>
                            </b-col>
        
                            <!-- Blockdit -->
                            <b-col>
                                <b-row>
                                <b-col cols="12">
                                    <div class="text-center">
                                    <div class="h3">
                                        <img src="@/assets/Block.png" class="img-issue" />
                                    </div>
                                    <div class="small">
                                        {{ datachart.totals.blockdit | numFormat }}
                                    </div>
                                    <div class="small-sub p-0">({{ pct(datachart.totals.blockdit) }})</div>
                                    </div>
                                </b-col>
                                </b-row>
                            </b-col>
        
                            <!-- Threads -->
                            <b-col>
                                <b-row>
                                <b-col cols="12">
                                    <div class="text-center">
                                    <div class="h3">
                                        <img src="@/assets/ctd.png" class="img-issue" />
                                    </div>
                                    <div class="small">
                                        {{ datachart.totals.threads | numFormat }}
                                    </div>
                                    <div class="small-sub p-0">({{ pct(datachart.totals.threads) }})</div>
                                    </div>
                                </b-col>
                                </b-row>
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col v-if="dataImg && dataImg.source_counts" cols="12" lg="auto">
                        <PlatformImgChart :platform="dataImg.source_counts" class="ma-auto " />
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        </div>

        <!-- Header -->
        <b-card class="mb-3 shadow-sm card-photo sd-g d-none">
        <div>
            <div class="d-flex align-items-center" v-if="dataImg">
            <div class="flex-grow-1 text-left" v-if="dataImg.image">
                <small class="text-muted mx-2">Date {{ formatDate(dataImg.image.created_at) }} | {{ formatTime(
                dataImg.image.created_at) }}</small>
            </div>
            <div class="text-right mr-3">
                <div class="mb-1">
                <div class="flex-grow-2 text-center mr-2">
                    <div class="font-weight-bold h6 mb-0 mt-2">
                    {{ count | numFormat }} <small class="text-muted">Posts</small>
                    <b-badge :variant="statusVariant(dataImg.image.status)" pill class="py-2 px-3 text-uppercase mx-2"
                        v-if="dataImg.image && dataImg.image.status">
                        {{ dataImg.image.status }}
                    </b-badge>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </b-card>

        <apexchart ref="chart" type="line" height="350" :options="chartOptions" :series="series" />

        <!-- Top bar + Export -->
        <div class="d-flex align-items-center justify-content-between">
        <div class="text-left">
            All ({{ count | numFormat }})
        </div>
        <div class="d-flex align-items-center">
            <b-button size="sm" variant="outline-info" @click="printPosts" v-b-tooltip.hover title="Print">
            <b-icon-printer /> Print
            </b-button>
            <ExportExcelButton :posts="postForExport" :filters="filters"
            :disabled="loading || (Array.isArray(postForExport) && postForExport.length === 0)" :full-export="true"
            :prefer-single-shot="true"  inline-comments="json" :comments-limit="20" v-if="!loading" />
        </div>
        </div>

        <hr />

        <!-- Controls -->
        <div>
          <b-row class="my-1 mb-2 align-items-center">
            <!-- sentiment -->
            <b-col sm="12" md="auto">
              <b-form-radio-group v-model="selected" :options="options" name="radio-inline"
                class="mt-1 mb-2 text-left ml-2 rdo" @change="resetAndFetch" />
            </b-col>

            <!-- source -->
            <b-col cols="6" md="">
              <b-form-select :options="itemSocial" v-model="select_social" @change="resetAndFetch" id="search-input"
                size="sm" class="mb-2 select-sort" placeholder="Select Platform" />
            </b-col>

            <!-- sort -->
            <b-col cols="6" md="" class="text-right">
              <b-form-select v-model="sort" :options="optionSort" size="sm" class="mb-2 select-sort"
                @change="resetAndFetch" />
            </b-col>

            <!-- ── Match % filter ── -->
            <b-col cols="12" md="auto">
              <div class="d-flex align-items-center mb-2" style="gap: 6px;">
                <small class="text-muted text-nowrap">Match %</small>
                <b-form-input
                  v-model.number="matchMin"
                  type="number" min="0" max="100"
                  size="sm" style="width: 68px;"
                  @change="clampMatchMin"
                  @keyup.enter="resetAndFetch"
                />
                <small class="text-muted">–</small>
                <b-form-input
                  v-model.number="matchMax"
                  type="number" min="0" max="100"
                  size="sm" style="width: 68px;"
                  @change="clampMatchMax"
                  @keyup.enter="resetAndFetch"
                />
                <small class="text-muted">%</small>
                <b-button size="sm" variant="outline-secondary" @click="resetAndFetch" style="white-space: nowrap;">
                  <b-icon-search /> ค้นหา
                </b-button>
              </div>
            </b-col>
          </b-row>
        </div>

        <div class="text-center my-4 py-4" v-if="loading">
        <vue-element-loading :active="loading" size="80" background-color="rgba(255, 255, 255, 0.5)" color="#17a2b891" />
        </div>

        <!-- Posts -->
        <div>
        <b-alert v-if="!loading && posts.length === 0" show variant="light" class="text-center">
            ไม่มีโพสต์
        </b-alert>
        <timeline-posts v-else :items="posts" mode="posts" 
            sort="recent" :count="count" />
            <div v-if="totalPages > 1" class="text-center my-2 pb-5">
                <div v-if="page === totalPages" class="text-center mb-3 py-5">
                <vue-element-loading :active="loading" size="80" background-color="rgba(255, 255, 255, 0.5)"
                    color="#17a2b891" />
                </div>
                <b-button v-else variant="outline-info" @click="onPageChange(page + 1)" pill>
                <span> <i class="fa fa-plus" aria-hidden="true"></i> More</span>
                </b-button>
            </div>
        <div class="text-center my-4 py-4" v-if="loading">
            <vue-element-loading :active="loading" size="80" background-color="rgba(255, 255, 255, 0.5)"
            color="#17a2b891" />
        </div>
        </div>
    </div>
  </div>
</template>

<script>
import CardPost from './CardPost.vue'
import CardTitle from './CardTitle.vue'
import VueGallerySlideshow from "vue-gallery-slideshow";
import PlatformImgChart from "./PlatformImgChart";
import moment from "moment";
import "moment/locale/th";
import TimelinePosts from '../timeline/TimelinePosts2.vue';
import ExportExcelButton from "@/components/timeline/ExportExcelButton.vue";
import StaticTimeline from '@/components/timeline/StaticTimeline.vue'
import SentimentBar from "@/components/domain/SentimentBar.vue";

export default {
  name: 'PostBoard',
  components: { CardPost, CardTitle, VueGallerySlideshow, PlatformImgChart, TimelinePosts, ExportExcelButton, StaticTimeline, SentimentBar },
  props: {
    subject: {
      type: Object,
      default: () => ({
        title: 'Subject 11',
        avatar: 'https://placekitten.com/120/120',
        date: '17.09.25',
        time: '11:00',
        status: 'Succeed',
        quantity: 10
      })
    },
    imageId: {
      type: String,
      default: '68d4e5e7f605d5ac5823df48'
    }
  },
  data() {
    return {
      dataImg: null,
      index: null,
      dataPhoto: [],
      // filters
      selected: "1, 0, -1",
      select_social: '',
      sort: 'asc',

      // ── match percent filter ──
      matchMin: 0,
      matchMax: 100,

      // pagination state
      page: 1,
      limit: 20,
      totalPages: 0,
      count: 0,

      loading: false,

      itemSocial: [
        { text: 'All Platform', value: '' },
        { text: 'facebook', value: 'facebook' },
        { text: 'X', value: 'twitter' },
        { text: 'board', value: 'pantip' },
        { text: 'youtube', value: 'youtube' },
        { text: 'instagram', value: 'instagram' },
        { text: 'blockdit', value: 'blockdit' },
        { text: 'tiktok', value: 'tiktok' },
        { text: 'threads', value: 'threads' }
      ],
      options: [
        { text: 'Positive', value: '1' },
        { text: 'Neutral', value: '0' },
        { text: 'Negative', value: '-1' },
        { text: 'ทั้งหมด', value: "1, 0, -1" }
      ],
      optionSort: [
        { value: 'desc', text: ' โพสต์ล่าสุด' },
        { value: 'asc', text: 'โพสต์เริ่มต้น' },
        { value: 'engagement', text: 'Engagement' }
      ],
      pageSizeOptions: [
        { value: 10, text: '10 / หน้า' },
        { value: 20, text: '20 / หน้า' },
        { value: 50, text: '50 / หน้า' },
        { value: 100, text: '100 / หน้า' }
      ],

      activeTab: 0,
      platforms: ['Facebook', 'X', 'Instagram', 'Pantip', 'Youtube', 'News', 'Tiktok', 'Blockdit', 'Threads'],

      posts: [],
      postForExport: [],
      lastPayload: null,
      datachart: null,
      series: [],
      filters: {},
      chartOptions: {
        colors: ['#ff962e', '#17a2b8', '#e75aa1'],
        chart: {
          type: 'line',
          fontFamily: 'Prompt, FontAwesome, sans-serif',
          toolbar: {
            show: true,
            tools: { download: true, selection: true, zoom: true, pan: true, reset: true }
          }
        },
        stroke: { curve: 'smooth', width: 3 },
        markers: { size: 5 },
        legend: { position: 'top' },
        xaxis: {
          type: 'datetime',
          labels: {
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
          { seriesName: 'Posts', title: { text: 'Posts' }, min: 0, labels: { formatter: v => Math.round(v).toLocaleString() || 0 } },
          { seriesName: 'Messages', title: { text: 'Messages' }, min: 0, labels: { formatter: v => Math.round(v).toLocaleString() || 0 } },
          { seriesName: 'Engagement', title: { text: 'Engagement' }, min: 0, opposite: true, labels: { formatter: v => Math.round(v).toLocaleString() || 0 } }
        ],
        noData: { text: 'กำลังโหลดข้อมูล...' }
      }
    }
  },
  computed: {
    activePlatform() {
      return this.activeTab === 0 ? 'All' : this.platforms[this.activeTab - 1]
    }
  },
  methods: {
    /* ── match percent clamp ── */
    clampMatchMin() {
      if (this.matchMin < 0) this.matchMin = 0
      if (this.matchMin > this.matchMax) this.matchMin = this.matchMax
      this.resetAndFetch()
    },
    clampMatchMax() {
      if (this.matchMax > 100) this.matchMax = 100
      if (this.matchMax < this.matchMin) this.matchMax = this.matchMin
      this.resetAndFetch()
    },

    /* ── helpers ── */
    matchParams() {
      return {
        image_match_min: (this.matchMin / 100).toFixed(2),
        image_match_max: (this.matchMax / 100).toFixed(2)
      }
    },

    printPosts() {
      const STYLE_ID = 'print-style-min-margin'
      if (!document.getElementById(STYLE_ID)) {
        const style = document.createElement('style')
        style.id = STYLE_ID
        style.media = 'print'
        style.textContent = `
          @page { size: auto; margin: 0; }
          @media print { html, body { margin: 0 !important; padding: 0 !important; } }
        `
        document.head.appendChild(style)
      }
      this.$nextTick(() => { try { window.print() } catch (e) { console.error(e) } })
    },

    formatDate(date) {
      let dates = moment(date).subtract(7, "hours")
      return moment(dates).format("ll")
    },
    formatTime(date) {
      return date.slice(11, 16)
    },
    onClick(i, url) {
      this.dataPhoto = [url]
      this.index = i
    },
    isAllZero(rows) {
      return rows.length > 0 && rows.every(r =>
        Number(r.post_count || 0) === 0 &&
        Number(r.engagement_sum || 0) === 0 &&
        Number(r.message_sum || 0) === 0
      )
    },
    setNoDataText(text) {
      const patch = { noData: { text } }
      if (this.$refs.chart?.updateOptions) {
        this.$refs.chart.updateOptions(patch, false, true)
      } else if (this.$refs.chart?.chart?.updateOptions) {
        this.$refs.chart.chart.updateOptions(patch, false, true)
      } else {
        this.chartOptions = { ...this.chartOptions, ...patch }
      }
    },
    parseOffsetToMs(tzStr) {
      const m = /^([+-])(\d{2}):?(\d{2})$/.exec(String(tzStr).trim())
      if (!m) return 0
      const sign = m[1] === '+' ? 1 : -1
      return sign * ((parseInt(m[2], 10) || 0) * 60 + (parseInt(m[3], 10) || 0)) * 60 * 1000
    },
    applyData(payload) {
      this.lastPayload = payload
      const tz = (payload?.range?.timezone) || '+07:00'
      const rows = Array.isArray(payload?.seriesHourly) ? payload.seriesHourly : []
      if (!rows.length || this.isAllZero(rows)) {
        this.series = []
        this.setNoDataText('ไม่พบข้อมูล')
        return
      }
      this.setNoDataText('')
      const offsetMs = this.parseOffsetToMs(tz)
      const keyOf = (d, t) => `${d} ${t.padStart(5, '0')}`
      const dataMap = new Map()
      rows.forEach(r => {
        dataMap.set(keyOf(r.date, r.time), {
          post: Number(r.post_count || 0),
          engagement: Number(r.engagement_sum || 0),
          msg: Number(r.message_sum || 0)
        })
      })
      const toUtcMs = (d, t) => Date.parse(`${d}T${t}:00${tz}`)
      const localMsFromUtc = (utc) => utc + offsetMs
      let minLocal = Infinity, maxLocal = -Infinity
      rows.forEach(r => {
        const local = localMsFromUtc(toUtcMs(r.date, r.time))
        if (local < minLocal) minLocal = local
        if (local > maxLocal) maxLocal = local
      })
      const HOUR = 3600000
      const gridStartLocal = Math.floor(minLocal / HOUR) * HOUR
      const gridEndLocal = Math.floor(maxLocal / HOUR) * HOUR
      const posts = [], engagements = [], messages = []
      for (let lt = gridStartLocal; lt <= gridEndLocal; lt += HOUR) {
        const iso = new Date(lt).toISOString()
        const val = dataMap.get(keyOf(iso.slice(0, 10), iso.slice(11, 16)))
        if (!val || (val.post === 0 && val.msg === 0 && val.engagement === 0)) continue
        const tsUTC = lt - offsetMs
        posts.push([tsUTC, val.post])
        messages.push([tsUTC, val.msg])
        engagements.push([tsUTC, val.engagement])
      }
      const series = []
      if (posts.length) series.push({ name: 'Posts', data: posts, yAxisIndex: 0 })
      if (messages.length) series.push({ name: 'Messages', data: messages, yAxisIndex: 1 })
      if (engagements.length) series.push({ name: 'Engagement', data: engagements, yAxisIndex: 2 })
      if (!series.length) this.setNoDataText('ไม่พบข้อมูล')
      this.series = series
    },

    async apiPostImageByImageId() {
      this.loading = true
      try {
        const params = {
          image_id: this.$route.query.id,
          source: this.select_social || undefined,
          sort_by: this.sort || 'engagement',
          limit: this.limit,
          page: this.page,
          sentiment: this.selected,
          ...this.matchParams()             // ← image_match_min / image_match_max
        }
        this.filters = params
        const token = localStorage.getItem('token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const { data } = await this.axios.get(
          'https://api2.cognizata.com/api/v2/image_upload/getImageUserposts',
          { params, headers }
        )
        this.dataImg = data
        const rows = Array.isArray(data?.data) ? data.data : []
        if (this.page === 1) {
          this.posts = rows
        } else {
          this.posts = [...this.posts, ...rows]
        }
        const apiCount = Number(data?.pagination?.total_posts || 0)
        const computed = this.posts.length
        this.count = apiCount > 0 ? apiCount : Math.max((this.page - 1) * this.limit + computed, 0)
        const apiTotalPages = Number(data?.pagination?.total_pages ?? 0)
        this.totalPages = apiTotalPages > 0
          ? apiTotalPages
          : (this.count && this.limit ? Math.ceil(this.count / this.limit) : 0)
      } catch (e) {
        console.error(e)
        this.posts = []
        this.count = 0
        this.totalPages = 0
      } finally {
        this.loading = false
      }
    },

    async apiAllPostImageByImageId() {
      this.loading = true
      try {
        const params = {
          image_id: this.$route.query.id,
          source: this.select_social || undefined,
          sort_by: this.sort || 'engagement',
          limit: this.count,
          page: this.page,
          sentiment: this.selected,
          ...this.matchParams()             // ← image_match_min / image_match_max
        }
        this.filters = params
        const token = localStorage.getItem('token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const { data } = await this.axios.get(
          'https://api2.cognizata.com/api/v2/image_upload/getImageUserposts',
          { params, headers }
        )
        this.dataImg = data
        const rows = Array.isArray(data?.data) ? data.data : []
        this.postForExport = rows
      } catch (e) {
        console.error(e)
        this.postForExport = []
      } finally {
        this.loading = false
      }
    },

    async apiGetImagePostCharts() {
      try {
        const params = {
          image_id: this.$route.query.id,
          source: this.select_social || undefined,
          sort_by: this.sort || 'engagement',
          limit: this.count,
          page: this.page,
          sentiment: this.selected,
          ...this.matchParams()             // ← image_match_min / image_match_max
        }
        this.filters = params
        const token = localStorage.getItem('token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const { data } = await this.axios.get(
          'https://api2.cognizata.com/api/v2/image_upload/getImagePostCharts',
          { params, headers }
        )
        this.datachart = data
        this.applyData(data)
      } catch (e) {
        console.error(e)
      }
    },

    onPageChange(p) {
      if (this.loading) return
      this.page = p
      this.apiPostImageByImageId()
    },

    resetAndFetch() {
      this.page = 1
      this.apiPostImageByImageId()
       this.apiGetImagePostCharts()   
    },

    statusVariant(s) {
      if (!s) return 'secondary'
      const k = s.toLowerCase()
      if (k.includes('succeed') || k.includes('success')) return 'success'
      if (k.includes('processing')) return 'warning'
      if (k.includes('failed') || k.includes('error')) return 'danger'
      return 'secondary'
    },
    pct(n) {
      const socialKeys = ["tiktok","youtube","facebook","twitter","threads","news","blockdit","pantip","instagram"]
      let platform = Object.fromEntries(
        Object.entries(this.datachart.totals).filter(([key]) => socialKeys.includes(key))
      )
      const total = Object.values(platform || {}).reduce((sum, v) => sum + (Number(v) || 0), 0)
      if (!total) return "0%"
      return ((Number(n) || 0) * 100 / total).toFixed(1) + "%"
    },
    exportSelected() {
      console.log('Export clicked')
    }
  },
  mounted() {
    this.apiPostImageByImageId()
    this.apiGetImagePostCharts()
  },
  watch: {
    count: {
      handler(newVal, oldVal) {
        this.apiAllPostImageByImageId()
      }
    }
  },
  filters: {
    numFormat(v) {
      return Number(v || 0).toLocaleString()
    }
  }
}
</script>

<style>
.iconimg.b-avatar .b-avatar-img img {
  width: auto;
  background-color: aliceblue;
}
</style>
<style scoped>
.img-issue {
  width: 24px;
  height: 24px;
}
.small-sub {
  font-size: x-small;
}
.btn-secondary {
  background-color: transparent !important;
}
.btn-secondary:hover {
  background-color: transparent !important;
}
#overflow-page>div.container.my-3>div.card.mb-3.shadow-sm.card-photo.sd-g>div {
  padding: 2px !important;
}
.iconimg {
  height: 300px !important;
}
.iconimg .b-avatar>.b-icon {
  width: 8% !important;
  height: auto;
  max-width: 100%;
}
::v-deep .nav-tabs .nav-link {
  border: 0 !important;
}
.badge-warning {
  color: #3a3838;
  background-color: #ffd968;
  font-weight: 500;
}
.badge-success {
  color: #3a3838;
  background-color: #1996006b;
  font-weight: 500;
}
.badge-danger {
  color: #3a3838;
  background-color: #e86c78c7;
  font-weight: 500;
}
.card-photo {
  margin-bottom: 18px;
  border-radius: 15px;
  border: 0px solid rgba(0, 0, 0, .125) !important;
  box-shadow: 0 .125rem .25rem rgba(0, 0, 0, 0.13) !important;
}
.sd-g {
  border: 1px solid #888787 !important;
}
.b-avatar .b-avatar-img img {
  width: auto;
  height: 100%;
  max-height: auto;
  border-radius: inherit;
  -o-object-fit: cover;
  object-fit: cover;
}
.row-cols-md-9 > * {
  flex: 0 0 auto;
  width: calc(100% / 9);
}
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .rdo { zoom: 75% }
  .iconimg {
    height: 200px !important;
    width: 600px !important;
  }
}
@media (max-width: 516px) {
  .row-cols-md-9 > * { width: auto; }
}
@page { size: A4; margin: 0; }
</style>