<template>
  <span>
    <b-button size="md" class="create-btn create-btn-user" pill @click="open = true">
      <b-icon icon="person-plus"></b-icon> สร้างผู้ใช้
    </b-button>

    <vue-modaltor
      :visible="open"
      @hide="closeModal"
      :animation-panel="'modal-slide-top'"
      :resize-width="{ 3000: '520px', 1200: '520px', 768: '92vw', 480: '92vw' }"
      class="create-modal"
    >
      <div class="modal-shell">
        <div class="modal-topbar">
          <div class="modal-title">
            <b-icon icon="person-plus"></b-icon>
            สร้างผู้ใช้ใหม่
          </div>
          <button class="modal-close-btn" @click="closeModal" aria-label="ปิดหน้าต่าง">
            <b-icon icon="x"></b-icon>
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
              <label>Role</label>
              <select v-model="form.role" class="form-input form-select">
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>

            <div class="form-field">
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

            <div class="form-field">
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

            <div class="form-field">
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
              <select v-model="form.project_id" class="form-input form-select">
                <option value="">— ไม่ระบุ —</option>
                <option v-for="p in projects" :key="p._id.$oid" :value="p._id.$oid">
                  {{ p.projectname }}
                </option>
              </select>
            </div>

            <div class="form-field form-field-full">
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

            <div class="form-field form-field-full">
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
          </div>

          <span v-if="error" class="form-error">{{ error }}</span>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">ยกเลิก</button>
          <button class="btn-submit" @click="submit">สร้างผู้ใช้</button>
        </div>
      </div>
    </vue-modaltor>
  </span>
</template>

<script>
function newId() {
  const hex = "0123456789abcdef";
  let id = "";
  for (let i = 0; i < 24; i++) id += hex[Math.floor(Math.random() * 16)];
  return id;
}

function todayJoined() {
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const d = new Date();
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
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
  };
}

export default {
  name: "CreateUserModal",
  props: {
    // Full project list to pick from, e.g. `:projects="projects"` from mock.js PROJECTS
    projects: { type: Array, default: () => [] },
  },
  data() {
    return {
      open: false,
      error: "",
      showPassword: false,
      // Starts readonly so Chrome can't autofill it on open; removed as
      // soon as the field is focused (see @focus on the input).
      usernameLocked: true,
      form: emptyForm(),
    };
  },
  watch: {
    open(val) {
      if (val) {
        this.usernameLocked = true;
        this.$nextTick(() => this.$refs.usernameInput && this.$refs.usernameInput.focus());
      }
    },
  },
  methods: {
    closeModal() {
      this.open = false;
      this.error = "";
      this.showPassword = false;
      this.usernameLocked = true;
      this.form = emptyForm();
    },
    submit() {
      if (!this.form.username || !this.form.name || !this.form.lastname || !this.form.email || !this.form.password) {
        this.error = "กรุณากรอก Username, ชื่อ, นามสกุล, อีเมล และรหัสผ่านให้ครบ";
        return;
      }
      if (this.form.password.length < 8) {
        this.error = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
        return;
      }

      const user = {
        // Fields matching the requested schema:
        username: this.form.username,
        name: this.form.name,
        lastname: this.form.lastname,
        company: this.form.company,
        email: this.form.email,
        password: this.form.password,
        role: this.form.role,
        project_id: this.form.project_id || null,
        // isActive: true,

        // Derived fields kept so the existing user table/list still
        // renders correctly (initial, status label, join date).
        _id: newId(),
        initial: this.form.name.trim().charAt(0),
        status: "ใช้งานอยู่",
        joined: todayJoined(),
      };
      this.$emit("created", user);
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
.create-btn-user {
  background: #ffffff !important;
  border-color: var(--teal, #128189) !important;
  color: var(--teal, #128189) !important;
}
.create-btn-user:hover {
  background: rgba(18, 129, 137, 0.08) !important;
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
  gap: 14px;
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
  width: 100%;
  box-sizing: border-box;
}
.form-input:focus {
  border-color: var(--teal, #128189);
  box-shadow: 0 0 0 2px rgba(18, 129, 137, 0.15);
}

/* Kill Chrome's default blue/yellow autofill tint so autofilled fields
   still match the rest of the form. */
.form-input:-webkit-autofill,
.form-input:-webkit-autofill:hover,
.form-input:-webkit-autofill:focus {
  -webkit-text-fill-color: var(--text, #1c1e24);
  -webkit-box-shadow: 0 0 0 1000px var(--surface, #ffffff) inset;
  box-shadow: 0 0 0 1000px var(--surface, #ffffff) inset;
  transition: background-color 9999s ease-in-out 0s;
}

.form-error {
  font-size: 12px;
  color: #c0392b;
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
  border: 1px solid var(--border, #e4e1d8);
  border-radius: 8px;
  padding: 8px 10px;
  color: var(--muted, #6b7280);
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.password-toggle:hover {
  background: var(--bg, #f6f5f0);
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

@media (max-width: 480px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
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