<template>
  <div class="mt-4">
    <b-row>
      <b-col lg="8" class="text-left">
        <div class="mb-sm-4">
          <span class="h5 mr-3">Post</span>
          <span id="domain-tag" class="">{{ getClickDomain }}</span>
        </div>
        <!-- <SocialSelect :tabsocial="'graph'" /> -->
        <LineChart />
      </b-col>
      <b-col lg="4">
        <div class="h5 text-left "><span class="d-inline-block mr-3">Total Post</span>
        <div class="d-inline-block">
        <div v-if="startd === endd" class="text-left onedate">
          <i class="far fa-calendar-alt"></i> {{ startd }}
        </div>
        <div v-else class="text-left twodate">
          <i class="far fa-calendar-alt"></i> {{ startd }} - {{ endd }}
        </div>
      </div>
        </div>
        <BarChart />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
//import SocialSelect from "@/components/domain/SocialSelect.vue";
import LineChart from "@/components/chart/LineChart.vue";
import BarChart from "@/components/chart/BarChart.vue";
import moment from "moment";
export default {
   watch: {
    getArrDate: function () {
      this.startd = this.getSdateDm.slice(0, 10);
      this.endd = this.getEdateDm.slice(0, 10);
    }},
  components: {
    //SocialSelect
    LineChart,
    BarChart,
  },
  computed: {
    ...mapGetters(["getClickDomain","getSdateDm", "getEdateDm","getArrDate"]),
  },
  data() {
    return {
       startd:"",
      endd:"",
    }
  },
  created(){
    this.startd=moment(new Date()).format().slice(0,10);
    this.endd=moment(new Date()).format().slice(0,10);
  }
};
</script>

<style scoped>
#domain-tag {
  padding: 2px 10px;
  border-radius: 10px;
  background: #fed16e;
  box-shadow: 2px 2px 4px 0 rgb(0 0 0 / 20%);
  /* font-weight: 600; */
}
</style>