<template>
  <div>
      <WordCloudMain :cloudApi="true"/>
  </div>
</template>

<script>
import WordCloudMain from "@/components/wordcloud/WordCloudMain.vue";
import { mapGetters } from "vuex";
// import moment from "moment";
export default {
  computed: {
    ...mapGetters(["getLoadDefaultCloud"])
    },
    components:{
        WordCloudMain
    },
    data() {
        return {
            
        }
    },
  // async  created(){

  //       var todays = moment(new Date()).format().slice(0,10) + "T00:00:00";
  //       var todaye = moment(new Date()).format().slice(0,10) + "T23:59:59";

  //      await this.$store.dispatch("fetchWordCloud", {
  //         start_date: todays,
  //         end_date: todaye,
  //         domain: 'all',
  //         monitor: false
  //       });

  //     }

}
</script>

<style scoped>
.velmld-spinner {
    top: 20% !important;
    left: 50%;
    transform: translate(-50%,-50%);
    position: absolute;
    text-align: center;
}

</style>