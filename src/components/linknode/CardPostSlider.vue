<template>
  <div class="py-2 mx-0 box-spot-bg">
    <vue-element-loading :active="loading" size="80" background-color="rgba(255,255,255,0.5)" color="#b6ac9a" />
    <div class="text-left d-none">
      <b-form-select size="sm" v-model="localSort" :options="[
        { value: 'descend', text: 'โพสต์เก่าสุด' },
        { value: 'recent', text: 'โพสต์ล่าสุด' },
        { value: 'engagement', text: 'Engagement' },
      ]" class="mr-2 w-50" @change="emitChangeSort" />
      <b-button size="sm" variant="outline-info" @click="emitLoadMore" :disabled="!hasMore">
        <i class="fa fa-plus mr-1"></i> เพิ่มข้อมูล
      </b-button>
    </div>
    <!-- <div class="text-left float-left">
      <span class="h6 mr-1 d-inline-block">{{ title }}</span>

    </div> -->
    <div class="text-right position-absolute" style="right: 111px; z-index: 99; top: -27px; z-index: 99">
      <!-- ปุ่ม sort เป็น icons -->
      <b-button size="sm" variant="outline-info" class="p-1 mr-2" :class="{ active: localSort === 'descend' }"
        @click="setSort('descend')" v-b-tooltip.hover title="โพสต์เก่าสุด" pill>
        <i class="fa fa-arrow-down-a-z"></i>
      </b-button>

      <b-button size="sm" variant="outline-info" class="p-1 mr-2" :class="{ active: localSort === 'recent' }"
        @click="setSort('recent')" v-b-tooltip.hover title="โพสต์ล่าสุด" pill>
        <i class="fa fa-arrow-up-a-z"></i>
      </b-button>

      <b-button size="sm" variant="outline-info" class="p-1 mr-2" :class="{ active: localSort === 'engagement' }"
        @click="setSort('engagement')" v-b-tooltip.hover title="Engagement" pill>
        <i class="fas fa-chart-line"></i>
      </b-button>

      <!-- ปุ่ม load more -->
      <b-button size="sm" variant="outline-info" class="p-1" @click="emitLoadMore" :disabled="!hasMore"
        v-b-tooltip.hover title="โหลดเพิ่ม" pill>
        <i class="fa fa-plus"></i>
      </b-button>
    </div>

    <div v-if="clusters && clusters.length">
      <!-- Header -->

      <!-- Slider -->
      <div class="slider-container">
        <b-button class="slider-button btn-left" @click="scrollLeft"><i class="fa fa-chevron-left"></i></b-button>

        <div class="slider" ref="slider">
          <b-row>
            <span class="d-flex box-flex-small">
              <!-- {{ currentPosts }} -->

              <!-- <CardPost
                v-for="(post, index) in currentPosts"
                :key="post._id || index"
                :post="post"
                :index="index"
                :domain="currentDomain"
                 @click.native="$emit('selectPost', post)"
                class="mx-2"
                :loading-card="
                  dayLoading || selectingId === (post._id || post.url_post)
                "
              /> -->
              <CardPost v-for="(post, index) in currentPosts" :key="post._id || `${post.source}:${post.url_post}`"
                :post="post" :index="index"  @click.native="$emit('selectPost', post)"
                class="mx-2" :loading-card="dayLoading || selectingId === (post._id || post.url_post)" />


            </span>
          </b-row>
        </div>

        <b-button class="slider-button btn-right" @click="scrollRight"><i class="fa fa-chevron-right"></i></b-button>
      </div>

      <!-- Date pills -->
      <!-- <b-row class="mt-2" v-if="clusters.length > 1">
        <b-col>
          <div class="text-center box-date scroll-container">
            <b-button
              class="d-inline mx-1 btn-date-box"
              v-for="(cluster, k) in clusters"
              :key="cluster._id || k"
              @click="selectIndex = k"
              :variant="selectIndex === k ? 'dark' : 'light'"
            >
              <div v-if="cluster && cluster.data_date">
                <div class="small py-0 my-0">{{ getMonth(cluster.data_date) }}</div>
                <div class="h6 bold py-0 my-0">{{ getDay(cluster.data_date) }}</div>
                <div class="small py-0">{{ getYear(cluster.data_date) }}</div>
              </div>
            </b-button>
          </div>
        </b-col>
      </b-row> -->
    </div>

    <div v-else-if="!loading" class="py-8 text-center">ไม่พบข้อมูล</div>
  </div>
</template>

<script>
import CardPost from "./CardPost.vue";

export default {
  name: "CardPostSlider",
  components: { CardPost },
  props: {
    dayLoading: { type: Boolean, default: false },
    clusters: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    // ค่าเริ่มต้น index ของชุด (วันที่)
    initialIndex: { type: Number, default: 0 },
    initialSort: { type: String, default: "descend" }, // เริ่มจากค่าแม่
    hasMore: { type: Boolean, default: false }, // แม่คำนวณมาให้
    ymd: { type: String, required: true },
  },
  watch: {
    initialSort(newVal) {
      if (newVal && newVal !== this.localSort) this.localSort = newVal;
    },
  },
  data() {
    return {
      selectingId: null,
      selectIndex: this.initialIndex,
      localSort: this.initialSort, // state การเรียงเฉพาะวันนี้
    };
  },
  computed: {
    currentCluster() {
      return this.clusters || [];
    },

    currentPosts() {
      const arr = (this.currentCluster || []).filter(p => p && (p.full_text || (p.posts && p.posts.length)));

      // dedupe โดยใช้ key เดิม
      const keyOf = (p) => (p && (p._id || `${p.source}:${p.url_post}`));
      const seen = new Set();
      const uniq = [];
      for (const p of arr) {
        const k = keyOf(p);
        if (!k || seen.has(k)) continue;
        seen.add(k);
        uniq.push(p);
      }

      if (this.localSort === "engagement") {
        return uniq.sort((a, b) => (b.engagement || 0) - (a.engagement || 0));
      }
      if (this.localSort === "recent") {
        return uniq.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
      return uniq.sort((a, b) => new Date(a.date) - new Date(b.date));
    },

  },
  watch: {
    selectIndex() {
      const slider = this.$refs.slider;
      if (slider) slider.scrollLeft = 0;
      this.$emit("changeCluster", this.currentCluster);
    },
    clusters() {
      // ปรับ index ให้ไม่เกินขอบเขตเมื่อชุดข้อมูลเปลี่ยน
      if (this.selectIndex > this.clusters.length - 1) this.selectIndex = 0;
      this.$nextTick(() => {
        const slider = this.$refs.slider;
        if (slider) slider.scrollLeft = 0;
      });
    },
  },
  methods: {
    setSort(val) {
      this.localSort = val;
      this.$emit("requestChangeSort", { date: this.ymd, sort_by: val });
    },
    emitLoadMore() {
      this.$emit("requestLoadMore", { date: this.ymd });
    },
    emitLoadMore() {
      this.$emit("requestLoadMore", { date: this.ymd });
    },
    emitChangeSort() {
      // แจ้งแม่ให้รีเฟรชของวันนี้ด้วย sort ใหม่ (page=1)
      this.$emit("requestChangeSort", {
        date: this.ymd,
        sort_by: this.localSort,
      });
    },
    scrollLeft() {
      const slider = this.$refs.slider;
      if (slider) slider.scrollLeft -= 300;
    },
    scrollRight() {
      const slider = this.$refs.slider;
      if (slider) slider.scrollLeft += 300;
    },
    getDay(dateString) {
      return new Date(dateString).getUTCDate();
    },
    getMonth(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", { month: "short" });
    },
    getYear(dateString) {
      const year = new Date(dateString).getUTCFullYear();
      return year.toString();
    },
    onGoPost({ post, type }) {
      // ส่งต่ออีเวนต์ให้พาเรนต์ไปเปิดหน้ารายละเอียด
      this.$emit("goPost", {
        post,
        clusterId: this.currentCluster._id,
        domain: this.currentDomain,
        type,
      });
    },
  },
};
</script>
<style scoped>
.box-flex-small {
  width: 65vw;
  padding: 0 20px;
}

.fa-external-link {
  display: inline-block;
  /* ทำให้ขอบครอบคลุมตัวไอคอน */
  /* background-color: #ffffff; */
  color: #2c3e50 !important;
  text-decoration: none;
}

.box-link {
  /* height: 18px; */
  cursor: pointer;
  text-align: end;
  font-size: small;
  padding: 2px 7px;
  margin: 2px;
  background-color: #eeeeeee7;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  border-radius: 10px;
}

.box-link:hover {
  background-color: #fed16e;
}

.h3 {
  font-size: 25px !important;
  font-weight: 700;
}

.onedate,
.twodate {
  font-size: small;
  font-weight: bold;
  background: #eee;
  padding: 4px 15px;
  width: -moz-fit-content;
  width: fit-content;
  border-radius: 10px;
}

.card-img {
  width: 100% !important;
  height: auto !important;
  object-fit: cover !important;
  object-position: center !important;
}

.title-limited {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  /* จำกัด 3 บรรทัด */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

.badge-success {
  color: #fff;
  background-color: #4dac89 !important;
}

.badge-primary {
  color: #fff;
  background-color: #347ea5 !important;
}

.badge-danger {
  color: #fff;
  background-color: #d3675a !important;
}

.scroll-container {
  /* display: flex;  */
  overflow-x: auto;
  white-space: nowrap;
  padding: 5px 0;
  -webkit-overflow-scrolling: touch;
  /* justify-content: flex-end; */
}

/* ปรับแต่ง scrollbar สำหรับ WebKit (Chrome, Edge, Safari) */
.scroll-container::-webkit-scrollbar {
  height: 4px;
  background-color: #eeeeee8c;
  /* ความสูงของ scrollbar */
}

.scroll-container::-webkit-scrollbar-thumb {
  background-color: #eeeeee8c;
  /* สีของ thumb */
  border-radius: 4px;
  /* มุมมน */
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: #f5f5f58c;
  /* สีเมื่อ hover */
}

.scroll-container::-webkit-scrollbar-track {
  background: #eeeeee8c;
  /* สีพื้นหลังของ scrollbar */
  border-radius: 4px;
}

/* สำหรับ Firefox */
.scroll-container {
  scrollbar-width: thin;
  /* ความกว้างของ scrollbar (thin, auto, none) */
  scrollbar-color: #eeeeee8c;
  /* สีของ thumb และ track */
}

.btn-dark {
  color: #314a64 !important;
  background-color: #fed16e;
  border-color: #fed16e;
  border-radius: 10px;
}

.btn-light {
  background-color: #eee;
  border-radius: 10px;
  color: #42586e !important;
}

.box-spot-bg {
  min-height: 300px !important;
  background-color: #ffffff;
  /*box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);*/
  border-radius: 11px;
}

.box-date {
  margin: 0px 15px;
}

.small {
  font-size: 11px;
}

.btn-date-box {
  border: 0px;
  box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
  transition: all 0.3s ease;

  /* background-color: black;
 color: #ffffff; */
}

.card-img,
.card-img-top {
  height: 200px !important;
}

.domain-tag {
  padding: 2px 10px;
  border-radius: 10px;
  background: #fed16e;
  box-shadow: 2px 2px 4px 0 rgb(0 0 0 / 20%);
  /* font-weight: 600; */
}

.box-spotnews {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border: 0px;
  height: 410px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 20px;
}

.slider {
  display: flex;
  flex-wrap: nowrap;
  /* ป้องกันการขึ้นบรรทัดใหม่ */
  overflow-x: auto;
  /* เปิดใช้งานการเลื่อนในแนวนอน */
  scroll-behavior: smooth;
  /* ทำให้เลื่อนนุ่มนวล */
  gap: 10px;
  /* เพิ่มระยะห่างระหว่างการ์ด */
  width: 100%;
}

.slider-item {
  flex: 0 0 auto;
  /* การ์ดแต่ละอันมีขนาดคงที่ */
  width: 300px;
  /* ขนาดการ์ด 4 ชิ้นใน 100% */
  flex-wrap: nowrap;
}

.slider-container {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  border-radius: 15px;
}

.slider-button {
  background-color: #3f3b3b00;
  color: rgb(112, 108, 108);
  border: none;
  padding: 10px 15px;
  margin: 0px 4px;
  cursor: pointer;
  border-radius: 15px;
  font-size: 20px;
}

.slider-button:hover {
  background-color: #fed16e;
  border-radius: 15px;
  color: #ffffff;
}

.slider::-webkit-scrollbar {
  display: none;
  /* ซ่อน scrollbar */
}

/* width */
::-webkit-scrollbar {
  width: 5px;
  border-radius: 20px;
}

/* Track */
::-webkit-scrollbar-track {
  background: white;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #cac6c6ce;
  border-radius: 20px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* จอใหญ่ Desktop */
@media only screen and (min-width: 0px) and (max-width: 1500px) {
  .slider-item {
    width: 33.33%;
  }

  /* จอ iPad หรือแท็บเล็ต */
  @media only screen and (min-width: 0px) and (max-width: 1024px) {
    .slider {
      padding: 10px;
    }

    .slider-item {
      width: 48%;
    }
  }

  /* จอมือถือ */
  @media only screen and (min-width: 0px) and (max-width: 800px) {
    .slider-button.btn-left {
      background: #fed06ebf;
      color: white;
      border: none;
      padding: 5px 11px;
      /* margin: 36px 4px; */
      cursor: pointer;
      border-radius: 15px;
      font-size: 20px;
    }

    .slider-button.btn-right {
      position: absolute;
      z-index: 99999;
      right: -18px;
      padding: 5px 11px;
      background: #fed06ebf;
      color: white;
    }

    .box-link {
      font-size: 12px !important;
    }

    .box-flex-small {
      width: 98vw;
      padding: 0px 5px;
    }

    .title-spot {
      display: inline;
      margin-right: 5px;
      font-size: 20px !important;
    }

    .h3 {
      display: inline;
      font-size: 20px !important;
    }

    .slider {
      padding: 0px 20px;
    }

    .card-body {
      padding: 7px;
    }

    .slider-item {
      width: 290px;
    }

    .mx-datepicker-range {
      width: 100% !important;
    }
  }
}
</style>