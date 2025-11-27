<template>
  <b-container fluid class="bot-active-status py-1">
    <!-- Header + Filters -->
    <b-row class="my-3 align-items-end">
      <b-col cols="12" md="12" class="mb-2">
        <h3 class="mb-0">Bot Active Status</h3>
        <small class="text-muted">
          รายชื่อบัญชีที่ active / inactive ตามวันที่และ bot level
        </small>
      </b-col>

      <b-col cols="12" md="3">
        <b-form-group label-for="source-select">
          <b-form-select id="source-select" size="sm" :options="sourceOptions" v-model="selectedSource"></b-form-select>
        </b-form-group>
      </b-col>

      <b-col cols="12" md="3">
        <b-form-group label-for="botlevel-select">
          <b-form-select id="botlevel-select" size="sm" :options="botLevelOptions"
            v-model="selectedBotLevel"></b-form-select>
        </b-form-group>
      </b-col>

      <!-- Date range picker -->
      <b-col cols="12" md="3">
        <b-form-group label-for="date-domain">
          <section id="date-picker" class="d-inline position-relative align-bottom w-100">
            <date-picker v-model="valueDate" type="date" range placeholder="เลือกช่วงเวลา" size="sm" class="w-100"
              :disabled-date="(date) => date >= new Date()" value-type="format" format="YYYY-MM-DD"
              @change="checkDateRange" id="date-domain">
              {{ valueDate }}
            </date-picker>
          </section>
        </b-form-group>
      </b-col>

      <b-col cols="12" md="auto" class="text-left pb-3">
        <b-button size="sm" variant="info" @click="fetchActiveStatus()" :disabled="loading">
          <span v-if="loading">Loading...</span>
          <span v-else>submit</span>
        </b-button>
        <small v-if="usedCache" class="text-muted ml-2">
          ข้อมูลมาจาก cache (ไม่เกิน 10 นาที)
        </small>
      </b-col>
    </b-row>

    <!-- Summary -->
    <b-row v-if="summary" class="mb-3">
      <b-col cols="12">
        <b-card body-class="py-2">
          <div class="d-flex flex-wrap justify-content-between align-items-center">
            <!-- ข้อความสรุป -->
            <div class="mb-2 mb-md-0">
              <h5 class="mb-1">
                ภาพรวมวันที่ {{ formattedDateLabel }}
              </h5>
              <small class="text-muted">
                Source:
                <strong>{{ selectedSource }}</strong> ·
                Bot level:
                <strong>{{ selectedBotLevel }}</strong>
              </small>
            </div>

            <!-- ตัวเลขรวม -->
            <div class="d-flex flex-wrap summary-items">
              <div class="summary-item">
                <span class="label">รวม Target</span>
                <span class="value">{{ summary.totalTargets }}</span>
              </div>
              <div class="summary-item text-success">
                <span class="label">Active</span>
                <span class="value">{{ summary.activeCount }}</span>
              </div>
              <div class="summary-item text-danger">
                <span class="label">Inactive</span>
                <span class="value">{{ summary.inactiveCount }}</span>
              </div>
            </div>
            <div class="mt-3">
              <apexchart type="pie" height="170" :options="pieOptions" :series="pieSeries" />
            </div>
          </div>



        </b-card>
      </b-col>
    </b-row>


    <!-- Error -->
    <b-alert v-if="error" show variant="danger" class="mb-3">
      {{ error }}
    </b-alert>

    <!-- Search row -->
    <b-row class="mb-3">
      <b-col cols="12" md="6">
        <div class="text-left">ค้นหา (account / uid / url)</div>
        <b-form-group label-size="sm" label-for="search-input">
          <b-form-input id="search-input" size="sm" v-model="searchQuery"
            placeholder="เช่น The Isaan Record, IsaanRecordThai, facebook.com/..."></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>

    <!-- Tabs: Active / Inactive -->
    <b-row>
      <b-col cols="12">
        <b-card>
          <b-tabs>
            <!-- Active -->
            <b-tab :title="`Active (${activeAccountsFiltered.length})`">
              <b-table small striped hover :items="activeAccountsFiltered" :fields="tableFields" :empty-text="loading ? 'กำลังโหลด...' : 'ไม่มีข้อมูล active'
                " stacked="md" :per-page="perPage" :current-page="activeCurrentPage">
                <template #cell(name)="row">
                  <div class="text-left">
                    <a v-if="row.item.url" :href="row.item.url" target="_blank" rel="noopener noreferrer">
                      <b-avatar :src="row.item.profile_image" :text="avatarInitial(row.item.name || row.item.uid)"
                        size="3rem"></b-avatar>
                      {{ row.item.name || row.item.uid }}
                    </a>
                    <span v-else>{{ row.item.name }}</span>
                    <div class="small text-muted d-none">
                      {{ row.item.uid }}
                    </div>
                  </div>
                </template>

                <template #cell(latestDateLocal)="row">
                  <div>{{ row.item.latestDateLocal || "-" }}</div>
                </template>

                <template #cell(latestCreatedOnLocal)="row">
                  <div>{{ row.item.latestCreatedOnLocal || "-" }}</div>
                </template>

                <template #cell(latencyText)="row">
                  <span>{{ row.item.latencyText || "-" }}</span>
                </template>
              </b-table>

              <!-- ✅ Pagination สำหรับ Active -->
              <b-pagination v-model="activeCurrentPage" :total-rows="activeAccountsFiltered.length" :per-page="perPage"
                size="sm" align="center" class="mt-2" v-if="!loading"></b-pagination>
            </b-tab>

            <!-- Inactive -->
            <b-tab :title="`Inactive (${inactiveAccountsFiltered.length})`">
              <b-table small striped hover :items="inactiveAccountsFiltered" :fields="tableFields" :empty-text="loading ? 'กำลังโหลด...' : 'ไม่มีข้อมูล inactive'
                " :per-page="perPage" :current-page="inactiveCurrentPage">
                <template #cell(name)="row">
                  <div class="text-left">
                    <a v-if="row.item.url" :href="row.item.url" target="_blank" rel="noopener noreferrer">
                      <b-avatar :src="row.item.profile_image" :text="avatarInitial(row.item.name || row.item.uid)"
                        size="3rem"></b-avatar>
                      {{ row.item.name || row.item.uid }}
                    </a>
                    <span v-else>{{ row.item.name }}</span>
                    <div class="small text-muted d-none">
                      {{ row.item.uid }}
                    </div>
                  </div>
                </template>

                <template #cell(latestDateLocal)="row">
                  <div>{{ row.item.latestDateLocal || "-" }}</div>
                </template>

                <template #cell(latestCreatedOnLocal)="row">
                  <div>{{ row.item.latestCreatedOnLocal || "-" }}</div>
                </template>

                <template #cell(latencyText)="row">
                  <span>{{ row.item.latencyText || "-" }}</span>
                </template>
              </b-table>

              <!-- ✅ Pagination สำหรับ Inactive -->
              <b-pagination v-model="inactiveCurrentPage" :total-rows="inactiveAccountsFiltered.length"
                :per-page="perPage" size="sm" align="center" class="mt-2"></b-pagination>
            </b-tab>
          </b-tabs>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from "axios";
import VueApexCharts from "vue-apexcharts";
export default {
  name: "BotActiveStatus",
  data() {
    const today = (() => {
      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    })();

    return {
      // ✅ options ของ pie chart
      pieOptions: {
        foreColor: "#000",
        labels: ["Active", "Inactive"],
        colors: ["#28a745", "#dc3545"],
        legend: {
        show: false  ,
          position: "bottom"
        },
        dataLabels: {
           enabled: true,
  style: {
    colors: ["#fff"],      // ตัวหนังสือสีดำ
    fontWeight: "bold"
  },
  formatter: function (val) {
    return val.toFixed(1) + "%";
  },
  // dropShadow: {
  //   enabled: true,
  //   top: 0,
  //   left: 0,
  //   blur: 0,               
  //   color: "#fff",         
  //   opacity: 0.2
  // }
        },
        tooltip: {
          y: {
            // ❌ ไม่อ้าง w / config อีกแล้ว เพื่อกัน error
            formatter: function (value) {
              return value + " accounts";
            }
          }
        }
      },

      valueDate: [today, today],

      selectedSource: "facebook",
      selectedBotLevel: 2,

      loading: false,
      error: null,

      summary: null,
      activeAccountsRaw: [],
      inactiveAccountsRaw: [],

      searchQuery: "",

      // cache
      cache: {},
      cacheTTL: 10 * 60 * 1000,
      usedCache: false,

      // ✅ pagination settings
      perPage: 30,
      activeCurrentPage: 1,
      inactiveCurrentPage: 1,

      sourceOptions: [
        { value: "facebook", text: "Facebook" },
        { value: "twitter", text: "X" },
        { value: "pantip", text: "Pantip" },
        { value: "news", text: "News" },
        { value: "youtube", text: "YouTube" },
        { value: "instagram", text: "Instagram" },
        { value: "blockdit", text: "Blockdit" },
        { value: "tiktok", text: "Tiktok" },
        { value: "threads", text: "Threads" }
      ],
      botLevelOptions: [
        { value: 1, text: "Level 1" },
        { value: 2, text: "Level 2" },
        { value: 3, text: "Level 3" }
      ],

      tableFields: [
        { key: "name", label: "Account", sortable: true },
        { key: "postsOnSelected", label: "จำนวนโพสต์", sortable: true },
        { key: "latestDateLocal", label: "เวลาโพสต์ล่าสุด", sortable: true },
        {
          key: "latestCreatedOnLocal",
          label: "เวลาที่เก็บเข้าระบบ",
          sortable: true
        },
        { key: "latencyText", label: "Latency", sortable: false }
      ]
    };
  },
  computed: {
    pieSeries() {
      if (!this.summary) {
        return [0, 0];
      }
      const active = Number(this.summary.activeCount || 0);
      const inactive = Number(this.summary.inactiveCount || 0);
      return [active, inactive];
    },
    startDate() {
      if (Array.isArray(this.valueDate) && this.valueDate.length > 0) {
        return this.valueDate[0] || null;
      }
      return null;
    },
    endDate() {
      if (Array.isArray(this.valueDate) && this.valueDate.length > 1) {
        return this.valueDate[1] || null;
      }
      return this.startDate;
    },
    formattedDateLabel() {
      const fmt = dstr => {
        if (!dstr) return "";
        const [y, m, d] = dstr.split("-");
        return `${d}/${m}/${y}`;
      };

      if (this.startDate && this.endDate) {
        if (this.startDate === this.endDate) {
          return fmt(this.startDate);
        }
        return `${fmt(this.startDate)} - ${fmt(this.endDate)}`;
      }

      if (this.startDate && !this.endDate) {
        return `จาก ${fmt(this.startDate)}`;
      }
      if (!this.startDate && this.endDate) {
        return `ถึง ${fmt(this.endDate)}`;
      }
      return "";
    },
    activeAccounts() {
      return this.activeAccountsRaw.map(a => this.normalizeAccount(a));
    },
    inactiveAccounts() {
      return this.inactiveAccountsRaw.map(a => this.normalizeAccount(a));
    },
    activeAccountsFiltered() {
      if (!this.searchQuery) return this.activeAccounts;
      const q = this.searchQuery.toLowerCase();
      return this.activeAccounts.filter(acc => this.matchSearch(acc, q));
    },
    inactiveAccountsFiltered() {
      if (!this.searchQuery) return this.inactiveAccounts;
      const q = this.searchQuery.toLowerCase();
      return this.inactiveAccounts.filter(acc => this.matchSearch(acc, q));
    }
  },
  watch: {
    // ถ้าค้นหา เปลี่ยนหน้ากลับหน้า 1 เพื่อไม่ให้ค้างอยู่หน้าสูงๆ แล้วไม่มีข้อมูล
    searchQuery() {
      this.activeCurrentPage = 1;
      this.inactiveCurrentPage = 1;
    }
  },
  methods: {
    checkDateRange() {
      if (!Array.isArray(this.valueDate)) return;
      if (this.valueDate.length === 1) {
        this.valueDate = [this.valueDate[0], this.valueDate[0]];
      } else if (this.valueDate.length >= 2) {
        const [s, e] = this.valueDate;
        if (s && e && s > e) {
          this.valueDate = [e, s];
        } else {
          this.valueDate = [s, e];
        }
      }
      // ช่วงวันที่เปลี่ยนแล้ว ถ้า user กด submit ทีหลัง ให้เริ่มที่หน้า 1
      this.activeCurrentPage = 1;
      this.inactiveCurrentPage = 1;
    },
    avatarInitial(name) {
      if (!name) return "?";
      return name.trim().charAt(0).toUpperCase();
    },
    formatDateTimeMinus7(value) {
      if (!value) return "-";

      const d = new Date(value);
      if (isNaN(d.getTime())) return value;

      const minus = new Date(d.getTime() - 7 * 60 * 60 * 1000);

      return minus.toLocaleString("th-TH", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    },
    formatDateTime(value) {
      if (!value) return null;
      const d = new Date(value);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleString("th-TH", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    },
    getLatencyText(latestDate, latestCreatedOn) {
      if (!latestDate || !latestCreatedOn) return null;

      const start = new Date(latestDate);
      const end = new Date(latestCreatedOn);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

      const endPlus7 = new Date(end.getTime() + 7 * 60 * 60 * 1000);

      const diffMs = endPlus7 - start;
      if (diffMs <= 0) return "0 นาที";

      const totalMinutes = Math.round(diffMs / 60000);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      if (hours <= 0) return `${minutes} นาที`;
      if (minutes === 0) return `${hours} ชม.`;
      return `${hours} ชม. ${minutes} นาที`;
    },
    normalizeAccount(acc) {
      const latestDateLocal = this.formatDateTimeMinus7(acc.latestDate);
      const latestCreatedOnLocal = this.formatDateTime(acc.latestCreatedOn);
      const latencyText = this.getLatencyText(
        acc.latestDate,
        acc.latestCreatedOn
      );

      return {
        ...acc,
        latestDateLocal,
        latestCreatedOnLocal,
        latencyText
      };
    },
    matchSearch(acc, q) {
      return (
        (acc.name && acc.name.toLowerCase().includes(q)) ||
        (acc.uid && acc.uid.toLowerCase().includes(q)) ||
        (acc.url && acc.url.toLowerCase().includes(q))
      );
    },

    makeCacheKey() {
      return `${this.startDate}|${this.endDate}|${this.selectedSource}|${this.selectedBotLevel}`;
    },

    buildDateTimeRange() {
      const start =
        this.startDate && this.startDate.trim() !== ""
          ? `${this.startDate}T00:00:00`
          : null;
      const end =
        this.endDate && this.endDate.trim() !== ""
          ? `${this.endDate}T23:59:59`
          : null;
      return { start, end };
    },

    async fetchActiveStatus(force = false) {
      const isForce = force === true;

      this.error = null;
      this.usedCache = false;

      const key = this.makeCacheKey();
      const now = Date.now();
      const cached = this.cache[key];

      if (!isForce && cached && now - cached.timestamp < this.cacheTTL) {
        this.summary = cached.summary;
        this.activeAccountsRaw = cached.activeAccountsRaw;
        this.inactiveAccountsRaw = cached.inactiveAccountsRaw;
        this.usedCache = true;
        // ใช้ cache แล้ว ให้กลับไปหน้า 1
        this.activeCurrentPage = 1;
        this.inactiveCurrentPage = 1;
        return;
      }

      this.loading = true;
      this.summary = null;
      this.activeAccountsRaw = [];
      this.inactiveAccountsRaw = [];

      const { start, end } = this.buildDateTimeRange();

      try {
        const params = {
          source: this.selectedSource,
          bot_level: this.selectedBotLevel
        };
        if (start) params.start_date = start;
        if (end) params.end_date = end;

        const { data } = await axios.get(
          "https://api2.cognizata.com/api/bot-latency/active-status",
          { params }
        );

        this.summary = data.summary || {
          totalTargets: 0,
          activeCount: 0,
          inactiveCount: 0
        };

        this.activeAccountsRaw = Array.isArray(data.active) ? data.active : [];
        this.inactiveAccountsRaw = Array.isArray(data.inactive)
          ? data.inactive
          : Array.isArray(data.intive)
            ? data.intive
            : [];

        this.cache[key] = {
          timestamp: now,
          summary: this.summary,
          activeAccountsRaw: this.activeAccountsRaw,
          inactiveAccountsRaw: this.inactiveAccountsRaw
        };

        // reload ใหม่ก็กลับไปหน้า 1 เหมือนกัน
        this.activeCurrentPage = 1;
        this.inactiveCurrentPage = 1;
      } catch (err) {
        console.error("Error fetching active status", err);
        this.error =
          (err &&
            err.response &&
            err.response.data &&
            (err.response.data.message || err.response.data.error)) ||
          err.message ||
          "Request failed";
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchActiveStatus();
  }
};
</script>

<style scoped>
.summary-items {
  gap: 16px;
}

.summary-item {
  min-width: 120px;
}

.summary-item .label {
  display: block;
  font-size: 0.75rem;
  color: #666;
}

.summary-item .value {
  font-size: 1.1rem;
  font-weight: 600;
}
</style>
