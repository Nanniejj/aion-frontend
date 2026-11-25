<template>
  <div
    :style="{ maxHeight, overflowY: 'auto' }"
    class="mb-1 text-left pb-2"
  >
    <Highlighter
      class="my-highlight"
      :style="{ textAlign:'left', fontSize:'15px', lineHeight:'1.5' }"
      highlightClassName="highlight2"
      :searchWords="cleanSearchWords"
      :autoEscape="false"
      :textToHighlight="safeText"
    />
  </div>
</template>

<script>
import Highlighter from "vue-highlight-words";
import { mapGetters } from "vuex";
export default {
  name: "ScrollText",
  components: { Highlighter },
  props: {
    text: { type: String, default: "" },
    maxHeight: { type: String, default: "140px" },
    searchWords: { type: Array, default: () => [] },
  },
  computed: {
    ...mapGetters(["getSearchWords"]),
    cleanSearchWords() {
      const arr = Array.isArray(this.getSearchWords) ? this.getSearchWords : [];
      // คำค้นเป็น "วลี" ได้ (เว้นวรรคไม่ใช่ AND แล้ว) — แปลงเป็น regex ที่ยอมให้ช่องว่างในเนื้อหาต่างจากที่พิมพ์
      // (เว้นวรรคหลายตัว / ขึ้นบรรทัด / non-breaking space / zero-width space) และ escape อักขระพิเศษเอง
      // ใช้คู่กับ :autoEscape="false"
      return arr.filter(Boolean).map(s => String(s).trim()).filter(Boolean).map(s =>
        s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "[\\s\\u200b]+")
      );
    },
    safeText() {
      return String(this.text || "");
    },
  },
};
</script>

<style scoped>
.highlight2 {
  background-color: #f7dca2;
  border-radius: 2px;
  padding: 0 2px;
}
</style>
