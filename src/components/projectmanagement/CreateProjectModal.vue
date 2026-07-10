<template>
  <span>
    <b-button size="md" class="create-btn" pill @click="open = true">
      <b-icon icon="folder-plus"></b-icon> สร้างโปรเจกต์
    </b-button>

    <vue-modaltor
      :visible="open"
      @hide="closeModal"
      :animation-panel="'modal-slide-top'"
      :resize-width="{ 3000: '460px', 1200: '460px', 768: '92vw', 480: '92vw' }"
      class="create-modal"
    >
      <div class="modal-shell">
        <div class="modal-topbar">
          <div class="modal-title">
            <b-icon icon="folder-plus"></b-icon>
            สร้างโปรเจกต์ใหม่
          </div>
          <button class="modal-close-btn" @click="closeModal" aria-label="ปิดหน้าต่าง">
            <b-icon icon="x"></b-icon>
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
              <span class="selected-count" v-if="form.userIds.length">({{ form.userIds.length }} คน)</span>
            </label>

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

        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">ยกเลิก</button>
          <button class="btn-submit" @click="submit">สร้างโปรเจกต์</button>
        </div>
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
/* Self-contained, with fallback values on every var(--token, fallback). */

.create-btn {
  background: var(--teal, #128189) !important;
  border-color: var(--teal, #128189) !important;
  color: #ffffff !important;
  font-weight: 500;
  font-size: 13.5px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.create-btn:hover {
  background: #0e6971 !important;
  border-color: #0e6971 !important;
}

.modal-shell {
  background: var(--surface, #ffffff);
  border-radius: 16px;
  width: 100%;
  overflow: hidden;
  font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
}

.modal-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border, #e4e1d8);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: var(--text, #1c1e24);
}

.modal-close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  color: var(--muted, #6b7280);
  display: flex;
}
.modal-close-btn:hover {
  background: var(--bg, #f6f5f0);
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-field label {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text, #1c1e24);
}
.req {
  color: #c0392b;
}

.form-input {
  border: 1px solid var(--border, #e4e1d8);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  color: var(--text, #1c1e24);
  background: var(--surface, #ffffff);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.form-input:focus {
  border-color: var(--teal, #128189);
  box-shadow: 0 0 0 2px rgba(18, 129, 137, 0.15);
}

.form-error {
  font-size: 12px;
  color: #c0392b;
}

.selected-count {
  font-weight: 400;
  color: var(--muted, #6b7280);
  font-size: 12px;
}

.user-search-input {
  margin-bottom: 8px;
  font-size: 13px;
}

.user-picklist {
  border: 1px solid var(--border, #e4e1d8);
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
  border-bottom: 1px solid var(--border-soft, #edebe3);
  margin: 0;
}
.user-pick-row:last-child {
  border-bottom: none;
}
.user-pick-row:hover {
  background: var(--bg, #f6f5f0);
}

.user-pick-row input[type="checkbox"] {
  flex-shrink: 0;
  accent-color: var(--teal, #128189);
  width: 15px;
  height: 15px;
}

.pick-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--bg, #f6f5f0);
  border: 1px solid var(--border, #e4e1d8);
  color: var(--teal, #128189);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

.pick-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.pick-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text, #1c1e24);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pick-role {
  font-size: 11.5px;
  color: var(--muted, #6b7280);
}

.pick-empty {
  padding: 16px 12px;
  font-size: 12.5px;
  color: var(--muted, #6b7280);
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
  background: var(--border, #e4e1d8);
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
  background: var(--teal, #128189);
}
.switch-input:checked + .switch-track .switch-thumb {
  transform: translateX(16px);
}
.switch-text {
  font-size: 13.5px;
  color: var(--text, #1c1e24);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid var(--border, #e4e1d8);
}

.btn-cancel {
  background: var(--surface, #ffffff);
  border: 1px solid var(--border, #e4e1d8);
  color: var(--text, #1c1e24);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
}
.btn-cancel:hover {
  background: var(--bg, #f6f5f0);
}

.btn-submit {
  background: var(--teal, #128189);
  border: 1px solid var(--teal, #128189);
  color: #ffffff;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 13.5px;
  font-weight: 600;
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
::v-deep .create-modal {
  z-index: 2000 !important;
}
::v-deep .create-modal .modaltor__overlay {
  z-index: 2000 !important;
  background: rgba(28, 30, 36, 0.45) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 20px !important;
}
::v-deep .create-modal .modaltor__panel {
  position: relative !important;
  top: auto !important;
  left: auto !important;
  right: auto !important;
  bottom: auto !important;
  margin: 0 !important;
  width: auto !important;
  max-width: 100% !important;
  max-height: 90vh !important;
  overflow-y: auto !important;
  border-radius: 16px !important;
  padding: 0 !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25) !important;
  z-index: 2001 !important;
}
::v-deep .create-modal .modaltor__content {
  padding: 0 !important;
  margin: 0 !important;
}
::v-deep .create-modal .modaltor__header,
::v-deep .create-modal .modaltor__close {
  display: none !important;
}
::v-deep .create-modal [class*="close" i]:not(.modal-close-btn) {
  display: none !important;
}
</style>

<style>
/* Safety net in case the scoped ::v-deep rules above don't reach these
   elements (same pattern used in ImportDomain.vue's own modal). */
.create-modal .modaltor__header,
.create-modal .modaltor__close {
  display: none !important;
}
.create-modal [class*="close" i]:not(.modal-close-btn) {
  display: none !important;
}
.create-modal {
  z-index: 2000 !important;
}
.create-modal .modaltor__overlay {
  z-index: 2000 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.create-modal .modaltor__panel {
  position: relative !important;
  top: auto !important;
  left: auto !important;
  margin: 0 !important;
  z-index: 2001 !important;
}
</style>