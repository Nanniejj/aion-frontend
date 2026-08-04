<template>
  <span>
    <b-button size="md" class="create-btn create-btn-user" pill @click="open = true">
      <b-icon icon="person-plus"></b-icon> สร้างผู้ใช้
    </b-button>

    <vue-modaltor
      :visible="open"
      @hide="closeModal"
      :animation-panel="'modal-slide-top'"
      :resize-width="{ 3000: '680px', 1200: '520px', 768: '92vw', 480: '92vw' }"
      class="create-modal"
    >
      <div class="modal-shell">
        <div class="modal-topbar pb-3">
          <div class="modal-title">
            <b-icon icon="person-plus"></b-icon>
            สร้างผู้ใช้ใหม่
          </div>
          <button class="modal-close-btn" @click="closeModal" aria-label="ปิดหน้าต่าง">
            <b-icon icon="x" scale="2"></b-icon>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-grid">
            <div class="form-field">
              <label>Username <span class="req">*</span></label>
              <input
                ref="usernameInput"
                v-model.trim="form.username"
                class="form-input"
                placeholder="เช่น yellydev"
                autocomplete="off"
                name="new-user-username"
                :readonly="usernameLocked"
                @focus="usernameLocked = false"
                @keyup.enter="submit"
              />
            </div>

            <div class="form-field">
              <label>Role <span class="req">*</span></label>
              <select v-model="form.role" class="form-input form-select">
                <option value="superadmin">superadmin</option>
                <option value="admin">admin</option>
                <option value="user">user</option>
                <option value="service">service</option>
              </select>
            </div>

            <div v-if="form.role !== 'service'" class="form-field">
              <label>ชื่อ <span class="req">*</span></label>
              <input
                v-model.trim="form.name"
                class="form-input"
                placeholder="เช่น yelly"
                autocomplete="off"
                name="new-user-firstname"
                @keyup.enter="submit"
              />
            </div>

            <div v-if="form.role !== 'service'" class="form-field">
              <label>นามสกุล <span class="req">*</span></label>
              <input
                v-model.trim="form.lastname"
                class="form-input"
                placeholder="เช่น User"
                autocomplete="off"
                name="new-user-lastname"
                @keyup.enter="submit"
              />
            </div>

            <div v-if="form.role !== 'service'" class="form-field">
              <label>บริษัท</label>
              <input
                v-model.trim="form.company"
                class="form-input"
                placeholder="เช่น Atapy"
                autocomplete="off"
                name="new-user-company"
                @keyup.enter="submit"
              />
            </div>

            <div class="form-field">
              <label>โปรเจกต์</label>
              <div class="project-picker" tabindex="-1" @focusout="closeProjectMenu">
                <input
                  v-model="projectSearch"
                  type="text"
                  class="form-input project-picker-input"
                  placeholder="พิมพ์เพื่อค้นหาโปรเจกต์..."
                  autocomplete="off"
                  @focus="openProjectMenu"
                  @input="onProjectSearchInput"
                />
                <b-icon icon="chevron-down" class="project-picker-caret"></b-icon>
                <div v-if="projectMenuOpen" class="project-picker-menu" @scroll="onProjectMenuScroll" @mousedown.prevent>
                  <div
                    class="project-picker-item"
                    :class="{ active: !form.project_id }"
                    @click="selectProject(null)"
                  >
                    — ไม่ระบุ —
                  </div>
                  <div
                    v-for="p in projectPicker.items"
                    :key="p._id"
                    class="project-picker-item"
                    :class="{ active: form.project_id === p._id }"
                    @click="selectProject(p)"
                  >
                    {{ p.projectname }}
                  </div>
                  <div
                    v-if="!projectPicker.loading && !projectPicker.items.length"
                    class="project-picker-empty"
                  >
                    <template v-if="projectSearch">ไม่พบโปรเจกต์ที่ตรงกับ "{{ projectSearch }}"</template>
                    <template v-else>ไม่พบโปรเจกต์</template>
                  </div>
                  <div v-if="projectPicker.loading" class="project-picker-loading">กำลังโหลด...</div>
                </div>
              </div>
            </div>

            <div v-if="form.role !== 'service'" class="form-field form-field-full">
              <label>อีเมล <span class="req">*</span></label>
              <input
                v-model.trim="form.email"
                type="email"
                class="form-input"
                placeholder="name@example.com"
                autocomplete="off"
                name="new-user-email"
                @keyup.enter="submit"
              />
            </div>

            <div v-if="form.role !== 'service'" class="form-field form-field-full">
              <label>รหัสผ่าน <span class="req">*</span></label>
              <div class="password-row">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  autocomplete="new-password"
                  name="new-user-password"
                  @keyup.enter="submit"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'"
                >
                  <b-icon :icon="showPassword ? 'eye-slash' : 'eye'"></b-icon>
                </button>
              </div>
            </div>

            <div class="form-field form-field-full">
              <label>วันหมดอายุบัญชี</label>
              <div class="expiry-presets">
                <button
                  type="button"
                  class="preset-btn"
                  :class="{ active: expiryPreset === '3' }"
                  @click="setExpiryMonths(3, '3')"
                >
                  3 เดือน
                </button>
                <button
                  type="button"
                  class="preset-btn"
                  :class="{ active: expiryPreset === '6' }"
                  @click="setExpiryMonths(6, '6')"
                >
                  6 เดือน
                </button>
                <button
                  type="button"
                  class="preset-btn"
                  :class="{ active: expiryPreset === '12' }"
                  @click="setExpiryMonths(12, '12')"
                >
                  12 เดือน
                </button>
                <button
                  type="button"
                  class="preset-btn"
                  :class="{ active: expiryPreset === 'custom' }"
                  @click="useCustomExpiry"
                >
                  กำหนดเอง
                </button>
                <button
                  type="button"
                  class="preset-btn"
                  :class="{ active: expiryPreset === 'never' }"
                  @click="setNeverExpire"
                >
                  ไม่กำหนดวันหมดอายุ
                </button>
                <button
                  v-if="form.expiresAt || expiryPreset === 'never'"
                  type="button"
                  class="preset-clear"
                  @click="clearExpiry"
                  title="ล้างการตั้งค่าวันหมดอายุ"
                >
                  <b-icon icon="x-circle"></b-icon>
                </button>
              </div>
              <date-picker
                v-if="expiryPreset !== 'never'"
                ref="expiryInput"
                v-model="form.expiresAt"
                type="date"
                placeholder="เลือกวันหมดอายุ"
                :disabled-date="isPastDate"
                :append-to-body="false"
                value-type="YYYY-MM-DD"
                format="DD/MM/YYYY"
                class="expiry-datepicker"
                @change="onExpiryChange"
              ></date-picker>
              <span v-if="expiryPreset === 'never'" class="expiry-hint">
                บัญชีนี้จะไม่มีวันหมดอายุ
              </span>
              <span v-else-if="form.expiresAt" class="expiry-hint">
                บัญชีจะหมดอายุวันที่ {{ formatExpiry(form.expiresAt) }}
              </span>
            </div>
          </div>

          <span v-if="error" class="form-error">{{ error }}</span>
        </div>

        <b-row class=" justify-content-end mx-3">
          <button class="btn-submit mx-3" :disabled="submitting" @click="submit">
            {{ submitting ? "กำลังบันทึก..." : "สร้างผู้ใช้" }}
          </button>
          <button class="btn-cancel " @click="closeModal">ยกเลิก</button>
        </b-row>
      </div>
    </vue-modaltor>
  </span>
</template>

<script>
function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function emptyForm() {
  return {
    username: "",
    name: "",
    lastname: "",
    company: "",
    project_id: "",
    email: "",
    password: "",
    role: "user",
    expiresAt: "",
    expiresInDays: null,
    neverExpire: false,
  };
}

export default {
  name: "CreateUserModal",
  data() {
    return {
      open: false,
      error: "",
      submitting: false,
      showPassword: false,
      usernameLocked: true,
      expiryPreset: "",
      projectMenuOpen: false,
      projectSearch: "",
      projectSearchTimer: null,
      form: emptyForm(),
    };
  },
  computed: {
    // Paginated project list backing the autocomplete dropdown.
    projectPicker() {
      return this.$store.getters.getProjectPicker;
    },
  },
  watch: {
    open(val) {
      if (val) {
        this.usernameLocked = true;
        this.projectMenuOpen = false;
        this.projectSearch = "";
        // Fresh picker each time the modal opens.
        this.$store.dispatch("resetProjectPicker");
        this.$store.dispatch("fetchProjectPickerPage");
        this.$nextTick(() => this.$refs.usernameInput && this.$refs.usernameInput.focus());
      }
    },
  },
  methods: {
    openProjectMenu() {
      this.projectMenuOpen = true;
    },
    closeProjectMenu() {
      this.projectMenuOpen = false;
      // If the admin typed something but never picked an option, revert
      // the box back to whatever project is actually selected.
      if (!this.form.project_id) {
        this.projectSearch = "";
        return;
      }
      const match = this.projectPicker.items.find((p) => p._id === this.form.project_id);
      if (match) this.projectSearch = match.projectname;
      // else: selected project isn't in the currently loaded/filtered
      // items — leave the box showing whatever name was set on select.
    },
    selectProject(p) {
      this.form.project_id = p ? p._id : "";
      this.projectSearch = p ? p.projectname : "";
      this.projectMenuOpen = false;
    },
    onProjectSearchInput() {
      this.projectMenuOpen = true;
      clearTimeout(this.projectSearchTimer);
      this.projectSearchTimer = setTimeout(() => {
        this.$store.dispatch("searchProjectPicker", this.projectSearch.trim());
      }, 300);
    },
    onProjectMenuScroll(e) {
      const el = e.target;
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
      if (nearBottom) {
        this.$store.dispatch("fetchProjectPickerPage");
      }
    },
    isPastDate(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    },
    closeExpiryPicker() {
      const picker = this.$refs.expiryInput;
      if (!picker) return;
      if (typeof picker.closePopup === "function") picker.closePopup();
      else if (typeof picker.closeDropdown === "function") picker.closeDropdown();
      else if (picker.$el && typeof picker.$el.blur === "function") picker.$el.blur();
    },
    onExpiryChange() {
      this.expiryPreset = "custom";
      this.form.expiresInDays = null;
      this.form.neverExpire = false;
      this.closeExpiryPicker();
    },
    setExpiryMonths(months, key) {
      const d = new Date();
      d.setMonth(d.getMonth() + months);
      const today0 = new Date();
      today0.setHours(0, 0, 0, 0);
      const target0 = new Date(d);
      target0.setHours(0, 0, 0, 0);
      this.form.expiresAt = toISODate(d);
      this.form.expiresInDays = Math.round((target0 - today0) / 86400000);
      this.form.neverExpire = false;
      this.expiryPreset = key;
      this.closeExpiryPicker();
    },
    useCustomExpiry() {
      this.expiryPreset = "custom";
      this.form.expiresInDays = null;
      this.form.neverExpire = false;
      this.$nextTick(() => {
        const picker = this.$refs.expiryInput;
        if (picker && typeof picker.focus === "function") picker.focus();
      });
    },
    setNeverExpire() {
      this.form.expiresAt = "";
      this.form.expiresInDays = null;
      this.form.neverExpire = true;
      this.expiryPreset = "never";
      this.closeExpiryPicker();
    },
    clearExpiry() {
      this.form.expiresAt = "";
      this.form.expiresInDays = null;
      this.form.neverExpire = false;
      this.expiryPreset = "";
      this.closeExpiryPicker();
    },
    formatExpiry(iso) {
      const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
      const d = new Date(iso + "T00:00:00");
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
    },
    closeModal() {
      this.open = false;
      this.error = "";
      this.showPassword = false;
      this.usernameLocked = true;
      this.expiryPreset = "";
      this.submitting = false;
      this.projectMenuOpen = false;
      this.form = emptyForm();
    },
    async submit() {
      if (!this.form.username || !this.form.name || !this.form.lastname || !this.form.email || !this.form.password && this.form.role !== "service") {
        this.error = "กรุณากรอก Username, ชื่อ, นามสกุล, อีเมล และรหัสผ่านให้ครบ";
        return;
      }
      if (this.form.password.length < 8) {
        this.error = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
        return;
      }

      const payload = {
        username: this.form.username,
        name: this.form.name,
        lastname: this.form.lastname,
        company: this.form.company,
        email: this.form.email,
        password: this.form.password,
        role: this.form.role,
        project_id: this.form.project_id || null,
      };

      if (this.form.neverExpire) {
        payload.neverExpire = true;
      } else if (this.expiryPreset === "custom" && this.form.expiresAt) {
        payload.expiresAt = new Date(`${this.form.expiresAt}T23:59:59.000Z`).toISOString();
      } else if (this.form.expiresInDays != null) {
        payload.expiresInDays = this.form.expiresInDays;
      }

      this.error = "";
      this.submitting = true;
      try {
        const user = await this.$store.dispatch("createUser", payload);
        this.$emit("created", user);
        this.closeModal();
      } catch (err) {
        console.log(err);
        this.error = "สร้างผู้ใช้ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped>
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
  font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
  display: flex;
  flex-direction: column;
  max-height: 85vh;
  overflow: hidden;
}

.modal-topbar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e4e1d8;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
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
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1 1 auto;
  overflow-y: auto;
  min-height: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 12px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.form-field-full {
  grid-column: 1 / -1;
}
.form-field label {
  font-size: 16px;
  font-weight: 500;
  color: #1c1e24;
}
.req {
  color: #c0392b;
}
.field-note {
  font-weight: 400;
  font-size: 12px;
  color: #6b7280;
  margin-left: 4px;
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
  width: 100%;
  box-sizing: border-box;
}
.form-input:focus {
  border-color: #128189;
  box-shadow: 0 0 0 2px rgba(18, 129, 137, 0.15);
}

.form-input:-webkit-autofill,
.form-input:-webkit-autofill:hover,
.form-input:-webkit-autofill:focus {
  -webkit-text-fill-color: #1c1e24;
  -webkit-box-shadow: 0 0 0 1000px #ffffff inset;
  box-shadow: 0 0 0 1000px #ffffff inset;
  transition: background-color 9999s ease-in-out 0s;
}

.form-error {
  font-size: 14px;
  color: #c0392b;
}

.expiry-presets {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.preset-btn {
  background: #ffffff;
  border: 1px solid #e4e1d8;
  color: #1c1e24;
  border-radius: 999px;
  padding: 5px 14px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}
.preset-btn:hover {
  background: #f6f5f0;
}
.preset-btn.active {
  background: #128189;
  border-color: #128189;
  color: #ffffff;
}

.preset-clear {
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 50%;
}
.preset-clear:hover {
  background: #f6f5f0;
  color: #c0392b;
}

.expiry-hint {
  display: block;
  margin-top: 6px;
  font-size: 14px;
  color: #6b7280;
}

.expiry-datepicker {
  width: 100%;
  position: relative;
  z-index: 5;
}
::v-deep .expiry-datepicker.mx-datepicker,
.expiry-datepicker.mx-datepicker {
  width: 100%;
}
::v-deep .expiry-datepicker .mx-input,
.expiry-datepicker .mx-input {
  height: auto;
  border: 1px solid #e4e1d8;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  color: #1c1e24;
  box-shadow: none;
}
::v-deep .expiry-datepicker .mx-input:focus,
.expiry-datepicker .mx-input:focus {
  border-color: #128189;
  box-shadow: 0 0 0 2px rgba(18, 129, 137, 0.15);
}

.password-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.password-row .form-input {
  flex: 1;
}
.password-toggle {
  background: transparent;
  border: 1px solid #e4e1d8;
  border-radius: 8px;
  padding: 8px 10px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.password-toggle:hover {
  background: #f6f5f0;
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236b7280'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  padding-right: 32px;
  cursor: pointer;
}

.project-picker {
  position: relative;
  outline: none;
}

.project-picker-input {
  padding-right: 32px;
  cursor: text;
}
.project-picker-caret {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
}

.project-picker-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 220px;
  overflow-y: auto;
  background: #ffffff;
  border: 1px solid #e4e1d8;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(28, 30, 36, 0.12);
  padding: 4px;
}

.project-picker-item {
  padding: 8px 10px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  color: #1c1e24;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.project-picker-item:hover {
  background: #f6f5f0;
}
.project-picker-item.active {
  background: #128189;
  color: #ffffff;
}

.project-picker-loading,
.project-picker-empty {
  padding: 8px 10px;
  font-size: 13px;
  color: #6b7280;
  text-align: center;
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
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

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
  overflow: visible !important;
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
</style>v