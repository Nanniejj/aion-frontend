<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
    <div id="content">
      <Transition name="slide-fade">
        <TitleLogo v-show="elementVisible" />
      </Transition>
      <!-- <Map/> -->
      <b-row class="mx-0 mx-lg-5" v-if="!getPushDomainStat">
        <b-col cols="12" md="" >
          <h4 class="title m-0 pb-0">หัวเรื่อง (Domain)</h4>
        </b-col>
        <b-col class="pr-0" style="padding-top: 20px;">
            <b-form-group label-for="search-input" class="">
                <b-input-group-append>
                    <b-form-input id="search-input" v-model="search" placeholder="ค้นหา"
                        class="w-100 mr-2" @keyup.enter="hasSearched = true"></b-form-input>
                        <!-- ปุ่มล้างค่า -->
                        <b-input-group-append style="position: absolute;right: 96px;">
                            <b-button
                                variant="link"
                                @click="resetSearch()"
                                title="ล้างข้อความ"
                                class="px-2"
                                style="color: red; text-decoration: none;"
                            >
                                <i v-b-tooltip.hover title="ล้างคำค้นหา" class="fa fa-times"></i>
                            </b-button>
                        </b-input-group-append>
                    <b-button variant="warning" style="background-color: #fed16e;" pill :pressed="false" @click="hasSearched = true" class="shadow-r px-4">ค้นหา</b-button>
                </b-input-group-append>
            </b-form-group>
        </b-col>
        <b-col cols="auto"><i class="fas fa-print fa-2x px-0" @click="printWindow()"></i></b-col>
      </b-row>
      <DomainList v-if="!getPushDomainStat" 
        :search="search" 
        :hasSearched="hasSearched"
        @updated="hasSearched = false"
        />
      <DomainMain v-if="getPushDomainStat" />
      <back-to-top bottom="50px" right="50px">
        <button type="button" class="btn btn-to-top">
          <i class="fa fa-chevron-up"></i>
        </button>
      </back-to-top>
      <!-- <FooterHome/> -->
    </div>
  </div>
</template>
<script>
import TitleLogo from "../components/TitleLogo.vue";
import HomeNav from "@/components/HomeNav.vue";
import DomainList from "@/components/domain/DomainList.vue";
import DomainMain from "@/components/domain/DomainMain.vue";
// import Map from "@/components/map/Map.vue";
import { mapGetters } from "vuex";
import FooterHome from "@/components/FooterHome.vue";

export default {
  components: {
    HomeNav,
    DomainList,
    DomainMain,
    TitleLogo,
    FooterHome
    // Map
  },
  data() {
    return {
        search: '',
        hasSearched: false,
        elementVisible: false,
    };
  },

  computed: {
    ...mapGetters([
      "getSelected",
      "getSentimentChart",
      "getWordCloud",
      "getDomain",
      "getLoadStatus",
      "getPushDomainStat",
      "getToSection",
      "getShowIntro",
    ]),
  },
    methods: {
    resetSearch() {
        this.search = ''
        this.hasSearched = true
    },
    onSearch() {
        this.hasSearched = true
      // ตรวจสอบว่าผู้ใช้กรอกคำค้นหรือไม่ (ใส่ก็ได้ไม่ใส่ก็ได้)
    //   if (this.search.trim() !== '') {
    //     this.hasSearched = true
    //   } else {
    //     this.hasSearched = false
    //   }
    },
    printWindow: function () {
      try {
        window.print();
      } catch (err) {
        console.log(err);
      }
    },
    closeShow() {
      setTimeout(() => (this.elementVisible = false), 1000);
      this.$store.commit("setShowIntro", false);
    },
    simplifyFacebookURL(originalURL) {
      // Match the numeric ID in the URL
      const regex = /(\d{15,})/; // Adjust the number 15 if you expect different lengths of numeric IDs
      const match = originalURL.match(regex);

      if (match) {
        const userID = match[1];
        const newURL = `https://www.facebook.com/${userID}`;
        return newURL;
      } else {
        return "Invalid URL";
      }
    }
  },
  mounted() {
    if (this.getShowIntro) {
      this.elementVisible = true;
      this.closeShow();
    }
  },
  destroyed() {
    this.$store.commit("setPushDomainStat", false);
  },
  created() {
    // this.$store.dispatch("fetchListIssue");
    // let ar = []
    //  var ar_cleaned = ar.filter(function(url) {
    //     return (
    //       !url.includes("vt.tiktok.com") &&
    //       !url.includes("https://www.facebook.com/share/") &&
    //       !url.includes("fb.watch")&&
    //       !url.includes("m.facebook.com")
    //     );
    //   })
    //   .map(function(url) {
    //     var cleanedUrl = url
    //       .replace("profile.php?id=", "")
    //       .split("?")[0]
    //       .split("/status/")[0]
    //       .split("&")[0]
    //       .replace("x.com", "twitter.com").replace("https://www.youtube.com", "https://youtube.com").replace('mobile.','').replace('web.','')
    //       .replace("https://www.instagram.com", "https://instagram.com")
    //       .replace("www.facebook.com", "facebook.com").split('/posts/')[0]
    //     // Split at "/status/" and take the first part

    //     return cleanedUrl;
    //   });
    //   let tw = [...ar_cleaned].filter((v)=>{return v.includes("twitter")})
    //   let fb = [...ar_cleaned].filter((v)=>{return v.includes("facebook")})
    //   let tt = [...ar_cleaned].filter((v)=>{return v.includes("tiktok")})
    //   let ig= [...ar_cleaned].filter((v)=>{return v.includes("instagram")})
    //   let yt= [...ar_cleaned].filter((v)=>{return v.includes("youtube")})
    //   console.log('twitter',tw);
    //   console.log('facebook',fb);
    //   console.log('tiktok',tt);
    //   console.log('IG',ig);
    //   console.log('youtube',yt);
    // console.log("ar_cleaned", ar_cleaned);

    //     const originalURL = "https://facebook.com/profile.php/?id=100002416358810";
    // const simplifiedURL = this.simplifyFacebookURL(originalURL);
    // Output: https://www.facebook.com/100028303330304

  },
};
</script>

<style scoped>
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

.btn-to-top:hover {
  background-color: #f7c24e;
  border-color: #f7c24e;
  color: #fff;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.fa-print {
  text-align: end;
  float: right;
  padding: 20px;
  cursor: pointer;
}

* {
  font-family: "Prompt", "FontAwesome", sans-serif;
}

#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
}

#navHome {
  z-index: 1;
}

@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  #overflow-page {
    overflow: hidden;
  }
}

@media only screen and (min-width: 950px) and (max-width: 1150px) {
  .date {
    margin-top: 20pt;
    margin-left: 11.5rem;
    margin-bottom: 10pt;
  }
}

@media only screen and (min-width: 0px) and (max-width:800px) {
  .vue-back-to-top {
    right: 14px !important;
  }

  .btn-to-top {
    width: 50px;
    height: 50px;
    padding: 10px 13px;

  }
}

@media only screen and (min-width: 0px) and (max-width: 600px) {

  .fa-print {
    font-size: 25px;
  }
}
</style>
