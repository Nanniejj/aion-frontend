<template>
  <div>
    <b-container>
      <!-- Header + Search -->
      <b-row class="justify-content-md-end">
        <b-col>
          <div class="h4 text-left bold">เรื่อง {{ $route.params.domain }}</div>
        </b-col>

        <b-col cols="12" sm="12" md="4" lg="4" class="mt-2 mt-md-0 pr-md-0 mr-md-2">
          <b-input-group>
            <b-input-group-prepend>
              <span class="input-group-text">
                <i class="fa fa-search"></i>
              </span>
            </b-input-group-prepend>

            <!-- ✅ พิมพ์ได้ แต่ไม่ยิงงานหนัก -->
            <b-form-input
              ref="searchInput"
              v-model="searchQuery"
              @input="checkSearch"
              placeholder="ค้นหา"
              class="input-group-text text-left"
            />

            <b-input-group-append>
              <!-- ✅ กดค้นหาแล้วค่อยส่ง keyword -->
              <b-button
                @click="filterSubdomains"
                pill
                style="position: relative; right: 15px; background-color: #777676"
              >
                ค้นหา
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-col>

        <b-col cols="12" md="auto" class="mt-4 mt-md-0 pl-md-0">
          <AddSubDomain :domainId="domainId" />
        </b-col>
      </b-row>

      <!-- suggestionKeywords -->
      <b-row v-if="suggestionKeywrords.length !== 0" class="m-0 py-2 mt-2">
        <b-col cols="12" class="text-left px-0">
          <h5>keyword ที่แนะนำ</h5>
        </b-col>
        <b-col cols="12" class="px-0">
          <b-row class="m-0">
            <b-col
              cols="auto"
              class="pl-0 px-1 mb-2"
              v-for="(keyword, index) in suggestionKeywrords"
              :key="index + keyword"
            >
              <div
                @click="copyToClipboard(keyword)"
                class="bage-keyword"
                v-b-tooltip.hover
                title="คลิกเพื่อ 'คัดลอก' "
              >
                {{ keyword }}
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>

      <br />

      <div v-if="loadWord">
        <vue-element-loading
          :active="loadWord"
          size="50"
          background-color="rgba(255, 255, 255, 0.1)"
          spinner="line-scale"
          color="#7cd1dc"
        />
      </div>

      <!-- List -->
<div v-else class="mb-4">

    <b-col class="px-0 pb-3">
      <div class="h5 text-left bold">หมวดหมู่</div>
    </b-col>

    <ObjectCard
      v-for="(subdomain, subIndex) in visibleSubdomains"
      :key="subdomain.subdomain_id"
      :subdomain="subdomain"
      :searchQuery="keyword"
      @edit-subDomain="editSubdomain(subIndex)"
      @delete-subDomain="openDeleteSubdomainModal(subIndex, subdomain)"
      @reset="apiList"
    />
    <!-- {{ isPaging }} {{ currentPage }} -->
  
    <!-- Pagination -->
<div v-if="totalSubdomains > perPage" class="d-flex flex-column align-items-center my-3">

 <b-progress
    v-if="isPaging"
    :value="100"
    height="10px"
    class="w-100 mb-2"
    variant="info"
  />
  <b-pagination
    :value="currentPage"
    @input="onPageChange"
    :total-rows="totalSubdomains"
    :per-page="perPage"
    pills
    size="sm"
    align="center"
    :disabled="isPaging"
  />
</div>



  <!-- FAB -->
  <b-button
    v-if="!loadWord"
    variant="warning"
    class="fab"
    @click="scrollToTop"
    style="background-color: #fed06ea4;"
  >
    <i class="fas fa-arrow-up"></i>
  </b-button>
</div>


      <!-- edit subdomain -->
      <b-modal
        v-b-modal.modal-center
        id="edit-subdomain-modal"
        ref="editSubdomainModal"
        @hidden="resetEditModal"
        :ok-only="true"
        class="custom-modal"
        centered
      >
        <b-form ref="editForm" @submit.prevent="handleEditSubdomain" class="custom-form">
          <h5><b>แก้ไขหมวดหมู่</b></h5>
          <hr />
          <b-form-group label-for="edit-subdomain">
            <b-form-input
              id="edit-subdomain"
              v-model="editSubdomainName"
              required
              class="subdomain-input"
              maxlength="50"
            />
          </b-form-group>
          <small class="text-muted">{{ editSubdomainName.length || 0 }} / 50 ตัวอักษร</small>

          <div class="d-flex justify-content-end mt-3">
            <b-button class="btn-submit" @click="handleEditSubdomain" :disabled="editSubdomainName.length == 0">
              บันทึก
            </b-button>
          </div>
        </b-form>
      </b-modal>

      <!-- Modal ลบ subdomain -->
      <b-modal id="confirm-delete-subdomain-modal" title="ยืนยันการลบ Subdomain" hide-footer>
        <b-form @submit.prevent="handleDeleteSubdomain" centered>
          <p>คุณต้องการลบ <strong>{{ deleteSubdomainName }}</strong> หรือไม่?</p>
          <div class="d-flex justify-content-end mt-3">
            <b-button class="mr-2" variant="secondary" @click="closeDeleteModal">ยกเลิก</b-button>
            <b-button variant="danger" type="submit">ลบ</b-button>
          </div>
        </b-form>
      </b-modal>
    </b-container>
  </div>
</template>

<script>
import CreateObject from "./CreateObject.vue";
import EditObjectKeyword from "./EditObjectKeyword.vue";
import AddSubDomain from "./AddSubDomain.vue";
import ObjectCard from "./ObjectCard.vue";

export default {
  name: "SubdomainCard",
  components: {
    CreateObject,
    EditObjectKeyword,
    ObjectCard,
    AddSubDomain,
  },
watch:{
  currentPage(){
    this.isPaging=true
  }
},
  data() {
    return {
isPaging: false,
    perPage: 10,
    currentPage: 1,
      // ✅ keyword ที่ส่งให้ ObjectCard (เดิมคุณใช้ keyword แยกจาก searchQuery) :contentReference[oaicite:3]{index=3}
      keyword: "",

      // list
      subdomains: [],
      filteredSubdomains: [],

      // loading
      loadWord: false,

      // search
      searchQuery: "",

      // suggestion
      suggestionKeywrords: [],

      // domainId
      domainId: null,

      // edit/delete state (คงจากเดิม)
      editSubdomainIndex: null,
      editSubdomainName: "",
      newSubdomainId: null,
      deleteSubdomainName: "",

      // ✅ NEW: จำกัดจำนวน subdomain ที่ render
      defaultSubLimit: 10,
      subStep: 10,
      subLimit: 10,

      showFabButton: false,
    };
  },
  computed: {

    checkSearch() {
  if (!this.searchQuery) {
    this.keyword = "";
    this.filteredSubdomains = this.subdomains;
    this.currentPage = 1; // ✅ เพิ่ม
  }
},
     totalSubdomains() {
    return this.filteredSubdomains?.length || 0;
  },
  visibleSubdomains() {
    const start = (this.currentPage - 1) * this.perPage;
    return (this.filteredSubdomains || []).slice(start, start + this.perPage);
  },
    // visibleSubdomains() {
    //   return (this.filteredSubdomains || []).slice(0, this.subLimit);
    // },
    canLoadMoreSubdomains() {
      return this.subLimit < (this.filteredSubdomains?.length || 0);
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
 onPageChange(page) {
    if (page === this.currentPage) return;
   this.currentPage = page;
    this.isPaging = true;

    // ให้ progress ได้ paint ก่อน
    this.$nextTick(() => {
      requestAnimationFrame(() => {
     

        // ปิดหลัง render รอบถัดไป
        this.$nextTick(() => {
          setTimeout(() => {
            this.isPaging = false;
          }, 80);
        });
      });
    });
  },
    handleScroll() {
      this.showFabButton = window.scrollY > 700;
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    loadMoreSubdomains() {
      this.subLimit = Math.min(this.filteredSubdomains.length, this.subLimit + this.subStep);
    },
checkSearch() {
  if (!this.searchQuery) {
    this.keyword = "";
    this.filteredSubdomains = this.subdomains;
    this.currentPage = 1;
  }
},


    // ✅ เดิม filterSubdomains ของคุณตั้ง keyword อย่างเดียว :contentReference[oaicite:4]{index=4}
    // เราคงแนวคิดเดิมเพื่อไม่ให้หนัก: ไม่ไปไล่ค้นทุก object/keyword ทั้งก้อน
filterSubdomains() {
  const q = (this.searchQuery || "").trim().toLowerCase();

  if (!q) {
    this.keyword = "";
    this.filteredSubdomains = this.subdomains;
    this.currentPage = 1;
    return;
  }

  // ส่งไปให้ ObjectCard filter รายชื่อ object_name ใน subdomain ที่ match
  this.keyword = q;

  // ✅ สำคัญ: กรอง subdomain ทั้งหมดก่อน paginate
  this.filteredSubdomains = this.subdomains.filter((s) => {
    // ถ้าจะให้ค้น subdomain_name ด้วยก็ใส่เพิ่มได้
    const subName = String(s.subdomain_name || "").toLowerCase();
    const blob = String(s._searchBlob || "");
    return subName.includes(q) || blob.includes(q);
  });

  this.currentPage = 1;
},


    copyToClipboard(text) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
          this.$bvToast.toast("คัดลอกแล้ว: " + text, {
            title: "สำเร็จ",
            variant: "success",
            solid: true,
            autoHideDelay: 1000,
          });
        });
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = 0;
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
          document.execCommand("copy");
          this.$bvToast.toast("คัดลอกแล้ว: " + text, {
            title: "สำเร็จ",
            variant: "success",
            solid: true,
            autoHideDelay: 1000,
          });
        } finally {
          document.body.removeChild(textarea);
        }
      }
    },

    async apiList() {
      this.loadWord = true;
      try {
        const config = {
          method: "get",
          url: "https://api2.cognizata.com/api/v2/setting/getSetting",
          params: { domain_id: this.$route.query.id },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        };

        const response = await this.axios(config);

        if (response.data.domain_id) {
          this.domainId = response.data.domain_id;

          // คง logic เดิมที่ map + ใส่ค่า display/activeObjectId ฯลฯ :contentReference[oaicite:5]{index=5}
          this.subdomains = (response.data.subdomains || []).map((s) => {
  const objs = Array.isArray(s.objects) ? s.objects : [];
  const first = objs.length ? objs[0] : null;

  // ✅ cache: รวม object_name ทั้งหมดของ subdomain นี้ (ทำครั้งเดียว)
  const searchBlob = objs
    .map(o => String(o.object_name || "").toLowerCase())
    .join(" ");

  return {
    ...s,
    display: s.display !== false,
    activeObjectId: first ? first.object_id : null,

    // ✅ เพิ่ม field นี้
    _searchBlob: searchBlob,
  };
});

this.filteredSubdomains = this.subdomains;
this.currentPage = 1;

        }
      } catch (error) {
        console.error("Error fetching API:", error);
      } finally {
        this.loadWord = false;
      }
    },

    async apiGetSuggestionKeywrords() {
      try {
        const config = {
          method: "get",
          url: "https://api2.cognizata.com/api/v2/aiservice/getSuggestionKewrords",
          params: { domain_id: this.$route.query.id },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        };
        const response = await this.axios(config);
        if (response && response.data && response.data.length > 0) {
          this.suggestionKeywrords = response.data[0]?.keywords || [];
        } else {
          this.suggestionKeywrords = [];
        }
      } catch (error) {
        this.suggestionKeywrords = [];
        console.error("Error fetching suggestion keywords:", error);
      }
    },

    editSubdomain(subIndex) {
      // ✅ subIndex เป็น index ของ visibleSubdomains -> แปลงเป็นตัวจริงใน subdomains
      const target = this.visibleSubdomains[subIndex];
      const realSubIndex = this.subdomains.findIndex((s) => s.subdomain_id === target.subdomain_id);
      if (realSubIndex === -1) return;

      this.editSubdomainIndex = realSubIndex;
      this.editSubdomainName = this.subdomains[realSubIndex].subdomain_name;
      this.$bvModal.show("edit-subdomain-modal");
    },

    async handleEditSubdomain() {
      if (this.editSubdomainIndex === null || !this.editSubdomainName.trim()) return;

      const subdomain = this.subdomains[this.editSubdomainIndex];
      const updatedSubdomainData = {
        domain_id: this.$route.query.id,
        name: this.editSubdomainName.trim(),
      };

      try {
        await this.axios.put(
          `https://api2.cognizata.com/api/v2/setting/putSubdomain/${subdomain.subdomain_id}`,
          updatedSubdomainData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );

        this.$fire({
          title: "บันทึกข้อมูลสำเร็จ",
          type: "success",
          showConfirmButton: false,
          timer: 1000,
        });

        await this.apiList();
        this.closeEditModal();
      } catch (error) {
        console.error("Error updating subdomain:", error);
      }
    },

    openDeleteSubdomainModal(subIndex, item) {
      this.newSubdomainId = item.subdomain_id;
      this.deleteSubdomainName = item.subdomain_name;
      this.$bvModal.show("confirm-delete-subdomain-modal");
    },

    async handleDeleteSubdomain() {
      const subdomainId = this.newSubdomainId;
      const domainId = this.$route.query.id;

      try {
        await this.axios.delete(`https://api2.cognizata.com/api/v2/setting/deleteSubdomain/${subdomainId}`, {
          params: { domain_id: domainId },
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });

        this.closeDeleteModal();
        this.$fire({
          title: "บันทึกข้อมูลสำเร็จ",
          type: "success",
          showConfirmButton: false,
          timer: 1000,
        });

        await this.apiList();
      } catch (error) {
        console.error("Error deleting subdomain:", error.response?.data || error);
      }
    },

    closeDeleteModal() {
      this.newSubdomainId = null;
      this.deleteSubdomainName = "";
      this.$bvModal.hide("confirm-delete-subdomain-modal");
    },

    closeEditModal() {
      this.$bvModal.hide("edit-subdomain-modal");
      this.editSubdomainIndex = null;
      this.editSubdomainName = "";
    },

    resetEditModal() {
      this.editSubdomainIndex = null;
      this.editSubdomainName = "";
    },
  },

  async mounted() {
    await this.apiList();
    await this.apiGetSuggestionKeywrords();

    await this.$emitter.on("callApiListSubdomain", async () => {
      await this.apiList();
      this.$nextTick(() => {
        this.filterSubdomains();
      });
    });
  },
};
</script>

<style scoped>
/* คง style เดิมของคุณจาก SubdomainCard :contentReference[oaicite:6]{index=6} */
.fab {
  position: fixed;
  bottom: 20px;
  right: 0px;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  z-index: 1050;
  font-size: 20px;
}

.bage-keyword{
  background-color: rgb(213, 246, 250);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  position: relative;
  overflow: hidden;
  transition: all 0.5s ease;
}

.bage-keyword span { position: relative; z-index: 2; }

.bage-keyword::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(0deg, transparent, transparent 30%, rgba(0, 255, 255, 0.3));
  transform: rotate(-45deg);
  transition: all 0.5s ease;
  opacity: 0;
}

.bage-keyword:hover {
  transform: scale(1.05);
  background: #2c3e50;
  color: #bef7fe;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
}

.bage-keyword:hover::before {
  opacity: 1;
  transform: rotate(-45deg) translateY(100%);
}

.input-group-text {
  box-sizing: border-box;
  background-image: url("@/assets/search_icon.png");
  background-position: 94% 10px;
  background-repeat: no-repeat;
  padding: 7px 10px 7px 15px;
  border: none;
  text-align: center;
  background: #ddddddc7;
  border-radius: 20px;
}

.btn-secondary {
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  border-color: #dee2e600;
}

:hover .btn-secondary {
  background-color: #fdd071;
}
</style>
