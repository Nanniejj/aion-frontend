<template>
  <span>
    <!-- <i
      @click="open = true"
      class="fas fa-file-export"
      style="font-size:25px;margin-right:7px;"
      v-b-tooltip.hover
      title="Export Report"
    ></i> -->

    <div
      class="h5 text-right px-3 pt-3 no-print"
      @click="toDomain"
      style="cursor:pointer;"
    >
      <span
        style="background: #ede7dd;
    padding: 2px 10px;
    border-radius: 10px"
      >
        <i class="fa fa-angle-left" aria-hidden="true"></i> กลับ</span
      >
      <span></span>
    </div>
    <!-- <button @click="exportFile">Export2Word</button>
    <button @click="generateDocx1">Generate .docx file</button>
    <button @click="captureWebpage">captureWebpage</button>
    <b-button @click="exportToDocx">exportToDocx</b-button>
    <button @click="selectPic">Capture StaticDomain</button>
    <b-button @click="exportToPowerPoint">Export to PowerPoint</b-button>
    <button @click="captureScreenshot">cap</button> -->

    <b-container>
      <div id="exportContent">
        <div class="h2 ex-title text-left mt-4">
          ด้าน{{ getClickDomain }}
          <span class="float-right no-print">
            <!-- <b-spinner small="true" variant="primary" class=""></b-spinner> -->
            <vue-element-loading
              :active="loadding"
              size="38"
              background-color="rgba(255, 255, 255, 0.5)"
              color="#fed16e"/>
            <!-- <b-icon icon="download" aria-hidden="true"></b-icon> -->

            <b-dropdown size="sm" class="d-down" variant="secondary" style="">
              <template #button-content>
                <i
                  class="fas fa-file-download"
                  style="font-size:20px;margin-right:7px;cursor: pointer"
                  v-b-tooltip.hover
                  title="Export Report"
                ></i>
                Export
              </template>
              <b-dropdown-item @click="exportFile">
                <i
                  class="fas fa-file-word"
                  style="font-size:18px;margin-right:7px;cursor: pointer"
                  v-b-tooltip.hover
                  title="Export Report"
                ></i
                >Word</b-dropdown-item
              >
              <b-dropdown-item @click="exportToPowerPoint">
                <i
                  class="fas fa-file-powerpoint"
                  style="font-size:18px;margin-right:7px;cursor: pointer"
                  v-b-tooltip.hover
                  title="Export Report"
                ></i
                >Powerpoint</b-dropdown-item
              >
            </b-dropdown>

            <span class="">
              <!-- <i
                class="fas fa-file-export"
                style="font-size:25px;margin-right:7px;cursor: pointer"
                v-b-tooltip.hover
                title="Export Report"
              ></i> -->

              <!-- <i
                @click="exportFile"
                class="fas fa-file-word"
                style="font-size:22px;margin-right:7px;cursor: pointer"
                v-b-tooltip.hover
                title="Export Report"
              ></i> -->
              <!-- <i
                @click="exportToPowerPoint"
                class="fas fa-file-powerpoint"
                style="font-size:22px;margin-right:7px;cursor: pointer"
                v-b-tooltip.hover
                title="Export Report"
              ></i> -->
            </span>
            <i
              class="fas fa-print fa-2x d-inline ml-2 mr-2"
              style="font-size:25px;margin-right:7px;cursor: pointer"
              @click="printWindow()"
            ></i
          ></span>
        </div>
        <hr class="pa-5 ma-5 " id="ex-line" />
        <div id="ex-date" class="text-left">
          ข้อมูลระหว่าง {{ startd }} - {{ endd }}
        </div>
        <b-row class="page-break">
          <b-col cols="12">
            <StaticDomain class="mt-3" id="statcap" />
          </b-col>
          <b-col cols="12" md="6"><BarChart id="statbar"/></b-col>
          <b-col cols="12" md="6">
            <div id="ex-hashcloud">
              <div class="h5 mt-3 bold text-left">TOP 10 #Hashtag</div>
              <div
                v-for="(hash, k) in getHashtag"
                :key="k"
                class="pl-3 py-2 text-left"
              >
                {{ k + 1 }} . {{ hash.name }}
              </div>
            </div>
          </b-col>
        </b-row>
        <div class="posts">
          <div
            class="text-left h5 my-2 px-4 "
            style="background: #cfe7de8a;padding: 8px 10px;border-radius: 10px;color:rgb(84, 198, 157)"
          >
            <img src="@/assets/Pos.png" style="width:22px;" />
            <span class="ml-2"> Positive Posts</span>
          </div>

          <ExportTopPostCrad
            class="mt-3 page-break"
            :typeStm="'pos'"
            id="post-pos"
            ref="captureDiv"
          />
          <div
            class="text-left h5 my-3 px-4  mt-4 "
            style="background:rgb(247 119 106 / 17%);padding: 8px 10px;
    border-radius: 10px;
    color:rgb(247, 119, 106)"
          >
            <img src="@/assets/Nag.png" style="width:22px;" />
            <span class="ml-3">Negative Posts</span>
          </div>
          <ExportTopPostCrad class="my-3" :typeStm="'neg'" id="post-neg" />
        </div>
      </div>
    </b-container>
    <div
      class="h5 text-right px-3 pt-3 mb-8"
      @click="toDomain"
      style="cursor:pointer;"
    >
      <span
        style="background: #ede7dd;
    padding: 2px 10px;
    border-radius: 10px"
      >
        <i class="fa fa-angle-left" aria-hidden="true"></i> กลับ</span
      >
      <span></span>
    </div>
    <!-- </vue-modaltor> -->
  </span>
</template>

<script>
import StaticDomain from "@/components/domain/StaticDomain.vue";
import BarChart from "@/components/chart/BarChart.vue";
import pptxgen from "pptxgenjs";
import moment from "moment";
import { mapGetters } from "vuex";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import PizZipUtils from "pizzip/utils/index.js";
import ImageModule from "docxtemplater-image-module-free";
import ExportTopPostCrad from "@/components/domain/ExportTopPostCrad.vue";
// import StaticDomain from "@/components/domain/StaticDomain.vue";
// import ImageModule from "docxtemplater-image-module";
import { Document, Packer, Paragraph, TextRun, Styles } from "docx";

import html2canvas from "html2canvas";
function svgToPng(svg, width, height, callback) {
  // Create an image element and set its source to the SVG data
  const svgImage = new Image();
  svgImage.src = "data:image/svg+xml," + encodeURIComponent(svg);

  // Wait for the image to load
  svgImage.onload = function() {
    // Create a canvas element with the specified dimensions
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    // Draw the SVG image onto the canvas
    const canvasContext = canvas.getContext("2d");
    canvasContext.drawImage(svgImage, 0, 0, width, height);

    // Get the PNG data URL from the canvas
    const pngData = canvas.toDataURL("image/png");

    // Invoke the callback with the PNG data URL
    callback(pngData);
  };
}
export default {
  components: {
    ExportTopPostCrad,
    StaticDomain,
    BarChart,
    // StaticDomain,
  },
  watch: {
    getArrDate(val) {
      this.dateTH(val[0], val[1]);
    },
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
    ]),
    getHashtag() {
      let hash = [];
      if (
        this.getWordCloud &&
        this.getWordCloud.data &&
        this.getWordCloud.data.hashtag &&
        this.getWordCloud.data.hashtag.data
      ) {
        hash = this.getWordCloud.data.hashtag.data.slice(0, 10);
        hash.map((data, k) => {
          data.idx = k + 1;
        });
      }
      return hash;
    },
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      loadding: false,
      open: false,
      pngImage1: null,
      pngImage2: null,
      pngImage3: null,
      startd: "",
      endd: "",
      imgData1: "",
      imgData2: "",
      imgData3: "",
      imgData4: "",
      imgData5: "",
    };
  },

  methods: {
    async captureWebpage() {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const video = document.createElement("video");

      try {
        const captureStream = await navigator.mediaDevices.getDisplayMedia();
        video.srcObject = captureStream;
        context.drawImage(video, 0, 0, window.width, window.height);
        const frame = canvas.toDataURL("image/png");
        captureStream.getTracks().forEach((track) => track.stop());
        window.location.href = frame;
      } catch (err) {
        console.error("Error: " + err);
      }
    },
    toDomain() {
      //แก้ apex chart ไม่ขึ้น
      window.dispatchEvent(new Event("resize"));
      this.$store.commit("setShowReport", false);
    },

    printWindow: function() {
      this.$nextTick(() => {
        try {
          window.print();
        } catch (err) {
          console.log(err);
        }
      });
    },
    async captureAndResize(el, w, h) {
      const captureDiv = document.querySelector(el);

      const canvas = await html2canvas(captureDiv);
      const dataUrl = canvas.toDataURL(); // This is the base64-encoded image

      // Resize the image as needed
      return await this.resizeImage(dataUrl, w, h);

      // Now you can use the resizedImage as needed
    },
    resizeImage(dataUrl, newWidth, newHeight) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
          if (!newHeight && !newWidth) {
        // If both newHeight and newWidth are not provided, use the original size
        newWidth = img.width;
        newHeight = img.height;
      } else if (!newHeight) {
        // Calculate the new height to maintain the aspect ratio
        newHeight = (img.height / img.width) * newWidth;
      } else if (!newWidth) {
        // Calculate the new width to maintain the aspect ratio
        newWidth = (img.width / img.height) * newHeight;
      }
          const canvas = document.createElement("canvas");
          canvas.width = newWidth;
          canvas.height = newHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          dataUrl =canvas.toDataURL()
          resolve(canvas.toDataURL());
        };
        return (img.src = dataUrl);
      });
    },

    hideModal() {
      this.open = false;
    },
    async captureScreenshot(el) {
      console.log("eleeeeee", el);
      const element = document.querySelector(el);
      try {
        const canvas = await html2canvas(element, {
          logging: true,
          letterRendering: 1,
          allowTaint: true,
          useCORS: true,
          onrendered: function(canvas) {
            return canvas.toDataURL("image/png");
          },
        });
        return canvas.toDataURL("image/png");
      } catch (error) {
        console.error("Error capturing screenshot:", error);
        return null; // หรือให้คืนค่าที่ต้องการในกรณีเกิดข้อผิดพลาด
      }
    },
    async exportToPowerPoint() {
      this.loadding = true;
      // this.selectPic();
      // this.open = true;
      this.imgData1 = await this.captureScreenshot("#statbar > span > div");
      this.imgData2 = await this.captureScreenshot(
        "#statcap > span > div > div.text-left.col-lg-6 > div"
      );
      this.imgData3 = await this.captureScreenshot(
        "#statcap > span > div > div:nth-child(2) > div"
      );

      this.imgData4 = await this.captureScreenshot("#post-pos");
      this.imgData5 = await this.captureScreenshot("#post-neg");
      // console.log(this.imgData2);
      try {
        // ตั้งค่าเวลาที่รอ (milliseconds)
        const delayTime = 1000;

        // รอให้ selectPic() เสร็จสิ้น
        await this.delay(delayTime);

        // สร้าง presentation
        const pptx = new pptxgen();

        // เพิ่ม slide
        const slide = pptx.addSlide();

        // เพิ่มข้อความลงใน slide
        slide.addText(`ด้าน${this.getClickDomain}`, {
          x: 0.5,
          y: 0,
          w: "80%",
          h: 1,
          fontSize: 25,
          color: "363636",
          bold: true,
          fontFace: "TH Sarabun New",
        });

        // เพิ่มรูปภาพลงใน slide
        slide.addImage({ data: this.imgData1, x: 0.5, y: 1.5, w: 3, h: 3 });
        slide.addImage({ data: this.imgData2, x: 3.5, y: 1.4, w: 3.5, h: 1.4 });
        slide.addImage({ data: this.imgData3, x: 3.5, y: 3.4, w: 3.5, h: 1.2 });
        slide.addText(`ข้อมูลระหว่าง ${this.startd} - ${this.endd}`, {
          x: 0.5,
          y: 0.4,
          w: "80%",
          h: 1,
          fontSize: 20,
          color: "363636",
          bold: true,
          fontFace: "TH Sarabun New",
        });
        slide.addShape(pptx.shapes.LINE, {
          x: 0.5, // ตำแหน่ง X ของ line
          y: 0.7, // ตำแหน่ง Y ของ line
          w: 9, // ความกว้างของ line
          h: 0, // ความสูงของ line (0 เพื่อให้เป็นเส้นตรง)
          line: "000000", // สีของ line (รหัสสี Hex)
        });

        slide.addText(`Top 10 Hashtag`, {
          x: 7,
          y: 0.6,
          w: "60%",
          h: 1,
          fontSize: 22,
          color: "363636",
          bold: true,
          fontFace: "TH Sarabun New",
        });

        let yCoordinate = 1.2;
        this.getHashtag.forEach((text, index) => {
          slide.addText((index+1)+". " +text.name, {
            x: 7,
            y: yCoordinate, // You may need to adjust the y-coordinate based on your layout
            w: "50%",
            h: 0.5,
            fontSize: 18,
            color: "363636",
            fontFace: "TH Sarabun New",
          });
          yCoordinate += 0.35;
        });

        // -----------------------------------------S2-------------------------------------------

        const slide2 = pptx.addSlide();
        slide2.addText(`ด้าน${this.getClickDomain} / เชิงบวก`, {
          x: 0.5,
          y: 0,
          w: "80%",
          h: 1,
          fontSize: 25,
          color: "363636",
          bold: true,
          fontFace: "TH Sarabun New",
        });
        slide2.addShape(pptx.shapes.LINE, {
          x: 0.5, // ตำแหน่ง X ของ line
          y: 0.7, // ตำแหน่ง Y ของ line
          w: 9, // ความกว้างของ line
          h: 0, // ความสูงของ line (0 เพื่อให้เป็นเส้นตรง)
          line: "000000", // สีของ line (รหัสสี Hex)
        });
        slide2.addImage({
          data: this.imgData4,
          x: 0.4,
          y: 0.5,
          sizing: { type: "contain", w: 4.2, h: 5 },
        });
        // let post1 = this.getExportTopPostDomain[0];
        // slide2.addImage({
        //   data: post1.profile_image,
        //   x: 0.5,
        //   y: 1,
        //   w: 1,
        //   h: 1,
        // });
        // slide2.addText(post1.account_name, {
        //   x: 0.5,
        //   y: 1, // You may need to adjust the y-coordinate based on your layout
        //   w: "90%",
        //   h: 0.5,
        //   fontSize: 15,
        //   color: "363636",
        //   fontFace: "TH Sarabun New",
        // });

        // slide2.addText(post1.date, {
        //   x: 0.5,
        //   y: 1.2, // You may need to adjust the y-coordinate based on your layout
        //   w: "90%",
        //   h: 0.5,
        //   fontSize: 12,
        //   color: "363636",
        //   fontFace: "TH Sarabun New",
        // });
        // slide2.addText(post1.full_text, {
        //   x: 0.5,
        //   y: 2,
        //   w: "90%",
        //   h: 2,
        //   fontSize: 14,
        //   color: "363636",
        //   fontFace: "TH Sarabun New",
        //   wordWrap: false
        // });
        slide2.addText(`ที่มา`, {
          x: 5.1,
          y: 0.7,
          w: "80%",
          h: 1,
          fontSize: 22,
          color: "363636",
          bold: true,
          fontFace: "TH Sarabun New",
        });
        let yCoordinate2 = 1.5;
        this.getExportTopPostDomain.forEach((text, index) => {
          slide2.addText(index + 1 + " link : " + text.url_post, {
            x: 5.2,
            y: yCoordinate2, // You may need to adjust the y-coordinate based on your layout
            w: "90%",
            h: 0.5,
            fontSize: 15,
            color: "363636",
            fontFace: "TH Sarabun New",
          });
          yCoordinate2 += 0.7;
        });

        // -----------------------------------------S3-------------------------------------------

        const slide3 = pptx.addSlide();
        slide3.addText(`ด้าน${this.getClickDomain} / เชิงลบ`, {
          x: 0.5,
          y: 0,
          w: "80%",
          h: 1,
          fontSize: 25,
          color: "363636",
          bold: true,
          fontFace: "TH Sarabun New",
        });
        slide3.addShape(pptx.shapes.LINE, {
          x: 0.5, // ตำแหน่ง X ของ line
          y: 0.7, // ตำแหน่ง Y ของ line
          w: 9, // ความกว้างของ line
          h: 0, // ความสูงของ line (0 เพื่อให้เป็นเส้นตรง)
          line: "000000", // สีของ line (รหัสสี Hex)
        });
        slide3.addImage({
          data: this.imgData5,
          x: 0.4,
          y: 0.5,
          sizing: { type: "contain", w: 4.2, h: 5 },
        });

        slide3.addText(`ที่มา`, {
          x: 5.1,
          y: 0.7,
          w: "80%",
          h: 1,
          fontSize: 22,
          color: "363636",
          bold: true,
          fontFace: "TH Sarabun New",
        });
        let yCoordinate3 = 1.5;
        this.getExportTopPostDomainNeg.forEach((text, index) => {
          slide3.addText(index + 1 + " link : " + text.url_post, {
            x: 5.2,
            y: yCoordinate3, // You may need to adjust the y-coordinate based on your layout
            w: "90%",
            h: 0.5,
            fontSize: 15,
            color: "363636",
            fontFace: "TH Sarabun New",
          });
          yCoordinate3 += 0.7;
        });

        // กำหนดชื่อไฟล์ PowerPoint
        const filename = `ด้าน${this.getClickDomain} ${this.startd} - ${this.endd}.pptx`;

        // Save ไฟล์ PowerPoint
        pptx.writeFile(filename);
        this.loadding = false;
        console.log("PowerPoint exported successfully!");
      } catch (error) {
        console.error("Error exporting to PowerPoint:", error);
      }
    },
    generateDocument() {
      console.log("dov1");
      let doc = new Document();
      console.log("dov", doc);
      // Add content to the document
      doc.addSection({
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun("Hello, World!")],
          }),
        ],
      });

      // Save the document
      Packer.toBuffer(doc).then((buffer) => {
        saveAs(new Blob([buffer]), "template.docx");
        // 'buffer' is a Buffer containing the generated document
        // You can save it to a file or handle it as needed.
      });
    },

    selectPic() {
      this.captureStaticDomain("#statcap > span > div", "stat1");
      this.captureStaticDomain("#post-pos", "stat1");
      this.captureStaticDomain(
        "#statcap > span > div > div:nth-child(2) > div",
        "stat2"
      );
      this.captureStaticDomain("#chart > span > div", "stat3");

      return "OK";
    },

    async captureStaticDomain(classSelect, check) {
      try {
        // ในกรณีที่ StaticDomain มี id ให้ใช้ id นั้น .getElementById("statcap");
        const staticDomainElement = document.querySelector(classSelect);
        if (!staticDomainElement) {
          console.error("StaticDomain element not found");
          return;
        }

        // Create a canvas element with the same dimensions as the StaticDomain component
        const canvas = document.createElement("canvas");
        canvas.width = staticDomainElement.offsetWidth;
        canvas.height = staticDomainElement.offsetHeight;
        const canvasContext = canvas.getContext("2d");

        // Set canvas background color to white
        canvasContext.fillStyle = "white";
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the content of StaticDomain onto the canvas
        await html2canvas(staticDomainElement, { canvas: canvas });

        // Get the data URL of the canvas (captured image)
        const staticDomainImage = canvas.toDataURL("image/png");

        return staticDomainImage;
        // console.log("Captured StaticDomain as image:", staticDomainImage);
        // if (check == "stat1") {
        //   this.pngImage1 = staticDomainImage;
        // }
        // if (check == "stat2") {
        //   this.pngImage2 = staticDomainImage;
        // }
        // if (check == "stat3") {
        //   this.pngImage3 = staticDomainImage;
        // }
      } catch (error) {
        console.error("Error capturing StaticDomain:", error);
      }
    },

    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    convertImageToBase64x(imgElement) {
      // Create a canvas to draw the image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set the canvas dimensions to match the image
      // canvas.width = imgElement.width;
      // canvas.height = imgElement.height;

      // // Draw the image onto the canvas
      // ctx.drawImage(imgElement, 0, 0);

      // แก้ขนาดเอง
      canvas.width = 600;
      canvas.height = 200;
      ctx.drawImage(imgElement, 0, 0, 500, 200);

      // Get the Base64-encoded data URI of the image
      const dataURL = canvas.toDataURL("image/png");

      // Clean up: remove the canvas element
      canvas.remove();

      return dataURL;
    },
    async exportFile() {
      this.loadding = true;

      this.imgData1 = await this.captureAndResize(
        "#statbar > span > div",
        null,
        550
      );
      this.imgData2 = await this.captureAndResize(
        "#statcap > span > div > div.text-left.col-lg-6 > div",
        470,
        null
      );
      this.imgData3 = await this.captureAndResize(
        "#statcap > span > div > div:nth-child(2) > div",
        450,
        null
      );

      // this.imgData1 = await this.captureAndResize(
      //   "#statbar > span > div",
      //   350,
      //   350
      // );
      // this.imgData2 = await this.captureAndResize(
      //   "#statcap > span > div > div.text-left.col-lg-6 > div",
      //   340,
      //   140
      // );
      // this.imgData3 = await this.captureAndResize(
      //   "#statcap > span > div > div:nth-child(2) > div",
      //   280,
      //   110
      // );

      this.imgData4 = await this.captureAndResize("#post-pos", null, 600);
      this.imgData5 = await this.captureAndResize("#post-neg", null, 600);
      // console.log(this.imgData2);
      await this.delay(1000);

      await this.Export2Word(
        "exportContent",
        "Report " + this.getClickDomain + " " + this.startd + " - " + this.endd
      );
    },

    async Export2Word(element, filename = "") {
      // await this.selectPic();

      // Clone the content so that changes don't affect the original DOM
      const clonedContent = document.createElement("span");
      const exTitleElement = document.createElement("div");
      exTitleElement.textContent = "ด้าน" + this.getClickDomain;
      exTitleElement.style.fontWeight = "bold";
      exTitleElement.style.fontSize = "30px";
      exTitleElement.style.fontFamily = "'TH Sarabun New', sans-serif";
      clonedContent.appendChild(exTitleElement);
      //Line
      const hrElement = document.createElement("hr");
      hrElement.style.border = "3px solid #000000"; // Adjust the border properties as needed
      clonedContent.appendChild(hrElement);

      //date
      const exDate = document.createElement("div");
      exDate.textContent = " ข้อมูลระหว่าง " + this.startd + " - " + this.endd;
      exDate.style.fontWeight = "bold";
      exDate.style.fontSize = "22px";
      exDate.style.fontFamily = "'TH Sarabun New', sans-serif";
      exDate.style.marginBottom = "25px";
      clonedContent.appendChild(exDate);

      const imgElement2 = document.createElement("img");
      imgElement2.src = this.imgData2;
      imgElement2.style.width = "100% !important";
      imgElement2.style.height = "auto !important";
      clonedContent.appendChild(imgElement2);

      const imgElement3 = document.createElement("img");
      imgElement3.src = this.imgData3;
      imgElement3.style.width = "200px";
      imgElement3.style.height = "200px";
      clonedContent.appendChild(imgElement3);

      const base64Image = this.imgData1; // ดำเนินการดึงรูปภาพ Base64 จากตัวแปร Vue
      const imgElement = document.createElement("img");

      imgElement.src = base64Image;
      imgElement.style.width = "200px";
      imgElement.style.height = "200px";
      clonedContent.appendChild(imgElement);

      const hash10 = document.createElement("div");
      hash10.textContent = "TOP 10 #Hashtag";
      hash10.style.fontWeight = "bold";
      hash10.style.fontSize = "25px";
      hash10.style.fontFamily = "'TH Sarabun New', sans-serif";
    
      clonedContent.appendChild(hash10);

      // List of hashtags
      const hashtags = this.getHashtag.map((x) => x.name);

      const hashtagsPart1 = hashtags.slice(0, Math.ceil(hashtags.length / 2));
      const hashtagsPart2 = hashtags.slice(Math.ceil(hashtags.length / 2));

      // Create the table with rows and cells
      const table = document.createElement("table");
      table.style.width = "100%"; // Set the table width to 100%
      table.style.fontSize = "22px";
      table.style.fontFamily = "'TH Sarabun New', sans-serif";

      // Determine the maximum length of the two parts
      const maxLength = Math.max(hashtagsPart1.length, hashtagsPart2.length);

      // Populate the table with rows and cells
      for (let i = 0; i < maxLength; i++) {
        const row = table.insertRow(); // Create a new table row

        // Create the first cell (column) for the index and first hashtag
        const cell1 = row.insertCell(0);
        if (i < hashtagsPart1.length) {
          cell1.textContent = `${i + 1}. ${hashtagsPart1[i]}`;
        }

        // Create the second cell (column) for the second hashtag
        const cell2 = row.insertCell(1);
        if (i < hashtagsPart2.length) {
          cell2.textContent = `${i + 6}. ${hashtagsPart2[i]}`;
        }
      }
     
      // Append the table to the clonedContent
      clonedContent.appendChild(table);
      const pageBreak = document.createElement("div");
      pageBreak.style.pageBreakBefore = "always";
      clonedContent.appendChild(pageBreak);

      const paragraph2 = document.createElement("p");
      paragraph2.textContent = "";
      clonedContent.appendChild(paragraph2);
      const exTitleElement2 = document.createElement("div");
      exTitleElement2.textContent = "ด้าน" + this.getClickDomain + " / เชิงบวก";
      exTitleElement2.style.fontWeight = "bold";
      exTitleElement2.style.fontSize = "30px";
      exTitleElement2.style.marginTop = "50px";
      exTitleElement2.style.fontFamily = "'TH Sarabun New', sans-serif";
      clonedContent.appendChild(exTitleElement2);
      //Line
      const hrElement2 = document.createElement("hr");
      hrElement2.style.border = "3px solid #000000"; // Adjust the border properties as needed
      hrElement2.style.marginBottom = "40px";
      clonedContent.appendChild(hrElement2);

      const imgElement4 = document.createElement("img");
      imgElement4.src = this.imgData4;
      imgElement4.style.width = "200px";
      imgElement4.style.height = "200px";
      clonedContent.appendChild(imgElement4);

      // const containerDiv = document.createElement("div");
      // containerDiv.style.textAlign = "center"; // Center the content
      // containerDiv.appendChild(imgElement4);
      // clonedContent.appendChild(containerDiv);

      this.getExportTopPostDomain.map((x, i) => {
        const url_post = document.createElement("div");
        url_post.textContent = i + 1 + ". URL : " + x.url_post;
        // url_post.style.fontWeight = "bold";
        url_post.style.fontSize = "22px";
        url_post.style.fontFamily = "'TH Sarabun New', sans-serif";
        url_post.style.pageBreakBefore = "always";
        clonedContent.appendChild(url_post);
      });

      // Append the table to the clonedContent

      const pageBreak2 = document.createElement("div");
      pageBreak2.style.pageBreakBefore = "always";
      clonedContent.appendChild(pageBreak2);

      const paragraph3 = document.createElement("p");
      paragraph3.textContent = "";
      clonedContent.appendChild(paragraph3);

      // const paragraph3 = document.createElement("p");
      // paragraph3.textContent = ".";
      // paragraph3.style.color="white"
      // paragraph3.style.marginTop = "250px";
      // clonedContent.appendChild(paragraph3);

      const exTitleElement3 = document.createElement("div");
      exTitleElement3.textContent = "ด้าน" + this.getClickDomain + " / เชิงลบ";
      exTitleElement3.style.fontWeight = "bold";
      exTitleElement3.style.fontSize = "30px";
      exTitleElement3.style.marginTop = "300px";
      exTitleElement3.style.fontFamily = "'TH Sarabun New', sans-serif";
      clonedContent.appendChild(exTitleElement3);
      //Line
      const hrElement3 = document.createElement("hr");
      hrElement3.style.border = "3px solid #000000"; // Adjust the border properties as needed
      hrElement3.style.marginBottom = "40px";
      clonedContent.appendChild(hrElement3);

      const imgElement5 = document.createElement("img");
      imgElement5.src = this.imgData5;
      imgElement5.style.width = "200px";
      imgElement5.style.height = "200px";
      clonedContent.appendChild(imgElement5);

      this.getExportTopPostDomainNeg.map((x, i) => {
        const url_post2 = document.createElement("div");
        url_post2.textContent = i + 1 + ". URL : " + x.url_post;
        // url_post2.style.fontWeight = "bold";
        url_post2.style.fontSize = "22px";
        url_post2.style.fontFamily = "'TH Sarabun New', sans-serif";
        clonedContent.appendChild(url_post2);
      });

      // Prepare the HTML content
      const preHtml =
        "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title><style>body { font-size: 16px; } .h1 { font-size: 24px; }</style></head><body>";
      const postHtml = "</body></html>";
      const html = preHtml + clonedContent.innerHTML + postHtml;

      // Create a Blob with the HTML content
      const blob = new Blob(["\ufeff", html], {
        type: "application/msword",
      });

      // Specify link url
      const url =
        "data:application/vnd.ms-word;charset=utf-8," +
        encodeURIComponent(html);

      // Specify file name
      filename = filename ? filename + ".doc" : "document.doc";

      // Create download link element
      const downloadLink = document.createElement("a");
      document.body.appendChild(downloadLink);

      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        // Create a link to the file
        downloadLink.href = url;

        // Setting the file name
        downloadLink.download = filename;

        // Triggering the download
        downloadLink.click();
      }

      document.body.removeChild(downloadLink);
      this.loadding = false;
    },
    convertSvgToPng() {
      // Accessing the SVG element using the selector
      const svgElement = document.querySelector("#chart-domain svg");
      console.log("svgElement", svgElement);
      if (!svgElement) {
        console.error("SVG element not found");
        return;
      }

      const svgString = new XMLSerializer().serializeToString(svgElement);

      // Use the provided svgToPng function
      svgToPng(svgString, 650, 300, (imgData) => {
        this.pngImage = imgData;
      });
    },
    convertImageToBase64ex2(imgElement, desiredWidth) {
      console.log("imgElement", imgElement);

      // Calculate the corresponding height based on the desired width and aspect ratio
      const aspectRatio = imgElement.naturalWidth / imgElement.naturalHeight;
      const desiredHeight = Math.round(desiredWidth / aspectRatio);

      // Create a canvas to draw the image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set the canvas dimensions based on the desired width and height
      canvas.width = desiredWidth;
      canvas.height = desiredHeight;

      // Draw the image onto the canvas
      ctx.drawImage(imgElement, 0, 0, desiredWidth, desiredHeight);

      // Get the Base64-encoded data URI of the image
      const dataURL = canvas.toDataURL("image/png");

      // Clean up: remove the canvas element
      canvas.remove();

      return dataURL;
    },

    convertImageToBase64ex(imgElement, desiredHeight) {
      console.log("imgElement", imgElement);

      // Calculate the corresponding width based on the desired height and aspect ratio
      const aspectRatio = imgElement.naturalWidth / imgElement.naturalHeight;
      const desiredWidth = Math.round(desiredHeight * aspectRatio);

      // Create a canvas to draw the image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set the canvas dimensions based on the desired width and height
      canvas.width = desiredWidth;
      canvas.height = desiredHeight;

      // Draw the image onto the canvas
      ctx.drawImage(imgElement, 0, 0, desiredWidth, desiredHeight);

      // Get the Base64-encoded data URI of the image
      const dataURL = canvas.toDataURL("image/png");

      // Clean up: remove the canvas element
      canvas.remove();

      return dataURL;
    },
    loadFile(url, callback) {
      PizZipUtils.getBinaryContent(url, callback);
    },
    generateDocx1() {
      // const clonedContent = document
      //   .getElementById("exportContent")
      //   .cloneNode(true);
      const imageModule = new ImageModule({
        getImage: (tagValue, tagName) => {
          console.log("tagValue", tagValue);
          // The tagValue will contain the base64-encoded image data
          return tagValue;
        },
        getSize: (img, tagValue, tagName) => {
          console.log("img,img", img);
          // You can specify the size of the image here
          return [500, 200];
        },
      });

      this.loadFile("/template.docx", async (error, content) => {
        if (error) {
          throw error;
        }
        // console.log('tagValue',imageModule);
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
          modules: [imageModule],
        });
        // console.log("getExportTopPostDomain", this.getExportTopPostDomain);
        // Set the data for your placeholders
        const data = {
          domain_name: this.getClickDomain,
          start: this.startd,
          end: this.endd,
          hashtags: this.getHashtag,
          // img1: { src: this.pngImage1, width: 500, height: 200 },
          // img2: { src: this.pngImage2, width: 500, height: 200 },
          image: this.pngImage2, // base64
          // img2: this.pngImage2,
          // img3: this.pngImage3,
          stmpos1: this.getExportTopPostDomain,
          stmpos1: this.getExportTopPostDomain[1],
          html1: `<img src="${this.pngImage1}" width="500" height="200" />`, // HTML content for img1
          html2: `<img src="${this.pngImage2}" width="500" height="200" />`, // HTML content for img2
          html3: `<img src="${this.pngImage3}" width="500" height="200" />`, // HTML content for img3
        };
        console.log("data", data);
        doc.setData(data);

        try {
          // Render the document, replacing placeholders with data
          doc.render();
        } catch (error) {
          // Handle rendering errors
          console.error("Error rendering document:", error);
          throw error;
        }

        // Generate a Blob containing the document
        const blob = doc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        // Save the generated document with a specified filename
        saveAs(blob, "output2023.docx");
      });
    },

    convertImageToBase64(imgElement) {
      return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const image = new Image();

        image.crossOrigin = "Anonymous";
        image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0);

          // Get the Base64-encoded data URI of the image
          const dataURL = canvas.toDataURL("image/png");

          // Clean up: remove the canvas element
          canvas.remove();

          resolve(dataURL);
        };

        // Set the source of the image
        image.src = imgElement.src;
      });
    },

    generateDocx3() {
      const docx = require("docx");
      if (docx) {
        console.log("docx", docx);
        const styles = new docx.Styles();
        console.log("style", styles);
        if (styles) {
          styles
            .createParagraphStyle("Heading1", "Heading 1")
            .basedOn("Normal")
            .next("Normal")
            .quickFormat()
            .size(28)
            .bold()
            .italics()
            .spacing({ after: 120 });

          styles
            .createParagraphStyle("Heading2", "Heading 2")
            .basedOn("Normal")
            .next("Normal")
            .quickFormat()
            .size(26)
            .bold()
            .underline("double", "FF0000")
            .spacing({ before: 240, after: 120 });

          styles
            .createParagraphStyle("aside", "Aside")
            .basedOn("Normal")
            .next("Normal")
            .color("999999")
            .italics()
            .indent(720)
            .spacing({ line: 276 });

          styles
            .createParagraphStyle("wellSpaced", "Well Spaced")
            .basedOn("Normal")
            .spacing({
              line: 276,
              before: 20 * 72 * 0.1,
              after: 20 * 72 * 0.05,
            });

          styles
            .createParagraphStyle("ListParagraph", "List Paragraph")
            .quickFormat()
            .basedOn("Normal");

          const numbering = new docx.Numbering();
          const numberedAbstract = numbering.createAbstractNumbering();
          numberedAbstract.createLevel(0, "lowerLetter", "%1)", "left");

          const doc = new docx.Document({
            creator: "Clippy",
            title: "Sample Document",
            description: "A brief example of using docx",
          });

          doc.createParagraph("Test heading1, bold and italicized").heading1();
          doc.createParagraph("Some simple content");
          doc
            .createParagraph("Test heading2 with double red underline")
            .heading2();

          const letterNumbering = numbering.createConcreteNumbering(
            numberedAbstract
          );
          ["Option1", "Option 2", "Option 3"].forEach((opt) =>
            doc.createParagraph(opt).setNumbering(letterNumbering, 0)
          );

          doc
            .createParagraph()
            .createTextRun("Some monospaced content")
            .font("Monospace");

          doc
            .createParagraph("An aside, in light gray italics and indented")
            .style("aside");
          doc
            .createParagraph("This is normal, but well-spaced text")
            .style("wellSpaced");
          doc.createParagraph("This is normal");
        }
      }
      const exporter = new docx.LocalPacker(doc, styles, undefined, numbering);
      exporter.pack("test.docx");
    },

    dateTH(s, e) {
      moment.locale("th");
      this.startd = moment(s).format("ll");
      this.endd = moment(e).format("ll");
    },
    handleResize() {
      // อัพเดตขนาดหน้าต่างเมื่อมีการ resize
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    },
  },
  mounted() {
    this.dateTH(new Date(), new Date());
    console.log("this.handleResize", this.handleResize);
    window.addEventListener("resize", this.handleResize);

    // this.$emitter.on("statstatus", (val) => {
    //   if(val){
    //     console.log('selectpic2',val);
    //     this.selectPic()
    //   }
    // });
  },
  beforeDestroy() {
    // ลบ event listener เมื่อ component ถูกทำลาย
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>
<style>
.d-down .btn-secondary {
  background-color: #4c412d !important;
  border-color: #4c412d !important;
}
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

    .bar {
      background-image: none;
      -webkit-print-color-adjust: exact;
      box-shadow: inset 0 0;
      -webkit-box-shadow: inset 0 0;
    }
  }
}
</style>
