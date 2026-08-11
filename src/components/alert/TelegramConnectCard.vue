<template>
  <div class="tg-card" :class="cardStateClass">
    <!-- Ambient signature ring behind the logo -->
    <div class="tg-aura" aria-hidden="true"></div>

    <!-- Header -->
    <div class="tg-header">
      <div class="tg-brand">
        <div class="tg-logo">
          <b-icon icon="telegram" />
        </div>

        <div>
          <div class="tg-title">Telegram</div>
          <div class="tg-subtitle">
            รับ Spike Alert และข่าวสรุปจาก AI แบบทันที
          </div>
        </div>
      </div>

      <span class="tg-status" :class="statusClass">
        <span class="tg-status-dot"></span>
        {{ statusText }}
      </span>
    </div>

    <transition name="tg-swap" mode="out-in">
      <!-- Loading initial status -->
      <div v-if="loadingStatus" key="loading" class="tg-loading">
        <div class="tg-skel tg-skel-avatar"></div>
        <div class="tg-skel-lines">
          <div class="tg-skel tg-skel-line tg-skel-line-lg"></div>
          <div class="tg-skel tg-skel-line tg-skel-line-sm"></div>
        </div>
      </div>

      <!-- Connected -->
      <div v-else-if="isConnected" key="connected" class="tg-connected">
        <div class="tg-user">
          <div class="tg-avatar-ring">
            <div class="tg-avatar">
              {{ avatarText }}
            </div>
          </div>

          <div class="tg-user-info">
            <div class="tg-user-name">
              {{ displayName }}
            </div>

            <div class="tg-username">
              <template v-if="telegramUser.username">
                @{{ telegramUser.username }}
              </template>

              <template v-else>
                Telegram ID: {{ telegramUser.telegram_user_id }}
              </template>
            </div>
          </div>

          <b-icon icon="check-circle-fill" class="tg-check" />
        </div>

        <div class="tg-connected-actions">
          <b-button
            variant="outline-primary"
            size="sm"
            class="tg-open-btn"
            @click="openBotChat"
          >
            <b-icon icon="chat-dots" class="mr-1" />
            เปิดแชต
          </b-button>

          <b-button
            variant="outline-danger"
            size="sm"
            class="tg-disconnect-btn"
            :disabled="disconnecting"
            @click="disconnect"
          >
            <b-spinner v-if="disconnecting" small class="mr-1" />
            <b-icon v-else icon="link-45deg" class="mr-1" />
            ยกเลิกการเชื่อมต่อ
          </b-button>
        </div>

        <label class="tg-notification-toggle">
          <div>
            <div class="tg-toggle-title">
              รับการแจ้งเตือนผ่าน Telegram
            </div>

            <div class="tg-toggle-desc">
              เปิดหรือปิดช่องทางนี้โดยไม่ต้องยกเลิกการเชื่อมต่อ
            </div>
          </div>

          <b-form-checkbox
            :checked="notificationEnabled"
            switch
            size="lg"
            @change="updateNotification"
          />
        </label>
      </div>

      <!-- Waiting for /start -->
      <div v-else-if="linking" key="linking" class="tg-linking">
        <div
          class="tg-ring"
          :style="{ '--progress': linkProgressPercent + '%' }"
        >
          <div class="tg-ring-inner">
            <b-icon icon="telegram" />
          </div>
        </div>

        <div class="tg-linking-title">
          รอการยืนยันจาก Telegram
        </div>

        <p class="tg-linking-desc">
          เปิดแชตกับ Bot แล้วกด
          <strong>Start</strong>
          ระบบจะเชื่อมต่อบัญชีให้อัตโนมัติ
        </p>

        <div class="tg-linking-actions">
          <b-button
            variant="primary"
            class="tg-primary-btn"
            @click="openCurrentLink"
          >
            <b-icon icon="telegram" class="mr-1" />
            เปิด Telegram อีกครั้ง
          </b-button>

          <b-button
            variant="link"
            class="tg-cancel-link"
            @click="cancelLinking"
          >
            ยกเลิก
          </b-button>
        </div>

        <div class="tg-expire">
          ลิงก์จะหมดอายุใน
          <strong>{{ remainingTimeText }}</strong>
        </div>
      </div>

      <!-- Not connected -->
      <div v-else key="disconnected">
        <!-- Selection -->
        <div v-if="step === 'choose'" class="tg-choice">
          <div class="tg-intro">
            เลือกสถานะการใช้งาน Telegram ของคุณ
          </div>

          <button
            type="button"
            class="tg-option"
            @click="selectExistingUser"
          >
            <div class="tg-option-icon is-user">
              <b-icon icon="person-check" />
            </div>

            <div class="tg-option-body">
              <div class="tg-option-title">
                ฉันมี Telegram อยู่แล้ว
              </div>

              <div class="tg-option-desc">
                เปิดแชตกับ Bot และกด Start เพื่อเชื่อมต่อ
              </div>
            </div>

            <b-icon icon="chevron-right" class="tg-arrow" />
          </button>

          <button
            type="button"
            class="tg-option"
            @click="step = 'install'"
          >
            <div class="tg-option-icon is-download">
              <b-icon icon="download" />
            </div>

            <div class="tg-option-body">
              <div class="tg-option-title">
                ฉันยังไม่มี Telegram
              </div>

              <div class="tg-option-desc">
                ดาวน์โหลดและสมัคร Telegram ก่อนเชื่อมต่อ
              </div>
            </div>

            <b-icon icon="chevron-right" class="tg-arrow" />
          </button>
        </div>

        <!-- Install Telegram -->
        <div v-else-if="step === 'install'" class="tg-install">
          <button type="button" class="tg-back" @click="step = 'choose'">
            <b-icon icon="arrow-left" class="mr-1" />
            ย้อนกลับ
          </button>

          <div class="tg-install-head">
            <div class="tg-install-icon">
              <b-icon icon="phone" />
            </div>

            <div>
              <div class="tg-install-title">
                ติดตั้ง Telegram ก่อน
              </div>

              <div class="tg-install-desc">
                ดาวน์โหลดแอป สมัครบัญชี แล้วกลับมาหน้านี้
              </div>
            </div>
          </div>

          <div class="tg-download-grid">
            <a
              :href="downloadLinks.ios"
              target="_blank"
              rel="noopener noreferrer"
              class="tg-download-btn"
            >
              <b-icon icon="apple" />
              <span>
                <small>ดาวน์โหลดบน</small>
                App Store
              </span>
            </a>

            <a
              :href="downloadLinks.android"
              target="_blank"
              rel="noopener noreferrer"
              class="tg-download-btn"
            >
              <b-icon icon="google" />
              <span>
                <small>ดาวน์โหลดบน</small>
                Google Play
              </span>
            </a>

            <a
              :href="downloadLinks.desktop"
              target="_blank"
              rel="noopener noreferrer"
              class="tg-download-btn"
            >
              <b-icon icon="laptop" />
              <span>
                <small>ดาวน์โหลดสำหรับ</small>
                Desktop
              </span>
            </a>

            <a
              :href="downloadLinks.web"
              target="_blank"
              rel="noopener noreferrer"
              class="tg-download-btn"
            >
              <b-icon icon="globe" />
              <span>
                <small>เปิดผ่าน</small>
                Telegram Web
              </span>
            </a>
          </div>

          <div class="tg-install-note">
            <b-icon icon="info-circle" class="mr-1" />
            เมื่อติดตั้งและสมัครเสร็จแล้ว ให้กดปุ่มด้านล่าง
          </div>

          <b-button
            block
            variant="primary"
            class="tg-primary-btn"
            :disabled="creatingSession"
            @click="selectExistingUser"
          >
            <b-spinner v-if="creatingSession" small class="mr-1" />
            <b-icon v-else icon="telegram" class="mr-1" />
            ติดตั้งแล้ว เชื่อมต่อ Telegram
          </b-button>
        </div>

        <!-- Error -->
        <b-alert
          v-if="error"
          show
          variant="danger"
          class="tg-error mt-3 mb-0"
        >
          {{ error }}

          <button type="button" class="tg-error-retry" @click="retry">
            ลองใหม่
          </button>
        </b-alert>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'TelegramConnectCard',

  props: {
    /*
      Bot username ไม่ต้องใส่ @
      ตัวอย่าง AionAlertBot
    */
    botUsername: {
      type: String,
      required: true,
    },

    /*
      รองรับการส่งค่าจาก Parent
      ในกรณีโหลด Telegram status มาพร้อมหน้าแล้ว
    */
    value: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      telegramUser: this.value || null,
      loadingStatus: false,
      creatingSession: false,
      disconnecting: false,
      linking: false,
      step: 'choose',
      error: '',

      linkSession: null,
      pollingTimer: null,
      countdownTimer: null,
      remainingSeconds: 0,
      expiresTotalSeconds: 0,

      downloadLinks: {
        ios: 'https://telegram.org/dl/ios',
        android: 'https://telegram.org/dl/android',
        desktop: 'https://desktop.telegram.org/',
        web: 'https://web.telegram.org/',
      },
    }
  },

  computed: {
    isConnected() {
      return Boolean(
        this.telegramUser &&
        this.telegramUser.linking &&
        this.telegramUser.linking.status === 'linked' &&
        this.telegramUser.is_active !== false
      )
    },

    notificationEnabled() {
      return this.telegramUser?.notification_enabled !== false
    },

    displayName() {
      if (!this.telegramUser) return ''

      const name = [
        this.telegramUser.first_name,
        this.telegramUser.last_name,
      ]
        .filter(Boolean)
        .join(' ')
        .trim()

      return (
        name ||
        this.telegramUser.username ||
        'ผู้ใช้ Telegram'
      )
    },

    avatarText() {
      const text =
        this.telegramUser?.first_name ||
        this.telegramUser?.username ||
        'T'

      return text.charAt(0).toUpperCase()
    },

    statusText() {
      if (this.loadingStatus) return 'กำลังตรวจสอบ'
      if (this.isConnected) return 'เชื่อมต่อแล้ว'
      if (this.linking) return 'รอยืนยัน'
      return 'ยังไม่เชื่อมต่อ'
    },

    statusClass() {
      return {
        'is-connected': this.isConnected,
        'is-waiting': this.linking,
        'is-disconnected':
          !this.isConnected && !this.linking,
      }
    },

    cardStateClass() {
      return {
        'is-connected': this.isConnected,
        'is-linking': this.linking,
      }
    },

    remainingTimeText() {
      const minutes = Math.floor(
        this.remainingSeconds / 60
      )

      const seconds = this.remainingSeconds % 60

      return `${String(minutes).padStart(2, '0')}:${String(
        seconds
      ).padStart(2, '0')}`
    },

    linkProgressPercent() {
      if (!this.expiresTotalSeconds) return 0

      return Math.max(
        0,
        Math.min(
          100,
          (this.remainingSeconds / this.expiresTotalSeconds) * 100
        )
      )
    },
  },

  watch: {
    value: {
      deep: true,
      handler(value) {
        this.telegramUser = value
      },
    },
  },

  async mounted() {
    if (!this.value) {
      await this.loadStatus()
    }
  },

  beforeDestroy() {
    this.stopPolling()
    this.stopCountdown()
  },

  methods: {
    async loadStatus() {
      this.loadingStatus = true
      this.error = ''

      try {
        /*
          ตัวอย่าง response:

          {
            connected: true,
            telegram_user: {
              _id: "...",
              telegram_user_id: "123456789",
              username: "somchai",
              first_name: "Somchai",
              last_name: "",
              notification_enabled: true,
              is_active: true,
              linking: {
                status: "linked",
                linked_at: "..."
              }
            }
          }
        */
        const response = await this.$axios.$get(
          '/api/alert/telegram/status'
        )

        this.telegramUser = response.connected
          ? response.telegram_user
          : null

        this.emitChange()
      } catch (error) {
        this.handleError(
          error,
          'ไม่สามารถตรวจสอบสถานะ Telegram ได้'
        )
      } finally {
        this.loadingStatus = false
      }
    },

    async selectExistingUser() {
      if (this.creatingSession) return

      this.creatingSession = true
      this.error = ''

      try {
        /*
          Backend ต้องสร้าง token แบบ:
          - ใช้ได้ครั้งเดียว
          - ผูกกับ user_id ปัจจุบัน
          - เก็บเฉพาะ token hash
          - หมดอายุภายใน 5–10 นาที

          response:
          {
            session_id: "...",
            start_token: "abc123",
            expires_at: "2026-07-31T08:00:00.000Z"
          }
        */
        const session = await this.$axios.$post(
          '/api/alert/telegram/link-session'
        )

        this.linkSession = session
        this.linking = true

        this.startCountdown(session.expires_at)
        this.startPolling()
        this.openCurrentLink()
      } catch (error) {
        this.handleError(
          error,
          'ไม่สามารถสร้างลิงก์เชื่อมต่อ Telegram ได้'
        )
      } finally {
        this.creatingSession = false
      }
    },

    openCurrentLink() {
      const token = this.linkSession?.start_token

      if (!token) {
        this.error =
          'ไม่พบรหัสเชื่อมต่อ กรุณาสร้างลิงก์ใหม่'
        return
      }

      const username = this.botUsername.replace('@', '')

      const url =
        `https://t.me/${encodeURIComponent(username)}` +
        `?start=${encodeURIComponent(token)}`

      /*
        ใช้ location.href เหมาะกับมือถือ เพราะช่วยเปิด
        Telegram app ผ่าน universal link ได้
      */
      window.location.href = url
    },

    openBotChat() {
      const username = this.botUsername.replace('@', '')

      window.open(
        `https://t.me/${encodeURIComponent(username)}`,
        '_blank',
        'noopener,noreferrer'
      )
    },

    startPolling() {
      this.stopPolling()

      /*
        ตรวจทันทีหนึ่งครั้งก่อนเริ่ม interval
      */
      this.checkLinkStatus()

      this.pollingTimer = window.setInterval(() => {
        this.checkLinkStatus()
      }, 3000)
    },

    stopPolling() {
      if (this.pollingTimer) {
        window.clearInterval(this.pollingTimer)
        this.pollingTimer = null
      }
    },

    async checkLinkStatus() {
      const sessionId = this.linkSession?.session_id

      if (!sessionId) return

      try {
        /*
          response ระหว่างรอ:
          {
            status: "pending"
          }

          response เมื่อสำเร็จ:
          {
            status: "linked",
            telegram_user: {...}
          }

          response เมื่อหมดอายุ:
          {
            status: "expired"
          }
        */
        const response = await this.$axios.$get(
          `/api/alert/telegram/link-session/${sessionId}`
        )

        if (response.status === 'linked') {
          this.telegramUser = response.telegram_user
          this.linking = false
          this.linkSession = null

          this.stopPolling()
          this.stopCountdown()
          this.emitChange()

          this.showToast(
            'เชื่อมต่อ Telegram สำเร็จ',
            'ตอนนี้คุณสามารถรับ Spike Alert ผ่าน Telegram ได้แล้ว',
            'success'
          )
        }

        if (
          response.status === 'expired' ||
          response.status === 'revoked'
        ) {
          this.expireSession()
        }
      } catch (error) {
        /*
          Polling error ชั่วคราวไม่ควรหยุด flow ทันที
          แต่แสดงข้อความเมื่อเกิดซ้ำควรจัดการที่ backend
        */
        console.error(
          'Telegram link status error:',
          error
        )
      }
    },

    startCountdown(expiresAt) {
      this.stopCountdown()

      const updateRemaining = () => {
        const expires = new Date(expiresAt).getTime()
        const now = Date.now()

        this.remainingSeconds = Math.max(
          0,
          Math.floor((expires - now) / 1000)
        )

        if (this.remainingSeconds <= 0) {
          this.expireSession()
        }
      }

      updateRemaining()
      this.expiresTotalSeconds = this.remainingSeconds || 1

      this.countdownTimer = window.setInterval(
        updateRemaining,
        1000
      )
    },

    stopCountdown() {
      if (this.countdownTimer) {
        window.clearInterval(this.countdownTimer)
        this.countdownTimer = null
      }
    },

    expireSession() {
      this.stopPolling()
      this.stopCountdown()

      this.linking = false
      this.linkSession = null
      this.expiresTotalSeconds = 0
      this.error =
        'ลิงก์เชื่อมต่อหมดอายุ กรุณาสร้างลิงก์ใหม่'
    },

    cancelLinking() {
      this.stopPolling()
      this.stopCountdown()

      this.linking = false
      this.linkSession = null
      this.remainingSeconds = 0
      this.expiresTotalSeconds = 0
      this.step = 'choose'
    },

    async disconnect() {
      if (this.disconnecting) return

      const confirmed = await this.confirmDisconnect()

      if (!confirmed) return

      this.disconnecting = true
      this.error = ''

      try {
        await this.$axios.$delete(
          '/api/alert/telegram/connection'
        )

        this.telegramUser = null
        this.step = 'choose'
        this.emitChange()

        this.showToast(
          'ยกเลิกการเชื่อมต่อแล้ว',
          'ระบบจะไม่ส่งการแจ้งเตือนผ่าน Telegram',
          'success'
        )
      } catch (error) {
        this.handleError(
          error,
          'ไม่สามารถยกเลิกการเชื่อมต่อได้'
        )
      } finally {
        this.disconnecting = false
      }
    },

    async updateNotification(enabled) {
      const previous =
        this.telegramUser.notification_enabled

      this.telegramUser.notification_enabled = enabled

      try {
        await this.$axios.$patch(
          '/api/alert/telegram/preferences',
          {
            notification_enabled: enabled,
          }
        )

        this.emitChange()
      } catch (error) {
        this.telegramUser.notification_enabled = previous

        this.handleError(
          error,
          'ไม่สามารถปรับการแจ้งเตือนได้'
        )
      }
    },

    retry() {
      this.error = ''
      this.selectExistingUser()
    },

    confirmDisconnect() {
      if (this.$bvModal) {
        return this.$bvModal.msgBoxConfirm(
          'คุณจะไม่ได้รับ Spike Alert ผ่าน Telegram จนกว่าจะเชื่อมต่อใหม่',
          {
            title: 'ยกเลิกการเชื่อมต่อ Telegram?',
            okTitle: 'ยกเลิกการเชื่อมต่อ',
            cancelTitle: 'ไม่ยกเลิก',
            okVariant: 'danger',
            cancelVariant: 'outline-secondary',
            centered: true,
          }
        )
      }

      return Promise.resolve(
        window.confirm(
          'ต้องการยกเลิกการเชื่อมต่อ Telegram หรือไม่?'
        )
      )
    },

    emitChange() {
      this.$emit('input', this.telegramUser)

      this.$emit('change', {
        connected: this.isConnected,
        notification_enabled:
          this.telegramUser?.notification_enabled === true,
        telegram_user: this.telegramUser,
      })
    },

    handleError(error, fallbackMessage) {
      console.error(error)

      this.error =
        error?.response?.data?.message ||
        error?.message ||
        fallbackMessage
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
.tg-card {
  --tg-accent: #229ed9;
  --tg-accent-deep: #0f7fbd;
  --tg-accent-soft: #eaf6fd;
  --tg-ink: #16212c;
  --tg-muted: #767f88;
  --tg-canvas: #fbfcfe;
  --tg-border: #e7ecf1;
  --tg-success: #1fa971;
  --tg-success-soft: #eafbf3;

  position: relative;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid var(--tg-border);
  background: var(--tg-canvas);
  border-radius: 18px;
  padding: 20px;
  font-family: 'Prompt', sans-serif;
  color: var(--tg-ink);
  transition: border-color 0.25s ease, box-shadow 0.25s ease,
    background 0.25s ease;
  box-shadow: 0 1px 2px rgba(22, 33, 44, 0.04);
}

.tg-card.is-connected {
  border-color: #c3e8d5;
  background: linear-gradient(180deg, #ffffff 0%, #f6fcf9 100%);
  box-shadow: 0 14px 32px -18px rgba(31, 169, 113, 0.35);
}

.tg-card.is-linking {
  border-color: #bfe2f2;
  background: linear-gradient(180deg, #ffffff 0%, #f4fbfe 100%);
  box-shadow: 0 14px 32px -18px rgba(34, 158, 217, 0.4);
}

/* Ambient aura behind the logo — the card's one signature flourish */
.tg-aura {
  position: absolute;
  top: -60px;
  right: -60px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(34, 158, 217, 0.16),
    rgba(34, 158, 217, 0) 70%
  );
  pointer-events: none;
  z-index: 0;
  transition: opacity 0.3s ease;
}

.tg-card.is-connected .tg-aura {
  background: radial-gradient(
    circle at 30% 30%,
    rgba(31, 169, 113, 0.16),
    rgba(31, 169, 113, 0) 70%
  );
}

/* Header */
.tg-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 16px;
  margin-bottom: 4px;
  border-bottom: 1px solid var(--tg-border);
}

.tg-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.tg-logo {
  width: 44px;
  height: 44px;
  border-radius: 13px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: #fff;
  background: linear-gradient(145deg, #37b1ea, var(--tg-accent-deep));
  box-shadow: 0 6px 16px -6px rgba(15, 127, 189, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.tg-title {
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.01em;
}

.tg-subtitle {
  color: var(--tg-muted);
  font-size: 0.76rem;
  margin-top: 2px;
}

.tg-status {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 5px 11px 5px 9px;
  border-radius: 999px;
  border: 1px solid transparent;
}

.tg-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.tg-status.is-connected {
  color: var(--tg-success);
  background: var(--tg-success-soft);
  border-color: #d4f0e2;
}

.tg-status.is-connected .tg-status-dot {
  background: var(--tg-success);
}

.tg-status.is-waiting {
  color: var(--tg-accent-deep);
  background: var(--tg-accent-soft);
  border-color: #cfeaf8;
}

.tg-status.is-waiting .tg-status-dot {
  background: var(--tg-accent);
  animation: tg-pulse 1.8s infinite;
}

.tg-status.is-disconnected {
  color: var(--tg-muted);
  background: #f1f3f5;
  border-color: #e7ecf1;
}

.tg-status.is-disconnected .tg-status-dot {
  background: #b7bfc7;
}

/* Loading skeleton */
.tg-loading {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 2px 4px;
}

.tg-skel {
  border-radius: 8px;
  background: linear-gradient(
    100deg,
    #edf1f4 30%,
    #f8fafb 50%,
    #edf1f4 70%
  );
  background-size: 200% 100%;
  animation: tg-shimmer 1.4s ease-in-out infinite;
}

.tg-skel-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.tg-skel-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tg-skel-line {
  height: 10px;
}

.tg-skel-line-lg {
  width: 55%;
}

.tg-skel-line-sm {
  width: 35%;
}

@keyframes tg-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Choice cards */
.tg-choice {
  position: relative;
  z-index: 1;
  padding-top: 18px;
}

.tg-intro {
  color: var(--tg-muted);
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 11px;
}

.tg-option {
  display: flex;
  align-items: center;
  gap: 13px;
  width: 100%;
  border: 1px solid var(--tg-border);
  background: #fff;
  border-radius: 13px;
  padding: 13px 14px;
  text-align: left;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.tg-option + .tg-option {
  margin-top: 9px;
}

.tg-option:hover {
  transform: translateY(-1px);
  border-color: #a9d9ef;
  box-shadow: 0 10px 22px -14px rgba(22, 33, 44, 0.25);
}

.tg-option:active {
  transform: translateY(0);
}

.tg-option:focus-visible {
  outline: 2px solid var(--tg-accent);
  outline-offset: 2px;
}

.tg-option-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.02rem;
}

.tg-option-icon.is-user {
  color: var(--tg-accent-deep);
  background: var(--tg-accent-soft);
}

.tg-option-icon.is-download {
  color: #a5711c;
  background: #fdf2dc;
}

.tg-option-body {
  flex: 1;
  min-width: 0;
}

.tg-option-title {
  font-size: 0.86rem;
  font-weight: 600;
}

.tg-option-desc {
  color: var(--tg-muted);
  font-size: 0.74rem;
  margin-top: 2px;
}

.tg-arrow {
  color: #c3cbd2;
  flex-shrink: 0;
}

/* Install */
.tg-install {
  position: relative;
  z-index: 1;
  padding-top: 15px;
}

.tg-back {
  display: inline-flex;
  align-items: center;
  border: none;
  background: transparent;
  color: var(--tg-muted);
  padding: 0;
  font-size: 0.78rem;
  margin-bottom: 15px;
  cursor: pointer;
}

.tg-back:hover {
  color: var(--tg-ink);
}

.tg-install-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.tg-install-icon {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  color: var(--tg-accent-deep);
  background: var(--tg-accent-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tg-install-title {
  font-size: 0.9rem;
  font-weight: 600;
}

.tg-install-desc {
  font-size: 0.75rem;
  color: var(--tg-muted);
}

.tg-download-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.tg-download-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  color: var(--tg-ink);
  background: #fff;
  border: 1px solid var(--tg-border);
  border-radius: 11px;
  padding: 9px 12px;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
  transition: border-color 0.15s ease, color 0.15s ease,
    transform 0.15s ease;
}

.tg-download-btn:hover {
  border-color: #a9d9ef;
  color: var(--tg-accent-deep);
  text-decoration: none;
  transform: translateY(-1px);
}

.tg-download-btn small {
  display: block;
  color: #9aa2a9;
  font-size: 0.63rem;
  font-weight: 400;
}

.tg-install-note {
  display: flex;
  align-items: center;
  margin: 13px 0;
  border-radius: 10px;
  padding: 10px 11px;
  background: var(--tg-accent-soft);
  color: #3a6d87;
  font-size: 0.74rem;
}

/* Linking — signature circular progress ring */
.tg-linking {
  position: relative;
  z-index: 1;
  padding: 20px 8px 4px;
  text-align: center;
}

.tg-ring {
  --progress: 0%;
  width: 68px;
  height: 68px;
  margin: 0 auto 14px;
  border-radius: 50%;
  padding: 4px;
  background: conic-gradient(
    var(--tg-accent) var(--progress),
    #e3ecf2 0
  );
  transition: background 0.6s linear;
}

.tg-ring-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--tg-accent);
  font-size: 1.35rem;
  box-shadow: inset 0 0 0 1px rgba(34, 158, 217, 0.08);
  animation: tg-breathe 2.4s ease-in-out infinite;
}

.tg-linking-title {
  font-size: 0.94rem;
  font-weight: 700;
}

.tg-linking-desc {
  max-width: 420px;
  margin: 6px auto 14px;
  color: var(--tg-muted);
  font-size: 0.78rem;
  line-height: 1.55;
}

.tg-linking-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.tg-expire {
  margin-top: 12px;
  color: #9aa2a9;
  font-size: 0.7rem;
}

.tg-cancel-link {
  color: var(--tg-muted);
  font-size: 0.78rem;
}

/* Connected */
.tg-connected {
  position: relative;
  z-index: 1;
  padding-top: 17px;
}

.tg-user {
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 13px;
  background: #fff;
  border: 1px solid #d8ecdf;
  padding: 12px;
}

.tg-avatar-ring {
  padding: 2px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--tg-success), #9be0c1);
  flex-shrink: 0;
}

.tg-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #fff;
  color: var(--tg-success);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.95rem;
}

.tg-user-info {
  flex: 1;
  min-width: 0;
}

.tg-user-name {
  font-size: 0.88rem;
  font-weight: 600;
}

.tg-username {
  color: #83898f;
  font-size: 0.73rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tg-check {
  color: var(--tg-success);
  font-size: 1.1rem;
  flex-shrink: 0;
}

.tg-connected-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.tg-open-btn {
  color: var(--tg-accent-deep);
  border-color: #a9d9ef;
}

.tg-disconnect-btn {
  transition: background 0.15s ease;
}

.tg-notification-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 13px 0 0;
  background: #fff;
  border: 1px solid var(--tg-border);
  border-radius: 12px;
  padding: 12px 13px;
  cursor: pointer;
}

.tg-toggle-title {
  font-size: 0.8rem;
  font-weight: 600;
}

.tg-toggle-desc {
  color: var(--tg-muted);
  font-size: 0.69rem;
  margin-top: 2px;
}

/* Shared buttons */
.tg-primary-btn {
  background: var(--tg-accent);
  border-color: var(--tg-accent);
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 600;
  box-shadow: 0 8px 18px -8px rgba(34, 158, 217, 0.55);
}

.tg-primary-btn:hover {
  background: var(--tg-accent-deep);
  border-color: var(--tg-accent-deep);
}

.tg-error {
  font-size: 0.76rem;
  border-radius: 10px;
}

.tg-error-retry {
  border: none;
  background: transparent;
  color: inherit;
  text-decoration: underline;
  font-weight: 600;
  margin-left: 4px;
  cursor: pointer;
}

/* State transition */
.tg-swap-enter-active,
.tg-swap-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.tg-swap-enter {
  opacity: 0;
  transform: translateY(4px);
}

.tg-swap-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@keyframes tg-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 158, 217, 0.55);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(34, 158, 217, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 158, 217, 0);
  }
}

@keyframes tg-breathe {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}

@media (prefers-reduced-motion: reduce) {
  .tg-status.is-waiting .tg-status-dot,
  .tg-ring-inner,
  .tg-skel {
    animation: none;
  }
}

@media (max-width: 576px) {
  .tg-header {
    flex-direction: column;
  }

  .tg-download-grid {
    grid-template-columns: 1fr;
  }

  .tg-connected-actions {
    flex-direction: column;
  }

  .tg-connected-actions .btn {
    width: 100%;
  }

  .tg-linking-actions {
    flex-direction: column;
  }

  .tg-linking-actions .btn {
    width: 100%;
  }
}
</style>