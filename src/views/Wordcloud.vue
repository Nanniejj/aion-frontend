<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
    <div v-if="getToSection=='toAion'">
    <WordCloudMenu></WordCloudMenu>
    </div>
    <!-- <WordCloudMain v-show="getSelected"></WordCloudMain> -->
    <!-- {{ getSentimentHashtag }} dhfg -->
  </div>
</template>

<script>
import HomeNav from "@/components/HomeNav.vue";
import WordCloudMenu from "@/components/wordcloud/WordCloudMenu.vue";
// import WordCloudMain from "@/components/wordcloud/WordCloudMain.vue";
import { mapGetters } from "vuex";
// import VueElementLoading from "vue-element-loading";

export default {
  // props:{
  //   querySearch:{
  //     type:String,
  //   }
  // },
  components: {
    HomeNav,
    WordCloudMenu,
    //WordCloudMain,
    
  },
  data: function () {
    return {};
  },
  computed: {
    ...mapGetters([
      "getSelected",
      "getSentimentChart",
      "getWordCloud",
      "getDomain",
      "getLoadStatus",
        "getToSection"
    ]),
  },
 async mounted() {
 let domain= localStorage.getItem("domainArr");
    // this.domainData = domainName;
    this.$store.commit("setDomainArr", domain);
  }
};
</script>

<style scoped>
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
/* .spinner-border {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  width: 150px;
  height: 150px;
  margin: -75px 0 0 -75px;
  width: 120px;
  height: 120px;
  pointer-events: none;
  overflow: hidden;
} */
/*  */

.text {
  background-color: #ede7dd;
  width: 550px;
  height: 30pt;
  border-radius: 3pt;
  margin: auto;
}
.domain {
  margin-top: 20pt;
  margin-left: -31rem;
  margin-bottom: 10pt;
}

.form-control {
  margin: auto;
}

.date {
  margin-top: 20pt;
  margin-left: 39.3rem;
  margin-bottom: 10pt;
}

.dropdown-toggle {
  color: #4c412b;
  background-color: #ede7dd;
  border-color: transparent;
}

.dropdown-toggle::after {
  margin-left: 7em;
}
.btn-primary:not(:disabled):not(.disabled).active,
.btn-primary:not(:disabled):not(.disabled):active,
.show > .btn-primary.dropdown-toggle {
  color: #4c412b;
  background-color: #ede7dd;
  border-color: transparent;
}

.show > .btn-primary.dropdown-toggle:focus {
  box-shadow: none !important;
}

.btn-primary:focus {
  box-shadow: none !important;
}

.submit {
  width: 70%;
  background-color: white;
  color: gray;
  border-color: #fed16e !important;
  border-radius: 9px;
  font-weight: bold;
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
