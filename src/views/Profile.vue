<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />

    <!-- <vue-element-loading :active="getLoadStatus" :is-full-screen="true" size='80' 
    background-color='rgba(0, 0, 0, 0.3)' color='#fff' spinner="bar-fade-scale" /> -->
    <div id="content">
      <h1 class="title">Profile</h1>
      <h4 class="title-monitor">
        <span @click="$router.go(-1)" style="cursor: pointer"
          >{{ getToLinkProfile }}
        </span>
        <i class="fas fa-angle-right" /><span id="active">Profile </span>
      </h4>
      <b-container>
        <b-row>
          <b-col md="12" lg="4">
            <!-- <ProfliePost/> -->
            <ProflieInfo />
          </b-col>
          <b-col md="12" lg="8">
            <section
              id="date-picker"
              class="
                d-block
                position-relative
                align-bottom
                text-right
                mt-sm-3 mt-md-3 mt-lg-0 mt-3
              "
            >
              <date-picker
                v-model="valueDate"
                type="date"
                range
                placeholder="เลือกช่วงเวลา"
                size="sm"
                :disabled-date="(date) => date >= new Date()"
                value-type="format"
                format="YYYY-MM-DD"
                @change="checkDateRange"
                id="date-domain"
                >{{ valueDate }}</date-picker
              >
            </section>
            <ProflieTab />
            <!-- <GetRelationList/>  -->
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
//import Post from '@/components/dashboard/Post.vue';
//import GetRelationList from '@/components/getrelation/GetRelationList.vue';
import ProflieTab from "@/components/profile/ProfileTab.vue";
import ProflieInfo from "@/components/profile/ProfileInfo.vue";
import HomeNav from "@/components/HomeNav.vue";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  components: {
    HomeNav,
    ProflieInfo,
    ProflieTab,
  },
  data() {
    return {
      valueDate: "",
      start_date: "",
      end_date: "",
    };
  },
  computed: {
    ...mapGetters(["getProfileMonitor", "getProfileData", "getLoadStatus","getToLinkProfile","getValSource","getTabName"]),
  },
  methods: {
    checkDateRange() {
      const startDate = moment(this.valueDate[0]);
      const endDate = moment(this.valueDate[1]);

      const diffDays = endDate.diff(startDate, 'days');

      if (diffDays > 31) {
        alert('กรุณาเลือกช่วงเวลาที่ไม่เกิน 1 เดือน หรือ 31 วัน');
        this.valueDate[1] = startDate.add(31, 'days').format('YYYY-MM-DD');
      }else{
        this.selectData(); // Call your existing method
      }
    },
    back(){
      if (this.getToLinkProfile=="Monitor") {
        this.$router.push({name:'Monitor'})
      }else{
        this.$router.push({name:'Influencertop'})
      }
    },
    selectData() {
      //console.log(this.valueDate[0], this.valueDate[1]);
      if (this.valueDate[0] == null) {
        this.start_date = "";
        this.end_date = "";
        //  this.start_date = moment(new Date()).format().slice(0,10) + "T00:00:00";
        //  this.end_date = moment(new Date()).format().slice(0,10) + "T23:59:59";
      } else {
        this.start_date = this.valueDate[0] + "T00:00:00";
        this.end_date = this.valueDate[1] + "T23:59:59";
      }

      this.$store.commit("setSDateProfile", this.start_date);
      this.$store.commit("setEDateProfile", this.end_date);
      this.$store.commit("setArrDateProfile", this.valueDate);

      //wordcloud
      // this.$store.dispatch("fetchWordCloud", {
      //   start_date: this.start_date,
      //   end_date: this.end_date,
      //   domain: this.getClickDomain,
      // });
    },
  },
  
  async created() {
if ( this.$route.name=="Profile") {
          this.$store.commit('setTabName','profile')
          localStorage.setItem("tab", 'profile');
      }else if(this.$route.name=='Hashtag'){
         this.$store.commit('setTabName','hashtag')
          localStorage.setItem("tab", 'hashtag');
        }else{
          this.$store.commit('setTabName','location')
        }
    

    if (this.getToLinkProfile) {
      localStorage.setItem("router", this.getToLinkProfile);
    
    }else{
      this.$store.commit("setToLinkProfile",localStorage.getItem("router"));
    }

     
    this.$store.commit("setTabStatus", true);
    if (localStorage.getItem("tab")== "profile") {
      if (this.getProfileData) {
        localStorage.setItem("acc", this.getProfileData);
        this.$store.dispatch("fetchProfileMonitor", {
          query: this.getProfileData,
          api_type: "account",
          top_type: "domain",
          sort_by: "",
          source: this.getValSource,
        });
        this.$store.dispatch('fetchProfileHash',{query:this.getProfileData,api_type:"account",top_type:"hashtag", sort_by: "",  source: this.getValSource})
      } else {
        console.log("F5", localStorage.getItem("acc"));
        this.$store.commit("setProfileData", localStorage.getItem("acc"));
         this.$store.dispatch("fetchProfileMonitor", {
          query: localStorage.getItem("acc"),
          api_type: "account",
          top_type: "domain",
          sort_by: "",
          source: this.getValSource,
        });
         this.$store.dispatch('fetchProfileHash',{query:localStorage.getItem("acc"),api_type:"account",top_type:"hashtag", sort_by: "",  source: this.getValSource,})
      }
  // this.$store.commit('setTabStatus',false)
  // await this.$store.dispatch('fetchProfileHash',{query:this.getProfileData,api_type:"account",top_type:"hashtag", sort_by: "",})

    } else {
      if (this.getHashtagData) {
        var hashtag = this.getHashtagData.replace("#", "");
        localStorage.setItem("hash", hashtag);
        this.$store.dispatch("fetchProfileMonitor", {
          query: hashtag,
          api_type: "hashtag",
          top_type: "domain",
          sort_by: "",
          source: this.getValSource,
        });
        this.$store.commit("setCnt2", this.getCnt);
      } else {
        this.$store.commit("setHashtagData", localStorage.getItem("hash"));
        this.$store.dispatch("fetchProfileMonitor", {
          query: localStorage.getItem("hash"),
          api_type: "hashtag",
          top_type: "domain",
          sort_by: "",
          source: this.getValSource,
        });
        console.log("getCnt", this.getCnt);
        this.$store.commit("setCnt2", this.getCnt);
      }
    }
    
  },
 
    
  
};
</script>

<style scoped>
#active {
  /* text-decoration: underline; */
  font-weight: 800;
  margin-left: 10px;
}
.title-monitor a {
  cursor: pointer;
  color: #2c3e50;
}
.title-monitor {
  text-align: start;
  margin-left: 9%;
  margin-bottom: 20px !important;
}
.title {
  margin-left: 9%;
}

#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
}
/* @media (max-width: 1200px){
.col-lg-8 {
    flex: 0 0 100%;
    max-width: 100%;
}
.col-lg-4 {
   flex: 0 0 100%;
    max-width: 100%;
}
} */
@media (min-width: 1200px) {
  .container,
  .container-lg,
  .container-md,
  .container-sm,
  .container-xl {
    max-width: 90%;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .title {
    display: none;
  }
}
</style>