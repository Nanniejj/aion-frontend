<template>
  <div>
    <div class="mt-3 mb-3 box-domain">
      <vue-element-loading
        :active="getLoadStatus"
        size="80"
        background-color="rgba(255, 255, 255, 0.3)"
        color="#b6ac9a"
      />

      <b-container>
        <b-row align-h="center" class="mb-3">
          <img
            v-if="getNamePlatform == 'facebook'"
            src="@/assets/cfb.png"
            class="imgs"
          />
          <img
            v-if="getNamePlatform == 'news'"
            src="@/assets/cn.png"
            class="imgs"
          />
          <img
            v-if="getNamePlatform == 'pantip'"
            src="@/assets/cpt.png"
            class="imgs"
          />
          <img
            v-if="getNamePlatform == 'twitter'"
            src="@/assets/ctw.png"
            class="imgs"
          />
          <img
            v-if="getNamePlatform == 'youtube'"
            src="@/assets/cyt.png"
            class="imgs"
          />
          <img
            v-if="getNamePlatform == 'instagram'"
            src="@/assets/cig.png"
            class="imgs"
          />
          <img
            v-if="getNamePlatform == 'blockdit'"
            src="@/assets/Block.png"
            class="imgs"
          />
           <img
            v-if="getNamePlatform == 'tiktok'"
            src="@/assets/tt.png"
            class="imgstt"
          />
          <img
            v-if="getNamePlatform == 'threads'"
            src="@/assets/ctd.png"
            class="imgstt"
          />
        </b-row>
        <b-row class="m-2">
          <b-col v-if="getNamePlatform != 'news'">
            <div class="bold">{{ getStat.users | numFormat }}</div>
            <div>Users</div>
          </b-col>
          <b-col v-if="getNamePlatform == 'news'">
            <div
              class="bold"
              @click="
                listNews();
                open = true;
              "
            >
              {{ getStat.users | numFormat }}
            </div>
            <span @click="open = true">Source</span>
          </b-col>
          <b-col  class="border-left">
            <div class="bold">{{ getStat.post+  getStat.comment| numFormat }}</div>
            <div>Messages</div>
          </b-col>
          <b-col v-if="getNamePlatform == 'news'" class="border-left">
            <div class="bold">{{ getStat.post | numFormat }}</div>
            <div>Posts</div>
          </b-col>
          <b-col class="border-left" v-if="getNamePlatform == 'twitter'">
            <div class="bold">{{ getStat.post | numFormat }}</div>
            <div>Posts</div>
          </b-col>
          <b-col class="border-left" v-if="getNamePlatform == 'twitter'">
            <div class="bold">{{ getStat.comment | numFormat }}</div>
            <div>Comments</div>
          </b-col>
          <b-col class="border-left" v-if="getNamePlatform == 'facebook'">
            <div class="bold">{{ getStat.post | numFormat }}</div>
            <div>Posts</div>
          </b-col>
          <b-col class="border-left" v-if="getNamePlatform == 'facebook'">
            <div class="bold">{{ getStat.comment | numFormat }}</div>
            <div>Comments</div>
          </b-col>
          <b-col class="border-left" v-if="getNamePlatform == 'pantip'">
            <div class="bold">{{ getStat.post | numFormat }}</div>
            <div>Posts</div>
          </b-col>
          <b-col class="border-left" v-if="getNamePlatform == 'pantip'">
            <div class="bold">{{ getStat.comment | numFormat }}</div>
            <div>Comments</div>
          </b-col>
          <b-col class="border-left" v-if="getNamePlatform == 'youtube'">
            <div class="bold">{{ getStat.post | numFormat }}</div>
            <div>Posts</div>
          </b-col>
          <b-col class="border-left" v-if="getNamePlatform == 'youtube'">
            <div class="bold">{{ getStat.comment | numFormat }}</div>
            <div>Comments</div>
          </b-col>
          <b-col class="border-left" v-if="getNamePlatform == 'instagram'">
            <div class="bold">{{ getStat.post | numFormat }}</div>
            <div>Posts</div>
          </b-col>
          <b-col class="border-left" v-if="getNamePlatform == 'instagram'">
            <div class="bold">{{ getStat.comment | numFormat }}</div>
            <div>Comments</div>
          </b-col>
          <b-col class="border-left" v-if="getNamePlatform == 'blockdit'">
            <div class="bold">{{ getStat.post | numFormat }}</div>
            <div>Posts</div>
          </b-col>
          <b-col class="border-left" v-if="getNamePlatform == 'blockdit'">
            <div class="bold">{{ getStat.comment | numFormat }}</div>
            <div>Comments</div>
          </b-col>
          <b-col class="border-left" v-if="getNamePlatform == 'tiktok'">
            <div class="bold">{{ getStat.post | numFormat }}</div>
            <div>Posts</div>
          </b-col>
          <b-col class="border-left" v-if="getNamePlatform == 'tiktok'">
            <div class="bold">{{ getStat.comment | numFormat }}</div>
            <div>Comments</div>
          </b-col>
          <b-col class="border-left" v-if="getNamePlatform == 'threads'">
            <div class="bold">{{ getStat.post | numFormat }}</div>
            <div>Posts</div>
          </b-col>
          <b-col class="border-left" v-if="getNamePlatform == 'threads'">
            <div class="bold">{{ getStat.comment | numFormat }}</div>
            <div>Comments</div>
          </b-col>
        </b-row>
        <div class="text-center mt-4 mb-2 bold">Summary</div>
        <b-row class="comment-post" v-if="getSum">
          <b-col v-b-tooltip.hover title="Posts">
            <div>
              <i class="far fa-paper-plane" /> {{ getSum.post | numFormat }}
            </div>
          </b-col>
          <b-col class="border-left" v-b-tooltip.hover title="Comments">
            <div>
              <i class="far fa-comments" /> {{ getSum.comment | numFormat }}
            </div>
          </b-col>
          <b-col class="border-left" v-b-tooltip.hover title="Users">
            <div><i class="fas fa-users" /> {{ getSum.users | numFormat }}</div>
          </b-col>
          <b-col class="border-left" v-b-tooltip.hover title="Crawler">
            <div>
              <i class="fas fa-cloud-download-alt" />
              {{ craw.data | numFormat }}
            </div>
          </b-col>
          <b-col class="border-left" v-b-tooltip.hover title="Preprocess">
            <div><i class="fas fa-database" /> {{ craw.pre | numFormat }}</div>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <vue-modaltor
      :visible="open"
      @hide="hideModal"
      :animation-panel="'modal-slide-top'"
      :resize-width="{ 3000: '40%', 1350: '70%', 768: '90%' }"
    >
      <b> News List </b>
      <hr />
      <div class="mb-1">ข้อมูลเข้า total : {{ getNewslt.Accounts }} users</div>
      <div class="collist">
        <div v-for="(news, k) in getNewslt.totalAccount" :key="k">
          {{ k + 1 }}. {{ news }}
        </div>
      </div>

      <div class="mt-3 mb-1">ข้อมูลไม่เข้า total : {{ dif.length }} users</div>
      <div class="collist">
        <div v-for="(diff, i) in dif" :key="i">{{ i + 1 }}. {{ diff }}</div>
      </div>
    </vue-modaltor>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
export default {
    watch:{
getArrDate(){
  console.log('this.getNewslt',this.getNewslt);
  this.getNewslt
  this.listNews()
}
  },
  data() {
    return {
      stat_data: "",
      fb_data: "",
      pt_data: "",
      yt_data: "",
      ig_data: "",
      ns_data: "",
      newsarr: "",
      open: false,
      dif: "",
    };
  },
  computed: {
    ...mapGetters([
      "getNamePlatform",
      "getTwitter",
      "getFacebook",
      "getPantip",
      "getYoutube",
      "getNews",
      "getInstagram",
      "getTiktok",
      "getSumTiktok",
      "getSumTwitter",
      "getSumPantip",
      "getSumFacebook",
      "getSumYoutube",
      "getSumNews",
      "getSumInstagram",
      "getCraw",
      "getLoadStatus",
      "getDomainArr",
      "getSdateDm",
      "getEdateDm",
      "getNewslt",
      "getArrDate",
      "getSumBlockdit",
      "getBlockdit",
      "getThreads",
      "getSumThreads"
    ]),
    getStat() {
      var data;
      if (this.getNamePlatform == "twitter") {
        data = this.getTwitter;
      } else if (this.getNamePlatform == "facebook") {
        data = this.getFacebook;
      } else if (this.getNamePlatform == "pantip") {
        data = this.getPantip;
      } else if (this.getNamePlatform == "youtube") {
        data = this.getYoutube;
      } else if (this.getNamePlatform == "news") {
        data = this.getNews;
      } else if (this.getNamePlatform == "instagram"){
        data = this.getInstagram;
      }else if (this.getNamePlatform == "tiktok"){
        data = this.getTiktok;
      }else if (this.getNamePlatform == "threads"){
        data = this.getThreads;
      }else{
         data = this.getBlockdit;
      }
      return data;
    },
    getSum() {
      var data;
      if (this.getNamePlatform == "twitter") {
        data = this.getSumTwitter;
      } else if (this.getNamePlatform == "facebook") {
        data = this.getSumFacebook;
      } else if (this.getNamePlatform == "pantip") {
        data = this.getSumPantip;
      } else if (this.getNamePlatform == "youtube") {
        data = this.getSumYoutube;
      } else if (this.getNamePlatform == "news") {
        data = this.getSumNews;
      } else if (this.getNamePlatform == "instagram"){
        data = this.getSumInstagram;
      }else if (this.getNamePlatform == "tiktok"){
        data = this.getSumTiktok;
      }else if (this.getNamePlatform == "threads"){
        data = this.getSumThreads;
      }else{
        data = this.getSumBlockdit;
      }
      return data;
    },
    craw() {
      var data, pre;
      if (this.getNamePlatform == "twitter") {
        data = this.getCraw.crawler_twitter;
        pre = this.getCraw.preprocess_twitter;
      } else if (this.getNamePlatform == "facebook") {
        data = this.getCraw.crawler_facebook;
        pre = this.getCraw.preprocess_facebook;
      } else if (this.getNamePlatform == "pantip") {
        data = this.getCraw.crawler_pantip;
        pre = this.getCraw.preprocess_pantip;
      } else if (this.getNamePlatform == "youtube") {
        data = this.getCraw.crawler_youtube;
        pre = this.getCraw.preprocess_youtube;
      } else if (this.getNamePlatform == "news") {
        data = this.getCraw.crawler_news;
        pre = this.getCraw.preprocess_news;
      } else if (this.getNamePlatform == "instagram"){
        data = this.getCraw.crawler_instagram;
        pre = this.getCraw.preprocess_instagram;
      } else if (this.getNamePlatform == "tiktok"){
        data = this.getCraw.crawler_tiktok;
        pre = this.getCraw.preprocess_tiktok;
      }else if (this.getNamePlatform == "threads"){
        data = this.getCraw.crawler_threads;
        pre = this.getCraw.preprocess_threads;
      }else{
         data = this.getCraw.crawler_blockdit;
         pre = this.getCraw.preprocess_blockdit;
      }
      return { data, pre };
    },
  },
  methods: {
    hideModal() {
      this.open = false;
    },
    listNews() {
      let arrA = this.getNewslt.totalAccount;
           console.log('arrA',arrA);
      let arrB = [
        "suratthani",
        "linenews",
        "naewna",
        "mgronline",
        "matichon",
        "thaipbs",
        "siamrath",
        "khaosod",
        "nationtv",
        "isranews",
        "tnews",
        "bbc",
        "pptvhd36",
        "prachatai",
        "amarintv",
        "chiangmainews",
        "bangkokbiznews",
        "ch7",
        "mcot",
        "bangkokpost",
        "springnews",
        "voicetv",
        "chonburi",
        "chanthaburi",
        "lopburi",
        "rayong",
        "angthong",
        "samutprakan",
        "nakhonphanom",
        "nan",
        "trang",
        "loei",
        "sisaket",
        "sakonnakhon",
        "amnatcharoen",
        "blognone",
        "brandinside",
        "phangnga",
        "udonthani",
        "ubonratchathani",
        "chumphon",
        "yala",
        "dailynews",
        "thairath",
        "bangkok",
        "buriram",
        "ratchaburi",
        "lamphun",
        "ranong",
        "songkhla",
        "nakhonsawan",
        "khonkaen",
        "kalasin",
        "sanook",
        "ejan",
        "brighttv",
        "mthai",
        "komchadluek",
      ];
      let difference = arrA
        .filter((x) => !arrB.includes(x))
        .concat(arrB.filter((x) => !arrA.includes(x)));
        console.log("difference", difference);
      this.dif = difference;
    },
  },
  mounted() {
    if (this.getNamePlatform=="news") {
       this.axios
      .get(
        "https://api2.cognizata.com/api/v2/userposts/getNews?source=news&start="+this.start_date+"&end="+  this.end_date+"&domain="+this.getDomainArr
      )
      .then((response) => (this.$store.commit('setNewslt',response.data[0])  ));
    }
   
  },
  async created() {
    let today = moment(new Date()).format().slice(0, 10);
    console.log("moment", moment(new Date()).format());
    this.start_date = today + "T00:00:00";
    //this.$store.commit("setRageStartdate", this.start_date);
    this.end_date = today + "T23:59:59";
    //this.$store.commit("setRageEnddate", this.end_date);
    this.$store.dispatch("fetchAllstats", {
      start_date: this.start_date,
      end_date: this.end_date,
    });

    await this.$store.dispatch("fetchSentimentStatDashboard", {
      start_date: this.start_date,
      end_date: this.end_date,
      domain: this.getDomainArr,
    });
  },
};
</script>

<style scoped>
.collist {
  column-count: 3;
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
.fas,
.far {
  font-size: 22px;
}

@media only screen and (min-width: 0px) and (max-width: 700px) {
  .box-domain {
    font-size: smaller;
  }
}
</style>