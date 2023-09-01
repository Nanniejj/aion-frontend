<template>
  <b-col sm="12" md="12" lg="12">
    <div class="" id="sumboxsum">
      <!-- <vue-element-loading
            :active="getLoadStatus"
            size="80"
            background-color="rgba(255, 255, 255, 0.8)"
            color="#fbf7f6"
          /> -->
      <br class="prt" />
      <!-- <img src="@/assets/arrow.png" class="socialogo-sum" /> -->
      <!-- <span class="total-all h5 mb-2 text-left" id="tt-sum">Total </span> -->
      <b-row class="comment-post mt-3">
        <b-col v-b-tooltip.top :title="(sumPost + sumComment) | numFormat" sm="6" md="3"  cols="6">
          <i class="fa fa-comments fa-2x" />
          <div class="md-font"></div>
          <div class="total-all">
            <div class="h4 bold mb-0 dp">
              {{ formatCash(sumPost + sumComment) }}
            </div>
            <span class="prt">Messages : </span>
            <span class="small mt-0 p-0 prt">
              {{ (sumPost + sumComment) | numFormat }}</span
            >
          </div>
          <span class="dp" style="color:#6e6149"
            >Messages
            <div
              class="small d-none"
              style="font-size: x-small;color:#4c412b ;"
            >
              ( posts + comments )
            </div>
          </span>
        </b-col>

        <b-col class="border-left" v-b-tooltip.top :title="sumPost | numFormat"  sm="6" md="3"  cols="6">
          <i class="fa fa-paper-plane fa-2x" />
          <div class="md-font"></div>
          <div class="total-all">
            <div class="h4 bold mb-0 dp">{{ formatCash(sumPost) }}</div>
            <span class="prt ">Posts : {{ sumPost | numFormat }} </span>
          </div>
          <span class="dp">Posts </span>
        </b-col>

        <b-col
          class="border-left"
          v-b-tooltip.top
          :title="sumComment | numFormat"
          cols="6" sm="6" md="3"
        >
          <div><i class="fa fa-comment fa-2x" /></div>
          <div class="total-all">
            <div class="h4 bold mb-0 dp">{{ formatCash(sumComment) }}</div>
            <span class="prt">Comments :{{ sumComment | numFormat }} </span>
          </div>
          <span class="dp">Comments</span>
        </b-col>
        <b-col class="border-left" v-b-tooltip.top :title="sumUser | numFormat" cols="6" sm="6" md="3">
          <div><i class="fa fa-users fa-2x" /></div>
          <div class="h4 bold mb-0 dp">{{ formatCash(sumUser) }}</div>
          <div class="total-all">
            <span class="prt">Users : {{ sumUser | numFormat }} </span>
          </div>
          <span class="dp">Users</span>
        </b-col>
      </b-row>
      <br class="prt" />
    </div>
  </b-col>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters([
      "getSummary",
      "getSumFacebook",
      "getSumTwitter",
      "getSumPantip",
      "getSumYoutube",
      "getSumNews",
      "getSumInstagram",
    ]),
    sumPost() {
      var a = [
        this.getSumFacebook.post,
        this.getSumTwitter.post,
        this.getSumPantip.post,
        this.getSumYoutube.post,
        this.getSumNews.post,
      ];
      var sum = a.reduce(function(a, b) {
        return a + b;
      }, 0);
      return sum;
    },
    sumComment() {
      var a = [
        this.getSumFacebook.comment,
        this.getSumTwitter.comment,
        this.getSumPantip.comment,
        this.getSumYoutube.comment,
        this.getSumNews.comment,
      ];
      var sum = a.reduce(function(a, b) {
        return a + b;
      }, 0);
      return sum;
    },
    sumUser() {
      var a = [
        this.getSumFacebook.users,
        this.getSumTwitter.users,
        this.getSumPantip.users,
        this.getSumYoutube.users,
        this.getSumNews.users,
      ];
      var sum = a.reduce(function(a, b) {
        return a + b;
      }, 0);
      return sum;
    },
  },
  methods: {
    formatCash(n) {
      if (n < 1e3) return n;
      if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
      if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
      if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
      if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
    },
  },
  created() {
    var items = [
      { name: "Edward", value: 21 },
      { name: "Sharpe", value: 37 },
      { name: "And", value: 45 },
      { name: "The", value: -12 },
      { name: "Magnetic", value: 13 },
      { name: "Zeros", value: 37 },
      { name: "Z", value: 137 },
      { name: "Zss", value: 1366667 },
    ];

    // sort by value
    items.sort(function(a, b) {
      return b.value - a.value;
    });

    console.log("items", items);

    const shots = [
      { id: 1, amount: 2 },
      { id: 2, amount: 4 },
      { id: 3, amount: 52 },
      { id: 4, amount: 36 },
      { id: 5, amount: 13 },
      { id: 6, amount: 33 },
    ];

    shots.reduce(
      (acc, shot) => (acc = acc > shot.amount ? acc : shot.amount),
      0
    );

    console.log("shots", shots);

    var arr = [1, 2, 3];
    var max = arr.reduce(function(a, b) {
      return Math.max(a, b);
    });

    console.log("max", max);
  },
};
</script>

<style scoped>
.h4,
.border-left {
  color: #6e6149;
}
.fa {
    color: #fdd786;
    background: linear-gradient(to bottom, #fdd786 0%, #e3b348 100%);
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
.border-left {
  border-left: 0px solid #9e9e9e !important;
}
.border-right {
  border-left: 1px solid #9e9e9e !important;
}
#tt-sum {
  /* color:#4c412b ; */
  display: -webkit-inline-box;
}
#sumboxsum {
  padding-top: 30px;
  width: 100%;
  background-color: transparent;
  padding-bottom: 30px;
  display: block;
  margin: auto;
  border-radius: 26px;
}
.socialogo-sum {
  width: 20%;
  margin-bottom: 15px;
  margin-top: 15px;
  display: -webkit-inli-box;
}
.sum-right {
  text-align: start;
}
@media only screen and (max-width: 1150px) {
  .box .tooltiptext {
    width: 45em;
  }
}
@media only screen and (min-width: 1150px) and (max-width: 1750px) {
  .box .tooltiptext {
    width: 55em;
  }
}
@media only screen and (min-width: 0px) and (max-width: 941px) {
  .box .tooltiptext {
    width: 28em;
  }
}
@media only screen and (min-width: 820px) and (max-width: 990px) {
  .md-font {
    font-size: 1.5vw !important;
  }
}
@media only screen and (min-device-width: 770px) and (max-width: 850px) {
  .md-font {
    font-size: 2.2vw !important;
  }
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1000px) {
  .md-font {
    font-size: 2vw !important;
  }
}
@media only screen and (min-width: 375px) and (max-width: 815px) {
  .box .tooltiptext {
    width: auto !important;
  }

  .md-font {
    font-size: 1.7vw !important;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .box .tooltiptext {
    width: auto !important;
  }
  #sumboxsum {
    min-height: unset !important;
  }
  .md-font {
    font-size: 3.5vw !important;
  }
  .border-left {
    border-left: none !important;
  }
  .total-all {
    /* font-size: 10pt; */
    font-weight: bold;
  }
  .comment-post {
    font-size: small;
  }
  .mx-datepicker-range {
    width: 100%;
  }
  .justify-content-end {
    margin: auto;
  }
  #date-picker {
    margin: unset !important;
  }
}
</style>
