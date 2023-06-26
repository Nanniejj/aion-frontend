export default {
  state: {
    toPlatform: true,
    namePlatform:"",
    socialPF:"",
    arrDatep:[],
    sdatedmp:"",
    edatedmp:"",
    domainArr:'',
    newslt:''

  },
  getters: {
    getNewslt: (state) => {
      return state.newslt;
    },
    getDomainArr: (state) => {
      return state.domainArr;
    },
    getArrDatePf: (state) => {
      return state.arrDatep;
    },
    getSdateDmPf: (state) => {
      return state.sdatedmp;
    },
    getEdateDmPf: (state) => {
      return state.edatedmp;
    },
    getSocialPlatform: (state) => {
      return state.socialPF;
    },
    getToPlatform: (state) => {
      return state.toPlatform;
    },
    getNamePlatform: (state) => {
        return state.namePlatform;
      },
  },
  mutations: {
    setNewslt: (state,payload) => {
      state.newslt=payload;
    },
    setArrDatePf: (state, payload) => {
      state.arrDatep = payload;
    },
    setSdateDmPf: (state, payload) => {
      state.sdatedmp = payload;
    },
    setEdateDmPf: (state, payload) => {
      state.edatedmp = payload;
    },
    setNamePlatform: (state, payload) => {
      state.namePlatform = payload;
    },
    setToPlatform: (state, payload) => {
        state.toPlatform = payload;
      },
      setSocialPlatform: (state, payload) => {
      state.socialPF= payload;
      },
      setDomainArr: (state, payload) => {
       state.domainArr= payload;
      },
  },
};
