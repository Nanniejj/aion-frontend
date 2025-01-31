<template>
<div>
 <b-container>
 <!-- <Post/> -->
 <div> 
    <div class="container" id="tab-all"> 
        <div class="row">
          
          <b-col sm="12" md="12" lg="6" id="tab-post">
            <b-row>
            <b-col cols="12" >
           <!-- <i class="fa fa-facebook-official fa-3x"/> -->
           <i class="fa fa-facebook-square fa-3x"/>
            
            
            <span  id="post-comment">
               <i class="far fa-paper-plane" /> <b> {{getSentimentPost.count.toLocaleString()}} </b> โพสต์ |
               <i class="far fa-comments"/> <b> {{getSentimentPost.total_comment.toLocaleString()}} </b> คอมเม้นต์</span>
          </b-col>
          </b-row>
          </b-col>
          
          <b-col sm="12" md="12" lg="6" id="tab-view">
            <span id="title-tab"><i class="fas fa-sort-amount-down-alt"></i></span>
            <span id="all-eltab">
            <a id="eltab1" tabindex="0" @click="tabactive()" > <i class="fa fa-clock-o" /> โพสต์ล่าสุด </a> 
            <a id="eltab2"  tabindex="0" @click="tab2()"> <i class="fa fa-repeat"/> โพสต์เริ่มต้น </a> 
            <a id="eltab3"  tabindex="0"  @click="tab3()" > <i class="fa fa-chart-line"/> Engagement </a>
            </span>
           </b-col> 
        </div>
        
      </div>

       
       <!-- <div v-if="data.length == 0" class="md-font">
       <div style="margin-top: 70px">ไม่พบข้อมูล</div> </div> -->
       <div>
        <b-card no-body class="overflow-hidden" 
        header-tag="header" footer-tag="footer" style="max-width: 100%;margin-bottom:30px"
         v-for="(datas,k) in paginate" :key="datas.count" >
            <template #header>
                <b-row>
                    <b-col style="text-align: initial;display: contents;">
                        <img  :src="user" class="user-img" />
                          <img
                        v-if="datas.source === 'twitter'"
                        :src="imgtw"
                        class="social-img"
                      />
                      <img
                        v-if="datas.source === 'facebook'"
                        :src="imgfb"
                        class="social-img"
                      />
                      <img
                        v-if="datas.source === 'pantip'"
                        :src="imgpt"
                        class="social-img"
                      />
                      <img
                        v-if="datas.source === 'youtube'"
                        :src="imgyt"
                        class="social-img"
                      />
                      <img
                        v-if="datas.source === 'news'"
                        :src="imgnw"
                        class="social-img"
                      />
                      <img
                        v-if="datas.source === 'instagram'"
                        :src="imgig"
                        class="social-img"
                      />
                    </b-col>
                    <b-col style='text-align: initial;'>
                     <span  id="user-name" ><b>{{datas.account_name}}</b>  <a class="fa fa-link" target="_blank"></a>
                    <br>11/02/2021 เวลา 12:20 น
                  </span>
                   </b-col>
                   <b-col sm="12" md="4">
                     <!-- <b-button pill variant="outline-secondary">แก้ไขทัศนคติ</b-button> -->
                      <div>
                        <b-form-group label="" v-slot="{ ariaDescribedby }">
                          <b-form-radio-group
                            id="btn-radios-1"
                            v-model="selectedStm"
                            :options="options"
                            :aria-describedby="ariaDescribedby"
                             name="radios-btn-default"
                             size="sm"
                            buttons
                          ></b-form-radio-group>
                        </b-form-group>
                      </div>
                   </b-col>
               </b-row>

            </template>
            <b-row no-gutters>
            <b-col md="3" v-if="datas.snapshot">
                <b-card-img  v-if="datas.snapshot !==null&&datas.snapshot!==undefined" :src="datas.snapshot"
                alt="Image" class="rounded-0" height="100%" style="object-fit: cover;" ></b-card-img>

              <!-- facebook -->
              <!-- <div  v-if="datas.source == 'facebook'&&String(datas.snapshot).includes('scontent')"> 
              <img  v-if="datas.snapshot !==null&&datas.snapshot!==undefined" :src="datas.snapshot" class="img-thumbnail rounded mx-auto d-block" loading="lazy" 
              data-toggle="modal" :data-target="`#demo${k}`" /></div> -->
            </b-col>
            <b-col >
                <b-card-body >
                <b-card-text> 
                  <read-more more-str="อ่านต่อ" :text="datas.content" link="#" less-str="ย่อบทความ" :max-chars="500">
                    </read-more>
                   
                </b-card-text>
                </b-card-body>
            </b-col>
            </b-row>
            <div
          class="text-left ai-box mt-2"
          v-if="datas && datas.ocr &&username=='adminatapy'"
          style="font-size: 15px;font-weight: 500;"
        >
          <div v-for="(text, idx) in datas.ocr">
            <!-- {{ postDomain.ocr.face[].person_name /postDomain.ocr.face[].confidence >) }} -->
                       <div v-if="text.text_sort && text.text_sort.length">
              <b-avatar size="18px"  style="font-size: 12px;background-color:#8b8787;" class="mr-1">{{ idx+1 }} </b-avatar>
              <b-icon icon="textarea-t" scale="1.3"></b-icon> OCR :
              {{ text.text_sort[0] }}
            </div>
            <div v-if="text.face">
              <span v-for="(face, idx) in text.face">
                <span v-if="face.confidence > 0.8" class="mr-2 mt-1">
                  <span
                    style="background: #e5e5e5;
    padding: 0px 6px;
    border-radius: 13px;"
                  >
                    <b-icon icon="person-bounding-box" scale="1"></b-icon>
                    {{ face.person_name.replace("_", " ") }}
                    <span
                      v-b-tooltip.hover
                      :title="'ค่า confidence'"
                      class="small"
                      >({{
                        parseFloat((face.confidence * 100).toFixed(2))
                      }}%)</span
                    ></span
                  ></span
                >
              </span>
            </div>
          </div>
        </div>
        <div v-if="datas && datas.location && datas.location.length && username == 'adminatapy'"
          class="text-left ai-box mt-3 text-small " style="font-size: 13px;font-weight: 500; color: #2c3e50;">
          <i class="fa fa-map-marker mr-1" aria-hidden="true" style="font-size: 15px;"></i>
          <span v-for="(geo, k) in filterNumbers(datas.location)" :key="k" class="mr-1" style="border: 1px solid #2c3e505e  ;padding: 0px 5px;display: inline-flex;text-align: center;
    border-radius: 33px;
">
            <!-- {{ geo.toString() }} -->
            <span v-if="geo.toString() && geo.toString().length == 2">
              {{ matchGeocode(geo).name_th }}
            </span>
            <span v-if="geo.toString() && geo.toString().length == 4">
              {{ matchGeocode(geo.toString().substring(0, 2)).name_th }}
              {{ geo.toString().substring(0, 2) == '10' ? ' ข.' + matchGeocode(geo).name_th : ' อ.' +
                matchGeocode(geo).name_th }}
            </span>
            <span v-if="geo.toString() && geo.toString().length == 6">
              {{ matchGeocode(geo.toString().substring(0, 2)).name_th }}
              {{ geo.toString().substring(0, 2) == '10' ? ' ข.' + matchGeocode(geo).name_th : ' อ.' +
                matchGeocode(geo).name_th }}
              {{ geo.toString().substring(0, 2) == '10' ? 'แขวง' + matchGeocode(geo).name_th : 'ต.' +
                matchGeocode(geo).name_th }}
            </span>
          </span>
        </div>
            <template #footer >
              <span >
                <i class="fas fa-comment" v-popover.top="{ name: 'foo'+ k}" style="cursor:pointer;" /> 
               <span class="md-font"> 12 &nbsp;</span>
               </span>
      </template>
        </b-card>
{{getSentimentPost}}
        <b-card no-body class="overflow-hidden" header-tag="header" footer-tag="footer" style="max-width: 100%;margin-bottom:30px">
            <template #header>
                <h6 class="mb-0">Header Slot</h6>
            </template>
            <b-row no-gutters>
            <b-col md="3">
                <b-card-img src="https://pht.qoo-static.com/DtgfIQ-puwmf9_BVCXqpjBODP-Lb0lGjwUnDHhtgtZL__vrAeDwNjV8u9hhEAbZrx0XL=w300" 
                alt="Image" class="rounded-0" height="100%" style="object-fit: cover;"></b-card-img>
            </b-col>
            <b-col md="9">
                <b-card-body >
                <b-card-text> 
                    <read-more more-str="อ่านต่อ" :text="msg" link="#" less-str="ย่อบทความ" :max-chars="500">
                    </read-more>
                   
                </b-card-text>
                </b-card-body>
            </b-col>
            </b-row>
            <template #footer>
        <em>Footer Slot</em>
      </template>
        </b-card>
<b-card no-body class="overflow-hidden" header-tag="header" footer-tag="footer" style="max-width: 100%;margin-bottom:30px">
            <template #header>
                <h6 class="mb-0">Header Slot</h6>
            </template>
            <b-row no-gutters>
            <b-col md="3">
                <b-card-img src="https://d1o7cxaf8di5ts.cloudfront.net/file/media/origin/2020_02_13/c81e1a7821b31331.jpg" 
                alt="Image" class="rounded-0" height="100%" style="object-fit: cover;"></b-card-img>
            </b-col>
            <b-col md="9">
                <b-card-body >
                <b-card-text> 
                   
                    <read-more more-str="อ่านต่อ" :text="msg" link="#" less-str="ย่อบทความ" :max-chars="500">
                      
                    </read-more>
                   
                </b-card-text>
                </b-card-body>
            </b-col>
            </b-row>
            <template #footer>
        <em>Footer Slot</em>
      </template>
        </b-card>
       
        </div>
        <ul class="pagination" v-if="getSentimentPost.data.length != 0">
        <li
          class="page-item"
            v-for="pageNumber in totalPages" :key="pageNumber">
            <span v-if="Math.abs(pageNumber - currentPage) < 3 ||
            pageNumber == totalPages ||
            pageNumber == 1">
          <a
            class="page-link md-font"
            v-bind:key="pageNumber"
            href="#"
            @click="setPage(pageNumber)"
            :class="{
              current: currentPage === pageNumber,
              last:
                pageNumber == totalPages &&
                Math.abs(pageNumber - currentPage) > 3,
              first: pageNumber == 1 && Math.abs(pageNumber - currentPage) > 3,
            }"
            >{{ pageNumber }}</a
          ></span>
        </li>
      </ul>
      <input
        type="number"
        class="form-control md-font"
        v-model="gotopage"
        id="setpage"
        style="width: 150px"
        v-if="getSentimentPost.data.length != 0"
      />

      <span v-if="getSentimentPost.data.length != 0">
        <button type="button" class="btn btn-default" @click="page()">
          <span id="submit" class="md-font">Go to Page</span>
        </button>
      </span>
</div>
 </b-container>
</div>

</template>

<script>
import { mapGetters } from "vuex";
//import Post from '@/components/dashboard/Post.vue';
import provinces from "@/components/map/provinces.json";
import districts from "@/components/map/districts.json";
import subdistricts from "@/components/map/subdistricts.json";
export default {
    components:{
    // Post,
    },
    data() {
        return {
            social:'facebook',
            searchQuery:'',
            currentPage: 1,
      itemsPerPage: 10,
      resultCount: 0,
      length: 5,
      //length:5, //change this for items per page too
      count: "",
      offset: 20,
      has_next: "",
      gotopage: "",
      msg:"   นายกฯ เล็งอวยพรตรุษจีน วันที่ 12 ก.พ.นี้ ผ่านแอปฯ TikTok ในมุมเบาๆ น่ารักและไม่เครียด วันที่ 10 ก.พ.2564 นายอนุชา บูรพชัยศรี  นายกฯ เล็งอวยพรตรุษจีน วันที่ 12 ก.พ.นี้ ผ่านแอปฯ TikTok ในมุมเบาๆ น่ารักและไม่เครียด วันที่ 10 ก.พ.2564 นายอนุชา บูรพชัยศรี  นายกฯ เล็งอวยพรตรุษจีน วันที่ 12 ก.พ.นี้ ผ่านแอปฯ TikTok ในมุมเบาๆ น่ารักและไม่เครียด วันที่ 10 ก.พ.2564 นายอนุชา บูรพชัยศรี  นายกฯ เล็งอวยพรตรุษจีน วันที่ 12 ก.พ.นี้ ผ่านแอปฯ TikTok ในมุมเบาๆ น่ารักและไม่เครียด วันที่ 10 ก.พ.2564 นายอนุชา บูรพชัยศรี  นายกฯ เล็งอวยพรตรุษจีน วันที่ 12 ก.พ.นี้ ผ่านแอปฯ TikTok ในมุมเบาๆ น่ารักและไม่เครียด วันที่ 10 ก.พ.2564 นายอนุชา บูรพชัยศรี  นายกฯ เล็งอวยพรตรุษจีน วันที่ 12 ก.พ.นี้ ผ่านแอปฯ TikTok ในมุมเบาๆ น่ารักและไม่เครียด วันที่ 10 ก.พ.2564 นายอนุชา บูรพชัยศรี  นายกฯ เล็งอวยพรตรุษจีน วันที่ 12 ก.พ.นี้ ผ่านแอปฯ TikTok ในมุมเบาๆ น่ารักและไม่เครียด วันที่ 10 ก.พ.2564 นายอนุชา บูรพชัยศรีนายกฯ เล็งอวยพรตรุษจีน วันที่ 12 ก.พ.นี้ ผ่านแอปฯ TikTok ในมุมเบาๆ น่ารักและไม่เครียด วันที่ 10 ก.พ.2564 นายอนุชา บูรพชัยศรีและรมว.กลาโหมกับประชาชน ผ่านแอปพลิเคชัน TikTok ซึ่งกำลังเป็นที่นิยมอยู่ในขณะนี้ โดยทีมสำนักโฆษกฯ ได้เสนอนายกฯ สื่อสารผ่านช่องทางนี้ด้วย ซึ่งนายกฯ ก็เห็นด้วย ทีมโฆษกฯ จึงได้ดำเนินการโดยจะประเดิมคลิปแรกเป็นการ อวยพร วันตรุษจีน ในวันที่ 12 ก.พ.นี้ ความยาวประมาณ 60 วินาที นายอนุชา กล่าวว่า พล.อ.ประยุทธ์ ขอให้เจ้าหน้าที่ฝ่ายผลิตใส่เสียงเพลงเบาๆ ที่มีความน่ารัก ",
      img: "",
      imgtw: require("@/assets/Twitter.png"),
      imgfb: require("@/assets/Facebook.png"),
      imgpt: require("@/assets/board.png"),
      imgig: require("@/assets/Instagram.png"),
      imgnw: require("@/assets/News.png"),
      imgyt: require("@/assets/Youtube.png"),
      user: require("@/assets/user.svg"),
      selectedStm: 'positive',
        options: [
          { text: 'Positive', value: 'positive' },
          { text: 'Neutral', value: 'neutral' },
          { text: 'Negative', value: 'negtive' }
        ]
    }
        
    }
,
computed:{
  ...mapGetters(["getSentimentPost"]),
  paginate(){
    var data = this.getSentimentPost.data;
    var count =this.getSentimentPost.count ;
    var currentPage = this.currentPage;
    var totalPages= this.totalPages;
   // var resultCount = this.resultCount
         
      if (!data || count != count) {
        return;
      }
      //resultCount = count
      if (currentPage >= totalPages) {
          currentPage = totalPages;
      }
     
      return data
    },
    totalPages: function () {
    var itemsPerPage =this.itemsPerPage
    var count = this.getSentimentPost.count ;
    var length ;
      if (count < 10) {
        length = 10;
      } else {
        length = count;
      }
      var xs = Math.ceil(length / itemsPerPage);
      console.log("total page:",xs);
      return xs;
    },
},
methods: {
  filterNumbers(numbers) {
      // Create a copy of the numbers array and sort by length
      const filtered = [...numbers].sort(
        (a, b) => a.toString().length - b.toString().length
      );

      for (let i = 0; i < filtered.length; i++) {
        for (let j = i + 1; j < filtered.length; j++) {
          const num1 = filtered[i].toString();
          const num2 = filtered[j].toString();

          // If num1 matches the start of num2, remove num1
          if (num2.startsWith(num1)) {
            filtered.splice(i, 1); // Remove num1
            i--; // Adjust index after removal
            break; // Restart the inner loop
          }
        }
      }

      return filtered; // Return filtered array
    },
    matchGeocode(geocode) {
      const geocodeStr = geocode.toString(); // แปลง geocode เป็น string
      let found = null;

      // กรองข้อมูลตามความยาว geocode
      if (geocodeStr.length === 2) {
        found = provinces[geocodeStr]
      } else if (geocodeStr.length === 4) {
        found = districts[geocodeStr]
      } else if (geocodeStr.length === 6) {
        found = subdistricts[geocodeStr]
      }

      // Return the found location or a fallback message
      return found || { geocode: geocodeStr, message: "ไม่พบข้อมูล" };
    },
  page() {
      var pageNumber;
      if (parseInt(this.gotopage) > Math.ceil(this.getSentimentPost.count / 10)||this.gotopage.includes('-')) {
        alert("Wrong number");
        pageNumber = 1;
      } else {
        pageNumber = parseInt(this.gotopage);
      }
      this.setPage(pageNumber);
      this.gotopage = "";
      console.log(pageNumber);
    },
    setPage: function (pageNumber) {
      this.currentPage = pageNumber;
      console.log( this.currentPage);
      //console.log("page num:",typeof(pageNumber));
      //Call new data from api here
      if (this.currentPage > 1) {
      this.offset = 10*(this.currentPage-1)
      //console.log("offset : ",this.offset);
      }else{
        this.offset = 0
        //console.log("offset : ",this.offset);
      }},
    tabactive(){
      document.getElementById("eltab1").style.borderColor = "#fed16e";
      document.getElementById("eltab2").style.borderColor = "#4c412b";
      document.getElementById("eltab3").style.borderColor = "#4c412b";
    },
    tab2() {
      document.getElementById("eltab1").style.borderColor = "#4c412b";
      document.getElementById("eltab3").style.borderColor = "#4c412b";
      document.getElementById("eltab2").style.borderColor = "#fed16e";
    },
    tab3() {
      document.getElementById("eltab1").style.borderColor = "#4c412b";
      document.getElementById("eltab2").style.borderColor = "#4c412b";
      document.getElementById("eltab3").style.borderColor = "#fed16e";
    },
    },
created() {
  this.username = localStorage.getItem("username");

},
beforeCreate() {
this.$store.dispatch("fetchSentimentPost",{type:"daily",source:"facebook,twitter",sentiment:"1",sort_by:"descend"});    
  },
}
 
</script>

<style scoped>
.card-body {
    min-height: 6rem;
}
.card-text{
  text-align: justify;
    padding: 0px 10px;
}
.card-text:last-child {
    margin-top: 10px;
}
#tab-post{
  text-align: initial;
  padding-right: 50px;
  margin: auto;
}
.fa-facebook-official, .fa-facebook-square {
  font-size: 42px;
    color: #4967aa;
    margin-right: 10px;
    vertical-align: middle
}

.card-img {
    padding: 10px;
}
.card-footer{
text-align:initial;
}
.fa-link{
margin-left: 5px;
text-decoration: none;
padding: 6px 6px;
border-radius: 20px;
color: #2c3e50;
}
.fa-link:hover{
background: #ccc;
color: #696d71;
cursor: pointer;
}
.user-img {
  width: 46px;
  height: 46px;
  z-index: 1;
  position: relative;
  border-radius: 50%;
  box-shadow: 2px 1px 4px #888888;
  display: inline-block;
  margin-left: 10px;
}
.social-img {
 width: 35px;
  margin-top: 6px;
  margin-left: -7px;
  height: 35px;
 
}
card-img, .card-img-bottom, .card-img-top {
    width: 100%;
    object-fit: cover;
}
.fa-sort-amount-down-alt{
font-size:28px;   
color:#4c412b;
}
.fa-sort-amount-down-alt:before {
    position: relative;
    bottom: -14px;
}
#all-eltab{
    border-bottom: 10px solid #4c412b;
}
#eltab1,#eltab2,#eltab3{
  cursor: pointer;
  text-align: center;
  padding-right: 10px;
}
#eltab1{
  outline-style: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-color: transparent;
  border-bottom: 10px solid #fed16e;
}
#eltab2,#eltab3{
 outline-style: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-color: transparent;
  border-bottom: 10px solid #4c412b;
}
#title-tab{
  padding-right: 5px;
}

#tab-view{
  text-align:end;
  padding-left: 50px;
}
#tab-all{
  margin-top: 30px;
  margin-bottom: 50px;
}
.vue-back-to-top{
    right: 65px !important;
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
@media only screen and (min-width: 0px) and (max-width: 1050px) {
    .col-sm-7 {
    flex: 0 0 100%;
    max-width: 100%;
}
.col-sm-5 {
    flex: 0 0 100%;
    max-width: 100%;
}
#tab-post {
    text-align: center;
    padding-right: 15px;
    margin-top: 20px;
}
#tab-view{
    text-align: center;
    padding-left: 0px;
}
  #overflow-page {
    overflow: hidden;
  }
  #btn-sentiment > div {
    white-space: nowrap !important;
  }
  #btn-sentiment[data-v-1037f9aa] {
    right: -16%;
    position: relative;
    z-index: 1;
  }
  #text-date {
    white-space: nowrap;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
#img-title{
  width: 240px;
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
#emoji{
    width: 20px;
}
#tab-view{
padding-left: 0;
text-align: center;
margin-bottom: 31px;
}
#eltab1, #eltab2, #eltab3 {
padding-right: 0px;
}
#all-eltab{
   font-size: 3.6vw;
}
.fa-sort-amount-down-alt:before {
    display: none;
}
#tab-post{
  margin-top: 25px;
  font-size: 3.6vw;
}
#tab-post{
    text-align: center; 
    padding-right:15px;
}
#tab-all{
    margin-top: 0px;
    margin-bottom: 0px;
}
#btn-sentiment{
margin-top: 5px;
}
h1, .h1 {
    font-size: 1.5rem;
}

#content > div.container > div:nth-child(3) > div> header > div > div.btn-edit.col-sm > button{
font-size: 3.5vw !important;
 font-weight: bold;
}
.social[data-v-00911447] {
    font-size: x-large;
}
#img-title{
  width: 240px;
}

}

</style>