<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
    <div id="content">
      <!-- {{ valueDate }} -->
      <h1 class="title">Hashtag</h1>
      <h4 class="title-monitor">
        <router-link :to="{ name: 'Monitor' }">Monitor </router-link>
        <i class="fas fa-angle-right" /><span id="active">Hashtag </span>
      </h4>
      <b-container>
        <b-row>
          <b-col md="12" lg="4">
            <HashtagInfo />
          </b-col>
          <b-col md="12" lg="8">
            <section
              id="date-picker"
              class="d-block position-relative align-bottom text-right mt-sm-3 mt-md-3 mt-lg-0 mt-3"
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
                @change="checkDateRange()"
                id="date-domain"
                >{{ valueDate }}</date-picker
              >
            </section>
            <HashtagTab />
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import HashtagInfo from "@/components/hashtag/HashtagInfo.vue";
import HomeNav from "@/components/HomeNav.vue";
import HashtagTab from "@/components/hashtag/HashtagTab.vue";
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  computed: {
    ...mapGetters(["getCnt", "getProfileData", "getHashtagData","getValSource"]),
  },
  data() {
    return {
      valueDate: [this.datearre, this.datearrs],
      start_date: "",
      end_date: "",
      datearrs: null,
      datearre: null,
    };
  },
  components: {
    HomeNav,
    HashtagInfo,
    HashtagTab,
  },
  methods: {
    checkDateRange() {
      const startDate = moment(this.valueDate[0]);
      const endDate = moment(this.valueDate[1]);

      const diffDays = endDate.diff(startDate, 'days');

      if (diffDays > 31) {
        alert('กรุณาเลือกช่วงเวลาที่ไม่เกิน 1 เดือน หรือ 31 วัน');
        this.valueDate[1] = startDate.add(31, 'days').format('YYYY-MM-DD');
      }else{
        this.selectData(); // Call your existing method
      }
    },
    selectData() {
      //console.log(this.valueDate[0], this.valueDate[1]);
      if (this.valueDate[0] == null) {
        this.start_date = "";
        this.end_date = "";
        //  this.start_date = moment(new Date()).format().slice(0,10) + "T00:00:00";
        //  this.end_date = moment(new Date()).format().slice(0,10) + "T23:59:59";
      } else {
        this.start_date = this.valueDate[0] + "T00:00:00";
        this.end_date = this.valueDate[1] + "T23:59:59";
      }

      this.$store.commit("setSDateHt", this.start_date);
      this.$store.commit("setEDateHt", this.end_date);
      this.$store.commit("setArrDateHashtag", this.valueDate);

      //wordcloud
      // this.$store.dispatch("fetchWordCloud", {
      //   start_date: this.start_date,
      //   end_date: this.end_date,
      //   domain: this.getClickDomain,
      // });
    },
  },

  mounted() {},
  async created() {
    var currentTime = new Date();
    currentTime.setDate(currentTime.getDate() - 6);
    this.datearre = moment(new Date())
      .format()
      .slice(0, 10);
    this.datearrs = moment(currentTime)
      .format()
      .slice(0, 10);
    this.valueDate = [this.datearrs, this.datearre];
    this.start_date = this.valueDate[0] + "T00:00:00";
    this.end_date = this.valueDate[1] + "T23:59:59";
    this.$store.commit("setSDateHt", this.start_date);
    this.$store.commit("setEDateHt", this.end_date);
    this.$store.commit("setArrDateHashtag", this.valueDate);
    // console.log(
    //   "     this.datearre ",
    //   this.datearrs,
    //   this.datearre,
    //   this.valueDate
    // );
    if (this.getHashtagData) {
      var hashtag = this.getHashtagData.replace("#", "");
      localStorage.setItem("hash", hashtag);
      await this.$store.dispatch("fetchProfileMonitor", {
        query: hashtag,
        api_type: "hashtag",
        top_type: "domain",
        sort_by: "",
        source: this.getValSource
       
      });
      this.$store.commit("setCnt2", this.getCnt);
    } else {
      this.$store.commit("setHashtagData", localStorage.getItem("hash"));
      await this.$store.dispatch("fetchProfileMonitor", {
        query: localStorage.getItem("hash"),
        api_type: "hashtag",
        top_type: "domain",
        sort_by: "",
        source: this.getValSource
      });
      console.log("getCnt", this.getCnt);
      this.$store.commit("setCnt2", this.getCnt);
    }
  },
};
</script>

<style scoped>
#active {
  font-weight: 800;
  margin-left: 10px;
}
.title-monitor a {
  cursor: pointer;
  color: #2c3e50;
}
.title-monitor {
  text-align: start;
  margin-left: 9%;
  margin-bottom: 20px !important;
}
.title {
  margin-left: 9%;
}

#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
}
/* @media (max-width: 1200px){
.col-lg-8 {
    flex: 0 0 100%;
    max-width: 100%;
}
.col-lg-4 {
   flex: 0 0 100%;
    max-width: 100%;
}
} */
@media (min-width: 1200px) {
  .container,
  .container-lg,
  .container-md,
  .container-sm,
  .container-xl {
    max-width: 90%;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .title {
    display: none;
  }
}
</style>
