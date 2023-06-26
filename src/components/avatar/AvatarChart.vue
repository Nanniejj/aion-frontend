<template>
  <div>
    <h3>Avatar Chart</h3>
    <div class="row">
      <div class="row scrolling-wrapper">
        <div class="row justify-content-center margin flex-nowrap">
          <!-- for here -->
          <BarChart
            v-for="(item, index) in this.getAvatar"
            :key="index"
            :title="item.name"
            :retweet="item.twitter.retweet"
            :tweet="item.twitter.tweet"
            :account_retweet="item.twitter.account_retweet"
            :account_tweet="item.twitter.account_tweet"
          ></BarChart>
        </div>
      </div>
    </div>

    <img src="@/assets/Facebook.png" class="d-none" id="fb_img_src" />
    <img src="@/assets/Twitter.png" class="d-none" id="tw_img_src" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import BarChart from "@/components/avatar/BarChart.vue";

export default {
  components: {
    BarChart
  },
  data() {
    return {
      datachart: "",
      today: "",
      msg: ""
    };
  },

  computed: {
    ...mapGetters(["getSelected", "getAvatar"])
  },

  methods: {
    
  }
};
</script>

<style scoped>
.line-middle {
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #6c757d;
  line-height: 0.1em;
  margin: 10px 0 20px;
}

.line-middle span {
  background: #fff;
}
.break-word {
  word-break: break-all;
}
.margin {
  margin: auto;
}

.total {
  font-size: 22pt;
  font-weight: bold;
}

.subtotal {
  font-size: 16pt;
  font-weight: bold;
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  /*  width: 16rem; */
  margin-left: 15px;
  display: flexbox;
  margin-left: 30px !important;
}

.socialogo {
  width: 60px;
}

.strike {
  word-wrap: break-word;
  width: 60%;
  display: block;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
}

.strike > span {
  position: relative;
  display: inline-block;
}

.strike > span:before,
.strike > span:after {
  content: "";
  position: absolute;
  top: 50%;
  width: 9999px;
  height: 3px;
  background: #ddd;
}

.strike > span:before {
  right: 100%;
  margin-right: 15px;
}

.strike > span:after {
  width: 9999px;
  left: 100%;
  margin-left: 15px;
}

.f-dot-text {
  margin-left: -10.8rem;
  margin-top: 12rem;
}

.s-dot-text {
  margin-left: -13.4rem;
}

.scrolling-wrapper {
  overflow-x: scroll;
  width: 80%;
  height: 610px;
  margin: auto;
  margin-top: 0;
}

/* width */
::-webkit-scrollbar {
  height: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 20px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 20px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

@media only screen and (max-width: 1150px) {
  .f-dot-text {
    margin-left: -67rem;
    margin-top: 40rem;
  }

  .s-dot-text {
    margin-left: -45.4rem;
    margin-top: -2rem;
  }

  .dot-text {
    margin-left: 0rem;
    margin-top: -2rem;
  }
}

@media only screen and (min-width: 0px) and (max-width: 600px) {
  .f-dot-text {
    margin-left: -26rem;
    margin-top: 42rem;
  }

  .s-dot-text {
    margin-left: -11rem;
    margin-top: -2rem;
  }

  .dot-text {
    margin-left: 0rem;
    margin-top: -2rem;
  }

  .scrolling-wrapper {
    height: auto;
  }

  .strike {
    width: 80px;
    word-wrap: break-word;
  }
  #date-btn {
    padding-bottom: 30px;
    white-space: nowrap;
  }
  hr {
    display: none;
  }
  #today-col {
    margin-left: -3%;
  }
  #previous {
    vertical-align: revert !important;
  }
  #next {
    display: unset !important;
    vertical-align: revert !important;
  }
  #next-btn > span.fas.fa-caret-right.size.md-font {
    display: unset !important;
    vertical-align: unset !important;
  }
  #container-date {
    width: 90% !important;
    margin: revert !important;
  }
  #today-btn {
    white-space: nowrap;
    margin-left: -4px;
  }
  #date-icon {
    margin-top: 20px;
  }
  #container-date {
    padding-bottom: 30px;
  }
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  #today-btn {
    white-space: nowrap;
  }
  #previous {
    vertical-align: unset !important;
  }
}
@media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) {
  #pre-icon {
    top: -3px;
  }
  #previous {
    left: 69px;
  }
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  .table[data-v-5811d9ee] {
    width: 90%;
  }
}
@media only screen and (min-device-width: 414px) and (max-device-width: 736px) and (orientation: portrait) {
  #pre-icon {
    top: -3px;
  }
  #previous {
    left: 40px;
  }
}
@media only screen and (min-device-width: 411px) and (max-device-width: 731px) and (orientation: portrait) {
  #pre-icon {
    top: -3px;
  }
  #previous {
    left: 40px;
  }
}
@media only screen and (min-width: 0px) and (max-width: 900px) {
  .table[data-v-5811d9ee] {
    width: 93%;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
}
</style>