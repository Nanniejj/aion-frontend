<template>
  <b-card no-body class="kf-card">
    <div class="kf-header">
      <div class="kf-header-icon">
        <b-icon icon="folder-plus" />
      </div>

      <div>
        <h5 class="mb-0 kf-title">
          {{ isEdit ? 'แก้ไข keywords' : 'สร้าง keywords' }}
        </h5>
       
        <p v-if="isEdit" class="kf-meta mb-0">
          <span>สร้าง: {{ formatDate(value && value.created_at) }}</span>
          <span class="mx-2">•</span>
          <span>อัปเดต: {{ formatDate(value && value.updated_at) }}</span>
        </p>
      </div>
    </div>

    <div class="kf-body">
      <!-- Status -->
      <section class="kf-section">
        <label class="kf-switch-row">
          <div>
            <div class="kf-switch-title">
              <b-icon :icon="form.is_active ? 'play-circle' : 'pause-circle'" class="mr-1" />
              {{ form.is_active ? 'เปิดใช้งาน keywords นี้' : 'ปิดใช้งาน keywords นี้' }}
            </div>
            <div class="kf-switch-desc">
              เมื่อปิดใช้งาน ระบบจะหยุดติดตามคำค้นหานี้ และปิดการแจ้งเตือนโดยอัตโนมัติ
            </div>
          </div>

          <b-form-checkbox
            v-model="form.is_active"
            switch
            size="lg"
            class="kf-switch"
          />
        </label>
      </section>

      <!-- Step 1 -->
      <section class="kf-section">
        <div class="kf-section-head">
          <span class="kf-step">1</span>
          <h6 class="kf-section-title mb-0">ตั้งชื่อ keywords</h6>
        </div>

        <b-form-group label="ชื่อ keywords" label-class="kf-label">
          <b-form-input
            v-model.trim="form.name"
            placeholder="เช่น keywords แบรนด์ A"
            class="kf-input"
          />
        </b-form-group>

        <b-form-group
          label="คำอธิบาย (ไม่บังคับ)"
          label-class="kf-label"
          class="mb-0"
        >
          <b-form-input
            v-model.trim="form.description"
            placeholder="เช่น ใช้ติดตามกระแสของแบรนด์ A"
            class="kf-input"
          />
        </b-form-group>
      </section>

      <!-- Step 2 -->
      <section class="kf-section">
        <div class="kf-section-head">
          <span class="kf-step">2</span>
          <h6 class="kf-section-title mb-0">กำหนดคำค้นหา</h6>
        </div>

        <div class="kf-query-block">
          <b-alert show variant="light" class="kf-query-help mb-3">
            AND ใช้ช่องว่างหรือเครื่องหมาย + และ OR ใช้เครื่องหมาย ,
            <br />
            ตัวอย่าง:
            <strong>คาเฟ่ บรรยากาศดี, มัทฉะ อร่อย</strong>
          </b-alert>

          <b-form-group label="คำค้นหา" label-class="kf-label" class="mb-3">
            <b-input-group>
              <template #prepend>
                <b-input-group-text>
                  <b-icon icon="search" />
                </b-input-group-text>
              </template>

              <b-form-input
                v-model.trim="form.keyword"
                placeholder="คาเฟ่ บรรยากาศดี, มัทฉะ อร่อย"
                class="kf-input"
              />
            </b-input-group>
          </b-form-group>

          <b-form-group
            label="คำที่ไม่ต้องการ"
            label-class="kf-label"
            class="mb-3"
          >
            <b-input-group>
              <template #prepend>
                <b-input-group-text>
                  <b-icon icon="x" />
                </b-input-group-text>
              </template>

              <b-form-input
                v-model.trim="form.exclude"
                placeholder="เช่น สแปม, ร้านปิด"
                class="kf-input"
              />
            </b-input-group>
          </b-form-group>

          <b-form-group
            label="Hashtags (ไม่ใส่ #)"
            label-class="kf-label"
            class="mb-3"
          >
            <b-form-tags
              v-model="form.hashtags"
              separator=",;"
              placeholder="เพิ่มแฮชแท็กด้วย , หรือ Enter"
              class="kf-input"
            />
          </b-form-group>

          <b-form-group
            label="Sentiment"
            label-class="kf-label"
            class="mb-3"
          >
            <v-select
              v-model="form.sentiment"
              :options="sentimentOptions"
              :reduce="option => option.value"
              label="label"
              multiple
              placeholder="เลือก Sentiment"
            />
          </b-form-group>

          <div class="kf-preview">
            <div class="kf-preview-title">ตัวอย่างเงื่อนไขที่ระบบจะใช้</div>

            <div class="kf-preview-row">
              <span class="kf-preview-label">
                <b-icon icon="check-circle" class="mr-1" />
                จับคำ
              </span>

              <span class="kf-preview-content">
                <template v-if="searchGroups.length">
                  <span
                    v-for="(group, groupIndex) in searchGroups"
                    :key="`search-group-${groupIndex}`"
                    class="kf-preview-group"
                  >
                    <span v-if="groupIndex > 0" class="kf-preview-op">OR</span>

                    <span
                      v-for="(term, termIndex) in group"
                      :key="`search-term-${groupIndex}-${termIndex}`"
                    >
                      <span v-if="termIndex > 0" class="kf-preview-op">AND</span>
                      <b-badge class="kf-chip kf-chip-include">{{ term }}</b-badge>
                    </span>
                  </span>
                </template>

                <span v-else class="text-muted">ยังไม่ได้ระบุคำค้นหา</span>
              </span>
            </div>

            <div class="kf-preview-row">
              <span class="kf-preview-label">
                <b-icon icon="slash-circle" class="mr-1" />
                ไม่เอา
              </span>

              <span class="kf-preview-content">
                <template v-if="excludeGroups.length">
                  <span
                    v-for="(group, groupIndex) in excludeGroups"
                    :key="`exclude-group-${groupIndex}`"
                    class="kf-preview-group"
                  >
                    <span v-if="groupIndex > 0" class="kf-preview-op">OR</span>

                    <span
                      v-for="(term, termIndex) in group"
                      :key="`exclude-term-${groupIndex}-${termIndex}`"
                    >
                      <span v-if="termIndex > 0" class="kf-preview-op">AND</span>
                      <b-badge class="kf-chip kf-chip-exclude">{{ term }}</b-badge>
                    </span>
                  </span>
                </template>

                <span v-else class="text-muted">ไม่มี</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Step 3 -->
      <section class="kf-section kf-section-last">
        <div class="kf-section-head">
          <span class="kf-step">3</span>
          <h6 class="kf-section-title mb-0">
            แจ้งเตือนเมื่อมีความผิดปกติ
          </h6>
        </div>

        <label
          class="kf-switch-row"
          :class="{ 'kf-switch-row-disabled': !form.is_active }"
        >
          <div>
            <div class="kf-switch-title">
              <b-icon icon="bell" class="mr-1" />
              เปิดการแจ้งเตือนสำหรับ keywords นี้
            </div>
            <div class="kf-switch-desc">
              ระบบจะแจ้งเตือนเมื่อปริมาณข้อมูลสูงกว่าระดับปกติ
            </div>
          </div>

          <b-form-checkbox
            v-model="form.enable_alert"
            switch
            size="lg"
            class="kf-switch"
            :disabled="!form.is_active"
          />
        </label>

        <div v-if="!form.is_active" class="kf-channel-hint">
          <b-icon icon="info-circle" class="mr-1" />
          ต้องเปิดใช้งาน keywords นี้ก่อน จึงจะเปิดการแจ้งเตือนได้
        </div>

        <transition name="kf-fade">
          <div v-if="form.enable_alert" class="kf-alert-panel">

            <!-- ▼ เลือกช่องทาง (ไม่บังคับ — ยังไม่เลือก/ยังไม่เชื่อมก็บันทึกได้ก่อน ไปผูกทีหลังได้) -->
            <b-form-group
              label="ช่องทางแจ้งเตือน (ไม่บังคับ)"
              label-class="kf-label-sm"
              class="mb-2"
            >
              <div class="kf-channel-preview">
           <i class="fa-brands fa-line" style="color: #00c300;font-size: 20px;"></i>
                ระบบจะส่งแจ้งเตือนผ่าน LINE OA โดยอัตโนมัติ  <a href="#" @click.prevent="$emit('open-channel-settings')">ตั้งค่าช่องทางแจ้งเตือน</a>
              </div>

              <b-form-checkbox-group
                v-model="alert.notify_channels"
                :options="channelOptionsWithStatus"
                buttons
                button-variant="outline-info"
                class="kf-channel-group d-none"
                disabled
              />
            </b-form-group>

            <div v-if="!alert.notify_channels.length" class="kf-channel-hint d-none">
              <b-icon icon="info-circle" class="mr-1" />
              ยังไม่ได้เลือกช่องทางแจ้งเตือน — บันทึก keywords นี้ได้เลย แล้วค่อยไปผูกช่องทาง/เลือกช่องทางทีหลังได้ที่
              <a href="#" @click.prevent="$emit('open-channel-settings')">ตั้งค่าช่องทางแจ้งเตือน</a>
            </div>

            <div v-else-if="hasUnconnectedSelection" class="kf-channel-hint d-none">
              <b-icon icon="info-circle" class="mr-1" />
              บางช่องทางที่เลือกยังไม่ได้เชื่อมต่อ ไปที่
              <a href="#" @click.prevent="$emit('open-channel-settings')">ตั้งค่าช่องทางแจ้งเตือน</a>
              เพื่อเชื่อมต่อก่อน ระบบจะยังไม่ส่งแจ้งเตือนผ่านช่องทางนั้นจนกว่าจะเชื่อมต่อสำเร็จ
            </div>
            <!-- ▲ -->

            <div class="kf-alert-intro">
              <div class="kf-alert-intro-icon">
                <b-icon icon="graph-up" />
              </div>

              <div>
                <div class="kf-alert-intro-title">
                  ระบบตรวจจับความผิดปกติอย่างไร
                </div>
                <div class="kf-alert-intro-desc">
                  ระบบจะตรวจสอบข้อมูลตามช่วงเวลาที่กำหนด และเริ่มแจ้งเตือน
                  เมื่อจำนวนโพสต์หรือ Engagement ถึงค่าขั้นต่ำ
                </div>
              </div>
            </div>

            <b-row>
              <b-col md="6">
                <b-form-group
                  label="ข้อมูลที่ใช้ตรวจสอบ"
                  label-class="kf-label-sm"
                >
                  <b-form-select
                    v-model="alert.metric"
                    :options="metricOptions"
                  />
                </b-form-group>
              </b-col>

              <b-col md="6">
                <b-form-group
                  label="ตรวจสอบทุก"
                  label-class="kf-label-sm"
                  :state="windowValueState"
                  invalid-feedback="กรุณาระบุจำนวนที่มากกว่า 0"
                >
                  <div class="d-flex">
                    <b-form-input
                      v-model.number="alert.window_value"
                      type="number"
                      min="1"
                      step="1"
                      placeholder="จำนวน"
                      class="mr-2"
                      :state="windowValueState"
                    />
                    <b-form-select
                      v-model="alert.window_unit"
                      :options="windowUnits"
                    />
                  </div>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row class="mt-2 mb-1">
              <b-col md="6">
                <b-form-group
                  label="จำนวนโพสต์ขั้นต่ำ"
                  label-class="kf-label-sm"
                  description="ระบบจะยังไม่แจ้งเตือน หากจำนวนข้อมูลต่ำกว่าค่านี้"
                  :state="minVolumeState"
                  invalid-feedback="กรุณาระบุจำนวนเต็มที่มากกว่า 0"
                >
                  <b-form-input
                    v-model.number="alert.min_volume"
                    type="number"
                    min="1"
                    step="1"
                    :state="minVolumeState"
                  />
                </b-form-group>
              </b-col>

              <b-col md="6">
                <b-form-group
                  label="เว้นระยะการแจ้งเตือน"
                  label-class="kf-label-sm"
                  description="ป้องกันการแจ้งเตือนซ้ำบ่อยเกินไป"
                  :state="cooldownState"
                  invalid-feedback="กรุณาระบุจำนวนตั้งแต่ 0 ขึ้นไป"
                >
                  <b-input-group append="นาที">
                    <b-form-input
                      v-model.number="alert.cooldown_minutes"
                      type="number"
                      min="0"
                      step="1"
                      :state="cooldownState"
                    />
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>
          </div>
        </transition>
      </section>
    </div>

    <div class="kf-footer">
      <b-button
        variant="outline-secondary"
        class="kf-btn-cancel"
        @click="$emit('cancel')"
      >
        ยกเลิก
      </b-button>

      <b-button
        class="kf-btn-save"
        :disabled="!canSave"
        @click="save"
      >
        <b-spinner v-if="saving" small class="mr-1" />
        <b-icon v-else icon="check2" class="mr-1" />
        {{ saving ? 'กำลังบันทึก...' : 'บันทึก keywords' }}
      </b-button>
    </div>
  </b-card>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

// ปรับ path ตรงนี้ที่เดียวถ้า backend ไม่ได้ mount ตาม default นี้
// dev: proxy ผ่าน vue.config.js -> http://localhost:8080
// (แก้: ตัด "/" ท้าย URL ออก กัน path ซ้อน เช่น "...alert//addKeywordBag")
const KEYWORD_BAG_BASE = 'http://localhost:3000/api/v2/alert'

function parseGroups(input) {
  if (!input || !input.trim()) return []

  return input
    .split(',')
    .map(group => group.trim())
    .filter(Boolean)
    .map(group =>
      group
        .split(/[\s+]+/)
        .map(term => term.trim().toLowerCase())
        .filter(Boolean)
    )
    .filter(group => group.length > 0)
}

function isPositiveInt(value, min = 1) {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    Number.isInteger(value) &&
    value >= min
  )
}

export default {
  name: 'KeywordBagForm',

  components: {
    vSelect,
  },

  props: {
    value: {
      type: Object,
      default: null,
    },

    // สถานะการเชื่อมต่อของแต่ละช่องทาง ส่งมาจาก parent ซึ่งดึงมาจาก
    // NotifyChannelSettings (หรือ store กลาง) — form นี้ "อ่านอย่างเดียว"
    // ไม่มีสิทธิ์เชื่อม/ยกเลิกช่องทางใด ๆ เอง
    channelStatus: {
      type: Object,
      default: () => ({ telegram: false, email: true, line_oa: false }),
    },
  },

  data() {
    return {
      saving: false,

      // ── ฟอร์มหลัก — field name ตรงกับ AlertKeywordBag schema ทุกตัว ──────
      form: {
        name: this.value?.name || '',
        description: this.value?.description || '',
        keyword: this.value?.keyword || '',
        exclude: this.value?.exclude || '',
        hashtags: Array.isArray(this.value?.hashtags)
          ? [...this.value.hashtags]
          : [],
        sentiment: Array.isArray(this.value?.sentiment)
          ? [...this.value.sentiment]
          : [],
        enable_alert:
          typeof this.value?.enable_alert === 'boolean'
            ? this.value.enable_alert
            : true,
        is_active:
          typeof this.value?.is_active === 'boolean'
            ? this.value.is_active
            : true,
      },

      alert: {
        metric: this.value?.alert?.metric || 'frequency',
        window_value: Number(this.value?.alert?.window_value || 1),
        window_unit: this.value?.alert?.window_unit || 'hours',
        threshold_percent: Number(this.value?.alert?.threshold_percent || 150),
        min_volume: Number(this.value?.alert?.min_volume || 10),
        cooldown_minutes: Number(this.value?.alert?.cooldown_minutes ?? 120),
        // เก็บเฉพาะ "ที่ผู้ใช้อยากใช้" ไม่ใช่สถานะการเชื่อมต่อจริง —
        // ไม่บังคับต้องเลือก และไม่บังคับต้องเชื่อมต่อก่อนถึงจะบันทึกได้
        // ยังไม่เลือก/ยังไม่เชื่อมก็บันทึก keyword ได้ก่อน ไปผูกทีหลังได้
        notify_channels: Array.isArray(this.value?.alert?.notify_channels) &&
        this.value.alert.notify_channels.length
          ? [...this.value.alert.notify_channels]
          : ['line_oa'],
      },

      metricOptions: [
        { value: 'frequency', text: 'จำนวนโพสต์' },
        // { value: 'engagement', text: 'ยอด Engagement' },
        // { value: 'both', text: 'ทั้งโพสต์ และ Engagement' },
      ],

      windowUnits: [
        { value: 'minutes', text: 'นาที' },
        { value: 'hours', text: 'ชั่วโมง' },
        { value: 'days', text: 'วัน' },
      ],

      channelOptions: [
        // { value: 'telegram', text: 'Telegram' },
        // { value: 'email', text: 'อีเมล' },
        { value: 'line_oa', text: 'LINE OA' },
      ],

      sentimentOptions: [
        { value: '1', label: 'เชิงบวก' },
        { value: '0', label: 'เป็นกลาง' },
        { value: '-1', label: 'เชิงลบ' },
      ],
    }
  },

  watch: {
    'form.is_active'(newVal) {
      // ปิดใช้งาน keywords ต้องปิดการแจ้งเตือนไปด้วยเสมอ
      if (!newVal) {
        this.form.enable_alert = false
      }
    },
  },

  computed: {
    isEdit() {
      return Boolean(this.value?._id)
    },

    // เติมสถานะเชื่อมต่อ ● ต่อท้าย label ปุ่ม โดยไม่แก้ channelOptions ต้นทาง
    channelOptionsWithStatus() {
      return this.channelOptions.map(opt => ({
        ...opt,
        text: this.channelStatus[opt.value]
          ? `${opt.text} ●`
          : opt.text,
      }))
    },

    hasUnconnectedSelection() {
      return this.alert.notify_channels.some(
        channel => !this.channelStatus[channel]
      )
    },

    minVolumeState() {
      if (!this.form.enable_alert) return null
      return isPositiveInt(this.alert.min_volume, 1) ? null : false
    },

    windowValueState() {
      if (!this.form.enable_alert) return null
      return isPositiveInt(this.alert.window_value, 1) ? null : false
    },

    cooldownState() {
      if (!this.form.enable_alert) return null
      return isPositiveInt(this.alert.cooldown_minutes, 0) ? null : false
    },

    isAlertValid() {
      if (!this.form.enable_alert) return true

      // ไม่บังคับเลือกช่องทางแจ้งเตือนแล้ว — ยังไม่เลือกก็บันทึกได้
      return (
        isPositiveInt(this.alert.min_volume, 1) &&
        isPositiveInt(this.alert.window_value, 1) &&
        isPositiveInt(this.alert.cooldown_minutes, 0)
      )
    },

    canSave() {
      return Boolean(
        this.form.name &&
        this.form.keyword &&
        this.isAlertValid &&
        !this.saving
      )
    },

    searchGroups() {
      return parseGroups(this.form.keyword)
    },

    excludeGroups() {
      return parseGroups(this.form.exclude)
    },
  },

  methods: {
    // ── Payload builders ───────────────────────────────────────────────────
    // field names ต้องตรงกับ routes/alertKeywordBag.js และ models/AlertKeywordBag.js

    buildBagPayload() {
      return {
        name: this.form.name.trim(),
        description: this.form.description.trim(),
        keyword: this.form.keyword.trim(),
        exclude: this.form.exclude.trim(),
        hashtags: [...this.form.hashtags],
        sentiment: [...this.form.sentiment],
        enable_alert: this.form.enable_alert,
        is_active: this.form.is_active,
      }
    },

    buildAlertPayload() {
      // ส่งช่องทางที่ user เลือกไปตรงๆ ไม่กรองด้วย channelStatus แล้ว —
      // แม้ช่องทางไหนยังไม่เชื่อมต่อก็เก็บ selection ไว้ก่อนได้ (backend จะ
      // ยังไม่ส่งจนกว่าจะเชื่อมต่อสำเร็จ ไม่ต้องย้อนมาติ๊กเลือกใหม่ทีหลัง)
      return {
        metric: this.alert.metric,
        window_value: Number(this.alert.window_value),
        window_unit: this.alert.window_unit,
        window_minutes: this.toMinutes(
          this.alert.window_value,
          this.alert.window_unit
        ),
        threshold_percent: Number(this.alert.threshold_percent),
        min_volume: Number(this.alert.min_volume),
        cooldown_minutes: Number(this.alert.cooldown_minutes),
        notify_channels: [...this.alert.notify_channels],
      }
    },

    toMinutes(value, unit) {
      const n = Number(value) || 0
      const factors = {
        minutes: 1,
        hours: 60,
        days: 1440,
      }
      return n * (factors[unit] || 1)
    },

    formatDate(value) {
      if (!value) return '—'

      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return value

      return new Intl.DateTimeFormat('th-TH', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    },

    // ── Create / Update — ตรงกับ routes/alertKeywordBag.js ─────────────────

    async createBagOnServer(payload) {
      const headers = {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      }
      const { data } = await this.axios.post(
        `${KEYWORD_BAG_BASE}/addKeywordBag`,
        payload,
        { headers }
      )
      return data.data
    },

    async updateBagOnServer(id, payload) {
      const headers = {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      }
      const { data } = await this.axios.put(
        `${KEYWORD_BAG_BASE}/updateKeywordBag`,
        { id, ...payload },
        { headers }
      )
      return data.data
    },

    async save() {
      if (!this.canSave) return

      // หมายเหตุ: เดิมมีการเช็ค hasUnconnectedSelection แล้วเปิด modal
      // ถามยืนยันก่อนบันทึก — ตัดออกแล้วตามที่ต้องการ ให้บันทึกได้ทันที
      // แม้ช่องทางที่เลือกจะยังไม่ได้เชื่อมต่อ (ข้อความ hint ในฟอร์ม
      // ด้านบนยังแจ้งเตือนผู้ใช้อยู่ตามปกติ)

      this.saving = true

      try {
        const bagPayload = {
          ...this.buildBagPayload(),
          alert: this.buildAlertPayload(),
        }

        const bag = this.isEdit
          ? await this.updateBagOnServer(this.value._id, bagPayload)
          : await this.createBagOnServer(bagPayload)

        this.$emit('saved', bag)
      } catch (error) {
        this.handleError(error, 'ไม่สามารถบันทึก keywords ได้')
      } finally {
        this.saving = false
      }
    },

    extractError(error, fallbackMessage) {
      return (
        error?.response?.data?.message ||
        error?.message ||
        fallbackMessage
      )
    },

    handleError(error, fallbackMessage) {
      console.error(error)

      this.showToast(
        'เกิดข้อผิดพลาด',
        this.extractError(error, fallbackMessage),
        'danger'
      )
    },

    showToast(title, message, variant) {
      if (!this.$bvToast) return

      this.$bvToast.toast(message, {
        title,
        variant,
        solid: true,
      })
    },
  },
}
</script>

<style scoped>
.kf-card {
  color: #2e2a26;
  border: none;
  border-radius: 18px;
  overflow: hidden;
}

.kf-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 26px;
  background: linear-gradient(to right, #fed06e33, #f0cfda4d);
  border-bottom: 1px solid #f0e9dc;
}

.kf-header-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #d9a441;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.kf-title,
.kf-section-title {
  font-family: 'Prompt', sans-serif;
  font-weight: 600;
}

.kf-subtitle {
  font-size: 0.85rem;
  color: #8a8178;
}

.kf-meta {
  font-size: 0.75rem;
  color: #8a8178;
  margin-top: 3px;
}

.kf-body {
  padding: 8px 26px 0;
  max-height: 72vh;
  overflow-y: auto;
}

.kf-section {
  padding: 15px 0;
  border-bottom: 1px solid #f2ede3;
}

.kf-section-last {
  border-bottom: none;
  padding-bottom: 4px;
}

.kf-section-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.kf-step {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #d9a441;
  color: #fff;
  font-weight: 600;
  font-size: 0.78rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kf-section-title {
  font-size: 0.98rem;
}

.kf-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #6b6259;
}

.kf-label-sm {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b6259;
}

.kf-query-help {
  border: 1px solid #e9e1d5;
  background: #fbf8f3;
  color: #6b6259;
  font-size: 0.8rem;
}

.kf-input:focus {
  border-color: #d9a441;
  box-shadow: 0 0 0 3px rgba(217, 164, 65, 0.15);
}

.kf-fade-enter-active,
.kf-fade-leave-active {
  transition: opacity 0.15s ease;
}

.kf-fade-enter,
.kf-fade-leave-to {
  opacity: 0;
}

.kf-preview {
  background: #fbf8f3;
  border: 1px solid #f0e9dc;
  border-radius: 12px;
  padding: 14px 16px;
}

.kf-preview-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b6259;
  margin-bottom: 10px;
}

.kf-preview-row {
  display: flex;
  gap: 10px;
  align-items: baseline;
  font-size: 0.85rem;
}

.kf-preview-row + .kf-preview-row {
  margin-top: 8px;
}

.kf-preview-label {
  width: 70px;
  flex-shrink: 0;
  color: #8a8178;
  font-weight: 500;
}

.kf-preview-content {
  flex: 1;
}

.kf-preview-op {
  color: #b3aaa0;
  font-size: 0.72rem;
  margin: 0 5px;
  font-weight: 600;
}

.kf-chip {
  border-radius: 999px;
  font-weight: 500;
  padding: 4px 10px;
  margin: 2px 2px 2px 0;
}

.kf-chip-include {
  background: #eaf3ee;
  color: #2b7a4b;
}

.kf-chip-exclude {
  background: #fbeceb;
  color: #c94a3f;
}

.kf-switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #fbf8f3;
  border: 1px solid #f0e9dc;
  border-radius: 12px;
  padding: 14px 16px;
  cursor: pointer;
  margin-bottom: 0;
}

.kf-switch-title {
  font-weight: 600;
  font-size: 0.92rem;
}

.kf-switch-desc {
  font-size: 0.78rem;
  color: #8a8178;
  margin-top: 2px;
}

.kf-switch-row-disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.kf-alert-panel {
  border: 1px solid #f0e9dc;
  border-radius: 12px;
  padding: 16px;
  margin-top: 12px;
}

.kf-alert-intro {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #f5f8fc;
  border: 1px solid #e4ebf3;
  border-radius: 10px;
  padding: 12px;
  margin-top: 14px;
  margin-bottom: 16px;
}

.kf-alert-intro-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: #e6eef8;
  color: #456a92;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kf-alert-intro-title {
  font-size: 0.84rem;
  font-weight: 600;
  color: #40566d;
}

.kf-alert-intro-desc {
  font-size: 0.77rem;
  line-height: 1.45;
  color: #6d8092;
  margin-top: 2px;
}

.kf-channel-preview {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  margin-bottom: 8px;
  border-radius: 8px;
  background: #f8f0dc;
  color: #7a5c14;
  font-size: 0.8rem;
  font-weight: 600;
}

.kf-channel-icon {
  color: #2c7fb8;
  font-size: 0.95rem;
}

.kf-channel-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.kf-channel-group ::v-deep .btn {
  font-size: 0.82rem;
  border-radius: 8px !important;
  margin: 0;
}

.kf-channel-hint {
  font-size: 0.76rem;
  color: #8a7a4e;
  background: #fdf7e8;
  border: 1px solid #f2e4b8;
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 4px;
}

.kf-channel-hint a {
  color: #8a6a1f;
  font-weight: 600;
  text-decoration: underline;
}

/* Footer */
.kf-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 26px;
  border-top: 1px solid #f0e9dc;
  background: #fffdfa;
}

.kf-btn-cancel,
.kf-btn-save {
  border-radius: 10px;
  padding: 9px 18px;
}

.kf-btn-save {
  background: #d9a441;
  border: none;
  font-weight: 600;
  box-shadow: 0 6px 16px rgba(217, 164, 65, 0.35);
}

.kf-btn-save:hover:not(:disabled) {
  background: #c8943a;
}

.kf-btn-save:disabled {
  background: #e6c98a;
  box-shadow: none;
}

@media (max-width: 576px) {
  .kf-header,
  .kf-body,
  .kf-footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .kf-preview-row {
    flex-direction: column;
    gap: 4px;
  }

  .kf-preview-label {
    width: auto;
  }

  .kf-footer {
    flex-direction: column-reverse;
  }

  .kf-btn-cancel,
  .kf-btn-save {
    width: 100%;
  }
}
</style>