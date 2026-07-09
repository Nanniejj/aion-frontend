<!-- wordcloud old -->
<template>
  <div class="px-1 px-lg-5">
    <div class="text-left">
      <!-- <span class="h5 mr-3 d-inline-block">Wordcloud / Hashtagcloud</span> -->
      <div class="d-inline-block">
        <div v-if="startd === endd" class="text-left onedate">
          <i class="far fa-calendar-alt"></i> {{ startd }}
        </div>
        <div v-else class="text-left twodate">
          <i class="far fa-calendar-alt"></i> {{ startd }} - {{ endd }}
        </div>
      </div>
    </div>

    <div class="mb-3 box-domain position-relative">
      <vue-element-loading
        :active="getLoadWordCloud"
        size="80"
        background-color="rgba(255,255,255,0.5)"
        color="#b6ac9a"
      />

      <!-- ✅ Mobile: show only one by tab -->
      <div class="d-lg-none w-100 px-2">
        <div v-if="activeTab === 'word'">
          <div class="card-tt">Wordcloud</div>
          <div class="font-weight-normal m-3" v-if="!getWordCloudImg">ไม่พบข้อมูล</div>
          <img v-else :src="myImage" style="width:100%" class="p-2 mb-3" />
        </div>

        <div v-else>
          <div class="card-tt">Hashtagcloud</div>
          <div class="font-weight-normal m-3" v-if="!getWordCloudHash">ไม่พบข้อมูล</div>
          <img v-else :src="myImagehash" style="width:100%" class="p-2 mb-3" />
        </div>
      </div>

      <!-- ✅ Desktop: show both -->
      <b-row class="w-100 d-none d-lg-flex">
        <b-col class="text-left" lg="6">
          <div class="card-tt">Wordcloud</div>
          <div class="font-weight-normal m-3" v-if="!getWordCloudImg">ไม่พบข้อมูล</div>
          <img v-else :src="myImage" style="width:100%" class="p-2 mb-3" />
        </b-col>

        <b-col class="text-left" lg="6">
          <div class="card-tt">Hashtagcloud</div>
          <div class="font-weight-normal m-3" v-if="!getWordCloudHash">ไม่พบข้อมูล</div>
          <img v-else :src="myImagehash" style="width:100%" class="p-2 mb-3" />
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  props: {
    activeTab: { type: String, default: "word" }, // ✅ รับจากแม่
  },
  watch: {
    getArrDate(val) {
      this.startd = val[0];
      this.endd = val[1];
    },
  },
  computed: {
    ...mapGetters([
      "getWordCloudImg",
      "getWordCloudHash",
      "getLoadWordCloud",
      "getArrDate",
      "getClickDomainId",
    ]),
    myImage() {
      return this.getWordCloudImg
        ? `data:image/jpeg;base64,${this.getWordCloudImg.substring(2).replace("'", "")}`
        : "";
    },
    myImagehash() {
      return this.getWordCloudHash
        ? `data:image/jpeg;base64,${this.getWordCloudHash.substring(2).replace("'", "")}`
        : "";
    },
  },
  data() {
    return { startd: "", endd: "", sdate: "", edate: "" };
  },
  mounted() {
    const d = moment(new Date()).format().slice(0, 10);
    this.startd = d;
    this.endd = d;
    this.sdate = d + "T00:00:00";
    this.edate = d + "T23:59:59";

    this.$store.dispatch("fetchWordCloud", {
      start_date: this.sdate,
      end_date: this.edate,
      domain_ids: this.getClickDomainId,
    });
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
</style>
