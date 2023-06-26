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
      <span class="total-all h5 mb-2" id="tt-sum">Total </span>
      <b-row class="comment-post">
        <b-col>
          <i class="fa fa-comments fa-2x" />
          <div class="md-font"></div>
          <div class="total-all">
            <span class="prt">Messages : </span
            >{{ (sumPost + sumComment) | numFormat }}
          </div>
          <span class="dp"
            >Messages
            <div class="small">( posts + comments )</div>
          </span>
        </b-col>

        <b-col class="border-left">
          <i class="fa fa-paper-plane fa-2x" />
          <div class="md-font"></div>
          <div class="total-all">
            <span class="prt">Posts : </span>{{ sumPost | numFormat }}
          </div>
          <span class="dp">Posts </span>
        </b-col>

        <b-col class="border-left">
          <div><i class="fa fa-comment fa-2x" /></div>
          <div class="total-all">
            <span class="prt">Comments : </span>{{ sumComment | numFormat }}
          </div>
          <span class="dp">Comments</span>
        </b-col>
        <b-col class="border-left">
          <div><i class="fa fa-users fa-2x" /></div>
          <div class="total-all">
            <span class="prt">Users : </span>
            {{ sumUser | numFormat }}
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
.fa {
  color: #ccc2b2;
}
.border-left {
  border-left: 1px solid #9e9e9e !important;
}
.border-right {
  border-left: 1px solid #9e9e9e !important;
}
#tt-sum {
  /* color:#4c412b ; */
  display: -webkit-inline-box;
}
#sumboxsum {
  padding-top: 10px;
  width: 100%;
  background-color: transparent;
  padding-bottom: 20px;
  min-height: 20vh;
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
    font-size: 10pt;
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
