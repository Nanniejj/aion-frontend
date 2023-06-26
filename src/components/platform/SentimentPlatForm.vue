<template>
  <div>
    <!-- sentiment bar -->
    <b-row cols="1" class="mt-4">
      <b-col class="mb-1">
        <b-row class="v-cen">
          <b-col cols="auto">
            <img src="@/assets/Pos.png" class="icon-sen" />
          </b-col>
          <b-col>
            <b-progress id="barpos" height="20px">
              <b-progress-bar :value="valpos"></b-progress-bar
              ><span class="lbvp bold"
                >{{ dataStat.positive | numFormat }} posts</span
              >
            </b-progress>
          </b-col>
        </b-row>
      </b-col>

      <b-col class="mb-1">
        <b-row class="v-cen">
          <b-col cols="auto">
            <img src="@/assets/Neu.png" class="icon-sen" />
          </b-col>
          <b-col>
            <b-progress id="bar" height="20px">
              <b-progress-bar :value="val"></b-progress-bar
              ><span class="lbv bold"
                >{{ dataStat.neutral | numFormat }} posts</span
              >
            </b-progress>
          </b-col>
        </b-row>
      </b-col>

      <b-col class="mb-1">
        <b-row class="v-cen">
          <b-col cols="auto">
            <img src="@/assets/Nag.png" class="icon-sen" />
          </b-col>
          <b-col>
            <b-progress id="barnag" height="20px">
              <b-progress-bar :value="valnag"></b-progress-bar>
              <span class="lbvn bold"
                >{{ dataStat.negative | numFormat }} posts</span
              >
            </b-progress>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="mt-3 mb-4">
      <b-col>
        <div class="bold ptxt">Positive</div>
        <div class="bold small">{{ dataStat.positive | numFormat }} posts</div>
      </b-col>
      <b-col>
        <div class="bold ntxt">Neutral</div>
        <div class="bold small">{{ dataStat.neutral | numFormat }} posts</div>
      </b-col>
      <b-col>
        <div class="bold ngtxt">Negative</div>
        <div class="bold small">{{ dataStat.negative| numFormat }} posts</div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import moment from "moment";
export default {
  watch: {
    // getArrDate: function () {
    //   this.updateStat();
    // },
   getData(){
 this.updateStat();
    }
  },
  computed: {
    ...mapGetters([
      "getClickDomain",
      "getSdateDm",
      "getEdateDm",
      "getLoadStat",
      "getArrDate",
      "getTwitter",
      "getFacebook",
      "getPantip",
      "getYoutube",
      "getNews",
      "getInstagram",
      "getNamePlatform",
      "getBlockdit",
      "getTiktok"
    ]),
    getData(){
      var data;
      if (this.getNamePlatform == "twitter") {
        data = this.getTwitter.total_sentiments;
      } else if (this.getNamePlatform == "facebook") {
        data = this.getFacebook.total_sentiments;
      } else if (this.getNamePlatform == "pantip") {
        data = this.getPantip.total_sentiments;
      } else if (this.getNamePlatform == "youtube") {
        data = this.getYoutube.total_sentiments;
      } else if (this.getNamePlatform == "news") {
        data = this.getNews.total_sentiments;
      }else if (this.getNamePlatform == "blockdit") {
        data = this.getBlockdit.total_sentiments;
      } else if (this.getNamePlatform == "tiktok") {
        data = this.getTiktok.total_sentiments;
      } else {
        data = this.getInstagram.total_sentiments;
      }
      return data
    }
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
    updateStat() {
      // var data;
      // if (this.getNamePlatform == "twitter") {
      //   data = this.getTwitter.total_sentiments;
      // } else if (this.getNamePlatform == "facebook") {
      //   data = this.getFacebook.total_sentiments;
      // } else if (this.getNamePlatform == "pantip") {
      //   data = this.getPantip.total_sentiments;
      // } else if (this.getNamePlatform == "youtube") {
      //   data = this.getYoutube.total_sentiments;
      // } else if (this.getNamePlatform == "news") {
      //   data = this.getNews.total_sentiments;
      // } else {
      //   data = this.getInstagram.total_sentiments;
      // }
      this.dataStat = this.getData;
      //   this.avgComment = this.dataStat.comments_count;
      //   this.avgEngage = this.dataStat.engagement;
      let sum =
        this.dataStat.positive + this.dataStat.neutral + this.dataStat.negative;
      this.valpos = (this.dataStat.positive * 100) / sum;
      this.val = (this.dataStat.neutral * 100) / sum;
      this.valnag = (this.dataStat.negative * 100) / sum;
    },
  },
  created() {
    this.updateStat();
  },
};
</script>

<style scoped>
.ptxt{
  color: #53b993;  
}
.ntxt{
  color: #368ab6;
}
.ngtxt{
  color: #ea7668;
}
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
  padding: 50px 20px;
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