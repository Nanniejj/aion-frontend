<template>
  <b-card no-body class="p-4">
    <h5 class="mb-4"><b-icon icon="gear" class="mr-2" />ตั้งค่าการแจ้งเตือน — {{ bagName }}</h5>

    <b-row>
      <b-col md="6">
        <b-form-group label="วัดจาก">
          <b-form-select v-model="settings.metric" :options="metricOptions" />
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="ช่วงเวลาตรวจสอบ">
          <b-form-select v-model="settings.window_minutes" :options="windowOptions" />
        </b-form-group>
      </b-col>
    </b-row>

    <b-form-group>
      <div class="d-flex justify-content-between small mb-1">
        <span class="text-muted">เกณฑ์แจ้งเตือน (เพิ่มขึ้นกี่ % จาก baseline)</span>
        <span class="font-weight-medium">{{ settings.threshold_percent }}%</span>
      </div>
      <b-form-input v-model.number="settings.threshold_percent" type="range" min="50" max="500" step="10" />
    </b-form-group>

    <b-row>
      <b-col md="6">
        <b-form-group label="ระดับ medium ตั้งแต่ (%)">
          <b-form-input v-model.number="settings.severity_thresholds.medium" type="number" />
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="ระดับ high ตั้งแต่ (%)">
          <b-form-input v-model.number="settings.severity_thresholds.high" type="number" />
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="6">
        <b-form-group label="mention ขั้นต่ำก่อนพิจารณา" description="กันสัญญาณหลอกตอน volume น้อย">
          <b-form-input v-model.number="settings.min_volume" type="number" />
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="cooldown (นาที)" description="กันแจ้งเตือนซ้ำถี่เกินไป">
          <b-form-input v-model.number="settings.cooldown_minutes" type="number" />
        </b-form-group>
      </b-col>
    </b-row>

    <b-form-group label="ช่องทางแจ้งเตือน">
      <b-form-checkbox-group v-model="settings.notify_channels" color="info" :options="channelOptions" buttons button-variant="outline-primary" />
    </b-form-group>

    <div class="d-flex justify-content-end mt-3">
      <b-button variant="outline-secondary" class="mr-2" @click="testBacktest">ทดสอบย้อนหลัง</b-button>
      <b-button variant="primary" :disabled="saving" @click="save">
        <b-spinner v-if="saving" small class="mr-1" />
        บันทึกการตั้งค่า
      </b-button>
    </div>
  </b-card>
</template>

<script>
import { mockApi } from './mock/store'

export default {
  name: 'SpikeAlertSettingsForm',
  props: {
    bagId: { type: String, required: true },
    bagName: { type: String, required: true },
    value: { type: Object, required: true },
  },
  data() {
    return {
      saving: false,
      settings: JSON.parse(JSON.stringify(this.value)),
      metricOptions: [
        { value: 'frequency', text: 'ความถี่โพสต์ (mention count)' },
        { value: 'engagement', text: 'engagement' },
        { value: 'both', text: 'ทั้งสองอย่าง' },
      ],
      windowOptions: [
        { value: 15, text: 'ทุก 15 นาที' },
        { value: 30, text: 'ทุก 30 นาที' },
        { value: 60, text: 'ทุก 1 ชั่วโมง' },
      ],
      channelOptions: [
        // { value: 'in_app', text: 'ในแอป' },
        // { value: 'email', text: 'อีเมล' },
        { value: 'line_oa', text: 'Line' },
      ],
    }
  },
  methods: {
    async save() {
      this.saving = true
      try {
        const updated = await mockApi.updateAlertSettings(this.bagId, this.settings)
        this.$emit('saved', updated)
      } finally {
        this.saving = false
      }
    },
    testBacktest() {
      // TODO: เรียก endpoint จำลองผลลัพธ์ด้วยข้อมูลย้อนหลัง แล้วโชว์กราฟว่าจะ trigger กี่ครั้ง
    },
  },
}
</script>
