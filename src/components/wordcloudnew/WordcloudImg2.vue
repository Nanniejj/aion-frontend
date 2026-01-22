<template>
  <div class="px-1 px-lg-5">

    <div class="text-left">
      <span class="h5 mr-3 d-inline-block">Wordcloud / Hashtagcloud</span>
      <div class="d-inline-block">
        <div v-if="startd === endd" class="text-left onedate">
          <i class="far fa-calendar-alt"></i> {{ startd }}
        </div>
        <div v-else class="text-left twodate">
          <i class="far fa-calendar-alt"></i> {{ startd }} - {{ endd }}
        </div>
      </div>
    </div>
    <div class="mt-3 mb-3 box-domain">
      <vue-element-loading :active="getLoadWordCloud" size="80" background-color="rgba(255, 255, 255, 0.5)"
        color="#b6ac9a" />
      <b-row class="w-100">
        <b-col class="text-left" lg="12">
          <div class="card-tt">Wordcloud</div>
          <!-- <div class="font-weight-normal m-3" v-if="!getWordCloudImg">
            ไม่พบข้อมูล
          </div> -->
          <!-- <img v-else :src="myImage" id="img-tab" style="width: 100%" class="p-2 mb-3"  /> -->
          <WordCloudD3 :default-domain-id="1" :default-start="'2026-01-12T00:00:00'"
            :default-end="'2026-01-12T23:59:59'" :limit="50" :min-font="20" :max-font="150" :disableRotate="false"
            font-family='"TH Sarabun New' :font-weight="700" @select="onSelectWord" @loaded="onLoaded" />
        </b-col>
        <!-- <b-col class="text-left" lg="6">
          <div class="card-tt">Hashtagcloud</div>
          <WordCloudD3 :token="token" default-domain-id="1" :limit="50" default-start="2026-01-12T00:00:00"
            default-end="2026-01-12T23:59:59" data-type="hashtags" />
         
        </b-col> -->
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import WordCloudD3 from "./WordCloudD3.vue";

export default {
  components: { WordCloudD3 },
  watch: {
    getArrDate: function () {
      this.startd = this.getSdateDm.slice(0, 10);
      this.endd = this.getEdateDm.slice(0, 10);
    },
  },
  computed: {
    ...mapGetters([
      "getClickDomain",
      "getWordCloudImg",
      "getWordCloudHash",
      "getLoadWordCloud",
      "getSdateDm",
      "getEdateDm",
      "getArrDate",
      "getClickDomainId"
    ]),
    myImage() {
      if (this.getWordCloudImg) {
        return (
          `data:image/jpeg;base64,` +
          this.getWordCloudImg.substring(2).replace("'", "")
        );
      } else {
        return "";
      }
    },
    myImagehash() {
      if (this.getWordCloudHash) {
        return (
          `data:image/jpeg;base64,` +
          this.getWordCloudHash.substring(2).replace("'", "")
        );
      } else {
        return "";
      }
    },
  },
  data() {
    return {
      startd: "",
      endd: "",
      sdate: "",
      edate: "",
    };
  },
  mounted() {
    this.startd = moment(new Date()).format().slice(0, 10);
    this.endd = moment(new Date()).format().slice(0, 10);
    this.sdate = moment(new Date()).format().slice(0, 10) + "T00:00:00";
    this.edate = moment(new Date()).format().slice(0, 10) + "T23:59:59";
    // this.$store.dispatch("fetchWordCloud", {
    //   start_date: this.sdate,
    //   end_date: this.edate,
    //   //   domain: this.getClickDomain || 'all',
    //   // domain_ids:this.getClickDomainId,

    //   //   monitor: this.selected
    // });
  },
  destroyed() {
    this.$store.commit("setWordCloudImg", "");
    this.$store.commit("setWordCloudHash", "");
  },
};
</script>

<style scoped>
.card-tt {
  width: fit-content;
  padding: 3px 15px;
  border-radius: 7px;
  box-shadow: 0 3px 4px 0 rgb(0 0 0 / 20%);
  background: #fbf7f6;
}

.box-domain {
  width: 100%;
  height: auto;
  padding: 20px 0px;
  border-radius: 7px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

@media only screen and (min-width: 0px) and (max-width: 991px) {}
</style>