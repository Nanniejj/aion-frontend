<template>
  <b-col sm="12" md="6" lg="4">
    <!-- <div class="box" id="pantip" v-b-modal.modal-3> -->
    <vue-element-loading
      :active="getLoadStatus"
      size="80"
      background-color="rgba(255, 255, 255, 0.3)"
      color="#b6ac9a"
    />
    <div class="box" id="pantip" @click="toPlatform">
      <div class="left"></div>
      <img src="@/assets/board.png" class="socialogo" />
      <div class="md-font">
        กระทู้ที่เกี่ยวข้อง
        <span class="total-all"> {{ getPantip.post | numFormat }} </span>
      </div>
      <b-container>
        <b-row class="comment-post">
          <b-col class="border-right">
            <div class="md-font dp">Users</div>
            <div class="total-sub">
              <span class="prt">Users : </span>{{ getPantip.users | numFormat }}
            </div>
          </b-col>
          <b-col class="border-left">
            <div class="md-font dp">Messages</div>
            <div class="total-sub">
              <span class="prt">Messages : </span
              >{{ (getPantip.comment + getPantip.post) | numFormat }}
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
              <span class="prt">Posts : </span>
              {{ getSumPantip.post | numFormat }}
            </div>
            <div>
              <span class="prt">Comments : </span>
              {{ getSumPantip.comment | numFormat }}
            </div>
            <div>
              <span class="prt">Users : </span>
              {{ Number(getSumPantip.users) | numFormat }}
            </div>
            <!-- <div>
              <span class="prt">ข้อมูลที่ไปเก็บ : </span
              >{{ getCraw.crawler_pantip | numFormat }}
            </div>
            <div>
              <span class="prt">ข้อมูลที่ประมวลผลได้ : </span
              >{{ getCraw.preprocess_pantip | numFormat }}
            </div> -->

            <!-- <div>{{startFormat }}</div>
              <div>{{endFormat}}</div> -->
          </b-col>
        </b-row>
      </b-container>
      <br />
    </div>

    <b-modal id="modal-3" size="lg" centered>
      <b-container>
        <b-row>
          <b-col align-self="center">
            <h1 class="sentiment lg-font">Sentiment</h1>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div class="doc md-font">
              <img src="@/assets/Pantip.png" class="socialicon" /> เอกสารที่พบ
              <strong>{{ getPantip.post | numFormat }}</strong>
              (Comments/Posts)
            </div>
          </b-col>
        </b-row>
        <SentimentChart
          v-if="getPantip.total_sentiments"
          :source="'pantip'"
          :chartData="getPantip.total_sentiments"
          :pageType="'DashboardPage'"
        />
        <!-- <SentimentChart :chartData="getPantip.sentiment" /> -->
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
      showDetail: true,
      dateToday: new Intl.DateTimeFormat("en-AU").format(),
    };
  },
  computed: {
    ...mapGetters([
      "getPantip",
      "getSumPantip",
      "getTimelinePantip",
      "getDateChoice",
      "getCraw",
      "getLoadStatus",
    ]),
    startFormat() {
      var startDate = String(this.getSumPantip.startdate)
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
      var endDate = String(this.getSumPantip.enddate)
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
      var sweek = new Date(this.getTimelinePantip[1][0]).toLocaleDateString(
        "en-AU"
      );
      return sweek;
    },
    endWeek() {
      var eweek = new Date(this.getTimelinePantip[8][0]).toLocaleDateString(
        "en-AU"
      );
      return eweek;
    },
    startMonth() {
      var smonth = new Date(this.getTimelinePantip[1][0]).toLocaleDateString(
        "en-AU"
      );
      return smonth;
    },
    endMonth() {
      var emonth = new Date(
        this.getTimelinePantip[this.getTimelineFacebook.length - 1][0]
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
      this.$store.commit("setNamePlatform", "pantip");
    },
  },
};
</script>

<style scoped>
#pantip {
  /* background-color: #522981; */
  background: linear-gradient(147deg, rgb(112, 87, 155) 10%, rgb(44 24 77) 55%);
  color: #ffffff;
  cursor: pointer;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
}
#pantip:hover {
  box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset,
    rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
    rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px,
    rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px,
    rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
}
#sumboxpt {
  width: 100%;
  border: 2px solid #512f85;
  background-color: white;
  padding-bottom: 20px;
  min-height: 14em;
}
.date2 {
  color: black;
  margin-left: 15% !important;
}
.vue-popover#foo3 {
  left: -200% !important;
}
#foo3.vue-popover.dropdown-position-bottom:before {
  left: calc(84% - 6px) !important;
}
#tt-pt h4 {
  position: relative;
  z-index: 1;
  color: white;
  background-color: rgb(81, 47, 133);
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
#thirdpt {
  top: 50%;
  left: -35rem;
}
#thirdpt::after {
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

@media only screen and (max-width: 1150px) {
  .box .tooltiptext {
    width: 45em;
  }
  #thirdpt {
    left: 0;
    margin-left: -81px;
  }
  #thirdpt::after {
    left: 25%;
  }
}

@media only screen and (min-width: 1150px) and (max-width: 1750px) {
  .box .tooltiptext {
    width: 55em;
  }
  #thirdpt {
    left: 0;
    margin-left: -81px;
  }
  #thirdpt::after {
    left: 25%;
  }
}

@media only screen and (min-width: 0px) and (max-width: 941px) {
  .box .tooltiptext {
    width: 28em;
  }
  #thirdpt {
    left: 0;
    margin-left: -67px;
  }
  #thirdpt::after {
    left: 24%;
  }
}
@media only screen and (max-width: 1400px) {
  #foo3.vue-popover.dropdown-position-bottom:before {
    left: calc(90% - 6px) !important;
  }
}
@media only screen and (max-width: 1300px) {
  #foo3.vue-popover.dropdown-position-bottom:before {
    left: calc(90% - 6px) !important;
  }
  .vue-popover#foo3[data-v-aae30ed8] {
    left: -178% !important;
  }
}
@media only screen and (min-width: 820px) and (max-width: 990px) {
  /* .md-font {
    font-size: 1.5vw !important;
  } */
  .vue-popover#foo3[data-v-aae30ed8][data-v-aae30ed8] {
    left: unset !important;
  }
  #foo3.vue-popover.dropdown-position-bottom[data-v-aae30ed8]:before {
    left: calc(9% - 6px) !important;
  }
}

@media only screen and (min-device-width: 770px) and (max-width: 850px) {
  /* .md-font {
    font-size: 2.2vw !important;
  } */
  .vue-popover#foo3 {
    width: 85vw !important;
    z-index: 2 !important;
    left: -29px !important;
    top: 50px !important;
  }
  .vue-popover#foo3[data-v-aae30ed8][data-v-aae30ed8] {
    left: -29px !important;
  }
  #foo3.vue-popover.dropdown-position-bottom[data-v-aae30ed8]:before {
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
  .vue-popover#foo3[data-v-aae30ed8][data-v-aae30ed8] {
    left: unset !important;
  }
  #foo3.vue-popover.dropdown-position-bottom[data-v-aae30ed8]:before {
    left: calc(9% - 6px) !important;
  }
}

@media only screen and (min-width: 375px) and (max-width: 815px) {
  .box .tooltiptext {
    width: auto !important;
  }
  #thirdpt {
    margin-left: -40px !important;
  }
  .bg_title img[data-v-aae30ed8] {
    left: 120px;
  }
  .vue-popover#foo3 {
    width: 75vw !important;
    z-index: 2 !important;
    left: -1px !important;
    top: 50px !important;
  }
  .vue-popover#foo3[data-v-aae30ed8][data-v-aae30ed8] {
    left: -1px !important;
  }
  #foo3.vue-popover.dropdown-position-bottom[data-v-aae30ed8]:before {
    left: calc(48% - 6px) !important;
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
  #thirdpt {
    margin-left: -40px !important;
  }
  .bg_title img[data-v-aae30ed8] {
    left: 120px;
  }
  .vue-popover#foo3 {
    width: 85vw !important;
    z-index: 2 !important;
    left: -1px !important;
    top: 50px !important;
  }
  .vue-popover#foo3[data-v-aae30ed8][data-v-aae30ed8] {
    left: -1px !important;
  }
  #foo3.vue-popover.dropdown-position-bottom[data-v-aae30ed8]:before {
    left: calc(48% - 6px) !important;
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
