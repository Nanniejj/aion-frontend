<template>
  <b-container fluid id="tp-size">
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
        <AddHotIssue />
      </b-col>
    </b-row>
    <br />
    <div>
      <!-- {{getListWord}}{{currentPage}} -->
      <b-table
        :items="getDataIssue"
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
        <template #cell(id)="row">
          {{ row.index + 1 + (currentPage - 1) * 10 }}
        </template>

        <template #cell(domain)="row">
          <!-- <b-skeleton-wrapper :loading="false">
          <b-skeleton width="85%"></b-skeleton>
         </b-skeleton-wrapper> -->
          {{ row.value.name }}
        </template>
        <template #cell(subdomain)="row">
          {{ row.value.name }}
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
            v-on:click="removeRow(row.item)"
          ></span>
        </template>
        <template #cell(word)="row">
          <b> {{ row.value }}</b>
        </template>
        <!-- Show Keyword -->
        <template #cell(keywords)="row">
          <!-- {{row.value}} -->
          <!-- <span v-for="(keyword,k) in row.item" :key="k"  > {{keyword}}</span> -->
          <b-button size="sm" @click="row.toggleDetails" id="btn-show">
            {{ row.detailsShowing ? "Hide" : "Show" }} Keyword
          </b-button>
        </template>

        <template #row-details="row">
          <b-card>
            <div style="color: #4d422c; margin-bottom: 10px">
              <b> Keyword</b>
            </div>
            <div id="display-col">
              <div v-for="(keyword, k) in row.item.keywords" :key="k">
                {{ k + 1 }}. {{ keyword }}
              </div>
            </div>

            <div v-if="row.item.and_keywords.length">
              <hr />
              <div style="color: #4d422c; margin-bottom: 10px">
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
              <div style="color: #4d422c; margin-bottom: 10px">
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

    <!-- paginate -->
    <b-row>
      <b-col sm="7" md="6" class="my-1" id="page" v-if="!filter">
        <b-pagination
          @input="setPage"
          v-model="currentPage"
          :total-rows="this.getDataIssue.length"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
        ></b-pagination>
      </b-col>
      <b-col sm="7" md="6" class="my-1" id="page" v-else>
        <b-pagination
          @input="setPage"
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
    <vue-modaltor
      :visible="open"
      @hide="hideModal"
      :resize-width="{ 3500: '50%', 1500: '70%', 992: '70%', 768: '90%' }"
      :animation-panel="'modal-slide-top'"
    >
      <b-container fluid>
        <h5><b>แก้ไขข้อมูล</b></h5>
        <hr />
        <p>คำแนะนำ : กรุณาตรวจสอบข้อมูลทุกครั้งก่อนทำการบันทึก</p>
        <div>
          <b-col sm="12">
            <label for="textarea-default"><b>Issue </b></label>
          </b-col>
          <b-col sm="12">
            <b-form-input
              id="input-small3"
              placeholder=""
              v-model="textWord"
            ></b-form-input>
          </b-col>
          <b-col sm="12">
            <br />
            <!-- <label for="textarea-default"><b>Keyword </b></label> -->
          </b-col>
          <b-tabs
            content-class="mt-3"
            lazy
            active-nav-item-class="font-weight-bold "
            active-tab-class="font-weight-bold "
            v-model="tabIndex"
          >
            <b-tab>
              <template #title calss="title-tab">
                <span id="title-tab">Keyword</span></template
              >
              <b-form-tags
                v-model="textKeyword"
                tag-variant="light"
                tag-pills
                size="md"
                placeholder="Enter เพื่อพิมพ์คำใหม่"
                remove-on-delete
              ></b-form-tags>
            </b-tab>
            <b-tab>
              <template #title calss="title-tab">
                <span id="title-tab">Include Keyword</span>
              </template>
              <b-form-tags
                v-model="textInclude"
                tag-variant="light"
                :tag-validator="validator"
                @tag-state="onTagState"
                tag-pills
                size="md"
                placeholder="Enter เพื่อพิมพ์คำใหม่"
                remove-on-delete
              ></b-form-tags>

              <div class="small m-2">
                ใช้ <i class="fa fa-plus" aria-hidden="true"></i> ในการ AND เช่น
                <b
                  >การเมือง<i
                    class="fa fa-plus p-1"
                    style="font-size: 12px"
                  />การปกครอง</b
                >
              </div>
            </b-tab>
            <b-tab>
              <template #title calss="title-tab">
                <span id="title-tab">Exclude Keyword</span>
              </template>
              <b-form-tags
                v-model="textExclude"
                tag-variant="light"
                tag-pills
                size="md"
                placeholder="Enter เพื่อพิมพ์คำใหม่"
                remove-on-delete
              ></b-form-tags>
            </b-tab>
          </b-tabs>
          <br />
          <b-row class="my-1">
            <b-col sm="12" style="text-align: right">
              <b-button class="btn btn-close" size="sm" @click="hideModal()"
                >ปิดหน้าต่าง</b-button
              >
              <b-button class="btn btn-save" size="sm" @click="EditWord()"
                >บันทึก</b-button
              >
            </b-col>
          </b-row>
          <!-- <div class="mt-2">Value: {{ textDomain }}</div> -->
        </div>
      </b-container>
    </vue-modaltor>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import AddHotIssue from "@/components/hotissue/AddHotIssue.vue";
export default {
  components: { AddHotIssue },
  data() {
    return {
      dataIssue: [],
      empData: "ไม่พบข้อมูล",
      tabIndex: 0,
      textInclude: [],
      textExclude: [],
      offset: 0,
      IdWord: "",
      fields: [
        { key: "id", label: "#", sortable: true, class: "text-center" },
        { key: "name", label: "Issue", sortable: true },
        { key: "keywords", label: "Keyword" },
        { key: "actions", label: "Manage" },
      ],
      textWord: "",
      textKeyword: [],
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
    ...mapGetters(["getDataIssue"]),
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
    validator(tag) {
      return tag.includes("+") && tag.slice(-1) !== "+";
    },
    onTagState(valid, invalid, duplicate) {
      this.validTags = valid + " eg. การเมือง+การปกครอง";
      this.invalidTags = invalid + " eg. การเมือง+การปกครอง";
      this.duplicateTags = duplicate;
    },
    setPage() {
      if (this.currentPage > 1) {
        this.offset = 10 * (this.currentPage - 1);
        // console.log("offset : ", this.offset);
      } else {
        this.offset = 0;
      }
      //this.$store.dispatch("fetchListWord",{domain:this.getSubDomainName.domain.name,subdomain:this.getSubDomainName.name,offset:this.offset})
    },
    EditWord() {
      const axios = require("axios").default;
      var config = {
        method: "put",
        url:
          "https://api2.cognizata.com/api/v2/userposts/editHotissue?id=" +
          this.idWord,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        data: {
          name: this.textWord,
          keywords: this.textKeyword,
          and_keywords: this.textInclude,
          not_keywords: this.textExclude,
        },
      };
      axios(config)
        .then(() => {
          this.open = false;
          // console.log("Toppp response.data", response.data);
          var config = {
            method: "get",
            url: "https://api2.cognizata.com/api/v2/userposts/getHotissue",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          };
          axios(config)
            .then((response) => {
              this.$store.commit("setDataIssue", response.data);
              this.$fire({
                title: "บันทึกข้อมูลสำเร็จ",
                type: "success",
                showConfirmButton: false,
                timer: 1000,
              });
              this.hideModal();
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          console.log(error);
          this.$fire({
            title: "บันทึกข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง",
            type: "error",
            showConfirmButton: false,
            timer: 1000,
          });
        });
    },
    removeRow: function (item) {
      this.$confirm("คุณต้องการลบข้อมูล?").then(() => {
        const axios = require("axios").default;
        var config = {
          method: "delete",
          url:
            "https://api2.cognizata.com/api/v2/userposts/deleteHotissue?id=" +
            item._id,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        };
        axios(config)
          .then(() => {
            var config = {
              method: "get",
              url: "https://api2.cognizata.com/api/v2/userposts/getHotissue",
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
              },
            };
            axios(config)
              .then((response) => {
                this.$store.commit("setDataIssue", response.data);
                this.$fire({
                  title: "ลบข้อมูลสำเร็จ",
                  type: "success",
                  showConfirmButton: false,
                  timer: 1000,
                });
              })
              .catch(function (error) {
                console.log(error);
                this.$fire({
                  title: "ลบข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง",
                  type: "error",
                  showConfirmButton: false,
                  timer: 1000,
                });
              });
          })
          .catch(function (error) {
            console.log(error);
          });
      });
    },
    backDomain: function () {
      this.$store.commit("setListWord", false);
      this.$store.commit("setListSubDomain", false);
      //console.log('back');
    },
    backSubDomain: function () {
      this.$store.commit("setListWord", false);
      //console.log('back');
    },
    hideModal() {
      this.open = false;
      this.tabIndex = 0;
    },
    info(item, index, button) {
      console.log("item", item);
      this.infoModal.title = `Row index: ${index}`;
      this.idWord = item._id;
      this.textWord = item.name;
      this.textKeyword = item.keywords;
      this.textInclude = item.and_keywords;
      this.textExclude = item.not_keywords;
      this.selected = item.isActive;
      //console.log( this.IdDm,this.subDomainId, this.idWord);
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
    getDataTable() {
      const axios = require("axios").default;
      var config = {
        method: "get",
        url: "https://api2.cognizata.com/api/v2/userposts/getHotissue",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      axios(config)
        .then((response) => {
          this.$store.commit("setDataIssue", response.data);
        })
        .catch(function (error) {
          this.$fire({
            title: "กรุณาลองอีกครั้ง",
            type: "error",
            showConfirmButton: false,
            timer: 1000,
          });
          console.log(error);
        });
    },
  },
  created() {
    this.getDataTable();
  },
};
</script>

<style scoped>
#title-tab {
  color: #2c3e50 !important;
}
.nav-tabs .nav-link.active #title-tab {
  color: #2c3e50 !important;
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
.table-hover tbody tr:hover {
  cursor: pointer;
  color: #4c412b;
  background-color: #ede7dd57;
}
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #ffffff;
  background-clip: border-box;
  border: 1px solid #4c412b5e;
  border-radius: 0.5rem;
}
.card-body {
  margin: auto;
}
#display-col {
  text-align: left;
  column-count: 3 !important;
  -moz-column-count: 3 !important;
  column-gap: 40px;
}
.fa-pencil,
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
.fa-trash-alt:hover {
  background: #4c412b;
  color: white;
}
#page {
  margin: auto;
  margin-top: 40px !important;
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
#input-btn > div:nth-child(2) {
  text-align: end;
}
#btn-show {
  color: #504b3c;
  background-color: #ede7dd;
  border-color: #ede7dd;
  box-shadow: 1px 1px 4px #666666;
}

#tp-size {
  width: 85%;
}

@media only screen and (min-width: 0px) and (max-width: 1000px) {
  #display-col {
    text-align: left;
    column-count: 2 !important;
    -moz-column-count: 2 !important;
    column-gap: 40px;
  }
}

@media only screen and (min-width: 0px) and (max-width: 600px) {
  #display-col {
    text-align: left;
    column-count: 1 !important;
    -moz-column-count: 1 !important;
    column-gap: 40px;
  }
  #tp-size[data-v-7e70fc4e] {
    width: 100%;
  }
  #page {
    margin-bottom: 50px !important;
  }
  /* .tooltip-inner {
    display: none !important ;
} */
}
</style>