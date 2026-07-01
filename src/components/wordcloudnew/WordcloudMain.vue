<template>
  <div class="mx-lg-5 ml-md-5 mr-md-5 ml-sm-3 mr-sm-3 p-3">
    <WordcloudMenu @filters-changed="onFiltersChanged" />

    <!-- ✅ Mobile toggle (มีผลทั้ง Img + List) -->
    <div class="d-lg-none mb-2">
      <div class="float-right">
        <!-- <div class="h6 m-0">เลือกแสดง</div> -->
        <b-button-group size="sm" class="btn-group">
          <b-button :variant="activeTabMobile === 'word' ? 'info' : 'outline-info'"
            @click="activeTabMobile = 'word'; showWordPost = false">
            Words
          </b-button>
          <b-button :variant="activeTabMobile === 'hash' ? 'info' : 'outline-info'"
            @click="activeTabMobile = 'hash'; showWordPost = false">
            Hashtags
          </b-button>
        </b-button-group>
      </div>
    </div>


<!-- ✅ Bubble -->
 <!-- {{ bubbleItems }} -->
<!-- <WordcloudBubble
  v-if="!getLoadWordCloud"
  class="mb-3"
  :items="bubbleItems"
  :topN="60"
  @select-word="onSelectWord"
/> -->
    <!-- ✅ ส่ง tab ให้ WordcloudImg -->
    <!-- <WordcloudImg2 :activeTab="activeTabMobile" @select="onSelectWord" /> -->

     <WordcloudImg :activeTab="activeTabMobile" @select="onSelectWord" />
    <!-- ✅ ส่ง tab ให้ WordcloudList -->
    <WordcloudList v-if="!getLoadWordCloud" class="mb-3" :activeTab="activeTabMobile" @select-word="onSelectWord" />
    <div class="mt-2">
      <br v-if="getshowStatWC">
      <vue-element-loading :active="getshowStatWC" size="50" background-color="rgba(255, 255, 255, 0.5)"
        color="#17a2b8" />
              <br v-if="getshowStatWC">  
      <div v-if="showWordPost" ref="wordPostSection" class="px-lg-5">
        <WordPost :querySearch="selectedWord" :key="selectedWord" />
      </div>
    </div>
  </div>
</template>

<script>
import WordcloudMenu from "./WordcloudMenu";
import WordcloudImg from "./WordcloudImg";
import WordcloudImg2 from "./WordcloudImg2";
import WordcloudList from "./WordcloudList";
import WordPost from "./WordPost";
import { mapGetters } from "vuex";
import WordcloudBubble from "./WordcloudBubble";
export default {
  components: { WordcloudMenu, WordcloudImg, WordcloudImg2, WordcloudList, WordPost,WordcloudBubble },
  data() {
    return {
      selectedWord: "",
      showWordPost: false,
      activeTabMobile: "word", // ✅ word | hash (มีผลทั้ง img + list)
    };
  },
  computed: {
    ...mapGetters(["getLoadWordCloud", "getshowStatWC", "getWordCloudData","getWordCloud"]),
    // bubbleItems() {
    //   // ถ้า store ของคุณเป็น { wordcloud:{data:[...]}, hashtagcloud:{data:[...]} }
    //   const wc = this.getWordCloud?.data.wordcloud?.data || [];
    //   const hc = this.getWordCloud?.data.hashtagcloud?.data || [];

    //   return this.activeTabMobile === "hash" ? hc : wc;
    // }
  },
  watch: {
    "$route.query.querySearch": {
      immediate: true,
      handler(qs) {
        this.showWordPost = !!qs;
      },
    },
  },
  methods: {
    resetAll() {
      this.showWordPost = false;
      this.selectedWord = "";
      this.localQuery = "";
      this.$router.replace({ query: {} }).catch(() => { });
    },

    onSelectWord(word) {
      if (this.selectedWord === word) {
        this.selectedWord = "";
        this.showWordPost = false;
        return;
      }

      this.selectedWord = word;
      this.showWordPost = true;

      this.$nextTick(() => {
        const el = this.$refs.wordPostSection;
        if (!el) return;
        const OFFSET = 80;
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.pageYOffset - OFFSET,
          behavior: "smooth",
        });
      });
    },

    onFiltersChanged({ start, end, monitor, domain_id }) {
      this.showWordPost = false;
      this.$router
        .replace({
          query: { ...this.$route.query, start, end, monitor, domain_id },
        })
        .catch(() => { });
    },
  },
  mounted() {
    this.resetAll();
  },
};
</script>
<style scoped>
.btn-group {
  transform: scale(0.8);
  transform-origin: top right;
}
</style>