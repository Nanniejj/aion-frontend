<template>
  <div class="users-card">
    <table class="users-table">
      <thead>
        <tr>
          <th v-for="f in fields" :key="f.key">{{ f.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(u, i) in users" :key="u._id || i">
          <td>
            <div class="name-cell">
              <div class="user-avatar" :style="{ background: avatarColor(i) }">{{ u.initial }}</div>
              <span class="user-name">{{ u.name }}</span>
            </div>
          </td>
          <td class="muted-cell">{{ u.role }}</td>
          <td class="muted-cell">
            <span class="email-cell">
              <!-- <b-icon icon="envelope-fill"></b-icon> -->
              {{ u.email }}
            </span>
          </td>
          <td>
            <span class="status-pill" :class="u.status === 'ใช้งานอยู่' ? 'status-active' : 'status-inactive'">
              {{ u.status }}
            </span>
          </td>
          <td class="mono joined-cell">{{ u.joined }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="users.length === 0" class="empty-state">
      ไม่พบผู้ใช้งานที่ตรงกับ "{{ query }}"
    </div>
  </div>
</template>

<script>
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
  name: "UserTable",
  props: {
    users: { type: Array, required: true },
    query: { type: String, default: "" },
  },
  data() {
    return {
      fields: [
        { key: "name", label: "ชื่อ" },
        { key: "role", label: "ตำแหน่ง" },
        { key: "email", label: "อีเมล" },
        { key: "status", label: "สถานะ" },
        { key: "joined", label: "เข้าร่วมเมื่อ" },
      ],
    };
  },
  methods: {
    avatarColor(i) {
      return AVATAR_COLORS[i % AVATAR_COLORS.length];
    },
  },
};
</script>

<style scoped>
/*
  Self-contained: plain <table> instead of b-card/b-table, with fallback
  values on every var(--token, fallback) so it renders correctly even
  without the shared theme.css loaded.
*/

.users-card {
  background: var(--surface, #ffffff);
  border: 1px solid var(--border, #e4e1d8);
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
  border-bottom: 1px solid var(--border, #e4e1d8);
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

.muted-cell {
  color: var(--muted, #6b7280);
  font-size: 14px;
}

.email-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
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

.empty-state {
  padding: 24px 20px;
  font-size: 14px;
}
</style>