<template>
  <!-- AI วิเคราะห์วิดีโอ YouTube (field: summarize_youtube) -->
  <div v-if="hasSummary" class="yt-ai-summary text-left">
    <div class="yt-ai-header d-flex align-items-center">
      <span class="yt-ai-badge"><i class="fa fa-magic mr-1" aria-hidden="true"></i>AI วิเคราะห์</span>
      <span class="ml-2 small text-muted">สรุปเนื้อหาวิดีโอ YouTube</span>
    </div>

    <div class="yt-ai-body" :class="{ collapsed: !expanded && isLong }">
      <p v-if="parsed.intro" class="yt-ai-intro mb-2">{{ parsed.intro }}</p>

      <ul v-if="parsed.sections.length" class="yt-ai-list">
        <li v-for="(s, i) in parsed.sections" :key="i">
          <template v-if="s.title">
            <span class="yt-ai-title">{{ s.title }}</span>
            <a v-if="s.start" class="yt-ai-time ml-1" :href="timeLink(s.start)" target="_blank"
              title="เปิดวิดีโอที่ช่วงเวลานี้">
              <i class="fa fa-play-circle" aria-hidden="true"></i>
              {{ s.start }}<span v-if="s.end"> - {{ s.end }}</span>
            </a>
            <div class="yt-ai-detail">{{ s.detail }}</div>
          </template>
          <template v-else>{{ s.detail }}</template>
        </li>
      </ul>
    </div>

    <div v-if="isLong" class="text-right">
      <span class="yt-ai-toggle clickable" @click="expanded = !expanded">
        {{ expanded ? 'ย่อ' : 'อ่านต่อ' }}
        <i :class="expanded ? 'fa fa-angle-up' : 'fa fa-angle-down'" aria-hidden="true"></i>
      </span>
    </div>
  </div>
</template>

<script>
const TIME = "(\\d{1,2}:\\d{2}(?::\\d{2})?)";
// "หัวข้อ (0:00-3:39): รายละเอียด"
const SECTION_RE = new RegExp("^(.+?)\\s*\\(\\s*" + TIME + "\\s*[-–]\\s*" + TIME + "\\s*\\)\\s*[:：]\\s*(.*)$");
// "หัวข้อ (0:00): รายละเอียด"
const SECTION_SINGLE_RE = new RegExp("^(.+?)\\s*\\(\\s*" + TIME + "\\s*\\)\\s*[:：]\\s*(.*)$");

export default {
  name: "YoutubeSummary",
  props: {
    post: { type: Object, default: () => ({}) },
    // ความยาวตัวอักษรที่เกินแล้วจะยุบเป็น "อ่านต่อ"
    limit: { type: Number, default: 250 },
  },
  data() {
    return { expanded: false };
  },
  computed: {
    summaryText() {
      const p = this.post || {};
      if (p.source !== "youtube") return "";
      if (p.summarize_youtube_status === false) return "";
      const t = p.summarize_youtube;
      return typeof t === "string" ? t.trim() : "";
    },
    hasSummary() {
      return !!this.summaryText;
    },
    isLong() {
      return this.summaryText.length > this.limit;
    },
    parsed() {
      const lines = this.summaryText
        .split(/\r?\n/)
        .map((l) => l.replace(/^\s*[-•*]\s*/, "").trim())
        .filter(Boolean);
      const sections = [];
      let intro = "";
      lines.forEach((line, i) => {
        let m = line.match(SECTION_RE);
        if (m) return sections.push({ title: m[1].trim(), start: m[2], end: m[3], detail: m[4].trim() });
        m = line.match(SECTION_SINGLE_RE);
        if (m) return sections.push({ title: m[1].trim(), start: m[2], end: "", detail: m[3].trim() });
        if (i === 0) intro = line;
        else sections.push({ title: "", detail: line });
      });
      return { intro, sections };
    },
  },
  watch: {
    "post._id"() {
      this.expanded = false;
    },
  },
  methods: {
    toSeconds(ts) {
      return String(ts)
        .split(":")
        .map(Number)
        .reduce((acc, n) => acc * 60 + (isNaN(n) ? 0 : n), 0);
    },
    timeLink(ts) {
      const url = (this.post && (this.post.url_post || this.post.uid)) || "";
      if (!url) return null;
      const sep = url.includes("?") ? "&" : "?";
      return `${url}${sep}t=${this.toSeconds(ts)}s`;
    },
  },
};
</script>

<style scoped>
.yt-ai-summary {
  margin: 8px 0 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: linear-gradient(135deg, #f3f8fb 0%, #f7f4fc 100%);
  border: 1px solid #dfe8ef;
  border-left: 4px solid #17a2b8;
  font-size: 14px;
  color: #2c3e50;
}
.yt-ai-header {
  margin-bottom: 6px;
}
.yt-ai-badge {
  display: inline-flex;
  align-items: center;
  padding: 1px 10px;
  border-radius: 20px;
  background: #17a2b8;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}
.yt-ai-body {
  line-height: 1.6;
  white-space: normal;
  word-break: break-word;
}
.yt-ai-body.collapsed {
  max-height: 7.5em;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to bottom, #000 60%, transparent);
  mask-image: linear-gradient(to bottom, #000 60%, transparent);
}
.yt-ai-intro {
  font-weight: 500;
}
.yt-ai-list {
  padding-left: 18px;
  margin-bottom: 0;
}
.yt-ai-list li {
  margin-bottom: 6px;
}
.yt-ai-title {
  font-weight: 700;
}
.yt-ai-time {
  display: inline-block;
  font-size: 12px;
  padding: 0 6px;
  border-radius: 10px;
  background: #ffe5e5;
  color: #c4302b !important;
  text-decoration: none;
}
.yt-ai-time:hover {
  background: #ffd0d0;
}
.yt-ai-detail {
  color: #44546a;
}
.yt-ai-toggle {
  font-size: 13px;
  font-weight: 600;
  color: #1b97a6;
  cursor: pointer;
}
</style>
