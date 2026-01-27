<template>
    <b-container fluid>
        <b-col cols="auto" class="text-left h5 bold px-0">ภาพรวม</b-col>
        <!-- <b-row class="mx-0 mb-3"> -->
        <!-- </b-row> -->
        <b-row class="px-0">
            <b-col md="6" class="mt-2 ">
                <b-row class="mx-0 justify-content-between align-items-center">
                    <div class="text-left h6">หัวเรื่อง <span class="small">(Domain)</span></div>
                </b-row>
                <b-row class="m-0">
                    <b-col cols="auto" class="px-0">
                        <b-button-group v-if="mode == 'post'" class="mb-2">
                            <b-button :variant="domainPostChart === 'polar' ? 'info' : 'outline-info'"
                                @click="domainPostChart = 'polar'" size="sm">
                                <i class="fa fa-pie-chart" aria-hidden="true"></i>
                            </b-button>
                            <b-button :variant="domainPostChart === 'bar' ? 'info' : 'outline-info'"
                                @click="domainPostChart = 'bar'" size="sm">
                                <i class="fa fa-chart-bar" aria-hidden="true"></i>
                            </b-button>
                        </b-button-group>
                    </b-col>
                    <b-col class="px-0 text-right">
                        <b-button-group class="mb-2 mx-1">
                            <button v-for="m in modes" :key="m.value" class="btn btn-sm"
                                :class="mode === m.value ? 'btn-info' : 'btn-outline-info'" @click="mode = m.value">
                                {{ m.label }}
                            </button>
                        </b-button-group>
                    </b-col>
                </b-row>
                <apexchart :key="domainPostChart + mode" :type="domainChartType" height="420" :options="chartOptions"
                    :series="chartSeries" />
            </b-col>
            <b-col md="6" class="mt-2 ">
                <!-- <div class="text-left ml-2 h5">Subdomain Statistics <span class="small">(posts)</span></div> -->
                <div class="text-left h6">Top 10 หมวดหมู่ <span class="small">(Subdomain)</span></div>
                <b-row class="m-0">
                    <b-col class="px-0">
                        <div v-if="sublabelType === 'posts'">
                            <!-- <b-form-select v-model="subdomainChartType" class="mb-3" size="sm" :options="[
                { value: 'pie', text: 'Pie Chart' },
                { value: 'bar', text: 'Bar Chart' }
              ]" /> -->

                            <div class="text-left">
                                <b-button-group class="mb-2">
                                    <b-button :variant="subdomainChartType === 'pie' ? 'info' : 'outline-info'"
                                        @click="subdomainChartType = 'pie'" size="sm">
                                        <i class="fa fa-pie-chart" aria-hidden="true"></i>
                                    </b-button>
                                    <b-button :variant="subdomainChartType === 'bar' ? 'info' : 'outline-info'"
                                        @click="subdomainChartType = 'bar'" size="sm">
                                        <i class="fa fa-chart-bar" aria-hidden="true"></i>
                                    </b-button>
                                </b-button-group>
                            </div>
                        </div>
                    </b-col>
                    <b-col class="px-0">
                        <div class="text-right">
                            <b-button-group class="mx-1">
                                <b-button :variant="sublabelType === 'posts' ? 'info' : 'outline-info'"
                                    @click="sublabelType = 'posts'" size="sm">posts</b-button>
                                <b-button :variant="sublabelType === 'sentiment' ? 'info' : 'outline-info'"
                                    @click="sublabelType = 'sentiment'" size="sm">sentiment</b-button>
                                <b-button :variant="sublabelType === 'platform' ? 'info' : 'outline-info'"
                                    @click="sublabelType = 'platform'" size="sm">platform</b-button>
                            </b-button-group>
                        </div>
                    </b-col>
                </b-row>

                <!-- <b-form-select v-model="subdomainChartType" class="mb-3" :options="[
          { value: 'pie', text: 'Pie Chart' },
          { value: 'bar', text: 'Bar Chart' }
        ]" /> -->
                <apexchart :type="subdomainChartType" height="420" :options="finalChartOptionsSubdomain"
                    :series="finalSeriesSubdomain" />
            </b-col>
            <b-col md="12" class="mt-2">
                <!-- <div class="text-left ml-2 h5 mt-3 mt-md-0">Top 10 Objects <span class="small">(posts)</span></div> -->
                <div class="text-left h6 mt-3 mt-md-0">Top 10 ประเด็น <span class="small">(Objects)</span></div>
                <b-row class="justify-content-between m-0">
                    <!-- {{ subdomains }} -->
                    <b-col md="6" class="px-0"> 
                        <v-select class="mb-3 w-100 se-subdomain" :options="subdomains" v-model="subdomain_idText"
                            label="name" :reduce="s => s.subdomain_id" multiple placeholder="เลือกหมวดหมู่" /></b-col>
                    <b-col md="auto" class="px-0">
                        <div class="text-center">
                            <b-button-group class="w-100">
                                <b-button :variant="labelType === 'posts' ? 'info' : 'outline-info'"
                                    @click="labelType = 'posts'" size="sm">posts</b-button>
                                <b-button :variant="labelType === 'sentiment' ? 'info' : 'outline-info'"
                                    @click="labelType = 'sentiment'" size="sm">sentiment</b-button>
                                <b-button :variant="labelType === 'platform' ? 'info' : 'outline-info'"
                                    @click="labelType = 'platform'" size="sm">platform</b-button>
                            </b-button-group>
                        </div>
                    </b-col>
                </b-row>

                <apexchart :key="chartKey" type="bar" :height="400" :options="finalChartOptionsObject"
                    :series="finalSeriesObject" />
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
    props: {
        domainId: {
            type: [Number, String],
            required: true
        },
        subdomainId: {
            type: [Array, Number, String],
            default: null
        },
        source: {
            type: [Array, Number, String],
            default: null
        },
        start: {
            type: String,
            required: true
        },
        end: {
            type: String,
            required: true
        },
        domainName: {        // (ถ้าใช้เปิดหน้า AllPost)
            type: String,
            default: ""
        },
        dataVersion: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            chartKey: 0,
            subdomainChartType: "pie",
            subdomain_idText: '',
            subdomains: [],
            objectRawData: [],
            domainPostChart: 'polar',
            mode: "post", // platform | post | sentiment
            modes: [
                { value: "post", label: "Post" },
                { value: "sentiment", label: "Sentiment" },
                { value: "platform", label: "Platform" }
            ],
            chartOptions: {
                grid: { show: false },
                chart: {
                    toolbar: {
                        show: false
                    },
                    id: "domainChart",
                    type: "polarArea",
                    events: {
                        dataPointSelection: this.onDomainBarClick
                    },
                    stacked: false,
                    fontFamily: "Prompt, sans-serif",
                },
                // xaxis: {
                //     categories: [],
                //     labels: {
                //         show: false // ซ่อน label แกน x ที่นี่เลย
                //     }
                // },
                noData: {
                    text: "Loading...",
                },
                
            },
            chartSeries: [],
            domainRawData: [],
            labelType: "sentiment",
            sublabelType: "posts",
            seriesSubdomainRaw: [],
            seriesSubdomainSentiment: [],
            seriesSubdomainPlatform: [],
            chartOptionsSubdomain: {
                grid: { show: false },
                chart: {
                    id: "subdomainChart",
                    type: "pie",
                    fontFamily: "Prompt, sans-serif",
                    toolbar: {
                        show: false
                    },

                },
                noData: {
                    text: "Loading...",
                },

                labels: [],
                tooltip: {
                    y: { formatter: (val) => Number(val).toLocaleString() },
                },
                legend: { position: "bottom" },
                colors: ['#e6ba59', '#40A578', '#725CAD', '#F075AA', '#368ab6', '#ea7668', '#9ABF80', '#71C0BB', '#34495e',],
                dataLabels: {
                    enabled: true,
                },
                xaxis: {
                    categories: [],
                    labels: {
                        show: false // ซ่อน label แกน x ที่นี่เลย
                    }
                },

            },
            seriesObject: [],
            chartOptionsObject: {
                grid: { show: false },
                chart: {
                    toolbar: {
                        show: false
                    },
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
                        borderRadiusApplication: 'end',
                        dataLabels: {
                            style: {
                                fontSize: "13px",
                            },
                            total: { enabled: true },
                        },
                    },
                },
                xaxis: {
                    categories: [],
                    labels: {
                        show: false // ซ่อน label แกน x ที่นี่เลย
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        align: "right",
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
                responsive: [
                    {
                        breakpoint: 768, // tablet / mobile 
                        options: {
                            xaxis: {
                                labels: {
                                    rotate: -45, // 📱 เอียงเฉียง 
                                    rotateAlways: true,
                                    style: { fontSize: "11px" }
                                }
                            }
                        }
                    }
                ]
            },
        };
    },

    computed: {
        domainChartType() {
            return (
                this.chartOptions &&
                this.chartOptions.chart &&
                this.chartOptions.chart.type
            ) || 'bar'
        },
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

            const start = this.start + 'T00:00:00' || startDefault;
            const end = this.end + 'T23:59:59' || endDefault;
            const labels = this.subdomains.map(item => {
                const label = item.name || '';
                return label.length > 20 ? label.slice(0, 20) + '...' : label;
            })

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
                            let query = `?domain_id=${clickedSubdomain.domain_id}&domain=${clickedSubdomain.domain_name}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;
                            query += `&subdomain_id=${selectedSubdomainId}`;
                            const routeData = this.$router.resolve({ name: "AllPost" });
                            window.open(`${routeData.href}${query}`, "_blank");
                        }
                    }
                },
                xaxis: {
                    categories: labels,
                    labels: {
                        show: false // ซ่อน label แกน x ที่นี่เลย
                    }

                },
                labels,
                noData: { text: "Loading..." },
                dataLabels: {
                    enabled: true,
                    formatter: val => val === 0 ? "" : this.formatCash(val),
                    // offsetY: -20,
                    style: { colors: ["#fff"] }
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        columnWidth: "80%",
                        // dataLabels: { position: "top" },
                        borderRadius: 5,
                        borderRadiusApplication: 'end',
                    }
                }
            };

            if (this.sublabelType === "sentiment") {
                return {
                    ...baseOptions,
                    colors: ["#53b993", "#368ab6", "#ea7668"]
                };
            } else if (this.sublabelType === "platform") {
                const platformColorMap = {
                    facebook: "#4c77bb", x: "#727373", instagram: "#dc7848",
                    pantip: "#9959eb", youtube: "#e24246", news: "#f3b557",
                    tiktok: "#5c4d67", blockdit: "#1F76BD", threads: "#e75aa1"
                };
                const colors = this.seriesSubdomainPlatform.map(s => platformColorMap[s.name] || "#fff");
                return {
                    ...baseOptions,
                    colors
                };
            } else if (this.sublabelType === "posts" && this.subdomainChartType === "pie") {
                return {
                    ...baseOptions,
                    chart: {
                        ...baseOptions.chart,
                        type: "pie",
                        stacked: false
                    },
                    dataLabels: { enabled: true },
                };
            } else if (this.sublabelType === "posts" && this.subdomainChartType === "bar") {
                return {
                    ...baseOptions,
                    plotOptions: {
                            bar: {
                                horizontal: true,
                                distributed: true,
                                // barHeight: this.domainRawData.length > 6
                                //     ? "80%"
                                //     : `${this.domainRawData.length * 10}%`,
                                // borderRadius: 5,
                                // borderRadiusApplication: "end"
                            }
                        },
                    // colors: ["#3dabbc"], // เพิ่มบรรทัดนี้สำหรับสีฟ้า
                };
            } else {
                return baseOptions;
            }

        },
        finalSeriesObject() {
            const data = this.objectRawData || []

            if (this.labelType === "posts") {
                return [
                    { name: "จำนวนโพสต์", data: data.map(i => i.count || 0) }
                ]
            }

            if (this.labelType === "sentiment") {
                return [
                    { name: "Positive", data: data.map(i => i.positive || 0) },
                    { name: "Neutral", data: data.map(i => i.neutral || 0) },
                    { name: "Negative", data: data.map(i => i.negative || 0) }
                ]
            }

            if (this.labelType === "platform") {
                const platforms = new Set()
                data.forEach(i => Object.keys(i.platform || {}).forEach(p => platforms.add(p)))

                return [...platforms].map(p => ({
                    name: p === "twitter" ? "x" : p,
                    data: data.map(i => i.platform?.[p] || 0)
                }))
            }

            return []
        },
        finalChartOptionsObject() {
            const platformColorMap = {
                facebook: "#4c77bb",
                x: "#727373",
                instagram: "#dc7848",
                pantip: "#9959eb",
                youtube: "#e24246",
                news: "#f3b557",
                tiktok: "#5c4d67",
                blockdit: "#1F76BD",
                threads: "#e75aa1"
            }

            const isStacked = this.labelType !== "posts"

            let colors = ["#3dabbc"]

            if (this.labelType === "sentiment") {
                colors = ["#53b993", "#368ab6", "#ea7668"]
            }

            if (this.labelType === "platform") {
                colors = this.finalSeriesObject.map(
                    s => platformColorMap[s.name] || "#999999"
                )
            }

            return {
                ...this.chartOptionsObject,
                chart: {
                    ...this.chartOptionsObject.chart,
                    stacked: isStacked   // ✅ ตำแหน่งที่ ApexCharts อ่านจริง
                },
                colors
            }
        }
    },

    watch: {
        getArrDate() {
            this.loadCharts();
        },
        domainPostChart() {
            this.updateDomainChart();
        },
        subdomain_idText(val) {
            if (Array.isArray(val) && val.length > 0) {
                this.chartKey++
                this.loadObjectChart(val);
            } else {
                this.chartKey++
                this.loadObjectChart();
            }
        },

        labelType() {
            this.chartKey++
            // this.loadObjectChart(this.subdomain_idText);
        },
        sublabelType(val) {
            if (val !== 'posts') {
                this.subdomainChartType = 'bar'; // บังคับเป็น bar
            }
            // this.loadSubdomainChart();
        },
        domainId: {
            immediate: true,
            handler() {
                this.loadDomainChart();
                this.loadCharts()
            }
        },
        subdomainId(val) {
            this.subdomain_idText = null;
            this.chartKey++
            this.loadSubdomainChart()
            // this.loadCharts()
            // this.loadObjectChart()
        },
        source(val) {
            this.subdomain_idText = null;
            this.chartKey++
            this.loadSubdomainChart()
            // this.loadCharts()
            // this.loadObjectChart()
        },
        mode: {
            immediate: true,
            handler() {
                this.updateDomainChart()
            }
        }
    },
    // watch: {
    //     domainId: {
    //         immediate: true,
    //         handler() {
    //         this.loadCharts()
    //         }
    //     },
    //     start() {
    //         this.loadCharts()
    //     },
    //     end() {
    //         this.loadCharts()
    //     },
    //     subdomainId(val) {
    //         this.subdomain_idText = val
    //         this.loadObjectChart()
    //     },
    //     labelType() {
    //         this.loadObjectChart()
    //     },
    //     sublabelType(val) {
    //         if (val !== 'posts') {
    //         this.subdomainChartType = 'bar'
    //         }
    //     }
    // },

    mounted() {
        // this.loadDomainChart();
        // this.loadCharts();
    },

    methods: {
        formatCash(n) {
            if (n < 1e3) return n;
            if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
            if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
            if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
            if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
        },
        updateDomainChart() {
            if (!this.domainRawData || this.domainRawData.length === 0) return

            let result

            if (this.mode === "post") {
                result = this.buildDomainPost()
            } else if (this.mode === "sentiment") {
                result = this.buildDomainSentiment()
            } else if (this.mode === "platform") {
                result = this.buildDomainPlatform()
            }

            this.chartOptions = result.options
            this.chartSeries = result.series
        },
        onDomainBarClick(event, chartContext, config) {
            const index = config.dataPointIndex
            if (index === -1) return
            const domain = this.domainRawData[index]
            if (!domain) return
            const start = this.start + 'T00:00:00'
            const end = this.end + 'T23:59:59'
            const routeData = this.$router.resolve({ name: "AllPost" })
            const query = `?domain_id=${domain.domain_id}&domain=${domain.domain_name}&start=${start}&end=${end}`
            window.open(`${routeData.href}${query}`, "_blank")
        },
        buildDomainPost() {
            // ======================
            // ✅ BAR CHART
            // ======================
            if (this.domainPostChart === "bar") {
                return {
                    options: {
                        chart: {
                            type: "bar",
                            toolbar: { show: false },
                            fontFamily: "Prompt, sans-serif",
                        },
                        plotOptions: {
                            bar: {
                                horizontal: true,
                                distributed: true,
                                barHeight: this.domainRawData.length > 6
                                    ? "80%"
                                    : `${this.domainRawData.length * 10}%`,
                                borderRadius: 5,
                                borderRadiusApplication: "end"
                            }
                        },
                        xaxis: {
                            categories: this.domainRawData.map(d => d.domain_name)
                        },
                        dataLabels: {
                            enabled: true,
                            formatter: val => Number.isFinite(val) ? this.formatCash(val) : ""
                        },
                        colors: [
                        "#8E44AD", // purple dark
                        "#C0392B", // red brick
                        "#16A085", // green ocean
                        "#F39C12", // amber
                        "#2980B9", // blue strong
                        "#7F8C8D", // gray cool
                        "#2D3436", // charcoal
                        "#6C5CE7", // violet blue
                        "#00B894",  // mint
                        "#FF6F61",
                        "#6B5B95",
                        "#88B04B",
                        "#F7CAC9",
                        "#92A8D1",
                        "#955251",
                        "#DD4124",
                    ],
                        responsive: [
                            {
                                breakpoint: 768, // tablet / mobile 
                                options: {
                                    xaxis: {
                                        labels: {
                                            rotate: -45, // 📱 เอียงเฉียง 
                                            rotateAlways: true,
                                            style: { fontSize: "11px" }
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    series: [
                        {
                            name: "จำนวนโพสต์",
                            data: this.domainRawData.map(d => d.count || 0)
                        }
                    ]
                }
            }

            // ======================
            // ✅ POLAR AREA (default)
            // ======================
            return {
                series: this.domainRawData.map(d => d.count || 0),
                options: {
                    chart: {
                        id: "domainChart",
                        type: "polarArea",
                        toolbar: { show: false },
                        fontFamily: "Prompt, sans-serif",
                        events: {
                            dataPointSelection: this.onDomainBarClick
                        }
                    },
                    labels: this.domainRawData.map(d => d.domain_name),
                    fill: { opacity: 1 },
                    stroke: { width: 1 },
                    yaxis: { show: false },
                    legend: { position: "bottom" },
                    dataLabels: {
                        enabled: true,
                        formatter: val =>
                            this.formatCash(Math.round(val * 100) / 100) + "%"
                    },
                    tooltip: {
                        theme: "dark",
                        y: {
                            formatter: val => this.formatCash(val)
                        }
                    },
                    plotOptions: {
                        polarArea: {
                            rings: { strokeWidth: 0 },
                            spokes: { strokeWidth: 0 }
                        }
                    },
                    colors: [
                        "#8E44AD", // purple dark
                        "#C0392B", // red brick
                        "#16A085", // green ocean
                        "#F39C12", // amber
                        "#2980B9", // blue strong
                        "#7F8C8D", // gray cool
                        "#2D3436", // charcoal
                        "#6C5CE7", // violet blue
                        "#00B894",  // mint
                        "#FF6F61",
                        "#6B5B95",
                        "#88B04B",
                        "#F7CAC9",
                        "#92A8D1",
                        "#955251",
                        "#DD4124",
                    ],
                    // theme: {
                    //     monochrome: { enabled: false }
                    // }
                }
            }
        },
        buildDomainSentiment() {
            return {
                options: {
                    chart: {
                        toolbar: { show: false },
                        type: "bar",
                        stacked: true
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true,
                            barHeight: this.domainRawData.length > 6 ? "80%" : `${this.domainRawData.length * 10}%`,
                            borderRadius: 5,
                            borderRadiusApplication: "end"
                        }
                    },
                    xaxis: {
                        categories: this.domainRawData.map(d => d.domain_name)
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: val => val === 0 ? "" : this.formatCash(val)
                    },
                    colors: ["#53b993", "#368ab6", "#ea7668"],
                    responsive: [
                        {
                            breakpoint: 768, // tablet / mobile 
                            options: {
                                xaxis: {
                                    labels: {
                                        rotate: -45, // 📱 เอียงเฉียง 
                                        rotateAlways: true,
                                        style: { fontSize: "11px" }
                                    }
                                }
                            }
                        }
                    ]
                },
                series: [
                    {
                        name: "Positive",
                        data: this.domainRawData.map(d => d.positive || 0)
                    },
                    {
                        name: "Neutral",
                        data: this.domainRawData.map(d => d.neutral || 0)
                    },
                    {
                        name: "Negative",
                        data: this.domainRawData.map(d => d.negative || 0)
                    }
                ]
            }
        },
        buildDomainPlatform() {
            const platformColorMap = {
                facebook: "#4c77bb",
                x: "#727373",
                instagram: "#dc7848",
                pantip: "#9959eb",
                youtube: "#e24246",
                news: "#f3b557",
                tiktok: "#5c4d67",
                blockdit: "#1F76BD",
                threads: "#e75aa1"
            }

            const platformKeys = new Set()
            this.domainRawData.forEach(d =>
                Object.keys(d.platform || {}).forEach(p => platformKeys.add(p))
            )

            const series = [...platformKeys].map(p => {
                const name = p === "twitter" ? "x" : p
                return {
                    name,
                    data: this.domainRawData.map(d => d.platform?.[p] || 0)
                }
            })

            return {
                options: {
                    chart: {
                        toolbar: { show: false },
                        type: "bar",
                        stacked: true
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true,
                            barHeight: this.domainRawData.length > 6 ? "80%" : `${this.domainRawData.length * 10}%`,
                            borderRadius: 5,
                            borderRadiusApplication: "end"
                        }
                    },
                    xaxis: {
                        categories: this.domainRawData.map(d => d.domain_name)
                    },
                    colors: series.map(s => platformColorMap[s.name] || "#999"),
                    responsive: [
                        {
                            breakpoint: 768, // tablet / mobile 
                            options: {
                                xaxis: {
                                    labels: {
                                        rotate: -45, // 📱 เอียงเฉียง 
                                        rotateAlways: true,
                                        style: { fontSize: "11px" }
                                    }
                                }
                            }
                        }
                    ]
                },
                series
            }
        },
        loadCharts() {
            this.loadSubdomainChart();
            this.loadObjectChart();
            this.chartKey++
        },
        async loadDomainChart() {
            try {
                this.chartOptions = {
                    ...this.chartOptions,
                    noData: { text: "Loading..." }
                };
                this.domainRawData = [];
                let social = this.source == 'news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads' ? null : this.source;
                const res = await axios.get(
                    `https://api2.cognizata.com/api/v2/ranking/getDomainCount`,
                    {
                        params: {
                            domain_id: this.domainId,
                            start: this.start + 'T00:00:00',
                            end: this.end + 'T23:59:59',
                            source: social
                        },
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token")
                        }
                    }
                );
                this.domainRawData = res?.data?.data || [];
                this.updateDomainChart();
                this.chartOptionsSubdomain = {
                    ...this.chartOptionsSubdomain,
                    noData: { text: "" }
                };
            } catch (err) {
                console.error("loadSubdomainChart error:", err);
            }
        },
        async loadSubdomainChart() {
            const today = new Date();
            const y = today.getFullYear();
            const m = String(today.getMonth() + 1).padStart(2, '0');
            const d = String(today.getDate()).padStart(2, '0');
            const startDefault = `${y}-${m}-${d}T00:00:00`;
            const endDefault = `${y}-${m}-${d}T23:59:59`;

            const start = this.start || startDefault;
            const end = this.end || endDefault;
            try {
                // show loading
                this.chartOptionsSubdomain = {
                    ...this.chartOptionsSubdomain,
                    noData: { text: "Loading..." }
                };
                this.seriesSubdomainRaw = [];

                // const res = await axios.get(
                //     `https://api2.cognizata.com/api/v2/ranking/getSubdomainCount?domain_id=${this.domainId}&start=${start}&end=${end}`,
                //     {
                //         headers: {
                //             Authorization: "Bearer " + localStorage.getItem("token"),
                //             "Content-Type": "application/json"
                //         }
                //     }
                // );
                const res = await axios.get(
                    `https://api2.cognizata.com/api/v2/ranking/getSubdomainCount`,
                    {
                        params: {
                            domain_id: this.domainId,
                            ...(this.subdomainId && {
                                subdomain_id: this.subdomainId
                            }),
                            start: this.start + 'T00:00:00',
                            end: this.end + 'T23:59:59',
                            source: this.source
                        },
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token")
                        }
                    }
                );
                const list = res?.data?.data || [];
                this.subdomains = list.length ? list.slice(0, 10) : [];
                this.seriesSubdomainRaw = this.subdomains.map(item => item.count);

                this.seriesSubdomainSentiment = [
                    { name: "Positive", data: this.subdomains.map(i => i.positive || 0) },
                    { name: "Neutral", data: this.subdomains.map(i => i.neutral || 0) },
                    { name: "Negative", data: this.subdomains.map(i => i.negative || 0) }
                ];

                const platformColorMap = {
                    facebook: "#4c77bb", x: "#727373", instagram: "#dc7848",
                    pantip: "#9959eb", youtube: "#e24246", news: "#f3b557",
                    tiktok: "#5c4d67", blockdit: "#1F76BD", threads: "#e75aa1"
                };

                const platformKeys = new Set();
                this.subdomains.forEach(obj => {
                    Object.keys(obj.platform || {}).forEach(p => platformKeys.add(p));
                });

                const displayPlatforms = Array.from(platformKeys).map(p => p === "twitter" ? "x" : p);
                this.seriesSubdomainPlatform = displayPlatforms.map(displayName => {
                    const rawKey = displayName === "x" ? "twitter" : displayName;
                    return {
                        name: displayName,
                        data: this.subdomains.map(obj => obj.platform?.[rawKey] || 0)
                    };
                });

                this.chartOptionsSubdomain = {
                    ...this.chartOptionsSubdomain,
                    noData: { text: "" }
                };
            } catch (err) {
                console.error("loadSubdomainChart error:", err);
            }
        },
        async loadObjectChart() {
            const today = new Date();
            const y = today.getFullYear();
            const m = String(today.getMonth() + 1).padStart(2, '0');
            const d = String(today.getDate()).padStart(2, '0');
            const startDefault = `${y}-${m}-${d}T00:00:00`;
            const endDefault = `${y}-${m}-${d}T23:59:59`;

            const start = this.start + 'T00:00:00' || startDefault;
            const end = this.end + 'T23:59:59' || endDefault;

            try {
                this.chartOptionsObject = {
                    ...this.chartOptionsObject,
                    noData: { text: "Loading..." }
                };
                this.seriesObject = [];
                let social = this.source == 'news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads' ? null : this.source;
                const params = {
                    domain_id: this.domainId,
                    limit: 10,
                    start: this.start + 'T00:00:00',
                    end: this.end + 'T23:59:59',
                    source: social
                }

                // ลำดับความสำคัญ: subdomain_idText > subdomainId
                if (Array.isArray(this.subdomain_idText) && this.subdomain_idText.length > 0) {
                    params.subdomain_id = this.subdomain_idText.join(',')
                } else if (this.subdomainId) {
                    params.subdomain_id = this.subdomainId
                }

                const res = await axios.get(
                    "https://api2.cognizata.com/api/v2/ranking/getObjectCount",
                    {
                        params,
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token")
                        }
                    }
                )

                const data = res?.data?.data || [];
                this.objectRawData = data;
                const categories = data.map(item =>
                    item.name.length > 20 ? item.name.slice(0, 20) + "..." : item.name
                );
                let series = [];

                this.seriesObject = series;

                this.chartOptionsObject = {
                    ...this.chartOptionsObject,
                    chart: {
                        ...this.chartOptionsObject.chart,
                        // stacked: this.labelType !== 'posts',
                        events: {
                            dataPointSelection: (event, chartContext, config) => {
                                const clickedIndex = config.dataPointIndex;
                                const obj = data[clickedIndex];
                                if (!obj) return;
                                let query = `?domain_id=${encodeURIComponent(obj.domain_id)}&domain=${obj.domain_name}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&object_id=${obj.object_id}`;
                                if (obj.subdomain_id) query += `&subdomain_id=${obj.subdomain_id}`;
                                const routeData = this.$router.resolve({ name: "AllPost" });
                                window.open(`${routeData.href}${query}`, "_blank");
                            }
                        }
                    },
                    xaxis: { categories },
                    noData: { text: "" },
                    dataLabels: {
                        enabled: true,
                        formatter: val => val === 0 ? "" : this.formatCash(val)
                    }
                };
            } catch (err) {
                console.error(err);
            }
        }

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
    /* box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px; */
}
</style>
<style scoped>
h5 {
    margin-bottom: 15px;
}

.btn-outline-info.btn-sm .button {
    /* background-color: #409991; */
}

.btn-info {
    color: #fffdfd;
    /* background-color: #409991;
    border-color: #409991; */
}

.btn-outline-info {
    /* color: #409991;
   border-color: #409991; */
}
</style>
