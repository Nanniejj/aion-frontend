<template>
  <div>
    <vue-element-loading
      :active="getLoadInfluSum"
      size="80"
      background-color="rgba(255, 255, 255, 0.5)"
      color="#b6ac9a"
    />
    <!-- <div class="mt-3 mb-3 box-domain"> -->
    <b-row
      class="mb-3"
      cols-sm="2"
      cols-md="3"
      cols-lg="5"
      cols="1"
      v-if="topuser.length"
    >
      <b-col v-for="(user, k) in topuser" :key="k">
        <div class="box-topuser mb-3" @click="linkToProfile(user.items.details)">
          <div class="p-3"> <b-avatar size="2em" variant="light" >{{
            k + 1
          }}</b-avatar></div>
         
          <a :href="user.items.details.url_post" target="_blank">
            <b-avatar
              badge-variant="info"
              variant="light"
              :src="user.items.details.profile_image"
              :size="70"
              class="shadow-sm rounded"
            >
              <template #badge id="bb">
                <img
                  v-if="user.items.details.source == 'facebook'"
                  src="@/assets/Facebook.png"
                  class="social-img"
                />
                <img
                  v-if="user.items.details.source == 'twitter'"
                  src="@/assets/Twitter.png"
                  class="social-img"
                />
                <img
                  v-if="user.items.details.source == 'news'"
                  src="@/assets/News.png"
                  class="social-img"
                />
                <img
                  v-if="user.items.details.source == 'pantip'"
                  src="@/assets/Pantip.png"
                  class="social-img"
                />
                <img
                  v-if="user.items.details.source == 'instagram'"
                  src="@/assets/Instagram.png"
                  class="social-img"
                />
                <img
                  v-if="user.items.details.source == 'youtube'"
                  src="@/assets/Youtube.png"
                  class="social-img"
                />
                  <img
                  v-if="user.items.details.source == 'blockdit'"
                  src="@/assets/Blockdit.png"
                  class="social-img"
                />
                  <img
                  v-if="user.items.details.source == 'tiktok'"
                  src="@/assets/Tiktok.png"
                  class="social-img"
                />
              </template> </b-avatar
          ></a>
          <div class="mt-2 textuser bold" v-if="user.items.details.name">
            <a :href="user.items.details.url_post" target="_blank">{{
              user.items.details.name
            }}</a>
          </div>
          <div class="mt-2 textuser bold" v-else>
            <a :href="user.items.details.url_post" target="_blank">{{
              user.items.details.account_name
            }}</a>
          </div>
          <hr />


   <!-- tiktok engage -->
          <b-row
            v-if="user.items.details.source == 'tiktok'"
            id="score-data"
            cols-lg="auto"
            cols="1"
            cols-md="1"
          >
            <b-col v-b-tooltip.hover title="posts">
              <b-row>
                <b-col
                  ><i class="fa fa-paper-plane-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.items.details.allPost | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="comments">
              <b-row>
                <b-col
                  ><i class="fa fa-comments-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.items.details.comments_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="likes">
              <b-row>
                <b-col> <i class="fa fa-heart" aria-hidden="true"></i></b-col>
                <b-col class="text-left">
                  {{ user.items.details.likes_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
          </b-row>

           <!-- blockdit engage -->
          <b-row
            v-if="user.items.details.source == 'blockdit'"
            id="score-data"
            cols-lg="auto"
            cols="1"
            cols-md="1"
          >
            <b-col v-b-tooltip.hover title="posts">
              <b-row>
                <b-col
                  ><i class="fa fa-paper-plane-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.items.details.allPost | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="comments">
              <b-row>
                <b-col
                  ><i class="fa fa-comments-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.items.details.comments_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="engagement">
              <b-row>
                <b-col>engage</b-col>
                <b-col class="text-left">
                  {{ user.items.details.engagement | numFormat }}</b-col
                >
              </b-row>
            </b-col>
          </b-row>

 <!-- ig engage -->
          <b-row
            v-if="user.items.details.source == 'instagram'"
            id="score-data"
            cols-lg="auto"
            cols="1"
            cols-md="1"
          >
            <b-col v-b-tooltip.hover title="posts">
              <b-row>
                <b-col
                  ><i class="fa fa-paper-plane-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.items.details.allPost | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="comments">
              <b-row>
                <b-col
                  ><i class="fa fa-comments-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.items.details.comments_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="likes">
              <b-row>
                <b-col> <i class="fa fa-heart" aria-hidden="true"></i></b-col>
                <b-col class="text-left">
                  {{ user.items.details.likes_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <!-- <b-col v-b-tooltip.hover title="engagement">
              <b-row>
                <b-col> engage </b-col>
                <b-col class="text-left">
                  {{ user.items.details.engagement | numFormat }}</b-col
                >
              </b-row>
            </b-col> -->
          </b-row>

          <!-- fb engage -->
          <b-row
            v-if="user.items.details.source == 'facebook'"
            id="score-data"
            cols-lg="auto"
            cols="1"
            cols-md="1"
          >
            <b-col v-b-tooltip.hover title="posts">
              <b-row>
                <b-col
                  ><i class="fa fa-paper-plane-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.items.details.allPost | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="comments">
              <b-row>
                <b-col
                  ><i class="fa fa-comments-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.items.details.comments_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="engagement">
              <b-row>
                <b-col>engage</b-col>
                <b-col class="text-left">
                  {{ user.items.details.engagement | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <!-- <b-col v-b-tooltip.hover title="likes">
              <b-row>
                <b-col>
                  <i class="fa fa-thumbs-up" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.items.details.likes_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="share">
              <b-row>
                <b-col>
                  <i class="fa fa-share-alt-square" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left"
                  >{{ user.items.details.share_total | numFormat }}
                </b-col>
              </b-row>
            </b-col> -->
          </b-row>

          <!-- tw engage -->
          <b-row
            v-if="user.items.details.source == 'twitter'"
            id="score-data"
            cols-lg="auto"
            cols="1"
            cols-md="1"
          >
            <b-col v-b-tooltip.hover title="follower">
              <b-row>
                <b-col><i class="fa fa-users" aria-hidden="true"></i></b-col>
                <b-col class="text-left">
                  {{ user.items.details.follower | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="posts">
              <b-row>
                <b-col
                  ><i class="fa fa-paper-plane-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.items.details.allPost | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="comments">
              <b-row>
                <b-col
                  ><i class="fa fa-comments-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.items.details.comments_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="likes">
              <b-row>
                <b-col> <i class="fa fa-heart" aria-hidden="true"></i></b-col>
                <b-col class="text-left">
                  {{ user.items.details.likes_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="retweets">
              <b-row>
                <b-col> <i class="fa fa-retweet" aria-hidden="true"></i></b-col>
                <b-col class="text-left">
                  {{ user.items.details.retweets_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
          </b-row>
          <!-- news  -->
          <b-row
            v-if="user.items.details.source == 'news'"
            id="score-data"
            cols-lg="1"
            cols="1"
            cols-md="1"
          >
            <b-col v-b-tooltip.hover title="posts">
              <b-row>
                <b-col
                  ><i class="fa fa-paper-plane-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="">
                  {{ user.items.details.allPost | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <!-- <b-col v-b-tooltip.hover title="comments">
              <b-row>
                <b-col
                  ><i class="fa fa-comments-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.items.details.comments_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="likes">
              <b-row>
                <b-col>
                  <i class="fa fa-thumbs-up" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.items.details.likes_count | numFormat }}</b-col
                >
              </b-row>
            </b-col> -->
          </b-row>
          <!-- pantip -->
          <b-row
            v-if="user.items.details.source == 'pantip'"
            id="score-data"
            cols-lg="1"
            cols="1"
            cols-md="1"
          >
            <b-col v-b-tooltip.hover title="posts">
              <b-row>
                <b-col
                  ><i class="fa fa-paper-plane-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.items.details.allPost | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="comments">
              <b-row>
                <b-col
                  ><i class="fa fa-comments-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.items.details.comments_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="likes">
              <b-row>
                <b-col>
                  <i class="fa fa-thumbs-up" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.items.details.likes_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
          </b-row>
          <!-- youtube -->
          <b-row
            v-if="user.items.details.source == 'youtube'"
            id="score-data"
            cols-lg="1"
            cols="1"
            cols-md="1"
          >
            <b-col v-b-tooltip.hover title="posts">
              <b-row>
                <b-col
                  ><i class="fa fa-paper-plane-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.items.details.allPost | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="comments">
              <b-row>
                <b-col
                  ><i class="fa fa-comments-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.items.details.comments_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="likes">
              <b-row>
                <b-col
                  ><i class="fa fa-thumbs-up" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.items.details.likes_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="dislike">
              <b-row>
                <b-col>
                  <i class="fa fa-thumbs-down" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.items.details.dislike_total | numFormat }}</b-col
                >
              </b-row>
            </b-col>
          </b-row>

          

        </div>
      </b-col>
    </b-row>
    <b-row v-else >
      <div class="box-topuser mb-3 mt-3 p-3">ไม่พบข้อมูล</div>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  components:{
  },
  computed: {
    ...mapGetters([
      "getSdateDm",
      "getEdateDm",
      "getArrDate",
      "getClickDomain",
      "getLoadTopUserPf",
      "getNamePlatform",
      "getLoadInfluSum"
    ]),
  },
  data() {
    return {
      startd: "",
      endd: "",
      top: [1, 2, 3, 4, 5],
      topuser: "",
      source: "twitter",
    };
  },
  methods:{
      linkToProfile(item){
        // console.log('dddd',item);
        this.$store.commit("setProfileData", item.account_name);
        this.$store.commit("setValSource", item.source);
        //this.$store.commit("setDomainName", item.name);
        this.$store.commit("setToLinkProfile", "Influencer");
        this.$store.commit("setNoMonitor",item)
        this.$router.push({name:'Profile'});

       }    
  },
  created() {
    this.startd = moment(new Date()).format().slice(0, 10);
    this.endd = moment(new Date()).format().slice(0, 10);
    let sdate, edate, today;
    today = moment(new Date()).format().slice(0, 10);
    sdate = "start=" + today + "T00:00:00";
    edate = "&end=" + today + "T23:59:59";
    this.$store.commit("setLoadInfluSum", true);
    //http://139.59.103.67:3000/api/v2/userposts/getInfluencer?&start=2021-11-08T00:00:00&end=2021-11-08T23:59:59
    var config = {
      method: "get",
      url:
        "https://api2.cognizata.com/api/v2/userposts/getInfluencer?" +
        sdate +
        edate,
      // +"&source="+this.source,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    };
    this.axios(config)
      .then((response) => {
        console.log("Toppp response.data", response.data);
         // -------------------------------------------translateuid-----------------------------------------------------------
          ((result) => {response.data.map
            console.log("API", result.items.details.account_name);
            if (
              result.items.details.source == "facebook" ||
              result.items.details.source == "youtube"
            ) {
              Object.assign(result.items.details, {name: result.items.details.account_name});
              var axios = require("axios");
              var config = {
                method: "get",
                url:
                  "https://api2.cognizata.com/api/v2/object/translateuid?uid=" +
                  result.items.details.account_name,
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("token"),
                  "Content-Type": "application/json",
                },
              };
              axios(config)
                .then((response) => {
                  console.log("Object.keys", Object.keys(response.data).length);
                  if (Object.keys(response.data).length) {
                    result.items.details.name = response.data.name;
                  } else {
                    return;
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              return result;
            }

            return { result };
          });

          // ---------------------------------------------------------------------------------------------------------
          
        this.topuser = response.data.slice(0, 5);
        console.log('top5',this.topuser);
        this.$store.commit("setLoadInfluSum", false);
      })
      .catch(function (error) {
        console.log(error);
        this.$store.commit("setLoadInfluSum", false);
      });
  },
};
</script>

<style scoped>
.d-contents {
  display: contents !important;
}
a {
  color: #2c3e50;
}
.textuser {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* number of lines to show */
  -webkit-box-orient: vertical;
}
.badge-light {
  color: #5e666d;
  background-color: #ddddddad !important;
  font-weight: bold;
}
.bg-white {
  background-color: #f0f0f0 !important;
}
.social-img {
  width: 35px;
}
.box-tptext {
  padding: 5px 10px;
  border: #4c412b solid 1px;
}
.box-topuser {
  cursor: pointer;
  width: 100%;
  height: 95%;
  padding: 20px 10px;
  border-radius: 7px;
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%);
  background-color: #ffffff;
}
.box-topuser:hover {
  background: #fed16e47;
  cursor: pointer;
}
.box-domain {
  width: 100%;
  height: auto;
  padding: 20px 0px;
  border-radius: 7px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
@media (max-width: 1200px) and (min-width: 900px) {
  .row-cols-lg-5 > * {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
}
</style>