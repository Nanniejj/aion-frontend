<template>
  <b-button
    size="md"
    variant="warning"
    pill
    class="d-inline-flex no-print px-2"
    :disabled="disabled"
    style="font-size: 18px; background-color: #f0ad4e; border-color: #f0ad4e;color: #71570b"
    @click="handlePrint">
    <i class="fas fa-print mr-2"></i>
    <span class="small">พิมพ์</span>
  </b-button>
</template>

<script>
export default {
  name: "PrintButton",

  props: {
    disabled: { type: Boolean, default: false },
    // selector ของ element ที่ต้องการพิมพ์
    targetSelector: { type: String, default: "#content" },
  },

  mounted() {
    this._patchChartViewBox = () => {
      document.querySelectorAll(".apexcharts-svg").forEach((svg) => {
        if (!svg.getAttribute("viewBox")) {
          const w = parseFloat(svg.getAttribute("width"));
          const h = parseFloat(svg.getAttribute("height"));
          if (w && h) {
            svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
          }
        }
      });
    };
  },

  methods: {
    async handlePrint() {
      this.$emit("before-print");

      await this.$nextTick();

      // เปลี่ยนรูป lazy-load ให้โหลดจริงก่อนพิมพ์
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
        img.loading = "eager";
      });

      // เลื่อนหน้าเพื่อบังคับ element ที่ยัง lazy-render (chart, virtual scroll) ให้ render จริง
      await this.forceRenderOffscreenContent();

      // แก้ viewBox ของกราฟ apexcharts ที่ไม่มี viewBox
      this._patchChartViewBox();

      const target = document.querySelector(this.targetSelector);
      if (!target) {
        console.error(`PrintButton: ไม่พบ element ที่ selector "${this.targetSelector}"`);
        this.$emit("after-print");
        return;
      }

      try {
        await this.printViaIframe(target);
      } catch (err) {
        console.error("PrintButton: สร้างหน้าพิมพ์ไม่สำเร็จ", err);
      }

      this.$emit("after-print");
    },

    async printViaIframe(target) {
      // คัดลอก <link rel="stylesheet"> ทั้งหมดของแอปหลัก (Bootstrap, bootstrap-vue, Font Awesome, App.vue, scoped styles ของทุก component)
      // ใช้ el.href (ไม่ใช่ getAttribute) เพื่อให้ได้ URL แบบเต็ม ป้องกันปัญหา relative path ที่ resolve ผิดใน iframe ใหม่
      const linkTags = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .map((el) => `<link rel="stylesheet" href="${el.href}">`)
        .join("\n");

      // คัดลอก <style> ทุกตัวที่ inject โดย vue-loader/webpack ด้วย (เผื่อบางส่วนไม่ได้ extract เป็นไฟล์ .css)
      const styleTags = Array.from(document.querySelectorAll("style"))
        .map((el) => el.outerHTML)
        .join("\n");

      const iframe = document.createElement("iframe");
      iframe.style.cssText =
        "position:fixed;right:0;bottom:0;width:1400px;height:900px;border:0;visibility:hidden;";
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
${linkTags}
${styleTags}
<style>${this.printCss}</style>
</head>
<body>${target.outerHTML}</body>
</html>`);
      doc.close();

      // รอให้ทุก stylesheet ที่เพิ่ง inject โหลดเสร็จก่อนสั่งพิมพ์ (มี fallback timeout กันค้าง)
      const linkEls = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
      const cssReady = Promise.all(
        linkEls.map(
          (link) =>
            new Promise((resolve) => {
              if (link.sheet) return resolve(); // โหลดจาก cache เสร็จแล้ว
              link.addEventListener("load", resolve, { once: true });
              link.addEventListener("error", resolve, { once: true });
            })
        )
      );
      await Promise.race([cssReady, new Promise((resolve) => setTimeout(resolve, 1500))]);
      // รออีกเฟรมสั้นๆ ให้ browser reflow/paint ให้เสร็จก่อนพิมพ์จริง
      await new Promise((resolve) => setTimeout(resolve, 150));

      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      // เคลียร์ iframe ทิ้งหลังพิมพ์ (หน่วงเวลาเผื่อ print dialog ยังไม่ปิด)
      setTimeout(() => {
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      }, 1000);
    },

    async forceRenderOffscreenContent() {
      const originalScrollY = window.scrollY;
      const step = window.innerHeight || 800;
      const max = document.body.scrollHeight;

      for (let y = 0; y < max; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 60));
      }

      window.scrollTo(0, originalScrollY);
      await new Promise((resolve) => setTimeout(resolve, 60));
    },
  },

  computed: {
    printCss() {
      return `
        @page {
          size: A4 landscape;
          margin: 4mm;
        }
        html, body {
          height: auto !important;
          overflow: visible !important;
        }
        .no-print {
          display: none !important;
        }
        .summary-card {
          border: none !important;
          box-shadow: none !important;
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
        .card-body-scroll {
          max-height: none !important;
          overflow: visible !important;
        }
        .slider {
          overflow-x: visible !important;
          width: 100% !important;
        }
        .box-flex-small {
          display: grid !important;
          grid-template-columns: repeat(5, 200px) !important;
          grid-template-rows: repeat(2, auto) !important;
          justify-content: center !important;
          gap: 10px !important;
          width: 100% !important;
          padding: 0 !important;
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
        .slider-item {
          width: 200px !important;
        }
        .apexcharts-canvas,
        .apexcharts-svg {
          width: 100% !important;
          height: auto !important;
          max-width: 100% !important;
        }
        .avatar-wrapper .apexcharts-canvas,
        .avatar-wrapper .apexcharts-svg {
          width: auto !important;
          height: auto !important;
          max-width: none !important;
        }
        .avatar-d {
          width: 72px !important;
          height: 72px !important;
          min-width: 72px !important;
          min-height: 72px !important;
          max-width: 72px !important;
          max-height: 72px !important;
          flex: none !important;
        }
        .avatar-d .b-avatar-img img,
        .avatar-wrapper .b-avatar-img img {
          width: 100% !important;
          height: 100% !important;
          max-width: none !important;
          max-height: none !important;
          object-fit: cover !important;
        }
        .apexcharts-toolbar,
        .apexcharts-menu,
        .apexcharts-tooltip,
        .apexcharts-xaxistooltip,
        .apexcharts-yaxistooltip,
        .resize-triggers {
          display: none !important;
        }
        .container {
          max-width: 100% !important;
        }
        .nuxt-page {
          break-before: page !important;
          page-break-before: always !important;
        }
      `;
    },
  },
};
</script>