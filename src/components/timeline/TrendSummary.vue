<template>
  <b-card header-class="text-left">
    <template #header>
        <span>📝 สรุปแนวโน้มกราฟสถิติรายชั่วโมง </span>
        <button
            variant="info"
            size="sm"
            class="analysis-button"
            :class="{ 'is-glowing': analyzing }"
            type="button"
            @click="summarizeGraph()"
            :disabled="analyzing"
        >
            <img
                width="22"
                height="22"
                src="https://img.icons8.com/ios-filled/50/sparkling--v1.png"
                alt="sparkling"
                class="spark-icon"
                style="filter: brightness(0) invert(1);"
            />
            <span class="md-font">
                {{ analyzing ? 'Analyzing...' : 'Chart Analyze (beta)' }}
            </span>
        </button>
    </template>

    <div v-if="summary && summary.text" class="text-left card-body-scroll">
      <div>
        <span v-if="filters && filters.keyword">
          ประเด็น <b>{{ displayKeyword }}</b>
        </span>
        {{ dates }}
      </div>

      <p>
        โพสต์รวม {{ fmtNum((totalsCount && totalsCount.post) || 0) }}
        ข้อความรวม {{ fmtNum((totalsCount && totalsCount.msg) || 0) }}
        และการมีส่วนร่วมรวม {{ fmtNum((totalsCount && totalsCount.eng) || 0) }}
      </p>

      <ul class="mb-0 pl-4 ">
        <li v-for="(b, i) in (summary.bullets || [])" :key="'b' + i">{{ b }}</li>
      </ul>

      <p class="my-2" style="white-space: pre-line;">{{ summary.text }}</p>
      <div v-if="analyzing" class="text-center my-3" style="min-height: 100px;">
          <vue-element-loading :active="analyzing" size="60" background-color="rgba(255,255,255,0.5)" color="#17a2b891" />
            <span class="text-muted" style="font-size: 1.1rem;">
            กำลังวิเคราะห์…
            </span>
        </div>
      <div v-if="fullSummary" >
        <span class="mt-3 bold">บทวิเคราะห์</span>
          <div class="text-left pb-3">
            <ul class="mb-0 pl-4 ">
                <li class="bold">วิเคราะห์ช่วงเวลาที่มี Engagement สูงสุด ({{  fmtNum(fullSummary.peak_engagement_summary.engagement_value || 0) }})</li>
                <span>{{ fullSummary.peak_engagement_summary.interpretation }}<br></span>
                <!-- <div class="d-flex flex-wrap"> -->
                    <span class="bold" >ประเด็น : </span>
                    <b-badge 
                        variant="warning" 
                        v-for="item in fullSummary.peak_engagement_summary.key_drivers" 
                        :key="item"
                        class="mr-2 mb-2 badge-wrap"
                    >
                        {{ item }}
                    </b-badge>
                <!-- </div> -->
                <li class="bold">วิเคราะห์ช่วงเวลาที่มีจำนวน Post สูงสุด ({{  fmtNum(fullSummary.peak_post_count_summary.post_count_value || 0) }} โพสต์)</li>
                <span>{{ fullSummary.peak_post_count_summary.interpretation }}<br></span>
                <span class="bold" >ประเด็น : </span>
                <b-badge 
                    variant="warning" 
                    v-for="item in fullSummary.peak_post_count_summary.key_drivers" 
                    :key="'index - '+item"
                    class="mr-2 mb-2 badge-wrap"
                >{{ item }}</b-badge>
            </ul>
            <!-- {{ fullSummary }} -->
          <!-- <div v-html="formatSummarize(fullSummary)"></div> -->
          </div>
            <b-col cols="12" class="pt-2 text-danger" style="font-size: small;" v-if="fullSummary">
                *** หมายเหตุ: หากต้องการบทวิเคราะห์ใหม่ กรุณากดปุ่ม "Chart Analyze" อีกครั้ง
            </b-col>
      </div>
    </div>
    <!-- ส่วนเนื้อหา -->
    <div v-else class="text-muted">ไม่มีข้อมูลสำหรับสรุป</div>
  </b-card>
</template>

<script>
import Swal from 'sweetalert2';
export default {
    name: 'TrendSummary',
    props: {
        summary: { type: Object, default: () => ({ text: '', bullets: [], stats: null }) },
        filters: { type: Object, default: () => ({}) },
        dates: { type: String, default: null },
        totalsCount: { type: Object, default: () => null }
    },
    computed: {
        displayKeyword() {
        const k = (this.filters && this.filters.keyword) ? String(this.filters.keyword) : ''
        return k.replace('+', ' ').replace('+', ' หรือ ')
        }
        },
    data() {
        return {
            analyzing: false,
            fullSummary: null,
        }
    },
    watch: {
        // filters: {
        //     handler(newVal, oldVal) {
        //     if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return;
        //     this.summarizeGraph();
        //     },
        //     deep: true,
        //     immediate: true
        // }
    },
    methods: {
        fmtNum(n) {
            const v = Number(n || 0)
            return Number.isFinite(v) ? v.toLocaleString('th-TH') : '0'
        },
        async summarizeGraph() {
            this.analyzing = true;
            this.fullSummary = null;
            // this.open = false;

            // --- สร้าง params จาก props.filters ---
            const f = this.filters || {};

            const params = {
                sentiment: f.sentiment ?? "1,0,-1",
                start: f.start,
                end: f.end,
                // limit: f.limit ?? 10,
                // page: f.page ?? 1,
                account: f.account,
                keyword: f.keyword ||"",
                sort_by: f.sort_by,
                source: f.source,
                exclude: f.exclude,
            };

            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/userposts/summarize-graph",
                params,
                headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json"
                },
                // timeout: 120000
            };

            try {
                const response = await this.axios(config);
                let data = response?.data;
                // console.log(data);
                // console.log("typeof data =", typeof data);
                // ถ้า data เป็น string ให้ parse
                if (typeof data === "string") {
                    // ลบ ```json ด้านหน้า และ ``` ด้านท้าย (ถ้ามี)
                    data = data.replace(/^```json\s*/, '').replace(/\s*```$/, '');

                    try {
                        data = JSON.parse(data);  // แปลง string -> object
                    } catch (err) {
                        console.error("JSON parse error:", err);
                        data = {}; // fallback ป้องกัน error
                    }
                }
                this.fullSummary = data.summary_report ?? {};
                this.analyzing = false;
                // this.open = true;

            } catch (error) {
                this.analyzing = false;

                console.error("summarizePostsV2 error:", error);

                let msg = "ไม่สามารถวิเคราะห์โพสต์ได้ กรุณาลองใหม่อีกครั้ง";

                if (error.response?.data?.message) {
                msg = error.response.data.message;
                } else if (typeof error.response?.data === "string") {
                msg = error.response.data;
                }

                Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: msg
                });
            }
        },
    }
}
</script>

<style scoped>
/* .card-scroll {
  max-height: 400px;
} */
@media (max-width: 767.98px) {
  .badge-wrap {
    white-space: normal !important; /* ให้ขึ้นบรรทัด */
    word-break: break-word;         /* กันข้อความยาวล้น */
  }
}
.card-header-scroll {
  max-height: 120px; /* กำหนดความสูงส่วนหัว */
  overflow-y: auto; /* ให้ scroll เฉพาะ header */
  padding: 8px 12px;
}

.card-body-scroll {
  max-height: 450px; 
  overflow-y: auto;
}

.box-summarize {
    border: 0px;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    /* background-image: linear-gradient(to right, #7cccb8 0%, #1185c9  51%, #4b9ed4  100%); */
    background-image: linear-gradient(to right, #c96c9b 0%, #6d5fa0 51%, #e75aa1  100%);
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
.latest-summary {
    align-self: center;
    cursor: pointer;
    transition: color .15s ease;  /* อนิเมชันเปลี่ยนสี (ไม่จำเป็นแต่สวย) */
}

/* เมื่อ hover ให้ขีดเส้นใต้และเปลี่ยนสี */
.latest-summary:hover {
  text-decoration: underline;
  text-decoration-thickness: 2px; /* ความหนาของขีด (optional) */
  text-underline-offset: 3px;     /* ระยะห่างของขีดใต้จากตัวอักษร (optional) */
  color: #17a2b891;                 /* สีเมื่อ hover */
}
.analysis-button {
  position: relative;
  border: none;
  outline: none;
  background-image: linear-gradient(to right, #c96c9b 0%, #6d5fa0 51%, #e75aa1  100%);
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
    #c96c9b 0%, #6d5fa0 51%, #e75aa1  100%
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
