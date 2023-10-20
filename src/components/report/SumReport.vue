<template>
  <div>
    <b-row class="mt-2 mb-2 mx-auto">
      <b-col lg="6" sm="12">
        <b-card class="card-stat mb-3  text-left mt-3">
          <b-row cols="auto" align-h="center">
            <vue-element-loading
              :active="getLoadTotalReport"
              size="80"
              background-color="rgba(255, 255, 255, 0.3)"
              color="#b6ac9a"
            />
            <b-col cols="auto">
              <div>
                <div class=" px-3">Users</div>
                <div class="h5 px-3">
                  {{ getListTargetReport.length | numFormat }}
                </div>
              </div>
            </b-col>
            <b-col cols="auto">
              <div>
                <div class=" px-3">Posts</div>
                <div class="h5 px-3">
                  {{ getTotalStatReport.totalPost | numFormat }}
                </div>
              </div>
            </b-col>
            <b-col cols="auto">
              <div>
                <div class=" px-3">Engagement</div>
                <div class="h5 px-3">
                  {{ getTotalStatReport.engagement | numFormat }}
                </div>
              </div>
            </b-col>
          </b-row>
        </b-card>
        <b-card class="card-all">
          <div class="text-left px-3">Total Users</div>

          <ChartReport />
        </b-card>
      </b-col>
      <b-col lg="6" sm="12">
        <BarChart />
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" sm="12" lg="6">
        <!-- <ColChart /> -->
      </b-col>
    </b-row>
    <b-row class="mb-5 mx-auto">
      <vue-element-loading
        :active="getLoadReport"
        size="80"
        background-color="rgba(255, 255, 255, 0.3)"
        color="#b6ac9a"
      />

      <b-col>
        <li v-on:click="all()">
          <!-- <img src="@/assets/Facebook.png" class="socialogo m-auto pb-2" /> -->
          <b-card id="all"
            ><div class="h5">All</div>
            <div
              id="fb1"
              class="m-auto small"
              v-if="tabsMonitor == 'tabProfile'"
            >
              {{ getListTargetReport.length | numFormat }}
              Users
            </div>
          </b-card>
        </li>
      </b-col>
      <b-col>
        <li v-on:click="facebook()">
          <!-- <img src="@/assets/Facebook.png" class="socialogo m-auto pb-2" /> -->
          <b-card id="fb"
            ><div class="h5">Facebook</div>
            <div
              id="fb1"
              class="m-auto small"
              v-if="tabsMonitor == 'tabProfile'"
            >
              {{ getSumReport.fb | numFormat }}
              Users
            </div>
          </b-card>
        </li>
      </b-col>

      <b-col>
        <li v-on:click="twitter()">
          <!-- <img src="@/assets/Twitter.png" class="socialogo m-auto pb-2" /> -->
          <b-card id="tw"
            ><div class="h5">Twitter</div>
            <div
              id="tw1"
              class="m-auto small"
              v-if="tabsMonitor == 'tabProfile'"
            >
              {{ getSumReport.tw | numFormat }}
              Users
            </div>
          </b-card>
        </li>
      </b-col>

      <b-col>
        <li v-on:click="pantip()">
          <!-- <img src="@/assets/Pantip.png" class="socialogo m-auto pb-2" /> -->
          <b-card id="pt">
            <div class="h5">Pantip</div>
            <div
              id="pt1"
              class="m-auto small"
              v-if="tabsMonitor == 'tabProfile'"
            >
              {{ getSumReport.pt | numFormat }}
              Users
            </div>
          </b-card>
        </li>
      </b-col>

      <b-col>
        <li v-on:click="news()">
          <!-- <img src="@/assets/News.png" class="socialogo m-auto pb-2" /> -->
          <b-card id="nw">
            <div class="h5">News</div>
            <div
              id="nw1"
              class="m-auto small"
              v-if="tabsMonitor == 'tabProfile'"
            >
              {{ getSumReport.nw | numFormat }}
              Users
            </div>
          </b-card>
        </li>
      </b-col>

      <b-col>
        <li v-on:click="youtube()">
          <!-- <img src="@/assets/Youtube.png" class="socialogo m-auto pb-2" /> -->
          <b-card id="yt">
            <div class="h5">Youtube</div>
            <div
              id="yt1"
              class="m-auto small"
              v-if="tabsMonitor == 'tabProfile'"
            >
              {{ getSumReport.yt | numFormat }}
              Users
            </div>
          </b-card>
        </li>
      </b-col>

      <b-col>
        <li v-on:click="instagram()">
          <!-- <img src="@/assets/Instagram.png" class="socialogo m-auto pb-2" /> -->
          <b-card id="itg">
            <div class="h5">Instagram</div>
            <div
              id="itg1"
              class="m-auto small"
              v-if="tabsMonitor == 'tabProfile'"
            >
              {{ getSumReport.ig | numFormat }}
              Users
            </div>
          </b-card>
        </li>
      </b-col>

      <b-col>
        <li v-on:click="blockdit()">
          <!-- <img src="@/assets/Instagram.png" class="socialogo m-auto pb-2" /> -->
          <b-card id="bd">
            <div class="h5">Blockdit</div>
            <div
              id="itg1"
              class="m-auto small"
              v-if="tabsMonitor == 'tabProfile'"
            >
              {{ getSumReport.bd | numFormat }}
              Users
            </div>
          </b-card>
        </li>
      </b-col>

      <b-col>
        <li v-on:click="tiktok()">
          <!-- <img src="@/assets/Instagram.png" class="socialogo m-auto pb-2" /> -->
          <b-card id="tt">
            <div class="h5">Tiktok</div>
            <div
              id="itg1"
              class="m-auto small"
              v-if="tabsMonitor == 'tabProfile'"
            >
              {{ getSumReport.tt | numFormat }}
              Users
            </div>
          </b-card>
        </li>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ChartReport from "@/components/report/ChartReport.vue";
import BarChart from "@/components/chart/BarChart.vue";
// import ColChart from "@/components/chart/DomainColumnChart.vue";
export default {
  components: { 
    ChartReport, 
    BarChart,
    //  ColChart 
     },
  watch: {
    getDateReport() {
      this.getApiTotalStat();
      this.all();
    },
  },
  props: {
    tabsMonitor: {
      type: String,
    },
  },
  data() {
    return {
      social: "",
    };
  },
  computed: {
    ...mapGetters([
      "getItemsProfile",
      "getSumMonitor",
      "getSocialMo",
      "getListMonitor",
      "getListTargetReport",
      "getSumReport",
      "getLoadReport",
      "getDateReport",
      "getTotalStatReport",
      "getLoadTotalReport",
    ]),
  },
  methods: {
    all() {
      this.social = "";
      this.$store.commit("setListReport", this.getListTargetReport);
      this.$store.commit("setCurrentPage", 1);
      document.getElementById("all").style.background = "#c3d3e761";
      document.getElementById("tw").style.background = "#ffffff";
      document.getElementById("fb").style.background = "#ffffff";
      document.getElementById("pt").style.background = "#ffffff";
      document.getElementById("yt").style.background = "#ffffff";
      document.getElementById("itg").style.background = "#ffffff";
      document.getElementById("bd").style.background = "#ffffff";
      document.getElementById("nw").style.background = "#ffffff";
      document.getElementById("tt").style.background = "#ffffff";
    },
    twitter() {
      this.social = "twitter";
      var datas = this.getListTargetReport;
      if (this.tabsMonitor == "tabProfile") {
        const found = datas.filter((element) => element.source === "twitter");
        // console.log({
        //   targetlist: found,
        //   summary: this.getListMonitor.summary,
        //   hashtaglist: this.getListMonitor.hashtaglist,
        // });
        this.$store.commit("setListReport", found);
      } else {
        const found = this.getListMonitor.hashtaglist.filter(
          (element) => element.source === "twitter"
        );
        this.$store.commit("setListReport", {
          hashtaglist: found,
          summary: this.getListMonitor.summary,
          targetlist: this.getListTargetReport,
        });
      }
      this.$store.commit("setCurrentPage", 1);
      document.getElementById("all").style.background = "#ffffff";
      document.getElementById("tw").style.background = "#c3d3e761";
      document.getElementById("fb").style.background = "#ffffff";
      document.getElementById("pt").style.background = "#ffffff";
      document.getElementById("yt").style.background = "#ffffff";
      document.getElementById("itg").style.background = "#ffffff";
      document.getElementById("bd").style.background = "#ffffff";
      document.getElementById("nw").style.background = "#ffffff";
      document.getElementById("tt").style.background = "#ffffff";
    },
    facebook() {
      this.social = "facebook";
      if (this.tabsMonitor == "tabProfile") {
        const found = this.getListTargetReport.filter(
          (element) => element.source === "facebook"
        );
        this.$store.commit("setListReport", found);
      } else {
        const found = this.getListMonitor.hashtaglist.filter(
          (element) => element.source === "facebook"
        );
        this.$store.commit("setListReport", {
          hashtaglist: found,
          summary: this.getListMonitor.summary,
          targetlist: this.getListTargetReport,
        });
      }
      this.$store.commit("setCurrentPage", 1);
      document.getElementById("all").style.background = "#ffffff";
      document.getElementById("tw").style.background = "#ffffff";
      document.getElementById("fb").style.background = "#c3d3e761";
      document.getElementById("pt").style.background = "#ffffff";
      document.getElementById("yt").style.background = "#ffffff";
      document.getElementById("itg").style.background = "#ffffff";
      document.getElementById("bd").style.background = "#ffffff";
      document.getElementById("nw").style.background = "#ffffff";
      document.getElementById("tt").style.background = "#ffffff";
    },
    pantip() {
      this.social = "pantip";
      if (this.tabsMonitor == "tabProfile") {
        const found = this.getListTargetReport.filter(
          (element) => element.source === "pantip"
        );
        this.$store.commit("setListReport", found);
      } else {
        const found = this.getListMonitor.hashtaglist.filter(
          (element) => element.source === "pantip"
        );
        this.$store.commit("setListReport", {
          hashtaglist: found,
          summary: this.getListMonitor.summary,
          targetlist: this.getListTargetReport,
        });
      }
      this.$store.commit("setCurrentPage", 1);
      document.getElementById("all").style.background = "#ffffff";
      document.getElementById("tw").style.background = "#ffffff";
      document.getElementById("fb").style.background = "#ffffff";
      document.getElementById("pt").style.background = "#c3d3e761";
      document.getElementById("yt").style.background = "#ffffff";
      document.getElementById("itg").style.background = "#ffffff";
      document.getElementById("bd").style.background = "#ffffff";
      document.getElementById("nw").style.background = "#ffffff";
      document.getElementById("tt").style.background = "#ffffff";
    },
    youtube() {
      this.social = "youtube";
      if (this.tabsMonitor == "tabProfile") {
        const found = this.getListTargetReport.filter(
          (element) => element.source === "youtube"
        );
        this.$store.commit("setListReport", found);
      } else {
        const found = this.getListMonitor.hashtaglist.filter(
          (element) => element.source === "youtube"
        );
        this.$store.commit("setListReport", {
          hashtaglist: found,
          summary: this.getListMonitor.summary,
          targetlist: this.getListTargetReport,
        });
      }
      this.$store.commit("setCurrentPage", 1);
      document.getElementById("all").style.background = "#ffffff";
      document.getElementById("tw").style.background = "#ffffff";
      document.getElementById("fb").style.background = "#ffffff";
      document.getElementById("pt").style.background = "#ffffff";
      document.getElementById("yt").style.background = "#c3d3e761";
      document.getElementById("itg").style.background = "#ffffff";
      document.getElementById("bd").style.background = "#ffffff";
      document.getElementById("nw").style.background = "#ffffff";
      document.getElementById("tt").style.background = "#ffffff";
    },
    instagram() {
      this.social = "instagram";
      if (this.tabsMonitor == "tabProfile") {
        const found = this.getListTargetReport.filter(
          (element) => element.source === "instagram"
        );
        this.$store.commit("setListReport", found);
      } else {
        const found = this.getListMonitor.hashtaglist.filter(
          (element) => element.source === "instagram"
        );
        this.$store.commit("setListReport", {
          hashtaglist: found,
          summary: this.getListMonitor.summary,
          targetlist: this.getListTargetReport,
        });
      }
      this.$store.commit("setCurrentPage", 1);
      document.getElementById("all").style.background = "#ffffff";
      document.getElementById("tw").style.background = "#ffffff";
      document.getElementById("fb").style.background = "#ffffff";
      document.getElementById("pt").style.background = "#ffffff";
      document.getElementById("yt").style.background = "#ffffff";
      document.getElementById("itg").style.background = "#c3d3e761";
      document.getElementById("bd").style.background = "#ffffff";
      document.getElementById("nw").style.background = "#ffffff";
      document.getElementById("tt").style.background = "#ffffff";
    },
    blockdit() {
      this.social = "blockdit";
      if (this.tabsMonitor == "tabProfile") {
        const found = this.getListTargetReport.filter(
          (element) => element.source === "blockdit"
        );
        this.$store.commit("setListReport", found);
      } else {
        const found = this.getListMonitor.hashtaglist.filter(
          (element) => element.source === "blockdit"
        );
        this.$store.commit("setListReport", {
          hashtaglist: found,
          summary: this.getListMonitor.summary,
          targetlist: this.getListTargetReport,
        });
      }
      this.$store.commit("setCurrentPage", 1);
      document.getElementById("all").style.background = "#ffffff";
      document.getElementById("tw").style.background = "#ffffff";
      document.getElementById("fb").style.background = "#ffffff";
      document.getElementById("pt").style.background = "#ffffff";
      document.getElementById("yt").style.background = "#ffffff";
      document.getElementById("itg").style.background = "#ffffff";
      document.getElementById("bd").style.background = "#c3d3e761";
      document.getElementById("nw").style.background = "#ffffff";
      document.getElementById("tt").style.background = "#ffffff";
    },
    tiktok() {
      this.social = "tiktok";
      if (this.tabsMonitor == "tabProfile") {
        const found = this.getListTargetReport.filter(
          (element) => element.source === "tiktok"
        );
        this.$store.commit("setListReport", found);
      } else {
        const found = this.getListMonitor.hashtaglist.filter(
          (element) => element.source === "tiktok"
        );
        this.$store.commit("setListReport", {
          hashtaglist: found,
          summary: this.getListMonitor.summary,
          targetlist: this.getListTargetReport,
        });
      }
      this.$store.commit("setCurrentPage", 1);
      document.getElementById("all").style.background = "#ffffff";
      document.getElementById("tw").style.background = "#ffffff";
      document.getElementById("fb").style.background = "#ffffff";
      document.getElementById("pt").style.background = "#ffffff";
      document.getElementById("yt").style.background = "#ffffff";
      document.getElementById("itg").style.background = "#ffffff";
      document.getElementById("bd").style.background = "#ffffff";
      document.getElementById("nw").style.background = "#ffffff";
      document.getElementById("tt").style.background = "#c3d3e761";
    },
    news() {
      this.social = "news";
      if (this.tabsMonitor == "tabProfile") {
        const found = this.getListTargetReport.filter(
          (element) => element.source === "news"
        );
        this.$store.commit("setListReport", found);
      } else {
        const found = this.getListMonitor.hashtaglist.filter(
          (element) => element.source === "news"
        );
        this.$store.commit("setListReport", {
          hashtaglist: found,
          summary: this.getListMonitor.summary,
          targetlist: this.getListTargetReport,
        });
      }
      this.$store.commit("setCurrentPage", 1);
      document.getElementById("all").style.background = "#ffffff";
      document.getElementById("tw").style.background = "#ffffff";
      document.getElementById("fb").style.background = "#ffffff";
      document.getElementById("pt").style.background = "#ffffff";
      document.getElementById("yt").style.background = "#ffffff";
      document.getElementById("itg").style.background = "#ffffff";
      document.getElementById("bd").style.background = "#ffffff";
      document.getElementById("nw").style.background = "#c3d3e761";
      document.getElementById("tt").style.background = "#ffffff";
    },
    getApiTotalStat() {
      let date = localStorage.getItem("dateReport").split(",");
      this.$store.dispatch("fetchTotalStatReport", {
        start: date[0],
        end: date[1],
      });

      // this.$store.dispatch("fetchDomainReportChart", {
      //   start: date[0],
      //   end: date[1],
      // });
    },
  },
  mounted() {
    this.getApiTotalStat();
  },
};
</script>

<style scoped>
.col {
  /* margin: auto; */
  flex-grow: unset;
  padding-right: 0px;
  padding-left: 0px;
}
#nw {
  color: #c99300;
}
#tt {
  color: #3f2e4c;
}
#bd {
  color: #396eb6;
}
#itg {
  color: #dd6600;
}
#yt {
  color: #d34644;
}
#pt {
  color: #521d87;
}
#tw {
  color: #4dabf3;
}
#fb {
  color: #3555aa;
}
.card {
  border: none;
}
.card-body {
  width: 150px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  border-radius: 7px;
}
.card-all .card-body {
  width: auto;
  height: 367px;
  padding: 10px 0px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  border-radius: 7px;
}
.card-stat .card-body {
  width: auto;
  padding: 50px 0px;
}
.box-sum {
  /* width: 80%; */
  margin: auto;
}
.socialogo {
  width: 45px;
}
li {
  list-style: none;
  /* margin-left: 28%; */
  /* display: inline-block;
  color: white; */
  cursor: pointer;
  padding: 12px;
}
.card-body:hover {
  background-color: #c3d3e761;
}
.card-all .card-body {
  background-color: #ffffff;
}
.card-stat .card-body {
  background-color: #ffffff;
}

@media only screen and (min-width: 0px) and (max-width: 1024px) {
  .box-sum {
    width: 100%;
    margin: auto;
  }
  /* .row {
    justify-content: center!important;
  } */
}

@media only screen and (min-width: 0px) and (max-width: 600px) {
  .col-sm-12 {
    padding-right: 0px;
    padding-left: 0px;
  }
  .card-all .card-body {
    width: auto;
    height: auto;
  }
  .card-stat .card-body {
    font-size: small;
    padding: 10px 0px;
  }
  .col-lg-8 {
    padding-right: 0px;
    padding-left: 0px;
  }
  li {
    padding: 4px;
  }
  .h5 {
    font-size: medium;
    font-weight: bold;
  }
  .card-body {
    width: 98px;
  }
  .card-body {
    flex: 1 1 auto;
    min-height: 1px;
    padding: 4px;
  }
  /* #all {
    margin-left: 3%;
  }
  #itg {
    margin-left: 37%;
  } */
}
@media only screen and (min-width: 414px) and (max-width: 736px) {
  .row {
    display: flex;
    flex-wrap: wrap;
    margin-right: -15px;
    margin-left: 0px;
    justify-content: center !important;
  }
}
</style>
