<template>
  <!-- =====================================================================
       ✅ หน้า Feed (feedMode): เลย์เอาต์แบบ Social feed
         - แถบตัวกรองเป็นการ์ดด้านบน
         - คอลัมน์หลัก = timeline โพสต์ / sidebar = Trending (wordcloud + TOP 10) + TOP 10 Domain sticky บน desktop
       หน้า wordcloud (feedMode = false) ใช้เลย์เอาต์เดิมด้านล่างทั้งหมด ไม่เปลี่ยน
       ===================================================================== -->
  <div v-if="feedMode" class="feed-social">
    <div class="feed-card feed-filter-card">
      <WordcloudMenu :feed-mode="true" @filters-changed="onFiltersChanged" />
    </div>

    <b-row class="feed-body">
      <!-- ---------- Sidebar: Trending ---------- -->
      <b-col cols="12" lg="4" order="1" order-lg="2" class="mb-3">
        <div class="feed-sidebar">
          <!-- ✅ TOP 10 Domain (ใช้ช่วงวันที่ + ประเภทวันที่เดียวกับตัวกรองด้านบน) -->
          <div class="feed-card">
            <TopDomainFeed :start="start" :end="end" :dashboard="dashboard" />
          </div>

          <div class="feed-card">
            <div class="feed-card-head">
              <span class="feed-card-title"><i class="fa fa-fire mr-2" aria-hidden="true"></i>Trending</span>
              <b-button-group size="sm" class="feed-tabs">
                <b-button :variant="activeTabMobile === 'word' ? 'info' : 'outline-info'"
                  @click="activeTabMobile = 'word'">Words</b-button>
                <b-button :variant="activeTabMobile === 'hash' ? 'info' : 'outline-info'"
                  @click="activeTabMobile = 'hash'">Hashtags</b-button>
              </b-button-group>
            </div>
            <div class="feed-date text-muted small mb-1">
              <i class="far fa-calendar-alt mr-1"></i>
              <span v-if="startD === endD">{{ startD }}</span>
              <span v-else>{{ startD }} - {{ endD }}</span>
            </div>
            <WordcloudImg compact :activeTab="activeTabMobile" :domain-id="domainId"
              :external-api-data="wordCloudData" :external-loading="isLoadingWordCloud"
              :external-error="wordCloudError" :external-fetch="true" @select="onSelectWord" />
          </div>

          <div class="feed-card feed-card-list">
            <WordcloudList compact ref="wordList" v-if="!isLoadingWordCloud" :activeTab="activeTabMobile"
              :domain-id="domainId" :api-data="wordCloudData" :is-loading="isLoadingWordCloud"
              @select-word="onSelectWord" />
            <div v-else class="py-4 text-center text-muted small">กำลังโหลด...</div>
          </div>
        </div>
      </b-col>

      <!-- ---------- Timeline โพสต์ ---------- -->
      <b-col cols="12" lg="8" order="2" order-lg="1">
        <div ref="wordPostSection" class="feed-timeline">
          <div class="feed-card feed-timeline-head">
            <div>
              <div class="feed-card-title">
                <i class="far fa-newspaper mr-2" aria-hidden="true"></i>
                <span v-if="showWordPost && selectedWord">โพสต์ที่พบ “{{ selectedWord }}”</span>
                <span v-else>โพสต์ทั้งหมด</span>
              </div>
              <div class="text-muted small">กดคำหรือแฮชแท็กจาก Trending เพื่อกรองโพสต์</div>
            </div>
            <b-button v-if="showWordPost && selectedWord" size="sm" pill variant="outline-secondary"
              class="px-3 feed-clear" @click="clearSelectedWord">
              <i class="fa fa-times mr-1" aria-hidden="true"></i> ล้างคำที่เลือก
            </b-button>
          </div>

          <div class="position-relative">
            <vue-element-loading :active="getshowStatWC" size="50" background-color="rgba(255, 255, 255, 0.5)"
              color="#17a2b8" />
            <!-- ✅ แสดงโพสต์ทั้งหมดเป็นค่าเริ่มต้น (ไม่ส่ง keyword/hashtags) ถ้ากดคำค่อยกรองตามคำนั้น
                 key รวม fetchKey เพื่อโหลดใหม่เมื่อเปลี่ยนตัวกรอง -->
            <WordPost v-if="feedReady" class="feed-posts"
              feed-mode
              :querySearch="showWordPost ? selectedWord : ''"
              :allow-empty="true"
              :key="`${showWordPost ? selectedWord : ''}|${fetchKey}`" />
          </div>
        </div>
      </b-col>
    </b-row>
  </div>

  <!-- ===================== หน้า Wordcloud (เดิม) ===================== -->
  <div v-else class="mx-lg-5 ml-md-5 mr-md-5 ml-sm-3 mr-sm-3 p-3">
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

    <!-- ✅ เรียก API v2 ครั้งเดียวที่นี่ (fetchWordCloud) แล้วส่ง apiData เดียวกันลงไปให้ทั้งสองตัวใช้
         WordcloudImg2/WordcloudList จะไม่ยิง API เองอีกต่อไปเมื่อได้รับ prop นี้
         ✅ ต่อ external-error ลงไปด้วย เพื่อให้ banner error ใน WordcloudImg2 โชว์ตอน fetch พังได้ -->
    <WordcloudImg :activeTab="activeTabMobile" :domain-id="domainId" :external-api-data="wordCloudData"
      :external-loading="isLoadingWordCloud" :external-error="wordCloudError" :external-fetch="true"
      @select="onSelectWord" />


    <WordcloudList ref="wordList" v-if="!isLoadingWordCloud" class="mb-3" :activeTab="activeTabMobile" :domain-id="domainId"
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
import TopDomainFeed from "./TopDomainFeed";

import { mapGetters } from "vuex";

export default {
  components: { WordcloudMenu, WordcloudImg, WordcloudList, WordPost, TopDomainFeed, },
  props: {
    // ✅ หน้า Feed: monitor=true เสมอ + เลือกประเภทวันที่ (dashboard=true / ไม่ส่ง)
    feedMode: { type: Boolean, default: false },
  },
  data() {
    const today = new Date().toISOString().slice(0, 10);
    return {
      selectedWord: "",
      showWordPost: false,
      // ✅ feedMode: รอให้ query มี monitor/dashboard ก่อนค่อย render WordPost (มันอ่านค่าจาก $route.query ตอนยิง API)
      feedReady: false,
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
      if (this.feedMode) return "true";
      return this.$route.query.monitor || "";
    },
    startD() {
      return String(this.start).slice(0, 10);
    },
    endD() {
      return String(this.end).slice(0, 10);
    },
    // ✅ feedMode เท่านั้น: "true" = วันที่ระบบเก็บโพสต์ (ส่ง dashboard=true) / "" = วันที่โพสต์ (ไม่ส่ง)
    //    query ไม่มี dashboard => ค่าเริ่มต้น วันที่ระบบเก็บโพสต์
    dashboard() {
      if (!this.feedMode) return "";
      return this.$route.query.dashboard === "false" ? "" : "true";
    },

    // ✅ รวม dependency ทั้งหมดที่ควรทำให้ fetch ใหม่ ไว้เป็น key เดียว
    fetchKey() {
      return `${String(this.domainId)}|${String(this.start)}|${String(this.end)}|${String(this.monitor)}|${String(this.dashboard)}`;
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
      const dashboardVal = overrides.dashboard !== undefined
        ? (this.feedMode && String(overrides.dashboard) === "true" ? "true" : "")
        : this.dashboard;

      const key = `${String(domainVal)}|${String(startVal)}|${String(endVal)}|${String(monitorVal)}|${String(dashboardVal)}`;

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
        if (dashboardVal) params.dashboard = dashboardVal;

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

    // ✅ feedMode: กลับไปเป็น default (ไม่กรองคำ แสดงโพสต์ทั้งหมด) + ล้างไฮไลต์ใน WordcloudList
    clearSelectedWord() {
      this.selectedWord = "";
      this.showWordPost = false;
      const list = this.$refs.wordList;
      if (list && list.selected) {
        list.selected.chart = null;
        list.selected.key = null;
      }
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

    onFiltersChanged({ start, end, monitor, domain_id, dashboard }) {
      this.showWordPost = false;
      if (this.feedMode) {
        monitor = "true";
        dashboard = String(dashboard) === "false" ? "false" : "true";
      }
      // immediately fetch using provided filters (avoid waiting for route replace watcher)
      this.fetchWordCloud({ start, end, monitor, domain_id, ...(this.feedMode ? { dashboard } : {}) });

      // update route (will not trigger duplicate fetch because _lastFetchKey is reserved)
      this.$router
        .replace({
          query: { ...this.$route.query, start, end, monitor, domain_id, ...(this.feedMode ? { dashboard } : {}) },
        })
        .catch(() => { });
    },
  },
  created() {
    // ✅ feedMode: ใส่ monitor/dashboard ลง query ตั้งแต่แรก เพื่อให้ WordPost (อ่านจาก $route.query) ใช้ค่าเดียวกัน
    //    fetchKey ไม่เปลี่ยน (computed ใช้ค่า default เดียวกันอยู่แล้ว) จึงไม่ยิง API ซ้ำ
    if (this.feedMode) {
      const q = this.$route.query || {};
      if (q.monitor !== "true" || (q.dashboard !== "true" && q.dashboard !== "false")) {
        this.$router
          .replace({
            query: { ...q, monitor: "true", dashboard: q.dashboard === "false" ? "false" : "true" },
          })
          .catch(() => { })
          .finally(() => { this.feedReady = true; });
      } else {
        this.feedReady = true;
      }
    }
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
/* ================= Feed (social) layout — ใช้เฉพาะ feedMode ================= */
.feed-social {
  padding: 8px 12px 40px;
  background: #f4f5f7;
  border-radius: 12px;
}
.feed-card {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  padding: 14px 16px;
  margin-bottom: 14px;
}
.feed-filter-card {
  padding: 16px 16px 10px;
}
.feed-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}
.feed-card-title {
  font-weight: 700;
  font-size: 17px;
  color: #2c3e50;
  text-align: left;
}
.feed-card-title .fa-fire {
  color: #f0a500;
}
.feed-date {
  text-align: left;
}
.feed-tabs .btn {
  font-size: 12px;
  padding: 2px 10px;
}
.feed-card-list {
  padding: 4px 0;
}
.feed-sidebar {
  position: sticky;
  top: 16px;
  max-height: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
  width: 100%;
}
.feed-timeline-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  text-align: left;
}
.feed-clear {
  white-space: nowrap;
}

/* ปรับหน้าตาโพสต์ใน WordPost ให้เป็นการ์ดแบบ timeline (มีผลเฉพาะใต้ .feed-posts) */
.feed-posts ::v-deep .card {
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.feed-posts ::v-deep .card > .card-header {
  background: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.feed-posts ::v-deep .card > .card-footer {
  background: #fafafa;
}
.feed-card-list ::v-deep .box-spot-bg {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  box-shadow: none;
  background: transparent;
}

@media only screen and (max-width: 991px) {
  .feed-sidebar {
    position: static;
    max-height: none;
    overflow: visible;
  }
}
@media only screen and (max-width: 600px) {
  .feed-social {
    padding: 4px 0 30px;
    background: transparent;
  }
  .feed-card {
    border-radius: 10px;
    padding: 12px;
  }
  .feed-timeline-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
/* ========================================================================== */

.btn-group {
  transform: scale(0.8);
  transform-origin: top right;
}
</style>
