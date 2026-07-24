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

        <div class="d-flex align-items-center flex-wrap header-actions">
          <!-- <b-input-group class="search-box">
            <b-input-group-prepend is-text>
              <b-icon icon="search" font-scale="0.85"></b-icon>
            </b-input-group-prepend>
            <b-form-input v-model="query" placeholder="ค้นหาโปรเจกต์หรือสมาชิก..."></b-form-input>
          </b-input-group> -->
          <b-input-group size="lg" class="search-box">
            <b-form-input
              id="filter-input"
              v-model="query"
              type="text"
              name="project-search-query"
              autocomplete="off"
              :readonly="searchLocked"
              @focus="searchLocked = false"
              placeholder="ค้นหาโปรเจกต์หรือสมาชิก..."
            ></b-form-input>
            <b-input-group-append v-if="query">
              <button type="button" class="search-clear-btn" @click="query = ''" aria-label="ล้างคำค้นหา">
                <b-icon icon="x"></b-icon>
              </button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>

      <!-- ===== Tabs + create buttons (right-aligned) ===== -->
      <div class="d-flex align-items-center justify-content-between flex-wrap mb-4 tab-row">
        <div class="d-flex flex-wrap tab-buttons">
          <button class="tab-btn" :class="{ active: tab === 'projects' }" @click="tab = 'projects'">
            <b-icon icon="grid"></b-icon>
            Projects
            <span class="count">{{ getProjectsPagination.total }}</span>
          </button>
          <button class="tab-btn" :class="{ active: tab === 'users' }" @click="tab = 'users'">
            <b-icon icon="people"></b-icon>
            Users
            <span class="count">{{ getUsersPagination.total }}</span>
          </button>
        </div>

        <div class="d-flex align-items-center flex-wrap tab-actions">
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
          <CreateUserModal v-if="tab === 'users'" />
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

      <EditProjectModal ref="editProjectModal" @updated="onProjectUpdated" />

      <UserMain
        v-if="tab === 'users'"
        :users="users"
        :query="query"
        :pagination="getUsersPagination"
        :loading="getLoadingUsers"
        @change-page="onUsersPageChange"
      />
    </div>

    <!-- ============ DETAIL (FULL PAGE) VIEW ============ -->
    <ProjectDetail v-else :project="activeProject" @close="closeProject" />
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
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ProjectManagementView",
  components: { HomeNav, ProjectMain, UserMain, ProjectDetail, CreateProjectModal, EditProjectModal, CreateUserModal },
  data() {
    return {
      tab: "projects", // 'projects' | 'users'
      query: "",
      // Starts readonly so Chrome can't autofill it on page load; removed
      // as soon as the user focuses the field (see @focus on the input).
      searchLocked: true,
      view: "list", // 'list' | 'detail'
      activeProject: null,
      viewMode: "cards", // 'cards' | 'progress'
      searchTimer: null,
    };
  },
  computed: {
    ...mapGetters(["getProjects", "getUsers", "getUsersPagination", "getProjectsPagination", "getLoadingProjects", "getLoadingUsers"]),
    projects() {
      return this.getProjects;
    },
    users() {
      return this.getUsers;
    },
    // filteredProjects() {
    //   const q = this.query.toLowerCase();
    //   return this.projects.filter((p) => p.projectname.toLowerCase().includes(q));
    // },
    // filteredUsers() {
    //   const q = this.query.toLowerCase();
    //   return this.users.filter(
    //     (u) => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)
    //   );
    // },
  },
  created() {
    this.fetchProjects();
    // project_id/page/limit default to the values you specified;
    // pass a payload here (e.g. { project_id, page, limit }) if these
    // should instead come from the route or the selected project.
    this.fetchUsers({ project_id: "", page: 1, limit: 10 });
  },
  watch: {
    // Debounced server-side search: filteredProjects/filteredUsers give
    // instant feedback on whatever's already loaded, then this refreshes
    // with the real, complete result set from the API shortly after.
    query(val) {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        if (this.tab === "projects") {
          this.searchProjects(val);
        } else {
          this.searchUsers(val);
        }
      }, 300);
    },
    // Switching tabs should always show fresh data for the newly-active
    // tab — re-run the current search term if one's typed, otherwise do a
    // clean unfiltered reload (page 1). Previously this only refreshed
    // when `query` was non-empty, so a tab left in a stale/filtered state
    // from an earlier search stayed stale until you searched again.
    tab(val) {
      if (val === "projects") {
        this.searchProjects(this.query);
      } else {
        this.searchUsers(this.query);
      }
    },
  },
  methods: {
    ...mapActions(["fetchProjects", "fetchUsers", "searchProjects", "searchUsers", "updateProject"]),
    openProject(project) {
      this.activeProject = project;
      this.view = "detail";
      window.scrollTo(0, 0);
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
    onProjectUpdated() {
      // fetchProjects already ran inside EditProjectModal's submit(), so
      // `projects` is already fresh — nothing else to do here. Hook kept
      // in case you want a toast/notification later.
    },
    closeProject() {
      this.view = "list";
      this.activeProject = null;
    },
    onUsersPageChange(page) {
      this.fetchUsers({
        page,
        limit: this.getUsersPagination.limit,
        project_id: this.getUsersPagination.project_id,

      });
    },
    onProjectsPageChange(page) {
      this.fetchProjects({
        page,
        limit: this.getProjectsPagination.limit,
      });
    },
  },
};
</script>

<style scoped>
/*
  Self-contained styling for the header + tab row, with colors hard-coded
  directly (no CSS variables) so it still looks right even if the shared
  theme.css / :root tokens aren't loaded elsewhere in the project.
*/

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

/* .search-box {
  width: 300px;
} */
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
  border-radius: 0 6px 6px 0;
  background: #ffffff;
  color: #6b7280;
  cursor: pointer;
}
.search-clear-btn:hover {
  background: #f6f5f0;
  color: #1c1e24;
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