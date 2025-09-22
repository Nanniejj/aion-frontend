<template>
  <div class="timeline-wrapper">
    <div class="timeline">
      <div v-for="(it, idx) in items" :key="it._id || idx" class="timeline-item d-flex">
        <!-- จุดวงกลมบนเส้น -->
        <div class="timeline-dot">
<!-- {{ it.date }} -->
          <span class="h4">
            {{ formatDay(it.date) }}    {{ formatMoth(it.date) }} 
            <!-- {{ formatTime(it.date) }} 
            {{ formatYear(it.date) }} -->
          </span>
          <span v-if="it.profile_image">
            <b-avatar @error="user" size="47px" :src="it.profile_image" loading="lazy" class="imgpro"
              v-if="it.source != 'blockdit'"></b-avatar>
            <b-avatar @error="user" size="47px" :src="it.profile_image" loading="lazy" v-else></b-avatar>
          </span>
          <span v-else> <b-avatar size="45px"></b-avatar></span>

          <img v-if="it.source === 'twitter'" :src="imgtw" class="social-img" />
          <img v-if="it.source === 'facebook'" :src="imgfb" class="social-img" />
          <img v-if="it.source === 'pantip'" :src="imgpt" class="social-img" />
          <img v-if="it.source === 'youtube'" :src="imgyt" class="social-img" />
          <img v-if="it.source === 'news'" :src="imgnw" class="social-img" />
          <img v-if="it.source === 'instagram'" :src="imgig" class="social-img" />
          <img v-if="it.source === 'blockdit'" :src="imgbd" class="social-img" />
          <img v-if="it.source === 'tiktok'" :src="imgtt" class="social-img" />
          <img v-if="it.source === 'threads'" :src="imgtd" class="social-img" />
          <div class="ml-auto text-muted small d-flex">
            <!-- {{ formatDate(it.date) }} -->
          </div>
          <span class="line"></span>
        </div>

        <!-- เนื้อหา -->
        <b-card class="flex-grow-1 shadow-sm mb-4 timeline-card">
          <div class="d-flex align-items-start">
            <!-- <div class="ml-auto text-muted small">
              {{ formatDate(it.date) }}
            </div> -->
            <!-- <b-img :src="it.profile_image" alt="profile" fluid rounded="circle" class="mr-3 profile-img" /> -->

            <div class="w-100">
              <div class="text-left h5"> {{ it.date }} </div>
              <div class="d-flex align-items-center flex-wrap">
                <h5 class="mb-0 mr-2">{{ it.account_name || '—' }}</h5>
                <b-badge variant="info" class="mr-2 text-uppercase">
                  {{ it.source || 'source' }}
                </b-badge>
                <b-badge :variant="sentimentBadge(it.sentiment)">
                  {{ sentimentText(it.sentiment) }}
                </b-badge>
                <div class="ml-auto text-muted small">
                  {{ formatDate(it.date)}}
                </div>
              </div>

              <p class="mt-2 mb-2 text-body">
                {{ it.full_text }}
              </p>

              <div v-if="it.photo" class="mb-2">
                <b-img :src="it.photo" alt="photo" fluid class="rounded timeline-photo" />
              </div>

              <div class="d-flex align-items-center mt-1">
                <a v-if="it.url_post" :href="it.url_post" target="_blank" rel="noopener" class="mr-3">
                  เปิดลิงก์ต้นทาง
                </a>

                <small class="text-muted">UID: {{ it.uid }}</small>
              </div>
            </div>
          </div>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import 'moment/locale/th'
// import 'moment-timezone'   // ต้องมีถ้าจะใช้ .tz()
export default {
  name: "TimelinePosts",
  props: {
    // ส่ง array เข้ามาได้; ถ้าไม่ส่งจะใช้ sampleData ด้านล่าง
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      sampleData: [
        {
          _id: "68a53c9436c9caad58c66626",
          uid: "https://www.thebetter.co.th/news/news/34343",
          source: "news",
          account_name: "thebetter",
          date: "2025-08-20T00:00:00.000Z",
          full_text:
            "พลเอกประวิตร วงษ์สุวรรณ ... ที่ โรงพยาบาลพระมงกุฎฯ ...",
          photos: [
            "https://www.thebetter.co.th/upload/news/thumb/34343.jpg?t=1755659409",
          ],
          post_type: "post",
          profile_image:
            "https://www.thebetter.co.th/theme/img/logo.svg",
          sentiment: 0,
          url_post:
            "https://www.thebetter.co.th/news/news/34343",
        },
        {
          _id: "68a546cf36c9caad58caf69c",
          uid: "https://ch3plus.com/news/political/morning/446099",
          source: "news",
          account_name: "ch3plus",
          date: "2025-08-20T00:00:00.000Z",
          full_text:
            "วันนี้ 20 สิงหาคม เวลา 08.30 น. พลเอกประวิตร ... ณ โรงพยาบาลพระมงกุฎฯ ...",
          photos: [
            "https://assets.ch3plus.com/newsch/2025/08/273953639143.jpg",
          ],
          post_type: "post",
          profile_image:
            "https://ch3plus.com/static/images/ch3plusnews2021/logo/logo-ch3plus_news.svg",
          sentiment: 0,
          url_post:
            "https://ch3plus.com/news/political/morning/446099",
        },
        {
          _id: "68a56b9736c9caad58db705f",
          source: "news",
          uid: "https://thestatestimes.com/post/2025082006",
          account_name: "thestatestimes",
          date: "2025-08-20T00:00:00.000Z",
          full_text:
            "(20 ส.ค. 68) เวลา 8.30 น พลเอกประวิตร ... โรงพยาบาลพระมงกุฎฯ ...",
          photos: [
            "https://thestatestimes.com/storage/post_display/20250820112516kXdPh.jpg",
          ],
          post_type: "post",
          profile_image:
            "https://thestatestimes.com/storage/author/20210331115717bL915.jpg",
          sentiment: 0,
          url_post:
            "https://thestatestimes.com/post/2025082006",
        },
      ],
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

    formatDate(date) {
      let dates = moment(date).subtract(7, 'hours')
      let date2 = moment(dates).format('ll');
      return date2
    },
    formatDay(date) {
      let dates = moment(date).subtract(7, 'hours')
      let date2 = moment(dates).format('ll');
      return date2.split(" ")[0]
    },
    formatMoth(date) {
      let dates = moment(date).subtract(7, 'hours')
      let date2 = moment(dates).format('ll');
      return date2.split(" ")[1]
    },
    formatYear(date) {
      return date.slice(0, 4)
    },
    formatTime(date) {
      return date.slice(11, 16)
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
.social-img {
  width: 29px;
  margin-top: -27px;
  margin-left: 35px;
  height: 29px;
  z-index: 9999;
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
  width: 28px;
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
  border: 0;
  border-left: 4px solid #0d6efd;
  border-radius: 12px;
  padding: 12px 14px;
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
</style>
