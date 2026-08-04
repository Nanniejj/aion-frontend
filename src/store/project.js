import axios from "axios";
const API_BASE = "https://api2.cognizata.com";

function mapProject(raw) {
  return { ...raw };
}

function formatThaiDate(iso) {
  if (!iso) return "-";
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const d = new Date(iso);
  if (isNaN(d)) return "-";
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
}

function mapUser(raw) {
  const composedName = [raw.name, raw.lastname].filter(Boolean).join(" ").trim();
  const name = composedName || raw.username || raw.full_name || raw.email || "";
  return {
    ...raw,
    role: raw.role || raw.position || "user",
    initial: name ? name.charAt(0).toUpperCase() : "?",
    // API returns isActive (boolean), not a ready-made status label.
    status: raw.isActive === false ? "ระงับการใช้งาน" : "ใช้งานอยู่",
    // API returns createdAt, not a pre-formatted "joined" string.
    joined: formatThaiDate(raw.createdAt),
    company: raw.company || "-",
    // Some users (e.g. legacy accounts) have no project_id/projectname at all.
    projectname: raw.projectname || "-",
  };
}

function authHeaders() {
  return {
    Authorization: "Bearer " + localStorage.getItem("token"),
    "Content-Type": "application/json",
  };
}

// Shared GET helper for the two list endpoints that are each called from
// more than one place (getProjects: fetchProjects + fetchProjectPickerPage;
// getUsers: fetchUsers + fetchUserPickerList). Centralizes the endpoint
// path, headers, and the `results`/`pagination` response-shape parsing so
// there's exactly one spot to update if either ever changes.
async function apiGetProjects(params) {
  const res = await axios.get(`${API_BASE}/api/v2/project/getProjects`, {
    params,
    headers: authHeaders(),
  });
  return {
    list: (res.data.results || res.data || []).map(mapProject),
    apiPagination: res.data.pagination || {},
  };
}

async function apiGetUsers(params) {
  const res = await axios.get(`${API_BASE}/api/v2/user/getUsers`, {
    params,
    headers: authHeaders(),
  });
  return {
    list: (res.data.results || res.data || []).map(mapUser),
    apiPagination: res.data.pagination || {},
  };
}

function mapLog(raw) {
  return { ...raw };
}

async function apiGetAuditLogs(params) {
  const res = await axios.get(`${API_BASE}/api/v2/auditLog/getAuditLogs`, {
    params,
    headers: authHeaders(),
  });
  return {
    // The real response nests the log entries under `data`, not
    // `results` — unlike getProjects/getUsers above.
    list: (res.data.data || []).map(mapLog),
    apiPagination: res.data.pagination || {},
    summary: res.data.summary || { total: 0, success: 0, failed: 0 },
  };
}

// The {page, limit, total, totalPages} shape is computed identically in
// three places (fetchProjects, fetchUsers, fetchProjectPickerPage) —
// prefer whatever the server echoed back, falling back to what we asked
// for / what we can derive locally.
function resolvePaginationMeta(apiPagination, { page, limit, total }) {
  const resolvedTotal = apiPagination.total ?? total;
  return {
    page: apiPagination.page || page,
    limit: apiPagination.limit || limit,
    total: resolvedTotal,
    totalPages:
      apiPagination.totalPages ?? Math.max(1, Math.ceil(resolvedTotal / (apiPagination.limit || limit))),
  };
}

export default {
  state: {
    projects: [],
    projectsPagination: {
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 0,
      search: "",
    },
    users: [],
    usersPagination: {
      project_id: "",
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      search: "",
    },
    // Separate, paginated project list for the searchable/scrollable
    // project picker dropdown (EditUserModal/CreateUserModal), so paging
    // through it never affects the full `projects` list used elsewhere.
    projectPicker: {
      items: [],
      page: 0,
      limit: 20,
      total: 0,
      totalPages: 0,
      loading: false,
      search: "",
    },
    loadingProjects: false,
    loadingUsers: false,
    domains: [],
    loadingDomains: false,
    // Separate user list for CreateProjectModal's checkbox picklist, so
    // opening that modal never overwrites the `users`/`usersPagination`
    // the Users tab is currently showing (e.g. a search or page the admin
    // already had open there).
    userPicker: {
      items: [],
      loading: false,
    },
    // Monotonically increasing counters used to discard stale responses
    // when a newer search/page request has already been issued before an
    // older one comes back (fixes "clearing search doesn't reset the list"
    // when responses arrive out of order).
    projectsFetchToken: 0,
    usersFetchToken: 0,
    auditLogs: [],
    auditLogsPagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      start_date: "",
      end_date: "",
      project_id: "",
      user_id: "",
      search: "",
      method: "",
    },
    loadingAuditLogs: false,
    auditLogsFetchToken: 0,
    auditLogsSummary: { total: 0, success: 0, failed: 0 },
  },
  getters: {
    getProjects: (state) => state.projects,
    getProjectsPagination: (state) => state.projectsPagination,
    getProjectPicker: (state) => state.projectPicker,
    getUsers: (state) => state.users,
    getUsersPagination: (state) => state.usersPagination,
    getLoadingProjects: (state) => state.loadingProjects,
    getLoadingUsers: (state) => state.loadingUsers,
    getDomainList: (state) => state.domains,
    getLoadingDomains: (state) => state.loadingDomains,
    getUserPicker: (state) => state.userPicker,
    getAuditLogs: (state) => state.auditLogs,
    getAuditLogsPagination: (state) => state.auditLogsPagination,
    getLoadingAuditLogs: (state) => state.loadingAuditLogs,
    getAuditLogsSummary: (state) => state.auditLogsSummary,
  },
  mutations: {
    setProjects: (state, payload) => {
      state.projects = payload;
    },
    setProjectsPagination: (state, payload) => {
      state.projectsPagination = payload;
    },
    setProjectPicker: (state, payload) => {
      state.projectPicker = payload;
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
    setDomains: (state, payload) => {
      state.domains = payload;
    },
    setLoadingDomains: (state, payload) => {
      state.loadingDomains = payload;
    },
    setUserPicker: (state, payload) => {
      state.userPicker = payload;
    },
    bumpProjectsFetchToken: (state) => {
      state.projectsFetchToken++;
    },
    bumpUsersFetchToken: (state) => {
      state.usersFetchToken++;
    },
    addProject: (state, project) => {
      state.projects.unshift(project);
    },
    addUser: (state, user) => {
      state.users.unshift(user);
    },
    updateUserInList: (state, user) => {
      const idx = state.users.findIndex((u) => u._id === user._id);
      if (idx !== -1) state.users.splice(idx, 1, user);
    },
    setAuditLogs: (state, payload) => {
      state.auditLogs = payload;
    },
    setAuditLogsPagination: (state, payload) => {
      state.auditLogsPagination = payload;
    },
    setLoadingAuditLogs: (state, payload) => {
      state.loadingAuditLogs = payload;
    },
    bumpAuditLogsFetchToken: (state) => {
      state.auditLogsFetchToken++;
    },
    setAuditLogsSummary: (state, payload) => {
      state.auditLogsSummary = payload;
    },
  },
  actions: {
    // payload (all optional): { page, limit, search }
    async fetchProjects({ commit, state }, payload = {}) {
      commit("setLoadingProjects", true);
      commit("bumpProjectsFetchToken");
      const myToken = state.projectsFetchToken;

      const page = payload.page || state.projectsPagination.page || 1;
      const limit = payload.limit || state.projectsPagination.limit || 12;
      const search =
        payload.search !== undefined ? payload.search : state.projectsPagination.search || "";

      const params = { page, limit };
      // NOTE: assumes the backend accepts a `search` query param on
      // getProjects — adjust the param name here if the real API differs.
      if (search) params.search = search;

      try {
        const { list, apiPagination } = await apiGetProjects(params);
        // A newer fetchProjects call was issued while this one was still
        // in flight (e.g. the admin kept typing/cleared the search) — its
        // result is stale, discard it so it can't clobber the newer one.
        if (myToken !== state.projectsFetchToken) return;

        commit("setProjects", list);
        commit("setProjectsPagination", {
          ...resolvePaginationMeta(apiPagination, { page, limit, total: list.length }),
          search,
        });
      } catch (error) {
        console.log(error);
      } finally {
        if (myToken === state.projectsFetchToken) commit("setLoadingProjects", false);
      }
    },

    // Convenience: resets to page 1 with a new search term, then loads it.
    // Call this (debounced) as the admin types in the projects search box.
    async searchProjects({ dispatch }, query) {
      return dispatch("fetchProjects", { page: 1, search: query || "" });
    },

    // Convenience wrapper: change page while keeping current limit.
    async setProjectsPage({ dispatch, state }, page) {
      return dispatch("fetchProjects", {
        page,
        limit: state.projectsPagination.limit,
      });
    },

    // payload (all optional): { project_id, page, limit, search }
    async fetchUsers({ commit, state }, payload = {}) {
      commit("setLoadingUsers", true);
      commit("bumpUsersFetchToken");
      const myToken = state.usersFetchToken;

      const page = payload.page || state.usersPagination.page || 1;
      const limit = payload.limit || state.usersPagination.limit || 10;
      const project_id =
        payload.project_id !== undefined
          ? payload.project_id
          : state.usersPagination.project_id || "";
      const search =
        payload.search !== undefined ? payload.search : state.usersPagination.search || "";

      const params = { page, limit };
      if (project_id) params.project_id = project_id;
      // NOTE: assumes the backend accepts a `search` query param on
      // getUsers — adjust the param name here if the real API differs.
      if (search) params.search = search;

      try {
        const { list, apiPagination } = await apiGetUsers(params);
        // A newer fetchUsers call was issued while this one was still in
        // flight — its result is stale, discard it so it can't clobber
        // the newer one (same fix as fetchProjects above).
        if (myToken !== state.usersFetchToken) return;

        commit("setUsers", list);
        commit("setUsersPagination", {
          project_id,
          ...resolvePaginationMeta(apiPagination, { page, limit, total: list.length }),
          search,
        });
      } catch (error) {
        console.log(error);
      } finally {
        if (myToken === state.usersFetchToken) commit("setLoadingUsers", false);
      }
    },

    // Convenience: resets to page 1 with a new search term, then loads it.
    // Call this (debounced) as the admin types in the users search box.
    async searchUsers({ dispatch }, query) {
      return dispatch("fetchUsers", { page: 1, search: query || "" });
    },

    // payload (all optional): { page, limit, start_date, end_date,
    // project_id, user_id, search, method }
    // e.g. dispatch("getLogs", {
    //   page: 1, limit: 20,
    //   start_date: "2026-07-01T00:00:00", end_date: "2026-08-04T23:59:59",
    //   project_id: "6a59ee4456f7ea7655a5476f", user_id: "6a7177966bc06796926905fd",
    //   search: "root", method: "get",
    // })
    async getLogs({ commit, state }, payload = {}) {
      commit("setLoadingAuditLogs", true);
      commit("bumpAuditLogsFetchToken");
      const myToken = state.auditLogsFetchToken;

      const page = payload.page || state.auditLogsPagination.page || 1;
      const limit = payload.limit || state.auditLogsPagination.limit || 20;
      const start_date =
        payload.start_date !== undefined
          ? payload.start_date
          : state.auditLogsPagination.start_date || "";
      const end_date =
        payload.end_date !== undefined ? payload.end_date : state.auditLogsPagination.end_date || "";
      const project_id =
        payload.project_id !== undefined
          ? payload.project_id
          : state.auditLogsPagination.project_id || "";
      const user_id =
        payload.user_id !== undefined ? payload.user_id : state.auditLogsPagination.user_id || "";
      const search =
        payload.search !== undefined ? payload.search : state.auditLogsPagination.search || "";
      const method =
        payload.method !== undefined ? payload.method : state.auditLogsPagination.method || "";

      const params = { page, limit };
      if (start_date) params.start_date = start_date;
      if (end_date) params.end_date = end_date;
      if (project_id) params.project_id = project_id;
      if (user_id) params.user_id = user_id;
      if (search) params.search = search;
      if (method) params.method = method;

      try {
        const { list, apiPagination, summary } = await apiGetAuditLogs(params);
        // A newer getLogs call was issued while this one was still in
        // flight — its result is stale, discard it so it can't clobber
        // the newer one (same fix as fetchProjects/fetchUsers above).
        if (myToken !== state.auditLogsFetchToken) return;

        commit("setAuditLogs", list);
        commit("setAuditLogsSummary", summary);
        commit("setAuditLogsPagination", {
          // The audit-log endpoint already returns a complete pagination
          // object (page/limit/total/totalPages/hasNextPage/
          // hasPreviousPage) — unlike getProjects/getUsers, there's
          // nothing to derive here, so use it as-is instead of
          // resolvePaginationMeta.
          page: apiPagination.page || page,
          limit: apiPagination.limit || limit,
          total: apiPagination.total ?? list.length,
          totalPages: apiPagination.totalPages ?? 1,
          hasNextPage: !!apiPagination.hasNextPage,
          hasPreviousPage: !!apiPagination.hasPreviousPage,
          start_date,
          end_date,
          project_id,
          user_id,
          search,
          method,
        });
        return list;
      } catch (error) {
        console.log(error);
      } finally {
        if (myToken === state.auditLogsFetchToken) commit("setLoadingAuditLogs", false);
      }
    },

    // payload: { projectname, domainlist: [domainId, ...], userlist: [userId, ...] }
    // NOTE: endpoint name/path is assumed to follow the getProjects
    // convention (/api/v2/project/createProject) — adjust if the real
    // backend route differs.
    // Deliberately does NOT commit("addProject", ...) here — the caller
    // (CreateProjectModal) re-fetches the full list right after a
    // successful create, which is the authoritative source of truth for
    // ordering/pagination/total. Committing here too would just cause a
    // brief duplicate-then-replace flash.
    async createProject(_, payload) {
      const res = await axios.post(`${API_BASE}/api/v2/project/createProject`, payload, {
        headers: authHeaders(),
      });
      const raw = res.data.result || res.data.project || res.data;
      return mapProject(raw);
    },

    // payload: { _id, projectname, mion, domainlist: [domainId, ...], userlist: [userId, ...] }
    // NOTE: same endpoint-naming assumption as createProject — adjust the
    // path/method if the real backend differs (guessed PUT .../updateProject/:id).
    async updateProject(_, payload) {
      const { _id, ...body } = payload;
      const res = await axios.put(`${API_BASE}/api/v2/project/updateProject/${_id}`, body, {
        headers: authHeaders(),
      });
      const raw = res.data.result || res.data.project || res.data;
      return mapProject({ _id, ...raw });
    },

    // NOTE: same endpoint-naming assumption — adjust if the real backend
    // differs (guessed DELETE .../deleteProject/:id).
    async deleteProject({ commit, state }, projectId) {
      await axios.delete(`${API_BASE}/api/v2/project/deleteProject/${projectId}`, {
        headers: authHeaders(),
      });
      commit(
        "setProjects",
        state.projects.filter((p) => p._id !== projectId)
      );
    },

    // Convenience wrapper: change page while keeping current project_id/limit.
    async setUsersPage({ dispatch, state }, page) {
      return dispatch("fetchUsers", {
        page,
        limit: state.usersPagination.limit,
        project_id: state.usersPagination.project_id,
      });
    },

    async createUser({ commit }, payload) {
      const res = await axios.post(`${API_BASE}/api/v2/user/createUser`, payload, {
        headers: authHeaders(),
      });
      const raw = res.data.result || res.data.user || res.data;
      const user = mapUser(raw);
      commit("addUser", user);
      return user;
    },

    async updateUserDetails({ commit }, payload) {
      const { _id, ...body } = payload;
      const res = await axios.put(`${API_BASE}/api/v2/user/updateUser/${_id}`, body, {
        headers: authHeaders(),
      });
      // const raw = res.data.result || res.data.user || res.data;
      // const user = mapUser({ _id, ...raw });
      // commit("updateUserInList", user);
      // return user;
    },
    
    resetProjectPicker({ commit, state }, search = "") {
      commit("setProjectPicker", {
        items: [],
        page: 0,
        limit: state.projectPicker.limit,
        total: 0,
        totalPages: 0,
        loading: false,
        search,
      });
    },

    async fetchProjectPickerPage({ commit, state }) {
      const picker = state.projectPicker;
      if (picker.loading) return;
      if (picker.totalPages && picker.page >= picker.totalPages) return;

      const page = picker.page + 1;
      const limit = picker.limit;
      commit("setProjectPicker", { ...picker, loading: true });

      try {
        const params = { page, limit };
       
        if (picker.search) params.search = picker.search;

        const { list, apiPagination } = await apiGetProjects(params);
        const total = apiPagination.total ?? (page === 1 ? list.length : state.projectPicker.total);
        const meta = resolvePaginationMeta(apiPagination, { page, limit, total });
        commit("setProjectPicker", {
          items: page === 1 ? list : state.projectPicker.items.concat(list),
          ...meta,
          loading: false,
          search: picker.search,
        });
      } catch (error) {
        console.log(error);
        commit("setProjectPicker", { ...state.projectPicker, loading: false });
      }
    },

    async searchProjectPicker({ dispatch }, query) {
      await dispatch("resetProjectPicker", query || "");
      return dispatch("fetchProjectPickerPage");
    },
    async fetchDomainList({ commit }, payload = {}) {
      commit("setLoadingDomains", true);
      try {
        const res = await axios.get(`${API_BASE}/api/v2/domain/getDomainAll`, {
          params: payload,
          headers: authHeaders(),
        });
        
        const list = res.data.data || res.data.results || res.data || [];
        commit("setDomains", Array.isArray(list) ? list : []);
      } catch (error) {
        console.log(error);
      } finally {
        commit("setLoadingDomains", false);
      }
    },

    async fetchUserPickerList({ commit }) {
      commit("setUserPicker", { items: [], loading: true });
      try {
        const { list } = await apiGetUsers({ page: 1, limit: 200 });
        commit("setUserPicker", { items: list, loading: false });
      } catch (error) {
        console.log(error);
        commit("setUserPicker", { items: [], loading: false });
      }
    },
  },
};