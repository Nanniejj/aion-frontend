export default {
    state: {
      sdateHt:"",
      edateHt:"",
      arrDateHashtag:"",
      hashtagData:'',
      itemsHashtag: [],
      fieldsHashtag: [
          { key: 'id', label: '#', sortable: true},
           { key: 'uid', label: 'Hashtag', sortable: true},
          //  { key: 'url', label: 'URL', sortable: true, sortDirection: 'desc' },
            { key: 'source', label: 'source', sortable: true },
            //{ key: 'last_time', label: 'เวลา', sortable: true, sortDirection: 'desc' },
            // { key: 'crawled', label: 'การเก็บข้อมูล', sortable: true},
            
          {
            key: 'status',
            label: 'สถานะ',
            sortByFormatted: true,
            filterByFormatted: true
            , sortable: true
          }  ,
          { key: 'actions', label: 'การจัดการ' }
        ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
    
    }
    , getters: {
      getSDateHt:(state)=>{
        return state.sdateHt
      },
      getEDateHt:(state)=>{
        return state.edateHt
      },
      getArrDateHashtag:(state)=>{
        return state.arrDateHashtag
      },
      getHashtagData: (state) => {
        return state.hashtagData;
      },
      getItemsHashtag: (state) => {
        return state.itemsHashtag;
      },
      getHashtag: (state) => {
          
        return state;
      },

      getFieldsHashtag: (state) => {
        return state.fieldsHashtag;
      },
  
    },
      mutations: {
        setSDateHt:(state,payload)=>{
          state.sdateHt = payload;
        },
        setEDateHt:(state,payload)=>{
           state.edateHt = payload;
        },
        setArrDateHashtag:(state,payload)=>{
          state.arrDateHashtag = payload;
        },
        setHashtagData: (state, payload) => {
          state.hashtagData = payload;
        },
        setItemsHashtag: (state, payload) => {
          state.itemsHashtag = payload;
        },
        setFieldsHashtag: (state, payload) => {
         state.fieldsHashtag = payload;
          },
        setHashtag: (state, payload) => {
          state = payload;
        },
        setCurrentPage: (state, payload) => {
          state.currentPage = payload;
        }
      },
    
    };



























