<template>
  <div>
    <div class="text-left">
      <span class="h5 mr-3">Top Influencers</span>
      <div class="d-inline-block">
        <div v-if="startd === endd" class="text-left onedate">
          <i class="far fa-calendar-alt"></i> {{ startd }}
        </div>
        <div v-else class="text-left twodate">
          <i class="far fa-calendar-alt"></i> {{ startd }} - {{ endd }}
        </div>
      </div>
    </div>
    <vue-element-loading
      :active="getLoadTopUser"
      size="80"
      background-color="rgba(255, 255, 255, 0.5)"
      color="#fbf7f6"
    />
    <!-- <div class="mt-3 mb-3 box-domain"> -->
    <b-row
      class="mt-3"
      cols-sm="2"
      cols-md="3"
      cols-lg="5"
      cols="1"
      v-if="topuser.length"
    >
      <b-col v-for="(user, k) in topuser" :key="k">
        <div
          class="box-topuser mb-3"
          @click="linkToProfile(user.items.details)"
        >
          <div class="mb-3">
            <b-avatar size="2em" variant="light" class="mt-2">{{
              k + 1
            }}</b-avatar>
          </div>

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
          <div class="mt-2 textuser bold">
            <a :href="user.items.details.url_post" target="_blank">{{
              user.items.details.account_name
            }}</a>
          </div>
          <hr />
          <!-- ig engage -->
          <b-row
            v-if="user.items.details.source == 'instagram'|| user.items.details.source == 'tiktok'"
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
                <b-col> engage </b-col>
                <b-col class="text-left">
                  {{ user.items.details.engagement | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <!-- <b-col v-b-tooltip.hover title="share">
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

          <!-- news pantip -->
          <b-row
            v-if="user.items.details.source == 'pantip'"
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
                <b-col>
                  <i class="fa fa-thumbs-up" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.items.details.likes_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
          </b-row>
          <!-- News --------------->
          <b-row
            v-if="user.items.details.source == 'news'"
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
          </b-row>
          <!-- youtube -->
          <b-row
            v-if="user.items.details.source == 'youtube'"
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

          <!-- {{user}} -->
        </div>
      </b-col>
    </b-row>
    <b-row v-else>
      <div class="box-topuser mb-3 mt-3">ไม่พบข้อมูล</div>
    </b-row>
  </div>
  <!-- </div> -->
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  computed: {
    ...mapGetters([
      "getSdateDm",
      "getEdateDm",
      "getArrDate",
      "getClickDomain",
      "getLoadTopUser",
    ]),
  },
  watch: {
    getArrDate: function () {
      this.startd = this.getSdateDm.slice(0, 10);
      this.endd = this.getEdateDm.slice(0, 10);
      this.selectDate();
    },
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
  methods: {
    linkToProfile(item) {
      console.log("dddd", item);
      this.$store.commit("setProfileData", item.account_name);
      this.$store.commit("setValSource", item.source);
      //this.$store.commit("setDomainName", item.name);
      this.$store.commit("setToLinkProfile", "Domain");
      this.$store.commit("setNoMonitor", item);
      this.$router.push({ name: "Profile" });
    },
    selectDate() {
      this.$store.commit("setLoadTopUser", true);
      let sdate, edate;
      //today = moment(new Date()).format().slice(0, 10);
      sdate = "&start=" + this.getSdateDm;
      edate = "&end=" + this.getEdateDm;
      //http://139.59.103.67:3000/api/v2/userposts/getInfluDomain?&domain=
      // "https://api2.cognizata.com/api/v2/userposts/getInfluDomain?domain="
      var config = {
        method: "get",
        url:
          "https://api2.cognizata.com/api/v2/userposts/getInfluDomain?domain=" +
          this.getClickDomain +
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
          response.data.map((result) => {
            console.log("API", result.items.details.account_name);
            if (
              result.items.details.source == "facebook" ||
              result.items.details.source == "youtube"
            ) {
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
                    result.items.details.account_name = response.data.name;
                    // console.log('2',result);
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
          this.$store.commit("setLoadTopUser", false);
        })
        .catch(function (error) {
          console.log(error);
          this.$store.commit("setLoadTopUser", false);
        });
    },
  },

  created() {
    this.startd = moment(new Date()).format().slice(0, 10);
    this.endd = moment(new Date()).format().slice(0, 10);
    let sdate, edate, today;
    today = moment(new Date()).format().slice(0, 10);
    sdate = "&start=" + today + "T00:00:00";
    edate = "&end=" + today + "T23:59:59";
    this.$store.commit("setLoadTopUser", true);
    var config = {
      method: "get",
      url:
        "https://api2.cognizata.com/api/v2/userposts/getInfluDomain?domain=" +
        this.getClickDomain +
        sdate +
        edate,
      // +"&source="+this.source,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    };
    // this.axios(config)
    //   .then((response) => {
    //     console.log("Toppp response.data", response.data);
    //     // -------------------------------------------translateuid-----------------------------------------------------------
    //     response.data.map((result) => {
    //       // console.log("API", result.items.details.account_name);
    //       if (
    //         result.items.details.source == "facebook" ||
    //         result.items.details.source == "youtube"
    //       ) {
    //         var axios = require("axios");
    //         var config = {
    //           method: "get",
    //           url:
    //             "https://api2.cognizata.com/api/v2/object/translateuid?uid=" +
    //             result.items.details.account_name,
    //           headers: {
    //             Authorization: "Bearer " + localStorage.getItem("token"),
    //             "Content-Type": "application/json",
    //           },
    //         };
    //         axios(config)
    //           .then((response) => {
    //             console.log("Object.keys", Object.keys(response.data).length);
    //             if (Object.keys(response.data).length) {
    //               result.items.details.account_name = response.data.name;
    //               // console.log('2',result);
    //             } else {
    //               return;
    //             }
    //           })
    //           .catch((error) => {
    //             console.log(error);
    //           });
    //       } else {
    //         return result;
    //       }

    //       return { result };
    //     });

    //     // ---------------------------------------------------------------------------------------------------------
    //     this.topuser = response.data.slice(0, 5);
    //     this.$store.commit("setLoadTopUser", false);
    //   })
    //   .catch( (error)=> {
    //     this.$store.commit("setLoadTopUser", false);
    //     console.log(error);
    //   });
  },
};
</script>

<style scoped>
.box-topuser:hover {
  background: #fed16e47;
  cursor: pointer;
}
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
  width: 100%;
  height: 95%;
  padding: 20px 10px;
  border-radius: 7px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  /* background-color: #f0f0f0; */
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