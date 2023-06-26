<template>
<div>
  <b-container fluid id="tp-size" >
    <vue-element-loading
      :active="getLoadStatus"
      size="80"
      background-color="rgba(255, 255, 255, 0.4)"
      color="#fbf7f6"
    />
    <!-- https://bootstrap-vue.org/docs/components/table#custom-data-rendering   \ Complete example -->
    <!-- User Interface controls -->
    <b-row id="input-btn">
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
              v-model="filter"
              type="search"
              placeholder="ค้นหา"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col lg="6" class="my-1">
        <TemplateAddDomain/>
        <!-- <button class="btn btn-add" ><i class="fa fa-plus"/><span  style="font-size:16px;"> เพิ่ม Domain </span></button> -->
      </b-col>
    </b-row>
<br>
<!-- {{getItemsDomain}} -->
    <!-- Main table element -->
    <b-table hover
      :items="getItemsDomain"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filter-included-fields="filterOn"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      :empty-filtered-text="empData"
      stacked="md"
      show-empty
      small
      @filtered="onFiltered"
      head-variant="light" 
    >
 <!-- @row-clicked="linkToSubDomain"   -->
    <template #cell(id)="row">
      {{ (row.index+1)+((currentPage-1)*10)}}
      </template>
      <template #cell(name)="row">
        <b>{{ row.value }}</b> 
      </template>

      <template #cell(actions)="row">
         <span class="fa fa-pencil" v-b-tooltip.hover title=" แก้ไขข้อมูล" size="sm"  
         @click="open = true;info(row.item, row.index, $event.target);" > </span>
          <span class="fas fa-trash-alt" v-b-tooltip.hover title="ลบ" size="sm" 
          v-on:click="removeRow(row.index,row.item)"></span>
         <span class="fas fa-list-ul" v-b-tooltip.hover title="ดู SubDomain" size="sm"
         @click="linkToSubDomain(row.item)" ></span>
      </template>

      <template #cell(display)="row">
       <span v-if="row.value=='แสดงผล'"><i class="fa fa-circle" style="color:#8cc751;"/> {{ row.value}}</span>
       <span v-else><i class="fa fa-circle" style="color:#d35151;"/> {{ row.value}}</span>
      </template>

    </b-table>
    <!-- paginate -->
    <b-row >
      <b-col sm="7" md="6" class="my-1" id='page' v-if="!filter">
            <b-pagination
              v-model="currentPage"
              :total-rows="this.getItemsDomain.length"
              :per-page="perPage"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
      </b-col>
       <b-col sm="7" md="6" class="my-1" id='page' v-else>
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
      </b-col>
    </b-row>

    <!-- Info modal -->
    <vue-modaltor :visible="open" @hide="hideModal"  
    :animation-panel="'modal-slide-top'" 
    >
     <b-container fluid>
       <h5><b>แก้ไขข้อมูล</b></h5> <hr>
        <p>คำแนะนำ : กรุณาตรวจสอบข้อมูลทุกครั้งก่อนทำการบันทึก</p>
       <div>
    <b-form-input v-model="textDomain" placeholder=""> <b>{{ textDomain }}</b></b-form-input>
      <br>
      <b-form-group  v-slot="{ ariaDescribedby }">
      <b-form-radio-group
        v-model="selected"
        :options="options"
        :aria-describedby="ariaDescribedby"
        name="radio-inline"
      ></b-form-radio-group>
    </b-form-group>
     <b-row class="my-1">
            <b-col sm="12" style="text-align:right;">
                <br>
              <b-button class="btn btn-close" size="sm" @click=" hideModal()">ปิดหน้าต่าง</b-button>  
              <b-button class="btn btn-save" size="sm" @click="editDomain()" >บันทึก</b-button>
            </b-col>
    </b-row>
    <!-- <div class="mt-2">Value: {{ textDomain }}</div> -->
  </div>
     </b-container>
    </vue-modaltor>

  </b-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import TemplateAddDomain from '@/components/template/TemplateAddDomain.vue';
// import axios from "axios";
// import { API_URL } from '@/common/config';

  export default {
    components:{TemplateAddDomain, },
    data() {
      return {
         empData:'ไม่พบข้อมูล',
        idDomain:0,
        fields: [  
      { key: 'id', label: '#', sortable: true, class: 'text-center' },
       { key: 'name', label: 'Domain', sortable: true,},
      
      {
        key: 'display',
        label: 'สถานะ',
        formatter: (value) => {
          return value ? 'แสดงผล' : 'ไม่แสดงผล'
        },
        sortable: true,
        sortByFormatted: true,
        filterByFormatted: true
      }  ,
      { key: 'actions', label: 'การจัดการ' }
    ],
        selected: '',
        options:[{text:'แสดงผล',value:true},{text:'ไม่แสดงผล',value:false}] ,
        textDomain:'',
        open: false,
        totalRows:1,
        currentPage: 1,
        perPage: 10,
        pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
        sortBy: '',
        sortDesc: false,
        sortDirection: 'asc',
        filter: null,
        filterOn: [],
        infoModal: {
          id: 'info-modal',
          title: '',
          content: ''
        }
      }
    },
    computed: {
       ...mapGetters(['getSelected','getFieldsDomain','getItemsDomain','getLoadStatus']),
      sortOptions() {
        // Create an options list from our fields
        return this.fields
          .filter(f => f.sortable)
          .map(f => {
            return { text: f.label, value: f.key }
          })
      },

    },
    methods: {
      removeRow: function(index,item) {
        console.log('delete');
         this.$confirm("คุณต้องการลบข้อมูล?").then(() => {
         this.$store.dispatch("deleteDomain",{domain:item.name,index:index})
         this.totalRows = this.getItemsDomain.length
         });
         },
      editDomain(){
        let tdomain = this.textDomain.trim();
         this.$store.dispatch("updateDomain",{name:tdomain,id:this.idDomain,display:this.selected});
         this.open = false;
         
        // this.$confirm("กรุณายืนยันข้อมูล").then(() => {
        //   var _this = this;
        //   var token='8ed9acde328c317fef0afce75850dc637e674174';
        //   const AuthStr = "Token " + token;
        //   var data = JSON.stringify({"name":_this.textDomain,"display":_this.selected,"id":_this.idDomain});
        // console.log(data);
        //   var config = {
        //     method: 'put',
        //     url: API_URL+'/v1/domain/'+_this.idDomain+'/',
        //     headers: {
        //       Authorization: AuthStr,
        //       "Content-Type": "application/json",
        //     },
        //     data : data
        //   };
        //   axios(config)
        //   .then(function () {
        //     _this.$fire({
        //         title: "บันทึกข้อมูลสำเร็จ",
        //         type: "success",
        //       showConfirmButton: false,
        //         timer: 1000,
        //       })
        //       _this.hideModal()
        //       location.reload();
        //   })
        //   .catch(function () {
        //    _this.$alert("ไม่สามารถดำเนินการได้").then(() => {});
        //   });
          
        // });
      },
      linkToSubDomain(item){
        // this.$store.dispatch("fetchListSubDomain",{name:item.name})
        console.log(item.id);
        this.$store.commit("setDomainName", item.name);
        this.$store.commit("setDomainId", item.id);
        this.$router.push( {name: 'TemplateSettingSubDomain'})
      },
    hideModal() {
      this.open = false;
    },
      info(item, button) {
        // this.infoModal.title = `Row index: ${index}`;
        this.idDomain=item.id;
        console.log(this.idDomain);
        this.infoModal.content = item.name;
        this.textDomain=item.name;
        this.selected= item.display;
      //  console.log( this.options);
        this.$root.$emit('bv::show::modal', this.infoModal.id, button);
      },
      resetInfoModal() {
        this.infoModal.title = ''
        this.infoModal.content = ''
      },
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        console.log('item', filteredItems);
        this.currentPage = 1
      }
    }
    ,
created() { 
  this.$store.dispatch("fetchTemplateDomain")
  },
 }
</script>
<style scoped>

 table > thead > tr > th:nth-child(3){
  display: none;
}
.btn-close{
  color: #f8f9fa;
    background-color: #4c412b;
    border-color: #4c412b;
    box-shadow: 1px 1px 3px #666666;
}
.btn-save{
background:#ede7dd;
border-color:  #ede7dd;
color:#4c412b;
box-shadow: 1px 1px 3px #666666;
}
.btn-save:hover {
    background: #fed16e;
    border-color: #fed16e;
}

#input-btn > div:nth-child(2){
  text-align: end;
}
#tp-size{
  width: 85%;
}
#content > div > div:nth-child(1)
.form-control:focus {
    border-color: transparent;
    outline: 0;
    box-shadow: 0 0 0 0 #ede7dd;
}
#btn-filter{
  background-color: #4c412b;
    border-color:  #4c412b;
}
#page{
 margin:auto;
 margin-top: 40px !important;
}
.fa-plus{
    background: white;
    padding: 5px 7px;
    border-radius: 50%;
}
.fa-pencil,.fa-list-ul,.fa-trash-alt{
    background: #fed16ebf;
    padding: 10px;
    border-radius: 50%;
    box-shadow: 1px 1px 3px #666666;
    margin: 7px 5px ;
        color: #4c412b;
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
#filter-input{
  box-sizing: border-box;
  background-image: url("/search_icon.png");
  background-position: 94% 10px;
  background-repeat: no-repeat;
  padding: 7px 20px 7px 45px;
  border: none;
  text-align: center;
  background: #ddddddc7;
  border-radius: 25px;
}
.table {
    /* width: 85%; */
    margin: auto;
}
#page{
    margin-bottom: 50px !important;
}
@media only screen and (min-width: 0px) and (max-width:1024px) {
#tp-size[data-v-32e3da22] {
    width: 100%;
}
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
.table {
    /* width: 85%; */
    margin: auto;
}
}


</style>