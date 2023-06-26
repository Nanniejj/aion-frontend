<template>
  <div>
      <div class="row">
        <div  id="title-inf" style="margin-top:20px"><h4><b>Influencer Original Post</b></h4><span>รายชื่อบัญชีและโพส์ตของ Influencer ที่นำมาหา Relation</span></div>
     </div> 
     <b-row align-h="center" style="padding-bottom:50px">
       <b-col sm="10" md="10" lg="10">
         <b-card style="border:none; ">
          <div v-for="(influencer,k) in getRelationPost.table" :key='k' style="text-align: start;margin-top: 1em;"  class="md-font" id="box-content" >
          <span id="id-k" > <span id="txt-act">
            <span v-if="influencer.action=='retweet'"><i class="fa fa-retweet"/> {{influencer.action}}</span>
            <span v-if="influencer.action=='original'"><i class="fa fa-twitter" ></i> {{influencer.action}} post</span>
            </span></span>
             <img v-bind:src="influencer.tw_obj.user.profile_img" id="img-inf">
             <span> <img src="@/assets/Twitter.png"  class="social-img" > </span>
           <span id="txt-name"> <b>{{influencer.tw_obj.user.name}} </b> 
            <a v-bind:href="'https://twitter.com/' +influencer.tw_from+'/status/'+influencer.tw_obj.uid" class="fa fa-link" target="_blank"></a></span>
           <div id="txt-cmt">{{influencer.tw_obj.full_text}}</div>
           <div style="color:#4c412b;padding: 0px 20px;"><i class="fa fa-retweet"/> {{influencer.retweet.toLocaleString()}}  <span id="space"> </span>
           <i class="fa fa-heart" /> {{influencer.favourites.toLocaleString()}}</div>
           </div>
           
        </b-card>
       </b-col>
     </b-row> 
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data: function() {
    return {};
  },
  computed: {
    ...mapGetters(['getSelected','getInfPostList',"getRelationPost"]),
  },
};
</script>
<style scoped>
#box-content {
  width: -webkit-fill-available;
    background-color:#ede7dd61;
    padding: 20px;
    border-radius: 20px;
    padding-top: 10px;
    border: 1px solid#4c412bad;
    border-bottom: 3px solid #4c412b;
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
  font-size: 40px;
  border-radius: 50%;
  position: relative;
  top: -10px;
}
.social-img {
  width: 35px;
  margin-top: -13px;
  margin-left: -13px;
}
#space{
  margin-left: 10px;
}
@media only screen and (min-width: 0px) and (max-width: 600px){

#overflow-page{
  overflow: hidden;
}
#content > div:nth-child(3) > div > div:nth-child(1) > div:nth-child(3) > div{
  padding-left: 30px;
  padding-right: 30px;
  margin-bottom: 20px;
}
#txt-cmt {
    padding: 10px 0px;
}
.card-body {
    padding-top: 0px;
}
}
</style>