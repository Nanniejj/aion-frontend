<template>
  <div class="container my-3">
              <div class="mt-2 text-left h6"> <span class="bold" @click="$router.push('/searchimage')" style="cursor: pointer;">Search Image </span> >  <span>Posts</span></div>

    <div class="text-center mb-3 mt-3">
      <h4 class="mb-0 ">
        <b-img src="@/assets/searchimg.png" style="width: 40px;"></b-img>
        Search Image
      </h4>
    </div>

    <!-- Header -->
    <b-card class="mb-3 shadow-sm card-photo">
      <div class="d-flex align-items-center">
        <b-avatar :src="subject.avatar" size="80" class="mr-3" rounded="lg" />
        <div class="flex-grow-1 text-left">
          <div class="font-weight-bold h5 mb-0">{{ subject.title }}</div>
          <small class="text-muted">Date {{ subject.date }} · Time {{ subject.time }}</small>
        </div>
        <div class="text-right mr-3">
          <div class="mb-1">
            <b-badge :variant="statusVariant(subject.status)" pill class="py-2 px-3 text-uppercase">
              {{ subject.status }}
            </b-badge>
            <div class="flex-grow-2 text-center mr-2">
              <div class="font-weight-bold h6 mb-0 mt-2">18
                <small class="text-muted">Posts</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-card>

    <!-- Controls -->
    <div>
      <b-row class="my-1 mb-2">
        <b-col sm="12" md="auto">
          <b-form-radio-group
            v-model="selected"
            :options="options"
            name="radio-inline"
            class="mt-1 mb-2 text-left ml-2 rdo"
            @change="resetAndFetch"
          />
        </b-col>

        <b-col cols="6" md="">
          <b-form-select
            :options="itemSocial"
            v-model="select_social"
            @change="resetAndFetch"
            id="search-input"
            size="sm"
            class="mb-2 select-sort"
            placeholder="Select Platform"
          />
        </b-col>

        <b-col cols="6" md="" class="text-right">
          <b-form-select
            v-model="sort"
            :options="optionSort"
            size="sm"
            class="mb-2 select-sort"
            @change="resetAndFetch"
          />
        </b-col>
      </b-row>
    </div>

    <!-- Top bar + Export -->
    <div class="d-flex align-items-center justify-content-between">
      <div class="text-left">
        All ({{ count | numFormat }})
      </div>
      <div class="d-flex align-items-center">
        <!-- Page size -->
        <div class="mr-2">
          <b-form-select
            size="sm"
            :options="pageSizeOptions"
            v-model="limit"
            @change="resetAndFetch"
            class="select-sort"
          />
        </div>
        <b-button size="sm" variant="outline-info" @click="exportSelected" v-b-tooltip.hover title="Export">
          <b-icon-download /> Export
        </b-button>
      </div>
    </div>

    <hr/>

    <!-- Pagination (top) -->
    <!-- <div class="d-flex justify-content-center mb-3">
      <b-pagination
        v-model="page"
        :total-rows="count"
        :per-page="limit"
        size="sm"
        align="center"
        :disabled="loading"
        @input="onPageChange"
      />
    </div> -->

    <!-- Posts -->
    <div>
      <CardTitle
        v-for="(post, i) in posts"
        :key="i"
        v-bind="post"
        :post="post"
        class="mx-2"
      />
      <b-alert v-if="!loading && posts.length === 0" show variant="light" class="text-center">
        ไม่มีโพสต์ในแท็บนี้
      </b-alert>
      <b-skeleton-img v-if="loading" height="80px" class="mb-2" />
      <b-skeleton-img v-if="loading" height="80px" class="mb-2" />
    </div>

    <!-- Pagination (bottom) -->
    <div class="d-flex justify-content-center mt-3">
      <b-pagination
        v-model="page"
        :total-rows="count"
        :per-page="limit"
        size="sm"
        align="center"
        :disabled="loading"
        @input="onPageChange"
      />
    </div>
  </div>
</template>

<script>
import CardPost from './CardPost.vue'
import CardTitle from './CardTitle.vue'

export default {
  name: 'PostBoard',
  components: { CardPost, CardTitle },
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
    posts: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      // filters
      selected: [1, 0, -1],
      select_social: 'news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads',
      sort: 'descend',

      // pagination state
      page: 1,
      limit: 20,
      totalPages: 0,
      count: 0,

      // loading
      loading: false,

      // selects
      itemSocial: [
        { text: 'All Platform', value: 'news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads' },
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
        { text: 'ทั้งหมด', value: [1, 0, -1] }
      ],
      optionSort: [
        { value: '', text: ' โพสต์ล่าสุด' },
        { value: 'descend', text: 'โพสต์เริ่มต้น' },
        { value: 'engagement', text: 'Engagement' }
      ],
      pageSizeOptions: [
        { value: 10, text: '10 / หน้า' },
        { value: 20, text: '20 / หน้า' },
        { value: 50, text: '50 / หน้า' },
        { value: 100, text: '100 / หน้า' }
      ],

      // tabs (kept, though not used for server paging)
      activeTab: 0,
      platforms: ['Facebook', 'X', 'Instagram', 'Pantip', 'Youtube', 'News', 'Tiktok', 'Blockdit', 'Threads']
    }
  },
  computed: {
    activePlatform () {
      return this.activeTab === 0 ? 'All' : this.platforms[this.activeTab - 1]
    }
  },
  methods: {
    async apiTimeline () {
      this.loading = true
      try {
        const params = {
          start: '2025-09-24T00:00:00',
          end: '2025-09-24T23:59:59',
          sort_by: this.sort || 'engagement',
          limit: this.limit,
          page: this.page,
          // ตัวอย่างเงื่อนไขเพิ่มเติม หากแบ็คเอนด์รองรับ:
          // source: this.select_social,
          // sentiment: Array.isArray(this.selected) ? this.selected.join(',') : this.selected
        }
        const { data } = await this.axios.get(
          'https://api2.cognizata.com/api/v2/userposts/getFulltextPost',
          { params }
        )

        this.posts = data.data || []
        this.count = Number(data.count || 0)
        // ถ้า API ส่ง totalPages มาก็ใช้ได้เลย ไม่งั้นคำนวณจาก count/limit
        this.totalPages = Number(data.totalPages || Math.ceil(this.count / this.limit) || 0)
      } catch (e) {
        console.error(e)
        this.posts = []
        this.count = 0
        this.totalPages = 0
      } finally {
        this.loading = false
      }
    },

    onPageChange (p) {
      // ป้องกัน spam ระหว่างโหลด
      if (this.loading) return
      // รับค่าจาก b-pagination แล้ว fetch หน้าใหม่
      this.page = p
      this.apiTimeline()
    },

    resetAndFetch () {
      // ใช้เมื่อมีการเปลี่ยน filter/sort/page-size
      this.page = 1
      this.apiTimeline()
    },

    statusVariant (s) {
      if (!s) return 'secondary'
      const k = s.toLowerCase()
      if (k.includes('succeed') || k.includes('success')) return 'success'
      if (k.includes('processing')) return 'warning'
      if (k.includes('failed') || k.includes('error')) return 'danger'
      return 'secondary'
    },

    exportSelected () {
      // TODO: Implement export logic
      // ใช้ this.posts (หน้าปัจจุบัน) หรือเรียก API ดึงทั้งหมดตามต้องการ
      console.log('Export clicked')
    }
  },
  mounted () {
    this.apiTimeline()
  },
  filters: {
    // เผื่อยังไม่มีฟิลเตอร์ numFormat ในโปรเจกต์
    numFormat (v) {
      const n = Number(v || 0)
      return n.toLocaleString()
    }
  }
}
</script>

<style scoped>
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
  background-color: #00967d6b;
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
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .rdo { zoom: 75% }
}
</style>
