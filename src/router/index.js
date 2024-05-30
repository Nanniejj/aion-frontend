import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import axios from "axios";
import store from "@/store";
// import { API_URL } from '@/common/config';

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/login" },
  // {
  //   path: '/platform',
  //   name: 'PlatForm',
  //   component: () => import(/* webpackChunkName: "PlatForm" */ '../views/PlatForm.vue'),
  // },
 
  {
    path: "/domain",
    name: "Domain",
    component: () =>
      import(/* webpackChunkName: "DomainList" */ "../views/Domain.vue")
  },
  {
    path: "/settingsearch",
    name: "SearchKeywordSetting",
    component: () =>
      import(/* webpackChunkName: "DomainList" */ "../views/SearchKeywordSetting.vue")
  },
  {
    path: "/domainReport",
    name: "DomainReport",
    component: () =>
      import(/* webpackChunkName: "DomainList" */ "../views/DomainReport.vue")
  },
  {
    path: "/platform",
    name: "Dashboard",
    component: Dashboard
  },
  {
    path: "/platform",
    name: "PlatFormMain",
    props: true
  },
  {
    path: "/dashboardpost",
    name: "DashboardPost",
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "dashboardpost" */ "../views/DashboardPost.vue"
      )
  },
  {
    path: "/wordcloud",
    name: "Wordcloud",
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "wordcloud" */ "../views/Wordcloud.vue")
  },
  {
    path: "/ranking",
    name: "Ranking",
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "ranking" */ "../views/Ranking.vue")
  },
  {
    path: "/influencertop",
    name: "Influencertop",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "influencertop" */ "../views/Influencertop.vue"
      )
  },
  {
    path: "/influencerlink",
    name: "Influencerlink",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "influencerlink" */ "../views/Influencerlink.vue"
      )
  },
  {
    path: "/wordcloudpost",
    name: "WordCloudPost",
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "wordcloudpost" */ "../views/WordCloudPost.vue"
      )
  },
  {
    path: "/wordcloud",
    name: "WordcloudSentiment",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "wordcloudsentiment" */ "../views/WordcloudSentiment.vue"
      )
  },
  {
    path: "/wordcloud",
    name: "WordClick",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "wordcloudsentiment" */ "../views/WordcloudSentiment.vue"
      )
  },

  {
    path: "/hashtagpost",
    name: "HashtagPost",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "hashtagpost" */ "../views/HashtagPost.vue")
  },
  {
    path: "/avatar",
    name: "Avatar",
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "avatar" */ "../views/Avatar.vue")
  },
  {
    path: "/gsearch",
    name: "Gsearch",
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "gsearch" */ "../views/Gsearch.vue")
  },
  {
    path: "/getrelation",
    name: "Getrelation",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "getrelation" */ "../views/Getrelation.vue")
  },
  {
    path: "/templatesetting",
    name: "TemplateSetting",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "templatedomain" */ "../views/TemplateSetting.vue"
      )
  },
  {
    path: "/templatemap",
    name: "TemplateMap",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "templatedomain" */ "../views/TemplateMap.vue"
      )
  },
  {
    path: "/templateusermanagement",
    name: "TemplateUserManagement",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "templatedomain" */ "../views/TemplateUserManagement.vue"
      )
  },
  {
    path: "/templatesetting",
    name: "TemplateSettingSubDomain",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "templatesubdomain" */ "../views/TemplateSettingSubDomain.vue"
      )
  },
  {
    path: "/templatesetting",
    name: "TemplateSettingWord",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "templateword" */ "../views/TemplateSettingWord.vue"
      )
  },
  {
    path: "/profile",
    name: "Profile",
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/Profile.vue")
  },
  {
    path: "/hashtag",
    name: "Hashtag",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "hashtag" */ "../views/Hashtag.vue")
  },
  {
    path: "/keyword",
    name: "Keyword",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "keyword" */ "../views/Keyword.vue")
  },
  {
    path: "/posts",
    name: "Posts",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "posts" */ "../views/Posts.vue")
  },
  {
    path: "/login",
    name: "Login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue")
  },
  {
    path: "/monitor",
    name: "Monitor",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Monitor.vue")
  },
  {
    path: "/feed",
    name: "Feed",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "Feed" */ "../views/Feed.vue")
  },
  {
    path: "/hotissue",
    name: "HotIssue",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/HotIssue.vue")
  },
  {
    path: "/hotissuesetting",
    name: "HotIssueSetting",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/HotIssueSetting.vue")
  },
  {
    path: "/report",
    name: "Report",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "report" */ "../views/Report.vue")
  },
  
  {
    path: "/targetprofile",
    name: "ReportProfile",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "targetprofile" */ "../views/ReportProfile.vue"
      )
  },
  {
    path: "/map",
    name: "Map",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "targetprofile" */ "../views/Map.vue"
      )
  },
  {
    path: "/mappost",
    name: "MapPost",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "targetprofile" */ "../views/MapPost.vue"
      )
  },
  {
    path: "/faceRecognition",
    name: "FaceRecognition",
    // props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/FaceRecognition.vue")
  },
   // {
  //   path: "/home",
  //   name: "Section",
  //   component: () =>
  //     import(/* webpackChunkName: "Section" */ "../views/Section.vue")
  // },
];

const router = new VueRouter({
  routes,
  mode: "hash"
});

export default router;

axios.interceptors.response.use(
  response => {
    // console.log("res1 ", response);
    return response;
  },
  function(error) {
    const originalRequest = error.config;
    //when refresh token expired go to login to get access token first
    console.log(originalRequest.url);
    if (
      error.response.status === 401 &&
      originalRequest.url === "https://api2.cognizata.com/api/auth/reftoken"
    ) {
      store.commit("setLogout");
      router.push("/login");
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      console.log("org2 ", originalRequest._retry);
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("reftoken");
      console.log("error 401");
      console.log(refreshToken);
      return axios
        .post("https://api2.cognizata.com/api/auth/reftoken", {
          reftoken: refreshToken
        })
        .then(res => {
          if (res.status === 200) {
            console.log("200");
            localStorage.setItem("token", res.data.accessToken);
            //setUsername(getUsername());
            originalRequest.headers.Authorization =
              "Bearer " + res.data.accessToken;
            return axios(originalRequest);
          }
        })
        .catch(err => {
          console.log("res error");
          console.log(err);
          store.commit("setLogout");
          router.push("/login");
        });
    }
    console.log("err2d ", error);
    return Promise.reject(error);
  }
);
