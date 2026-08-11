<template>
  <div id="dash-app">
    <HomeNav id="navHome" />
    <!-- ============ LIST VIEW ============ -->
    <div v-if="view === 'list'" class="container-fluid py-4 px-4" style="max-width: 1200px">
      <!-- ===== Header: title + search ===== -->
      <div class="d-flex justify-content-between align-items-start flex-wrap mb-4 page-header">
        <div>
          <h1 class="page-title">Projects & Users Management</h1>
        </div>

        
      </div>

      <!-- ===== Tabs + create buttons (right-aligned) ===== -->
      <div class="d-flex align-items-center justify-content-between flex-wrap mb-4 tab-row">
        <div class="d-flex flex-wrap tab-buttons">
          <button class="tab-btn" :class="{ active: tab === 'projects' }" @click="tab = 'projects'">
            <b-icon icon="grid"></b-icon>
            Projects
            <!-- <span class="count">{{ getProjectsPagination.total }}</span> -->
          </button>
          <button class="tab-btn" :class="{ active: tab === 'users' }" @click="tab = 'users'">
            <b-icon icon="people"></b-icon>
            Users
            <!-- <span class="count">{{ getUsersPagination.total }}</span> -->
          </button>
          <button class="tab-btn" :class="{ active: tab === 'logs' }" @click="tab = 'logs'">
            <b-icon icon="card-list"></b-icon>
            Logs
          </button>
        </div>

        <div v-if="tab !== 'logs'" class="d-flex align-items-center flex-wrap tab-actions">
          <div class="d-flex align-items-center flex-wrap header-actions">
          <b-input-group size="lg" class="search-box">
            <b-form-input
              id="filter-input"
              v-model="query"
              type="search"
              name="project-search-query"
              autocomplete="off"
              :readonly="searchLocked"
              :disabled="isFilterLoading"
              @focus="searchLocked = false"
              @keyup.enter.native="runSearch"
              @input="onQueryInput"
              placeholder="ค้นหา..."
            ></b-form-input>
            <b-input-group-append>
              
              <button
                type="button"
                class="search-submit-btn"
                :disabled="isFilterLoading"
                @click="runSearch"
                aria-label="ค้นหา"
              >
                <b-icon icon="search"></b-icon>
              </button>
            </b-input-group-append>
          </b-input-group>
          <div
            v-if="tab === 'users'"
            class="project-filter"
            :class="{ disabled: isFilterLoading }"
            ref="projectFilterRoot"
          >
            <button
              type="button"
              class="project-filter-btn"
              @click="toggleProjectDropdown"
              :disabled="isFilterLoading"
              aria-haspopup="listbox"
              :aria-expanded="projectDropdownOpen"
            >
              <span class="project-filter-label">{{ projectFilterLabel }}</span>
              <b-icon icon="chevron-down"></b-icon>
            </button>
            <div
              v-if="projectDropdownOpen"
              class="project-filter-menu"
            >
              <input
                type="text"
                class="project-filter-search"
                v-model="projectFilterQuery"
                placeholder="ค้นหาโปรเจกต์..."
                autocomplete="off"
                @click.stop
                ref="projectFilterSearchInput"
              />
              <div
                class="project-filter-list"
                role="listbox"
                @scroll="onProjectDropdownScroll"
                ref="projectDropdownMenu"
              >
                <div
                  class="project-filter-option"
                  :class="{ active: projectFilter === '' }"
                  role="option"
                  @click="selectProjectFilter('')"
                >
                  ทุกโปรเจกต์
                </div>
                <div
                  v-for="p in getProjectPicker.items"
                  :key="p._id"
                  class="project-filter-option"
                  :class="{ active: projectFilter === p._id }"
                  role="option"
                  @click="selectProjectFilter(p._id)"
                >
                  {{ p.projectname }}
                </div>
                <div v-if="getProjectPicker.loading" class="project-filter-loading">กำลังโหลด...</div>
                <div
                  v-else-if="!getProjectPicker.items.length"
                  class="project-filter-loading"
                >
                  ไม่พบโปรเจกต์
                </div>
              </div>
            </div>
          </div>
          <select
            v-if="tab === 'users'"
            v-model="roleFilter"
            class="project-filter-btn w-auto"
            :disabled="isFilterLoading"
            aria-label="กรอง Role"
          >
            <option value="">ทุก Role</option>
            <option value="superadmin">Superadmin</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="service">Service</option>
          </select>
          <CreateUserModal v-if="tab === 'users'" @created="onUserCreated" />
        </div>
          <div v-if="tab === 'projects'" class="view-toggle" role="group" aria-label="สลับรูปแบบการแสดงผล">
            <button
              type="button"
              class="view-toggle-btn"
              :class="{ active: viewMode === 'cards' }"
              @click="viewMode = 'cards'"
            >
              <i class="fas fa-credit-card"></i> Cards
            </button>
            <button
              type="button"
              class="view-toggle-btn"
              :class="{ active: viewMode === 'progress' }"
              @click="viewMode = 'progress'"
            >
              <i class="fas fa-table"></i> Table
            </button>
          </div>
          <CreateProjectModal v-if="tab === 'projects'" />
          
        </div>
      </div>

      <ProjectMain
        v-if="tab === 'projects'"
        :projects="projects"
        :query="query"
        :view-mode="viewMode"
        :pagination="getProjectsPagination"
        :loading="getLoadingProjects"
        @open="openProject"
        @change-page="onProjectsPageChange"
        @edit="onEditProject"
        @close="onCloseProject"
      />

      <UserMain
        v-if="tab === 'users'"
        :users="filteredUsersByRole"
        :query="query"
        :pagination="getUsersPagination"
        :loading="getLoadingUsers"
        @change-page="onUsersPageChange"
        @delete="onProjectUpdated"
        @updated="onUserUpdated"
      />

      <LogsMain v-if="tab === 'logs'" />
    </div>

    <!-- ============ DETAIL (FULL PAGE) VIEW ============ -->
    <ProjectDetail v-else :project="activeProject" @close="closeProject" @edit="onEditProject" />

    <!-- Rendered unconditionally (not inside the list-view v-if) so
         $refs.editProjectModal still exists and .open() works when the
         "แก้ไข" button is clicked from the ProjectDetail full-page view too. -->
    <EditProjectModal ref="editProjectModal" @updated="onProjectUpdated" />
  </div>
</template>

<script>
import HomeNav from '@/components/HomeNav.vue';
import ProjectMain from "../components/projectmanagement/ProjectMain.vue";
import UserMain from "../components/projectmanagement/UserMain.vue";
import ProjectDetail from "../components/projectmanagement/project/ProjectDetail.vue";
import CreateProjectModal from "../components/projectmanagement/project/CreateProjectModal.vue";
import EditProjectModal from "../components/projectmanagement/project/EditProjectModal.vue";
import CreateUserModal from "../components/projectmanagement/users/CreateUserModal.vue";
import LogsMain from "../components/projectmanagement/LogsMain.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ProjectManagementView",
  components: { HomeNav, ProjectMain, UserMain, ProjectDetail, CreateProjectModal, EditProjectModal, CreateUserModal, LogsMain },
  data() {
    return {
      tab: "projects", // 'projects' | 'users'
      query: "",
      roleFilter: "",
      projectFilter: "",
      projectDropdownOpen: false,
      projectFilterName: "",
      projectFilterQuery: "",
      projectFilterSearchTimer: null,
      searchLocked: true,
      view: "list", // 'list' | 'detail'
      activeProject: null,
      viewMode: "cards", // 'cards' | 'progress'
    };
  },
  computed: {
    ...mapGetters([
      "getProjects",
      "getUsers",
      "getUsersPagination",
      "getProjectsPagination",
      "getLogsPagination",
      "getLoadingProjects",
      "getLoadingUsers",
      "getProjectPicker",
    ]),
    projects() {
      return this.getProjects;
    },
    users() {
      return this.getUsers;
    },
    // Label shown on the project-filter dropdown button.
    projectFilterLabel() {
      if (!this.projectFilter) return "ทุกโปรเจกต์";
      return this.projectFilterName || "โปรเจกต์ที่เลือก";
    },
    filteredUsersByRole() {
      if (!this.roleFilter) return this.users;
      return this.users.filter((u) => u.role === this.roleFilter);
    },
    isFilterLoading() {
      return this.tab === "projects" ? this.getLoadingProjects : this.getLoadingUsers;
    },
  },
  created() {
    this.fetchProjects();
    this.fetchUsersFiltered(1);
  },
  mounted() {
    document.addEventListener("click", this.handleProjectDropdownOutsideClick);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleProjectDropdownOutsideClick);
  },
  watch: {

    // `query` no longer auto-fires the search while typing — the search
    // button (or Enter) triggers it explicitly via runSearch(). Switching
    // tabs clears whatever was typed and reloads that tab unfiltered,
    // since a query typed for one tab (e.g. project names) isn't a
    // meaningful filter for the other (e.g. users).
    tab() {
      this.query = "";
      if (this.tab === "projects") {
        this.searchProjects("");
      } else {
        this.fetchUsersFiltered(1);
      }
    },
    
    roleFilter() {
      this.fetchUsersFiltered(1);
    },
    
    projectFilter() {
      this.fetchUsersFiltered(1);
    },
    projectFilterQuery(val) {
      clearTimeout(this.projectFilterSearchTimer);
      this.projectFilterSearchTimer = setTimeout(() => {
        this.searchProjectPicker(val);
      }, 300);
    },
  },
  methods: {
    ...mapActions([
      "fetchProjects",
      "fetchUsers",
      "searchProjects",
      "updateProject",
      "fetchProjectPickerPage",
      "resetProjectPicker",
      "searchProjectPicker",
    ]),
    openProject(project) {
      this.activeProject = project;
      this.view = "detail";
      window.scrollTo(0, 0);
    },
    // Explicit search trigger — the search button (or Enter) calls this
    // directly instead of the query being watched/debounced as the user
    // types.
    runSearch() {
      if (this.tab === "projects") {
        this.searchProjects(this.query);
      } else {
        this.fetchUsersFiltered(1);
      }
    },
    // type="search" inputs render a native browser "x" clear button —
    // clicking it empties the field via the DOM directly, which v-model
    // picks up, but no keyup/click handler of ours fires. Catch that
    // specific transition here and reload rather than leaving stale
    // filtered results on screen.
    onQueryInput(val) {
      if (!val) {
        this.runSearch();
      }
    },
    onEditProject(project) {
      this.$refs.editProjectModal.open(project);
    },
    async onCloseProject(project) {
      if (!window.confirm(`ต้องการปิดโปรเจกต์ "${project.projectname}" ใช่หรือไม่?`)) return;
      try {
        await this.updateProject({
          _id: project._id,
          projectname: project.projectname,
          mion: false,
          domainlist: (project.domainlist || []).map((d) => d._id),
          userlist: (project.userlist || []).map((u) => u._id),
        });
        await this.fetchProjects({ page: 1 });
      } catch (err) {
        console.log(err);
      }
    },
    onProjectUpdated(project) {
      if (!project || !this.activeProject || project._id !== this.activeProject._id) return;
      const refreshed = this.projects.find((p) => p._id === project._id);
      this.activeProject = refreshed || project;
    },
    onUserUpdated() {
      this.fetchUsersFiltered(1);
    },
    onUserCreated() {
      this.fetchUsersFiltered(1);
    },
    closeProject() {
      this.view = "list";
      this.activeProject = null;
    },
    fetchUsersFiltered(page) {
      this.fetchUsers({
        project_id: this.projectFilter,
        page: page || 1,
        limit: 10,
        search: this.query,
        role: this.roleFilter,
      });
    },
    toggleProjectDropdown() {
      if (this.isFilterLoading) return;
      if (this.projectDropdownOpen) {
        this.closeProjectDropdown();
        return;
      }
      this.projectDropdownOpen = true;
      if (!this.getProjectPicker.items.length && !this.getProjectPicker.loading) {
        this.fetchProjectPickerPage();
      }
      this.$nextTick(() => {
        if (this.$refs.projectFilterSearchInput) this.$refs.projectFilterSearchInput.focus();
      });
    },
    onProjectDropdownScroll(e) {
      const el = e.target;
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 60) {
        this.fetchProjectPickerPage();
      }
    },
    selectProjectFilter(id) {
      this.projectFilter = id;
      const match = this.getProjectPicker.items.find((p) => p._id === id);
      this.projectFilterName = match ? match.projectname : "";
      this.closeProjectDropdown();
    },
    // Closes the dropdown and clears its search box + loaded picker
    // items — otherwise the next time it's opened it silently shows
    // whatever page a previous search left behind (e.g. still filtered
    // to "root" even though the search box looks empty) instead of the
    // full project list.
    closeProjectDropdown() {
      this.projectDropdownOpen = false;
      clearTimeout(this.projectFilterSearchTimer);
      if (this.projectFilterQuery) {
        this.projectFilterQuery = "";
      } else {
        this.resetProjectPicker("");
      }
    },
    handleProjectDropdownOutsideClick(e) {
      if (
        this.projectDropdownOpen &&
        this.$refs.projectFilterRoot &&
        !this.$refs.projectFilterRoot.contains(e.target)
      ) {
        this.closeProjectDropdown();
      }
    },
    onUsersPageChange(page) {
      if (page === this.getUsersPagination.page) return;
      this.fetchUsersFiltered(page);
    },
    onProjectsPageChange(page) {
      if (page === this.getProjectsPagination.page) return;
      this.fetchProjects({
        page,
        limit: this.getProjectsPagination.limit,
      });
    },
  },
};
</script>

<style scoped>

#dash-app {
  /* background: #f6f5f0; */
  /* color: #1c1e24; */
  min-height: 100%;
}

.page-header {
  gap: 16px;
}

.header-actions {
  gap: 10px;
}

.eyebrow {
  font-size: 11px;
  letter-spacing: 0.12em;
  color: #6b7280;
  margin-bottom: 4px;
}

.page-title {
  text-align: start;
  font-weight: 700;
  font-size: 28px;
  margin: 0;
  /* color: #1c1e24; */
}

.search-box {
  width: 280px;
  flex: 0 0 auto;
}
.search-box >>> .input-group-text {
  background: #ffffff;
  border-color: #e4e1d8;
  color: #6b7280;
}
.search-box >>> .form-control {
  background: #ffffff;
  border-color: #e4e1d8;
  font-size: 13px;
}
.search-box >>> .form-control:focus {
  box-shadow: 0 0 0 2px rgba(18, 129, 137, 0.15);
  border-color:  #128189;
}
.search-box >>> .input-group-append {
  display: flex;
}
.search-clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border: 1px solid #e4e1d8;
  border-left: none;
  background: #ffffff;
  color: #6b7280;
  cursor: pointer;
}
.search-clear-btn:hover {
  background: #f6f5f0;
  color: #1c1e24;
}
.search-submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  border: 1px solid #128189;
  border-left: none;
  border-radius: 0 6px 6px 0;
  background: #128189;
  color: #ffffff;
  cursor: pointer;
}
.search-submit-btn:hover {
  background: #0e6870;
}
.search-submit-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.search-submit-btn:disabled:hover {
  background: #128189;
}
.search-box >>> .form-control:disabled {
  background: #f6f5f0;
  cursor: not-allowed;
}
.search-clear-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.search-clear-btn:disabled:hover {
  background: #ffffff;
  color: #6b7280;
}

.project-filter {
  position: relative;
  flex: 0 0 auto;
}
.project-filter-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 160px;
  padding: 0.375rem 0.75rem;
  border: 1px solid #e4e1d8;
  border-radius: 6px;
  background: #ffffff;
  color: #1c1e24;
  font-size: 14px;
  cursor: pointer;
}
.project-filter-btn:hover {
  border-color: #128189;
}
.project-filter.disabled .project-filter-btn,
.project-filter-btn:disabled {
  background: #f6f5f0;
  cursor: not-allowed;
}
.project-filter-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.project-filter-menu {
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
.project-filter-search {
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
.project-filter-search:focus {
  box-shadow: inset 0 0 0 2px rgba(18, 129, 137, 0.15);
}
.project-filter-list {
  max-height: 240px;
  overflow-y: auto;
}
.project-filter-option {
  padding: 8px 12px;
  font-size: 13px;
  color: #1c1e24;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.project-filter-option:hover {
  background: #f6f5f0;
}
.project-filter-option.active {
  background: rgba(18, 129, 137, 0.1);
  color: #128189;
  font-weight: 600;
}
.project-filter-loading {
  padding: 8px 12px;
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

.role-filter-select {
  height: 100%;
  min-height: 46px;
  flex: 0 0 auto;
  border: 1px solid #e4e1d8;
  border-radius: 6px;
  background: #ffffff;
  color: #1c1e24;
  font-size: 13px;
  padding: 0 12px;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.role-filter-select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(18, 129, 137, 0.15);
  border-color: #128189;
}

.tab-row {
  gap: 12px;
}

.tab-buttons {
  gap: 8px;
}

.tab-actions {
  gap: 10px;
}

.view-toggle {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border: 1px solid #e4e1d8;
  border-radius: 9px;
  background: #ffffff;
}

.view-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  border-radius: 6px;
  background: transparent;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.view-toggle-btn:hover {
  color: #664b90;
}
.view-toggle-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(102, 75, 144, 0.25);
}
.view-toggle-btn.active {
  background: #664b90;
  color: #ffffff;
  box-shadow: 0 1px 2px rgba(28, 30, 36, 0.12);
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 8px;
  padding: 7px 16px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid  #e4e1d8;
  background:  #ffffff;
  color:  #5a3f04;
  cursor: pointer;
  transition: all 0.15s ease;
}
.tab-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px #E0A458;
}
.tab-btn.active {
  background: #fed16e;
  border-color: #E0A458;
  color: #5a3f04;
}
.tab-btn .count {
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
.tab-btn.active .count {
  background: #5a3f04;
  color: #ffe1a8;
}

@media (max-width: 640px) {
  .header-actions {
    width: 100% !important;
  }

  .page-title {
    text-align: start;
    font-weight: 700;
    font-size: 20px;
    margin: 0;
  }
}

</style>