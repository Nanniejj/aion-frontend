<template>
  <b-card img-alt="Image" img-top class="box-spotnews black slider-item mx-2 p-1 position-relative card-sd my-3"
    v-if="post">
    <div class="position-relative">
      <div class="position-absolute pl-1 pt-1 pb-1" style="
          top: 0;
          right: -15px;
          background-color: white;
          border-top-left-radius: 50%;
          border-bottom-left-radius: 50%;
          z-index: 999;
        ">
        <!-- {{ post.sentiment }} -->
        <b-avatar variant="success" icon="emoji-smile" v-if="post.sentiment == 1" />
        <b-avatar variant="primary" icon="emoji-neutral" v-if="post.sentiment == 0" />
        <b-avatar variant="danger" icon="emoji-frown" v-if="post.sentiment == -1" />
      </div>
      <b-row>
        <b-col cols="12" md="3" v-if="post.photos && post.photos.length" class="img-col position-relative">
          <!-- รูป preview -->
          <b-card-img class="img-cover" @error="setAltImg"
            :src="(post.source === 'tiktok' ? post.photos[0] || require('@/assets/no-image.jpg') : post.photos[0]) || require('@/assets/no-image.jpg')"
            @click="showImage = true" />
          <div v-if="post.photos.length > 1" id="picmore" @click="onClick(1, post.photos)"
            onerror="this.style.display='none'">
            +{{ post.photos.length - 1 }}
          </div>

          <vue-gallery-slideshow :images="dataPhoto" :index="index" @close="index = null"></vue-gallery-slideshow>
          <!-- Modal แสดงรูปเต็ม -->
          <b-modal v-model="showImage" size="xl" centered hide-footer>
            <img @error="setAltImg"
              :src="(post.source === 'tiktok' ? post.photos[0] || require('@/assets/no-image.jpg') : post.photos[0]) || require('@/assets/no-image.jpg')"
              class="w-100" style="max-height: 80vh; object-fit: contain" crossorigin="anonymous" />
          </b-modal>
        </b-col>


        <b-col>
          <div class="text-left bold d-flex align-items-center mt-2 flex-wrap">
            <div class="position-relative mr-4">
              <b-avatar :src="post.profile_image" class="mr-2" size="45"></b-avatar>
              <img v-if="post.source === 'twitter'" :src="imgtw" class="social-img" />
              <img v-if="post.source === 'facebook'" :src="imgfb" class="social-img" />
              <img v-if="post.source === 'pantip'" :src="imgpt" class="social-img" />
              <img v-if="post.source === 'youtube'" :src="imgyt" class="social-img" />
              <img v-if="post.source === 'news'" :src="imgnw" class="social-img" />
              <img v-if="post.source === 'instagram'" :src="imgig" class="social-img" />
              <img v-if="post.source === 'blockdit'" :src="imgbd" class="social-img" />
              <img v-if="post.source === 'tiktok'" :src="imgtt" class="social-img" />
              <img v-if="post.source === 'threads'" :src="imgtd" class="social-img" />
            </div> <span class="account-name">{{ post.account_name }} </span>
            <span class="d-inline-block box-link ml-2">
              <a :href="post.url_post" class="fa fa-external-link" target="_blank"
                style="color: #1b97a6;font-size: 14px;"></a>
            </span>
            <span class="ml-2 small text-muted date-label d-block d-sm-inline" style="font-size: 12px;">
              {{ formatDate(post.date) }} {{ formatTime(post.date) }}
            </span>
          </div>
          <!-- <div v-if="post.title">{{ post.title }}</div> -->
          <div class=" read-m mt-md-2 pb-1">
            <ReadMoreBox v-if="post.full_text" :item="{ title: post.full_text.replace('...___...', '') }"
              :maxHeight="'97px'" />
          </div>
          <div class="bold small text-muted position-absolute mt-1 text-left w-100"
            style="bottom: -8px; left: 1px; background-color: white">
            <span class="d-inline-block box-link" @click="$emit('goPost', { post, type: 'engages' })">
              <i class="fas fa-chart-line"></i>
              <span class="bold"> {{ post.engagement | numFormat }} </span>
            </span>
            <span class="d-inline-block box-link" v-if="post.likes_count">
              <i class="fa fa-thumbs-up ml-2" aria-hidden="true"></i>
              {{ post.likes_count | numFormat }}
            </span>

            <!-- {{post}} -->
            <span class="d-inline-block box-link" v-if="post.comments_count" id="box-reaction" v-b-tooltip.hover
              title="Comments" :aria-expanded="visible ? 'true' : 'false'" style="cursor: pointer"
              v-b-toggle="'btn' + offset + post._id">
              <i class="fa fa-comment ml-2" aria-hidden="true"></i>
              <span class="bold"> {{ post.comments_count | numFormat }} </span>
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
              <span v-if="post.reaction.view_count" class="d-inline-block box-link ml-2">
                <i class="fas fa-eye"></i>
                {{ post.reaction.view_count | numFormat }}
              </span>
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

        </b-col>
      </b-row>
      <b-collapse :id="'btn' + offset + post._id" class="mt-2" v-if="post.comments && post.comments.length">
        <b-card id="cmt-card" class="text-left">
          <span v-if="post.source == 'news' && post.comments">
            <div v-for="(cmtn, inx) in post.comments.comments" :key="inx">
              <b-row>
                <b-col lg="1">
                  <img :src="cmtn.pictureUrl" id="img-cmt" @error="setAltImg" />
                </b-col>
                <b-col lg="11">
                  <div>
                    <span class="bold">{{ cmtn.displayName }}</span>
                    <span class="font-weight-light" id="cmt-time">{{
                      cmtn.time
                    }}</span>
                  </div>

                  <div v-for="(text, i) in cmtn.contents" :key="i">
                    {{ text.extData.content }}
                  </div>
                </b-col>
              </b-row>
              <hr />
            </div>
          </span>
          <span v-else>
            <div v-for="(cmt, i) in post.comments" :key="i">
              <b-row>
                <b-col lg="1">
                  <a :href="'https://www.youtube.com/' + cmt.author_link" target="_blank"
                    v-if="post.source == 'youtube'">
                    <img :src="cmt.photo" id="img-cmt" v-if="cmt.photo" />
                    <b-avatar v-else loading="lazy" v-else style="height: 32px;"></b-avatar>
                  </a>
                  <a :href="cmt.url" target="_blank" v-else>
                    <img :src="cmt.photo" id="img-cmt" v-bind:href="cmt.url" v-if="cmt.photo" />
                    <b-avatar v-else loading="lazy" v-else style="height: 32px;"></b-avatar>
                  </a>

                  <!-- <img v-if="post.source=='news'" :src="cmt.comments.pictureUrl" id="img-cmt"> -->
                  <span> </span>
                </b-col>
                <b-col lg="11">
                  <div>
                    <a :href="'https://www.youtube.com/' + cmt.author_link" target="_blank"
                      v-if="post.source == 'youtube'">
                      <span v-if="post.source == 'youtube'" class="bold">
                        {{ cmt.author }}</span></a>
                    <a :href="cmt.url" target="_blank" v-else>
                      <span class="bold"> {{ cmt.username }}</span></a>
                    <span v-if="post.source == 'youtube' && cmt.time" class="font-weight-light" id="cmt-time">{{
                      cmt.time.split("T")[0] }} |
                      {{ cmt.time.split("T")[1] }}</span>
                    <span v-else class="font-weight-light" id="cmt-time">
                     <span v-if="cmt.time&&cmt.time.split('T')[1]"> {{ formatDate(cmt.time) }} {{ formatTime(cmt.time) }}</span>
                         <span v-else> {{ cmt.time}}</span>
                      <!-- {{
                      cmt.time
                    }} -->
                    </span>
                  </div>

                  <div v-if="post.source == 'youtube'" class="font-weight-light">
                    {{ cmt.text }}
                  </div>
                  <div v-else class="font-weight-light">
                    {{ cmt.content }}
                  </div>
                </b-col>
              </b-row>
              <hr />
            </div>
          </span>
        </b-card>
      </b-collapse>
    </div>
  </b-card>
</template>

<script>
import VueGallerySlideshow from "vue-gallery-slideshow";
import ReadMoreBox from "./ReadMore.vue";
import moment from "moment";
import "moment/locale/th";
export default {
  name: "CardTitle",
  components: { ReadMoreBox, VueGallerySlideshow },
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
  data() {
    return {
      index: null,
      dataPhoto: [],
      offset: 0,
      visible: false,
      imgtw: require("@/assets/Twitter.png"),
      imgfb: require("@/assets/Facebook.png"),
      imgpt: require("@/assets/board.png"),
      imgig: require("@/assets/Instagram.png"),
      imgnw: require("@/assets/News.png"),
      imgyt: require("@/assets/Youtube.png"),
      imgbd: require("@/assets/Blockdit.png"),
      imgtt: require("@/assets/Tiktok.png"),
      imgtd: require("@/assets/Threads.png"),
      default_avatar: require("@/assets/no-image.jpg"),
      showImage: false,
    };
  },
  computed: {},
  methods: {
    onClick(i, data) {
      console.log(data);
      this.index = i;
      this.dataPhoto = data;
    },
    setAltImg(event) {
      event.target.src = this.default_avatar;
    },
    formatDate(date) {
      let dates = moment(date).subtract(7, "hours");
      let date2 = moment(dates).format("ll");
      return date2;
    },
    formatTime(date) {
      return date.slice(11, 16);
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
#picmore {
  background: #000000ad;
  color: white;
  padding: 5px 15px;
  font-size: 15px;
  /* margin: -44px; */
  z-index: 999;
  position: absolute;
  /* width: 68px; */
  right: 15px;
  bottom: 0px;
  cursor: pointer;
  /* border-radius:10px; */
}

a {
  color: #575e64
}

.read-m {
  min-height: 40px !important;
}

.social-img {
  width: 29px;
  margin-top: 1px;
  margin-left: 35px;
  height: 29px;
  z-index: 9999;
  left: 0px;
  bottom: 0px;
  position: absolute;
}

.badge-primary {
  color: #fff;
  background-color: #2876ca;
}

.account-name {
  font-size: 15px;
  display: inline-block;
  max-width: 140px;
  /* ปรับขนาดตามที่ต้องการ */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
  text-align: left;
}

.date-label {
  display: block;
}

/* .read-m {
  max-height: 200px;
  overflow-y: auto;
} */

.img-cover {
  width: auto;
  height: 212px;
  border-radius: 20px;
  /* box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px; */
}

.card-sd {
  border: 1px solid #888787;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
    rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  border-radius: 20px;
}

.social-img {
  width: 29px;
  margin-top: -27px;
  margin-left: 35px;
  height: 29px;
  z-index: 99;
}

.profile-img {
  width: 44px;
  height: 44px;
}

h5 {
  font-weight: 600;
}

.img-col {
  overflow: hidden;
}

.img-cover {
  width: 100%;
  height: 212px;
  /* fix ความสูง */
  object-fit: cover;
  /* รูปไม่บีบ */
  border-radius: 20px;
}

img-cover {
  width: 100%;
  height: 212px;
  object-fit: cover;
  border-radius: 20px;
  cursor: pointer;
  /* แสดงว่าเป็นรูปคลิกได้ */
  transition: transform 0.3s ease-in-out;
}

.img-cover:hover {
  transform: scale(1.05);
}

/* responsive: ถ้าหน้าจอเล็กลง ให้ลดความสูง */
@media (max-width: 800px) {
  .img-cover {
    height: 160px;
  }

}

@media only screen and (min-width: 0px) and (max-width: 800px) {
  .read-m {
    font-size: 14px;
  }

  /* .card-sd {
    max-width: 289px;
  } */

}

@media (max-width: 576px) {
  .img-cover {
    height: 140px;
  }
}
</style>
