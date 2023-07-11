const axios = require("axios");
// import { API_V2_URL } from '@/common/config';
export default {
  state: {
    dataissue: [],
    listissue: [],
    slissue: [],
    dateissue: [],
    socialissue:"",
    statusSearch:[],
  },
  getters: {
    getStatusSearch: (state) => {
      return state.statusSearch;
    },
    getSocialIssue: (state) => {
      return state.socialissue;
    },
    getDateIssue: (state) => {
      return state.dateissue;
    },
    getSelectIssue: (state) => {
      return state.slissue;
    },
    getDataIssue: (state) => {
      return state.dataissue;
    },
    getListIssue: (state) => {
      return state.listissue;
    },
  },

  mutations: {
    setStatusSearch: (state,payload) => {
     state.statusSearch= payload;
    },
    setSocialIssue: (state,payload) => {
      state.socialissue=payload;
    },
    setDateIssue: (state, payload) => {
      state.dateissue = payload;
    },
    setSelectIssue: (state, payload) => {
      state.slissue = payload;
    },
    setDataIssue: (state, payload) => {
      state.dataissue = payload;
    },
    setListIssue: (state, payload) => {
      state.listissue = payload;
    },
  },
  actions: {
    //   async fetchListIssue({ commit },payload) {

    //     axios.post(API_V2_URL+'/api/map/geotwitterWithDate',payload)
    //     .then(function (res) {
    //         // handle success
    //         commit('setMapPostList', res.data.results);

    //     })
    //     .catch(function (error) {
    //         // handle error
    //         console.log(error);
    //     });

    //      },
    // }
    async fetchListIssue({ commit }) {
      var config = {
        method: "get",
        url: "https://api2.cognizata.com/api/v2/userposts/getHotissue",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      axios(config)
        .then((response) => {
          commit("setDataIssue", response.data);
          let arr = response.data.map((result) => {
            return result.name;
          });
          commit("setListIssue", ['All',...arr]);
          localStorage.setItem("issue", arr);
        })
        .catch(function(error) {
          // this.$fire({
          //   title: "กรุณาลองอีกครั้ง",
          //   type: "error",
          //   showConfirmButton: false,
          //   timer: 1000,
          // });
          console.log(error);
        });
    },
  },
};
