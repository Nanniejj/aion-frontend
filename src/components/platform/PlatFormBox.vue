<template>
  <div class="ml-lg-5 mr-lg-5 ml-md-3 mr-md-3 ml-sm-3 mr-sm-3">
    <div class="prt h3">Domain List</div>
    <b-container>
       <router-link to="/dashboard">fgfff</router-link>
        <b-row>
          <Summary />
        </b-row>
    <!-- <b-row cols="2" cols-sm="2" cols-md="3" cols-lg="3" class="m-auto">
      <b-col>
        <span
          id="box-domain"
          class="mt-3 mb-3 h5 hfb"
          @click="toDomainStat(domain.name)"
        >
          <vue-element-loading
            :active="getLoadStatus"
            size="80"
            background-color="rgba(255, 255, 255, 0.8)"
            color="#fbf7f6"
          />
          <img src="@/assets/Facebook.png" class="socialogo" />
          <div class="mt-2">Facebook</div>
        </span>
      </b-col>

      <b-col>
        <span
          id="box-domain"
          class="mt-3 mb-3 h5 htw"
          @click="toDomainStat(domain.name)"
        >
          <vue-element-loading
            :active="getLoadStatus"
            size="80"
            background-color="rgba(255, 255, 255, 0.8)"
            color="#fbf7f6"
          />
          <img src="@/assets/Twitter.png" class="socialogo" />
          <div class="mt-2">Twitter</div>
        </span>
      </b-col>

       <b-col>
        <span
          id="box-domain"
          class="mt-3 mb-3 h5 hpt"
          @click="toDomainStat(domain.name)"
        >
          <img src="@/assets/Pantip.png" class="socialogo" />
          <div class="mt-2">Pantip</div>
        </span>
      </b-col>

       <b-col>
        <span
          id="box-domain"
          class="mt-3 mb-3 h5 hyt"
          @click="toDomainStat(domain.name)"
        >
          <img src="@/assets/Youtube.png" class="socialogo" />
          <div class="mt-2">Youtube</div>
        </span>
      </b-col>

      <b-col>
        <span
          id="box-domain"
          class="mt-3 mb-3 h5 hn"
          @click="toDomainStat(domain.name)"
        >
          <img src="@/assets/News.png" class="socialogo" />
          <div class="mt-2">News</div>
        </span>
      </b-col>

      <b-col>
        <span
          id="box-domain"
          class="mt-3 mb-3 h5 hig"
          @click="toDomainStat(domain.name)"
        >
          <img src="@/assets/Instagram.png" class="socialogo" />
          <div class="mt-2">Instagram</div>
        </span>
      </b-col>
    </b-row> -->
    </b-container>
  </div>
</template>

<script>
import Summary from "@/components/dashboard/Summary.vue";
import moment from "moment";
export default {
    data() {
        return {
            start_date:"",
            end_date:""
        }
    },
    components:{
        Summary
    },
    created(){
          let today= moment(new Date()).format().slice(0,10);
          this.start_date = today+"T00:00:00"
          this.end_date =  today+"T23:59:59"
           this.$store.dispatch("fetchAllstats",{start_date:this.start_date,end_date:this.end_date});
    }

};
</script>

<style scoped >
.socialogo {
  width: 70px;
  margin: 2px;
}
#box-domain {
  width: 100%;
  height: 200px;
  padding: 50px 0px;
  border-radius: 7px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
 display: block;
 align-items: center;
  justify-content: center;
}
#box-domain.hfb:hover {
  background: #4867aa26;
  cursor: pointer;
}
#box-domain.htw:hover {
  background: #55adec21;
  cursor: pointer;
}
#box-domain.hpt:hover {
  background: #5229812e;
  cursor: pointer;
}
#box-domain.hyt:hover {
  background: #ff000021;
  cursor: pointer;
}#box-domain.hn:hover {
  background: #fed16e47;
  cursor: pointer;
}
#box-domain.hig:hover {
  background: #ee7f3b36;
  cursor: pointer;
}

@media only screen and (min-width: 0px) and (max-width: 600px) {
    .socialogo {
  width: 50px;
  margin: 2px;
}
  #box-domain {
    height: 120px;
    margin: auto;
    font-size: medium;
    padding: 10px;
    
  }
}
</style>