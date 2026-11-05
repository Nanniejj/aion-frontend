<template>
  <div class="domain-setting">
    <b-container fluid id="tp-size">
      <vue-element-loading :active="getLoadStatus" size="80" background-color="rgba(255, 255, 255, 0.4)"
        color="#b6ac9a" />
        <!-- {{ getItemsDomain }} -->
      <!-- https://bootstrap-vue.org/docs/components/table#custom-data-rendering   \ Complete example -->
      <!-- Page header -->
      <b-row id="input-btn" class="m-0 align-items-end justify-content-lg-between flex-lg-nowrap page-header-row mb-3">
        <b-col lg="auto" class="px-0 pl-sm-0 ">
          <div class="page-header">
            <div class="page-header-icon">
              <i class="fa fa-folder-open"></i>
            </div>
            <div>
              <h5 class="m-0 text-left page-title">จัดการหัวเรื่อง (Domain)</h5>
              <div class="page-count-pill text-left">
                <i class="fa fa-list"></i>
                ทั้งหมด {{ getItemsDomain.length || 0 | numFormat}} เรื่อง
              </div>
            </div>
          </div>
          <!-- ตัวกรองการแสดงผล (ส่งเป็น query ให้ API getDomainlist) -->
          <div class="domain-filters">
            <label class="domain-filter">
              <span class="domain-filter-label"><i class="fa fa-eye"></i> แสดง</span>
              <b-form-select v-model="domainFilter.visibility" :options="visibilityOptions" size="sm"
                class="domain-filter-select" :disabled="getLoadStatus" @change="onDomainFilterChange" />
            </label>
            <label class="domain-filter">
              <span class="domain-filter-label"><i class="fa fa-sort-amount-down"></i> เรียง</span>
              <b-form-select v-model="domainFilter.sort" :options="sortOrderOptions" size="sm"
                class="domain-filter-select" :disabled="getLoadStatus" @change="onDomainFilterChange" />
            </label>
          </div>
        </b-col>
        <b-col cols="12" md="" lg="auto" class="px-0 ml-0 ml-lg-auto mb-3 mb-lg-0 domain-search-col">
            <b-input-group size="md">
                <b-form-input id="filter-input" v-model="filter" type="search" placeholder="ค้นหาหัวเรื่อง..."></b-form-input>
            </b-input-group>
        </b-col>
        <b-col cols="auto" lg="auto" class="pr-0 mb-3 mb-lg-0 domain-action-col">
          <TemplateAddDomain @domain-added="fetchDomainList()"/>
          <!-- <button class="btn btn-add" ><i class="fa fa-plus"/><span  style="font-size:16px;"> เพิ่ม Domain </span></button> -->
        </b-col>
        <b-col cols="auto" lg="auto" class="pr-0 mb-3 mb-lg-0 domain-action-col">
          <ImportDomain/>
        </b-col>
      </b-row>
      <!-- {{getItemsDomain}} -->
      <!-- Main table element -->
      <div class="domain-table-card">
      <b-table hover :items="getItemsDomain" :fields="fields" :current-page="currentPage" :per-page="perPage"
        :filter="filter" :filter-included-fields="['name']" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
        :sort-direction="sortDirection" :empty-filtered-text="empData" stacked="md" show-empty small
        @filtered="onFiltered" @row-clicked="onRowClicked" tbody-tr-class="domain-row-clickable" thead-class="">
        <!-- @row-clicked="linkToSubDomain"   -->
        <template #cell(id)="row">
          {{ row.index + 1 + (currentPage - 1) * 10 }}
        </template>
        <template #cell(name)="row">
          <b>{{ row.value }}</b>
        </template>

        <template #cell(actions)="row">
          <b-dropdown
            size="sm"
            variant="link"
            toggle-class="text-decoration-none action-dropdown-toggle"
            no-caret
            right
          >
            <template #button-content>
              <i class="fas fa-sliders-h"></i>
              <span class="action-label">ตั้งค่า</span>
              <i class="fa fa-chevron-down action-caret"></i>
            </template>
            <b-dropdown-item-button @click="linkToSubDomain(row.item)">
              <i class="fas fa-list-ul mr-2"></i> ดู SubDomain
            </b-dropdown-item-button>
            <b-dropdown-item-button @click="buildCloneInfo(row.item, row.index, $event.target)">
              <i class="fas fa-copy mr-2"></i> คัดลอก Domain
            </b-dropdown-item-button>
            <b-dropdown-item-button @click="info(row.item, row.index, $event.target)">
              <i class="fa fa-pencil mr-2"></i> แก้ไขข้อมูล
            </b-dropdown-item-button>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item-button class="text-danger" @click="removeRow(row.index, row.item)">
              <i class="fa fa-trash-alt mr-2"></i> ลบ
            </b-dropdown-item-button>
          </b-dropdown>
        </template>

        <template #cell(display)="row">
          <span v-if="row.value == 'แสดงผล'" class="status-pill status-pill-on"><i class="fa fa-circle" />
            {{ row.value }}</span>
          <span v-else class="status-pill status-pill-off" :class="{ 'status-pill-hidden': row.value === 'ซ่อนอยู่' }"><i class="fa fa-circle" />
            {{ row.value }}</span>
        </template>
      </b-table>
      </div>
      <!-- paginate -->
      <b-row class="pagination-row">
        <b-col sm="7" md="6" class="my-1" id="page" v-if="!filter">
          <b-pagination v-model="currentPage" :total-rows="this.getItemsDomain.length" :per-page="perPage" align="fill"
            size="sm" class="my-0"></b-pagination>
        </b-col>
        <b-col sm="7" md="6" class="my-1" id="page" v-else>
          <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="fill" size="sm"
            class="my-0"></b-pagination>
        </b-col>
      </b-row>

      <!-- Info modal -->
      <vue-modaltor :visible="open" @hide="hideModal" :animation-panel="'modal-slide-top'">
        <b-container fluid class="modal-body-pad">
          <div class="modal-header-row">
            <i class="fa fa-pencil modal-header-icon"></i>
            <h5 class="m-0"><b>แก้ไขข้อมูล</b></h5>
          </div>
          <hr />
          <p class="modal-hint"><i class="fa fa-info-circle mr-1"></i>กรุณาตรวจสอบข้อมูลทุกครั้งก่อนทำการบันทึก</p>
          <div>
            <label class="modal-field-label">ชื่อหัวเรื่อง</label>
            <b-form-input v-model="textDomain" placeholder="" maxlength="50" class="modal-input">
              <b>{{ textDomain }}</b></b-form-input>
              <small class="text-muted">{{ textDomain.length }} / 50
              ตัวอักษร</small>
            <div v-if="hasForbiddenChars(textDomain)" class="text-danger small mt-1">
              <i class="fa fa-exclamation-triangle"></i> ห้ามใส่อักขระพิเศษ  & 
            </div>
            <label class="modal-field-label mt-3">สถานะการแสดงผล</label>
            <b-form-group v-slot="{ ariaDescribedby }" class="m-0">
              <b-form-radio-group v-model="selected" :options="options" :aria-describedby="ariaDescribedby"
                name="radio-inline"></b-form-radio-group>
            </b-form-group>
            <div class="modal-actions">
                <b-button class="btn btn-close" size="sm" @click="hideModal()">ปิดหน้าต่าง</b-button>
                <b-button class="btn btn-save" size="sm" @click="editDomain()"
                  :disabled="savingDomain || textDomain.trim().length === 0 || hasForbiddenChars(textDomain)">
                  {{ savingDomain ? "กำลังบันทึก..." : "บันทึก" }}</b-button>
            </div>
            <!-- <div class="mt-2">Value: {{ textDomain }}</div> -->
          </div>
        </b-container>
      </vue-modaltor>


      <!-- clone modal -->
      <vue-modaltor :visible="openClone" @hide="hideCloneModal" :animation-panel="'modal-slide-top'">
        <b-container fluid class="modal-body-pad">
          <div class="modal-header-row">
            <i class="fa fa-copy modal-header-icon"></i>
            <h5 class="m-0">คัดลอกข้อมูลหัวเรื่อง <b>{{ textDomain }}</b></h5>
          </div>
          <hr />
          <p class="modal-hint"><i class="fa fa-info-circle mr-1"></i>กรุณาตรวจสอบข้อมูลทุกครั้งก่อนทำการบันทึก</p>
          <div>
            <label class="modal-field-label">ชื่อ Domain ใหม่ <span class="req-dot"></span></label>
            <b-form-input v-model="domainClone.new_domain_name" placeholder="ชื่อ Domain ใหม่" maxlength="50" class="modal-input">
            </b-form-input>
            <small class="text-muted">{{ domainClone.new_domain_name.length }} / 50 ตัวอักษร</small>
            <div v-if="hasForbiddenChars(domainClone.new_domain_name)" class="text-danger small mt-1">
              <i class="fa fa-exclamation-triangle"></i> ห้ามใส่อักขระพิเศษ  & 
            </div>

            <label class="modal-field-label mt-3">คำต่อท้ายชื่อ SubDomain เดิม</label>
            <b-form-input v-model="domainClone.subdomain_suffix" placeholder="เช่น -copy" maxlength="20" class="modal-input">
            </b-form-input>
            <small class="text-muted">{{ domainClone.subdomain_suffix.length }} / 20 ตัวอักษร (เว้นว่างได้)</small>
            <div v-if="hasForbiddenChars(domainClone.subdomain_suffix)" class="text-danger small mt-1">
              <i class="fa fa-exclamation-triangle"></i> ห้ามใส่อักขระพิเศษ  & 
            </div>

            <label class="modal-field-label mt-3">คำต่อท้ายชื่อ Object เดิม</label>
            <b-form-input v-model="domainClone.object_suffix" placeholder="เช่น -copy" maxlength="20" class="modal-input">
            </b-form-input>
            <small class="text-muted">{{ domainClone.object_suffix.length }} / 20 ตัวอักษร (เว้นว่างได้)</small>
            <div v-if="hasForbiddenChars(domainClone.object_suffix)" class="text-danger small mt-1">
              <i class="fa fa-exclamation-triangle"></i> ห้ามใส่อักขระพิเศษ  & 
            </div>

            <div class="modal-actions">
                <b-button class="btn btn-close mx-3" size="sm" @click="hideCloneModal()">ปิดหน้าต่าง</b-button>
                <b-button class="btn btn-save" size="sm" @click="createClone()"
                  :disabled="domainClone.new_domain_name.trim().length === 0 ||
                    hasForbiddenChars(domainClone.new_domain_name) ||
                    hasForbiddenChars(domainClone.subdomain_suffix) ||
                    hasForbiddenChars(domainClone.object_suffix)">คัดลอก</b-button>
            </div>
          </div>
        </b-container>
      </vue-modaltor>
    </b-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import TemplateAddDomain from "@/components/template/TemplateAddDomain.vue";
import ImportDomain from "../setting_page/ImportDomain.vue";
// import axios from "axios";
// import { API_URL } from '@/common/config';

export default {
  components: { TemplateAddDomain,ImportDomain },
  data() {
    return {
      empData: "ไม่พบข้อมูล",
      idDomain: 0,
      fields: [
        { key: "id", label: "#", sortable: true, class: "text-center" },
        { key: "name", label: "เรื่อง", sortable: true },

        {
          key: "display",
          label: "สถานะ",
          // visible: false = domain ที่ถูกซ่อน (จะเห็นเมื่อเลือกตัวกรอง "รวมที่ซ่อน" / "เฉพาะที่ซ่อน")
          formatter: (value, key, item) => {
            if (item && item.visible === false) return "ซ่อนอยู่";
            return value ? "แสดงผล" : "ไม่แสดงผล";
          },
          sortable: true,
          sortByFormatted: true,
          filterByFormatted: true,
        },
        { key: "actions", label: "การจัดการ" },
      ],
      selected: "",
      options: [
        { text: "แสดงผล", value: true },
        { text: "ไม่แสดงผล", value: false },
      ],
      textDomain: "",
      savingDomain: false,
      open: false,
      openClone: false,
      totalRows: 1,
      currentPage: 1,
      domainFilter: { visibility: "shown", sort: "desc" },
      visibilityOptions: [
        { value: "shown", text: "เฉพาะที่แสดงอยู่" },
        { value: "all", text: "ทั้งหมด (รวมที่ซ่อน)" },
        { value: "hidden", text: "เฉพาะที่ซ่อน" },
      ],
      sortOrderOptions: [
        { value: "desc", text: "ใหม่ล่าสุดก่อน" },
        { value: "asc", text: "เก่าสุดก่อน" },
      ],
      perPage: 10,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      domainClone: {
        domain_id: null,
        new_domain_name: "", //ชื่อโดเมนใหม่
        subdomain_suffix: "", //คำต่อท้ายชื่อ subdomain เดิม
        object_suffix: ""  //คำต่อท้ายชื่อ object เดิม
      }
    };
  },
  computed: {
    ...mapGetters([
      "getSelected",
      "getFieldsDomain",
      "getItemsDomain",
      "getLoadStatus",
    ]),
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
  },
  methods: {
    // ตรวจว่ามีอักขระพิเศษต้องห้ามอยู่ใน string หรือไม่
    // (กฎเดียวกับ ImportObject.vue / AddSubDomain.vue / SubdomainCard.vue / TemplateAddDomain.vue)
    // อนุญาตตัวอักษรไทย/อังกฤษ ตัวเลข เว้นวรรค และเครื่องหมาย . - ( )
    hasForbiddenChars(value) {
      const forbiddenPattern = /&/
      return forbiddenPattern.test(String(value || ""));
    },
    removeRow: function (index, item) {
      this.$confirm(`คุณต้องการลบหัวเรื่อง "${item.name}"?`).then(async () => {
        try {
          await this.$store.dispatch("deleteDomain", { id: item.id });
          this.$fire({
            title: "ลบหัวเรื่องสำเร็จ",
            type: "success",
            showConfirmButton: false,
            timer: 1000,
          });
          this.fetchDomainList();
        } catch (error) {
          this.$fire({
            title: "ลบหัวเรื่องไม่สำเร็จ",
            text: error?.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
            type: "error",
          });
        }
      }).catch(() => {});
    },
    async editDomain() {
      if (this.savingDomain) return;
      let tdomain = this.textDomain.trim();
      if (tdomain.length === 0 || this.hasForbiddenChars(tdomain)) return;
      this.savingDomain = true;
      try {
        await this.$store.dispatch("updateDomain", {
          name: tdomain,
          id: this.idDomain,
        });
        this.savingDomain = false;
        this.open = false;
        this.$fire({
          title: "บันทึกข้อมูลสำเร็จ",
          type: "success",
          showConfirmButton: false,
          timer: 1000,
        });
        this.fetchDomainList();
      } catch (error) {
        // ไม่ปิด modal — ผู้ใช้จะได้ไม่เสียชื่อที่แก้ไว้
        this.$fire({
          title: "บันทึกไม่สำเร็จ",
          text: error?.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
          type: "error",
        });
      } finally {
        this.savingDomain = false;
      }
    },
    createClone() {
      let newName = this.domainClone.new_domain_name.trim();
      if (newName.length === 0) {
        return;
      }
      if (
        this.hasForbiddenChars(newName) ||
        this.hasForbiddenChars(this.domainClone.subdomain_suffix) ||
        this.hasForbiddenChars(this.domainClone.object_suffix)
      ) {
        return;
      }
      this.$confirm("คุณต้องการคัดลอก Domain นี้?").then(() => {
        this.$store
          .dispatch("cloneDomain", {
            domain_id: this.domainClone.domain_id,
            new_domain_name: newName,
            subdomain_suffix: this.domainClone.subdomain_suffix.trim(),
            object_suffix: this.domainClone.object_suffix.trim(),
          })
          .then(() => {
            this.$fire({
              title: "คัดลอกข้อมูลสำเร็จ",
              type: "success",
              showConfirmButton: false,
              timer: 1000,
            });
            this.fetchDomainList();
            this.hideCloneModal();
          })
          .catch(() => {
            this.$alert("ไม่สามารถดำเนินการได้").then(() => {});
          });
      });
    },
    // คลิกที่แถว → ไปหน้าดู SubDomain (ยกเว้นคลิกในปุ่ม/เมนู "ตั้งค่า" ของแถวนั้น)
    onRowClicked(item, index, event) {
      const target = event && event.target;
      if (target && target.closest && target.closest(".dropdown, .dropdown-menu, button, a")) return;
      this.linkToSubDomain(item);
    },
    linkToSubDomain(item) {
      // this.$store.dispatch("fetchListSubDomain",{name:item.name})
      // console.log(item.id);
      this.$store.commit("setDomainName", item.name);
      this.$store.commit("setDomainId", item.id);
      this.$router.push({ name: "SettingSubDomain"  ,params: { domain: item.name},query: { id:item.id}});
    },
    hideModal() {
      if (this.savingDomain) return;
      this.open = false;
    },
    hideCloneModal() {
      this.openClone = false;
      this.domainClone = {
        domain_id: null,
        new_domain_name: "",
        subdomain_suffix: "",
        object_suffix: "",
      };
    },
    info(item, button) {
      // this.infoModal.title = `Row index: ${index}`;
      this.open = true;
      this.idDomain = item.id;
      // console.log(this.idDomain);
      this.infoModal.content = item.name;
      this.textDomain = item.name;
      this.selected = item.display;
      // console.log( this.options);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    buildCloneInfo(item, index, button) {
      this.textDomain = item.name;
      this.domainClone.domain_id = item.id;
      this.domainClone.new_domain_name = item.name + " (สำเนา)";
      this.domainClone.subdomain_suffix = "";
      this.domainClone.object_suffix = "";
      this.openClone = true;
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      // console.log("item", filteredItems);
      this.currentPage = 1;
    },
    // ✅ เรียก fetch รายการ domain ใหม่ ใช้ทั้งตอนโหลดหน้าครั้งแรกและตอนนำเข้าไฟล์สำเร็จ
    onDomainFilterChange() {
      this.currentPage = 1;
      this.fetchDomainList();
    },
    fetchDomainList() {
      this.$store.dispatch("fetchTemplateDomain", { ...this.domainFilter }).then(() => {
        this.totalRows = this.getItemsDomain.length;
      });
    },
  },
  created() {
    this.fetchDomainList();
    // ✅ ฟัง event จาก ImportDomain.vue — พอนำเข้าไฟล์สำเร็จแล้ว ให้ดึงรายการ domain มาใหม่
    // เพื่อให้ข้อมูลที่เพิ่งนำเข้าขึ้นในตารางทันที ไม่ต้องรีเฟรชหน้าเอง
    this.$emitter.on("domainImported", this.fetchDomainList);
  },
  beforeDestroy() {
    // เลิกฟัง event ตอน component ถูกทำลาย กัน listener ค้างซ้อนกันถ้าเข้าออกหน้านี้หลายรอบ
    this.$emitter.off("domainImported", this.fetchDomainList);
  },
};
</script>
<style scoped>
table>thead>tr>th:nth-child(3) {
  display: none;
}

/* ===== Page header ===== */
.page-header-row {
  margin-bottom: 18px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.page-header-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #ede7dd;
  color: #4c412b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
}

.page-title {
  font-weight: 700;
  color: #2c241a;
  font-size: 18px;
}

.domain-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}
.domain-filter {
  display: inline-flex;
  align-items: center;
  margin: 0;
  background: #f6f2ea;
  border: 1px solid #ece6da;
  border-radius: 999px;
  padding: 2px 4px 2px 12px;
}
.domain-filter-label {
  font-size: 13px;
  color: #8a7d68;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.domain-filter-select {
  width: auto;
  border: none;
  background-color: transparent;
  font-size: 13px;
  font-weight: 600;
  color: #4c412b;
  box-shadow: none !important;
  cursor: pointer;
}
.status-pill-hidden {
  background: #eceff1 !important;
  color: #6b7280 !important;
}

.page-count-pill {
  /* display: inline-flex; */
  align-items: center;
  gap: 6px;
  margin-top: 3px;
  /* font-size: 12.5px; */
  color: #8a7d68;
}


/* ===== Table card ===== */
.domain-table-card {
  background: #ffffff;
  border: 1px solid #ece6da;
  border-radius: 14px;
  padding: 6px 14px;
  box-shadow: 0 2px 10px rgba(76, 65, 43, 0.06);
  /* เดิม overflow: hidden ทำให้เมนู dropdown ของคอลัมน์ "การจัดการ" ถูกตัดขอบ/บังตารางตอนเปิดเมนู
     เปลี่ยนเป็น visible เพื่อให้เมนูลอยเหนือตารางได้ตามปกติ มุมโค้งยังคงเดิมเพราะพื้นหลังตารางเป็นสีขาวเหมือนการ์ด */
  overflow: visible;
}

.domain-table-card ::v-deep table {
  margin-bottom: 0.25rem;
}

.domain-table-card ::v-deep thead th {
  color: #8a7d68;
  font-weight: 700;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: .03em;
  border-bottom: 2px solid #ece6da !important;
  border-top: none !important;
  background: transparent;
}

.domain-table-card ::v-deep tbody td {
  vertical-align: middle;
  border-color: #f3efe6;
}

.domain-table-card ::v-deep tbody tr:hover {
  background-color: #fbf9f5;
}

.pagination-row {
  margin-top: 6px;
}

/* ===== Status pill (display column) ===== */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12.5px;
  font-weight: 600;
}

.status-pill i {
  font-size: 8px;
}

.status-pill-on {
  background: #eaf6e1;
  color: #5a8a3a;
}

.status-pill-off {
  background: #fbe9e9;
  color: #a14747;
}

/* ===== Modal layout ===== */
.modal-body-pad {
  padding-top: 4px;
}

.modal-header-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-header-icon {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #ede7dd;
  color: #4c412b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.modal-hint {
  font-size: 13px;
  color: #8a7d68;
  margin-bottom: 14px;
}

.modal-field-label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #4c412b;
  margin-bottom: 4px;
}

.req-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d35151;
  margin-left: 2px;
  vertical-align: middle;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 22px;
  padding-top: 14px;
  border-top: 1px solid #f0ece2;
}

.btn-close {
  color: #f8f9fa;
  background-color: #4c412b;
  border-color: #4c412b;
  box-shadow: 1px 1px 3px #666666;
}

.btn-save {
  background: #ede7dd;
  border-color: #ede7dd;
  color: #4c412b;
  box-shadow: 1px 1px 3px #666666;
}
.bg-warning{
    background-color: #fed16e !important;
}
.btn-save:hover {
  background: #fed16e;
  border-color: #fed16e;
}

#input-btn>div:nth-child(2) {
  text-align: end;
}

#tp-size {
  width: 85%;
}

#content>div>div:nth-child(1) .form-control:focus {
  border-color: transparent;
  outline: 0;
  box-shadow: 0 0 0 0 #665b48;
}

/* ✅ คืน focus border ให้ input ในกล่อง modal (แก้ไข/คัดลอก)
   เพราะ rule ด้านบนดันไปลบ focus style ของ input พวกนี้ไปด้วยโดยไม่ตั้งใจ
   ทำให้ตอนคลิกกรอกข้อมูล มองไม่เห็นว่ากำลังโฟกัสอยู่ที่ช่องไหน */
.modal-input:focus {
  border-color: #50c1d0 !important;
  outline: 0 !important;
  box-shadow: 0 0 0 2px rgba(80, 193, 208, 0.25) !important;
}

#btn-filter {
  background-color: #4c412b;
  border-color: #4c412b;
}

#page {
  margin: auto;
  margin-top: 40px !important;
}

.fa-plus {
  background: white;
  padding: 5px 7px;
  border-radius: 50%;
}

/* ปุ่ม "จัดการ" — เดิมเป็นแค่ไอคอน … สีลิงก์ตัวเล็ก สังเกตยาก
   (และ style เดิมไม่ติดเพราะเป็น scoped แต่ปุ่มอยู่ใน b-dropdown → ต้องใช้ ::v-deep) */
.domain-table-card ::v-deep .action-dropdown-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  color: #4c412b;
  background: #fff8e6;
  border: 1px solid #f3d58a;
  border-radius: 999px;
  box-shadow: 0 1px 2px rgba(76, 65, 43, 0.08);
  transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}
.domain-table-card ::v-deep .action-dropdown-toggle:hover,
.domain-table-card ::v-deep .action-dropdown-toggle:focus,
.domain-table-card ::v-deep .show > .action-dropdown-toggle {
  color: #4c412b;
  background: #fed16e;
  border-color: #fed16e;
  box-shadow: 0 3px 8px rgba(254, 209, 110, 0.45);
  outline: none;
}
.domain-table-card ::v-deep .action-dropdown-toggle .action-caret {
  font-size: 10px;
  opacity: 0.7;
  transition: transform 0.2s ease;
}
.domain-table-card ::v-deep .show > .action-dropdown-toggle .action-caret {
  transform: rotate(180deg);
}

/* แถวกดได้ → ไปหน้า SubDomain */
.domain-table-card ::v-deep tr.domain-row-clickable {
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.domain-table-card ::v-deep tr.domain-row-clickable:hover > td {
  background-color: #fbf6ea;
}

/* ===== Action dropdown menu (คอลัมน์ "การจัดการ") ===== */
.domain-table-card ::v-deep .dropdown-menu {
  z-index: 1050;
  min-width: 170px;
  padding: 6px;
  border: 1px solid #ece6da;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(76, 65, 43, 0.15);
}

.domain-table-card ::v-deep .dropdown-item {
  border-radius: 6px;
  font-size: 14px;
  padding: 8px 10px;
}

.domain-table-card ::v-deep .dropdown-item:hover,
.domain-table-card ::v-deep .dropdown-item:focus {
  background-color: #f5f1e8;
  color: #4c412b;
}
.domain-table-card ::v-deep .text-danger .dropdown-item {
  color: #c0392b;
}
.domain-table-card ::v-deep .text-danger .dropdown-item:hover {
  background-color: #fdecea;
  color: #c0392b;
}

/* กันแถวสุดท้ายในตารางถูกเมนูบัง ให้ dropdown มีที่ล้นลงมาด้านล่างได้ */
.domain-table-card ::v-deep .table-responsive,
.domain-table-card ::v-deep tbody tr:last-child td {
  overflow: visible;
}

#filter-input {
  box-sizing: border-box;
  background-image: url("@/assets/search_icon.png");
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

#page {
  margin-bottom: 50px !important;
}

@media only screen and (min-width: 0px) and (max-width: 1024px) {
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

/* ===================== Tablet / จอกลาง (768px – 1199px) ===================== */
@media (min-width: 768px) and (max-width: 1199.98px) {
  /* 992–1199px เดิมบังคับทุกอย่างอยู่บรรทัดเดียว (flex-lg-nowrap) ปุ่ม Import ล้นขอบขวา
     → ให้ตัดบรรทัด: หัวข้อ+ตัวกรองบรรทัดแรก, ช่องค้นหา+ปุ่มบรรทัดถัดไป */
  .page-header-row {
    flex-wrap: wrap !important;
  }
  .page-header-row > .col-lg-auto:first-child {
    flex: 0 0 100%;
    max-width: 100%;
  }
  .domain-search-col {
    flex: 1 1 0% !important;
    max-width: none !important;
    margin-left: 0 !important;
  }
  .domain-table-card ::v-deep .status-pill,
  .domain-table-card ::v-deep th {
    white-space: nowrap;
  }
  /* เดิมแถวตัวกรองชิดติดกับช่องค้นหา → เว้นระยะ และจัดปุ่มให้อยู่แนวเดียวกับช่องค้นหา */
  .domain-search-col,
  .domain-action-col {
    margin-top: 12px;
    align-self: center;
  }
  .domain-action-col {
    padding-left: 10px !important;
  }
  .domain-action-col ::v-deep .btn {
    min-height: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin: 0 !important;
    white-space: nowrap;
  }
}

/* ===================== Mobile (< 768px) ===================== */
@media (max-width: 767.98px) {
  /* ตัวกรอง: 2 ช่องเต็มความกว้าง เท่ากัน */
  .domain-filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    width: 100%;
  }
  .domain-filter {
    justify-content: space-between;
  }
  .domain-filter {
    min-width: 0;
    padding-left: 10px;
  }
  .domain-filter-select {
    flex: 1 1 auto;
    min-width: 0;
    padding-left: 4px;
    text-overflow: ellipsis;
  }

  /* ช่องค้นหาเว้นระยะจากตัวกรอง */
  .domain-search-col {
    margin-top: 12px;
  }

  /* ปุ่ม เพิ่มหัวเรื่อง / Import: ครึ่งจอเท่ากัน */
  .domain-action-col {
    flex: 0 0 50%;
    max-width: 50%;
    padding: 0 4px !important;
  }
  .domain-action-col:first-of-type,
  .domain-search-col + .domain-action-col {
    padding-left: 0 !important;
  }
  .domain-action-col:last-child {
    padding-right: 0 !important;
  }
  .domain-action-col ::v-deep .btn {
    width: 100% !important;
    min-height: 42px;
    margin: 0 !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    white-space: nowrap;
  }

  /* ตาราง: แต่ละแถวเป็นการ์ดแบบกระชับ (เลข | ชื่อ+สถานะ | ปุ่มตั้งค่า)
     แทนรูปแบบ stacked เดิมที่ 1 เรื่องกินพื้นที่ 4 บรรทัด */
  .domain-table-card ::v-deep .b-table-stacked-md > tbody > tr {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas:
      "num name action"
      "num status action";
    align-items: center;
    column-gap: 12px;
    row-gap: 4px;
    padding: 12px 14px;
    border-top: none;
    border-bottom: 1px solid #f1ece2;
  }
  .domain-table-card ::v-deep .b-table-stacked-md > tbody > tr:last-child {
    border-bottom: none;
  }
  .domain-table-card ::v-deep .b-table-stacked-md > tbody > tr > td {
    display: block;
    border: none !important;
    padding: 0 !important;
    text-align: left !important;
  }
  .domain-table-card ::v-deep .b-table-stacked-md > tbody > tr > td::before {
    display: none !important;
  }
  .domain-table-card ::v-deep .b-table-stacked-md > tbody > tr > td > div {
    width: auto !important;
    padding: 0 !important;
  }
  .domain-table-card ::v-deep .b-table-stacked-md > tbody > tr > td:nth-child(1) {
    grid-area: num;
    min-width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #f6f2ea;
    color: #8a7d68;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .domain-table-card ::v-deep .b-table-stacked-md > tbody > tr > td:nth-child(2) {
    grid-area: name;
    font-size: 15px;
    line-height: 1.35;
    min-width: 0;
  }
  /* ชื่อยาวให้ขึ้นบรรทัดใหม่ได้สูงสุด 2 บรรทัด แล้วตัดด้วย … */
  .domain-table-card ::v-deep .b-table-stacked-md > tbody > tr > td:nth-child(2) b {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-word;
  }
  .domain-table-card ::v-deep .b-table-stacked-md > tbody > tr > td:nth-child(3) {
    grid-area: status;
  }
  .domain-table-card ::v-deep .b-table-stacked-md > tbody > tr > td:nth-child(4) {
    grid-area: action;
  }
}

@media (max-width: 420px) {
  .domain-filters {
    grid-template-columns: 1fr;
  }
}
</style>