<template>
  <b-row cols="1">
    <!-- Positive -->
    <b-col class="mb-1">
      <b-row class="v-cen">
        <b-col cols="auto">
          <i class="far fa-smile fa-2x d-inline" style="color: #53b993;"></i>
        </b-col>
        <b-col>
          <b-progress id="barpos" height="20px">
            <b-progress-bar :value="valpos"></b-progress-bar>
            <span class="lbvp bold">
              <span class="label-text">
                {{ positive | numFormat }} posts
                <span class="pct">({{ valpos.toFixed(1) }}%)</span>
              </span>
            </span>
          </b-progress>
        </b-col>
      </b-row>
    </b-col>

    <!-- Neutral -->
    <b-col class="mb-1">
      <b-row class="v-cen">
        <b-col cols="auto">
          <i class="far fa-meh fa-2x d-inline" style="color: #368ab6;"></i>
        </b-col>
        <b-col>
          <b-progress id="bar" height="20px">
            <b-progress-bar :value="valneutral"></b-progress-bar>
            <span class="lbv bold">
               <span class="label-text">
              {{ neutral | numFormat }} posts
              <span class="pct">({{ valneutral.toFixed(1) }}%)</span></span>
            </span>
          </b-progress>
        </b-col>
      </b-row>
    </b-col>

    <!-- Negative -->
    <b-col class="mb-1">
      <b-row class="v-cen">
        <b-col cols="auto">
          <i class="far fa-frown-open fa-2x d-inline" style="color: #f06964;"></i>
        </b-col>
        <b-col>
          <b-progress id="barnag" height="20px">
            <b-progress-bar :value="valnag"></b-progress-bar>
            <span class="lbvn bold">
               <span class="label-text">
              {{ negative | numFormat }} posts
              <span class="pct">({{ valnag.toFixed(1) }}%)</span></span>
            </span>
          </b-progress>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "SentimentBar",
  props: {
    positive: { type: Number, required: true },
    neutral: { type: Number, required: true },
    negative: { type: Number, required: true }
  },
  computed: {
    total() {
      return this.positive + this.neutral + this.negative;
    },
    valpos() {
      return this.total > 0 ? (this.positive * 100) / this.total : 0;
    },
    valneutral() {
      return this.total > 0 ? (this.neutral * 100) / this.total : 0;
    },
    valnag() {
      return this.total > 0 ? (this.negative * 100) / this.total : 0;
    }
  }
};
</script>

<style scoped>
.label-text {
  display: inline;
}

/* ให้ข้อความหลักกับ % อยู่บรรทัดเดียวกัน */
.pct {
  font-size: 11px;
}

/* ลดขนาด % ลง (ปรับเป็น 0.8em หรือ 12px ได้ตามชอบ) */
.lbvn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: rgb(240, 105, 100);
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
  background-color: rgb(240, 105, 100);
  border-radius: 10px;
}

.v-cen {
  align-items: center;
  justify-content: center;
}

.progress {
  font-size: 14px;
  background-color: #e9ecef00;
}
</style>
