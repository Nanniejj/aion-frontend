<template>
<div>
<PlatFormBackBar/>
<div class="ml-lg-5 mr-lg-5 ml-md-3 mr-md-3 ml-sm-3 mr-sm-3 p-3">
    <StatPlatForm />
    <PlatFormGraph class="mt-1" />
    
    <PlatFormCloud  />
    <TopUser class="mt-5" />
     <TopPostDomain class="mt-5" />
      <AllPostPlatForm class="mt-5"/>
</div>
</div>
  
</template>

<script>
import PlatFormBackBar from "@/components/platform/PlatFormBackBar.vue";
import PlatFormGraph from "@/components/platform/PlatFormGraph.vue";
import StatPlatForm from "@/components/platform/StatPlatForm.vue";
import PlatFormCloud from "@/components/platform/PlatFormCloud.vue";
import TopUser from "@/components/platform/TopUserPlatform.vue";
import AllPostPlatForm from "@/components/platform/AllPostPlatForm.vue";
import TopPostDomain from "@/components/domain/TopPostDomain.vue";
import { mapGetters } from "vuex";

export default {
     computed: {
    ...mapGetters([
      "getNamePlatform"
    ]),
  },
components:{
PlatFormBackBar,
PlatFormGraph,
StatPlatForm,
PlatFormCloud,
TopUser,
AllPostPlatForm,
TopPostDomain
}
}
</script>

<style>

</style>