import { AvatarService } from '@/common/api.services';
import { MonitorService } from '@/common/api.services';
export default {
    state: {
      createAvatar:[],
      delAvatar:[],
      avatarTeam:[],
      avatarUser:[],
      showUser:false,
      showManage:false,
      csvFile:[],
      today:"",
        summary:{
            twitter:{
                top5_hashtag:{
                    name:[]
                }
            }
        } ,
    data_avatar : [// {name: "Team A1",
      //                   twitter:{
      //                     account_retweet: [
      //                       {account_name: "supaarchar",
      //                     count: 55,
      //                     uid: "1351532231236325377"}],
                          
      //                     account_tweet: [{account_name: "SamritChat",
      //                                             count: 5,
      //                                             uid: "1351804533538623489"}],
      //                     export_data: [],
      //                     favourites: 10,
      //                     reply: 100,
      //                     retweet: 55,
      //                     top3_hashtag: {name:["#หยุดยาเสพติดไว้ที่ชายแดน", "#กองทัพบก", "#พี่แนะนำน้องสู่เส้นทางนายสิบทหารบก"], count: []},
      //                     count: [],
      //                     name: [],
      //                     total_account: 10,
      //                     total_account_active: 10,
      //                     tweet: 5,
      //                   },
      //                   facebook: {
      //                       account_comment: [],
      //                       account_post: [],
      //                       account_share: [],
      //                       comment: 0,
      //                       post: 0,
      //                       share: 0,
      //                       total_account: 0,
      //                     }
      //               }
      //               
      ]
      
    },
    getters: {
      getAddAvatar:(state) =>{
        return state.avatarTeam;
      },
      getAvatarTeam:(state) =>{
        return state.avatarTeam;
      },
      getAvatarUser:(state) =>{
        return state.avatarUser;
      },
      getShowUser: (state) =>{
        return state.showUser;
      },
      getShowManage: (state) =>{
        return state.showManage;
      },
      getToday: (state) =>{
        return state.today;
      },
      getSummaryAvatar: (state) => {
        return state.data_avatar.summary;
      },
      getAvatar: (state) => {
        return state.data_avatar.department;
      },
      getCsvAvatar: (state) => {
        return state.csvFile;
      },
      getW: (state) => {
        return state.dataw;
      },
 
    },
    mutations: {
      delAvatar: (state, payload) => {
        state.delAvatar = payload;
      },
      setAvatarUser: (state, payload) => {
        state.avatarUser = payload;
      },
      setAvatarTeam: (state, payload) => {
        state.avatarTeam = payload;
      },
      setShowUser: (state, payload) => {
        state.showUser = payload;
      },
      setShowManage: (state, payload) => {
        state.showManage = payload;
      },
      changeDataChoice: (state, payload) => {
        state.dateChoice = payload.choice;
      },
      setAvatar(state, payload){
        state.data_avatar =payload;
      }
      ,
      setToday(state, payload){
        state.today =payload;
      },
      setCsvAvatar(state, payload){
        state.csvFile =payload;
      },
      addAvatar(state, payload){
        console.log('state',state.avatarUser);
        console.log('payload',...payload.avatarlist);
        state.avatarUser = [...state.avatarUser,...payload.avatarlist];
      },
    },
    actions: {
      async CreateAvatar({ commit },payload) {
        // commit('setLoadStatus', true );
         try {
           const res = await MonitorService.CreateMonitor(payload);
           // commit('setCreateMonitor', res.data);
           commit('addAvatar', res.data)
         //  commit('setLoadStatus', false );
         } catch (error) {
           console.log(error.response);
         }
       },
     
      async fetchAvatarTeam({ commit},payload) {
        commit('setLoadStatus', true );
        try {
          const res = await AvatarService.getAvatarTeam(payload);
          let user = res.data.results;   
          let users = user.map(itema => { itema
            //console.log({...itema});
             return itema
           })
          console.log(users);
 
          let name = res.data.results
          name = name.map(item => {
            return item.team
          })
           var duplicates =name; 
           var unique = duplicates.filter(function(elem, pos) {
               return duplicates.indexOf(elem) == pos;
             }); 
          
          commit('setAvatarTeam',[...unique]);
          commit('setAvatarUser',users);
          commit('setLoadStatus', false );
          console.log(res.data);
        } catch (error) {
          // alert('กรุณาเลือกวันที่')
          console.log(error.response);
        }
      },
      async fetchAvatar({ commit},payload) {
        commit('setLoadStatus', true );
        try {
          const res = await AvatarService.getAvatars(payload);
          commit('setAvatar', res.data);
          commit('setLoadStatus', false );
          console.log(res.data);
        } catch (error) {
          console.log('avatarerr',error);
          alert('ยังไม่สามารถใช้ระบบได้ตอนนี้ อภัยในความไม่สะดวก')
          commit('setLoadStatus', false );
        }
      },
      async DelAvatar({ commit,state},payload) {
        try {
          const res = await AvatarService.DeleteAvatar(payload);
          console.log(payload,payload.avatar);
          let arr=payload.avatar.split(",")
          console.log(arr);
          if ( arr.length>1) {
            //console.log('ele>1');
            for (var i = 0; i <arr.length; i++) {
              console.log('payload.avatar',arr[i]);
              const index =  state.avatarUser.findIndex(sd => sd.id===arr[i]);
              state.avatarUser.splice(index, 1);
              console.log(index);
            }
          }else{
           // console.log('ele=1');
          const index =  state.avatarUser.findIndex(sd => sd.id===payload.avatar);
          //console.log('sd.uid',state.avatarUser[index].id);
          console.log('index',index);
          state.avatarUser.splice(index, 1);
        }
          commit('delAvatar', res.data);
          console.log(res.data);
        } catch (error) {
          console.log(error.response);
        }
      },
  
    },
  };
  