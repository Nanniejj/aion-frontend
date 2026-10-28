// A shared text model keeps Word and the printable PDF report consistent.
export function buildInsightReport({ result, resultKey, domainName, savedAt, overview }) {
  let filters = {};
  try { filters = JSON.parse(resultKey || "{}"); } catch (e) { /* Older saved result. */ }
  const blocks = [];
  const add = (text, heading = false, kind = "body", depth = 0) => {
    if (text !== undefined && text !== null && text !== "") blocks.push({ text: String(text), heading, kind: heading ? "section" : kind, depth });
  };
  const labels = {
    headline: "พาดหัว", executive_summary: "สรุปผู้บริหาร", situation_level: "ระดับสถานการณ์",
    overall_sentiment: "กระแสโดยรวม", trend_overview: "แนวโน้ม", key_themes: "ประเด็นหลัก",
    audience_reaction: "ปฏิกิริยาผู้ชม", storylines: "เรื่องสืบเนื่อง", daily_changes: "การเปลี่ยนแปลงรายวัน",
    risks: "ความเสี่ยง", misinformation_signals: "สัญญาณข่าวลือ", recommendations: "ข้อเสนอแนะ",
    opportunities: "โอกาส", influencers: "ผู้มีอิทธิพล", keywords: "คำสำคัญ", title: "หัวข้อ",
    description: "รายละเอียด", summary: "สรุป", reason: "เหตุผล", level: "ระดับ", label: "กระแส",
    status: "สถานะ", action: "สิ่งที่ควรทำ", priority: "ความสำคัญ", why: "เหตุผล", rationale: "เหตุผล",
    date: "วันที่", timeline: "ลำดับเหตุการณ์", change_summary: "การเปลี่ยนแปลง", new_topics: "ประเด็นใหม่",
    supporting: "ความเห็นสนับสนุน", opposing: "ความเห็นคัดค้าน", point: "ประเด็น", refs: "โพสต์อ้างอิง",
    post_refs: "โพสต์อ้างอิง", share_percent: "สัดส่วน (%)", stats: "สถิติ", comment_analysis: "วิเคราะห์คอมเมนต์",
    sample_comments: "ตัวอย่างคอมเมนต์", arguments: "ข้อโต้แย้ง", examples: "ตัวอย่าง", text: "ข้อความ",
    author: "ผู้เขียน", account_name: "บัญชี", platform: "แพลตฟอร์ม", url_post: "ลิงก์โพสต์",
    total_posts: "จำนวนโพสต์", posts: "โพสต์", accounts: "จำนวนบัญชี", user_comments: "จำนวนคอมเมนต์",
    engagement: "การมีส่วนร่วม", total: "รวม", views: "ยอดชม", sentiment: "ความคิดเห็น",
    sentiment_percent: "สัดส่วนความคิดเห็น (%)", positive: "เชิงบวก", neutral: "เป็นกลาง", negative: "เชิงลบ",
    net_sentiment_score: "Net Sentiment", net_score: "คะแนนสุทธิ", count: "จำนวน", counts: "จำนวนแยกประเภท",
    labeled: "จำนวนที่วิเคราะห์", percent: "ร้อยละ", side: "ทิศทาง", stance: "ความเห็น", post: "โพสต์ต้นทาง",
    role: "บทบาท", impact: "ผลกระทบ", evidence: "หลักฐาน", ref: "รหัสอ้างอิง", from: "เริ่ม", to: "สิ้นสุด",
  };
  const values = { positive: "เชิงบวก", negative: "เชิงลบ", neutral: "เป็นกลาง", mixed: "ผสม", high: "สูง", medium: "กลาง", low: "ต่ำ", normal: "ปกติ", watch: "เฝ้าระวัง", alert: "แจ้งเตือน", critical: "วิกฤต" };
  const walk = (value, key, depth = 0) => {
    if (value == null || value === "" || (Array.isArray(value) && !value.length)) return;
    // Media and internal identifiers are unnecessary in a text report.
    if (["hero_images", "images", "profile_image", "id", "_id", "key"].includes(key)) return;
    const label = labels[key] || key.replace(/_/g, " ");
    if (Array.isArray(value)) {
      add(label, depth === 0, "label", depth);
      value.forEach((item, i) => {
        if (typeof item === "object" && item !== null) {
          const titleKey = ["title", "headline", "action"].find(k => item[k]);
          add(`${i + 1}. ${item[titleKey] || label}`, false, "subheading", depth);
          Object.keys(item).filter(k => k !== titleKey).forEach(k => walk(item[k], k, depth + 1));
        } else add(`${i + 1}. ${values[item] || item}`, false, "body", depth);
      });
    } else if (typeof value === "object") {
      add(label, depth === 0, "label", depth);
      Object.keys(value).forEach(k => walk(value[k], k, depth + 1));
    } else {
      if (depth === 0) {
        add(label, true);
        add(values[value] || value);
      } else add(`${label}: ${values[value] || value}`, false, "body", depth);
    }
  };
  add("AI INSIGHT", false, "eyebrow");
  add(`รายงานวิเคราะห์ ${domainName || filters.domain || "Domain"}`, false, "title");
  const date = value => value ? String(value).replace("T", " ") : "ไม่ระบุ";
  add(`ช่วงข้อมูล  ${date(filters.start_date)} — ${date(filters.end_date)}`, false, "meta");
  add(`แพลตฟอร์ม  ${filters.source || "ทั้งหมด"}  •  แหล่งข่าว  ${filters.source_news || "all"}`, false, "meta");
  if (savedAt) add(`วิเคราะห์เมื่อ  ${new Date(savedAt).toLocaleString("th-TH")}`, false, "meta");
  add(`ออกรายงานเมื่อ  ${new Date().toLocaleString("th-TH")}`, false, "meta");
  add(result.message);
  if (overview) {
    const fmt = n => Number(n || 0).toLocaleString("th-TH");
    blocks.push({ kind: "metrics", items: [
      { label: "โพสต์ทั้งหมด", value: fmt(overview.total_posts) },
      { label: "การมีส่วนร่วม", value: fmt((overview.engagement || {}).total) },
      { label: "บัญชีผู้โพสต์", value: fmt(overview.accounts) },
      { label: "Net Sentiment", value: fmt(overview.net_sentiment_score) },
    ] });
    const sentiment = overview.sentiment || {};
    add(`ความคิดเห็น  บวก ${fmt(sentiment.positive)}  /  กลาง ${fmt(sentiment.neutral)}  /  ลบ ${fmt(sentiment.negative)}`, false, "meta");
  }
  Object.keys(result.analysis || {}).forEach(key => walk(result.analysis[key], key));
  if (!result.analysis) add(result.raw_text);
  walk(result.daily, "ข้อมูลรายวัน");
  add("โพสต์อ้างอิง", true);
  (result.posts || []).forEach(p => {
    add(`[${p.ref || "-"}] ${p.account_name || ""} · ${p.platform || ""} · ${p.date || ""}`, false, "subheading");
    add(p.title || p.text);
    add(p.url_post, false, "link");
  });
  add("รายงานนี้สร้างจากผลวิเคราะห์ของ AI โปรดตรวจสอบข้อมูลกับโพสต์อ้างอิงก่อนนำไปใช้", false, "note");
  return blocks;
}

export async function createInsightWordBlob(blocks) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
    WidthType, Footer, Header, AlignmentType, PageNumber, ExternalHyperlink, BorderStyle } = await import("docx");
  const ink = "202939", muted = "64748B", accent = "6554A4";
  const paragraph = b => {
    const title = b.kind === "title", section = b.heading, sub = b.kind === "subheading";
    const secondary = ["meta", "note", "eyebrow", "link"].includes(b.kind);
    const run = { text: b.text, font: "Tahoma", size: title ? 36 : section ? 27 : secondary ? 19 : 22,
      bold: title || section || sub || b.kind === "label" || b.kind === "eyebrow",
      color: title || section || sub ? ink : secondary ? muted : ink };
    return new Paragraph({
      heading: title ? HeadingLevel.TITLE : section ? HeadingLevel.HEADING_1 : sub ? HeadingLevel.HEADING_2 : undefined,
      keepNext: title || section || sub || b.kind === "label" || b.kind === "eyebrow",
      spacing: { before: section ? 320 : sub ? 200 : b.kind === "note" ? 300 : 0, after: title ? 240 : secondary ? 90 : 140, line: 340 },
      indent: b.depth ? { left: Math.min(b.depth, 2) * 180 } : undefined,
      children: b.kind === "link" && /^https?:\/\//i.test(b.text)
        ? [new ExternalHyperlink({ link: b.text, children: [new TextRun({ ...run, color: accent, underline: {} })] })]
        : [new TextRun(run)],
    });
  };
  const children = [];
  blocks.forEach(b => {
    if (b.kind !== "metrics") { children.push(paragraph(b)); return; }
    children.push(new Paragraph({ spacing: { after: 100 }, children: [] }));
    const border = { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" };
    children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { top: border, bottom: border, left: border, right: border, insideHorizontal: border, insideVertical: border },
      rows: [new TableRow({ cantSplit: true, children: b.items.map(item => new TableCell({
        width: { size: 25, type: WidthType.PERCENTAGE },
        shading: { fill: "F1F5F9" }, margins: { top: 200, bottom: 200, left: 160, right: 160 },
        children: [
          new Paragraph({ children: [new TextRun({ text: item.value, bold: true, size: 30, color: ink })] }),
          new Paragraph({ spacing: { before: 70 }, children: [new TextRun({ text: item.label, size: 18, color: muted })] }),
        ],
      })) })],
    }));
    children.push(new Paragraph({ children: [], spacing: { after: 100 } }));
  });
  const doc = new Document({
    creator: "AION", title: (blocks.find(b => b.kind === "title") || {}).text || "AI Insight",
    styles: { default: { document: { run: { font: "Tahoma", size: 22, color: ink }, paragraph: { spacing: { after: 140, line: 340 } } } } },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1020, bottom: 1020, left: 1080, right: 1080 } } },
      headers: { default: new Header({ children: [new Paragraph({ children: [new TextRun({ text: "AION  /  AI INSIGHT", color: muted, size: 16 })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
        new TextRun({ text: "AI Insight  •  ", color: muted, size: 16 }), new TextRun({ children: [PageNumber.CURRENT], color: muted, size: 16 }),
      ] })] }) },
      children,
    }],
  });
  return Packer.toBlob(doc);
}

export async function downloadInsightWord(blocks, filename) {
  const blob = await createInsightWordBlob(blocks);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename + ".docx";
  document.body.appendChild(anchor);
  try { anchor.click(); } finally {
    anchor.remove();
    // Allow the browser to consume the Blob before releasing it.
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
}

export function printInsightPdf(blocks, filename) {
  const popup = window.open("", "_blank");
  if (!popup) throw new Error("กรุณาอนุญาตหน้าต่างป๊อปอัปเพื่อบันทึก PDF");
  const doc = popup.document;
  doc.title = filename;
  doc.documentElement.lang = "th";
  const style = doc.createElement("style");
  style.textContent = `
    @page { size: A4; margin: 18mm; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #eef1f7; color: #202939; font: 11pt Tahoma, sans-serif; line-height: 1.8; }
    .toolbar { max-width: 850px; margin: 24px auto 16px; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 0 12px; color: #64748b; font-size: 10pt; }
    button { border: 0; border-radius: 10px; background: #6554a4; color: white; padding: 12px 22px; font: inherit; cursor: pointer; }
    main { max-width: 850px; margin: 0 auto 40px; padding: 52px 60px; background: white; box-shadow: 0 8px 40px #20293912; border-top: 5px solid #6554a4; }
    h1 { font-size: 24pt; line-height: 1.5; margin: 8px 0 22px; letter-spacing: -.5px; }
    h2 { font-size: 15pt; margin: 30px 0 12px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; }
    h3 { font-size: 11.5pt; margin: 20px 0 8px; }
    h1, h2, h3, .label { break-after: avoid; }
    p { margin: 0 0 10px; white-space: pre-wrap; overflow-wrap: anywhere; orphans: 3; widows: 3; }
    .eyebrow { color: #6554a4; font-size: 10pt; font-weight: bold; letter-spacing: 3px; margin: 0; }
    .meta, .note { color: #64748b; font-size: 9pt; }
    .meta { margin-bottom: 5px; }
    .note { border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 14px; }
    .label { font-weight: bold; margin-top: 14px; }
    .link { color: #6554a4; font-size: 9pt; }
    .metrics { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; background: #e2e8f0; border: 1px solid #e2e8f0; margin: 26px 0 14px; break-inside: avoid; }
    .metric { padding: 16px 12px; background: #f8fafc; min-width: 0; }
    .metric strong { display: block; font-size: 19pt; line-height: 1.4; overflow-wrap: anywhere; }
    .metric span { display: block; font-size: 9pt; color: #64748b; margin-top: 6px; }
    @media screen and (max-width: 600px) { main { padding: 28px 22px; } .metrics { grid-template-columns: repeat(2, 1fr); } .toolbar { flex-wrap: wrap; } }
    @media print { body { background: white; } .toolbar { display: none; } main { max-width: none; margin: 0; padding: 0; border: 0; box-shadow: none; } .metric { background: #f8fafc; } * { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  `;
  doc.head.appendChild(style);
  const button = doc.createElement("button");
  button.textContent = "พิมพ์ / บันทึกเป็น PDF";
  button.onclick = () => popup.print();
  const toolbar = doc.createElement("div");
  toolbar.className = "toolbar";
  const hint = doc.createElement("span");
  hint.textContent = "รายงาน AI Insight • เลือกบันทึกเป็น PDF ในหน้าพิมพ์";
  toolbar.appendChild(hint);
  toolbar.appendChild(button);
  doc.body.appendChild(toolbar);
  const main = doc.createElement("main");
  doc.body.appendChild(main);
  blocks.forEach(b => {
    if (b.kind === "metrics") {
      const metrics = doc.createElement("div");
      metrics.className = "metrics";
      b.items.forEach(item => {
        const cell = doc.createElement("div");
        cell.className = "metric";
        const value = doc.createElement("strong"), label = doc.createElement("span");
        value.textContent = item.value;
        label.textContent = item.label;
        cell.appendChild(value); cell.appendChild(label); metrics.appendChild(cell);
      });
      main.appendChild(metrics);
      return;
    }
    const node = doc.createElement(b.kind === "title" ? "h1" : b.heading ? "h2" : b.kind === "subheading" ? "h3" : "p");
    node.className = b.kind || "body";
    if (b.depth) node.style.marginLeft = Math.min(b.depth, 2) * 12 + "px";
    node.textContent = b.text;
    main.appendChild(node);
  });
  popup.focus();
  popup.print();
}
