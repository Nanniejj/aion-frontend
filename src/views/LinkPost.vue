<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />

    <div class="container my-3">
      <!-- Filters Card -->
      <b-card class="mb-3 shadow-sm">
        <b-form @submit.prevent="handleSearch">
          <div class="text-left">คำค้นหา (AND ใช้ช่องว่างหรือ +, OR ใช้ ,)</div>
          <b-row>
            <b-col>
              <b-form-group label="" label-for="kw" class="pr-md-3 flex-grow-1">
                <b-form-input
                  id="kw"
                  v-model.trim="filters.keywordInput"
                  placeholder="เช่น พระมงกุฎฯ ประวิตร, กรุงเทพ"
                />
                <small class="text-muted">
                  ตัวอย่าง: <code>พระมงกุฎฯ ประวิตร, กรุงเทพ</code> = (พระมงกุฎฯ
                  AND ประวิตร) OR (กรุงเทพ)
                </small>
              </b-form-group>
            </b-col>
            <b-col>
              <section
                id="date-picker"
                class="d-inline position-relative align-bottom"
              >
                <date-picker
                  v-model="valueDate"
                  type="date"
                  range
                  placeholder="เลือกช่วงเวลา"
                  size="sm"
                  :disabled-date="(date) => date >= new Date()"
                  value-type="format"
                  format="YYYY-MM-DD"
                  @change="checkDateRange()"
                  id="date-domain"
                  >{{ valueDate }}</date-picker
                >
              </section>
            </b-col>
            <b-col>
              <v-select
                :options="sourceOptions"
                v-model="filters.source"
                id="search-input"
                label="text"
                class="mb-2 select-sort"
                placeholder="Select Platform"
                multiple
              ></v-select>
            </b-col>
          </b-row>

          <div class="d-flex flex-wrap">
            <!-- Keyword -->

            <!-- Sentiment -->
            <b-form-group label="Sentiment" class="pr-md-3">
              <b-form-checkbox-group
                v-model="filters.sentiment"
                :options="sentimentOptions"
                stacked
              />
            </b-form-group>

            <!-- Source -->
            <!-- <b-form-group label="แหล่งที่มา (Source)" class="pr-md-3">
              <b-form-select v-model="filters.source" :options="sourceOptions" multiple :select-size="5" />
              <small class="text-muted d-block">เลือกได้หลายรายการ</small>
            </b-form-group> -->

            <!-- Sort -->
            <b-form-group label="เรียงลำดับ" class="pr-md-3">
              <b-form-select
                v-model="filters.sort_by"
                :options="[
                  { value: 'descend', text: 'เก่า → ใหม่ (date ASC)' },
                  { value: 'recent', text: 'ใหม่ → เก่า (date DESC)' },
                  { value: 'engagement', text: 'Engagement มาก → น้อย' },
                ]"
              />
            </b-form-group>

            <!-- Limit/Page -->
            <b-form-group label="แสดงต่อหน้า" class="pr-md-3">
              <b-form-input
                type="number"
                min="1"
                max="100"
                v-model.number="filters.limit"
              />
              <small class="text-muted">1–100</small>
            </b-form-group>
            <b-form-group label="โหมดผลลัพธ์" class="pr-md-3">
              <b-form-radio-group
                v-model="filters.view_mode"
                :options="[
                  { value: 'posts', text: 'ปกติ (ตามโพสต์)' },
                  { value: 'daily', text: 'รายวัน (Top10/วัน)' },
                ]"
                buttons
                button-variant="outline-primary"
                size="sm"
              />
            </b-form-group>
          </div>

          <div class="d-flex flex-wrap">
            <div class="align-self-end mb-3">
              <b-button
                type="submit"
                variant="primary"
                class="mr-2"
                :disabled="loading"
              >
                ค้นหา
              </b-button>
              <b-button
                variant="outline-secondary"
                @click="resetFilters"
                :disabled="loading"
              >
                ล้างค่า
              </b-button>
            </div>
          </div>
        </b-form>
      </b-card>

      <!-- Loading -->
      <div class="text-center my-4" v-if="loading">
        <b-spinner label="Loading..."></b-spinner>
      </div>

      <!-- Timeline -->
      <timeline-posts :items="postsFromApi" :mode="filters.view_mode" :sort="filters.sort_by" v-else />

      <!-- ซ่อนปุ่มเพจในโหมดรายวัน -->
      <div
        class="d-flex justify-content-center my-3"
        v-if="!loading && totalPages > 1 && filters.view_mode === 'posts'"
      >
        <b-pagination
          v-model="filters.page"
          :per-page="filters.limit"
          :total-rows="count"
          @input="changePage"
          first-number
          last-number
          align="center"
        />
      </div>

      <!-- <TimelinePosts /> -->
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
      loading: false,
      postsFromApi: [],
      count: 0,
      totalPages: 0,
      valueDate: [
        moment(new Date()).format().slice(0, 10),
        moment(new Date()).format().slice(0, 10),
      ],
      // ฟิลเตอร์เริ่มต้น
      filters: {
        sentiment: ["1", "0", "-1"], // multi
        keywordInput: "รั้ว กัมพูชา", // ผู้ใช้พิมพ์ด้วยเว้นวรรค/เครื่องหมาย +
        view_mode: "posts",
        source: ["facebook", "tiktok", "twitter"], // multi
        sort_by: "descend", // 'descend' | 'recent' | 'engagement'
        limit: 10,
        page: 1,
      },

      sentimentOptions: [
        { text: "Positive (1)", value: "1" },
        { text: "Neutral (0)", value: "0" },
        { text: "Negative (-1)", value: "-1" },
      ],

      // สามารถปรับรายการให้ตรงกับระบบจริงของคุณ
      sourceOptions: [
        { value: "facebook", text: "Facebook" },
        { value: "twitter", text: "Twitter/X" },
        { value: "tiktok", text: "TikTok" },
        { value: "news", text: "News" },
        { value: "youtube", text: "YouTube" },
        { value: "instagram", text: "Instagram" },
        { value: "blockdit", text: "Blockdit" },
      ],
    };
  },

  computed: {
    ...mapGetters([
      "getSelected",
      "getSentimentChart",
      "getWordCloud",
      "getDomain",
      "getLoadStatus",
      "getToSection",
    ]),
  },

  methods: {
    // แปลง keyword input เป็นรูปแบบที่ backend รองรับ:
    // - แยกกลุ่มด้วย comma (OR)
    // - ภายในกลุ่ม: AND ด้วย '+'
    // - encode '+' เป็น %2B เวลาแนบเป็น querystring
    buildKeywordParam() {
      const raw = (this.filters.keywordInput || "").trim();
      if (!raw) return "";

      // แยกกลุ่มด้วย comma
      const groups = raw
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean);

      // ภายในกลุ่ม: แยกด้วย whitespace หรือ '+' แล้ว join ด้วย '+'
      const normalized = groups.map((g) => {
        const terms = g
          .split(/[+\s]+/)
          .map((t) => t.trim())
          .filter(Boolean);
        return terms.join("+"); // AND
      });

      // กลับเป็นสตริง OR ด้วย comma
      return normalized.join(",");
    },

    isoFromLocal(localStr) {
      // localStr = 'YYYY-MM-DDTHH:mm' → สร้าง ISO (ไม่ใส่ timezone = แปลงเป็น local แล้ว toISOString)
      try {
        const d = new Date(localStr);
        return d.toISOString(); // backend คุณรองรับ ISO แล้ว +7h ภายใน
      } catch (_) {
        return null;
      }
    },

    getDaysInclusive(startYMD, endYMD) {
      const days = [];
      let cur = moment(startYMD, "YYYY-MM-DD");
      const end = moment(endYMD, "YYYY-MM-DD");
      while (cur.isSameOrBefore(end, "day")) {
        days.push(cur.format("YYYY-MM-DD"));
        cur = cur.add(1, "day");
      }
      return days;
    },

    async apiTimeline() {
      // แตกแขนงตามโหมด
      if (this.filters.view_mode === "daily") {
        return this.apiTimelineDaily();
      }
      // -------- โหมดปกติ (ตามโพสต์) เหมือนเดิม --------
      this.loading = true;
      try {
        const params = {
          sentiment: (this.filters.sentiment || []).join(","),
          keyword: this.buildKeywordParam(),
          start: this.valueDate?.[0]
            ? this.valueDate[0] + "T00:00:00"
            : undefined,
          end: this.valueDate?.[1]
            ? this.valueDate[1] + "T23:59:59"
            : undefined,
          source: (this.filters.source || []).join(","),
          sort_by:
            this.filters.sort_by === "recent"
              ? undefined
              : this.filters.sort_by,
          limit: this.filters.limit,
          page: this.filters.page,
        };

        Object.keys(params).forEach(
          (k) => (params[k] == null || params[k] === "") && delete params[k]
        );

        const { data } = await this.axios.request({
          method: "GET",
          url: "https://api2.cognizata.com/api/v2/userposts/getFulltextPost",
          params,
        });

        this.postsFromApi = data.data || [];
        this.count = data.count || 0;
        this.totalPages =
          data.totalPages ||
          Math.ceil((this.count || 0) / (this.filters.limit || 1));
      } catch (e) {
        console.error(e);
        this.postsFromApi = [];
        this.count = 0;
        this.totalPages = 0;
      } finally {
        this.loading = false;
      }
    },

    // -------- โหมดรายวัน (ยิงทีละวัน วันละ 10) --------
    async apiTimelineDaily() {
      this.loading = true;
      try {
        const startYMD = this.valueDate?.[0];
        const endYMD = this.valueDate?.[1];
        const days = this.getDaysInclusive(startYMD, endYMD);

        const common = {
          sentiment: (this.filters.sentiment || []).join(","),
          keyword: this.buildKeywordParam(),
          source: (this.filters.source || []).join(","),
          // ให้เคารพการเรียงที่เลือก (descend/recent/engagement)
          sort_by:
            this.filters.sort_by === "recent"
              ? undefined
              : this.filters.sort_by,
          limit: 10,
          page: 1,
        };

        const grouped = [];
        // ยิงทีละวัน (เรียงตาม days ที่ได้มา)
        for (const ymd of days) {
          const params = {
            ...common,
            start: `${ymd}T00:00:00`,
            end: `${ymd}T23:59:59`,
          };
          Object.keys(params).forEach(
            (k) => (params[k] == null || params[k] === "") && delete params[k]
          );

          try {
            const { data } = await this.axios.request({
              method: "GET",
              url: "https://api2.cognizata.com/api/v2/userposts/getFulltextPost",
              params,
            });
            const items = data?.data || [];
            if (items.length) {
              grouped.push({
                date: ymd, // ใช้สำหรับแสดงหัววัน
                items, // 10 โพสต์ของวันนั้น
              });
            } else {
              // ถ้าอยากแสดงวันที่ว่าง ให้ push ด้วย items: []
              // grouped.push({ date: ymd, items: [] })
            }
          } catch (e) {
            console.error("daily fetch error", ymd, e);
            // ข้ามวันนั้นไป
          }
        }

        // ตั้งค่าให้องค์ประกอบ TimelinePosts ใช้รูปแบบกลุ่ม
        this.postsFromApi = grouped; // [{date, items:[...]}]
        this.count = grouped.length;
        this.totalPages = 0; // โหมดรายวันไม่ใช้เพจ
      } finally {
        this.loading = false;
      }
    },

    handleSearch() {
      this.filters.page = 1;
      this.apiTimeline();
    },

    changePage() {
      // ใช้เฉพาะโหมดปกติ
      if (this.filters.view_mode === "posts") {
        this.apiTimeline();
      }
    },

    resetFilters() {
      this.filters = {
        sentiment: ["1", "0", "-1"],
        keywordInput: "",
        startLocal: this.valueDate[0] + "T00:00:00",
        endLocal: this.valueDate[1] + "T23:59:59",
        source: [],
        sort_by: "descend",
        limit: 10,
        page: 1,
        view_mode: "posts", // รีเซ็ตกลับโหมดปกติ
      };
      this.apiTimeline();
    },
  },
  async mounted() {
    // ตั้งค่าเริ่มต้น (ถ้าอยากเป็นวันนี้)
    if (this.valueDate[0] == null) {
      this.filters.startLocal =
        moment(new Date()).format().slice(0, 10) + "T00:00:00";
      this.filters.endLocal =
        moment(new Date()).format().slice(0, 10) + "T23:59:59";
    } else {
      this.filters.startLocal = this.valueDate[0] + "T00:00:00";
      this.filters.endLocal = this.valueDate[1] + "T23:59:59";
    }

    let domain = localStorage.getItem("domainArr");
    this.$store.commit("setDomainArr", domain);
    this.apiTimeline();
  },
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
</style>
