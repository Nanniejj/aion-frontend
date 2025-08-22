<template>
  <div class="py-2 mx-0 box-spot-bg">
    <vue-element-loading :active="loading" size="80" background-color="rgba(255,255,255,0.5)" color="#b6ac9a" />

    <div v-if="clusters && clusters.length">
      <!-- Header -->
      <div class="text-left">
        <span class="h5 mr-1 d-inline-block">{{ title }}</span>
        <span class="domain-tag mr-3">{{ currentDomain }}</span>
      </div>

      <!-- Slider -->
      <div class="slider-container">
        <b-button class="slider-button btn-left" @click="scrollLeft"><i class="fa fa-chevron-left"></i></b-button>
<!-- {{ clusters }}  -->
  <!-- {{ currentPosts }} -->
        <div class="slider" ref="slider">
          <b-row>
            <span class="d-flex box-flex-small" style="width:85vw;padding:0 20px;">
             <!-- {{ currentPosts }} -->
              <CardPost
                v-for="(post, index) in currentPosts"
                :key="post._id || index"
                :post="post"
                :index="index"
                :domain="currentDomain"
               
                class="mx-2"
              />
            </span>
          </b-row>
        </div>

        <b-button class="slider-button btn-right" @click="scrollRight"><i class="fa fa-chevron-right"></i></b-button>
      </div>

      <!-- Date pills -->
      <b-row class="mt-2" v-if="clusters.length > 1">
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
      </b-row>
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
    // รูปแบบเดียวกับที่คุณได้จาก API: [{ _id, domain, data_date, data: [ {...post} ] }]
    clusters: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "Hot Topics",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    // ค่าเริ่มต้น index ของชุด (วันที่)
    initialIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      selectIndex: this.initialIndex,
    };
  },
  computed: {
    currentCluster() {
      return this.clusters|| {};
    },
    currentPosts() {
      // รองรับทั้งกรณี data เป็น array ของ “post เดี่ยวแบบดิบจาก API”
      // หรือเป็นรูปแบบเดิมที่มีฟิลด์ posts[0] อยู่แล้ว
      return (this.currentCluster || []).filter(p =>
        // แสดงได้แม้ไม่มี photos/ไม่มี posts[0]
        p && (p.full_text || (p.posts && p.posts.length))
      );
    },
    currentDomain() {
      return this.currentCluster.domain || "สื่อสังคมออนไลน์";
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
  width:60%;
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
  background-color: #ffffff;
  color: rgb(112, 108, 108);
  border: none;
  padding: 10px 15px;
  margin: 0px 10px;
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

    .slider-button.btn-left {
      position: absolute;
      z-index: 99999;
      left: -30px;
      background: #fed16e;
      color: white;
    }

    .slider-button.btn-right {
      position: absolute;
      z-index: 99999;
      right: -30px;
      background: #fed06e;
      color: white;
    }
  }
}
</style>