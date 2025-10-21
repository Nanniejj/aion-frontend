<template>
    <div class="d-none">
        <!-- <span v-b-toggle="'summarize' + page + k" id="box-summarize" v-b-tooltip.hover
                      title="comments analysis" v-if="postDomain.summarize">
                      <img width="22" height="22" src="https://img.icons8.com/ios-filled/50/sparkling--v1.png"
                        alt="sparkling" style="filter: brightness(0) invert(1);" />
                      <span class="md-font">
                        Analysis
                      </span>
                    </span> -->
        <b-button :variant="open ? 'info' : 'outline-info'" size="sm" pill
            class="d-inline-flex align-items-center box-summarize" @click="toggle" :disabled="loading">
            <img width="22" height="22" src="https://img.icons8.com/ios-filled/50/sparkling--v1.png" alt="sparkling"
                style="filter: brightness(0) invert(1);" />
            <span class="md-font">
                Analysis
            </span>
        </b-button>

        <b-collapse v-model="open" class="mt-2">
            <b-card class="shadow-sm" style="border-radius: 16px;">
                <div v-if="loading" class="text-center my-3">
                    <vue-element-loading :active="true" size="60" background-color="rgba(255,255,255,0.5)"
                        color="#17a2b891" />
                </div>

                <div v-else class="text-left">
                </div>

            </b-card>
        </b-collapse>
    </div>
</template>

<script>
import moment from "moment";

export default {
    name: "SummaryButton",
    props: {
        posts: { type: [Array, Object], required: true }, // postsFromApi (flat array หรือ grouped daily)
        filters: { type: Object, required: true },
        loading: { type: Boolean, default: false },
        // จะเอากี่อันดับดี ๆ
        topN: { type: Number, default: 5 },
    },
    data() {
        return {
            open: false,
        };
    },
    computed: {

    },
    methods: {
        toggle() { this.open = !this.open; },
        engValue(p) {
            // พยายามเดา field ที่เป็น engagement รวม
            const direct = p.engagement_total || p.engagement || p.engage || p.total_engage;
            if (typeof direct === 'number') return direct;

            const likes = p.like_count || p.likes || p.reaction || 0;
            const comments = p.comment_count || p.comments || 0;
            const shares = p.share_count || p.shares || 0;
            const views = p.view_count || p.views || 0; // บางแพลตฟอร์มทดแทนได้
            // สูตรเบา ๆ เผื่อไม่มี total: like + 2*comment + 3*share (+ 0.1*view)
            return (likes || 0) + 2 * (comments || 0) + 3 * (shares || 0) + 0.1 * (views || 0);
        },
        readableTitle(p) {
            // แสดงหัวเรื่องสั้น ๆ จากข้อความ
            const text = p.title || p.message || p.text || p.content || "";
            const trimmed = String(text).replace(/\s+/g, " ").trim();
            return trimmed.length > 80 ? trimmed.slice(0, 80) + "…" : trimmed || "(ไม่มีเนื้อหา)";
        },
        async copyFull() {
            try {
                await navigator.clipboard.writeText(this.fullSummary);
                this.$bvToast && this.$bvToast.toast('คัดลอกสรุปแล้ว', { variant: 'success', autoHideDelay: 1500 });
            } catch (e) {
                this.$bvToast && this.$bvToast.toast('คัดลอกไม่สำเร็จ', { variant: 'danger', autoHideDelay: 2000 });
            }
        }
    }
};
</script>

<style scoped>
.box-summarize {
    border: 0px;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    /* background-image: linear-gradient(to right, #7cccb8 0%, #1185c9  51%, #4b9ed4  100%); */
    background-image: linear-gradient(to right, #56a7b6 0%, #6d5fa0 51%, #4b9ed4 100%);
    border-radius: 12px;
    padding-right: 10px;
    padding-left: 10px;
    padding-top: 3px;
    padding-bottom: 3px;
    margin-left: 4px;
    transition: 0.5s;
    background-size: 200% auto;
    color: white;
    /* position: relative; */
    top: -3px;
}

.box-summarize:hover {
    background-image: linear-gradient(to right, #d8cb16 0%, #8474be 70%, #2b5876 100%);
    background-position: right center;
    color: #fff;
    text-decoration: none;
}
</style>
