<template>
  <div class="detail-page">
    <div class="detail-topbar">
      <button class="back-btn" @click="$emit('close')">
        <b-icon icon="arrow-left"></b-icon>
        กลับไปที่รายการโปรเจกต์
      </button>
    </div>

    <div class="detail-body container">
      <!-- Header: just the essentials — name + status. Dates moved into
           the overview tab so this row stays scannable at a glance. -->
      <div class="header-row">
        <div>
          <div class="eyebrow">โปรเจกต์</div>
          <h1 class="detail-title">{{ project.projectname }}</h1>
        </div>
        <span class="mion-chip" :class="project.mion ? 'mion-on' : 'mion-off'">
          <b-icon :icon="project.mion ? 'toggle-on' : 'toggle-off'"></b-icon>
          Mion: {{ project.mion ? "เปิดใช้งาน" : "ปิดใช้งาน" }}
        </span>
      </div>

      <!-- Tabs: separating overview / users / domains means each screen
           only has one job, instead of every list competing for attention
           on one page. -->
      <div class="tab-bar">
        <button class="tab-btn" :class="{ active: tab === 'overview' }" @click="tab = 'overview'">
          ภาพรวม
        </button>
        <button class="tab-btn" :class="{ active: tab === 'users' }" @click="tab = 'users'">
          ผู้ใช้ <span class="tab-count">{{ detailUsers.length }}</span>
        </button>
        <button class="tab-btn" :class="{ active: tab === 'domains' }" @click="tab = 'domains'">
          โดเมน <span class="tab-count">{{ domainItems.length }}</span>
        </button>
      </div>

      <!-- ภาพรวม -->
      <div v-if="tab === 'overview'" class="tab-panel">
        <div class="stats-row">
          <div class="stat-box">
            <div class="stat-icon stat-icon-blue"><b-icon icon="people-fill"></b-icon></div>
            <div>
              <div class="stat-value">{{ typeof project.userCount === "number" ? project.userCount : detailUsers.length }}</div>
              <div class="stat-label">ผู้ใช้ที่ดูแล</div>
            </div>
          </div>
          <div class="stat-box">
            <div class="stat-icon stat-icon-purple"><b-icon icon="globe2"></b-icon></div>
            <div>
              <div class="stat-value">{{ typeof project.domainCount === "number" ? project.domainCount : domainItems.length }}</div>
              <div class="stat-label">โดเมนที่ติดตาม</div>
            </div>
          </div>
        </div>

        <div class="info-card">
          <div class="info-row">
            <span class="info-label"><b-icon icon="calendar-plus"></b-icon> สร้างเมื่อ</span>
            <span class="info-value">{{ createdAtText }}</span>
          </div>
          <div class="info-row">
            <span class="info-label"><b-icon icon="clock"></b-icon> อัปเดตล่าสุด</span>
            <span class="info-value">{{ updatedAtText }}</span>
          </div>
        </div>

        <div class="preview-card" v-if="detailUsers.length">
          <div class="preview-head">
            <span>ผู้ใช้ที่ดูแล</span>
            <button class="preview-link" @click="tab = 'users'">ดูทั้งหมด →</button>
          </div>
          <div class="preview-avatars">
            <AvatarStack :users="detailUsers.slice(0, 8)" />
            <span v-if="detailUsers.length > 8" class="preview-more">+{{ detailUsers.length - 8 }} คน</span>
          </div>
        </div>
      </div>

      <!-- ผู้ใช้ -->
      <div v-else-if="tab === 'users'" class="tab-panel">
        <div class="search-box">
          <b-icon icon="search"></b-icon>
          <input v-model="userQuery" type="text" placeholder="ค้นหาชื่อ, role หรืออีเมล..." />
        </div>

        <div v-if="filteredUsers.length === 0" class="section-empty">
          {{ detailUsers.length === 0 ? "ยังไม่มีผู้ใช้ที่ผูกกับโปรเจกต์นี้" : "ไม่พบผู้ใช้ที่ตรงกับ " + userQuery }}
        </div>
        <div v-else class="list-card">
          <div v-for="(u, idx) in filteredUsers" :key="u.id" class="user-row">
            <AvatarStack :users="[u]" large :start-index="idx" />
            <div class="user-text">
              <div class="user-name">{{ u.name }}</div>
              <div class="user-role">{{ u.role }}<span v-if="u.email"> · {{ u.email }}</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- โดเมน -->
      <div v-else class="tab-panel">
        <div class="search-box">
          <b-icon icon="search"></b-icon>
          <input v-model="domainQuery" type="text" placeholder="ค้นหาชื่อโดเมน..." />
        </div>

        <div v-if="filteredDomains.length === 0" class="section-empty">
          {{ domainItems.length === 0 ? "ยังไม่มีโดเมนที่ติดตาม" : "ไม่พบโดเมนที่ตรงกับ " + domainQuery }}
        </div>
        <div v-else class="domain-grid">
          <div v-for="d in filteredDomains" :key="d.id" class="domain-card">
            <div class="domain-card-top">
              <div class="domain-icon"><b-icon icon="globe2"></b-icon></div>
              <span
                class="status-dot"
                :class="d.display ? 'status-on' : 'status-off'"
                :title="d.display ? 'แสดงผลอยู่' : 'ซ่อนอยู่'"
              ></span>
            </div>
            <div class="domain-name" :title="d.name">{{ d.name }}</div>
            <div v-if="d.permission.length" class="permission-wrap">
              <span v-for="p in d.permission" :key="p" class="permission-chip">
                <b-icon icon="shield-check" font-scale="0.75"></b-icon>
                {{ permissionLabel(p) }}
              </span>
            </div>
            <!-- <div v-else class="permission-none">ไม่มีสิทธิ์พิเศษ</div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AvatarStack from "../AvatarStack.vue";

export default {
  name: "ProjectDetail",
  components: { AvatarStack },
  props: {
    project: { type: Object, required: true },
  },
  data() {
    return {
      tab: "overview",
      userQuery: "",
      domainQuery: "",
    };
  },
  computed: {
    detailUsers() {
      // userlist items are the full user objects the API embeds directly.
      return (this.project.userlist || []).map((u) => {
        const name = [u.name, u.lastname].filter(Boolean).join(" ").trim() || u.username || u.email || "";
        return {
          id: u._id,
          name,
          role: u.role || "user",
          email: u.email || "",
          initial: name ? name.charAt(0).toUpperCase() : "?",
        };
      });
    },
    filteredUsers() {
      const q = this.userQuery.trim().toLowerCase();
      if (!q) return this.detailUsers;
      return this.detailUsers.filter(
        (u) => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    },
    domainItems() {
      // domainlist already holds full domain objects (name/display/id/...),
      // so read the display name straight off each item. `permission` is
      // only present on some domains — normalize to [] when missing.
      return (this.project.domainlist || [])
        .filter((d) => d && d.name)
        .map((d) => ({
          id: d._id || d.id,
          name: d.name,
          display: d.display !== false,
          permission: Array.isArray(d.permission) ? d.permission : [],
        }));
    },
    filteredDomains() {
      const q = this.domainQuery.trim().toLowerCase();
      if (!q) return this.domainItems;
      return this.domainItems.filter((d) => d.name.toLowerCase().includes(q));
    },
    createdAtText() {
      return this.formatDate(this.project.createdAt);
    },
    updatedAtText() {
      return this.formatDate(this.project.updatedAt);
    },
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return "-";
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "-";
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
    shortId(id) {
      if (!id) return "";
      const str = String(id);
      return str.length <= 8 ? str : str.slice(0, 8);
    },
    permissionLabel(key) {
      const labels = {
        hottopics: "ประเด็นร้อน",
        face: "ตรวจจับใบหน้า",
        suggestionkeyword: "คำแนะนำคำค้น",
      };
      return labels[key] || key;
    },
  },
};
</script>

<style scoped>
/*
  Self-contained styling (colors hard-coded directly, no CSS variables) so
  this page renders correctly even without the shared theme.css loaded.
*/

.detail-page {
  position: fixed;
  inset: 0;
  overflow-y: auto;
  background: #f6f5f0;
  z-index: 50;
}

.detail-topbar {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 28px;
  background: rgba(246, 245, 240, 0.9);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid #e4e1d8;
  z-index: 2;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 14px;
  background: #ffffff;
  border: 1px solid #e4e1d8;
  color: #1c1e24;
  cursor: pointer;
  flex-shrink: 0;
  transition: border-color 0.15s ease;
}
.back-btn:hover {
  border-color: #128189;
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
  font-size: 14px;
  color: #6b7280;
  cursor: default;
}

.detail-body {
  /* max-width: 760px; */
  margin: 0 auto;
  padding: 32px 24px 64px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Header */
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
}

.eyebrow {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #128189;
  margin-bottom: 4px;
}

.detail-title {
  font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  font-weight: 700;
  font-size: 32px;
  color: #1c1e24;
  margin: 0;
  text-align: left;
  line-height: 1.15;
}

.mion-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 7px 14px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}
.mion-on {
  background: rgba(18, 129, 137, 0.12);
  color: #128189;
}
.mion-off {
  background: rgba(107, 114, 128, 0.12);
  color: #6b7280;
}

/* Tabs */
.tab-bar {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #e4e1d8;
}
.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 10px 4px;
  margin-right: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
}
.tab-btn:hover {
  color: #1c1e24;
}
.tab-btn.active {
  color: #128189;
  border-bottom-color: #128189;
}
.tab-count {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 12px;
  color: inherit;
  opacity: 0.75;
}

.tab-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Quick stat boxes: userCount / domainCount straight from the API */
.stats-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.stat-box {
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid #e4e1d8;
  border-radius: 16px;
  background: #ffffff;
  padding: 18px 20px;
  text-align: left;
  box-shadow: 0 1px 2px rgba(28, 30, 36, 0.04);
}
.stat-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
.stat-icon-blue {
  background: rgba(84, 87, 214, 0.12);
  color: #5457d6;
}
.stat-icon-purple {
  background: rgba(199, 74, 99, 0.12);
  color: #c74a63;
}
.stat-value {
  font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  font-weight: 700;
  font-size: 26px;
  color: #1c1e24;
  line-height: 1.2;
}
.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-top: 2px;
}

/* Overview: key/value info card */
.info-card {
  border: 1px solid #e4e1d8;
  border-radius: 16px;
  background: #ffffff;
  padding: 4px 20px;
}
.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #f2f0e9;
}
.info-row:last-child {
  border-bottom: none;
}
.info-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
  flex-shrink: 0;
}
.info-value {
  font-size: 14px;
  color: #1c1e24;
  font-weight: 500;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.info-value.mono {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-weight: 400;
  font-size: 12.5px;
}

/* Overview: short preview card linking into the full tab */
.preview-card {
  border: 1px solid #e4e1d8;
  border-radius: 16px;
  background: #ffffff;
  padding: 16px 20px;
}
.preview-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 600;
  color: #1c1e24;
  margin-bottom: 12px;
}
.preview-link {
  background: none;
  border: none;
  color: #128189;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
}
.preview-link:hover {
  text-decoration: underline;
}
.preview-avatars {
  display: flex;
  align-items: center;
  gap: 10px;
}
.preview-more {
  font-size: 14px;
  color: #6b7280;
}

/* Search box shared by users/domains tabs */
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e4e1d8;
  border-radius: 10px;
  background: #ffffff;
  padding: 10px 14px;
  color: #9aa0ac;
}
.search-box input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 14px;
  color: #1c1e24;
  background: transparent;
}
.search-box input::placeholder {
  color: #9aa0ac;
}

.section-empty {
  font-size: 14px;
  color: #9aa0ac;
  font-style: italic;
  padding: 24px 4px;
  text-align: center;
}

.list-card {
  border: 1px solid #e4e1d8;
  border-radius: 16px;
  background: #ffffff;
  padding: 4px 20px;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f2f0e9;
}
.user-row:last-child {
  border-bottom: none;
}
.user-text {
  min-width: 0;
}
.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #1c1e24;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: start;
}
.user-role {
  font-size: 14px;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* โดเมน: card grid instead of a plain list */
.domain-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
@media (max-width: 560px) {
  .domain-grid {
    grid-template-columns: 1fr;
  }
}
.domain-card {
  border: 1px solid #e4e1d8;
  border-radius: 14px;
  background: #ffffff;
  padding: 14px 16px;
  box-shadow: 0 1px 2px rgba(28, 30, 36, 0.04);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.domain-card:hover {
  border-color: #cfd7d8;
  box-shadow: 0 2px 8px rgba(28, 30, 36, 0.06);
}
.domain-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.domain-icon {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  background: rgba(84, 87, 214, 0.12);
  color: #5457d6;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-on {
  background: #2fa86a;
}
.status-off {
  background: #d8d4c8;
}
.domain-name {
  font-size: 14px;
  font-weight: 600;
  color: #1c1e24;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 8px;
}
.permission-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.permission-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 14px;
  background: rgba(18, 129, 137, 0.09);
  color: #128189;
  border: 1px solid rgba(18, 129, 137, 0.18);
}
.permission-none {
  font-size: 14px;
  color: #9aa0ac;
  font-style: italic;
}
</style>