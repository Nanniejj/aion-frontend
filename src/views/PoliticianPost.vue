<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
    <div id="content">
      <h1 class="title">Politician</h1>
      <AllPostCandidate />
    </div>
  </div>
</template>

<script>
import HomeNav from "@/components/HomeNav.vue";
import AllPostCandidate from "@/components/politician/AllPostCandidate.vue";
import { mapGetters } from "vuex";

export default {
  name: "CandidatesPost",
  components: {
    HomeNav,
    AllPostCandidate,
  },
  data() {
    return {
      valueDate: "",
      start_date: "",
      end_date: "",
    };
  },
  computed: {
    ...mapGetters(["getRoleMion"]),
  },
  methods: {
    checkDateRange() {
      const startDate = moment(this.valueDate[0]);
      const endDate = moment(this.valueDate[1]);

      const diffDays = endDate.diff(startDate, "days");

      if (diffDays > 31) {
        alert("กรุณาเลือกช่วงเวลาที่ไม่เกิน 1 เดือน หรือ 31 วัน");
        this.valueDate[1] = startDate.add(31, "days").format("YYYY-MM-DD");
      } else {
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
    },
  },
};
</script>

<style>
#active {
  /* text-decoration: underline; */
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
  /* min-height: 100vh; */
  padding: 0;
}
/* @media (min-width: 1200px) {
  .container,
  .container-lg,
  .container-md,
  .container-sm,
  .container-xl {
    max-width: 90%;
  }
} */
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .title {
    display: none;
  }
}
</style>
