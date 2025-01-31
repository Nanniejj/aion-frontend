<template>
<div> 
<button class="btn btn-add" @click="open = true;"><i class="fa fa-plus"/>
<!-- {{this.getItemsSubDomain.length}} -->
<span  style="font-size:16px;"> เพิ่ม SubDomain </span></button>
 <vue-modaltor :visible="open" @hide="hideModal" :animation-panel="'modal-slide-top'" :resize-width='{3000:"40%",992:"50%",768:"90%"}'>
     <b-container fluid>
        <h5><b>เพิ่ม SubDomain</b></h5> <hr>
          <b-row class="my-1">
              <b-col sm="12">คำแนะนำ : กรุณาใส่ชื่อ SubDomain ที่ต้องการ</b-col>
            <b-col sm="12">
              <br>
              <label for="input-small2"><b>SubDomain  </b></label>
            </b-col>
            <b-col sm="12">
              <b-form-input id="input-small2"  placeholder=""  maxlength="50"  v-model="addSubDomain" focus></b-form-input>
              <small class="text-muted">{{ addSubDomain.length }} / 50 ตัวอักษร</small>

              <!-- {{addSubDomain}} -->
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="12" style="text-align:right;">
                <br>
              <b-button class="btn btn-close" size="sm" @click=" hideModal()">ปิดหน้าต่าง</b-button>  <b-button class="btn btn-save" size="sm" @click="addRowSubDomain" :disabled="addSubDomain.trim().length === 0">บันทึก</b-button>
            </b-col>
          </b-row>
     </b-container>
    </vue-modaltor>
</div>


</template>

<script>
// import axios from "axios";
// import { API_URL } from '@/common/config';
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            open: false,
             addSubDomain: '',
              totalRows: 1,
        }
    },
methods: {
   addRowSubDomain() {
    //  this.getItemsSubDomain.push({name:this.addSubDomain,domain:{name:this.getDomainName},id:this.getItemsSubDomain.length});
     this.$store.dispatch("updateAddSubDomain",{name:this.addSubDomain.replace("/","-"),display:true,domain:this.getDomainId})
     this.open = false;
     this.addSubDomain=''
    },
    hideModal() {
      this.open = false;
    },
    },
    computed: {
    ...mapGetters(['getAddDomain','getItemsSubDomain','getDomainName','getDomainId']),
  },
}
</script>

<style  scoped>
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
td{
    vertical-align: middle;
}
.btn-add:hover{
  
  background-color: #504b3c;
  color: white;
}
.btn-add:hover .fa-plus{
  
  background-color: #504b3c ;
  
}
.btn-add{
 background-color: #ede7dd;
 color:#504b3c;
  padding: 8px;
  padding-top: 5px;
   padding-bottom: 5px;
  border-radius: 25px;
  box-shadow: 1px 1px 3px #666666;
}
@media only screen and (min-width: 0px) and (max-width: 600px){
.btn-add {
    margin: auto;
    display: block;
    margin-top: 20px;
}
}
</style>