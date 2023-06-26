<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
    <div id="content" v-if="getToSection=='toAion'">
      <h1 class="title">Monitor</h1>
      <!-- <h4 class="title-monitor" ><a>Monitor</a></h4> -->
     <TabMonitor/>
     <!-- <ProfileMonitor/> -->
    </div>
  </div>
</template>

<script>
import HomeNav from '@/components/HomeNav.vue';
// import ProfileMonitor from '@/components/monitor/ProfileMonitor.vue';
import TabMonitor from '@/components/monitor/TabMonitor.vue';
import { mapGetters } from 'vuex';
export default {
  components: {
    HomeNav,TabMonitor //ProfileMonitor
    
  },
  data: function() {
    return {};
  },
  computed: {
    ...mapGetters(['getLoadStatus',"getSocialMo","getToSection"]),
  },
  methods: { 
  
},
 
};
</script>

<style scoped>
.title-monitor{
    text-align: start;
    margin-left: 9%;
    margin-bottom: 20px !important;
}
.imgsocial {
    width:40px;
}
* {
  font-family: 'Prompt', 'FontAwesome', sans-serif;
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
@media only screen and (min-width: 0px) and (max-width: 600px) {
}
</style>
