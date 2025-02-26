<template>
  <div id="content">
    <div class="d-flex justify-content-between align-items-center">
      <!-- Title -->
      <h1 class="title">Monitor Politician</h1>
    </div>

    <div class="d-flex justify-content-between align-items-center">
    </div>
  </div>
</template>

<script>
export default {
  name: "CandidatesHead",
  data() {
    return {
      search1: "", // ค่าช่องค้นหา
    };
  },
  methods: {
    onSearch() {
      if (!this.search1.trim()) {
        alert("กรุณากรอกคำค้นหา");
        return;
      }

      // เรียก API ค้นหา
      this.axios
        .get("https://api2.cognizata.com/api/v2/monitor/monitorCandidates", {
          params: { query: this.search1 },
        })
        .then((response) => {
          console.log("ผลลัพธ์การค้นหา:", response.data);
          alert("ค้นหาสำเร็จ: " + JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error("เกิดข้อผิดพลาด:", error);
          alert("เกิดข้อผิดพลาดในการค้นหา");
        });
    },
    navigateToCreateCandidates() {
      // นำทางไปที่หน้า CreateCandidates
      this.$router.push({ path: "/createcandidates" });
    },
  },
};
</script>

<style scoped>
* {
  font-family: "Prompt", "FontAwesome", sans-serif;
}

#content {
  max-width: 93%;
  margin: auto;
  background: white;
  padding: 0;
  overflow: auto;
  margin-bottom: 50px;
}


.search-bar {
  border-radius: 5px; /* มุมโค้ง */
  padding: 10px; /* ระยะห่างภายใน */
  border: 1px solid #ccc; /* กรอบ */
}

</style>
