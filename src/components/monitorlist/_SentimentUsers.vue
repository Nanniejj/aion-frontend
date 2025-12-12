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

    components: { TopAccounts },

    data() {
        return {
        peakSummaryFields: [
            { key: 'account_name', label: 'account_name' },
            { key: 'date', label: 'date' },
            { key: 'engage', label: 'engage', class: 'text-right' },
            { key: 'full_text', label: 'full_text' }
        ],

        topUsers: [],
        accountsInput: [],
        account: '',
        loading: false,

        isInit: true,   // ⭐ ป้องกัน watch ตอน mounted
        }
    },

    computed: {
        sentiment() {
        return this.filters.sentiment || '1,0,-1'
        },
    },

    methods: {
        onChangeTopSentiment(val) {
        if (val !== this.filters.sentiment) {
            this.filters.sentiment = val;
            this.fetchTopUsers();
        }
        },

        onFilterAccount({ uid }) {
        if (!uid) {
            this.accountsInput = [];
            this.account = '';
        } else {
            if (!this.accountsInput.includes(uid)) {
            this.accountsInput.push(uid);
            }
        }
        console.log("this.accountsInput === ", this.accountsInput);
        
        // if (this.accountsInput.length !== 0) {
            this.$emit('filterAccount', this.accountsInput);
        // }
        },

        async fetchTopUsers() {

        if (!this.filters.from || !this.filters.to || !this.filters.sentiment) {
            console.warn("fetchTopUsers aborted: missing filters");
            return;
        }

        this.loading = true;
        this.topError = null;

        const API_URL =
            "https://api2.cognizata.com/api/v2/monitor/getGroupSentiment";

        const params = {
            group_id: this.$route.query.id,
            sort_by: this.filters.sort_by || "desc",
            sentiment: this.filters.sentiment,
            from: this.filters.from,
            to: this.filters.to,
            page: this.topPage || 1,
            account: this.filters.accountsInput || "",
            limit: 10,
            ...(this.filters.account ? { account: this.filters.account } : {}),
            ...(this.filters.keyword ? { keyword: this.filters.keyword } : {}),
            ...(this.filters.source ? { source: this.filters.source } : {}),
        };
        console.log("param === ", params);
        
        try {
            const { data } = await axios.get(API_URL, {
            params,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            });

            const raw = data?.data || [];
            this.topUsers = raw;

        } catch (err) {
            console.error(err);
            this.topError = "โหลดข้อมูลไม่สำเร็จ";
        } finally {
            this.loading = false;
        }
        },
    },

    watch: {
        filters: {
            async handler(newVal, oldVal) {
            console.log(
                "filters changed: ",
                newVal,
                oldVal,
                JSON.stringify(newVal) === JSON.stringify(oldVal)
            );

            // ⛔ กันตอน mount
            if (this.isInit) return;

            // ⛔ กันกรณี oldVal เป็น object ว่าง
            if (oldVal && Object.keys(oldVal).length === 0) return;

            // ⛔ กันกรณี newVal เป็น object ว่าง
            if (newVal && Object.keys(newVal).length === 0) return;

            // ⛔ กันกรณีค่าเดิมเหมือนกัน
            if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return;

            // ✅ ผ่านทุกเงื่อนไขแล้ว ค่อย fetch
            // this.accountsInput = this.filters.accountsInput || [];
            await this.fetchTopUsers();
            },
            deep: true,
            immediate: false
        }
    },

    async mounted() {
        // ⭐ โหลดครั้งแรกก่อน
        await this.fetchTopUsers();

        // ⭐ เปิดให้ watch ทำงานหลังจากโหลดครั้งแรก
        this.isInit = false;
    },
};
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