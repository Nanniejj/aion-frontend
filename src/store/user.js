import { API_V2_URL } from "@/common/config";
const axios = require("axios");
export default {
  state: {
    //variable
    userList: {},
    projectList: {},
    projectOneDomainName: {},
    projectOneHashtag: {},
    addUserStatus: "",
    userLoginList: [],
  },
  mutations: {
    //setter
    setUserLoginList(state, payload) {
      state.userLoginList = payload;
    },
    setUserList(state, userList) {
      if (userList !== "") state.userList = userList;
    },
    setProjectList(state, projectList) {
      if (projectList !== "") state.projectList = projectList;
    },
    setProjectOneDomainName(state, projectOneDomainName) {
      state.projectOneDomainName = projectOneDomainName;
    },
    setProjectOneHashtag(state, projectOneHashtag) {
      state.projectOneHashtag = projectOneHashtag;
    },
    setAddUserStatus(state, addUserStatus) {
      state.addUserStatus = addUserStatus;
    },
  },
  getters: {
    getUserLoginList: (state) => {
      return state.userLoginList;
    },

    getUserList: (state) => {
      return state.userList;
    },
    getProjectList: (state) => {
      return state.projectList;
    },
    getProjectOneDomainName: (state) => {
      return state.projectOneDomainName;
    },
    getProjectOneHashtag: (state) => {
      return state.projectOneHashtag;
    },
    getAddUserStatus: (state) => {
      return state.addUserStatus;
    },
  },
  actions: {
    async fetchLoggedDevice({ commit }) {
        var config = {
            method: "get",
            url: "https://api2.cognizata.com/api/v2/user/getLoggedDevice",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          };
          axios(config)
            .then((response) => {
                commit("setUserLoginList", response.data);
            //     state.userLoginList =response.data
            // console.log('response',response.data);
            })
            .catch(function(error) {
            //   this.$fire({
            //     title: "กรุณาลองอีกครั้ง",
            //     type: "error",
            //     showConfirmButton: false,
            //     timer: 1000,
            //   });
              console.log(error);
            });
      },
    async deleteUser({ commit ,dispatch}, payload) {
      axios
        .post(API_V2_URL + "/api/user/del", payload)
        .then(function(res) {
          // handle success
          //console.log(JSON.stringify(res));
          // state.userList = res
          dispatch('fetchLoggedDevice')
          commit("setUserList", res.data.results);
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        });
      console.log(payload);
      commit("setUserList", "");
    },
    async statusUser({ commit }, valuex) {
      console.log("statusUser");
      commit("setAddUserStatus", valuex);
    },
    async updateUser({ commit }, payload) {
      axios
        .post(API_V2_URL + "/api/user/update", payload)
        .then(function(res) {
          // handle success
          //console.log(JSON.stringify(res));
          // state.userList = res
          if (res.data.results == "error") {
            console.log("Error");
            commit("setAddUserStatus", "ERROR");
          } else {
            commit("setAddUserStatus", "Save Completed");
            commit("setUserList", res.data.results);
          }
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        });
      console.log(payload);
      commit("setUserList", "");
    },
    async addUser({ commit,dispatch }, payload) {
      axios
        .post(API_V2_URL + "/api/user/add", payload.data)
        .then(function(res) {
          if (res.data.results == "error") {
            console.log("Error");
            alert("ไม่สามารถเพิ่มบัญชีผู้ใช้งานได้ กรุณาลองอีกครั้ง");
            commit("setAddUserStatus", "ERROR");
          } else {
            commit("setAddUserStatus", "Save Completed");
            commit("setUserList", res.data.results);
            console.log('payload.project',payload,payload.project);
            if(payload.project&&payload.project.projectname){
            payload.project.userid= res.data.results[res.data.results.length-1]._id
            dispatch("addNameToProject",payload.project)
          }else{
             dispatch('fetchLoggedDevice')
          }
          }
        })
        .catch(function(error) {
          console.log("Error handler", error);
        });
      console.log(payload);
    },
    async addUserAdmin({ commit,dispatch }, payload) {
        axios
          .post(API_V2_URL + "/api/user/add", payload)
          .then(function(res) {
            if (res.data.results == "error") {
              console.log("Error");
              alert("ไม่สามารถเพิ่มบัญชีผู้ใช้งานได้ กรุณาลองอีกครั้ง");
              commit("setAddUserStatus", "ERROR");
            } else {
              commit("setAddUserStatus", "Save Completed");
              commit("setUserList", res.data.results);
            }
          })
          .catch(function(error) {
            console.log("Error handler", error);
          });
        console.log(payload);
      },
    async addNameToProject({ commit ,dispatch}, payload) {
      axios
        .post(API_V2_URL + "/api/user/addProject", payload)
        .then(function(res) {
          // handle success
          commit("setUserList", res.data.results);
          dispatch('fetchLoggedDevice')
          // state.userList = res
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        });
      console.log(payload);
      //    commit('setUserList', '')
    },
    async addNameToProjectAdmin({ commit }, payload) {
        axios
          .post(API_V2_URL + "/api/user/addProject", payload)
          .then(function(res) {
            // handle success
            console.log(JSON.stringify(res));
            commit("setUserList", res.data.results);
            // state.userList = res
          })
          .catch(function(error) {
            // handle error
            console.log(error);
          });
        console.log(payload);
        //    commit('setUserList', '')
      },
    async fetchTemplateUser({ commit }) {
      axios
        .post(API_V2_URL + "/api/user/list")
        .then(function(res) {
          // handle success
          commit("setUserList", res.data.results);
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        });
    },
    async fetchTemplateProject({ commit }) {
      axios
        .post(API_V2_URL + "/api/project/list")
        .then(function(res) {
          // handle success
          commit("setProjectList", res.data.results);
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        });
    },
    async fetchTemplateProjectOne({ commit }, payload) {
      // console.log(JSON.stringify(payload));
      axios
        .post(API_V2_URL + "/api/projectOne/list", payload)
        .then(function(res) {
          // handle success
          var pop = res.data.results;
          var tmp = pop[0].domainName;
          var packtmp = "";
          for (var i = 0; i < tmp.length; i++) {
            packtmp += tmp[i].name;
            if (i != tmp.length - 1) {
              packtmp += " ,";
            }
          }
          // console.log("packtmp="+packtmp)
          commit("setProjectOneDomainName", packtmp);

          tmp = pop[0].hashtagName;
          packtmp = "";
          // console.log(tmp.length)
          for (i = 0; i < tmp.length; i++) {
            packtmp += tmp[i].uid;
            if (i != tmp.length - 1) {
              packtmp += " ,";
            }
          }
          commit("setProjectOneHashtag", packtmp);
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        });
    },
  },
};
