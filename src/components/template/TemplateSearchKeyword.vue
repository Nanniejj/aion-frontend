<template>
  <div>
    <!-- <button class="btn btn-add" @click="open = true">
      <i class="fa fa-search" />
      <span style="font-size:16px;"> ค้นหา keyword </span>
    </button> -->
    <!-- <vue-modaltor
    class="full-modal"
      :visible="open"
      @hide="backbtn"
      :animation-panel="'modal-slide-top'"
      :resize-width="{ 3000: '100%', 992: '100%', 768: '100%' }"
    > -->
    <b-container class="text-left" id="tp-size">
      <div>
       <span  class="text-left h5"> <b>ค้นหา keyword</b></span>
        <span  class="float-right h5"  @click="backbtn()" style="cursor: pointer;"> <i class="fas fa-angle-left"/> กลับ </span>
      </div>
      <hr />
      <b-row class="mb-4">
        <b-col sm="12" md="10">
          <b-form-input
            id="filter-input"
            v-model="filter"
            type="search"
            placeholder="ค้นหา"
            class="mb-2"
          ></b-form-input
        ></b-col>
        <b-col sm="3" md="1">
          <vue-element-loading
            :active="loadding"
            size="38"
            background-color="rgba(255, 255, 255, 0.5)"
            color="#fed16e"
          />
          <b-button  @click="searchKeyword" class="btn-close"
            >ค้นหา</b-button
          ></b-col
        >
      </b-row>
      <div class="my-1">
        <div v-if="items.length">
          <div class="text-h6 my-3">
            <span class="h4">{{ textTitle }}</span> total :
       <span class="bold"> {{ items.length }} </span>    items
          </div>
          <!-- {{getListWord}}{{currentPage}} -->
          <b-table
            :items="items.data"
            :fields="fields"
            :current-page="currentPage"
            :per-page="perPage"
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
              <!-- <b-skeleton-wrapper :loading="false">
          <b-skeleton width="85%"></b-skeleton>
         </b-skeleton-wrapper> -->
              {{ row.value }}
            </template>
            <template #cell(subdomain)="row">
              {{ row.value }}
            </template>
            <template #cell(name)="row">
              <b>{{ row.value }}</b>
            </template>
            <template #cell(actions)="row">
              <span
          class="fas fa-list-ul"
          v-b-tooltip.hover
          title="ดูถุงคำ"
          size="sm"
          @click="linkToWord(row.item)"
        ></span>
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
            </template>
            <template #cell(word)="row">
              <b> {{ row.value }}</b>
            </template>
            <!-- Show Keyword -->
            <template #cell(keywords)="row">
              <!-- เที่ยว -->
              <div v-if="row.value.length">
                <div class="bold">keywords</div>
                <span v-for="(keyword, k) in row.value" :key="k">
                  <b-badge pill variant="warning" class="py-1 my-1 mx-1 ">
                    <Highlighter
                      class="my-highlight md-font"
                      :style="{
                        textAlign: 'left',
                        fontSize: '15px',
                        padding: '10px',
                      }"
                      highlightClassName="highlight4"
                      :searchWords="[filter]"
                      :autoEscape="true"
                      :textToHighlight="keyword"
                    ></Highlighter>
                  </b-badge>
                </span>
              </div>

              <div v-if="row.item && row.item.and_keywords.length" class="mt-2">
                <div class="bold">include keywords</div>
                <span v-for="(keyword, k) in row.item.and_keywords" :key="k">
                  <b-badge pill variant="warning" class="py-1 my-1 mx-1 ">
                    <Highlighter
                      class="my-highlight md-font"
                      :style="{
                        textAlign: 'left',
                        fontSize: '15px',
                        padding: '10px',
                      }"
                      highlightClassName="highlight4"
                      :searchWords="[filter]"
                      :autoEscape="true"
                      :textToHighlight="keyword"
                    ></Highlighter
                  ></b-badge>
                </span>
              </div>
              <!-- <b-button size="sm" @click="row.toggleDetails" id="btn-show">
            {{ row.detailsShowing ? "Hide" : "Show" }} Keyword
          </b-button> -->
            </template>

            <template #row-details="row">
              <b-card>
                <div style="color: #4d422c;margin-bottom:10px">
                  <b> Keyword</b>
                </div>
                <div id="display-col">
                  <div v-for="(keyword, k) in row.item.keywords" :key="k">
                    {{ k + 1 }}. {{ keyword }}
                  </div>
                </div>

                <div
                  v-if="
                    row.item &&
                      row.item.and_keywords &&
                      row.item.and_keywords.length
                  "
                >
                  <hr />
                  <div style="color: #4d422c;margin-bottom:10px">
                    <b>Include Keyword</b>
                  </div>
                  <div id="display-col">
                    <div v-for="(andkey, k) in row.item.and_keywords" :key="k">
                      {{ k + 1 }}. {{ andkey }}
                    </div>
                  </div>
                </div>

                <div v-if="row.item.not_keywords.length">
                  <hr />
                  <div style="color: #4d422c;margin-bottom:10px">
                    <b>Exclude Keyword</b>
                  </div>
                  <div id="display-col">
                    <div v-for="(notkey, k) in row.item.not_keywords" :key="k">
                      {{ k + 1 }}. {{ notkey }}
                    </div>
                  </div>
                </div>
              </b-card>
            </template>
          </b-table>
        </div>
        <div v-if="items.data &&items.data.length== 0"  class="text-center my-5">ไม่พบข้อมูล</div>
        <!-- paginate -->
        <b-row class="text-center">
          <b-col sm="12" md="12" class="my-1" id="page" v-if="items.length">
            <b-pagination
              v-model="currentPage"
              :total-rows="rows"
              :per-page="perPage"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
          </b-col>
        </b-row>
      </div>
      <b-row class="my-1">
        <b-col sm="12" style="text-align:right;">
          <br />
          <!-- <b-button class="btn btn-close" size="sm" @click="backbtn()"
            >กลับ</b-button
          > -->
          <!-- <b-button class="btn btn-save" size="sm" @click="addRowSubDomain"
              >บันทึก</b-button
            > -->
        </b-col>
      </b-row>
    </b-container>
    <!-- </vue-modaltor> -->
  </div>
</template>

<script>
import Highlighter from "vue-highlight-words";
// import { API_URL } from '@/common/config';
import { API_V2_URL } from "@/common/config";
import { mapGetters } from "vuex";
export default {
  components: {
    Highlighter,
  },
  computed: {
    ...mapGetters([
      "getAddDomain",
      "getItemsSubDomain",
      "getDomainName",
      "getDomainId",
    ]),
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
    rows() {
      return this.items.length;
    },
  },
  data() {
    return {
      loadding: false,
      textTitle: "",
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      open: false,
      fields: [
        { key: "id", label: "#", sortable: true, class: "text-center" },
        { key: "domain", label: "Domain", sortable: true },
        { key: "subdomain", label: "SubDomain", sortable: true },
        { key: "name", label: "Object", sortable: true },
        { key: "keywords", label: "Keyword" },
        // { key: "actions", label: "Manage" },
      ],
      items: [],
    };
  },
  methods: {
    linkToWord(item) {
      let items = {
        domain: {
          name: item.domain,
        },
        name: item.subdomain,
      };
      console.log(item);
      this.$store.commit("setSubDomainName", items);
      this.$router.push({ name: "TemplateSettingWord" });
    },
    searchKeyword() {
      //"http://localhost:3000/api/v2/object/getSearchObject?keyword="
      this.loadding = true;
      this.axios
        .get(
          API_V2_URL+"/api/v2/object/getSearchObject?keyword=" +
            this.filter
        )
        .then((response) => {
          this.textTitle = this.filter;
          console.log(response.data);
          this.items = response.data;
          this.loadding = false;
        }).catch((error)=> {
          console.log(error);
          this.loadding = false;
        });
    },
    addRowSubDomain() {
      //  this.getItemsSubDomain.push({name:this.addSubDomain,domain:{name:this.getDomainName},id:this.getItemsSubDomain.length});
      this.$store.dispatch("updateAddSubDomain", {
        name: this.addSubDomain.replace("/", "-"),
        display: true,
        domain: this.getDomainId,
      });
      this.open = false;
      this.addSubDomain = "";
    },
    backbtn() {
    this.$router.push({name:'TemplateSetting'})
    },
  },

  mounted() {},
};
</script>
<style>
.full-modal .modal-vue--content.space-content {
  height: auto;
  align-items: unset !important;
  overflow: scroll;
}
</style>
<style scoped>
.badge-warning {
  color: #212529;
  background-color: #e0dfdeb3;
  font-size: 15px;
  padding: 10px;
  font-weight: 500;
}
.highlight4 {
  background-color: #f7dca2;
  padding: 0 2px;
}
.btn-close {
  color: #f8f9fa;
  background-color: #4c412b;
  border-color: #4c412b;
  box-shadow: 1px 1px 3px #666666;
}
.btn-save:hover {
  background: #fed16e;
  border-color: #fed16e;
}
.btn-save {
  background: #ede7dd;
  border-color: #ede7dd;
  color: #4c412b;
  box-shadow: 1px 1px 3px #666666;
}
td {
  vertical-align: middle;
}
.btn-add:hover {
  background-color: #504b3c;
  color: white;
}
.btn-add:hover .fa-plus {
  background-color: #504b3c;
}
.btn-add {
  background-color: #ede7dd;
  color: #504b3c;
  padding: 8px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 25px;
  box-shadow: 1px 1px 3px #666666;
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .btn-add {
    margin: auto;
    display: block;
    margin-top: 20px;
  }
}
</style>
