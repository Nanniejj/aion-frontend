<template>
  <div>
    <b-container>
      <!-- วนลูปแสดง Subdomains -->
      <!-- Search Input with Icon -->
      <b-row class="justify-content-md-end">
        <b-col>
          <div class="h4 text-left bold">เรื่อง {{ $route.params.domain }}</div>
        </b-col>
        <!-- Input Field with Search Icon -->
        <b-col cols="12" sm="12" md="4" lg="4" class="mt-2 mt-md-0 pr-md-0 mr-md-2">
          <!-- ช่องค้นหา -->

          <!-- <b-form-input placeholder="ค้นหา" class="input-group-text text-left"
          ></b-form-input> -->

          <b-input-group>
            <b-input-group-prepend>
              <span class="input-group-text">
                <i class="fa fa-search"></i>
              </span>
            </b-input-group-prepend>
            <b-form-input ref="searchInput" @input="checkSearch()" v-model="searchQuery" placeholder="ค้นหา" class="input-group-text text-left"></b-form-input>
            <b-input-group-append>
              <b-button @click="filterSubdomains" pill style="position: relative;right: 15px;background-color: #777676">
                ค้นหา
              </b-button> <!-- ✅ ปุ่มค้นหา  -->
            </b-input-group-append>
          </b-input-group>
        </b-col>

        <!-- Button +subdomain -->

        <b-col cols="12" md="auto" class="mt-4 mt-md-0 pl-md-0">
          <AddSubDomain :domainId="domainId" />
          <!-- <b-button pill class="w-100 w-md-auto" style="background-color: #7cd1dc; color: black; border:#7cd1dc;"
            @click="openAddSubdomainModal">
            <i class="fa fa-plus"></i> เพิ่ม Subdomain
          </b-button> -->
        </b-col>
      </b-row>

      <!-- suggestionKeywords -->
      <b-row v-if="suggestionKeywrords.length !== 0" class="m-0 py-2 mt-2">
        <b-col cols="12" class="text-left px-0">
            <h5>keyword ที่แนะนำ</h5>
        </b-col>
        <b-col cols="12" class="px-0">
            <b-row class="m-0">
                <b-col cols="auto" class="pl-0 px-1 mb-2" v-for="(keyword,index) in suggestionKeywrords" :key="index + keyword">
                    <div @click="copyToClipboard(keyword)" class="bage-keyword" v-b-tooltip.hover title="คลิกเพื่อ 'คัดลอก' ">
                        {{ keyword }}
                    </div>
                </b-col>
            </b-row>
        </b-col>
      </b-row>
      <br />
      <div v-if="loadWord">
        <vue-element-loading :active="loadWord" size="50" background-color="rgba(255, 255, 255, 0.1)"
          spinner="line-scale" color="#7cd1dc" />
      </div>
      <!-- ก้อน subdomain สีฟ้า -->
      <div v-else class="mb-4">
        <b-col class="px-0 pb-3">
          <div class="h5 text-left bold">หมวดหมู่</div>
        </b-col>
        <ObjectCard 
            v-for="(subdomain, subIndex) in filteredSubdomains" :key="subdomain.subdomain_id" 
            :subdomain="subdomain"
            :searchQuery="keyword"
            @edit-subDomain="editSubdomain(subIndex)"
            @delete-subDomain="openDeleteSubdomainModal(subIndex, subdomain)"
            @reset="apiList"
        />
       </div>

      <!-- edit subdomain -->
      <b-modal v-b-modal.modal-center id="edit-subdomain-modal" ref="editSubdomainModal" @hidden="resetEditModal"
        :ok-only="true" class="custom-modal" centered>
        <!-- Form for Editing Subdomain -->
        <b-form ref="editForm" @submit.prevent="handleEditSubdomain" class="custom-form">
          <h5><b>แก้ไขหมวดหมู่</b></h5>
          <hr>
          <b-form-group label-for="edit-subdomain">
            <b-form-input id="edit-subdomain" v-model="editSubdomainName" required class="subdomain-input"
              maxlength="50"></b-form-input>
          </b-form-group>
          <small class="text-muted">{{ editSubdomainName.length || 0 }} / 50 ตัวอักษร</small>
          <!-- Buttons for Submit -->
          <div class="d-flex justify-content-end mt-3">
            <b-button class="btn-submit" @click="handleEditSubdomain" :disabled="editSubdomainName.length == 0">
              บันทึก
            </b-button>
          </div>
        </b-form>
      </b-modal>

      <!-- Modal สำหรับลบ subdomain -->
      <b-modal id="confirm-delete-subdomain-modal" title="ยืนยันการลบ Subdomain" hide-footer>
        <b-form @submit.prevent="handleDeleteSubdomain" centered>

          <p>
            คุณต้องการลบ <strong>{{ deleteSubdomainName }}</strong> หรือไม่?
          </p>

          <div class="d-flex justify-content-end mt-3">
            <b-button class="mr-2" variant="secondary" @click="closeDeleteModal">ยกเลิก</b-button>
            <b-button variant="danger" type="submit">ลบ</b-button>
          </div>
        </b-form>
      </b-modal>


      <b-modal id="add-object-modal" v-model="showObjectModal" size="lg" hide-footer
        content-class="custom-modal-content" centered>
        <template #modal-title>
          <h5 class="custom-modal-title font-weight-bold">เพิ่มประเด็น</h5>
        </template>

        <CreateObject @close="showObjectModal = false" :objectData="clickAddObj" v-if="clickAddObj" />
      </b-modal>

      <!-- edit Object1 -->
      <b-modal v-b-modal.modal-center id="edit-object-modal" ref="editObjectModal" @hidden="resetEditModal"
        :ok-only="true" class="custom-modal" centered>
        <!-- Form สำหรับแก้ object -->
        <b-form ref="editForm" @submit.prevent="handleEditObject" class="custom-form">
          <b-form-group label="แก้ไขชื่อ Object" label-for="edit-object">
            <b-form-input id="edit-object" v-model="editObjectName" required class="object-input"></b-form-input>
          </b-form-group>

          <!-- ปุ่มอัพเดท  -->
          <div class="d-flex justify-content-end mt-3">
            <b-button class="btn-submit" @click="handleEditObject">
              submit
            </b-button>
          </div>
        </b-form>
      </b-modal>

      <!-- Modal สำหรับลบ Object -->
      <b-modal id="confirm-delete-object-modal" title="ยืนยันการลบ Object" hide-footer class="py-3" centered>
        <b-form @submit.prevent="handleDeleteObject">


          <p>
            คุณต้องการลบ <strong>{{ deleteObjectName }}</strong> หรือไม่?
          </p>

          <div class="d-flex justify-content-end mt-3">
            <b-button class="mr-2" variant="secondary" @click="closeDeleteObjectModal">
              ยกเลิก
            </b-button>
            <b-button variant="danger" type="submit">ลบ</b-button>
          </div>
        </b-form>
      </b-modal>
      <b-modal id="edit-object-keyword-modal" v-model="showEditModal" size="lg" hide-footer
        content-class="custom-modal-content" centered>
        <template #modal-title>
          <h5 class="custom-modal-title font-weight-bold">แก้ไขข้อมูล Objects</h5>
        </template>

        <EditObjectKeyword @close="showEditModal = false" :dataKeyword="dataKeyword" :subdomainId="activeSubdomainId"
          :objectId="activeObjectId" :objectData="clickEditObj" />
      </b-modal>
    </b-container>
  </div>
</template>

<script>
import Highlighter from "vue-highlight-words";
import CreateObject from "./CreateObject.vue";
import EditObjectKeyword from "./EditObjectKeyword.vue";
import AddSubDomain from "./AddSubDomain.vue";
import ObjectCard from "./ObjectCard.vue";
export default {
  name: "SubdomainCard",
  components: {
    CreateObject,
    EditObjectKeyword,
      Highlighter,
    ObjectCard,
    AddSubDomain
  },
  // watch: {
  //   searchQuery: _.debounce(function (newQuery) {
  //     this.filterSubdomains(newQuery);
  //   }, 100), // หน่วง 300ms เพื่อป้องกันการประมวลผลบ่อยเกินไป
  // },

  data() {
      return {
        keyword : '',
      filteredSubdomains: [],
      loadWord: false,
      clickEditObj: "",
      clickAddObj: "",
      dataKeyword: "",
      searchQuery: "",
      showObjectModal: false, // State for showing/hiding the modal
      showEditModal: false, // State for showing/hiding the modal
      dataKeyword: {},
      activeSubdomainId: null, // ใช้เก็บ subdomain_id ที่ active
      activeObjectId: null, // ใช้เก็บ object_id ที่ active
      subdomains: [],
      keywords: [],
      buttonColor: "#7cd1dc",
      newKeyword: "",
      newSubdomainName: "", // เก็บค่าชื่อ Subdomain
      newDomainId: this.$route.query.id, // ค่าเริ่มต้นของ Domain ID (เปลี่ยนได้ตามต้องการ)
      activeSubdomainIndex: null,
      editSubdomainIndex: null, // เก็บ index ของ subdomain ที่กำลังแก้ไข
      editSubdomainName: "", // เก็บค่าชื่อใหม่ของ Subdomain
      editObjectIndex: null, // เก็บ index ของ subdomain ที่กำลังแก้ไข
      editObjectName: "", // เก็บค่าชื่อใหม่ของ Subdomain
      addKeywordIndex: null, // เก็บ index ของ keyword ที่กำลังแก้ไข
      addKeywordName: "", // เก็บค่าชื่อใหม่ของ keyword
      newSubdomainId: 1, // ค่า Subdomain ID เริ่มต้น
      activeSubdomainIndex: null,
      domainId: null, //เก็บค่า domain_id จาก API
      newSubdomainId: null, //ใช้แสดง Subdomain ID ใน Modal
      deleteSubdomainName: "", //ใช้แสดงชื่อ Subdomain ใน Modal
      deleteSubdomainIndex: null, //ก็บ index ของ Subdomain ที่ต้องการลบ
      deleteObjectIndex: null, // index ของ Object ที่ต้องการลบ
      deleteSubdomainIndex: null, // index ของ Subdomain ที่มี Object นี้
      deleteObjectId: null, // ID ของ Object ที่ต้องลบ
      deleteObjectName: "", // ชื่อ Object ที่จะแสดงใน Modal
        suggestionKeywrords: [],
      subdomainKeywords:[]
    };
  },
  computed: {
   
  },
    methods: {
    copyToClipboard(text) {
      if (navigator.clipboard && window.isSecureContext) {
        // วิธีใหม่ (modern browsers)
        navigator.clipboard.writeText(text).then(() => {
          this.$bvToast.toast("คัดลอกแล้ว: " + text, {
            title: "สำเร็จ",
            variant: "success",
            solid: true,
            autoHideDelay: 1000 
          });
        });
      } else {
        // วิธี fallback
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = 0;
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
          document.execCommand("copy");
          this.$bvToast.toast("คัดลอกแล้ว: " + text, {
            title: "สำเร็จ",
            variant: "success",
            solid: true,
            autoHideDelay: 1000 
          });
        } catch (err) {
          console.error("ไม่สามารถคัดลอก", err);
        }
        document.body.removeChild(textarea);
      }
    },
    checkSearch() {
        if (!this.searchQuery) {
            this.keyword = ''
            // this.filterSubdomains();
            // this.apiList();
        }
    },
    filterSubdomains() {
        // this.loadWord = true
        const query = (this.searchQuery || '').trim().toLowerCase();
            console.log("query === ",query,this.subdomains);
            
        if (!query) {
            // this.filteredSubdomains = this.subdomains.filter(sub => sub.display !== false);
            // this.loadWord = false
            this.keyword = ''
            return;
        } else {
            this.keyword = query
            console.log('keyword ==== ',this.keyword);
            
        }
        // else {
        //     this.filteredSubdomains = this.subdomains.filter(subdomain =>
        //         subdomain.subdomain_name &&
        //         subdomain.subdomain_name.toLowerCase().includes(query)
        //     );
        //     this.loadWord = false
        // }

    //   this.filteredSubdomains = this.subdomains.filter(subdomain => {
    //     if (subdomain.display === false) return false;
    //     const filterableData = JSON.stringify(this.extractSearchableFields(subdomain)).toLowerCase();
    //     return filterableData.includes(query);
    //       });
    //     this.loadWord = false
      console.log("serch === ", this.filteredSubdomains);
      
    },

    extractSearchableFields(obj) {
      // ✅ ฟังก์ชันลบ `id` และค่าที่ไม่ต้องการก่อนค้นหา
      if (Array.isArray(obj)) {
        return obj.map(item => this.extractSearchableFields(item));
      } else if (typeof obj === "object" && obj !== null) {
        return Object.fromEntries(
          Object.entries(obj)
            .filter(([key, value]) =>
              !key.includes("id") && // กรอง `id`
              key !== "display" && // กรอง `display`
              key !== "activeObjectId" &&
              key !== "activeObjectIndex"
            )
            .map(([key, value]) => [key, this.extractSearchableFields(value)])
        );
      }
      return obj;
    },

    toTableWord(item) {
      console.log('sub', item);
      let name = this.$route.params.domain;

      // กำหนดค่า route ใหม่ที่ต้องการนำทางไป
      const newRoute = {
        name: "SettingWord",
        params: { subdomain: item.subdomain_name },
        query: { id: this.$route.query.id, subdomain_id: item.subdomain_id }
      };

      this.$router.replace(newRoute);
    },
    clickObject(data) {
      this.clickAddObj = data
      console.log('clickAddObj', this.clickAddObj);
      this.showObjectModal = true;
    },
    downloadCSV() {
      const csv = Papa.unparse(this.data);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    toPopup(item, data) {
      this.clickEditObj = data
      console.log('item', item, data);
      this.showEditModal = true;
      this.dataKeyword = item;
    },
    async apiList() {
      this.loadWord = true
      try {
        const config = {
          method: "get",
          // url: "http://localhost:3000/api/v2/monitor/getSetting",
          url: "https://api2.cognizata.com/api/v2/setting/getSetting",
          params: { domain_id: this.$route.query.id },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        };
        const response = await this.axios(config);

        console.log("ดึงข้อมูลสำเร็จ apiList:", response.data);

        if (response.data.domain_id) {
          this.domainId = response.data.domain_id; //เซ็ตค่า domain_id ที่ได้จาก API
          //แปลงข้อมูล Subdomains โดยตั้งค่า display เป็น true ถ้าไม่มีค่า
          this.subdomains = response.data.subdomains.map((subdomain) => {
            const firstObject =
              subdomain.objects.length > 0 ? subdomain.objects[0] : null;
            return {
              ...subdomain,
              display: subdomain.display !== false, //ถ้าไม่มีค่า ให้ถือว่าเป็น true
              activeObjectId: firstObject ? firstObject.object_id : null,
              activeObjectIndex: firstObject ? 0 : null,
              datakeyword: firstObject || {},
            };
          });
            this.filteredSubdomains = this.subdomains
            this.loadWord = false
        }
        this.subdomainKeywords = this.collectKeywords(this.subdomains)
        
        console.log("ดึงข้อมูลสำเร็จ2:", this.subdomains);
      } catch (error) {
        this.loadWord = false
        console.error("Error fetching API:", error);
      }
    },
    async apiGetSuggestionKeywrords() {
        // this.loadWord = true
        try {
            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/aiservice/getSuggestionKewrords",
                params: { domain_id: this.$route.query.id },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };
            const response = await this.axios(config);
            // this.loadWord = false;
            if (response && response.data && response.data.length > 0) {
                console.log("res === ", response);
                let data = response.data[0];
                this.suggestionKeywrords = data.keywords;
                console.log(data);
            } else {
                console.log("No data found");
                this.suggestionKeywrords = []
            }
            
        } catch (error) {
            // this.loadWord = false
            this.suggestionKeywrords = []
            console.error("Error fetching API:", error);
        }
    },

    async handleEditSubdomain() {
      if (this.editSubdomainIndex === null || !this.editSubdomainName.trim())
        return;

      const subdomain = this.subdomains[this.editSubdomainIndex];
      const updatedSubdomainData = {
        domain_id: this.$route.query.id, // ค่าที่ต้องส่ง
        name: this.editSubdomainName.trim(),
      };

      try {
        const response = await this.axios.put(
          `https://api2.cognizata.com/api/v2/setting/putSubdomain/${subdomain.subdomain_id}`,
          updatedSubdomainData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          // // อัปเดตค่าชื่อในตัวแปร subdomains
          // this.subdomains[
          //   this.editSubdomainIndex
          // ].subdomain_name = this.editSubdomainName;
          // console.log(
          //   "แก้ไขชื่อ Subdomain updated successfully:",
          //   response.data
          // );

          this.$fire({
            title: "บันทึกข้อมูลสำเร็จ",
            type: "success",
            showConfirmButton: false,
            timer: 1000,
          });
          this.apiList()
          this.closeEditModal();
        }
      } catch (error) {
        console.error("Error updating subdomain:", error);
      }
    },

    async addObject(subIndex) {
      const subdomain = this.subdomains[subIndex];
      if (!subdomain) return;

      const newObject = {
        subdomain_id: subdomain.subdomain_id,
        object_name: "New Object",
      };

      try {
        const response = await this.axios.post(
          "https://api2.cognizata.com/api/v2/setting/postObject",
          newObject,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          // อัปเดต `subdomains` ให้ Object ใหม่แสดงผล
          subdomain.objects.push(response.data);
          // console.log("Object added successfully:", response.data);
        }
      } catch (error) {
        // console.error("Error adding object:", error);
      }
    },

    async handleEditObject() {
      // console.log("handleEditObject() ถูกเรียก");

      if (this.editObjectIndex === null || !this.editObjectName.trim()) {
        console.error("editObjectIndex หรือ editObjectName ว่าง!");
        return;
      }

      const subdomain = this.subdomains[this.editObjectSubdomainIndex];
      const object = subdomain.objects[this.editObjectIndex];

      if (!object) {
        console.error("Object ไม่พบในรายการ!");
        return;
      }

      const updatedObjectData = {
        domain_id: 1,
        subdomain_id: subdomain.subdomain_id,
        name: this.editObjectName.trim(),
      };

      try {
        console.log("กำลังอัปเดต Object:", object.object_id, updatedObjectData);

        const response = await this.axios.put(
          `https://api2.cognizata.com/api/v2/setting/updateKeywords/${object.object_id}`,
          updatedObjectData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          console.log("Object updated successfully:", response.data);

          // อัปเดตค่าชื่อ Object ใน List
          this.subdomains[this.editObjectSubdomainIndex].objects[
            this.editObjectIndex
          ].object_name = this.editObjectName;

          // ปิด Modal
          this.$bvModal.hide("edit-object-modal");
        }
      } catch (error) {
        console.error("Error updating object:", error);
      }
    },
    async handleAddKeyword() {
      if (!this.newKeyword.trim()) {
        alert("กรุณากรอก Keyword");
        return;
      }

      const subdomain = this.subdomains[this.activeSubdomainIndex];
      const object = subdomain.objects[this.activeObjectIndex];

      if (!object) {
        console.error("Object ไม่พบในรายการ!");
        return;
      }

      if (!Array.isArray(object.keywords)) {
        object.keywords = [];
      }

      const updatedKeywords = [...object.keywords, this.newKeyword.trim()];

      try {
        const response = await this.axios.put(
          `https://api2.cognizata.com/api/v2/setting/putObject/${object.object_id}`,
          {
            domain_id: subdomain.domain_id,
            subdomain_id: subdomain.subdomain_id,
            name: object.object_name,
            keywords: updatedKeywords,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          console.log("Keyword added successfully:", response.data);
          object.keywords = updatedKeywords;
          this.newKeyword = "";
          this.$bvModal.hide("add-keyword-modal");
        }
      } catch (error) {
        console.error("Error adding keyword:", error);
        alert("เกิดข้อผิดพลาดในการเพิ่ม Keyword");
      }
    },


    async handleDeleteSubdomain() {
      const subdomainId = this.newSubdomainId;
      const domainId = this.$route.query.id; //ใช้ค่า domain_id ที่ดึงมาจาก API

      console.log("ลบ Subdomain:", { subdomainId, domainId });

      try {
        const response = await this.axios.delete(
          `https://api2.cognizata.com/api/v2/setting/deleteSubdomain/${subdomainId}`,
          {
            params: { domain_id: domainId }, //ส่ง domain_id ไปใน params
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        console.log("ลบสำเร็จ:", response.data);

        this.closeDeleteModal();
        this.$fire({
          title: "บันทึกข้อมูลสำเร็จ",
          type: "success",
          showConfirmButton: false,
          timer: 1000,
        });
        this.apiList()

      } catch (error) {
        console.error(
          "Error deleting subdomain:",
          error.response?.data || error
        );
        alert(
          "เกิดข้อผิดพลาดในการลบ Subdomain: " +
          (error.response?.data?.message || "ไม่ทราบสาเหตุ")
        );
      }
    },
    setActive(subIndex, objectId, object) {
      console.log("setActive() ถูกเรียก: subdomainIndex =", subIndex, "objectId =", objectId);

      //หา index จริงของ subdomain ใน subdomains[]
    //   const realSubIndex = this.subdomains.findIndex(
    //     (sub) =>
    //       sub.subdomain_id === this.filteredSubdomains[subIndex].subdomain_id
    //   );

    //   if (realSubIndex === -1) return;

      const subdomain = this.subdomains[subIndex];

    //   //หา index จริงของ object ใน subdomain
    //   const realObjIndex = subdomain.objects.findIndex(
    //     (obj) => obj.object_id === objectId
    //   );

    //   if (realObjIndex === -1) return;

      subdomain.activeObjectId = objectId;
      subdomain.datakeyword = object;
      subdomain.activeObjectIndex = objectId;

      this.activeSubdomainIndex = subIndex;
      this.activeObjectIndex = objectId;
      this.activeSubdomainId = subdomain.subdomain_id;
      this.activeObjectId = objectId;
    //   this.dataKeyword = { ...object };

    //   console.log("activeSubdomainId:", this.activeSubdomainId);
    //   console.log("activeObjectId:", this.activeObjectId);
    //   console.log("dataKeyword:", this.dataKeyword);
    //   // **บันทึกค่า Active Object ลงใน LocalStorage**
    //   localStorage.setItem("active_subIndex", subIndex);
    //   localStorage.setItem("active_objectId", objectId);
    //   localStorage.setItem("active_object", JSON.stringify(object));
    //   console.log("Active Subdomain ID:", this.activeSubdomainId);
    //   console.log("Active Object ID:", this.activeObjectId);
    },


    resetAddSubdomainModal() {
      this.newSubdomainName = "";
      this.newDomainId = this.$route.query.id;
    },
    editSubdomain(subIndex) {
      // ค้นหา index จริงของ subdomain ใน subdomains[]
      const realSubIndex = this.subdomains.findIndex(
        (sub) =>
          sub.subdomain_id === this.filteredSubdomains[subIndex].subdomain_id
      );

      if (realSubIndex === -1) return; // ถ้าไม่เจอ ให้หยุดทำงาน

      // ใช้ index จริงแทนที่ index ที่ได้จาก filteredSubdomains
      this.editSubdomainIndex = realSubIndex;
      this.editSubdomainName = this.subdomains[realSubIndex].subdomain_name;

      console.log("กำลังแก้ไข Subdomain:", this.editSubdomainName);
      this.$bvModal.show("edit-subdomain-modal");
    },
    openDeleteSubdomainModal(subIndex, item) {

      this.newDomainId = this.$route.query.id;
      this.newSubdomainId = item.subdomain_id;
      this.deleteSubdomainName = item.subdomain_name;

      console.log("กำลังลบ Subdomain:", this.deleteSubdomainName);
      this.$bvModal.show("confirm-delete-subdomain-modal");
    },
    confirmDeleteSubdomain() {
      if (
        this.deleteSubdomainIndex === null ||
        this.deleteSubdomainIndex === undefined
      ) {
        return;
      }

      const subIndex = this.deleteSubdomainIndex;
      const subdomainId = this.subdomains[subIndex]?.subdomain_id;

      if (!subdomainId) {
        alert("ไม่พบข้อมูล Subdomain");
        return;
      }

      this.axios
        .delete(
          `https://api2.cognizata.com/api/v2/setting/deleteSubdomain/${subdomainId}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then(() => {
          this.subdomains.splice(subIndex, 1);
          this.closeDeleteModal();
        })
        .catch((error) => {
          console.error("Error deleting subdomain:", error);
          alert("เกิดข้อผิดพลาดในการลบ Subdomain");
        });
    },
    closeDeleteModal() {
      this.deleteSubdomainIndex = null;
      this.deleteSubdomainName = "";
      this.$bvModal.hide("confirm-delete-subdomain-modal");
    },
    deleteSubdomain(subIndex) {
      const confirmation = confirm(
        `Are you sure you want to delete "${this.subdomains[subIndex].subdomain_name}"?`
      );

      if (confirmation) {
        this.subdomains.splice(subIndex, 1);
        console.log(`Deleted subdomain at index: ${subIndex}`);
      }
    },
    openAddObjectModal(subIndex) {
      this.activeSubdomainIndex = subIndex;
      this.newSubdomainId = this.subdomains[subIndex].subdomain_id; // ดึงค่า Subdomain ID อัตโนมัติ
      this.newObjectName = "";
      this.$bvModal.show("add-object-modal");
    },
    editObject(subIndex, objIndex) {
      console.log(
        "editObject() ถูกเรียก: subIndex =",
        subIndex,
        "objIndex =",
        objIndex
      );

      // หา index จริงของ subdomain ใน subdomains[]
      const realSubIndex = this.subdomains.findIndex(
        (sub) =>
          sub.subdomain_id === this.filteredSubdomains[subIndex].subdomain_id
      );

      if (realSubIndex === -1) {
        console.error("ไม่พบ subdomain");
        return;
      }

      const subdomain = this.subdomains[realSubIndex];

      // หา index จริงของ object ใน subdomains
      const realObjIndex = subdomain.objects.findIndex(
        (obj) =>
          obj.object_id ===
          this.filteredSubdomains[subIndex].objects[objIndex].object_id
      );

      if (realObjIndex === -1) {
        console.error("ไม่พบ Object");
        return;
      }

      //ส่งค่า object + subdomain_id ไปที่ EditObjectKeyword.vue
      this.dataKeyword = {
        ...subdomain.objects[realObjIndex], // ค่าของ Object
        subdomain_id: subdomain.subdomain_id, // เพิ่มค่า subdomain_id
      };

      this.activeSubdomainId = subdomain.subdomain_id; //บันทึกค่า subdomain_id
      this.activeObjectId = subdomain.objects[realObjIndex].object_id; //บันทึกค่า object_id

      console.log("กำลังแก้ไข Object:", this.dataKeyword);
      console.log("ส่งค่า activeSubdomainId:", this.activeSubdomainId);
      console.log("ส่งค่า activeObjectId:", this.activeObjectId);

      this.showEditModal = true;
    },
    openDeleteObjectModal(subIndex, objIndex, item) {
      console.log(
        "openDeleteObjectModal(): subIndex =",
        subIndex,
        "objIndex =",
        objIndex,
        "item", item
      );


      this.deleteObjectName = item.object_name;
      this.deleteObjectId = item.object_id;

      console.log("Object ที่ต้องการลบ:", this.deleteObjectName);
      this.$bvModal.show("confirm-delete-object-modal");
    },
    async handleDeleteObject() {
      const objectId = this.deleteObjectId;

      try {
        await this.axios.delete(
          `https://api2.cognizata.com/api/v2/setting/deleteObject/${objectId}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        // // ลบ Object ออกจาก Array
        // this.subdomains[subIndex].objects.splice(objIndex, 1);
        this.apiList()
        this.closeDeleteObjectModal();
        console.log("Object deleted successfully:", objectId);

        this.$fire({
          title: "บันทึกข้อมูลสำเร็จ",
          type: "success",
          showConfirmButton: false,
          timer: 1000,
        });
      } catch (error) {
        console.error("Error deleting object:", error);
        alert("เกิดข้อผิดพลาดในการลบ Object");
      }
    },

    closeDeleteObjectModal() {
      this.deleteObjectIndex = null;
      this.deleteObjectId = null;
      this.deleteObjectName = "";
      this.$bvModal.hide("confirm-delete-object-modal");
    },
    deleteKeyword(subdomainIndex, type, index) {
      const subdomain = this.subdomains[subdomainIndex];
      if (subdomain && subdomain.datakeyword[type]) {
        subdomain.datakeyword[type].splice(index, 1);
      }
    },
    addKeyword(subIndex) {
      console.log("เปิด Modal เพิ่ม Keyword:", "subIndex:", subIndex);

      this.activeSubdomainIndex = subIndex;
      const subdomain = this.subdomains[subIndex];

      // ตรวจสอบว่ามี activeObjectIndex หรือไม่
      if (
        subdomain.activeObjectIndex === null ||
        subdomain.activeObjectIndex === undefined
      ) {
        alert("กรุณาเลือก Object ก่อนเพิ่ม Keyword");
        return;
      }

      this.activeObjectIndex = subdomain.activeObjectIndex; // ใช้ค่าที่กำหนดไว้
      this.addKeywordName = ""; // รีเซ็ตค่า input
      this.$bvModal.show("add-keyword-modal");
    },
    openAddKeywordModal(subIndex, objIndex) {
      this.activeSubdomainIndex = subIndex;
      this.activeObjectIndex = objIndex;
      this.newKeyword = "";
      this.$bvModal.show("add-keyword-modal");
    },
    resetAddKeywordModal() {
      this.newKeyword = "";
    },

    AddKeywordModal(subIndex, objIndex) {

      this.activeSubdomainIndex = subIndex;
      this.activeObjectIndex = objIndex;
      this.newKeyword = ""; // รีเซ็ตค่า
      this.$bvModal.show("add-keyword-modal");
    },
    closeEditModal() {
      this.$bvModal.hide("edit-subdomain-modal");
      this.editSubdomainIndex = null;
      this.editSubdomainName = "";
      this.$bvModal.hide("edit-object-modal");
      this.editObjectIndex = null;
      this.editObjectName = "";
    },
    resetEditModal() {
      this.editSubdomainIndex = null;
      this.editSubdomainName = "";
      this.editObjectIndex = null;
      this.editObjectName = "";
    },

    closeModal() {
      this.$emit("close"); // แจ้งให้ Parent Component ปิด Modal
    },

    resetKeywordModal() {
      this.newKeyword = "";
    },

    resetModal() {
      this.newKeyword = "";
    },
    handleSubmit() {
      //เพิ่ม keyword
      const subdomain = this.subdomains[this.activeSubdomainIndex];
      if (subdomain?.datakeyword.keywords) {
        subdomain.datakeyword.keywords.push(this.newKeyword);
      }
      this.closeModal();
    },
    collectKeywords(data) {
        return [
            ...new Set(
            data.flatMap(subdomain => subdomain.datakeyword.keywords)
            )
        ];
    }
  },
  async mounted() {
    await this.apiList();
    await this.apiGetSuggestionKeywrords();
    await this.$emitter.on("callApiListSubdomain", async () => {
      await this.apiList()
      this.$nextTick(() => {
        this.filterSubdomains()
      });
      // this.filterSubdomains()
    });
    // this.filteredSubdomains = [...this.subdomains];
    // this.filterSubdomains(this.searchQuery)

    },
};
</script>
<style>
.modal-title {
  margin-top: 20px;
  /* padding: 20px !important; */
}
</style>
<style scoped>
.bage-keyword{
    background-color: rgb(213, 246, 250);
    /* padding: 10px;
    padding-right: 20px;
    padding-left: 20px;
    border-radius: 10px;
    cursor: pointer; */
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 6px 12px;
    /* background: #2c3e50;
    color: #bef7fe; */
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    position: relative;
    overflow: hidden;
    transition: all 0.5s ease;
}
/* เอฟเฟกต์ข้อความ */
.bage-keyword span {
  position: relative;
  z-index: 2;
}

/* เลเยอร์ไฟ holographic */
.bage-keyword::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    0deg,
    transparent,
    transparent 30%,
    rgba(0, 255, 255, 0.3)
  );
  transform: rotate(-45deg);
  transition: all 0.5s ease;
  opacity: 0;
}

/* hover effect */
.bage-keyword:hover {
  transform: scale(1.05);
  background: #2c3e50;
  color: #bef7fe;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
}

.bage-keyword:hover::before {
  opacity: 1;
  transform: rotate(-45deg) translateY(100%);
}

/* กดคัดลอกแล้ว */
.bage-keyword.copied {
  background: #0ff !important;
  color: #000 !important;
  box-shadow: 0 0 20px #0ff;
}

.highlight-search {
  background-color: #fdd071ab;
  padding: 0 2px;
}

.input-group-text {
  box-sizing: border-box;
  background-image: url("@/assets/search_icon.png");
  background-position: 94% 10px;
  background-repeat: no-repeat;
  padding: 7px 10px 7px 15px;
  border: none;
  text-align: center;
  background: #ddddddc7;
  border-radius: 20px;
}

.btn-secondary {
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  border-color: #dee2e600;
}

:hover .btn-secondary {
  background-color: #fdd071;
}

.modal-header {
  /* padding: 0rem 1rem; */
  border-bottom: 0px solid #dee2e6;
}

.subdomain-name {
  font-size: 20px;
}

.custom-modal-title {
  padding-top: 20px;
  padding-bottom: 0px;
}

.scroll-obj {
    /* flex: 1; */
    padding: 10px;
    /* max-height: calc(50vh - 200px);*/
    max-height: 50vh;
    overflow-y: auto;
    overflow-x: hidden;
}

.custom-card {
    background: linear-gradient(90deg,rgb(190, 247, 254) 0%, rgba(255, 255, 255, 1) 35%);
    border-radius: 15px;
    border-top-left-radius: unset;
    padding: 15px;
    margin-bottom: 20px;
    position: relative;
    border: 0px solid rgba(0, 0, 0, .125);
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.card-actions {
  position: absolute;
  top: 10px;
  /* ระยะห่างจากด้านบน */
  right: 10px;
  /* ระยะห่างจากด้านขวา */
  display: flex;
  gap: 5px;
  /* ระยะห่างระหว่างปุ่ม */
}

.rounded-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  width: 30px;
  height: 30px;
}

.active-item {
  background-color: #fdd071;
  /*Active */
  color: #2c3e50;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}



.inactive-item {
  background-color: white;
  /* สีพื้นหลังเมื่อยังไม่ Active */
  color: #2c3e50;
  border: 1px solid #ccc;
  box-shadow: rgba(37, 37, 37, 0.2) 0px 2px 8px 0px;
}

.keyword-box {
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 5px;
  margin-bottom: 5px;
  display: inline-block;
  margin-right: 5px;
  font-size: 14px;
  position: relative;
}

.keyword-delete-icon {
  font-size: 14px;
  color: #ccc;
  cursor: pointer;
  margin-left: 5px;
  position: absolute;
  top: 8px;
  right: 5px;
}

.keyword-section {
  padding-top: 10px;
  padding-bottom: 10px;
}

.btn-custom {
  border-radius: 100px;
  /* ปุ่มวงกลม */
  padding: 5px 10px;
  /* ปรับขนาด สูง*กว้าง */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  /* เพิ่มเงา */
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-custom:hover {
  background-color: #7cd1dc;
  /* สีเมื่อ hover */
  transform: scale(1.1);
  /* ขยายเล็กน้อยเมื่อ hover */
}

.btn-add {
  margin-top: 10px;
  display: inline-block;
}

.btn-submit {
  margin-top: 150px;
  background-color: #7cd1dc !important;
  /* Background color */
  border-radius: 25px;
  /* Rounded corners */
  font-size: 16px;
  /* Text size */
  align-items: center;
  justify-content: center;
  display: flex;
  cursor: pointer;
  /* Pointer cursor */
  border: none;
  /* ลบขอบ */
  transition: none;
  color: #000;
  /* ยกเลิกแอนิเมชัน */
}

.btn-submit:hover,
.btn-submit:active,
.btn-submit:focus {
  background-color: #2daec0 !important;
  /* คงสีเดิม */
  transform: none;
  /* ไม่ขยายหรือเปลี่ยนขนาด */
  outline: none;
  /* ไม่แสดงกรอบโฟกัส */
}

.custom-modal {
  border-radius: 10px;
  /* ปรับมุมโค้งของ modal */
}

.custom-form {
  padding: 10px;
  /* เพิ่มระยะห่างภายในฟอร์ม */
}

.no-border {
  background-color: transparent;
  /* พื้นหลังใส */
  border: none;
  /* ลบกรอบ */
  box-shadow: none;
  /* ลบเงา */
  padding: 0;
  /* ลบระยะห่าง */
  cursor: pointer;
  /* เปลี่ยนเมาส์เป็น pointer */
}

.no-border:hover,
.no-border:active,
.no-border:focus {
  background-color: transparent;
  /* คงพื้นหลังใส */
  transform: none;
  outline: none;
  /* ลบกรอบ focus */
}

.icon-hover {
  transition: none;
  /* ยกเลิกแอนิเมชัน */
}

.icon-hover:hover,
.icon-hover:active {
  transform: none;
  /* ไม่เปลี่ยนขนาด */
}

@media only screen and (min-width: 0px) and (max-width: 991px) {
    .custom-card {
        background: linear-gradient(180deg,#bef7fe 0%, #ffffff 24%);
        border-top-right-radius: unset;
    }
}
</style>
