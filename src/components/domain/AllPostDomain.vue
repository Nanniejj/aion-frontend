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
      <SocialSelect :tabsocial="'post'" />
      <b-row cols="12" >
        <b-col sm>
          <b-form-input
            id="filter-input"
            v-model="keyword"
            type="search"
            placeholder="ค้นหา keyword"
          ></b-form-input>
        </b-col>
        <b-col cols="auto" class="mt-2 mt-lg-0 mt-md-0">
          <b-button
            @click="submitform"
            id="btn-submit"
            variant=""
            class="text-sm-right"
          >
            ค้นหา
          </b-button>
        </b-col>
      </b-row>
      <div class="mt-3 mb-3 box-domain">
        <b-row v-if="getClickDomain" class="mb-1">
          <b-col md="8" lg="8" class="m-auto my-1">
            <h5 class="bold text-lg-left text-md-left">{{ getClickDomain }}</h5>
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
        <TabPost :tabs="'PostTab'" :api="'location'" :pageMenu="'domain'" :domainKeyword="findKeyword" />
      </div>
    </b-container>
  </div>
</template>

<script>
import SocialSelect from "@/components/domain/SocialSelect.vue";
import TabPost from "@/components/profile/TabPost.vue";
import { mapGetters } from "vuex";
import moment from "moment";

// import TopPostCrad from "@/components/domain/TopPostCrad.vue";
export default {
  watch: {
    getCountAllPost: function(newVal, oldVal) {
      // watch it
      console.log("Prop date: ", newVal, " | was: ", oldVal);
    },
    getArrDate: function() {
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
      "getShowSubDomainRanking",
    ]),
  },
  components: { TabPost, SocialSelect }, //TopPostCrad
  data() {
    return {
      keyword: "",
      startd: "",
      endd: "",
      findKeyword: "",
    };
  },
  methods: {
    submitform() {
      this.findKeyword = this.keyword 
      // this.$emitter.emit("domainKeyword2",this.keyword );
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
  destroyed() {
    this.$stroe.commit('setClickDomain','')
  },
};
</script>

<style scoped>
  .btn-secondary:hover{
  background-color:#fed16e;
  border-color: #fed16e;
  color:black ;
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
