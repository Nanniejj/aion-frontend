<template>
  <div>
    <b-row cols="1" class="mt-4">
      <b-col class="mb-1">
        <b-row class="v-cen">
          <b-col cols="auto">
            <img src="@/assets/Pos.png" class="icon-sen" />
          </b-col>
          <b-col>
            <b-progress id="barpos" height="20px">
              <b-progress-bar :value="valpos"></b-progress-bar>
              <span class="lbvp bold">
                {{ safeDataStat.positive | numFormat }} posts
              </span>
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
              <b-progress-bar :value="val"></b-progress-bar>
              <span class="lbv bold">
                {{ safeDataStat.neutral | numFormat }} posts
              </span>
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
              <span class="lbvn bold">
                {{ safeDataStat.negative | numFormat }} posts
              </span>
            </b-progress>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-row class="mt-3 mb-4">
      <b-col>
        <div class="bold ptxt">Positive</div>
        <div class="bold small">{{ safeDataStat.positive | numFormat }} posts</div>
      </b-col>
      <b-col>
        <div class="bold ntxt">Neutral</div>
        <div class="bold small">{{ safeDataStat.neutral | numFormat }} posts</div>
      </b-col>
      <b-col>
        <div class="bold ngtxt">Negative</div>
        <div class="bold small">{{ safeDataStat.negative | numFormat }} posts</div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

const EMPTY_SENTIMENT = {
  positive: 0,
  neutral: 0,
  negative: 0,
};

export default {
  name: "SentimentSummary",

  data() {
    return {
      startd: "",
      endd: "",
      valpos: 0,
      valnag: 0,
      val: 0,
      dataStat: { ...EMPTY_SENTIMENT },
      avgComment: 0,
      avgEngage: 0,
    };
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
      "getTiktok",
      "getThreads",
      "getTelegram",
      "getStatPlatform",
      "getSumStatPlatform",
    ]),

    currentPlatform() {
      return this.getNamePlatform || "instagram";
    },

    currentPlatformStat() {
      const platformMap = this.getStatPlatform || {};
      const platformData = platformMap[this.currentPlatform] || {};
      return platformData.total_sentiments || { ...EMPTY_SENTIMENT };
    },

    safeDataStat() {
      return {
        positive: Number(this.currentPlatformStat.positive) || 0,
        neutral: Number(this.currentPlatformStat.neutral) || 0,
        negative: Number(this.currentPlatformStat.negative) || 0,
      };
    },
  },

  watch: {
    safeDataStat: {
      handler() {
        this.updateStat();
      },
      deep: true,
      immediate: true,
    },
    getNamePlatform() {
      this.updateStat();
    },
  },

  methods: {
    updateStat() {
      this.dataStat = { ...this.safeDataStat };

      const sum =
        this.dataStat.positive +
        this.dataStat.neutral +
        this.dataStat.negative;

      if (!sum) {
        this.valpos = 0;
        this.val = 0;
        this.valnag = 0;
        return;
      }

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
.ptxt {
  color: #53b993;
}
.ntxt {
  color: #368ab6;
}
.ngtxt {
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
</style>