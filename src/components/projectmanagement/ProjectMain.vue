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
            <th class="num-col">จำนวนผู้ใช้ที่ดูแล</th>
            <th class="num-col">จำนวนโดเมน</th>
            <th>สร้างเมื่อ</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(project, i) in projects" :key="project._id" class="project-row" @click="$emit('open', project)">
            <td data-label="โปรเจกต์">
              <div class="project-name-cell">
                <span class="project-avatar" :style="{ background: avatarColor(i) }">{{ initial(project) }}</span>
                <span class="project-name">{{ project.projectname || "-" }}</span>
              </div>
            </td>
            <td data-label="จำนวนผู้ใช้" class="num-col users-count-cell">
              <!-- <span class="" :class="{ 'is-zero': userCount(project) === 0 }"> -->
                <AvatarStack :users="project.userlist || []" :max="5" />
              <!-- </span> -->
            </td>
            <td data-label="จำนวนโดเมน" class="num-col">
              <span class="count-badge" :class="{ 'is-zero': domainCount(project) === 0 }">{{ domainCount(project) }} หัวเรื่อง</span>
            </td>
            <td data-label="สร้างเมื่อ" class="mono">{{ formatDate(project.createdAt) }}</td>
            <td data-label="การจัดการ">
            <div class="row-actions">
               <b-button size="sm" variant="danger">Button</b-button>
              <!-- <button
                type="button"
                class="row-action-btn edit"
                title="แก้ไขผู้ใช้"
                @click="$refs.editModal.open(u)"
              >
                <b-icon icon="pencil-square"></b-icon>
              </button> -->
              
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
  font-size: 13px;
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
  text-align: right;
}

.projects-table tbody td {
  padding: 13px 16px;
  font-size: 14px;
  color: #1c1e24;
  border-bottom: 1px solid #f0eee6;
}
.projects-table tbody td.num-col {
  text-align: right;
}
.projects-table tbody td.users-count-cell {
  display: flex;
  justify-content: flex-end;
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

.project-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  color: #ffffff;
  font-size: 13px;
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
  font-size: 13px;
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
  font-size: 13px;
}

.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 25px 4px 0;
}

.pagination-info {
  font-size: 13px;
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
    border-bottom: 1px solid #f0eee6;
    padding: 10px 0;
  }
  .projects-table tbody td:last-child {
    border-bottom: none;
  }

  /* Name cell stays a plain block — it's the card's header, not a
     label/value row. */
  td[data-label="โปรเจกต์"] {
    padding-top: 14px;
  }

  /* Every other cell becomes a "label: value" row via the data-label
     attribute set on each <td> in the template. */
  td[data-label]:not([data-label="โปรเจกต์"]) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  td[data-label]:not([data-label="โปรเจกต์"])::before {
    content: attr(data-label);
    font-size: 13px;
    font-weight: 500;
    color: #6b7280;
    flex-shrink: 0;
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