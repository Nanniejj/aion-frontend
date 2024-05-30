<template>
  <div>
    <b-row align-h="center" style="margin-top: 2em">
      <div class="cardChart footer_margin">
        <b-col style="padding: 20px">
          <b-row>
            <b-col class="text-left">
              <span class="top10 lg-font">Top 10</span>
            </b-col>
            <b-col class="text-right">
              <div id="btn-edit" class="float-right">
                <div v-if="edited == false">
                  <b-button @click="edited = true" class="submit md-font"
                    ><i class="fas fa-edit" /> Edit</b-button
                  >
                </div>
                <div v-if="edited == true">
                  <b-button @click="edited = false" class="submit md-font"
                    ><i class="fas fa-save" /> Save</b-button
                  >
                </div>
              </div>
            </b-col>
          </b-row>
        </b-col>
        <b-row>
          <ColumnChart
            :chartDataColumn="getWordCloudHashtagChart"
            class="d-none"
          />
          <b-col sm="12" md="12" lg="12">
            <div>
              <b-row align-h="center" style="margin: auto">
                <b-col cols="1"> </b-col>
                <b-col cols="6">
                  <div class="bold md-font">#ที่พบ</div>
                </b-col>
                <b-col cols="3">
                  <div class="bold md-font">จำนวนครั้งที่พบ</div>
                </b-col>
                <b-col cols="2" v-if="edited == true">
                  <div class="bold md-font"></div>
                </b-col>
              </b-row>
              <b-row
                v-for="(hashtag, index) in getWordCloud.data.hashtag.data.slice(
                  0,
                  10
                )"
                v-bind:key="index"
                align-h="center"
                style="cursor: pointer; margin: auto"
                id="row-rank"
              >
                <b-col
                  cols="1"
                  v-on:click="
                    tablehash(hashtag);
                    $bvToast.show('my-toast2');
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
                    tablehash(hashtag);
                    $bvToast.show('my-toast2');
                  "
                >
                  <div class="md-font">
                    <span id="text-hashtag"
                      ><b> {{ hashtag.name }}</b></span
                    >
                  </div>
                </b-col>
                <b-col
                  cols="3"
                  v-on:click="
                    tablehash(hashtag);
                    $bvToast.show('my-toast2');
                  "
                >
                  <div class="md-font">
                    <b>
                      {{ hashtag.total | numFormat }}
                    </b>
                  </div>
                </b-col>
                <b-col cols="2" v-if="edited == true" class="disp">
                  <div @click="deleteList(index)">
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
      <div id="slbox">
        <div class="cardChart footer_margin" v-if="!tab_selected">
          <vue-element-loading
            :active="getLoadChartCloud"
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
                      <a>ตารางแสดงความถี่</a>
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
                      >ตารางแสดงความถี่</a
                    ><span class="prt"> /</span> /{{ WordsFre }}
                  </div>
                </div>
              </b-col>
            </b-row>
            <b-row class="tablehashtag"  align-v="center" >
              <b-col sm="12" md="12" lg="6" align-h="center" >
                <StaticWordcloud :social="socialname"  :tabs="'hashtag'"/>
              </b-col>
              <b-col sm="12" md="12" lg="6" align-h="center" class="d-none">
                <div style="margin-top: 30px">
                  <!-- <PieChart /> -->
                  <PieChart :OverallData="getSentimentHashtagChart" />
                </div>
                <div class="users">จำนวน user</div>
                <div>
                  <hr class="w-75" />
                  <b class="h5">Total</b>
                  <!-- Post and comment/retweet founds -->
                  <b-row
                    class="my-3"
                    v-if="tab_selected_detail_social == 'all'"
                  >
                    <b-col>
                      <span>Posts/Tweets</span><br />
                      <span
                        ><i class="fas fa-paper-plane"></i>
                        {{ getSentimentHashtagAllPost | numFormat }}
                      </span>
                    </b-col>
                    <b-col>
                      <span>Comments/Retweet</span><br />
                      <span
                        ><i class="fas fa-comments"></i>
                        {{ getSentimentHashtagAllComment | numFormat }}
                      </span>
                    </b-col>
                  </b-row>
                  <!-- End Post and comment/retweet founds -->
                  <!-- Post and comment/retweet founds -->
                  <b-row
                    v-if="tab_selected_detail_social == 'facebook'"
                    class="my-3"
                  >
                    <b-col>
                      <span>Post</span><br />
                      <span
                        ><i class="fas fa-paper-plane"></i>
                        {{ getSentimentHashtagFacebookPost | numFormat }}
                      </span>
                    </b-col>
                    <b-col>
                      <span>Comments</span><br />
                      <span
                        ><i class="fas fa-comments"></i>
                        {{ getSentimentHashtagFacebookComment | numFormat }}
                      </span>
                    </b-col>
                  </b-row>
                  <!-- End Post and comment/retweet founds -->
                  <!-- Post and comment/retweet founds -->
                  <b-row
                    v-if="tab_selected_detail_social == 'twitter'"
                    class="my-3"
                  >
                    <b-col>
                      <span>Tweet</span><br />
                      <span
                        ><i class="fas fa-paper-plane"></i>
                        {{ getSentimentHashtagTwitterPost | numFormat }}
                      </span>
                    </b-col>
                    <b-col>
                      <span>Retweet</span><br />
                      <span
                        ><i class="fas fa-comments"></i>
                        {{ getSentimentHashtagTwitterComment | numFormat }}
                      </span>
                    </b-col>
                  </b-row>
                  <!-- End Post and comment/retweet founds -->
                  <!-- Post and comment/retweet founds -->
                  <b-row
                    v-if="tab_selected_detail_social == 'pantip'"
                    class="my-3"
                  >
                    <b-col>
                      <span>Post</span><br />
                      <span
                        ><i class="fas fa-paper-plane"></i>
                        {{ getSentimentHashtagPantipPost | numFormat }}
                      </span>
                    </b-col>
                    <b-col>
                      <span>Comments</span><br />
                      <span
                        ><i class="fas fa-comments"></i>
                        {{ getSentimentHashtagPantipComment | numFormat }}
                      </span>
                    </b-col>
                  </b-row>
                  <!-- End Post and comment/retweet founds -->
                  <!-- Post and comment/retweet founds -->
                  <b-row
                    v-if="tab_selected_detail_social == 'youtube'"
                    class="my-3"
                  >
                    <b-col>
                      <span>Post</span><br />
                      <span
                        ><i class="fas fa-paper-plane"></i>
                        {{ getSentimentHashtagYoutubePost | numFormat }}
                      </span>
                    </b-col>
                    <b-col>
                      <span>Comments</span><br />
                      <span
                        ><i class="fas fa-comments"></i>
                        {{ getSentimentHashtagYoutubeComment | numFormat }}
                      </span>
                    </b-col>
                  </b-row>
                  <!-- End Post and comment/retweet founds -->
                  <!-- Post and comment/retweet founds -->
                  <b-row v-if="tab_selected_detail_social == 'ig'" class="my-3">
                    <b-col>
                      <span>Post</span><br />
                      <span
                        ><i class="fas fa-paper-plane"></i>
                        {{ getSentimentHashtagInstagramPost | numFormat }}
                      </span>
                    </b-col>
                    <b-col>
                      <span>Comments</span><br />
                      <span
                        ><i class="fas fa-comments"></i>
                        {{ getSentimentHashtagInstagramComment | numFormat }}
                      </span>
                    </b-col>
                  </b-row>
                  <!-- End Post and comment/retweet founds -->
                  <!-- Post and comment/retweet founds -->
                  <b-row
                    v-if="tab_selected_detail_social == 'news'"
                    class="my-3"
                  >
                    <b-col>
                      <span>Post</span><br />
                      <span
                        ><i class="fas fa-paper-plane"></i>
                        {{ getSentimentHashtagNewsPost | numFormat }}
                      </span>
                    </b-col>
                    <b-col>
                      <span>Comments</span><br />
                      <span
                        ><i class="fas fa-comments"></i>
                        {{ getSentimentHashtagNewsComment | numFormat }}
                      </span>
                    </b-col>
                  </b-row>
                  <!-- End Post and comment/retweet founds -->
                  <!-- Post and comment/retweet founds -->
                  <b-row
                    v-if="tab_selected_detail_social == 'blockdit'"
                    class="my-3"
                  >
                    <b-col>
                      <span>Post</span><br />
                      <span
                        ><i class="fas fa-paper-plane"></i>
                        {{ getSentimentHashtagBlockditPost | numFormat }}
                      </span>
                    </b-col>
                    <b-col>
                      <span>Comments</span><br />
                      <span
                        ><i class="fas fa-comments"></i>
                        {{ getSentimentHashtagBlockditComment | numFormat }}
                      </span>
                    </b-col>
                  </b-row>
                  <!-- End Post and comment/retweet founds -->

                  <!-- Post and comment/retweet founds -->
                  <b-row
                    v-if="tab_selected_detail_social == 'tiktok'"
                    class="my-3"
                  >
                    <b-col>
                      <span>Post</span><br />
                      <span
                        ><i class="fas fa-paper-plane"></i>
                        {{ getSentimentHashtagTiktokPost | numFormat }}
                      </span>
                    </b-col>
                    <b-col>
                      <span>Comments</span><br />
                      <span
                        ><i class="fas fa-comments"></i>
                        {{ getSentimentHashtagTiktokComment | numFormat }}
                      </span>
                    </b-col>
                  </b-row>
                  <!-- End Post and comment/retweet founds -->
                </div>
              </b-col>
            
              <b-col sm="12" md="12" lg="6" align-h="right">
                <b-row>
                  <!-- social tab nav -->
                  <b-col>
                    <div id="menu">
                      <ul id="menus">
                        <div>
                          <li v-on:click="all()">
                            <a>
                              <a
                                id="all-btn"
                                style="
                                  background-color: #fed16e;
                                  color: white;
                                  width: 80px;
                                  padding-top: 0.3rem;
                                  padding-bottom: 0;
                                "
                                >ALL</a
                              >
                            </a>
                          </li>
                          <li v-on:click="facebook()">
                            <a tabindex="0">
                              <img
                                src="@/assets/Facebook.png"
                                class="imgsocial"
                              />
                            </a>
                          </li>
                          <li v-on:click="twitter()">
                            <a tabindex="0">
                              <img
                                src="@/assets/Twitter.png"
                                class="imgsocial"
                              />
                            </a>
                          </li>
                          <li v-on:click="pantip()">
                            <a tabindex="0">
                              <img
                                src="@/assets/Pantip.png"
                                class="imgsocial"
                              />
                            </a>
                          </li>
                          <li v-on:click="news()">
                            <a tabindex="0">
                              <img src="@/assets/News.png" class="imgsocial" />
                            </a>
                          </li>
                          <li v-on:click="youtube()">
                            <a tabindex="0">
                              <img
                                src="@/assets/Youtube.png"
                                class="imgsocial"
                              />
                            </a>
                          </li>
                          <li v-on:click="ig()">
                            <a tabindex="0">
                              <img
                                src="@/assets/Instagram.png"
                                class="imgsocial"
                              />
                            </a>
                          </li>
                          <li v-on:click="blockdit()">
                            <a tabindex="0">
                              <img
                                src="@/assets/Blockdit.png"
                                class="imgsocial"
                              />
                            </a>
                          </li>
                          <li v-on:click="tiktok()">
                            <a tabindex="0">
                              <img
                                src="@/assets/Tiktok.png"
                                class="imgsocial"
                              />
                            </a>
                          </li>
                        </div>
                      </ul>
                    </div>
                  </b-col>
                </b-row>
                <b-row style="height: 20em">
                  <b-col>
                    <span
                      class=""
                      id="all"
                      v-if="tab_selected_detail_social == 'all'"
                    >
                      <span id="day">
                        <Sentimentv2 :chartData="getSentimentHashtagAll" />
                        <!-- <SentimentChart :chartData="getSentimentHashtagAll" :source="'news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads'" /> -->
                      </span>
                    </span>
                    <span
                      class=""
                      id="facebook"
                      v-if="tab_selected_detail_social == 'facebook'"
                    >
                      <span id="day">
                        <Sentimentv2 :chartData="getSentimentHashtagFacebook" />
                        <!-- <SentimentChart :chartData="getSentimentHashtagFacebook" :source="'facebook'" /> -->
                      </span>
                    </span>
                    <span
                      class=""
                      id="twitter"
                      v-if="tab_selected_detail_social == 'twitter'"
                    >
                      <span id="day">
                        <Sentimentv2 :chartData="getSentimentHashtagTwitter" />
                        <!-- <SentimentChart :chartData="getSentimentHashtagTwitter" :source="'twitter'" /> -->
                      </span>
                    </span>
                    <span
                      class=""
                      id="pantip"
                      v-if="tab_selected_detail_social == 'pantip'"
                    >
                      <span id="day">
                        <Sentimentv2 :chartData="getSentimentHashtagPantip" />
                        <!-- <SentimentChart :chartData="getSentimentHashtagPantip" :source="'pantip'" /> -->
                      </span>
                    </span>
                    <span
                      class=""
                      id="youtube"
                      v-if="tab_selected_detail_social == 'youtube'"
                    >
                      <span id="day">
                        <Sentimentv2 :chartData="getSentimentHashtagYoutube" />
                        <!-- <SentimentChart :chartData="getSentimentHashtagYoutube" :source="'youtube'" /> -->
                      </span>
                    </span>
                    <span
                      class=""
                      id="ig"
                      v-if="tab_selected_detail_social == 'ig'"
                    >
                      <span id="day">
                        <Sentimentv2
                          :chartData="getSentimentHashtagInstagram"
                        />
                        <!-- <SentimentChart :chartData="getSentimentHashtagInstagram" :source="'instagram'" /> -->
                      </span>
                    </span>
                    <span
                      class=""
                      id="news"
                      v-if="tab_selected_detail_social == 'news'"
                    >
                      <span id="day">
                        <Sentimentv2 :chartData="getSentimentHashtagNews" />
                        <!-- <SentimentChart :chartData="getSentimentHashtagNews" :source="'news'"/> -->
                      </span>
                    </span>
                    <span
                      class=""
                      id="blockdit"
                      v-if="tab_selected_detail_social == 'blockdit'"
                    >
                      <span id="day">
                        <Sentimentv2 :chartData="getSentimentHashtagBlockdit" />
                      </span>
                    </span>
                    <span
                      class=""
                      id="tiktok"
                      v-if="tab_selected_detail_social == 'tiktok'"
                    >
                      <span id="day">
                        <Sentimentv2 :chartData="getSentimentHashtagTiktok" />
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
    <div class="pb-5" v-if="!tab_selected">
      <SocialSelect :tabsocial="'posthash'" />
      <HashPost :checkpost="true" />
    </div>
    <b-toast id="my-toast2" no-close-button auto-hide-delay="1500">
      <div class="text-center">
        <i class="fa fa-arrow-down" /> เลื่อนลงเพื่อดูข้อมูล
      </div>
    </b-toast>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ColumnChart from "../chart/ColumnChart.vue";
import PieChart from "../chart/PieChart.vue";
// import SentimentChart from "../chart/SentimentChart.vue";
import Sentimentv2 from "../chart/Sentimentv2.vue";
import HashPost from "../wordcloud/HashPost.vue";
import SocialSelect from "@/components/domain/SocialSelect.vue";
import StaticWordcloud from "../wordcloud/StaticWordcloud.vue";
import moment from "moment";
export default {
  props: {
    linkhash: {
      type: Boolean,
    },
  },
  watch: {
    getWordCloudHashtag() {
      this.all();
    },
  },
  data: function () {
    return {
      WordsFre: "",
      chartData: [],
      tab_selected: true,
      tab_selected_detail_social: "all",
      tab_selected_social: "all",
      edited: false,
      socialname: "news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads,blockdit,tiktok",
    };
  },
  components: {
    ColumnChart,
    PieChart,
    // SentimentChart,
    HashPost,
    SocialSelect,
    Sentimentv2,
    StaticWordcloud
  },
  methods: {
    // words() {
    //   this.tab_selected = "word";
    // },
    all() {
      this.tab_selected_detail_social = "all";
      this.socialname = "news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads,blockdit,tiktok";
      //this.$store.commit("setHashtagSocial", this.socialname);
    },
       tiktok() {
      this.tab_selected_detail_social = "tiktok";
      this.socialname = "tiktok";
    },
    blockdit() {
      this.tab_selected_detail_social = "blockdit";
      this.socialname = "blockdit";
    },
    facebook() {
      this.tab_selected_detail_social = "facebook";
      this.socialname = "facebook";
      //this.$store.commit("setHashtagSocial", this.socialname);
    },
    twitter() {
      this.tab_selected_detail_social = "twitter";
      this.socialname = "twitter";
      //this.$store.commit("setHashtagSocial", this.socialname);
    },
    pantip() {
      this.tab_selected_detail_social = "pantip";
      this.socialname = "pantip";
      // this.$store.commit("setHashtagSocial", this.socialname);
    },
    youtube() {
      this.tab_selected_detail_social = "youtube";
      this.socialname = "youtube";
      //this.$store.commit("setHashtagSocial", this.socialname);
    },
    ig() {
      this.tab_selected_detail_social = "ig";
      this.socialname = "instagram";
      //this.$store.commit("setHashtagSocial", this.socialname);
    },
    news() {
      this.tab_selected_detail_social = "news";
      this.socialname = "news";
      //this.$store.commit("setHashtagSocial", this.socialname);
    },
    getStat() {
      let domainarr;
      if (this.getWordCloudDomain&& this.getWordCloudDomain.toLocaleString()=='All') {
        domainarr = this.getDomainArr;
      }else if(this.getWordCloudDomain) {
        domainarr = this.getWordCloudDomain;
      } else {
        domainarr = "";
      }
      let socials = [
        "news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads,blockdit,tiktok",
        "facebook",
        "twitter",
        "news",
        "pantip",
        "instagram",
        "youtube",
        "blockdit",
        "tiktok",
      ];
      socials.map((x) => {
        this.$store.dispatch("fetchSentimentHashtag2", {
          start_date: this.getWordCloudStartDate,
          end_date: this.getWordCloudEndDate,
          keywords: this.getKeywords,
          domain: domainarr,
          hashtag: this.getWordCloudHashtag,
          monitor: this.getSelectedMonitor,
          social: x,
          // social:this.socialname
        });
      });
    },
    tablefreq() {
      this.tab_selected = "word";
    },
    tablehash(hashtag) {
      var todays = moment(new Date()).format().slice(0, 10) + "T00:00:00";
      var todaye = moment(new Date()).format().slice(0, 10) + "T23:59:59";

      if (this.linkhash) {
        this.$store.commit("setWordCloudStartDate", todays);
        this.$store.commit("setWordCloudEndDate", todaye);
      }
      this.tab_selected = false;
      this.WordsFre = hashtag.name;
      this.$store.commit("setWordCloudHashtag", hashtag.name);
      this.$store.commit("setHashtagSocial", this.socialname);
      let domainarr;
      if (this.getWordCloudDomain&& this.getWordCloudDomain.toLocaleString()=='All') {
        domainarr = this.getDomainArr;
      }else if(this.getWordCloudDomain) {
        domainarr = this.getWordCloudDomain;
      } else {
        domainarr = "";
      }
      let socials = [
        "news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads,blockdit,tiktok",
        "facebook",
        "twitter",
        "news",
        "pantip",
        "instagram",
        "youtube",
        "blockdit",
        "tiktok",
      ];
      socials.map((x) => {
        this.$store.dispatch("fetchSentimentHashtag2", {
          start_date: this.getWordCloudStartDate,
          end_date: this.getWordCloudEndDate,
          keywords: this.getKeywords,
          domain: domainarr,
          hashtag: hashtag.name.replace("#", ""),
          monitor: this.getSelectedMonitor,
          social: x,
          // social:this.socialname
        });
      });
      // this.$store.dispatch("fetchSentimentHashtag", {
      //   start_date: this.getWordCloudStartDate,
      //   end_date: this.getWordCloudEndDate,
      //   keywords: this.getKeywords,
      //   hashtag: hashtag.name.replace("#", ""),
      //   domain: this.getWordCloudDomain,
      //   monitor: this.getSelectedMonitor,
      // });

      //post detail
      this.$store.dispatch("fetchSentimentHashtagDetail", {
        start_date: this.getWordCloudStartDate,
        end_date: this.getWordCloudEndDate,
        keywords: this.getKeywords,
        domain: this.getWordCloudDomain,
        // sentiment: 1,
        offset: 0,
        sort_by: "",
        hashtag: hashtag.name.replace("#", ""),
        source: this.getHashtagSocial,
        monitor: this.getSelectedMonitor,
      });
      if (!this.linkhash) {
        var element = document.querySelector("#slbox");
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        this.$router.push({ name: "WordcloudSentiment" });
        this.tab_selected = false;
        window.scrollTo(0, 0);
      }
    },
    // selectSocail(){
    //   console.log('WordsFre',this.WordsFre);
    //   this.$store.dispatch("fetchSentimentHashtagDetail", {
    //     start_date: this.getWordCloudStartDate,
    //     end_date: this.getWordCloudEndDate,
    //    keywords: this.getKeywords,
    //     domain: this.getWordCloudDomain,
    //     sentiment: 1,
    //     offset: 0,
    //     sort_by: "",
    //     hashtag:this.WordsFre.replace("#", ""),
    //     source: this.getHashtagSocial,
    //     monitor: this.getSelectedMonitor
    //   });
    // },
    deleteList(k) {
      this.getHashtagChart.splice(k, 1);
      // this.chartData.splice(k + 1, 1);
      // this.result.hashtag.splice(k, 1);
      // console.log("click", this.chartData);
    },
  },
  computed: {
    ...mapGetters([
      "getDomainArr",
      "getLoadChartCloud",
      "getKeywords",
      "getSelectedMonitor",
      "getWordCloudDomain",
      "getWordCloud",
      "getWordCloudStartDate",
      "getWordCloudEndDate",
      "getWordCloudHashtagChart",
      "getHashtagChart",
      "getSentiment",
      "getSentimentHashtag",
      "getSentimentHashtagChart",
      "getSentimentHashtagAll",
      "getSentimentHashtagFacebook",
      "getSentimentHashtagTwitter",
      "getSentimentHashtagPantip",
      "getSentimentHashtagYoutube",
      "getSentimentHashtagInstagram",
      "getSentimentHashtagNews",
      "getSentimentHashtagBlockdit",
      "getSentimentHashtagTiktok",
      "getSentimentHashtagAllPost",

      "getSentimentHashtagFacebookPost",
      "getSentimentHashtagTwitterPost",
      "getSentimentHashtagInstagramPost",
      "getSentimentHashtagPantipPost",
      "getSentimentHashtagNewsPost",
      "getSentimentHashtagYoutubePost",
      "getSentimentHashtagBlockditPost",
      "getSentimentHashtagTiktokPost",

      "getSentimentHashtagAllComment",
      "getSentimentHashtagFacebookComment",
      "getSentimentHashtagTwitterComment",
      "getSentimentHashtagInstagramComment",
      "getSentimentHashtagPantipComment",
      "getSentimentHashtagNewsComment",
      "getSentimentHashtagYoutubeComment",
      "getSentimentHashtagBlockditComment",
      "getSentimentHashtagTiktokComment",
      "getHashtagSocial",
      "getWordCloudHashtag",
    ]),
  },
};
</script>
<style scoped>
#slbox {
  width: -webkit-fill-available;
}
.disp {
  display: contents;
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
  border-color: transparent transparent #ede7dd00 transparent;
}
#facebook::after {
  left: 28%;
}

#twitter::after {
  left: 39.5%;
}

#pantip::after {
  left: 50.5%;
}

#news::after {
  left: 62.5%;
}

#youtube::after {
  left: 73.5%;
}

#ig::after {
  left: 85%;
}
.imgsocial {
  width: 45px;
}
#all-btn {
  padding-top: 9px !important;
  padding-bottom: 9px !important;
}
.pointer {
  cursor: pointer;
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
  padding-bottom: 50px;
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
  margin-top: 5%;
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

.all {
  background-color: #fed16e;
  color: white;
  width: 80px;
  padding-top: 0.3rem;
  padding-bottom: 0;
}
#menuall ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
#menuall li {
  float: left;
}

#menuall li a {
  display: block;
  color: white;
  text-align: center;
  padding: 7px;
  text-decoration: none;
  cursor: pointer;
}

#menuall li a:hover {
  background-color: #fed16eab;
  /* border-radius: 50%; */
}
#menuall li a:focus {
  background-color: #fed16eab;
  border-radius: 50%;
  outline-style: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-color: transparent;
}
#menusall > div > li:nth-child(1) a {
  border-radius: unset;
}
#menusall > div > li:nth-child(2) > a {
  border-radius: 50%;
}
#menusall > div > li:nth-child(3) > a {
  border-radius: 50%;
}
#menusall > div > li:nth-child(4) > a {
  border-radius: 50%;
}
#menusall > div > li:nth-child(5) > a {
  border-radius: 50%;
}
#menusall > div > li:nth-child(6) > a {
  border-radius: 50%;
}
#menusall > div > li:nth-child(7) > a {
  border-radius: 50%;
}
#menusall > div > li:nth-child(8) > a {
  border-radius: 50%;
}
#menusall > div > li:nth-child(9) > a {
  border-radius: 50%;
}
#menusall > div > li:nth-child(1) a :focus {
  background-color: #fed16eab;
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
  padding: 5px;
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
#menus > div > li:nth-child(8) > a {
  border-radius: 50%;
}
#menus > div > li:nth-child(9) > a {
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
  width: fit-content;
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
@media only screen and (min-width: 950px) and (max-width: 1150px) {
  #menuall ul {
    list-style-type: none;
    overflow: hidden;
    width: 70% !important;
    /* margin: auto !important; */
  }
  #menuall li a {
    display: block;
    color: white;
    text-align: center;
    padding: 9px;
    text-decoration: none;
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
  #menu {
    margin-left: 100px;
  }
  .tooltiptext::after {
    left: 26%;
  }
  #facebook::after {
    left: 37.5%;
  }
  #twitter::after {
    left: 46.5%;
  }
  #pantip::after {
    left: 56%;
  }
  #news::after {
    left: 65%;
  }
  #youtube::after {
    left: 74.5%;
  }
  #ig::after {
    left: 83%;
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
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
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
  .imgsocial {
    width: 33px;
  }
  #all-btn {
    width: 45px !important;
  }
  #menu li a {
    padding: 4px;
  }
  #facebook::after {
    left: 31%;
  }
  #twitter::after {
    left: 43.5%;
  }
  #pantip::after {
    left: 56.5%;
  }
  #news::after {
    left: 69.5%;
  }
  #youtube::after {
    left: 82.5%;
  }
  #ig::after {
    left: 95%;
  }
}
@media only screen and (min-width: 1024px) and (max-width: 1366px) {
  .col-lg-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  .tooltiptext {
    left: 10px;
  }
  .tooltiptext::after {
    left: 23.5%;
  }
  #facebook::after {
    left: 32.5%;
  }
  #twitter::after {
    left: 40%;
  }
  #pantip::after {
    left: 47%;
  }
  #news::after {
    left: 54.5%;
  }
  #youtube::after {
    left: 61.5%;
  }
  #ig::after {
    left: 69%;
  }
}
@media print {
  .tablehashtag {
    margin-left: 5cm;
  }
  .users {
    margin-right: 5cm;
  }
}
</style>