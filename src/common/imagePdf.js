// สร้างไฟล์ PDF (A4 แนวตั้ง) จาก canvas โดยไม่ต้องพึ่งไลบรารีเพิ่ม
// ภาพถูกฝังเป็น JPEG (DCTDecode) และตัดเป็นหลายหน้าอัตโนมัติถ้ายาวเกินหนึ่งหน้า

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 20;

function dataUrlToBytes(dataUrl) {
  const bin = atob(dataUrl.split(",")[1]);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function sliceCanvas(canvas) {
  const usableW = PAGE_W - MARGIN * 2;
  const usableH = PAGE_H - MARGIN * 2;
  const sliceH = Math.floor((canvas.width * usableH) / usableW);
  const pages = [];
  for (let y = 0; y < canvas.height; y += sliceH) {
    const h = Math.min(sliceH, canvas.height - y);
    const c = document.createElement("canvas");
    c.width = canvas.width;
    c.height = h;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);
    pages.push({
      bytes: dataUrlToBytes(c.toDataURL("image/jpeg", 0.92)),
      width: c.width,
      height: h,
    });
  }
  return pages;
}

export function canvasToPdfBlob(canvas) {
  const pages = sliceCanvas(canvas);
  const enc = new TextEncoder();
  const chunks = [];
  const offsets = [];
  let offset = 0;
  const push = (d) => {
    const b = typeof d === "string" ? enc.encode(d) : d;
    chunks.push(b);
    offset += b.length;
  };
  const startObj = (num) => {
    offsets[num] = offset;
    push(`${num} 0 obj\n`);
  };

  push("%PDF-1.4\n");
  startObj(1);
  push("<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
  const kids = pages.map((_, i) => `${3 + i * 3} 0 R`).join(" ");
  startObj(2);
  push(`<< /Type /Pages /Kids [${kids}] /Count ${pages.length} >>\nendobj\n`);

  pages.forEach((p, i) => {
    const pageNo = 3 + i * 3;
    const contentNo = pageNo + 1;
    const imgNo = pageNo + 2;
    const dw = PAGE_W - MARGIN * 2;
    const dh = (p.height * dw) / p.width;
    const content = `q ${dw.toFixed(2)} 0 0 ${dh.toFixed(2)} ${MARGIN} ${(PAGE_H - MARGIN - dh).toFixed(2)} cm /Im0 Do Q`;

    startObj(pageNo);
    push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
        `/Resources << /XObject << /Im0 ${imgNo} 0 R >> >> /Contents ${contentNo} 0 R >>\nendobj\n`
    );
    startObj(contentNo);
    push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`);
    startObj(imgNo);
    push(
      `<< /Type /XObject /Subtype /Image /Width ${p.width} /Height ${p.height} ` +
        `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.bytes.length} >>\nstream\n`
    );
    push(p.bytes);
    push("\nendstream\nendobj\n");
  });

  const total = 3 + pages.length * 3;
  const xref = offset;
  let table = `xref\n0 ${total}\n0000000000 65535 f \n`;
  for (let n = 1; n < total; n++) {
    table += `${String(offsets[n]).padStart(10, "0")} 00000 n \n`;
  }
  push(table);
  push(`trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  return new Blob(chunks, { type: "application/pdf" });
}
