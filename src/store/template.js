import { WordcloudService } from "@/common/api.services";
import { TemplateService } from "@/common/api.services";
const axios = require("axios");
export default {
  state: {
    loadObj:false,
    itemsWord: [],
    rowCount: 0,
    domainName: "",
    subdomainName: { domain: { name: "" } },
    domainId: [],
    itemsDomain: [],
    itemsSubDomain: [],
    fields: [
      { key: "id", label: "#", sortable: true, class: "text-center" },
      {
        key: "name",
        label: "ชื่อ Domain",
        sortable: true,
        sortDirection: "desc",
      },
      {
        key: "sub_domain",
        label: "ชื่อ SubDomain",
        sortable: true,
        sortDirection: "desc",
      },
      {
        key: "isActive",
        label: "สถานะ",
        formatter: (value) => {
          return value ? "แสดงผล" : "ไม่แสดงผล";
        },
        sortable: true,
        sortByFormatted: true,
        filterByFormatted: true,
      },

      { key: "actions", label: "การจัดการ" },
    ],
    totalRows: 1,
    currentPage: 1,
    perPage: 3,
    pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
    sortBy: "",
    sortDesc: false,
    sortDirection: "asc",
    filter: null,
    filterOn: [],
    infoModal: {
      id: "info-modal",
      title: "",
      content: "",
    },
  },
  getters: {
    getLoadObj: (state) => {
      return state.loadObj;
    },
    getRowCount: (state) => {
      return state.rowCount;
    },
    getListWord: (state) => {
      return state.itemsWord;
    },
    getSubDomainName: (state) => {
      return state.subdomainName;
    },
    getDomainName: (state) => {
      return state.domainName;
    },
    getDomainId: (state) => {
      return state.domainId;
    },
    getItemsDomain: (state) => {
      return state.itemsDomain;
    },
    getItemsSubDomain: (state) => {
      return state.itemsSubDomain;
    },
    getItemsWord: (state) => {
      return state.itemsWord;
    },
    getFieldsDomain: (state) => {
      delete state.fields[2];
      //state.fields.slice(2, 1)
      console.log(state.fields);
      return state.fields;
    },
    getFieldsSubDomain: (state) => {
      return state.fields;
    },
    getFieldsWord: (state) => {
      delete state.fields[2];
      console.log(state.fields);
      return state.fields;
    },
  },
  mutations: {
    setLoadObj: (state, payload) =>{
      state.loadObj=payload
    },
    setRowCount: (state, payload) => {
      state.rowCount = payload;
    },
    setListSubDomain: (state, payload) => {
      state.itemsSubDomain = payload;
    },
    setDomainId: (state, payload) => {
      state.domainId = payload;
    },
    updateDomain: (state, payload) => {
      console.log(state.itemsDomain);
      state.itemsDomain = state.itemsDomain.map((item) => {
        if (item.id === payload.id) {
          console.log("updateDomain", item.id, payload);
          item.name = payload.name;
          item.display = payload.display;
          return item;
        } else {
          return item;
        }
      });
    },
    addWord: (state, payload) => {
      state.itemsWord = [...state.itemsWord, payload];
    },
    addSubDomain: (state, payload) => {
      state.itemsSubDomain = [...state.itemsSubDomain, payload];
    },
    removeDomainById: (state, id) => {
      state.itemsDomain = state.itemsDomain.filter((dm) => dm.id !== id);
    },
    addDomain: (state, payload) => {
      state.itemsDomain = [...state.itemsDomain, payload];
    },
    updateSubDomain: (state, payload) => {
      console.log(state.itemsSubDomain.length, state);
      state.itemsSubDomain = state.itemsSubDomain.map((item) => {
        if (item.id === String(payload.id)) {
          item.name = payload.name;
          return item;
        } else {
          return item;
        }
      });
    },
    updateWord: (state, payload) => {
      state.itemsWord = state.itemsWord.map((item) => {
        console.log("id"+ item.id,item.name,payload.name,item.keywords,payload.keywords)
        if (item.id === String(payload.id)) {
          item.name = payload.name;
          item.keywords = payload.keywords;
          item.and_keywords = payload.and_keywords;
          item.not_keywords = payload.not_keywords;
          console.log("enter func update");
          return item;
        } else {
          console.log('enter func update2');
          return item;
        }
      });
    },
    setDomainName: (state, payload) => {
      state.domainName = payload;
    },
    setSubDomainName: (state, payload) => {
      state.subdomainName = payload;
    },
    setListWord: (state, payload) => {
      state.itemsWord = payload;
    },
    setDomainItem: (state, payload) => {
      state.itemsDomain = payload;
    },
  },

  actions: {
    async resetDomainLastUpdate({ commit }, payload) {
      console.log('resetDomainLastUpdate');
      await axios
        .post(
          "https://api2.cognizata.com/api/v2/userposts/resetDomainLastUpdate",
            {
                id: payload
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
                  
            }
        )
        .then((res) => {
          // handle success
          console.log("success", res);
        })
        .catch((error) => {
          console.log(error);        
        });
    },

    // payload.visibility: "shown" (ค่าเริ่มต้น = เฉพาะที่แสดงอยู่) | "all" (รวมที่ซ่อน) | "hidden" (เฉพาะที่ซ่อน)
    // payload.sort: "desc" (ใหม่ล่าสุดก่อน, ค่าเริ่มต้น) | "asc" (เก่าสุดก่อน)
    // ลำดับใช้ตามที่ API ส่งมา ไม่เรียงใหม่ฝั่ง frontend
    async fetchTemplateDomain({ commit }, payload = {}) {
      const visibility = payload.visibility || "shown";
      const params = { name: "", sort: payload.sort === "asc" ? "asc" : "desc" };
      // API: visible=all → รวม domain ที่ซ่อน (visible: false) / ไม่ส่ง → เฉพาะที่แสดงอยู่
      // (ทดสอบแล้ว visible=false ไม่ได้กรองเฉพาะที่ซ่อน จึงขอแบบ all แล้วกรองเองฝั่งนี้)
      if (visibility === "all" || visibility === "hidden") params.visible = "all";

      commit("setLoadStatus", true);
      try {
        const res = await WordcloudService.getDomainList(params);
        let domainlist = (res.data.data || []).filter((x) => x.display == true);
        if (visibility === "hidden") domainlist = domainlist.filter((x) => x.visible === false);
        commit("setDomainItem", domainlist);
        commit("setLoadStatus", false);
      } catch (error) {
        console.log(error.response);
        commit("setLoadStatus", false);
      }
    },
    async fetchListSubDomain({ commit }, payload) {
      commit("setLoadStatus", true);
      try {
        const res = await TemplateService.getListSubDomain(payload);
       let data= res.data.results.filter((v)=>v.display)
      //  let data= res.data.results
        commit("setListSubDomain", data);
        console.log('data.length',data.length);
        commit("setRowCount", data.length);
        commit("setLoadStatus", false);
      } catch (error) {
        commit("setLoadStatus", false);
        console.log(error.response);
      }
    },
    async updateSubDomain({ commit }, payload) {
      commit("setLoadStatus", true);
      try {
        const res = await TemplateService.EditSubDomain(payload);

        commit("updateSubDomain", res.data);
        commit('setLoadStatus',false)
      } catch (error) {
        commit('setLoadStatus',false)
        console.log(error.response);
      }
    },
    async updateAddSubDomain({ commit }, payload) {
      commit("setLoadStatus", true);
      try {
        const res = await TemplateService.AddSubDomain(payload);
        commit("addSubDomain", res.data);
        commit('setLoadStatus',false)
      } catch (error) {
        commit('setLoadStatus',false)
        console.log(error.response);
      }
    },
    // หมายเหตุ: updateDomain / updateAddDomain / deleteDomain โยน error ต่อ (throw)
    // ให้หน้าที่เรียกแจ้งผู้ใช้ได้ — เดิมจับ error ไว้เองแล้วแค่ console.log
    // ทำให้ UI ปิด modal / ถือว่าสำเร็จทั้งที่ API ล้มเหลว
    async updateDomain({ commit }, payload) {
      commit("setLoadStatus", true);
      try {
        const res = await TemplateService.EditDomain(payload);
        commit("updateDomain", res.data);
        return res.data;
      } catch (error) {
        console.log(error.response);
        throw error;
      } finally {
        commit("setLoadStatus", false);
      }
    },
    async updateAddDomain({ commit }, payload) {
      commit("setLoadStatus", true);
      try {
        const res = await TemplateService.AddDomain(payload);
        commit("addDomain", res.data);
        return res.data;
      } catch (error) {
        console.log(error.response);
        throw error;
      } finally {
        commit("setLoadStatus", false);
      }
    },
    async updateAddWord({ commit, dispatch }, payload) {
      commit("setLoadStatus", true);
      try {
        const res = await TemplateService.AddWord(payload);
        commit("addWord", res.data);
        dispatch("resetDomainLastUpdate", payload.domain);
        commit('setLoadStatus',false)
      } catch (error) {
        commit('setLoadStatus',false)
        console.log(error.response);
      }
    },
    async updateWord({ commit,dispatch }, payload) {
      commit("setLoadStatus", true);
      try {
        const res = await TemplateService.EditWord(payload);
        console.log("payload.domain", res, payload);
        dispatch('fetchListWord',{domain:payload.domainName,subdomain:payload.subdomainName,limit:1000})
        // dispatch("resetDomainLastUpdate", payload.domain);
        commit('setLoadStatus',false)
      } catch (error) {
        // commit('setLoadStatus',false)
        console.log(error.response);
      }
    },
    async deleteDomain({ commit, state }, payload) {
      try {
        const res = await TemplateService.DeleteDomain(payload);
        // ลบผ่าน mutation ด้วย id (เดิม splice ตรงๆ ใน action และถ้า findIndex ได้ -1
        // จะลบแถวสุดท้ายของตารางทิ้งแทน)
        commit("removeDomainById", payload.id);
        return res.data;
      } catch (error) {
        console.log(error.response);
        throw error;
      }
    },
    async deleteWord({ commit, state, dispatch}, payload) {
      try {
        const res = await TemplateService.DeleteWord(payload);
        console.log("res", res);
        const index = state.itemsWord.findIndex(
          (word) => word.id === payload.id
        );
        console.log(index, state.itemsWord);
        state.itemsWord.splice(index, 1);
        commit("updateWord", res.data);
        // dispatch("resetDomainLastUpdate", payload.domain);

      } catch (error) {
        console.log(error.response);
      }
    },
    async deleteSubdomain({ commit, state }, payload) {
      try {
        const res = await TemplateService.DeleteSubdomain(payload);
        console.log("res", res);
        const index = state.itemsSubDomain.findIndex(
          (sd) => sd.id === payload.id
        );
        console.log(index, state.itemsSubDomain);
     
        state.itemsSubDomain.splice(index, 1);
        commit("updateSubDomain", res.data);
      } catch (error) {
        console.log(error.response);
      }
    },
    async fetchListWord({ commit }, payload) {
      commit("setLoadStatus", true);
      try {
        const res = await TemplateService.getListWord(payload);
        // console.log(res.data.results);
        commit("setListWord", res.data.results);
        console.log(res.data.count);
        commit("setRowCount", res.data.count);
        commit("setLoadStatus", false);
      } catch (error) {
        console.log(error.response);
      }
    },
  },
};
