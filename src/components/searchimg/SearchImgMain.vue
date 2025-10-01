<template>
  <div class="container my-3">
    <image-search-filter ref="filter" :api-url="apiUrl" :api-token="apiToken" :object-type="'image'"
      @upload="onUploadedOne" @upload-error="onUploadErrorOne" @all-complete="onAllComplete" />

    <b-card class="mt-3 border-0">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="text-muted">All ({{ getTotalImgList | numFormat }})</div>

        <div>
          <b-form-select v-model="currentStatus" :options="statusOptions" class="mb-3 d-inline" size="sm" />
          <!-- <b-button size="sm" variant="outline-info" @click="exportSelected" v-b-tooltip.hover title="Export" class="d-inline">
            <b-icon-download /> Export
          </b-button> -->
        </div>
      </div>

      <!-- 'processing' | 'succeed' | 'fail' -->
      <image-search-list :status="currentStatus" :page="1" :per-page="10" :selected="[]"
        @page-change="p => currentPage = p" />
    </b-card>
  </div>
</template>

<script>
import ImageSearchFilter from './ImageSearchFilter.vue'
import ImageSearchList from './ImageSearchList.vue'
import { mapGetters } from "vuex";
export default {
  name: 'ImageSearchMain',
  components: { ImageSearchFilter, ImageSearchList },

  data() {
    return {
      currentStatus: '',
      statusOptions: [
        { text: 'All status', value: '' },
        { text: 'processing', value: 'processing' },
        { text: 'succeed', value: 'succeed' },
        { text: 'fail', value: 'fail' }
      ],
      currentPage: 1,
      apiUrl: 'https://api2.cognizata.com/api/v2/image_upload/upload',
      apiToken: typeof localStorage !== 'undefined' ? localStorage.getItem('token') || '' : '',
      items: [],
      page: 1,
      perPage: 5,
      selected: []
    }
  },

  computed: {
     ...mapGetters([
      "getTotalImgList"
    ]),
    pagedItems() {
      const start = (this.page - 1) * this.perPage
      return this.items.slice(start, start + this.perPage)
    }
  },

  created() {
    this.items = this.mockData()
  },

  methods: {
    // สำเร็จต่อรายการ
    onUploadedOne(payload) {
      const label = payload.kind === 'url' ? `URL: ${payload.fromUrl || payload.name}` : `File: ${payload.name}`
      this.$bvToast.toast(`อัปโหลดสำเร็จ • ${label}`, { title: 'Upload', autoHideDelay: 1200 })
    },

    // ล้มเหลวต่อรายการ
    onUploadErrorOne(payload) {
      const label = payload.kind === 'url'
        ? `URL: ${payload.fromUrl}`
        : `File: ${payload.name}`
      this.$bvToast.toast(`อัปโหลดล้มเหลว • ${label}`, {
        title: 'Upload Error',
        variant: 'danger',
        autoHideDelay: 2500
      })
    },

    // ครบทุกอันแล้ว
    onAllComplete({ expected, success, errors }) {
      // เงื่อนไขขึ้น Swal ตามที่ขอ: "อัปครบและสำเร็จทุกอัน"
      if (expected > 0 && success === expected) {
        this.$fire({
          title: 'บันทึกข้อมูลสำเร็จ',
          type: 'success',
          showConfirmButton: false,
          timer: 1000
        })
      }
      // เคลียร์ค่าที่หน้าลิสต์/รีโหลดข้อมูล
      this.$emitter.emit("apiListImg", success);

      // (ซ้ำความชัดเจน) สั่ง child ล้างค่าทั้งหมด + ซ่อนฟิลเตอร์
      // ปกติ child ทำให้แล้วอยู่แล้ว แต่เผื่อปรับในอนาคต
      this.$refs.filter && this.$refs.filter.resetAndHide()
    },

    exportSelected() {
      this.$bvToast.toast(`ส่งออก ${this.selected.length} รายการ`, { title: 'Export', autoHideDelay: 1500 })
    },

    openItem(item) {
      this.$bvModal.msgBoxOk(
        `Subject: ${item.subject}\nDate: ${item.date} ${item.time}\nStatus: ${item.status}\nQuantity: ${item.quantity}`,
        { title: 'รายละเอียด', size: 'sm' }
      )
    },

    fetchItems() {
      // TODO: เรียก API โหลดลิสต์จริง
      this.page = 1
      this.selected = []
      this.items = this.mockData()
    },

    mockData() {
      return [
        { id: 1, subject: 'Subject I', avatar: 'https://i.pravatar.cc/48?img=15', date: '18.09.25', time: '10.00', status: 'Processing', quantity: 8 },
        { id: 2, subject: 'Subject II', avatar: 'https://i.pravatar.cc/48?img=16', date: '17.09.25', time: '11.00', status: 'Succeed', quantity: 10 },
        { id: 3, subject: 'Subject III', avatar: 'https://i.pravatar.cc/48?img=12', date: '16.09.25', time: '09.30', status: 'Failed', quantity: 0 },
        { id: 4, subject: 'Subject IV', avatar: 'https://i.pravatar.cc/48?img=22', date: '15.09.25', time: '14.40', status: 'Succeed', quantity: 12 },
        { id: 5, subject: 'Subject V', avatar: 'https://i.pravatar.cc/48?img=5', date: '14.09.25', time: '08.20', status: 'Processing', quantity: 3 },
        { id: 6, subject: 'Subject VI', avatar: '', date: '13.09.25', time: '12.10', status: 'Succeed', quantity: 7 }
      ]
    }
  },

  filters: {
    numFormat(v) {
      try { return Number(v).toLocaleString() } catch { return v }
    }
  }
}
</script>

<style scoped>
::v-deep .card {
  border-radius: 16px;
}
</style>
