<template>
  <div class="ml-lg-5 mr-lg-5 ml-md-3 mr-md-3 ml-sm-3 mr-sm-3">
    <b-col class="prt h3 text-left">Domain List</b-col>
    <b-col class="text-left mb-2 text-secondary">
        ทั้งหมด {{  totalCount || 0 | numFormat }} เรื่อง
    </b-col>
    <b-row cols="2" cols-sm="2" cols-md="3" cols-lg="4" class="m-auto">
      <!-- <LinkMain />
      <LinkMain2 /> -->
      <!-- <b-col v-for="(domain, k) in getListDomain" :key="k"> -->
        <vue-element-loading v-if="loading" style="top: 50%; left: 50%;" :active="true" size="50" background-color="rgba(255, 255, 255, 0.1)"
        spinner="line-scale" color="#b6ac9a" />
      <b-col v-else v-for="(domain, k) in domainList" :key="k">
        <span id="box-domain" class="mt-3 mb-3 h5" @click="toDomainStat(domain)">
          <vue-element-loading :active="getLoadStatus" size="80" background-color="rgba(255, 255, 255, 0.8)"
            color="#b6ac9a" />
          <span class="truncate-text-1">{{ domain.name }}</span>
        </span>
      </b-col>
      <b-col>
        <span id="box-domain" class="mt-3 mb-3" @click="toTemplate"><i class="fas fa-plus fa-2x"></i></span>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import VueElementLoading from "vue-element-loading";
import LinkMain from "@/components/timeline/LinkMain.vue";
import LinkMain2 from "@/components/timeline/LinkMain2.vue";
export default {
  components: {
    VueElementLoading,
    LinkMain,
    LinkMain2
    },
    props: {
        hasSearched: {
            type: Boolean,
            default : false
        },
        search: {
            type: String,
            default: ''
        }
    },
  data() {
      return {
        domainList: [],
        totalCount: 0,
        loading: false
    };
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
    toDomainStat(domain) {
      localStorage.setItem("updated_until", domain.updated_until)
      this.$store.commit("setPushDomainStat", true)
      this.$store.commit("setClickDomain", domain.name)
      this.$store.commit("setClickDomainId", domain.id)
      },
    async apiGetDomains() {
        this.loading = true;
        // console.log('apiMonitorList ===',this.currentPage);
        
        const config = {
            method: "get",
            url: "https://api2.cognizata.com/api/v2/domain/getDomainlist",
            params: {
                name: this.search
            },
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
        };

        this.axios(config)
        .then((response) => {
            const resData = response.data;
            this.domainList = resData.data || [];
            // this.totalRows = resData.pagination?.totalCount || this.data.length;
            this.totalCount = resData.totalCount || this.domainList.length;
            this.loading = false;
            this.$emit('updated')
            
        })
        .catch((error) => {
            this.loading = false;
            this.domainList = [];
            console.error(error);
        });
    },
  },
  created() {
    // if (this.getListDomain) {
    //   this.$store.dispatch("fetchListDomain");
    // }

    },
    mounted() {
        this.apiGetDomains()
    },
    watch: {
        hasSearched: {
            handler(newVal) {
                if (newVal === true) {
                    this.apiGetDomains();
                }
            },
        }
    }
};
</script>
<style scoped>
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