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
    window.addEventListener("beforeprint", this._patchChartViewBox);
  },

  beforeDestroy() {
    window.removeEventListener("beforeprint", this._patchChartViewBox);
  },

  methods: {
    async handlePrint() {
      this.$emit("before-print");

      await this.$nextTick();
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
        img.loading = "eager";
      });

      await this.forceRenderOffscreenContent();

      window.print();
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
};
</script>

<style>

@media print {
  @page {
    size: landscape;
    margin: 4mm;
  }

  /* แก้บั๊กหน้ากระดาษหมุน 180 องศาสลับหน้าเวลาพิมพ์หลายหน้าแบบ landscape
     (บั๊กที่รู้จักกันดีของ Chromium: เกิดเมื่อใช้ @page{size:landscape} ร่วมกับ
     page-break-before หลายจุด และมี ancestor ที่ยังมี overflow/height จำกัดอยู่
     แม้จะแก้ .card-body-scroll กับ .slider ไปแล้ว แต่ถ้า wrapper ชั้นบนสุด
     (html/body/root ของแอป) ยังมี overflow ที่ไม่ใช่ visible บั๊กนี้ก็ยังเกิดได้)
     ต้องเคลียร์ overflow/height ของทุก ancestor ตั้งแต่ root จนถึง body ให้หมด */
  html,
  body,
  #__nuxt,
  #__layout,
  #app {
    height: auto !important;
    max-height: none !important;
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
    overflow-y: visible !important;
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
}
</style>