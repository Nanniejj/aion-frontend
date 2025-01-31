const axios = require("axios");
import { MonitorService } from "@/common/api.services";
// import { API_V2_URL } from '@/common/config';
export default {
  state: {
    domainReportChart:[],
    arrTotalStat: [],
    reportDomainPf: "",
    postReport: [],
    cntReport: 0,
    domainReport: "",
    statReport: "",
    daterp: [],
    sumreport2: [0, 0, 0, 0, 0, 0, 0, 0],
    sumreport: {
      fb: 0,
      tw: 0,
      pt: 0,
      nw: 0,
      yt: 0,
      ig: 0,
      bd: 0,
      tt: 0,
    },
    listTargetReport: [],
    listReport: [],
    itemsReport: [],
    fieldsReport: [
      { key: "id", label: "#", sortable: true },
      { key: "account_name", label: "user id", sortable: true },
      { key: "name", label: "name", sortable: true },
      { key: "source", label: "source", sortable: true },
      { key: "count", label: "Posts", sortable: true },
      { key: "engagement", label: "Engagement", sortable: true },
      { key: "follower", label: "Follower", sortable: true },
      { key: "actions", label: "การจัดการ" },
    ],
    totalRows: 1,
    currentPage: 1,
    perPage: 10,
    pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
    sortBy: "",
    sortDesc: false,
    sortDirection: "asc",
    filter: null,
    filterOn: [],
  },
  getters: {
    getDomainReportChart: (state) => {
      return state.domainReportChart;
    },
    getTotalStatReport: (state) => {
      return state.arrTotalStat;
    },
    getReportDomainPf: (state) => {
      return state.reportDomainPf;
    },
    getPostAllReprot: (state) => {
      return state.postReport;
    },
    getCntReport: (state) => {
      return state.cntReport;
    },
    getDomainReport: (state) => {
      return state.domainReport;
    },
    getStatReport: (state) => {
      return state.statReport;
    },
    getDateReport: (state) => {
      return state.daterp;
    },
    getSumReport2: (state) => {
      return state.sumreport2;
    },
    getSumReport: (state) => {
      return state.sumreport;
    },
    getListReport: (state) => {
      return state.listReport;
    },
    getTableReport: (state) => {
      return state;
    },
    getListTargetReport: (state) => {
      return state.listTargetReport;
    },
  },

  mutations: {
    setDomainReportChart: (state , payload) => {
    state.domainReportChart= payload;
    },
    setTotalStatReport: (state, payload) => {
      state.arrTotalStat = payload;
    },
    setReportDomainPf: (state, payload) => {
      state.reportDomainPf = payload;
    },
    setPostAllReprot: (state, payload) => {
      state.postReport = payload;
    },
    setCntReport: (state, payload) => {
      state.cntReport = payload;
    },
    setDomainReport: (state, payload) => {
      state.domainReport = payload;
    },
    setStatReport: (state, payload) => {
      state.statReport = payload;
    },
    setDateReport: (state, payload) => {
      state.daterp = payload;
    },
    setSumReport: (state, payload) => {
      state.sumreport = payload;
    },
    setSumReport2: (state, payload) => {
      state.sumreport2 = payload;
    },
    setListReport: (state, payload) => {
      state.listReport = payload;
    },
    setListTargetReport: (state, payload) => {
      state.listTargetReport = payload;
    },
    setTableReport: (state, payload) => {
      state.listTargetReport = payload;
    },
  },
  actions: {
    async fetchDomainReportChart({ commit }, payload) {
      console.log('payload',payload);
      // commit("setLoadTotalReport", true);
      var config = {
        method: "get",
        url: "http://139.59.103.67:3000/api/v2/userposts/getReportSortDomain?",
        params: payload,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      axios(config)
        .then((response) => {
      console.log("setDomainReportChart", response.data);
      let count = response.data.domains.map((key) => {
        return key.count;
      });
      let domain = response.data.domains.map((key) => {
        return key.domain;
      });
      console.log('count',count,domain);
          commit("setDomainReportChart", {domain:domain,count:count});
          // commit("setLoadTotalReport", false);
        })
        .catch(function(error) {
          this.$fire({
            title: "กรุณาลองอีกครั้ง",
            type: "error",
            showConfirmButton: false,
            timer: 1000,
          });
          // commit("setLoadTotalReport", false);
          console.log(error);
        });
    },
    async fetchTotalStatReport({ commit }, payload) {
      commit("setLoadTotalReport", true);
      var config = {
        method: "get",
        url: "https://api2.cognizata.com/api/v2/userposts/getTotalStatsTarget?",
        params: payload,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      axios(config)
        .then((response) => {
        //   console.log("setTotalStatReport", response.data);
          commit("setTotalStatReport", response.data);
          commit("setLoadTotalReport", false);
        })
        .catch(function(error) {
          this.$fire({
            title: "กรุณาลองอีกครั้ง",
            type: "error",
            showConfirmButton: false,
            timer: 1000,
          });
          commit("setLoadTotalReport", false);
          console.log(error);
        });
    },
    async fetchPostAllReport({ commit }, payload) {
      commit("setLoadPostTab", true);
      try {
        const res = await MonitorService.getPostAllMonitor(payload);
        // console.log(res.data);
        commit("setLoadPostTab", false);
        commit("setCntReport", res.data.count);
        var post = res.data.data;
        var pair = { read: true };
        var posts = post.map((result) => {
          return { ...result, ...pair };
        });

        commit("setPostAllReprot", posts);

        commit("setLoadPostTab", false);
      } catch (error) {
        console.log(error.response);
        alert("โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        commit("setLoadPostTab", false);
      }
    },
    async fetchStatReport({ commit }, payload) {
      commit("setLoadReportStat", true);
      var config = {
        method: "get",
        url: "https://api2.cognizata.com/api/v2/userposts/getStatsTarget",
        params: payload,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      axios(config)
        .then((response) => {
          // console.log("listDomain2", response.data);
          let listDomain = response.data.domains.map((key) => {
            return key.domain;
          });
          // console.log("listDomain", listDomain);
          commit("setStatReport", response.data);
          commit("setReportDomainPf", listDomain);
          commit("setLoadReportStat", false);
        })
        .catch(function(error) {
          this.$fire({
            title: "กรุณาลองอีกครั้ง",
            type: "error",
            showConfirmButton: false,
            timer: 1000,
          });
          commit("setLoadReportStat", false);
          console.log(error);
        });
    },

    async fetchListTargetReport({ commit }, payload) {
      commit("setLoadReport", true);
      commit("setSumReport2", []);
      var config = {
        method: "get",
        url: "https://api2.cognizata.com/api/v2/userposts/getReportTarget",
        params: payload,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      axios(config)
        .then((response) => {
          let target = response.data;
         
          commit("setListTargetReport", target);
          commit("setListReport", target);
          const sumfb = response.data.filter(
            (element) => element.source === "facebook"
          );
          const sumtw = response.data.filter(
            (element) => element.source === "twitter"
          );
          const sumpt = response.data.filter(
            (element) => element.source === "pantip"
          );
          const sumnw = response.data.filter(
            (element) => element.source === "news"
          );
          const sumyt = response.data.filter(
            (element) => element.source === "youtube"
          );
          const sumig = response.data.filter(
            (element) => element.source === "instagram"
          );
          const sumbd = response.data.filter(
            (element) => element.source === "blockdit"
          );
          const sumtt = response.data.filter(
            (element) => element.source === "tiktok"
          );
          commit("setSumReport", {
            fb: sumfb.length,
            tw: sumtw.length,
            pt: sumpt.length,
            nw: sumnw.length,
            yt: sumyt.length,
            ig: sumig.length,
            bd: sumbd.length,
            tt: sumtt.length,
          });
          commit("setSumReport2", [
            sumfb.length,
            sumtw.length,
            sumpt.length,
            sumnw.length,
            sumyt.length,
            sumig.length,
            sumbd.length,
            sumtt.length,
          ]);
          commit("setLoadReport", false);
        })
        .catch(function(error) {
          this.$fire({
            title: "กรุณาลองอีกครั้ง",
            type: "error",
            showConfirmButton: false,
            timer: 1000,
          });
          commit("setLoadReport", false);
          console.log(error);
        });
    },
  },
};
