<template>
  <b-modal v-model="showProxy" size="lg" hide-footer scrollable class="py-5 popup-comment">
    <!-- Header แบบ custom (ใช้ slot="modal-header" แทน #modal-header) -->
    <template slot="modal-header">
      <div class="w-100 py-2 position-relative">
        <b-button variant="link" class="position-absolute close-btn p-0" style="right: -6px;top:0px"
          @click="showProxy = false">
          <b-icon icon="x" font-scale="1.8" style="color: #1b97a6;"></b-icon>
        </b-button>
        <div class="d-flex align-items-center pt-2">
          <a :href="post.url_post" target="_blank"><b-avatar :src="headerAvatar" size="44" class="mr-2" /></a>

          <div class="d-flex flex-column">
            <div class="font-weight-bold" style="line-height: 1.2;">
              <a :href="post.url_post" target="_blank" style="color: #1b97a6;font-size: 14px;"> {{ headerAccountName
              }}</a>
            </div>
            <div class="text-muted small" v-if="headerDate">
              {{ headerDate }} {{ headerTime }}
            </div>
          </div>
       <div class="text-left ml-auto" style="zoom:78%">
          <b-button-group size="sm" class="my-2" v-if="post.source == 'facebook'">
            <b-button :variant="filterMode === 'topComments' ? 'info' : 'outline-info'"
              @click="filterMode = 'topComments'">
              Top Comments
            </b-button>
            <b-button :variant="filterMode === 'topFans' ? 'info' : 'outline-info'" @click="filterMode = 'topFans'"  v-if="post.comments.filter(x => x.is_top_fan).length">
              Top Fan
            </b-button>
          </b-button-group>
        </div>

        </div>


        
      </div>
    </template>
    <!-- เนื้อหาโพสต์ (สรุป/ท่อนต้น) -->
    <div v-if="headerFullText" class="small  post-preview">
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
          <ReadMoreBox :text="headerFullText" :limit="350" :mobileLimit="110" :breakpoint="800" />
        
        </b-col>
      </b-row>

    </div>
    <hr class="my-2" />
    <!-- รายการคอมเมนต์ -->
    <div v-if="filteredAll.length">
      <div v-for="(c, i) in filteredAll" :key="c.id || i" class="d-flex align-items-start mb-3">
        <b-avatar :src="c.photo" size="38" :class="c.is_top_fan ? 'story-ring' : ''" />
        <div class="ml-2 flex-grow-1">
          <div class="d-flex align-items-center flex-wrap">
            <a v-if="c.username" :href="c.url_comment || c.url" target="_blank"
              class="font-weight-bold name-ellipsis-1 small">
              {{ c.username }}
            </a>
            <a v-else :href="c.author_link ? ('https://www.youtube.com' + c.author_link) : '#'" target="_blank"
              class="font-weight-bold name-ellipsis-1 small">
              {{ c.author || 'Unknown' }}
            </a>

            <span v-if="c.is_top_fan" class="ml-2 small topfan">
              <b-avatar icon="star-fill" size="18" class="icon-bg"></b-avatar>
              TOP FAN
            </span>

            <span class="ml-2 small text-muted" style="font-size: 11px;">
              {{ formatDate(c.time) }} {{ formatTime(c.time) }}
            </span>
          </div>

          <div class="small message-box px-3 py-1 mt-1" v-if="c.content || c.text">
            {{ c.content || c.text }}
            <span v-if="c.reaction || c.vote" class="reaction-box ml-2">
              <template v-if="c.reaction">
                <b-iconstack font-scale="1">
                  <b-icon stacked icon="hand-thumbs-up" variant="dark" scale="1" shift-h="0.35"
                    shift-v="-0.10"></b-icon>
                  <b-icon stacked icon="suit-heart-fill" scale="0.6" shift-h="8" shift-v="6" variant="danger"></b-icon>
                </b-iconstack>
                <span class="small bold"> {{ c.reaction }} </span>
              </template>
              <template v-else-if="c.vote">
                <b-icon icon="hand-thumbs-up" variant="dark" scale="1"></b-icon>
                <span class="small bold"> {{ c.vote }} </span>
              </template>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-muted small">ไม่พบความคิดเห็น</div>
  </b-modal>
</template>

<script>
import moment from "moment";
import "moment/locale/th";
import ReadMoreBox from "./ReadMore2.vue";
export default {
  name: "CommentsAllModal",
  components: { ReadMoreBox },
  props: {
    value: { type: Boolean, default: false },        // v-model
    comments: { type: Array, default: () => [] },
    accountName: { type: String, default: "" },
    filterMode: { type: String, default: "topComments" }, // 'topComments' | 'topFans'
    post: { type: Object, default: () => null }      // รับข้อมูลโพสต์เพื่อโชว์บนหัวโมดัล
  },
  data() {
    return {
      showImage: false,
            default_avatar: require("@/assets/no-image.jpg"),
    }
  },
  computed: {
    showProxy: {
      get() { return this.value; },
      set(v) { this.$emit("input", v); }
    },
    filteredAll() {
    //   const base = (this.comments || []).filter(x => x && x.username !== this.accountName);
    //   if (this.filterMode === "topFans") return base.filter(x => x.is_top_fan);

        //     return base;

    // const base = (this.comments || []).filter(
    //   x => x && x.username !== this.accountName
        // )
    const base = (this.comments || [])
    return this.filterMode === 'topFans'
      ? base.filter(x => x.is_top_fan)
      : base
    },
    // ---- header computed (เลี่ยงการใช้ ?. ใน template) ----
    headerAvatar() {
      const noimg = require("@/assets/no-image.jpg");
      return this.post && this.post.profile_image ? this.post.profile_image : noimg;
    },
    headerAccountName() {
      if (this.post && this.post.account_name) return this.post.account_name;
      if (this.accountName) return this.accountName;
      return "ไม่ระบุ";
    },
    headerFullText() {
      if (this.post && this.post.full_text) {
        return this.post.full_text.replace("...___...", "");
      }
      return "";
    },
    headerDate() {
      if (this.post && this.post.date) return this.formatDate(this.post.date);
      return "";
    },
    headerTime() {
      if (this.post && this.post.date) return this.formatTime(this.post.date);
      return "";
    }
  },
  methods: {
      setAltImg(event) {
      event.target.src = this.default_avatar;
    },
    formatDate(date) {
      if (!date) return "";
      const d = moment(date).subtract(7, "hours");
      return moment(d).format("ll");
    },
    formatTime(date) {
      if (!date) return "";
      const iso = typeof date === "string" ? date : new Date(date).toISOString();
      return iso.slice(11, 16);
    }
  }
};
</script>

<style scoped>
.topfan {
  background: #f9ebcc;
  border-radius: 10px;
  padding: 5px;
  font-size: x-small;
  text-wrap-mode: nowrap;
}

.story-ring {
  display: inline-flex;
  padding: 3px;
  border-radius: 50%;
  background: conic-gradient(#feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5);
}

.icon-bg {
  background: linear-gradient(70deg, #3F5EFB 0%, #FC466B 80%, #FCC246 100%);
  color: #fff;
}

.message-box {
  color: #374757;
  background: #f2f2f2;
  border-radius: 10px;
  padding: 10px;
  width: fit-content;
  max-width: 100%;
}

.reaction-box {
  background: #fff;
  padding: 2px 4px;
  border-radius: 10px;
  text-wrap-mode: nowrap;
}

.name-ellipsis-1 {
  display: block;
  max-width: 180px;
  overflow: hidden;
  white-space: nowrap;
  color: #56a7b6;
  text-overflow: ellipsis;
}

.post-preview {
  background: #f8fafb;
  border: 1px dashed #d8e6ea;
  border-radius: 10px;
  padding: 8px 10px;
  color: #3b4a59;
}

.img-col {
  overflow: hidden;
}

.img-cover {
  width: 100%;
  height: 117px;
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

@media only screen and (min-width: 0px) and (max-width: 800px) {}
</style>

<style>
.modal-title {
  font-size: 17px !important;
  line-height: 2.5 !important;
}
</style>
