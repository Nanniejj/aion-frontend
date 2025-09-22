<template>
  <div class="container my-3">
    <image-search-filter
      @search="onSearch"
      @upload="onUpload"
      @download-selected="downloadSelected"
      @export-selected="exportSelected"
      @change-tab="tab = $event; fetchItems()"
    />

    <b-card class="mt-3 p-3 border-0">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="text-muted small">ผลลัพธ์</div>
        <div>
          <b-button size="sm" class="mr-2" variant="outline-secondary" @click="downloadSelected">
            <b-icon-download class="mr-1"/> Download
          </b-button>
          <b-button size="sm" variant="outline-secondary" @click="exportSelected">
            <b-icon-box-arrow-up-right class="mr-1"/> Export
          </b-button>
        </div>
      </div>

      <image-search-list
        :items="pagedItems"
        :selected.sync="selected"
        :page="page"
        :perPage="perPage"
        :totalRows="items.length"
        @page-change="page = $event"
        @open-item="openItem"
      />
    </b-card>
  </div>
</template>

<script>
import ImageSearchFilter from './ImageSearchFilter.vue'
import ImageSearchList from './ImageSearchList.vue'

export default {
  name: 'ImageSearchPage',
  components: { ImageSearchFilter, ImageSearchList },
  data() {
    return {
      tab: 'all',
      items: [],
      page: 1,
      perPage: 5,
      selected: []
    }
  },
  computed: {
    pagedItems() {
      const start = (this.page - 1) * this.perPage
      return this.items.slice(start, start + this.perPage)
    }
  },
  created() {
    this.items = this.mockData()
  },
  methods: {
    onSearch({ url }) {
      // เรียก API จริงได้ที่นี่
      this.$bvToast.toast(`ค้นหาด้วย URL: ${url || '(ว่าง)'}`, { title: 'Search', autoHideDelay: 2000 })
    },
    onUpload(file) {
      this.$bvToast.toast(`อัปโหลดไฟล์: ${file.name}`, { title: 'Upload', autoHideDelay: 2000 })
    },
    downloadSelected() {
      this.$bvToast.toast(`ดาวน์โหลด ${this.selected.length} รายการ`, { title: 'Download', autoHideDelay: 2000 })
    },
    exportSelected() {
      this.$bvToast.toast(`ส่งออก ${this.selected.length} รายการ`, { title: 'Export', autoHideDelay: 2000 })
    },
    openItem(item) {
      this.$bvModal.msgBoxOk(
        `Subject: ${item.subject}\nDate: ${item.date} ${item.time}\nStatus: ${item.status}\nQuantity: ${item.quantity}`,
        { title: 'รายละเอียด', size: 'sm' }
      )
    },
    fetchItems() {
      // ตัวอย่าง: เปลี่ยนชุดข้อมูลเมื่อสลับแท็บ
      this.page = 1
      this.selected = []
      this.items = this.mockData(this.tab)
    },
    mockData(tab = 'all') {
      const base = [
        { id: 1, subject: 'Subject I',  avatar: 'https://i.pravatar.cc/48?img=15', date: '18.09.25', time: '10.00', status: 'Processing', quantity: 8 },
        { id: 2, subject: 'Subject II', avatar: 'https://i.pravatar.cc/48?img=16', date: '17.09.25', time: '11.00', status: 'Succeed',    quantity: 10 },
        { id: 3, subject: 'Subject III',avatar: 'https://i.pravatar.cc/48?img=12', date: '16.09.25', time: '09.30', status: 'Failed',      quantity: 6 },
        { id: 4, subject: 'Subject IV', avatar: 'https://i.pravatar.cc/48?img=22', date: '15.09.25', time: '14.40', status: 'Succeed',    quantity: 12 },
        { id: 5, subject: 'Subject V',  avatar: 'https://i.pravatar.cc/48?img=5',  date: '14.09.25', time: '08.20', status: 'Processing', quantity: 3 },
        { id: 6, subject: 'Subject VI', avatar: '',                                date: '13.09.25', time: '12.10', status: 'Succeed',    quantity: 7 }
      ]
      if (tab === 'recents') return base.slice(0, 3)
      if (tab === 'share')   return base.slice(2)
      return base
    }
  }
}
</script>

<style scoped>
/* ปรับอารมณ์ให้ละมุนขึ้นเล็กน้อย */
::v-deep .card { border-radius: 16px; }
</style>
