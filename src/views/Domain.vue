<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
    <div id="content" v-if="getToSection=='toAion'">
      <!-- <Map/> -->
      <b-row v-if="!getPushDomainStat">
        <b-col> <h1 class="title">Domain</h1></b-col>
        <b-col><i class="fas fa-print fa-2x" @click="printWindow()"></i></b-col>
      </b-row>
      <DomainList v-if="!getPushDomainStat" />
      <DomainMain v-if="getPushDomainStat" />
    </div>
  </div>
</template>
<script>
import HomeNav from "@/components/HomeNav.vue";
import DomainList from "@/components/domain/DomainList.vue";
import DomainMain from "@/components/domain/DomainMain.vue";
// import Map from "@/components/map/Map.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    HomeNav,
    DomainList,
    DomainMain,
    // Map
  },

  computed: {
    ...mapGetters([
      "getSelected",
      "getSentimentChart",
      "getWordCloud",
      "getDomain",
      "getLoadStatus",
      "getPushDomainStat",
      "getToSection"
    ]),
  },
  methods: {
    printWindow: function () {
      try {
        window.print();
      } catch (err) {
        console.log(err);
      }
    },
    
  },
  created(){
    this.$store.dispatch('fetchListIssue')
  }


};
</script>

<style scoped>
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
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .fa-print {
    font-size: 25px;
  }
}
</style>
