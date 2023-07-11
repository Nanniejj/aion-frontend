<template>
  <div>
    <b-container fluid id="tp-size">
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
          <TemplateAddUser />
          <TemplateEditUser ref="TemplateEditUser" />
          <TemplateGroupMapUser ref="TemplateGroupMapUser" :items="datarow"/>
        </b-col>
      </b-row>
      <br />

      <br />
      <!-- {{getUserList}} -->
      <!-- Main table element -->
      <b-table
        hover
        :items="getUserList"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :filter-included-fields="filterOn"
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
        <!-- @row-clicked="linkToSubDomain"   -->
        <template #cell(id)="row">
          {{ row.index + 1 + (currentPage - 1) * 10 }}
        </template>
        <template #cell(name)="row">
          <b>{{ row.value }}</b>
        </template>

        <template #cell(actions)="row">
          <span
            class="fa fa-pencil"
            v-b-tooltip.hover
            title=" แก้ไขข้อมูล"
            size="sm"
            @click="editUser(row.item)"
          >
          </span>
          <span
            class="fas fa-trash-alt"
            v-b-tooltip.hover
            title="ลบ"
            size="sm"
            v-on:click="removeRow(row.item)"
          ></span>
          <span
            class="fas fa-list-ul"
            v-b-tooltip.hover
            title="จัดการ group"
            size="sm"
            @click="editGroup(row.item)"
          ></span>
        
        </template>

        <template #cell(display)="row">
          <span v-if="row.value == 'แสดงผล'"
            ><i class="fa fa-circle" style="color:#8cc751;" />
            {{ row.value }}</span
          >
          <span v-else
            ><i class="fa fa-circle" style="color:#d35151;" />
            {{ row.value }}</span
          >
        </template>
      </b-table>
      <!-- paginate -->
      <b-row>
        <b-col sm="7" md="6" class="my-1" id="page" v-if="!filter">
          <b-pagination
            v-model="currentPage"
            :total-rows="this.getUserList.length"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0"
          ></b-pagination>
        </b-col>
        <b-col sm="7" md="6" class="my-1" id="page" v-else>
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0"
          ></b-pagination>
        </b-col>
      </b-row>

      <!-- Info modal -->
    </b-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import TemplateAddUser from "@/components/user/TemplateAddUser.vue";
import TemplateEditUser from "@/components/user/TemplateEditUser.vue";
import TemplateGroupMapUser from "@/components/user/TemplateGroupMapUser.vue";

export default {
  components: { TemplateAddUser, TemplateEditUser, TemplateGroupMapUser },
  data() {
    return {
      datarow:"",
      empData: "ไม่พบข้อมูล",
      idUser: 0,
      fields: [
        { key: "id", label: "#", sortable: true, class: "text-center" },
        { key: "username", label: "Username", sortable: true },
        { key: "name", label: "ชื่อ", sortable: true },
        { key: "lastname", label: "นามสกุล", sortable: true },
        { key: "company", label: "บริษัท/หน่วย", sortable: true },
        { key: "role", label: "สิทธิ์", sortable: true },
        { key: "email", label: "Email", sortable: true },
        { key: "projectname", label: "Group", sortable: true },
        { key: "actions", label: "การจัดการ" },
      ],
      selected: "",
      options: [
        { text: "แสดงผล", value: true },
        { text: "ไม่แสดงผล", value: false },
      ],
      textDomain: "",
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
    ...mapGetters(["getUserList"]),
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
    editUser(item) {
      this.$refs.TemplateEditUser.openModal(item);
    },
    editGroup(item) {
      console.log(item);
      this.datarow=item
      this.$refs.TemplateGroupMapUser.openModal(item);
    },
    ///////////////////////////////
    removeRow: function(item) {
      // console.log('delete');
      this.$confirm("คุณต้องการลบข้อมูล " + item.username + " ?").then(() => {
        // alert(item._id)
        this.$store.dispatch("deleteUser", { delUserid: item._id });
        this.totalRows = this.getUserList.length;
      });
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      console.log("item", filteredItems);
      this.currentPage = 1;
    },
  },
  created() {
    this.$store.dispatch("fetchTemplateUser");
  },
};
</script>
<style scoped>
table > thead > tr > th:nth-child(3) {
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
.btn-save:hover {
  background: #fed16e;
  border-color: #fed16e;
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
</style>
