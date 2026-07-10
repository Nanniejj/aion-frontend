<template>
  <div class="detail-page">
    <div class="detail-topbar">
      <button class="back-btn" @click="$emit('close')">
        <b-icon icon="arrow-left"></b-icon>
        กลับไปที่รายการโปรเจกต์
      </button>
      <div class="topbar-id">
        <b-icon icon="fingerprint"></b-icon>
        _id: {{ shortId(project._id.$oid) }}
      </div>
    </div>

    <div class="detail-body">
      <div class="d-flex justify-content-between align-items-start flex-wrap mb-4" style="gap: 16px">
        <h1 class="detail-title">{{ project.projectname }}</h1>
        <div class="d-flex flex-wrap" style="gap: 8px">
          <span class="mion-chip lg" :class="project.mion ? 'mion-on' : 'mion-off'">
            <b-icon :icon="project.mion ? 'toggle-on' : 'toggle-off'"></b-icon>
            Mion: {{ project.mion ? "เปิดใช้งาน" : "ปิดใช้งาน" }}
          </span>
          <span class="meta-chip">
            <b-icon icon="clock"></b-icon>
            อัปเดตล่าสุด {{ formatDate(project.updatedAt.$date) }}
          </span>
        </div>
      </div>

      <!-- Custom CSS grid instead of Bootstrap's row/col/g-3 (g-3 is a
           Bootstrap 5 class and does nothing on Bootstrap 4, which is what
           BootstrapVue ships — that's why the cards had no gap at all). -->
      <div class="sections-grid">
        <!-- ผู้ใช้ที่ดูแล: laid out on its own since it needs avatar + two text lines per row -->
        <div class="grid-col">
          <div class="section-card">
            <div class="section-head">
              <b-icon icon="people" class="icon"></b-icon>
              ผู้ใช้ที่ดูแล
              <span class="count">({{ detailUsers.length }})</span>
            </div>
            <div v-if="detailUsers.length === 0" class="section-empty">ยังไม่มีผู้ใช้ที่ผูกกับโปรเจกต์นี้</div>
            <div
              v-for="(u, idx) in detailUsers"
              :key="u.id"
              class="d-flex align-items-center mb-3"
              style="gap: 10px"
            >
              <AvatarStack :users="[u]" large :start-index="idx" />
              <div>
                <div class="user-name">{{ u.name }}</div>
                <div class="user-role">{{ u.role }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Every other field group renders from one generic template, driven by `sections` -->
        <div v-for="s in sections" :key="s.title" class="grid-col" :class="{ 'grid-col-full': s.full }">
          <div class="section-card">
            <div class="section-head">
              <b-icon :icon="s.icon" class="icon"></b-icon>
              {{ s.title }}
              <span class="count">({{ sectionCount(s) }})</span>
            </div>

            <div v-if="sectionCount(s) === 0" class="section-empty">{{ s.emptyText }}</div>

            <template v-else>
              <!-- pill tags: domains / hashtags / groups -->
              <div v-if="s.type === 'tags'">
                <span v-for="item in s.items" :key="item" class="pill-tag" :style="tagStyle(s.color)">
                  {{ item }}
                </span>
              </div>

              <!-- plain rows: targets -->
              <div v-else-if="s.type === 'list'">
                <div v-for="item in s.items" :key="item" class="target-row">{{ item }}</div>
              </div>

              <!-- rows with a leading icon: hot issues -->
              <div v-else-if="s.type === 'hotissue'">
                <div v-for="item in s.items" :key="item" class="hotissue-row">
                  <b-icon icon="fire" font-scale="0.85"></b-icon>
                  <span>{{ item }}</span>
                </div>
              </div>

              <!-- one-line count summary: avatarlist -->
              <div v-else-if="s.type === 'count'" class="count-note">{{ s.label }}</div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AvatarStack from "./AvatarStack.vue";
import {
  oids,
  shortId,
  formatDate,
  USER_LOOKUP,
  DOMAIN_LOOKUP,
  HASHTAG_LOOKUP,
  TARGET_LOOKUP,
  HOTISSUE_LOOKUP,
  GROUP_LOOKUP,
} from "./mock.js";

export default {
  name: "ProjectDetail",
  components: { AvatarStack },
  props: {
    project: { type: Object, required: true },
  },
  computed: {
    detailUsers() {
      return oids(this.project.userlist)
        .map((id) => ({ id, ...USER_LOOKUP[id] }))
        .filter((u) => u.name);
    },
    // Every field group below except "users" is rendered by one generic
    // template (see `type` in the template). Add a field group here and
    // it appears on the page — no new component needed.
    sections() {
      const p = this.project;
      return [
        {
          type: "count",
          icon: "image",
          title: "อวตาร / บัญชีเฝ้าระวัง",
          count: p.avatarlist.length,
          label: `ผูกบัญชีอวตารไว้ ${p.avatarlist.length} บัญชี`,
          emptyText: "ยังไม่มีการผูกบัญชีอวตาร",
        },
        {
          type: "tags",
          icon: "globe2",
          title: "โดเมนที่ติดตาม",
          color: "#5457D6",
          items: oids(p.domainlist).map((id) => DOMAIN_LOOKUP[id]).filter(Boolean),
          emptyText: "ยังไม่มีโดเมนที่ติดตาม",
        },
        {
          type: "tags",
          icon: "hash",
          title: "แฮชแท็กที่ติดตาม",
          color: "#128189",
          items: oids(p.hashtaglist).map((id) => HASHTAG_LOOKUP[id]).filter(Boolean),
          emptyText: "ยังไม่มีแฮชแท็กที่ติดตาม",
        },
        {
          type: "list",
          icon: "bullseye",
          title: "เป้าหมายที่เฝ้าระวัง",
          items: oids(p.targetlist).map((id) => TARGET_LOOKUP[id]).filter(Boolean),
          emptyText: "ยังไม่มีเป้าหมายที่กำหนด",
        },
        {
          type: "tags",
          icon: "people-fill",
          title: "กลุ่มที่เกี่ยวข้อง",
          color: "#C74A63",
          items: oids(p.group_list).map((id) => GROUP_LOOKUP[id]).filter(Boolean),
          emptyText: "ยังไม่มีกลุ่มที่เชื่อมโยง",
        },
        {
          type: "hotissue",
          icon: "fire",
          title: "ประเด็นร้อน",
          items: oids(p.hotissue_list).map((id) => HOTISSUE_LOOKUP[id]).filter(Boolean),
          emptyText: "ยังไม่มีประเด็นร้อนที่ตรวจพบ",
          full: true,
        },
      ];
    },
  },
  methods: {
    shortId,
    formatDate,
    sectionCount(s) {
      return s.type === "count" ? s.count : s.items.length;
    },
    tagStyle(color) {
      return { background: `${color}17`, color, border: `1px solid ${color}30` };
    },
  },
};
</script>

<style scoped>
/*
  Self-contained styling (with var(--token, fallback) on every color) so
  this page renders correctly even without the shared theme.css loaded.
*/

.detail-page {
  position: fixed;
  inset: 0;
  overflow-y: auto;
  background: var(--bg, #f6f5f0);
  z-index: 50;
}

.detail-topbar {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 28px;
  background: var(--bg, #f6f5f0);
  border-bottom: 1px solid var(--border, #e4e1d8);
  z-index: 1;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 13px;
  background: var(--surface, #ffffff);
  border: 1px solid var(--border, #e4e1d8);
  color: var(--text, #1c1e24);
  cursor: pointer;
  flex-shrink: 0;
}
.back-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(18, 129, 137, 0.2);
}

.topbar-id {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 11px;
  color: var(--muted, #6b7280);
}

.detail-body {
  max-width: 880px;
  margin: 0 auto;
  padding: 28px 24px 64px;
}

.detail-title {
  font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  font-weight: 700;
  font-size: 30px;
  color: var(--text, #1c1e24);
  margin: 0;
  text-align: left;
}

.mion-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 12.5px;
  font-weight: 500;
  white-space: nowrap;
}
.mion-on {
  background: rgba(18, 129, 137, 0.12);
  color: var(--teal, #128189);
}
.mion-off {
  background: rgba(107, 114, 128, 0.12);
  color: var(--muted, #6b7280);
}

.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 12.5px;
  background: var(--surface, #ffffff);
  border: 1px solid var(--border, #e4e1d8);
  color: var(--muted, #6b7280);
}

/* Section grid: two columns on wider screens, stacks to one on narrow ones */
.sections-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.grid-col-full {
  grid-column: 1 / -1;
}
@media (max-width: 640px) {
  .sections-grid {
    grid-template-columns: 1fr;
  }
}

.section-card {
  text-align: left;
  border: 1px solid var(--border, #e4e1d8);
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(28, 30, 36, 0.04);
  padding: 20px;
  height: 100%;
  background: var(--surface, #ffffff);
  box-sizing: border-box;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text, #1c1e24);
}
.section-head .icon {
  color: var(--teal, #128189);
}
.section-head .count {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 11px;
  color: var(--muted, #6b7280);
  font-weight: 400;
}

.section-empty {
  font-size: 12.5px;
  color: var(--muted-soft, #9aa0ac);
  font-style: italic;
}

.count-note {
  font-size: 13px;
  color: var(--text, #1c1e24);
}

.user-name {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text, #1c1e24);
}
.user-role {
  font-size: 11.5px;
  color: var(--muted, #6b7280);
}

.pill-tag {
  display: inline-block;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  margin: 0 6px 6px 0;
}

.target-row {
  border-radius: 8px;
  padding: 8px 12px;
  background: var(--bg, #f6f5f0);
  border: 1px solid var(--border, #e4e1d8);
  font-size: 12.5px;
  color: var(--text, #1c1e24);
  margin-bottom: 6px;
}

.hotissue-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12.5px;
  color: var(--text, #1c1e24);
  margin-bottom: 6px;
}
.hotissue-row svg {
  margin-top: 2px;
  flex-shrink: 0;
  color: var(--amber, #c1791f);
}
</style>