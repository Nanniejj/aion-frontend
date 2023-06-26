<template>
 <b-container fluid id="tp-size">
      <vue-element-loading
      :active="getLoadStatus"
      size="80"
      background-color="rgba(255, 255, 255, 0.4)"
      color="#fbf7f6"
    />
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
        <TemplateAddWord/>
        <!-- <button class="btn btn-add" ><i class="fa fa-plus"/><span  style="font-size:16px;"> เพิ่ม Domain </span></button> -->
      </b-col>
    </b-row>
<br>
<div >
  <!-- {{getListWord}}{{currentPage}} -->
      <b-table
      :items="getListWord"
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
     <template #cell(id)="row">
      {{ (row.index+1)+((currentPage-1)*10)}}
      </template>

      <template #cell(domain)="row">     
        <!-- <b-skeleton-wrapper :loading="false">
          <b-skeleton width="85%"></b-skeleton>
         </b-skeleton-wrapper> -->
        {{ row.value.name }}
      </template>
      <template #cell(subdomain)="row">
        {{ row.value.name }}
      </template>
        <template #cell(name)="row">
        <b>{{ row.value }}</b>
      </template>
      <template #cell(actions)="row">
         <span class="fa fa-pencil" v-b-tooltip.hover title=" แก้ไขข้อมูล" size="sm"  @click="open = true;info(row.item, row.index, $event.target);" > </span>
        <span class="fas fa-trash-alt" v-b-tooltip.hover title="ลบ" size="sm" v-on:click="removeRow(row.index,row.item)"></span>
      </template>
    <template #cell(word)="row">
       <b> {{ row.value }}</b>
      </template>
      <!-- Show Keyword -->
      <template #cell(keywords)="row">
        <!-- {{row.value}} -->
         <!-- <span v-for="(keyword,k) in row.item" :key="k"  > {{keyword}}</span> -->
         <b-button size="sm" @click="row.toggleDetails" id="btn-show">
          {{ row.detailsShowing ? 'Hide' : 'Show' }} Keyword
        </b-button>
      </template>

       <template #row-details="row">
        <b-card>
         <div style="color: #4d422c;margin-bottom:10px"> <b> Keyword</b> </div>
          <div id="display-col">
          <div v-for="(keyword,k) in row.item.keywords" :key="k" >{{k+1}}. {{keyword}}</div>
        </div>

        <div v-if="row.item.and_keywords.length">
          <hr>
         <div style="color: #4d422c;margin-bottom:10px"> <b>Include Keyword</b> </div>
         <div id="display-col">
         <div v-for="(andkey,k) in row.item.and_keywords" :key="k" >{{k+1}}. {{andkey}}</div>
         </div>
         </div>

        <div v-if="row.item.not_keywords.length">
          <hr>
         <div style="color: #4d422c;margin-bottom:10px"> <b>Exclude Keyword</b> </div>
         <div id="display-col">
         <div v-for="(notkey,k) in row.item.not_keywords" :key="k" >{{k+1}}. {{notkey}}</div>
         </div>
         </div>

        </b-card>
      </template>
      
</b-table>
</div>

 <!-- paginate -->
    <b-row >
      <b-col sm="7" md="6" class="my-1" id='page' v-if="!filter">
            <b-pagination
              @input="setPage"
              v-model="currentPage"
              :total-rows="getRowCount"
              :per-page="perPage"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
      </b-col>
       <b-col sm="7" md="6" class="my-1" id='page' v-else>
            <b-pagination
              @input="setPage"
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
    :resize-width='{3500:"50%",1500:"70%",992:"70%",768:"90%"}' 
    :animation-panel="'modal-slide-top'" >
     <b-container fluid>
       <h5><b>แก้ไขข้อมูล</b></h5> <hr>
        <p>คำแนะนำ : กรุณาตรวจสอบข้อมูลทุกครั้งก่อนทำการบันทึก</p>
       <div>
     <b-col sm="12">
              <label for="textarea-default"><b>Object </b></label>
            </b-col>
             <b-col sm="12">
              <b-form-input id="input-small3"  placeholder="" v-model="textWord"></b-form-input>
            </b-col>
             <b-col sm="12">
              <br>
              <!-- <label for="textarea-default"><b>Keyword </b></label> -->
            </b-col>
            <b-tabs content-class="mt-3" lazy
            active-nav-item-class="font-weight-bold "
              active-tab-class="font-weight-bold "
              v-model="tabIndex"
            >
            <b-tab >
              <template #title calss="title-tab">
                  <span id="title-tab">Keyword</span></template>
                 <b-form-tags
                  v-model="textKeyword"
                  tag-variant="light"
                  tag-pills
                  size="md"
                  placeholder="Enter เพื่อพิมพ์คำใหม่"
                  remove-on-delete
                ></b-form-tags>
              
            </b-tab>
            <b-tab >
              <template #title calss="title-tab">
                <span id="title-tab">Include Keyword</span>  </template>
               <b-form-tags
                  v-model="textInclude"
                  tag-variant="light"
                  :tag-validator="validator"
                   @tag-state="onTagState"
                  tag-pills
                  size="md"
                  placeholder="Enter เพื่อพิมพ์คำใหม่"
                   remove-on-delete
                ></b-form-tags>
           
              <div class="small m-2 ">
              ใช้ <i class="fa fa-plus" aria-hidden="true"></i> ในการ AND เช่น 
                    <b>การเมือง<i class="fa fa-plus p-1" style="font-size:12px"/>การปกครอง</b>
              </div>
   
            </b-tab>
             <b-tab >
              <template #title calss="title-tab">
                <span id="title-tab">Exclude Keyword</span>   </template>
                 <b-form-tags
                  v-model="textExclude"
                  tag-variant="light"
                  tag-pills
                  size="md"
                  placeholder="Enter เพื่อพิมพ์คำใหม่"
                    remove-on-delete
                ></b-form-tags>
           
            </b-tab>
            </b-tabs>
      <br>
        <b-row class="my-1">
          <b-col sm="12" style="text-align:right;">
            <b-button class="btn btn-close" size="sm" @click=" hideModal()">ปิดหน้าต่าง</b-button>  <b-button class="btn btn-save" size="sm" @click="EditWord()">บันทึก</b-button>
          </b-col>
        </b-row>
        <!-- <div class="mt-2">Value: {{ textDomain }}</div> -->
      </div>
     </b-container>
    </vue-modaltor>

 </b-container>
</template>

<script>
import { mapGetters } from 'vuex';
import TemplateAddWord from '@/components/template/TemplateAddWord.vue';
export default {
  components:{ TemplateAddWord},
    data() {
        return {
        empData:'ไม่พบข้อมูล',
        tabIndex:0,
        textInclude:[],
        textExclude:[],
        offset: 0,
        IdWord:"",
        subDomainId:"",
        IdDm:"",
          fields: [
      { key: 'id', label: '#', sortable: true, class: 'text-center' },
       { key: 'domain', label: 'Domain', sortable: true, },
        { key: 'subdomain', label: 'SubDomain', sortable: true },
        { key: 'name', label: 'Object',sortable: true, },
         { key: 'keywords', label: 'Keyword' },
      { key: 'actions', label: 'Manage' }
    ], 
        textWord:'',
        textKeyword:[],
        itemsd:[],
        open: false,
        totalRows: 1,
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
    ...mapGetters(['getListWord','getListSubDomain','getFields','getItemsWord','getDomainId','getSubDomainName','getRowCount',"getLoadStatus"]),
        sortOptions() {
        // Create an options list from our fields
        return this.fields
          .filter(f => f.sortable)
          .map(f => {
            return { text: f.label, value: f.key }
          })
      }
  },
methods: { 
  validator(tag) {
        return tag.includes('+')&&tag.slice(-1)!=="+";
      },
       onTagState(valid, invalid, duplicate) {
        this.validTags = valid +" eg. การเมือง+การปกครอง"
        this.invalidTags = invalid +" eg. การเมือง+การปกครอง"
        this.duplicateTags = duplicate
      },
  setPage(){
    if (this.currentPage > 1) {
        this.offset = 10 * (this.currentPage - 1);
        // console.log("offset : ", this.offset);
      } else {
        this.offset = 0;
      }
    //this.$store.dispatch("fetchListWord",{domain:this.getSubDomainName.domain.name,subdomain:this.getSubDomainName.name,offset:this.offset})
  },
  EditWord(){
     this.$store.dispatch("updateWord",
     {name:this.textWord,
     keywords:this.textKeyword,
     and_keywords:this.textInclude,
     not_keywords:this.textExclude,
     subdomain:Number(this.subDomainId),
     domain:Number(this.IdDm),
     id:Number(this.idWord)})
     this.open = false;

  },
   removeRow: function(index,item) {
     this.$confirm("คุณต้องการลบข้อมูล?").then(() => {
        // this.getItemsWord.splice(index, 1);
         this.totalRows = this.getRowCount
          this.$store.dispatch("deleteWord",{id:item.id,index:index})
          console.log(item.id);
   });
      },
    backDomain: function () {
      this.$store.commit("setListWord", false);
      this.$store.commit("setListSubDomain", false);
      //console.log('back');
    },
    backSubDomain: function () {
      this.$store.commit("setListWord", false);
      //console.log('back');
    },
    hideModal() {
      this.open = false;
      this.tabIndex=0
    },
    info(item, index, button) {
        this.infoModal.title = `Row index: ${index}`;
        this.idWord=item.id;
        this.IdDm = item.domain.id;
        this.subDomainId=item.subdomain.id;
        this.infoModal.content = item.domain.name;
        this.textWord=item.name;
        this.textKeyword=item.keywords;
        this.textInclude=item.and_keywords;
        this.textExclude=item.not_keywords;
         this.selected= item.isActive;
       //console.log( this.IdDm,this.subDomainId, this.idWord);
        this.$root.$emit('bv::show::modal', this.infoModal.id, button);
      },
      resetInfoModal() {
        this.infoModal.title = ''
        this.infoModal.content = ''
      },
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      }
}, 
created() {
    //console.log(this.getSubDomainName.domain.name);
    //this.$store.dispatch("fetchListWord",{domain:this.getSubDomainName.domain.name,subdomain:this.getSubDomainName.name})
    if(this.getSubDomainName.domain.name){
       this.$store.dispatch("fetchListWord",{domain:this.getSubDomainName.domain.name,subdomain:this.getSubDomainName.name,offset:this.offset})
    }else{
         this.$router.push({ name: "TemplateSetting" });
    }
  },
}
</script>

<style scoped>
#title-tab {
  color: #2c3e50 !important;
}
.nav-tabs .nav-link.active #title-tab {
       color: #2c3e50 !important;
}

.btn-close{
  color: #f8f9fa;
    background-color: #4c412b;
    border-color: #4c412b;
    box-shadow: 1px 1px 3px #666666;
}
.btn-save:hover {
    background: #fed16e;
    border-color: #fed16e;
}
.btn-save{
background:#ede7dd;
border-color:  #ede7dd;
color:#4c412b;
box-shadow: 1px 1px 3px #666666;
}
.table-hover tbody tr:hover {
    cursor: pointer;
    color: #4c412b;
    background-color: #ede7dd57;
}
.card {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #ffffff;
    background-clip: border-box;
    border: 1px solid #4c412b5e; 
    border-radius: .50rem;
}
.card-body{
  margin: auto;
}
#display-col{
  text-align: left;
   column-count: 3 !important;
   -moz-column-count: 3 !important;
   column-gap: 40px;
}
.fa-pencil,.fa-trash-alt{
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
.fa-trash-alt:hover{
    background: #4c412b;
    color: white;
}
#page{
 margin:auto;
 margin-top: 40px !important;
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
#input-btn > div:nth-child(2){
  text-align: end;
}
#btn-show{
      color: #504b3c;
    background-color: #ede7dd;
    border-color: #ede7dd;
    box-shadow: 1px 1px 4px #666666;
}

#tp-size{
  width: 85%;
}

@media only screen and (min-width: 0px) and (max-width: 1000px) {
#display-col{
  text-align: left;
   column-count: 2 !important;
   -moz-column-count: 2 !important;
   column-gap: 40px;
}
}

@media only screen and (min-width: 0px) and (max-width: 600px) {

#display-col{
  text-align: left;
   column-count: 1 !important;
   -moz-column-count: 1 !important;
   column-gap: 40px;
}
#tp-size[data-v-7e70fc4e] {
    width: 100%;
}
#page{
    margin-bottom: 50px !important;
}
/* .tooltip-inner {
    display: none !important ;
} */
}
</style>