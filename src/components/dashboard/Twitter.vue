<template>
  <b-col sm="12" md="6" lg="4">
    <!-- <div class="box" id="twitter" v-b-modal.modal-2> -->
    <vue-element-loading
      :active="getLoadStatus"
      size="80"
      background-color="rgba(255, 255, 255, 0.3)"
      color="#b6ac9a"
    />
    <div class="box" id="twitter" @click="toPlatform">
      <div class="left"></div>
      <img src="@/assets/Twitter.png" class="socialogo" />
      <!-- <i class="fa fa-x-twitter"></i> -->
      <div class="md-font">
        ทวิตที่เกี่ยวข้อง
        <span class="total-all"> {{ getTwitter.post | numFormat }} </span>
      </div>
      <b-container>
        <b-row class="comment-post">
          <b-col class="border-right">
            <div class="md-font dp">Users</div>
            <div class="total-sub">
              <span class="prt">Users : </span
              >{{ getTwitter.users | numFormat }}
            </div>
          </b-col>
          <b-col class="border-left">
            <div class="md-font dp">Messages</div>
            <div class="total-sub">
              <span class="prt">Messages : </span
              >{{ (getTwitter.comment + getTwitter.post) | numFormat }}
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
            <!-- <div><i class="fas fa-cloud-download-alt" /></div>
            <div><i class="fas fa-database" /></div> -->
            <!-- <div>Start</div>
              <div>End</div> -->
          </b-col>
          <b-col cols="7" class="sum-right">
            <div>
              <span class="prt">Posts : </span
              >{{ getSumTwitter.post | numFormat }}
            </div>
            <div>
              <span class="prt">Comments : </span
              >{{ getSumTwitter.comment | numFormat }}
            </div>
            <div>
              <span class="prt">Users : </span
              >{{ Number(getSumTwitter.users) | numFormat }}
            </div>
            <!-- <div>
              <span class="prt">ข้อมูลที่ไปเก็บ : </span
              >{{ getCraw.crawler_twitter | numFormat }}
            </div>
            <div>
              <span class="prt">ข้อมูลที่ประมวลผลได้ : </span
              >{{ getCraw.preprocess_twitter | numFormat }}
            </div> -->
            <!-- <div>{{startFormat}}</div>
              <div>{{endFormat}}</div> -->
          </b-col>
        </b-row>
      </b-container>
      <br />
    </div>

    <b-modal id="modal-2" size="lg" centered>
      <b-container>
        <b-row>
          <b-col align-self="center">
            <h1 class="sentiment lg-font">Sentiment</h1>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div class="doc md-font">
              <img src="@/assets/Twitter.png" class="socialicon" /> เอกสารที่พบ
              <strong> {{ getTwitter.post | numFormat }} </strong>
              (Comments/Posts)
            </div>
          </b-col>
        </b-row>
        <SentimentChart
          v-if="getTwitter.total_sentiments"
          :source="'twitter'"
          :chartData="getTwitter.total_sentiments"
          :pageType="'DashboardPage'"
        />
        <!-- <SentimentChart :chartData="getTwitter.sentiment" /> -->
      </b-container>
    </b-modal>
  </b-col>
</template>

<script>
import { mapGetters } from "vuex";
import SentimentChart from "../chart/SentimentChart.vue";

export default {
  data: function() {
    return {
      type_selected: "week",
      showDetail: true,
      dateToday: new Intl.DateTimeFormat("en-AU").format(),
    };
  },
  components: {
    SentimentChart,
  },
  computed: {
    ...mapGetters([
      "getTwitter",
      "getSumTwitter",
      "getTimelineTwitter",
      "getDateChoice",
      "getCraw",
      "getLoadStatus",
    ]),
    startFormat() {
      var startDate = String(this.getSumTwitter.startdate)
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
      var endDate = String(this.getSumTwitter.enddate)
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
      var sweek = new Date(this.getTimelineTwitter[1][0]).toLocaleDateString(
        "en-AU"
      );
      return sweek;
    },
    endWeek() {
      var eweek = new Date(this.getTimelineTwitter[8][0]).toLocaleDateString(
        "en-AU"
      );
      return eweek;
    },
    startMonth() {
      var smonth = new Date(this.getTimelineTwitter[1][0]).toLocaleDateString(
        "en-AU"
      );
      return smonth;
    },
    endMonth() {
      var emonth = new Date(
        this.getTimelineTwitter[this.getTimelineFacebook.length - 1][0]
      ).toLocaleDateString("en-AU");
      return emonth;
    },
  },
  methods: {
    toPlatform() {
      this.$store.commit("setToPlatform", false);
      this.$store.commit("setNamePlatform", "twitter");
    },
  },
};
</script>

<style scoped>
/* #twitter {
  background-color: #ffffff;
  color: #ffffff;
  cursor: pointer;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
} */
#twitter {
  background: rgb(45, 45, 50);
  background: linear-gradient(
    145deg,
    rgba(45, 45, 50, 1) 10%,
    rgba(0, 0, 0, 1) 55%
  );
  color: #ffffff;
  cursor: pointer;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
}
#twitter:hover {
  box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset,
    rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
    rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px,
    rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px,
    rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
}
#sumboxtw {
  width: 100%;
  border: 2px solid #5baade;
  background-color: white;
  padding-bottom: 20px;
  min-height: 14em;
}
.date2 {
  color: black;
  margin-left: 15% !important;
}
.vue-popover#foo2 {
  left: -100% !important;
}
/* #content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
} */
#tt-tw h4 {
  position: relative;
  z-index: 1;
  color: white;
  background-color: rgb(91, 170, 222);
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
#secondtw {
  top: 50%;
  left: -16.8rem;
}
#secondtw::after {
  left: 49%;
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

@media only screen and (max-width: 1150px) {
  .box .tooltiptext {
    width: 45em;
  }
  #secondtw {
    left: 11em;
    margin-left: -483px;
  }
  #secondtw::after {
    left: 65%;
  }
}

@media only screen and (min-width: 1150px) and (max-width: 1750px) {
  .box .tooltiptext {
    width: 55em;
  }
  #secondtw {
    left: 11em;
    margin-left: -483px;
  }
  #secondtw::after {
    left: 65%;
  }
}

@media only screen and (min-width: 0px) and (max-width: 941px) {
  .box .tooltiptext {
    width: 28em;
  }
  #secondtw {
    left: 0;
    margin-left: -67px;
  }
  #secondtw::after {
    left: 24%;
  }
}

@media only screen and (min-width: 820px) and (max-width: 990px) {
  /* .md-font {
    font-size: 1.5vw !important;
  } */
  .vue-popover#foo2 {
    left: -60% !important;
  }
  #foo2.vue-popover.dropdown-position-bottom:before {
    left: calc(85% - 6px) !important;
  }
  #foo2.vue-popover.dropdown-position-bottom:before {
    left: calc(85% - 6px) !important;
  }
}

@media only screen and (min-device-width: 770px) and (max-width: 850px) {
  /* .md-font {
    font-size: 2.2vw !important;
  } */
  .total-all {
    font-size: 2.7vw !important;
  }
  .total-sub {
    font-size: 3vw !important;
  }
  .socialogo {
    width: 15% !important;
  }
  .vue-popover#foo2 {
    width: 85vw !important;
    z-index: 2 !important;
    left: -29px !important;
    top: 50px !important;
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
  .vue-popover#foo2 {
    left: -41% !important;
  }
  #foo2.vue-popover.dropdown-position-bottom:before {
    left: calc(90% - 6px) !important;
  }
  #foo2.vue-popover.dropdown-position-bottom:before {
    left: calc(90% - 6px) !important;
  }
}

@media only screen and (min-width: 375px) and (max-width: 815px) {
  .box .tooltiptext {
    width: auto !important;
  }
  #secondtw {
    margin-left: -40px !important;
  }
  .bg_title img[data-v-aae30ed8] {
    left: 120px;
  }
  .vue-popover#foo2 {
    width: 75vw !important;
    z-index: 2 !important;
    left: -1px !important;
    top: 50px !important;
  }
  .date2 {
    margin-left: unset !important;
  }
  #font-month {
    font-size: 2vw;
    margin-left: 34vw;
  }
  h1,
  .h1 {
    font-size: 1.5rem;
  }
  .sentiment[data-v-aae30ed8] {
    width: 100%;
  }
}

@media only screen and (min-width: 0px) and (max-width: 600px) {
  .box .tooltiptext {
    width: auto !important;
  }
  #secondtw {
    margin-left: -40px !important;
  }
  .bg_title img[data-v-aae30ed8] {
    left: 120px;
  }
  .vue-popover#foo2 {
    width: 85vw !important;
    z-index: 2 !important;
    left: -1px !important;
    top: 50px !important;
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
  /* .md-font {
    font-size: 3.5vw !important;
  } */
  .sentiment[data-v-aae30ed8] {
    width: 100%;
  }
}
</style>
