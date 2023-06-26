<template>
  <!-- Card body -->
  <div class="text-center mt-3 pl-lg-3 pr-lg-3">
    <b-row>
      <b-col md="12" lg="4" class="font-weight-bold mb-5">
         <b-card id="box-profile" v-if="getProfileMonitor.topfive!=''">
        <span class="h5 font-weight-bold">Top5 Hashtag</span>
        <hr class="mb-0">
        <div id="top-content" class="text-left" >
        <div class="border-bottom p-3" v-for="(topHashtag,k) in getProfileHash.topfive" :key="k"
        @click="selectHashtag(topHashtag.name)" >
          {{k+1}} {{topHashtag.name}} <div class="font-weight-normal small">{{topHashtag.count|numFormat}} posts</div>
        </div>
       </div>
      
        </b-card >
        <b-card  v-else >
        <span class="h5 font-weight-bold">Top5 Hashtag</span>
        <hr class="mb-0">
       <div class="font-weight-normal">
         <br>
              ไม่พบข้อมูล
       </div>
       </b-card>

      </b-col>
      <b-col md="12" lg="8" class="font-weight-bold mb-5" >
   
        <ProfileWordCloud/>

      </b-col>
      <b-col md="12" lg="12" class="font-weight-bold mb-5" >
      <TabPost :tabs="'hashtagTab'" :api="checkApi"  :dh="HashtagName" />
      </b-col>
    </b-row>
    <div class="mt-3" >
    </div>
  </div>

</template>

<script>
import TabPost from '@/components/profile/TabPost.vue';
import ProfileWordCloud from '@/components/profile/ProfileWordCloud.vue';
import { mapGetters } from 'vuex';

export default {
    components: {
TabPost,ProfileWordCloud
  },
props:{
checkApi:{
  type:String
}
},
computed: {
       ...mapGetters(['getProfileMonitor','getProfileData','getTabStatus','getLoadStatus2','getHashtagData',"getProfileHash"]),
        HashtagName(){
          var d =this.ht
          if(d==''){
             d = ''
            // var data = this.getProfileMonitor.topfive;
            //   var dmn
            
            //   for (let i = 0,len = data.length; i < len; i++) {
            //       dmn += data[i].name + ","
            //       d= dmn.replace('undefined','').replaceAll('#','')
            //   }
      
          }else{
            d=this.ht
          }
          return d
       },
       },
data() {
    return {
      ht:''
    }
    },
    methods:{
       selectHashtag(hashtag){
       this.ht=hashtag.replaceAll('#','')
    },
   
    },
async created() {
//  this.$store.commit('setTabStatus',false)
//   await this.$store.dispatch('fetchProfileMonitor',{query:this.getProfileData,api_type:"account",top_type:"hashtag", sort_by: "",})
},
}
</script>

<style scoped>
.card-body {
    min-height: 32rem;
}
#img-wordcloud{
  width:100% !important;
}
.p-3:hover{
  background: rgb(0 0 0 / 3%);
  cursor: pointer;
}
#box-profile{
    width: 100%;
    height: auto;
    display: block;
    padding: 20px 0px;
    padding-bottom: 0px;
   border-radius: 7px;
   border: 1px solid rgba(0,0,0,0.1);
   /* box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); */
}
.select-sort{
  width: 80%;
}
@media (max-width: 1200px){
.col-lg-8 {
    flex: 0 0 100%;
    max-width: 100%;
}
.col-lg-4 {
   flex: 0 0 100%;
    max-width: 100%;
}

} 
</style>