<template>
    <div id="chart" class="mt-3">
        <span class="box-domain">
            <b-row class="text-left">
                <b-col>
                    Total Posts
                </b-col>
                <b-col cols="auto">
                    วันที่ : {{ start }} - {{ end }}

                </b-col>
            </b-row>
            <b-row cols="12">
                <b-col cols="2" md="1" class="pr-0">
                    <div class="g-social">
                        <img src="@/assets/cfb.png" class="imgs" @click="exportSource('facebook')" />
                        <img src="@/assets/ctw.png" class="imgs" @click="exportSource('twitter')"/>
                        <img src="@/assets/cboard.png" class="imgs" @click="exportSource('pantip')"/>
                        <img src="@/assets/cn.png" class="imgs" @click="exportSource('news')"/>
                        <img src="@/assets/cyt.png" class="imgs" @click="exportSource('youtube')"/>
                        <img src="@/assets/cig.png" class="imgs" @click="exportSource('instagram')"/>
                        <img src="@/assets/Block.png" class="imgs" @click="exportSource('blockdit')"/>
                        <img src="@/assets/tt.png" class="imgs" @click="exportSource('tiktok')"/>
                        <img src="@/assets/ctd.png" class="imgs" @click="exportSource('threads')"/>
                    </div>
                </b-col>
                <b-col cols="10" class="pl-0">
                    <apexchart 
                    ref="myBarChart" id="chart-domain" type="bar" 
                    height="435" :options="chartOptions"
                        :series="series" style="width: 90%;"></apexchart>
                    <!-- {{ series }} -->
                </b-col>
            </b-row>
        </span>
    </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import moment from "moment";
import { debounce } from 'lodash';
//import axios from "axios";
export default {
    name: "App",
    components: {
        apexchart: VueApexCharts,
    },
    props: {
        start: {
            type: String
        },  
        end: {
            type: String
        }  
    },
    watch: {
        start() {
            this.scheduleChartUpdate();
        },
        end() {
            this.scheduleChartUpdate();
        },
        getArrDate: function () {
            this.updateChart();
        },
        getDateReport() {
            this.updateChart();
        },
    },
    created() {
        this.scheduleChartUpdate = debounce(this.updateChart, 100);
    },
    data() {
        // const today = moment();
        // const past7Days = moment().subtract(6, 'days'); // รวมวันนี้ = 7 วัน
        return {
            // valueDate: [past7Days.format('YYYY-MM-DD'), today.format('YYYY-MM-DD')],
            // start_date: "",
            // end_date: "",
            sourcelist: [
                "facebook",
                "twitter",
                "board",
                "news",
                "youtube",
                "instagram",
                "blockdit",
                "tiktok",
            ],
            countlist: [],
            range: "",
            series: [{
                data: []
            }]
            ,
            total: 0,
            chartOptions : {
                legend: {
                    show: false,
                },
                chart: {
                    type: "bar",
                    // height: 535,
                     fontFamily: "Prompt, FontAwesome, sans-serif",
                    toolbar: { show: false },
                },
                grid: {
                    xaxis: {
                        lines: {
                            show: false,
                        },
                    },
                    yaxis: {
                        lines: {
                            show: false,
                        },
                    },
                },

                plotOptions: {
                    bar: {
                        barHeight: "70px",
                        distributed: true,
                        horizontal: true,
                        dataLabels: {
                            position: "top",
                        },
                        borderRadius: 10,
                        // rangeBarOverlap: false,
                        // columnWidth: "10%",
                    },
                },
                colors: [
                    "#438afe",
                    "#595a5b",
                    "#521d85",
                    "#f1a839",
                    "#ef464a",
                    "#f97b3e",
                    "#336db6",
                    "#3f2e4c",
                    "#e75aa1",
                ],
                dataLabels: {
                    enabled: true,
                    textAnchor: "start",
                    style: {
                        colors: ["#000000"],
                        fontSize: "12.5px",   // <-- เพิ่มบรรทัดนี้เพื่อลดขนาดตัวอักษร
                        // fontWeight: "normal" // ถ้าต้องการปรับน้ำหนักตัวอักษรด้วย (optional)
                    },
                    //   formatter: function(val) {
                    //     return val.toLocaleString() + " posts";
                    //   },
                    formatter:this.formatDataLabel,
                    offsetX: 20,
                    dropShadow: {
                        enabled: false,
                    },
                },
                stroke: {
                    width: 1,
                    colors: ["#fff"],
                },
                xaxis: {
                    categories: [
                        "facebook",
                        "twitter",
                        "board",
                        "news",
                        "youtube",
                        "instagram",
                        "blockdit",
                        "tiktok",
                        "threads"
                    ],
                    labels: {
                        formatter: () => {
                            return "";
                        },
                    },
                    axisBorder: {
                        show: false,
                        color: "#78909C",
                    },
                    axisTicks: {
                        show: false,
                    },
                },
                yaxis: {
                    labels: {
                        show: false,
                        formatter: (value) => {
                            return value.toLocaleString();
                        },
                    },
                },
                title: {
                    text: "",
                    align: "center",
                    floating: true,
                },
                noData: {
                    text: "Loading...",
                },
                tooltip: {
                    theme: "light",
                    x: {
                        show: true,
                    },
                    y: {
                        formatter: (value) => {
                            return value.toLocaleString() + " posts";
                        },
                        title: {
                            formatter: function () {
                                return "";
                            },
                        },
                    },
                },
            },
        };
    },
    methods: {
        exportSource(source) {
            this.$emit('update-source',source )
        },
        formatDataLabel(val) {
            const data = this.series?.[0]?.data || [];
            const total = data.reduce((sum, num) => sum + num, 0);
            const percent = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
            return `${val.toLocaleString()} posts\n (${percent}%)`;
        },
        async updateChart() {
            if (!this.start || !this.end) return;

            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/monitor/getTotalPostsHashtag/",
                params: {
                uid: "#" + this.$route.query.uid,
                start: this.start + "T00:00:00",
                end: this.end + "T23:59:59"
                },
                headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
                },
            };

            try {
                const response = await this.axios(config);
                const data = response.data;
                if (!Array.isArray(data)) {
                console.error("API response is not an array:", data);
                return;
                }

                // สร้าง object เก็บ count ตาม source
                const countMap = {};
                data.forEach(item => {
                countMap[item.source] = item.count;
                });

                // ใช้ categories จาก chartOptions เป็นตัวกำหนดลำดับ
                const orderedCounts = this.chartOptions.xaxis.categories.map(source => countMap[source] || 0);

                this.series = [{ data: orderedCounts }];
                this.chartOptions = {
                ...this.chartOptions,
                dataLabels: {
                    ...this.chartOptions.dataLabels,
                    formatter: this.formatDataLabel
                }
                };

                this.total = orderedCounts.reduce((sum, val) => sum + val, 0);
            } catch (error) {
                console.error(error);
            }
        },
    },
    mounted() {
        this.updateChart();
    }
};
</script>
<style scoped>
.box-domain {
    width: 100%;
    height: auto;
    padding: 20px 20px 0px;
    border-radius: 7px;
    box-shadow: 0 4px 7px 0 rgb(0 0 0 / 20%);
    display: block;
}

.col-10 {
    right: 43px;
}

.g-social {
    margin-top: 35px;
}

.imgs {
    width: 28px;
    display: block;
    margin-bottom: 13px;
    cursor: pointer;
}

@media only screen and (min-width: 0px) and (max-width: 1220px) {
    .col-10 {
        right: 23px !important;
    }
}

@media only screen and (min-width: 0px) and (max-width: 991px) {
    .col-2 {
        text-align: -webkit-right;
    }
}

@media only screen and (min-width: 0px) and (max-width: 750px) {}
</style>
