<template>
  <div class="mx-lg-5 ml-md-5 mr-md-5 ml-sm-3 mr-sm-3 p-3">
    <WordcloudMenu @filters-changed="onFiltersChanged" />

    <!-- ✅ Mobile toggle (มีผลทั้ง Img + List) -->
    <div class="d-lg-none mb-2">
      <div class="float-right">
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
    <!-- {{ isLoadingWordCloud }} -->

    <!-- ✅ เรียก API v2 ครั้งเดียวที่นี่ (fetchWordCloud) แล้วส่ง apiData เดียวกันลงไปให้ทั้งสองตัวใช้
         WordcloudImg2/WordcloudList จะไม่ยิง API เองอีกต่อไปเมื่อได้รับ prop นี้
         ✅ ต่อ external-error ลงไปด้วย เพื่อให้ banner error ใน WordcloudImg2 โชว์ตอน fetch พังได้ -->
    <WordcloudImg :activeTab="activeTabMobile" :domain-id="domainId" :external-api-data="wordCloudData"
      :external-loading="isLoadingWordCloud" :external-error="wordCloudError" :external-fetch="true"
      @select="onSelectWord" />


    <WordcloudList v-if="!isLoadingWordCloud" class="mb-3" :activeTab="activeTabMobile" :domain-id="domainId"
      :api-data="wordCloudData" :is-loading="isLoadingWordCloud" @select-word="onSelectWord" />

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
import axios from "axios";
import WordcloudMenu from "./WordcloudMenu";
import WordcloudImg from "./WordcloudImg";
import WordcloudList from "./WordcloudList";
import WordPost from "./WordPost";

import { mapGetters } from "vuex";

export default {
  components: { WordcloudMenu, WordcloudImg, WordcloudList, WordPost, },
  data() {
    const today = new Date().toISOString().slice(0, 10);
    return {
      selectedWord: "",
      showWordPost: false,
      activeTabMobile: "word", // ✅ word | hash (มีผลทั้ง img + list)
      todayStart: `${today}T00:00:00`,
      todayEnd: `${today}T23:59:59`,

      // ✅ ข้อมูลจาก API v2 ที่ยิงครั้งเดียวตรงนี้ แล้วส่งลงไปให้ WordcloudImg2 + WordcloudList ใช้ร่วมกัน
      wordCloudData: null,
      isLoadingWordCloud: false,
      wordCloudError: "",
      _cancelSource: null,
      _lastFetchKey: "",
    };
  },
  computed: {
    ...mapGetters(["getshowStatWC"]),

    token() {
      return localStorage.getItem("token") || "";
    },
    domainId() {
      const q = this.$route.query.domain_id;
      return q && q !== "" ? q : null;
    },
    start() {
      return this.$route.query.start || this.todayStart;
    },
    end() {
      return this.$route.query.end || this.todayEnd;
    },
    monitor() {
      return this.$route.query.monitor || "";
    },

    // ✅ รวม dependency ทั้งหมดที่ควรทำให้ fetch ใหม่ ไว้เป็น key เดียว
    fetchKey() {
      return `${String(this.domainId)}|${String(this.start)}|${String(this.end)}|${String(this.monitor)}`;
    },
  },
  watch: {
    "$route.query.querySearch": {
      immediate: true,
      handler(qs) {
        this.showWordPost = !!qs;
      },
    },
    fetchKey: {
      immediate: true,
      handler() {
        // If we already reserved this key (fetch started via onFiltersChanged), skip duplicate fetch
        if (this._lastFetchKey && this._lastFetchKey === this.fetchKey) return;
        this.fetchWordCloud();
      },
    },
  },
  methods: {
    // ✅ ยิง API v2 ตัวเดียว ครั้งเดียวต่อการเปลี่ยน filter แล้วให้ลูกทั้งสองอ่านจาก prop นี้แทนการยิงเอง
    async fetchWordCloud(overrides = {}) {
      this.wordCloudError = "";

      if (!this.token) {
        this.wordCloudError = "ไม่พบ token";
        return;
      }
      // ถ้าไม่มี domain ให้ส่ง requestโดยไม่ใส่ domain_id เพื่อให้ backend คืนค่า default cloud
      // overrides สามารถกำหนด start/end/monitor/domain_id เพื่อเรียก fetch โดยตรง
      const startVal = overrides.start ?? this.start;
      const endVal = overrides.end ?? this.end;
      const monitorVal = overrides.monitor ?? this.monitor;
      const domainVal = overrides.domain_id ?? this.domainId;

      const key = `${String(domainVal)}|${String(startVal)}|${String(endVal)}|${String(monitorVal)}`;

      // cancel previous
      if (this._cancelSource) this._cancelSource.cancel("Cancelled due to new request");
      this._cancelSource = axios.CancelToken.source();

      // mark loading and reserve this key immediately to prevent duplicate fetches
      this.isLoadingWordCloud = true;
      this._lastFetchKey = key;

      // ✅ เคลียร์ข้อมูลเก่าทิ้งทันทีตอนเริ่ม fetch ใหม่จริงๆ กันเคส error แล้วภาพ/ข้อมูล
      //    filter เก่าค้างอยู่โดยผู้ใช้ไม่รู้ว่ามันคือของเก่า (เหมือนที่แก้ใน WordCloudD3 ไปแล้ว)
      this.wordCloudData = null;

      try {
        const params = { start: startVal, end: endVal };
        if (domainVal) params.domain_id = domainVal;
        if (monitorVal) params.monitor = monitorVal;

        const res = await axios.request({
          method: "GET",
          url: "https://api2.cognizata.com/api/v2/wordcloud/getWordCloud",
          params,
          headers: { Authorization: `Bearer ${this.token}` },
          cancelToken: this._cancelSource.token,
        });
        this.isLoadingWordCloud = true;
        this.wordCloudData = res.data;
      } catch (err) {
        if (axios.isCancel(err)) return;
        this.wordCloudError =
          (err.response && err.response.data && err.response.data.message) ||
          err.message ||
          "โหลดข้อมูลไม่สำเร็จ";
        // clear lastFetchKey on failure so watcher can retry
        this._lastFetchKey = "";
        this.isLoadingWordCloud = false;
      } finally {
        this.isLoadingWordCloud = false;
      }
    },

    resetAll() {
      this.showWordPost = false;
      this.selectedWord = "";
      this.localQuery = "";
      // allow caller to skip replacing the route to avoid triggering extra fetches
      const skipReplace = false;
      if (!skipReplace) this.$router.replace({ query: {} }).catch(() => { });
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
        const OFFSET = 280;
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.pageYOffset - OFFSET,
          behavior: "smooth",
        });
      });
    },

    onFiltersChanged({ start, end, monitor, domain_id }) {
      this.showWordPost = false;
      // immediately fetch using provided filters (avoid waiting for route replace watcher)
      this.fetchWordCloud({ start, end, monitor, domain_id });

      // update route (will not trigger duplicate fetch because _lastFetchKey is reserved)
      this.$router
        .replace({
          query: { ...this.$route.query, start, end, monitor, domain_id },
        })
        .catch(() => { });
    },
  },
  mounted() {
    // on mount we don't want to replace route (it causes duplicate fetches)
    this.resetAll = (function (orig) {
      return function (skipRoute = true) {
        this.showWordPost = false;
        this.selectedWord = "";
        this.localQuery = "";
        if (!skipRoute) this.$router.replace({ query: {} }).catch(() => { });
      };
    })(this.resetAll);
    this.resetAll(true);
  },
  beforeDestroy() {
    if (this._cancelSource) {
      try {
        this._cancelSource.cancel("Component destroyed");
      } catch (e) { }
    }
  },
};
</script>

<style scoped>
.btn-group {
  transform: scale(0.8);
  transform-origin: top right;
}
</style>