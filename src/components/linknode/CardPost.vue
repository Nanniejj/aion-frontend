<template>
  <b-card
    img-alt="Image"
    img-top
    class="box-spotnews black slider-item mx-2 p-1 position-relative"
    v-if="post"
  >
  <!-- {{ post }} -->
    <div class="position-relative">
      <b-card-img
        cover
        :src="post.photos[0]"
        v-if="post.photos && post.photos.length"
        style="height:200px;"
      />
      <div
        v-else
        class="h5 text-center"
        style="height:200px;background-color:rgb(237 231 221);display:flex;justify-content:center;align-items:center;flex-direction:column;"
      >
        <i class="fa fa-newspaper-o fa-2x"></i>
        {{ domain || post.source || "ไม่ทราบแหล่งที่มา" }}
      </div>

      <div class="bold h6 position-absolute mt-1 text-right" style="top:-3px;right:1px;">
        <span class="d-inline-block box-link">
          <a :href="post.url_post" class="fa fa-external-link" target="_blank"><span> Link </span></a>
        </span>
      </div>

      <div class="bold h6 position-absolute mt-1 text-right" style="bottom:-6px;left:1px;">
        <span class="d-inline-block box-link" @click="$emit('goPost', { post, type:'posts' })">
          <i class="far fa-paper-plane"></i> <span class="bold">1</span> Post
        </span>
        <span class="d-inline-block box-link" @click="$emit('goPost', { post, type:'engages' })">
          📈 <span class="bold">{{ post.engagement | numFormat }} Engages</span>
        </span>
        <span class="d-inline-block box-link">
          👍 <span class="bold">{{ post.likes_count | numFormat }} Likes</span>
        </span>
      </div>

      <div
        class="position-absolute pl-1 pt-1 pb-1"
        style="bottom:0;right:0;background-color:white;border-top-left-radius:50%;border-bottom-left-radius:50%;"
      >
        <b-avatar variant="success" icon="emoji-smile" v-if="sentimentString === 'positive'" />
        <b-avatar variant="primary" icon="emoji-neutral" v-if="sentimentString === 'neutral'" />
        <b-avatar variant="danger" icon="emoji-frown" v-if="sentimentString === 'negative'" />
      </div>
    </div>

    <div class="my-2 py-3" style="height:135px;overflow-y:auto;">
      <ReadMoreBox :item="{ title: post.full_text }" />
    </div>

    <div class="text-left small d-flex align-items-center mt-2">
      <b-avatar size="32" :src="post.profile_image" class="mr-2" />
      <span>{{ post.account_name }}</span>
    </div>

    <div class="bold h6 position-absolute" style="bottom:15px;left:50%;transform:translateX(-50%);">
      <b-avatar variant="primary" style="background-color:#eee !important;color:#595959">
        <b>{{ index + 1 }}</b>
      </b-avatar>
    </div>
  </b-card>
</template>

<script>
import ReadMoreBox from "./ReadMore.vue";

export default {
  name: "CardPost",
  components: { ReadMoreBox },
  props: {
    post: {
      type: Object,
      default: () => ({
        full_text: "ไม่มีข้อมูล",
        engagement: 0,
        likes_count: 0,
        photos: [],
        sentiment: 0,
        url_post: "#",
        account_name: "ไม่ระบุ",
        profile_image: "",
        source: "unknown",
      }),
    },
    index: { type: Number, default: 0 },
    domain: { type: String, default: "" },
  },
  computed: {
    sentimentString() {
      if (this.post.sentiment === -1) return "negative";
      if (this.post.sentiment === 0) return "neutral";
      if (this.post.sentiment === 1) return "positive";
      return "neutral";
    },
  },
  filters: {
    numFormat(n) {
      if (!n) return 0;
      if (n < 1e3) return n;
      if (n < 1e6) return (n / 1e3).toFixed(1) + "K";
      if (n < 1e9) return (n / 1e6).toFixed(1) + "M";
      if (n < 1e12) return (n / 1e9).toFixed(1) + "B";
      return (n / 1e12).toFixed(1) + "T";
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
</style>
