<!-- FaceTopCards.vue -->
<template>
    <b-card no-body class="box-spot-bg py-2 mx-0 position-relative">
        <vue-element-loading :active="loading" size="0" background-color="rgba(255,255,255,0.5)" color="#b6ac9a" />

        <!-- header -->
        <b-row class="px-3 align-items-center">
            <b-col cols="12" md="6" class="text-left">
                <span class="h4 bold">Top 10 </span><span class="text-sub">Mentioned Persons</span>
                <div class="text-muted"><small style="font-size: 15px;">บุคคลที่ถูกกล่าวถึงมากที่สุด</small></div>
            </b-col>

            <b-col cols="12" md="6" class="text-right">
                <!-- <b-button-group size="sm" class="ml-1 btn-sw">
          <b-button :variant="view === 'cards' ? 'info' : 'outline-info'" @click="setView('cards')">
            <i class="fas fa-th-large mr-1"></i> Cards
          </b-button>
          <b-button :variant="view === 'chart' ? 'info' : 'outline-info'" @click="setView('chart')">
            <i class="fas fa-chart-bar mr-1"></i> Chart
          </b-button>
        </b-button-group> -->
                <b-button-group v-if="showToggle" size="sm" style="zoom:80%" class="tool-btn">
                    <b-button :variant="viewMode === 'cards' ? 'light' : 'outline-light'" @click="viewMode = 'cards'"
                        size="sm" style="color: #664b90"> <i class="fas fa-th-large mr-1"></i> Cards</b-button>
                    <b-button :variant="viewMode === 'progress' ? 'light' : 'outline-light'"
                        @click="viewMode = 'progress'" size="sm" style="color: #664b90"> <i
                            class="fas fa-chart-bar mr-1"></i> Chart</b-button>
                </b-button-group>
            </b-col>
        </b-row>

        <!-- ====== MODE: CARDS (เดิม) ====== -->
        <div v-if="viewMode === 'cards'">
            <div v-if="rows.length" class="slider-container px-2">
                <b-button class="slider-button btn-left" @click="scrollLeft" v-b-tooltip.hover title="เลื่อนซ้าย">
                    <i class="fa fa-chevron-left"></i>
                </b-button>

                <div class="slider" ref="slider">
                    <div class="d-flex box-flex-small">
                        <div v-for="(item, i) in rows" :key="item.name + i" class="slider-item px-2">
                            <b-card class="ta-card h-100 shadow-sm" :class="{ 'ta-top': i < 3 }" body-class="p-0"
                                @click="onCardClick(item)" style="cursor:pointer">
                                <div class="d-flex justify-content-between p-2">
                                    <span class="position-absolute h6 py-2 bold pt-3 px-1" style="color:#7782bf;">{{ i +
                                        1 }}</span>
                                </div>

                                <div class="ta-hero d-flex flex-column align-items-center justify-content-center">
                                    <b-avatar :src="item.avatar || null"
                                        :text="!item.avatar ? initials(item.name) : null" size="100" variant="light"
                                        class="mb-2 avatar-d" style="background-color:#918f8a !important;" />
                                    <div class="text-center px-3">
                                        <div class="mb-0 text-truncate small">{{ item.name }}</div>
                                    </div>

                                    <div class="py-0 my-0"><small class="text-muted">กล่าวถึง</small></div>
                                    <div class="py-0 my-0">
                                        <span class="bold mx-1">{{ item.mentions | numFormat }}</span>
                                        <small class="text-muted" style="font-size:x-small;">โพสต์</small>
                                    </div>
                                </div>

                                <div class="px-3 pb-3"></div>
                            </b-card>
                        </div>
                    </div>
                </div>

                <b-button class="slider-button btn-right" @click="scrollRight" v-b-tooltip.hover title="เลื่อนขวา">
                    <i class="fa fa-chevron-right"></i>
                </b-button>
            </div>

            <div v-else-if="!loading" class="py-5 text-center text-muted">ไม่พบรายการที่ตรงกับเงื่อนไข</div>
        </div>

        <!-- ====== MODE: PROGRESS (ใหม่) ====== -->
        <div v-else>
            <b-list-group flush class="chart-box">
                <b-list-group-item v-for="(item, i) in rows" :key="item.name + i" class="ta-row"
                    @click="onCardClick(item)">
                    <b-row align-v="center">
                        <!-- left: rank + avatar + name -->
                        <b-col cols="4">
                            <div class="d-flex align-items-center w-100">
                                <span class="h5 bold py-0 my-0 rank-no mr-md-3"
                                    :class="(i % 2 === 0) ? 'rank-dark' : 'rank-light'">
                                    {{ i + 1 }}
                                </span>

                                <b-avatar :src="item.avatar || null" :text="!item.avatar ? initials(item.name) : null"
                                    size="40" variant="light" class="mr-2 flex-shrink-0" />

                                <div class="minw-0 d-lg">
                                    <div class="ta-name text-truncate">{{ item.name }}</div>
                                </div>
                            </div>
                        </b-col>

                        <!-- right: progress + count -->
                        <b-col cols="8">
                            <div class="w-100">
                                <div class="text-left d-sm">
                                    <div class="ta-name text-truncate">{{ item.name }}</div>
                                </div>
                                <div class="d-flex align-items-center w-100">
                                    <b-progress :max="maxMentions" height="15px" class="w-100 mr-2 ta-progress">
                                        <b-progress-bar :value="item.mentions" variant="info" />
                                    </b-progress>
                                    <b-badge pill variant="warning" class="flex-shrink-0">
                                        {{ item.mentions | numFormat }}
                                    </b-badge>
                                </div>
                            </div>
                        </b-col>
                    </b-row>
                </b-list-group-item>
            </b-list-group>

            <div v-if="rows.length === 0 && !loading" class="text-center text-muted py-4">
                ไม่พบรายการที่ตรงกับเงื่อนไข
            </div>
        </div>

        <b-alert show variant="danger" v-if="error" class="mb-0 rounded-0">
            โหลดข้อมูลล้มเหลว: {{ error }}
        </b-alert>
    </b-card>
</template>

<script>
import axios from 'axios'

export default {
    name: 'FaceTopCards',
    emits: ['filter-account'],
    props: {
        apiBase: { type: String, default: 'https://api2.cognizata.com' },
        endpoint: { type: String, default: '/api/v2/facerecognition/getFacePersonTop' },
        from: { type: String },
        to: { type: String },
        source: { type: [Array, String], default: () => [] },
        sentiment: { type: [String, Number, Array, null] },
        names: { type: Array },
        limit: { type: Number, default: 10 },

        /* === ใหม่: ควบคุมโหมดแสดงผล === */
        view: { type: String, default: 'cards' }, // 'cards' | 'progress'
        showToggle: { type: Boolean, default: true },

        refreshSec: { type: Number, default: 0 }
    },
    data() {
        return {
            rawList: [],
            error: null,
            loading: false,
            timer: null,

            /* state ภายในสำหรับสลับโหมด */
            viewMode: this.view
        }
    },
    filters: {
        numFormat(n) {
            return new Intl.NumberFormat().format(Number(n || 0))
        }
    },
    computed: {
        badgeText() {
            const fmt = new Intl.DateTimeFormat('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
            const isValid = d => d instanceof Date && !isNaN(d)
            const f = this.from ? new Date(this.from) : null
            const t = this.to ? new Date(this.to) : null

            if (isValid(f) && isValid(t)) return `${fmt.format(f)} – ${fmt.format(t)}`
            if (isValid(t)) return fmt.format(t)
            if (isValid(f)) return fmt.format(f)
            return '—'
        },
        remainingText() {
            if (!this.to) return '—'
            const end = new Date(this.to).getTime()
            if (isNaN(end)) return '—'
            const now = Date.now()
            let ms = Math.max(0, end - now)
            const d = Math.floor(ms / 86400000); ms -= d * 86400000
            const h = Math.floor(ms / 3600000); ms -= h * 3600000
            const m = Math.floor(ms / 60000)
            return `${d}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`
        },

        // 1) แปลง, เก็บ mentions มากสุดต่อชื่อ (dedupe)
        normalized() {
            const rows = (this.rawList || []).map(this.normalizeItem)
            const byName = new Map()
            for (const r of rows) {
                const k = (r.name || '').trim()
                if (!byName.has(k) || r.mentions > (byName.get(k).mentions || 0)) byName.set(k, r)
            }
            return Array.from(byName.values())
        },

        // 2) เรียงมาก→น้อย; เท่ากันเรียงชื่อ A→Z
        sorted() {
            return this.normalized.slice().sort((a, b) => {
                const dm = (b.mentions || 0) - (a.mentions || 0)
                if (dm !== 0) return dm
                return (a.name || '').localeCompare((b.name || ''), 'th', { sensitivity: 'base' })
            })
        },

        // 3) ตัดจำนวนตาม limit
        rows() {
            return this.limit > 0 ? this.sorted.slice(0, this.limit) : this.sorted
        },

        // ใช้คำนวณ max ของ progress
        maxMentions() {
            return Math.max(1, ...this.rows.map(r => r.mentions || 0))
        }
    },
    watch: {
        from: 'fetchData',
        to: 'fetchData',
        source: 'fetchData',
        sentiment: { handler: 'fetchData', deep: true },
        names: { handler: 'fetchData', deep: true },
        limit: 'fetchData',
        view(v) { this.viewMode = v } // หาก parent เปลี่ยน prop view ให้ sync
    },
    mounted() {
        this.fetchData()
        if (this.refreshSec > 0) this.timer = setInterval(this.fetchData, this.refreshSec * 1000)
    },
    beforeDestroy() { if (this.timer) clearInterval(this.timer) },
    methods: {
        onCardClick(item) {
            this.$emit('filter-account', { name: item.name })
        },

        scrollLeft() { const s = this.$refs.slider; if (s) s.scrollLeft -= 300 },
        scrollRight() { const s = this.$refs.slider; if (s) s.scrollLeft += 300 },

        initials(name = '') {
            const parts = String(name).replace(/\s+/g, ' ').trim().split(' ').filter(Boolean)
            const first = (parts[0] || '').charAt(0)
            const last = parts.length > 1 ? (parts[parts.length - 1] || '').charAt(0) : ''
            return (first + last || first || '?').toUpperCase()
        },

        buildUrl() {
            const url = new URL(this.endpoint, this.apiBase)
            if (this.from) url.searchParams.set('from', this.from)
            if (this.to) url.searchParams.set('to', this.to)

            if (this.source !== null && this.source !== undefined) {
                if (Array.isArray(this.source)) {
                    if (this.source.length) url.searchParams.set('source', this.source.join(','))
                } else if (typeof this.source === 'string' && this.source.trim()) {
                    url.searchParams.set('source', this.source.trim())
                }
            }

            if (this.sentiment !== null && this.sentiment !== undefined) {
                const s = Array.isArray(this.sentiment) ? this.sentiment.join(',') : String(this.sentiment)
                url.searchParams.set('sentiment', s)
            }
            if (this.names && this.names.length) url.searchParams.set('name', this.names.join(','))
            if (this.limit) url.searchParams.set('limit', String(this.limit))
            return url.toString()
        },

        async fetchData() {
            try {
                this.loading = true
                this.error = null
                const url = this.buildUrl()
                const { data } = await axios.get(url, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                const list = Array.isArray(data) ? data : (data && (data.data || data.items)) || []
                this.rawList = list
            } catch (e) {
                this.error = e?.message || 'ไม่สามารถดึงข้อมูลได้'
                this.rawList = []
            } finally {
                this.loading = false
            }
        },

        normalizeItem(raw = {}) {
            const name = raw.person_name || raw.name || 'ไม่ทราบชื่อ'
            const mentions = pickNum(raw.mentions, raw.total, raw.count, raw.posts, raw.value)
            const avatar =
                (Array.isArray(raw.image_paths) && (raw.image_paths[0] || raw.image_paths[1] || raw.image_paths[2])) ||
                raw.avatar || null
            return { name, mentions, avatar }

            function pickNum(...nums) {
                for (const n of nums) {
                    const v = Number(n)
                    if (!isNaN(v)) return v
                }
                return 0
            }
        }
    }
}
</script>

<style scoped>
.progress-bar {
    background: linear-gradient(70deg, #7ac9d6 40%, #9378bf 100%) !important;
}

/* โครงสไลด์ + สไตล์การ์ด */
.box-spot-bg {
    background: linear-gradient(to top, #b8d3d3a4, #decff0);
    border-radius: 11px;
    border: 0px;
    margin-bottom: 10px;
    min-height: 100px;
}

.slider-container {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    border-radius: 15px;
}

.slider {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    scroll-behavior: smooth;
    gap: 10px;
    width: 100%;
}

.slider::-webkit-scrollbar {
    display: none;
}

.box-flex-small {
    width: 65vw;
    padding: 0 20px;
}

.slider-item {
    flex: 0 0 auto;
    width: 200px;
}

.slider-button {
    background-color: #3f3b3b00;
    color: #706c6c;
    border: none;
    padding: 10px 15px;
    margin: 0 4px;
    cursor: pointer;
    border-radius: 15px;
    font-size: 20px;
}

.slider-button:hover {
    background-color: #fed16e;
    color: #fff;
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

.ta-card.ta-top {
    box-shadow: 0 0.85rem 1.6rem rgba(0, 0, 0, .12);
}

.ta-hero {
    padding: 20px 16px 8px;
    border-radius: 20px;
    background: #ffffffc5;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
}

.text-truncate {
    max-width: 180px;
}

.avatar-d {}

@media (max-width: 800px) {
    div.card.box-spot-bg.py-2.mx-0.position-relative.velmld-parent>div:nth-child(3)>div>div:nth-child(1)>div>div.col-4 {
        padding-left: 0px !important;
        padding-right: 0px !important;
    }

    .slider-button.btn-left {
        background: #fed06ebf;
        color: white;
        border: none;
        padding: 5px 11px;
        border-radius: 15px;
        font-size: 20px;
        z-index: 999;
        left: -18px;
        position: absolute;
    }

    .slider-button.btn-right {
        position: absolute;
        right: -18px;
        padding: 5px 11px;
        background: #fed06ebf;
        color: white;
    }

    .box-flex-small {
        width: 98vw;
        padding: 0 0px;
    }

    .slider-item {
        width: 140px;
    }

    .text-truncate[data-v-71e49aa4] {
        max-width: 100px;
    }

    .avatar-d {
        width: 50px !important;
        height: 50px !important;
    }
}

/* ===== Progress mode styles (ใหม่) ===== */
.list-group-item {
    position: relative;
    display: block;
    padding: 5px 12px;
    background-color: #fff;
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
    cursor: pointer;
    transition: background 0.12s ease;
}

.ta-row:hover {
    background: #f9fafb;
}

.ta-name {
    font-weight: 600;
    font-size: 14px;
}

.minw-0 {
    min-width: 0;
}

.ta-progress ::v-deep .progress-bar {
    transition: width 0.35s ease;
}

.chart-box {
    background: #ffffff;
    padding: 4px;
    border-radius: 8px;
}

.d-lg {
    display: inline;
}

.d-sm {
    display: none;
}

@media only screen and (min-width:0px) and (max-width:800px) {
    .text-sub {
        font-size: 13px !important;
    }

    .h4 {
        font-size: 17px !important;
    }

    div.text-left.col-md-6.col-12>div>small {
        font-size: 13px !important;
    }

    .tool-btn {
        position: absolute;
        top: -27px;
        right: 6px;
        zoom: 70% !important;

    }

    .d-lg {
        display: none;
    }

    .d-sm {
        display: block;
    }
}
</style>
