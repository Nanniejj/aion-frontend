<template>
    <div class="">
        <b-row class="m-0 no-print">
            <b-col v-if="!hideTrandButton" cols="auto" sm="auto" class="px-0 mt-2 mr-2">
                <b-button  size="sm" :variant="openTrendSummary ? 'secondary' : 'outline-secondary'" 
                    class=" w-100" v-b-toggle href="#trendSummary" @click.prevent>
                    <span v-if="!openTrendSummary">
                        <i class='fas fa-chart-line mr-1'></i>
                        Trend Summary
                    </span>
                    <span v-else>
                        <i class='fas fa-eye-slash mr-1'></i>
                        Trend Summary
                    </span>
                </b-button>
            </b-col>
            <b-col cols="auto" sm="auto" class="mt-2 mr-2 px-0">
                <b-button size="sm" :variant="openTopUsers ? 'secondary' : 'outline-secondary'"
                class="w-100" v-b-toggle href="#top-participants" 
                @click.prevent>
                <span v-if="!openTopUsers">
                    <i class='fas fa-fire mr-1'></i>
                    Top 10 User</span>
                <span v-else>
                    <i class='fas fa-eye-slash mr-1'></i>
                    Top 10 User
                </span>
            </b-button>
            </b-col>
            <b-col v-if="!loading && (username === 'adminatapy'|| username === 'cyberunit02')" cols="auto" sm="" class="mt-2 text-right px-0">
                <button
                    :variant="open ? 'info' : 'outline-info'"
                    size="sm"
                    class="analysis-button"
                    :class="{ 'is-glowing': analyzing }"
                    type="button"
                    @click="summarizePostsV2()"
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
                        {{ analyzing ? analyzingLabel : 'Analysis (beta)' }}
                    </span>
                </button>
                <a v-b-toggle v-if="fullSummary && !open && !analyzing" @click.prevent="toggle" class="px-2">บทวิเคราะห์ล่าสุด</a>
            </b-col>
        </b-row>
        <b-col cols="12" class="pt-2 text-danger no-print" style="font-size: small;" v-if="fullSummary && !open">
            *** หมายเหตุ: หากต้องการบทวิเคราะห์ใหม่ กรุณากดปุ่ม "Analysis" อีกครั้ง
        </b-col>
        <b-collapse v-model="open" class="my-2 nuxt-page">
            <b-card class="shadow-sm summary-card" header-class="border-0" body-class="pt-0" style="border-radius: 16px; min-height: 100px;">
                <!-- ส่วน header ให้ scroll -->
                <template #header>
                    <b-row class="m-0 align-items-center justify-content-center">
                        <b-col cols="12" md="" class="summary-title px-0">
                            การวิเคราะห์แนวโน้ม
                            <span v-if="filters.keywordInput">เกี่ยวกับ <span class="bold">{{ filters.keywordInput }}</span></span>
                            <span v-if="filters.view_mode === 'daily'">ของโพสต์ในช่วง</span>
                            <span v-if="filters.view_mode === 'posts'">ตามเวลา</span>ในวัน {{ formatDateRange() }}
                        </b-col>
                        <b-col cols="auto" md="auto" class="px-0 no-print">
                            <b-button size="sm" variant="outline-secondary" class="d-inline-flex" @click="copyFull"
                            :disabled="!fullSummary || analyzing">
                            คัดลอกสรุป
                            </b-button>
                        </b-col>
                        <b-col cols="auto" class="no-print">
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
                        <div class="text-muted mt-2 small">{{ analyzingLabel }}</div>
                    </div>
                    <div v-else class="text-left pb-3">
                        <div v-html="formatSummarize(fullSummary)"></div>

                        <sentiment-ratio-chart
                            v-if="hasSentimentChart"
                            class="nuxt-page mt-5"
                            :items="sentimentBySection"
                            chart-title="สัดส่วนความคิดเห็นจากสื่อสังคม"
                        ></sentiment-ratio-chart>
                    </div>
                </b-card-text>
            </b-card>
        </b-collapse>
    </div>
</template>

<script>
import Swal from 'sweetalert2';
import SentimentRatioChart from './SentimentRatioChart.vue';

export default {
    name: "SummaryButton",
    components: {
        SentimentRatioChart,
    },
    props: {
        hideTrandButton:{ type: Boolean, default: false },
        posts: { type: [Array, Object], required: true }, // postsFromApi (flat array หรือ grouped daily)
        filters: { type: Object, required: true },
        loading: { type: Boolean, default: false },
        openTrendSummary: { type: Boolean, default: false },
        openTopUsers: { type: Boolean, default: false },
        // จะเอากี่อันดับดี ๆ
        topN: { type: Number, default: 5 },
    },
    data() {
        return {
            username: "",
            open: false,
            analyzing: false,
            analyzingLabel: "Analyzing...",
            fullSummary: null,
            commentLimit: 5,
            postLimit: 5, 
            postsByEngagement: [], 
            loadingPost: false,
            // ใช้เก็บ token ของรอบ polling ปัจจุบัน เผื่อ user กดยกเลิก/เปลี่ยน filter ระหว่างรอ
            pollToken: 0,
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

            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 2 && Array.isArray(this.posts)) {
                let limit = parseInt(this.postLimit/this.posts.length);
                let temp = this.posts
                    .map(post => {
                        if (Array.isArray(post.items)) {
                            return post.items.slice(0, limit);
                        }
                        return null;
                    })
                    .filter(Boolean)
                    .flat();
                return temp.map(post => {
                    const filtered = Object.fromEntries(
                        Object.entries(post).filter(([key]) => keysToKeep.includes(key))
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
                });
                
            }

            if (Array.isArray(this.posts)) {
                return this.posts.map(post => {
                    const filtered = Object.fromEntries(
                        Object.entries(post).filter(([key]) => keysToKeep.includes(key))
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
        // ดึงข้อมูล บวก/กลาง/ลบ ของแต่ละ "ประเด็นที่ N" จากส่วน "เสียงจากสื่อสังคม"
        // ใช้ parseTopicStats() ซึ่งอ่านค่าแบบไม่สนลำดับ บวก/กลาง/ลบ ในข้อความต้นฉบับ
        // คืนค่าเป็น array [{index, title, positive, neutral, negative, engagementTrend}, ...]
        // ส่งตรงเข้า <sentiment-ratio-chart :items="...">
        sentimentBySection() {
            return this.parseTopicStats(this.fullSummary);
        },
        hasSentimentChart() {
            return this.sentimentBySection.length > 0;
        },
    },
    methods: {
        // parser ของ format เดิม (## 2) ภาพรวม Social Sentiment)
        parseSentimentStats(text) {
            if (!text) return [];

            const match = text.match(/##\s*2\)\s*ภาพรวม\s*Social\s*Sentiment([\s\S]*)/i);
            if (!match) return [];

            const section = match[1].trim();
            const hasSubTopics = section.includes('**โครงการ') || section.includes('**การ');

            if (hasSubTopics) {
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
        // parser ของ format ใหม่: หัวข้อ "2. เสียงจากสื่อสังคม" มีบล็อกย่อยแบบ
        // "ประเด็นที่ N: <ชื่อประเด็น>" ตามด้วยบรรทัด "สัดส่วน: ..." ซึ่งลำดับ บวก/กลาง/ลบ
        // ในต้นฉบับสลับกันได้ (เช่น "บวก~15%/กลาง~60%/ลบ~25%" หรือ "ลบ~85%/กลาง~10%/บวก~5%")
        // ฟังก์ชันนี้จะไล่สร้าง array เก็บสถิติของแต่ละประเด็นจาก fullSummary ทั้งหมด
        // คืนค่า: [{ index, title, positive, neutral, negative, engagementTrend }, ...]
        parseTopicStats(text) {
            if (!text) return [];

            // เอกสารต้นฉบับมี 2 รูปแบบที่พบ:
            // แบบ (1) หลายประเด็น — ใช้เส้นคั่น "════..." ล้อมหัวข้อไว้ต่างหากจากเนื้อหา เช่น
            //   ════...
            //   2. เสียงจากสื่อสังคม
            //   ════...
            //   ประเด็นที่ 1: ...
            //   ประเด็นที่ 2: ...
            // แบบ (2) ประเด็นเดียว — ไม่มีเลข "ประเด็นที่ N:" เลย สนใจแค่ว่ามีบรรทัด
            //   สัดส่วน: บวก ~30% / กลาง ~50% / ลบ ~20%
            // อยู่ที่ไหนก็ได้ใน fullSummary ก็พอ ไม่ต้องอาศัยโครงสร้าง section ใดๆ เพิ่ม

            // ลองหาโครงสร้างแบบ (1) ก่อน: แบ่งด้วยเส้นคั่น ════ แล้วหา chunk หัวข้อ จากนั้นใช้ chunk ถัดไปเป็นเนื้อหา
            let section = null;
            const dividerChunks = text.split(/═{3,}/).map(c => c.trim()).filter(Boolean);
            if (dividerChunks.length > 1) {
                const headingIdx = dividerChunks.findIndex(c => /เสียงจากสื่อสังคม/.test(c) && c.length < 60);
                if (headingIdx !== -1 && dividerChunks[headingIdx + 1]) {
                    section = dividerChunks[headingIdx + 1];
                }
            }

            // แตกเป็นบล็อกย่อยตาม "ประเด็นที่ N:" พร้อมเก็บเลขประเด็นไว้ด้วย (capturing group)
            const blocks = section ? section.split(/ประเด็นที่\s*(\d+)[:：]?\s*/).slice(1) : [];

            if (blocks.length > 0) {
                // เอกสารแบบหลายประเด็น
                const results = [];

                for (let i = 0; i < blocks.length; i += 2) {
                    const topicNo = parseInt(blocks[i], 10);
                    const block = blocks[i + 1] || '';

                    const title = (block.trim().split('\n')[0] || '').trim();
                    if (!title) continue;

                    const stats = this.extractRatioFromBlock(block);
                    if (!stats) continue;

                    results.push({
                        index: Number.isNaN(topicNo) ? results.length + 1 : topicNo,
                        title,
                        ...stats,
                    });
                }

                return results;
            }

            // ไม่มี "ประเด็นที่ N:" เลย แปลว่าเป็นเอกสารแบบประเด็นเดียว
            // ไม่ต้องหา section ให้ซับซ้อน สนใจแค่บรรทัด "สัดส่วน: บวก ~X% / กลาง ~Y% / ลบ ~Z%" ที่อยู่ตรงไหนก็ได้ใน text
            const stats = this.extractRatioFromBlock(text);
            if (!stats) return [];

            // หาชื่อประเด็นจาก "ข่าวเด่นที่สุด:" ก่อน ถ้าไม่มีค่อย fallback เป็นบรรทัดแรกสุดของ fullSummary
            const titleMatch = text.match(/ข่าวเด่นที่สุด[:：]?\s*(.+)/);
            const title = titleMatch ? titleMatch[1].trim() : (text.trim().split('\n')[0] || '').trim();

            return [{
                index: 1,
                title,
                ...stats,
            }];
        },
        // ดึงค่าสัดส่วน บวก/กลาง/ลบ + แนวโน้ม engagement + ตัวอย่างความคิดเห็นเชิงบวก/ลบ + ประเด็นที่ถูกพูดถึงซ้ำ
        // จากก้อนข้อความหนึ่งบล็อก คืนค่า null ถ้าไม่พบข้อมูลสัดส่วนเลย
        // รองรับ 2 รูปแบบ:
        //   (1) แบบย่อบรรทัดเดียว: ตัวอย่างเชิงบวก: "..." – หมายเหตุ ตัวอย่างเชิงลบ: "..." – หมายเหตุ ...
        //   (2) แบบหลายบรรทัด/หลายคำพูด: ตัวอย่างเชิงบวก: \n "..." \n "..." \n "..." \n\n ตัวอย่างเชิงลบ: ...
        //       และ ประเด็นที่ถูกพูดถึงซ้ำ เป็นลิสต์เลข 1. 2. 3.
        extractRatioFromBlock(block) {
            // ดึงเฉพาะบรรทัด "สัดส่วน: ..." กันไม่ให้ไปจับเลข % จากที่อื่นในบล็อก (เช่นในตัวอย่างคอมเมนต์)
            const ratioLineMatch = block.match(/สัดส่วน[:：]?\s*(.+)/);
            const ratioLine = ratioLineMatch ? ratioLineMatch[1] : '';

            // อ่านค่า บวก/กลาง/ลบ แบบไม่สนลำดับที่ปรากฏในข้อความ
            const posMatch = ratioLine.match(/บวก\s*~?(\d+)%/);
            const neuMatch = ratioLine.match(/กลาง\s*~?(\d+)%/);
            const negMatch = ratioLine.match(/ลบ\s*~?(\d+)%/);

            if (!posMatch && !neuMatch && !negMatch) return null;

            // ดึงข้อความของแต่ละหัวข้อย่อย (ตัวอย่างเชิงบวก/ลบ, ประเด็นที่ถูกพูดถึงซ้ำ, แนวโน้ม engagement)
            // โดยตัดขอบเขตด้วย keyword ถัดไปที่เจอก่อน — ใช้ [\s\S] เพื่อให้ครอบคลุมกรณีเนื้อหาขึ้นบรรทัดใหม่ได้ด้วย
            const positiveSectionText = this.extractLabeledSection(block, 'ตัวอย่างเชิงบวก', [
                'ตัวอย่างเชิงลบ', 'ประเด็นที่ถูกพูดถึงซ้ำ', 'แนวโน้ม\\s*engagement', 'สรุป', '--',
            ]);
            const negativeSectionText = this.extractLabeledSection(block, 'ตัวอย่างเชิงลบ', [
                'ตัวอย่างเชิงบวก', 'ประเด็นที่ถูกพูดถึงซ้ำ', 'แนวโน้ม\\s*engagement', 'สรุป', '--',
            ]);
            const recurringSectionText = this.extractLabeledSection(block, 'ประเด็นที่ถูกพูดถึงซ้ำ', [
                'ตัวอย่างเชิงบวก', 'ตัวอย่างเชิงลบ', 'แนวโน้ม\\s*engagement', 'สรุป', '--',
            ]);
            // ตัดขอบเขตด้วย "สรุป" (หัวข้อ "สรุป/ข้อเสนอแนะ" ที่ตามมา) ด้วยเสมอ กันกรณีเอกสารไม่มี "--" คั่นระหว่าง section
            // (ถ้าไม่กันไว้ แนวโน้ม engagement จะกวาดเอาเนื้อหาทั้งหมดของ "สรุป/ข้อเสนอแนะ" ติดมาด้วย เพราะไม่มี keyword อื่นมาคั่น)
            const engagementText = this.extractLabeledSection(block, 'แนวโน้ม\\s*engagement', ['สรุป', '--']);

            // ดึงคำพูดในเครื่องหมายคำพูดทั้งหมดที่เจอ (รองรับได้ตั้งแต่ 1 คำพูดขึ้นไป)
            const positiveExamples = this.extractQuotedPhrases(positiveSectionText);
            const negativeExamples = this.extractQuotedPhrases(negativeSectionText);

            // หมายเหตุ/การตีความท้ายคำพูด (มีเฉพาะรูปแบบย่อบรรทัดเดียวที่ต่อด้วย – หลังปิดคำพูด)
            const positiveNoteMatch = positiveSectionText.match(/[”"]\s*[–—-]\s*(.+)/);
            const negativeNoteMatch = negativeSectionText.match(/[”"]\s*[–—-]\s*(.+)/);

            return {
                positive: posMatch ? parseInt(posMatch[1], 10) : 0,
                neutral: neuMatch ? parseInt(neuMatch[1], 10) : 0,
                negative: negMatch ? parseInt(negMatch[1], 10) : 0,
                engagementTrend: engagementText,
                // เก็บคำพูดแรกไว้ที่ positiveExample/negativeExample เพื่อ backward-compat กับโค้ดเดิมที่ใช้ field เดี่ยว
                positiveExample: positiveExamples[0] || '',
                positiveExamples,
                positiveExampleNote: positiveNoteMatch ? positiveNoteMatch[1].trim() : '',
                negativeExample: negativeExamples[0] || '',
                negativeExamples,
                negativeExampleNote: negativeNoteMatch ? negativeNoteMatch[1].trim() : '',
                recurringThemes: recurringSectionText,
                recurringThemesList: this.splitNumberedList(recurringSectionText),
            };
        },
        // ดึงข้อความของหัวข้อย่อยหนึ่งอัน (label) จนถึง keyword ถัดไปตัวแรกที่เจอใน endLabels (หรือจบ text)
        // ใช้ [\s\S] แทน "." เพื่อให้จับเนื้อหาที่ขึ้นบรรทัดใหม่ได้ด้วย (กรณีตัวอย่างคำพูดหลายบรรทัด)
        extractLabeledSection(text, label, endLabels) {
            const endPattern = endLabels.join('|');
            // อนุญาตให้มีเลขข้อนำหน้า keyword ได้ (เช่น "3. สรุป/ข้อเสนอแนะ") โดยไม่ถูกดึงติดไปกับเนื้อหาก่อนหน้า
            const re = new RegExp(`${label}[:：]?\\s*([\\s\\S]*?)(?=\\s*(?:\\d+[.、]\\s*)?(?:${endPattern})|$)`);
            const m = text.match(re);
            return m ? m[1].trim() : '';
        },
        // ดึงข้อความทุกคำพูดออกมาเป็น array — แยกทีละบรรทัด/บูลเล็ตก่อน แล้วค่อยหาเครื่องหมายคำพูด
        // "ตัวแรก" ถึง "ตัวสุดท้าย" ของแต่ละบรรทัด (ไม่ใช่จับคู่เปิด-ปิดสลับกันทั่วทั้งก้อนข้อความ)
        // เพราะถ้าในคำพูดมีเครื่องหมายคำพูดซ้อนอยู่ข้างใน (เช่น ใช้คำว่า "น่าจะ" กระทำความผิด...)
        // การจับคู่แบบสลับกันทั่วก้อนจะพังทันที ตัดคำพูดผิดจุด — แยกรายบรรทัดก่อนช่วยตัดปัญหานี้ได้
        extractQuotedPhrases(text) {
            if (!text) return [];

            const rawLines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
            const lines = rawLines.length > 0 ? rawLines : [text];

            const quotes = [];
            for (const line of lines) {
                // ตัด bullet marker ("* ", "- ", "1. ") ที่นำหน้าบรรทัดออกก่อน (ถ้ามี)
                const cleaned = line.replace(/^[ \t]*(?:\d+[.、]|[*•-])[ \t]+/, '');

                const quoteCharRe = /["“”]/g;
                const positions = [];
                let m;
                while ((m = quoteCharRe.exec(cleaned)) !== null) positions.push(m.index);
                if (positions.length < 2) continue; // ต้องมีอย่างน้อยเปิด-ปิด 1 คู่ถึงจะถือว่าเป็นคำพูด

                const first = positions[0];
                const last = positions[positions.length - 1];
                const quote = cleaned.slice(first + 1, last).trim();
                if (quote) quotes.push(quote);
            }

            return quotes;
        },
        // แยกลิสต์แบบมีเลขข้อ "1. ... 2. ... 3. ..." ออกเป็น array ทีละข้อ
        // ถ้าไม่มีเลขข้อเลย จะคืน array ที่มีข้อความทั้งก้อนเป็นสมาชิกเดียว
        splitNumberedList(text) {
            if (!text) return [];
            // รองรับทั้งลิสต์แบบเลขข้อ "1. " และแบบ bullet "* " "• " "- "
            // ใช้ ^ (multiline) ให้ตัดเฉพาะตอนตัวคั่นอยู่ต้นบรรทัดจริงๆ เท่านั้น กัน "-" ที่อยู่กลางประโยคปกติโดนตัดไปด้วย
            return text.split(/^[ \t]*(?:\d+[.、]|[*•-])[ \t]+/m).map((s) => s.trim()).filter(Boolean);
        },
        extractSection2(text) {
            const match = text.match(/##\s*2\)[\s\S]*?(?=##\s*3\)|$)/);
            return match ? match[0].trim() : "";
        },
        formatSummarize(text) {
            if (!text) return '';

            let html = text
                .replace(/^##\s?(.*)$/gm, '<h4 style="margin:12px 0 6px; font-size:1.1rem;"><strong>$1</strong></h4>')
                .replace(/^###\s?(.*)$/gm, '<h4 style="margin:8px 0 4px; font-size:1rem;">$1</h4>')
                .replace(/^\s*\*\s+\*\*(.*?)\*\*(.*)$/gm, '<li style="margin-left:40px;"><b>$1</b>$2</li>')
                .replace(/^\s*\*\s+(.*)$/gm, '<span style="margin-left:40px;">$1</span>')
                .replace(/^\s*\d+\.\s+(.*)$/gm, '<li style="margin-left:40px;">$1</li>')
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

            const blocks = html.split(/\n{2,}/);

            const processedBlocks = blocks.map(block => {
                const trimmed = block.trim();
                if (!trimmed) return '';

                const inner = trimmed.replace(/\n/g, '');
                return `<p style="margin:0 0 6px; line-height:1.5;">${inner}</p>`;
            });

            const result = processedBlocks.join('');

            return result;
        },
        toggle() {
            this.open = !this.open;
        },
        formatDateRange() {
            const start = new Date(this.filters.start);
            const end = new Date(this.filters.end);

            const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

            const diffTime = endDate - startDate;
            const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1;

            const format = (date) => {
                const d = date.getDate().toString().padStart(2, '0');
                const m = (date.getMonth() + 1).toString().padStart(2, '0');
                const y = date.getFullYear();
                return `${d}/${m}/${y}`;
            }

            if (diffDays <= 1) {
                return format(startDate);
            } else {
                return `${format(startDate)} - ${format(endDate)}`;
            }
        },
        engValue(p) {
            const direct = p.engagement_total || p.engagement || p.engage || p.total_engage;
            if (typeof direct === 'number') return direct;

            const likes = p.like_count || p.likes || p.reaction || 0;
            const comments = p.comment_count || p.comments || 0;
            const shares = p.share_count || p.shares || 0;
            const views = p.view_count || p.views || 0;
            return (likes || 0) + 2 * (comments || 0) + 3 * (shares || 0) + 0.1 * (views || 0);
        },
        readableTitle(p) {
            const text = p.title || p.message || p.text || p.content || "";
            const trimmed = String(text).replace(/\s+/g, " ").trim();
            return trimmed.length > 80 ? trimmed.slice(0, 80) + "…" : trimmed || "(ไม่มีเนื้อหา)";
        },
        sortByEngagement() {
            // not used currently
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
            this.analyzing = true;
            this.open = false;
            const bodyData = {
                posts: this.filteredPosts.slice(0, this.postLimit),
            };

            const config = {
                method: "post",
                url: "https://api2.cognizata.com/api/v2/userposts/summarize-timeline",
                data: bodyData,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            };
            try {
                const response = await this.axios(config);
                this.fullSummary = response.data.final_summary || "ไม่มีสรุปผล";
                this.analyzing = false;
                this.open = true;
            }
            catch (error) {
                this.analyzing = false;
                Swal.fire({
                    icon: 'error',
                    title: `เกิดข้อผิดพลาด`,
                    text: 'ไม่สามารถวิเคราะห์โพสต์ได้ กรุณาลองใหม่อีกครั้ง',
                });
            }
        },

        /**
         * Entry point ของปุ่ม Analysis (beta)
         * API นี้เป็นแบบ async job: ยิงครั้งแรกจะได้ job_id + status (pending/processing)
         * ต้อง poll ไปที่ /summarize-timeline/job?job_id=... จนกว่า status จะเป็น done
         */
        async summarizePostsV2() {
            // กันการกดซ้ำเด็ดขาด ไม่ว่า analyzing จะ re-render ทัน DOM หรือยัง (กัน double-click/double-trigger)
            if (this.analyzing) return;

            this.analyzing = true;
            this.open = false;
            this.analyzingLabel = "กำลังเริ่มวิเคราะห์...";
            // เพิ่ม token รอบใหม่ทุกครั้งที่กดปุ่ม กัน race condition ถ้ามี poll รอบเก่าค้างอยู่
            this.pollToken += 1;
            const myToken = this.pollToken;

            const f = this.filters || {};

            const params = {
                sentiment: f.sentiment ?? "1,0,-1",
                start: f.start,
                end: f.end,
                limit: f.limit ?? 10,
                page: f.page ?? 1,
                account: f.account,
                keyword: f.keyword,
                sort_by: f.sort_by,
                source: f.source,
                exclude: f.exclude,
            };

            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/userposts/summarize-timeline",
                params,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json"
                },
            };

            try {
                const response = await this.axios(config);
                const data = response.data;

                console.log("[Analysis] first response:", data, "| myToken:", myToken, "| currentToken:", this.pollToken);

                if (myToken !== this.pollToken) {
                    console.warn("[Analysis] dropped: token mismatch (กดปุ่มซ้ำระหว่างรอ)");
                    return; // มีการกดปุ่มใหม่ซ้อนเข้ามาแล้ว ทิ้งรอบนี้
                }

                if (!data || data.ok === false) {
                    throw new Error(data?.message || "ไม่สามารถเริ่มงานวิเคราะห์ได้");
                }

                // ✅ กรณีหลัก: ได้ job_id กลับมาเป็น pending/processing -> เริ่ม poll
                if (data.job_id && data.status && data.status !== "done") {
                    console.log("[Analysis] entering pollSummarizeJob, job_id:", data.job_id);
                    this.fullSummary = null;
                    this.analyzingLabel = "กำลังประมวลผล...";
                    await this.pollSummarizeJob(data.job_id, myToken);
                    console.log("[Analysis] pollSummarizeJob finished/returned");
                    return;
                }

                // กรณี backend ตอบผลลัพธ์มาทันที (sync) เผื่อพฤติกรรมเปลี่ยนในอนาคต
                if (data.status === "done" && data.result) {
                    this.applySummaryResult(data.result, myToken);
                    return;
                }
                if (data.final_summary) {
                    this.fullSummary = data.final_summary;
                    this.analyzing = false;
                    this.open = true;
                    return;
                }

                // fallback: ไม่เข้าเงื่อนไขไหนเลย แสดงข้อความแจ้งเตือนแทนการโชว์ JSON ดิบ
                this.analyzing = false;
                this.fullSummary = "ไม่สามารถอ่านผลลัพธ์จาก API ได้ (รูปแบบข้อมูลไม่ตรงกับที่คาดไว้)";
                this.open = true;

            } catch (error) {
                if (myToken !== this.pollToken) return;
                this.analyzing = false;
                console.error("summarizePostsV2 error:", error);

                let msg = "ไม่สามารถวิเคราะห์โพสต์ได้ กรุณาลองใหม่อีกครั้ง";
                if (error.response?.data?.message) {
                    msg = error.response.data.message;
                } else if (typeof error.response?.data === "string") {
                    msg = error.response.data;
                } else if (error.message) {
                    msg = error.message;
                }

                Swal.fire({
                    icon: "error",
                    title: "เกิดข้อผิดพลาด",
                    text: msg
                });
            }
        },

        /**
         * วน poll ไปที่ job endpoint จนกว่า status จะเป็น done (หรือ error/timeout)
         * ไม่ยิงถี่: เว้นช่วง POLL_INTERVAL_MS ระหว่างแต่ละครั้งเสมอ
         */
        async pollSummarizeJob(jobId, myToken) {
            const POLL_INTERVAL_MS = 15000; // 15 วิ/ครั้ง
            const MAX_ATTEMPTS = 90;       // ~7.5 นาที สูงสุด

            console.log("[Analysis] pollSummarizeJob started, jobId:", jobId);

            for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
                console.log("[Analysis] poll loop attempt:", attempt);
                // ถ้ามีการกดปุ่มใหม่ระหว่างรอ ให้หยุด poll รอบนี้ทันที
                if (myToken !== this.pollToken) {
                    console.warn("[Analysis] poll loop stopped: token mismatch");
                    return;
                }

                try {
                    const jobConfig = {
                        method: "get",
                        url: "https://api2.cognizata.com/api/v2/userposts/summarize-timeline/job",
                        params: { job_id: jobId },
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                            "Content-Type": "application/json"
                        },
                    };

                    console.log("[Analysis] calling job status endpoint...");
                    const jobResponse = await this.axios(jobConfig);
                    const jobData = jobResponse?.data;
                    console.log("[Analysis] job status response:", jobData);

                    if (myToken !== this.pollToken) return;

                    if (!jobData || jobData.ok === false) {
                        throw new Error(jobData?.message || "ไม่สามารถตรวจสอบสถานะงานได้");
                    }

                    if (jobData.status === "done") {
                        this.applySummaryResult(jobData.result, myToken);
                        return;
                    }

                    if (jobData.status === "error" || jobData.status === "failed") {
                        throw new Error(jobData.message || "การวิเคราะห์ล้มเหลว");
                    }

                    // status ยังเป็น pending/processing -> วนต่อ
                    this.analyzingLabel = jobData.status === "processing"
                        ? "กำลังประมวลผล..."
                        : "กำลังรอคิวประมวลผล...";

                } catch (err) {
                    if (myToken !== this.pollToken) return;
                    this.analyzing = false;
                    console.error("pollSummarizeJob error:", err);
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด",
                        text: err.message || "ไม่สามารถตรวจสอบสถานะการวิเคราะห์ได้",
                    });
                    return;
                }

                // รอก่อนยิงรอบถัดไป (ไม่รอก่อนยิงรอบแรก เพื่อให้เห็น request ทันทีหลัง summarize-timeline ตอบกลับ)
                await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));
            }

            if (myToken !== this.pollToken) return;
            this.analyzing = false;
            Swal.fire({
                icon: "warning",
                title: "ใช้เวลานานเกินไป",
                text: "การวิเคราะห์ใช้เวลานานกว่าปกติ กรุณาลองใหม่ภายหลัง",
            });
        },

        // ดึงข้อความสรุปจาก result ของ job ที่ done แล้ว
        applySummaryResult(result, myToken) {
            if (myToken !== undefined && myToken !== this.pollToken) return;

            if (!result) {
                this.fullSummary = "ไม่มีข้อมูลผลลัพธ์";
            } else if (result.final_report) {
                this.fullSummary = result.final_report;
            } else if (result.final_summary) {
                this.fullSummary = result.final_summary;
            } else if (result.summary) {
                this.fullSummary = result.summary;
            } else if (result.summary_text) {
                this.fullSummary = result.summary_text;
            } else {
                this.fullSummary = JSON.stringify(result, null, 2);
            }

            this.analyzing = false;
            this.open = true;
        },

    },
    mounted() {
       this.username = localStorage.getItem("username");
    },
    watch: {
        posts: {
            handler(newVal, oldVal) {
                this.fullSummary = null;
                this.open = false;
            },
        }
    }
};
</script>

<style scoped>
.summary-title {
    font-size: 16px;
    font-weight: bold;
}

.card-header-scroll {
  max-height: 120px;
  overflow-y: auto;
  padding: 8px 12px;
}

.card-body-scroll {
  max-height: 500px; 
  overflow-y: auto;
}

.box-summarize {
    border: 0px;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
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
    transition: color .15s ease;
}

.latest-summary:hover {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
  color: #17a2b891;
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
  );
  background-size: 400%;
  z-index: -1;
  filter: blur(3px);
  opacity: 0;
  border-radius: 12px;
  transition: opacity 0.3s ease-in-out;
  animation: glowing 20s linear infinite;
}

.analysis-button.is-glowing::before {
  opacity: 1;
}

.analysis-button.is-glowing .spark-icon {
  animation: blinkAnim 1s infinite ease-in-out;
}

@keyframes glowing {
  0%   { background-position: 0 0; }
  50%  { background-position: 400% 0; }
  100% { background-position: 0 0; }
}

@keyframes blinkAnim {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}
</style>