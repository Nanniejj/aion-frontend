<template>
  <div class="w-100 marginbox">
    <vue-element-loading
      :active="getLoadTopUserPf"
      size="80"
      background-color="rgba(255, 255, 255, 0.5)"
      color="#b6ac9a"
    />
    <div class="text-left h5">
      {{ domain }} |
      <span class="stm-box">
        <span class="text-right mr-2">
          <img
            v-if="getStmInflu == 'Positive'"
            src="@/assets/Positive.png"
            class="stm-img"
          />
          <img
            v-if="getStmInflu == 'Negative'"
            src="@/assets/Negative.png"
            class="stm-img"
          />
          <img
            v-if="getStmInflu == 'Neutral'"
            src="@/assets/Neutral.png"
            class="stm-img"
          /> </span
        >{{ getStmInflu }}</span
      >
    </div>
    <hr class="d-block" />
    <b-row>
      <b-col cols="6" class="text-left">
        <span class="h5 bold"> Top {{ select_items.value }} </span>
      </b-col>
      <b-col cols="6" class="text-right">
        <v-select
          :options="countItems"
          v-model="select_items"
          id="search-input"
          placeholder="เลือกจำนวนอันดับ"
          label="name"
        ></v-select>
      </b-col>
    </b-row>
    <b-row
      class="mt-3"
      cols-sm="2"
      cols-md="3"
      cols-lg="5"
      cols="1"
      v-if="getTopInfluencer.length"
    >
      <b-col v-for="(user, k) in datalist" :key="k">
        <div class="box-topuser mb-3">
          <div class="mb-3">
            <b-avatar size="2em" variant="light" class="mt-2">{{
              k + 1
            }}</b-avatar>
          </div>

          <a :href="user.url_post" target="_blank">
            <b-avatar
              badge-variant="info"
              variant="light"
              :src="user.profile_image"
              :size="50"
              class="shadow-sm rounded"
            >
              <template #badge id="bb">
                <div class="text-right">
                  <img
                    v-if="user.sentiment_type == 'positive'"
                    src="@/assets/Positive.png"
                    class="stm-img"
                  />
                  <img
                    v-if="user.sentiment_type == 'negative'"
                    src="@/assets/Negative.png"
                    class="stm-img"
                  />
                  <img
                    v-if="user.sentiment_type == 'neutral'"
                    src="@/assets/Neutral.png"
                    class="stm-img"
                  />
                </div>
                <img
                  v-if="user.source == 'facebook'"
                  src="@/assets/Facebook.png"
                  class="social-img"
                />
                <img
                  v-if="user.source == 'twitter'"
                  src="@/assets/Twitter.png"
                  class="social-img"
                />
                <img
                  v-if="user.source == 'news'"
                  src="@/assets/News.png"
                  class="social-img"
                />
                <span v-if="user.source == 'pantip'">
                  <img
                    v-if="user.platform == 'dek-d'"
                    src="@/assets/dekd.png"
                    class="social-img"
                  />
                  <img
                    v-else-if="user.platform == 'lemon8'"
                    src="@/assets/lemon8.png"
                    class="social-img"
                  />
                  <img v-else src="@/assets/Pantip.png" class="social-img" />
                </span>
                <img
                  v-if="user.source == 'instagram'"
                  src="@/assets/Instagram.png"
                  class="social-img"
                />
                <img
                  v-if="user.source == 'youtube'"
                  src="@/assets/Youtube.png"
                  class="social-img"
                />
                <img
                  v-if="user.source == 'blockdit'"
                  src="@/assets/Blockdit.png"
                  class="social-img"
                />
                <img
                  v-if="user.source == 'tiktok'"
                  src="@/assets/Tiktok.png"
                  class="social-img"
                />
                <img
                  v-if="user.source == 'threads'"
                  src="@/assets/Threads.png"
                  class="social-img"
                />
              </template> </b-avatar
          ></a>
          <div class="mt-2 textuser bold">
            <a :href="user.url_post" target="_blank">{{ user.account_name }}</a>
          </div>
          <span
            class="badge badge-pill badge-dark px-2 py-1"
            @click="linkToProfile(user)"
            style="font-size: 13px;background-color: #4c412b;cursor: pointer;"
            >ดูโปรไฟล์</span
          >
          <div
            class="mt-3"
            v-if="
              user.source !== 'news' &&
                user.source !== 'blockdit' &&
                user.source !== 'threads'
            "
          >
            <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
            <span class="mx-2">{{ user.postCount | numFormat }}</span
            >posts
          </div>
          <hr />

          <b-row cols="1">
            <!-- <b-col > 
              <b-row>
                <b-col > 
            <b >Total</b>  </b-col>
            
            </b-row>
            </b-col> -->

            <b-col v-b-tooltip.hover title="posts">
              <b-row
                v-if="
                  user.source == 'news' ||
                    user.source == 'blockdit' ||
                    user.source == 'threads'
                "
              >
                <b-col
                  ><i class="fa fa-paper-plane-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.postCount | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col
              v-b-tooltip.hover
              title="retweet"
              v-if="user.source == 'twitter'"
            >
              <b-row>
                <b-col> <i class="fa fa-retweet" aria-hidden="true"></i></b-col>
                <b-col class="text-left">
                  {{ user.sumRetweets | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col
              v-b-tooltip.hover
              title="reply"
              v-if="user.source == 'twitter'"
            >
              <b-row cols="12">
                <b-col
                  ><i class="fa fa-comments-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.sumComments | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="comments" v-else>
              <b-row cols="12">
                <b-col
                  ><i class="fa fa-comments-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.sumComments | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="likes">
              <b-row>
                <b-col> <i class="fa fa-heart" aria-hidden="true"></i></b-col>
                <b-col class="text-left">
                  {{ user.sumLikes | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="shares">
              <b-row>
                <b-col> <i class="fa fa-share" aria-hidden="true"></i></b-col>
                <b-col class="text-left">
                  {{ user.sumShares | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col
              v-b-tooltip.hover
              title="emotion"
              v-if="user.source == 'pantip'"
            >
              <b-row>
                <b-col> emotion </b-col>
                <b-col class="text-left">
                  {{ user.sumReaction | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="engages">
              <b-row>
                <b-col> Total </b-col>
                <b-col class="text-left">
                  {{ user.totalEngagePost | numFormat }}</b-col
                >
              </b-row>
            </b-col>
          </b-row>
          <!-- ig engage -->
          <b-row
            v-if="user.source == 'instagram' || user.source == 'tiktok'"
            id="score-data"
            cols-lg="auto"
            cols="1"
            cols-md="1"
            class="d-none"
          >
            <b-col v-b-tooltip.hover title="posts">
              <b-row>
                <b-col
                  ><i class="fa fa-paper-plane-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.postCount | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="comments">
              <b-row>
                <b-col
                  ><i class="fa fa-comments-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.comments_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="likes">
              <b-row>
                <b-col> <i class="fa fa-heart" aria-hidden="true"></i></b-col>
                <b-col class="text-left">
                  {{ user.likes_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <!-- <b-col v-b-tooltip.hover title="engagement">
              <b-row>
                <b-col> engage </b-col>
                <b-col class="text-left">
                  {{ user.engagement | numFormat }}</b-col
                >
              </b-row>
            </b-col> -->
          </b-row>

          <!-- fb engage -->
          <b-row
            v-if="user.source == 'facebook'"
            id="score-data"
            cols-lg="auto"
            cols="1"
            cols-md="1"
            class="d-none"
          >
            <b-col v-b-tooltip.hover title="posts">
              <b-row>
                <b-col
                  ><i class="fa fa-paper-plane-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left"> {{ user.allPost | numFormat }}</b-col>
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="comments">
              <b-row>
                <b-col
                  ><i class="fa fa-comments-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.comments_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="engagement">
              <b-row>
                <b-col> engage </b-col>
                <b-col class="text-left">
                  {{ user.engagement | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <!-- <b-col v-b-tooltip.hover title="share">
              <b-row>
                <b-col>
                  <i class="fa fa-share-alt-square" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left"
                  >{{ user.share_total | numFormat }}
                </b-col>
              </b-row>
            </b-col> -->
          </b-row>
          <!-- blockdit engage -->
          <b-row
            v-if="user.source == 'blockdit'"
            id="score-data"
            cols-lg="auto"
            cols="1"
            cols-md="1"
            class="d-none"
          >
            <b-col v-b-tooltip.hover title="posts">
              <b-row>
                <b-col
                  ><i class="fa fa-paper-plane-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left"> {{ user.allPost | numFormat }}</b-col>
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="comments">
              <b-row>
                <b-col
                  ><i class="fa fa-comments-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.comments_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="engagement">
              <b-row>
                <b-col>engage</b-col>
                <b-col class="text-left">
                  {{ user.engagement | numFormat }}</b-col
                >
              </b-row>
            </b-col>
          </b-row>

          <!-- tw engage -->
          <b-row
            v-if="user.source == 'twitter'"
            id="score-data"
            cols-lg="auto"
            cols="1"
            cols-md="1"
            class="d-none"
          >
            <b-col v-b-tooltip.hover title="follower">
              <b-row>
                <b-col><i class="fa fa-users" aria-hidden="true"></i></b-col>
                <b-col class="text-left">
                  {{ user.follower | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="posts">
              <b-row>
                <b-col
                  ><i class="fa fa-paper-plane-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left"> {{ user.allPost | numFormat }}</b-col>
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="comments">
              <b-row>
                <b-col
                  ><i class="fa fa-comments-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.comments_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="likes">
              <b-row>
                <b-col> <i class="fa fa-heart" aria-hidden="true"></i></b-col>
                <b-col class="text-left">
                  {{ user.likes_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="retweets">
              <b-row>
                <b-col> <i class="fa fa-retweet" aria-hidden="true"></i></b-col>
                <b-col class="text-left">
                  {{ user.retweets_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
          </b-row>

          <!-- news pantip -->
          <b-row
            v-if="user.source == 'pantip'"
            id="score-data"
            cols-lg="auto"
            cols="1"
            cols-md="1"
            class="d-none"
          >
            <b-col v-b-tooltip.hover title="posts">
              <b-row>
                <b-col
                  ><i class="fa fa-paper-plane-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left"> {{ user.allPost | numFormat }}</b-col>
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="comments">
              <b-row>
                <b-col
                  ><i class="fa fa-comments-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.comments_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="likes">
              <b-row>
                <b-col>
                  <i class="fa fa-thumbs-up" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.likes_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
          </b-row>
          <!-- News --------------->
          <b-row
            v-if="user.source == 'news'"
            id="score-data"
            cols-lg="auto"
            cols="1"
            cols-md="1"
            class="d-none"
          >
            <b-col v-b-tooltip.hover title="posts">
              <b-row>
                <b-col
                  ><i class="fa fa-paper-plane-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left"> {{ user.allPost | numFormat }}</b-col>
              </b-row>
            </b-col>
          </b-row>
          <!-- youtube -->
          <b-row
            v-if="user.source == 'youtube'"
            id="score-data"
            cols-lg="auto"
            cols="1"
            cols-md="1"
            class="d-none"
          >
            <b-col v-b-tooltip.hover title="posts">
              <b-row>
                <b-col
                  ><i class="fa fa-paper-plane-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left"> {{ user.allPost | numFormat }}</b-col>
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="comments">
              <b-row>
                <b-col
                  ><i class="fa fa-comments-o" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.comments_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="likes">
              <b-row>
                <b-col
                  ><i class="fa fa-thumbs-up" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.likes_count | numFormat }}</b-col
                >
              </b-row>
            </b-col>
            <b-col v-b-tooltip.hover title="dislike">
              <b-row>
                <b-col>
                  <i class="fa fa-thumbs-down" aria-hidden="true"></i
                ></b-col>
                <b-col class="text-left">
                  {{ user.dislike_total | numFormat }}</b-col
                >
              </b-row>
            </b-col>
          </b-row>

          <!-- {{user}} -->
        </div>
      </b-col>
    </b-row>

    <b-row v-else>
      <div class="box-topuser mb-3 mt-3 p-3">ไม่พบข้อมูล</div>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  props: {
    domain: {
      type: String,
    },
  },
  computed: {
    datalist() {
      let data = this.getTopInfluencer;
      if (this.select_items.value == 10) {
        data = data.slice(0, 10);
      } else if (this.select_items.value == 20) {
        data = data.slice(0, 20);
      } else if (this.select_items.value == 30) {
        data = data.slice(0, 30);
      } else if (this.select_items.value == 40) {
        data = data.slice(0, 40);
      } else {
        data = data.slice(0, 50);
      }
      return data;
    },
    ...mapGetters([
      "getSdateDm",
      "getEdateDm",
      "getArrDate",
      "getClickDomain",
      "getLoadTopUserPf",
      "getNamePlatform",
      "getSocialTop",
      "getDomainTop",
      "getTopInfluencer",
      "getStmInflu",
    ]),
  },
  data() {
    return {
      datatext: [],
      select_items: { name: "10 Items", value: 10 },
      countItems: [
        { name: "10 Items", value: 10 },
        { name: "20 Items", value: 20 },
        { name: "30 Items", value: 30 },
        { name: "40 Items", value: 40 },
        { name: "50 Items", value: 50 },
      ],
      startd: "",
      endd: "",
      top: [1, 2, 3, 4, 5],
      topuser: "",
      source: "facebook",
    };
  },
  methods: {
    linkToProfile(item) {
      console.log("dddd", item);
      this.$store.commit("setProfileData", item.account_name);
      this.$store.commit("setValSource", item.source);
      //this.$store.commit("setDomainName", item.name);
      this.$store.commit("setToLinkProfile", "Influencer");
      this.$store.commit("setNoMonitor", item);
      this.$router.push({ name: "Profile" });
    },
    topData() {
      this.startd = moment(new Date())
        .format()
        .slice(0, 10);
      this.endd = moment(new Date())
        .format()
        .slice(0, 10);
      let sdate, edate, today;
      today = moment(new Date())
        .format()
        .slice(0, 10);
      sdate = "&start=" + today + "T00:00:00";
      edate = "&end=" + today + "T23:59:59";
      this.$store.commit("setLoadTopUserPf", true);
      //http://139.59.103.67:3000/api/v2/userposts/getInfluencerTarget?
      //https://api2.cognizata.com/api/v2/userposts/getInfluencerTarget?source=
      var config = {
        method: "get",
        url:
          "https://api2.cognizata.com/api/v2/userposts/getInfluencerNormalize?source=" +
          this.getSocialTop +
          sdate +
          edate +
          "&domain=" +
          this.getDomainTop,
        // +"&source="+this.source,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      this.axios(config)
        .then((response) => {
          console.log("Toppp response.data", response.data);
          this.topuser = response.data.slice(0, 10);
          this.$store.commit("setLoadTopUserPf", false);
        })
        .catch(function(error) {
          console.log(error);
          this.$store.commit("setLoadTopUserPf", false);
        });
    },
  },
  async created() {
    await this.getTopInfluencer;

    this.datatext = this.getTopInfluencer;
    console.log("this.datatext", this.datatext, this.getTopInfluencer);
  },
};
</script>

<style scoped>
.stm-img {
  width: 25px;
}
#search-input {
  position: relative;
  width: 200px;
  display: block !important;
  float: right;
}
.marginbox {
  margin-top: -300px;
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
  padding: 10px 10px;
  border-radius: 7px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  background-color: #fff9ed;
}
.box-topuser:hover {
  background: #fed16e47;
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
