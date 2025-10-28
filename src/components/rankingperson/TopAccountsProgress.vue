<!-- TopAccountsProgress.vue -->
<template>
    <div>
        <b-list-group flush>
            <b-list-group-item v-for="(item, i) in rows" :key="item.uid" class="" @click="onClick(item)">
                <!-- left: avatar + name -->
                <b-row align-v="center">
                    <b-col cols="6">
                        <div class="d-flex align-items-center w-100">
                            <span class="h5 bold py-0 my-0 rank-no" :class="(i % 2 === 0) ? 'rank-dark' : 'rank-light'">
                                {{ i + 1 }}
                            </span>

                            <b-avatar :src="item.profile_image || null"
                                :text="!item.profile_image ? initials(item.name || item.uid) : null" size="40"
                                variant="light" class="mr-2 flex-shrink-0" />

                            <img v-if="item.source === 'twitter'" :src="imgtw" class="social-img" />
                            <img v-if="item.source === 'facebook'" :src="imgfb" class="social-img" />
                            <img v-if="item.source === 'pantip'" :src="imgpt" class="social-img" />
                            <img v-if="item.source === 'youtube'" :src="imgyt" class="social-img" />
                            <img v-if="item.source === 'news'" :src="imgnw" class="social-img" />
                            <img v-if="item.source === 'instagram'" :src="imgig" class="social-img" />
                            <img v-if="item.source === 'blockdit'" :src="imgbd" class="social-img" />
                            <img v-if="item.source === 'tiktok'" :src="imgtt" class="social-img" />
                            <img v-if="item.source === 'threads'" :src="imgtd" class="social-img" />

                            <div class="minw-0">
                                <a :href="item.link_crawl" target="_blank">
                                    <div class="ta-name text-truncate">{{ item.name || item.uid }}</div>
                                    <!-- <div class="small text-muted text-truncate">@{{ item.uid }}</div> -->
                                </a>
                            </div>
                        </div>


                    </b-col>
                    <b-col cols="6">
                        <div class="w-100">
                            <div class="d-flex align-items-center w-100">
                                <b-progress :max="maxCount" height="10px" class="w-100 mr-2 ta-progress">
                                    <b-progress-bar :value="item.count" variant="info" />
                                </b-progress>
                                <b-badge pill variant="warning" class="flex-shrink-0">{{ formatCount(item.count)
                                }}</b-badge>
                            </div>

                            <!-- <div class="d-flex align-items-center justify-content-end mt-1 ta-actions">
            <b-button rel="noopener noreferrer" size="sm" variant="outline-secondary">
              เปิดลิงก์
            </b-button>
            <b-button size="sm" variant="primary" class="ml-2" @click.stop="$emit('add-watch', item)">
              ติดตาม
            </b-button>
          </div> -->
                        </div>
                    </b-col>
                </b-row>

                <!-- right: progress + count + actions -->

            </b-list-group-item>
        </b-list-group>

        <div v-if="rows.length === 0" class="text-center text-muted py-4">ไม่พบรายการที่ตรงกับเงื่อนไข</div>
        <div v-else class="text-right mt-2">
            <small class="text-muted">แสดงสูงสุด {{ limit }} บัญชี</small>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TopAccountsProgress',
    props: {
        /** items: [{ uid, name, count, source, profile_image, link_crawl }] */
        items: { type: Array, default: () => [] },
        limit: { type: Number, default: 10 },
        order: { type: String, default: 'desc' } // 'desc' มาก→น้อย, 'asc' น้อย→มาก, 'none' ตามลำดับที่ส่งมา
    },
    data() {
        return {
            imgtw: require("@/assets/Twitter.png"),
            imgfb: require("@/assets/Facebook.png"),
            imgpt: require("@/assets/board.png"),
            imgig: require("@/assets/Instagram.png"),
            imgnw: require("@/assets/News.png"),
            imgyt: require("@/assets/Youtube.png"),
            imgbd: require("@/assets/Blockdit.png"),
            imgtt: require("@/assets/Tiktok.png"),
            imgtd: require("@/assets/Threads.png"),
        };
    },
    computed: {
        normalized() {
            return (this.items || []).map(a => ({
                count: Number(a.count || 0),
                uid: a.uid || '',
                name: a.name || a.uid || '',
                link_crawl: a.link_crawl || '#',
                source: (a.source || 'unknown').toLowerCase(),
                profile_image: a.profile_image || null
            }));
        },
        sorted() {
            const arr = [...this.normalized];
            if (this.order === 'asc') arr.sort((a, b) => a.count - b.count);
            else if (this.order === 'desc') arr.sort((a, b) => b.count - a.count);
            return arr;
        },
        rows() {
            return this.limit > 0 ? this.sorted.slice(0, this.limit) : this.sorted;
        },
        maxCount() {
            return Math.max(1, ...this.rows.map(r => r.count || 0));
        }
    },
    methods: {
        onClick(item) { this.$emit('add-watch', item); },
        initials(name) {
            const parts = String(name || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
            const first = (parts[0] || '').charAt(0);
            const last = parts.length > 1 ? (parts[parts.length - 1] || '').charAt(0) : '';
            return (first + last || first || '?').toUpperCase();
        },
        formatCount(v) { return Number(v || 0).toLocaleString(); },
        sourceVariant(s) {
            const m = { twitter: 'info', youtube: 'danger', facebook: 'primary', news: 'secondary', instagram: 'warning', unknown: 'dark' };
            return m[(s || 'unknown').toLowerCase()] || 'secondary';
        }
    }
};
</script>

<style scoped>
.progress-bar {
    background: linear-gradient(70deg, #7ac9d6 40%, #9378bf 100%) !important;
}
.list-group-item {
    position: relative;
    display: block;
    padding: 3px 12px;
    background-color: #fff;
    /* border: 1px solid rgba(0, 0, 0, .125); */
}
.social-img {
  width: 25px !important;
  margin-top: 20px !important;
  margin-left:-20px !important;
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
    cursor: pointer;
    transition: background .12s ease;
}

.ta-row:hover {
    background: #f9fafb;
}

.ta-name {
    font-weight: 600;
}

.minw-0 {
    min-width: 0;
}

.ta-progress ::v-deep .progress-bar {
    transition: width .35s ease;
}

.ta-actions {
    visibility: hidden;
}

.ta-row:hover .ta-actions {
    visibility: visible;
}

@media (max-width: 576px) {
    .ta-actions {
        visibility: visible;
    }
}
</style>
