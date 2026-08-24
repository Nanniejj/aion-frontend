<template>
  <div id="chart-hourly-domain">
    <div class="text-center mt-10 py-4 pb-0" v-if="loading">
      <vue-element-loading
        :active="loading"
        size="30"
        background-color="rgba(255, 255, 255, 0.5)"
        color="#17a2b891"
        spinner="bar-fade-scale"
      />
    </div>

    <apexchart
      v-show="!loading"
      ref="chart"
      type="line"
      height="350"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import axios from "axios";

export default {
  name: "ChartHourlyDomain",
  components: { apexchart: VueApexCharts },
  props: {
    // ID ของ domain ที่จะดึงข้อมูล (query param: domain_id)
    domainId: { type: [String, Number], required: true },
    // "YYYY-MM-DDTHH:mm:ss" ตามช่วงเวลาที่เลือก
    start: { type: String, required: true },
    end: { type: String, required: true },
    sourceNews: { type: String, default: "internal" },
  },
  data() {
    return {
      loading: false,
      error: null,
      series: [],
      lastPayload: null,
      chartOptions: {
        colors: ["#ff962e", "#17a2b8", "#e75aa1"],
        chart: {
          type: "line",
          fontFamily: "Prompt, FontAwesome, sans-serif",
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              pan: true,
              reset: true,
            },
          },
        },
        stroke: { curve: "smooth", width: 3 },
        markers: { size: 5 },
        legend: { position: "top" },
        xaxis: {
          type: "datetime",
          labels: {
            datetimeUTC: true,
            formatter: (v) => {
              const ts = Number(v);
              if (!Number.isFinite(ts)) return "";
              return new Intl.DateTimeFormat("th-TH", {
                timeZone: "Asia/Bangkok",
                hourCycle: "h23",
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              }).format(ts);
            },
          },
        },
        tooltip: {
          shared: true,
          x: {
            formatter: (v) => {
              const ts = Number(v);
              if (!Number.isFinite(ts)) return "";
              return new Intl.DateTimeFormat("th-TH", {
                timeZone: "Asia/Bangkok",
                hourCycle: "h23",
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(ts);
            },
          },
        },
        yaxis: [
          {
            seriesName: "Posts",
            title: { text: "Posts" },
            min: 0,
            labels: { formatter: (v) => Math.round(v).toLocaleString() || 0 },
          },
          {
            seriesName: "Messages",
            title: { text: "Messages" },
            min: 0,
            labels: { formatter: (v) => Math.round(v).toLocaleString() || 0 },
          },
          {
            seriesName: "Engagement",
            title: { text: "Engagement" },
            min: 0,
            opposite: true,
            labels: { formatter: (v) => Math.round(v).toLocaleString() || 0 },
          },
        ],
        noData: { text: "กำลังโหลดข้อมูล..." },
      },
    };
  },
  watch: {
    domainId() {
      this.fetchData();
    },
    start() {
      this.fetchData();
    },
    end() {
      this.fetchData();
    },
    sourceNews() {
      this.fetchData();
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    setNoDataText(text) {
      const patch = { noData: { text } };
      if (this.$refs.chart && this.$refs.chart.updateOptions) {
        this.$refs.chart.updateOptions(patch, false, true);
      } else if (
        this.$refs.chart &&
        this.$refs.chart.chart &&
        this.$refs.chart.chart.updateOptions
      ) {
        this.$refs.chart.chart.updateOptions(patch, false, true);
      } else {
        this.chartOptions = Object.assign({}, this.chartOptions, patch);
      }
    },

    async fetchData() {
      if (!this.domainId || !this.start || !this.end) return;

      this.loading = true;
      this.error = null;
      this.series = [];
      this.setNoDataText("กำลังโหลดข้อมูล...");

      const API_URL =
        "https://api2.cognizata.com/api/v2/userposts/getPostChartsfromDomain";
      const params = {
        domain_id: this.domainId,
        source_news: this.sourceNews,
        start: this.start,
        end: this.end,
      };

      try {
        const { data } = await axios.get(API_URL, {
          params,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        });
        this.lastPayload = data;
        this.applyData(data);
      } catch (err) {
        console.error(err);
        this.error = "โหลดข้อมูลไม่สำเร็จ";
        this.series = [];
        this.setNoDataText("โหลดข้อมูลไม่สำเร็จ");
      } finally {
        this.loading = false;
      }
    },

    isAllZero(rows) {
      return (
        rows.length > 0 &&
        rows.every(
          (r) =>
            Number(r.post_count || 0) === 0 &&
            Number(r.engagement_sum || 0) === 0 &&
            Number(r.message_sum || 0) === 0
        )
      );
    },

    parseOffsetToMs(tzStr) {
      const m = String(tzStr || "")
        .trim()
        .match(/^([+-])(\d{2}):?(\d{2})$/);
      if (!m) return 0;
      const sign = m[1] === "+" ? 1 : -1;
      const hh = parseInt(m[2], 10) || 0;
      const mm = parseInt(m[3], 10) || 0;
      return sign * (hh * 60 + mm) * 60 * 1000;
    },

    // แปลง payload -> series แบบเดียวกับ ChartTime.vue (เติมชั่วโมงที่ขาดด้วย 0
    // เพื่อให้กราฟเป็นเส้นต่อเนื่องตามกริดรายชั่วโมง)
    applyData(payload) {
      this.lastPayload = payload;
      const tz =
        payload && payload.range && payload.range.timezone
          ? payload.range.timezone
          : "+07:00";
      const rows =
        payload && Array.isArray(payload.seriesHourly)
          ? payload.seriesHourly
          : [];

      if (!rows.length || this.isAllZero(rows)) {
        this.series = [];
        this.setNoDataText("ไม่พบข้อมูล");
        return;
      }

      this.setNoDataText("");

      const offsetMs = this.parseOffsetToMs(tz);
      const keyOf = (d, t) => d + " " + String(t).padStart(5, "0");
      const dataMap = new Map();

      rows.forEach((r) => {
        const key = keyOf(r.date, r.time);
        dataMap.set(key, {
          post: Number(r.post_count || 0),
          engagement: Number(r.engagement_sum || 0),
          msg: Number(r.message_sum || 0),
        });
      });

      const toUtcMs = (d, t) => Date.parse(d + "T" + t + ":00" + tz);
      const localMsFromUtc = (utc) => utc + offsetMs;

      let minLocal = Infinity,
        maxLocal = -Infinity;
      rows.forEach((r) => {
        const utc = toUtcMs(r.date, r.time);
        const local = localMsFromUtc(utc);
        if (local < minLocal) minLocal = local;
        if (local > maxLocal) maxLocal = local;
      });

      const HOUR = 3600000;
      const gridStartLocal = Math.floor(minLocal / HOUR) * HOUR;
      const gridEndLocal = Math.floor(maxLocal / HOUR) * HOUR;

      const posts = [];
      const engagements = [];
      const messages = [];

      for (let lt = gridStartLocal; lt <= gridEndLocal; lt += HOUR) {
        const iso = new Date(lt).toISOString();
        const d = iso.slice(0, 10);
        const t = iso.slice(11, 16);
        const key = keyOf(d, t);
        const val = dataMap.get(key) || { post: 0, engagement: 0, msg: 0 };
        const tsUTC = lt - offsetMs;

        posts.push([tsUTC, val.post]);
        messages.push([tsUTC, val.msg]);
        engagements.push([tsUTC, val.engagement]);
      }

      this.series = [
        { name: "Posts", data: posts, yAxisIndex: 0 },
        { name: "Messages", data: messages, yAxisIndex: 1 },
        { name: "Engagement", data: engagements, yAxisIndex: 2 },
      ];
    },
  },
};
</script>

<style scoped>
#chart-hourly-domain {
  max-width: 100%;
  margin: 12px auto 0;
}
</style>