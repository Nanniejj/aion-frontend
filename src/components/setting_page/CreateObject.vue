<template>
  <span>
    <b-button size="md" class="w-md-auto btn-addobj" pill style="background-color: #fdd071;color: #2c3e50;" @click="open = true;">
      <i class="fa fa-plus" style="font-size: 18px; line-height: 1;"></i> เพิ่มประเด็น
    </b-button>
    <vue-modaltor :visible="open" @hide="open = false;" :animation-panel="'modal-slide-top'"
      :resize-width='{ 3000: "55%", 1200: "70%", 768: "90%" }'>

      <div class="px-3">
        <!-- {{ objectData }} -->
        <h5><b>เพิ่มประเด็น</b></h5>
        <hr>
        <p>คำแนะนำ : กรุณาใส่ชื่อถุงคำที่ต้องการ Keyword โดยกด Enter หรือใช้เครื่องหมาย , เพื่อแยกคำ เช่น การเมือง,สถาบัน</p>
        <b-container>
          <!-- {{ objectData }} -->
          <!-- ปุ่ม Clear & Import CSV -->
          <!-- <div class="d-flex justify-content-end mb-3">
          <b-button variant="outline-secondary" @click="clearForm">
            <i class="bi bi-eraser"></i> clear
          </b-button>
          <b-button variant="outline-secondary" class="ml-2">
            <i class="bi bi-upload"></i> import CSV
          </b-button>
        </div> -->

          <!-- Social Media Inputs -->

          <!-- Object Name -->
          <b-form-group label="ประเด็น" label-class="font-weight-bold">
            <b-form-input v-model="objectName" maxlength="50" required></b-form-input>
            <small class="text-muted">{{ objectName.length }} / 50 ตัวอักษร</small>
          </b-form-group>
          <!-- Keywords -->
          <b-form-group label="Keyword" label-class="font-weight-bold">
            <b-form-tags v-model="keywords" separator=",;" placeholder="Enter เพื่อพิมพ์คำใหม่"></b-form-tags>
          </b-form-group>

          <b-form-group>
            <label><b>Include Keyword <span class="badge badge-warning">AND</span></b></label>
            <b-alert variant="info" show>
              ใช้ <b>+</b> ในการ AND เช่น <strong>การเมือง + การปกครอง</strong>
            </b-alert>
            <b-form-tags v-model="andKeywords" separator=",;" placeholder="Enter เพื่อพิมพ์คำใหม่"
              @input="logAndKeywords"></b-form-tags>
          </b-form-group>

          <b-form-group>
            <label><b>Exclude Keyword <span class="badge badge-danger">NOT</span></b></label>
            <b-form-tags v-model="notKeywords" separator=",;" placeholder="Enter เพื่อพิมพ์คำใหม่"
              @input="logNotKeywords"></b-form-tags>
          </b-form-group>

          <!-- ปุ่มบันทึก & ปิด -->

          <div class="d-flex justify-content-end mt-3">
            <b-button style="background-color: #646462; border:  #646462;" @click="closeModal">ปิดหน้าต่าง</b-button>
            <b-button style="background-color: #50c1d0; color: black; border:#50c1d0;" class="ml-2"
              :disabled="objectName.length == 0" @click="saveObject">บันทึก</b-button>
          </div>

        </b-container>
      </div>
    </vue-modaltor>
  </span>
</template>

<script>
import axios from "axios";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  name: "CreateObject",
  components: { vSelect },
  props: {
    objectData: { type: Object }
  },
  data() {
    return {
      open: false,
      objectName: "",
      keywords: [],
      and_keywords: [],
      not_keywords: [],
      andKeywords: [],
      notKeywords: [],
      statusMessage: "", // ข้อความแสดงสถานะ
      statusClass: "", // สไตล์ข้อความสถานะ
    };
  },
  methods: {
    clearForm() {
      this.objectName = "";
      this.keywords = [];
      this.andKeywords = [];
      this.notKeywords = [];
    },
    closeModal() {
      this.open = false;
      // this.$bvModal.hide("add-object-modal");
    },
    async saveObject() {
      if (!this.objectName.trim()) {
        alert("กรุณากรอกชื่อ Object");
        return;
      }

      if (!this.objectData.subdomain_id) {
        alert("ไม่พบ Subdomain ID");
        return;
      }

      //ตรวจสอบค่าที่ถูกส่งไป API
      const newObjectData = {
        domain_id: this.$route.query.id,
        subdomain_id: this.objectData.subdomain_id,
        name: this.objectName.trim(),
        keywords: Array.isArray(this.keywords) ? this.keywords : [],
        and_keywords: Array.isArray(this.andKeywords) ? this.andKeywords : [],
        not_keywords: Array.isArray(this.notKeywords) ? this.notKeywords : [],
      };

      // console.log(
      //   "🔹 ข้อมูลที่ถูกส่งไป API:",
      //   JSON.stringify(newObjectData, null, 2)
      // );

      try {
        const response = await axios.post(
          "https://api2.cognizata.com/api/v2/setting/postObject",
          // "https://api2.cognizata.com/api/v2/monitor/monitorCandidates"
          newObjectData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );
        this.clearForm()
        this.$store.dispatch("resetDomainLastUpdate", this.$route.query.id);
        this.$emitter.emit("callApiListSubdomain", response.data);
        this.closeModal();
        this.$fire({
          title: "บันทึกข้อมูลสำเร็จ",
          type: "success",
          showConfirmButton: false,
          timer: 1000,
        });

      } catch (error) {
        console.error("Error creating object:", error.response?.data || error);
        alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    },
    logAndKeywords() {
      //console.log("and_keywords ที่ได้รับ:", this.andKeywords);
    },
    logNotKeywords() {
      //console.log("not_keywords ที่ได้รับ:", this.notKeywords);
    },
  },
};
</script>

<style scoped>
.btn-secondary {
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  border-color: #dee2e600;
}

.badge-warning {
  background-color: #ffc107;
  color: black;
}

.badge-danger {
  background-color: #dc3545;
}

.custom-dropdown .v-select {
  width: 100%;
}

.custom-dropdown .vs__dropdown-menu {
  z-index: 1050;
  /* ให้ dropdown แสดงอยู่ด้านบน */
}

.icon-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  margin-top: 25px;
}

::v-deep .b-form-tags .b-form-tag {
  color: #2c3e50;
  background-color: #f5f1eb !important;
  font-weight: bold;
  border-radius: 15px;
  padding: 5px 10px;
  margin: 3px;
}

.btn-save {
  background-color: #50c1d0;
  /* background-color: #fdd071; */
  color: white;
  /* สีตัวอักษร */
  font-size: 16px;
  /* ขนาดตัวอักษร */
  padding: 10px 20px;
  /* ระยะห่างด้านใน */
  border: none;
  /* ลบกรอบ */
  border-radius: 5px;
  /* มุมโค้งมน */
  cursor: pointer;
  /* เปลี่ยนเคอร์เซอร์เมื่อ hover */
}

.alert {
  font-size: 16px;
  padding: 10px;
}
@media only screen and (min-width: 0px) and (max-width: 767px) {
.btn-addobj{
    font-size: 12px !important;
}}
</style>
