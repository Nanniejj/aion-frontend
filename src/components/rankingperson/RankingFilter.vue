<template>
  <div class="my-5">
    <b-card class="mb-3 shadow-sm">
      <b-row>
        <!-- เลือกบุคคล -->
        <b-col cols="12" md="6">
          <v-select
            :options="options"
            label="text"
            :reduce="p => p.value"
            multiple
            v-model="local.names"
            :placeholder="loading ? 'กำลังดึงข้อมูล...' : 'เลือกบุคคล'"
            :disabled="loading || options.length === 0"
            @input="emitFilters"
          >
            <template v-slot:option="option">
              <div class="my-1">
                <b-avatar :src="option.photo" size="65px"></b-avatar>
                {{ option.text }}
              </div>
            </template>
          </v-select>
        </b-col>

        <!-- platform -->
        <b-col cols="12" md="3">
          <v-select
            :options="sourceOptions"
            v-model="local.source"
            id="search-source"
            label="text"
            :reduce="src => src.value"
            placeholder="Select Platform"
            multiple
            @input="onSourceChange"
          />
        </b-col>

        <!-- sentiment -->
        <b-col cols="12" md="3">
          <b-form-group class="pr-md-3 checkbox-v">
            <b-form-checkbox-group
              v-model="local.sentiment"
              :options="sentimentOptions"
              size="sm"
              @change="emitFilters"
            />
          </b-form-group>
        </b-col>

        <!-- date range -->
        <b-col cols="12" md="4">
          <section id="date-picker">
            <date-picker
              v-model="local.valueDate"
              type="date"
              range
              placeholder="เลือกช่วงเวลา"
              class="w-100"
              size="sm"
              :disabled-date="(date) => date >= new Date()"
              value-type="format"
              format="YYYY-MM-DD"
              @change="onDateChange"
              id="date-domain"
            />
          </section>
        </b-col>

        <!-- sort -->
        <b-col cols="12" md="4">
          <b-form-select
            v-model="local.sort_by"
            class="mb-2"
            :options="[
              { value: 'descend', text: 'โพสต์เก่าสุด' },
              { value: 'recent', text: 'โพสต์ล่าสุด' },
              { value: 'engagement', text: 'Engagement' },
            ]"
            @change="emitFilters"
          />
        </b-col>

        <!-- ค้นหา -->
        <b-col cols="12" md="4">
          <div class="align-self-end mb-3">
            <b-button type="submit" variant="info" class="px-4" :disabled="loading" @click="emitFilters">
              ค้นหา
            </b-button>
          </div>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import moment from "moment";

export default {
  components: { vSelect },
  props: {
    value: { type: Object, required: true } // ใช้กับ v-model
  },
  data() {
    return {
      loading: false,
      error: null,
      options: [],
      page: 1,

      // เก็บค่า UI ไว้แยกจาก value (เพื่อควบคุมและ emit กลับ)
      local: {
        names: this.value?.names || [],
        source: this.value?.source || [null],
        sentiment: (this.value?.sentiment || [-1,0,1]).map(Number),
        // ใช้ date-picker แบบ string 'YYYY-MM-DD'
        valueDate: [
          moment(this.value?.from || new Date()).format("YYYY-MM-DD"),
          moment(this.value?.to || new Date()).format("YYYY-MM-DD")
        ],
        sort_by: this.value?.sort_by || 'recent'
      },

      sentimentOptions: [
        { text: "Positive", value: 1 },
        { text: "Neutral", value: 0 },
        { text: "Negative", value: -1 }
      ],
      sourceOptions: [
        { value: null, text: "All Platform" },
        { value: "facebook", text: "Facebook" },
        { value: "twitter", text: "X" },
        { value: "pantip", text: "Board" },
        { value: "news", text: "News" },
        { value: "youtube", text: "YouTube" },
        { value: "instagram", text: "Instagram" },
        { value: "blockdit", text: "Blockdit" },
        { value: "tiktok", text: "Tiktok" },
        { value: "threads", text: "Threads" }
      ]
    }
  },
  watch: {
    // ถ้าหน้าแม่อัปเดต value (เช่น reset) ให้ sync มา local ด้วย
    value: {
      deep: true,
      handler(v){
        this.local.names = v?.names || []
        this.local.source = v?.source || [null]
        this.local.sentiment = (v?.sentiment || [-1,0,1]).map(Number)
        this.local.valueDate = [
          moment(v?.from || new Date()).format("YYYY-MM-DD"),
          moment(v?.to || new Date()).format("YYYY-MM-DD")
        ]
        this.local.sort_by = v?.sort_by || 'recent'
      }
    }
  },
  methods: {
    toISOZ(strYMD, isEnd=false) {
      // แปลง 'YYYY-MM-DD' -> ISO UTC Z
      const t = isEnd ? '23:59:59.999' : '00:00:00.000'
      const d = new Date(`${strYMD}T${t}Z`)
      return d.toISOString()
    },
    onDateChange() {
      this.emitFilters()
    },
    onSourceChange(val, old) {
      // คง logic เดิม: ถ้าเลือก All ร่วมกับอย่างอื่น ให้ normalize
      const toArr = x => Array.isArray(x) ? x : (x == null ? [] : [x])
      const arr = toArr(this.local.source)
      const oldArr = toArr(old)

      if (arr.length === 0) {
        this.local.source = [null]
        this.emitFilters()
        return
      }
      if (arr.includes(null) && arr.length > 1) {
        const clickedAllJustNow = !oldArr?.includes(null)
        this.local.source = clickedAllJustNow ? [null] : arr.filter(v => v !== null)
      }
      this.emitFilters()
    },
    emitFilters() {
      // เตรียม payload ที่หน้าแม่ต้องการ
      const [d1, d2] = this.local.valueDate || []
      const from = d1 ? this.toISOZ(d1, false) : null
      const to   = d2 ? this.toISOZ(d2, true) : null

      // เผื่อคอมโพเนนต์ลูกบางตัวต้องการ source เดี่ยว
      const sourceOne = (this.local.source || [])[0] ?? null

      const payload = {
        ...this.value,
        from,
        to,
        source: this.local.source,         // array
        sourceOne,                         // single
        sentiment: (this.local.sentiment || []).map(Number),
        names: this.local.names || [],
        sort_by: this.local.sort_by,
        limit: this.value?.limit ?? 20
      }
      this.$emit('input', payload)
    },

    async fetchOptions() {
      this.loading = true
      this.error = null
      try {
        const baseURL = 'https://api2.cognizata.com/api/v2/facerecognition/getFacePerson'
        const params = { limit: 'all', page: this.page }
        const res = await axios.get(baseURL, { params })
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || [])
        this.options = list.map(p => ({
          value: p._id || p.id,
          text: p.name || p.fullname || `${p.firstName || ''} ${p.lastName || ''}`.trim(),
          photo: p.image_paths?.[0] || p.image_paths?.[1] || null
        }))
      } catch (err) {
        this.error = err?.response?.data?.message || err.message || 'ดึงข้อมูลไม่สำเร็จ'
        this.options = []
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    this.fetchOptions()
    // emit ค่าตั้งต้นรอบแรก
    this.emitFilters()
  }
}
</script>

<style scoped>
.shadow-sm { border-radius: 20px; }
button:disabled { opacity: .6; cursor: not-allowed; }
@media only screen and (min-width: 0) and (max-width:1100px) {
  .checkbox-v { zoom: 85% }
}
</style>
