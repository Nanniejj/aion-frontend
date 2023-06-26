<template>
  <div>
    <div class="text-left">
      <span class="h5 mr-3">Top Posts</span>
      <div class="d-inline-block">
        <div v-if="startd === endd" class="text-left onedate">
          <i class="far fa-calendar-alt"></i> {{ startd }}
        </div>
        <div v-else class="text-left twodate">
          <i class="far fa-calendar-alt"></i> {{ startd }} - {{ endd }}
        </div>
      </div>
    </div>
    <div class="mt-lg-3 mt-md-0 mb-3 mt-sm-0">
      <vue-element-loading
        :active="getLoadTopPost"
        size="80"
        background-color="rgba(255, 255, 255, 0.5)"
        color="#fbf7f6"
      />
      <b-container>
        <TopPostCrad :tpyeCard="'topPost'" />
      </b-container>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TopPostCrad from "@/components/domain/TopPostCrad.vue";
import moment from "moment";
export default {
  watch: {
    getArrDate: function () {
      this.startd = this.getSdateDm.slice(0, 10);
      this.endd = this.getEdateDm.slice(0, 10);
    },
  },
  components: {
    TopPostCrad,
  },
  computed: {
    ...mapGetters(["getLoadTopPost", "getSdateDm", "getEdateDm", "getArrDate"]),
  },
  data() {
    return {
      startd: "",
      endd: "",
      sdate: "",
      edate: "",
    };
  },
  created() {
    this.startd = moment(new Date()).format().slice(0, 10);
    this.endd = moment(new Date()).format().slice(0, 10);
  },
};
</script>

<style scoped>
.box-domain {
  width: 100%;
  height: auto;
  padding: 20px 20px;
  border-radius: 7px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

@media only screen and (min-width: 0px) and (max-width: 760px) {
  .container {
    width: 100%;
    padding-right: 0px !important;
    padding-left: 0px !important;
    margin-right: auto;
    margin-left: auto;
  }
}
</style>