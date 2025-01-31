<template>
  <div class="mt-4">
    <b-row >
      <b-col lg="12" class="text-left" >
        <div>
          <span class="h5 mr-3">Post</span>
          <span id="domain-tag" class="txx"><span v-if="getNamePlatform=='twitter'"> X </span>  <span v-else-if="getNamePlatform == 'pantip'"> board </span>
          <span v-else>{{ getNamePlatform }} </span></span>
        </div>
        <!-- <SocialSelect :tabsocial="'graph'" /> -->
        <LineChart />
      </b-col>
      <b-col lg="12">
        <div class="h5 text-left "><span class="d-inline-block mr-3">Sentiment</span>
        <div class="d-inline-block">
        <div v-if="startd === endd" class="text-left onedate">
          <i class="far fa-calendar-alt"></i> {{ startd }}
        </div>
        <div v-else class="text-left twodate">
          <i class="far fa-calendar-alt"></i> {{ startd }} - {{ endd }}
        </div>
      </div>
        </div>
         <span class="mt-3 mb-3 box-domain">
              <vue-element-loading
        :active="getLoadStatus"
        size="80"
        background-color="rgba(255, 255, 255, 0.3)"
        color="#b6ac9a"
      />
          <SentimentPlatForm />
         </span>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
//import SocialSelect from "@/components/domain/SocialSelect.vue";
import LineChart from "@/components/chart/LineChartPlatForm.vue";
import SentimentPlatForm from "@/components/platform/SentimentPlatForm.vue";
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
    SentimentPlatForm
  },
  computed: {
    ...mapGetters(["getClickDomain","getSdateDm", "getEdateDm","getArrDate","getNamePlatform","getLoadStatus"]),
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
.txx{
    text-transform:capitalize !important;
}
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
#domain-tag {
  padding: 2px 10px;
  border-radius: 10px;
  background: #fed16e;
  box-shadow: 2px 2px 4px 0 rgb(0 0 0 / 20%);
  /* font-weight: 600; */
}
@media only screen and (min-width: 0px) and (max-width: 700px) {
.box-domain {
  font-size: smaller;
}
}
</style>