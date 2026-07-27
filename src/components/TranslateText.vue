<template>
  <span>
    <!-- โหมด combined: ปุ่มเดียวแปล+สลับ title และ full_text ของโพสต์พร้อมกัน (ใช้ใน CardTitle.vue) -->
    <span v-if="combined">
      <span v-if="shouldShowCombinedButton" class="d-inline-block box-link translate-trigger-compact combined"
        :class="{ 'is-loading': isTranslating }"
        v-b-tooltip.hover :title="combinedTooltip" @click="translateOrToggle">
        <b-spinner v-if="isTranslating" small></b-spinner>
        <i v-else :class="hasTranslatedCombined ? 'fa fa-exchange' : 'fa fa-language'" aria-hidden="true"></i>
        <span class="translate-trigger-label"> {{ combinedLabel }}</span>
      </span>
    </span>

    <template v-else>
      <!-- ปุ่มแบบเล็ก (icon + ข้อความ) สำหรับวางในการ์ด/แถบไอคอน เช่น ReadMore2.vue -->
      <span v-if="compact" class="d-inline-block box-link translate-trigger-compact"
        :class="{ 'is-loading': isTranslating, 'is-disabled': disabled }" v-b-tooltip.hover :title="triggerTitle"
        @click.stop="translateNow">
        <b-spinner v-if="isTranslating" small></b-spinner>
        <i v-else class="fa fa-language" aria-hidden="true"></i>
        <span class="translate-trigger-label"> {{ triggerLabel }}</span>
      </span>

      <!-- ปุ่มแบบเต็ม (ค่าเริ่มต้น) -->
      <b-button v-else size="md" class="w-100 w-md-auto btn-importobj" pill
        style="background-color: #50c1d0; color: #2c3e50;" :disabled="isTranslating || disabled" @click="translateNow">
        <b-spinner small v-if="isTranslating" class="mr-1"></b-spinner>
        <i v-else class="fa fa-language" style="font-size: 18px; line-height: 1;"></i>
        {{ isTranslating ? "กำลังแปล..." : "translate to thai" }}
      </b-button>
    </template>
  </span>
</template>

<script>
import axios from "axios";

// ✅ ใช้ axios instance แยกต่างหากสำหรับ component นี้โดยเฉพาะ ไม่ใช้ instance กลางของแอป
// กัน interceptor ที่อื่นในโปรเจกต์ (ถ้ามี เช่นเช็ค token หมดอายุ) ไปอ่าน error.response.status ตรงๆ
// แล้ว crash ตอนเจอ network/CORS error ที่ไม่มี error.response เลย
const translateClient = axios.create();

export default {
  name: "TranslateText",
  props: {
    // เก็บไว้เพื่อ backward-compat กับ usage เดิม (ไม่ได้ใช้แล้วหลังเปลี่ยนมาใช้ backend endpoint)
    initialText: { type: String, default: "" },
    // true = แสดงปุ่มแบบไอคอนเล็กๆ (ใช้วางในการ์ด/แถบไอคอน), false = ปุ่มแบบเต็ม
    compact: { type: Boolean, default: false },
    // true = ปิดปุ่มไว้ ไม่ให้กดแปลซ้ำ (โหมดปกติ/ไม่ combined เท่านั้น)
    disabled: { type: Boolean, default: false },
    // ✅ _id ของโพสต์ — ใช้ยิง backend endpoint /getTranslate/{postId} เพื่อดึงคำแปลของโพสต์นี้
    // ไม่บังคับ required เพราะบางรายการโพสต์จาก parent (เช่น getPostAllMonitor ใน TabPost.vue)
    // ยังไม่มี _id ตอน render (undefined) — ปุ่มแปลจะถูกปิดใช้งานเองอยู่แล้วผ่าน guard
    // `if (!this.postId) return;` ใน translateNow()/translateOrToggle() ด้านล่าง
    postId: { type: String, default: "" },
    // ฟิลด์ที่จะดึงจากผลลัพธ์ที่แปลแล้ว (โหมดปกติเท่านั้น): 'title' หรือ 'full_text'
    field: {
      type: String,
      default: "full_text",
      validator: (v) => ["title", "full_text"].includes(v),
    },
    // ✅ โหมด combined: ปุ่มเดียวแปล + สลับ title และ full_text พร้อมกัน แล้ว emit ผลรวมออกไปให้ parent
    combined: { type: Boolean, default: false },
    // title/fullText ต้นฉบับ — ใช้เช็คว่าเป็นภาษาต่างประเทศหรือยัง (โหมด combined เท่านั้น)
    title: { type: String, default: "" },
    fullText: { type: String, default: "" },
  },
  data() {
    return {
      isTranslating: false,
      apiUrl: "https://api2.cognizata.com/api/v2/userposts/getTranslate",
      // state ของโหมด combined เท่านั้น
      combinedTitle: "",
      combinedFullText: "",
      combinedShowTranslated: false,
    };
  },
  computed: {
    triggerTitle() {
      if (this.isTranslating) return "กำลังแปล...";
      if (this.disabled) return "แปลไปแล้ว";
      return "แปลข้อความ";
    },
    triggerLabel() {
      if (this.isTranslating) return "กำลังแปล...";
      if (this.disabled) return "แปลแล้ว";
      return "แปลภาษา";
    },
    // ---- โหมด combined ----
    titleHasNoThai() {
      const t = this.title || "";
      return t.trim().length > 0 && !/[\u0E00-\u0E7F]/.test(t);
    },
    bodyHasNoThai() {
      const t = this.fullText || "";
      return t.trim().length > 0 && !/[\u0E00-\u0E7F]/.test(t);
    },
    // แสดงปุ่มก็ต่อเมื่อ "ทั้งคู่" เป็นภาษาต่างประเทศเท่านั้น (ไม่ใช่แค่อันใดอันหนึ่ง)
    // ถ้าไม่มี title เลย ให้เช็คแค่เนื้อหาอย่างเดียว
    // และต้องมี postId พร้อมใช้งานแล้วด้วย (กันปุ่มโผล่มาแต่กดแล้วไม่ทำอะไรเลยตอน postId ยังไม่มา)
    shouldShowCombinedButton() {
      if (!this.postId) return false;
      const hasTitle = !!(this.title && this.title.trim());
      if (hasTitle) return this.titleHasNoThai && this.bodyHasNoThai;
      return this.bodyHasNoThai;
    },
    hasTranslatedCombined() {
      return !!(this.combinedTitle || this.combinedFullText);
    },
    combinedLabel() {
      if (this.isTranslating) return "กำลังแปล...";
      if (this.hasTranslatedCombined) return this.combinedShowTranslated ? "ต้นฉบับ" : "คำแปล";
      return "แปลภาษา";
    },
    combinedTooltip() {
      if (this.isTranslating) return "กำลังแปล...";
      if (this.hasTranslatedCombined) return this.combinedShowTranslated ? "ดูข้อความต้นฉบับ" : "ดูคำแปล";
      return "แปลข้อความ";
    },
  },
  watch: {
    // ถ้า postId เปลี่ยน (เช่น การ์ดถูกสลับข้อมูลใหม่) ให้เคลียร์คำแปลเก่าทิ้งทั้งหมด (โหมด combined)
    // แล้วแจ้ง parent ให้เคลียร์ค่าที่ cache ไว้ด้วย ผ่าน event เดียวกัน
    postId() {
      if (!this.combined) return;
      this.combinedTitle = "";
      this.combinedFullText = "";
      this.combinedShowTranslated = false;
      this.emitCombinedUpdate();
    },
  },
  methods: {
    // ✅ ดึงคำแปลของโพสต์นี้จาก backend — 1 call เดียวได้ทั้ง title และ full_text ที่แปลแล้ว
    async fetchTranslation() {
      const response = await translateClient.get(`${this.apiUrl}/${this.postId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        timeout: 30000,
      });

      const payload = response.data;
      // ✅ รองรับทั้ง 2 รูปแบบ: แบบห่อด้วย data (ตามสเปกแรก) และแบบแบน (โครงสร้างจริงที่ backend ส่งมา)
      const translated = payload?.translated || payload?.data?.translated;

      if (!payload?.success || !translated) {
        throw new Error("ไม่พบผลการแปล กรุณาลองใหม่อีกครั้ง");
      }
      return translated; // { title, full_text }
    },
    handleTranslateError(error) {
      console.error("Translation error:", error);

      // axios: timeout จะได้ error.code === "ECONNABORTED"
      // ส่วน network/CORS error จะไม่มี error.response เลย (ต่างจาก error ที่ server ตอบกลับมาจริงๆ)
      // เช็ค isAxiosError ก่อน เพื่อไม่ให้ error ที่เรา throw new Error(...) เอง (เช่น "ไม่พบผลการแปล")
      // โดนตีความผิดว่าเป็น network/CORS error ไปด้วย (มันก็ไม่มี error.response เหมือนกัน)
      const isAxiosError = !!error.isAxiosError;
      const isTimeout = isAxiosError && error.code === "ECONNABORTED";
      const isNetworkOrCorsError = isAxiosError && !error.response && !isTimeout;

      let message =
        error.response?.data?.error?.message ||
        error.message ||
        "กรุณาตรวจสอบการเชื่อมต่อแล้วลองอีกครั้ง";

      if (isTimeout) {
        message = "บริการแปลภาษาตอบสนองช้าเกินไป กรุณาลองใหม่อีกครั้ง";
      } else if (isNetworkOrCorsError) {
        message = "ไม่สามารถเชื่อมต่อบริการแปลภาษาได้ กรุณาลองใหม่อีกครั้ง";
      }

      this.$fire({
        title: "แปลภาษาไม่สำเร็จ",
        text: message,
        type: "error",
        confirmButtonText: "ตกลง",
      });
    },
    // กดปุ่มแล้วดึงคำแปลของโพสต์นี้จาก backend ทันที (โหมดปกติ)
    // แปลเสร็จแล้ว emit ผลลัพธ์กลับไปให้ component แม่เอาไปแสดงแทนต้นฉบับเอง
    async translateNow() {
      if (this.disabled || this.isTranslating) return;
      if (!this.postId) return;

      this.isTranslating = true;
      try {
        const translated = await this.fetchTranslation();
        const value = translated[this.field] || "";

        if (!value) {
          this.$fire({
            title: "ไม่พบผลการแปล",
            text: "กรุณาลองใหม่อีกครั้ง",
            type: "warning",
            confirmButtonText: "ตกลง",
          });
          return;
        }

        this.$emit("translated", value);
      } catch (error) {
        this.handleTranslateError(error);
      } finally {
        this.isTranslating = false;
      }
    },
    // ปุ่มเดียว (โหมด combined): ถ้ายังไม่เคยแปล -> ยิง backend ครั้งเดียวได้คำแปลทั้ง title และเนื้อหา
    // ถ้าแปลไปแล้ว -> แค่สลับดูต้นฉบับ/คำแปล (ไม่ยิง API ซ้ำ)
    async translateOrToggle() {
      if (this.isTranslating) return;

      if (this.hasTranslatedCombined) {
        this.combinedShowTranslated = !this.combinedShowTranslated;
        this.emitCombinedUpdate();
        return;
      }

      if (!this.postId) return;

      this.isTranslating = true;
      try {
        const translated = await this.fetchTranslation();

        this.combinedTitle = translated.title || "";
        this.combinedFullText = (translated.full_text || "")
          .replace("...___...", "")
          .replace(".#.##.", "");
        this.combinedShowTranslated = true;

        this.emitCombinedUpdate();
      } catch (error) {
        this.handleTranslateError(error);
      } finally {
        this.isTranslating = false;
      }
    },
    emitCombinedUpdate() {
      this.$emit("update", {
        showTranslated: this.combinedShowTranslated,
        title: this.combinedTitle,
        fullText: this.combinedFullText,
      });
    },
  },
};
</script>

<style scoped>
.translate-trigger-compact {
  cursor: pointer;
  color: inherit;
}

/* ยังไม่แปล -> ฟ้า, แปลไปแล้ว (disabled) -> เทา */
.translate-trigger-compact i {
  color: #50c1d0;
}

.translate-trigger-label {
  font-size: 14px;
  color: #50c1d0;
}

.translate-trigger-compact.is-disabled i,
.translate-trigger-compact.is-disabled .translate-trigger-label {
  color: #9aa0a6;
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

/* โหมด combined (ใช้ใน CardTitle.vue) ใช้โทนสีของตัวเอง แยกจากโหมดปกติ */
.translate-trigger-compact.combined i,
.translate-trigger-compact.combined .translate-trigger-label {
  color: #1293a4;
  font-size: 14px;
}

.translate-trigger-compact.combined:hover i,
.translate-trigger-compact.combined:hover .translate-trigger-label {
  color: #086672;
}

.translate-trigger-compact.combined:hover {
  opacity: 1;
}
</style>