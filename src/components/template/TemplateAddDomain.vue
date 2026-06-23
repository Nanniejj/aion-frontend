<template>
  
<div> 
<button class="btn btn-add" @click="open = true;"><i class="fa fa-plus"/>
<span  style="font-size:16px;"> เพิ่มหัวเรื่อง </span></button>

 <vue-modaltor :visible="open" @hide="hideModal" :animation-panel="'modal-slide-top'" :resize-width='{3000:"40%",992:"50%",768:"90%"}'>
     <b-container fluid>
        <h5><b>เพิ่มหัวเรื่อง</b></h5> <hr>
          <b-row class="my-1">
              <b-col sm="12"><span style="white-space: nowrap;">คำแนะนำ : กรุณาใส่ชื่อ เรื่อง ที่ต้องการ</span></b-col>
            <b-col sm="12">
              <br>
              <label for="input-small1"><b>ชื่อเรื่อง </b></label>
            </b-col>
            <b-col sm="12">
              <b-form-input id="input-small1" placeholder="" v-model="addDomain"  maxlength="50" ></b-form-input>
              <small class="text-muted">{{ addDomain.length }} / 50 ตัวอักษร</small>
              <div v-if="hasForbiddenChars(addDomain)" class="text-danger small mt-1">
                <i class="fa fa-exclamation-triangle"></i> ห้ามใส่อักขระพิเศษ เช่น @ _ # $ ฿ % ^ & * ,
              </div>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="12" style="text-align:right;">
                <br>
              <b-button class="btn btn-close" size="sm" @click=" hideModal()">ปิดหน้าต่าง</b-button>  <b-button class="btn btn-save" size="sm" @click="addRowDomain()" :disabled="isAddDomainInvalid">บันทึก</b-button>
            </b-col>
          </b-row>
     </b-container>
    </vue-modaltor>
</div>


</template>

<script>
import { mapGetters } from 'vuex';
// import axios from "axios";
// import { API_URL } from '@/common/config';
export default {
    data() {
        return {
            open: false,
             addDomain: '',
        }
    },
methods: {
   // ตรวจว่ามีอักขระพิเศษต้องห้ามอยู่ใน string หรือไม่ (กฎเดียวกับ ImportObject.vue / AddSubDomain.vue / SubdomainCard.vue)
   // อนุญาตตัวอักษรไทย/อังกฤษ ตัวเลข เว้นวรรค และเครื่องหมาย . - ( )
   // หมายเหตุ: & และ / ก็อยู่ในรายการต้องห้ามด้วย แม้โค้ดเดิมจะมี auto-replace
   // เป็น "-" ให้สองตัวนี้ใน addRowDomain() — แต่เมื่อ disable ปุ่มบันทึกไว้ก่อนแล้ว
   // ผู้ใช้จะพิมพ์ผ่านไปกดบันทึกไม่ได้ตั้งแต่แรก โค้ด replace เดิมจึงไม่มีโอกาสถูกใช้งานอีก
   hasForbiddenChars(value) {
     const forbiddenPattern = /[@_#$฿%^&*!~`<>{}[\]|\\/:;"',]/;
     return forbiddenPattern.test(String(value || ""));
   },
   addRowDomain() {
     if (this.isAddDomainInvalid) return;
     let domain = this.addDomain.replace("/","-").replace("&","-")
     let tdomain =domain.trim()
     this.$store.dispatch("updateAddDomain",{name: tdomain ,display:true});
     this.hideModal()
     this.addDomain=""
    },
    hideModal() {
      this.open = false;
    },
    },
    computed: {
    ...mapGetters(['getAddDomain']),
    isAddDomainInvalid() {
      return this.addDomain.trim().length === 0 || this.hasForbiddenChars(this.addDomain);
    },
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
  
  background-color: #776167;
  
}
.btn-add{
    background-color: #ffe6e6;
    color:#776167;
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