<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
    <div id="content" >
      <div v-if="getToPlatform">
        <b-container fluid>
          <b-row>
            <b-col class="d-contents"><h1 class="title">Platform</h1> </b-col>
            <b-col class="text-right">
              <span class="bold md-font"> </span>
              <div v-if="getRangeStartdate" class="prt">
                ช่วงเวลาที่ดูข้อมูล : {{ ssdate }} - {{ eedate }}
              </div>
              <div class="p-4 my-0 text-sm-center text-lg-right">
                <span class="shadow-sm p-2 mb-3 bg-white rounded bold mr-2">
                  <span>Today</span>
                  {{ new Intl.DateTimeFormat("en-AU").format() }}
                </span>
                <span class="pt-3"
                  ><i class="fa fa-print align-middle" @click="print"></i
                ></span>
              </div>
              <b-button id="export-btn" v-b-modal.modal class="d-none">
                <i class="fa fa-info-circle fa-2x" />
                <b> Version info</b>
              </b-button>
              <b-modal id="modal" size="lg" centered>
                <b-container>
                  <b-row>
                    <b-col align-self="center">
                      <h1 class="popup lg-font">info</h1>
                    </b-col>
                  </b-row>
                  <b-row v-for="(data, t) in getBacklogs" :key="t">
                    <b-col>
                      <div>version : {{ data.version }}</div>
                      <div>date : {{ data.updated_date.split("T")[0] }}</div>
                      <p v-html="data.backlog"></p>
                    </b-col>
                  </b-row>
                </b-container>
              </b-modal>
            </b-col>
          </b-row>
          <section id="date-picker" class="text-rigth">
            <date-picker
              v-model="valueDate"
              type="date"
              range
              placeholder="เลือกช่วงเวลา"
              :disabled-date="date => date >= new Date()"
              value-type="YYYY-MM-DD"
              format="DD/MM/YYYY"
              @change="selectData()"
            ></date-picker>
          </section>
          <b-row align-h="end"> </b-row>
        </b-container>
        <b-container>
          <b-row style="padding-bottom: 200px">
            <Summary  class="mt-2"/>
            <Facebook />
            <Twitter />
            <Pantip />
            <News />
            <Youtube />
            <Instagram />
            <Blockdit />
            <Tiktok />
            <Threads />
          </b-row>
        </b-container>
      </div>
      <PlatFormMain v-if="!getToPlatform" />
    </div>
  </div>
</template>
<script>
import HomeNav from "@/components/HomeNav.vue";
import Facebook from "@/components/dashboard/Facebook.vue";
import Twitter from "@/components/dashboard/Twitter.vue";
import Pantip from "@/components/dashboard/Pantip.vue";
import News from "@/components/dashboard/News.vue";
import Youtube from "@/components/dashboard/Youtube.vue";
import Instagram from "@/components/dashboard/Instagram.vue";
import Blockdit from "@/components/dashboard/Blockdit.vue";
import Tiktok from "@/components/dashboard/Tiktok.vue";
import Summary from "@/components/dashboard/Summary.vue";
import Threads from "../components/dashboard/Threads.vue";
// import VueElementLoading from "vue-element-loading";
import { mapGetters } from "vuex";
import { Printd } from "printd";
import moment from "moment";
import PlatFormMain from "@/components/platform/PlatFormMain.vue";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters([
      "getLoadStatus",
      "getRangeStartdate",
      "getRangeEnddate",
      "getCraw",
      "getShowDomain",
      "getBacklogs",
      "getToPlatform",
      "getToSection"
    ]),
    ssdate() {
      var ssdate = this.sdate;
      var s = new Date(this.getRangeStartdate.slice(0, 10));
      // var e = new Date(this.getWordCloudEndDate.slice(0,10))
      ssdate = new Intl.DateTimeFormat("en-AU").format(s);
      // this.edate=new Intl.DateTimeFormat('en-AU').format(e)
      return ssdate;
    },
    eedate() {
      var eedate = this.edate;
      var e = new Date(this.getRangeEnddate.slice(0, 10));
      eedate = new Intl.DateTimeFormat("en-AU").format(e);
      return eedate;
    }
  },
  components: {
    HomeNav,
    Facebook,
    Twitter,
    Pantip,
    News,
    Youtube,
    Instagram,
    Summary,
    PlatFormMain,
    Blockdit,
    Tiktok,
    Threads
  },
  data: function() {
    return {
      domainData: "",
      sdate: "",
      edate: "",
      start_date: "",
      end_date: " ",
      valueDate: [
        moment(new Date())
          .format()
          .slice(0, 10),
        moment(new Date())
          .format()
          .slice(0, 10)
      ],
      dmy: "",
      today: "aa",
      options: [
        { id: "daily", value: "Today" },
        { id: "weekly", value: "Last week" },
        { id: "monthly", value: "1 month" }
      ],
      type_selected: "daily",
      showDetail: false,
      cssText: `
       .title{
         display:none;
       }
       .nl{
         margin-top:20px
       }
       .dp{
         display: none;
       }
       .prt{
          display: inline;
        }
       .fa{
         color:black
       }
        #export-btn{
          display:none;
        }
       #tt-sum{
         font-weight: bold;
         margin: 0px 0px 50px 0px;;
       }
       .mx-datepicker-range {
          display:none;
          }
       #facebook, #twitter{
         display: inline-block;
       }
       .col-lg-4 {
          flex: 0 0 33.333333%;
          max-width: 33.333333%;
       }
       .socialogo {
        width: 20%;
        margin-bottom: 15px;
        margin-top: 5px;
      }
      .total-all{
        width:30%;
      }
      @media print {
        .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12 {
              float: left;
        }
        .col-sm-12 {
              width: 100%;
        }
        .col-sm-11 {
              width: 91.66666667%;
        }
        .col-sm-10 {
              width: 83.33333333%;
        }
        .col-sm-9 {
              width: 75%;
        }
        .col-sm-8 {
              width: 66.66666667%;
        }
        .col-sm-7 {
              width: 58.33333333%;
        }
        .col-sm-6 {
              width: 50%;
        }
        .col-sm-5 {
              width: 41.66666667%;
        }
        .col-sm-4 {
              width: 33.33333333%;
        }
        .col-sm-3 {
              width: 25%;
        }
        .col-sm-2 {
              width: 16.66666667%;
        }
        .col-sm-1 {
              width: 8.33333333%;
        }
        .col-5 {
          flex: 0 0 88.666667%;
          max-width: 88.666667%;
        }
      }`
    };
  },
  methods: {
    selectData() {
      if (this.valueDate[0] != null) {
        console.log(this.valueDate[0], this.valueDate[1]);
        this.start_date = this.valueDate[0] + "T00:00:00";
        this.end_date = this.valueDate[1] + "T23:59:59";
        this.$store.commit("setRageStartdate", this.start_date);
        this.$store.commit("setRageEnddate", this.end_date);
        this.$store.dispatch("fetchSentimentStatDashboard", {
          start_date: this.start_date,
          end_date: this.end_date,
          domain: this.domainData
        });
        this.$store.dispatch("fetchAllstats", {
          start_date: this.start_date,
          end_date: this.end_date
        });
      } else {
        let today = moment(new Date())
          .format()
          .slice(0, 10);
        this.start_date = today + "T00:00:00";
        this.end_date = today + "T23:59:59";
        this.$store.dispatch("fetchSentimentStatDashboard", {
          start_date: this.start_date,
          end_date: this.end_date,
          domain: this.domainData
        });
        this.$store.dispatch("fetchAllstats", {
          start_date: this.start_date,
          end_date: this.end_date
        });
      }
    },
    print() {
      const d = new Printd();
      d.print(document.getElementById("content"), [this.cssText]);
    }
  },
  async created() {
    //console.log(`${this.$options.name} component succesfully mounted`);
    let today = moment(new Date())
      .format()
      .slice(0, 10);
    console.log("moment", moment(new Date()).format());
    this.start_date = today + "T00:00:00";
    this.$store.commit("setRageStartdate", this.start_date);
    this.end_date = today + "T23:59:59";
    this.$store.commit("setRageEnddate", this.end_date);
    this.$store.dispatch("fetchAllstats", {
      start_date: this.start_date,
      end_date: this.end_date
    });
    await this.$store.dispatch("fetchDomain");
    let domainName = this.getShowDomain.map(key => {
      return key.name;
    });
    this.domainData = domainName;
    this.$store.commit("setDomainArr", this.domainData);
    //console.log(domainName);
    await this.$store.dispatch("fetchSentimentStatDashboard", {
      start_date: this.start_date,
      end_date: this.end_date,
      domain: domainName
    });
  }
};
</script>

<style scoped>
.fa-print {
  font-size: 25px;
  cursor: pointer;
}
.modal-vue .modal-vue-show {
  width: 50% !important;
}
#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
}
.drop {
  color: #4c412b;
  background-color: #ede7dd;
  width: 125px;
  border-color: transparent;
}

.dropdown-toggle::after {
  margin-left: 7em;
}
.dropdown-toggle[data-v-1976f48e] {
  width: 80%;
  color: #4c412b;
  background-color: #ede7dd;
  border-color: transparent;
  cursor: pointer;
}
.btn-primary:not(:disabled):not(.disabled).active,
.btn-primary:not(:disabled):not(.disabled):active,
.show > .btn-primary.dropdown-toggle {
  color: #4c412b;
  background-color: #ede7dd;
  width: 125px;
  border-color: transparent;
}
.show > .btn-primary.dropdown-toggle:focus {
  box-shadow: none !important;
}

.btn-primary:focus {
  box-shadow: none !important;
}
#navHome {
  z-index: 1;
}

#date-picker {
  /* margin: 20px 0px 0px 0px; */
  text-align: right;
}

.popup {
  color: black;
  text-align: start;
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  #overflow-page {
    overflow: hidden;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .title {
    font-size: 5vw !important;
  }
}
.bold a {
  color: #695a3d;
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
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
  #date-picker {
    /* margin: 20px 0px 0px 0px; */
    text-align: center;
  }
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1000px) {
  .popup {
    width: 100%;
  }
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1000px) {
  .popup {
    width: 100%;
  }
}
@media only screen and (min-width: 375px) and (max-width: 815px) {
  .popup {
    width: 100%;
  }
}
</style>
