<template>
  <span>
    <div>
      <hr>
      <p>คำแนะนำ : กรุณาใส่ชื่อถุงคำที่ต้องการ Keyword ให้ enter หากมีมากกว่า 1 คำ</p>
      <b-container>
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
        <b-form-group label="Object"
        label-class="font-weight-bold">
          <b-form-input
            v-model="objectName"
            maxlength="50"
            required
          ></b-form-input>
          <small class="text-muted"
            >{{ objectName.length }} / 50 ตัวอักษร</small
          >
        </b-form-group>

        <!-- Keywords -->
        <b-form-group label="Keyword"
        label-class="font-weight-bold">
          <b-form-tags
            v-model="keywords"
            placeholder="Enter เพื่อพิมพ์คำใหม่"
          ></b-form-tags>
        </b-form-group>

        <b-form-group>
          <label
            ><b
              >Include Keyword <span class="badge badge-warning">AND</span></b
            ></label
          >
          <b-alert variant="info" show>
            ใช้ <b>+</b> ในการ AND เช่น <strong>การเมือง + การปกครอง</strong>
          </b-alert>
          <b-form-tags
            v-model="andKeywords"
            placeholder="Enter เพื่อพิมพ์คำใหม่"
            @input="logAndKeywords"
          ></b-form-tags>
        </b-form-group>

        <b-form-group>
          <label
            ><b
              >Exclude Keyword <span class="badge badge-danger">NOT</span></b
            ></label
          >
          <b-form-tags
            v-model="notKeywords"
            placeholder="Enter เพื่อพิมพ์คำใหม่"
            @input="logNotKeywords"
          ></b-form-tags>
        </b-form-group>

        <!-- Include Keyword AND -->
        <!-- <b-form-group>
          <label
            ><b
              >Include Keyword <span class="badge badge-warning">AND</span></b
            ></label
          >
          <b-alert variant="info" show>
            ใช้ <b>+</b> ในการ AND เช่น <strong>การเมือง + การปกครอง</strong>
          </b-alert>
          <b-form-tags
            v-model="includeKeywords"
            placeholder="Enter เพื่อพิมพ์คำใหม่"
          ></b-form-tags>
        </b-form-group> -->

        <!-- Exclude Keyword NOT -->
        <!-- <b-form-group>
          <label
            ><b
              >Exclude Keyword <span class="badge badge-danger">NOT</span></b
            ></label
          >
          <b-form-tags
            v-model="excludeKeywords"
            placeholder="Enter เพื่อพิมพ์คำใหม่"
          ></b-form-tags>
        </b-form-group> -->

        <!-- ปุ่มบันทึก -->
        <!-- <b-row>
          <b-col md="12" class="text-center">
            <b-button
              variant="success"
              class="btn-save"
              :disabled="!selectedObject"
              @click="saveData"
            >
              บันทึก
            </b-button>
          </b-col>
        </b-row> -->

        <!-- ปุ่มบันทึก & ปิด -->
        <div class="d-flex justify-content-end mt-3">
          <b-button           
          style="background-color: #4b371c; border:  #4b371c; color: white;"           
          @click="closeModal"
            >ปิดหน้าต่าง</b-button
          >
          <b-button 
          style="background-color: #50c1d0; color: black; border:#50c1d0;"
          class="ml-2" 
          @click="saveObject"
            >บันทึก</b-button
          >
        </div>

        <!-- Status Message -->
        <!-- <b-row v-if="statusMessage" class="mt-3">
          <b-col md="12" class="text-center">
            <div class="alert" :class="statusClass">{{ statusMessage }}</div>
          </b-col>
        </b-row> -->
      </b-container>
    </div>
  </span>
</template>

<script>
import axios from "axios";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  name: "CreateObject",
  components: { vSelect },
  data() {
    return {
      objectName: "",
      keywords: [],
      and_keywords: this.andKeywords || [],
      not_keywords: this.notKeywords || [],
      domainId: 1, // ค่า domain_id
      subdomainId: 1383, // ค่า subdomain_id ที่ต้องกำหนด
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
      this.$bvModal.hide("add-object-modal");
    },
    async saveObject() {
      if (!this.objectName.trim()) {
        alert("กรุณากรอกชื่อ Object");
        return;
      }

      if (!this.subdomainId) {
        alert("ไม่พบ Subdomain ID");
        return;
      }

      //ตรวจสอบค่าที่ถูกส่งไป API
      const newObjectData = {
        domain_id: this.domainId,
        subdomain_id: this.subdomainId,
        name: this.objectName.trim(),
        keywords: Array.isArray(this.keywords) ? this.keywords : [],
        and_keywords: Array.isArray(this.andKeywords) ? this.andKeywords : [],
        not_keywords: Array.isArray(this.notKeywords) ? this.notKeywords : [],
      };

      console.log(
        "🔹 ข้อมูลที่ถูกส่งไป API:",
        JSON.stringify(newObjectData, null, 2)
      );

      try {
        const response = await axios.post(
          "https://api2.cognizata.com/api/v2/monitor/postObject",
          // "https://api2.cognizata.com/api/v2/monitor/monitorCandidates"
          newObjectData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Object created successfully:", response.data);

        this.closeModal();

        // รีโหลดหน้าใหม่
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        console.error("Error creating object:", error.response?.data || error);
        alert("เกิดข้อผิดพลาดในการเพิ่ม Object");
      }
    },
    logAndKeywords() {
      console.log("and_keywords ที่ได้รับ:", this.andKeywords);
    },
    logNotKeywords() {
      console.log("not_keywords ที่ได้รับ:", this.notKeywords);
    },
  },
};
</script>

<style scoped>
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
  z-index: 1050; /* ให้ dropdown แสดงอยู่ด้านบน */
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
  background-color: #fddfa2 !important; /* สีเหลืองอ่อน */
  color: rgb(48, 47, 47) !important; /* ปรับสีตัวอักษร */
  font-weight: bold;
  border-radius: 15px;
  padding: 5px 10px;
  margin: 3px;
}

.btn-save {
  background-color: #50c1d0;
  /* background-color: #fdd071; */
  color: white; /* สีตัวอักษร */
  font-size: 16px; /* ขนาดตัวอักษร */
  padding: 10px 20px; /* ระยะห่างด้านใน */
  border: none; /* ลบกรอบ */
  border-radius: 5px; /* มุมโค้งมน */
  cursor: pointer; /* เปลี่ยนเคอร์เซอร์เมื่อ hover */
}

.alert {
  font-size: 16px;
  padding: 10px;
}

</style>
