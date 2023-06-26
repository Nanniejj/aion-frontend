// const axios = require("axios");
// import { API_V2_URL } from '@/common/config';
export default {
  state: {
    toSection: [],
    roleMion: JSON.parse(localStorage.getItem("roleMion")),
  },
  getters: {
    getToSection: (state) => {
      return state.toSection;
    },
    getRoleMion: (state) => {
      return state.roleMion;
    },
  },

  mutations: {
    setRoleMion: (state, payload) => {
      state.roleMion = payload;
    },
    setToSection: (state, payload) => {
      state.toSection = payload;
    },
  },
  actions: {
    // async fetchListIssue({ commit }) {
    //   var config = {
    //     method: "get",
    //     url: "http://139.59.103.67:3000/api/v2/userposts/getHotissue",
    //     headers: {
    //       Authorization: "Bearer " + localStorage.getItem("token"),
    //       "Content-Type": "application/json",
    //     },
    //   };
    //   axios(config)
    //     .then((response) => {
    //       commit("setDataIssue", response.data);
    //       let arr = response.data.map((result) => {
    //         return result.name;
    //       });
    //       commit("setListIssue", ['All',...arr]);
    //       localStorage.setItem("issue", arr);
    //     })
    //     .catch(function(error) {
    //       this.$fire({
    //         title: "กรุณาลองอีกครั้ง",
    //         type: "error",
    //         showConfirmButton: false,
    //         timer: 1000,
    //       });
    //       console.log(error);
    //     });
    // },
  },
};
