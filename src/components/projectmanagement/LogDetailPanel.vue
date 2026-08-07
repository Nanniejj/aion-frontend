<template>
  <div class="log-detail-panel">
    <div v-if="showUser && log.user" class="log-detail-user">
      <AvatarStack :users="[avatarUser]" large />
      <div class="log-detail-user-info">
        <div class="log-detail-user-name">{{ userName }}</div>
        <div class="log-detail-user-meta">
          <span v-if="log.user.username" class="mono">@{{ log.user.username }}</span>
          <span v-if="log.user.email"> {{ log.user.email }}</span>
        </div>
      </div>
      <span v-if="log.user.role" class="log-detail-user-role">{{ log.user.role }}</span>
    </div>

    <div v-if="log.errorMessage" class="log-detail-error">
      <b-icon icon="exclamation-triangle-fill"></b-icon> {{ log.errorMessage }}
    </div>

    <div class="log-detail-meta">
      <div class="log-detail-field">
        <b-icon icon="link-45deg" class="log-detail-icon"></b-icon>
        <div>
          <span class="log-detail-label">Endpoint</span>
          <span class="log-detail-value mono">{{ log.endpoint || "-" }}</span>
        </div>
      </div>
      <div class="log-detail-field">
        <b-icon icon="stopwatch" class="log-detail-icon"></b-icon>
        <div>
          <span class="log-detail-label">ระยะเวลา</span>
          <span class="log-detail-value">{{ log.durationMs != null ? log.durationMs + " ms" : "-" }}</span>
        </div>
      </div>
      <div class="log-detail-field">
        <b-icon icon="bullseye" class="log-detail-icon"></b-icon>
        <div>
          <span class="log-detail-label">Target</span>
          <span class="log-detail-value"
            >{{ log.targetType || "-" }}<span v-if="log.targetId" class="mono"> · {{ log.targetId }}</span></span
          >
        </div>
      </div>
      <div class="log-detail-field">
        <b-icon icon="geo-alt" class="log-detail-icon"></b-icon>
        <div>
          <span class="log-detail-label">IP Address</span>
          <span class="log-detail-value mono">{{ log.ipAddress || "-" }}</span>
        </div>
      </div>
      <div class="log-detail-field log-detail-field-full">
        <b-icon icon="laptop" class="log-detail-icon"></b-icon>
        <div>
          <span class="log-detail-label">User Agent</span>
          <span class="log-detail-value mono">{{ log.userAgent || "-" }}</span>
        </div>
      </div>
    </div>

    <div v-if="log.detail && (log.detail.before || log.detail.after)" class="log-detail-changes">
      <div class="log-detail-changes-head"><b-icon icon="pencil-square"></b-icon> การเปลี่ยนแปลง</div>

      <div class="log-diff-row-wrap">
        <b-row align-v="stretch">
          <b-col v-if="log.detail.before" :md="log.detail.after ? 6 : 12">
            <b-card class="log-diff-card is-before" :class="{ 'is-solo': !log.detail.after }" no-body>
              <template #header>
                <b-icon icon="x-circle-fill"></b-icon>
                <span>Before</span>
                <span class="log-diff-card-sub">ข้อมูลก่อนแก้ไข</span>
              </template>
              <b-card-body>
                <div
                  v-for="(val, key) in log.detail.before"
                  :key="key"
                  class="log-diff-kv"
                  :class="{
                    'is-changed': !Array.isArray(val) && isChangedField(key, log.detail.before, log.detail.after),
                    'is-list': Array.isArray(val),
                  }"
                >
                  <span class="log-diff-kv-key">{{ key }}</span>
                  <div v-if="Array.isArray(val)" class="log-diff-kv-list">
                    <span v-if="val.length === 0" class="log-diff-kv-val">ว่างเปล่า</span>
                    <span
                      v-for="(v, i) in val"
                      :key="i"
                      class="log-diff-kv-item"
                      :class="{ 'is-removed': notIn(log.detail.after && log.detail.after[key], v) }"
                      >{{ v }}</span
                    >
                  </div>
                  <span v-else class="log-diff-kv-val">{{ formatDiffValue(val, key) }}</span>
                </div>
              </b-card-body>
            </b-card>
          </b-col>

          <!-- Connecting line between the two cards: absolutely positioned
               overlay on desktop (contributes no width to the flex row),
               normal-flow block on mobile so it naturally falls between
               the two stacked cards in source order. -->
          <div v-if="log.detail.before && log.detail.after" class="log-diff-connector d-none d-md-flex">
            <span class="log-diff-connector-line log-diff-connector-line-top"></span>
            <span class="log-diff-connector-icon"><b-icon icon="arrow-right" font-scale="0.85"></b-icon></span>
            <span class="log-diff-connector-line log-diff-connector-line-bottom"></span>
          </div>
          <div v-if="log.detail.before && log.detail.after" class="log-diff-connector-mobile d-flex d-md-none">
            <span class="log-diff-connector-line-h"></span>
            <span class="log-diff-connector-icon"><b-icon icon="arrow-down" font-scale="0.85"></b-icon></span>
            <span class="log-diff-connector-line-h"></span>
          </div>

          <b-col v-if="log.detail.after" :md="log.detail.before ? 6 : 12">
            <b-card class="log-diff-card is-after" :class="{ 'is-solo': !log.detail.before }" no-body>
              <template #header>
                <b-icon icon="check-circle-fill"></b-icon>
                <span>After</span>
                <span class="log-diff-card-sub">ข้อมูลหลังแก้ไข</span>
              </template>
              <b-card-body>
                <div
                  v-for="(val, key) in log.detail.after"
                  :key="key"
                  class="log-diff-kv"
                  :class="{
                    'is-changed': !Array.isArray(val) && isChangedField(key, log.detail.before, log.detail.after),
                    'is-list': Array.isArray(val),
                  }"
                >
                  <span class="log-diff-kv-key">{{ key }}</span>
                  <div v-if="Array.isArray(val)" class="log-diff-kv-list">
                    <span v-if="val.length === 0" class="log-diff-kv-val">ว่างเปล่า</span>
                    <span
                      v-for="(v, i) in val"
                      :key="i"
                      class="log-diff-kv-item"
                      :class="{ 'is-added': notIn(log.detail.before && log.detail.before[key], v) }"
                      >{{ v }}</span
                    >
                  </div>
                  <span v-else class="log-diff-kv-val">{{ formatDiffValue(val, key) }}</span>
                </div>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
// Shared "log detail" panel — the same expanded view used for a row's
// details, wherever a log/audit-log entry can be clicked open. Pulled
// out of ProjectDetail.vue so ProjectDetail.vue's audit-log table and
// UserMain.vue's per-user log list both render exactly the same thing
// instead of maintaining two copies of this markup.
import AvatarStack from "./AvatarStack.vue";

export default {
  name: "LogDetailPanel",
  components: { AvatarStack },
  props: {
    log: { type: Object, required: true },
    // ProjectDetail.vue's audit log covers many users, so the panel shows
    // who performed the action. UserMain.vue's log list already lives
    // inside a single user's own history modal, so that block is
    // redundant there — pass :show-user="false" to hide it.
    showUser: { type: Boolean, default: true },
  },
  computed: {
    userName() {
      const u = this.log.user;
      if (!u) return "ไม่ทราบผู้ใช้";
      return u.fullName || u.name || u.username || "ไม่ทราบผู้ใช้";
    },
    avatarUser() {
      return {
        id: this.log.user && this.log.user._id,
        name: this.userName,
        initial: this.userName ? this.userName.charAt(0).toUpperCase() : "?",
      };
    },
  },
  methods: {
    notIn(arr, val) {
      return !Array.isArray(arr) || !arr.includes(val);
    },
    isChangedField(key, before, after) {
      if (!before || !after) return false;
      return JSON.stringify(before[key]) !== JSON.stringify(after[key]);
    },
    formatDiffValue(val, key) {
      if (val === null || val === undefined) return "ไม่มีค่า";
      if (Array.isArray(val)) {
        if (val.length === 0) return "ว่างเปล่า";
        return val.map((v) => (typeof v === "object" ? JSON.stringify(v) : String(v))).join(", ");
      }
      if (typeof val === "object") return JSON.stringify(val);
      if (typeof val === "string" && this.isDateLikeField(key) && this.isIsoDateString(val)) {
        return this.formatDiffDate(val);
      }
      return String(val);
    },
    // Field-name heuristic (camelCase keys ending in "At", e.g. createdAt,
    // updatedAt, accountExpiresAt) combined with an actual ISO-timestamp
    // value check below, so a field that merely happens to be named
    // similarly but isn't a date doesn't get misformatted.
    isDateLikeField(key) {
      return typeof key === "string" && /At$/.test(key);
    },
    isIsoDateString(val) {
      return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val);
    },
    formatDiffDate(iso) {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543} ${hh}:${mm}`;
    },
  },
};
</script>

<style scoped>
.log-detail-panel {
  padding: 16px 20px;
  background: #fafaf8;
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: left;
}

.log-detail-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid #e4e1d8;
}
.log-detail-user-info {
  min-width: 0;
}
.log-detail-user-name {
  font-size: 15px;
  font-weight: 700;
  color: #1c1e24;
}
.log-detail-user-meta {
  font-size: 14px;
  color: #6b7280;
  overflow-wrap: anywhere;
}
.log-detail-user-role {
  margin-left: auto;
  flex-shrink: 0;
  align-self: flex-start;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #128189;
  background: rgba(18, 129, 137, 0.1);
  border-radius: 999px;
  padding: 4px 10px;
}

.log-detail-error {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(192, 57, 43, 0.08);
  border: 1px solid rgba(192, 57, 43, 0.2);
  color: #c0392b;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  text-align: left;
}

.log-detail-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 24px;
  text-align: left;
}

.log-detail-field {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
  text-align: left;
}
.log-detail-field > div {
  min-width: 0;
  flex: 1;
}

.log-detail-field-full {
  grid-column: 1 / -1;
}

.log-detail-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: #9aa0ac;
  font-size: 14px;
}

.log-detail-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #9aa0ac;
}

.log-detail-value {
  display: block;
  font-size: 13.5px;
  color: #1c1e24;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.log-detail-value.mono {
  font-size: 14px;
  overflow-wrap: anywhere;
}

/* Before/After shown as b-card pairs */
.log-detail-changes {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  border-top: 1px dashed #e4e1d8;
  padding-top: 14px;
}

.log-detail-changes-head {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #6b7280;
}

.log-diff-row-wrap {
  position: relative;
}
@media (min-width: 768px) {
  .log-diff-row-wrap .row {
    margin-left: -32px;
    margin-right: -32px;
  }
  .log-diff-row-wrap .col-md-6 {
    padding-left: 32px;
    padding-right: 32px;
    display: flex;
  }
}

.log-diff-card.card {
  border-radius: 14px;
  border: 1px solid #e4e1d8;
  width: 100%;
  max-width: 340px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(28, 30, 36, 0.05);
  margin-left: auto;
  margin-right: auto;
}
.log-diff-card.is-solo {
  max-width: 480px;
}
.log-diff-card .card-header {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 700;
  border-bottom: none;
}
.log-diff-card-sub {
  font-size: 11px;
  font-weight: 400;
  color: #6b7280;
  margin-left: auto;
}
.log-diff-card.is-before {
  border-top: 3px solid #c0392b;
}
.log-diff-card.is-before .card-header {
  background: rgba(192, 57, 43, 0.06);
  color: #c0392b;
}
.log-diff-card.is-after {
  border-top: 3px solid #128189;
}
.log-diff-card.is-after .card-header {
  background: rgba(18, 129, 137, 0.06);
  color: #128189;
}
.log-diff-card .card-body {
  padding: 10px 14px;
}

/* Connector between the two cards */
.log-diff-connector {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60px;
  z-index: 3;
  pointer-events: none;
}
.log-diff-connector-line {
  flex: 1;
  width: 1px;
  background: linear-gradient(to bottom, transparent, #d8d5cb);
}
.log-diff-connector-line-bottom {
  background: linear-gradient(to top, transparent, #d8d5cb);
}
.log-diff-connector-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #e4e1d8;
  color: #6b7280;
  box-shadow: 0 1px 3px rgba(28, 30, 36, 0.08);
}

/* Mobile: cards stack, so the connector runs horizontally between them
   instead of vertically. Normal flow (not absolute) so it naturally
   lands between the two cards via flex-wrap's source order. */
.log-diff-connector-mobile {
  width: 100%;
  align-items: center;
  gap: 10px;
  margin: -2px 0 10px;
}
.log-diff-connector-line-h {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, #d8d5cb, transparent);
}

.log-diff-kv {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  padding: 5px 0;
  border-bottom: 1px solid #f2f0e9;
  font-size: 14px;
}
.log-diff-kv:last-child {
  border-bottom: none;
}
.log-diff-kv-key {
  flex-shrink: 0;
  color: #9aa0ac;
  font-size: 14px;
}
.log-diff-kv-val {
  text-align: right;
  color: #1c1e24;
  word-break: break-word;
  min-width: 0;
}
.log-diff-kv.is-list {
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
}
.log-diff-kv-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
}
.log-diff-kv-item {
  display: inline-flex;
  align-items: center;
  width: auto;
  max-width: 100%;
  font-size: 12px;
  color: #6b7280;
  background: rgba(28, 30, 36, 0.04);
  border-radius: 999px;
  padding: 3px 10px;
  word-break: break-all;
}
.log-diff-kv-item.is-removed {
  background: rgba(192, 57, 43, 0.12);
  color: #c0392b;
  font-weight: 600;
  text-decoration: line-through;
}
.log-diff-kv-item.is-added {
  background: rgba(18, 129, 137, 0.12);
  color: #128189;
  font-weight: 600;
}
.log-diff-kv.is-changed {
  background: rgba(193, 121, 31, 0.07);
  margin: 0 -8px;
  padding: 6px 8px;
  border-radius: 6px;
  border-bottom: none;
}
.log-diff-kv.is-changed .log-diff-kv-val {
  font-weight: 600;
}
.log-diff-card.is-before .log-diff-kv.is-changed .log-diff-kv-val {
  color: #c0392b;
}
.log-diff-card.is-after .log-diff-kv.is-changed .log-diff-kv-val {
  color: #128189;
}

@media (max-width: 767px) {
  .log-detail-meta {
    grid-template-columns: 1fr;
  }

  .log-detail-user-meta {
    overflow-wrap: unset;
  }

  /* Before/After cards: stack full-width instead of the fixed-width,
     margin-auto-centered layout meant for the side-by-side desktop view. */
  .log-diff-card.card {
    max-width: none;
  }
  .log-diff-card.is-before,
  .log-diff-card.is-after {
    margin-left: 0;
    margin-right: 0;
  }
  .log-diff-row-wrap .col-md-6:not(:last-child) {
    margin-bottom: 16px;
  }
}
</style>