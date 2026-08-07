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
          <div v-for="(d, idx) in filteredDomains" :key="d.id" class="domain-card">
            <div class="domain-card-top">
              <div class="d-flex align-items-center">
                
                <div class="domain-name" :title="d.name">{{ d.name }}</div>
              </div>
              <span class="status-pill" :class="d.display ? 'status-on' : 'status-off'">
                <span class="status-dot"></span>
                {{ d.display ? "ใช้งาน" : "ปิดใช้งาน" }}
              </span>
            </div>
            
            <div v-if="d.permission.length" class="permission-wrap">
              <span v-for="p in d.permission" :key="p" class="permission-chip">
                <b-icon icon="shield-check" font-scale="0.7"></b-icon>
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
          <div class="log-user-combo" tabindex="-1" @focusout="closeUserFilterMenu">
            <div class="log-user-combo-shell" @click="focusUserFilterInput">
              <span v-if="selectedLogUser" class="log-user-combo-chip">
                <span class="log-user-combo-chip-avatar">{{ selectedLogUser.initial }}</span>
                {{ selectedLogUser.name || selectedLogUser.username }}
                <button type="button" class="log-user-combo-chip-remove" @click.stop="clearLogUserFilter" aria-label="ล้างตัวกรองผู้ใช้">×</button>
              </span>
              <input
                v-else
                ref="userFilterInput"
                v-model.trim="userFilterSearch"
                class="log-user-combo-input"
                placeholder="ทุกผู้ใช้"
                @focus="userFilterMenuOpen = true"
                @input="userFilterMenuOpen = true"
              />
              <b-icon icon="chevron-down" class="log-user-combo-caret" :class="{ open: userFilterMenuOpen }"></b-icon>
            </div>

            <div v-if="userFilterMenuOpen" class="log-user-combo-dropdown" @mousedown.prevent>
              <div v-if="loadingSystemUsers" class="log-user-pick-empty">กำลังโหลด...</div>
              <template v-else>
                <div class="log-user-pick-row" :class="{ checked: !logFilters.user_id }" @click="selectLogUser('')">
                  <span class="log-user-pick-text">ทุกผู้ใช้</span>
                </div>
                <div
                  v-for="u in filteredLogUsers"
                  :key="u.id"
                  class="log-user-pick-row"
                  :class="{ checked: logFilters.user_id === u.id }"
                  @click="selectLogUser(u.id)"
                >
                  <span class="log-user-pick-avatar">{{ u.initial }}</span>
                  <span class="log-user-pick-text">
                    <span class="log-user-pick-name">{{ u.name || u.username }}</span>
                    <span class="log-user-pick-role">{{ u.role }}</span>
                  </span>
                </div>
                <div v-if="filteredLogUsers.length === 0" class="log-user-pick-empty">
                  ไม่พบผู้ใช้ที่ตรงกับ "{{ userFilterSearch }}"
                </div>
              </template>
            </div>
          </div>

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
                 instead of a separate modal. Rendered by the shared
                 LogDetailPanel component so this table and UserMain.vue's
                 per-user log list stay in sync. -->
            <template #row-details="{ item }">
              <LogDetailPanel :log="item" />
            </template>
          </b-table>

          <div class="log-pagination">
            <span class="log-pagination-info">
              หน้า {{ auditLogsPagination.page }} จาก {{ auditLogsPagination.totalPages }}
              ( ทั้งหมด {{ auditLogsPagination.total }} รายการ )
            </span>
            <b-pagination
              v-model="logCurrentPage"
              :total-rows="auditLogsPagination.total"
              :per-page="auditLogsPagination.limit"
              align="center"
              class="my-2"
              @input="goToLogPage"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import AvatarStack from "../AvatarStack.vue";
import LogDetailPanel from "../LogDetailPanel.vue";

export default {
  name: "ProjectDetail",
  components: { AvatarStack, LogDetailPanel },
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
      userFilterSearch: "",
      userFilterMenuOpen: false,
      logDatePreset: "",
      logSearchTimer: null,
      localStatus: this.project.status,
      statusUpdating: false,
      expandedLogId: null,
      logCurrentPage: 1,
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
      if (newTab === "logs") {
        this.fetchLogs(1);
        // Same isolated user-picker endpoint CreateProjectModal uses —
        // gives the filter the full system user list, not just the
        // users already attached to this project.
        this.$store.dispatch("fetchUserPickerList");
      }
    },
    "project._id"() {
      // Component instance is reused across different projects — resync
      // the local optimistic-toggle state when that happens.
      this.localStatus = this.project.status;
    },
    "project.status"(newStatus) {
      // Covers edits made elsewhere (e.g. EditProjectModal) to the same
      // project — without this, only switching to a *different* project
      // (via the watcher above) would ever refresh the toggle. Skip while
      // toggleProjectStatus() has its own optimistic update in flight so
      // this doesn't stomp on it before that request resolves.
      if (!this.statusUpdating && newStatus) {
        this.localStatus = newStatus;
      }
    },
    "auditLogsPagination.page"(newPage) {
      if (newPage && newPage !== this.logCurrentPage) {
        this.logCurrentPage = newPage;
      }
    },
  },
  computed: {
    detailUsers() {
      // userlist items are the full user objects the API embeds directly.
      // Guarded against a dangling null entry (deleted/orphaned
      // reference) the same way domainItems is below — without this, one
      // bad entry crashes the whole tab instead of just being skipped.
      return (this.project.userlist || [])
        .filter((u) => u && typeof u === "object")
        .map((u) => {
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
    selectedLogUser() {
      if (!this.logFilters.user_id) return null;
      return this.systemUsers.find((u) => u.id === this.logFilters.user_id) || null;
    },
    // Sourced from the store's isolated user picker (not detailUsers,
    // which is limited to users already attached to this project) — same
    // endpoint CreateProjectModal uses via fetchUserPickerList.
    systemUsers() {
      return (this.$store.getters.getUserPicker.items || []).map((u) => ({
        ...u,
        id: u.id || u._id,
      }));
    },
    loadingSystemUsers() {
      return this.$store.getters.getUserPicker.loading;
    },
    filteredLogUsers() {
      const q = this.userFilterSearch.trim().toLowerCase();
      if (!q) return this.systemUsers;
      return this.systemUsers.filter(
        (u) =>
          (u.name || u.username || "").toLowerCase().includes(q) ||
          (u.username || "").toLowerCase().includes(q) ||
          (u.role || "").toLowerCase().includes(q)
      );
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
    domainIconBg(idx) {
      const colors = [
        "rgba(84, 87, 214, 0.12)",
        "rgba(18, 129, 137, 0.12)",
        "rgba(193, 121, 31, 0.12)",
        "rgba(200, 79, 146, 0.12)",
        "rgba(63, 131, 248, 0.12)",
        "rgba(46, 160, 105, 0.12)",
      ];
      return colors[idx % colors.length];
    },
    domainIconColor(idx) {
      const colors = ["#5457d6", "#128189", "#c1791f", "#c84f92", "#3f83f8", "#2ea069"];
      return colors[idx % colors.length];
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
    // Clicking anywhere in the combobox shell focuses the inner text
    // input, same as clicking a native <select>/Vuetify combobox opens it.
    focusUserFilterInput() {
      this.userFilterMenuOpen = true;
      this.$nextTick(() => this.$refs.userFilterInput && this.$refs.userFilterInput.focus());
    },
    closeUserFilterMenu() {
      this.userFilterMenuOpen = false;
    },
    selectLogUser(id) {
      this.logFilters.user_id = id;
      this.userFilterSearch = "";
      this.userFilterMenuOpen = false;
      this.applyLogFilters();
    },
    clearLogUserFilter() {
      this.logFilters.user_id = "";
      this.userFilterSearch = "";
      this.applyLogFilters();
    },
    clearLogFilters() {
      this.logFilters = { search: "", method: "", user_id: "", startDate: "", endDate: "" };
      this.userFilterSearch = "";
      this.userFilterMenuOpen = false;
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
  font-size: 14px;
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
  font-size: 14px;
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
  font-size: 14px;
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
  font-size: 14px;
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
  font-size: 14px;
  color: #9aa0ac;
}

/* User filter combobox: search input that opens into a checkable list —
   same visual language as CreateProjectModal's user picker, but a single
   selection instead of multi-select chips. */
.log-user-combo {
  position: relative;
  outline: none;
  flex: 1 1 200px;
  min-width: 170px;
}

.log-user-combo-shell {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  border: 1px solid #e4e1d8;
  border-radius: 10px;
  padding: 5px 30px 5px 10px;
  background: #ffffff;
  cursor: text;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.log-user-combo:focus-within .log-user-combo-shell {
  border-color: #128189;
  box-shadow: 0 0 0 2px rgba(18, 129, 137, 0.15);
}

.log-user-combo-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(18, 129, 137, 0.1);
  color: #0e5157;
  border-radius: 999px;
  padding: 3px 6px 3px 4px;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.log-user-combo-chip-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #128189;
  color: #ffffff;
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
}

.log-user-combo-chip-remove {
  background: transparent;
  border: none;
  color: #0e5157;
  font-size: 15px;
  line-height: 1;
  cursor: pointer;
  padding: 2px 3px;
  border-radius: 50%;
  flex-shrink: 0;
}
.log-user-combo-chip-remove:hover {
  background: rgba(18, 129, 137, 0.2);
}

.log-user-combo-input {
  flex: 1 1 auto;
  min-width: 80px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #1c1e24;
  padding: 3px 2px;
}

.log-user-combo-caret {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
  transition: transform 0.15s ease;
}
.log-user-combo-caret.open {
  transform: translateY(-50%) rotate(180deg);
}

.log-user-combo-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 20;
  width: 100%;
  min-width: 240px;
  box-sizing: border-box;
  max-height: 220px;
  border: 1px solid #e4e1d8;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(28, 30, 36, 0.12);
  overflow-y: auto;
}

.log-user-pick-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #edebe3;
  text-align: left;
}
.log-user-pick-row:last-child {
  border-bottom: none;
}
.log-user-pick-row:hover {
  background: #f6f5f0;
}
.log-user-pick-row.checked {
  background: rgba(18, 129, 137, 0.06);
}

.log-user-pick-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #f6f5f0;
  border: 1px solid #e4e1d8;
  color: #128189;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.log-user-pick-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
  text-align: left;
}
.log-user-pick-name {
  font-size: 14px;
  font-weight: 500;
  color: #1c1e24;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  width: 100%;
}
.log-user-pick-role {
  font-size: 12px;
  color: #6b7280;
  text-align: left;
  width: 100%;
}
.log-user-pick-empty {
  padding: 14px 12px;
  font-size: 13px;
  color: #6b7280;
  font-style: italic;
  text-align: center;
}

.log-filter-clear {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: none;
  background: transparent;
  color: #c0392b;
  font-size: 14px;
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
  font-size: 14px;
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
  font-size: 14px;
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
  font-size: 14px;
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
  font-size: 14px;
  color: #6b7280;
  /* white-space: nowrap; */
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
  font-size: 14px;
  color: #c0392b;
}

.log-result-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 14px;
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
  font-size: 14px;
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
    font-size: 14px;
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

/* โดเมน: card grid instead of a plain list */
.domain-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

@media (max-width: 560px) {
  .domain-grid {
    grid-template-columns: 1fr;
  }
}

.domain-card {
  border: 1px solid #e4e1d8;
  border-radius: 16px;
  background: #ffffff;
  padding: 15px;
  box-shadow: 0 1px 2px rgba(28, 30, 36, 0.04), 0 1px 1px rgba(28, 30, 36, 0.03);
  transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.18s ease, border-color 0.18s ease;
}

.domain-card:hover {
  transform: translateY(-2px);
  border-color: #cfd7d8;
  box-shadow: 0 10px 24px -8px rgba(28, 30, 36, 0.12), 0 2px 6px rgba(28, 30, 36, 0.06);
}

.domain-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.domain-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  flex-shrink: 0;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 999px;
  padding: 3px 9px 3px 7px;
  font-size: 12px;
  /* font-weight: 600; */
  white-space: nowrap;
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-pill.status-on {
  background: rgba(47, 168, 106, 0.12);
  color: #2fa86a;
}
.status-pill.status-on .status-dot {
  background: #2fa86a;
  box-shadow: 0 0 0 3px rgba(47, 168, 106, 0.15);
}
.status-pill.status-off {
  background: rgba(28, 30, 36, 0.05);
  color: #9aa0ac;
}
.status-pill.status-off .status-dot {
  background: #d8d4c8;
}

.domain-name {
  font-size: 16px;
  font-weight: 600;
  color: #1c1e24;
  line-height: 1.35;
  text-align: start;
  overflow: hidden;
  min-height: 2.7em;
  display: flex;
  align-items: center;
  text-overflow: ellipsis;  
  /* width: 90%; */
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
  padding: 3px 9px;
  font-size: 12px;
  font-weight: 500;
  background: rgba(18, 129, 137, 0.09);
  color: #128189;
  border: 1px solid rgba(18, 129, 137, 0.16);
}

.permission-none {
  font-size: 14px;
  color: #9aa0ac;
  font-style: italic;
}

</style>