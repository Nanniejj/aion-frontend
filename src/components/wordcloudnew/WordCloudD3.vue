<template>
  <b-card class="wordcloud-card" no-body>


    <!-- <b-alert v-if="error" show variant="danger" class="mx-3 mb-2">
      {{ error }}
    </b-alert> -->

    <!-- ✅ 2 cloud ใน 1 component (component ยิง API เอง ไม่มี filter ในตัว) -->
    <div class="px-2 pb-3">
      <b-row>
        <!-- WORD CLOUD -->
        <b-col md="6" >
          <div class="wc-panel h-100 w-100">
            <div class="wc-panel-title">Words</div>

            <div class="wc-wrap position-relative">
              <div ref="chartWrapWords" class="wc-chart">
                <div ref="chartWords" class="wc-chart-inner"></div>
              </div>

              <div v-if="isLoading" class="wc-overlay">
                <b-spinner />
              </div>

              <div v-show="tooltip.show && tooltip.target === 'words'" class="wc-tooltip"
                :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }">
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
          <div class="wc-panel h-100 w-100" >
            <div class="wc-panel-title">Hashtags</div>

            <div class="wc-wrap position-relative">
              <div ref="chartWrapTags" class="wc-chart">
                <div ref="chartTags" class="wc-chart-inner"></div>
              </div>

              <div v-if="isLoading" class="wc-overlay">
                <b-spinner />
              </div>

              <div v-show="tooltip.show && tooltip.target === 'tags'" class="wc-tooltip"
                :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }">
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

    // ✅ component ยิง API เอง ไม่มี filter UI ให้แก้ — กำหนดผ่าน prop ตอนเรียกใช้แทน
    domainId: { type: [String, Number], default: "1" },
    start: { type: String, default: "" },
    end: { type: String, default: "" },
    monitor: { type: [String, Boolean], default: "" },

    // ✅ key ของผลลัพธ์ใน apiData
    hashtagsKey: { type: String, default: "hashtags" },
    itemsKey: { type: String, default: "items" },

    minHeight: { type: Number, default: 300 },
    limit: { type: Number, default: 100 },

    // ✅ ขนาด canvas คงที่สำหรับทำ layout/วาดคำ (ไม่อิงขนาดกล่องจริงบนจอ)
    // ใช้ค่าตายตัวเพื่อให้ผลลัพธ์ระยะขอบ/การกระจายตัวสม่ำเสมอทุกครั้ง ส่วนการแสดงผลจริงยัง responsive ตาม container เพราะ svg ใช้ viewBox
    fixedWidth: { type: Number, default: 720 },
    fixedHeight: { type: Number, default: 480 },

    minFont: { type: Number, default: 20 },
    maxFont: { type: Number, default: 90 },

    disableRotate: { type: Boolean, default: true },

    // ✅ ฟอนต์เดียวกันทั้ง 2 wordcloud (บน/ล่าง) — ใช้ฟอนต์เดียวกับฝั่งเก่า
    fontFamily: {
      type: String,
      default: " 'Sarabun', sans-serif",
    },

    useSpiralArch: { type: Boolean, default: true },

    // ✅ กระจายคำให้เต็มกรอบ + ขอบเท่ากัน
    // layout จะถูกคำนวณบนพื้นที่ที่ "ใหญ่กว่า" กรอบที่เห็นจริง (oversize) แล้วค่อยย่อ/จัดกลางให้พอดีกรอบทีหลัง (fitToDataBounds)
    // ถ้ายังกระจายไม่พอ ลองเพิ่มค่านี้ (เช่น 1.8–2.2) หรือถ้าคำห่างกันเกินไป ลองลดค่าลง
    layoutOversize: { type: Number, default: 1.3 },

    // ✅ สีและพารามิเตอร์ blend ปรับให้ตรงกับ backend (lib/sentimentColor.js DEFAULTS)
    // เดิมค่าพวกนี้เพี้ยนไปจาก backend มาก (domPow 8 vs 1.8, lightMin 0.8 vs 0.32 ฯลฯ)
    // ทำให้สีที่ได้คนละโทนกับภาพที่ backend สร้าง
    colorPos: { type: String, default: "#0c2d0e" },
    colorNeu: { type: String, default: "#ffc107" },
    colorNeg: { type: String, default: "#380d0d" },

    domPow: { type: Number, default: 3 },        // จาก 1.8 — เพิ่มความ "เด็ดขาด" ของสัดส่วนสี
    negBoost: { type: Number, default: 3 },
    neuDampen: { type: Number, default: 0.5 },
    dominanceKick: { type: Number, default: 0.55 }, // จาก 0.22 — ดันไปทางสีที่ครองเสียงข้างมากแรงขึ้น

    satMin: { type: Number, default: 0.85 },
    lightMin: { type: Number, default: 0.38 },    // จาก 0.32
    lightMax: { type: Number, default: 0.58 },    // จาก 0.32 — เปิดช่วงให้กว้างขึ้น ไม่บังคับเท่ากันหมด
    paddingBase: { type: Number, default: 1.8 },
    paddingFactor: { type: Number, default: 0.045 },
  },

  data() {
    return {
      isLoading: false,
      error: "",
      apiData: null,

      _cancelSource: null,
      _lastFetchKey: "",

      // ✅ แยก svg/layout 2 ชุด
      _layoutWords: null,
      _layoutTags: null,
      _svgWords: null,
      _svgTags: null,

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

    resolvedStart() {
      if (this.start) return this.start;
      return new Date().toISOString().slice(0, 10) + "T00:00:00";
    },

    resolvedEnd() {
      if (this.end) return this.end;
      return new Date().toISOString().slice(0, 10) + "T23:59:59";
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
      if (!this.apiData || Array.isArray(this.apiData)) return "";
      const domains = (this.apiData.domain_names || []).join(", ");
      const range = this.apiData.start && this.apiData.end ? ` • ${this.apiData.start} - ${this.apiData.end}` : "";
      return domains ? `${domains}${range}` : "";
    },
  },

  watch: {
    apiData() {
      this.renderBoth();
    },
    useSpiralArch() {
      this.renderBoth();
    },
    layoutOversize() {
      this.renderBoth();
    },
    fixedWidth() {
      this.renderBoth();
    },
    fixedHeight() {
      this.renderBoth();
    },
    domainId() {
      this.loadWordCloud(true);
    },
    start() {
      this.loadWordCloud(true);
    },
    end() {
      this.loadWordCloud(true);
    },
    monitor() {
      this.loadWordCloud(true);
    },
  },

  mounted() {
    this.loadWordCloud();

    this.$nextTick(() => {
      const w1 = this.$refs.chartWrapWords;
      const w2 = this.$refs.chartWrapTags;

      const debounced = (() => {
        let t = null;
        return () => {
          clearTimeout(t);
          t = setTimeout(() => this.renderBoth(), 100);
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

    if (this._cancelSource) {
      try {
        this._cancelSource.cancel("Component destroyed");
      } catch (e) { }
    }

    try {
      this._roWords && this._roWords.disconnect();
    } catch (e) { }
    try {
      this._roTags && this._roTags.disconnect();
    } catch (e) { }

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

    async loadWordCloud(force = false) {
      this.error = "";

      if (!this.resolvedToken) {
        this.error = "ไม่พบ token (ส่ง prop token หรือ set localStorage key: token)";
        return;
      }

      const fetchKey = `${String(this.domainId)}|${String(this.resolvedStart)}|${String(this.resolvedEnd)}|${String(this.monitor)}`;

      if (!force && this.apiData && this._lastFetchKey === fetchKey) {
        this.renderBoth();
        return;
      }

      if (this._cancelSource) this._cancelSource.cancel("Cancelled due to new request");
      this._cancelSource = axios.CancelToken.source();

      this.isLoading = true;
      try {
        const params = { domain_id: this.domainId, start: this.resolvedStart, end: this.resolvedEnd };
        if (this.monitor) params.monitor = this.monitor;

        const res = await axios.request({
          method: "GET",
          url: "https://api2.cognizata.com/api/v2/wordcloud/getWordCloud",
          params,
          headers: { Authorization: `Bearer ${this.resolvedToken}` },
          cancelToken: this._cancelSource.token,
        });

        this.apiData = res.data;
        this._lastFetchKey = fetchKey;

        this.$emit("loaded", this.apiData);

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

      const tx = pad - (bw / 2 + minX) * s;
      const ty = pad - (bh / 2 + minY) * s;

      g.attr("transform", `translate(${tx},${ty}) scale(${s})`);
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

    // ✅ blend สีตามสัดส่วน บวก/กลาง/ลบ — สูตรเดียวกับ backend (lib/sentimentColor.js)
    // colorPos/colorNeu/colorNeg + domPow/negBoost/neuDampen/dominanceKick + HSL clamp
    // ใช้ค่า default เดียวกับ backend ทุกตัว ผลลัพธ์สีจึงตรงกับภาพที่ backend สร้าง
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
        } catch (e) { }
      }
      if (this._layoutTags) {
        try {
          this._layoutTags.stop();
        } catch (e) { }
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
      if (kind === "words") {
        if (this._layoutWords) {
          try {
            this._layoutWords.stop();
          } catch (e) { }
        }
        this._layoutWords = null;
        if (this._svgWords) this._svgWords.remove();
        this._svgWords = null;
      } else {
        if (this._layoutTags) {
          try {
            this._layoutTags.stop();
          } catch (e) { }
        }
        this._layoutTags = null;
        if (this._svgTags) this._svgTags.remove();
        this._svgTags = null;
      }

      const el = this.$refs[chartRef];
      const wrap = this.$refs[wrapRef];
      if (!el || !wrap) return;

      await this.waitForStableSize(wrap, 14);

      if (document?.fonts) {
        try {
          // ✅ โหลดฟอนต์จริงที่ใช้วาดคำ (ไม่ใช่แค่รอ fonts.ready เฉยๆ ซึ่งผ่านได้แม้ฟอนต์ไม่โหลด)
          await document.fonts.load(`500 16px ${this.fontFamily}`);
          await document.fonts.load(`700 16px ${this.fontFamily}`);
          await document.fonts.ready;
        } catch (e) { }
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

      // ✅ ใช้ขนาด canvas คงที่ (fixed) แทนการอิงขนาดกล่องจริง (wrap.clientWidth/clientHeight)
      // เพื่อให้ผล layout/ระยะขอบเสมอกันทุกครั้งไม่ว่ากล่องจะถูกบีบ/ขยายแค่ไหน (เหมือนภาพ backend ที่ fix ขนาดไว้)
      // ส่วนการแสดงผลจริงบนจอยังคง responsive ได้ตามปกติ เพราะ svg ใช้ viewBox + width/height: 100% อยู่แล้ว
      const bw = this.fixedWidth;
      const bh = this.fixedHeight;

      // ✅ ขนาด "พื้นที่ทำ layout" ให้ใหญ่กว่ากรอบจริง (oversize)
      // ทำให้ spiral ของ d3-cloud มีที่เดินกว้างขึ้นก่อนจะเจอที่ว่าง คำจึงกระจายตัวทั่วพื้นที่
      // แทนที่จะกองอยู่ตรงกลาง — แล้วค่อยย่อ/จัดกลางให้พอดีกรอบจริงด้วย fitToDataBounds ทีหลัง
      const oversize = Math.max(1, this.layoutOversize || 1.6);
      const lw = bw * oversize;
      const lh = bh * oversize;

      const svg = d3
        .select(el)
        .html("")
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
          let t = (seed += 0x6d2b79f5);
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

        const seedBase = attempt * 97 + (kind === "tags" ? 777 : 0);

        const rng = mulberry32(seedBase);

        const layout = cloud()
          .size([lw, lh]) // ✅ ใช้พื้นที่ oversize แทนขนาดกรอบจริง เพื่อให้กระจายตัวทั่วถึง
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
            if (data.length < words.length && attempt < MAX_TRIES) {
              const nextPad = padMul * 0.82;
              const nextFont = fontMul * (attempt <= 2 ? 0.9 : 0.94);
              return run(words, nextPad, nextFont);
            }

            const texts = g
              .selectAll("text")
              .data(data, (d) => d.__id)
              .enter()
              .append("text")
              .style("font-weight", 300)
              .style("font-family", self.fontFamily)
              .style("font-size", (d) => d.size + "px")
              .style("fill", (d) => self.colorBySentiment(d.__src))
              .style("cursor", "pointer")
              .attr("text-anchor", "middle")
              .attr("transform", (d) => {
                // ⚠️ ต้องใช้ bw/bh (ไม่ใช่ lw/lh) ให้ตรงกับสูตรใน fitToDataBounds
                // offset ตอนวาดกับตอน fit ต้องอิงฐานเดียวกัน ไม่งั้นจะเกิด offset เพี้ยน (เลื่อนขวา/ล่าง) ทำให้คำล้นออกนอกกรอบและโดน clip
                // lw/lh มีหน้าที่แค่ "ให้พื้นที่ spiral เดินกว้างขึ้น" ตอน layout เท่านั้น ไม่เกี่ยวกับจุดอ้างอิงตอนวาด
                const x = d.x + bw / 2;
                const y = d.y + bh / 2;
                return `translate(${x},${y})rotate(${d.rotate || 0})`;
              })
              .text((d) => d.text);

            // ✅ ย่อ/จัดกลาง bounding box จริงของคำทั้งหมดให้พอดีกรอบที่แสดงผล (bw, bh) เสมอ
            // ทำให้ขอบซ้าย-ขวา-บน-ล่างเท่ากัน ไม่ว่าจะกระจายตัวกว้างแค่ไหนตอน layout
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
@import url("https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap");

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
  font-weight: 200;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: #fafafa;
  font-family: "Sarabun", sans-serif;
  font-weight: 200;
  font-style: normal;
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
  font-family: "Sarabun", sans-serif;
  font-weight: 300;
  font-style: italic;
}

.wc-empty {
  height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  font-family: "Sarabun", sans-serif;
  font-weight: 200;
  font-style: normal;
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