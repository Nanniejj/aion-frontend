<!-- TopAccountsCard.vue -->
<template>
  <div class="mx-0 box-spot-bg">
    <vue-element-loading :active="loading" size="0" background-color="rgba(255,255,255,0.5)" color="#b6ac9a" />

    <!-- header + controls -->

    <b-row class="position-relative">
      <b-col class="text-left" cols="12" md="">
        <h5 class="mb-sm-0 mb-0">Top 10 Users </h5>
        <div class="text-left text-muted">
          <small>บัญชีที่กล่าว<b v-if="keyword"> {{ keyword }} </b>ถึงมากที่สุด 10 อันดับ </small>
        </div>
      </b-col>
      <b-col v-if="showSentimentFilter" cols="12" md="auto">
        
        <b-form-group class="d-inline-block mr-2 align-middle mb-2 g-stm" >
          <b-form-checkbox-group v-model="selectedTop" size="sm" class="align-middle sentiment-group mt-1"
            @change="applyLocalTopSent">
            <!-- Positive -->
            <b-form-checkbox value="1" class="mx-1 sentiment-pill positive" size="sm">
              <i class="far fa-smile fa-lg d-inline" style="color:#53b993;"></i>
              <span class="ml-1 small">Positive</span>
            </b-form-checkbox>

            <!-- Neutral -->
            <b-form-checkbox value="0" class="mx-1 sentiment-pill neutral" size="sm">
              <i class="far fa-meh fa-lg d-inline" style="color:#368ab6;"></i>
              <span class="ml-1 small">Neutral</span>
            </b-form-checkbox>

            <!-- Negative -->
            <b-form-checkbox value="-1" class="mx-1 sentiment-pill negative" size="sm">
              <i class="far fa-frown-open fa-lg d-inline" style="color:#f06964;"></i>
              <span class="ml-1 small">Negative</span>
            </b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
      </b-col>

      <b-col class="text-right col-card" cols="12" md="auto">
        <b-button-group size="sm" class="ml-1 btn-sw">
          <b-button size="sm" @click="onCardClick({ name: '', uid: '', source: '' })" variant="text">
            <i class="fa fa-arrows-rotate"></i>
            reset
          </b-button>
          <b-button :variant="view === 'cards' ? 'info' : 'outline-info'" @click="setView('cards')" size="sm">
            <i class="fas fa-th-large mr-1"></i> Cards
          </b-button>
          <b-button :variant="view === 'chart' ? 'info' : 'outline-info'" @click="setView('chart')" size="sm">
            <i class="fas fa-chart-bar mr-1"></i> Chart
          </b-button>
        </b-button-group>

      </b-col>
    </b-row>
    <!-- <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap">
     
      <div class="d-flex flex-wrap align-items-center" style="gap:.5rem;">
        <b-form-input v-model="searchInput" size="sm" placeholder="ค้นหา account / uid / แหล่งที่มา" class="w-auto"
          @input="onSearchInput" />
        <b-form-select v-model="sourceFilter" :options="sourceOptions" size="sm" class="w-auto" @change="resetScroll" />
        <b-form-select v-model="sortBy" :options="sortOptions" size="sm" class="w-auto" @change="resetScroll" />

       
      </div>
    </div> -->
    <!-- ===== CARDS VIEW (SLIDER) ===== -->
    <div v-if="view === 'cards'">
      <div v-if="rows.length" class="slider-container">
        <b-button class="slider-button btn-left" @click="scrollLeft" v-b-tooltip.hover title="เลื่อนซ้าย">
          <i class="fa fa-chevron-left"></i>
        </b-button>

        <div class="slider" ref="slider">
          <div class="d-flex box-flex-small">
            <div v-for="(item, i) in accounts" :key="item.uid" class="slider-item px-2">
              <!-- {{ item }} -->
              <b-card class="ta-card h-100 shadow-sm" :class="{ 'ta-top': i < 3 }" body-class="p-0"
                @click="onCardClick(item)" style="cursor:pointer" href="#chart">
                <div class="d-flex justify-content-between">
                  <span class="position-absolute h6 py-2 bold pt-3 px-1 " style="color:#7782bf;">{{ i + 1 }}</span>
                </div>
                <div class="ta-hero  d-flex flex-column align-items-center justify-content-center">
                    <div class="avatar-wrapper d-flex flex-column align-items-center justify-content-center">
                        <b-avatar :src="item.profile_image || null"
                          :text="!item.profile_image ? initials(item.name || item.uid) : null" size="72" variant="light"
                          class="mb-2 avatar-d" style="background-color: #918f8a !important;" />
                        <img v-if="item.source === 'twitter'" :src="imgtw" class="social-img" />
                        <img v-if="item.source === 'facebook'" :src="imgfb" class="social-img" />
                        <img v-if="item.source === 'pantip'" :src="imgpt" class="social-img" />
                        <img v-if="item.source === 'youtube'" :src="imgyt" class="social-img" />
                        <img v-if="item.source === 'news'" :src="imgnw" class="social-img" />
                        <img v-if="item.source === 'instagram'" :src="imgig" class="social-img" />
                        <img v-if="item.source === 'blockdit'" :src="imgbd" class="social-img" />
                        <img v-if="item.source === 'tiktok'" :src="imgtt" class="social-img" />
                        <img v-if="item.source === 'threads'" :src="imgtd" class="social-img" />
                        
                        <!-- Donut Chart -->
                        <div class="donut-overlay">
                          <SentimentDonutChart :sentimentSeries="[item.positiveSentiment,item.neutralSentiment,item.negativeSentiment]"/>
                        </div>

                    </div>
                  <div class="text-center px-3 pt-3">
                    <!-- <a :href="item.link_crawl" target="_blank" @click.stop> -->
                    <div class="mb-0 text-truncate small">{{ item.name || item.uid }}</div>
                    <!-- </a> -->
                  </div>
                  <div class="py-0 my-0"><small class="text-muted ">กล่าวถึง</small></div>
                  <div class=" py-0 my-0">
                    <span class="bold mx-1"> {{ item.total | numFormat }}</span> <small class="text-muted"
                      style="font-size: x-small;">โพสต์</small>
                  </div>
                  <div class="box-stm px-1">
                    <i class="far fa-smile fa-2x d-inline" style="color: #53b993;"></i><span class="small mr-2 bold"> {{
                      item.positiveSentiment | numFormat }}</span>
                    <i class="far fa-meh fa-2x d-inline" style="color: #368ab6;"></i><span class="small mr-2 bold"> {{
                      item.neutralSentiment | numFormat }}</span>
                    <i class="far fa-frown-open fa-2x d-inline" style="color: #f06964;"></i><span class="small bold"> {{
                      item.negativeSentiment | numFormat }}</span>
                  </div>
                </div>
                <div class="px-2 pb-1">
                  <div class="d-flex align-items-center justify-content-between">
                  </div>
                </div>
              </b-card>
            </div>
          </div>
        </div>

        <b-button class="slider-button btn-right" @click="scrollRight" v-b-tooltip.hover title="เลื่อนขวา">
          <i class="fa fa-chevron-right"></i>
        </b-button>
      </div>

      <div v-else-if="!loading" class="py-8 text-center text-muted">ไม่พบรายการที่ตรงกับเงื่อนไข</div>

      <!-- <div class="text-right mt-2">
        <b-button size="sm" variant="outline-info" class="p-1" @click="$emit('requestLoadMore')" :disabled="!hasMore"
          v-b-tooltip.hover title="โหลดเพิ่ม" pill>
          <i class="fa fa-plus"></i>
        </b-button>
      </div> -->
    </div>

    <!-- ===== CHART VIEW (ใช้คอมโพเนนต์ใหม่) ===== -->
    <div v-else>
      <!-- <TopAccountsChart :key="chartKey" :items="chartItems" :limit="chartLimit"
        @add-watch="$emit('add-watch', $event)" /> -->

      <TopAccountsProgress :items="accounts" :limit="chartLimit"
        :order="sortBy.startsWith('count') ? (sortBy === 'count-asc' ? 'asc' : 'desc') : 'desc'"
        @add-watch="onCardClick" />
    </div>
  </div>
</template>

<script>
import TopAccountsChart from './TopAccountsChart.vue';
import TopAccountsProgress from './TopAccountsProgress.vue';
import SentimentDonutChart from './SentimentDonutChart.vue';
export default {
  name: 'TopAccountsCard',
  emits: ['filter-account'],
  components: { TopAccountsChart, TopAccountsProgress, SentimentDonutChart },
    props: {
    showSentimentFilter:{type: Boolean, default: true},
    accounts: { type: Array, required: true },
    limit: { type: Number, default: 0 },     // จำกัดจำนวนการ์ดในโหมด Cards
    loading: { type: Boolean, default: false },
    hasMore: { type: Boolean, default: false },
    chartLimit: { type: Number, default: 15 },    // จำกัดจำนวนใน Chart
    topSentiment: { type: String, default: '1,0,-1' },
    defaultView: { type: String, default: 'cards' }, // 'cards' | 'chart'
    keyword: { type: String, default: '' } // 'cards' | 'chart'
  },
  data() {
    return {
      selectedTop: [],
      search: '',        // ที่ใช้จริงในการกรอง
      searchInput: '',   // ผูกกับกล่องค้นหา (debounce)
      sourceFilter: 'all',
      sortBy: 'count-desc',
      view: this.defaultView,
      _t: null,
      topSent: '1,0,-1',
      default_avatar: require("@/assets/no-image.jpg"),
      imgtw: require("@/assets/Twitter.png"),
      imgfb: require("@/assets/Facebook.png"),
      imgpt: require("@/assets/board.png"),
      imgig: require("@/assets/Instagram.png"),
      imgnw: require("@/assets/News.png"),
      imgyt: require("@/assets/Youtube.png"),
      imgbd: require("@/assets/Blockdit.png"),
      imgtt: require("@/assets/Tiktok.png"),
      imgtd: require("@/assets/Threads.png"),
    };
  },
  watch: {
    defaultView(v) { this.view = v; },
    topSentiment(newVal) {
      this.selectedTop = String(newVal || '1,0,-1').split(',').filter(Boolean);
    }
  },
  computed: {
    sortOptions() {
      return [
        { value: 'count-desc', text: 'มาก → น้อย' },
        { value: 'count-asc', text: 'น้อย → มาก' },
        { value: 'name-asc', text: 'ชื่อ A → Z' },
        { value: 'name-desc', text: 'ชื่อ Z → A' }
      ];
    },
    normalized() {
      const rows = (this.accounts || []).map(a => ({
        count: Number(a.total || 0),
        id: a.id || null,
        uid: a.uid || '',
        name: a.name || a.uid || '',
        link_crawl: a.link_crawl || '#',
        source: (a.source || a.source || 'unknown').toLowerCase(),
        profile_image: a.profile_image || null
      }));
      // dedupe by uid: เก็บตัวที่ count สูงสุด
      const byUid = new Map();
      for (const r of rows) {
        if (!byUid.has(r.uid) || r.total > byUid.get(r.uid).total) byUid.set(r.uid, r);
      }
      return Array.from(byUid.values());
    },
    sourceOptions() {
      const set = new Set(this.normalized.map(r => r.source || 'unknown'));
      const opts = Array.from(set).sort().map(s => ({ value: s, text: s || 'unknown' }));
      return [{ value: 'all', text: 'ทุกแหล่งที่มา' }, ...opts];
    },
    filtered() {
      const q = this.search.trim().toLowerCase();
      return this.normalized.filter(r => {
        const passSource = this.sourceFilter === 'all' || (r.source || 'unknown') === this.sourceFilter;
        const txt = `${r.name} ${r.uid} ${r.source}`.toLowerCase();
        return passSource && (q ? txt.includes(q) : true);
      });
    },
    sorted() {
      const arr = [...this.filtered];
      switch (this.sortBy) {
        case 'count-asc': arr.sort((a, b) => a.total - b.total); break;
        case 'name-asc': arr.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'th')); break;
        case 'name-desc': arr.sort((a, b) => (b.name || '').localeCompare(a.name || '', 'th')); break;
        default: arr.sort((a, b) => b.total - a.total); // count-desc
      }
      return arr;
    },
    maxCount() {
      return Math.max(1, ...this.sorted.map(r => r.total || 0));
    },
    rows() {
      return this.limit > 0 ? this.sorted.slice(0, this.limit) : this.sorted;
    },
    // ส่งให้ TopAccountsChart (ให้ลูกจัดการ limit เอง)
    chartItems() {
      return this.sorted;
    },
    // บังคับ remount chart เมื่อฟิลเตอร์/เรียง/ค้นหาเปลี่ยน
    chartKey() {
      return ['chart', this.sourceFilter, this.sortBy, this.search, this.chartItems.length].join('|');
    }
  },
  methods: {
    applyLocalTopSent() {
      // ถ้าไม่ติ๊กอะไรเลย ให้ถือว่าเลือก “ทั้งหมด”
      const val = this.selectedTop.length ? this.selectedTop.join(',') : '1,0,-1';
      this.$emit('change-top-sentiment', val);   // ✅ พาเรนต์จะ set topSentiment + fetchTopAccounts()
    },
    setTopSent(val) {
      this.topSent = val;
      // แจ้ง parent ให้โหลด TOP_ACCOUNTS_ENDPOINT ใหม่ โดยไม่แตะโพสต์
      this.$emit('change-top-sentiment', val);
    },

    onCardClick(item) {
      console.log(item);

      // ส่งค่าที่จำเป็นไปให้หน้า Post
      this.$emit('filter-account', {
        uid: item.name || item.uid,
        name: item.name || item.uid,
        source: item.source || this.guessSource(item.link_crawl || '')
      });
      var element = document.querySelector("#chart");
      element.scrollIntoView({ behavior: "smooth" });
    },
    setView(v) {
      this.view = v;
      this.$nextTick(() => this.resetScroll());
    },
    resetScroll() {
      const slider = this.$refs.slider;
      if (slider) slider.scrollLeft = 0;
    },
    scrollLeft() { const s = this.$refs.slider; if (s) s.scrollLeft -= 300; },
    scrollRight() { const s = this.$refs.slider; if (s) s.scrollLeft += 300; },
    onSearchInput() {
      clearTimeout(this._t);
      this._t = setTimeout(() => { this.search = this.searchInput; }, 200);
    },
    initials(name) {
      const parts = String(name || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
      const first = (parts[0] || '').charAt(0);
      const last = parts.length > 1 ? (parts[parts.length - 1] || '').charAt(0) : '';
      return (first + last || first || '?').toUpperCase();
    },
    guessSource(url = '') {
      if (!url) return 'unknown';

      let host = '';
      try {
        const u = new URL(url.startsWith('http') ? url : 'https://' + url);
        host = (u.hostname || '').toLowerCase();
      } catch (e) {
        host = (url || '').toLowerCase();
      }

      // X / Twitter (รวม t.co)
      if (/(^|\.)x\.com$|(^|\.)twitter\.com$|(^|\.)t\.co$/.test(host)) return 'twitter';

      // YouTube
      if (/(^|\.)youtube\.com$|(^|\.)youtu\.be$/.test(host)) return 'youtube';

      // Facebook (รวม m.facebook, fb.me, fb.watch)
      if (/(^|\.)facebook\.com$|(^|\.)m\.facebook\.com$|(^|\.)fb\.me$|(^|\.)fb\.watch$/.test(host)) return 'facebook';

      // Instagram (รวม ig.me)
      if (/(^|\.)instagram\.com$|(^|\.)ig\.me$/.test(host)) return 'instagram';

      // Pantip (Board)
      if (/(^|\.)pantip\.com$/.test(host)) return 'pantip';

      // Blockdit
      if (/(^|\.)blockdit\.com$/.test(host)) return 'blockdit';

      // TikTok
      if (/(^|\.)tiktok\.com$/.test(host)) return 'tiktok';

      // Threads
      if (/(^|\.)threads\.net$/.test(host)) return 'threads';

      // อื่น ๆ ถือเป็นข่าว/เว็บไซต์ทั่วไป
      return 'news';
    },

    sourceVariant(s) {
      const m = { twitter: 'info', youtube: 'danger', facebook: 'info', news: 'secondary', instagram: 'warning', unknown: 'dark' };
      return m[(s || 'unknown').toLowerCase()] || 'secondary';
    },
    progress(count) {
      return (Number(count || 0) / this.maxCount) * 100;
    }
  },
  mounted() {
    // ✅ ตั้งค่าเริ่มจากพาเรนต์
    this.selectedTop = String(this.topSentiment || '1,0,-1').split(',').filter(Boolean);
  },
  beforeDestroy() {
    if (this._t) clearTimeout(this._t);
  }
};
</script>
<style>
/* ปรับ pill ให้สวยขึ้น */
.sentiment-group .sentiment-pill .custom-control-label {
  border-radius: 999px;
  padding: 2px 10px 3px 8px;
  cursor: pointer;
  transition: background-color .15s ease, box-shadow .15s ease;
}

.sentiment-group .positive .custom-control-input:checked~.custom-control-label::before {
  color: #fff;
  background-color: #53b993;
  border: #53b993 solid 1px;
}

.sentiment-group .neutral .custom-control-input:checked~.custom-control-label::before {
  color: #fff;
  background-color: #368ab6;
  border: #368ab6 solid 1px;
}

.sentiment-group .negative .custom-control-input:checked~.custom-control-label::before {
  color: #fff;
  background-color: #f06964;
  border: #f06964 solid 1px;
}

/* ขอบอ่อน ๆ ตอน hover */
.sentiment-group .sentiment-pill .custom-control-label:hover {
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05) inset;
}

/* พื้นหลังตามสถานะเมื่อถูกเลือก */
.sentiment-group .positive .custom-control-input:checked~.custom-control-label {
  background: rgba(83, 185, 147, 0.15);
}

.sentiment-group .neutral .custom-control-input:checked~.custom-control-label {
  background: rgba(54, 138, 182, 0.15);
}

.sentiment-group .negative .custom-control-input:checked~.custom-control-label {
  background: rgba(240, 105, 100, 0.15);
}

/* ซ่อน checkbox เองให้เหลือแต่ label (bootstrap-vue ใช้ custom-control) */
.sentiment-group .custom-control-input {
  top: 0.4rem;
  /* จัดให้คลิกง่ายขึ้น */
}
</style>
<style scoped>
.avatar-wrapper {
  position: relative;
  display: inline-block; /* ทำให้ห่อ avatar + chart */
  text-align: center;
}
.donut-overlay {
  position: absolute;
  /* top: 3px; */
  /* left: 24%; */
  /* width: 95px; */
  /* height: 95px; */
  z-index: 0;
}
.g-stm{
    transform: scale(0.9);
}
.btn-sw {
  transform: scale(0.8);
}

.box-stm bold {
  color: #4e5c6a;
}

.box-stm {
  width: 100%;
  background-color: #ffffff99;
  border-radius: 20px;
  padding-top: 3px;
}

.far {
  font-size: 16px;
}

.social-img {
  width: 35px !important;
  margin-top: -40px !important;
  margin-left: 40px !important;
  height: 35px !important;
  z-index: 10;
}

/* โครงพื้นฐานจากสไลด์เดิม + การ์ด TopAccounts */
.box-flex-small {
  width: 65vw;
  padding: 0 20px;
}

.box-spot-bg {
  min-height: auto !important;
  background-color: #ffffff;
  border-radius: 11px;
}

.slider-container {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  border-radius: 15px;
}

.slider {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 10px;
  width: 100%;
}

.slider::-webkit-scrollbar {
  display: none;
}

.slider-item {
  flex: 0 0 auto;
  width: 200px;

}

.slider-button {
  background-color: #3f3b3b00;
  color: rgb(112, 108, 108);
  border: none;
  padding: 10px 15px;
  margin: 0 4px;
  cursor: pointer;
  border-radius: 15px;
  font-size: 20px;
}

.slider-button:hover {
  background-color: #fed16e;
  color: #fff;
}

.ta-card {
  border: 0;
  border-radius: 20px;
  overflow: hidden;
  transition: transform .15s ease, box-shadow .15s ease;
  background: #fff;

}

.ta-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, .08);

}

.ta-card.ta-top {
  box-shadow: 0 0.85rem 1.6rem rgba(0, 0, 0, .12);
}

.ta-hero {
    height: 100%;
  padding: 20px 16px 8px;
  border-radius: 20px;
  background: #17A3B8CE;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  background: linear-gradient(to top, #b8d3d3a4, #decff0);
  /* background: linear-gradient(0deg, #ffe6e6 40%, #FDD071 100%); */
}

.text-truncate {
  max-width: 180px;
}

a {
  color: #2c3e50;
}

@media (max-width: 1000px) {
  #content > div.container.my-3 > div:nth-child(5) > div > div.row.position-relative > div.text-left.col-md.col-12{
    width: 100% !important;
    flex-basis: unset !important;
  }}
@media (max-width: 800px) {
  #content > div.container.my-3 > div:nth-child(5) > div > div.row.position-relative > div.text-left.col-md.col-12{
    width: 100% !important;
  }
  .g-stm{
    width: max-content !important;
  }
  .slider-button.btn-left {
    background: #fed06ebf;
    color: white;
    border: none;
    padding: 5px 11px;
    border-radius: 15px;
    font-size: 20px;
    z-index: 999;
    left: -18px;
    position: absolute;
  }

  .slider-button.btn-right {
    position: absolute;
    right: -18px;
    padding: 5px 11px;
    background: #fed06ebf;
    color: white;
  }

  .box-flex-small {
    width: 98vw;
    padding: 0 5px;
  }

  .slider-item {
    width: 170px;
  }

  .text-truncate {
    max-width: 100px;
  }

  .avatar-d {
    width: 45px !important;
    height: 45px !important;
    z-index: 1;
  }

  .social-img {
    width: 25px !important;
    height: 25px !important;
    margin-top: -30px !important;
  }
  .btn-sw {
    position: absolute;
    top: 0px;
    right: 5px;
    transform: scale(0.72);
    transform-origin: top right;
  }
  .col-card{
    position: absolute;
  }
}
</style>
<style></style>