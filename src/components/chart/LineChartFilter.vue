<template>
  <div id="chart" class="mt-3">
    <!-- {{ series }}{{ typeChart }}{{ label }} -->
    <apexchart id="chart-domain" type="line" height="400" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { mapGetters } from "vuex";
import moment from "moment";
import 'moment/locale/th';

export default {
  components: { apexchart: VueApexCharts },
  computed: {
    ...mapGetters(["getClickDomain", "getSdateDm", "getEdateDm", "getArrDate", "getClickDomainId", "getSourceNews"]),
  },
  props: {
    typeChart: { type: String },
    label: { type: String },
  },
  watch: {
    getArrDate(val) {
      this.apiFilterChart();
      this.valdate = 0;
      const startTH = this.formatDateTH(val[0]);
      const endTH = this.formatDateTH(val[1]);
      this.range = `${startTH} - ${endTH}`;
    },
    typeChart() { this.apiFilterChart(); },
    label() { this.apiFilterChart(); },
    getSourceNews() { this.apiFilterChart(); },
  },
  data() {
    return {
      valdate: 0,
      range: "",
      sentiment: [],
      source: [],
      series: [],
      chartOptions: {
        chart: {
          type: "line",
          fontFamily: "Prompt, FontAwesome, sans-serif",
        },
        colors: [],
        dataLabels: { enabled: true },
        series: [],
        title: { text: "จำนวนโพสต์ในแต่ละวัน" },
        noData: { text: "Loading..." },
        stroke: { curve: "smooth", width: 3 },
        markers: { size: 5 },
      },
    };
  },
  methods: {
    formatDateTH(dateStr) {
      const m = moment(dateStr).locale('th');
      const buddhistYear = m.year() + 543;
      const buddhistYearShort = buddhistYear % 100;
      return m.format('D MMM ') + buddhistYearShort;
    },

    formatCash(n) {
      if (n < 1e3) return n;
      if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
      if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
      if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
      if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
    },

    getYText() {
      if (this.label == "posts") return "จำนวนโพสต์";
      if (this.label == "engages") return "จำนวน engagement";
      if (this.label == "comments") return "จำนวน comments";
      return "จำนวน messages";
    },

    // ====== DOMAIN ======
    domainFilter(dataAll) {
      let data = dataAll;
      let datelist = data.map((item) => item.date);
      let datelistTH = datelist.map(d => this.formatDateTH(d));
      let countlist = data.map((item) => item.count);
      let top3 = data.map((item) => item.TopHashtags);

      this.range = `${datelistTH[0]} - ${datelistTH[datelistTH.length - 1]}`;
      this.series = [{ name: "จำนวนโพสต์", data: countlist }];

      const ytext = this.getYText();

      this.chartOptions = {
        chart: {
          type: "line",
          fontFamily: "Prompt, FontAwesome, sans-serif",
        },
        yaxis: {
          labels: { formatter: (value) => Number(value).toLocaleString() },
        },
        title: {
          text: `${ytext} วันที่ ${this.range}`,
          align: "left",
          fontFamily: "Prompt",
        },
        xaxis: {
          categories: datelistTH,
        },
        tooltip: {
          custom: ({ series, seriesIndex, dataPointIndex, w }) => {
            let tophash, valpost, a, b, c, f;
            valpost = series[seriesIndex][dataPointIndex];
            if (top3[dataPointIndex]) {
              tophash = top3[dataPointIndex];
              a = tophash[0] ? "1. " + tophash[0] + "<br>" : "";
              b = tophash[1] ? "2. " + tophash[1] + "<br>" : "";
              c = tophash[2] ? "3. " + tophash[2] + "<br>" : "";
              f = a + b + c;
            } else {
              f = " ไม่พบ";
            }
            return (
              '<div class="arrow_box m-2 p-1">' +
              "<div>" +
              w.globals.categoryLabels[dataPointIndex] +
              "<hr class='p-1 m-1'/>" +
              "</div>" +
              "<span>" +
              ytext +
              " : " +
              "<b>" +
              Number(valpost).toLocaleString() +
              "</b>" +
              "</span>" +
              "<div>" +
              "<b>#Top3</b><br>" +
              f +
              "</div>" +
              "</div>"
            );
          },
        },
        colors: ["#fed16e"],
        dataLabels: {
          enabled: true,
          style: { fontSize: "14px", colors: ["#4c412b"] },
          formatter: (value) => this.formatCash(value),
        },
        stroke: { curve: "smooth" },
        markers: { size: 5 },
      };
    },

    // ====== SOURCE / PLATFORM ======
    sourceFilter(data) {
      let datearr = data[0].x || [];
      let datearrTH = datearr.map(d => this.formatDateTH(d));

      this.series = [...data].map((x) => ({ name: x.source, data: x.y }));

      const ytext = this.getYText();

      this.chartOptions = {
        chart: {
          fontFamily: "Prompt, FontAwesome, sans-serif",
          type: "line",
          zoom: { enabled: true },
          dropShadow: {
            enabled: true, color: "#000", top: 18, left: 7, blur: 10, opacity: 0.2,
          },
        },
        title: {
          text: `${ytext} วันที่ ${this.range}`,
          align: "left",
          fontFamily: "Prompt",
        },
        colors: ["#e75aa1", "#eb363a", "#8050be", "#438afe", "#e18457", "#543b66", "#336db6", "#919495", "#ef9a1a", "#2DA5E1"],
        dataLabels: { enabled: false },
        grid: {
          row: { colors: ["#ffffff", "transparent"], opacity: 0.5 },
          padding: { left: 30 },
        },
        xaxis: {
          categories: datearrTH,
        },
        tooltip: {
          custom: undefined, // ✅ reset custom tooltip จาก domainFilter
          enabled: true,
          shared: true,
          followCursor: false,
          intersect: false,
          inverseOrder: false,
          y: { formatter: (value) => Number(value).toLocaleString() },
        },
        stroke: { curve: "smooth", width: 3 },
        markers: { size: 5 },
      };
    },

    // ====== SENTIMENT ======
    sentimentFilter(data) {
      const sentimentColors = {
        positive: "#3cb185",
        neutral: "#1b678f",
        negative: "#d94b39",
      };

      this.series = [...data].map((x) => {
        x.stm = x.sentiment == 1 ? "positive" : x.sentiment == 0 ? "neutral" : "negative";
        return { name: x.stm, data: x.y };
      });

      let datearr = data[0].x || [];
      let datearrTH = datearr.map(d => this.formatDateTH(d));

      const ytext = this.getYText();

      this.chartOptions = {
        chart: {
          fontFamily: "Prompt, FontAwesome, sans-serif",
          type: "line",
          zoom: { enabled: true },
          dropShadow: {
            enabled: true, color: "#000", top: 18, left: 7, blur: 10, opacity: 0.2,
          },
        },
        title: {
          text: `${ytext} วันที่ ${this.range}`,
          align: "left",
          fontFamily: "Prompt",
        },
        yaxis: {
          labels: { formatter: (value) => Number(value).toLocaleString() },
        },
        colors: this.series.map((s) => sentimentColors[s.name]),
        dataLabels: {
          enabled: true,
          formatter: (value) => this.formatCash(value),
        },
        grid: {
          row: { colors: ["#ffffff", "transparent"], opacity: 0.5 },
          padding: { left: 30 },
        },
        xaxis: {
          categories: datearrTH,
        },
        tooltip: {
          custom: undefined, // ✅ reset custom tooltip จาก domainFilter
          enabled: true,
          shared: true,
          followCursor: false,
          intersect: false,
          inverseOrder: false,
          y: { formatter: (value) => Number(value).toLocaleString() },
        },
        stroke: { curve: "smooth", width: 3 },
        markers: { size: 5 },
      };
    },

    apiFilterChart(start) {
      if (this.series.length !== 0) this.series = [];
      var axios = require("axios");
      let sdate, edate, label;
      if (this.getSdateDm || this.getEdateDm) {
        sdate = "&start=" + this.getSdateDm;
        edate = "&end=" + this.getEdateDm;
      } else {
        sdate = "";
        edate = "";
      }
      if (start == "start") { sdate = ""; edate = ""; }
      label = this.label ? "&label=" + this.label : "";
let source_news = this.getSourceNews ? "&source_news=" + this.getSourceNews : "";
      var config = {
        method: "get",
        url:
          "https://api2.cognizata.com/api/v2/userposts/getChartDomainFilter?domain_id=" +
          this.getClickDomainId + sdate + edate + label + source_news,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      axios(config)
        .then((response) => {
          this.sentiment = response.data[0].sentiment;

          const order = ["threads", "youtube", "pantip", "blockdit", "instagram", "tiktok", "facebook", "twitter", "news", "telegram"];
          let rel2 = response.data[0].source.result2.sort(
            (a, b) => order.indexOf(a.source) - order.indexOf(b.source)
          );
          this.source = rel2;

          if (this.typeChart == "platform") this.sourceFilter(rel2);
          else if (this.typeChart == "sentiment") this.sentimentFilter(response.data[0].sentiment);
          else this.domainFilter(response.data[0].data);
        })
        .catch((error) => { console.log(error); });
    },
  },

  mounted() {
    this.apiFilterChart("start");
  },
};
</script>

<style></style>