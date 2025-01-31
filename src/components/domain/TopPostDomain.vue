<template>
  <div>
    <b-row>
      <b-col sm>
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
      </b-col>
      <b-col>
        <div class="text-md-right mt-3 mr-4" v-if="$route.name == 'Dashboard'">
          <b-form-radio-group
            @change="selectData()"
            v-model="selected"
            :options="options"
            class="mb-3 d-inline mi"
            value-field="item"
            text-field="name"
            disabled-field="notEnabled"
          ></b-form-radio-group>
        </div>
      </b-col>
    </b-row>
    <div class="mt-lg-3 mt-md-0 mb-3 mt-sm-0">
      <vue-element-loading
        :active="getLoadTopPost"
        size="80"
        background-color="rgba(255, 255, 255, 0.5)"
        color="#b6ac9a"
      />
      <b-container>
        <TopPostCrad :tpyeCard="'topPost'" :typeStm="typeStm"/>
      </b-container>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TopPostCrad from "@/components/domain/TopPostCrad.vue";
import moment from "moment";
export default {
  props: {
    typeStm: { type: String },
  },
  watch: {
    getArrDate: function() {
      this.startd = this.getSdateDm.slice(0, 10);
      this.endd = this.getEdateDm.slice(0, 10);
    },
  },
  components: {
    TopPostCrad,
  },
  computed: {
    ...mapGetters([
      "getLoadTopPost",
      "getSdateDm",
      "getEdateDm",
      "getArrDate",
      "getNamePlatform",
      "getDomainArr",
    ]),
  },
  data() {
    return {
      startd: "",
      endd: "",
      sdate: "",
      edate: "",
      start_date: "",
      end_date: "",
      selected: "",
      options: [
        { item: true, name: "วันที่ระบบเก็บโพสต์" },
        { item: "", name: "วันที่โพสต์" },
      ],
    };
  },
  methods: {
    selectData() {
      this.$emitter.emit("crawdash", this.selected);
      let objtop;
      if (this.startd) {
        this.start_date =
          moment(new Date())
            .format()
            .slice(0, 10) + "T00:00:00";
        this.end_date =
          moment(new Date())
            .format()
            .slice(0, 10) + "T23:59:59";
      } else {
        this.start_date = this.startd + "T00:00:00";
        this.end_date = this.endd + "T23:59:59";
      }
      if (this.selected) {
        objtop = {
          start_date: this.start_date,
          end_date: this.end_date,
          sort_by: "engagement",
          offset: 0,
          source: this.getNamePlatform,
          domain: 'All',
          dashboard: true,
        };
      } else {
        objtop = {
          start_date: this.start_date,
          end_date: this.end_date,
          sort_by: "engagement",
          offset: 0,
          source: this.getNamePlatform,
          domain: 'All',
        };
      }
      if (this.$route.name!=='Domain') {
        this.$store.dispatch("fetchAllPostPlatform", objtop);
      }else{
        this.$store.dispatch("fetchPostDomain", objtop);
      }

      // this.$emitter.emit("clickSelect", this.selected);
    },
  },
  created() {
    this.startd = moment(new Date())
      .format()
      .slice(0, 10);
    this.endd = moment(new Date())
      .format()
      .slice(0, 10);
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
