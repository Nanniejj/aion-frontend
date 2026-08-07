<template>
  <div>
    <div v-if="loading" class="suggest-loading">
      <div class="suggest-loading-spinner">
        <vue-element-loading
          :active="loading"
          size="60"
          background-color="rgba(255, 255, 255, 0.3)"
          color="#ede7dd"
        />
      </div>
      <span>กำลังโหลดโปรเจกต์...</span>
    </div>

    <!-- Card grid (default) -->
    <div v-else-if="viewMode === 'cards'" class="cards-grid">
      <!--
        @open="$emit('open', $event)" relays the click event from each
        ProjectCard up to whoever uses <ProjectGrid> — without this line,
        clicking a card does nothing.
        @edit does the same for the card's "แก้ไข" menu item, @close for
        "ปิดโปรเจกต์" (sets mion: false).
      -->

      <ProjectCard
        v-for="project in projects"
        :key="(project._id && project._id) || project._id"
        :project="project"
        @open="$emit('open', $event)"
        @edit="$emit('edit', $event)"
        @close="$emit('close', $event)"
      />

      <div v-if="projects.length === 0" class="empty-note">
        ไม่พบโปรเจกต์ที่ตรงกับ "{{ query }}"
      </div>
    </div>

    <!-- Table layout -->
    <div v-else class="projects-table-wrap">
      <table class="projects-table">
        <thead>
          <tr>
            <th>โปรเจกต์</th>
            <th class="num-col">ผู้ใช้ที่ดูแล</th>
            <th class="num-col">จำนวนโดเมน</th>
            <th >สร้างเมื่อ</th>
            <th class="d-flex justify-content-center">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(project, i) in projects" :key="project._id" class="project-row" @click="$emit('open', project)">
            <td data-label="โปรเจกต์">
              <div class="project-name-cell">
                <span class="project-avatar" :style="{ background: avatarColor(i) }">{{ initial(project) }}</span>
                <span class="project-name">{{ project.projectname || "-" }}</span>
              </div>
               <div class="project-status-badge mt-2" :class="project.status === 'active' ? 'is-active' : 'is-inactive'">
                  <span class="project-status-dot"></span>
                  {{ project.status === "active" ? "ใช้งาน" : "ปิดใช้งาน" }}
                </div>
            </td>
            <td data-label="จำนวนผู้ใช้" class="num-col users-count-cell">
              <div class="users-count-inner">
                <AvatarStack :users="project.userlist || []" :max="5" />
              </div>
            </td>
            <td data-label="จำนวนโดเมน" class="num-col">
              <span class="count-badge" :class="{ 'is-zero': domainCount(project) === 0 }">{{ domainCount(project) }} หัวเรื่อง</span>
            </td>
            <td data-label="สร้างเมื่อ" class="mono">{{ formatDate(project.createdAt) }}</td>
            <td data-label="การจัดการ">
            <div class="row-actions">
              <button
                type="button"
                class="row-action-btn view"
                title="เปิดรายละเอียดโปรเจกต์"
                @click.stop="$emit('open', project)"
              >
                <b-icon icon="eye"></b-icon>
                
              </button>
              <button
                type="button"
                class="row-action-btn edit"
                title="แก้ไขโปรเจกต์"
                @click.stop="$emit('edit', project)"
              >
                <b-icon icon="pencil-square"></b-icon>
                แก้ไข
              </button>
            </div>
          </td>
          </tr>
        </tbody>
      </table>

      <div v-if="projects.length === 0" class="empty-note">
        ไม่พบโปรเจกต์ที่ตรงกับ "{{ query }}"
      </div>
    </div>

    <div v-if="pagination && totalPages > 1" class="pagination-bar">
      <span class="pagination-info">
        หน้า {{ pagination.page }} จาก {{ totalPages }} ( ทั้งหมด {{ pagination.total }} รายการ )
      </span>
      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        align="center"
        class="my-2"
        @input="onPageChange"
      />
    </div>
  </div>
</template>

<script>
import ProjectCard from "./project/ProjectCard.vue";
import VueElementLoading from "vue-element-loading";
import AvatarStack from "./AvatarStack.vue";
// Same palette as UserMain's avatars, assigned by row position so colors
// stay distinct across the visible list.
const AVATAR_COLORS = [
  "#128189",
  "#8B7FE0",
  "#E0A458",
  "#5FB0A6",
  "#D97C9C",
  "#6FBF73",
  "#5B8DEF",
  "#4A6FA5",
];

export default {
  name: "ProjectGrid",
  components: { ProjectCard, VueElementLoading, AvatarStack },
  props: {
    projects: { type: Array, required: true },
    query: { type: String, default: "" },
    viewMode: { type: String, default: "cards" }, // 'cards' | 'progress'
    // Shape: { page, limit, total, totalPages }. Pass getProjectsPagination
    // from the store; omit or leave null to hide the pagination bar.
    pagination: { type: Object, default: null },
    // Pass getLoadingProjects from the store — shows a spinner instead of
    // the grid/table while a fetchProjects request is in flight.
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      currentPage: this.pagination ? this.pagination.page : 1,
      // b-pagination can emit 'input' twice for a single click (both
      // before either fetch resolves), so comparing against the
      // pagination *prop* isn't enough — that only catches a delayed
      // echo, not two emissions firing back-to-back. Track the page we
      // already acted on ourselves instead.
      requestedPage: null,
    };
  },
  computed: {
    totalPages() {
      if (!this.pagination) return 1;
      if (this.pagination.totalPages) return this.pagination.totalPages;
      if (!this.pagination.limit) return 1;
      return Math.max(1, Math.ceil(this.pagination.total / this.pagination.limit));
    },
    totalRows() {
      return this.pagination ? this.pagination.total : 0;
    },
    perPage() {
      return this.pagination ? this.pagination.limit : 12;
    },
  },
  watch: {
    // Keep the b-pagination widget in sync if the page changes from
    // outside (e.g. store updated after a search/filter elsewhere).
    "pagination.page"(newPage) {
      if (newPage && newPage !== this.currentPage) {
        this.currentPage = newPage;
      }
      // An externally-driven page change means any pending "did we
      // already request this page" tracking is now moot — reset so a
      // later click on this same page number isn't mistaken for the
      // earlier duplicate-emit echo.
      this.requestedPage = null;
    },
  },
  methods: {
    initial(project) {
      const name = project.projectname || "";
      return name ? name.charAt(0).toUpperCase() : "?";
    },
    avatarColor(i) {
      return AVATAR_COLORS[i % AVATAR_COLORS.length];
    },
    userCount(project) {
      if (typeof project.userCount === "number") return project.userCount;
      return project.userlist ? project.userlist.length : 0;
    },
    domainCount(project) {
      if (typeof project.domainCount === "number") return project.domainCount;
      return project.domainlist ? project.domainlist.length : 0;
    },
    formatDate(iso) {
      if (!iso) return "-";
      const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
      const d = new Date(iso);
      if (isNaN(d)) return "-";
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
    },
    onPageChange(page) {
      // Guards against b-pagination emitting 'input' more than once for
      // the same click — only the first emission for a given page value
      // actually triggers a fetch.
      if (page === this.requestedPage) return;
      this.requestedPage = page;
      this.$emit("change-page", page);
    },
  },
};
</script>

<style scoped>

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.empty-note {
  color: var(--muted, #6b7280);
  font-size: 14px;
  padding: 24px 4px;
}

.suggest-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 64px 4px;
  color: #6b7280;
  font-size: 14px;
}

.suggest-loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
}

.projects-table-wrap {
  background: #ffffff;
  border: 1px solid #e4e1d8;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(28, 30, 36, 0.04);
}

.projects-table {
  width: 100%;
  border-collapse: collapse;
}

.projects-table thead th {
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 14px 16px;
  border-bottom: 1px solid #e4e1d8;
  background: #f6f5f0;
}
.projects-table thead th.num-col {
  text-align: start;
}

.projects-table tbody td {
  padding: 13px 16px;
  font-size: 14px;
  color: #1c1e24;
  border-bottom: 1px solid #f0eee6;
  text-align: start;
}
.projects-table tbody td.num-col {
  text-align: start;
}
.users-count-inner {
  display: flex;
  justify-content: start;
  align-items: center;
}

.projects-table tbody tr:nth-child(even) {
  background: #fafaf8;
}

.project-row {
  cursor: pointer;
  transition: background 0.12s ease;
}
.project-row:hover {
  background: #f6f5f0;
}
.project-row:last-child td {
  border-bottom: none;
}

.project-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.project-name {
  font-weight: 500;
}

.project-status-badge {
  display: inline-flex;
  justify-content: start;
  align-items: center;
  gap: 5px;
  /* margin-left: auto; */
  flex-shrink: 0;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
.project-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.project-status-badge.is-active {
  background: rgba(47, 168, 106, 0.12);
  color: #2fa86a;
}
.project-status-badge.is-active .project-status-dot {
  background: #2fa86a;
}
.project-status-badge.is-inactive {
  background: rgba(28, 30, 36, 0.06);
  color: #9aa0ac;
}
.project-status-badge.is-inactive .project-status-dot {
  background: #d8d4c8;
}

.project-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  background: rgba(18, 129, 137, 0.1);
  color: #128189;
}
.count-badge.is-zero {
  background: transparent;
  color: #b0b5bd;
  font-weight: 500;
}

.mono {
  /* font-variant-numeric: tabular-nums; */
  color: #6b7280;
  font-size: 14px;
  text-align: start;
}

.row-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}
.row-action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  padding: 6px 12px;
  border: 1px solid rgba(28, 30, 36, 0.08);
  border-radius: 8px;
  background: #fff4de;
  color: #5a3f04;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(28, 30, 36, 0.06);
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
}
.row-action-btn:hover {
  background: #fed16e;
  color: #5a3f04;
}
.row-action-btn.view {
  background: #ffffff;
  color: #1c1e24;
}
.row-action-btn.view:hover {
  background: #f6f5f0;
  border-color: #128189;
  color: #128189;
}

.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 25px 4px 0;
}

.pagination-info {
  font-size: 14px;
  color: #6b7280;
}

@media (max-width: 700px) {
  .projects-table-wrap {
    background: transparent;
    border: none;
    box-shadow: none;
    overflow: visible;
  }

  .projects-table thead {
    display: none;
  }
  .projects-table,
  .projects-table tbody,
  .projects-table tr,
  .projects-table td {
    display: block;
    width: 100%;
  }
  .project-row {
    background: #ffffff;
    border: 1px solid #e4e1d8;
    border-radius: 12px;
    box-shadow: 0 1px 2px rgba(28, 30, 36, 0.04);
    margin-bottom: 12px;
    padding: 4px 16px;
  }
  .projects-table tbody tr:nth-child(even) {
    background: #ffffff;
  }
  .project-row:hover {
    background: #ffffff;
  }

  .projects-table tbody td {
    border-bottom: none;
    padding: 10px 0;
  }

  /* Name cell stays a plain block — it's the card's header, not a
     label/value row. */
  td[data-label="โปรเจกต์"] {
    padding-top: 14px;
  }

  /* Every other cell becomes a "label: value" row via the data-label
     attribute set on each <td> in the template — except "การจัดการ",
     which shows just the action buttons (a label there only crowds them). */
  td[data-label]:not([data-label="โปรเจกต์"]):not([data-label="การจัดการ"]) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  td[data-label]:not([data-label="โปรเจกต์"]):not([data-label="การจัดการ"])::before {
    content: attr(data-label);
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
    flex-shrink: 0;
  }
  td[data-label="การจัดการ"] {
    padding-top: 6px;
  }
  .row-actions {
    justify-content: flex-start;
  }
  .projects-table tbody td.num-col {
    text-align: left;
  }
  .projects-table tbody td.users-count-cell {
    justify-content: space-between;
  }

  .pagination-bar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>