<template>
  <b-card class="wordcloud-card" no-body>
    <!-- header -->
    <div class="p-3 d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center">
        <b-badge variant="light" class="mr-2">Wordcloud</b-badge>
        <small class="text-muted" v-if="subtitle">{{ subtitle }}</small>
      </div>

      <div class="d-flex align-items-center">
        <b-form-checkbox v-model="useSpiralArch" switch size="sm" class="mr-2">
          Archimedean
        </b-form-checkbox>

        <b-button size="sm" variant="outline-secondary" :disabled="isLoading" @click="loadWordCloud(true)">
          <span v-if="isLoading">กำลังโหลด...</span>
          <span v-else>รีเฟรช</span>
        </b-button>
      </div>
    </div>

    <!-- controls -->
    <div class="px-3 pb-2">
      <b-row>
        <b-col md="3">
          <b-form-group label="Domain ID" label-class="small text-muted mb-1">
            <b-form-input v-model="domainId" size="sm" />
          </b-form-group>
        </b-col>

        <b-col md="4">
          <b-form-group label="Start" label-class="small text-muted mb-1">
            <b-form-input v-model="start" size="sm" />
          </b-form-group>
        </b-col>

        <b-col md="4">
          <b-form-group label="End" label-class="small text-muted mb-1">
            <b-form-input v-model="end" size="sm" />
          </b-form-group>
        </b-col>

        <b-col md="1" class="d-flex align-items-end">
          <b-button size="sm" variant="primary" block :disabled="isLoading" @click="loadWordCloud(true)">
            โหลด
          </b-button>
        </b-col>
      </b-row>

      <b-alert v-if="error" show variant="danger" class="mt-2 mb-0">
        {{ error }}
      </b-alert>
    </div>

    <!-- ✅ 2 cloud ใน 1 component (ยิง API ครั้งเดียว) -->
    <div class="px-2 pb-3">
      <b-row>
        <!-- WORD CLOUD -->
        <b-col md="6" class="mb-3 mb-md-0">
          <div class="wc-panel">
            <div class="wc-panel-title">Words</div>

            <div class="wc-wrap position-relative">
              <div ref="chartWrapWords" class="wc-chart">
                <div ref="chartWords" class="wc-chart-inner"></div>
              </div>

              <div v-if="isLoading" class="wc-overlay">
                <b-spinner />
              </div>

              <div
                v-show="tooltip.show && tooltip.target === 'words'"
                class="wc-tooltip"
                :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
              >
                <div class="font-weight-bold">{{ tooltip.name }}</div>
                <div class="small text-muted">รวม: {{ fmt(tooltip.total) }}</div>
                <div class="small">
                  <span class="mr-2">บวก: {{ fmt(tooltip.pos) }}</span>
                  <span class="mr-2">กลาง: {{ fmt(tooltip.neu) }}</span>
                  <span>ลบ: {{ fmt(tooltip.neg) }}</span>
                </div>
                <div class="small text-muted">score: {{ tooltip.score.toFixed(3) }}</div>
              </div>
            </div>
          </div>
        </b-col>

        <!-- HASHTAG CLOUD -->
        <b-col md="6">
          <div class="wc-panel">
            <div class="wc-panel-title">Hashtags</div>

            <div class="wc-wrap position-relative">
              <div ref="chartWrapTags" class="wc-chart">
                <div ref="chartTags" class="wc-chart-inner"></div>
              </div>

              <div v-if="isLoading" class="wc-overlay">
                <b-spinner />
              </div>

              <div
                v-show="tooltip.show && tooltip.target === 'tags'"
                class="wc-tooltip"
                :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
              >
                <div class="font-weight-bold">{{ tooltip.name }}</div>
                <div class="small text-muted">รวม: {{ fmt(tooltip.total) }}</div>
                <div class="small">
                  <span class="mr-2">บวก: {{ fmt(tooltip.pos) }}</span>
                  <span class="mr-2">กลาง: {{ fmt(tooltip.neu) }}</span>
                  <span>ลบ: {{ fmt(tooltip.neg) }}</span>
                </div>
                <div class="small text-muted">score: {{ tooltip.score.toFixed(3) }}</div>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>
  </b-card>
</template>

<script>
import axios from "axios";
import * as d3 from "d3";
import cloud from "d3-cloud";

export default {
  name: "WordCloudFull",
  props: {
    token: { type: String, default: "" },

    defaultDomainId: { type: [String, Number], default: "1" },
    defaultStart: { type: String, default: "2026-01-12T00:00:00" },
    defaultEnd: { type: String, default: "2026-01-12T23:59:59" },

    // ✅ key ของผลลัพธ์ใน apiData
    hashtagsKey: { type: String, default: "hashtags" },
    itemsKey: { type: String, default: "items" },

    minHeight: { type: Number, default: 280 },
    limit: { type: Number, default: 100 },

    minFont: { type: Number, default: 25 },
    maxFont: { type: Number, default: 180 },

    disableRotate: { type: Boolean, default: true },
    fontFamily: { type: String, default: '"TH Sarabun New"' },

    colorPos: { type: String, default: "#0c2d0e" },
    colorNeu: { type: String, default: "#ffc107" },
    colorNeg: { type: String, default: "#380d0d" },

    domPow: { type: Number, default: 1.8},
    negBoost: { type: Number, default: 1.8 },
    neuDampen: { type: Number, default: 0.4 },
    dominanceKick: { type: Number, default: 0.22 },

    satMin: { type: Number, default: 0.92 },
    lightMin: { type: Number, default: 0.32 },
    lightMax: { type: Number, default: 0.32 },

    paddingBase: { type: Number, default: 1.4 },
    paddingFactor: { type: Number, default: 0.03 },
  },

  data() {
    return {
      domainId: String(this.defaultDomainId),
      start: this.defaultStart,
      end: this.defaultEnd,

      isLoading: false,
      error: "",
      apiData: null,

      _cancelSource: null,
      useSpiralArch: true,

      // ✅ แยก svg/layout 2 ชุด
      _layoutWords: null,
      _layoutTags: null,
      _svgWords: null,
      _svgTags: null,

      // ✅ กันยิงซ้ำเมื่อ param ไม่เปลี่ยน
      _lastFetchKey: "",

      // ✅ resize observer
      _roWords: null,
      _roTags: null,
      _fallbackResize: null,

      tooltip: {
        show: false,
        target: "", // "words" | "tags"
        x: 0,
        y: 0,
        name: "",
        total: 0,
        pos: 0,
        neu: 0,
        neg: 0,
        score: 0,
      },
    };
  },

  computed: {
    resolvedToken() {
      return this.token || localStorage.getItem("token") || "";
    },

    wordItems() {
      if (!this.apiData) return [];
      if (Array.isArray(this.apiData)) return this.apiData;
      return this.apiData?.wordCloud || this.apiData?.[this.itemsKey] || this.apiData?.items || [];
    },

    hashtagItems() {
      if (!this.apiData) return [];
      if (Array.isArray(this.apiData)) return [];
      return this.apiData?.[this.hashtagsKey] || this.apiData?.hashtags || [];
    },

    subtitle() {
      if (!this.apiData) return "";
      const domains = (this.apiData.domain_names || []).join(", ");
      return `${domains} • ${this.apiData.start} - ${this.apiData.end}`;
    },
  },

  watch: {
    apiData() {
      this.renderBoth();
    },
    useSpiralArch() {
      this.renderBoth();
    },
  },

  mounted() {
    this.loadWordCloud(false);

    this.$nextTick(() => {
      const w1 = this.$refs.chartWrapWords;
      const w2 = this.$refs.chartWrapTags;

      const debounced = (() => {
        let t = null;
        return () => {
          clearTimeout(t);
          t = setTimeout(() => this.renderBoth(), 120);
        };
      })();

      if (window.ResizeObserver) {
        this._roWords = new ResizeObserver(debounced);
        this._roTags = new ResizeObserver(debounced);
        if (w1) this._roWords.observe(w1);
        if (w2) this._roTags.observe(w2);
      } else {
        window.addEventListener("resize", debounced);
        this._fallbackResize = debounced;
      }
    });
  },

  beforeDestroy() {
    this.destroyAll();

    try {
      this._roWords && this._roWords.disconnect();
    } catch (e) {}
    try {
      this._roTags && this._roTags.disconnect();
    } catch (e) {}

    if (this._fallbackResize) {
      window.removeEventListener("resize", this._fallbackResize);
    }
  },

  methods: {
    fmt(n) {
      const x = Number(n || 0);
      return x.toLocaleString("th-TH");
    },
    clamp(x, a, b) {
      return Math.min(b, Math.max(a, x));
    },

    async waitForStableSize(wrapEl, tries = 12) {
      for (let i = 0; i < tries; i++) {
        if (wrapEl && wrapEl.clientWidth > 50 && wrapEl.clientHeight > 50) return true;
        await new Promise((r) => requestAnimationFrame(r));
      }
      return false;
    },

    fitToDataBounds(g, data, bw, bh, pad = 6) {
      if (!Array.isArray(data) || !data.length) return;

      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

      for (const d of data) {
        const w = Number(d.width || 0);
        const h = Number(d.height || 0);
        if (!w || !h) continue;

        const rot = ((d.rotate || 0) % 180 + 180) % 180;
        const ww = rot === 90 ? h : w;
        const hh = rot === 90 ? w : h;

        const left = d.x - ww / 2;
        const right = d.x + ww / 2;
        const top = d.y - hh / 2;
        const bottom = d.y + hh / 2;

        minX = Math.min(minX, left);
        maxX = Math.max(maxX, right);
        minY = Math.min(minY, top);
        maxY = Math.max(maxY, bottom);
      }

      if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) return;

      const contentW = Math.max(1, maxX - minX);
      const contentH = Math.max(1, maxY - minY);

      const sx = (bw - pad * 2) / contentW;
      const sy = (bh - pad * 2) / contentH;
      const s = Math.max(0.01, Math.min(sx, sy)); // ✅ พอดีกรอบ ไม่ล้น

      // แปลงจาก centered coords -> svg coords (มี +bw/2,+bh/2 ตอนวาด)
      const tx = pad - (bw / 2 + minX) * s;
      const ty = pad - (bh / 2 + minY) * s;

      g.attr("transform", `translate(${tx},${ty}) scale(${s})`);
    },

    async loadWordCloud(force = false) {
      this.error = "";

      if (!this.resolvedToken) {
        this.error = "ไม่พบ token (ส่ง prop token หรือ set localStorage key: token)";
        return;
      }

      const fetchKey = `${String(this.domainId)}|${String(this.start)}|${String(this.end)}`;

      if (!force && this.apiData && this._lastFetchKey === fetchKey) {
        this.renderBoth();
        return;
      }

      if (this._cancelSource) this._cancelSource.cancel("Cancelled due to new request");
      this._cancelSource = axios.CancelToken.source();

      this.isLoading = true;
      try {
        const res = await axios.request({
          method: "GET",
          url: "https://api2.cognizata.com/api/v2/wordcloud/getWordCloud",
          params: { domain_id: this.domainId, start: this.start, end: this.end },
          headers: { Authorization: `Bearer ${this.resolvedToken}` },
          cancelToken: this._cancelSource.token,
        });

        this.apiData = res.data;
        this._lastFetchKey = fetchKey;

        this.$emit("loaded", this.apiData);

        // ✅ render 2 อันจาก data ชุดเดียว
        this.renderBoth();
      } catch (err) {
        if (axios.isCancel(err)) return;
        this.error =
          (err.response && err.response.data && err.response.data.message) ||
          err.message ||
          "โหลดข้อมูลไม่สำเร็จ";
      } finally {
        this.isLoading = false;
      }
    },

    // -------- Sentiment helpers --------
    getCounts(it) {
      const src =
        it?.count
          ? it
          : it?.__src?.count
          ? it.__src
          : it?.__src?.__src?.count
          ? it.__src.__src
          : it || {};

      const c = Array.isArray(src.count) ? src.count : [];

      const pos = (c.find((x) => x.sentiment === 1) || {}).count || 0;
      const neu = (c.find((x) => x.sentiment === 0) || {}).count || 0;
      const neg = (c.find((x) => x.sentiment === -1) || {}).count || 0;

      const total = Number(src.total ?? it?.total ?? it?.value ?? (pos + neu + neg) ?? 0) || 0;
      return { pos, neu, neg, total: total || 1 };
    },

    sentimentScore(it) {
      const { pos, neg, total } = this.getCounts(it);
      return (pos - neg) / (total || 1);
    },

    colorBySentiment(it) {
      const { pos, neu, neg } = this.getCounts(it);
      const sum = (pos + neu + neg) || 1;

      let wp = pos / sum;
      let wn = neu / sum;
      let wg = neg / sum;

      wp = Math.pow(wp, this.domPow);
      wn = Math.pow(wn * this.neuDampen, this.domPow);
      wg = Math.pow(wg * this.negBoost, this.domPow);

      const s2 = wp + wn + wg || 1;
      wp /= s2;
      wn /= s2;
      wg /= s2;

      const P = d3.rgb(this.colorPos);
      const N = d3.rgb(this.colorNeu);
      const G = d3.rgb(this.colorNeg);

      let r = wp * P.r + wn * N.r + wg * G.r;
      let g = wp * P.g + wn * N.g + wg * G.g;
      let b = wp * P.b + wn * N.b + wg * G.b;

      const maxW = Math.max(wp, wn, wg);
      if (this.dominanceKick > 0 && maxW > 0.5) {
        const k = this.clamp((maxW - 0.5) * 2 * this.dominanceKick, 0, this.dominanceKick);
        const dom = maxW === wp ? P : maxW === wn ? N : G;
        r = r * (1 - k) + dom.r * k;
        g = g * (1 - k) + dom.g * k;
        b = b * (1 - k) + dom.b * k;
      }

      let col = d3.hsl(d3.rgb(r, g, b));
      col.s = Math.max(col.s, this.satMin);
      col.l = this.clamp(col.l, this.lightMin, this.lightMax);
      return col.formatHex();
    },

    // -------- build words from list --------
    buildWordsFromList(list0) {
      const raw = Array.isArray(list0) ? list0 : [];

      const list = raw
        .filter(Boolean)
        .map((x) => {
          const src = x.__src ?? x;
          const name = x.name ?? x.text ?? x.key ?? src.name ?? src.text ?? src.key ?? "";
          const total = Number(x.total ?? x.value ?? src.total ?? 0);

          return {
            key: String(name).trim(),
            text: String(name).trim(),
            value: total,
            __src: src,
          };
        })
        .filter((d) => d.key.length > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, Math.max(0, this.limit));

      if (!list.length) return [];

      const values = list.map((d) => Math.max(1, d.value));
      const vMin = Math.min(...values);
      const vMax = Math.max(...values);
      const domainMax = vMax === vMin ? vMax + 1 : vMax;

      const scale = d3.scaleLog().domain([vMin, domainMax]).range([this.minFont, this.maxFont]);

      return list.map((d, i) => ({
        ...d,
        __id: `${d.key}__${i}`,
        size: Math.round(scale(Math.max(1, d.value))),
      }));
    },

    destroyAll() {
      this.tooltip.show = false;

      if (this._layoutWords) {
        try {
          this._layoutWords.stop();
        } catch (e) {}
      }
      if (this._layoutTags) {
        try {
          this._layoutTags.stop();
        } catch (e) {}
      }
      this._layoutWords = null;
      this._layoutTags = null;

      if (this._svgWords) this._svgWords.remove();
      if (this._svgTags) this._svgTags.remove();
      this._svgWords = null;
      this._svgTags = null;

      const ew = this.$refs.chartWords;
      const et = this.$refs.chartTags;
      if (ew) ew.innerHTML = "";
      if (et) et.innerHTML = "";
    },

    renderBoth() {
      // ป้องกัน render ตอนยังไม่มีข้อมูล
      if (!this.apiData) return;

      this.renderOne({
        kind: "words",
        wrapRef: "chartWrapWords",
        chartRef: "chartWords",
        getItems: () => this.wordItems,
      });

      this.renderOne({
        kind: "tags",
        wrapRef: "chartWrapTags",
        chartRef: "chartTags",
        getItems: () => this.hashtagItems,
      });
    },

    async renderOne({ kind, wrapRef, chartRef, getItems }) {
      // destroy เฉพาะตัวนั้น
      if (kind === "words") {
        if (this._layoutWords) {
          try {
            this._layoutWords.stop();
          } catch (e) {}
        }
        this._layoutWords = null;
        if (this._svgWords) this._svgWords.remove();
        this._svgWords = null;
      } else {
        if (this._layoutTags) {
          try {
            this._layoutTags.stop();
          } catch (e) {}
        }
        this._layoutTags = null;
        if (this._svgTags) this._svgTags.remove();
        this._svgTags = null;
      }

      const el = this.$refs[chartRef];
      const wrap = this.$refs[wrapRef];
      if (!el || !wrap) return;

      // ✅ รอ column width/height ให้เสถียรก่อน (กันครั้งแรกแหว่ง/ไม่ครบ)
      await this.waitForStableSize(wrap, 14);

      // ✅ รอฟอนต์พร้อม (ลดเพี้ยนรอบแรก)
      if (document?.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch (e) {}
      }

      const list0 = getItems?.() || [];
      const raw = this.buildWordsFromList(list0);
      if (!raw.length) {
        el.innerHTML = `<div class="wc-empty">ไม่พบข้อมูล</div>`;
        return;
      }

      const words0 = raw
        .slice()
        .sort((a, b) => (b.size || 0) - (a.size || 0))
        .map((w, i) => ({
          ...w,
          __id: w.__id || `${w.key || w.text || "w"}__${i}`,
          size: Math.max(6, Number(w.size || 0) || 6),
        }));

      const bw = Math.max(320, wrap.clientWidth || 0);
      const bh = Math.max(this.minHeight || 280, wrap.clientHeight || 0);

      const svg = d3
        .select(el)
        .html("") // ✅ เคลียร์ก่อนเสมอ
        .append("svg")
        .attr("viewBox", `0 0 ${bw} ${bh}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("width", "100%")
        .attr("height", "100%");

      if (kind === "words") this._svgWords = svg;
      else this._svgTags = svg;

      const g = svg.append("g");
      const self = this;

      function mulberry32(seed) {
        return function () {
          let t = (seed += 0x6D2B79F5);
          t = Math.imul(t ^ (t >>> 15), t | 1);
          t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
      }

      const MAX_TRIES = 8;
      let attempt = 0;

      const ROTATE_BIG_CUTOFF = 60;
      const ROTATE_EVERY = 3;

      const run = (words, padMul, fontMul) => {
        attempt += 1;
        g.selectAll("*").remove();
        g.attr("transform", null);

        const seedBase =
          (Number(String(self.domainId).replace(/\D/g, "")) || 1) * 999 +
          (Number(String(self.start).replace(/\D/g, "").slice(-6)) || 1) +
          attempt * 97 +
          (kind === "tags" ? 777 : 0);

        const rng = mulberry32(seedBase);

        const layout = cloud()
          .size([bw, bh])
          .random(rng)
          .words(
            words.map((w) => ({
              ...w,
              size: Math.max(6, Math.round(w.size * fontMul)),
            }))
          )
          .padding((d) => {
            const base = Math.max(
              0.12,
              Math.max(self.paddingBase ?? 0.25, d.size * (self.paddingFactor ?? 0.01))
            );
            return Math.max(0.12, base * padMul);
          })
          .spiral(self.useSpiralArch ? "archimedean" : "rectangular")
          .rotate((d, i) => {
            if (self.disableRotate) return 0;
            if (d.size >= ROTATE_BIG_CUTOFF) return 0;
            return i % ROTATE_EVERY === 0 ? 90 : 0;
          })
          .font(self.fontFamily)
          .fontSize((d) => d.size)
          .on("end", (data) => {
            // ✅ retry เมื่อวางไม่ครบ (ลด padding + ลด font)
            if (data.length < words.length && attempt < MAX_TRIES) {
              const nextPad = padMul * 0.82;
              const nextFont = fontMul * (attempt <= 2 ? 0.90 : 0.94);
              return run(words, nextPad, nextFont);
            }

            const texts = g
              .selectAll("text")
              .data(data, (d) => d.__id)
              .enter()
              .append("text")
              .style("font-weight", 500)
              .style("font-family", self.fontFamily)
              .style("font-size", (d) => d.size + "px")
              .style("fill", (d) => self.colorBySentiment(d.__src))
              .style("cursor", "pointer")
              .attr("text-anchor", "middle")
              .attr("transform", (d) => {
                const x = d.x + bw / 2;
                const y = d.y + bh / 2;
                return `translate(${x},${y})rotate(${d.rotate || 0})`;
              })
              .text((d) => d.text);

            // ✅ fit-to-box แบบนิ่ง: อิง bounds ของ data (ไม่ใช้ getBBox)
            self.fitToDataBounds(g, data, bw, bh, 6);

            texts
              .on("mousemove", function (event, d) {
                const { pos, neu, neg, total } = self.getCounts(d.__src);
                const score = self.sentimentScore(d.__src);

                const rect = wrap.getBoundingClientRect();
                self.tooltip.show = true;
                self.tooltip.target = kind;
                self.tooltip.x = event.clientX - rect.left + 12;
                self.tooltip.y = event.clientY - rect.top + 12;
                self.tooltip.name = d.text;
                self.tooltip.total = total;
                self.tooltip.pos = pos;
                self.tooltip.neu = neu;
                self.tooltip.neg = neg;
                self.tooltip.score = score;
              })
              .on("mouseleave", () => (self.tooltip.show = false))
              .on("click", (event, d) => self.$emit("select", { kind, data: d.__src }));
          });

        if (kind === "words") self._layoutWords = layout;
        else self._layoutTags = layout;

        layout.start();
      };

      run(words0, 1.0, 1.0);
    },
  },
};
</script>

<style scoped>
.wordcloud-card {
  border-radius: 14px;
  overflow: hidden;
}

.wc-panel {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

.wc-panel-title {
  font-weight: 600;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: #fafafa;
}

.wc-wrap {
  background: #fff;
  min-height: 320px;
}

.wc-chart {
  height: 480px;
  overflow: hidden;
  padding: 0;
  position: relative;
}
.wc-chart-inner {
  width: 100%;
  height: 100%;
}
.wc-chart text {
  font-family: "TH Sarabun New", "Prompt", sans-serif !important;
}

.wc-empty {
  height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

.wc-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.65);
}

.wc-tooltip {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  background: rgba(20, 20, 20, 0.92);
  color: #fff;
  border-radius: 10px;
  padding: 10px 12px;
  max-width: 260px;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.18);
}

@media (max-width: 768px) {
  .wc-chart {
    height: 340px;
    min-height: 260px;
  }
  .wc-wrap {
    min-height: 260px;
  }
}
</style>
