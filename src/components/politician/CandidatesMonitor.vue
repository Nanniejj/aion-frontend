<template>
  <div>
    <b-container>
      <b-row class="align-items-center mb-3">
        <b-col cols="12" md="8">
          <b-form-input
            v-model="searchQuery"
            placeholder="ค้นหา ชื่อ-นามสกุล หรือ ชื่อพรรค"
          ></b-form-input>
        </b-col>
        
        <b-col cols="12" md="4" class="text-right mt-2 mt-md-0">
          <b-button
            class="w-md-auto"
            style="background-color: #fdd071; color: black; border:#fdd071;"
            @click="showModal = true"
          >
            <i class="fa fa-plus"></i> เพิ่ม Social
          </b-button>
        </b-col>
      </b-row>

      <vue-element-loading
        :active="isLoading"
        size="80"
        background-color="rgba(255, 255, 255, 0.8)"
        color="#b6ac9a"
      />
      <!-- แสดงตารางเมื่อโหลดเสร็จ -->
      <b-table
        v-if="paginatedItems.length"
        responsive
        striped
        hover
        :items="paginatedItems"
        :fields="getFieldsCandidate"
        class="table-candidate"
        stacked="md"
      >
        <template #cell(social_url)="data">
          <div
            v-if="data.item.social_url && data.item.social_url.length"
            class="col-url"
          >
            <div
              v-for="(url, index) in data.item.social_url"
              :key="index"
              class="text-left my-1"
            >
              <img
                :src="getIconForSource(url.source)"
                :alt="url.source"
                class="icon-circle d-inline"
              />
              <a
                :href="url.url"
                target="_blank"
                class="ms-2 text-dark d-inline"
                style="text-decoration: none; word-break: break-all;"
              >
                {{ url.url }}
              </a>
            </div>
          </div>
          <div v-else>ไม่มีข้อมูล Social URLs</div>
        </template>

        <template #cell(actions)="row">
          <span
            class="fas fa-list-ul"
            v-b-tooltip.hover
            title="ดูข้อมูลส่วนตัว"
            size="sm"
            @click="linkToProfile(row.item)"
          ></span>
        </template>
      </b-table>

      <b-pagination
        v-if="!isLoading"
        v-model="currentPage"
        :total-rows="filteredItems.length"
        :per-page="perPage"
        align="center"
        class="my-3"
      ></b-pagination>
    </b-container>

   <!-- ก้อนนี้ -->
    <!-- Modal for Adding Social -->
    <b-modal
  id="add-social-modal"
  v-model="showModal"
  size="lg"
  hide-footer
  content-class="custom-modal-content"
>
  <template #modal-title>
    <h5 class="custom-modal-title">เพิ่มช่องทางการติดตาม</h5>
  </template>
  
  <CreateCandidatesPost @close="showModal = false" />
</b-modal>

  </div>
</template>

<script>
import CreateCandidatesPost from "./CreateCandidatesPost.vue";

export default {
  name: "CandidatesMonitor",
  components: {
    CreateCandidatesPost,
  },
  data() {
    return {
      isLoading: true, // 🔹 ตัวแปรสถานะโหลดข้อมูลฃ
      items: [],
      searchQuery: "",
      showModal: false, // State for showing/hiding the modal
      currentPage: 1, // Current page for pagination
      perPage: 10, // Items per page

      /////////ได้แล้ว
      getFieldsCandidate: [
        { key: "rowIndex", label: "#", sortable: true, class: "col-can" },
        { key: "full_name", label: "ชื่อ-นามสกุล", sortable: true },
        { key: "party_name", label: "ชื่อพรรค", sortable: true },
        {
          key: "social_url",
          label: "Social URLs",
          sortable: false,
          class: "col-can",
        },
        { key: "actions", label: "การจัดการ" },
      ],
      iconMap: {
        facebook: require("@/assets/Facebook.png"),
        twitter: require("@/assets/Twitter.png"),
        instagram: require("@/assets/Instagram.png"),
        tiktok: require("@/assets/Tiktok.png"),
        youtube: require("@/assets/Youtube.png"),
      },
    };
  },
  computed: {
    filteredItems() {
    return [...this.items]
      .sort((a, b) => a.full_name.localeCompare(b.full_name, 'th'))
      .filter(item => {
        if (!this.searchQuery) return true;
        const query = this.searchQuery.toLowerCase();
        return (
          item.full_name.toLowerCase().includes(query) ||
          (item.party_name && item.party_name.toLowerCase().includes(query))
        );
      });
  },

  paginatedItems() {
    const start = (this.currentPage - 1) * this.perPage;

    return this.filteredItems.slice(start, start + this.perPage).map((item, index) => ({
      ...item,
      rowIndex: start + index + 1, // เพิ่มเลขลำดับอัตโนมัติ
    }));
  },
  },
  methods: {
    async fetchCandidates() {
      this.isLoading = true; // 🔹 เริ่มโหลดข้อมูล
      try {
        const response = await this.axios.get(
          "https://api2.cognizata.com/api/v2/monitor/monitorCandidates",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );

        this.items = response.data.data.sort((a, b) =>
        a.full_name.localeCompare(b.full_name, 'th')
      );

    } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setTimeout(() => {
          this.isLoading = false; // 🔹 โหลดเสร็จแล้วแสดงตาราง
        }, 500);
      }
    },
    getIconForSource(source) {
      const iconMap = {
        facebook: require("@/assets/Facebook.png"),
        twitter: require("@/assets/Twitter.png"),
        instagram: require("@/assets/Instagram.png"),
        tiktok: require("@/assets/Tiktok.png"),
        youtube: require("@/assets/Youtube.png"),
      };
      return iconMap[source.toLowerCase()] || require("@/assets/Facebook.png"); // ใช้ Facebook icon เป็น default
    },
    linkToProfile(data) {
      const objIds = data.social_url.map((item) => item.obj_id);
      console.log("link to", objIds.toString());
      this.$router.push({
        name: "CandidatesPost",
        query: { id: objIds.toString() },
      });
    },
  },
  mounted() {
    this.fetchCandidates();
  },
};
</script>
<style>
/* #__BVID__2702 > tbody > tr:nth-child(19) > td:nth-child(4) */
.col-can {
  /* width:80px !important; */
}
</style>
<style scoped>
.col-url {
  width: 450px;
  overflow-x: hidden;
}

.search-input {
  margin-bottom: 20px;
}
.custom-modal-title {
  text-align: center; /* จัดให้อยู่ตรงกลาง */
  font-weight: bold;
  margin-top: 20px; /* เพิ่มระยะห่างจากขอบบน */
}

.text-right {
  text-align: right; /* จัดตำแหน่งข้อความชิดขวา */
}
.icon-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}
.ms-2 {
  margin-left: 10px;
}

.fa-trash,
.fa-list-ul,
.fa-user-alt-slash {
  background: #fed16ebf;
  padding: 7px;
  border-radius: 50%;
  box-shadow: 1px 1px 3px #666666;
  margin: 0px 5px;
  color: #4c412b;
  width: 32px;
  height: 30px;
}
.fa-user-alt-slash:hover {
  background: #4c412b;
  color: white;
}
.fa-trash:hover {
  background: #4c412b;
  color: white;
}
.fa-list-ul:hover {
  background: #4c412b;
  color: white;
}
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .col-url {
    width: unset !important;
    display: block;
  }
}
</style>