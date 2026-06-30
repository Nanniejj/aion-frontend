<template>
  <div class="timeline-wrapper">
    <div class="timeline" ref="timeline-wrapper">
      <template v-if="isDaily">

        <div v-if="dailyLoading" class="text-center my-3 daily-loading-box">
          <vue-element-loading :active="true" size="50"
            background-color="rgba(255,255,255,0)" color="#17a2b891" />
        </div>

        <div v-for="(day, idx) in items" :key="day.date || idx" class="timeline-item d-flex">
          <div class="timeline-dot">

            <!-- ✅ รอข้อมูลครบก่อนค่อยโชว์ทุกอย่าง -->
            <template v-if="day.items && day.items[0]">

              <!-- Sort: ไม่ใช่ engagement -->
              <span class="h4 date-label bold" v-if="sort !== 'engagement'">
                {{ formatDay(day.date) }} {{ formatMoth(day.date) }}
                <span class="h6"> {{ formatTime(day.date) }}</span>
                <div
                  class="h6 mt-1"
                  v-b-tooltip.hover
                  :title="day.items[0].engagement | numFormat"
                >
                  <i class="fas fa-chart-line"></i> {{ numFormat(day.items[0].engagement) }}
                </div>
              </span>

              <!-- Sort: engagement -->
              <span class="h4 date-label bold" v-else>
                {{ formatDay(day.date) }} {{ formatMoth(day.date) }}
                <span class="h6"> {{ formatTime(day.date) }}</span>
                <div
                  class="h6 mt-1"
                  v-b-tooltip.hover
                  :title="day.items[0].engagement | numFormat"
                >
                  <i class="fas fa-chart-line"></i> {{ numFormat(day.items[0].engagement) }}
                </div>
              </span>

              <!-- Avatar -->
              <span v-if="day.items[0].profile_image" class="story-ring">
                <b-avatar
                  size="57px"
                  :src="day.items[0].profile_image"
                  loading="lazy"
                ></b-avatar>
              </span>
              <span v-else>
                <b-avatar size="57px"></b-avatar>
              </span>

              <!-- Social icon -->
              <img v-if="day.items[0].source === 'twitter'"   :src="imgtw" class="social-img" />
              <img v-if="day.items[0].source === 'facebook'"  :src="imgfb" class="social-img" />
              <img v-if="day.items[0].source === 'pantip'"    :src="imgpt" class="social-img" />
              <img v-if="day.items[0].source === 'youtube'"   :src="imgyt" class="social-img" />
              <img v-if="day.items[0].source === 'news'"      :src="imgnw" class="social-img" />
              <img v-if="day.items[0].source === 'instagram'" :src="imgig" class="social-img" />
              <img v-if="day.items[0].source === 'blockdit'"  :src="imgbd" class="social-img" />
              <img v-if="day.items[0].source === 'tiktok'"    :src="imgtt" class="social-img" />
              <img v-if="day.items[0].source === 'threads'"   :src="imgtd" class="social-img" />

            </template>

            <!-- ⏳ Skeleton: รอข้อมูล -->
            <!-- <template v-else>
              <div class="skeleton-date"></div>
              <div class="skeleton-avatar"></div>
            </template> -->

            <span class="line"></span>
          </div>

          <!-- เนื้อหา รายวัน -->
          <div style="width: 89%;">
            <div v-if="day.items && day.items.length" class="position-relative">
              <div class="text-right">
                <b-spinner v-if="openLoadingMap[idx]" size="20" variant="info" style="width: 2rem; height: 2rem;" />
                <span class="shuffle-wrap" @click="handleToggle(idx, day)" v-b-tooltip.hover title="สลับโพสต์">
                  <i class="fa fa-shuffle" :style="{ opacity: openLoadingMap[idx] ? 0 : 1 }"></i>
                </span>
                <span class="ml-2 small">
                  <b>{{ day.countTotal | numFormat }}</b> โพสต์
                </span>
              </div>

              <CardTitle :post="day.items[0]" v-if="!isOpen(idx)" class="mx-2" />

              <CardPostSlider
                v-else
                :clusters="day.items"
                :title="`${formatThaiDayLabel(day.date)}`"
                @selectPost="post => replaceDayPost(idx, post)"
                :ymd="day.date"
                :initial-sort="dayInitialSort(day.date)"
                :has-more="day._hasMore"
                @requestLoadMore="payload => $emit('loadMoreDay', payload)"
                @requestChangeSort="payload => $emit('changeDaySort', payload)"
                :day-loading="dayLoadingMap && dayLoadingMap[day.date]"
              />
            </div>

            <div v-else-if="!dailyLoading" class="text-muted small mx-2">
              ไม่มีข้อมูล {{ formatDay(day.date) }} {{ formatMoth(day.date) }}
            </div>
          </div>
        </div>
      </template>

      <!-- โหมดปกติ (ตามโพสต์) -->
      <template v-else>
        <div class="text-right allpost">ทั้งหมด <b>{{ count || 0 | numFormat }}</b> โพสต์</div>
        <div v-for="(it, idx) in items" :key="it._id || idx" class="timeline-item d-flex">
          <div class="timeline-dot">
            <div class="date-label" v-if="sort !== 'engagement'">
              <div class="h4 bold">{{ formatDay(it.date) }} {{ formatMoth(it.date) }}</div>
              <div class="h6 d-block"><i class="fa fa-clock-o" aria-hidden="true"></i> {{ formatTime(it.date) }}</div>
                         <!-- <i class="fas fa-chart-line"></i> {{ numFormat(it.engagement) }} -->

            </div>
            <span class="h5 date-label bold" v-else v-b-tooltip.hover :title="it.engagement | numFormat">
              <i class="fas fa-chart-line"></i> {{ numFormat(it.engagement) }}
              <div class="h6 mt-1">{{ formatDay(it.date) }} {{ formatMoth(it.date) }} {{ formatTime(it.date) }}</div>
            </span>

            <span v-if="it.profile_image">
              <b-avatar size="57px" :src="it.profile_image" loading="lazy" class="imgpro"
                v-if="it.source !== 'blockdit'"></b-avatar>
              <b-avatar size="57px" :src="it.profile_image" loading="lazy" v-else></b-avatar>
            </span>
            <span v-else><b-avatar size="49px"></b-avatar></span>

            <img v-if="it.source === 'twitter'"   :src="imgtw" class="social-img" />
            <img v-if="it.source === 'facebook'"  :src="imgfb" class="social-img" />
            <img v-if="it.source === 'youtube'"   :src="imgyt" class="social-img" />
            <img v-if="it.source === 'news'"      :src="imgnw" class="social-img" />
            <img v-if="it.source === 'instagram'" :src="imgig" class="social-img" />
            <img v-if="it.source === 'blockdit'"  :src="imgbd" class="social-img" />
            <img v-if="it.source === 'tiktok'"    :src="imgtt" class="social-img" />
            <img v-if="it.source === 'threads'"   :src="imgtd" class="social-img" />
            <template v-if="it.source === 'pantip'">
              <img v-if="it.platform === 'dek-d'"      src="@/assets/dekd.png"    class="social-img" />
              <img v-else-if="it.platform === 'lemon8'" src="@/assets/lemon8.png" class="social-img" />
              <img v-else-if="it.platform === 'reddit'" src="@/assets/reddit.png" class="social-img" />
              <img v-else                                src="@/assets/Pantip.png" class="social-img" />
            </template>
            <span class="line"></span>
          </div>
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
import CardTitle from "./CardTitle.vue";

// ✅ Sort ที่ใช้เป็น default ตอนกด "สลับโพสต์" เปิด slider ของวันนั้นเป็นครั้งแรก
const DEFAULT_DAY_OPEN_SORT = "engagement";

export default {
  name: "TimelinePosts",
  components: { CardPostSlider, CardTitle },
  props: {
    dayLoading:   { type: Boolean, default: false },
    dailyLoading: { type: Boolean, default: false },
    items:        { type: Array,   default: () => [] },
    count:        { type: Number,  default: 0 },
    mode:         { type: String,  default: "posts" },
    sort:         { type: String,  default: "" },
    // ✅ ใหม่: รับ map ของ sort ต่อวัน (date -> sort_by) จาก parent
    // ใช้กำหนด initial-sort ที่ถูกต้องให้ CardPostSlider ของแต่ละวัน
    daySortMap:   { type: Object,  default: () => ({}) },
  },
  watch: {
    items(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.openMap        = {};
        this.openLoadingMap = {};
      }
    },
  },
  data() {
    return {
      openMap:        {},
      openLoadingMap: {},
      show:  false,
      imgtw: require("@/assets/Twitter.png"),
      imgfb: require("@/assets/Facebook.png"),
      imgpt: require("@/assets/board.png"),
      imgig: require("@/assets/Instagram.png"),
      imgnw: require("@/assets/News.png"),
      imgyt: require("@/assets/Youtube.png"),
      imgbd: require("@/assets/Blockdit.png"),
      imgtt: require("@/assets/Tiktok.png"),
      imgtd: require("@/assets/Threads.png"),
      user:  require("@/assets/user.svg"),
    };
  },
  computed: {
    isDaily() {
      return Array.isArray(this.items?.[0]?.items) && this.mode === "daily";
    },
  },
  methods: {
    numFormat(n) {
      if (!n && n !== 0) return 0;
      if (n < 1e3)  return n;
      if (n < 1e6)  return (n / 1e3).toFixed(1) + "K";
      if (n < 1e9)  return (n / 1e6).toFixed(1) + "M";
      if (n < 1e12) return (n / 1e9).toFixed(1) + "B";
      return (n / 1e12).toFixed(1) + "T";
    },
    // ✅ ใหม่: ใช้ sort ที่ parent บอกมาเป็นรายวัน ถ้าไม่มีให้ fallback เป็น
    // DEFAULT_DAY_OPEN_SORT (engagement) เพื่อให้ปุ่ม sort ใน CardPostSlider
    // highlight ตรงกับสิ่งที่ถูกเรียกจริง
    dayInitialSort(ymd) {
      return this.daySortMap?.[ymd] || DEFAULT_DAY_OPEN_SORT;
    },
    replaceDayPost(idx, post) {
      const day = this.items[idx];
      if (!day || !Array.isArray(day.items) || !day.items.length) return;
      const keyOf = (p) => p && (p._id || `${p.source}:${p.url_post}`);
      const list   = [...day.items];
      const selKey = keyOf(post);
      const found  = list.findIndex(p => keyOf(p) === selKey);
      if (found === 0) { this.toggle(idx); return; }
      if (found > 0)   { list.splice(found, 1); list.unshift(post); }
      else             { list.unshift(post); }
      this.$set(this.items[idx], "items", list);
      this.toggle(idx);
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
    // ✅ แก้ที่นี่: ตอนเปิด slider ครั้งแรกของวันที่ข้อมูลพร้อมอยู่แล้ว
    // (ไม่ต้องเรียก openDay) ให้สั่ง parent เปลี่ยน sort เป็น engagement ด้วย
    // ส่วนกรณีที่ต้องโหลดเพิ่ม (openDay) parent (Timeline.vue) จะ set
    // ค่า default เป็น engagement ให้เองอยู่แล้วใน handleOpenDay()
    handleToggle(idx, day) {
      if (this.isOpen(idx)) { this.toggle(idx); return; }

      if (day.items.length > 1 || !day._hasMore) {
        this.toggle(idx);
        this.$emit("changeDaySort", { date: day.date, sort_by: DEFAULT_DAY_OPEN_SORT });
        return;
      }

      this.$set(this.openLoadingMap, idx, true);
      this.$emit("openDay", { date: day.date, idx });
    },
    openDayDone(idx) {
      this.$set(this.openLoadingMap, idx, false);
      this.$set(this.openMap, idx, true);
    },
    formatDay(date) {
      const dates = this.isDaily ? moment(date) : moment(date).subtract(7, "hours");
      return moment(dates).format("ll").split(" ")[0];
    },
    formatMoth(date) {
      return moment(date).format("ll").split(" ")[1];
    },
    formatTime(date) {
      return date ? String(date).slice(11, 16) : "";
    },
  },
};
</script>

<style scoped>
.story-ring {
  display: inline-flex;
  padding: 3px;
  z-index: 99;
  border-radius: 50%;
  background: conic-gradient(#feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5);
}
.story-ring .b-avatar {
  border: 2px solid white;
  border-radius: 50%;
}
.date-label { width: 102px; }
.social-img {
  width: 29px;
  margin-top: -27px;
  margin-left: 35px;
  height: 29px;
  z-index: 99;
}
.timeline-wrapper { padding: 8px 8px 16px; }
.timeline { position: relative; margin-left: 10px; }
.timeline-item { position: relative; }
.timeline-dot {
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 8px;
}
.timeline-dot .line {
  flex: 1;
  width: 2px;
  background: #e9ecef;
  margin-top: 6px;
}
.b-avatar.imgpro.badge-secondary { width: 55px; height: 55px; }
h5 { font-weight: 600; }
.shuffle-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: #17a2b8;
}
/* Skeleton loader */
@keyframes shimmer {
  0%   { background-position: -200px 0; }
  100% { background-position:  200px 0; }
}
.skeleton-date,
.skeleton-avatar {
  background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);
  background-size: 400px 100%;
  animation: shimmer 1.2s infinite;
  border-radius: 6px;
}
.skeleton-date   { width: 90px; height: 52px; margin-bottom: 8px; }
.skeleton-avatar { width: 57px; height: 57px; border-radius: 50%; }

@media only screen and (min-width: 0px) and (max-width: 800px) {
  .allpost { font-size: 13px; }
  .timeline-dot { width: 30px; margin-right: 3px; }
  span.h4.date-label.bold > div { font-size: 12px; }
  .date-label { font-size: 14px; z-index: 99; }
  .timeline-dot > div > div.h4.bold { font-size: 15px; width: 100px; margin-bottom: 1px; }
  div.timeline-dot > span.h5.date-label.bold > div { font-size: 12px; }
  div.timeline-dot > div > div.h6.d-block { font-size: 12px !important; }
  .timeline { margin-left: 0px; }
  .b-avatar.imgpro.badge-secondary { width: 47px !important; height: 47px !important; }
}
</style>