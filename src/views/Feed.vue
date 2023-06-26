<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
     <!-- <vue-element-loading :active="getLoadStatus" :is-full-screen="true" size='80' 
      background-color='rgba(0, 0, 0, 0.3)' color='#fff' spinner="bar-fade-scale" /> -->
    <div id="content" v-if="getRoleMion">
      <h1 class="title">Feed</h1>
      <MainFeed />
      <!-- <div v-else>ไม่สามารถเข้าถึงข้อมูลได้</div> -->
    
    </div>
  </div>
</template>

<script>
import HomeNav from '@/components/HomeNavMion.vue';
import MainFeed from '@/components/feed/MainFeed.vue';
import { mapGetters } from 'vuex';
export default {
  components: {
    HomeNav,MainFeed
    
  },
  data: function() {
    return {
    };
  },
  computed: {
    ...mapGetters(['getLoadStatus','getRoleMion']),
  },
  methods: { 
  
},

  created() { 
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
