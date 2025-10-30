<!-- TopAccountsProgress.vue -->
<template>
  <div>
    <vue-element-loading
      :active="loading || downloading"
      size="80"
      background-color="rgba(255,255,255,0.5)"
      color="#b6ac9a"
    />

    <!-- Toolbar -->
    <!-- <div class="d-flex justify-content-end mb-2">
      <b-button
        variant="outline-secondary"
        size="sm"
        @click="downloadImage"
        :disabled="downloading"
      >
        <span v-if="!downloading">📷 ดาวน์โหลดรูป</span>
        <span v-else>กำลังสร้างรูป...</span>
      </b-button>
    </div> -->

    <b-list-group flush class="chart-box" ref="chartBox">
      <b-list-group-item
        v-for="(item, i) in rows"
        :key="item.uid"
        class="ta-row"
        @click="onClick(item)"
      >
        <!-- left: avatar + name -->
        <b-row align-v="center">
          <b-col cols="4">
            <div class="d-flex align-items-center w-100" >
              <span
                class="h5 bold py-0 my-0 rank-no mr-md-3"
                :class="(i % 2 === 0) ? 'rank-dark' : 'rank-light'"
              >
                {{ i + 1 }}
              </span>

              <b-avatar
                :src="item.profile_image || null"
                :text="!item.profile_image ? initials(item.name || item.uid) : null"
                size="40"
                variant="light"
                class="mr-2 flex-shrink-0"
              />

              <img v-if="item.source === 'twitter'"   :src="imgtw" class="social-img" />
              <img v-if="item.source === 'facebook'"  :src="imgfb" class="social-img" />
              <img v-if="item.source === 'pantip'"    :src="imgpt" class="social-img" />
              <img v-if="item.source === 'youtube'"   :src="imgyt" class="social-img" />
              <img v-if="item.source === 'news'"      :src="imgnw" class="social-img" />
              <img v-if="item.source === 'instagram'" :src="imgig" class="social-img" />
              <img v-if="item.source === 'blockdit'"  :src="imgbd" class="social-img" />
              <img v-if="item.source === 'tiktok'"    :src="imgtt" class="social-img" />
              <img v-if="item.source === 'threads'"   :src="imgtd" class="social-img" />

              <div class="minw-0 d-lg">
                <a :href="item.link_crawl" target="_blank">
                  <div class="ta-name text-truncate">{{ item.name || item.uid }}</div>
                </a>
              </div>
            </div>
          </b-col>

          <b-col cols="8">
            <div class="w-100">
              <div class="text-left d-sm">
                <a :href="item.link_crawl" target="_blank">
                  <div class="ta-name text-truncate">{{ item.name || item.uid }}</div>
                </a>
              </div>

              <div class="d-flex align-items-center w-100">
                <b-progress :max="maxCount" height="15px" class="w-100 mr-2 ta-progress">
                  <b-progress-bar :value="item.count" variant="info" />
                </b-progress>
                <b-badge pill variant="warning" class="flex-shrink-0">
                  {{ formatCount(item.count) }}
                </b-badge>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>

    <div v-if="rows.length === 0" class="text-center text-muted py-4">
      ไม่พบรายการที่ตรงกับเงื่อนไข
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopAccountsProgress',
  props: {
    /** items: [{ uid, name, count, source, profile_image, link_crawl }] */
    items: { type: Array, default: () => [] },
    limit: { type: Number, default: 10 },
    order: { type: String, default: 'desc' } // 'desc' มาก→น้อย, 'asc' น้อย→มาก, 'none' ตามลำดับที่ส่งมา
  },
  data() {
    return {
      loading: false,        // ใช้กับ overlay ที่มีอยู่เดิม
      downloading: false,    // สถานะกำลังสร้างรูป

      imgtw: require('@/assets/Twitter.png'),
      imgfb: require('@/assets/Facebook.png'),
      imgpt: require('@/assets/board.png'),
      imgig: require('@/assets/Instagram.png'),
      imgnw: require('@/assets/News.png'),
      imgyt: require('@/assets/Youtube.png'),
      imgbd: require('@/assets/Blockdit.png'),
      imgtt: require('@/assets/Tiktok.png'),
      imgtd: require('@/assets/Threads.png')
    };
  },
  computed: {
    normalized() {
      return (this.items || []).map(a => ({
        count: Number(a.count || 0),
        uid: a.uid || '',
        name: a.name || a.uid || '',
        link_crawl: a.link_crawl || '#',
        source: (a.source || 'unknown').toLowerCase(),
        profile_image: a.profile_image || null
      }));
    },
    sorted() {
      const arr = [...this.normalized];
      if (this.order === 'asc') arr.sort((a, b) => a.count - b.count);
      else if (this.order === 'desc') arr.sort((a, b) => b.count - a.count);
      return arr;
    },
    rows() {
      return this.limit > 0 ? this.sorted.slice(0, this.limit) : this.sorted;
    },
    maxCount() {
      return Math.max(1, ...this.rows.map(r => r.count || 0));
    }
  },
  methods: {
    onClick(item) {
      this.$emit('add-watch', item);
    },
    initials(name) {
      const parts = String(name || '')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .filter(Boolean);
      const first = (parts[0] || '').charAt(0);
      const last = parts.length > 1 ? (parts[parts.length - 1] || '').charAt(0) : '';
      return (first + last || first || '?').toUpperCase();
    },
    formatCount(v) {
      return Number(v || 0).toLocaleString();
    },
    sourceVariant(s) {
      const m = {
        twitter: 'info',
        youtube: 'danger',
        facebook: 'primary',
        news: 'secondary',
        instagram: 'warning',
        unknown: 'dark'
      };
      return m[(s || 'unknown').toLowerCase()] || 'secondary';
    },

    // === NEW: ดาวน์โหลดรูปของ chart-box ===
    async downloadImage() {
      if (this.downloading) return;
      try {
        this.downloading = true;
        // โหลดไลบรารีแบบ dynamic เพื่อลด bundle เริ่มต้น
        const htmlToImage = await import('html-to-image');

        const target = this.$refs.chartBox;
        if (!target) throw new Error('ไม่พบ chart-box');

        // scale 2 เพื่อความคมชัด
        const dataUrl = await htmlToImage.toPng(target, {
          backgroundColor: '#ffffff',
          pixelRatio: 2,
          skipFonts: true
        });

        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = this.buildFilename();
        a.click();
      } catch (err) {
        // แสดง error แบบง่าย ๆ
        // คุณอาจเปลี่ยนไปใช้ toast ของ BootstrapVue ก็ได้
        console.error(err);
        alert('ไม่สามารถสร้างรูปได้ กรุณาลองอีกครั้ง');
      } finally {
        this.downloading = false;
      }
    },
    buildFilename() {
      const now = new Date();
      const pad = n => String(n).padStart(2, '0');
      const name = 'top-accounts';
      const stamp =
        now.getFullYear() +
        pad(now.getMonth() + 1) +
        pad(now.getDate()) +
        '_' +
        pad(now.getHours()) +
        pad(now.getMinutes());
      return `${name}_${stamp}.png`;
    }
  }
};
</script>

<style scoped>
.d-lg {
  display: inline;
}
.d-sm {
  display: none;
}
.progress-bar {
  background: linear-gradient(70deg, #7ac9d6 40%, #9378bf 100%) !important;
}
.list-group-item {
  position: relative;
  display: block;
  padding: 5px 12px;
  background-color: #fff;
}
.social-img {
  width: 25px !important;
  margin-top: 20px !important;
  margin-left: -20px !important;
  height: 25px !important;
  z-index: 99;
}
.rank-no {
  width: 40px;
}
.rank-light {
  color: #56d1e4;
}
.rank-dark {
  color: #19a5bb;
}
a {
  color: dimgrey;
  text-decoration: none;
  background-color: transparent;
}
.ta-row {
  cursor: pointer;
  transition: background 0.12s ease;
}
.ta-row:hover {
  background: #f9fafb;
}
.ta-name {
  font-weight: 600;
  font-size: 14px;
}
.minw-0 {
  min-width: 0;
}
.ta-progress ::v-deep .progress-bar {
  transition: width 0.35s ease;
}
.ta-actions {
  visibility: hidden;
}
.ta-row:hover .ta-actions {
  visibility: visible;
}

/* ให้ภาพออกพื้นขาวสวยเวลาจับภาพ */
.chart-box {
  background: #ffffff;
  padding: 4px;
  border-radius: 8px;
}

@media only screen and (min-width: 0px) and (max-width: 800px) {
  .d-lg {
    display: none;
  }
  .d-sm {
    display: block;
  }
}
@media (max-width: 576px) {
  .ta-actions {
    visibility: visible;
  }
}
</style>
