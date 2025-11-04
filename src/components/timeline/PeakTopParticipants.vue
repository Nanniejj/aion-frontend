<template>
  <b-card>
    <template #header>
      <div class="d-flex align-items-center justify-content-between">
        <span>🔥 สรุปผู้มีส่วนร่วมใน <b>ช่วงพีคสูงสุด</b> (Top {{ topLimit }})</span>
        <small v-if="peakOnlyWindow" class="text-muted">
          ช่วงที่ใช้: {{ peakOnlyWindow.startLocalStr }} – {{ peakOnlyWindow.endLocalStr }}
        </small>
      </div>
    </template>

    <div v-if="topLoading" class="text-center py-3">
      <b-spinner small></b-spinner> กำลังโหลดโพสต์...
    </div>

    <div v-else-if="topError" class="text-danger">
      {{ topError }}
    </div>

    <div v-else-if="!safePosts.length" class="text-muted">
      ไม่พบโพสต์ในช่วงพีค
    </div>

    <div v-else>
      <b-table
        :items="peakSummaryItems"
        :fields="peakSummaryFields"
        small
        responsive="sm"
        head-variant="light"
        class="mb-2"
      >
        <template #cell(full_text)="row">
          <div style="white-space: pre-wrap;">{{ row.item.full_text }}</div>
        </template>
      </b-table>

      <div class="d-flex justify-content-end align-items-center mt-2">
        <b-button size="sm" class="mr-2" :disabled="topPage <= 1 || topLoading" @click="$emit('change-page', topPage - 1)">
          ◀ ก่อนหน้า
        </b-button>
        <span>หน้า {{ topPage }}</span>
        <b-button size="sm" class="ml-2" :disabled="topLoading || !canNextTop" @click="$emit('change-page', topPage + 1)">
          ถัดไป ▶
        </b-button>
      </div>
    </div>
  </b-card>
</template>

<script>
export default {
  name: 'PeakTopParticipants',
  props: {
    topPosts: { type: Array, default: () => [] },
    topLoading: { type: Boolean, default: false },
    topError: { type: String, default: null },
    topLimit: { type: Number, default: 10 },
    topPage: { type: Number, default: 1 },
    canNextTop: { type: Boolean, default: false },
    peakOnlyWindow: { type: Object, default: null }
  },
  data() {
    return {
      peakSummaryFields: [
        { key: 'account_name', label: 'account_name' },
        { key: 'date', label: 'date' },
        { key: 'engage', label: 'engage', class: 'text-right' },
        { key: 'full_text', label: 'full_text' }
      ]
    }
  },
  computed: {
    safePosts() {
      return Array.isArray(this.topPosts) ? this.topPosts : []
    },
    peakSummaryItems() {
      return this.safePosts.map(p => ({
        account_name: p.author || p.account_name || '-',
        date: this.fmtLocal(p.created_at),
        engage: this.fmtNum(p.engagement),
        full_text: p.text || '-'
      }))
    }
  },
  methods: {
    fmtNum(n) {
      const v = Number(n || 0)
      return Number.isFinite(v) ? v.toLocaleString('th-TH') : '0'
    },
    fmtLocal(ms) {
      if (!ms) return '-'
      const d = new Date(ms)
      if (isNaN(d)) return '-'
      return new Intl.DateTimeFormat('th-TH', {
        timeZone: 'Asia/Bangkok',
        hourCycle: 'h23',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(d)
    }
  }
}
</script>
