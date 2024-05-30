import { MonitorService } from "@/common/api.services";
import { DomainService } from "@/common/api.services";
import { API_V2_URL } from "@/common/config";
import moment from "moment";
export default {
  state: {
    mapstatic: [],
    loadMapstatic: false,
    loadMapStat: false,
    locationStat: [],
    locationPost: [],
    loadKeyword: false,
    loadMapPost: false,
    keywordCount: { fb: 0, tw: 0 },
    keywordName: "",
    keywordPost: [],
    keywordMonitor: [],
    mapdata: [],
    maxminmap: "",
    sumsocial: {
      targetlist: [],
      hashtaglist: [],
      summary: {
        target: {
          facebook: 0,
          twitter: 0,
          pantip: 0,
          news: 0,
          instagram: 0,
          youtube: 0,
        },
        hashtag: {
          facebook: 0,
          twitter: 0,
          pantip: 0,
          news: 0,
          instagram: 0,
          youtube: 0,
        },
      },
    },
    updatetable: false,
    profileHash: "",
    tabName: "",
    valSource: "",
    sdateProfile: "",
    edateProfile: "",
    arrDateProfile: "",
    cntm2: 0,
    cntm: 0,
    countPost: 0,
    statusHashtag: null,
    postsCount: 0,
    editDescript: [],
    loCount: 0,
    page: 0,
    delMonitor: [],
    addAccount: [],
    listProfile: {
      targetlist: [],
      hashtaglist: [],
      summary: {
        target: {
          facebook: 0,
          twitter: 0,
          pantip: 0,
          news: 0,
          instagram: 0,
          youtube: 0,
        },
        hashtag: {
          facebook: 0,
          twitter: 0,
          pantip: 0,
          news: 0,
          instagram: 0,
          youtube: 0,
        },
      },
    },
    listHashtag: [],
    listMonitor: [],
    createMonitor: [],
    topfiveDomain: "",
    topfiveHashtag: [],
    postMonitor: { data: [] },
    tabStatus: true,
    profileMonitor: {
      profile: [{ link_original: "", uid: "", followers: 0, following: 0 }],
      topfive: [],
      posts: { count: 0 },
      wordcloud_images: { hashtag: "", words: "" },
    },
    profileData: "",
    itemsProfile: [],
    fieldsProfile: [
      { key: "id", label: "#", sortable: true },
      { key: "uid", label: "user id", sortable: true },
      { key: "name", label: "name", sortable: true },
      { key: "source", label: "source", sortable: true },
      { key: "crawled", label: "การเก็บข้อมูล", sortable: true },
      // {
      //   key: "status",
      //   label: "สถานะ",
      //   formatter: (value) => {
      //     return value ? "มีข้อมูล" : "ไม่มีข้อมูล";
      //   },
      //   sortable: true,
      //   sortByFormatted: true,
      //   filterByFormatted: true,
      // },
      { key: "actions", label: "การจัดการ" },
    ],
    totalRows: 1,
    currentPage: 1,
    perPage: 10,
    pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
    sortBy: "",
    sortDesc: false,
    sortDirection: "asc",
    filter: null,
    filterOn: [],
    socialmo: "",
  },
  getters: {
    getMapStatic: (state) => {
      return state.mapstatic;
    },
    getLocationStat: (state) => {
      return state.locationStat;
    },
    getLoadMapStat: (state) => {
      return state.loadMapStat;
    },
    getLoadMapStatic: (state) => {
      return state.loadMapstatic;
    },
    getLoadMapPost: (state) => {
      return state.loadMapPost;
    },
    getLocationPost: (state) => {
      return state.locationPost;
    },
    getLoadKeyword: (state) => {
      return state.loadKeyword;
    },
    getKeywordCount: (state) => {
      return state.keywordCount;
    },
    getKeywordName: (state) => {
      return state.keywordName;
    },
    getKeywordPost: (state) => {
      return state.keywordPost;
    },
    getKeyword: (state) => {
      return state.keywordMonitor;
    },
    getMaxMinMap: (state) => {
      return state.maxminmap;
    },
    getMapdata: (state) => {
      return state.mapdata;
    },
    getSumMonitor: (state) => {
      return state.sumsocial;
    },
    getUpdateTable: (state) => {
      return state.updatetable;
    },
    getProfileHash: (state) => {
      return state.profileHash;
    },
    getTabName: (state) => {
      return state.tabName;
    },
    getValSource: (state) => {
      return state.valSource;
    },
    getSDateProfile: (state) => {
      return state.sdateProfile;
    },
    getEDateProfile: (state) => {
      return state.edateProfile;
    },
    getArrDateProfile: (state) => {
      return state.arrDateProfile;
    },
    getCnt2: (state) => {
      return state.cntm2;
    },
    getCnt: (state) => {
      return state.cntm;
    },
    getCountAllPost: (state) => {
      return state.countPost;
    },
    getStatusHashtag: (state) => {
      return state.statusHashtag;
    },
    getCountPost: (state) => {
      return state.postsCount;
    },
    getEditDescription: (state) => {
      return state.editDescript;
    },
    getLocationCount: (state) => {
      return state.loCount;
    },
    getListMonitorProfile: (state) => {
      return state.listProfile;
    },
    getListMonitorHashtag: (state) => {
      return state.listHashtag;
    },
    getListMonitor: (state) => {
      return state.listMonitor;
    },
    getCreateMonitor: (state) => {
      return state.createMonitor;
    },
    getTopHash: (state) => {
      return state.topfiveHashtag;
    },
    getTopDomain: (state) => {
      return state.topfiveDomain;
    },
    getPostAllMonitor: (state) => {
      return state.postMonitor;
    },
    getTabStatus: (state) => {
      return state.tabStatus;
    },
    getProfileMonitor: (state) => {
      return state.profileMonitor;
    },
    getProfileData: (state) => {
      return state.profileData;
    },
    getItemsProfile: (state) => {
      return state.itemsProfile;
    },
    getProfile: (state) => {
      return state;
    },
    getFieldsProfile: (state) => {
      return state.fieldsProfile;
    },
    getSocialMo: (state) => {
      return state.socialmo;
    },
  },
  mutations: {
    setMapStatic: (state, payload) => {
      state.mapstatic = payload;
    },
    setLocationStat: (state, payload) => {
      state.locationStat = payload;
    },
    setLocationPost: (state, payload) => {
      state.locationPost = payload;
    },
    setLoadMapStat: (state, payload) => {
      state.loadMapStat = payload;
    },
    setLoadMapStatic: (state, payload) => {
      state.loadMapstatic=payload
    },
    setLoadMapPost: (state, payload) => {
      state.loadMapPost = payload;
    },
    setLoadKeyword: (state, payload) => {
      state.loadKeyword = payload;
    },
    setKeywordCount: (state, payload) => {
      state.keywordCount = payload;
    },
    setKeywordName: (state, payload) => {
      state.keywordName = payload;
    },
    setKeywordPost: (state, payload) => {
      state.keywordPost = payload;
    },
    setKeyword: (state, payload) => {
      state.keywordMonitor = payload;
    },
    setMaxMinMap: (state, payload) => {
      state.maxminmap = payload;
    },
    setMapdata: (state, payload) => {
      state.mapdata = payload;
    },
    setSumMonitor: (state, payload) => {
      state.sumsocial = payload;
    },
    setUpdateTable: (state, payload) => {
      state.updatetable = payload;
    },
    setTabName: (state, payload) => {
      state.tabName = payload;
    },
    setValSource: (state, payload) => {
      state.valSource = payload;
    },
    setSDateProfile: (state, payload) => {
      state.sdateProfile = payload;
    },
    setEDateProfile: (state, payload) => {
      state.edateProfile = payload;
    },
    setArrDateProfile: (state, payload) => {
      state.arrDateProfile = payload;
    },
    setCnt2: (state, payload) => {
      state.cntm2 = payload;
    },
    setCnt: (state, payload) => {
      state.cntm = payload;
    },
    setCountAllPost: (state, payload) => {
      state.countPost = payload;
    },
    setStatusHashtag: (state, payload) => {
      state.statusHashtag = payload;
    },
    setCountPost: (state, payload) => {
      state.postsCount = payload;
    },
    setEditDescription: (state, payload) => {
      state.editDescript = payload;
    },
    delMonitor: (state, payload) => {
      //state.listProfile=payload

      // let i = state.listProfile.targetlist.map(item => item.uid).indexOf(payload);
      //     state.listProfile.targetlist.splice(i, 1);
      //    console.log('iiiiii',i);
      state.delMonitor = payload;
    },
    addAccount: (state, payload) => {
      // console.log("acc payload", payload.hashtaglist, typeof payload);
      if (payload.targetlist) {
        state.listProfile.targetlist = [
          ...state.listProfile.targetlist,
          ...payload.targetlist,
        ];
        // console.log("acc state", state.listProfile.targetlist);
      } else {
        state.listProfile.hashtaglist = [
          ...state.listProfile.hashtaglist,
          ...payload.hashtaglist,
        ];
      }
    },
    setListHashtag: (state, payload) => {
      state.listHashtag = payload;
    },
    setListProfile: (state, payload) => {
      state.listProfile = payload;
    },
    setListMonitor: (state, payload) => {
      state.listMonitor = payload;
    },
    setTopHash: (state, payload) => {
      state.topfiveHashtag = payload;
    },
    setTopDomain: (state, payload) => {
      state.topfiveDomain = payload;
    },
    setCreateMonitor: (state, payload) => {
      state.createMonitor = payload;
    },

    setPostAllMonitor: (state, payload) => {
      state.postMonitor = payload;
    },
    addPostAllMonitor: (state, payload) => {
      state.postMonitor = [...state.postMonitor, ...payload];
    },
    setPostLocation: (state, payload) => {
      state.postMonitor = payload;
    },
    setLocationCount: (state, payload) => {
      state.loCount = payload;
    },
    addPostLocation: (state, payload) => {
      // console.log(payload);
      state.postMonitor = [...state.postMonitor, ...payload];
    },

    setTabStatus: (state, payload) => {
      state.tabStatus = payload;
    },
    setProfileHash: (state, payload) => {
      state.profileHash = payload;
    },
    setProfileMonitor: (state, payload) => {
      state.profileMonitor = payload;
    },
    setProfileData: (state, payload) => {
      state.profileData = payload;
    },
    setItemsProfile: (state, payload) => {
      state.itemsProfile = payload;
    },
    setFieldsProfile: (state, payload) => {
      state.fieldsProfile = payload;
    },
    setProfile: (state, payload) => {
      state = payload;
    },
    setSocialMo: (state, payload) => {
      state.socialmo = payload;
    },
    setCurrentPage: (state, payload) => {
      state.currentPage = payload;
    },
    addAllPost: (state, payload) => {
      // console.log(payload);

      let temp = [...state.postMonitor, ...payload];
      // console.log("temp", temp);
      const ids = temp.map((o) => o.full_text);
      const filtered = temp.filter(
        ({ full_text }, index) => !ids.includes(full_text, index + 1)
      );
      state.postMonitor = filtered;
    },

    setAllPostDomain: (state, payload) => {
      let temp = (state.postMonitor = payload);
      const ids = temp.map((o) => o.full_text);
      const filtered = temp.filter(
        ({ full_text }, index) => !ids.includes(full_text, index + 1)
      );
      state.postMonitor = filtered;
    },
  },
  actions: {
    async apiLocationStat({ commit, dispatch, state }, payload) {
      commit("setLoadMapStat", true);
      var axios = require("axios");
      var config = {
        method: "get",
        url: API_V2_URL + "/api/v2/userposts/getLocationStat",
        params: payload,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };

      axios(config)
        .then((res) => {
          // handle success
          commit("setLoadMapStat", false);
          console.log("datastat", res.data);
          commit("setLocationStat", res.data.result);
          
        })
        .catch((error) => {
          commit("setLoadMapStat", false);
          // state.loadMapPost=false
          alert("โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
          console.log(error);
        });
    },
    async apiMapStatic({ commit, dispatch, state }, payload) {
      commit("setLoadMapStatic", true);
      var axios = require("axios");
      var config = {
        method: "get",
        url: API_V2_URL  + "/api/v2/userposts/getLocationPost",
        params: payload,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };

      axios(config)
        .then((res) => {
          // handle success

          // var pair = { read: true };
          res.data.data.map((result) => {
            result.read = true;
          });

          var getDaysArray = function(s, e) {
            for (
              var a = [], d = new Date(s);
              d <= e;
              d.setDate(d.getDate() + 1)
            ) {
              a.push(new Date(d));
            }
            return a;
          };
          let Sdate = payload.start;
          let Edate = payload.end;
          var daylist = getDaysArray(new Date(Sdate), new Date(Edate));
          daylist
            .map((v) =>
              moment(v)
                .format()
                .slice(0, 10)
            )
            .join("");
          res.data.static.avgComment =
            res.data.static.comments_count / daylist.length;
          res.data.static.avgEngage =
            res.data.static.engagement / daylist.length;

          let sum =
            res.data.static.positiveSentiment +
            res.data.static.neutralSentiment +
            res.data.static.negativeSentiment;
          res.data.static.valpos =
            (res.data.static.positiveSentiment * 100) / sum;
          res.data.static.val = (res.data.static.neutralSentiment * 100) / sum;
          res.data.static.valnag =
            (res.data.static.negativeSentiment * 100) / sum;
          commit("setLoadMapStatic", false);
          commit("setMapStatic", res.data);
          // state.loadMapPost=false
        })
        .catch((error) => {
          commit("setLoadMapStatic", false);
          // state.loadMapPost=false
          alert("โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
          console.log(error);
        });
    },
    async apiLocationPost({ commit, dispatch, state }, payload) {
      //API_V2_URL
      commit("setLoadMapPost", true);
      var axios = require("axios");
      var config = {
        method: "get",
        url: API_V2_URL + "/api/v2/userposts/getLocationPost",
        params: payload,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };

      axios(config)
        .then((res) => {
          // handle success

          // var pair = { read: true };
          res.data.data.map((result) => {
            result.read = true;
          });

          var getDaysArray = function(s, e) {
            for (
              var a = [], d = new Date(s);
              d <= e;
              d.setDate(d.getDate() + 1)
            ) {
              a.push(new Date(d));
            }
            return a;
          };
          let Sdate = payload.start;
          let Edate = payload.end;
          var daylist = getDaysArray(new Date(Sdate), new Date(Edate));
          daylist
            .map((v) =>
              moment(v)
                .format()
                .slice(0, 10)
            )
            .join("");
          res.data.static.avgComment =
            res.data.static.comments_count / daylist.length;
          res.data.static.avgEngage =
            res.data.static.engagement / daylist.length;

          let sum =
            res.data.static.positiveSentiment +
            res.data.static.neutralSentiment +
            res.data.static.negativeSentiment;
          res.data.static.valpos =
            (res.data.static.positiveSentiment * 100) / sum;
          res.data.static.val = (res.data.static.neutralSentiment * 100) / sum;
          res.data.static.valnag =
            (res.data.static.negativeSentiment * 100) / sum;
          commit("setLoadMapPost", false);
          console.log("datapostr", res.data);
          commit("setLocationPost", res.data);
          // state.loadMapPost=false
        })
        .catch((error) => {
          commit("setLoadMapPost", false);
          // state.loadMapPost=false
          alert("โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
          console.log(error);
        });
    },
    async PostsKeyword({ commit, dispatch }, payload) {
      commit("setLoadKeyword", true);
      var axios = require("axios");
      var config = {
        method: "get",
        url: API_V2_URL + "/api/v2/keyword/getKeywordPosts",
        params: payload,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };

      axios(config)
        .then((res) => {
          commit("setLoadKeyword", false);
          // handle success
          commit("setKeywordPost", res.data);
        })
        .catch((error) => {
          commit("setLoadKeyword", false);
          alert("โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
          console.log(error);
        });
    },

    async CreateKeyword({ commit, dispatch }, payload) {
      console.log("resetDomainLastUpdate", payload);
      var axios = require("axios");

      var config = {
        method: "post",
        url: API_V2_URL + "/api/v2/keyword/createKeyword",
        data: payload,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      axios(config)
        .then(() => {
          // handle success
          dispatch("fetchKeyword");
        })
        .catch((error) => {
          if (
            error.response.data.error ==
            "Maximum number of posts reached for this project."
          ) {
            alert(
              "ไม่สามารถเพิ่มข้อมูลได้ จำกัดการเพิ่มข้อมูล 5 keywords ต่อ 1 บัญชีผู้ใช้งาน ! "
            );
          } else {
            alert("โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
          }
          console.log();
        });
    },
    async DeleteKeyword({ commit, dispatch }, payload) {
      console.log("resetDomainLastUpdate", payload);
      var axios = require("axios");
      var config = {
        method: "DELETE",
        url: API_V2_URL + "/api/v2/keyword/deleteKeyword?_id=" + payload._id,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      axios(config)
        .then((res) => {
          // handle success
          console.log("success", res);
          dispatch("fetchKeyword");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchKeyword({ commit }, payload) {
      //"http://139.59.103.67:3000/api/v2/keyword/getMonitorKeyword"
      var axios = require("axios");
      var config = {
        method: "get",
        url: API_V2_URL + "/api/v2/keyword/getMonitorKeyword",

        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      axios(config)
        .then((response) => {
          commit("setKeyword", response.data);
          // console.log("Toppp response.data", response.data[0].TopHashtags);
          console.log("response", response.data);
          // this.$store.commit("setLoadHashIssue", false);
        })
        .catch((error) => {
          console.log(error);
          // this.$store.commit("setLoadHashIssue", false);
        });
    },
    async EditStatusHashtag({ commit }, payload) {
      commit("setLoadStatus", true);
      try {
        const res = await MonitorService.EditStatusHashtag(payload);
        console.log(res);
        commit("setStatusHashtag", res.data);
        commit("setLoadStatus", false);
      } catch (error) {
        console.log(error.response);
      }
    },
    async EditDescription({ commit }, payload) {
      commit("setLoadStatus", true);
      try {
        const res = await MonitorService.EditDescription(payload);
        console.log(res);
        commit("setEditDescription", res.data);
        commit("setLoadStatus", false);
      } catch (error) {
        console.log(error.response);
      }
    },
    async fetchLocation({ commit }, payload) {
      commit("setLoadLocation", true);
      try {
        const res = await MonitorService.getLocation(payload);
        commit("setLocationCount", res.data.count);
        var post = res.data.results;
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
                // console.log("Object.keys", Object.keys(response.data).length);
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
        // console.log('postName',postName);
        // console.log('post',posts);
        // ---------------------------------------------------------------------------------------------------------
        if (payload.offset === 0) {
          commit("setPostLocation", posts);
        } else {
          commit("addPostLocation", posts);
        }

        commit("setLoadLocation", false);
        return res.data.results;
      } catch (error) {
        console.log(error.response);
      }
    },
    async fetchSearchMonitor({ commit }, payload) {
      commit("setLoadStatus", true);
      try {
        const res = await MonitorService.getSearchMonitor(payload);
        commit("setItemsProfile", res.data);
        commit("setLoadStatus", false);
      } catch (error) {
        console.log(error.response);
      }
    },
    async fetchProfileMonitor({ commit }, payload) {
      commit("setLoadStatus2", true);
      try {
        const res = await MonitorService.getProfile(payload);
        // console.log(res);
        const array = res.data;
        const key = "source";
        const arrayUniqueByKey = [
          ...new Map(array.profile.map((item) => [item[key], item])).values(),
        ];
        Object.assign(res.data, { profile: arrayUniqueByKey });
        // console.log(arrayUniqueByKey, { profile: arrayUniqueByKey }, res.data);
        // -------------------------------------------translateuid-----------------------------------------------------------

        res.data.profile.map((result) => {
          //  console.log('API',result);
          if (result.source == "facebook" || result.source == "youtube") {
            if (result.name) {
              return;
            } else {
              Object.assign(result, {
                name: result.uid,
              });
              var axios = require("axios");
              var config = {
                method: "get",
                url:
                  "https://api2.cognizata.com/api/v2/object/translateuid?uid=" +
                  result.uid,
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("token"),
                  "Content-Type": "application/json",
                },
              };
              axios(config)
                .then((response) => {
                  // console.log("Object.keys", Object.keys(response.data).length);
                  if (Object.keys(response.data).length) {
                    result.name = response.data.name;
                    // console.log('2',result);
                  } else {
                    return;
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          }

          return { result };
        });
        // console.log('postName',postName);

        // ---------------------------------------------------------------------------------------------------------
        commit("setProfileMonitor", res.data);
        // commit("setCountPost", res.data.posts);
        commit("setLoadStatus2", false);
      } catch (error) {
        console.log(error.response);
      }
    },
    async fetchProfileHash({ commit }, payload) {
      commit("setLoadStatus2", true);
      try {
        const res = await MonitorService.getProfile(payload);
        // console.log(res);
        const array = res.data;
        const key = "source";
        const arrayUniqueByKey = [
          ...new Map(array.profile.map((item) => [item[key], item])).values(),
        ];
        Object.assign(res.data, { profile: arrayUniqueByKey });
        // console.log(arrayUniqueByKey, { profile: arrayUniqueByKey }, res.data);
        commit("setProfileHash", res.data);
        commit("setCountPost", res.data.posts);
        commit("setLoadStatus2", false);
      } catch (error) {
        console.log(error.response);
      }
    },
    async fetchPostAll({ commit }, payload) {
      commit("setLoadPostTab", true);
      try {
        const res = await MonitorService.getPostAllMonitor(payload);
        // console.log(res.data);
        commit("setLoadPostTab", false);
        commit("setCnt", res.data.count);
        var posts = res.data.data;
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
                // console.log("Object.keys", Object.keys(response.data).length);
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
        // console.log('postName',postName);
        // console.log('post',posts);
        // ---------------------------------------------------------------------------------------------------------
        if (payload.offset === 0) {
          commit("setPostAllMonitor", posts);
        } else {
          commit("addPostAllMonitor", posts);
        }

        commit("setLoadPostTab", false);
        return posts;
      } catch (error) {
        console.log(error.response);
        alert("โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        commit("setLoadPostTab", false);
      }
    },
    async CreateMonitor({ commit }, payload) {
      // commit('setLoadStatus', true );
      try {
        const res = await MonitorService.CreateMonitor(payload);
        // commit('setCreateMonitor', res.data);
        commit("addAccount", res.data);
        //  commit('setLoadStatus', false );
      } catch (error) {
        console.log(error.response);
      }
    },
    async fatchListMonitor({ commit, state }, payload) {
      // console.log("state.listProfile", state.listProfile, state.updatetable);
      if (state.listProfile.targetlist.length) {
        return;
      } else {
        commit("setLoadStatus", true);
        try {
          const res = await MonitorService.getListMonitor(payload);
          var data = res.data[0];
          // -------------------------------------------translateuid-----------------------------------------------------------

          data.targetlist.map((result) => {
            // console.log('API',result);
            if (result.source == "facebook" || result.source == "youtube") {
              if (result.name) {
                return;
              } else {
                var axios = require("axios");
                var config = {
                  method: "get",
                  url:
                    "https://api2.cognizata.com/api/v2/object/translateuid?uid=" +
                    result.uid,
                  headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                  },
                };
                axios(config)
                  .then((response) => {
                    // console.log("Object.keys", Object.keys(response.data).length);
                    if (Object.keys(response.data).length) {
                      result["name"] = response.data.name;
                      // console.log('2',result);
                    } else {
                      return;
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            }

            return { result };
          });
          // console.log('postName',postName);

          // ---------------------------------------------------------------------------------------------------------
          commit("setListProfile", data);
          commit("setSumMonitor", res.data[0]);
          commit("setListMonitor", res.data[0]);
          // console.log(res.data[0]);
          //commit('setListHashtag', res.data[0].hashtaglist);

          commit("setLoadStatus", false);
        } catch (error) {
          console.log(error.response);
        }
      }
    },
    async fatchListMonitorUpdate({ commit, state }, payload) {
      console.log("state.listProfile", state.listProfile, state.updatetable);

      commit("setLoadStatus", true);
      try {
        const res = await MonitorService.getListMonitor(payload);

        commit("setSumMonitor", res.data[0]);
        // console.log(res.data[0]);
        //commit('setListHashtag', res.data[0].hashtaglist);

        commit("setLoadStatus", false);
      } catch (error) {
        console.log(error.response);
      }
    },
    async DeleteMonitor({ commit, state }, payload) {
      commit("setLoadStatus", true);
      try {
        const res = await MonitorService.delMonitor(payload);
        // console.log(res.data);
        if (payload.hashtag) {
          const index = state.listProfile.hashtaglist.findIndex(
            (hash) => hash.uid === "#" + payload.hashtag
          );
          state.listProfile.hashtaglist.splice(index, 1);
        } else {
          const index = state.listProfile.targetlist.findIndex(
            (acc) => acc.uid === payload.account
          );
          state.listProfile.targetlist.splice(index, 1);
        }
        commit("delMonitor", res.data);
        commit("setLoadStatus", false);
      } catch (error) {
        console.log(error.response);
      }
    },
    async fetchAllPostDomain({ commit }, payload) {
      commit("setLoadPostTab", true);
      try {
        const res = await DomainService.getPostDomain(payload);
        // console.log('payload',payload);
        commit("setLoadPostTab", false);
        var post = res.data.data;
        var pair = { read: true };
        var posts = post.map((result) => {
          return { ...result, ...pair };
        });
        // -------------------------------------------translateuid-----------------------------------------------------------
        posts.map((result) => {
          // console.log('API',result);
          if (result.source == "youtube") {
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
                // console.log("Object.keys", Object.keys(response.data).length);
                if (Object.keys(response.data).length) {
                  result.account_name = response.data.name;
                  // console.log('2',result);
                } else {
                  return;
                }
              })
              .catch((error) => {
                console.log(error);
                return result;
              });
          } else {
            return result;
          }

          return { result };
        });

        // console.log('post',posts);
        // ---------------------------------------------------------------------------------------------------------
        if (payload.offset === 0) {
          commit("setAllPostDomain", posts);
        } else {
          commit("addAllPost", posts);
        }
        commit("setCountAllPost", res.data.count);
        commit("setLoadPostTab", false);
        return res.data.data;
      } catch (error) {
        alert("โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        commit("setLoadPostTab", false);
        console.log(error.response);
      }
    },
  },
};
