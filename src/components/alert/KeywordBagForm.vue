<template>
  <b-card no-body class="kf-card">
    <div class="kf-header">
      <div class="kf-header-icon">
        <b-icon icon="folder-plus" />
      </div>

      <div>
        <h5 class="mb-0 kf-title">
          {{ isEdit ? 'แก้ไขถุงคำ' : 'สร้างถุงคำใหม่' }}
        </h5>

        <p class="kf-subtitle mb-0">
          ตั้งค่าคำที่ต้องการติดตาม และเปิดแจ้งเตือนได้ในขั้นตอนเดียว
        </p>
      </div>
    </div>

    <div class="kf-body">
      <!-- Step 1: General information -->
      <section class="kf-section">
        <div class="kf-section-head">
          <span class="kf-step">1</span>

          <div>
            <h6 class="kf-section-title mb-0">
              ตั้งชื่อถุงคำ
            </h6>
          </div>
        </div>

        <b-form-group
          label="ชื่อถุงคำ"
          label-class="kf-label"
        >
          <b-form-input
            v-model.trim="form.name"
            placeholder="เช่น ถุงคำแบรนด์ A"
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

      <!-- Step 2: Keyword source -->
      <section class="kf-section">
        <div class="kf-section-head">
          <span class="kf-step">2</span>

          <div>
            <h6 class="kf-section-title mb-0">
              เลือกแหล่งที่มาของคำค้นหา
            </h6>
          </div>
        </div>

        <div class="kf-mode-grid">
          <button
            type="button"
            class="kf-mode-card"
            :class="{ active: form.config_mode === 'domain' }"
            @click="setMode('domain')"
          >
            <div class="kf-mode-icon">
              <b-icon icon="diagram-3" />
            </div>

            <div>
              <div class="kf-mode-title">
                ดึงจาก Domain
              </div>

              <div class="kf-mode-desc">
                เลือก Domain → Subdomain → Object
                แล้วระบบจะสร้างคำค้นหาให้อัตโนมัติ
              </div>
            </div>

            <b-icon
              v-if="form.config_mode === 'domain'"
              icon="check-circle-fill"
              class="kf-mode-check"
            />
          </button>

          <button
            type="button"
            class="kf-mode-card"
            :class="{ active: form.config_mode === 'custom' }"
            @click="setMode('custom')"
          >
            <div class="kf-mode-icon">
              <b-icon icon="pencil" />
            </div>

            <div>
              <div class="kf-mode-title">
                กำหนดถุงคำเอง
              </div>

              <div class="kf-mode-desc">
                พิมพ์คำค้นหาที่ต้องการติดตามด้วยตัวเอง
                สามารถกำหนดได้อย่างอิสระ
              </div>
            </div>

            <b-icon
              v-if="form.config_mode === 'custom'"
              icon="check-circle-fill"
              class="kf-mode-check"
            />
          </button>
        </div>

        <!-- Domain cascade -->
        <transition name="kf-fade">
          <div
            v-if="form.config_mode === 'domain'"
            class="kf-domain-flow"
          >
            <b-form-group
              label="Domain"
              label-class="kf-label"
            >
              <v-select
                v-model="domainSelection.domain_id"
                :options="domains"
                label="name"
                :reduce="(domain) => domain.id"
                placeholder="ค้นหาหรือเลือก Domain"
                @input="onDomainChange"
              />
            </b-form-group>

            <b-form-group
              v-if="domainSelection.domain_id"
              label="Subdomain"
              label-class="kf-label"
            >
              <b-spinner
                v-if="loadingSubdomains"
                small
                class="my-2"
              />

              <template v-else>
                <v-select
                  v-model="domainSelection.subdomain_ids"
                  :options="subdomains"
                  label="subdomain_name"
                  :reduce="(subdomain) => subdomain.subdomain_id"
                  multiple
                  placeholder="เลือก Subdomain ได้มากกว่า 1 รายการ"
                  @input="onSubdomainChange"
                />

                <div
                  v-if="!subdomains.length"
                  class="small text-muted mt-1"
                >
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
              <b-spinner
                v-if="loadingObjects"
                small
                class="my-2"
              />

              <template v-else>
                <v-select
                  v-model="domainSelection.object_ids"
                  :options="objects"
                  label="object_name"
                  :reduce="(object) => object.object_id"
                  multiple
                  placeholder="เลือก Object ที่ต้องการติดตาม"
                  @input="syncSearchQueryFromDomain"
                />

                <div
                  v-if="!objects.length"
                  class="small text-muted mt-1"
                >
                  ไม่มี Object สำหรับ Subdomain ที่เลือก
                </div>
              </template>
            </b-form-group>

            <div
              v-if="
                domainSelection.domain_id &&
                !domainSelection.subdomain_ids.length
              "
              class="kf-hint"
            >
              <b-icon
                icon="info-circle"
                class="mr-1"
              />

              เลือก Subdomain อย่างน้อย 1 รายการ
              เพื่อเลือก Object ที่ต้องการติดตาม
            </div>
          </div>
        </transition>

        <!-- Search query -->
        <div class="kf-query-block">
          <b-form-group class="mb-2">
            <template #label>
              <span class="kf-label">
                คำค้นหา
              </span>

              <b-icon
                icon="question-circle"
                class="kf-info-icon"
                v-b-tooltip.hover
                title="เว้นวรรค หรือเครื่องหมาย + หมายถึงต้องพบทุกคำในกลุ่มเดียวกัน ส่วนเครื่องหมายจุลภาค (,) หมายถึงพบคำใดคำหนึ่งก็ได้"
              />
            </template>

            <b-input-group>
              <template #prepend>
                <b-input-group-text>
                  <b-icon icon="search" />
                </b-input-group-text>
              </template>

              <b-form-input
                v-model.trim="form.search_query"
                placeholder="เช่น แบรนด์เอ, brand a"
                :disabled="form.config_mode === 'domain'"
                class="kf-input"
              />
            </b-input-group>

            <small
              v-if="form.config_mode === 'domain'"
              class="text-muted"
            >
              ระบบสร้างคำค้นหาจาก Object ที่เลือกให้อัตโนมัติ
            </small>
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
                v-model.trim="form.exclude_query"
                placeholder="เช่น สแปม, ร้านปิด"
                class="kf-input"
              />
            </b-input-group>
          </b-form-group>

          <div class="kf-preview">
            <div class="kf-preview-title">
              ตัวอย่างเงื่อนไขที่ระบบจะใช้
            </div>

            <div class="kf-preview-row">
              <span class="kf-preview-label">
                <b-icon
                  icon="check-circle"
                  class="mr-1"
                />
                จับคำ
              </span>

              <span class="kf-preview-content">
                <template v-if="searchGroups.length">
                  <span
                    v-for="(group, groupIndex) in searchGroups"
                    :key="`search-group-${groupIndex}`"
                    class="kf-preview-group"
                  >
                    <span
                      v-if="groupIndex > 0"
                      class="kf-preview-op"
                    >
                      OR
                    </span>

                    <span
                      v-for="(term, termIndex) in group"
                      :key="`search-term-${groupIndex}-${termIndex}`"
                    >
                      <span
                        v-if="termIndex > 0"
                        class="kf-preview-op"
                      >
                        AND
                      </span>

                      <b-badge class="kf-chip kf-chip-include">
                        {{ term }}
                      </b-badge>
                    </span>
                  </span>
                </template>

                <span
                  v-else
                  class="text-muted"
                >
                  ยังไม่ได้ระบุคำค้นหา
                </span>
              </span>
            </div>

            <div class="kf-preview-row">
              <span class="kf-preview-label">
                <b-icon
                  icon="slash-circle"
                  class="mr-1"
                />
                ไม่เอา
              </span>

              <span class="kf-preview-content">
                <template v-if="excludeGroups.length">
                  <span
                    v-for="(group, groupIndex) in excludeGroups"
                    :key="`exclude-group-${groupIndex}`"
                    class="kf-preview-group"
                  >
                    <span
                      v-if="groupIndex > 0"
                      class="kf-preview-op"
                    >
                      OR
                    </span>

                    <span
                      v-for="(term, termIndex) in group"
                      :key="`exclude-term-${groupIndex}-${termIndex}`"
                    >
                      <span
                        v-if="termIndex > 0"
                        class="kf-preview-op"
                      >
                        AND
                      </span>

                      <b-badge class="kf-chip kf-chip-exclude">
                        {{ term }}
                      </b-badge>
                    </span>
                  </span>
                </template>

                <span
                  v-else
                  class="text-muted"
                >
                  ไม่มี
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Step 3: Alert -->
      <section class="kf-section kf-section-last">
        <div class="kf-section-head">
          <span class="kf-step">3</span>

          <div>
            <h6 class="kf-section-title mb-0">
              แจ้งเตือนเมื่อมีความผิดปกติ
            </h6>
          </div>
        </div>

        <label class="kf-switch-row">
          <div>
            <div class="kf-switch-title">
              <b-icon
                icon="bell"
                class="mr-1"
              />
              เปิดการแจ้งเตือนสำหรับถุงคำนี้
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
          />
        </label>

        <transition name="kf-fade">
          <div
            v-if="form.enable_alert"
            class="kf-alert-panel"
          >
            <div class="kf-alert-intro">
              <div class="kf-alert-intro-icon">
                <b-icon icon="graph-up" />
              </div>

              <div>
                <div class="kf-alert-intro-title">
                  ระบบตรวจจับความผิดปกติอย่างไร
                </div>

                <div class="kf-alert-intro-desc">
                  ระบบจะเปรียบเทียบข้อมูลในช่วงเวลาปัจจุบัน
                  กับค่าเฉลี่ยปกติของช่วงเวลาก่อนหน้า
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
                >
                  <b-form-select
                    v-model.number="alert.window_minutes"
                    :options="windowOptions"
                  />
                </b-form-group>
              </b-col>
            </b-row>

            <div class="kf-threshold-box">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <div class="kf-label-sm">
                    แจ้งเตือนเมื่อสูงกว่าค่าเฉลี่ยปกติ
                  </div>

                  <div class="kf-threshold-help">
                    ตัวอย่าง: 150% หมายถึงข้อมูลมากกว่าค่าเฉลี่ยปกติ 1.5 เท่า
                  </div>
                </div>

                <span class="kf-threshold-value">
                  {{ alert.threshold_percent }}%
                </span>
              </div>

              <b-form-input
                v-model.number="alert.threshold_percent"
                type="range"
                min="50"
                max="500"
                step="10"
              />

              <div class="kf-range-labels">
                <span>50%</span>
                <span>500%</span>
              </div>
            </div>

            <b-row class="mt-3 mb-1">
              <b-col md="6">
                <b-form-group
                  label="จำนวน Mention ขั้นต่ำ"
                  label-class="kf-label-sm"
                  description="ระบบจะยังไม่แจ้งเตือน หากจำนวนข้อมูลยังต่ำกว่าค่านี้"
                >
                  <b-form-input
                    v-model.number="alert.min_volume"
                    type="number"
                    min="1"
                  />
                </b-form-group>
              </b-col>

              <b-col md="6">
                <b-form-group
                  label="เว้นระยะการแจ้งเตือน"
                  label-class="kf-label-sm"
                  description="ป้องกันการแจ้งเตือนซ้ำบ่อยเกินไป"
                >
                  <b-input-group append="นาที">
                    <b-form-input
                      v-model.number="alert.cooldown_minutes"
                      type="number"
                      min="0"
                    />
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>

            <b-form-group
              label="ช่องทางแจ้งเตือน"
              label-class="kf-label-sm"
              class="mb-0"
            >
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
        <b-spinner
          v-if="saving"
          small
          class="mr-1"
        />

        <b-icon
          v-else
          icon="check2"
          class="mr-1"
        />

        {{ saving ? 'กำลังบันทึก...' : 'บันทึกถุงคำ' }}
      </b-button>
    </div>
  </b-card>
</template>

<script>
import { mockApi } from './mock/store'
import 'vue-select/dist/vue-select.css'

// เว้นวรรคหรือเครื่องหมาย + = AND ภายในกลุ่ม
// เครื่องหมายจุลภาค (,) = OR ระหว่างกลุ่ม
function parseGroups(input) {
  if (!input || !input.trim()) {
    return []
  }

  return input
    .split(',')
    .map((group) => group.trim())
    .filter(Boolean)
    .map((group) =>
      group
        .split(/[\s+]+/)
        .map((term) => term.trim().toLowerCase())
        .filter(Boolean)
    )
    .filter((group) => group.length > 0)
}

export default {
  name: 'KeywordBagForm',

  props: {
    value: {
      type: Object,
      default: null,
    },

    alertValue: {
      type: Object,
      default: null,
    },
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
        enable_alert:
          typeof this.value?.enable_alert === 'boolean'
            ? this.value.enable_alert
            : true,
        config_mode: this.value?.config_mode || 'custom',
      },

      domainSelection: {
        domain_id: this.value?.domain_id || null,
        subdomain_ids: Array.isArray(this.value?.subdomain_ids)
          ? [...this.value.subdomain_ids]
          : [],
        object_ids: Array.isArray(this.value?.object_ids)
          ? [...this.value.object_ids]
          : [],
      },

      domains: [],
      subdomains: [],
      objects: [],

      alert: {
        metric: this.alertValue?.metric || 'frequency',
        window_minutes: Number(this.alertValue?.window_minutes || 30),
        threshold_percent: Number(
          this.alertValue?.threshold_percent || 150
        ),
        min_volume: Number(this.alertValue?.min_volume || 10),
        cooldown_minutes: Number(
          this.alertValue?.cooldown_minutes || 120
        ),
        notify_channels: Array.isArray(
          this.alertValue?.notify_channels
        )
          ? [...this.alertValue.notify_channels]
          : ['in_app'],
      },

      metricOptions: [
        {
          value: 'frequency',
          text: 'จำนวน Mention',
        },
        {
          value: 'engagement',
          text: 'ยอด Engagement',
        },
        {
          value: 'both',
          text: 'ทั้ง Mention และ Engagement',
        },
      ],

      windowOptions: [
        {
          value: 15,
          text: '15 นาที',
        },
        {
          value: 30,
          text: '30 นาที',
        },
        {
          value: 60,
          text: '1 ชั่วโมง',
        },
      ],

      channelOptions: [
        {
          value: 'in_app',
          text: 'ในแอป',
        },
        {
          value: 'email',
          text: 'อีเมล',
        },
        {
          value: 'line',
          text: 'LINE',
        },
        {
          value: 'telegram',
          text: 'Telegram',
        },
        {
          value: 'webhook',
          text: 'Webhook',
        },
      ],
    }
  },

  computed: {
    isEdit() {
      return Boolean(this.value?._id)
    },

    canSave() {
      return Boolean(
        this.form.name &&
        this.form.search_query &&
        !this.saving
      )
    },

    searchGroups() {
      return parseGroups(this.form.search_query)
    },

    excludeGroups() {
      return parseGroups(this.form.exclude_query)
    },
  },

  async mounted() {
    await this.loadInitialData()
  },

  methods: {
    async loadInitialData() {
      try {
        this.domains = await mockApi.listDomains()

        if (this.domainSelection.domain_id) {
          await this.loadSubdomains(
            this.domainSelection.domain_id
          )
        }

        if (this.domainSelection.subdomain_ids.length) {
          await this.loadObjects(
            this.domainSelection.subdomain_ids
          )
        }

        if (
          this.form.config_mode === 'domain' &&
          this.domainSelection.object_ids.length
        ) {
          this.syncSearchQueryFromDomain()
        }
      } catch (error) {
        this.handleError(
          error,
          'ไม่สามารถโหลดข้อมูลเริ่มต้นได้'
        )
      }
    },

    setMode(mode) {
      if (this.form.config_mode === mode) {
        return
      }

      this.form.config_mode = mode

      if (mode === 'domain') {
        this.syncSearchQueryFromDomain()
      }
    },

    async onDomainChange() {
      this.domainSelection.subdomain_ids = []
      this.domainSelection.object_ids = []
      this.subdomains = []
      this.objects = []

      this.syncSearchQueryFromDomain()

      if (!this.domainSelection.domain_id) {
        return
      }

      await this.loadSubdomains(
        this.domainSelection.domain_id
      )
    },

    async onSubdomainChange() {
      this.domainSelection.object_ids = []
      this.objects = []

      this.syncSearchQueryFromDomain()

      if (!this.domainSelection.subdomain_ids.length) {
        return
      }

      await this.loadObjects(
        this.domainSelection.subdomain_ids
      )
    },

    async loadSubdomains(domainId) {
      this.loadingSubdomains = true

      try {
        this.subdomains =
          await mockApi.listSubdomains(domainId)
      } catch (error) {
        this.subdomains = []
        this.handleError(
          error,
          'ไม่สามารถโหลด Subdomain ได้'
        )
      } finally {
        this.loadingSubdomains = false
      }
    },

    async loadObjects(subdomainIds) {
      this.loadingObjects = true

      try {
        this.objects =
          await mockApi.listObjects(subdomainIds)
      } catch (error) {
        this.objects = []
        this.handleError(
          error,
          'ไม่สามารถโหลด Object ได้'
        )
      } finally {
        this.loadingObjects = false
      }
    },

    syncSearchQueryFromDomain() {
      if (this.form.config_mode !== 'domain') {
        return
      }

      const selectedObjectIds =
        this.domainSelection.object_ids || []

      const selectedObjectNames = this.objects
        .filter((object) =>
          selectedObjectIds.includes(object.object_id)
        )
        .map((object) => object.object_name)
        .filter(Boolean)

      this.form.search_query =
        selectedObjectNames.join(', ')
    },

    buildBagPayload() {
      const isDomainMode =
        this.form.config_mode === 'domain'

      return {
        name: this.form.name.trim(),
        description: this.form.description.trim(),
        search_query: this.form.search_query.trim(),
        exclude_query: this.form.exclude_query.trim(),
        enable_alert: this.form.enable_alert,
        config_mode: this.form.config_mode,
        domain_id: isDomainMode
          ? this.domainSelection.domain_id
          : null,
        subdomain_ids: isDomainMode
          ? [...this.domainSelection.subdomain_ids]
          : [],
        object_ids: isDomainMode
          ? [...this.domainSelection.object_ids]
          : [],
      }
    },

    buildAlertPayload() {
      return {
        metric: this.alert.metric,
        window_minutes: Number(
          this.alert.window_minutes
        ),
        threshold_percent: Number(
          this.alert.threshold_percent
        ),
        min_volume: Number(this.alert.min_volume),
        cooldown_minutes: Number(
          this.alert.cooldown_minutes
        ),
        notify_channels: [
          ...this.alert.notify_channels,
        ],
      }
    },

    async save() {
      if (!this.canSave) {
        return
      }

      this.saving = true

      try {
        const bagPayload = this.buildBagPayload()

        const bag = this.isEdit
          ? await mockApi.updateBag(
              this.value._id,
              bagPayload
            )
          : await mockApi.createBag(bagPayload)

        if (this.form.enable_alert) {
          await mockApi.updateAlertSettings(
            bag._id,
            this.buildAlertPayload()
          )
        }

        this.$emit('saved', {
          ...bag,
          enable_alert: this.form.enable_alert,
        })
      } catch (error) {
        this.handleError(
          error,
          'ไม่สามารถบันทึกถุงคำได้'
        )
      } finally {
        this.saving = false
      }
    },

    handleError(error, fallbackMessage) {
      console.error(error)

      const message =
        error?.response?.data?.message ||
        error?.message ||
        fallbackMessage

      if (this.$bvToast) {
        this.$bvToast.toast(message, {
          title: 'เกิดข้อผิดพลาด',
          variant: 'danger',
          solid: true,
        })
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
  background: linear-gradient(
    to right,
    #fed06e33,
    #f0cfda4d
  );
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

/* Body and sections */
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
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b6259;
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
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;
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
  line-height: 1.45;
}

.kf-mode-check {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #d9a441;
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

/* Transition */
.kf-fade-enter-active,
.kf-fade-leave-active {
  transition: opacity 0.15s ease;
}

.kf-fade-enter,
.kf-fade-leave-to {
  opacity: 0;
}

/* Query and preview */
.kf-query-block {
  margin-top: 4px;
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

/* Alert */
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

.kf-threshold-box {
  background: #fffaf0;
  border: 1px solid #f1dfb9;
  border-radius: 10px;
  padding: 14px;
}

.kf-threshold-help {
  font-size: 0.74rem;
  color: #9a8262;
  margin-top: 2px;
}

.kf-threshold-value {
  color: #d9a441;
  font-size: 1.15rem;
  font-weight: 700;
  white-space: nowrap;
}

.kf-range-labels {
  display: flex;
  justify-content: space-between;
  color: #a69a8c;
  font-size: 0.68rem;
  margin-top: -2px;
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

/* Responsive */
@media (max-width: 576px) {
  .kf-header,
  .kf-body,
  .kf-footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .kf-mode-grid {
    grid-template-columns: 1fr;
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
