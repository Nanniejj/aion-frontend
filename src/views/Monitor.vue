<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
    <div id="content">
      <div class="d-flex">
        <h1 class="title ">Monitor</h1>
        <div
          class="h4 mb-2 float-right d-flex mt-3 box-menu-monitor"
          style="position:relative;margin-left: auto; 
margin-right: 0;"
        > 
        <!-- ในหน้า monitor -->
        <div class="icon-monitor1" @click="$router.push('/politician')"> 
          <b-iconstack font-scale="2" > 
              <b-icon stacked icon="circle"></b-icon>
              <b-icon stacked icon="person-lines-fill" scale="0.5"></b-icon> 
            </b-iconstack>
            <div class="d-block h6 text-center my-0">Politician</div>
          </div>

          <div class="mr-3 icon-monitor2" @click="toMonitor('Feed')">
            <b-iconstack font-scale="2">
              <b-icon stacked icon="circle"></b-icon>
              <b-icon stacked icon="file-post" scale="0.5"></b-icon>
            </b-iconstack>
            <div class="d-block h6 text-center my-0">Feed</div>
          </div>
          <div class="icon-monitor3" @click="toMonitor('Report')">
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
      <!-- <h4 class="title-monitor" ><a>Monitor</a></h4> -->
      <TabMonitor />
      <!-- <ProfileMonitor/> -->
    </div>
  </div>
</template>

<script>
import HomeNav from "@/components/HomeNav.vue";
// import ProfileMonitor from '@/components/monitor/ProfileMonitor.vue';
import TabMonitor from "@/components/monitor/TabMonitor.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    HomeNav,
    TabMonitor, //ProfileMonitor
  },
  data: function() {
    return {};
  },
  computed: {
    ...mapGetters([
      "getLoadStatus",
      "getSocialMo",
      "getToSection",
      "getItemsProfile",
      "getFieldsProfile",
      "getProfile",
      "getListMonitorProfile",
    ]),
  },
  methods: {
    toMonitor(name) {
      this.$router.push({ name: name });
    },
  },
  async mounted() {
    // if (this.getSocialMo == "") {
    //     await this.$store.dispatch("fatchListMonitor");
    //   } else {
    //     await this.$store.dispatch("fatchListMonitor", {
    //       source: this.social,
    //     });
    //   }
  },
};
</script>

<style scoped>
.icon-monitor1,
.icon-monitor2 {
  cursor: pointer;
  padding: 6px 15px;
  border-radius: 20px;
}
.icon-monitor3 {
  cursor: pointer;
  padding: 6px 15px;
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
.icon-monitor3:hover .h6 {
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
.icon-monitor3:hover .b-icon.bi {
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
