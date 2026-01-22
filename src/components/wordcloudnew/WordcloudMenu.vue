<template>
  <div>
    

    <div class="footer_magin pr-lg-5 pl-lg-5">
      <b-row align-h="center">
      <b-col class="d-contents">
        <h1 class="title">Wordcloud</h1>
      </b-col>
      <b-col>
        <div style="text-align: end" class="p-3 my-0">
          <!-- <span class="shadow-sm p-2 mb-3 bg-white rounded bold mr-2">
            <span>Today</span>
            {{ new Intl.DateTimeFormat("en-AU").format() }}
          </span> -->
          <span class="pt-3">
            <i class="fa fa-print align-middle" @click="printWindow()"></i>
          </span>
        </div>
      </b-col>
    </b-row>
      <b-row>
        <b-col cols="12" md="">
          <v-select
            class="mb-3"
            :options="formattedDomainOptions"
            v-model="domain_name"
            label="name"
            return-object
            placeholder="เลือกหัวเรื่อง (Domain) "
            multiple
            style="width: 100%"
            @input="onDomainChange"
          />
        </b-col>

        <b-col cols="12" md="3">
          <div class="mb-2 text-lg-right text-sm-center w-100">
            <section id="date-picker">
              <date-picker
                v-model="valueDate"
                type="date"
                range
                placeholder="เลือกช่วงเวลา"
                size="md"
                :disabled-date="(date) => date >= new Date()"
                value-type="format"
                format="YYYY-MM-DD"
                @change="checkDateRange()"
                class="w-100"
              >
                {{ valueDate }}
              </date-picker>
            </section>
          </div>
        </b-col>

        <b-col class="text-right" cols="auto" md="auto">
          <b-form-group label="" v-slot="{ ariaDescribedby }">
            <!-- ✅ radio เปลี่ยนได้ แต่ยังไม่ apply -->
            <b-form-radio-group
            class="sel-box"
              v-model="selectedMonitorDraft"
              :options="monitorOptions"
              :aria-describedby="ariaDescribedby"
              :name="radioName"
              size="sm"
              buttons
              pill
              button-variant="outline-dark"
            />
          </b-form-group>
        </b-col>

        <b-col cols="auto" md="auto" class="text-md-center text-sm-left">
          <b-button
            variant="info"
            @click="summitform()"
            pill
            class="w-80 px-4"
            :disabled="getLoadStatus"
            size="sm"
            style="box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;"
          >
            ค้นหา
          </b-button>
        </b-col>
      </b-row>
    </div>

    <div class="text-left mx-lg-5">
      <span class="text-left h6 mb-1" v-if="domain_title">
        <span class="bg-tags domain-ellipsis">{{ domain_title }}</span>
      </span>
      <span v-else class="text-left h6 mb-1">
        <span class="bg-tags"> ทั้งระบบ </span>
      </span>

      <!-- ✅ ป้ายเปลี่ยนเฉพาะตอนกดค้นหา -->
      <span class="bg-tags-m mx-1 mt-1">
        <span v-if="appliedMonitor === true">
          <i class="fas fa-id-card-alt"></i> บัญชี monitor
        </span>
        <span v-else>
          <i class="fas fa-id-card-alt"></i> บัญชีทั้งหมด
        </span>
      </span>
    </div>

    <hr class="mt-2 mb-3 mx-lg-5" />
  </div>
</template>

<script>
import DefaultCloud from "@/components/wordcloud/DefaultCloud.vue";
import { mapGetters } from "vuex";
import "vue-select/dist/vue-select.css";
import moment from "moment";

export default {
  components: { DefaultCloud },
  data() {
    return {
      // ✅ ใช้ boolean ชัดเจน
      monitorOptions: [
        { text: "ทั้งหมด", value: false },
        { text: "Monitor", value: true },
      ],

      date: "",
      domain: "",
      today: "",
      word: "",
      type_selected: "daily",

      domain_name: [],
      domain_title: "",
      start_date: "",
      end_date: "",
      valueDate: "",

      // ✅ draft vs applied
      selectedMonitorDraft: false, // radio เปลี่ยนได้
      appliedMonitor: false,       // ป้าย/ผลลัพธ์ใช้จริง (เปลี่ยนตอนกดค้นหา)
    };
  },
  computed: {
    ...mapGetters(["getShowDomain", "getLoadStatus", "getSelectedMonitor"]),

    // ✅ กัน radio หลุดจาก name ซ้ำ
    radioName() {
      return `wc-monitor-${this._uid}`;
    },

    formattedDomainOptions() {
      return [
        { id: "Alls", name: "เลือกทั้งระบบ" },
        { id: "All", name: "เลือกทุก Domain" },
        ...this.getShowDomain,
      ];
    },
  },
  methods: {
    onDomainChange(val) {
      const arr = Array.isArray(val) ? val : val ? [val] : [];

      const hasAlls = arr.some((x) => x && x.id === "Alls");
      const hasAll = arr.some((x) => x && x.id === "All");

      if (hasAlls) {
        this.domain_name = [{ id: "Alls", name: "เลือกทั้งระบบ" }];
        return;
      }

      if (hasAll) {
        this.domain_name = [{ id: "All", name: "เลือกทุก Domain" }];
        return;
      }

      this.domain_name = arr.filter((x) => x && x.id !== "All" && x.id !== "Alls");
    },

    checkDateRange() {
      const startDate = moment(this.valueDate[0]);
      const endDate = moment(this.valueDate[1]);

      const diffDays = endDate.diff(startDate, "days");

      if (diffDays > 31) {
        alert("กรุณาเลือกช่วงเวลาที่ไม่เกิน 1 เดือน หรือ 31 วัน");
        this.valueDate[1] = startDate.add(31, "days").format("YYYY-MM-DD");
      } else {
        this.selectData();
      }
    },

    selectData() {
      this.start_date = this.valueDate[0] + "T00:00:00";
      this.end_date = this.valueDate[1] + "T23:59:59";
      this.$store.commit("setWordCloudStartDate", this.start_date);
      this.$store.commit("setWordCloudEndDate", this.end_date);
    },

    printWindow() {
      try {
        window.print();
      } catch (err) {
        console.log(err);
      }
    },

    summitform() {
      const todays = moment(new Date()).format().slice(0, 10) + "T00:00:00";
      const todaye = moment(new Date()).format().slice(0, 10) + "T23:59:59";

      // ✅ apply monitor เฉพาะตอนกดค้นหา
      this.appliedMonitor = this.selectedMonitorDraft === true;

      // ✅ sync ลง store เฉพาะตอนกดค้นหา (ถ้าคุณยังใช้ store ต่อ)
      this.$store.commit("setSelectedMonitor", this.appliedMonitor);

      // ✅ domain payload (string)
      let domainPayload = this.domain_name.map((n) => n.id).toLocaleString();
      this.domain_title = this.domain_name.map((n) => n.name).toLocaleString();

      if (!domainPayload) {
        domainPayload = "";
      } else if (this.domain_name.some((x) => x.id === "Alls")) {
        domainPayload = "";
      } else if (this.domain_name.some((x) => x.id === "All")) {
        domainPayload = "All";
      }

      this.$store.commit("setSelected", true);
      this.$store.commit("setWordCloudDomain", domainPayload);
      this.$store.commit("setKeywords", this.word);

      // ✅ เลือกช่วงเวลา
      const start_date = this.valueDate ? this.start_date : todays;
      const end_date = this.valueDate ? this.end_date : todaye;

      // ✅ monitor: false => ไม่ส่ง / true => ส่ง "true"
      const monitorParam = this.appliedMonitor ? "true" : undefined;

      this.$store.commit("setWordCloud", "");
      const payload = {
        start_date,
        end_date,
        keywords: this.word,
        domain_id: domainPayload,
        ...(monitorParam ? { monitor: monitorParam } : {}),
      };

      this.$store.dispatch("fetchWordCloud", payload);

      this.$store.commit("setWordCloudStartDate", start_date);
      this.$store.commit("setWordCloudEndDate", end_date);
      this.$store.commit("setArrDate", this.valueDate);

      // ✅ emit ให้ parent (ไม่ส่ง monitor ถ้า false)
      this.$emit("filters-changed", {
        start: start_date,
        end: end_date,
        domain_id: domainPayload || "",
        ...(monitorParam ? { monitor: monitorParam } : {}),
      });
    },
  },
  mounted() {
    // ✅ init state จาก store (ถ้า store เป็น boolean)
    const init = this.getSelectedMonitor === true;
    this.selectedMonitorDraft = init;
    this.appliedMonitor = init;

    const todays = moment(new Date()).format().slice(0, 10) + "T00:00:00";
    const todaye = moment(new Date()).format().slice(0, 10) + "T23:59:59";
    this.$store.commit("setWordCloudStartDate", todays);
    this.$store.commit("setWordCloudEndDate", todaye);
    this.$store.dispatch("fetchDomain");
  },
};
</script>
<style>
  .sel-box .btn-outline-dark:not(:disabled):not(.disabled).active{
    color: #2c3e52 !important;
    border-color: #f8d666!important;
  background: linear-gradient(to left, #f8d88e, #f8cc3c);
}
.btn-outline-dark{
   border-color: #ffc107!important;
}
</style>
<style scoped>
  .title {
    text-align: start;
    margin-left: 3px !important;
    padding-top: 20px;
    padding-bottom:10px;
    margin-bottom: 10px;
    font-weight: bolder;
}

.bg-tags {
  background: linear-gradient(to right, #d2e2e3, #e8dff6);
  width: 100% !important;
  padding: 2px 12px;
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  font-size: 16px;
  font-weight: 600;
}
.bg-tags-m {
  background: linear-gradient(to right, #ecdebd, #f8dc7e);
  width: 100% !important;
  padding: 2px 12px;
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  font-size: 16px;
  font-weight: 600;
}
.rounded {
  border-radius: 6px !important;
}
.fa-print {
  font-size: 25px;
  cursor: pointer;
}
@media only screen and (max-width: 800px) {
    .title {
    text-align: start;
    margin-left: 3px !important;
    padding-top: 20px;
    padding-bottom:0px;
    margin-bottom: 10px;
    font-weight: bolder;
}
  .bg-tags{
 padding: 3px 15px;
  }
  .bg-tags-m{
    font-size: 16px;
  }
   .domain-ellipsis {
    max-width: 350px; /* ปรับ 170px ตามพื้นที่ของ badge ขวา */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    margin-bottom: 12px;
  }
      .mx-datepicker-range {
        width: 100% !important;
      }
}
</style>
