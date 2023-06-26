import { WordcloudService } from "@/common/api.services";
import { DomainService } from "@/common/api.services";
export default {
  state: {
    relAcc:"",
    chartDomain: [],
    listDomain: [],
    topPost: [],
    allPost: [],
    pushDomainStat: false,
    clickDomain: "",
    loadWcloud: false,
    loadHclod: false,
    loadTopPost: false,
    loadStat: false,
    dataSocial: "",
    sdatedm: "",
    edatedm: "",
    arrDate: "",
  },
  getters: {
    getRelAcc: (state) => {
      return state.relAcc;
    },
    getArrDate: (state) => {
      return state.arrDate;
    },
    getChartDomain: (state) => {
      return state.chartDomain;
    },
    getSdateDm: (state) => {
      return state.sdatedm;
    },
    getEdateDm: (state) => {
      return state.edatedm;
    },
    getSocialDomain: (state) => {
      return state.dataSocial;
    },
    getListDomain: (state) => {
      //return state.listDomain
      let domain = state.listDomain.filter(
        (element) => element.display == true
      );
      console.log(domain);
      return domain.map((result) => {
        return result;
      });
    },
    getPushDomainStat: (state) => {
      return state.pushDomainStat;
    },
    getClickDomain: (state) => {
      return state.clickDomain;
    },
    getLoadWordCloud: (state) => {
      return state.loadWcloud;
    },
    getLoadTopPost: (state) => {
      return state.loadTopPost;
    },
    getLoadStat: (state) => {
      return state.loadStat;
    },
    getTopPostDomain: (state) => {
      return state.topPost;
    },
    getAllPostDomain: (state) => {
      return state.allPost;
    },
  },
  mutations: {
    setRelAcc: (state, payload) => {
     state.relAcc = payload;
    },
    setArrDate: (state, payload) => {
      state.arrDate = payload;
    },
    setChartDomain: (state, payload) => {
      state.chartDomain = payload;
    },
    setSdateDm: (state, payload) => {
      state.sdatedm = payload;
    },
    setEdateDm: (state, payload) => {
      state.edatedm = payload;
    },
    setSocialDomain: (state, payload) => {
      state.dataSocial = payload;
    },
    setTopPostDomain: (state, payload) => {
      state.topPost = payload;
    },
    setListDomain: (state, payload) => {
      state.listDomain = payload;
    },
    setPushDomainStat: (state, payload) => {
      state.pushDomainStat = payload;
    },
    setClickDomain: (state, payload) => {
      state.clickDomain = payload;
    },
    setLoadWordCloud: (state, payload) => {
      state.loadWcloud = payload;
    },
    setLoadTopPost: (state, payload) => {
      state.loadTopPost = payload;
    },
    setLoadStat: (state, payload) => {
      state.loadStat = payload;
    },
  },
  actions: {
    async fetchChartDomain({ commit }, payload) {
      // commit('setLoadStatus',true)
      try {
        const res = await DomainService.getChartDomain(payload);
        commit("setChartDomain", res.data);
        // commit('setLoadStatus', false );
      } catch (error) {
        console.log(error.response);
      }
    },
    async fetchListDomain({ commit }) {
      commit("setLoadStatus", true);
      try {
        const res = await WordcloudService.getDomain({ limit: 100000 });
        let domainName = res.data.results.map((key) => {
          return key.name;
        });
        localStorage.setItem('domainArr', domainName.toString());
        commit("setListDomain", res.data.results);
        commit("setLoadStatus", false);
      } catch (error) {
        console.log(error.response);
      }
    },
    // TopPost
    async fetchPostDomain({ commit }, payload) {
      commit("setLoadTopPost", true);
      try {
        const res = await DomainService.getPostDomain(payload);
        //console.log(res.data.data.slice(0,3));
        if (res.data.data.length) {
          let temp = res.data.data;
          console.log("temp", temp);
          const ids = temp.map((o) => o.full_text);
          const filtered = temp.filter(
            ({ full_text }, index) => !ids.includes(full_text, index + 1)
          );
          var post = filtered
          var pair = {read: true};   
          var posts= post.map((result) => {
          return {...result, ...pair}
        });
         // -------------------------------------------translateuid----------------------------------------------------------- 
      posts.slice(0,3).map((result) => {
        if (result.source=='youtube') {
          var axios = require("axios");
          var config = {
            method: "get",
            url:
              "https://api2.cognizata.com/api/v2/object/translateuid?uid=" +
              result.account_name,
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          };
          axios(config)
            .then((response) => {
              console.log("Object.keys", Object.keys(response.data).length);
              if (Object.keys(response.data).length) {
                result.account_name= response.data.name
                // console.log('2',result);
              } else {
                return 
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          return result
        }
       
          return {result}
        });

  // ---------------------------------------------------------------------------------------------------------
        
          commit("setTopPostDomain", posts.slice(0,3));
          console.log("temp", [...temp]);
        } else {
          commit("setTopPostDomain", []);
        }

        commit("setLoadTopPost", false);
      } catch (error) {
        console.log(error.response);
      }
    },
  },
};
