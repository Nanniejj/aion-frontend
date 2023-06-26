<template>
  <div>
   <!-- for phone -->
       <div id="flowPhone">
        <div  @click="backdashboard" style="cursor: pointer;" ><a>Sentiment</a> |</div>
        <div  v-if="status===1" ><span  style="margin-left: 5px;color: #54c69d;"><b>Positive</b></span></div>
        <div  v-if="status===-1" ><span  style="margin-left: 5px;color:#f7776a;"> <b>Negative</b></span></div>
        <div  v-if="status===0" ><span  style="margin-left: 5px;color:#3a86ad;"> <b>Neutral</b></span></div>
      </div>
      <!-- for desktop -->
      <div id="flowBoxes">
         <div class="rightt hov" @click="backdashboard()" style="cursor: pointer;color:#4c412b;" ><a>Sentiment</a><span class="prt"> /</span></div>
        <div class="leftt " v-if="status===1" style="background-color:#54c69d;"><span  style="margin-left: 18px;color: white;">Positive</span></div>
        <div class="leftt " v-if="status===-1" style="background-color:#f7776a;"><span  style="margin-left: 18px;color: white;">Negative</span></div>
        <div class="leftt " v-if="status===0" style="background-color:#3a86ad;"><span  style="margin-left: 18px;color: white;">Neutral</span></div>
      </div>
      <div class="date-box" v-if="ssdate===eedate">
         <i class="fa fa-calendar" /><span> {{ ssdate}}</span>
      </div>
      <div class="date-box" v-else>
         <i class="fa fa-calendar" /><span> {{ ssdate}} - {{eedate}}</span>
      </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
   props:{
    status:{
      type:Number,
    }
  },
  data() {
    return {
        sen:'Positive',
        sdate:"",
        edate:"",
    }
},
computed:{ ...mapGetters(["getSentimentPost","getRangeStartdate","getRangeEnddate"]),
ssdate(){
    var ssdate=this.sdate
    var s = new Date(this.getRangeStartdate.slice(0,10))
    // var e = new Date(this.getWordCloudEndDate.slice(0,10))
    ssdate=new Intl.DateTimeFormat('en-AU').format(s)
    // this.edate=new Intl.DateTimeFormat('en-AU').format(e)
    return  ssdate
  },
  eedate(){
    var eedate = this.edate
    var e = new Date(this.getRangeEnddate.slice(0,10))
    eedate=new Intl.DateTimeFormat('en-AU').format(e)
    return  eedate
  },
  },

methods:{
    backdashboard: function () {
      this.$router.push({ name: "Dashboard" });
       //this.$store.dispatch("fetchSentimentStat",{start_date:this.getRangeStartdate,end_date:this.getRangeEnddate});
      console.log('555555555'+this.sentiment);
    },
},

}
</script>

<style scoped>
.date-box{
  text-align: start;
  color: #4c412b;
  font-weight: bold;
   margin-left: 50px;
}
.hov:hover{
  box-shadow: -2px 3px 4px #888888;
}
#flowPhone{
  display: none;
}
#flowBoxes {
   font-size: x-large;
   font-weight: bold;
   text-align: start;
   margin-left: 30px;
  padding:20px;
}
#flowBoxes div {
    display:inline-block;
    position:relative;
    height:40px;
    line-height:40px;
    padding:0 20px;
    /* border:1px solid #ccc; */
    margin-right:9px;
    background-color:#ede7dd;
}

#flowBoxes div.rightt:after{
       content: '';
    /* border-top: 1px solid #ccc;
    border-right: 1px solid #ccc; */
    width: 28px;
    height: 28px;
    position: absolute;
    right: 0;
    top: 2px;
    background-color: #ede7dd;
    z-index: 150;
    transform: translate(14px,4px) rotate(45deg) !important;
    -webkit-transform: translate(10px,4px) rotate(45deg);
    -moz-transform: translate(10px,4px) rotate(45deg);
    -ms-transform: translate(10px,4px) rotate(45deg);
    -o-transform: translate(10px,4px) rotate(20deg);          
}

#flowBoxes div.leftt:before{
    content: '';
    /* border-top: 1px solid #ccc;
    border-right: 1px solid #ccc; */
    width: 28px;
    height: 28px;
    position: absolute;
    left: 0;
    top: 2px;
    background-color:white;
    z-index:50;
    -webkit-transform: translate(-10px,4px) rotate(45deg);
    -moz-transform: translate(-10px,4px) rotate(45deg);
    -ms-transform: translate(-10px,4px) rotate(45deg);
    -o-transform: translate(-10px,4px) rotate(20deg);
    transform: translate(-15px,4px) rotate(45deg);
}
#flowBoxes .active{
    background-color:#4c412b;
    color:white;
}
#flowBoxes div.active:after{
    background-color:#4c412b;
}
@media only screen and (min-width: 0px) and (max-width: 750px) {
  #date-box{
  text-align: start;
  color: #4c412b;
  font-weight: bold;
   margin-left: 20px;
}
#flowBoxes{
display:none;
}
#flowPhone{
  background: #ddd;
  display: -webkit-box;
  color: #616569;
  padding: 8px 10px;
  margin-bottom: 10px;
}
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
 
#flowBoxes {
   font-size: 1em;
}
#flowBoxes div {
    margin-bottom: 5px;
    box-shadow: 2px 1px 4px #888888;
}
#flowBoxes{
display:none;
}
#flowPhone{
  background: #ddd;
  display: -webkit-box;
  color: #616569;
  padding: 8px 10px;
  margin-bottom: 10px;
}
#user-name{
      line-break: anywhere;
}
}
</style>