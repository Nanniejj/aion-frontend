<template>
  <div class="ncs-wrap">
    <div class="ncs-head">
      <h6 class="ncs-title mb-1">เชื่อมต่อ LINE</h6>
      <p class="ncs-desc mb-0">
        สแกน QR Code เพื่อเปิดแชท LINE แล้วกด "ส่ง" ข้อความที่เตรียมไว้ให้เพื่อยืนยันตัวตน
      </p>
    </div>

    <div class="ncs-channel ncs-channel-block">
      <div class="ncs-channel-left">
        <div class="line-icon-box">
          <img
            width="28"
            height="28"
            src="https://img.icons8.com/fluency-systems-regular/48/06C755/line-me.png"
            alt="LINE"
          />
        </div>
        <div>
          <div class="ncs-channel-title">LINE</div>
          <div class="ncs-channel-desc">
            {{ lineConnected ? 'ยืนยันตัวตนแล้ว' : 'สแกน QR Code เพื่อยืนยันตัวตน' }}
          </div>
        </div>
      </div>

      <span class="ncs-status" :class="lineConnected ? 'connected' : 'disconnected'">
        <span class="ncs-status-dot"></span>
        {{ lineConnected ? 'เชื่อมต่อแล้ว' : 'ยังไม่ยืนยัน' }}
      </span>
    </div>

    <div class="ncs-content text-center">
      <template v-if="line.loading">
        <div class="ncs-loading">
          <b-spinner class="ncs-loading-spinner" />
          <div class="ncs-loading-text">กำลังตรวจสอบสถานะ...</div>
        </div>
      </template>

      <template v-else-if="!lineConnected">
        <template v-if="line.sessionStatus === 'expired' || line.sessionStatus === 'revoked'">
          <div class="qr-title">QR Code หมดอายุ</div>
          <div class="qr-desc">กรุณาขอ QR Code ใหม่อีกครั้ง</div>
          <b-button variant="outline-success" pill @click="createLineLinkSession">
            <b-icon icon="arrow-clockwise" class="mr-1" />สร้าง QR ใหม่
          </b-button>
        </template>

        <template v-else-if="line.session">
          <div class="qr-title">สแกน QR Code เพื่อเชื่อมต่อ LINE</div>
          <div class="qr-desc">
            เปิดแอป LINE สแกน QR Code นี้ ระบบจะเปิดแชทพร้อมข้อความยืนยันให้อัตโนมัติ —
            กด "ส่ง" ในแอป LINE เพื่อยืนยันตัวตน
          </div>

          <div class="line-qr-panel">
            <div class="qr-canvas-box">
              <canvas ref="qrCanvas" class="qr-image"></canvas>
            </div>

            <div v-if="line.qrError" class="qr-fallback-hint text-muted mt-2" style="font-size:0.72rem">
              แสดง QR Code ไม่สำเร็จ กรุณาใช้ปุ่มด้านล่างแทน หรือลองกด "สร้าง QR ใหม่"
            </div>

            <div class="mt-3 text-muted" style="font-size:0.72rem">
              หรือส่งข้อความนี้หา LINE OA ของเราด้วยตัวเอง:
            </div>
            <div class="mt-1 line-link-wrap">
              <button
                type="button"
                v-b-tooltip.hover="tooltipMessage"
                class="line-link-copy"
                @click="copyPrefilledMessage"
              >
                <b-icon icon="files" class="line-link-copy-icon" />
                <span class="line-link-copy-text">{{ line.session.prefilled_message }}</span>
              </button>
            </div>

            <div class="mt-3 text-muted" style="font-size:0.7rem">
              <b-spinner small class="mr-1" />กำลังรอการยืนยัน...
              <template v-if="expiresInLabel"> (หมดอายุใน {{ expiresInLabel }})</template>
            </div>
          </div>
        </template>
      </template>

      <template v-else>
     
        <div class="qr-title">  <b-icon icon="check-circle-fill"  variant="success" /> เชื่อมต่อ LINE สำเร็จ</div>

        <div class="line-account-card" v-if="line.account">
          <img
            v-if="line.account.pictureUrl"
            :src="line.account.pictureUrl"
            :alt="line.account.displayName"
            class="line-account-avatar"
          />
          <div v-else class="line-account-avatar line-account-avatar--placeholder">
            <b-icon icon="person-fill" />
          </div>

          <div class="line-account-info">
            <div class="line-account-name">{{ line.account.displayName || 'บัญชี LINE' }}</div>
            <div v-if="line.account.statusMessage" class="line-account-status">
              {{ line.account.statusMessage }}
            </div>
            <div v-if="linkedAtLabel" class="line-account-linked-at">
              เชื่อมต่อเมื่อ {{ linkedAtLabel }}
            </div>
          </div>

          <b-icon icon="check-circle-fill" class="line-account-check" />
        </div>

        <div class="qr-desc mb-2">ระบบบันทึกว่าบัญชีนี้ยืนยันตัวตนผ่าน LINE แล้ว</div>

        <b-button
          size="sm"
          variant="outline-danger"
          class="mt-1"
          :disabled="line.disconnecting"
          @click="disconnectLine"
        >
          <b-spinner v-if="line.disconnecting" small class="mr-1" />
          <b-icon v-else icon="link-45deg" class="mr-1" />ยกเลิกการเชื่อมต่อ
        </b-button>
      </template>
    </div>

    <b-alert v-if="line.error" show variant="danger" class="line-error mt-3 mb-0">
      {{ line.error }}
    </b-alert>
  </div>
</template>

<script>
import QRCode from 'qrcode'

export default {
  name: 'NotifyChannelSettingsLineGroup',

  props: {
    lineApiBase: {
      type: String,
      default: 'http://localhost:3000/api/v2/alert',
    },
  },

  data() {
    return {
      tooltipMessage: 'คลิกเพื่อคัดลอกข้อความ',
      pollTimer: null,
      nowTick: Date.now(),
      line: {
        loading: false,
        disconnecting: false,
        connected: false,
        error: '',
        qrError: false,
        session: null, // { session_id, deep_link, prefilled_message, expires_at }
        sessionStatus: '', // pending | linked | expired | revoked
        account: null, // { userId, displayName, pictureUrl, statusMessage, linking }
      },
    }
  },

  computed: {
    lineConnected() {
      return this.line.connected
    },

    expiresInLabel() {
      if (!this.line.session?.expires_at) return ''
      void this.nowTick
      const ms = new Date(this.line.session.expires_at).getTime() - Date.now()
      const sec = Math.max(0, Math.floor(ms / 1000))
      return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`
    },

    linkedAtLabel() {
      const linkedAt = this.line.account?.linking?.linked_at
      if (!linkedAt) return ''
      return new Date(linkedAt).toLocaleString('th-TH', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    },
  },

  mounted() {
    this.loadLineStatus()
  },

  beforeDestroy() {
    this.stopPolling()
  },

  methods: {
    getAuthHeaders() {
      return {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      }
    },

    async loadLineStatus() {
      if (this.line.loading) return
      this.line.loading = true
      this.line.error = ''

      try {
        const { data } = await this.axios.get(`${this.lineApiBase}/status`, {
          headers: this.getAuthHeaders(),
        })
        this.line.connected = Boolean(data.connected)
        this.line.account = data.line_user || null
        this.$emit('status', { line: this.line.connected })
      } catch (error) {
        this.line.error = this.extractError(error, 'ไม่สามารถตรวจสอบสถานะ LINE ได้')
        return
      } finally {
        this.line.loading = false
      }

      if (!this.line.connected) {
        await this.createLineLinkSession()
      }
    },

    async createLineLinkSession() {
      this.stopPolling()
      this.line.error = ''
      this.line.qrError = false
      this.line.session = null

      try {
        const { data } = await this.axios.post(
          `${this.lineApiBase}/link-session`,
          {},
          { headers: this.getAuthHeaders() }
        )
        this.line.session = data
        this.line.sessionStatus = data.status

        const deepLink =
          data.deep_link || data.deeplink || data.qr_url || data.link || ''

        if (!deepLink) {
          console.warn(
            'createLineLinkSession: response missing deep_link field. Got keys:',
            Object.keys(data || {})
          )
        }

        await this.renderQr(deepLink)
        this.startPolling(data.session_id)
      } catch (error) {
        if (error?.response?.status === 409) {
          this.line.connected = true
          this.line.account = error.response.data?.line_user || null
          this.$emit('status', { line: true })
          return
        }
        this.line.error = this.extractError(error, 'ไม่สามารถสร้าง QR Code ได้')
      }
    },

    async renderQr(deepLink) {
      if (!deepLink) {
        console.warn('renderQr: missing deepLink, skip drawing QR')
        return
      }

      let canvas = null
      for (let attempt = 0; attempt < 5; attempt++) {
        await this.$nextTick()
        canvas = this.$refs.qrCanvas
        if (canvas) break
        await new Promise((resolve) => setTimeout(resolve, 50))
      }

      if (!canvas) {
        console.warn('renderQr: canvas ref not available after retries')
        this.line.qrError = true
        return
      }

      QRCode.toCanvas(canvas, deepLink, { width: 300 }, (err) => {
        if (err) {
          console.error('QR render failed:', err)
          this.line.qrError = true
        } else {
          this.line.qrError = false
        }
      })
    },

    startPolling(sessionId) {
      this.pollTimer = setInterval(() => this.pollSession(sessionId), 3000)
    },

    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer)
        this.pollTimer = null
      }
    },

    async pollSession(sessionId) {
      this.nowTick = Date.now()

      try {
        const { data } = await this.axios.get(
          `${this.lineApiBase}/link-session/${sessionId}`,
          { headers: this.getAuthHeaders() }
        )
        this.line.sessionStatus = data.status

        if (data.status === 'linked') {
          this.stopPolling()
          this.line.connected = true
          this.line.account = data.line_user || null
          this.line.session = null
          this.$emit('status', { line: true })
        } else if (data.status === 'expired' || data.status === 'revoked') {
          this.stopPolling()
        }
      } catch (error) {
        console.error('poll link-session failed:', error)
      }
    },

    async copyPrefilledMessage() {
      const text = this.line.session?.prefilled_message || ''
      try {
        await navigator.clipboard.writeText(text)
        this.tooltipMessage = 'คัดลอกแล้ว'
        this.showToast('คัดลอกสำเร็จ', 'คัดลอกข้อความยืนยันแล้ว', 'success')
      } catch (error) {
        const input = document.createElement('textarea')
        input.value = text
        input.style.position = 'fixed'
        input.style.opacity = '0'
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
        this.tooltipMessage = 'คัดลอกแล้ว'
      }
    },

    async disconnectLine() {
      const confirmed = window.confirm('ต้องการยกเลิกการเชื่อมต่อ LINE หรือไม่?')
      if (!confirmed) return

      this.line.disconnecting = true
      this.line.error = ''

      try {
        await this.axios.delete(`${this.lineApiBase}/connection`, {
          headers: this.getAuthHeaders(),
        })
        this.line.connected = false
        this.line.account = null
        this.$emit('status', { line: false })
        await this.createLineLinkSession()
      } catch (error) {
        this.line.error = this.extractError(error, 'ไม่สามารถยกเลิกการเชื่อมต่อ LINE ได้')
      } finally {
        this.line.disconnecting = false
      }
    },

    extractError(error, fallbackMessage) {
      return error?.response?.data?.message || error?.message || fallbackMessage
    },

    showToast(title, message, variant) {
      if (!this.$bvToast) return
      this.$bvToast.toast(message, { title, variant, solid: true })
    },
  },
}
</script>

<style scoped>
.ncs-wrap {
  color: #2e2a26;
  max-width: 100%;
  margin: 0 auto;
}
.ncs-title {  font-weight: 600; font-size: 1rem; }
.ncs-desc { color: #8a8178; font-size: 0.82rem; }
.ncs-channel {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; padding: 12px 14px; border: 1px solid #dcefe2;
  border-radius: 12px; margin-top: 12px;
}
.ncs-channel-block { border-radius: 12px 12px 0 0; border-bottom: none; }
.ncs-channel-left { display: flex; align-items: center; gap: 10px; }
.line-icon-box {
  width: 38px; height: 38px; border-radius: 10px; background: #e6f7ec;
  display: flex; align-items: center; justify-content: center;
}
.ncs-channel-title { font-weight: 600; font-size: 0.88rem; }
.ncs-channel-desc { color: #8a8178; font-size: 0.74rem; }
.ncs-status {
  display: inline-flex; align-items: center; gap: 5px; padding: 4px 9px;
  border-radius: 999px; font-size: 0.7rem; font-weight: 600;
}
.ncs-status-dot { width: 6px; height: 6px; border-radius: 50%; }
.ncs-status.connected { color: #247348; background: #eaf6ef; }
.ncs-status.connected .ncs-status-dot { background: #06c755; }
.ncs-status.disconnected { color: #847a70; background: #f3efe9; }
.ncs-status.disconnected .ncs-status-dot { background: #a99f95; }
.ncs-content {
  border: 1px solid #dcefe2; border-top: none;
  border-radius: 0 0 12px 12px; padding: 24px 16px;
  position: relative;
  z-index: 1;
}

.ncs-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 300px;
}
.ncs-loading-spinner {
  width: 2rem;
  height: 2rem;
  color: #06c755;
  border-width: 0.2em;
}
.ncs-loading-text {
  font-size: 0.8rem;
  color: #8a8178;
}

.qr-title { font-weight: 700; font-size: 0.98rem; }
.qr-desc { max-width: 400px; margin: 5px auto 14px; color: #8a8178; font-size: 0.78rem; }

.line-qr-panel {
  max-width: 380px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #dcefe2;
  border-radius: 14px;
  background: #fff;
  position: relative;
  z-index: 2;
}

.qr-canvas-box {
  position: relative;
  z-index: 3;
  display: flex;
  justify-content: center;
}
.qr-image { width: 100%; max-width: 300px; height: auto; }
.qr-fallback-hint { line-height: 1.4; }

.line-link-wrap {
  display: flex;
  justify-content: center;
}
.line-link-copy {
  display: inline-flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  max-width: 100%;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #06c755;
  background: #fff;
  color: #06c755;
  cursor: pointer;
  text-align: left;
  white-space: normal;
  word-break: break-all;
  line-height: 1.4;
  font-size: 0.78rem;
  transition: background 0.15s ease;
}
.line-link-copy:hover { background: #eaf9f0; }
.line-link-copy:active { background: #d9f3e3; }
.line-link-copy-icon {
  flex-shrink: 0;
  margin-top: 2px;
}
.line-link-copy-text {
  min-width: 0;
  word-break: break-all;
}

.success-icon {
  width: 60px; height: 60px; margin: 0 auto 8px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%; background: #06c755; color: #fff; font-size: 2rem;
}

/* ---- การ์ดแสดงบัญชี LINE ที่เชื่อมต่อสำเร็จ ---- */
.line-account-card {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 420px;
  margin: 18px auto;
  padding: 18px 20px;
  border: 1px solid #dcefe2;
  border-radius: 16px;
  background: #f7fdf9;
  text-align: left;
}
.line-account-avatar {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 3px solid #fff;
  box-shadow: 0 0 0 2px #06c755;
}
.line-account-avatar--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e6f7ec;
  color: #06c755;
  font-size: 2.2rem;
}
.line-account-info { flex: 1; min-width: 0; }
.line-account-name {
  font-weight: 700;
  font-size: 1rem;
  color: #2e2a26;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.line-account-status {
  font-size: 0.8rem;
  color: #8a8178;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 2px;
}
.line-account-linked-at {
  font-size: 0.72rem;
  color: #a99f95;
  margin-top: 4px;
}
.line-account-check {
  color: #06c755;
  font-size: 1.4rem;
  flex-shrink: 0;
}

.line-error { font-size: 0.75rem; }

@media (max-width: 576px) {
  .ncs-wrap { max-width: 100%; }
  .ncs-channel { align-items: flex-start; }
  .line-qr-panel { padding: 14px; max-width: 100%; }
  .line-account-card {
    flex-direction: column;
    text-align: center;
    padding: 20px 16px;
  }
  .line-account-info { text-align: center; }
}
</style>