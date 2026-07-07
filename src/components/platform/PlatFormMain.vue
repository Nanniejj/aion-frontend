<template>
<div>
<PlatFormBackBar/>
<div class="ml-lg-5 mr-lg-5 ml-md-3 mr-md-3 ml-sm-3 mr-sm-3 p-3">
    <StatPlatForm />
    <PlatFormHourlyGraph class="mt-1" />
    <PlatFormGraph class="mt-1" />
           <WordcloudDomain
        v-if="getDataWordcloud"
        :data="getDataWordcloud"
        :is-loading="getLoadDataWordcloud"
        :error="errorMsg"
        :start="getRangeStartdate"
        :end="getRangeEnddate"
        storage-key="dashboard-a"
        @select="onSelectWord"
      />
    <!-- <PlatFormCloud  /> -->
    <TopUser class="mt-2" />
    <TopPostDomain class="mt-2" />
    <AllPostPlatForm class="mt-2"/>
</div>
</div>
  
</template>

<script>
import PlatFormBackBar from "@/components/platform/PlatFormBackBar.vue";
import PlatFormGraph from "@/components/platform/PlatFormGraph.vue";
import PlatFormHourlyGraph from "@/components/platform/PlatFormHourlyGraph.vue";
import StatPlatForm from "@/components/platform/StatPlatForm.vue";
// import PlatFormCloud from "@/components/platform/PlatFormCloud.vue";
import TopUser from "@/components/platform/TopUserPlatform.vue";
import AllPostPlatForm from "@/components/platform/AllPostPlatForm.vue";
import TopPostDomain from "@/components/domain/TopPostDomain.vue";
import WordcloudDomain from "@/components/domain/WordcloudDomain.vue";

import { mapGetters } from "vuex";

export default {
     computed: {
    ...mapGetters([
      "getNamePlatform","getDataWordcloud" , "getSdateDm",
      "getEdateDm",
      "getNamePlatform",
      "getDomainArr",
      "getRangeStartdate",
      "getRangeEnddate",
      "getLoadDataWordcloud"
    ]),
  },
  data() {
    return {
      errorMsg: "",
    };
  },
components:{
PlatFormBackBar,
    PlatFormGraph,
PlatFormHourlyGraph,
StatPlatForm,
// PlatFormCloud,
TopUser,
AllPostPlatForm,
TopPostDomain,
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
}
</script>

<style>

</style>