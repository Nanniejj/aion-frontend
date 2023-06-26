<template>
  <div>
      <b-row align-h="center" class="pl-4 pr-4 mt-3">
        <!-- sentiment bar -->
        <b-col lg="12" >
          <b-row cols="1" align-v="center">
            <b-col class="mb-1">
              <b-row class="v-cen">
                <b-col cols="auto">
                  <img src="@/assets/Pos.png" class="icon-sen" />
                </b-col>
                <b-col>
                  <b-progress id="barpos" height="20px">
                    <b-progress-bar :value="pos"></b-progress-bar
                    ><span class="lbvp bold"
                      >{{ chartData.positive | numFormat }} posts</span
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
                    <b-progress-bar :value="neu"></b-progress-bar
                    ><span class="lbv bold"
                      >{{ chartData.neutral | numFormat }} posts</span
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
                    <b-progress-bar :value="neg"></b-progress-bar>
                    <span class="lbvn bold"
                      >{{ chartData.negative | numFormat }} posts</span
                    >
                  </b-progress>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="mt-3 mb-4">
      <b-col>
        <div class="bold ptxt">Positive</div>
        <div class="bold small">{{ chartData.positive | numFormat }} posts</div>
      </b-col>
      <b-col>
        <div class="bold ntxt">Neutral</div>
        <div class="bold small">{{ chartData.neutral | numFormat }} posts</div>
      </b-col>
      <b-col>
        <div class="bold ngtxt">Negative</div>
        <div class="bold small">{{ chartData.negative | numFormat }} posts</div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
//import axios from "axios";
import { mapGetters } from "vuex";
export default {
   props: { chartData: {
      default: {
        positive: 0,
        neutral: 0,
        negative: 0,
      },
      }
    },
  watch: {
    getArrDate: function () {
      this.updateStat();
    },
  },
  computed: {
    ...mapGetters([
      "getClickDomain",
      "getSdateDm",
      "getEdateDm",
      "getLoadStat",
      "getArrDate",
    ]),
  pos: function () {
    let sum =
            this.chartData.positive +
            this.chartData.neutral +
            this.chartData.negative;
        let valpos = ( this.chartData.positive * 100) / sum;
    return  valpos
  },
  neu: function () {
    let sum =
            this.chartData.positive +
            this.chartData.neutral +
            this.chartData.negative;
       let val = ( this.chartData.neutral * 100) / sum;
    return  val
  },
  neg: function () {
    let sum =
            this.chartData.positive +
            this.chartData.neutral +
            this.chartData.negative;
        let valneg = ( this.chartData.negative * 100) / sum;
    return  valneg
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