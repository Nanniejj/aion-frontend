<template>
  <div>
    <button class="btn btn-add" @click="open = true">
      <i class="fa fa-plus" />
      <span style="font-size:16px;"> เพิ่ม Object </span>
    </button>

    <vue-modaltor
      :visible="open"
      @hide="hideModal"
      :resize-width="{ 3000: '50%', 1500: '70%', 992: '80%', 768: '90%' }"
      :animation-panel="'modal-slide-top'"
    >
      <b-container fluid>
        <h5><b>เพิ่ม Object</b></h5>
        <hr />
        <b-row class="my-1">
          <b-col sm="12"
            >คำแนะนำ : กรุณาใส่ชื่อถุงคำที่ต้องการ Keyword ให้ enter
            หากมีมากกว่า 1 คำ
            <div class="text-right mt-2">
              <b-button @click="clear" variant="outline-danger" class="mr-3"
                >
               <i class="fa fa-eraser" aria-hidden="true"></i>
                clear</b-button
              >
              <input
                id="fileInput"
                type="file"
                class="d-none"
                @input="handleFileUpload"
                accept=".csv" 
              />
              <label for="fileInput" class="btn-import">
                <i class="fas fa-file-import"></i> import CSV
              </label>
              
            </div>
          </b-col>

          <b-col sm="12">
            <br />
            <label for="textarea-default"><b>Object </b></label>
          </b-col>
          <b-col sm="12">
            <b-form-input
              id="input-small"
              placeholder=""
              v-model="addWord"
            ></b-form-input>
          </b-col>
          <b-col sm="12">
            <br />
            <label for="textarea-default"><b>Keyword </b></label>
          </b-col>
          <b-col sm="12">
            <b-form-tags
              input-id="tags-pills"
              v-model="addKeyword"
              tag-variant="light"
              tag-pills
              size="md"
              placeholder="Enter เพื่อพิมพ์คำใหม่"
              remove-on-delete
              :disabled="!addWord"
            ></b-form-tags>
            <!-- <p class="mt-2">Value: {{ addKeyword }}</p> -->
          </b-col>
          <b-col sm="12">
            <br />
            <label for="textarea-default"><b>Include Keyword </b></label>
            <b-badge variant="warning">AND</b-badge>
          </b-col>

          <b-col sm="12">
            <b-alert show
              >ใช้ <i class="fa fa-plus" aria-hidden="true"></i> ในการ AND เช่น
              <b
                >การเมือง<i
                  class="fa fa-plus p-1"
                  style="font-size:12px"
                />การปกครอง</b
              ></b-alert
            >
            <b-form-tags
              :disabled="!addWord"
              input-id="tags-pills1"
              v-model="addInclude"
              tag-variant="light"
              :tag-validator="validator"
              @tag-state="onTagState"
              tag-pills
              size="md"
              placeholder="Enter เพื่อพิมพ์คำใหม่"
              remove-on-delete
            ></b-form-tags>
            <!-- <p class="mt-2">Value: {{ addKeyword }}</p> -->
          </b-col>
          <b-col sm="12">
            <br />
            <label for="textarea-default"><b>Exclude Keyword </b></label>
            <b-badge variant="warning">NOT</b-badge>
          </b-col>
          <b-col sm="12">
            <b-form-tags
              input-id="tags-pills2"
              v-model="addExclude"
              tag-variant="light"
              tag-pills
              size="md"
              placeholder="Enter เพื่อพิมพ์คำใหม่"
              remove-on-delete
              :disabled="!addWord"
            ></b-form-tags>
            <!-- <p class="mt-2">Value: {{ addKeyword }}</p> -->
          </b-col>
        </b-row>
        <b-row class="my-1">
          <b-col sm="12" style="text-align:right;">
            <br />
            <b-button class="btn btn-close" size="sm" @click="hideModal()"
              >ปิดหน้าต่าง</b-button
            >
            <b-button
              class="btn btn-save"
              size="sm"
              @click="addRowWord"
              :disabled="!addWord && !addWord"
              >บันทึก</b-button
            >
          </b-col>
        </b-row>
      </b-container>
    </vue-modaltor>
  </div>
</template>

<script>
import Papa from "papaparse";
import { VueCsvImport } from "vue-csv-import";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      parseCsv: null,
      csv: null,
      open: false,
      addWord: null,
      addKeyword: [],
      addInclude: [],
      addExclude: [],
      tags: [],
      validTags: [],
      invalidTags: [],
      duplicateTags: [],
    };
  },
  methods: {
    clear() {
      this.addWord = null;
      this.addKeyword = [];
      this.addInclude = [];
      this.addExclude = [];
      const inputElement = document.getElementById("fileInput");
      if (inputElement) {
        inputElement.value = null;
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];

      if (file) {
        Papa.parse(file, {
          complete: (result) => {
            const headers = result.meta.fields;

            // ตรวจสอบว่ามีค่า 'keyword', 'include', หรือ 'exclude' อย่างน้อยหนึ่งค่า
            const hasRequiredValues = headers.some(
              (value) =>
                value === "keyword" ||
                value === "include" ||
                value === "exclude"
            );

            // ตรวจสอบผลลัพธ์
            if (!hasRequiredValues) {
              alert(
                "กรุณาเช็ครูปแบบใน CSV ให้ถูกต้อง!  header ต้องมีฟิลด์  keyword,include,หรือ exclude "
              );
            }

            console.log(headers);
            let keyword = [...result.data.map((x) => x.keyword)]
              .filter((x) => x)
              .map((x) => x.trim());
            let include = [...result.data.map((x) => x.include)]
              .filter((x) => x)
              .map((str) =>
                str
                  .split("+")
                  .map((s) => s.trim())
                  .filter((x) => x)
                  .join("+")
              );
            let exclude = [...result.data.map((x) => x.exclude)]
              .filter((x) => x)
              .map((x) => x.trim());
            this.addKeyword = keyword;
            this.addInclude = include;
            this.addExclude = exclude;
            console.log(keyword, include, exclude);
            // ทำต่อไปตามความต้องการ
          },
          header: true, // ถ้า CSV มี header
          dynamicTyping: true, // ทำให้ปรับปรุงประเภทของข้อมูลโดยอัตโนมัติ
        });
      }
    },
    hideModal() {
      this.open = false;
    },
    addRowWord() {
      //console.log(...this.addInclude);
      let include = this.addInclude.map((word) =>
        word
          .split("+")
          .map((s) => s.trim())
          .filter((x) => x)
          .join("+")
      );
      let includes = include.map((word) =>
        word.replace("+ ", "+").replace(" +", "+")
      );
      //console.log('include',include,includes);
      this.$store.dispatch("updateAddWord", {
        name: this.addWord,
        domain: Number(this.getDomainId),
        subdomain: Number(this.getSubDomainName.id),
        keywords: this.addKeyword,
        and_keywords: includes,
        not_keywords: this.addExclude,
        display: true,
      });
      this.open = false;
      this.addWord = "";
      this.addKeyword = [];
      this.addInclude = [];
      this.addExclude = [];
    },
    validator(tag) {
      return tag.includes("+") && tag.slice(-1) !== "+";
    },
    onTagState(valid, invalid, duplicate) {
      this.validTags = valid;
      this.invalidTags = invalid;
      this.duplicateTags = duplicate;
    },
  },
  computed: {
    ...mapGetters(["getAddWord", "getSubDomainName", "getDomainId"]),
  },
};
</script>

<style scoped>
.btn-outline-danger {
  color: #504b3c;
    border-color:#504b3c;
}
.btn-outline-danger:hover {
  color: #ffffff;
  background-color: #4c412b;
}
.btn-import {
  background-color: #ede7dd;
  color: #504b3c;
  border-radius: 5px;
  padding: 7px 5px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  cursor: pointer;
}
.btn-import:hover {
  color: #ffffff;
  background-color: #4c412b;
}
.dragndrop {
  background-color: #f5f5f5;
  height: 50vh;
  width: 80%;
  margin: 2.5em auto;
}
.b-form-tags.disabled {
  background-color: #ececec3b !important;
}
.badge-warning {
  color: #212529;
  background-color: #fed16e !important;
}
.b-form-tags .b-form-tags-list .b-form-tag {
  border: 1px solid #ccc !important;
}
.b-form-tag {
  border: 1px solid #ccc !important;
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
  #input-btn > div:nth-child(2) {
    text-align: center;
  }
}
</style>
