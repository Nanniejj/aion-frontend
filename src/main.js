import "@babel/polyfill";
import "mutationobserver-shim";
import Vue from "vue";
import "./plugins/bootstrap-vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VTooltip from "v-tooltip";
import { VClosePopover } from "v-tooltip";
import Popover from "vue-js-popover";
import VueGoogleCharts from "vue-google-charts";
import vSelect from "vue-select";
import VueClipboard from "vue-clipboard2";
import VueChartJs from "vue-chartjs";
import VueSimpleAlert from "vue-simple-alert";
import VModal from "vue-js-modal";
import VueModalTor from "vue-modaltor";
import BackToTop from "vue-backtotop";
import Tabs from "vue-tabs-with-active-line";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import VueElementLoading from "vue-element-loading";
import VueHtmlToPaper from "vue-html-to-paper";
import InfiniteLoading from "vue-infinite-loading";
import PhotoGrid from "vue-photo-grid";
import lightbox from "vlightbox";
import Print from "vue-print-nb";
import VueGallerySlideshow from "vue-gallery-slideshow";
import numeral from "numeral";
import numFormat from "vue-filter-number-format";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import VueApexCharts from "vue-apexcharts";
import JsonExcel from "vue-json-excel";
import LongdoMap from "longdo-map-vue";
import TinyEmitter from 'tiny-emitter'

// import VNetworkGraph from "v-network-graph"
// import "v-network-graph/lib/style.css"

import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
Vue.component("l-map", LMap);
Vue.component("l-tile-layer", LTileLayer);
Vue.component("l-marker", LMarker);
const emitter = new TinyEmitter()
import { Icon } from "leaflet";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});
Vue.prototype.$emitter = emitter
// Vue.use(VNetworkGraph);
Vue.component("downloadExcel", JsonExcel);
Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.filter("numFormat", numFormat(numeral));
Vue.use(Print);
Vue.use(lightbox);
Vue.use(VueGallerySlideshow);
Vue.use(PhotoGrid);
Vue.use(InfiniteLoading);
const options = {
  name: "_blank",
  specs: ["fullscreen=yes", "titlebar=yes", "scrollbars=yes"],
  styles: [
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
    "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
    "https://unpkg.com/kidlat-css/css/kidlat.css",
    "https://fonts.googleapis.com/css?family=Prompt&display=swap"
  ]
};
//Vue.use(Printd);
Vue.use(VueHtmlToPaper, options);
Vue.component("VueElementLoading", VueElementLoading);
Vue.use(DatePicker);
Vue.use(Tabs);
Vue.use(BackToTop);
Vue.use(VueModalTor);
Vue.use(VModal);
Vue.use(VueSimpleAlert);
Vue.use(VueChartJs);
Vue.use(VueClipboard);
Vue.component("v-select", vSelect);
import ReadMore from "vue-read-more";

Vue.use(ReadMore);
// Vue.component('v-select', VueSelect.VueSelect)
Vue.use(VueGoogleCharts);
Vue.directive("close-popover", VClosePopover);
Vue.prototype.$hostname = "http://157.230.252.209:8000";
Vue.use(Popover);
Vue.use(VTooltip);
Vue.use(LongdoMap, {
  load: {
    apiKey: "91e3cb755ec9c0f711ffabf94770a289"
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
