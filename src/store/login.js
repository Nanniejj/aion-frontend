
// export default {
//     state: {
//        loginData:[],
//        form:[]
//     },
//     getters: {
//     getLogin: (state) => {
//         return state.loginData;
//       },
//      getFormLogin:(state) => {
//         return state.form;
//       },
//     mutations: {
//       setLogin(state, payload){
//         state.loginData=payload;
//       },
//       setFormLogin(state, payload){
//         state.form=payload;
//       },
//     },
//     actions: {
//         async fetchLogin({commit}) {
//             var axios = require('axios');
//             var data = JSON.stringify({"username":"test1","password":"test1234"});
            
//             var config = {
//               method: 'post',
//               url: this.$hostname +'/auth/signin/',
//               headers: { 
//                 'Content-Type': 'application/json'
//               },
//               data : data
//             }; 
//             axios(config)
//             .then(function (response) {
//               commit('setLogin', response.data);
//               console.log(JSON.stringify(response.data));
//             })
//             .catch(function (error) {
//               console.log(error);
//             });
//           },
         
//     }
// } 
//   };
  