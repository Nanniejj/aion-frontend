<template>
  <b-card class="border-0">
    <!-- <template #header>
      <div class="d-flex align-items-center justify-content-between">
        <span>🔥 สรุปบัญชีที่กล่าวถึงมาก 
            <b>ช่วงพีคสูงสุด</b> 
            (Top {{ topLimit }})</span>
        <small v-if="peakOnlyWindow" class="text-muted">
          ช่วงที่ใช้: {{ toThaiDateTimeShort(peakOnlyWindow.startLocalStr) }} – {{ toThaiDateTimeShort(peakOnlyWindow.endLocalStr) }}
        </small>
      </div>
    </template> -->

    <!-- <div v-if="loading" class="text-center py-3">
      <b-spinner small></b-spinner> กำลังโหลดโพสต์...
    </div> -->

    <!-- <div v-else-if="topError" class="text-danger">
      {{ topError }}
    </div>
 
    <div v-else-if="!safePosts.length" class="text-muted">
      ไม่พบโพสต์ในช่วงพีค
    </div> -->

    <div>
        <!-- {{ topUsers }} -->
        <!-- :showSentimentFilter="false" -->
        <top-accounts 
            :keyword="filters.keyword"
            :accounts="topUsers" 
            :limit="10" 
            :loading="loading" 
            :top-sentiment="sentiment" 
            @filter-account="onFilterAccount"
            @change-top-sentiment="onChangeTopSentiment" 
        />
    </div>
  </b-card>
</template>

<script>
import axios from 'axios'
import TopAccounts from "@/components/rankingperson/TopAccount.vue";
export default {
  name: 'TopUser',
  props: {
    topPosts: { type: Array, default: () => [] },
    // topLoading: { type: Boolean, default: false },
    // topError: { type: String, default: null },
    // topLimit: { type: Number, default: 10 },
    // topPage: { type: Number, default: 1 },
    // canNextTop: { type: Boolean, default: false },
    // peakOnlyWindow: { type: Object, default: null },
    filters: { type: Object, default: () => ({}) },
    },
  components:{TopAccounts},
  data() {
    return {
      peakSummaryFields: [
        { key: 'account_name', label: 'account_name' },
        { key: 'date', label: 'date' },
        { key: 'engage', label: 'engage', class: 'text-right' },
        { key: 'full_text', label: 'full_text' }
        ],
        topUsers: [],
        accountsInput : [],
        account : '',
        loading: false
    }
  },
    computed: {
    sentiment() {
        return this.filters.sentiment || '1,0,-1'
    },
    // safePosts() {
    //   return Array.isArray(this.topPosts) ? this.topPosts : []
    // },
    // peakSummaryItems() {
    //   return this.safePosts.map(p => ({
    //     account_name: p.author || p.account_name || '-',
    //     date: this.fmtLocal(p.created_at),
    //     engage: this.fmtNum(p.engagement),
    //     full_text: p.text || '-',
    //     sentiment: p.sentiment,
    //     source: p.source,
    //     photos: p.photos,
    //     profile_image:p.profile_image
    //   }))
    // }
  },
    methods: {
    toThaiDateTimeShort(datetimeStr) {
        if (!datetimeStr) return '-'

        const date = new Date(datetimeStr)

        // ตั้งค่าให้แสดงวัน/เดือนย่อ/ปี/เวลา แบบไทย
        const options = {
            year: 'numeric',
            month: 'short',   // ✅ ใช้ตัวย่อ เช่น พ.ย.
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Bangkok'
        }

        const formatter = new Intl.DateTimeFormat('th-TH', options)
        const formatted = formatter.format(date) 
        // ตัวอย่าง: "06 พ.ย. 2568 07:00"

        const [day, month, year, time] = formatted.split(' ')
        return `${day} ${month} ${year} เวลา ${time} น.`
        },
    scrollLeft() {
      const slider = this.$refs.slider;
      if (slider) slider.scrollLeft -= 300;
    },
    scrollRight() {
      const slider = this.$refs.slider;
      if (slider) slider.scrollLeft += 300;
    },
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
        },
    onChangeTopSentiment(val) {
        this.filters.sentiment = val;
        this.fetchTopUsers();
        },
    onFilterAccount({ uid }) {
      if (!uid) {
        this.accountsInput = [];
        this.account = '';
      } else {
        if (!Array.isArray(this.accountsInput)) this.accountsInput = [];
          if (!this.accountsInput.includes(uid)) this.accountsInput.push(uid);
      } 
        this.$emit('filterAccount', this.accountsInput)
        // this.fetchTopUsers();
    },
fetchTopUsers() {
  this.loading = true
  this.topError = null

  const API_URL = 'https://api2.cognizata.com/api/v2/userposts/getPostSentiment'
  const params = {
    sentiment: this.sentiment || '1,0,-1',
    account: this.filters.account,
    keyword: this.filters.keyword || '',
    ...(this.filters.exclude ? { exclude: this.filters.exclude } : {}),
    ...(this.filters.source_news ? { source_news: this.filters.source_news } : {}),
    ...(this.filters.sort_by ? { sort_by: this.filters.sort_by } : {}),
    top_accounts_limit: 10,
    page: this.topPage,
    start: this.filters.start,
    end: this.filters.end,
    ...(this.filters.source ? { source: this.filters.source } : {})
  }

  axios.get(API_URL, { params })
    .then(({ data }) => {
      const raw =
        (Array.isArray(data?.top_accounts) && data.top_accounts) ||
        (Array.isArray(data?.accounts) && data.accounts) ||
        (Array.isArray(data?.data) && data.data) ||
        [];
      this.topUsers = raw
      console.log("top users === ", this.topUsers)
    })
    .catch(err => {
      console.error(err)
      this.topError = 'โหลดโพสต์แบบเต็มไม่สำเร็จ'
    })
    .finally(() => {
      this.loading = false
    })
},
    },
    watch: {
        filters: {
            handler(newVal, oldVal) {
            
            if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
                // this.topPage = 1
                this.fetchTopUsers();
                }
            },
        deep: true
        }
    },
  mounted() {
       this.fetchTopUsers();
    }
}
</script>


<style scoped>
.slider {
  display: flex;
  flex-wrap: nowrap;
  /* ป้องกันการขึ้นบรรทัดใหม่ */
  overflow-x: auto;
  /* เปิดใช้งานการเลื่อนในแนวนอน */
  scroll-behavior: smooth;
  /* ทำให้เลื่อนนุ่มนวล */
  gap: 10px;
  /* เพิ่มระยะห่างระหว่างการ์ด */
  width: 100%;
}

.slider-item {
  flex: 0 0 auto;
  /* การ์ดแต่ละอันมีขนาดคงที่ */
  width: 300px;
  /* ขนาดการ์ด 4 ชิ้นใน 100% */
  flex-wrap: nowrap;
}

.slider-container {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  border-radius: 15px;
}

.slider-button {
  background-color: #3f3b3b00;
  color: rgb(112, 108, 108);
  border: none;
  padding: 10px 15px;
  margin: 0px 4px;
  cursor: pointer;
  border-radius: 15px;
  font-size: 20px;
}

.slider-button:hover {
  background-color: #fed16e;
  border-radius: 15px;
  color: #ffffff;
}

.slider::-webkit-scrollbar {
  display: none;
  /* ซ่อน scrollbar */
}

</style>