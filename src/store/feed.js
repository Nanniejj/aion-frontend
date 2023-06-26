export default {
  state: {
    socialFeed: "",
    sdateFeed: null,
    edateFeed: null,
    sts:"",
    arrFeed:[],
    conutFeed:"",
    dataReportLine:"",
    hashtagFeed:""
  },
  getters: {
    getHashtagFeed: (state) => {
      return state.hashtagFeed;
    },
    getDataReportLine: (state) => {
      return state.dataReportLine;
    },
    getCountPostFeed: (state) => {
      return state.conutFeed;
    },
    getArrFeed: (state) => {
      return state.arrFeed;
    },
    getStatusFeed: (state) => {
      return state.sts;
    },
    getSocialFeed: (state) => {
      return state.socialFeed;
    },
    getSdateFeed: (state) => {
      return state.sdateFeed;
    },
    getEdateFeed: (state) => {
      return state.edateFeed;
    },
  },

  mutations: {
    setHashtagFeed: (state, payload) => {
      state.hashtagFeed= payload;
    },
    setDataReportLine: (state, payload) => {
      state.dataReportLine= payload;
    },
    setCountPostFeed: (state, payload) => {
      state.conutFeed = payload;
    },
    setArrFeed: (state, payload) => {
      state.arrFeed = payload;
    },
    setStatusFeed: (state, payload) => {
      state.sts = payload;
    },
    setSocialFeed: (state, payload) => {
      state.socialFeed = payload;
    },
    setSdateFeed: (state,payload) => {
      state.sdateFeed = payload;
    },
    setEdateFeed: (state,payload) => {
      state.edateFeed = payload;
    },
  },
};
