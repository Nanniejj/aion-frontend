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
      :autoEscape="true"
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
      return arr.filter(Boolean).map(String);
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
