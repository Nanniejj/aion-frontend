<template>
  <div id="tabs" class="mt-3 mb-5">
    <b-tabs
      content-class="mt-3"
      lazy
      active-nav-item-class="font-weight-bold"
      nav-item-class="font-weight-bold"
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
      <!-- ----------------------------------tab2 --------------------------------------------------->
      <b-tab @click="toTab('location')">
        <template #title id="title-tab">
          <span id="title-tab">
            <i class="fas fa-map-marker-alt" />
            Location
          </span>
        </template>
        <LocationMonitor :tabsMonitor="'tabLocation'" id="tablo" />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import ProfileMonitor from "@/components/monitor/ProfileMonitor.vue";
import HashtagMonitor from "@/components/monitor/HashtagMonitor.vue";
import LocationMonitor from "@/components/monitor/LocationMonitor.vue";
export default {
  components: {
    ProfileMonitor,
    HashtagMonitor,
    LocationMonitor,
  },
  methods: {
    toTab(name) {
      console.log(name);
    },
  },
  mounted() {
    var config = {
      method: "get",
      url: "http://139.59.103.67:3000/api/v2/userposts/getLocation",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    };
    this.axios(config).then((response) => {
      this.mapData = response.data;
      this.$store.commit('setMapdata',response.data)
      // this.$store.commit('setMaxMinMap',response.data)
      var myArray = [...response.data];
      var min = Math.min(...myArray.map((item) => item.count));
      var max = Math.max(...myArray.map((item) => item.count));
      this.$store.commit('setMaxMinMap',{max:max,min:min})
      console.log("min: " + min);
      console.log("max: " + max);
    });
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
