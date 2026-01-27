<template>
    <div>
        <!-- Mode Switch -->
        <b-row class="mx-0 mb-3 text-right justify-content-between align-items-center">
            <b-col cols="auto" class="text-left h5 bold">สถิติจำนวนโพสต์รายวัน</b-col>
            <b-col cols="auto">
                <b-button-group class="mb-2">
                    <button v-for="m in modes" :key="m.value" class="btn btn-sm"
                        :class="mode === m.value ? 'btn-info' : 'btn-outline-info'" @click="mode = m.value">
                        {{ m.label }}
                    </button>
                </b-button-group>
            </b-col>
        </b-row>
        <apexchart type="line" height="350" :options="chartOptions" :series="series" />
    </div>
</template>

<script>
export default {
    name: "RankingChart",

    props: {
        rawData: {
            type: Object,
            required: true
        },
        dataVersion: {
            type: Number,
            required: true
        },
        isSubdomain: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            mode: "domain", // domain | subdomain | object
            modes: [
                { value: "domain", label: "Domain" },
                { value: "subdomain", label: "Subdomain" },
                { value: "object", label: "Object" }
            ],
            chartOptions: {
                chart: {
                    stacked: false,
                    toolbar: { show: true },
                    fontFamily: "Prompt, sans-serif",
                    selection: {
                        enabled: true
                    },
                    events: {
                        dataPointSelection: (event, chartContext, config) => {
                            this.onPointClick(event, chartContext, config)
                        }
                    }
                },
                markers: {
                    size: 5,          // ⭐ สำคัญมาก
                    hover: {
                        size: 20
                    }
                },
                xaxis: {
                    type: "category",
                //   title: { text: "วันที่" }
                },
                yaxis: {
                    // title: { text: "จำนวนโพสต์" }
                },
                stroke: { curve: "smooth" },
                fill: { opacity: 0.7 },
                 colors: ['#e6ba59', '#40A578', '#725CAD', '#F075AA', '#368ab6', '#ea7668', '#9ABF80', '#71C0BB', '#34495e',],
                tooltip: {
                    shared: false,
                    intersect: true
                },
                legend: { position: "bottom" }
            }
        }
    },

    computed: {
        sourceData() {
            switch (this.mode) {
                case "subdomain":
                    return this.rawData.subdomainData || []
                case "object":
                    return this.rawData.objectData || []
                default:
                    return this.rawData.domainData || []
            }
        },

        nameField() {
            if (this.mode === "object") return "object_name"
            if (this.mode === "subdomain") return "subdomain_name"
            return "domain_name"
        },

        series() {
            if (!this.sourceData.length) return []

            return this.sourceData.map(item => ({
                name: item[this.nameField],
                meta: item,
                data: item.x.map((date, idx) => ({
                    x: date,
                    y: item.y[idx] ?? 0
                }))
            }))
        },
        
    },
    methods: {
        onPointClick(event, chartContext, config) {
            const { seriesIndex, dataPointIndex } = config

            if (seriesIndex === -1 || dataPointIndex === -1) return

            const clickedSeries = this.series[seriesIndex]
            if (!clickedSeries) return

            const meta = clickedSeries.meta
            const point = clickedSeries.data[dataPointIndex]
            if (!point) return

            const clickedDate = point.x

            // console.log('CLICK', meta, clickedDate)

            if (this.mode === 'domain') {
                this.openByDomain(meta, clickedDate)
            } else if (this.mode === 'subdomain') {
                this.openBySubdomain(meta, clickedDate)
            } else {
                this.openByObject(meta, clickedDate)
            }
        },

        openByDomain(domain, date) {
            // console.log("domain === ", domain,date);
            const routeData = this.$router.resolve({ name: "AllPost" })
            const query = `?domain_id=${domain.domain_id}&domain=${domain.domain_name}&start=${date + 'T00:00:00'}&end=${date + 'T23:59:59'}`
            window.open(`${routeData.href}${query}`, "_blank")
        },

        openBySubdomain(subdomain, date) {  
            // console.log("subdomain === ", subdomain, date);
            const routeData = this.$router.resolve({ name: "AllPost" })
            const query = `?domain_id=${subdomain.domain_id}&domain=${subdomain.domain_name}&start=${date + 'T00:00:00'}&end=${date + 'T23:59:59'}&subdomain_id=${subdomain.subdomain_id}`
            window.open(`${routeData.href}${query}`, "_blank")
        },

        openByObject(object, date) {
            // console.log("object === ", object, date);
            // const objectName = encodeURIComponent(object.object_name)
            const routeData = this.$router.resolve({ name: "AllPost" })
            const query = `?domain_id=${object.domain_id}&domain=${object.domain_name}&start=${date + 'T00:00:00'}&end=${date + 'T23:59:59'}&subdomain_id=${object.subdomain_id}&object_id=${object.object_id}`
            window.open(`${routeData.href}${query}`, "_blank")
        }
    },
    watch: {
        dataVersion() {
           this.mode = this.isSubdomain ? "subdomain" : "domain"
        },
        isSubdomain: {
            immediate: true,
            handler(val) {
            if (val) {
                this.mode = "subdomain"
            }
            }
        },
        mode() {
            this.chartOptions.chart.stacked = this.mode !== "domain"
        }
    }
}
</script>
