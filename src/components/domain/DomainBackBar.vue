<template>
  <div>
    <b-row class="pt-md-3 pt-sm-1 pt-lg-3">
      <b-col class="text-left" lg="auto">
        <!-- for Phone -->
        <div id="flowPhone">
          <div id="flow-tt">
            <h5 class="title-domain">
              <span @click="backDomain"> Domain </span>
              <i class="fas fa-angle-right" />
              <span id="active"> {{ getClickDomain }} </span>
            </h5>
          </div>
        </div>
        <!-- for desktop -->
        <span id="flowBoxes">
          <div
            class="rightt hov"
            @click="backDomain"
            style="cursor: pointer; color: #4c412b"
          >
            <a>Domain</a>
            <span class="prt"> /</span>
          </div>
          <div class="leftt rightt hov active" style="cursor: pointer">
            <a style="margin-left: 18px"
              ><span>{{ getClickDomain }}</span>
            </a>
          </div>
        </span>
      </b-col>
      <b-col class="text-lg-right mt-sm-2 mt-md-4 mt-lg-2">
        <section
          id="date-picker"
          class="d-inline position-relative align-bottom"
        >
          <date-picker
            v-model="valueDate"
            type="date"
            range
            placeholder="เลือกช่วงเวลา"
            size="sm"
            :disabled-date="(date) => date >= new Date()"
            value-type="format"
            format="YYYY-MM-DD"
            @change="selectData()"
            id="date-domain"
            >{{ valueDate }}</date-picker
          >
        </section>
        <i
          class="fas fa-print fa-2x d-inline ml-2 mr-3"
          style="cursor: pointer"
          @click="printWindow()"
        ></i>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  computed: {
    ...mapGetters(["getClickDomain", "getSdateDm", "getEdateDm"]),
  },
  data() {
    return {
      valueDate: [ moment(new Date()).format().slice(0, 10),moment(new Date()).format().slice(0, 10)],
      start_date: "",
      end_date: "",
    };
  },
  methods: {
    selectData() {
      //console.log(this.valueDate[0], this.valueDate[1]);
      if (this.valueDate[0]==null) {
       this.start_date = moment(new Date()).format().slice(0,10) + "T00:00:00";
       this.end_date = moment(new Date()).format().slice(0,10) + "T23:59:59";
      }else{
      this.start_date = this.valueDate[0] + "T00:00:00";
      this.end_date = this.valueDate[1] + "T23:59:59";
      }
     
      this.$store.commit("setSdateDm", this.start_date);
      this.$store.commit("setEdateDm", this.end_date);
      this.$store.commit("setArrDate", this.valueDate);

      //wordcloud
      this.$store.dispatch("fetchWordCloud", {
        start_date: this.start_date,
        end_date: this.end_date,
        domain: this.getClickDomain,
        //   monitor: this.selected
      });

      //TopPost
      this.$store.dispatch("fetchPostDomain", {
        start_date: this.start_date,
        end_date: this.end_date,
        sort_by: "engagement",
        offset: 0,
        domain: this.getClickDomain,
      });

      //AllPost
      this.$store.dispatch("fetchAllPostDomain", {
        start_date: this.start_date,
        end_date: this.end_date,
        sort_by: "",
        offset: 0,
        domain: this.getClickDomain,
      });
    },
    backDomain() {
      this.$store.commit("setPushDomainStat", false);
    },
    printWindow: function () {
      try {
        window.print();
      } catch (err) {
        console.log(err);
      }
    },

  },
};
</script>

<style scoped>
.fa-print {
  font-size: 27px;
}
#date-picker > div > div > input {
  width: 67% !important;
}
.mx-input-wrapper {
  width: 67% !important;
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
    display: -webkit-box;
    padding: 8px 10px;
  }
  .fa-print {
    font-size: 25px;
  }
}
</style>