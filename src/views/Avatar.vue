<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
    
    <div id="content" v-if="getToSection=='toMion'">
      <vue-element-loading
      :active="getLoadStatus"
      size="80"
      background-color="rgba(255, 255, 255, 0.5)"
      color="#b6ac9a"
    />
        <h1 class="title">Avatar</h1>
        <div v-if="getAvatar">

          <AvatarUser v-if="getShowUser"/>
          <div v-if="!getShowUser"><AvatarTeam v-if="getShowManage"/></div>
                  
         <b-container style="margin:30px auto;" v-if="!getShowManage">
           <b-row>
            <b-col>
              <span id="text-table"> Table <i class="fas fa-table"/></span><b-form-checkbox switch size="lg" @change="tab()" class="mi">
              <span id="text-chart"><i class="fas fa-chart-bar"></i> Chart</span></b-form-checkbox>
            </b-col>
             <b-col>
               <section id="date-picker">
              <date-picker v-model="valueDate" type="date" range placeholder="เลือกช่วงเวลา" 
              :disabled-date="(date) => date >= new Date()" value-type="YYYY-MM-DD"  format="DD/MM/YYYY"
              @change="selectData()" >{{valueDate}}</date-picker>
              </section>
             <!-- <section id="date-picker">
              <date-picker v-model="valueDate" value-type="format" format="YYYY-MM-DD" 
              :disabled-date="(date) => date >= new Date()" size='md'   @change="reloadData()"></date-picker>
            </section> -->
          </b-col>
          </b-row>
          <!-- <div>{{selected}}</div> -->
  
         </b-container>
        <template v-if="!getShowManage">
          <div>
            <AvatarTop5/>
          
        <AvatarTable v-show="!selectedTab" />
        <AvatarChart v-show="selectedTab"/>
        </div>
        </template>
        
        <br />
       <div 
        class="row justify-content-end"
        style="margin-right: 18%; margin-bottom: 12px"
      >
       <button v-if="!getShowManage" type="button" class="btn btn-default btnp" @click="reloadData()">
          <span id="submit" class="md-font">Reload data</span>
        </button>
        <button type="button" class="btn btn-default btnp" @click="printWindow()">
          <span id="submit" class="md-font">Print</span>
        </button>
      </div><br/>
       </div>
      <!-- <AvatarDate/> -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URL } from '@/common/config';
import HomeNav from '@/components/HomeNavMion.vue';
import { mapGetters } from 'vuex';
import AvatarTop5 from '@/components/avatar/AvatarTop5.vue';
import AvatarTable from '@/components/avatar/AvatarTable.vue';
import AvatarChart from '@/components/avatar/AvatarChart.vue';
import AvatarTeam from '@/components/avatar/AvatarTeam.vue';
import AvatarUser from '@/components/avatar/AvatarUser.vue';
import moment from "moment";

export default {
  components: {
    HomeNav,AvatarTop5,AvatarTable,AvatarChart,AvatarTeam,AvatarUser

  },
  data: function() {
    return {
      start_date:"",
      end_date:" ",
      valueDate:moment(new Date()).format().slice(0,10),
      selectedTab:false,
    };
  },
  methods:{
    printWindow: function() {
      try {
        window.print();
      } catch (err) {
        console.log(err);
      }
    },
    selectData(){
      if(this.valueDate[0]!=null){
        console.log(this.valueDate[0], this.valueDate[1]);
        this.start_date=this.valueDate[0]+"T00:00:00"
        this.end_date=this.valueDate[1]+"T23:59:59"
        this.$store.commit('setRageStartdate',this.start_date)
        this.$store.commit('setRageEnddate',this.end_date)
        //this.$store.dispatch("fetchAllstats",{start_date:this.start_date,end_date:this.end_date});
        this.$store.dispatch("fetchAvatar",{start_date:this.start_date,end_date:this.end_date});}
      else{
        let today= moment(new Date()).format().slice(0,10);
        this.start_date = today+"T00:00:00"
        this.end_date =  today+"T23:59:59"
        this.$store.dispatch("fetchAvatar",{start_date:this.start_date,end_date:this.end_date});
      }
    },
tab(){
      if(this.selectedTab){
          this.selectedTab = false
          document.getElementById("text-table").style.backgroundColor = "rgba(122, 158, 201, 0.452)";
          document.getElementById("text-chart").style.backgroundColor = "#fff0";
          document.getElementById("scroll").style.display = "block";
          console.log('log1');  
          }
      else{
          this.selectedTab = true
          document.getElementById("text-chart").style.backgroundColor = "rgba(122, 158, 201, 0.452)";
          document.getElementById("text-table").style.backgroundColor = "#fff0";
          document.getElementById("scroll").style.display = "none";
      }   
    },
    exportscsv: function () {
  
      var token='1e1fb0d554057e4b6e8cbd8a73954291627ae5a3';
      const AuthStr = "Token " + token;
      var data = JSON.stringify({
        date: this.valueDate,
        data_json: JSON.stringify({ department: this.getAvatar }),
      });

      var config = {
        method: "post",
        url:API_URL+"/v1/download/avatar/csv/",
        headers: {
          Authorization: AuthStr,
          "Content-Type": "application/json",
        },
        responseType: "blob",
        data: data,
      };

      axios(config)
        .then(function (response) {
          //console.log(response)
          let today = new Date();
          let blob = new Blob([response.data], {
            type: "application/force-download",
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download =
            "avatar_twitter_" +
            today.toDateString().split(" ").join("_") +
            ".xlsx";
          link.click();
        })
        .catch(function (error) {
          console.log(error);
        });
        },
 exportcsv: function () {
  this.$store.dispatch("fetchCsvAvatar",{date:this.valueDate,data_json:this.getAvatar});    
    },
    reloadData() {
        this.$store.dispatch("fetchAvatar",{start_date:  this.start_date,end_date:this.end_date}); 

    }
  },
  computed: {
    ...mapGetters(['getSelected','getAvatar',"getLoadStatus","getShowManage","getShowUser","getToSection"]),
  },
  created() {
     let today= moment(new Date()).format().slice(0,10);
        this.start_date = today+"T00:00:00"
        this.$store.commit('setRageStartdate',this.start_date)
        this.end_date =  today+"T23:59:59"
        this.$store.commit('setRageEnddate',this.end_date)
        this.$store.dispatch("fetchAvatar",{start_date:  this.start_date,end_date:this.end_date});
  //this.$store.dispatch("fetchAvatar",{date:this.valueDate});    
  },
};
</script>

<style scoped>
#text-chart{
  font-size: 1.25rem;
  color: #4c412b;
  background: transparent;;
    padding-left: 5px;
    padding-right: 5px;
    border-radius: 6px;

}
#text-table{
  font-size: 1.25rem;
    min-height: 1.5rem;
    vertical-align: bottom;
    margin-right: 10px;
    color: #4c412b;
    background: rgba(122, 158, 201, 0.452);
    padding-left: 5px;
    padding-right: 5px;
    border-radius: 6px;
  }
.custom-switch {
   display: -webkit-inline-box;
}
#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
}

.btn-outline-secondary {
  color: #ffffff !important;
  background-color: #fed16e !important;
  border-color: #fed16e !important;
}
.btn-primary:not(:disabled):not(.disabled).active,
.btn-primary:not(:disabled):not(.disabled):active,
.show > .btn-primary.dropdown-toggle {
  color: #4c412b;
  background-color: #ede7dd;
  width: 125px;
  border-color: transparent;
}

.show > .btn-primary.dropdown-toggle:focus {
  box-shadow: none !important;
}

.btn-primary:focus {
  box-shadow: none !important;
}

#submit {
  font-weight: bold;
  color: #4e432d;
  border: 2px solid #92aed1;
  line-height: 1;
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color:#7a9dc9ab;
  padding: 0.6rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  box-shadow: 3px 4px 4px #888888;
}

#submit:hover {
  background-color: #5679a5;
  color: white;
}

.btn.focus,
.btn:focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0);
}
.h-ava {
  /* height: 75em; */
  overflow-y: hidden;
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
#content > div.row.justify-content-end{
  margin: auto;
  margin-right:unset !important; 
}
#content > div.row.justify-content-end > button{
  margin: auto;
  margin-bottom: 20px;
}
#date-picker{
  margin-top: 20px;
}

}




</style>