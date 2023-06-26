import { TopInfluencerService } from "@/common/api.services";
export default {
  state: {
    stmInflu:"",
    noMonitor:"",
    showTopInflu: false,
    toLinkProfile:"",
    submit: false,
    domaintop: [],
    socialtop: [],
    data: [],
    links: [
      //   {
      //     weight: 2,
      //     source: "political_drama",
      //     target: "PravitR",
      //     showing:false,
      //   },
      //   { weight: 1, source: "political_drama", target: "Sulovebossss",showing:false },
      //   { weight: 9, source: "political_drama", target: "political_drama" ,showing:false},
      //   { weight: 2, source: "political_drama", target: "motorwars" ,showing:false},
      //   { weight: 3, source: "Sulovebossss", target: "Sulovebossss" ,showing:false},
      //   { weight: 4, source: "Sulovebossss", target: "motorwars" ,showing:false},
      //   { weight: 1, source: "Sulovebossss", target: "TichilaThaipbs" ,showing:false},
      //   { weight: 1, source: "Sulovebossss", target: "ThaiPBSNews" ,showing:false},
      //   { weight: 2, source: "fm91trafficpro", target: "Vanuthaset91" ,showing:false},
      //   { weight: 2, source: "fm91trafficpro", target: "fm91trafficpro" ,showing:false},
      //   { weight: 1, source: "motorwars", target: "ThaiPBSNews" ,showing:false},
      //   { weight: 8, source: "motorwars", target: "motorwars" ,showing:false},
      //   { weight: 9, source: "js100radio", target: "js100radio" ,showing:false},
      //   { weight: 1, source: "js100radio", target: "Vanuthaset91" ,showing:false},
      //   { weight: 6, source: "PravitR", target: "PravitR" ,showing:false},
      //   { weight: 5, source: "joe_black317", target: "joe_black317" ,showing:false},
      //   { weight: 7, source: "SiameseFat", target: "SiameseFat" ,showing:false},
      //   { weight: 7, source: "SiameseFat", target: "cumkom" ,showing:false},
      //   { weight: 3, source: "ThaiPBSNews", target: "TichilaThaipbs" ,showing:false},
      //   { weight: 1, source: "cumkom", target: "js100radio" ,showing:false},
      //   { weight: 11, source: "cumkom", target: "cumkom" ,showing:false},
      //   { weight: 4, source: "cumkom", target: "SiameseFat" ,showing:false},
      //   { weight: 1, source: "cumkom", target: "rrunggone" ,showing:false},
      //   { weight: 3, source: "cumkom", target: "YahomAKA" ,showing:false},
      //   { weight: 1, source: "charoenpura", target: "charoenpura" ,showing:false},
      //   { weight: 3, source: "ANI", target: "ANI" ,showing:false},
      //   { weight: 11, source: "allaboutfuzz", target: "allaboutfuzz" ,showing:false},
      //   { weight: 4, source: "allaboutfuzz", target: "rrunggone" ,showing:false},
      //   { weight: 5, source: "allaboutfuzz", target: "RsmlP" ,showing:false},
      //   { weight: 1, source: "sorkorlao", target: "sorkorlao" ,showing:false},
      //   { weight: 3, source: "toyubomm", target: "toyubomm" ,showing:false},
      //   { weight: 2, source: "toyubomm", target: "joe_black317" ,showing:false},
      //   { weight: 9, source: "YahomAKA", target: "YahomAKA" ,showing:false},
      //   { weight: 6, source: "YahomAKA", target: "cumkom" ,showing:false},
      //   { weight: 1, source: "pruetthigon", target: "sorkorlao" ,showing:false},
      //   { weight: 1, source: "RsmlP", target: "allaboutfuzz" ,showing:false},
      //   { weight: 1, source: "RsmlP", target: "rrunggone" ,showing:false},
      //   { weight: 1, source: "rrunggone", target: "allaboutfuzz" ,showing:false},
      //   { weight: 2, source: "rrunggone", target: "RsmlP" ,showing:false},
      //   { weight: 5, source: "TichilaThaipbs", target: "ThaiPBSNews" ,showing:false},
      //   { weight: 2, source: "Vanuthaset91", target: "fm91trafficpro" ,showing:false},
      //   { weight: 1, source: "Vanuthaset91", target: "js100radio" ,showing:false},
    ],
    nodes: [
      //   { id: "armypr_news", count: 10, name: "Royal Thai Army" },
      //   { id: "Army4PR", count: 10, name: "กองทัพภาคที่ 4" },
      //   { id: "political_drama", count: 10, name: "เฮฮาการเมือง" },
      //   { id: "Thairath_News", count: 10, name: "Thairath_News" },
      //   { id: "Sulovebossss", count: 10, name: "🚦°สลิ่มพลเมืองดาวพลูโต°🚦" },
      //   { id: "fm91trafficpro", count: 10, name: "FM91 Trafficpro" },
      //   { id: "motorwars", count: 10, name: "pone poyepoloye" },
      //   { id: "nuttha_MFP", count: 10, name: "ณัฐวุฒิ บัวประทุม" },
      //   { id: "ManushyaFdn", count: 10, name: "Manushya Foundation" },
      //   { id: "js100radio", count: 10, name: "JS100" },
      //   { id: "PravitR", count: 10, name: "Pravit Rojanaphruk" },
      //   { id: "joe_black317", count: 10, name: "joe black" },
      //   { id: "cnew888", count: 10, name: "คุณพี่อยู่จังหวัดอะไรค๊าาา 🤍🕊" },
      //   { id: "SiameseFat", count: 10, name: "𝐌" },
      //   { id: "RichardBarrow", count: 10, name: "Richard Barrow in Thailand" },
      //   { id: "ThaiPBSNews", count: 10, name: "Thai PBS News" },
      //   { id: "cumkom", count: 10, name: "Cumคม 😷" },
      //   {
      //     id: "charoenpura",
      //     count: 10,
      //     name: "ITRC 😼กล้ามากกกกกกที่จะไม่กลับไปรักเธอ!",
      //   },
      //   { id: "kittiadul", count: 10, name: "ก.อสังหา" },
      //   { id: "BLACKPINK", count: 5 },
      //   { id: "RangsimanRome", count: 10, name: "Rangsiman Rome" },
      //   { id: "Offchainon", count: 10, name: "OFF CHAINON" },
      //   { id: "narendramodi", count: 10, name: "Narendra Modi" },
      //   { id: "ANI", count: 10, name: "ANI" },
      //   { id: "Investingcom", count: 10, name: "Investing.com" },
      //   { id: "allaboutfuzz", count: 10, name: "พี่เม่น" },
      //   { id: "sorkorlao", count: 10, name: "ซ้อขอเล่า ~ เมาท์เท่าที่รู้" },
      //   { id: "toyubomm", count: 10, name: "เซเลปหม่อมสามหยอยเป็นราษฎร®" },
      //   { id: "ThaiEnquirer", count: 10, name: "Thai Enquirer" },
      //   { id: "BTS_twt", count: 10, name: "방탄소년단" },
      //   { id: "YahomAKA", count: 10, name: "หอมชื่นจิต สบายใจ😷⚙️" },
      //   { id: "pruetthigon", count: 10, name: "#️⃣ République de Thaïlande |||" },
      //   { id: "chartgaga", count: 10, name: "Lady Gaga Charts" },
      //   { id: "weareoneEXO", count: 10, name: "EXO" },
      //   { id: "LG_Views", count: 10, name: "Lady Gaga Views" },
      //   { id: "PPTVHD36", count: 10, name: "PPTV HD 36" },
      //   { id: "peckpalit", count: 10, name: "Peck Palit" },
      //   { id: "RsmlP", count: 10, name: "จป. เด็กตลาด" },
      //   { id: "rrunggone", count: 10, name: "รุ้งกร" },
      //   { id: "TichilaThaipbs", count: 10, name: "Tichila thaipbs" },
      //   { id: "GOT7Official", count: 10, name: "GOT7" },
      //   { id: "Vanuthaset91", count: 10, name: "Roong Official" },
    ],
  },
  getters: {
    getStmInflu: (state) => {
      return state.stmInflu;
    },
    getNoMonitor: (state) => {
      return state.noMonitor;
    },
    getToLinkProfile: (state) => {
      return state.toLinkProfile;
    },
    getShowTopInflu: (state) => {
      return state.showTopInflu;
    },
    getTopInfluencer: (state) => {
      return state.data;
    },
    getLinksTopInfluencer: (state) => {
      return state.links;
    },
    getNodesTopInfluencer: (state) => {
      return state.nodes;
    },
    getSubmitInfluencer: (state) => {
      return state.submit;
    },
    getDomainTop: (state) => {
      return state.domaintop;
    },
    getSocialTop: (state) => {
      return state.socialtop;
    },
  },
  mutations: {
    setStmInflu: (state,payload) => {
    state.stmInflu= payload;
    },
    setNoMonitor: (state, payload) => {
      state.noMonitor= payload;
    },
    setToLinkProfile: (state, payload) => {
      state.toLinkProfile = payload;
    },
    setShowTopInflu: (state, payload) => {
      state.showTopInflu = payload;
    },
    setSubmitInfluencer: (state, payload) => {
      state.submit = payload;
    },
    changeDataChoice: (state, payload) => {
      state.dateChoice = payload.choice;
    },
    setTopInfluencer: (state, payload) => {
      state.data = payload;
    },
    setDomainTop: (state, payload) => {
      state.domaintop = payload;
    },
    setSocialTop: (state, payload) => {
      state.socialtop = payload;
    },
  },
  actions: {
    async fetchTopInfluencer({ commit }, payload) {
      commit("setLoadStatus", true);
      commit("setLoadTopUserPf", true);
      try {
        const res = await TopInfluencerService.getTopInfluencer(payload);
        commit("setTopInfluencer", res.data.data);
        commit("setLoadTopUserPf", false);
        commit("setLoadStatus", false);
      } catch (error) {
        console.log(error.response);
        commit("setLoadTopUserPf", false);
        commit("setLoadStatus", false);
      }
    },
  },
};
