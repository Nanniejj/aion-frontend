<template>
  <div id="chart">
    <div class="text-left mt-1 mb-2">
      <i class="fa fa-calendar" /> {{ range }}
    </div>
    <apexchart
      id="chart-domain"
      type="line"
      height="600"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { mapGetters } from "vuex";
import moment from "moment";
import 'moment/locale/th'; // ✅ ใช้ locale ไทย

export default {
  name: "App",
  components: {
    apexchart: VueApexCharts,
  },
  watch: {
    getDataTrend() {
      this.series = [];
      this.startChart();
    },
  },
  data() {
    return {
      val: 0,
      range: "",
      series: [],
      chartOptions: {
        chart: {
          type: "line",
          fontFamily: "Prompt, FontAwesome, sans-serif",
        },
        series: [],
        title: { text: "จำนวนโพสต์ในแต่ละวัน" },
        noData: { text: "Loading..." },
        legend: { position: "top", horizontalAlign: "left" },
      },
      stroke: { curve: "smooth", width: 3 },
    };
  },
  computed: {
    ...mapGetters([
      "getArrDate",
      "getRanking",
      "getDataTrend",
      "getWordCloudStartDate",
      "getWordCloudEndDate",
      "getArrDateRank",
    ]),
    getSeries() {
      return [{ name: "จำนวนโพสต์", data: [] }];
    },
  },
  methods: {
    // ✅ แปลงวันที่เป็นไทยแบบ "D MMM YY" โดยคำนวณ พ.ศ. เอง
    formatDateTH(dateStr) {
      const m = moment(dateStr).locale('th');
      const buddhistYearShort = (m.year() + 543) % 100;
      return m.format('D MMM ') + buddhistYearShort; // 9 ก.ย. 68
    },

    async updateChart() {
      this.series = [];

      // ✅ สร้าง list วันแบบคงที่ (YYYY-MM-DD)
      const getDaysArray = (s, e) => {
        const a = [];
        const d = new Date(s);
        const end = new Date(e);
        while (d <= end) {
          a.push({ date: moment(d).format('YYYY-MM-DD'), count: 0 }); // ✅
          d.setDate(d.getDate() + 1);
        }
        return a;
      };

      const daylist = getDaysArray(
        new Date(this.getWordCloudStartDate),
        new Date(this.getWordCloudEndDate)
      );

      const results = daylist.map((k) => k);

      // sum แต่ละ series เพื่อนำมา sort
      let data1 = [];
      if (this.getDataTrend) {
        data1 = this.getDataTrend.map((item) => {
          const sum = item.y.reduce((a, b) => a + b, 0);
          return { x: item.x, sumy: sum, data: item.y, name: item.label };
        });
      }

      data1.sort((a, b) => b.sumy - a.sumy);
      data1 = data1.map((item) => ({ data: item.data, name: item.name, date: item.x }));

      const datelist = results.map((item) => item.date);           // YYYY-MM-DD
      const datelistTH = datelist.map(d => this.formatDateTH(d));  // ✅ แสดงผลไทย

      this.range = `${datelistTH[0]} - ${datelistTH[datelistTH.length - 1]}`; // ✅ ไทย

      this.series = data1.slice(0, 10);

      this.chartOptions = {
        title: { text: "จำนวนโพสต์", fontFamily: "Prompt" },
        noData: { text: "Loading..." },
        markers: { size: 5, colors: undefined },
        xaxis: {
          categories: datelistTH, // ✅ ใช้วันที่ไทยบนแกน X
        },
        legend: { position: "top", horizontalAlign: "left" },
        colors: [
          "#feb019","#775dd0","#ff4560","#fb7db7","#f97c40",
          "#008ffb","#00c1fb","#1EAE98","#0f9a27","#8CBA51",
        ],
        stroke: { curve: "smooth", width: 3 },
      };
    },

    async startChart() {
      this.series = [];
      const currentTime = new Date();
      currentTime.setDate(currentTime.getDate() - 6);

      const getDaysArrays = (s, e) => {
        const a = [];
        const d = new Date(s);
        const end = new Date(e);
        while (d <= end) {
          a.push({ date: moment(d).format('YYYY-MM-DD'), data: 0 }); // ✅
          d.setDate(d.getDate() + 1);
        }
        return a;
      };

      let daylist;
      if (this.getArrDateRank) {
        daylist = getDaysArrays(
          new Date(this.getWordCloudStartDate),
          new Date(this.getWordCloudEndDate)
        );
      } else {
        const de = moment(new Date()).format('YYYY-MM-DD'); // ✅
        const ds = moment(currentTime).format('YYYY-MM-DD'); // ✅
        daylist = getDaysArrays(new Date(ds), new Date(de));
      }

      const results = daylist.map((k) => k);

      // sum และจัดอันดับ series
      let data1 = this.getDataTrend.map((item) => {
        const sum = item.y.reduce((a, b) => a + b, 0);
        return { x: item.x, sumy: sum, data: item.y, name: item.label };
      });

      data1.sort((a, b) => b.sumy - a.sumy);
      data1 = data1.map((item) => ({ data: item.data, name: item.name, date: item.x }));

      const datelist = results.map((item) => item.date);          // YYYY-MM-DD
      const datelistTH = datelist.map(d => this.formatDateTH(d)); // ✅ ไทย

      this.range = `${datelistTH[0]} - ${datelistTH[datelistTH.length - 1]}`; // ✅ ไทย

      this.series = data1.slice(0, 10);

      this.chartOptions = {
        yaxis: {
          labels: { formatter: (value) => value },
        },
        chart: {
          fontFamily: "Prompt, FontAwesome, sans-serif",
          type: "line",
          zoom: { enabled: false },
          dropShadow: {
            enabled: true, color: "#000", top: 18, left: 7, blur: 10, opacity: 0.2,
          },
        },
        legend: { position: "top", horizontalAlign: "left" },
        colors: [
          "#feb019","#775dd0","#ff4560","#fb7db7","#f97c40",
          "#008ffb","#00c1fb","#1EAE98","#0f9a27","#8CBA51",
        ],
        stroke: { curve: "smooth", width: 3 },
        noData: { text: "Loading..." },
        title: {
          text: "จำนวนโพสต์ ",
          align: "left",
          fontFamily: "Prompt",
        },
        markers: { size: 5, colors: undefined },
        grid: {
          row: { colors: ["#ffffff", "transparent"], opacity: 0.5 },
          padding: { left: 30 },
        },
        xaxis: {
          categories: datelistTH, // ✅ ใช้วันที่ไทยบนแกน X
        },
      };
    },
  },
  created() {
    this.startChart();
  },
  destroyed() {
    this.$store.commit("setDataTrend", []);
  },
};
</script>
