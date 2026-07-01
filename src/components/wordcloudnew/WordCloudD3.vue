<template>
  <b-card class="" no-body>


    <!-- <b-alert v-if="error" show variant="danger" class="mx-3 mb-2">
      {{ error }}
    </b-alert> -->

    <!-- ✅ 2 cloud ใน 1 component (component ยิง API เอง ไม่มี filter ในตัว) -->
    <div class=" pb-3">
      <b-row>
        <!-- WORD CLOUD -->
        <b-col lg="6" >
          <div class=" h-100 w-100">
            <!-- <div class="wc-panel-title">Words</div> -->

            <div class="wc-wrap position-relative">
              <div ref="chartWrapWords" class="wc-chart" :style="chartAspectStyle">
                <div ref="chartWords" class="wc-chart-inner"></div>
              </div>

              <div v-if="isLoading" class="wc-overlay">
                <div class="text-center">
                  <b-spinner />
                  <div class="mt-2 small text-muted">กำลังโหลดข้อมูล...</div>
                </div>
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
                <div class="small text-muted font-italic mt-1">คลิกขวาที่คำนี้เพื่อซ่อนออกจากภาพ</div>
              </div>

              <!-- ✅ เมนูคลิกขวา: กด "ซ่อนคำนี้" เพื่อลบออกจากภาพ -->
              <div v-show="contextMenu.show && contextMenu.kind === 'words'" class="wc-context-menu"
                :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }">
                <div class="wc-context-menu-label">{{ contextMenu.name }}</div>
                <button type="button" class="wc-context-menu-item" @click="hideFromContextMenu">
                  ซ่อนคำนี้ออกจากภาพ
                </button>
              </div>
            </div>
            
          </div>
           <button
                v-if="excludedWordsCount > 0"
                type="button"
                class="wc-reset-badge"
                @click="resetExcluded('words')"
              >
                ซ่อนไว้ {{ excludedWordsCount }} คำ · เอากลับมา
              </button>
        </b-col>

        <!-- HASHTAG CLOUD -->
        <b-col lg="6">
          <div class=" h-100 w-100" >
            <!-- <div class="wc-panel-title">Hashtags</div> -->

            <div class="wc-wrap position-relative">
              <div ref="chartWrapTags" class="wc-chart" :style="chartAspectStyle">
                <div ref="chartTags" class="wc-chart-inner"></div>
              </div>

              <div v-if="isLoading" class="wc-overlay">
                <div class="text-center">
                  <b-spinner />
                  <div class="mt-2 small text-muted">กำลังโหลดข้อมูล...</div>
                </div>
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
                <div class="small text-muted font-italic mt-1">คลิกขวาที่แท็กนี้เพื่อซ่อนออกจากภาพ</div>
              </div>

              <div v-show="contextMenu.show && contextMenu.kind === 'tags'" class="wc-context-menu"
                :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }">
                <div class="wc-context-menu-label">{{ contextMenu.name }}</div>
                <button type="button" class="wc-context-menu-item" @click="hideFromContextMenu">
                  ซ่อนแท็กนี้ออกจากภาพ
                </button>
              </div>
            </div>
          </div>
 
               <button
                v-if="excludedTagsCount > 0"
                type="button"
                class="wc-reset-badge"
                @click="resetExcluded('tags')"
              >
                ซ่อนไว้ {{ excludedTagsCount }} แท็ก · เอากลับมา
              </button>
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

    minHeight: { type: Number, default: 480 },
    // ⚡ ลดจำนวนคำที่วาด: ยิ่งคำเยอะ ยิ่งชนกันเยอะ → d3-cloud ต้อง retry บ่อย (ดู MAX_TRIES ด้านล่าง)
    // ลดเพิ่มอีกนิด (80→60) ให้ภาพโปร่งขึ้น ไม่แน่นจนอ่านยาก ใกล้เคียงตัวอย่างที่กระจายตัวดี
    limit: { type: Number, default: 60 },

    // ✅ ขนาด canvas คงที่สำหรับทำ layout/วาดคำ (ไม่อิงขนาดกล่องจริงบนจอ)
    // ใช้ค่าตายตัวเพื่อให้ผลลัพธ์ระยะขอบ/การกระจายตัวสม่ำเสมอทุกครั้ง ส่วนการแสดงผลจริงยัง responsive ตาม container เพราะ svg ใช้ viewBox
    fixedWidth: { type: Number, default: 720 },
    fixedHeight: { type: Number, default: 480 },

    minFont: { type: Number, default: 20 },
    // ⚡ ลดจาก 180 → 140: ฟอนต์ใหญ่ทำให้ sprite mask ที่ d3-cloud ใช้เช็ค collision แพงขึ้นมาก (พื้นที่ bitmap โตแบบ O(size^2))
    maxFont: { type: Number, default: 140 },

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
    // ⚡ ปรับกลับเป็น 1.6 (จากที่เคยลดเหลือ 1 ในไฟล์เดิม): พื้นที่ layout แคบเกินไปทำให้ d3-cloud
    //    หาที่ว่างไม่เจอบ่อย ต้อง retry (ดู run()) ซึ่งแต่ละรอบคือ full recompute ที่แพงมาก
    layoutOversize: { type: Number, default: 1.8 },

    // ✅ สีและพารามิเตอร์ blend ปรับให้ตรงกับ backend (lib/sentimentColor.js DEFAULTS)
    colorPos: { type: String, default: "#005905" },
    colorNeu: { type: String, default: "#ffc107" },
    colorNeg: { type: String, default: "#820000" },

    domPow: { type: Number, default: 3 },
    negBoost: { type: Number, default: 3 },
    neuDampen: { type: Number, default: 0.5 },
    dominanceKick: { type: Number, default: 0.55 },

    satMin: { type: Number, default: 0.85 },
    lightMin: { type: Number, default: 0.38 },
    lightMax: { type: Number, default: 0.6 },
    // ⚡ ปรับกลับให้มีระยะห่างจริงระหว่างคำ (รอบก่อนลดค่านี้ลงเพื่อให้ "ชิดขอบ" แต่ทำให้คำชนกันแทน)
    // ตอนนี้แก้ต้นตอ (font-style italic ไม่ตรงกับที่ d3-cloud ใช้คำนวณ) ไปแล้ว แต่ยังคงเว้น padding พอสมควรไว้กันคำชนกันเวลาปัดเศษ/ฟอนต์โหลดคนละรอบ
    paddingBase: { type: Number, default: 2 },
    paddingFactor: { type: Number, default: 0.08 },
  },

  data() {
    return {
      isLoading: false,
      hasLoaded: false,
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

      // ⚡ track ว่าแต่ละ chart เคย render สำเร็จ (มีขนาดจริง) ไปแล้วหรือยัง
      // เพราะ layout ใช้ fixedWidth/fixedHeight คงที่ + svg ใช้ viewBox ทำ responsive เอง
      // จึงไม่จำเป็นต้องรัน d3-cloud (ของแพง) ใหม่ทุกครั้งที่ container resize
      _renderedWords: false,
      _renderedTags: false,

      // ✅ คำ/แฮชแท็กที่ผู้ใช้กดลบออก (ไม่เกี่ยวข้อง/สแปม) — key คือชื่อคำ (normalize แล้ว)
      // เก็บแยกกันระหว่าง words กับ hashtags และ persist ลง localStorage ต่อ domain
      // เพื่อให้กดลบครั้งเดียว แล้วครั้งต่อไปที่เปิดหน้าเดิม (domain เดิม) คำนั้นจะถูกซ่อนไว้เหมือนเดิม
      excludedWords: {},
      excludedTags: {},

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

      // ✅ เมนูคลิกขวาเล็กๆ สำหรับกด "ซ่อนคำนี้ออกจากภาพ"
      contextMenu: {
        show: false,
        kind: "", // "words" | "tags"
        x: 0,
        y: 0,
        name: "",
        word: null, // อ็อบเจกต์คำที่ถูกคลิกขวา (มี .key/.text/.__src)
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

    // ⚡ ทั้งสองฝั่ง (words / hashtags) ต้องมีขนาดกล่องเท่ากันเป๊ะเสมอ ไม่ว่าเนื้อหาข้างในจะกระจายตัวต่างกันแค่ไหน
    // ใช้ CSS aspect-ratio บังคับสัดส่วนของกล่องโดยตรง (คำนวณความสูงจากความกว้างจริงของแต่ละคอลัมน์)
    // แทนที่จะพึ่งพา flex "stretch" ของแถว หรือการวัดขนาดด้วย JS ซึ่งมีโอกาสวัดได้ไม่พร้อมกันระหว่าง 2 ฝั่ง
    // เพราะ props fixedWidth/fixedHeight ใช้ค่าเดียวกันทั้งคู่ ผลลัพธ์คือทั้งสองกล่องจะสูงเท่ากันเสมอเมื่อกว้างเท่ากัน (ซึ่ง bootstrap col lg="6" การันตีให้อยู่แล้ว)
    chartAspectStyle() {
      return { aspectRatio: `${this.fixedWidth} / ${this.fixedHeight}` };
    },

    excludedWordsCount() {
      return Object.keys(this.excludedWords).length;
    },
    excludedTagsCount() {
      return Object.keys(this.excludedTags).length;
    },
    _excludeStorageKey() {
      return `wc_excluded::${String(this.domainId)}`;
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
      this.loadExcluded();
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
    this.loadExcluded();
    this.loadWordCloud();

    // ✅ ปิดเมนูคลิกขวาเมื่อคลิกที่อื่น / เลื่อนหน้าจอ / กด Esc
    // เช็ค closest('.wc-context-menu') กันไม่ให้การคลิกปุ่ม "ซ่อนคำนี้" ในเมนูเอง โดนปิดเมนูตัดหน้าก่อน handler ของปุ่มจะทำงาน
    this._closeContextMenu = (e) => {
      if (!this.contextMenu.show) return;
      if (e && e.target && e.target.closest && e.target.closest(".wc-context-menu")) return;
      this.contextMenu.show = false;
    };
    this._closeContextMenuOnEsc = (e) => {
      if (e.key === "Escape") this._closeContextMenu();
    };
    document.addEventListener("click", this._closeContextMenu);
    document.addEventListener("contextmenu", this._closeContextMenu);
    document.addEventListener("scroll", this._closeContextMenu, true);
    document.addEventListener("keydown", this._closeContextMenuOnEsc);

    this.$nextTick(() => {
      const w1 = this.$refs.chartWrapWords;
      const w2 = this.$refs.chartWrapTags;

      // ⚡ เดิม: debounced เรียก renderBoth() (รัน d3-cloud ใหม่ทั้งคู่ ของแพง) ทุกครั้งที่มีการ resize
      // ใหม่: ResizeObserver มีหน้าที่แค่ "จับจังหวะที่กล่องมีขนาดจริงครั้งแรก" (กรณี mount ตอนกล่องยังเป็น 0)
      // เพราะ layout คำนวณจาก fixedWidth/fixedHeight คงที่อยู่แล้ว ส่วนการ responsive จริงบนจอ
      // เป็นหน้าที่ของ svg viewBox (scale ฟรี ไม่ต้องคำนวณ layout ใหม่) — ไม่จำเป็นต้อง re-render ซ้ำ
      const ensureRenderedWords = () => {
        if (this._renderedWords) return;
        if (w1 && w1.clientWidth > 50 && w1.clientHeight > 50) {
          this._renderedWords = true;
          this.renderOne({
            kind: "words",
            wrapRef: "chartWrapWords",
            chartRef: "chartWords",
            getItems: () => this.wordItems,
          });
          if (this._roWords) this._roWords.disconnect();
        }
      };

      const ensureRenderedTags = () => {
        if (this._renderedTags) return;
        if (w2 && w2.clientWidth > 50 && w2.clientHeight > 50) {
          this._renderedTags = true;
          this.renderOne({
            kind: "tags",
            wrapRef: "chartWrapTags",
            chartRef: "chartTags",
            getItems: () => this.hashtagItems,
          });
          if (this._roTags) this._roTags.disconnect();
        }
      };

      if (window.ResizeObserver) {
        this._roWords = new ResizeObserver(ensureRenderedWords);
        this._roTags = new ResizeObserver(ensureRenderedTags);
        if (w1) this._roWords.observe(w1);
        if (w2) this._roTags.observe(w2);
      } else {
        const debounced = (() => {
          let t = null;
          return () => {
            clearTimeout(t);
            t = setTimeout(() => {
              ensureRenderedWords();
              ensureRenderedTags();
            }, 100);
          };
        })();
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

    document.removeEventListener("click", this._closeContextMenu);
    document.removeEventListener("contextmenu", this._closeContextMenu);
    document.removeEventListener("scroll", this._closeContextMenu, true);
    document.removeEventListener("keydown", this._closeContextMenuOnEsc);
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
        this.hasLoaded = true;
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
      this.hasLoaded = false;
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
        this.hasLoaded = true;
      }
    },

    // ⚡ ลดจำนวนรอบรอ (12 → 3) เพราะ layout อิง fixedWidth/fixedHeight คงที่อยู่แล้ว
    // ไม่ได้ผูกกับขนาดจริงของกล่องเวลาคำนวณ layout จึงไม่จำเป็นต้องรอกล่อง "เสถียร" นาน
    // เก็บไว้แค่กันเคส container ยังเป็น 0 ตอน mount ครั้งแรกจริง ๆ
    async waitForStableSize(wrapEl, tries = 3) {
      for (let i = 0; i < tries; i++) {
        if (wrapEl && wrapEl.clientWidth > 50 && wrapEl.clientHeight > 50) return true;
        await new Promise((r) => requestAnimationFrame(r));
      }
      return false;
    },

    // ✅ Fit ข้อความจริงให้เต็มกรอบ โดยใช้ SVG bbox จริงหลัง render แล้ว
    // แก้ปัญหา: ข้อมูลน้อยแล้ว wordcloud ลอยอยู่กลาง/ใช้พื้นที่น้อย
    // - ใช้ getBBox() ของ <g> หลังวาด text จริง ไม่เดาจาก d3-cloud width/height
    // - ข้อมูลน้อยจะอนุญาตให้ขยายแกนที่ว่างได้มากขึ้นเล็กน้อย เพื่อให้เต็มเหมือนภาพตัวอย่าง
    // - ข้อมูลเยอะจะคุม distortion ไว้ต่ำ เพื่อไม่ให้ตัวอักษรบีบ/ยืดผิดรูป
    fitToDataBounds(g, bw, bh, pad = 12, itemCount = 0) {
      if (!g || !g.node) return;

      let bbox;
      try {
        bbox = g.node().getBBox();
      } catch (e) {
        return;
      }

      if (!bbox || !bbox.width || !bbox.height) return;

      const safePad = Math.max(4, Number(pad || 0));
      const targetW = Math.max(1, bw - safePad * 2);
      const targetH = Math.max(1, bh - safePad * 2);

      let sx = targetW / bbox.width;
      let sy = targetH / bbox.height;

      // ข้อมูลน้อย เช่น hashtag 5-10 คำ ถ้าใช้ scale เดียวจะเหลือพื้นที่ว่างมาก
      // จึงยอมให้ sx/sy ต่างกันได้มากขึ้น แต่ยัง clamp กันบีบเกินไป
      const count = Number(itemCount || 0);
      const maxDistortion = count <= 8 ? 2.8 : count <= 15 ? 2.25 : count <= 25 ? 1.75 : 1.35;

      if (sx / sy > maxDistortion) sx = sy * maxDistortion;
      else if (sy / sx > maxDistortion) sy = sx * maxDistortion;

      const tx = safePad - bbox.x * sx + (targetW - bbox.width * sx) / 2;
      const ty = safePad - bbox.y * sy + (targetH - bbox.height * sy) / 2;

      g.attr("transform", `translate(${tx},${ty}) scale(${sx},${sy})`);
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
    buildWordsFromList(list0, excludedMap) {
      const raw = Array.isArray(list0) ? list0 : [];
      const excluded = excludedMap || {};

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
        // ✅ ตัดคำที่ถูกลบออกไปแล้วตั้งแต่ก่อน sort/slice
        // เพื่อให้คำอันดับถัดไปเลื่อนขึ้นมาแทนที่ (ไม่ใช่แค่ซ่อนแล้วเหลือที่ว่าง)
        .filter((d) => !excluded[this._normKey(d.key)])
        .sort((a, b) => b.value - a.value)
        .slice(0, Math.max(0, this.limit));

      if (!list.length) return [];

      const values = list.map((d) => Math.max(1, d.value));
      const vMin = Math.min(...values);
      const vMax = Math.max(...values);
      const domainMax = vMax === vMin ? vMax + 1 : vMax;

      // ✅ ข้อมูลน้อยต้องขยาย font range ให้กินพื้นที่มากขึ้น
      // เช่น hashtag มีแค่ไม่กี่คำ ถ้าใช้ maxFont เดิมจะเหลือพื้นที่ว่างเหมือนภาพแรก
      const n = list.length;
      const sparseBoost = n <= 5 ? 2.1 : n <= 8 ? 1.85 : n <= 12 ? 1.6 : n <= 20 ? 1.35 : 1;
      const minF = Math.max(8, Math.round(this.minFont * (n <= 12 ? 1.35 : n <= 20 ? 1.15 : 1)));
      const maxF = Math.max(minF + 4, Math.round(this.maxFont * sparseBoost));

      const scale = d3.scaleLog().domain([vMin, domainMax]).range([minF, maxF]);

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

    // ✅ helper กลาง สำหรับสั่ง render กล่องใดกล่องหนึ่งซ้ำ (ใช้ตอนลบ/กู้คืนคำ ไม่ต้อง render อีกฝั่งที่ไม่เกี่ยวข้องใหม่)
    renderKind(kind) {
      if (kind === "words") {
        this.renderOne({
          kind: "words",
          wrapRef: "chartWrapWords",
          chartRef: "chartWords",
          getItems: () => this.wordItems,
        });
      } else {
        this.renderOne({
          kind: "tags",
          wrapRef: "chartWrapTags",
          chartRef: "chartTags",
          getItems: () => this.hashtagItems,
        });
      }
    },

    // -------- Exclude (ลบคำ/แฮชแท็กที่ไม่เกี่ยวข้องออกจากภาพ) --------
    _normKey(text) {
      return String(text || "").trim().toLowerCase();
    },

    loadExcluded() {
      this.excludedWords = {};
      this.excludedTags = {};
      try {
        const raw = localStorage.getItem(this._excludeStorageKey);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        this.excludedWords = parsed?.words || {};
        this.excludedTags = parsed?.tags || {};
      } catch (e) { }
    },

    persistExcluded() {
      try {
        localStorage.setItem(
          this._excludeStorageKey,
          JSON.stringify({ words: this.excludedWords, tags: this.excludedTags })
        );
      } catch (e) { }
    },

    // เรียกตอนคลิกคำในภาพ — ลบคำนั้นออกจากรายการที่ใช้วาด แล้ว re-render เฉพาะฝั่งนั้น
    excludeItem(kind, d) {
      const key = this._normKey(d.key || d.text);
      if (!key) return;

      const map = kind === "words" ? this.excludedWords : this.excludedTags;
      this.$set(map, key, true);
      this.persistExcluded();

      this.tooltip.show = false;
      this.$emit("exclude", { kind, key, text: d.text, data: d.__src });

      this.renderKind(kind);
    },

    // ปุ่ม "เอากลับมาทั้งหมด" — ล้างรายการที่ซ่อนไว้ของฝั่งนั้น แล้ว re-render ใหม่
    resetExcluded(kind) {
      if (kind === "words") this.excludedWords = {};
      else this.excludedTags = {};
      this.persistExcluded();
      this.$emit("exclude-reset", { kind });
      this.renderKind(kind);
    },

    // ปุ่ม "ซ่อนคำนี้ออกจากภาพ" ในเมนูคลิกขวา
    hideFromContextMenu() {
      const { kind, word } = this.contextMenu;
      this.contextMenu.show = false;
      if (!kind || !word) return;
      this.excludeItem(kind, word);
    },

    renderBoth() {
      if (!this.apiData) return;

      // ⚡ นับว่า render แล้วเมื่อถูกเรียกจาก path หลัก (data/props เปลี่ยน) ด้วย
      // กัน ResizeObserver ยิงซ้ำสั่ง render ทับอีกรอบหลังจากนี้โดยไม่จำเป็น
      this._renderedWords = true;
      this._renderedTags = true;

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

      await this.waitForStableSize(wrap, 3);

      if (document?.fonts) {
        try {
          // ⚡ เช็คก่อนว่าฟอนต์โหลดแล้วหรือยัง (fonts.check เป็น sync, เร็วมาก)
          // ถ้าโหลดแล้วข้าม await ไปเลย ลดดีเลย์ทุกครั้งที่ re-render (เดิม await ทุกครั้งแม้โหลดไปแล้ว)
          const need500 = !document.fonts.check(`500 16px ${this.fontFamily}`);
          const need700 = !document.fonts.check(`700 16px ${this.fontFamily}`);
          if (need500) await document.fonts.load(`500 16px ${this.fontFamily}`);
          if (need700) await document.fonts.load(`700 16px ${this.fontFamily}`);
          if (need500 || need700) await document.fonts.ready;
        } catch (e) { }
      }

      const list0 = getItems?.() || [];
      const excludedMap = kind === "words" ? this.excludedWords : this.excludedTags;
      const raw = this.buildWordsFromList(list0, excludedMap);
      if (!raw.length) {
        el.innerHTML = this.isLoading || !this.hasLoaded
          ? ""
          : `<div class="wc-empty">ไม่พบข้อมูล</div>`;
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

      // ✅ ใช้ fixedWidth/fixedHeight ตรงๆ ได้แล้ว เพราะฝั่ง CSS (chartAspectStyle) บังคับให้กล่องจริง
      // มีสัดส่วนตรงกับค่านี้เป๊ะอยู่แล้วเสมอ (ไม่มี letterbox) และค่าเดียวกันนี้ใช้ทั้ง words/hashtags
      // จึงการันตีว่าทั้งสองฝั่งจะได้ box ขนาดเท่ากันทุกครั้ง ไม่ขึ้นกับจังหวะการวัดขนาดจริงของ DOM
      const bw = this.fixedWidth;
      const bh = this.fixedHeight;

      // ✅ ถ้าข้อมูลน้อย ไม่ต้องใช้ canvas layout ใหญ่มาก เพราะจะดูหลวม/กระจายไม่เต็ม
      // ข้อมูลเยอะยังใช้ oversize ตาม prop เพื่อลดการชนกัน
      const itemCount = words0.length;
      const oversize = itemCount <= 8 ? 1.05 : itemCount <= 15 ? 1.15 : itemCount <= 25 ? 1.3 : Math.max(1, this.layoutOversize || 1.6);
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

      // ⚡ ลดจาก 8 → 6: แต่ละรอบ retry คือรัน d3-cloud ใหม่ทั้งชุด (แพงมาก) แต่เผื่อไว้มากกว่า 5 นิดหน่อย
      // เพราะ padding เพิ่มขึ้น (ต้องการที่ว่างมากขึ้น) อาจต้อง retry มากกว่าตอน padding แน่นๆ
      const MAX_TRIES = 6;
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
          .size([lw, lh])
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
                const x = d.x + bw / 2;
                const y = d.y + bh / 2;
                return `translate(${x},${y})rotate(${d.rotate || 0})`;
              })
              .text((d) => d.text);

            self.fitToDataBounds(g, bw, bh, itemCount <= 15 ? 16 : 10, data.length);

            texts
              .on("mousemove", function (event, d) {
                if (self.contextMenu.show) return; // อย่าขยับ tooltip ทับเมนูขวาที่เปิดอยู่
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
              .on("click", (event, d) => self.$emit("select", { kind, data: d.__src }))
              // ✅ คลิกขวา = เปิดเมนูเล็กๆ ให้เลือก "ซ่อนคำนี้ออกจากภาพ" แทนการลบทันทีตอนคลิกซ้าย
              .on("contextmenu", function (event, d) {
                event.preventDefault();
                event.stopPropagation();
                const rect = wrap.getBoundingClientRect();
                self.tooltip.show = false;
                self.contextMenu.show = true;
                self.contextMenu.kind = kind;
                self.contextMenu.x = event.clientX - rect.left;
                self.contextMenu.y = event.clientY - rect.top;
                self.contextMenu.name = d.text;
                self.contextMenu.word = d;
              });
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
  /* min-height: 320px; */
}

.wc-chart {
  width: 100%;
  /* aspect-ratio ถูก bind แบบ inline ผ่าน chartAspectStyle (ตรงกับ fixedWidth/fixedHeight)
     ทำให้ words/hashtags ได้ box สูงเท่ากันเป๊ะเสมอ เพราะทั้งคู่กว้างเท่ากัน (bootstrap col lg="6")
     และคำนวณความสูงจากสัดส่วนเดียวกัน แทนที่จะพึ่ง flex stretch หรือ min-height ลอยๆ */
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
  /* ⚡ เอา italic ออก: d3-cloud คำนวณ collision (เว้นที่ว่างระหว่างคำ) จากฟอนต์ตัวตรงเท่านั้น
     ถ้า render จริงเป็น italic ตัวอักษรจะเอียง/กว้างกว่ากรอบที่จองไว้ ทำให้คำข้างเคียงทับกันแม้ layout จะไม่ชนกันจริง */
  font-style: normal;
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

.wc-reset-badge {
  /* position: absolute;
  top: 8px;
  right: 8px;
  z-index: 11; */
  border: none;
  border-radius: 999px;
  background: rgba(20, 20, 20, 0.75);
  color: #fff;
  font-family: "Sarabun", sans-serif;
  font-size: 12px;
  font-weight: 400;
  padding: 5px 12px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.wc-reset-badge:hover {
  background: rgba(20, 20, 20, 0.92);
}

.wc-context-menu {
  position: absolute;
  z-index: 20;
  transform: translate(-6px, -6px);
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.22);
  padding: 6px;
  min-width: 168px;
  font-family: "Sarabun", sans-serif;
}

.wc-context-menu-label {
  padding: 6px 10px 4px;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wc-context-menu-item {
  display: block;
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  color: #b3261e;
  font-size: 13px;
  font-weight: 400;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.wc-context-menu-item:hover {
  background: #fdeceb;
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