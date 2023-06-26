<template>
    <div class="row">
       <div  id="title-top5" style="margin-top:20px"><h4><b>#Top5</b></h4><span>hashtag 5 อันดับที่ทุกทีมนิยมใช้</span></div>
       <div class="col-12" v-if="getSummaryAvatar">
         <div class="col" id="top5" v-if="getSummaryAvatar.twitter.top5_hashtag.name!=''" >
             <div v-for="(top,k) in getSummaryAvatar.twitter.top5_hashtag.name" v-bind:key="top" >
                 <div ><span id="txt-top5"><b>{{k+1 }}</b></span> {{top}}</div>
             </div>    
       </div>
        <div v-else class="mb-4">ไม่พบข้อมูล #Top5</div>
       </div>
     </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
    data: function() {
    return {
        top:[],

    };
  },
computed: {
    ...mapGetters(["getSummaryAvatar"]),
  },}
</script>
<style scoped>
#title-top5{
  color: #4e432d;
  background: #ede7dd;
    padding: 15px;
    width: 80%;
    margin: auto;
    border-radius: 15px;
    margin-bottom: 20px;
}
#txt-top5{
width: 26px;
display: inline-block;
background: #4e432d;
text-align: center;
margin-bottom: 5px;
 margin-right: 12px;
border-radius: 50%;
color: white;
}
#top5{
  text-align: left;
    display: block;
    margin: auto;
    width: fit-content;
    margin-bottom: 30px;
}
#text{
  text-align: left;
}
</style>
