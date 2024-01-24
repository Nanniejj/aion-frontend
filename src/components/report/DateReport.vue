<template>
  <div>
    <div style="margin: auto" class="px-lg-5">
      <b-row>
        <!-- <b-col sm class="mb-2">
          <div class="text-left sw-date">
            <span id="text-table">
              Daily <i class="fa fa-calendar-day"></i></span
            ><b-form-checkbox switch size="lg" @change="tab()">
              <span id="text-chart"
                ><i class="fa fa-calendar-week"></i> Weekly</span
              ></b-form-checkbox
            >
          </div>
        </b-col> -->
        <b-col class="text-right">
        
          <section id="date-picker">
            <date-picker
              v-model="valueDate"
              type="date" range
              placeholder="เลือกช่วงเวลา"
              :disabled-date="(date) => date >= new Date()"
              value-type="YYYY-MM-DD"
              format="YYYY-MM-DD"
              @change="selectRange()"
              >{{ valueDate }}</date-picker
            >
            <!-- <date-picker
              v-show="selectedTab"
              v-model="valueWeek"
              type="week"
              :disabled-date="(date) => date >= new Date()"
              placeholder="Select week"
              @change="selectWeek()"
              value-type="w"
            ></date-picker>
            <date-picker
              v-show="!selectedTab"
              v-model="valueDate"
              type="date"
              placeholder="เลือกช่วงเวลา"
              :disabled-date="(date) => date >= new Date()"
              value-type="YYYY-MM-DD"
              format="YYYY-MM-DD"
              @change="selectDay()"
              >{{ valueDate }}</date-picker
            > -->
          </section>
          <!-- <section id="date-picker">
              <date-picker v-model="valueDate" value-type="format" format="YYYY-MM-DD" 
              :disabled-date="(date) => date >= new Date()" size='md'   @change="reloadData()"></date-picker>
            </section> -->
        </b-col>
      </b-row>
      <b-row>
        <b-col class="text-left">
          <div class="d-inline-block mt-2">
            <div v-if="startd === endd" class="text-left onedate">
              <i class="far fa-calendar-alt"></i> {{ startd }}
            </div>
            <div v-else class="text-left twodate">
              <i class="far fa-calendar-alt"></i> {{ startd }} - {{ endd }}
            </div>
          </div></b-col
        >
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  watch: {
    getDateReport() {
      this.startd = this.getDateReport[0].slice(0, 10);
      this.endd = this.getDateReport[1].slice(0, 10);
    },
  },
  computed: {
    ...mapGetters([
      "getClickDomain",
      "getSdateDm",
      "getEdateDm",
      "getDateReport",
    ]),
  },
  data() {
    return {
      selectedTab: false,
      valueWeek: null,
      valueDate: moment(new Date())
        .format()
        .slice(0, 10),
      startd: "",
      endd: "",
    };
  },
  methods: {
      
    // selectWeek() {
    //   const d = new Date();
    //   let year = d.getFullYear();
    //   let start;
    //   let end;
    //   let weekNumber = this.valueWeek;
    //   var sunday = new Date(year, 0, 1 + (weekNumber - 1) * 7);
    //   while (sunday.getDay() !== 0) {
    //     sunday.setDate(sunday.getDate() - 1);
    //   }
    //   var date = new Date(sunday);
    //   date.setDate(date.getDate() + 6);
    //   if (this.valueWeek == null) {
    //     start =
    //       moment(new Date())
    //         .format()
    //         .slice(0, 10) + "T00:00:00";
    //     end =
    //       moment(new Date())
    //         .format()
    //         .slice(0, 10) + "T23:59:59";
    //   } else {
    //     start =
    //       moment(sunday)
    //         .format()
    //         .slice(0, 10) + "T00:00:00";
    //     end =
    //       moment(date)
    //         .format()
    //         .slice(0, 10) + "T23:59:59";
    //   }

    //   this.$store.commit("setDateReport", [start, end]);
    //   localStorage.setItem("dateReport", [start, end]);
    //   // console.log("startdate", start, end);
    // },
    selectDay() {
      let start = this.valueDate + "T00:00:00";
      let end = this.valueDate + "T23:59:59";
      if (this.valueDate == null) {
        start =
          moment(new Date())
            .format()
            .slice(0, 10) + "T00:00:00";
        end =
          moment(new Date())
            .format()
            .slice(0, 10) + "T23:59:59";
      } else {
        start = this.valueDate + "T00:00:00";
        end = this.valueDate + "T23:59:59";
      }
      console.log("valueDate", start, end);
      this.$store.commit("setDateReport", [start, end]);
      localStorage.setItem("dateReport", [start, end]);
    },
    selectRange() {
      let start = this.valueDate[0] + "T00:00:00";
      let end = this.valueDate[1] + "T23:59:59";
      if (this.valueDate == null) {
        start =
          moment(new Date())
            .format()
            .slice(0, 10) + "T00:00:00";
        end =
          moment(new Date())
            .format()
            .slice(0, 10) + "T23:59:59";
      } else {
        start = this.valueDate[0] + "T00:00:00";
        end = this.valueDate[1] + "T23:59:59";
      }
      console.log("valueDate", start, end);
      this.$store.commit("setDateReport", [start, end]);
      localStorage.setItem("dateReport", [start, end]);
    },
    tab() {
      if (this.selectedTab) {
        let start = this.valueDate + "T00:00:00";
        let end = this.valueDate + "T23:59:59";
        this.$store.commit("setDateReport", [start, end]);
        this.selectedTab = false;
        document.getElementById("text-table").style.backgroundColor =
          "rgba(254, 209, 110, 0.452)";
        document.getElementById("text-chart").style.backgroundColor = "#fff0";

        // document.getElementById("scroll").style.display = "block";
        console.log("log1");
      } else {
        this.selectedTab = true;
        document.getElementById("text-chart").style.backgroundColor =
          "rgba(254, 209, 110, 0.452)";
        document.getElementById("text-table").style.backgroundColor = "#fff0";
        // document.getElementById("scroll").style.display = "none";
      }
    },
  },
  mounted() {
    let sdate =
      moment(new Date())
        .format()
        .slice(0, 10) + "T00:00:00";
    let edate =
      moment(new Date())
        .format()
        .slice(0, 10) + "T23:59:59";
    this.$store.commit("setDateReport", [sdate, edate]);
    localStorage.setItem("dateReport", [sdate, edate]);
    // let weeknumber = moment("08-14-2022", "MMDDYYYY").isoWeek();
    // let wnum = String(weeknumber + 1);
    // this.valueWeek = wnum;
    // console.log("wnum", wnum);
  },
};
</script>

<style scoped>
#text-chart {
  font-size: 20px;
  color: #4c412b;
  background: transparent;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 6px;
}
#text-table {
  font-size: 20px;
  min-height: 1.5rem;
  vertical-align: bottom;
  margin-right: 10px;
  color: #4c412b;
  background: rgba(254, 209, 110, 0.452);
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 6px;
  text-align: initial;
}
.custom-switch {
  display: -webkit-inline-box;
}
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .sw-date {
    text-align: center !important;
  }
  .mx-datepicker {
    width: 100%;
  }
  #text-table {
    font-size: medium;
  }
  #text-chart {
    font-size: medium;
  }
  .custom-switch {
    font-size: medium;
  }
}
</style>
