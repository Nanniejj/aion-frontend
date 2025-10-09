<template>
  <div class="text-left py-1 pb-3 text-read">
    {{ displayText }}
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
export default {
  name: 'ReadMoreBox',
  props: {
    text: { type: String, required: true },
    limit: { type: Number, default: 280 },        // desktop / จอใหญ่
    mobileLimit: { type: Number, default: 160 },   // จอ ≤ breakpoint
    breakpoint: { type: Number, default: 800 },
  },
  data() {
    return {
      expanded: false,
      viewportWidth: (typeof window !== 'undefined') ? window.innerWidth : 1024,
    };
  },
  computed: {
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
  mounted() {
    // อัปเดตเมื่อหน้าจอเปลี่ยนขนาด
    this._onResize = () => { this.viewportWidth = window.innerWidth; };
    window.addEventListener('resize', this._onResize, { passive: true });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this._onResize);
  },
};
</script>
<style scoped>
@media only screen and (min-width: 0px) and (max-width: 800px) {
.text-read{
  font-size: 15px;
}}
</style>