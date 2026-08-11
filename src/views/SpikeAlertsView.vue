<template>
  <div>
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h5 class="mb-0">Spike detection</h5>
        <div class="small text-muted">ตรวจจับความถี่คำที่พุ่งสูงผิดปกติแบบเรียลไทม์</div>
      </div>
      <b-button size="sm" variant="outline-secondary" @click="simulateSpike">
        <b-icon icon="lightning" class="mr-1" />จำลอง spike ใหม่ (demo)
      </b-button>
    </div>

    <b-row class="mb-4">
      <b-col v-for="card in kpiCards" :key="card.label" cols="6" md="3">
        <b-card bg-variant="light" no-body class="p-3">
          <div class="small text-muted mb-1">{{ card.label }}</div>
          <div class="h4 mb-0" :class="card.textClass">{{ card.value }}</div>
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="5" class="mb-4">
        <b-form-select
          v-model="selectedBagId"
          :options="bagOptions"
          class="mb-3"
          @change="loadSettingsForSelectedBag"
        />
        <SpikeAlertSettingsForm
          v-if="selectedBagId && alertSettings"
          :bag-id="selectedBagId"
          :bag-name="selectedBagName"
          :value="alertSettings"
          @saved="onSettingsSaved"
        />
      </b-col>
      <b-col md="7">
        <SpikeEventList :events="events" :bags="bags" @select="openEvent" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import SpikeAlertSettingsForm from '@/components/alert/SpikeAlertSettingsForm.vue'
import SpikeEventList from '@/components/alert/SpikeEventList.vue'
import { mockApi } from '@/components/alert/mock/store'

export default {
  name: 'SpikeAlertsView',
  components: { SpikeAlertSettingsForm, SpikeEventList },
  data() {
    return {
      bags: [],
      events: [],
      selectedBagId: '',
      alertSettings: null,
    }
  },
  computed: {
    bagOptions() {
      return this.bags.map((b) => ({ value: b._id, text: b.name }))
    },
    selectedBagName() {
      const bag = this.bags.find((b) => b._id === this.selectedBagId)
      return bag ? bag.name : ''
    },
    kpiCards() {
      return [
        { label: 'ถุงคำที่ทำงาน', value: this.bags.filter((b) => b.is_active).length, textClass: '' },
        { label: 'spike วันนี้', value: this.countToday('new'), textClass: 'text-danger' },
        {
          label: 'รอตรวจสอบ',
          value: this.events.filter((e) => e.status === 'new').length,
          textClass: 'text-warning',
        },
        { label: 'แจ้งเตือนล่าสุด', value: this.lastEventLabel(), textClass: '' },
      ]
    },
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
    countToday(status) {
      const today = new Date().toDateString()
      return this.events.filter((e) => e.status === status && new Date(e.created_at).toDateString() === today)
        .length
    },
    lastEventLabel() {
      if (this.events.length === 0) return '-'
      const diffMin = Math.round((Date.now() - new Date(this.events[0].created_at).getTime()) / 60000)
      return diffMin <= 0 ? 'เมื่อสักครู่' : `${diffMin} นาทีที่แล้ว`
    },
    async loadData() {
      this.bags = await mockApi.listBags()
      this.events = await mockApi.listEvents()
      if (this.bags.length > 0) {
        this.selectedBagId = this.bags[0]._id
        await this.loadSettingsForSelectedBag()
      }
    },
    async loadSettingsForSelectedBag() {
      this.alertSettings = await mockApi.getAlertSettings(this.selectedBagId)
    },
    onSettingsSaved(updated) {
      this.alertSettings = updated
    },
    openEvent(event) {
      // ยังไม่มีหน้า detail จริง ใช้ demo alert แทนก่อน
      this.$bvToast.toast(`${event.bag_name} พบ ${event.current_volume} โพสต์ (${event.severity})`, {
        title: 'รายละเอียด spike event',
        variant: event.severity === 'high' ? 'danger' : 'warning',
      })
    },
    // จำลอง spike event ใหม่เข้ามาแบบ real-time สำหรับ demo (แทน socket.io ที่ยังไม่มี backend)
    simulateSpike() {
      const event = mockApi.simulateNewEvent()
      this.events = [event, ...this.events]
    },
  },
}
</script>
