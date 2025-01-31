<template>
  <div id="tabs" class="mt-3 mb-5">
    <b-tabs
      content-class="mt-3"
      lazy
      active-nav-item-class="font-weight-bold"
      nav-item-class="font-weight-bold"
      v-model="tab"
    >
      <b-tab @click="toTab('profile')">
        <template #title calss="title-tab">
          <span id="title-tab">
            <i class="fas fa-address-card" />
            Profile
          </span>
        </template>
        <ProfileMonitor :tabsMonitor="'tabProfile'" />
      </b-tab>
      <!-- ----------------------------------tab2 --------------------------------------------------->
      <b-tab @click="toTab('hashtag')">
        <template #title id="title-tab">
          <span id="title-tab">
            <i class="fas fa-hashtag" />
            Hashtag
          </span>
        </template>
        <HashtagMonitor :tabsMonitor="'tabHashtag'" />
      </b-tab>
      <!-- ----------------------------------tab3 --------------------------------------------------->
      <!-- <b-tab @click="toTab('location')">
        <template #title id="title-tab">
          <span id="title-tab">
            <i class="fas fa-map-marker-alt" />
            Location
          </span>
        </template>
        <LocationMonitor
          :tabsMonitor="'tabLocation'"
          id="tablo"
          @id-changwats="doFuncFoo"
        />
      </b-tab> -->
      <!-- ----------------------------------tab4 --------------------------------------------------->
      
      <!-- <b-tab @click="toTab('keyword')" >
        <template #title id="title-tab">
          <span id="title-tab">
            <i class="fas fa-tag" />
            Keyword <span class="small">(beta)</span>
          </span>
        </template>
        <KeywordsMonitor :tabsMonitor="'tabKeyword'" id="tablo" />
      </b-tab>  -->
    </b-tabs>
  </div>
</template>

<script>
import ProfileMonitor from "@/components/monitor/ProfileMonitor.vue";
import HashtagMonitor from "@/components/monitor/HashtagMonitor.vue";
import LocationMonitor from "@/components/monitor/LocationMonitor.vue";
import KeywordsMonitor from "@/components/monitor/KeywordsMonitor.vue";
export default {
  watch: {
    tab(val) {
      console.log(val);
      localStorage.setItem("tabMonitor", val);
    },
  },
  data() {
    return {
      tab: localStorage.getItem("tabMonitor"),
      idChangwats: "",
    };
  },
  components: {
    ProfileMonitor,
    HashtagMonitor,
    LocationMonitor,
    KeywordsMonitor,
  },
  methods: {
    doFuncFoo(value) {
      this.idChangwats = Number(value);
      console.log(
        "this.idChangwats",
        this.idChangwats,
        typeof this.idChangwats
      );
      if (this.idChangwats) {
        this.apiLocation();
      }
      console.log("doFuncFoo", value);
    },
    toTab(name) {
      console.log(name);
    },
    apiLocation() {
      var config = {
        method: "get",
        url: "https://api2.cognizata.com/api/v2/userposts/getLocation",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      this.axios(config).then((response) => {
        this.mapData = response.data;
        this.$store.commit("setMapdata", response.data);
        // this.$store.commit('setMaxMinMap',response.data)
        var myArray = [...response.data];
        var min = Math.min(...myArray.map((item) => item.count));
        var max = Math.max(...myArray.map((item) => item.count));
        this.$store.commit("setMaxMinMap", { max: max, min: min });
        // console.log("min: " + min);
        // console.log("max: " + max);
      });
    },

    // apiLocation() {
    //   let id = "";
    //   if (this.idChangwats) {
    //     id = "id=" + this.idChangwats;
    //   } else {
    //     id = "";
    //   }

    //   //https://api2.cognizata.com/api/v2/userposts/getLocation?id=2
    //   var config = {
    //     method: "get",
    //     url: "https://api2.cognizata.com/api/v2/userposts/getLocation?" + id,
    //     headers: {
    //       Authorization: "Bearer " + localStorage.getItem("token"),
    //       "Content-Type": "application/json",
    //     },
    //   };
    //   this.axios(config).then((response) => {
    //     this.mapData = response.data;
    //     this.$store.commit("setMapdata", response.data);
    //     // this.$store.commit('setMaxMinMap',response.data)
    //     var myArray = [...response.data];
    //     var min = Math.min(...myArray.map((item) => item.count));
    //     var max = Math.max(...myArray.map((item) => item.count));
    //     this.$store.commit("setMaxMinMap", { max: max, min: min });
    //     // console.log("min: " + min);
    //     // console.log("max: " + max);
    //   });
    // },
  },
  async mounted() {
    this.apiLocation();
    console.log("doFuncFoo2", this.idChangwats);
    let idx = localStorage.getItem("tabMonitor");

    if (idx) {
      this.tab = Number(idx);
    }
    
    if (this.getSocialMo == "") {
      //setListProfile
      console.log("getSocialMo", this.$route.params,this.getSocialMo);
      await this.$store.dispatch("fatchListMonitor");
    } else {
      console.log("getSocialMo2", this.$route.params,this.getSocialMo);
      await this.$store.dispatch("fatchListMonitor", {
        source: this.social,
      });
    }
  },
};
</script>

<style scoped>
#tablo {
  width: 95%;
  margin: auto;
}
#tabs {
  width: 85%;
  margin: auto;
}
.nav-tabs .nav-link.active #title-tab {
  color: #4c412b !important;
}
#title-tab {
  color: #4c412b;
  font-size: large;
}
.tab-content > .active {
  display: block;
  height: auto !important;
  overflow: none !important;
}
@media only screen and (min-width: 0px) and (max-width: 1280px) {
  #tabs {
    width: 96%;
    margin: auto;
  }
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  #tabs {
    width: 96%;
    margin: auto;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  #title-tab {
    font-size: initial;
  }
}
</style>
