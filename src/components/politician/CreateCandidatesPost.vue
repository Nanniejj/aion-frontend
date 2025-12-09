<template>
  <span>
    <div>
      <b-container>
        <b-row>
          <!-- Dropdown Party -->
          <b-col md="6" class="mb-4">
            <v-select :options="parties" label="name" placeholder="Select Party" v-model="selectedParty"
              @input="onPartySelect" class="custom-dropdown"></v-select>
          </b-col>

          <!-- Dropdown Politician -->
          <b-col md="6" class="mb-4">
            <v-select :options="filteredPolitician" label="fullName" placeholder="Select Politician"
              v-model="selectedCandidate" :disabled="!selectedParty" class="custom-dropdown"></v-select>
          </b-col>
        </b-row>

        <!-- Role and Name Inputs -->
        <b-row>
          <b-col md="6" class="mb-4">
            <label for="role" class="form-label">Role</label>
            <v-select id="role" v-model="position.role" :options="['member', 'influencer']" class="custom-dropdown"
              placeholder="Select Role"></v-select>
          </b-col>

          <b-col md="6" class="mb-4">
            <label for="name" class="form-label">Name</label>
            <input id="name" type="text" class="form-control" v-model="position.name" placeholder="Enter Name"
              autocomplete="off" />
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <!-- {{ location }} -->
            <b-form-group label="จังหวัด">
              <v-select class="input" :options="provinces" label="text" :reduce="province => province.value"
                v-model="selectedProvince" placeholder="เลือกจังหวัด" @input="apiGetDistrict" />
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group label="อำเภอ">
              <v-select :options="districts" label="text" :reduce="district => district.value"
                v-model="selectedDistrict" :disabled="!selectedProvince" placeholder="เลือกอำเภอ"
                @input="apiGetSubDistrict" />
            </b-form-group></b-col>
          <b-col>
            <b-form-group label="ตำบล">
              <v-select :options="subDistricts" label="text" :reduce="subDistrict => subDistrict.value"
                v-model="selectedSubdistrict" :disabled="!selectedDistrict" placeholder="เลือกตำบล" />
            </b-form-group></b-col>
        </b-row>


        <!-- Social Media Inputs -->
        <b-row>
          <b-col md="12" class="mb-3" v-for="(platform, index) in socialPlatforms" :key="index">
            <div class="d-flex align-items-center">
              <!-- ใช้ <img> แทนไอคอน -->
              <img :src="platform.icon" :alt="platform.label" class="icon-circle" />
              <div class="w-100 ms-3">
                <label :for="platform.name" class="form-label">{{
                  platform.label
                }}</label>
                <input :id="platform.name" type="text" class="form-control" v-model="platform.link"
                  :placeholder="'Enter ' + platform.label + ' URL'" autocomplete="off" />
              </div>
            </div>
          </b-col>
        </b-row>

        <!-- ปุ่มบันทึก -->
        <b-row>
          <b-col md="12" class="text-center">
            <b-button variant="success" class="btn-save" :disabled="!selectedCandidate" @click="saveData">
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
import "vue-select/dist/vue-select.css";

export default {
  name: "CreateCandidatesPosts",
  components: { vSelect },
  computed: {
    location: {
      get() {
        if (!this.selectedProvince && !this.selectedDistrict && !this.selectedSubdistrict) {
          return [];
        }
        return [
          this.selectedProvince,
          this.selectedDistrict,
          this.selectedSubdistrict
        ].filter(v => v != null);
      },
      set(newVal) {
        this.filterRules.location = newVal;
      }
    }
  },
  data() {
    return {
      selectedProvince: null,
      selectedDistrict: null,
      selectedSubdistrict: null,
      provinces: [],
      districts: [],
      subDistricts: [],
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
    async apiGetProvinces() {
      this.load = true;
      const config = {
        method: "get",
        url: "https://api2.cognizata.com/api/v2/location/getProvinces",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };

      this.axios(config)
        .then((response) => {
          let result = response.data.data || [];
          console.log(result);

          this.provinces = result.map(province => ({
            text: province.name_th,
            value: province.id
          }));
          console.log('this.provinces ', this.provinces);

          // this.profile = response.data?.profile
          // console.log('this.profile ', this.profile);
          this.load = false;
        })
        .catch((error) => {
          this.load = false;
          console.error(error);
        });
    },
    async apiGetDistrict(id) {
      this.selectedDistrict = null;
      this.selectedSubdistrict = null;
      try {
        const config = {
          method: "get",
          url: "https://api2.cognizata.com/api/v2/location/getAmphures",
          params: { province_id: id },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        };

        const response = await this.axios(config);
        const result = response.data.data || [];

        this.districts = result.map(district => ({
          text: district.name_th,
          value: district.id
        }));
        console.log(this.districts);

      } catch (error) {
        console.error("apiGetDistrict error:", error);
        this.districts = [];
      }
    },
    async apiGetSubDistrict(id) {
      this.selectedSubdistrict = null;
      try {
        const config = {
          method: "get",
          url: "https://api2.cognizata.com/api/v2/location/getTambons",
          params: { amphure_id: id },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        };

        const response = await this.axios(config);
        const result = response.data.data || [];

        this.subDistricts = result.map(subDistrict => ({
          text: subDistrict.name_th,
          value: subDistrict.id
        }));

        console.log(this.subDistricts);

      } catch (error) {
        console.error("apiGetDistrict error:", error);
        this.subDistricts = [];
      }

    },
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

      const target = this.socialPlatforms
        .filter((platform) => platform.link.trim())
        .map((platform) => ({
          link_crawl: platform.link.trim(),
          source: platform.name,
        }));

      if (target.length === 0) {
        this.statusMessage = "กรุณากรอกช่องทางการติดตามก่อนบันทึก";
        this.statusClass = "alert-warning";
        return;
      }

      const hasLocation = this.location && this.location.length > 0;

      const payload = {
        party_id: this.selectedParty.id,
        id: this.selectedCandidate.id,
        position: {
          role: this.position.role.trim(),
          name: this.position.name.trim(),
        },
        ...(hasLocation ? { location: this.location } : {}),
      };

      // ใช้ตัวแปรเช็คว่าบันทึกสำเร็จทั้ง 2 ตัว
      let isPositionSaved = false;
      let isTargetSaved = false;

      // ====== addPosition ======
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
        isPositionSaved = true;
        this.statusMessage = "บันทึกข้อมูลสำเร็จ!";
        this.statusClass = "alert-success";
        console.log("Data saved successfully (position):", response.data);
      } catch (error) {
        this.statusMessage =
          "เกิดข้อผิดพลาดในการบันทึกข้อมูล Position กรุณาลองใหม่!";
        this.statusClass = "alert-danger";
        console.error("Error saving position data:", error);
      }

      // ====== postTarget ======
      const targetPayload = {
        target,
        candidate_id: this.selectedCandidate.id,
        ...(hasLocation ? { location: this.location } : {}),
      };

      try {
        const response = await this.axios.post(
          "https://api2.cognizata.com/api/v2/monitor/postTarget",
          targetPayload,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        isTargetSaved = true;
        this.statusMessage = "บันทึกข้อมูลสำเร็จ!";
        this.statusClass = "alert-success";
        console.log("Data saved successfully (targets):", response.data);
      } catch (error) {
        this.statusMessage =
          "เกิดข้อผิดพลาดในการบันทึกข้อมูล URL กรุณาลองใหม่!";
        this.statusClass = "alert-danger";
        console.error("Error saving target data:", error);
      }

      // ✅ ถ้าบันทึกสำเร็จทั้ง 2 ส่วนแล้ว ให้ปิด popup
      if (isPositionSaved && isTargetSaved) {
        // ถ้าอยากให้ parent reload ตารางด้วยก็ emit event เพิ่มได้ เช่น 'saved'
        // this.$emit('saved');
        this.$emit("close");
      }
    },


    // async saveData() {
    //   if (
    //     // !this.selectedCandidate ||
    //     !this.position.role ||
    //     !this.position.name
    //   ) {
    //     this.statusMessage = "กรุณากรอกข้อมูลให้ครบถ้วนก่อนบันทึก";
    //     this.statusClass = "alert-warning";
    //     return;
    //   }
    //   const targets = this.socialPlatforms
    //     .filter((platform) => platform.link.trim())
    //     .map((platform) => ({
    //       link_crawl: platform.link.trim(),
    //       source: platform.name,
    //     }));

    //   if (targets.length === 0) {
    //     this.statusMessage = "กรุณากรอกช่องทางการติดตามก่อนบันทึก";
    //     this.statusClass = "alert-warning";
    //     return;
    //   }

    //   const payload = {
    //     party_id: this.selectedParty.id,
    //     id: this.selectedCandidate.id,
    //     position: {
    //       role: this.position.role.trim(),
    //       name: this.position.name.trim(),
    //     },
    //   };
    //   try {
    //     const response = await this.axios.put(
    //       "https://api2.cognizata.com/api/v2/monitor/addPosition",
    //       payload,
    //       {
    //         headers: {
    //           Authorization: "Bearer " + localStorage.getItem("token"),
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     );
    //     this.statusMessage = "บันทึกข้อมูลสำเร็จ!";
    //     this.statusClass = "alert-success";
    //     console.log("Data saved successfully:", response.data);
    //   } catch (error) {
    //     this.statusMessage =
    //       "เกิดข้อผิดพลาดในการบันทึกข้อมูล Position กรุณาลองใหม่!";
    //     this.statusClass = "alert-danger";
    //     console.error("Error saving data:", error);
    //   }
    //   try {
    //     const response = await this.axios.post(
    //       "https://api2.cognizata.com/api/v2/monitor/postTarget",
    //       { targets },
    //       {
    //         headers: {
    //            Authorization: "Bearer " + localStorage.getItem("token"),
    //         },
    //       }
    //     );
    //     this.statusMessage = "บันทึกข้อมูลสำเร็จ!";
    //     this.statusClass = "alert-success";
    //     console.log("Data saved successfully:", response.data);
    //   } catch (error) {
    //     this.statusMessage =
    //       "เกิดข้อผิดพลาดในการบันทึกข้อมูล URL กรุณาลองใหม่!";
    //     this.statusClass = "alert-danger";
    //     console.error("Error saving data:", error);
    //   }
    // },
  },
  async mounted() {
    await this.apiGetProvinces();
    await this.apiList();
  },
};
</script>

<style scoped>
.custom-dropdown .v-select {
  width: 100%;
}

.custom-dropdown .vs__dropdown-menu {
  z-index: 1050;
  /* ให้ dropdown แสดงอยู่ด้านบน */
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
  color: white;
  /* สีตัวอักษร */
  font-size: 16px;
  /* ขนาดตัวอักษร */
  padding: 10px 20px;
  /* ระยะห่างด้านใน */
  border: none;
  /* ลบกรอบ */
  border-radius: 5px;
  /* มุมโค้งมน */
  cursor: pointer;
  /* เปลี่ยนเคอร์เซอร์เมื่อ hover */
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
