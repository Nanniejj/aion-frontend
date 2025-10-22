<!-- TopAccountsCard.vue -->
<template>
  <div>
    <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap">
      <h5 class="mb-2 mb-sm-0">Top Accounts ที่พูดถึงเราบ่อยๆ</h5>
      <div class="d-flex" style="gap:.5rem;">
        <b-form-input
          v-model="search"
          size="sm"
          placeholder="ค้นหา account / uid / แหล่งที่มา"
          class="w-auto"
        />
        <b-form-select
          v-model="sourceFilter"
          :options="sourceOptions"
          size="sm"
          class="w-auto"
        />
      </div>
    </div>

    <b-row>
      <b-col
        v-for="(item, i) in displayRows"
        :key="item.uid + i"
        cols="12" sm="6" md="4" lg="3" xl="3"
        class="mb-4"
      >
        <b-card
          class="ta-card h-100 shadow-sm"
          :class="{ 'ta-top': i < 3 }"
          body-class="p-0"
        >
          <!-- ribbon badges -->
          <div class="d-flex justify-content-between p-2">
            <b-badge pill variant="primary">#{{ i+1 }}</b-badge>
            <b-badge :variant="sourceVariant(item.source)" class="text-capitalize">
              {{ item.source || 'unknown' }}
            </b-badge>
          </div>

          <!-- hero area -->
          <div class="ta-hero d-flex flex-column align-items-center justify-content-center">
            <b-avatar
              :src="item.profile_image || null"
              :text="!item.profile_image ? initials(item.name || item.uid) : null"
              size="72"
              variant="light"
              class="mb-2"
            />
            <div class="text-center px-3">
              <div class="h6 mb-0 text-truncate">{{ item.name || item.uid }}</div>
              <small class="text-muted text-truncate d-block">@{{ item.uid }}</small>
            </div>
          </div>

          <!-- content -->
          <div class="px-3 pb-3">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <small class="text-muted">Mention count</small>
              <b-badge pill variant="success">{{ item.count }}</b-badge>
            </div>

            <b-progress :value="progress(item.count)" :max="maxCount" height="6px" class="mb-3" />

            <div class="d-flex align-items-center justify-content-between">
              <b-button :href="item.link_crawl" target="_blank" size="sm" variant="outline-secondary">
                เปิดลิงก์
              </b-button>
              <b-button size="sm" variant="primary" @click="$emit('add-watch', item)">
                ติดตาม
              </b-button>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <div v-if="displayRows.length === 0" class="text-center text-muted py-4">
      ไม่พบรายการที่ตรงกับเงื่อนไข
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopAccountsCard',
  props: {
    accounts: { type: Array, required: true },
    limit: { type: Number, default: 0 }
  },
  data() {
    return {
      search: '',
      sourceFilter: 'all'
    };
  },
  computed: {
    normalized() {
      const rows = (this.accounts || []).map(a => ({
        count: Number(a.count || 0),
        id: a.id || null,
        uid: a.uid || '',
        name: a.name || a.uid || '',
        link_crawl: a.link_crawl || '#',
        source: a.source || this.guessSource(a.link_crawl),
        profile_image: a.profile_image || null
      }));
      rows.sort((x, y) => y.count - x.count);
      return rows;
    },
    maxCount() {
      return Math.max(1, ...this.normalized.map(r => r.count || 0));
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
    displayRows() {
      return this.limit > 0 ? this.filtered.slice(0, this.limit) : this.filtered;
    }
  },
  methods: {
    initials(name) {
      const parts = String(name || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
      const first = (parts[0] || '').charAt(0);
      const last = parts.length > 1 ? (parts[parts.length - 1] || '').charAt(0) : '';
      return (first + last || first || '?').toUpperCase();
    },
    guessSource(url = '') {
      if (!url) return 'unknown';
      if (/twitter\.com|x\.com/i.test(url)) return 'twitter';
      if (/youtube\.com|youtu\.be/i.test(url)) return 'youtube';
      if (/facebook\.com/i.test(url)) return 'facebook';
      if (/instagram\.com/i.test(url)) return 'instagram';
      return 'news';
    },
    sourceVariant(s) {
      const m = { twitter: 'info', youtube: 'danger', facebook: 'primary', news: 'secondary', instagram: 'warning', unknown: 'dark' };
      return m[(s || 'unknown').toLowerCase()] || 'secondary';
    },
    progress(count) {
      // แปลง count เป็นค่าร้อยละสำหรับ progress bar เทียบกับ maxCount
      return (Number(count || 0) / this.maxCount) * 100;
    }
  }
};
</script>

<style scoped>
.ta-card {
  border: 0;
  border-radius: 20px;
  overflow: hidden;
  transition: transform .15s ease, box-shadow .15s ease;
  background: #fff;
}
.ta-card:hover { transform: translateY(-2px); box-shadow: 0 0.75rem 1.5rem rgba(0,0,0,.08); }
.ta-card.ta-top { box-shadow: 0 0.85rem 1.6rem rgba(0,0,0,.12); }
.ta-hero {
  padding: 20px 16px 8px;
  background: linear-gradient(160deg, #e8f2ff, #fff);
}
.text-truncate { max-width: 180px; }
</style>
