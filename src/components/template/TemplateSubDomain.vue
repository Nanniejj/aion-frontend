<template>
  <b-container fluid id="tp-size">
    <vue-element-loading
      :active="getLoadStatus"
      size="80"
      background-color="rgba(255, 255, 255, 0.4)"
      color="#b6ac9a"
    />
    <!-- https://bootstrap-vue.org/docs/components/table#custom-data-rendering   \ Complete example -->
    <!-- User Interface controls -->

    <b-row id="input-btn">
      <b-col lg="6" class="my-1">
        <b-form-group
          label-for="filter-input"
          label-cols-sm="0"
          label-align-sm="right"
          label-size="md"
          class="mb-0"
        >
          <b-input-group size="md">
            <b-form-input
              id="filter-input"
              v-model="filter"
              type="search"
              placeholder="ค้นหา"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col lg="6" class="my-1">
        <TemplateAddSubDomain />
        <!-- <button class="btn btn-add" ><i class="fa fa-plus"/><span  style="font-size:16px;"> เพิ่ม Domain </span></button> -->
      </b-col>
    </b-row>
    <br />
    <!-- Main table element -->
    <!-- {{   getItemsSubDomain.length}} -->
    <b-table
      hover
      :items="getItemsSubDomain"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filter-included-fields="['name']" 
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      :empty-filtered-text="empData"
      stacked="md"
      show-empty
      small
      @filtered="onFiltered"
      head-variant="light"
    >
      <template #cell(id)="row">
        {{ row.index + 1 + (currentPage - 1) * 10 }}
      </template>
      <template #cell(domain)="row">
        {{ row.value.name }}
      </template>
      <template #cell(name)="row">
        <b>{{ row.value }}</b>
      </template>
      <template #cell(display)="row">
          <span v-if="row.value == true"
            ><i class="fa fa-circle" style="color:#8cc751;" />
         แสดงผล</span
          >
          <span v-else
            ><i class="fa fa-circle" style="color:#d35151;" />
            ไม่แสดงผล</span
          >
        </template>
      <template #cell(actions)="row">
        <span
          class="fa fa-pencil"
          v-b-tooltip.hover
          title=" แก้ไขข้อมูล"
          size="sm"
          @click="
            open = true;
            info(row.item, row.index, $event.target);
          "
        >
        </span>
        <span
          class="fas fa-trash-alt"
          v-b-tooltip.hover
          title="ลบ"
          size="sm"
          v-on:click="removeRow(row.index, row.item)"
        ></span>
        <span
          class="fas fa-list-ul"
          v-b-tooltip.hover
          title="ดูถุงคำ"
          size="sm"
          @click="linkToWord(row.item)"
        ></span>
      </template>
    </b-table>

    <!-- Info modal -->
    <vue-modaltor
      :visible="open"
      @hide="hideModal"
      :resize-width="{ 2500: '40%', 992: '50%', 768: '90%' }"
      :animation-panel="'modal-slide-top'"
    >
      <b-container fluid>
        <h5><b>แก้ไขข้อมูล</b></h5>
        <hr />
        <p>คำแนะนำ : กรุณาตรวจสอบข้อมูลทุกครั้งก่อนทำการบันทึก</p>
        <div>
          <b-form-input v-model="textSubDomain" placeholder=""  maxlength="50">
            <b>{{ textSubDomain }}</b></b-form-input
          ><small class="text-muted">{{ textSubDomain.length }} / 50 ตัวอักษร</small>
          <br />
          <b-row class="my-1">
            <b-col sm="12" style="text-align:right;">
              <br />
              <b-button class="btn btn-close" size="sm" @click="hideModal()"
                >ปิดหน้าต่าง</b-button
              >
              <b-button class="btn btn-save" size="sm" @click="editSubDomain"
              :disabled="textSubDomain.trim().length === 0"  >บันทึก</b-button
              >
            </b-col>
          </b-row>
          <!-- <div class="mt-2">Value: {{ textSubDomain }}</div> -->
        </div>
      </b-container>
    </vue-modaltor>

    <!-- paginate -->
    <b-row>
      <b-col sm="7" md="6" class="my-1" id="page">
        <b-pagination
          v-if="!filter"
          v-model="currentPage"
          :total-rows="getRowCount"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
        ></b-pagination>
        <b-pagination
          v-else
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
        ></b-pagination>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import TemplateAddSubDomain from "@/components/template/TemplateAddSubDomain.vue";
import { mapGetters } from "vuex";

export default {
  components: { TemplateAddSubDomain },
  data() {
    return {
      empData: "ไม่พบข้อมูล",
      subDomainId: [],
      IdDm: [],
      fields: [
        { key: "id", label: "#", sortable: true, class: "text-center" },
        { key: "domain", label: "Domain", sortable: true },
        { key: "name", label: "SubDomain", sortable: true },
        { key: "display", label: "status", sortable: true },
        { key: "actions", label: "การจัดการ" },
      ],
      textSubDomain: "",
      itemsd: [],
      open: false,
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
    };
  },
  computed: {
    ...mapGetters([
      "getSelected",
      "getListWord",
      "getFieldsSubDomain",
      "getItemsDomain",
      "getItemsSubDomain",
      "getDomainId",
      "getRowCount",
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
  mounted() {
    // Set the initial number of items
    this.totalRows = this.getRowCount;
  },
  methods: {
    linkToWord(item) {
      // console.log(item);
      this.$store.commit("setSubDomainName", item);
      this.$router.push({ name: "TemplateSettingWord" });
    },
    removeRow: function(index, item) {
      console.log("delete");
      this.$confirm("คุณต้องการลบข้อมูล?").then(() => {
        this.$store.dispatch("deleteSubdomain", { id: item.id, index: index });
        //this.getItemsSubDomain.splice(index, 1);
        this.totalRows = this.getRowCount;
      });
    },
    editSubDomain() {
      // this.$store.dispatch('updateSubDomain')
      console.log(this.subDomainId);
      this.$store.dispatch("updateSubDomain", {
        name: this.textSubDomain,
        id: Number(this.subDomainId),
        domain: Number(this.IdDm),
      });
      //console.log('kkkkk'+this);
      this.open = false;
      // // this.$confirm("กรุณายืนยันข้อมูล").then(() => {
      //   var _this = this;
      //   var token='8ed9acde328c317fef0afce75850dc637e674174';
      //   const AuthStr = "Token " + token;
      //   var data = JSON.stringify({"name":_this.textSubDomain,"id":Number(_this.subDomainId),"domain":Number(_this.IdDm)});
      // console.log(data);
      //   var config = {
      //     method: 'put',
      //     url: API_URL+'/v1/subdomain/'+_this.subDomainId+'/',
      //     headers: {
      //       Authorization: AuthStr,
      //       "Content-Type": "application/json",
      //     },
      //     data : data
      //   };
      //   axios(config)
      //   .then(function () {
      //   _this.$fire({
      //       title: "บันทึกข้อมูลสำเร็จ",
      //       type: "success",
      //     showConfirmButton: false,
      //       timer: 1000,
      //     })
      //     _this.hideModal()
      //     location.reload();
      // })
      //   .catch(function () {
      //    _this.$alert("ไม่สามารถดำเนินการได้").then(() => {});
      //   });

      // // });
    },

    backDomain: function() {
      this.$store.commit("setListSubDomain", false);
      console.log("back");
    },
    hideModal() {
      this.open = false;
    },
    info(item, index, button) {
      this.subDomainId = item.id;
      this.IdDm = item.domain.id;
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.content = item.domain.name;
      this.textSubDomain = item.name;
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
  created() {},
};
</script>

<style scoped>
.table-hover tbody tr:hover {
  cursor: pointer;
  color: #4c412b;
  background-color: #ede7dd57;
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
.btn-save:hover {
  background: #fed16e;
  border-color: #fed16e;
}
.title-domain a {
  cursor: pointer;
}
.title-domain {
  text-align: start;
  /* margin-left: 12%; */
  margin-bottom: 20px !important;
}
#input-btn > div:nth-child(2) {
  text-align: end;
}
#tp-size {
  width: 85%;
}
#content > div > div:nth-child(1) .form-control:focus {
  border-color: transparent;
  outline: 0;
  box-shadow: 0 0 0 0 #ede7dd;
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
.fa-pencil,
.fa-list-ul,
.fa-trash-alt {
  background: #fed16ebf;
  padding: 10px;
  border-radius: 50%;
  box-shadow: 1px 1px 3px #666666;
  margin: 7px 5px;
  color: #4c412b;
}
.fa-pencil:hover {
  background: #4c412b;
  color: white;
}
.fa-list-ul:hover {
  background: #4c412b;
  color: white;
}
.fa-trash-alt:hover {
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
@media only screen and (min-width: 0px) and (max-width: 600px) {
  #page {
    margin-bottom: 50px !important;
  }
}
</style>
