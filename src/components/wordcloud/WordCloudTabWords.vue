<template>
  <div id="app-words">
    <div v-if="getWordCloudImg">
      <img
        :src="myImage"
        class="tab-pane active"
        id="img-tab"
        style="background-color: white; padding-bottom: 49px page-break-after: always"
      />
    <!-- <div v-for="word in getWordCloud.data.wordcloud.data.slice(0, 10)" :key="word">{{word.name}}</div> -->
    <b-container>
      <WordCloudChartWord v-if="getWordCloudWordChart.length!=0" :linkword="checklink" />
    </b-container>
    </div>
    <div v-if="getWordCloudImg == ''" class="md-font">
      <b-card>
        <div class="mt-3">ไม่พบข้อมูล</div>
      </b-card>
    </div>  
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import Cloud from "vue-d3-cloud";
import WordCloudChartWord from "@/components/wordcloud/WordCloudChartWord.vue";

export default {
   props: {
    checklink: {
      type: Boolean,
    },
  },
  data() {
    return {
      imageWord: "",
      imageHashtag: "",
    };
  },
  computed: {
    ...mapGetters(["getWordCloud","getWordCloudWordChart","getWordCloudImg"]),
    myImage() {
      if (this.getWordCloud.img) {
        return (
          `data:image/jpeg;base64,` +
          this.getWordCloudImg.substring(2).replace("'", "")
        );
      } else {
        return "";
      }
    },
  },
  components: {
    // Cloud,
    WordCloudChartWord,
  },
};
</script>

<style scoped>

#app-words {
  margin-top: 30px;
}
#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
}
.containers {
  display: block;
  position: relative;
  margin-bottom: 12px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
@media (max-width: 900px) {
   #img-tab {
    width: 100%;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .container{
    padding: 0;
  }
  #img-tab {
    width: 100%;
  }
    #app-words {
  margin-top: 20px !important;
}
}
@media print {
  .tab-pane .active{
    page-break-inside: avoid;
  }
}
</style>
