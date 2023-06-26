import { API_V2_URL } from "@/common/config";
const axios = require("axios");
export default {
  state: {
    //variable
    mapPostList: {},
    mapCountry: "",
  },
  mutations: {
    //setter
    setMapPostList(state, mapPostList) {
      if (mapPostList !== "") state.mapPostList = mapPostList;
    },
    setMapCountry(state, payload) {
      state.mapCountry = payload;
    },
  },
  getters: {
    getMapPostList: (state) => {
      return state.mapPostList;
    },
    getMapCountry: (state) => {
        return state.mapCountry;
      },
  },
  actions: {
    async fetchMapPostList({ commit }, payload) {
      console.log('payload2', payload);
      commit("setLoadMap", true);
      axios
        .post(API_V2_URL + "/api/map/geotwitter", payload)
        .then(function(res) {
          // handle success
          commit("setMapPostList", res.data.results);
          commit("setLoadMap", false);
        })
        .catch(function(error) {
          // handle error
          console.log(error);
          commit("setLoadMap", false);
        });
    },
    async fetchMapWithDatePostList({ commit }, payload) {
    //   console.log("payload", payload.country_name);
      commit("setLoadMap", true);
     
      axios
        .post(API_V2_URL + "/api/map/geotwitterWithDate", payload)
        .then(function(res) {
          // handle success
          commit("setMapCountry", payload.country_name);
          commit("setLoadMap", false);
          commit("setMapPostList", res.data.results);
        })
        .catch(function(error) {
          // handle error
          console.log(error);
          commit("setLoadMap", false);
        });
    },
  },
};
