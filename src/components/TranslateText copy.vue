<template>
  <span>
    <!-- ปุ่มแบบเล็ก (icon-only) สำหรับวางในการ์ด/แถบไอคอน เช่น CardPost.vue -->
    <span v-if="compact" class="d-inline-block box-link translate-trigger-compact" v-b-tooltip.hover
      title="แปลข้อความ" @click.stop="openModal">
      <i class="fa fa-language" aria-hidden="true"></i>
    </span>

    <!-- ปุ่มแบบเต็ม (ค่าเริ่มต้น) -->
    <b-button v-else size="md" class="w-100 w-md-auto btn-importobj" pill
      style="background-color: #50c1d0; color: #2c3e50;" @click="openModal">
      <i class="fa fa-language" style="font-size: 18px; line-height: 1;"></i> translate to thai
    </b-button>

    <vue-modaltor :visible="open" @hide="closeModal" :animation-panel="'modal-slide-top'"
      :resize-width='{ 3000: "600px", 1200: "600px", 768: "100%" }' class="translate-fullscreen-modal">

      <div class="translate-shell">
        <!-- Top bar -->
        <div class="translate-topbar">
          <div class="translate-topbar-title">
            <i class="fa fa-language"></i>
            <span>แปลข้อความ</span>
          </div>
          <button class="translate-close-btn" @click="closeModal" aria-label="ปิดหน้าต่าง">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <div class="translate-body">
          <div class="translate-main-inner">
            <!-- เลือกภาษาต้นทาง/ปลายทาง -->
            <div class="translate-lang-row">
              <b-form-select v-model="sourceLang" :options="sourceLangOptions" class="translate-lang-select"></b-form-select>

              <button type="button" class="translate-swap-btn" v-b-tooltip.hover title="สลับภาษา"
                :disabled="sourceLang === 'auto'" @click="swapLanguages">
                <i class="fa fa-exchange"></i>
              </button>

              <b-form-select v-model="targetLang" :options="targetLangOptions" class="translate-lang-select"></b-form-select>
            </div>

            <b-alert v-if="!apiKey" variant="warning" show class="translate-apikey-hint">
              <i class="fa fa-key mr-1"></i>
              ต้องมี Gemini API key ถึงจะแปลได้ —
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">ขอ API key ฟรีที่ Google AI Studio</a>
              แล้วส่งเข้ามาทาง prop <code>api-key</code>
            </b-alert>

            <!-- ข้อความต้นฉบับ -->
            <div class="translate-field">
              <label class="translate-field-label">ข้อความต้นฉบับ</label>
              <b-form-textarea v-model="sourceText" placeholder="พิมพ์หรือวางข้อความที่ต้องการแปล..." rows="6"
                max-rows="10" class="translate-textarea"></b-form-textarea>
            </div>

            <!-- ปุ่มกดแปลภาษา -->
            <div class="translate-action-row">
              <b-button class="translate-btn-submit" pill :disabled="!sourceText.trim() || isTranslating"
                @click="translateText">
                <b-spinner small v-if="isTranslating" class="mr-1"></b-spinner>
                <i v-else class="fa fa-language mr-1"></i>
                {{ isTranslating ? "กำลังแปล..." : "แปลข้อความ" }}
              </b-button>
            </div>

            <!-- สถานะ / ข้อผิดพลาด -->
            <b-alert v-if="statusMessage" :variant="statusClass" show class="mt-2">
              {{ statusMessage }}
            </b-alert>

            <!-- ผลลัพธ์การแปล -->
            <div class="translate-field mt-3">
              <label class="translate-field-label">
                ผลการแปล
                <button v-if="translatedText" type="button" class="translate-copy-btn" v-b-tooltip.hover
                  title="คัดลอกข้อความ" @click="copyResult">
                  <i class="fa fa-copy"></i> คัดลอก
                </button>
              </label>

              <div v-if="translatedText" class="translate-result-box">
                {{ translatedText }}
              </div>
              <div v-else class="translate-empty">
                <i class="fa fa-language"></i>
                <p>ผลการแปลจะแสดงที่นี่</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ปุ่มปิด -->
        <div class="translate-footer">
          <b-button class="translate-btn-cancel" @click="closeModal">ปิดหน้าต่าง</b-button>
        </div>
      </div>
    </vue-modaltor>
  </span>
</template>

<script>

export default {
  name: "TranslateText",
  props: {
    // ข้อความเริ่มต้นที่จะนำมาแปล (ถ้ามี) เช่นส่งมาจาก component แม่
    initialText: { type: String, default: "" },
    // true = แสดงปุ่มแบบไอคอนเล็กๆ (ใช้วางในการ์ด/แถบไอคอน), false = ปุ่มแบบเต็ม
    compact: { type: Boolean, default: false },
    // Gemini API key จาก https://aistudio.google.com/apikey
    // แนะนำให้ส่งมาจาก env variable ของโปรเจกต์ เช่น process.env.VUE_APP_GEMINI_API_KEY
    // แทนการ hardcode ในโค้ด เพราะ key ที่ฝังใน frontend จะมองเห็นได้จากฝั่ง client เสมอ
    apiKey: { type: String, default: "" },
  },
  data() {
    return {
      open: false,
      sourceText: "",
      translatedText: "",
      isTranslating: false,
      statusMessage: "",
      statusClass: "",
      sourceLang: "auto",
      targetLang: "th",
      // ปรับ endpoint ได้จากตรงนี้จุดเดียว
      apiUrl: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      sourceLangOptions: [
        { value: "auto", text: "ตรวจจับภาษาอัตโนมัติ" },
        { value: "en", text: "English" },
        { value: "th", text: "ไทย" },
        { value: "ja", text: "Japanese" },
        { value: "zh", text: "Chinese" },
        { value: "ko", text: "Korean" },
      ],
      targetLangOptions: [
        { value: "th", text: "ไทย" },
        { value: "en", text: "English" },
        { value: "ja", text: "Japanese" },
        { value: "zh", text: "Chinese" },
        { value: "ko", text: "Korean" },
      ],
      // ชื่อภาษาแบบเต็ม ใช้สร้าง prompt ส่งให้ Gemini (โมเดลเข้าใจชื่อภาษาได้ดีกว่ารหัสภาษาสั้นๆ)
      langNames: {
        auto: "the source language (detect it automatically)",
        en: "English",
        th: "Thai",
        ja: "Japanese",
        zh: "Chinese",
        ko: "Korean",
      },
    };
  },
  watch: {
    open(isOpen) {
      this.$emitter.emit("fullscreenModalToggled", isOpen);
      if (isOpen) {
        // ถ้ามีข้อความเริ่มต้นส่งเข้ามาจาก prop ให้เติมให้อัตโนมัติตอนเปิด modal
        if (this.initialText && !this.sourceText) {
          this.sourceText = this.initialText;
        }
        this.$nextTick(() => {
          this.hideDefaultCloseButton();
        });
      }
    },
  },
  methods: {
    hideDefaultCloseButton() {
      if (!this.$el) return;
      const shell = this.$el.querySelector(".translate-shell");
      if (!shell) return;

      let node = shell.parentElement;
      let modaltorRoot = null;
      while (node && node !== document.body) {
        const position = window.getComputedStyle(node).position;
        if (position === "fixed") {
          modaltorRoot = node;
          break;
        }
        node = node.parentElement;
      }
      if (!modaltorRoot) return;

      const candidates = modaltorRoot.querySelectorAll(
        '[class*="close" i], [class*="exit" i], [class*="header" i]'
      );
      candidates.forEach((el) => {
        if (el.closest(".translate-shell")) return;
        el.style.setProperty("display", "none", "important");
      });

      Array.from(modaltorRoot.children).forEach((el) => {
        if (el.contains(shell) || el === shell) return;
        const tag = el.tagName.toLowerCase();
        if (tag === "svg" || tag === "button") {
          el.style.setProperty("display", "none", "important");
        }
      });
    },
    swapLanguages() {
      if (this.sourceLang === "auto") return;
      const tmp = this.sourceLang;
      this.sourceLang = this.targetLang;
      this.targetLang = tmp;
      // สลับข้อความต้นฉบับ/ผลลัพธ์ไปด้วย ถ้ามีผลลัพธ์อยู่แล้ว
      if (this.translatedText) {
        const tmpText = this.sourceText;
        this.sourceText = this.translatedText;
        this.translatedText = tmpText;
      }
    },
    async translateText() {
      const text = this.sourceText.trim();
      if (!text) return;

      this.isTranslating = true;
      this.statusMessage = "";
      this.statusClass = "";
      this.translatedText = "";

      // กันไม่ให้ค้างตลอดไปถ้า endpoint ไม่ตอบสนอง
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const targetName = this.langNames[this.targetLang] || this.targetLang;
        const sourceName = this.sourceLang !== "auto" ? this.langNames[this.sourceLang] : null;
        const prompt =
          (sourceName ? `Translate the following ${sourceName} text to ${targetName}. ` : `Translate the following text to ${targetName}. `) +
          `Only output the translated text with no explanation, no quotes, and no extra formatting.\n\n` +
          `Text:\n${text}`;

        const response = await fetch(this.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Gemini API รับ key ผ่าน header นี้ (ตาม docs ทางการ)
            "x-goog-api-key": this.apiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            // ✅ ปิด "thinking" ของโมเดล เพราะงานแปลภาษาตรงไปตรงมา ไม่จำเป็นต้อง reasoning ยาวๆ ก่อนตอบ
            // ช่วยลดจำนวน token ที่ใช้ลงมาก (thinking token มักกินมากกว่าคำตอบจริงหลายเท่า)
            generationConfig: {
              thinkingConfig: { thinkingBudget: 0 },
            },
          }),
          signal: controller.signal,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.error?.message || `เซิร์ฟเวอร์ตอบกลับผิดพลาด (${response.status})`);
        }

        this.translatedText =
          data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

        if (!this.translatedText) {
          this.statusMessage = "ไม่พบผลการแปล กรุณาลองใหม่อีกครั้ง";
          this.statusClass = "warning";
        } else {
          // ✅ ส่งผลแปลกลับไปให้ component แม่ ใช้แสดงแทนข้อความต้นฉบับได้เลย
          // โดยไม่ต้องรอให้ผู้ใช้เปิด modal ดู
          this.$emit("translated", this.translatedText);
        }
      } catch (error) {
        console.error("Translation error:", error);

        const isAbort = error.name === "AbortError";
        // TypeError: Failed to fetch = โดน CORS บล็อกหรือเชื่อมต่อเซิร์ฟเวอร์ไม่ได้เลย
        const isNetworkOrCorsError = error instanceof TypeError;

        let message = error.message || "กรุณาตรวจสอบการเชื่อมต่อแล้วลองอีกครั้ง";
        if (isAbort) {
          message = "บริการแปลภาษาตอบสนองช้าเกินไป กรุณาลองใหม่อีกครั้ง";
        } else if (isNetworkOrCorsError) {
          message =
            "ไม่สามารถเชื่อมต่อบริการแปลภาษาได้ (อาจโดน browser extension เช่น ad-blocker/CORS-unlocker บล็อก request " +
            "ลองปิด extension แล้วรีเฟรชใหม่ หรือตรวจสอบ API key ว่าถูกต้อง)";
        }

        this.$fire({
          title: "แปลภาษาไม่สำเร็จ",
          text: message,
          type: "error",
          confirmButtonText: "ตกลง",
        });
      } finally {
        clearTimeout(timeoutId);
        this.isTranslating = false;
      }
    },
    async copyResult() {
      if (!this.translatedText) return;
      try {
        await navigator.clipboard.writeText(this.translatedText);
        this.$fire({
          title: "คัดลอกข้อความแล้ว",
          type: "success",
          showConfirmButton: false,
          timer: 1200,
        });
      } catch (error) {
        console.error("Copy failed:", error);
      }
    },
    openModal() {
      this.open = true;
    },
    closeModal() {
      this.open = false;
      this.clearForm();
    },
    clearForm() {
      this.sourceText = "";
      this.translatedText = "";
      this.statusMessage = "";
      this.statusClass = "";
    },
  },
};
</script>

<style scoped>
::v-deep .translate-fullscreen-modal .modal-vue--content.space-content {
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 5px !important;
  padding-bottom: 5px !important;
  overflow: hidden;
}

.translate-shell {
  display: flex;
  flex-direction: column;
  height: 80vh;
  background: #f7f9fa;
}

.translate-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  padding: 14px 18px;
  background: #ffffff;
  border-bottom: 1px solid #e7ecee;
  gap: 12px;
}

.translate-topbar-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 19px;
  font-weight: 700;
  color: #2c3e50;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.translate-topbar-title i {
  color: #50c1d0;
  font-size: 20px;
}

.translate-close-btn {
  border: none;
  background: transparent;
  color: #8a949c;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  transition: background .15s ease, color .15s ease;
}

.translate-close-btn:hover {
  background: #f0f2f4;
  color: #2c3e50;
}

.translate-trigger-compact {
  cursor: pointer;
  color: inherit;
}

.translate-trigger-compact i {
  color: #50c1d0;
}

.translate-trigger-compact:hover {
  opacity: .75;
}

.translate-body {
  flex: 1;
  display: flex;
  min-height: 0;
  overflow-y: auto;
}

.translate-main-inner {
  flex: 1;
  padding: 20px;
}

.translate-lang-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.translate-apikey-hint {
  font-size: 12.5px;
  padding: 8px 12px;
  margin-bottom: 14px;
}

.translate-apikey-hint code {
  font-size: 12px;
}

.translate-lang-select {
  flex: 1;
  border-radius: 9px;
  border: 1px solid #d9dee0;
}

.translate-swap-btn {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #d9dee0;
  background: #ffffff;
  color: #50c1d0;
  cursor: pointer;
  transition: background .15s ease, border-color .15s ease;
}

.translate-swap-btn:hover:not(:disabled) {
  background: #eaf7f9;
  border-color: #50c1d0;
}

.translate-swap-btn:disabled {
  opacity: .4;
  cursor: not-allowed;
}

.translate-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.translate-field-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
  color: #5b656a;
  margin: 0;
}

.translate-textarea {
  border-radius: 12px;
  border: 1px solid #d9dee0;
  resize: vertical;
}

.translate-textarea:focus {
  border-color: #50c1d0;
  box-shadow: 0 0 0 2px rgba(80, 193, 208, .2);
}

.translate-action-row {
  display: flex;
  justify-content: center;
  margin: 14px 0;
}

.translate-copy-btn {
  border: none;
  background: transparent;
  color: #50c1d0;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}

.translate-copy-btn:hover {
  text-decoration: underline;
}

.translate-result-box {
  min-height: 120px;
  border: 1px solid #e7ecee;
  border-radius: 12px;
  background: #ffffff;
  padding: 14px;
  color: #2c3e50;
  font-size: 14.5px;
  white-space: pre-wrap;
  word-break: break-word;
}

.translate-empty {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed #d9dee0;
  border-radius: 12px;
  background: #ffffff;
  color: #b9c1c5;
  text-align: center;
}

.translate-empty i {
  font-size: 30px;
  margin-bottom: 8px;
}

.translate-empty p {
  font-size: 13px;
  margin: 0;
}

.translate-footer {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding: 15px 18px;
  background: #ffffff;
  border-top: 1px solid #e7ecee;
}

.translate-btn-cancel {
  background: #ffffff !important;
  border: 1px solid #d9dee0 !important;
  color: #5b656a !important;
  font-weight: 600;
  border-radius: 9px;
  padding: 8px 20px;
}

.translate-btn-cancel:hover {
  background: #f4f5f6 !important;
}

.translate-btn-submit {
  background: #50c1d0 !important;
  border: 1px solid #50c1d0 !important;
  color: #1d3a40 !important;
  font-weight: 700;
  border-radius: 9px;
  padding: 8px 22px;
}

.translate-btn-submit:disabled {
  background: #d8e7e9 !important;
  border-color: #d8e7e9 !important;
  color: #9bb0b3 !important;
}

.translate-btn-submit:not(:disabled):hover {
  background: #41acba !important;
  border-color: #41acba !important;
}

/* Mobile */
@media only screen and (max-width: 768px) {
  .btn-importobj {
    font-size: 12px !important;
  }
  .translate-topbar {
    padding: 14px 16px;
  }
  .translate-topbar-title {
    font-size: 16px;
    gap: 8px;
  }
  .translate-main-inner {
    padding: 14px;
  }
  .translate-lang-row {
    flex-wrap: wrap;
  }
  .translate-footer {
    padding: 14px 16px;
  }
}

::v-deep .translate-fullscreen-modal {
  z-index: 2000 !important;
  overflow: hidden;
}
::v-deep .translate-fullscreen-modal .modaltor__overlay {
  z-index: 2000 !important;
}

::v-deep .translate-fullscreen-modal .modaltor__panel {
  width: 90vw !important;
  max-width: 600px !important;
  height: auto !important;
  max-height: 90vh !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  margin: 40px auto !important;
  border-radius: 12px !important;
  padding: 0 !important;
  overflow: hidden !important;
  z-index: 2001 !important;
}

::v-deep .translate-fullscreen-modal .modaltor__panel--show {
  transform: translateY(0) !important;
}

::v-deep .translate-fullscreen-modal .modaltor__content {
  height: 100%;
  padding: 0 !important;
  margin: 0 !important;
}

::v-deep .translate-fullscreen-modal .modaltor__header {
  display: none !important;
}

::v-deep .translate-fullscreen-modal .modaltor__close {
  display: none !important;
}
</style>

<style>
.translate-fullscreen-modal .modaltor__header,
.translate-fullscreen-modal .modaltor__close {
  display: none !important;
}

.translate-fullscreen-modal {
  z-index: 2000 !important;
}
</style>