<template>
  <div>
    <div class="text-right ">
      <b-dropdown class="m-2 btn-report" :disabled="modalShow2">
        <template #button-content>
          <vue-element-loading
            :active="modalShow2"
            size="40"
            background-color="rgba(255, 255, 255, 0)"
            color="#b6ac9a"
          />
          <i class="fa fa-download"></i><span> Download</span>
        </template>
        <b-dropdown-item-button @click="createReport"
          >All Target Tracking</b-dropdown-item-button
        >
        <b-dropdown-item-button
          v-if="
            objId == '62a6f013526cf841a30e3078' ||
              objId == '60a4a73eca07b83ecad0e71c' ||
              objId == '60a4a746ca07b83ecad0e71d' ||
              objId == '60a4a74cca07b83ecad0e71e' ||
              objId == '60a4a752ca07b83ecad0e71f' ||
              objId == '60a4a758ca07b83ecad0e720'
          "
          @click="createReportLine"
          >Line Notify Target Tracking</b-dropdown-item-button
        >
      </b-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["getDateReport"]),
  },
  data() {
    return {
      modalShow2: false,
      objId: "",
    };
  },
  methods: {
    createReport() {
      this.modalShow2 = true;
      const axios = require("axios").default;
      //https://api2.cognizata.com
      //http://139.59.103.67:3000
      var config = {
        method: "get",
        url: "https://api2.cognizata.com/api/v2/userposts/downloadReport",
        responseType: "blob",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        params: { start: this.getDateReport[0], end: this.getDateReport[1] },
      };
      axios(config)
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "TargetTracking_Report.xlsx");
          document.body.appendChild(link);
          link.click();
          this.modalShow2 = false;
        })
        .catch((error) => {
          console.log("error", error);
          this.modalShow2 = false;
          this.$fire({
            title: "Error",
            text: "ไม่สามารถโหลดข้อมูลได้ข้อมูลมีขนาดใหญ่เกิน กรุณาลองอีกครั้ง",
            type: "error",
            showConfirmButton: false,
            timer: 2000,
          });
          console.log(error);
        });
    },

    createReportLine() {
      //https://api2.cognizata.com
      //http://139.59.103.67:3000
      this.modalShow2 = true;
      const axios = require("axios").default;
      var config = {
        method: "get",
        url: "https://api2.cognizata.com/api/v2/userposts/downloadReportLine",
        responseType: "blob",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        params: { start: this.getDateReport[0], end: this.getDateReport[1] },
      };
      axios(config)
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "LineNotify_TargetTracking.xlsx");
          document.body.appendChild(link);
          link.click();
          this.modalShow2 = false;
        })
        .catch((error) => {
          console.log("error", error);
          this.modalShow2 = false;
          this.$fire({
            title: "Error",
            text: "ไม่สามารถโหลดข้อมูลได้ข้อมูลมีขนาดใหญ่เกิน กรุณาลองอีกครั้ง",
            type: "error",
            showConfirmButton: false,
            timer: 2000,
          });
          console.log(error);
        });
    },
  },
  created() {
    this.objId = localStorage.getItem("objId");
  },
};
</script>

<style scoped>
.btn-primary {
  color: #ffffff;
  border-color: #5679a5;
  background-color: #5679a5;
}
.btn-primary:hover {
  color: #ffffff;
  background-color: #3f5e85;
  background-color: #3f5e85;
}
.btn-secondary {
  color: #fff;
  background-color: #7e8c99;
  border-color: #7e8c99;
}
.btn-secondary:hover {
  background-color: #66727e;
  border-color: #66727e;
}
</style>
