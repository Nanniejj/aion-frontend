<template>
  <div id="app-words" >
    <div v-if="getWordCloud.img.hashtag">
      <img
        :src="myImage2"
        class="tab-pane active"
        id="img-tab"
        style="background-color: white;padding-bottom: 49px;"
      />
      <b-container>
        <WordCloudChartHashtag :linkhash="checklink" />
      </b-container>
    </div>
    <div v-if="getWordCloud.img.hashtag == ''" class="md-font">
      <b-card>
        <div class="mt-3">ไม่พบข้อมูล</div>
      </b-card>
    </div>
  </div>
  
  <!-- <div>
    <h1>Hashtag</h1>
    <b-container>
    <WordCloudTab />
    </b-container>
  </div>
   -->
  
</template>

<script>
import { mapGetters } from "vuex";
import WordCloudChartHashtag from '@/components/wordcloud/WordCloudChartHashtag.vue';

export default {
   props: {
    checklink: {
      type: Boolean,
    },
  },
  computed: {
    ...mapGetters(["getWordCloud"]),
    myImage2() {
      return (
        `data:image/jpeg;base64,` +
        this.getWordCloud.img.hashtag.substring(2).replace("'", "")
      );
    },
  },
  components: { WordCloudChartHashtag },};
</script>

<style scoped>
#app-words {
  margin-top: 30px;
}
@media (max-width: 900px) {
   #img-tab {
    width: 100%;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
    #app-words {
  margin-top: 20px !important;
}
  .container{
    padding: 0;
  }
  #img-tab {
    width: 100%;
  }
}
</style>
