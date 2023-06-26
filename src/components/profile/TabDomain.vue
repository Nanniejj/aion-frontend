<template>
  <!-- Card body -->
  <div class="text-center mt-3 pl-lg-3 pr-lg-3">
    <!-- <div class="font-weight-bold h3 mb-4">Top Domain</div>  -->
    <b-row>
      <b-col md="12" lg="4" class="font-weight-bold mb-5">
        <vue-element-loading
          :active="getLoadStatus2"
          size="80"
          background-color="rgba(255,255,255, 0.5)"
          color="#fff"
          spinner="bar-fade-scale"
        />
        <b-card id="box-profile" v-if="getProfileMonitor.topfive != ''">
          <span class="h5 font-weight-bold">Top5 Domain</span>
          <hr class="mb-0" />
          <div id="top-content" class="text-left">
            <div
              class="border-bottom p-3"
              v-for="(topDomain, k) in getProfileMonitor.topfive"
              :key="k"
              @click="selectDomain(topDomain.name)"
            >
              {{ k + 1 }} {{ topDomain.name }}
              <div class="font-weight-normal small">
                {{ topDomain.count | numFormat }} posts
              </div>
            </div>
          </div>
        </b-card>
        <b-card v-else>
          <span class="h5 font-weight-bold">Top5 Hashtag</span>
          <hr class="mb-0" />
          <div class="font-weight-normal">
            <br />
            ไม่พบข้อมูล
          </div>
        </b-card>
      </b-col>
      <b-col md="12" lg="8" class="font-weight-bold mb-5">
        <vue-element-loading
          :active="getLoadStatus2"
          size="80"
          background-color="rgba(255,255,255, 0.5)"
          color="#fff"
          spinner="bar-fade-scale"
        />
        <ProfileWordCloud />
      </b-col>
      <b-col md="12" lg="12" class="font-weight-bold mb-5">
        <TabPost :tabs="'domainTab'" :api="checkApi" :dh="domainName" />
      </b-col>
    </b-row>
    <div class="mt-3"></div>
  </div>
</template>

<script>
import TabPost from "@/components/profile/TabPost.vue";
import ProfileWordCloud from "@/components/profile/ProfileWordCloud.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    TabPost,
    ProfileWordCloud,
  },
  props: {
    checkApi: {
      type: String,
    },
  },
  computed: {
    ...mapGetters([
      "getProfileMonitor",
      "getProfileData",
      "getTabStatus",
      "getLoadStatus2",
      "getTopData",
      "getHashtagData",
      "getCnt",
      "getValSource",
      "getNoMonitor",
    ]),

    domainName() {
      var d = this.dm;
      if (d == "") {
        d = "";
      } else {
        d = this.dm;
      }
      return d;
    },
  },
  data() {
    return {
      dm: "",
    };
  },
  methods: {
    selectDomain(domain) {
      this.dm = domain;
    },
  },
//   async created() {
//     this.$store.commit("setTabStatus", true);
//     if (this.checkApi == "profile") {
//       if (this.getProfileData) {
//         console.log("this.getProfileData", this.getProfileData);
//         localStorage.setItem("acc", this.getProfileData);
//   await this.$store.dispatch("fetchProfileMonitor", {
//           query: this.getProfileData,
//           api_type: "account",
//           top_type: "domain",
//           sort_by: "",
//           source: this.getValSource,
//         });
//         console.log('profile',this);
//       } else {
//         console.log("F5", localStorage.getItem("acc"));
//         this.$store.commit("setProfileData", localStorage.getItem("acc"));
//         await this.$store.dispatch("fetchProfileMonitor", {
//           query: localStorage.getItem("acc"),
//           api_type: "account",
//           top_type: "domain",
//           sort_by: "",
//           source: this.getValSource,
//         });
//       }
// } else {
//       if (this.getHashtagData) {
//         var hashtag = this.getHashtagData.replace("#", "");
//         localStorage.setItem("hash", hashtag);
//         await this.$store.dispatch("fetchProfileMonitor", {
//           query: hashtag,
//           api_type: "hashtag",
//           top_type: "domain",
//           sort_by: "",
//         });
//         this.$store.commit("setCnt2", this.getCnt);
//       } else {
//         this.$store.commit("setHashtagData", localStorage.getItem("hash"));
//         await this.$store.dispatch("fetchProfileMonitor", {
//           query: localStorage.getItem("hash"),
//           api_type: "hashtag",
//           top_type: "domain",
//           sort_by: "",
//         });
//         console.log("getCnt", this.getCnt);
//         this.$store.commit("setCnt2", this.getCnt);
//       }
//     }
//   },
  destroyed() {
    this.$destroy();
    //console.log('destroyed')
  },
};
</script>

<style scoped>
.card-body {
  min-height: 32rem;
}
#img-wordcloud {
  width: 100% !important;
}
.p-3:hover {
  background: rgb(0 0 0 / 3%);
  cursor: pointer;
}
#box-profile {
  width: 100%;
  height: auto;
  display: block;
  /* padding: 20px 0px; */
  padding-bottom: 0px;
  border-radius: 7px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  /* box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); */
}
.select-sort {
  width: 80%;
}
@media (max-width: 1200px) {
  .col-lg-8 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  .col-lg-4 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  @media only screen and (min-width: 0px) and (max-width: 600px) {
    .card-body {
      min-height: auto !important;
    }
  }
}
</style>