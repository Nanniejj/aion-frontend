<template>
    <div class="mt-5 ">
        <div class="text-center mb-3">
            <!-- text-uppercase -->
            <h4 class="mb-0 "><b-img src="@/assets/searchimg.png" style="width: 40px;"></b-img>
                Search Image</h4>
            <!-- <h4 class="mb-0">🔎 Search Image</h4> -->
        </div>
        <div class="position-relative text-right filter-btn">
            <b-button size="sm" :variant="showFilters ? 'info' : 'outline-info'" @click="showFilters = !showFilters"
                pill class="d-inline-flex align-items-center ">
                <i class="fas fa-sliders mr-2"></i>
                <span v-if="!showFilters" class="small">Hide</span>
                <span v-else class="small">Show</span>
                <!-- <b-badge v-if="activeFilterCount" variant="light" class="ml-2">{{ activeFilterCount }}</b-badge> -->
            </b-button>
        </div>
        <b-card class="border-0  image-filter mx-md-5 mx-2" v-if="!showFilters">


            <b-row class="align-items-center">
                <!-- Dropzone -->
                <b-col cols="12" md="12" class="mb-2 mb-md-0">
                    <vue-dropzone v-model="files" ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"
                        @vdropzone-success="DropZoneSuccess" @vdropzone-removed-file="updateCount"
                        @vdropzone-total-upload-progress="updateQ" @vdropzone-file-added="updateFace"
                        :duplicateCheck="true" class="dz-compact-img" />
                </b-col>

                <b-col cols="12" md="12" class="text-center mb-2 mb-md-0">
                    <span class="text-muted">or</span>
                </b-col>

                <!-- ใส่หลายลิงก์ -->
                <b-col cols="12" md="12">
                    <label class="mb-1 text-muted small d-block">ใส่หลายลิงก์ (กด Enter / คั่นด้วย , หรือ
                        วางหลายบรรทัด)</label>
                    <b-form-tags v-model="urls" separator="," add-on-change remove-on-delete
                        placeholder="วางหรือพิมพ์ลิงก์หลายรายการ…" tag-variant="info" tag-pills
                        @input="handleUrlsChange" @blur="normalizeUrls" class="input-text" />

                    <div class="mt-2 d-flex flex-wrap">

                        <b-button size="sm" variant="outline-info" pill class="mb-2" @click="clearUrls"
                            :disabled="!urls.length">
                            ล้างลิงก์
                        </b-button>
                    </div>

                    <!-- พรีวิวทุกลิงก์ -->
                    <b-row class="mt-3" v-if="urlPreviews.length">
                        <b-col cols="12" md="4" lg="3" v-for="(item, idx) in urlPreviews" :key="item.id" class="mb-3">
                            <b-card no-body class="border-0 shadow-sm h-100">
                                <!-- ปุ่มลบพรีวิว -->
                                <div class="text-right px-3 py-1">
                                    <b-icon icon="x" @click="removePreview(item)" pill :aria-label="`ลบรูป ${idx + 1}`"
                                        scale="2" style="color: #86b1b8;cursor: pointer;"></b-icon>
                                </div>

                                <!-- รูปพรีวิวใหญ่ -->
                                <div class="pb-3 d-flex justify-content-center">
                                    <div class="preview-box">
                                        <b-spinner v-if="item.loading" />
                                        <img v-else :src="item.ok ? item.url : fallbackThumb" :alt="'preview-' + idx"
                                            class="preview-img">
                                    </div>
                                </div>

                                <!-- แถบข้อมูล + ปุ่มลบ -->
                                <div class="px-3 pb-3 d-flex align-items-start ">
                                    <b-badge v-if="!item.ok" :variant="item.ok ? 'light' : 'danger'" class="mr-2 mt-1">
                                        {{ item.ok ? 'OK' : 'Error' }}
                                    </b-badge>

                                    <div class="flex-fill ellipsis">
                                        <!-- ตัดข้อความด้วย … และใส่ title เป็นลิงก์เต็ม -->
                                        <small class="ellipsis">
                                            <b-link :href="safeHref(item.url)" target="_blank" rel="noopener noreferrer"
                                                class="text-muted" :title="item.url">
                                                {{ item.url }}
                                            </b-link>
                                        </small>
                                        <div v-if="!item.loading && !item.ok" class="text-danger mt-1 text-center">
                                            <small>โหลดไม่ได้หรือไม่ใช่ไฟล์ภาพ</small>
                                        </div>
                                    </div>


                                    <!-- <b-button size="sm" variant="outline-danger" class="ml-2">
                                    </b-button> -->
                                </div>

                            </b-card>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <div class="text-right">
                <div>
                    <b-button variant="info" pill class="mr-2 mb-2 px-3" @click="emitSearch">
                        Upload
                    </b-button>
                </div>
            </div>
            <!-- แท็บ + ปุ่มด้านขวา -->
            <!-- <b-nav pills class="mt-4">
                <b-nav-item :active="tab === 'all'" @click="setTab('all')">All</b-nav-item>
                <b-nav-item :active="tab === 'recents'" @click="setTab('recents')">Recents</b-nav-item>
                <b-nav-item :active="tab === 'share'" @click="setTab('share')">Share</b-nav-item>

            </b-nav> -->
        </b-card>
        <hr class="border-dash mt-0">
    </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import "vue2-dropzone/dist/vue2Dropzone.min.css";

export default {
    name: 'ImageSearchFilter',
    components: { 'vue-dropzone': vue2Dropzone },
    data() {
        return {
            showFilters: true,
            urls: [],
            urlPreviews: [], // [{id,url,loading,ok}]
            fallbackThumb: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="148" height="148"><rect width="100%" height="100%" fill="%23f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="12">no preview</text></svg>',

            // เดิม
            tab: 'all',
            files: [],
            dropzoneOptions: {
                url: "https://httpbin.org/post",
                thumbnailWidth: 148,
                maxFilesize: 200,
                addRemoveLinks: true,
                acceptedFiles: "image/*",
                dictDefaultMessage: "<i class='fa fa-cloud-upload'></i> UPLOAD",
                headers: { "Access-Control-Allow-Origin": "*" },
            },
            _debounceTimer: null
        }
    },
    methods: {
        safeHref(u) {
            try {
                const url = new URL(u);
                if (url.protocol === 'http:' || url.protocol === 'https:') return url.href;
            } catch (e) { }
            return '#';
        },
        handleUrlsChange(list) {
            // ทำความสะอาด + ตัดว่าง/ซ้ำ
            const cleaned = Array.from(new Set(
                list.map(s => (s || '').trim()).filter(Boolean)
            ))
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
            // สร้างรายการพรีวิวตาม urls ปัจจุบัน
            const map = new Map(this.urlPreviews.map(p => [p.url, p]))
            this.urlPreviews = this.urls.map(u => {
                if (map.has(u)) return map.get(u)
                return { id: u + '__' + Date.now(), url: u, loading: true, ok: false }
            })
            // โหลดรูปทีละรายการ (ไม่บล็อก UI)
            this.urlPreviews.forEach(item => this.tryLoad(item))
        },
        tryLoad(item) {
            item.loading = true
            item.ok = false
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => { item.loading = false; item.ok = true; this.$forceUpdate() }
            img.onerror = () => { item.loading = false; item.ok = false; this.$forceUpdate() }
            img.src = item.url
        },
        // ✅ ลบรูปเฉพาะใบ (ลบทั้งจากพรีวิวและจากแท็ก b-form-tags)
        removePreview(item) {
            this.urls = this.urls.filter(u => u !== item.url)
            this.urlPreviews = this.urlPreviews.filter(p => p.url !== item.url)
        },

        // ยิงอีเวนต์ให้ parent ใช้ลิสต์ลิงก์ทั้งหมด
        emitSearch() {
            this.$emit('search', { urls: this.urls.slice() })
        },

        // ===== ของเดิม =====
        setTab(val) {
            this.tab = val
            this.$emit('change-tab', val)
        },
        DropZoneSuccess(file, response) { this.$emit('upload-success', { file, response }) },
        updateCount(file) { this.$emit('file-removed', file) },
        updateQ(totalProgress, totalBytes, totalBytesSent) { this.$emit('upload-progress', { totalProgress, totalBytes, totalBytesSent }) },
        updateFace(file) { this.$emit('file-added', file) }
    }
}
</script>
<style>
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
    /* top: 38px;
    right: 15px; */
    top: -5px;
    z-index: 2;
}

.border-0 {
    /* border: 1px solid #777 !important; */
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

.dz-compact ::v-deep .dz-preview .dz-image {
    border-radius: 10px;
}

/* กล่อง/รูปพรีวิวใหญ่ขึ้น */
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

/* ตัดข้อความลิงก์ด้วย … */
.ellipsis {
    display: block;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
