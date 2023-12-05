import { RankingService } from "@/common/api.services";
export default {
  state: {
    arrDefault:null,
    arrDateRank:null,
    dataTrend:[],
    showRankTab:true,
    showWordList:true,
    detailPostRanking:[],
    submit: false,
    domain: [],
    results: [],
    resultssdm: [],
    objectname: [],
    obname: [],
    trendranking: [],
    social: [],
    subdomain: [],
    sentimentdetailranking: [],
    sentimentstat: {
      total: {
        post: 0,
        comment: 0,
        users: 0,
        total_sentiments: {
          positive: 0,
          neutral: 0,
          negative: 0,
        },
      },
      facebook: {
        post: 0,
        comment: 0,
        users: 0,
        total_sentiments: {
          positive: 0,
          neutral: 0,
          negative: 0,
        },
      },
      twitter: {
        post: 0,
        comment: 0,
        users: 0,
        total_sentiments: {
          positive: 0,
          neutral: 0,
          negative: 0,
        },
      },
      pantip: {
        post: 0,
        comment: 0,
        users: 0,
        total_sentiments: {
          positive: 0,
          neutral: 0,
          negative: 0,
        },
      },
      instagram: {
        post: 0,
        comment: 0,
        users: 0,
        total_sentiments: {
          positive: 0,
          neutral: 0,
          negative: 0,
        },
      },
      youtube: {
        post: 0,
        comment: 0,
        users: 0,
        total_sentiments: {
          positive: 0,
          neutral: 0,
          negative: 0,
        },
      },
      news: {
        post: 0,
        comment: 0,
        users: 0,
        total_sentiments: {
          positive: 0,
          neutral: 0,
          negative: 0,
        },
      },
    },
    sentimentranking: [],
    sentimentrankingchart: [],
    sentimentrankingall: 0,
    sentimentrankingfacebook: 0,
    sentimentrankingtwitter: 0,
    sentimentrankingpantip: 0,
    sentimentrankingyoutube: 0,
    sentimentrankinginstagram: 0,
    sentimentrankingnews: 0,
    sentimentobjdata: [],
    data: [
      // {
      //   count: 229,
      //   name: "ทหารภัยพิบัติ"
      // },
      // {
      //   count: 119,
      //   name: "นางสาววาสนา นาน่วม"
      // },
      // {
      //   count: 32,
      //   name: "อาวุธปืนเล็กและอาวุธสนับสนุน"
      // },
      // {
      //   count: 18,
      //   name: "สมัครนักเรียนทหาร"
      // },
      // {
      //   count: 10,
      //   name: "ทหารจิตอาสา"
      // },
      // {
      //   count: 9,
      //   name: "ทหารปฏิวัติ"
      // },
      // {
      //   count: 8,
      //   name: "การลักลอบเข้าประเทศ"
      // },
      // {
      //   count: 7,
      //   name: "พล.อ.ณรงค์พันธ์ จิตต์แก้วแท้"
      // },
      // {
      //   count: 6,
      //   name: "เกณฑ์ทหาร"
      // },
      // {
      //   count: 3,
      //   name: "พลโท เกรียงไกร ศรีรักษ์"
      // }
    ],
  },
  getters: {
    getArrDefault: (state) => {
      return state.arrDefault;
    },
    getArrDateRank: (state) => {
      return state.arrDateRank;
    },
    getDataTrend: (state) => {
      return state.dataTrend;
    },
    getShowRankTab: (state) => {
      return state.showRankTab;
    },
    getShowWordList: (state) => {
      return state.showWordList;
    },
    getDomainRanking: (state) => {
     let domain = state.results.filter(element => element.display ==true);
     console.log(domain);
      return domain.map((result) => {
        return result.name;
      });
    },
    getShowSubDomainRanking: (state) => {
      let data = state.resultssdm.filter((v)=>v.display)
      return data.map((x)=>x.name)
    },
    // getSubDomainRanking: (state) => {
    //   return state.results;
    // },
    getSubmitRanking: (state) => {
      return state.submit;
    },
    getSocial: (state) => {
      return state.social;
    },
    getRanking: (state) => {
      return state.data;
    },
    getTrendRanking: (state) => {
      return state.trendranking;
    },
    getObjectName: (state) => {
      return state.objectname;
    },
    getObName: (state) => {
      return state.obname;
    },
    getSubDomain: (state) => {
      return state.subdomain;
    },
    getSentimentDetailRanking: (state) => {
      return state.sentimentdetailranking;
    },
    getSentimentStat: (state) => {
      return state.sentimentstat;
    },
    getSentimentRanking: (state) => {
      return state.sentimentranking;
    },
    getSentimentRankingChart: (state) => {
      return state.sentimentrankingchart;
    },
    getSentimentRankingAll: (state) => {
      return state.sentimentrankingall;
    },
    getSentimentRankingFacebook: (state) => {
      return state.sentimentrankingfacebook;
    },
    getSentimentRankingTwitter: (state) => {
      return state.sentimentrankingtwitter;
    },
    getSentimentRankingPantip: (state) => {
      return state.sentimentrankingpantip;
    },
    getSentimentRankingYoutube: (state) => {
      return state.sentimentrankingyoutube;
    },
    getSentimentRankingInstagram: (state) => {
      return state.sentimentrankinginstagram;
    },
    getSentimentRankingNews: (state) => {
      return state.sentimentrankingnews;
    },
    getSentimentObjData: (state) => {
      return state.sentimentobjdata;
    },
    getDetailPostRanking: (state) => {
      return state.detailPostRanking ;
    },
  },
  mutations: {
    setArrDefault: (state,payload) => {
    state.arrDefault=payload;
    },
    setArrDateRank: (state,payload) => {
      state.arrDateRank=payload;
    },
    setDataTrend: (state, payload) => {
     state.dataTrend=payload;
    },
    setShowRankTab: (state, payload) => {
     state.showRankTab= payload;
    },
    setShowWordList: (state, payload) => {
     state.showWordList = payload;
    },
    setDomainRanking: (state, payload) => {
      state.results = payload;
    },
    setSubDomainRanking: (state, payload) => {
      state.resultssdm = payload;
    },
    setSubmitRanking: (state, payload) => {
      state.submit = payload;
    },
    setSocial: (state, payload) => {
      state.social = payload;
    },
    changeDataChoice: (state, payload) => {
      state.dateChoice = payload.choice;
    },
    setRanking: (state, payload) => {
      state.data = payload;
    },
    setTrendRanking: (state, payload) => {
      state.trendranking = payload;
    },
    setObjectName: (state, payload) => {
      state.objectname = payload;
    },
    setObName: (state, payload) => {
      state.obname = payload;
    },
    setSubDomain: (state, payload) => {
      state.subdomain = payload;
    },
    setSentimentDetailRanking: (state, payload) => {
      state.sentimentdetailranking = payload;
    },
    setSentimentStat: (state, payload) => {
      state.sentimentstat = payload;
    },
    setSentimentRanking: (state, payload) => {
      state.sentimentranking = payload;
    },
    setSentimentRankingChart: (state, payload) => {
      state.sentimentrankingchart = payload;
    },
    setSentimentRankingAll: (state, payload) => {
      state.sentimentrankingall = payload;
    },
    setSentimentRankingFacebook: (state, payload) => {
      state.sentimentrankingfacebook = payload;
    },
    setSentimentRankingTwitter: (state, payload) => {
      state.sentimentrankingtwitter = payload;
    },
    setSentimentRankingPantip: (state, payload) => {
      state.sentimentrankingpantip = payload;
    },
    setSentimentRankingYoutube: (state, payload) => {
      state.sentimentrankingyoutube = payload;
    },
    setSentimentRankingInstagram: (state, payload) => {
      state.sentimentrankinginstagram = payload;
    },
    setSentimentRankingNews: (state, payload) => {
      state.sentimentrankingnews = payload;
    },
    setSentimentObjData: (state, payload) => {
      state.sentimentobjdata = payload;
    },
    setDetailPostRanking: (state, payload) => {
      state.detailPostRanking = payload;
    },
  },
  actions: {
    async fetchDomainRanking({ commit }) {
      commit("setLoadStatus", true);
      try {
        const res = await RankingService.getDomainRanking({ limit: 100000 });
        commit("setDomainRanking", res.data.results);
        commit("setLoadStatus", false);
      } catch (error) {
        console.log(error);
      }
    },
    async fetchSubDomainRanking({ commit }, payload) {
      commit("setLoadStatus", true);
      try {
        const res = await RankingService.getSubDomainRanking(payload);
        commit("setSubDomainRanking", res.data.results);
        commit("setLoadStatus", false);
        // console.log('test',res.data.results.name);
      } catch (error) {
        console.log(error);
      }
    },
    async fetchRanking({ commit }, payload) {
      commit("setLoadStatus", true);
      try {
        const res = await RankingService.getRanking(payload);
        commit("setRanking", res.data.data);

        // let result = ["Date", "Object", "y"];
        //console.log("arrrrr " + res.data.trend.slice(0, 10));
        commit("setDataTrend", res.data.trend);
        let trenddata = res.data.trend;
        console.log(trenddata);
        let labels = [];
        let result = [];
        let maxX = 0;
        let indexMax = 0;
        for (let i = 0; i < trenddata.length; i++) {
          labels.push(trenddata[i].label);
          if (trenddata[i].x.length > maxX) {
            maxX = trenddata[i].x.length;
            indexMax = i;
          }
        }
        console.log("label", indexMax);

        let xkey = {};
        trenddata[indexMax].x.map((item) => {
          xkey[item] = [];
        });

        console.log(xkey);

        for (let l = 0; l < trenddata[indexMax].x.length; l++) {
          let temp = [];
          for (let i = 0; i < labels.length; i++) {
            if (trenddata[i].y[l]) {
              temp.push(trenddata[i].y[l]);
            } else {
              temp.push(0);
            }
          }
          result.push([trenddata[0].x[l], ...temp]);
        }

        result = [["Date", ...labels], ...result];
        console.log("###", result);
        commit("setTrendRanking", result);
        commit("setLoadStatus", false);
        // console.log(res.data);
      } catch (error) {
        console.log(error);
        commit('setLoadStatus', false );
        alert("ไม่มีข้อมูล");
      }
    },
    async fetchSentimentStat({ commit, state }, payload) {
      commit("setLoadRankTab", true);
      try {
        const res = await RankingService.getSentimentStat(payload);
        commit("setSentimentStat", res.data);
        // commit("setLoadStatus", false);

        console.log("ddd", res.data);
        console.log("newss", state.data);

        let result = ["Socials", "Users"];

        let fbpie = res.data.facebook.users;
        let twpie = res.data.twitter.users;
        let igpie = res.data.instagram.users;
        let ptpie = res.data.pantip.users;
        let nwpie = res.data.news.users;
        let ytpie = res.data.youtube.users;

        let temp = [];
        temp.push(
          ["facebook", fbpie],
          ["Twitter", twpie],
          ["Instagram", igpie],
          ["Pantip", ptpie],
          ["News", nwpie],
          ["Youtube", ytpie]
        );
        commit("setSentimentRankingChart", [result, ...temp]);

        // console.log('5555',[result, ...temp]);

        // let keep = ["Positive", "Neutral", "Negative"]
        let all = res.data.total.total_sentiments;
        commit("setSentimentRankingAll", all);
        commit("setSentimentRankingFacebook", res.data.facebook.total_sentiments);
        commit("setSentimentRankingTwitter", res.data.twitter.total_sentiment);
        commit("setSentimentRankingPantip", res.data.pantip.total_sentiments);
        commit("setSentimentRankingYoutube", res.data.youtube.total_sentiments);
        commit("setSentimentRankingInstagram", res.data.instagram.total_sentiments);
        commit("setSentimentRankingNews", res.data.news.total_sentiments);

        commit("setLoadRankTab", false);
      } catch (error) {
        console.log(error);
      }
    },
    async fetchSentimentDetailRanking({ commit }, payload) {
      commit("setLoadRankPost", true);
      try {
        const res = await RankingService.getSentimentDetailRanking(payload);
        var post = res.data.data
        var pair = {read: true};   
        var posts= post.map((result) => {
        return {...result, ...pair}
      });
           // -------------------------------------------translateuid-----------------------------------------------------------
           posts.map((result) => {
            if (result.source == "facebook" || result.source == "youtube") {
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
                    result.account_name = response.data.name;
                  } else {
                    return;
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              return result;
            }
  
            return { result };
          });

          // ---------------------------------------------------------------------------------------------------------
        commit("setSentimentDetailRanking", res.data);
        commit("setDetailPostRanking",posts)
        console.log(posts);
        commit("setLoadRankPost", false);
      } catch (error) {
        console.log(error);
        commit('setLoadRankPost', false );
        alert("ไม่มีข้อมูล");
      }
    },
  },
};
