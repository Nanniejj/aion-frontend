<template>
  <b-card class="box-spotnews black slider-item mx-2 p-1 position-relative" v-if="post" style="overflow: hidden;">
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
  <ScrollText
    :text="post.full_text.replace('...___...','')"
   :maxHeight="post.photos && post.photos.length ? '100px' : '250px'"
    :searchWords="getSearchWords"
  />
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
export default {
  name: "CardPost",
  components: { ReadMoreBox,ScrollText,TranslateText },
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
