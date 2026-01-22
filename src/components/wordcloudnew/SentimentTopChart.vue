<!-- SentimentTopChart.vue -->
<template>
  <div>
    <vue-element-loading :active="loading || downloading" size="80" background-color="rgba(255,255,255,0.5)"
      color="#b6ac9a" />
    <!-- {{ rows }} {{ items }} -->
    <b-list-group flush class="chart-box" ref="chartBox">
      <b-list-group-item v-for="(item, i) in rows" :key="item.uid || i" class="ta-row py-2" @click="onClick(item)"  :class="{ 'ta-row-active': isActive(item) }">
        <b-row align-v="center" v-b-tooltip.hover
          :title="item.name + ' ' + 'Positive: ' + formatCount(item.pos) + ' ' + 'Neutral: ' + formatCount(item.neu) + ' ' + 'Negative: ' + formatCount(item.neg)">
          <!-- ซ้าย -->
          <b-col cols="auto" md="5">
            <div class="text-left w-100 text-truncate">
              <span class="h5 bold py-0 my-0 rank-no mr-md-3" :class="(i % 2 === 0) ? 'rank-dark' : 'rank-light'">
                {{ i + 1 }}
              </span>  <span class="ta-name text-truncate">{{ item.name || item.uid }}</span>

              
            </div>
          </b-col>

          <!-- ขวา -->
          <b-col cols="" md="7">
            <div class="w-100">
             

              <div class="d-flex align-items-center w-100">
                <div class="stack-bg mr-2" :style="{ width: containerWidth(item) + '%' }" :aria-label="ariaLabel(item)"
                  role="img">
                  <!-- ✅ single segment (wordcloud/hashtag ไม่มี sentiment) -->
                  <div v-if="seg(item).isSingle" class="stack-bar stack-neu" :style="{ width: '100%' }"
                    v-b-tooltip.hover :title="'Total: ' + formatCount(item.count)">
                    <span v-if="100 >= labelMinWidthPct" class="stack-label">
                      {{ labelText(item.count, 100) }}
                    </span>
                  </div>

                  <!-- ✅ normal 3 segments (accounts มี sentiment) -->
                  <template v-else>
                    <div class="stack-bar stack-pos" :style="{ width: seg(item).posPct + '%' }">
                      <span v-if="seg(item).posPct >= labelMinWidthPct" class="stack-label">
                        {{ labelText(item.pos, seg(item).posPct) }}
                      </span>
                    </div>

                    <div class="stack-bar stack-neu" :style="{ width: seg(item).neuPct + '%' }">
                      <span v-if="seg(item).neuPct >= labelMinWidthPct" class="stack-label">
                        {{ labelText(item.neu, seg(item).neuPct) }}
                      </span>
                    </div>

                    <div class="stack-bar stack-neg" :style="{ width: seg(item).negPct + '%' }">
                      <span v-if="seg(item).negPct >= labelMinWidthPct" class="stack-label">
                        {{ labelText(item.neg, seg(item).negPct) }}
                      </span>
                    </div>
                  </template>
                </div>

                <b-badge pill variant="warning" class="flex-shrink-0" style="background-color: #e0efef !important;">
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
  name: 'SentimentTopChart',
  props: {
    items: { type: Array, default: () => [] },
    limit: { type: Number, default: 10 },
    order: { type: String, default: 'desc' }, // 'desc' | 'asc' | 'none'
    labelMode: { type: String, default: 'count' }, // 'count' | 'percent' | 'both'
    labelMinWidthPct: { type: Number, default: 8 },
    
    // ✅ เพิ่ม 2 props นี้สำหรับ highlight
    chartId: { type: String, default: "" },                 // 'word' | 'hash'
    activeKey: { type: [String, Number, null], default: null } // uid ที่ถูกเลือก
  },
  data() {
    return {
      loading: false,
      downloading: false,
      keyword: "",
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
      // ✅ รองรับทั้ง:
      // - accounts: { total/count, positiveSentiment, neutralSentiment, negativeSentiment }
      // - wordcloud: { name, total } (ไม่มี sentiment) -> pos/neu/neg = 0
      return (this.items || []).map(a => {
        const count = Number(
          a.count != null ? a.count : (a.total != null ? a.total : 0)
        );

        const pos = Number(a.pos != null ? a.pos : (a.positiveSentiment || 0));
        const neu = Number(a.neu != null ? a.neu : (a.neutralSentiment || 0));
        const neg = Number(a.neg != null ? a.neg : (a.negativeSentiment || 0));

        const name = a.name || a.uid || '';
        return {
          count,
          pos,
          neu,
          neg,
          uid: a.uid || name,
          name: name,
          link_crawl: a.link_crawl || '',
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
     // ✅ activeKey เทียบกับ uid
    isActive(item) {
      if (this.activeKey == null) return false;
      return String(item.uid) === String(this.activeKey);
    },
   // ✅ คลิกแล้วส่ง payload กลับ parent
    onClick(item) {
      const key = item.uid || item.name;
      this.$emit("row-click", { name: item.name, key, chartId: this.chartId });

      // ✅ เผื่อคุณยังมีโค้ดเก่าใช้งาน event นี้อยู่
      this.$emit("select-word2", item.name);
    },

    // onClick(item) {
    //   this.$emit('add-watch', item);
    // },
    isValidLink(url) {
      if (!url) return false;
      if (url === '#') return false;
      return /^https?:\/\//i.test(url) || url.startsWith('www.');
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
    containerWidth(it) {
      return this.maxCount > 0 ? (Number(it.count || 0) / this.maxCount) * 100 : 0;
    },

    // ✅ ปรับ: ถ้าไม่มี sentiment ให้เป็นแท่งเดียว (neutral 100%)
    seg(it) {
      const p = Number(it.pos || 0);
      const n = Number(it.neu || 0);
      const g = Number(it.neg || 0);
      const t = p + n + g;

      if (!t) {
        return {
          pos: 0,
          neu: Number(it.count || 0),
          neg: 0,
          posPct: 0,
          neuPct: 100,
          negPct: 0,
          isSingle: true
        };
      }
      return {
        pos: p, neu: n, neg: g,
        posPct: (p / t) * 100,
        neuPct: (n / t) * 100,
        negPct: (g / t) * 100,
        isSingle: false
      };
    },

    ariaLabel(it) {
      const s = this.seg(it);
      if (s.isSingle) return `Total ${this.formatCount(it.count)}`;
      return `Total ${this.formatCount(it.count)}, Positive ${this.formatCount(it.pos)}, Neutral ${this.formatCount(it.neu)}, Negative ${this.formatCount(it.neg)}`;
    },

    labelText(count, pct) {
      const pctStr = `${Math.round(pct)}%`;
      const cntStr = this.formatCount(count);
      if (this.labelMode === 'percent') return pctStr;
      if (this.labelMode === 'both') return `${cntStr} • ${pctStr}`;
      return cntStr;
    },

    // (ออปชัน) downloadImage คงไว้ได้เหมือนเดิม
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
      const name = 'progress';
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
.badge-warning {
  color: #212529;
  background-color: #fed16e;
}

.d-lg {
  display: inline;
}

.d-sm {
  display: none;
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
  border: 0;
  border-radius: 10px;
  overflow: hidden;
  transition: transform .15s ease, box-shadow .15s ease;
  background: #ffffff00;
  cursor: pointer;
}

.ta-row:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, .08);
    background: #e6fafacc;
}
.ta-card {
  border: 0;
  border-radius: 20px;
  overflow: hidden;
  transition: transform .15s ease, box-shadow .15s ease;
  background: #ffffff00;
}

.ta-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, .08);

}

/* ✅ ไฮไลท์ตอน active */
.ta-row-active {
  background: #dff7f7 !important;
  border: 1px solid rgba(25, 165, 187, 0.205);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, .12);
}
.ta-name {
  font-weight: 600;
  font-size: 16px;
}

.minw-0 {
  min-width: 0;
}

/* Stacked progress */
.stack-bg {
  position: relative;
  height: 25px;
  background: #e9ecef;
  border-radius: 999px;
  overflow: hidden;
  width: 100%;
}

.stack-bar {
  position: relative;
  height: 100%;
  display: inline-block;
}

.stack-pos {
  background: #339737;
}

.stack-neu {
  background: rgb(226, 171, 53);
}

.stack-neg {
  background: rgb(201, 49, 43);
}

.stack-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(0, 0, 0, .35);
  pointer-events: none;
}

.chart-box {
  background: #ffffff;
  padding: 4px;
  border-radius: 8px;
}

@media only screen and (max-width: 800px) {
   .rank-no {
        font-size: 15px !important;
    }
  .stack-bg {
  position: relative;
  height: 20px;
  background: #e9ecef;
  border-radius: 999px;
  overflow: hidden;
  width: 100%;
}
  .d-lg {
    display: none;
  }

  .d-sm {
    display: block;
  }
}
</style>
