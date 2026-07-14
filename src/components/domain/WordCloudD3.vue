<template>
  <div>

    <!-- ✅ แจ้งเตือน error — รับมาจาก parent ผ่าน prop `error` เท่านั้น (component นี้ไม่ fetch เองแล้ว)
         ปุ่ม "ลองใหม่" ยิง event retry ให้ parent (คนที่ยิง API จริง) ไปจัดการเอง -->
    <div v-if="error" class="wc-error-banner">
      <i class="fa fa-triangle-exclamation"></i>
      <span>{{ error }} โปรดลองอีกครั้ง</span>
      <button type="button" class="wc-retry-btn" @click="$emit('retry')">ลองใหม่</button>
    </div>

    <!-- ✅ 2 cloud ใน 1 component
         Engine: wordcloud2.js (timdream) — วางคำแบบ grid-based ทำให้ "เต็มกรอบสี่เหลี่ยม"
         ได้ดีกว่า d3-cloud (ซึ่งวางแบบ spiral รอบจุดกลาง จึงเหลือมุมว่างเสมอ) -->
    <div class="">
      <b-row class="mb-1">
        <!-- WORD CLOUD -->
        <!-- ✅ mobile: โชว์ทีละอันตาม activeTab (word/hash) ด้วย d-none + d-lg-block
             desktop (lg ขึ้นไป): โชว์คู่กันเสมอ ไม่สนใจ activeTab -->
        <b-col cols="12" lg="6" class="px-0">
          <div class="h-100 w-100 px-2">
            <div class="wc-wrap  box-domain position-relative ">
              <!-- ⚡ chartWords คือ "host div" — เราจะสร้าง <canvas> ยัดเข้าไปข้างในตอน render
                   (wordcloud2.js วาดลง canvas ไม่ใช่ svg) -->
              <div ref="chartWrapWords" class="wc-chart" :style="chartAspectStyle">
                <div ref="chartWords" class="wc-chart-inner"></div>
              </div>

              <div v-if="isLoading" class="wc-overlay">
                <div class="text-center">
                  <vue-element-loading :active="isLoading" size="50" background-color="rgba(255,255,255,0)"
                    color="#17a2b891" />
                </div>
              </div>
            </div>
          </div>
        </b-col>

        <!-- HASHTAG CLOUD -->
        <b-col cols="12" lg="6" class="px-0">
          <div class="h-100 w-100 px-2">
            <div class="wc-wrap  box-domain position-relative">
              <div ref="chartWrapTags" class="wc-chart" :style="chartAspectStyle">
                <div ref="chartTags" class="wc-chart-inner"></div>
              </div>

              <div v-if="isLoading" class="wc-overlay">
                <div class="text-center">
                  <vue-element-loading :active="isLoading" size="50" background-color="rgba(255,255,255,0)"
                    color="#17a2b891" />
                </div>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>

    <!-- ✅ Popup แสดงข้อมูลคำ/แฮชแท็ก
         - hover = แสดงตัวอย่างชั่วคราว ณ จุดที่เมาส์เข้าคำ
         - คลิก = ปักหมุดค้างไว้ พร้อมปุ่มดูโพสต์/ซ่อนคำ
         - position: fixed อิงพิกัด viewport ตรง ๆ ไม่โดน overflow ของกล่องบีบ -->
    <div v-if="popup.show" ref="wordPopup" class="wc-word-popup" :class="{ 'wc-word-popup-pinned': popup.pinned }"
      :style="{ left: popup.x + 'px', top: popup.y + 'px' }" @click.stop @mouseenter="onPopupMouseEnter"
      @mouseleave="onPopupMouseLeave">
      <button v-if="popup.pinned" type="button" class="wc-word-popup-close" @click="closePopup"
        aria-label="ปิด">×</button>

      <div class="wc-word-popup-title">{{ popup.name }}</div>
      <b-row style="font-size: 14px;">
        <b-col cols="6" class="px-0 ">
          <span class="text-muted mr-auto"> <b>โพสต์</b></span>
          <span class="font-weight-bold"> {{ fmt(popup.total_post) }}</span>
        </b-col>
        <b-col cols="6" class="px-0 ">
          <span class="text-muted mr-auto"> <b>ความถี่</b></span>
          <span class="font-weight-bold"> {{ fmt(popup.total) }}</span>
        </b-col>
      </b-row>
      <div class="wc-word-popup-stats">
        <!-- <div class="wc-word-popup-stat-row">
          <span class="text-muted mr-auto">จำนวน <b>โพสต์</b></span>
          <span class="font-weight-bold">{{ fmt(popup.total_post) }}</span>
        </div>
        <div class="wc-word-popup-stat-row">
          <span class="text-muted mr-auto">จำนวน <b>ความถี่</b></span>
          <span class="font-weight-bold">{{ fmt(popup.total) }}</span>
        </div> -->
        <div class="wc-word-popup-stat-row">
          <i class="fa fa-face-grin wc-icon wc-icon-pos"></i>
          <span class="text-muted mr-auto">บวก</span>
          <span>{{ fmt(popup.pos) }}</span>
        </div>
        <div class="wc-word-popup-stat-row">
          <i class="fa fa-face-meh wc-icon wc-icon-neu"></i>
          <span class="text-muted mr-auto">กลาง</span>
          <span>{{ fmt(popup.neu) }}</span>
        </div>
        <div class="wc-word-popup-stat-row">
          <i class="fa fa-face-frown wc-icon wc-icon-neg"></i>
          <span class="text-muted mr-auto">ลบ</span>
          <span>{{ fmt(popup.neg) }}</span>
        </div>
      </div>

      <div class="text-center">
        <b-row>
          <b-col>
            <b-button variant="info" class="mr-1" @click="popupViewPosts" size="sm" pill block>
              ดูโพสต์
            </b-button>
          </b-col>
          <b-col>
            <b-button variant="danger" class="mr-1" @click="popupHide" size="sm" pill block>
              {{ popupHideLabel }}
            </b-button>
          </b-col>
        </b-row>
      </div>
    </div>

    <div>
      <b-row>
        <!-- ✅ badge "เอากลับมา" ก็โชว์ตามแท็บที่ active บนมือถือเช่นกัน -->
        <b-col cols="6" lg="6">
          <button v-if="excludedWordsCount > 0" type="button" class="wc-reset-badge" @click="resetExcluded('words')">
            ซ่อนไว้ {{ excludedWordsCount }} คำ · เอากลับมา
          </button>
        </b-col>
        <b-col cols="6" lg="6">
          <button v-if="excludedTagsCount > 0" type="button" class="wc-reset-badge" @click="resetExcluded('tags')">
            ซ่อนไว้ {{ excludedTagsCount }} แท็ก · เอากลับมา
          </button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3"; // ✅ ใช้ d3 สำหรับ scaleLog + สี (d3.rgb/hsl) เท่านั้น ไม่ใช้ d3-cloud

// ✅ URL ฟอนต์ Sarabun (ตัวเดียวกับที่ @import ไว้ใน <style> ด้านล่าง)
const WC_FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap";

// ⚡ module-level singleton — ฉีด <link rel="stylesheet"> เข้า <head> "ครั้งเดียว" ไม่ว่าจะมี
//    instance ของ component นี้กี่ตัวบนหน้าเดียวกัน แล้วคืน promise ที่ resolve เมื่อไฟล์ CSS
//    โหลดเสร็จจริง (ต่างจาก @import ใน <style scoped> ที่เป็น async แบบไม่มีใครรอ)
let _wcFontStylesheetPromise = null;
function ensureFontStylesheetLoaded(href) {
  if (typeof document === "undefined") return Promise.resolve();
  if (_wcFontStylesheetPromise) return _wcFontStylesheetPromise;

  _wcFontStylesheetPromise = new Promise((resolve) => {
    const existing = document.querySelector('link[data-wc-font="sarabun"]');

    const safetyTimer = setTimeout(resolve, 3000); // ✅ กันค้างถ้า network ช้า/โดนบล็อก CDN ฟอนต์

    if (existing) {
      if (existing.dataset.loaded === "1") {
        clearTimeout(safetyTimer);
        resolve();
        return;
      }
      existing.addEventListener(
        "load",
        () => {
          clearTimeout(safetyTimer);
          resolve();
        },
        { once: true }
      );
      existing.addEventListener("error", () => resolve(), { once: true });
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.wcFont = "sarabun";
    link.addEventListener(
      "load",
      () => {
        link.dataset.loaded = "1";
        clearTimeout(safetyTimer);
        resolve();
      },
      { once: true }
    );
    link.addEventListener("error", () => resolve(), { once: true });
    document.head.appendChild(link);
  });

  return _wcFontStylesheetPromise;
}

export default {
  name: "WordCloudD3",
  props: {
    // ✅ ข้อมูลดิบจาก API — parent เป็นคนยิง fetch เองแล้วส่งเข้ามาตรงนี้
    //    รูปแบบเดียวกับ response เดิม เช่น { wordCloud: [...], hashtags: [...] } หรือ array ตรงๆ
    data: { type: [Object, Array], default: null },
    isLoading: { type: Boolean, default: false },
    error: { type: String, default: "" },

    // ✅ key ของผลลัพธ์ใน data
    hashtagsKey: { type: String, default: "hashtags" },
    itemsKey: { type: String, default: "items" },

    minHeight: { type: Number, default: 480 },

    // ⚡ wordcloud2.js วางคำได้เต็มกว่า d3-cloud มาก จึงรับจำนวนคำได้เยอะขึ้นโดยไม่หาย
    limit: { type: Number, default: 80 },

    // ✅ ขนาด "logical" ของภาพ (aspect ratio ของกล่อง) — canvas จริงจะถูกคูณ renderScale เพื่อความคม
    fixedWidth: { type: Number, default: 720 },
    fixedHeight: { type: Number, default: 480 },

    // ✅ ความคมของ canvas: canvas จริง = fixedWidth*renderScale (แล้ว CSS ย่อ/ขยายเต็ม container)
    renderScale: { type: Number, default: 2 },

    // ⚡ ปรับขนาดฟอนต์ให้ "คำเด่น" ไม่ครองจอทั้งหมด
    minFont: { type: Number, default: 14 },
    maxFont: { type: Number, default: 72 },

    // ⚡ gridSize เล็ก = อุดช่องว่างแน่นขึ้น/เต็มกรอบขึ้น แต่ช้าลงและคำเล็กเบียดกัน
    gridSize: { type: Number, default: 4 },

    // ✅ หมุนคำบางส่วน (แนวตั้ง ±90°) เพื่ออุดช่องว่าง
    disableRotate: { type: Boolean, default: false },
    rotateRatio: { type: Number, default: 0.28 },

    // ✅ ฟอนต์เดียวกันทั้ง 2 cloud
    fontFamily: { type: String, default: "'Sarabun', sans-serif" },
    fontWeight: { type: [String, Number], default: "300" },

    // ✅ สีพื้นหลัง canvas
    backgroundColor: { type: String, default: "#ffffff" },

    // ✅ สีและพารามิเตอร์ blend sentiment
    colorPos: { type: String, default: "#124D1C" },
    colorNeu: { type: String, default: "#FFC107" },
    colorNeg: { type: String, default: "#5E0006" },

    domPow: { type: Number, default: 2.2 },
    negBoost: { type: Number, default: 3.35 },
    neuDampen: { type: Number, default: 1.15 },
    dominanceKick: { type: Number, default: 0.35 },

    satMin: { type: Number, default: 0.35 },
    lightMin: { type: Number, default: 0.34 },
    lightMax: { type: Number, default: 0.56 },

    // ✅ ระยะห่างตัวอักษร (จำลองด้วย hair-space เพราะ wordcloud2.js ไม่มี option ตรงๆ)
    letterSpacing: { type: Number, default: 1 },

    // ✅ คุมว่าบนมือถือ (< lg) ให้โชว์ฝั่งไหน: "word" | "hash"
    activeTab: { type: String, default: "word" },

    // ⚠️ storageKey ไม่ได้ถูกใช้อ้างอิง localStorage แล้ว (เก็บ prop ไว้เผื่อ parent ยังส่งมา
    //    เพื่อไม่ให้ต้องแก้ parent, แต่ค่านี้ไม่มีผลอะไรกับ component นี้อีกต่อไป)
    storageKey: { type: String, default: "default" },

    // ⚡ เมื่อทุกคำ/แท็กมี "ความถี่เท่ากันหมด" (เช่น hashtag ที่นับได้ครั้งละ 1)
    //    ให้ไล่ระดับขนาดฟอนต์แบบปลอม (rank-based) เพื่อให้กระจายเต็มกรอบแทนที่จะกระจุกตัวกลางจอ
    //    เปิดไว้เป็นค่า default เพราะเป็น UX ที่ดีกว่าเสมอในกรณีนี้ ปิดได้ถ้าต้องการขนาดเท่ากันจริงๆ
    equalFreqSpread: { type: Boolean, default: true },
    // ⚡ ความชันของการไล่ระดับตอนความถี่เท่ากันหมด (ยิ่งมาก = มีคำใหญ่น้อยคำ + คำเล็กเยอะ กระจายเต็มกรอบกว่า)
    equalFreqPow: { type: Number, default: 1.8 },
  },

  data() {
    return {
      apiData: null,

      // ✅ wordcloud2.js module (dynamic import กัน SSR พัง)
      _WC: null,
      _wcLoadError: "",

      // ✅ canvas ปัจจุบันของแต่ละฝั่ง (ใช้ตอน destroy/stop)
      _canvasWords: null,
      _canvasTags: null,

      _roWords: null,
      _roTags: null,
      _fallbackResize: null,

      _renderedWords: false,
      _renderedTags: false,

      // ⚡ debounce re-render ตอน container resize
      _resizeTimerWords: null,
      _resizeTimerTags: null,
      _lastRenderWidthWords: 0,
      _lastRenderWidthTags: 0,

      // ⚠️ คำ/แท็กที่ถูกซ่อนไว้ — เก็บใน memory (component state) เท่านั้น ไม่ persist ลง localStorage แล้ว
      //    ผลคือ: ออกจากหน้า (component ถูก destroy) หรือเปลี่ยนช่วงวันที่ (data prop ใหม่เข้ามา) → รายการนี้หายไปเอง
      excludedWords: {},
      excludedTags: {},

      // ⚡ คิวกลาง: บังคับให้วาด words/tags "ทีละก้อน" เท่านั้น
      _renderChain: null,

      // ⚡ generation counter: กันงานวาดที่ค้างคิวอยู่ดันภาพเก่าทับข้อมูลใหม่
      _renderGen: 0, // ต้องเป็นตัวเลข 0 เสมอ — ถ้าหายไปจาก data() ตรงนี้ this._renderGen จะเป็น undefined
      // แล้ว undefined++ = NaN ซึ่งทำให้ (myGen !== this._renderGen) เป็น true ตลอดกาล (NaN !== NaN)
      // และ render pipeline จะ bail ทิ้งทุกครั้งก่อนถึงขั้นตอนสร้าง canvas

      // ⚡ กันโหลดฟอนต์ซ้ำซ้อน: cache ผลลัพธ์ของ ensureFontLoaded ต่อ "text signature" ที่เคยโหลดแล้ว
      _fontReadySignature: "",

      popup: {
        show: false,
        pinned: false,
        kind: "",
        x: 0,
        y: 0,
        name: "",
        total: 0,
        pos: 0,
        neu: 0,
        neg: 0,
        word: null,
        total_post: 0,
      },
    };
  },

  computed: {
    // ✅ ยังไม่มีข้อมูลเลย vs มีแล้วแต่ว่างเปล่า ใช้แยกข้อความ "ไม่พบข้อมูล"
    hasLoaded() {
      return this.apiData !== null && this.apiData !== undefined;
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
    chartAspectStyle() {
      return { aspectRatio: `${this.fixedWidth} / ${this.fixedHeight}` };
    },
    excludedWordsCount() {
      return Object.keys(this.excludedWords).length;
    },
    excludedTagsCount() {
      return Object.keys(this.excludedTags).length;
    },
    popupHideLabel() {
      return this.popup.kind === "tags" ? "ซ่อนแท็กนี้" : "ซ่อนคำนี้";
    },
  },

  watch: {
    // ✅ จุดเดียวที่รับข้อมูลเข้ามา — parent เปลี่ยน prop data เมื่อไหร่ ก็วาดใหม่ทันที
    data: {
      immediate: true,
      handler(val) {
        this._renderGen = (Number(this._renderGen) || 0) + 1; // กัน NaN ถ้า _renderGen หลุดหายจาก data()
        this.apiData = (val !== undefined) ? val : null;

        // ⚠️ ทุกครั้งที่ parent ส่ง data ก้อนใหม่เข้ามา (เช่นตอนเปลี่ยนช่วงวันที่แล้วยิง API รอบใหม่)
        //    ให้เคลียร์รายการคำ/แท็กที่เคยซ่อนไว้ทิ้งทั้งหมด เพราะไม่ persist ข้ามช่วงข้อมูลแล้ว
        this.excludedWords = {};
        this.excludedTags = {};

        if (this.apiData === null) {
          this.clearClouds();
        } else {
          this.renderBoth();
        }
      },
    },
    activeTab() {
      this.$nextTick(() => {
        const kind = this.activeTab === "hash" ? "tags" : "words";
        this._renderedWords = this._renderedWords || kind === "words";
        this._renderedTags = this._renderedTags || kind === "tags";
        this.renderKind(kind);
      });
    },
    fixedWidth() {
      this.renderBoth();
    },
    fixedHeight() {
      this.renderBoth();
    },
    rotateRatio() {
      this.renderBoth();
    },
    disableRotate() {
      this.renderBoth();
    },
    gridSize() {
      this.renderBoth();
    },
    letterSpacing() {
      this.renderBoth();
    },
  },

  created() {
    // ⚡ เริ่มโหลด stylesheet ของฟอนต์ให้เร็วที่สุดเท่าที่ทำได้ (ก่อน mounted/render ด้วยซ้ำ)
    //    ยิงแบบ fire-and-forget ตรงนี้ เพื่อให้พอถึงตอน renderKind() เรียก ensureFontLoaded()
    //    ไฟล์ CSS ส่วนใหญ่น่าจะโหลดมาถึง browser แล้ว ลดโอกาสที่ canvas จะวาดด้วย fallback font
    if (typeof document !== "undefined") {
      ensureFontStylesheetLoaded(WC_FONT_HREF).catch(() => { });
    }
  },

  mounted() {
    // ⚠️ ไม่ต้อง loadExcluded() จาก localStorage อีกต่อไป — excludedWords/excludedTags เริ่มต้นเป็น {} เสมอ
    //    (ดู data() ด้านบน) ทุกครั้งที่ component ถูก mount ใหม่ (เช่น กลับเข้าหน้านี้อีกครั้ง)
    if (this.data !== null && this.data !== undefined) {
      this.apiData = this.data;
      this.renderBoth();
    }

    this._closePopupOutside = (e) => {
      if (!this.popup.show) return;
      if (e && e.target && e.target.closest && e.target.closest(".wc-word-popup")) return;
      this.closePopup();
    };
    this._closePopupOnEsc = (e) => {
      if (e.key === "Escape") this.closePopup();
    };
    this._closePopupOnResize = () => this.closePopup();

    document.addEventListener("click", this._closePopupOutside);
    document.addEventListener("scroll", this._closePopupOutside, true);
    document.addEventListener("keydown", this._closePopupOnEsc);
    window.addEventListener("resize", this._closePopupOnResize);

    this.$nextTick(() => {
      const w1 = this.$refs.chartWrapWords;
      const w2 = this.$refs.chartWrapTags;

      // ⚡ ResizeObserver: (1) จับจังหวะกล่องมีขนาดจริงครั้งแรก (2) re-render เมื่อ "ความกว้างเปลี่ยนจริง"
      const onResizeWords = () => {
        if (!(w1 && w1.clientWidth > 50 && w1.clientHeight > 50)) return;
        if (!this._renderedWords) {
          this._renderedWords = true;
          this.renderKind("words");
          return;
        }
        const wNow = w1.clientWidth;
        if (Math.abs(wNow - this._lastRenderWidthWords) < 24) return;
        clearTimeout(this._resizeTimerWords);
        this._resizeTimerWords = setTimeout(() => this.renderKind("words"), 180);
      };
      const onResizeTags = () => {
        if (!(w2 && w2.clientWidth > 50 && w2.clientHeight > 50)) return;
        if (!this._renderedTags) {
          this._renderedTags = true;
          this.renderKind("tags");
          return;
        }
        const wNow = w2.clientWidth;
        if (Math.abs(wNow - this._lastRenderWidthTags) < 24) return;
        clearTimeout(this._resizeTimerTags);
        this._resizeTimerTags = setTimeout(() => this.renderKind("tags"), 180);
      };

      if (window.ResizeObserver) {
        this._roWords = new ResizeObserver(onResizeWords);
        this._roTags = new ResizeObserver(onResizeTags);
        if (w1) this._roWords.observe(w1);
        if (w2) this._roTags.observe(w2);
      } else {
        const debounced = (() => {
          let t = null;
          return () => {
            clearTimeout(t);
            t = setTimeout(() => {
              onResizeWords();
              onResizeTags();
            }, 150);
          };
        })();
        window.addEventListener("resize", debounced);
        this._fallbackResize = debounced;
      }
    });
  },

  beforeDestroy() {
    this.destroyAll();

    try { this._roWords && this._roWords.disconnect(); } catch (e) { }
    try { this._roTags && this._roTags.disconnect(); } catch (e) { }
    if (this._fallbackResize) window.removeEventListener("resize", this._fallbackResize);

    clearTimeout(this._resizeTimerWords);
    clearTimeout(this._resizeTimerTags);

    document.removeEventListener("click", this._closePopupOutside);
    document.removeEventListener("scroll", this._closePopupOutside, true);
    document.removeEventListener("keydown", this._closePopupOnEsc);
    window.removeEventListener("resize", this._closePopupOnResize);

    // ⚠️ กันเหนียว: เคลียร์ในหน่วยความจำทิ้งด้วยตอนออกจากหน้า (แม้ปกติ component instance จะถูกทิ้งไปเองอยู่แล้ว)
    this.excludedWords = {};
    this.excludedTags = {};
  },

  methods: {
    fmt(n) {
      const x = Number(n || 0);
      return x.toLocaleString("th-TH");
    },
    getItemTotalPost(it) {
      const src = it?.__src ?? it ?? {};
      const candidates = [
        src?.total_post,
        src?.totalPost,
        src?.total_posts,
        src?.posts,
        src?.post_count,
        src?.postCount,
        it?.total_post,
        it?.totalPost,
        it?.total_posts,
        it?.posts,
        it?.post_count,
        it?.postCount,
        src?.count?.total_post,
        src?.count?.totalPost,
        src?.count?.total_posts,
        src?.count?.posts,
      ];

      const found = candidates.find((value) => value !== undefined && value !== null && value !== "");
      if (found !== undefined) return Number(found) || 0;

      const { total } = this.getCounts(it);
      return Number(total) || 0;
    },
    clamp(x, a, b) {
      return Math.min(b, Math.max(a, x));
    },

    // ⚡ hash string → เลข ใช้ทำ "ลำดับปลอมแบบ deterministic"
    //    เหตุผลที่ไม่ใช้ Math.random(): ถ้าสุ่มจริง ทุกครั้งที่ re-render (เช่นตอน resize จอ)
    //    ลำดับ/ขนาดของแต่ละคำจะสลับไปมา ทำให้ภาพกระพริบเปลี่ยนหน้าตาเอง
    //    ใช้ hash ของ "ข้อความคำนั้นเอง" แทน จะได้ผลลัพธ์เดิมทุกครั้งตราบใดที่คำเดิม
    _pseudoRank(key) {
      let h = 0;
      const s = String(key || "");
      for (let i = 0; i < s.length; i++) {
        h = (h * 31 + s.charCodeAt(i)) >>> 0;
      }
      return h;
    },

    // ✅ dynamic import wordcloud2.js ครั้งเดียว (กัน SSR: window/document ไม่มีตอน build)
    async ensureWC() {
      if (this._WC) return this._WC;
      if (typeof window === "undefined") return null;
      try {
        const m = await import("wordcloud");
        this._WC = m.default || m;
        this._wcLoadError = "";
      } catch (e) {
        this._WC = null;
        // ✅ เดิมพอ import พังจะเงียบไปเลย ไม่มีอะไรโชว์บนจอ ผู้ใช้เห็นแค่กล่องว่างๆ
        //    ทั้งที่ data มาถึงแล้ว — เก็บ error ไว้โชว์ในกล่องแทน "ไม่พบข้อมูล"
        console.error("[WordCloudD3] โหลด wordcloud module ไม่สำเร็จ:", e);
        this._wcLoadError = "โหลด wordcloud module ไม่สำเร็จ (ตรวจสอบว่าติดตั้ง npm package \"wordcloud\" แล้ว)";
      }
      return this._WC;
    },

    // ✅ โหลดฟอนต์ให้ "พร้อมจริง" ก่อนวาด canvas — แก้ปัญหาโหลดฟอนต์ไม่ทัน 2 จุด:
    //    1) รอ stylesheet ของ Google Fonts โหลดเสร็จจริง (ไม่พึ่ง @import อย่างเดียว)
    //    2) ส่ง sampleText (คำไทยจริงที่กำลังจะวาด) เข้า document.fonts.load() เพราะถ้าไม่ส่ง
    //       browser จะใช้ test-string default ซึ่งอาจโหลดแค่ subset ละติน ไม่ใช่ subset ไทย
    //       ทำให้ check()/load() "ผ่าน" ทั้งที่ตัวอักษรไทยยังไม่มา แล้วก็วาดด้วย fallback font
    async ensureFontLoaded(sampleText) {
      if (typeof document === "undefined") return;

      try {
        await ensureFontStylesheetLoaded(WC_FONT_HREF);
      } catch (e) { }

      if (!document.fonts) return;

      const text =
        (sampleText && String(sampleText).trim()) ||
        "กขคงจฉชซญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ ๅๆ฿0123456789";

      // ⚡ ถ้าโหลด "ชุดคำเดิม" ไปแล้วในรอบก่อนหน้า ไม่ต้องรอซ้ำ (fonts ที่โหลดแล้วจะ resolve ทันทีอยู่แล้ว
      //    แต่เช็ก signature ไว้ช่วยข้ามการเรียก document.fonts.load ที่ไม่จำเป็นได้เร็วขึ้นอีกนิด)
      const weight = String(this.fontWeight || "300").trim();
      const signature = `${weight}::${text}`;
      if (this._fontReadySignature === signature) return;

      try {
        const specs = [
          `${weight} 16px ${this.fontFamily}`,
          `700 16px ${this.fontFamily}`, // ✅ เผื่อ browser fallback ไป bold ตอน weight ที่ขอไม่ตรง
        ];

        const loaders = specs.map((spec) => {
          try {
            return document.fonts.load(spec, text);
          } catch (e) {
            return Promise.resolve([]);
          }
        });

        await Promise.race([
          Promise.all(loaders),
          new Promise((resolve) => setTimeout(resolve, 2500)), // ✅ กันค้างถ้าเน็ต/CDN ฟอนต์ช้า
        ]);

        await Promise.race([
          document.fonts.ready,
          new Promise((resolve) => setTimeout(resolve, 800)),
        ]);

        this._fontReadySignature = signature;
      } catch (e) {
        // ✅ เงียบไว้ — ถ้าฟอนต์โหลดไม่สำเร็จจริงๆ ให้ตกไปใช้ fallback font ของ fontFamily
        //    (เช่น sans-serif) ดีกว่าค้างทั้งหน้าไม่วาดอะไรเลย
      }
    },

    async waitForStableSize(wrapEl, tries = 3) {
      for (let i = 0; i < tries; i++) {
        if (wrapEl && wrapEl.clientWidth > 50 && wrapEl.clientHeight > 50) return true;
        await new Promise((r) => requestAnimationFrame(r));
      }
      return false;
    },

    // ✅ ล้าง canvas ทันที เช่นตอนที่ parent ส่ง data เป็น null (เคลียร์ก่อน fetch รอบใหม่)
    clearClouds() {
      const ew = this.$refs.chartWords;
      const et = this.$refs.chartTags;
      if (ew) ew.innerHTML = "";
      if (et) et.innerHTML = "";
      this._canvasWords = null;
      this._canvasTags = null;
    },

    // -------- build words from list (ให้ size เป็น px แล้ว) --------
    buildWordsFromList(list0, excludedMap) {
      const raw = Array.isArray(list0) ? list0 : [];
      const excluded = excludedMap || {};

      const list = raw
        .filter(Boolean)
        .map((x) => {
          const src = x.__src ?? x;
          const name = x.name ?? x.text ?? x.key ?? src.name ?? src.text ?? src.key ?? "";
          const total = Number(x.total ?? x.value ?? src.total ?? 0);
          const total_post = this.getItemTotalPost(x);
          return { key: String(name).trim(), text: String(name).trim(), value: total, total_post: total_post, __src: src };
        })
        .filter((d) => d.key.length > 0)
        .filter((d) => !excluded[this._normKey(d.key)])
        .sort((a, b) => b.value - a.value)
        .slice(0, Math.max(0, this.limit));

      if (!list.length) return [];

      const values = list.map((d) => Math.max(1, d.value));
      const vMin = Math.min(...values);
      const vMax = Math.max(...values);
      // ⚡ ทุกคำ/แท็กมีค่าเท่ากันหมด (เช่น hashtag ที่นับได้ครั้งละ 1) → scaleLog ปกติจะให้ size
      //    ทุกคำเท่ากันหมด (=minFont) ทำให้ wordcloud2.js วางแบบกระจุกตัวแน่นกลางจอ ไม่เต็มกรอบ
      const allEqual = vMax === vMin;
      const domainMax = allEqual ? vMax + 1 : vMax;

      // ✅ ข้อมูลน้อย → ขยาย font range ให้กินพื้นที่มากขึ้นเล็กน้อย
      const n = list.length;
      const sparseBoost = n <= 5 ? 1.35 : n <= 8 ? 1.25 : n <= 12 ? 1.18 : n <= 20 ? 1.1 : 1;
      const minF = Math.max(8, Math.round(this.minFont * (n <= 12 ? 1.15 : n <= 20 ? 1.05 : 1)));
      const maxF = Math.max(minF + 4, Math.round(this.maxFont * sparseBoost));

      let orderedList = list;
      let getSize;

      if (allEqual && this.equalFreqSpread && n > 1) {
        // ✅ จัดลำดับ "ปลอมแบบ deterministic" ตามคำ/แท็กเอง (ไม่ใช่สุ่มจริง กันภาพกระพริบตอน re-render)
        //    แล้วไล่ระดับขนาดจาก maxF ลงมา minF ด้วย power scale (โค้งลาดชัน)
        //    ผลคือ: มีคำใหญ่ไม่กี่คำอยู่กลาง + คำเล็กจำนวนมากกระจายออกไปเต็มกรอบ
        //    เหมือน hashtagcloud ต้นแบบ แทนที่จะกระจุกตัวเล็กๆ กลางจอเหมือนเดิม
        orderedList = [...list].sort((a, b) => this._pseudoRank(a.key) - this._pseudoRank(b.key));
        const pow = Math.max(1, Number(this.equalFreqPow) || 1.8);
        const scale = d3.scalePow().exponent(pow).domain([0, n - 1]).range([maxF, minF]);
        getSize = (d, i) => scale(i);
      } else {
        const scale = d3.scaleLog().domain([vMin, domainMax]).range([minF, maxF]);
        getSize = (d) => scale(Math.max(1, d.value));
      }

      return orderedList.map((d, i) => ({
        ...d,
        __id: `${d.key}__${i}`,
        size: Math.round(getSize(d, i)),
      }));
    },

    // -------- Sentiment helpers --------
    getCounts(it) {
      const src =
        it?.count ? it
          : it?.__src?.count ? it.__src
            : it?.__src?.__src?.count ? it.__src.__src
              : it || {};
      const c = Array.isArray(src.count) ? src.count : [];
      const pos = (c.find((x) => x.sentiment === 1) || {}).count || 0;
      const neu = (c.find((x) => x.sentiment === 0) || {}).count || 0;
      const neg = (c.find((x) => x.sentiment === -1) || {}).count || 0;
      const total = Number(src.total ?? it?.total ?? it?.value ?? (pos + neu + neg) ?? 0) || 0;
      return { pos, neu, neg, total: total || 1 };
    },

    colorBySentiment(it) {
      const { pos, neu, neg } = this.getCounts(it);
      const sum = (pos + neu + neg) || 1;

      // ✅ สัดส่วน sentiment เริ่มต้น
      let p = pos / sum;
      let u = neu / sum;
      let n = neg / sum;

      // ✅ ทำให้สีเด่นขึ้น แต่ไม่กระชากจนสีดำ/ทึบ
      const pow = Number(this.domPow) || 2.2;
      p = Math.pow(p, pow);
      u = Math.pow(u, pow) / (this.neuDampen || 1);
      n = Math.pow(n, pow) * (this.negBoost || 1);

      const totalW = p + u + n || 1;
      p /= totalW;
      u /= totalW;
      n /= totalW;

      const posCol = d3.hsl(this.colorPos);
      const neuCol = d3.hsl(this.colorNeu);
      const negCol = d3.hsl(this.colorNeg);

      // ✅ ผสม hue แบบ vector เพื่อกันปัญหาสีตัดกันแล้วกลายเป็นตุ่น/ดำ
      const mixHue = (...items) => {
        let x = 0;
        let y = 0;

        items.forEach(([h, w]) => {
          const rad = (Number(h) || 0) * Math.PI / 180;
          x += Math.cos(rad) * w;
          y += Math.sin(rad) * w;
        });

        return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
      };

      const h = mixHue(
        [posCol.h, p],
        [neuCol.h, u],
        [negCol.h, n]
      );

      let s = (posCol.s * p) + (neuCol.s * u) + (negCol.s * n);
      let l = (posCol.l * p) + (neuCol.l * u) + (negCol.l * n);

      // ✅ ถ้า sentiment ฝั่งใดฝั่งหนึ่งชัด ให้ดึงไปทางสีนั้นอย่างนุ่มนวล
      const maxW = Math.max(p, u, n);
      const dom = maxW === p ? posCol : maxW === u ? neuCol : negCol;

      if (maxW > 0.55) {
        const k = this.clamp((maxW - 0.55) * 1.5, 0, this.dominanceKick || 0.35);
        s = s * (1 - k) + dom.s * k;
        l = l * (1 - k) + dom.l * k;
      }

      // ✅ คุม saturation/lightness ให้ภาพรวมดูสว่าง อ่านง่าย และเกลี่ยกันสวย
      s = this.clamp(s, this.satMin, 0.78);
      l = this.clamp(l, this.lightMin, this.lightMax);

      return d3.hsl(h, s, l).formatHex();
    },

    // -------- Letter spacing --------
    spacedText(str) {
      if (!this.letterSpacing || !str) return str;
      const THAI_COMBINING = /[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/;
      const gap = "\u200A".repeat(this.letterSpacing);
      const chars = Array.from(str);
      let out = "";
      for (let i = 0; i < chars.length; i++) {
        out += chars[i];
        const next = chars[i + 1];
        if (next && !THAI_COMBINING.test(next)) out += gap;
      }
      return out;
    },

    // -------- Render --------
    renderBoth() {
      if (!this.apiData) return;
      this._renderedWords = true;
      this._renderedTags = true;
      this.renderKind("words");
      this.renderKind("tags");
    },

    renderKind(kind) {
      const job = kind === "words"
        ? () => this._doRenderOne({ kind: "words", wrapRef: "chartWrapWords", chartRef: "chartWords", getItems: () => this.wordItems })
        : () => this._doRenderOne({ kind: "tags", wrapRef: "chartWrapTags", chartRef: "chartTags", getItems: () => this.hashtagItems });

      this._renderChain = (this._renderChain || Promise.resolve()).catch(() => { }).then(job);
      return this._renderChain;
    },

    _stopCanvas(kind) {
      const canvas = kind === "words" ? this._canvasWords : this._canvasTags;
      if (canvas && this._WC && typeof this._WC.stop === "function") {
        try { this._WC.stop(); } catch (e) { }
      }
    },

    async _doRenderOne({ kind, wrapRef, chartRef, getItems }) {
      const myGen = Number(this._renderGen) || 0; // กัน NaN — ถ้า _renderGen พังเป็น NaN จะ fallback เป็น 0 แทน

      const WC = await this.ensureWC();
      if (!WC) {
        const host0 = this.$refs[chartRef];
        if (host0) host0.innerHTML = `<div class="wc-empty">${this._wcLoadError || "โหลด wordcloud module ไม่สำเร็จ"}</div>`;
        return;
      }
      if (myGen !== (Number(this._renderGen) || 0)) return;

      this._stopCanvas(kind);

      const host = this.$refs[chartRef];
      const wrap = this.$refs[wrapRef];
      if (!host || !wrap) return;

      await this.waitForStableSize(wrap, 3);

      const list0 = getItems?.() || [];

      // ✅ ส่งคำจริงที่กำลังจะวาด (ไม่ใช่ค่า default) เข้าไปให้ ensureFontLoaded เพื่อบังคับให้
      //    browser โหลด unicode-range subset ภาษาไทยของฟอนต์ ไม่ใช่แค่ subset ละติน
      const sampleTextForFont = list0
        .slice(0, 20)
        .map((x) => x?.name ?? x?.text ?? x?.key ?? "")
        .filter(Boolean)
        .join(" ");
      await this.ensureFontLoaded(sampleTextForFont);
      if (myGen !== (Number(this._renderGen) || 0)) return;

      const excludedMap = kind === "words" ? this.excludedWords : this.excludedTags;
      const raw = this.buildWordsFromList(list0, excludedMap);

      if (!raw.length) {
        host.innerHTML = (this.isLoading || !this.hasLoaded) ? "" : `<div class="wc-empty">ไม่พบข้อมูล</div>`;
        if (kind === "words") this._canvasWords = null; else this._canvasTags = null;
        return;
      }

      const RS = Math.max(1, Number(this.renderScale) || 1);
      const W = this.fixedWidth;
      const H = this.fixedHeight;
      const cw = Math.round(W * RS);
      const ch = Math.round(H * RS);

      const canvas = document.createElement("canvas");
      canvas.width = cw;
      canvas.height = ch;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";

      const colorByText = new Map();
      raw.forEach((w) => colorByText.set(this.spacedText(w.text), this.colorBySentiment(w.__src)));

      const list = raw.map((w) => [this.spacedText(w.text), w.size, w]);

      const gridSize = Math.max(2, Math.round((Number(this.gridSize) || 4) * RS));
      const rr = this.disableRotate ? 0 : this.clamp(Number(this.rotateRatio) || 0, 0, 1);
      const self = this;

      const ellipticity = this.clamp(H / W, 0.2, 1);
      const total = list.length;

      let drawFailed = false;
      await new Promise((resolve) => {
        let settled = false;
        let doneCount = 0;
        let timeoutId = null;

        const finish = () => {
          if (settled) return;
          settled = true;
          canvas.removeEventListener("wordclouddrawn", onDrawn);
          if (timeoutId) clearTimeout(timeoutId);
          resolve();
        };
        const onDrawn = () => {
          doneCount++;
          if (doneCount >= total) finish();
        };

        canvas.addEventListener("wordclouddrawn", onDrawn);
        timeoutId = setTimeout(finish, 4000);

        try {
          WC(canvas, {
            list,
            gridSize,
            weightFactor: (s) => Math.max(1, s * RS),
            fontFamily: this.fontFamily,
            fontWeight: String(this.fontWeight),
            color: (word) => colorByText.get(word) || "#333333",
            backgroundColor: this.backgroundColor,
            rotateRatio: rr,
            rotationSteps: 2,
            minRotation: -Math.PI / 2,
            maxRotation: Math.PI / 2,
            shuffle: false,
            drawOutOfBound: false,
            shrinkToFit: true,
            ellipticity,
            minSize: 4,
            abort: () => {
              doneCount++;
              if (doneCount >= total) finish();
            },
            hover: (item, dimension, event) => {
              if (!item) { self.hideHoverPopup(); return; }
              const d = item[2];
              if (d) self.showHoverPopup(kind, d, event);
            },
            click: (item, dimension, event) => {
              if (!item) return;
              const d = item[2];
              if (!d) return;
              if (event && event.stopPropagation) event.stopPropagation();
              self.pinPopup(kind, d, event);
            },
          });
        } catch (e) {
          drawFailed = true;
          finish();
        }
      });

      if (myGen !== (Number(this._renderGen) || 0)) return;

      if (drawFailed) {
        host.innerHTML = `<div class="wc-empty">วาดไม่สำเร็จ</div>`;
        if (kind === "words") this._canvasWords = null; else this._canvasTags = null;
        return;
      }

      host.innerHTML = "";
      host.appendChild(canvas);

      if (kind === "words") {
        this._canvasWords = canvas;
        this._lastRenderWidthWords = wrap.clientWidth;
      } else {
        this._canvasTags = canvas;
        this._lastRenderWidthTags = wrap.clientWidth;
      }
    },

    destroyAll() {
      this.closePopup();
      try { this._WC && this._WC.stop && this._WC.stop(); } catch (e) { }
      this._renderGen = (Number(this._renderGen) || 0) + 1; // กัน NaN
      this._renderChain = null;
      this._canvasWords = null;
      this._canvasTags = null;
      const ew = this.$refs.chartWords;
      const et = this.$refs.chartTags;
      if (ew) ew.innerHTML = "";
      if (et) et.innerHTML = "";
    },

    // -------- Exclude (in-memory only, no localStorage) --------
    _normKey(text) {
      return String(text || "").trim().toLowerCase();
    },
    excludeItem(kind, d) {
      const key = this._normKey(d.key || d.text);
      if (!key) return;
      const map = kind === "words" ? this.excludedWords : this.excludedTags;
      this.$set(map, key, true);
      this.closePopup();
      this.$emit("exclude", { kind, key, text: d.text, data: d.__src });
      this.renderKind(kind);
    },
    resetExcluded(kind) {
      if (kind === "words") this.excludedWords = {};
      else this.excludedTags = {};
      this.$emit("exclude-reset", { kind });
      this.renderKind(kind);
    },

    // -------- Popup --------
    _fillPopupData(kind, d) {
      const src = d?.__src ?? d ?? {};
      const { pos, neu, neg, total } = this.getCounts(src);
      this.popup.kind = kind;
      this.popup.word = d;
      this.popup.name = d.text;
      this.popup.total = total;
      this.popup.pos = pos;
      this.popup.neu = neu;
      this.popup.neg = neg;
      this.popup.total_post = this.getItemTotalPost(src);
    },
    showHoverPopup(kind, d, event) {
      if (this.popup.pinned) return;
      this._fillPopupData(kind, d);
      this.popup.x = (event && event.clientX) || 0;
      this.popup.y = (event && event.clientY) || 0;
      this.popup.show = true;
      this.$nextTick(this.clampPopupPosition);
    },
    hideHoverPopup() {
      if (this.popup.pinned) return;
      this.closePopup();
    },
    onPopupMouseEnter() { },
    onPopupMouseLeave() {
      if (!this.popup.pinned) this.closePopup();
    },
    pinPopup(kind, d, event) {
      this._fillPopupData(kind, d);
      this.popup.x = (event && event.clientX) || 0;
      this.popup.y = (event && event.clientY) || 0;
      this.popup.show = true;
      this.popup.pinned = true;
      this.$nextTick(this.clampPopupPosition);
    },
    clampPopupPosition() {
      const el = this.$refs.wordPopup;
      if (!el) return;
      const margin = 12;
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let x = this.popup.x;
      let y = this.popup.y;
      if (x + rect.width + margin > vw) x = vw - rect.width - margin;
      if (x < margin) x = margin;
      if (y + rect.height + margin > vh) y = vh - rect.height - margin;
      if (y < margin) y = margin;
      this.popup.x = x;
      this.popup.y = y;
    },
    closePopup() {
      this.popup.show = false;
      this.popup.pinned = false;
      this.popup.word = null;
    },
    popupViewPosts() {
      if (!this.popup.word) return;
      this.$emit("select", {
        kind: this.popup.kind,          // "words" | "tags"
        text: this.popup.word.text,     // ✅ คำ/แฮชแท็กที่แสดงจริง (plain text)
        data: this.popup.word.__src,
      });
      this.closePopup();
    },
    popupHide() {
      if (!this.popup.word || !this.popup.kind) return;
      this.excludeItem(this.popup.kind, this.popup.word);
    },
  },
};
</script>

<style scoped>
.box-domain {
  width: 100%;
  height: auto;
  padding: 20px 3px;
  border-radius: 7px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

@import url("https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap");

.wordcloud-card {
  border-radius: 14px;
  overflow: hidden;
}

.wc-wrap {
  background: #fff;
}

.wc-chart {
  width: 97%;
  overflow: hidden;
  padding: 0;
  position: relative;
  cursor: pointer;
}

.wc-chart-inner {
  width: 97%;
  height: 100%;
}

.wc-chart-inner canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
  object-fit: contain;
}

.wc-empty {
  height: 100%;
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  font-family: "Sarabun", sans-serif;
  font-weight: 200;
}

.wc-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.65);
}

.wc-error-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  text-align: center;
  background: #fff4f2;
  border: 1px solid #ffd6cf;
  color: #b3311c;
  border-radius: 10px;
  padding: 10px 16px;
  margin-bottom: 12px;
  font-family: "Sarabun", sans-serif;
  font-size: 14px;
}

.wc-retry-btn {
  border: 1px solid #b3311c;
  background: #fff;
  color: #b3311c;
  border-radius: 999px;
  padding: 4px 14px;
  font-family: "Sarabun", sans-serif;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.wc-retry-btn:hover {
  background: #b3311c;
  color: #fff;
}

.wc-reset-badge {
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

.wc-word-popup {
  position: fixed;
  z-index: 1050;
  width: 224px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  padding: 12px 14px 14px;
  font-family: "Sarabun", sans-serif;
  transform: translate(-8px, 14px);
}

.wc-word-popup:not(.wc-word-popup-pinned) {
  pointer-events: none;
}

.wc-word-popup-close {
  position: absolute;
  top: 4px;
  right: 6px;
  border: none;
  background: transparent;
  font-size: 18px;
  line-height: 1;
  color: #999;
  cursor: pointer;
  padding: 4px 6px;
}

.wc-word-popup-close:hover {
  color: #333;
}

.wc-word-popup-title {
  font-weight: 600;
  font-size: 15px;
  padding-right: 18px;
  margin-bottom: 8px;
  word-break: break-word;
  line-height: 1.3;
}

.wc-word-popup-stats {
  margin-bottom: 12px;
}

.wc-word-popup-stat-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  padding: 2px 0;
}

.wc-icon {
  font-size: 20px;
  line-height: 1;
  flex: 0 0 auto;
}

.wc-icon-pos {
  color: #5bb44a;
}

.wc-icon-neu {
  color: #fab83d;
}

.wc-icon-neg {
  color: #fa6262;
}

@media (max-width: 768px) {
  .wc-wrap {
    min-height: 260px;
  }
}
</style>