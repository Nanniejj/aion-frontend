<template>
    <div class="suggest-wrap my-4">

        <!-- header -->
        <div class="suggest-header">
            <div class="d-flex align-items-center">
                <!-- <span class="suggest-icon-badge">
                    <b-icon icon="stars" font-scale="0.95"></b-icon>
                </span> -->
                <span class="suggest-title">เป้าหมายแนะนำ</span>
                <span class="suggest-count" v-if="!isLoading && suggestList.length">{{ suggestList.length }}</span>
            </div>
            <div class="d-flex align-items-center">
                <div class="suggest-updated-at" v-if="generated_at">อัพเดต : {{ formatThaiDate(generated_at) }}</div>
                <button type="button" class="suggest-refresh-btn" :disabled="isLoading" @click="fetchSuggestions">
                    <b-icon icon="arrow-clockwise" :animation="isLoading ? 'spin' : ''" font-scale="0.9"></b-icon>
                    <span class="d-none d-md-inline pl-1">รีเฟรช</span>
                </button>
            </div>
        </div>

        <!-- loading -->
        <div v-if="isLoading" class="suggest-loading">
            <div class="suggest-loading-spinner">
                <vue-element-loading :active="isLoading" size="60"
                background-color="rgba(255, 255, 255, 0.3)"
                color="#ede7dd" />
            </div>
            <span>กำลังโหลดเป้าหมายแนะนำ...</span>
        </div>

        <!-- empty -->
        <div v-else-if="!suggestList.length" class="suggest-empty">
            <b-icon icon="binoculars" font-scale="1.4" class="mb-2"></b-icon>
            <div>ไม่มีเป้าหมายแนะนำในขณะนี้</div>
        </div>

        <!-- suggestion cards -->
        <div v-else class="suggest-track-wrap">
            <button
                type="button"
                class="suggest-nav-btn suggest-nav-prev"
                v-show="canScrollLeft"
                @click="scrollByAmount(-1)"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>

            <div class="suggest-track py-3" ref="track" @scroll="updateScrollState">
                <div v-for="(item, index) in suggestList" :key="item.id" class="suggest-card" @click="openLink(item.url)">
                <div @click.stop="openLink(item.url)" class="d-flex align-items-center suggest-header-row">
                        <div class="suggest-avatar-wrap">
                            <b-avatar
                                :src="item.avatar"
                                :text="avatarInitial(item.name)"
                                size="2.75rem"
                                class="suggest-avatar"
                                :style="avatarStyle(index)"
                            ></b-avatar>
                            <img v-if="item.source == 'facebook'" src="@/assets/Facebook.png" class="suggest-social-icon" />
                            <img v-if="item.source == 'twitter' || item.source == 'x'" src="@/assets/Twitter.png" class="suggest-social-icon" />
                            <img v-if="item.source == 'pantip'" src="@/assets/board.png" class="suggest-social-icon" />
                            <img v-if="item.source == 'blockdit'" src="@/assets/Blockdit.png" class="suggest-social-icon" />
                            <img v-if="item.source == 'instagram'" src="@/assets/Instagram.png" class="suggest-social-icon" />
                            <img v-if="item.source == 'youtube'" src="@/assets/Youtube.png" class="suggest-social-icon" />
                            <img v-if="item.source == 'news'" src="@/assets/News.png" class="suggest-social-icon" />
                            <img v-if="item.source == 'tiktok'" src="@/assets/Tiktok.png" class="suggest-social-icon" />
                            <img v-if="item.source == 'threads'" src="@/assets/Threads.png" class="suggest-social-icon" />
                        </div>
                    <div class="flex-grow-1 min-w-0 pl-2">
                        <div class="suggest-name text-truncate" :title="item.name">{{ item.name }}</div>
                        <!-- <span class="suggest-badge" v-if="item.category" :style="badgeStyle(index)">{{ item.category }}</span> -->
                    </div>
                </div>

                <div class="suggest-meta-row">
                    <!-- <span
                        class="suggest-meta-item"
                        v-if="item.followers !== undefined"
                        :title="`${fullNumber(item.followers)} ผู้ติดตาม`"
                    >
                        <b-icon icon="people-fill" font-scale="1" class="mr-1"></b-icon>
                        {{ formatNumber(item.followers) }}
                    </span> -->
                    <span
                        class="suggest-meta-item"
                        v-if="item.engagement !== undefined"
                        :title="`${fullNumber(item.engagement)} เอนเกจเมนต์`"
                    >
                        <b-icon icon="graph-up" font-scale="1" class="mr-1"></b-icon>
                        {{ formatNumber(item.engagement) }}
                    </span>
                    <span
                        class="suggest-meta-item"
                        v-if="item.postCount !== undefined"
                        :title="`${fullNumber(item.postCount)} โพสต์`"
                    >
                        <b-icon icon="file-post" font-scale="1" class="mr-1"></b-icon>
                        {{ formatNumber(item.postCount) }}
                    </span>
                </div>

                <div class="suggest-reason px-2 py-2" v-if="item.reason" :title="item.reason">
                    <b-icon icon="clock-history" font-scale="1" class="mr-1"></b-icon>
                    <span class="text-truncate">{{ item.reason }}</span>
                </div>

                <button
                    type="button"
                    class="suggest-add-btn"
                    :class="{ 'is-added': item.added, 'is-adding': item.adding }"
                    :disabled="item.adding || item.added"
                    @click.stop="addTarget(item)"
                >
                    <template v-if="item.adding">
                        <!-- <b-spinner small></b-spinner> -->
                        <span class="pl-1">กำลังเพิ่ม...</span>
                    </template>
                    <template v-else>
                        <b-icon font-scale="1.5" :icon="item.added ? 'check2' : 'plus'"></b-icon>
                        <span class="pl-1">{{ item.added ? 'เพิ่มแล้ว' : 'เพิ่มเป้าหมาย' }}</span>
                    </template>
                </button>
                </div>
            </div>

            <button
                type="button"
                class="suggest-nav-btn suggest-nav-next"
                v-show="canScrollRight"
                @click="scrollByAmount(1)"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2'

export default {
    name: "MonitorSuggestTarget",
    props: {
        // ถ้าไม่ส่ง targets มา component จะ fetch เองผ่าน fetchUrl
        targets: {
            type: Array,
            default: null
        },
        fetchUrl: {
            type: String,
            default: "https://api2.cognizata.com/api/v2/monitor/getSuggestTargets"
        },
        addTargetUrl: {
            type: String,
            default: "https://api2.cognizata.com/api/v2/monitor/targetandhashtag"
        },
        reface: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            internalList: [],
            isLoading: false,
            canScrollLeft: false,
            canScrollRight: false,
            generated_at: null,
            // สีวนซ้ำสำหรับ avatar / badge แต่ละใบ ให้แยกแยะการ์ดได้ง่ายขึ้นด้วยสายตา
            palette: [
                { bg: "#E9F6F8", fg: "#0F8A9C" }, // teal
                { bg: "#FCEAEA", fg: "#D9506B" }, // rose
                { bg: "#FDF3E3", fg: "#C98A1A" }, // amber
                { bg: "#EFEBFB", fg: "#7C6FE0" }, // violet
                { bg: "#E9F8EF", fg: "#2C9C5C" }, // green
                { bg: "#EAF0FB", fg: "#3B62B0" }  // blue
            ]
        };
    },
    computed: {
        suggestList() {
            const list = this.targets !== null ? this.targets : this.internalList;
            return (list || []).filter(Boolean);
        }
    },
    created() {
        if (this.targets === null) this.fetchSuggestions();
    },
    mounted() {
        this.$nextTick(this.updateScrollState);
        window.addEventListener("resize", this.updateScrollState);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.updateScrollState);
    },
    watch: {
        reface() {
            if (this.targets === null) this.fetchSuggestions();
        },
        suggestList() {
            this.$nextTick(this.updateScrollState);
        }
    },
    methods: {
        fetchSuggestions() {
            if (this.targets !== null) return; // ใช้ props ที่ parent ส่งมา ไม่ต้อง fetch เอง
            this.isLoading = true;

            var config = {
                method: "get",
                url: this.fetchUrl,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json"
                }
            };

            this.axios(config)
                .then((response) => {
                    const payload = response.data;
                    const list = payload.data || payload.result || [];
                    this.internalList = list.filter(Boolean).map(this.mapApiItem);
                    this.generated_at = response.data.generated_at || null;
                    this.isLoading = false;
                })
                .catch((error) => {
                    console.log(error);
                    this.internalList = [];
                    this.isLoading = false;
                });
        },
        async addTarget(item) {
            console.log(item);
            
            if (item.added || item.adding) return;

            const confirmResult = await Swal.fire({
                title: "ยืนยันการเพิ่มเป้าหมาย?",
                html: `ต้องการเพิ่ม <b>${item.name}</b> เข้ารายการเป้าหมายที่ติดตามใช่หรือไม่`,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "เพิ่มเป้าหมาย",
                cancelButtonText: "ยกเลิก",
                didOpen: () => {
                    const iconContent = document.querySelector('.swal2-icon-content');
                    if (iconContent) iconContent.style.display = 'none';
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonColor: "#17a3b8",
                cancelButtonColor: "#b3a690",
                reverseButtons: true
            });
            if (!confirmResult.isConfirmed) return;

            item.adding = true;
            try {
                var config = {
                    method: "post",
                    url: this.addTargetUrl,
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                        "Content-Type": "application/json"
                    },
                    data: {
                        data: [
                            {
                                key: "account", // account หรือ hashtag - เป้าหมายแนะนำเป็นบัญชีเสมอ
                                URL: item.url,
                                name: item.name,
                                profile_image: item.avatar,
                                target_type: "account", // TODO: เปลี่ยนเป็น "group" ถ้าเป็นกลุ่ม (ต้องมี group_type ประกบด้วย)
                                source: item.source
                            }
                        ]
                    }
                };
                await this.axios(config);

                item.added = true;
                this.$emit("add", item);
                this.$emit("setReface");
                // ดึงรายการเป้าหมายแนะนำใหม่ ให้รายการที่เพิ่งเพิ่มไปหลุดออกจากลิสต์แนะนำ
                this.fetchSuggestions();
                Swal.fire({
                    title: "เพิ่มเป้าหมายสำเร็จ",
                    icon: "success",
                    confirmButtonColor: "#17a3b8",
                    timer: 1500,
                    showConfirmButton: false
                });
            } catch (error) {
                console.log("addTarget error ==== ", error);
                Swal.fire({
                    title: "เพิ่มเป้าหมายไม่สำเร็จ",
                    text: "กรุณาลองใหม่อีกครั้ง",
                    icon: "error",
                    confirmButtonColor: "#17a3b8"
                });
            } finally {
                item.adding = false;
            }
        },
        avatarInitial(name) {
            return name ? name.charAt(0).toUpperCase() : "?";
        },
        // เปิดลิงก์โปรไฟล์ต้นทาง (เช่น facebook.com/xxx) ในแท็บใหม่
        openLink(url) {
            if (url) window.open(url, "_blank");
        },
        // คลิกที่การ์ด/avatar เพื่อไปหน้าโปรไฟล์ภายในระบบ ให้ parent จัดการ routing เอง
        linkToProfile(item) {
            this.$emit("view-profile", item);
        },
        // แปลงข้อมูลดิบจาก API https://api2.cognizata.com/api/v2/monitor/getSuggestTargets
        // ให้ตรงกับ shape ที่การ์ดใช้แสดงผล
        mapApiItem(item) {
            return {
                id: item.account_id || item.uid || item.account_url,
                name: item.name || item.uid || "-",
                avatar: item.profile_image || "",
                category: this.sourceLabel(item.source),
                source: (item.source || "").toLowerCase(),
                followers: item.followers || 0,
                engagement: item.total_engagement || 0,
                postCount: item.post_count || 0,
                reason: `ล่าสุด ${this.formatThaiDate(item.latest_post_date)}`,
                url: item.account_url,
                added: false,
                adding: false
            };
        },
        sourceLabel(source) {
            const map = {
                tiktok: "TikTok",
                youtube: "YouTube",
                facebook: "Facebook",
                instagram: "Instagram",
                twitter: "X (Twitter)",
                x: "X (Twitter)",
                threads: "Threads",
                line: "LINE"
            };
            const key = (source || "").toLowerCase();
            return map[key] || source || "-";
        },
        formatThaiDate(dateStr) {
            if (!dateStr) return "-";
            try {
                const d = new Date(dateStr);
                const day = String(d.getDate()).padStart(2, "0");
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const year = d.getFullYear();
                return `${day}/${month}/${year}`;
            } catch (error) {
                return "-";
            }
        },
        colorFor(index) {
            return this.palette[index % this.palette.length];
        },
        avatarStyle(index) {
            const c = this.colorFor(index);
            return { backgroundColor: c.bg, color: c.fg, fontWeight: 700 };
        },
        badgeStyle(index) {
            const c = this.colorFor(index);
            return { backgroundColor: c.bg, color: c.fg };
        },
        formatNumber(num) {
            if (num === undefined || num === null) return "";
            if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
            if (num >= 1000) return (num / 1000).toFixed(1) + "K";
            return String(num);
        },
        // ตัวเลขเต็มไม่ย่อ ใส่ comma คั่นหลักพัน ไว้โชว์ตอน hover
        fullNumber(num) {
            if (num === undefined || num === null) return "0";
            return Number(num).toLocaleString("th-TH");
        },
        scrollByAmount(direction) {
            const track = this.$refs.track;
            if (!track) return;
            // เลื่อนทีละประมาณความกว้างการ์ด 2 ใบ
            const amount = Math.round(track.clientWidth * 0.8) * direction;
            track.scrollBy({ left: amount, behavior: "smooth" });
        },
        updateScrollState() {
            const track = this.$refs.track;
            if (!track) {
                this.canScrollLeft = false;
                this.canScrollRight = false;
                return;
            }
            this.canScrollLeft = track.scrollLeft > 4;
            this.canScrollRight = track.scrollLeft + track.clientWidth < track.scrollWidth - 4;
        }
    }
};
</script>

<style scoped>
.suggest-wrap {
    padding: 4px 2px 8px;
}

/* header */
.suggest-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}
.suggest-updated-at {
    font-size: 0.78rem;
    color: #b3a690;
    margin-right: 10px;
    white-space: nowrap;
}
.suggest-icon-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ffb648, #ff9142);
    color: #fff;
    box-shadow: 0 2px 6px rgba(255, 145, 66, 0.4);
    margin-right: 8px;
    flex-shrink: 0;
}
.suggest-title {
    font-weight: 700;
    font-size: 1rem;
    color: #2f2a20;
}
.suggest-count {
    margin-left: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #0f8a9c;
    background-color: #e9f6f8;
    border-radius: 999px;
    padding: 1px 8px;
}
.suggest-refresh-btn {
    display: inline-flex;
    align-items: center;
    border: 1px solid #eee0d8;
    background-color: #fff;
    color: #6b6156;
    border-radius: 999px;
    padding: 5px 12px;
    font-size: 0.8rem;
    transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}
.suggest-refresh-btn:hover:not(:disabled) {
    background-color: #17a3b8;
    border-color: #17a3b8;
    color: #fff;
}
.suggest-refresh-btn:disabled {
    opacity: 0.6;
}

/* track / slider */
.suggest-track-wrap {
    position: relative;
    padding: 4px 40px 8px;
}
.suggest-track {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    scroll-behavior: smooth;
    padding: 2px 4px 6px;
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE/Edge */
}
.suggest-track::-webkit-scrollbar {
    display: none; /* chrome/safari */
}
.suggest-nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: none;
    background-color: #fff;
    color: #6b6156;
    font-size: 72px;
    /* box-shadow: 0 2px 10px rgba(60, 40, 20, 0.15); */
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
}
.suggest-nav-btn:hover {
    background-color: #17a3b8;
    color: #fff;
    box-shadow: 0 4px 14px rgba(23, 163, 184, 0.35);
}
.suggest-nav-prev {
    left: 0;
}
.suggest-nav-next {
    right: 0;
}
@media (max-width: 576px) {
    .suggest-track-wrap {
        padding-left: 32px;
        padding-right: 32px;
    }
    .suggest-nav-btn {
        width: 28px;
        height: 28px;
    }
    .suggest-nav-prev {
        left: 0;
    }
    .suggest-nav-next {
        right: 0;
    }
}

/* card */
.suggest-card {
    flex: 0 0 auto;
    width: 216px;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border: 1px solid #f1ece6;
    border-radius: 16px;
    padding: 14px;
    box-shadow: 0 2px 10px rgba(60, 40, 20, 0.05);
    transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.suggest-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 22px rgba(60, 40, 20, 0.1);
    border-color: #ffe0c2;
}
.suggest-avatar-wrap {
    position: relative;
    flex-shrink: 0;
    cursor: pointer;
}
.suggest-avatar {
    flex-shrink: 0;
}
.suggest-social-icon {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: 2px solid #fff;
    background-color: #fff;
    cursor: pointer;
    object-fit: contain;
}
.suggest-header-row {
    justify-content: flex-start;
    text-align: left;
    width: 100%;
    cursor: pointer;
}
.suggest-header-row:hover .suggest-name {
    text-decoration: underline;
}
.suggest-name {
    font-weight: 700;
    color: #2f2a20;
    font-size: 0.88rem;
    line-height: 1.25;
    text-align: left;
    width: 100%;
}
.suggest-badge {
    display: inline-block;
    margin-top: 3px;
    font-size: 0.68rem;
    font-weight: 600;
    padding: 1px 8px;
    border-radius: 999px;
}
.suggest-meta-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
    font-size: 13px;
    color: #6b6156;
}
.suggest-meta-item {
    display: flex;
    align-items: center;
    background-color: #f7f4ef;
    border-radius: 999px;
    padding: 3px 10px;
    font-weight: 600;
    cursor: pointer;
}
.suggest-reason {
    display: flex;
    align-items: center;
    margin-top: 4px;
    font-size: 14px;
    color: #908675;
    font-style: italic;
    white-space: nowrap;
    overflow: hidden;
}
.suggest-reason span {
    overflow: hidden;
    text-overflow: ellipsis;
}

/* button */
.suggest-add-btn {
    width: 100%;
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 999px;
    padding: 7px 10px;
    font-size: 14px;
    /* font-weight: 600; */
    color: #fff;
    background: linear-gradient(135deg, #17a3b8, #0f8a9c);
    transition: filter 0.15s ease, transform 0.05s ease;
}
.suggest-add-btn:hover:not(:disabled) {
    filter: brightness(1.06);
}
.suggest-add-btn:active:not(:disabled) {
    transform: scale(0.98);
}
.suggest-add-btn:disabled {
    cursor: default;
}
.suggest-add-btn.is-added {
    background: #e9f6f8;
    color: #0f8a9c;
}
.suggest-add-btn.is-adding {
    background: #cfeaef;
    color: #0f8a9c;
}

/* empty state */
.suggest-empty {
    text-align: center;
    color: #b3a690;
    padding: 28px 0;
}

/* loading */
.suggest-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 28px 0;
    color: #8a8074;
    font-size: 0.85rem;
}
.suggest-loading-spinner {
    position: relative;
    width: 60px;
    height: 60px;
    margin-bottom: 6px;
}

.min-w-0 {
    min-width: 0;
}
</style>