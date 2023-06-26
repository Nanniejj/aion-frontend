import { DashboardService } from "@/common/api.services";
export default {
  state: {
    datacraw: {
      crawler_pantip: 0,
      crawler_twitter: 0,
      crawler_facebook: 0,
      crawler_instagram: 0,
      crawler_youtube: 0,
      crawler_news: 0,
      crawler_blockdit: 0,
      crawler_tiktok: 0,
      preprocess_pantip: 0,
      preprocess_facebook: 0,
      preprocess_twitter: 0,
      preprocess_instagram: 0,
      preprocess_youtube: 0,
      preprocess_news: 0,
      preprocess_blockdit:0,
      preprocess_tiktok:0
    },
    sumdb: [],
    editData: [],
    rage_Startdate: "",
    rage_Enddate: "",
    facebook: {
      post: 0,
      comment: 0,
      users: 0,
      total_sentiments: { positive: 0, neutral: 0, negative: 0 },
    },
    twitter: {
      post: 0,
      comment: 0,
      users: 0,
      total_sentiments: { positive: 0, neutral: 0, negative: 0 },
    },
    pantip: {
      post: 0,
      comment: 0,
      users: 0,
      total_sentiments: { positive: 0, neutral: 0, negative: 0 },
    },
    news: {
      post: 0,
      comment: 0,
      users: 0,
      total_sentiments: { positive: 0, neutral: 0, negative: 0 },
    },
    youtube: {
      post: 0,
      comment: 0,
      users: 0,
      total_sentiments: { positive: 0, neutral: 0, negative: 0 },
    },
    instagram: {
      post: 0,
      comment: 0,
      users: 0,
      total_sentiments: { positive: 0, neutral: 0, negative: 0 },
    },
    blockdit: {
      post: 0,
      comment: 0,
      users: 0,
      total_sentiments: { positive: 0, neutral: 0, negative: 0 },
    },
    tiktok: {
      post: 0,
      comment: 0,
      users: 0,
      total_sentiments: { positive: 0, neutral: 0, negative: 0 },
    },

    timelineFacebook: [],
    timelineNews: [],
    timelineTwitter: [],
    timelineInstagram: [],
    timelinePantip: [],
    timelineYoutube: [],
    sumFacebook: {
      comment: 0,
      enddate: "",
      post: 0,
      source: 0,
      startdate: "",
      users: 0,
    },
    sumTwitter: {
      comment: 0,
      enddate: "",
      post: 0,
      source: 0,
      startdate: "",
      users: 0,
    },
    sumPantip: {
      comment: 0,
      enddate: "",
      post: 0,
      source: 0,
      startdate: "",
      users: 0,
    },
    sumNews: {
      comment: 0,
      enddate: "",
      post: 0,
      source: 0,
      startdate: "",
      users: 0,
    },
    sumYoutube: {
      comment: 0,
      enddate: "",
      post: 0,
      source: 0,
      startdate: "",
      users: 0,
    },
    sumInstagram: {
      comment: 0,
      enddate: "",
      post: 0,
      source: 0,
      startdate: "",
      users: 0,
    },
    sumBlockdit: {
      comment: 0,
      enddate: "",
      post: 0,
      source: 0,
      startdate: "",
      users: 0,
    },
    sumTiktok: {
      comment: 0,
      enddate: "",
      post: 0,
      source: 0,
      startdate: "",
      users: 0,
    },
    sum: [],
    summary: {
      comment: 0,
      enddate: "",
      post: 0,
      source: 0,
      startdate: "",
      users: 0,
    },
    dateChoice: "daily",
    textPost: [
      {
        account_name: "",
        content: "",
        date: "",
        original_post: "",
        photo: "",
        post_type: "",
        postid: "",
        source: "",
        uid: "",
        count: 0,
        total_comment: 0,
      },
    ],

    backlogs: [],
  },
  getters: {
    getCraw: (state) => {
      return state.datacraw;
    },
    getEditSentiment: (state) => {
      return state.editData;
    },
    getRangeStartdate: (state) => {
      return state.rage_Startdate;
    },
    getRangeEnddate: (state) => {
      return state.rage_Enddate;
    },
    getSentimentPost: (state) => {
      return state.textPost;
    },
    getTimelineFacebook: (state) => {
      return state.timelineFacebook;
    },
    getTimelineTwitter: (state) => {
      return state.timelineTwitter;
    },
    getTimelinePantip: (state) => {
      return state.timelinePantip;
    },
    getTimelineInstagram: (state) => {
      return state.timelineInstagram;
    },
    getTimelineYoutube: (state) => {
      return state.timelineYoutube;
    },
    getTimelineNews: (state) => {
      return state.timelineNews;
    },
    getFacebook: (state) => {
      return state.facebook;
    },
    getSumFacebook: (state) => {
      return state.sumFacebook;
    },
    getTwitter: (state) => {
      return state.twitter;
    },
    getSumTwitter: (state) => {
      return state.sumTwitter;
    },
    getPantip: (state) => {
      return state.pantip;
    },
    getSumPantip: (state) => {
      return state.sumPantip;
    },
    getNews: (state) => {
      return state.news;
    },
    getSumNews: (state) => {
      return state.sumNews;
    },
    getYoutube: (state) => {
      return state.youtube;
    },
    getSumYoutube: (state) => {
      return state.sumYoutube;
    },
    getInstagram: (state) => {
      return state.instagram;
    },
    getSumInstagram: (state) => {
      return state.sumInstagram;
    },
    getBlockdit: (state) => {
      return state.blockdit;
    },
    getSumBlockdit: (state) => {
      return state.sumBlockdit;
    },
    getTiktok: (state) => {
      return state.tiktok;
    },
    getSumTiktok: (state) => {
      return state.sumTiktok;
    },
    getSummary: (state) => {
      return state.summary;
    },
    getDateChoice: (state) => {
      return state.dateChoice;
    },
    getSumDB: (state) => {
      return state.sumdb;
    },
    getBacklogs: (state) => {
      return state.backlogs;
    },
  },
  mutations: {
    setEditSentiment: (state, payload) => {
      state.editData = payload;
    },
    setRageStartdate: (state, payload) => {
      state.rage_Startdate = payload;
    },
    setRageEnddate: (state, payload) => {
      state.rage_Enddate = payload;
    },
    setFetchSentimentPost: (state, payload) => {
      state.textPost = payload;
    },
    setTimelineFacebook: (state, payload) => {
      state.timelineFacebook = payload;
    },
    setTimelineTwitter: (state, payload) => {
      state.timelineTwitter = payload;
    },
    setTimelinePantip: (state, payload) => {
      state.timelinePantip = payload;
    },
    setTimelineInstagram: (state, payload) => {
      state.timelineInstagram = payload;
    },
    setTimelineYoutube: (state, payload) => {
      state.timelineYoutube = payload;
    },
    setTimelineNews: (state, payload) => {
      state.timelineNews = payload;
    },
    setFetchApiDashboard: (state, payload) => {
      state.facebook = payload.facebook;
      state.twitter = payload.twitter;
      state.pantip = payload.pantip;
      state.news = payload.news;
      state.youtube = payload.youtube;
      state.instagram = payload.instagram;
      state.blockdit = payload.blockdit;
      state.tiktok = payload.tiktok;
    },
    setFetchApiSumDashboard: (state, payload) => {
      //state.sumdb=payload
      console.log("sum", payload);
      let summary = { users: 0, post: 0, comment: 0 };
      payload[0].map((item) => {
        if (item.source === "youtube") {
          state.sumYoutube = item;
          summary.users = summary.users + item.users;
          summary.post = summary.post + item.post;
          summary.comment = summary.comment + item.comment;
        }
        if (item.source === "facebook") {
          state.sumFacebook = item;
          summary.users = summary.users + item.users;
          summary.post = summary.post + item.post;
          summary.comment = summary.comment + item.comment;
        }
        if (item.source === "pantip") {
          state.sumPantip = item;
          summary.users = summary.users + item.users;
          summary.post = summary.post + item.post;
          summary.comment = summary.comment + item.comment;
        }
        if (item.source === "news") {
          state.sumNews = item;
          summary.users = summary.users + item.users;
          summary.post = summary.post + item.post;
          summary.comment = summary.comment + item.comment;
        }
        if (item.source === "twitter") {
          state.sumTwitter = item;
          summary.users = summary.users + item.users;
          summary.post = summary.post + item.post;
          summary.comment = summary.comment + item.comment;
        }
        if (item.source === "instagram") {
          state.sumInstagram = item;
          summary.users = summary.users + item.users;
          summary.post = summary.post + item.post;
          summary.comment = summary.comment + item.comment;
        }
        if (item.source === "blockdit") {
          state.sumBlockdit = item;
          summary.users = summary.users + item.users;
          summary.post = summary.post + item.post;
          summary.comment = summary.comment + item.comment;
        }
        if (item.source === "tiktok") {
          state.sumTiktok = item;
          summary.users = summary.users + item.users;
          summary.post = summary.post + item.post;
          summary.comment = summary.comment + item.comment;
        }
      });
      state.summary = summary;

      for (const [key, value] of Object.entries(payload[1][0])) {
        state.datacraw[key] = value;
      }
    },
    setBlockdit: (state, payload) => {
      state.blockdit = payload;
    },
    setSumBlockdit: (state, payload) => {
      state.sumBlockdit = payload;
    },
    setTiktok: (state, payload) => {
      state.tiktok = payload;
    },
    setSumTiktok: (state, payload) => {
      state.sumTiktok = payload;
    },
    setFacebook: (state, payload) => {
      state.facebook = payload;
    },
    setSumFacebook: (state, payload) => {
      state.sumFacebook = payload;
    },
    setTwitter: (state, payload) => {
      state.twitter = payload;
    },
    setSumTwitter: (state, payload) => {
      state.sumTwitter = payload;
    },
    setPantip: (state, payload) => {
      state.pantip = payload;
    },
    setSumPantip: (state, payload) => {
      state.sumPantip = payload;
    },
    setNews: (state, payload) => {
      state.news = payload;
    },
    setSumNews: (state, payload) => {
      state.sumNews = payload;
    },
    setYoutube: (state, payload) => {
      state.youtube = payload;
    },
    setSumYoutube: (state, payload) => {
      state.sumYoutube = payload;
    },
    setInstagram: (state, payload) => {
      state.instagram = payload;
    },
    setSumInstagram: (state, payload) => {
      state.sumInstagram = payload;
    },
    setSummary: (state, payload) => {
      state.summary = payload;
    },
    changeDataChoice: (state, payload) => {
      state.dateChoice = payload.choice;
    },
    setBacklogs: (state, payload) => {
      state.backlogs = payload;
    },
  },
  actions: {
    async editSentimentPost({ commit }, payload) {
      try {
        const res = await DashboardService.EditSentiment(payload);
        commit("setEditSentiment", res.data);
      } catch (error) {
        console.log(error.response);
      }
    },

    async fetchAllstats({ commit }, payload) {
      //commit('setLoadStatus', true );
      try {
        const res = await DashboardService.getAllstats(payload);
        commit("setFetchApiSumDashboard", res.data.data);
        console.log(res.data);
        // commit('setLoadStatus', false );
      } catch (error) {
        console.log(error.response);
      }
    },
    async fetchSentimentPost({ commit }, payload) {
      commit("setLoadStatus", true);
      try {
        const res = await DashboardService.getSentimentPost(payload);
        commit("setFetchSentimentPost", res.data);
        commit("setLoadStatus", false);

        //console.log(res.data);
      } catch (error) {
        commit("setLoadStatus", false);
        alert("ระบบไม่สามารถใช้งานได้ในขณะนี้");
      }
    },
    async fetchBacklogs({ commit }, payload) {
      commit("setLoadStatus", true);
      try {
        const res = await DashboardService.getBacklogs(payload);
        commit("setBacklogs", res.data);
        commit("setLoadStatus", false);

        //console.log(res.data);
      } catch (error) {
        console.log(error);
        commit("setLoadStatus", false);
      }
    },

    async fetchSentimentStatDashboard({ commit }, payload) {
      commit("setLoadStatus", true);
      try {
        const res = await DashboardService.getSentimentStatDashboard(payload);
        commit("setFetchApiDashboard", res.data);
        let result = ["Date", "Positive", "Neutral", "Negative"];
        let facebook = res.data.facebook.sentiment;
        let temp = [];
        for (const i in facebook) {
          temp.push([
            i,
            facebook[i].positive,
            facebook[i].neutral,
            facebook[i].negative,
          ]);
        }
        commit("setTimelineFacebook", [result, ...temp]);

        let twitter = res.data.twitter.sentiment;
        temp = [];
        for (const i in twitter) {
          temp.push([
            i,
            twitter[i].positive,
            twitter[i].neutral,
            twitter[i].negative,
          ]);
        }
        commit("setTimelineTwitter", [result, ...temp]);

        let pantip = res.data.pantip.sentiment;
        temp = [];
        for (const i in pantip) {
          temp.push([
            i,
            pantip[i].positive,
            pantip[i].neutral,
            pantip[i].negative,
          ]);
        }
        commit("setTimelinePantip", [result, ...temp]);

        let instagram = res.data.instagram.sentiment;
        temp = [];
        for (const i in instagram) {
          temp.push([
            i,
            instagram[i].positive,
            instagram[i].neutral,
            instagram[i].negative,
          ]);
        }
        commit("setTimelineInstagram", [result, ...temp]);

        let youtube = res.data.youtube.sentiment;
        temp = [];
        for (const i in youtube) {
          temp.push([
            i,
            youtube[i].positive,
            youtube[i].neutral,
            youtube[i].negative,
          ]);
        }
        commit("setTimelineYoutube", [result, ...temp]);

        let news = res.data.news.sentiment;
        temp = [];
        for (const i in news) {
          temp.push([i, news[i].positive, news[i].neutral, news[i].negative]);
        }
        commit("setTimelineNews", [result, ...temp]);
        commit("setLoadStatus", false);
      } catch (error) {
        commit('setLoadStatus', false );
        alert("ระบบไม่สามารถโหลดข้อมูลได้ในขณะนี้");
      }
    },
  },
};
