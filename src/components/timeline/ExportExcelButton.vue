<template>
    <div class="text-right">
        <b-button variant="outline-info" class="ml-2" :disabled="disabled || !hasData" pill size="sm"
            @click="exportExcel" v-b-tooltip.hover.top="'download excel'">
            <i class="fa fa-download mr-1"></i>
            Export
        </b-button>
    </div>
</template>

<script>
import * as XLSX from 'xlsx';

export default {
    name: 'ExportExcelButton',
    props: {
        /**
         * โครงข้อมูล:
         * - โหมด posts: Array<Post>
         * - โหมด daily: Array<{ date: string, items: Post[] }>
         */
        posts: { type: Array, required: true, default: () => [] },

        /**
         * ฟิลเตอร์ปัจจุบัน (เอาไว้ดู view_mode และตั้งชื่อไฟล์)
         */
        filters: { type: Object, required: true, default: () => ({}) },

        /**
         * ปิดปุ่มตอนกำลังโหลด
         */
        disabled: { type: Boolean, default: false },

        /**
         * แสดง toast ผ่าน $bvToast
         */
        useToast: { type: Boolean, default: true },

        /**
         * ใส่ comments ลงในชีท Posts แบบ inline:
         * - "json": เก็บเป็น JSON string
         * - "text": แปลงเป็นข้อความอ่านง่าย
         * - "none": ไม่ใส่ (ค่าเริ่มต้น)
         */
        inlineComments: {
            type: String,
            default: 'none',
            validator: v => ['none', 'json', 'text'].includes(v)
        },

        /**
         * จำกัดจำนวนคอมเมนต์ที่จะใส่ในคอลัมน์ inline (เฉพาะโหมด "text" และ "json")
         * หาก > จำนวนจริงจะใส่เท่าที่มี
         */
        commentsLimit: {
            type: Number,
            default: 10
        }
    },

    computed: {
        isDaily() {
            return (this.filters?.view_mode || '') === 'daily';
        },
        hasData() {
            if (!Array.isArray(this.posts) || this.posts.length === 0) return false;
            if (!this.isDaily) return this.posts.length > 0;
            return this.posts.some(d => Array.isArray(d?.items) && d.items.length > 0);
        }
    },

    methods: {
        toast(msg, variant = 'default', delay = 2000) {
            if (!this.useToast || !this.$bvToast) return;
            this.$bvToast.toast(msg, { variant, autoHideDelay: delay });
        },

        getSentimentLabel(v) {
            const map = { '1': 'Positive', '0': 'Neutral', '-1': 'Negative' };
            return map[String(v)] || String(v ?? '');
        },

        // ---------- Inline comments helpers ----------
        buildInlineCommentsJSON(post, limit, dateOverride = null) {
            const arr = (post?.comments || []).slice(0, Math.max(0, limit)).map(c => ({
                username: c?.username || '',
                content: c?.content || '',
                time: c?.time || '',
                url: c?.url || '',
                // photo: c?.photo || ''
            }));
            try {
                return JSON.stringify(arr);
            } catch {
                // ป้องกัน error กรณีมีวงกลมอ้างอิง
                return '';
            }
        },

        buildInlineCommentsText(post, limit, dateOverride = null) {
            const list = (post?.comments || []).slice(0, Math.max(0, limit));
            if (!list.length) return '';
            // รูปแบบ: [1] username (time) : content — url
            return list
                .map((c, i) => {
                    const idx = i + 1;
                    const u = c?.username ? String(c.username) : '—';
                    const t = c?.time ? String(c.time) : '';
                    const content = c?.content ? String(c.content).replace(/\s+/g, ' ').trim() : '';
                    const url = c?.url || '';
                    return `[${idx}] ${u}${t ? ` (${t})` : ''} : ${content}${url ? ` — ${url}` : ''}`;
                })
                .join('\n');
        },

        // ---------- Flatten Posts sheet ----------
        flattenPosts() {
            const rows = [];
            const toRow = (p, dateOverride = null) => {
                const base = {
                    // _id: p?._id || '',
                    date: (dateOverride || p?.date || '').toString(),
                    source: p?.source || '',
                    account_name: p?.account_name || '',
                    full_text: p?.full_text || '',
                    url_post: p?.url_post || p?.uid || '',
                    sentiment: this.getSentimentLabel(p?.sentiment),
                    engagement: typeof p?.engagement === 'number' ? p.engagement : '',
                    likes_count: typeof p?.likes_count === 'number' ? p.likes_count : '',
                    retweets_count: typeof p?.retweets_count === 'number' ? p.retweets_count : '',
                    comments_count: typeof p?.comments_count === 'number' ? p.comments_count : (Array.isArray(p?.comments) ? p.comments.length : ''),
                    hashtags: Array.isArray(p?.hashtags) ? p.hashtags.join(' ') : '',
                    photos: Array.isArray(p?.photos) ? p.photos.join(' | ') : '',
                    profile_image: p?.profile_image || '',
                    uid: p?.uid || ''
                };

                // ใส่คอลัมน์ comments_inline ตามโหมด
                if (this.inlineComments === 'json') {
                    base.comments = this.buildInlineCommentsJSON(p, this.commentsLimit, dateOverride);
                } else if (this.inlineComments === 'text') {
                    base.comments = this.buildInlineCommentsText(p, this.commentsLimit, dateOverride);
                }

                return base;
            };

            if (this.isDaily) {
                (this.posts || []).forEach(day => {
                    (day?.items || []).forEach(p => rows.push(toRow(p, day?.date)));
                });
            } else {
                (this.posts || []).forEach(p => rows.push(toRow(p)));
            }

            return rows;
        },

        // ---------- Flatten Comments sheet ----------
        flattenComments() {
            const rows = [];
            const pushRow = (post, c, dateOverride = null) => rows.push({
                account_name: post?.account_name || '',
                full_text: post?.full_text || '',
                post_url: post?.url_post || post?.uid || '',
                post_date: (dateOverride || post?.date || '').toString(),
                source: post?.source || '',
                comment_username: c?.username || '',
                comment_content: c?.content || '',
                comment_time: c?.time || '',
                comment_url: c?.url || '',
                //  comment_photo: c?.photo || ''
            });

            if (this.isDaily) {
                (this.posts || []).forEach(day => {
                    (day?.items || []).forEach(p => (p?.comments || []).forEach(c => pushRow(p, c, day?.date)));
                });
            } else {
                (this.posts || []).forEach(p => (p?.comments || []).forEach(c => pushRow(p, c)));
            }

            return rows;
        },

        // ---------- File name ----------
        buildFilename() {
            const start = (this.filters?.startLocal || '').slice(0, 10);
            const end = (this.filters?.endLocal || '').slice(0, 10);
            const kwRaw = (this.filters?.keywordInput || '').trim();

            // ✅ อนุญาตอักขระผสมด้วย \p{M} เพื่อให้วรรณยุกต์/สระไทยไม่หาย
            const kw = kwRaw.replace(/[^\p{L}\p{M}\p{N}\s,._-]+/gu, '');

            const kpart = kw ? `_${kw.substring(0, 40)}` : '';
            const mode = this.isDaily ? 'daily' : 'posts';
            const inline = this.inlineComments !== 'none' ? `_with-comments-${this.inlineComments}` : '';
            return `timeline_${mode}_${start}_to_${end}${kpart}.xlsx`;
        },

        // ---------- Column widths ----------
        autosizePostsSheet(ws) {
            const hasInline = this.inlineComments !== 'none';
            ws['!cols'] = [

                { wch: 20 },  // date
                { wch: 12 },  // source
                { wch: 24 },  // account_name
                { wch: 80 },  // full_text
                { wch: 50 },  // url_post

                { wch: 10 },  // sentiment
                { wch: 12 },  // engagement
                { wch: 10 },  // likes_count
                { wch: 12 },  // retweets_count
                { wch: 14 },  // comments_count
                { wch: 40 },  // hashtags
                { wch: 30 },  // photos
                { wch: 45 },  // profile_image
                { wch: 45 },  // uid
                ...(hasInline ? [{ wch: this.inlineComments === 'json' ? 60 : 90 }] : []) // comments_inline
            ];
        },

        autosizeCommentsSheet(ws) {
            ws['!cols'] = [
                { wch: 24 }, // account_name
                { wch: 24 }, // post_id
                { wch: 50 }, // post_url
                { wch: 20 }, // post_date
                { wch: 12 }, // source

                { wch: 28 }, // comment_username
                { wch: 80 }, // comment_content
                { wch: 22 }, // comment_time
                { wch: 50 }, // comment_url
                { wch: 40 }, // comment_photo
            ];
        },

        // ---------- Main export ----------
        exportExcel() {
            try {
                const postsRows = this.flattenPosts();
                const commentsRows = this.flattenComments();

                if ((!postsRows || postsRows.length === 0) && (!commentsRows || commentsRows.length === 0)) {
                    this.toast('ยังไม่มีข้อมูลให้ส่งออก', 'warning');
                    return;
                }

                const wb = XLSX.utils.book_new();

                if (postsRows && postsRows.length) {
                    const wsPosts = XLSX.utils.json_to_sheet(postsRows, { skipHeader: false });
                    this.autosizePostsSheet(wsPosts);
                    XLSX.utils.book_append_sheet(wb, wsPosts, 'Posts');
                }

                if (commentsRows && commentsRows.length) {
                    const wsComments = XLSX.utils.json_to_sheet(commentsRows, { skipHeader: false });
                    this.autosizeCommentsSheet(wsComments);
                    XLSX.utils.book_append_sheet(wb, wsComments, 'Comments');
                }

                const filename = this.buildFilename();
                XLSX.writeFile(wb, filename);

                this.toast('ส่งออกไฟล์สำเร็จ', 'success');
                this.$emit('exported', {
                    filename,
                    postsCount: postsRows?.length || 0,
                    commentsCount: commentsRows?.length || 0
                });
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Export Excel error:', err);
                this.toast('เกิดข้อผิดพลาดระหว่างส่งออกไฟล์', 'danger', 3000);
                this.$emit('export-error', err);
            }
        }
    }
};
</script>
<style scoped>
@media only screen and (min-width: 0px) and (max-width: 800px) {
    #overflow-page>div:nth-child(2)>div>div.text-right.mt-md-0>button {
        zoom: 80%;
    }
}
</style>