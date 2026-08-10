<template>
  <div class="text-right">
    <b-button
      variant="outline-info"
      class="ml-2"
      :disabled="disabled || !canExport || exporting"
      pill
      size="sm"
      @click="exportExcel"
      v-b-tooltip.hover.top="exporting ? 'กำลังเตรียมไฟล์...' : 'ดาวน์โหลด Excel'"
    >
      <i class="fa fa-download mr-1"></i>
      <span v-if="!exporting">Export</span>
      <span v-else>กำลังดึงข้อมูล…</span>
    </b-button>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'ExportExcelButton',
  props: {
    posts: { type: Array, required: true, default: () => [] },
    filters: { type: Object, required: true, default: () => ({}) },
    disabled: { type: Boolean, default: false },
    useToast: { type: Boolean, default: true },
    inlineComments: {
      type: String,
      default: 'none',
      validator: v => ['none', 'json', 'text'].includes(v)
    },
    commentsLimit: { type: Number, default: 10 },

    fullExport: { type: Boolean, default: true },
    apiBase: { type: String, default: '' },
    count: { type: Number, default: 0 },

    /** ถ้า true (ดีฟอลต์) โหมด posts จะยิงครั้งเดียวด้วย limit=count */
    preferSingleShot: { type: Boolean, default: true },

    /** ใช้กับโหมด posts "เท่านั้น" เมื่อ preferSingleShot=false */
    apiPageHardLimit: { type: Number, default: 0 },

    /** โหมด daily: ดึงวันละครั้งเดียวด้วย limit=dailyCap */
    dailyCap: { type: Number, default: 2000 }
  },

  data() {
    return { exporting: false };
  },

  computed: {
    isDaily() {
      return (this.filters?.view_mode || '') === 'daily';
    },
    canExport() {
      if (this.fullExport && this.apiBase && this.count > 0) return true;
      if (!Array.isArray(this.posts) || this.posts.length === 0) return false;
      if (!this.isDaily) return this.posts.length > 0;
      return this.posts.some(d => Array.isArray(d?.items) && d.items.length > 0);
    }
  },

  methods: {
    // Shared auth header block for every axios.get below — one place to
    // update if the token key or header shape ever changes.
    authHeaders() {
      return {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      };
    },
    clampExcelCell(str, addNote = true) {
      const MAX = 32767;
      if (str == null) return '';
      const s = String(str);
      if (s.length <= MAX) return s;
      const head = s.slice(0, MAX - (addNote ? 12 : 0));
      return addNote ? head + ' [TRUNCATED]' : head;
    },
    toast(msg, variant = 'default', delay = 2000) {
      if (!this.useToast || !this.$bvToast) return;
      this.$bvToast.toast(msg, { variant, autoHideDelay: delay });
    },
    getSentimentLabel(v) {
      const map = { '1': 'Positive', '0': 'Neutral', '-1': 'Negative' };
      return map[String(v)] || String(v ?? '');
    },

    buildKeywordParam(filters) {
      const raw = (filters?.keywordInput || '').trim();
      if (!raw) return '';
      return raw
        .split(',')
        .map(g => g.trim().split(/[+\s]+/).filter(Boolean).join('+'))
        .join(',');
    },
    sourceParam(list) {
      const arr = Array.isArray(list) ? list : (list == null ? [] : [list]);
      if (arr.length === 0 || arr.includes(null)) return undefined;
      return arr.join(',');
    },
    getDaysInclusive(startYMD, endYMD) {
      const days = [];
      let cur = moment(startYMD, 'YYYY-MM-DD');
      const end = moment(endYMD, 'YYYY-MM-DD');
      while (cur.isSameOrBefore(end, 'day')) {
        days.push(cur.clone().format('YYYY-MM-DD'));
        cur = cur.add(1, 'day');
      }
      return days;
    },
    baseParams() {
      const f = this.filters || {};
      const start = f.startLocal || ((f?.valueDate?.[0] || moment().format('YYYY-MM-DD')) + 'T00:00:00');
      const end   = f.endLocal   || ((f?.valueDate?.[1] || moment().format('YYYY-MM-DD')) + 'T23:59:59');
      const p = {
        sentiment: Array.isArray(f.sentiment) ? f.sentiment.join(',') : f.sentiment,
        keyword: this.buildKeywordParam(f),
        exclude: this.buildExcludeKeywordParam(f),
        start, end,
        source: this.sourceParam(f.source),
        source_news: f.source_news === 'all' ? undefined : f.source_news,
        sort_by: f.sort_by === 'recent' ? undefined : f.sort_by
      };
      if (Array.isArray(f?.accounts) && f.accounts.length) p.account = f.accounts;
      if (Array.isArray(f?.hashtags) && f.hashtags.length) p.hashtags = f.hashtags;
      Object.keys(p).forEach(k => (p[k] == null || p[k] === '') && delete p[k]);
      return p;
    },
    buildExcludeKeywordParam(filters) {
      const raw = (filters?.excludeKeywordInput || '').trim();
      if (!raw) return '';
      return raw
        .split(',')
        .map(g => g.trim().split(/[+\s]+/).filter(Boolean).join('+'))
        .join(',');
    },

    // ----- posts: single-shot with limit=count -----
    async fetchAllOnceByLimitCount() {
      const params = this.baseParams();
      params.page = 1;
      params.limit = this.count > 0 ? this.count : 2000;
      const { data } = await axios.get(this.apiBase, { params, headers: this.authHeaders() });
      return data?.data || [];
    },

    // ----- posts: paging fallback -----
    async fetchAllOnceByPaging() {
      const pageSize = this.apiPageHardLimit > 0 ? this.apiPageHardLimit : 2000;
      const total = this.count || 0;
      const pages = Math.max(1, Math.ceil(total / pageSize));
      const paramsBase = this.baseParams();
      const all = [];
      for (let page = 1; page <= pages; page++) {
        const params = { ...paramsBase, page, limit: pageSize };
        const { data } = await axios.get(this.apiBase, { params, headers: this.authHeaders() });
        const chunk = data?.data || [];
        all.push(...chunk);
        if (chunk.length < pageSize) break;
      }
      return all;
    },

    async fetchAllPostsOnce() {
      if (this.preferSingleShot && this.count > 0) {
        return this.fetchAllOnceByLimitCount();
      }
      return this.fetchAllOnceByPaging();
    },

    // ----- daily: one-shot / day with limit=dailyCap -----
    async fetchAllPostsDaily() {
      const f = this.filters || {};
      const startIso = f.startLocal || ((f?.valueDate?.[0] || moment().format('YYYY-MM-DD')) + 'T00:00:00');
      const endIso   = f.endLocal   || ((f?.valueDate?.[1] || moment().format('YYYY-MM-DD')) + 'T23:59:59');
      const startYMD = startIso.slice(0, 10);
      const endYMD   = endIso.slice(0, 10);
      const days = this.getDaysInclusive(startYMD, endYMD);

      const cap = Number(this.dailyCap) > 0 ? Number(this.dailyCap) : 2000;
      const all = [];
      for (const ymd of days) {
        const params = {
          ...this.baseParams(),
          page: 1,
          limit: cap,
          start: `${ymd}T00:00:00`,
          end: `${ymd}T23:59:59`
        };
        const { data } = await axios.get(this.apiBase, { params, headers: this.authHeaders() });
        const rows = data?.data || [];
        rows.forEach(r => (r.__export_date = ymd));
        all.push(...rows);
      }
      return all;
    },

    // ----- inline comments (with clamp) -----
    buildInlineCommentsJSON(post, limit) {
      const arr = (post?.comments || [])
        .slice(0, Math.max(0, limit))
        .map(c => ({
          username: this.clampExcelCell(c?.username || ''),
          content:  this.clampExcelCell(c?.content  || ''),
          time:     this.clampExcelCell(c?.time     || ''),
          url:      this.clampExcelCell(c?.url      || '')
        }));
      try {
        return this.clampExcelCell(JSON.stringify(arr));
      } catch { return ''; }
    },
    buildInlineCommentsText(post, limit) {
      const list = (post?.comments || []).slice(0, Math.max(0, limit));
      if (!list.length) return '';
      const s = list.map((c, i) => {
        const idx = i + 1;
        const u = this.clampExcelCell(c?.username || '—', false);
        const t = this.clampExcelCell(c?.time || '', false);
        const content = this.clampExcelCell((c?.content ? String(c.content).replace(/\s+/g, ' ').trim() : ''), false);
        const url = this.clampExcelCell(c?.url || '', false);
        return `[${idx}] ${u}${t ? ` (${t})` : ''} : ${content}${url ? ` — ${url}` : ''}`;
      }).join('\n');
      return this.clampExcelCell(s);
    },

    // ----- flatten posts/comments (with clamp) -----
    flattenPosts(all) {
      const rows = [];
      const toRow = (p, dateOverride = null) => {
        const base = {
          date:           this.clampExcelCell((dateOverride || p?.date || '').toString()),
          source:         this.clampExcelCell(p?.source || ''),
          account_name:   this.clampExcelCell(p?.account_name || ''),
          full_text:      this.clampExcelCell(p?.full_text || ''),
          url_post:       this.clampExcelCell(p?.url_post || p?.uid || ''),
          sentiment:      this.clampExcelCell(this.getSentimentLabel(p?.sentiment)),
          engagement:     typeof p?.engagement === 'number' ? p.engagement : '',
          likes_count:    typeof p?.likes_count === 'number' ? p.likes_count : '',
          retweets_count: typeof p?.retweets_count === 'number' ? p.retweets_count : '',
          shares_count:   typeof p?.shares_count === 'number' ? p.shares_count : '',
          views_count:    typeof p?.views_count === 'number' ? p.views_count : '',
          comments_count: typeof p?.comments_count === 'number' ? p.comments_count : (Array.isArray(p?.comments) ? p.comments.length : ''),
          hashtags:       this.clampExcelCell(Array.isArray(p?.hashtags) ? p.hashtags.join(' ') : ''),
          photos:         this.clampExcelCell(Array.isArray(p?.photos) ? p.photos.join(' | ') : ''),
          profile_image:  this.clampExcelCell(p?.profile_image || ''),
          uid:            this.clampExcelCell(p?.uid || '')
        };
        if (this.inlineComments === 'json') base.comments = this.buildInlineCommentsJSON(p, this.commentsLimit);
        else if (this.inlineComments === 'text') base.comments = this.buildInlineCommentsText(p, this.commentsLimit);
        Object.keys(base).forEach(k => { if (typeof base[k] === 'string') base[k] = this.clampExcelCell(base[k]); });
        return base;
      };

      if (Array.isArray(all) && all.length && all[0]?.items && all[0]?.date) {
        all.forEach(day => (day?.items || []).forEach(p => rows.push(toRow(p, day?.date))));
      } else {
        (all || []).forEach(p => rows.push(toRow(p, p?.__export_date || null)));
      }
      return rows;
    },
    flattenComments(all) {
      const rows = [];
      const pushRow = (post, c, dateOverride = null) => rows.push({
        account_name:     this.clampExcelCell(post?.account_name || ''),
        full_text:        this.clampExcelCell(post?.full_text || ''),
        post_url:         this.clampExcelCell(post?.url_post || post?.uid || ''),
        post_date:        this.clampExcelCell((dateOverride || post?.date || '').toString()),
        source:           this.clampExcelCell(post?.source || ''),
        comment_username: this.clampExcelCell(c?.username || ''),
        comment_content:  this.clampExcelCell(c?.content || ''),
        comment_time:     this.clampExcelCell(c?.time || ''),
        comment_url:      this.clampExcelCell(c?.url || '')
      });

      if (Array.isArray(all) && all.length && all[0]?.items && all[0]?.date) {
        all.forEach(day => (day?.items || []).forEach(p => (p?.comments || []).forEach(c => pushRow(p, c, day?.date))));
      } else {
        (all || []).forEach(p => (p?.comments || []).forEach(c => pushRow(p, c, p?.__export_date || null)));
      }
      return rows;
    },

    // ----- file name & sheet widths -----
    buildFilename() {
      const start = (this.filters?.startLocal || '').slice(0, 10);
      const end = (this.filters?.endLocal || '').slice(0, 10);
      const kwRaw = (this.filters?.keywordInput || '').trim();
      const kw = kwRaw.replace(/[^\p{L}\p{M}\p{N}\s,._-]+/gu, '');
      const kpart = kw ? `_${kw.substring(0, 40)}` : '';
      const mode = this.isDaily ? 'daily' : 'posts';
      const inline = this.inlineComments !== 'none' ? `_with-comments-${this.inlineComments}` : '';
      const newsMap = { internal: '_internal', external: '_external' };
      const newsPart = newsMap[this.filters?.source_news] || '';
      return `timeline_${mode}_${start}_to_${end}${kpart}${newsPart}${inline}.xlsx`;
    },
    autosizePostsSheet(ws) {
      const hasInline = this.inlineComments !== 'none';
      ws['!cols'] = [
        { wch: 20 }, // date
        { wch: 12 }, // source
        { wch: 24 }, // account_name
        { wch: 80 }, // full_text
        { wch: 50 }, // url_post
        { wch: 10 }, // sentiment
        { wch: 12 }, // engagement
        { wch: 10 }, // likes_count
        { wch: 12 }, // retweets_count
        { wch: 12 }, // shares_count
        { wch: 12 }, // views_count
        { wch: 14 }, // comments_count
        { wch: 40 }, // hashtags
        { wch: 30 }, // photos
        { wch: 45 }, // profile_image
        { wch: 45 }, // uid
        ...(hasInline ? [{ wch: this.inlineComments === 'json' ? 60 : 90 }] : [])
      ];
    },
    autosizeCommentsSheet(ws) {
      ws['!cols'] = [
        { wch: 24 }, { wch: 80 }, { wch: 50 }, { wch: 20 }, { wch: 12 },
        { wch: 28 }, { wch: 80 }, { wch: 22 }, { wch: 50 }
      ];
    },

    // ----- main export -----
    async exportExcel() {
      try {
        this.exporting = true;

        let allData;
        if (this.fullExport && this.apiBase) {
          if (this.isDaily) {
            allData = await this.fetchAllPostsDaily();
          } else {
            allData = await this.fetchAllPostsOnce();
          }
        } else {
          allData = this.posts;
        }

        const postsRows = this.flattenPosts(allData);
        const commentsRows = this.flattenComments(allData);
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
        console.error('Export Excel error:', err);
        this.toast('เกิดข้อผิดพลาดระหว่างส่งออกไฟล์', 'danger', 3000);
        this.$emit('export-error', err);
      } finally {
        this.exporting = false;
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