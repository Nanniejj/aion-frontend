<template lang="">
    <div v-if="!searchQuery || filteredObject.length !== 0">
        <!-- ชื่อ Subdomain -->
        <b-col sm="12" md="4" lg="4" class="d-flex justify-content-between align-items-center"
          style="background-color: #7cd1dc; color: #000; border-top-left-radius: 10px; border-top-right-radius: 10px; padding: 10px; margin-bottom: 0px;">
            <span class="text-center subdomain-name" style="flex: 1;">
                {{ subdomain.subdomain_name }}
                <!-- {{ subdomain.subdomain_id }} -->
            </span>

            <div class="d-flex justify-content-end">
                <b-button size="sm" class="rounded-circle"
                style="background-color: white;  color: #2c3e50; width: 30px; height: 30px;"
                @click="editSubdomain()">
                <i class="fa fa-pencil"></i>
                </b-button>

                <b-button @click="deleteSubdomain()" size="sm" class="rounded-circle ml-2"
                style="background-color: white;  color: #2c3e50; width: 30px; height: 30px;"
               >
                <i class="fa fa-trash-alt"></i>
                </b-button>
            </div>
        </b-col>

        <!-- Objects ใน Card -->
        <b-card class="custom-card">
          <!-- <vue-element-loading :active="loadWord" size="50" background-color="rgba(255, 255, 255, 0.1)"
            color="#b6ac9a" /> -->
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

          <!--ก้อนคำว่า object -->
          <b-row v-if="subdomain && subdomain.objects && subdomain.objects.length">
            <b-col class="">
              <div class="scroll-obj">
                <!-- :class="{
                    'active-item':
                      selectedObject.object_id === object.object_id,
                    'inactive-item':
                      selectedObject.object_id !== object.object_id,
                  }" -->
                <div v-for="(object, objIndex) in filteredObject" :key="objIndex"
                  class="object-item d-flex align-items-center justify-content-between py-2 px-3 " 
                   :class="{
                    'active-item':
                      selectedObject && selectedObject.object_id === object.object_id,
                    'inactive-item':
                      selectedObject && selectedObject.object_id !== object.object_id,
                  }"
                  @click="setActive(object)"
                  style="border: 0px solid #ccc; border-radius: 15px; margin-bottom: 20px; cursor: pointer;">
                  <span class="text-center object-name" style="flex: 1;">
                    {{ object.object_name }}
                  </span>

                  <div class="d-flex justify-content-end">
                    <EditObjectKeyword :objectData="{ subdomain_id: subdomain.subdomain_id, ...dataKeyword }"
                      :btn="'edit'" />

                    <b-button size="sm" class="rounded-circle"
                      style="background-color: white; color: #2c3e50; width: 30px; height: 30px; margin-right: 3px;"
                      @click="openDeleteObjectModal(object)">
                      <i class="fa fa-trash-alt icon-hover"></i>
                    </b-button>
                  </div>
                </div>
              </div>
            </b-col>
            <b-col v-if="selectedObject" cols="12" md="7" lg="8" style="text-align: left;">
                <div v-if="selectedObject.keywords && selectedObject.keywords.length">
                    <strong class="my-3">Keywords</strong><br />
                    <div style="overflow-y: auto; max-height: 200px;">
                        <div v-for="(keyword, index) in selectedObject.keywords" :key="index"
                            class="keyword-box my-1 px-3"
                            
                            :class="{ 'glow-box': searchQuery && keyword.toLowerCase().includes(searchQuery.toLowerCase()) }"
                        >
                        <Highlighter class="my-highlight md-font" highlightClassName="highlight-search"
                            :searchWords="[searchQuery]" :autoEscape="true" :textToHighlight="keyword"></Highlighter>
                        </div>
                    </div>
                </div>
                <div v-if="selectedObject.and_keywords && selectedObject.and_keywords.length" style="margin-top: 10px;">
                    <strong class="my-3">Include Keywords</strong><br />
                    <div style="overflow-y: auto; max-height: 200px;">
                        <div v-for="(and_keywords, index) in selectedObject.and_keywords" :key="index" 
                            :class="{ 'glow-box': searchQuery && and_keywords.toLowerCase().includes(searchQuery.toLowerCase()) }"
                        class="keyword-box px-3 my-1">
                        <Highlighter class="my-highlight md-font" highlightClassName="highlight-search"
                            :searchWords="[searchQuery]" :autoEscape="true" :textToHighlight="and_keywords"></Highlighter>
                        </div>
                    </div>
                </div>
                <div v-if="selectedObject.not_keywords && selectedObject.not_keywords.length" style="margin-top: 10px;">
                    <strong class="my-3">Exclude Keywords</strong><br />
                    <div style="overflow-y: auto; max-height: 200px;">
                        <div v-for="(not_keywords, index) in selectedObject.not_keywords" :key="index" 
                            :class="{ 'glow-box': searchQuery && not_keywords.toLowerCase().includes(searchQuery.toLowerCase()) }"
                        class="keyword-box px-3 my-1">
                        <Highlighter class="my-highlight md-font" highlightClassName="highlight-search"
                            :searchWords="[searchQuery]" :autoEscape="true" :textToHighlight="not_keywords"></Highlighter>
                        </div>
                    </div>
                </div>
                <div v-if="subdomain">
                    <EditObjectKeyword 
                        :objectData="{ subdomain_id: subdomain.subdomain_id, ...dataKeyword }"
                        :btn="'icon'" 
                    />
                </div>
            </b-col>
            <!-- <b-col v-else-if="!selectedObject && filteredObject.length" cols="12" md="7" lg="8" class="text-center align-self-center">
                - กรุณาเลือก object ที่ต้องการแสดงรายละเอียด -
            </b-col> -->
            <b-col v-else cols="12" md="7" lg="8" class="text-center align-self-center">
                ไม่พบข้อมูล object ที่ตรงกับคำค้นหา
            </b-col>
          </b-row>
          <div v-else class="my-3 gray">
            ไม่พบข้อมูล
          </div>
        </b-card>
    </div>
</template>
<script>
import CreateObject from "./CreateObject.vue";
import EditObjectKeyword from "./EditObjectKeyword.vue";
import Highlighter from "vue-highlight-words";
import Swal from 'sweetalert2'
export default {
    components: {
        EditObjectKeyword,
        CreateObject,
        Highlighter,
    },
    props: {
        subdomain: {
            type: Object,
            required: true
        },
        searchQuery: {
            type: String,
            default :""
        }
    },
    data() {
        return {
            // searchQuery: "",
            filteredObject: [],
            selectedObject : null
            // selectedObject: this.subdomain.objects?.find(
            //     obj => obj.object_id === this.subdomain.activeObjectId
            // ) || null
        }
    },
    methods: {
        // checkObjectFilter() {
        //     if (!this.searchQuery) {
        //         // this.filteredObject = this.subdomain.objects;
        //         // apiList
        //     }
        // },
        // filterObject() {
        //     const query = (this.searchQuery || '').trim().toLowerCase();
        //         console.log("query === ",query,this.subdomain.objects);
        //     const objects = this.subdomain.objects;
        //     if (!query) {
        //         this.filteredObject = objects;
        //     }
        //     else {
        //         this.filteredObject = objects.filter(objects =>
        //             objects.object_name &&
        //             objects.object_name.toLowerCase().includes(query)
        //         );
        //         // this.selectedObject = null
        //         console.log("filteredObject === ", this.filteredObject);
        //     }
        // },
        filterObject() {
            const query = (this.searchQuery || '').trim().toLowerCase();
            // console.log("query === ", query, this.subdomain.objects);

            const objects = this.subdomain.objects;

            if (!query) {
                this.filteredObject = objects;
            } else {
                const filtered = objects.filter(obj => {
                const inKeywords =
                    obj.keywords &&
                    obj.keywords.some(k => k.toLowerCase().includes(query));

                const inAndKeywords =
                    obj.and_keywords &&
                    obj.and_keywords.some(k => k.toLowerCase().includes(query));

                const inNotKeywords =
                    obj.not_keywords &&
                    obj.not_keywords.some(k => k.toLowerCase().includes(query));

                return inKeywords || inAndKeywords || inNotKeywords;
                });

                // ✅ ถ้าไม่เจอเลย -> คงค่า objects เดิม
                this.filteredObject = filtered;
                // this.filteredObject = filtered.length > 0 ? filtered : objects;
                this.selectedObject = this.filteredObject[0]
                // console.log("filteredObject === ", this.filteredObject);
            }
        },
        deleteSubdomain() {
            // console.log("deleteSubDomain");
            this.$emit('delete-subDomain');
        },
        editSubdomain() {
            this.$emit('edit-subDomain');
        },
        setActive(object) {
            this.selectedObject = object
            // console.log(object)
        },
        openDeleteObjectModal(object) {
            Swal.fire({
                title: 'ยืนยันการลบ Object',
                html: `คุณต้องการลบ Object <b>${object.object_name}</b> หรือไม่?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ลบ',
                cancelButtonText: 'ยกเลิก',
                didOpen: () => {
                    const iconContent = document.querySelector('.swal2-icon-content');
                    if (iconContent) iconContent.style.display = 'none';
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    // console.log("object === ", object);
                    this.deleteObject(object.object_id);
                }
            });
        },
        deleteObject(objectId) {
            try {
                this.axios.delete(
                    `https://api2.cognizata.com/api/v2/setting/deleteObject/${objectId}`,
                    {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                    }).then((response) => {
                        Swal.fire({
                            title: 'บันทึกแล้ว!',
                            text: 'ข้อมูลของคุณถูกบันทึกเรียบร้อย',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 3000,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            buttonsStyling: false
                        })
                        this.$emit('reset')
                        // this.selectedObject = this.subdomain.objects?.find(
                        //     obj => obj.object_id === this.subdomain.activeObjectId
                        // ) || null
                    }
                    )
            } catch (error) {
                console.error("Error deleting object:", error);
                alert("เกิดข้อผิดพลาดในการลบ Object");
            }
        }
    },
    mounted() {
        this.filteredObject = this.subdomain.objects
    },
    computed: {
        dataKeyword() {
            return this.selectedObject || { keywords: [], and_keywords: [], not_keywords: [] }
        }
    },
    watch: {
        subdomain: {
            deep: true,
            immediate: true,
            handler(newVal) {
                this.filteredObject = newVal.objects
                this.selectedObject = this.filteredObject[0]
            }
        },
        searchQuery: {
            handler(newVal) {
                // console.log("new searchQuery === ", newVal);
                if (newVal) {
                    this.filterObject();
                } else {
                    this.filteredObject = this.subdomain.objects
                    this.selectedObject = this.filteredObject[0]
                }
            }
        }
    },
}
</script>
<style scoped>
.bage-keyword {
    background-color: rgb(213, 246, 250);
    /* padding: 10px;
    padding-right: 20px;
    padding-left: 20px;
    border-radius: 10px;
    cursor: pointer; */
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 6px 12px;
    /* background: #2c3e50;
    color: #bef7fe; */
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    position: relative;
    overflow: hidden;
    transition: all 0.5s ease;
}

/* เอฟเฟกต์ข้อความ */
.bage-keyword span {
    position: relative;
    z-index: 2;
}

/* เลเยอร์ไฟ holographic */
.bage-keyword::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(0deg,
            transparent,
            transparent 30%,
            rgba(0, 255, 255, 0.3));
    transform: rotate(-45deg);
    transition: all 0.5s ease;
    opacity: 0;
}

/* hover effect */
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

/* กดคัดลอกแล้ว */
.bage-keyword.copied {
    background: #0ff !important;
    color: #000 !important;
    box-shadow: 0 0 20px #0ff;
}
.glow-box {
    border-color: 2px solid #f8aa02;
    /* สี border เข้มขึ้น */
    box-shadow: 0 0 5px #f8aa02, 0 0 10px #ffc443, 0 0 15px #fdd071;
    border-radius: 6px;
    transition: box-shadow 0.3s ease-in-out;
}
.highlight-search {
    background-color: #fdd071ab;
    padding: 0 2px;
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

.modal-header {
    /* padding: 0rem 1rem; */
    border-bottom: 0px solid #dee2e6;
}

.subdomain-name {
    font-size: 20px;
}

.custom-modal-title {
    padding-top: 20px;
    padding-bottom: 0px;
}

.scroll-obj {
    /* flex: 1; */
    padding: 10px;
    /* max-height: calc(50vh - 200px);*/
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
    border: 0px solid rgba(0, 0, 0, .125);
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.card-actions {
    position: absolute;
    top: 10px;
    /* ระยะห่างจากด้านบน */
    right: 10px;
    /* ระยะห่างจากด้านขวา */
    display: flex;
    gap: 5px;
    /* ระยะห่างระหว่างปุ่ม */
}

.rounded-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    width: 30px;
    height: 30px;
}
.object-item{
    background-color: white;
    /* สีพื้นหลังเมื่อยังไม่ Active */
    color: #2c3e50;
    border: 1px solid #ccc;
    box-shadow: rgba(37, 37, 37, 0.2) 0px 2px 8px 0px;
}
.active-item {
    background-color: #fdd071;
    /*Active */
    color: #2c3e50;
    box-shadow: #7cd1dc 0px 2px 8px 0px;
}

.inactive-item {
    background-color: white;
    /* สีพื้นหลังเมื่อยังไม่ Active */
    color: #2c3e50;
    border: 1px solid #ccc;
    box-shadow: rgba(37, 37, 37, 0.2) 0px 2px 8px 0px;
}

.inactive-item:hover {
    /* background-color: #f5f5f5; */
    border-color: 2px solid #f8aa02;
    /* สี border เข้มขึ้น */
    box-shadow: 0 0 5px #f8aa02, 0 0 10px #ffc443, 0 0 15px #fdd071;
    /* เงาเรืองแสงหลายชั้น */
    cursor: pointer;
    /* แสดงว่าเป็น element กดได้ */
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

.keyword-delete-icon {
    font-size: 14px;
    color: #ccc;
    cursor: pointer;
    margin-left: 5px;
    position: absolute;
    top: 8px;
    right: 5px;
}

.keyword-section {
    padding-top: 10px;
    padding-bottom: 10px;
}

.btn-custom {
    border-radius: 100px;
    /* ปุ่มวงกลม */
    padding: 5px 10px;
    /* ปรับขนาด สูง*กว้าง */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    /* เพิ่มเงา */
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-custom:hover {
    background-color: #7cd1dc;
    /* สีเมื่อ hover */
    transform: scale(1.1);
    /* ขยายเล็กน้อยเมื่อ hover */
}

.btn-add {
    margin-top: 10px;
    display: inline-block;
}

.btn-submit {
    margin-top: 150px;
    background-color: #7cd1dc !important;
    /* Background color */
    border-radius: 25px;
    /* Rounded corners */
    font-size: 16px;
    /* Text size */
    align-items: center;
    justify-content: center;
    display: flex;
    cursor: pointer;
    /* Pointer cursor */
    border: none;
    /* ลบขอบ */
    transition: none;
    color: #000;
    /* ยกเลิกแอนิเมชัน */
}

.btn-submit:hover,
.btn-submit:active,
.btn-submit:focus {
    background-color: #2daec0 !important;
    /* คงสีเดิม */
    transform: none;
    /* ไม่ขยายหรือเปลี่ยนขนาด */
    outline: none;
    /* ไม่แสดงกรอบโฟกัส */
}

.custom-modal {
    border-radius: 10px;
    /* ปรับมุมโค้งของ modal */
}

.custom-form {
    padding: 10px;
    /* เพิ่มระยะห่างภายในฟอร์ม */
}

.no-border {
    background-color: transparent;
    /* พื้นหลังใส */
    border: none;
    /* ลบกรอบ */
    box-shadow: none;
    /* ลบเงา */
    padding: 0;
    /* ลบระยะห่าง */
    cursor: pointer;
    /* เปลี่ยนเมาส์เป็น pointer */
}

.no-border:hover,
.no-border:active,
.no-border:focus {
    background-color: transparent;
    /* คงพื้นหลังใส */
    transform: none;
    outline: none;
    /* ลบกรอบ focus */
}

.icon-hover {
    transition: none;
    /* ยกเลิกแอนิเมชัน */
}

.icon-hover:hover,
.icon-hover:active {
    transform: none;
    /* ไม่เปลี่ยนขนาด */
}

@media only screen and (min-width: 0px) and (max-width: 767px) {
    .custom-card {
        background: linear-gradient(180deg, #bef7fe 0%, #ffffff 24%);
        border-top-right-radius: unset;
    }
}
</style>
