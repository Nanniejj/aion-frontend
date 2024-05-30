<template>
  <div v-if="getShowRankTab">
    <b-row align-h="center" v-if="getRanking.length && tab_selected">
      <div class="w-100" v-if="getTrendRanking.length">
        <b-col style="padding: 20px">
          <b-row>
            <b-col cols="auto">
              <div class="tablename lg-font">ตารางการจัดการอันดับ</div>
              <!-- <div class="text-left mt-1 mb-2">
                <i class="fa fa-calendar" />
                <span
                  v-if="
                    getWordCloudStartDate.slice(0, 10) ==
                    getWordCloudEndDate.slice(0, 10)
                  "
                >
                  {{ getWordCloudStartDate.slice(0, 10) }}
                </span>
                <span v-else>
                  {{ getWordCloudStartDate.slice(0, 10) }} -
                  {{ getWordCloudEndDate.slice(0, 10) }}
                </span>
              </div> -->
            </b-col>
            <b-col>
              <div class="date">
                <span class="top10 lg-font">Top 10</span>
              </div>
            </b-col>
          </b-row>
          <RankChart />
        </b-col>
        <b-row>
          <b-col sm="12" md="12" lg="12">
            <!-- <TimelineChart :chartDataTimeline="getTrendRanking" /> -->
            <div class="mt-2 mb-5">
              <b-row align-h="center" style="margin: auto">
                <b-col cols="1"> </b-col>
                <b-col cols="6">
                  <div class="bold md-font">คำที่พบ</div>
                </b-col>
                <b-col cols="3">
                  <div class="bold md-font">จำนวนโพสต์</div>
                </b-col>
                <b-col cols="2" v-if="edited == true">
                  <div class="bold md-font"></div>
                </b-col>
              </b-row>
              <b-row
                v-for="(datas, index) in getRanking"
                v-bind:key="index"
                :data-name="datas.name"
                align-h="center"
                style="cursor: pointer; margin: auto"
                id="row-rank"
              >
                <b-col
                  cols="1"
                  v-on:click="
                    table(datas);
                    $bvToast.show('my-toast');
                  "
                >
                  <div class="md-font">
                    <span id="id-rank">{{ index + 1 }}</span>
                    <span class="fas fa-chart-bar"></span>
                  </div>
                </b-col>
                <b-col
                  cols="6"
                  v-on:click="
                    table(datas);
                    $bvToast.show('my-toast');
                  "
                >
                  <div class="md-font">
                    <span id="text-word"
                      ><b> {{ datas.name }}</b></span
                    >
                  </div>
                </b-col>
                <b-col
                  cols="3"
                  v-on:click="
                    table(datas);
                    $bvToast.show('my-toast');
                  "
                >
                  <div class="md-font">
                    <b>
                      {{ datas.count | numFormat }}
                    </b>
                  </div>
                </b-col>
                <b-col cols="2" v-if="edited == true">
                  <div>
                    <i
                      class="fas fa-window-close md-font"
                      style="color: #d43f3a"
                    ></i>
                  </div>
                </b-col>
                <b-col cols="3"></b-col>
              </b-row>
            </div>
          </b-col>
        </b-row>
      </div>
      <div id="rankbox">
        <div
          class="cardChart footer_margin mt-4"
          v-if="getSentimentRankingChart.length > 0 && !getShowWordList"
        >
          <vue-element-loading
            :active="getLoadRankTab"
            size="80"
            background-color="rgba(255, 255, 255, 0.5)"
            color="#b6ac9a"
          />
          <b-col style="padding: 20px">
            <b-row>
              <b-col cols="12">
                <div class="lg-font">
                  <div
                    id="flowBoxes"
                    style="
                      font-size: x-large;
                      font-weight: bold;
                      text-align: start;
                      padding: 0px;
                    "
                  >
                    <div
                      class="rightt hov"
                      v-on:click="tablefreq()"
                      style="cursor: pointer; color: #4c412b; font-size: large"
                    >
                      <a>ตารางการจัดการอันดับ</a>
                      <span class="prt"> /</span>
                    </div>
                    <div class="leftt active">
                      <a
                        style="
                          margin-left: 18px;
                          color: #ffffff;
                          font-size: large;
                        "
                        >{{ WordsFre }}</a
                      >
                    </div>
                    <!-- <div class="left right active"><span  style="margin-left: 18px;">{{keyword}}</span></div> -->
                  </div>
                  <div id="rank-link">
                    <a
                      class="pointer"
                      style="color: gray"
                      v-on:click="tablefreq()"
                      >ตารางการจัดการอันดับ</a
                    ><span class="prt"> /</span> /{{ WordsFre }}
                  </div>
                </div>
              </b-col>
            </b-row>
            <b-row class="tablerank">
              <b-col sm="12" md="12" lg="6" align-h="center">
                <div
                  v-if="
                    getSocial ==
                    'news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads'
                  "
                >
                  <div style="margin-top: 30px">
                    <!-- <PieChart /> -->

                    <PieChart :OverallData="getSentimentRankingChart" />
                    <!-- <GChart type="PieChart" :data="OverallData" :options="chartOptionsPie" /> -->
                  </div>
                  <div class="users">จำนวน user</div>
                  <hr class="w-75" />
                </div>

                <div class="mt-5">
                  <span class="m-3 text-center">
                    <img
                      v-if="getSocial == 'facebook'"
                      src="@/assets/Facebook.png"
                      class="imgsocial"
                    />
                    <img
                      v-else-if="getSocial == 'twitter'"
                      src="@/assets/Twitter.png"
                      class="imgsocial"
                    />
                    <img
                      v-else-if="getSocial == 'pantip'"
                      src="@/assets/Pantip.png"
                      class="imgsocial"
                    />
                    <img
                      v-else-if="getSocial == 'youtube'"
                      src="@/assets/Youtube.png"
                      class="imgsocial"
                    />
                    <img
                      v-else-if="getSocial == 'instagram'"
                      src="@/assets/Instagram.png"
                      class="imgsocial"
                    />
                    <img
                      v-else-if="getSocial == 'news'"
                      src="@/assets/News.png"
                      class="imgsocial"
                    />
                    <img
                      v-else-if="getSocial == 'blockdit'"
                      src="@/assets/Blockdit.png"
                      class="imgsocial"
                    />
                    <img
                      v-else-if="getSocial == 'tiktok'"
                      src="@/assets/Tiktok.png"
                      class="imgsocial"
                    />
                    <span class="alls allsels" v-else> All </span>
                  </span>
                  <b class="h5">Total</b>
                  <!-- Post and comment/retweet founds -->
                  <b-row
                    class="my-3"
                    v-if="
                      getSocial ==
                      'news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads'
                    "
                  >
                    <b-col>
                      <span>Posts/Tweets</span><br />
                      <span
                        ><i class="fas fa-paper-plane"></i>
                        {{ getSentimentStat.total.post | numFormat }}
                      </span>
                    </b-col>
                    <b-col>
                      <span>Comments/Retweet</span><br />
                      <span
                        ><i class="fas fa-comments"></i>
                        {{ getSentimentStat.total.comment | numFormat }}
                      </span>
                    </b-col>
                  </b-row>
                  <!-- End Post and comment/retweet founds -->
                  <!-- Post and comment/retweet founds -->
                  <b-row v-if="getSocial == 'blockdit'" class="my-3">
                    <b-col>
                      <span>Post</span><br />
                      <span
                        ><i class="fas fa-paper-plane"></i>
                        {{ getSentimentStat.blockdit.post | numFormat }}
                      </span>
                    </b-col>
                    <b-col>
                      <span>Comments</span><br />
                      <span
                        ><i class="fas fa-comments"></i>
                        {{ getSentimentStat.blockdit.comment | numFormat }}
                      </span>
                    </b-col>
                  </b-row>
                  <!-- End Post and comment/retweet founds -->
                  <!-- Post and comment/retweet founds -->
                  <b-row v-if="getSocial == 'tiktok'" class="my-3">
                    <b-col>
                      <span>Post</span><br />
                      <span
                        ><i class="fas fa-paper-plane"></i>
                        {{ getSentimentStat.tiktok.post | numFormat }}
                      </span>
                    </b-col>
                    <b-col>
                      <span>Comments</span><br />
                      <span
                        ><i class="fas fa-comments"></i>
                        {{ getSentimentStat.tiktok.comment | numFormat }}
                      </span>
                    </b-col>
                  </b-row>
                  <!-- End Post and comment/retweet founds -->
                  <!-- Post and comment/retweet founds -->
                  <b-row v-if="getSocial == 'facebook'" class="my-3">
                    <b-col>
                      <span>Post</span><br />
                      <span
                        ><i class="fas fa-paper-plane"></i>
                        {{ getSentimentStat.facebook.post | numFormat }}
                      </span>
                    </b-col>
                    <b-col>
                      <span>Comments</span><br />
                      <span
                        ><i class="fas fa-comments"></i>
                        {{ getSentimentStat.facebook.comment | numFormat }}
                      </span>
                    </b-col>
                  </b-row>
                  <!-- End Post and comment/retweet founds -->
                  <!-- Post and comment/retweet founds -->
                  <b-row v-if="getSocial == 'twitter'" class="my-3">
                    <b-col>
                      <span>Tweet</span><br />
                      <span
                        ><i class="fas fa-paper-plane"></i>
                        {{ getSentimentStat.twitter.post | numFormat }}
                      </span>
                    </b-col>
                    <b-col>
                      <span>Retweet</span><br />
                      <span
                        ><i class="fas fa-comments"></i>
                        {{ getSentimentStat.twitter.comment | numFormat }}
                      </span>
                    </b-col>
                  </b-row>
                  <!-- End Post and comment/retweet founds -->
                  <!-- Post and comment/retweet founds -->
                  <b-row v-if="getSocial == 'pantip'" class="my-3">
                    <b-col>
                      <span>Post</span><br />
                      <span
                        ><i class="fas fa-paper-plane"></i>
                        {{ getSentimentStat.pantip.post | numFormat }}
                      </span>
                    </b-col>
                    <b-col>
                      <span>Comments</span><br />
                      <span
                        ><i class="fas fa-comments"></i>
                        {{ getSentimentStat.pantip.comment | numFormat }}
                      </span>
                    </b-col>
                  </b-row>
                  <!-- End Post and comment/retweet founds -->
                  <!-- Post and comment/retweet founds -->
                  <b-row v-if="getSocial == 'youtube'" class="my-3">
                    <b-col>
                      <span>Post</span><br />
                      <span
                        ><i class="fas fa-paper-plane"></i>
                        {{ getSentimentStat.youtube.post | numFormat }}
                      </span>
                    </b-col>
                    <b-col>
                      <span>Comments</span><br />
                      <span
                        ><i class="fas fa-comments"></i>
                        {{ getSentimentStat.youtube.comment | numFormat }}
                      </span>
                    </b-col>
                  </b-row>
                  <!-- End Post and comment/retweet founds -->
                  <!-- Post and comment/retweet founds -->
                  <b-row v-if="getSocial == 'ig'" class="my-3">
                    <b-col>
                      <span>Post</span><br />
                      <span
                        ><i class="fas fa-paper-plane"></i>
                        {{ getSentimentStat.instagram.post | numFormat }}
                      </span>
                    </b-col>
                    <b-col>
                      <span>Comments</span><br />
                      <span
                        ><i class="fas fa-comments"></i>
                        {{ getSentimentStat.instagram.comment | numFormat }}
                      </span>
                    </b-col>
                  </b-row>
                  <!-- End Post and comment/retweet founds -->
                  <!-- Post and comment/retweet founds -->
                  <b-row v-if="getSocial == 'news'" class="my-3">
                    <b-col>
                      <span>Post</span><br />
                      <span
                        ><i class="fas fa-paper-plane"></i>
                        {{ getSentimentStat.news.post | numFormat }}
                      </span>
                    </b-col>
                    <b-col>
                      <span>Comments</span><br />
                      <span
                        ><i class="fas fa-comments"></i>
                        {{ getSentimentStat.news.comment | numFormat }}
                      </span>
                    </b-col>
                  </b-row>
                  <!-- End Post and comment/retweet founds -->
                </div>
              </b-col>
              <b-col sm="12" md="12" lg="6" align-h="right">
                <b-row style="height: 20em">
                  <b-col>
                    <span
                      id="all"
                      v-if="
                        getSocial ==
                        'news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads'
                      "
                    >
                      <span id="day">
                        <Sentimentv2 :chartData="getSentimentRankingAll" />
                        <!-- <SentimentChart
                          :chartData="getSentimentRankingAll"
                          :pageType="'RankPost'"
                        /> -->
                      </span>
                    </span>

                    <span
                      class="tooltiptext"
                      id="facebook"
                      v-if="getSocial == 'tiktok'"
                    >
                      <span id="day">
                        <Sentimentv2
                          :chartData="getSentimentStat.tiktok.total_sentiments"
                        />
                      </span>
                    </span>

                    <span
                      class="tooltiptext"
                      id="facebook"
                      v-if="getSocial == 'blockdit'"
                    >
                      <span id="day">
                        <Sentimentv2
                          :chartData="
                            getSentimentStat.blockdit.total_sentiments
                          "
                        />
                      </span>
                    </span>

                    <span
                      class="tooltiptext"
                      id="facebook"
                      v-if="getSocial == 'facebook'"
                    >
                      <!-- {{getSentimentStat.facebook.total_sentiments}} -->

                      <span id="day">
                        <Sentimentv2
                          :chartData="
                            getSentimentStat.facebook.total_sentiments
                          "
                        />
                        <!-- <SentimentChart
                          :chartData="
                            getSentimentStat.facebook.total_sentiments
                          "
                          :pageType="'RankPost'"
                        /> -->
                      </span>
                    </span>
                    <span
                      class="tooltiptext"
                      id="twitter"
                      v-if="getSocial == 'twitter'"
                    >
                      <span id="day">
                        <Sentimentv2
                          :chartData="getSentimentStat.twitter.total_sentiments"
                        />
                        <!-- <SentimentChart
                          :chartData="getSentimentStat.twitter.total_sentiments"
                          :pageType="'RankPost'"
                        /> -->
                      </span>
                    </span>
                    <span
                      class="tooltiptext"
                      id="pantip"
                      v-if="getSocial == 'pantip'"
                    >
                      <span id="day">
                        <Sentimentv2
                          :chartData="getSentimentStat.pantip.total_sentiments"
                        />
                        <!-- <SentimentChart
                          :chartData="getSentimentStat.pantip.total_sentiments"
                          :pageType="'RankPost'"
                        /> -->
                      </span>
                    </span>
                    <span
                      class="tooltiptext"
                      id="youtube"
                      v-if="getSocial == 'youtube'"
                    >
                      <span id="day">
                        <Sentimentv2
                          :chartData="getSentimentStat.youtube.total_sentiments"
                        />
                      </span>
                    </span>
                    <span
                      class="tooltiptext"
                      id="ig"
                      v-if="getSocial == 'instagram'"
                    >
                      <span id="day">
                        <Sentimentv2
                          :chartData="
                            getSentimentStat.instagram.total_sentiments
                          "
                        />
                      </span>
                    </span>
                    <span
                      class="tooltiptext"
                      id="news"
                      v-if="getSocial == 'news'"
                    >
                      <span id="day">
                        <Sentimentv2
                          :chartData="getSentimentStat.news.total_sentiments"
                        />
                      </span>
                    </span>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-col>
        </div>
      </div>
    </b-row>

    <b-row v-else class="md-font" cols="1">
      <vue-element-loading
        :active="getLoadStatus"
        size="80"
        background-color="rgba(255, 255, 255, 0.5)"
        color="#b6ac9a"
      />
      <b-card class="mt-4">
        <div class="mt-3">ไม่พบข้อมูล</div>
      </b-card>
    </b-row>
    <div class="pb-5 conpost" v-if="!getShowWordList">
      <!-- <SocialSelect :tabsocial="'postword'" /> -->
      <RankPost :checkpost="true" id="wordsll" />
    </div>
    <b-toast id="my-toast" no-close-button auto-hide-delay="1500">
      <div class="text-center">
        <i class="fa fa-arrow-down" /> เลื่อนลงเพื่อดูข้อมูล
      </div>
    </b-toast>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import TimelineChart from "../chart/TimelineChart.vue";
import PieChart from "../chart/PieChart.vue";
// import SentimentChart from "../chart/SentimentChart.vue";
import Sentimentv2 from "../chart/Sentimentv2.vue";
import RankPost from "../ranking/RankPosts.vue";
import RankChart from "@/components/chart/RankChart.vue";
// import moment from "moment";
export default {
  props: {
    // data: {
    //   default: {
    //     value: 0,
    //   },
    // },
  },
  data() {
    return {
      chartData: [],
      tab_selected: true,
      tab_selected_detail_social: "all",
      tab_selected_social: "all",
      edited: false,
    };
  },
  components: {
    // TimelineChart,
    PieChart,
    // SentimentChart,
    RankPost,
    RankChart,
    Sentimentv2,
  },
  methods: {
    all() {
      this.tab_selected_detail_social = "all";
      this.getSocial = "total";
    },
    facebook() {
      this.tab_selected_detail_social = "facebook";
      this.getSocial = "facebook";
    },
    twitter() {
      this.tab_selected_detail_social = "twitter";
      this.getSocial = "twitter";
    },
    pantip() {
      this.tab_selected_detail_social = "pantip";
      this.getSocial = "pantip";
    },
    youtube() {
      this.tab_selected_detail_social = "youtube";
      this.getSocial = "youtube";
    },
    ig() {
      this.tab_selected_detail_social = "ig";
      this.getSocial = "instagram";
    },
    news() {
      this.tab_selected_detail_social = "news";
      this.getSocial = "news";
    },
    table(datas) {
      // this.tab_selected = !this.tab_selected;
      //this.tab_selected = false;
      this.$store.commit("setShowWordList", false);
      this.WordsFre = datas.name;
      this.$store.commit("setObName", datas.name);
      this.$store.dispatch("fetchSentimentStat", {
        start_date: this.getWordCloudStartDate,
        end_date: this.getWordCloudEndDate,
        domain: this.getObjectName,
        subdomain: this.getSubDomain,
        source: this.getSocial,
        objects: datas.name,
      });

      //post detail
      this.$store.dispatch("fetchSentimentDetailRanking", {
        start_date: this.getWordCloudStartDate,
        end_date: this.getWordCloudEndDate,
        sentiment: this.selected,
        offset: 0,
        sort_by: "",
        domain: this.getObjectName,
        subdomain: this.getSubDomain,
        objects: datas.name,
        source: this.getSocial,
      });
      var element = document.querySelector("#rankbox");
      element.scrollIntoView({ behavior: "smooth" });
    },
    tablefreq() {
      this.tab_selected = "datas";
    },
  },
  computed: {
    ...mapGetters([
      "getSocial",
      "getSubmitRanking",
      "getRanking",
      "getObjectName",
      "getTrendRanking",
      "getShowDomainRanking",
      "getWordCloudStartDate",
      "getWordCloudEndDate",
      "getSentimentRanking",
      "getSentimentStat",
      "getSentimentRankingChart",
      "getSentimentRankingAll",
      "getSentimentRankingFacebook",
      "getSentimentRankingTwitter",
      "getSentimentRankingPantip",
      "getSentimentRankingYoutube",
      "getSentimentRankingInstagram",
      "getSentimentRankingNews",
      "getSubDomain",
      "getShowWordList",
      "getShowRankTab",
      "getLoadRankTab",
      "getLoadStatus",
    ]),
  },
  destroyed() {
    this.$store.commit("setShowWordList", true);
    this.$store.commit("setShowRankTab", false);
    this.tab_selected = false;
  },
 
};
</script>
<style scoped>
.alls {
  background-color: #fed16e;
  color: white;
  width: 40px;
  padding-top: 0.3rem;
  padding-bottom: 0;
  border-radius: 50%;
}

.allsels {
  display: block;
  color: white;
  text-align: center;
  padding: 8px;
  height: 40px;
  display: inline-block;
  align-items: center;
  justify-content: center;
}

#rankbox {
  width: -webkit-fill-available;
}
.tooltiptext {
  width: 95%;
  /* background-color: #ede7dd; */
  border-radius: 6px;
  padding: 5px 0;
  /* position: absolute; */
  z-index: 1;
  left: none;
  top: 20px;
  margin: auto;
  box-shadow: 6px 6px 6px 6px rgba(0, 0, 0, 0.2);
}
.tooltiptext::after {
  content: "";
  /* position: absolute; */
  bottom: 100%;
  left: 14%;
  margin-left: -30px;
  border-width: 20px;
  border-style: solid;
  /* border-color: transparent transparent #ede7dd transparent; */
  display: none;
}
.imgsocial {
  width: 47px;
}
#all-btn {
  padding-top: 9px !important;
  padding-bottom: 9px !important;
}
.pointer {
  cursor: pointer;
}
.gray {
  color: #543506d1 !important;
}
#rank-link {
  display: none;
}
#flowPhone {
  display: none;
}
#flowBoxes {
  font-size: x-large;
  font-weight: bold;
  text-align: start;
  margin-left: 30px;
  padding: 20px;
  padding-top: 5px;
}
#flowBoxes div {
  display: inline-flex;
  position: relative;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  /* border:1px solid #ccc; */
  margin-right: 2px;
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
}
#flowBoxes div.active:after {
  background-color: #4c412b;
}
#text-word {
  word-break: break-word;
}
.fa-chart-bar {
  text-align: start;
}
div.cardChart.footer_margin {
  margin-bottom: 50px;
  /* padding-bottom: 100px; */
}
.cardChart {
  border-radius: 12px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  width: 100%;
  margin: auto;
}
#id-rank {
  position: absolute;
  left: -23px;
  background: #f1d79f;
  color: #4c412b;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  font-weight: bold;
  width: 22px;
  height: 22px;
  top: 1px;
}
.bold {
  color: #4c412b;
}
.tablename {
  text-align: start;
  font-size: 20pt;
  font-weight: bold;
}
.datetxt {
  font-size: 14pt;
  font-weight: bold;
  text-align: end;
}
.datetxt a {
  color: #543506d1;
}
#row-rank {
  background: #ede7dd;
  border-radius: 20px;
  box-shadow: 1px 1px 2px #888888;
  margin-bottom: 10px !important;
  width: 90%;
  padding: 3px 0px;
  margin: auto;
}
#row-rank:hover {
  background: #4c412b;
  color: white;
}
.datetxt a:hover {
  color: #543506fc !important;
}
.date {
  text-align: end;
}
.top10 {
  font-size: 18pt;
  font-weight: bold;
}
a {
  color: #543506fc;
}
#all-btn {
  padding-top: 9px !important;
  padding-bottom: 9px !important;
}
.all {
  background-color: #fed16e;
  color: white;
  width: 80px;
  border-radius: 9px;
  padding-top: 0.3rem;
  padding-bottom: 0;
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
  /* border-radius: 50%; */
}
#menu li a:focus {
  background-color: #fed16eab;
  border-radius: 50%;
  outline-style: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-color: transparent;
}
#menus > div > li:nth-child(1) a {
  border-radius: unset;
}
#menus > div > li:nth-child(2) > a {
  border-radius: 50%;
}
#menus > div > li:nth-child(3) > a {
  border-radius: 50%;
}
#menus > div > li:nth-child(4) > a {
  border-radius: 50%;
}
#menus > div > li:nth-child(5) > a {
  border-radius: 50%;
}
#menus > div > li:nth-child(6) > a {
  border-radius: 50%;
}
#menus > div > li:nth-child(7) > a {
  border-radius: 50%;
}
#menus > div > li:nth-child(1) a :focus {
  background-color: #fed16eab;
}
.submit {
  width: 100%;
  background-color: #fed16e;
  color: #4c412b;
  border-color: #fed16e !important;
  border-radius: 9px;
  font-weight: bold;
  box-shadow: 1px 1px 4px;
}
.submit:hover {
  background-color: #4c412b;
  color: white;
}
#btn-edit {
  width: 25%;
  margin: auto;
  margin-bottom: 20px;
}
.img-size {
  width: 30px;
  cursor: pointer;
}

.bl-txt {
  color: black;
}

.mb-2 {
  margin: auto;
}

.bg_title img {
  position: absolute;
  width: 40%;
  top: 13px;
  left: 140px;
}
.bg_summarize img {
  width: 118px;
  position: absolute;
}

.bold a {
  color: #695a3d;
}

.legend-first {
  margin-top: 2.9rem !important;
}

.legend {
  margin-top: 1.2rem;
  font-size: 11pt;
  font-weight: bold;
  color: black;
}

.legend a {
  color: #695a3d;
  margin-left: 3px;
}

.legend-bottom {
  padding-left: 400px;
  color: black;
}

.legend-bottom span {
  margin-left: 30px;
}

.legend-bottom span img {
  width: 30px;
}

@media only screen and (min-width: 950px) and (max-width: 1150px) {
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
}

@media only screen and (min-width: 820px) and (max-width: 990px) {
  .md-font {
    font-size: 1.5vw !important;
  }
}

@media only screen and (min-device-width: 770px) and (max-width: 850px) {
  .md-font {
    font-size: 2.2vw !important;
  }
  .legend a {
    display: block;
  }
  .img-size {
    width: 5vw !important;
  }
}

@media only screen and (min-device-width: 768px) and (max-device-width: 1000px) {
  .md-font {
    font-size: 2vw !important;
  }
  .legend {
    font-size: 1.7vw !important;
  }
}

@media only screen and (min-width: 375px) and (max-width: 815px) {
  .bl-txt md-font {
    margin-top: -28px;
    margin-bottom: 10px;
  }
  .bg_title img[data-v-aae30ed8] {
    left: 120px;
  }
  .legend {
    font-size: 1.7vw !important;
  }
  .bl-txt {
    font-size: 2vw !important;
  }
  .legend a {
    display: block;
    margin-left: -4px;
    font-size: 1.5vw !important;
  }
  .md-font {
    font-size: 1.7vw !important;
  }
  .legend {
    margin-top: 11px;
  }
  .tooltiptext {
    left: 8px;
  }
}
@media only screen and (min-width: 0px) and (max-width: 750px) {
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
    background: #ddd;
    display: -webkit-box;
    color: #616569;
    padding: 8px 10px;
    margin-bottom: 10px;
  }
  #rank-link {
    display: inline;
    font-size: 20px;
    font-weight: bold;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .my-3 {
    font-size: small !important;
  }
  .bl-txt md-font {
    margin-top: -28px;
    margin-bottom: 10px;
  }
  .bg_title img[data-v-aae30ed8] {
    left: 120px;
  }
  .legend {
    font-size: 3vw !important;
  }
  .bl-txt {
    font-size: 3vw !important;
  }
  .legend a {
    display: block;
    margin-left: -4px;
    font-size: 2.5vw !important;
  }
  .md-font {
    font-size: 3.5vw !important;
  }
  .legend {
    margin-top: 11px;
  }
}
@media print {
  .tablerank {
    margin-left: 5cm;
  }
  .users {
    margin-right: 5cm;
  }
}
</style>
