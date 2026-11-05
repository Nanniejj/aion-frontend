<template>
    <div class="priority-page py-3 mt-3">
        <!-- ===== hero header ===== -->
        <div class="priority-hero mb-3">
            <div class="hero-left">
                <div class="hero-badge"><i class="fas fa-chalkboard-user"></i></div>
                <div>
                    <div class="hero-title">เป้าหมายพิเศษ</div>
                    <div class="hero-sub">เก็บข้อมูลแบบพิเศษ (เฝ้าระวังเข้มข้น)</div>
                </div>
            </div>

            <div class="hero-right">
                <div class="quota-box" :class="{ full: totalRows >= maxTargets }">
                    <div class="quota-top">
                        <span class="quota-label"><i class="fas fa-users mr-1"></i> โควตา</span>
                        <span class="quota-num"><b>{{ totalRows }}</b> / {{ maxTargets }}</span>
                    </div>
                    <div class="quota-bar"><div class="quota-fill" :style="{ width: quotaPercent + '%' }"></div></div>
                    <div class="quota-remain">
                        {{ remainingQuota > 0 ? `เพิ่มได้อีก ${remainingQuota} บัญชี` : 'เต็มโควตาแล้ว' }}
                    </div>
                </div>
                <!-- ฟอร์มเดียวกับเพิ่มเป้าหมายปกติ (validate/preview เหมือนกัน) ต่างแค่ mode priority -->
                <CreateMonitor
                    v-if="totalRows < maxTargets"
                    class="pf-add"
                    tabsMonitor="targetlist"
                    mode="priority"
                    :maxTargets="remainingQuota"
                    @close="onAdded"
                />
                <button v-else class="btn btn-add-priority pf-add" disabled>
                    <i class="fas fa-lock mr-1" /> เพิ่มเป้าหมายพิเศษ
                </button>
            </div>
        </div>

        <!-- ===== filters ===== -->
        <div class="priority-filters mb-3">
            <div class="pf-source-wrap">
                <span class="pf-source-icon">
                    <img v-if="sourceImg(filters.source)" :src="sourceImg(filters.source)" class="social-imgs" />
                    <i v-else class="fas fa-globe-asia"></i>
                </span>
                <b-form-select class="pf-source" id="priority-source-select" v-model="filters.source"
                    :options="sourceOptions"></b-form-select>
            </div>
            <b-input-group class="pf-follower">
                <template #prepend>
                    <span class="input-group-text pf-prepend"><i class="fas fa-user-friends mr-2"></i>ผู้ติดตาม</span>
                </template>
                <b-form-select id="priority-follower-select" v-model="followers"
                    :options="followerOptions" @change="onFilterChange"></b-form-select>
            </b-input-group>
            <b-input-group class="pf-search">
                <template #prepend>
                    <span class="input-group-text pf-prepend-plain"><i class="fas fa-search"></i></span>
                </template>
                <b-form-input id="search-priority" @input="checkSearch" v-model="search"
                    @keyup.enter="onSearch()" placeholder="ค้นหาเป้าหมาย..."></b-form-input>
                <b-input-group-append>
                    <b-button :pressed="false" @click="onSearch()" class="btn-teal btn-search px-4">ค้นหา</b-button>
                </b-input-group-append>
            </b-input-group>
        </div>

        <!-- backend-offline notice -->
        <b-alert :show="backendOffline" variant="warning" class="d-flex align-items-center offline-alert">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            <span>โหลดรายการเป้าหมายพิเศษไม่สำเร็จ</span>
            <b-button size="sm" variant="outline-dark" class="ml-auto" @click="apiMonitorList()">ลองใหม่</b-button>
        </b-alert>

        <!-- ===== list ===== -->
        <div class="boxlist-card">
            <vue-element-loading :active="load" size="80" background-color="rgba(255, 255, 255, 0.6)" color="#e0a93c" />

            <b-table
                v-if="data.length !== 0"
                class="priority-table"
                :items="data || []"
                :fields="fields"
                responsive show-details
                :busy="load"
                thead-class="d-none"
                stacked="md"
                empty-filtered-text="ไม่พบข้อมูล"
            >
                <template #cell(id)="row">
                    <span class="row-index">{{ row.index + 1 + (currentPage - 1) * perPage }}</span>
                </template>

                <template #cell(name)="row">
                    <div class="d-flex justify-content-start align-items-center">
                        <span class="avatar-wrap mr-3">
                            <b-avatar :src="row.item.profile_image" size="44" class="avatar-priority-border"></b-avatar>
                            <span class="avatar-badge"><i class="fas fa-star"></i></span>
                        </span>
                        <div class="text-truncate target-name" @click="linkToProfile(row.item)"
                            v-b-tooltip.hover title="ดูรายละเอียด">
                            <div class="bold name-text text-truncate">{{ row.item.name || row.item.uid }}</div>
                            <small class="follower-text">
                                <i class="fas fa-user-friends mr-1"></i>{{ formatNumber(row.item.followers) }} ผู้ติดตาม
                            </small>
                        </div>
                    </div>
                </template>

                <template #cell(source)="row">
                    <a :href="row.item.link_original" target="_blank" class="source-chip">
                        <img v-if="sourceImg(row.item.source)" :src="sourceImg(row.item.source)" class="social-img" />
                        <span class="text-truncate">{{ row.item.uid }}</span>
                        <i class="fas fa-external-link-alt ml-2 ext-icon"></i>
                    </a>
                </template>

                <template #cell(insert_timestamp)="row">
                    <span class="time-text"><i class="far fa-clock mr-1"></i>{{ formatDate(row.item.insert_timestamp) }}</span>
                </template>

                <template #cell(action)="row">
                    <div class="d-flex justify-content-end align-items-center action-group">
                        <button class="act-btn act-view" v-b-tooltip.hover title="ดูรายละเอียด"
                            @click="linkToProfile(row.item)"><i class="fas fa-list-ul"></i></button>
                        <button class="act-btn act-del" v-b-tooltip.hover title="เลิกติดตาม"
                            @click="delTarget(row.item)"><i class="fas fa-user-alt-slash"></i></button>
                    </div>
                </template>
            </b-table>

            <!-- empty state -->
            <div v-if="data.length === 0 && !load" class="empty-state">
                <div class="empty-icon"><i class="fas fa-chalkboard-user"></i></div>
                <div class="empty-title">ยังไม่มีเป้าหมายพิเศษ</div>
                <small class="text-muted">กด “เพิ่มเป้าหมายพิเศษ” ด้านบน เพิ่มได้สูงสุด {{ maxTargets }} บัญชี</small>
            </div>

            <!-- pagination -->
            <div class="d-flex justify-content-center mt-3 pb-3" v-if="totalRows > perPage">
                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
                    @change="onPageChange" align="center" first-number last-number></b-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import CreateMonitor from "@/components/monitorlist/CreateMonitor.vue";

const API_BASE = "https://api2.cognizata.com/api/v2/monitor";

export default {
    name: "MonitorPriorityTable",
    components: { CreateMonitor },
    props: {
        type: { type: String, default: "monitorlist" },
        reface: { type: [Boolean, Number], default: false }
    },
    data() {
        return {
            maxTargets: 20,
            load: false,
            backendOffline: false,
            data: [],
            totalRows: 0,
            search: "",
            debounceTimeout: null,
            currentPage: 1,
            perPage: 20,
            filters: { source: "" },
            followers: null,
            sourceOptions: [
                { value: '', text: 'All Platform' },
                { value: 'facebook', text: 'Facebook' },
                { value: 'twitter', text: 'X' },
                { value: 'pantip', text: 'Board' },
                { value: 'news', text: 'News' },
                { value: 'youtube', text: 'YouTube' },
                { value: 'instagram', text: 'Instagram' },
                { value: 'blockdit', text: 'Blockdit' },
                { value: 'tiktok', text: 'Tiktok' },
                { value: 'threads', text: 'Threads' }
            ],
            followerOptions: [
                { value: null, text: 'ไม่ระบุ' },
                { value: 1000, text: 'มากกว่า 1,000 follower' },
                { value: 10000, text: 'มากกว่า 10,000 follower' },
                { value: 100000, text: 'มากกว่า 100,000 follower' },
                { value: 1000000, text: 'มากกว่า 1,000,000 follower' }
            ],
            fields: [
                { key: 'id', label: '#' },
                { key: 'name', label: 'name' },
                { key: 'source', label: 'source' },
                { key: 'insert_timestamp', label: 'เวลาล่าสุด' },
                { key: 'action', label: '' }
            ],
            sourceImages: {
                facebook: require('@/assets/Facebook.png'),
                twitter: require('@/assets/Twitter.png'),
                pantip: require('@/assets/board.png'),
                blockdit: require('@/assets/Blockdit.png'),
                instagram: require('@/assets/Instagram.png'),
                youtube: require('@/assets/Youtube.png'),
                news: require('@/assets/News.png'),
                tiktok: require('@/assets/Tiktok.png'),
                threads: require('@/assets/Threads.png')
            }
        };
    },
    computed: {
        // โควตาที่เหลือ ใช้ cap จำนวนที่เพิ่มได้ในแต่ละครั้ง (existing + new <= maxTargets)
        remainingQuota() {
            return Math.max(0, this.maxTargets - this.totalRows);
        },
        quotaPercent() {
            if (!this.maxTargets) return 0;
            return Math.min(100, Math.round((this.totalRows / this.maxTargets) * 100));
        }
    },
    watch: {
        reface() { this.apiMonitorList(); },
        type() {
            this.data = [];
            this.totalRows = 0;
            this.currentPage = 1;
            this.apiMonitorList();
        },
        "filters.source"() {
            this.currentPage = 1;
            this.apiMonitorList();
        }
    },
    methods: {
        authHeaders() {
            return {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json"
            };
        },
        sourceImg(source) {
            return this.sourceImages[source] || null;
        },
        formatNumber(num) {
            if (num == null) return '0';
            if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
            return num.toString();
        },
        formatDate(dateStr) {
            if (!dateStr) return '-';
            const date = new Date(dateStr);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            let hours = date.getHours();
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return `${day}/${month}/${year} , ${hours}:${minutes}:${seconds} ${ampm}`;
        },
        checkSearch() {
            if (!this.search) this.apiMonitorList();
        },
        onSearch() {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                this.currentPage = 1;
                this.apiMonitorList();
            }, 500);
        },
        // เปลี่ยน filter จำนวนผู้ติดตาม -> รีเซ็ตหน้าแล้วโหลดใหม่
        onFilterChange() {
            this.currentPage = 1;
            this.apiMonitorList();
        },
        onPageChange(page) {
            this.currentPage = page;
            this.$nextTick(() => this.apiMonitorList());
        },
        // CreateMonitor emit('close') หลังเพิ่มสำเร็จ -> รีโหลดลิสต์ + โควตา
        onAdded() {
            this.currentPage = 1;
            this.apiMonitorList();
            this.$emit('setReface');
        },

        // GET /api/v2/monitor/getMonitor?type=monitorlist
        apiMonitorList() {
            this.load = true;
            const requestId = (this._requestId || 0) + 1;
            this._requestId = requestId;

            const config = {
                method: "get",
                url: `${API_BASE}/getMonitor`,
                params: {
                    type: this.type || 'monitorlist',
                    page: this.currentPage,
                    limit: this.perPage,
                    search: this.search,
                    ...(this.filters.source && { source: this.filters.source }),
                    ...(this.followers != null && { followers: this.followers })
                },
                headers: this.authHeaders()
            };

            this.axios(config)
                .then((response) => {
                    if (requestId !== this._requestId) return;
                    const resData = response.data || {};
                    this.data = resData.data || [];
                    this.totalRows = resData.pagination?.totalCount ?? this.data.length;
                    this.backendOffline = false;
                    this.load = false;
                })
                .catch((error) => {
                    if (requestId !== this._requestId) return;
                    this.load = false;
                    this.data = [];
                    this.totalRows = 0;
                    // backend ยังไม่พร้อม (type ใหม่ยังไม่ขึ้น server) -> แสดงข้อความโหลดไม่สำเร็จ
                    this.backendOffline = true;
                    console.warn("[Priority] getMonitor unavailable:", error?.response?.status || error?.message);
                });
        },

        // เปิดหน้ารายละเอียดเหมือนโปรไฟล์ target ปกติ (เปิดแท็บใหม่)
        linkToProfile(item) {
            const routeData = this.$router.resolve({
                name: "MonitorProfile",
                query: {
                    id: item._id,
                    uid: item.uid ? item.uid.replace('#', '') : item.uid,
                    source: item.source,
                    type: 'targetlist'
                },
            });
            window.open(routeData.href, "_blank");
        },

        // DELETE /api/v2/monitor/removeTargetMonitor
        delTarget(item) {
            Swal.fire({
                title: 'เลิกติดตามบัญชีนี้?',
                text: `${item.name || item.uid} จะถูกนำออกจากเป้าหมายพิเศษ`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'เลิกติดตาม',
                cancelButtonText: 'ยกเลิก',
                customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then((result) => {
                if (!result.isConfirmed) return;
                const config = {
                    method: "delete",
                    url: `${API_BASE}/removeTargetMonitor`,
                    data: { target_ids: [item._id] },
                    headers: this.authHeaders()
                };
                this.axios(config)
                    .then(() => {
                        this.apiMonitorList();
                        this.$emit('setReface');
                        Swal.fire({ title: 'สำเร็จ', text: 'เลิกติดตามเรียบร้อยแล้ว', icon: 'success', timer: 2000, showConfirmButton: false });
                    })
                    .catch((error) => {
                        console.error("[Priority] removeTargetMonitor:", error);
                        Swal.fire('ผิดพลาด', 'ไม่สามารถเลิกติดตามได้', 'error');
                    });
            });
        }
    },
    mounted() {
        this.apiMonitorList();
    }
};
</script>

<style scoped>
* { font-family: "Prompt", "FontAwesome", sans-serif; }
.bold { font-weight: 600; }

/* ---------- hero ---------- */
.priority-hero {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 18px;
    border-radius: 14px;
    background: linear-gradient(120deg, #fff8e6 0%, #ffefc4 55%, #fed16e 100%);
    border: 1px solid #fbe3a4;
    box-shadow: 0 6px 18px rgba(224, 169, 60, 0.15);
    position: relative;
    overflow: hidden;
}
.priority-hero::before {
    content: "\f51c";
    font-family: "Font Awesome 6 Free", "Font Awesome 5 Free";
    font-weight: 900;
    position: absolute;
    right: -10px;
    bottom: -28px;
    font-size: 96px;
    color: rgba(255, 255, 255, 0.35);
    pointer-events: none;
}
.hero-left { display: flex; align-items: center; gap: 12px; text-align: left; position: relative; }
.hero-badge {
    width: 40px; height: 40px;
    border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    color: #fff;
    background: linear-gradient(135deg, #f6c453, #e0a93c);
    box-shadow: 0 4px 10px rgba(224, 169, 60, 0.45);
}
.hero-title { font-size: 18px; font-weight: 700; color: #4c412d; line-height: 1.2; }
.hero-tag {
    font-size: 11px; font-weight: 700; letter-spacing: 1px;
    vertical-align: middle;
    background: #4c412d; color: #fed16e;
    padding: 2px 8px; border-radius: 6px; margin-left: 6px;
}
.hero-sub { font-size: 13px; color: #7a6a4a; margin-top: 0; }

/* ห้ามใส่ z-index ตรงนี้: จะสร้าง stacking context ทำให้ popup ของ CreateMonitor ถูกปุ่มค้นหาทับ */
.hero-right { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; position: relative; }
.quota-box {
    background: rgba(255, 255, 255, 0.85);
    border-radius: 12px;
    padding: 5px 12px;
    min-width: 180px;
    backdrop-filter: blur(4px);
}
.quota-top { display: flex; justify-content: space-between; align-items: baseline; color: #4c412d; }
.quota-label { font-size: 13px; color: #7a6a4a; }
.quota-num { font-size: 15px; }
.quota-num b { font-size: 16px; }
.quota-bar { height: 5px; background: #f3e6c4; border-radius: 99px; margin: 4px 0 2px; overflow: hidden; }
.quota-fill {
    height: 100%;
    background: linear-gradient(90deg, #f6c453, #e0a93c);
    border-radius: 99px;
    transition: width .4s ease;
}
.quota-remain { font-size: 12px; color: #9a8762; text-align: right; }
.quota-box.full .quota-fill { background: linear-gradient(90deg, #ef9a9a, #e57373); }
.quota-box.full .quota-remain { color: #b23b3b; font-weight: 600; }

.pf-add { flex: 0 0 auto; min-width: 190px; }
.btn-add-priority {
    border: 0;
    background: #e9f6f8;
    color: #0f8a9c;
    font-size: 15px;
    padding: 8px 16px;
    border-radius: 999px;
    white-space: nowrap;
}
.btn-add-priority:disabled { cursor: not-allowed; }

/* ---------- filters ---------- */
.priority-filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    background: #fff;
    padding: 12px 14px;
    border-radius: 14px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
.pf-source-wrap { display: flex; align-items: center; gap: 8px; flex: 1 1 200px; max-width: 260px; }
.pf-source-icon {
    flex: 0 0 auto;
    width: 38px; height: 38px;
    border-radius: 10px;
    background: #fff4d6;
    display: flex; align-items: center; justify-content: center;
    color: #e0a93c; font-size: 18px;
}
.pf-source { flex: 1 1 auto; }
.pf-follower { flex: 2 1 280px; }
.pf-search { flex: 2 1 260px; }
.pf-prepend { background: #fff4d6; border-color: #ced4da; color: #4c412d; white-space: nowrap; }
.pf-prepend-plain { background: #fff; color: #afa89d; border-right: 0; }
.pf-search ::v-deep .form-control { border-left: 0; }
.priority-filters ::v-deep .form-control,
.priority-filters ::v-deep .custom-select { height: 38px; }
.priority-filters ::v-deep .form-control:focus,
.priority-filters ::v-deep .custom-select:focus {
    border-color: #f6c453;
    box-shadow: 0 0 0 0.15rem rgba(246, 196, 83, 0.3);
}
/* ปุ่มสีฟ้าอมเขียว เหมือนปุ่ม "เพิ่มเป้าหมาย" ในการ์ดแนะนำ */
.btn-teal,
.pf-add ::v-deep .btn-add {
    border: none;
    border-radius: 999px;
    color: #fff;
    background: linear-gradient(135deg, #17a3b8, #0f8a9c);
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    transition: filter 0.15s ease, transform 0.05s ease;
}
.btn-teal:hover, .btn-teal:focus,
.pf-add ::v-deep .btn-add:hover {
    color: #fff;
    background: linear-gradient(135deg, #17a3b8, #0f8a9c);
    filter: brightness(1.06);
}
.pf-add ::v-deep .btn-add:hover .fa-plus { background: transparent; }
.btn-teal:active,
.pf-add ::v-deep .btn-add:active { transform: scale(0.98); }
.pf-add ::v-deep .btn-add { padding: 8px 16px; }
.pf-search ::v-deep .input-group-append .btn { border-radius: 0 999px 999px 0; }

.offline-alert { border-radius: 12px; }

/* ---------- list ---------- */
.boxlist-card {
    background: #fff;
    border-radius: 16px;
    position: relative;
    min-height: 200px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}
.list-head {
    display: flex; justify-content: space-between; align-items: center;
    padding: 14px 20px;
    border-bottom: 1px solid #f3eee4;
    font-weight: 600; color: #4c412d;
}
.list-count {
    font-size: 13px; font-weight: 500;
    background: #fff4d6; color: #7a6a4a;
    padding: 2px 12px; border-radius: 99px;
}

.priority-table { margin-bottom: 0; }
.priority-table ::v-deep td {
    vertical-align: middle;
    border-top: 1px solid #f6f2ea;
    padding: 12px 16px;
}
.priority-table ::v-deep tbody tr:first-child td { border-top: 0; }

.row-index {
    display: inline-flex; align-items: center; justify-content: center;
    width: 30px; height: 30px;
    border-radius: 50%;
    background: #f7f3ea; color: #9a8762;
    font-size: 13px; font-weight: 600;
}

.avatar-wrap { position: relative; display: inline-block; }
.avatar-priority-border {
    border: 3px solid transparent;
    border-radius: 50%;
    background-image: linear-gradient(#fff, #fff), linear-gradient(135deg, #7fe0ec 0%, #17a3b8 50%, #0b6676 100%);
    background-origin: border-box;
    background-clip: content-box, border-box;
}
.avatar-badge {
    position: absolute;
    right: -4px; bottom: -2px;
    width: 20px; height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #17a3b8, #0f8a9c); color: #fff;
    font-size: 10px;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid #fff;
}
.target-name { max-width: 240px; cursor: pointer; text-align: left; }
.target-name:hover .name-text { color: #c88f22; }
.name-text { color: #2c3e50; font-size: 15px; transition: color .15s; }
.follower-text { color: #9a8f7e; }

.source-chip {
    display: inline-flex; align-items: center;
    max-width: 260px;
    padding: 5px 12px 5px 6px;
    border-radius: 99px;
    background: #f7f5f0;
    color: #2c3e50 !important;
    font-size: 13px;
    text-decoration: none !important;
    transition: background .15s;
}
.source-chip:hover { background: #fff0cc; }
.source-chip .social-img { margin-right: 8px; }
.ext-icon { font-size: 10px; color: #b5ab99; }

.time-text { font-size: 13px; color: #8a8173; white-space: nowrap; }

.action-group { gap: 8px; }
.act-btn {
    width: 34px; height: 34px;
    border-radius: 10px;
    border: 0;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 14px;
    transition: all .15s ease;
}
.act-view { background: #e6f6f8; color: #17a2b8; }
.act-view:hover { background: #17a2b8; color: #fff; }
.act-del { background: #fdecec; color: #dc3545; }
.act-del:hover { background: #dc3545; color: #fff; }

.social-img { width: 22px; height: 22px; object-fit: contain; border-radius: 50%; }
.social-imgs { width: 26px; height: 26px; object-fit: contain; }

/* ---------- empty ---------- */
.empty-state { text-align: center; padding: 56px 16px; }
.empty-icon {
    width: 72px; height: 72px; margin: 0 auto 14px;
    border-radius: 50%;
    background: #fff4d6;
    display: flex; align-items: center; justify-content: center;
    font-size: 32px; color: #e0a93c;
}
.empty-title { font-size: 17px; font-weight: 600; color: #4c412d; margin-bottom: 4px; }

.boxlist-card ::v-deep .page-item.active .page-link {
    background: #e0a93c; border-color: #e0a93c; color: #fff;
}
.boxlist-card ::v-deep .page-link { color: #7a6a4a; }

@media (max-width: 767px) {
    .priority-hero { padding: 12px; }
    .hero-right { width: 100%; }
    .quota-box, .pf-add { flex: 1 1 100%; }
    .pf-source-wrap { max-width: none; }
    .target-name, .source-chip { max-width: 200px; }
}
</style>
