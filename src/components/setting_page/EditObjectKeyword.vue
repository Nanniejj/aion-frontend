<template>
  <span>
 
    <b-button class="rounded-circle my-2" style="background-color: #7cd1dc; color: black; border:#7cd1dc;"
      v-if="btn == 'icon'" @click="open = true;">
      <i class="fa fa-plus"></i>
    </b-button>
    <b-button size="sm" class="rounded-circle" v-if="btn == 'edit'"
      style="background-color: white; color: #2c3e50; width: 30px; height: 30px; margin-right: 3px;"
      @click="open = true;">
      <i class="fa fa-pencil"></i>
    </b-button>
    <vue-modaltor :visible="open" @hide="closeModal" :animation-panel="'modal-slide-top'"
      :resize-width='{ 3000: "55%", 1200: "70%", 768: "90%" }'>
      <div>
        <!-- {{ domainId }}
      {{ subdomainId }}
      {{ dataKeyword.object_id }} -->
        <!-- {{ dataKeyword }} -->
        <!-- {{ objectData }} -->
        <h5><b>แก้ไขประเด็น</b></h5>
        <hr />
        <p class="text-danger">คำแนะนำ : กรุณาตรวจสอบข้อมูลทุกครั้งก่อนทำการบันทึก</p>
        <b-container>
          <!-- {{ objectData }} -->
          <!-- Object Name -->
          <b-form-group label="ประเด็น" label-class="font-weight-bold">
            <b-form-input v-model="objectName" maxlength="50" required></b-form-input>
            <small class="text-muted">{{ objectName.length }} / 50 ตัวอักษร</small>
            <div v-if="hasForbiddenChars(objectName)" class="text-danger small mt-1">
              <i class="fa fa-exclamation-triangle"></i> ห้ามใส่อักขระพิเศษ  & 
            </div>
          </b-form-group>

          <!-- Keywords -->
          <b-tabs content-class="mt-3" lazy active-nav-item-class="font-weight-bold" nav-item-class="font-weight-bold">
            <b-tab title="Keyword">
              <b-form-tags
                v-model="editKeywords"
                separator=",;"
                placeholder="Enter เพื่อพิมพ์คำใหม่"
                :tag-validator="tagValidator"
                invalid-tag-text="ห้ามใส่อักขระพิเศษ"
              ></b-form-tags>
            </b-tab>

            <b-tab title="Include Keyword">
              <b-form-tags
                v-model="editAndKeywords"
                separator=",;"
                placeholder="Enter เพื่อพิมพ์คำใหม่"
                :tag-validator="tagValidator"
                invalid-tag-text="ห้ามใส่อักขระพิเศษ"
              ></b-form-tags>
              <br />
              <b-alert variant="info" show>
                ใช้ <b>+</b> ในการ AND เช่น <strong>การเมือง + การปกครอง</strong>
              </b-alert>
            </b-tab>

            <b-tab title="Exclude Keyword">
              <b-form-tags
                v-model="editNotKeywords"
                separator=",;"
                placeholder="Enter เพื่อพิมพ์คำใหม่"
                :tag-validator="tagValidator"
                invalid-tag-text="ห้ามใส่อักขระพิเศษ"
              ></b-form-tags>
            </b-tab>
          </b-tabs>

          <!-- ปุ่มบันทึก & ปิด -->
          <div class="d-flex justify-content-end mt-3">
            <b-button style="background-color: #646462; border:  #646462;" @click="closeModal">ปิดหน้าต่าง</b-button>
            <b-button class="ml-2" style="background-color: #50c1d0; color: black; border:#50c1d0;"
              :disabled="saving || objectName.trim().length === 0 || hasForbiddenChars(objectName)"
              @click="updateObject">{{ saving ? "กำลังบันทึก..." : "บันทึก" }}</b-button>
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
  name: "EditObjectKeyword",
  components: { vSelect },
  props: {
    // dataKeyword: Object,
    btn: String,
    objectId: Number,
    subdomainId: Number,
    objectData: { type: Object }

  },

  data() {
    return {
      open: false,
      objectName: "",
      editKeywords: [],
      editAndKeywords: [],
      editNotKeywords: [],
      saving: false,
    };
  },

  watch: {
    // โหลดข้อมูลจาก objectData "ตอนเปิด modal" เท่านั้น
    // (เดิมใช้ deep watcher กับ objectData ซึ่ง parent สร้างเป็น object ใหม่ทุกครั้งที่ re-render
    //  → loadData() ถูกเรียกซ้ำเรื่อยๆ และทับค่าที่ผู้ใช้กำลังแก้อยู่ระหว่างเปิด modal
    //  และกด "ปิดหน้าต่าง" แล้วเปิดใหม่ ค่าที่ยังไม่บันทึกก็ค้างอยู่)
    open(isOpen) {
      if (isOpen) this.loadData();
    },
  },
  methods: {
    // ตรวจว่ามีอักขระพิเศษต้องห้ามอยู่ใน string หรือไม่
    // (กฎเดียวกับ ImportObject.vue / CreateObject.vue / ฯลฯ ทั้งแอป)
    // อนุญาตตัวอักษรไทย/อังกฤษ ตัวเลข เว้นวรรค และเครื่องหมาย . - ( )
    hasForbiddenChars(value) {
      const forbiddenPattern = /&/
      return forbiddenPattern.test(String(value || ""));
    },
    // ใช้กับ b-form-tags prop tag-validator — return false จะปฏิเสธไม่ให้เพิ่ม tag นั้นเลย
    tagValidator(tag) {
      return !this.hasForbiddenChars(tag);
    },
    closeModal() {
      if (this.saving) return;
      this.open = false;
    },

    async updateObject() {
      if (this.saving) return;

      if (!this.objectName.trim()) {
        this.$fire({ title: "กรุณากรอกชื่อประเด็น", type: "warning", confirmButtonText: "ตกลง" });
        return;
      }

      if (this.hasForbiddenChars(this.objectName)) {
        this.$fire({ title: "ชื่อประเด็นห้ามมีอักขระพิเศษ &", type: "warning", confirmButtonText: "ตกลง" });
        return;
      }

      // เดิมเขียนเงื่อนไขกลับด้าน (!objectData && objectData.object_id) → ไม่เคยตรวจจริง
      // และถ้าไม่มี subdomain_id จะส่ง body ว่าง {} ไป PUT ซึ่งเสี่ยงล้าง keyword ทิ้ง
      const data = this.objectData || {};
      if (!data.object_id) {
        this.$fire({ title: "ไม่พบประเด็น (Object ID)", text: "กรุณารีเฟรชหน้าแล้วลองใหม่", type: "error", confirmButtonText: "ตกลง" });
        return;
      }
      if (!data.subdomain_id) {
        this.$fire({ title: "ไม่พบหมวดหมู่ (Subdomain ID)", text: "กรุณารีเฟรชหน้าแล้วลองใหม่", type: "error", confirmButtonText: "ตกลง" });
        return;
      }

      const updatedObjectData = {
        domain_id: this.$route.query.id,
        name: this.objectName.trim(),
        subdomain_id: data.subdomain_id,
        keywords: this.editKeywords,
        and_keywords: this.editAndKeywords,
        not_keywords: this.editNotKeywords,
      };

      this.saving = true;
      try {
        const response = await axios.put(
          `https://api2.cognizata.com/api/v2/setting/updateKeywords/${data.object_id}`,
          updatedObjectData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );
        this.$store.dispatch("resetDomainLastUpdate", this.$route.query.id);
        this.$emitter.emit("callApiListSubdomain", response.data);
        this.open = false;
        this.$fire({
          title: "บันทึกข้อมูลสำเร็จ",
          type: "success",
          showConfirmButton: false,
          timer: 1000,
        });
      } catch (error) {
        console.error("Error updating object:", error.response?.data || error);
        // ใช้ SweetAlert แบบเดียวกับตอนบันทึกหมวดหมู่ (เดิมใช้ popup alert ของเบราว์เซอร์)
        this.$fire({ title: "แก้ไขประเด็นไม่สำเร็จ", text: error.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", type: "error", confirmButtonText: "ตกลง" });
      } finally {
        this.saving = false;
      }
    },

    loadData() {
      if (this.objectData) {
        //console.log("โหลดข้อมูลใหม่:", this.dataKeyword);
        this.objectName = this.objectData.object_name || "";
        this.editKeywords = [...(this.objectData.keywords || [])];
        this.editAndKeywords = [...(this.objectData.and_keywords || [])];
        this.editNotKeywords = [...(this.objectData.not_keywords || [])];
      }
    },
  },

  mounted() {
    this.loadData();
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
}

.icon-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  margin-top: 25px;
}

::v-deep .nav-tabs .nav-item .nav-link {
  color: #2c3e50;
  font-weight: normal !important;
  /* ตัวอักษรปกติ */
}

::v-deep .nav-tabs .nav-item .nav-link.active {
  font-weight: bold !important;
  /* ตัวหนาเมื่อ active */
}


/* สีใน keyword  */
::v-deep .b-form-tags .b-form-tag {
  color: #2c3e50;
  background-color: #f5f1eb !important;

  border-radius: 15px;
  padding: 5px 10px;
  margin: 3px;
}

.btn-save {
  background-color: #50c1d0;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.alert {
  font-size: 16px;
  padding: 10px;
}
</style>