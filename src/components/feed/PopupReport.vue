<template>
  <span>
    <!-- {{getListMonitorProfile.targetlist.length}} -->
    <span @click="open = true" id="box-report"
      ><i class="fa fa-bell"></i> รายงาน</span
    >

    <vue-modaltor
      class="d-inline"
      :visible="open"
      @hide="hideModal"
      :animation-panel="'modal-slide-top'"
      :resize-width="{ 3000: '40%', 1350: '70%', 768: '90%' }"
    >
      <img src="@/assets/line.png" class="img-line" />
      <!-- <h5><b>Line Notify Report</b></h5> -->
      <hr class="mt-0" />
      <div></div>
      <div></div>
      <b-row class="my-1">
        <b-col sm="12">
          <span
            >คำแนะนำ : กรุณาเลือกประเภทข้อมูลที่ต้องการส่งไปยัง Line
            Notify</span
          >
        </b-col>
        <b-col sm="12" class="selectbox">
          <br />
          <v-select
            multiple
            v-model="selectType"
            :options="optionsType"
            id="search-input"
            placeholder="เลือกประเภท"
            label="text"
            class="my-0 select-type-report"
          >
          </v-select>
          <!-- <div class="d-fex">
            <i class="fa fa-laptop fa-3x"></i>
            <i class="fa fa-bell-circle fa-3x"></i>
            <img src="@/assets/line2.png" class="img-line2 d-inline" />
          </div> -->

          <!-- <b-form-select
            multiple
            v-model="selectType"
            :options="optionsType"
          ></b-form-select> -->
        </b-col>

        <b-col sm="12" style="text-align: right">
          <br />
          <b-button class="btn btn-save" size="sm" @click="sendReport()"
            >ส่งข้อมูล</b-button
          >
        </b-col>
      </b-row>
    </vue-modaltor>
  </span>
</template>

<script>
import { mapGetters } from "vuex";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
export default {
  props: {
    datareport: {
      type: Array,
    },
    uidpost: {
      type: String,
    },
  },
  components: {
    vSelect,
  },
  computed: {
    ...mapGetters(["getAddDomain", "getListMonitorProfile", "getUpdateTable"]),
  },
  data() {
    return {
      selectType: [],
      open: false,
      optionsType: [
        { value: "ไม่ระบุ", text: "ไม่ระบุ" },
        { value: "หมิ่นสถาบันฯ", text: "หมิ่นสถาบันฯ" },
        { value: "พาดพิงสถาบันฯ", text: "พาดพิงสถาบันฯ" },
        {
          value: "โจมตีการทำงานเจ้าหน้าที่รัฐ",
          text: "โจมตีการทำงานเจ้าหน้าที่รัฐ",
        },
        {
          value: "กระทบผู้บังคับบัญชา/หน่วยงาน",
          text: "กระทบผู้บังคับบัญชา/หน่วยงาน",
        },
        { value: "นำเสนอข่าวการเมือง", text: "นำเสนอข่าวการเมือง" },
        { value: "สนับสนุนสถาบันฯ", text: "สนับสนุนสถาบันฯ" },
        { value: "สนับสนุนรัฐบาล", text: "สนับสนุนรัฐบาล" },
        { value: "สนับสนุนเจ้าหน้าที่รัฐ", text: "สนับสนุนเจ้าหน้าที่รัฐ" },
        { value: "ยุยงปลุกปั่น", text: "ยุยงปลุกปั่น" },
        { value: "ชักชวน/นัดหมาย การชุมนุม", text: "ชักชวน/นัดหมาย การชุมนุม" },
        {
          value: "ชักชวน/นัดหมาย กิจกรรมอื่นๆ",
          text: "ชักชวน/นัดหมาย กิจกรรมอื่นๆ",
        },
        { value: "บัญชีรับเงินบริจาค", text: "บัญชีรับเงินบริจาค" },
        { value: "สนับสนุนปัจจัยการชุมนุม", text: "สนับสนุนปัจจัยการชุมนุม" },
        { value: "เผยแพร่ภาพสดการชุมนุม", text: "เผยแพร่ภาพสดการชุมนุม" },
        { value: "เผยแพร่ภาพสดอื่นๆ", text: "เผยแพร่ภาพสดอื่นๆ" },
        { value: "ภาพนิ่งบรรยากาศการชุมนุม", text: "ภาพนิ่งบรรยากาศการชุมนุม" },
        { value: "โจมตีการทำงานรัฐบาล", text: "โจมตีการทำงานรัฐบาล" },
        { value: "ชักชวน/นัดหมาย Clubhouse", text: "ชักชวน/นัดหมาย Clubhouse" },
        {
          value: "ประเด็น/ข้อเรียกร้องทางการเมือง",
          text: "ประเด็น/ข้อเรียกร้องทางการเมือง",
        },
        {
          value: "สถานการณ์/ประกาศในที่ชุมนุม",
          text: "สถานการณ์/ประกาศในที่ชุมนุม",
        },
        { value: "อื่นๆ", text: "อื่นๆ" },
      ],
    };
  },
  methods: {
    async sendReport() {
      // console.log("this.selectType ", this.selectType);
      let type = this.selectType.map((key) => {
        return key.text;
      });
      let stype = type.toString();
      // console.log("this.selectType2 ", type);
      const axios = require("axios").default;
      //https://api2.cognizata.com
      //http://139.59.103.67:3000
      var config = {
        method: "post",
        url: "https://api2.cognizata.com/api/v2/userposts/ReportLine",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        params: { uid: this.uidpost },
        data: { type: stype },
      };
      axios(config)
        .then(() => {
          //   console.log(response.data);
          this.$fire({
            title: "Success",
            text: "ส่งข้อมูลแล้ว",
            type: "success",
            showConfirmButton: false,
            timer: 1000,
          }).then(() => {
            this.$store.commit("setDataReportLine", this.datareport);
            this.open = false;
          });
        })
        .catch((error) => {
          console.log("error", error);
          this.open = false;
          this.$fire({
            title: "Error",
            text: "ส่งข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง",
            type: "error",
            showConfirmButton: false,
            timer: 2000,
          });
          console.log(error);
        });
      //   this.open = false;
    },
    hideModal() {
      this.open = false;
    },
  },
};
</script>

<style scoped>

.fa-laptop{
  color: #878987;
  padding: 5px 8px;
}
.selectbox {
  height: 160px;
}
.img-mion {
  height: 40px;
}
.img-line2 {
  height: 60px;
  text-align: end;
}
.img-line {
  height: 65px;
  text-align: end;
}
.btn-close {
  color: #f8f9fa;
  background-color: #4c412b;
  border-color: #4c412b;
  box-shadow: 1px 1px 3px #666666;
}
.btn-save:hover {
  background: #00b900;
  border-color: #00b900;
  color: #ffffff;
}
.btn-save {
  background: #68b5685c;
  border-color: #68b5685c;
  color: #00b900;
  box-shadow: 1px 1px 3px #666666;
}
td {
  vertical-align: middle;
}
#box-report {
  background: #68b5685c;
  color: #00b900;
  border-radius: 7px;
  padding-right: 5px;
  padding-left: 5px;
  padding-top: 3px;
  padding-bottom: 3px;
  margin-left: 4px;
  cursor: pointer;
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .btn-add {
    margin: auto;
    display: block;
    margin-top: 20px;
  }
  #box-report {
  font-size: small;
}
}
</style>
