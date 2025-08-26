<template>
  <div class="timeline-wrapper">
    <div class="timeline">
      <!-- {{ items }} -->
      <!-- โหมดรายวัน -->
      <!-- {{ isDaily }} {{ mode }} -->
      <template v-if="isDaily">
        <div v-for="(day, idx) in items" :key="day.date || idx" class="timeline-item d-flex">
          <div class="timeline-dot">
            <!-- {{ day.date }} -->
            <span class="h4 date-label bold" v-if="sort !== 'engagement'">
              {{ formatDay(day.date) }} {{ formatMoth(day.date) }}
              <span class="h6"> {{ formatTime(day.date) }}</span>
            </span>
            <span class="h4 date-label bold" v-else-if="day.items && day.items.length">
              <span class="h4 date-label bold">

                {{ formatDay(day.date) }} {{ formatMoth(day.date) }}
                <span class="h6"> {{ formatTime(day.date) }}</span>
              </span>
              <span class="h6">{{ day.items[0].engagement | numFormat }}</span>

              <!-- <div class="h6"
                >{{ formatDate(day.date) }}</div
              > -->
            </span>

            <!-- ใช้รูปโปรไฟล์/ไอคอนจากโพสต์แรกของวัน ถ้ามี -->
            <template v-if="day.items && day.items.length">
              <!-- <span v-if="day.items[0].photos&&day.items[0].photos[0]" >
                <b-img :src="day.items[0].photos[0]"></b-img>
               </span> -->
              <span v-if="day.items[0].profile_image" class="story-ring ">
                <b-avatar size="57px" :src="day.items[0].profile_image" loading="lazy"
                  v-if="day.items[0].source != 'blockdit'"></b-avatar>
                <b-avatar size="57px" :src="day.items[0].profile_image" loading="lazy" v-else></b-avatar>
              </span>
              <span v-else>
                <b-avatar size="45px"></b-avatar>
              </span>

              <img v-if="day.items[0].source === 'twitter'" :src="imgtw" class="social-img" />
              <img v-if="day.items[0].source === 'facebook'" :src="imgfb" class="social-img" />
              <img v-if="day.items[0].source === 'pantip'" :src="imgpt" class="social-img" />
              <img v-if="day.items[0].source === 'youtube'" :src="imgyt" class="social-img" />
              <img v-if="day.items[0].source === 'news'" :src="imgnw" class="social-img" />
              <img v-if="day.items[0].source === 'instagram'" :src="imgig" class="social-img" />
              <img v-if="day.items[0].source === 'blockdit'" :src="imgbd" class="social-img" />
              <img v-if="day.items[0].source === 'tiktok'" :src="imgtt" class="social-img" />
              <img v-if="day.items[0].source === 'threads'" :src="imgtd" class="social-img" />
            </template>

            <span class="line"></span>
          </div>

          <!-- เนื้อหา รายวัน -->
          <div style="width: 89%;">
            <div v-if="day.items && day.items.length" class="position-relative">
              <div class="text-right">
               <i class="fa fa-shuffle" @click="toggle(idx)" style="cursor: pointer;color:#17a2b8;"></i>
              </div>

              <!-- โพสต์แรกของวัน -->
              <CardTitle :post="day.items[0]" v-if="!isOpen(idx)" class="mx-2" />

              <!-- รายการ 10 โพสต์ของวันนั้น -->
              <CardPostSlider v-else :clusters="day.items" :title="`${formatThaiDayLabel(day.date)}`"
                @selectPost="post => replaceDayPost(idx, post)" :ymd="day.date" :initial-sort="sort"
                :has-more="day._hasMore" @requestLoadMore="payload => $emit('loadMoreDay', payload)"
                @requestChangeSort="payload => $emit('changeDaySort', payload)"  :day-loading="dayLoadingMap && dayLoadingMap[day.date]"  />
            </div>

            <div v-else class="text-muted small mx-2">ไม่มีข้อมูลในวันนี้</div>
          </div>
        </div>
      </template>

      <!-- โหมดปกติ (ตามโพสต์) -->
      <template v-else>
        <div v-for="(it, idx) in items" :key="it._id || idx" class="timeline-item d-flex">
          <!-- {{ items }} -->
          <div class="timeline-dot">
            <span class="h4 date-label bold" v-if="sort !== 'engagement'">
              {{ formatDay(it.date) }} {{ formatMoth(it.date) }}
              <span class="h6"> {{ formatTime(it.date) }}</span>
            </span>
            <span class="h4 date-label bold" v-else>
              {{ it.engagement | numFormat }}

              <div class="h6">{{ formatDate(it.date) }}</div>
            </span>

            <span v-if="it.profile_image">
              <b-avatar size="47px" :src="it.profile_image" loading="lazy" class="imgpro"
                v-if="it.source != 'blockdit'"></b-avatar>
              <b-avatar size="47px" :src="it.profile_image" loading="lazy" v-else></b-avatar>
            </span>
            <span v-else><b-avatar size="45px"></b-avatar></span>

            <img v-if="it.source === 'twitter'" :src="imgtw" class="social-img" />
            <img v-if="it.source === 'facebook'" :src="imgfb" class="social-img" />
            <img v-if="it.source === 'pantip'" :src="imgpt" class="social-img" />
            <img v-if="it.source === 'youtube'" :src="imgyt" class="social-img" />
            <img v-if="it.source === 'news'" :src="imgnw" class="social-img" />
            <img v-if="it.source === 'instagram'" :src="imgig" class="social-img" />
            <img v-if="it.source === 'blockdit'" :src="imgbd" class="social-img" />
            <img v-if="it.source === 'tiktok'" :src="imgtt" class="social-img" />
            <img v-if="it.source === 'threads'" :src="imgtd" class="social-img" />
            <span class="line"></span>
          </div>

          <!-- การ์ดเดี่ยวตามโพสต์ -->
          <div class="flex-grow-1">
            <CardTitle :post="it" :domain="currentDomain" class="mx-2" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>


<script>
import moment from "moment";
import "moment/locale/th";
import CardPostSlider from "./CardPostSlider";
import CardPost from "./CardPost.vue";
import CardTitle from "./CardTitle.vue";
// import 'moment-timezone'   // ต้องมีถ้าจะใช้ .tz()
export default {
  name: "TimelinePosts",
  components: {
    CardPostSlider,
    CardTitle,
  },
  props: {
    dayLoading: { type: Boolean, default: false },
    // ส่ง array เข้ามาได้; ถ้าไม่ส่งจะใช้ sampleData ด้านล่าง
    items: {
      type: Array,
      default: () => [],
    },
    mode: { type: String, default: "posts" }, // 'posts' | 'daily'
    sort: { type: String, default: "" },
  },
  data() {
    return {
      openMap: {},
      show: false,
      imgtw: require("@/assets/Twitter.png"),
      imgfb: require("@/assets/Facebook.png"),
      imgpt: require("@/assets/board.png"),
      imgig: require("@/assets/Instagram.png"),
      imgnw: require("@/assets/News.png"),
      imgyt: require("@/assets/Youtube.png"),
      imgbd: require("@/assets/Blockdit.png"),
      imgtt: require("@/assets/Tiktok.png"),
      imgtd: require("@/assets/Threads.png"),
      user: require("@/assets/user.svg"),
    };
  },
  computed: {
    isDaily() {
      // ถ้ารายการแรกมีฟิลด์ items แปลว่ามาแบบ grouped by day
      return Array.isArray(this.items?.[0]?.items) && this.mode === "daily";
    },
    // mappedItems() {
    //   const src = (this.items && this.items.length) ? this.items : this.sampleData;
    //   return src
    //     .map((x) => ({
    //       _id: x._id,
    //       uid: x.uid,
    //       source: x.source,
    //       account_name: x.account_name,
    //       date: x.date,
    //       full_text: x.full_text,
    //       photo: Array.isArray(x.photos) && x.photos.length ? x.photos[0] : null,
    //       post_type: x.post_type,
    //       profile_image: x.profile_image,
    //       sentiment: typeof x.sentiment === "number" ? x.sentiment : null,
    //       url_post: x.url_post,
    //     }))
    //     .sort((a, b) => new Date(b.date) - new Date(a.date)); // ใหม่ → เก่า
    // },
  },
  methods: {
    replaceDayPost(idx, post) {
      // อัปเดตโพสต์แรกของวันให้เป็นตัวที่เลือก
      if (this.items[idx]?.items?.length) {
        this.$set(this.items[idx].items, 0, post);
        this.toggle(idx); // ปิด slider กลับไปโชว์ CardTitle
      }
    },
    formatThaiDayLabel(ymd) {
      return moment(ymd, "YYYY-MM-DD").format("ll");
    },
    toggle(idx) {
      this.$set(this.openMap, idx, !this.openMap[idx]);
    },
    isOpen(idx) {
      return !!this.openMap[idx];
    },
    formatDate(date) {
      let dates = moment(date).subtract(7, "hours");
      let date2 = moment(dates).format("ll");
      return date2;
    },
    formatDay(date) {
      let dates = this.isDaily
        ? moment(date)
        : moment(date).subtract(7, "hours");
      let date2 = moment(dates).format("ll");
      return date2.split(" ")[0];
    },
    formatMoth(date) {
      let dates = moment(date).subtract(7, "hours");
      let date2 = moment(dates).format("ll");
      return date2.split(" ")[1];
    },
    formatYear(date) {
      return date.slice(0, 4);
    },
    formatTime(date) {
      return date.slice(11, 16);
    },

    sentimentText(val) {
      if (val === 1) return "Positive";
      if (val === 0) return "Neutral";
      if (val === -1) return "Negative";
      return "—";
    },
    sentimentBadge(val) {
      if (val === 1) return "success";
      if (val === 0) return "secondary";
      if (val === -1) return "danger";
      return "dark";
    },
  },
};
</script>

<style scoped>
.story-ring {
  display: inline-flex;
  padding: 3px;
  z-index: 99;
  /* ระยะห่างวงแหวน */
  border-radius: 50%;
  background: conic-gradient(#feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5);
  /* ไล่สีแบบ IG */
}

.story-ring .b-avatar {
  border: 2px solid white;
  /* ให้รูปไม่ติดกับวงแหวน */
  border-radius: 50%;
}

.date-label {
  width: 102px;
}

.social-img {
  width: 29px;
  margin-top: -27px;
  margin-left: 35px;
  height: 29px;
  z-index: 99;
}

/* wrapper ให้มี padding ข้าง ๆ */
.timeline-wrapper {
  padding: 8px 8px 16px;
}

/* คอลัมน์เส้นไทม์ไลน์ */
.timeline {
  position: relative;
  margin-left: 10px;
  /* เผื่อระยะให้ dot */
}

/* แต่ละรายการ */
.timeline-item {
  position: relative;
}

/* วงจุด + เส้นแนวตั้ง */
.timeline-dot {
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 8px;
}

.timeline-dot .dot {
  width: 12px;
  height: 12px;
  background: #0d6efd;
  border-radius: 50%;
  display: inline-block;
  z-index: 2;
  box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.15);
}

.timeline-dot .line {
  flex: 1;
  width: 2px;
  background: #e9ecef;
  margin-top: 6px;
}

/* การ์ดของโพสต์ */
.timeline-card {
  width: 60%;
  border: 0;
  border-left: 4px solid #0d6efd;
  border-radius: 12px;
  padding: 12px 14px;
  height: 250px;
}

/* โปรไฟล์เป็นวงกลมขนาดพอดี */
.profile-img {
  width: 44px;
  height: 44px;
}

/* รูปคอนเทนท์ใหญ่ */
.timeline-photo {
  max-height: 260px;
  object-fit: cover;
}

/* ปรับระยะเล็กน้อย */
h5 {
  font-weight: 600;
}
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .timeline-dot{
    width: 30px;
  }
  .date-label{
    font-size: 17px;
    width: 60px;
  }
  .timeline{
    margin-left: 0px;
  }
  .b-avatar.imgpro.badge-secondary{
    width: 43px !important;
    height: 43px !important;
  }

}
</style>
