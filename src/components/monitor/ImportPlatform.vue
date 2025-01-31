<template>
  <span>
    <button class="btn btn-add d-inline" @click="open = true">
      <i class="fa fa-file-import" />
      <span style="font-size: 16px">
        import CSV
      </span>
    </button>
    <vue-modaltor
      :visible="open"
      @hide="hideModal"
      :animation-panel="'modal-slide-top'"
      :resize-width="{ 3000: '80%', 1350: '80%', 768: '90%' }"
    >
      <div>
        <h5><b>เพิ่มบัญชี</b></h5>
        <hr />
        <div class="text-right mt-2">
          <span
            class="text-right mt-2 mr-2"
            v-if="
              facebook.length ||
                tiktok.length ||
                youtube.length ||
                instagram.length ||
                twitter.length ||
                pantip.length ||
                blockdit.length
            "
          >

            <b-button
              variant="success"
              class="btn btn-save mt-2"
              :loading="true"
              @click="addRowTarget()"
              :disabled="
                facebook.length == 0 &&
                  tiktok.length == 0 &&
                  youtube.length == 0 &&
                  instagram.length == 0 &&
                  twitter.length == 0 &&
                  pantip.length == 0 &&
                  blockdit.length == 0||loading
              "
              ><vue-element-loading
              :active="loading"
              size="45"
              background-color="rgba(255, 255, 255, 0.4)"
              color="#b6ac9a"
            />บันทึก
            </b-button>
          </span>

          <b-button @click="clear" variant="outline-danger" class="mr-2  mt-2 ">
            <i class="fa fa-eraser" aria-hidden="true"></i>
            clear</b-button
          >
          <b-button
            @click="downloadCSVFromPublicFile('aion_target_url.csv')"
            variant="outline-info"
            class="mr-2  mt-2 "
          >
            <i class="fa fa-download" aria-hidden="true"></i>
            ตัวอย่างไฟล์</b-button
          >
          <input
            id="fileInput"
            type="file"
            class="d-none"
            @input="handleFileUpload"
            accept=".csv"
          />

          <label for="fileInput" class="btn-import mb-0 mt-2">
            <i class="fas fa-file-import"></i> import CSV
          </label>
        </div>

        <div class="my-3" v-if="facebook.length">
          <b>facebook</b>
          <hr />
          <div class="column-container">
            <div v-for="(fb, i) in facebook" ::key="i">
              {{ i + 1 }}. {{ fb }}
            </div>
          </div>
        </div>
        <div class="my-3" v-if="twitter.length">
          <b>Twitter</b>
          <hr />
          <div class="column-container">
            <div v-for="(tw, i) in twitter" ::key="i">
              {{ i + 1 }}. {{ tw }}
            </div>
          </div>
        </div>

        <div class="my-3" v-if="instagram.length">
          <b>Instagram</b>
          <hr />
          <div class="column-container">
            <div v-for="(ig, i) in instagram" ::key="i">
              {{ i + 1 }}. {{ ig }}
            </div>
          </div>
        </div>

        <div class="my-3" v-if="tiktok.length">
          <b>Tiktok</b>
          <hr />
          <div class="column-container">
            <div v-for="(tt, i) in tiktok" ::key="i">{{ i + 1 }}. {{ tt }}</div>
          </div>
        </div>

        <div class="my-3" v-if="youtube.length">
          <b>Youtube</b>
          <hr />
          <div class="column-container">
            <div v-for="(yt, i) in youtube" ::key="i">
              {{ i + 1 }}. {{ yt }}
            </div>
          </div>
        </div>

        <div class="my-3" v-if="pantip.length">
          <b>Pantip</b>
          <hr />
          <div class="column-container">
            <div v-for="(pt, i) in pantip" ::key="i">{{ i + 1 }}. {{ pt }}</div>
          </div>
        </div>

        <div class="my-3" v-if="blockdit.length">
          <b>Blockdit</b>
          <hr />
          <div class="column-container">
            <div v-for="(bd, i) in blockdit" ::key="i">
              {{ i + 1 }}. {{ bd }}
            </div>
          </div>
        </div>
      </div>
      <b-row
        class="my-1"
        v-if="
          facebook.length ||
            tiktok.length ||
            youtube.length ||
            instagram.length ||
            twitter.length ||
            pantip.length ||
            blockdit.length
        "
      >
        <b-col sm="12" style="text-align: right">
          <br />
          <b-button class="btn btn-close mr-2" @click="hideModal()"
            >ปิดหน้าต่าง</b-button
          >
 
            <div class="d-inline "> 
            <b-button
              variant="success"
              class="btn btn-save"
              :loading="true"
              @click="addRowTarget()"
              :disabled="
                facebook.length == 0 &&
                  tiktok.length == 0 &&
                  youtube.length == 0 &&
                  instagram.length == 0 &&
                  twitter.length == 0 &&
                  pantip.length == 0 &&
                  blockdit.length == 0||loading
              "
              ><vue-element-loading
              :active="loading"
              size="45"
              background-color="rgba(255, 255, 255, 0.4)"
              color="#b6ac9a"
            />บันทึก
            </b-button></div>
           
        </b-col>
      </b-row>
    </vue-modaltor>
  </span>
</template>
<script>
import Papa from "papaparse";
// import { VueCsvImport } from "vue-csv-import";
export default {
  data() {
    return {
      loading: false,
      open: false,
      urls: [],
      facebook: [],
      tiktok: [],
      youtube: [],
      instagram: [],
      twitter: [],
      pantip: [],
      blockdit: [],
    };
  },
  methods: {
    downloadCSVFromPublicFile(filename) {
      fetch("/" + filename) // เปลี่ยนเส้นทางไปที่โฟลเดอร์ public ตามที่คุณใช้งาน
        .then((response) => response.text())
        .then((csv) => {
          // สร้าง Blob
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

          // สร้าง URL สำหรับ Blob
          const url = URL.createObjectURL(blob);

          // สร้างลิงก์สำหรับดาวน์โหลด
          const link = document.createElement("a");
          link.setAttribute("href", url);
          link.setAttribute("download", filename || "data.csv");
          document.body.appendChild(link);

          // คลิกลิงก์เพื่อดาวน์โหลด
          link.click();

          // ลบลิงก์ออกจาก DOM
          document.body.removeChild(link);
        })
        .catch((error) =>
          console.error("เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์ CSV:", error)
        );
    },
    clear() {

      this.facebook = [];
      this.tiktok = [];
      this.youtube = [];
      this.instagram = [];
      this.twitter = [];
      this.pantip = [];
      this.blockdit = [];
      const inputElement = document.getElementById("fileInput");
      if (inputElement) {
        inputElement.value = null;
      }
    },
    async addRowTarget() {
      this.loading = true;
      const promises = [];

      if (this.facebook.length) {
        promises.push(
          this.$store.dispatch("CreateMonitor", {
            source: "facebook",
            account: this.facebook,
          })
        );
      }
      if (this.twitter.length) {
        promises.push(
          this.$store.dispatch("CreateMonitor", {
            source: "twitter",
            account: this.twitter,
          })
        );
      }
      if (this.youtube.length) {
        promises.push(
          this.$store.dispatch("CreateMonitor", {
            source: "youtube",
            account: this.youtube,
          })
        );
      }
      if (this.instagram.length) {
        promises.push(
          this.$store.dispatch("CreateMonitor", {
            source: "instagram",
            account: this.instagram,
          })
        );
      }
      if (this.pantip.length) {
        promises.push(
          this.$store.dispatch("CreateMonitor", {
            source: "pantip",
            account: this.pantip,
          })
        );
      }
      if (this.blockdit.length) {
        promises.push(
          this.$store.dispatch("CreateMonitor", {
            source: "blockdit",
            account: this.blockdit,
          })
        );
      }
      if (this.tiktok.length) {
        promises.push(
          this.$store.dispatch("CreateMonitor", {
            source: "tiktok",
            account: this.tiktok,
          })
        );
      }

      try {
        await Promise.all(promises);
        this.showAlert("เพิ่มบัญชีเรียบร้อย!");
        this.loading = false;
        this.clear();
        // promises = []
        this.hideModal();
      } catch (error) {
        this.showAlert("เกิดข้อผิดพลาด: " + error.message);
      }
    },

    showAlert(message) {
      alert(message);
    },
    simplifyFacebookURL(originalURL) {
      // Match the numeric ID in the URL
      const regex = /(\d{15,})/; // Adjust the number 15 if you expect different lengths of numeric IDs
      const match = originalURL.match(regex);

      if (match) {
        const userID = match[1];
        const newURL = `https://facebook.com/${userID}`;
        return newURL;
      } else {
        return originalURL;
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];

      if (file) {
        Papa.parse(file, {
          complete: (result) => {
            const headers = result.meta.fields;

            // ตรวจสอบว่ามีค่า 'url' ใน headers หรือไม่
            if (!headers.includes("url")) {
              alert(
                "กรุณาตรวจสอบรูปแบบใน CSV ให้ถูกต้อง! Header ต้องมีฟิลด์ 'url'"
              );
              return;
            }

            const urls = result.data.map((x) => x.url);

            // กรอง URL ที่ไม่ตรงกับเงื่อนไขออก
            const cleanedUrls = urls
              .filter((url) => {
                return (
                  typeof url === "string" &&
                  (url.includes("tiktok") ||
                    url.includes("blockdit") ||
                    url.includes("facebook") ||
                    url.includes("twitter") ||
                    url.includes("pantip") ||
                    url.includes("instagram") ||
                    url.includes("youtube")) &&
                  !url.includes("vt.tiktok.com") &&
                  !url.includes("facebook.com/share/") &&
                  !url.includes("fb.watch") &&
                  !url.includes("m.facebook.com")
                );
              })
              .map((url) => {
                if (url.includes("facebook")) {
                  url = this.simplifyFacebookURL(url);
                }
                // ทำการแปลง URL ตามเงื่อนไข
                return url
                  .replace("profile.php?id=", "")
                  .replace("profile.php/?id=", "")
                  .split("?")[0]
                  .split("/status/")[0]
                  .split("&")[0]
                  .replace("x.com", "twitter.com")
                  .replace("https://www.youtube.com", "https://youtube.com")
                  .replace("mobile.", "")
                  .replace("web.", "")
                  .replace("https://www.instagram.com", "https://instagram.com")
                  .replace("www.facebook.com", "facebook.com")
                  .split("/posts/")[0];
              });

            // ลบ URL ที่ซ้ำออก
            const uniqueUrls = [...new Set(cleanedUrls)];

            // แบ่ง URL ตามเงื่อนไข
            this.twitter = uniqueUrls.filter((url) => url.includes("twitter"));
            this.facebook = uniqueUrls.filter((url) =>
              url.includes("facebook")
            );
            this.tiktok = uniqueUrls.filter((url) => url.includes("tiktok"));
            this.instagram = uniqueUrls.filter((url) =>
              url.includes("instagram")
            );
            this.youtube = uniqueUrls.filter((url) => url.includes("youtube"));
            this.pantip = uniqueUrls.filter((url) => url.includes("pantip"));
            this.blockdit = uniqueUrls.filter((url) =>
              url.includes("blockdit")
            );
          },
          header: true, // ถ้า CSV มี header
          dynamicTyping: true, // ทำให้ปรับปรุงประเภทของข้อมูลโดยอัตโนมัติ
        });
      }
    },
    hideModal() {
      this.open = false;
    },
    extractPageIdFromFacebookUrl(url) {
      const parts = url.split("/");
      const lastPart = parts[parts.length - 1];
      const id = lastPart.split("-").pop();
      return id;
    },
  },
};
</script>
<style scoped>
.btn-import {
  background-color: #ede7dd;
  color: #504b3c;
  border-radius: 5px;
  padding: 5px 5px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  cursor: pointer;
  height: 38px;
  /* border: 1px #4c412b solid; */
}
.btn-import:hover {
  color: #ffffff;
  background-color: #4c412b;
}
.btn-add:hover {
  background-color: #504b3c;
  color: white;
}
.btn-add:hover .fa-plus {
  background-color: #504b3c;
}
.btn-add {
  background-color: #ede7dd;
  color: #504b3c;
  padding: 8px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 25px;
  box-shadow: 1px 1px 3px #666666;
}
.column-container {
  column-count: 2;
  line-break: anywhere;
}
.column-item {
  display: inline-block;
  width: 300px; /* ให้แต่ละรายการเต็มคอลัมน์ */
}
.modal-vue--content-panel.space-content {
  width: 100%;
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .column-container {
    column-count: 1;
    line-break: anywhere;
  }
  .btn-add {
    margin-top: 20px;
  }
}
</style>
