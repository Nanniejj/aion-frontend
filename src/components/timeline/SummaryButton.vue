<template>
    <div class="">
        <!-- <span v-b-toggle="'summarize' + page + k" id="box-summarize" v-b-tooltip.hover
                      title="comments analysis" v-if="postDomain.summarize">
                      <img width="22" height="22" src="https://img.icons8.com/ios-filled/50/sparkling--v1.png"
                        alt="sparkling" style="filter: brightness(0) invert(1);" />
                      <span class="md-font">
                        Analysis
                      </span>
                    </span> -->
        <!-- <b-button :variant="open ? 'info' : 'outline-info'" size="sm" pill
            class="d-inline-flex align-items-center box-summarize" @click="toggle" :disabled="loading">
            <img width="22" height="22" src="https://img.icons8.com/ios-filled/50/sparkling--v1.png" alt="sparkling"
                style="filter: brightness(0) invert(1);" />
            <span class="md-font">
                Analysis
            </span>
        </b-button> -->
        <button
            :variant="open ? 'info' : 'outline-info'"
            size="sm"
            class="analysis-button"
            :class="{ 'is-glowing': analyzing }"
            type="button"
            @click="summarizePosts()"
        >
            <!-- :disabled="analyzing" -->
            <img
                width="22"
                height="22"
                src="https://img.icons8.com/ios-filled/50/sparkling--v1.png"
                alt="sparkling"
                class="spark-icon"
                style="filter: brightness(0) invert(1);"
            />
            <span class="md-font">
                {{ analyzing ? 'Analyzing...' : 'Analysis' }}
            </span>
        </button>

        <b-collapse v-model="open" class="mt-2">
            <b-card class="shadow-sm" style="border-radius: 16px;min-height: 100px;">
                <b-col cols="12" class="px-0 bold">การวิเคราะห์แนวโน้ม<span v-if="filters.view_mode === 'posts'">ตามเวลา</span>ในวัน {{ formatDateRange() }}</b-col>
                <!-- {{ filters }} -->
                <div v-if="analyzing" class="text-center my-3">
                    <vue-element-loading :active="analyzing" size="60" background-color="rgba(255,255,255,0.5)"
                        color="#17a2b891" />
                </div>
                <div v-else class="text-left">
                    <div v-html="formatSummarize(fullSummary)"></div>
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
            analyzing: false,
            fullSummary: null,
        };
    },
    computed: {
        
    },
    methods: {
        formatSummarize(text) {
            if (!text) return '';

            // ✅ แปลง Markdown พื้นฐานเป็น HTML
            let html = text
                // หัวข้อ ## → <h3>
                .replace(/^##\s?(.*)$/gm, '<h3 style="margin: 12px 0 6px; font-size: 1.1rem;">$1</h3>')
                // หัวข้อ ### → <h4>
                .replace(/^###\s?(.*)$/gm, '<h4 style="margin: 8px 0 4px; font-size: 1rem;">$1</h4>')
                // รายการ bullet `*`
                .replace(/^\*\s+(.*)$/gm, '<li>$1</li>')
                // รายการเลข `1.`, `2.` ฯลฯ
                .replace(/^\d+\.\s+(.*)$/gm, '<li>$1</li>')
                // **ตัวหนา**
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                // บรรทัดว่าง → <p>
                .replace(/\n{2,}/g, '</p><p>')
                // แปลงบรรทัดเดี่ยวเป็น <br>
                .replace(/\n/g, '<br>');

            // ✅ ครอบ <ul> และ <ol> ให้ถูกต้อง
            html = html
                .replace(/(<li>.*<\/li>)/gs, '<ul style="margin:4px 0 8px 20px; padding:0;">$1</ul>')
                .replace(/(<ul>)(?:\s*<ul>)+/g, '$1'); // ป้องกันซ้อนซ้ำ

            // ✅ ครอบด้วย <p> ทั้งหมดถ้าไม่ใช่ <h3>, <ul> ฯลฯ
            html = `<p style="margin:0 0 6px; line-height:1.5;">${html}</p>`;

            return html;
            },
        toggle() {
            // this.analyzing = !this.analyzing;
            this.open = !this.open;
        },
        formatDateRange() {
            const start = new Date(this.filters.startLocal);
            const end = new Date(this.filters.endLocal);

            // รีเซ็ตเวลาเพื่อเปรียบเทียบเฉพาะวัน
            const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

            const diffTime = endDate - startDate;
            const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1;

            // ฟังก์ชันช่วย format เป็น DD/MM/YYYY
            const format = (date) => {
                const d = date.getDate().toString().padStart(2, '0');
                const m = (date.getMonth() + 1).toString().padStart(2, '0');
                const y = date.getFullYear();
                return `${d}/${m}/${y}`;
            }

            if (diffDays <= 1) {
                return format(startDate); // วันเดียว
            } else {
                return `${format(startDate)} - ${format(endDate)}`; // ช่วงหลายวัน
            }
        },
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
        },
        async summarizePosts() {
            // ตัวอย่างฟังก์ชันวิเคราะห์โพสต์ (จำลองดีเลย์)
            this.analyzing = true;
            const bodyData = {
                posts: this.posts.slice(0, 5)
                // [
                //     {
                //         date: "2025-10-17",
                //         source: "facebook",
                //         account_name: "กันจอมพลัง",
                //         full_text: "บ้านหนองจาน",
                //         url_post: "https://www.facebook.com/gunjompalang1/videos/1978280722928879/",
                //         engagement: 83000,
                //         comments: []
                //     }
                // ]
            };
            const config = {
                method: "post",
                url: "https://api2.cognizata.com/api/v2/userposts/summarize-timeline",
                data: bodyData,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };
            try {
                const response = await this.axios(config); // ✅ ใช้ await
                this.fullSummary = response.data.final_summary || "ไม่มีสรุปผล";
                this.analyzing = false;
                this.open = true;
                console.log("Response:", response.data);
            } catch (error) {
                this.analyzing = false;
                console.error("Error calling API:", error);
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

.analysis-button {
  position: relative;
  border: none;
  outline: none;
  background-image: linear-gradient(to right, #56a7b6 0%, #6d5fa0 51%, #4b9ed4 100%);
  color: #fff;
  cursor: pointer;
  z-index: 0;
  border-radius: 12px;
  padding: 5px 14px;
  transition: 0.3s;
}

/* กรอบแสง */
.analysis-button::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 10px;
  background: linear-gradient(
    45deg,
    #56a7b6 , #6d5fa0 , #4b9ed4,#56a7b6
     /* #ffc62a, 
    #d62976, #962fbf,
    #4f5bd5,#ffc62a */
  );
  background-size: 400%;
  z-index: -1;
  filter: blur(3px);
  opacity: 0;
  border-radius: 12px;
  transition: opacity 0.3s ease-in-out;
  animation: glowing 20s linear infinite;
}

/* ✅ เปิดเรืองแสงตอน loading */
.analysis-button.is-glowing::before {
  opacity: 1;
}

/* ✨ กระพริบเฉพาะตอน loading */
.analysis-button.is-glowing .spark-icon {
  animation: blinkAnim 1s infinite ease-in-out;
}

/* Animation keyframes */
@keyframes glowing {
  0%   { background-position: 0 0; }
  50%  { background-position: 400% 0; }
  100% { background-position: 0 0; }
}

@keyframes blinkAnim {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
    /* filter: brightness(2); */
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
    /* filter: brightness(3) drop-shadow(0 0 6px #00eaff); */
  }
}
</style>
