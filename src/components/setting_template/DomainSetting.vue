<template>
  <div>
    <b-container fluid id="tp-size">
      <vue-element-loading :active="getLoadStatus" size="80" background-color="rgba(255, 255, 255, 0.4)"
        color="#b6ac9a" />
      <!-- https://bootstrap-vue.org/docs/components/table#custom-data-rendering   \ Complete example -->
      <!-- User Interface controls -->
      <b-row id="input-btn" class="m-0 align-items-center justify-content-lg-between flex-md-nowrap">
        <b-col md="auto" class="mt-lg-0 pl-0 mb-2 mb-md-0">
            <h5 class="m-0 text-left">จัดการหัวเรื่อง (Domain) 
                <!-- <span class="text-info">
                    {{ getItemsDomain.length }}
                </span> -->
            </h5>
            <b-col class="text-left mb-2 text-secondary px-0">
                ทั้งหมด {{ getItemsDomain.length || 0 | numFormat}} เรื่อง
            </b-col>
        </b-col>
        <b-col sm="" lg="auto" class="px-0 ml-0 ml-lg-auto">
            <b-input-group size="md">
                <b-form-input id="filter-input" v-model="filter" type="search" placeholder="ค้นหา"></b-form-input>
            </b-input-group>
        </b-col>
        <b-col sm="auto" class="pr-0">
          <TemplateAddDomain />
          <!-- <button class="btn btn-add" ><i class="fa fa-plus"/><span  style="font-size:16px;"> เพิ่ม Domain </span></button> -->
        </b-col>
      </b-row>
      <br />
      <!-- {{getItemsDomain}} -->
      <!-- Main table element -->
      <b-table hover :items="getItemsDomain" :fields="fields" :current-page="currentPage" :per-page="perPage"
        :filter="filter" :filter-included-fields="['name']" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
        :sort-direction="sortDirection" :empty-filtered-text="empData" stacked="md" show-empty small
        @filtered="onFiltered"  thead-class="">
        <!-- @row-clicked="linkToSubDomain"   -->
        <template #cell(id)="row">
          {{ row.index + 1 + (currentPage - 1) * 10 }}
        </template>
        <template #cell(name)="row">
          <b>{{ row.value }}</b>
        </template>

        <template #cell(actions)="row">
          
          <span class="fas fa-list-ul" v-b-tooltip.hover title="ดู SubDomain" size="sm"
            @click="linkToSubDomain(row.item)"></span>
          <span class="fas fa-copy" v-b-tooltip.hover title="คัดลอก Domain" size="sm"
            @click="buildCloneInfo(row.item, row.index, $event.target);" ></span>
            <span class="fa fa-pencil" v-b-tooltip.hover title=" แก้ไขข้อมูล" size="sm" 
          @click="info(row.item, row.index, $event.target);">
          </span>
          <span class="fa fa-trash-alt" v-b-tooltip.hover title="ลบ" size="sm"
            v-on:click="removeRow(row.index, row.item)"></span>
        </template>

        <template #cell(display)="row">
          <span v-if="row.value == 'แสดงผล'"><i class="fa fa-circle" style="color:#8cc751;" />
            {{ row.value }}</span>
          <span v-else><i class="fa fa-circle" style="color:#d35151;" />
            {{ row.value }}</span>
        </template>
      </b-table>
      <!-- paginate -->
      <b-row>
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
        <b-container fluid>
          <h5><b>แก้ไขข้อมูล</b></h5>
          <hr />
          <p>คำแนะนำ : กรุณาตรวจสอบข้อมูลทุกครั้งก่อนทำการบันทึก</p>
          <div>
            <b-form-input v-model="textDomain" placeholder="" maxlength="50" class="modal-input">
              <b>{{ textDomain }}</b></b-form-input>
              <small class="text-muted">{{ textDomain.length }} / 50
              ตัวอักษร</small>
            <div v-if="hasForbiddenChars(textDomain)" class="text-danger small mt-1">
              <i class="fa fa-exclamation-triangle"></i> ห้ามใส่อักขระพิเศษ เช่น @ _ # $ ฿ % ^ & * ,
            </div>
            <br />
            <b-form-group v-slot="{ ariaDescribedby }">
              <b-form-radio-group v-model="selected" :options="options" :aria-describedby="ariaDescribedby"
                name="radio-inline"></b-form-radio-group>
            </b-form-group>
            <b-row class="my-1">
              <b-col sm="12" style="text-align:right;">
                <br />
                <b-button class="btn btn-close" size="sm" @click="hideModal()">ปิดหน้าต่าง</b-button>
                <b-button class="btn btn-save" size="sm" @click="editDomain()"
                  :disabled="textDomain.trim().length === 0 || hasForbiddenChars(textDomain)">บันทึก</b-button>
              </b-col>
            </b-row>
            <!-- <div class="mt-2">Value: {{ textDomain }}</div> -->
          </div>
        </b-container>
      </vue-modaltor>


      <!-- clone modal -->
      <vue-modaltor :visible="openClone" @hide="hideCloneModal" :animation-panel="'modal-slide-top'">
        <b-container fluid>
          <h5>คัดลอกข้อมูลหัวเรื่อง<b>{{ textDomain }}</b></h5>
          <hr />
          <p>คำแนะนำ : กรุณาตรวจสอบข้อมูลทุกครั้งก่อนทำการบันทึก</p>
          <div>
            <label class="mb-1">ชื่อ Domain ใหม่</label>
            <b-form-input v-model="domainClone.new_domain_name" placeholder="ชื่อ Domain ใหม่" maxlength="50" class="modal-input">
            </b-form-input>
            <small class="text-muted">{{ domainClone.new_domain_name.length }} / 50 ตัวอักษร</small>
            <div v-if="hasForbiddenChars(domainClone.new_domain_name)" class="text-danger small mt-1">
              <i class="fa fa-exclamation-triangle"></i> ห้ามใส่อักขระพิเศษ เช่น @ _ # $ ฿ % ^ & * ,
            </div>
            <br />
            <br />
            <label class="mb-1">คำต่อท้ายชื่อ SubDomain เดิม</label>
            <b-form-input v-model="domainClone.subdomain_suffix" placeholder="เช่น -copy" maxlength="20" class="modal-input">
            </b-form-input>
            <small class="text-muted">{{ domainClone.subdomain_suffix.length }} / 20 ตัวอักษร (เว้นว่างได้)</small>
            <div v-if="hasForbiddenChars(domainClone.subdomain_suffix)" class="text-danger small mt-1">
              <i class="fa fa-exclamation-triangle"></i> ห้ามใส่อักขระพิเศษ เช่น @ _ # $ ฿ % ^ & * ,
            </div>
            <br />
            <br />
            <label class="mb-1">คำต่อท้ายชื่อ Object เดิม</label>
            <b-form-input v-model="domainClone.object_suffix" placeholder="เช่น -copy" maxlength="20" class="modal-input">
            </b-form-input>
            <small class="text-muted">{{ domainClone.object_suffix.length }} / 20 ตัวอักษร (เว้นว่างได้)</small>
            <div v-if="hasForbiddenChars(domainClone.object_suffix)" class="text-danger small mt-1">
              <i class="fa fa-exclamation-triangle"></i> ห้ามใส่อักขระพิเศษ เช่น @ _ # $ ฿ % ^ & * ,
            </div>
            <b-row class="my-1">
              <b-col sm="12" style="text-align:right;">
                <br />
                <b-button class="btn btn-close mx-3" size="sm" @click="hideCloneModal()">ปิดหน้าต่าง</b-button>
                <b-button class="btn btn-save" size="sm" @click="createClone()"
                  :disabled="domainClone.new_domain_name.trim().length === 0 ||
                    hasForbiddenChars(domainClone.new_domain_name) ||
                    hasForbiddenChars(domainClone.subdomain_suffix) ||
                    hasForbiddenChars(domainClone.object_suffix)">คัดลอก</b-button>
              </b-col>
            </b-row>
          </div>
        </b-container>
      </vue-modaltor>
    </b-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import TemplateAddDomain from "@/components/template/TemplateAddDomain.vue";
// import axios from "axios";
// import { API_URL } from '@/common/config';

export default {
  components: { TemplateAddDomain },
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
          formatter: (value) => {
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
      open: false,
      openClone: false,
      totalRows: 1,
      currentPage: 1,
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
      const forbiddenPattern = /[@_#$฿%^&*!~`<>{}[\]|\\/:;"',]/;
      return forbiddenPattern.test(String(value || ""));
    },
    removeRow: function (index, item) {
      console.log("delete");
      this.$confirm("คุณต้องการลบข้อมูล?").then(() => {
        this.$store.dispatch("deleteDomain", {
          id: item.id,
          index: index,
        });
        this.totalRows = this.getItemsDomain.length;
      });
    },
    editDomain() {
      let tdomain = this.textDomain.trim();
      if (tdomain.length === 0 || this.hasForbiddenChars(tdomain)) return;
      this.$store.dispatch("updateDomain", {
        name: tdomain,
        id: this.idDomain,
        display: this.selected,
      });
      this.open = false;

      // this.$confirm("กรุณายืนยันข้อมูล").then(() => {
      //   var _this = this;
      //   var token='8ed9acde328c317fef0afce75850dc637e674174';
      //   const AuthStr = "Token " + token;
      //   var data = JSON.stringify({"name":_this.textDomain,"display":_this.selected,"id":_this.idDomain});
      // console.log(data);
      //   var config = {
      //     method: 'put',
      //     url: API_URL+'/v1/domain/'+_this.idDomain+'/',
      //     headers: {
      //       Authorization: AuthStr,
      //       "Content-Type": "application/json",
      //     },
      //     data : data
      //   };
      //   axios(config)
      //   .then(function () {
      //     _this.$fire({
      //         title: "บันทึกข้อมูลสำเร็จ",
      //         type: "success",
      //       showConfirmButton: false,
      //         timer: 1000,
      //       })
      //       _this.hideModal()
      //       location.reload();
      //   })
      //   .catch(function () {
      //    _this.$alert("ไม่สามารถดำเนินการได้").then(() => {});
      //   });

      // });
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
            this.$store.dispatch("fetchTemplateDomain").then(() => {
              this.totalRows = this.getItemsDomain.length;
            });
            this.hideCloneModal();
          })
          .catch(() => {
            this.$alert("ไม่สามารถดำเนินการได้").then(() => {});
          });
      });
    },
    linkToSubDomain(item) {
      // this.$store.dispatch("fetchListSubDomain",{name:item.name})
      console.log(item.id);
      this.$store.commit("setDomainName", item.name);
      this.$store.commit("setDomainId", item.id);
      this.$router.push({ name: "SettingSubDomain"  ,params: { domain: item.name},query: { id:item.id}});
    },
    hideModal() {
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
      console.log(this.idDomain);
      this.infoModal.content = item.name;
      this.textDomain = item.name;
      this.selected = item.display;
      console.log( this.options);
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
      console.log("item", filteredItems);
      this.currentPage = 1;
    },
  },
  created() {
    this.$store.dispatch("fetchTemplateDomain");
  },
};
</script>
<style scoped>
table>thead>tr>th:nth-child(3) {
  display: none;
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

.fa-pencil{
  background: #fed16ebf;
  padding: 10px;
  border-radius: 50%;
  box-shadow: 1px 1px 3px #666666;
  margin: 7px 5px;
  color: #4c412b;
}
.fa-trash-alt {
  background: #ffc8c8;
  padding: 10px;
  border-radius: 50%;
  box-shadow: 1px 1px 3px #666666;
  margin: 7px 5px;
  color: #776167;
}
.fa-list-ul{
  background: #17a2b8;
  padding: 10px;
  border-radius: 50%;
  box-shadow: 1px 1px 3px #666666;
  margin: 7px 5px;
  color: #ffffff;
}
.fa-copy{
  background: #8cc751;
  padding: 10px;
  border-radius: 50%;
  box-shadow: 1px 1px 3px #666666;
  margin: 7px 5px;
  color: #ffffff;
}


.fa-pencil:hover {
  background: #4c412b;
  color: white;
}

.fa-list-ul:hover {
  background: #4c412b;
  color: white;
}

.fa fa-trash-alt:hover {
  background: #4c412b;
  color: white;
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
  .fa-copy{
    font-size: 12px;
  }
  .fa-list-ul{
    font-size: 12px;
  }
  .fa-trash-alt{
    font-size: 12px;
  }
  .fa-pencil{
    font-size: 12px;
  }
}
</style>