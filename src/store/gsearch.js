import { GsearchService } from '@/common/api.services';
export default {
    state: {
        keyGsearch:'',
        submitGsearch: false,
        content:[
         ] ,
    },
    getters: {
      getGsearch: (state) => {
        return state.content;
      },
      getSubmitGsearch: (state) => {
        return state.submitGsearch;
      },
 
    },
    mutations: {
      changeDataChoice: (state, payload) => {
        state.dateChoice = payload.choice;
      },
      setSubmitGsearch: (state, payload) => {
        state.submitGsearch = payload;
      },
      setFetchGsearch:(state, payload)=>{
        state.content= payload;
      }
    },
    actions: {
      async fetchGsearch({ commit},payload) {
        commit('setLoadStatus', true );
        try {
          const res = await GsearchService.getGsearch(payload);
  
          commit('setFetchGsearch', res.data.content);
          commit('setLoadStatus', false );
          //console.log(res.data);
        } catch (error) {
          commit('setLoadStatus', false );
          console.log(error.response);
        }
      },
    },
  };
  