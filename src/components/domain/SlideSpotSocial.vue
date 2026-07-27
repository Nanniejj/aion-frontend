<template>
  <div v-if="items && items.length">
    <div class="text-left">
      <span class="h5 mr-1 d-inline-block">Hot Topics</span> <span class="domain-tag mr-3">สื่อสังคมออนไลน์</span>
      <!-- <div class="d-inline-block">
        <div v-if="items && items[selectIndex] && items[selectIndex].data_date" class="text-left onedate">
          <i class="far fa-calendar-alt"></i>
          {{ items[selectIndex].data_date.split("T")[0] }}
        </div>
      </div> -->
    </div>
    <div class="py-2 mx-0 box-spot-bg">
      <vue-element-loading :active="load" size="80" background-color="rgba(255, 255, 255, 0.5)" color="#b6ac9a" />

      <div class="slider-container" v-if="items && items.length">
        <b-button class="slider-button btn-left" @click="scrollLeft"><i class="fa fa-chevron-left "></i></b-button>
        <div class="slider " ref="slider">
          <b-row>
            <span class="d-flex box-flex-small" style="width:85vw;padding: 0px 20px;">
              <b-card img-alt="Image" img-top class="box-spotnews black slider-item mx-2 p-1 position-relative"
                v-for="(item, index) in items[selectIndex].data" :key="index" v-if="item.posts && item.posts.length">
                <div class="position-relative" v-if="item && item.posts && item.posts[0]">
                  <b-card-img cover :src="item.posts[0].photos[0]" v-if="
                    item &&
                    item.posts &&
                    item.posts[0] &&
                    item.posts[0].photos &&
                    item.posts[0].photos.length
                  ">
                  </b-card-img>
                  <div v-if="
                    item &&
                    item.posts &&
                    item.posts[0] &&
                    item.posts[0].photos &&
                    item.posts[0].photos.length == 0 || item.posts[0].photos == undefined">
                    <div class="h5 text-center " style=" height: 200px !important;
                      background-color:rgb(237 231 221);
                      display: flex;
                      flex-direction: column;
                      justify-content: center; 
                      align-items: center; ">
                      <i class="fa fa-newspaper-o fa-2x" aria-hidden="true"></i>
                      {{ items[selectIndex].domain }}
                    </div>
                  </div>
                  <div class="bold h6 position-absolute mt-1 text-right" style="top: -3px; right: 1px;">
                    <span class="d-inline-block  box-link">
                      <a v-bind:href="item.posts[0].url_post" class="fa fa-external-link" target="_blank">
                        <span> Link </span></a></span>
                  </div>
                  <div class="bold h6 position-absolute mt-1 text-right" style="bottom: -6px; left: 1px;">
                    <!-- <span class="d-inline-block  box-link" style="background:#fed16e;">
                        <span> {{ index + 1 }}</span></span> -->

                    <span class="d-inline-block  box-link" @click="
                      toPost(
                        item,
                        items[selectIndex]._id,
                        items[selectIndex].domain
                      )
                      ">
                      <i class="far fa-paper-plane" /> <span class="bold">{{ item.count | numFormat }}</span> Posts
                    </span>
                    <span class="d-inline-block  box-link" @click="
                      toPost(
                        item,
                        items[selectIndex]._id,
                        items[selectIndex].domain
                      )
                      ">
                      📈 <span class="bold">{{ item.total_engagement | numFormat }} Engages</span>
                    </span>
                  </div>

                  <div class="position-absolute pl-1 pt-1 pb-1"
                    style="bottom: 0px; right: 0; background-color: white; border-top-left-radius: 50%; border-bottom-left-radius: 50%;">
                    <b-avatar variant="success" icon="emoji-smile" v-if="item.sentiment == 'positive'"></b-avatar>
                    <b-avatar variant="primary" icon="emoji-neutral" v-if="item.sentiment == 'neutral'"></b-avatar>
                    <b-avatar variant="danger" icon="emoji-frown" v-if="item.sentiment == 'negative'"></b-avatar>
                  </div>
                </div>

                <!-- ตัดข้อความและมีปุ่มอ่านเพิ่มเติม -->
                <div class="my-2 py-3" style="height: 135px;overflow-y: auto;"
                  v-if="item && item.posts && item.posts[0]">
                  <!-- <div >
                    📈 <span class="bold">{{ item.total_engagement | numFormat }}</span> </div> -->
                  <div>
                    <ReadMoreBox :item="{ title: item.title }" />

                    <!-- {{ item.title }} -->
                  </div>
                  <!-- <div>{{ item.posts[0].title }}</div> -->

                </div>
                <!-- left: 50%; transform: translateX(-50%); -->
                <div class="bold h6 position-absolute" style="bottom: 15px;left: 50%; transform: translateX(-50%); ">
                  <b-avatar variant="primary"
                    style="background-color: rgb(238 238 238) !important;color: rgb(89 89 89)">
                    <b> {{ index + 1 }}</b>
                  </b-avatar>
                </div>
              </b-card>
            </span>
          </b-row>
        </div>
        <b-button class="slider-button btn-right" @click="scrollRight"><i class="fa fa-chevron-right "></i></b-button>
      </div>
      <div v-else>
        <div v-if="load == false" class="py-8">
          <br />
          <br />
          <br />
          <br />
          ไม่พบข้อมูล
        </div>
      </div>
      <b-row class="mt-2">
        <!-- <b-col class="text-left px-5" cols="12" md="auto">
        <div class="title-spot mb-2">
          <span class="h5 mt-3">Spot</span>
          <span class="h5"> News</span>
        </div>
        <div class="my-3 onedate d-inline" v-if="items&&items[selectIndex]&&items[selectIndex].data_date">
          <i class="far fa-calendar-alt"></i>
          {{ items[selectIndex].data_date.split("T")[0] }}
        </div>
      </b-col> -->

        <b-col v-if="items.length !== 1 && items.length !== 0">
          <div class="text-center box-date scroll-container">
            <b-button class="d-inline mx-1 btn-date-box" v-for="(cluster, k) in items" :key="k._id"
              @click="selectIndex = k" :variant="selectIndex === k ? 'dark' : 'light'">
              <!-- <div> {{ cluster.data_date.split("T")[0] }}</div> -->
              <div class="" v-if="cluster && cluster.data_date">
                <div class="small  py-0 my-0">
                  {{ getMonth(cluster.data_date.split("T")[0]) }}
                </div>
                <div class="h6 bold  py-0 my-0">
                  {{ getDay(cluster.data_date.split("T")[0]) }}
                </div>
                <div class="small py-0">
                  {{ getYear(cluster.data_date.split("T")[0]) }}
                </div>
              </div>
            </b-button>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import ReadMoreBox from "./ReadMore.vue";

export default {
  components: {
    ReadMoreBox
  },
  computed: {
    ...mapGetters(["getClickDomain", "getSdateDm", "getEdateDm", "getArrDate", "getClickDomainId"]),
  },
  watch: {
    selectIndex() {
      // ✅ <div ref="slider"> อยู่ใน v-if="items && items.length" — ถ้า items ว่าง ref จะไม่มี element
      // เลย เซ็ต scrollLeft ตรงๆ ไม่ได้ (undefined.scrollLeft) ต้องเช็คก่อนเสมอ
      const slider = this.$refs.slider;
      if (slider) slider.scrollLeft = 0; // เลื่อนซ้าย 300px
    },
    getArrDate() {
      // ✅ เดิมตรงนี้ใช้ this.getSdateDm/this.getEdateDm ตรงๆ (เป็น "วันนี้")
      // แต่ mounted() คำนวณเป็น "เมื่อวาน" (ลบ 1 วัน) → คนละวันกัน
      // ทำให้ยิง apiSpotNews 2 ครั้งด้วยคนละ from/to ตอน component เพิ่งโหลด
      // แก้โดยรวม logic ให้ผ่านฟังก์ชันเดียว ที่คำนวณ "ย้อนหลัง 1 วัน" เสมอ
      // และกันเรียกซ้ำถ้าช่วงวันที่ที่คำนวณได้เหมือนครั้งล่าสุด
      this.fetchYesterdaySpotNews();
      // ✅ ช่วงวันที่ใหม่อาจไม่มีข้อมูล (items ว่าง) หรือ apiSpotNews (async) ยังโหลดไม่เสร็จ
      // ref="slider" จะไม่มี element ต้องเช็คก่อนเซ็ต scrollLeft
      const slider = this.$refs.slider;
      if (slider) slider.scrollLeft = 0; // เลื่อนซ้าย 300px
    },
  },
  data() {
    return {
      items: [],
      sliding: null,
      slide: 0,
      selectIndex: 0,
      load: false,
      lastRange: null, // ✅ เก็บช่วงวันที่ (from/to) ที่เรียก apiSpotNews ไปล่าสุด กันเรียกซ้ำด้วยวันเดิม
    };
  },
  methods: {
    formatCash(n) {
      if (n < 1e3) return n;
      if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
      if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
      if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
      if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
    },
    toPost(data, id, domain) {
      console.log("data", data.cluster, id);
      const routeData = this.$router.resolve({
        name: "SpotSocialPost",
        query: { id: id, cluster: data.cluster, domain: domain },
      });

      window.open(routeData.href, "_blank");
    },
    toggleExpand(index) {
      this.items[this.selectIndex].data[index].expanded = !this.items[
        this.selectIndex
      ].data[index].expanded;
    },
    getDay(dateString) {
      return new Date(dateString).getUTCDate(); // ได้ค่าเป็น 1-31
    },
    // ฟังก์ชันสำหรับแยก 'เดือน'
    getMonth(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", { month: "short" });
    },
    // ฟังก์ชันสำหรับแยก 'ปี'
    getYear(dateString) {
      const year = new Date(dateString).getUTCFullYear(); // ได้ปี เช่น 2024
      return year.toString(); // ตัดสองตัวท้าย เช่น "24"
    },
    scrollLeft() {
      const slider = this.$refs.slider;
      slider.scrollLeft -= 300; // เลื่อนซ้าย 300px
    },
    scrollRight() {
      const slider = this.$refs.slider;
      slider.scrollLeft += 300; // เลื่อนขวา 300px
    },
    onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd(slide) {
      this.sliding = false;
    },
    // ✅ คำนวณ "วันย้อนหลัง 1 วัน" เสมอ โดยอิงจากช่วงวันที่ที่เลือกในตัวกรอง (getEdateDm) ถ้ามี
    // ไม่มีก็ใช้วันปัจจุบันของเครื่อง เป็นจุดเดียวที่คำนวณวันที่ให้ mounted() และ watcher ใช้ร่วมกัน
    getYesterdayRange() {
      let base = this.getEdateDm ? moment(this.getEdateDm) : moment();
      let day = base.clone().subtract(1, "days").format().slice(0, 10);
      return { from: day, to: day };
    },
    // ✅ จุดเดียวที่เรียก apiSpotNews สำหรับ "ข้อมูลเมื่อวาน"
    // กันเรียกซ้ำถ้า from/to ที่คำนวณได้เหมือนกับครั้งล่าสุดที่เรียกไปแล้ว
    // (เดิม mounted() กับ watch getArrDate() ต่างคนต่างเรียก apiSpotNews คนละวันกัน ทำให้ยิงซ้ำ 2 ครั้ง)
    fetchYesterdaySpotNews() {
      const { from, to } = this.getYesterdayRange();
      if (
        this.lastRange &&
        this.lastRange.from === from &&
        this.lastRange.to === to
      ) {
        return; // ช่วงวันที่เดิม ไม่ต้องเรียกซ้ำ
      }
      this.lastRange = { from, to };
      this.apiSpotNews(from, to);
    },
    apiSpotNews(from, to) {
      this.load = true;
      var config = {
        method: "get",
        url: "https://api2.cognizata.com/api/v2/userposts/getHottopicslist",
        params: {
          domain: this.getClickDomainId,
          from: from,
          to: to,
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      this.axios(config)
        .then((response) => {
          // เพิ่ม expanded: false ให้กับทุก item ใน items
          this.items = response.data.map((cluster) => {
            return {
              ...cluster,
              data: cluster.data.map((item) => ({
                ...item,
                expanded: false, // เพิ่มค่า expanded
              })),
            };
          });
          this.load = false;

        })
        .catch((error) => {
          this.load = false;
          console.log(error);
        });
    },
  },
  mounted() {
    // ✅ ใช้ฟังก์ชันกลางเดียวกับ watcher getArrDate() เพื่อให้คำนวณ "เมื่อวาน" แบบเดียวกัน
    // และมี guard กันเรียกซ้ำในตัว
    this.fetchYesterdaySpotNews();
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
  width: 25%;
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