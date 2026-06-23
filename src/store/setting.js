import { API_V2_URL } from "@/common/config";
const axios = require("axios");
export default {
  state: {
    domainlist: {},
    mapCountry: "",
    cloneDomainResult: {},
  },
  mutations: {
    //setter
    setDomainSetting(state, payload) {
      state.domainlist = payload;
    },
    setCloneDomain(state, payload) {
      state.cloneDomainResult = payload;
    },
  },
  getters: {
    getDomainSetting: (state) => {
      return state.domainlist;
    },
    getCloneDomain: (state) => {
      return state.cloneDomainResult;
    },
  },
  actions: {
    async apiDomainSetting({ commit }, payload) {
      console.log("payload2", payload);
    //   commit("setDomainSetting", true);
      axios
        .get("https://api2.cognizata.com/api/v2/domain/getDomain")
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
    async cloneDomain({ commit }, payload) {
      console.log("cloneDomain payload", payload);
      return axios
        .post("https://api2.cognizata.com/api/v2/setting/cloneDomain", {
          domain_id: payload.domain_id,
          new_domain_name: payload.new_domain_name, //ชื่อโดเมนใหม่
          subdomain_suffix: payload.subdomain_suffix, //คำต่อท้ายชื่อ subdomain เดิม
          object_suffix: payload.object_suffix, //คำต่อท้ายชื่อ object เดิม
        })
        .then((res) => {
          // handle success
          commit("setCloneDomain", res.data);
          return res.data;
        })
        .catch((error) => {
          // handle error
          console.log(error);
          throw error;
        });
    },
  },
};