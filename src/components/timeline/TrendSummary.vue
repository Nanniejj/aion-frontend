<template>
  <b-card>
    <template #header>
      <span>📝 สรุปแนวโน้มกราฟสถิติรายชั่วโมง </span>
    </template>

    <div v-if="summary && summary.text" class="text-left">
      <div>
        <span v-if="filters && filters.keyword">
          ประเด็น <b>{{ displayKeyword }}</b>
        </span>
        {{ dates }}
      </div>

      <p>
        โพสต์รวม {{ fmtNum((totalsCount && totalsCount.post) || 0) }}
        ข้อความรวม {{ fmtNum((totalsCount && totalsCount.msg) || 0) }}
        และการมีส่วนร่วมรวม {{ fmtNum((totalsCount && totalsCount.eng) || 0) }}
      </p>

      <ul class="mb-0 pl-4">
        <li v-for="(b, i) in (summary.bullets || [])" :key="'b' + i">{{ b }}</li>
      </ul>

      <p class="my-2" style="white-space: pre-line;">{{ summary.text }}</p>
    </div>

    <div v-else class="text-muted">ไม่มีข้อมูลสำหรับสรุป</div>
  </b-card>
</template>

<script>
export default {
  name: 'TrendSummary',
  props: {
    summary: { type: Object, default: () => ({ text: '', bullets: [], stats: null }) },
    filters: { type: Object, default: () => ({}) },
    dates: { type: String, default: null },
    totalsCount: { type: Object, default: () => null }
  },
  computed: {
    displayKeyword() {
      const k = (this.filters && this.filters.keyword) ? String(this.filters.keyword) : ''
      return k.replace('+', ' ').replace('+', ' หรือ ')
    }
  },
  methods: {
    fmtNum(n) {
      const v = Number(n || 0)
      return Number.isFinite(v) ? v.toLocaleString('th-TH') : '0'
    }
  }
}
</script>
