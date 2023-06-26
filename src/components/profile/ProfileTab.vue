<template>
  <div id="tabs" class="mt-3 mb-3">
    <!-- <ProflieSocial/> -->
  <b-tabs content-class="mt-3" lazy 
         active-nav-item-class="font-weight-bold" nav-item-class="font-weight-bold">
  <b-tab >
  <template #title calss="title-tab"><span id="title-tab">Top Domain</span></template>
  <TabDomain :tabs="'DomainTab'" :checkApi="'profile'" />
</b-tab>
<!-- ----------------------------------tab2 --------------------------------------------------->
  <b-tab >
    <template #title id="title-tab"><span id="title-tab">Top Hashtag</span></template>
    <TabHashtag :tabs="'HashtagTab'" :checkApi="'profile'"/>
</b-tab>
<!-- ----------------------------------tab3 --------------------------------------------------->
  <b-tab >
     <template #title id="title-tab"><span id="title-tab">Posts</span></template>
      <TabPost :tabs="'PostTab'" :api="'profile'"/>
  </b-tab>
</b-tabs>
  <b-row align-h="center" style="padding-bottom:50px" >
   </b-row> 
  </div>   

</template>

<script>
import TabDomain from '@/components/profile/TabDomain.vue';
import TabHashtag from '@/components/profile/TabHashtag.vue';
import TabPost from '@/components/profile/TabPost.vue';
import { mapGetters } from "vuex";
export default {
  components:{
    TabDomain,TabHashtag,TabPost
  },
  computed: {
    ...mapGetters([
      "getProfileMonitor",
      "getProfileData",
      "getTabStatus",
      "getLoadStatus2",
      "getTopData",
      "getHashtagData",
      "getCnt",
      "getValSource",
      "getNoMonitor"
    ])},
data() {
  return {
     selected: '1',
      selectedSort: '',
        options: [
          { text: 'Positive', value: '1' },
          { text: 'Neutral', value: '0' },
          { text: 'Negative', value: '-1' }
        ],
        optionSort: [
          { value: '', text: ' โพสต์ล่าสุด' },
          { value: 'b', text: 'โพสต์เริ่มต้น' },
          { value: 'b', text: 'Engagement' },
         
        ]
      }
  }
  ,
  destroyed(){
    this.$store.commit("setSDateProfile", "");
    this.$store.commit("setEDateProfile", "");
  },
  
}
</script>

<style scoped>
.nav-tabs .nav-link.active #title-tab {
       color: #4c412b !important;
}
#title-tab {
  color:#4c412b;
}
.tab-content>.active {
    padding: 5px;
    display: block;
    height: 80vh !important;
    overflow: auto !important;
}
a {
    color: #2c3e50;
    text-decoration: none;
    background-color: transparent;
}

::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: white; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  padding-right: 2px;
  background: #f1f1f1; 
}
#content > div > div > div.col-lg-9{
  overflow: auto;
}
#profile-page{
  padding: 10px;
  height: 80vh;
  overflow-x: hidden;
}
#box-content {
  width: -webkit-fill-available;
    background-color: #ede7dd00;
    /* border-radius: 20px; */
    /* padding-top: 10px; */
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%);
    /* border: 1px solid #ede7dd !important; */
    /* border-bottom: 3px solid #4c412b; */
}
#inf{
  text-align: left;
    display: block;
    margin: auto;
    width: fit-content;
    margin-bottom: 30px;
}
#title-inf{
  color: #4e432d;
  /* background: #ede7dd; */
    padding: 15px;
    width: 80%;
    margin: auto;
    border-radius: 15px;
    margin-bottom: 0px;
}
#txt-inf{
width: 26px;
display: inline-block;
background: #4e432d;
text-align: center;
margin-bottom: 5px;
 margin-right: 12px;
border-radius: 50%;
color: white;
}
#txt-act{
  background: #ede7dd;
  color: #6c757d;
  padding: 3px 10px;
  border-radius: 10px;
}
.fa-link{
  color: #4c412b;
}
.fa-link:hover{
  color: #fed16e;
 text-decoration: none;
}
#txt-cmt{
  text-align: justify;
  padding: 10px 20px;
}
#id-k{
  margin: auto;
    display: block;
    text-align: end;
    color: #c5baba;
}
#txt-name{
  vertical-align: super;
}
#img-inf{
  font-size: 45px;
  border-radius: 50%;
  position: relative;
  top: 3px;
}
.social-img {
  width: 35px;
  margin-top: -13px;
  margin-left: -8px;
}
#space{
  margin-left: 10px;
}

@media only screen and (min-width: 0px) and (max-width: 600px){

#tabs{
    margin-top: 15px;
}

}

</style>