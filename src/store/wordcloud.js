import { WordcloudService } from "@/common/api.services";
export default {
  state: {
    selected: false,
    selectedmonitor: "",
    detailPost: [],
    detailHashPost: [],
    date: [],
    domain: [],
    domainname: [],
    querysearch: [],
    hashtagsocial: [],
    keywords: "",
    hashtagchart: [],
    wordchart: [],
    wordcloud: [],
    wordcloudwordname: [],
    wordcloudwordchart: [],
    wordcloudhashtag: [],
    wordcloudhashtagchart: [],
    wordcloudsentiment: [],
    wordcloudstartdate: "",
    wordcloudenddate: "",
    wordcloudsocial: [],
    wordcloudimg: "",
    wordcloudhash: "",
    sentiment: [],
    sentimentdetail: [],
    sentimentchart: [],
    sentimenthashtagdetail: [],
    sentimentall: [],
    sentimentfacebook: [],
    sentimenttwitter: [],
    sentimentpantip: [],
    sentimentyoutube: [],
    sentimentinstagram: [],
    sentimentnews: [],
    sentimentbd: [],
    sentimenttiktok: [],
    sentimenthashtag: [],
    sentimenthashtagchart: [],
    sentimenthashtagall: [],
    sentimenthashtagfacebook: [],
    sentimenthashtagtwitter: [],
    sentimenthashtagpantip: [],
    sentimenthashtagyoutube: [],
    sentimenthashtaginstagram: [],
    sentimenthashtagnews: [],
    sentimenthashtagbd: [],
    sentimenthashtagtiktok: [],

    sentimentallpost: 0,
    sentimentfacebookpost: 0,
    sentimenttwitterpost: 0,
    sentimentpantippost: 0,
    sentimentyoutubepost: 0,
    sentimentinstagrampost: 0,
    sentimentnewspost: 0,
    sentimentbdpost: 0,
    sentimenttiktokpost: 0,

    sentimentallcomment: 0,
    sentimentfacebookcomment: 0,
    sentimenttwittercomment: 0,
    sentimentpantipcomment: 0,
    sentimentyoutubecomment: 0,
    sentimentinstagramcomment: 0,
    sentimentnewscomment: 0,
    sentimentbdcomment: 0,
    sentimenttiktokcomment: 0,

    sentimenthashtagallpost: 0,
    sentimenthashtagfacebookpost: 0,
    sentimenthashtagtwitterpost: 0,
    sentimenthashtagpantippost: 0,
    sentimenthashtagyoutubepost: 0,
    sentimenthashtaginstagrampost: 0,
    sentimenthashtagnewspost: 0,
    sentimenthashtagbdpost: 0,
    sentimenthashtagtiktokpost: 0,

    sentimenthashtagallcomment: 0,
    sentimenthashtagfacebookcomment: 0,
    sentimenthashtagtwittercomment: 0,
    sentimenthashtagpantipcomment: 0,
    sentimenthashtagyoutubecomment: 0,
    sentimenthashtaginstagramcomment: 0,
    sentimenthashtagnewscomment: 0,
    sentimenthashtagbdcomment: 0,
    sentimenthashtagtiktokcomment: 0,
  },
  getters: {
    getDetailPost: (state) => {
      return state.detailPost;
    },
    getDetailHashPost: (state) => {
      return state.detailHashPost;
    },
    getQuerySearch: (state) => {
      return state.querysearch;
    },
    getHashtagSocial: (state) => {
      return state.hashtagsocial;
    },
    getKeywords: (state) => {
      return state.keywords;
    },
    getDate: (state) => {
      return state.date;
    },
    getShowDomain: (state) => {
      return state.domain.filter((x) => x.display);
    },
    getSelected: (state) => {
      return state.selected;
    },
    getSelectedMonitor: (state) => {
      return state.selectedmonitor;
    },
    getHashtagChart: (state) => {
      return state.hashtagchart;
    },
    getWordChart: (state) => {
      return state.wordchart;
    },
    getWordCloud: (state) => {
      return state.wordcloud;
    },
    getWordCloudDomain: (state) => {
      return state.domainname;
    },
    getWordCloudSentiment: (state) => {
      return state.wordcloudsentiment;
    },
    getWordCloudWordChart: (state) => {
      return state.wordcloudwordchart;
    },
    getWordCloudHashtag: (state) => {
      return state.wordcloudhashtag;
    },
    getWordCloudHashtagChart: (state) => {
      return state.wordcloudhashtagchart;
    },
    getWordCloudStartDate: (state) => {
      return state.wordcloudstartdate;
    },
    getWordCloudEndDate: (state) => {
      return state.wordcloudenddate;
    },
    getWordCloudWordName: (state) => {
      return state.wordcloudwordname;
    },
    getWordCloudSocial: (state) => {
      return state.wordcloudsocial;
    },
    getWordCloudImg: (state) => {
      return state.wordcloudimg;
    },
    getWordCloudHash: (state) => {
      return state.wordcloudhash;
    },
    getSentiment: (state) => {
      return state.sentiment;
    },
    getSentimentDetail: (state) => {
      return state.sentimentdetail;
    },
    getSentimentChart: (state) => {
      return state.sentimentchart;
    },
    getSentimentHashtagDetail: (state) => {
      return state.sentimenthashtagdetail;
    },
    getSentimentAll: (state) => {
      return state.sentimentall;
    },
    getSentimentFacebook: (state) => {
      return state.sentimentfacebook;
    },
    getSentimentTwitter: (state) => {
      return state.sentimenttwitter;
    },
    getSentimentPantip: (state) => {
      return state.sentimentpantip;
    },
    getSentimentYoutube: (state) => {
      return state.sentimentyoutube;
    },
    getSentimentInstagram: (state) => {
      return state.sentimentinstagram;
    },
    getSentimentNews: (state) => {
      return state.sentimentnews;
    },
    getSentimentTiktok: (state) => {
      return state.sentimenttiktok;
    },
    getSentimentBlockdit: (state) => {
      return state.sentimentbd;
    },
    getSentimentHashtag: (state) => {
      return state.sentimenthashtag;
    },
    getSentimentHashtagChart: (state) => {
      return state.sentimenthashtagchart;
    },
    getSentimentHashtagAll: (state) => {
      return state.sentimenthashtagall;
    },
    getSentimentHashtagFacebook: (state) => {
      return state.sentimenthashtagfacebook;
    },
    getSentimentHashtagTwitter: (state) => {
      return state.sentimenthashtagtwitter;
    },
    getSentimentHashtagPantip: (state) => {
      return state.sentimenthashtagpantip;
    },
    getSentimentHashtagYoutube: (state) => {
      return state.sentimenthashtagyoutube;
    },
    getSentimentHashtagInstagram: (state) => {
      return state.sentimenthashtaginstagram;
    },
    getSentimentHashtagNews: (state) => {
      return state.sentimenthashtagnews;
    },

    getSentimentAllPost: (state) => {
      return state.sentimentallpost;
    },
    getSentimentFacebookPost: (state) => {
      return state.sentimentfacebookpost;
    },
    getSentimentTwitterPost: (state) => {
      return state.sentimenttwitterpost;
    },
    getSentimentPantipPost: (state) => {
      return state.sentimentpantippost;
    },
    getSentimentYoutubePost: (state) => {
      return state.sentimentyoutubepost;
    },
    getSentimentInstagramPost: (state) => {
      return state.sentimentinstagrampost;
    },
    getSentimentNewsPost: (state) => {
      return state.sentimentnewspost;
    },
    getSentimentBlockditPost: (state) => {
      return state.sentimentbdpost;
    },
    getSentimentTiktokPost: (state) => {
      return state.sentimenttiktokpost;
    },

    getSentimentAllComment: (state) => {
      return state.sentimentallcomment;
    },
    getSentimentFacebookComment: (state) => {
      return state.sentimentfacebookcomment;
    },
    getSentimentTwitterComment: (state) => {
      return state.sentimenttwittercomment;
    },
    getSentimentPantipComment: (state) => {
      return state.sentimentpantipcomment;
    },
    getSentimentYoutubeComment: (state) => {
      return state.sentimentyoutubecomment;
    },
    getSentimentInstagramComment: (state) => {
      return state.sentimentinstagramcomment;
    },
    getSentimentNewsComment: (state) => {
      return state.sentimentnewscomment;
    },
    getSentimentBlockditComment: (state) => {
      return state.sentimentbdcomment;
    },
    getSentimentTiktokComment: (state) => {
      return state.sentimenttiktokcomment;
    },

    getSentimentHashtagAllPost: (state) => {
      return state.sentimenthashtagallpost;
    },
    getSentimentHashtagFacebookPost: (state) => {
      return state.sentimenthashtagfacebookpost;
    },
    getSentimentHashtagTwitterPost: (state) => {
      return state.sentimenthashtagtwitterpost;
    },
    getSentimentHashtagInstagramPost: (state) => {
      return state.sentimenthashtaginstagrampost;
    },
    getSentimentHashtagPantipPost: (state) => {
      return state.sentimenthashtagpantippost;
    },
    getSentimentHashtagNewsPost: (state) => {
      return state.sentimenthashtagnewspost;
    },
    getSentimentHashtagYoutubePost: (state) => {
      return state.sentimenthashtagyoutubepost;
    },
    getSentimentHashtagBlockdit: (state) => {
      return state.sentimenthashtagbd;
    },
    getSentimentHashtagBlockditPost: (state) => {
      return state.sentimenthashtagbdpost;
    },
    getSentimentHashtagTiktok: (state) => {
      return state.sentimenthashtagtiktok;
    },
    getSentimentHashtagTiktokPost: (state) => {
      return state.sentimenthashtagtiktokpost;
    },

    getSentimentHashtagAllComment: (state) => {
      return state.sentimenthashtagallcomment;
    },
    getSentimentHashtagFacebookComment: (state) => {
      return state.sentimenthashtagfacebookcomment;
    },
    getSentimentHashtagTwitterComment: (state) => {
      return state.sentimenthashtagtwittercomment;
    },
    getSentimentHashtagInstagramComment: (state) => {
      return state.sentimenthashtaginstagramcomment;
    },
    getSentimentHashtagPantipComment: (state) => {
      return state.sentimenthashtagpantipcomment;
    },
    getSentimentHashtagNewsComment: (state) => {
      return state.sentimenthashtagnewscomment;
    },
    getSentimentHashtagYoutubeComment: (state) => {
      return state.sentimenthashtagyoutubecomment;
    },
    getSentimentHashtagBlockditComment: (state) => {
      return state.sentimenthashtagbdcomment;
    },
    getSentimentHashtagTiktokComment: (state) => {
      return state.sentimenthashtagtiktokcomment;
    },
  },
  mutations: {
    setQuerySearch: (state, payload) => {
      state.querysearch = payload;
    },
    setHashtagSocial: (state, payload) => {
      state.hashtagsocial = payload;
    },
    setKeywords: (state, payload) => {
      state.keywords = payload;
    },
    setDate: (state, payload) => {
      state.date = payload;
    },
    setDomain: (state, payload) => {
      state.domain = payload;
    },
    setSelected: (state, payload) => {
      state.selected = payload;
    },
    setSelectedMonitor: (state, payload) => {
      state.selectedmonitor = payload;
    },
    setHashtagChart: (state, payload) => {
      state.hashtagchart = payload;
    },
    setWordChart: (state, payload) => {
      state.wordchart = payload;
    },
    setWordCloud: (state, payload) => {
      state.wordcloud = payload;
    },
    setWordCloudDomain: (state, payload) => {
      state.domainname = payload;
    },
    setWordCloudSentiment: (state, payload) => {
      state.wordcloudsentiment = payload;
    },
    setWordCloudWordChart: (state, payload) => {
      state.wordcloudwordchart = payload;
    },
    setWordCloudHashtag: (state, payload) => {
      state.wordcloudhashtag = payload;
    },
    setWordCloudHashtagChart: (state, payload) => {
      state.wordcloudhashtagchart = payload;
    },
    setWordCloudStartDate: (state, payload) => {
      state.wordcloudstartdate = payload;
    },
    setWordCloudEndDate: (state, payload) => {
      state.wordcloudenddate = payload;
    },
    setWordCloudWordName: (state, payload) => {
      state.wordcloudwordname = payload;
    },
    setWordCloudSocial: (state, payload) => {
      state.wordcloudsocial = payload;
    },
    setWordCloudHash: (state, payload) => {
      state.wordcloudhash = payload;
    },
    setWordCloudImg: (state, payload) => {
      state.wordcloudimg = payload;
    },
    setSentiment: (state, payload) => {
      state.sentiment = payload;
    },
    setSentimentDetail: (state, payload) => {
      state.sentimentdetail = payload;
    },
    setDetailPost: (state, payload) => {
      state.detailPost = payload;
    },
    setDetailHashPost: (state, payload) => {
      state.detailHashPost = payload;
    },
    setSentimentChart: (state, payload) => {
      state.sentimentchart = payload;
    },
    setSentimentHashtagDetail: (state, payload) => {
      state.sentimenthashtagdetail = payload;
    },
    setSentimentAll: (state, payload) => {
      state.sentimentall = payload;
    },
    setSentimentFacebook: (state, payload) => {
      state.sentimentfacebook = payload;
    },
    setSentimentTwitter: (state, payload) => {
      state.sentimenttwitter = payload;
    },
    setSentimentPantip: (state, payload) => {
      state.sentimentpantip = payload;
    },
    setSentimentYoutube: (state, payload) => {
      state.sentimentyoutube = payload;
    },
    setSentimentInstagram: (state, payload) => {
      state.sentimentinstagram = payload;
    },
    setSentimentNews: (state, payload) => {
      state.sentimentnews = payload;
    },
    setSentimentBlockdit: (state, payload) => {
      state.sentimentbd = payload;
    },
    setSentimentTiktok: (state, payload) => {
      state.sentimenttiktok = payload;
    },
    setSentimentHashtag: (state, payload) => {
      state.sentimenthashtag = payload;
    },
    setSentimentHashtagChart: (state, payload) => {
      console.log("in set sentimentss");
      console.log(payload);
      state.sentimenthashtagchart = payload;
    },
    setSentimentHashtagAll: (state, payload) => {
      state.sentimenthashtagall = payload;
    },
    setSentimentHashtagFacebook: (state, payload) => {
      state.sentimenthashtagfacebook = payload;
    },
    setSentimentHashtagTwitter: (state, payload) => {
      state.sentimenthashtagtwitter = payload;
    },
    setSentimentHashtagPantip: (state, payload) => {
      state.sentimenthashtagpantip = payload;
    },
    setSentimentHashtagYoutube: (state, payload) => {
      state.sentimenthashtagyoutube = payload;
    },
    setSentimentHashtagInstagram: (state, payload) => {
      state.sentimenthashtaginstagram = payload;
    },
    setSentimentHashtagNews: (state, payload) => {
      state.sentimenthashtagnews = payload;
    },
    setSentimentHashtagBlockdit: (state, payload) => {
      state.sentimenthashtagbd = payload;
    },
    setSentimentHashtagTiktok: (state, payload) => {
      state.sentimenthashtagtiktok = payload;
    },

    setSentimentAllPost: (state, payload) => {
      state.sentimentallpost = payload;
    },
    setSentimentFacebookPost: (state, payload) => {
      state.sentimentfacebookpost = payload;
    },
    setSentimentTwitterPost: (state, payload) => {
      state.sentimenttwitterpost = payload;
    },
    setSentimentPantipPost: (state, payload) => {
      state.sentimentpantippost = payload;
    },
    setSentimentYoutubePost: (state, payload) => {
      state.sentimentyoutubepost = payload;
    },
    setSentimentInstagramPost: (state, payload) => {
      state.sentimentinstagrampost = payload;
    },
    setSentimentNewsPost: (state, payload) => {
      state.sentimentnewspost = payload;
    },
    setSentimentBlockditPost: (state, payload) => {
      state.sentimentbdpost = payload;
    },
    setSentimentTiktokPost: (state, payload) => {
      state.sentimenttiktokpost = payload;
    },

    setSentimentAllComment: (state, payload) => {
      state.sentimentallcomment = payload;
    },
    setSentimentFacebookComment: (state, payload) => {
      state.sentimentfacebookcomment = payload;
    },
    setSentimentTwitterComment: (state, payload) => {
      state.sentimenttwittercomment = payload;
    },
    setSentimentPantipComment: (state, payload) => {
      state.sentimentpantipcomment = payload;
    },
    setSentimentYoutubeComment: (state, payload) => {
      state.sentimentyoutubecomment = payload;
    },
    setSentimentInstagramComment: (state, payload) => {
      state.sentimentinstagramcomment = payload;
    },
    setSentimentNewsComment: (state, payload) => {
      state.sentimentnewscomment = payload;
    },
    setSentimentBlockditComment: (state, payload) => {
      state.sentimentbdcomment = payload;
    },
    setSentimentTiktokComment: (state, payload) => {
      state.sentimenttiktokcomment = payload;
    },

    setSentimentHashtagAllPost: (state, payload) => {
      state.sentimenthashtagallpost = payload;
    },
    setSentimentHashtagFacebookPost: (state, payload) => {
      state.sentimenthashtagfacebookpost = payload;
    },
    setSentimentHashtagTwitterPost: (state, payload) => {
      state.sentimenthashtagtwitterpost = payload;
    },
    setSentimentHashtagInstagramPost: (state, payload) => {
      state.sentimenthashtaginstagrampost = payload;
    },
    setSentimentHashtagPantipPost: (state, payload) => {
      state.sentimenthashtagpantippost = payload;
    },
    setSentimentHashtagNewsPost: (state, payload) => {
      state.sentimenthashtagnewspost = payload;
    },
    setSentimentHashtagYoutubePost: (state, payload) => {
      state.sentimenthashtagyoutubepost = payload;
    },
    setSentimentHashtagBlockditPost: (state, payload) => {
      state.sentimenthashtagbdpost = payload;
    },
    setSentimentHashtagTiktokPost: (state, payload) => {
      state.sentimenthashtagtiktokpost = payload;
    },
    setSentimentHashtagAllComment: (state, payload) => {
      state.sentimenthashtagallcomment = payload;
    },
    setSentimentHashtagFacebookComment: (state, payload) => {
      state.sentimenthashtagfacebookcomment = payload;
    },
    setSentimentHashtagTwitterComment: (state, payload) => {
      state.sentimenthashtagtwittercomment = payload;
    },
    setSentimentHashtagInstagramComment: (state, payload) => {
      state.sentimenthashtaginstagramcomment = payload;
    },
    setSentimentHashtagPantipComment: (state, payload) => {
      state.sentimenthashtagpantipcomment = payload;
    },
    setSentimentHashtagNewsComment: (state, payload) => {
      state.sentimenthashtagnewscomment = payload;
    },
    setSentimentHashtagYoutubeComment: (state, payload) => {
      state.sentimenthashtagyoutubecomment = payload;
    },
    setSentimentHashtagBlockditComment: (state, payload) => {
      state.sentimenthashtagbdcomment = payload;
    },
    setSentimentHashtagTiktokComment: (state, payload) => {
      state.sentimenthashtagtiktokcomment = payload;
    },
  },
  actions: {
    // async editSentimentPost({ commit},payload) {
    //   try {
    //     const res = await WordcloudService.EditSentiment(payload);
    //     commit('setEditSentiment', res.data);
    //   } catch (error) {
    //     console.log(error.response);
    //   }
    // },
    async fetchDomain({ commit }) {
      commit("setLoadStatus", true);
      try {
        const res = await WordcloudService.getDomain({ limit: 100000 });
        res.data.results.sort(function(a, b) {
          return parseFloat(a.id) - parseFloat(b.id);
        });
        commit("setDomain", res.data.results);
        commit("setLoadStatus", false);
      } catch (error) {
        console.log(error.response);
      }
    },
    async fetchWordCloud({ commit }, payload) {
      commit("setLoadStatus", true);
      commit("setLoadWordCloud", true);
      commit("setLoadDefaultCloud", true);
      commit("setLoadFeedWC", true);
      commit("setLoadCloud", true);
      try {
        const res = await WordcloudService.getWordCloud(payload);
        commit("setWordCloud", res.data);
        commit("setWordCloudImg", res.data.img.words);
        commit("setWordCloudHash", res.data.img.hashtag);
        let result = ["Name", "Positive", "Neutral", "Negative"];

        let wordChart = res.data.data.wordcloud.data;
        // console.log('wordChart',wordChart);
        // console.log('jfhdlg',wordChart[0].count[0].count);
        //console.log('mclsdckl', wordChart);
        commit("setWordChart", wordChart);
        let temp = [];
        for (var i = 0; i < 10; i++) {
         
          temp.push([
            wordChart[i].name,
            wordChart[i].count[0].count,
            wordChart[i].count[1].count,
            wordChart[i].count[2].count,
          ]);
        }
        // console.log('temp', temp);
        commit("setWordCloudWordChart", [result, ...temp]);
        console.log("word", [result, ...temp]);

        let temp1 = [];
        for (var j = 0; j < 10; j++) {
          temp1.push([wordChart[j].name]);
        }
        // console.log('temp1',temp1);
        commit("setWordCloudWordName", temp1);

        let hashtagChart = res.data.data.hashtag.data;
        commit("setHashtagChart", hashtagChart);
        temp = [];
       
        for (i = 0; i < 10; i++) {
          
          temp.push([
            hashtagChart[i].name,
            hashtagChart[i].count[0].count,
            hashtagChart[i].count[1].count,
            hashtagChart[i].count[2].count,
          ]);
        }
        commit("setWordCloudHashtagChart", [result, ...temp]);

        commit("setLoadStatus", false);
        commit("setLoadWordCloud", false);
        commit("setLoadDefaultCloud", false);
        commit("setLoadCloud", false);
        commit("setLoadFeedWC", false);
      } catch (error) {
        console.log(error);
        commit("setLoadStatus", false);
        commit("setLoadWordCloud", false);
        commit("setLoadDefaultCloud", false);
        commit("setLoadCloud", false);
        commit("setLoadFeedWC", false);
        // if(!this.getWordCloud){
        // alert("ไม่มีข้อมูล");
        // }
      }
    },
    async fetchWordCloudSentiment({ commit }, payload) {
      commit("setLoadStatus", true);
      try {
        const res = await WordcloudService.getWordCloudSentiment(payload);
        commit("setWordCloudSentiment", res.data);
        commit("setLoadStatus", false);
        // console.log('5555',res.data);
      } catch (error) {
        console.log(error.response);
      }
    },
    async fetchSentiment({ commit }, payload) {
      commit("setLoadChartCloud", true);
      try {
        const res = await WordcloudService.getSentiment(payload);
        commit("setSentiment", res.data);

        let result = ["Socials", "Users"];

        // let totalpie = 0
        let fbpie = 0;
        let twpie = 0;
        let igpie = 0;
        let ptpie = 0;
        let nwpie = 0;
        let ytpie = 0;
        let bdpie = 0;
        let ttpie = 0;

        let facebook = { negative: 0, neutral: 0, positive: 0 };
        let twitter = { negative: 0, neutral: 0, positive: 0 };
        let pantip = { negative: 0, neutral: 0, positive: 0 };
        let youtube = { negative: 0, neutral: 0, positive: 0 };
        let instagram = { negative: 0, neutral: 0, positive: 0 };
        let news = { negative: 0, neutral: 0, positive: 0 };
        let blockdit = { negative: 0, neutral: 0, positive: 0 };
        let tiktok = { negative: 0, neutral: 0, positive: 0 };
        let all = { negative: 0, neutral: 0, positive: 0 };
        let total = { comments: 0, post: 0 };

        if (res.data.facebook) {
          fbpie = res.data.facebook.users;
          facebook = res.data.facebook.total_sentiments;
          all.negative = all.negative +=
            res.data.facebook.total_sentiments.negative;
          all.neutral = all.neutral +=
            res.data.facebook.total_sentiments.neutral;
          all.positive = all.positive +=
            res.data.facebook.total_sentiments.positive;
          total.comments = total.comments += res.data.facebook.comment;
          total.post = total.post += res.data.facebook.post;

          commit("setSentimentFacebookPost", res.data.facebook.post);
          commit("setSentimentFacebookComment", res.data.facebook.comment);
        }

        if (res.data.twitter) {
          twpie = res.data.twitter.users;
          twitter = res.data.twitter.total_sentiments;
          all.negative = all.negative +=
            res.data.twitter.total_sentiments.negative;
          all.neutral = all.neutral +=
            res.data.twitter.total_sentiments.neutral;
          all.positive = all.positive +=
            res.data.twitter.total_sentiments.positive;
          total.comments = total.comments += res.data.twitter.comment;
          total.post = total.post += res.data.twitter.post;

          commit("setSentimentTwitterPost", res.data.twitter.post);
          commit("setSentimentTwitterComment", res.data.twitter.comment);
        }

        if (res.data.instagram) {
          igpie = res.data.instagram.users;
          instagram = res.data.instagram.total_sentiments;
          all.negative = all.negative +=
            res.data.instagram.total_sentiments.negative;
          all.neutral = all.neutral +=
            res.data.instagram.total_sentiments.neutral;
          all.positive = all.positive +=
            res.data.instagram.total_sentiments.positive;
          total.comments = total.comments += res.data.instagram.comment;
          total.post = total.post += res.data.instagram.post;

          commit("setSentimentInstagramPost", res.data.instagram.post);
          commit("setSentimentInstagramComment", res.data.instagram.comment);
        }

        if (res.data.pantip) {
          ptpie = res.data.pantip.users;
          pantip = res.data.pantip.total_sentiments;
          all.negative = all.negative +=
            res.data.pantip.total_sentiments.negative;
          all.neutral = all.neutral += res.data.pantip.total_sentiments.neutral;
          all.positive = all.positive +=
            res.data.pantip.total_sentiments.positive;
          total.comments = total.comments += res.data.pantip.comment;
          total.post = total.post += res.data.pantip.post;

          commit("setSentimentPantipPost", res.data.pantip.post);
          commit("setSentimentPantipComment", res.data.pantip.comment);
        }

        if (res.data.news) {
          nwpie = res.data.news.users;
          news = res.data.news.total_sentiments;
          all.negative = all.negative +=
            res.data.news.total_sentiments.negative;
          all.neutral = all.neutral += res.data.news.total_sentiments.neutral;
          all.positive = all.positive +=
            res.data.news.total_sentiments.positive;
          total.comments = total.comments += res.data.news.comment;
          total.post = total.post += res.data.news.post;

          commit("setSentimentNewsPost", res.data.news.post);
          commit("setSentimentNewsComment", res.data.news.comment);
        }

        if (res.data.youtube) {
          ytpie = res.data.youtube.users;
          youtube = res.data.youtube.total_sentiments;
          all.negative = all.negative +=
            res.data.youtube.total_sentiments.negative;
          all.neutral = all.neutral +=
            res.data.youtube.total_sentiments.neutral;
          all.positive = all.positive +=
            res.data.youtube.total_sentiments.positive;
          total.comments = total.comments += res.data.youtube.comment;
          total.post = total.post += res.data.youtube.post;

          commit("setSentimentYoutubePost", res.data.youtube.post);
          commit("setSentimentYoutubeComment", res.data.youtube.comment);
        }

        if (res.data.blockdit) {
          bdpie = res.data.blockdit.users;
          blockdit = res.data.blockdit.total_sentiments;
          all.negative = all.negative +=
            res.data.blockdit.total_sentiments.negative;
          all.neutral = all.neutral +=
            res.data.blockdit.total_sentiments.neutral;
          all.positive = all.positive +=
            res.data.blockdit.total_sentiments.positive;
          total.comments = total.comments += res.data.blockdit.comment;
          total.post = total.post += res.data.blockdit.post;

          commit("setSentimentBlockditPost", res.data.blockdit.post);
          commit("setSentimentBlockditComment", res.data.blockdit.comment);
        }

        if (res.data.tiktok) {
          ttpie = res.data.tiktok.users;
          tiktok = res.data.tiktok.total_sentiments;
          all.negative = all.negative +=
            res.data.tiktok.total_sentiments.negative;
          all.neutral = all.neutral +=
            res.data.tiktok.total_sentiments.neutral;
          all.positive = all.positive +=
            res.data.tiktok.total_sentiments.positive;
          total.comments = total.comments += res.data.tiktok.comment;
          total.post = total.post += res.data.tiktok.post;

          commit("setSentimentTiktokPost", res.data.tiktok.post);
          commit("setSentimentTiktokComment", res.data.tiktok.comment);
        }

        let temp = [];
        temp.push(
          ["Facebook", fbpie],
          ["Twitter", twpie],
          ["Instagram", igpie],
          ["Pantip", ptpie],
          ["News", nwpie],
          ["Youtube", ytpie],
          ["Blockdit", bdpie],
          ["Tiktok", ttpie]
        );
        commit("setSentimentChart", [result, ...temp]);

        commit("setSentimentAll", all);

        commit("setSentimentFacebook", facebook);

        commit("setSentimentTwitter", twitter);

        commit("setSentimentPantip", pantip);

        commit("setSentimentYoutube", youtube);

        commit("setSentimentInstagram", instagram);

        commit("setSentimentNews", news);
        commit("setSentimentBlockdit", blockdit);
        commit("setSentimentTiktok", tiktok);

        commit("setSentimentAllPost", total.post);

        commit("setSentimentAllComment", total.comments);

        commit("setLoadChartCloud", false);
      } catch (error) {
        console.log(error);
      }
    },
    async fetchSentimentHashtag({ commit }, payload) {
      commit("setLoadChartCloud", true);
      try {
        const res = await WordcloudService.getSentimentHashtag(payload);
        console.log("res = ", res.data);
        commit("setSentimentHashtag", res.data);

        let result = ["Socials", "Users"];

        let fbpie = 0;
        let twpie = 0;
        let igpie = 0;
        let ptpie = 0;
        let nwpie = 0;
        let ytpie = 0;
        let bdpie = 0;
        let ttpie = 0;

        let facebook = { negative: 0, neutral: 0, positive: 0 };
        let twitter = { negative: 0, neutral: 0, positive: 0 };
        let pantip = { negative: 0, neutral: 0, positive: 0 };
        let youtube = { negative: 0, neutral: 0, positive: 0 };
        let instagram = { negative: 0, neutral: 0, positive: 0 };
        let news = { negative: 0, neutral: 0, positive: 0 };
        let blockdit = { negative: 0, neutral: 0, positive: 0 };
        let tiktok = { negative: 0, neutral: 0, positive: 0 };

        let all = { negative: 0, neutral: 0, positive: 0 };
        let total = { comments: 0, post: 0 };

        if (res.data.facebook) {
          fbpie = res.data.facebook.users;
          facebook = res.data.facebook.total_sentiments;
          all.negative = all.negative +=
            res.data.facebook.total_sentiments.negative;
          all.neutral = all.neutral +=
            res.data.facebook.total_sentiments.neutral;
          all.positive = all.positive +=
            res.data.facebook.total_sentiments.positive;
          total.comments = total.comments += res.data.facebook.comment;
          total.post = total.post += res.data.facebook.post;

          commit("setSentimentHashtagFacebookPost", res.data.facebook.post);
          commit(
            "setSentimentHashtagFacebookComment",
            res.data.facebook.comment
          );
        }

        if (res.data.twitter) {
          twpie = res.data.twitter.users;
          twitter = res.data.twitter.total_sentiments;
          all.negative = all.negative +=
            res.data.twitter.total_sentiments.negative;
          all.neutral = all.neutral +=
            res.data.twitter.total_sentiments.neutral;
          all.positive = all.positive +=
            res.data.twitter.total_sentiments.positive;
          total.comments = total.comments += res.data.twitter.comment;
          total.post = total.post += res.data.twitter.post;

          commit("setSentimentHashtagTwitterPost", res.data.twitter.post);
          commit("setSentimentHashtagTwitterComment", res.data.twitter.comment);
        }

        if (res.data.instagram) {
          igpie = res.data.instagram.users;
          instagram = res.data.instagram.total_sentiments;
          all.negative = all.negative +=
            res.data.instagram.total_sentiments.negative;
          all.neutral = all.neutral +=
            res.data.instagram.total_sentiments.neutral;
          all.positive = all.positive +=
            res.data.instagram.total_sentiments.positive;
          total.comments = total.comments += res.data.instagram.comment;
          total.post = total.post += res.data.instagram.post;

          commit("setSentimentHashtagInstagramPost", res.data.instagram.post);
          commit(
            "setSentimentHashtagInstagramComment",
            res.data.instagram.comment
          );
        }

        if (res.data.pantip) {
          ptpie = res.data.pantip.users;
          pantip = res.data.pantip.total_sentiments;
          all.negative = all.negative +=
            res.data.pantip.total_sentiments.negative;
          all.neutral = all.neutral += res.data.pantip.total_sentiments.neutral;
          all.positive = all.positive +=
            res.data.pantip.total_sentiments.positive;
          total.comments = total.comments += res.data.pantip.comment;
          total.post = total.post += res.data.pantip.post;

          commit("setSentimentHashtagPantipPost", res.data.pantip.post);
          commit("setSentimentHashtagPantipComment", res.data.pantip.comment);
        }

        if (res.data.news) {
          nwpie = res.data.news.users;
          news = res.data.news.total_sentiments;
          all.negative = all.negative +=
            res.data.news.total_sentiments.negative;
          all.neutral = all.neutral += res.data.news.total_sentiments.neutral;
          all.positive = all.positive +=
            res.data.news.total_sentiments.positive;
          total.comments = total.comments += res.data.news.comment;
          total.post = total.post += res.data.news.post;

          commit("setSentimentHashtagNewsPost", res.data.news.post);
          commit("setSentimentHashtagNewsComment", res.data.news.comment);
        }

        if (res.data.youtube) {
          ytpie = res.data.youtube.users;
          youtube = res.data.youtube.total_sentiments;
          all.negative = all.negative +=
            res.data.youtube.total_sentiments.negative;
          all.neutral = all.neutral +=
            res.data.youtube.total_sentiments.neutral;
          all.positive = all.positive +=
            res.data.youtube.total_sentiments.positive;
          total.comments = total.comments += res.data.youtube.comment;
          total.post = total.post += res.data.youtube.post;

          commit("setSentimentHashtagYoutubePost", res.data.youtube.post);
          commit("setSentimentHashtagYoutubeComment", res.data.youtube.comment);
        }
        if (res.data.blockdit) {
          bdpie = res.data.blockdit.users;
          blockdit = res.data.blockdit.total_sentiments;
          all.negative = all.negative +=
            res.data.blockdit.total_sentiments.negative;
          all.neutral = all.neutral +=
            res.data.blockdit.total_sentiments.neutral;
          all.positive = all.positive +=
            res.data.blockdit.total_sentiments.positive;
          total.comments = total.comments += res.data.blockdit.comment;
          total.post = total.post += res.data.blockdit.post;

          commit("setSentimentHashtagBlockditPost", res.data.blockdit.post);
          commit(
            "setSentimentHashtagBlockditComment",
            res.data.blockdit.comment
          );
        }

        if (res.data.tiktok) {
          ttpie = res.data.tiktok.users;
          tiktok = res.data.tiktok.total_sentiments;
          all.negative = all.negative +=
            res.data.tiktok.total_sentiments.negative;
          all.neutral = all.neutral +=
            res.data.tiktok.total_sentiments.neutral;
          all.positive = all.positive +=
            res.data.tiktok.total_sentiments.positive;
          total.comments = total.comments += res.data.tiktok.comment;
          total.post = total.post += res.data.tiktok.post;

          commit("setSentimentHashtagTiktokPost", res.data.tiktok.post);
          commit(
            "setSentimentHashtagTiktokComment",
            res.data.tiktok.comment
          );
        }

        let temp = [];
        temp.push(
          ["Facebook", fbpie],
          ["Twitter", twpie],
          ["Pantip", ptpie],
          ["Youtube", ytpie],
          ["Instagram", igpie],
          ["News", nwpie],
          ["Blockdit", bdpie],
          ["Tiktok", ttpie]
        );
        commit("setSentimentHashtagChart", [result, ...temp]);

        // let keep = ["Positive", "Neutral", "Negative"]
        commit("setSentimentHashtagAll", all);

        commit("setSentimentHashtagFacebook", facebook);

        commit("setSentimentHashtagTwitter", twitter);

        commit("setSentimentHashtagPantip", pantip);

        commit("setSentimentHashtagYoutube", youtube);

        commit("setSentimentHashtagInstagram", instagram);
        commit("setSentimentHashtagBlockdit", blockdit);
        commit("setSentimentHashtagTiktok", tiktok);
        commit("setSentimentHashtagNews", news);

        commit("setSentimentHashtagAllPost", total.post);

        commit("setSentimentHashtagAllComment", total.comments);
        commit("setLoadChartCloud", false);
      } catch (error) {
        console.log(error);
      }
    },
    async fetchSentimentDetail({ commit }, payload) {
      commit("setLoadPostCloud", true);
      try {
        const res = await WordcloudService.getSentimentDetail(payload);
        var post = res.data.data;
        var pair = { read: true };
        var posts = post.map((result) => {
          return { ...result, ...pair };
        });
        // -------------------------------------------translateuid-----------------------------------------------------------
        posts.map((result) => {
          // console.log('API',result);
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
                  // console.log('2',result);
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

        // console.log('post',posts);
        // ---------------------------------------------------------------------------------------------------------
        commit("setSentimentDetail", res.data);
        commit("setDetailPost", posts);
        commit("setLoadPostCloud", false);
      } catch (error) {
        console.log(error);
      }
    },
    async fetchSentimentHashtagDetail({ commit }, payload) {
      commit("setLoadPostHash", true);
      try {
        const res = await WordcloudService.getSentimentHashtagDetail(payload);
        var post = res.data.data;
        var pair = { read: true };
        var posts = post.map((result) => {
          return { ...result, ...pair };
        });
        // -------------------------------------------translateuid-----------------------------------------------------------
        posts.map((result) => {
          // console.log('API',result);
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
                  // console.log('2',result);
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

        // console.log('post',posts);
        // ---------------------------------------------------------------------------------------------------------
        console.log("posts", posts);
        commit("setSentimentHashtagDetail", res.data);
        commit("setDetailHashPost", posts);
        commit("setLoadPostHash", false);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
