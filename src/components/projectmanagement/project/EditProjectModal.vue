<template>
  <!--
    No trigger button here — this modal is opened externally, e.g. from a
    ProjectCard's "แก้ไข" menu item. Project/user/domain lists are fetched
    from the store internally, so no props are needed:

      <EditProjectModal ref="editProjectModal" @updated="onProjectUpdated" />
      ...
      methods: {
        onEditProject(project) { this.$refs.editProjectModal.open(project); }
      }
  -->
  <vue-modaltor
    :visible="visible"
    @hide="closeModal"
    :animation-panel="'modal-slide-top'"
    :resize-width="{ 3000: '100vw', 1200: '92vw', 768: '92vw', 480: '92vw' }"
    class="create-modal"
  >
    <div class="modal-shell">
      <div class="modal-topbar">
        <div class="modal-title">
          <b-icon icon="pencil"></b-icon>
          แก้ไขโปรเจกต์
        </div>
        <button class="modal-close-btn" @click="closeModal" aria-label="ปิดหน้าต่าง">
          <b-icon icon="x" scale="2"></b-icon>
        </button>
      </div>

      <div class="modal-body">
        <div class="modal-body-top">
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
        </div>

        <div class="picker-columns">
          <div class="picker-col">
            <div class="picker-col-header">
              <div>
                <label class="picker-col-label">
                  ผู้ใช้ในโปรเจกต์
                  <span class="selected-count" v-if="selectedUsers.length">({{ selectedUsers.length }} คน)</span>
                </label>
                <p class="picker-col-hint">ผู้ใช้ที่เลือกจะมีสิทธิ์เข้าถึงโปรเจกต์นี้</p>
              </div>
              <div class="picker-col-actions">
                <button type="button" class="picker-action-link" @click="selectAllUsers">เลือกทั้งหมด</button>
                <span class="picker-action-sep">·</span>
                <button type="button" class="picker-action-link" @click="form.userIds = []">ล้างทั้งหมด</button>
              </div>
            </div>

            <div class="combo" tabindex="-1" @focusout="closeUserMenu">
              <div class="combo-shell" @click="focusUserInput">
                <span v-for="u in selectedUsers" :key="u._id" class="combo-chip">
                  <span class="combo-chip-avatar">{{ u.initial }}</span>
                  {{ u.name }}
                  <button type="button" class="combo-chip-remove" @click.stop="removeUser(u._id)" aria-label="เอาออก">×</button>
                </span>
                <input
                  ref="userComboInput"
                  v-model.trim="userSearch"
                  class="combo-input"
                  :placeholder="selectedUsers.length ? '' : 'ค้นหาผู้ใช้...'"
                  @focus="userMenuOpen = true"
                  @input="userMenuOpen = true"
                />
                <b-icon icon="chevron-down" class="combo-caret" :class="{ open: userMenuOpen }"></b-icon>
              </div>

              <div v-if="userMenuOpen" class="combo-dropdown" @mousedown.prevent>
                <div v-if="loadingUsers" class="pick-empty">กำลังโหลด...</div>
                <template v-else>
                  <div
                    v-for="u in filteredUsers"
                    :key="u._id"
                    class="user-pick-row"
                    :class="{ checked: form.userIds.includes(u._id) }"
                    @click="toggleUserId(u._id)"
                  >
                    <input type="checkbox" :checked="form.userIds.includes(u._id)" tabindex="-1" />
                    <span class="pick-avatar">{{ u.initial }}</span>
                    <span class="pick-text">
                      <span class="pick-name">{{ u.name }}</span>
                      <span class="pick-role">{{ u.role }}</span>
                    </span>
                  </div>

                  <div v-if="filteredUsers.length === 0" class="pick-empty">
                    ไม่พบผู้ใช้ที่ตรงกับ "{{ userSearch }}"
                  </div>
                </template>
              </div>
            </div>
          </div>

          <div class="picker-col">
            <div class="picker-col-header">
              <div>
                <label class="picker-col-label">
                  โดเมน
                  <span class="selected-count" v-if="selectedDomains.length">({{ selectedDomains.length }} รายการ)</span>
                </label>
                <p class="picker-col-hint">โดเมนที่โปรเจกต์นี้จะติดตามข้อมูล</p>
              </div>
              <div class="picker-col-actions">
                <button type="button" class="picker-action-link" @click="selectAllDomains">เลือกทั้งหมด</button>
                <span class="picker-action-sep">·</span>
                <button type="button" class="picker-action-link" @click="form.domainIds = []">ล้างทั้งหมด</button>
              </div>
            </div>

            <div class="combo" tabindex="-1" @focusout="closeDomainMenu">
              <div class="combo-shell" @click="focusDomainInput">
                <span v-for="d in selectedDomains" :key="d._id" class="combo-chip domain">
                  {{ d.name }}
                  <button type="button" class="combo-chip-remove" @click.stop="removeDomain(d._id)" aria-label="เอาออก">×</button>
                </span>
                <input
                  ref="domainComboInput"
                  v-model.trim="domainSearch"
                  class="combo-input"
                  :placeholder="selectedDomains.length ? '' : 'ค้นหาโดเมน...'"
                  @focus="domainMenuOpen = true"
                  @input="domainMenuOpen = true"
                />
                <b-icon icon="chevron-down" class="combo-caret" :class="{ open: domainMenuOpen }"></b-icon>
              </div>

              <div v-if="domainMenuOpen" class="combo-dropdown" @mousedown.prevent>
                <div v-if="loadingDomains" class="pick-empty">กำลังโหลด...</div>
                <template v-else>
                  <div
                    v-for="d in filteredDomains"
                    :key="d._id"
                    class="user-pick-row"
                    :class="{ checked: form.domainIds.includes(d._id) }"
                    @click="toggleDomainId(d._id)"
                  >
                    <input type="checkbox" :checked="form.domainIds.includes(d._id)" tabindex="-1" />
                    <span class="pick-text">
                      <span class="pick-name">{{ d.name }}</span>
                    </span>
                  </div>

                  <div v-if="filteredDomains.length === 0" class="pick-empty">
                    ไม่พบโดเมนที่ตรงกับ "{{ domainSearch }}"
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <b-row class=" justify-content-end mx-3">
        <button class="btn-submit mx-3" :disabled="submitting" @click="submit">
          {{ submitting ? "กำลังบันทึก..." : "บันทึกการแก้ไข" }}
        </button>
        <button class="btn-cancel " @click="closeModal">ยกเลิก</button>
      </b-row>
    </div>
  </vue-modaltor>
</template>

<script>
export default {
  name: "EditProjectModal",
  data() {
    return {
      visible: false,
      error: "",
      submitting: false,
      userSearch: "",
      domainSearch: "",
      userMenuOpen: false,
      domainMenuOpen: false,
      editingProject: null,
      form: { projectname: "", mion: false, userIds: [], domainIds: [] },
    };
  },
  computed: {
    // Sourced from the store's isolated user picker (not the Users tab's
    // paginated list) — see fetchUserPickerList in project.js for why.
    users() {
      return this.$store.getters.getUserPicker.items;
    },
    loadingUsers() {
      return this.$store.getters.getUserPicker.loading;
    },
    // Ordered by form.userIds (the order they were clicked/loaded in), not
    // by the picker list's original order.
    selectedUsers() {
      return this.form.userIds.map((id) => this.users.find((u) => u._id === id)).filter(Boolean);
    },
    filteredUsers() {
      const q = this.userSearch.toLowerCase();
      if (!q) return this.users;
      return this.users.filter(
        (u) => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)
      );
    },
    domains() {
      return this.$store.getters.getDomainList;
    },
    loadingDomains() {
      return this.$store.getters.getLoadingDomains;
    },
    selectedDomains() {
      return this.form.domainIds.map((id) => this.domains.find((d) => d._id === id)).filter(Boolean);
    },
    filteredDomains() {
      const q = this.domainSearch.toLowerCase();
      if (!q) return this.domains;
      return this.domains.filter((d) => (d.name || "").toLowerCase().includes(q));
    },
  },
  methods: {
    // Public API — call from a parent via `this.$refs.editProjectModal.open(project)`.
    open(project) {
      this.editingProject = project;
      this.form = {
        projectname: project.projectname || "",
        mion: !!project.mion,
        // userlist/domainlist on a project are full embedded objects (per
        // getProjects), not bare ids — pull just the ids out for the form.
        userIds: (project.userlist || []).map((u) => u._id),
        domainIds: (project.domainlist || []).map((d) => d._id),
      };
      this.error = "";
      this.visible = true;
      this.userMenuOpen = false;
      this.domainMenuOpen = false;
      this.userSearch = "";
      this.domainSearch = "";
      // Fresh lists every time the modal opens.
      this.$store.dispatch("fetchUserPickerList");
      this.$store.dispatch("fetchDomainList");
      this.$nextTick(() => this.$refs.nameInput && this.$refs.nameInput.focus());
    },
    removeUser(id) {
      this.form.userIds = this.form.userIds.filter((existingId) => existingId !== id);
    },
    removeDomain(id) {
      this.form.domainIds = this.form.domainIds.filter((existingId) => existingId !== id);
    },
    toggleUserId(id) {
      const idx = this.form.userIds.indexOf(id);
      if (idx === -1) this.form.userIds.push(id);
      else this.form.userIds.splice(idx, 1);
      this.userSearch = "";
    },
    toggleDomainId(id) {
      const idx = this.form.domainIds.indexOf(id);
      if (idx === -1) this.form.domainIds.push(id);
      else this.form.domainIds.splice(idx, 1);
      this.domainSearch = "";
    },
    selectAllUsers() {
      const ids = new Set(this.form.userIds);
      this.filteredUsers.forEach((u) => ids.add(u._id));
      this.form.userIds = Array.from(ids);
    },
    selectAllDomains() {
      const ids = new Set(this.form.domainIds);
      this.filteredDomains.forEach((d) => ids.add(d._id));
      this.form.domainIds = Array.from(ids);
    },
    focusUserInput() {
      this.userMenuOpen = true;
      this.$nextTick(() => this.$refs.userComboInput && this.$refs.userComboInput.focus());
    },
    focusDomainInput() {
      this.domainMenuOpen = true;
      this.$nextTick(() => this.$refs.domainComboInput && this.$refs.domainComboInput.focus());
    },
    closeUserMenu() {
      this.userMenuOpen = false;
    },
    closeDomainMenu() {
      this.domainMenuOpen = false;
    },
    closeModal() {
      this.visible = false;
      this.error = "";
      this.submitting = false;
      this.userSearch = "";
      this.domainSearch = "";
      this.userMenuOpen = false;
      this.domainMenuOpen = false;
      this.editingProject = null;
      this.form = { projectname: "", mion: false, userIds: [], domainIds: [] };
    },
    async submit() {
      if (!this.form.projectname) {
        this.error = "กรุณากรอกชื่อโปรเจกต์";
        return;
      }

      const payload = {
        _id: this.editingProject._id,
        projectname: this.form.projectname,
        mion: this.form.mion,
        domainlist: this.form.domainIds,
        userlist: this.form.userIds,
      };

      this.error = "";
      this.submitting = true;
      try {
        const project = await this.$store.dispatch("updateProject", payload);
        // Re-fetch from the server so pagination/order stay in sync with
        // the backend, same reasoning as CreateProjectModal.
        await this.$store.dispatch("fetchProjects", { page: 1 });
        this.$emit("updated", project);
        this.closeModal();
      } catch (err) {
        console.log(err);
        this.error = "บันทึกการแก้ไขไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped>
.modal-shell {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
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
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1 1 auto;
  overflow-y: auto;
  min-height: 0;
}

.modal-body-top {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.picker-columns {
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  gap: 16px;
}

.picker-col {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.picker-col-label {
  font-size: 16px;
  font-weight: 500;
  color: #1c1e24;
  flex-shrink: 0;
}

.picker-col-header {
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 4px 8px;
}

.picker-col-hint {
  margin: 2px 0 0;
  font-size: 12px;
  color: #6b7280;
}

.picker-col-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: 2px;
  white-space: nowrap;
}

.picker-action-link {
  background: none;
  border: none;
  padding: 0;
  font-size: 12px;
  color: #128189;
  cursor: pointer;
}
.picker-action-link:hover {
  text-decoration: underline;
}
.picker-action-sep {
  font-size: 12px;
  color: #d1cfc6;
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

.combo {
  position: relative;
  outline: none;
}

.combo-shell {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-height: 42px;
  border: 1px solid #e4e1d8;
  border-radius: 8px;
  padding: 6px 34px 6px 8px;
  background: #ffffff;
  cursor: text;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.combo:focus-within .combo-shell {
  border-color: #128189;
  box-shadow: 0 0 0 2px rgba(18, 129, 137, 0.15);
}

.combo-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(18, 129, 137, 0.1);
  color: #0e5157;
  border-radius: 999px;
  padding: 3px 6px 3px 4px;
  font-size: 13px;
  white-space: nowrap;
}
.combo-chip.domain {
  padding-left: 12px;
}

.combo-chip-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #128189;
  color: #ffffff;
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
}

.combo-chip-remove {
  background: transparent;
  border: none;
  color: #0e5157;
  font-size: 15px;
  line-height: 1;
  cursor: pointer;
  padding: 2px 3px;
  border-radius: 50%;
}
.combo-chip-remove:hover {
  background: rgba(18, 129, 137, 0.2);
}

.combo-input {
  flex: 1 1 80px;
  min-width: 80px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #1c1e24;
  padding: 4px 2px;
}

.combo-caret {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
  transition: transform 0.15s ease;
}
.combo-caret.open {
  transform: translateY(-50%) rotate(180deg);
}

.combo-dropdown {
  margin-top: 6px;
  max-height: 200px;
  border: 1px solid #e4e1d8;
  border-radius: 8px;
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
.user-pick-row.checked {
  background: rgba(18, 129, 137, 0.06);
}

.user-pick-row input[type="checkbox"] {
  flex-shrink: 0;
  accent-color: #128189;
  width: 15px;
  height: 15px;
  pointer-events: none;
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
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 700px) {
  .picker-columns {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .modal-shell {
    height: 92vh;
    border-radius: 12px;
  }
  .modal-topbar {
    padding: 12px 16px;
  }
  .modal-title {
    font-size: 16px;
  }
  .modal-body {
    padding: 0 16px 16px;
    gap: 14px;
  }
  .picker-col-hint {
    display: none;
  }
  .combo-dropdown {
    max-height: 150px;
  }
  .justify-content-end.mx-3 {
    flex-direction: column-reverse;
    margin: 0 !important;
    gap: 8px;
    padding: 12px 16px;
  }
  .btn-submit,
  .btn-cancel {
    width: 100%;
    margin: 0 !important;
    padding: 10px 16px;
    text-align: center;
  }
}
</style>
