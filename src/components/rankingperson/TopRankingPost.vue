<template>
  <div class="container my-3">
    <b-row>
      <b-col cols="12" md="12" class="position-relative">
        <div class="mt-2 text-left h6">
          <span class="bold" @click="$router.push('/personranking')" style="cursor: pointer;"> Ranking
          </span> >
          <span>Posts</span>
        </div>
        <div class="text-left">
          All ({{ count.toLocaleString() || 0 }}) <b> {{ name }}</b>
        </div>

        <div class="btn-ex">
          <b-button size="sm" variant="outline-info" @click="printPosts" v-b-tooltip.hover title="Print" pill>
            <b-icon-printer /> Print
          </b-button>
          <ExportExcelButton class="d-inline-block" :posts="postForExport" :filters="filters"
            :disabled="loadingExport || (Array.isArray(postForExport) && postForExport.length === 0)"
            :full-export="true" :prefer-single-shot="true" inline-comments="json" :comments-limit="20" />
        </div>
      </b-col>
    </b-row>

    <hr />
    <div class="position-relative">
      <div class="text-right filter-btn">
        <b-button size="sm" :variant="showFilters ? 'info' : 'outline-info'" @click="showFilters = !showFilters" pill
          class="d-inline-flex align-items-center ">
          <i class="fas fa-sliders mr-2"></i>
          <!-- <b-icon icon="sliders" class="mr-1 small"></b-icon> -->
          <span v-if="showFilters" class="small">Hide</span>
          <span v-else class="small">Show</span>
          <!-- <b-badge v-if="activeFilterCount" variant="light" class="ml-2">{{ activeFilterCount }}</b-badge> -->
        </b-button>
      </div>
      <!-- Controls -->
      <div v-if="showFilters">
        <b-row class="my-1 mb-2">
          <!-- sentiment -->
          <b-col sm="12" md="auto">
            <b-form-group class="checkbox-v ">
              <b-form-checkbox-group v-model="selected" :options="options" size="sm" class="mt-1  text-left ml-2 rdo" />
            </b-form-group>


          </b-col>

          <!-- source -->
          <b-col cols="12" md="">
            <v-select :options="itemSocial" v-model="select_social" id="search-source" label="text"
              :reduce="o => o.value" class="mb-2 select-sort" placeholder="Select Platform" multiple />
          </b-col>

          <!-- sort -->
          <b-col cols="12" md="" class="text-left">
            <b-form-select v-model="sort" :options="optionSort" size="sm" class="select-sort w-50 "
              style="height: 36px;" />
          </b-col>
        </b-row>

        <!-- keyword & date range -->
        <b-row class="my-1">
          <b-col md="6" class="mb-2">
            <b-input-group size="sm">
              <!-- <b-input-group-prepend is-text>keyword</b-input-group-prepend> -->
              <b-form-input v-model.trim="keywordInput" placeholder="ค้นหา keyword" @keyup.enter="applyAllFilters" />
            </b-input-group>
          </b-col>

          <b-col md="6" class="mb-2">
            <div @keyup.enter="applyAllFilters">
              <b-input-group size="sm" class="align-items-start">
                <!-- <b-input-group-prepend is-text>บัญชี</b-input-group-prepend> -->
                <b-form-group label="" label-for="accounts" class="flex-grow-1 mb-0 pr-md-3">
                  <b-form-tags id="accounts" v-model="accountsInput" tag-variant="light" tag-pills size="sm"
                    separator=",;" placeholder="ค้นหาบัญชี (ใส่ uid หรือ url หลายบัญชีคั่นด้วย ,)" no-add-on-enter
                    add-on-change remove-on-delete class="input-tag" />
                </b-form-group>
              </b-input-group>
            </div>
            <!-- <b-input-group size="sm">
              <b-input-group-prepend is-text>บัญชี</b-input-group-prepend>
              <b-form-input v-model.trim="accountInput" placeholder="ค้นหาบัญชี" @keyup.enter="applyAllFilters" />
            </b-input-group> -->
          </b-col>
          <b-col md="6" class="mb-2">

            <b-form-checkbox v-model="full_text" size="sm" class="mt-2">
              ค้นหาจากข้อความ
            </b-form-checkbox>
          </b-col>
          <b-col cols="12" md="4" class="text-right ">
            <section id="date-picker" class="w-100">
              <date-picker v-model="local.valueDate" type="date" range placeholder="เลือกช่วงเวลา" class="w-100"
                size="sm" :disabled-date="d => d > new Date()" value-type="format" format="YYYY-MM-DD"
                @change="onDateChange" id="date-domain" />
            </section>
          </b-col>
          <b-col>
            <!-- ปุ่มรวมกดยิงครั้งเดียว -->
            <div class="text-right mb-2 mt-2 mt-md-0 ">
              <b-button size="sm" variant="outline-secondary" @click="clearFilters" class="mr-2">
                ล้างตัวกรอง
              </b-button>
              <b-button size="sm" variant="info" @click="applyAllFilters">
                ค้นหา
              </b-button>

            </div>
          </b-col>
        </b-row>


      </div>

      <!-- แถบสรุปฟิลเตอร์แบบย่อ เมื่อซ่อน -->
      <div class="py-2 px-2 shadow-sm card-hide mb-2 " style="border-radius: 20px;" v-else-if="hasAnyPretty">
        <div class="d-flex flex-wrap align-items-center">
          <div v-if="pretty.keyword" class="mr-2 my-1 bold">
            <b-icon icon="search" class="mr-1"></b-icon> {{ pretty.keyword }}
          </div>
          <b-badge v-if="pretty.account" pill variant="light" class="mr-2 my-1">
            <b-icon icon="person" class="mr-1"></b-icon>{{ pretty.account }}
          </b-badge>
          <b-badge v-if="pretty.sentimentsText" pill variant="light" class="mr-2 my-1">
            <b-icon icon="emoji-smile" class="mr-1"></b-icon>{{ pretty.sentimentsText }}
          </b-badge>
          <b-badge v-if="pretty.sourceText" pill variant="light" class="mr-2 my-1 ">
            <b-icon icon="collection" class="mr-1"></b-icon>{{ pretty.sourceText }}
          </b-badge>
          <b-badge v-if="pretty.sortText" pill variant="light" class="mr-2 my-1 ">
            <b-icon icon="sort-down" class="mr-1"></b-icon>{{ pretty.sortText }}
          </b-badge>
          <b-badge v-if="pretty.dateRange" pill variant="light" class="mr-2 my-1 ">
            <b-icon icon="calendar-date" class="mr-1"></b-icon>{{ pretty.dateRange }}
          </b-badge>
        </div>
      </div>
    </div>

    <!-- ChartTime: ใช้ "applied" เท่านั้น และ refresh ด้วย key -->
    <div class="mb-3">
      <ChartTime :key="chartRefreshKey" :filters="appliedChartFilters" @range-selected="onChartRangeSelected"
        @range-cleared="onChartRangeCleared" @point-click="onChartPointClick" />
    </div>

    <div>
      <top-accounts :accounts="accountItem" :limit="10" :loading="loading" @filter-account="onFilterAccount" />
    </div>

    <!-- Posts -->
    <div>
      <vue-element-loading :active="loading" size="0" background-color="rgba(255,255,255,0.5)" color="#b6ac9a" />
      <b-alert v-if="!loading && posts.length === 0" show variant="light" class="text-center">
        ไม่มีโพสต์
      </b-alert>

      <timeline-posts v-else :items="posts" mode="posts" sort="recent" :count="count" />

      <div v-if="totalPages > 1" class="text-center my-2 pb-5">
        <div v-if="page === totalPages" class="text-center mb-3 py-5">
          <vue-element-loading :active="loading" size="80" background-color="rgba(255, 255, 255, 0.5)"
            color="#17a2b891" />
        </div>
        <b-button v-else variant="outline-info" @click="onPageChange(page + 1)" pill>
          <span><i class="fa fa-plus" aria-hidden="true"></i> More</span>
        </b-button>
      </div>

      <div class="text-center my-4 py-4" v-if="loading">
        <vue-element-loading :active="loading" size="80" background-color="rgba(255, 255, 255, 0.5)"
          color="#17a2b891" />
      </div>
    </div>
  </div>
</template>

<script>
import VueGallerySlideshow from "vue-gallery-slideshow";
import moment from "moment";
import "moment/locale/th";
import TimelinePosts from "../timeline/TimelinePosts2.vue";
import ExportExcelButton from "@/components/timeline/ExportExcelButton.vue";
import StaticTimeline from "@/components/timeline/StaticTimeline.vue";
import SentimentBar from "@/components/domain/SentimentBar.vue";
import TopAccounts from "@/components/rankingperson/TopAccount.vue";
import TopAccountsChart from "@/components/rankingperson/TopAccountsChart.vue";
import ChartTime from "@/components/rankingperson/ChartTime.vue";
import "vue-select/dist/vue-select.css";

const API_ENDPOINT =
  "https://api2.cognizata.com/api/v2/facerecognition/getFacePersonUserposts";

export default {
  name: "PostBoard",
  components: {
    VueGallerySlideshow,
    TimelinePosts,
    ExportExcelButton,
    StaticTimeline,
    SentimentBar,
    TopAccounts,
    ChartTime,
    TopAccountsChart
  },
  props: {
    defaultName: { type: String, default: "อนุทิน ชาญวีรกูล" },
    defaultFrom: { type: String, default: "2025-10-07T00:00" },
    defaultTo: { type: String, default: "2025-10-07T23:59" },
    topAccountsLimit: { type: Number, default: 10 }
  },
  data() {
    const toDateOnly = s => (s ? String(s).slice(0, 10) : null);
    const q = this.$route && this.$route.query ? this.$route.query : {};
    const fromQ = q.from || null;
    const toQ = q.to || null;

    const defFrom = this.defaultFrom.slice(0, 10);
    const defTo = this.defaultTo.slice(0, 10);

    const initFrom = fromQ ? toDateOnly(fromQ) : defFrom;
    const initTo = toQ ? toDateOnly(toQ) : defTo;

    const fromInit = `${initFrom}T00:00`;
    const toInit = `${initTo}T23:59`;

    // helper to build initial applied filters for chart (no auto refresh yet)
    const initialApplied = () => {
      return {
        name: q.name || this.defaultName,
        from: fromQ ? `${toDateOnly(fromQ)}T00:00:00` : fromInit,
        to: toQ ? `${toDateOnly(toQ)}T23:59:59` : toInit,
        sentiment: "1,0,-1",
        source: undefined,
        keyword: undefined,
        sort_by: "engagement",
        account: q.account || undefined,
      };
    };

    return {
      showFilters: true,

      // ---- DRAFT state (แก้ไขได้ ไม่ยิงอะไรจนกดปุ่ม) ----
      name: q.name || this.defaultName,
      keyword: "",        // applied keyword (จะอัปเดตตอนกดปุ่ม)
      keywordInput: "",   // draft keyword
      from: fromQ ? `${toDateOnly(fromQ)}T00:00:00` : fromInit,
      to: toQ ? `${toDateOnly(toQ)}T23:59:59` : toInit,
      accountsInput: [],
      selected: ['1', '0', '-1'],
      select_social: [""],
      sort: "engagement",
      account: "",
      full_text: q.full_text === 'true' || false,
      // ---- APPLIED Chart filters ----
      appliedChartFilters: initialApplied(),
      chartRefreshKey: 1, // ให้ ChartTime mount ครั้งแรก

      accountItem: [],

      // pagination
      page: Number(q.page || 1),
      limit: 20,
      totalPages: 0,
      count: 0,
      loadingPosts: false,
      loadingExport: false,
      loading: false,

      // selects
      itemSocial: [
        { value: "", text: "All Platform" },
        { value: "facebook", text: "Facebook" },
        { value: "twitter", text: "X" },
        { value: "pantip", text: "Board" },
        { value: "news", text: "News" },
        { value: "youtube", text: "YouTube" },
        { value: "instagram", text: "Instagram" },
        { value: "blockdit", text: "Blockdit" },
        { value: "tiktok", text: "Tiktok" },
        { value: "threads", text: "Threads" }
      ],
      options: [
        { text: "Positive", value: "1" },
        { text: "Neutral", value: "0" },
        { text: "Negative", value: "-1" },
        // { text: "ทั้งหมด", value: "1,0,-1" }
      ],
      optionSort: [
        { value: "engagement", text: "Engagement" },
        { value: "desc", text: "โพสต์ล่าสุด" },
        { value: "asc", text: "โพสต์เริ่มต้น" }
      ],

      local: {
        valueDate: [initFrom, initTo]
      },

      posts: [],
      postForExport: [],
      filters: {}
    };
  },
  computed: {
    pretty() {
      const map = { '1': 'บวก', '0': 'กลาง', '-1': 'ลบ' };

      const sentimentsArr = Array.isArray(this.selected)
        ? this.selected
        : String(this.selected || '1,0,-1').split(',').map(s => s.trim()).filter(Boolean);

      const sentimentsText = (sentimentsArr.length === 3)
        ? ''
        : sentimentsArr.map(s => map[s] || s).join(' / ');

      const dict = (this.itemSocial || []).reduce((acc, o) => {
        acc[o.value] = o.text;
        return acc;
      }, {});
      const srcArr = Array.isArray(this.select_social) ? this.select_social : [];
      const sourceText = srcArr
        .filter(v => v !== '' && v != null)
        .map(v => dict[v] || v)
        .join(', ');

      const sOpt = (this.optionSort || []).find(o => o.value === this.sort);
      const sortText = sOpt ? sOpt.text : this.sort;

      const keyword = (this.keywordInput || '').trim();
      const account = Array.isArray(this.accountsInput) && this.accountsInput.length
        ? this.accountsInput.join(', ')
        : '';

      const d = this.local && Array.isArray(this.local.valueDate) ? this.local.valueDate : [];
      //const dateRange = (d[0] && d[1]) ? `${d[0]} → ${d[1]}` : '';
      let dateRange = '';
      if (d[0] && d[1]) {
        dateRange = this.formatRange(d[0], d[1]);
      } else if (Array.isArray(this.valueDate) && this.valueDate.length === 2) {
        dateRange = `${this.valueDate[0]} → ${this.valueDate[1]}`;
      }
      return { sentimentsText, sourceText, sortText, keyword, account, dateRange };
    },
    hasAnyPretty() {
      const p = this.pretty;
      return !!(p.keyword || p.account || p.sentimentsText || p.sourceText || p.sortText || p.dateRange);
    }
  },
  methods: {
    formatRange(start, end) {
      try {
        const opts = { year: 'numeric', month: 'short', day: 'numeric' };
        const sDate = new Date(start);
        const eDate = new Date(end);

        if (isNaN(sDate) || isNaN(eDate)) throw new Error('Invalid date');

        const sameDay =
          sDate.getFullYear() === eDate.getFullYear() &&
          sDate.getMonth() === eDate.getMonth() &&
          sDate.getDate() === eDate.getDate();

        const s = sDate.toLocaleDateString('th-TH', opts);
        const e = eDate.toLocaleDateString('th-TH', opts);

        return sameDay ? s : `${s} – ${e}`;
      } catch (err) {
        return start === end ? String(start) : `${start} – ${end}`;
      }
    },
    _normalizeQuery(q) {
      const copy = {};
      Object.keys(q || {}).forEach(k => {
        const v = q[k];
        if (v !== undefined && v !== null && String(v).trim() !== "") copy[k] = v;
      });
      return Object.fromEntries(Object.keys(copy).sort().map(k => [k, copy[k]]));
    },
    _isSameQuery(a, b) {
      const A = this._normalizeQuery(a);
      const B = this._normalizeQuery(b);
      return JSON.stringify(A) === JSON.stringify(B);
    },
    async safeReplace(path, query) {
      const current = { ...(this.$route.query || {}) };
      if (this._isSameQuery(current, query) && this.$route.path === path) return;
      try {
        await this.$router.replace({ path, query });
      } catch (err) {
        if (err && err.name !== 'NavigationDuplicated') {
          // console.error(err);
        }
      }
    },

    // ====== Draft -> Applied builder for ChartTime ======
    buildChartDraft() {
      const sentiments = (Array.isArray(this.selected)
        ? this.selected
        : String(this.selected || "1,0,-1").split(',')
      ).map(s => s.trim()).filter(Boolean).join(',');

      const src = Array.isArray(this.select_social) && this.select_social.length
        ? this.select_social.join(",")
        : undefined;

      const accountsJoined = (Array.isArray(this.accountsInput) && this.accountsInput.length)
        ? this.accountsInput.join(",")
        : undefined;

      return {
        name: this.name,
        from: this.from,
        to: this.to,
        sentiment: sentiments,
        source: src,
        keyword: (this.keywordInput || '').trim() || undefined,
        sort_by: this.sort || "engagement",
        account: accountsJoined,
         full_text: this.full_text ? true : undefined, 
      };
    },


    onFilterAccount({ uid }) {
      if (!uid) {
        this.accountsInput = [];
        this.account = '';
      } else {
        if (!Array.isArray(this.accountsInput)) this.accountsInput = [];
        if (!this.accountsInput.includes(uid)) this.accountsInput.push(uid);
      }
      this.applyAllFilters();
    }
    ,

    startOfDayStr(dateOnly) {
      return `${dateOnly}T00:00:00`;
    },
    endOfDayStr(dateOnly) {
      return `${dateOnly}T23:59:59`;
    },

    _toLocalMinute(isoLike) {
      if (!isoLike) return null;
      const m = moment(isoLike);
      return m.isValid() ? m.format("YYYY-MM-DDTHH:mm") : null;
    },

    normalizeDateRange(range) {
      if (!Array.isArray(range) || range.length < 1) return null;
      const from = range[0];
      const to = range[1] || range[0];
      return [from, to];
    },

    onDateChange(val) {
      // อัปเดต draft date ไว้เฉย ๆ ไม่ fetch และไม่รีเฟรช ChartTime
      const norm = this.normalizeDateRange(val);
      if (!norm) return;
      const [dFrom, dTo] = norm;
      this.from = this.startOfDayStr(dFrom);
      this.to = this.endOfDayStr(dTo);
    },

    toUtcZ(localStr) {
      if (!localStr) return null;
      const m = moment(localStr);
      return m.isValid() ? m.toDate().toISOString() : null;
    },
    toUtcZEndOfMinute(localStr) {
      if (!localStr) return null;
      const m = moment(localStr).seconds(59).milliseconds(0);
      return m.isValid() ? m.toDate().toISOString() : null;
    },

    buildParams({ all = false, updateFilters = true } = {}) {
      const sentiments = (Array.isArray(this.selected)
        ? this.selected
        : String(this.selected || "1,0,-1").split(',')
      ).map(s => s.trim()).filter(Boolean).join(',');

      const source = this.select_social ? this.select_social : undefined;
      const accountsJoined = (Array.isArray(this.accountsInput) && this.accountsInput.length)
        ? this.accountsInput.join(",")
        : undefined;

      const params = {
        name: this.name,
        from: this.from,
        to: this.to,
        sort_by: this.sort || "engagement",
        page: this.page,
        limit: all ? this.count || 1000 : this.limit,
        sentiment: sentiments,
        top_accounts_limit: this.topAccountsLimit,
        source
      };
      if (this.keyword) params.keyword = this.keyword;
      if (accountsJoined) params.account = accountsJoined; // <<— ใช้ account เดิม ฝั่งแบ็กเอนด์ไม่ต้องแก้
      if (this.full_text === true) params.full_text = true;
      // if (this.account) params.account = this.$route.query.account;

      if (updateFilters) {
        this.filters = this.filters || {};
        Object.assign(this.filters, params);
      }
      return params;
    },
    // ===== ปุ่มรวมใช้ตัวกรอง =====
    async applyAllFilters() {
      this.keyword = (this.keywordInput || '').trim();

      // รวมแท็กเป็นสตริงสำหรับ query และยิง API
      const accountsJoined = (Array.isArray(this.accountsInput) && this.accountsInput.length)
        ? this.accountsInput.join(",")
        : '';

      this.account = accountsJoined;
      this.page = 1;

      const sourceStr = Array.isArray(this.select_social) && this.select_social.length
        ? this.select_social.join(",")
        : undefined;

      const sentimentStr = (Array.isArray(this.selected)
        ? this.selected
        : String(this.selected || '1,0,-1').split(',')
      ).map(s => s.trim()).filter(Boolean).join(',');

      const query = {
        ...this.$route.query,
        name: this.name,
        from: (this.from || '').slice(0, 10),
        to: (this.to || '').slice(0, 10),
        sentiment: sentimentStr,
        sort: this.sort || 'engagement',
        source: sourceStr,
        page: 1,
        keyword: this.keyword || undefined,
        account: accountsJoined || undefined,   // <<— ใช้คีย์เดิม
         full_text: this.full_text ? 'true' : undefined, 
      };

      await this.safeReplace('/personranking/posts', query);
      this.showFilters = false;
      this.fetchUserposts();
      this.appliedChartFilters = this.buildChartDraft();
      this.chartRefreshKey += 1;
    },
    async clearFilters() {
      this.selected = ['1', '0', '-1'];
      this.select_social = [''];
      this.sort = 'desc';
      this.keywordInput = '';
      this.accountsInput = [];  // <<—
      this.keyword = '';
      this.account = '';
  this.full_text = false;  
      const d = this.local && Array.isArray(this.local.valueDate) ? this.local.valueDate : [];
      if (d[0]) this.from = this.startOfDayStr(d[0]);
      if (d[1]) this.to = this.endOfDayStr(d[1] || d[0]);

      this.page = 1;

      const query = {
        name: this.name,
        from: (this.from || '').slice(0, 10),
        to: (this.to || '').slice(0, 10),
        sentiment: this.selected.join(','),
        sort: this.sort,
        page: 1,
      };

      await this.safeReplace('/personranking/posts', query);
      this.fetchUserposts();
      this.appliedChartFilters = this.buildChartDraft();
      this.chartRefreshKey += 1;
    },

    // ---- API calls ----
    async fetchUserposts() {
      this.loading = true;
      try {
        const params = this.buildParams();
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const { data } = await this.axios.get(API_ENDPOINT, { params, headers });

        const rows = Array.isArray(data?.data) ? data.data : [];
        this.accountItem = data.top_accounts || [];
        if (this.page === 1) {
          this.posts = rows;
        } else {
          this.posts = [...this.posts, ...rows];
        }

        const totalPosts = Number(
          data?.pagination?.total_posts ?? data?.count ?? 0
        );
        this.count =
          totalPosts ||
          Math.max((this.page - 1) * this.limit + this.posts.length, 0);

        const totalPages = Number(
          data?.pagination?.total_pages ??
          data?.totalPages ??
          (this.count && this.limit ? Math.ceil(this.count / this.limit) : 0)
        );
        this.totalPages = totalPages;
      } catch (e) {
        console.error(e);
        this.posts = [];
        this.count = 0;
        this.totalPages = 0;
      } finally {
        this.loading = false;
      }
    },

    async fetchAllForExport() {
      this.loadingExport = true;
      try {
        const params = this.buildParams({ all: true, updateFilters: false });
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const { data } = await this.axios.get(API_ENDPOINT, { params, headers });
        const rows = Array.isArray(data?.data) ? data.data : [];
        this.postForExport = rows;
      } catch (e) {
        console.error(e);
        this.postForExport = [];
      } finally {
        this.loadingExport = false;
      }
    },

    // ---- UI actions ----
    onPageChange(p) {
      if (this.loading) return;
      this.page = p;
      this.fetchUserposts();
    },
    resetAndFetch() {
      this.page = 1;
      this.fetchUserposts();
    },
    printPosts() {
      const STYLE_ID = "print-style-min-margin";
      if (!document.getElementById(STYLE_ID)) {
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.media = "print";
        style.textContent = `
          @page { size: auto; margin: 0; }
          @media print { html, body { margin: 0 !important; padding: 0 !important; } }
        `;
        document.head.appendChild(style);
      }
      this.$nextTick(() => {
        try {
          window.print();
        } catch (e) {
          console.error(e);
        }
      });
    },

    // ===== Event จาก ChartTime (ปรับ draft เท่านั้น — ไม่ยิงเอง) =====
    onChartRangeSelected(e) {
      const fromLocal = this._toLocalMinute(e?.startIsoLocal);
      const toLocal = this._toLocalMinute(e?.endIsoLocal);
      if (fromLocal && toLocal) {
        this.from = fromLocal;
        this.to = toLocal;
        const fDay = fromLocal.slice(0, 10);
        const tDay = toLocal.slice(0, 10);
        this.local.valueDate = [fDay, tDay];
        // รอปุ่ม "ใช้ตัวกรอง"
      }
    },
    onChartRangeCleared() {
      const [initFrom, initTo] = this.local.valueDate || [];
      if (initFrom && initTo) {
        this.from = this.startOfDayStr(initFrom);
        this.to = this.endOfDayStr(initTo);
        // รอปุ่ม "ใช้ตัวกรอง"
      }
    },
    onChartPointClick(e) {
      const base = e?.isoLocal || (e?.x ? new Date(e.x).toISOString() : null);
      if (!base) return;
      const m = moment(base);
      if (!m.isValid()) return;
      const start = m.clone().seconds(0).milliseconds(0);
      const end = m.clone().minutes(59).seconds(59).milliseconds(0);
      this.from = start.format("YYYY-MM-DDTHH:mm");
      this.to = end.format("YYYY-MM-DDTHH:mm");
      this.local.valueDate = [this.from.slice(0, 10), this.to.slice(0, 10)];
      // รอปุ่ม "ใช้ตัวกรอง"
    }
  },
  mounted() {
    this.keywordInput = this.keyword;

    if (this.$route?.query) {
      if (this.$route.query.name) this.name = this.$route.query.name;
      if (this.$route.query.from) this.from = this.$route.query.from + "T00:00:00";
      if (this.$route.query.to) this.to = this.$route.query.to + "T23:59:59";

      if (this.$route.query.source) {
        const s = String(this.$route.query.source).split(",").map(x => x.trim()).filter(v => v !== "");
        this.select_social = s;
      }
      if (this.$route.query.sentiment) {
        this.selected = String(this.$route.query.sentiment).split(',').map(s => s.trim()).filter(Boolean);
      }
      if (this.$route.query.sort) this.sort = this.$route.query.sort;
      if (this.$route.query.page) this.page = Number(this.$route.query.page) || 1;

      // รับ account จาก query แล้วแปลงเป็นแท็ก
      if (this.$route.query.account) {
        const arr = String(this.$route.query.account).split(',').map(s => s.trim()).filter(Boolean);
        this.accountsInput = arr;
        this.account = arr.join(',');
      }

      if (this.$route.query.keyword) this.keywordInput = this.$route.query.keyword;
      if (this.$route.query.full_text) this.full_text = this.$route.query.full_text === 'true'; // ⬅️ เพิ่ม

    }

    this.fetchUserposts();
    this.appliedChartFilters = this.buildChartDraft();
  }
  ,

  watch: {
    // โหลดข้อมูลทั้งหมดสำหรับ export เมื่อ count เปลี่ยน (ไม่แตะ filters)
    count: {
      handler() {
        this.fetchAllForExport();
      }
    },
    // ไม่ fetch อัตโนมัติเมื่อปรับ platform
    select_social(val, old) {
      const toArr = x => Array.isArray(x) ? x : (x == null ? [] : [x]);
      const arr = toArr(val);
      const oldArr = toArr(old);

      if (arr.length === 0) {
        return; // ถือว่า All
      }

      if (arr.includes("") && arr.length > 1) {
        const clickedAllJustNow = !oldArr.includes("");
        if (clickedAllJustNow) {
          this.select_social = [""];
        } else {
          this.select_social = arr.filter(v => v !== "");
        }
      }
    }
  },
  filters: {
    numFormat(v) {
      const n = Number(v || 0);
      return n;
    }
  }
};
</script>

<style>
.iconimg.b-avatar .b-avatar-img img {
  width: auto;
  background-color: aliceblue;
}
</style>
<style scoped>
.w-50 {
  width: 297px !important;
}

.badge-light {
  background-color: white !important;
}

.form-group {
  margin-bottom: 2px !important;
}

.filter-btn {
  top: 7px;
  right: 13px;
  z-index: 2;
  position: absolute;
}

.card-hide {
  background-image: linear-gradient(to right, #e2f2f5, #d1ecf1);
}

.btn-ex {
  position: absolute;
  right: 0;
  top: 0;
}

.img-issue {
  width: 24px;
  height: 24px;
}

.small-sub {
  font-size: x-small;
}

.btn-secondary {
  background-color: transparent !important;
}

.btn-secondary:hover {
  background-color: transparent !important;
}

#overflow-page>div.container.my-3>div.card.mb-3.shadow-sm.card-photo.sd-g>div {
  padding: 2px !important;
}

.iconimg {
  height: 300px !important;
}

.iconimg .b-avatar>.b-icon {
  width: 8% !important;
  height: auto;
  max-width: 100%;
}

::v-deep .nav-tabs .nav-link {
  border: 0 !important;
}

.badge-warning {
  color: #3a3838;
  background-color: #ffd968;
  font-weight: 500;
}

.badge-success {
  color: #3a3838;
  background-color: #1996006b;
  font-weight: 500;
}

.badge-danger {
  color: #3a3838;
  background-color: #e86c78c7;
  font-weight: 500;
}

.card-photo {
  margin-bottom: 18px;
  border-radius: 15px;
  border: 0px solid rgba(0, 0, 0, 0.125) !important;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.13) !important;
}

.sd-g {
  border: 1px solid #888787 !important;
}

.b-avatar .b-avatar-img img {
  width: auto;
  height: 100%;
  max-height: auto;
  border-radius: inherit;
  object-fit: cover;
}

.row-cols-md-9>* {
  flex: 0 0 auto;
  width: calc(100% / 9);
}

@media only screen and (min-width: 990px) and (max-width: 1224px) {
  .w-50 {
    width: 70% !important;
  }
}

@media only screen and (min-width: 801px) and (max-width: 990px) {
  .w-50 {
    width: 60% !important;
  }
}

@media only screen and (min-width: 0px) and (max-width: 800px) {
  .w-50 {
    width: 100% !important;
  }

  .filter-btn {
    top: -10px;
    right: -1px;
    z-index: 2;
    transform: scale(0.72);
    transform-origin: top right;
  }

  #chart>div>div:nth-child(1) {
    padding-left: 3px !important;
    padding-right: 3px !important;
  }

  .btn-ex {
    /* zoom: 80%; */
    right: 0px;
    position: absolute;
    top: 0px;
    margin-top: 3px;
    transform: scale(0.8);
    transform-origin: top right;
  }

  .mx-datepicker-range {
    width: 100% !important;
  }

  .rdo {
    zoom: 75%;
  }

  .iconimg {
    height: 200px !important;
    width: 600px !important;
  }
}

@media (max-width: 516px) {
  .row-cols-md-9>* {
    width: auto;
  }
}

@page {
  size: A4;
  margin: 0;
}
</style>
