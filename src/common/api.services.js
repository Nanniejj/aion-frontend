import Vue from "vue";
import VueAxios from "vue-axios";
import axios from "axios";
import { API_URL } from "@/common/config";

//var token='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjE5NzU3ODkxLCJqdGkiOiIyNWZkZTQzMjdkMzY0MDZjYTVkNDVhOTEzM2FhZmYxMCIsInVzZXJfaWQiOjF9.YNM9ByihWJ4wnInbRz7T2kP0z0yvzVexfsFsmtGKvTY';
// var token;
// if (localStorage.getItem("token")) {
//   token = localStorage.getItem("token");
// } else {
//   token = sessionStorage.getItem("token");
// }

Vue.use(VueAxios, axios);
Vue.axios.defaults.baseURL = API_URL;
Vue.axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
Vue.axios.defaults.headers.common["Access-Control-Allow-Methods"] =
  "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH";
Vue.axios.defaults.headers.common["Access-Control-Allow-Headers"] = "*";

const ApiService = {
  //set in store auth
  setHeader() {
    //Vue.axios.defaults.headers.common['Allow'] = '*';
    Vue.axios.defaults.headers.common["Authorization"] =
      "Bearer " + localStorage.getItem("token");
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
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.get(`/v1/domain/?limit=${payload.limit}`);
  },
  getWordCloud(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();

    const params = new URLSearchParams({
      start_date: payload.start_date,
      end_date: payload.end_date,
    });

    if (payload.dashboard) params.set("dashboard", payload.dashboard);
    if (payload.monitor) params.set("monitor", payload.monitor);
    if (payload.source) params.set("source", payload.source);
    if (payload.domain) params.set("domain", payload.domain); // "สร้างรั้ว เปิดด่าน" -> "สร้างรั้ว+เปิดด่าน"
    if (payload.domain_ids) params.set("domain_id", payload.domain_ids);
    if (payload.keywords) params.set("keywords", payload.keywords);

    return ApiService.get(`/v1/getwordcloud/?${params.toString()}`);
  },
  getWordCloud2(payload) {
    console.log(payload.domain);

    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    var dom = "",
      domId = "",
      key = "",
      mo = "",
      src = "",
      dash = "";
    if (payload.dashboard) {
      dash = `&dashboard=${payload.dashboard}`;
    } else {
      dash = "";
    }
    if (payload.monitor) {
      mo = `&monitor=${payload.monitor}`;
    } else {
      mo = "";
    }
    if (payload.source) {
      src = `&source=${payload.source}`;
    } else {
      src = "";
    }
    if (payload.domain) {
      dom = `&domain=${payload.domain}`;
    } else {
      dom = "";
    }
    if (payload.domain_ids) {
      domId = `&domain_id=${payload.domain_ids}`;
    } else {
      domId = "";
    }
    if (payload.keywords) {
      key = `&keywords=${payload.keywords}`;
    } else {
      key = "";
    }

    return ApiService.get(
      `/v1/getwordcloud/?start_date=${payload.start_date}&end_date=${payload.end_date}` +
        key +
        dom +
        mo +
        src +
        dash +
        domId
    );
  },

  getSentiment(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    var dom = "",
      key = "",
      search = "",
      mo = "";
    if (payload.monitor) {
      mo = `&monitor=${payload.monitor}`;
    } else {
      mo = "";
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
      `/v1/getsentimentstat/?start_date=${payload.start_date}&end_date=${payload.end_date}` +
        dom +
        key +
        search +
        mo
    );
  },
  getSentimentHashtag(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    var dom = "",
      key = "",
      hash = "",
      mo = "";
    if (payload.monitor) {
      mo = `&monitor=${payload.monitor}`;
    } else {
      mo = "";
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
      `/v1/getsentimentstat/?start_date=${payload.start_date}&end_date=${payload.end_date}` +
        dom +
        key +
        hash +
        mo
    );
  },
  getSentimentDetail(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();

    const params = new URLSearchParams({
      start_date: payload.start_date,
      end_date: payload.end_date,
      offset: String(payload.offset ?? 0),
      sort_by: payload.sort_by ?? "",
    });

    // helper: เติมพารามิเตอร์เมื่อมีค่า (ไม่เป็น null/undefined/'')
    const add = (k, v) => {
      if (v === null || v === undefined) return;
      if (typeof v === "string" && v.trim() === "") return;
      params.set(k, String(v));
    };

    // // ถ้า domain เป็นอาเรย์ -> รวมด้วยช่องว่างเพื่อให้ได้ "สร้างรั้ว เปิดด่าน"
    // let domainVal = payload.domain;
    // if (Array.isArray(domainVal)) {
    //   domainVal = domainVal.filter(Boolean).join(' ');
    // }
    add("domain", payload.domain);

    add("keywords", payload.keywords);
    add("querySearch", payload.querySearch);
    add("monitor", payload.monitor);
    add("sentiment", payload.sentiment);
    add("hashtag", payload.hashtag);
    add("source", payload.source);
    // URLSearchParams จะเข้ารหัส space -> "+" อัตโนมัติ เช่น "สร้างรั้ว เปิดด่าน" -> "สร้างรั้ว+เปิดด่าน"

    return ApiService.get(`/v1/getsentimentdetail/?${params.toString()}`);
  },
  getSentimentDetail2(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    var dom = "",
      key = "",
      search = "",
      stm = "",
      mo = "",
      hash = "",
      src;
    if (payload.source) {
      src = `&source=${payload.source}`;
    } else {
      src = "";
    }
    if (payload.hashtag) {
      hash = `&hashtag=${payload.hashtag}`;
    } else {
      hash = "";
    }
    if (payload.sentiment) {
      stm = `&sentiment=${payload.sentiment}`;
    } else {
      stm = "";
    }
    if (payload.monitor) {
      mo = `&monitor=${payload.monitor}`;
    } else {
      mo = "";
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
      `/v1/getsentimentdetail/?start_date=${payload.start_date}&end_date=${payload.end_date}&offset=${payload.offset}&sort_by=${payload.sort_by}` +
        dom +
        key +
        search +
        mo +
        stm +
        hash +
        src
    );
  },
  getSentimentHashtagDetail(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();

    const params = new URLSearchParams({
      start_date: payload.start_date,
      end_date: payload.end_date,
      offset: String(payload.offset ?? 0),
      sort_by: payload.sort_by ?? "",
    });

    const add = (k, v) => {
      if (v === null || v === undefined) return;
      if (typeof v === "string" && v.trim() === "") return;
      params.set(k, String(v));
    };

    // domain อาจเป็นอาเรย์ -> รวมด้วยช่องว่างก่อน (space จะกลายเป็น + ตอน serialize)

    add("domain", payload.domain);

    add("keywords", payload.keywords);
    add("hashtag", payload.hashtag);
    add("monitor", payload.monitor);
    add("source", payload.source);
    add("sentiment", payload.sentiment);

    // NOTE: URLSearchParams.toString() จะให้ "สร้างรั้ว เปิดด่าน" -> "สร้างรั้ว+เปิดด่าน"
    return ApiService.get(`/v1/getsentimentdetail/?${params.toString()}`);
  },
};
export const RankingService = {
  getDomainRanking(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.get(`/v1/domain/?limit=${payload.limit}`);
  },
  getSubDomainRanking(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.get(`/v1/subdomain-list/${payload.domain}/?limit=100000`);
  },
  getRanking(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();

    const params = new URLSearchParams({
      start_date: payload.start_date,
      end_date: payload.end_date,
      source: payload.source ?? "",
      rankingtype: payload.rankingtype ?? "",
    });

     if (payload.domain) {
      params.set("domain", payload.domain);
    }
    if (payload.subdomain&&payload.subdomain.length) {
      params.set("subdomain", payload.subdomain);
    }

    return ApiService.get(`/v1/getranking/?${params.toString()}`);
  },
  getSentimentStat(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();

    const params = new URLSearchParams({
      start_date: payload.start_date,
      end_date: payload.end_date,
      source: payload.source ?? "",
    });
    if (payload.domain) {
      params.set("domain", payload.domain);
    }
    if (payload.subdomain&&payload.subdomain.length) {
      params.set("subdomain", payload.subdomain);
    }

    if (payload.objects) {
      params.set("objects", payload.objects);
    }
    // add(params, "domain", payload.domain); // "สร้างรั้ว เปิดด่าน" -> encode เป็น "สร้างรั้ว+เปิดด่าน"
    // add(params, "objects", payload.objects); // รองรับอาเรย์
    // add(params, "subdomain", payload.subdomain);

    return ApiService.get(`/v1/getsentimentstat/?${params.toString()}`);
  },
  getSentimentDetailRanking(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();

    const params = new URLSearchParams({
      start_date: payload.start_date,
      end_date: payload.end_date,
      offset: String(payload.offset ?? 0),
      sort_by: payload.sort_by ?? "",
      source: payload.source ?? "",
    });

     if (payload.domain) {
      params.set("domain", payload.domain);
    }
    if (payload.subdomain&&payload.subdomain.length) {
      params.set("subdomain", payload.subdomain);
    }

    if (payload.objects) {
      params.set("objects", payload.objects);
    }

     if (payload.sentiment) {
      params.set("sentiment", payload.sentiment);
    }
    // add(params, "sentiment", payload.sentiment); // จะไม่แนบถ้าเป็น '' หรือ null/undefined
    // add(params, "domain", payload.domain);
    // add(params, "objects", payload.objects);
    // add(params, "subdomain", payload.subdomain);

    return ApiService.get(`/v1/getsentimentdetail/?${params.toString()}`);
  },
};
export const TopInfluencerService = {
  getTopInfluencer(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.get(
      `/v1/gettopinfluencer/?start_date=${payload.start_date}&end_date=${payload.end_date}&source=${payload.source}&domain=${payload.domain}`
    );
  },
  getLinksTopInfluencer(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.post(`/v1/getinfluencerlink/`, {
      influencer: payload.influencer,
      source: payload.source,
      type: payload.type,
    });
  },
};
export const InfluencerLinkService = {
  getInfluencerLink(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.post(`/v1/getinfluencerlink/`, {
      influencer: payload.influencer,
      source: payload.source,
    });
  },
};
export const DashboardService = {
  getAllstats(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.get(
      `/v1/getAllstats/?start_date=${payload.start_date}&end_date=${payload.end_date}`
    );
  },
  getSentimentStatDashboard(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    // return ApiService.get(`/v1/getsentimentstat/?type=${payload.type}`);
    return ApiService.get(
      `/v1/getsentimentstat/?start_date=${payload.start_date}&end_date=${payload.end_date}&domain=${payload.domain}&dashboard=true`
    );
  },
  getSentimentPost(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.get(
      `/v1/getsentimentdetail/?start_date=${payload.start_date}&end_date=${payload.end_date}&source=${payload.source}&sentiment=${payload.sentiment}&sort_by=${payload.sort_by}&offset=${payload.offset}&domain=${payload.domain}&dashboard=true`
    );
    //  return ApiService.get(`/v1/getsentimentdetail/?type=${payload.type}&source=${payload.source}&sentiment=${payload.sentiment}
    //                                    &sort_by=${payload.sort_by}&offset=${payload.offset}`);
  },
  EditSentiment(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.put(`v1/EditSentiment/`, {
      sentiment: payload.sentiment,
      uid: payload.uid,
    });
  },
  getBacklogs(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    // return ApiService.get(`/v1/getsentimentstat/?type=${payload.type}`);
    return ApiService.get(
      `/v1/backlogs/?limit=${payload.limit}&offset=${payload.offset}`
    );
  },
};
export const GsearchService = {
  getGsearch(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.post(`/v1/googlesearch/?`, {
      date: payload.date,
      keyword: payload.keyword,
    });
  },
};
export const RelationPostService = {
  getRelationPost() {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.get(`/v1/getPostRelation/`);
  },
  getRelationPostLink() {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.get(`/v1/getPostRelation/?trigger=true`);
  },
};

export const AvatarService = {
  DeleteAvatar(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.post(`v1/avatar-delete/`, { avatar: payload.avatar });
  },
  getAvatarTeam() {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.get(`v1/avatardept/`);
  },
  getAvatars(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.get(
      `/v1/getavatar/?start_date=${payload.start_date}&end_date=${payload.end_date}`
    );
  },
  getCsvAvatar(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.post(`/v1/download/avatar/csv/`, {
      date: payload.date,
      data_json: payload.data_json,
    });
  },
};
export const TemplateService = {
  getListSubDomain(payload) {
    // payload เป็น path param → เข้ารหัสด้วย encodeURIComponent
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    const seg = encodeURIComponent(payload);
    return ApiService.get(`/v1/subdomain-list/${seg}/?limit=100000`);
  },

  DeleteDomain(payload) {
    Vue.axios.defaults.baseURL = "https://api2.cognizata.com/api/";
    ApiService.setHeader();
    // id อยู่ใน query → ปลอดภัยแล้ว แต่เข้ารหัสเผื่อ
    return ApiService.put(
      `v2/domain/deleteDomain?id=${encodeURIComponent(payload.id)}`
    );
  },

  AddDomain(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.post(`/v1/domain/`, {
      name: payload.name,
      display: payload.display,
    });
  },

  EditDomain(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    // id เป็น path → เข้ารหัส
    return ApiService.put(`/v1/domain/${encodeURIComponent(payload.id)}/`, {
      name: payload.name,
      id: payload.id,
      display: payload.display,
    });
  },

  EditSubDomain(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.put(`/v1/subdomain/${encodeURIComponent(payload.id)}/`, {
      name: payload.name,
      domain: payload.domain,
    });
  },

  AddSubDomain(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.post(`/v1/subdomain-create/`, {
      name: payload.name,
      domain: payload.domain,
      display: payload.display,
    });
  },

  getListWord(payload) {
    // ใช้ URLSearchParams → space จะกลายเป็น "+"
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();

    // const joinIfArray = (v) => Array.isArray(v) ? v.filter(Boolean).join(' ') : v;

    const params = new URLSearchParams({
      domain: payload.domain ?? "",
      subdomain: payload.subdomain ?? "",
      limit: "100000",
    });

    return ApiService.get(`/v1/object-list/?${params.toString()}`);
  },

  AddWord(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.post(`/v1/object-create/`, {
      name: payload.name,
      domain: payload.domain,
      display: payload.display,
      subdomain: payload.subdomain,
      keywords: payload.keywords,
      and_keywords: payload.and_keywords,
      not_keywords: payload.not_keywords,
    });
  },

  EditWord(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.put(`/v1/object/${encodeURIComponent(payload.id)}/`, {
      name: payload.name,
      domain: payload.domain,
      // display: payload.display,
      subdomain: payload.subdomain,
      keywords: payload.keywords,
      id: payload.id,
      and_keywords: payload.and_keywords,
      not_keywords: payload.not_keywords,
    });
  },

  DeleteSubdomain(payload) {
    Vue.axios.defaults.baseURL = "https://api2.cognizata.com/api/";
    ApiService.setHeader();
    return ApiService.put(
      `/v2/domain/deleteSubdomain?id=${encodeURIComponent(payload.id)}`
    );
  },

  DeleteWord(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.del(`/v1/object/${encodeURIComponent(payload.id)}/`, {
      id: payload.id,
    });
  },
};

export const MonitorService = {
  EditStatusHashtag(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.post(`v1/edit-hashtag/`, {
      hashtag: payload.hashtag,
      source: payload.source,
      status: payload.status,
    });
  },
  EditDescription(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.put(`v1/Target/`, {
      uid: payload.uid,
      source: payload.source,
      target: payload.target,
      email: payload.email,
      telno: payload.telno,
    });
  },
  getLocation(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    let query, account, sentiment, sdate, edate;
    if (payload.query) {
      query = `&query=${payload.query}`;
    } else {
      query = "";
    }
    if (payload.start_date) {
      sdate = `&start_date=${payload.start_date}`;
    } else {
      sdate = "";
    }
    if (payload.end_date) {
      edate = `&end_date=${payload.end_date}`;
    } else {
      edate = "";
    }
    if (payload.account) {
      account = `&account=${payload.account}`;
    } else {
      account = "";
    }
    if (payload.sentiment) {
      sentiment = `&sentiment=${payload.sentiment}`;
    } else {
      sentiment = "";
    }
    ApiService.setHeader();
    return ApiService.get(
      `v1/searchLocation/?sort_by=${payload.sort_by}&offset=${payload.offset}&source=${payload.source}` +
        query +
        account +
        sentiment +
        sdate +
        edate
    );
  },
  delMonitor(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.post(`/v1/delete-monitor/`, {
      source: payload.source,
      account: payload.account,
      hashtag: payload.hashtag,
    });
  },
  getListMonitor(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    var source = "";
    if (payload.source) {
      source = `?source=${payload.source}`;
    }
    ApiService.setHeader();
    return ApiService.get(`/v1/getMonitorlist/` + source);
  },
  CreateMonitor(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.post(`/v1/create-monitor/`, {
      source: payload.source,
      account: payload.account,
      hashtag: payload.hashtag,
      team: payload.team,
      avatar: payload.avatar,
    });
  },
  getSearchMonitor(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.get(
      `/v1/searchMonitor/?query=${payload.query}&search_type=${payload.search_type}`
    );
  },
  getProfile(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    return ApiService.get(
      `v1/getMonitor/?query=${payload.query}&api_type=${payload.api_type}&top_type=${payload.top_type}&sort_by=${payload.sort_by}&source=${payload.source}`
    );
  },
  getPostAllMonitor(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    var dm = "",
      stm = "",
      hash = "",
      acc = "",
      retweet = "",
      sd = "",
      ed = "",
      src,
      dash = "";
    if (payload.dashboard) {
      dash = `&dashboard=${payload.dashboard}`;
    } else {
      dash = "";
    }
    if (payload.source) {
      src = `&source=${payload.source}`;
    } else {
      src = "";
    }
    if (payload.start_date) {
      sd = `&start_date=${payload.start_date}`;
    } else {
      sd = "";
    }
    if (payload.end_date) {
      ed = `&end_date=${payload.end_date}`;
    } else {
      ed = "";
    }
    if (payload.hashtag) {
      hash = `&hashtag=${payload.hashtag}`;
    } else {
      hash = "";
    }
    if (payload.domain) {
      dm = `&domain=${payload.domain}`;
    } else {
      dm = "";
    }
    if (payload.sentiment) {
      stm = `&sentiment=${payload.sentiment}`;
    } else {
      stm = "";
    }
    if (payload.account) {
      acc = `&account=${payload.account}`;
    } else {
      acc = "";
    }
    if (payload.retweet) {
      retweet = `&retweet=${payload.retweet}`;
    } else {
      retweet = "";
    }
    return ApiService.get(
      `/v1/getsentimentdetail/?sort_by=${payload.sort_by}&offset=${payload.offset}` +
        stm +
        dm +
        hash +
        acc +
        retweet +
        sd +
        ed +
        src +
        dash
    );

    //return ApiService.get(`v1/getsentimentdetail/?account=${payload.account}&sentiment=${payload.sentiment}&sort_by=${payload.sort_by}&domain=${payload.domain}`);
  },
};
export const LoginService = {
  getLogin(payload) {
    return ApiService.post(`/auth/signin/`, {
      username: payload.username,
      password: payload.password,
    });
  },
};
export const DomainService = {
  getPostDomainv1(payload) {
    Vue.axios.defaults.baseURL = API_URL;
    ApiService.setHeader();
    var dm = "",
      stm = "",
      source = "",
      dash = "",
      findkey = "";
    if (payload.querySearch) {
      findkey = `&querySearch=${payload.querySearch}`;
    } else {
      findkey = "";
    }
    if (payload.dashboard) {
      dash = `&dashboard=${payload.dashboard}`;
    } else {
      dash = "";
    }
    if (payload.domain) {
      dm = `&domain=${payload.domain}`;
    } else {
      dm = "";
    }
    if (payload.source) {
      source = `&source=${payload.source}`;
    } else {
      source = "";
    }
    if (payload.sentiment) {
      stm = `&sentiment=${payload.sentiment}`;
    } else {
      stm = "";
    }
    return ApiService.get(
      `/v1/getsentimentdetail/?sort_by=${payload.sort_by}&offset=${payload.offset}&start_date=${payload.start_date}&end_date=${payload.end_date}` +
        stm +
        dm +
        source +
        dash +
        findkey
    );
  },
  getPostDomain(payload) {
    Vue.axios.defaults.baseURL = "https://api2.cognizata.com/api/";
    ApiService.setHeader();
    var dm = "",
      stm = "",
      source = "",
      dash = "",
      findkey = "",
      mor = "";
    if (payload.querySearch) {
      findkey = `&querySearch=${payload.querySearch}`;
    } else {
      findkey = "";
    }
    if (payload.dashboard) {
      dash = `&dashboard=${payload.dashboard}`;
    } else {
      dash = "";
    }
    if (payload.domain) {
      dm = `&domain=${payload.domain}`;
    } else {
      dm = "";
    }
    if (payload.source) {
      source = `&source=${payload.source}`;
    } else {
      source = "";
    }
    if (payload.sentiment) {
      stm = `&sentiment=${payload.sentiment}`;
    } else {
      stm = "";
    }
    if (payload.mor) {
      mor = `&monitor=${payload.mor}`;
    } else {
      mor = "";
    }
    return ApiService.get(
      `/v2/userposts/getSentimentdetail/?sort_by=${payload.sort_by}&offset=${payload.offset}&start_date=${payload.start_date}&end_date=${payload.end_date}` +
        stm +
        dm +
        source +
        dash +
        findkey +
        mor
    );
  },
  getTopPostDomain(payload) {
    Vue.axios.defaults.baseURL = "https://api2.cognizata.com/api/";
    ApiService.setHeader();
    var dm = "",
      stm = "",
      source = "",
      dash = "",
      findkey = "",
      mor = "";
    if (payload.querySearch) {
      findkey = `&querySearch=${payload.querySearch}`;
    } else {
      findkey = "";
    }
    if (payload.dashboard) {
      dash = `&dashboard=${payload.dashboard}`;
    } else {
      dash = "";
    }
    if (payload.domain) {
      dm = `&domain=${payload.domain}`;
    } else {
      dm = "";
    }
    if (payload.source) {
      source = `&source=${payload.source}`;
    } else {
      source = "";
    }
    if (payload.sentiment) {
      stm = `&sentiment=${payload.sentiment}`;
    } else {
      stm = "";
    }
    if (payload.mor) {
      mor = `&monitor=${payload.mor}`;
    } else {
      mor = "";
    }
    return ApiService.get(
      `/v2/userposts/getSentimentdetailDomain/?sort_by=${payload.sort_by}&offset=${payload.offset}&start_date=${payload.start_date}&end_date=${payload.end_date}` +
        stm +
        dm +
        source +
        dash +
        findkey +
        mor
    );
  },
  getPostDomain2(payload) {
    ApiService.setHeader();
    var dm = "",
      stm = "",
      source = "",
      dash = "";
    if (payload.dashboard) {
      dash = `&dashboard=${payload.dashboard}`;
    } else {
      dash = "";
    }
    if (payload.domain) {
      dm = `&domain=${payload.domain}`;
    } else {
      dm = "";
    }
    if (payload.source) {
      source = `&source=${payload.source}`;
    } else {
      source = "";
    }
    if (payload.sentiment) {
      stm = `&sentiment=${payload.sentiment}`;
    } else {
      stm = "";
    }
    // Vue.axios.defaults.baseURL = 'http://139.59.103.67:3000'
    return ApiService.get(
      `/v2/domain/getSentimentPost/?sort_by=${payload.sort_by}&offset=${payload.offset}&start=${payload.start_date}&end=${payload.end_date}` +
        stm +
        dm +
        source +
        dash
    );
    // return ApiService.get(`/v1/getsentimentdetail/?sort_by=${payload.sort_by}&offset=${payload.offset}&start_date=${payload.start_date}&end_date=${payload.end_date}`+stm+dm+source+dash);
  },
  getChartDomain(payload) {
    // ApiService.setHeader()
    var sdate = "",
      edate = "";

    if (payload.start) {
      sdate = `&start=${payload.start}`;
    } else {
      sdate = "";
    }
    if (payload.end) {
      edate = `&end=${payload.end}`;
    } else {
      edate = "";
    }
    return ApiService.get(
      `/v2/userposts/getChartData?domain=${payload.domain}` + sdate + edate
    );
  },
};
