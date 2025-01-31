<template>
  <div id="content">
    <b-row align-h="center">
      <b-col class="d-contents">
        <h1 class="title">Top Influencer</h1>
      </b-col>
      <b-col>
        <div style="text-align: end" class="p-4 my-0">
          <span class="shadow-sm p-2 mb-3 bg-white rounded bold mr-2">
            <span>Today</span>
            {{ new Intl.DateTimeFormat("en-AU").format() }}
          </span>
          <span class="pt-3"
            ><i class="fa fa-print align-middle" @click="printWindow()"></i
          ></span>
        </div>
      </b-col>
    </b-row>
    <div class="ml-lg-5 mr-lg-5 ml-md-3 mr-md-3 ml-sm-3 mr-sm-3">
      <!-- <div v-for="(s,k) in socials" :key="k"> -->
      <TopUserSum class="mb-2" />
    <!-- </div> -->

      <b-row id="date-day" class="mt-0 mb-2">
        <b-col
          sm
          class="bold text-lg-left text-md-left text-sm-center h5"
          id="date-today"
          >Top Influencer Target
        </b-col>
        <b-col
          sm
          cols="auto"
          id="date-picker"
          class="text-lg-right text-md-right text-sm-center"
        >
          <section>
            <date-picker
              v-model="valueDate"
              type="date"
              range
              placeholder="เลือกช่วงเวลา"
              size="md"
              :disabled-date="(date) => date >= new Date()"
              value-type="format"
              format="YYYY-MM-DD"
              @change="checkDateRange()"
              >{{ valueDate }}</date-picker
            >
          </section>
        </b-col>
      </b-row>
    </div>
    <div id="menu">
      <ul id="menus">
        <b-row align-h="center" class="mt-lg-4 mt-md-2">
          <b-col cols="1" align-h="center" class="ml-4">
            <li v-on:click="all()" id="all">
              <a><img src="@/assets/All.png" class="imgsocial"/></a>
            </li>
          </b-col>
          <b-col cols="1" align-h="center">
            <li v-on:click="facebook()" id="fb">
              <a><img src="@/assets/Facebook.png" class="imgsocial"/></a>
            </li>
          </b-col>
          <b-col cols="1" align-h="center">
            <li v-on:click="twitter()" id="tw">
              <a><img src="@/assets/Twitter.png" class="imgsocial"/></a>
            </li>
          </b-col>
          <b-col cols="1" align-h="center">
            <li v-on:click="pantip()" id="pt">
              <a><img src="@/assets/board.png" class="imgsocial"/></a>
            </li>
          </b-col>
          <b-col cols="1" align-h="center">
            <li v-on:click="youtube()" id="yt">
              <a><img src="@/assets/Youtube.png" class="imgsocial"/></a>
            </li>
          </b-col>
          <b-col cols="1" align-h="center">
            <li v-on:click="news()" id="nw">
              <a><img src="@/assets/News.png" class="imgsocial"/></a>
            </li>
          </b-col>
          <b-col cols="1" align-h="center">
            <li v-on:click="instagram()" id="itg">
              <a><img src="@/assets/Instagram.png" class="imgsocial"/></a>
            </li>
          </b-col>
          <b-col cols="1" align-h="center">
            <li v-on:click="blockdit()" id="bd">
              <a><img src="@/assets/Blockdit.png" class="imgsocial"/></a>
            </li>
          </b-col>
          <b-col cols="1" align-h="center">
            <li v-on:click="tiktok()" id="tt">
              <a><img src="@/assets/Tiktok.png" class="imgsocial"/></a>
            </li>
          </b-col>
          <b-col cols="1" align-h="center">
            <li v-on:click="threads()" id="td">
                  <a><img src="@/assets/Threads.png" class="imgsocial"/></a>
                </li>
          </b-col>
        </b-row>
      </ul>
    </div>
    <b-container>
      <b-row align-h="center">
        <b-col lg="5">
          <v-select
            class="mt-3 mt-lg-0"
            :options="getDomainRanking"
            v-model="select_domain"
            id="search-input"
            placeholder="เลือก Domain"
          ></v-select>
        </b-col>
        <b-col lg="5" class="text-right">
          <v-select
            class="mt-3 mt-lg-0"
            :options="sentiment"
            v-model="select_stm"
            id="search-input"
            placeholder="เลือก sentiment"
            label="name"
          ></v-select>
        </b-col>
      </b-row>

      <b-row align-h="center" style="margin-top: 1em" class="pb-2">
        <b-col cols="5" align-h="center">
          <button
            :disabled="isDisabled"
            type="submit"
            class="btn submit md-font mt-3"
            @click="submitform()"
          >
            Submit
            <!-- <span id="submit" class="md-font"></span> -->
          </button>
        </b-col>
      </b-row>
    </b-container>
    <div
      v-if="getShowTopInflu"
      class="ml-lg-5 mr-lg-5 ml-md-3 mr-md-3 ml-sm-3 mr-sm-3 p-3"
    >
      <TopUserSocial :domain="getDomainTop" />
    </div>
  </div>
</template>

<script>
import "vue-select/dist/vue-select.css";
import { mapGetters } from "vuex";
import moment from "moment";
import TopUserSum from "@/components/influencer/TopUserSum.vue";
import TopUserSocial from "@/components/influencer/TopUserSocial.vue";
export default {
  components: {
    TopUserSum,
    TopUserSocial,
  },
  props: ["source"],
  data: function() {
    return {
      stmname: "",
      datatext: [],
      select_stm: { name: "All Sentiment", value: [0, 1, -1] },
      sentiment: [
        { name: "All Sentiment", value: [0, 1, -1] },
        { name: "Positive", value: 1 },
        { name: "Neutral", value: 0 },
        { name: "Negative", value: -1 },
      ],
      options: [
        { id: "day", value: "Today" },
        { id: "week", value: "Last week" },
        { id: "month", value: "1 month" },
      ],
      type_selected: "day",
      social: "news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads",
      socials:['news','twitter','facebook','youtube','tiktok','blockdit','instagram','pantip','threads'],
      nodeSize: 20,
      resizeListener: true,
      nodeLabels: true,
      linkWidth: 1,
      linkLabels: true,
      force: 900,
      linksdata: [],
      valueDate: "",
      select_domain: "",
    };
  },
  beforeCreate() {
    this.$nextTick(function() {
      this.linksdata = this.getLinksTopInfluencer;
    });
  },
  computed: {
    ...mapGetters([
      "getTopInfluencer",
      "getLinksTopInfluencer",
      "getNodesTopInfluencer",
      "getSubmitInfluencer",
      "getWordCloudStartDate",
      "getWordCloudEndDate",
      "getDomainRanking",
      "getDomainTop",
      "getSocialTop",
      "getShowTopInflu",
    ]),
    isDisabled: function() {
      var select_sc = this.social;
      select_sc = this.select_domain;
      return !select_sc;
    },
  },
  methods: {
    cutData() {
      this.getTopInfluencer = this.getTopInfluencer.slice(
        0,
        this.select_items.value
      );
      // this.$store.commit("setTopInfluencer",data)
    },
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
    checkDateRange() {
      const startDate = moment(this.valueDate[0]);
      const endDate = moment(this.valueDate[1]);

      const diffDays = endDate.diff(startDate, 'days');

      if (diffDays > 31) {
        alert('กรุณาเลือกช่วงเวลาที่ไม่เกิน 1 เดือน หรือ 31 วัน');
        this.valueDate[1] = startDate.add(31, 'days').format('YYYY-MM-DD');
      }else{
        this.selectData(); // Call your existing method
      }
    },
    selectData() {
      console.log(this.valueDate[0], this.valueDate[1]);
      if (this.valueDate[0] == null) {
        this.start_date =
          moment(new Date())
            .format()
            .slice(0, 10) + "T00:00:00";
        this.end_date =
          moment(new Date())
            .format()
            .slice(0, 10) + "T23:59:59";
      } else {
        this.start_date = this.valueDate[0] + "T00:00:00";
        this.end_date = this.valueDate[1] + "T23:59:59";
      }

      this.$store.commit("setWordCloudStartDate", this.start_date);
      this.$store.commit("setWordCloudEndDate", this.end_date);
    },
    btnlinks: function() {
      //this.submited = true;
      this.$store.commit("setSubmitInfluencer", true);
    },
    submitform: function() {
      //this.submited = true;
      this.$store.commit("setStmInflu", this.select_stm.name);
      this.$store.commit("setSubmitInfluencer", true);
      this.$store.commit("setDomainTop", this.select_domain);
      this.$store.commit("setSocialTop", this.social);
      this.$store.commit("setShowTopInflu", true);
      if (this.valueDate == "") {
        this.start_date =
          moment(new Date())
            .format()
            .slice(0, 10) + "T00:00:00";
        this.end_date =
          moment(new Date())
            .format()
            .slice(0, 10) + "T23:59:59";
      }
      this.$store.commit("setLoadTopUserPf", true);
      //http://139.59.103.67:3000/api/v2/userposts/getInfluencerTarget?
      //http://139.59.103.67:3000/api/userposts_test/getInfluencerTarget
      //http://139.59.103.67:3000/api/v2/userposts/getTopInfluencerTarket?source=
      //https://api2.cognizata.com/api/v2/userposts/getTopInfluencerTarket?source=
      var config = {
        method: "get",
        url:"https://api2.cognizata.com/api/v2/userposts/getInfluencerNormalize?source=" +
          this.social +
          "&start=" +
          this.start_date +
          "&end=" +
          this.end_date +
          "&domain=" +
          this.getDomainTop +
          "&sentiment=" +
          this.select_stm.value,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      this.axios(config)
        .then((response) => {
          this.$store.commit("setTopInfluencer", response.data);
          this.$store.commit("setLoadTopUserPf", false);
        })
        .catch(function(error) {
          console.log(error);
          this.$store.commit("setLoadTopUserPf", false);
        });
    },
    all() {
      this.social =
        "news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads";
      document.getElementById("all").style.opacity = "1";
      document.getElementById("fb").style.opacity = "0.3";
      document.getElementById("tw").style.opacity = "0.3";
      document.getElementById("pt").style.opacity = "0.3";
      document.getElementById("yt").style.opacity = "0.3";
      document.getElementById("itg").style.opacity = "0.3";
      document.getElementById("nw").style.opacity = "0.3";
      document.getElementById("bd").style.opacity = "0.3";
      document.getElementById("tt").style.opacity = "0.3";
      document.getElementById("td").style.opacity = "0.3";

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
      document.getElementById("td").style.opacity = "0.3";

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
      document.getElementById("td").style.opacity = "0.3";
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
      document.getElementById("td").style.opacity = "0.3";
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
      document.getElementById("td").style.opacity = "0.3";
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
      document.getElementById("td").style.opacity = "0.3";
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
      document.getElementById("td").style.opacity = "0.3";
    },
    blockdit() {
      this.social = "blockdit";
      document.getElementById("bd").style.opacity = "1";
      document.getElementById("tt").style.opacity = "0.3";
      document.getElementById("all").style.opacity = "0.3";
      document.getElementById("fb").style.opacity = "0.3";
      document.getElementById("tw").style.opacity = "0.3";
      document.getElementById("pt").style.opacity = "0.3";
      document.getElementById("yt").style.opacity = "0.3";
      document.getElementById("itg").style.opacity = "0.3";
      document.getElementById("nw").style.opacity = "0.3";
      document.getElementById("td").style.opacity = "0.3";
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
      document.getElementById("td").style.opacity = "0.3";
    },
    threads() {
      this.social = "threads";
      document.getElementById("td").style.opacity = "1";
      document.getElementById("bd").style.opacity = "0.3";
      document.getElementById("all").style.opacity = "0.3";
      document.getElementById("fb").style.opacity = "0.3";
      document.getElementById("tw").style.opacity = "0.3";
      document.getElementById("pt").style.opacity = "0.3";
      document.getElementById("yt").style.opacity = "0.3";
      document.getElementById("itg").style.opacity = "0.3";
      document.getElementById("nw").style.opacity = "0.3";
      document.getElementById("tt").style.opacity = "0.3";
    },
  },
  created: function() {
    this.domain = this.select_domain;
    this.$store.dispatch("fetchDomainRanking");
    // this.$nextTick(function() {
    //   this.dateFormat();
    // });
  },
  mounted() {
    this.all();
  },
};
</script>

<style scoped>
#all a {
  color: white !important;
}
.all {
  background-color: #fed16e;
  color: white;
  width: 50px;
  height: auto;
  padding-top: 0.3rem;
  padding-bottom: 0;
  border-radius: 50%;
}
.btn {
  margin-bottom: 300px !important;
}
#date-day .text-lg-left {
  margin-left: 2% !important;
}
.rounded {
  border-radius: 6px !important;
}
.fa-print {
  font-size: 25px;
  cursor: pointer;
}
.col-1 {
  flex: 0 0 8.333333%;
  max-width: 12.5%;
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
.brbr {
  margin-bottom: 15px;
}
/*#search-input {
 box-sizing: border-box;
  background-image: url("@/assets/search_icon.png");
  background-position: 14px 17px;
  background-repeat: no-repeat;
} */
input[type="range"] {
  width: -webkit-fill-available;
}
#table-rlt {
  margin-bottom: 50px;
}
#td-text {
  padding-left: 30%;
}
#table-rlt > tbody > tr > td.lg-font.linksdata {
  text-align: left !important;
}
#loading-links {
  position: unset;
  left: unset;
  top: unset;
  z-index: 1;
  width: unset;
  height: unset;
  margin: unset;
  width: 100px;
  height: 100px;
  pointer-events: none;
  overflow: hidden;
}
.fa.fa-share-alt {
  color: #4c412b;
  font-size: 25px;
  display: block;
  margin-bottom: 5px;
  margin-right: 5%;
}

.link-label {
  fill: purple;
  transform: translate(0, 0.5em);
  font-size: 0.9em;
}

#table-rlt th,
#table-rlt tr td {
  border: 2px solid #5da294;
}
#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
}

table.footer_margin {
  margin-bottom: 50px;
}
#btn-show {
  background-color: #ffd57f;
  width: 15%;
  padding: 9px;
  border-radius: 16px;
  margin-bottom: 50px;
}
#btn-show:hover {
  background-color: #f7e2a3;
}
.spinner-border {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  width: 150px;
  height: 150px;
  margin: -75px 0 0 -75px;
  width: 120px;
  height: 120px;
  pointer-events: none;
  overflow: hidden;
}

#content > div.container > div:nth-child(5) {
  padding: 0em;
}

#linkloading.linkshowloading {
  display: block;
  overflow: hidden;
}
#linkloading {
  display: none;
}
#loading-links {
  color: #4c412b;
}

ul {
  margin: 0 auto;
  width: 100%;
  text-align: center;
}
li {
  list-style: none;
  display: inline-block;
  color: white;
}

.navp {
  opacity: 0.3;
}
.navp:hover {
  opacity: 1;
}

table {
  border-collapse: collapse;
  width: 80%;
  margin: auto;
}

th,
td {
  text-align: center;
  padding: 8px;
  margin-left: 5%;
  margin-right: -9%;
}
.select2 {
  font-weight: bold;
  /*  margin-left: 9%;*/
  margin: auto;
  margin-bottom: 10px;
  font-size: 18px;
  /*  text-align: start;*/
}
.select {
  margin: auto;
  /*text-align: start;
    margin-left: 9%;*/
}
.drop {
  color: #4c412b;
  background-color: #ede7dd;
  width: 125px;
  border-color: transparent;
}

.dropdown-toggle {
  width: 80%;
  color: #4c412b;
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
  width: 80%;
  background-color: #ede7dd;
  border-color: transparent;
}

.show > .btn-primary.dropdown-toggle:focus {
  box-shadow: none !important;
}

.btn-primary:focus {
  box-shadow: none !important;
}

.submit {
  /* margin-top: 20px; */
  width: -webkit-fill-available;
  background-color: white;
  color: gray;
  border-color: #fed16e !important;
  border-radius: 9px;
  font-weight: bold;
  margin-bottom: 30px;
}

.submit:hover {
  background-color: #ddd;
}

.btn.focus,
.btn:focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0);
}

.imgsocial {
  width: 50px;
}
.imguser {
  width: 40px;
}
.imgprofile {
  border-radius: 50%;
  position: relative;
  z-index: 1;
  width: 50px;
}
.imgprofilenews {
  position: relative;
  z-index: 1;
  width: 70px;
  background-color: #dddddd;
}

#menu {
  /* padding-top: 10px; */
}

#menu ul {
  list-style-type: none;
  margin: auto;
  padding: 0;
  overflow: hidden;
  display: inline-block;
  margin-bottom: 10px;
}

#menu li {
  cursor: pointer;
}

#menu li a {
  display: block;
  color: white;
  text-align: center;
  padding: 12px;
  text-decoration: none;
}

#menu li[data-v-4a130b48] {
  display: -webkit-inline-box;
  margin: 10px;
}

#menu li:hover {
  background-color: #dddddd;
}

.node-label {
  font-size: 0.5em;
}

.loadtext {
  margin-top: 10px;
  color: #4c412b;
  margin-bottom: 70px;
}

@media only screen and (min-width: 1150px) and (max-width: 1750px) {
  .select2 {
    margin-left: -10.52%;
    margin-bottom: 10px;
    font-size: 18px;
  }
}
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .col-1 {
    flex: 0 0 8.333333%;
    max-width: 10vw;
  }
  .imgsocial {
    width: 7vw !important;
  }
  .imguser {
    width: 5vw !important;
  }
  .md-font {
    font-size: 1.5vw !important;
  }
  table {
    width: 100%;
  }
  #btn-show[data-v-17d1fff8] {
    width: 45%;
  }
  .title {
    font-size: 5vw !important;
  }
  /* .imguser[data-v-0da41e60] {
    width: 12vw !important;
  } */
}
/* ipad */
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  #navHome {
    overflow: hidden;
  }
  table {
    width: 95%;
  }
  #row-user {
    flex: 0 0 20%;
    max-width: 20%;
  }
  .md-font[data-v-17d1fff8] {
    font-size: 1.7vw !important;
  }

  .mx-datepicker-range {
    width: 320px !important;
  }
}
@media only screen and (min-width: 1024px) and (max-width: 1366px) {
}
@media only screen and (min-width: 950px) and (max-width: 1150px) {
  .date {
    margin-top: 20pt;
    margin-left: 11.5rem;
    margin-bottom: 10pt;
  }
  .d-contents {
    font-size: small !important;
  }
  .rounded {
    font-size: small;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  #menu li a {
    display: block;
    color: white;
    text-align: center;
    padding: 0px;
    text-decoration: none;
  }
  .all {
    width: 10vw;
    padding: 10px !important;
    height: 38px;
  }
  #menu li:hover {
    background-color: #dddddd00;
  }
  .submit {
    margin-bottom: 0px;
  }
  #menu ul {
    margin-bottom: 0px;
  }
  #date-day .text-lg-left {
    font-size: medium;
  }
  #date-picker {
    margin: auto;
  }
  .rounded {
    font-size: small;
  }
  .fa-print {
    font-size: 20px;
    margin-right: 5px;
  }
  .p-4 {
    padding: 15px 0px !important;
  }
  .d-contents {
    display: contents !important;
  }
  .title {
    font-size: 5vw !important;
  }
  .col-10 {
    max-width: 100%;
  }
  #table-rlt > tr:nth-child(1) > th:nth-child(2) {
    width: 15vw;
  }
  #table-rlt > tr:nth-child(1) > th:nth-child(1) {
    width: 35vw;
  }
  #table-rlt > thead > tr > th:nth-child(2) {
    width: 15vw;
  }
  #table-rlt > thead > tr > th:nth-child(1) {
    width: 35vw;
  }
  .md-font {
    font-size: 3.5vw !important;
  }
  .spinner-border {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    margin: -75px 0 0 -55px;
    width: 90px;
    height: 90px;
  }
  /* #submit {
    margin-left: -40px !important;
    margin-bottom: 20px ;
  } */
  #fb-icon {
    width: 10vw !important;
  }
  #tw-icon {
    width: 10vw !important;
  }
  table {
    width: 100%;
  }
  #content > div.container > div:nth-child(5) {
    padding: unset !important;
  }
  #content
    > div.container
    > div:nth-child(5)
    > div.col-12
    > table
    > tr
    > div
    > div:nth-child(3) {
    flex: 0 0 51%;
    max-width: 65%;
    margin-top: 7%;
  }
  #content
    > div.container
    > div:nth-child(5)
    > div.col-12
    > table
    > tr
    > div
    > div.col-3 {
    flex: 0 0 35%;
    max-width: 35%;
  }
  .imguser {
    margin-right: -60px;
    margin-top: 20px;
    margin-left: unset;
  }
  .imgsocial {
    width: 10vw !important;
    margin-left: -25px;
  }

  #content
    > div.container
    > div:nth-child(5)
    > div.col-12
    > table
    > tr
    > div
    > div:nth-child(4) {
    flex: 0 0 100%;
    max-width: 100%;
  }
  #content
    > div.container
    > div:nth-child(5)
    > div.col-12
    > table
    > tr
    > div
    > div:nth-child(4) {
    margin-top: -35px;
  }
  #score-row {
    margin-top: 15px;
  }
  #score-tag {
    position: absolute;
    left: -100px;
    margin-top: 4%;
    margin-left: 4% !important;
  }
  #score-data {
    margin-top: 4%;
  }
  #table-rlt {
    table-layout: fixed;
    width: 100%;
  }
  #row-name {
    margin-bottom: 20px;
  }
  .linksdata {
    font-size: 3.5vw !important;
  }
  #btn-show[data-v-0da41e60] {
    width: 60%;
  }
  .fa.fa-share-alt {
    display: unset;
  }
  .mx-datepicker-range {
    width: 190px;
  }
}

@media only screen and (max-width: 500px) and (min-width: 400px) {
  .imguser[data-v-17d1fff8] {
    margin-left: -107px;
    margin-top: 5px;
    margin-bottom: 20px;
  }
}

@media only screen and (min-width: 700px) and (max-width: 800px) {
  table {
    width: 100%;
  }
}
@media only screen and (min-width: 500px) and (max-width: 590px) {
  table {
    width: 100%;
  }
  .imgsocial {
    width: 8vw !important;
  }
  .imguser[data-v-17d1fff8] {
    margin-right: 0;
    margin-top: 0;
    margin-left: -40px;
  }
}
@media only screen and (min-width: 375px) and (max-width: 812px) {
  .mx-datepicker-range {
    width: 190px;
  }
}
</style>
