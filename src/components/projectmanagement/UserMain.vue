<template>
  <div class="users-card">
    <div v-if="loading" class="suggest-loading">
      <div class="suggest-loading-spinner">
        <vue-element-loading
          :active="loading"
          size="60"
          background-color="rgba(255, 255, 255, 0.3)"
          color="#ede7dd"
        />
      </div>
      <span>กำลังโหลดผู้ใช้...</span>
    </div>

    <div v-else class="table-scroll">
    <table class="users-table">
      <thead>
        <tr>
          <th>ผู้ใช้</th>
          <th v-for="f in fields" :key="f.key" :class="'col-' + f.key">{{ f.label }}</th>
          <th>วันหมดอายุ</th>
          <th class="actions-col">การจัดการ</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(u, i) in users">
        <tr :key="u._id || i">
          <td class="name-td">
            <div class="name-cell">
              <div class="user-avatar" :style="{ background: avatarColor(i) }">{{ u.initial }}</div>
              <div class="name-cell-text">
                <span class="user-name">{{ displayName(u) }}
                  <span class="role-badge" :class="'role-' + u.role">
                    <b-icon :icon="roleIcon(u.role)"></b-icon>
                    {{ u.role }}
                  </span>
                </span>
                <span class="user-subline">{{ u.username }} 
                  <span v-if="u.role !== 'service'"> · {{ u.email }}</span>
                </span>
                <span v-if="u.role !== 'service'" class="user-subline">
                  <b-icon icon="building"></b-icon>
                  {{ u.company }}
                </span>
              </div>
            </div>
          </td>
          <td data-label="สถานะ">
            <span class="status-pill" :class="u.status === 'ใช้งานอยู่' ? 'status-active' : 'status-inactive'">
              {{ u.status }}
            </span>
          </td>
          <!-- <td data-label="บริษัท" class="company-cell">{{ u.company }}</td> -->
          <td data-label="โปรเจกต์" class="company-cell">{{ u.projectname }}</td>
          <td class="mono joined-cell" data-label="เข้าร่วมเมื่อ">{{ u.joined }}</td>
          <td class="mono expiry-cell" data-label="วันหมดอายุ">
            <span v-if="u.accountNeverExpire || !u.accountExpiresAt" class="expiry-none">ไม่มีกำหนด</span>
            <span v-else class="expiry-value" :class="{ expired: isExpired(u.accountExpiresAt) }">
              {{ formatExpiry(u.accountExpiresAt) }}
              <span v-if="isExpired(u.accountExpiresAt)" class="expiry-badge">หมดอายุแล้ว</span>
            </span>
          </td>
          <td data-label="การจัดการ">
            <div class="row-actions">
              <button
                type="button"
                class="row-action-btn history"
                title="ดูประวัติการใช้งาน"
                @click="openLogModal(u)"
              >
                <b-icon icon="clock-history"></b-icon>
              </button>
              <button
                v-if="u.role !== 'service'"
                type="button"
                class="row-action-btn edit"
                title="แก้ไขผู้ใช้"
                @click="$refs.editModal.open(u)"
              >
                <b-icon icon="pencil-square"></b-icon>
              </button>
              <button
                type="button"
                class="row-action-btn delete"
                :class="{ 'is-suspended': !u.isActive }"
                :title="u.isActive ? 'ระงับบัญชีผู้ใช้' : 'เปิดใช้งานบัญชีผู้ใช้'"
                @click="confirmToggleActive(u)"
              >
                <b-icon :icon="u.isActive ? 'lock-fill' : 'unlock-fill'"></b-icon>
              </button>
            </div>
          </td>
        </tr>
        </template>
      </tbody>
    </table>
    </div>

    <div v-if="!loading && users.length === 0" class="empty-state">
      ไม่พบผู้ใช้งานที่ตรงกับ "{{ query }}"
    </div>

    <div v-if="pagination && totalPages > 1" class="pagination-bar">
      <span class="pagination-info">
        หน้า {{ pagination.page }} จาก {{ totalPages }} ( ทั้งหมด {{ pagination.total }} รายการ )
      </span>
      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        align="center"
        class="my-2"
        @input="onPageChange"
      />
    </div>

    <b-modal v-model="logModalOpen" size="lg" hide-footer scrollable no-fade @hidden="onLogModalHidden">
      <template #modal-title>
        <div class="log-modal-title">
          <b-icon icon="clock-history"></b-icon>
          ประวัติการใช้งาน — {{ logModalUser ? displayName(logModalUser) : "" }}
        </div>
      </template>

      <div class="log-modal-body">
        <div class="log-modal-filters">
          <div class="log-search">
            <b-icon icon="search"></b-icon>
            <input
              v-model="logFilters.search"
              type="text"
              placeholder="ค้นหา action, endpoint..."
              @input="onLogFilterInput"
            />
          </div>
          <select v-model="logFilters.method" class="log-filter-select" @change="applyLogFilters">
            <option value="">ทุก Method</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>
          <span class="log-filter-divider"></span>
          <button
            v-for="preset in logDatePresets"
            :key="preset.key"
            type="button"
            class="log-preset-btn"
            :class="{ active: logDatePreset === preset.key }"
            @click="setLogDateMonths(preset.months, preset.key)"
          >
            {{ preset.label }}
          </button>
          <button
            type="button"
            class="log-preset-btn"
            :class="{ active: logDatePreset === 'custom' }"
            @click="useCustomLogDate"
          >
            กำหนดเอง
          </button>
          <button v-if="hasActiveLogFilters" type="button" class="log-filter-clear" @click="clearLogFilters">
            <b-icon icon="x-circle"></b-icon> ล้างตัวกรอง
          </button>
        </div>

        <div v-if="logDatePreset === 'custom'" class="log-date-range">
          <input v-model="logFilters.startDate" type="date" class="log-filter-date" @change="applyLogFilters" />
          <span class="log-filter-sep">ถึง</span>
          <input v-model="logFilters.endDate" type="date" class="log-filter-date" @change="applyLogFilters" />
        </div>
        <div v-else-if="logFilters.startDate && logFilters.endDate" class="log-date-hint">
          {{ formatExpiry(logFilters.startDate) }} — {{ formatExpiry(logFilters.endDate) }}
        </div>

        <div v-if="userLogsLoading" class="user-log-empty">กำลังโหลด...</div>
        <div v-else-if="userLogs.length === 0" class="user-log-empty">
          {{ hasActiveLogFilters ? "ไม่พบประวัติการใช้งานที่ตรงกับตัวกรอง" : "ไม่มีประวัติการใช้งาน" }}
        </div>
        <template v-else>
          <div class="user-log-list">
            <div v-for="log in userLogs" :key="log._id" class="user-log-item">
              <span class="user-log-dot" :class="log.success ? 'is-ok' : 'is-fail'"></span>
              <div class="user-log-main">
                <div class="user-log-top">
                  <span class="user-log-action">{{ actionLabel(log.action) }}</span>
                  <span class="user-log-method" :class="'method-' + (log.method || '').toLowerCase()">{{ log.method }}</span>
                  <span class="user-log-status" :class="log.success ? 'is-ok' : 'is-fail'">{{ log.statusCode }}</span>
                  <span class="user-log-time">{{ log.createdAtThai || log.createdAt }}</span>
                </div>
                <div class="user-log-endpoint">{{ log.endpoint }}</div>
                <div v-if="log.errorMessage" class="user-log-error">{{ log.errorMessage }}</div>
              </div>
            </div>
          </div>

          <div class="log-modal-pagination">
            <span class="log-pagination-info">
              หน้า {{ userLogsPagination.page }} จาก {{ userLogsPagination.totalPages }}
              ( ทั้งหมด {{ userLogsPagination.total }} รายการ )
            </span>
            <b-pagination
              v-model="userLogsPage"
              :total-rows="userLogsPagination.total"
              :per-page="userLogsPagination.limit"
            align="center"
            class="my-2"
            @input="fetchUserLogs"
          />
        </div>
      </template>
      </div>
    </b-modal>

    <EditUserModal ref="editModal" @updated="$emit('updated', $event)" />
  </div>
</template>

<script>
import EditUserModal from './users/EditUserModal.vue';
import VueElementLoading from "vue-element-loading";
import Swal from 'sweetalert2';
// Same palette as AvatarStack, assigned by row position so colors stay
// distinct across the visible list.

const AVATAR_COLORS = [
  "#5B8DEF",
  "#8B7FE0",
  "#E0A458",
  "#5FB0A6",
  "#D97C9C",
  "#6FBF73",
  "#E06B6B",
  "#4A6FA5",
];

export default {
  name: "UserMain",
  components: { EditUserModal, VueElementLoading },
  props: {
    users: { type: Array, default: () => [] },
    query: { type: String, default: "" },
    // Shape: { page, limit, total, project_id }. Pass getUsersPagination
    // from the store; omit or leave null to hide the pagination bar.
    pagination: { type: Object, default: null },
    // Pass getLoadingUsers from the store — shows a spinner instead of
    // the table while a fetchUsers request is in flight.
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      fields: [
        { key: "status", label: "สถานะ" },
        // { key: "company", label: "บริษัท" },
        { key: "project", label: "โปรเจกต์" },
        { key: "joined", label: "เข้าร่วมเมื่อ" },
      ],
      currentPage: this.pagination ? this.pagination.page : 1,
      logModalOpen: false,
      logModalUser: null,
      userLogs: [],
      userLogsLoading: false,
      userLogsPage: 1,
      userLogsPagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      logFilters: { search: "", method: "", startDate: "", endDate: "" },
      logDatePreset: "",
      logSearchTimer: null,
      logDatePresets: [
        { months: 1, key: "1", label: "1 เดือน" },
        { months: 3, key: "3", label: "3 เดือน" },
        { months: 6, key: "6", label: "6 เดือน" },
        { months: 12, key: "12", label: "12 เดือน" },
      ],
    };
  },
  computed: {
    totalPages() {
      if (!this.pagination) return 1;
      if (this.pagination.totalPages) return this.pagination.totalPages;
      if (!this.pagination.limit) return 1;
      return Math.max(1, Math.ceil(this.pagination.total / this.pagination.limit));
    },
    totalRows() {
      return this.pagination ? this.pagination.total : 0;
    },
    perPage() {
      return this.pagination ? this.pagination.limit : 10;
    },
    hasActiveLogFilters() {
      const f = this.logFilters;
      // The 1-month date range is the default state, not a user-applied
      // filter — only flag it as "active" once something differs from it.
      return !!(f.search || f.method || this.logDatePreset !== "1");
    },
  },
  watch: {
    // Keep the b-pagination widget in sync if the page changes from
    // outside (e.g. store updated after a filter/search elsewhere).
    "pagination.page"(newPage) {
      if (newPage && newPage !== this.currentPage) {
        this.currentPage = newPage;
      }
    },
    "userLogsPagination.page"(newPage) {
      if (newPage && newPage !== this.userLogsPage) {
        this.userLogsPage = newPage;
      }
    },
  },
  methods: {
    onPageChange(page) {
      this.$emit("change-page", page);
    },
    avatarColor(i) {
      return AVATAR_COLORS[i % AVATAR_COLORS.length];
    },
    displayName(u) {
      const full = `${u.name || ""} ${u.lastname || ""}`.trim();
      return full || u.username || "-";
    },
    formatExpiry(iso) {
      const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
      const d = new Date(iso);
      if (isNaN(d.getTime())) return "-";
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
    },
    isExpired(iso) {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return false;
      return d < new Date();
    },
    roleIcon(role) {
      const icons = {
        superadmin: "shield-lock-fill",
        admin: "shield-fill",
        user: "person-fill",
        service: "gear-fill",
      };
      return icons[role] || "person-fill";
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
        LOGIN_SUCCESS: "เข้าสู่ระบบสำเร็จ",
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
    openLogModal(user) {
      this.logModalUser = user;
      this.logModalOpen = true;
      this.userLogs = [];
      this.logFilters = { search: "", method: "", startDate: "", endDate: "" };
      this.setLogDateRangeOnly(1, "1"); // default to the last 1 month
      this.fetchUserLogs(1);
    },
    onLogModalHidden() {
      // Clear state once the modal has fully closed so the next open
      // doesn't briefly flash the previous user's logs.
      this.logModalUser = null;
      this.userLogs = [];
      this.userLogsPagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    },
    async fetchUserLogs(page) {
      if (!this.logModalUser) return;
      const targetUserId = this.logModalUser._id;
      const f = this.logFilters;
      this.userLogsLoading = true;
      try {
        const result = await this.$store.dispatch("getLogs", {
          user_id: targetUserId,
          page: page || 1,
          limit: 10,
          project_id: "",
          search: f.search.trim(),
          method: f.method,
          start_date: f.startDate ? `${f.startDate}T00:00:00` : "",
          end_date: f.endDate ? `${f.endDate}T23:59:59` : "",
        });
        // Bail if the modal was closed (or switched to a different user)
        // while this request was still in flight.
        if (!this.logModalUser || this.logModalUser._id !== targetUserId) return;
        this.userLogs = result || [];
        // getLogs also updates the shared store pagination getter — pull
        // it in right after the dispatch resolves so it reflects this
        // specific call, not a stale value from elsewhere.
        const storePagination = this.$store.getters.getAuditLogsPagination;
        this.userLogsPagination = {
          page: storePagination.page,
          limit: storePagination.limit,
          total: storePagination.total,
          totalPages: storePagination.totalPages,
          hasNextPage: storePagination.hasNextPage,
          hasPreviousPage: storePagination.hasPreviousPage,
        };
      } catch (err) {
        console.log(err);
      } finally {
        if (this.logModalUser && this.logModalUser._id === targetUserId) {
          this.userLogsLoading = false;
        }
      }
    },
    onLogFilterInput() {
      clearTimeout(this.logSearchTimer);
      this.logSearchTimer = setTimeout(() => this.applyLogFilters(), 400);
    },
    applyLogFilters() {
      this.fetchUserLogs(1);
    },
    clearLogFilters() {
      this.logFilters = { search: "", method: "", startDate: "", endDate: "" };
      this.setLogDateRangeOnly(1, "1");
      this.fetchUserLogs(1);
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
    async confirmToggleActive(user) {
      const willSuspend = user.isActive;

      const result = await Swal.fire({
        title: willSuspend
          ? `ต้องการระงับบัญชีผู้ใช้ "${user.username}" ใช่หรือไม่?`
          : `ต้องการเปิดใช้งานบัญชีผู้ใช้ "${user.username}" ใช่หรือไม่?`,
        text: willSuspend
          ? "ผู้ใช้จะไม่สามารถเข้าสู่ระบบได้จนกว่าจะเปิดใช้งานอีกครั้ง"
          : "ผู้ใช้จะสามารถเข้าสู่ระบบได้อีกครั้ง",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: willSuspend ? "ระงับบัญชี" : "เปิดใช้งาน",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: willSuspend ? "#e06b6b" : "#128189",
        reverseButtons: true,
        didOpen: () => {
          const iconContent = document.querySelector('.swal2-icon-content');
          if (iconContent) iconContent.style.display = 'none';
        },
      });

      if (!result.isConfirmed) return;

      const payload = { _id: user._id, isActive: !willSuspend };
      try {
        const updated = await this.$store.dispatch("updateUserDetails", payload);
        this.$emit("updated", updated);
      } catch (err) {
        console.log(err);
        Swal.fire({
          title: willSuspend ? "ระงับบัญชีไม่สำเร็จ" : "เปิดใช้งานบัญชีไม่สำเร็จ",
          text: "กรุณาลองใหม่อีกครั้ง",
          icon: "error",
        });
      }
    },
  },
};
</script>

<style scoped>
/*
  Self-contained: plain <table> instead of b-card/b-table, with colors
  hard-coded directly (no CSS variables) so it renders correctly even
  without the shared theme.css loaded.
*/

.users-card {
  background: #ffffff;
  border: 1px solid #e4e1d8;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(28, 30, 36, 0.04);
  overflow: hidden;
}

.table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.users-table thead th {
  background:  #ffffff;
  font-size: 14px;
  letter-spacing: 0.05em;
  font-weight: 400;
  padding: 14px 20px;
  border-bottom: 1px solid #e4e1d8;
  white-space: nowrap;
}

.users-table tbody tr {
  transition: background 0.12s ease;
}
.users-table tbody tr:hover {
  background:  #f6f5f0;
}
.users-table tbody tr:not(:last-child) td {
  border-bottom: 1px solid  #edebe3;
}

.users-table td {
  padding: 14px 20px;
  font-size: 14px;
  vertical-align: middle;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 4px;
  border-radius: 999px;
  padding: 3px 10px 3px 8px;
  font-size: 11px;
  /* font-weight: 700; */
  text-transform: uppercase;
  letter-spacing: 0.03em;
  line-height: 1.5;
  vertical-align: middle;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(120, 111, 99, 0.288);
}
.role-badge .b-icon {
  font-size: 12px;
}
.role-superadmin {
  background: #e0355c;
  color: #ffffff;
  /* box-shadow: 0 1px 0px rgba(224, 53, 92, 0.45); */
}
.role-admin {
  background: #dd8f1e;
  color: #ffffff;
  /* box-shadow: 0 1px 0px rgba(221, 143, 30, 0.4); */
}
.role-user {
  background: rgba(18, 137, 56, 0.12);
  color: #128930;
}
.role-service {
  background: rgba(107, 114, 128, 0.14);
  color: #4b5563;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.name-cell-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  flex-shrink: 0;
}

.user-name {
  font-weight: 500;
}

.user-subline {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-pill {
  display: inline-block;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}
.status-active {
  background: rgba(18, 129, 137, 0.12);
  color:  #128189;
}
.status-inactive {
  background: rgba(107, 114, 128, 0.12);
  color:  #6b7280;
}

.joined-cell {
  font-size: 14px;
  white-space: nowrap;
}

.company-cell {
  font-size: 14px;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.expiry-cell {
  font-size: 14px;
  white-space: nowrap;
}
.expiry-none {
  color: #9aa0ac;
  font-style: italic;
}
.expiry-value {
  color: #1c1e24;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.expiry-value.expired {
  color: #c0392b;
}
.expiry-badge {
  display: inline-block;
  background: rgba(192, 57, 43, 0.1);
  color: #c0392b;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

.empty-state {
  padding: 24px 20px;
  font-size: 14px;
}

.suggest-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 64px 4px;
  color: #6b7280;
  font-size: 14px;
}

.suggest-loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
}

.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 20px;
  border-top: 1px solid #e4e1d8;
}

.pagination-info {
  font-size: 13px;
  color: #6b7280;
}

/* ---- Medium screens (tablets) ----
   Table stays a table, but gets tighter and drops the least essential
   column ("เข้าร่วมเมื่อ") to avoid the actions column being squeezed
   off-screen. A horizontal scrollbar is the fallback for anything that
   still doesn't fit. */
@media (min-width: 701px) {
  .users-table {
    min-width: 720px;
  }
}

@media (min-width: 701px) and (max-width: 1180px) {
  .users-table thead th,
  .users-table td {
    padding: 12px 14px;
    font-size: 13px;
  }
  .role-badge {
    font-size: 10px;
    padding: 2px 8px 2px 6px;
  }
  .company-cell {
    max-width: 100px;
  }
  .col-joined,
  .joined-cell {
    display: none;
  }
  .row-action-btn {
    width: 28px;
    height: 28px;
  }
}

@media (max-width: 700px) {
  
  .pagination-bar {
    display:block;
    border-top: none;
    padding: 12px 4px;
  }
}


.actions-col {
  width: 1%;
  white-space: nowrap;
}

.row-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.row-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid #e4e1d8;
  background: #ffffff;
  color: #6b7280;
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease, border-color 0.12s ease;
}
.row-action-btn.edit:hover {
  background: rgba(18, 129, 137, 0.1);
  border-color: #128189;
  color: #128189;
}
.row-action-btn.delete:hover {
  background: rgba(192, 57, 43, 0.1);
  border-color: #c0392b;
  color: #c0392b;
}
.row-action-btn.delete.is-suspended {
  color: #128189;
  border-color: rgba(18, 129, 137, 0.25);
  background: rgba(18, 129, 137, 0.06);
}
.row-action-btn.delete.is-suspended:hover {
  background: rgba(18, 129, 137, 0.12);
  border-color: #128189;
  color: #128189;
}
.row-action-btn.history:hover,
.row-action-btn.history.active {
  background: rgba(63, 131, 248, 0.1);
  border-color: #3f83f8;
  color: #3f83f8;
}

.user-log-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #9aa0ac;
  font-style: italic;
  padding: 6px 2px;
}
.user-log-item {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px dashed #eeece3;
}
.user-log-item:last-child {
  border-bottom: none;
}
.user-log-dot {
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-top: 6px;
}
.user-log-dot.is-ok {
  background: #128189;
}
.user-log-dot.is-fail {
  background: #c0392b;
}
.user-log-main {
  min-width: 0;
  flex: 1;
}
.user-log-top {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.user-log-action {
  font-size: 13.5px;
  font-weight: 600;
  color: #1c1e24;
}
.user-log-method {
  font-size: 10.5px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 5px;
  background: rgba(28, 30, 36, 0.06);
  color: #6b7280;
}
.user-log-method.method-get {
  background: rgba(18, 129, 137, 0.12);
  color: #128189;
}
.user-log-method.method-post {
  background: rgba(63, 131, 248, 0.12);
  color: #3f83f8;
}
.user-log-method.method-put,
.user-log-method.method-patch {
  background: rgba(193, 121, 31, 0.12);
  color: #c1791f;
}
.user-log-method.method-delete {
  background: rgba(192, 57, 43, 0.12);
  color: #c0392b;
}
.user-log-status {
  font-size: 11.5px;
  font-weight: 600;
}
.user-log-status.is-ok {
  color: #128189;
}
.user-log-status.is-fail {
  color: #c0392b;
}
.user-log-endpoint {
  font-size: 12px;
  color: #9aa0ac;
  margin-top: 2px;
  overflow-wrap: anywhere;
}
.user-log-time {
  margin-left: auto;
  flex-shrink: 0;
  font-size: 12px;
  color: #9aa0ac;
}
.user-log-error {
  font-size: 12px;
  color: #c0392b;
  margin-top: 4px;
}
.user-log-list {
  display: flex;
  flex-direction: column;
}

.log-modal-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #1c1e24;
}

.log-modal-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.log-search {
  flex: 1 1 200px;
  min-width: 160px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e4e1d8;
  border-radius: 10px;
  background: #ffffff;
  padding: 8px 14px;
}
.log-search input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #1c1e24;
}
.log-search input::placeholder {
  color: #9aa0ac;
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
.log-filter-divider {
  flex-basis: 100%;
  width: auto;
  height: 0;
  background: none;
  margin: 0;
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
.log-date-range {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.log-filter-sep {
  font-size: 13px;
  color: #9aa0ac;
}
.log-modal-body {
  min-height: 480px;
  display: flex;
  flex-direction: column;
}
.log-date-hint {
  display: block;
  text-align: right;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 12px;
}
.log-modal-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e4e1d8;
}
.log-pagination-info {
  font-size: 13px;
  color: #6b7280;
}

/* ---- Card layout on small screens ---- */
@media (max-width: 769px) {
  .users-card {
    background: transparent;
    border: none;
    box-shadow: none;
    overflow: visible;
  }

  .users-table,
  .users-table thead,
  .users-table tbody,
  .users-table tr,
  .users-table td {
    display: block;
    width: 100%;
  }

  .users-table thead {
    /* Header row isn't needed — each cell shows its own label instead. */
    display: none;
  }

  .users-table tbody tr {
    background: #ffffff;
    border: 1px solid #e4e1d8;
    border-radius: 12px;
    box-shadow: 0 1px 2px rgba(28, 30, 36, 0.04);
    margin-bottom: 12px;
    padding: 4px 16px;
  }
  .users-table tbody tr:hover {
    background: #ffffff;
  }
  .users-table tbody tr:not(:last-child) td {
    border-bottom: none;
  }

  .users-table td {
    padding: 10px 0;
    border-bottom: 1px solid #edebe3;
  }
  .users-table td:last-child {
    border-bottom: none;
  }

  /* Name cell stays as a plain block — it's the card's header, not a
     label/value row. */
  .name-td {
    padding-top: 14px;
  }
  .user-avatar {
    width: 36px;
    height: 36px;
    font-size: 15px;
  }
  .user-name {
    font-size: 15px;
  }

  /* Every other cell becomes a "label: value" row via the data-label
     attribute set on each <td> in the template. */
  td[data-label] {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  td[data-label]::before {
    content: attr(data-label);
    font-size: 13px;
    font-weight: 500;
    color: #6b7280;
    flex-shrink: 0;
  }

  /* .company-cell's max-width:160px is meant to truncate the project
     name text on desktop, but on mobile this <td> IS the flex row
     (label + value together, via td[data-label] above). That cap was
     squeezing the whole row into a 160px box instead of letting it
     span the full card width, which is why the value never reached
     the right edge like every other row. */
  .company-cell {
    max-width: none;
    text-align: right;
  }

  .row-actions {
    justify-content: flex-end;
  }
}
</style>