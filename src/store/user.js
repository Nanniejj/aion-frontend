import { API_V2_URL } from '@/common/config';
const axios = require('axios');
export default {
    state: { //variable
        userList:{},
        projectList:{},
        projectOneDomainName:{},
        projectOneHashtag:{},
        addUserStatus:"",

    },
    mutations: { //setter
        setUserList(state,userList){
            
            if(userList!=='')
                state.userList = userList
        },
        setProjectList(state,projectList){

            if(projectList!=='')
                state.projectList = projectList
        },
        setProjectOneDomainName(state,projectOneDomainName){

                state.projectOneDomainName = projectOneDomainName
        },
        setProjectOneHashtag(state,projectOneHashtag){

                state.projectOneHashtag = projectOneHashtag
        },
        setAddUserStatus(state,addUserStatus){

                state.addUserStatus = addUserStatus
        },
    },
    getters: {
        
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
        async deleteUser({ commit },payload) {
            axios.post(API_V2_URL+'/api/user/del',payload)
            .then(function (res) {
                // handle success
                //console.log(JSON.stringify(res));
                // state.userList = res
                commit('setUserList', res.data.results);
                
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
           console.log(payload);
           commit('setUserList', '')
          },
        async statusUser({ commit },valuex) {
            console.log("statusUser");  
            commit('setAddUserStatus', valuex);
          },
        async updateUser({ commit },payload) {
            axios.post(API_V2_URL+'/api/user/update',payload)
            .then(function (res) {
                // handle success
                //console.log(JSON.stringify(res));
                // state.userList = res
                if(res.data.results=="error"){
                    console.log("Error")
                    commit('setAddUserStatus', "ERROR");
                }
                else{
                    commit('setAddUserStatus', "Save Completed");
                    commit('setUserList', res.data.results);
                }
                
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
           console.log(payload);
           commit('setUserList', '')
          },
        async addUser({ commit },payload) {
            axios.post(API_V2_URL+'/api/user/add',payload)
            .then(function (res) {
                // handle success
                if(res.data.results=="error"){
                    console.log("Error")
                    alert('ไม่สามารถเพิ่มบัญชีผู้ใช้งานได้ กรุณาลองอีกครั้ง')
                    commit('setAddUserStatus', "ERROR");
                }
                else{
                    commit('setAddUserStatus', "Save Completed");
                    commit('setUserList', res.data.results);
                }
                
            })
            .catch(function (error) {
                // handle error
                console.log("Error handler",error);
            });
           console.log(payload);
        //    commit('setUserList', '')
          },
          async addNameToProject({ commit },payload) {
            axios.post(API_V2_URL+'/api/user/addProject',payload)
            .then(function (res) {
                // handle success
                console.log(JSON.stringify(res));
                commit('setUserList', res.data.results);
                // state.userList = res
                
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
           console.log(payload);
        //    commit('setUserList', '')
           
          },
        async fetchTemplateUser({ commit }) {

                axios.post(API_V2_URL+'/api/user/list')
                .then(function (res) {
                    // handle success
                    commit('setUserList', res.data.results);
                    
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
              


          },
          async fetchTemplateProject({ commit }) {

            axios.post(API_V2_URL+'/api/project/list')
            .then(function (res) {
                // handle success
                commit('setProjectList',res.data.results);
                
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
        },
        async fetchTemplateProjectOne({ commit },payload) {
            // console.log(JSON.stringify(payload));
            axios.post(API_V2_URL+'/api/projectOne/list',payload)
            .then(function (res) {
                // handle success
                var pop = res.data.results
                var tmp = pop[0].domainName
                var packtmp=""
                for(var i = 0 ; i < tmp.length ; i++){
                    packtmp += tmp[i].name
                    if( i != (tmp.length -1) ){
                        packtmp += " ,"
                    }
                }
                // console.log("packtmp="+packtmp)
                commit('setProjectOneDomainName',packtmp);

                tmp = pop[0].hashtagName
                packtmp=""
                // console.log(tmp.length)
                for(i = 0 ; i < tmp.length ; i++){
                    packtmp += tmp[i].uid
                    if( i != (tmp.length -1) ){
                        packtmp += " ,"
                    }
                }
                commit('setProjectOneHashtag',packtmp);
                
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
        },
    },
}