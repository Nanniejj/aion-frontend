<template>
  <div>
    <b-card img-alt="Image" img-top class="box-spotnews black slider-item mx-2 p-1 position-relative card-sd my-2"
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
          <b-col cols="12" md="3" v-if="post.photos && post.photos.length" class="img-col">
            <!-- รูป preview -->
            <b-card-img class="img-cover" @error="setAltImg"
              :src="(post.source === 'tiktok' ? post.photos[0] || require('@/assets/no-image.jpg') : post.photos[0]) || require('@/assets/no-image.jpg')"
              @click="showImage = true" />

            <!-- Modal แสดงรูปเต็ม -->
            <b-modal v-model="showImage" size="xl" centered hide-footer>
              <img @error="setAltImg"
                :src="(post.source === 'tiktok' ? post.photos[0] || require('@/assets/no-image.jpg') : post.photos[0]) || require('@/assets/no-image.jpg')"
                class="w-100" style="max-height: 80vh; object-fit: contain" crossorigin="anonymous" />
            </b-modal>
          </b-col>


          <b-col>
            <div class="text-left bold d-flex align-items-center mt-2 flex-wrap">
              <span class="account-name">{{ post.account_name }} </span>
              <span class="d-inline-block box-link ml-2">
                <a :href="post.url_post" class="fa fa-external-link" target="_blank"
                  style="color: #1b97a6;font-size: 14px;"></a>
              </span>
              <span class="ml-2 small text-muted date-label d-block d-sm-inline" style="font-size: 12px;">
                {{ formatDate(post.date) }} {{ formatTime(post.date) }}
              </span>
            </div>

            <div class="mt-md-2 pb-1" v-if="post.full_text">
              <ReadMoreBox :text="post.full_text.replace('...___...', '')" :limit="300" :mobileLimit="110"
                :breakpoint="800" />
            </div>
            <div v-else> <br> </div>


            <div class="bold small text-muted position-absolute mt-1 text-left w-100 reaction"
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
              <span class="d-inline-block box-link ml-2 clickable" v-if="post.comments_count" @click="toggleComments"
                role="button" :aria-expanded="showComments" title="แสดง/ซ่อนคอมเมนต์">
                <i class="fa fa-comment" aria-hidden="true"></i>
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


            <div v-if="post.comments && post.comments.length" class="avatar-pile text-right clickable"
              @click="toggleComments" :aria-expanded="showComments">
              <b-avatar
                v-for="(c, i) in (filterMode === 'topFans' ? post.comments.filter(x => x.is_top_fan).slice(0, 5) : post.comments.filter(x => x.username !== post.account_name).slice(0, 5))"
                :key="c.id || i" v-if="c.photo" :src="c.photo" size="28" :style="avatarStyle(i)"
                :class="c.is_top_fan ? 'avatar-item story-ring' : 'avatar-item'" />
            </div>

          </b-col>

        </b-row>
      </div>


      <!-- <div v-if="post.comments && post.comments.length" class="avatar-pile text-right">
        <b-avatar v-for="(c, i) in post.comments.filter(x=>x.is_top_fan).slice(0, 5)" :key="c.id || i" v-if="c.photo" :src="c.photo" size="28"
         :style="avatarStyle(i)"  :class="c.is_top_fan ? 'avatar-item story-ring' : 'avatar-item'"/>
      </div> -->

    </b-card>

    <ul class="station-list" v-if="showComments && post.comments && post.comments.length">
      <b-button-group size="sm" class="my-2" v-if="post.source == 'facebook'">
        <b-button :variant="filterMode === 'topComments' ? 'info' : 'outline-info'" @click="filterMode = 'topComments'">
          Top Comments
        </b-button>
        <b-button :variant="filterMode === 'topFans' ? 'info' : 'outline-info'" @click="filterMode = 'topFans'"
          v-if="post.comments.filter(x => x.is_top_fan).length">
          Top Fan
        </b-button>
      </b-button-group>
      <span class="clickable small" @click="showAllComments = true" size="sm">
        ดูทั้งหมด
      </span>
      <CommentsAllModal v-model="showAllComments" :comments="post.comments || []" :accountName="post.account_name"
        :filterMode="filterMode" />
      <li class="station" style="color: rgb(0, 108, 183);"
        v-for="(c, i) in (filterMode === 'topFans' ? post.comments.filter(x => x.is_top_fan).slice(0, 5) : post.comments.filter(x => x.username !== post.account_name).slice(0, 5))"
        :key="c.id || i" v-if="c.photo">

        <a :href="c.url_comment || c.url" v-if="c.username" target="_blank">
          <b-avatar v-if="c.photo" :src="c.photo" size="38" :class="c.is_top_fan ? 'story-ring' : ''" />
          {{ c.username
          }}
        </a>

        <a :href="'https://www.youtube.com' + c.author_link" v-else target="_blank">
          <b-avatar v-if="c.photo" :src="c.photo" size="38" /> {{ c.author }}</a>
        <span v-if="c.is_top_fan" class="ml-2 small topfan"> <b-avatar icon="star-fill" size="20"
            class="icon-bg"></b-avatar>
          TOP FAN</span>
        <span class="ml-2 small text-muted date-label2 d-block d-sm-inline" style="font-size: 12px;">
          {{ formatDate(c.time) }} {{ formatTime(c.time) }}
        </span>
        <div>
          <div class="arrow" v-if="c.content || c.text">
            <div class="outer"></div>
            <div class="inner"></div>
          </div>
          <div class="small message-box px-3 py-1" v-if="c.content">
            {{ displayText(c, 'content', i) }}
            <button v-if="shouldTruncate(c.content)" class="btn btn-link p-0 ml-1 align-baseline small"
              @click="toggleExpand(c, 'content', i)">
              {{ isExpanded(c, 'content', i) ? ' ย่อ ' : ' อ่านต่อ ' }}
            </button>

            <span v-if="c.reaction" class="reaction-box">
              <b-iconstack font-scale="1">
                <b-icon stacked icon="hand-thumbs-up" variant="dark" scale="1" shift-h="0.35" shift-v="-0.10"></b-icon>
                <b-icon stacked icon="suit-heart-fill" scale="0.6" shift-h="8" shift-v="6" variant="danger"></b-icon>
              </b-iconstack>
              <span class="small bold"> {{ c.reaction }}</span>
            </span>
          </div>

          <div class="small message-box px-3 py-1" v-if="c.text">
            {{ displayText(c, 'text', i) }}
            <button v-if="shouldTruncate(c.text)" class="btn btn-link p-0 ml-1 align-baseline small"
              @click="toggleExpand(c, 'text', i)">
              {{ isExpanded(c, 'text', i) ? ' ย่อ ' : ' อ่านต่อ ' }}
            </button>

            <span v-if="c.vote" class="reaction-box">
              <b-icon icon="hand-thumbs-up" variant="dark" scale="1"></b-icon>
              <span class="small bold"> {{ c.vote }}</span>
            </span>
          </div>
        </div>
      </li>

    </ul>



  </div>
</template>

<script>
import ReadMoreBox from "./ReadMore2.vue";
import moment from "moment";
import "moment/locale/th";
import CommentsAllModal from "./CommentsAllModal.vue";

export default {
  name: "CardPost",
  components: { ReadMoreBox, CommentsAllModal },
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
      readmoreLimit: 120,   // ปรับจำนวนตัวอักษรได้
      expandedMap: {},       // เก็บสถานะขยาย/ย่อ รายการละ field
      default_avatar: require("@/assets/no-image.jpg"),
      showImage: false,
      filterMode: "topComments", // 'topComments' | 'topFans'
      showComments: false,
      showAllComments: false,
    };
  },
  computed: {},
  methods: {
    toggleComments() {
      this.showComments = !this.showComments;
    },
    _key(c, field, idx) {
      // ถ้ามี id ก็ใช้ id แทน idx ได้เลย เช่น `${c.id}:${field}`
      return `${idx}:${field}`;
    },
    isExpanded(c, field, idx) {
      return !!this.expandedMap[this._key(c, field, idx)];
    },
    toggleExpand(c, field, idx) {
      const k = this._key(c, field, idx);
      this.$set(this.expandedMap, k, !this.expandedMap[k]);
    },
    shouldTruncate(text) {
      return !!text && text.length > this.readmoreLimit;
    },
    // ฟังก์ชัน readmore หลัก (ใช้ slice ตามที่ต้องการ)
    displayText(c, field, idx) {
      const text = c[field] || '';
      if (!this.shouldTruncate(text)) return text;
      return this.isExpanded(c, field, idx)
        ? text
        : text.slice(0, this.readmoreLimit) + '…';
    }
    ,
    avatarStyle(i) {
      const size = 40;     // ขนาด avatar ต้องตรงกับ prop size
      const overlap = 25;  // ระยะเหลื่อม (ยิ่งน้อยยิ่งทับกันมาก)
      return {
        right: `${i * overlap}px`,
        width: `${size}px`,
        height: `${size}px`,
      };
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
    }
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
<style lang="scss" scoped>
$heightLine: 2.5rem;

ul,
li {
  margin: 0;
  padding: 0;
  text-align: left;
}

.sitemap>li>ul {
  margin-top: $heightLine;
}

ul {
  list-style: none;

  li {
    line-height: $heightLine;
    vertical-align: top;
    position: relative;

    a {
      text-decoration: none;
      color: rgb(14, 141, 163);
      display: inline-block;
    }
  }

  ul {
    margin-left: $heightLine;
    margin-bottom: $heightLine;

    li {
      position: relative;

      &::before {
        content: "";
        display: inline-block;
        width: $heightLine * 2;
        height: 100%;
        border-left: 1.5px #ccc solid;
        position: absolute;
        top: -$heightLine / 2;
      }

      &::before {
        content: "";
        display: inline-block;
        width: $heightLine * 2;
        height: $heightLine;
        border-bottom: 1.5px #ccc solid;
        position: absolute;
        top: -$heightLine / 2;
      }

      a {
        margin-left: $heightLine * 2.5;
      }
    }
  }
}
</style>
<style scoped>
.clickable {
  cursor: pointer;
  user-select: none;
}

.clickable:active {
  transform: scale(0.98);
}

.btn-link {
  font-size: small !important;
  color: #17a2b8;
}

.reaction-box {
  background-color: #ffffff;
  padding: 2px 4px;
  border-radius: 10px;
  text-wrap-mode: nowrap;
}

.btn-group.btn-group-sm {
  zoom: 80%;
}

.topfan {
  background-color: #f9ebcc;
  ;
  border-radius: 10px;
  padding: 5px 5px;
  font-size: x-small;
  text-wrap-mode: nowrap;
}

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

.icon-bg {
  background: #3F5EFB;
  color: rgb(255, 255, 255);
  background: linear-gradient(70deg, rgba(63, 94, 251, 1) 0%, rgba(252, 70, 107, 1) 80%, rgb(252, 194, 70) 100%);

}

.message-box {
  color: #374757;
  background-color: #f2f2f2;
  /* Light gray background */
  border-radius: 10px;
  /* Rounded corners */
  padding: 10px 10px;
  /* Inner spacing */
  margin: 5px;
  /* Outer spacing */
  max-width: 90%;
  width: fit-content !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  /* Subtle shadow */
  line-height: normal;
}

.message-box p {

  font-size: 16px;
  color: #333;
  margin: 0;
}

/* Message box starts here */
.container {
  clear: both;
  position: relative;
}

.container .arrow {
  width: 12px;
  height: 20px;
  overflow: hidden;
  position: relative;
  float: left;
  top: 6px;
  right: 6px;
}

.container .arrow .outer {
  width: 0;
  height: 0;
  border-right: 20px solid #f2f2f2;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  position: absolute;
  top: 0;
  left: 0;
}

.container .arrow .inner {
  width: 0;
  height: 0;
  border-right: 20px solid #f2f2f2;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  position: absolute;
  top: 0;
  left: 2px;
}

.container .message-body {
  /* float: left; */
  width: 90%;
  height: auto;
  border: 1px solid #CCC;
  background-color: #ffffff;
  border: 1px solid #000000;
  padding: 6px 8px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  -o-border-radius: 5px;
  border-radius: 5px;
  right: 20px !important;
  position: relative;
}

.container .message-body p {
  margin: 0;
}


.station-list {
  list-style: none;
  position: relative;
  padding-left: 10px;
}

.station-list:before {
  border-right: 2px solid #a8d9e2;
  border-right-color: #a8d9e2;
  content: '';
  display: block;
  height: calc(100% - 10px);
  left: 7px;
  position: absolute;
  top: -20px;
  z-index: 3;
  border-radius: 20px;

}

.station {
  text-align: left;
  border: none;
  background: 0 0;
  height: inherit;
  margin-bottom: 10px;
  overflow: visible;
  padding: 0;
  position: relative;
}

.station:before {
  position: absolute;
  content: '';
  display: block;
  height: 2px;
  left: -32px;
  position: absolute;
  top: 10px;
  width: 35px;
  z-index: 3;
  background-color: #a8d9e2;
  border-radius: 20px;
}


.station.bus-approaching:before {
  display: block;
  border-radius: 100%;
  width: 40px;
  height: 40px;
  top: -3px;
  left: 0px;
  z-index: 4;
  background: url(https://new.mta.info/themes/custom/bootstrap_mta/images/icons/BSS-90deg.svg) center -2px no-repeat;
  background-size: auto;
  background-size: 98%;
}

.station-list {
  list-style: none;
  position: relative;
  padding-left: 40px;
}

.avatar-pile {
  position: relative;
  /* height: 32px; */
  bottom: 23px;
  /* สูงเท่าขนาด avatar */
}

.avatar-item {
  position: absolute;
  border: 2px solid #fff;
  border-radius: 50%;
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

.read-m {

  max-height: 200px;
  overflow-y: auto;
}

.img-cover {
  width: auto;
  height: 212px;
  border-radius: 20px;
  /* box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px; */
}

.card-sd {

  border: 0px;
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
  .avatar-pile {
    position: relative;
    zoom: 80%;
    bottom: 55px;
    /* bottom: 23px; */

  }

  .reaction {
    zoom: 85%;
    position: relative !important;
  /* bottom: 17px !important; */
  }

  .date-label2 {
    font-size: 10px !important;
    position: absolute;
    top: 14px;
    left: 34px;
  }

  .name-ellipsis-1 {
    display: block;
    /* หรือ inline-block */
    max-width: 180px;
    /* ปรับให้พอดีกับดีไซน์ */
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* ถ้าอยู่ใน flex container ให้ใส่ที่ลูกคอลัมน์ด้วย */
  .flex-child-min0 {
    min-width: 0;
  }

  /* div.row>div.col>div.bold.small.text-muted.position-absolute.mt-1.text-left.w-100 {
    position: relative !important;
    bottom: 24px !important;
  } */


  .read-m {
    font-size: 14px;
  }

  .message-box {
    overflow-wrap: anywhere;
  }

  .card-sd {
    max-width: 289px;
  }

  .station-list {
    list-style: none;
    position: relative;
    padding-left: 19px;
  }

  .station:before {
    position: absolute;
    content: '';
    display: block;
    height: 2px;
    left: -12px;
    position: absolute;
    top: 10px;
    width: 15px;
    z-index: 3;
    background-color: #a8d9e2;
    border-radius: 20px;
  }

  ul>li>a {
    font-size: small !important;
  }
}

@media (max-width: 576px) {
  .img-cover {
    height: 140px;
  }
}
</style>
