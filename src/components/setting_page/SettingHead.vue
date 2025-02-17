<template>
 <div id="content">    
  <h1 class="title">Setting</h1>
    <b-container>
      <b-row>
        <b-col class="text-center">
          <span class="h4"
            ><a>{{ items.domain_name }}</a></span
          >
          <span class="float-right"
            ><i
              class="bi bi-printer-fill"
              @click="printWindow()"
              style="font-size:25px;cursor: pointer;"
          /></span>
        </b-col>
      </b-row>

      <hr />

      <!-- Search Input and Add Button -->

      <!-- Search Input with Icon -->
      <!--<b-row class="justify-content-md-end">-->
        <!-- Input Field with Search Icon -->
        <!--<b-col
          cols="12"
          sm="12"
          md="4"
          lg="4"
          class="mt-2 mt-md-0 pr-md-0 mr-md-2"
        >
          <b-input-group>
            <b-input-group-prepend>
              <span class="input-group-text">
                <i class="bi bi-search"></i>
              </span>
            </b-input-group-prepend>
            <b-form-input
              v-model="searchQuery"
              placeholder="ค้นหา"
              class="input-group-text text-left"
            ></b-form-input>
          </b-input-group>
        </b-col>-->

        <!-- Button -->
        <!--<b-col cols="12" md="auto" class="mt-4 mt-md-0 pl-md-0">
          <b-button
            class="w-100 w-md-auto"
            style="background-color: #fdd071; color: black; border:#fdd071;"
          >
            <i class="fa fa-plus"></i> Subdomain
          </b-button>
        </b-col>
      </b-row> -->

      <br />
    </b-container>
  </div>
</template>

<script>
import { data } from "jquery";

export default {
  name: "SettingHead",

  data() {
    return {
      search1: "",
      searchQuery: "",

      items: {},
    };
  },
  methods: {
    search() {
      console.log("Search for:", this.search1);
    },
    async apiList() {
      try {
        var config = {
          method: "get",
          url: "http://localhost:3000/api/v2/monitor/getSetting",
          params: {
            domain_id: 1,
          },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        };

        const response = await this.axios(config);
        this.items = response.data; // สมมติว่าข้อมูลอยู่ใน `response.data`
        console.log("API Response:", response.data); // สำหรับตรวจสอบผลลัพธ์
      } catch (error) {
        console.error("Error while fetching API:", error);
        // ตรวจสอบข้อผิดพลาดเพิ่มเติม
        if (error.response) {
          // เซิร์ฟเวอร์ตอบกลับด้วยข้อผิดพลาด
          console.error("Response Error:", error.response.data);
          console.error("Status Code:", error.response.status);
        } else if (error.request) {
          // ไม่มีการตอบกลับจากเซิร์ฟเวอร์
          console.error("No Response:", error.request);
        } else {
          // เกิดข้อผิดพลาดระหว่างการตั้งค่าคำขอ
          console.error("Request Setup Error:", error.message);
        }
      }
    },
  },
  mounted() {
    this.apiList();
  },
};
</script>

<style scoped>
h2 {
  color: black;
}

.title {
  margin-bottom: 20px;
}

.b-input-group {
  width: 100%; /* จำกัดความกว้างช่องค้นหา */
}

b-button {
  font-weight: bold;
  font-size: 16px;
}

.search-icon {
  background-size: 16px 16px;
  background-repeat: no-repeat;
  background-position: center;
  width: 16px;
  height: 16px;
  margin-right: 10px;
}

.search-input {
  border: none;
  outline: none;
  /* flex-grow: 1; */
  background: none;
  font-size: 14px;
  color: #333;
}

.search-input::placeholder {
  color: #9e9c9c;
}

* {
  font-family: "Prompt", "FontAwesome", sans-serif;
}
#content {
  max-width: 93%;
  margin: auto;
  background: white;
  /* min-height: 100vh; */
  padding: 0;
  overflow: auto;
}

</style>