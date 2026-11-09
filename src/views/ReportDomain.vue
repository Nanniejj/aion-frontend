<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
    <div id="content" class="pb-5">
      <!-- ===== ส่วนหัวหน้า ===== -->
      <div class="page-head mx-0 mx-lg-5">
        <div class="d-flex align-items-center">
          <button class="btn-back" title="กลับหน้าหัวเรื่อง" @click="$router.push({ name: 'Domain' })">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div class="ml-3">
            <div class="page-title">รายงานสรุปตามหัวเรื่อง</div>
            <div class="page-sub">ผลรวมการตรวจสอบกระแสสังคมรายมิติ · Domain Report</div>
          </div>
        </div>
        <div v-if="report && !loading" class="export-group">
          <span class="export-label">Export</span>
          <b-button class="btn-export word" :disabled="!!exporting" @click="exportWord">
            <span class="ex-icon"><b-spinner v-if="exporting === 'word'" small class="ex-spin" /><i v-else class="fas fa-file-word"></i></span>Word
          </b-button>
          <b-button class="btn-export excel" :disabled="!!exporting" @click="exportExcel">
            <span class="ex-icon"><b-spinner v-if="exporting === 'excel'" small class="ex-spin" /><i v-else class="fas fa-file-excel"></i></span>Excel
          </b-button>
          <b-button class="btn-export pdf" :disabled="!!exporting" @click="exportPdf">
            <span class="ex-icon"><b-spinner v-if="exporting === 'pdf'" small class="ex-spin" /><i v-else class="fas fa-file-pdf"></i></span>PDF
          </b-button>
        </div>
      </div>

      <!-- ===== การ์ดเลือกเงื่อนไข ===== -->
      <div class="filter-card mx-0 mx-lg-5">
        <b-row>
          <b-col cols="12" lg="4" class="mb-3 mb-lg-0">
            <label class="filter-label"><i class="far fa-calendar-alt"></i> ช่วงวันที่</label>
            <date-picker
              v-model="valueDate"
              type="date"
              range
              placeholder="เลือกช่วงเวลา"
              value-type="format"
              format="YYYY-MM-DD"
              :clearable="false"
              :disabled-date="(date) => date > new Date()"
              class="w-100"
            />
            <div class="preset-row">
              <span
                v-for="p in presets"
                :key="p.key"
                class="preset-chip"
                :class="{ active: activePreset === p.key }"
                @click="applyPreset(p)"
              >{{ p.label }}</span>
            </div>
          </b-col>
          <b-col cols="12" lg="6" class="mb-3 mb-lg-0">
            <label class="filter-label d-flex align-items-center">
              <span><i class="fas fa-layer-group"></i> หัวเรื่อง (Domain)</span>
              <span class="count-badge ml-2">{{ selectedDomains.length }} / {{ domainOptions.length }}</span>
              <span class="ml-auto">
                <a href="#" class="link-action" @click.prevent="selectAll">เลือกทั้งหมด</a>
                <span class="text-muted mx-1">|</span>
                <a href="#" class="link-action text-danger" @click.prevent="selectedDomains = []">ล้าง</a>
              </span>
            </label>
            <v-select
              multiple
              class="domain-select"
              :options="domainOptions"
              label="name"
              :reduce="(d) => d.id"
              v-model="selectedDomains"
              :loading="loadingDomains"
              :close-on-select="false"
              placeholder="พิมพ์หรือเลือกหัวเรื่อง"
            />
          </b-col>
          <b-col cols="12" lg="2" class="d-flex align-items-end">
            <button
              class="btn-run w-100"
              :disabled="loading || !selectedDomains.length || !hasDate"
              @click="fetchReport"
            >
              <!-- <b-spinner v-if="loading" small class="mr-1" /><i v-else class="fas fa-chart-bar mr-1"></i> -->
              แสดงรายงาน
            </button>
          </b-col>
        </b-row>
      </div>

      <!-- ===== พื้นที่แสดงรายงาน ===== -->
      <div class="preview-area mx-0 mx-lg-5">
        <div v-if="loading" class="state-box">
          <b-spinner variant="warning" class="state-spin" />
          <div class="state-title mt-3">กำลังประมวลผลรายงาน...</div>
        </div>
        <div v-else-if="errorMsg" class="state-box">
          <div class="state-icon err"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="state-title">{{ errorMsg }}</div>
          <button class="btn-run mt-3 px-4" @click="fetchReport">ลองใหม่</button>
        </div>
        <div v-else-if="!report" class="state-box">
          <div class="state-icon"><i class="far fa-file-alt"></i></div>
          <div class="state-title">ยังไม่มีรายงาน</div>
          <div class="state-sub">เลือกช่วงวันที่และหัวเรื่องด้านบน แล้วกด “แสดงรายงาน”</div>
        </div>

      <!-- ===== ตัวรายงาน (ใช้ capture เป็น PDF / Word) ===== -->
      <div v-if="report && !loading" class="report-scroll">
        <div class="report-paper" ref="reportPaper">
          <div class="rp-date">{{ reportDateText }}</div>

          <div class="rp-banner">
            <div class="rp-banner-title">ผลรวมการตรวจสอบกระแสสังคม ทั้ง {{ domainCount }} มิติ</div>
            <div class="rp-banner-sub">“{{ domainNamesText }}”</div>
          </div>

          <!-- KPI -->
          <div class="rp-kpis">
            <div class="rp-card rp-kpi" v-for="k in kpis" :key="k.key">
              <div class="rp-kpi-head"><i :class="k.icon"></i> {{ k.label }}</div>
              <div class="rp-kpi-value" :style="{ color: k.color }">{{ fmt(k.value) }}</div>
              <div class="rp-kpi-desc">{{ k.desc }}</div>
            </div>
          </div>

          <!-- แถว 1 : Sentiment + เปรียบเทียบโพสต์ -->
          <div class="rp-row" ref="row1">
            <div class="rp-card rp-half">
              <div class="rp-card-title">SENTIMENT</div>
              <div class="rp-senti">
                <div class="rp-senti-left">
                  <div class="rp-senti-desc">
                    ความรู้สึกของผู้โพสต์ และการใช้ภาษาที่แสดงออกมาจากข้อความที่โพสต์บนสื่อสังคมออนไลน์
                    รวมทั้ง {{ domainCount }} มิติ มากที่สุดคือ
                    <b :style="{ color: topSentiment.color }">“ {{ topSentiment.label }} ”</b>
                  </div>
                  <div class="rp-senti-item" v-for="s in sentiments" :key="s.key" :style="{ color: s.color }">
                    <i :class="s.icon"></i>
                    <span class="rp-senti-num">{{ fmt(s.value) }}</span>
                    <span class="rp-senti-unit">posts</span>
                  </div>
                </div>
                <div class="rp-pie">
                  <svg width="150" height="150" viewBox="0 0 150 150">
                    <circle v-if="pieSlices.length === 1" cx="75" cy="75" r="72" :fill="pieSlices[0].color" />
                    <path v-else v-for="(p, i) in pieSlices" :key="i" :d="p.d" :fill="p.color" stroke="#fff" stroke-width="1.5" />
                  </svg>
                  <span
                    v-for="(p, i) in pieSlices"
                    :key="'l' + i"
                    v-show="p.pct >= 4"
                    class="rp-pie-label"
                    :style="{ left: p.lx + 'px', top: p.ly + 'px' }"
                  >{{ Math.round(p.pct) }}%</span>
                </div>
              </div>
            </div>
            <div class="rp-card rp-half">
              <div class="rp-card-title">เปรียบเทียบจำนวนโพสต์</div>
              <BarList :items="barItems('post_comparison', 'totalPost')" />
            </div>
          </div>

          <!-- แถว 2 : Engagement + บัญชี -->
          <div class="rp-row" ref="row2">
            <div class="rp-card rp-half">
              <div class="rp-card-title">เปรียบเทียบจำนวนค่า Engagements</div>
              <BarList :items="barItems('engagement_comparison', 'engagement')" />
            </div>
            <div class="rp-card rp-half">
              <div class="rp-card-title">เปรียบเทียบจำนวนบัญชีผู้โพสต์</div>
              <BarList :items="barItems('account_comparison', 'Accounts')" />
            </div>
          </div>

          <!-- ตารางสรุป -->
          <table class="rp-table">
            <thead>
              <tr>
                <th class="text-left">มิติ</th>
                <th>โพสต์</th>
                <th>บัญชีต้นโพสต์</th>
                <th>Engagements</th>
                <th>Views</th>
                <th>Sentiment (บวก / กลาง / ลบ)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in summaryRows" :key="r.domain_id" :class="{ 'rp-total': r.isTotal }">
                <td class="text-left">
                  <span v-if="!r.isTotal" class="rp-dot" :style="{ background: r.color }"></span>
                  {{ r.label }}
                </td>
                <td>{{ fmt(r.totalPost) }}</td>
                <td>{{ fmt(r.Accounts) }}</td>
                <td>{{ fmt(r.engagement) }}</td>
                <td>{{ fmt(r.views_count) }}</td>
                <td class="rp-senti-cell">
                  <span class="c-pos">{{ pct(r.sentiment.positive) }}</span> /
                  <span class="c-neu">{{ pct(r.sentiment.neutral) }}</span> /
                  <span class="c-neg">{{ pct(r.sentiment.negative) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import HomeNav from "@/components/HomeNav.vue";
import { canvasToPdfBlob } from "@/common/imagePdf";

const API = "https://api2.cognizata.com/api/v2";
const DOMAIN_COLORS = ["#8fa9c4", "#a8d08d", "#2f6bbf", "#ec6b5e", "#8c8c8c", "#fdd97a", "#b38fd1", "#5bc0be", "#f4a261", "#6d8b74"];
const SENTI = {
  positive: { label: "Positive", color: "#6cc59a", text: "#3fae7a", icon: "far fa-smile" },
  neutral: { label: "Neutral", color: "#4a8fd4", text: "#3b7dc4", icon: "far fa-meh" },
  negative: { label: "Negative", color: "#ec6b5e", text: "#e0584b", icon: "far fa-frown" },
};
const TH_MONTHS = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

const BarList = {
  props: { items: { type: Array, default: () => [] } },
  render(h) {
    const max = Math.max(1, ...this.items.map((i) => i.value || 0));
    return h(
      "div",
      { class: "rp-bars" },
      this.items.map((it) =>
        h("div", { class: "rp-bar-row" }, [
          h("div", { class: "rp-bar-label" }, it.label),
          h("div", { class: "rp-bar-track" }, [
            h("div", {
              class: "rp-bar",
              style: { width: Math.max(1.5, ((it.value || 0) / max) * 100) * 0.72 + "%", background: it.color },
            }),
            h("span", { class: "rp-bar-val" }, (it.value || 0).toLocaleString("en-US")),
          ]),
        ])
      )
    );
  },
};

export default {
  name: "ReportDomain",
  components: { HomeNav, BarList },
  data() {
    const today = moment().format("YYYY-MM-DD");
    return {
      valueDate: [today, today],
      domainOptions: [],
      selectedDomains: [],
      loadingDomains: false,
      loading: false,
      exporting: "",
      activePreset: "today",
      presets: [
        { key: "today", label: "วันนี้", days: 0, offset: 0 },
        { key: "yesterday", label: "เมื่อวาน", days: 0, offset: 1 },
        { key: "7d", label: "7 วัน", days: 6, offset: 0 },
        { key: "30d", label: "30 วัน", days: 29, offset: 0 },
      ],
      errorMsg: "",
      report: null,
    };
  },
  computed: {
    hasDate() {
      return Array.isArray(this.valueDate) && this.valueDate[0] && this.valueDate[1];
    },
    domainRows() {
      return this.report ? (this.report.domain_summary || []).filter((d) => d.domain_id !== "total") : [];
    },
    colorMap() {
      const map = {};
      this.domainRows.forEach((d, i) => (map[d.domain_id] = DOMAIN_COLORS[i % DOMAIN_COLORS.length]));
      return map;
    },
    domainCount() {
      return this.domainRows.length;
    },
    domainNamesText() {
      return this.domainRows.map((d) => d.domain_name).join(" ");
    },
    reportDateText() {
      if (!this.report) return "";
      const s = this.thaiDate(this.report.start_date);
      const e = this.thaiDate(this.report.end_date);
      return this.report.start_date === this.report.end_date ? `รายงานประจำวันที่ ${s}` : `รายงานระหว่างวันที่ ${s} - ${e}`;
    },
    kpis() {
      const r = this.report || {};
      return [
        { key: "posts", label: "POSTS", icon: "far fa-paper-plane", value: r.totalPost, desc: "จำนวนโพสต์", color: "#5cc08e" },
        { key: "users", label: "USERS", icon: "fas fa-user-friends", value: r.Accounts, desc: "Accounts ต้นโพสต์", color: "#5cc08e" },
        { key: "eng", label: "ENGAGES", icon: "far fa-thumbs-up", value: r.engagement, desc: "การมีส่วนร่วม", color: "#444" },
        { key: "views", label: "VIEWS", icon: "far fa-eye", value: r.views_count, desc: "การรับชม", color: "#444" },
      ];
    },
    sentiments() {
      const r = this.report || {};
      return [
        { key: "positive", value: r.positiveSentiment || 0, ...SENTI.positive, color: SENTI.positive.text },
        { key: "neutral", value: r.neutralSentiment || 0, ...SENTI.neutral, color: SENTI.neutral.text },
        { key: "negative", value: r.negativeSentiment || 0, ...SENTI.negative, color: SENTI.negative.text },
      ];
    },
    topSentiment() {
      return [...this.sentiments].sort((a, b) => b.value - a.value)[0] || SENTI.neutral;
    },
    pieSlices() {
      const total = this.sentiments.reduce((a, s) => a + s.value, 0);
      if (!total) return [];
      const cx = 75, cy = 75, r = 72;
      let angle = -Math.PI / 2;
      return this.sentiments
        .filter((s) => s.value > 0)
        .map((s) => {
          const frac = s.value / total;
          const a0 = angle;
          const a1 = angle + frac * Math.PI * 2;
          angle = a1;
          const large = a1 - a0 > Math.PI ? 1 : 0;
          const p0 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)];
          const p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
          const mid = (a0 + a1) / 2;
          return {
            color: SENTI[s.key].color,
            pct: frac * 100,
            d: `M${cx},${cy} L${p0[0]},${p0[1]} A${r},${r} 0 ${large} 1 ${p1[0]},${p1[1]} Z`,
            lx: cx + r * 0.6 * Math.cos(mid),
            ly: cy + r * 0.6 * Math.sin(mid),
          };
        });
    },
    summaryRows() {
      if (!this.report) return [];
      return (this.report.domain_summary || []).map((d) => {
        const isTotal = d.domain_id === "total";
        return {
          ...d,
          isTotal,
          sentiment: d.sentiment || {},
          color: this.colorMap[d.domain_id],
          label: isTotal ? `รวมทั้ง ${this.domainCount} มิติ` : `มิติ${d.domain_name}`,
        };
      });
    },
  },
  methods: {
    fmt(v) {
      return Number(v || 0).toLocaleString("en-US");
    },
    pct(v) {
      return `${Number(v || 0).toFixed(1)}%`;
    },
    thaiDate(d) {
      const m = moment(d, "YYYY-MM-DD");
      return `${m.date()} ${TH_MONTHS[m.month()]} ${m.year() + 543}`;
    },
    barItems(key, field) {
      if (!this.report) return [];
      return (this.report[key] || []).map((d) => ({
        label: `มิติ${d.domain_name}`,
        value: d[field] || 0,
        color: this.colorMap[d.domain_id] || "#999",
      }));
    },
    authHeaders() {
      return { Authorization: "Bearer " + localStorage.getItem("token"), "Content-Type": "application/json" };
    },
    applyPreset(p) {
      const end = moment().subtract(p.offset, "days");
      const start = end.clone().subtract(p.days, "days");
      this.valueDate = [start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD")];
      this.$nextTick(() => (this.activePreset = p.key));
    },
    selectAll() {
      this.selectedDomains = this.domainOptions.map((d) => d.id);
    },
    fetchDomains() {
      this.loadingDomains = true;
      this.axios({ method: "get", url: `${API}/domain/getDomainlist`, headers: this.authHeaders() })
        .then((res) => {
          this.domainOptions = (res.data && res.data.data) || [];
          const q = this.$route.query.domain_id;
          if (q) {
            const ids = String(q).split(",").map(Number);
            this.selectedDomains = this.domainOptions.filter((d) => ids.includes(Number(d.id))).map((d) => d.id);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => (this.loadingDomains = false));
    },
    fetchReport() {
      if (!this.selectedDomains.length || !this.hasDate) return;
      this.loading = true;
      this.errorMsg = "";
      this.axios({
        method: "get",
        url: `${API}/userposts/getStatisticsReportByDomains`,
        params: {
          domain_id: this.selectedDomains.join(","),
          start_date: this.valueDate[0],
          end_date: this.valueDate[1],
        },
        headers: this.authHeaders(),
      })
        .then((res) => {
          this.report = res.data;
        })
        .catch((err) => {
          console.error(err);
          this.report = null;
          this.errorMsg = "ไม่สามารถดึงข้อมูลรายงานได้ กรุณาลองใหม่อีกครั้ง";
        })
        .finally(() => (this.loading = false));
    },
    fileName(ext) {
      const r = this.report;
      const d = r.start_date === r.end_date ? r.start_date : `${r.start_date}_${r.end_date}`;
      return `รายงานกระแสสังคม_${d}.${ext}`;
    },
    async capture(el) {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      return html2canvas(el, { scale: 2, backgroundColor: "#ffffff", useCORS: true, logging: false });
    },
    async exportPdf() {
      this.exporting = "pdf";
      try {
        const canvas = await this.capture(this.$refs.reportPaper);
        saveAs(canvasToPdfBlob(canvas), this.fileName("pdf"));
      } catch (e) {
        console.error(e);
        this.$bvToast && this.$bvToast.toast("Export PDF ไม่สำเร็จ", { variant: "danger", solid: true });
      } finally {
        this.exporting = "";
      }
    },
    async exportExcel() {
      this.exporting = "excel";
      try {
        const XLSX = await import("xlsx");
        const r = this.report;
        const wb = XLSX.utils.book_new();
        const add = (rows, name) => XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), name);

        // ข้อมูลดิบจาก API ตามชื่อฟิลด์เดิม
        const overview = { domain_ids: (r.domain_ids || []).join(","), start_date: r.start_date, end_date: r.end_date };
        Object.keys(r).forEach((k) => {
          if (typeof r[k] !== "object" || r[k] === null) overview[k] = r[k];
        });
        add([overview], "overview");
        add(
          (r.domain_summary || []).map((d) => ({
            domain_id: d.domain_id,
            domain_name: d.domain_name,
            totalPost: d.totalPost,
            Accounts: d.Accounts,
            engagement: d.engagement,
            views_count: d.views_count,
            positive: (d.sentiment || {}).positive,
            neutral: (d.sentiment || {}).neutral,
            negative: (d.sentiment || {}).negative,
          })),
          "domain_summary"
        );
        add(r.post_comparison || [], "post_comparison");
        add(r.engagement_comparison || [], "engagement_comparison");
        add(r.account_comparison || [], "account_comparison");
        add(Object.keys(r.user_comments_source || {}).map((k) => ({ source: k, count: r.user_comments_source[k] })), "user_comments_source");
        XLSX.writeFile(wb, this.fileName("xlsx"));
      } catch (e) {
        console.error(e);
        this.$bvToast && this.$bvToast.toast("Export Excel ไม่สำเร็จ", { variant: "danger", solid: true });
      } finally {
        this.exporting = "";
      }
    },
    async exportWord() {
      this.exporting = "word";
      try {
        const docx = await import("docx");
        const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, ImageRun, ShadingType, BorderStyle } = docx;

        const toImage = async (el, width) => {
          const c = await this.capture(el);
          const bytes = await new Promise((resolve) =>
            c.toBlob((b) => b.arrayBuffer().then((buf) => resolve(new Uint8Array(buf))), "image/png")
          );
          return new Paragraph({
            spacing: { after: 120 },
            children: [new ImageRun({ data: bytes, transformation: { width, height: Math.round((c.height * width) / c.width) } })],
          });
        };

        const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
        const lineBorder = { style: BorderStyle.SINGLE, size: 4, color: "DDDDDD" };
        const cell = (runs, opts = {}) =>
          new TableCell({
            width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
            shading: opts.fill ? { type: ShadingType.CLEAR, color: "auto", fill: opts.fill } : undefined,
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            borders: opts.borders,
            children: [
              new Paragraph({
                alignment: opts.align || AlignmentType.LEFT,
                children: (Array.isArray(runs) ? runs : [runs]).map((r) => (typeof r === "string" ? new TextRun({ text: r, ...(opts.run || {}) }) : r)),
              }),
            ],
          });

        // หัวรายงาน
        const children = [
          new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 120 }, children: [new TextRun({ text: this.reportDateText, size: 20 })] }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, color: "auto", fill: "F7BC2F" },
                    margins: { top: 160, bottom: 160, left: 200, right: 200 },
                    borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
                    children: [
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `ผลรวมการตรวจสอบกระแสสังคม ทั้ง ${this.domainCount} มิติ`, bold: true, size: 36, color: "FFFFFF" })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `“${this.domainNamesText}”`, bold: true, size: 24, color: "FFFFFF" })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({ text: "", spacing: { after: 120 } }),
        ];

        // KPI
        const kpiBorders = { top: lineBorder, bottom: lineBorder, left: lineBorder, right: lineBorder };
        children.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: this.kpis.map(
                  (k) =>
                    new TableCell({
                      width: { size: 25, type: WidthType.PERCENTAGE },
                      margins: { top: 100, bottom: 100, left: 140, right: 100 },
                      borders: kpiBorders,
                      children: [
                        new Paragraph({ children: [new TextRun({ text: k.label, bold: true, size: 20 })] }),
                        new Paragraph({ children: [new TextRun({ text: this.fmt(k.value), bold: true, size: 36, color: k.color === "#444" ? "444444" : k.color.replace("#", "") })] }),
                        new Paragraph({ children: [new TextRun({ text: k.desc, size: 16, color: "666666" })] }),
                      ],
                    })
                ),
              }),
            ],
          }),
          new Paragraph({ text: "", spacing: { after: 120 } })
        );

        // กราฟ (ภาพ)
        children.push(await toImage(this.$refs.row1, 690));
        children.push(await toImage(this.$refs.row2, 690));

        // ตารางสรุป
        const headFill = "222222";
        const head = new TableRow({
          tableHeader: true,
          children: ["มิติ", "โพสต์", "บัญชีต้นโพสต์", "Engagements", "Views", "Sentiment (บวก / กลาง / ลบ)"].map((t, i) =>
            cell(t, { fill: headFill, align: i === 0 ? AlignmentType.LEFT : AlignmentType.RIGHT, run: { color: "FFFFFF", bold: true, size: 18 }, borders: kpiBorders })
          ),
        });
        const body = this.summaryRows.map((r) => {
          const fill = r.isTotal ? "FFF3CD" : undefined;
          const run = { size: 18, bold: r.isTotal };
          const right = (t) => cell(t, { fill, align: AlignmentType.RIGHT, run, borders: kpiBorders });
          return new TableRow({
            children: [
              cell(
                r.isTotal
                  ? [new TextRun({ text: r.label, ...run })]
                  : [new TextRun({ text: "■ ", color: (r.color || "#999999").replace("#", ""), size: 18 }), new TextRun({ text: r.label, ...run })],
                { fill, run, borders: kpiBorders, width: 26 }
              ),
              right(this.fmt(r.totalPost)),
              right(this.fmt(r.Accounts)),
              right(this.fmt(r.engagement)),
              right(this.fmt(r.views_count)),
              cell(
                [
                  new TextRun({ text: this.pct(r.sentiment.positive), color: "3FAE7A", ...run }),
                  new TextRun({ text: " / ", ...run }),
                  new TextRun({ text: this.pct(r.sentiment.neutral), color: "3B7DC4", ...run }),
                  new TextRun({ text: " / ", ...run }),
                  new TextRun({ text: this.pct(r.sentiment.negative), color: "E0584B", ...run }),
                ],
                { fill, align: AlignmentType.RIGHT, borders: kpiBorders }
              ),
            ],
          });
        });
        children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [head, ...body] }));

        const doc = new Document({
          styles: { default: { document: { run: { font: "Tahoma", size: 20 } } } },
          sections: [{ properties: { page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } } }, children }],
        });
        saveAs(await Packer.toBlob(doc), this.fileName("docx"));
      } catch (e) {
        console.error(e);
        this.$bvToast && this.$bvToast.toast("Export Word ไม่สำเร็จ", { variant: "danger", solid: true });
      } finally {
        this.exporting = "";
      }
    },
  },
  watch: {
    valueDate() {
      this.activePreset = "";
    },
  },
  mounted() {
    this.fetchDomains();
  },
};
</script>

<style scoped>
#content {
  font-family: "Prompt", sans-serif;
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
}
#navHome {
  z-index: 1;
}
/* ===== Page header ===== */
.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 28px 16px 16px;
}
.btn-back {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid #ececec;
  background: #fff;
  color: #555;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
}
.btn-back:hover {
  background: #fed16e;
  color: #fff;
  border-color: #fed16e;
}
.page-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  line-height: 1.2;
}
.page-sub {
  font-size: 13px;
  color: #999;
}
.export-group {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 999px;
  padding: 5px 6px 5px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.export-label {
  font-size: 13px;
  color: #888;
  margin-right: 2px;
}
.btn-export {
  border: none;
  border-radius: 999px;
  color: #fff;
  font-size: 13px;
  padding: 6px 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: transform 0.15s, opacity 0.15s;
}
.ex-icon {
  width: 14px;
  height: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 14px;
}
.ex-spin {
  width: 13px !important;
  height: 13px !important;
  border-width: 2px !important;
  vertical-align: middle;
  /* ยกเลิก .spinner-border แบบ global ใน App.vue ที่ตั้ง position absolute */
  position: static !important;
  margin: 0 !important;
  left: auto !important;
  top: auto !important;
}
.btn-export:hover:not(:disabled) {
  transform: translateY(-1px);
}
.btn-export:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-export.word {
  background: #2b579a;
}
.btn-export.excel {
  background: #217346;
}
.btn-export.pdf {
  background: #d93025;
}

/* ===== Filter card ===== */
.filter-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-top: 4px solid #fed16e;
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #555;
  margin-bottom: 6px;
}
.filter-label i {
  color: #e8a917;
  margin-right: 4px;
}
.count-badge {
  background: #fff4d6;
  color: #b07d00;
  border-radius: 999px;
  font-size: 12px;
  padding: 1px 10px;
}
.link-action {
  font-size: 13px;
  font-weight: 400;
}
.preset-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}
.preset-chip {
  font-size: 12px;
  padding: 3px 12px;
  border-radius: 999px;
  background: #f4f4f4;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}
.preset-chip:hover {
  background: #ffefc4;
}
.preset-chip.active {
  background: #fed16e;
  color: #5a4300;
}
.domain-select >>> .vs__dropdown-toggle {
  min-height: 38px;
  border-radius: 8px;
  border-color: #dcdcdc;
}
.domain-select >>> .vs__selected {
  background: #fff4d6;
  border-color: #fed16e;
  border-radius: 999px;
  padding: 0 8px;
  font-size: 13px;
}
.btn-run {
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #fed16e, #f7bc2f);
  color: #4a3600;
  font-weight: 600;
  padding: 9px 14px;
  box-shadow: 0 3px 10px rgba(247, 188, 47, 0.4);
  transition: transform 0.15s, box-shadow 0.15s;
}
.btn-run:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 5px 14px rgba(247, 188, 47, 0.5);
}
.btn-run:disabled {
  background: #eee;
  color: #aaa;
  box-shadow: none;
  cursor: not-allowed;
}

/* ===== Preview area ===== */
.preview-area {
  margin-top: 20px;
  background: #f3f4f6;
  border-radius: 16px;
  min-height: 420px;
}
.state-box {
  min-height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 30px;
}
.state-spin {
  /* ยกเลิก .spinner-border แบบ global ใน App.vue ที่ตั้ง position absolute */
  position: static !important;
  margin: 0 !important;
  left: auto !important;
  top: auto !important;
  width: 2.5rem !important;
  height: 2.5rem !important;
}
.state-icon {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: #fff;
  color: #f7bc2f;
  font-size: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  margin-bottom: 14px;
}
.state-icon.err {
  color: #e0584b;
}
.state-title {
  font-size: 17px;
  font-weight: 500;
  color: #555;
}
.state-sub {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

/* ===== Report paper ===== */
.report-scroll {
  overflow-x: auto;
  padding: 28px 12px;
}
.report-paper {
  width: 820px;
  margin: 0 auto;
  background: #fff;
  padding: 28px 30px;
  color: #333;
  border-radius: 4px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
}
.rp-date {
  text-align: right;
  font-size: 14px;
  margin-bottom: 10px;
}
.rp-banner {
  background: #f7bc2f;
  border-radius: 14px;
  color: #fff;
  text-align: center;
  padding: 16px 10px;
  margin-bottom: 14px;
}
.rp-banner-title {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
}
.rp-banner-sub {
  font-size: 18px;
  font-weight: 600;
}
.rp-card {
  border: 1px solid #e3e3e3;
  border-radius: 12px;
  background: #fff;
  padding: 12px 14px;
}
.rp-kpis {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
}
.rp-kpi {
  flex: 1;
}
.rp-kpi-head {
  font-weight: 700;
  font-size: 14px;
}
.rp-kpi-head i {
  margin-right: 6px;
}
.rp-kpi-value {
  font-size: 30px;
  font-weight: 500;
  line-height: 1.3;
}
.rp-kpi-desc {
  font-size: 11px;
  color: #777;
}
.rp-row {
  display: flex;
  gap: 14px;
  margin-bottom: 14px;
  background: #fff;
}
.rp-half {
  flex: 1;
  min-width: 0;
}
.rp-card-title {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 10px;
}
.rp-senti {
  display: flex;
  align-items: center;
}
.rp-senti-left {
  flex: 1;
  padding-right: 6px;
}
.rp-senti-desc {
  font-size: 11px;
  color: #555;
  margin-bottom: 8px;
  line-height: 1.5;
}
.rp-senti-item {
  display: flex;
  align-items: center;
  font-size: 18px;
  margin-bottom: 4px;
}
.rp-senti-item i {
  font-size: 22px;
  width: 30px;
}
.rp-senti-num {
  width: 80px;
  font-weight: 500;
}
.rp-senti-unit {
  font-size: 15px;
}
.rp-pie {
  position: relative;
  width: 150px;
  height: 150px;
  flex: 0 0 150px;
}
.rp-pie svg {
  display: block;
}
.rp-pie-label {
  position: absolute;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}

/* bars */
.rp-bars >>> .rp-bar-row,
.rp-bar-row {
  display: flex;
  align-items: center;
  margin-bottom: 7px;
}
.rp-bars >>> .rp-bar-label {
  width: 135px;
  flex: 0 0 135px;
  text-align: right;
  font-size: 11.5px;
  padding-right: 8px;
  line-height: 1.2;
}
.rp-bars >>> .rp-bar-track {
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
}
.rp-bars >>> .rp-bar {
  height: 14px;
  border-radius: 3px;
}
.rp-bars >>> .rp-bar-val {
  font-size: 11px;
  margin-left: 6px;
  white-space: nowrap;
}

/* table */
.rp-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}
.rp-table th {
  background: #222;
  color: #fff;
  font-weight: 500;
  padding: 7px 8px;
  text-align: right;
}
.rp-table td {
  padding: 7px 8px;
  text-align: right;
  border-bottom: 1px solid #eee;
}
.rp-table .text-left {
  text-align: left;
}
.rp-total td {
  background: #fff3cd;
  font-weight: 700;
}
.rp-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  margin-right: 6px;
}
.c-pos {
  color: #3fae7a;
}
.c-neu {
  color: #3b7dc4;
}
.c-neg {
  color: #e0584b;
}
</style>
