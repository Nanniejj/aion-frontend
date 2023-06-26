import Vue from 'vue';
import VueAxios from 'vue-axios';
import axios from 'axios';
import { API_URL } from '@/common/config';

//var token='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjE5NzU3ODkxLCJqdGkiOiIyNWZkZTQzMjdkMzY0MDZjYTVkNDVhOTEzM2FhZmYxMCIsInVzZXJfaWQiOjF9.YNM9ByihWJ4wnInbRz7T2kP0z0yvzVexfsFsmtGKvTY';
// var token;
// if (localStorage.getItem("token")) {
//   token = localStorage.getItem("token");
// } else {
//   token = sessionStorage.getItem("token");
// }

Vue.use(VueAxios, axios);
Vue.axios.defaults.baseURL = API_URL;
Vue.axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
Vue.axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH';
Vue.axios.defaults.headers.common['Access-Control-Allow-Headers'] = '*';

const ApiService = {  
  //set in store auth
  setHeader() {
    //Vue.axios.defaults.headers.common['Allow'] = '*';
    Vue.axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
  },
  get(path, params) {
    return Vue.axios.get(`${path}`, params);
  },
  post(path, params) {
    return Vue.axios.post(`${path}`, params);
  },
  put(path, params) {
    return Vue.axios.put(`${path}`, params);
  },
  del(path, params) {
    return Vue.axios.delete(`${path}`, params);
  },
};
export default ApiService;
export const WordcloudService = {
  // EditSentiment(payload) {
  //   return ApiService.put(`v1/EditSentiment/`,{'sentiment':payload.sentiment,'uid':payload.uid});
  // },
  getDomain(payload) {
    ApiService.setHeader()
    return ApiService.get(`/v1/domain/?limit=${payload.limit}`);
  },
  getWordCloud(payload) {
    // console.log(payload.domain.length);
    ApiService.setHeader()
    var dom = "",
      key = "",
      mo = "",
      src="",
      dash="";
      if (payload.dashboard) {
        dash = `&dashboard=${payload.dashboard}`;
      } else {
        dash = "";
      }
    if (payload.monitor) {
      mo = `&monitor=${payload.monitor}`;
    } else {
      mo ="";
    }
    if (payload.source) {
      src = `&source=${payload.source}`;
    } else {
      src ="";
    }
    if (payload.domain) {
      dom = `&domain=${payload.domain}`;
    } else {
      dom = "";
    }

    if (payload.keywords) {
      key = `&keywords=${payload.keywords}`;
    } else {
      key = "";
    }

    return ApiService.get(`/v1/getwordcloud/?start_date=${payload.start_date}&end_date=${payload.end_date}` + key + dom + mo+src+dash);
  },
  // getWordCloudSentiment(payload) {
  //   return ApiService.get(`/v1/getwordcloud/?type=${payload.type}&keyword=${payload.keyword}&domain=${payload.domain}`);
  // },
  getSentiment(payload) {
    // console.log(payload);
    ApiService.setHeader()
    var dom = "",
      key = "",
      search = "",
      mo = "";
    if (payload.monitor) {
      mo = `&monitor=${payload.monitor}`;
    } else {
      mo ="";
    }
    if (payload.domain.length > 0 && payload.keywords != "") {
      dom = `&domain=${payload.domain}`;
      key = `&keywords=${payload.keywords}`;
      search = `&querySearch=${payload.querySearch}`;
    } else if (payload.domain.length > 0) {
      dom = `&domain=${payload.domain}`;
      key = "";
      search = `&querySearch=${payload.querySearch}`; 
    } else if (payload.keywords != "") {
      dom = "";
      key = `&keywords=${payload.keywords}`;
      search = `&querySearch=${payload.querySearch}`;
    } else {
      dom = "";
      key = "";
      search = `&querySearch=${payload.querySearch}`;
    }
    return ApiService.get(
      `/v1/getsentimentstat/?start_date=${payload.start_date}&end_date=${payload.end_date}` + dom + key + search + mo
    );
  },
  getSentimentHashtag(payload) {
    ApiService.setHeader()
    var dom = "",
      key = "",
      hash = "",
      mo = "";
    if (payload.monitor) {
      mo = `&monitor=${payload.monitor}`;
    } else {
      mo ="";
    }
    if (payload.domain.length > 0 && payload.keywords != "") {
      dom = `&domain=${payload.domain}`;
      key = `&keywords=${payload.keywords}`;
      hash = `&hashtag=${payload.hashtag}`;
    } else if (payload.domain.length > 0) {
      dom = `&domain=${payload.domain}`;
      key = "";
      hash = `&hashtag=${payload.hashtag}`; 
    } else if (payload.keywords != "") {
      dom = "";
      key = `&keywords=${payload.keywords}`;
      hash = `&hashtag=${payload.hashtag}`;
    } else {
      dom = "";
      key = "";
      hash = `&hashtag=${payload.hashtag}`;
    }
    return ApiService.get(
      `/v1/getsentimentstat/?start_date=${payload.start_date}&end_date=${payload.end_date}` + dom + key + hash + mo
    );
  },
  getSentimentDetail(payload){
    ApiService.setHeader()
    var dom = "",
      key = "",
      search = "",
      stm="",
      mo = "",
      hash="",src;
      if(payload.source){
        src =`&source=${payload.source}`;
      }else{
        src = ""
      }
      if(payload.hashtag){
        hash =`&hashtag=${payload.hashtag}`;
      }else{
        hash = ""
      }
      if(payload.sentiment){
        stm =`&sentiment=${payload.sentiment}`;
      }else{
        stm = ""
      }
    if (payload.monitor) {
      mo = `&monitor=${payload.monitor}`;
    } else {
      mo ="";
    }
    if (payload.domain.length > 0 && payload.keywords != "") {
      dom = `&domain=${payload.domain}`;
      key = `&keywords=${payload.keywords}`;
      search = `&querySearch=${payload.querySearch}`;
    } else if (payload.domain.length > 0) {
      dom = `&domain=${payload.domain}`;
      key = "";
      search = `&querySearch=${payload.querySearch}`; 
    } else if (payload.keywords != "") {
      dom = "";
      key = `&keywords=${payload.keywords}`;
      search = `&querySearch=${payload.querySearch}`;
    } else {
      dom = "";
      key = "";
      search = `&querySearch=${payload.querySearch}`;
    }
    return ApiService.get(
      `/v1/getsentimentdetail/?start_date=${payload.start_date}&end_date=${payload.end_date}&offset=${payload.offset}&sort_by=${payload.sort_by}` + dom + key + search + mo+stm+hash+src
    );
  },
  getSentimentHashtagDetail(payload){
    ApiService.setHeader()
    var dom = "",
      key = "",
      hash = "",
      mo = "",
      src="",
      stm="";
      if(payload.sentiment){
        stm =`&sentiment=${payload.sentiment}`;
      }else{
        stm = ""
      }
      if(payload.source){
        src =`&source=${payload.source}`;
      }else{
        src = ""
      }
    if (payload.monitor) {
      mo = `&monitor=${payload.monitor}`;
    } else {
      mo ="";
    }
    if (payload.domain.length > 0 && payload.keywords != "") {
      dom = `&domain=${payload.domain}`;
      key = `&keywords=${payload.keywords}`;
      hash = `&hashtag=${payload.hashtag}`;
    } else if (payload.domain.length > 0) {
      dom = `&domain=${payload.domain}`;
      key = "";
      hash = `&hashtag=${payload.hashtag}`; 
    } else if (payload.keywords != "") {
      dom = "";
      key = `&keywords=${payload.keywords}`;
      hash = `&hashtag=${payload.hashtag}`;
    } else {
      dom = "";
      key = "";
      hash = `&hashtag=${payload.hashtag}`;
    }
    return ApiService.get(
      `/v1/getsentimentdetail/?start_date=${payload.start_date}&end_date=${payload.end_date}&offset=${payload.offset}&sort_by=${payload.sort_by}` + dom + key + hash + mo+src+stm
    );
  }
};
export const RankingService = {
  getDomainRanking(payload) {
    ApiService.setHeader()
    return ApiService.get(`/v1/domain/?limit=${payload.limit}`);
  },
  getSubDomainRanking(payload) {
    ApiService.setHeader()
    return ApiService.get(`/v1/subdomain-list/${payload.domain}/`);
  },
  getRanking(payload) {
    ApiService.setHeader()
    var subdom ;
    if (payload.subdomain){
      subdom = `&subdomain=${payload.subdomain}`
    } else {
      subdom ="";
    }
    return ApiService.get(
      `/v1/getranking/?start_date=${payload.start_date}&end_date=${payload.end_date}&domain=${payload.domain}&source=${payload.source}&rankingtype=${payload.rankingtype}` + subdom
    );
  },
  getSentimentStat(payload) {
    ApiService.setHeader()
    var subdom;
    if (payload.subdomain){
      subdom = `&subdomain=${payload.subdomain}`
    } else {
      subdom ="";
    }
    return ApiService.get(
      `/v1/getsentimentstat/?start_date=${payload.start_date}&end_date=${payload.end_date}&domain=${payload.domain}&source=${payload.source}&objects=${payload.objects}` + subdom
    );
  },
  getSentimentDetailRanking(payload){
    ApiService.setHeader()
    var subdom,stm,dm,obj;
    if (payload.subdomain){
      subdom = `&subdomain=${payload.subdomain}`
    } else {
      subdom ="";
    }
    if (payload.domain) {
      dm = `&domain=${payload.domain}`;
     } else {
       dm ="";
     }
     if(payload.sentiment){
       stm =`&sentiment=${payload.sentiment}`;
     }else{
       stm = ""
     }
     if(payload.objects){
      obj =`&objects=${payload.objects}`;
    }else{
      obj = ""
    }
    return ApiService.get(
      `/v1/getsentimentdetail/?start_date=${payload.start_date}&end_date=${payload.end_date}&offset=${payload.offset}&sort_by=${payload.sort_by}&source=${payload.source}`+stm+dm+obj+subdom
    );
  }
};
export const TopInfluencerService = {
  getTopInfluencer(payload) {
    ApiService.setHeader()
    return ApiService.get(
      `/v1/gettopinfluencer/?start_date=${payload.start_date}&end_date=${payload.end_date}&source=${payload.source}&domain=${payload.domain}`
    );
  },
  getLinksTopInfluencer(payload) {
    ApiService.setHeader()
    return ApiService.post(`/v1/getinfluencerlink/`, {
      influencer: payload.influencer,
      source: payload.source,
      type: payload.type,
    });
  },
};
export const InfluencerLinkService = {
  getInfluencerLink(payload) {
    ApiService.setHeader()
    return ApiService.post(`/v1/getinfluencerlink/`, {
      influencer: payload.influencer,
      source: payload.source,
    });
  },
};
export const DashboardService = {
  getAllstats(payload) {
    ApiService.setHeader()
    return ApiService.get(`/v1/getAllstats/?start_date=${payload.start_date}&end_date=${payload.end_date}`);
   
  },
  getSentimentStatDashboard(payload) {
    ApiService.setHeader()
   // return ApiService.get(`/v1/getsentimentstat/?type=${payload.type}`);
    return ApiService.get(`/v1/getsentimentstat/?start_date=${payload.start_date}&end_date=${payload.end_date}&domain=${payload.domain}&dashboard=true`);
  },
   getSentimentPost(payload) {
    ApiService.setHeader()
     return ApiService.get(`/v1/getsentimentdetail/?start_date=${payload.start_date}&end_date=${payload.end_date}&source=${payload.source}&sentiment=${payload.sentiment}&sort_by=${payload.sort_by}&offset=${payload.offset}&domain=${payload.domain}&dashboard=true`);
  //  return ApiService.get(`/v1/getsentimentdetail/?type=${payload.type}&source=${payload.source}&sentiment=${payload.sentiment}
  //                                    &sort_by=${payload.sort_by}&offset=${payload.offset}`);
                                  
  },
  EditSentiment(payload) {
    ApiService.setHeader()
    return ApiService.put(`v1/EditSentiment/`,{'sentiment':payload.sentiment,'uid':payload.uid});
  },
  getBacklogs(payload){
    ApiService.setHeader()
    // return ApiService.get(`/v1/getsentimentstat/?type=${payload.type}`);
     return ApiService.get(`/v1/backlogs/?limit=${payload.limit}&offset=${payload.offset}`);
  },
};
export const GsearchService = {
    getGsearch(payload) {
      ApiService.setHeader()
      return ApiService.post(`/v1/googlesearch/?`,{'date':payload.date,'keyword':payload.keyword});
    }
};
export const RelationPostService = {
   getRelationPost() {
    ApiService.setHeader()
   return ApiService.get(`/v1/getPostRelation/`);
   },
   getRelationPostLink() {
    ApiService.setHeader()
    return ApiService.get(`/v1/getPostRelation/?trigger=true`);
    }
  };

  export const AvatarService = {
    DeleteAvatar(payload){
      ApiService.setHeader()
      return ApiService.post(`v1/avatar-delete/`,{"avatar":payload.avatar});
    } ,
    getAvatarTeam(){
      ApiService.setHeader()
      return ApiService.get(`v1/avatardept/`,);
    } ,
    getAvatars(payload) {
      ApiService.setHeader()
    return ApiService.get(`/v1/getavatar/?start_date=${payload.start_date}&end_date=${payload.end_date}`,);
    },
    getCsvAvatar(payload) {
      ApiService.setHeader()
      return ApiService.post(`/v1/download/avatar/csv/`,{'date':payload.date,'data_json':payload.data_json});
    }
   };
   export const TemplateService = {
     
    getListSubDomain(payload) {
      ApiService.setHeader()
    return ApiService.get(`/v1/subdomain-list/${payload}/?limit=100000`,);
    },
    DeleteDomain(payload) {
      ApiService.setHeader()
      return ApiService.post(`v1/delete-domain/`,{'domain':payload.domain});
    },
    AddDomain(payload) {
      ApiService.setHeader()
      return ApiService.post(`/v1/domain/`,{'name':payload.name,'display':payload.display});
      },
    EditDomain(payload) {
      ApiService.setHeader()
      return ApiService.put(`/v1/domain/${payload.id}/`,{'name':payload.name,'id':payload.id,'display':payload.display});
      },
    EditSubDomain(payload) {
      ApiService.setHeader()
      return ApiService.put(`/v1/subdomain/${payload.id}/`,{'name':payload.name,'domain':payload.domain});
      },
    AddSubDomain(payload) {
      ApiService.setHeader()
        return ApiService.post(`/v1/subdomain-create/`,{'name':payload.name ,'domain':payload.domain , 'display':payload.display});
    },
    getListWord(payload) {
      ApiService.setHeader()
      return ApiService.get(`/v1/object-list/?domain=${payload.domain}&subdomain=${payload.subdomain}&limit=100000`);
    },
    AddWord(payload){
      ApiService.setHeader()
      return ApiService.post(`/v1/object-create/`,{'name':payload.name ,'domain':payload.domain , 'display':payload.display,'subdomain':payload.subdomain,
                                                    'keywords':payload.keywords,'and_keywords':payload.and_keywords,'not_keywords':payload.not_keywords});
    },
    EditWord(payload) {
      ApiService.setHeader()
      return ApiService.put(`/v1/object/${payload.id}/`,{'name':payload.name ,'domain':payload.domain , 'display':payload.display,'subdomain':payload.subdomain,
                                                        'keywords':payload.keywords,'id':payload.id,'and_keywords':payload.and_keywords,'not_keywords':payload.not_keywords});
      },
    DeleteSubdomain(payload){
      ApiService.setHeader()
      return ApiService.del(`/v1/subdomain/${payload.id}/`,{'id':payload.id});
    },
    DeleteWord(payload){
      ApiService.setHeader()
      return ApiService.del(`/v1/object/${payload.id}/`,{'id':payload.id});
    }
   
   };
   export const MonitorService = {
    EditStatusHashtag(payload){
      ApiService.setHeader()
      return ApiService.post(`v1/edit-hashtag/`,{'hashtag':payload.hashtag,'source':payload.source,'status':payload.status});
     },
     EditDescription(payload){
      ApiService.setHeader()
      return ApiService.put(`v1/Target/`,{'uid':payload.uid,'source':payload.source,'target':payload.target,'email':payload.email,'telno':payload.telno});
     },
    getLocation(payload){
      let query,account,sentiment;
      if (payload.query) {
        query = `&query=${payload.query}`;
       } else {
        query ="";
       }
       if (payload.account) {
        account = `&account=${payload.account}`;
       } else {
        account ="";
       }
       if (payload.sentiment) {
        sentiment = `&sentiment=${payload.sentiment}`;
       } else {
        sentiment ="";
       }
      ApiService.setHeader()
      return ApiService.get(`v1/searchLocation/?sort_by=${payload.sort_by}&offset=${payload.offset}`+query+account+sentiment);
    },
    delMonitor(payload){
      ApiService.setHeader()
      console.log('payload',payload);
      return ApiService.post(`/v1/delete-monitor/`,{'source':payload.source,'account':payload.account,'hashtag':payload.hashtag});
    },
    getListMonitor(payload) {
      var source = "";
      if (payload.source){
        source = `?source=${payload.source}`
      }
      ApiService.setHeader()
    return ApiService.get(`/v1/getMonitorlist/` + source);
    },
    CreateMonitor(payload) {
      ApiService.setHeader()
    return ApiService.post(`/v1/create-monitor/`,{'source':payload.source ,'account':payload.account,'hashtag':payload.hashtag,
                                                  'team':payload.team,'avatar':payload.avatar});
    },
    getSearchMonitor(payload) {
      ApiService.setHeader()
    return ApiService.get(`/v1/searchMonitor/?query=${payload.query}&search_type=${payload.search_type}`);
    },
    getProfile(payload) {
      ApiService.setHeader()
      return ApiService.get(`v1/getMonitor/?query=${payload.query}&api_type=${payload.api_type}&top_type=${payload.top_type}&sort_by=${payload.sort_by}`);
    },
    getPostAllMonitor(payload) {
      ApiService.setHeader()
      var dm = "", stm = "",hash="",acc="",retweet="",sd="",ed="",src,dash="";
      if (payload.dashboard) {
        dash = `&dashboard=${payload.dashboard}`;
       } else {
        dash ="";
       }
      if (payload.source) {
        src = `&source=${payload.source}`;
      } else {
        src ="";
      }
      if (payload.start_date) {
        sd = `&start_date=${payload.start_date}`;
       } else {
        sd ="";
       }
       if (payload.end_date) {
        ed = `&end_date=${payload.end_date}`;
       } else {
        ed ="";
       }
    if (payload.hashtag) {
        hash = `&hashtag=${payload.hashtag}`;
       } else {
        hash ="";
       }
   if (payload.domain) {
     dm = `&domain=${payload.domain}`;
    } else {
      dm ="";
    }
    if(payload.sentiment){
      stm =`&sentiment=${payload.sentiment}`;
    }else{
      stm = ""
    }
    if (payload.account) {
      acc = `&account=${payload.account}`;
     } else {
      acc ="";
     }
     if (payload.retweet) {
      retweet = `&retweet=${payload.retweet}`;
     } else {
      retweet ="";
     }
    return ApiService.get(`/v1/getsentimentdetail/?sort_by=${payload.sort_by}&offset=${payload.offset}`+stm+dm+hash+acc+retweet+sd+ed+src+dash);

    //return ApiService.get(`v1/getsentimentdetail/?account=${payload.account}&sentiment=${payload.sentiment}&sort_by=${payload.sort_by}&domain=${payload.domain}`);
    },
    
   };
   export const LoginService = {
    getLogin(payload) {
    return ApiService.post(`/auth/signin/`,{'username':payload.username,'password':payload.password},);
    },
   
  };
  export const DomainService = {
    getPostDomain(payload) {
      ApiService.setHeader()
      var dm = "", stm = "", source = "",dash="";
      if (payload.dashboard) {
        dash = `&dashboard=${payload.dashboard}`;
       } else {
        dash ="";
       }
   if (payload.domain) {
     dm = `&domain=${payload.domain}`;
    } else {
      dm ="";
    }
    if(payload.source){
      source =`&source=${payload.source}`;
    }else{
      source = ""
    }
    if(payload.sentiment){
      stm =`&sentiment=${payload.sentiment}`;
    }else{
      stm = ""
    }
    return ApiService.get(`/v1/getsentimentdetail/?sort_by=${payload.sort_by}&offset=${payload.offset}&start_date=${payload.start_date}&end_date=${payload.end_date}`+stm+dm+source+dash);
    },
    getPostDomain2(payload) {
      ApiService.setHeader()
      var dm = "", stm = "", source = "",dash="";
      if (payload.dashboard) {
        dash = `&dashboard=${payload.dashboard}`;
       } else {
        dash ="";
       }
   if (payload.domain) {
     dm = `&domain=${payload.domain}`;
    } else {
      dm ="";
    }
    if(payload.source){
      source =`&source=${payload.source}`;
    }else{
      source = ""
    }
    if(payload.sentiment){
      stm =`&sentiment=${payload.sentiment}`;
    }else{
      stm = ""
    }
    // Vue.axios.defaults.baseURL = 'http://139.59.103.67:3000'
    return ApiService.get(`/v2/domain/getSentimentPost/?sort_by=${payload.sort_by}&offset=${payload.offset}&start=${payload.start_date}&end=${payload.end_date}`+stm+dm+source+dash);
    // return ApiService.get(`/v1/getsentimentdetail/?sort_by=${payload.sort_by}&offset=${payload.offset}&start_date=${payload.start_date}&end_date=${payload.end_date}`+stm+dm+source+dash);
    },
    getChartDomain(payload) {
      // ApiService.setHeader()
      var sdate = "", edate = "";

    if(payload.start){
      sdate =`&start=${payload.start}`;
    }else{
      sdate = ""
    }
    if(payload.end){
      edate =`&end=${payload.end}`;
    }else{
      edate = ""
    }
    return ApiService.get(`/v2/userposts/getChartData?domain=${payload.domain}`+sdate+edate);
    },
   };
 