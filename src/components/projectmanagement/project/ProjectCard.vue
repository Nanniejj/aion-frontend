<template>
  <div class="folder-card" @click="$emit('open', project)">
    <!-- Folder tab: sits above the body with the same color, forming one silhouette -->
    <div class="folder-tab" :style="{ background: theme.grad, borderColor: theme.border }"></div>

    <div class="folder-body" :style="{ background: theme.grad, borderColor: theme.border }">
      <div class="folder-top">
        <div class="folder-title" :title="project.projectname">{{ project.projectname }}</div>

        <div class="folder-top-right">
          <span v-if="(project.hotissue_list || []).length" class="hotissue-dot" v-b-tooltip.hover
            :title="`ประเด็นร้อน ${(project.hotissue_list || []).length} รายการ`"></span>
          <span class="status-badge" :class="project.status === 'active' ? 'status-active' : 'status-inactive'"
            v-b-tooltip.hover :title="project.status === 'active' ? 'โปรเจกต์เปิดใช้งาน' : 'โปรเจกต์ปิดใช้งาน'">
            <span class="status-dot"></span>
            {{ project.status === 'active' ? 'ใช้งานอยู่' : 'ปิดใช้งาน' }}
          </span>

        </div>
      </div>

      <!-- Stats: users / domains / hashtags / targets -->
      <div class="stats-row">
        <span class="stat-chip users" v-b-tooltip.hover :title="`ผู้ใช้ที่ดูแล ${(project.userlist || []).length} คน`">
          <b-icon icon="people-fill"></b-icon>{{ (project.userlist || []).length }} บัญชีผู้ใช้
        </span>
        <span class="stat-chip domains" v-b-tooltip.hover
          :title="`โดเมนที่ติดตาม ${(project.domainlist || []).length} รายการ`">
          <b-icon icon="globe2"></b-icon>{{ (project.domainlist || []).length }} หัวเรื่อง
        </span>
      </div>
      <div class="updated-note" v-b-tooltip.hover :title="'สร้างเมื่อ ' + formatDate(project.createdAt)">
        <b-icon icon="clock"></b-icon>
        {{ formatDate(project.createdAt) }}
      </div>
      <div class="folder-bottom">
        <AvatarStack :users="cardUsers" :max="5" />

        <div class="bottom-right">
          <!-- <div class="updated-note" v-b-tooltip.hover :title="'สร้างเมื่อ ' + formatDate(project.createdAt)">
            <b-icon icon="clock"></b-icon>
            สร้างเมื่อ {{ formatDate(project.createdAt) }}
          </div> -->
          <button type="button" class="edit-btn" @click.stop="onEdit" v-b-tooltip.hover title="แก้ไขโปรเจกต์">
            <b-icon icon="pencil"></b-icon>
            แก้ไข
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AvatarStack from "../AvatarStack.vue";

const THEMES = [{ grad: "linear-gradient(135deg, #d2e2e3, #e8dff6)", border: "#e8dff6" }];

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default {
  name: "ProjectCard",
  components: { AvatarStack },
  props: {
    project: { type: Object, required: true },
  },
  data() {
    return {
      menuOpen: false,
    };
  },
  computed: {
    theme() {
      const oid = (this.project._id && this.project._id) || this.project._id || "";
      return THEMES[hashCode(String(oid)) % THEMES.length];
    },
    cardUsers() {
      // userlist items are the full user objects the API embeds directly
      // (no separate lookup needed, unlike the old mock.js ID+lookup flow).
      return (this.project.userlist || []).map((u) => ({
        id: u._id,
        name: [u.name, u.lastname].filter(Boolean).join(" ").trim() || u.username || u.email || "",
        role: u.role || "user",
      }));
    },
    totalItems() {
      const p = this.project;
      return (
        (p.domainlist || []).length +
        (p.hashtaglist || []).length +
        (p.targetlist || []).length +
        (p.group_list || []).length +
        (p.hotissue_list || []).length
      );
    },
  },
  methods: {
    // Edit/close are just emitted here — this card is presentational and
    // doesn't call the API itself. The parent (ProjectMain/ProjectManagement)
    // is responsible for opening an edit form / confirming and dispatching
    // the actual updateProject call.
    onEdit() {
      this.menuOpen = false;
      this.$emit("edit", this.project);
    },
    // "ปิดโปรเจกต์" sets mion: false for this project (a soft
    // deactivate, not a real delete) — parent should confirm, then call
    // updateProject with { ...project fields, mion: false }.
    onClose() {
      this.menuOpen = false;
      this.$emit("close", this.project);
    },
    formatDate(dateStr) {
      if (!dateStr) return "ไม่ระบุ";
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "ไม่ระบุ";

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const year = date.getFullYear();

      const hours = String(date.getHours()).padStart(2, '0'); // 24-hour format
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;

      return `${day}/${month}/${year} เวลา ${formattedTime} น.`;
    },
  },
};
</script>

<style scoped>
/*
  Self-contained: no dependency on b-card, Bootstrap grid, or theme.css.
  Fallback values on var(--token, fallback) everywhere.
*/

.folder-card {
  position: relative;
  margin-top: 14px;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), filter 0.2s ease;
}

.folder-card:hover {
  transform: translateY(-3px);
  filter: brightness(1.01);
}

.folder-card:hover .folder-body {
  box-shadow: 0 14px 8px 0px rgba(70, 60, 100, 0.28), 0 2px 6px rgba(28, 30, 36, 0.08);
}

.folder-card:hover .edit-btn {
  box-shadow: 0 2px 6px rgba(18, 129, 137, 0.18);
}

.folder-tab {
  position: absolute;
  top: -14px;
  left: 0px;
  width: 102px;
  height: 18px;
  border: 1px solid;
  border-bottom: none;
  border-radius: 10px 10px 0 0;
}

.folder-body {
  position: relative;
  overflow: hidden;
  border: 1px solid;
  border-radius: 4px 16px 16px 16px;
  padding: 16px;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 8px 6px 0px rgba(70, 60, 100, 0.22), 0 1px 3px rgba(28, 30, 36, 0.08);
  transition: box-shadow 0.2s ease;
}

.folder-body::before {
  content: "";
  position: absolute;
  top: -40px;
  right: -40px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0) 70%);
  pointer-events: none;
}

.folder-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.folder-title {
  position: relative;
  font-weight: 600;
  font-size: 18.5px;
  /* letter-spacing: -0.01em; */
  color: #0e5157;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.folder-top-right {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.hotissue-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--amber, #c1791f);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  line-height: 1.4;
  background: #cce2e4;
  border: 1px solid #c0d5d7;
  box-shadow: 0 2px 0px rgba(131, 162, 168, 0.349);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-active {
  color: #0e5157;
}

.status-active .status-dot {
  background: #128189;
  box-shadow: 0 0 0 3px rgba(18, 129, 137, 0.16);
}

.status-inactive {
  color: rgba(28, 30, 36, 0.55);
}

.status-inactive .status-dot {
  background: rgba(28, 30, 36, 0.35);
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  padding: 5px 5px;
  border: 1px solid rgba(28, 30, 36, 0.08);
  border-radius: 8px;
  background: #fff4de;
  color: #5a3f04;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(28, 30, 36, 0.06);
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
}

.edit-btn:hover {
  background: #fed16e;
  /* border-color: #5a3f04; */
  color: #5a3f04;
}

.stats-row {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 12px 0;
}

.stat-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex: 1 1 calc(50% - 3px);
  min-width: 0;
  box-sizing: border-box;
  border-radius: 7px;
  padding: 3px 8px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(28, 30, 36, 0.06);
  font-size: 16px;
  font-weight: 500;
  color: rgba(28, 30, 36, 0.75);
  box-shadow: 0 1px 2px rgba(28, 30, 36, 0.04);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-chip .b-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.stat-chip.users .b-icon {
  color: #0e5157;
}

.stat-chip.domains .b-icon {
  color: #6b4fa0;
}

.folder-bottom {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
}

.bottom-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.item-count {
  font-size: 16px;
  color: rgba(28, 30, 36, 0.55);
  white-space: nowrap;
}

.updated-note {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: rgb(108, 74, 126);
  white-space: nowrap;
}
</style>