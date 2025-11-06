<!-- TopAccountsProgress.vue -->
<template>
  <div>
    <vue-element-loading
      :active="loading || downloading"
      size="80"
      background-color="rgba(255,255,255,0.5)"
      color="#b6ac9a"
    />

    <b-list-group flush class="chart-box" ref="chartBox">
      <b-list-group-item
        v-for="(item, i) in rows"
        :key="item.uid || i"
        class="ta-row"
        @click="onClick(item)"
      >
        <b-row align-v="center">
          <!-- ซ้าย: อวตาร + ชื่อ -->
          <b-col cols="4">
            <div class="d-flex align-items-center w-100">
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

          <!-- ขวา: แท่ง stacked + ตัวเลขรวม -->
          <b-col cols="8 px-0">
            <div class="w-100">
              <div class="text-left d-sm">
                <a :href="item.link_crawl" target="_blank">
                  <div class="ta-name text-truncate">{{ item.name || item.uid }}</div>
                </a>
              </div>

              <div class="d-flex align-items-center w-100">
                <!-- แท่งรวม (สเกลตาม maxCount) + แบ่งสัดส่วนตาม sentiment -->
                <div
                  class="stack-bg mr-2"
                  :style="{ width: containerWidth(item) + '%' }"
                  :aria-label="ariaLabel(item)"
                  role="img"
                >
                  <!-- Positive -->
                  <div
                    class="stack-bar stack-pos"
                    :style="{ width: seg(item).posPct + '%' }"
                    v-b-tooltip.hover
                    :title="'Positive: ' + formatCount(item.pos)"
                  >
                    <span
                      v-if="seg(item).posPct >= labelMinWidthPct"
                      class="stack-label"
                    >
                      {{ labelText(item.pos, seg(item).posPct) }}
                    </span>
                  </div>

                  <!-- Neutral -->
                  <div
                    class="stack-bar stack-neu"
                    :style="{ width: seg(item).neuPct + '%' }"
                    v-b-tooltip.hover
                    :title="'Neutral: ' + formatCount(item.neu)"
                  >
                    <span
                      v-if="seg(item).neuPct >= labelMinWidthPct"
                      class="stack-label"
                    >
                      {{ labelText(item.neu, seg(item).neuPct) }}
                    </span>
                  </div>

                  <!-- Negative -->
                  <div
                    class="stack-bar stack-neg"
                    :style="{ width: seg(item).negPct + '%' }"
                    v-b-tooltip.hover
                    :title="'Negative: ' + formatCount(item.neg)"
                  >
                    <span
                      v-if="seg(item).negPct >= labelMinWidthPct"
                      class="stack-label"
                    >
                      {{ labelText(item.neg, seg(item).negPct) }}
                    </span>
                  </div>
                </div>

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
    /**
     * items: [
     *  {
     *    uid, name, count|total, source, profile_image, link_crawl,
     *    positiveSentiment, neutralSentiment, negativeSentiment
     *  }
     * ]
     */
    items: { type: Array, default: () => [] },
    limit: { type: Number, default: 10 },
    order: { type: String, default: 'desc' }, // 'desc' มาก→น้อย, 'asc' น้อย→มาก, 'none' ตามลำดับที่ส่งมา
    labelMode: { type: String, default: 'count' }, // 'count' | 'percent' | 'both'
    labelMinWidthPct: { type: Number, default: 8 } // แสดง label เมื่อกว้าง >= ค่านี้
  },
  data() {
    return {
      loading: false,
      downloading: false,

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
      // รวม fields ที่จำเป็น + รองรับชื่อ count/total และ sentiments
      return (this.items || []).map(a => {
        const count = Number(a.count != null ? a.count : (a.total || 0));
        const pos = Number(a.positiveSentiment || 0);
        const neu = Number(a.neutralSentiment || 0);
        const neg = Number(a.negativeSentiment || 0);

        return {
          count,
          pos,
          neu,
          neg,
          uid: a.uid || '',
          name: a.name || a.uid || '',
          link_crawl: a.link_crawl || '#',
          source: (a.source || 'unknown').toLowerCase(),
          profile_image: a.profile_image || null
        };
      });
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
    // ความยาวแท่งหลัก (container) เทียบกับอันดับ
    containerWidth(it) {
      // ให้แท่งสัดส่วนตาม count / maxCount (0-100)
      return this.maxCount > 0 ? (Number(it.count || 0) / this.maxCount) * 100 : 0;
      // ถ้าอยากให้เต็ม 100% เสมอ: return 100;
    },
    // แบ่งสัดส่วนสีภายในแท่งตาม sentiment + คืนค่า count ด้วย
    seg(it) {
      const p = Number(it.pos || 0);
      const n = Number(it.neu || 0);
      const g = Number(it.neg || 0);
      const t = p + n + g || 1;
      return {
        pos: p, neu: n, neg: g,
        posPct: (p / t) * 100,
        neuPct: (n / t) * 100,
        negPct: (g / t) * 100
      };
    },
    ariaLabel(it) {
      return `Total ${this.formatCount(it.count)}, Positive ${this.formatCount(it.pos)}, Neutral ${this.formatCount(it.neu)}, Negative ${this.formatCount(it.neg)}`;
    },
    // รูปแบบข้อความบนแท่ง
    labelText(count, pct) {
      const pctStr = `${Math.round(pct)}%`;
      const cntStr = this.formatCount(count);
      if (this.labelMode === 'percent') return pctStr;
      if (this.labelMode === 'both') return `${cntStr} • ${pctStr}`;
      return cntStr; // 'count' (default)
    },

    // === (ออปชัน) ดาวน์โหลดรูปของ chart-box ===
    async downloadImage() {
      if (this.downloading) return;
      try {
        this.downloading = true;
        const htmlToImage = await import('html-to-image');
        const target = this.$refs.chartBox;
        if (!target) throw new Error('ไม่พบ chart-box');

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
.badge-warning{
    color: #212529;
    background-color: #fed16e;
}
.d-lg { display: inline; }
.d-sm { display: none; }

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
.rank-no { width: 40px; }
.rank-light { color: #56d1e4; }
.rank-dark  { color: #19a5bb; }
a {
  color: dimgrey;
  text-decoration: none;
  background-color: transparent;
}
.ta-row {
  cursor: pointer;
  transition: background 0.12s ease;
}
.ta-row:hover { background: #f9fafb; }
.ta-name { font-weight: 600; font-size: 14px; }
.minw-0 { min-width: 0; }

/* Stacked progress */
.stack-bg {
  position: relative;
  height: 20px;
  background: #e9ecef;
  border-radius: 999px;
  overflow: hidden;
  width: 100%;
}
.stack-bar {
  position: relative;         /* ให้ label วางกลาง segment ได้ */
  height: 100%;
  display: inline-block;
}
.stack-pos { background: #53b993; } /* Positive */
.stack-neu { background: #368ab6; } /* Neutral  */
.stack-neg { background: #f06964; } /* Negative */

/* Label บนแท่ง */
.stack-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(0,0,0,.35);
  pointer-events: none;       /* อย่าให้บัง tooltip */
}

.ta-actions { visibility: hidden; }
.ta-row:hover .ta-actions { visibility: visible; }

/* ให้ภาพออกพื้นขาวสวยเวลาจับภาพ */
.chart-box {
  background: #ffffff;
  padding: 4px;
  border-radius: 8px;
}

@media only screen and (min-width: 0px) and (max-width: 800px) {
  .d-lg { display: none; }
  .d-sm { display: block; }
}
@media (max-width: 576px) {
  .ta-actions { visibility: visible; }
}
</style>
