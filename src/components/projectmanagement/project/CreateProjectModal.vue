<template>
  <span>
    <b-button size="md" class="create-btn" pill @click="open = true">
      <b-icon icon="folder-plus"></b-icon> สร้างโปรเจกต์
    </b-button>

    <vue-modaltor
      :visible="open"
      @hide="closeModal"
      :animation-panel="'modal-slide-top'"
      :resize-width="{ 3000: '660px', 1200: '460px', 768: '92vw', 480: '92vw' }"
      class="create-modal"
     
    >
      <div class="modal-shell">
        <div class="modal-topbar">
          <div class="modal-title">
            <b-icon icon="folder-plus"></b-icon>
            สร้างโปรเจกต์ใหม่
          </div>
          <button class="modal-close-btn" @click="closeModal" aria-label="ปิดหน้าต่าง">
            <b-icon icon="x" scale="2"></b-icon>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-field">
            <label>ชื่อโปรเจกต์ <span class="req">*</span></label>
            <input
              ref="nameInput"
              v-model.trim="form.projectname"
              class="form-input"
              placeholder="เช่น AFSC2"
              @keyup.enter="submit"
            />
            <span v-if="error" class="form-error">{{ error }}</span>
          </div>

          <label class="switch-row">
            <input type="checkbox" v-model="form.mion" class="switch-input" />
            <span class="switch-track"><span class="switch-thumb"></span></span>
            <span class="switch-text">เปิดใช้งาน Mion</span>
          </label>

          <div class="form-field">
            <label>
              ผู้ใช้ในโปรเจกต์
              <span class="selected-count" v-if="selectedUsers.length">({{ selectedUsers.length }} คน)</span>
            </label>

            <div v-if="selectedUsers.length" class="selected-chips">
              <span v-for="u in selectedUsers" :key="u._id" class="chip">
                {{ u.name }}
                <button type="button" class="chip-remove" @click="removeUser(u._id)" aria-label="เอาออก">×</button>
              </span>
            </div>

            <input
              v-model.trim="userSearch"
              class="form-input user-search-input"
              placeholder="ค้นหาผู้ใช้..."
            />

            <div class="user-picklist">
              <label v-for="u in filteredUsers" :key="u._id" class="user-pick-row">
                <input type="checkbox" :value="u._id" v-model="form.userIds" />
                <span class="pick-avatar">{{ u.initial }}</span>
                <span class="pick-text">
                  <span class="pick-name">{{ u.name }}</span>
                  <span class="pick-role">{{ u.role }}</span>
                </span>
              </label>

              <div v-if="filteredUsers.length === 0" class="pick-empty">ไม่พบผู้ใช้ที่ตรงกับ "{{ userSearch }}"</div>
            </div>
          </div>
        </div>

        <!-- <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">ยกเลิก</button>
          <button class="btn-submit" @click="submit">สร้างโปรเจกต์</button>
        </div> -->
        <b-row class=" justify-content-end mx-3">
          <button class="btn-submit mx-3" @click="submit">สร้างโปรเจกต์</button>
          <button class="btn-cancel " @click="closeModal">ยกเลิก</button>
        </b-row>
      </div>
    </vue-modaltor>
  </span>
</template>

<script>
// Fake a Mongo-style ObjectId string, close enough for mock data.
function newOid() {
  const hex = "0123456789abcdef";
  let id = "";
  for (let i = 0; i < 24; i++) id += hex[Math.floor(Math.random() * 16)];
  return { $oid: id };
}

export default {
  name: "CreateProjectModal",
  props: {
    // Full user list to pick from, e.g. `:users="users"` from mock.js USERS
    users: { type: Array, default: () => [] },
  },
  data() {
    return {
      open: false,
      error: "",
      userSearch: "",
      form: { projectname: "", mion: false, userIds: [] },
    };
  },
  computed: {
    selectedUsers() {
      return this.users.filter((u) => this.form.userIds.includes(u._id));
    },
    filteredUsers() {
      const q = this.userSearch.toLowerCase();
      if (!q) return this.users;
      return this.users.filter(
        (u) => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)
      );
    },
  },
  watch: {
    open(val) {
      if (val) {
        this.$nextTick(() => this.$refs.nameInput && this.$refs.nameInput.focus());
      }
    },
  },
  methods: {
    removeUser(id) {
      this.form.userIds = this.form.userIds.filter((existingId) => existingId !== id);
    },
    closeModal() {
      this.open = false;
      this.error = "";
      this.userSearch = "";
      this.form = { projectname: "", mion: false, userIds: [] };
    },
    submit() {
      if (!this.form.projectname) {
        this.error = "กรุณากรอกชื่อโปรเจกต์";
        return;
      }
      const project = {
        _id: newOid(),
        projectname: this.form.projectname,
        userlist: this.form.userIds.map((id) => ({ $oid: id })),
        avatarlist: [],
        domainlist: [],
        mion: this.form.mion,
        hashtaglist: [],
        targetlist: [],
        updatedAt: { $date: new Date().toISOString() },
        hotissue_list: [],
        group_list: [],
      };
      this.$emit("created", project);
      this.closeModal();
    },
  },
};
</script>

<style scoped>
/* Self-contained, with colors hard-coded directly (no CSS variables). */

.create-btn {
  background: #128189 !important;
  border-color: #128189 !important;
  color: #ffffff !important;
  font-weight: 500;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.create-btn:hover {
  background: #0e6971 !important;
  border-color: #0e6971 !important;
}

.modal-shell {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  /* font-family: "Inter", ui-sans-serif, system-ui, sans-serif; */
  display: flex;
  flex-direction: column;
  height: 85vh;
  overflow: hidden;
}

.modal-topbar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e4e1d8;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 8px;
  /* font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif; */
  font-weight: 700;
  font-size: 18px;
  color: #1c1e24;
}

.modal-close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  color: #6b7280;
  display: flex;
}
.modal-close-btn:hover {
  background: #f6f5f0;
}

.modal-body {
  /* padding: 20px; */
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1 1 auto;
  overflow-y: auto;
  min-height: 0;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-field label {
  font-size: 16px;
  font-weight: 500;
  color: #1c1e24;
}
.req {
  color: #c0392b;
}

.form-input {
  border: 1px solid #e4e1d8;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  color: #1c1e24;
  background: #ffffff;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.form-input:focus {
  border-color: #128189;
  box-shadow: 0 0 0 2px rgba(18, 129, 137, 0.15);
}

.form-error {
  font-size: 14px;
  color: #c0392b;
}

.selected-count {
  font-weight: 400;
  color: #6b7280;
  font-size: 14px;
}

.selected-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(18, 129, 137, 0.1);
  color: #0e5157;
  border-radius: 999px;
  padding: 4px 6px 4px 12px;
  font-size: 14px;
  white-space: nowrap;
}

.chip-remove {
  background: transparent;
  border: none;
  color: #0e5157;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 50%;
}
.chip-remove:hover {
  background: rgba(18, 129, 137, 0.2);
}

.user-search-input {
  margin-bottom: 8px;
  font-size: 14px;
}

.user-picklist {
  border: 1px solid #e4e1d8;
  border-radius: 8px;
  max-height: 190px;
  overflow-y: auto;
}

.user-pick-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #edebe3;
  margin: 0;
}
.user-pick-row:last-child {
  border-bottom: none;
}
.user-pick-row:hover {
  background: #f6f5f0;
}

.user-pick-row input[type="checkbox"] {
  flex-shrink: 0;
  accent-color: #128189;
  width: 15px;
  height: 15px;
}

.pick-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #f6f5f0;
  border: 1px solid #e4e1d8;
  color: #128189;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.pick-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.pick-name {
  font-size: 14px;
  font-weight: 500;
  color: #1c1e24;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pick-role {
  font-size: 14px;
  color: #6b7280;
}

.pick-empty {
  padding: 16px 12px;
  font-size: 14px;
  color: #6b7280;
  font-style: italic;
  text-align: center;
}

.switch-row {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}
.switch-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.switch-track {
  width: 36px;
  height: 20px;
  border-radius: 999px;
  background: #e4e1d8;
  position: relative;
  transition: background 0.15s ease;
  flex-shrink: 0;
}
.switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffffff;
  transition: transform 0.15s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
.switch-input:checked + .switch-track {
  background: #128189;
}
.switch-input:checked + .switch-track .switch-thumb {
  transform: translateX(16px);
}
.switch-text {
  font-size: 14px;
  color: #1c1e24;
}

.modal-footer {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #e4e1d8;
}

.btn-cancel {
  background: #ffffff;
  border: 1px solid #e4e1d8;
  color: #1c1e24;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.btn-cancel:hover {
  background: #f6f5f0;
}

.btn-submit {
  background: #128189;
  border: 1px solid #128189;
  color: #ffffff;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.btn-submit:hover {
  background: #0e6971;
}

/* ---- vue-modaltor wrapper overrides ---- */
/* The library's own overlay/panel/close button aren't styled by default,
   which is why the dialog was pinned to the top-left instead of centered,
   and why a second "×" (the library's own close button) floated in the
   corner on top of our custom one. */

</style>