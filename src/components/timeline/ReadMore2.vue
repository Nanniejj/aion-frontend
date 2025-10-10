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
    <button
      v-if="shouldTruncate"
      class="btn btn-link p-0 ml-1 align-baseline small"
      @click="expanded = !expanded"

    >
    <span style="font-size: 13px;color: #17a2b8;">  {{ expanded ? ' ย่อ ' : ' อ่านต่อ ' }}</span>
    </button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Highlighter from "vue-highlight-words";
export default {
    name: 'ReadMoreBox',
  components: { Highlighter },
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
    shouldTruncate() {
      return (this.text || '').length > this.limitToUse;
    },
    displayText() {
      const t = this.text || '';
      if (!this.shouldTruncate) return t;
      return this.expanded ? t : t.slice(0, this.limitToUse) + '…';
    },
    },
    methods: {
        checkOverflow() {
            this.$nextTick(() => {
                const el = this.$refs.textBox;
                this.shouldTruncate = !!(el && el.scrollHeight > el.offsetHeight);
            });
        }
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
        cleanSearchWords() { this.$nextTick(() => this.checkOverflow()); }
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