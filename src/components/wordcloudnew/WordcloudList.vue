<template>
    <div class="px-1 px-lg-5">
        <b-toast id="my-toast2" no-close-button auto-hide-delay="1500">
            <div class="text-center">
                <i class="fa fa-arrow-down" /> เลื่อนลงเพื่อดูข้อมูล
            </div>
        </b-toast>

        <div class="my-3 box-spot-bg py-3">
            <b-row class="align-items-center px-3">
                <b-col cols="12" md>
                    <div class="text-left">
                        <span class="h4 mr-3 d-inline-block bold mb-0">
                            TOP 10
                        </span>
                        <span class="small text-grey">(จำนวนครั้งที่พบ)</span>
                    </div>
                </b-col>
            </b-row>

            <!-- ================= MOBILE (single by tab) ================= -->
            <div class="d-lg-none px-3">
                <!-- WORD TAB -->
                <div v-if="activeTab === 'word'">
                    <div class="h6 text-left mt-2">Words</div>

                    <SentimentTopChart v-if="view === 'chart' && wordTop10.length" :items="wordChartItems" :limit="10"
                        order="desc" labelMode="count" @select-word2="clickWordFromChart" />

                    <div v-else-if="wordTop10.length">
                        <div v-for="(word, k) in wordTop10" :key="'mw-' + k" class="my-2">
                            <b-button block pill variant="warning" :pressed="keyword === word.name"
                                @click="clickWord(word.name, wordTop10)">
                                <span class="label-clip">{{ word.name }}</span>
                                <span class="small"> ({{ word.total | numFormat }})</span>
                            </b-button>
                        </div>
                    </div>

                    <div v-else class="py-3 text-center text-muted small">ไม่พบข้อมูล Wordcloud</div>
                </div>

                <!-- HASH TAB -->
                <div v-else>
                    <div class="h6 text-left mt-2">Hashtags</div>

                    <SentimentTopChart v-if="view === 'chart' && hashTop10.length" :items="hashChartItems" :limit="10"
                        order="desc" labelMode="count" @select-word2="clickWordFromChart" />

                    <div v-else-if="hashTop10.length">
                        <div v-for="(word, k) in hashTop10" :key="'mh-' + k" class="my-2">
                            <b-button block pill variant="warning" :pressed="keyword === word.name"
                                @click="clickWord(word.name, hashTop10)">
                                <span class="label-clip">{{ word.name }}</span>
                                <span class="small"> ({{ word.total | numFormat }})</span>
                            </b-button>
                        </div>
                    </div>

                    <div v-else class="py-3 text-center text-muted small">ไม่พบข้อมูล Hashtagcloud</div>
                </div>
            </div>

            <!-- ================= DESKTOP (two columns) ================= -->
            <b-row class="px-3 d-none d-lg-flex">
                <b-col cols="12" lg="6">
                    <div class="h6 text-left mt-2">Words</div>

                    <SentimentTopChart v-if="view === 'chart' && wordTop10.length" :items="wordChartItems" :limit="10"
                        order="desc" labelMode="count" @select-word2="clickWordFromChart" />

                    <div v-else-if="wordTop10.length">
                        <div v-for="(word, k) in wordTop10" :key="'w-' + k" class="my-2">
                            <b-button block pill variant="warning" :pressed="keyword === word.name"
                                @click="clickWord(word.name, wordTop10)">
                                <span class="label-clip">{{ word.name }}</span>
                                <span class="small"> ({{ word.total | numFormat }})</span>
                            </b-button>
                        </div>
                    </div>

                    <div v-else class="py-3 text-center text-muted small">ไม่พบข้อมูล Wordcloud</div>
                </b-col>

                <b-col cols="12" lg="6">
                    <div class="h6 text-left mt-2">Hashtags</div>

                    <SentimentTopChart v-if="view === 'chart' && hashTop10.length" :items="hashChartItems" :limit="10"
                        order="desc" labelMode="count" @select-word2="clickWordFromChart" />

                    <div v-else-if="hashTop10.length">
                        <div v-for="(word, k) in hashTop10" :key="'h-' + k" class="my-2">
                            <b-button block pill variant="warning" :pressed="keyword === word.name"
                                @click="clickWord(word.name, hashTop10)">
                                <span class="label-clip">{{ word.name }}</span>
                                <span class="small"> ({{ word.total | numFormat }})</span>
                            </b-button>
                        </div>
                    </div>

                    <div v-else class="py-3 text-center text-muted small">ไม่พบข้อมูล Hashtagcloud</div>
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import SentimentTopChart from "./SentimentTopChart.vue";

export default {
    components: { SentimentTopChart },
    props: {
        activeTab: { type: String, default: "word" }, // ✅ รับจากแม่
    },
    computed: {
        ...mapGetters(["getWordCloud"]),

        wordTop10() {
            const arr = this.getWordCloud?.data?.wordcloud?.data || [];
            return Array.isArray(arr) ? arr.slice(0, 10) : [];
        },
        hashTop10() {
            const arr = this.getWordCloud?.data?.hashtag?.data || [];
            return Array.isArray(arr) ? arr.slice(0, 10) : [];
        },

        wordChartItems() {
            return (this.wordTop10 || []).map(w => {
                const { pos, neu, neg, total } = this.pickSentimentCounts(w);
                return {
                    uid: w.name,
                    name: w.name,
                    count: total,
                    positiveSentiment: pos,
                    neutralSentiment: neu,
                    negativeSentiment: neg,
                    source: "wordcloud",
                };
            });
        },
        hashChartItems() {
            return (this.hashTop10 || []).map(w => {
                const { pos, neu, neg, total } = this.pickSentimentCounts(w);
                return {
                    uid: w.name,
                    name: w.name,
                    count: total,
                    positiveSentiment: pos,
                    neutralSentiment: neu,
                    negativeSentiment: neg,
                    source: "hashtag",
                };
            });
        },
    },
    data() {
        return {
            keyword: "",
            dataFromAPI: "",
            view: "chart",
        };
    },
    methods: {
        pickSentimentCounts(w) {
            const arr = Array.isArray(w?.count) ? w.count : [];
            let pos = 0, neu = 0, neg = 0;
            for (const x of arr) {
                const s = Number(x?.sentiment);
                const c = Number(x?.count || 0);
                if (s === 1) pos += c;
                else if (s === 0) neu += c;
                else if (s === -1) neg += c;
            }
            const totalFromArr = pos + neu + neg;
            const total = Number(w?.total ?? totalFromArr ?? 0);
            return { pos, neu, neg, total };
        },

        // ✅ จาก chart จะส่งเป็น string name มา
        clickWordFromChart(name) {
            this.clickWord(name, this.activeTab === "word" ? this.wordTop10 : this.hashTop10);
        },

        // ✅ unify: รับ "string name"
        clickWord(name, data) {
            this.dataFromAPI = data;
            this.keyword = name;
            this.$emit("select-word", name); // ✅ ส่ง name ขึ้น parent
            this.$bvToast.show("my-toast2");
        },
    },
};
</script>

<style scoped>
.box-spot-bg {
    background: linear-gradient(to top, #b8d3d3a4, #eadff8);
    border-radius: 11px;
    border: 0px;
    margin-bottom: 10px;
    min-height: 75px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

.label-clip {
    display: inline-block;
    max-width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: bottom;
}



.btn-warning {
    color: #3b3838;
    background-color: #fcf0d2;
    border-color: #ffce61;
}

.btn-warning:hover {
    color: #212529;
    background-color: #fed16e;
    border-color: #fed16e;
}

.btn-warning:not(:disabled):not(.disabled).active,
.btn-warning:not(:disabled):not(.disabled):active,
.show>.btn-warning.dropdown-toggle {
    background-color: #fed16e !important;
    border-color: #fed16e;
}

/* scale ปุ่มเหมือน TopAccountsCard */
.btn-sw {
    transform: scale(0.85);
    transform-origin: top right;
}

@media (max-width: 800px) {
   

    .btn-sw {
        transform: scale(0.78);
        transform-origin: top right;
    }
}
</style>
