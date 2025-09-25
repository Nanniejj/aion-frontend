<template>
  <div>
    <b-card v-for="item in items" :key="item.id" class="mb-3 border-0 shadow-sm list-card">
      <b-row class="align-items-center">
        <b-col cols="12" md="6" class="d-flex align-items-center">
          <b-form-checkbox class="mr-3" :checked="selectedIds.has(item.id)" @change="toggleSelect(item.id)" />
          <b-avatar :src="item.avatar" rounded="lg" :text="item.avatar ? null : initials(item.subject)" class="mr-3"
            size="72px" />
          <div>
            <div class="font-weight-600">{{ item.subject }}</div>
            <small class="text-muted">Subject</small>
          </div>
        </b-col>

        <b-col cols="6" md="2" class="mt-2 mt-md-0">
          <div class="text-muted small">Date</div>
          <div>{{ item.date }}</div>
        </b-col>

        <b-col cols="6" md="1" class="mt-2 mt-md-0">
          <div class="text-muted small">Time</div>
          <div>{{ item.time }}</div>
        </b-col>

        <b-col cols="6" md="2" class="mt-2 mt-md-0">
          <div class="text-muted small">Status</div>
          <div>
            <b-badge :variant="statusVariant(item.status)" pill class="py-2 px-2 text-uppercase">
              <!-- <span class="dot mr-1 "></span> -->
              {{ item.status }}
            </b-badge>
          </div>
        </b-col>

        <b-col cols="6" md="1" class="mt-2 mt-md-0">
          <div class="text-muted small">Posts</div>
          <div>{{ item.quantity }}</div>
        </b-col>
      </b-row>

      <b-button block :variant="item.quantity === 0 ? 'light' : 'info'" class="mt-3 more-btn"
        @click="toPost(item)">
        More
      </b-button>
    </b-card>

    <div v-if="!items.length" class="text-center text-muted py-5">
      ไม่มีข้อมูล
    </div>

    <div class="d-flex justify-content-between align-items-center mt-3">
      <div>
        <b-form-checkbox :indeterminate="someSelected" :checked="allSelected" @change="toggleSelectAll">
          เลือกทั้งหมด
        </b-form-checkbox>
      </div>
      <b-pagination v-if="totalRows > perPage" v-model="localPage" :per-page="perPage" :total-rows="totalRows" size="sm"
        @input="$emit('page-change', localPage)" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageSearchList',
  props: {
    items: { type: Array, default: () => [] },
    selected: { type: Array, default: () => [] },
    page: { type: Number, default: 1 },
    perPage: { type: Number, default: 10 },
    totalRows: { type: Number, default: 0 }
  },
  data() {
    return { localPage: this.page, selectedIds: new Set(this.selected) }
  },
  watch: {
    page(v) { this.localPage = v },
    selected(v) { this.selectedIds = new Set(v) }
  },
  computed: {
    allSelected() {
      return this.items.length && this.items.every(it => this.selectedIds.has(it.id))
    },
    someSelected() {
      return this.items.some(it => this.selectedIds.has(it.id)) && !this.allSelected
    }
  },
  methods: {
    toPost(item) {
      this.$router.push({
        name: "SearchImgPost",
        params: item,
      });
    },
    toggleSelect(id) {
      if (this.selectedIds.has(id)) this.selectedIds.delete(id)
      else this.selectedIds.add(id)
      this.$emit('update:selected', Array.from(this.selectedIds))
    },
    toggleSelectAll(checked) {
      if (checked) {
        this.selectedIds = new Set(this.items.map(i => i.id))
      } else {
        this.selectedIds = new Set()
      }
      this.$emit('update:selected', Array.from(this.selectedIds))
    },
    statusVariant(s) {
      if (!s) return 'secondary'
      const k = s.toLowerCase()
      if (k.includes('succeed') || k.includes('success')) return 'success'
      if (k.includes('processing')) return 'warning'
      if (k.includes('failed') || k.includes('error')) return 'danger'
      return 'secondary'
    },
    initials(text = '?') {
      return text.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    }
  }
}
</script>

<style scoped>
.btn-info {
  color: #3a3838;
  background-color: #c3e8ec;
  border-color: #c3e8ec;
}
.btn-info:hover {
  color: #3a3838;
  background-color: #92dae2;
  border-color: #92dae2;
}

.border-0 {
  border: 1px solid #7e7d7d !important;
}

.badge-warning {
  color: #3a3838;
  background-color: #ffd968;
  font-weight: 500;
}

.badge-success {
  color: #3a3838;
  background-color: #00967d6b;
  font-weight: 500;
}

.badge-danger {
  color: #3a3838;
  background-color: #e86c78c7;
  font-weight: 500;
}

.badge-pill {
  width: 100px;
}

.list-card {
  border-radius: 16px;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid rgba(255, 255, 255, .6);
}

.more-btn {
  border-radius: 999px;
}

.font-weight-600 {
  font-weight: 600;
}
</style>
