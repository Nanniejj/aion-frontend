<template>
  <!-- ✅ หน้า Feed: TOP 10 Domain (API v2 /wordcloud/getTop10Domain) แสดงใน sidebar -->
  <div class="top-domain">
    <div class="feed-card-head">
      <span class="feed-card-title">
        <i class="fa fa-folder-open mr-2" aria-hidden="true"></i>TOP 10 Domain
      </span>
      <span class="small text-muted">(จำนวนโพสต์)</span>
    </div>

    <div class="position-relative td-body">
      <vue-element-loading :active="isLoading" size="40" background-color="rgba(255,255,255,0.6)"
        color="#17a2b891" />

      <div v-if="error" class="py-3 text-center text-danger small">
        {{ error }}
        <a href="#" class="ml-1" @click.prevent="fetchTop10(true)">ลองใหม่</a>
      </div>

      <div v-else-if="!isLoading && !items.length" class="py-3 text-center text-muted small">
        ไม่พบข้อมูล Domain
      </div>

      <ol v-else class="td-list">
        <li v-for="(d, i) in items" :key="d.id" class="td-row" v-b-tooltip.hover.left
          :title="d.name + ' : ' + fmt(d.total) + ' โพสต์'">
          <span class="td-rank" :class="'td-rank-' + (i + 1)">{{ i + 1 }}</span>
          <div class="td-main">
            <div class="td-line">
              <span class="td-name">{{ d.name }}</span>
              <span class="td-total">{{ fmt(d.total) }}</span>
            </div>
            <div class="td-bar">
              <div class="td-bar-fill" :style="{ width: barWidth(d.total) }"></div>
            </div>
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_V2_URL } from "@/common/config";

export default {
  name: "TopDomainFeed",
  props: {
    start: { type: String, default: "" },
    end: { type: String, default: "" },
    // "true" = วันที่ระบบเก็บโพสต์ (ส่ง dashboard=true) / "" = วันที่โพสต์ (ไม่ส่ง)
    dashboard: { type: String, default: "" },
    source: { type: String, default: "" },
  },
  data() {
    return {
      items: [],
      isLoading: false,
      error: "",
      _cancelSource: null,
      _lastKey: "",
    };
  },
  computed: {
    fetchKey() {
      return `${this.start}|${this.end}|${this.dashboard}|${this.source}`;
    },
    maxTotal() {
      return this.items.reduce((m, d) => Math.max(m, Number(d.total) || 0), 0);
    },
  },
  watch: {
    fetchKey: {
      immediate: true,
      handler() {
        this.fetchTop10();
      },
    },
  },
  methods: {
    fmt(n) {
      const v = Number(n);
      return isFinite(v) ? v.toLocaleString("en-US") : "0";
    },
    barWidth(total) {
      if (!this.maxTotal) return "0%";
      return Math.max(3, Math.round(((Number(total) || 0) / this.maxTotal) * 100)) + "%";
    },
    async fetchTop10(force = false) {
      if (!force && this._lastKey === this.fetchKey) return;
      const token = localStorage.getItem("token") || "";
      if (!token) {
        this.error = "ไม่พบ token";
        return;
      }

      if (this._cancelSource) this._cancelSource.cancel("Cancelled due to new request");
      this._cancelSource = axios.CancelToken.source();

      this._lastKey = this.fetchKey;
      this.isLoading = true;
      this.error = "";
      this.items = [];

      try {
        const params = { source: this.source || "", start: this.start, end: this.end, monitor: "true" }; // ✅ หน้า Feed ใช้ monitor เท่านั้น
        if (this.dashboard === "true") params.dashboard = "true";

        const res = await axios.get(`${API_V2_URL}/api/v2/wordcloud/getTop10Domain`, {
          params,
          headers: { Authorization: `Bearer ${token}` },
          cancelToken: this._cancelSource.token,
        });
        const list = (res.data && res.data.top10Domain) || [];
        this.items = Array.isArray(list) ? list.slice(0, 10) : [];
        this.isLoading = false;
      } catch (err) {
        if (axios.isCancel(err)) return;
        this._lastKey = "";
        this.error =
          (err.response && err.response.data && err.response.data.message) ||
          err.message ||
          "โหลดข้อมูลไม่สำเร็จ";
        this.isLoading = false;
      }
    },
  },
  beforeDestroy() {
    if (this._cancelSource) {
      try {
        this._cancelSource.cancel("Component destroyed");
      } catch (e) { }
    }
  },
};
</script>

<style scoped>
.feed-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}
.feed-card-title {
  font-weight: 700;
  font-size: 17px;
  color: #2c3e50;
  text-align: left;
}
.feed-card-title .fa-folder-open {
  color: #17a2b8;
}
.td-body {
  min-height: 80px;
}
.td-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.td-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 2px;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.06);
}
.td-row:last-child {
  border-bottom: none;
}
.td-rank {
  flex: 0 0 24px;
  height: 24px;
  border-radius: 50%;
  background: #eef1f4;
  color: #5a6773;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.td-rank-1,
.td-rank-2,
.td-rank-3 {
  background: linear-gradient(to left, #f8d88e, #f8cc3c);
  color: #4c412b;
}
.td-main {
  flex: 1 1 auto;
  min-width: 0;
}
.td-line {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  font-size: 14px;
}
.td-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  color: #2c3e50;
}
.td-total {
  flex: 0 0 auto;
  font-weight: 700;
  color: #2c3e50;
}
.td-bar {
  height: 5px;
  border-radius: 3px;
  background: #f0f2f5;
  margin-top: 4px;
  overflow: hidden;
}
.td-bar-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(to right, #17a2b8, #5bc0de);
  transition: width 0.4s ease;
}
</style>
