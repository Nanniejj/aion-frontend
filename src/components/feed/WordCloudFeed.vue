<template>
  <div>
    <b-card id="box-profile">
      <vue-element-loading
        :active="getLoadFeedWC"
        size="80"
        background-color="rgba(255, 255, 255, 0.3)"
        color="#b6ac9a"
      />
      <span class="h5 font-weight-bold">HashtagCloud</span>
      <hr class="mb-3" />
      <span v-if="getWordCloud && getWordCloud.img && getWordCloud.img.hashtag">
        <div
          class="font-weight-normal"
          v-if="this.getWordCloud.img.hashtag == ''"
        >
          ไม่พบข้อมูล
        </div>
        <img v-else :src="myImage2" id="img-tab" />
      </span>
    </b-card>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      start: "",
      end: "",
    };
  },
  computed: {
    ...mapGetters(["getWordCloud", "getStatusFeed", "getLoadFeedWC"]),
    myImage2() {
      return (
        `data:image/jpeg;base64,` +
        this.getWordCloud.img.hashtag.substring(2).replace("'", "")
      );
    },
  },
  mounted() {
    // const arrdomain = localStorage.getItem("domainArr");
    this.start =
      moment(new Date())
        .format()
        .slice(0, 10) + "T00:00:00";
    this.end =
      moment(new Date())
        .format()
        .slice(0, 10) + "T23:59:59";
    // let arr2 = localStorage.getItem("domainArr");
    this.$store.dispatch("fetchWordCloud", {
      monitor: true,
      start_date: this.start,
      end_date: this.end,
      dashboard: this.getStatusFeed,
    });
  },
};
</script>

<style scoped>
#img-tab {
  width: 76%;
}
.card-body {
  min-height: 32rem;
  /* max-height: 32rem; */
}
#box-profile {
  display: block;
  padding-bottom: 0px;
  border-radius: 7px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
@media only screen and (min-width: 0px) and (max-width: 1395px) {
  #img-tab {
    width: 100%;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .card-body {
    min-height: auto !important;
  }
}
</style>
