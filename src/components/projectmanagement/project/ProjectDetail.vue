<template>
  <div class="detail-page">
    <div class="detail-topbar">
      <button class="back-btn" @click="$emit('close')">
        <b-icon icon="arrow-left"></b-icon>
        ย้อนกลับ
      </button>
    </div>

    <div class="detail-body container">
      <!-- Header: just the essentials — name + status. Dates moved into
           the overview tab so this row stays scannable at a glance. -->
      <div class="header-row">
        <div>
          <!-- <div class="eyebrow">โปรเจกต์</div> -->
          <h1 class="detail-title">{{ project.projectname }}</h1>
        </div>
        <!-- <label class="status-switch" :class="{ disabled: statusUpdating }">
          <span class="status-switch-label">{{ isProjectActive ? "เปิดใช้งาน" : "ปิดใช้งาน" }}</span>
          <span class="switch-track" :class="{ on: isProjectActive }" @click="toggleProjectStatus">
            <span class="switch-thumb"></span>
          </span>
        </label> -->
        <button type="button" class="edit-btn" @click.stop="onEdit" v-b-tooltip.hover title="แก้ไขโปรเจกต์">
        <b-icon icon="pencil"></b-icon>
        แก้ไขรายละเอียด
      </button>
      </div>

      <!-- Tabs: separating overview / users / domains means each screen
           only has one job, instead of every list competing for attention
           on one page. -->
      <div class="tab-bar">
        <button class="tab-btn" :class="{ active: tab === 'overview' }" @click="tab = 'overview'">
          ภาพรวม
        </button>
        <button class="tab-btn" :class="{ active: tab === 'users' }" @click="tab = 'users'">
          บัญชีผู้ใช้ 
        </button>
        <button class="tab-btn" :class="{ active: tab === 'domains' }" @click="tab = 'domains'">
          โดเมน 
        </button>
        <button class="tab-btn" :class="{ active: tab === 'logs' }" @click="tab = 'logs'">
          ประวัติการใช้งาน
        </button>

      </div>
      

      <!-- ภาพรวม -->
      <div v-if="tab === 'overview'" class="tab-panel">
        <div class="stats-row">
          <div class="stat-box">
            <div class="stat-icon stat-icon-blue"><b-icon icon="people-fill"></b-icon></div>
            <div>
              <div class="stat-value">{{ typeof project.userCount === "number" ? project.userCount : detailUsers.length
                }}</div>
              <div class="stat-label">บัญชีผู้ใช้</div>
            </div>
          </div>
          <div class="stat-box">
            <div class="stat-icon stat-icon-purple"><b-icon icon="globe2"></b-icon></div>
            <div>
              <div class="stat-value">{{ typeof project.domainCount === "number" ? project.domainCount :
                domainItems.length }}</div>
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
            <span>บัญชีผู้ใช้</span>
            <button class="preview-link" @click="tab = 'users'">ดูทั้งหมด →</button>
          </div>
          <div class="preview-avatars">
            <AvatarStack :users="detailUsers" max="15" />
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
              <div class="user-name">{{ u.name || u.username }}</div>
              <div class="user-role">
                {{ u.role || "ไม่ระบุ role" }}
                <span v-if="u.name"> · {{ u.username }}</span>
                <span v-if="u.email"> · {{ u.email }}</span>
              </div>
            </div>
            <div class="ml-auto">{{ u.isActive ? "เปิดใช้งาน" : "ระงับการใช้งาน" }}</div>
          </div>
        </div>
      </div>

      <!-- โดเมน -->
      <div v-else-if="tab === 'domains'" class="tab-panel">
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
              <span class="status-dot" :class="d.display ? 'status-on' : 'status-off'"
                :title="d.display ? 'แสดงผลอยู่' : 'ซ่อนอยู่'"></span>
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

      <!-- ประวัติการใช้งาน -->
      <div v-else class="tab-panel">
        <div class="log-summary-row">
          <div class="log-summary-chip">
            <span class="log-summary-value">{{ auditLogsSummary.total }}</span>
            <span class="log-summary-label">ทั้งหมด</span>
          </div>
          <div class="log-summary-chip is-success">
            <span class="log-summary-value">{{ auditLogsSummary.success }}</span>
            <span class="log-summary-label">สำเร็จ</span>
          </div>
          <div class="log-summary-chip is-failed">
            <span class="log-summary-value">{{ auditLogsSummary.failed }}</span>
            <span class="log-summary-label">ล้มเหลว</span>
          </div>
        </div>

        <div class="log-filters">
          <div class="search-box log-search">
            <b-icon icon="search"></b-icon>
            <input v-model="logFilters.search" type="text" placeholder="ค้นหา action, endpoint, ผู้ใช้..."
              @input="onLogFilterInput" />
          </div>
          <select v-model="logFilters.method" class="log-filter-select" @change="applyLogFilters">
            <option value="">ทุก Method</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>
          <select v-model="logFilters.user_id" class="log-filter-select" @change="applyLogFilters">
            <option value="">ทุกผู้ใช้</option>
            <option v-for="u in detailUsers" :key="u.id" :value="u.id">{{ u.name }}</option>
          </select>

          <!-- <span class="log-filter-divider"></span> -->

          <button type="button" class="log-preset-btn" :class="{ active: logDatePreset === '1' }"
            @click="setLogDateMonths(1, '1')">
            1 เดือน
          </button>
          <button type="button" class="log-preset-btn" :class="{ active: logDatePreset === '3' }"
            @click="setLogDateMonths(3, '3')">
            3 เดือน
          </button>
          <button type="button" class="log-preset-btn" :class="{ active: logDatePreset === '6' }"
            @click="setLogDateMonths(6, '6')">
            6 เดือน
          </button>
          <button type="button" class="log-preset-btn" :class="{ active: logDatePreset === '12' }"
            @click="setLogDateMonths(12, '12')">
            12 เดือน
          </button>
          <button type="button" class="log-preset-btn" :class="{ active: logDatePreset === 'custom' }"
            @click="useCustomLogDate">
            กำหนดเอง
          </button>

          <button v-if="hasActiveLogFilters" type="button" class="log-filter-clear" @click="clearLogFilters">
            <b-icon icon="x-circle"></b-icon> ล้าง
          </button>
          
        </div>

        <div v-if="logDatePreset === 'custom' || (logFilters.startDate && logFilters.endDate)" class="log-date-filters">
          <div v-if="logDatePreset === 'custom'" class="log-date-range">
            <input v-model="logFilters.startDate" type="date" class="log-filter-date" @change="applyLogFilters" />
            <span class="log-filter-sep">ถึง</span>
            <input v-model="logFilters.endDate" type="date" class="log-filter-date" @change="applyLogFilters" />
          </div>
          <span v-else-if="logFilters.startDate && logFilters.endDate" class="log-date-hint">
            {{ formatDate(logFilters.startDate) }} — {{ formatDate(logFilters.endDate) }}
          </span>
        </div>

        <div v-if="loadingAuditLogs" class="section-empty">กำลังโหลด...</div>
        <div v-else-if="auditLogs.length === 0" class="section-empty">
          {{ hasActiveLogFilters ? "ไม่พบประวัติการใช้งานที่ตรงกับตัวกรอง" : "ยังไม่มีประวัติการใช้งาน" }}
        </div>
        <template v-else>
          <b-table :items="logTableItems" :fields="logTableFields" class="log-table" stacked="md" hover responsive
            @row-clicked="onLogRowClicked">
            <template #cell(user)="{ item, index }">
              <div class="log-user-cell">
                <AvatarStack :users="[logAvatarUser(item)]" :start-index="index" />
                <span class="log-user-name">{{ logUserName(item) }}</span>
              </div>
            </template>

            <template #cell(action)="{ item }">
              <div class="log-action-cell">
                <span class="log-action-verb">{{ actionLabel(item.action) }}</span>
                <span v-if="item.errorMessage" class="log-error">{{ item.errorMessage }}</span>
              </div>
            </template>

            <template #cell(status)="{ item }">
              <span class="log-result-pill" :class="item.success ? 'is-ok' : 'is-fail'">
                <b-icon :icon="item.success ? 'check-circle-fill' : 'exclamation-circle-fill'"
                  font-scale="0.8"></b-icon>
                {{ item.success ? "สำเร็จ" : "ล้มเหลว" }}
                <span class="log-status-code">{{ item.statusCode }}</span>
              </span>
            </template>

            <template #cell(method)="{ item }">
              <span class="log-method" :class="'method-' + (item.method || '').toLowerCase()">{{ item.method }}</span>
            </template>

            <template #cell(createdAt)="{ item }">
              <span class="mono">{{ item.createdAtThai || formatDate(item.createdAt) }}</span>
            </template>

            <!-- Bootstrap-vue's built-in row-details: clicking a row (via
                 @row-clicked below) toggles this expanded panel inline,
                 instead of a separate modal. -->
            <template #row-details="{ item }">
              <div class="log-detail-panel">
                <div v-if="item.user" class="log-detail-user">
                  <AvatarStack :users="[logAvatarUser(item)]" large />
                  <div class="log-detail-user-info">
                    <div class="log-detail-user-name">{{ logUserName(item) }}</div>
                    <div class="log-detail-user-meta">
                      <span v-if="item.user.username" class="mono">@{{ item.user.username }}</span>
                      <span v-if="item.user.email"> {{ item.user.email }}</span>
                    </div>
                  </div>
                  <span v-if="item.user.role" class="log-detail-user-role">{{ item.user.role }}</span>
                </div>

                <div v-if="item.errorMessage" class="log-detail-error">
                  <b-icon icon="exclamation-triangle-fill"></b-icon> {{ item.errorMessage }}
                </div>

                <div class="log-detail-meta">
                  <div class="log-detail-field">
                    <b-icon icon="link-45deg" class="log-detail-icon"></b-icon>
                    <div>
                      <span class="log-detail-label">Endpoint</span>
                      <span class="log-detail-value mono">{{ item.endpoint || "-" }}</span>
                    </div>
                  </div>
                  <div class="log-detail-field">
                    <b-icon icon="stopwatch" class="log-detail-icon"></b-icon>
                    <div>
                      <span class="log-detail-label">ระยะเวลา</span>
                      <span class="log-detail-value">{{ item.durationMs != null ? item.durationMs + " ms" : "-" }}</span>
                    </div>
                  </div>
                  <div class="log-detail-field">
                    <b-icon icon="bullseye" class="log-detail-icon"></b-icon>
                    <div>
                      <span class="log-detail-label">Target</span>
                      <span class="log-detail-value">{{ item.targetType || "-" }}<span v-if="item.targetId"
                          class="mono"> · {{ item.targetId }}</span></span>
                    </div>
                  </div>
                  <div class="log-detail-field">
                    <b-icon icon="geo-alt" class="log-detail-icon"></b-icon>
                    <div>
                      <span class="log-detail-label">IP Address</span>
                      <span class="log-detail-value mono">{{ item.ipAddress || "-" }}</span>
                    </div>
                  </div>
                  <div class="log-detail-field log-detail-field-full">
                    <b-icon icon="laptop" class="log-detail-icon"></b-icon>
                    <div>
                      <span class="log-detail-label">User Agent</span>
                      <span class="log-detail-value mono">{{ item.userAgent || "-" }}</span>
                    </div>
                  </div>
                </div>

                <div v-if="item.detail && (item.detail.before || item.detail.after)" class="log-detail-changes">
                  <div class="log-detail-changes-head">
                    <b-icon icon="pencil-square"></b-icon> การเปลี่ยนแปลง
                  </div>

                  <div class="log-diff-row-wrap">
                    <b-row align-v="stretch">
                      <b-col v-if="item.detail.before" :md="item.detail.after ? 6 : 12">
                        <b-card class="log-diff-card is-before" :class="{ 'is-solo': !item.detail.after }" no-body>
                          <template #header>
                            <b-icon icon="x-circle-fill"></b-icon>
                            <span>Before</span>
                            <span class="log-diff-card-sub">ข้อมูลก่อนแก้ไข</span>
                          </template>
                          <b-card-body>
                            <div
                              v-for="(val, key) in item.detail.before"
                              :key="key"
                              class="log-diff-kv"
                              :class="{
                                'is-changed': !Array.isArray(val) && isChangedField(key, item.detail.before, item.detail.after),
                                'is-list': Array.isArray(val),
                              }"
                            >
                              <span class="log-diff-kv-key">{{ key }}</span>
                              <div v-if="Array.isArray(val)" class="log-diff-kv-list">
                                <span v-if="val.length === 0" class="log-diff-kv-val">ว่างเปล่า</span>
                                <span
                                  v-for="(v, i) in val"
                                  :key="i"
                                  class="log-diff-kv-item"
                                  :class="{ 'is-removed': notIn(item.detail.after && item.detail.after[key], v) }"
                                  >{{ v }}</span
                                >
                              </div>
                              <span v-else class="log-diff-kv-val">{{ formatDiffValue(val) }}</span>
                            </div>
                          </b-card-body>
                        </b-card>
                      </b-col>

                      <!-- Connecting line between the two cards: absolutely
                           positioned overlay on desktop (contributes no
                           width to the flex row), normal-flow block on
                           mobile so it naturally falls between the two
                           stacked cards in source order. -->
                      <div v-if="item.detail.before && item.detail.after" class="log-diff-connector d-none d-md-flex">
                        <span class="log-diff-connector-line log-diff-connector-line-top"></span>
                        <span class="log-diff-connector-icon"><b-icon icon="arrow-right" font-scale="0.85"></b-icon></span>
                        <span class="log-diff-connector-line log-diff-connector-line-bottom"></span>
                      </div>
                      <div v-if="item.detail.before && item.detail.after" class="log-diff-connector-mobile d-flex d-md-none">
                        <span class="log-diff-connector-line-h"></span>
                        <span class="log-diff-connector-icon"><b-icon icon="arrow-down" font-scale="0.85"></b-icon></span>
                        <span class="log-diff-connector-line-h"></span>
                      </div>

                      <b-col v-if="item.detail.after" :md="item.detail.before ? 6 : 12">
                        <b-card class="log-diff-card is-after" :class="{ 'is-solo': !item.detail.before }" no-body>
                          <template #header>
                            <b-icon icon="check-circle-fill"></b-icon>
                            <span>After</span>
                            <span class="log-diff-card-sub">ข้อมูลหลังแก้ไข</span>
                          </template>
                          <b-card-body>
                            <div
                              v-for="(val, key) in item.detail.after"
                              :key="key"
                              class="log-diff-kv"
                              :class="{
                                'is-changed': !Array.isArray(val) && isChangedField(key, item.detail.before, item.detail.after),
                                'is-list': Array.isArray(val),
                              }"
                            >
                              <span class="log-diff-kv-key">{{ key }}</span>
                              <div v-if="Array.isArray(val)" class="log-diff-kv-list">
                                <span v-if="val.length === 0" class="log-diff-kv-val">ว่างเปล่า</span>
                                <span
                                  v-for="(v, i) in val"
                                  :key="i"
                                  class="log-diff-kv-item"
                                  :class="{ 'is-added': notIn(item.detail.before && item.detail.before[key], v) }"
                                  >{{ v }}</span
                                >
                              </div>
                              <span v-else class="log-diff-kv-val">{{ formatDiffValue(val) }}</span>
                            </div>
                          </b-card-body>
                        </b-card>
                      </b-col>
                    </b-row>
                  </div>
                </div>
              </div>
            </template>
          </b-table>

          <div class="log-pagination">
            <span class="log-pagination-info">
              หน้า {{ auditLogsPagination.page }} / {{ auditLogsPagination.totalPages }}
              ({{ auditLogsPagination.total }} รายการ)
            </span>
            <div class="log-pagination-btns">
              <button type="button" class="page-btn" :disabled="!auditLogsPagination.hasPreviousPage"
                @click="goToLogPage(auditLogsPagination.page - 1)">
                <b-icon icon="chevron-left"></b-icon>
              </button>
              <button type="button" class="page-btn" :disabled="!auditLogsPagination.hasNextPage"
                @click="goToLogPage(auditLogsPagination.page + 1)">
                <b-icon icon="chevron-right"></b-icon>
              </button>
            </div>
          </div>
        </template>
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
      logFilters: {
        search: "",
        method: "",
        user_id: "",
        startDate: "",
        endDate: "",
      },
      logDatePreset: "",
      logSearchTimer: null,
      localStatus: this.project.status,
      statusUpdating: false,
      expandedLogId: null,
    };
  },
  created() {
    // Default the audit-log date filter to the last 1 month.
    this.setLogDateRangeOnly(1, "1");
  },
  watch: {
    tab(newTab) {
      // Lazy-load: only hit the API once we actually switch into the
      // logs tab, and reload fresh each time it's opened.
      if (newTab === "logs") this.fetchLogs(1);
    },
    "project._id"() {
      // Component instance is reused across different projects — resync
      // the local optimistic-toggle state when that happens.
      this.localStatus = this.project.status;
    },
  },
  computed: {
    detailUsers() {
      // userlist items are the full user objects the API embeds directly.
      return (this.project.userlist || []).map((u) => {
        const name = [u.name, u.lastname].filter(Boolean).join(" ").trim() || u.username || u.email || "";
        return {
          ...u,
          // name,
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
    auditLogs() {
      return this.$store.getters.getAuditLogs;
    },
    logTableFields() {
      return [
        { key: "user", label: "ผู้ใช้" },
        { key: "action", label: "การดำเนินการ" },
        { key: "status", label: "สถานะ" },
        { key: "method", label: "Method" },
        { key: "createdAt", label: "เวลา" },
      ];
    },
    // b-table looks at each item's own `_showDetails` field to decide
    // whether to render the #row-details slot for that row — map it in
    // here instead of mutating the store-owned log objects directly.
    logTableItems() {
      return this.auditLogs.map((log) => ({
        ...log,
        _showDetails: log._id === this.expandedLogId,
      }));
    },
    auditLogsPagination() {
      return this.$store.getters.getAuditLogsPagination;
    },
    auditLogsSummary() {
      return this.$store.getters.getAuditLogsSummary;
    },
    loadingAuditLogs() {
      return this.$store.getters.getLoadingAuditLogs;
    },
    hasActiveLogFilters() {
      const f = this.logFilters;
      // The 1-month date range is the default state, not a user-applied
      // filter — only flag it as "active" once something differs from
      // that default (a different preset, custom dates, or cleared).
      return !!(f.search || f.method || f.user_id || this.logDatePreset !== "1");
    },
    isProjectActive() {
      return this.localStatus === "active";
    },
  },
  methods: {
    onEdit() {
      // this.menuOpen = false;
      this.$emit("edit", this.project);
    },
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
    fetchLogs(page) {
      const f = this.logFilters;
      this.$store.dispatch("getLogs", {
        page: page || 1,
        project_id: this.project._id,
        search: f.search.trim(),
        method: f.method,
        user_id: f.user_id,
        // Native <input type="date"> gives "YYYY-MM-DD" — expand to the
        // start/end of that day to match the API's expected format.
        start_date: f.startDate ? `${f.startDate}T00:00:00` : "",
        end_date: f.endDate ? `${f.endDate}T23:59:59` : "",
      });
    },
    // Search box: debounce so we're not firing a request on every
    // keystroke. Other filters (method/user/date) call applyLogFilters
    // directly on change instead, since those don't need debouncing.
    onLogFilterInput() {
      clearTimeout(this.logSearchTimer);
      this.logSearchTimer = setTimeout(() => this.applyLogFilters(), 400);
    },
    applyLogFilters() {
      this.expandedLogId = null;
      this.fetchLogs(1);
    },
    clearLogFilters() {
      this.logFilters = { search: "", method: "", user_id: "", startDate: "", endDate: "" };
      this.setLogDateRangeOnly(1, "1"); // back to the default 1-month range
      this.expandedLogId = null;
      this.fetchLogs(1);
    },
    goToLogPage(page) {
      if (page < 1 || page > this.auditLogsPagination.totalPages) return;
      this.fetchLogs(page);
    },
    toISODate(d) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    },
    setLogDateRangeOnly(months, key) {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - months);
      this.logFilters.startDate = this.toISODate(start);
      this.logFilters.endDate = this.toISODate(end);
      this.logDatePreset = key;
    },
    setLogDateMonths(months, key) {
      this.setLogDateRangeOnly(months, key);
      this.applyLogFilters();
    },
    useCustomLogDate() {
      this.logDatePreset = "custom";
    },
    clearLogDate() {
      this.logFilters.startDate = "";
      this.logFilters.endDate = "";
      this.logDatePreset = "";
      this.applyLogFilters();
    },
    async toggleProjectStatus() {
      if (this.statusUpdating) return;
      const previous = this.localStatus;
      const next = previous === "active" ? "inactive" : "active";
      this.localStatus = next; // optimistic
      this.statusUpdating = true;
      try {
        const updated = await this.$store.dispatch("updateProject", {
          _id: this.project._id,
          status: next,
        });
        this.localStatus = (updated && updated.status) || next;
        this.$emit("updated", updated);
      } catch (err) {
        console.log(err);
        this.localStatus = previous; // rollback
      } finally {
        this.statusUpdating = false;
      }
    },
    logUserName(log) {
      const u = log.user;
      if (!u) return "ไม่ทราบผู้ใช้";
      return u.fullName || u.name || u.username || "ไม่ทราบผู้ใช้";
    },
    logAvatarUser(log) {
      const name = this.logUserName(log);
      return {
        id: log.user && log.user._id,
        name,
        initial: name ? name.charAt(0).toUpperCase() : "?",
      };
    },
    actionLabel(action) {
      const labels = {
        CREATE_PROJECT: "สร้างโปรเจกต์",
        UPDATE_PROJECT: "แก้ไขโปรเจกต์",
        DELETE_PROJECT: "ลบโปรเจกต์",
        CREATE_USER: "สร้างผู้ใช้",
        UPDATE_USER: "แก้ไขผู้ใช้",
        DELETE_USER: "ลบผู้ใช้",
        CHANGE_PASSWORD: "เปลี่ยนรหัสผ่าน",
        LOGIN: "เข้าสู่ระบบ",
        LOGOUT: "ออกจากระบบ",
        ADD_DOMAIN: "เพิ่มโดเมน",
        REMOVE_DOMAIN: "ลบโดเมน",
      };
      if (labels[action]) return labels[action];
      if (!action) return "ทำรายการ";
      // Fallback: humanize unknown action codes, e.g. "SOME_ACTION" -> "Some action"
      const words = action.toLowerCase().split("_");
      return words.map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w)).join(" ");
    },
    notIn(arr, val) {
      return !Array.isArray(arr) || !arr.includes(val);
    },
    isChangedField(key, before, after) {
      if (!before || !after) return false;
      return JSON.stringify(before[key]) !== JSON.stringify(after[key]);
    },
    formatDiffValue(val) {
      if (val === null || val === undefined) return "ไม่มีค่า";
      if (Array.isArray(val)) {
        if (val.length === 0) return "ว่างเปล่า";
        return val.map((v) => (typeof v === "object" ? JSON.stringify(v) : String(v))).join(", ");
      }
      if (typeof val === "object") return JSON.stringify(val);
      return String(val);
    },
    onLogRowClicked(item) {
      this.expandedLogId = this.expandedLogId === item._id ? null : item._id;
    },
  },
};
</script>

<style scoped>
/*
  Self-contained styling (colors hard-coded directly, no CSS variables) so
  this page renders correctly even without the shared theme.css loaded.
*/
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
  font-weight: 700;
  font-size: 32px;
  color: #1c1e24;
  margin: 0;
  text-align: left;
  line-height: 1.15;
}

.status-switch {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;
}

.status-switch.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.status-switch-label {
  font-size: 14px;
  font-weight: 500;
  color: #1c1e24;
}

.switch-track {
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 999px;
  background: rgba(107, 114, 128, 0.3);
  transition: background 0.15s ease;
  flex-shrink: 0;
}

.switch-track.on {
  background: #128189;
}

.switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(28, 30, 36, 0.25);
  transition: transform 0.15s ease;
}

.switch-track.on .switch-thumb {
  transform: translateX(20px);
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
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  outline: none;
}

.tab-btn:hover {
  color: #128189;
}

.tab-btn.active {
  color: #128189;
  border-bottom-color: #128189;
}

/* Keep a visible focus indicator for keyboard users, without the
   default browser outline box that shows on every click. */
.tab-btn:focus-visible {
  outline: 2px solid #128189;
  outline-offset: 2px;
  border-radius: 4px;
}

.tab-count {
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
  text-align: start;
}

/* ประวัติการใช้งาน (audit log) */
.log-summary-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.log-summary-chip {
  display: flex;
  align-items: baseline;
  gap: 6px;
  border: 1px solid #e4e1d8;
  border-radius: 10px;
  background: #ffffff;
  padding: 8px 14px;
}

.log-summary-value {
  font-size: 18px;
  font-weight: 700;
  color: #1c1e24;
}

.log-summary-label {
  font-size: 13px;
  color: #6b7280;
}

.log-summary-chip.is-success .log-summary-value {
  color: #128189;
}

.log-summary-chip.is-failed .log-summary-value {
  color: #c0392b;
}

.log-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.log-search {
  flex: 1 1 220px;
  min-width: 180px;
  padding: 8px 14px;
}

.log-filter-select,
.log-filter-date {
  border: 1px solid #e4e1d8;
  border-radius: 10px;
  background: #ffffff;
  padding: 8px 10px;
  font-size: 14px;
  color: #1c1e24;
}

.log-filter-sep {
  font-size: 13px;
  color: #9aa0ac;
}

.log-filter-clear {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: none;
  background: transparent;
  color: #c0392b;
  font-size: 13px;
  cursor: pointer;
  padding: 6px 4px;
}

.log-filter-clear:hover {
  text-decoration: underline;
}

.log-filter-divider {
  width: 1px;
  align-self: stretch;
  background: #e4e1d8;
  margin: 2px 2px;
}

/* Medium screens (e.g. iPad Mini ~768px): search/method/user fit on one
   line, but the 5 date-preset buttons only half-fit next to them and
   wrap unevenly. Force them onto their own line instead. */
@media (min-width: 701px) and (max-width: 1180px) {
  .tab-btn {
    margin-right: 3px;
    font-size: 14px;
  }
  .log-filter-divider {
    flex-basis: 100%;
    width: auto;
    height: 0;
    background: none;
    margin: 0;
  }
}

.log-date-filters {
  display: flex;
  align-items: center;
  justify-content: right;
}

.log-preset-btn {
  border: 1px solid #e4e1d8;
  border-radius: 999px;
  background: #ffffff;
  padding: 6px 14px;
  font-size: 13px;
  color: #1c1e24;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
}

.log-preset-btn:hover {
  border-color: #128189;
  color: #128189;
}

.log-preset-btn.active {
  background: #128189;
  border-color: #128189;
  color: #ffffff;
}

.log-date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.log-date-hint {
  font-size: 13px;
  color: #6b7280;
}

.log-table.table {
  border: 1px solid #e4e1d8;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 0;
}

.log-table thead th {
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 12px 16px;
  border-bottom: 1px solid #e4e1d8;
  background: #f6f5f0;
  /* white-space: nowrap; */
  vertical-align: middle;
}

.log-table thead th.text-right {
  text-align: right;
}

.log-table tbody td {
  padding: 12px 16px;
  font-size: 14px;
  color: #1c1e24;
  border-top: 1px solid #f0eee6;
  vertical-align: middle;
}

.log-table tbody tr {
  cursor: pointer;
}

.log-table.table-hover tbody tr:hover {
  background: rgba(18, 129, 137, 0.06);
}

.log-table td.text-right {
  text-align: right;
}

.log-table td.mono,
.log-table .mono {
  font-size: 12.5px;
  color: #6b7280;
  /* white-space: nowrap; */
}

.log-detail-panel {
  padding: 16px 20px;
  background: #fafaf8;
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: left;
}

.log-detail-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid #e4e1d8;
}
.log-detail-user-info {
  min-width: 0;
}
.log-detail-user-name {
  font-size: 15px;
  font-weight: 700;
  color: #1c1e24;
}
.log-detail-user-meta {
  font-size: 12.5px;
  color: #6b7280;
  overflow-wrap: anywhere;
}
.log-detail-user-role {
  margin-left: auto;
  flex-shrink: 0;
  align-self: flex-start;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #128189;
  background: rgba(18, 129, 137, 0.1);
  border-radius: 999px;
  padding: 4px 10px;
}

.log-user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.log-user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1c1e24;
  white-space: nowrap;
}

.log-action-cell {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.log-action-verb {
  font-size: 14px;
  color: #1c1e24;
}

.log-error {
  font-size: 12px;
  color: #c0392b;
}

.log-result-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.log-result-pill.is-ok {
  background: rgba(18, 129, 137, 0.12);
  color: #128189;
}

.log-result-pill.is-fail {
  background: rgba(192, 57, 43, 0.12);
  color: #c0392b;
}

.log-status-code {
  font-weight: 600;
  color: inherit;
  opacity: 0.85;
}

.log-method {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 5px;
  background: rgba(28, 30, 36, 0.06);
  color: #6b7280;
  white-space: nowrap;
}

.log-method.method-get {
  background: rgba(18, 129, 137, 0.12);
  color: #128189;
}

.log-method.method-post {
  background: rgba(63, 131, 248, 0.12);
  color: #3f83f8;
}

.log-method.method-put,
.log-method.method-patch {
  background: rgba(193, 121, 31, 0.12);
  color: #c1791f;
}

.log-method.method-delete {
  background: rgba(192, 57, 43, 0.12);
  color: #c0392b;
}

/* Below md, b-table's `stacked="md"` prop switches the table into a
   label/value card list — style that mode to match the card look used
   elsewhere in this app instead of leaving it as bootstrap's bare default. */
@media (max-width: 767px) {
  .detail-body {
  /* max-width: 760px; */
   
    padding: 20px 20px 20px;
   
  }
  .tab-btn {
    margin-right: 3px;
    font-size: 14px;
  }
  .log-detail-user-meta {
    overflow-wrap: unset;
  }
  .log-table.b-table-stacked-md {
    border: none;
    background: transparent;
    box-shadow: none;
  }
  .log-table.b-table-stacked-md thead {
    display: none;
  }

  .log-table.b-table-stacked-md tbody tr:not(.b-table-details) {
    display: block;
    background: #ffffff;
    border: 1px solid #e4e1d8;
    border-radius: 14px;
    margin-bottom: 12px;
    padding: 4px 14px;
    overflow: hidden;
  }
  /* A row with an expanded detail panel right after it: flatten the
     bottom edge so the two merge into one continuous card. */
  .log-table.b-table-stacked-md tbody tr:not(.b-table-details):has(+ .b-table-details) {
    border-radius: 14px 14px 0 0;
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 8px;
  }

  .log-table.b-table-stacked-md td {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 0;
    border-top: none;
    border-bottom: 1px solid #f2f0e9;
    text-align: left;
  }
  .log-table.b-table-stacked-md td:last-child {
    border-bottom: none;
  }
  .log-table.b-table-stacked-md td::before {
    content: attr(data-label);
    font-size: 12px;
    font-weight: 600;
    color: #9aa0ac;
    flex-shrink: 0;
    margin-right: 12px;
  }

  /* The expanded row-details row: continue the card below the row it
     belongs to, rounded only at the bottom. */
  .log-table.b-table-stacked-md tr.b-table-details {
    display: block;
    background: #ffffff;
    border: 1px solid #e4e1d8;
    border-top: 1px dashed #e4e1d8;
    border-radius: 0 0 14px 14px;
    margin-bottom: 12px;
    overflow: hidden;
  }
  .log-table.b-table-stacked-md tr.b-table-details td {
    display: block;
    padding: 0;
    border: none;
  }
  .log-table.b-table-stacked-md tr.b-table-details td::before {
    content: none;
  }
}

.log-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.log-pagination-info {
  font-size: 13px;
  color: #6b7280;
}

.log-pagination-btns {
  display: flex;
  gap: 6px;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e4e1d8;
  background: #ffffff;
  color: #1c1e24;
  cursor: pointer;
}

.page-btn:hover:not(:disabled) {
  border-color: #128189;
  color: #128189;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
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

/* Row-details panel content (rendered inline by b-table, not a modal) */
.log-detail-error {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(192, 57, 43, 0.08);
  border: 1px solid rgba(192, 57, 43, 0.2);
  color: #c0392b;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  text-align: left;
}

.log-detail-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 24px;
  text-align: left;
}

.log-detail-field {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
  text-align: left;
}
.log-detail-field > div {
  min-width: 0;
  flex: 1;
}

.log-detail-field-full {
  grid-column: 1 / -1;
}

.log-detail-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: #9aa0ac;
  font-size: 14px;
}

.log-detail-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #9aa0ac;
}

.log-detail-value {
  display: block;
  font-size: 13.5px;
  color: #1c1e24;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.log-detail-value.mono {
  font-size: 12.5px;
  overflow-wrap: anywhere;
}

/* Before/After shown as b-card pairs */
.log-detail-changes {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  border-top: 1px dashed #e4e1d8;
  padding-top: 14px;
}

.log-detail-changes-head {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #6b7280;
}

.log-diff-row-wrap {
  position: relative;
}
@media (min-width: 768px) {
  .log-diff-row-wrap .row {
    margin-left: -32px;
    margin-right: -32px;
  }
  .log-diff-row-wrap .col-md-6 {
    padding-left: 32px;
    padding-right: 32px;
    display: flex;
  }
}

.log-diff-card.card {
  border-radius: 14px;
  border: 1px solid #e4e1d8;
  width: 100%;
  max-width: 340px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(28, 30, 36, 0.05);
  margin: auto;
}
.log-diff-card.is-solo {
  max-width: 480px;
}
.log-diff-card.is-before {
  /* margin-right: auto; */
}
.log-diff-card.is-after {
  /* margin-left: auto; */
}
.log-diff-card .card-header {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 700;
  border-bottom: none;
}
.log-diff-card-sub {
  font-size: 11px;
  font-weight: 400;
  color: #6b7280;
  margin-left: auto;
}
.log-diff-card.is-before {
  border-top: 3px solid #c0392b;
}
.log-diff-card.is-before .card-header {
  background: rgba(192, 57, 43, 0.06);
  color: #c0392b;
}
.log-diff-card.is-after {
  border-top: 3px solid #128189;
}
.log-diff-card.is-after .card-header {
  background: rgba(18, 129, 137, 0.06);
  color: #128189;
}
.log-diff-card .card-body {
  padding: 10px 14px;
}

/* Connector between the two cards */
.log-diff-connector {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60px;
  z-index: 3;
  pointer-events: none;
}
.log-diff-connector-line {
  flex: 1;
  width: 1px;
  background: linear-gradient(to bottom, transparent, #d8d5cb);
}
.log-diff-connector-line-bottom {
  background: linear-gradient(to top, transparent, #d8d5cb);
}
.log-diff-connector-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #e4e1d8;
  color: #6b7280;
  box-shadow: 0 1px 3px rgba(28, 30, 36, 0.08);
}

/* Mobile: cards stack, so the connector runs horizontally between them
   instead of vertically. Normal flow (not absolute) so it naturally
   lands between the two cards via flex-wrap's source order. */
.log-diff-connector-mobile {
  width: 100%;
  align-items: center;
  gap: 10px;
  margin: -2px 0 10px;
}
.log-diff-connector-line-h {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, #d8d5cb, transparent);
}

.log-diff-kv {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  padding: 5px 0;
  border-bottom: 1px solid #f2f0e9;
  font-size: 12.5px;
}
.log-diff-kv:last-child {
  border-bottom: none;
}
.log-diff-kv-key {
  flex-shrink: 0;
  color: #9aa0ac;
  font-size: 11.5px;
}
.log-diff-kv-val {
  text-align: right;
  color: #1c1e24;
  word-break: break-word;
  min-width: 0;
}
.log-diff-kv.is-list {
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
}
.log-diff-kv-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
}
.log-diff-kv-item {
  display: inline-flex;
  align-items: center;
  width: auto;
  max-width: 100%;
  font-size: 11.5px;
  color: #6b7280;
  background: rgba(28, 30, 36, 0.04);
  border-radius: 999px;
  padding: 3px 10px;
  word-break: break-all;
}
.log-diff-kv-item.is-removed {
  background: rgba(192, 57, 43, 0.12);
  color: #c0392b;
  font-weight: 600;
  text-decoration: line-through;
}
.log-diff-kv-item.is-added {
  background: rgba(18, 129, 137, 0.12);
  color: #128189;
  font-weight: 600;
}
.log-diff-kv.is-changed {
  background: rgba(193, 121, 31, 0.07);
  margin: 0 -8px;
  padding: 6px 8px;
  border-radius: 6px;
  border-bottom: none;
}
.log-diff-kv.is-changed .log-diff-kv-val {
  font-weight: 600;
}
.log-diff-card.is-before .log-diff-kv.is-changed .log-diff-kv-val {
  color: #c0392b;
}
.log-diff-card.is-after .log-diff-kv.is-changed .log-diff-kv-val {
  color: #128189;
}

@media (max-width: 767px) {
  .log-detail-meta {
    grid-template-columns: 1fr;
  }

  /* Before/After cards: stack full-width instead of the fixed-width,
     margin-auto-centered layout meant for the side-by-side desktop view. */
  .log-diff-card.card {
    max-width: none;
  }
  .log-diff-card.is-before,
  .log-diff-card.is-after {
    margin-left: 0;
    margin-right: 0;
  }
  .log-diff-row-wrap .col-md-6:not(:last-child) {
    margin-bottom: 16px;
  }
}
</style>