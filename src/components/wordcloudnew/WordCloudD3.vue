<template>
  <div>

    <!-- ✅ แจ้งเตือนตอนโหลดข้อมูลไม่สำเร็จ — ทั้งกรณี component ยิงเอง หรือ parent ยิงแล้วส่ง externalError ลงมา
         โชว์แทนที่ภาพเก่า เพราะ clearClouds() ล้าง apiData/canvas ทิ้งไปแล้วตอนเริ่ม fetch ใหม่ -->
  
    <div v-if="resolvedError" class="wc-error-banner">
      <i class="fa fa-triangle-exclamation"></i>
      <span>{{ resolvedError }} โปรดลองอีกครั้ง</span>
      <button v-if="usingOwnFetch" type="button" class="wc-retry-btn" @click="loadWordCloud(true)">ลองใหม่</button>
    </div>

    <!-- ✅ 2 cloud ใน 1 component (component ยิง API เอง หรือรับ external data ก็ได้)
         Engine: wordcloud2.js (timdream) — วางคำแบบ grid-based ทำให้ "เต็มกรอบสี่เหลี่ยม"
         ได้ดีกว่า d3-cloud (ซึ่งวางแบบ spiral รอบจุดกลาง จึงเหลือมุมว่างเสมอ) -->
    <div class="">
      <b-row class="mb-1" >
        <!-- WORD CLOUD -->
        <!-- ✅ mobile: โชว์ทีละอันตาม activeTab (word/hash) ด้วย d-none + d-lg-block
             desktop (lg ขึ้นไป): โชว์คู่กันเสมอ ไม่สนใจ activeTab -->
        <b-col lg="6" :class="{ 'd-none': activeTab !== 'word', 'd-lg-block': true }">
          <div class="h-100 w-100 px-2">
            <div class="wc-wrap  box-domain position-relative ">
              <!-- ⚡ chartWords คือ "host div" — เราจะสร้าง <canvas> ยัดเข้าไปข้างในตอน render
                   (wordcloud2.js วาดลง canvas ไม่ใช่ svg) -->
              <div ref="chartWrapWords" class="wc-chart" :style="chartAspectStyle">
                <div ref="chartWords" class="wc-chart-inner"></div>
              </div>

              <div v-if="resolvedIsLoading" class="wc-overlay">
                <div class="text-center">
                  <vue-element-loading :active="resolvedIsLoading" size="50" background-color="rgba(255,255,255,0)"
                    color="#17a2b891" />
                </div>
              </div>
            </div>
          </div>
         
        </b-col>

        <!-- HASHTAG CLOUD -->
        <b-col lg="6" :class="{ 'd-none': activeTab !== 'hash', 'd-lg-block': true }">
          <div class="h-100 w-100 px-2">
            <div class="wc-wrap  box-domain position-relative">
              <div ref="chartWrapTags" class="wc-chart" :style="chartAspectStyle">
                <div ref="chartTags" class="wc-chart-inner"></div>
              </div>

              <div v-if="resolvedIsLoading" class="wc-overlay">
                <div class="text-center">
                  <vue-element-loading :active="resolvedIsLoading" size="50" background-color="rgba(255,255,255,0)"
                    color="#17a2b891" />
                </div>
              </div>
            </div>
          </div>

         
        </b-col>
      </b-row>
    </div>

    <!-- ✅ Popup แสดงข้อมูลคำ/แฮชแท็ก
         - hover = แสดงตัวอย่างชั่วคราว ณ จุดที่เมาส์เข้าคำ (wordcloud2.js hover ยิงตอน enter/leave region เท่านั้น
           จึงไม่กระพริบ แต่ตำแหน่ง popup จะ "ตรึง" ที่จุดที่เมาส์เข้าคำ ไม่วิ่งตามเมาส์เหมือน svg เวอร์ชันเดิม)
         - คลิก = ปักหมุดค้างไว้ พร้อมปุ่มดูโพสต์/ซ่อนคำ
         - position: fixed อิงพิกัด viewport ตรง ๆ ไม่โดน overflow ของกล่องบีบ -->
    <div v-if="popup.show" ref="wordPopup" class="wc-word-popup" :class="{ 'wc-word-popup-pinned': popup.pinned }"
      :style="{ left: popup.x + 'px', top: popup.y + 'px' }" @click.stop @mouseenter="onPopupMouseEnter"
      @mouseleave="onPopupMouseLeave">
      <button v-if="popup.pinned" type="button" class="wc-word-popup-close" @click="closePopup"
        aria-label="ปิด">×</button>

      <div class="wc-word-popup-title">{{ popup.name }}</div>

      <div class="wc-word-popup-stats">
        <div class="wc-word-popup-stat-row">
          <span class="text-muted mr-auto">รวม</span>
          <span class="font-weight-bold">{{ fmt(popup.total) }}</span>
        </div>
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
    <b-col :class="{ 'd-none': activeTab !== 'word', 'd-lg-block': true }">
       <button v-if="excludedWordsCount > 0" type="button" class="wc-reset-badge" @click="resetExcluded('words')">
            ซ่อนไว้ {{ excludedWordsCount }} คำ · เอากลับมา
          </button>
    </b-col>
    <b-col :class="{ 'd-none': activeTab !== 'hash', 'd-lg-block': true }">
       <button v-if="excludedTagsCount > 0" type="button" class="wc-reset-badge" @click="resetExcluded('tags')">
            ซ่อนไว้ {{ excludedTagsCount }} แท็ก · เอากลับมา
          </button>
    </b-col>
  </b-row>
  
</div>
</div>
</template>

<script>
import axios from "axios";
import * as d3 from "d3"; // ✅ ยังใช้ d3 สำหรับ scaleLog + สี (d3.rgb/hsl) เท่านั้น ไม่ใช้ d3-cloud แล้ว

export default {
  name: "WordCloudFull",
  props: {
    token: { type: String, default: "" },

    // ✅ component ยิง API เอง — กำหนดผ่าน prop
    domainId: { type: [String, Number], default: "" },
    start: { type: String, default: "" },
    end: { type: String, default: "" },
    monitor: { type: [String, Boolean], default: "" },

    // ✅ key ของผลลัพธ์ใน apiData
    hashtagsKey: { type: String, default: "hashtags" },
    itemsKey: { type: String, default: "items" },

    minHeight: { type: Number, default: 480 },

    // ⚡ wordcloud2.js วางคำได้เต็มกว่า d3-cloud มาก จึงรับจำนวนคำได้เยอะขึ้นโดยไม่หาย
    limit: { type: Number, default: 80 },

    // ✅ ขนาด "logical" ของภาพ (aspect ratio ของกล่อง) — canvas จริงจะถูกคูณ renderScale เพื่อความคม
    fixedWidth: { type: Number, default: 720 },
    fixedHeight: { type: Number, default: 480 },

    // ✅ ความคมของ canvas: canvas จริง = fixedWidth*renderScale (แล้ว CSS ย่อ/ขยายเต็ม container)
    //    2 = คมบนจอ retina, ไม่ต้อง re-render ตอน container resize (ต่างจาก svg viewBox แต่ผลลัพธ์ใกล้เคียง)
    renderScale: { type: Number, default: 2 },

    // ⚡ ปรับขนาดฟอนต์ให้ "คำเด่น" ไม่ครองจอทั้งหมด (ตรงกับภาพตัวอย่างมากกว่า maxFont 140 ของ d3 เวอร์ชันเดิม)
    minFont: { type: Number, default: 14 },
    maxFont: { type: Number, default: 72 },

    // ⚡ gridSize เล็ก = อุดช่องว่างแน่นขึ้น/เต็มกรอบขึ้น แต่ช้าลงและคำเล็กเบียดกัน
    //    (หน่วยเป็น "logical px" จะถูกคูณ renderScale ให้เป็น canvas px ภายใน)
    gridSize: { type: Number, default: 4 },

    // ✅ หมุนคำบางส่วน (แนวตั้ง ±90°) เพื่ออุดช่องว่าง → เต็มกรอบเหมือนภาพตัวอย่าง
    //    disableRotate = true จะ override ให้ rotateRatio = 0
    disableRotate: { type: Boolean, default: false },
    rotateRatio: { type: Number, default: 0.28 },

    // ✅ ฟอนต์เดียวกันทั้ง 2 cloud
    fontFamily: { type: String, default: "'Sarabun', sans-serif" },
    fontWeight: { type: [String, Number], default: "300" },

    // ✅ สีพื้นหลัง canvas — ตั้งให้ตรงกับสีพื้นของการ์ด (wordcloud2.js เติมสีนี้ก่อนวาด)
    backgroundColor: { type: String, default: "#ffffff" },

    // ✅ สีและพารามิเตอร์ blend sentiment (เหมือน backend lib/sentimentColor.js)
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

    // ✅ ระยะห่างตัวอักษร: wordcloud2.js วาดคำด้วย fillText เป็นก้อนเดียว ไม่มี option
    //    letter-spacing ให้ตรงๆ เลยจำลองด้วยการแทรก hair-space (U+200A) คั่นตัวอักษร
    //    0 = ปิด (ปกติ), 1 = ห่างนิดหน่อย, 2 = ห่างขึ้นอีก ฯลฯ
    letterSpacing: { type: Number, default: 1 },

    // ✅ Optional: parent fetch once and pass down
    externalApiData: { type: [Object, Array], default: null },
    externalLoading: { type: Boolean, default: false },
    externalFetch: { type: Boolean, default: false },
    // ✅ ถ้า parent เป็นคนยิง fetch เอง (external-fetch) แล้วพัง ให้ส่ง message ลงมาทางนี้
    //    เพื่อให้ banner error ด้านล่างโชว์ได้ (ไม่งั้น error ฝั่ง parent จะไม่มีทางเห็นใน component นี้เลย)
    externalError: { type: String, default: "" },

    // ✅ คุมว่าบนมือถือ (< lg) ให้โชว์ฝั่งไหน: "word" | "hash"
    //    ไม่มีผลกับ desktop (lg ขึ้นไปโชว์คู่กันเสมอ ผ่าน d-lg-block)
    activeTab: { type: String, default: "word" },
  },

  data() {
    return {
      isLoading: false,
      hasLoaded: false,
      error: "",
      apiData: null,

      _cancelSource: null,
      _lastFetchKey: "",

      // ✅ wordcloud2.js module (dynamic import กัน SSR พัง)
      _WC: null,

      // ✅ canvas ปัจจุบันของแต่ละฝั่ง (ใช้ตอน destroy/stop)
      _canvasWords: null,
      _canvasTags: null,

      _roWords: null,
      _roTags: null,
      _fallbackResize: null,

      _renderedWords: false,
      _renderedTags: false,

      // ⚡ debounce re-render ตอน container resize (canvas ไม่ scale ฟรีเหมือน svg viewBox)
      _resizeTimerWords: null,
      _resizeTimerTags: null,
      _lastRenderWidthWords: 0,
      _lastRenderWidthTags: 0,

      excludedWords: {},
      excludedTags: {},

      // ⚡ คิวกลาง: บังคับให้วาด words/tags "ทีละก้อน" เท่านั้น
      //    wordcloud2.js ใช้ flag "stopped" ระดับ module เดียว (ไม่แยกต่อ canvas)
      //    ถ้าปล่อยให้วาด 2 ฝั่งพร้อมกัน (เช่นตอน resize ที่ ResizeObserver ยิงทั้งคู่)
      //    การเรียก stop() ของฝั่งหนึ่งจะไปตัดจบการวาดของอีกฝั่งกลางคัน → canvas ว่างเปล่า
      //    เข้าคิวรอให้ก้อนก่อนหน้า "วาดจบจริง" ก่อน ค่อยเริ่มก้อนถัดไป
      _renderChain: null,

      // ⚡ generation counter: กันงานวาดที่ค้างคิวอยู่ (จากข้อมูล/filter เก่า) ดันภาพเก่า
      //    ทับข้อมูลใหม่หลัง clearClouds() ถูกเรียก (เช่นตอนเปลี่ยน filter/ดึงข้อมูลใหม่)
      //    ทุกครั้งที่ clearClouds() เรียก เลข gen จะขยับ งานวาดที่ถือ gen เก่าจะรู้ตัวว่า
      //    "ล้าสมัยแล้ว" แล้วไม่แตะ DOM
      _renderGen: 0,

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
      },
    };
  },

  computed: {
    usingOwnFetch() {
      return (!this.externalFetch) && (this.externalApiData === null || this.externalApiData === undefined);
    },
    resolvedIsLoading() {
      return this.externalLoading ? this.externalLoading : this.isLoading;
    },
    // ✅ error ที่โชว์จริง — ของตัวเอง (usingOwnFetch) หรือที่ parent ส่งมาทาง externalError
    resolvedError() {
      return this.usingOwnFetch ? this.error : this.externalError;
    },
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
    apiData() {
      this.renderBoth();
    },
    externalApiData: {
      immediate: true,
      handler(val) {
        if (val !== null && val !== undefined) {
          // ⚠️ parent ส่ง data ก้อนใหม่ลงมา (เช่นเปลี่ยนช่วงวันที่แล้วยิง API รอบใหม่) → เคลียร์คำที่เคยซ่อนไว้ทิ้ง
          this.excludedWords = {};
          this.excludedTags = {};
          this.apiData = val;
          this.renderBoth();
        }
      },
    },
    // ✅ พอสลับแท็บบนมือถือ (word <-> hash) column ที่เพิ่งโผล่จาก d-none -> block
    //    อาจมีขนาด 0 ตอน mounted ครั้งแรก (ยังไม่เคยถูกวาด) หรือบาง browser ไม่ fire ResizeObserver
    //    ตอน display:none -> block ทันที เลย re-render กันเหนียวไว้ตรงนี้
    activeTab() {
      this.$nextTick(() => {
        const kind = this.activeTab === "hash" ? "tags" : "words";
        this._renderedWords = this._renderedWords || kind === "words";
        this._renderedTags = this._renderedTags || kind === "tags";
        this.renderKind(kind);
      });
    },
    layoutOversizeIgnored() {}, // no-op kept for template stability
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
    domainId() {
      if (this.usingOwnFetch) this.loadWordCloud(true);
      else {
        // ⚠️ external-fetch: parent เป็นคนยิง API เอง แต่เปลี่ยน domain แล้วต้องเคลียร์คำที่เคยซ่อนไว้ด้วย
        this.excludedWords = {};
        this.excludedTags = {};
        this.apiData = this.externalApiData;
        this.renderBoth();
      }
    },
    start() {
      if (this.usingOwnFetch) this.loadWordCloud(true);
      else {
        this.excludedWords = {};
        this.excludedTags = {};
        this.apiData = this.externalApiData;
        this.renderBoth();
      }
    },
    end() {
      if (this.usingOwnFetch) this.loadWordCloud(true);
      else {
        this.excludedWords = {};
        this.excludedTags = {};
        this.apiData = this.externalApiData;
        this.renderBoth();
      }
    },
    monitor() {
      if (this.usingOwnFetch) this.loadWordCloud(true);
      else {
        this.excludedWords = {};
        this.excludedTags = {};
        this.apiData = this.externalApiData;
        this.renderBoth();
      }
    },
  },

  mounted() {
    // ⚠️ ไม่โหลดคำที่ซ่อนไว้จาก localStorage แล้ว — excludedWords/excludedTags เริ่มต้นเป็น {} เสมอ
    //    (ดู data() ด้านบน) ทุกครั้งที่ component ถูก mount ใหม่ (เช่น กลับเข้าหน้านี้อีกครั้ง) รายการจะว่างเปล่า
    if (this.usingOwnFetch) this.loadWordCloud();
    else {
      this.apiData = this.externalApiData;
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
      //    ต่างจาก svg viewBox — canvas ต้องวาดใหม่ถ้าอยากคมตอน container ขยาย/หด
      //    (debounce + เทียบ width เดิม กันวาดซ้ำถี่ ๆ ระหว่าง drag resize)
      //    ⚡ ยังใช้จับจังหวะตอนสลับแท็บมือถือด้วย: column ที่โผล่จาก d-none -> block
      //    จะมี clientWidth > 50 ครั้งแรก แล้ว onResizeWords/Tags จะ trigger renderKind ให้เอง
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
destroyed() {
    this.destroyAll();
    this.apiData = null;
  },
  beforeDestroy() {
    this.destroyAll();

    if (this._cancelSource) {
      try {
        this._cancelSource.cancel("Component destroyed");
      } catch (e) { }
    }
    try { this._roWords && this._roWords.disconnect(); } catch (e) { }
    try { this._roTags && this._roTags.disconnect(); } catch (e) { }
    if (this._fallbackResize) window.removeEventListener("resize", this._fallbackResize);

    clearTimeout(this._resizeTimerWords);
    clearTimeout(this._resizeTimerTags);

    document.removeEventListener("click", this._closePopupOutside);
    document.removeEventListener("scroll", this._closePopupOutside, true);
    document.removeEventListener("keydown", this._closePopupOnEsc);
    window.removeEventListener("resize", this._closePopupOnResize);

    // ⚠️ กันเหนียว: เคลียร์คำที่ซ่อนไว้ในหน่วยความจำทิ้งตอนออกจากหน้า (ไม่มี localStorage ให้กลับมาอ่านอีกแล้ว)
    this.excludedWords = {};
    this.excludedTags = {};
  },

  methods: {
    fmt(n) {
      const x = Number(n || 0);
      return x.toLocaleString("th-TH");
    },
    clamp(x, a, b) {
      return Math.min(b, Math.max(a, x));
    },

    // ✅ dynamic import wordcloud2.js ครั้งเดียว (กัน SSR: window/document ไม่มีตอน build)
    async ensureWC() {
      if (this._WC) return this._WC;
      if (typeof window === "undefined") return null;
      try {
        const m = await import("wordcloud");
        this._WC = m.default || m;
      } catch (e) {
        this.error = "โหลด wordcloud2.js ไม่สำเร็จ (npm i wordcloud)";
        this._WC = null;
      }
      return this._WC;
    },

    async ensureFontLoaded() {
      if (!document?.fonts) return;
      try {
        const need300 = !document.fonts.check(`300 16px ${this.fontFamily}`);
        const need700 = !document.fonts.check(`700 16px ${this.fontFamily}`);
        if (need300) await document.fonts.load(`300 16px ${this.fontFamily}`);
        if (need700) await document.fonts.load(`700 16px ${this.fontFamily}`);
        if (need300 || need700) await document.fonts.ready;
      } catch (e) { }
    },

    async waitForStableSize(wrapEl, tries = 3) {
      for (let i = 0; i < tries; i++) {
        if (wrapEl && wrapEl.clientWidth > 50 && wrapEl.clientHeight > 50) return true;
        await new Promise((r) => requestAnimationFrame(r));
      }
      return false;
    },

    // ✅ เคลียร์ข้อมูล/ภาพเก่าทิ้งทันที — เรียกตอน "กำลังจะยิง fetch ใหม่จริงๆ" เท่านั้น
    //    (ไม่ใช่ทุกครั้งที่ loadWordCloud ถูกเรียก เพราะบางครั้งแค่ reuse cache เดิม)
    //    ขยับ _renderGen ด้วย เพื่อบอกงานวาดที่ค้างคิวอยู่ว่า "ข้อมูลนี้เก่าแล้ว อย่าดันเข้า DOM"
    clearClouds() {
      this._renderGen++;
      this.error = "";
      this.apiData = null;

      // ⚠️ กำลังจะดึงข้อมูลก้อนใหม่จริงๆ (domain/ช่วงวันที่/monitor เปลี่ยน) → เคลียร์คำ/แท็กที่เคยซ่อนไว้ทิ้งทั้งหมด
      //    เพราะไม่ persist ข้ามช่วงข้อมูลแล้ว (ไม่มี localStorage อีกต่อไป)
      this.excludedWords = {};
      this.excludedTags = {};

      const ew = this.$refs.chartWords;
      const et = this.$refs.chartTags;
      if (ew) ew.innerHTML = "";
      if (et) et.innerHTML = "";
      this._canvasWords = null;
      this._canvasTags = null;
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

      // ✅ กำลังจะยิง fetch ใหม่จริงๆ (filter เปลี่ยน/force) — ล้างข้อมูล+ภาพเก่าทิ้งก่อนเลย
      //    กันเคส error แล้วภาพ/ข้อมูล domain หรือช่วงเวลาเก่าค้างอยู่ทำให้เข้าใจผิดว่าเป็นข้อมูลปัจจุบัน
      this.clearClouds();

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
          err.message || "โหลดข้อมูลไม่สำเร็จ";
        this._lastFetchKey = ""; // ✅ กัน cache key ค้าง เผื่อกด retry ด้วย filter เดิม
      } finally {
        this.isLoading = false;
        this.hasLoaded = true;
      }
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
          return { key: String(name).trim(), text: String(name).trim(), value: total, __src: src };
        })
        .filter((d) => d.key.length > 0)
        .filter((d) => !excluded[this._normKey(d.key)])
        .sort((a, b) => b.value - a.value)
        .slice(0, Math.max(0, this.limit));

      if (!list.length) return [];

      const values = list.map((d) => Math.max(1, d.value));
      const vMin = Math.min(...values);
      const vMax = Math.max(...values);
      const domainMax = vMax === vMin ? vMax + 1 : vMax;

      // ✅ ข้อมูลน้อย → ขยาย font range ให้กินพื้นที่มากขึ้นเล็กน้อย
      const n = list.length;
      const sparseBoost = n <= 5 ? 1.35 : n <= 8 ? 1.25 : n <= 12 ? 1.18 : n <= 20 ? 1.1 : 1;
      const minF = Math.max(8, Math.round(this.minFont * (n <= 12 ? 1.15 : n <= 20 ? 1.05 : 1)));
      const maxF = Math.max(minF + 4, Math.round(this.maxFont * sparseBoost));

      const scale = d3.scaleLog().domain([vMin, domainMax]).range([minF, maxF]);

      return list.map((d, i) => ({
        ...d,
        __id: `${d.key}__${i}`,
        size: Math.round(scale(Math.max(1, d.value))),
      }));
    },

    // -------- Sentiment helpers (เหมือนเดิม) --------
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

      // ✅ ใช้ชื่อ weight ให้ตรงความหมาย: p = positive, u = neutral, n = negative
      //    แล้วผสมสีใน HSL แบบ hue vector เพื่อให้เฉดกลางนุ่ม ไม่กลายเป็นสีดำ/ตุ่นง่าย
      let p = pos / sum;
      let u = neu / sum;
      let n = neg / sum;

      const pow = Number(this.domPow) || 2.2;
      p = Math.pow(p, pow);
      u = Math.pow(u, pow) / (this.neuDampen || 1);
      n = Math.pow(n, pow) * (this.negBoost || 1);

      const totalW = (p + u + n) || 1;
      p /= totalW;
      u /= totalW;
      n /= totalW;

      const posCol = d3.hsl(this.colorPos);
      const neuCol = d3.hsl(this.colorNeu);
      const negCol = d3.hsl(this.colorNeg);

      const mixHue = (...items) => {
        let x = 0;
        let y = 0;

        items.forEach(([h, w]) => {
          const rad = ((Number(h) || 0) * Math.PI) / 180;
          x += Math.cos(rad) * w;
          y += Math.sin(rad) * w;
        });

        return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
      };

      const h = mixHue(
        [posCol.h, p],
        [neuCol.h, u],
        [negCol.h, n]
      );

      let s = (posCol.s * p) + (neuCol.s * u) + (negCol.s * n);
      let l = (posCol.l * p) + (neuCol.l * u) + (negCol.l * n);

      // ✅ ถ้า sentiment ฝั่งใดฝั่งหนึ่งชัดมาก ให้ดึงกลับไปทางสีนั้นนิดเดียว
      //    แต่ไม่กระชากจนสีแข็งเหมือน RGB blend เดิม
      const maxW = Math.max(p, u, n);
      const dom = maxW === p ? posCol : maxW === u ? neuCol : negCol;

      if (this.dominanceKick > 0 && maxW > 0.55) {
        const k = this.clamp((maxW - 0.55) * 1.5, 0, this.dominanceKick);
        s = s * (1 - k) + dom.s * k;
        l = l * (1 - k) + dom.l * k;
      }

      s = this.clamp(s, this.satMin, 0.78);
      l = this.clamp(l, this.lightMin, this.lightMax);

      return d3.hsl(h, s, l).formatHex();
    },

    // -------- Letter spacing --------
    // wordcloud2.js วาดคำเป็น string เดียวด้วย canvas fillText ไม่มี option letter-spacing ให้ตรงๆ
    // เลยจำลองด้วยการแทรก hair-space (U+200A) คั่นตัวอักษร
    // ⚠️ ต้องข้ามการแทรกก่อนสระ/วรรณยุกต์ไทยที่เป็น combining mark (ลอยบน/ล่างพยัญชนะ)
    //    ไม่งั้นสระ/วรรณยุกต์จะหลุดออกจากพยัญชนะที่มันควบอยู่
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

    // ✅ Entry point เดิม (ที่ template/watch/resize/exclude ทั้งหมดเรียกอยู่)
    //    แต่ตอนนี้แค่ "ต่อคิว" เข้า _renderChain แทนที่จะยิงวาดทันที
    //    กันไม่ให้ words/tags วาดพร้อมกันจนไปขัดจังหวะกันเอง (ดูหมายเหตุที่ _renderChain)
    renderKind(kind) {
      const job = kind === "words"
        ? () => this._doRenderOne({ kind: "words", wrapRef: "chartWrapWords", chartRef: "chartWords", getItems: () => this.wordItems })
        : () => this._doRenderOne({ kind: "tags", wrapRef: "chartWrapTags", chartRef: "chartTags", getItems: () => this.hashtagItems });

      // .catch(()=>{}) กันไม่ให้ error ของก้อนก่อนหน้าทำให้คิวทั้งหมดค้าง
      this._renderChain = (this._renderChain || Promise.resolve()).catch(() => {}).then(job);
      return this._renderChain;
    },

    _stopCanvas(kind) {
      const canvas = kind === "words" ? this._canvasWords : this._canvasTags;
      if (canvas && this._WC && typeof this._WC.stop === "function") {
        try { this._WC.stop(); } catch (e) { }
      }
    },

    // ✅ ตัวจริงที่วาด — รันผ่านคิวเสมอ (renderKind เป็นคนเรียก) จึงมั่นใจได้ว่า
    //    ไม่มีการวาด words/tags ทับซ้อนกันในเวลาเดียวกัน
    //    ⚡ วาดแบบ "double-buffer": สร้าง canvas ใหม่แบบยังไม่ต่อเข้า DOM ก่อน วาดจนจบ
    //    แล้วค่อยสลับเข้าไปทีเดียว — ภาพเก่ายังค้างอยู่ระหว่างรอ ไม่มีช่วงจอขาว/กระพริบ
    //    ⚡ เช็ค _renderGen ก่อนแตะ DOM ทุกจุด กันงานวาดที่ค้างคิวจากข้อมูล/filter เก่า
    //    ดันภาพเก่าทับข้อมูลใหม่ที่เพิ่งมาถึง (ดูหมายเหตุที่ clearClouds)
    async _doRenderOne({ kind, wrapRef, chartRef, getItems }) {
      const myGen = this._renderGen;

      const WC = await this.ensureWC();
      if (!WC) return;
      if (myGen !== this._renderGen) return; // ล้าสมัยแล้วระหว่างรอโหลด wordcloud module

      this._stopCanvas(kind);

      const host = this.$refs[chartRef];
      const wrap = this.$refs[wrapRef];
      if (!host || !wrap) return;

      await this.waitForStableSize(wrap, 3);
      await this.ensureFontLoaded();
      if (myGen !== this._renderGen) return; // ล้าสมัยแล้วระหว่างรอ font/ขนาดกล่อง

      const list0 = getItems?.() || [];
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

      // ⚡ canvas ใหม่นี้ "ยังไม่ append เข้า host" — วาดแบบลอยไว้ก่อน (offscreen)
      //    ของเก่าใน host ยังโชว์อยู่ปกติจนกว่าจะวาดเสร็จ
      const canvas = document.createElement("canvas");
      canvas.width = cw;
      canvas.height = ch;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";

      // ⚡ สี sentiment ต้อง lookup ราย "คำ" (wordcloud2 color callback ให้แค่ word string ไม่ให้ metadata)
      //    → precompute เป็น Map<text, color> + Map<text, dataObj>
      //    key ต้องเป็น "ข้อความที่วาดจริง" (หลังแทรก letter-spacing) เพราะ wordcloud2 ส่ง string
      //    ตัวนั้นกลับมาให้ใน color callback ตรงๆ
      const colorByText = new Map();
      raw.forEach((w) => colorByText.set(this.spacedText(w.text), this.colorBySentiment(w.__src)));

      // ✅ list item = [text, fontSizePx, dataObj]  → hover/click callback จะได้ dataObj กลับที่ item[2]
      //    ใช้ spacedText(w.text) เฉพาะตำแหน่งที่ 0 (ตัวที่ถูกวาด) ส่วน dataObj (w) ยังเก็บ w.text เดิมไว้
      //    ให้ popup/ชื่อคำที่โชว์ผู้ใช้ยังสะอาด ไม่มีช่องว่างแปลกๆ ปน
      const list = raw.map((w) => [this.spacedText(w.text), w.size, w]);

      const gridSize = Math.max(2, Math.round((Number(this.gridSize) || 4) * RS));
      const rr = this.disableRotate ? 0 : this.clamp(Number(this.rotateRatio) || 0, 0, 1);
      const self = this;

      // ✅ ellipticity = สัดส่วนแกน y/x ของ "วงรี" ที่ scan วางคำ
      //    ตั้งให้ตรง aspect ของกล่อง (H/W) → วงรีจะแบนตามกรอบ อุดเต็มแนวนอนได้ดีขึ้น
      const ellipticity = this.clamp(H / W, 0.2, 1);
      const total = list.length;

      // ⚡ รอให้วาด "จบจริง" ก่อนสลับเข้า DOM — นับ event 'wordclouddrawn' (คำที่วาดสำเร็จ)
      //    รวมกับ option abort (คำที่ใส่ไม่ได้แม้ shrink แล้ว) ให้ครบเท่าจำนวนคำทั้งหมด
      //    มี timeout กันเหนียว เผื่อ event ไม่ครบ/ค้าง จะได้ไม่บล็อกคิวถาวร
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
            // weightFactor: map "น้ำหนัก" (ที่เราใส่เป็น px logical) → px จริงบน canvas
            weightFactor: (s) => Math.max(1, s * RS),
            fontFamily: this.fontFamily,
            fontWeight: String(this.fontWeight),
            color: (word) => colorByText.get(word) || "#333333",
            backgroundColor: this.backgroundColor,
            rotateRatio: rr,
            rotationSteps: 2,               // ±90° เท่านั้น (แนวตั้ง/แนวนอน)
            minRotation: -Math.PI / 2,
            maxRotation: Math.PI / 2,
            shuffle: false,                 // ผลลัพธ์คงที่ (deterministic) ต่อชุดข้อมูลเดิม
            drawOutOfBound: false,          // ห้ามวาดล้นกรอบ
            shrinkToFit: true,              // ⚡ คำที่ไม่พอดี → "ย่อ" แทนที่จะทิ้ง (กันคำหาย!)
            ellipticity,
            minSize: 4,                     // font เล็กสุด (canvas px) — ต่ำกว่านี้ไม่วาด
            abort: () => {
              // คำที่วางไม่ได้เลย (นับรวมเป็น "จบแล้ว" ของคำนั้น กันคิวค้างรอครบจำนวน)
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
          // เช่น canvas ขนาด 0 / getImageData error → แสดงข้อความแทนการพัง
          drawFailed = true;
          finish();
        }
      });

      if (myGen !== this._renderGen) return; // ล้าสมัยแล้วระหว่างวาด — อย่าดันภาพเก่าเข้า DOM

      if (drawFailed) {
        host.innerHTML = `<div class="wc-empty">วาดไม่สำเร็จ</div>`;
        if (kind === "words") this._canvasWords = null; else this._canvasTags = null;
        return;
      }

      // ✅ วาดเสร็จสมบูรณ์แล้ว — ค่อยสลับภาพเก่า -> ใหม่ทีเดียว ไม่มีช่วงว่าง/กระพริบ
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
      this._renderGen++; // ✅ กันงานวาดค้างคิวพยายามแตะ DOM หลังถูก destroy
      this._renderChain = null; // ✅ เคลียร์คิว กันงานเก่าพยายามวาดใส่ canvas ที่ถูก destroy ไปแล้ว
      this._canvasWords = null;
      this._canvasTags = null;
      const ew = this.$refs.chartWords;
      const et = this.$refs.chartTags;
      if (ew) ew.innerHTML = "";
      if (et) et.innerHTML = "";
    },

    // -------- Exclude --------
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
      try {
        this.$root.$emit("wc-excluded-changed", { domainId: String(this.domainId), kind: kind === "words" ? "words" : "tags", key, source: "img" });
      } catch (e) { }
      this.renderKind(kind);
    },
    resetExcluded(kind) {
      if (kind === "words") this.excludedWords = {};
      else this.excludedTags = {};
      this.$emit("exclude-reset", { kind });
      try {
        this.$root.$emit("wc-excluded-changed", { domainId: String(this.domainId), kind: kind === "words" ? "words" : "tags", source: "img" });
      } catch (e) { }
      this.renderKind(kind);
    },

    // -------- Popup --------
    _fillPopupData(kind, d) {
      const { pos, neu, neg, total } = this.getCounts(d.__src);
      this.popup.kind = kind;
      this.popup.word = d;
      this.popup.name = d.text;
      this.popup.total = total;
      this.popup.pos = pos;
      this.popup.neu = neu;
      this.popup.neg = neg;
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
      this.$emit("select", { kind: this.popup.kind, data: this.popup.word.__src });
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

/* ⚡ canvas ของ wordcloud2.js — ให้เต็มกล่องเสมอ
     object-fit: contain กัน "ตัวอักษรบีบ" ตอนกล่องข้างนอกสัดส่วนไม่ตรงกับ
     fixedWidth/fixedHeight (เช่น จอมือถือที่ min-height ด้านล่างดัน aspect-ratio ให้เพี้ยน)
     — ถ้าไม่ใส่ browser จะ stretch คนละอัตราส่วนต่อแกน ทำให้ฟอนต์แคบ/กว้างผิดปกติ */
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
  /* ⚠️ ไม่ตั้ง min-height ให้ .wc-chart เพราะมันไปชนกับ aspect-ratio (inline style)
     ถ้าตั้งพร้อมกัน กล่องจะเตี้ยกว่าที่สัดส่วนจริงกำหนด ทำให้ canvas ถูก stretch
     ไม่เท่ากันทั้งสองแกน → ตัวอักษรบีบ ให้ aspect-ratio เป็นคนคุมความสูงแต่ผู้เดียว */
  .wc-wrap {
    min-height: 260px;
  }
}
</style>