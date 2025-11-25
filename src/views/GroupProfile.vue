<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
    <div id="content">
        <div class="main-wrapper m-sm-auto" >
            <h1 class="title m-0">Group</h1>
            <div class="d-flex align-items-center mb-3">
                <b-col @click="toMonitor('MonitorList')" cols="auto pl-0" style="cursor: pointer;" class="m-0">Monitor</b-col>
                <b-icon icon="chevron-right" class=""/>
                <b-col cols="auto" class="m-0 font-weight-bold">Group</b-col>
            </div>
            <ProfileGroup />
        </div>
    </div>
  </div>
</template>

<script>
import HomeNav from "@/components/HomeNav.vue";
// import ProfileMonitor from '@/components/monitor/ProfileMonitor.vue';
import ProfileGroup from "@/components/monitorlist/ProfileGroup.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    HomeNav,
    ProfileGroup,
  },
  data: function () {
    return {
        // type : this.$route.query.type
    };
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
      "getToLinkProfile"
    ]),
  },
  methods: {
    toMonitor(name) {
      this.$router.push({ name: name });
    },
  },
  async mounted() {
    // console.log(this.type);
    
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
.main-wrapper {
  width: 100%; /* ค่า default สำหรับมือถือ */
}

@media (min-width: 576px) {
  .main-wrapper {
    width: 85%; /* จอ sm ขึ้นไป */
  }
}
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
