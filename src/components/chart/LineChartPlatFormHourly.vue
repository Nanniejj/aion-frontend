<template>
  <div id="chart" class="mt-3">
    <!-- {{ series }} -->
    <apexchart id="chart-domain" type="line" height="400" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { mapGetters } from "vuex";
import moment from "moment";
import 'moment/locale/th'; // ✅ ให้ moment ใช้ภาษาไทย
// import { param } from "jquery";

export default {
  name: "App",
  components: {
    apexchart: VueApexCharts,
  },
  watch: {
    getArrDate: function () {
    //   const e = moment(new Date()).format('YYYY-MM-DD'); // ✅ กันปัญหา timezone
    // //   if (
    // //     this.getSdateDm.slice(0, 10) == e &&
    // //     this.getEdateDm.slice(0, 10) == e
    // //   ) {
    // //     this.startChart();
    // //   } else {
    // //     this.updateChart();
    //       //   }
        this.startChart();
    //   this.val = 0;
    },
  },
  data() {
    return {
      colorp: [],
      val: 0,
      range: "",
      series: [],
      chartOptions: {
        chart: {
          type: "line",
          fontFamily: "Prompt, FontAwesome, sans-serif",
        },
        dataLabels: {
          enabled: true,
        },
        series: [],
        title: {
          text: "จำนวนโพสต์รายชั่วโมง",
        },
        noData: {
          text: "Loading...",
        },
      },
    };
  },
  computed: {
    ...mapGetters([
      "getClickDomain",
      "getSdateDm",
      "getEdateDm",
      "getArrDate",
      "getNamePlatform",
      "getDomainArr",
    ]),
    getSeries: function () {
      return [
        {
          name: "จำนวนโพสต์",
          data: [],
        },
      ];
    },
  },
  methods: {
    formatDateTH(dateStr) {
      const m = moment(dateStr).locale('th');
      const buddhistYear = m.year() + 543;       // ปี พ.ศ. เต็ม เช่น 2568
      const buddhistYearShort = buddhistYear % 100; // 68

      return m.format('D MMM ') + buddhistYearShort;
    },

    async updateChart() {
      this.series = [];
      let sdate = "", edate = "";
      if (this.getSdateDm || this.getEdateDm) {
        sdate = "&start_date=" + this.getSdateDm;
        edate = "&end_date=" + this.getEdateDm;
      }

      const config = {
        method: "get",
        url:
          "https://api2.cognizata.com/api/v2/platform/getChartDataPlatformHourly?source=" +
          this.getNamePlatform +
          sdate +
          edate,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };

      await this.axios(config).then((response) => {
        const _this = this;

        // ✅ สร้างช่วงวันด้วยคีย์แบบ YYYY-MM-DD เสถียรกว่า slice(0,10)
        const getDaysArray = function (s, e) {
          for (var a = [], d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
            a.push({
              date: moment(d).format('YYYY-MM-DD'), // ✅
              count: _this.val,
            });
          }
          return a;
        };

        const daylist = getDaysArray(
          new Date(this.getSdateDm),
          new Date(this.getEdateDm)
        );

        const data = response.data;
        const array3 = [...daylist, ...data];

        // รวมและ dedupe ตาม key = date
        const distinctItems = [
          ...new Map(array3.map((item) => [item["date"], item])).values(),
        ]
          .sort((a, b) => a.date.localeCompare(b.date)); // ✅ เผื่อคิวเรียงวัน

        const datelist = distinctItems.map((item) => item.date);     // YYYY-MM-DD (ภายใน)
        const datelistTH = datelist.map(d => this.formatDateTH(d));  // ✅ สำหรับแสดงผล
        const countlist = distinctItems.map((item) => item.count);

        // ✅ แสดงช่วงวันที่เป็นไทย
        this.range = `${datelistTH[0]} - ${datelistTH[datelistTH.length - 1]}`;

        this.series = [
          { name: "จำนวนโพสต์", data: countlist },
        ];

        this.chartOptions = {
          title: {
            text: "จำนวนโพสต์รายชั่วโมง วันที่ " + this.sdate, // ✅ ไทยแล้ว
            align: "left",
            fontFamily: "Prompt",
          },
          xaxis: {
            categories: datelistTH, // ✅ ใช้วันที่ไทยบนแกน X
          },
        };
      });
    },

    async startChart() {
        const currentTime = new Date();
        currentTime.setDate(currentTime.getDate() - 14);

        let sdate = "", edate = "";
        if (this.getSdateDm || this.getEdateDm) {
            sdate = "&start_date=" + this.getSdateDm;
            edate = "&end_date=" + this.getEdateDm;
        }

        try {
            const config = {
            method: "get",
            url:
                "https://api2.cognizata.com/api/v2/platform/getChartDataPlatformHourly?source=" +
                this.getNamePlatform +
                sdate +
                edate,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            };

            // console.log("config === ", config);

            const response = await this.axios(config);
            const data = response.data.data;

            // console.log("hourly response === ", data);

            // ⏱ เวลาทั้งหมด เช่น ["00:00", "01:00", ...]
            const timeList = data.map(item => item.time);

            // 📊 ค่าจำนวนโพสต์ เช่น [694, 716, ...]
            const countList = data.map(item => item.count);
            // console.log("countList ==== ", countList);

            // 🕒 แสดงช่วงเวลา
            this.range = "ข้อมูลรายชั่วโมง";

            // 📈 Series ของ ApexChart
            this.series = [
            { name: "จำนวนโพสต์", data: countList },
            ];
            // console.log("series ==== ", this.series);
            
            // 🎨 กำหนดสี platform
            if (this.getNamePlatform == "twitter") {
            this.colorp = ["#919495"];
            } else if (this.getNamePlatform == "facebook") {
            this.colorp = ["#4c77bb"];
            } else if (this.getNamePlatform == "pantip") {
            this.colorp = ["#532d84"];
            } else if (this.getNamePlatform == "youtube") {
            this.colorp = ["#e24246"];
            } else if (this.getNamePlatform == "news") {
            this.colorp = ["#fdd072"];
            } else if (this.getNamePlatform == "instagram") {
            this.colorp = ["#ff9773"];
            } else if (this.getNamePlatform == "blockdit") {
            this.colorp = ["#396eb6"];
            } else if (this.getNamePlatform == "threads") {
            this.colorp = ["#e75aa1"];
            } else {
            this.colorp = ["#1f0043"];
            }

            // ⚙ ตั้งค่า Chart
            this.chartOptions = {
                yaxis: {
                    labels: {
                    formatter: (value) => value.toLocaleString(),
                    },
                },
                chart: {
                    fontFamily: "Prompt, FontAwesome, sans-serif",
                    type: "line",
                    zoom: { enabled: true },
                    dropShadow: {
                    enabled: true,
                    color: "#000",
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2,
                    },
                },
                colors: this.colorp,
                dataLabels: {
                    enabled: true,
                    style: { colors: ["#4c412b"] },
                    formatter: (value) => value.toLocaleString(),
                },
                stroke: { curve: "smooth" },
                title: {
                    text: "จำนวนโพสต์รายชั่วโมง วันที่ "+ this.formatDateTH(this.getArrDate[0]), // ✅ ไทยแล้ว
                    align: "left",
                    fontFamily: "Prompt",
                },
                markers: { size: 1 },
                grid: {
                    row: { colors: ["#ffffff", "transparent"], opacity: 0.5 },
                    padding: { left: 30 },
                },
                xaxis: {
                    categories: timeList, // ⬅ ใช้เวลาจาก API โดยตรง
                },
            };

        } catch (error) {
            console.error("Error fetching chart data:", error);
            // this.$toast.error("ไม่สามารถดึงข้อมูลกราฟได้ในขณะนี้ กรุณาลองใหม่ภายหลัง");
        }
    }

  },
//   created: async function () {
//     this.startChart();
//  },
    mounted() {
        this.startChart();  
    }   
};
</script>
