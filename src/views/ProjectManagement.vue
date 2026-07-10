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
          <b-input-group size="md" class="search-box">
            <b-form-input
              id="filter-input"
              v-model="query"
              type="search"
              name="project-search-query"
              autocomplete="off"
              :readonly="searchLocked"
              @focus="searchLocked = false"
              placeholder="ค้นหาโปรเจกต์หรือสมาชิก..."
            ></b-form-input>
          </b-input-group>
        </div>
      </div>

      <!-- ===== Tabs + create buttons (right-aligned) ===== -->
      <div class="d-flex align-items-center justify-content-between flex-wrap mb-4 tab-row">
        <div class="d-flex flex-wrap tab-buttons">
          <button class="tab-btn" :class="{ active: tab === 'projects' }" @click="tab = 'projects'">
            <b-icon icon="grid"></b-icon>
            Projects
            <span class="count">{{ projects.length }}</span>
          </button>
          <button class="tab-btn" :class="{ active: tab === 'users' }" @click="tab = 'users'">
            <b-icon icon="people"></b-icon>
            Users
            <span class="count">{{ users.length }}</span>
          </button>
        </div>

        <div class="d-flex align-items-center flex-wrap tab-actions">
          <CreateProjectModal :users="users" @created="addProject" />
          <CreateUserModal :projects="projects" @created="addUser" />
        </div>
      </div>

      <ProjectGrid v-if="tab === 'projects'" :projects="filteredProjects" :query="query" @open="openProject" />

      <UserTable v-if="tab === 'users'" :users="filteredUsers" :query="query" />
    </div>

    <!-- ============ DETAIL (FULL PAGE) VIEW ============ -->
    <ProjectDetail v-else :project="activeProject" @close="closeProject" />
  </div>
</template>

<script>
import HomeNav from '@/components/HomeNav.vue';
import ProjectGrid from "../components/projectmanagement/ProjectGrid.vue";
import UserTable from "../components/projectmanagement/UserTable.vue";
import ProjectDetail from "../components/projectmanagement/ProjectDetail.vue";
import CreateProjectModal from "../components/projectmanagement/CreateProjectModal.vue";
import CreateUserModal from "../components/projectmanagement/CreateUserModal.vue";
import { PROJECTS, USERS } from "../components/projectmanagement/mock.js";

export default {
  name: "ProjectManagementView",
  components: { HomeNav, ProjectGrid, UserTable, ProjectDetail, CreateProjectModal, CreateUserModal },
  data() {
    return {
      tab: "projects", // 'projects' | 'users'
      query: "",
      // Starts readonly so Chrome can't autofill it on page load; removed
      // as soon as the user focuses the field (see @focus on the input).
      searchLocked: true,
      view: "list", // 'list' | 'detail'
      activeProject: null,
      projects: PROJECTS,
      users: USERS,
    };
  },
  computed: {
    filteredProjects() {
      const q = this.query.toLowerCase();
      return this.projects.filter((p) => p.projectname.toLowerCase().includes(q));
    },
    filteredUsers() {
      const q = this.query.toLowerCase();
      return this.users.filter(
        (u) => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)
      );
    },
  },
  methods: {
    openProject(project) {
      this.activeProject = project;
      this.view = "detail";
      window.scrollTo(0, 0);
    },
    closeProject() {
      this.view = "list";
      this.activeProject = null;
    },
    addProject(project) {
      this.projects.unshift(project);
    },
    addUser(user) {
      this.users.unshift(user);
    },
  },
};
</script>

<style scoped>
/*
  Self-contained styling for the header + tab row, with fallback values on
  every var(--token, fallback) so it still looks right even if the shared
  theme.css / :root tokens aren't loaded elsewhere in the project.
*/

#dash-app {
  /* background: var(--bg, #f6f5f0); */
  /* color: var(--text, #1c1e24); */
  min-height: 100%;
}

.page-header {
  gap: 16px;
}

.header-actions {
  gap: 10px;
}

.eyebrow {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--muted, #6b7280);
  margin-bottom: 4px;
}

.page-title {
  font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  font-weight: 700;
  font-size: 28px;
  margin: 0;
  /* color: var(--text, #1c1e24); */
}

.search-box {
  max-width: 400px;
}
.search-box >>> .input-group-text {
  background: var(--surface, #ffffff);
  border-color: var(--border, #e4e1d8);
  color: var(--muted, #6b7280);
}
.search-box >>> .form-control {
  background: var(--surface, #ffffff);
  border-color: var(--border, #e4e1d8);
  font-size: 13px;
}
.search-box >>> .form-control:focus {
  box-shadow: 0 0 0 2px rgba(18, 129, 137, 0.15);
  border-color:  #128189;
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
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 11px;
  opacity: 0.75;
}
</style>