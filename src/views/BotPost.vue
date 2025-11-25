<template>
    <b-container fluid class="bot-latency-detail py-3">
        <!-- Header + Filters -->
        <b-row class="mb-3 align-items-end">
            <b-col cols="12" md="12">
                <h3 class="mb-0">Bot Latency Detail</h3>
                <small class="text-muted">
                    รายการโพสต์ + เวลากว่าจะถูกเก็บ (latency)
                </small>
            </b-col>

            <b-col cols="12" md="3">
                <b-form-group label="วันที่" label-size="sm" label-for="date-input">
                    <b-form-input id="date-input" type="date" size="sm" v-model="selectedDate"></b-form-input>
                </b-form-group>
            </b-col>

            <b-col cols="12" md="3">
                <b-form-group label="Source" label-size="sm" label-for="source-select">
                    <b-form-select id="source-select" size="sm" :options="sourceOptions"
                        v-model="selectedSource"></b-form-select>
                </b-form-group>
            </b-col>

            <b-col cols="12" md="2">
                <b-form-group label="Bot Level" label-size="sm" label-for="bot-level-select">
                    <b-form-select id="bot-level-select" size="sm" :options="botLevelOptions"
                        v-model="selectedBotLevel"></b-form-select>
                </b-form-group>
            </b-col>

            <b-col cols="12" md="2">
                <b-form-group label="Account" label-size="sm" label-for="account-input">
                    <b-form-input id="account-input" size="sm" v-model="account"
                        placeholder="เช่น BangkokPost"></b-form-input>
                </b-form-group>
            </b-col>

            <!-- <b-col cols="12" md="2">
        <b-form-group label="Rows / page" label-size="sm" label-for="limit-select">
          <b-form-select
            id="limit-select"
            size="sm"
            :options="limitOptions"
            v-model="limit"
          ></b-form-select>
        </b-form-group>
      </b-col> -->

            <b-col cols="12" md="" class="text-left py-3">
                <b-button size="sm" variant="info" @click="onSubmitFilters" :disabled="loading">
                    <span v-if="loading">Loading...</span>
                    <span v-else>submit</span>
                </b-button>
            </b-col>
        </b-row>

        <!-- Summary -->
        <b-row class="mb-2" v-if="!loading && posts.length">
            <b-col cols="12">
                <small class="text-muted">
                    วันที่: <strong>{{ formattedDateLabel }}</strong> ·
                    Source: <strong>{{ selectedSource || 'facebook' }}</strong> ·
                    Bot level: <strong>{{ selectedBotLevel }}</strong> ·
                    จำนวนโพสต์ทั้งหมด: <strong>{{ total }}</strong>
                    <!-- (หน้าที่ {{ currentPage }} / {{ totalPages }} · แสดง {{ posts.length }} แถว) -->
                </small>
            </b-col>
        </b-row>

        <!-- Error -->
        <b-alert v-if="error" show variant="danger" class="mb-3">
            {{ error }}
        </b-alert>

        <!-- List of posts -->
        <b-row class="mx-3">
            <b-col cols="12" v-if="!loading && !posts.length && !error">
                <div class="text-muted small">ไม่มีข้อมูลในช่วงที่เลือก</div>
            </b-col>

            <b-col v-for="item in posts" :key="item._id" cols="12" class="mb-3">
                <b-card>
                    <div class="d-flex">
                        <!-- Profile image -->
                        <div class="mr-3">
                            <b-avatar :src="item.profile_image" :text="avatarInitial(item.account_name)"
                                size="3rem"></b-avatar>
                        </div>

                        <div class="flex-grow-1">
                            <!-- Header line -->
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <div>
                                    <a v-if="item.uid" :href="item.uid" target="_blank"
                                        rel="noopener noreferrer" class="font-weight-bold">
                                        {{ item.account_name || item.uid }}
                                    </a>
                                    <span v-else class="font-weight-bold">
                                        {{ item.account_name || item.uid }}
                                    </span>
                                    <div class="small text-muted">
                                        source: {{ item.source }} · bot level: {{ item.acc && item.acc.bot_level }}
                                    </div>
                                </div>

                                <div class="text-right small text-muted">
                                    <div>
                                        วันที่:
                                        <strong>{{ formatDateTimeMinus7(item.date) }}</strong>
                                    </div>
                                    <div>
                                        เก็บเมื่อ:
                                        <strong>{{ formatDateTime(item.created_on) }}</strong>
                                    </div>
                                    <div>
                                        latency:
                                        <h6 class="d-inline"><b-badge variant="warning">{{ getLatencyText(item) }}</b-badge></h6>
                                    </div>
                                </div>
                            </div>

                            <!-- Content + image -->
                            <div class="post-body">
                                <p class="mb-2 post-text text-left">
                                    {{ item.full_text }}
                                </p>

                                <div v-if="item.photos && item.photos.length" class="post-photos">
                                    <b-img :src="item.photos[0]" fluid alt="post image" class="rounded"></b-img>
                                </div>
                            </div>

                            <!-- Footer: link to post + engagement -->
                            <div class="d-flex justify-content-between align-items-center mt-2 small text-muted">
                                <!-- <div>
                                    <a v-if="item.url_post || item.uid" :href="item.url_post || item.uid"
                                        target="_blank" rel="noopener noreferrer">
                                        เปิดโพสต์ต้นฉบับ
                                    </a>
                                </div> -->

                                <div>
                                    ❤️ {{ item.likes_count || 0 }}
                                    · 💬 {{ item.comments_count || 0 }}
                                    · 🔁 {{ item.shares_count || 0 }}
                                    · ENG: {{ item.engagement || 0 }}
                                </div>
                            </div>
                        </div>
                    </div>
                </b-card>
            </b-col>
        </b-row>

        <!-- Pagination -->
        <b-row v-if="total > limit">
            <b-col cols="12" class="mt-2 d-flex justify-content-center">
                <b-pagination v-model="currentPage" :total-rows="total" :per-page="limit" size="sm" align="center"
                    @input="onPageChange"></b-pagination>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import axios from "axios";

export default {
    name: "BotLatencyDetail",
    data() {
        return {
            // filter
            selectedDate: this.getTodayDateString(),
            selectedSource: "facebook",
            selectedBotLevel: "2",
            account: "", // ตัวอย่างค่าเริ่มต้น
            limit: 10,
            currentPage: 1,

            // data
            posts: [],
            total: 0,

            // state
            loading: false,
            error: null,

            sourceOptions: [
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
            botLevelOptions: [
                { value: "1", text: "Level 1" },
                { value: "2", text: "Level 2" },
                { value: "3", text: "Level 3" }
            ],
            limitOptions: [
                { value: 5, text: "5" },
                { value: 10, text: "10" },
                { value: 20, text: "20" },
                { value: 50, text: "50" }
            ]
        };
    },
    computed: {
        formattedDateLabel() {
            if (!this.selectedDate) return "";
            const [y, m, d] = this.selectedDate.split("-");
            return `${d}/${m}/${y}`;
        },
        totalPages() {
            if (!this.total || !this.limit) return 1;
            return Math.ceil(this.total / this.limit);
        }
    },
    watch: {
        // ถ้าเปลี่ยน limit ให้กลับไปหน้า 1 และโหลดใหม่
        limit() {
            this.currentPage = 1;
            this.fetchPosts(1);
        }
    },
    methods: {
        getTodayDateString() {
            const d = new Date();
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        },
        buildDateRange() {
            const start_date = `${this.selectedDate}T00:00:00`;
            const end_date = `${this.selectedDate}T23:59:59`;
            return { start_date, end_date };
        },
        avatarInitial(name) {
            if (!name) return "?";
            return name.trim().charAt(0).toUpperCase();
        },
        formatDateTimeMinus7(value) {
            if (!value) return "-";

            const d = new Date(value);
            if (isNaN(d.getTime())) return value;

            // ลบ 7 ชั่วโมง (25200000 มิลลิวินาที)
            const minus = new Date(d.getTime() - 7 * 60 * 60 * 1000);

            return minus.toLocaleString("th-TH", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            });
        },
        formatDateTime(value) {
            if (!value) return "-";
            const d = new Date(value);
            if (isNaN(d.getTime())) return value;
            return d.toLocaleString("th-TH", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            });
        },
        /**
         * คืนข้อความ latency เช่น "10 ชม. 52 นาที" หรือ "35 นาที"
         * ใช้ item.latencyHours ถ้ามี
         * ถ้าไม่มีจะลองคำนวณจาก date กับ created_on_plus7
         */
        getLatencyText(item) {
            let totalMinutes = null;

            if (typeof item.latencyHours === "number") {
                totalMinutes = Math.round(item.latencyHours * 60);
            } else if (item.created_on_plus7 && item.date) {
                const start = new Date(item.date);
                const end = new Date(item.created_on_plus7);
                if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                    const diffMs = end - start;
                    if (diffMs > 0) {
                        totalMinutes = Math.round(diffMs / 60000);
                    }
                }
            }

            if (totalMinutes == null) return "-";

            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;

            if (hours <= 0) {
                return `${minutes} นาที`;
            }
            if (minutes === 0) {
                return `${hours} ชม.`;
            }
            return `${hours} ชม. ${minutes} นาที`;
        },
        onSubmitFilters() {
            // กด submit filter ให้รีเซ็ตไปหน้า 1 เสมอ
            this.currentPage = 1;
            this.fetchPosts(1);
        },
        onPageChange(page) {
            // เปลี่ยนหน้า
            this.fetchPosts(page);
        },
        async fetchPosts(page = 1) {
            this.loading = true;
            this.error = null;
            this.posts = [];
            this.currentPage = page;

            const { start_date, end_date } = this.buildDateRange();

            const params = {
                start_date,
                end_date,
                source: this.selectedSource,
                bot_level: this.selectedBotLevel,
                limit: this.limit,
                page: this.currentPage
            };

            if (this.account && this.account.trim()) {
                params.account = this.account.trim();
            }

            try {
                const { data } = await axios.get(
                    "https://api2.cognizata.com/api/bot-latency/detail",
                    { params }
                );
                this.posts = Array.isArray(data.data) ? data.data : [];
                this.total = data.total || this.posts.length;
                // sync page & limit จาก API เผื่อ backend มี logic อื่น
                if (data.page) this.currentPage = data.page;
                if (data.limit) this.limit = data.limit;
            } catch (err) {
                console.error("Error fetching posts", err);
                this.error =
                    (err && err.response && err.response.data && err.response.data.message) ||
                    err.message ||
                    "Request failed";
            } finally {
                this.loading = false;
            }
        }
    },
    mounted() {
        this.fetchPosts(1);
    }
};
</script>

<style scoped>
.post-text {
    /* white-space: pre-line; */
    max-height: 6.5em;
    overflow: auto;
}

.post-photos img {
    max-height: 240px;
    object-fit: cover;
}

.b-avatar {
    border: 1px solid #ddd;
}
</style>
