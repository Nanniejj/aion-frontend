<template>
  <div class="users-card">
    <table class="users-table">
      <thead>
        <tr>
          <th>ผู้ใช้</th>
          <th v-for="f in fields" :key="f.key">{{ f.label }}</th>
          <th>วันหมดอายุ</th>
          <th class="actions-col">การจัดการ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(u, i) in users" :key="u._id || i">
          <td class="name-td">
            <div class="name-cell">
              <div class="user-avatar" :style="{ background: avatarColor(i) }">{{ u.initial }}</div>
              <div class="name-cell-text">
                <span class="user-name">{{ u.name }}</span>
                <span class="user-subline">{{ u.role }} · {{ u.email }}</span>
              </div>
            </div>
          </td>
          <td data-label="สถานะ">
            <span class="status-pill" :class="u.status === 'ใช้งานอยู่' ? 'status-active' : 'status-inactive'">
              {{ u.status }}
            </span>
          </td>
          <td class="mono joined-cell" data-label="เข้าร่วมเมื่อ">{{ u.joined }}</td>
          <td class="mono expiry-cell" data-label="วันหมดอายุ">
            <span v-if="!u.expiresAt" class="expiry-none">ไม่มีกำหนด</span>
            <span v-else class="expiry-value" :class="{ expired: isExpired(u.expiresAt) }">
              {{ formatExpiry(u.expiresAt) }}
              <span v-if="isExpired(u.expiresAt)" class="expiry-badge">หมดอายุแล้ว</span>
            </span>
          </td>
          <td data-label="การจัดการ">
            <div class="row-actions">
              <button
                type="button"
                class="row-action-btn edit"
                title="แก้ไขผู้ใช้"
                @click="$refs.editModal.open(u)"
              >
                <b-icon icon="pencil-square"></b-icon>
              </button>
              <button
                type="button"
                class="row-action-btn delete"
                title="ลบผู้ใช้"
                @click="confirmDelete(u)"
              >
                <b-icon icon="trash"></b-icon>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="users.length === 0" class="empty-state">
      ไม่พบผู้ใช้งานที่ตรงกับ "{{ query }}"
    </div>

    <EditUserModal ref="editModal" :projects="projects" @updated="$emit('updated', $event)" />
  </div>
</template>

<script>
import EditUserModal from './users/EditUserModal.vue';
// Same palette as AvatarStack, assigned by row position so colors stay
// distinct across the visible list.

const AVATAR_COLORS = [
  "#5B8DEF",
  "#8B7FE0",
  "#E0A458",
  "#5FB0A6",
  "#D97C9C",
  "#6FBF73",
  "#E06B6B",
  "#4A6FA5",
];

export default {
  name: "UserMain",
  components: { EditUserModal },
  props: {
    users: { type: Array, default: () => [] },
    query: { type: String, default: "" },
    // Forwarded straight to EditUserModal's project picker.
    projects: { type: Array, default: () => [] },
  },
  data() {
    return {
      fields: [
        { key: "status", label: "สถานะ" },
        { key: "joined", label: "เข้าร่วมเมื่อ" },
      ],
    };
  },
  methods: {
    avatarColor(i) {
      return AVATAR_COLORS[i % AVATAR_COLORS.length];
    },
    formatExpiry(iso) {
      const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
      const d = new Date(iso + "T00:00:00");
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
    },
    isExpired(iso) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(iso + "T00:00:00") < today;
    },
    confirmDelete(user) {
      if (window.confirm(`ต้องการลบผู้ใช้ "${user.name}" ใช่หรือไม่?`)) {
        this.$emit("delete", user);
      }
    },
  },
};
</script>

<style scoped>
/*
  Self-contained: plain <table> instead of b-card/b-table, with colors
  hard-coded directly (no CSS variables) so it renders correctly even
  without the shared theme.css loaded.
*/

.users-card {
  background: #ffffff;
  border: 1px solid #e4e1d8;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(28, 30, 36, 0.04);
  overflow: hidden;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.users-table thead th {
  background:  #ffffff;
  font-size: 14px;
  letter-spacing: 0.05em;
  font-weight: 400;
  padding: 14px 20px;
  border-bottom: 1px solid #e4e1d8;
  white-space: nowrap;
}

.users-table tbody tr {
  transition: background 0.12s ease;
}
.users-table tbody tr:hover {
  background:  #f6f5f0;
}
.users-table tbody tr:not(:last-child) td {
  border-bottom: 1px solid  #edebe3;
}

.users-table td {
  padding: 14px 20px;
  font-size: 14px;
  vertical-align: middle;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.name-cell-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  flex-shrink: 0;
}

.user-name {
  font-weight: 500;
}

.user-subline {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-pill {
  display: inline-block;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}
.status-active {
  background: rgba(18, 129, 137, 0.12);
  color:  #128189;
}
.status-inactive {
  background: rgba(107, 114, 128, 0.12);
  color:  #6b7280;
}

.joined-cell {
  font-size: 14px;
  white-space: nowrap;
}

.expiry-cell {
  font-size: 14px;
  white-space: nowrap;
}
.expiry-none {
  color: #9aa0ac;
  font-style: italic;
}
.expiry-value {
  color: #1c1e24;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.expiry-value.expired {
  color: #c0392b;
}
.expiry-badge {
  display: inline-block;
  background: rgba(192, 57, 43, 0.1);
  color: #c0392b;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

.empty-state {
  padding: 24px 20px;
  font-size: 14px;
}

.actions-col {
  width: 1%;
  white-space: nowrap;
}

.row-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.row-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid #e4e1d8;
  background: #ffffff;
  color: #6b7280;
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease, border-color 0.12s ease;
}
.row-action-btn.edit:hover {
  background: rgba(18, 129, 137, 0.1);
  border-color: #128189;
  color: #128189;
}
.row-action-btn.delete:hover {
  background: rgba(192, 57, 43, 0.1);
  border-color: #c0392b;
  color: #c0392b;
}

/* ---- Card layout on small screens ---- */
@media (max-width: 700px) {
  .users-card {
    background: transparent;
    border: none;
    box-shadow: none;
    overflow: visible;
  }

  .users-table,
  .users-table thead,
  .users-table tbody,
  .users-table tr,
  .users-table td {
    display: block;
    width: 100%;
  }

  .users-table thead {
    /* Header row isn't needed — each cell shows its own label instead. */
    display: none;
  }

  .users-table tbody tr {
    background: #ffffff;
    border: 1px solid #e4e1d8;
    border-radius: 12px;
    box-shadow: 0 1px 2px rgba(28, 30, 36, 0.04);
    margin-bottom: 12px;
    padding: 4px 16px;
  }
  .users-table tbody tr:hover {
    background: #ffffff;
  }
  .users-table tbody tr:not(:last-child) td {
    border-bottom: none;
  }

  .users-table td {
    padding: 10px 0;
    border-bottom: 1px solid #edebe3;
  }
  .users-table td:last-child {
    border-bottom: none;
  }

  /* Name cell stays as a plain block — it's the card's header, not a
     label/value row. */
  .name-td {
    padding-top: 14px;
  }
  .user-avatar {
    width: 36px;
    height: 36px;
    font-size: 15px;
  }
  .user-name {
    font-size: 15px;
  }

  /* Every other cell becomes a "label: value" row via the data-label
     attribute set on each <td> in the template. */
  td[data-label] {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  td[data-label]::before {
    content: attr(data-label);
    font-size: 13px;
    font-weight: 500;
    color: #6b7280;
    flex-shrink: 0;
  }

  .row-actions {
    justify-content: flex-end;
  }
}
</style>