<template>
  <span>
    <!-- ปุ่มแบบเล็ก (icon-only) สำหรับวางในการ์ด/แถบไอคอน เช่น ReadMore2.vue -->
    <span v-if="compact" class="d-inline-block box-link translate-trigger-compact"
      :class="{ 'is-loading': isTranslating, 'is-disabled': disabled }"
      v-b-tooltip.hover :title="triggerTitle" @click.stop="translateNow">
      <b-spinner v-if="isTranslating" small></b-spinner>
      <i v-else class="fa fa-language" aria-hidden="true"></i>
    </span>

    <!-- ปุ่มแบบเต็ม (ค่าเริ่มต้น) -->
    <b-button v-else size="md" class="w-100 w-md-auto btn-importobj" pill
      style="background-color: #50c1d0; color: #2c3e50;" :disabled="isTranslating || disabled" @click="translateNow">
      <b-spinner small v-if="isTranslating" class="mr-1"></b-spinner>
      <i v-else class="fa fa-language" style="font-size: 18px; line-height: 1;"></i>
      {{ isTranslating ? "กำลังแปล..." : "translate to thai" }}
    </b-button>
  </span>
</template>

<script>
export default {
  name: "TranslateText",
  props: {
    // ข้อความต้นฉบับที่จะนำมาแปล — เป็นค่าที่ component แม่ส่งเข้ามา (เช่น post.full_text)
    initialText: { type: String, default: "" },
    // true = แสดงปุ่มแบบไอคอนเล็กๆ (ใช้วางในการ์ด/แถบไอคอน), false = ปุ่มแบบเต็ม
    compact: { type: Boolean, default: false },
    // Gemini API key จาก https://aistudio.google.com/apikey
    // แนะนำให้ส่งมาจาก env variable ของโปรเจกต์ เช่น process.env.VUE_APP_GEMINI_API_KEY
    // แทนการ hardcode ในโค้ด เพราะ key ที่ฝังใน frontend จะมองเห็นได้จากฝั่ง client เสมอ
    apiKey: { type: String, default: "" },
    sourceLang: { type: String, default: "auto" },
    targetLang: { type: String, default: "th" },
    // true = ปิดปุ่มไว้ ไม่ให้กดแปลซ้ำ (เช่น กรณีแปลไปแล้วครั้งหนึ่ง ไม่อยากยิง API ซ้ำ)
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      isTranslating: false,
      // ปรับ endpoint ได้จากตรงนี้จุดเดียว
      apiUrl: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      // ชื่อภาษาแบบเต็ม ใช้สร้าง prompt ส่งให้ Gemini (โมเดลเข้าใจชื่อภาษาได้ดีกว่ารหัสภาษาสั้นๆ)
      langNames: {
        auto: null,
        en: "English",
        th: "Thai",
        ja: "Japanese",
        zh: "Chinese",
        ko: "Korean",
      },
    };
  },
  computed: {
    triggerTitle() {
      if (this.isTranslating) return "กำลังแปล...";
      if (this.disabled) return "แปลไปแล้ว";
      return "แปลข้อความ";
    },
  },
  methods: {
    // กดปุ่มแล้วแปล initialText ทันที ไม่ต้องเปิด modal ใดๆ
    // แปลเสร็จแล้ว emit ผลลัพธ์กลับไปให้ component แม่เอาไปแสดงแทนต้นฉบับเอง
    async translateNow() {
      if (this.disabled || this.isTranslating) return;

      const text = (this.initialText || "").trim();
      if (!text) return;

      if (!this.apiKey) {
        this.$fire({
          title: "ยังไม่ได้ตั้งค่า API key",
          text: "ต้องมี Gemini API key ถึงจะแปลได้ ขอฟรีได้ที่ https://aistudio.google.com/apikey แล้วส่งเข้ามาทาง prop api-key",
          type: "warning",
          confirmButtonText: "ตกลง",
        });
        return;
      }

      this.isTranslating = true;

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

        const translated = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

        if (!translated) {
          this.$fire({
            title: "ไม่พบผลการแปล",
            text: "กรุณาลองใหม่อีกครั้ง",
            type: "warning",
            confirmButtonText: "ตกลง",
          });
          return;
        }

        // ✅ ส่งผลแปลกลับไปให้ component แม่ ใช้แสดงแทนข้อความต้นฉบับได้เลย
        this.$emit("translated", translated);
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
  },
};
</script>

<style scoped>
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

.translate-trigger-compact.is-loading {
  cursor: wait;
  opacity: .6;
}

.translate-trigger-compact.is-disabled {
  cursor: default;
  opacity: .45;
}

.translate-trigger-compact.is-disabled:hover {
  opacity: .45;
}
</style>