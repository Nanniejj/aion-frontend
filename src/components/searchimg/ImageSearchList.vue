<template>
  <div>
    <b-card v-for="item in items" :key="item._id" class="mb-3 border-0 shadow-sm list-card">
      <!-- ปุ่มลบ มุมขวาบน -->
      <b-button size="sm" :disabled="isDeleting(item._id)" variant="outline-danger"
        class="delete-btn d-flex align-items-center" title="ลบรายการนี้" @click.stop="onDelete(item)">
        <span class="" aria-hidden="true">
          <i class="fa fa-trash-o" aria-hidden="true"></i>
        </span>
        <!-- <span v-if="!isDeleting(item._id)"></span>
    <span v-else class="d-flex align-items-center">
      <b-spinner small class="mr-1" /> กำลังลบ...
    </span> -->
      </b-button>
      <b-row class="align-items-center">
        <b-col cols="12" md="auto" class="d-flex align-items-center">
          <b-avatar v-if="item.url" :id="avatarId(item)" :src="item.url" rounded="lg"
            :text="item.url ? null : initials(item.title)" class="mx-auto" size="100px" />
          <!-- Popover แสดงรูปเต็มเมื่อ hover -->
          <b-popover v-if="item.url" :target="avatarId(item)" triggers="hover" boundary="viewport" container="body"
            custom-class="img-popover">
            <div class="p-2">
              <img :src="item.url" :alt="item.title || 'image'" class="img-fluid rounded shadow popover-img" />
            </div>
          </b-popover>
        </b-col>

        <b-col cols="6" md class="mt-2 mt-md-0">
          <div class="text-muted small">Date</div>
          <div>{{ formatDate(item.created_at) }}</div>
        </b-col>

        <b-col cols="6" md class="mt-2 mt-md-0">
          <div class="text-muted small">Time</div>
          <div>{{ formatTime(item.created_at) }}</div>
        </b-col>

        <b-col cols="6" md class="mt-2 mt-md-0">
          <div class="text-muted small">Status</div>
          <div>
            <b-badge :variant="statusVariant(item.status)" pill class="py-2 px-2 text-uppercase">
              {{ item.status }}
            </b-badge>
          </div>
        </b-col>

        <b-col cols="6" md class="mt-2 mt-md-0">
          <div class="text-muted small">Posts</div>
          <div>{{ item.post_count }}</div>
        </b-col>
      </b-row>

      <div class="d-flex gap-2 mt-3">
        <b-button block :variant="item.post_count === 0 ? 'light' : 'info'" class="more-btn mr-2 flex-fill" size="sm"
          @click="toPost(item)" :disabled="item.post_count === 0">
          More
        </b-button>

        <!-- ปุ่มลบ -->
        <!-- <b-button
  size="sm"
  :disabled="isDeleting(item._id)"
  variant="outline-danger"
  class="more-btn d-flex align-items-center"
  @click.stop="onDelete(item)"
>
  <span class="mr-1" aria-hidden="true"><i class="fa fa-trash-o" aria-hidden="true"></i></span>
  <span v-if="!isDeleting(item._id)">ลบ</span>
  <span v-else class="d-flex align-items-center">
    <b-spinner small class="mr-1" /> กำลังลบ...
  </span>
</b-button> -->

      </div>
    </b-card>

    <div v-if="!loading && !items.length" class="text-center text-muted py-5">
      ไม่มีข้อมูล
    </div>

    <div v-if="error" class="text-danger small my-2">
      {{ error }}
    </div>

    <div class="d-flex justify-content-between align-items-center mt-3">
      <div></div>
      <b-pagination v-if="totalRows > perPage" v-model="localPage" :per-page="perPage" :total-rows="totalRows" size="sm"
        @input="onPageChange" />
    </div>

    <div v-if="loading" class="text-center text-muted py-3">
      กำลังโหลด...
    </div>
  </div>
</template>

<script>
import moment from "moment";
import "moment/locale/th";
import axios from "axios";

// const api = axios.create({
//   baseURL: "https://api2.cognizata.com/api/v2",
//   timeout: 20000,
// });

export default {
  name: "ImageSearchList",
  props: {
    itemsProp: { type: Array, default: () => [] },
    selected: { type: Array, default: () => [] },
    page: { type: Number, default: 1 },
    perPage: { type: Number, default: 10 },
    status: { type: String, default: "processing" }, // "processing" | "succeed" | "fail"
  },
  data() {
    return {
      items: [],
      totalRows: 0,
      localPage: this.page,
      selectedIds: new Set(this.selected),
      loading: false,
      error: "",
      deletingIds: new Set(), // เก็บ id ที่กำลังลบอยู่
      hasBIcon: !!(this.$root && this.$root.$options && this.$root.$options.components && this.$root.$options.components["BIcon"])
    };
  },
  watch: {
    page(v) {
      this.localPage = v;
    },
    selected(v) {
      this.selectedIds = new Set(v);
    },
    status: {
      handler() {
        this.localPage = 1;
        this.fetchList();
      },
      immediate: false,
    },
    perPage() {
      this.localPage = 1;
      this.fetchList();
    },
  },
  mounted() {
    this.fetchList();
    this.$emitter.on("apiListImg", () => {
      this.fetchList();
    });
  },
  methods: {
    avatarId(item) {
      return `img-pop-${item._id}`;
    },

    formatDate(date) {
      const dates = moment(date).subtract(7, "hours");
      return moment(dates).format("ll");
    },
    formatTime(date) {
      return (date || "").toString().slice(11, 16);
    },

    async fetchList() {
      this.loading = true;
      this.error = "";
      try {
        const params = {
          status: this.status,
          page: this.localPage,
          per_page: this.perPage,
        };

        // ต้องใส่ await ตรงนี้
        const { data } = await this.axios.get(
          "https://api2.cognizata.com/api/v2/image_upload/getImageSimilarity",
          {
            params,
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              // GET ไม่จำเป็นต้องใส่ Content-Type ก็ได้ แต่ไม่ใส่ก็ไม่ผิด
              //"Content-Type": "application/json"
            },
          }
        );

        console.log("response data:", data);

        const rows = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
            ? data.items
            : [];

        this.items = rows;
        this.totalRows = Number(data?.total ?? rows.length);

        this.$store.commit("setTotalImgList", data?.total ?? 0);
        this.$emit("loaded", {
          page: this.localPage,
          status: this.status,
          totalRows: this.totalRows,
        });
      } catch (err) {
        console.error(err);
        this.error = "ดึงข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
        this.items = [];
        this.totalRows = 0;
      } finally {
        this.loading = false;
      }
    }
    ,

    onPageChange(p) {
      this.$emit("page-change", p);
      this.fetchList();
    },

    toPost(item) {
      this.$router.push({ name: "SearchImgPost", query: { id: item._id } });
    },

    toggleSelect(id) {
      if (this.selectedIds.has(id)) this.selectedIds.delete(id);
      else this.selectedIds.add(id);
      this.$emit("update:selected", Array.from(this.selectedIds));
    },

    toggleSelectAll(checked) {
      if (checked) this.selectedIds = new Set(this.items.map((i) => i._id));
      else this.selectedIds = new Set();
      this.$emit("update:selected", Array.from(this.selectedIds));
    },

    statusVariant(s) {
      if (!s) return "secondary";
      const k = s.toLowerCase();
      if (k.includes("succeed") || k.includes("success")) return "success";
      if (k.includes("processing")) return "warning";
      if (k.includes("failed") || k.includes("error") || k === "fail")
        return "danger";
      return "secondary";
    },

    initials(text = "?") {
      return text
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    },

    isDeleting(id) {
      return this.deletingIds.has(id);
    },

    async onDelete(item) {
      const id = item._id;

      // กล่องยืนยันแบบ this.$confirm ตามสไตล์ที่คุณใช้
      try {
        await this.$confirm("คุณต้องการลบข้อมูล?");
      } catch (e) {
        // ผู้ใช้กดยกเลิก
        return;
      }

      this.deletingIds.add(id);

      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // ลบด้วย DELETE + query string id
        await api.delete("/image_upload/deleteImageSimilarity", {
          params: { id },
          headers,
        });

        // โหลดรายการใหม่ (หรือจะ splice ออกเองก็ได้)
        await this.fetchList();

        // แจ้งเตือนสำเร็จ แบบ this.$fire
        this.$fire({
          title: "ลบข้อมูลสำเร็จ",
          type: "success",
          showConfirmButton: false,
          timer: 1000,
        });

        // แจ้ง parent ถ้าต้องการ
        this.$emit("deleted", id);
      } catch (err) {
        console.error(err);
        this.$fire({
          title: "ลบข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง",
          type: "error",
          showConfirmButton: false,
          timer: 1500,
        });
      } finally {
        this.deletingIds.delete(id);
      }
    }

  },
};
</script>

<style scoped>
.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  border-radius: 999px;
  /* ขยายพื้นที่กดเล็กน้อยให้ใช้งานง่าย (ไม่บังคับ) */
  padding: 0.25rem 0.6rem;
}

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
  background-color: #1996006b;
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
  position: relative;
}

.more-btn {
  border-radius: 999px;
}

.font-weight-600 {
  font-weight: 600;
}

/* === ปรับ popover ให้กว้างพอสำหรับรูป === */
::v-deep .popover {
  max-width: none;
}

::v-deep .img-popover .popover-body {
  padding: 0.25rem;
}

/* ใช้ custom-class="img-popover" แล้ว target แบบ global */
.img-popover.popover {
  max-width: none !important;
  width: auto !important;
}

/* body ของ popover ไม่ต้องจำกัด */
.img-popover .popover-body {
  padding: 0.25rem;
  display: inline-block;
}

/* รูปควรเป็น block และให้ขนาดสูงสุดไม่ล้นจอ */
.img-popover .popover-body img {
  display: block;
  width: auto;
  max-width: 50vw;
  max-height: 70vh;
  object-fit: contain;
}
</style>
