<template>
  <div>
    <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
    <b-spinner v-if="loading" label="Loading..." class="mb-3" />

    <div class="text-left h5 my-1 text-gp">
      <img width="45" height="45" src="https://img.icons8.com/sf-regular/48/776167/telegram.png" alt="telegram" />
      Total Groups <span class="h4 mx-1">{{ filteredGroups.length }}</span>
      <b-icon icon="people" />
    </div>

    <div class="d-flex flex-wrap justify-content-center">
      <div v-for="group in filteredGroups" :key="group._id"
        class="user-card shadow-sm rounded-lg m-3 p-3 text-center bg-white py-5">
        <img :src="group.groupPhotoUrl || defaultGroupImage" alt="Group Profile" class="avatar mb-2"
          @error="onImageError" />
        <div class="text-center small">
          <div>Group</div>
        </div>
        <h5 class="mb-1 truncate-230">{{ group.groupTitle || 'Untitled Group' }}</h5>

        <b-badge :variant="group.status ? 'success' : 'secondary'" class="mx-2 my-1 mb-3">
          <span class="h6">{{ group.status ? 'Active' : 'Inactive' }}</span>
        </b-badge>
        <div>
          <b-button :variant="group.status ? 'outline-secondary' : 'outline-success'" block pill
            @click="confirmToggle(group)" class="mx-1">
            {{ group.status ? 'Inactive' : 'Active' }}
          </b-button>
          <b-button variant="info" class="mx-1" @click="openSetting(group)" block pill>
            ⚙ Setting
          </b-button>
        </div>
      </div>
    </div>

    <b-modal v-model="showSettingModal" hide-footer size="lg" centered body-class="px-4 py-3 rounded" scrollable>
      <div class="mb-3 px-2">
        <div class="mt-2 text-muted small" v-if="selectedGroup">
          <b-row>
            <b-col cols="3">
              <b-img :src="selectedGroup.groupPhotoUrl || defaultGroupImage" width="100" alt="Profile" class="mb-2"
                style="width: 100%; border-radius: 20px" @error="onImageError"></b-img>
            </b-col>
            <b-col cols="8">
              <div class="h3">
                {{ selectedGroup.groupTitle }}
                <b-badge :variant="selectedGroup.status ? 'success' : 'secondary'" class="mx-2 my-1 mb-3">
                  <span class="h6">{{ selectedGroup.status ? 'Active' : 'Inactive' }}</span>
                </b-badge>
              </div>
              <div>Group ID : {{ selectedGroup.userId }}</div>
              <div @click="confirmDelete(selectedGroup)" class="my-2 pointer"> <span
                  class="fa fa-trash-alt text-danger pointer" v-b-tooltip.hover title="ลบ"> </span> delete group</div>


<b-row >
            <b-col cols="auto" >
              <div class="h6"> เลือกโหมด</div>
            </b-col>
            <b-col> <b-button-group>


                <b-button :variant="groupMode === 'domain' ? 'info' : 'outline-info'" @click="groupMode = 'domain'"
                  size="sm">Domain</b-button>
                <b-button :variant="groupMode === 'group' ? 'info' : 'outline-info'" @click="groupMode = 'group'"
                  size="sm">Group</b-button>
              </b-button-group></b-col>
          </b-row>

            </b-col>
          </b-row>
          
        </div>

        <div class="mt-2">
          <!-- ...ภายใน <div class="mt-2"> เดิม ก่อน v-select domain ตัวแรก ... -->


          <!-- โหมด Domain: แสดงตัวเลือกเดิม -->
          <div v-if="groupMode === 'domain'">
            <v-select class="mb-3" :options="domain" v-model="groupSetting.domain_idText" label="name"
              :reduce="d => d.id" placeholder="เลือก Domain" @input="selectDomain" />

            <v-select class="mb-3" :options="subdomain" v-model="groupSetting.subdomain_idText" label="subdomain_name"
              :reduce="s => s.subdomain_id" multiple placeholder="เลือก Subdomain" @input="selectSubdomain" />

            <v-select class="mb-3" :options="filteredObjects" v-model="groupSetting.object_idText" label="object_name"
              :reduce="o => o.object_id" multiple
              :disabled="!groupSetting.subdomain_idText || groupSetting.subdomain_idText.length === 0"
              placeholder="เลือก Object" />
          </div>

          <!-- โหมด Group: แสดงตัวเลือก Group จาก API -->
        
          <div v-else>
               <!-- {{ groupOptions }} -->
           
            <v-select class="mb-3" multiple :options="groupOptions" v-model="groupSetting.monitorGroupId"
              :reduce="g => g.group_id" label="group_name" placeholder="ค้นหา/เลือก Group" 
            />
            <div v-if="groupSetting.monitorGroupId" class="text-muted small">
              เลือก: {{ selectedGroupName }}
            </div>
          </div>


          <b-form-group label="คำค้นหา (เช่น: PM2.5, ไฟป่า)" class="mb-3">
            <b-form-tags v-model="groupSetting.querySearch" separator=",;"
              placeholder="เพิ่มคำค้นหาด้วย , หรือ Enter" />
          </b-form-group>

          <b-form-group label="Hashtags (ไม่ใส่ #)" class="mb-3">
            <b-form-tags v-model="groupSetting.hashtags" separator=",;" placeholder="เพิ่มแฮชแท็กด้วย , หรือ Enter" />
          </b-form-group>

          <label>Sentiment</label>
          <v-select class="mb-3" v-model="groupSetting.sentiment" :options="sentimentOptions" label="label"
            :reduce="option => option.value" multiple placeholder="เลือก Sentiment" />

          <b-form-group label="เลือกช่วงเวลาย้อนหลัง">
            <div class="d-flex">
              <b-form-input v-model.number="groupSetting.durationValue" type="number" min="1" placeholder="จำนวน"
                class="mr-2" />
              <b-form-select v-model="groupSetting.durationUnit" :options="durationUnits" />
            </div>
          </b-form-group>

          <div v-if="groupSetting.durationUnit === 'custom'" class="d-flex justify-content-between">
            <b-form-group label="Start Date" class="w-50 pr-2">
              <b-form-input v-model="groupSetting.start_date" type="datetime-local" />
            </b-form-group>
            <b-form-group label="End Date" class="w-50 pl-2">
              <b-form-input v-model="groupSetting.end_date" type="datetime-local" />
            </b-form-group>
          </div>

          <div>
            <b-form-checkbox v-model="groupSetting.statusAlert" switch class="my-2">
              🔔 Spike Alert
              <small>
                เปิดเเจ้งเตือนสำหรับดูแนวโน้มการเพิ่มขึ้นของ
                <span style="background-color: #fbecb4;padding: 4px 6px;border-radius: 10px;">โพสต์/วัน</span>
              </small>
            </b-form-checkbox>
            <div class="d-flex" v-if="groupSetting.statusAlert">
              <b-form-input type="number" v-model.number="groupSetting.spikePosts" min="1" placeholder="กรอกจำนวนโพสต์"
                class="w-50 mr-3" />
            </div>
          </div>
        </div>
        <div class="text-center mt-4">
          <b-button variant="primary" class="mx-2 px-4" @click="saveSetting(selectedGroup)"
            style="background-color:#17a2b8;border-color:#17a2b8;">
            💾 บันทึก
          </b-button>
          <b-button variant="outline-secondary" class="mx-2 px-4" @click="cancelSetting">
            ❌ ยกเลิก
          </b-button>
        </div>
      </div>
    </b-modal>
    <!-- Modal ยืนยันการเปลี่ยนสถานะ -->
    <b-modal v-model="showToggleModal" hide-footer>
      <div class="text-center py-3">
        <div class="h5">ยืนยันการเปลี่ยนสถานะ</div>
        คุณต้องการเปลี่ยนสถานะของ "{{ selectedGroup && selectedGroup.groupTitle }}" หรือไม่?
        <div class="mt-3">
          <b-button variant="primary" class="mx-2" @click="toggleStatus(selectedGroup)"
            style="background-color:#17a2b8;border-color:#17a2b8;">ยืนยัน</b-button>
          <b-button variant="secondary" class="mx-2" @click="cancelToggle">ยกเลิก</b-button>
        </div>
      </div>
    </b-modal>
    <!-- Modal ยืนยันการลบ -->
    <b-modal v-model="showDeleteModal" hide-footer>
      <div class="text-center py-3">
        <div class="h5">ยืนยันการลบข้อมูล</div>
        คุณแน่ใจหรือไม่ว่าต้องการลบ "{{ selectedGroup && selectedGroup.groupTitle || selectedGroup &&
          selectedGroup.key }}" ?
        <div class="mt-3">
          <b-button variant="danger" class="mx-2" @click="deleteGroup">ยืนยัน</b-button>
          <b-button variant="secondary" class="mx-2" @click="cancelDelete">ยกเลิก</b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
export default {
  watch: {
        'groupSetting.domain_idText'(newVal, oldVal) {
            if (this.groupMode !== 'group'&& (!Array.isArray(newVal) || newVal.length > 0)) {
                this.getSubdomain()
            }
        },
        'groupSetting.monitorGroupId'(val) {
            if (!Array.isArray(val)) return;

            const cleaned = val.filter(v => v != null);
            // ✅ เขียนกลับเฉพาะถ้าไม่เหมือนของเดิม
            if (cleaned.length !== val.length) {
                this.groupSetting.monitorGroupId = cleaned;
            }
        },
        // domain: {
        //     handler() {
        //         this.fetchGroups();
        //     },
        //         // deep: true
        // }
  },
  props: {
    domain: Array,
    searchText: String
  },
  data() {
      return {
        username: "",
      showToggleModal: false,
      showDeleteModal: false,
      groups: [],
      allSubdomainData: [],
      subdomain: [],
      selectedGroup: null,
      showSettingModal: false,

      // โหมดเลือก
      groupMode: 'domain', // 'domain' | 'group'

      groupSetting: {
        // โหมด domain
        domain_idText: null,
        subdomain_idText: [],
        object_idText: [],
        // โหมด group
        monitorGroupId: null,      // number (group_id)
        monitorGroupName: '',      // string (group_name)

        // ตัวกรองอื่น ๆ (คงเดิม)
        querySearch: [],
        hashtags: [],
        sentiment: [],
        durationValue: 6,
        durationUnit: "hours",
        start_date: "",
        end_date: "",
        statusAlert: false,
        spikePosts: 10
      },
      oldGroup_id: [],
      // ตัวเลือกรายการ group จาก API
      groupOptions: [],  // { group_id, group_name }[]
      groupSearchTerm: '',

      durationValue: 1,
      durationUnit: 'hours',
      sentimentOptions: [
        { label: 'บวก', value: 1 },
        { label: 'กลาง', value: 0 },
        { label: 'ลบ', value: -1 }
      ],
      durationUnits: [
        { value: 'minutes', text: 'นาที' },
        { value: 'hours', text: 'ชั่วโมง' },
        { value: 'days', text: 'วัน' },
        { value: 'weeks', text: 'สัปดาห์' },
        { value: 'custom', text: 'ระบุวันและเวลาเอง' }
      ],
      loading: false,
      error: null,
      defaultGroupImage: "https://img.icons8.com/ios-glyphs/100/3ea49b/telegram-app.png"
    };
  },
  computed: {
      filteredGroups() {
        // let userGroup = this.groups.filter(group => group.isMyGroup === true);
      return this.groups.filter(group =>
        (group.groupTitle || "").toLowerCase().includes(this.searchText.toLowerCase())
      );
    },
    filteredObjects() {
      if (!this.groupSetting.subdomain_idText?.length) return [];
      return this.allSubdomainData
        .filter(sd => this.groupSetting.subdomain_idText.includes(sd.subdomain_id))
        .flatMap(sd => sd.objects || []);
    },
    selectedGroupName() {
      const found = this.groupOptions.find(g => g.group_id === this.groupSetting.group_id);
      return found ? found.group_name : this.groupSetting.monitorGroupName || '';
    }
  },
    async mounted() {
    this.username = localStorage.getItem("username");
    await this.fetchGroupOptions('');
    await this.fetchGroups();
  },
  methods: {
    // ---------- โหมด Domain ----------
    selectSubdomain() {
      this.groupSetting.object_idText = []
    },
    selectDomain() {
      this.groupSetting.subdomain_idText = []
      this.groupSetting.object_idText = []
    },

    // ---------- โหมด Group ----------
   
   
      async fetchGroupOptions(search = '') {
        this.loading = true;
      try {
        const token = localStorage.getItem("token");
        const url = `https://api2.cognizata.com/api/v2/monitor/monitorGroupName?type=grouplist&page=1&limit=500&search=${encodeURIComponent(search)}`;
        const res = await axios.get(url, {
          headers: token ? { Authorization: "Bearer " + token } : {}
        });
        // แมปให้เหลือเฉพาะที่ใช้แสดง
        // console.log('res',res.data);
        
        const list = Array.isArray(res.data.data) ? res.data.data : [];
        this.groupOptions = list;
        this.loading = false;
      } catch (e) {
        console.error('โหลด Group List ไม่สำเร็จ', e);
        this.groupOptions = [];
        this.loading = false;
      }
    },

    onImageError(event) {
      event.target.src = this.defaultGroupImage;
    },
    confirmDelete(group) {
      this.selectedGroup = group;
      this.showDeleteModal = true;
    },

    async deleteGroup() {
      try {
        await axios.delete(`https://api2.cognizata.com/api/v2/alert_telegram/deletegrouptelegram/${this.selectedGroup._id}`);
        this.groups = this.groups.filter(g => g._id !== this.selectedGroup._id);
      } catch (err) {
        alert('ลบข้อมูลไม่สำเร็จ')
      } finally {
        this.selectedGroup = null
        this.showDeleteModal = false
        this.cancelDelete()
      }
    },

    cancelDelete() {
      this.showDeleteModal = false;
      this.showSettingModal = false;
    },

    async getSubdomain() {
      const domainId = this.groupSetting.domain_idText
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

        this.allSubdomainData = subdomains;
      } catch (error) {
        console.error(error);
      }
    },

    async fetchGroups() {
      this.loading = true;
      try {
        const res = await axios.get("https://api2.cognizata.com/api/v2/alert_telegram/getgrouptelegram");
            let telegram = res.data || [];
            this.groups = this.checkUserGroup(telegram);
            //console.log('fetched groups', telegram);
        //   this.groups = res.data || [];
      } catch (err) {
        this.error = "ไม่สามารถโหลดข้อมูลกลุ่ม Telegram ได้";
      } finally {
        this.loading = false;
      }
    },
    checkUserGroup(telegram) {
        if (this.username === 'adminatapy') {
            return telegram;
        }
        let filtered = telegram.filter(group =>
            (group.groupTitle === this.username) 
            // ||(Array.isArray(group.domain_id) &&
            //   group.domain_id.some(id => this.domain.some(d => d.id === id)))
            ||
            (Array.isArray(group.group_id) &&
            group.group_id.some(id => this.groupOptions.some(d => d.group_id === id)))
        );
        return filtered;
    },
    cancelToggle() {
      this.selectedGroup = null
      this.showToggleModal = false
    },
    confirmToggle(user) {
      this.selectedGroup = user
      this.showToggleModal = true
    },
    toggleStatus(group) {
      axios
        .patch(`https://api2.cognizata.com/api/v2/alert_telegram/updategrouptelegram/${group._id}`)
        .then(res => {
          const updated = res.data;
          const idx = this.groups.findIndex(g => g._id === updated._id);
          if (idx !== -1) this.groups.splice(idx, 1, updated);
          this.showToggleModal = false
        })
        .catch(() => alert("Toggle failed"));
    },

    openSetting(group) {
      this.selectedGroup = group;
        
      axios
        .get(`https://api2.cognizata.com/api/v2/alert_telegram/getgroupsetting/${group._id}`)
        .then(async (res) => {
          // ตรวจว่ามีการตั้งค่าแบบ group ไหม
          const isGroupMode =
            (Array.isArray(res.data?.group_id) ? res.data.group_id.length > 0 : !!res.data?.group_id) ||
            !!res.data?.monitorGroupName;
            // console.log("isGroupMode === ", isGroupMode);
            // console.log("groupOptions === ", this.groupOptions);
            
          this.groupMode = isGroupMode ? 'group' : 'domain';
            // const validGroupId = (res.data.group_id || []).filter(id =>
            //     this.groupOptions.some(opt => opt.group_id === id)
            // );
            // console.log("validGroupId === ", validGroupId);
            this.oldGroup_id = res.data.group_id || [];
          this.groupSetting = {
            // domain mode fields
            domain_idText: isGroupMode ? null : (res.data.domain_id || null),
            subdomain_idText: isGroupMode ? [] : (res.data.subdomain_id || []),
            object_idText: isGroupMode ? [] : (res.data.object_id || []),

            // group mode fields
            monitorGroupId: res.data.group_id,
            monitorGroupName: res.data.monitorGroupName || '',

            // common filters
            querySearch: res.data.querySearch || [],
            hashtags: res.data.hashtags || [],
            sentiment: res.data.sentiment || [],
            durationValue: res.data.durationValue || 1,
            durationUnit: res.data.durationUnit || "hour",
            start_date: res.data.start_date || "",
            end_date: res.data.end_date || "",
            statusAlert: res.data.statusAlert || false,
            spikePosts: res.data.spikePosts || ''
          };

          // โหลด group options (เพื่อโชว์ label) ถ้าเป็นโหมด group
          if (this.groupMode === 'group' && this.groupOptions.length === 0) {
            // await this.fetchGroupOptions('');
          }

          this.showSettingModal = true;
        })
        .catch(() => alert("โหลดการตั้งค่าไม่สำเร็จ"));
    },

    saveSetting(user) {
      // เตรียม payload ตามโหมด
      const isDomainMode = this.groupMode === 'domain';
      const payload = {
        // โหมด domain: ส่งฟิลด์เหล่านี้
        domain_id: isDomainMode ? this.groupSetting.domain_idText : null,
        subdomain_id: isDomainMode ? this.groupSetting.subdomain_idText : [],
        object_id: isDomainMode ? this.groupSetting.object_idText : [],

        // โหมด group: ส่งเฉพาะ group ที่เลือก
        group_id: !isDomainMode ? this.groupSetting.monitorGroupId : null,
        // group_id: !isDomainMode
        //     ? Array.from(
        //         new Set([
        //             ...(this.groupSetting.monitorGroupId || []),
        //             ...(this.oldGroup_id || [])
        //         ])
        //         )
        //     : null,
        monitorGroupName: !isDomainMode ? this.selectedGroupName : '',

        // ฟิลด์ส่วนกลาง
        querySearch: this.groupSetting.querySearch,
        hashtags: this.groupSetting.hashtags,
        sentiment: this.groupSetting.sentiment,
        durationValue: this.groupSetting.durationValue || null,
        durationUnit: this.groupSetting.durationUnit || null,
        start_date: this.groupSetting.durationUnit === 'custom' ? this.groupSetting.start_date || null : null,
        end_date: this.groupSetting.durationUnit === 'custom' ? this.groupSetting.end_date || null : null,
        status: user.status,
        statusAlert: this.groupSetting.statusAlert || false,
        spikePosts: this.groupSetting.spikePosts || null,
        lastSentPostId: null
      };
    //   console.log('payload === ', payload);
      axios
        .put(`https://api2.cognizata.com/api/v2/alert_telegram/updategroupsetting/${this.selectedGroup._id}`, payload)
        .then(() => {
          this.showSettingModal = false;
          alert("บันทึกสำเร็จ");
        })
        .catch(() => alert("บันทึกไม่สำเร็จ"));
    },

    cancelSetting() {
      this.selectedGroup = null;
      this.showSettingModal = false;
      
    }
    },
};
</script>


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
  color: white !important;
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
  background: #22C1C3;

  /* background-image: linear-gradient(to right, #051937, #004d7a, #008793, #00bf72,  #69517e); */
  background-image: linear-gradient(to right, #051937, #004d7a, #008793, #00bf72, #afdd4a);
  /* background-color: rgba(116, 240, 192, 0.568); */
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
</style>