

export default {
  state: {
    isAuthenticated: false,
    user: '',
  },
  getters: {
    isAuthenticated: (state) => {
      return state.isAuthenticated;
    },
    getUser: (state) => {
      return state.user;
    },

  },
  mutations: {
    setLogin(state) {
      state.isAuthenticated = true;
      state.user = 'temp';
    },
    setLogout(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("reftoken");
    },

  },
  actions: {
    
  },
};
