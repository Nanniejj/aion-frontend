<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />

    <div class="container my-3">
      <!-- Filters Card -->
      <b-card class="mb-3 shadow-sm" style="border-radius: 20px;">
        <b-alert show variant="info">
          <div class="text-left"> <i class="fa fa-info-circle fa-2x mr-2"></i><small>คำค้นหา (AND ใช้ช่องว่างหรือ +, OR
              ใช้ ,)
              <span class="text-muted"> ตัวอย่าง: <code>พระมงกุฎฯ ประวิตร, กรุงเทพ</code> = (พระมงกุฎฯ
                AND ประวิตร) OR (กรุงเทพ)</span>
            </small></div>
        </b-alert>
        <b-form @submit.prevent="handleSearch">
          <b-row>
            <b-col cols="12" md="8">
              <b-form-group label="" label-for="kw" class="pr-md-3 flex-grow-1">
                <b-form-input id="kw" v-model.trim="filters.keywordInput"
                  placeholder="เช่น พระมงกุฎฯ ประวิตร, กรุงเทพ" />
              </b-form-group>
            </b-col>

            <b-col cols="12" md="4">
              <!-- Sentiment -->
              <b-form-group class="pr-md-3">
                <!-- <span class="text-muted small">sentiment</span> -->
                <b-form-checkbox-group v-model="filters.sentiment" :options="sentimentOptions" />
              </b-form-group>
            </b-col>

            <b-col cols="12" md="4">
              <!-- {{filters.source}} -->
              <v-select :options="sourceOptions" v-model="filters.source" id="search-input" label="text"
                :reduce="source => source.value" class="mb-2 select-sort" placeholder="Select Platform"
                multiple></v-select>
            </b-col>

            <b-col cols="12" md="4">
              <!-- Sort -->
              <b-form-group class="pr-md-3">
                <b-form-select v-model="filters.sort_by" :options="[
                  { value: 'descend', text: 'โพสต์เก่าสุด' },
                  { value: 'recent', text: 'โพสต์ล่าสุด' },
                  { value: 'engagement', text: 'Engagement' },
                ]" />
              </b-form-group>
            </b-col>
            <b-col cols="12" md="4">
              <section id="date-picker" class="d-inline position-relative align-bottom">
                <date-picker v-model="valueDate" type="date" range placeholder="เลือกช่วงเวลา" size="sm"
                  :disabled-date="(date) => date >= new Date()" value-type="format" format="YYYY-MM-DD"
                  @change="checkDateRange()" id="date-domain">{{ valueDate }}</date-picker>
              </section>
            </b-col>

            <b-col cols="12" md="auto">
              <!-- <small class="text-muted">1–100</small> -->
              <!-- Limit/Page -->
              <!-- <b-form-group  class="pr-md-3">
                <b-form-input type="number" min="1" max="100" v-model.number="filters.limit" />จำนวนข้อมูล
               
              </b-form-group> -->
            </b-col>

          </b-row>

          <b-row align-h="end">
            <b-col cols="12" md="auto">
              <b-form-group class="pr-md-3">
                <b-form-radio-group v-model="filters.view_mode" :options="[
                  { value: 'posts', text: 'ตามเวลา' },
                  { value: 'daily', text: 'รายวัน' },
                ]" buttons button-variant="outline-info" size="md" />
              </b-form-group>
            </b-col>
            <b-col cols="12" md="auto">
              <div>
                <div class="align-self-end mb-3">
                  <b-button type="submit" variant="info" class="mr-2 px-5" :disabled="loading">
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

      <!-- Loading -->
      <div class="text-center my-4 py-4" v-if="loading">
        <vue-element-loading :active="loading" size="80" background-color="rgba(255, 255, 255, 0.5)"
            color="#17a2b891" />
      </div>


      <!-- Timeline -->
      <timeline-posts :items="postsFromApi" :mode="filters.view_mode" :sort="filters.sort_by" v-else />
      <div v-if="filters.view_mode === 'posts' && !loading && filters.page < totalPages" class="text-center my-2 pb-5">
        <div class="text-center mb-3 py-5" v-if="loadingMore">
          <vue-element-loading :active="loadingMore" size="80" background-color="rgba(255, 255, 255, 0.5)"
            color="#17a2b891" />
        </div>
        <b-button variant="outline-info" @click="loadMorePosts" pill  v-else>
          <span> <i class="fa fa-plus" aria-hidden="true"></i> Timeline</span>
        </b-button>
      </div>

    </div>
  </div>
</template>

<script>
import HomeNav from "@/components/HomeNav.vue";
import LinkMain2 from "@/components/linknode/LinkMain2.vue";
import TimelinePosts from "@/components/linknode/TimelinePosts2.vue";
import { mapGetters } from "vuex";
import "vue-select/dist/vue-select.css";
import moment from "moment";
export default {
  components: { HomeNav, LinkMain2, TimelinePosts },

  data() {
    return {
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
        keywordInput: "บิ๊กเต่า ภูมิธรรม",
        view_mode: "posts",
        source: ["facebook", "tiktok", "twitter"],
        sort_by: "descend",
        limit: 10,
        page: 1
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
    buildKeywordParam() {
      const raw = (this.filters.keywordInput || "").trim();
      if (!raw) return "";
      return raw
        .split(",")
        .map((g) => g.trim().split(/[+\s]+/).filter(Boolean).join("+"))
        .join(",");
    },
    buildParamsForDay(ymd) {
      const p = {
        sentiment: this.filters.sentiment.join(","),
        keyword: this.buildKeywordParam(),
        source: this.filters.source.join(","),
        sort_by: this.filters.sort_by === "recent" ? undefined : this.filters.sort_by,
        limit: 10,
        page: 1,
        start: `${ymd}T00:00:00`,
        end: `${ymd}T23:59:59`
      };
      Object.keys(p).forEach((k) => (p[k] == null || p[k] === "") && delete p[k]);
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
        const startYMD = this.valueDate?.[0];
        const endYMD = this.valueDate?.[1];
        const days = this.getDaysInclusive(startYMD, endYMD);
        const commonGrouped = [];
        for (const ymd of days) {
          const params = this.buildParamsForDay(ymd);
          try {
            const { data } = await this.axios.get("https://api2.cognizata.com/api/v2/userposts/getFulltextPost", { params });
            if (data?.data?.length) {
              commonGrouped.push({ date: ymd, items: data.data });
            }
          } catch (err) {
            console.warn("daily error", ymd, err);
          }
        }
        this.postsFromApi = commonGrouped;
        this.count = commonGrouped.length;
        this.totalPages = 0;
      } finally {
        this.loading = false;
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
    buildParams() {
      const p = {
        sentiment: this.filters.sentiment.join(","),
        keyword: this.buildKeywordParam(),
        start: this.valueDate[0] + "T00:00:00",
        end: this.valueDate[1] + "T23:59:59",
        source: this.filters.source.join(","),
        sort_by: this.filters.sort_by === "recent" ? undefined : this.filters.sort_by,
        limit: this.filters.limit,
        page: this.filters.page
      };
      Object.keys(p).forEach((k) => (p[k] == null || p[k] === "") && delete p[k]);
      return p;
    },
    async loadMorePosts() {
      if (this.filters.page >= this.totalPages) return;
      this.loadingMore = true;
      this.filters.page += 1;
      try {

        const params = this.buildParams();
        const { data } = await this.axios.get("https://api2.cognizata.com/api/v2/userposts/getFulltextPost", { params });
        const newItems = data.data || [];
        this.postsFromApi = [...this.postsFromApi, ...newItems];
        this.totalPages = data.totalPages || this.totalPages;
        this.count = data.count || this.count;

      } catch (e) {
        console.error(e);
      } finally {
        this.loadingMore = false;
      }
    },
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
      this.filters.page = 1;
      this.postsFromApi = [];
      this.apiTimeline();
    }
  }
};
</script>

<style scoped>
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

.mx-input {
  display: inline-block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 38.5px;
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
</style>
