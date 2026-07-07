<template>
  <div>
    <ExportDocx v-show="getShowReport" />
    <div v-show="!getShowReport">
      <DomainBackBar />
      <!-- <RankTable/> -->
     
      <!-- <ExportDocx/> -->
      <div class="ml-lg-5 mr-lg-5 ml-md-3 mr-md-3 ml-sm-3 mr-sm-3 p-3">
        <DomainGraph class="mt-1" id="statgraph" />
        <StaticDomain class="mt-3" id="statcap" />

      

        <!-- <SlideSpotNews class="mt-5" v-if="username =='adminatapy'"/> -->

        <SlideSpotNews class="mt-5" />


        <SlideSpotSocial class="mt-1" />
          <TopObjectChart />

        <!-- <SlideSpotNews class="mt-5" /> -->
          <WordcloudDomain
        v-if="getDataWordcloud"
        :data="getDataWordcloud"
        :is-loading="getLoadDataWordcloud"
        :error="errorMsg"
        :start="getSdateDm"
        :end="getEdateDm"
        storage-key="dashboard-a"
        @select="onSelectWord"
      />
        <!-- <DomainCloud class="mt-5" /> -->
        <TopUser class="mt-2" />
        <TopUserFreq class="mt-1" />
        <!-- <TopUser2 class="mt-5" /> -->
        <TopPostDomain class="mt-2" />
        <AllPostDomain class="mt-2" />
      </div>
    </div>
  </div>
</template>

<script>
import DomainBackBar from "@/components/domain/DomainBackBar.vue";
import DomainGraph from "@/components/domain/DomainGraph.vue";
import StaticDomain from "@/components/domain/StaticDomain.vue";
// import DomainCloud from "@/components/domain/DomainCloud.vue";
import TopPostDomain from "@/components/domain/TopPostDomain.vue";
import AllPostDomain from "@/components/domain/AllPostDomain.vue";
import TopUser from "@/components/domain/TopUser.vue";
import TopUserFreq from "./TopUserFreq.vue";
import TopUser2 from "@/components/domain/TopUser2.vue";
import SlideSpotNews from "./SlideSpotNews.vue";
import SlideSpotSocial from "./SlideSpotSocial.vue";
import RankTable from "@/components/chart/RankTable.vue";
import TopObjectChart from "@/components/chart/TopObjectChart.vue";
import WordcloudDomain from "./WordcloudDomain.vue";
// import ExportDomainDocx from "@/components/domain/ExportDomainDocx.vue";
import ExportDocx from "./ExportDocx.vue";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["getShowReport", "getDataWordcloud", "getLoadDataWordcloud", "getSdateDm", "getEdateDm"]),
    // ✅ ใช้วันที่จาก store (ที่ DomainBackBar commit ไว้ตอน selectData) มาโชว์บน wordcloud
    startDate() {
      return this.getSdateDm;
    },
    endDate() {
      return this.getEdateDm;
    },
  },
  data() {
    return {
      username: "",
      errorMsg: "",
    }
  },
  components: {
    DomainBackBar,
    DomainGraph,
    StaticDomain,
    // DomainCloud,
    TopPostDomain,
    AllPostDomain,
    TopUser,
    TopUser2,
    SlideSpotSocial,
    TopUserFreq,
    // ExportDomainDocx,
    ExportDocx,
    SlideSpotNews,
    RankTable,
    TopObjectChart,
    WordcloudDomain
  },
  methods: {
    onSelectWord(word) {
      // const selectedWord = String(word || "").trim();
      // if (!selectedWord) return;

      // this.$emitter.emit("domainKeyword2", selectedWord);
      // this.$nextTick(() => {
      //   const postSection = document.getElementById("filter-input") || document.getElementById("profile-page");
      //   if (postSection) postSection.scrollIntoView({ behavior: "smooth", block: "start" });
      // });
    },
  },
  created() {
    this.username = localStorage.getItem("username");

  },
};
</script>

<style scoped>
/* .container, .container-lg, .container-md, .container-sm, .container-xl {
    max-width: 1350px;
} */
#active {
  text-decoration: underline;
}

.title-domain a {
  cursor: pointer;
  color: #2c3e50;
}

.title-domain {
  cursor: pointer;
  text-align: start;
  margin-left: 12%;
  margin-bottom: 20px !important;
}

@media only screen and (min-width: 0px) and(max-width:600px) {}
</style>
