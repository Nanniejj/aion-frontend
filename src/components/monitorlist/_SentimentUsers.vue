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
            :top-sentiment="Array.isArray(sentiment) ? sentiment.join(',') : sentiment" 
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
  name: 'SentimentUsers',
  props: {
    topPosts: { type: Array, default: () => [] },
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
        loading: false,
        isMounted: false,
    }
  },
    computed: {
    sentiment() {
        return this.filters.sentiment || '1,0,-1'
    },
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
    },
        async fetchTopUsers() {
        if (!this.filters.from || !this.filters.to || !this.filters.sentiment) {
            console.warn('fetchTopUsers aborted: missing from/to/sentiment');
            return;
        }
        this.loading = true
        this.topError = null

        const API_URL = 'https://api2.cognizata.com/api/v2/monitor/getGroupSentiment'

        // sentiment ต้องเป็น array เพื่อให้ axios ส่งเป็น sentiment[]=1&sentiment[]=0&sentiment[]=-1
        // const sentimentArr = this.sentiment
        //     ? this.sentiment.split(',').map(s => s.trim())
        //     : ['1','0','-1']

        const params = {
            group_id: this.$route.query.id,            // รองรับ group_id
            sort_by: this.filters.sort_by || 'desc',          // รองรับ sort_by ใหม่
            sentiment: this.filters.sentiment,                          // <-- ส่งเป็น array (สำคัญ)
            from: this.filters.from,                         // param ใหม่
            to: this.filters.to,                             // param ใหม่
            page: this.topPage || 1,
            limit: this.filters.limit || 10,                  // รองรับ limit เช่น 3
            ...(this.filters.account ? { account: this.filters.account } : {}),
            ...(this.filters.keyword ? { keyword: this.filters.keyword } : {}),
            ...(this.filters.source ? { source: this.filters.source } : {})
        }

        try {
            const { data } = await axios.get(API_URL, {
            params,
            paramsSerializer: params => {
                // 👉 บังคับให้ axios serialize array เป็น ?sentiment[]=1&sentiment[]=0
                return new URLSearchParams(params).toString()
            },
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
            }
            })
            // console.log("data ==== ", data);
            
            const raw =
            (Array.isArray(data?.top_accounts) && data.top_accounts) ||
            (Array.isArray(data?.accounts) && data.accounts) ||
            (Array.isArray(data?.data) && data.data) ||
            []
            // console.log("raw === ",raw);
            
            this.topUsers = raw
            this.loading = false
            // console.log("top users === ", this.topUsers)

        } catch (err) {
            console.error(err)
            this.topError = 'โหลดโพสต์แบบเต็มไม่สำเร็จ'
        } finally {
            this.loading = false
        }
    }

    },
    watch: {
        filters: {
            handler(newVal, oldVal) {
            if (!this.isMounted) return; // ป้องกันตอน mount
            if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
                this.fetchTopUsers();
            }
            },
            deep: true
        }
    },
    async mounted() {
        await this.fetchTopUsers(); // เรียกครั้งแรก
        this.isMounted = true;      // ตั้ง flag หลังเรียกครั้งแรก
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