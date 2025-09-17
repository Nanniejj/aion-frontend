<template lang="">
    <div>
        <b-col cols="12" class="d-flex px-0 pt-3 align-items-center">
            <div class="m-0 text-info col-auto pl-0 pr-1">
                <img width="22" height="22" src="https://img.icons8.com/ios/50/sparkling.png" />
                สรุปข้อมูลสถิติ
            </div>
            <hr class="m-0 bg-info-to-warning col" />
            
        </b-col>
        <b-row class="m-0 pt-3 pb-2 pb-md-0">
            <b-col cols="12" md="auto" class="">
                <apexchart
                    type="polarArea"
                    :series="series"
                    :options="chartOptions"
                    height="250"
                    width="500"
                >
                </apexchart>
            </b-col>
            <b-col class="pt-3 pt-md-0">
                แนวโน้มของความคิดเห็นในโพสต์ไปในทิศทาง
                <strong :class="{
                    'text-success': maxLabel === 'เห็นด้วย',
                    'text-danger': maxLabel === 'ไม่เห็นด้วย',
                    'text-info': maxLabel === 'เป็นกลาง'
                }">{{ maxLabel }}</strong>
                <span> (คิดเป็นร้อยละ {{ maxValue }} ของความคิดเห็นทั้งหมด)</span>
            </b-col>
        </b-row>
    </div>
</template>
<script>
import VueApexCharts from "vue-apexcharts";
export default {
    components: {
        apexchart: VueApexCharts
    },
    props: {
        series: {
            type: Array,
            required: true
        },
        summarizeText: {
            type: String,
            // required: false
        }
    },
    data() {
        return {
            maxLabel: '',
            maxValue: 0,
            chartOptions: {
                chart: {
                    fontFamily: 'Prompt, sans-serif'
                },
                labels: [
                    "เห็นด้วย",
                    "ไม่เห็นด้วย",
                    "เป็นกลาง",
                ],
                colors:  ['#54c69d', '#f7776a', '#3a86ad'],
                stroke: { colors: ['#fff'] },
                fill: { opacity: 1 },
                dataLabels: {
                    enabled: true,
                    formatter: function (val, opts) {
                        // ใช้ opts.w.config.series แทน opts.series
                        const total = opts.w.config.series.reduce((a, b) => a + b, 0);
                        const percent = ((val / total) * 100).toFixed(1);
                        return percent + '%';
                    },
                    style: {
                        fontSize: '14px',
                        fontWeight: 'bold',
                        // fontFamily: 'Prompt'
                    }
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val.toFixed(1) + '%'; // แสดง value + '%'
                        }
                    }
                },
                yaxis: {
                    show: false
                },
                // legend: {
                //     // position: 'bottom',
                //     // horizontalAlign: 'center', // 'left' | 'center' | 'right'
                //     // offsetX: 250, 
                //     // offsetY: -10  // ขยับขึ้นไป 10px
                // },
                responsive: [
                    // {
                    //     breakpoint: 1300,
                    //     options: {
                    //         chart: { height: 300, width: '100%' },
                    //         legend: { offsetX: 0, offsetY: -10 },
                    //     }
                    // },
                    {
                        breakpoint: 767,
                        options: {
                            chart: { height: 300, width: '100%' },
                            legend: { position: 'bottom'},
                        }
                    }
                ]
            }
        };
    },
    methods: {
        getMaxCommentLabel() {
            if(!this.series) return ''
            const maxValue = Math.max(...this.series);
            this.maxLabel = this.chartOptions.labels[this.series.indexOf(maxValue)];
            this.maxValue = maxValue;
            // return this.maxLabel;
        },
        formatSummarize(text) {
            if (!text) return '';
            // this.getChartLable(text);
            const paragraphs = text.split(/\n\n+/).map(p =>
            `<p style="margin: 0 0 6px; line-height: 1.4;">${p.replace(/\n/g, '<br>')}</p>`
        );
        return paragraphs.join('');
        },
    },
    mounted() {
        this.getMaxCommentLabel();
    },

}
</script>
<style scoped>
.bg-info-to-warning {
  height: 2px;
  border: none;
  background: linear-gradient(90deg, #56a7b6 0%, #6d5fa0 50%, #56a7b6 100%);
}
</style>