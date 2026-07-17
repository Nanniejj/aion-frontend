<template>
  <div class="folder-card" @click="$emit('open', project)">
    <!-- Folder tab: sits above the body with the same color, forming one silhouette -->
    <div class="folder-tab" :style="{ background: theme.grad, borderColor: theme.border }"></div>

    <div class="folder-body" :style="{ background: theme.grad, borderColor: theme.border }">
      <div class="folder-top">
        <div class="folder-title" :title="project.projectname">{{ project.projectname }}</div>

        <div class="folder-top-right">
          <span
            v-if="(project.hotissue_list || []).length"
            class="hotissue-dot"
            v-b-tooltip.hover
            :title="`ประเด็นร้อน ${(project.hotissue_list || []).length} รายการ`"
          ></span>
          <span
            class="mion-dot"
            :class="project.mion ? 'mion-on' : 'mion-off'"
            v-b-tooltip.hover
            :title="project.mion ? 'เปิดใช้งาน Mion' : 'ปิดใช้งาน Mion'"
          ></span>
          <button class="folder-menu" @click.stop title="ตัวเลือกเพิ่มเติม">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </button>
        </div>
      </div>

      <!-- Stats: users / domains / hashtags / targets -->
      <div class="stats-row">
        <span class="stat-chip" v-b-tooltip.hover :title="`ผู้ใช้ที่ดูแล ${(project.userlist || []).length} คน`">
          <b-icon icon="people"></b-icon>{{ (project.userlist || []).length }} บัญชีผู้ใช้
        </span>
        <span class="stat-chip" v-b-tooltip.hover :title="`โดเมนที่ติดตาม ${(project.domainlist || []).length} รายการ`">
          <b-icon icon="globe2"></b-icon>{{ (project.domainlist || []).length }} หัวเรื่อง
        </span>
        <!-- <span class="stat-chip" v-b-tooltip.hover :title="`แฮชแท็กที่ติดตาม ${(project.hashtaglist || []).length} รายการ`">
          <b-icon icon="hash"></b-icon>{{ (project.hashtaglist || []).length }}
        </span>
        <span class="stat-chip" v-b-tooltip.hover :title="`เป้าหมายที่เฝ้าระวัง ${(project.targetlist || []).length} รายการ`">
          <b-icon icon="bullseye"></b-icon>{{ (project.targetlist || []).length }}
        </span> -->
      </div>

      <div class="folder-bottom">
        <AvatarStack :users="cardUsers" :max="3" />

        <div class="bottom-right">
          <!-- <div class="item-count" v-b-tooltip.hover title="โดเมน + แฮชแท็ก + เป้าหมาย + กลุ่ม + ประเด็นร้อน">
            {{ totalItems }} items
          </div> -->
          <div class="updated-note" v-b-tooltip.hover :title="'สร้างเมื่อ ' + formatDate(project.createdAt)">
            <b-icon icon="clock"></b-icon>
            สร้างเมื่อ {{ formatDate(project.createdAt) }}
          </div>
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
    formatDate(dateStr) {
            if (!dateStr) return "-";
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return "-";

            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const year = date.getFullYear();

            let hours = date.getHours();
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12; // Convert 0 -> 12
            const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;

            return `${day}/${month}/${year}`;
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
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.folder-card:hover {
  transform: translateY(-2px);
}

.folder-tab {
  position: absolute;
  top: -14px;
  left: 0px;
  width: 102px;
  height: 18px;
  border: 1px solid;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
}

.folder-body {
  position: relative;
  border: 1px solid;
  border-radius: 4px 14px 14px 14px;
  padding: 16px;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 3px 1px 3px rgba(82, 70, 90, 0.254), 0 1px 2px rgba(0, 0, 0, 0.374) !important;
}

.folder-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.folder-title {
  font-weight: 700;
  font-size: 16px;
  color: var(--text, #1c1e24);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.folder-top-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.hotissue-dot,
.mion-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.hotissue-dot {
  background: var(--amber, #c1791f);
}
.mion-on {
  background: var(--teal, #128189);
}
.mion-off {
  background: rgba(28, 30, 36, 0.2);
}

.folder-menu {
  display: flex;
  align-items: center;
  gap: 2px;
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 6px;
  line-height: 0;
}
.folder-menu:hover {
  background: rgba(28, 30, 36, 0.06);
}
.folder-menu .dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(28, 30, 36, 0.45);
  display: inline-block;
}

.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0;
}

.stat-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 7px;
  padding: 2px 7px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(28, 30, 36, 0.08);
  font-size: 14px;
  color: rgba(28, 30, 36, 0.75);
}

.folder-bottom {
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
  font-size: 14px;
  color: rgba(28, 30, 36, 0.55);
  white-space: nowrap;
}

.updated-note {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: rgba(28, 30, 36, 0.45);
  white-space: nowrap;
}
</style>