import { API_V2_URL } from "@/common/config";
const axios = require("axios");
export default {
  state: {
    domainlist: {},
    mapCountry: "",
  },
  mutations: {
    //setter
    setDomainSetting(state, payload) {
      state.domainlist = payload;
    },
  },
  getters: {
    getDomainSetting: (state) => {
      return state.domainlist;
    },
  },
  actions: {
    async apiDomainSetting({ commit }, payload) {
      console.log("payload2", payload);
    //   commit("setDomainSetting", true);
      axios
        .get("http://139.59.103.67:3000/api/v2/domain/getDomain")
        .then((res)=> {
          // handle success
          commit("setDomainSetting", res.data);
        })
        .catch((error)=> {
          // handle error
          console.log(error);
        //   commit("setLoadMap", false);
        });
    },
  },
};
