<template>
  <div>
    <b-container fluid>
      <!-- {{getListReport}} -->
      <!-- https://bootstrap-vue.org/docs/components/table#custom-data-rendering   \ Complete example -->
      <!-- User Interface controls -->

      <!-- {{valueWeek}} -->
      <!-- {{getListTargetReport}} -->
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
                v-model="getTableReport.filter"
                type="search"
                placeholder="ค้นหา"
              ></b-form-input>

              <!-- <b-input-group-append>
              <b-button    @click="searchProfile"><i class="fa fa-search"></i></b-button>
              </b-input-group-append> -->
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col lg="6" class="my-1">
          <ButtonReport />
        </b-col>
      </b-row>

      <!-- Main table element -->
      <div v-if="getListTargetReport">
        <b-row class="mt-2 mb-2">
          <b-col lg="6"></b-col>
          <b-col lg="6">
            <b-form-group
              label="Sort"
              label-for="sort-by-select"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0 text-right"
            >
              <b-input-group size="sm">
                <b-form-select
                  id="sort-by-select"
                  v-model="getTableReport.sortBy"
                  :options="sortOptions"
                  class="w-75"
                >
                  <template #first>
                    <option value="">-- none --</option>
                  </template>
                </b-form-select>

                <b-form-select
                  v-model="getTableReport.sortDesc"
                  :disabled="!getTableReport.sortBy"
                  size="sm"
                  class="w-25"
                >
                  <option :value="false">Asc</option>
                  <option :value="true">Desc</option>
                </b-form-select>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
        <vue-element-loading
          :active="getLoadReport"
          size="80"
          background-color="rgba(255, 255, 255, 0.3)"
          color="#fbf7f6"
        />
        <b-table
          hover
          responsive
          :sort-by.sync="getTableReport.sortBy"
          :sort-desc.sync="getTableReport.sortDesc"
          :items="getListReport"
          :fields="getTableReport.fieldsReport"
          :current-page="getTableReport.currentPage"
          :per-page="getTableReport.perPage"
          :filter="getTableReport.filter"
          :filter-included-fields="getTableReport.filterOn"
          :empty-filtered-text="empData"
          stacked="md"
          show-empty
          small
          @filtered="onFiltered"
          head-variant="light"
          class="text-break"
          id="tb-profile"
          @row-clicked="linkToProfile"
        >
          <template #cell(id)="row">
            <!-- <b>{{ row.value}}</b>  -->
            <b>{{ row.index + 1 + (getTableReport.currentPage - 1) * 10 }}</b>
            <!-- {{row.item.__ob__.dep.id}} -->
          </template>
          <template #cell(uid)="row">
            <div>{{ row.value }}</div>
            <!-- <div v-if="row.item.name"><b>{{ row.item.name}}</b> </div>
        <div v-else><b>{{ row.value}}</b></div>      -->
          </template>
          <template #cell(name)="row">
            <div v-if="row.item.name">
              <b>{{ row.value }}</b>
            </div>
            <div v-else><b>-</b></div>
          </template>
          <template #cell(source)="row">
            <span v-if="row.value === 'facebook'"
              ><img src="@/assets/Facebook.png" class="socialogo2"
            /></span>
            <span v-else-if="row.value === 'twitter'"
              ><img src="@/assets/Twitter.png" class="socialogo2"
            /></span>
            <span v-else-if="row.value === 'pantip'"
              ><img src="@/assets/Pantip.png" class="socialogo2"
            /></span>
            <span v-else-if="row.value === 'news'"
              ><img src="@/assets/News.png" class="socialogo2"
            /></span>
            <span v-else-if="row.value === 'youtube'"
              ><img src="@/assets/Youtube.png" class="socialogo2"
            /></span>
            <span v-else-if="row.value === 'instagram'"
              ><img src="@/assets/Instagram.png" class="socialogo2"
            /></span>
            <span v-else-if="row.value === 'blockdit'"
              ><img src="@/assets/Blockdit.png" class="socialogo2"
            /></span>
            <span v-else-if="row.value === 'tiktok'"
              ><img src="@/assets/Tiktok.png" class="socialogo2"
            /></span>
            <span v-else></span>
          </template>
          <template #cell(count)="row">
            <div>{{ row.value | numFormat }}</div>
          </template>
          <template #cell(engagement)="row">
            <div>{{ row.value | numFormat }}</div>
          </template>
          <template #cell(follower)="row">
            <div v-if="row.value > 0">{{ row.value | numFormat }}</div>
            <div v-else>-</div>
          </template>
          <template #cell(actions)="row">
            <span
              class="fas fa-list-ul"
              v-b-tooltip.hover
              title="ดูข้อมูลส่วนตัว"
              size="sm"
              @click="linkToProfile(row.item)"
            ></span>
          </template>

          <template #cell(status)="row">
            <span v-if="row.value == 'มีข้อมูล'"
              ><i class="fa fa-circle" style="color: #42aa41" />
              {{ row.value }}</span
            >
            <span v-else
              ><i class="fa fa-circle" style="color: #d35151" />
              {{ row.value }}</span
            >
          </template>
        </b-table>
        <!-- paginate -->
        <b-row>
          <b-col sm="7" md="6" class="my-1" id="page">
            <b-pagination
              v-if="!getTableReport.filter"
              v-model="getTableReport.currentPage"
              :total-rows="getListReport.length"
              :per-page="getTableReport.perPage"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
            <b-pagination
              v-else
              v-model="getTableReport.currentPage"
              :total-rows="getTableReport.totalRows"
              :per-page="getTableReport.perPage"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
          </b-col>
        </b-row>
      </div>

      <!-- 
    </div> -->
    </b-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import ButtonReport from "@/components/report/ButtonReport.vue";

//import SelectMonitor from '@/components/monitor/SelectMonitor.vue';
export default {
  components: {
    ButtonReport,
  },
  watch: {
    getDateReport() {
      this.getTableReport.currentPage = 1;
    },
    getListReport() {
      this.getTableReport.currentPage = 1;
    },
  },
  data() {
    return {
      seen: false,
      createUser: "",
      empData: "ไม่พบข้อมูล",
      valueWeek: null,
    };
  },
  computed: {
    ...mapGetters([
      "getItemsProfile",
      "getFieldsProfile",
      "getTableReport",
      "getListTargetReport",
      "getListTargetReport",
      "getTableReport",
      "getListReport",
      "getLoadReport",
      "getDateReport",
    ]),
    sortOptions() {
      // Create an options list from our fields
      return this.getTableReport.fieldsReport
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
  },
  methods: {
    delProfile(item) {
      this.$confirm("คุณต้องการเลิกติดตาม ?").then(() => {
        this.$store.dispatch("DeleteMonitor", {
          account: item.uid,
          source: item.source,
        });
        // this.getListTargetReport.splice(index, 1);
      });
    },
    createProfile() {},
    searchProfile() {
      this.$store.dispatch("fetchSearchMonitor", {
        query: this.getListReport.filter,
        search_type: "profile",
      });
      this.seen = true;
      this.createUser = this.getListReport.filter;
    },
    linkToProfile(item) {
      // console.log("item", item);
      if (item.name) {
        localStorage.setItem("nameReport", item.name);
      }
      localStorage.setItem("uidReport", item.account_name);
      localStorage.setItem("sourceReport", item.source);
      this.$router.push({ name: "ReportProfile" });
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.getListReport.totalRows = filteredItems.length;
      this.getListReport.currentPage = 1;
    },
  },
  async created() {
    // console.log("getSocialMo", this.$route.params);
    // this.$store.dispatch("fatchListMonitor", {
    //   source: this.social,
    // });
    // this.$store.dispatch("fetchListTargetReport",{});

    // if(this.getSocialMo == ''){
    // await  this.$store.dispatch("fatchListMonitor");
    // }else {
    //  await this.$store.dispatch("fatchListMonitor", {
    //     source : this.social
    //   });
    // }
  },
};
</script>
<style scoped>
.socialogo2 {
  width: 40px;
}
.h5 {
  font-size: large;
}
.card-body {
  min-height: auto;
  margin: 25px;
}
thead > tr > th:nth-child(5) {
  width: 121px !important;
}
thead > tr > th:nth-child(7) {
  width: 160px;
}
#fcrawl {
  color: #17a2b8;
  padding: 2px 10px;
  background: #d3f4fa;
  border-radius: 20px;
}
#ncrawl {
  color: #e6342a;
  padding: 2px 10px;
  background: #ffe4e3;
  border-radius: 20px;
}
#crawl {
  color: #42aa41;
  padding: 2px 10px;
  background: #eaf8ea;
  border-radius: 20px;
}
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
.fa-trash,
.fa-list-ul,
.fa-user-alt-slash {
  background: #c3d3e7;
  padding: 7px;
  border-radius: 50%;
  box-shadow: 1px 1px 3px #666666;
  margin: 0px 5px;
  color: #4c412b;
  width: 32px;
  height: 30px;
}
.fa-user-alt-slash:hover {
  background: #4c412b;
  color: white;
}
.fa-trash:hover {
  background: #4c412b;
  color: white;
}
.fa-list-ul:hover {
  background: #4c412b;
  color: white;
}
#filter-input {
  box-sizing: border-box;
  background-image: url("/search_icon.png");
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
  table-layout: fixed;
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
