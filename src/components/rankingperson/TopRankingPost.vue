<template>
    <div class="container my-3">
        <div class="d-flex align-items-center justify-content-between">
            <div class="text-left">
                All ({{ count | numFormat }}) <b> {{ name }}</b>
            </div>

            <div class="d-flex align-items-center">
                <b-button size="sm" variant="outline-info" @click="printPosts" v-b-tooltip.hover title="Print">
                    <b-icon-printer /> Print
                </b-button>
                <ExportExcelButton :posts="postForExport" :filters="filters"
                    :disabled="loading || (Array.isArray(postForExport) && postForExport.length === 0)"
                    :full-export="true" :prefer-single-shot="true" inline-comments="json" :comments-limit="20"
                    v-if="!loading" />
            </div>
        </div>

        <hr />
        <div>
            <top-accounts :accounts="accountItem" :limit="10" />
        </div>
        <!-- Controls -->
        <div>
            <b-row class="my-1 mb-2">
                <!-- sentiment -->

                <b-col sm="12" md="auto">
                    <b-form-radio-group v-model="selected" :options="options" name="radio-inline"
                        class="mt-1 mb-2 text-left ml-2 rdo" @change="resetAndFetch" />
                </b-col>

                <!-- source -->
                <b-col cols="6" md="">
                    <b-form-select :options="itemSocial" v-model="select_social" @change="resetAndFetch"
                        id="search-input" size="sm" class="mb-2 select-sort" placeholder="Select Platform" />
                </b-col>

                <!-- sort -->
                <b-col cols="6" md="" class="text-right">
                    <b-form-select v-model="sort" :options="optionSort" size="sm" class="mb-2 select-sort"
                        @change="resetAndFetch" />
                </b-col>
            </b-row>

            <!-- name & date range -->
            <b-row class="my-1">
                <b-col md="6" class="mb-2">
                    <b-input-group size="sm">
                        <b-input-group-prepend is-text>ชื่อบุคคล</b-input-group-prepend>
                        <b-form-input v-model.trim="name" @keyup.enter="resetAndFetch"
                            placeholder="เช่น อนุทิน ชาญวีรกูล" />
                        <b-input-group-append>
                            <b-button size="sm" variant="info" @click="resetAndFetch">ค้นหา</b-button>
                        </b-input-group-append>
                    </b-input-group>
                </b-col>
                <b-col md="6" class="mb-2">
                    <section id="date-picker" class="mt-2">
                        <date-picker v-model="local.valueDate" type="date" range placeholder="เลือกช่วงเวลา"
                            class="w-100" size="sm" :disabled-date="d => d > new Date()" value-type="format"
                            format="YYYY-MM-DD" @change="onDateChange" id="date-domain" />
                    </section>
                </b-col>
            </b-row>
        </div>

        <div class="text-center my-4 py-4" v-if="loading">
            <vue-element-loading :active="loading" size="80" background-color="rgba(255, 255, 255, 0.5)"
                color="#17a2b891" />
        </div>

        <!-- Posts -->
        <div>
            <b-alert v-if="!loading && posts.length === 0" show variant="light" class="text-center">
                ไม่มีโพสต์
            </b-alert>

            <timeline-posts v-else :items="posts" mode="posts" sort="recent" :count="count" />

            <div v-if="totalPages > 1" class="text-center my-2 pb-5">
                <div v-if="page === totalPages" class="text-center mb-3 py-5">
                    <vue-element-loading :active="loading" size="80" background-color="rgba(255, 255, 255, 0.5)"
                        color="#17a2b891" />
                </div>
                <b-button v-else variant="outline-info" @click="onPageChange(page + 1)" pill>
                    <span><i class="fa fa-plus" aria-hidden="true"></i> More</span>
                </b-button>
            </div>

            <div class="text-center my-4 py-4" v-if="loading">
                <vue-element-loading :active="loading" size="80" background-color="rgba(255, 255, 255, 0.5)"
                    color="#17a2b891" />
            </div>
        </div>
    </div>
</template>

<script>
import VueGallerySlideshow from "vue-gallery-slideshow";
import moment from "moment";
import "moment/locale/th";
import TimelinePosts from '../timeline/TimelinePosts2.vue';
import ExportExcelButton from "@/components/timeline/ExportExcelButton.vue";
import StaticTimeline from '@/components/timeline/StaticTimeline.vue'
import SentimentBar from "@/components/domain/SentimentBar.vue";
import TopAccounts from '@/components/rankingperson/TopAccount.vue';
const API_ENDPOINT = 'https://api2.cognizata.com/api/v2/facerecognition/getFacePersonUserposts';

export default {
    name: 'PostBoard',
    components: { VueGallerySlideshow, TimelinePosts, ExportExcelButton, StaticTimeline, SentimentBar, TopAccounts },
    props: {
        // ใช้เป็นค่าเริ่มต้น ถ้า route ไม่มี
        defaultName: { type: String, default: 'อนุทิน ชาญวีรกูล' },
        // ค่าเริ่มต้นช่วงเวลา (Asia/Bangkok)
        defaultFrom: { type: String, default: '2025-10-07T00:00' },
        defaultTo: { type: String, default: '2025-10-07T23:59' },
        topAccountsLimit: { type: Number, default: 10 }
    },
    data() {
        // --- helpers ใน scope ของ data() ---
        const toDateOnly = (s) => (s ? String(s).slice(0, 10) : null)

        // หลีกเลี่ยง optional chaining เพื่อความชัวร์
        const q = (this.$route && this.$route.query) ? this.$route.query : {}
        const fromQ = q.from || null
        const toQ = q.to || null

        const defFrom = this.defaultFrom.slice(0, 10) // 'YYYY-MM-DD'
        const defTo = this.defaultTo.slice(0, 10)

        const initFrom = fromQ ? toDateOnly(fromQ) : defFrom
        const initTo = toQ ? toDateOnly(toQ) : defTo

        // เตรียมค่าเริ่มต้นที่ field จริงใช้
        const fromInit = `${initFrom}T00:00`
        const toInit = `${initTo}T23:59`

        return {
            // filters & state
            name: (q.name || this.defaultName),
            from: (fromQ ? `${toDateOnly(fromQ)}T00:00` : fromInit),
            to: (toQ ? `${toDateOnly(toQ)}T23:59` : toInit),

            selected: "1,0,-1",
            select_social: '',
            sort: 'engagement',
            accountItem: [],
            // pagination
            page: Number(q.page || 1),
            limit: 20,
            totalPages: 0,
            count: 0,

            loading: false,

            // selects
            itemSocial: [
                { text: 'All Platform', value: '' },
                { text: 'facebook', value: 'facebook' },
                { text: 'X', value: 'twitter' },
                { text: 'board', value: 'pantip' },
                { text: 'youtube', value: 'youtube' },
                { text: 'instagram', value: 'instagram' },
                { text: 'blockdit', value: 'blockdit' },
                { text: 'tiktok', value: 'tiktok' },
                { text: 'threads', value: 'threads' }
            ],
            options: [
                { text: 'Positive', value: '1' },
                { text: 'Neutral', value: '0' },
                { text: 'Negative', value: '-1' },
                { text: 'ทั้งหมด', value: "1,0,-1" }
            ],
            optionSort: [
                { value: 'engagement', text: 'Engagement' },
                { value: 'desc', text: 'โพสต์ล่าสุด' },
                { value: 'asc', text: 'โพสต์เริ่มต้น' }
            ],

            // date-picker state
            local: {
                valueDate: [initFrom, initTo] // ['YYYY-MM-DD', 'YYYY-MM-DD']
            },

            // data
            posts: [],
            postForExport: [],
            filters: {}
        }
    }
    ,
    methods: {
        startOfDayStr(dateOnly) { return `${dateOnly}T00:00` },
        endOfDayStr(dateOnly) { return `${dateOnly}T23:59` },

        normalizeDateRange(range) {
            // range: [fromDateOnly, toDateOnly] หรือ null
            if (!Array.isArray(range) || range.length < 1) return null
            const from = range[0]
            const to = range[1] || range[0]  // ถ้าเลือกวันเดียว
            return [from, to]
        },

        onDateChange(val) {
            const norm = this.normalizeDateRange(val)
            if (!norm) return

            const [dFrom, dTo] = norm
            // อัปเดตของฝั่ง local string ที่ใช้ buildParams
            this.from = this.startOfDayStr(dFrom)
            this.to = this.endOfDayStr(dTo)

            // โหลดข้อมูลใหม่หน้า 1
            this.resetAndFetch()
        },
        toUtcZ(localStr) {
            // localStr: 'YYYY-MM-DDTHH:mm' (assume Asia/Bangkok)
            if (!localStr) return null
            const m = moment(localStr)
            return m.isValid() ? m.toDate().toISOString() : null
        },
        toUtcZEndOfMinute(localStr) {
            if (!localStr) return null
            const m = moment(localStr).seconds(59).milliseconds(0)
            return m.isValid() ? m.toDate().toISOString() : null
        },
        buildParams({ all = false } = {}) {
            const sentiments = String(this.selected || '1,0,-1')
                .split(',')
                .map(s => s.trim())
                .filter(Boolean)
                .join(',')

            const source = this.select_social ? this.select_social : undefined

            const params = {
                name: this.name,
                from: this.from,           // ใช้ค่าที่อัปเดตจาก date-picker
                to: this.to,  // ใช้ค่าที่อัปเดตจาก date-picker
                sort_by: this.sort || 'engagement',
                page: this.page,
                limit: all ? this.count || 1000 : this.limit,
                sentiment: sentiments,
                top_accounts_limit: this.topAccountsLimit,
                source
            }

            this.filters = { ...params }
            return params
        },
        // ---- API calls ----
        async fetchUserposts() {
            this.loading = true
            try {
                const params = this.buildParams()
                const token = localStorage.getItem('token')
                const headers = token ? { Authorization: `Bearer ${token}` } : {}

                const { data } = await this.axios.get(API_ENDPOINT, { params, headers })

                const rows = Array.isArray(data?.data) ? data.data : []
                this.accountItem = data.top_accounts || []
                if (this.page === 1) {
                    this.posts = rows
                } else {
                    this.posts = [...this.posts, ...rows]
                }

                // รองรับทั้งรูปแบบ pagination ใหม่/เก่า
                const totalPosts = Number(
                    data?.pagination?.total_posts ??
                    data?.count ??
                    0
                )
                this.count = totalPosts || Math.max((this.page - 1) * this.limit + this.posts.length, 0)

                const totalPages = Number(
                    data?.pagination?.total_pages ??
                    data?.totalPages ??
                    (this.count && this.limit ? Math.ceil(this.count / this.limit) : 0)
                )
                this.totalPages = totalPages
            } catch (e) {
                console.error(e)
                this.posts = []
                this.count = 0
                this.totalPages = 0
            } finally {
                this.loading = false
            }
        },

        async fetchAllForExport() {
            // ดึงทั้งหมดสำหรับ export (ครั้งเดียว)
            this.loading = true
            try {
                const params = this.buildParams({ all: true })
                const token = localStorage.getItem('token')
                const headers = token ? { Authorization: `Bearer ${token}` } : {}

                const { data } = await this.axios.get(API_ENDPOINT, { params, headers })
                const rows = Array.isArray(data?.data) ? data.data : []
                this.postForExport = rows
            } catch (e) {
                console.error(e)
                this.postForExport = []
            } finally {
                this.loading = false
            }
        },

        // ---- UI actions ----
        onPageChange(p) {
            if (this.loading) return
            this.page = p
            this.fetchUserposts()
        },
        resetAndFetch() {
            this.page = 1
            this.fetchUserposts()
        },
        printPosts() {
            const STYLE_ID = 'print-style-min-margin';
            if (!document.getElementById(STYLE_ID)) {
                const style = document.createElement('style');
                style.id = STYLE_ID;
                style.media = 'print';
                style.textContent = `
          @page { size: auto; margin: 0; }
          @media print { html, body { margin: 0 !important; padding: 0 !important; } }
        `;
                document.head.appendChild(style);
            }
            this.$nextTick(() => {
                try { window.print(); } catch (e) { console.error(e); }
            });
        }
    },
    mounted() {
        // sync ค่าเริ่มต้นจาก route ถ้ามี
        if (this.$route?.query) {
            if (this.$route.query.name) this.name = this.$route.query.name
            if (this.$route.query.from) this.from = this.$route.query.from + "T00:00:00"
            if (this.$route.query.to) this.to = this.$route.query.to + "T23:59:59"

            if (this.$route.query.source) {
                // ถ้ามาหลายค่าเช่น "twitter,facebook" เลือกอันแรกให้ dropdown; (API ก็ยังรับได้ผ่าน params.build)
                const s = String(this.$route.query.source).split(',').map(x => x.trim()).filter(Boolean)
                this.select_social = s[0] || ''
            }
            if (this.$route.query.sentiment) this.selected = this.$route.query.sentiment
            if (this.$route.query.sort) this.sort = this.$route.query.sort
            if (this.$route.query.page) this.page = Number(this.$route.query.page) || 1
        }
        this.fetchUserposts()
    },

    watch: {
        count: {
            handler() {
                // โหลดข้อมูลทั้งหมดไว้ส่งออก เมื่อ count เปลี่ยน (ดึงครั้งเดียวพอ)
                this.fetchAllForExport()
            }
        }
    },
    filters: {
        numFormat(v) {
            const n = Number(v || 0)
            return n
        }
    }
}
</script>

<style>
.iconimg.b-avatar .b-avatar-img img {
    width: auto;
    background-color: aliceblue;
}
</style>
<style scoped>
.img-issue {
    width: 24px;
    height: 24px;
}

.small-sub {
    font-size: x-small;
}

.btn-secondary {
    background-color: transparent !important;
}

.btn-secondary:hover {
    background-color: transparent !important;
}

#overflow-page>div.container.my-3>div.card.mb-3.shadow-sm.card-photo.sd-g>div {
    padding: 2px !important;
}

.iconimg {
    height: 300px !important;
}

.iconimg .b-avatar>.b-icon {
    width: 8% !important;
    height: auto;
    max-width: 100%;
}

::v-deep .nav-tabs .nav-link {
    border: 0 !important;
}

.badge-warning {
    color: #3a3838;
    background-color: #ffd968;
    font-weight: 500;
}

.badge-success {
    color: #3a3838;
    background-color: #1996006b;
    font-weight: 500;
}

.badge-danger {
    color: #3a3838;
    background-color: #e86c78c7;
    font-weight: 500;
}

.card-photo {
    margin-bottom: 18px;
    border-radius: 15px;
    border: 0px solid rgba(0, 0, 0, .125) !important;
    box-shadow: 0 .125rem .25rem rgba(0, 0, 0, 0.13) !important;
}

.sd-g {
    border: 1px solid #888787 !important;
}

.b-avatar .b-avatar-img img {
    width: auto;
    height: 100%;
    max-height: auto;
    border-radius: inherit;
    object-fit: cover;
}

.row-cols-md-9>* {
    flex: 0 0 auto;
    width: calc(100% / 9);
}

@media only screen and (min-width: 0px) and (max-width: 800px) {
    .rdo {
        zoom: 75%
    }

    .iconimg {
        height: 200px !important;
        width: 600px !important;
    }
}

@media (max-width: 516px) {
    .row-cols-md-9>* {
        width: auto;
    }
}

@page {
    size: A4;
    margin: 0;
}
</style>
