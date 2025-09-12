<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />

    <div class="container my-3">
      <!-- Filters Card -->
      <b-card class="mb-3 shadow-sm" style="border-radius: 20px;">
        <b-alert show variant="info">
          <!-- <b-icon icon="info-circle" id="info-date-note" variant="info" class="float-right"></b-icon>
          <b-tooltip target="info-date-note" placement="bottom">
            ถ้าเลือกมากกว่า 2 วัน ระบบจะตั้งค่าเริ่มต้นเป็น "รายวัน" และเรียงตาม "Engagement"
          </b-tooltip> -->
          <div class="text-left"> <b-icon icon="info-circle" class="" variant="info"></b-icon> <small>คำค้นหา (AND
              ใช้ช่องว่างหรือ +, OR
              ใช้ ,)
              <span class="text-muted"> ตัวอย่าง: <code>คาเฟ่ บรรยากาศดี, มัทฉะ อร่อย</code> = (คาเฟ่
                AND บรรยากาศดี) OR (มัทฉะ AND อร่อย)</span>
            </small></div>
        </b-alert>
        <b-form @submit.prevent="handleSearch">
          <b-row>
            <b-col cols="12" md="8">
              <b-form-group label="" label-for="kw" class="pr-md-3 flex-grow-1">
                <b-form-input id="kw" v-model.trim="formFilters.keywordInput"
                  placeholder="เช่น คาเฟ่ บรรยากาศดี,มัทฉะ อร่อย" />
              </b-form-group>
            </b-col>

            <b-col cols="12" md="4">
              <!-- Sentiment -->
              <b-form-group class="pr-md-3 checkbox-v">
                <!-- <span class="text-muted small">sentiment</span> -->
                <b-form-checkbox-group v-model="formFilters.sentiment" :options="sentimentOptions" />
              </b-form-group>
            </b-col>
            <b-col cols="12" md="6" class="d-none">
              <b-form-group label="" label-for="accounts" class="pr-md-3">
                <b-form-tags id="accounts" v-model="formFilters.HashtagsInput" tag-variant="light" tag-pills size="md"
                  separator=" ,;" placeholder="ค้นหา hashtag" no-add-on-enter add-on-change remove-on-delete />
              </b-form-group>
            </b-col>
            <b-col cols="12" md="6"  class="d-none">
              <!-- Hashtags -->
              <b-form-group label="" label-for="accounts" class="pr-md-3">
                <b-form-tags id="accounts" v-model="formFilters.accountsInput" tag-variant="light" tag-pills size="md"
                  separator=",;" placeholder="ค้นหาบัญชี (ใส่ uid หรือ url หลายบัญชีคั่นด้วย ,)" no-add-on-enter
                  add-on-change remove-on-delete />
              </b-form-group>

            </b-col>

            <b-col cols="12" md="4">
              <v-select :options="sourceOptions" v-model="formFilters.source" id="search-input" label="text"
                :reduce="source => source.value" class="mb-2 select-sort" placeholder="Select Platform"
                multiple></v-select>
            </b-col>

            <b-col cols="12" md="4">

              <b-form-select v-model="formFilters.sort_by" class="mb-2" :options="[
                { value: 'descend', text: 'โพสต์เก่าสุด' },
                { value: 'recent', text: 'โพสต์ล่าสุด' },
                { value: 'engagement', text: 'Engagement' },
              ]" />

            </b-col>
            <b-col cols="12" md="4">
              <section id="date-picker">
                <date-picker v-model="valueDate" type="date" range placeholder="เลือกช่วงเวลา" class="w-100" size="sm"
                  :disabled-date="(date) => date >= new Date()" value-type="format" format="YYYY-MM-DD"
                  @change="checkDateRange()" id="date-domain">{{ valueDate }}</date-picker>
              </section>
            </b-col>



          </b-row>

          <b-row align-h="end" class="mt-2" justify="center">
            <b-col cols="auto" md="auto" align="center" justify="center">

              <b-form-group class="pr-md-3">

                <b-form-radio-group v-model="formFilters.view_mode" :options="[
                  { value: 'posts', text: 'ตามเวลา' },
                  { value: 'daily', text: 'รายวัน' },
                ]" buttons button-variant="outline-info" size="md" />
                <b-icon icon="info-circle" id="info-date-note" variant="info" role="button" class="flaot-right ml-2"
                  tabindex="0"></b-icon>

                <b-tooltip target="info-date-note" placement="right" triggers="hover focus click">
                  ถ้าเลือกมากกว่า 2 วัน ระบบจะตั้งค่าเริ่มต้นเป็น "รายวัน" และ เรียง "Engagement"
                </b-tooltip>
              </b-form-group>
            </b-col>
            <b-col cols="auto" md="auto">
              <div>
                <div class="align-self-end mb-3">
                  <b-button type="submit" variant="info" class=" px-4" :disabled="loading">
                    ค้นหา
                  </b-button>
                  <!-- <b-button variant="outline-secondary" @click="resetFilters" :disabled="loading">
                ล้างค่า
              </b-button> -->
                </div>
              </div>
            </b-col>
          </b-row>

        </b-form>
      </b-card>
      <!-- <ChartTime :filters="paramTo" @point-click="handlePointClick" @range-selected="handleRange" /> -->

      <!-- Loading -->

      <div class="text-center my-4 py-4" v-if="loading">
        <vue-element-loading :active="loading" size="80" background-color="rgba(255, 255, 255, 0.5)"
          color="#17a2b891" />
      </div>
      <!-- Timeline -->
      <timeline-posts :items="postsFromApi" :mode="filters.view_mode" :sort="filters.sort_by" @loadMoreDay="loadMoreDay"
        @changeDaySort="changeDaySort" :count="count" v-else />
      <div v-if="filters.view_mode === 'posts' && !loading && filters.page < totalPages" class="text-center my-2 pb-5">
        <div class="text-center mb-3 py-5" v-if="loadingMore">
          <vue-element-loading :active="loadingMore" size="80" background-color="rgba(255, 255, 255, 0.5)"
            color="#17a2b891" />
        </div>
        <b-button variant="outline-info" @click="loadMorePosts" pill v-else>
          <span> <i class="fa fa-plus" aria-hidden="true"></i> More</span>
        </b-button>
      </div>


      <back-to-top bottom="50px" right="50px">
        <button type="button" class="btn btn-to-top">
          <i class="fa fa-chevron-up"></i>
        </button>
      </back-to-top>
    </div>
  </div>
</template>

<script>
import HomeNav from "@/components/HomeNav.vue";
import LinkMain2 from "@/components/linknode/LinkMain2.vue";
import TimelinePosts from "@/components/linknode/TimelinePosts2.vue";
import { mapGetters } from "vuex";
import ChartTime from "@/components/linknode/ChartTime.vue";
import "vue-select/dist/vue-select.css";
import moment from "moment";
export default {
  components: { HomeNav, LinkMain2, TimelinePosts, ChartTime },
  watch: {
    'formFilters.source'(val, old) {
      const toArr = (x) => Array.isArray(x) ? x : (x == null ? [] : [x]);
      const arr = toArr(val);
      const oldArr = toArr(old);

      // กรณีไม่ได้เลือกอะไรเลย -> กลับไป All
      if (arr.length === 0) {
        this.formFilters.source = [null];
        return;
      }

      // ถ้ามีทั้ง null และอย่างอื่นอยู่พร้อมกัน
      if (arr.includes(null) && arr.length > 1) {
        const clickedAllJustNow = !oldArr.includes(null); // null ถูกเพิ่มมาใหม่ในรอบนี้
        if (clickedAllJustNow) {
          // ผู้ใช้เพิ่งกด All -> clear อื่น เหลือ All
          this.formFilters.source = [null];
        } else {
          // ผู้ใช้เพิ่งกด platform อื่น ในขณะที่มี All อยู่ -> เอา All ออก
          this.formFilters.source = arr.filter(v => v !== null);
        }
        return;
      }
    }
  }
  ,
  data() {
    return {

      paramTo: {},
      dayLoadingMap: {},
      dayPageMap: {},      // { '2025-08-26': 1, ... }
      dayLimitMap: {},     // { '2025-08-26': 10, ... } (ถ้าต้องการปรับต่อวัน)
      daySortMap: {},      // { '2025-08-26': 'engagement' | 'descend' | 'recent' }
      loading: false,
      loadingMore: false,
      postsFromApi: [],
      count: 0,
      totalPages: 0,
      observer: null,
      valueDate: [
        moment(new Date()).format("YYYY-MM-DD"),
        moment(new Date()).format("YYYY-MM-DD")
      ],
      filters: {
        sentiment: ["1", "0", "-1"],
        keywordInput: "",
        view_mode: "posts",
        source: [null],
        sort_by: "recent",
        limit: 50,
        page: 1,
        hashtags: []
      },
      formFilters: {
        sentiment: ["1", "0", "-1"],
        keywordInput: "",
        view_mode: "posts",
        source: [null],
        sort_by: "recent",
        limit: 50,
        page: 1,
        accountsInput: [],
        HashtagsInput: []
      },
      sentimentOptions: [
        { text: "Positive", value: "1" },
        { text: "Neutral", value: "0" },
        { text: "Negative", value: "-1" }
      ],
      sourceOptions: [
        { value: null, text: "All Platform" },
        { value: "facebook", text: "Facebook" },
        { value: "twitter", text: "X" },
        { value: "pantip", text: "Board" },
        { value: "news", text: "News" },
        { value: "youtube", text: "YouTube" },
        { value: "instagram", text: "Instagram" },
        { value: "blockdit", text: "Blockdit" },
        { value: "tiktok", text: "Tiktok" },
        { value: "threads", text: "Threads" }
      ]
    };
  },
  computed: {
    ...mapGetters(["getSelected", "getSentimentChart", "getWordCloud", "getDomain", "getLoadStatus", "getToSection"])
  },
  mounted() {
    if (!this.valueDate[0]) {
      this.filters.startLocal = moment(new Date()).format("YYYY-MM-DD") + "T00:00:00";
      this.filters.endLocal = moment(new Date()).format("YYYY-MM-DD") + "T23:59:59";
    } else {
      this.filters.startLocal = this.valueDate[0] + "T00:00:00";
      this.filters.endLocal = this.valueDate[1] + "T23:59:59";
    }
    const domain = localStorage.getItem("domainArr");
    this.$store.commit("setDomainArr", domain);
    this.apiTimeline();
    this.$nextTick(() => this.createObserver());
  },
  beforeDestroy() {
    if (this.observer) this.observer.disconnect();
  },
  methods: {
    applyRangeAndReload(startIso, endIso) {
      // คงฟิลเตอร์เดิมทุกอย่าง เปลี่ยนเฉพาะช่วงเวลา + รีเซ็ตหน้า
      this.filters = {
        ...this.filters,
        page: 1,
        startLocal: startIso,
        endLocal: endIso,
      };

      // ถ้าเป็นโหมดรายวัน เคลียร์แคชรายวันและตั้งค่า valueDate ให้ตรงวัน
      if (this.filters.view_mode === 'daily') {
        this.dayPageMap = {};
        this.dayLimitMap = {};
        this.daySortMap = {};
        this.valueDate = [startIso.slice(0, 10), endIso.slice(0, 10)];
      }

      this.postsFromApi = [];
      this.apiTimeline();
    },
    handlePointClick({ seriesName, x, y, localText, isoUtc, isoLocal }) {
      console.log('Clicked:', seriesName, y, localText, isoLocal.slice(0, 14))
      let date = isoLocal.slice(0, 14)
      const hourStart = date + "00:00";
      const hourEnd = date + "59:59";

      // อัปเดตช่วงใน filters (ไม่ยุ่งกับ valueDate และ paramTo)
      this.filters = {
        ...this.filters,
        page: 1,
        startLocal: hourStart,
        endLocal: hourEnd,
      };

      // ถ้าโหมดรายวัน เคลียร์แคชเฉพาะโพสต์
      if (this.filters.view_mode === 'daily') {
        this.dayPageMap = {};
        this.dayLimitMap = {};
        this.daySortMap = {};
      }

      this.postsFromApi = [];
      this.apiTimelineSilent(); // ✅ โหลดเฉพาะโพสต์ กราฟ “ไม่” รีโหลด

      // this.applyRangeAndReload(hourStart, hourEnd);
    },
    handleRange({ start, end, startIsoLocal, endIsoLocal }) {
      console.log('Selected range:', startIsoLocal.slice(0, 16), endIsoLocal.slice(0, 16))
      const startIso = startIsoLocal.slice(0, 16)
      const endIso = endIsoLocal.slice(0, 16)
      this.filters = {
        ...this.filters,
        page: 1,
        startLocal: startIso,
        endLocal: endIso,
      };

      if (this.filters.view_mode === 'daily') {
        this.dayPageMap = {};
        this.dayLimitMap = {};
        this.daySortMap = {};
      }

      this.postsFromApi = [];
      this.apiTimelineSilent(); // ✅ โหลดเฉพาะโพสต์

    },
    diffDays(startYMD, endYMD) {
      const s = moment(startYMD, "YYYY-MM-DD");
      const e = moment(endYMD, "YYYY-MM-DD");
      // จำนวนวันแบบ inclusive
      return e.diff(s, "days") + 1;
    },

    checkDateRange() {
      const startYMD = this.valueDate?.[0];
      const endYMD = this.valueDate?.[1];
      if (!startYMD || !endYMD) return;

      const days = this.diffDays(startYMD, endYMD);

      // > 2 วัน → ตั้งค่าเริ่มต้นให้เป็นรายวัน + engagement (แค่ครั้งนี้ ไม่ล็อก)
      if (days > 2) {
        if (this.formFilters.view_mode !== 'daily') {
          this.formFilters.view_mode = 'daily';
        }
        if (this.formFilters.sort_by !== 'engagement') {
          this.formFilters.sort_by = 'engagement';
        }
      }
      // ถ้าน้อยกว่าหรือเท่ากับ 2 วัน ไม่ไปยุ่งค่าที่ผู้ใช้ตั้ง
    },
    sourceParam(list) {
      const arr = Array.isArray(list) ? list : (list == null ? [] : [list]);
      // ถ้าเลือก All (null) หรือไม่มีอะไรเลย -> ไม่ต้องส่ง source
      if (arr.length === 0 || arr.includes(null)) return undefined;
      return arr.join(',');
    },

    buildKeywordParam() {
      const raw = (this.filters.keywordInput || "").trim();
      if (!raw) return "";
      return raw
        .split(",")
        .map((g) => g.trim().split(/[+\s]+/).filter(Boolean).join("+"))
        .join(",");
    },
    buildParamsForDay(ymd, overrides = {}) {
      const sortRaw = overrides.sort_by ?? this.daySortMap[ymd] ?? this.filters.sort_by;
      const page = overrides.page ?? this.dayPageMap[ymd] ?? 1;
      const limit = overrides.limit ?? this.dayLimitMap[ymd] ?? 10;

      const p = {
        sentiment: this.filters.sentiment.join(","),
        keyword: this.buildKeywordParam(),
        source: this.sourceParam(this.filters.source),
        // ถ้า 'recent' ให้ไม่ส่ง (ตามโค้ดเดิมของคุณ)
        sort_by: sortRaw === "recent" ? undefined : sortRaw,
        limit,
        page,
        start: `${ymd}T00:00:00`,
        end: `${ymd}T23:59:59`,
      };
      // ✅ เพิ่ม filters รายวันด้วย
      if (this.filters?.accounts?.length) p.account = this.filters.accounts;
      if (this.filters?.hashtags?.length) p.hashtags = this.filters.hashtags;
      Object.keys(p).forEach((k) => (p[k] == null || p[k] === "") && delete p[k]);

      return p;
    },
    buildParamsForDay2(strat, end, overrides = {}) {
      const sortRaw = this.filters.sort_by;
      // const page = overrides.page ?? this.dayPageMap[ymd] ?? 1;
      // const limit = overrides.limit ?? this.dayLimitMap[ymd] ?? 10;

      const p = {
        sentiment: this.filters.sentiment.join(","),
        keyword: this.buildKeywordParam(),
        source: this.sourceParam(this.filters.source),
        // ถ้า 'recent' ให้ไม่ส่ง (ตามโค้ดเดิมของคุณ)
        sort_by: sortRaw === "recent" ? undefined : sortRaw,
        start: `${strat}T00:00:00`,
        end: `${end}T23:59:59`,
      };
      // ✅ ให้ ChartTime เห็น hashtags/accounts ด้วย
      if (this.filters?.accounts?.length) p.account = this.filters.accounts;
      if (this.filters?.hashtags?.length) p.hashtags = this.filters.hashtags;
      this.paramTo = p

      return p;
    },

    async apiTimeline() {
      if (this.filters.view_mode === 'daily') return this.apiTimelineDaily();
      this.loading = true;
      try {
        const params = this.buildParams();
        const { data } = await this.axios.get("https://api2.cognizata.com/api/v2/userposts/getFulltextPost", { params });
        this.postsFromApi = data.data || [];
        this.count = data.count || 0;
        this.totalPages = data.totalPages || Math.ceil(this.count / this.filters.limit);
      } catch (e) {
        console.error(e);
        this.postsFromApi = [];
        this.count = 0;
        this.totalPages = 0;
      } finally {
        this.loading = false;
      }
    },
    async apiTimelineDaily() {
      this.loading = true;
      try {
        // ใช้ startLocal/endLocal ถ้ามี ไม่งั้น fallback เป็น valueDate
        const startIso = this.filters.startLocal || (this.valueDate?.[0] + "T00:00:00");
        const endIso = this.filters.endLocal || (this.valueDate?.[1] + "T23:59:59");

        const startYMD = startIso.slice(0, 10);
        const endYMD = endIso.slice(0, 10);

        const days = this.getDaysInclusive(startYMD, endYMD);
        const grouped = [];
        this.buildParamsForDay2(startYMD, endYMD);

        for (const ymd of days) {
          if (!this.dayPageMap[ymd]) this.$set(this.dayPageMap, ymd, 1);
          this.$set(this.daySortMap, ymd, this.filters.sort_by);
          if (!this.dayLimitMap[ymd]) this.$set(this.dayLimitMap, ymd, 10);

          const params = this.buildParamsForDay(ymd);

          try {
            const { data } = await this.axios.get(
              "https://api2.cognizata.com/api/v2/userposts/getFulltextPost",
              { params }
            );
            const items = data?.data || [];
            const countTotal = (typeof data?.count === 'number') ? data.count : items.length;

            grouped.push({
              date: ymd,
              items,
              _hasMore: items.length >= (params.limit || 10),
              countTotal,
              countShown: items.length,
            });
          } catch (err) {
            console.warn("daily error", ymd, err);
            grouped.push({
              date: ymd,
              items: [],
              _hasMore: false,
              countTotal: 0,
              countShown: 0,
            });
          }
        }

        this.postsFromApi = grouped;
        this.count = grouped.reduce((sum, d) => sum + (d.countTotal || 0), 0);
        this.totalPages = 0;
      } finally {
        this.loading = false;
      }
    },

    async loadMoreDay({ date }) {
      this.$store.commit("setLoadCardPost", true)
      this.$set(this.dayLoadingMap, date, true);
      const cur = this.dayPageMap[date] || 1;
      this.$set(this.dayPageMap, date, cur + 1);

      const params = this.buildParamsForDay(date, { page: cur + 1 });
      try {
        const { data } = await this.axios.get(
          "https://api2.cognizata.com/api/v2/userposts/getFulltextPost",
          { params }
        );
        const more = data?.data || [];

        const i = this.postsFromApi.findIndex(d => d.date === date);
        if (i !== -1) {
          const old = this.postsFromApi[i].items || [];
          const oldIds = new Set(old.map(p => p._id || `${p.source}:${p.url_post}`));
          const moreNoDup = more.filter(p => !oldIds.has(p._id || `${p.source}:${p.url_post}`));
          const merged = [...old, ...moreNoDup];

          this.$set(this.postsFromApi[i], 'items', merged);
          this.$set(this.postsFromApi[i], '_hasMore', more.length >= (params.limit || 10));
          // ✅ อัปเดตจำนวนที่แสดง
          this.$set(this.postsFromApi[i], 'countShown', merged.length);
          // (ไม่ต้องอัปเดต countTotal ถ้า API ส่งมาอยู่แล้ว; ถ้าอยากอัปเดตก็ใช้ data.count ?? เดิม)
        }
        this.$set(this.dayLoadingMap, date, false);
        this.$store.commit("setLoadCardPost", false)
      } catch (e) {
        console.error("loadMoreDay error", e);
      }
    },

    async changeDaySort({ date, sort_by }) {
      this.$store.commit("setLoadCardPost", true)
      this.$set(this.dayLoadingMap, date, true);
      this.$set(this.daySortMap, date, sort_by);
      this.$set(this.dayPageMap, date, 1);

      const params = this.buildParamsForDay(date, { page: 1, sort_by });
      try {
        const { data } = await this.axios.get(
          "https://api2.cognizata.com/api/v2/userposts/getFulltextPost",
          { params }
        );
        const rows = data?.data || [];
        const i = this.postsFromApi.findIndex(d => d.date === date);
        if (i !== -1) {
          this.$set(this.postsFromApi[i], 'items', rows);
          this.$set(this.postsFromApi[i], '_hasMore', rows.length >= (params.limit || 10));
          // ✅ reset countShown ตามของใหม่
          this.$set(this.postsFromApi[i], 'countShown', rows.length);
          // ✅ (อัปเดต countTotal ถ้า API ให้มา)
          if (typeof data?.count === 'number') {
            this.$set(this.postsFromApi[i], 'countTotal', data.count);
          }
        }
        this.$store.commit("setLoadCardPost", false)
        this.$set(this.dayLoadingMap, date, false);
      } catch (e) {
        console.error("changeDaySort error", e);
      }
    },

    getDaysInclusive(startYMD, endYMD) {
      const days = [];
      let cur = moment(startYMD, "YYYY-MM-DD");
      const end = moment(endYMD, "YYYY-MM-DD");
      while (cur.isSameOrBefore(end, "day")) {
        days.push(cur.clone().format("YYYY-MM-DD"));
        cur = cur.add(1, "day");
      }
      return days;
    },
    buildParams(opts = {}) {
      const { silent = false } = opts;
      const start = this.filters.startLocal || (this.valueDate[0] + "T00:00:00");
      const end = this.filters.endLocal || (this.valueDate[1] + "T23:59:59");

      const p = {
        sentiment: this.filters.sentiment.join(","),
        keyword: this.buildKeywordParam(),
        start,
        end,
        source: this.sourceParam(this.filters.source),
        sort_by: this.filters.sort_by === "recent" ? undefined : this.filters.sort_by,
        limit: this.filters.limit,
        page: this.filters.page
      };
      if (this.filters?.accounts?.length) {
        p.account = this.filters.accounts; // หรือ 'accounts[]' ตามรูปแบบที่ backend รับ
      }
      if (this.filters?.hashtags?.length) p.hashtags = this.filters.hashtags;

      Object.keys(p).forEach((k) => (p[k] == null || p[k] === "") && delete p[k]);

      if (!silent) this.paramTo = p; // ✅ ปล่อยให้ ChartTime อัปเดตเฉพาะตอน “ไม่เงียบ”
      return p;
    },
    async apiTimelineSilent() {
      if (this.filters.view_mode === 'daily') return this.apiTimelineDailySilent();
      this.loading = true;
      try {
        const params = this.buildParams({ silent: true }); // ✅ ไม่เซ็ต paramTo
        const { data } = await this.axios.get(
          "https://api2.cognizata.com/api/v2/userposts/getFulltextPost",
          { params }
        );
        this.postsFromApi = data.data || [];
        this.count = data.count || 0;
        this.totalPages = data.totalPages || Math.ceil(this.count / this.filters.limit);
      } catch (e) {
        console.error(e);
        this.postsFromApi = [];
        this.count = 0;
        this.totalPages = 0;
      } finally {
        this.loading = false;
      }
    },

    async apiTimelineDailySilent() {
      this.loading = true;
      try {
        // ใช้ช่วงเวลาจริงจาก filters.startLocal/endLocal ถ้ามี (ไม่แตะ paramTo)
        const startIso = this.filters.startLocal || (this.valueDate?.[0] + "T00:00:00");
        const endIso = this.filters.endLocal || (this.valueDate?.[1] + "T23:59:59");

        const startYMD = startIso.slice(0, 10);
        const endYMD = endIso.slice(0, 10);

        const days = this.getDaysInclusive(startYMD, endYMD);
        const grouped = [];

        // ❌ ไม่เรียก buildParamsForDay2() (ตัวนั้นไปตั้ง this.paramTo)
        for (const ymd of days) {
          if (!this.dayPageMap[ymd]) this.$set(this.dayPageMap, ymd, 1);
          this.$set(this.daySortMap, ymd, this.filters.sort_by);
          if (!this.dayLimitMap[ymd]) this.$set(this.dayLimitMap, ymd, 10);

          const params = this.buildParamsForDay(ymd); // อันนี้ปลอดภัย ไม่แตะ paramTo
          try {
            const { data } = await this.axios.get(
              "https://api2.cognizata.com/api/v2/userposts/getFulltextPost",
              { params }
            );
            const items = data?.data || [];
            const countTotal = (typeof data?.count === 'number') ? data.count : items.length;

            grouped.push({
              date: ymd,
              items,
              _hasMore: items.length >= (params.limit || 10),
              countTotal,
              countShown: items.length,
            });
          } catch (err) {
            console.warn("daily silent error", ymd, err);
            grouped.push({
              date: ymd,
              items: [],
              _hasMore: false,
              countTotal: 0,
              countShown: 0,
            });
          }
        }

        this.postsFromApi = grouped;
        this.count = grouped.reduce((sum, d) => sum + (d.countTotal || 0), 0);
        this.totalPages = 0;
      } finally {
        this.loading = false;
      }
    },


    async loadMorePosts() {
      if (this.filters.page >= this.totalPages) return;
      this.loadingMore = true;
      this.filters.page += 1;

      try {
        // ใช้ silent เพื่อไม่แตะ paramTo → ChartTime ไม่รีเฟรช
        const params = this.buildParams({ silent: true });
        const { data } = await this.axios.get(
          "https://api2.cognizata.com/api/v2/userposts/getFulltextPost",
          { params }
        );
        const newItems = data.data || [];
        this.postsFromApi = [...this.postsFromApi, ...newItems];
        this.totalPages = data.totalPages ?? this.totalPages;
        this.count = data.count ?? this.count;
      } catch (e) {
        console.error(e);
      } finally {
        this.loadingMore = false;
      }
    }
    ,
    createObserver() {
      const options = { root: null, rootMargin: "0px", threshold: 1.0 };
      this.observer = new IntersectionObserver(this.handleIntersect, options);
      const target = this.$refs.loadMoreTrigger;
      if (target) this.observer.observe(target);
    },
    handleIntersect(entries) {
      const entry = entries[0];
      if (entry.isIntersecting && !this.loadingMore && this.filters.page < this.totalPages) {
        this.filters.page++;
        this.loadMorePosts();
      }
    },
    handleSearch() {
      const next = { ...this.filters, ...this.formFilters, page: 1 };

      // อิง inputdate ด้านบนเสมอ
      const startYMD = this.valueDate?.[0] || moment().format("YYYY-MM-DD");
      const endYMD = this.valueDate?.[1] || startYMD;
      next.startLocal = `${startYMD}T00:00:00`;
      next.endLocal = `${endYMD}T23:59:59`;

      // ✅ แปลง accountsInput -> accounts (อาเรย์) รองรับทั้ง array และ string
      const rawAcc = next.accountsInput;
      const accounts = Array.isArray(rawAcc)
        ? rawAcc
        : String(rawAcc || "")
          .split(",")
          .map(s => s.trim())
          .filter(Boolean);

      next.accounts = [...new Set(accounts.map(s => s.replace(/^@/, "")))]
      console.log(' next.accounts', next.accounts);

      // ✅ hashtags (ใหม่): รองรับ array / string, ตัด '#', lower-case, dedupe
      const rawTags = next.HashtagsInput;
      const tags = Array.isArray(rawTags)
        ? rawTags
        : String(rawTags || "")
          .split(",")
          .map(s => s.trim())
          .filter(Boolean);
      next.hashtags = [...new Set(tags.map(t => t.replace(/^#/, "").toLowerCase()))];

      this.filters = next;

      // โหมดรายวัน เคลียร์แคชรายวัน
      if (this.filters.view_mode === 'daily') {
        this.dayPageMap = {};
        this.dayLimitMap = {};
        this.daySortMap = {};
      }

      // อัปเดตคีย์เวิร์ด (ของเดิม)
      // const inputkeyword = (this.filters.keywordInput || "")
      //   .split(",")
      //   .map(group => group.trim().split(/\s+|\+/).filter(Boolean))
      //   .flat();
      // this.$store.commit("setSearchWords", inputkeyword);

      // อัปเดตรวม keyword + hashtags + accounts
      const inputkeyword = (this.filters.keywordInput || "")
        .split(",")
        .map(group => group.trim().split(/\s+|\+/).filter(Boolean))
        .flat();

      // ใช้ค่าที่ normalize แล้วจาก next (ตัด #/@ และ dedupe แล้ว)
      const hashtagList = next.hashtags || [];   // เดิมใช้ชื่อ tags → ชนกับตัวแปรก่อนหน้า
      const accountList = next.accounts || [];

      // รวมทุกอย่าง พร้อมเวอร์ชันมี prefix
      const searchWords = Array.from(new Set([
        ...inputkeyword,

        ...hashtagList.map(t => `#${t}`),
       
        ...accountList.map(a => `${a}`)
      ].filter(Boolean)));

      this.$store.commit("setSearchWords", searchWords);



      // โหลดใหม่ปกติ
      this.postsFromApi = [];
      this.apiTimeline();
    }



  }
};
</script>

<style scoped>
.mx-datepicker-range {
  width: 100% !important;
}

* {
  font-family: "Prompt", "FontAwesome", sans-serif;
}

#navHome {
  z-index: 1;
}

.container {
  max-width: 1200px;
}

/* ปรับหน้าตาเล็กน้อย */
.b-form-group {
  min-width: 220px;
}

.btn-to-top {
  width: 60px;
  height: 60px;
  padding: 10px 16px;
  border-radius: 50%;
  font-size: 22px;
  line-height: 22px;
  background-color: #fed16e;
  border-color: #fed16e;
  color: #fff;
  box-shadow: 2px 1px 4px #888888;
}

.btn-to-top:hover {
  background-color: #f7c24e;
  border-color: #f7c24e;
  color: #fff;
}

.mx-input {
  display: inline-block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 38.5px !important;
  ;
  padding: 6px 30px;
  padding-left: 10px;
  font-size: 14px;
  line-height: 1.4;
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, .0);
}

@media only screen and (min-width: 0) and (max-width:1100px) {
  .checkbox-v {
    zoom: 85%
  }
}

/* จอมือถือ */
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .vue-back-to-top {
    right: 14px !important;
  }

  .btn-to-top {
    width: 50px;
    height: 50px;
    padding: 10px 13px;

  }

  #overflow-page>div.container.my-3>div.card.mb-3.shadow-sm>div>form>div.row.mt-2.justify-content-end {
    zoom: 87% !important;
    width: 100% !important;
  }

  .checkbox-v {
    zoom: 85%
  }
}
</style>
