<template>
  <div>
    <b-container>
      <!-- วนลูปแสดง Subdomains -->
      <!-- Search Input with Icon -->
      <b-row class="justify-content-md-end">
        <!-- Input Field with Search Icon -->
        <b-col
          cols="12"
          sm="12"
          md="4"
          lg="4"
          class="mt-2 mt-md-0 pr-md-0 mr-md-2"
        >
          <!-- ช่องค้นหา -->
          <b-input-group>
            <b-input-group-prepend>
              <span class="input-group-text">
                <i class="bi bi-search"></i>
              </span>
            </b-input-group-prepend>
            <b-form-input
              v-model="searchQuery"
              placeholder="ค้นหา"
              class="input-group-text text-left"
            ></b-form-input>
          </b-input-group>
        </b-col>

        <!-- Button +subdomain -->
        <b-col cols="12" md="auto" class="mt-4 mt-md-0 pl-md-0">
          <b-button
            class="w-100 w-md-auto"
            style="background-color: #fdd071; color: black; border:#fdd071;"
            @click="openAddSubdomainModal"
          >
            <i class="fa fa-plus"></i> Subdomain
          </b-button>
        </b-col>
      </b-row>

      <br />

      <!-- ก้อน subdomain สีฟ้า -->
      <div
        v-for="(subdomain, subIndex) in filteredSubdomains"
        :key="subIndex"
        class="mb-4"
      >
        <!-- ชื่อ Subdomain -->
        <b-col
          sm="12"
          md="4"
          lg="4"
          class="d-flex justify-content-between align-items-center"
          style="background-color: #50c1d0; color: black; border-radius: 10px; padding: 10px; margin-bottom: 0px;"
        >
          <span class="text-center subdomain-name" style="flex: 1;">
            {{ subdomain.subdomain_name }}
            <!-- {{ subdomain.subdomain_id }} -->
          </span>

          <div class="d-flex justify-content-end">
            <b-button
              size="sm"
              class="rounded-circle"
              style="background-color: white; color: black; width: 30px; height: 30px;"
              @click="editSubdomain(subIndex)"
            >
              <i class="mdi mdi-pencil"></i>
            </b-button>

            <b-button
              size="sm"
              class="rounded-circle ml-2"
              style="background-color: white; color: black; width: 30px; height: 30px;"
              @click="openDeleteSubdomainModal(subIndex)"
            >
              <i class="mdi mdi-delete"></i>
            </b-button>
          </div>
        </b-col>

        <!-- Objects ใน Card -->
        <b-card
          class="custom-card"
          style="border: 1px solid #ccc; border-radius: 5px; padding: 15px; margin-bottom: 20px;"
        >
          <b-row>
            <b-col
              cols="12"
              sm="4"
              style="margin-bottom: 10px; padding-left: 10px; text-align: left;"
            >
              <strong>Object</strong>
            </b-col>

            <div
              class="card-actions"
              style="border: 1px solid #ffff; border-radius: 10px; padding: 2px; margin-top: 15px; cursor: pointer;"
            >
              <!-- ก้อนเพิ่ม object -->
              <b-button
                size="md"
                class="w-md-auto"
                style="background-color: #ffff; color: black; border:#fdd071; padding: 2px 2px;"
                @click="showObjectModal = true"
              >
                <i
                  class="mdi mdi-plus-circle"
                  style="font-size: 20px; line-height: 1;"
                ></i>
              </b-button>

              <!-- <b-button
                size="sm"
                class="rounded-circle"
                @click="openAddObjectModal(subIndex)"
              >
                <i class="mdi mdi-plus-circle"></i>
              </b-button> -->

              <!-- <b-button size="sm" class="rounded-circle no-border">
                <i class="mdi mdi-pencil icon-hover"></i>
              </b-button> -->

              <!-- <b-button
                size="sm"
                class="rounded-circle no-border"
                @click="openDeleteObjectModal(subIndex, objIndex)"
              >
                <i class="mdi mdi-delete icon-hover"></i>
              </b-button> -->
            </div>
          </b-row>

          <!--ก้อนคำว่า object -->
          <b-row>
            <b-col>
              <div class="scroll-obj">
                <div
                  v-for="(object, objIndex) in subdomain.objects"
                  :key="objIndex"
                  class="object-item d-flex align-items-center justify-content-between py-2"
                  :class="{
                    'active-item':
                      subdomain.activeObjectId === object.object_id,
                    'inactive-item':
                      subdomain.activeObjectId !== object.object_id,
                  }"
                  @click="setActive(subIndex, object.object_id, object)"
                  style="border: 1px solid #ccc; border-radius: 15px; margin-bottom: 20px; cursor: pointer;"
                >
                  <span class="text-center object-name" style="flex: 1;">
                    {{ object.object_name }}
                  </span>

                  <div class="d-flex justify-content-end">
                    <b-button
                      size="sm"
                      class="rounded-circle"
                      style="background-color: white; color: black; width: 30px; height: 30px; margin-right: 3px;"
                      @click="editObject(subIndex, objIndex)"
                    >
                      <i class="mdi mdi-pencil"></i>
                    </b-button>

                    <b-button
                      size="sm"
                      class="rounded-circle"
                      style="background-color: white; color: black; width: 30px; height: 30px; margin-right: 3px;"
                      @click="openDeleteObjectModal(subIndex, objIndex)"
                    >
                      <i class="mdi mdi-delete icon-hover"></i>
                    </b-button>
                  </div>
                </div>
              </div>
            </b-col>

            <!-- Keywords -->
            <b-col cols="12" md="8" style="text-align: left;">
              <div
                v-if="
                  subdomain.datakeyword.keywords &&
                    subdomain.datakeyword.keywords.length
                "
              >
                <strong>Keywords</strong><br />
                <div
                  v-for="(keyword, index) in subdomain.datakeyword.keywords"
                  :key="index"
                  class="keyword-box"
                >
                  {{ keyword }}

                  <!-- <i
                    class="bi bi-x"
                    @click="deleteKeyword(subIndex, 'keywords', index)"
                  ></i> -->
                </div>

                <!-- Add Button -->
                <!-- <b-button
                  size="sm"
                  class="rounded-circle"
                  style="background-color: white; color: black; width: 30px; height: 30px;"
                  @click="openAddKeywordModal(subIndex, objIndex)"
                >
                  <i class="mdi mdi-plus-circle"></i>
                </b-button> -->
                <b-button
                  class="rounded-circle"
                  style="background-color: #50c1d0; color: black; border:#50c1d0;"
                  @click="
                    showEditModal = true;
                    toPopup(subdomain.datakeyword);
                  "
                >
                  <i class="fa fa-plus"></i>
                </b-button>
              </div>

              <!-- Include Keywords -->
              <div
                v-if="
                  subdomain.datakeyword.and_keywords &&
                    subdomain.datakeyword.and_keywords.length
                "
                style="margin-top: 10px;"
              >
                <strong>Include Keywords</strong><br />
                <div
                  v-for="(and_keywords, index) in subdomain.datakeyword
                    .and_keywords"
                  :key="index"
                  class="keyword-box"
                >
                  {{ and_keywords }}
                </div>
              </div>

              <!-- Exclude Keywords -->
              <div
                v-if="
                  subdomain.datakeyword.not_keywords &&
                    subdomain.datakeyword.not_keywords.length
                "
                style="margin-top: 10px;"
              >
                <strong>Exclude Keywords</strong><br />
                <div
                  v-for="(not_keywords, index) in subdomain.datakeyword
                    .not_keywords"
                  :key="index"
                  class="keyword-box"
                >
                  {{ not_keywords }}
                  <!-- <i
                    class="bi bi-x"
                    @click="deleteKeyword(subIndex, 'not_keywords', index)"
                  ></i> -->
                </div>
              </div>
            </b-col>
          </b-row>
        </b-card>
      </div>

      <!--เพิ่ม AddSubdomain -->
      <b-modal
        id="add-subdomain-modal"
        @hidden="resetAddSubdomainModal"
        hide-footer
        class="modal-header"
      >
        <b-form @submit.prevent="handleAddSubdomain" class="custom-form">
          <!-- <b-form-group label="Domain ID">
            <b-form-input
              v-model="newDomainId"
              type="number"
              required
            ></b-form-input>
          </b-form-group> -->

          <b-form-group label="เพิ่ม Subdomain">
            <b-form-input v-model="newSubdomainName" required></b-form-input>
          </b-form-group>

          <div class="d-flex justify-content-end mt-3">
            <b-button class="btn-submit" @click="handleAddSubdomain"
              >submit</b-button
            >
          </div>
        </b-form>
      </b-modal>

      <!-- edit subdomain -->
      <b-modal
        v-b-modal.modal-center
        id="edit-subdomain-modal"
        ref="editSubdomainModal"
        @hidden="resetEditModal"
        :ok-only="true"
        class="custom-modal"
      >
        <!-- Form for Editing Subdomain -->
        <b-form
          ref="editForm"
          @submit.prevent="handleEditSubdomain"
          class="custom-form"
        >
          <b-form-group label="แก้ไขชื่อ Subdomain" label-for="edit-subdomain">
            <b-form-input
              id="edit-subdomain"
              v-model="editSubdomainName"
              required
              class="subdomain-input"
            ></b-form-input>
          </b-form-group>

          <!-- Buttons for Submit -->
          <div class="d-flex justify-content-end mt-3">
            <b-button class="btn-submit" @click="handleEditSubdomain">
              submit
            </b-button>
          </div>
        </b-form>
      </b-modal>

      <!-- Modal สำหรับลบ subdomain -->
      <b-modal
        id="confirm-delete-subdomain-modal"
        title="ยืนยันการลบ Subdomain"
        hide-footer
      >
        <b-form @submit.prevent="handleDeleteSubdomain">
          <!-- <b-form-group label="Domain ID">
            <b-form-input
              v-model="newDomainId"
              type="number"
              disabled
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Subdomain ID">
            <b-form-input
              v-model="newSubdomainId"
              type="text"
              disabled
            ></b-form-input>
          </b-form-group> -->

          <p>
            คุณต้องการลบ <strong>{{ deleteSubdomainName }}</strong> หรือไม่?
          </p>

          <div class="d-flex justify-content-end mt-3">
            <b-button class="mr-2" variant="secondary" @click="closeDeleteModal"
              >ยกเลิก</b-button
            >
            <b-button variant="danger" type="submit">ลบ</b-button>
          </div>
        </b-form>
      </b-modal>

      <!-- Modal สำหรับเพิ่ม Object -->
      <!-- <b-modal
        id="add-object-modal"
        @hidden="resetAddObjectModal"
        title="เพิ่ม Object"
        hide-footer
      >
        <b-form @submit.prevent="handleAddObject">
          <b-form-group label="Domain ID">
            <b-form-input
              v-model="newDomainId"
              type="number"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Subdomain ID">
            <b-form-input
              v-model="newSubdomainId"
              type="number"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group label="ชื่อ Object">
            <b-form-input v-model="newObjectName" required></b-form-input>
          </b-form-group>

          <div class="d-flex justify-content-end mt-3">
            <b-button class="btn-submit" @click="handleAddObject"
              >บันทึก</b-button
            >
          </div>
        </b-form>
      </b-modal> -->
      <b-modal
        id="add-object-modal"
        v-model="showObjectModal"
        size="lg"
        hide-footer
        content-class="custom-modal-content"
      >
        <template #modal-title>
          <h5 class="custom-modal-title font-weight-bold">เพิ่ม Object</h5>
        </template>

        <CreateObject @close="showObjectModal = false" />
      </b-modal>

      <!-- edit Object1 -->
      <b-modal
        v-b-modal.modal-center
        id="edit-object-modal"
        ref="editObjectModal"
        @hidden="resetEditModal"
        :ok-only="true"
        class="custom-modal"
      >
        <!-- Form สำหรับแก้ object -->
        <b-form
          ref="editForm"
          @submit.prevent="handleEditObject"
          class="custom-form"
        >
          <b-form-group label="แก้ไขชื่อ Object" label-for="edit-object">
            <b-form-input
              id="edit-object"
              v-model="editObjectName"
              required
              class="object-input"
            ></b-form-input>
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
      <b-modal
        id="confirm-delete-object-modal"
        title="ยืนยันการลบ Object"
        hide-footer
      >
        <b-form @submit.prevent="handleDeleteObject">
          <!-- <b-form-group label="ชื่อ Object">
      <b-form-input
        v-model="deleteObjectName"
        type="text"
        disabled
      ></b-form-input>
    </b-form-group> -->

          <p>
            คุณต้องการลบ <strong>{{ deleteObjectName }}</strong> หรือไม่?
          </p>

          <div class="d-flex justify-content-end mt-3">
            <b-button
              class="mr-2"
              variant="secondary"
              @click="closeDeleteObjectModal"
            >
              ยกเลิก
            </b-button>
            <b-button variant="danger" type="submit">ลบ</b-button>
          </div>
        </b-form>
      </b-modal>

      <!-- Modal for เพิ่ม Keyword -->
      <!-- <b-modal
        id="add-keyword-modal"
        @hidden="resetAddKeywordModal"
        title="เพิ่ม Keyword"
        hide-footer
      >
        <b-form @submit.prevent="handleAddKeyword">
          <b-form-group label="ชื่อ Keyword">
            <b-form-input v-model="newKeyword" required></b-form-input>
          </b-form-group>

          <div class="d-flex justify-content-end mt-3">
            <b-button class="btn-submit" @click="handleAddKeyword"
              >บันทึก</b-button
            >
          </div>
        </b-form>
      </b-modal> -->
      <b-modal
        id="edit-object-keyword-modal"
        v-model="showEditModal"
        size="lg"
        hide-footer
        content-class="custom-modal-content"
      >
        <template #modal-title>
          <h5 class="custom-modal-title font-weight-bold">แก้ไขข้อมูล</h5>
        </template>

        <EditObjectKeyword
          @close="showEditModal = false"
          @objectUpdated="handleObjectUpdated"
          :dataKeyword="dataKeyword"
          :subdomainId="activeSubdomainId"
          :objectId="activeObjectId"
        />
      </b-modal>
    </b-container>
  </div>
</template>

<script>
import CreateObject from "./CreateObject.vue";
import EditObjectKeyword from "./EditObjectKeyword.vue";

export default {
  name: "SubdomainCard",
  components: {
    CreateObject,
    EditObjectKeyword,
  },
  data() {
    return {
      dataKeyword: "",
      searchQuery: "",
      showObjectModal: false, // State for showing/hiding the modal
      showEditModal: false, // State for showing/hiding the modal
      dataKeyword: {},
      activeSubdomainId: null, // ใช้เก็บ subdomain_id ที่ active
      activeObjectId: null, // ใช้เก็บ object_id ที่ active
      subdomains: [],
      keywords: [],
      buttonColor: "#50c1d0",
      newKeyword: "",
      newSubdomainName: "", // เก็บค่าชื่อ Subdomain
      newDomainId: 1, // ค่าเริ่มต้นของ Domain ID (เปลี่ยนได้ตามต้องการ)
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
    };
  },
  computed: {
    filteredSubdomains() {
      if (!this.searchQuery) {
        return this.subdomains.filter(
          (subdomain) =>
            subdomain.display !== false || subdomain.display === undefined
        );
      }
      const query = this.searchQuery.toLowerCase();
      return this.subdomains.filter(
        (subdomain) =>
          (subdomain.display !== false || subdomain.display === undefined) &&
          (subdomain.subdomain_name.toLowerCase().includes(query) ||
            subdomain.objects.some((object) =>
              object.object_name.toLowerCase().includes(query)
            ))
      );
    },
  },
  methods: {
    toPopup(item) {
      this.dataKeyword = item;
    },
    async apiList() {
      try {
        const config = {
          method: "get",
          url: "http://localhost:3000/api/v2/monitor/getSetting",
          params: { domain_id: 1 },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        };
        const response = await this.axios(config);

        console.log("ดึงข้อมูลสำเร็จ:", response.data);

        if (response.data.domain_id) {
          this.domainId = response.data.domain_id; //เซ็ตค่า domain_id ที่ได้จาก API
        }

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

        console.log("ดึงข้อมูลสำเร็จ:", this.subdomains);
      } catch (error) {
        console.error("Error fetching API:", error);
      }
    },

    async handleAddSubdomain() {
      if (!this.newSubdomainName.trim() || !this.newDomainId) {
        alert("กรุณากรอกชื่อ Subdomain");
        return;
      }

      const newSubdomainData = {
        name: this.newSubdomainName.trim(),
        domain_id: this.newDomainId,
      };

      try {
        const response = await this.axios.post(
          "http://localhost:3000/api/v2/monitor/postSubdomain",
          newSubdomainData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          console.log("Subdomain created successfully:", response.data);

          // เพิ่ม Subdomain ใหม่เข้าไปในรายการ
          this.subdomains.push(response.data);

          // ปิด Modal
          this.$bvModal.hide("add-subdomain-modal");

          // รีโหลดหน้าเว็บใหม่
          window.location.reload();
        }
      } catch (error) {
        console.error("Error creating subdomain:", error);
        alert("เกิดข้อผิดพลาดในการเพิ่ม Subdomain");
      }
    },

    async handleEditSubdomain() {
      if (this.editSubdomainIndex === null || !this.editSubdomainName.trim())
        return;

      const subdomain = this.subdomains[this.editSubdomainIndex];
      const updatedSubdomainData = {
        domain_id: 1, // ค่าที่ต้องส่ง
        name: this.editSubdomainName.trim(),
      };

      try {
        const response = await this.axios.put(
          `http://localhost:3000/api/v2/monitor/putSubdomain/${subdomain.subdomain_id}`,
          updatedSubdomainData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          // อัปเดตค่าชื่อในตัวแปร subdomains
          this.subdomains[
            this.editSubdomainIndex
          ].subdomain_name = this.editSubdomainName;
          console.log(
            "แก้ไขชื่อ Subdomain updated successfully:",
            response.data
          );
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
          "http://localhost:3000/api/v2/monitor/postObject",
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
          console.log("Object added successfully:", response.data);
        }
      } catch (error) {
        console.error("Error adding object:", error);
      }
    },

    async handleEditObject() {
      console.log("handleEditObject() ถูกเรียก");

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
          `http://localhost:3000/api/v2/monitor/updateKeywords/${object.object_id}`,
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
          `http://localhost:3000/api/v2/monitor/putObject/${object.object_id}`,
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

    async handleAddObject() {
      if (!this.newObjectName.trim()) {
        alert("กรุณากรอกชื่อ Object");
        return;
      }

      const newObjectData = {
        domain_id: 1,
        // domain_id: this.newDomainId,
        subdomain_id: this.newSubdomainId,
        name: this.newObjectName.trim(),
        keywords: this.keywords || [],
        and_keywords: this.andKeywords || [],
        not_keywords: this.notKeywords || [],
      };

      try {
        const response = await this.axios.post(
          "http://localhost:3000/api/v2/monitor/postObject",
          newObjectData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          console.log("Object created successfully:", response.data);

          // เพิ่ม Obj ใน subdomains
          this.subdomains[this.activeSubdomainIndex].objects.push(
            response.data
          );

          // ปิด Modal และล้างค่า input
          this.newObjectName = "";
          this.$bvModal.hide("add-object-modal");

          // รีโหลดหน้าเว็บใหม่
          window.location.reload();
        }
      } catch (error) {
        console.error("Error creating object:", error);
        alert("เกิดข้อผิดพลาดในการเพิ่ม Object");
      }
    },
    async handleDeleteSubdomain() {
      const subdomainId = this.newSubdomainId;
      const domainId = this.newDomainId; //ใช้ค่า domain_id ที่ดึงมาจาก API

      console.log("ลบ Subdomain:", { subdomainId, domainId });

      try {
        const response = await this.axios.delete(
          `http://localhost:3000/api/v2/monitor/deleteSubdomain/${subdomainId}`,
          {
            params: { domain_id: domainId }, //ส่ง domain_id ไปใน params
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        console.log("ลบสำเร็จ:", response.data);

        this.subdomains = this.subdomains.filter(
          (sub) => sub.subdomain_id !== subdomainId
        );
        this.closeDeleteModal();
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
      console.log(
        "setActive() ถูกเรียก: subdomainIndex =",
        subIndex,
        "objectId =",
        objectId
      );

      //หา index จริงของ subdomain ใน subdomains[]
      const realSubIndex = this.subdomains.findIndex(
        (sub) =>
          sub.subdomain_id === this.filteredSubdomains[subIndex].subdomain_id
      );

      if (realSubIndex === -1) return;

      const subdomain = this.subdomains[realSubIndex];

      //หา index จริงของ object ใน subdomain
      const realObjIndex = subdomain.objects.findIndex(
        (obj) => obj.object_id === objectId
      );

      if (realObjIndex === -1) return;

      subdomain.activeObjectId = objectId;
      subdomain.datakeyword = subdomain.objects[realObjIndex];
      subdomain.activeObjectIndex = realObjIndex;

      this.activeSubdomainIndex = realSubIndex;
      this.activeObjectIndex = realObjIndex;
      this.activeSubdomainId = this.subdomains[realSubIndex].subdomain_id;
      this.activeObjectId = objectId;
      this.dataKeyword = { ...object };

      console.log("activeSubdomainId:", this.activeSubdomainId);
      console.log("activeObjectId:", this.activeObjectId);
      console.log("dataKeyword:", this.dataKeyword);
    },
    openAddSubdomainModal() {
      this.newSubdomainName = "";
      this.newDomainId = 1;
      this.$bvModal.show("add-subdomain-modal"); //ใช้ id ของ b-modal
    },

    resetAddSubdomainModal() {
      this.newSubdomainName = "";
      this.newDomainId = 1;
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
    openDeleteSubdomainModal(subIndex) {
      const realSubIndex = this.subdomains.findIndex(
        (sub) =>
          sub.subdomain_id === this.filteredSubdomains[subIndex].subdomain_id
      );

      if (realSubIndex === -1) return;

      this.deleteSubdomainIndex = realSubIndex;
      this.newDomainId = this.domainId;
      this.newSubdomainId = this.subdomains[realSubIndex].subdomain_id;
      this.deleteSubdomainName = this.subdomains[realSubIndex].subdomain_name;

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
          `http://localhost:3000/api/v2/monitor/deleteSubdomain/${subdomainId}`,
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
    openDeleteObjectModal(subIndex, objIndex) {
      console.log(
        "openDeleteObjectModal(): subIndex =",
        subIndex,
        "objIndex =",
        objIndex
      );

      const realSubIndex = this.subdomains.findIndex(
        (sub) =>
          sub.subdomain_id === this.filteredSubdomains[subIndex].subdomain_id
      );

      if (realSubIndex === -1) return;

      const subdomain = this.subdomains[realSubIndex];

      const realObjIndex = subdomain.objects.findIndex(
        (obj) =>
          obj.object_id ===
          this.filteredSubdomains[subIndex].objects[objIndex].object_id
      );

      if (realObjIndex === -1) return;

      this.deleteSubdomainIndex = realSubIndex;
      this.deleteObjectIndex = realObjIndex;

      this.deleteObjectName = subdomain.objects[realObjIndex].object_name;
      this.deleteObjectId = subdomain.objects[realObjIndex].object_id;

      console.log("Object ที่ต้องการลบ:", this.deleteObjectName);
      this.$bvModal.show("confirm-delete-object-modal");
    },
    async handleDeleteObject() {
      if (
        this.deleteObjectIndex === null ||
        this.deleteSubdomainIndex === null
      ) {
        return;
      }

      const subIndex = this.deleteSubdomainIndex;
      const objIndex = this.deleteObjectIndex;
      const objectId = this.deleteObjectId; // ใช้ ID ของ Object

      try {
        await this.axios.delete(
          `http://localhost:3000/api/v2/monitor/deleteObject/${objectId}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        // ลบ Object ออกจาก Array
        this.subdomains[subIndex].objects.splice(objIndex, 1);
        this.closeDeleteObjectModal();
        console.log("Object deleted successfully:", objectId);

        setTimeout(() => {
          window.location.reload();
        }, 500);
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
      console.log(
        "เปิด Modal เพิ่ม Keyword:",
        "subIndex:",
        subIndex,
        "objIndex:",
        objIndex
      );
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
    resetAddObjectModal() {
      this.newObjectName = "";
      this.newSubdomainId = 1;
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
  },
  mounted() {
    this.apiList();
  },
};
</script>

<style scoped>
.mdi {
  font-size: 16px; /* ขนาดไอคอน */
  color: black; /* สีไอคอน */
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
  height: 300px;
  overflow: auto;
}
.custom-card {
  position: relative; /* กำหนดตำแหน่งให้ Card */
}

.card-actions {
  position: absolute;
  top: 10px; /* ระยะห่างจากด้านบน */
  right: 10px; /* ระยะห่างจากด้านขวา */
  display: flex;
  gap: 5px; /* ระยะห่างระหว่างปุ่ม */
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
  background-color: #fdd071; /*Active */
  color: black;
}

.inactive-item {
  background-color: white; /* สีพื้นหลังเมื่อยังไม่ Active */
  color: black;
  border: 1px solid #ccc;
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
  border-radius: 100px; /* ปุ่มวงกลม */
  padding: 5px 10px; /* ปรับขนาด สูง*กว้าง */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* เพิ่มเงา */
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-custom:hover {
  background-color: #50c1d0; /* สีเมื่อ hover */
  transform: scale(1.1); /* ขยายเล็กน้อยเมื่อ hover */
}

.btn-add {
  margin-top: 10px;
  display: inline-block;
}

.btn-submit {
  margin-top: 150px;
  background-color: #50c1d0; /* Background color */
  border-radius: 25px; /* Rounded corners */
  font-size: 15px; /* Text size */
  align-items: center;
  justify-content: center;
  display: flex;
  cursor: pointer; /* Pointer cursor */
  border: none; /* ลบขอบ */
  transition: none; /* ยกเลิกแอนิเมชัน */
}

.btn-submit:hover,
.btn-submit:active,
.btn-submit:focus {
  background-color: #50c1d0; /* คงสีเดิม */
  transform: none; /* ไม่ขยายหรือเปลี่ยนขนาด */
  outline: none; /* ไม่แสดงกรอบโฟกัส */
}

.custom-modal {
  border-radius: 10px; /* ปรับมุมโค้งของ modal */
}

.custom-form {
  padding: 10px; /* เพิ่มระยะห่างภายในฟอร์ม */
}

.no-border {
  background-color: transparent; /* พื้นหลังใส */
  border: none; /* ลบกรอบ */
  box-shadow: none; /* ลบเงา */
  padding: 0; /* ลบระยะห่าง */
  cursor: pointer; /* เปลี่ยนเมาส์เป็น pointer */
}

.no-border:hover,
.no-border:active,
.no-border:focus {
  background-color: transparent; /* คงพื้นหลังใส */
  transform: none;
  outline: none; /* ลบกรอบ focus */
}

.icon-hover {
  transition: none; /* ยกเลิกแอนิเมชัน */
}

.icon-hover:hover,
.icon-hover:active {
  transform: none; /* ไม่เปลี่ยนขนาด */
}
</style>
