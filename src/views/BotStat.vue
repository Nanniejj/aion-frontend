<template>
  <b-container fluid class="bot-latency-dashboard py-3">
    <!-- Header + Filters -->
    <b-row class="mb-3 align-items-end">
      <b-col cols="12" md="3">
        <h3 class="mb-0">Bot Latency Dashboard</h3>
        <small class="text-muted">สรุป latency ตาม platform / bot level</small>
      </b-col>
      <b-col cols="12" md="3">
        <b-form-group label="วันที่" label-size="sm" label-for="date-input">
          <b-form-input id="date-input" type="date" size="sm" v-model="selectedDate"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col cols="12" md="3">
        <b-form-group label="Bot Level" label-size="sm" label-for="bot-level-select">
          <b-form-select id="bot-level-select" size="sm" :options="botLevelOptions"
            v-model="selectedBotLevel"></b-form-select>
        </b-form-group>
      </b-col>
      <b-col cols="12" md="auto" class="text-left py-3">
        <b-button size="sm" variant="info" @click="fetchAllSources" :disabled="loading">
          <span v-if="loading">Loading...</span>
          <span v-else>submit</span>
        </b-button>
      </b-col>

    </b-row>
    <div class="text-right my-2">
       <b-button size="sm" variant="info" :to="{ path: '/botstatus' }" target="_blank" class="mr-2">
        รายชื่อบัญชีที่ active / inactive
      </b-button>
      <b-button size="sm" variant="info" :to="{ path: '/botdetail' }" target="_blank">
        ดูรายโพสต์
      </b-button>
    </div>
    <!-- Summary row -->
    <b-row v-if="overallSummary" class="mb-3">
      <b-col cols="12">
        <b-card body-class="py-2">
          <div class="d-flex flex-wrap justify-content-between align-items-center">
            <div>
              <h5 class="mb-1">
                ภาพรวมวันนี้ ({{ formattedDateLabel }})
              </h5>
              <small class="text-muted h6">
                Bot level:
                <strong v-if="appliedBotLevel !== 'all'">{{ appliedBotLevel }}</strong>
                <strong v-else>All</strong>
              </small>
            </div>
            <div class="d-flex flex-wrap summary-items">
              <div class="summary-item">
                <span class="label">รวม Target Bots</span>
                <span class="value">{{ overallSummary.totalTargetBotsAll | numFormat }}</span>
              </div>
              <div class="summary-item">
                <span class="label">รวม Posts</span>
                <span class="value">{{ overallSummary.totalPostsAll | numFormat }}</span>
              </div>
              <div class="summary-item">
                <span class="label">รวม Accounts</span>
                <span class="value">{{ overallSummary.totalAccountsAll | numFormat }}</span>
              </div>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <!-- Cards per platform -->
    <b-row>
      <b-col v-for="src in platformSources" :key="src.value" cols="12" md="6" lg="6" class="mb-3">
        <b-card class="h-100">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
              <h5 class="mb-0">{{ src.text }}</h5>
              <small class="text-muted">
                Bot level:
                <span v-if="appliedBotLevel !== 'all'">{{ appliedBotLevel }}</span>
                <span v-else>All</span>
              </small>
            </div>
          </div>

          <!-- เนื้อหาการ์ด -->
          <div v-if="platformData[src.value] && !platformData[src.value].error">
            <div class="platform-stats mb-2">
              <div class="stat-item">
                <span class="label">Target Bots (level นี้)</span>
                <span class="value">
                  {{ getTargetBotsForLevel(platformData[src.value]) | numFormat }}
                </span>
              </div>
              <div class="stat-item">
                <span class="label">Accounts ที่มีโพสต์</span>
                <span class="value">
                  {{
                    (getFirstRow(platformData[src.value]) &&
                      getFirstRow(platformData[src.value]).accounts) || 0 | numFormat
                  }}
                </span>
              </div>
              <div class="stat-item">
                <span class="label">Posts</span>
                <span class="value">
                  {{
                    (getFirstRow(platformData[src.value]) &&
                      getFirstRow(platformData[src.value]).posts) || 0 | numFormat
                  }}
                </span>
              </div>
              <div class="stat-item">
                <span class="label">Avg Latency (ชม.)</span>
                <span class="value">
                  {{
                    formatNumber(
                      getFirstRow(platformData[src.value]) &&
                      getFirstRow(platformData[src.value]).avgLatency
                    ) | numFormat
                  }}
                </span>
              </div>
            </div>

            <div v-if="getFirstRow(platformData[src.value])">
              <apexchart type="bar" height="260" :options="latencyChartOptions"
                :series="buildLatencySeries(getFirstRow(platformData[src.value]))"></apexchart>
            </div>
            <div v-else class="text-muted small mt-2">
              ไม่มีข้อมูลในช่วงเวลานี้
            </div>
          </div>

          <div v-else-if="platformData[src.value] && platformData[src.value].error" class="text-danger small mt-2">
            Error: {{ platformData[src.value].error }}
          </div>

          <div v-else class="text-muted small mt-2">
            <span v-if="loading">กำลังโหลด...</span>
            <span v-else>ไม่มีข้อมูล</span>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from "axios";
import VueApexCharts from "vue-apexcharts";

export default {
  name: "BotLatencyDashboard",
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      // ฟิลเตอร์
      selectedDate: this.getTodayDateString(),
      selectedBotLevel: "2", // ใช้กับ dropdown
      appliedBotLevel: "2", // ใช้จริงกับการ์ด + API

      // options
      sourceOptions: [
        { value: null, text: "All Platform" },
        { value: "facebook", text: "Facebook" },
        { value: "twitter", text: "X" },
        { value: "pantip", text: "Board" },
        { value: "news", text: "News" },
        { value: "youtube", text: "YouTube" },
        { value: "instagram", text: "Instagram" },
        { value: "blockdit", text: "Blockdit" },
        { value: "tiktok", text: "Tiktok" },
        { value: "threads", text: "Threads" }
      ],
      botLevelOptions: [
        { value: "all", text: "All Level" },
        { value: "1", text: "Level 1" },
        { value: "2", text: "Level 2" },
        { value: "3", text: "Level 3" }
      ],

      // state
      loading: false,
      platformData: {}, // { facebook: { data, totalTargetBots }, ... }

      // apex chart options
      latencyChartOptions: {
        chart: {
          toolbar: { show: false }
        },
        xaxis: {
          categories: ["≤1m", "≤5m", "≤10m", "≤30m", "≤1h", "≤2h", "≤3h", "≤5h", ">5h"]
        },
        dataLabels: {
          enabled: true,
          offsetY: -20,
          style: {
            fontSize: "11px",
            fontWeight: "bold",
            colors: ["#000000"]
          },
          formatter: function (val, opts) {
            // ถ้าค่านี้เป็น 0 ไม่ต้องโชว์ label
            if (!val) return "";

            const totals = opts.w.globals.seriesTotals || [];
            const total = totals[opts.seriesIndex] || 0;
            if (!total) return "";

            const percent = (val / total) * 100;
            return `${val} (${percent.toFixed(1)}%)`;
          }
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: "55%",
            dataLabels: {
              position: "top"
            },
            distributed: true
          }
        },
        legend: {
          show: false
        },
        colors: [
          "#1f77b4",
          "#ff7f0e",
          "#2ca02c",
          "#d62728",
          "#9467bd",
          "#8c564b",
          "#e377c2",
          "#7f7f7f",
          "#bcbd22"
        ],
        stroke: {
          show: true,
          width: 1
        },
        grid: {
          strokeDashArray: 4
        },
        tooltip: {
          y: {
            formatter: function (val, opts) {
              const totals = opts.w.globals.seriesTotals || [];
              const total = totals[opts.seriesIndex] || 0;
              if (!total) return `${val} posts`;
              const percent = (val / total) * 100;
              return `${val} posts (${percent.toFixed(1)}%)`;
            }
          }
        }
      }
    };
  },
  computed: {
    // เฉพาะ platform (ไม่รวม All Platform)
    platformSources() {
      return this.sourceOptions.filter(s => s.value !== null);
    },
    formattedDateLabel() {
      if (!this.selectedDate) return "";
      const [y, m, d] = this.selectedDate.split("-");
      return `${d}/${m}/${y}`;
    },
    // summary รวมทุก platform
    overallSummary() {
      const sources = this.platformSources;
      if (!sources.length) return null;

      let totalTargetBotsAll = 0;
      let totalPostsAll = 0;
      let totalAccountsAll = 0;

      sources.forEach(src => {
        const resData = this.platformData[src.value];
        if (!resData || resData.error) return;

        const row = this.getFirstRow(resData);
        if (row) {
          totalPostsAll += row.posts || 0;
          totalAccountsAll += row.accounts || 0;
        }
        totalTargetBotsAll += this.getTargetBotsForLevel(resData) || 0;
      });

      return {
        totalTargetBotsAll,
        totalPostsAll,
        totalAccountsAll
      };
    }
  },
  methods: {
    getTodayDateString() {
      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    buildDateRange() {
      const start_date = `${this.selectedDate}T00:00:00`;
      const end_date = `${this.selectedDate}T23:59:59`;
      return { start_date, end_date };
    },
    formatNumber(num, digits = 2) {
      if (num == null || isNaN(num)) return "-";
      return Number(num).toFixed(digits);
    },
    getFirstRow(resData) {
      return resData && resData.data && resData.data[0] ? resData.data[0] : null;
    },
    getTargetBotsForLevel(resData) {
      if (!resData || !resData.totalTargetBots) return 0;

      if (this.appliedBotLevel === "all") {
        // รวมทุก level
        return Object.values(resData.totalTargetBots).reduce(
          (sum, v) => sum + Number(v || 0),
          0
        );
      }
      return resData.totalTargetBots[this.appliedBotLevel] || 0;
    },
    buildLatencySeries(row) {
      if (!row) {
        return [{ name: "Posts", data: [] }];
      }
      const data = [
        row.within1m || 0,
        row.within5m || 0,
        row.within10m || 0,
        row.within30m || 0,
        row.within1h || 0,
        row.within2h || 0,
        row.within3h || 0,
        row.within5h || 0,
        row.over5h || 0
      ];
      return [{ name: "Posts", data }];
    },
    async fetchOneSource(sourceValue) {
      const { start_date, end_date } = this.buildDateRange();

      const params = {
        start_date,
        end_date
      };

      if (sourceValue) {
        params.source = sourceValue;
      }

      if (this.appliedBotLevel !== "all") {
        params.bot_level = this.appliedBotLevel;
      }

      try {
        const { data } = await axios.get(
          "https://api2.cognizata.com/api/bot-latency/summary-by-botlevel",
          { params }
        );
        this.$set(this.platformData, sourceValue, data);
      } catch (err) {
        console.error("Error fetching source", sourceValue, err);
        this.$set(this.platformData, sourceValue, {
          error: (err && err.message) || "Request failed"
        });
      }
    },
    async fetchAllSources() {
      this.loading = true;
      this.platformData = {};

      // apply ค่า dropdown ณ ตอนกดปุ่ม
      this.appliedBotLevel = this.selectedBotLevel;

      try {
        const promises = this.platformSources.map(src =>
          this.fetchOneSource(src.value)
        );
        await Promise.all(promises);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchAllSources();
  }
};
</script>

<style scoped>
.summary-items {
  gap: 16px;
}

.summary-item {
  min-width: 140px;
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

.platform-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-column-gap: 8px;
  grid-row-gap: 4px;
  font-size: 0.85rem;
}

.stat-item .label {
  display: block;
  color: #777;
}

.stat-item .value {
  font-weight: 600;
  font-size: 0.95rem;
}
</style>
