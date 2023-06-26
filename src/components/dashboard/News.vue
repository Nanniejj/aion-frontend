


<template>
  <b-col sm="12" md="6" lg="4">
    <!-- <div class="box" id="news" v-b-modal.modal-4> -->
    <vue-element-loading
      :active="getLoadStatus"
      size="80"
      background-color="rgba(255, 255, 255, 0.3)"
      color="#fbf7f6"
    />
    <div class="box" id="news" @click="toPlatform">
      <div class="right"></div>
      <!-- <i class="far fa-newspaper fa-2x"></i> -->
      <img src="@/assets/News.png" class="socialogo" />
      <div class="md-font">
        ข่าวที่เกี่ยวข้อง
        <span class="total-all"> {{ getNews.post | numFormat  }} </span>
      </div>
      <b-container>
        <b-row class="comment-post">
          <b-col class="border-right">
            <div class="md-font dp">Sources</div>
            <div class="total-sub">
              <span class="prt"><br />Sources : </span
              >{{ getNews.users | numFormat  }}
            </div>
          </b-col>
          <b-col class="border-left">
            <div class="md-font dp">Messages</div>
            <div class="total-sub">
              <span class="prt">Messages : </span>
              {{ (getNews.comment + getNews.post) | numFormat }}
            </div>
          </b-col>
        </b-row>
        <b-row class="comment-post">
          <b-col cols="12" class="dp"><div>Summary</div></b-col>
          <span class="prt"><br />จำนวนรวม</span>
        </b-row>
        <b-row class="md-font">
          <b-col cols="5">
            <div><i class="far fa-paper-plane" /></div>
            <div><i class="far fa-comments" /></div>
            <div><i class="fas fa-users" /></div>
            <div><i class="fas fa-cloud-download-alt" /></div>
            <div><i class="fas fa-database" /></div>
            <!-- <div>Start</div>
                <div>End</div> -->
          </b-col>
          <b-col cols="7" class="sum-right">
            <div class="md-font">
              <span class="prt">Posts : </span>
              {{ getSumNews.post | numFormat  }}
            </div>
            <div>
              <span class="prt">Comments : </span
              >{{ getSumNews.comment | numFormat  }}
            </div>
            <!-- <div> {{newsComment_sum}}</div> -->
            <div class="md-font">
              <span class="prt">Users : </span>
              {{ Number(getSumNews.users) | numFormat  }}
            </div>
            <div>
              <span class="prt">ข้อมูลที่ไปเก็บ : </span
              >{{ getCraw.crawler_news | numFormat  }}
            </div>
            <div>
              <span class="prt">ข้อมูลที่ประมวลผลได้ : </span
              >{{ getCraw.preprocess_news | numFormat  }}
            </div>

            <!-- <div  class="md-font"> {{ startFormat}} </div>
                <div  class="md-font"> {{ endFormat}} </div> -->
          </b-col>
        </b-row>
      </b-container>
      <br />
    </div>

    <b-modal id="modal-4" size="lg" centered>
      <b-container>
        <b-row>
          <b-col align-self="center">
            <h1 class="sentiment lg-font">Sentiment</h1>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div class="doc md-font">
              <img src="@/assets/News.png" class="socialicon" /> เอกสารที่พบ
              <strong> {{ getNews.post | numFormat  }}</strong>
              (Comments/Posts)
            </div>
          </b-col>
        </b-row>
        <SentimentChart
          v-if="getNews.total_sentiments"
          :source="'news'"
          :chartData="getNews.total_sentiments"
          :pageType="'DashboardPage'"
        />
        <!-- <SentimentChart :chartData="getNews.sentiment" /> -->
      </b-container>
    </b-modal>
  </b-col>
</template>

<script>
import { mapGetters } from "vuex";
import SentimentChart from "../chart/SentimentChart.vue";

export default {
  data: function () {
    return {
      showDetail: true,
      dateToday: new Intl.DateTimeFormat("en-AU").format(),
    };
  },
  computed: {
    ...mapGetters([
      "getNews",
      "getSumNews",
      "getTimelineNews",
      "getDateChoice",
      "getCraw",
      "getLoadStatus",
    ]),
    startFormat() {
      var startDate = String(this.getSumNews.startdate)
        .replace("มกราคม", "ม.ค.")
        .replace("กุมภาพันธ์", "ก.พ.")
        .replace("มีนาคม ", "มี.ค.")
        .replace("เมษายน", "เม.ย.")
        .replace("พฤษภาคม", "พ.ค.")
        .replace("มิถุนายน ", "มิ.ย.")
        .replace("กรกฎาคม", "ก.ค.")
        .replace("สิงหาคม", "ส.ค.")
        .replace("กันยายน ", "ก.ย.")
        .replace("ตุลาคม", "ต.ค.")
        .replace("พฤศจิกายน", "พ.ย.")
        .replace("ธันวาคม ", "ธ.ค.");
      return startDate;
    },
    endFormat() {
      var endDate = String(this.getSumNews.enddate)
        .replace("มกราคม", "ม.ค. ")
        .replace("กุมภาพันธ์", "ก.พ. ")
        .replace("มีนาคม ", "มี.ค. ")
        .replace("เมษายน", "เม.ย. ")
        .replace("พฤษภาคม", "พ.ค. ")
        .replace("มิถุนายน ", "มิ.ย. ")
        .replace("กรกฎาคม", "ก.ค. ")
        .replace("สิงหาคม", "ส.ค. ")
        .replace("กันยายน ", "ก.ย. ")
        .replace("ตุลาคม", "ต.ค. ")
        .replace("พฤศจิกายน", "พ.ย. ")
        .replace("ธันวาคม ", "ธ.ค. ");
      return endDate;
    },
    startWeek() {
      var sweek = new Date(this.getTimelineNews[1][0]).toLocaleDateString(
        "en-AU"
      );
      return sweek;
    },
    endWeek() {
      var eweek = new Date(this.getTimelineNews[8][0]).toLocaleDateString(
        "en-AU"
      );
      return eweek;
    },
    startMonth() {
      var smonth = new Date(this.getTimelineNews[1][0]).toLocaleDateString(
        "en-AU"
      );
      return smonth;
    },
    endMonth() {
      var emonth = new Date(
        this.getTimelineNews[this.getTimelineFacebook.length - 1][0]
      ).toLocaleDateString("en-AU");
      return emonth;
    },
  },
  components: {
    SentimentChart,
  },
  methods: {
    toPlatform() {
      this.$store.commit("setToPlatform", false);
      this.$store.commit("setNamePlatform", "news");
    },
  },
};
</script>

<style scoped>
#news {
  background-color: #fed16e;
  color: #ffffff;
  cursor: pointer;
}
#sumboxnw {
  width: 100%;
  border: 2px solid #fdd16d;
  background-color: white;
  padding-bottom: 20px;
  min-height: 14em;
}
.date2 {
  color: black;
  margin-left: 15% !important;
}
#tt-nw h4 {
  position: relative;
  z-index: 1;
  color: white;
  background-color: #fed16e;
  padding-bottom: 12px;
  padding-top: 12px;
  margin-bottom: 17px;
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

#thirdns {
  top: 50%;
  left: -35rem;
}
#thirdns::after {
  left: 85%;
}

.bold a {
  color: #695a3d;
}

.total-all {
  font-size: 16pt;
  font-weight: bold;
}

.total-sub {
  font-size: calc(1em + 0.8vw);
  font-weight: bold;
}

.comment-post {
  margin-top: 15px;
}

.sentiment {
  color: black;
  text-align: start;
}

.date2 {
  color: black;
  margin-left: 40%;
  margin-top: 15px;
}

.doc {
  color: #695a3d;
  text-align: start;
}

#news-total {
  margin-top: 15px;
  margin-left: 40%;
}
#foo4.vue-popover.dropdown-position-bottom:before {
  left: calc(9% - 6px) !important;
}
.vue-popover#foo4 {
  left: unset !important;
}
@media only screen and (max-width: 1150px) {
  .box .tooltiptext {
    width: 45em;
  }
  #thirdns {
    left: 11em;
    margin-left: -483px;
  }
  #thirdns::after {
    left: 65%;
  }
}

@media only screen and (min-width: 1150px) and (max-width: 1750px) {
  .box .tooltiptext {
    width: 55em;
  }
  #thirdns {
    left: 11em;
    margin-left: -483px;
  }
  #thirdns::after {
    left: 65%;
  }
}

@media only screen and (min-width: 0px) and (max-width: 941px) {
  .box .tooltiptext {
    width: 28em;
  }
  #thirdns {
    left: 0;
    margin-left: -67px;
  }
  #thirdns::after {
    left: 24%;
  }
}
@media only screen and (min-width: 820px) and (max-width: 990px) {
  /* .md-font {
    font-size: 1.5vw !important;
  } */
  .vue-popover#foo4[data-v-aae30ed8] {
    left: -60% !important;
  }
  #foo4.vue-popover.dropdown-position-bottom:before {
    left: calc(85% - 6px) !important;
  }
}
@media only screen and (min-device-width: 770px) and (max-width: 850px) {
  /* .md-font {
    font-size: 2.2vw !important;
  } */
  .vue-popover#foo4 {
    width: 85vw !important;
    z-index: 2 !important;
    left: -29px !important;
    top: 50px !important;
  }
  #foo4.vue-popover.dropdown-position-bottom[data-v-aae30ed8]:before {
    left: calc(48% - 6px) !important;
  }
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1000px) {
  .date2 {
    white-space: nowrap;
    margin-left: 18vw !important;
  }
  .sentiment {
    width: 100%;
  }
  /* .md-font {
    font-size: 2vw !important;
  } */
  .vue-popover#foo4[data-v-aae30ed8] {
    left: -41% !important;
  }
  #foo4.vue-popover.dropdown-position-bottom:before {
    left: calc(90% - 6px) !important;
  }
}
@media only screen and (min-width: 375px) and (max-width: 815px) {
  .vue-popover#foo4 {
    width: 75vw !important;
    z-index: 2 !important;
    left: -1px !important;
    top: 50px !important;
  }
  #foo4.vue-popover.dropdown-position-bottom[data-v-aae30ed8]:before {
    left: calc(48% - 6px) !important;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .box .tooltiptext {
    width: auto !important;
  }
  #thirdns {
    margin-left: -40px !important;
  }
  .date2 {
    margin-left: unset !important;
  }
  #font-month {
    font-size: 3.5vw;
    margin-left: 18vw;
  }
  h1,
  .h1 {
    font-size: 1.5rem;
  }
  .align-self-center {
    display: contents;
  }
  /* .md-font {
    font-size: 3.5vw !important;
  } */
  .sentiment[data-v-aae30ed8] {
    width: 100%;
  }
  .vue-popover#foo4 {
    width: 85vw !important;
    z-index: 2 !important;
    left: -1px !important;
    top: 50px !important;
  }
  #foo4.vue-popover.dropdown-position-bottom[data-v-aae30ed8]:before {
    left: calc(48% - 6px) !important;
  }
}
</style>
