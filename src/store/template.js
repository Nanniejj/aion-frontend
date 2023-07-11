import { WordcloudService } from '@/common/api.services';
import { TemplateService } from '@/common/api.services';
export default {
  state: {

    itemsWord: [],
    rowCount:0,
    domainName:"",
    subdomainName:{domain:{name:""}},
    domainId:[],
    itemsDomain:[ ],
    itemsSubDomain: [],
    fields: [
      { key: 'id', label: '#', sortable: true, class: 'text-center' },
       { key: 'name', label: 'ชื่อ Domain', sortable: true, sortDirection: 'desc' },
        { key: 'sub_domain', label: 'ชื่อ SubDomain', sortable: true, sortDirection: 'desc' },
      {
        key: 'isActive',
        label: 'สถานะ',
        formatter: (value) => {
          return value ? 'แสดงผล' : 'ไม่แสดงผล'
        },
        sortable: true,
        sortByFormatted: true,
        filterByFormatted: true
      }  ,
  
      { key: 'actions', label: 'การจัดการ' }
    ],
    totalRows: 1,
    currentPage: 1,
    perPage: 3,
    pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
    sortBy: '',
    sortDesc: false,
    sortDirection: 'asc',
    filter: null,
    filterOn: [],
    infoModal: {
      id: 'info-modal',
      title: '',
      content: ''
    }
  
  }
  , getters: {
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
      setRowCount: (state, payload) => {
        state.rowCount = payload;
      },
      setListSubDomain: (state, payload) => {
        state.itemsSubDomain = payload;
      },
      setDomainId: (state, payload) => {
        state.domainId = payload;
      },
      updateDomain:(state, payload) => {
        console.log(state.itemsDomain);
        state.itemsDomain = state.itemsDomain.map(item => {
          if(item.id === payload.id){
            console.log('1');
            item.name = payload.name
            item.display = payload.display
            return item
          }
          else{
            return item
          }
        })

      },
      addWord:(state, payload) => {
        state.itemsWord =[...state.itemsWord,payload]
      },
      addSubDomain:(state, payload) => {
        state.itemsSubDomain =[...state.itemsSubDomain,payload]
      },
      addDomain:(state, payload) => {
        state.itemsDomain =[...state.itemsDomain,payload]
      },
      updateSubDomain:(state, payload) => {
        console.log(state.itemsSubDomain.length,state);
        state.itemsSubDomain = state.itemsSubDomain.map(item => {
          if(item.id === String(payload.id)){
            item.name = payload.name
            return item
          }
          else{
            return item
          }
        })

      },
      updateWord:(state, payload) => {
        state.itemsWord = state.itemsWord.map(item => {
        // console.log("id"+ item.id,item.name,payload.name,item.keywords,payload.keywords)
          if(item.id ===String(payload.id)){
            item.name = payload.name
            item.keywords = payload.keywords
            item.and_keywords = payload.and_keywords
            item.not_keywords = payload.not_keywords
            console.log('enter func update');
            return item
          }
          else{
           // console.log('enter func update2');
            return item
            
          }
        })

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
      async fetchTemplateDomain({ commit }) {
        commit('setLoadStatus', true );
        try {
          const res = await WordcloudService.getDomain({ limit: 100000 });
          res.data.results.sort(function(a, b) {
            return parseFloat(a.id) - parseFloat(b.id);
          });
          commit('setDomainItem', res.data.results);
          commit('setLoadStatus', false );
        } catch (error) {
          console.log(error.response);
          commit('setLoadStatus', false );
        }
      },
      async fetchListSubDomain({ commit },payload) {
        commit('setLoadStatus', true );
        try {
          const res = await TemplateService.getListSubDomain(payload);
          commit('setListSubDomain', res.data.results);
          commit('setRowCount', res.data.count);
          commit('setLoadStatus', false );
        } catch (error) {
          commit('setLoadStatus', false );
          console.log(error.response);
        }
      },
      async updateSubDomain({ commit },payload) {
        try {
          const res = await TemplateService.EditSubDomain(payload);
          //console.log('res',res);
          commit('updateSubDomain',res.data)
          // var _this =this
          // _this.$fire({
          //  title: "บันทึกข้อมูลสำเร็จ",
          //        type: "success",
          //      showConfirmButton: false,
          //        timer: 1000,
          //       })
        } catch (error) {
          console.log(error.response);
        }
        
      },
      async updateAddSubDomain({ commit },payload) {
        try {
          const res = await TemplateService.AddSubDomain(payload);
          //console.log('res',res);
          commit('addSubDomain',res.data)
        } catch (error) {
          console.log(error.response);
        }
      },
      async updateDomain({ commit },payload) {
        try {
          const res = await TemplateService.EditDomain(payload);
          //console.log('res',res);
          commit('updateDomain',res.data)
        } catch (error) {
          console.log(error.response);
        }
      },
      async updateAddDomain({ commit },payload) {
        try {
          const res = await TemplateService.AddDomain(payload);
          commit('addDomain',res.data)
        } catch (error) {
          console.log(error.response);
        }
      },
      async updateAddWord({ commit },payload) {
        try {
          const res = await TemplateService.AddWord(payload);
          commit('addWord',res.data)
        } catch (error) {
          console.log(error.response);
        }
      },
      async updateWord({ commit },payload) {
        try {
          const res = await TemplateService.EditWord(payload);
          console.log('res',res);
          commit('updateWord',res.data)
        } catch (error) {
          console.log(error.response);
        }
      },
      async deleteDomain({ commit ,state},payload) {
        try {
          const res = await TemplateService.DeleteDomain(payload);
          //console.log(payload.index);
        const index = state.itemsDomain.findIndex(dm => dm.name ===payload.domain);
        //console.log(index,state.itemsDomain);
         state.itemsDomain.splice(index, 1);
         console.log('res',res.data);
          commit('updateDomain',res.data)
          return  state.itemsDomain
        } catch (error) {
          console.log(error.response);
        }
      },
      async deleteWord({ commit,state },payload) {
        try {
          const res = await TemplateService.DeleteWord(payload);
          console.log('res',res);
          const index = state.itemsWord.findIndex(word => word.id ===payload.id);
          console.log(index,state.itemsWord);
          state.itemsWord.splice(index, 1);
          //state.itemsWord.splice(payload.index, 1);
          commit('updateWord',res.data)
        } catch (error) {
          console.log(error.response);
        }
      },
      async deleteSubdomain({ commit,state},payload) {
        try {
          const res = await TemplateService.DeleteSubdomain(payload);
          console.log('res',res);
          const index =  state.itemsSubDomain.findIndex(sd => sd.id ===payload.id);
          // console.log(index, state.itemsSubDomain);
          // console.log(payload);
         state.itemsSubDomain.splice(index, 1);
          commit('updateSubDomain',res.data)
        } catch (error) {
          console.log(error.response);
        }
      },
    async fetchListWord({ commit },payload) {
      commit('setLoadStatus', true );
      try {
        const res = await TemplateService.getListWord(payload);
        console.log(res.data.results);
        commit('setListWord', res.data.results);
        // console.log(res.data.count);
        commit('setRowCount', res.data.count);
        commit('setLoadStatus', false );
      } catch (error) {
        console.log(error.response);
      }
    }
  },
  };