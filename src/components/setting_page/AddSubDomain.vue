<template>
  <div class="d-flex justify-content-end px-3">
    <!-- <button class="btn btn-add" @click="open = true;" style="background-color: #7cd1dc; color: black; border:#7cd1dc;"><i class="fa fa-plus"/> -->

    <b-button pill class="w-auto w-md-auto"
      style="background-color: #7cd1dc; color: black; border:#7cd1dc;box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;"
      @click="open = true;">
      <i class="fa fa-plus"></i> เพิ่มหมวดหมู่
    </b-button>
    <!-- <span style="font-size:16px;"> เพิ่ม SubDomain </span></button> -->
    <vue-modaltor :visible="open" @hide="hideModal" :animation-panel="'modal-slide-top'"
      :resize-width='{ 3000: "50%", 992: "60%", 768: "90%" }'>
      <b-container fluid>
        <h5><b>เพิ่มหมวดหมู่</b></h5>
        <hr>
        <b-row class="my-1">
          <b-col sm="12" class="text-danger">คำแนะนำ : กรุณาใส่ชื่อ<b> หมวดหมู่ </b>ที่ต้องการ</b-col>
          <b-col sm="12">
            <br>
            <label for="input-small2"><b>หมวดหมู่</b></label>
          </b-col>
          <b-col sm="12">
            <b-form-input id="input-small2" placeholder="" maxlength="50" v-model="addSubDomain" focus></b-form-input>
            <small class="text-muted">{{ addSubDomain.length }} / 50 ตัวอักษร</small>
            <div v-if="hasForbiddenChars(addSubDomain)" class="text-danger small mt-1">
              <i class="fa fa-exclamation-triangle"></i> ห้ามใส่อักขระพิเศษ  & 
            </div>

            <!-- {{addSubDomain}} -->
          </b-col>
        </b-row>
        <b-row class="my-1">
          <b-col sm="12" style="text-align:right;">
            <br>
            <b-button class="btn btn-close" size="sm" @click=" hideModal()">ปิดหน้าต่าง</b-button> <b-button
              class="btn btn-save" size="sm" @click="addRowSubDomain"
              :disabled="addSubDomain.trim().length === 0 || hasForbiddenChars(addSubDomain)">บันทึก</b-button>
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
    props:{
    domainId:Number
  },
  data() {
    return {
      open: false,
      addSubDomain: '',
      totalRows: 1,
    }
  },
  methods: {
    // ตรวจว่ามีอักขระพิเศษต้องห้ามอยู่ใน string หรือไม่ (ใช้กฎเดียวกับ ImportObject.vue)
    // อนุญาตตัวอักษรไทย/อังกฤษ ตัวเลข และเว้นวรรคเท่านั้น
    hasForbiddenChars(value) {
      const forbiddenPattern = /&/
      return forbiddenPattern.test(String(value || ""));
    },
 async apiAddSubdomain() {
      const newSubdomainData = {
        name: this.addSubDomain.trim(),
        domain_id: this.$route.query.id,
      };

      try {
        const response = await this.axios.post(
          "https://api2.cognizata.com/api/v2/setting/postSubdomain",
          newSubdomainData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          // console.log("Subdomain created successfully:", response.data);
          this.$emitter.emit("callApiListSubdomain", response.data);
          this.$fire({
            title: "บันทึกข้อมูลสำเร็จ",
            type: "success",
            showConfirmButton: false,
            timer: 1000,
          });
        }
      } catch (error) {
        console.error("Error creating subdomain:", error);
        alert("เกิดข้อผิดพลาดในการเพิ่ม Subdomain");
      }
    },
    addRowSubDomain() {
      //  this.getItemsSubDomain.push({name:this.addSubDomain,domain:{name:this.getDomainName},id:this.getItemsSubDomain.length});
      if (this.addSubDomain.trim().length === 0 || this.hasForbiddenChars(this.addSubDomain)) {
        return;
      }
      this.apiAddSubdomain()
      this.open = false;
      this.addSubDomain = ''
    },
    hideModal() {
      this.open = false;
    },
  },
  computed: {
    ...mapGetters(['getAddDomain', 'getItemsSubDomain', 'getDomainName', 'getDomainId']),
  },
}
</script>

<style scoped>
.btn-close {

 background-color: #7cd1dc; color: black; border:#7cd1dc;  box-shadow: 1px 1px 3px #666666;
}

.btn-save:hover {
  background: #fed16e;
  border-color: #fed16e;
}

.btn-save {
  background: #ede7dd;
  border-color: #ede7dd;
  color: #4c412b;
  box-shadow: 1px 1px 3px #666666;
}

td {
  vertical-align: middle;
}

.btn-add:hover {

  background-color: #504b3c;
  color: white;
}

.btn-add:hover .fa-plus {

  background-color: #504b3c;

}

.btn-add {
  background-color: #ede7dd;
  color: #504b3c;
  padding: 8px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 25px;
  box-shadow: 1px 1px 3px #666666;
}

@media only screen and (min-width: 0px) and (max-width: 600px) {
  .btn-add {
    margin: auto;
    display: block;
    margin-top: 20px;
  }
}
</style>