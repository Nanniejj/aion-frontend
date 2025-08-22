<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />

    <div class="container my-3 d-none">

      <!-- Filters Card -->
      <b-card class="mb-3 shadow-sm">
        <b-form @submit.prevent="handleSearch">
          <div class="text-left">คำค้นหา (AND ใช้ช่องว่างหรือ +, OR ใช้ ,)</div>
          <b-row>

            <b-col>
              <b-form-group label="" label-for="kw" class="pr-md-3 flex-grow-1">
                <b-form-input id="kw" v-model.trim="filters.keywordInput"
                  placeholder="เช่น พระมงกุฎฯ ประวิตร, กรุงเทพ" />
                <small class="text-muted">
                  ตัวอย่าง: <code>พระมงกุฎฯ ประวิตร, กรุงเทพ</code> =
                  (พระมงกุฎฯ AND ประวิตร) OR (กรุงเทพ)
                </small>
              </b-form-group>

            </b-col>
            <b-col>
              <section id="date-picker" class="d-inline position-relative align-bottom">
                <date-picker v-model="valueDate" type="date" range placeholder="เลือกช่วงเวลา" size="sm"
                  :disabled-date="(date) => date >= new Date()" value-type="format" format="YYYY-MM-DD"
                  @change="checkDateRange()" id="date-domain">{{ valueDate }}</date-picker>
              </section>
            </b-col>
            <b-col>
              <v-select :options="sourceOptions" v-model="filters.source"  id="search-input" label="text"
               class="mb-2 select-sort" placeholder="Select Platform"   multiple ></v-select>
            </b-col>
          </b-row>

          <div class="d-flex flex-wrap">
            <!-- Keyword -->

            <!-- Sentiment -->
            <b-form-group label="Sentiment" class="pr-md-3">
              <b-form-checkbox-group v-model="filters.sentiment" :options="sentimentOptions" stacked />
            </b-form-group>

            <!-- Source -->
            <!-- <b-form-group label="แหล่งที่มา (Source)" class="pr-md-3">
              <b-form-select v-model="filters.source" :options="sourceOptions" multiple :select-size="5" />
              <small class="text-muted d-block">เลือกได้หลายรายการ</small>
            </b-form-group> -->

            <!-- Sort -->
            <b-form-group label="เรียงลำดับ" class="pr-md-3">
              <b-form-select v-model="filters.sort_by" :options="[
                { value: 'descend', text: 'เก่า → ใหม่ (date ASC)' },
                { value: 'recent', text: 'ใหม่ → เก่า (date DESC)' },
                { value: 'engagement', text: 'Engagement มาก → น้อย' }
              ]" />
            </b-form-group>

            <!-- Limit/Page -->
            <b-form-group label="แสดงต่อหน้า" class="pr-md-3">
              <b-form-input type="number" min="1" max="100" v-model.number="filters.limit" />
              <small class="text-muted">1–100</small>
            </b-form-group>

          </div>

          <div class="d-flex flex-wrap">



            <div class="align-self-end mb-3">
              <b-button type="submit" variant="primary" class="mr-2" :disabled="loading">
                ค้นหา
              </b-button>
              <b-button variant="outline-secondary" @click="resetFilters" :disabled="loading">
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
      <timeline-posts :items="postsFromApi" :direction="horizontal" v-else />

      <!-- Pagination -->
      <div class="d-flex justify-content-center my-3" v-if="!loading && totalPages > 1">
        <b-pagination v-model="filters.page" :per-page="filters.limit" :total-rows="count" @input="changePage"
          first-number last-number align="center" />
      </div>

      <TimelinePosts  />
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
        moment(new Date())
          .format()
          .slice(0, 10),
        moment(new Date())
          .format()
          .slice(0, 10),
      ],
      // ฟิลเตอร์เริ่มต้น
      filters: {
        sentiment: ['1', '0', '-1'],           // multi
        keywordInput: 'รั้ว กัมพูชา', // ผู้ใช้พิมพ์ด้วยเว้นวรรค/เครื่องหมาย +

        source: ['facebook', 'tiktok', 'twitter'], // multi
        sort_by: 'descend',                  // 'descend' | 'recent' | 'engagement'
        limit: 10,
        page: 1
      },

      sentimentOptions: [
        { text: 'Positive (1)', value: '1' },
        { text: 'Neutral (0)', value: '0' },
        { text: 'Negative (-1)', value: '-1' }
      ],

      // สามารถปรับรายการให้ตรงกับระบบจริงของคุณ
      sourceOptions: [
        { value: 'facebook', text: 'Facebook' },
        { value: 'twitter', text: 'Twitter/X' },
        { value: 'tiktok', text: 'TikTok' },
        { value: 'news', text: 'News' },
        { value: 'youtube', text: 'YouTube' },
        { value: 'instagram', text: 'Instagram' },
        { value: 'blockdit', text: 'Blockdit' },
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
      "getToSection"
    ]),
  },

  methods: {
    // แปลง keyword input เป็นรูปแบบที่ backend รองรับ:
    // - แยกกลุ่มด้วย comma (OR)
    // - ภายในกลุ่ม: AND ด้วย '+'
    // - encode '+' เป็น %2B เวลาแนบเป็น querystring
    buildKeywordParam() {
      const raw = (this.filters.keywordInput || '').trim();
      if (!raw) return '';

      // แยกกลุ่มด้วย comma
      const groups = raw.split(',').map(g => g.trim()).filter(Boolean);

      // ภายในกลุ่ม: แยกด้วย whitespace หรือ '+' แล้ว join ด้วย '+'
      const normalized = groups.map(g => {
        const terms = g.split(/[+\s]+/).map(t => t.trim()).filter(Boolean);
        return terms.join('+'); // AND
      });

      // กลับเป็นสตริง OR ด้วย comma
      return normalized.join(',');
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

    async apiTimeline() {
      this.loading = true;
      try {
        const params = {
          sentiment: (this.filters.sentiment || []).join(','),          // '1,0,-1'
          keyword: this.buildKeywordParam(),                            
          start: this.filters.startLocal,          
          end: this.filters.endLocal,               
          source: (this.filters.source || []).join(','),                // 'facebook,tiktok,twitter'
          sort_by: this.filters.sort_by === 'recent' ? undefined : this.filters.sort_by,
          limit: this.filters.limit,
          page: this.filters.page
        };

        // ลบ key ที่ไม่มีค่าออก เพื่อลดความสับสน
        Object.keys(params).forEach(k => (params[k] == null || params[k] === '') && delete params[k]);

        const { data } = await this.axios.request({
          method: 'GET',
          url: 'http://localhost:3000/api/v2/userposts/getFulltextPost',
          params
        });

        // รองรับทั้งแบบ {count, data, totalPages} หรือ {data, next_cursor}
        this.postsFromApi = data.data || [];
        this.count = data.count || 0;
        this.totalPages = data.totalPages || Math.ceil((this.count || 0) / (this.filters.limit || 1));

      } catch (e) {
        console.error(e);
        this.postsFromApi = [];
        this.count = 0;
        this.totalPages = 0;
      } finally {
        this.loading = false;
      }
    },

    handleSearch() {
      this.filters.page = 1;
      this.apiTimeline();
    },

    changePage() {
      this.apiTimeline();
    },

    resetFilters() {
      this.filters = {
        sentiment: ['1', '0', '-1'],
        keywordInput: '',
        startLocal: this.valueDate[0] + "T00:00:00",
        endLocal:  this.valueDate[1] + "T23:59:59",
        source: [],
        sort_by: 'descend',
        limit: 10,
        page: 1
      };
      this.apiTimeline();
    },

   
  },

  async mounted() {
    // // ตั้งค่าเริ่มต้น (ถ้าอยากเป็นวันนี้)
    // if (this.valueDate[0] == null) {
    //   this.filters.startLocal =
    //     moment(new Date())
    //       .format()
    //       .slice(0, 10) + "T00:00:00";
    //   this.filters.endLocal =
    //     moment(new Date())
    //       .format()
    //       .slice(0, 10) + "T23:59:59";
    // } else {
    //   this.filters.startLocal = this.valueDate[0] + "T00:00:00";
    //   this.filters.endLocal = this.valueDate[1] + "T23:59:59";
    // }


    // let domain = localStorage.getItem("domainArr");
    // this.$store.commit("setDomainArr", domain);
    // this.apiTimeline();
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
</style>
