<template>
  <span>
    <b-button size="md" class="create-btn" pill @click="open = true">
      <b-icon icon="folder-plus"></b-icon> สร้างโปรเจกต์
    </b-button>

    <vue-modaltor
      :visible="open"
      @hide="closeModal"
      :animation-panel="'modal-slide-top'"
      :resize-width="{ 3000: '100vw', 1200: '92vw', 768: '92vw', 480: '92vw' }"
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
              <input type="checkbox" v-model="isActiveStatus" class="switch-input" />
              <span class="switch-track"><span class="switch-thumb"></span></span>
              <span class="switch-text">เปิดใช้งาน Project</span>
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
              </div>

              <!-- Invisible twin of the domain column's action row below,
                   purely to reserve the same vertical space so both
                   combo boxes line up — see .invisible below. -->
              <div class="picker-col-actions invisible" aria-hidden="true">
                <button type="button" tabindex="-1" class="picker-action-link">เลือกทั้งหมด</button>
                <span class="picker-action-sep">·</span>
                <button type="button" tabindex="-1" class="picker-action-link">ล้างทั้งหมด</button>
              </div>

              <div class="combo" tabindex="-1" @focusout="closeUserMenu">
                <div class="combo-shell" @click="focusUserInput">
                  <span v-for="u in selectedUsers" :key="u._id" class="combo-chip">
                    <span class="combo-chip-avatar">{{ u.initial }}</span>
                    {{ u.name || u.username }}
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
                        <span class="pick-name">{{ u.name || u.username }}</span>
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
                <div class="mode-toggle" role="tablist">
                  <button
                    type="button"
                    class="mode-toggle-btn"
                    :class="{ active: domainSelectMode === 'custom' }"
                    role="tab"
                    :aria-selected="domainSelectMode === 'custom'"
                    @click="domainSelectMode = 'custom'"
                  >
                    กำหนดเอง
                  </button>
                  <button
                    type="button"
                    class="mode-toggle-btn"
                    :class="{ active: domainSelectMode === 'copy' }"
                    role="tab"
                    :aria-selected="domainSelectMode === 'copy'"
                    @click="domainSelectMode = 'copy'"
                  >
                    คัดลอกจากโปรเจกต์อื่น
                  </button>
                </div>
              </div>

              <!-- Kept mounted (not v-if) and just hidden when not in
                   custom mode, so this column's own layout doesn't shift
                   when switching modes, and so the user column's matching
                   invisible row above stays a reliable stand-in for it. -->
              <div class="picker-col-actions" :class="{ invisible: domainSelectMode !== 'custom' }">
                <button type="button" class="picker-action-link" @click="selectAllDomains">เลือกทั้งหมด</button>
                <span class="picker-action-sep">·</span>
                <button type="button" class="picker-action-link" @click="form.domainIds = []">ล้างทั้งหมด</button>
              </div>

              <div v-if="domainSelectMode === 'custom'" class="combo" tabindex="-1" @focusout="closeDomainMenu">
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
                        <span class="pick-name-row">
                          <span class="pick-name">{{ d.name }}</span>
                          <span
                            class="domain-status-badge"
                            :class="d.display !== false ? 'is-on' : 'is-off'"
                            :title="d.display !== false ? 'แสดงผลอยู่' : 'ซ่อนอยู่'"
                          >
                            <span class="domain-status-dot"></span>
                            {{ d.display !== false ? "แสดงผล" : "ซ่อนอยู่" }}
                          </span>
                        </span>
                        <span v-if="(d.permission || []).length" class="domain-permission-chips">
                          <span v-for="p in d.permission" :key="p" class="domain-permission-chip">{{
                            permissionLabel(p)
                          }}</span>
                        </span>
                      </span>
                    </div>

                    <div v-if="filteredDomains.length === 0" class="pick-empty">
                      ไม่พบโดเมนที่ตรงกับ "{{ domainSearch }}"
                    </div>
                  </template>
                </div>
              </div>

              <div v-else class="combo" tabindex="-1" @focusout="closeDomainSourceMenu">
                <div class="combo-shell" @click="focusDomainSourceInput">
                  <span v-if="selectedDomainSourceProject" class="combo-chip source">
                    {{ selectedDomainSourceProject.projectname }}
                    <button type="button" class="combo-chip-remove" @click.stop="clearDomainSource" aria-label="เอาออก">×</button>
                  </span>
                  <input
                    ref="domainSourceInput"
                    v-model.trim="domainSourceSearch"
                    class="combo-input"
                    :placeholder="selectedDomainSourceProject ? '' : 'ค้นหาโปรเจกต์ต้นทาง...'"
                    @focus="domainSourceMenuOpen = true"
                    @input="domainSourceMenuOpen = true"
                  />
                  <b-icon icon="chevron-down" class="combo-caret" :class="{ open: domainSourceMenuOpen }"></b-icon>
                </div>

                <div v-if="domainSourceMenuOpen" class="combo-dropdown" @mousedown.prevent @scroll="onCopySourceDropdownScroll">
                  <div v-if="copySourceLoading" class="pick-empty">กำลังโหลด...</div>
                  <template v-else>
                    <div
                      v-for="p in filteredDomainSourceProjects"
                      :key="p._id"
                      class="user-pick-row"
                      :class="{ checked: domainSourceProjectId === p._id }"
                      @click="selectDomainSourceProject(p._id)"
                    >
                      <span class="pick-text">
                        <span class="pick-name">{{ p.projectname }}</span>
                        <span class="pick-role">{{ (p.domainlist || []).length }} โดเมน</span>
                      </span>
                    </div>

                    <div v-if="filteredDomainSourceProjects.length === 0" class="pick-empty">
                      ไม่พบโปรเจกต์ที่ตรงกับ "{{ domainSourceSearch }}"
                    </div>
                    <div v-if="copySourceLoadingMore" class="pick-empty">กำลังโหลดเพิ่มเติม...</div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <div class="copy-section">
            <div class="copy-section-header">
              <div>
                <label class="picker-col-label">คัดลอก Target / Hashtag จากโปรเจกต์อื่น</label>
                <p class="picker-col-hint">
                  ติ๊กรายการที่จะคัดลอก แล้วเลือกโปรเจกต์ต้นทาง — คัดลอกทันทีที่เลือก และเพิ่มเข้าไปโดยไม่ลบของเดิม
                </p>
              </div>
            </div>

            <div class="copy-checkboxes">
              <label class="copy-checkbox-row">
                <input type="checkbox" v-model="copyTargetChecked" />
                <span>คัดลอก Target</span>
              </label>
              <label class="copy-checkbox-row">
                <input type="checkbox" v-model="copyHashtagChecked" />
                <span>คัดลอก Hashtag</span>
              </label>
            </div>

            <div v-if="copyTargetChecked || copyHashtagChecked" class="picker-columns">
              <div v-if="copyTargetChecked" class="picker-col">
                <label class="picker-col-label">โปรเจกต์ต้นทาง (Target)</label>
                <div class="combo" tabindex="-1" @focusout="closeTargetSourceMenu">
                  <div class="combo-shell" @click="focusTargetSourceInput">
                    <span v-if="selectedTargetSourceProject" class="combo-chip source">
                      {{ selectedTargetSourceProject.projectname }}
                      <button type="button" class="combo-chip-remove" @click.stop="clearTargetSource" aria-label="เอาออก">×</button>
                    </span>
                    <input
                      ref="targetSourceInput"
                      v-model.trim="targetSourceSearch"
                      class="combo-input"
                      :placeholder="selectedTargetSourceProject ? '' : 'ค้นหาโปรเจกต์ต้นทาง...'"
                      @focus="targetSourceMenuOpen = true"
                      @input="targetSourceMenuOpen = true"
                    />
                    <b-icon icon="chevron-down" class="combo-caret" :class="{ open: targetSourceMenuOpen }"></b-icon>
                  </div>

                  <div v-if="targetSourceMenuOpen" class="combo-dropdown" @mousedown.prevent @scroll="onCopySourceDropdownScroll">
                    <div v-if="copySourceLoading" class="pick-empty">กำลังโหลด...</div>
                    <template v-else>
                      <div
                        v-for="p in filteredTargetSourceProjects"
                        :key="p._id"
                        class="user-pick-row"
                        :class="{ checked: targetSourceProjectId === p._id }"
                        @click="selectTargetSourceProject(p._id)"
                      >
                        <span class="pick-text">
                          <span class="pick-name">{{ p.projectname }}</span>
                          <span class="pick-role">{{ (p.targetlist || []).length }} target</span>
                        </span>
                      </div>

                      <div v-if="filteredTargetSourceProjects.length === 0" class="pick-empty">
                        ไม่พบโปรเจกต์ที่ตรงกับ "{{ targetSourceSearch }}"
                      </div>
                      <div v-if="copySourceLoadingMore" class="pick-empty">กำลังโหลดเพิ่มเติม...</div>
                    </template>
                  </div>
                </div>
              </div>

              <div v-if="copyHashtagChecked" class="picker-col">
                <label class="picker-col-label">โปรเจกต์ต้นทาง (Hashtag)</label>
                <div class="combo" tabindex="-1" @focusout="closeHashtagSourceMenu">
                  <div class="combo-shell" @click="focusHashtagSourceInput">
                    <span v-if="selectedHashtagSourceProject" class="combo-chip source">
                      {{ selectedHashtagSourceProject.projectname }}
                      <button type="button" class="combo-chip-remove" @click.stop="clearHashtagSource" aria-label="เอาออก">×</button>
                    </span>
                    <input
                      ref="hashtagSourceInput"
                      v-model.trim="hashtagSourceSearch"
                      class="combo-input"
                      :placeholder="selectedHashtagSourceProject ? '' : 'ค้นหาโปรเจกต์ต้นทาง...'"
                      @focus="hashtagSourceMenuOpen = true"
                      @input="hashtagSourceMenuOpen = true"
                    />
                    <b-icon icon="chevron-down" class="combo-caret" :class="{ open: hashtagSourceMenuOpen }"></b-icon>
                  </div>

                  <div v-if="hashtagSourceMenuOpen" class="combo-dropdown" @mousedown.prevent @scroll="onCopySourceDropdownScroll">
                    <div v-if="copySourceLoading" class="pick-empty">กำลังโหลด...</div>
                    <template v-else>
                      <div
                        v-for="p in filteredHashtagSourceProjects"
                        :key="p._id"
                        class="user-pick-row"
                        :class="{ checked: hashtagSourceProjectId === p._id }"
                        @click="selectHashtagSourceProject(p._id)"
                      >
                        <span class="pick-text">
                          <span class="pick-name">{{ p.projectname }}</span>
                          <span class="pick-role">{{ (p.hastaglist || []).length }} hashtag</span>
                        </span>
                      </div>

                      <div v-if="filteredHashtagSourceProjects.length === 0" class="pick-empty">
                        ไม่พบโปรเจกต์ที่ตรงกับ "{{ hashtagSourceSearch }}"
                      </div>
                      <div v-if="copySourceLoadingMore" class="pick-empty">กำลังโหลดเพิ่มเติม...</div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <b-row class=" justify-content-end mx-3">
          <button class="btn-submit mx-3" :disabled="submitting" @click="submit">
            {{ submitting ? "กำลังบันทึก..." : "สร้างโปรเจกต์" }}
          </button>
          <button class="btn-cancel " @click="closeModal">ยกเลิก</button>
        </b-row>
      </div>
    </vue-modaltor>
  </span>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "CreateProjectModal",
  data() {
    return {
      open: false,
      error: "",
      submitting: false,
      userSearch: "",
      domainSearch: "",
      userMenuOpen: false,
      domainMenuOpen: false,
      form: { projectname: "", status: "inactive", userIds: [], domainIds: [], targetlist: [], hastaglist: [] },
      // Domain field has two modes: "custom" (default — pick individual
      // domains via the existing multi-select combo) or "copy" (pick a
      // source project and use its domain list instead). Both write to
      // the same form.domainIds, so switching back to "custom" after a
      // copy shows the copied domains pre-checked and still editable.
      domainSelectMode: "custom",
      domainSourceProjectId: null,
      domainSourceSearch: "",
      domainSourceMenuOpen: false,
      // "Copy from another project" state — kept separate from `form`
      // since these are pickers for a *source*, not fields being saved.
      // Target and Hashtag each get their own independent source project
      // so you can copy Target from one project and Hashtag from another.
      copyTargetChecked: false,
      copyHashtagChecked: false,
      targetSourceProjectId: null,
      targetSourceSearch: "",
      targetSourceMenuOpen: false,
      hashtagSourceProjectId: null,
      hashtagSourceSearch: "",
      hashtagSourceMenuOpen: false,
      // Accumulated pages of projects for the pickers above (Target,
      // Hashtag, and Domain source pickers all draw from this same pool —
      // see loadCopySourceProjects()).
      copySourceProjectsList: [],
      copySourcePage: 1,
      copySourceHasMore: true,
      copySourceLoading: false,
      copySourceLoadingMore: false,
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
    // Ordered by form.userIds (the order they were clicked), not by the
    // picker list's original order — otherwise chips jump around to match
    // whatever order the API happened to return, instead of the order
    // the admin actually picked them in.
    selectedUsers() {
      return this.form.userIds.map((id) => this.users.find((u) => u._id === id)).filter(Boolean);
    },
    isActiveStatus: {
      get() {
        return this.form.status === "active";
      },
      set(val) {
        this.form.status = val ? "active" : "inactive";
      },
    },
    filteredUsers() {
      const q = this.userSearch.toLowerCase();
      if (!q) return this.users;
      return this.users.filter(
        (u) =>
          (u.name || u.username || "").toLowerCase().includes(q) ||
          (u.username || "").toLowerCase().includes(q) ||
          (u.role || "").toLowerCase().includes(q)
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
    // Own accumulated list, built up page-by-page via loadCopySourceProjects()
    // below, rather than reading getProjects directly. getProjects/
    // getProjectsPagination are the SAME store state ProjectMain's grid
    // renders — repeatedly calling fetchProjects({ page }) as you scroll
    // this dropdown would overwrite that shared state page-by-page and
    // could leave the grid on a different page once this modal closes.
    // Keeping our own copy of the results sidesteps that.
    copySourceProjects() {
      return this.copySourceProjectsList.filter((p) => p && p._id);
    },
    filteredTargetSourceProjects() {
      const q = this.targetSourceSearch.toLowerCase();
      if (!q) return this.copySourceProjects;
      return this.copySourceProjects.filter((p) => (p.projectname || "").toLowerCase().includes(q));
    },
    selectedTargetSourceProject() {
      return this.copySourceProjects.find((p) => p._id === this.targetSourceProjectId) || null;
    },
    filteredHashtagSourceProjects() {
      const q = this.hashtagSourceSearch.toLowerCase();
      if (!q) return this.copySourceProjects;
      return this.copySourceProjects.filter((p) => (p.projectname || "").toLowerCase().includes(q));
    },
    selectedHashtagSourceProject() {
      return this.copySourceProjects.find((p) => p._id === this.hashtagSourceProjectId) || null;
    },
    filteredDomainSourceProjects() {
      const q = this.domainSourceSearch.toLowerCase();
      if (!q) return this.copySourceProjects;
      return this.copySourceProjects.filter((p) => (p.projectname || "").toLowerCase().includes(q));
    },
    selectedDomainSourceProject() {
      return this.copySourceProjects.find((p) => p._id === this.domainSourceProjectId) || null;
    },
  },
  watch: {
    open(val) {
      if (val) {
        // Fresh lists each time the modal opens.
        this.$store.dispatch("fetchUserPickerList");
        this.$store.dispatch("fetchDomainList");
        this.copySourceProjectsList = [];
        this.copySourcePage = 1;
        this.copySourceHasMore = true;
        this.loadCopySourceProjects(1);
        this.$nextTick(() => this.$refs.nameInput && this.$refs.nameInput.focus());
      }
    },
  },
  methods: {
    permissionLabel(key) {
      const labels = {
        hottopics: "ประเด็นร้อน",
        face: "ตรวจจับใบหน้า",
        suggestionkeyword: "คำแนะนำคำค้น",
      };
      return labels[key] || key;
    },
    removeUser(id) {
      this.form.userIds = this.form.userIds.filter((existingId) => existingId !== id);
    },
    removeDomain(id) {
      this.form.domainIds = this.form.domainIds.filter((existingId) => existingId !== id);
    },
    // Rows are plain <div>s (not <label>s wrapping the checkbox) because
    // the dropdown's @mousedown.prevent — needed to keep the combo's text
    // input focused while clicking inside the list — also silently blocks
    // a <label>'s native "click toggles its checkbox" behavior in most
    // browsers. Toggling explicitly here sidesteps that entirely.
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
    // Clicking anywhere in the combobox shell (not on a chip's × button,
    // which stops propagation itself) focuses the inner text input, same
    // as clicking a native <select>/Vuetify combobox opens it.
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
    focusDomainSourceInput() {
      this.domainSourceMenuOpen = true;
      this.$nextTick(() => this.$refs.domainSourceInput && this.$refs.domainSourceInput.focus());
    },
    closeDomainSourceMenu() {
      this.domainSourceMenuOpen = false;
    },
    // Replaces form.domainIds rather than merging — this is a mode for
    // *defining* the domain list from a source project, not layering
    // extra domains on top, so picking a different source project should
    // swap to that project's domains rather than accumulate.
    selectDomainSourceProject(id) {
      this.domainSourceProjectId = id;
      this.domainSourceSearch = "";
      this.domainSourceMenuOpen = false;

      const source = this.copySourceProjects.find((p) => p._id === id);
      if (!source) return;

      this.form.domainIds = (source.domainlist || [])
        .filter(Boolean)
        .map((d) => (typeof d === "string" ? d : d._id))
        .filter(Boolean);
    },
    clearDomainSource() {
      this.domainSourceProjectId = null;
    },
    focusTargetSourceInput() {
      this.targetSourceMenuOpen = true;
      this.$nextTick(() => this.$refs.targetSourceInput && this.$refs.targetSourceInput.focus());
    },
    closeTargetSourceMenu() {
      this.targetSourceMenuOpen = false;
    },
    // Selecting a project copies immediately — merges into whatever's
    // already in form.targetlist rather than overwriting, so picking a
    // second source afterwards adds to it instead of replacing it.
    // Exact-match dedupe since target keywords are usually meant to stay
    // as typed.
    selectTargetSourceProject(id) {
      this.targetSourceProjectId = id;
      this.targetSourceSearch = "";
      this.targetSourceMenuOpen = false;

      const source = this.copySourceProjects.find((p) => p._id === id);
      if (!source) return;

      const targets = new Set(this.form.targetlist);
      (source.targetlist || []).forEach((t) => t && targets.add(t));
      this.form.targetlist = Array.from(targets);
    },
    clearTargetSource() {
      this.targetSourceProjectId = null;
    },
    focusHashtagSourceInput() {
      this.hashtagSourceMenuOpen = true;
      this.$nextTick(() => this.$refs.hashtagSourceInput && this.$refs.hashtagSourceInput.focus());
    },
    closeHashtagSourceMenu() {
      this.hashtagSourceMenuOpen = false;
    },
    selectHashtagSourceProject(id) {
      this.hashtagSourceProjectId = id;
      this.hashtagSourceSearch = "";
      this.hashtagSourceMenuOpen = false;

      const source = this.copySourceProjects.find((p) => p._id === id);
      if (!source) return;

      const hashtags = new Set(this.form.hastaglist);
      (source.hastaglist || []).forEach((h) => h && hashtags.add(h));
      this.form.hastaglist = Array.from(hashtags);
    },
    clearHashtagSource() {
      this.hashtagSourceProjectId = null;
    },
    // Loads one page of projects into copySourceProjectsList, appending
    // rather than replacing (except for page 1, which starts fresh).
    // Dispatches the same fetchProjects({ page, limit }) action the main
    // grid's pagination uses, but immediately reads the result back into
    // our own local array instead of leaving the picker bound to the
    // shared getProjects/getProjectsPagination state — see the comment on
    // copySourceProjects above for why.
    async loadCopySourceProjects(page) {
      if (page === 1) {
        this.copySourceLoading = true;
      } else {
        this.copySourceLoadingMore = true;
      }
      try {
        await this.$store.dispatch("fetchProjects", { page, limit: 20 });
        const items = (this.$store.getters.getProjects || []).filter((p) => p && p._id);
        if (page === 1) {
          this.copySourceProjectsList = items;
        } else {
          const existingIds = new Set(this.copySourceProjectsList.map((p) => p._id));
          items.forEach((p) => {
            if (!existingIds.has(p._id)) this.copySourceProjectsList.push(p);
          });
        }
        this.copySourcePage = page;
        const pagination = this.$store.getters.getProjectsPagination || {};
        const totalPages =
          pagination.totalPages || (pagination.limit ? Math.ceil((pagination.total || 0) / pagination.limit) : page);
        this.copySourceHasMore = page < totalPages;
      } finally {
        this.copySourceLoading = false;
        this.copySourceLoadingMore = false;
      }
    },
    // Shared scroll handler for both the Target and Hashtag dropdowns —
    // same near-bottom threshold as ProjectManagement.vue's project
    // filter dropdown.
    onCopySourceDropdownScroll(e) {
      if (this.copySourceLoading || this.copySourceLoadingMore || !this.copySourceHasMore) return;
      const el = e.target;
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 60) {
        this.loadCopySourceProjects(this.copySourcePage + 1);
      }
    },
    closeModal() {
      this.open = false;
      this.error = "";
      this.submitting = false;
      this.userSearch = "";
      this.domainSearch = "";
      this.userMenuOpen = false;
      this.domainMenuOpen = false;
      this.domainSelectMode = "custom";
      this.domainSourceProjectId = null;
      this.domainSourceSearch = "";
      this.domainSourceMenuOpen = false;
      this.copyTargetChecked = false;
      this.copyHashtagChecked = false;
      this.targetSourceProjectId = null;
      this.targetSourceSearch = "";
      this.targetSourceMenuOpen = false;
      this.hashtagSourceProjectId = null;
      this.hashtagSourceSearch = "";
      this.hashtagSourceMenuOpen = false;
      this.copySourceProjectsList = [];
      this.copySourcePage = 1;
      this.copySourceHasMore = true;
      this.form = { projectname: "", status: "inactive", userIds: [], domainIds: [], targetlist: [], hastaglist: [] };
    },
    async submit() {
      if (!this.form.projectname) {
        this.error = "กรุณากรอกชื่อโปรเจกต์";
        return;
      }

      const payload = {
        projectname: this.form.projectname,
        status: this.form.status,
        domainlist: this.form.domainIds,
        userlist: this.form.userIds,
        targetlist: this.form.targetlist,
        hastaglist: this.form.hastaglist,
      };

      this.error = "";
      this.submitting = true;
      try {
        const project = await this.$store.dispatch("createProject", payload);
        await this.$store.dispatch("fetchProjects", { page: 1 });
        this.$emit("created", project);
        this.closeModal();
        Swal.fire({
          title: "บันทึกแล้ว!",
          text: "ข้อมูลของคุณถูกบันทึกเรียบร้อย",
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
          allowOutsideClick: false,
          allowEscapeKey: false,
          buttonsStyling: false,
        });
      } catch (err) {
        console.log(err);
        this.error = "สร้างโปรเจกต์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
        Swal.fire({
          icon: "error",
          title: "สร้างโปรเจกต์ไม่สำเร็จ",
          text: err.response?.data?.message || "เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง",
        });
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
  justify-content: end;
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

/* Combobox: a select-like box with chips embedded inside it and a
   dropdown list of checkable options underneath — modeled after Vuetify's
   chip-autocomplete, kept in this app's own light color scheme instead of
   Vuetify's default dark theme. */
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
  padding: 6px 8px;
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
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 20;
  width: 100%;
  box-sizing: border-box;
  margin-top: 6px;
  max-height: 200px;
  border: 1px solid #e4e1d8;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(28, 30, 36, 0.12);
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
  flex: 1;
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

.pick-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
}
.pick-name-row .pick-name {
  flex-shrink: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.domain-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  font-size: 11.5px;
  font-weight: 500;
  white-space: nowrap;
}
.domain-status-dot {
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.domain-status-badge.is-on {
  color: #128189;
}
.domain-status-badge.is-on .domain-status-dot {
  background: #128189;
}
.domain-status-badge.is-off {
  color: #9aa0ac;
}
.domain-status-badge.is-off .domain-status-dot {
  background: rgba(28, 30, 36, 0.25);
}
.domain-permission-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 3px;
}
.domain-permission-chip {
  font-size: 11px;
  line-height: 1.4;
  color: #128189;
  background: rgba(18, 129, 137, 0.09);
  border: 1px solid rgba(18, 129, 137, 0.18);
  border-radius: 999px;
  padding: 1px 8px;
}

.pick-empty {
  padding: 16px 12px;
  font-size: 14px;
  color: #6b7280;
  font-style: italic;
  text-align: center;
}

.copy-section {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 4px;
  border-top: 1px dashed #e4e1d8;
}

.copy-section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 4px 8px;
}

.copy-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}

.copy-checkbox-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #1c1e24;
  cursor: pointer;
  user-select: none;
}

.copy-checkbox-row input[type="checkbox"] {
  accent-color: #128189;
  width: 15px;
  height: 15px;
  cursor: pointer;
}

.mode-toggle {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  flex-shrink: 0;
  margin-top: 1px;
  gap: 2px;
  min-height: 34px;
  box-sizing: border-box;
  padding: 3px;
  border: 1px solid #e4e1d8;
  border-radius: 9px;
  background: #f6f5f0;
}

/* Reserves the same space as .picker-col-actions without showing it —
   used both for the domain column's own action row when it's not in
   custom mode (so switching modes doesn't shift that column's layout),
   and as an invisible twin in the user column so both columns' combo
   boxes stay lined up regardless of which mode is active. */
.invisible {
  visibility: hidden;
  pointer-events: none;
}

.mode-toggle-btn {
  border: none;
  background: transparent;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
}
.mode-toggle-btn:hover {
  color: #1c1e24;
}
.mode-toggle-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(18, 129, 137, 0.25);
}
.mode-toggle-btn.active {
  background: #128189;
  color: #ffffff;
  box-shadow: 0 1px 2px rgba(28, 30, 36, 0.12);
}

.combo-chip.source {
  background: rgba(139, 127, 224, 0.14);
  color: #4b3f9e;
  padding-left: 12px;
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
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 700px) {
  /* Side-by-side doesn't have room on phone-width screens — stack the
     two picker columns instead. */
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