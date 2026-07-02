<template>
  <div class="text-left py-1 pb-3 text-read">
    <div
      :style="{ height: shouldTruncate ? 'auto' : limit, overflow: 'hidden' }"
      ref="textBox"
      class="mb-1 text-left"
    >
      <Highlighter
        class="my-highlight"
        :style="{ textAlign:'left', fontSize:'15px', lineHeight:'1.5' }"
        highlightClassName="highlight2"
        :searchWords="cleanSearchWords"
        :autoEscape="true"
        :textToHighlight="displayText"  
      />
    </div>
    <!-- {{ displayText }} -->
    <div class="d-flex justify-content-between align-items-center">
      <span class="d-flex align-items-center">
        <span v-if="hasNoThai" class="d-inline-block box-link">
          <TranslateText compact :initial-text="text" :disabled="!!translatedText" @translated="onTranslated" />
        </span>
        <!-- ปุ่มสลับดูข้อความต้นฉบับ/คำแปล — โผล่มาก็ต่อเมื่อแปลแล้วอย่างน้อย 1 ครั้ง -->
        <span v-if="translatedText" class="d-inline-block box-link ml-2" v-b-tooltip.hover
          :title="showTranslated ? 'ดูข้อความต้นฉบับ' : 'ดูคำแปล'" @click="showTranslated = !showTranslated">
          <i class="fa fa-exchange" aria-hidden="true"></i>
          <span style="font-size: 12px;"> {{ showTranslated ? 'ต้นฉบับ' : 'คำแปล' }}</span>
        </span>
      </span>
      <button
        v-if="shouldTruncate"
        class="btn btn-link p-0 ml-1 align-baseline small"
        @click="expanded = !expanded"

      >
      <span style="font-size: 13px;color: #17a2b8;">  {{ expanded ? ' ย่อ ' : ' อ่านต่อ ' }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Highlighter from "vue-highlight-words";
import TranslateText from "../TranslateText.vue";
export default {
    name: 'ReadMoreBox',
  components: { Highlighter, TranslateText },
  props: {
    text: { type: String, required: true },
    limit: { type: Number, default: 280 },        // desktop / จอใหญ่
    mobileLimit: { type: Number, default: 160 },   // จอ ≤ breakpoint
    breakpoint: { type: Number, default: 800 },
  },
  data() {
    return {
      expanded: false,isOverflowing: false,
      viewportWidth: (typeof window !== 'undefined') ? window.innerWidth : 1024,
      // ผลการแปลล่าสุด + สถานะว่ากำลังโชว์คำแปลอยู่หรือต้นฉบับ
      translatedText: "",
      showTranslated: false,
    };
  },
    computed: {
    ...mapGetters(["getSearchWords"]),
    cleanSearchWords() {
      const arr = Array.isArray(this.getSearchWords) ? this.getSearchWords : [];
      return arr.filter(Boolean).map(s => String(s));
    },
    limitToUse() {
      return this.viewportWidth <= this.breakpoint ? this.mobileLimit : this.limit;
    },
    // ข้อความที่จะใช้แสดงจริง — สลับไปมาระหว่างต้นฉบับกับคำแปลตาม showTranslated
    baseText() {
      if (this.showTranslated && this.translatedText) return this.translatedText;
      return this.text || '';
    },
    shouldTruncate() {
      return this.baseText.length > this.limitToUse;
    },
    displayText() {
      const t = this.baseText;
      if (!this.shouldTruncate) return t;
      return this.expanded ? t : t.slice(0, this.limitToUse) + '…';
    },
    // แสดงปุ่มแปลภาษาเฉพาะตอนที่ข้อความไม่มีตัวอักษรไทยปนอยู่เลย
    // (ช่วง unicode ของภาษาไทย U+0E00–U+0E7F)
    hasNoThai() {
      const t = this.text || '';
      return t.trim().length > 0 && !/[\u0E00-\u0E7F]/.test(t);
    },
    },
    methods: {
        checkOverflow() {
            this.$nextTick(() => {
                const el = this.$refs.textBox;
                this.shouldTruncate = !!(el && el.scrollHeight > el.offsetHeight);
            });
        },
        // เรียกตอน TranslateText แปลเสร็จ — เอาผลแปลมาแสดงแทนต้นฉบับทันที
        onTranslated(translated) {
            this.translatedText = translated;
            this.showTranslated = true;
        },
    },
    mounted() {
        // อัปเดตเมื่อหน้าจอเปลี่ยนขนาด
        this._onResize = () => { this.viewportWidth = window.innerWidth; };
        window.addEventListener('resize', this._onResize, { passive: true });
    },
    beforeDestroy() {
    window.removeEventListener('resize', this._onResize);
    },
    watch: {
        cleanSearchWords() { this.$nextTick(() => this.checkOverflow()); },
        // ถ้าข้อความต้นฉบับเปลี่ยน (เช่น การ์ดถูกสลับข้อมูลใหม่) ให้เคลียร์คำแปลเก่าทิ้ง
        // ไม่งั้นจะโชว์คำแปลของข้อความก่อนหน้าค้างอยู่
        text() {
            this.translatedText = "";
            this.showTranslated = false;
        }
    }
};
</script>
<style scoped>
 .highlight2 {
  background-color: #f7dca2;
  border-radius: 2px;
  padding: 0 2px;
}
@media only screen and (min-width: 0px) and (max-width: 800px) {
.text-read{
  font-size: 15px;
}}
</style>