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
      <!-- <b-img :src="subject.avatar"  class="" rounded="lg" /> -->
      <!-- {{ dataImg }} -->
      <b-row>
        <b-col cols="12" md="6">
          <b-avatar button :src="dataImg.image.url" size="20" class="iconimg my-3" rounded="lg"
            @click="onClick(0, dataImg.image.url)" />

          <vue-gallery-slideshow :images="dataPhoto" :index="index" @close="index = null"></vue-gallery-slideshow>
        </b-col>
        <b-col class="py-3" cols="12" md="6">
          <PlatformImgChart :platform="dataImg.source_counts" class="ma-auto " />

        </b-col>
      </b-row>


      <!-- <b-card img-src="https://picsum.photos/400/200/?image=41" img-alt="Image" img-top>
      <b-card-text>
        This is a wider card with supporting text below as a natural lead-in to additional content.
        This card has even longer content than the first.
      </b-card-text>
      <template #footer>
        <small class="text-muted">Footer Text</small>
      </template>
</b-card> -->
    </div>
    <!-- Header -->
    <b-card class="mb-3 shadow-sm card-photo sd-g d-none">
      <div>

        <div class="d-flex align-items-center" v-if="dataImg">
          <div class="flex-grow-1 text-left" v-if="dataImg.image">
            <!-- <div class="font-weight-bold h5 mb-0">{{ subject.title }}</div> -->
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
    <!-- Top bar + Export -->
    <div class="d-flex align-items-center justify-content-between">
      <div class="text-left">
        All ({{ count | numFormat }})
      </div>
      <div class="d-flex align-items-center">
        <!-- Page size -->
        <!-- <div class="mr-2">
          <b-form-select size="sm" :options="pageSizeOptions" v-model="limit" @change="resetAndFetch"
            class="select-sort" />
        </div> -->
        <b-button size="sm" variant="outline-info" @click="printPosts" v-b-tooltip.hover title="Print">
          <b-icon-printer /> Print
        </b-button>
        <ExportExcelButton :posts="postForExport" :filters="filters"
        :disabled="loading || (Array.isArray(postForExport) && postForExport.length === 0)" :full-export="true"
        :prefer-single-shot="true"  inline-comments="json" :comments-limit="20" v-if="!loading" />
                    
        <!-- <b-button size="sm" variant="outline-info" @click="exportSelected" v-b-tooltip.hover title="Export">
          <b-icon-download /> Export
        </b-button> -->
      </div>
    </div>

    <hr />
    <!-- Controls -->
    <div>
      <b-row class="my-1 mb-2">
        <!-- sentiment (คงไว้ แต่ API ใหม่นี้ไม่ได้ใช้ส่ง) -->
        <b-col sm="12" md="auto">
          <b-form-radio-group v-model="selected" :options="options" name="radio-inline"
            class="mt-1 mb-2 text-left ml-2 rdo" @change="resetAndFetch" />
        </b-col>

        <!-- source -->
        <b-col cols="6" md="">
          <b-form-select :options="itemSocial" v-model="select_social" @change="resetAndFetch" id="search-input"
            size="sm" class="mb-2 select-sort" placeholder="Select Platform" />
        </b-col>

        <!-- sort (คงไว้ แต่ API ใหม่นี้ไม่ได้ใช้ส่ง) -->
        <b-col cols="6" md="" class="text-right">
          <b-form-select v-model="sort" :options="optionSort" size="sm" class="mb-2 select-sort"
            @change="resetAndFetch" />
        </b-col>
      </b-row>
    </div>


    <!-- {{  $route.query.id }} -->

    <div class="text-center my-4 py-4" v-if="loading">
      <vue-element-loading :active="loading" size="80" background-color="rgba(255, 255, 255, 0.5)" color="#17a2b891" />
    </div>

    <!-- Posts -->
    <div>
        

      
      <!-- <CardTitle v-for="(post, i) in posts" :key="i" v-bind="post" :post="post" class="mx-2" /> -->
      <b-alert v-if="!loading && posts.length === 0" show variant="light" class="text-center">
        ไม่มีโพสต์
      </b-alert>
      <timeline-posts v-else :items="posts" mode="posts" 
        sort="recent" :count="count" />
        <div v-if="totalPages > 1" class="text-center my-2 pb-5">
            
            <div v-if="page === totalPages" class="text-center mb-3 py-5">
            <vue-element-loading :active="load" size="80" background-color="rgba(255, 255, 255, 0.5)"
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

    <!-- Pagination (bottom) -->
    <!-- <div class="d-flex justify-content-center mt-3" v-if="!loading && posts.length > 0">
      <b-pagination v-model="page" :total-rows="count" :per-page="limit" size="sm" align="center" :disabled="loading"
        @input="onPageChange" />
    </div> -->
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

export default {
  name: 'PostBoard',
  components: { CardPost, CardTitle, VueGallerySlideshow, PlatformImgChart, TimelinePosts, ExportExcelButton },
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
    // รับ imageId จากภายนอก/route ถ้าไม่ส่งมา ใช้ตัวอย่างที่ให้ไว้
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
      selected: "1, 0, -1", // ไม่ได้ส่งไปที่ API ใหม่ แต่คง UI ไว้
      select_social: '',      // map ไปเป็น source
      sort: 'asc',        // ไม่ได้ส่งไปที่ API ใหม่ แต่คง UI ไว้

      // pagination state
      page: 1,
      limit: 20,      // API ใหม่ไม่ได้รับ limit แต่ใช้ควบคุม UI/pagination
      totalPages: 0,
      count: 0,

      // loading
      loading: false,

      // selects
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

      // tabs (kept, though not used for server paging)
      activeTab: 0,
      platforms: ['Facebook', 'X', 'Instagram', 'Pantip', 'Youtube', 'News', 'Tiktok', 'Blockdit', 'Threads'],

      // data
        posts: [],
        postForExport:[],
        filters:{}
    }
  },
  computed: {
    activePlatform() {
      return this.activeTab === 0 ? 'All' : this.platforms[this.activeTab - 1]
    }
  },
  methods: {
    printPosts() {
    // ใส่สไตล์พิมพ์ margin ต่ำสุด (ครั้งเดียว)
    const STYLE_ID = 'print-style-min-margin';
    if (!document.getElementById(STYLE_ID)) {
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.media = 'print';
        style.textContent = `
        @page { size: auto; margin: 0; }    /* ขอบกระดาษ 0 */
        @media print {
            html, body { margin: 0 !important; padding: 0 !important; }
        }
        `;
        document.head.appendChild(style);
    }

    this.$nextTick(() => {
        try { window.print(); } catch (e) { console.error(e); }
    });
    }
    ,
    formatDate(date) {
      let dates = moment(date).subtract(7, "hours");
      let date2 = moment(dates).format("ll");
      return date2;
    },
    formatTime(date) {
      return date.slice(11, 16);
    },
    onClick(i, url) {
      this.dataPhoto = [url];  // เซ็ตภาพก่อน
      this.index = i;          // แล้วค่อยเปิดที่ index 0
    },
    async apiPostImageByImageId() {
      this.loading = true
      try {
        const params = {
          image_id: this.$route.query.id,
          source: this.select_social || undefined, // ส่งเฉพาะถ้ามีเลือก
          page: this.page,
          sort_by: this.sort || 'engagement',
          limit: this.limit,
          page: this.page,
          source: this.select_social,
          sentiment: this.selected
        }
        this.filters = params
        const token = localStorage.getItem('token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        const { data } = await this.axios.get(
          'https://api2.cognizata.com/api/v2/image_upload/getImageUserposts',
          { params, headers }
        )
        this.dataImg = data
        // ปรับรูปแบบผลลัพธ์ให้เข้ากับ UI
        // const rows = data?.data || []
        // this.posts = Array.isArray(rows) ? rows : []
        const rows = Array.isArray(data?.data) ? data.data : [];

        // ✅ ถ้า page = 1 → ล้างข้อมูลเก่า
        // ✅ ถ้า page > 1 → ต่อข้อมูลใหม่เข้ากับของเดิม
        if (this.page === 1) {
            this.posts = rows;
        } else {
            this.posts = [...this.posts, ...rows];
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
        // ถ้าจะจัดการ 401:
        // if (e?.response?.status === 401) this.$router.push('/login')
      } finally {
        this.loading = false
      }
    },
    async apiAllPostImageByImageId() {
      this.loading = true
      try {
        const params = {
          image_id: this.$route.query.id,
          source: this.select_social || undefined, // ส่งเฉพาะถ้ามีเลือก
          page: this.page,
          sort_by: this.sort || 'engagement',
          limit: this.count,
          page: this.page,
          source: this.select_social,
          sentiment: this.selected
        }
        this.filters = params
        const token = localStorage.getItem('token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        const { data } = await this.axios.get(
          'https://api2.cognizata.com/api/v2/image_upload/getImageUserposts',
          { params, headers }
        )
        this.dataImg = data
        // ปรับรูปแบบผลลัพธ์ให้เข้ากับ UI
        // const rows = data?.data || []
        // this.posts = Array.isArray(rows) ? rows : []
        const rows = Array.isArray(data?.data) ? data.data : [];
        console.log("rows == ", rows);
        this.postForExport = rows
        // ✅ ถ้า page = 1 → ล้างข้อมูลเก่า
        // ✅ ถ้า page > 1 → ต่อข้อมูลใหม่เข้ากับของเดิม
        // if (this.page === 1) {
        //     this.posts = rows;
        // } else {
        //     this.posts = [...this.posts, ...rows];
        // }
        
        // const apiCount = Number(data?.pagination?.total_posts || 0)
        // const computed = this.posts.length
        // this.count = apiCount > 0 ? apiCount : Math.max((this.page - 1) * this.limit + computed, 0)

        // const apiTotalPages = Number(data?.pagination?.total_pages ?? 0)
        // this.totalPages = apiTotalPages > 0
        //   ? apiTotalPages
        //   : (this.count && this.limit ? Math.ceil(this.count / this.limit) : 0)
      } catch (e) {
        console.error(e)
        this.postForExport = []
        // this.count = 0
        // this.totalPages = 0
        // ถ้าจะจัดการ 401:
        // if (e?.response?.status === 401) this.$router.push('/login')
      } finally {
        this.loading = false
      }
    },

    async apiPostImageByImageId2() {
      this.loading = true
      try {
        const params = {
          start: '2025-09-24T00:00:00',
          end: '2025-09-24T23:59:59',
          sort_by: this.sort || 'engagement',
          limit: this.limit,
          page: this.page,
          source: this.select_social,
          sentiment: this.selected
        }
        const { data } = await this.axios.get(
          'https://api2.cognizata.com/api/v2/userposts/getFulltextPost',
          { params }
        )

        this.posts = data.data || []
        this.count = Number(data.count || 0)
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

    onPageChange(p) {
      if (this.loading) return
      this.page = p
      this.apiPostImageByImageId()
    },

    resetAndFetch() {
      this.page = 1
      this.apiPostImageByImageId()
    },

    statusVariant(s) {
      if (!s) return 'secondary'
      const k = s.toLowerCase()
      if (k.includes('succeed') || k.includes('success')) return 'success'
      if (k.includes('processing')) return 'warning'
      if (k.includes('failed') || k.includes('error')) return 'danger'
      return 'secondary'
    },

    exportSelected() {
      // TODO: Implement export logic
      console.log('Export clicked')
    }
  },
  mounted() {
    this.apiPostImageByImageId()
    },
    watch: {
        count: {
            handler(newVal, oldVal) {
                this.apiAllPostImageByImageId();
            },
            // immediate: true
        }
    },
  filters: {
    numFormat(v) {
      const n = Number(v || 0)
      return n.toLocaleString()
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
  height: 350px !important;
  width: 600px !important;
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

@media only screen and (min-width: 0px) and (max-width: 800px) {
  .rdo {
    zoom: 75%
  }

  .iconimg {
    height: 200px !important;
    width: 600px !important;
  }
}
@page { size: A4; margin: 0; }
</style>
