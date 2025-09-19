<template>
  <b-modal :id="modalId" title="บันทึกเทมเพลตฟิลเตอร์" hide-footer>
    <b-form @submit.prevent="emitSave">
      <b-form-group label="ชื่อเทมเพลต">
        <b-form-input
          v-model.trim="name"
          required
          placeholder="เช่น วิเคราะห์คาเฟ่-เชียงใหม่"
        />
      </b-form-group>

      <b-form-checkbox v-model="includeTimeRange">
        บันทึกช่วงเวลานี้ด้วย
      </b-form-checkbox>

      <div class="text-right mt-3">
        <b-button variant="secondary" class="mr-2" @click="close">ยกเลิก</b-button>
        <b-button type="submit" variant="info">บันทึก</b-button>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
export default {
  name: 'SaveTemplateModal',
  props: {
    modalId: {
      type: String,
      default: 'save-template-modal'
    },
    defaultName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      name: this.defaultName,
      includeTimeRange: true
    }
  },
  methods: {
    emitSave () {
      if (!this.name) return;
      this.$emit('save', { name: this.name, includeTimeRange: this.includeTimeRange });
      this.close();
    },
    close () {
      this.$bvModal.hide(this.modalId);
    }
  }
}
</script>

<style scoped>
/* minimal styling; bootstrap-vue provides the UI */
</style>
