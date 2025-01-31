<template>
<div> 
    <div class="container" id="tab-all"> 
        <div class="row">
          <b-col sm="12" md="12" lg="6" id="tab-post">
            <b-row>
            <b-col cols="12" >
           <!-- <i class="fa fa-facebook-official fa-3x"/> -->
           <!-- <i class="fa fa-facebook-square fa-3x"/> -->
                     <span v-if="social === 'facebook'"><img src="@/assets/Facebook.png" width="50px" id="img-title"> </span>
                     <span v-if="social === 'twitter'"><img src="@/assets/Twitter.png" width="50px" id="img-title"> </span>
                     <span v-if="social === 'pantip'"><img src="@/assets/Pantip.png" width="50px" id="img-title"> </span>
                     <span v-if="social === 'youtube'"><img src="@/assets/Youtube.png" width="50px" id="img-title"> </span>
                     <span v-if="social === 'news'"><img src="@/assets/News.png" width="50px" id="img-title"> </span>
                     <span v-if="social === 'instagram'"><img src="@/assets/Instagram.png" width="50px" id="img-title"> </span>
            
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
         v-for="(datas,k) in paginate" :key="k" >
            <template #header>
                <b-row>
                    <b-col style="text-align: initial;display: contents;">
                           
                     <img  v-if="datas.photo==undefined||datas.photo==''" :src="user" loading="lazy"  class="user-img" />
                    
                      <img  v-else v-bind:src="datas.photo" loading="lazy" class="user-img" />
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
                      <span  v-if="datas.source!=='twitter'" id="user-name">
                        
                    <a v-if="datas.original_post!=undefined&&datas.original_post!=''" v-bind:href="datas.original_post"  target="_blank">
                        <b style="text-decoration: none;color: #2c3e50;">{{ datas.account_name }} </b> <span class="fa fa-link"></span> 
                    </a>
                  </span>
                  <span v-else id="user-name">
                
                     <a  v-bind:href="'https://twitter.com/' +datas.account_name +'/status/'+datas.uid" target="_blank">
                     <b style="text-decoration: none;  color: #2c3e50;">{{datas.account_name}}</b>
                     <span  class="fa fa-link" ></span>
                     </a>
                  </span>  
                <!-- Time -->
                  <div id="text-date" style="text-align: start" class="md-font">
                  <span v-if="datas.source=='twitter'">
                    {{ new Date(datas.date).getDate() }} /
                    {{ new Date(datas.date).getMonth() + 1 }} /
                    {{ new Date(datas.date).getFullYear() }} เวลา
                    {{ new Date(datas.date).getHours()+7 }}:{{ new Date(datas.date).getMinutes() }}:{{ new Date(datas.date).getSeconds() }}
                  </span>
                  <span v-else>
                    {{ new Date(datas.date).getDate() }} /
                    {{ new Date(datas.date).getMonth() + 1 }} /
                    {{ new Date(datas.date).getFullYear() }} เวลา
                    {{ new Date(datas.date).toLocaleTimeString() }}
                  </span>
                  </div>

                   </b-col>
                   <b-col sm="12" md="4">
                     <!-- <b-button pill variant="outline-secondary">แก้ไขทัศนคติ</b-button> -->
                      <div>
                        {{selectedStm}}
                        <!-- <b-form-group label="" v-slot="{ ariaDescribedby }" :id="'btn'+k">
                          <b-form-radio-group
                            id="btn-radios-1"
                            v-model="selectedStm"
                            :options="options"
                            :aria-describedby="ariaDescribedby"
                             name="radios-btn-default"
                             size="sm"
                            buttons
                          ></b-form-radio-group> 
                        </b-form-group>-->
                         <b-button-group size="sm" id="btn-group" v-if="status==1"> 
                            <b-button id="btn-pos" :style="btnPosStyle" @click="getTheSelected(k,1,datas.uid)">Positive</b-button>
                            <b-button id="btn-nue"  @click="getTheSelected(k,0,datas.uid)">Neutral</b-button>
                            <b-button id="btn-neg"  @click="getTheSelected(k,-1,datas.uid)">Negative</b-button>
                        </b-button-group>
                        <b-button-group size="sm" id="btn-group" v-if="status==0"> 
                            <b-button id="btn-pos"  @click="getTheSelected(k,1,datas.uid)">Positive</b-button>
                            <b-button id="btn-nue"  :style="btnNueStyle" @click="getTheSelected(k,0,datas.uid)">Neutral</b-button>
                            <b-button id="btn-neg"  @click="getTheSelected(k,-1,datas.uid)">Negative</b-button>
                        </b-button-group>
                        <b-button-group size="sm" id="btn-group" v-if="status==-1"> 
                            <b-button id="btn-pos"  @click="getTheSelected(k,1,datas.uid)">Positive</b-button>
                            <b-button id="btn-nue"  @click="getTheSelected(k,0,datas.uid)">Neutral</b-button>
                            <b-button id="btn-neg"  :style="btnNegStyle" @click="getTheSelected(k,-1,datas.uid)">Negative</b-button>
                        </b-button-group>
                      </div>
                   </b-col>
               </b-row>

            </template>
            <b-row no-gutters>
              
<!-- Modal -->
<div class="modal fade" :id="'demo'+k" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"  >
  <div class="modal-dialog" role="document">
    <div class="modal-content">
     
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">X</span>
        </button>

      <div class="modal-body"  >
              <div v-if="datas.source == 'youtube'||datas.source == 'instagram'||datas.source == 'pantip'"> 
              <a target="_blank" v-bind:href="datas.snapshot">
              <img  v-if="datas.snapshot !==null&&datas.snapshot!==undefined" v-bind:src="datas.snapshot" loading="lazy" id="img-popup"/>
              </a>
              </div>
              <div  v-else-if="datas.source == 'facebook'&&String(datas.snapshot).includes('scontent')"> 
              <a target="_blank" v-bind:href="datas.snapshot">
              <img  v-if="datas.snapshot !==null&&datas.snapshot!==undefined" v-bind:src="datas.snapshot"  loading="lazy" id="img-popup"/>
              </a>
              </div>
              <div v-else> 
              <a target="_blank" v-bind:href="imageLink + datas.snapshot" >
              <img  v-if="datas.snapshot !==null&&datas.snapshot!==undefined" v-bind:src="imageLink + datas.snapshot"  loading="lazy" id="img-popup" />
              </a>
              </div>     
      </div>   
    </div>
  </div>
</div>      
         
            <b-col md="3" v-if="datas.snapshot">
               <div v-if="datas.source == 'youtube'||datas.source == 'instagram'||datas.source == 'pantip'" style="padding: 5px;"> 
              <img  v-if="datas.snapshot !==null&&datas.snapshot!==undefined" v-bind:src="datas.snapshot" class="img-thumbnail rounded mx-auto d-block" 
              data-toggle="modal" :data-target="`#demo${k}`" loading="lazy" />
              </div>

              <div  v-else-if="datas.source == 'facebook'&&String(datas.snapshot).includes('scontent')"  style="padding: 5px;"> 
              <img  v-if="datas.snapshot !==null&&datas.snapshot!==undefined" v-bind:src="datas.snapshot" class="img-thumbnail rounded mx-auto d-block" loading="lazy" 
              data-toggle="modal" :data-target="`#demo${k}`" />
              </div>

              <div v-else  style="padding: 5px;"> 
              <img  v-if="datas.snapshot !==null&&datas.snapshot!==undefined" v-bind:src="imageLink + datas.snapshot" class="img-thumbnail rounded mx-auto d-block" loading="lazy" 
              data-toggle="modal" :data-target="`#demo${k}`" />
              </div>
            </b-col>
            <b-col >
                <b-card-body >
                <b-card-text> 
                  <read-more more-str="อ่านต่อ" :text="datas.content" link="#" less-str="ย่อบทความ" :max-chars="520">
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
              <div class="comment-img">
             <!-- popover user comment -->
                <popover :name="'foo'+k" id="foo" >
                  <div class="text-center"><i class="fa fa-user-circle" aria-hidden="true"></i> <div id="bg-user">account name</div> </div>

                  <div v-if="datas.comment==''" class="text-center">ไม่มีลิสต์รายชื่อ account</div>
                  <div v-if="datas.comment==undefined" class="text-center">ไม่มีลิสต์รายชื่อ account</div>
                 <!-- <div v-for=" comment_tw in datas.retweet_obj"><span >{{comment_tw}}</span></div> -->
                <div id="scroll">
                  <div v-if="datas.comment!==undefined">
                    <!-- <div v-if="datas.source == 'twitter'">
                        <i class="fas fa-comment"></i> reply
                        | <i class="fal fa-retweet"></i> retweet</div>   -->
                    <div v-for="comment in datas.comment" :key="comment" >
                      <!-- fb -->
                      <a id ="user-link" v-if="datas.source === 'facebook'" v-bind:href="'https://facebook.com//' + comment.id" target="_blank">
                      <i class="fa fa-user-circle-o"/> {{comment. display_name}}</a>

                      <!-- tw -->
                      <span v-if="datas.source === 'twitter'">
                      <span v-if="comment.post_type=='reply'" > <a id ="user-link"  v-bind:href="'https://twitter.com/' + comment.account_name" target="_blank">
                        <i class="fas fa-comment"></i> <img v-bind:src="comment.photo" id="img-user" > {{comment.account_name}}</a> </span> 
                      <span v-if="comment.post_type=='retweet'" > <a id ="user-link"  v-bind:href="'https://twitter.com/' + comment.account_name" target="_blank">
                        <i class="fal fa-retweet"></i> <img v-bind:src="comment.photo" id="img-user" > {{comment.account_name}}</a> </span>            
                      </span>
                      <!-- news -->
                      <!-- <a id ="user-link" v-if="datas.source === 'news'" v-bind:href="'https://pantip.com//' + comment.account_name" target="_blank">
                      <i class="fa fa-user-circle-o"/> {{comment.account_name}}</a> -->

                       <!-- IG -->
                     <a id ="user-link" v-if="datas.source === 'instagram'" v-bind:href="'https://www.instagram.com//' + comment.owner.id" target="_blank">
                      <img v-bind:src="comment.owner.profile_pic_url" id="img-user"> {{comment.owner.username}}</a>
                      
                      <!-- pt -->
                      <a id ="user-link" v-if="datas.source === 'pantip'" v-bind:href="'https://pantip.com//profile/' + comment.username" target="_blank">
                      <img v-bind:src="comment.photo" id="img-user" > {{comment.username}}</a>
                      <!-- yt -->
                    <a id ="user-link" v-if="datas.source === 'youtube'" v-bind:href="'https://www.youtube.com/' + comment.author_link" target="_blank">
                     <img v-bind:src="comment.photo" id="img-user">  {{comment.author}}</a>

                    </div>
                    </div>
          
                    <!-- <div v-if="datas.comment==''" class="text-center">ไม่มีลิสต์รายชื่อ account</div> -->

                </div>
                    
                    
                  
                </popover>
                <span >
               <i class="fas fa-comment" v-popover.top="{ name: 'foo'+ k}" style="cursor:pointer;"  > </i>
               <span class="md-font" v-if="datas.comment_count!==undefined"> {{ Number(datas.comment_count).toLocaleString()}}&nbsp;</span>
               
               </span>


            <!-- reaction-->
                <span  v-if="datas.reaction">
                  <span v-if="datas.reaction!=''">
                 <!-- pt -->
                <span v-if="datas.reaction.Good!=undefined" >
                   <span v-if="datas.reaction.Good!=='0' && datas.reaction.Good!=undefined" id="box-reaction" v-b-tooltip.hover title="Good Content">
                  <i class="fa fa-plus" ></i> <span class="md-font" > {{ datas.reaction.Good.toLocaleString() }} </span>
                  </span>
                </span>
                 <span v-if="datas.reaction.Horror" >
                   <span v-if="datas.reaction.Horror!=='0'" id="box-reaction" v-b-tooltip.hover title="Horror">
                  <img v-if="datas.reaction.Horror!=='0'" src="@/assets/horror.png" id="emoji" >
                  <span class="md-font" v-if="datas.reaction.Horror!=='0'" > {{ datas.reaction.Horror.toLocaleString() }} </span>
                  </span>
                </span>   
                <!-- pt --> 
                   <!-- fb -->
                  <span v-if="datas.reaction.Like" >
                     <span v-if="datas.reaction.Like!=='0'" id="box-reaction" v-b-tooltip.hover title="Like">
                  <img v-if="datas.reaction.Like!=='0'" src="@/assets/fb_like.png" id="emoji">
                  <span class="md-font" v-if="datas.reaction.Like!=='0'"> {{ datas.reaction.Like.toLocaleString() }} </span>
                     </span>
                  </span>

                  <span v-if="datas.reaction.like" >
                  <span v-if="datas.reaction.like!=='0'" id="box-reaction" v-b-tooltip.hover title="Like">
                  <img v-if="datas.reaction.like!=='0'" src="@/assets/fb_like.png" id="emoji">
                  <span class="md-font" v-if="datas.reaction.like!=='0'"> {{ datas.reaction.like.toLocaleString() }} </span>
                  </span></span>

                  <span v-if="datas.reaction.share">
                    <span v-if="datas.reaction.share!=='0'" id="box-reaction" v-b-tooltip.hover title="Share">
                  <i class="fa fa-share" v-if="datas.reaction.share!=='0'" ></i>
                  <span class="md-font" v-if="datas.reaction.share!=='0'"> {{ datas.reaction.share.toLocaleString() }} </span>
                    </span>
                </span>

                <span v-if="datas.reaction.Love" >
                  <span v-if="datas.reaction.Love!=='0'" id="box-reaction" v-b-tooltip.hover title="Love">
                  <img v-if="datas.reaction.Love!=='0'" src="@/assets/love.png" id="emoji">
                  <span class="md-font" v-if="datas.reaction.Love!=='0'"> {{ datas.reaction.Love.toLocaleString() }} </span>
                  </span>
                </span>
                  
                <span v-if="datas.reaction.Wow" >
                  <span v-if="datas.reaction.Wow!=='0'" id="box-reaction" v-b-tooltip.hover title="Wow">
                  <img v-if="datas.reaction.Wow!=='0'" src="@/assets/wow.png" id="emoji">
                  <span class="md-font" v-if="datas.reaction.Wow!=='0'"> {{ datas.reaction.Wow.toLocaleString() }} </span>
                  </span>
                </span>

                <span v-if="datas.reaction.Haha" >
                  <span v-if="datas.reaction.Haha!=='0'" id="box-reaction" v-b-tooltip.hover title="Haha">
                  <img v-if="datas.reaction.Haha!=='0'" src="@/assets/haha.png" id="emoji">
                  <span class="md-font" v-if="datas.reaction.Haha!=='0'"> {{ datas.reaction.Haha.toLocaleString() }} </span>
                  </span>
                </span>
                 
                <span v-if="datas.reaction.Sad" >
                  <span v-if="datas.reaction.Sad!=='0'" id="box-reaction" v-b-tooltip.hover title="Sad">
                  <img v-if="datas.reaction.Sad!=='0'"  src="@/assets/sad.png" id="emoji"> 
                  <span class="md-font" v-if="datas.reaction.Sad!=='0'" > {{ datas.reaction.Sad.toLocaleString() }} </span>
                  </span>
                </span>

                <span v-if="datas.reaction.Angry" >
                  <span v-if="datas.reaction.Angry!=='0'" id="box-reaction" v-b-tooltip.hover title="Angry">
                  <img v-if="datas.reaction.Angry!=='0'" src="@/assets/angry.png" id="emoji">
                  <span class="md-font" v-if="datas.reaction.Angry!=='0'" > {{ datas.reaction.Angry.toLocaleString() }} </span>
                  </span>
                </span>
                <span v-if="datas.reaction.Hug" >
                  <span v-if="datas.reaction.Hug!=='0'" id="box-reaction" v-b-tooltip.hover title="Hug" >
                  <img v-if="datas.reaction.Hug!=='0'" src="@/assets/hug.png" id="emoji">
                  <span class="md-font" v-if="datas.reaction.Hug!=='0'" > {{ datas.reaction.Hug.toLocaleString() }} </span>
                  </span>
                </span>
               
                <!-- yt -->
                 <span v-if="datas.reaction.view_count" v-b-tooltip.hover title="Views" >
                  <span v-if="datas.reaction.view_count!==''" id="box-reaction" ><i class="fas fa-eye"></i>
                  <span class="md-font" v-if="datas.reaction.view_count!==''" > {{ datas.reaction.view_count.toLocaleString() }} </span>
                  </span>
                </span>
                 <span v-if="datas.reaction.likes" >
                   <span v-if="datas.reaction.likes!=='0'" id="box-reaction" v-b-tooltip.hover title="Like">
                  <img v-if="datas.reaction.likes!=='0'" ><i class="far fa-thumbs-up"></i>
                  <span class="md-font" v-if="datas.reaction.likes!=='0'" > {{ datas.reaction.likes.toLocaleString() }} </span>
                   </span>
                </span>
                
                 <span v-if="datas.reaction.dislikes">
                   <span v-if="datas.reaction.dislikes!=='0'" id="box-reaction" v-b-tooltip.hover title="Dislike">
                  <i class="far fa-thumbs-down"></i>
                  <span class="md-font"  > {{ datas.reaction.dislikes.toLocaleString() }} </span>
                   </span>
                </span>   
                <!-- end yt -->
                </span>
                </span>

              </div>
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

</template>

<script>
import axios from "axios";
import { API_URL } from '@/common/config';
import { mapGetters } from "vuex";
import provinces from "@/components/map/provinces.json";
import districts from "@/components/map/districts.json";
import subdistricts from "@/components/map/subdistricts.json";
export default {
  props:{
    status:{
      type:Number,
    },
     social:{
      type:String,
    },
    //  offset:{
    //   type:Number,
    //   default:0,
    // },
    types:{
      type:String,
      default:'daily',
    },
  },
data() {
    return {
   
       offset:0,
       username:"",
      btnPosStyle:{
         backgroundColor:"#54c69d" ,
         color:"#ffffff" ,
         borderColor:"#54c69d" ,
      },
       btnNeuStyle:{
         backgroundColor:"#3a86ad" ,
         color:"#ffffff" ,
         borderColor:"#3a86ad" ,
      },
      btnNegStyle:{
         backgroundColor:"#f7776a" ,
         color:"#ffffff" ,
         borderColor:"#f7776a" ,
      },
      imageLink: this.$hostname + '/static/Account/images/snapshot/',
      currentPage: 1,
      itemsPerPage: 10,
      resultCount: 0,
      length: 5,
      //length:5, //change this for items per page too
      searchQuery: "",
      sort:'',
      count: "",
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
      selectedStm: this.status ,
        options: [
          { text: 'Positive', value: 1 },
          { text: 'Neutral', value: 0   },
          { text: 'Negative', value: -1 }
        ]
    }
},
computed:{
  ...mapGetters(["getSentimentPost","getDateChoice"]),
  paginate(){
    var data = this.getSentimentPost.data;
    var count =this.getSentimentPost.count ;
    var currentPage = this.currentPage;
    var totalPages= this.totalPages;
    //var resultCount = this.resultCount;
         
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
  pageApi(sort,offset) {
    offset=this.offset;
    sort =this.sort;
  this.$store.dispatch("fetchSentimentPost",{type:this.getDateChoice,source:this.social,sentiment:this.status,sort_by:sort,offset:offset});    
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
      console.log("offset : ",this.offset);
      }else{
        this.offset = 0
      }
      if(this.searchQuery!=''){
        this.pageApi(this.sort,0,this.searchQuery)
      }else{
        console.log("setPage else");
        this.pageApi(this.sort, this.offset)
         console.log('else'+ this.sort);
      }
     
     //this.$store.dispatch("fetchSentimentPost",{type:this.getDateChoice,source:this.social,sentiment:this.status,sort_by:"",offset:this.offset});  
      },
    tabactive(){
      document.getElementById("eltab1").style.borderColor = "#fed16e";
      document.getElementById("eltab2").style.borderColor = "#4c412b";
      document.getElementById("eltab3").style.borderColor = "#4c412b";
      this.offset = 0;
      this.sort='';
      this.currentPage = 1;
      this.pageApi(this.sort, this.offset)
      // this.offset=0
      // this.$store.dispatch("fetchSentimentPost",{type:this.getDateChoice,source:this.social,sentiment:this.status,sort_by:"",offset:this.offset});
    },
    tab2() {
      document.getElementById("eltab1").style.borderColor = "#4c412b";
      document.getElementById("eltab3").style.borderColor = "#4c412b";
      document.getElementById("eltab2").style.borderColor = "#fed16e";  
      this.offset = 0;
      this.currentPage = 1;
      this.sort='descend';
      this.pageApi(this.sort, this.offset)
      // this.offset=0
      // this.$store.dispatch("fetchSentimentPost",{type:this.getDateChoice,source:this.social,sentiment:this.status,sort_by:'descend',offset:this.offset});
    },
    tab3() {
      document.getElementById("eltab1").style.borderColor = "#4c412b";
      document.getElementById("eltab2").style.borderColor = "#4c412b";
      document.getElementById("eltab3").style.borderColor = "#fed16e";
      this.offset = 0;
      this.currentPage = 1;
      this.sort='engagement';
      this.pageApi(this.sort, this.offset)
      //   this.offset=0
      // this.$store.dispatch("fetchSentimentPost",{type:this.getDateChoice,source:this.social,sentiment:this.status,sort_by:'engagement',offset:this.offset});
    },
    getTheSelected(k,v,uid) {
        var err;
        if(v == 1){
          err = "Positive";
        }else if(v == 0){
          err = "Neutral";
        }else{
          err = "Negative";
        }
        this.$confirm("คุณต้องการเปลี่ยน Sentiment เป็น "+err+" ?").then(() => {
          
          var _this = this;
          var token;
          if (localStorage.getItem("token")) {
            token = localStorage.getItem("token");
          } else {
            token = sessionStorage.getItem("token");
          }
          const AuthStr = "Token " + token;
          //const AuthStr = "Token " + '98c8c4d4da441e62538ec2bac35cc7b91a09763b';
          var data = JSON.stringify({"sentiment":v,"uid":uid});
          var config = {
            method: 'put',
            url: API_URL+'/v1/EditSentiment/',
            headers: {
              Authorization: AuthStr,
              "Content-Type": "application/json",
            },
            data : data
          };
          axios(config)
          .then(function () {
            console.log(_this.status,v);
            if(v!==_this.status){
            _this.getSentimentPost.data.splice(k, 1);
            _this.$fire({
                title: "แก้ไขสำเร็จ",
                type: "success",
              showConfirmButton: false,
                timer: 1000,
              })
            }else{
             _this.$alert("Sentiment เป็น "+err+ " แล้ว!").then(() => {});
          }
          })
          .catch(function () {
            _this.$alert("ไม่สามารถดำเนินการได้").then(() => {});
          });
          
        });
    },
    getTheSelectedPos(k) {
     this.btnPosStyle
      if (this.status == 1) {
        this.$alert("Sentiment เป็น Positive แล้ว!").then(() => {});
      } else {
        this.$confirm("คุณต้องการเปลี่ยน Sentiment เป็น Positive ?").then(
          () => {
            //this.sentiment="1"
           this.getSentimentPost.data.splice(k, 1);
      


          }
        );
      }
    },
    getTheSelectedNue(k) {
      if (this.status == 0) {
        this.$alert("Sentiment เป็น Neutral แล้ว!").then(() => {});
      } else {
        this.$confirm("คุณต้องการเปลี่ยน Sentiment เป็น Neutral ?").then(() => {
          //this.sentiment=0
          //console.log(this.sentiment);
          this.getSentimentPost.data.splice(k, 1);
        });
      }
    },
    getTheSelectedNeg(k) {
      if (this.status == -1) {
        this.$alert("Sentiment เป็น Negative แล้ว!").then(() => {});
      } else {
        this.$confirm("คุณต้องการเปลี่ยน Sentiment เป็น Negative ?").then(
          () => {
            //console.log(k);
            //this.sentiment=-1
            this.getSentimentPost.data.splice(k, 1);
            //console.log(this.sentiment);
          }
        );
      }
    },
    }
,
 beforeCreate() {
   if(status==1){
     this.btnNeuStyle.backgroundColor='#ffffff'
   }
       //close tab active
      //  document.getElementById("btn-pos").style.backgroundColor="#54c69d";
      //  document.getElementById("btn-pos").style.color="#ffffff";
      //  document.getElementById("btn-pos").style.borderColor="#54c69d";
       
      // document.getElementById("eltab3").style.borderColor = "#4c412b";
      //this.datapage("",0);
 
  },
  created(sort,offset) {
    this.username = localStorage.getItem("username");
    offset=this.offset;
    sort =this.sort;
  this.$store.dispatch("fetchSentimentPost",{type:this.getDateChoice,source:this.social,sentiment:this.status,sort_by:sort,offset:offset});    
  }, 
  destroyed() {
    this.$destroy();
  }
}
</script>

<style scoped>
.form-control{
    background-color: #ede7dd;
    display: inline;
}
.pagination {
  margin-top: 30px;
 -webkit-box-pack: center;
  justify-content: center;
}

.current {
  color: white;
  background-color: #fed16e;
}
/* ul {
  padding: 0;
  list-style-type: none;
} */
li {
  display: inline;
  /* margin: 5px 5px; */
}

a.first::after {
  content: "...";
}

a.last::before {
  content: "...";
}

#btn-pos, #btn-nue, #btn-neg{
  color: #636465;
    background-color: #dddddd;
    border-color: #dddddd;
}
#btn-pos:hover{
  background-color: #cbc9c9;
  border-color: #cbc9c9;
  color: #636465;
}
#btn-neg:hover{
  background-color: #cbc9c9;
border-color: #cbc9c9;
  color: #636465;
} 
#btn-nue:hover{
  background-color: #cbc9c9;
border-color: #cbc9c9;
  color: #636465;
} 
.img-thumbnail{
 height: 240px;
 object-fit: cover;
 width: fit-content;
 cursor: pointer;
}
#box-reaction{
  background: #ddddddad;
    color: #2c3e50;
    border-radius: 7px;
    padding-right: 5px;
    padding-left: 5px;
    padding-top: 3px;
    padding-bottom: 3px;
    margin-left: 4px;
}
#post-comment{
  margin-left: 12px;
}
.modal { 
   background-color:#ffffff00 !important; 
}
.modal-header {
border-bottom: none; 
}
.modal-dialog {
    position: relative;
    width: auto;
   margin: 0; 
    pointer-events: none;
    padding-top: 30px;
}
#img-popup{
  max-width: 90vw;
 height: auto;
  max-height: 90vh;
}
.close {
    float: right;
    font-size: 1.5rem;
    font-weight: bolder;
    line-height: 1;
    color: #ffffff;
    text-shadow: 0 1px 0 #616569;
    margin-left: 90%;
    opacity: 1;
    padding: 20px 0px;
}
.close span{
    background: #5453538c;
    padding: 5px 14px;
    border-radius: 50px;
}
.close span :hover{
    background: #545353c4;
}
.modal-dialog {
    max-width: none;
}
.modal-content {
    width: 100vw;
    margin: 0;
    background: transparent;
    border: none;
}
#img-user{
width: 28px;
border-radius: 50%;
margin-bottom: 3px;
}
#scroll{
  min-height: auto;
  max-height: 200px; 
  overflow: auto;
  overflow-x: hidden;
}
#user-link{
  color: #2c3e5a;
  margin-left: 45px;
  white-space: nowrap;
}
#user-link:hover{
 color: #2c3e50;
 background: #efebeb;
 padding-left: 10px;
 border-radius: 20px;
 padding-right: 10px;
 text-decoration:none;
 font-weight: bold;
}
#user-link:hover .fa-user-circle-o{
  font-weight: 900;
}
#bg-user{
  background: #ffffff;
    color: #2c3e5a;
    padding: 1px;
    padding-left: 10px;
    padding-right: 10px;
    width: 80%;
    border-radius: 6px;
    margin: auto;
    border: 1.5px solid;
    margin-bottom: 8px;
  
}
.fa-user-circle{
  font-size: 30px;
}
.fa-comment{
    font-size: 17px;
}
.fa-comment:hover{
  color: #fed16e;
}
.vue-popover.dropdown-position-top:before {
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #fff;
    bottom: -6px;
    left: calc(50% - 136px);
    filter: drop-shadow(0px 2px 2px rgba(52,73,94,0.1));
}
#foo{
  width: 300px !important;
    z-index: 2 !important;
    left: unset !important;
    top: unset !important;
    bottom: 45px;
    max-height: 300px;
}
#bg-user{
  background: #ffffff;
    color: #2c3e5a;
    padding: 1px;
    padding-left: 10px;
    padding-right: 10px;
    width: 80%;
    border-radius: 6px;
    margin: auto;
    border: 1.5px solid;
    margin-bottom: 8px;
}
#emoji{
  width: 27px;
}
.comment-img {
  text-align: start;
}
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
  z-index: 1;
  position: relative;
  border-radius: 50%;
  box-shadow: 2px 1px 4px #888888;
  height: -webkit-fill-available;
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
}
#tab-all{
  margin-top: 30px;
  margin-bottom: 50px;
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
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {

}
@media only screen and (min-width: 375px) and (max-width: 815px){
.card-text {
    font-size: 2vw;
}
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .card-text {
    font-size: 4vw;
}
  .card-body {
    min-height: 8rem;
}
  .card-text {
    padding: 0px 0px; 
}
  .social-img{
    width: 31px;
    margin-top: 6px;
    margin-left: -9px;
    height: 31px;
}
.user-img{
    width: 38px;
    margin-left: 10px;
}
.modal-body {
    padding: 0rem;
}
  .close {
    padding: 20px 0px;
    margin-left:84%;
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
 width: 50px;
 display: block;
 margin: auto;
 margin-bottom: 5px;
}

}

</style>