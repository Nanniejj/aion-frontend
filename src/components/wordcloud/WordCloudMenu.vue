<template>
  <div id="content" >
    <b-row align-h="center">
      <b-col class="d-contents">
        <h1 class="title">Wordcloud</h1>
      </b-col>
      <b-col>
        <div style="text-align: end" class="p-4 my-0">
          <span class="shadow-sm p-2 mb-3 bg-white rounded bold mr-2">
            <span>Today</span>
            {{ new Intl.DateTimeFormat("en-AU").format() }}
          </span>
          <span class="pt-3"
            ><i class="fa fa-print align-middle" @click="printWindow()"></i
          ></span>
        </div>
      </b-col>
    </b-row>

    <b-container class="footer_magin pr-lg-5 pl-lg-5">
       <vue-element-loading
      :active="getLoadStatus"
      size="80"
      background-color="rgba(255, 255, 255, 0.5)"
      color="#b6ac9a"
    />
      <b-row align-h="center" class="d-none">
        <b-col>
          <input
            type="text"
            class="form-control md-font"
            v-model="word"
            placeholder="ค้นหา"
          />
        </b-col>
      </b-row>
      <b-row align-h="center" class="mt-3 md-font">
        <b-col cols="12">
          <b-row>
            <b-col cols="auto">
              <div style="text-align: start" class="my-2 bold">Domain</div>
            </b-col>
            <b-col class="text-right" cols="auto" lg="">
              <b-form-group label="" v-slot="{ ariaDescribedby }">
                <b-form-radio-group
                  v-model="selected"
                  :options="options"
                  :aria-describedby="ariaDescribedby"
                  name="radio-inline"
                  class="mt-2"
                ></b-form-radio-group>
              </b-form-group>
            </b-col>
            <b-col sm="" lg="auto" md="auto">
              <div class="mb-2 text-lg-right text-sm-center">
                <section id="date-picker">
                  <date-picker
                    v-model="valueDate"
                    type="date"
                    range
                    placeholder="เลือกช่วงเวลา"
                    size="md"
                    :disabled-date="(date) => date >= new Date()"
                    value-type="format"
                    format="YYYY-MM-DD"
                    @change="selectData()"
                    >{{ valueDate }}</date-picker
                  >
                </section>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row align-h="center">
        <b-col>
          <select
            name="list"
            v-model="domain_name"
            class="form-control md-font"
            multiple
          >
            <option value="Alls">เลือกทั้งระบบ</option>
            <option value="All">เลือกทุก Domain</option>
            <option v-for="domain in getShowDomain" :key="domain.id">
              {{ domain.name }}
            </option>
          </select>
        </b-col>
      </b-row>
      <b-row align-h="center" style="margin-top: 15px">
        <b-col cols="10">
          <button
            type="submit"
            class="btn submit md-font"
            @click="summitform()"
          >
            Submit
          </button>
        </b-col>
      </b-row>
    </b-container>
        <hr class="mt-5 mb-3 mr-5 ml-5" />
    <DefaultCloud />
  </div>
</template>

<script>
import DefaultCloud from "@/components/wordcloud/DefaultCloud.vue";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  components: { DefaultCloud },
  data: function () {
    return {
      options: [
        { text: "ทั้งหมด", value: "" },
        { text: "Monitor", value: "true" },
      ],
      date: "",
      domain: "",
      today: "",
      word: "",
      type_selected: "daily",
      domain_name: [],
      start_date: "",
      end_date: "",
      valueDate: "",
      selected: "",
    };
  },
  computed: {
    ...mapGetters([
      "getDomainArr",
      "getShowDomain",
      "getWordCloud",
      "getDomain",
      "getWordCloudSentiment",
      "getWordCloudStartDate",
      "getWordCloudEndDate",
      "getLoadStatus",
      "getWordCloudDomain",
      "getKeywords",
      "getDate",
      "getLoadStatus",
      "getSelectedMonitor"
    ]),
  },
  methods: {
    printWindow: function () {
      try {
        window.print();
      } catch (err) {
        console.log(err);
      }
    },
    onOptionsChange: function () {
      this.$store.commit("changeDataChoice", { choice: this.type_selected });
      // console.log(this.type_selected);
    },
    // selectMonitor(){
    //   this.monitor = true
    // },
    selectData() {
      console.log(this.valueDate[0], this.valueDate[1]);
      this.start_date = this.valueDate[0] + "T00:00:00";
      this.end_date = this.valueDate[1] + "T23:59:59";
      this.$store.commit("setWordCloudStartDate", this.start_date);
      this.$store.commit("setWordCloudEndDate", this.end_date);

      // this.$store.dispatch("fetchSentimentStat", {
      //   start_date: this.start_date,
      //   end_date: this.end_date,
      // });
    },
    summitform: function () {
      this.keyword = this.word;
      this.date = this.type_selected;
console.log('domainjaa',this.domain_name);
      if (this.domain_name == "Alls"||this.domain_name.length==0) {
        this.domain_name = "";
      }
      this.$store.commit("setSelected", true);
      this.$store.commit("setWordCloudDomain", this.domain_name);
      this.$store.commit("setKeywords", this.word);
      this.$store.commit("setSelectedMonitor", this.selected);
      console.log("kw",   this.getSelectedMonitor);
      console.log("domain_name", this.domain_name);

      if (this.valueDate == "") {
        var todays = moment(new Date()).format().slice(0, 10) + "T00:00:00";
        var todaye = moment(new Date()).format().slice(0, 10) + "T23:59:59";
        console.log("monitor", this.selected);
        this.$store.commit('setWordCloud',"")
        this.$store.dispatch("fetchWordCloud", {
          start_date: todays,
          end_date: todaye,
          keywords: this.keyword,
          domain: this.domain_name,
          monitor: this.selected,
        });

        this.$store.commit("setWordCloudStartDate", todays);
        this.$store.commit("setWordCloudEndDate", todaye);
        this.$router.push({ name: "WordcloudSentiment" });
      } else {
          this.$store.commit('setWordCloud',"")
        this.$store.dispatch("fetchWordCloud", {
          start_date: this.start_date,
          end_date: this.end_date,
          keywords: this.keyword,
          domain: this.domain_name,
          monitor: this.selected,
        });
        this.$router.push({ name: "WordcloudSentiment" });
      }
    },
  },
  created: function () {
    this.$store.dispatch("fetchDomain");
    // this.$store.commit("setSelectedMonitor", true);
  },
};
</script>

<style scoped>
.rounded {
  border-radius: 6px !important;
}
.fa-print {
  font-size: 25px;
  cursor: pointer;
}
#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
}
#navHome {
  z-index: 1;
}

.text {
  background-color: #ede7dd;
  width: 550px;
  height: 30pt;
  border-radius: 3pt;
  margin: auto;
}
.domain {
  margin-top: 20pt;
  margin-left: -31rem;
  margin-bottom: 10pt;
}

.form-control {
  margin: auto;
  padding: 15px 20px;
}

.date {
  margin-top: 20pt;
  margin-left: 39.3rem;
  margin-bottom: 10pt;
}

.dropdown-toggle {
  color: #4c412b;
  background-color: #ede7dd;
  border-color: transparent;
}

.dropdown-toggle::after {
  margin-left: 7em;
}
.btn-primary:not(:disabled):not(.disabled).active,
.btn-primary:not(:disabled):not(.disabled):active,
.show > .btn-primary.dropdown-toggle {
  color: #4c412b;
  background-color: #ede7dd;
  border-color: transparent;
}

.show > .btn-primary.dropdown-toggle:focus {
  box-shadow: none !important;
}

.btn-primary:focus {
  box-shadow: none !important;
}

.submit {
  width: 70%;
  background-color: white;
  color: gray;
  border-color: #fed16e !important;
  border-radius: 9px;
  font-weight: bold;
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  #overflow-page {
    overflow: hidden;
  }
}
@media only screen and (min-width: 950px) and (max-width: 1150px) {
  .date {
    margin-top: 20pt;
    margin-left: 11.5rem;
    margin-bottom: 10pt;
  }
  .d-contents {
    font-size: small !important;
  }
  .rounded {
    font-size: small;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .rounded {
    font-size: small;
  }
  .fa-print {
    font-size: 20px;
    margin-right: 5px;
  }
  .p-4 {
    padding: 15px 0px !important;
  }
  .d-contents {
    display: contents !important;
  }
  .title {
    font-size: 5vw !important;
  }
  .col-10 {
    max-width: 100%;
  }
}
</style>
