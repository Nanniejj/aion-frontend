<template>
  <div>
    
    <!-- <b-card v-if="this.getProfileMonitor.wordcloud_images.words==''&&this.getProfileMonitor.wordcloud_images.hashtag==''" id="not" >
       <span class="h5 font-weight-bold">WordCloud</span>
        <hr class="mb-3">
         <div class="font-weight-normal">ไม่พบข้อมูล</div> 
      </b-card> -->
      <b-card id="box-profile" v-if="getTabStatus==true">
       
       <span class="h5 font-weight-bold">WordCloud</span>
        <hr class="mb-3">
         <span v-if="getProfileMonitor&&getProfileMonitor.wordcloud_images">
         <div class="font-weight-normal" v-if="this.getProfileMonitor.wordcloud_images.words==''">ไม่พบข้อมูล</div> 
          <img
          v-else
              :src="myImage"
              id="img-tab"
              style="width:100%"
            />
         </span>
      </b-card>

    <b-card id="box-profile" v-else>
       <span class="h5 font-weight-bold">WordCloud</span>
        <hr class="mb-3">
         <span v-if="getProfileMonitor&&getProfileMonitor.wordcloud_images">
         <div class="font-weight-normal" v-if="this.getProfileMonitor.wordcloud_images.hashtag==''">ไม่พบข้อมูล</div> 
          <img
          v-else
              :src="myImageHash"
              id="img-tab"
              style="width:100%"
            />
         </span>
      </b-card>
      
    

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {

    computed: {
       ...mapGetters(['getProfileMonitor','getProfileData','getTabStatus']),
        myImage() {
      if (this.getProfileMonitor.wordcloud_images) {
        return (
          `data:image/jpeg;base64,` +
          this.getProfileMonitor.wordcloud_images.words.substring(2).replace("'", "")
        );
      }else {
        return "";
      }
    },
       myImageHash() {
      if(this.getProfileMonitor.wordcloud_images){
         return (
          `data:image/jpeg;base64,` +
          this.getProfileMonitor.wordcloud_images.hashtag.substring(2).replace("'", "")
        );
      }else {
        return "";
      }
    }
       },
data() {
    return {
       imageWord: "",
       imageHashtag:""
    }
    },


};
</script>

<style scoped>
.card-body {
    min-height: 32rem;
}
#box-profile{
    width: 100%;
    height: auto;
    display: block;
    padding-bottom: 0px;
   border-radius: 7px;
   border: 1px solid rgba(0,0,0,0.1);
   /* box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); */
}
@media only screen and (min-width: 0px) and (max-width: 600px){
  .card-body {
    min-height: auto !important;
}}

 
</style>