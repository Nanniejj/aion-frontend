<template>
  <div class="my-5">
    <b-card class="mb-3 shadow-sm">
      <b-row>
        <!-- เลือกบุคคล -->
        <b-col cols="12" md="6">
          <v-select
            :options="options"
            label="text"
            :reduce="p => p.text"
            multiple
            class="sl-pp"
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
        <b-col cols="12" md="6">
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
        <b-col cols="12" md="4" class="text-left ">
          <b-form-group class="pr-md-3 checkbox-v mt-2">
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
          <section id="date-picker" class="mt-2">
            <date-picker
              v-model="local.valueDate"
              type="date"
              range
              placeholder="เลือกช่วงเวลา"
              class="w-100"
              size="sm"
              :disabled-date="date => date > new Date()"  
              value-type="format"
              format="YYYY-MM-DD"
              @change="onDateChange"
              id="date-domain"
            />
          </section>
        </b-col>

        <!-- sort -->
        <!-- <b-col cols="12" md="4">
          <b-form-select
            v-model="local.sort_by"
            class="mb-2"
            :options="[
              { value: 'asc', text: 'โพสต์เก่าสุด' },
              { value: 'desc', text: 'โพสต์ล่าสุด' },
              { value: 'engagement', text: 'Engagement' },
            ]"
            @change="emitFilters"
          />
        </b-col> -->

        <!-- ค้นหา -->
        <b-col cols="12" md="4">
          <div class="align-self-end mt-2">
            <b-button type="submit" variant="info" class="px-4" :disabled="loading" @click="emitFilters" size="sm">
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
import moment from 'moment'

export default {
  name: 'RankingFilter',
  components: { vSelect },
  props: {
    // อย่าใส่ null ใน type เด็ดขาด (กัน instanceof error)
    value: { type: Object, required: false, default: () => ({}) }
  },
  data() {
    return {
      loading: false,
      error: null,
      options: [],
      page: 1,

      // state UI แยกจาก value
      local: {
        names: this.value?.names || [],
        source: this.value?.source?.length ? this.value.source : [null],  // All
        _sourcePrev: this.value?.source?.length ? this.value.source : [null],
        sentiment: (this.value?.sentiment || [-1,0,1]).map(Number),

        // ปล่อยว่าง => emitFilters จะ default เป็น 7 วันล่าสุด
        valueDate: Array.isArray(this.value?.valueDate) && this.value.valueDate.length === 2
          ? this.value.valueDate
          : [],

        sort_by: this.value?.sort_by || 'desc'
      },

      sentimentOptions: [
        { text: 'Positive', value: 1 },
        { text: 'Neutral', value: 0 },
        { text: 'Negative', value: -1 }
      ],
      sourceOptions: [
        { value: null,        text: 'All Platform' },
        { value: 'facebook',  text: 'Facebook' },
        { value: 'twitter',   text: 'X' },
        { value: 'pantip',    text: 'Board' },
        { value: 'news',      text: 'News' },
        { value: 'youtube',   text: 'YouTube' },
        { value: 'instagram', text: 'Instagram' },
        { value: 'blockdit',  text: 'Blockdit' },
        { value: 'tiktok',    text: 'Tiktok' },
        { value: 'threads',   text: 'Threads' }
      ]
    }
  },
  watch: {
    // sync จาก parent -> local (เช่น reset)
    value: {
      deep: true,
      handler(v) {
        const safe = v || {}
        this.local.names = safe.names || []
        this.local.source = safe.source?.length ? safe.source : [null]
        this.local._sourcePrev = [...this.local.source]
        this.local.sentiment = (safe.sentiment || [-1,0,1]).map(Number)

        if (safe.from && safe.to) {
          this.local.valueDate = [
            moment(safe.from).format('YYYY-MM-DD'),
            moment(safe.to).format('YYYY-MM-DD'),
          ]
        } else {
          this.local.valueDate = []
        }
        this.local.sort_by = safe.sort_by || 'desc'
      }
    }
  },
  methods: {
    onDateChange() {
      this.emitFilters()
    },

    onSourceChange(newVal) {
      const normalized = this.normalizeSource(newVal, this.local._sourcePrev)
      this.local.source = normalized
      this.local._sourcePrev = [...normalized]
      this.emitFilters()
    },

    // All = null
    normalizeSource(val, old) {
      const toArr = x => Array.isArray(x) ? x : (x == null ? [] : [x])
      const arrRaw = toArr(val)
      const oldArr = toArr(old)
      const allowed = this.sourceOptions.map(o => o.value)

      // ลบซ้ำ + กันค่าที่ไม่อยู่ใน allowed
      let arr = [...new Set(arrRaw)].filter(v => allowed.includes(v))

      // ไม่เลือกอะไรเลย -> [null]
      if (arr.length === 0) return [null]

      // มีทั้ง null และอย่างอื่น
      if (arr.includes(null) && arr.length > 1) {
        const prevHadAll = oldArr.includes(null)
        const clickedAll = !prevHadAll && arr.includes(null)
        arr = clickedAll ? [null] : arr.filter(v => v !== null)
      }
      return arr
    },

    // ช่วงวันแบบโลคอล (ไม่ใช้ Z)
    getDateRangeLocal() {
      const arr = this.local?.valueDate || []
      const hasStart = Array.isArray(arr) && !!arr[0]
      const hasEnd   = Array.isArray(arr) && !!arr[1]

      if (!hasStart || !hasEnd) {
        const endYMD   = moment().format('YYYY-MM-DD')
        const startYMD = moment(endYMD).subtract(2, 'days').format('YYYY-MM-DD')
        return { from: `${startYMD}T00:00:00`, to: `${endYMD}T23:59:59` }
      }
      const [d1, d2] = arr
      return { from: `${d1}T00:00:00`, to: `${d2}T23:59:59` }
    },

    emitFilters() {
      const { from, to } = this.getDateRangeLocal()

      // ส่งหลายค่า (ตัด All ออก) + เผื่ออยากได้ CSV
      const sourceArr = Array.isArray(this.local.source)
        ? this.local.source.filter(v => v != null)
        : []
      const sourceCSV = sourceArr.length ? sourceArr.join(',') : null

      const payload = {
        ...this.value,
        from,
        to,
        source: sourceArr,       // อาร์เรย์หลายค่า เช่น ['facebook','youtube']
        sourceCSV,               // "facebook,youtube" (ถ้าจำเป็นต้องใช้)
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
        const res = await axios.get(
          'https://api2.cognizata.com/api/v2/facerecognition/getFacePerson',
          { params: { limit: 'all', page: this.page } }
        )
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
    // emit ค่าตั้งต้นรอบแรก: ถ้า valueDate ว่าง จะได้ 7 วันล่าสุด
    this.emitFilters()
  }
}
</script>
<style>
.sl-pp .vs__selected-options {
  overflow: auto;
  max-height:64px ;
}
</style>
<style scoped>

.shadow-sm { border-radius: 20px; }
button:disabled { opacity: .6; cursor: not-allowed; }
@media only screen and (min-width: 0) and (max-width:1100px) {
  .checkbox-v { zoom: 85% }
}
</style>
