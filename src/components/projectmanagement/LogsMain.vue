<template>
    <div class="logs-main">
        <div class="logs-header">
            <h5 class="">
                ประวัติการใช้งาน
                <span v-if="pagination.total" class="count">{{ pagination.total || 0 | numFormat}} รายการ</span>
            </h5>
        </div>

        <div class="logs-filters">
            <div class="log-search-group">
                <div class="log-search">
                    <b-icon icon="search"></b-icon>
                    <input v-model="f.search" type="text" placeholder="ค้นหา action, endpoint..." :disabled="loading"
                        @keyup.enter="applyFilters" />
                </div>
                <button type="button" class="log-search-btn" :disabled="loading" @click="applyFilters">
                    ค้นหา
                </button>
            </div>

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
                        :disabled="loading"
                        @focus="userFilterMenuOpen = true"
                        @input="userFilterMenuOpen = true"
                    />
                    <b-icon icon="chevron-down" class="log-user-combo-caret" :class="{ open: userFilterMenuOpen }"></b-icon>
                </div>

                <div v-if="userFilterMenuOpen" class="log-user-combo-dropdown" @mousedown.prevent>
                    <div v-if="loadingSystemUsers" class="log-user-pick-empty">กำลังโหลด...</div>
                    <template v-else>
                        <div class="log-user-pick-row" :class="{ checked: !f.userId }" @click="selectLogUser('')">
                            <span class="log-user-pick-text">ทุกผู้ใช้</span>
                        </div>
                        <div
                            v-for="u in filteredLogUsers"
                            :key="u.id"
                            class="log-user-pick-row"
                            :class="{ checked: f.userId === u.id }"
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

            <div class="log-filter-combo" :class="{ disabled: loading }" ref="projectFilterRoot">
                <button type="button" class="log-filter-combo-btn" @click="toggleProjectFilter" :disabled="loading"
                    aria-haspopup="listbox" :aria-expanded="projectFilterOpen">
                    <span class="log-filter-combo-label">{{ projectFilterLabel }}</span>
                    <b-icon icon="chevron-down"></b-icon>
                </button>
                <div v-if="projectFilterOpen" class="log-filter-combo-menu">
                    <input type="text" class="log-filter-combo-search" v-model="projectFilterQuery"
                        placeholder="ค้นหาโปรเจกต์..." autocomplete="off" @click.stop ref="projectFilterSearchInput" />
                    <div class="log-filter-combo-list" role="listbox" @scroll="onProjectFilterScroll"
                        ref="projectFilterMenu">
                        <div class="log-filter-combo-option" :class="{ active: f.projectId === '' }" role="option"
                            @click="selectProjectFilter('', '')">
                            ทุกโปรเจกต์
                        </div>
                        <div v-for="p in projectPickerItems" :key="p._id" class="log-filter-combo-option"
                            :class="{ active: f.projectId === p._id }" role="option"
                            @click="selectProjectFilter(p._id, p.projectname)">
                            {{ p.projectname }}
                        </div>
                        <div v-if="getProjectPicker.loading" class="log-filter-combo-loading">กำลังโหลด...</div>
                        <div v-else-if="!projectPickerItems.length" class="log-filter-combo-loading">ไม่พบโปรเจกต์</div>
                    </div>
                </div>
            </div>

            <select v-model="f.method" class="log-filter-select" :disabled="loading" @change="applyFilters">
                <option value="">ทุก Method</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
            </select>

            <span class="log-filter-divider"></span>

            <button v-for="preset in datePresets" :key="preset.key" type="button" class="log-preset-btn"
                :class="{ active: datePreset === preset.key }" :disabled="loading"
                @click="setDateMonths(preset.months, preset.key)">
                {{ preset.label }}
            </button>
            <button type="button" class="log-preset-btn" :class="{ active: datePreset === 'custom' }"
                :disabled="loading" @click="useCustomDate">
                กำหนดเอง
            </button>

            <button v-if="hasActiveFilters" type="button" class="log-filter-clear" :disabled="loading"
                @click="clearFilters">
                <b-icon icon="x-circle"></b-icon> ล้างตัวกรอง
            </button>
        </div>

        <div v-if="datePreset === 'custom'" class="log-date-range">
            <date-picker v-model="valueDate" type="date" range placeholder="เลือกช่วงเวลา" size="sm"
                :disabled-date="(date) => date >= new Date()" :disabled="loading" value-type="format"
                format="YYYY-MM-DD" @change="checkDateRange" id="date-log-main">{{ valueDate }}</date-picker>
        </div>
        <div v-else-if="f.startDate && f.endDate" class="log-date-hint">
            {{ formatDateThai(f.startDate) }} — {{ formatDateThai(f.endDate) }}
        </div>

        <div v-if="loading" class="suggest-loading">
            <div class="suggest-loading-spinner">
                <vue-element-loading :active="loading" size="60" background-color="rgba(255, 255, 255, 0.3)"
                    color="#ede7dd" />
            </div>
            <span>กำลังโหลด...</span>
        </div>

        <div v-else class="logs-card">
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
                    <span class="log-method" :class="'method-' + (item.method || '').toLowerCase()">{{ item.method
                        }}</span>
                </template>

                <template #cell(createdAt)="{ item }">
                    <span class="mono">{{ item.createdAtThai || formatTime(item.createdAt || item.time ||
                        item.created_at || item.timestamp) }}</span>
                </template>

                <template #row-details="{ item }">
                    <LogDetailPanel :log="item" />
                </template>
            </b-table>

            <div v-if="!logs.length" class="empty-note">
                ไม่พบ Log ที่ตรงกับตัวกรอง
            </div>
        </div>


        <div v-if="pagination && lastPage > 1" class="pagination-bar">
            <span class="pagination-info">
                หน้า {{ pagination.page }} จาก {{ lastPage }} ( ทั้งหมด {{ pagination.total }} รายการ )
            </span>
            <b-pagination :value="pagination.page" :total-rows="pagination.total" :per-page="pagination.limit"
                :disabled="loading" align="center" class="my-2" @input="onPageChange" />
        </div>
    </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import VueElementLoading from 'vue-element-loading';
import AvatarStack from './AvatarStack.vue';
import LogDetailPanel from './LogDetailPanel.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: "LogsMain",
    components: { DatePicker, VueElementLoading, AvatarStack, LogDetailPanel },
    data() {
        return {
            f: {
                userId: "",
                projectId: "",
                projectName: "",
                search: "",
                method: "",
                startDate: "",
                endDate: "",
            },
            logs: [],
            loading: false,
            pagination: {
                page: 1,
                total: 0,
                limit: 10,
                totalPages: 1,
                hasNextPage: false,
                hasPreviousPage: false,
            },
            datePreset: "1",
            datePresets: [
                { months: 1, key: "1", label: "1 เดือน" },
                { months: 3, key: "3", label: "3 เดือน" },
                { months: 6, key: "6", label: "6 เดือน" },
                { months: 12, key: "12", label: "12 เดือน" },
            ],
            expandedLogId: null,
            // Project filter combo — backed by the shared project-picker store
            // module (same one ProjectManagement.vue's project filter uses).
            projectFilterOpen: false,
            projectFilterQuery: "",
            projectFilterSearchTimer: null,
            // Account filter combo — mirrors ProjectDetail.vue's log-user-combo
            // exactly: the isolated user-picker endpoint (fetchUserPickerList /
            // getUserPicker) loads the full system user list once, and this
            // just filters that list client-side as you type.
            userFilterSearch: "",
            userFilterMenuOpen: false,
        };
    },
    computed: {
        ...mapGetters(["getProjectPicker"]),
        lastPage() {
            if (this.pagination.totalPages) return this.pagination.totalPages;
            return Math.max(1, Math.ceil((this.pagination.total || 0) / (this.pagination.limit || 10)));
        },
        projectPickerItems() {
            return (this.getProjectPicker && this.getProjectPicker.items) || [];
        },
        selectedLogUser() {
            if (!this.f.userId) return null;
            return this.systemUsers.find((u) => u.id === this.f.userId) || null;
        },
        // Same isolated user-picker endpoint CreateProjectModal and
        // ProjectDetail.vue use — gives the full system user list, loaded
        // once (see mounted()), not paginated.
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
        projectFilterLabel() {
            if (!this.f.projectId) return "ทุกโปรเจกต์";
            return this.f.projectName || "โปรเจกต์ที่เลือก";
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
        // here instead of mutating the fetched log objects directly.
        logTableItems() {
            return this.logs.map((log) => ({
                ...log,
                _showDetails: log._id === this.expandedLogId,
            }));
        },
        hasActiveFilters() {
            const f = this.f;
            // The default 1-month range isn't a user-applied filter — only flag
            // "active" once something differs from that default state.
            return !!(f.search || f.userId || f.projectId || f.method || this.datePreset !== "1");
        },
        // date-picker (range mode) wants/emits a single [start, end] array —
        // f keeps startDate/endDate as separate strings everywhere else in
        // this component, so bridge between the two shapes here instead of
        // restructuring f itself.
        valueDate: {
            get() {
                return [this.f.startDate || null, this.f.endDate || null];
            },
            set(val) {
                this.f.startDate = (val && val[0]) || "";
                this.f.endDate = (val && val[1]) || "";
            },
        },
    },
    created() {
        // Logs load right away; the project picker lazy-loads its first
        // page only once opened (see toggleProjectFilter). The user picker
        // loads its full list once here, same as ProjectDetail.vue does
        // when its logs tab is opened.
        this.setDateMonths(1, "1");
        this.$store.dispatch("fetchUserPickerList");
    },
    mounted() {
        document.addEventListener("click", this.handleFilterOutsideClick);
    },
    beforeDestroy() {
        document.removeEventListener("click", this.handleFilterOutsideClick);
    },
    watch: {
        projectFilterQuery(val) {
            clearTimeout(this.projectFilterSearchTimer);
            this.projectFilterSearchTimer = setTimeout(() => {
                this.searchProjectPicker(val);
            }, 300);
        },
    },
    methods: {
        ...mapActions(["fetchUsers", "fetchProjectPickerPage", "resetProjectPicker", "searchProjectPicker"]),
        formatTime(v) {
            if (!v) return "";
            const d = new Date(v);
            if (isNaN(d)) return v;
            return d.toLocaleString();
        },
        logUserName(log) {
            const u = log.user;
            if (!u) return log.user_id || "ไม่ทราบผู้ใช้";
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
        // Bootstrap-vue's built-in row-details: clicking a row toggles the
        // expanded #row-details panel (rendered by the shared LogDetailPanel
        // component so this table stays in sync with UserMain.vue's own log
        // list and ProjectDetail.vue's log tab).
        onLogRowClicked(item) {
            this.expandedLogId = this.expandedLogId === item._id ? null : item._id;
        },
        formatDateThai(iso) {
            if (!iso) return "-";
            const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
            const d = new Date(iso);
            if (isNaN(d)) return "-";
            return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
        },
        async fetchLogs(page) {
            try {
                this.loading = true;
                this.expandedLogId = null;
                const result = await this.$store.dispatch("getLogs", {
                    user_id: this.f.userId || "",
                    page: page || 1,
                    limit: this.pagination.limit || 10,
                    project_id: this.f.projectId || "",
                    search: (this.f.search || "").trim(),
                    method: this.f.method || "",
                    start_date: this.f.startDate ? `${this.f.startDate}T00:00:00` : "",
                    end_date: this.f.endDate ? `${this.f.endDate}T23:59:59` : "",
                });

                // getLogs' dispatch resolves with just the array of log items —
                // it does NOT include pagination in its return value (see
                // UserMain.vue's fetchUserLogs for the same pattern). Pagination
                // is written to the store separately and has to be read from the
                // getAuditLogsPagination getter right after the dispatch resolves,
                // or it stays out of sync with this specific call.
                let items = [];
                if (Array.isArray(result)) {
                    items = result;
                } else if (result && Array.isArray(result.items)) {
                    items = result.items;
                } else if (result && Array.isArray(result.data)) {
                    items = result.data;
                } else if (result && result.data && Array.isArray(result.data.items)) {
                    items = result.data.items;
                } else if (result && Array.isArray(result.rows)) {
                    items = result.rows;
                }
                const storePagination = this.$store.getters.getAuditLogsPagination;

                this.logs = items;
                if (storePagination) {
                    this.pagination = {
                        page: storePagination.page || page || 1,
                        limit: storePagination.limit || this.pagination.limit || 10,
                        total: storePagination.total || 0,
                        totalPages: storePagination.totalPages || 1,
                        hasNextPage: storePagination.hasNextPage,
                        hasPreviousPage: storePagination.hasPreviousPage,
                    };
                } else {
                    // Fallback if the getter isn't available for some reason.
                    this.pagination.page = page || 1;
                    this.pagination.total = items.length || 0;
                }
            } catch (err) {
                console.error(err);
                this.logs = [];
            } finally {
                this.loading = false;
            }
        },
        // ---- Project filter combo (shared project-picker store module) ----
        toggleProjectFilter() {
            if (this.loading) return;
            if (this.projectFilterOpen) {
                this.closeProjectFilter();
                return;
            }
            this.projectFilterOpen = true;
            if (!this.getProjectPicker.items.length && !this.getProjectPicker.loading) {
                this.fetchProjectPickerPage();
            }
            this.$nextTick(() => {
                if (this.$refs.projectFilterSearchInput) this.$refs.projectFilterSearchInput.focus();
            });
        },
        onProjectFilterScroll(e) {
            const el = e.target;
            if (el.scrollHeight - el.scrollTop - el.clientHeight < 60) {
                this.fetchProjectPickerPage();
            }
        },
        selectProjectFilter(id, name) {
            this.f.projectId = id;
            this.f.projectName = name;
            this.closeProjectFilter();
            this.applyFilters();
        },
        // Closes the dropdown and clears its search box + loaded picker items
        // — otherwise the next time it's opened it silently shows whatever
        // page a previous search left behind instead of the full list.
        closeProjectFilter() {
            this.projectFilterOpen = false;
            clearTimeout(this.projectFilterSearchTimer);
            if (this.projectFilterQuery) {
                this.projectFilterQuery = "";
            } else {
                this.resetProjectPicker("");
            }
        },
        // ---- Account filter combo (client-filtered, same pattern as
        // ProjectDetail.vue's log-user-combo) ----
        // Clicking anywhere in the combobox shell focuses the inner text
        // input, same as clicking a native <select>/Vuetify combobox opens it.
        focusUserFilterInput() {
            if (this.loading) return;
            this.userFilterMenuOpen = true;
            this.$nextTick(() => this.$refs.userFilterInput && this.$refs.userFilterInput.focus());
        },
        closeUserFilterMenu() {
            this.userFilterMenuOpen = false;
        },
        selectLogUser(id) {
            this.f.userId = id;
            this.userFilterSearch = "";
            this.userFilterMenuOpen = false;
            this.applyFilters();
        },
        clearLogUserFilter() {
            this.f.userId = "";
            this.userFilterSearch = "";
            this.applyFilters();
        },
        handleFilterOutsideClick(e) {
            if (this.projectFilterOpen && this.$refs.projectFilterRoot && !this.$refs.projectFilterRoot.contains(e.target)) {
                this.closeProjectFilter();
            }
        },
        applyFilters() {
            this.fetchLogs(1);
        },
        // date-picker (range) emits @change on every selection, including
        // when only the start date has been picked so far — only actually
        // apply the filter once both ends of the range are set.
        checkDateRange() {
            if (this.f.startDate && this.f.endDate) {
                this.applyFilters();
            }
        },
        toISODate(d) {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${y}-${m}-${day}`;
        },
        setDateMonths(months, key) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - months);
            this.f.startDate = this.toISODate(start);
            this.f.endDate = this.toISODate(end);
            this.datePreset = key;
            this.applyFilters();
        },
        useCustomDate() {
            this.datePreset = "custom";
        },
        clearFilters() {
            this.f = { userId: "", projectId: "", projectName: "", search: "", method: "", startDate: "", endDate: "" };
            this.userFilterSearch = "";
            this.userFilterMenuOpen = false;
            this.setDateMonths(1, "1");
        },
        onPageChange(page) {
            // b-pagination is bound to :value (not v-model), so its displayed
            // page only advances once pagination.page itself updates below —
            // this, plus disabling it while `loading`, rules out double fetches
            // from a stray duplicate 'input' emission or a rapid second click.
            if (!page || page < 1 || page === this.pagination.page || this.loading) return;
            this.pagination.page = page;
            this.fetchLogs(page);
        },
    },
};
</script>

<style scoped>
.count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 20px;
    padding: 0 6px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    background: #ffe1a8;
    color: #5a3f04;
}

.logs-main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 12px;
}

.logs-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.logs-title {
    font-size: 18px;
    font-weight: 700;
    color: #1c1e24;
    margin: 0;
}

/* ---- Filters (matches UserMain.vue log-modal-filters) ---- */
.logs-filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
}

.log-search-group {
    flex: 1 1 200px;
    min-width: 160px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.log-search {
    flex: 1;
    min-width: 0;
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

.log-search-btn {
    flex-shrink: 0;
    border: none;
    border-radius: 8px;
    background: #128189;
    color: #ffffff;
    font-size: 13px;
    font-weight: 600;
    padding: 6px 14px;
    cursor: pointer;
    transition: background 0.15s ease;
}

.log-search-btn:hover {
    background: #0f6b72;
}

.log-search-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}

.log-filter-select {
    border: 1px solid #e4e1d8;
    border-radius: 10px;
    background: #ffffff;
    padding: 8px 10px;
    font-size: 14px;
    color: #1c1e24;
    min-width: 160px;
}

/* User filter combobox — copied from ProjectDetail.vue's log-user-combo:
   search input that opens into a checkable list, same visual language as
   CreateProjectModal's user picker but a single selection instead of
   multi-select chips. */
.log-user-combo {
    position: relative;
    outline: none;
    flex: 0 0 auto;
    min-width: 160px;
    width: 200px;
}

.log-user-combo-shell {
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid #e4e1d8;
    border-radius: 10px;
    padding: 8px 30px 8px 10px;
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
}
.log-user-pick-empty {
    padding: 12px;
    font-size: 13px;
    color: #6b7280;
    text-align: center;
}

/* ---- Project filter combo (search + infinite scroll) ---- */
.log-filter-combo {
    position: relative;
    flex: 0 0 auto;
}

.log-filter-combo-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-width: 160px;
    padding: 8px 10px;
    border: 1px solid #e4e1d8;
    border-radius: 10px;
    background: #ffffff;
    color: #1c1e24;
    font-size: 14px;
    cursor: pointer;
}

.log-filter-combo-btn:hover {
    border-color: #128189;
}

.log-filter-combo.disabled .log-filter-combo-btn,
.log-filter-combo-btn:disabled {
    background: #f6f5f0;
    cursor: not-allowed;
}

.log-filter-combo-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.log-filter-combo-menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 20;
    width: 100%;
    min-width: 240px;
    background: #ffffff;
    border: 1px solid #e4e1d8;
    border-radius: 6px;
    box-shadow: 0 6px 16px rgba(28, 30, 36, 0.12);
    overflow: hidden;
}

.log-filter-combo-search {
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 8px 12px;
    border: none;
    border-bottom: 1px solid #e4e1d8;
    font-size: 13px;
    text-align: left;
    outline: none;
}

.log-filter-combo-search:focus {
    box-shadow: inset 0 0 0 2px rgba(18, 129, 137, 0.15);
}

.log-filter-combo-list {
    max-height: 240px;
    overflow-y: auto;
}

.log-filter-combo-option {
    padding: 8px 12px;
    font-size: 13px;
    color: #1c1e24;
    text-align: left;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.log-filter-combo-option:hover {
    background: #f6f5f0;
}

.log-filter-combo-option.active {
    background: rgba(18, 129, 137, 0.1);
    color: #128189;
    font-weight: 600;
}

.log-filter-combo-loading {
    padding: 8px 12px;
    font-size: 12px;
    color: #6b7280;
    text-align: center;
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

.log-search input:disabled,
.log-filter-select:disabled,
.log-preset-btn:disabled,
.log-filter-clear:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}

.log-preset-btn:disabled:hover {
    border-color: #e4e1d8;
    color: #1c1e24;
}

.log-preset-btn.active:disabled:hover {
    border-color: #128189;
    color: #ffffff;
}

.log-date-range {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
}

.log-date-range ::v-deep .mx-datepicker-range {
    width: 260px;
}

.log-date-range ::v-deep .mx-input {
    border: 1px solid #e4e1d8;
    border-radius: 10px;
    height: 34px;
    font-size: 14px;
    color: #1c1e24;
    box-shadow: none;
}

.log-date-range ::v-deep .mx-input:focus {
    border-color: #128189;
}

.log-date-hint {
    display: block;
    text-align: right;
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 12px;
}

/* ---- Loading (matches ProjectMain.vue / UserMain.vue suggest-loading) ---- */
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

/* ---- Table card (matches ProjectDetail.vue's log-table) ---- */
.logs-card {
    background: transparent;
}

.log-table.table {
    border: 1px solid #e4e1d8;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 0;
    background: #ffffff;
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
    vertical-align: middle;
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

.log-table td.mono,
.log-table .mono {
    font-size: 14px;
    color: #6b7280;
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

.empty-note {
    color: #6b7280;
    font-size: 14px;
    padding: 24px 4px;
    text-align: center;
}

/* ---- Pagination (matches ProjectMain.vue / UserMain.vue pagination-bar) ---- */
.pagination-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 4px 0;
}

.pagination-info {
    font-size: 14px;
    color: #6b7280;
}

/* b-table's stacked="md" prop switches into a label/value card list below
   md — style that mode to match the card look used elsewhere in the app. */
@media (max-width: 767px) {
    .log-table.table {
        border: none;
        border-radius: 0;
        background: transparent;
    }

    .log-table.b-table.b-table-stacked-md tbody tr {
        background: #ffffff;
        border: 1px solid #e4e1d8;
        border-radius: 12px;
        box-shadow: 0 1px 2px rgba(28, 30, 36, 0.04);
        margin-bottom: 12px;
        display: block;
        padding: 4px 16px;
    }

    .log-table.b-table.b-table-stacked-md tbody td {
        border-top: none;
        border-bottom: 1px solid #edebe3;
    }

    .log-table.b-table.b-table-stacked-md tbody td:last-child {
        border-bottom: none;
    }

    .pagination-bar {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>