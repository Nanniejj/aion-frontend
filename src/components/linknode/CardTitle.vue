<template>
  <b-card img-alt="Image" img-top class="box-spotnews black slider-item mx-2 p-1 position-relative card-sd my-2"
    v-if="post" >
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
          <b-card-img class="img-cover" :src="post.photos[0]" @click="showImage = true" />

          <!-- Modal แสดงรูปเต็ม -->
          <b-modal v-model="showImage" size="xl" centered hide-footer>
            <img :src="post.photos[0]" class="w-100" style="max-height: 80vh; object-fit: contain" />
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

          <div class=" read-m mt-md-2">
            <ReadMoreBox :item="{ title: post.full_text }" :maxHeight="'90px'" />
          </div>
          <div class="bold small text-muted position-absolute mt-1 text-right"
            style="bottom: -6px; left: 1px; background-color: white">
            <span class="d-inline-block box-link" @click="$emit('goPost', { post, type: 'engages' })">
              <i class="fas fa-chart-line"></i>
              <span class="bold"> {{ post.engagement | numFormat }} </span>
            </span>
            <span class="d-inline-block box-link">
              <i class="fa fa-thumbs-up ml-2" aria-hidden="true"></i>
              {{ post.likes_count | numFormat }}
            </span>

            <!-- {{post}} -->
            <span class="d-inline-block box-link">
              <i class="fa fa-comment ml-2" aria-hidden="true"></i>
              <span class="bold"> {{ post.comments_count | numFormat }} </span>
            </span>

          </div>

        </b-col>
      </b-row>
    </div>


  </b-card>
</template>

<script>
import ReadMoreBox from "./ReadMore.vue";
import moment from "moment";
import "moment/locale/th";
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
  data() {
    return {
      showImage: false,
    };
  },
  computed: {},
  methods: {
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
  .read-m {
  font-size: 14px;
}
}
@media (max-width: 576px) {
  .img-cover {
    height: 140px;
  }
}
</style>
