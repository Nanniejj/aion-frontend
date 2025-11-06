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
        <b-row class="m-0">
            <b-col cols="auto" sm="auto" class="px-0">
                <b-button variant="outline-secondary" class="mr-2" v-b-toggle href="#trendSummary" @click.prevent><i class='fas fa-chart-line mr-1'></i>Trend Summary</b-button>
            </b-col>
            <b-col cols="auto" sm="auto" class="px-0">
                <b-button variant="outline-secondary" class="mr-2 mt-sm-0" v-b-toggle href="#top-participants" @click.prevent><i class='fas fa-fire mr-1'></i>Top 10 at Peak</b-button>
            </b-col>
            <b-col cols="auto" sm="" class="mt-2 text-right px-0">
                <button
                    :variant="open ? 'info' : 'outline-info'"
                    size="sm"
                    class="analysis-button"
                    :class="{ 'is-glowing': analyzing }"
                    type="button"
                    @click="summarizePosts()"
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
                        {{ analyzing ? 'Analyzing...' : 'Analysis (beta)' }}
                    </span>
                </button>
                <a v-b-toggle v-if="fullSummary && !open" @click.prevent="toggle" class="px-2">บทวิเคราะห์ล่าสุด</a>
                <!-- <b-button v-if="fullSummary && !open" size="sm" variant="outline-info" 
                    class="d-inline-flex" 
                    @click="toggle"
                    :disabled="analyzing"
                >
                    บทวิเคราะห์ล่าสุด
                </b-button> -->
            </b-col>
        </b-row>
        <b-col cols="12" class="pt-2 text-danger" style="font-size: small;" v-if="fullSummary && !open">
            *** หมายเหตุ: หากต้องการบทวิเคราะห์ใหม่ กรุณากดปุ่ม "Analysis" อีกครั้ง
        </b-col>
        <!-- <b-collapse id="trendSummary" class="my-2">
            <b-card title="Collapsible card">
                Hello world!
            </b-card>
        </b-collapse>
        <b-collapse id="top-participants" class="my-2">
            <b-card title="Collapsible card">
                Hello world!
            </b-card>
        </b-collapse> -->
        <b-collapse v-model="open" class="my-2">
            <!-- <b-card class="shadow-sm" style="border-radius: 16px;min-height: 100px;max-height: 400px;overflow-y: auto;">
                <b-row class="m-0 align-items-center mb-2">
                    <b-col cols="12" md="" class="px-0">การวิเคราะห์แนวโน้ม
                        <span v-if="filters.keywordInput">เกี่ยวกับ <span class="bold">{{ filters.keywordInput }}</span></span>
                        <span v-if="filters.view_mode === 'daily'">ของโพสต์ในช่วง</span>
                        <span v-if="filters.view_mode === 'posts'">ตามเวลา</span>ในวัน {{ formatDateRange() }}
                    </b-col>
                    <b-col cols="auto" md="auto" class="px-0">
                        <b-button size="sm" variant="outline-secondary" class="d-inline-flex" @click="copyFull"
                            :disabled="!fullSummary">
                            คัดลอกสรุป
                        </b-button>
                    </b-col>
                    <b-col cols="auto" class="">
                        <button @click="toggle" class="btn d-inline-flex align-items-center btn-info btn-sm">
                            <i class="fas fa-sliders mr-2" aria-hidden="true"></i>
                            <span class="small">Hide</span>
                        </button>
                    </b-col>
                </b-row>
               
                <div v-if="analyzing" class="text-center my-3">
                    <vue-element-loading :active="analyzing" size="60" background-color="rgba(255,255,255,0.5)"
                        color="#17a2b891" />
                </div>
                <div v-else class="text-left pb-3">
                    
                    <div v-html="formatSummarize(fullSummary)"></div>
                </div>
            </b-card> -->
            <b-card class="shadow-sm" header-class="border-0" body-class="pt-0" style="border-radius: 16px; min-height: 100px;">
                    <!-- ส่วน header ให้ scroll -->
                    <template #header>
                        <b-row class="m-0 align-items-center justify-content-center">
                            <b-col cols="12" md="" class="px-0">
                                การวิเคราะห์แนวโน้ม
                                <span v-if="filters.keywordInput">เกี่ยวกับ <span class="bold">{{ filters.keywordInput }}</span></span>
                                <span v-if="filters.view_mode === 'daily'">ของโพสต์ในช่วง</span>
                                <span v-if="filters.view_mode === 'posts'">ตามเวลา</span>ในวัน {{ formatDateRange() }}
                            </b-col>
                            <b-col cols="auto" md="auto" class="px-0">
                                <b-button size="sm" variant="outline-secondary" class="d-inline-flex" @click="copyFull"
                                :disabled="!fullSummary">
                                คัดลอกสรุป
                                </b-button>
                            </b-col>
                            <b-col cols="auto" class="">
                                <button @click="toggle" class="btn d-inline-flex align-items-center btn-info btn-sm">
                                <i class="fas fa-sliders mr-2" aria-hidden="true"></i>
                                <span class="small">Hide</span>
                                </button>
                            </b-col>
                        </b-row>
                        
                    </template>

                    <!-- ส่วนเนื้อหา -->
                    <b-card-text class="card-body-scroll">
                        <div v-if="analyzing" class="text-center my-3">
                        <vue-element-loading :active="analyzing" size="60" background-color="rgba(255,255,255,0.5)" color="#17a2b891" />
                        </div>
                        <div v-else class="text-left pb-3">
                        <div v-html="formatSummarize(fullSummary)"></div>
                        </div>
                    </b-card-text>
            </b-card>

        </b-collapse>
        
    </div>
</template>

<script>
import Swal from 'sweetalert2';

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
            commentLimit: 5,
            postLimit: 5, 
            postsByEngagement: [], 
            loadingPost: false,
        };
    },
    computed: {
        filteredPosts() {
            const keysToKeep =
                [
                    'date', 'source', 'account_name', 'full_text',
                    'engagement', 'comments'
                ];
            const commentKeys = ['username', 'content', 'time'];
            const start = new Date(this.filters.start); // "2025-11-03T00:00:00"
            const end = new Date(this.filters.end);     // "2025-11-05T23:59:59"

            // ส่วนต่างของเวลา (มิลลิวินาที)
            const diffTime = Math.abs(end - start);

            // แปลงเป็นจำนวน "วัน" (ปัดขึ้น เพราะ end อาจเกินเที่ยงคืน)
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            console.log(diffDays); // ✅ จะได้ 3 วัน (03, 04, 05)

            if (diffDays > 2 && Array.isArray(this.posts)) {
                let limit = parseInt(this.postLimit/this.posts.length);
                let temp = this.posts
                    .map(post => {
                        if (Array.isArray(post.items)) {
                            return post.items.slice(0, limit); // เอา limit ตัวแรก
                        }
                        return null;
                    })
                    .filter(Boolean)      // ตัด post ที่ไม่มี items
                    .flat();              // ทำให้เป็น array แบนรวมทุก post
                return temp.map(post => {
                    // เลือกเฉพาะ key ที่ต้องการ
                    const filtered = Object.fromEntries(
                        Object.entries(post).filter(([key]) => keysToKeep.includes(key))
                    );

                    // จำกัดจำนวนสมาชิกใน comments ไม่เกิน 20
                    if (Array.isArray(filtered.comments)) {
                        filtered.comments = filtered.comments
                            .slice(0, this.commentLimit) // จำกัดสมาชิกสูงสุด 20
                            .map(comment =>
                            Object.fromEntries(
                                Object.entries(comment).filter(([key]) => commentKeys.includes(key))
                            )
                            );
                    }

                    return filtered;
                });
                
            }
            // 'url_post',
            if (Array.isArray(this.posts)) {
                return this.posts.map(post => {
                    // เลือกเฉพาะ key ที่ต้องการ
                    const filtered = Object.fromEntries(
                        Object.entries(post).filter(([key]) => keysToKeep.includes(key))
                    );

                    // จำกัดจำนวนสมาชิกใน comments ไม่เกิน 20
                    if (Array.isArray(filtered.comments)) {
                        filtered.comments = filtered.comments
                            .slice(0, this.commentLimit) // จำกัดสมาชิกสูงสุด 20
                            .map(comment =>
                            Object.fromEntries(
                                Object.entries(comment).filter(([key]) => commentKeys.includes(key))
                            )
                            );
                    }

                    return filtered;
                });
            }

            if (typeof this.posts === 'object' && this.posts !== null) {
                const filtered = Object.fromEntries(
                    Object.entries(this.posts).filter(([key]) => keysToKeep.includes(key))
                );

                if (Array.isArray(filtered.comments)) {
                    filtered.comments = filtered.comments
                    .slice(0, this.commentLimit)
                    .map(comment =>
                        Object.fromEntries(
                        Object.entries(comment).filter(([key]) => commentKeys.includes(key))
                        )
                    );
                }

                return filtered;
            }
            return [];
        },
    },
    methods: {
        parseSentimentStats(text) {
            if (!text) return [];

            // ดึงเฉพาะส่วนหัวข้อ 2)
            const match = text.match(/##\s*2\)\s*ภาพรวม\s*Social\s*Sentiment([\s\S]*)/i);
            if (!match) return [];

            const section = match[1].trim();
            const hasSubTopics = section.includes('**โครงการ') || section.includes('**การ');

            if (hasSubTopics) {
                // 🔹 กรณีมีหลายหัวข้อย่อย เช่น โครงการ xxx, การ xxx
                const topics = section.split(/\n\s*\*\*([^*]+?)\*\*:/).slice(1);
                const results = [];

                for (let i = 0; i < topics.length; i += 2) {
                const title = topics[i].trim();
                const content = topics[i + 1] || '';

                const sentimentLineMatch = content.match(/ภาพรวม[:：]?\s*(.*)/);
                const sentimentLine = sentimentLineMatch ? sentimentLineMatch[1] : '';

                const negMatch = sentimentLine.match(/ลบ\s*(\d+)%/);
                const neuMatch = sentimentLine.match(/กลาง\s*(\d+)%/);
                const posMatch = sentimentLine.match(/บวก\s*(\d+)%/);

                const sentiment = {
                    ลบ: negMatch ? parseInt(negMatch[1]) : 0,
                    กลาง: neuMatch ? parseInt(neuMatch[1]) : 0,
                    บวก: posMatch ? parseInt(posMatch[1]) : 0,
                };

                results.push({ title, sentiment });
                }

                return results;
            } else {
                // 🔹 กรณีไม่มีหัวข้อย่อย (เช่น “ภาพรวมโดยประมาณ”)
                // ดึงเปอร์เซ็นต์จากทุกที่ในส่วนนี้
                const posMatch = section.match(/บวก[:：]?\s*(\d+)%/);
                const neuMatch = section.match(/กลาง[:：]?\s*(\d+)%/);
                const negMatch = section.match(/ลบ[:：]?\s*(\d+)%/);

                const sentiment = {
                ลบ: negMatch ? parseInt(negMatch[1]) : 0,
                กลาง: neuMatch ? parseInt(neuMatch[1]) : 0,
                บวก: posMatch ? parseInt(posMatch[1]) : 0,
                };

                return [{ title: "ภาพรวม Social Sentiment", sentiment }];
            }
        },
        extractSection2(text) {
            const match = text.match(/##\s*2\)[\s\S]*?(?=##\s*3\)|$)/);
            return match ? match[0].trim() : "";
        },
        formatSummarize(text) {
            if (!text) return '';
            // console.log("text === ", text);

            // 1) แปลง markdown พื้นฐาน เป็น HTML ชิ้นเล็ก ๆ (แต่ยังไม่ครอบด้วย <p> หรือ <ul>)
            let html = text
                // headings
                .replace(/^##\s?(.*)$/gm, '<h4 style="margin:12px 0 6px; font-size:1.1rem;"><strong>$1</strong></h4>')
                .replace(/^###\s?(.*)$/gm, '<h4 style="margin:8px 0 4px; font-size:1rem;">$1</h4>')
                // bullet + bold
                .replace(/^\s*\*\s+\*\*(.*?)\*\*(.*)$/gm, '<li style="margin-left:40px;"><b>$1</b>$2</li>')
                // bullet ปกติ (รองรับ space นำหน้า)
                .replace(/^\s*\*\s+(.*)$/gm, '<span style="margin-left:40px;">$1</span>')
                // numbered list (รองรับ space นำหน้า)
                .replace(/^\s*\d+\.\s+(.*)$/gm, '<li style="margin-left:40px;">$1</li>')
                // bold ทั่วไป
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

                // console.log(html);
                
            // 2) รวมกลุ่ม <li> ต่อเนื่องเป็น <ul>...</ul>
            // ใช้ flag g และ [\s\S] เพื่อให้จับหลายบรรทัดอย่างถูกต้อง
            // html = html.replace(/((?:\s*<li>[\s\S]*?<\/li>\s*)+)/g, (match) => {
            //     // ตัด whitespace ด้านหน้า/หลังแล้วห่อด้วย <ul>
            //     return `<ul style="margin:4px 0 8px 20px; padding-left:20px;">${match.trim()}</ul>`;
            // });
            // html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul style="padding-left:20px;margin-bottom:0px !important;">$1</ul>');

            // 3) แยกเป็นบล็อกตามย่อหน้าจากต้นฉบับ (สองบรรทัดขึ้นไปเป็น delimiter)
            // เพื่อให้เราตัดสินใจว่าจะครอบ <p> หรือไม่ (ถ้าเป็น <h3>, <h4>, <ul>, <ol> จะไม่ครอบ)
            const blocks = html.split(/\n{2,}/);

            const processedBlocks = blocks.map(block => {
                const trimmed = block.trim();
                if (!trimmed) return '';

                // ถ้าบล็อกเริ่มด้วยแท็ก heading หรือ ul/ol ให้คืนค่าแบบนั้นเลย
                // if (/^(<h3|<h4)/i.test(trimmed)) {
                // // if (/^(<h3|<h4|<ul|<ol)/i.test(trimmed)) {
                // // ภายใน block ให้แทน \n เป็น <br> เฉพาะบรรทัดที่ยังเป็นข้อความปกติ
                // return trimmed.replace(/\n/g, '<br>');
                // }

                // ถ้าไม่ใช่หัวข้อหรือรายการ ให้ครอบด้วย <p> และแปลง \n → <br>
                const inner = trimmed.replace(/\n/g, '');
                return `<p style="margin:0 0 6px; line-height:1.5;">${inner}</p>`;
            });

            // 4) รวมกลับเป็น string เดียว
            const result = processedBlocks.join('');

            return result;
        },
        toggle() {
            // this.analyzing = !this.analyzing;
            this.open = !this.open;
        },
        formatDateRange() {
            const start = new Date(this.filters.start);
            const end = new Date(this.filters.end);

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
        sortByEngagement() {
            // console.log("post in sum === ",this.posts);
            
            // return posts.slice().sort((a, b) => this.engValue(b) - this.engValue(a));
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
            this.open = false;
            const bodyData = {
                posts: this.filteredPosts.slice(0, this.postLimit),
                // posts: this.filters.view_mode === "daily"
                // ? this.filteredPosts.map(post => post.items[0]).filter(Boolean) // เอา items[0] ของทุกสมาชิก และกรองค่า undefined
                // : this.filteredPosts.slice(0, this.postLimit)  
            };
            // console.log("Body size:", JSON.stringify(bodyData).length / 1024, "KB");

            const config = {
                method: "post",
                url: "https://api2.cognizata.com/api/v2/userposts/summarize-timeline",
                data: bodyData,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
                maxContentLength: Infinity, // ✅ อนุญาตขนาด content ได้ไม่จำกัด
                maxBodyLength: Infinity     // ✅ อนุญาตขนาด body ได้ไม่จำกัด
            };
            try {
                const response = await this.axios(config); // ✅ ใช้ await
                this.fullSummary = response.data.final_summary || "ไม่มีสรุปผล";
                this.analyzing = false;
                this.open = true;
                // let section2 = this.extractSection2(this.fullSummary);
                // console.log("Section 2:", section2);
                // let sentimentStats = this.parseSentimentStats(section2);
                // console.log("Sentiment Stats:", sentimentStats);
                // console.log("Response:", response.data);
            }
            catch (error) {
                this.analyzing = false;  // ปิด loading เสมอ

                // แสดง alert ให้ผู้ใช้
                Swal.fire({
                    icon: 'error',
                    title: `เกิดข้อผิดพลาด`,
                    text: 'ไม่สามารถวิเคราะห์โพสต์ได้ กรุณาลองใหม่อีกครั้ง',
                });
            }

        }
    },
    mounted() {
       
    },
    watch: {
        posts: {
            handler(newVal, oldVal) {
                this.fullSummary = null;
                this.open = false;
            },
            // immediate: true
        }
    }
};
</script>

<style scoped>
/* .card-scroll {
  max-height: 400px;
} */

.card-header-scroll {
  max-height: 120px; /* กำหนดความสูงส่วนหัว */
  overflow-y: auto; /* ให้ scroll เฉพาะ header */
  padding: 8px 12px;
}

.card-body-scroll {
  max-height: 400px; 
  overflow-y: auto;
}

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
