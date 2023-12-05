<template>
  <div id="content" >
    <back-to-top bottom="50px" right="50px">
      <button type="button" class="btn btn-to-top">
        <i class="fa fa-chevron-up"></i>
      </button>
    </back-to-top>
    <b-row>
      <b-col class="d-contents"><h1 class="title">Ranking</h1> </b-col>
      <b-col class="text-right">
        <span class="bold md-font"> </span>
        <div class="p-4 my-0 text-sm-center text-lg-right">
          <span class="shadow-sm p-2 mb-3 bg-white rounded bold mr-2">
            <span>Today</span>
            {{ new Intl.DateTimeFormat("en-AU").format() }}
          </span>
          <span class="pt-3"
            ><i class="fa fa-print align-middle" @click="printWindow"></i
          ></span>
        </div>
      </b-col>
    </b-row>
    <b-container>
      <b-row>
        <b-col lg="6">
          <span class="mt-3 mb-3 box-domain">
            <div id="menu">
              <ul id="menus">
                <li v-on:click="all()" id="all">
                  <a> <a class="all"> All </a></a>
                </li>
                <li v-on:click="facebook()" id="fb">
                  <a><img src="@/assets/Facebook.png" class="imgsocial"/></a>
                </li>
                <li v-on:click="twitter()" id="tw">
                  <a><img src="@/assets/Twitter.png" class="imgsocial"/></a>
                </li>
                <li v-on:click="pantip()" id="pt">
                  <a><img src="@/assets/Pantip.png" class="imgsocial"/></a>
                </li>
                <li v-on:click="youtube()" id="yt">
                  <a><img src="@/assets/Youtube.png" class="imgsocial"/></a>
                </li>
                <li v-on:click="instagram()" id="itg">
                  <a><img src="@/assets/Instagram.png" class="imgsocial"/></a>
                </li>
                <li v-on:click="news()" id="nw">
                  <a><img src="@/assets/News.png" class="imgsocial"/></a>
                </li>
                <li v-on:click="blockdit()" id="bd">
                  <a><img src="@/assets/Blockdit.png" class="imgsocial"/></a>
                </li>
                <li v-on:click="tiktok()" id="tt">
                  <a><img src="@/assets/Tiktok.png" class="imgsocial"/></a>
                </li>
              </ul>
            </div>
<!-- {{ getShowSubDomainRanking }} -->
            <v-select
              class="mt-2 mb-3"
              :options="getDomainRanking"
              v-model="select_domain"
              @input="subdomain"
              id="search-input"
              placeholder="เลือก Domain"
            ></v-select>
            <!-- multi-select -->
            <v-select
              multiple
              :options="getShowSubDomainRanking"
              v-model="select_subdomain"
              id="search-input"
              class="subdomain"
              :disabled="isDisabled"
              placeholder="เลือก SubDomain"
            ></v-select>

            <!-- <v-select
              :options="getShowSubDomainRanking"
              v-model="select_subdomain"
              id="search-input"
              class="subdomain"
              :disabled="isDisabled"
              placeholder="เลือก SubDomain"
            ></v-select> -->

            <section id="date-picker" class="mt-3 mb-3">
              <date-picker
                v-model="valueDate"
                type="date"
                range
                placeholder="เลือกช่วงเวลา"
                size="md"
                :disabled-date="(date) => date >= new Date()"
                value-type="format"
                format="YYYY-MM-DD"
                @change="selectData()"
                >{{ valueDate }}</date-picker
              >
            </section>
          </span>
        </b-col>
        <b-col lg="6">
          <span class="mt-3 mb-3 box-domain box-r">
            <b-row class="text-left">
              <b-col cols="4"><span class="h5 mr-3"> Social </span></b-col>
              <b-col cols="8">
                <span>
                  <img
                    v-if="social == 'facebook'"
                    src="@/assets/Facebook.png"
                    class="imgsocial"
                  />
                  <img
                    v-else-if="social == 'twitter'"
                    src="@/assets/Twitter.png"
                    class="imgsocial"
                  />
                  <img
                    v-else-if="social == 'pantip'"
                    src="@/assets/Pantip.png"
                    class="imgsocial"
                  />
                  <img
                    v-else-if="social == 'youtube'"
                    src="@/assets/Youtube.png"
                    class="imgsocial"
                  />
                  <img
                    v-else-if="social == 'instagram'"
                    src="@/assets/Instagram.png"
                    class="imgsocial"
                  />
                  <img
                    v-else-if="social == 'news'"
                    src="@/assets/News.png"
                    class="imgsocial"
                  />
                  <img
                    v-else-if="social == 'blockdit'"
                    src="@/assets/Blockdit.png"
                    class="imgsocial"
                  />
                  <img
                    v-else-if="social == 'tiktok'"
                    src="@/assets/Tiktok.png"
                    class="imgsocial"
                  />
                  <span class="all allsel" v-else> All </span>
                </span>
              </b-col>
            </b-row>

            <b-row class="text-left mt-3">
              <b-col md="4" lg="4"><span class="h5 mr-3"> Domain </span></b-col>
              <b-col md="8" lg="8">
                <span class="box-small" v-if="select_domain">
                  {{ select_domain }}</span
                >
                <span class="box-small gtxt" v-else> กรุณาเลือก domain</span>
              </b-col>
            </b-row>

            <b-row class="text-left mt-3">
              <b-col md="4" lg="4"
                ><span class="h5 mr-3"> SubDomain </span></b-col
              >
              <b-col md="8" lg="8">
                <span class="box-small" v-if="select_subdomain"
                  >{{ select_subdomain.toString() }}
                </span>
                <span class="box-small gtxt" v-else> กรุณาเลือก subdomain</span>
              </b-col>
            </b-row>

            <b-row class="text-left mt-3">
              <b-col md="4" lg="4"><span class="h5 mr-3"> Date </span></b-col>
              <b-col md="8" lg="8">
                <span class="box-small" v-if="valueDate">
                  {{ valueDate[0] }} - {{ valueDate[1] }}</span
                >
                <span class="box-small gtxt" v-else> กรุณาเลือกช่วงเวลา</span>
              </b-col>
            </b-row>

            <b-row class="text-center w-100">
              <b-col>
                <button
                  :disabled="isDisabled"
                  type="submit"
                  class="btn submit md-font"
                  @click="submitform()"
                >
                  Submit
                </button>
              </b-col>
            </b-row>
          </span>
        </b-col>
      </b-row>
      <div>
        <RankingTab v-show="getSubmitRanking" />
      </div>
    </b-container>
  </div>
</template>

<script>
import "vue-select/dist/vue-select.css";
import { mapGetters } from "vuex";
import moment from "moment";
// import ColumnChart from "../chart/ColumnChart.vue";

import RankingTab from "@/components/ranking/RankingTab.vue";

export default {
  components: { RankingTab },

  data: function() {
    return {
      dmy: "",
      options: [
        { id: "day", value: "Today" },
        { id: "week", value: "Last week" },
        { id: "month", value: "1 month" },
      ],
      type_selected: "day",
      select_domain: "",
      select_subdomain: "",
      objectsstatname: [],
      tab_selected_detail_social: "all",
      // tab_selected_social: "all",
      selected: 0,
      social: "facebook,twitter,news,pantip,instagram,youtube",
      datearrs: null,
      datearre: null,
      valueDate: [this.datearre, this.datearrs],
    };
  },
  computed: {
    isDisabled: function() {
      var select_dm = this.select_domain;
      return !select_dm;
    },
    ...mapGetters([
      "getWordCloudStartDate",
      "getWordCloudEndDate",
      "getSubDomainRanking",
      "getDomainRanking",
      "getShowSubDomainRanking",
      "getSubmitRanking",
      "getRanking",
      "getSocial",
      "getShowRankTab",
      "getToSection",
    ]),
  },
  methods: {
    printWindow: function() {
      try {
        window.print();
      } catch (err) {
        console.log(err);
      }
    },
    onOptionsChange: function() {
      this.$store.commit("changeDataChoice", { choice: this.type_selected });
    },
    selectData() {
      // console.log(this.valueDate[0], this.valueDate[1]);
      if (this.valueDate[0] == null) {
        var todaye =
          moment(new Date())
            .format()
            .slice(0, 10) + "T23:59:59";
        var todayend = new Date(todaye);
        todayend.setDate(todayend.getDate() - 6);
        this.start_date =
          moment(todayend)
            .format()
            .slice(0, 10) + "T00:00:00";
        this.end_date =
          moment(new Date())
            .format()
            .slice(0, 10) + "T23:59:59";

        //  var todaye = moment(new Date()).format().slice(0, 10) + "T23:59:59";
        // var todayend = new Date(todaye);
        // todayend.setDate(todayend.getDate() - 6);
        // var todays = moment(todayend).format().slice(0, 10) + "T00:00:00";
      } else {
        this.start_date = this.valueDate[0] + "T00:00:00";
        this.end_date = this.valueDate[1] + "T23:59:59";
      }

      this.$store.commit("setWordCloudStartDate", this.start_date);
      this.$store.commit("setWordCloudEndDate", this.end_date);

      // this.$store.dispatch("fetchSentimentStat", {
      //   start_date: this.start_date,
      //   end_date: this.end_date,
      // });
    },
    dateFormat() {
      var d = new Date().toLocaleDateString();
      var dd = d.split("/");
      this.dmy = dd[1] + "/" + dd[0] + "/" + dd[2];
      return this.dmy;
    },
    submit() {
      this.showLoading();
      this.selected = 0;
      this.type = this.selected2;
      this.getranking();
    },
    subdomain: function() {
      this.select_subdomain = "";
      this.$store.dispatch("fetchSubDomainRanking", {
        domain: this.select_domain,
      });
    },
    submitform: function() {
      //this.submited = true;
      this.$store.commit("setArrDateRank", this.valueDate);
      this.$store.commit("setDataTrend", []);
      this.$store.commit("setShowRankTab", true);
      this.$store.commit("setShowWordList", true);
      this.$store.commit("setSubmitRanking", true);
      this.$store.commit("setObjectName", this.select_domain);
      this.$store.commit("setSubDomain", this.select_subdomain);
      this.$store.commit("setSocial", this.social);
      if (this.valueDate == "") {
        var todaye =
          moment(new Date())
            .format()
            .slice(0, 10) + "T23:59:59";
        var todayend = new Date(todaye);
        todayend.setDate(todayend.getDate() - 6);
        var todays =
          moment(todayend)
            .format()
            .slice(0, 10) + "T00:00:00";

        this.$store.dispatch("fetchRanking", {
          start_date: todays,
          end_date: todaye,
          domain: this.select_domain,
          source: this.social,
          rankingtype: "object",
          subdomain: this.select_subdomain,
        });
        this.$store.commit("setWordCloudStartDate", todays);
        this.$store.commit("setWordCloudEndDate", todaye);
      } else {
        this.$store.dispatch("fetchRanking", {
          start_date: this.getWordCloudStartDate,
          end_date: this.getWordCloudEndDate,
          domain: this.select_domain,
          source: this.social,
          rankingtype: "object",
          subdomain: this.select_subdomain,
        });
      }
    },
    all() {
      this.social = "facebook,twitter,news,pantip,instagram,youtube";
      document.getElementById("all").style.opacity = "1";
      document.getElementById("fb").style.opacity = "0.3";
      document.getElementById("tw").style.opacity = "0.3";
      document.getElementById("pt").style.opacity = "0.3";
      document.getElementById("yt").style.opacity = "0.3";
      document.getElementById("itg").style.opacity = "0.3";
      document.getElementById("nw").style.opacity = "0.3";
      document.getElementById("bd").style.opacity = "0.3";
      document.getElementById("tt").style.opacity = "0.3";
    },
    facebook() {
      this.social = "facebook";
      document.getElementById("fb").style.opacity = "1";
      document.getElementById("all").style.opacity = "0.3";
      document.getElementById("tw").style.opacity = "0.3";
      document.getElementById("pt").style.opacity = "0.3";
      document.getElementById("yt").style.opacity = "0.3";
      document.getElementById("itg").style.opacity = "0.3";
      document.getElementById("nw").style.opacity = "0.3";
      document.getElementById("bd").style.opacity = "0.3";
      document.getElementById("tt").style.opacity = "0.3";
    },
    twitter() {
      this.social = "twitter";
      document.getElementById("tw").style.opacity = "1";
      document.getElementById("all").style.opacity = "0.3";
      document.getElementById("fb").style.opacity = "0.3";
      document.getElementById("pt").style.opacity = "0.3";
      document.getElementById("yt").style.opacity = "0.3";
      document.getElementById("itg").style.opacity = "0.3";
      document.getElementById("nw").style.opacity = "0.3";
      document.getElementById("bd").style.opacity = "0.3";
      document.getElementById("tt").style.opacity = "0.3";
    },
    pantip() {
      this.social = "pantip";
      document.getElementById("pt").style.opacity = "1";
      document.getElementById("all").style.opacity = "0.3";
      document.getElementById("fb").style.opacity = "0.3";
      document.getElementById("tw").style.opacity = "0.3";
      document.getElementById("yt").style.opacity = "0.3";
      document.getElementById("itg").style.opacity = "0.3";
      document.getElementById("nw").style.opacity = "0.3";
      document.getElementById("bd").style.opacity = "0.3";
      document.getElementById("tt").style.opacity = "0.3";
    },
    youtube() {
      this.social = "youtube";
      document.getElementById("yt").style.opacity = "1";
      document.getElementById("all").style.opacity = "0.3";
      document.getElementById("fb").style.opacity = "0.3";
      document.getElementById("tw").style.opacity = "0.3";
      document.getElementById("pt").style.opacity = "0.3";
      document.getElementById("itg").style.opacity = "0.3";
      document.getElementById("nw").style.opacity = "0.3";
      document.getElementById("bd").style.opacity = "0.3";
      document.getElementById("tt").style.opacity = "0.3";
    },
    instagram() {
      this.social = "instagram";
      document.getElementById("itg").style.opacity = "1";
      document.getElementById("all").style.opacity = "0.3";
      document.getElementById("fb").style.opacity = "0.3";
      document.getElementById("tw").style.opacity = "0.3";
      document.getElementById("pt").style.opacity = "0.3";
      document.getElementById("yt").style.opacity = "0.3";
      document.getElementById("nw").style.opacity = "0.3";
      document.getElementById("bd").style.opacity = "0.3";
      document.getElementById("tt").style.opacity = "0.3";
    },
    news() {
      this.social = "news";
      document.getElementById("nw").style.opacity = "1";
      document.getElementById("all").style.opacity = "0.3";
      document.getElementById("fb").style.opacity = "0.3";
      document.getElementById("tw").style.opacity = "0.3";
      document.getElementById("pt").style.opacity = "0.3";
      document.getElementById("yt").style.opacity = "0.3";
      document.getElementById("itg").style.opacity = "0.3";
      document.getElementById("bd").style.opacity = "0.3";
      document.getElementById("tt").style.opacity = "0.3";
    },
    blockdit() {
      this.social = "blockdit";
      document.getElementById("bd").style.opacity = "1";
      document.getElementById("all").style.opacity = "0.3";
      document.getElementById("fb").style.opacity = "0.3";
      document.getElementById("tw").style.opacity = "0.3";
      document.getElementById("pt").style.opacity = "0.3";
      document.getElementById("yt").style.opacity = "0.3";
      document.getElementById("itg").style.opacity = "0.3";
      document.getElementById("nw").style.opacity = "0.3";
      document.getElementById("tt").style.opacity = "0.3";
    },
    tiktok() {
      this.social = "tiktok";
      document.getElementById("tt").style.opacity = "1";
      document.getElementById("bd").style.opacity = "0.3";
      document.getElementById("all").style.opacity = "0.3";
      document.getElementById("fb").style.opacity = "0.3";
      document.getElementById("tw").style.opacity = "0.3";
      document.getElementById("pt").style.opacity = "0.3";
      document.getElementById("yt").style.opacity = "0.3";
      document.getElementById("itg").style.opacity = "0.3";
      document.getElementById("nw").style.opacity = "0.3";
    },
  },
  created: function() {
    this.domain = this.select_domain;
    this.$store.dispatch("fetchDomainRanking");

    this.$nextTick(function() {
      this.dateFormat();
      var currentTime = new Date();
      currentTime.setDate(currentTime.getDate() - 6);
      this.datearrs = moment(new Date())
        .format()
        .slice(0, 10);
      this.datearre = moment(currentTime)
        .format()
        .slice(0, 10);
      var todaye =
        moment(new Date())
          .format()
          .slice(0, 10) + "T23:59:59";
      var todayend = new Date(todaye);
      todayend.setDate(todayend.getDate() - 6);
      var todays =
        moment(todayend)
          .format()
          .slice(0, 10) + "T00:00:00";
      this.$store.commit("setWordCloudStartDate", todays);
      this.$store.commit("setWordCloudEndDate", todaye);
      this.valueDate = [this.datearre, this.datearrs];
    });
  },
  destroyed() {
    this.$store.commit("setShowRankTab", false);
  },
};
</script>

<style scoped>
.vue-back-to-top {
  right: 65px !important;
}
.btn-to-top {
  width: 60px;
  height: 60px;
  padding: 10px 16px;
  border-radius: 50%;
  font-size: 22px;
  line-height: 22px;
  background-color: #fed16e;
  border-color: #fed16e;
  color: #fff;
  box-shadow: 2px 1px 4px #888888;
}
.btn-to-top:hover {
  background-color: #f7c24e;
  border-color: #f7c24e;
  color: #fff;
}
.fa-print {
  font-size: 25px;
  cursor: pointer;
}
#date-picker {
  width: fit-content;
}
.gtxt {
  color: #808084;
}
.box-small {
  line-height: 28px;
  padding: 2px 10px;
  border-radius: 7px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
h5 {
  font-size: larger;
}
.allsel {
  display: block;
  color: white;
  text-align: center;
  padding: 8px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.box-domain {
  width: 100%;
  height: auto;
  min-height: 270px;
  padding: 20px 20px;
  border-radius: 7px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  display: grid;
  align-items: center;
  justify-content: center;
}
.box-r {
  display: block !important;
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
#switch {
  display: -webkit-inline-box;
  margin-bottom: 20px;
}
.custom-switch.b-custom-control-lg,
.input-group-lg .custom-switch {
  padding-left: 3.8125rem;
}
/* #search-input {
  box-sizing: border-box;
  background-image: url("@/assets/search_icon.png");
  background-position: 14px 17px;
  background-repeat: no-repeat;
  padding: 7px 20px 7px 45px;
  border: none;
  background-color: #ede7dd;
  text-align: center;
  width: 95%;
  border-radius: 7px;
  margin-bottom: 45px;
}
#search-input .vs--disabled .vs__clear,
.vs--disabled .vs__dropdown-toggle,
.vs--disabled .vs__open-indicator,
.vs--disabled .vs__search,
.vs--disabled .vs__selected {
  background-color: #ede7dd !important;
} */

#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
}

.circle-size {
  padding-left: 1.2rem;
  padding-right: 1.1rem;
}

.imgsocial {
  width: 40px;
}

.gray {
  color: #543506d1 !important;
}
#all a {
  color: white !important;
}
.all {
  background-color: #fed16e;
  color: white;
  width: 40px;
  padding-top: 0.3rem;
  padding-bottom: 0;
  border-radius: 50%;
}

.nav {
  pointer-events: none;
  opacity: 0.3;
}

#menu ul {
  list-style-type: none;
  margin: auto;
  padding: 0;
  overflow: hidden;
  display: inline;
  margin-bottom: 30px;
}

#menu li {
  cursor: pointer;
}

#menu li a {
  display: block;
  color: white;
  text-align: center;
  padding: 7px;
  text-decoration: none;
}

#menu li {
  display: -webkit-inline-box;
  margin: 0px;
}

#menu li:hover {
  background-color: #dddddd;
}

.dropdown-toggle {
  color: #4c412b;
  width: 80%;
  background-color: #ede7dd;
  border-color: transparent;
  cursor: pointer;
}

.dropdown-toggle::after {
  margin-left: 7em;
}

.btn-primary:not(:disabled):not(.disabled).active,
.btn-primary:not(:disabled):not(.disabled):active,
.show > .btn-primary.dropdown-toggle {
  color: #4c412b;
  background-color: #ede7dd;
  width: 80%;
  border-color: transparent;
}

.show > .btn-primary.dropdown-toggle:focus {
  box-shadow: none !important;
}

.btn-primary:focus {
  box-shadow: none !important;
}

.submit {
  margin-top: 20px;
  width: auto;
  background-color: white;
  color: gray;
  border-color: #fed16e !important;
  border-radius: 9px;
  font-weight: bold;
  cursor: pointer;
}

.submit:hover {
  background-color: #ddd;
}

.detail {
  margin-left: -17rem;
  margin-top: 400px;
}

.number {
  margin-left: -0.4rem;
  font-weight: bold;
}
.word {
  margin-left: -0.2rem;
  font-weight: bold;
}
.word:hover {
  color: #543506fc !important ;
}
a {
  color: #543506fc !important;
}
.pointer {
  cursor: pointer;
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

.paddingtb {
  padding-left: 11.3rem;
}

.list-group {
  width: 600px;
  margin: auto;
  margin-top: 30px;
}

.text-end {
  text-align: end;
}

.text-start {
  text-align: start;
}

.sub-doc {
  font-size: 12pt;
}

.yellow {
  color: #8b5f3d;
}

.cardChart {
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  margin: auto;
  margin-top: 3rem;
  margin-bottom: 3rem;
}

.tablename {
  font-size: 20pt;
  margin-bottom: 20pt;
  font-weight: bold;
}

.date {
  text-align: end;
}

.margin-10 {
  margin-top: 10px;
}

.margin-25 {
  margin-top: 25pt;
}

.top10 {
  font-size: 18pt;
  font-weight: bold;
}

.datetxt {
  font-size: 14pt;
}
.col-chart {
  margin-left: 3rem;
}

#chart-list .list-group {
  width: 350px;
  margin-left: 10rem;
  margin-top: 30px;
  padding-bottom: 3rem;
}

.col-sm-3 {
  margin: 0;
  padding: 0;
}

.legend {
  margin-top: 1.8rem;
  font-size: 11pt;
  font-weight: bold;
  color: black;
}

.legend a {
  color: #8b5f3d;
  margin-left: 3px;
}

.legend-bottom {
  padding-left: 250px;
  color: black;
  padding-bottom: 20px;
}

.legend-bottom span {
  margin-left: 30px;
}

.legend-bottom span img {
  width: 30px;
}

.mx-input {
  display: inline-block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 34px;
  padding: 6px 30px;
  padding-left: 10px;
  font-size: 14px;
  line-height: 1.4;
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
  box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
}

.mx-icon-calendar,
.mx-icon-clear {
  position: absolute;
  top: 50%;
  right: 8px;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 16px;
  line-height: 1;
  color: rgba(0, 0, 0, 0.5);
  vertical-align: middle;
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  #overflow-page {
    overflow: hidden;
  }
  #menu li a[data-v-4a130b48] {
    padding: 5px;
  }
  .all {
    padding: 5px !important;
  }
}
@media only screen and (min-width: 0px) and (max-width: 990px) {
  .box-domain {
    width: 100%;
    height: auto;
  }
}
@media only screen and (min-width: 950px) and (max-width: 1150px) {
  #menu li a {
    display: block;
    color: white;
    text-align: center;
    padding: 8px;
    text-decoration: none;
  }

  #menu ul {
    list-style-type: none;
    margin: auto;
    padding: 0;
    overflow: hidden;
    width: auto;
    margin-bottom: 30px;
  }

  #menu li[data-v-4a130b48] {
    float: left;
    width: auto;
  }

  #chart-list .list-group {
    width: 350px;
    margin-left: -15rem;
    margin-top: 350px;
  }

  #bar-chart .col-chart {
    margin-left: 0.9rem;
  }
  #overflow-page {
    overflow: hidden;
  }
}

@media only screen and (min-width: 0px) and (max-width: 600px) {
  .box-domain {
    padding: 20px 13px;
  }
  .p-4 {
    padding-left: 4px !important;
    padding-right: 4px !important;
  }
  .btn-to-top {
    width: 47px;
    height: 47px;
    padding: 10px 10px;
    border-radius: 50%;
    font-size: 22px;
    line-height: 22px;
  }
  .vue-back-to-top {
    bottom: 50px !important;
    right: 17px !important;
  }
  .all {
    height: 30px;
    width: 30px;
  }
  .imgsocial {
    width: 30px !important;
  }
  #menu li a {
    padding: 2px;
  }
  .d-contents {
    display: contents !important;
  }
  .fa-print {
    font-size: 20px;
    margin-right: 5px;
  }
  #overflow-page {
    overflow: hidden;
  }
  #rank-col {
    flex: 0 0 100%;
    max-width: 100%;
  }
  #content
    > div.container
    > div:nth-child(2)
    > div:nth-child(2)
    > div
    > div
    > div.row.justify-content-center
    > div {
    margin: 5px;
  }
  .tablename {
    font-size: 14pt;
  }
  #content
    > div.container
    > div:nth-child(2)
    > div:nth-child(2)
    > div
    > div
    > div:nth-child(1)
    > div:nth-child(1) {
    width: 100vw;
  }
  .col {
    width: 100vw;
  }
  .col-5 {
    flex: 0 0 80%;
    max-width: 80%;
  }
  .title {
    font-size: 5vw !important;
  }
  .mx-input {
    display: inline-block;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 40%;
    height: 34px;
    padding: 6px 30px;
    padding-left: 10px;
    font-size: 14px;
    line-height: 1.4;
    color: #555;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
    box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
    margin-right: 50%;
  }
  .mx-icon-calendar,
  .mx-icon-clear {
    position: absolute;
    top: 50%;
    right: 8px;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    font-size: 16px;
    line-height: 1;
    color: rgba(0, 0, 0, 0.5);
    vertical-align: middle;
    margin-right: 55%;
  }
  .imgsocial {
    width: 40px;
  }
  #menu li {
    display: -webkit-inline-box;
    margin: 0px !important;
  }
  .mx-datepicker-range {
    width: 270px;
  }
  .rounded {
    font-size: small;
  }
}
@media print {
  #export-btn {
    display: none;
  }
}
</style>
