<template>
  <b-card
    img-alt="Image"
    img-top
    class="box-spotnews black slider-item mx-2 p-1 position-relative card-sd"
    v-if="post"
  >
    <div class="position-relative">
      <div
        class="position-absolute pl-1 pt-1 pb-1"
        style="
          bottom: 0;
          right: -15px;
          background-color: white;
          border-top-left-radius: 50%;
          border-bottom-left-radius: 50%;
          z-index:999
        "
      >
        <!-- {{ post.sentiment }} -->
        <b-avatar
          variant="success"
          icon="emoji-smile"
          v-if="post.sentiment == 1"
        />
        <b-avatar
          variant="primary"
          icon="emoji-neutral"
          v-if="post.sentiment == 0"
        />
        <b-avatar
          variant="danger"
          icon="emoji-frown"
          v-if="post.sentiment == -1"
        />
      </div>
      <b-row>
        <b-col>
          <div class="text-left bold d-flex align-items-center mt-2">
            <!-- <b-avatar size="32" :src="post.profile_image" class="mr-2" /> -->
            <span>{{ post.account_name }}</span>
          </div>
          <div class="my-2 py-3" style="height: 200px; overflow-y: auto">
            <ReadMoreBox
              :item="{ title: post.full_text }"
              :maxHeight="'122px'"
            />
          </div>
        </b-col>
        <b-col cols="12" md="4" v-if="post.photos && post.photos.length" style="overflow:hidden;">
           <!-- border-radius: 20px; -->
          <div>
          <b-card-img
            class="position-absolute pl-1 pt-1 pb-1 img-cover"
            style="bottom: 0; right: 0;"
            cover
            :src="post.photos[0]"
            v-if="post.photos && post.photos.length"
          />
          <div
            v-else
            class="h5 text-center"
            style="
              height: 200px;
              background-color: rgb(237 231 221);
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
            "
          >
            <i class="fa fa-newspaper-o fa-2x"></i>
            {{ domain || post.source || "ไม่ทราบแหล่งที่มา" }}
          </div>
          </div>
        </b-col>
      </b-row>

      <div
        class="bold h6 position-absolute mt-1 text-right"
        style="top: -3px; right: 1px"
      >
        <span class="d-inline-block box-link">
          <a :href="post.url_post" class="fa fa-external-link" target="_blank"
            ><span> Link </span></a
          >
        </span>
      </div>

      <div
        class="bold h6 position-absolute mt-1 text-right"
        style="bottom: -6px; left: 1px"
      >
        <span
          class="d-inline-block box-link"
          @click="$emit('goPost', { post, type: 'engages' })"
        >
          <i class="fas fa-chart-line"></i>
          <span class="bold"> {{ post.engagement | numFormat }} Engages</span>
        </span>
        <span class="d-inline-block box-link">
          <i class="fa fa-thumbs-up ml-2" aria-hidden="true"></i>
          {{ post.likes_count | numFormat }} Likes</span
        >

        <!-- {{post}} -->
        <span class="d-inline-block box-link">
          <i class="fa fa-comment ml-2" aria-hidden="true"></i>
          <span class="bold">
            {{ post.comments_count | numFormat }} comment</span
          >
        </span>
      </div>
    </div>

    <!-- <div class="bold h6 position-absolute" style="bottom:15px;left:50%;transform:translateX(-50%);">
      <b-avatar variant="primary" style="background-color:#eee !important;color:#595959">
        <b>{{ index + 1 }}</b>
      </b-avatar>
    </div> -->
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
  computed: {},
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
  z-index: 9999;
}

.profile-img {
  width: 44px;
  height: 44px;
}

h5 {
  font-weight: 600;
}
</style>
