<template>
  <b-container fluid>
    <b-row class="px-0">
      <!-- Subdomain -->

      <b-col md="6" class="mt-2 ">
        <div class="text-left ml-2 h5">Subdomain Statistics <span class="small">(posts)</span></div>
        <b-row>
          <b-col class="px-0">
            <div v-if="sublabelType === 'posts'">
              <div class="text-left">
                <b-button-group class="mb-2">
                  <b-button
                    :variant="subdomainChartType === 'pie' ? 'info' : 'outline-info'"
                    @click="subdomainChartType = 'pie'"
                    size="sm"
                  >
                    <i class="fa fa-pie-chart" aria-hidden="true"></i>
                  </b-button>
                  <b-button
                    :variant="subdomainChartType === 'bar' ? 'info' : 'outline-info'"
                    @click="subdomainChartType = 'bar'; $nextTick(applyFixedLabelSpaceForSubdomain)"
                    size="sm"
                  >
                    <i class="fa fa-chart-bar" aria-hidden="true"></i>
                  </b-button>
                </b-button-group>
              </div>
            </div>
          </b-col>
          <b-col class="px-0 ">
            <div class="text-right">
              <b-button-group class="mx-1">
                <b-button
                  :variant="sublabelType === 'posts' ? 'info' : 'outline-info'"
                  @click="sublabelType = 'posts'"
                  size="sm"
                >posts</b-button>
                <b-button
                  :variant="sublabelType === 'sentiment' ? 'info' : 'outline-info'"
                  @click="sublabelType = 'sentiment'; $nextTick(applyFixedLabelSpaceForSubdomain)"
                  size="sm"
                >sentiment</b-button>
                <b-button
                  :variant="sublabelType === 'platform' ? 'info' : 'outline-info'"
                  @click="sublabelType = 'platform'; $nextTick(applyFixedLabelSpaceForSubdomain)"
                  size="sm"
                >platform</b-button>
              </b-button-group>
            </div>
          </b-col>
        </b-row>

        <apexchart
          :type="subdomainChartType"
          height="420"
          :options="finalChartOptionsSubdomain"
          :series="finalSeriesSubdomain"
        />
      </b-col>

      <!-- Objects -->
      <b-col md="6" class="mt-2">
        <div class="text-left ml-2 h5 mt-3 mt-md-0">Top 10 Objects <span class="small">(posts)</span></div>
        <b-row>
          <b-col>
            <v-select
              class="mb-3 w-100 se-subdomain"
              :options="subdomains"
              v-model="subdomain_idText"
              label="name"
              :reduce="s => s.subdomain_id"
              multiple
              placeholder="เลือก Subdomain"
            />
          </b-col>
          <b-col>
            <div class="text-center">
              <b-button-group class="mx-1">
                <b-button
                  :variant="labelType === 'posts' ? 'info' : 'outline-info'"
                  @click="labelType = 'posts'; $nextTick(applyFixedLabelSpaceForObject)"
                  size="sm"
                >posts</b-button>
                <b-button
                  :variant="labelType === 'sentiment' ? 'info' : 'outline-info'"
                  @click="labelType = 'sentiment'; $nextTick(applyFixedLabelSpaceForObject)"
                  size="sm"
                >sentiment</b-button>
                <b-button
                  :variant="labelType === 'platform' ? 'info' : 'outline-info'"
                  @click="labelType = 'platform'; $nextTick(applyFixedLabelSpaceForObject)"
                  size="sm"
                >platform</b-button>
              </b-button-group>
            </div>
          </b-col>
        </b-row>

        <apexchart
          type="bar"
          :height="400"
          :options="chartOptionsObject"
          :series="seriesObject"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import axios from "axios";
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  components: { apexchart: VueApexCharts },

  data() {
    return {
      subdomainChartType: "pie",
      subdomain_idText: '',
      subdomains: [],
      labelType: "sentiment",
      sublabelType: "posts",

      // ✅ ค่าคงที่: ฟิกพื้นที่ฝั่งข้อความแกน Y
      fixedLabelWidthObject: 180,     // px (กราฟ Objects)
      fixedLabelWidthSubdomain: 180,  // px (กราฟ Subdomain ตอนเป็น bar)

      seriesSubdomainRaw: [],
      seriesSubdomainSentiment: [],
      seriesSubdomainPlatform: [],

      chartOptionsSubdomain: {
        grid: { show: false },
        chart: {
          id: "subdomainChart",
          type: "pie",
          fontFamily: "Prompt, sans-serif",
          toolbar: { show: false },
        },
        noData: { text: "Loading..." },
        labels: [],
        tooltip: { y: { formatter: (val) => Number(val).toLocaleString() } },
        legend: { position: "bottom" },
        colors: ['#e6ba59', '#40A578', '#725CAD', '#F075AA', '#368ab6', '#ea7668', '#9ABF80', '#71C0BB', '#34495e'],
        dataLabels: { enabled: true },
        xaxis: { categories: [], labels: { show: false } },
        // yaxis จะถูกฟิกโดยฟังก์ชัน applyFixedLabelSpaceForSubdomain
      },

      seriesObject: [],
      chartOptionsObject: {
        grid: { show: false },
        chart: {
          toolbar: { show: false },
          id: "objectChart",
          type: "bar",
          stacked: true,
          fontFamily: "Prompt, sans-serif",
        },
        noData: { text: "Loading..." },
        dataLabels: {
          enabled: true,
          style: { fontSize: "13px" },
          formatter: (value) => this.formatCash(value),
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: "80%",
            borderRadius: 5,
            borderRadiusApplication: 'end',
            dataLabels: {
              style: { fontSize: "13px" },
              total: { enabled: true },
            },
          },
        },
        xaxis: { categories: [], labels: { show: false } },
        yaxis: {
          labels: {
            show: true,
            align: "right",
            style: { fontSize: "13px", fontWeight: 400 },
            // maxWidth/offsetX จะถูกฟิกโดยฟังก์ชัน applyFixedLabelSpaceForObject
          },
        },
        tooltip: { y: { formatter: (val) => Number(val).toLocaleString() } },
        colors: ["#53b993", "#368ab6", "#ea7668"],
      },
    };
  },

  computed: {
    ...mapGetters(["getClickDomainId", "getSdateDm", "getEdateDm", "getArrDate", "getClickDomain","getSourceNews"]),

    finalSeriesSubdomain() {
      if (this.sublabelType === "posts" && this.subdomainChartType === "pie") {
        return this.seriesSubdomainRaw;
      } else if (this.sublabelType === "posts" && this.subdomainChartType === "bar") {
        return [{ name: "จำนวนโพสต์", data: this.seriesSubdomainRaw }];
      } else if (this.sublabelType === "sentiment") {
        return this.seriesSubdomainSentiment;
      } else if (this.sublabelType === "platform") {
        return this.seriesSubdomainPlatform;
      } else {
        return [];
      }
    },

    finalChartOptionsSubdomain() {
      const today = new Date();
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, '0');
      const d = String(today.getDate()).padStart(2, '0');
      const startDefault = `${y}-${m}-${d}T00:00:00`;
      const endDefault = `${y}-${m}-${d}T23:59:59`;

      const start = this.getSdateDm || startDefault;
      const end = this.getEdateDm || endDefault;

      const labels = this.subdomains.map(item => {
        const label = item.name || '';
        return label.length > 20 ? label.slice(0, 20) + '...' : label;
      });

      let baseOptions = {
        ...this.chartOptionsSubdomain,
        chart: {
          ...this.chartOptionsSubdomain.chart,
          type: this.sublabelType === 'posts' ? this.subdomainChartType : 'bar',
          stacked: this.sublabelType !== 'posts',
          events: {
            dataPointSelection: (event, chartContext, config) => {
              const clickedIndex = config.dataPointIndex;
              const clickedSubdomain = this.subdomains[clickedIndex];
              if (!clickedSubdomain) return;

              const selectedSubdomainId = clickedSubdomain.subdomain_id;
              let query = `?domain_id=${this.getClickDomainId}&domain=${this.getClickDomain}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;
              query += `&subdomain_id=${selectedSubdomainId}`;
              const routeData = this.$router.resolve({ name: "AllPost" });
              window.open(`${routeData.href}${query}`, "_blank");
            }
          }
        },
        xaxis: { categories: labels, labels: { show: false } },
        labels,
        noData: { text: "Loading..." },
        dataLabels: {
          enabled: true,
          formatter: val => val === 0 ? "" : this.formatCash(val),
          style: { colors: ["#fff"] }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            columnWidth: "80%",
            borderRadius: 5,
            borderRadiusApplication: 'end',
          }
        }
      };

      if (this.sublabelType === "sentiment") {
        return { ...baseOptions, colors: ["#53b993", "#368ab6", "#ea7668"] };
      } else if (this.sublabelType === "platform") {
        const platformColorMap = {
          facebook: "#4c77bb", x: "#727373", instagram: "#dc7848",
          pantip: "#9959eb", youtube: "#e24246", news: "#f3b557",
          tiktok: "#5c4d67", blockdit: "#1F76BD", threads: "#e75aa1"
        };
        const colors = this.seriesSubdomainPlatform.map(s => platformColorMap[s.name] || "#fff");
        return { ...baseOptions, colors };
      } else if (this.sublabelType === "posts" && this.subdomainChartType === "pie") {
        return { ...baseOptions, chart: { ...baseOptions.chart, type: "pie", stacked: false }, dataLabels: { enabled: true } };
      } else if (this.sublabelType === "posts" && this.subdomainChartType === "bar") {
        return { ...baseOptions, colors: ["#3dabbc"] };
      } else {
        return baseOptions;
      }
    }
  },

  watch: {
    getArrDate() { this.loadCharts(); },
    subdomain_idText(val) { this.loadObjectChart(val); },
    labelType() {
      this.loadObjectChart(this.subdomain_idText);
      this.$nextTick(this.applyFixedLabelSpaceForObject); // ✅ ฟิกทุกครั้งที่เปลี่ยนประเภทซีรีส์
    },
    sublabelType(val) {
      if (val !== 'posts') this.subdomainChartType = 'bar';
      this.$nextTick(this.applyFixedLabelSpaceForSubdomain); // ✅ ฟิกทุกครั้งที่เปลี่ยนโหมด
    },
    getSourceNews() {
      this.loadSubdomainChart();
    }

  },

  mounted() {
    this.loadCharts();
  },

  methods: {
    formatCash(n) {
      if (n < 1e3) return n;
      if (n < 1e6) return +(n / 1e3).toFixed(1) + "K";
      if (n < 1e9) return +(n / 1e6).toFixed(1) + "M";
      if (n < 1e12) return +(n / 1e9).toFixed(1) + "B";
      return +(n / 1e12).toFixed(1) + "T";
    },

    loadCharts() {
      this.loadSubdomainChart();
      this.loadObjectChart();
    },

    async loadSubdomainChart() {
      const today = new Date();
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, '0');
      const d = String(today.getDate()).padStart(2, '0');
      const startDefault = `${y}-${m}-${d}T00:00:00`;
      const endDefault = `${y}-${m}-${d}T23:59:59`;

      const start = this.getSdateDm || startDefault;
      const end = this.getEdateDm || endDefault;
      let sourceNewsParam = '';
      if (this.getSourceNews === 'internal') {
        sourceNewsParam = '&source_news=internal';
      } else if (this.getSourceNews === 'external') {
        sourceNewsParam = '&source_news=external';
      }
      try {
        this.chartOptionsSubdomain = { ...this.chartOptionsSubdomain, noData: { text: "Loading..." } };
        this.seriesSubdomainRaw = [];

        const res = await axios.get(
          `https://api2.cognizata.com/api/v2/ranking/getSubdomainCount?domain_id=${this.getClickDomainId}&start=${start}&end=${end}${sourceNewsParam}`,
          { headers: { Authorization: "Bearer " + localStorage.getItem("token"), "Content-Type": "application/json" } }
        );

        this.subdomains = res.data.data;
        this.seriesSubdomainRaw = this.subdomains.map(item => item.count);

        this.seriesSubdomainSentiment = [
          { name: "Positive", data: this.subdomains.map(i => i.positive || 0) },
          { name: "Neutral", data: this.subdomains.map(i => i.neutral || 0) },
          { name: "Negative", data: this.subdomains.map(i => i.negative || 0) }
        ];

        const platformKeys = new Set();
        this.subdomains.forEach(obj => { Object.keys(obj.platform || {}).forEach(p => platformKeys.add(p)); });
        const displayPlatforms = Array.from(platformKeys).map(p => p === "twitter" ? "x" : p);
        this.seriesSubdomainPlatform = displayPlatforms.map(displayName => {
          const rawKey = displayName === "x" ? "twitter" : displayName;
          return { name: displayName, data: this.subdomains.map(obj => obj.platform?.[rawKey] || 0) };
        });

        this.chartOptionsSubdomain = { ...this.chartOptionsSubdomain, noData: { text: "" } };

        // ✅ ฟิกพื้นที่ฝั่งข้อความ (กราฟแท่งเท่านั้น)
        this.$nextTick(this.applyFixedLabelSpaceForSubdomain);
      } catch (err) {
        console.error("loadSubdomainChart error:", err);
      }
    },

    async loadObjectChart(subdomainId = null) {
      const today = new Date();
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, '0');
      const d = String(today.getDate()).padStart(2, '0');
      const startDefault = `${y}-${m}-${d}T00:00:00`;
      const endDefault = `${y}-${m}-${d}T23:59:59`;

      const start = this.getSdateDm || startDefault;
      const end = this.getEdateDm || endDefault;
       let sourceNewsParam = '';
      if (this.getSourceNews === 'internal') {
        sourceNewsParam = '&source_news=internal';
      } else if (this.getSourceNews === 'external') {
        sourceNewsParam = '&source_news=external';
      }

      try {
        this.chartOptionsObject = { ...this.chartOptionsObject, noData: { text: "Loading..." } };
        this.seriesObject = [];

        let url = `https://api2.cognizata.com/api/v2/ranking/getObjectCount?domain_id=${this.getClickDomainId}&start=${start}&end=${end}&limit=10${sourceNewsParam}`;
        if (subdomainId) url += `&subdomain_id=${subdomainId}`;

        const res = await axios.get(url, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token"), "Content-Type": "application/json" }
        });

        const data = res.data.data;
        const categories = data.map(item => item.name.length > 40 ? item.name.slice(0, 40) + "..." : item.name);
        let series = [];

        if (this.labelType === 'sentiment') {
          this.chartOptionsObject = { ...this.chartOptionsObject, colors: ["#53b993", "#368ab6", "#ea7668"] };
          series = [
            { name: "Positive", data: data.map(i => i.positive || 0) },
            { name: "Neutral", data: data.map(i => i.neutral || 0) },
            { name: "Negative", data: data.map(i => i.negative || 0) }
          ];
        } else if (this.labelType === 'posts') {
          this.chartOptionsObject = { ...this.chartOptionsObject, colors: ["#3dabbc"] };
          series = [{ name: "จำนวนโพสต์", data: data.map(i => i.count || 0) }];
        } else if (this.labelType === 'platform') {
          const platformColorMap = {
            facebook: "#4c77bb", x: "#727373", instagram: "#dc7848",
            pantip: "#9959eb", youtube: "#e24246", news: "#f3b557",
            tiktok: "#5c4d67", blockdit: "#1F76BD", threads: "#e75aa1"
          };
          const rawPlatforms = new Set();
          data.forEach(obj => { Object.keys(obj.platform || {}).forEach(p => rawPlatforms.add(p)); });
          const platformDisplayNames = Array.from(rawPlatforms).map(p => p === "twitter" ? "x" : p);

          series = platformDisplayNames.map(displayName => {
            const rawKey = displayName === "x" ? "twitter" : displayName;
            return { name: displayName, data: data.map(obj => obj.platform?.[rawKey] || 0) };
          });

          this.chartOptionsObject = {
            ...this.chartOptionsObject,
            chart: {
              ...this.chartOptionsObject.chart,
              stacked: true,
              events: {
                dataPointSelection: (event, chartContext, config) => {
                  const clickedIndex = config.dataPointIndex;
                  const obj = data[clickedIndex];
                  if (!obj) return;
                  let query = `?domain_id=${encodeURIComponent(this.getClickDomainId)}&domain=${this.getClickDomain}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&object_id=${obj.object_id}`;
                  if (obj.subdomain_id) query += `&subdomain_id=${obj.subdomain_id}`;
                  const routeData = this.$router.resolve({ name: "AllPost" });
                  window.open(`${routeData.href}${query}`, "_blank");
                }
              }
            },
            xaxis: { categories },
            noData: { text: "" },
            colors: platformDisplayNames.map(name => platformColorMap[name] || "#999999"),
            dataLabels: { enabled: true, formatter: val => val === 0 ? "" : this.formatCash(val) }
          };
        }

        this.seriesObject = series;

        this.chartOptionsObject = {
          ...this.chartOptionsObject,
          chart: {
            ...this.chartOptionsObject.chart,
            stacked: this.labelType !== 'posts',
            events: {
              dataPointSelection: (event, chartContext, config) => {
                const clickedIndex = config.dataPointIndex;
                const obj = data[clickedIndex];
                if (!obj) return;
                let query = `?domain_id=${encodeURIComponent(this.getClickDomainId)}&domain=${this.getClickDomain}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&object_id=${obj.object_id}`;
                if (obj.subdomain_id) query += `&subdomain_id=${obj.subdomain_id}`;
                const routeData = this.$router.resolve({ name: "AllPost" });
                window.open(`${routeData.href}${query}`, "_blank");
              }
            }
          },
          xaxis: { categories },
          noData: { text: "" },
          dataLabels: { enabled: true, formatter: val => val === 0 ? "" : this.formatCash(val) }
        };

        // ✅ ฟิกพื้นที่ฝั่งข้อความ
        this.$nextTick(this.applyFixedLabelSpaceForObject);
      } catch (err) {
        console.error(err);
      }
    },

    // ===== ฟังก์ชันฟิกพื้นที่ฝั่งข้อความแกน Y (ค่าคงที่) =====
    applyFixedLabelSpaceForObject() {
      const leftPad = this.fixedLabelWidthObject;
      this.chartOptionsObject = {
        ...this.chartOptionsObject,
        grid: {
          ...(this.chartOptionsObject.grid || {}),
          padding: {
            ...(this.chartOptionsObject.grid?.padding || {}),
            left: leftPad, right: 0, top: 0, bottom: 0,
          },
        },
        yaxis: {
          ...(this.chartOptionsObject.yaxis || {}),
          labels: {
            ...((this.chartOptionsObject.yaxis && this.chartOptionsObject.yaxis.labels) || {}),
            show: true,
            align: "right",
            maxWidth: leftPad - 12,
            offsetX: 0,
            style: { fontSize: "13px", fontWeight: 400 },
          },
        },
      };
    },

    applyFixedLabelSpaceForSubdomain() {
      const isBar =
        this.sublabelType !== 'posts' || (this.sublabelType === 'posts' && this.subdomainChartType === 'bar');
      if (!isBar) return;

      const leftPad = this.fixedLabelWidthSubdomain;
      this.chartOptionsSubdomain = {
        ...this.chartOptionsSubdomain,
        grid: {
          ...(this.chartOptionsSubdomain.grid || {}),
          padding: {
            ...(this.chartOptionsSubdomain.grid?.padding || {}),
            left: leftPad, right: 0, top: 0, bottom: 0,
          },
        },
        yaxis: {
          ...(this.chartOptionsSubdomain.yaxis || {}),
          labels: {
            ...((this.chartOptionsSubdomain.yaxis && this.chartOptionsSubdomain.yaxis.labels) || {}),
            show: true,
            align: "right",
            maxWidth: leftPad - 12,
            offsetX: 0,
            style: { fontSize: "13px", fontWeight: 400 },
          },
        },
      };
    },
    // =========================================================
  },
};
</script>

<style>
.se-subdomain .vs__dropdown-toggle {
  padding: 0 0 4px;
  font-size: 13px;
  overflow-y: scroll;
  height: 31px;
  border: 1px solid #5bc6d6e0;
}
</style>

<style scoped>
h5 { margin-bottom: 15px; }
.btn-info { color: #fffdfd; }
</style>
