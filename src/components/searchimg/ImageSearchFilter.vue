<template>
  <div class="mt-5">
    <div class="text-center mb-3">
      <h4 class="mb-0">
        <b-img src="@/assets/searchimg.png" style="width: 40px;"></b-img>
        Image Search
      </h4>

      <!-- <b-iconstack font-scale="5" >
      <b-icon stacked icon="images" variant="info" shift-h="-4" ></b-icon>
      <b-icon stacked icon="search" variant="warning" scale="0.60" shift-v="-2"></b-icon>
    </b-iconstack> -->
    </div>

    <div class="position-relative text-right filter-btn">
      <b-button size="sm" :variant="showFilters ? 'info' : 'outline-info'" @click="showFilters = !showFilters" pill
        class="d-inline-flex align-items-center">
        <i class="fas fa-sliders mr-2"></i>
        <span v-if="!showFilters" class="small">Hide</span>
        <span v-else class="small">Show</span>
      </b-button>
    </div>

    <b-card class="border-0 image-filter mx-md-5 mx-2" v-show="!showFilters">
      <b-row class="align-items-center">
        <!-- Dropzone -->
        <b-col cols="12" md="12" class="mb-2 mb-md-0">

          <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dzOptions" @vdropzone-sending="onSending"
            @vdropzone-success="onDzSuccess" @vdropzone-error="onDzError" @vdropzone-queue-complete="onDzQueueComplete"
            @vdropzone-file-added="onDzFileChange(1)" @vdropzone-removed-file="onDzFileChange(0)"
            @vdropzone-reset="onDzReset" class="dz-compact-img" />
        </b-col>

        <b-col cols="12" md="12" class="text-center mb-2 mb-md-0">
          <span class="text-muted">or</span>
        </b-col>

        <!-- ใส่หลายลิงก์ -->
        <b-col cols="12" md="12">
          <label class="mb-1 text-muted small d-block">
            ใส่หลายลิงก์ (กด Enter / คั่นด้วย , หรือ วางหลายบรรทัด)
          </label>
          <b-form-tags v-model="urls" separator="," add-on-change remove-on-delete
            placeholder="วางหรือพิมพ์ลิงก์หลายรายการ…" tag-variant="info" tag-pills @input="handleUrlsChange"
            @blur="normalizeUrls" class="input-text" />

          <div class="mt-2 d-flex flex-wrap">
            <b-button size="sm" variant="outline-info" pill class="mb-2" @click="clearUrls" :disabled="!urls.length">
              ล้างลิงก์
            </b-button>
            <label class="mb-1  small d-block ml-2 text-muted">
              กรณี url ไม่สามารถแสดงผลได้ (error) ให้ใช้แบบอัพโหลดแทน
            </label>
          </div>

          <!-- พรีวิวทุกลิงก์ -->
          <b-row class="mt-3" v-if="urlPreviews.length">
            <b-col cols="12" md="4" lg="3" v-for="(item, idx) in urlPreviews" :key="item.id" class="mb-3">
              <b-card no-body class="border-0 shadow-sm h-100">
                <div class="text-right px-3 py-1">
                  <b-icon icon="x" @click="removePreview(item)" pill :aria-label="`ลบรูป ${idx + 1}`" scale="2"
                    style="color: #86b1b8; cursor: pointer;" />
                </div>

                <div class="pb-3 d-flex justify-content-center">
                  <div class="preview-box">
                    <b-spinner v-if="item.loading" />
                    <img v-else :src="item.ok ? item.url : fallbackThumb" :alt="'preview-' + idx" class="preview-img" />
                  </div>
                </div>

                <div class="px-3 pb-3 d-flex align-items-start">
                  <b-badge v-if="!item.ok" variant="danger" class="mr-2 mt-1">Error</b-badge>
                  <div class="flex-fill ellipsis">
                    <small class="ellipsis">
                      <b-link :href="safeHref(item.url)" target="_blank" rel="noopener noreferrer" class="text-muted"
                        :title="item.url">
                        {{ item.url }}
                      </b-link>
                    </small>
                    <div v-if="!item.loading && !item.ok" class="text-danger mt-1 text-center">
                      <small>โหลดไม่ได้หรือไม่ใช่ไฟล์ภาพ</small>
                    </div>
                  </div>
                </div>
              </b-card>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <!-- {{ fileCount }}{{ _errorCount }} -->
      <!-- {{ urlPreviews.some(p => p.ok === false) }} -->
      <!-- {{ load }} -->
      <div class="text-right" v-if="load">
        <vue-element-loading :active="load" size="60" background-color="rgba(255, 255, 255, 0.5)" color="#17a2b891" />
      </div>
      <div class="text-right" v-else>
        <b-button variant="info" pill class="mr-2 mb-2 px-3" @click="onClickUpload"
          :disabled="urls.length == 0 && fileCount == 0 || urlPreviews.some(p => p.ok === false) == true">
          Upload
        </b-button>
      </div>
    </b-card>

    <hr class="border-dash mt-0" />
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import axios from 'axios'

export default {
  name: 'ImageSearchFilter',
  components: { vueDropzone: vue2Dropzone },

  props: {
    apiUrl: {
      type: String,
      default: 'https://api2.cognizata.com/api/v2/image_upload/upload'
    },
    apiToken: {
      type: String,
      default: () => (typeof localStorage !== 'undefined' ? localStorage.getItem('token') || '' : '')
    },
    objectType: {
      type: String,
      default: 'image'
    },
    defaultTitle: {
      type: String,
      default: 'uploaded-image'
    }
  },

  data() {
    return {
      load: false,
      fileCount: 0,
      showFilters: false,       // v-if="!showFilters" => true = ซ่อน, false = แสดง
      urls: [],
      urlPreviews: [],
      fallbackThumb:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="148" height="148"><rect width="100%" height="100%" fill="%23f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="12">no preview</text></svg>',
      _debounceTimer: null,

      // ตัวนับสถานะ
      _dzDone: false,
      _urlDone: false,
      _expected: 0,
      _successCount: 0,
      _errorCount: 0
    }
  },

  computed: {
    dzOptions() {
      const headers = this.apiToken ? { Authorization: `Bearer ${this.apiToken}` } : {}
      return {
        url: this.apiUrl,
        method: 'post',
        paramName: 'file',
        thumbnailWidth: 148,
        maxFilesize: 200,
        addRemoveLinks: true,
        acceptedFiles: 'image/*',
        dictDefaultMessage: "<i class='fa fa-cloud-upload'></i> UPLOAD",
        headers,
        autoProcessQueue: false,
        uploadMultiple: false,
        parallelUploads: 10,
        timeout: 0
      }
    }
  },

  methods: {
    // ========= ปุ่ม Upload =========
    onClickUpload() {
      this.load = true
      // ตั้งตัวนับรอบใหม่
      const dz = this._dz()
      const queued = dz ? dz.getQueuedFiles().length : 0
      const fromUrls = this.urls.length

      this._expected = queued + fromUrls
      this._successCount = 0
      this._errorCount = 0

      this._dzDone = queued === 0
      this._urlDone = fromUrls === 0

      // 1) ไฟล์ใน Dropzone
      if (dz && queued > 0) dz.processQueue()

      // 2) ลิงก์ URLs
      if (fromUrls > 0) {
        this.uploadUrlsViaApi().finally(() => {
          this._urlDone = true
          this._maybeAllComplete()
        })
      } else {
        this._maybeAllComplete()
      }
      // this.load = false
    },

    // ========= Dropzone hooks =========
    _dz() {
      return (this.$refs.myVueDropzone && this.$refs.myVueDropzone.dropzone) || null
    },
    onDzFileChange(idx) {


      const dz = this.$refs.myVueDropzone
      // console.log('dz.getAcceptedFiles().length',dz.getAcceptedFiles().length);
      this.fileCount = dz ? dz.getAcceptedFiles().length + idx : 1
      // this.fileCount = dz ? dz.getAcceptedFiles().length : 0 
    },
    onDzReset() {
      this.fileCount = 0
    },
    onSending(file, xhr, formData) {
      formData.append('object_type', this.objectType)
      formData.append('title', file?.name || this.defaultTitle)
    },

    onDzSuccess(file, response) {
      this._successCount += 1
      this.$emit('upload', { kind: 'dropzone', name: file?.name, response })
    },

    onDzError(file, message, xhr) {
      this._errorCount += 1
      console.error('Dropzone error:', { name: file?.name, message, status: xhr?.status, resp: xhr?.response })

      this.$emit('upload-error', { kind: 'dropzone', name: file?.name, message, status: xhr?.status })
    },

    onDzQueueComplete() {
      // ล้างคิว dropzone

      const dz = this._dz()
      if (dz) dz.removeAllFiles(true)
      this._dzDone = true
      this._maybeAllComplete()
    },

    _maybeAllComplete() {
      if (this._dzDone && this._urlDone) {
        const payload = {
          expected: this._expected,
          success: this._successCount,
          errors: this._errorCount
        }
        this.$emit('all-complete', payload)
        this.load = false;
        // ถ้าอัปครบและสำเร็จทุกอัน => เคลียร์ค่า + ซ่อนฟิลเตอร์
        if (payload.expected > 0 && payload.success === payload.expected) {
          this.resetAndHide()
        }
      }
    },

    // ========= อัปโหลดลิงก์ =========
    async uploadUrlsViaApi() {
      // this.load = true
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }
      for (const u of this.urls) {
        try {
          const res = await fetch(u, { mode: 'cors' })
          if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
          const blob = await res.blob()

          const nameFromUrl = (() => {
            try {
              return decodeURIComponent(new URL(u).pathname.split('/').pop() || 'image')
            } catch {
              return 'image'
            }
          })()
          const file = new File([blob], nameFromUrl, { type: blob.type || 'image/jpeg' })

          const form = new FormData()
          form.append('object_type', this.objectType)
          form.append('title', nameFromUrl)
          form.append('file', file)

          const resp = await axios.post(this.apiUrl, form, { headers })
          this._successCount += 1
          this.$emit('upload', { kind: 'url', name: nameFromUrl, fromUrl: u, response: resp?.data || { ok: true } })
          this.load = false
        } catch (err) {
          this._errorCount += 1
          this.$emit('upload-error', { kind: 'url', fromUrl: u, error: String(err) })
          this.load = false
        }
      }
    },

    // ========= Utilities =========
    resetAndHide() {
      // เคลียร์ URL + พรีวิว
      this.urls = []
      this.urlPreviews = []
      // เคลียร์ไฟล์ใน dropzone
      const dz = this._dz()
      if (dz) dz.removeAllFiles(true)
      // ซ่อนฟิลเตอร์ (เพราะ v-if="!showFilters")
      this.showFilters = true
    },

    handleUrlsChange(list) {
      const cleaned = Array.from(new Set(list.map(s => (s || '').trim()).filter(Boolean)))
      this.urls = cleaned
      this.schedulePreviewUpdate()
    },
    normalizeUrls() {
      this.handleUrlsChange(this.urls)
    },
    clearUrls() {
      this.urls = []
      this.urlPreviews = []
    },
    schedulePreviewUpdate() {
      clearTimeout(this._debounceTimer)
      this._debounceTimer = setTimeout(() => this.refreshPreviews(), 250)
    },
    refreshPreviews() {
      const map = new Map(this.urlPreviews.map(p => [p.url, p]))
      this.urlPreviews = this.urls.map(u => {
        if (map.has(u)) return map.get(u)
        return { id: u + '__' + Date.now(), url: u, loading: true, ok: false }
      })
      this.urlPreviews.forEach(item => this.tryLoad(item))
    },
    tryLoad(item) {
      item.loading = true
      item.ok = false
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        item.loading = false
        item.ok = true
        this.$forceUpdate()
      }
      img.onerror = () => {
        item.loading = false
        item.ok = false
        this.$forceUpdate()
      }
      img.src = item.url
    },
    removePreview(item) {
      this.urls = this.urls.filter(u => u !== item.url)
      this.urlPreviews = this.urlPreviews.filter(p => p.url !== item.url)
    },

    safeHref(u) {
      try {
        const url = new URL(u)
        if (url.protocol === 'http:' || url.protocol === 'https:') return url.href
      } catch (e) { }
      return '#'
    }
  }
}
</script>

<style>
.dz-progress {
  display: none !important;
}

.vue-dropzone>.dz-preview .dz-details {
  bottom: 0;
  top: 0;
  color: #fff;
  background-color: rgb(23 162 184 / 67%);
  transition: opacity .2s linear;
  text-align: left;
}

.dz-compact-img .dz-image-preview {
  min-width: 148px !important;

}

.dz-compact-img.vue-dropzone>.dz-preview .dz-image {
  border-radius: 0;
  width: 100%;
  height: 148px;
  border-radius: 20px;

}

.dz-compact-img {
  min-height: 100px !important;
}
</style>

<style scoped>
.filter-btn {
  top: -5px;
  z-index: 2;
}

.border-dash {
  border: 2px dashed #a6c3cc;
}

.shadow-sm {
  box-shadow: rgb(60 64 67 / 11%) 0px 1px 2px 0px, rgb(60 64 67 / 20%) 0px 1px 3px 1px !important;
}

.input-text {
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  border: 0px solid #ced4da;
  border-radius: 20px;
  height: 60px !important;
  max-height: 200px !important;
  overflow-y: auto;
}

.vue-dropzone {
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  border: 0px dashed #e5e5e5;
  font-family: Arial, sans-serif;
  letter-spacing: .2px;
  color: #777;
  transition: .2s linear;
  border-radius: 20px;
}

.image-filter {
  border-radius: 16px;
}

.preview-box {
  width: 227px;
  height: 160px;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f7f7;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ellipsis {
  display: block;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
<style scoped>
/* จอมือถือ */
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .mt-5, .my-5 {
    margin-top: 1rem !important;
}
  .card-body {
    flex: 1 1 auto;
    min-height: 1px;
    padding: 1px;
  }
  .small, small {
    font-size: 72%;
    font-weight: 400;
}
}
</style>