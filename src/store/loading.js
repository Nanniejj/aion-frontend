export default {
  state: {
    loadTotalReport:false,
    loadReportStat:false,
    loadReport:false,
    loadMap:false,
    loadFeed:false,
    loadInfluSum:false,
    rankPost:false,
    rankTab:false,
    scroll: false,
    loadStatus: false,
    loadStatus2: false,
    loadDefaultCloud: false,
    loadCloud: false,
    loadChartCloud:false,
    loadPostCloud:false,
    loadPosthash:false,
    loadTopUser:false,
    loadTopUserPf:false,
    loadPostTab:false,
    loadLocation:false,
    loadFeedWC:false,
    loadHashIssue:false,
    loadPostIssue:false,
    loadAllPostIssue:false
  },
  getters: {
    getLoadTotalReport: (state) => {
      return state.loadTotalReport;
    },
    getLoadReportStat: (state) => {
      return state.loadReportStat;
    },
    getLoadReport: (state) => {
      return state.loadReport;
    },
    getLoadAllPostIssue: (state) => {
      return state.loadAllPostIssue;
    },
    getLoadMap: (state) => {
      return state.loadMap;
    },
    getLoadPostIssue: (state) => {
      return state.loadPostIssue;
    },
    getLoadHashIssue: (state) => {
      return state.loadHashIssue;
    },
    getLoadFeedWC: (state) => {
      return state.loadFeedWC;
    },
    getLoadFeed: (state) => {
      return state.loadFeed;
    },
    getLoadLocation: (state) => {
      return state.loadLocation;
    },
    getLoadInfluSum: (state) => {
      return state.loadInfluSum;
    },
    getLoadRankPost: (state) => {
      return state.rankPost;
    },
    getLoadRankTab: (state) => {
      return state.rankTab;
    },
    getLoadPostTab: (state) => {
      return state.loadPostTab;
    },
    getLoadTopUser: (state) => {
      return state.loadTopUser;
    },
    getLoadTopUserPf: (state) => {
      return state.loadTopUserPf;
    },
    getScroll: (state) => {
      return state.scroll;
    },
    getLoadPostHash: (state) => {
      return state.loadPosthash;
    },
    getLoadPostCloud: (state) => {
      return state.loadPostCloud;
    },
    getLoadChartCloud: (state) => {
      return state.loadChartCloud;
    },
    getLoadCloud: (state) => {
      return state.loadCloud;
    },
    getLoadStatus: (state) => {
      return state.loadStatus;
    },
    getLoadDefaultCloud: (state) => {
      return state.loadDefaultCloud;
    },
    getLoadStatus2: (state) => {
      return state.loadStatus2;
    },
  },

  mutations: {
    setLoadTotalReport: (state,payload) => {
      state.loadTotalReport=payload
    },
    setLoadReportStat:(state,payload)  => {
      state.loadReportStat=payload
    },
    setLoadReport:(state,payload)  => {
      state.loadReport=payload
    },
    setLoadMap: (state,payload) => {
      state.loadMap=payload
    },
    setLoadAllPostIssue: (state,payload) => {
      state.loadAllPostIssue=payload
    },
    setLoadPostIssue: (state,payload) => {
      state.loadPostIssue=payload
    },
    setLoadHashIssue: (state,payload) => {
      state.loadHashIssue=payload
    },
    setLoadFeedWC: (state,payload) => {
      state.loadFeedWC= payload
    },
    setLoadFeed: (state,payload) => {
      state.loadFeed= payload
    },
    setLoadLocation: (state,payload) => {
     state.loadLocation= payload
    },
    setLoadInfluSum: (state, payload) => {
      state.loadInfluSum= payload
    },
    setLoadRankPost: (state, payload) => {
      state.rankPost= payload
    },
    setLoadRankTab: (state, payload) => {
      state.rankTab= payload
    },
    setLoadPostTab: (state, payload) => {
      state.loadPostTab = payload
    },
    setLoadTopUser: (state, payload) => {
      state.loadTopUser=payload;
    },
    setLoadTopUserPf: (state, payload) => {
      state.loadTopUserPf=payload;
    },
    setScroll: (state, payload) => {
      state.scroll=payload;
    },
    setLoadPostHash: (state, payload) => {
      state.loadPosthash=payload;
    },
    setLoadPostCloud: (state, payload) => {
      state.loadPostCloud=payload;
    },
    setLoadChartCloud: (state, payload) => {
     state.loadChartCloud= payload;
    },
    setLoadCloud: (state, payload) => {
      state.loadCloud = payload;
    },
    setLoadStatus: (state, payload) => {
      state.loadStatus = payload;
    },
    setLoadDefaultCloud: (state, payload) => {
      state.loadDefaultCloud = payload;
    },
    setLoadStatus2: (state, payload) => {
      state.loadStatus2 = payload;
    },
  },
};
