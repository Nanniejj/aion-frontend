<template>
  <b-card no-body class="kf-card">
    <div class="kf-header">
      <div class="kf-header-icon"><b-icon icon="folder-plus" /></div>
      <div>
        <h5 class="mb-0 kf-title">{{ isEdit ? 'แก้ไขถุงคำ' : 'สร้างถุงคำใหม่' }}</h5>
        <p class="kf-subtitle mb-0">ตั้งค่าคำที่ต้องการติดตาม แล้วเปิดแจ้งเตือนได้ในขั้นตอนเดียว</p>
      </div>
    </div>

    <div class="kf-body">
      <!-- Step 1 -->
      <section class="kf-section">
        <div class="kf-section-head">
          <span class="kf-step">1</span>
          <div>
            <h6 class="kf-section-title mb-0">ตั้งชื่อถุงคำ</h6>
          </div>
        </div>

        <b-form-group label="ชื่อถุงคำ" label-class="kf-label">
          <b-form-input v-model="form.name" placeholder="เช่น ถุงคำแบรนด์ A" class="kf-input" />
        </b-form-group>

        <b-form-group label="คำอธิบาย (ไม่บังคับ)" label-class="kf-label" class="mb-0">
          <b-form-input v-model="form.description" placeholder="ใช้ติดตามอะไร" class="kf-input" />
        </b-form-group>
      </section>

      <!-- Step 2 -->
      <section class="kf-section">
        <div class="kf-section-head">
          <span class="kf-step">2</span>
          <div>
            <h6 class="kf-section-title mb-0">เลือกแหล่งที่มาของคำค้นหา</h6>
          </div>
        </div>

        <div class="kf-mode-grid">
          <button
            type="button"
            class="kf-mode-card"
            :class="{ active: form.config_mode === 'domain' }"
            @click="setMode('domain')"
          >
            <div class="kf-mode-icon"><b-icon icon="diagram-3" /></div>
            <div>
              <div class="kf-mode-title">ดึงจาก Domain</div>
              <div class="kf-mode-desc">เลือก Domain → Subdomain → Object ระบบประกอบคำค้นหาให้อัตโนมัติ</div>
            </div>
            <b-icon v-if="form.config_mode === 'domain'" icon="check-circle-fill" class="kf-mode-check" />
          </button>

          <button
            type="button"
            class="kf-mode-card"
            :class="{ active: form.config_mode === 'custom' }"
            @click="setMode('custom')"
          >
            <div class="kf-mode-icon"><b-icon icon="pencil" /></div>
            <div>
              <div class="kf-mode-title">กำหนดถุงคำเอง</div>
              <div class="kf-mode-desc">พิมพ์คำค้นหาที่ต้องการติดตามด้วยตัวเอง อิสระเต็มที่</div>
            </div>
            <b-icon v-if="form.config_mode === 'custom'" icon="check-circle-fill" class="kf-mode-check" />
          </button>
        </div>

        <!-- Domain cascade -->
        <transition name="kf-fade">
          <div v-if="form.config_mode === 'domain'" class="kf-domain-flow">
            <b-form-group label="Domain" label-class="kf-label">
              <v-select
                :options="domains"
                v-model="domainSelection.domain_id"
                label="name"
                :reduce="(d) => d.id"
                placeholder="ค้นหาหรือเลือก Domain"
                @input="onDomainChange"
              />
            </b-form-group>

            <b-form-group
              v-if="domainSelection.domain_id"
              label="Subdomain"
              label-class="kf-label"
            >
              <b-spinner v-if="loadingSubdomains" small class="my-2" />
              <template v-else>
                <v-select
                  :options="subdomains"
                  v-model="domainSelection.subdomain_ids"
                  label="subdomain_name"
                  :reduce="(s) => s.subdomain_id"
                  multiple
                  placeholder="เลือก Subdomain ได้มากกว่า 1"
                  @input="onSubdomainChange"
                />
                <div v-if="!subdomains.length" class="small text-muted mt-1">
                  ไม่มี Subdomain สำหรับ Domain นี้
                </div>
              </template>
            </b-form-group>

            <b-form-group
              v-if="domainSelection.subdomain_ids.length"
              label="Object (แบรนด์ / หัวข้อ)"
              label-class="kf-label"
              class="mb-0"
            >
              <b-spinner v-if="loadingObjects" small class="my-2" />
              <template v-else>
                <v-select
                  :options="objects"
                  v-model="domainSelection.object_ids"
                  label="object_name"
                  :reduce="(o) => o.object_id"
                  multiple
                  placeholder="เลือก Object ที่ต้องการติดตาม"
                  @input="syncSearchQueryFromDomain"
                />
                <div v-if="!objects.length" class="small text-muted mt-1">
                  ไม่มี Object สำหรับ Subdomain ที่เลือก
                </div>
              </template>
            </b-form-group>

            <div v-if="domainSelection.domain_id && !domainSelection.subdomain_ids.length" class="kf-hint">
              <b-icon icon="info-circle" class="mr-1" />เลือก Subdomain อย่างน้อย 1 รายการ เพื่อเลือก Object ที่จะติดตาม
            </div>
          </div>
        </transition>

        <!-- Query fields -->
        <div class="kf-query-block">
          <b-form-group class="mb-2">
            <template #label>
              <span class="kf-label">คำค้นหา</span>
              <b-icon
                icon="question-circle"
                class="kf-info-icon"
                v-b-tooltip.hover
                title="เว้นวรรค หรือ + = AND ระหว่างคำในกลุ่มเดียวกัน | จุลภาค (,) = OR ระหว่างกลุ่ม"
              />
            </template>
            <b-input-group>
              <template #prepend>
                <b-input-group-text><b-icon icon="search" /></b-input-group-text>
              </template>
              <b-form-input
                v-model="form.search_query"
                placeholder="เช่น แบรนด์เอ, brand a"
                :disabled="form.config_mode === 'domain'"
                class="kf-input"
              />
            </b-input-group>
            <small v-if="form.config_mode === 'domain'" class="text-muted">
              สร้างจากรายการ Object ที่เลือกด้านบนโดยอัตโนมัติ
            </small>
          </b-form-group>

          <b-form-group label="คำที่ไม่เอา" label-class="kf-label" class="mb-3">
            <b-input-group>
              <template #prepend>
                <b-input-group-text><b-icon icon="x" /></b-input-group-text>
              </template>
              <b-form-input v-model="form.exclude_query" placeholder="เช่น สแปม, ร้านปิด" class="kf-input" />
            </b-input-group>
          </b-form-group>

          <div class="kf-preview">
            <div class="kf-preview-row">
              <span class="kf-preview-label"><b-icon icon="check-circle" class="mr-1" />จับคำ</span>
              <span class="kf-preview-content">
                <template v-if="searchGroups.length">
                  <span v-for="(group, gi) in searchGroups" :key="'s' + gi" class="kf-preview-group">
                    <span v-if="gi > 0" class="kf-preview-op">OR</span>
                    <span v-for="(term, ti) in group" :key="'st' + ti">
                      <span v-if="ti > 0" class="kf-preview-op">AND</span>
                      <b-badge class="kf-chip kf-chip-include">{{ term }}</b-badge>
                    </span>
                  </span>
                </template>
                <span v-else class="text-muted">ยังไม่ได้ระบุคำค้นหา</span>
              </span>
            </div>
            <div class="kf-preview-row">
              <span class="kf-preview-label"><b-icon icon="slash-circle" class="mr-1" />ไม่เอา</span>
              <span class="kf-preview-content">
                <template v-if="excludeGroups.length">
                  <span v-for="(group, gi) in excludeGroups" :key="'e' + gi" class="kf-preview-group">
                    <span v-if="gi > 0" class="kf-preview-op">OR</span>
                    <span v-for="(term, ti) in group" :key="'et' + ti">
                      <span v-if="ti > 0" class="kf-preview-op">AND</span>
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
          <div>
            <h6 class="kf-section-title mb-0">แจ้งเตือนเมื่อมีความผิดปกติ</h6>
          </div>
        </div>

        <label class="kf-switch-row">
          <div>
            <div class="kf-switch-title">🔔 เปิด Spike Alert สำหรับถุงคำนี้</div>
            <div class="kf-switch-desc">ตั้งค่าตอนนี้ได้เลย หรือปรับทีหลังก็ได้</div>
          </div>
          <b-form-checkbox v-model="form.enable_alert" switch size="lg" class="kf-switch" />
        </label>

        <transition name="kf-fade">
          <div v-if="form.enable_alert" class="kf-alert-panel">
            <b-row>
              <b-col md="6">
                <b-form-group label="วัดจาก" label-class="kf-label-sm">
                  <b-form-select v-model="alert.metric" :options="metricOptions" />
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="ช่วงเวลาตรวจสอบ" label-class="kf-label-sm">
                  <b-form-select v-model="alert.window_minutes" :options="windowOptions" />
                </b-form-group>
              </b-col>
            </b-row>

            <div class="mb-3">
              <div class="d-flex justify-content-between kf-label-sm mb-1">
                <span>เกณฑ์แจ้งเตือน (เพิ่มขึ้นกี่ % จาก baseline)</span>
                <span class="kf-threshold-value">{{ alert.threshold_percent }}%</span>
              </div>
              <b-form-input v-model.number="alert.threshold_percent" type="range" min="50" max="500" step="10" />
            </div>

            <b-row class="mb-1">
              <b-col md="6">
                <b-form-group label="mention ขั้นต่ำก่อนพิจารณา" label-class="kf-label-sm">
                  <b-form-input v-model.number="alert.min_volume" type="number" />
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="cooldown (นาที)" label-class="kf-label-sm">
                  <b-form-input v-model.number="alert.cooldown_minutes" type="number" />
                </b-form-group>
              </b-col>
            </b-row>

            <b-form-group label="ช่องทางแจ้งเตือน" label-class="kf-label-sm" class="mb-0">
              <b-form-checkbox-group
                v-model="alert.notify_channels"
                :options="channelOptions"
                buttons
                button-variant="outline-primary"
                class="kf-channel-group"
              />
            </b-form-group>
          </div>
        </transition>
      </section>
    </div>

    <div class="kf-footer">
      <b-button variant="outline-secondary" class="kf-btn-cancel" @click="$emit('cancel')">ยกเลิก</b-button>
      <b-button
        class="kf-btn-save"
        :disabled="!form.name || !form.search_query || saving"
        @click="save"
      >
        <b-spinner v-if="saving" small class="mr-1" />
        <b-icon v-else icon="check2" class="mr-1" />
        บันทึกถุงคำ
      </b-button>
    </div>
  </b-card>
</template>

<script>
import { mockApi } from './mock/store'
import 'vue-select/dist/vue-select.css'

// เว้นวรรค หรือ '+' = AND ภายในกลุ่ม, ',' = OR ระหว่างกลุ่ม
function parseGroups(input) {
  if (!input || !input.trim()) return []
  return input
    .split(',')
    .map((g) => g.trim())
    .filter(Boolean)
    .map((g) =>
      g
        .split(/[\s+]+/)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
    )
    .filter((group) => group.length > 0)
}

export default {
  name: 'KeywordBagForm',
  props: {
    value: { type: Object, default: null },
    alertValue: { type: Object, default: null }, // ตั้งค่า alert เดิม (ตอนแก้ไข) ถ้ามี
  },
  data() {
    return {
      saving: false,
      loadingSubdomains: false,
      loadingObjects: false,
      form: {
        name: this.value?.name || '',
        description: this.value?.description || '',
        search_query: this.value?.search_query || '',
        exclude_query: this.value?.exclude_query || '',
        enable_alert: true,
        config_mode: this.value?.config_mode || 'custom',
      },
      // การเลือก Domain -> Subdomain -> Object (ใช้เมื่อ config_mode === 'domain')
      domainSelection: {
        domain_id: this.value?.domain_id || null,
        subdomain_ids: this.value?.subdomain_ids ? [...this.value.subdomain_ids] : [],
        object_ids: this.value?.object_ids ? [...this.value.object_ids] : [],
      },
      domains: [],
      subdomains: [],
      objects: [],
      alert: {
        metric: this.alertValue?.metric || 'frequency',
        window_minutes: this.alertValue?.window_minutes || 30,
        threshold_percent: this.alertValue?.threshold_percent || 150,
        min_volume: this.alertValue?.min_volume || 10,
        cooldown_minutes: this.alertValue?.cooldown_minutes || 120,
        notify_channels: this.alertValue?.notify_channels || ['in_app'],
      },
      metricOptions: [
        { value: 'frequency', text: 'ความถี่ (mention count)' },
        { value: 'engagement', text: 'engagement' },
        { value: 'both', text: 'ทั้งสองอย่าง' },
      ],
      windowOptions: [
        { value: 15, text: 'ทุก 15 นาที' },
        { value: 30, text: 'ทุก 30 นาที' },
        { value: 60, text: 'ทุก 1 ชั่วโมง' },
      ],
      channelOptions: [
        { value: 'in_app', text: 'ในแอป' },
        { value: 'email', text: 'อีเมล' },
        { value: 'line', text: 'Line' },
        { value: 'telegram', text: 'Telegram' },
        { value: 'webhook', text: 'Webhook' },
      ],
    }
  },
  computed: {
    isEdit() {
      return !!this.value?._id
    },
    searchGroups() {
      return parseGroups(this.form.search_query)
    },
    excludeGroups() {
      return parseGroups(this.form.exclude_query)
    },
  },
  async mounted() {
    this.domains = await mockApi.listDomains()

    // ถ้าแก้ไขถุงคำที่เคยตั้งค่าแบบดึงจาก Domain ไว้ ให้โหลด subdomain/object เดิมมาแสดงด้วย
    if (this.domainSelection.domain_id) {
      await this.loadSubdomains(this.domainSelection.domain_id)
    }
    if (this.domainSelection.subdomain_ids.length) {
      await this.loadObjects(this.domainSelection.subdomain_ids)
    }
  },
  methods: {
    setMode(mode) {
      if (this.form.config_mode === mode) return
      this.form.config_mode = mode
      if (mode === 'domain') {
        // สลับไปโหมด Domain แล้วสร้างคำค้นหาใหม่จาก Object ที่เลือกไว้ (ถ้ามี)
        this.syncSearchQueryFromDomain()
      }
      // สลับไปโหมด "กำหนดเอง" ไม่ต้องล้างค่า Domain ที่เลือกไว้ เผื่อผู้ใช้สลับกลับมา
    },
    async onDomainChange() {
      this.domainSelection.subdomain_ids = []
      this.domainSelection.object_ids = []
      this.subdomains = []
      this.objects = []
      this.syncSearchQueryFromDomain()
      if (this.domainSelection.domain_id) {
        await this.loadSubdomains(this.domainSelection.domain_id)
      }
    },
    async onSubdomainChange() {
      this.domainSelection.object_ids = []
      this.objects = []
      this.syncSearchQueryFromDomain()
      if (this.domainSelection.subdomain_ids.length) {
        await this.loadObjects(this.domainSelection.subdomain_ids)
      }
    },
    async loadSubdomains(domainId) {
      this.loadingSubdomains = true
      try {
        this.subdomains = await mockApi.listSubdomains(domainId)
      } finally {
        this.loadingSubdomains = false
      }
    },
    async loadObjects(subdomainIds) {
      this.loadingObjects = true
      try {
        this.objects = await mockApi.listObjects(subdomainIds)
      } finally {
        this.loadingObjects = false
      }
    },
    // ประกอบ search_query จากชื่อ Object ที่เลือก (คั่นด้วย , = OR ตามกติกาด้านบน)
    syncSearchQueryFromDomain() {
      if (this.form.config_mode !== 'domain') return
      const names = this.objects
        .filter((o) => this.domainSelection.object_ids.includes(o.object_id))
        .map((o) => o.object_name)
      this.form.search_query = names.join(', ')
    },
    async save() {
      this.saving = true
      try {
        const payload = {
          name: this.form.name,
          description: this.form.description,
          search_query: this.form.search_query,
          exclude_query: this.form.exclude_query,
          config_mode: this.form.config_mode,
          domain_id: this.form.config_mode === 'domain' ? this.domainSelection.domain_id : null,
          subdomain_ids: this.form.config_mode === 'domain' ? this.domainSelection.subdomain_ids : [],
          object_ids: this.form.config_mode === 'domain' ? this.domainSelection.object_ids : [],
        }
        const bag = this.isEdit
          ? await mockApi.updateBag(this.value._id, payload)
          : await mockApi.createBag(payload)

        // บันทึก alert settings พร้อมกันในขั้นตอนเดียว ถ้าเปิด switch ไว้
        if (this.form.enable_alert) {
          await mockApi.updateAlertSettings(bag._id, this.alert)
        }

        this.$emit('saved', bag)
      } finally {
        this.saving = false
      }
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Prompt:wght@600;700&family=Noto+Sans+Thai:wght@400;500;600&display=swap');

.kf-card {
  font-family: 'Noto Sans Thai', sans-serif;
  color: #2e2a26;
  border: none;
  border-radius: 18px;
  overflow: hidden;
}

/* Header */
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
.kf-title {
  font-family: 'Prompt', sans-serif;
  font-weight: 600;
}
.kf-subtitle {
  font-size: 0.85rem;
  color: #8a8178;
}

/* Body / sections */
.kf-body {
  padding: 8px 26px 0;
  max-height: 62vh;
  overflow-y: auto;
}
.kf-section {
  padding: 22px 0;
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
  font-family: 'Prompt', sans-serif;
  font-weight: 600;
  font-size: 0.78rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.kf-section-title {
  font-family: 'Prompt', sans-serif;
  font-weight: 600;
  font-size: 0.98rem;
}
.kf-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #6b6259;
}
.kf-label-sm {
  font-size: 0.78rem;
  font-weight: 500;
  color: #8a8178;
}
.kf-info-icon {
  color: #b3aaa0;
  margin-left: 5px;
  cursor: help;
}
.kf-input:focus {
  border-color: #d9a441;
  box-shadow: 0 0 0 3px rgba(217, 164, 65, 0.15);
}

/* Mode picker */
.kf-mode-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 4px;
}
.kf-mode-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-align: left;
  border: 1.5px solid #ece5da;
  background: #fffdfa;
  border-radius: 14px;
  padding: 14px 16px;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}
.kf-mode-card:hover {
  transform: translateY(-1px);
  border-color: #e6c98a;
}
.kf-mode-card.active {
  border-color: #d9a441;
  background: #fff8ea;
  box-shadow: 0 6px 16px rgba(217, 164, 65, 0.18);
}
.kf-mode-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: #f5f1e9;
  color: #d9a441;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.kf-mode-card.active .kf-mode-icon {
  background: #d9a441;
  color: #fff;
}
.kf-mode-title {
  font-weight: 600;
  font-size: 0.92rem;
  margin-bottom: 2px;
}
.kf-mode-desc {
  font-size: 0.78rem;
  color: #8a8178;
  line-height: 1.35;
}
.kf-mode-check {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #d9a441;
}

@media (max-width: 576px) {
  .kf-mode-grid {
    grid-template-columns: 1fr;
  }
}

/* Domain cascade */
.kf-domain-flow {
  background: #fbf8f3;
  border: 1px solid #f0e9dc;
  border-radius: 12px;
  padding: 16px;
  margin: 14px 0 18px;
}
.kf-hint {
  font-size: 0.8rem;
  color: #a17a1f;
  background: #fdf3dd;
  border-radius: 8px;
  padding: 8px 10px;
  margin-top: 8px;
}

.kf-fade-enter-active,
.kf-fade-leave-active {
  transition: opacity 0.15s ease;
}
.kf-fade-enter,
.kf-fade-leave-to {
  opacity: 0;
}

/* Query + preview */
.kf-query-block {
  margin-top: 4px;
}
.kf-preview {
  background: #fbf8f3;
  border: 1px solid #f0e9dc;
  border-radius: 12px;
  padding: 14px 16px;
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
  flex-shrink: 0;
  width: 70px;
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

/* Alert switch + panel */
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
}
.kf-alert-panel {
  border: 1px solid #f0e9dc;
  border-radius: 12px;
  padding: 16px;
  margin-top: 12px;
}
.kf-threshold-value {
  color: #d9a441;
  font-weight: 600;
}
.kf-channel-group ::v-deep .btn {
  font-size: 0.82rem;
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
.kf-btn-cancel {
  border-radius: 10px;
  padding: 9px 18px;
}
.kf-btn-save {
  background: #d9a441;
  border: none;
  border-radius: 10px;
  padding: 9px 20px;
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
}
</style>