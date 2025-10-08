<template>
  <div class="d-inline">
    <div
      :style="{ height: showFull ? 'auto' : maxHeight, overflow: 'hidden' }"
      ref="textBox"
      class="mb-1 text-left d-inline"
    >
      <Highlighter
        class="my-highlight"
        :style="{ textAlign:'left', fontSize:'15px', lineHeight:'1.5' }"
        highlightClassName="highlight2"
        :searchWords="cleanSearchWords"
        :autoEscape="true"
        :textToHighlight="safeTitle"  
      />
    </div>

    <div v-if="isOverflowing" class="text-right pb-3">
      <button @click="toggleShow" class="btn btn-link p-0 text-right">
        <span class="small" style="color:#3d6fa1;">
          {{ showFull ? 'ย่อข้อความ' : 'อ่านเพิ่ม' }}
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Highlighter from "vue-highlight-words";

export default {
  name: "ReadMore",
  components: { Highlighter },
  props: {
    item: { type: Object, required: true },
    maxHeight: { type: String, default: "55px" },
    page:{type: String, default: ""}
  },
  computed: {
    ...mapGetters(["getSearchWords"]),
    cleanSearchWords() {
      const arr = Array.isArray(this.getSearchWords) ? this.getSearchWords : [];
      return arr.filter(Boolean).map(s => String(s));
    },
    safeTitle() {
      // แทน item?.title || ''
      return (this.item && this.item.title) ? String(this.item.title) : "";
    }
  },
  data() {
    return { showFull: false, isOverflowing: false };
  },
  mounted() { this.checkOverflow(); },
  methods: {
    toggleShow() { this.showFull = !this.showFull; },
    checkOverflow() {
      this.$nextTick(() => {
        const el = this.$refs.textBox;
        this.isOverflowing = !!(el && el.scrollHeight > el.offsetHeight);
      });
    }
  },
  watch: {
    item: {
      handler() {
        this.showFull = false;
        this.$nextTick(() => this.checkOverflow());
      },
      deep: true
    },
    cleanSearchWords() { this.$nextTick(() => this.checkOverflow()); }
  }
};
</script>

<style scoped>
/* Vue 2 + vue-loader v15 ใช้ /deep/ หรือ >>> ไม่ใช่ ::v-deep */
 .highlight2 {
  background-color: #f7dca2;
  border-radius: 2px;
  padding: 0 2px;
}
</style>
