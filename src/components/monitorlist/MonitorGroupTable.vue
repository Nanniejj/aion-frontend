<template>
    <div class="py-3 mt-3">
        <b-row cols="2" class="align-items-center mb-3 mx-0" align-h="between">
            <b-col cols="12" md="auto" class="">
                <div class="d-flex flex-wrap justify-content-start align-items-center">
                    <b-avatar text="All" size="45" style="background-color: #fed16e;"></b-avatar>
                    <div class="col-auto bold align-content-center" style="font-size: 20px;">
                        {{ totalRows.toLocaleString() }} Groups
                    </div>
                </div>
            </b-col>
            <b-col cols="12" md="auto">
                <div class="d-flex flex-wrap justify-content-end align-items-center">
                    <!-- <CreateMonitor class="col col-md-auto px-0" :class="{'w-100':type == 'hashtaglist'}" :tabsMonitor="type" @close="reload"/> -->
                    <b-form-group label-for="search-input" class="mt-3 mt-xl-0 mr-md-2 px-0 mb-0 ">
                        <b-input-group-append>
                            <b-form-input id="search-input" @input="checkSearch" v-model="search" placeholder="ค้นหา"
                                class="mr-2"></b-form-input>
                            <b-button variant="info" pill :pressed="false" @click="onSearch()"
                                class="shadow-r px-4">ค้นหา</b-button>
                        </b-input-group-append>
                    </b-form-group>
                    <b-col cols="12" sm="" class="px-0 ml-sm-2">
                        <CreateGroupModal @close="reload" />
                    </b-col>
                </div>
            </b-col>
        </b-row>

        <b-form inline class="mb-3 d-none">
            <b-form-group label-for="search-input" class="mr-3">
                <b-form-input id="search-input" @input="checkSearch" v-model="search"
                    placeholder="ค้นหา"></b-form-input>
            </b-form-group>

            <!-- <b-form-group label="ประเภท:" label-for="type-select" class="mr-3">
                <b-form-select id="type-select" v-model="filters.type" :options="typeOptions"
                    class="mr-2"></b-form-select>
            </b-form-group> -->


            <b-form-select id="source-select" v-model="filters.source" :options="sourceOptions"
                style="width: 100px;"></b-form-select>
        </b-form>

        <div class="boxlist-card py-3">
            <br>
            <vue-element-loading :active="load" size="80" background-color="rgba(255, 255, 255, 0.3)" color="#ede7dd" />
            <b-table ref="table" v-if="data.length !== 0" :items="data || []" :fields="fields" hover
                responsive :busy="load" :head-variant="headVariant" :table-variant="tableVariant" :striped="striped"
                :bordered="bordered" :borderless="borderless" :outlined="outlined" empty-filtered-text="ไม่พบข้อมูล"
                :small="small" thead-class="d-none" stacked="md">
                <template #cell(id)="data">
                    {{ data.index + 1 + (currentPage - 1) * perPage }}
                </template>
                <template #cell(name)="data">
                    <b-col class="text-left text-truncate">
                        {{ data.item.group_name }}
                    </b-col>
                </template>

                <template #cell(source)="data">
                    <b-badge
                        pill
                        button
                        variant="warning"
                        style="background-color: #fed06ea4; color: #2c3e50; font-size: 14px; width: 72px; display: inline-flex; justify-content: center; align-items: center;"
                        class="px-2 py-2"
                        v-b-tooltip="{ title: 'ดูรายชื่อบัญชีในกลุ่ม', trigger: 'hover', placement: 'top', boundary: 'window' }"
                        @click="openMembersDetails(data.item)"
                    >
                        <i class="fas fa-users mr-1" aria-hidden="true" style="font-size: 13px; line-height: 1; width: 14px; display: inline-block; text-align: center;"></i>
                        {{ formatCompactNumber(targetCount(data.item.targetlist)) }}
                    </b-badge>
                </template>
                <template #cell(type)="data">
                    <b-badge variant="warning" style="background-color: #fed06ea4; color: #2c3e50;"
                        class="text-capitalize text-truncate">{{ data.item.group_type }}
                    </b-badge>
                </template>

                <template #cell(action)="data">
                    <span class="fas fa-pen text-custom px-2" v-b-tooltip="{ title: 'แก้ไขกลุ่ม', trigger: 'hover', placement: 'top', boundary: 'window' }"
                        @click="openEditGroup(data.item)" size="sm"></span>
                    <span class="fas fa-user-plus text-custom px-2" v-b-tooltip="{ title: 'แก้ไขสมาชิกกลุ่ม', trigger: 'hover', placement: 'top', boundary: 'window' }"
                        @click="openEditGroupMember(data.item)" size="sm"></span>
                    <span class="fas fa-list-ul text-info" v-b-tooltip="{ title: 'ดูรายละเอียด', trigger: 'hover', placement: 'top', boundary: 'window' }" size="sm"
                        @click="linkToProfileGroup(data.item)"></span>
                    <span class="fas fa-trash text-danger" v-b-tooltip="{ title: 'ลบกลุ่ม', trigger: 'hover', placement: 'top', boundary: 'window' }"
                        @click="deleteGroup(data.item.group_id)" size="sm"></span>
                </template>
            </b-table>
            <div v-if="data.length === 0 && !load">
                ไม่พบข้อมูล
            </div>
        </div>    

        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="center" class="my-2"
            @input="onPageChange" />
        <EditGroupMembersModal
            :openModal="openEditGroupMemberModal"
            :selectedGroup="selectedGroup"
            @close="openEditGroupMemberModal = false"
            @update-group="apiMonitorGroupList"
        />
        <EditGroupModal 
            :groupData="selectedGroup" 
            :openModal="openEditGroupModal" 
            @close="closeEditGroup"
            @update-group="apiMonitorGroupList" 
        />
        <GroupMembers :groupName="groupDetails.group_name" :groupId="groupDetails.group_id" :openModal="openMembersModal" @close="openMembersModal = false"/>
    </div>
</template>



<script>
import CreateMonitor from "@/components/monitorlist/CreateMonitor.vue";
import CreateGroupModal from "./modals/_CreateGroupModal.vue";
import EditGroupModal from "./modals/_EditGroupModal.vue";
import EditGroupMembersModal from "./modals/_EditGroupMembersModal.vue";
// import MissingTargets from "./MissingTargets.vue";
import GroupMembers from './modals/_GroupMembersModal.vue';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
// import { mapGetters } from "vuex";
export default {
    components: {
        CreateMonitor,
        CreateGroupModal,
        EditGroupModal,
        GroupMembers,
        EditGroupMembersModal,
        // ImportPlatform,
        // MissingTargets,
    },
    props: {
        type: String
    },
    data() {
        return {
            groupDetails: {},
            // openRowId: null, // เก็บ ID ของแถวที่เปิดอยู่
            openEditGroupModal: false,
            openEditGroupMemberModal: false,
            openMembersModal: false,
            load: false,
            allData: [],  // เก็บข้อมูลทั้งหมด
            data: [],
            missingTargets: {},
            search: '',
            debounceTimeout: null,
            currentPage: 1,
            totalRows: 0,
            perPage: 10,
            followers: null,
            filters: {
                type: '',
                source: ''
            },
            fields: [
                { key: 'id', label: 'ลำดับ' },
                { key: 'name', label: 'ชื่อกลุ่ม' },
                { key: 'source', label: 'แหล่งที่มา' },
                // { key: 'link', label: 'ลิงก์เพจ' },
                { key: 'type', label: 'ประเภท' },
                { key: 'action', label: '' }
            ],
            typeOptions: [
                { value: null, text: 'ทั้งหมด' },
                { value: "group", text: 'กลุ่ม' },
                { value: "person", text: 'บุคคล' },
                { value: "company", text: 'บริษัท/องค์กร' },
            ],
            striped: false,
            bordered: false,
            borderless: false,
            outlined: false,
            small: false,
            hover: false,
            dark: false,
            fixed: false,
            footClone: false,
            headVariant: null,
            tableVariant: '',
            noCollapse: false,
            sourceOptions: [
                { value: '', text: 'All Platform' },
                { value: 'facebook', text: 'Facebook' },
                { value: 'twitter', text: 'X' },
                { value: 'pantip', text: 'Board' },
                { value: 'news', text: 'News' },
                { value: 'youtube', text: 'YouTube' },
                { value: 'instagram', text: 'Instagram' },
                { value: 'blockdit', text: 'Blockdit' },
                { value: 'tiktok', text: 'Tiktok' },
                { value: 'threads', text: 'Threads' }
            ],
            selectedGroup: {}
        };
    },
    computed: {
        filteredData() {
            if (!this.search) return this.data;
            const keyword = this.search.toLowerCase();
            return this.data.filter(item => {
                const name = (item.name || '').toString().toLowerCase();
                const uid = (item.uid || '').toString().toLowerCase();
                return name.includes(keyword) || uid.includes(keyword);
            });
        },
        pagedFilteredData() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredData.slice(start, end);
        },
    },
    watch: {
        type(val) {
            this.filters.type = val;
            this.apiMonitorGroupList();
        },
        filters: {
            deep: true,
            handler() {
                // console.log("handler === ",this.currentPage);
                this.apiMonitorGroupList();
            }
        }
    },
    methods: {
        checkSearch() {
            // ดีบาวซ์การค้นหาระหว่างพิมพ์ ไม่ให้ยิง API ถี่เกินไป
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                this.currentPage = 1;
                this.apiMonitorGroupList();
            }, 500);
        },
        onSearch() {
            // กดปุ่ม "ค้นหา" ให้ค้นหาทันที ไม่ต้องรอดีบาวซ์
            clearTimeout(this.debounceTimeout);
            this.currentPage = 1;
            this.apiMonitorGroupList();
        },
        onPageChange(page) {
            this.currentPage = page;
            this.apiMonitorGroupList();
        },
        reload() {
            // เรียกใหม่หลังสร้าง/แก้ไขกลุ่มสำเร็จ
            this.currentPage = 1;
            this.apiMonitorGroupList();
        },
        linkToProfile(item) {
            const routeData = this.$router.resolve({
                name: "MonitorProfile",
                query: {
                    id: item._id,
                    uid: item.uid?.replace('#', ''),  // ลบ '#' ออกถ้ามี
                    source: item.source,
                    type: 'targetlist'
                },
            });
            window.open(routeData.href, "_blank"); // เปิดลิงก์ในหน้าต่างใหม่
        },
        linkToProfileGroup(item) {
            const routeData = this.$router.resolve({
                name: "GroupProfile",
                query: {
                    id: item.group_id,
                    name: item.group_name,
                },
            });
            window.open(routeData.href, "_blank"); // เปิดลิงก์ในหน้าต่างใหม่
        },
        openMembersDetails(item) {
            console.log("item === ", item);
            
            this.groupDetails = item;
            this.openMembersModal = true;
        },
        openEditGroup(item) {
            this.selectedGroup = item;
            this.openEditGroupModal = true;
        },
        openEditGroupMember(item) {
            this.selectedGroup = item;
            this.openEditGroupMemberModal = true;
        },
        closeEditGroup() {
            this.openEditGroupModal = false;
            this.selectedGroup = {};
            // this.apiMonitorGroupList();
        },
        async deleteGroup(group_id) {
            const result = await Swal.fire({
                title: 'ยืนยันการลบกลุ่ม',
                text: "คุณต้องการลบกลุ่มนี้หรือไม่?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'ลบ',
                cancelButtonText: 'ยกเลิก',
                didOpen: () => {
                    const iconContent = document.querySelector('.swal2-icon-content');
                    if (iconContent) iconContent.style.display = 'none';
                }
            });

            if (result.isConfirmed) {
                this.load = true;
                const config = {
                    method: "delete",
                    url: `https://api2.cognizata.com/api/v2/monitor/deleteGroupName?group_id=${group_id}`,
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },
                };

                this.axios(config)
                    .then((response) => {
                        this.load = false;
                        Swal.fire({
                            title: 'สำเร็จ',
                            text: 'ลบกลุ่มเรียบร้อยแล้ว',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 2000
                        });
                        this.apiMonitorGroupList();
                    })
                    .catch((error) => {
                        this.load = false;
                        console.error(error);
                        Swal.fire('ผิดพลาด', 'ไม่สามารถลบกลุ่มได้', 'error');
                    });
            }
        },
        async apiMonitorGroupList() {
            this.load = true;
            // console.log('apiMonitorGroupList ===',this.currentPage);

            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/monitor/monitorGroupName",
                params: {
                    type: this.filters.type || undefined,
                    // source: this.filters.source || undefined,
                    ...(this.filters.type === 'targetlist' && { source: this.filters.source || undefined }),
                    page: this.currentPage,
                    limit: this.perPage,
                    search: this.search,
                    ...((this.filters.type === 'targetlist' && this.followers != null) && { followers: this.followers })
                    // ...(this.followers != null && { followers: this.followers }),
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            this.axios(config)
                .then((response) => {
                    const resData = response.data;
                    this.data = resData.data || [];
                    console.log(resData);
                    console.log("data === ", this.data);

                    this.totalRows = resData.total;
                    // console.log(this.totalRows);
                    // console.log(this.currentPage);                
                    this.currentPage = resData.page || 1;
                    this.load = false;
                    // if (this.filters.type) {
                    //     this.$emit('total', this.totalRows)
                    // }
                })
                .catch((error) => {
                    this.load = false;
                    this.data = [];
                    console.error(error);
                });
        },
        // targetlist มาจาก API ได้ 2 แบบ: จำนวนล้วนๆ (number) หรือ array รายชื่อบัญชีเต็ม
        // ฟังก์ชันนี้ทำให้ใช้งานได้ปลอดภัยทั้งสองแบบ
        targetCount(targetlist) {
            if (Array.isArray(targetlist)) {
                return targetlist.length;
            }
            return targetlist || 0;
        },
        targetArray(targetlist) {
            return Array.isArray(targetlist) ? targetlist : [];
        },
        // แปลงตัวเลขให้เป็นรูปแบบย่อ เช่น 1200 -> 1.2K, 1000000 -> 1M
        formatCompactNumber(num) {
            const n = Number(num) || 0;
            if (n < 1000) return n.toLocaleString();

            const units = [
                { value: 1_000_000_000, symbol: 'B' },
                { value: 1_000_000, symbol: 'M' },
                { value: 1_000, symbol: 'K' },
            ];

            const unit = units.find(u => n >= u.value);
            const shortNum = n / unit.value;
            // ตัดทศนิยม .0 ทิ้ง เช่น 1.0K -> 1K แต่เก็บ 1.2K ไว้
            const formatted = shortNum.toFixed(1).replace(/\.0$/, '');
            return formatted + unit.symbol;
        },
        formatDate(dateStr) {
            const date = new Date(dateStr);

            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const year = date.getFullYear();

            let hours = date.getHours();
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12; // Convert 0 -> 12
            const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;

            return `${day}/${month}/${year} , ${formattedTime}`;
        }
    },
    async mounted() {
        this.filters.type = this.type;
        
    }
};


</script>

<style scoped>
.text-custom {
    background: linear-gradient(90deg, #e8acac 0%, #e9c068 50%);
    -webkit-background-clip: text;
    /* สำหรับ Chrome, Safari */
    -webkit-text-fill-color: transparent;
    /* ทำให้สีตัวอักษรโปร่งใสเพื่อให้ gradient แสดง */
    background-clip: text;
    /* สำหรับ Firefox */
    color: transparent;
    /* fallback */
}

.swal2-icon.swal2-warning::before {
    content: "" !important;
}

.social-imgs {
    width: 35px;
}

.platform-imgs {
    width: 25px;
}

.shadow-r {
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

#search-input {
    border-radius: 15px;
    box-sizing: border-box;
    background-image: url("@/assets/search_icon.png");
    background-position: 5% 10px;
    background-repeat: no-repeat;
    padding: 7px 20px 7px 45px;
    border: none;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    text-align: center;
    display: inline;
}

.bg-link {
    background-color: rgb(236 247 247);
    border-radius: 20px;
    width: fit-content;
    padding: 1px 23px 1px 0px;
    box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;
}

.social-img {
    width: 25px;
}

.fa-trash,
.fa-list-ul,
.fa-user-alt-slash {
    background: #ffffff27;
    padding: 5px;
    border-radius: 10px;
    /* box-shadow: 1px 1px 3px #666666; */
    margin: 0px 5px;
    /* color: #4c412b; */
    width: 40px;
    height: 35px;
}

.boxlist-card {
    border: 0px;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
    border-radius: 15px;
    min-height: 400px;
}

/* กันไม่ให้ tooltip ทับ chip/ไอคอนในตาราง ให้ลอยอยู่เหนือเนื้อหาเสมอ */
::v-deep .tooltip {
    z-index: 1080;
}
</style>