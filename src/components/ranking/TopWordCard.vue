<template>
    <div style="height: 95%;">
        <!-- 🔀 MODE SWITCH -->
        <!-- <div class="d-flex justify-content-end mb-2">
            <b-button-group size="sm">
                <b-button
                    v-for="m in modes"
                    :key="m.value"
                    :variant="mode === m.value ? 'info' : 'outline-info'"
                    @click="mode = m.value"
                >
                    {{ m.label }}
                </b-button>
            </b-button-group>
        </div> -->

        <b-list-group flush class="chart-box h-100">
            <b-list-group-item v-for="(item, i) in rows" :key="item.uid" class="ta-row py-2"
                :class="{ 'ta-row-active': isActive(item) }" @click="onClick(item)">
                <b-row align-v="center" v-b-tooltip.hover :title="tooltipText(item)">
                    <!-- ซ้าย -->
                    <b-col cols="auto" md="5">
                        <div class="text-left w-100 text-truncate">
                            <span class="rank-no mr-2" :class="i % 2 === 0 ? 'rank-dark' : 'rank-light'">
                                {{ i + 1 }}
                            </span>
                            <span class="ta-name">{{ item.name }}</span>
                        </div>
                    </b-col>

                    <!-- ขวา -->
                    <b-col md="7">
                        <div class="d-flex align-items-center w-100">
                            <div class="stack-bg mr-2" :style="{ width: barWidth(item) + '%' }">
                                <div v-for="(p, idx) in stackParts(item)" :key="idx" class="stack-bar" :class="p.class"
                                    :style="{
                                        width: p.width + '%',
                                        ...p.style
                                    }" />

                            </div>

                            <b-badge pill variant="warning">
                                {{ format(getModeTotal(item)) }}
                            </b-badge>
                        </div>
                    </b-col>
                </b-row>
            </b-list-group-item>
        </b-list-group>

        <div v-if="rows.length === 0" class="text-center text-muted py-4">
            ไม่พบข้อมูล
        </div>
    </div>
</template>

<script>
export default {
    name: "TopWordCard",

    props: {
        items: { type: Array, default: () => [] },
        type: { type: String, default: "object" },
        mode: { type: String, default: "post" },
    },

    data() {
        return {
            platformColorMap: {
                facebook: "#4c77bb",
                x: "#727373",
                instagram: "#dc7848",
                pantip: "#9959eb",
                youtube: "#e24246",
                news: "#f3b557",
                tiktok: "#5c4d67",
                blockdit: "#1F76BD",
                threads: "#e75aa1",
            },
        };
    },

    computed: {
        normalized() {
            return this.items.map((it) => {
                if (this.type === "domain") {
                    return {
                        domain_id: it.domain_id,
                        domain_name: it.domain_name,
                        uid: it.domain_id,
                        name: it.domain_name,
                        count: it.count,
                        pos: it.positive,
                        neu: it.neutral,
                        neg: it.negative,
                        platform: it.platform || {},
                    };
                }

                if (this.type === "subdomain") {
                    return {
                        domain_id: it.domain_id,
                        domain_name: it.domain_name,
                        subdomain_id: it.subdomain_id,
                        subdomain_name: it.name,
                        uid: it.subdomain_id,
                        name: it.name,
                        count: it.count,
                        pos: it.positive,
                        neu: it.neutral,
                        neg: it.negative,
                        platform: it.platform || {},
                    };
                }

                return {
                    domain_id: it.domain_id,
                    domain_name: it.domain_name,
                    subdomain_id: it.subdomain_id,
                    subdomain_name: it.subdomain_name,
                    object_id: it.object_id,
                    object_name: it.name,
                    uid: it.object_id,
                    name: it.name,
                    count: it.count,
                    pos: it.positive,
                    neu: it.neutral,
                    neg: it.negative,
                    platform: it.platform || {},
                };
            });
        },

        sorted() {
            return [...this.normalized].sort((a, b) => b.count - a.count);
        },

        rows() {
            return this.sorted.slice(0, this.limit);
        },

        maxCount() {
            return Math.max(1, ...this.rows.map((r) => r.count));
        },
    },

    methods: {
        getModeTotal(item) {
            
            if (this.mode === "post") {
                return item.count || 0;
            }

           
            if (this.mode === "sentiment") {
                return (item.pos || 0) + (item.neu || 0) + (item.neg || 0);
            }

            
            if (this.mode === "platform") {
                return Object.values(item.platform || {}).reduce(
                    (sum, v) => sum + v,
                    0
                );
            }

            return 0;
        },

        isActive(item) {
            return String(item.uid) === String(this.activeKey);
        },

        onClick(item) {
            this.$emit("select-item", {
                type: this.type,
                key: item.uid,
                name: item.name,
                raw: item,
            });
        },

        barWidth(item) {
            if (this.mode === "post") {
                return (item.count / this.maxCount) * 100;
            }
            return 100;
        },

        stackParts(item) {
            /* 🔵 POST MODE */
            if (this.mode === "post") {
                return [
                    {
                        width: 100,
                        style: { background: "#138496" },
                    },
                ];
            }

            /* 🟡 SENTIMENT MODE */
            if (this.mode === "sentiment") {
                const t = item.pos + item.neu + item.neg || 1;
                return [
                    { class: "stack-pos", width: (item.pos / t) * 100 },
                    { class: "stack-neu", width: (item.neu / t) * 100 },
                    { class: "stack-neg", width: (item.neg / t) * 100 },
                ];
            }

            /* 🟣 PLATFORM MODE */
            if (this.mode === "platform") {
                const entries = Object.entries(item.platform || {});
                const total = entries.reduce((s, [, v]) => s + v, 0) || 1;

                return entries.map(([k, v]) => ({
                    width: (v / total) * 100,
                    style: {
                        background: this.platformColorMap[k] || "#adb5bd",
                    },
                }));
            }

            return [];
        },

        format(v) {
            return Number(v || 0).toLocaleString();
        },

        tooltipText(item) {
            if (this.mode === "platform") {
                return Object.entries(item.platform || {})
                    .map(([k, v]) => `${k}: ${this.format(v)}`)
                    .join("\n");
            }else if (this.mode === "post") {
                return `รวม: ${this.format(item.count)} โพสต์`;
            }

            return `
                บวก: ${this.format(item.pos)}
                กลาง: ${this.format(item.neu)}
                ลบ: ${this.format(item.neg)}
            `.trim();
        },
    },
};
</script>

<style scoped>
.badge-warning {
    color: #212529;
    background-color: #fed16e;
}

.d-lg {
    display: inline;
}

.d-sm {
    display: none;
}

.list-group-item {
    position: relative;
    display: block;
    padding: 5px 12px;
    background-color: #fff;
}

.social-img {
    width: 25px !important;
    margin-top: 20px !important;
    margin-left: -20px !important;
    height: 25px !important;
    z-index: 99;
}

.rank-no {
    width: 40px;
}

.rank-light {
    color: #56d1e4;
}

.rank-dark {
    color: #19a5bb;
}

a {
    color: dimgrey;
    text-decoration: none;
    background-color: transparent;
}

.ta-row {
    border: 0;
    border-radius: 10px;
    overflow: hidden;
    transition: transform .15s ease, box-shadow .15s ease;
    background: #ffffff00;
    cursor: pointer;
}

.ta-row:hover {
    transform: translateY(-2px);
    box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, .08);
    background: #e6fafacc;
}

.ta-card {
    border: 0;
    border-radius: 20px;
    overflow: hidden;
    transition: transform .15s ease, box-shadow .15s ease;
    background: #ffffff00;
}

.ta-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, .08);

}

/* ✅ ไฮไลท์ตอน active */
.ta-row-active {
    background: #dff7f7 !important;
    border: 1px solid rgba(25, 165, 187, 0.205);
    box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, .12);
}

.ta-name {
    /* font-weight: 600; */
    font-size: 14px;
}

.minw-0 {
    min-width: 0;
}

/* Stacked progress */
.stack-bg {
    position: relative;
    height: 25px;
    background: #e9ecef;
    border-radius: 999px;
    overflow: hidden;
    width: 100%;
}

.stack-bar {
    position: relative;
    height: 100%;
    display: inline-block;
}

.stack-pos {
    background: #339737;
}

.stack-neu {
    background: rgb(226, 171, 53);
}

.stack-neg {
    background: rgb(201, 49, 43);
}

.stack-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 11px;
    font-weight: 700;
    color: #ffffff;
    line-height: 1;
    white-space: nowrap;
    text-shadow: 0 1px 2px rgba(0, 0, 0, .35);
    pointer-events: none;
}

.chart-box {
    background: #ffffff;
    padding: 4px;
    border-radius: 8px;
}

@media only screen and (max-width: 800px) {
    .rank-no {
        font-size: 15px !important;
    }

    .stack-bg {
        position: relative;
        height: 20px;
        background: #e9ecef;
        border-radius: 999px;
        overflow: hidden;
        width: 100%;
    }

    .d-lg {
        display: none;
    }

    .d-sm {
        display: block;
    }
}
</style>
