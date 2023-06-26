<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
     <vue-element-loading :active="getLoadStatus" :is-full-screen="true" size='80' 
    background-color='rgba(0, 0, 0, 0.3)' color='#fff' spinner="bar-fade-scale" />
    <div id="content">
      <BackBar :status ="$route.params.sentiment"/>
      <div class="mb-3 text-right">
        <button id="export-btn" @click="printWindow()">
          <i class="fa fa-print fa-2x" /> 
          <b> Print</b>
        </button>
      </div>
      <b-container>
         <back-to-top bottom="50px" right="50px">
            <button type="button" class="btn btn-to-top"><i class="fa fa-chevron-up"></i></button>
        </back-to-top>
        <!-- <input
        type="text"
        class="form-control md-font"
        v-model="searchQuery"
        v-if="getSentimentPost.length != 0"
        placeholder="ค้นหา"
      />
      <span>
        <button type="button" class="btn btn-default" @click="search()">
          <span id="submit" class="md-font">Search</span>
        </button>
      </span> -->
      <Post :status ="$route.params.sentiment" :social="$route.params.source" :offsets="offset"  :keySearch="searchQuery"/>
      <!-- {{datas}}fjhfgjjh{{$route.params.sentiment}}{{$route.params.source}} -->
 </b-container>
    </div>
  </div>
</template>

<script>
import HomeNav from '@/components/HomeNav.vue';
import BackBar from '@/components/dashboard/BackBar.vue';
//import SentimentPost from '@/components/dashboard/SentimentPost.vue';
import VueElementLoading from "vue-element-loading";
import { mapGetters } from 'vuex';
import Post from '@/components/dashboard/Post.vue';
export default {
  components: {
    HomeNav,BackBar,VueElementLoading,Post
    
  },
  props:{
    datas:{
      type:Object
    },
    source:{
      type:String,
      // default:'facebook',
    },
    sentiment:{
      type:Number,
      // default:1,
    }
    ,
    offset:{
      type:Number,
      // default:0,
    }
  },
  data: function() {
    return {
       searchQuery: "",
 };
  },
  methods:{
    printWindow: function() {
      try {
        window.print();
      } catch (err) {
        console.log(err);
      }
    },
    print () {
      // Pass the element id here
      this.$htmlToPaper('content');
    },
  },
  computed: {
    ...mapGetters(['getSelected','getDateChoice',"getSentimentPost","getLoadStatus"]),
     searchhl() {
      //this.search()
      return this.searchQuery.split();
    },
   
  },
  // created() {
    
  // this.$store.dispatch("fetchSentimentPost",{type:this.getDateChoice,source:this.source,sentiment:this.sentiment,sort_by:"",offset:this.offset});    
  // }, 

};
</script>

<style scoped>
#export-btn{
  margin: 0px 20px;
  color: #495057;
  background-color: #e9ecef;
  border-color: #e9ecef;
  border-radius: 9px;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 20%);  
}
#export-btn:hover{
  color: white;
    background-color: #495057;
    border-color:  #495057;
}
button {
  background-color: #f0f0f0;
  border: solid 1px #bbb;
  padding: 10px;
  font-size: 15px;
  border-radius: 5px;
}

.btn-to-top {
  width: 60px;
  height: 60px;
  padding: 10px 16px;
  border-radius: 50%;
  font-size: 22px;
  line-height: 22px;
    background-color: #fed16e;
    border-color: #fed16e;
      color: #fff;
       box-shadow: 2px 1px 4px #888888;
}
.btn-to-top:hover{

    background-color: #f7c24e;
    border-color: #f7c24e;
      color: #fff;
}
.title-domain{
    text-align: start;
    margin-left: 12%;
    margin-bottom: 20px !important;
}

* {
  font-family: 'Prompt', 'FontAwesome', sans-serif;
}

#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
  padding-bottom: 40px;
}
#navHome {
  z-index: 1;
}

.text {
  background-color: #ede7dd;
  width: 550px;
  height: 30pt;
  border-radius: 3pt;
  margin: auto;
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  #overflow-page {
    overflow: hidden;
  }
}
@media only screen and (min-width: 950px) and (max-width: 1150px) {

}
@media only screen and (min-width: 0px) and (max-width: 600px) {
    #overflow-page {
    overflow: hidden;
  }
  .btn-to-top {
    width: 47px;
    height: 47px;
    padding: 10px 10px;
    border-radius: 50%;
    font-size: 22px;
    line-height: 22px;
}
.vue-back-to-top{
    bottom: 50px !important;
    right: 17px !important;
}
}
</style>
