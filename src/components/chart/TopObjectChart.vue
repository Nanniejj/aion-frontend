<template>
  <b-container fluid>
    <b-row>
      <b-col md="6">
        <div class="text-left ml-2 h6">จำนวนโพสต์ Subdomain</div>
        <b-form-select v-model="subdomainChartType" class="mb-3" :options="[
          { value: 'pie', text: 'Pie Chart' },
          { value: 'bar', text: 'Bar Chart' }
        ]" />
        <apexchart :type="subdomainChartType" height="400" :options="finalChartOptionsSubdomain"
          :series="finalSeriesSubdomain" />
      </b-col>

      <b-col md="6">
        <div class="text-left ml-2 h6">Top 10 Objects</div>
        <v-select class="mb-3" :options="subdomains" v-model="subdomain_idText" label="name"
          :reduce="s => s.subdomain_id" multiple placeholder="เลือก Subdomain" />
        <apexchart type="bar" :height="400" :options="chartOptionsObject" :series="seriesObject" />
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
  components: {
    apexchart: VueApexCharts,
  },

  data() {
    return {
      subdomainChartType: "pie",
      subdomain_idText: '',
      subdomains: [],
      seriesSubdomainRaw: [],
      chartOptionsSubdomain: {
        chart: {
          id: "subdomainChart",
          type: "pie",
          fontFamily: "Prompt, sans-serif",
        },
        noData: {
          text: "Loading...",
        },
        labels: [],
        tooltip: {
          y: { formatter: (val) => Number(val).toLocaleString() },
        },
        legend: { position: "bottom" },
        colors: ['#e6ba59', '#40A578', '#368ab6', '#ea7668', '#9ABF80', '#34495e', '#725CAD', '#F075AA', '#71C0BB'],
        dataLabels: {
          enabled: true,
        },
      },
      seriesObject: [],
      chartOptionsObject: {
        grid: { show: false },
        chart: {
          id: "objectChart",
          type: "bar",
          stacked: true,
          fontFamily: "Prompt, sans-serif",
        },
        noData: {
          text: "Loading...",
        },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: "13px",
          },
          formatter: (value) => this.formatCash(value),
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: "80%",
            borderRadius: 5,
            borderRadiusApplication: 'end'
          },
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
          labels: {
            show: true,
            align: "left",
            style: {
              fontSize: "13px",
              fontWeight: 400,
            },
          },
        },
        tooltip: {
          y: { formatter: (val) => Number(val).toLocaleString() },
        },
        colors: ["#53b993", "#368ab6", "#ea7668"],
      },
    };
  },

  computed: {
    ...mapGetters(["getClickDomainId", "getSdateDm", "getEdateDm", "getArrDate","getClickDomain"]),
    finalSeriesSubdomain() {
      if (this.subdomainChartType === "pie") {
        return this.seriesSubdomainRaw;
      } else {
        return [{ name: "จำนวนโพสต์", data: this.seriesSubdomainRaw }];
      }
    },
    finalChartOptionsSubdomain() {
      let baseOptions = {
        ...this.chartOptionsSubdomain,
        chart: {
          ...this.chartOptionsSubdomain.chart,
          type: this.subdomainChartType
        },
        xaxis: {
          ...this.chartOptionsSubdomain.xaxis,
          categories: this.subdomains.map((item) => item.name)
        },
        labels: this.subdomains.map((item) => item.name)
      };

      if (this.subdomainChartType === "bar") {
        return {
          ...baseOptions,
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "50px",
              dataLabels: { position: "top" }
            }
          },
          dataLabels: {
            enabled: true,
            formatter: (val) => val === 0 ? "" : this.formatCash(val),
            offsetY: -20,
            style: { colors: ["#555"] }
          }
        };
      } else {
        return baseOptions;
      }
    },
  },

  watch: {
    getArrDate() {
      this.loadCharts();
    },
    subdomain_idText(val) {
      this.loadObjectChart(val);
    },
  },

  mounted() {
    this.loadCharts();
  },

  methods: {
    formatCash(n) {
      if (n < 1e3) return n;
      if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
      if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
      if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
      if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
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
      try {
        // show loading
        this.chartOptionsSubdomain = {
          ...this.chartOptionsSubdomain,
          noData: { text: "Loading..." }
        };
        this.seriesSubdomainRaw = [];

        const res = await axios.get(
          `http://localhost:3000/api/v2/ranking/getSubdomainCount?domain_id=${this.getClickDomainId}&start=${start}&end=${end}`
        );
        this.subdomains = res.data.data;
        this.seriesSubdomainRaw = this.subdomains.map(item => item.count);

        this.chartOptionsSubdomain = {
          ...this.chartOptionsSubdomain,
          noData: { text: "" }
        };
      } catch (err) {
        console.error(err);
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
      try {
        this.chartOptionsObject = {
          ...this.chartOptionsObject,
          noData: { text: "Loading..." }
        };
        this.seriesObject = [];

        let url = `http://localhost:3000/api/v2/ranking/getObjectCount?domain_id=${this.getClickDomainId}&start=${start}&end=${end}&limit=10`;
        if (subdomainId) url += `&subdomain_id=${subdomainId}`;

        const res = await axios.get(url);
        const data = res.data.data;

        const categories = data.map(item => item.name);
        this.seriesObject = [
          { name: "Positive", data: data.map(item => item.positive) },
          { name: "Neutral", data: data.map(item => item.neutral) },
          { name: "Negative", data: data.map(item => item.negative) }
        ];
let _this =this
        this.chartOptionsObject = {
          ...this.chartOptionsObject,
          chart: {
            ...this.chartOptionsObject.chart,
            events: {
              dataPointSelection: (event, chartContext, config) => {
                if (!data[config.dataPointIndex]) return;

                const selectedObjectId = data[config.dataPointIndex].object_id;
                const selectedSubdomainId = data[config.dataPointIndex].subdomain_id;
                let query = `?domain_id=${encodeURIComponent(_this.getClickDomainId)}&domain=${_this.getClickDomain}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;
                if (selectedSubdomainId) query += `&subdomain_id=${encodeURIComponent(selectedSubdomainId)}`;
                query += `&object_id=${encodeURIComponent(selectedObjectId)}`;

                const routeData = _this.$router.resolve({ name: "AllPost" });
                window.open(`${routeData.href}${query}`, "_blank");
              }
            }
          },
          xaxis: { ...this.chartOptionsObject.xaxis, categories },
          noData: { text: "" },
          dataLabels: {
            enabled: true,
            formatter: (val) => val === 0 ? "" : this.formatCash(val)
          }
        };
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>

<style>
h5 {
  margin-bottom: 15px;
}
</style>
