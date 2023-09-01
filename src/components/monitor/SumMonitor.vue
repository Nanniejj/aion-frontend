<template>
  <b-row class="mt-4 mb-4">
    <b-col>
      <li v-on:click="all()" style="padding-bottom: 0px">
        <!-- <p class="all-sort">ALL</p> -->
        <vue-element-loading
          :active="getLoadStatus"
          size="80"
          background-color="rgba(255, 255, 255, 0.3)"
          color="#ede7dd"
        />
        <b-card id="all">
          <div class="h5">All</div>
          <div
            id="all1"
            class="m-auto small"
            v-if="tabsMonitor == 'tabProfile'"
          >
            {{
              (getSumMonitor.summary.target.twitter +
                getSumMonitor.summary.target.facebook +
                getSumMonitor.summary.target.pantip +
                getSumMonitor.summary.target.news +
                getSumMonitor.summary.target.youtube +
                getSumMonitor.summary.target.instagram +
                getSumMonitor.summary.target.blockdit +
                getSumMonitor.summary.target.tiktok)
                | numFormat
            }}

            Users
          </div>
          <div id="all1" class="m-auto small" v-else>
            {{
              (getSumMonitor.summary.hashtag.twitter +
                getSumMonitor.summary.hashtag.facebook +
                getSumMonitor.summary.hashtag.pantip +
                getSumMonitor.summary.hashtag.news +
                getSumMonitor.summary.hashtag.youtube +
                getSumMonitor.summary.hashtag.instagram +
                getSumMonitor.summary.hashtag.blockdit +
                getSumMonitor.summary.hashtag.tiktok)
                | numFormat
            }}
            hashtag
          </div>
        </b-card>
      </li>
    </b-col>

    <b-col>
      <li v-on:click="facebook()">
        <vue-element-loading
          :active="getLoadStatus"
          size="80"
          background-color="rgba(255, 255, 255, 0.3)"
          color="#ede7dd"
        />
        <!-- <img src="@/assets/Facebook.png" class="socialogo m-auto pb-2" /> -->
        <b-card id="fb"
          ><div class="h5">Facebook</div>
          <div id="fb1" class="m-auto small" v-if="tabsMonitor == 'tabProfile'">
            {{ getSumMonitor.summary.target.facebook | numFormat }}
            Users
          </div>
          <div id="fb1" class="m-auto small" v-else>
            {{ getSumMonitor.summary.hashtag.facebook | numFormat }}
            hashtag
          </div>
        </b-card>
      </li>
      <!-- <b-row>
        <div id="fb1" class="m-auto" v-if="tabsMonitor == 'tabProfile'">
          <b>{{ getSumMonitor.summary.target.facebook | numFormat }}</b>
          Users
        </div>
        <div id="fb1" class="m-auto" v-else>
          <b>{{
            getSumMonitor.summary.hashtag.facebook | numFormat
          }}</b>
          hashtag
        </div>
      </b-row> -->
    </b-col>

    <b-col>
      <li v-on:click="twitter()">
        <vue-element-loading
          :active="getLoadStatus"
          size="80"
          background-color="rgba(255, 255, 255, 0.3)"
          color="#ede7dd"
        />
        <!-- <img src="@/assets/Twitter.png" class="socialogo m-auto pb-2" /> -->
        <b-card id="tw"
          ><div class="h5">Twitter</div>
          <div id="tw1" class="m-auto small" v-if="tabsMonitor == 'tabProfile'">
            {{ getSumMonitor.summary.target.twitter | numFormat }}
            Users
          </div>
          <div id="tw1" class="m-auto small" v-else>
            {{ getSumMonitor.summary.hashtag.twitter | numFormat }}
            hashtag
          </div>
        </b-card>
      </li>
    </b-col>

    <b-col>
      <li v-on:click="pantip()">
        <vue-element-loading
          :active="getLoadStatus"
          size="80"
          background-color="rgba(255, 255, 255, 0.3)"
          color="#ede7dd"
        />
        <!-- <img src="@/assets/Pantip.png" class="socialogo m-auto pb-2" /> -->
        <b-card id="pt">
          <div class="h5">Pantip</div>
          <div id="pt1" class="m-auto small" v-if="tabsMonitor == 'tabProfile'">
            {{ getSumMonitor.summary.target.pantip | numFormat }}
            Users
          </div>
          <div id="pt1" class="m-auto small" v-else>
            {{ getSumMonitor.summary.hashtag.pantip | numFormat }}
            hashtag
          </div>
        </b-card>
      </li>
    </b-col>

    <b-col>
      <li v-on:click="news()">
        <vue-element-loading
          :active="getLoadStatus"
          size="80"
          background-color="rgba(255, 255, 255, 0.3)"
          color="#ede7dd"
        />
        <!-- <img src="@/assets/News.png" class="socialogo m-auto pb-2" /> -->
        <b-card id="nw">
          <div class="h5">News</div>
          <div id="nw1" class="m-auto small" v-if="tabsMonitor == 'tabProfile'">
            {{ getSumMonitor.summary.target.news | numFormat }}
            Users
          </div>
          <div id="nw1" class="m-auto small" v-else>
            {{ getSumMonitor.summary.hashtag.news | numFormat }}
            hashtag
          </div>
        </b-card>
      </li>
    </b-col>

    <b-col>
      <li v-on:click="youtube()">
        <vue-element-loading
          :active="getLoadStatus"
          size="80"
          background-color="rgba(255, 255, 255, 0.3)"
          color="#ede7dd"
        />
        <!-- <img src="@/assets/Youtube.png" class="socialogo m-auto pb-2" /> -->
        <b-card id="yt">
          <div class="h5">Youtube</div>
          <div id="yt1" class="m-auto small" v-if="tabsMonitor == 'tabProfile'">
            {{ getSumMonitor.summary.target.youtube | numFormat }}
            Users
          </div>
          <div id="yt1" class="m-auto small" v-else>
            {{ getSumMonitor.summary.hashtag.youtube | numFormat }}
            hashtag
          </div>
        </b-card>
      </li>
    </b-col>

    <b-col>
      <li v-on:click="instagram()">
        <vue-element-loading
          :active="getLoadStatus"
          size="80"
          background-color="rgba(255, 255, 255, 0.3)"
          color="#ede7dd"
        />
        <!-- <img src="@/assets/Instagram.png" class="socialogo m-auto pb-2" /> -->
        <b-card id="itg">
          <div class="h5">Instagram</div>
          <div
            id="itg1"
            class="m-auto small"
            v-if="tabsMonitor == 'tabProfile'"
          >
            {{ getSumMonitor.summary.target.instagram | numFormat }}
            Users
          </div>
          <div id="itg1" class="m-auto small" v-else>
            {{ getSumMonitor.summary.hashtag.instagram | numFormat }}
            hashtag
          </div>
        </b-card>
      </li>
    </b-col>

    <b-col>
      <li v-on:click="blockdit()">
        <vue-element-loading
          :active="getLoadStatus"
          size="80"
          background-color="rgba(255, 255, 255, 0.3)"
          color="#ede7dd"
        />
        <!-- <img src="@/assets/Instagram.png" class="socialogo m-auto pb-2" /> -->
        <b-card id="bd">
          <div class="h5">Blockdit</div>
          <div
            id="itg1"
            class="m-auto small"
            v-if="tabsMonitor == 'tabProfile'"
          >
            {{ getSumMonitor.summary.target.blockdit | numFormat }}
            Users
          </div>
          <div id="itg1" class="m-auto small" v-else>
            {{ getSumMonitor.summary.hashtag.blockdit | numFormat }}
            hashtag
          </div>
        </b-card>
      </li>
    </b-col>

    <b-col>
      <li v-on:click="tiktok()">
        <vue-element-loading
          :active="getLoadStatus"
          size="80"
          background-color="rgba(255, 255, 255, 0.3)"
          color="#ede7dd"
        />
        <!-- <img src="@/assets/Instagram.png" class="socialogo m-auto pb-2" /> -->
        <b-card id="tt">
          <div class="h5">Tiktok</div>
          <div
            id="itg1"
            class="m-auto small"
            v-if="tabsMonitor == 'tabProfile'"
          >
            {{ getSumMonitor.summary.target.tiktok | numFormat }}
            Users
          </div>
          <div id="itg1" class="m-auto small" v-else>
            {{ getSumMonitor.summary.hashtag.tiktok | numFormat }}
            hashtag
          </div>
        </b-card>
      </li>
    </b-col>
  </b-row>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    tabsMonitor: {
      type: String,
    },
  },
  data() {
    return {
      social: "",
    };
  },
  computed: {
    ...mapGetters([
      "getItemsProfile",
      "getSumMonitor",
      "getSocialMo",
      "getListMonitor",
      "getLoadStatus"
    ]),
  },
  methods: {
    all() {
      this.social = "";
      this.$store.commit("setListProfile", this.getListMonitor);
      this.$store.commit("setCurrentPage", 1);
      document.getElementById("all").style.background = "#fed269a3";
      document.getElementById("tw").style.background = "#ffffff";
      document.getElementById("fb").style.background = "#ffffff";
      document.getElementById("pt").style.background = "#ffffff";
      document.getElementById("yt").style.background = "#ffffff";
      document.getElementById("itg").style.background = "#ffffff";
      document.getElementById("bd").style.background = "#ffffff";
      document.getElementById("nw").style.background = "#ffffff";
      document.getElementById("tt").style.background = "#ffffff";
    },
    twitter() {
      this.social = "twitter";
      var datas = this.getListMonitor.targetlist;
      if (this.tabsMonitor == "tabProfile") {
        const found = datas.filter((element) => element.source === "twitter");
        // console.log({
        //   targetlist: found,
        //   summary: this.getListMonitor.summary,
        //   hashtaglist: this.getListMonitor.hashtaglist,
        // });
        this.$store.commit("setListProfile", {
          targetlist: found,
          summary: this.getListMonitor.summary,
          hashtaglist: this.getListMonitor.hashtaglist,
        });
      } else {
        const found = this.getListMonitor.hashtaglist.filter(
          (element) => element.source === "twitter"
        );
        this.$store.commit("setListProfile", {
          hashtaglist: found,
          summary: this.getListMonitor.summary,
          targetlist: this.getListMonitor.targetlist,
        });
      }
      this.$store.commit("setCurrentPage", 1);
      document.getElementById("all").style.background = "#ffffff";
      document.getElementById("tw").style.background = "#fed269a3";
      document.getElementById("fb").style.background = "#ffffff";
      document.getElementById("pt").style.background = "#ffffff";
      document.getElementById("yt").style.background = "#ffffff";
      document.getElementById("itg").style.background = "#ffffff";
      document.getElementById("bd").style.background = "#ffffff";
      document.getElementById("nw").style.background = "#ffffff";
      document.getElementById("tt").style.background = "#ffffff";
    },
    facebook() {
      this.social = "facebook";
      if (this.tabsMonitor == "tabProfile") {
        const found = this.getListMonitor.targetlist.filter(
          (element) => element.source === "facebook"
        );
        this.$store.commit("setListProfile", {
          targetlist: found,
          summary: this.getListMonitor.summary,
          hashtaglist: this.getListMonitor.hashtaglist,
        });
      } else {
        const found = this.getListMonitor.hashtaglist.filter(
          (element) => element.source === "facebook"
        );
        this.$store.commit("setListProfile", {
          hashtaglist: found,
          summary: this.getListMonitor.summary,
          targetlist: this.getListMonitor.targetlist,
        });
      }
      this.$store.commit("setCurrentPage", 1);
      document.getElementById("all").style.background = "#ffffff";
      document.getElementById("tw").style.background = "#ffffff";
      document.getElementById("fb").style.background = "#fed269a3";
      document.getElementById("pt").style.background = "#ffffff";
      document.getElementById("yt").style.background = "#ffffff";
      document.getElementById("itg").style.background = "#ffffff";
      document.getElementById("bd").style.background = "#ffffff";
      document.getElementById("nw").style.background = "#ffffff";
      document.getElementById("tt").style.background = "#ffffff";
    },
    pantip() {
      this.social = "pantip";
      if (this.tabsMonitor == "tabProfile") {
        const found = this.getListMonitor.targetlist.filter(
          (element) => element.source === "pantip"
        );
        this.$store.commit("setListProfile", {
          targetlist: found,
          summary: this.getListMonitor.summary,
          hashtaglist: this.getListMonitor.hashtaglist,
        });
      } else {
        const found = this.getListMonitor.hashtaglist.filter(
          (element) => element.source === "pantip"
        );
        this.$store.commit("setListProfile", {
          hashtaglist: found,
          summary: this.getListMonitor.summary,
          targetlist: this.getListMonitor.targetlist,
        });
      }
      this.$store.commit("setCurrentPage", 1);
      document.getElementById("all").style.background = "#ffffff";
      document.getElementById("tw").style.background = "#ffffff";
      document.getElementById("fb").style.background = "#ffffff";
      document.getElementById("pt").style.background = "#fed269a3";
      document.getElementById("yt").style.background = "#ffffff";
      document.getElementById("itg").style.background = "#ffffff";
      document.getElementById("bd").style.background = "#ffffff";
      document.getElementById("nw").style.background = "#ffffff";
      document.getElementById("tt").style.background = "#ffffff";
    },
    youtube() {
      this.social = "youtube";
      if (this.tabsMonitor == "tabProfile") {
        const found = this.getListMonitor.targetlist.filter(
          (element) => element.source === "youtube"
        );
        this.$store.commit("setListProfile", {
          targetlist: found,
          summary: this.getListMonitor.summary,
          hashtaglist: this.getListMonitor.hashtaglist,
        });
      } else {
        const found = this.getListMonitor.hashtaglist.filter(
          (element) => element.source === "youtube"
        );
        this.$store.commit("setListProfile", {
          hashtaglist: found,
          summary: this.getListMonitor.summary,
          targetlist: this.getListMonitor.targetlist,
        });
      }
      this.$store.commit("setCurrentPage", 1);
      document.getElementById("all").style.background = "#ffffff";
      document.getElementById("tw").style.background = "#ffffff";
      document.getElementById("fb").style.background = "#ffffff";
      document.getElementById("pt").style.background = "#ffffff";
      document.getElementById("yt").style.background = "#fed269a3";
      document.getElementById("itg").style.background = "#ffffff";
      document.getElementById("bd").style.background = "#ffffff";
      document.getElementById("nw").style.background = "#ffffff";
      document.getElementById("tt").style.background = "#ffffff";
    },
    instagram() {
      this.social = "instagram";
      if (this.tabsMonitor == "tabProfile") {
        const found = this.getListMonitor.targetlist.filter(
          (element) => element.source === "instagram"
        );
        this.$store.commit("setListProfile", {
          targetlist: found,
          summary: this.getListMonitor.summary,
          hashtaglist: this.getListMonitor.hashtaglist,
        });
      } else {
        const found = this.getListMonitor.hashtaglist.filter(
          (element) => element.source === "instagram"
        );
        this.$store.commit("setListProfile", {
          hashtaglist: found,
          summary: this.getListMonitor.summary,
          targetlist: this.getListMonitor.targetlist,
        });
      }
      this.$store.commit("setCurrentPage", 1);
      document.getElementById("all").style.background = "#ffffff";
      document.getElementById("tw").style.background = "#ffffff";
      document.getElementById("fb").style.background = "#ffffff";
      document.getElementById("pt").style.background = "#ffffff";
      document.getElementById("yt").style.background = "#ffffff";
      document.getElementById("itg").style.background = "#fed269a3";
      document.getElementById("bd").style.background = "#ffffff";
      document.getElementById("nw").style.background = "#ffffff";
      document.getElementById("tt").style.background = "#ffffff";
    },
    blockdit() {
      this.social = "blockdit";
      if (this.tabsMonitor == "tabProfile") {
        const found = this.getListMonitor.targetlist.filter(
          (element) => element.source === "blockdit"
        );
        this.$store.commit("setListProfile", {
          targetlist: found,
          summary: this.getListMonitor.summary,
          hashtaglist: this.getListMonitor.hashtaglist,
        });
      } else {
        const found = this.getListMonitor.hashtaglist.filter(
          (element) => element.source === "blockdit"
        );
        this.$store.commit("setListProfile", {
          hashtaglist: found,
          summary: this.getListMonitor.summary,
          targetlist: this.getListMonitor.targetlist,
        });
      }
      this.$store.commit("setCurrentPage", 1);
      document.getElementById("all").style.background = "#ffffff";
      document.getElementById("tw").style.background = "#ffffff";
      document.getElementById("fb").style.background = "#ffffff";
      document.getElementById("pt").style.background = "#ffffff";
      document.getElementById("yt").style.background = "#ffffff";
      document.getElementById("itg").style.background = "#ffffff";
      document.getElementById("bd").style.background = "#fed269a3";
      document.getElementById("nw").style.background = "#ffffff";
      document.getElementById("tt").style.background = "#ffffff";
    },
    tiktok() {
      this.social = "tiktok";
      if (this.tabsMonitor == "tabProfile") {
        const found = this.getListMonitor.targetlist.filter(
          (element) => element.source === "tiktok"
        );
        this.$store.commit("setListProfile", {
          targetlist: found,
          summary: this.getListMonitor.summary,
          hashtaglist: this.getListMonitor.hashtaglist,
        });
      } else {
        const found = this.getListMonitor.hashtaglist.filter(
          (element) => element.source === "tiktok"
        );
        this.$store.commit("setListProfile", {
          hashtaglist: found,
          summary: this.getListMonitor.summary,
          targetlist: this.getListMonitor.targetlist,
        });
      }
      this.$store.commit("setCurrentPage", 1);
      document.getElementById("all").style.background = "#ffffff";
      document.getElementById("tw").style.background = "#ffffff";
      document.getElementById("fb").style.background = "#ffffff";
      document.getElementById("pt").style.background = "#ffffff";
      document.getElementById("yt").style.background = "#ffffff";
      document.getElementById("itg").style.background = "#ffffff";
      document.getElementById("bd").style.background = "#ffffff";
      document.getElementById("nw").style.background = "#ffffff";
      document.getElementById("tt").style.background = "#fed269a3";
    },
    news() {
      this.social = "news";
      if (this.tabsMonitor == "tabProfile") {
        const found = this.getListMonitor.targetlist.filter(
          (element) => element.source === "news"
        );
        this.$store.commit("setListProfile", {
          targetlist: found,
          summary: this.getListMonitor.summary,
          hashtaglist: this.getListMonitor.hashtaglist,
        });
      } else {
        const found = this.getListMonitor.hashtaglist.filter(
          (element) => element.source === "news"
        );
        this.$store.commit("setListProfile", {
          hashtaglist: found,
          summary: this.getListMonitor.summary,
          targetlist: this.getListMonitor.targetlist,
        });
      }
      this.$store.commit("setCurrentPage", 1);
      document.getElementById("all").style.background = "#ffffff";
      document.getElementById("tw").style.background = "#ffffff";
      document.getElementById("fb").style.background = "#ffffff";
      document.getElementById("pt").style.background = "#ffffff";
      document.getElementById("yt").style.background = "#ffffff";
      document.getElementById("itg").style.background = "#ffffff";
      document.getElementById("bd").style.background = "#ffffff";
      document.getElementById("nw").style.background = "#fed269a3";
      document.getElementById("tt").style.background = "#ffffff";
    },
  },
};
</script>

<style scoped>
.col {
  flex-grow: unset;
  padding-right: 0px;
  padding-left: 0px;
}
#nw {
  color: #c99300;
}
#tt {
  color: #3f2e4c;
}
#bd {
  color: #396eb6;
}
#itg {
  color: #dd6600;
}
#yt {
  color: #d34644;
}
#pt {
  color: #521d87;
}
#tw {
  color: #4dabf3;
}
#fb {
  color: #3555aa;
}
.card {
  border: none;
}
.card-body {
  width: 150px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  border-radius: 7px;
  /* box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%); */
}
/* .all-sort {
  background-color: #fed16e;
  color: white;
  height: 45px;
  width: 45px;
  padding: 9.5px;
  border-radius: 50%;
} */
.box-sum {
  /* width: 80%; */
  margin: auto;
}
.socialogo {
  width: 45px;
}
li {
  list-style: none;
  /* margin-left: 28%; */
  /* display: inline-block;
  color: white; */
  cursor: pointer;
  padding: 12px;
}
.card-body:hover {
  background-color: #fed269a3;
}

@media only screen and (min-width: 0px) and (max-width: 1024px) {
  .box-sum {
    width: 100%;
    margin: auto;
  }
  /* .row {
    justify-content: center!important;
  } */
}

@media only screen and (min-width: 0px) and (max-width: 600px) {
  li {
    padding: 4px;
  }
  .h5 {
    font-size: medium;
    font-weight: bold;
  }
  .card-body {
    width: 98px;
  }
  .card-body {
    flex: 1 1 auto;
    min-height: 1px;
    padding: 4px;
  }
  /* #all {
    margin-left: 3%;
  }
  #itg {
    margin-left: 37%;
  } */
}
@media only screen and (min-width: 414px) and (max-width: 736px) {
  .row {
    display: flex;
    flex-wrap: wrap;
    margin-right: -15px;
    margin-left: 0px;
    justify-content: center !important;
  }
}
</style>
