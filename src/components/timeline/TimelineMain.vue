<template>
  <div>
    <div class="container my-3">
      
      <div class="position-relative text-right filter-btn">
        <b-button size="sm" :variant="showFilters ? 'info' : 'outline-info'" @click="showFilters = !showFilters" pill
          class="d-inline-flex align-items-center">
          <i class="fas fa-sliders mr-2"></i>
          <span v-if="showFilters" class="small">Hide</span>
          <span v-else class="small">Show</span>
        </b-button>
      </div>

      <!-- Active filter summary bar -->
      <div class="py-2 px-2 shadow-sm card-hide" style="border-radius: 20px;" v-if="!showFilters && hasAnyPretty">
        <div class="d-flex flex-wrap align-items-center">
          <div v-if="pretty.keyword" class="mr-2 my-1 bold">
            <b-icon icon="search" class="mr-1"></b-icon> {{ pretty.keyword }}
          </div>
          <div v-if="pretty.keyword && (pretty.exclude || pretty.hashtags.length)" class="mr-2 my-1"> / </div>
          <div v-if="pretty.exclude" class="mr-2 my-1 text-muted text-small">
            <b-icon icon="x-circle" class="mr-1" variant="danger"></b-icon>{{ pretty.exclude }}
          </div>
          <div v-if="pretty.exclude && pretty.hashtags.length" class="mr-2 my-1"> / </div>
          <div v-for="h in pretty.hashtags" :key="h" class="mr-2 my-1">#{{ h }}</div>
          <span v-if="pretty.sentiments.length !== 3" class="">
            <b-badge pill variant="light" class="mr-2 py-2 my-1">
              <span v-for="(s, i) in pretty.sentiments" :key="s.value">
                <b-icon :icon="s.icon" class="mr-1"></b-icon>{{ s.text }}<span v-if="i > 1"> / </span>
              </span>
            </b-badge>
          </span>
          <b-badge v-if="pretty.sourceText"  pill variant="light" class="mr-2 py-2 my-1">
            <b-icon icon="collection" class="mr-1"></b-icon>{{ pretty.sourceText }}
          </b-badge>
          <b-badge v-if="pretty.viewMode"    pill variant="light" class="mr-2 py-2 my-1">{{ pretty.viewMode }}</b-badge>
          <b-badge v-if="pretty.sortBy"      pill variant="light" class="mr-2 py-2 my-1">
            <b-icon icon="sort-down" class="mr-1"></b-icon>{{ pretty.sortBy }}
          </b-badge>
          <b-badge v-if="pretty.dateRange"   pill variant="light" class="mr-2 py-2 my-1">
            <b-icon icon="calendar-date" class="mr-1"></b-icon>{{ pretty.dateRange }}
          </b-badge>
          <span>
            <b-badge v-if="newsSourceLabel" pill variant="light" class="mr-2 py-2 my-1">
              <i class="fas fa-earth-africa mr-1"></i> {{ newsSourceLabel }}
            </b-badge>
          </span>
        </div>
      </div>

      <!-- Filter form -->
      <b-card class="mb-3 shadow-sm no-print" style="border-radius: 20px;" v-if="showFilters">
        <b-alert show variant="info" class="no-print">
          <div class="text-left">
            <b-icon icon="info-circle" variant="info"></b-icon>
            <small>คำค้นหา (AND ใช้ช่องว่างหรือ +, OR ใช้ ,)
              <span class="text-muted"> ตัวอย่าง: <code>คาเฟ่ บรรยากาศดี, มัทฉะ อร่อย</code> = (คาเฟ่ AND บรรยากาศดี) OR (มัทฉะ AND อร่อย)</span>
            </small>
          </div>
        </b-alert>

        <b-form @submit.prevent="handleSearch">
          <b-row>
            <b-col cols="12" md="6">
              <b-form-group label-for="kw">
                <b-form-input id="kw" v-model.trim="formFilters.keywordInput"
                  placeholder="คำค้นหา เช่น คาเฟ่ บรรยากาศดี,มัทฉะ อร่อย" />
              </b-form-group>
            </b-col>
            <b-col cols="12" md="6">
              <b-form-group label-for="exclude-kw">
                <b-form-input id="exclude-kw" v-model.trim="formFilters.excludeKeywordInput"
                  placeholder="ยกเว้นคำ (คั่นด้วย ,) เช่น โฆษณา, สปอนเซอร์" />
              </b-form-group>
            </b-col>
            <b-col cols="12" md="6">
              <b-form-group label-for="hashtags">
                <b-form-tags id="hashtags" v-model="formFilters.HashtagsInput" tag-variant="light" tag-pills size="md"
                  separator=" ,;" placeholder="ค้นหา hashtag" no-add-on-enter add-on-change remove-on-delete class="input-tag" />
              </b-form-group>
            </b-col>
            <b-col cols="12" md="6">
              <b-form-group label-for="accounts">
                <b-form-tags id="accounts" v-model="formFilters.accountsInput" tag-variant="light" tag-pills size="md"
                  separator=",;" placeholder="ค้นหาบัญชี (ใส่ชื่อบัญชี หลายบัญชีคั่นด้วย ,)" no-add-on-enter
                  add-on-change remove-on-delete class="input-tag" />
              </b-form-group>
            </b-col>
            <b-col cols="12" md="4">
              <v-select :options="sourceOptions" v-model="formFilters.source" id="search-source" label="text"
                :reduce="source => source.value" class="mb-2 select-sort" placeholder="Select Platform" multiple></v-select>
            </b-col>
            <b-col cols="12" md="4">
              <b-form-select v-model="formFilters.sort_by" class="mb-2" :options="[
                { value: 'descend',    text: 'โพสต์เก่าสุด' },
                { value: 'recent',     text: 'โพสต์ล่าสุด' },
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
            <b-col cols="auto" md="auto" align="center" justify="center" class="text-right">
              <b-form-group class="checkbox-v mt-1">
                <b-form-checkbox-group v-model="formFilters.sentiment" :options="sentimentOptions" />
              </b-form-group>
            </b-col>
            <b-col cols="auto" md="auto" align="center" justify="center" class="mb-2">
              <b-dropdown variant="outline-info">
                <template #button-content>
                  <i class="fas fa-earth-africa mr-1"></i>
                  {{ newsSourceLabel }}
                </template>
                <b-dropdown-item @click="setNewsSource('all')">ทั้งหมด</b-dropdown-item>
                <b-dropdown-item @click="setNewsSource('internal')">ข่าว <b>ในประเทศ</b></b-dropdown-item>
                <b-dropdown-item @click="setNewsSource('external')">ข่าว <b>ต่างประเทศ</b></b-dropdown-item>
              </b-dropdown>
            </b-col>
            <b-col cols="auto" md="auto" align="center" justify="center">
              <b-form-group class="pr-md-3">
                <b-form-radio-group v-model="formFilters.view_mode" :options="[
                  { value: 'posts', text: 'ตามเวลา' },
                  { value: 'daily', text: 'รายวัน' },
                ]" buttons button-variant="outline-info" size="md" />
                <b-icon icon="info-circle" id="info-date-note" variant="info" role="button" class="flaot-right ml-2" tabindex="0"></b-icon>
                <b-tooltip target="info-date-note" placement="right" triggers="hover focus click">
                  ถ้าเลือกมากกว่า 2 วัน ระบบจะตั้งค่าเริ่มต้นเป็น "รายวัน" และ เรียง "Engagement"
                </b-tooltip>
              </b-form-group>
            </b-col>
            <b-col cols="auto" md="auto">
              <div class="align-self-end mb-3">
                <b-button type="submit" variant="info" class="px-4" :disabled="loading">ค้นหา</b-button>
              </div>
            </b-col>
          </b-row>
        </b-form>
      </b-card>
      <b-row class=" justify-content-between my-4 mx-0 no-print">
        <h5>ผลลัพธ์</h5>
        <PrintButton
          class=""
          :disabled="Array.isArray(postsFromApi) && postsFromApi.length === 0"
          @before-print="showFilters = false" 
        /> 
      </b-row>
      <ChartTime
        :filters="paramTo"
        :postsForAnalysis="filters.keywordInput === '' && filters.hashtags.length === 0 ? postsFromApi : postsForAnalysis"
        @point-click="handlePointClick"
        @range-selected="handleRange"
        @filter-account="handleSearchAccount" 
      />

      <!-- <div class="d-flex align-items-end flex-wrap" v-if="!loading"> -->
        <ExportExcelButton
          class="no-print"
          :posts="postsFromApi"
          :filters="filters"
          :disabled="loading || (Array.isArray(postsFromApi) && postsFromApi.length === 0)"
          :full-export="true"
          :api-base="'https://api2.cognizata.com/api/v2/userposts/getFulltextPost'"
          :count="count"
          :prefer-single-shot="true"
          inline-comments="json"
          :comments-limit="20" 
        />

        
      <!-- </div> -->

      <!-- Loading spinner -->
      <div class="text-center my-4 py-4" v-if="loading">
        <vue-element-loading :active="loading" size="80" background-color="rgba(255, 255, 255, 0.5)" color="#17a2b891" />
      </div>

      <!-- Timeline -->
      <timeline-posts
        v-else
        ref="timelinePosts"
        :items="postsFromApi"
        :mode="filters.view_mode"
        :sort="filters.sort_by"
        :daily-loading="dailyLoading"
        :day-sort-map="daySortMap"
        @loadMoreDay="loadMoreDay"
        @changeDaySort="changeDaySort"
        @openDay="handleOpenDay"
        :count="count"
        class="nuxt-page"
      />

      <!-- Load more (posts mode) -->
      <div v-if="filters.view_mode === 'posts' && !loading && filters.page < totalPages" class="text-center my-2 pb-5">
        <div class="text-center mb-3 py-5" v-if="loadingMore">
          <vue-element-loading :active="loadingMore" size="80" background-color="rgba(255, 255, 255, 0.5)" color="#17a2b891" />
        </div>
        <b-button variant="outline-info" @click="loadMorePosts" pill v-else>
          <span><i class="fa fa-plus" aria-hidden="true"></i> More</span>
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
import TimelinePosts     from "@/components/timeline/TimelinePosts2.vue";
import ChartTime         from "@/components/timeline/ChartTime.vue";
import ExportExcelButton from "@/components/timeline/ExportExcelButton.vue";
import PrintButton       from "@/components/timeline/PrintButton.vue";
import { mapGetters }    from "vuex";
import "vue-select/dist/vue-select.css";
import moment from "moment";

const LS_NEWS_KEY = "newsSource";
const NEWS_SOURCE_VALUES = ["all", "internal", "external"];

function getSavedNewsSource() {
  const v = localStorage.getItem(LS_NEWS_KEY);
  return NEWS_SOURCE_VALUES.includes(v) ? v : "all";
}

// ✅ Sort ที่ใช้เป็นค่า default ตอนเปิด/ขยาย slider ของรายวัน (กดปุ่ม "สลับโพสต์")
const DEFAULT_DAY_OPEN_SORT = "engagement";

export default {
  components: { TimelinePosts, ChartTime, ExportExcelButton, PrintButton },

  data() {
    return {
      username: "",

      // UI state
      showFilters:  true,
      loading:      false,
      loadingMore:  false,
      dailyLoading: false,

      // Data
      postsFromApi:     [],
      postsForAnalysis: [],
      count:      0,
      totalPages: 0,
      paramTo:    {},

      // Per-day state
      dayLoadingMap: {},
      dayPageMap:    {},
      dayLimitMap:   {},
      daySortMap:    {},

      // Date range picker
      valueDate: [
        moment().format("YYYY-MM-DD"),
        moment().format("YYYY-MM-DD"),
      ],

      // Applied filters
      filters: {
        sentiment:           ["1", "0", "-1"],
        keywordInput:        "",
        excludeKeywordInput: "",
        view_mode:           "posts",
        source:              [null],
        source_news:         "all",
        sort_by:             "recent",
        limit:               50,
        page:                1,
        hashtags:            [],
        accounts:            [],
      },

      // Form state (not yet applied)
      formFilters: {
        sentiment:           ["1", "0", "-1"],
        keywordInput:        "",
        excludeKeywordInput: "",
        view_mode:           "posts",
        source:              [null],
        source_news:         "all",
        sort_by:             "recent",
        limit:               50,
        page:                1,
        accountsInput:       [],
        HashtagsInput:       [],
      },

      sentimentOptions: [
        { text: "Positive", value: "1"  },
        { text: "Neutral",  value: "0"  },
        { text: "Negative", value: "-1" },
      ],
      sourceOptions: [
        { value: null,        text: "All Platform" },
        { value: "facebook",  text: "Facebook"  },
        { value: "twitter",   text: "X"          },
        { value: "pantip",    text: "Board"      },
        { value: "news",      text: "News"       },
        { value: "youtube",   text: "YouTube"    },
        { value: "instagram", text: "Instagram"  },
        { value: "blockdit",  text: "Blockdit"   },
        { value: "tiktok",    text: "Tiktok"     },
        { value: "threads",   text: "Threads"    },
      ],
    };
  },

  // ─── Watch ───────────────────────────────────────────────────────────────────
  watch: {
    "formFilters.source"(val, old) {
      const toArr = x => Array.isArray(x) ? x : (x == null ? [] : [x]);
      const arr    = toArr(val);
      const oldArr = toArr(old);

      if (arr.length === 0) { this.formFilters.source = [null]; return; }

      if (arr.includes(null) && arr.length > 1) {
        const clickedAllJustNow = !oldArr.includes(null);
        this.formFilters.source = clickedAllJustNow
          ? [null]
          : arr.filter(v => v !== null);
      }
    },
  },

  // ─── Computed ────────────────────────────────────────────────────────────────
  computed: {
    ...mapGetters(["getSelected", "getSentimentChart", "getWordCloud", "getDomain", "getLoadStatus", "getToSection", "getSourceNewsTimeline"]),

    newsSourceLabel() {
      if (this.filters.source_news === "internal") return "ข่าวในประเทศ";
      if (this.filters.source_news === "external") return "ข่าวต่างประเทศ";
      return "ทั้งหมด";
    },

    pretty() {
      const f = this.filters || this.formFilters || {};
      const sentimentsMap = {
        "1":  { text: "บวก",  variant: "success",   icon: "emoji-smile"   },
        "0":  { text: "กลาง", variant: "secondary", icon: "emoji-neutral" },
        "-1": { text: "ลบ",   variant: "danger",    icon: "emoji-frown"   },
      };
      const sentiments = Array.isArray(f.sentiment)
        ? f.sentiment.filter(v => v != null && v !== "").map(v => ({ ...sentimentsMap[String(v)] || { text: v, variant: "secondary", icon: "emoji-neutral" }, value: v }))
        : [];
      const keyword    = String(f.keywordInput        || "").trim();
      const exclude    = String(f.excludeKeywordInput || "").trim();
      const hashtags   = (f.hashtags || f.HashtagsInput || []).filter(Boolean);
      const sourceList = Array.isArray(f.source) ? f.source.filter(s => s) : [];
      const sourceText = sourceList.join(", ");
      const viewModeMap = { posts: "ตามเวลา", daily: "รายวัน" };
      const viewMode    = viewModeMap[f.view_mode] || "";
      const sortMap = { descend: "โพสต์เก่าสุด", recent: "โพสต์ล่าสุด", engagement: "Engagement" };
      const sortBy  = sortMap[f.sort_by] || "";
      let dateRange = "";
      if (f.startLocal && f.endLocal) {
        dateRange = this.formatRange(f.startLocal, f.endLocal);
      } else if (Array.isArray(this.valueDate) && this.valueDate.length === 2) {
        dateRange = `${this.valueDate[0]} → ${this.valueDate[1]}`;
      }
      return { keyword, exclude, sentiments, hashtags, sourceText, viewMode, sortBy, dateRange };
    },

    hasAnyPretty() {
      const p = this.pretty;
      return !!(p.keyword || p.exclude || p.sentiments.length || p.hashtags.length || p.sourceText || p.viewMode || p.sortBy || p.dateRange);
    },
  },

  // ─── Lifecycle ───────────────────────────────────────────────────────────────
  mounted() {
    this.username = localStorage.getItem("username");

    const startYMD = this.valueDate[0] || moment().format("YYYY-MM-DD");
    const endYMD   = this.valueDate[1] || startYMD;
    this.filters.startLocal = `${startYMD}T00:00:00`;
    this.filters.endLocal   = `${endYMD}T23:59:59`;

    const domain = localStorage.getItem("domainArr");
    this.$store.commit("setDomainArr", domain);

    const savedNewsSource = getSavedNewsSource();
    this.$store.commit("setSourceNewsTimeline", savedNewsSource);
    this.filters.source_news     = savedNewsSource;
    this.formFilters.source_news = savedNewsSource;

    this.apiTimeline();

    if (this.filters.view_mode !== "daily") {
      this.apiGetPostForAnalysis();
    }
  },

  // ─── Methods ─────────────────────────────────────────────────────────────────
  methods: {

    // ── Helpers ──────────────────────────────────────────────────────────────

    setNewsSource(value) {
      localStorage.setItem(LS_NEWS_KEY, value);
      this.$store.commit("setSourceNewsTimeline", value);
      this.filters.source_news     = value;
      this.formFilters.source_news = value;
      this.handleSearch();
    },

    handleSearchAccount(val) {
      this.formFilters.accountsInput = val;
      this.handleSearch();
    },

    formatRange(start, end) {
      try {
        const opts  = { year: "numeric", month: "short", day: "numeric" };
        const sDate = new Date(start);
        const eDate = new Date(end);
        if (isNaN(sDate) || isNaN(eDate)) throw new Error("Invalid date");
        const sameDay = sDate.getFullYear() === eDate.getFullYear() &&
                        sDate.getMonth()    === eDate.getMonth()    &&
                        sDate.getDate()     === eDate.getDate();
        const s = sDate.toLocaleDateString("th-TH", opts);
        const e = eDate.toLocaleDateString("th-TH", opts);
        return sameDay ? s : `${s} – ${e}`;
      } catch {
        return start === end ? String(start) : `${start} – ${end}`;
      }
    },

    diffDays(startYMD, endYMD) {
      return moment(endYMD, "YYYY-MM-DD").diff(moment(startYMD, "YYYY-MM-DD"), "days") + 1;
    },

    checkDateRange() {
      const startYMD = this.valueDate?.[0];
      const endYMD   = this.valueDate?.[1];
      if (!startYMD || !endYMD) return;
      if (this.diffDays(startYMD, endYMD) > 2) {
        if (this.formFilters.view_mode !== "daily") this.formFilters.view_mode = "daily";
      }
    },

    // ✅ สร้าง array วันที่เรียงตาม sort_by
    // - recent / engagement → ล่าสุดก่อน (DESC)
    // - descend             → เก่าสุดก่อน (ASC)
    getDaysInclusive(startYMD, endYMD, sortBy = "recent") {
      const days = [];
      let cur = moment(startYMD, "YYYY-MM-DD");
      const end = moment(endYMD, "YYYY-MM-DD");
      while (cur.isSameOrBefore(end, "day")) {
        days.push(cur.clone().format("YYYY-MM-DD"));
        cur = cur.add(1, "day");
      }
      // descend = เก่าสุดก่อน (ASC) → คงลำดับเดิม
      // recent / engagement = ล่าสุดก่อน (DESC) → กลับลำดับ
      return sortBy === "descend" ? days : days.reverse();
    },

    sourceParam(list) {
      const arr = Array.isArray(list) ? list : (list == null ? [] : [list]);
      if (arr.length === 0 || arr.includes(null)) return undefined;
      return arr.join(",");
    },

    buildKeywordParam() {
      const raw = (this.filters.keywordInput || "").trim();
      if (!raw) return "";
      return raw.split(",").map(g => g.trim().split(/[+\s]+/).filter(Boolean).join("+")).join(",");
    },

    buildExcludeKeywordParam() {
      const raw = (this.filters.excludeKeywordInput || "").trim();
      if (!raw) return "";
      return raw.split(",").map(g => g.trim().split(/[+\s]+/).filter(Boolean).join("+")).join(",");
    },

    // ── Build params ─────────────────────────────────────────────────────────

    buildParams(opts = {}) {
      const { silent = false } = opts;
      const start = this.filters.startLocal || (this.valueDate[0] + "T00:00:00");
      const end   = this.filters.endLocal   || (this.valueDate[1] + "T23:59:59");

      const p = {
        sentiment:   this.filters.sentiment.join(","),
        keyword:     this.buildKeywordParam(),
        exclude:     this.buildExcludeKeywordParam(),
        start,
        end,
        source:      this.sourceParam(this.filters.source),
        source_news: this.filters.source_news === "all" ? undefined : this.filters.source_news,
        sort_by:     this.filters.sort_by === "recent"  ? undefined : this.filters.sort_by,
        limit:       this.filters.limit,
        page:        this.filters.page,
      };

      if (this.filters?.accounts?.length) p.account  = this.filters.accounts;
      if (this.filters?.hashtags?.length) p.hashtags = this.filters.hashtags;

      Object.keys(p).forEach(k => (p[k] == null || p[k] === "") && delete p[k]);

      if (!silent) this.paramTo = p;
      return p;
    },

    buildParamsForDay(ymd, overrides = {}) {
      const sortRaw = overrides.sort_by ?? this.daySortMap[ymd] ?? this.filters.sort_by;
      const page    = overrides.page    ?? this.dayPageMap[ymd]  ?? 1;
      const limit   = overrides.limit   ?? this.dayLimitMap[ymd] ?? 10;

      const p = {
        sentiment:   this.filters.sentiment.join(","),
        keyword:     this.buildKeywordParam(),
        exclude:     this.buildExcludeKeywordParam(),
        source:      this.sourceParam(this.filters.source),
        source_news: this.filters.source_news === "all" ? undefined : this.filters.source_news,
        sort_by:     sortRaw === "recent" ? undefined : sortRaw,
        limit,
        page,
        start: `${ymd}T00:00:00`,
        end:   `${ymd}T23:59:59`,
      };

      if (this.filters?.accounts?.length) p.account  = this.filters.accounts;
      if (this.filters?.hashtags?.length) p.hashtags = this.filters.hashtags;

      Object.keys(p).forEach(k => (p[k] == null || p[k] === "") && delete p[k]);
      return p;
    },

    buildParamsForDay2(startYMD, endYMD) {
      const p = {
        sentiment:   this.filters.sentiment.join(","),
        keyword:     this.buildKeywordParam(),
        exclude:     this.buildExcludeKeywordParam(),
        source:      this.sourceParam(this.filters.source),
        source_news: this.filters.source_news === "all" ? undefined : this.filters.source_news,
        sort_by:     this.filters.sort_by === "recent"  ? undefined : this.filters.sort_by,
        start: `${startYMD}T00:00:00`,
        end:   `${endYMD}T23:59:59`,
      };
      if (this.filters?.accounts?.length) p.account  = this.filters.accounts;
      if (this.filters?.hashtags?.length) p.hashtags = this.filters.hashtags;
      this.paramTo = p;
      return p;
    },

    // ── API calls ────────────────────────────────────────────────────────────

    async apiGetPostForAnalysis() {
      try {
        const { data } = await this.axios.get(
          "https://api2.cognizata.com/api/v2/userposts/getFulltextPost",
          { params: { ...this.buildParams(), sort_by: "engagement" } }
        );
        this.postsForAnalysis = data.data || [];
      } catch (e) {
        console.error("apiGetPostForAnalysis error:", e);
        this.postsForAnalysis = [];
      }
    },

    async apiTimeline() {
      if (this.filters.view_mode === "daily") return this.apiTimelineDaily();

      this.loading = true;
      try {
        const { data } = await this.axios.get(
          "https://api2.cognizata.com/api/v2/userposts/getFulltextPost",
          { params: this.buildParams() }
        );
        this.postsFromApi = data.data || [];
        this.count        = data.count      || 0;
        this.totalPages   = data.totalPages || Math.ceil(this.count / this.filters.limit);
      } catch (e) {
        console.error(e);
        this.postsFromApi = [];
        this.count = 0;
        this.totalPages = 0;
      } finally {
        this.loading = false;
        if (this.filters.view_mode !== "daily") this.apiGetPostForAnalysis();
      }
    },

    // ── ✅ Daily: ยิง API ครั้งเดียวพร้อม mode:"daily" ────────────────────────
    async apiTimelineDaily() {
      this.loading = true;
      try {
        const startIso = this.filters.startLocal || (this.valueDate?.[0] + "T00:00:00");
        const endIso   = this.filters.endLocal   || (this.valueDate?.[1] + "T23:59:59");
        const startYMD = startIso.slice(0, 10);
        const endYMD   = endIso.slice(0, 10);

        // ✅ ส่ง sort_by เข้า getDaysInclusive เพื่อเรียงลำดับวันให้ถูกต้อง
        const days = this.getDaysInclusive(startYMD, endYMD, this.filters.sort_by);

        this.buildParamsForDay2(startYMD, endYMD);

        // โครง skeleton
        this.postsFromApi = days.map(ymd => ({ date: ymd, items: [], _hasMore: false, countTotal: 0, countShown: 0 }));
        this.totalPages   = 0;
        this.loading      = false;
        this.dailyLoading = true;

        const params = this.buildParams({ silent: true });
        delete params.limit;
        delete params.page;
        params.mode = "daily";

        const { data } = await this.axios.get(
          "https://api2.cognizata.com/api/v2/userposts/getFulltextPost",
          { params }
        );

        const dayMap = {};
        (data?.days || []).forEach(d => { dayMap[d.date] = d; });

        // ✅ map กลับโดยใช้ days array ที่เรียงถูกแล้ว
        this.postsFromApi = days.map(ymd => {
          const d = dayMap[ymd];
          if (!d) return { date: ymd, items: [], _hasMore: false, countTotal: 0, countShown: 0 };
          const items = d.data ? [d.data] : [];
          return {
            date:       ymd,
            items,
            _hasMore:   (d.totalPosts || 0) > items.length,
            countTotal: d.totalPosts  || 0,
            countShown: items.length,
            engagement: d.engagement  || 0,
          };
        });

        this.count = (data?.days || []).reduce((sum, d) => sum + (d.totalPosts || 0), 0);

        days.forEach(ymd => {
          if (!this.dayPageMap[ymd])  this.$set(this.dayPageMap,  ymd, 1);
          if (!this.dayLimitMap[ymd]) this.$set(this.dayLimitMap, ymd, 10);
          this.$set(this.daySortMap, ymd, this.filters.sort_by);
        });

      } catch (e) {
        console.error("apiTimelineDaily error:", e);
        this.loading = false;
      } finally {
        this.dailyLoading = false;
      }
    },

    async apiTimelineSilent() {
      if (this.filters.view_mode === "daily") return this.apiTimelineDailySilent();

      this.loading = true;
      try {
        const { data } = await this.axios.get(
          "https://api2.cognizata.com/api/v2/userposts/getFulltextPost",
          { params: this.buildParams({ silent: true }) }
        );
        this.postsFromApi = data.data || [];
        this.count        = data.count      || 0;
        this.totalPages   = data.totalPages || Math.ceil(this.count / this.filters.limit);
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
        const startIso = this.filters.startLocal || (this.valueDate?.[0] + "T00:00:00");
        const endIso   = this.filters.endLocal   || (this.valueDate?.[1] + "T23:59:59");
        const startYMD = startIso.slice(0, 10);
        const endYMD   = endIso.slice(0, 10);

        // ✅ เรียงวันให้ตรงกับ sort_by
        const days = this.getDaysInclusive(startYMD, endYMD, this.filters.sort_by);

        this.postsFromApi = days.map(ymd => ({ date: ymd, items: [], _hasMore: false, countTotal: 0, countShown: 0 }));
        this.totalPages   = 0;
        this.loading      = false;
        this.dailyLoading = true;

        const params = this.buildParams({ silent: true });
        delete params.limit;
        delete params.page;
        params.mode = "daily";

        const { data } = await this.axios.get(
          "https://api2.cognizata.com/api/v2/userposts/getFulltextPost",
          { params }
        );

        const dayMap = {};
        (data?.days || []).forEach(d => { dayMap[d.date] = d; });

        this.postsFromApi = days.map(ymd => {
          const d = dayMap[ymd];
          if (!d) return { date: ymd, items: [], _hasMore: false, countTotal: 0, countShown: 0 };
          const items = d.data ? [d.data] : [];
          return {
            date:       ymd,
            items,
            _hasMore:   (d.totalPosts || 0) > items.length,
            countTotal: d.totalPosts  || 0,
            countShown: items.length,
            engagement: d.engagement  || 0,
          };
        });

        this.count = (data?.days || []).reduce((sum, d) => sum + (d.totalPosts || 0), 0);

        days.forEach(ymd => {
          if (!this.dayPageMap[ymd])  this.$set(this.dayPageMap,  ymd, 1);
          if (!this.dayLimitMap[ymd]) this.$set(this.dayLimitMap, ymd, 10);
          this.$set(this.daySortMap, ymd, this.filters.sort_by);
        });

      } catch (e) {
        console.error("apiTimelineDailySilent error:", e);
        this.loading = false;
      } finally {
        this.dailyLoading = false;
      }
    },

    // ✅ แก้ที่นี่: ตอนเปิด slider ของวันครั้งแรก (ต้องโหลดข้อมูลเพิ่ม) ให้ default
    // sort เป็น engagement แทนการสืบทอด sort_by ของฟอร์มหลัก
    async handleOpenDay({ date, idx }) {
      this.$set(this.dayLoadingMap, date, true);
      if (!this.dayPageMap[date])  this.$set(this.dayPageMap,  date, 1);
      if (!this.dayLimitMap[date]) this.$set(this.dayLimitMap, date, 10);
      this.$set(this.daySortMap, date, DEFAULT_DAY_OPEN_SORT); // ✅ default engagement

      try {
        const { data } = await this.axios.get(
          "https://api2.cognizata.com/api/v2/userposts/getFulltextPost",
          { params: this.buildParamsForDay(date, { page: 1, sort_by: DEFAULT_DAY_OPEN_SORT }) }
        );
        const rows = data?.data || [];
        const i    = this.postsFromApi.findIndex(d => d.date === date);
        if (i !== -1) {
          const existing = this.postsFromApi[i].items || [];
          const existIds = new Set(existing.map(p => p._id || `${p.source}:${p.url_post}`));
          const merged   = [...existing, ...rows.filter(p => !existIds.has(p._id || `${p.source}:${p.url_post}`))];
          this.$set(this.postsFromApi[i], "items",      merged);
          this.$set(this.postsFromApi[i], "_hasMore",   rows.length >= (this.dayLimitMap[date] || 10));
          this.$set(this.postsFromApi[i], "countShown", merged.length);
          if (typeof data?.count === "number") {
            this.$set(this.postsFromApi[i], "countTotal", data.count);
          }
        }
      } catch (e) {
        console.error("handleOpenDay error:", e);
      } finally {
        this.$set(this.dayLoadingMap, date, false);
        this.$nextTick(() => {
          this.$refs.timelinePosts?.openDayDone(idx);
        });
      }
    },

    async loadMoreDay({ date }) {
      this.$store.commit("setLoadCardPost", true);
      this.$set(this.dayLoadingMap, date, true);

      const cur = this.dayPageMap[date] || 1;
      this.$set(this.dayPageMap, date, cur + 1);

      try {
        const { data } = await this.axios.get(
          "https://api2.cognizata.com/api/v2/userposts/getFulltextPost",
          { params: this.buildParamsForDay(date, { page: cur + 1 }) }
        );
        const more = data?.data || [];
        const i    = this.postsFromApi.findIndex(d => d.date === date);
        if (i !== -1) {
          const old    = this.postsFromApi[i].items || [];
          const oldIds = new Set(old.map(p => p._id || `${p.source}:${p.url_post}`));
          const merged = [...old, ...more.filter(p => !oldIds.has(p._id || `${p.source}:${p.url_post}`))];
          this.$set(this.postsFromApi[i], "items",      merged);
          this.$set(this.postsFromApi[i], "_hasMore",   more.length >= (this.dayLimitMap[date] || 10));
          this.$set(this.postsFromApi[i], "countShown", merged.length);
        }
      } catch (e) {
        console.error("loadMoreDay error:", e);
      } finally {
        this.$set(this.dayLoadingMap, date, false);
        this.$store.commit("setLoadCardPost", false);
      }
    },

    async changeDaySort({ date, sort_by }) {
      this.$store.commit("setLoadCardPost", true);
      this.$set(this.dayLoadingMap, date, true);
      this.$set(this.daySortMap,   date, sort_by);
      this.$set(this.dayPageMap,   date, 1);

      try {
        const { data } = await this.axios.get(
          "https://api2.cognizata.com/api/v2/userposts/getFulltextPost",
          { params: this.buildParamsForDay(date, { page: 1, sort_by }) }
        );
        const rows = data?.data || [];
        const i    = this.postsFromApi.findIndex(d => d.date === date);
        if (i !== -1) {
          this.$set(this.postsFromApi[i], "items",      rows);
          this.$set(this.postsFromApi[i], "_hasMore",   rows.length >= (this.dayLimitMap[date] || 10));
          this.$set(this.postsFromApi[i], "countShown", rows.length);
          if (typeof data?.count === "number") {
            this.$set(this.postsFromApi[i], "countTotal", data.count);
          }
        }
      } catch (e) {
        console.error("changeDaySort error:", e);
      } finally {
        this.$set(this.dayLoadingMap, date, false);
        this.$store.commit("setLoadCardPost", false);
      }
    },

    // ── Chart click/range handlers ────────────────────────────────────────────

    handlePointClick({ isoLocal }) {
      const date      = isoLocal.slice(0, 14);
      const hourStart = date + "00:00";
      const hourEnd   = date + "59:59";
      this.filters = { ...this.filters, page: 1, startLocal: hourStart, endLocal: hourEnd };
      if (this.filters.view_mode === "daily") {
        this.dayPageMap = {}; this.dayLimitMap = {}; this.daySortMap = {};
      }
      this.postsFromApi = [];
      this.apiTimelineSilent();
    },

    handleRange({ startIsoLocal, endIsoLocal }) {
      const startIso = startIsoLocal.slice(0, 16);
      const endIso   = endIsoLocal.slice(0, 16);
      this.filters = { ...this.filters, page: 1, startLocal: startIso, endLocal: endIso };
      if (this.filters.view_mode === "daily") {
        this.dayPageMap = {}; this.dayLimitMap = {}; this.daySortMap = {};
      }
      this.postsFromApi = [];
      this.apiTimelineSilent();
    },

    applyRangeAndReload(startIso, endIso) {
      this.filters = { ...this.filters, page: 1, startLocal: startIso, endLocal: endIso };
      if (this.filters.view_mode === "daily") {
        this.dayPageMap = {}; this.dayLimitMap = {}; this.daySortMap = {};
        this.valueDate = [startIso.slice(0, 10), endIso.slice(0, 10)];
      }
      this.postsFromApi = [];
      this.apiTimeline();
    },

    // ── Load more posts (posts mode) ─────────────────────────────────────────

    async loadMorePosts() {
      if (this.filters.page >= this.totalPages) return;
      this.loadingMore  = true;
      this.filters.page += 1;
      try {
        const { data } = await this.axios.get(
          "https://api2.cognizata.com/api/v2/userposts/getFulltextPost",
          { params: this.buildParams({ silent: true }) }
        );
        this.postsFromApi = [...this.postsFromApi, ...(data.data || [])];
        this.totalPages   = data.totalPages ?? this.totalPages;
        this.count        = data.count      ?? this.count;
      } catch (e) {
        console.error(e);
      } finally {
        this.loadingMore = false;
      }
    },

    // ── handleSearch ─────────────────────────────────────────────────────────

    handleSearch() {
      const next = { ...this.filters, ...this.formFilters, page: 1 };

      const startYMD  = this.valueDate?.[0] || moment().format("YYYY-MM-DD");
      const endYMD    = this.valueDate?.[1]  || startYMD;
      next.startLocal = `${startYMD}T00:00:00`;
      next.endLocal   = `${endYMD}T23:59:59`;

      // Normalize accounts
      const rawAcc   = next.accountsInput;
      const accounts = (Array.isArray(rawAcc) ? rawAcc : String(rawAcc || "").split(","))
        .map(s => s.trim()).filter(Boolean);
      next.accounts = [...new Set(accounts.map(s => s.replace(/^@/, "").replace(/\/+$/, "")))];

      // Normalize hashtags
      const rawTags = next.HashtagsInput;
      const tags    = (Array.isArray(rawTags) ? rawTags : String(rawTags || "").split(","))
        .map(s => s.trim()).filter(Boolean);
      next.hashtags = [...new Set(tags.map(t => t.replace(/^#/, "").toLowerCase()))];

      this.filters = next;

      if (this.filters.view_mode === "daily") {
        this.dayPageMap = {}; this.dayLimitMap = {}; this.daySortMap = {};
      }

      const inputkeyword = (this.filters.keywordInput || "").split(",")
        .map(g => g.trim().split(/\s+|\+/).filter(Boolean)).flat();
      const searchWords = Array.from(new Set([
        ...inputkeyword,
        ...next.hashtags.map(t => `#${t}`),
        ...next.accounts.map(a => `${a}`),
      ].filter(Boolean)));
      this.$store.commit("setSearchWords", searchWords);

      this.postsFromApi = [];
      this.apiTimeline();
      this.showFilters = !this.showFilters;
    },
  },
};
</script>

<style scoped>
.card-hide {
  background-image: linear-gradient(to right, #e2f2f5, #d1ecf1);
}
.filter-btn {
  top: 38px;
  right: 15px;
  z-index: 2;
}
.filter-btn .btn {
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}
.badge-light {
  color: #35393b;
  background-color: #ffffffa9 !important;
}
.input-tag {
  height: 100% !important;
  max-height: 59px !important;
  overflow-y: auto !important;
}
#search-source.vs--searchable .vs__dropdown-toggle {
  max-height: 39px !important;
  overflow-y: auto !important;
}
.mx-datepicker-range { width: 100% !important; }
* { font-family: "Prompt", "FontAwesome", sans-serif; }
.container { max-width: 1200px; }
.b-form-group { min-width: 220px; }
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
  box-sizing: border-box;
  width: 100%;
  height: 38.5px !important;
  padding: 6px 30px;
  padding-left: 10px;
  font-size: 14px;
  line-height: 1.4;
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
}
@media only screen and (min-width: 0) and (max-width: 1100px) {
  .checkbox-v { zoom: 85%; }
}
@media only screen and (min-width: 0px) and (max-width: 800px) {
  div.card.mb-3.shadow-sm > div > form > div.row.mt-2.justify-content-end { zoom: 85% !important; }
  .filter-btn { top: -6px; right: -1px; z-index: 2; }
  .vue-back-to-top { right: 14px !important; }
  .btn-to-top { width: 50px; height: 50px; padding: 10px 13px; }
  .checkbox-v { zoom: 85%; }
}
@media print {
  .no-print,
  .filter-btn,
  .vue-back-to-top {
    display: none !important;
  }
}
</style>