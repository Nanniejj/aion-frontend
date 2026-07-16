import axios from "axios";

// NOTE: This module talks to the API directly with axios, following the
// same request/response pattern as the endpoints you gave me:
//   GET api/v2/project/getProjects
//   GET api/v2/user/getUsers?project_id=...&page=...&limit=...
//
// If your project already has a shared `api.services.js` (like the one
// WordcloudService is imported from in wordcloud.js), it's easy to swap
// these axios calls for e.g. `ProjectService.getProjects()` /
// `UserService.getUsers(params)` instead — just drop them into that file
// and change the two `await axios...` lines below accordingly.

// Adjust/remove this if your app already sets a global axios baseURL
// (e.g. in main.js) or uses a proxy in vue.config.js.
const API_BASE = "https://api2.cognizata.com";
// ⚠️ Security note: this token is hardcoded and will expire (JWTs carry an
// `exp` claim — this one is short-lived, ~1 hour from issue). Hardcoding it
// here means it's committed to source control and everyone who deploys this
// build shares the same expired/expiring credential. For anything beyond
// local testing, switch back to reading the logged-in user's own token:
//   Authorization: "Bearer " + localStorage.getItem("token")
// (kept commented out below both requests so it's easy to switch back).
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNGNhOGMyMTkxZjg5MWY1MmE2MWJhOSIsInByb2plY3RpZCI6IjYwNmFkZDFjYzg3NzdhNzlkMjE2ZWNiMyIsInVzZXJuYW1lIjoieWVsbHlkZXYiLCJyb2xlIjoic3VwZXJhZG1pbiIsIm1pb24iOnRydWUsInRva2VuaWQiOiI2YTU4YWFmM2FjZDBkMzJmYWYzZDcwZjUiLCJpYXQiOjE3ODQxOTU4MjcsImV4cCI6MTc4NDE5OTQyN30.MG-orJQE6WGBQEOeUX6O1Pt291IA0oUZLucfjfdb6ZM";
// --- Field mapping helpers -------------------------------------------------
// ProjectManagement.vue's child components (ProjectCard, ProjectDetail,
// ProjectMain) were originally built against mock.js data, which used
// Mongo extended JSON (`_id.$oid`, `updatedAt.$date`). The real API
// returns `_id` / `createdAt` / `updatedAt` as plain strings instead, and
// the components have been updated to read them directly (no more
// `.$oid` / `.$date`).
//
// mapProject() still bridges the other gap: `userlist` / `domainlist` come
// back as full embedded objects (not ID refs), and the API doesn't return
// `hashtaglist` / `targetlist` / `group_list` / `hotissue_list` /
// `avatarlist` at all — default those to `[]` so `.length` never throws.
function mapProject(raw) {
  return {
    ...raw,
    projectname: raw.projectname || raw.project_name || raw.name || raw.title || "",
    mion: !!raw.mion,
    userlist: raw.userlist || [],
    domainlist: raw.domainlist || [],
    // Not returned by api/v2/project/getProjects today — default to empty
    // so the "โดเมนที่ติดตาม / แฮชแท็ก / เป้าหมาย / กลุ่ม / ประเด็นร้อน"
    // sections render as empty instead of crashing.
    hashtaglist: raw.hashtaglist || [],
    targetlist: raw.targetlist || [],
    group_list: raw.group_list || [],
    hotissue_list: raw.hotissue_list || [],
    avatarlist: raw.avatarlist || [],
  };
}

// UserMain.vue's avatar circle reads `u.initial` — the API doesn't send
// that field, so we derive it here. Without this the avatar renders with
// the right background color but no letter inside it.
function mapUser(raw) {
  const composedName = [raw.name, raw.lastname].filter(Boolean).join(" ").trim();
  const name = composedName || raw.username || raw.full_name || raw.email || "";
  return {
    ...raw,
    name,
    role: raw.role || raw.position || "user",
    initial: name ? name.charAt(0).toUpperCase() : "?",
  };
}

export default {
  state: {
    projects: [],
    users: [],
    usersPagination: {
      project_id: "",
      page: 1,
      limit: 20,
      total: 0,
    },
    loadingProjects: false,
    loadingUsers: false,
  },
  getters: {
    getProjects: (state) => state.projects,
    getUsers: (state) => state.users,
    getUsersPagination: (state) => state.usersPagination,
    getLoadingProjects: (state) => state.loadingProjects,
    getLoadingUsers: (state) => state.loadingUsers,
  },
  mutations: {
    setProjects: (state, payload) => {
      state.projects = payload;
    },
    setUsers: (state, payload) => {
      state.users = payload;
    },
    setUsersPagination: (state, payload) => {
      state.usersPagination = payload;
    },
    setLoadingProjects: (state, payload) => {
      state.loadingProjects = payload;
    },
    setLoadingUsers: (state, payload) => {
      state.loadingUsers = payload;
    },
    addProject: (state, project) => {
      state.projects.unshift(project);
    },
    addUser: (state, user) => {
      state.users.unshift(user);
    },
  },
  actions: {
    async fetchProjects({ commit }) {
      commit("setLoadingProjects", true);
      try {
        const res = await axios.get(`${API_BASE}/api/v2/project/getProjects`, {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          // headers: {
          //   Authorization: "Bearer " + localStorage.getItem("token"),
          //   "Content-Type": "application/json",
          // },
        });
        const list = res.data.results || res.data || [];
        commit("setProjects", list.map(mapProject));
      } catch (error) {
        console.log(error);
      } finally {
        commit("setLoadingProjects", false);
      }
    },

    // payload (all optional): { project_id, page, limit }
    async fetchUsers({ commit }, payload = {}) {
      commit("setLoadingUsers", true);
      
      const params = {
        // project_id: payload.project_id || "606add1cc8777a79d216ecb3",
        // page: payload.page || 2,
        // limit: payload.limit || 20,
      };
      try {
        const res = await axios.get(`${API_BASE}/api/v2/user/getUsers`, {
          params,
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          // headers: {
          //   Authorization: "Bearer " + localStorage.getItem("token"),
          //   "Content-Type": "application/json",
          // },
        });
        const list = res.data.results || res.data || [];
        commit("setUsers", list.map(mapUser));
        commit("setUsersPagination", {
          ...params,
          total: res.data.total || res.data.count || list.length,
        });
      } catch (error) {
        console.log(error);
      } finally {
        commit("setLoadingUsers", false);
      }
    },
  },
};