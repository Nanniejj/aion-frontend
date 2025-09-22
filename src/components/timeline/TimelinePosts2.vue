<template>
  <div class="timeline-wrapper" >
<!-- <SnapshotButton
      :getTargetEl="() => $refs['timeline-wrapper']"
      filenamePrefix="timeline"
      format="png"             
      :scale="2"                
      :useCORS="true"
      @start="onStart"
      @done="onDone"
      @error="onError"
    >
      แคป & ดาวน์โหลด
    </SnapshotButton> -->
    <div class="timeline" ref="timeline-wrapper">
      <!-- {{ items }} -->
      <!-- โหมดรายวัน -->
      <!-- {{ isDaily }} {{ mode }} -->
      <template v-if="isDaily">
      
        <div v-for="(day, idx) in items" :key="day.date || idx" class="timeline-item d-flex">
            <!-- {{ day.date }} -->
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
              <div class="h6 mt-1" v-b-tooltip.hover :title="day.items[0].engagement | numFormat"> <i
                  class="fas fa-chart-line"></i> {{ numFormat(day.items[0].engagement) }}</div>

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
                <b-avatar size="57px"></b-avatar>
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
                <i class="fa fa-shuffle" @click="toggle(idx)" style="cursor: pointer;color:#17a2b8;" v-b-tooltip.hover
                  title="สลับโพสต์"></i>
                <span class="ml-2 small ">
                  <!-- {{ day.countShown }} /  -->
                 <b> {{ day.countTotal | numFormat }}</b> โพสต์
                  <!-- <span v-if="day._hasMore">(+)</span> -->
                </span>
                <!-- <span class="ml-2 small text-muted">
                  {{ count }} โพสต์
                </span> -->
              </div>

              <!-- โพสต์แรกของวัน -->
              <CardTitle :post="day.items[0]" v-if="!isOpen(idx)" class="mx-2" />

              <!-- รายการ 10 โพสต์ของวันนั้น -->
              <CardPostSlider v-else :clusters="day.items" :title="`${formatThaiDayLabel(day.date)}`"
                @selectPost="post => replaceDayPost(idx, post)" :ymd="day.date" :initial-sort="sort"
                :has-more="day._hasMore" @requestLoadMore="payload => $emit('loadMoreDay', payload)"
                @requestChangeSort="payload => $emit('changeDaySort', payload)"
                :day-loading="dayLoadingMap && dayLoadingMap[day.date]" />
            </div>

            <div v-else class="text-muted small mx-2">ไม่มีข้อมูลในวันนี้</div>
          </div>
        </div>
      </template>

      <!-- โหมดปกติ (ตามโพสต์) -->
      <template v-else>
        <div class="text-right allpost"> ทั้งหมด <b>{{ count|| 0 | numFormat }} </b>  โพสต์</div>
        <div v-for="(it, idx) in items" :key="it._id || idx" class="timeline-item d-flex">
          <!-- {{ items }} -->
          <div class="timeline-dot">
            <div class=" date-label" v-if="sort !== 'engagement'">
              <div class="h4  bold "> {{ formatDay(it.date) }} {{ formatMoth(it.date) }}</div>

              <div class="h6 d-block"> <i class="fa fa-clock-o" aria-hidden="true"></i> {{ formatTime(it.date) }}</div>
            </div>
            <span class="h5 date-label bold" v-else v-b-tooltip.hover :title="it.engagement | numFormat">
              <i class="fas fa-chart-line"></i> {{ numFormat(it.engagement) }}

              <div class="h6 mt-1"> {{ formatDay(it.date) }} {{ formatMoth(it.date) }} {{ formatTime(it.date) }} </div>
            </span>

            <span v-if="it.profile_image">
              <b-avatar size="57px" :src="it.profile_image" loading="lazy" class="imgpro"
                v-if="it.source != 'blockdit'"></b-avatar>
              <b-avatar size="57px" :src="it.profile_image" loading="lazy" v-else></b-avatar>
            </span>
            <span v-else><b-avatar size="49px"></b-avatar></span>

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
            <CardTitle :post="it" class="mx-2" />
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
import SnapshotButton  from './SnapshotButton.vue'

// import 'moment-timezone'   // ต้องมีถ้าจะใช้ .tz()
export default {
  name: "TimelinePosts",
  components: {
    CardPostSlider,
    CardTitle,
    SnapshotButton
  },
  props: {
    dayLoading: { type: Boolean, default: false },
    // ส่ง array เข้ามาได้; ถ้าไม่ส่งจะใช้ sampleData ด้านล่าง
    items: {
      type: Array,
      default: () => [],
    },
    count: { type: Number, default: 0 },
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
    baseMoment(date) {
    // ถ้าในโหมด daily ไม่ต้องปรับเวลา (ใช้วันที่ล้วน)
    // ถ้าโหมดโพสต์ ปรับตามเดิมที่คุณต้องการ (-7 ชั่วโมง) หรือเปลี่ยนเป็น .utc().local() ก็ได้
    return this.isDaily ? moment(date) : moment(date).subtract(7, 'hours');
    // ตัวเลือกที่แม่นกว่า ถ้าแหล่งข้อมูลเป็น UTC เสมอ:
    // return this.isDaily ? moment.utc(date).local() : moment.utc(date).local();
  },
    numFormat(n) {
      if (!n) return 0;
      if (n < 1e3) return n;
      if (n < 1e6) return (n / 1e3).toFixed(1) + "K";
      if (n < 1e9) return (n / 1e6).toFixed(1) + "M";
      if (n < 1e12) return (n / 1e9).toFixed(1) + "B";
      return (n / 1e12).toFixed(1) + "T";
    },
    replaceDayPost(idx, post) {
      const day = this.items[idx];
      if (!day || !Array.isArray(day.items) || !day.items.length) return;

      const keyOf = (p) => (p && (p._id || `${p.source}:${p.url_post}`));
      const list = [...day.items];

      const selKey = keyOf(post);
      const found = list.findIndex(p => keyOf(p) === selKey);

      if (found === 0) {
        // เลือกตัวที่อยู่หัวอยู่แล้ว
        this.toggle(idx);
        return;
      }

      if (found > 0) {
        // มีในลิสต์อยู่แล้ว -> ย้ายขึ้นหัว
        list.splice(found, 1);
        list.unshift(post);
      } else {
        // ไม่มีในลิสต์ -> ใส่ขึ้นหัว
        list.unshift(post);
      }

      this.$set(this.items[idx], 'items', list);
      this.toggle(idx); // ปิด slider กลับไปโชว์ CardTitle
    }
    ,
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
      let dates = moment(date)
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
.b-avatar.imgpro.badge-secondary {
  width: 55px;
  height: 55px;
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
 .allpost{
  font-size: 13px;
 }
  .timeline-dot {
    width: 30px;
    margin-right: 3px;
  }

  span.h4.date-label.bold>div {
    font-size: 12px;
  }

  .date-label {
    font-size: 14px;
    z-index: 99;
  }

  .timeline-dot>div>div.h4.bold {
    font-size: 15px;
    width: 100px;
    margin-bottom: 1px;
  }

  div.timeline-dot>span.h5.date-label.bold>div {
    font-size: 12px;
  }

  div.timeline-dot>div>div.h6.d-block {
    font-size: 12px !important;
  }

  .timeline {
    margin-left: 0px;
  }

  .b-avatar.imgpro.badge-secondary {
    width: 47px !important;
    height: 47px !important;
  }

}
</style>
