<template>
  <div class="kb-page">
    <div class="head-nav">
      <div
        class="h5 right-0 px-3 pt-3 no-print position-absolute text-gp"
        @click="$route.query.from ? $router.push({ name: $route.query.from }) : $router.back()"
        style="cursor:pointer;"
      >
        <span><i class="fa fa-angle-left text-gp" aria-hidden="true"></i> กลับ</span>
      </div>
    </div>

    <div class="container py-5 bg-content">
      <div class="idx">
        <div class="text-gp text-center brand-block">
          <h1 class="mb-2 brand-title">
            <span class="h1">A</span>ion<br />
            <span class="h1">A</span>lert
          </h1>
          <p class="brand-tag">Always Aware. Always Alert.</p>
        </div>

        <StatsOverview :bags="bags" :events="events" class="kb-stats" />

        <b-row class="kb-layout">
          <b-col lg="8">
            <div class="kb-panel">
              <!-- Panel header -->
              <div class="kb-panel-head">
                <div>
                  <h2 class="kb-panel-title">ตั้งค่าแจ้งเตือน</h2>
                  <p class="kb-panel-desc">จัดการคำที่ติดตามและตั้งค่าการแจ้งเตือน</p>
                </div>
                <b-button variant="primary" class="kb-new-btn" @click="openCreate">
                  <b-icon icon="plus" class="mr-1" />เพิ่มแจ้งเตือน
                </b-button>
              </div>

              <!-- Controls -->
              <div class="kb-controls">
                <div class="kb-search">
                  <i class="fa fa-search kb-search-icon" aria-hidden="true"></i>
                  <input
                    v-model="searchText"
                    type="text"
                    class="kb-search-input"
                    placeholder="ค้นหาถุงคำ หรือ คำค้นหา..."
                  />
                </div>
                <div class="kb-filter-group" role="tablist">
                  <button
                    v-for="opt in statusFilters"
                    :key="opt.value"
                    type="button"
                    class="kb-filter-chip"
                    :class="{ active: statusFilter === opt.value }"
                    @click="statusFilter = opt.value"
                  >
                    {{ opt.label }}
                  </button>
                </div>
              </div>

              <b-alert v-if="error" variant="danger" show class="mt-3">{{ error }}</b-alert>

              <!-- Loading skeleton -->
              <div v-if="loading" class="kb-grid mt-4">
                <div class="kb-card kb-skeleton" v-for="n in 3" :key="n">
                  <div class="sk-line sk-w60"></div>
                  <div class="sk-line sk-w90"></div>
                  <div class="sk-line sk-w40"></div>
                </div>
              </div>

              <!-- Empty state -->
              <div v-else-if="filteredBags.length === 0" class="kb-empty">
                <div class="kb-empty-icon">
                  <i class="fa fa-satellite-dish" aria-hidden="true"></i>
                </div>
                <h5 class="mb-1">
                  {{ bags.length === 0 ? 'ยังไม่มีถุงคำ' : 'ไม่พบถุงคำที่ตรงกับการค้นหา' }}
                </h5>
                <p class="text-muted mb-3">
                  {{ bags.length === 0
                    ? 'สร้างถุงคำแรกเพื่อเริ่มติดตามและรับการแจ้งเตือน'
                    : 'ลองเปลี่ยนคำค้นหา หรือเลือก "ทั้งหมด" เพื่อดูถุงคำทั้งหมด' }}
                </p>
                <b-button v-if="bags.length === 0" variant="primary" @click="openCreate">
                  <b-icon icon="plus" class="mr-1" />สร้างถุงคำแรก
                </b-button>
              </div>

              <!-- Cards -->
              <div v-else class="kb-grid mt-4">
                <div
                  v-for="item in filteredBags"
                  :key="item._id"
                  class="kb-card"
                  :class="{ 'is-active': item.is_active }"
                >
                  <div class="kb-card-top">
                    <div class="kb-status">
                      <span class="kb-dot" :class="{ pulse: item.is_active }"></span>
                      <b-badge :variant="item.is_active ? 'success' : 'secondary'" class="kb-badge">
                        {{ item.is_active ? 'ทำงานอยู่' : 'ปิดใช้งาน' }}
                      </b-badge>
                    </div>
                    <div class="kb-card-actions">
                      <button class="kb-icon-btn" title="แก้ไข" @click="openEdit(item)">
                        <b-icon icon="pencil" />
                      </button>
                      <button
                        class="kb-icon-btn"
                        title="ตั้งค่าเพิ่มเติม"
                        @click="$router.push(`/keyword-bags/${item._id}/settings`)"
                      >
                        <b-icon icon="sliders" />
                      </button>
                      <button class="kb-icon-btn kb-icon-danger" title="ลบ" @click="remove(item)">
                        <b-icon icon="trash" />
                      </button>
                    </div>
                  </div>

                  <h5 class="kb-card-name">{{ item.name }}</h5>
                  <p class="kb-card-query" :title="item.search_query">
                    <i class="fa fa-quote-left mr-1" aria-hidden="true"></i>{{ item.search_query }}
                  </p>
                </div>
              </div>
            </div>
          </b-col>

          <b-col lg="4" class="mt-4 mt-lg-0">
            <SpikeEventList :events="events" @select="onSelectEvent" />
          </b-col>
        </b-row>
      </div>
    </div>

    <b-modal
      v-model="showForm"
      hide-footer
      hide-header
      size="lg"
      content-class="kb-modal-content"
      body-class="p-0"
    >
      <KeywordBagForm :value="editingBag" @saved="onSaved" @cancel="showForm = false" />
    </b-modal>
  </div>
</template>

<script>
import KeywordBagForm from '../components/alert/KeywordBagForm.vue'
import SpikeEventList from '../components/alert/SpikeEventList.vue'
import StatsOverview from '../components/alert/StatsOverview.vue'
import { mockApi } from '../components/alert/mock/store'

export default {
  name: 'KeywordBagsView',
  components: { KeywordBagForm, SpikeEventList, StatsOverview },
  data() {
    return {
      bags: [],
      events: [],
      loading: true,
      error: '',
      showForm: false,
      editingBag: null,
      searchText: '',
      statusFilter: 'all',
      statusFilters: [
        { value: 'all', label: 'ทั้งหมด' },
        { value: 'active', label: 'ทำงานอยู่' },
        { value: 'inactive', label: 'ปิดใช้งาน' },
      ],
    }
  },
  computed: {
    filteredBags() {
      const q = this.searchText.trim().toLowerCase()
      return this.bags.filter((b) => {
        const matchesQuery =
          !q ||
          (b.name && b.name.toLowerCase().includes(q)) ||
          (b.search_query && b.search_query.toLowerCase().includes(q))
        const matchesStatus =
          this.statusFilter === 'all' ||
          (this.statusFilter === 'active' && b.is_active) ||
          (this.statusFilter === 'inactive' && !b.is_active)
        return matchesQuery && matchesStatus
      })
    },
  },
  async mounted() {
    await Promise.all([this.loadBags(), this.loadEvents()])
  },
  methods: {
    async loadBags() {
      this.loading = true
      this.error = ''
      try {
        this.bags = await mockApi.listBags()
      } catch (e) {
        this.error = 'ไม่สามารถโหลดถุงคำได้ กรุณาลองใหม่อีกครั้ง'
      } finally {
        this.loading = false
      }
    },
    async loadEvents() {
      try {
        this.events = await mockApi.listEvents()
      } catch (e) {
        // ไม่ให้ error ของ spike event บล็อกการแสดงผลถุงคำหลัก
        this.events = []
      }
    },
    onSelectEvent(event) {
      if (event?.bag_id) {
        this.$router.push(`/keyword-bags/${event.bag_id}/settings`)
      }
    },
    openCreate() {
      this.editingBag = null
      this.showForm = true
    },
    openEdit(bag) {
      this.editingBag = bag
      this.showForm = true
    },
    async remove(bag) {
      await mockApi.deleteBag(bag._id)
      await this.loadBags()
    },
    onSaved() {
      this.showForm = false
      this.editingBag = null
      this.loadBags()
    },
  },
}
</script>

<style scoped>
/* @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@500;600;700&family=Noto+Sans+Thai:wght@400;500;600&display=swap'); */

.kb-page {
  /* font-family: 'Noto Sans Thai', sans-serif; */
  color: var(--gp-charcoal, #2e2a26);
}

.head-nav {
  background-image: linear-gradient(to right, #fed06ea4, #f0cfda);
  height: 400px;
  width: 100%;
  position: absolute;
  top: 0;
  z-index: 9;
}

.brand-block {
  position: relative;
  z-index: 1;
}

.brand-title {
  font-family: 'Prompt', sans-serif;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.brand-tag {
  font-size: 1.05rem;
  font-style: italic;
  opacity: 0.85;
}

/* Layout */
.kb-stats {
  margin-top: 24px;
  z-index: 99 !important;
}
.bg-content{
  position: relative;
  z-index: 99 !important; 
}
.kb-layout {
  margin-top: 24px;
}

/* Panel */
.kb-panel {
  position: relative;
  z-index: 1;
  background: #ffffff;
  border-radius: 20px;
  padding: 28px 28px 32px;
  box-shadow: 0 12px 40px rgba(45, 32, 20, 0.08);
  height: 100%;
}

.kb-panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.kb-panel-title {
  font-family: 'Prompt', sans-serif;
  font-weight: 600;
  font-size: 1.4rem;
  margin-bottom: 2px;
  text-align: left;
}

.kb-panel-desc {
  color: #8a8178;
  font-size: 0.92rem;
  margin-bottom: 0;
  text-align: left;
}

.kb-new-btn {
  background: #d9a441;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  padding: 10px 18px;
  box-shadow: 0 6px 16px rgba(217, 164, 65, 0.35);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.kb-new-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(217, 164, 65, 0.45);
}

/* Controls */
.kb-controls {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 22px;
}

.kb-search {
  position: relative;
  flex: 1 1 260px;
  min-width: 220px;
}

.kb-search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #b3aaa0;
  font-size: 0.85rem;
}

.kb-search-input {
  width: 100%;
  border: 1px solid #ece5da;
  background: #fbf8f3;
  border-radius: 10px;
  padding: 10px 14px 10px 34px;
  font-size: 0.92rem;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.kb-search-input:focus {
  border-color: #d9a441;
  box-shadow: 0 0 0 3px rgba(217, 164, 65, 0.15);
}

.kb-filter-group {
  display: flex;
  gap: 6px;
  background: #f5f1e9;
  padding: 4px;
  border-radius: 10px;
}

.kb-filter-chip {
  border: none;
  background: transparent;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #8a8178;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}
.kb-filter-chip:focus-visible {
  outline: 2px solid #d9a441;
  outline-offset: 1px;
}
.kb-filter-chip.active {
  background: #ffffff;
  color: #2e2a26;
  box-shadow: 0 2px 6px rgba(45, 32, 20, 0.1);
}

/* Grid & cards */
.kb-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.kb-card {
  position: relative;
  background: #fffdfa;
  border: 1px solid #f0e9dc;
  border-radius: 14px;
  padding: 18px 18px 16px;
  border-top: 3px solid #d7d0c4;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}
.kb-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(45, 32, 20, 0.1);
}
.kb-card.is-active {
  border-top-color: #2bb673;
}

.kb-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.kb-status {
  display: flex;
  align-items: center;
  gap: 7px;
}

.kb-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #b3aaa0;
  flex-shrink: 0;
}
.kb-dot.pulse {
  background: #2bb673;
  box-shadow: 0 0 0 0 rgba(43, 182, 115, 0.6);
  animation: kb-pulse 2s ease-out infinite;
}
@keyframes kb-pulse {
  0% { box-shadow: 0 0 0 0 rgba(43, 182, 115, 0.55); }
  70% { box-shadow: 0 0 0 8px rgba(43, 182, 115, 0); }
  100% { box-shadow: 0 0 0 0 rgba(43, 182, 115, 0); }
}

.kb-badge {
  font-weight: 500;
  font-size: 0.72rem;
  padding: 4px 8px;
}

.kb-card-actions {
  display: flex;
  gap: 2px;
}

.kb-icon-btn {
  border: none;
  background: transparent;
  color: #8a8178;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.kb-icon-btn:hover {
  background: #f5f1e9;
  color: #2e2a26;
}
.kb-icon-btn.kb-icon-danger:hover {
  background: #fdeceb;
  color: #e2574c;
}
.kb-icon-btn:focus-visible {
  outline: 2px solid #d9a441;
  outline-offset: 1px;
}

.kb-card-name {
  font-family: 'Prompt', sans-serif;
  font-weight: 600;
  font-size: 1.02rem;
  margin-bottom: 6px;
  text-align: left;
}

.kb-card-query {
  color: #8a8178;
  font-size: 0.85rem;
  margin-bottom: 0;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Skeleton */
.kb-skeleton {
  border-top-color: #ece5da;
}
.sk-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f0ebe1 25%, #f7f3ea 37%, #f0ebe1 63%);
  background-size: 400% 100%;
  animation: sk-shimmer 1.4s ease infinite;
  margin-bottom: 10px;
}
.sk-w60 { width: 60%; height: 16px; }
.sk-w90 { width: 90%; }
.sk-w40 { width: 40%; }
@keyframes sk-shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

/* Empty state */
.kb-empty {
  text-align: center;
  padding: 56px 20px;
}
.kb-empty-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #f5f1e9;
  color: #d9a441;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 1.3rem;
}

@media (prefers-reduced-motion: reduce) {
  .kb-dot.pulse,
  .sk-line {
    animation: none;
  }
}

@media (max-width: 576px) {
  .kb-panel {
    padding: 20px 16px 24px;
  }
  .kb-panel-head {
    flex-direction: column;
  }
  .kb-new-btn {
    width: 100%;
  }
}
</style>