<template>
  <b-col sm="12" md="6" lg="4">
    <vue-element-loading :active="getLoadStatus" size="80" background-color="rgba(255, 255, 255, 0.3)"
      color="#b6ac9a" />
    <div class="box" id="telegram" @click="toPlatform">
      <div class="left"></div>
      <div style="cursor: pointer">
        <img src="@/assets/Telegram.png" class="socialogo" />

        <div class="md-font">
          โพสต์ที่เกี่ยวข้อง
          <span class="total-all">
            {{ dataPlatform.post | numFormat }}
          </span>
        </div>
        <b-container>
          <b-row class="comment-post">
            <b-col class="border-right">
              <div class="md-font dp">Users</div>
              <div class="total-sub">
                <span class="prt">Users : </span>
                {{ dataPlatform.users | numFormat }}
              </div>
            </b-col>
            <b-col class="border-left">
              <div class="md-font dp">Messages</div>
              <div class="total-sub">
                <span class="prt">Messages : </span>{{ dataPlatform.comment + dataPlatform.post | numFormat }}
              </div>
            </b-col>
          </b-row>
          <b-row class="comment-post">
            <b-col cols="12" class="dp">
              <div>Summary</div>
            </b-col>
            <span class="prt"><br />จำนวนรวม</span>
          </b-row>
          <b-row class="md-font">
            <b-col cols="5">
              <div><i class="far fa-paper-plane" /></div>
              <div><i class="far fa-comment" /></div>
              <div><i class="far fa-comments" /></div>
              <div><i class="fas fa-users" /></div>
            </b-col>
            <b-col cols="7" class="sum-right">
              <div>
                <span class="prt">Posts : </span>{{ dataSum.total_post_all || 0 | numFormat }}
              </div>
              <div>
                <span class="prt">Comments : </span>{{ (dataSum.total_message_all - dataSum.total_post_all) || 0 |
                  numFormat }}
              </div>
              <div>
                <span class="prt">Messages : </span>{{ dataSum.total_message_all | numFormat }}
              </div>
              <div>
                <span class="prt">Users : </span>{{ Number(dataSum.total_user_all) | numFormat }}
              </div>
            </b-col>
          </b-row>
        </b-container>
        <br />
      </div>
    </div>
    <b-modal id="modal-telegram" size="lg" centered>
      <b-container>
        <b-row>
          <b-col align-self="center">
            <h1 class="sentiment lg-font">Sentiment</h1>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div class="doc md-font">
              <img src="@/assets/Telegram.png" class="socialicon" /> เอกสารที่พบ
              <strong> {{ getTelegram.post | numFormat }} </strong>
              (Comments/Posts)
            </div>
          </b-col>
        </b-row>
        <SentimentChart v-if="getTelegram.total_sentiments" :source="'telegram'"
          :chartData="getTelegram.total_sentiments" :pageType="'DashboardPage'" />
      </b-container>
    </b-modal>
  </b-col>
</template>

<script>
import { mapGetters } from "vuex";
import SentimentChart from "../chart/SentimentChart.vue";

export default {
  props: { dataSum: { type: Object }, dataPlatform: { type: Object } },
  data: function () {
    return {
      dateToday: new Intl.DateTimeFormat("en-AU").format(),
      showDetail: true,
      open: false,
    };
  },

  computed: {
    ...mapGetters([
      "getTelegram",
      "getSumTelegram",
      "getTimelineTelegram",
      "getDateChoice",
      "getSumDB",
      "getCraw",
      "getLoadStatus",
    ]),
  },
  components: {
    SentimentChart,
  },
  methods: {
    toPlatform() {
      this.$store.commit("setToPlatform", false);
      this.$store.commit("setNamePlatform", "telegram");
    },
    hideModal() {
      this.open = false;
    },
    onOptionsChange: function () {
      this.$store.commit("changeDataChoice", { choice: this.type_selected });
    },
  },
};
</script>

<style scoped>
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  #overflow-page {
    overflow: hidden;
  }
}

#telegram {
  background: #0d7fc4;
  background: linear-gradient(145deg,
      #29a9e0 10%,
      rgb(4, 65, 114) 55%);
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  color: #ffffff;
}

#telegram:hover {
  box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset,
    rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
    rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px,
    rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px,
    rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
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

.doc {
  color: #695a3d;
  text-align: start;
}

.modal-content {
  padding: 40px;
  padding-top: 0px;
}

@media only screen and (min-device-width: 770px) and (max-width: 850px) {
  .total-all {
    font-size: 2.7vw !important;
  }

  .total-sub {
    font-size: 3vw !important;
  }

  .socialogo {
    width: 15% !important;
  }
}

@media only screen and (min-width: 375px) and (max-width: 815px) {
  .modal-content {
    padding: 15px;
    padding-top: 0px;
    overflow: hidden;
  }

  h1,
  .h1 {
    font-size: 1.5rem;
  }

  .sentiment {
    width: 100%;
  }
}

@media only screen and (min-width: 0px) and (max-width: 600px) {
  .modal-content {
    padding: 15px;
    padding-top: 0px;
    overflow: hidden;
  }

  h1,
  .h1 {
    font-size: 1.5rem;
  }

  .sentiment {
    width: 100%;
  }
}
</style>