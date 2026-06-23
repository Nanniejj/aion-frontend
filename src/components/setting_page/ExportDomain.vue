<template>
  <b-dropdown
    class="mr-2 export-dropdown"
    variant="success"
    toggle-class="rounded-pill"
  >
    <template #button-content>
      <i class="fa fa-file-export"></i> Export
    </template>

    <b-dropdown-item-button @click="exportExcel">
      <i class="fa fa-file-excel"></i> Export
    </b-dropdown-item-button>
    <b-dropdown-item-button @click="exportCsv">
      <i class="fa fa-file-alt"></i> CSV
    </b-dropdown-item-button>
  </b-dropdown>
</template>

<script>
import * as XLSX from "xlsx"; 

export default {
  name: "ExportDomain",
  props: {
    // รายการ subdomains (พร้อม objects ข้างใน) ที่จะ export — ส่งมาจาก SubdomainCard
    subdomains: { type: Array, default: () => [] },
  },
  methods: {
    // แปลง subdomains/objects ให้เป็น row เดียวกันสำหรับทั้ง Excel และ CSV
    // จัดคอลัมน์ให้ตรงกับ template_domain.xlsx เป๊ะ: domain_name, subdomain_name,
    // object_name, keywords, and_keywords, not_keywords (keyword fields เป็น string
    // คั่นด้วย , เหมือนไฟล์ template ต้นฉบับ ไม่ใช่ array)
    // คืนค่า null ถ้าไม่มีข้อมูล (พร้อมแจ้งเตือนให้แล้วในตัว)
    buildExportRows() {
      if (!this.subdomains || this.subdomains.length === 0) {
        this.$fire({
          title: "ไม่มีข้อมูลให้ Export",
          type: "warning",
          confirmButtonText: "ตกลง",
        });
        return null;
      }

      const domainName = this.$route.params.domain || "";
      const rows = [];

      this.subdomains.forEach((sub) => {
        const objects = Array.isArray(sub.objects) ? sub.objects : [];

        if (objects.length === 0) {
          // ✅ subdomain ที่ยังไม่มี object เลย ก็ยังต้อง export แถวของมันไว้
          // ไม่งั้นข้อมูล subdomain นี้จะหายไปจากไฟล์ทั้งหมด
          rows.push({
            domain_name: domainName,
            subdomain_name: sub.subdomain_name || "",
            object_name: "",
            keywords: "",
            and_keywords: "",
            not_keywords: "",
          });
          return;
        }

        objects.forEach((obj) => {
          rows.push({
            domain_name: domainName,
            subdomain_name: sub.subdomain_name || "",
            object_name: obj.object_name || "",
            keywords: (obj.keywords || []).join(", "),
            and_keywords: (obj.and_keywords || []).join(", "),
            not_keywords: (obj.not_keywords || []).join(", "),
          });
        });
      });

      return { domainName, rows };
    },
    // Export เป็นไฟล์ Excel (.xlsx)
    exportExcel() {
      const built = this.buildExportRows();
      if (!built) return;
      const { domainName, rows } = built;

      const worksheet = XLSX.utils.json_to_sheet(rows, {
        header: [
          "domain_name",
          "subdomain_name",
          "object_name",
          "keywords",
          "and_keywords",
          "not_keywords",
        ],
      });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const fileName = `${domainName || "domain"}_export.xlsx`;
      XLSX.writeFile(workbook, fileName);

      this.$fire({
        title: "Export ข้อมูลสำเร็จ",
        type: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    // Export เป็นไฟล์ CSV (.csv) — ใช้ XLSX.utils.sheet_to_csv แปลงจาก worksheet เดียวกัน
    // เพื่อให้การ escape ค่าที่มีจุลภาค/ขึ้นบรรทัดใหม่ภายในถูกต้องตามมาตรฐาน CSV โดยอัตโนมัติ
    exportCsv() {
      const built = this.buildExportRows();
      if (!built) return;
      const { domainName, rows } = built;

      const worksheet = XLSX.utils.json_to_sheet(rows, {
        header: [
          "domain_name",
          "subdomain_name",
          "object_name",
          "keywords",
          "and_keywords",
          "not_keywords",
        ],
      });
      const csvContent = XLSX.utils.sheet_to_csv(worksheet);

      // เติม UTF-8 BOM ไว้ข้างหน้า ไม่งั้น Excel เปิดไฟล์ CSV ภาษาไทยแล้วตัวอักษรเพี้ยน
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${domainName || "domain"}_export.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      this.$fire({
        title: "Export ข้อมูลสำเร็จ",
        type: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  },
};
</script>

<style scoped>
.export-dropdown ::v-deep .btn {
  background-color: #ffc8c8 !important;
  border-color: #ffc8c8 !important;
  color: rgb(119, 25, 25) !important;
}

.export-dropdown ::v-deep .btn:hover,
.export-dropdown ::v-deep .btn:focus {
  background-color: #ebb1b1 !important;
  border-color: #ebb1b1 !important;
}
</style>