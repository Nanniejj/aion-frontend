<template>
  <div>
    <!-- for phone -->
    <div id="flowPhone">
      <div id="flow-tt">
        <div @click="backwordcloud()" style="cursor: pointer">
          <a>Wordcloud</a>
        </div>
        <div @click="backwordcloud()" style="cursor: pointer; margin-left: 5px">
          <i class="fas fa-chevron-right"></i>
          <span v-if="getWordCloudDomain == 'All' || getWordCloudDomain == ''">
            ALL <span v-if="getKeywords"> / {{ getKeywords }}</span></span
          >
          <span v-else
            ><span v-for="dn in getWordCloudDomain" :key="dn">{{ dn }} </span>
            <span v-if="getKeywords"> / {{ getKeywords }}</span></span
          >
        </div>
      </div>
      <div id="key">
        <a style="margin-left: 5px; color: #343a40"
          ><i class="fas fa-chevron-right"></i> <b>{{ getQuerySearch }}</b> |</a
        >
        <span v-if="status === 1" style="margin-left: 5px; color: #54c69d"
          ><b>Positive</b></span
        >
        <span v-if="status === -1" style="margin-left: 5px; color: #f7776a">
          <b>Negative</b></span
        >
        <span v-if="status === 0" style="margin-left: 5px; color: #3a86ad">
          <b>Neutral</b></span
        >
      </div>
    </div>
    <!-- for desktop -->
    <div id="flowBoxes">
      <div
        class="rightt hov"
        @click="backwordcloud()"
        style="cursor: pointer; color: #4c412b"
      >
        <a>Wordcloud</a>
        <span class="prt"> /</span>
      </div>
      <div
        class="leftt rightt hov"
        @click="backwordcloud()"
        style="cursor: pointer"
      >
        <a style="margin-left: 18px; color: #4c412b">
          <span v-if="getWordCloudDomain == 'All' || getWordCloudDomain == ''"
            >ALL <span v-if="getKeywords"> / {{ getKeywords }}</span><span class="prt"> /</span></span
          >
          <span v-else
            ><span v-for="dn in getWordCloudDomain" :key="dn">{{ dn }} </span>
            <span v-if="getKeywords"> / {{ getKeywords }}</span><span class="prt"> /</span></span
          ></a
        >
      </div>

      <div class="leftt rightt active">
        <span style="margin-left: 18px">{{ getQuerySearch }}</span><span class="prt"> /</span>
      </div>
      <div class="leftt" v-if="status === 1" style="background-color: #54c69d">
        <span style="margin-left: 18px; color: white">Positive</span>
      </div>
      <div class="leftt" v-if="status === -1" style="background-color: #f7776a">
        <span style="margin-left: 18px; color: white">Negative</span>
      </div>
      <div class="leftt" v-if="status === 0" style="background-color: #3a86ad">
        <span style="margin-left: 18px; color: white">Neutral</span>
      </div>
    </div>
    <div id="date-box">
      <i class="fa fa-calendar" />
      <span v-if="ssdate == eedate"> {{ssdate}} </span>
      <span v-else> {{ ssdate }} - {{ eedate }} </span>
    </div>
    <div id="date-box-phone">
      <i class="fa fa-calendar" />
      <span v-if="ssdate == eedate"> {{ssdate}} </span>
      <span v-else> {{ ssdate }} - {{ eedate }} </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    status: {
      type: Number,
    },
  },
  computed: {
    ...mapGetters([
      "getSentimentPost", 
      "getWordCloudDomain",
      "getWordCloudStartDate",
      "getWordCloudEndDate", 
      "getKeywords", 
      "getQuerySearch"]),
    ssdate() {
      var ssdate = this.sdate;
      var s = new Date(this.getWordCloudStartDate.slice(0, 10));
      ssdate = new Intl.DateTimeFormat("en-AU").format(s);
      return ssdate;
    },
    eedate() {
      // var eedate = this.edate;
      var e = new Date(this.getWordCloudEndDate.slice(0, 10));
      var eedate = new Intl.DateTimeFormat("en-AU").format(e);
      return eedate;
    },
  },
  data() {
    return {
      sen: "Positive",
    };
  },
  methods: {
    backwordcloud() {
      this.$router.push({ name: "WordcloudSentiment" });
    },
  },
};
</script>

<style scoped>
.hov:hover {
  box-shadow: -2px 3px 4px #888888;
}
#date-box-phone {
  display: none;
}
#date-box {
  text-align: start;
  margin-left: 50px;
  color: #4c412b;
  font-weight: bold;
}
#flowPhone {
  display: none;
}
#flowBoxes {
  font-size: x-large;
  font-weight: bold;
  text-align: start;
  margin-left: 30px;
  padding: 20px;
}
#flowBoxes div {
  display: inline-block;
  position: relative;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  /* border:1px solid #ccc; */
  margin-right: 9px;
  background-color: #ede7dd;
}

#flowBoxes div.rightt:after {
  content: "";
  /* border-top: 1px solid #ccc;
    border-right: 1px solid #ccc; */
  width: 28px;
  height: 28px;
  position: absolute;
  right: 0;
  top: 2px;
  background-color: #ede7dd;
  z-index: 150;
  transform: translate(14px, 4px) rotate(45deg) !important;
  -webkit-transform: translate(10px, 4px) rotate(45deg);
  -moz-transform: translate(10px, 4px) rotate(45deg);
  -ms-transform: translate(10px, 4px) rotate(45deg);
  -o-transform: translate(10px, 4px) rotate(20deg);
}

#flowBoxes div.leftt:before {
  content: "";
  /* border-top: 1px solid #ccc;
    border-right: 1px solid #ccc; */
  width: 28px;
  height: 28px;
  position: absolute;
  left: 0;
  top: 2px;
  background-color: white;
  z-index: 50;
  -webkit-transform: translate(-10px, 4px) rotate(45deg);
  -moz-transform: translate(-10px, 4px) rotate(45deg);
  -ms-transform: translate(-10px, 4px) rotate(45deg);
  -o-transform: translate(-10px, 4px) rotate(20deg);
  transform: translate(-15px, 4px) rotate(45deg);
}
#flowBoxes .active {
  background-color: #4c412b;
  color: white;
}
#flowBoxes div.active:after {
  background-color: #4c412b;
}
@media only screen and (min-width: 0px) and (max-width: 750px) {
  #flowBoxes {
    display: none;
  }
  #flowPhone {
    background: #ddd;
    display: -webkit-box;
    color: #616569;
    padding: 8px 10px;
    margin-bottom: 10px;
  }
}
@media only screen and (min-width: 0px) and (max-width: 850px) {
  #flowBoxes {
    display: none;
  }
  #flowPhone {
    display: block;
    background: #ddd;
    color: #616569;
    padding: 8px 10px;
    margin-bottom: 10px;
  }
  #flow-tt {
    display: -webkit-box;
  }
  #key {
    display: -webkit-box;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  #emoji {
    width: 20px;
  }
  #tab-view {
    padding-left: 0;
    text-align: center;
  }
  #eltab1,
  #eltab2,
  #eltab3 {
    padding-right: 0px;
  }
  #all-eltab {
    font-size: 3.6vw;
  }
  .fa-sort-amount-down-alt:before {
    display: none;
  }
  #tab-post {
    margin-top: 25px;
    font-size: 3.6vw;
  }
  #tab-post {
    text-align: center;
    padding-right: 15px;
  }
  #tab-all {
    margin-top: 0px;
    margin-bottom: 0px;
  }
  h1,
  .h1 {
    font-size: 1.5rem;
  }
  #content
    > div.footer_magin.container
    > div:nth-child(3)
    > div
    > header
    > div
    > div.btn-edit.col-sm
    > button {
    font-size: 3.5vw !important;
    font-weight: bold;
  }
  #flowBoxes {
    font-size: 1em;
  }
  #flowBoxes div {
    margin-bottom: 5px;
  }
  .btn-to-top {
    width: 47px;
    height: 47px;
    padding: 10px 10px;
    border-radius: 50%;
    font-size: 22px;
    line-height: 22px;
    box-shadow: 2px 1px 4px #888888;
  }
  .vue-back-to-top {
    bottom: 50px !important;
    right: 17px !important;
  }
  #flowBoxes {
    display: none;
  }
  #flowPhone {
    display: block;
    background: #ddd;
    color: #616569;
    padding: 8px 10px;
    margin-bottom: 10px;
  }
  #flow-tt {
    display: -webkit-box;
  }
  #key {
    display: -webkit-box;
  }
  #user-name {
    line-break: anywhere;
  }
}
</style>