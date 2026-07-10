<template>
  <span>
    <div class="h5 text-right px-3 pt-3 no-print" @click="toDomain" style="cursor:pointer;">
      <span style="background:#ede7dd; padding:2px 10px; border-radius:10px">
        <i class="fa fa-angle-left" aria-hidden="true"></i> กลับ
      </span>
      <span></span>
    </div>

    <b-container>
      <div id="exportContent" class="export-bg">
        <div class="h2 ex-title text-left mt-4">
          ด้าน{{ getClickDomain }}

          <span class="float-right no-print">
            <vue-element-loading :active="loadding" size="38" background-color="rgba(255,255,255,0.5)"
              color="#fed16e" />
            <b-dropdown size="sm" class="d-down" variant="secondary">
              <template #button-content>
                <i class="fas fa-file-download" style="font-size:20px;margin-right:7px;cursor:pointer" v-b-tooltip.hover
                  title="Export Report"></i>
                Export
              </template>
              <b-dropdown-item @click="exportFile">
                <i class="fas fa-file-word" style="font-size:18px;margin-right:7px;cursor:pointer" v-b-tooltip.hover
                  title="Export Report"></i>
                Word (.docx)
              </b-dropdown-item>
              <b-dropdown-item @click="exportToPowerPoint">
                <i class="fas fa-file-powerpoint" style="font-size:18px;margin-right:7px;cursor:pointer"
                  v-b-tooltip.hover title="Export Report"></i>
                PowerPoint (.pptx)
              </b-dropdown-item>
            </b-dropdown>

            <i class="fas fa-print fa-2x d-inline ml-2 mr-2" style="font-size:25px;margin-right:7px;cursor:pointer"
              @click="printWindow()"></i>
          </span>
        </div>

        <hr class="pa-5 ma-5" id="ex-line" />
        <div id="ex-date" class="text-left">
          ข้อมูลระหว่าง {{ startd }} - {{ endd }}
        </div>

        <b-row class="page-break">
          <b-col cols="12">
            <StaticDomain class="mt-3 export-bg" id="statcap" />
          </b-col>
          <b-col cols="12" md="6">
            <BarChart id="statbar" class="export-bg" />
          </b-col>
          <b-col cols="12" md="6">
            <div id="ex-hashcloud" class="export-bg">
              <div class="h5 mt-3 bold text-left">TOP 10 #Hashtag</div>
              <div v-for="(hash, k) in getHashtag" :key="k + hash.name" class="pl-3 py-2 text-left">
                {{ k + 1 }} . {{ hash.name }}
              </div>
            </div>
          </b-col>
        </b-row>

        <div class="posts export-bg">
          <div class="text-left d-block h5 py-3 px-4"
            style="background:#cfe7de8a; padding:8px 10px; border-radius:10px; color:rgb(84,198,157)">
            <img class="text-left" src="@/assets/Pos.png" style="width:22px;" />
            <span class="ml-2 text-left"> Positive Posts</span>
            <span class="float-right no-print">
              <b-button size="sm" v-if="showPost" class="mx-2" variant="danger"
                @click="showAllPost('pos')">ยกเลิก</b-button>
              <b-button size="sm" v-if="showPost" variant="success"
                @click="showAllPost('pos', 'submit')">ยืนยัน</b-button>
              <span v-else>
                <b-button size="sm" variant="outline-success" @click="showAllPost('pos')">เลือกโพสต์</b-button>
                <i class="fa fa-refresh mx-2" style="cursor:pointer" aria-hidden="true"
                  @click="forceRerender('pos')"></i>
              </span>
            </span>
          </div>

          <div v-if="showPost">
            <PostPositive :stmpost="1" />
          </div>
          <ExportTopPostCrad v-show="!showPost" class="mt-3 page-break export-bg" :typeStm="'pos'" id="post-pos"
            ref="captureDiv" />

          <div class="text-left d-block h5 py-3 px-4 mt-3"
            style="background:rgb(247 119 106 / 17%); padding:8px 10px; border-radius:10px; color:rgb(247,119,106)">
            <img src="@/assets/Nag.png" style="width:22px;" />
            <span class="ml-2 text-left">Negative Posts</span>
            <span class="float-right no-print">
              <b-button size="sm" v-if="showPostNeg" class="mx-2" variant="danger"
                @click="showAllPost('neg')">ยกเลิก</b-button>
              <b-button size="sm" v-if="showPostNeg" variant="success"
                @click="showAllPost('neg', 'submit')">ยืนยัน</b-button>
              <span v-else>
                <b-button size="sm" variant="outline-danger" @click="showAllPost('neg')">เลือกโพสต์</b-button>
                <i class="fa fa-refresh mx-2" style="cursor:pointer" aria-hidden="true"
                  @click="forceRerender('neg')"></i>
              </span>
            </span>
          </div>

          <div v-if="showPostNeg">
            <PostPositive :stmpost="-1" />
          </div>
          <ExportTopPostCrad v-show="!showPostNeg" class="my-3 export-bg" :typeStm="'neg'" id="post-neg" />
        </div>
      </div>
    </b-container>

    <div class="h5 text-right px-3 pt-3 mb-8" @click="toDomain" style="cursor:pointer;">
      <span style="background:#ede7dd; padding:2px 10px; border-radius:10px">
        <i class="fa fa-angle-left" aria-hidden="true"></i> กลับ
      </span>
      <span></span>
    </div>
  </span>
</template>

<script>
import PostPositive from "./PostPositive.vue";
import StaticDomain from "@/components/domain/StaticDomain.vue";
import BarChart from "@/components/chart/BarChart.vue";
import pptxgen from "pptxgenjs";
import moment from "moment";
import { mapGetters } from "vuex";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import ExportTopPostCrad from "@/components/domain/ExportTopPostCrad.vue";

// helper: แปลง SVG → PNG (ถ้าจำเป็น)
function svgToPng(svg, width, height, callback) {
  const svgImage = new Image();
  svgImage.src = "data:image/svg+xml," + encodeURIComponent(svg);
  svgImage.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff"; // บังคับพื้นหลังขาว
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(svgImage, 0, 0, width, height);
    const pngData = canvas.toDataURL("image/png");
    callback(pngData);
  };
}

export default {
  components: { ExportTopPostCrad, StaticDomain, BarChart, PostPositive },
  watch: {
    getArrDate(val) { this.dateTH(val[0], val[1]); },
  },
  computed: {
    ...mapGetters([
      "getClickDomain",
      "getSdateDm",
      "getEdateDm",
      "getLoadStat",
      "getArrDate",
      "getWordCloud",
      "getExportTopPostDomainNeg",
      "getExportTopPostDomain",
      "getDataWordcloud"
    ]),
    getHashtag() {
      let hash = [];
      if (
        this.getDataWordcloud &&
        this.getDataWordcloud.hashtags

      ) {
        hash = this.getDataWordcloud.hashtags.slice(0, 10).map((d, k) => ({ ...d, idx: k + 1 }));
      }
      return hash;
    },
  },
  data() {
    return {
      componentKeyNeg: 0,
      componentKey: 0,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      loadding: false,
      open: false,
      startd: "",
      endd: "",
      imgData1: "",
      imgData2: "",
      imgData3: "",
      imgData4: "",
      imgData5: "",
      selectedPost: [],
      showPost: false,
      showPostNeg: false,
    };
  },
  methods: {
    forceRerender(type) {
      if (type === "pos") this.componentKey += 1;
      else this.componentKeyNeg += 1;
    },
    showAllPost(type, data) {
      if (type === "pos") this.showPost = !this.showPost;
      else this.showPostNeg = !this.showPostNeg;
      if (data === "submit") this.$emitter.emit("submitCheck", this.selectedPost);
    },
    toDomain() {
      window.dispatchEvent(new Event("resize"));
      this.$store.commit("setShowReport", false);
    },
    printWindow() {
      this.$nextTick(() => {
        try { window.print(); } catch (e) { console.log(e); }
      });
    },

    // ✅ html2canvas (พื้นหลังขาว ไม่เทา)
    async captureScreenshot(selector) {
      const element = document.querySelector(selector);
      if (!element) return null;
      try {
        const canvas = await html2canvas(element, {
          backgroundColor: "#ffffff",
          scale: window.devicePixelRatio || 2,
          useCORS: true,
          allowTaint: false,
          logging: false,
          removeContainer: true,
          imageTimeout: 15000,
          onclone: (doc) => {
            // บังคับ bg ขาวในโหนด clone ทุกตัวที่เรา capture
            const el = doc.querySelector(selector);
            if (el) el.style.backgroundColor = "#ffffff";
          },
        });
        return canvas.toDataURL("image/png");
      } catch (error) {
        console.error("Error capturing screenshot:", error);
        return null;
      }
    },

    async captureAndResize(selector, newW, newH) {
      const dataUrl = await this.captureScreenshot(selector);
      if (!dataUrl) return null;
      return await this.resizeImage(dataUrl, newW, newH);
    },

    // ✅ ไม่ reassign พารามิเตอร์
    resizeImage(srcDataUrl, newWidth, newHeight) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = function () {
          let w = newWidth;
          let h = newHeight;
          if (!h && !w) {
            w = img.width; h = img.height;
          } else if (!h) {
            h = (img.height / img.width) * w;
          } else if (!w) {
            w = (img.width / img.height) * h;
          }
          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#ffffff"; // bg ขาว
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/png"));
        };
        img.crossOrigin = "anonymous";
        img.src = srcDataUrl;
      });
    },

    async exportToPowerPoint() {
      this.loadding = true;

      // ✅ จับภาพทั้งหมดพื้นหลังขาว
// #exportContent > div.row.page-break > div:nth-child(2)
      // #statcap > span > div > div.text-left.col-lg-7 > div
      this.imgData1 = await this.captureScreenshot("#exportContent > div.row.page-break > div:nth-child(2)");
      this.imgData2 = await this.captureScreenshot("#statcap > span > div > div.text-left.col-lg-7");
      this.imgData3 = await this.captureScreenshot("#statcap > span > div > div:nth-child(2) > div");
      this.imgData4 = await this.captureScreenshot("#post-pos");
      this.imgData5 = await this.captureScreenshot("#post-neg");

      try {
        const pptx = new pptxgen();


        const slide1 = pptx.addSlide();

        slide1.addText(`ด้าน${this.getClickDomain}`, {
          x: 0.5, y: 0, w: "80%", h: 1, fontSize: 25, color: "363636", bold: true, fontFace: "TH Sarabun New",
        });
        slide1.addText(`ข้อมูลระหว่าง ${this.startd} - ${this.endd}`, {
          x: 0.5, y: 0.4, w: "80%", h: 1, fontSize: 20, color: "363636", bold: true, fontFace: "TH Sarabun New",
        });
        slide1.addShape(pptx.shapes.LINE, { x: 0.5, y: 0.7, w: 9, h: 0, line: "000000" });

        if (this.imgData2) slide1.addImage({ data: this.imgData2, x: 0.7, y: 2, w: 4.5, h: 1.6 });
        if (this.imgData3) slide1.addImage({ data: this.imgData3, x: 5.4, y: 2, w: 3.4, h: 1.4 });


        const slide = pptx.addSlide();

        slide.addText(`ด้าน${this.getClickDomain}`, {
          x: 0.5, y: 0, w: "80%", h: 1, fontSize: 25, color: "363636", bold: true, fontFace: "TH Sarabun New",
        });
        slide.addText(`ข้อมูลระหว่าง ${this.startd} - ${this.endd}`, {
          x: 0.5, y: 0.4, w: "80%", h: 1, fontSize: 20, color: "363636", bold: true, fontFace: "TH Sarabun New",
        });
        slide.addShape(pptx.shapes.LINE, { x: 0.5, y: 0.7, w: 9, h: 0, line: "000000" });

        if (this.imgData1) slide.addImage({ data: this.imgData1, x: 0.5, y: 1.3, w: 4, h: 4 });
        // if (this.imgData2) slide.addImage({ data: this.imgData2, x: 3.5, y: 1.4, w: 3.5, h: 1.4 });
        // if (this.imgData3) slide.addImage({ data: this.imgData3, x: 3.5, y: 3.4, w: 3.5, h: 1.2 });

        slide.addText(`Top 10 Hashtag`, { x: 6, y: 0.6, w: "60%", h: 1, fontSize: 22, color: "363636", bold: true, fontFace: "TH Sarabun New" });
        let y1 = 1.2;
        this.getHashtag.forEach((t, idx) => {
          slide.addText(`${idx + 1}. ${t.name}`, { x: 6, y: y1, w: "50%", h: 0.5, fontSize: 18, color: "363636", fontFace: "TH Sarabun New" });
          y1 += 0.35;
        });

        // Slide 2: บวก
        const slide2 = pptx.addSlide();
        slide2.addText(`ด้าน${this.getClickDomain} / เชิงบวก`, { x: 0.5, y: 0, w: "80%", h: 1, fontSize: 25, color: "363636", bold: true, fontFace: "TH Sarabun New" });
        slide2.addShape(pptx.shapes.LINE, { x: 0.5, y: 0.7, w: 9, h: 0, line: "000000" });
        if (this.imgData4) slide2.addImage({ data: this.imgData4, x: 0.4, y: 0.5, sizing: { type: "contain", w: 4.2, h: 5 } });

        slide2.addText(`ที่มา`, { x: 5.1, y: 0.7, w: "80%", h: 1, fontSize: 22, color: "363636", bold: true, fontFace: "TH Sarabun New" });
        let y2 = 1.5;
        this.getExportTopPostDomain.forEach((x, index) => {
          slide2.addText(`${index + 1} link : ${decodeURI(x.url_post)}`, { x: 5, y: y2, w: "50%", h: 0.5, fontSize: 13, color: "363636", fontFace: "TH Sarabun New" });
          y2 += 0.3;
          if (x.photos && x.source !== "instagram") {
            if (Array.isArray(x.photos)) {
              x.photos.forEach((img, idx) => {
                if (img) {
                  slide2.addText(`${idx + 1}.) ที่มารูป : ${img}`, { x: 5, y: y2, w: "90%", h: 0.5, fontSize: 11, color: "363636", fontFace: "TH Sarabun New" });
                  y2 += 0.2;
                }
              });
            } else {
              slide2.addText(`1.) ที่มารูป : ${x.photos}`, { x: 5.2, y: y2, w: "90%", h: 0.5, fontSize: 11, color: "363636", fontFace: "TH Sarabun New" });
              y2 += 0.3;
            }
          }
          y2 += 0.5;
        });

        // Slide 3: ลบ (✅ แก้ตัวแปร yCoordinate)
        const slide3 = pptx.addSlide();
        slide3.addText(`ด้าน${this.getClickDomain} / เชิงลบ`, { x: 0.5, y: 0, w: "80%", h: 1, fontSize: 25, color: "363636", bold: true, fontFace: "TH Sarabun New" });
        slide3.addShape(pptx.shapes.LINE, { x: 0.5, y: 0.7, w: 9, h: 0, line: "000000" });
        if (this.imgData5) slide3.addImage({ data: this.imgData5, x: 0.4, y: 0.5, sizing: { type: "contain", w: 4.2, h: 5 } });

        slide3.addText(`ที่มา`, { x: 5.1, y: 0.7, w: "80%", h: 1, fontSize: 22, color: "363636", bold: true, fontFace: "TH Sarabun New" });
        let y3 = 1.5;
        this.getExportTopPostDomainNeg.forEach((x, index) => {
          slide3.addText(`${index + 1} link : ${decodeURI(x.url_post)}`, { x: 5, y: y3, w: "50%", h: 0.5, fontSize: 13, color: "363636", fontFace: "TH Sarabun New" });
          y3 += 0.3;
          if (x.photos && x.source !== "instagram") {
            if (Array.isArray(x.photos)) {
              x.photos.forEach((img, idx) => {
                if (img) {
                  slide3.addText(`${idx + 1}.) ที่มารูป : ${img}`, { x: 5.2, y: y3, w: "90%", h: 0.5, fontSize: 11, color: "363636", fontFace: "TH Sarabun New" });
                  y3 += 0.2;
                }
              });
            } else {
              slide3.addText(`1.) ที่มารูป : ${x.photos}`, { x: 5.2, y: y3, w: "90%", h: 0.5, fontSize: 11, color: "363636", fontFace: "TH Sarabun New" });
              y3 += 0.3;
            }
          }
          y3 += 0.5;
        });

        const filename = `ด้าน${this.getClickDomain} ${this.startd} - ${this.endd}.pptx`;
        await pptx.writeFile(filename);
      } catch (error) {
        console.error("Error exporting to PowerPoint:", error);
      } finally {
        this.loadding = false;
      }
    },

    async exportFile() {
      this.loadding = true;

      // ✅ จับภาพแบบพื้นหลังขาวและปรับขนาดพอดี Word
      this.imgData1 = await this.captureAndResize("#statbar", null, 300);
      this.imgData2 = await this.captureAndResize("#statcap > span > div > div.text-left.col-lg-7 > div", 300, null);
      this.imgData3 = await this.captureAndResize("#statcap > span > div > div:nth-child(2) > div", 340, null);
      this.imgData4 = await this.captureAndResize("#post-pos", null, 500);
      this.imgData5 = await this.captureAndResize("#post-neg", null, 500);

      await this.delay(200);

      await this.Export2Word(
        "exportContent",
        `Report ${this.getClickDomain} ${this.startd} - ${this.endd}`
      );

      this.loadding = false;
    },

    async Export2Word(element, filename = "") {
      // ✅ สร้าง HTML ที่ Word เปิดได้แน่ (MIME/namespace ครบ) + พื้นหลังขาว
      const container = document.createElement("div");
      container.style.backgroundColor = "#ffffff";
      container.style.padding = "0 8px";

      const title = document.createElement("div");
      title.textContent = "ด้าน" + this.getClickDomain;
      Object.assign(title.style, { fontWeight: "bold", fontSize: "30px", fontFamily: "'TH Sarabun New', sans-serif" });
      container.appendChild(title);

      const hr1 = document.createElement("hr");
      hr1.style.border = "3px solid #000000";
      container.appendChild(hr1);

      const dateEl = document.createElement("div");
      dateEl.textContent = `ข้อมูลระหว่าง ${this.startd} - ${this.endd}`;
      Object.assign(dateEl.style, {
        fontWeight: "bold", fontSize: "22px", fontFamily: "'TH Sarabun New', sans-serif", marginBottom: "25px",
      });
      container.appendChild(dateEl);

      const addImg = (dataUrl, css = {}) => {
        if (!dataUrl) return;
        const img = document.createElement("img");
        img.src = dataUrl;
        Object.assign(img.style, css);
        container.appendChild(img);
      };

      addImg(this.imgData2, { width: "100%", height: "auto" });
      addImg(this.imgData3, { width: "280px", height: "auto", marginTop: "10px" });
      addImg(this.imgData1, { width: "300px", height: "auto", marginLeft: "10px" });

      const h10 = document.createElement("div");
      h10.textContent = "TOP 10 #Hashtag";
      Object.assign(h10.style, { fontWeight: "bold", fontSize: "25px", fontFamily: "'TH Sarabun New', sans-serif", marginTop: "12px" });
      container.appendChild(h10);

      // ตาราง 2 คอลัมน์
      const hashtags = this.getHashtag.map((x) => x.name);
      const left = hashtags.slice(0, 5);
      const right = hashtags.slice(5, 10);

      const table = document.createElement("table");
      table.style.width = "100%";
      table.style.fontSize = "22px";
      table.style.fontFamily = "'TH Sarabun New', sans-serif";
      table.style.borderCollapse = "collapse";
      for (let i = 0; i < 5; i++) {
        const row = table.insertRow();
        const c1 = row.insertCell(0);
        c1.style.padding = "2px 8px";
        c1.textContent = left[i] ? `${i + 1}. ${left[i]}` : "";

        const c2 = row.insertCell(1);
        c2.style.padding = "2px 8px";
        c2.textContent = right[i] ? `${i + 6}. ${right[i]}` : "";
      }
      container.appendChild(table);

      // page break
      const brk1 = document.createElement("div");
      brk1.style.pageBreakBefore = "always";
      container.appendChild(brk1);

      // เชิงบวก
      const posHead = document.createElement("div");
      posHead.textContent = `ด้าน${this.getClickDomain} / เชิงบวก`;
      Object.assign(posHead.style, { fontWeight: "bold", fontSize: "30px", marginTop: "20px", fontFamily: "'TH Sarabun New', sans-serif" });
      container.appendChild(posHead);

      const hr2 = document.createElement("hr");
      hr2.style.border = "3px solid #000000";
      hr2.style.marginBottom = "20px";
      container.appendChild(hr2);

      addImg(this.imgData4, { width: "450px", height: "auto" });

      this.getExportTopPostDomain.forEach((x, i) => {
        const pb = document.createElement("div");
        pb.style.pageBreakBefore = "always";
        container.appendChild(pb);

        const url = document.createElement("div");
        url.textContent = `${i + 1}. URL : ${decodeURI(x.url_post)}`;
        Object.assign(url.style, { fontSize: "22px", fontFamily: "'TH Sarabun New', sans-serif" });
        container.appendChild(url);

        if (x.photos && x.source !== "instagram") {
          if (Array.isArray(x.photos)) {
            x.photos.forEach((img, idx) => {
              const urlImg = document.createElement("div");
              urlImg.textContent = `${idx + 1}). ที่มารูป : ${img}`;
              Object.assign(urlImg.style, { fontSize: "17px", marginLeft: "20px", fontFamily: "'TH Sarabun New', sans-serif" });
              container.appendChild(urlImg);
            });
          } else {
            const urlImg = document.createElement("div");
            urlImg.textContent = `1). ที่มารูป : ${x.photos}`;
            Object.assign(urlImg.style, { fontSize: "17px", marginLeft: "20px", fontFamily: "'TH Sarabun New', sans-serif" });
            container.appendChild(urlImg);
          }
        }
      });

      // page break
      const brk2 = document.createElement("div");
      brk2.style.pageBreakBefore = "always";
      container.appendChild(brk2);

      // เชิงลบ
      const negHead = document.createElement("div");
      negHead.textContent = `ด้าน${this.getClickDomain} / เชิงลบ`;
      Object.assign(negHead.style, { fontWeight: "bold", fontSize: "30px", marginTop: "20px", fontFamily: "'TH Sarabun New', sans-serif" });
      container.appendChild(negHead);

      const hr3 = document.createElement("hr");
      hr3.style.border = "3px solid #000000";
      hr3.style.marginBottom = "20px";
      container.appendChild(hr3);

      addImg(this.imgData5, { width: "450px", height: "auto" });

      this.getExportTopPostDomainNeg.forEach((x, i) => {
        const pb = document.createElement("div");
        pb.style.pageBreakBefore = "always";
        container.appendChild(pb);

        const url = document.createElement("div");
        url.textContent = `${i + 1}. URL : ${decodeURI(x.url_post)}`;
        Object.assign(url.style, { fontSize: "22px", fontFamily: "'TH Sarabun New', sans-serif" });
        container.appendChild(url);

        if (x.photos && x.source !== "instagram") {
          if (Array.isArray(x.photos)) {
            x.photos.forEach((img, idx) => {
              const urlImg = document.createElement("div");
              urlImg.textContent = `${idx + 1}). ที่มารูป : ${img}`;
              Object.assign(urlImg.style, { fontSize: "17px", marginLeft: "20px", fontFamily: "'TH Sarabun New', sans-serif" });
              container.appendChild(urlImg);
            });
          } else {
            const urlImg = document.createElement("div");
            urlImg.textContent = `1). ที่มารูป : ${x.photos}`;
            Object.assign(urlImg.style, { fontSize: "17px", marginLeft: "20px", fontFamily: "'TH Sarabun New', sans-serif" });
            container.appendChild(urlImg);
          }
        }
      });

      const preHtml =
        "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
        "xmlns:w='urn:schemas-microsoft-com:office:word' " +
        "xmlns='http://www.w3.org/TR/REC-html40'>" +
        "<head><meta charset='utf-8'><title>Export HTML To Doc</title>" +
        "<style>body{font-size:16px;background:#ffffff;} .h1{font-size:24px;} img{max-width:100%;} @page {size: A4; margin: 20mm;} </style>" +
        "</head><body>";
      const postHtml = "</body></html>";
      const html = preHtml + container.innerHTML + postHtml;

      const blob = new Blob(["\ufeff", html], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const dl = document.createElement("a");
      dl.href = url;
      dl.download = (filename ? filename : "document") + ".doc";
      document.body.appendChild(dl);
      dl.click();
      document.body.removeChild(dl);
      URL.revokeObjectURL(url);
    },

    delay(ms) { return new Promise((r) => setTimeout(r, ms)); },

    dateTH(s, e) {
      moment.locale("th");
      this.startd = moment(s).format("ll");
      this.endd = moment(e).format("ll");
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    },
  },
  mounted() {
    this.dateTH(new Date(), new Date());
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style scoped>
@media only screen and (min-width: 0px) and (max-width: 760px) {
  .posts>.h5 {
    font-size: 14px !important;
  }
}
</style>

<style>
/* ปุ่ม export */
.d-down .btn-secondary {
  background-color: #4c412d !important;
  border-color: #4c412d !important;
}

/* ✅ บังคับพื้นหลังขาวทุกส่วนที่จะ capture */
.export-bg {
  background-color: #ffffff !important;
}

/* ✅ ให้พิมพ์สีตรงกับจอ */
@media print {
  .print-text.d-none {
    display: inline;
  }

  .no-print {
    display: none;
  }

  #ex-hashcloud {
    column-count: 2;
  }

  .page-break {
    page-break-after: always;
  }

  .progress {
    background-image: none;
    -webkit-print-color-adjust: exact;
    box-shadow: inset 0 0;
    -webkit-box-shadow: inset 0 0;
  }
}

/* ✅ ช่วยเรื่องสีเวลาสร้างภาพ/พิมพ์ */
* {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
</style>
