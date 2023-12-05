<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
    <!-- <vue-element-loading :active="getLoadStatus" :is-full-screen="true" size='80' 
      background-color='rgba(0, 0, 0, 0.3)' color='#fff' spinner="bar-fade-scale" /> -->
    <div id="content">
      <!-- <h1 class="title">Feed</h1> -->
      <div class="d-flex">
        <h1 class="title ">Feed</h1>
        <div
          class="h4 mb-5 float-right d-flex mt-3 box-menu-monitor"
          style="position:relative;margin-left: auto; 
margin-right: 0;"
        >
          <div class="mr-3 icon-monitor1" @click="toMonitor('Monitor')">
            <b-iconstack font-scale="2">
              <b-icon stacked icon="circle"></b-icon>
              <!-- <img
                  src="../assets/monitor.png"
                  alt="logo"
                  class="img-nav"
                  style="margin-bottom: 8px;width: 40px;"
                /> -->
              <b-icon stacked icon="cast" scale="0.5"></b-icon>
            </b-iconstack>
            <div class="d-block h6 text-center my-0">Monitor</div>
          </div>
          <div class="icon-monitor2" @click="toMonitor('Report')">
            <b-iconstack font-scale="2">
              <b-icon stacked icon="circle"></b-icon>
              <b-icon
                stacked
                icon="file-earmark-bar-graph"
                scale="0.5"
              ></b-icon>
            </b-iconstack>
            <div class="d-block h6 text-center my-0">Report</div>
          </div>
        </div>
      </div>

      <MainFeed />
      <!-- <div v-else>ไม่สามารถเข้าถึงข้อมูลได้</div> -->
    </div>
  </div>
</template>

<script>
import HomeNav from "@/components/HomeNav.vue";
import MainFeed from "@/components/feed/MainFeed.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    HomeNav,
    MainFeed,
  },
  data: function() {
    return {};
  },
  computed: {
    ...mapGetters(["getLoadStatus", "getRoleMion"]),
  },
  methods: {
    toMonitor(name) {
      this.$router.push({ name: name });
    },
  },

  created() {},
};
</script>

<style scoped>
.icon-monitor1,
.icon-monitor2 {
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 20px;
}
/* .b-icon.bi:hover {
    display: inline-block;
    overflow: visible;
    vertical-align: -0.15em;
    background: #fed06ea4;
    border-radius: 50%;
} */
.icon-monitor1:hover .h6 {
  color: #4c412b;
  font-weight: bold;
}
.icon-monitor2:hover .h6 {
  color: #4c412b;
  font-weight: bold;
}
.icon-monitor1:hover .b-icon.bi {
  color: #4c412b;
  background-color: #fed06ea4;
  border-radius: 50%;
  -webkit-transition: 0.3s ease-in-out;
  transition: 0.3s ease-in-out;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.icon-monitor2:hover .b-icon.bi {
  color: #4c412b;
  background-color: #fed06ea4;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.title-monitor {
  text-align: start;
  margin-left: 9%;
  margin-bottom: 20px !important;
}
.imgsocial {
  width: 40px;
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
  overflow: auto;
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
@media only screen and (min-width: 0px) and (max-width: 700px) {
  .b-icon.bi {
    font-size: 140% !important;
  }
  .box-menu-monitor {
    position: relative !important;
    right: 0px !important;
  }
  .icon-monitor1,
  .icon-monitor2 {
    cursor: pointer;
    padding: 3px 5px !important;
    border-radius: 10px;
  }
}
</style>
