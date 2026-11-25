<template>
  <b-card class="box-spotnews black mx-2 p-1 position-relative" v-if="post" style="overflow: hidden;">
    <!-- {{ post }} -->
    <!-- {{loadingCard}} -->
    <vue-element-loading :active="getLoadCardPost" size="80" background-color="rgba(255, 255, 255, 0.5)"
      color="#b6ac9a" />
    <div class="position-relative">

      <b-img   @error="setAltImg"    :src="(post.source === 'tiktok' ?  post.photos[0] || require('@/assets/no-image.jpg') : post.photos[0]) || require('@/assets/no-image.jpg')" v-if="post.photos && post.photos.length"
        style="height:150px; width:100%; object-fit:cover; object-position:center;"></b-img>

      <!-- <b-img cover :src="post.photos[0]" v-if="post.photos && post.photos.length" style="height:150px;" /> -->
      <!-- <div v-else class="h5 text-center"
        style="height:150px;background-color:rgb(237 231 221);display:flex;justify-content:center;align-items:center;flex-direction:column;">
        <i class="fa fa-newspaper-o fa-2x"></i>
        {{ domain || post.source || "ไม่ทราบแหล่งที่มา" }}
      </div> -->
     
    </div>

    <div class="position-absolute pl-1  pb-1"
      style="top:0;right:0;background-color:azure;border-top-left-radius:50%;border-bottom-left-radius:50%;">
      <b-avatar variant="success" icon="emoji-smile" v-if="sentimentString === 'positive'" size="34" />
      <b-avatar variant="primary" icon="emoji-neutral" v-if="sentimentString === 'neutral'" size="34" />
      <b-avatar variant="danger" icon="emoji-frown" v-if="sentimentString === 'negative'" size="34" />
    </div>
    <!-- แนะนำให้กันพื้นที่ไม่ให้ footer ทับ ด้วย padding-bottom -->
<div class="my-2 py-2" style="padding-bottom:70px;" v-if="post.full_text" >
  <div v-if="post && post._id && trSource(post)" class="text-left mb-1 translate-row">
    <TranslateText combined :post-id="post._id" :title="post.title || ''" :full-text="trSource(post)"
      @update="(payload) => onTranslateUpdate(post, payload)" />
  </div>
  <ScrollText
    :text="trText(post)"
   :maxHeight="post.photos && post.photos.length ? '100px' : '250px'"
    :searchWords="getSearchWords"
  />
  <!-- AI สรุปวิดีโอ YouTube (แสดงเฉพาะโพสต์ที่มี summarize_youtube) — อยู่ถัดจากรูป -->
  <YoutubeSummary :post="post" class="mt-2" />
  <!-- ใบหน้าที่พบในรูป (photos_text[].face) — แบบ TopPostCrad; ข้อความ OCR ดูจากปุ่ม "OCR" -->
  <div v-if="ocrFaces(post).length" class="text-left ai-box my-2 px-2" style="font-size: 15px;font-weight: 500;">
    <span v-for="(face, faceIdx) in ocrFaces(post)" :key="'face-' + faceIdx" class="mr-2 mt-1 d-inline-block"
      style="background: #e5e5e5;padding: 0px 6px;border-radius: 13px;">
      <b-icon icon="person-bounding-box" scale="1"></b-icon> {{ face.person_name }}
      <span v-if="Number.isFinite(Number(face.confidence))" v-b-tooltip.hover title="ค่า confidence" class="small">({{ (Number(face.confidence) * 100).toFixed(2) }}%)</span>
    </span>
  </div>
  <!-- ปุ่ม OCR + ข้อความในรูป (แบบ TopPostCrad) -->
  <div class="text-right my-1" v-if="ocrTexts(post).length">
    <span v-b-toggle="'ocr-' + _uid + '-' + 0" id="box-summarize" v-b-tooltip.hover title="OCR" class="btn-ocr">
      <img width="25" height="25" src="https://img.icons8.com/sf-regular/50/printed-ocr.png" alt="printed-ocr"
        style="filter: brightness(0) invert(1);" />
      <span class="md-font">OCR</span>
    </span>
  </div>
  <div class="clearfix" v-if="ocrTexts(post).length"></div>
  <b-collapse :id="'ocr-' + _uid + '-' + 0" class="mt-3 w-100" style="clear: both;" v-if="ocrTexts(post).length">
    <b-card id="cmt-card" class="text-left w-100" style="max-height: 300px;overflow-y: auto;">
      <div v-for="(ocr, ocrIdx) in ocrTexts(post)" :key="'ocr-' + ocrIdx">
        <div class="bold my-2">
          <img width="25" height="25" src="https://img.icons8.com/sf-regular/50/printed-ocr.png" alt="ocr" /> OCR
        </div>
        <div class="mt-1 px-2 pb-3" style="white-space: pre-line;">{{ ocr }}</div>
      </div>
    </b-card>
  </b-collapse>
</div>


    <!-- <div class="text-left small d-flex align-items-center mt-2">
      <b-avatar size="32" :src="post.profile_image" class="mr-2" />
      <span>{{ post.account_name }}</span>
    </div> -->

    <div class="position-absolute text-left"
      style="bottom:-6px;left:0px;background-color:white;width: 100%;height: 52px;"></div>
    <div class="position-absolute text-left" style="bottom:5px;left:10px;background-color:white;width: 100%;">

      <b-avatar size="34" :src="post.profile_image" class="mr-2" />
      <img v-if="post.source === 'twitter'" :src="imgtw" class="social-img" />
      <img v-if="post.source === 'facebook'" :src="imgfb" class="social-img" />
      <img v-if="post.source === 'pantip'" :src="imgpt" class="social-img" />
      <img v-if="post.source === 'youtube'" :src="imgyt" class="social-img" />
      <img v-if="post.source === 'news'" :src="imgnw" class="social-img" />
      <img v-if="post.source === 'instagram'" :src="imgig" class="social-img" />
      <img v-if="post.source === 'blockdit'" :src="imgbd" class="social-img" />
      <img v-if="post.source === 'tiktok'" :src="imgtt" class="social-img" />
      <img v-if="post.source === 'threads'" :src="imgtd" class="social-img" />
      <span class="small account-name ml-2 ">{{ post.account_name }}</span> <span class="d-inline-block box-link small">
        <a :href="post.url_post" class="fa fa-external-link text-muted" target="_blank"></a>
      </span>
      <span class="small text-muted text-left " style="font-size: 12px;">
        {{ formatTime(post.date) }}
      </span>
 <div class=" text-left d-block small mt-1 text-muted" style="font-size: 11px;">
        <span class="d-inline-block box-link ml-2" @click="$emit('goPost', { post, type: 'engages' })">
          <i class="fas fa-chart-line"></i>
          <span>
            {{ post.engagement | numFormat }} </span>
        </span>
        <span class="d-inline-block box-link ml-2">
          <i class="fa fa-thumbs-up " aria-hidden="true"></i>
          {{ post.likes_count | numFormat }} </span>

        <!-- {{post}} -->
        <span class="d-inline-block box-link ml-2">
          <i class="fa fa-comment" aria-hidden="true"></i>
          <span>
            {{ post.comments_count | numFormat }} </span>
        </span>
        <span v-if="post.retweets_count" class="d-inline-block box-link ml-2">
          <i class="fal fa-retweet"></i>
          {{ post.retweets_count | numFormat }}
        </span>
        <span v-if="post.shares_count" class="d-inline-block box-link ml-2">
          <i class="fa fa-share"></i>
          {{ post.shares_count | numFormat }}
        </span>
        <span v-if="post.views_count" class="d-inline-block box-link ml-2">
          <i class="fas fa-eye"></i>
          {{ post.views_count | numFormat }}
        </span>
        <!-- Reactions -->
        <span v-if="post.reaction">
          <span v-if="post.reaction.Love" class="d-inline-block box-link ml-2">
            ❤️ {{ post.reaction.Love | numFormat }}
          </span>
          <span v-if="post.reaction.Wow" class="d-inline-block box-link ml-2">
            😮 {{ post.reaction.Wow | numFormat }}
          </span>
          <span v-if="post.reaction.Haha" class="d-inline-block box-link ml-2">
            😂 {{ post.reaction.Haha | numFormat }}
          </span>
          <span v-if="post.reaction.Sad" class="d-inline-block box-link ml-2">
            😢 {{ post.reaction.Sad | numFormat }}
          </span>
          <span v-if="post.reaction.Angry" class="d-inline-block box-link ml-2">
            😡 {{ post.reaction.Angry | numFormat }}
          </span>
          <span v-if="post.reaction.Hug" class="d-inline-block box-link ml-2">
            🤗 {{ post.reaction.Hug | numFormat }}
          </span>
        </span>
      </div>
    </div>

  </b-card>
</template>

<script>
import ScrollText from "./ScrollText.vue";
import ReadMoreBox from "./ReadMore.vue";
import TranslateText from "../TranslateText.vue";
import moment from "moment";
import "moment/locale/th";
import { mapGetters } from "vuex";
import YoutubeSummary from "@/components/YoutubeSummary.vue";
export default {
  name: "CardPost",
  components: { YoutubeSummary, ReadMoreBox,ScrollText,TranslateText },
  props: {
    loadingCard: { type: Boolean, default: false },
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
  data() {
    return {
       default_avatar: require("@/assets/no-image.jpg"),
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
    }
  },
  computed: {
    ...mapGetters([
      "getLoadCardPost","getSearchWords"
    ]),
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
  methods: {
    // ---- ข้อความ/ใบหน้าจากรูป (photos_text) รองรับทั้ง string และ { text | text_sort, face } ----
    ocrText(entry) {
      if (typeof entry === "string") return entry.trim();
      if (!entry || typeof entry !== "object") return "";
      if (typeof entry.text === "string") return entry.text.trim();
      if (Array.isArray(entry.text_sort)) return entry.text_sort.filter((x) => typeof x === "string").join(" ").trim();
      return "";
    },
    ocrTexts(post) {
      return post && Array.isArray(post.photos_text) ? post.photos_text.map((e) => this.ocrText(e)).filter(Boolean) : [];
    },
    ocrFaces(post) {
      if (!post || !Array.isArray(post.photos_text)) return [];
      return post.photos_text.flatMap((e) => (e && Array.isArray(e.face) ? e.face.filter((f) => f && f.person_name) : []));
    },
    // ---- ปุ่มแปลภาษา (TranslateText โหมด combined) ----
    // ข้อความต้นฉบับ (ตัด marker ที่ปนมากับเนื้อหา) ใช้ส่งให้ TranslateText เช็คว่าเป็นภาษาต่างประเทศหรือไม่
    trSource(post, field = "full_text") {
      const t = (post && post[field]) || "";
      return String(t).replace("...___...", "").replace(".#.##.", "");
    },
    // ข้อความที่แสดงจริง: คำแปล (ถ้ากดแปลและเลือกดูคำแปลอยู่) หรือต้นฉบับ
    trText(post, field = "full_text") {
      if (post && post.showTranslated && post.translatedFullText) return post.translatedFullText;
      return this.trSource(post, field);
    },
    trTitle(post) {
      if (post && post.showTranslated && post.translatedTitle) return post.translatedTitle;
      return (post && post.title) || "";
    },
    // TranslateText แปล/สลับเสร็จ → เก็บผลไว้ที่ตัวโพสต์นั้น ๆ (reactive ด้วย $set)
    onTranslateUpdate(post, payload) {
      if (!post || !payload) return;
      this.$set(post, "translatedTitle", payload.title);
      this.$set(post, "translatedFullText", payload.fullText);
      this.$set(post, "showTranslated", payload.showTranslated);
    },
    setAltImg(event) {
      event.target.src = this.default_avatar;
    },
    onSelect() { this.$emit('select', this.post) },
    onReadMore() { this.$emit('readMore', this.post) },
    formatTime(date) {
      return date.slice(11, 16);
    },
    formatDate(date) {
      let dates = moment(date).subtract(7, "hours");
      let date2 = moment(dates).format("ll");
      return date2;
    },
  },
};
</script>
<style scoped>
/* ปุ่ม OCR แบบเดียวกับ TopPostCrad */
#box-summarize {
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  background-image: linear-gradient(to right, #56a7b6 0%, #6d5fa0 51%, #4b9ed4 100%);
  border-radius: 12px;
  padding: 3px 10px;
  margin-left: 4px;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  position: relative;
  top: -3px;
  cursor: pointer;
}
#box-summarize:hover {
  background-image: linear-gradient(to right, #d8cb16 0%, #8474be 70%, #2b5876 100%);
  background-position: right center;
  color: #fff;
  text-decoration: none;
}

.box-spotnews:hover {
  cursor: pointer;
  transform: translateY(-5px) scale(1.005) translateZ(0);
  box-shadow: rgba(42, 142, 155, 0.38) 0px 0px 0px 3px;
  /* background: #2A7B9B;
background: linear-gradient(90deg,rgba(42, 123, 155, 0.38) 0%, rgba(87, 199, 133, 0.43) 50%, rgba(237, 221, 83, 0.29) 100%); */
  /* box-shadow: 0 24px 36px rgba(0,0,0,0.11),
    0 24px 46px var(--box-shadow-color); */
}

.social-img {
  width: 27px !important;
  margin-top: 0px !important;
  margin-left: -16px !important;
  height: 27px !important;
  z-index: 99;
}

.box-spotnews {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border: 0px;
  height: 350px !important;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 20px;
  min-width: 270px;
}

.account-name {
  display: inline-block;
  max-width: 105px;
  /* ปรับขนาดตามที่ต้องการ */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
  text-align: left;
}

.social-img {
  width: 29px;
  margin-top: -27px;
  margin-left: 35px;
  height: 29px;
  z-index: 9999;
}



/* ปรับระยะเล็กน้อย */
h5 {
  font-weight: 600;
}

</style>
