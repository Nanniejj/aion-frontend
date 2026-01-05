<template>
    <div v-if="!searchQuery || filteredObject.length !== 0">
        <!-- ชื่อ Subdomain -->
        <b-col sm="12" md="4" lg="4" class="d-flex justify-content-between align-items-center"
            style="background-color: #7cd1dc; color: #000; border-top-left-radius: 10px; border-top-right-radius: 10px; padding: 10px; margin-bottom: 0px;">
            <span class="text-center subdomain-name" style="flex: 1;">
                {{ subdomain.subdomain_name }}
                <small class="ml-2" style="opacity:.85;">({{ totalObjects.toLocaleString() }})</small>
            </span>

            <div class="d-flex justify-content-end">
                <!-- ✅ ปุ่ม Toggle (ใหม่) -->
                <!-- <b-button
          size="sm"
          class="rounded-circle"
          style="background-color: white; color: #2c3e50; width: 30px; height: 30px;"
          @click="toggleOpen"
          v-b-tooltip.hover
          :title="isOpen ? 'ซ่อนรายการ' : 'แสดงรายการ'"
        >
          <i class="fa" :class="isOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
        </b-button> -->

                <b-button size="sm" class="rounded-circle ml-2"
                    style="background-color: white; color: #2c3e50; width: 30px; height: 30px;"
                    @click="editSubdomain()">
                    <i class="fa fa-pencil"></i>
                </b-button>

                <b-button @click="deleteSubdomain()" size="sm" class="rounded-circle ml-2"
                    style="background-color: white; color: #2c3e50; width: 30px; height: 30px;">
                    <i class="fa fa-trash-alt"></i>
                </b-button>
            </div>
        </b-col>

        <!-- Objects ใน Card -->
        <b-card class="custom-card">
            <b-row class="mb-3 mb-lg-0 mx-0">
                <b-col cols="12" sm="4" style="padding-left: 10px; text-align: left;">
                    <div class="h5">
                        <strong>ประเด็น </strong>
                    </div>
                </b-col>
                <b-col class="d-md-flex justify-content-end px-0">
                    <!-- ก้อนเพิ่ม object -->
                    <CreateObject :objectData="subdomain" />
                </b-col>
            </b-row>

            <!-- ✅ ปิดไว้ก่อน: ไม่ render list objects -->
            <div v-if="!isOpen" class="my-3 text-muted">
                กดปุ่ม <i class="fa fa-chevron-down"></i> เพื่อแสดงรายการ (จะโหลด/แสดงแค่ {{ defaultLimit }} รายการแรก)
            </div>

            <!-- ✅ เปิดแล้วค่อย render -->
            <b-row v-else>
                <!-- ซ้าย: รายการ objects -->
                <b-col>
                    <div class="scroll-obj">
                        <!-- รายการ objects แบบจำกัดจำนวน -->
                        <div v-for="(object, objIndex) in visibleObjects" :key="object.object_id || objIndex"
                            class="object-item d-flex align-items-center justify-content-between py-2 px-3" :class="{
                                'active-item': selectedObject && selectedObject.object_id === object.object_id,
                                'inactive-item': selectedObject && selectedObject.object_id !== object.object_id,
                            }" @click="setActive(object)"
                            style="border: 0px solid #ccc; border-radius: 15px; margin-bottom: 20px; cursor: pointer;">
                            <span class="text-center object-name" style="flex: 1;">
                                {{ object.object_name }}
                            </span>

                            <div class="d-flex justify-content-end">
                                <EditObjectKeyword
                                    :objectData="{ subdomain_id: subdomain.subdomain_id, ...dataKeyword }"
                                    :btn="'edit'" />

                                <b-button size="sm" class="rounded-circle"
                                    style="background-color: white; color: #2c3e50; width: 30px; height: 30px; margin-right: 3px;"
                                    @click.stop="openDeleteObjectModal(object)">
                                    <i class="fa fa-trash-alt icon-hover"></i>
                                </b-button>
                            </div>
                        </div>

                        <!-- ✅ Load more -->
                        <!-- ✅ ดูทั้งหมด -->
                        <!-- ✅ ดูทั้งหมด + loading -->
                        <div v-if="canLoadMore" class="text-center my-2">
                            <b-button size="sm" class="btn " :disabled="isLoadingAll" @click="showAll"
                                variant="outline-info" pill>
                                <b-spinner v-if="isLoadingAll" small type="border" class="mr-2" />
                                <span>
                                    {{ isLoadingAll ? 'กำลังโหลด...' : `ดูทั้งหมด (${totalObjects})` }}
                                </span>
                            </b-button>
                        </div>

                        <!-- <div v-if="canLoadMore" class="text-center my-2">
              <b-button size="sm" class="btn" @click="loadMore">
                โหลดเพิ่ม (+{{ step }}) — ตอนนี้แสดง {{ limit }} / {{ totalObjects }}
              </b-button>
            </div> -->

                        <!-- ✅ ถ้า search แล้วไม่เจอ -->
                        <div v-if="isOpen && searchQuery && filteredObject.length === 0" class="my-3 gray text-center">
                            ไม่พบข้อมูล object ที่ตรงกับคำค้นหา
                        </div>
                    </div>
                </b-col>

                <!-- ขวา: keyword panel (เหมือนเดิม) -->
                <b-col v-if="selectedObject" cols="12" md="7" lg="8" style="text-align: left;">
                    <div v-if="selectedObject.keywords && selectedObject.keywords.length">
                        <strong class="my-3">Keywords</strong><br />
                        <div style="overflow-y: auto; max-height: 200px;">
                            <div v-for="(keyword, index) in selectedObject.keywords" :key="index"
                                class="keyword-box my-1 px-3"
                                :class="{ 'glow-box': searchQuery && keyword.toLowerCase().includes(searchQuery.toLowerCase()) }">
                                <Highlighter class="my-highlight md-font" highlightClassName="highlight-search"
                                    :searchWords="[searchQuery]" :autoEscape="true" :textToHighlight="keyword" />
                            </div>
                        </div>
                    </div>

                    <div v-if="selectedObject.and_keywords && selectedObject.and_keywords.length"
                        style="margin-top: 10px;">
                        <strong class="my-3">Include Keywords</strong><br />
                        <div style="overflow-y: auto; max-height: 200px;">
                            <div v-for="(and_keywords, index) in selectedObject.and_keywords" :key="index"
                                class="keyword-box px-3 my-1"
                                :class="{ 'glow-box': searchQuery && and_keywords.toLowerCase().includes(searchQuery.toLowerCase()) }">
                                <Highlighter class="my-highlight md-font" highlightClassName="highlight-search"
                                    :searchWords="[searchQuery]" :autoEscape="true" :textToHighlight="and_keywords" />
                            </div>
                        </div>
                    </div>

                    <div v-if="selectedObject.not_keywords && selectedObject.not_keywords.length"
                        style="margin-top: 10px;">
                        <strong class="my-3">Exclude Keywords</strong><br />
                        <div style="overflow-y: auto; max-height: 200px;">
                            <div v-for="(not_keywords, index) in selectedObject.not_keywords" :key="index"
                                class="keyword-box px-3 my-1"
                                :class="{ 'glow-box': searchQuery && not_keywords.toLowerCase().includes(searchQuery.toLowerCase()) }">
                                <Highlighter class="my-highlight md-font" highlightClassName="highlight-search"
                                    :searchWords="[searchQuery]" :autoEscape="true" :textToHighlight="not_keywords" />
                            </div>
                        </div>
                    </div>

                    <div v-if="subdomain">
                        <EditObjectKeyword :objectData="{ subdomain_id: subdomain.subdomain_id, ...dataKeyword }"
                            :btn="'icon'" />
                    </div>
                </b-col>

                <!-- <b-col v-else cols="12" md="7" lg="8" class="text-center align-self-center">
          - กรุณาเลือก object ที่ต้องการแสดงรายละเอียด -
        </b-col> -->
            </b-row>

            <div v-if="!subdomain || !subdomain.objects || !subdomain.objects.length" class="my-3 gray">
                ไม่พบข้อมูล
            </div>
        </b-card>
    </div>
</template>

<script>
import CreateObject from "./CreateObject.vue";
import EditObjectKeyword from "./EditObjectKeyword.vue";
import Highlighter from "vue-highlight-words";
import Swal from "sweetalert2";

export default {
    components: { EditObjectKeyword, CreateObject, Highlighter },
    props: {
        subdomain: { type: Object, required: true },
        searchQuery: { type: String, default: "" },
    },
    data() {
        return {
            // ✅ NEW: lazy open/close
            isOpen: true,

            // ✅ NEW: จำกัดจำนวน render
            defaultLimit: 50,
            step: 50,
            limit: 50,
            isLoadingAll: false,
            filteredObject: [],
            selectedObject: null,

            // ✅ NEW: ทำ index คำค้นหาแบบเบาๆ ต่อ object เพื่อให้ค้นหาเร็วขึ้น
            // key: object_id, value: "รวม keyword เป็น string lower"
            _searchCache: new Map(),
        };
    },
    computed: {
        totalObjects() {
            return Array.isArray(this.subdomain.objects) ? this.subdomain.objects.length : 0;
        },
        dataKeyword() {
            return this.selectedObject || { keywords: [], and_keywords: [], not_keywords: [] };
        },
        visibleObjects() {
            // แสดงแค่ limit ตัวแรก เพื่อลด DOM
            return (this.filteredObject || []).slice(0, this.limit);
        },
        canLoadMore() {
            return this.isOpen && this.limit < (this.filteredObject?.length || 0);
        },
    },
    methods: {
        toggleOpen() {
            this.isOpen = !this.isOpen;

            // เปิดครั้งแรกค่อยเตรียมข้อมูล
            if (this.isOpen) {
                this.limit = this.defaultLimit;
                this.prepareListIfNeeded();
            }
        },

        prepareListIfNeeded() {
            // set list พื้นฐาน
            this.filteredObject = Array.isArray(this.subdomain.objects) ? this.subdomain.objects : [];

            // set selectedObject ให้ตัวแรก (เดิมคุณทำแบบนี้)
            this.selectedObject = this.filteredObject[0] || null;

            // ถ้ามี searchQuery ให้ filter ตอน “เปิด” เท่านั้น (ไม่ filter ทุกครั้งที่พิมพ์)
            const q = (this.searchQuery || "").trim().toLowerCase();
            if (q) this.filterObject(q);
        },
        async showAll() {
            if (this.isLoadingAll) return;

            this.isLoadingAll = true;

            // 👇 ให้ Vue render loading ก่อน
            await this.$nextTick();

            // 👇 จำลอง async (เผื่ออนาคตต่อ API / list ใหญ่)
            setTimeout(() => {
                this.limit = this.filteredObject.length;

                // 👇 รอ DOM render object ทั้งหมด
                this.$nextTick(() => {
                    this.isLoadingAll = false;
                });
            }, 0);
        },

        // ของเดิมยังเก็บไว้ได้ ถ้าไม่ใช้แล้วจะลบก็ได้
        loadMore() {
            this.limit = Math.min(this.filteredObject.length, this.limit + this.step);
        },


        // ✅ Filter แบบเร็วขึ้น:
        // - ไม่ .some() หลายรอบทุกครั้ง
        // - ทำ cache string รวม keywords ของแต่ละ object ไว้ครั้งเดียว
        filterObject(qInput) {
            const q = (qInput || "").trim().toLowerCase();
            const objects = Array.isArray(this.subdomain.objects) ? this.subdomain.objects : [];

            if (!q) {
                this.filteredObject = objects;
                this.selectedObject = this.filteredObject[0] || null;
                return;
            }

            const out = [];
            for (const obj of objects) {
                const oid = obj.object_id ?? obj.object_name;

                // สร้าง cache
                let blob = this._searchCache.get(oid);
                if (!blob) {
                    const parts = [];
                    if (obj.object_name) parts.push(String(obj.object_name));
                    if (Array.isArray(obj.keywords)) parts.push(obj.keywords.join(" "));
                    if (Array.isArray(obj.and_keywords)) parts.push(obj.and_keywords.join(" "));
                    if (Array.isArray(obj.not_keywords)) parts.push(obj.not_keywords.join(" "));
                    blob = parts.join(" ").toLowerCase();
                    this._searchCache.set(oid, blob);
                }

                if (blob.includes(q)) out.push(obj);
            }

            this.filteredObject = out;
            this.selectedObject = this.filteredObject[0] || null;

            // รีเซ็ต limit ให้เริ่มแสดงต้นๆ ใหม่
            this.limit = this.defaultLimit;
        },

        deleteSubdomain() {
            this.$emit("delete-subDomain");
        },
        editSubdomain() {
            this.$emit("edit-subDomain");
        },
        setActive(object) {
            this.selectedObject = object;
        },

        openDeleteObjectModal(object) {
            Swal.fire({
                title: "ยืนยันการลบ Object",
                html: `คุณต้องการลบ Object <b>${object.object_name}</b> หรือไม่?`,
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "ลบ",
                cancelButtonText: "ยกเลิก",
                didOpen: () => {
                    const iconContent = document.querySelector(".swal2-icon-content");
                    if (iconContent) iconContent.style.display = "none";
                },
            }).then((result) => {
                if (result.isConfirmed) this.deleteObject(object.object_id);
            });
        },

        deleteObject(objectId) {
            try {
                this.axios
                    .delete(`https://api2.cognizata.com/api/v2/setting/deleteObject/${objectId}`, {
                        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
                    })
                    .then(() => {
                        Swal.fire({
                            title: "บันทึกแล้ว!",
                            text: "ข้อมูลของคุณถูกบันทึกเรียบร้อย",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 3000,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            buttonsStyling: false,
                        });
                        this.$emit("reset");
                    });
            } catch (error) {
                console.error("Error deleting object:", error);
                alert("เกิดข้อผิดพลาดในการลบ Object");
            }
        },

        rebuildCache() {
            this._searchCache = new Map();
        },
    },

    mounted() {
        // ✅ เดิมคุณ set filteredObject ทันที (หนัก) — เปลี่ยนเป็นยังไม่ทำจนกว่าจะเปิด
        // this.filteredObject = this.subdomain.objects
        // this.selectedObject = this.filteredObject[0]

        // แต่ถ้าต้องการให้ “เปิดอันแรก” โดย default ก็ทำได้:
        // this.isOpen = true; this.prepareListIfNeeded();
    },

    watch: {
        // ถ้า subdomain เปลี่ยน: ล้าง cache และถ้าเปิดอยู่ค่อย rebuild list
        subdomain: {
            deep: true,
            immediate: true,
            handler() {
                this.rebuildCache();
                if (this.isOpen) this.prepareListIfNeeded();
            },
        },

        // ✅ สำคัญ: ไม่ filter ทุกครั้งที่ searchQuery เปลี่ยน ถ้ายังไม่เปิด
        // ถ้าเปิดอยู่ค่อย filter
        searchQuery: {
            handler(newVal) {
                if (!this.isOpen) return;

                const q = (newVal || "").trim().toLowerCase();
                if (!q) {
                    this.filteredObject = Array.isArray(this.subdomain.objects) ? this.subdomain.objects : [];
                    this.selectedObject = this.filteredObject[0] || null;
                    this.limit = this.defaultLimit;
                    return;
                }

                this.filterObject(q);
            },
        },
    },
};
</script>

<style scoped>
/* ✅ ใช้ style เดิมของคุณทั้งหมดได้เลย (ผมไม่ตัด) */
.glow-box {
    border-color: 2px solid #f8aa02;
    box-shadow: 0 0 5px #f8aa02, 0 0 10px #ffc443, 0 0 15px #fdd071;
    border-radius: 6px;
    transition: box-shadow 0.3s ease-in-out;
}

.highlight-search {
    background-color: #fdd071ab;
    padding: 0 2px;
}

.subdomain-name {
    font-size: 20px;
}

.scroll-obj {
    padding: 10px;
    max-height: 50vh;
    overflow-y: auto;
    overflow-x: hidden;
}

.custom-card {
    background: linear-gradient(90deg, rgb(190, 247, 254) 0%, rgba(255, 255, 255, 1) 35%);
    border-radius: 15px;
    border-top-left-radius: unset;
    padding: 15px;
    margin-bottom: 20px;
    position: relative;
    border: 0px solid rgba(0, 0, 0, 0.125);
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.rounded-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    width: 30px;
    height: 30px;
}

.object-item {
    background-color: white;
    color: #2c3e50;
    border: 1px solid #ccc;
    box-shadow: rgba(37, 37, 37, 0.2) 0px 2px 8px 0px;
}

.active-item {
    background-color: #fdd071;
    color: #2c3e50;
    box-shadow: #7cd1dc 0px 2px 8px 0px;
}

.inactive-item {
    background-color: white;
    color: #2c3e50;
    border: 1px solid #ccc;
    box-shadow: rgba(37, 37, 37, 0.2) 0px 2px 8px 0px;
}

.inactive-item:hover {
    border-color: 2px solid #f8aa02;
    box-shadow: 0 0 5px #f8aa02, 0 0 10px #ffc443, 0 0 15px #fdd071;
    cursor: pointer;
}

.keyword-box {
    border: 1px solid #ccc;
    border-radius: 15px;
    padding: 5px;
    margin-bottom: 5px;
    display: inline-block;
    margin-right: 5px;
    font-size: 14px;
    position: relative;
}

.btn-custom {
    border-radius: 100px;
    padding: 5px 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-custom:hover {
    background-color: #7cd1dc;
    transform: scale(1.1);
}

@media only screen and (min-width: 0px) and (max-width: 767px) {

    .custom-card {
        background: linear-gradient(180deg, #bef7fe 0%, #ffffff 24%);
        border-top-right-radius: unset;
    }
}
</style>
