<template>
    <div class="container my-3">
        <b-row>
            <b-col cols="12" md="6">

                <div class="mt-2 text-left h6">
                    <span class="bold" @click="$router.push('/personranking')" style="cursor: pointer;">Person Ranking
                    </span> >
                    <span>Posts</span>
                </div>
                <div class="text-left">
                    All ({{ count.toLocaleString() || 0 }}) <b> {{ name }}</b>
                </div>
            </b-col>
            <b-col cols="12" md="6" class="text-right">
                <div class="btn-ex">
                    <b-button size="sm" variant="outline-info" @click="printPosts" v-b-tooltip.hover title="Print" pill>
                        <b-icon-printer /> Print
                    </b-button>
                    <ExportExcelButton class="d-inline-block" :posts="postForExport" :filters="filters"
                        :disabled="loadingExport || (Array.isArray(postForExport) && postForExport.length === 0)"
                        :full-export="true" :prefer-single-shot="true" inline-comments="json" :comments-limit="20" />
                </div>
            </b-col>
        </b-row>

        <hr />

        <!-- Controls -->
        <div>
            <b-row class="my-1 mb-2">
                <!-- sentiment -->
                <b-col sm="12" md="auto">
                    <b-form-radio-group v-model="selected" :options="options" name="radio-inline"
                        class="mt-1 mb-2 text-left ml-2 rdo" @change="resetAndFetch" size="sm" />
                </b-col>

                <!-- source -->
                <b-col cols="12" md="">
                    <!-- {{ select_social }} -->
                    <v-select :options="itemSocial" v-model="select_social" id="search-source" label="text"
                        :reduce="o => o.value" class="mb-2 select-sort" placeholder="Select Platform" multiple
                        @change="resetAndFetch" />
                    <!-- <b-form-select :options="itemSocial" v-model="select_social" @change="resetAndFetch"
                        id="search-input" size="sm" class="mb-2 select-sort" placeholder="Select Platform" /> -->
                </b-col>

                <!-- sort -->
                <b-col cols="12" md="" class="text-right">

                    <b-form-select v-model="sort" :options="optionSort" size="sm" class="mb-2 select-sort"
                        @change="resetAndFetch" />
                </b-col>
            </b-row>

            <!-- keyword & date range -->
            <b-row class="my-1">
                <b-col md="4" class="mb-2">
                    <b-input-group size="sm">
                        <b-input-group-prepend is-text>keyword</b-input-group-prepend>
                        <!-- พิมพ์ลง keywordInput ไม่กระทบการค้นหาจนกว่าจะกด -->
                        <b-form-input v-model.trim="keywordInput" @keyup.enter="applyKeyword"
                            placeholder="ค้นหา keyword" />
                        <b-input-group-append>
                            <b-button size="sm" variant="info" @click="applyKeyword">ค้นหา</b-button>
                        </b-input-group-append>
                    </b-input-group>
                </b-col>
                <b-col md="4" class="mb-2">
                    <b-input-group size="sm">
                        <b-input-group-prepend is-text>บัญชี</b-input-group-prepend>
                        <b-form-input v-model.trim="accountInput" @keyup.enter="applyAccount"
                            placeholder="ค้นหาบัญชี" />
                        <b-input-group-append>
                            <b-button size="sm" variant="info" @click="applyAccount">ค้นหา</b-button>
                        </b-input-group-append>
                    </b-input-group>
                </b-col>
                <b-col cols="12" md="4" class="text-right">
                    <section id="date-picker" class="w-100">
                        <date-picker v-model="local.valueDate" type="date" range placeholder="เลือกช่วงเวลา"
                            class="w-100" size="sm" :disabled-date="d => d > new Date()" value-type="format"
                            format="YYYY-MM-DD" @change="onDateChange" id="date-domain" />
                    </section>
                </b-col>
            </b-row>
        </div>

        <!-- ChartTime: ใช้ chartFilters (คัดเฉพาะฟิลด์จำเป็น และไม่เปลี่ยน reference ง่าย ๆ) -->
        <div class="mb-3">
            <ChartTime :filters="chartFilters" @range-selected="onChartRangeSelected"
                @range-cleared="onChartRangeCleared" @point-click="onChartPointClick" />
        </div>

        <div>
            <!-- <TopAccountsChart :key="chartKey" :items="accountItem" :limit="chartLimit"
        @add-watch="$emit('add-watch', $event)" /> -->
            <top-accounts :accounts="accountItem" :limit="10" :loading="loading" @filter-account="onFilterAccount" />
        </div>

      

        <!-- Posts -->
        <div>
            <vue-element-loading :active="loading" size="0" background-color="rgba(255,255,255,0.5)" color="#b6ac9a" />
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
import TimelinePosts from "../timeline/TimelinePosts2.vue";
import ExportExcelButton from "@/components/timeline/ExportExcelButton.vue";
import StaticTimeline from "@/components/timeline/StaticTimeline.vue";
import SentimentBar from "@/components/domain/SentimentBar.vue";
import TopAccounts from "@/components/rankingperson/TopAccount.vue";
import TopAccountsChart from "@/components/rankingperson/TopAccountsChart.vue";
import ChartTime from "@/components/rankingperson/ChartTime.vue";
import "vue-select/dist/vue-select.css";
const API_ENDPOINT =
    "https://api2.cognizata.com/api/v2/facerecognition/getFacePersonUserposts";

export default {
    name: "PostBoard",
    components: {
        VueGallerySlideshow,
        TimelinePosts,
        ExportExcelButton,
        StaticTimeline,
        SentimentBar,
        TopAccounts,
        ChartTime,
        TopAccountsChart
    },
    props: {
        defaultName: { type: String, default: "อนุทิน ชาญวีรกูล" },
        defaultFrom: { type: String, default: "2025-10-07T00:00" },
        defaultTo: { type: String, default: "2025-10-07T23:59" },
        topAccountsLimit: { type: Number, default: 10 }
    },
    data() {
        const toDateOnly = s => (s ? String(s).slice(0, 10) : null);
        const q = this.$route && this.$route.query ? this.$route.query : {};
        const fromQ = q.from || null;
        const toQ = q.to || null;

        const defFrom = this.defaultFrom.slice(0, 10);
        const defTo = this.defaultTo.slice(0, 10);

        const initFrom = fromQ ? toDateOnly(fromQ) : defFrom;
        const initTo = toQ ? toDateOnly(toQ) : defTo;

        const fromInit = `${initFrom}T00:00`;
        const toInit = `${initTo}T23:59`;

        return {
            // filters & state
            name: q.name || this.defaultName,
            keyword: "",        // ค่าที่ใช้ค้นหาจริง (apply แล้ว)
            keywordInput: "",   // ค่าที่ผู้ใช้กำลังพิมพ์
            from: fromQ ? `${toDateOnly(fromQ)}T00:00:00` : fromInit,
            to: toQ ? `${toDateOnly(toQ)}T23:59:59` : toInit,
            accountInput: "",
            selected: "1,0,-1",
            select_social: [""],
            sort: "engagement",
            account: "",
            accountItem: [],
            // pagination
            page: Number(q.page || 1),
            limit: 20,
            totalPages: 0,
            count: 0,
            loadingPosts: false,
            loadingExport: false,
            loading: false,

            // selects
            itemSocial: [
                { value: "", text: "All Platform" },
                { value: "facebook", text: "Facebook" },
                { value: "twitter", text: "X" },
                { value: "pantip", text: "Board" },
                { value: "news", text: "News" },
                { value: "youtube", text: "YouTube" },
                { value: "instagram", text: "Instagram" },
                { value: "blockdit", text: "Blockdit" },
                { value: "tiktok", text: "Tiktok" },
                { value: "threads", text: "Threads" }
            ],
            options: [
                { text: "Positive", value: "1" },
                { text: "Neutral", value: "0" },
                { text: "Negative", value: "-1" },
                { text: "ทั้งหมด", value: "1,0,-1" }
            ],
            optionSort: [
                { value: "engagement", text: "Engagement" },
                { value: "desc", text: "โพสต์ล่าสุด" },
                { value: "asc", text: "โพสต์เริ่มต้น" }
            ],

            local: {
                valueDate: [initFrom, initTo]
            },

            posts: [],
            postForExport: [],
            filters: {}
        };
    },
    computed: {
        // prop สำหรับ ChartTime เท่านั้น — ใส่เฉพาะฟิลด์จำเป็น
        chartFilters() {
            const sentiments = String(this.selected || "1,0,-1")
                .split(",").map(s => s.trim()).filter(Boolean).join(",");

            const src = Array.isArray(this.select_social) && this.select_social.length
                ? this.select_social.join(",")
                : undefined;

            return {
                name: this.name,
                from: this.from,
                to: this.to,
                sentiment: sentiments,
                source: src,
                keyword: this.keyword || undefined,
                sort_by: this.sort || "engagement",
                account: this.$route.query.account || undefined,
            };
        }

    },
    methods: {
        onFilterAccount({ uid, name, source }) {
            // ✅ ใช้ uid เป็นตัวกรอง account โดยไม่ไปแทนค่า name
            this.account = uid || '';

            // ทางเลือก: ล็อก platform ตามการ์ด
            // this.select_social = source || '';

            // เคลียร์คีย์เวิร์ดถ้าอยากให้กรองด้วย account ชัดๆ
            this.keyword = '';
            this.keywordInput = '';

            // รีเซ็ตเพจ & โหลด
            this.page = 1;

            // อัปเดต URL ให้แชร์ลิงก์ได้ (ถ้าตั้งชื่อ route เป็น 'posts' ให้ปรับตามโปรเจกต์จริง)
            let query = {
                ...this.$route.query,
                account: this.account,                       // <— เพิ่มลง query
                source: this.source || '',
                name: this.name,                             // คง name เดิม
                from: (this.from || '').slice(0, 10),
                to: (this.to || '').slice(0, 10),
                sentiment: this.selected || '1,0,-1',
                sort: this.sort || 'engagement',
                page: 1,
            }
            const routeObj = this.$router.resolve({
                path: '/personranking/posts',
                query
            })

            const { href } = this.$router.resolve({ path: '/personranking/posts', query });

            // ต้องเรียกภายใน handler ของคลิกโดยตรง เพื่อไม่โดนบล็อก popup
            window.open(href, '_blank');
        },
        startOfDayStr(dateOnly) {
            return `${dateOnly}T00:00:00`;
        },
        endOfDayStr(dateOnly) {
            return `${dateOnly}T23:59:59`;
        },

        _toLocalMinute(isoLike) {
            if (!isoLike) return null;
            const m = moment(isoLike);
            return m.isValid() ? m.format("YYYY-MM-DDTHH:mm") : null;
        },

        normalizeDateRange(range) {
            if (!Array.isArray(range) || range.length < 1) return null;
            const from = range[0];
            const to = range[1] || range[0];
            return [from, to];
        },

        onDateChange(val) {
            const norm = this.normalizeDateRange(val);
            if (!norm) return;
            const [dFrom, dTo] = norm;
            this.from = this.startOfDayStr(dFrom);
            this.to = this.endOfDayStr(dTo);
            this.resetAndFetch();
        },

        toUtcZ(localStr) {
            if (!localStr) return null;
            const m = moment(localStr);
            return m.isValid() ? m.toDate().toISOString() : null;
        },
        toUtcZEndOfMinute(localStr) {
            if (!localStr) return null;
            const m = moment(localStr).seconds(59).milliseconds(0);
            return m.isValid() ? m.toDate().toISOString() : null;
        },
        updateRouteQuery(extra = {}) {
            const sourceStr = Array.isArray(this.select_social) && this.select_social.length
                ? this.select_social.join(",")
                : undefined;

            const query = {
                ...this.$route.query,
                name: this.name,
                from: (this.from || '').slice(0, 10),
                to: (this.to || '').slice(0, 10),
                sentiment: this.selected || '1,0,-1',
                sort: this.sort || 'engagement',
                source: sourceStr,   // <-- แก้ตรงนี้
                page: 1,
                ...extra,
            };
            Object.keys(query).forEach(k => {
                if (query[k] === undefined || query[k] === null || String(query[k]).trim() === '') delete query[k];
            });
            this.$router.replace({ path: '/personranking/posts', query });
        },

        applyKeyword() {
            this.keyword = (this.keywordInput || '').trim();
            this.page = 1;
            // อัปเดต URL (ถ้า keyword ว่างจะลบพารามิเตอร์ออก)
            this.updateRouteQuery({
                keyword: this.keyword || undefined,
                account: this.account || undefined,
            });
            this.fetchUserposts();
        },

        applyAccount() {
            this.account = (this.accountInput || '').trim();
            this.page = 1;
            // อัปเดต URL (ถ้า account ว่างจะลบพารามิเตอร์ออก)
            this.updateRouteQuery({
                account: this.account || undefined,
                keyword: this.keyword || undefined,
            });
            this.fetchUserposts();
        },

        buildParams({ all = false, updateFilters = true } = {}) {
            const sentiments = String(this.selected || "1,0,-1")
                .split(",")
                .map(s => s.trim())
                .filter(Boolean)
                .join(",");

            const source = this.select_social ? this.select_social : undefined;
            const params = {
                name: this.name,
                from: this.from,
                to: this.to,
                sort_by: this.sort || "engagement",
                page: this.page,
                limit: all ? this.count || 1000 : this.limit,
                sentiment: sentiments,
                top_accounts_limit: this.topAccountsLimit,
                source
            };
            // console.log('params',params);

            if (this.keyword) params.keyword = this.keyword; // ใช้ค่าที่ apply แล้ว
            if (this.account) params.account = this.account;
            if (updateFilters) {
                this.filters = this.filters || {};
                Object.assign(this.filters, params);
            }
            return params;
        },

        // ---- API calls ----
        async fetchUserposts() {
            this.loading = true;
            try {
                const params = this.buildParams();
                console.log('pamam', params);

                const token = localStorage.getItem("token");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const { data } = await this.axios.get(API_ENDPOINT, { params, headers });

                const rows = Array.isArray(data?.data) ? data.data : [];
                this.accountItem = data.top_accounts || [];
                if (this.page === 1) {
                    this.posts = rows;
                } else {
                    this.posts = [...this.posts, ...rows];
                }

                const totalPosts = Number(
                    data?.pagination?.total_posts ?? data?.count ?? 0
                );
                this.count =
                    totalPosts ||
                    Math.max((this.page - 1) * this.limit + this.posts.length, 0);

                const totalPages = Number(
                    data?.pagination?.total_pages ??
                    data?.totalPages ??
                    (this.count && this.limit ? Math.ceil(this.count / this.limit) : 0)
                );
                this.totalPages = totalPages;
            } catch (e) {
                console.error(e);
                this.posts = [];
                this.count = 0;
                this.totalPages = 0;
            } finally {
                this.loading = false;
            }
        },

        async fetchAllForExport() {
            this.loadingExport = true;
            try {
                const params = this.buildParams({ all: true, updateFilters: false });
                const token = localStorage.getItem("token");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const { data } = await this.axios.get(API_ENDPOINT, { params, headers });
                const rows = Array.isArray(data?.data) ? data.data : [];
                this.postForExport = rows;
            } catch (e) {
                console.error(e);
                this.postForExport = [];
            } finally {
                this.loadingExport = false;
            }
        },

        // ---- UI actions ----
        onPageChange(p) {
            if (this.loading) return;
            this.page = p;
            this.fetchUserposts();
        },
        resetAndFetch() {
            console.log('sgsdgsdgsdgsdgsdgsdgsdg');

            this.page = 1;
            this.fetchUserposts();
        },
        printPosts() {
            const STYLE_ID = "print-style-min-margin";
            if (!document.getElementById(STYLE_ID)) {
                const style = document.createElement("style");
                style.id = STYLE_ID;
                style.media = "print";
                style.textContent = `
          @page { size: auto; margin: 0; }
          @media print { html, body { margin: 0 !important; padding: 0 !important; } }
        `;
                document.head.appendChild(style);
            }
            this.$nextTick(() => {
                try {
                    window.print();
                } catch (e) {
                    console.error(e);
                }
            });
        },

        // ===== Event จาก ChartTime =====
        onChartRangeSelected(e) {
            const fromLocal = this._toLocalMinute(e?.startIsoLocal);
            const toLocal = this._toLocalMinute(e?.endIsoLocal);
            if (fromLocal && toLocal) {
                this.from = fromLocal;
                this.to = toLocal;
                const fDay = fromLocal.slice(0, 10);
                const tDay = toLocal.slice(0, 10);
                this.local.valueDate = [fDay, tDay];
                this.resetAndFetch();
            }
        },
        onChartRangeCleared() {
            const [initFrom, initTo] = this.local.valueDate || [];
            if (initFrom && initTo) {
                this.from = this.startOfDayStr(initFrom);
                this.to = this.endOfDayStr(initTo);
                this.resetAndFetch();
            }
        },
        onChartPointClick(e) {
            const base = e?.isoLocal || (e?.x ? new Date(e.x).toISOString() : null);
            if (!base) return;
            const m = moment(base);
            if (!m.isValid()) return;
            const start = m.clone().seconds(0).milliseconds(0);
            const end = m.clone().minutes(59).seconds(59).milliseconds(0);
            this.from = start.format("YYYY-MM-DDTHH:mm");
            this.to = end.format("YYYY-MM-DDTHH:mm");
            this.local.valueDate = [this.from.slice(0, 10), this.to.slice(0, 10)];
            this.resetAndFetch();
        }
    },
    mounted() {
        if (this.$route?.query) {
            if (this.$route.query.name) this.name = this.$route.query.name;
            if (this.$route.query.from)
                this.from = this.$route.query.from + "T00:00:00";
            if (this.$route.query.to) this.to = this.$route.query.to + "T23:59:59";

            if (this.$route.query.source) {
                const s = String(this.$route.query.source)
                    .split(",")
                    .map(x => x.trim())
                    .filter(v => v !== "");
                this.select_social = s; // <-- เป็นอาเรย์
            }
            if (this.$route.query.sentiment) this.selected = this.$route.query.sentiment;
            if (this.$route.query.sort) this.sort = this.$route.query.sort;
            if (this.$route.query.page) this.page = Number(this.$route.query.page) || 1;
            if (this.$route.query.account) this.account = this.$route.query.account;
        }

        // ให้ช่องพิมพ์เริ่มต้นเท่ากับ keyword ใช้งานจริง (ตอนแรกว่าง)
        this.keywordInput = this.keyword;

        this.fetchUserposts();
    },

    watch: {
        // โหลดข้อมูลทั้งหมดสำหรับ export เมื่อ count เปลี่ยน (ไม่แตะ filters)
        count: {
            handler() {
                this.fetchAllForExport();
            }
        },
        select_social(val, old) {
            const toArr = x => Array.isArray(x) ? x : (x == null ? [] : [x]);
            const arr = toArr(val);
            const oldArr = toArr(old);

            // (กรณีอยากให้มีปุ่ม All จริง ๆ แนะนำให้ทำเป็น value: "" ใน options)
            // ถ้าไม่เลือกอะไรเลย -> ถือว่า "All" (ล้างเป็น [])
            if (arr.length === 0) {
                this.resetAndFetch()
                // ปล่อย [] แล้วให้ฝั่ง buildParams/updateRouteQuery แปลงเป็น undefined (All)
                return;
            }

            // ถ้ามีทั้ง "" (All) และ platform อื่น
            if (arr.includes("") && arr.length > 1) {
                const clickedAllJustNow = !oldArr.includes("");
                if (clickedAllJustNow) {
                    // เพิ่งคลิก All -> เคลียร์เหลือแค่ All
                    this.select_social = [""];
                } else {
                    // เพิ่งคลิก platform อื่นตอนที่มี All อยู่ -> เอา All ออก
                    this.select_social = arr.filter(v => v !== "");
                }
            }
            this.resetAndFetch()
        }
    },
    filters: {
        numFormat(v) {
            const n = Number(v || 0);
            return n;
        }
    }
};
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
    border: 0px solid rgba(0, 0, 0, 0.125) !important;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.13) !important;
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
    .btn-ex {
        zoom: 80%;
        right: 0px;
        position: absolute;
        /* top: 0px; */
        margin-top: 3px;
    }

    .mx-datepicker-range {
        width: 100% !important;
    }

    .rdo {
        zoom: 75%;
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
