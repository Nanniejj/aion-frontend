<template>
  <div>
    <ExportDocx v-show="getShowReport" />
    <div v-show="!getShowReport">
      <DomainBackBar />
      <!-- <ExportDocx/> -->
      <div class="ml-lg-5 mr-lg-5 ml-md-3 mr-md-3 ml-sm-3 mr-sm-3 p-3">
        <DomainGraph class="mt-1" id="statgraph" />
        <StaticDomain class="mt-3" id="statcap" />
        <SlideSpotNews class="mt-5" v-if="username =='adminatapy'"/>
        <DomainCloud class="mt-5" />
        <TopUser class="mt-5" />
        <TopUserFreq class="mt-1" />
        <!-- <TopUser2 class="mt-5" /> -->
        <TopPostDomain class="mt-5" />
        <AllPostDomain class="mt-5" />
      </div>
    </div>
  </div>
</template>

<script>
import DomainBackBar from "@/components/domain/DomainBackBar.vue";
import DomainGraph from "@/components/domain/DomainGraph.vue";
import StaticDomain from "@/components/domain/StaticDomain.vue";
import DomainCloud from "@/components/domain/DomainCloud.vue";
import TopPostDomain from "@/components/domain/TopPostDomain.vue";
import AllPostDomain from "@/components/domain/AllPostDomain.vue";
import TopUser from "@/components/domain/TopUser.vue";
import TopUserFreq from "./TopUserFreq.vue";
import TopUser2 from "@/components/domain/TopUser2.vue";
 import SlideSpotNews from "./SlideSpotNews.vue";
// import ExportDomainDocx from "@/components/domain/ExportDomainDocx.vue";
import ExportDocx from "./ExportDocx.vue";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["getShowReport"]),
  },
  data() {
    return {
      username:""
    }
  },
  components: {
    DomainBackBar,
    DomainGraph,
    StaticDomain,
    DomainCloud,
    TopPostDomain,
    AllPostDomain,
    TopUser,
    TopUser2,

    TopUserFreq,
    // ExportDomainDocx,
    ExportDocx,
  SlideSpotNews
  },
  methods: {},
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
@media only screen and (min-width: 0px) and(max-width:600px) {
}
</style>
