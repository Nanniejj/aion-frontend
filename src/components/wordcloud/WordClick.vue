<template>
<div>
  <b-row align-h="center" style="margin-top: 2em" >
    <div class="cardChart footer_margin" >
      <b-col style="padding: 20px">
        <b-row>
          <b-col class="text-left">
                  <span class="top10 lg-font ">Top 10</span>
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
        <!-- {{getWordCloudWordChart}} -->
        <ColumnChart :chartDataColumn="getWordCloudWordChart" class="d-none" />
        <b-col sm="12" md="12" lg="12">
          <div>
            <b-row align-h="center" style="margin: auto">
              <b-col cols="1"> </b-col>
              <b-col cols="6">
                <div class="bold md-font">คำที่พบ</div>
              </b-col>
              <b-col cols="3">
                <div class="bold md-font">จำนวนครั้งที่พบ</div>
              </b-col>
              <b-col cols="2" v-if="edited == true">
                <div class="bold md-font"></div>
              </b-col>
            </b-row>
            <b-row
              v-for="(word, index) in getWordChart.slice(
                0,
                10
              )"
              v-bind:key="index"
              align-h="center"
              style="cursor: pointer; margin: auto"
              id="row-rank"
            >
              <b-col cols="1" v-on:click="table(word)" >
                <div class="md-font">
                  <span id="id-rank">{{ index + 1 }}</span>
                  <span class="fas fa-chart-bar"></span>
                </div>
              </b-col>
              <b-col cols="6" v-on:click="table(word)">
                <div class="md-font">
                  <span id="text-word"
                    ><b> {{ word.name }}</b></span
                  >
                </div>
              </b-col>
              <b-col cols="3" v-on:click="table(word)">
                <div class="md-font">
                  <b>
                    {{ word.total|numFormat }}
                  </b>
                </div>
              </b-col>
              <b-col cols="2" v-if="edited == true" class="disp">
                <div @click="deleteList(k)">
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
<div id="slbox" >
    <div class="cardChart footer_margin" >
       <vue-element-loading
        :active="getLoadChartCloud"
        size="80"
        background-color="rgba(255, 255, 255, 0.5)"
        color="#fbf7f6"
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
                    style="margin-left: 18px; color: #ffffff; font-size: large"
                    >{{ WordsFre }}</a
                  >
                </div>
                <!-- <div class="left right active"><span  style="margin-left: 18px;">{{keyword}}</span></div> -->
              </div>
              <div id="rank-link">
                <a class="pointer" style="color: gray" v-on:click="tablefreq()" 
                  >ตารางแสดงความถี่</a
                ><span class="prt"> /</span>
                /{{ WordsFre }}
              </div>
            </div>
          </b-col>
        </b-row>
        <b-row class="tablewords">
          <b-col sm="12" md="12" lg="6">
            <div class="piechart" style="margin-top: 30px">
              <PieChart :OverallData="getSentimentChart" />
            </div>
            <div class="users">จำนวน user</div>
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
                          <img src="@/assets/Facebook.png" class="imgsocial" />
                        </a>
                      </li>
                      <li v-on:click="twitter()">
                        <a tabindex="0">
                          <img src="@/assets/Twitter.png" class="imgsocial" />
                        </a>
                      </li>
                      <li v-on:click="pantip()">
                        <a tabindex="0">
                          <img src="@/assets/Pantip.png" class="imgsocial" />
                        </a>
                      </li>
                      <li v-on:click="news()">
                        <a tabindex="0">
                          <img src="@/assets/News.png" class="imgsocial" />
                        </a>
                      </li>
                      <li v-on:click="youtube()">
                        <a tabindex="0">
                          <img src="@/assets/Youtube.png" class="imgsocial" />
                        </a>
                      </li>
                      <li v-on:click="ig()">
                        <a tabindex="0">
                          <img src="@/assets/Instagram.png" class="imgsocial" />
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
                    <SentimentChart :chartData="getSentimentAll" :source="'facebook,twitter,news,pantip,instagram,youtube'" :pageType="'WordPost'"/>
                    <!-- Post and comment/retweet founds -->
                    <b-row class="my-3">
                      <b-col>
                        <span>Posts/Tweets</span><br />
                        <span
                          ><i class="fas fa-paper-plane"></i>
                          {{ getSentimentAllPost|numFormat }}
                        </span>
                      </b-col>
                      <b-col>
                        <span>Comments/Retweet</span><br />
                        <span
                          ><i class="fas fa-comments"></i>
                          {{ getSentimentAllComment|numFormat }}
                        </span>
                      </b-col>
                    </b-row>
                    <!-- End Post and comment/retweet founds -->
                  </span>
                </span>
                <span
                  class=""
                  id="facebook"
                  v-if="tab_selected_detail_social == 'facebook'"
                >
                  <span id="day">
                    <SentimentChart :chartData="getSentimentFacebook" :source="'facebook'" :pageType="'WordPost'"/>
                    <!-- Post and comment/retweet founds -->
                    <b-row
                      v-if="tab_selected_detail_social == 'facebook'"
                      class="my-3"
                    >
                      <b-col>
                        <span>Post</span><br />
                        <span
                          ><i class="fas fa-paper-plane"></i>
                          {{
                            getSentimentFacebookPost|numFormat
                          }}
                        </span>
                      </b-col>
                      <b-col>
                        <span>Comments</span><br />
                        <span
                          ><i class="fas fa-comments"></i>
                          {{
                            getSentimentFacebookComment|numFormat
                          }}
                        </span>
                      </b-col>
                    </b-row>
                    <!-- End Post and comment/retweet founds -->
                  </span>
                </span>
                <span
                  class=""
                  id="twitter"
                  v-if="tab_selected_detail_social == 'twitter'"
                >
                  <span id="day">
                    <SentimentChart :chartData="getSentimentTwitter" :source="'twitter'" :pageType="'WordPost'"/>
                    <!-- Post and comment/retweet founds -->
                    <b-row
                      v-if="tab_selected_detail_social == 'twitter'"
                      class="my-3"
                    >
                      <b-col>
                        <span>Tweet</span><br />
                        <span
                          ><i class="fas fa-paper-plane"></i>
                          {{
                            getSentimentTwitterPost|numFormat
                          }}
                        </span>
                      </b-col>
                      <b-col>
                        <span>Retweet</span><br />
                        <span
                          ><i class="fas fa-comments"></i>
                          {{
                            getSentimentTwitterComment|numFormat
                          }}
                        </span>
                      </b-col>
                    </b-row>
                    <!-- End Post and comment/retweet founds -->
                  </span>
                </span>
                <span
                  class=""
                  id="pantip"
                  v-if="tab_selected_detail_social == 'pantip'"
                >
                  <span id="day">
                    <SentimentChart :chartData="getSentimentPantip" :source="'pantip'" :pageType="'WordPost'"/>
                    <!-- Post and comment/retweet founds -->
                    <b-row
                      v-if="tab_selected_detail_social == 'pantip'"
                      class="my-3"
                    >
                      <b-col>
                        <span>Post</span><br />
                        <span
                          ><i class="fas fa-paper-plane"></i>
                          {{ getSentimentPantipPost|numFormat }}
                        </span>
                      </b-col>
                      <b-col>
                        <span>Comments</span><br />
                        <span
                          ><i class="fas fa-comments"></i>
                          {{
                            getSentimentPantipComment|numFormat
                          }}
                        </span>
                      </b-col>
                    </b-row>
                    <!-- End Post and comment/retweet founds -->
                  </span>
                </span>
                <span
                  class=""
                  id="youtube"
                  v-if="tab_selected_detail_social == 'youtube'"
                >
                  <span id="day">
                    <SentimentChart :chartData="getSentimentYoutube" :source="'youtube'" :pageType="'WordPost'"/>
                    <!-- Post and comment/retweet founds -->
                    <b-row
                      v-if="tab_selected_detail_social == 'youtube'"
                      class="my-3"
                    >
                      <b-col>
                        <span>Post</span><br />
                        <span
                          ><i class="fas fa-paper-plane"></i>
                          {{
                            getSentimentYoutubePost|numFormat
                          }}
                        </span>
                      </b-col>
                      <b-col>
                        <span>Comments</span><br />
                        <span
                          ><i class="fas fa-comments"></i>
                          {{
                            getSentimentYoutubeComment|numFormat
                          }}
                        </span>
                      </b-col>
                    </b-row>
                    <!-- End Post and comment/retweet founds -->
                  </span>
                </span>
                <span
                  class=""
                  id="ig"
                  v-if="tab_selected_detail_social == 'ig'"
                >
                  <span id="day">
                    <SentimentChart :chartData="getSentimentInstagram" :source="'instagram'" :pageType="'WordPost'"/>
                    <!-- Post and comment/retweet founds -->
                    <b-row
                      v-if="tab_selected_detail_social == 'ig'"
                      class="my-3"
                    >
                      <b-col>
                        <span>Post</span><br />
                        <span
                          ><i class="fas fa-paper-plane"></i>
                          {{
                            getSentimentInstagramPost|numFormat
                          }}
                        </span>
                      </b-col>
                      <b-col>
                        <span>Comments</span><br />
                        <span
                          ><i class="fas fa-comments"></i>
                          {{
                            getSentimentInstagramComment|numFormat
                          }}
                        </span>
                      </b-col>
                    </b-row>
                    <!-- End Post and comment/retweet founds -->
                  </span>
                </span>
                <span
                  class=""
                  id="news"
                  v-if="tab_selected_detail_social == 'news'"
                >
                  <span id="day">
                    <SentimentChart :chartData="getSentimentNews" :source="'news'" :pageType="'WordPost'"/>
                    <!-- Post and comment/retweet founds -->
                    <b-row
                      v-if="tab_selected_detail_social == 'news'"
                      class="my-3"
                    >
                      <b-col>
                        <span>Post</span><br />
                        <span
                          ><i class="fas fa-paper-plane"></i>
                          {{ getSentimentNewsPost|numFormat }}
                        </span>
                      </b-col>
                      <b-col>
                        <span>Comments</span><br />
                        <span
                          ><i class="fas fa-comments"></i>
                          {{
                            getSentimentNewsComment|numFormat
                          }}
                        </span>
                      </b-col>
                    </b-row>
                    <!-- End Post and comment/retweet founds -->
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
  <div class="pb-5 conpost" v-if="!tab_selected">
    <SocialSelect :tabsocial="'postword'" />
      <WordPost :checkpost="true"/>
  </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ColumnChart from "../chart/ColumnChart.vue";
import PieChart from "../chart/PieChart.vue";
import SentimentChart from "../chart/SentimentChart.vue";
import WordPost from "../wordcloud/WordPost.vue";
import SocialSelect from "@/components/domain/SocialSelect.vue";
import moment from "moment";
export default {
   props: {
    linkword: {
      type: Boolean,
    },
  },
  watch:{
    getWordCloudSocial(){
      this.selectSocail()
    },
    linkword(){
      this.tab_selected=false
    }
  },
  data: function () {
    return {
      WordsFre:"",
      result: {
        hashtag: "",
        wordcloud: "",
      },
      chartData: [],
      tab_selected: true,
      tab_selected_detail_social: "all",
      tab_selected_social: "all",
      edited: false,
      socialname: "facebook,twitter,news,pantip,instagram,youtube",
    };
  },
  components: {
    ColumnChart,
    PieChart,
    SentimentChart,
    WordPost,
    SocialSelect
  },
  methods: {
    // words() {
    //   this.tab_selected = "word";
    // },
    all() {
      this.tab_selected_detail_social = "all";
      this.socialname = "facebook,twitter,news,pantip,instagram,youtube";
      //this.$store.commit("setWordCloudSocial", this.socialname);
    },
    facebook() {
      this.tab_selected_detail_social = "facebook";
      this.socialname = "facebook";
      //this.$store.commit("setWordCloudSocial", this.socialname);
    },
    twitter() {
      this.tab_selected_detail_social = "twitter";
      this.socialname = "twitter";
      //this.$store.commit("setWordCloudSocial", this.socialname);
    },
    pantip() {
      this.tab_selected_detail_social = "pantip";
      this.socialname = "pantip";
      //this.$store.commit("setWordCloudSocial", this.socialname);
    },
    youtube() {
      this.tab_selected_detail_social = "youtube";
      this.socialname = "youtube";
      //this.$store.commit("setWordCloudSocial", this.socialname);
    },
    ig() {
      this.tab_selected_detail_social = "ig";
      this.socialname = "instagram";
     // this.$store.commit("setWordCloudSocial", this.socialname);
    },
    news() {
      this.tab_selected_detail_social = "news";
      this.socialname = "news";
      //this.$store.commit("setWordCloudSocial", this.socialname);
    },
    tablefreq() {
      this.tab_selected = "word";
    },
  table(word) {
        var todays = moment(new Date()).format().slice(0, 10) + "T00:00:00";
        var todaye = moment(new Date()).format().slice(0, 10) + "T23:59:59";
        
      if (this.linkword) {
      this.$store.commit('setWordCloudStartDate',todays)
      this.$store.commit('setWordCloudEndDate',todaye)
      }

      this.tab_selected = false;
    
       this.WordsFre = word.name;
      this.$store.commit("setQuerySearch", word.name);
      this.$store.commit("setWordCloudSocial", this.socialname);
       this.$store.dispatch("fetchSentiment", {
        start_date: this.getWordCloudStartDate,
        end_date: this.getWordCloudEndDate,
        keywords: this.getKeywords,
        domain: this.getWordCloudDomain,
        querySearch: word.name,
        monitor: this.getSelectedMonitor
      });

      //post detail
      this.$store.dispatch("fetchSentimentDetail", {
        start_date: this.getWordCloudStartDate,
        end_date: this.getWordCloudEndDate,
       keywords: this.getKeywords,
        domain: this.getWordCloudDomain,
        sentiment: 1,
        offset: 0,
        sort_by: "",
        querySearch: word.name,
        // source: this.getWordCloudSocial,
        monitor: this.getSelectedMonitor
      });

       if (!this.linkword) {
      var element = document.querySelector("#slbox");
      element.scrollIntoView({behavior: "smooth"});
      }else{
     
        this.$router.push({ name: "WordcloudSentiment" });
        this.tab_selected = false;
      //    var element = document.querySelector("#topcard");
      // element.scrollIntoView({behavior: "smooth"});
      }
     
     this.tab_selected = false;
     console.log('this.tab_selected',this.tab_selected);
    },
    selectSocail(){
      console.log('selectSocail');
      this.$store.dispatch("fetchSentimentDetail", {
        start_date: this.getWordCloudStartDate,
        end_date: this.getWordCloudEndDate,
       keywords: this.getKeywords,
        domain: this.getWordCloudDomain,
        sentiment: 1,
        offset: 0,
        sort_by: "",
        querySearch: this.WordsFre,
        source: this.getWordCloudSocial,
        monitor: this.getSelectedMonitor
      });
    },
    deleteList(k) {
      this.getWordChart.splice(k, 1);
      this.chartData.splice(k + 1, 1);
      this.result.wordcloud.splice(k, 1);
      // console.log("click", this.chartData);
    },
  },
  computed: {
    ...mapGetters([
      "getLoadChartCloud",
      "getWordCloudDomain",
      "getKeywords",
      "getSelectedMonitor",
      "getWordChart",
      "getWordCloud",
      "getWordCloudStartDate",
      "getWordCloudEndDate",
      "getWordCloudWordChart",
      "getSentiment",
      "getSentimentChart",
      "getSentimentAll",
      "getSentimentFacebook",
      "getSentimentTwitter",
      "getSentimentPantip",
      "getSentimentYoutube",
      "getSentimentInstagram",
      "getSentimentNews",
      "getWordCloudSocial",
      "getSentimentAllPost",

      "getSentimentFacebookPost",
      "getSentimentTwitterPost",
      "getSentimentPantipPost",
      "getSentimentYoutubePost",
      "getSentimentInstagramPost",
      "getSentimentNewsPost",

      "getSentimentFacebookComment",
      "getSentimentTwitterComment",
      "getSentimentPantipComment",
      "getSentimentYoutubeComment",
      "getSentimentInstagramComment",
      "getSentimentNewsComment",
      "getSentimentAllComment"
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
  },
};
</script>
<style scoped>
#slbox{
  width: -webkit-fill-available;
}
.disp{
  display: contents;
}
.users {
  /* margin-top: 25%; */
  margin-right: 0%;
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
  width: 47px;
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
  margin-bottom: 25px;
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
#all-btn {
  padding-top: 9px !important;
  padding-bottom: 9px !important;
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
  width: fit-content;
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
  #menu ul{
    margin-left: 100px;
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
  .tablewords{
    margin-left: 5cm;
  }
  .users {
    margin-right: 5cm ;
  }
  .cardchart{
    page-break-inside: auto;
  }
  /* .piechart {
    margin-left: 55cm ;
  } */
}
</style>