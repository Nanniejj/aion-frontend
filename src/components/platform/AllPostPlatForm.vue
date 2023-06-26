<template>
  <div>
    <div class="text-left">
      <span class="h5 mr-3">All Posts</span>
      <div class="d-inline-block">
        <div v-if="startd === endd" class="text-left onedate">
          <i class="far fa-calendar-alt"></i> {{ startd }}
        </div>
        <div v-else class="text-left twodate">
          <i class="far fa-calendar-alt"></i> {{ startd }} - {{ endd }}
        </div>
      </div>
    </div>
    <b-container>
      <!-- <SocialSelect :tabsocial="'post'" /> -->

      <div class="mt-3 mb-3 box-domain">
        <b-row v-if="getNamePlatform" class="mb-1">
          <b-col md="8" lg="8" class="m-auto my-1">
            <h5 class="bold text-lg-left text-md-left txx">{{ getNamePlatform }}</h5>
          </b-col>
          <b-col md="4" lg="4" class="text-lg-right my-1">
            <span id="post-comment">
              <i class="far fa-paper-plane" />

              <b>
                <span v-if="getCountAllPost !== 0">
                  {{ getCountAllPost | numFormat }} </span
                ><span v-else> 0 </span></b
              >
              โพสต์
            </span>
          </b-col>
        </b-row>
        <TabPost :tabs="'PostTab'" :api="'location'" :pageMenu="'domain'" :menu="'platform'" />
      </div>
    </b-container>
  </div>
</template>

<script>
// import SocialSelect from "@/components/domain/SocialSelect.vue";
import TabPost from "@/components/profile/TabPost.vue";
import { mapGetters } from "vuex";
import moment from "moment";

// import TopPostCrad from "@/components/domain/TopPostCrad.vue";
export default {
  watch: {
    getCountAllPost: function (newVal, oldVal) {
      // watch it
      console.log("Prop date: ", newVal, " | was: ", oldVal);
    },
    getArrDate: function () {
      this.startd = this.getSdateDm.slice(0, 10);
      this.endd = this.getEdateDm.slice(0, 10);
    },
  },
  computed: {
    ...mapGetters([
      "getClickDomain",
      "getCountAllPost",
      "getSdateDm",
      "getEdateDm",
      "getArrDate",
      "getNamePlatform"
    ]),
  },
  components: { TabPost}, //TopPostCrad
  data() {
    return {
      startd: "",
      endd: "",
    };
  },
  created() {
    this.startd = moment(new Date()).format().slice(0,10);
    this.endd = moment(new Date()).format().slice(0,10);
     this.$store.commit('setSocialPlatform',this.getNamePlatform)
  },
};
</script>

<style scoped>
.txx{
    text-transform:capitalize;
}
.box-domain {
  overflow-x: hidden;
  height: 100vh;
  width: 95%;
  margin: auto;
  overflow-y: auto;
  padding: 20px 20px;
}
@media (max-width: 900px) {
  .container {
    padding-right: 0px !important;
    padding-left: 0px !important;
  }
  .box-domain {
    width: 100%;
    margin: auto;
    overflow-y: auto;
    padding: 5px 5px;
  }
}
</style>