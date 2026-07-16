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
          <CreateProjectModal v-if="tab === 'projects'" :users="users" @created="addProject" />
          <CreateUserModal v-if="tab === 'users'" :projects="projects" @created="addUser" />
        </div>
      </div>

      <ProjectMain v-if="tab === 'projects'" :projects="filteredProjects" :query="query" @open="openProject" />

      <UserMain v-if="tab === 'users'" :users="filteredUsers" :query="query" />
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
import CreateUserModal from "../components/projectmanagement/users/CreateUserModal.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ProjectManagementView",
  components: { HomeNav, ProjectMain, UserMain, ProjectDetail, CreateProjectModal, CreateUserModal },
  data() {
    return {
      tab: "projects", // 'projects' | 'users'
      query: "",
      // Starts readonly so Chrome can't autofill it on page load; removed
      // as soon as the user focuses the field (see @focus on the input).
      searchLocked: true,
      view: "list", // 'list' | 'detail'
      activeProject: null,
    };
  },
  computed: {
    ...mapGetters(["getProjects", "getUsers"]),
    projects() {
      return this.getProjects;
    },
    users() {
      return this.getUsers;
    },
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
  created() {
    this.fetchProjects();
    // project_id/page/limit default to the values you specified;
    // pass a payload here (e.g. { project_id, page, limit }) if these
    // should instead come from the route or the selected project.
    this.fetchUsers({ project_id: "606add1cc8777a79d216ecb3", page: 2, limit: 20 });
  },
  methods: {
    ...mapActions(["fetchProjects", "fetchUsers"]),
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
      this.$store.commit("addProject", project);
    },
    addUser(user) {
      this.$store.commit("addUser", user);
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
  font-size: 11px;
  opacity: 0.75;
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