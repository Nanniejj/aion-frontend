<template>
  <button
    :disabled="busy || disabled"
    :class="btnClass || 'px-3 py-2 rounded border border-gray-300 bg-gray-50 cursor-pointer'"
    @click="captureAndDownload"
  >
    <slot>{{ busy ? loadingText : (btnText || 'แคป & ดาวน์โหลด') }}</slot>
  </button>
</template>

<script>
import html2canvas from 'html2canvas'

export default {
  name: 'SnapshotButton',
  props: {
    // เลือกอย่างใดอย่างหนึ่ง: getTargetEl() หรือ selector
    getTargetEl: { type: Function, required: false },
    selector: { type: String, required: false },

    filenamePrefix: { type: String, default: 'timeline-snapshot' },
    format: {
      type: String,
      default: 'png', // 'png' | 'jpeg'
      validator: v => ['png','jpeg','jpg'].includes(v)
    },
    quality: { type: Number, default: 0.92 },     // ใช้กับ jpeg เท่านั้น
    scale: { type: Number, default: null },       // null = ใช้ DPR หรือ 2
    useCORS: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    btnText: { type: String, default: '' },
    loadingText: { type: String, default: 'กำลังแคป...' },
    html2canvasOptions: { type: Object, default: () => ({}) }, // เผื่อส่งออปชันเพิ่ม
  },
  data() {
    return { busy: false }
  },
  methods: {
     // --- เพิ่มเมธอดนี้ ---
    async waitForAssets(rootEl, { useCORS = true, timeoutMs = 10000 } = {}) {
      const promises = []

      // 1) <img> ปกติ (+ รองรับ lazy / data-src)
      const imgs = Array.from(rootEl.querySelectorAll('img'))
      for (const img of imgs) {
        // แก้เคส lazy
        if (img.dataset && (img.dataset.src || img.dataset.lazySrc)) {
          img.src = img.dataset.src || img.dataset.lazySrc
        }
        if (img.getAttribute('loading') === 'lazy') {
          img.setAttribute('loading', 'eager')
        }
        // ตั้ง CORS ถ้าต้องใช้
        if (useCORS && !img.crossOrigin) {
          try { img.crossOrigin = 'anonymous' } catch (e) {}
        }

        // ถ้าโหลดแล้วก็ข้าม
        if (img.complete && img.naturalWidth > 0) continue

        // ใช้ decode() ถ้ามี (แม่นกว่า onload)
        if (typeof img.decode === 'function') {
          promises.push(img.decode().catch(() => undefined))
        } else {
          promises.push(new Promise(res => {
            img.onload = img.onerror = () => res()
          }))
        }
      }

      // 2) background-image ในสไตล์
      const urlRegex = /url\((?:'|")?([^"')]+)(?:'|")?\)/g
      const bgUrls = new Set()
      const allEls = Array.from(rootEl.querySelectorAll('*'))
      allEls.push(rootEl)
      for (const el of allEls) {
        const style = window.getComputedStyle(el)
        const props = ['backgroundImage', 'listStyleImage', 'content']
        for (const p of props) {
          const v = style[p]
          if (!v || v === 'none') continue
          let m
          while ((m = urlRegex.exec(v)) !== null) {
            const url = m[1]
            // ข้าม data: และ blob:
            if (url.startsWith('data:') || url.startsWith('blob:')) continue
            bgUrls.add(url)
          }
        }
      }
      for (const url of bgUrls) {
        promises.push(new Promise(res => {
          const im = new Image()
          if (useCORS) im.crossOrigin = 'anonymous'
          im.onload = im.onerror = () => res()
          im.src = url
        }))
      }

      // 3) ฟอนต์เว็บ
      if (document.fonts && typeof document.fonts.ready?.then === 'function') {
        promises.push(document.fonts.ready.catch(() => undefined))
      }

      // ป้องกันค้าง: ตั้ง timeout รวม
      const timeout = new Promise(res => setTimeout(res, timeoutMs))
      await Promise.race([Promise.all(promises), timeout])
    },



    async captureAndDownload() {
      if (this.busy || this.disabled) return
      this.busy = true
      this.$emit('start')
      try {
        const targetEl = this.resolveTarget()
        if (!targetEl) throw new Error('ไม่พบ element เป้าหมายสำหรับการแคป')

        // 👉 รอให้รูป/แบ็คกราวด์/ฟอนต์โหลดก่อน
        await this.waitForAssets(targetEl, { useCORS: this.useCORS, timeoutMs: 12000 })

        // เก็บ scroll แล้วเลื่อนขึ้นบนสุดเพื่อกันหลุดเฟรม
        const prevX = window.scrollX, prevY = window.scrollY
        window.scrollTo(0, 0)

        const canvas = await html2canvas(targetEl, {
          backgroundColor: '#ffffff',
          scale: this.scale || Math.max(2, window.devicePixelRatio || 1),
          useCORS: this.useCORS,
          allowTaint: false,
          logging: false,
          scrollX: 0,
          scrollY: -window.scrollY,
          windowWidth: document.documentElement.scrollWidth,
          windowHeight: document.documentElement.scrollHeight,
          ...this.html2canvasOptions,
        })

        const ext = (this.format === 'jpg') ? 'jpeg' : this.format
        const dataUrl = ext === 'jpeg'
          ? canvas.toDataURL('image/jpeg', this.quality)
          : canvas.toDataURL('image/png')

        const a = document.createElement('a')
        a.href = dataUrl
        a.download = this.makeFilename(this.filenamePrefix)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        window.scrollTo(prevX, prevY)
        this.$emit('done', { dataUrl })
      } catch (e) {
        this.$emit('error', e)
        console.error(e)
      } finally {
        this.busy = false
      }
    },

    resolveTarget() {
      if (typeof this.getTargetEl === 'function') {
        const el = this.getTargetEl()
        if (el) return el
      }
      if (this.selector) {
        const el = document.querySelector(this.selector)
        if (el) return el
      }
      return null
    },
    makeFilename(prefix = 'snapshot') {
      const d = new Date()
      const pad = n => String(n).padStart(2, '0')
      const y = d.getFullYear()
      const m = pad(d.getMonth() + 1)
      const day = pad(d.getDate())
      const hh = pad(d.getHours())
      const mm = pad(d.getMinutes())
      const ss = pad(d.getSeconds())
      const ext = this.format === 'jpg' ? 'jpeg' : this.format
      return `${prefix}-${y}${m}${day}-${hh}${mm}${ss}.${ext === 'jpeg' ? 'jpg' : ext}`
    },
    // async captureAndDownload() {
    //   if (this.busy || this.disabled) return
    //   this.busy = true
    //   this.$emit('start')
    //   try {
    //     const targetEl = this.resolveTarget()
    //     if (!targetEl) throw new Error('ไม่พบ element เป้าหมายสำหรับการแคป')

    //     // เก็บ scroll แล้วเลื่อนขึ้นบนสุดเพื่อกันหลุดเฟรม
    //     const prevX = window.scrollX, prevY = window.scrollY
    //     window.scrollTo(0, 0)

    //     const canvas = await html2canvas(targetEl, {
    //       backgroundColor: '#ffffff',
    //       scale: this.scale || Math.max(2, window.devicePixelRatio || 1),
    //       useCORS: this.useCORS,
    //       allowTaint: false,
    //       logging: false,
    //       scrollX: 0,
    //       scrollY: -window.scrollY,
    //       windowWidth: document.documentElement.scrollWidth,
    //       windowHeight: document.documentElement.scrollHeight,
    //       ...this.html2canvasOptions,
    //     })

    //     const ext = (this.format === 'jpg') ? 'jpeg' : this.format
    //     const dataUrl = ext === 'jpeg'
    //       ? canvas.toDataURL('image/jpeg', this.quality)
    //       : canvas.toDataURL('image/png')

    //     const a = document.createElement('a')
    //     a.href = dataUrl
    //     a.download = this.makeFilename(this.filenamePrefix)
    //     document.body.appendChild(a)
    //     a.click()
    //     document.body.removeChild(a)

    //     window.scrollTo(prevX, prevY)
    //     this.$emit('done', { dataUrl })
    //   } catch (e) {
    //     this.$emit('error', e)
    //     // โยนต่อให้ dev มองเห็นในคอนโซลด้วย
    //     // eslint-disable-next-line no-console
    //     console.error(e)
    //   } finally {
    //     this.busy = false
    //   }
    // },
  },
}
</script>
