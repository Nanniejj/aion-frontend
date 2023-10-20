<template>
  <div>
    <b-container fluid class="mt-4">
      <!-- https://bootstrap-vue.org/docs/components/table#custom-data-rendering   \ Complete example -->
      <!-- User Interface controls -->
      <!-- <SumMonitor :tabsMonitor="'tabHashtag'" /> -->
      <h3 class="text-left bold my-4">Keyword</h3>
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
          <CreateMonitor class="mb-2 text-right" :tabsMonitor="'tabKeyword'" />
        </b-col>
      </b-row>

      <!-- Main table element -->
      <b-row class="mb-2">
        <b-col cols="12" md="6" lg="6"
          >
          <div class="text-left" v-if="getKeyword">
            <span class=" "
              >Total
              <span class="bold">{{ getKeyword.length }}</span> keywords</span
            >
          </div>
          </b-col
        >
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
                v-model="sortBy"
                :options="sortOptions"
                class="w-75"
              >
                <template #first>
                  <option value="">-- none --</option>
                </template>
              </b-form-select>

              <b-form-select
                v-model="sortDesc"
                :disabled="!sortBy"
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
      <!-- {{ keywordData }} -->
      <b-table
        hover
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :items="getKeyword"
        :fields="field"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :filter-included-fields="filterOn"
        :empty-filtered-text="empData"
        stacked="md"
        show-empty
        small
        @filtered="onFiltered"
        head-variant="light"
      >
        <template #cell(id)="row">
          <b>{{ row.index + 1 + (currentPage - 1) * 10 }}</b>
        </template>
        <template #cell(keyword)="row">
          <b>{{ row.value }}</b>
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
          <span v-else-if="row.value === 'tiktok'"
            ><img src="@/assets/Tiktok.png" class="socialogo2"
          /></span>
          <span v-else
            ><img src="@/assets/Blockdit.png" class="socialogo2"
          /></span>
        </template>
        <template #cell(crawled)="row">
          <span v-if="row.value == true" id="crawl">เก็บแล้ว</span>
          <span v-if="row.value == false" id="ncrawl">ยังไม่เก็บ</span>
          <span v-if="row.value == 'crawling'" id="fcrawl">กำลังเก็บ</span>
        </template>
        <template #cell(actions)="row">
          <span
            class="fas fa-trash-alt"
            v-b-tooltip.hover
            title="ลบ"
            @click="delKeyword(row.item, row.index)"
            size="sm"
          ></span>
          <!-- <i class="fas fa-user-check"></i>
        <i class="fas fa-user-plus"></i> -->
          <span
            class="fas fa-list-ul"
            v-b-tooltip.hover
            title="ดู keyword"
            size="sm"
            @click="linkToHashtag(row.item)"
          ></span>
        </template>
        <template #cell(status)="row">
          <span v-if="row.value == 2">
            <div class="">
              <i class="fa fa-circle" style="color: #ffc107" /> เก็บเสร็จแล้ว
            </div>
            <b-badge pill variant="secondary" @click="updateHashtag(row.item)">
              <span class="h6">
                <b-icon icon="arrow-repeat" aria-hidden="true"></b-icon>
              </span>
              <span class="font-weight-lighter"> เก็บเพิ่ม</span></b-badge
            >
          </span>

          <span v-else>
            <span class=""
              ><i class="fa fa-circle" style="color: #42aa41" /> กำลังเก็บ</span
            >
            <!-- <b-button pill variant="outline-success" 
         class="pt-1 pb-1">กำลังเก็บ</b-button> -->
          </span>
        </template>
      </b-table>
      <!-- paginate -->
      <b-row>
        <b-col sm="7" md="6" class="my-1" id="page">
          <b-pagination
            v-if="!filter"
            v-model="currentPage"
            :total-rows="getKeyword.length"
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
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import CreateMonitor from "@/components/monitor/CreateMonitor.vue";
// import SumMonitor from "@/components/monitor/SumMonitor.vue";
//import TemplateAddDomain from '@/components/template/TemplateAddDomain.vue';

export default {
  components: {
    CreateMonitor,
    // SumMonitor,
  },
  data() {
    return {
      keywordData: [],
      empData: "ไม่พบข้อมูล",
      hover: false,
      field: [
        { key: "id", label: "#", sortable: true },
        { key: "keyword", label: "Keyword", sortable: true },
        //  { key: 'url', label: 'URL', sortable: true, sortDirection: 'desc' },
        { key: "source", label: "source", sortable: true },
        //{ key: 'last_time', label: 'เวลา', sortable: true, sortDirection: 'desc' },
        // { key: "crawled", label: "การเก็บข้อมูล", sortable: true },

        // {
        //   key: "status",
        //   label: "สถานะ",
        //   sortByFormatted: true,
        //   filterByFormatted: true,
        //   sortable: true,
        // },
        { key: "actions", label: "การจัดการ" },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
    };
  },
  computed: {
    ...mapGetters([
      "getItemsHashtag",
      "getFieldsHashtag",
      "getHashtag",
      "getListMonitorProfile",
      "getKeyword",
    ]),
    sortOptions() {
      // Create an options list from our fields
      return this.field
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
    message() {
      return this.hover === true ? "หยุดเก็บแล้ว" : "เก็บอีกครั้ง";
    },
  },
  methods: {
    updateHashtag(item) {
      var hashtag = item.uid.replace("#", "");
      console.log("unhash", hashtag, item.source);
      this.$confirm("คุณต้องการเก็บข้อมูล #" + hashtag + " เพิ่ม?").then(() => {
        this.$store.dispatch("EditStatusHashtag", {
          hashtag: hashtag,
          source: item.source,
          status: 1,
        });
        item.status = 1;
      });
    },
    handleHover(s, item) {
      console.log(s, item);
      this.hover = s;
    },
    delKeyword(item, index) {
      console.log("delete", item);
      console.log("delete", item);
      this.$confirm("คุณต้องการลบข้อมูล ?").then(async () => {
        await this.$store.dispatch("DeleteKeyword", {
          _id: item._id,
        });
      });
    },
    deleteItem() {
      this.$confirm("คุณต้องการลบข้อมูล ?").then(() => {});
    },
    linkToHashtag(item) {
      this.$store.commit("setKeywordName", item.keyword);
      localStorage.setItem("keywordName", item.keyword);
      // this.$store.commit("setValSource", item.source);
      this.$router.push("/keyword");
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
  mounted() {
    this.$store.dispatch("fetchKeyword");
  },
};
</script>
<style scoped>
.badge-secondary {
  color: #4c412b;
  background-color: #ede7dd;
}
.badge-secondary:hover {
  color: #ede7dd;
  background-color: #4c412b;
}
.socialogo2 {
  width: 40px;
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
.fa-trash,
.fa-list-ul,
.fa-user-alt-slash,
.fa-trash-alt {
  background: #fed16ebf;
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
