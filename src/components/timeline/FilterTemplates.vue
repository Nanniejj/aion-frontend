<template>
  <!-- A reusable modal for managing saved filter templates -->
  <b-modal :id="modalId" title="จัดการเทมเพลตฟิลเตอร์" hide-footer size="lg">
    <div v-if="!templates || templates.length === 0" class="text-muted">ยังไม่มีเทมเพลต</div>

    <b-table
      v-else
      :items="templates"
      :fields="fields"
      small
      responsive
    >
      <template #cell(updatedAt)="{ item }">
        {{ formatDate(item.updatedAt) }}
      </template>

      <template #cell(actions)="{ item }">
        <b-button size="sm" variant="success" class="mr-1" @click="$emit('apply', item.id)">ใช้</b-button>
        <b-button size="sm" variant="outline-primary" class="mr-1" @click="$emit('rename', item.id)">เปลี่ยนชื่อ</b-button>
        <b-button size="sm" variant="outline-info" class="mr-1" @click="$emit('duplicate', item.id)">ทำสำเนา</b-button>
        <b-button size="sm" variant="outline-danger" @click="$emit('delete', item.id)">ลบ</b-button>
      </template>
    </b-table>

    <div class="text-right mt-3">
      <b-button variant="outline-danger" @click="$emit('clear-all')" v-if="templates && templates.length">ลบทั้งหมด</b-button>
      <b-button variant="secondary" class="ml-2" @click="close()">ปิด</b-button>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'FilterTemplates',
  props: {
    templates: {
      type: Array,
      default: () => []
    },
    // Parent can call this.$bvModal.show(modalId)
    modalId: {
      type: String,
      default: 'manage-templates-modal'
    }
  },
  data () {
    return {
      fields: [
        { key: 'name', label: 'ชื่อ' },
        { key: 'updatedAt', label: 'อัปเดตล่าสุด' },
        { key: 'actions', label: 'การทำงาน' }
      ]
    }
  },
  methods: {
    formatDate (ts) {
      try {
        return new Date(ts).toLocaleString();
      } catch (e) {
        return ts;
      }
    },
    close () {
      this.$bvModal.hide(this.modalId);
    }
  }
}
</script>

<style scoped>
/* keep it minimal; inherits bootstrap-vue styling */
</style>
