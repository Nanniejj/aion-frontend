<template>
<div>
  <!-- <b-table hover :items="getAvatarUser"></b-table> -->
  <!-- {{getAvatarUser.TeamA1}} -->
      <h4 class="title-domain">
          <span @click="backAvatar"> Avatar </span>
      <i class="fas fa-angle-right"/>
      <span  @click="backTeam" > การจัดการทีม </span> 
       <i class="fas fa-angle-right"/>
      <span id="active"> รายชื่อบัญชี </span> </h4> 
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
      <b-col  lg="2"  class="my-1" >
        <!-- <b-form-select v-model="selected" :options="options" @change="selectChange"></b-form-select> -->
      </b-col>
      <b-col class="my-1">
       <CreateMonitor class="text-right" :tabsMonitor="'tabAvatar'" />
    </b-col> 
   </b-row>
   </b-container>
  
   <b-container>
     <b-row>
       <b-col>
          <div  class="text-left mt-4 mb-2" v-if="filterUser" >ค้นหา <b>{{filterUser}}</b> พบ <b>{{totalRows}}</b> บัญชี </div>
       </b-col>
       <b-col>
          <div class="text-right mt-4 mb-2">มีทั้งหมด <b>{{getAvatarTeam.length}}</b> ทีม | <b>{{getAvatarUser.length}}</b> บัญชี</div> 
       </b-col>
     </b-row>
      
    <b-table hover
      responsive
      :items="getAvatarUser"
      :fields="FieldsTeam"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filterUser"
      :filter-included-fields="filterOn"
      :empty-filtered-text="empData"
      stacked="md"
      show-empty
      small
      @filtered="onFiltered"
      head-variant="dark"
      class="text-break"    
      id="tb-profile"
      
    
     >
    >
      <template #cell(id)="row">
         {{ (row.index+1)+20*(currentPage-1)}} 
      </template>
      
      <template #cell(team)="row">
         {{ row.value}} 
      </template>
     
     
       <template #cell(action)="row">
         <span class="fa fa-pencil" v-b-tooltip.hover title=" แก้ไขข้อมูล" size="sm"  
         @click="open = true;info(row.item, row.index, $event.target);" > </span>
          <span class="fas fa-trash-alt" v-b-tooltip.hover title="ลบ" size="sm" 
          v-on:click="removeRow(row.index,row.item)"></span>
         <!-- <span class="fas fa-list-ul" v-b-tooltip.hover title="ดูบัญชี" size="sm"
         @click="goAvatarUser" ></span> -->
      </template>
     
    </b-table>
    <!-- paginate -->
    <b-row  class="mt-5 text-center mb-4">
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
        }
    },
data() {
    return {
    filterOn: [],
     totalRows: 1,
      currentPage: 1,
      perPage: 20,
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
        filterUser:"",
         FieldsTeam: [
     'selected',
         { key: 'id', label: '#'},
         { key: 'team', label: 'Team'},
        { key: 'uid', label: 'เจ้าของ Avatar' },
         { key: 'link_original', label: 'บัญชี' },
         { key: 'action', label: 'การจัดการ' },
        ],
      empData:'ไม่พบข้อมูล'
    }
},
computed: {
...mapGetters(['getAvatar',"getLoadStatus","getShowManage","getAvatarUser","getAvatarTeam"]),
total(){
      var row = this.totalRows
      row = this.getAvatarUser.length
      return row
    }
},
methods:{
    backTeam(){
         this.$store.commit('setShowUser',false) 
    },
    backAvatar(){
        this.$store.commit('setShowManage',false)
        this.$store.commit('setShowUser',false) 
    },
    onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
           console.log( filteredItems.length);
        this.totalRows = filteredItems.length
        this.currentPage = 1
    },
  }

}
</script>

<style scoped>
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
    background: #fed16ebf;
    padding: 10px;
    border-radius: 50%;
    box-shadow: 1px 1px 3px #666666;
    margin: 7px 5px ;
        color: #4c412b;
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