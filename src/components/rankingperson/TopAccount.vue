<!-- TopAccountsCard.vue -->
<template>
  <div class="py-2 mx-0 box-spot-bg">
    <vue-element-loading :active="loading" size="0" background-color="rgba(255,255,255,0.5)" color="#b6ac9a" />

    <!-- header + controls -->

    <b-row>
      <b-col class="text-left" cols="12" md="6">
        <h5 class="mb-sm-0 mb-0">Top 10 Users </h5>
        <div class="text-left text-muted">
          <small>บัญชีที่กล่าวถึงมากที่สุด 10 อันดับ </small>
        </div>
      </b-col>
      <b-col class="text-right" cols="12" md="6">
        <b-button-group size="sm" class="ml-1 btn-sw">
          <b-button :variant="view === 'cards' ? 'info' : 'outline-info'" @click="setView('cards')">
            <i class="fas fa-th-large mr-1"></i> Cards
          </b-button>
          <b-button :variant="view === 'chart' ? 'info' : 'outline-info'" @click="setView('chart')">
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
            <div v-for="(item, i) in rows" :key="item.uid" class="slider-item px-2">
              <b-card class="ta-card h-100 shadow-sm" :class="{ 'ta-top': i < 3 }" body-class="p-0"
                @click="onCardClick(item)" style="cursor:pointer">
                <div class="d-flex justify-content-between p-2">
                  <span class="position-absolute h6 py-2 bold pt-3 px-1 " style="color:#7782bf;">{{ i + 1 }}</span>

                </div>
                <div class="ta-hero d-flex flex-column align-items-center justify-content-center">
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
                  <div class="text-center px-3">
                    <a :href="item.link_crawl" target="_blank" @click.stop>
                      <div class="mb-0 text-truncate small">{{ item.name || item.uid }}</div>
                      <!-- <small class="text-muted text-truncate d-block">@{{ item.uid }}</small> -->
                    </a>
                  </div>
                  <div class="py-0 my-0"><small class="text-muted ">กล่าวถึง</small></div>
                  <div class=" py-0 my-0">

                    <span class="bold mx-1"> {{ item.count | numFormat }}</span> <small class="text-muted"
                      style="font-size: x-small;">โพสต์</small>
                  </div>
                </div>
                <div class="px-3 pb-3">
                  <!-- <div class="d-flex align-items-center justify-content-between mb-2">
                    <small class="text-muted">กล่าวถึง</small>
                    <b-badge pill variant="success">{{ item.count }} โพสต์</b-badge>
                  </div> -->
                  <!-- <b-progress :value="progress(item.count)" :max="maxCount" height="6px" class="mb-3" /> -->
                  <div class="d-flex align-items-center justify-content-between">
                    <!-- <b-button :href="item.link_crawl" target="_blank" rel="noopener noreferrer" size="sm"
                      variant="outline-secondary">เปิดลิงก์</b-button> -->
                    <!-- <b-button size="sm" variant="info" @click="$emit('add-watch', item)">ติดตาม</b-button> -->
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

      <TopAccountsProgress :items="chartItems" :limit="chartLimit"
        :order="sortBy.startsWith('count') ? (sortBy === 'count-asc' ? 'asc' : 'desc') : 'desc'"
        @add-watch="onCardClick" />
    </div>
  </div>
</template>

<script>
import TopAccountsChart from './TopAccountsChart.vue';
import TopAccountsProgress from './TopAccountsProgress.vue';
export default {
  name: 'TopAccountsCard',
  emits: ['filter-account'],
  components: { TopAccountsChart, TopAccountsProgress },
  props: {
    loading: { type: Boolean, default: false },
    accounts: { type: Array, required: true },
    limit: { type: Number, default: 0 },     // จำกัดจำนวนการ์ดในโหมด Cards
    loading: { type: Boolean, default: false },
    hasMore: { type: Boolean, default: false },
    chartLimit: { type: Number, default: 15 },    // จำกัดจำนวนใน Chart
    defaultView: { type: String, default: 'cards' } // 'cards' | 'chart'
  },
  data() {
    return {
      search: '',        // ที่ใช้จริงในการกรอง
      searchInput: '',   // ผูกกับกล่องค้นหา (debounce)
      sourceFilter: 'all',
      sortBy: 'count-desc',
      view: this.defaultView,
      _t: null,
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
    defaultView(v) { this.view = v; }
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
        count: Number(a.count || 0),
        id: a.id || null,
        uid: a.uid || '',
        name: a.name || a.uid || '',
        link_crawl: a.link_crawl || '#',
        source: (a.source || this.guessSource(a.link_crawl || '') || 'unknown').toLowerCase(),
        profile_image: a.profile_image || null
      }));
      // dedupe by uid: เก็บตัวที่ count สูงสุด
      const byUid = new Map();
      for (const r of rows) {
        if (!byUid.has(r.uid) || r.count > byUid.get(r.uid).count) byUid.set(r.uid, r);
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
        case 'count-asc': arr.sort((a, b) => a.count - b.count); break;
        case 'name-asc': arr.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'th')); break;
        case 'name-desc': arr.sort((a, b) => (b.name || '').localeCompare(a.name || '', 'th')); break;
        default: arr.sort((a, b) => b.count - a.count); // count-desc
      }
      return arr;
    },
    maxCount() {
      return Math.max(1, ...this.sorted.map(r => r.count || 0));
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
    onCardClick(item) {
      // ส่งค่าที่จำเป็นไปให้หน้า Post
      this.$emit('filter-account', {
        uid: item.uid,
        name: item.name || item.uid,
        source: item.source || this.guessSource(item.link_crawl || '')
      });
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
  beforeDestroy() {
    if (this._t) clearTimeout(this._t);
  }
};
</script>
<!-- <style>
.b-avatar-img img {
    width: 100%;
    height: unset !important; 
    /* max-height: auto !important; */
    border-radius:unset !important;

    -o-object-fit: cover;
    object-fit: cover;
}
</style> -->
<style scoped>
.social-img {
  width: 35px !important;
  margin-top: -40px !important;
  margin-left: 40px !important;
  height: 35px !important;
  z-index: 99;
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

@media (max-width: 800px) {
  .slider-button.btn-left {
    background: #fed06ebf;
    color: white;
    border: none;
    padding: 5px 11px;
    border-radius: 15px;
    font-size: 20px;
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
    width: 120px;
  }

  .avatar-d {
    width: 45px !important;
    height: 45px !important;
  }

  .social-img {
    width: 25px !important;
    height: 25px !important;
    margin-top: -35px !important;
  }

  .btn-sw {
    zoom: 75%;
  }
}
</style>
