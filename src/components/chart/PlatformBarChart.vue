<template>
    <div>
        <!-- <div class="text-left">Platform</div> -->
        <apexchart type="bar" height="80" :options="chartOptions" :series="series" />
    </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
    name: "PlatformBarChart",
    props: {
        platform: {
            type: Object,
            required: true
        }
    },
    components: {
        apexchart: VueApexCharts,
    },
    computed: {
        totalPosts() {
            return this.platformLabels.reduce((sum, key) => sum + (this.platform[key] || 0), 0);
        },
        series() {
            return this.platformLabels.map((key) => ({
                name: this.labelMap[key] || key,
                data: [this.platform[key] || 0]
            }));
        },
        chartOptions() {
            const total = this.totalPosts;
            return {
                chart: {
                    type: 'bar',
                    stacked: true,
                    stackType: '100%',
                    toolbar: { show: false },
                    fontFamily: "Prompt, sans-serif",
                },
                colors: this.platformLabels.map(key => this.colorMap[key] || '#ccc'),
                plotOptions: {

                    bar: {
                        horizontal: true,
                        barHeight: '100%',
                        offsetY: -10
                    }
                },
                grid: {
                    show: false
                },
                xaxis: {
                    categories: [''],
                    labels: { show: false },
                    axisTicks: { show: false },
                    axisBorder: { show: false }
                },
                yaxis: {
                    show: false
                },
                dataLabels: {
                    enabled: true,
                    //   formatter: (val, opts) => {
                    //     const percent = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                    //     return `${val} (${percent}%)`;
                    //   },
                    style: {
                        colors: ['#fff']
                    }
                },
                tooltip: {
                    y: {
                        formatter: function (val, opts) {
                            const total = opts.w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                            const percent = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                            return `${val} โพสต์ (${percent}%)`;
                        }
                    }
                },
                legend: {
                    show: false,
                    position: 'bottom',
                    fontSize: '14px',
                    horizontalAlign: 'left',
                    formatter: (seriesName, opts) => {
                        const val = opts.w.config.series[opts.seriesIndex].data[0];
                        const percent = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                        return `${seriesName}: ${val} โพสต์ (${percent}%) `;
                    }
                },
                fill: {
                    opacity: 1
                },
                // title: {
                //   text: "จำนวนโพสต์แยกตามแพลตฟอร์ม"
                // }
            };
        }
        ,
        platformLabels() {
            return [
                "facebook", "twitter", "instagram", "pantip",
                "youtube", "news", "tiktok", "blockdit", "threads"
            ];
        },
        labelMap() {
            return {
                facebook: "Facebook",
                twitter: "X",
                instagram: "Instagram",
                pantip: "Pantip",
                youtube: "YouTube",
                news: "News",
                tiktok: "TikTok",
                blockdit: "Blockdit",
                threads: "Threads"
            };
        },
        colorMap() {


            return {
                facebook: "#4c77bb",
                twitter: "#727373",
                instagram: "#dc7848",
                pantip: "#532d84",
                youtube: "#e24246",
                news: "#f3b557",
                tiktok: "#5c4d67",
                blockdit: "#1F76BD",
                threads: "#e75aa1"
            };
        }
    }
};
</script>
