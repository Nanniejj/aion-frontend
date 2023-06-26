<template>
<div>
  <!-- <div v-for="u in getAvatarTeam" :key="u">{{u}}</div> -->
  <!-- <b-table hover :items="getAvatarTeam"></b-table> -->
  <!-- {{getAvatarTeam.length}} -->
      <h4 class="title-domain">
        <span @click="backAvatar"> Avatar </span>
      <i class="fas fa-angle-right"/>
      <span id="active"> การจัดการ </span> </h4> 
         <b-container>
       <b-row class="mb-3"> 
         <b-col lg="6" class="my-1">
        <b-form-group
          label-for="filter-input"
          label-cols-sm="0"
          label-align-sm="right"
          label-size="md"
          class="mb-0"
        >
          <b-input-group size="md">
             <b-form-input
              id="filter-input"
              v-model="filterUser"
              type="search"
              placeholder="ค้นหา"
           
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col class="my-1 text-right">
     <div class="d-inline mr-2">
      <button @click="showCheck" class="btn btn-add"> เลือกหลายรายการ </button>
     </div> 
      <CreateMonitor class="text-right d-inline" :tabsMonitor="'tabAvatar'" />
    </b-col> 
   </b-row>
   </b-container>
  
   <b-container>
     <b-row>
       <b-col cols="auto">
         <div class="text-left my-1">
           <button v-on:click="removeList()" v-if="btnCheck" class="btn btn-add"> <i class="fas fa-trash"></i>  ลบรายการที่เลือก </button> 
         <!-- <span class="ml-3 mr-3" >  <span class="fas fa-trash-alt" v-b-tooltip.hover title="ลบข้อมูล" size="sm" 
          v-on:click="removeList()" v-if="btnCheck"></span></span>     -->
          </div>
       </b-col>
       <b-col>
         
          <div class="text-right mt-4 mb-2">
            <span class="mr-3 tagfilter pr-3 pl-3" v-if="filterUser" >ค้นหา <b>{{filterUser}}</b> พบ <b>{{totalRows}}</b> บัญชี </span>
            <span>มีทั้งหมด <b>{{getAvatarTeam.length}}</b> ทีม | <b>{{getAvatarUser.length}}</b> บัญชี</span>
            </div> 
       </b-col>
     </b-row>
    <b-table hover
      responsive
      :items="getAvatarUser"
      :fields="FieldsUser"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filterUser"
      :filter-included-fields="filterOn"
      :empty-filtered-text="empData"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      stacked="md"
      show-empty
      small
      @filtered="onFiltered"
      head-variant="dark"
      class="text-break"    
      id="tb-avataruser"
     >
    >
      <template #cell(id)="row">
        <!-- {{selected}} -->
       <b-form-checkbox  v-model="selected" :key="row.item.id"
        :value="row.item.id"
     class="d-inline" v-if="btnCheck">
        </b-form-checkbox>
         {{ (row.index+1)+20*(currentPage-1)}} 
      </template>
      
      <template #cell(team)="row">
         {{ row.value}} 
      </template>
       <template #cell(uid)="row">
        <!-- <span v-if="row.item.profile_image">
          <img :src="row.item.profile_image" id="profile-pic">
        </span>
        <span v-else>
          <b-avatar class="mr-3"></b-avatar>
        </span> -->
        <b> {{ row.value}} </b> 
      </template>
     <template #cell(link_original)="row">
           <div v-if="row.item.source=='twitter'" class="w-auto m-auto">
              <a :href="row.value" target="_blank" id="link_tw"> <img src="@/assets/Twitter.png" class="twicon" /> {{ row.value}}</a>
           </div>
           <div v-if="row.item.source=='facebook'" class="w-auto m-auto">
              <img src="@/assets/Facebook.png" class="twicon" /> {{ row.value}} 
           </div>
           <div v-if="row.item.source=='pantip'" class="w-auto m-auto">
              <img src="@/assets/Pantip.png" class="twicon" /> {{ row.value}} 
           </div>
            <div v-if="row.item.source=='news'" class="w-auto m-auto">
              <img src="@/assets/News.png" class="twicon" /> {{ row.value}} 
           </div>
           <div v-if="row.item.source=='youtube'" class="w-auto m-auto">
              <img src="@/assets/Youtube.png" class="twicon" /> {{ row.value}} 
           </div>
           <div v-if="row.item.source=='instagram'" class="w-auto m-auto">
              <img src="@/assets/Instagram.png" class="twicon" /> {{ row.value}} 
           </div>       
      </template>
     
       <template #cell(action)="row">
          <span class="fas fa-trash-alt" v-b-tooltip.hover title="ลบ" size="sm" 
          v-on:click="removeRow(row.item)"></span>
         <!-- <span class="fas fa-list-ul" v-b-tooltip.hover title="ดูบัญชี" size="sm"
         @click="goAvatarUser" ></span> -->
      </template>
    </b-table>
    <!-- paginate -->
    <b-row  class="mt-5 text-lg-center mb-4">
      <b-col sm="7" md="6" class="my-1 m-auto " id='page' v-if="filterUser">
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
      </b-col>
       <b-col sm="7" md="6" class="my-1 m-auto " id='page' v-else>
            <b-pagination
              v-model="currentPage"
              :total-rows="getAvatarUser.length"
              :per-page="perPage"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
      </b-col>
    </b-row>
</b-container>



    </div>

</template>

<script>
import { mapGetters } from 'vuex';
import CreateMonitor from '@/components/monitor/CreateMonitor.vue';
export default {
components:{
    CreateMonitor
},
   watch: {
     totalRows: function(newVal, oldVal) { // watch it
          console.log('Prop changed: ', newVal, ' | was: ', oldVal)
        },
    getAvatarUser:function() { // watch it
    },
      getAvatarTeam:function(newVal, oldVal) { // watch it
          console.log('Prop changed: ', newVal, ' | was: ', oldVal)
    },
    },
data() {
    return {
    btnCheck:false,
    allSelected:[],
    selected: [],
    filterOn: [],
    totalRows: 1,
    currentPage: 1,
    perPage: 20,
    sortBy: '',
    sortDesc: false,
    sortDirection: 'asc',
    filterUser:"",
         FieldsUser: [
         { key: 'id', label: '#', sortable: true},
         { key: 'team', label: 'Team' , sortable: true},
        { key: 'uid', label: 'Username' , sortable: true },
         { key: 'link_original', label: 'Account'  , sortable: true},
         { key: 'action', label: 'Manage' },
        ],
      empData:'ไม่พบข้อมูล'
    }
},
computed: {
...mapGetters(['getAvatar',"getLoadStatus","getShowManage","getAvatarTeam","getAvatarUser"]), 
sortOptions() {
        // Create an options list from our fields
        return this.FieldsTeam
          .filter(f => f.sortable)
          .map(f => {
            return { text: f.label, value: f.key }
          })
    },
total(){
      var row = this.totalRows
      row = this.getAvatar.length
      return row
    }

},
methods:{
  showCheck(){
  this.btnCheck=!this.btnCheck
  },
  selectAll(){
    this.row.item.selected=true
  },
  checkRow(item){
  this.selected.push(item.id)
   console.log('selected',this.selected.toString());
  },
   async  removeList(){
    await this.$confirm("คุณต้องการลบข้อมูล?").then(() => {
    let id =this.selected.toString()
          console.log(id);
    this.$store.dispatch('DelAvatar',{avatar:id} )
    this.selected=[]
     }
  );
 
  },
    removeRow(item){
     this.$confirm("คุณต้องการลบข้อมูล?").then(() => {
      console.log('delll',item.uid);
    this.$store.dispatch('DelAvatar',{avatar:item.id} ) });
    },
    backAvatar(){
        this.$store.commit('setShowManage',false)
    },
    goAvatarUser(){
         this.$store.commit('setShowUser',true)
    },
    onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
           console.log( filteredItems.length);
        this.totalRows = filteredItems.length
        this.currentPage = 1
    },
  },
  created(){
     this.$store.dispatch("fetchAvatarTeam")
  }

}
</script>

<style scoped>
#link_tw{
  color: #2c3e50;
}
#profile-pic{
   width: 40px;
  border-radius: 50%;
}
#tb-avataruser{
text-align: left !important;
}
.tagfilter{
 background: #ddddddc7;
 border-radius: 20px;
}
.btn-add:hover{
  
  background-color: #504b3c;
  color: white;
}
.btn-add{
    background-color: #ede7dd;
    color: #504b3c;
    padding: 8px;
    padding-top: 5px;
    padding-bottom: 5px;
    border-radius: 25px;
    box-shadow: 1px 1px 3px #666666;
}
.twicon{
  width: 25px;
}
.fa-pencil:hover{
    background: #4c412b;
    color: white;
}
.fa-list-ul:hover{
    background: #4c412b;
    color: white;
}
.fa-trash-alt:hover{
    background: #4c412b;
    color: white;
}
.fa-pencil,.fa-list-ul,.fa-trash-alt{
    background: #c3d3e7;
    padding: 10px;
    border-radius: 50%;
    box-shadow: 1px 1px 3px #666666;
    margin: 7px 5px ;
        color: #4c412b;
        width: 37px;
    height: 36px;
}
#filter-input{
  box-sizing: border-box;
  background-image: url("/search_icon.png");
  background-position: 94% 10px;
  background-repeat: no-repeat;
  padding: 7px 20px 7px 45px;
  border: none;
  text-align: center;
  background: #ddddddc7;
  border-radius: 5px;
}
#nex
#active{
   text-decoration: underline;
}
.title-domain a{
  cursor: pointer;
  color: #2c3e50;
}
.title-domain{
     cursor: pointer;
    text-align: start;
    margin-left: 12%;
    margin-bottom: 20px !important;
}
</style>