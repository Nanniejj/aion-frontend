<template>
  <div class="ml-3 mr-3 col-lg-10 col-md-11 m-auto">
    <SearchHotIssue />
    <AddHotIssue />
    
    <b-row class="mt-3">
      <b-col lg="4" md="4" sm >
        <div class="text-left ml-2"><span class="h5 font-weight-bold">Top 10 #Hashtag</span></div> 
        <TopHashtagIssue class="htop"/>
      </b-col>
      <b-col lg="8" md="8" sm>
        <div class="text-left ml-2"><span class="h5 font-weight-bold">Top 10 Posts</span></div> 
          
        <TopPostIssue class="htop" />
      </b-col>
    </b-row>
   <!-- <SocialSelect :tabsocial="'issue'" />    -->
      <AllPostIssue/>

  </div>
</template>

<script>
// import SocialSelect from "@/components/domain/SocialSelect.vue";
import SearchHotIssue from "@/components/hotissue/SearchHotIssue.vue";
import AddHotIssue from "@/components/hotissue/AddHotIssue.vue";
import TopHashtagIssue from "@/components/hotissue/TopHashtagIssue.vue";
import TopPostIssue from "@/components/hotissue/TopPostIssue.vue";
import AllPostIssue from "@/components/hotissue/AllPostIssue.vue";
export default {
  components: {
    SearchHotIssue,
    AddHotIssue,
    TopHashtagIssue,
    TopPostIssue,
    AllPostIssue,
    // SocialSelect
  },
};
</script>

<style scoped>
.htop {
  height: 470px;
  overflow: scroll;
  padding: 10px;
}
</style>