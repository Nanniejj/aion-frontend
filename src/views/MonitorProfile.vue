<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
    <div id="content">
      <div class="main-wrapper m-sm-auto">
        <h1 class="title m-0">{{ pageTitle }}</h1>

        <nav v-if="type" class="d-flex align-items-center mb-3" aria-label="breadcrumb">
          <b-col
            cols="auto pl-0"
            class="m-0 breadcrumb-link"
            role="button"
            tabindex="0"
            @click="toMonitor('MonitorList')"
            @keyup.enter="toMonitor('MonitorList')"
          >
            Monitor
          </b-col>
          <b-icon icon="chevron-right" />
          <b-col cols="auto" class="m-0 font-weight-bold">{{ pageTitle }}</b-col>
        </nav>

        <ProfileMonitor />
      </div>
    </div>
  </div>
</template>

<script>
import HomeNav from "@/components/HomeNav.vue";
import ProfileMonitor from "@/components/monitorlist/ProfileMonitor.vue";
import { mapGetters } from "vuex";

export default {
  name: "MonitorProfile",
  components: {
    HomeNav,
    ProfileMonitor,
  },
  data() {
    return {
      type: this.$route.query.type,
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
      "getToLinkProfile",
    ]),
    pageTitle() {
      return this.type === "hashtaglist" ? "Hashtag" : "Profile";
    },
  },
  methods: {
    toMonitor(name) {
      this.$router.push({ name });
    },
  },
};
</script>

<style scoped>
* {
  font-family: "Prompt", "FontAwesome", sans-serif;
}

.main-wrapper {
  width: 100%; /* ค่า default สำหรับมือถือ */
}

@media (min-width: 576px) {
  .main-wrapper {
    width: 85%; /* จอ sm ขึ้นไป */
  }
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

.breadcrumb-link {
  cursor: pointer;
}

.title-monitor {
  text-align: start;
  margin-left: 9%;
  margin-bottom: 20px !important;
}

.imgsocial {
  width: 40px;
}

.icon-monitor1,
.icon-monitor2,
.icon-monitor3 {
  cursor: pointer;
  padding: 6px 15px;
  border-radius: 20px;
}

.icon-monitor1:hover .h6,
.icon-monitor2:hover .h6,
.icon-monitor3:hover .h6 {
  color: #4c412b;
  font-weight: bold;
}

.icon-monitor1:hover .b-icon.bi,
.icon-monitor2:hover .b-icon.bi,
.icon-monitor3:hover .b-icon.bi {
  color: #4c412b;
  background-color: #fed06ea4;
  border-radius: 50%;
  transition: 0.3s ease-in-out;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
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