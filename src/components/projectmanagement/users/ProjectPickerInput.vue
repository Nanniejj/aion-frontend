<template>
  <!-- ช่องเลือกโปรเจกต์แบบค้นหาได้ (autocomplete) ใช้ซ้ำได้หลายช่องในหน้าเดียว
       ใช้ store projectPicker ตัวเดียวกับ CreateUserModal — เปิดได้ทีละช่อง
       ช่องที่ focus อยู่จะ reset/ค้นหารายการใหม่ของตัวเอง -->
  <div class="project-picker" tabindex="-1" @focusout="closeMenu">
    <input
      :value="menuOpen ? search : label"
      type="text"
      class="form-input project-picker-input"
      :class="{ 'is-invalid': invalid }"
      :placeholder="placeholder"
      autocomplete="off"
      @focus="openMenu"
      @input="onInput($event.target.value)"
    />
    <b-icon icon="chevron-down" class="project-picker-caret"></b-icon>
    <div v-if="menuOpen" class="project-picker-menu" @scroll="onScroll" @mousedown.prevent>
      <div v-if="allowEmpty" class="project-picker-item" :class="{ active: !value }" @click="select(null)">
        — ไม่ระบุ —
      </div>
      <div
        v-for="p in picker.items"
        :key="p._id"
        class="project-picker-item"
        :class="{ active: value === p._id }"
        @click="select(p)"
      >
        {{ p.projectname }}
      </div>
      <div v-if="!picker.loading && !picker.items.length" class="project-picker-empty">
        <template v-if="search">ไม่พบโปรเจกต์ที่ตรงกับ "{{ search }}"</template>
        <template v-else>ไม่พบโปรเจกต์</template>
      </div>
      <div v-if="picker.loading" class="project-picker-loading">กำลังโหลด...</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectPickerInput",
  props: {
    value: { type: String, default: "" }, // project _id ที่เลือกอยู่
    label: { type: String, default: "" }, // ชื่อโปรเจกต์ที่เลือกอยู่ (ไว้แสดงตอนปิดเมนู)
    placeholder: { type: String, default: "พิมพ์เพื่อค้นหาโปรเจกต์..." },
    allowEmpty: { type: Boolean, default: true },
    invalid: { type: Boolean, default: false },
  },
  data() {
    return {
      menuOpen: false,
      search: "",
      timer: null,
    };
  },
  computed: {
    picker() {
      return this.$store.getters.getProjectPicker;
    },
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    openMenu() {
      this.menuOpen = true;
      this.search = "";
      // แต่ละช่องอาจเคยค้นหาคำอื่นไว้ → เริ่มรายการใหม่ทุกครั้งที่เปิด
      this.$store.dispatch("searchProjectPicker", "");
    },
    closeMenu() {
      this.menuOpen = false;
      this.search = "";
    },
    onInput(val) {
      this.search = val;
      this.menuOpen = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$store.dispatch("searchProjectPicker", this.search.trim());
      }, 300);
    },
    onScroll(e) {
      const el = e.target;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) {
        this.$store.dispatch("fetchProjectPickerPage");
      }
    },
    select(p) {
      this.$emit("select", p ? { _id: p._id, projectname: p.projectname } : { _id: "", projectname: "" });
      this.menuOpen = false;
      this.search = "";
    },
  },
};
</script>

<style scoped>
.project-picker {
  position: relative;
  outline: none;
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
.form-input.is-invalid {
  border-color: #c0392b;
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
  z-index: 20;
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
</style>
