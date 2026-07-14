<template>
    <div class="sentiment-ratio-chart">
        <h5 v-if="chartTitle" class="chart-title">
            <strong>{{ chartTitle }}</strong>
        </h5>

        <div v-if="items.length">
            <!-- custom legend แบบ badge (แทน legend เดิมของ apexcharts) กดเพื่อ toggle ซีรีส์ได้ -->
            <div v-if="showLegend" class="sentiment-legend">
                <button
                    v-for="key in seriesKeys"
                    :key="key"
                    type="button"
                    class="sentiment-badge"
                    :class="{ 'is-inactive': inactiveKeys.includes(key) }"
                    :style="badgeStyle(key)"
                    :disabled="isSingleTopic"
                    @click="toggleSeriesByKey(key)"
                >
                    <i
                        class="sentiment-badge__check"
                        :class="inactiveKeys.includes(key) ? 'fas fa-circle' : 'fas fa-check-circle'"
                        :style="{ color: colorOf(key) }"
                    ></i>
                    <i class="sentiment-badge__mood" :class="moodIcons[key]" :style="{ color: colorOf(key) }"></i>
                    <span class="sentiment-badge__label" :style="{ color: colorOf(key) }">{{ labels[key] }}</span>
                </button>
            </div>

            <vue-apex-charts
                v-if="isSingleTopic"
                ref="chart"
                type="pie"
                :height="pieHeight"
                :options="pieOptions"
                :series="pieSeries"
            ></vue-apex-charts>
            <vue-apex-charts
                v-else
                ref="chart"
                type="bar"
                :height="computedHeight"
                :options="chartOptions"
                :series="chartSeries"
            ></vue-apex-charts>
        </div>
        <div v-else class="text-muted small">
            {{ emptyText }}
        </div>
    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';

/**
 * SentimentRatioChart
 * ---------------------
 * กราฟแท่งแนวนอนแสดงสัดส่วน บวก/กลาง/ลบ แบบ reusable
 * ออกแบบมาให้รองรับหลายประเด็นในกราฟเดียว (1 แถว = 1 ประเด็น)
 * เรียกใช้ซ้ำได้จากหลายที่ในแอป เพียงส่ง prop `items` เข้ามา เช่น
 *
 *   <sentiment-ratio-chart :items="topicA" chart-title="หัวข้อ A" />
 *   <sentiment-ratio-chart :items="topicB" chart-title="หัวข้อ B" />
 *
 * หรือส่งหลายประเด็นเข้าไปในกราฟเดียวก็ได้ (array ยาวเท่าไหร่ก็ได้)
 *
 * legend ด้านบนเป็น custom badge (checkmark + emoji mood + label บนพื้นสีอ่อน)
 * แทน legend เริ่มต้นของ apexcharts เพื่อให้ได้หน้าตาแบบ pill ตามดีไซน์ที่กำหนด
 * กดที่ badge เพื่อ toggle ซีรีส์นั้นในกราฟได้ (เหมือน legend ปกติ)
 */
export default {
    name: "SentimentRatioChart",
    components: {
        VueApexCharts,
    },
    props: {
        // [{ title: String, positive: Number, neutral: Number, negative: Number }, ...]
        items: {
            type: Array,
            required: true,
            default: () => [],
        },
        chartTitle: { type: String, default: "" },
        emptyText: { type: String, default: "ไม่มีข้อมูลสัดส่วนความคิดเห็น" },
        // true = normalize เป็น 100% ต่อแถว (เหมาะเทียบสัดส่วน), false = แสดงค่าจริงตามที่ส่งมา
        stacked100: { type: Boolean, default: true },
        // ความสูงต่อ 1 ประเด็น (px) ใช้คำนวณความสูงกราฟรวมอัตโนมัติเมื่อมีหลายประเด็น
        heightPerItem: { type: Number, default: 60 },
        minHeight: { type: Number, default: 160 },
        colors: {
            type: Array,
            // บวก, กลาง, ลบ — อิงสีเดียวกับไอคอน fa-smile / fa-meh / fa-frown-open
            default: () => ["#53b993", "#368ab6", "#f06964"],
        },
        labels: {
            type: Object,
            default: () => ({ positive: "บวก", neutral: "กลาง", negative: "ลบ" }),
        },
        // ไอคอน mood ต่อ badge แต่ละอัน (ต้องมี Font Awesome ให้ใช้ในโปรเจกต์)
        moodIcons: {
            type: Object,
            default: () => ({
                positive: "far fa-smile",
                neutral: "far fa-meh",
                negative: "far fa-frown-open",
            }),
        },
        // แสดง custom legend badge ด้านบนกราฟหรือไม่
        showLegend: { type: Boolean, default: true },
        // ความเข้มของสีพื้นหลัง badge (0-1) ยิ่งน้อยยิ่งอ่อน
        badgeBgAlpha: { type: Number, default: 0.12 },
        // ความสูงของ pie/donut chart (ใช้เมื่อ items มีประเด็นเดียว)
        pieHeight: { type: [Number, String], default: 320 },
    },
    data() {
        return {
            // เก็บ key ('positive' | 'neutral' | 'negative') ที่ถูกปิดไว้ (toggle ออก) จาก legend
            inactiveKeys: [],
        };
    },
    computed: {
        // ลำดับ key ต้องตรงกับลำดับใน chartSeries/colors เสมอ (index 0=positive, 1=neutral, 2=negative)
        seriesKeys() {
            return ["positive", "neutral", "negative"];
        },
        // มีประเด็นเดียว -> แสดงเป็น pie/donut chart แทนกราฟแท่งแนวนอน
        isSingleTopic() {
            return this.items.length === 1;
        },
        pieSeries() {
            if (!this.isSingleTopic) return [];
            const item = this.items[0];
            return [item.positive, item.neutral, item.negative];
        },
        pieLabels() {
            return [this.labels.positive, this.labels.neutral, this.labels.negative];
        },
        pieOptions() {
            const isPercent = this.stacked100;
            return {
                chart: {
                    type: "pie",
                    fontFamily: "Prompt, sans-serif",
                },
                labels: this.pieLabels,
                colors: this.colors,
                // เส้นขอบขาวคั่นระหว่างชิ้น pie ให้ดูสะอาดตาเหมือนภาพตัวอย่าง
                stroke: { show: true, width: 2, colors: ["#fff"] },
                // ปิด legend เริ่มต้นของ apexcharts เพราะใช้ custom badge legend ด้านบนแทน
                legend: { show: false },
                dataLabels: {
                    enabled: true,
                    // ดึงค่าจริงจาก series แทนเปอร์เซ็นต์ที่ apexcharts คำนวณเอง (กันเพี้ยนหากผลรวมไม่เท่ากับ 100 พอดี)
                    formatter: (_val, opts) => {
                        const raw = opts.w.globals.series[opts.seriesIndex];
                        if (!raw) return "";
                        return isPercent ? `${raw}%` : `${raw}`;
                    },
                    dropShadow: { enabled: false },
                    style: { fontSize: "15px", fontWeight: 600 },
                },
                tooltip: {
                    y: {
                        formatter: (val) => (isPercent ? `${val}%` : `${val}`),
                    },
                },
            };
        },
        computedHeight() {
            return Math.max(this.minHeight, this.items.length * this.heightPerItem + 60);
        },
        chartCategories() {
            return this.items.map((i) => i.title);
        },
        chartSeries() {
            return [
                { name: this.labels.positive, data: this.items.map((i) => i.positive) },
                { name: this.labels.neutral, data: this.items.map((i) => i.neutral) },
                { name: this.labels.negative, data: this.items.map((i) => i.negative) },
            ];
        },
        chartOptions() {
            const isPercent = this.stacked100;
            return {
                chart: {
                    type: "bar",
                    stacked: true,
                    // ใช้ stack แบบ normal เสมอ (ไม่ใช้ 100% stack)
                    // เพราะ items ที่ส่งเข้ามาเป็นเปอร์เซ็นต์ของทั้งหมดอยู่แล้ว (บวก+กลาง+ลบ ~ 100)
                    // ถ้าใช้ 100% stack ตอนกด toggle ซ่อน series ใดออก apexcharts จะคำนวณสัดส่วนใหม่
                    // จากเฉพาะ series ที่เหลือที่มองเห็น ทำให้ตัวเลขที่แสดงคลาดเคลื่อนจากข้อมูลจริง
                    stackType: "normal",
                    toolbar: { show: false },
                    fontFamily: "Prompt, sans-serif",
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        barHeight: "60%",
                        // โค้งขอบเฉพาะหัว-ท้ายแท่งรวม (ไม่ใช่ทุกรอยต่อของ segment) ให้ได้ทรงแคปซูลแบบภาพตัวอย่าง
                        borderRadius: 8,
                        borderRadiusApplication: "end",
                        borderRadiusWhenStacked: "last",
                    },
                },
                colors: this.colors,
                xaxis: {
                    categories: this.chartCategories,
                    // ตรึงสเกลแกนไว้ที่ 100 เมื่อเป็นโหมดเปอร์เซ็นต์ กัน apexcharts ขยาย/บีบแท่งใหม่ตอน toggle ซ่อน series
                    max: isPercent ? 100 : undefined,
                    labels: { show: false },
                    axisBorder: { show: false },
                    axisTicks: { show: false },
                },
                yaxis: {
                    labels: {
                        // ปิดการตัดข้อความอัตโนมัติของ apexcharts (ค่า default trim:true + maxWidth:160
                        // เป็นสาเหตุที่ชื่อประเด็นภาษาไทยยาวๆ ถูกตัด/แสดงผิดเพี้ยนตามที่เจอ)
                        trim: false,
                        maxWidth: 350,
                        style: { fontSize: "14px" },
                    },
                },
                // ปิด legend เริ่มต้นของ apexcharts เพราะใช้ custom badge legend ด้านบนแทน
                legend: { show: false },
                dataLabels: {
                    enabled: true,
                    formatter: (val) => {
                        if (!val) return "";
                        return isPercent ? `${Math.round(val)}%` : `${val}`;
                    },
                    style: { fontSize: "14px" },
                },
                tooltip: {
                    shared: false,
                    intersect: true,
                    y: {
                        formatter: (val) => (isPercent ? `${val}%` : `${val}`),
                    },
                },
                grid: {
                    show: false,
                    padding: { left: 10, right: 10 },
                },
            };
        },
    },
    methods: {
        colorOf(key) {
            const idx = this.seriesKeys.indexOf(key);
            return this.colors[idx] || "#999999";
        },
        // แปลง hex เป็น rgba เพื่อทำพื้นหลัง badge โทนอ่อนจากสีเดียวกับกราฟ โดยไม่ต้องส่ง prop สีพื้นหลังแยก
        hexToRgba(hex, alpha) {
            if (!hex) return `rgba(153, 153, 153, ${alpha})`;
            const clean = hex.replace("#", "");
            const bigint = parseInt(clean, 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        },
        badgeStyle(key) {
            const color = this.colorOf(key);
            return {
                backgroundColor: this.hexToRgba(color, this.badgeBgAlpha),
                "--badge-color": color,
            };
        },
        toggleSeriesByKey(key) {
            // ตอนเป็น pie chart ประเด็นเดียว ไม่อนุญาตให้ปิดสัดส่วนไหนออก (ต้องแสดงครบทั้ง 3 ส่วนเสมอ)
            if (this.isSingleTopic) return;

            const seriesName = this.labels[key];
            const chartInstance = this.$refs.chart;
            if (chartInstance && typeof chartInstance.toggleSeries === "function") {
                chartInstance.toggleSeries(seriesName);
            }

            const pos = this.inactiveKeys.indexOf(key);
            if (pos === -1) {
                this.inactiveKeys.push(key);
            } else {
                this.inactiveKeys.splice(pos, 1);
            }
        },
    },
};
</script>

<style scoped>
.chart-title {
    font-size: 16px;
    /* margin-bottom: 8px; */
}

.sentiment-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    /* margin-bottom: 12px; */
}

.sentiment-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 14px;
    border-radius: 999px;
    border: 1px solid transparent;
    background: transparent;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.6;
    cursor: pointer;
    transition: opacity 0.15s ease, transform 0.1s ease;
}

.sentiment-badge:hover,
.sentiment-badge:focus,
.sentiment-badge:focus-visible {
    transform: translateY(-1px);
    outline: none;
    box-shadow: none;
    border-color: var(--badge-color, transparent);
}

.sentiment-badge.is-inactive {
    opacity: 0.35;
}

.sentiment-badge:disabled {
    cursor: default;
    pointer-events: none;
}

.sentiment-badge__check {
    font-size: 16px;
}

.sentiment-badge__mood {
    font-size: 16px;
}

.sentiment-badge__label {
    white-space: nowrap;
}
</style>