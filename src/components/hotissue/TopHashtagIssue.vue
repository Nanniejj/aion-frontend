<template>
  <div>
    <b-card id="box-profile">
      <vue-element-loading
        :active="getLoadHashIssue"
        size="80"
        background-color="rgba(255, 255, 255, 0.6)"
        color="#fbf7f6"
      />
      <!-- {{ getListIssue }} -->
      <hr class="mb-0" />
      <div id="top-content" class="text-left">
        <div
       
          class="border-bottom p-3"
          v-for="(topHash, k) in hash"
          :key="k"
          @click="selectDomain(topHash)"
         
        >
          <span v-if="hash"
            >{{ k + 1 }} <b>{{ topHash }}</b></span
          >
         
          <span v-else> Loading . . . </span>
          <!-- <div class="font-weight-normal small">
            {{ topHash.count | numFormat }} posts
          </div> -->
        </div>
        <div v-if="hash==''" class="text-center mt-2">ไม่พบข้อมูล</div>
      </div>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VueElementLoading from "vue-element-loading";
import moment from "moment";
export default {
  components: {
    VueElementLoading,
  },
  watch: {
    getListIssue() {
      this.getData;
    },
    // getSocialIssue() {
    //   this.getData(this.getSelectIssue, this.getDateIssue, this.getSocialIssue);
    // },
    getStatusSearch() {
      console.log("this.getSelectIssue222", this.getSelectIssue);
      this.getData(this.getSelectIssue, this.getDateIssue, this.getSocialIssue);
    },
    // getDateIssue() {
    //   console.log('this.getSelectIssue',this.getSelectIssue);
    //   this.getData(this.getSelectIssue,this.getDateIssue);
    // },
  },
  computed: {
    ...mapGetters([
      "getSdateDm",
      "getEdateDm",
      "getListIssue",
      "getSelectIssue",
      "getDateIssue",
      "getLoadHashIssue",
      "getSocialIssue",
      "getStatusSearch"
    ]),
  },
  data() {
    return {
      startd: "",
      endd: "",
      hash: [
        "Loading...",
        "Loading...",
        "Loading...",
        "Loading...",
        "Loading...",
        "Loading...",
        "Loading...",
        "Loading...",
        "Loading...",
        "Loading...",
      ],
    };
  },
  methods: {
    getData(name, date, social) {
      this.$store.commit("setLoadHashIssue", true);
      let sdate, edate;
      sdate = "&start=" + date[0] + "T00:00:00";
      edate = "&end=" + date[1] + "T23:59:59";
      // this.$store.commit("setLoadTopUserPf", true);
      var config = {
        method: "get",
        url:
          "https://api2.cognizata.com/api/v2/userposts/getTopHastagHotissue?source=" +
          social +
          sdate +
          edate +
          "&name=" +
          name,

        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      this.axios(config)
        .then((response) => {
          // console.log("Toppp response.data", response.data[0].TopHashtags);
          if (response.data[0]) {
            this.hash = response.data[0].TopHashtags;
          } else {
            this.hash = response.data
          }
          
          this.$store.commit("setLoadHashIssue", false);
          // this.$store.commit("setLoadTopUserPf", false);
        })
        .catch(function (error) {
          console.log(error);
          this.$store.commit("setLoadHashIssue", false);
          // this.$store.commit("setLoadTopUserPf", false);
        });
    },
  },

  mounted() {
    let name = localStorage.getItem("issue");
    let today = moment(new Date()).format().slice(0, 10);
    let arrdate = [today, today];
    let social = [
      "facebook",
      "twitter",
      "pantip",
      "news",
      "youtube",
      "instagram",
      "blockdit",
      "tiktok",
    ];
    this.getData(name, arrdate, social);
  },
};
</script>

<style scoped>
#box-profile {
  width: 100%;
  height: auto;
  display: block;
  padding-bottom: 0px;
  border-radius: 7px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>