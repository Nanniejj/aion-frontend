<template>
  <b-col sm="12" md="6" lg="4">
    <!-- <div class="box" id="facebook" v-b-modal.modal-1> -->
    <vue-element-loading
      :active="getLoadStatus"
      size="80"
      background-color="rgba(255, 255, 255, 0.3)"
      color="#fbf7f6"
    />
    <div class="box" id="facebook" @click="toPlatform">
      <div class="left"></div>
      <div style="cursor: pointer">
        <!-- <i class="fab fa-facebook-f fa-2x"></i> -->
        <img src="@/assets/Facebook.png" class="socialogo" />

        <div class="md-font">
          โพสต์ที่เกี่ยวข้อง
          <span class="total-all">
            {{ getFacebook.post | numFormat }}
          </span>
        </div>
        <b-container>
          <b-row class="comment-post">
            <b-col class="border-right">
              <div class="md-font dp">Users</div>
              <div class="total-sub">
                <span class="prt">Users : </span>
                {{ getFacebook.users | numFormat }}
              </div>
            </b-col>
            <b-col class="border-left">
              <div class="md-font dp">Messages</div>
              <div class="total-sub">
                <span class="prt">Messages : </span
                >{{ getFacebook.comment + getFacebook.post | numFormat }}
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
              <div>
                <span class="prt">Posts : </span
                >{{ getSumFacebook.post | numFormat }}
              </div>
              <div>
                <span class="prt">Comments : </span
                >{{ getSumFacebook.comment | numFormat }}
              </div>
              <div>
                <span class="prt">Users : </span
                >{{ Number(getSumFacebook.users) | numFormat }}
              </div>
              <div>
                <span class="prt">ข้อมูลที่ไปเก็บ : </span
                >{{ getCraw.crawler_facebook | numFormat }}
              </div>
              <div>
                <span class="prt">ข้อมูลที่ประมวลผลได้ : </span
                >{{ getCraw.preprocess_facebook | numFormat }}
              </div>
              <!-- <span class="prt">Post : </span><div>{{stratFormat }}</div>
              <span class="prt">Post : </span><div>{{EndFormat }}</div> -->
            </b-col>
          </b-row>
        </b-container>
        <br />
      </div>
    </div>
    <b-modal id="modal-1" size="lg" centered>
      <b-container>
        <b-row>
          <b-col align-self="center">
            <!-- <img src="@/assets/Facebook.png" class="socialicon" /> -->
            <h1 class="sentiment lg-font">Sentiment</h1>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div class="doc md-font">
              <img src="@/assets/Facebook.png" class="socialicon" /> เอกสารที่พบ
              <strong> {{ getFacebook.post | numFormat }} </strong>
              (Comments/Posts)
            </div>
          </b-col>
        </b-row>
        <!-- <TimelineChart :chartDataTimeline='getTimelineFacebook' /> -->
        <SentimentChart
          v-if="getFacebook.total_sentiments"
          :source="'facebook'"
          :chartData="getFacebook.total_sentiments"
          :pageType="'DashboardPage'"
        />
      </b-container>
    </b-modal>
  </b-col>
</template>

<script>
import { mapGetters } from "vuex";
import SentimentChart from "../chart/SentimentChart.vue";
// import TimelineChart from "../chart/TimelineChart.vue";

export default {
  data: function() {
    return {
      dateToday: new Intl.DateTimeFormat("en-AU").format(),
      fbPost: "",
      showDetail: true,
      open: false,
    };
  },

  computed: {
    ...mapGetters([
      "getFacebook",
      "getSumFacebook",
      "getTimelineFacebook",
      "getDateChoice",
      "getSumDB",
      "getCraw",
      "getLoadStatus",
    ]),
    stratFormat() {
      var startDate = String(this.getSumFacebook.startdate)
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
    EndFormat() {
      var endDate = String(this.getSumFacebook.enddate)
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
      var sweek = new Date(this.getTimelineFacebook[1][0]).toLocaleDateString(
        "en-AU"
      );
      return sweek;
    },
    endWeek() {
      var eweek = new Date(this.getTimelineFacebook[8][0]).toLocaleDateString(
        "en-AU"
      );
      return eweek;
    },
    startMonth() {
      var smonth = new Date(this.getTimelineFacebook[1][0]).toLocaleDateString(
        "en-AU"
      );
      return smonth;
    },
    endMonth() {
      var emonth = new Date(
        this.getTimelineFacebook[this.getTimelineFacebook.length - 1][0]
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
      this.$store.commit("setNamePlatform", "facebook");
    },
    hideModal() {
      this.open = false;
    },
    onOptionsChange: function() {
      this.$store.commit("changeDataChoice", { choice: this.type_selected });
    },
  },
};
</script>

<style scoped>
.modal-vue .modal-vue-show {
  width: 50% !important;
}

@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  #overflow-page {
    overflow: hidden;
  }
}

/* .sum-right {
  text-align: start;
} */
#sumboxfb {
  width: 100%;
  border: 2px solid #4867aa;
  background-color: white;
  padding-bottom: 20px;
  min-height: 14em;
}
.date2 {
  color: black;
  margin-left: 15% !important;
}
#overlay {
  position: fixed;
  display: none;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  cursor: pointer;
}
#foo.vue-popover.dropdown-position-bottom:before {
  left: calc(9% - 6px) !important;
}
.vue-popover#foo {
  left: unset !important;
}

#hr-title {
  background-color: rgb(72, 103, 170);
  height: 45px;
  width: 320px;
  margin-top: -49px;
  margin-left: -43px;
}
.hover-click {
  cursor: pointer;
}
#font-week {
  font-size: 1vw;
}

#dashboard {
  min-height: auto;
  padding-right: 0px !important;
}

.img-size {
  width: 30px;
  cursor: pointer;
}

.bl-txt {
  color: black;
}
.card-sum {
  padding: 0px;
  margin: 0;
  margin-bottom: 15px;
}
.card-body {
  min-height: 13rem;
}
.mb-2 {
  margin: auto;
}
.card-title {
  position: relative;
  z-index: 1;
  color: white;
}
.card-text:last-child {
  margin-top: 36px;
}
#tt-fb h4 {
  position: relative;
  z-index: 1;
  color: white;
  background-color: #4867aa;
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
.summpad {
  margin-top: 50px;
  padding-right: 15px;
  padding-left: 15px;
  padding-bottom: 20px;
  margin-right: auto;
  margin-left: auto;
}
#textsum {
  font-size: 25px;
}
#chart-text {
  flex-flow: nowrap;
}

.drop {
  color: #4c412b;
  background-color: #ede7dd;
  width: 125px;
  border-color: transparent;
}

.dropdown-toggle {
  color: #4c412b;
  background-color: #ede7dd;
  /* width: 125px; */
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

#submit {
  font-weight: bold;
  color: #ddd;
  border: 2px solid #fed16e;
  line-height: 1;
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color: transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
}

#submit:hover {
  background-color: #fed16e;
  color: white;
}

.btn.focus,
.btn:focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0);
}
#facebook {
  background-color: #4867aa;
  color: #ffffff;
}
.boxr {
  margin: auto;
  margin-left: 15%;
  max-width: 80%;
}
.modal-content {
  padding: 40px;
  padding-top: 0px;
}
button.close {
  font-size: 40px;
}

#firstfb {
  top: 50%;
  left: 10%;
}

#firstfb::after {
  left: 10%;
}

.select {
  margin-left: 49%;
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
.date {
  color: black;
}

.date2 {
  color: black;
  margin-left: 40%;
  margin-top: 15px;
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

.doc {
  color: #695a3d;
  text-align: start;
}

#news-total {
  margin-top: 15px;
  margin-left: 40%;
}

@media only screen and (max-width: 1150px) {
  .box .tooltiptext {
    width: 45em;
  }

  .boxr {
    margin: auto;
    max-width: 100%;
    margin-left: 9%;
  }

  #firstfb {
    left: 0;
    margin-left: -81px;
  }

  #firstfb::after {
    left: 25%;
  }
}

@media only screen and (min-width: 1150px) and (max-width: 1750px) {
  #dashboard {
    height: auto;
  }
  .box .tooltiptext {
    width: 55em;
  }
  .boxr {
    margin: auto;
    max-width: 100%;
  }

  #firstfb {
    left: 0;
    margin-left: -81px;
  }

  #firstfb::after {
    left: 25%;
  }
}
@media only screen and (min-width: 1024px) and (max-width: 1370px) {
  #sumboxsum {
    min-height: 50vh;
    padding-top: 90px;
  }
}
@media only screen and (min-width: 0px) and (max-width: 985px) {
  .col-sm-4 {
    flex: 42.333333%;
    max-width: 58.333333%;
  }
  #sumboxsum {
    min-height: 50vh;
  }
}
@media only screen and (min-width: 0px) and (max-width: 941px) {
  #dashboard {
    min-height: auto;
  }
  .boxr {
    margin: auto;
    max-width: 100%;
    margin-left: 6%;
  }

  .box .tooltiptext {
    width: 28em;
  }
  #firstfb {
    left: 0;
    margin-left: -67px;
  }
  #firstfb::after {
    left: 24%;
  }
}

@media only screen and (min-width: 820px) and (max-width: 990px) {
  #font-week {
    font-size: 1.5vw;
  }
  /* .md-font {
    font-size: 1.5vw !important;
  } */
  #dashboard {
    overflow: hidden;
  }
}

@media only screen and (min-device-width: 770px) and (max-width: 850px) {
  div #g-chart {
    margin-left: -44px !important;
  }
  /* .md-font {
    font-size: 2.2vw !important;
  } */
  .legend a {
    display: block;
  }

  .total-all {
    font-size: 2.7vw !important;
  }

  .total-sub {
    font-size: 3vw !important;
  }

  .socialogo {
    width: 15% !important;
  }

  .img-size {
    width: 5vw !important;
  }
  .vue-popover#foo {
    width: 85vw !important;
    z-index: 2 !important;
    left: -29px !important;
    top: 50px !important;
  }
  #foo.vue-popover.dropdown-position-bottom[data-v-aae30ed8]:before {
    left: calc(48% - 6px) !important;
  }
  .vue-popover[data-v-aae30ed8] {
    padding: 15px;
  }
}

@media only screen and (min-device-width: 768px) and (max-device-width: 1000px) {
  .align-self-center {
    display: contents;
  }
  .date2 {
    white-space: nowrap;
    margin-left: 18vw !important;
  }
  .sentiment {
    width: 100%;
  }
  #font-week {
    font-size: 2vw;
  }
  .col-sm-4 {
    flex: 42.333333%;
    max-width: 58.333333%;
  }
  /* .md-font {
    font-size: 2vw !important;
  } */
  .legend {
    font-size: 1.7vw !important;
  }
  #dashboard {
    overflow: hidden;
  }
}

@media only screen and (min-width: 375px) and (max-width: 815px) {
  .col-sm-4 {
    flex: unset;
    max-width: unset;
  }
  .box .tooltiptext {
    width: auto !important;
  }

  #firstfb {
    margin-left: -40px !important;
  }

  div #g-chart {
    width: 336px;
    overflow: hidden;
    margin-left: -64px !important;
  }
  .modal-content {
    padding: 15px;
    padding-top: 0px;
    overflow: hidden;
  }
  .bl-txt md-font {
    margin-top: -28px;
    margin-bottom: 10px;
  }

  .sum-pad {
    padding-left: 0;
    padding-right: 0;
  }
  .summpad {
    padding-right: 15%;
    padding-left: 15%;
  }
  .card-text {
    font-size: 4vw;
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
  #icon-chart {
    margin-top: -25px;
  }
  .vue-popover#foo {
    width: 75vw !important;
    z-index: 2 !important;
    left: -1px !important;
    top: 50px !important;
  }
  #foo.vue-popover.dropdown-position-bottom[data-v-aae30ed8]:before {
    left: calc(48% - 6px) !important;
  }
  .vue-popover[data-v-aae30ed8] {
    padding: 15px;
  }
  .date2 {
    margin-left: unset !important;
  }
  #font-month {
    font-size: 2vw;
    margin-left: 34vw;
  }
  #font-week {
    font-size: 2vw;
    margin-left: 34vw;
  }
  h1,
  .h1 {
    font-size: 1.5rem;
  }
  .align-self-center {
    display: contents;
  }

  .legend {
    margin-top: 11px;
  }
  .col-2 {
    flex: 0 0 25.666667%;
    max-width: 25.666667%;
  }
  .sentiment[data-v-aae30ed8] {
    width: 100%;
  }
  .date[data-v-aae30ed8] {
    margin-left: 43vw;
  }
}

@media only screen and (min-width: 0px) and (max-width: 600px) {
  .col-sm-4 {
    flex: unset;
    max-width: unset;
  }

  .box .tooltiptext {
    width: auto !important;
  }
  #firstfb {
    margin-left: -40px !important;
  }
  div #g-chart {
    width: 336px;
    overflow: hidden;
    margin-left: -64px !important;
  }
  .modal-content {
    padding: 15px;
    padding-top: 0px;
    overflow: hidden;
  }
  .bl-txt md-font {
    margin-top: -28px;
    margin-bottom: 10px;
  }

  .sum-pad {
    padding-left: 0;
    padding-right: 0;
  }
  .summpad {
    padding-right: 15%;
    padding-left: 15%;
  }
  .card-text {
    font-size: 4vw;
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
  #icon-chart {
    margin-top: -25px;
  }
  .vue-popover#foo,
  .vue-popover#foo2,
  .vue-popover#foo3,
  .vue-popover#foo4,
  .vue-popover#foo5,
  .vue-popover#foo6 {
    width: 85vw !important;
    z-index: 2 !important;
    left: -1px !important;
    top: 50px !important;
  }
  #foo.vue-popover.dropdown-position-bottom[data-v-aae30ed8]:before {
    left: calc(48% - 6px) !important;
  }
  .vue-popover[data-v-aae30ed8] {
    padding: 15px;
  }
  .date2 {
    margin-left: unset !important;
  }
  #font-month {
    font-size: 3.5vw;
    margin-left: 18vw;
  }
  #font-week {
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
    font-size: 4vw !important;
  } */
  .legend {
    margin-top: 11px;
  }
  .col-2 {
    flex: 0 0 25.666667%;
    max-width: 25.666667%;
  }
  .sentiment[data-v-aae30ed8] {
    width: 100%;
  }
  .date[data-v-aae30ed8] {
    margin-left: 43vw;
  }
}
</style>
