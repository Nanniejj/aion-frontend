<template>
  <span>
    <div>
      <b-container>
        <b-row>
          <!-- Dropdown Party -->
          <b-col md="6" class="mb-4">
            <v-select
              :options="parties"
              label="name"
              placeholder="Select Party"
              v-model="selectedParty"
              @input="onPartySelect"
              class="custom-dropdown"
            ></v-select>
          </b-col>

          <!-- Dropdown Politician -->
          <b-col md="6" class="mb-4">
            <v-select
              :options="filteredPolitician"
              label="fullName"
              placeholder="Select Politician"
              v-model="selectedCandidate"
              :disabled="!selectedParty"
              class="custom-dropdown"
            ></v-select>
          </b-col>
        </b-row>

        <!-- Role and Name Inputs -->
        <b-row>
          <b-col md="6" class="mb-4">
            <label for="role" class="form-label">Role</label>
            <v-select
              id="role"
              v-model="position.role"
              :options="['member', 'influencer']"
              class="custom-dropdown"
              placeholder="Select Role"
            ></v-select>
          </b-col>

          <b-col md="6" class="mb-4">
            <label for="name" class="form-label">Name</label>
            <input
              id="name"
              type="text"
              class="form-control"
              v-model="position.name"
              placeholder="Enter Name"
              autocomplete="off"
            />
          </b-col>
        </b-row>

        <!-- Social Media Inputs -->
        <b-row>
          <b-col
            md="12"
            class="mb-3"
            v-for="(platform, index) in socialPlatforms"
            :key="index"
          >
            <div class="d-flex align-items-center">
              <!-- ใช้ <img> แทนไอคอน -->
              <img
                :src="platform.icon"
                :alt="platform.label"
                class="icon-circle"
              />
              <div class="w-100 ms-3">
                <label :for="platform.name" class="form-label">{{
                  platform.label
                }}</label>
                <input
                  :id="platform.name"
                  type="text"
                  class="form-control"
                  v-model="platform.link"
                  :placeholder="'Enter ' + platform.label + ' URL'"
                  autocomplete="off"
                />
              </div>
            </div>
          </b-col>
        </b-row>

        <!-- ปุ่มบันทึก -->
        <b-row>
          <b-col md="12" class="text-center">
            <b-button
              variant="success"
              class="btn-save"
              :disabled="!selectedCandidate"
              @click="saveData"
            >
              บันทึก
            </b-button>
          </b-col>
        </b-row>

        <!-- Status Message -->
        <b-row v-if="statusMessage" class="mt-3">
          <b-col md="12" class="text-center">
            <div class="alert" :class="statusClass">{{ statusMessage }}</div>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </span>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  name: "CreateCandidatesPosts",
  components: { vSelect },
  data() {
    return {
      parties: [], // รายชื่อพรรคที่ได้จาก API
      candidates: [], // รายชื่อผู้สมัครที่ได้จาก API
      filteredPolitician: [], // ผู้สมัครที่กรองตาม Party
      selectedParty: null, // พรรคที่เลือก
      selectedCandidate: null, // ผู้สมัครที่เลือก
      socialPlatforms: [
        {
          name: "facebook",
          label: "Facebook",
          icon: require("@/assets/Facebook.png"),
          link: "",
        },
        {
          name: "twitter",
          label: "X",
          icon: require("@/assets/Twitter.png"),
          link: "",
        },
        {
          name: "instagram",
          label: "Instagram",
          icon: require("@/assets/Instagram.png"),
          link: "",
        },
        {
          name: "tiktok",
          label: "TikTok",
          icon: require("@/assets/Tiktok.png"),
          link: "",
        },
        {
          name: "youtube",
          label: "Youtube",
          icon: require("@/assets/Youtube.png"),
          link: "",
        },
      ],
      position: {
        role: "", // ค่าเริ่มต้นของ role
        name: "", // ค่าเริ่มต้นของ name
      },
      statusMessage: "", // ข้อความแสดงสถานะ
      statusClass: "", // สไตล์ข้อความสถานะ
    };
  },
  methods: {
    async apiList() {
      try {
        const partiesResponse = await this.axios.get(
          "https://api2.cognizata.com/api/v2/monitor/getParties",
          // "http://localhost:3000/api/v2/monitor/getParties"
          {
            headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      }
        );
        this.parties = partiesResponse.data.data;

        const candidatesResponse = await this.axios.get(
          "https://api2.cognizata.com/api/v2/monitor/getCandidates",
          {
            headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      }
        );
        this.candidates = candidatesResponse.data.data
      .map((candidate) => ({
        ...candidate,
        fullName: `${candidate.first_name} ${candidate.last_name}`, // สร้าง fullName
      }))
      .sort((a, b) => a.fullName.localeCompare(b.fullName, "th"));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    onPartySelect(party) {
      this.selectedParty = party;
      this.selectedCandidate = null;
      this.filteredPolitician = this.candidates.filter(
        (candidate) => candidate.party_id === party.id
      );
    },

    async saveData() {
      if (
        // !this.selectedCandidate ||
        !this.position.role ||
        !this.position.name
      ) {
        this.statusMessage = "กรุณากรอกข้อมูลให้ครบถ้วนก่อนบันทึก";
        this.statusClass = "alert-warning";
        return;
      }
      const targets = this.socialPlatforms
        .filter((platform) => platform.link.trim())
        .map((platform) => ({
          link_crawl: platform.link.trim(),
          source: platform.name,
        }));

      if (targets.length === 0) {
        this.statusMessage = "กรุณากรอกช่องทางการติดตามก่อนบันทึก";
        this.statusClass = "alert-warning";
        return;
      }

      const payload = {
        party_id: this.selectedParty.id,
        id: this.selectedCandidate.id,
        position: {
          role: this.position.role.trim(),
          name: this.position.name.trim(),
        },
      };
      try {
        const response = await this.axios.put(
          "https://api2.cognizata.com/api/v2/monitor/addPosition",
          payload,
          {
            headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      }
        );
        this.statusMessage = "บันทึกข้อมูลสำเร็จ!";
        this.statusClass = "alert-success";
        console.log("Data saved successfully:", response.data);
      } catch (error) {
        this.statusMessage =
          "เกิดข้อผิดพลาดในการบันทึกข้อมูล Position กรุณาลองใหม่!";
        this.statusClass = "alert-danger";
        console.error("Error saving data:", error);
      }
      try {
        const response = await this.axios.post(
          "https://api2.cognizata.com/api/v2/monitor/postTarget",
          { targets },
      {
        headers: {
          Authorization: `Bearer YOUR_ACCESS_TOKEN_HERE`, // ใส่ Token ของคุณ
        },
      }
        );
        this.statusMessage = "บันทึกข้อมูลสำเร็จ!";
        this.statusClass = "alert-success";
        console.log("Data saved successfully:", response.data);
      } catch (error) {
        this.statusMessage =
          "เกิดข้อผิดพลาดในการบันทึกข้อมูล URL กรุณาลองใหม่!";
        this.statusClass = "alert-danger";
        console.error("Error saving data:", error);
      }
    },
  },
  mounted() {
    this.apiList();
  },
};
</script>

<style scoped>
.custom-dropdown .v-select {
  width: 100%;
}

.custom-dropdown .vs__dropdown-menu {
  z-index: 1050; /* ให้ dropdown แสดงอยู่ด้านบน */
}

.icon-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  margin-top: 25px;
}

.btn-save {
  background-color: #50c1d0;
  /* background-color: #fdd071; */
  color: white; /* สีตัวอักษร */
  font-size: 16px; /* ขนาดตัวอักษร */
  padding: 10px 20px; /* ระยะห่างด้านใน */
  border: none; /* ลบกรอบ */
  border-radius: 5px; /* มุมโค้งมน */
  cursor: pointer; /* เปลี่ยนเคอร์เซอร์เมื่อ hover */
}

.alert {
  font-size: 16px;
  padding: 10px;
}

.alert-warning {
  color: #856404;
  background-color: #fff3cd;
  border-color: #ffeeba;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}
</style>
