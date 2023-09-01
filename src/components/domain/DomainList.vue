<template >
  <div class="ml-lg-5 mr-lg-5 ml-md-3 mr-md-3 ml-sm-3 mr-sm-3">
    <div class="prt h3">Domain List</div>
    <b-row cols="2" cols-sm="2" cols-md="3" cols-lg="4" class="m-auto">
      <b-col v-for="(domain, k) in getListDomain" :key="k">
        <span id="box-domain" class="mt-3 mb-3 h5" @click="toDomainStat(domain)">
          <vue-element-loading
            :active="getLoadStatus"
            size="80"
            background-color="rgba(255, 255, 255, 0.8)"
            color="#fbf7f6"
          />
          {{ domain.name }}
        </span>
      </b-col>
      <b-col>
        <span id="box-domain" class="mt-3 mb-3" @click="toTemplate"
          ><i class="fas fa-plus fa-2x"></i
        ></span>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import VueElementLoading from "vue-element-loading";
export default {
  components: {
    VueElementLoading,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getListDomain", "getLoadStatus"]),
  },
  methods: {
    toTemplate() {
      this.$router.push({
        name: "TemplateSetting",
      });
    },
    toDomainStat(domain){
      console.log(domain);
      localStorage.setItem("updated_until",domain.updated_until)
      this.$store.commit("setPushDomainStat",true)
      this.$store.commit("setClickDomain",domain.name)
    }
  },
  created() {
    if (this.getListDomain) {
      this.$store.dispatch("fetchListDomain");
    }
    
  },
};
</script>
<style scoped >
#box-domain {
  width: 100%;
  height: 150px;
  padding: 20px 0px;
  border-radius: 7px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
#box-domain:hover {
  background: #fed16e;
  cursor: pointer;
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  #box-domain {
    height: 100px;
    margin: auto;
    font-size: large;
    padding: 2px;
  }
}
</style>