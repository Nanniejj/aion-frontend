<template>
  <div>
    <b-row align-h="center">
      <b-col sm="10" md="10" lg="10">
        <div class="text-lg-right text-md-right">
          <b-button
            variant="warning"
            id="btn-addH"
            class="ml-3"
            @click="open = true"
          >
            <i class="fas fa-plus"></i> เพิ่มประเด็น Issue
          </b-button>
          <b-button
            variant="warning"
            id="btn-addH"
            class="ml-3"
            @click="toSetting"
            v-if="this.$route.name == 'HotIssue'"
          >
            <i class="fas fa-gear"></i> การจัดการ
          </b-button>
        </div>
      </b-col>
    </b-row>
    <vue-modaltor
      :visible="open"
      @hide="hideModal"
      :animation-panel="'modal-slide-top'"
      :resize-width="{ 3000: '50%', 1350: '70%', 768: '90%' }"
    >
      <h5><b>เพิ่มประเด็น Issue</b></h5>
      <hr />
      <div class="text-left">
        คำแนะนำ : กรุณาใส่ชื่อถุงคำที่ต้องการ Keyword ให้ enter หากมีมากกว่า 1
        คำ
      </div>
      <label class="mt-4" for="textarea-default"
        ><b>ชื่อหัวเรื่อง (Object)</b></label
      ><b-form-input
        id="input-small1"
        placeholder="เพิ่มหัวเรื่อง"
        v-model="addTitle"
      ></b-form-input>

      <!-- Keywords -->
      <label class="mt-4" for="textarea-default"><b>Keywords</b></label>
      <b-form-tags
        input-id="tags-pills"
        v-model="addKeyword"
        tag-variant="light"
        tag-pills
        size="md"
        placeholder="Enter เพื่อพิมพ์คำใหม่"
        remove-on-delete
        :disabled="!addTitle"
      ></b-form-tags>

      <!-- Include Keyword  -->
      <br />
      <label for="textarea-default"><b>Include Keyword </b></label>
      <b-badge variant="warning" class="ml-2">AND</b-badge>
      <b-alert show class="small"
        >ใช้ <i class="fa fa-plus" aria-hidden="true"></i> ในการ AND เช่น
        <b
          >การเมือง<i
            class="fa fa-plus p-1"
            style="font-size: 12px"
          />การปกครอง</b
        ></b-alert
      >
      <b-form-tags
        :disabled="!addTitle"
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

      <!-- Exclude Keyword  -->
      <br />
      <label for="textarea-default"><b>Exclude Keyword </b></label>
      <b-badge variant="warning" class="ml-2">NOT</b-badge>
      <b-form-tags
        input-id="tags-pills2"
        v-model="addExclude"
        tag-variant="light"
        tag-pills
        size="md"
        placeholder="Enter เพื่อพิมพ์คำใหม่"
        remove-on-delete
        :disabled="!addTitle"
      ></b-form-tags>
      <b-row class="my-1">
        <b-col sm="12" style="text-align: right">
          <br />
          <b-button class="btn btn-close mr-2" size="sm" @click="hideModal"
            >ปิดหน้าต่าง</b-button
          >
          <b-button
            class="btn btn-save"
            size="sm"
            @click="addRowWord"
            :disabled="!addKeyword.length"
            >บันทึก</b-button
          >
        </b-col>
      </b-row>
    </vue-modaltor>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: false,
      addTitle: "",
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
    toSetting() {
      this.$router.push({ name: "HotIssueSetting" });
    },
    hideModal() {
      this.open = false;
    },
    addRowWord() {
      const axios = require("axios").default;
      var config = {
        method: "post",
        url: "https://api2.cognizata.com/api/v2/userposts/createHotissue",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        data: {
          name: this.addTitle,
          keywords: this.addKeyword,
          and_keywords: this.addInclude,
          not_keywords: this.addExclude,
        },
      };
      axios(config)
        .then((response) => {
          console.log("Toppp response.data", response.data);

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
              this.addTitle = "";
              this.addKeyword = "";
              this.addInclude = "";
              this.addExclude = "";
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
    validator(tag) {
      return tag.includes("+") && tag.slice(-1) !== "+";
    },
    onTagState(valid, invalid, duplicate) {
      this.validTags = valid;
      this.invalidTags = invalid;
      this.duplicateTags = duplicate;
    },
  },
};
</script>

<style scoped>
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
/* .h-auto {
  height: 250px !important;
} */
#btn-addH {
  border-radius: 10px;
  background-color: #fed16ebf;
}
#btn-addH:hover {
  background: rgb(243, 190, 76);
}
</style>