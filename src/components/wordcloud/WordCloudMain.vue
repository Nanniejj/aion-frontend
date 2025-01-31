<template>
  <div id="content">
    <b-row align-h="start" class="mr-4">
      <b-col class="d-contents">
        <!-- for phone -->
        <div id="flowPhone">
          <div @click="toword()" style="cursor: pointer"><a>Wordcloud</a></div>
          <div style="margin-left: 1.5px; color: #343a40" class="mr-2">
            <i class="fas fa-chevron-right" />
            <span
              v-if="getWordCloudDomain == 'All' || getWordCloudDomain == ''"
            >
              <b> ALL </b
              ><span v-if="getKeywords">
                <b>/ {{ getKeywords }}</b></span
              ></span
            >
            <span v-else>
              <b
                ><span v-for="dn in getWordCloudDomain" :key="dn">
                  {{ dn }}
                </span></b
              >
              <span v-if="getKeywords">
                <b>/ {{ getKeywords }}</b></span
              ></span
            >
          </div>
        </div>

        <!-- for desktop -->
        <div id="flowBoxes">
          <div
            class="rightt hov"
            @click="toword()"
            style="cursor: pointer; color: #4c412b"
          >
            <a>Wordcloud</a>
            <span class="prt"> /</span>
          </div>
          <div class="leftt active" v-if="getKeywords">
            <a style="margin-left: 18px">
              <span v-if="getWordCloudDomain == 'All'">
                All Domain<span> / {{ getKeywords }}</span></span
              >
              <span v-else-if="getWordCloudDomain == ''">
                All<span> / {{ getKeywords }}</span></span
              >
              <span v-else
                ><span v-for="dn in getWordCloudDomain" :key="dn"
                  >{{ dn }}
                </span>
                <span> / {{ getKeywords }}</span></span
              ></a
            >
          </div>

          <div class="leftt active" v-if="!getKeywords">
            <a style="margin-left: 18px"
              ><span v-if="getWordCloudDomain == 'All'">All Domain</span>
              <span v-else-if="getWordCloudDomain == ''">All</span>
              <span v-else
                ><span v-for="dn in getWordCloudDomain" :key="dn"
                  >{{ dn }}
                </span></span
              ></a
            >
          </div>
        </div>
        <b-row id="d-monitor" v-if="getLoadCloud == false" class="mr-1">
          <span class="shadow-sm p-2 mb-lg-3 bg-white rounded bold" >
            <div v-if="getSelectedMonitor">
              <i class="fas fa-id-card-alt"></i> บัญชี monitor
            </div>
            <div v-else><i class="fas fa-id-card-alt"></i> บัญชีทั้งหมด </div>
          </span>
        </b-row>
      </b-col>
      <b-col lg="" md="" sm="12" style="display: contents" id="d-date">
        <div
          class="p-2 my-0 text-sm-center text-lg-right mt-lg-3 mt-md-3 mt-sm-0"
          v-if="!this.cloudApi"
        >
          <span class="shadow-sm p-2 mb-3 bg-white rounded bold mr-2">
            <i class="fa fa-calendar" />
            <span v-if="ssdate == eedate"> {{ ssdate }} </span>
            <span v-else> {{ ssdate }} - {{ eedate }} </span>
          </span>
          <span class="pt-3"
            ><i class="fa fa-print align-middle" @click="printWindow()"></i
          ></span>
        </div>
      </b-col>
    </b-row>

    <div class="min-h">
      <vue-element-loading
        :active="getLoadCloud"
        size="80"
        background-color="rgba(255, 255, 255, 0.5)"
        color="#b6ac9a"
      />

      <div v-if="getWordCloud.data" class="mt-2">
        <div
          v-if="getWordCloud.data.wordcloud.data.length ||
            getWordCloud.data.hashtag.data.length"
        >
          <div>
            <div class="card">
              <ul class="nav justify-content-center border">
                <li class="nav-pills nav-fill tab">
                  <a
                    class="nav-link md-font"
                    :class="{ active: activateTab.Words }"
                    @click="changTab('Words')"
                    >Words</a
                  >
                </li>
                <li class="nav-pills nav-fill tab">
                  <a
                    class="nav-link md-font"
                    :class="{ active: activateTab.Hashtag }"
                    @click="changTab('Hashtag')"
                    >Hashtag</a
                  >
                </li>
              </ul>
            </div>
          </div>
          <keep-alive>
            <component v-bind:is="currentTab" :checklink="cloudApi" />
          </keep-alive>
        </div>
        <div v-else>
          <b-card id="card-none">
            <div class="m-3">ไม่พบข้อมูล</div>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
//import { GChart } from 'vue-google-charts';
//import wordcloud from "vue-wordcloud";
//import alertErr from "@/components/alert_err.vue";
import WordCloudTabWords from "@/components/wordcloud/WordCloudTabWords.vue";
import WordCloudTabHashtag from "@/components/wordcloud/WordCloudTabHashtag.vue";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  props: {
    type: {
      type: String,
    },
    cloudApi: {
      type: Boolean,
    },
  },
  data() {
    return {
      options: [
        { id: "daily", value: "Today" },
        { id: "weekly", value: "Last week" },
        { id: "monthly", value: "1 month" },
      ],
      title: "Wordcloud",
      domain: "",
      result: "testresult",
      currentTab: WordCloudTabWords,
      type_selected: "daily",
      sdate: "",
      edate: "",
    };
  },
  components: {
    WordCloudTabWords,
    WordCloudTabHashtag,
    //wordcloud,
    //GChart,
  },
  methods: {
    printWindow: function () {
      try {
        window.print();
      } catch (err) {
        console.log(err);
      }
    },
    changTab: function (tab) {
      if (tab === "Words") {
        this.currentTab = WordCloudTabWords;
      } else if (tab === "Hashtag") this.currentTab = WordCloudTabHashtag;
    },
    toword: function () {
      // this.$store.commit("setSelected", false);
      if (!this.cloudApi) {
        this.$store.commit("setWordCloud", "");
        this.$store.commit("setWordCloudDomain", "");
      }
      this.$router.push({ name: "Wordcloud" });
    },
  },
  computed: {
    ...mapGetters([
      "getScroll",
      "getShowDomain",
      "getWordCloud",
      "getWordCloudStartDate",
      "getWordCloudEndDate",
      "getDomain",
      "getLoadStatus",
      "getWordCloudDomain",
      "getKeywords",
      "getDate",
      "getLoadCloud",
      "getSelectedMonitor",
    ]),
    ssdate() {
      var ssdate = this.sdate;
      var s = new Date(this.getWordCloudStartDate.slice(0, 10));
      ssdate = new Intl.DateTimeFormat("en-AU").format(s);
      return ssdate;
    },
    eedate() {
      // var eedate = this.edate;
      var e = new Date(this.getWordCloudEndDate.slice(0, 10));
      var eedate = new Intl.DateTimeFormat("en-AU").format(e);
      return eedate;
    },
    activateTab: function () {
      if (this.currentTab === WordCloudTabWords) {
        return { Words: true, Hashtag: false };
      }
      return { Words: false, Hashtag: true };
    },
    iscurrenttapword() {
      return (
        this.tab_selected === "word" || this.tab_selected === "word_detail"
      );
    },
    isdomain() {
      for (var i = 0; i < this.getWordCloudDomain.length; i++) {
        var domains = this.getWordCloudDomain[i];
        //  return domains
        console.log("infor", domains);
      }
      console.log("outfor", domains);
      return domains;
    },
  },
  destroyed() {
    this.$store.commit('setWordCloudImg','')
    this.$store.commit('setWordCloud','')
  },
  async created() {
    this.$store.commit('setWordCloudImg','')
    this.$store.commit('setWordCloud','')
    if (this.cloudApi) {
      var todays = moment(new Date()).format().slice(0, 10) + "T00:00:00";
      var todaye = moment(new Date()).format().slice(0, 10) + "T23:59:59";
      // this.$store.commit('setWordCloudStartDate',todays)
      // this.$store.commit('setWordCloudEndDate',todaye)
      await this.$store.dispatch("fetchWordCloud", {
        start_date: todays,
        end_date: todaye,
        // domain: "all",
        // monitor: true,
      });

    }
  },
};
</script>

<style scoped>
#d-monitor {
  margin-left: 50px;
}
.min-h {
  min-height: 40vh;
}
.rounded {
  border-radius: 6px !important;
}
.fa-print {
  font-size: 25px;
  cursor: pointer;
}
#card-none {
  width: 90%;
  border: 1px solid rgba(0, 0, 0, 0.125) !important;
}
#export-btn {
  margin: 0px 20px;
  color: #495057;
  background-color: #e9ecef;
  border-color: #e9ecef;
  border-radius: 9px;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 20%);
}
#export-btn:hover {
  color: white;
  background-color: #495057;
  border-color: #495057;
}
button {
  background-color: #f0f0f0;
  border: solid 1px #bbb;
  padding: 10px;
  font-size: 15px;
  border-radius: 5px;
}
#flowPhone {
  display: none;
}
#date-box-phone {
  display: none;
}
#date-box {
  text-align: start;
  margin-left: 50px;
  color: #4c412b;
  font-weight: bold;
}
#flowBoxes {
  font-size: x-large;
  font-weight: bold;
  text-align: start;
  margin-left: 30px;
  padding: 20px;
  padding-bottom: 7px;
}
#flowBoxes div {
  display: inline-flex;
  position: relative;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  /* border:1px solid #ccc; */
  margin-right: 9px;
  background-color: #ede7dd;
}
#flowBoxes div.rightt:after {
  content: "";
  /* border-top: 1px solid #ccc;
    border-right: 1px solid #ccc; */
  width: 28px;
  height: 28px;
  position: absolute;
  right: 0;
  top: 2px;
  background-color: #ede7dd;
  z-index: 150;
  transform: translate(14px, 4px) rotate(45deg) !important;
  -webkit-transform: translate(10px, 4px) rotate(45deg);
  -moz-transform: translate(10px, 4px) rotate(45deg);
  -ms-transform: translate(10px, 4px) rotate(45deg);
  -o-transform: translate(10px, 4px) rotate(20deg);
}
#flowBoxes div.leftt:before {
  content: "";
  /* border-top: 1px solid #ccc;
    border-right: 1px solid #ccc; */
  width: 28px;
  height: 28px;
  position: absolute;
  left: 0;
  top: 2px;
  background-color: white;
  z-index: 50;
  -webkit-transform: translate(-10px, 4px) rotate(45deg);
  -moz-transform: translate(-10px, 4px) rotate(45deg);
  -ms-transform: translate(-10px, 4px) rotate(45deg);
  -o-transform: translate(-10px, 4px) rotate(20deg);
  transform: translate(-15px, 4px) rotate(45deg);
}
#flowBoxes .active {
  background-color: #4c412b;
  color: white;
  text-overflow: ellipsis;
  overflow: hidden;
  width: fit-content;

  white-space: nowrap;
}
#flowBoxes div.active:after {
  background-color: #4c412b;
}
#text-hashtag:hover {
  color: #fed16e !important;
}
#text-word:hover {
  color: #fed16e !important;
}
#app-words {
  margin-top: 50px;
}
#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
}
div.cardChart.footer_margin {
  margin-bottom: 25px;
}
.submit {
  background-color: white;
  color: gray;
  border-color: #fed16e !important;
  border-radius: 9px;
  font-weight: bold;
}

.submit:hover {
  background-color: #ddd;
}

.paddingtb {
  padding-left: 11.3rem;
}

.listf {
  border-top: 0;
  border-left: 0;
  border-right: 0;
  border-bottom: 0;
}

.lists {
  background-color: #ede7dd;
}
.list {
  height: 25px;
  font-size: 13pt;
  padding-top: 0;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  border-bottom: 0;
}
.imgsocial {
  width: 44px;
}
#all-btn {
  padding-top: 9px !important;
  padding-bottom: 9px !important;
}
.chart2 {
  background-color: antiquewhite;
}
.chart3 {
  background-color: aquamarine;
}
.cardChart {
  border-radius: 12px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  width: 95%;
  margin: auto;
}
.cardChart2 {
  border-radius: 12px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  width: 95%;
  height: 520px;
  margin: auto;
}
.date {
  text-align: end;
}

.top {
  margin-left: -2rem;
  margin-top: 29px;
}
.tablename {
  text-align: start;
  margin-top: 5%;
  font-size: 20pt;
  font-weight: bold;
}

.border {
  border-radius: 0px;
  border-color: #fed16e !important;
}

.tab {
  width: 50%;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
}
.forget {
  text-align: end;
}
.card {
  width: 50%;
  margin: auto;
  border: 0ch;
}

a {
  color: black;
}

.nav-pills .nav-link.active,
.nav-pills .show > .nav-link {
  color: #fff;
  background-color: #fed16e;
  border-radius: 0;
}

/* The container */
.containers {
  display: block;
  position: relative;
  margin-bottom: 12px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.containers input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  border-radius: 5px;
}

/* On mouse-over, add a grey background color */
.containers:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.containers input:checked ~ .checkmark {
  background-color: #ffffff;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.containers input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.containers .checkmark:after {
  left: 10px;
  top: 7px;
  width: 5px;
  height: 10px;
  border: solid #fed16e;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.submit {
  width: 100%;
  background-color: white;
  color: gray;
  border-color: #fed16e !important;
  border-radius: 9px;
  font-weight: bold;
}

.inputform {
  border-radius: 0;
  border-bottom: 1px solid black;
  border-top: 0;
  border-left: 0;
  border-right: 0;
}

.wordCloud {
  margin-top: -2rem;
  background-color: white;
  display: block;
}

.wordCloud svg {
  position: none !important;
}

.list-group-item {
  margin: auto;
  width: 400px;
}

.list-group {
  margin-bottom: 20px;
}

#menu ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#menu li {
  float: left;
}

#menu li a {
  display: block;
  color: white;
  text-align: center;
  padding: 7px;
  text-decoration: none;
  cursor: pointer;
}

#menu li a:hover {
  background-color: #fed16eab;
}

.tooltiptext {
  width: 95%;
  background-color: #ede7dd;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  left: 0;
  top: 20px;
  margin: auto;
  box-shadow: 6px 6px 6px 6px rgba(0, 0, 0, 0.2);
}

.tooltiptext::after {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 14%;
  margin-left: -30px;
  border-width: 20px;
  border-style: solid;
  border-color: transparent transparent #ede7dd transparent;
}

#facebook::after {
  left: 29.5%;
}

#twiiter::after {
  left: 40.5%;
}

#pantip::after {
  left: 51.5%;
}

#news::after {
  left: 63.5%;
}

#youtube::after {
  left: 74.5%;
}

#ig::after {
  left: 86%;
}

.doc {
  color: gray;
  font-size: 14pt;
  text-align: start;
  margin-left: 25%;
  margin-bottom: 5px;
}

.margin-10 {
  margin-top: 10px;
}

.margin-30 {
  margin-top: 30px;
}

.datetxt {
  font-size: 14pt;
  font-weight: bold;
  text-align: end;
}

.datetxt a {
  color: gray;
}

.datetxt a:hover {
  color: gray;
}

.top10 {
  font-size: 18pt;
  font-weight: bold;
}

.all {
  background-color: #fed16e;
  color: white;
  width: 80px;
  padding-top: 0.3rem;
  padding-bottom: 0;
}

.col-chart {
  margin-left: 3rem;
}

.number {
  margin-left: -0.4rem;
  font-weight: bold;
}
.word {
  margin-left: -0.2rem;
  font-weight: bold;
}

.pointer {
  cursor: pointer;
}

.circle-size {
  font-size: 16pt;
  margin-top: 2px;
}

.margin-3 {
  margin-left: 3rem;
}

#tablelist .detail {
  margin-left: 8%;
  margin-top: 0px;
}

#tablelist .list-group-item {
  width: 1200px;
}

#tablelist .word {
  width: 150px;
}

#tablelist .paddingtb {
  width: 856px;
}

#tablelist .number {
  width: 46px;
}

#tablelist .list {
  height: auto;
}

.paddingtb {
  padding-left: 0;
}
@media only screen and (min-width: 0px) and (max-width: 750px) {
  .mr-4 {
    padding-left: 9%;
  }
  .d-contents {
    display: contents !important;
  }
  #d-monitor {
    margin-left: 0px;
  }
  #date-box {
    display: none;
  }
  #txt-date {
    font-size: 13px;
    font-weight: 600;
  }
  #date-box-phone {
    display: block;
    text-align: start;
    font-size: 13px;
    font-weight: 600;
    margin-left: 20px;
    margin-bottom: 10px;
  }
  #flowBoxes {
    display: none;
  }
  #flowPhone {
    background: none;
    display: flex;
    color: #616569;
    padding: 8px 0px;
  }
  #rank-link {
    display: inline;
    font-size: 20px;
    font-weight: bold;
  }
}
@media only screen and (min-width: 0px) and (max-width: 949px) {
  .tooltiptext {
    width: 100%;
    left: 0;
  }
}

@media only screen and (min-width: 950px) and (max-width: 1150px) {
  #tablelist .detail {
    margin-left: 3%;
    margin-top: 0px;
  }

  #tablelist .paddingtb {
    width: 306px;
  }

  #tablelist .list-group-item {
    width: 650px;
  }

  .editbtn {
    margin-left: 7rem;
    margin-top: 413px;
  }

  .cardChart2 {
    height: 820px;
  }

  .detail {
    margin-left: -17rem;
    margin-top: 400px;
  }

  .details {
    margin-left: -9rem;
    margin-top: 300px;
  }

  #menu ul {
    list-style-type: none;
    overflow: hidden;
    width: 70% !important;
    margin: auto !important;
  }

  #menu li a {
    display: block;
    color: white;
    text-align: center;
    padding: 9px;
    text-decoration: none;
  }

  .tooltiptext {
    width: 75%;
    left: 12%;
  }

  #facebook::after {
    left: 28%;
  }

  #twiiter::after {
    left: 37.5%;
  }

  #pantip::after {
    left: 47%;
  }

  #news::after {
    left: 56.5%;
  }

  #youtube::after {
    left: 66.5%;
  }

  #ig::after {
    left: 76%;
  }
}

@media only screen and (min-width: 0px) and (max-width: 1200px) {
  .imgsocial {
    width: 34px;
  }
  #facebook::after {
    left: 33.5%;
  }
  #twiiter::after {
    left: 44.5%;
  }
  #pantip::after {
    left: 55.5%;
  }
  #news::after {
    left: 66.5%;
  }
  #youtube::after {
    left: 78.5%;
  }
  #ig::after {
    left: 90%;
  }
}
@media only screen and (min-width: 0px) and (max-width: 1149px) {
  #all-btn {
    width: 165px !important;
  }
  .col-lg-6 {
    margin-bottom: 50px;
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }
  .tooltiptext::after {
    display: none;
  }
}
@media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) {
  #all-btn {
    width: 165px !important;
  }
  .col-lg-6 {
    margin-bottom: 50px;
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }
  .tooltiptext::after {
    display: none;
  }
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  #overflow-page {
    overflow: hidden;
  }
  .card {
    width: 90%;
  }
  .imgsocial {
    width: 50px !important;
  }
  .col-lg-6 {
    margin-bottom: 50px;
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }
  #all-btn {
    padding-top: 15px !important;
    padding-bottom: 10px !important;
    width: 129px !important;
  }
  #facebook::after {
    left: 30%;
  }
  #twiiter::after {
    left: 40.5%;
  }
  #pantip::after {
    left: 49.5%;
  }
  #news::after {
    left: 59.5%;
  }
  #youtube::after {
    left: 69.5%;
  }
  #ig::after {
    left: 79%;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
      #app-words {
  margin-top: 20px !important;
}
  .min-h {
    min-height: 30vh;
  }
  .rounded {
    font-size: small;
  }
  .fa-print {
    font-size: 20px;
    margin-right: 5px;
  }
  .p-4 {
    padding: 5px 0px !important;
  }
  .card {
    width: 90%;
  }
  #all-btn {
    padding-top: 10px !important;
    padding-bottom: 10px !important;
    width: 54px !important;
    /* width: 269px !important; */
  }
  .tooltiptext::after {
    display: none;
  }
  .imgsocial {
    width: 50px;
  }

  #menu li {
    display: -webkit-inline-box !important;
    float: none;
  }
  #content
    > div:nth-child(3)
    > div.container
    > div
    > div
    > div
    > div:nth-child(3)
    > div:nth-child(2)
    > div
    > div
    > div.col-4 {
    flex: 0 0 60%;
    max-width: 60%;
    margin-left: -21px;
  }
  .col-10 {
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }
  #content
    > div.container
    > div:nth-child(2)
    > div.row.justify-content-center
    > div
    > div:nth-child(1)
    > div.col-2 {
    flex: 0 0 8.333333% !important;
    max-width: 8.333333% !important;
  }
}
@media print {
  #navHome {
    display: none;
  }
  #export-btn,
  .btn-add {
    display: none;
  }
  #search-input,
  #filter-input {
    display: none;
  }
  #page {
    display: none;
  }
  .piechart {
    justify-content: center;
  }
}
</style>
