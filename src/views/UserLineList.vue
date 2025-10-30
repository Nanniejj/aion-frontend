<template>
  <div>
    <div class="head-nav">
      <div
      class="h5 right-0 px-3 pt-3 no-print position-absolute text-gp"
       @click="$route.query.from ? $router.push({ name: $route.query.from }) : $router.back()"
      style="cursor:pointer;"
    >
      <span

      >
        <i class="fa fa-angle-left text-gp" aria-hidden="true"></i> กลับ</span
      >
      <span></span>
    </div>
    </div>

    <div class="container py-5">
      
      <div class="idx">
        <!-- <h3 class="mb-4 text-center font-weight-bold text-white h1">Aion Alert</h3> -->
        <div class="text-gp text-center" style="position: relative;">
          <!-- <div>
            <div style="font-size: 108px;position: absolute;left:450px;top:-32px;font-weight: 300;">A</div>
            <h1 class="mb-2">
              <span class="ml-2"> </span>ion<br />
              <span class="ml-3"> </span>lert
            </h1>
          </div> -->
          <h1 class="mb-2">
            <span class="h1">A</span>ion<br />
            <span class="h1">A</span>lert
          </h1>
          <p class="text-lg italic" style="font-size: large;">Always Aware. Always Alert.</p>
        </div>
        <b-row>
          <b-col cols="12" md="3">
            <b-form-select v-model="selected" :options="options" class="inputbox-white my-1"></b-form-select>
          </b-col>
          <b-col cols="12" md="9"> <b-form-input v-model="searchText" placeholder="🔍 Search Users"
              class="mb-4 placeholder-white my-1" />
          </b-col>
        </b-row>
        <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
        <b-spinner v-if="loading" label="Loading..." class="mb-3" />
        <div class="text-left h5 my-1 text-white text-gp" v-if="selected == 'line'">
          <img width="40" height="40" src="https://img.icons8.com/fluency-systems-regular/48/776167/line-me.png"
            alt="line-me" /> Total <span class="h4 mx-1">{{ filteredUsers.length || 0 }} </span> <b-icon
            icon="people"></b-icon>
          <b-button variant="light" size="sm" class="ml-3 text-gp" @click="showQR = true" pill>
            <i class="fa fa-qrcode" aria-hidden="true" style="color: #17a2b8;"></i> QR Code
          </b-button>
        </div>

        <TelegramGroupList v-if="selected == 'telegram'" :domain="domain" :searchText="searchText" />

        <div class="d-flex flex-wrap justify-content-center" v-if="selected == 'line'">
          <div v-for="user in filteredUsers" :key="user._id"
            class="user-card shadow-sm rounded-lg m-3 p-3 text-center bg-white py-5">
            <img :src="user.pictureUrl" alt="Profile" class="avatar mb-2" />
            <h5 class="mb-1 truncate-230">{{ user.displayName }}</h5>
            <!-- <p class="text-muted small mb-1">ID: {{ user.userId }}</p> -->
            <!-- <p class="text-muted small mb-2">Updated: {{ formatDate(user.updatedAt) }}</p> -->
            <!-- {{ user.status }} -->
            <b-badge :variant="user.status ? 'success' : 'secondary'" class="mx-2 my-1 mb-3">
              <span class="h6">{{ user.status ? 'Active' : 'Inactive' }}</span>
            </b-badge>
            <div>
              <b-button :variant="user.status ? 'outline-secondary' : 'outline-success'" block pill
                @click="confirmToggle(user)" class="mx-1">
                {{ user.status ? 'Inactive' : 'Active' }}
              </b-button>
              <b-button variant="info" class="mx-1" @click="openSetting(user)" block pill v-b-modal.modal-scrollable>⚙
                Setting</b-button>
            </div>
          </div>
        </div>

      </div>

      <!-- Modal ตั้งค่า -->
      <b-modal v-model="showSettingModal" hide-footer size="lg" centered body-class="px-4 py-3 rounded" scrollable
        id="modal-scrollable">

        <div class="mb-3 px-2">

          <div class="mt-2 text-muted small" v-if="selectedUser">
            <b-row>
              <b-col cols="3"> <b-img :src="selectedUser.pictureUrl" width="100" alt="Profile" class="mb-2"
                  style="width: 100%;border-radius: 20px;"></b-img></b-col>
              <b-col cols="8">
                <div class="h3">{{ selectedUser.displayName }} <b-badge
                    :variant="selectedUser.status ? 'success' : 'secondary'" class="mx-2 my-1 mb-3">
                    <span class="h6">{{ selectedUser.status ? 'Active' : 'Inactive' }}</span>
                  </b-badge></div>
                <div class="">ID : {{ selectedUser.userId }}</div>
                <div class="my-2">
                  <div class="text-muted" v-if="setting.createdAt">createdAt: {{ formatDate(setting.createdAt) }}
                  </div>
                  <div class="text-muted" v-if="setting.createdAt">updatedAt: {{ formatDate(setting.updatedAt) }}
                  </div>
                </div>
                <span class="fa fa-trash-alt text-danger pointer" v-b-tooltip.hover title="ลบ"
                  @click="confirmDelete(selectedUser)"> </span>
              </b-col>
            </b-row>


          </div>

          <label class="">Domain</label>
          <v-select class="mb-3" :options="domain" v-model="setting.domain_idText" id="search-input"
            placeholder="เลือก Domain" label="name" :reduce="item => item.id" @input="selectDomain" />
          <v-select class="mb-3" :options="subdomain" v-model="setting.subdomain_idText" id="search-input"
            placeholder="เลือก Subdomain" label="subdomain_name" :reduce="item => item.subdomain_id" multiple
            @input="selectSubdomain" />
          <v-select class="mb-3" :options="filteredObjects" v-model="setting.object_idText" id="search-input"
            placeholder="เลือก Object" label="object_name" :reduce="item => item.object_id" multiple
            :disabled="!setting.subdomain_idText || setting.subdomain_idText.length === 0" />

          <!-- Sentiment Selector -->
          <label class="">Sentiment</label>
          <v-select class="mb-3" v-model="setting.sentimentText" :options="sentimentOptions" label="label"
            :reduce="option => option.value" multiple placeholder="เลือก Sentiment" />

          <!-- Keywords -->
          <b-form-group label="คำค้นหา (เช่น: PM2.5, ไฟป่า)" class="mb-3">
            <b-form-tags v-model="setting.querySearchText" separator=",;" placeholder="เพิ่มคำค้นหาด้วย , หรือ Enter" />
          </b-form-group>

          <!-- Hashtags -->
          <b-form-group label="Hashtags (ไม่ใส่ #)" class="mb-3">
            <b-form-tags v-model="setting.hashtagsText" separator=",;" placeholder="เพิ่มแฮชแท็กด้วย , หรือ Enter" />
          </b-form-group>


          <!-- เพิ่มโค้ดใน modal ตั้งค่าแทนส่วน "Date Range" ด้านล่าง -->
          <b-form-group label="เลือกช่วงเวลาย้อนหลัง">
            <div class="d-flex">
              <b-form-input v-model.number="setting.durationValue" type="number" min="1" placeholder="จำนวน"
                class="mr-2" />
              <b-form-select v-model="setting.durationUnit" :options="durationUnits" />
            </div>
          </b-form-group>

          <!-- แสดง input แบบ custom เมื่อเลือก 'custom' -->
          <div v-if="setting.durationUnit === 'custom'" class="d-flex justify-content-between">
            <b-form-group label="Start Date" class="w-50 pr-2">
              <b-form-input v-model="setting.start_date" type="datetime-local" />
            </b-form-group>
            <b-form-group label="End Date" class="w-50 pl-2">
              <b-form-input v-model="setting.end_date" type="datetime-local" />
            </b-form-group>
          </div>
          <!-- {{ setting.statusAlert }} -->

          <div>
            <b-form-checkbox v-model="setting.statusAlert" switch class="my-2">
              🔔 Spike Alert <small> เปิดเเจ้งเตือนสำหรับดูแนวโน้มการเพิ่มขึ้นของ <span
                  style="background-color: #fbecb4;padding: 4px 6px;border-radius: 10px;">โพสต์/วัน</span> </small>
            </b-form-checkbox>
            <div class="d-flex " v-if="setting.statusAlert">
              <b-form-input type="number" v-model.number="setting.spikePosts" min="1" placeholder="กรอกจำนวนโพสต์"
                class="w-50 mr-3" />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="text-center mt-4">
            <b-button variant="primary" class="mx-2 px-4" @click="saveSetting(selectedUser)"
              style="background-color:#17a2b8;border-color:#17a2b8;">💾 บันทึก</b-button>
            <b-button variant="outline-secondary" class="mx-2 px-4" @click="cancelSetting">❌ ยกเลิก</b-button>
          </div>

        </div>

      </b-modal>


      <!-- Modal ยืนยันการเปลี่ยนสถานะ -->
      <b-modal v-model="showToggleModal" hide-footer>
        <div class="text-center py-3">
          <div class="h5">ยืนยันการเปลี่ยนสถานะ</div>
          คุณต้องการเปลี่ยนสถานะของ "{{ selectedUser && selectedUser.displayName }}" หรือไม่?
          <div class="mt-3">
            <b-button variant="primary" class="mx-2" @click="toggleStatus"
              style="background-color:#17a2b8;border-color:#17a2b8;">ยืนยัน</b-button>
            <b-button variant="secondary" class="mx-2" @click="cancelToggle">ยกเลิก</b-button>
          </div>
        </div>
      </b-modal>

      <!-- Modal ยืนยันการลบ -->
      <b-modal v-model="showDeleteModal" hide-footer>
        <div class="text-center py-3">
          <div class="h5">ยืนยันการลบข้อมูล</div>
          คุณแน่ใจหรือไม่ว่าต้องการลบ "{{ selectedUser && selectedUser.displayName }}" ?
          <div class="mt-3">
            <b-button variant="danger" class="mx-2" @click="deleteUser">ยืนยัน</b-button>
            <b-button variant="secondary" class="mx-2" @click="cancelDelete">ยกเลิก</b-button>
          </div>
        </div>
      </b-modal>

      <!-- Modal QR Code -->
      <b-modal v-model="showQR" hide-footer centered>
        <div class="text-center mt-4">
          <div>QR Code สำหรับเข้ากลุ่ม LINE</div>
          <img :src="lineQRUrl" alt="LINE QR" class="img-fluid" style="max-width: 300px;" />

          <!-- ✅ ทำให้คลิกแล้วคัดลอก ID ได้ -->
          <div>
            <b-button v-b-tooltip.hover="tooltipMessage" @click="copyLineId" pill variant="outline-success">
              @964ufjlg
            </b-button>
          </div>
          <p class="mt-3">สแกนเพื่อเข้าร่วมกลุ่ม LINE</p>

        </div>
      </b-modal>

    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from "moment";
import TelegramGroupList from '../components/alert/TelegramGroupList.vue';
import "vue-select/dist/vue-select.css";

export default {
  name: 'LineUserManager',
  components: {
    TelegramGroupList
  }
  ,
  watch: {
    'setting.domain_idText'(newVal, oldVal) {
      this.getSubdomain()
    },
  },

  data() {
    return {
      tooltipMessage: '',
      copied: false,
      lineId: '@964ufjlg',
      lineQRUrl: 'https://qr-official.line.me/sid/L/964ufjlg.png',
      showQR: false,
      selected: 'telegram',
      options: [
        // { value: null, text: 'Please select an option' },
        { value: 'telegram', text: 'Telegram' },
        { value: 'line', text: 'LINE' },
      ],
      allSubdomainData: [],
      durationValue: 1,
      durationUnit: 'hours', // default
      durationUnits: [
        { value: 'minutes', text: 'นาที' },
        { value: 'hours', text: 'ชั่วโมง' },
        { value: 'days', text: 'วัน' },
        { value: 'weeks', text: 'สัปดาห์' },
        { value: 'custom', text: 'ระบุวันและเวลาเอง' }
      ],
      sentimentOptions: [
        { label: 'บวก', value: 1 },
        { label: 'กลาง', value: 0 },
        { label: 'ลบ', value: -1 }
      ],
      select_domain: null,
      domain: [],
      subdomain: [],
      object: [],
      users: [],
      searchText: '',
      loading: false,
      error: null,
      selectedUser: null,
      showSettingModal: false,
      showToggleModal: false,
      showDeleteModal: false,
      setting: {
        object_idText: [],
        subdomain_idText: [],
        domain_idText: [],
        sentimentText: [],
        querySearchText: [],     // เดิมเป็น string → array
        hashtagsText: [],        // เดิมเป็น string → array
        start_date: '',
        end_date: '',
      }


    }
  },
  computed: {

    filteredUsers() {
      return this.users
        .filter(u => u.displayName?.toLowerCase().includes(this.searchText.toLowerCase()))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    },
    filteredObjects() {
      if (!this.setting.subdomain_idText || this.setting.subdomain_idText.length === 0) return [];

      // รวม objects จากทุก subdomain ที่ถูกเลือก
      const objects = this.allSubdomainData
        .filter(sd => this.setting.subdomain_idText.includes(sd.subdomain_id))
        .flatMap(sd => sd.objects || []);

      return objects;
    }
  },
  mounted() {
    this.getDomain()
    // this.$store.dispatch("fetchTemplateDomain");
    this.fetchUsers()
  },
  methods: {
    async copyLineId() {
      try {
        await navigator.clipboard.writeText(this.lineId);
        this.tooltipMessage = 'คัดลอกแล้ว!';

        // รีเซ็ต tooltip กลับเป็นค่าเดิมหลัง 2 วินาที
        setTimeout(() => {
          this.tooltipMessage = 'คลิกเพื่อคัดลอก';
        }, 2000);
      } catch (err) {
        this.tooltipMessage = 'ไม่สามารถคัดลอกได้';
      }
    }
    ,
    selectSubdomain() {
      this.setting.object_idText = []
    },
    selectDomain() {
      this.setting.subdomain_idText = []
      this.setting.object_idText = []
    },
    async getSubdomain() {
      const domainId = this.setting.domain_idText
      const config = {
        method: "get",
        url: "https://api2.cognizata.com/api/v2/setting/getSetting?domain_id=" + domainId,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };

      try {
        const res = await this.axios(config);
        const subdomains = res.data?.subdomains || [];

        this.subdomain = subdomains.map(s => ({
          subdomain_id: s.subdomain_id,
          subdomain_name: s.subdomain_name
        }));

        this.allSubdomainData = subdomains; // เก็บทั้ง subdomain และ objects ไว้ใช้ต่อ
      } catch (error) {
        console.error(error);
      }
    }
    ,
      async getDomain() {
        const config = {
            method: "get",
            url: "https://api2.cognizata.com/api/v2/domain/getDomainlist",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
        };
      try {
        const res = await axios(config)
        this.domain = res.data?.data || []
        // console.log(res);

      } catch (err) {
        this.error = 'ไม่สามารถโหลดข้อมูลผู้ใช้งานได้'
      } finally {
      }
    },
    async fetchUsers() {
      this.loading = true
      try {
        const res = await axios.get('https://api2.cognizata.com/api/v2/alert/getuserline')
        this.users = res.data
      } catch (err) {
        this.error = 'ไม่สามารถโหลดข้อมูลผู้ใช้งานได้'
      } finally {
        this.loading = false
      }
    },
    formatDate(date) {
      return moment(date).format('llll');
    },
    confirmToggle(user) {
      this.selectedUser = user
      this.showToggleModal = true
    },
    cancelToggle() {
      this.selectedUser = null
      this.showToggleModal = false
    },
    async toggleStatus() {
      try {
        const res = await axios.patch(
          `https://api2.cognizata.com/api/v2/alert/updateuserline/${this.selectedUser._id}`
        )
        const updatedUser = res.data
        const index = this.users.findIndex(u => u._id === updatedUser._id)
        if (index !== -1) this.users.splice(index, 1, updatedUser)
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ')
      } finally {
        this.selectedUser = null
        this.showToggleModal = false
      }
    },
    confirmDelete(user) {
      this.selectedUser = user
      this.showDeleteModal = true

    },
    async deleteUser() {
      try {
        await axios.delete(
          `https://api2.cognizata.com/api/v2/alert/deleteuserline/${this.selectedUser._id}`
        )
        this.users = this.users.filter(u => u._id !== this.selectedUser._id)
      } catch (err) {
        alert('ลบข้อมูลไม่สำเร็จ')
      } finally {
        this.selectedUser = null
        this.showDeleteModal = false
        this.cancelSetting()
      }
    },
    cancelDelete() {
      // this.selectedUser = null
      this.showDeleteModal = false
    }
    ,
    async openSetting(user) {
      this.selectedUser = user;

      try {
        const res = await axios.get(`https://api2.cognizata.com/api/v2/alert/getsetting/${user.userId}`);
        const s = res.data || {};

        // ✨ Step 1: Set domain ก่อนเพื่อให้ watch trigger
        this.setting.domain_idText = s.domain_id || [];

        // ✨ Step 2: โหลด subdomain และ object ก่อนจะใส่ subdomain / object ที่มาจาก API
        await this.getSubdomain();

        // ✨ Step 3: ใส่ค่าที่เหลือ โดยไม่โดน watch เคลียร์
        this.setting.subdomain_idText = s.subdomain_id || [];
        this.setting.object_idText = s.object_id || [];
        this.setting.sentimentText = s.sentiment || [];
        this.setting.querySearchText = s.querySearch || [];
        this.setting.hashtagsText = s.hashtags || [];
        this.setting.durationValue = s.durationValue || 1;
        this.setting.durationUnit = s.durationUnit || 'hours';
        this.setting.start_date = s.start_date || '';
        this.setting.end_date = s.end_date || '';
        this.setting.updatedAt = s.updatedAt || '';
        this.setting.createdAt = s.createdAt || '';
        this.setting.statusAlert = s.statusAlert || false;
        this.setting.spikePosts = s.spikePosts || null;

        this.showSettingModal = true;

      } catch (e) {
        alert('โหลดการตั้งค่าไม่สำเร็จ');
      }
    }
    ,
    async saveSetting(user) {
      // console.log('user',user);

      const payload = {
        domain_id: this.setting.domain_idText.filter(Boolean),
        subdomain_id: this.setting.subdomain_idText.filter(Boolean),
        object_id: this.setting.object_idText.filter(Boolean),
        sentiment: this.setting.sentimentText.filter(e => [-1, 0, 1].includes(e)),
        querySearch: this.setting.querySearchText.filter(Boolean),
        hashtags: this.setting.hashtagsText.filter(Boolean),
        durationValue: this.setting.durationValue || null,
        durationUnit: this.setting.durationUnit || null,
        start_date: this.setting.durationUnit === 'custom' ? this.setting.start_date || null : null,
        end_date: this.setting.durationUnit === 'custom' ? this.setting.end_date || null : null,
        status: user.status,
        statusAlert: this.setting.statusAlert || false,
        spikePosts: this.setting.spikePosts || null,
        lastSentPostId: null
      }

      try {
        await axios.put(`https://api2.cognizata.com/api/v2/alert/updatesetting/${this.selectedUser.userId}`, payload)
        alert('บันทึกสำเร็จ')
        this.showSettingModal = false
      } catch (err) {
        alert('บันทึกไม่สำเร็จ')
      }
    },
    cancelSetting() {
      this.selectedUser = null
      this.showSettingModal = false
    }
  }
}
</script>
<style>
.text-gp {
  color: #776167 !important
}
</style>
<style scoped>
.truncate-230 {
  max-width: 230px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-outline-success {
  color: #00b27a;
  border-color: #00b27a;
}

.btn-outline-success:hover {
  color: #fff;
  background-color: #00b27a;
  border-color: #00b27a !important;
}

.badge-secondary {
  padding: 5px 17px;
  border-radius: 20px;
}

.badge-success {
  background-color: #00b27a;
  padding: 5px 20px;
  border-radius: 20px;
}

.placeholder-white::placeholder {
  color: #776167 !important;
}

.inputbox-white {
  color: rgb(65, 65, 66) !important;
  text-align: center;
  height: 47px;
  display: block;
  width: 100%;
  /* height: calc(1.5em + .75rem + 2px); */
  padding: .375rem .75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  background-color: #ffffffb8;
  background-clip: padding-box;
  border: 1px solid #ffffff8a;
  border-radius: 2.25rem;
  transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}

.placeholder-white.form-control {
  color: rgb(65, 65, 66) !important;
  height: 47px;
  display: block;
  width: 100%;
  /* height: calc(1.5em + .75rem + 2px); */
  padding: .375rem .75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  background-color: #ffffffb8;
  background-clip: padding-box;
  border: 1px solid #ffffff8a;
  border-radius: 2.25rem;
  transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}

.idx {
  z-index: 9 !important;
  position: relative;
}

.head-nav {
  background-image: linear-gradient(to right, #fed06ea4, #f0cfda);
  /* background: #22C1C3;
  background-image: linear-gradient(to right, #051937, #004d7a, #008793, #00bf72, #afdd4a); */

  height: 400px;
  width: 100%;
  position: absolute;
  top: 0;
  z-index: 0;
}

.user-card {
  transition: transform 0.2s ease;
  border: 1px solid #eee;
  z-index: 9999;
  width: 280px;
  height: auto;
}

.user-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  /* border: 3px solid #f0f0f0; */
}

.pointer {
  cursor: pointer;
}
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .inputbox-white, .placeholder-white.form-control{
    height: 38px;
}
}
</style>