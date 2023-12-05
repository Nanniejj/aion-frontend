import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import worldcloud from "./wordcloud";
import dashboard from "./dashboard";
import ranking from "./ranking";
import topinfluencer from "./topinfluencer";
import influencerlink from "./influencerlink"
import avatar from './avatar';
import gsearch from './gsearch';
import getrelation from './getrelation';
import template from './template';
import loading from './loading';
import token from './token';
import auth from './auth'
import monitor from './monitor'
import monitor_hashtag from './monitor_hashtag'
import location from './location'
import domain from './domain'
import platform from './platform'
import feed from './feed'
import user from './user'
import map from './map'
import hotissue from './hotissue'
import section from './section'
import report from './report'
import setting from './setting'

export default new Vuex.Store({
  modules: { worldcloud,dashboard,ranking,topinfluencer,influencerlink,avatar,gsearch,getrelation,template,loading,token,auth,monitor,monitor_hashtag,location,domain,platform,feed,user,map ,hotissue,section,report,setting},
});
