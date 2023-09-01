<template>
  <div class="px-4 mt-2">
    <!-- getLoadStat -->
    <!-- {{ social }} -->
    <!-- {{ getStatData }} -->
    <vue-element-loading
      :active="false"
      size="80"
      background-color="rgba(255, 255, 255, 0.5)"
      color="#fbf7f6"
    />
    <span class="mt-3 mb-3">
      <div class="text-left">
        <span class="h5 mr-4 d-inline-block">Statistics</span>
      </div>
      <b-row class="w-100">
        <!-- stat -->

        <b-col lg="12" class="text-left">
          <b-row cols="2" class="font-icon" cols-lg="3" cols-md="2">
            <b-col>
              <b-row>
                <b-col cols="auto"
                  ><i class="far fa-comments fa-2x d-inline" />
                </b-col>
                <b-col cols="auto">
                  <div class="text-icon">
                    <b>{{
                      (getStatData.comments_count + getStatData.totalPost)
                        | numFormat
                    }}</b>
                    <br />
                    Messages
                  </div>
                </b-col>
              </b-row>
            </b-col>

            <b-col>
              <b-row>
                <b-col cols="auto"
                  ><i class="fa fa-paper-plane fa-2x d-inline" />
                </b-col>
                <b-col cols="auto">
                  <div class="text-icon">
                    <b>{{ getStatData.totalPost | numFormat }}</b> <br />
                    Posts
                  </div>
                </b-col>
              </b-row>
            </b-col>

            <b-col>
              <b-row>
                <b-col cols="auto"
                  ><i class="far fa-comment fa-2x d-inline" />
                </b-col>
                <b-col cols="auto">
                  <div class="text-icon">
                    <b>{{ getStatData.comments_count | numFormat }}</b> <br />
                    Comments
                  </div>
                </b-col>
              </b-row>
            </b-col>
            <b-col>
              <b-row>
                <b-col cols="auto"><i class="fas fa-users fa-2x"></i> </b-col>
                <b-col cols="auto">
                  <div class="text-icon">
                    <b> {{ getStatData.Accounts | numFormat }} </b><br />
                    Users
                  </div>
                </b-col>
              </b-row>
            </b-col>
            <b-col>
              <b-row>
                <b-col cols="auto"
                  ><i class="far fa-thumbs-up fa-2x"></i>
                </b-col>
                <b-col cols="auto">
                  <div class="text-icon">
                    <b>{{ getStatData.engagement | numFormat }}</b> <br />
                    Engages
                  </div>
                </b-col>
              </b-row>
            </b-col>
            <b-col>
              <b-row>
                <b-col cols="auto"><i class="fas fa-retweet fa-2x"></i> </b-col>
                <b-col cols="auto">
                  <div class="text-icon">
                    <b>{{ getStatData.retweets_count | numFormat }} </b><br />
                    Retweet
                  </div>
                </b-col>
              </b-row>
            </b-col>

            <!-- <b-col>
              <b-row>
                <b-col cols="auto"><i class="fas fa-heart fa-2x"></i> </b-col>
                <b-col cols="auto">
                  <div class="text-icon">
                    <b>{{ dataStat.likes_count | numFormat }}</b> <br />
                    Likes
                  </div>
                </b-col>
              </b-row>
            </b-col> -->
          </b-row>
        </b-col>
      </b-row>
    </span>
  </div>
</template>

<script>
//import axios from "axios";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  watch: {
    // getArrDate: function() {
    //   this.updateStat();
    // },
  },
  props: {
    social: String,
    tabs: String,
  },
  computed: {
    getStatData() {
      let stat = {
        likes_count: 0,
        comments_count: 0,
        retweets_count: 0,
        engagement: 0,
        totalPost: 0,
        positiveSentiment: 0,
        neutralSentiment: 0,
        negativeSentiment: 0,
        Accounts: 0,
      };
      if (this.tabs == "word") {
        if (this.social == "facebook") {
          stat = this.getSentimentFacebookPost;
        } else if (this.social == "twitter") {
          stat = this.getSentimentTwitterPost;
        } else if (this.social == "pantip") {
          stat = this.getSentimentPantipPost;
        } else if (this.social == "instagram") {
          stat = this.getSentimentInstagramPost;
        } else if (this.social == "youtube") {
          stat = this.getSentimentYoutubePost;
        } else if (this.social == "blockdit") {
          stat = this.getSentimentBlockditPost;
        } else if (this.social == "news") {
          stat = this.getSentimentNewsPost;
        } else if (this.social == "tiktok") {
          stat = this.getSentimentTiktokPost;
        } else {
          stat = this.getSentimentAllPost;
        }
      }
      if (this.tabs == "hashtag") {
        if (this.social == "facebook") {
          stat = this.getSentimentHashtagFacebookPost;
        } else if (this.social == "twitter") {
          stat = this.getSentimentHashtagTwitterPost;
        } else if (this.social == "pantip") {
          stat = this.getSentimentHashtagPantipPost;
        } else if (this.social == "instagram") {
          stat = this.getSentimentHashtagInstagramPost;
        } else if (this.social == "youtube") {
          stat = this.getSentimentHashtagYoutubePost;
        } else if (this.social == "blockdit") {
          stat = this.getSentimentHashtagBlockditPost;
        } else if (this.social == "news") {
          stat = this.getSentimentHashtagNewsPost;
        } else if (this.social == "tiktok") {
          stat = this.getSentimentHashtagTiktokPost;
        } else {
          stat = this.getSentimentHashtagAllPost;
        }
      }
      return stat;
    },
    ...mapGetters([
      "getClickDomain",
      "getSdateDm",
      "getEdateDm",
      "getLoadStat",
      "getArrDate",
      "getSentimentFacebookPost",
      "getSentimentYoutubePost",
      "getSentimentTwitterPost",
      "getSentimentPantipPost",
      "getSentimentYoutubePost",
      "getSentimentTiktokPost",
      "getSentimentNewsPost",
      "getSentimentInstagramPost",
      "getSentimentBlockditPost",
      "getSentimentAllPost",
      "getSentimentHashtagFacebookPost",
      "getSentimentHashtagTwitterPost",
      "getSentimentHashtagInstagramPost",
      "getSentimentHashtagPantipPost",
      "getSentimentHashtagNewsPost",
      "getSentimentHashtagYoutubePost",
      "getSentimentHashtagBlockditPost",
      "getSentimentHashtagTiktokPost",
      "getSentimentHashtagAllPost",
    ]),
  },
  data() {
    return {
      startd: "",
      endd: "",
      valpos: 0,
      valnag: 0,
      val: 0,
      dataStat: [],
      avgComment: 0,
      avgEngage: 0,
    };
  },
  methods: {
    async updateStat() {
      this.startd = this.getSdateDm.slice(0, 10);
      this.endd = this.getEdateDm.slice(0, 10);
      let sdate, edate;
      sdate = "&start=" + this.getSdateDm;
      edate = "&end=" + this.getEdateDm;
      this.$store.commit("setLoadStat", true);
      var config = {
        method: "get",
        url:
          "https://api2.cognizata.com/api/v2/userposts/getStatistics?domain=" +
          this.getClickDomain +
          sdate +
          edate,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      await this.axios(config).then((response) => {
        // avg/day
        var getDaysArray = function(s, e) {
          for (
            var a = [], d = new Date(s);
            d <= e;
            d.setDate(d.getDate() + 1)
          ) {
            a.push(new Date(d));
          }
          return a;
        };
        var daylist = getDaysArray(
          new Date(this.getSdateDm),
          new Date(this.getEdateDm)
        );
        daylist
          .map((v) =>
            moment(v)
              .format()
              .slice(0, 10)
          )
          .join("");
        this.dataStat = response.data;
        this.avgComment = this.dataStat.comments_count / daylist.length;
        this.avgEngage = this.dataStat.engagement / daylist.length;

        //bar sentiment
        let sum =
          this.dataStat.positiveSentiment +
          this.dataStat.neutralSentiment +
          this.dataStat.negativeSentiment;
        this.valpos = (this.dataStat.positiveSentiment * 100) / sum;
        this.val = (this.dataStat.neutralSentiment * 100) / sum;
        this.valnag = (this.dataStat.negativeSentiment * 100) / sum;

        this.$store.commit("setLoadStat", false);
      });
    },
  },
};
</script>

<style scoped>
.onedate,
.twodate {
  left: -14px;
  position: relative;
}
.progress {
  font-size: 14px;
  background-color: #e9ecef00;
}
.lbvn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #ea7668;
  text-align: center;
  margin-left: 8px;
  min-width: fit-content;
}
.lbv {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #368ab6;
  text-align: center;
  margin-left: 8px;
  min-width: fit-content;
}
.lbvp {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #53b993;
  text-align: center;
  margin-left: 8px;
  min-width: fit-content;
}
#barpos .progress-bar {
  background-color: #53b993;
  border-radius: 10px;
}
#bar .progress-bar {
  background-color: #368ab6;
  border-radius: 10px;
}
#barnag .progress-bar {
  background-color: #ea7668;
  border-radius: 10px;
}
.v-cen {
  align-items: center;
  justify-content: center;
}
.icon-sen {
  width: 33px;
}
.row-cols-2 > * {
  margin: 10px 0px;
}
div.col.avg {
  flex: 0 0 50% !important;
  max-width: 50% !important;
}
.text-icon {
  line-height: 17px;
}
.col-auto {
  padding: 5px 2px 5px 5px;
}
.box-domain {
  width: 100%;
  height: auto;
  padding: 20px 20px;
  border-radius: 7px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
@media only screen and (min-width: 0px) and (max-width: 990px) {
  .font-icon {
    font-size: small;
  }
}
</style>
