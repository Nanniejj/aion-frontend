<template>
    <div class="py-3 mt-3">
        <b-row cols="2" class="align-items-center mb-3 mx-0" align-h="between">
            <b-col cols="12" lg="" class="pr-0">
                <div class="d-flex flex-wrap justify-content-between align-items-center">
                    <b-row class="m-0">
                        <b-avatar text="All" size="45" style="background-color: #fed16e;"></b-avatar>
                        <div class="col-auto bold align-content-center" style="font-size: 20px;">
                            {{pagination.totalCount | numFormat }} Communities
                        </div>
                    </b-row>
                    <b-form-group class="align-items-center text-center mt-3 mt-sm-2 mt-xl-0 mb-0" v-slot="{ ariaDescribedby }">
                        <b-form-radio-group
                            id="radio-group-2"
                            v-model="groupType"
                            :aria-describedby="ariaDescribedby"
                            name="radio-group"
                        >
                            <b-form-radio :value="null">ทั้งหมด</b-form-radio>
                            <!-- <b-form-radio value="public">กลุ่มสาธารณะ</b-form-radio>
                            <b-form-radio value="private">กลุ่มปิด</b-form-radio> -->
                            <b-form-radio v-for="item in options" :key="'item - ' + item.text" :value="item.value">{{item.text}}</b-form-radio>
                        </b-form-radio-group>
                    </b-form-group>
                </div>
            </b-col>
            <b-col cols="12" lg="auto">
                <b-row class="m-0 justify-content-end align-items-center">
                    <b-form-group label-for="search-input" class="col mt-3 mt-xl-0 mr-md-2 px-0 mb-0 ">
                        <b-input-group-append>
                            <b-form-input id="search-input" @input="checkSearch" v-model="search" placeholder="ค้นหา"
                                class="mr-2"></b-form-input>
                            <b-button variant="info" pill :pressed="false" @click="onSearch()"
                                class="shadow-r px-4">ค้นหา</b-button>
                        </b-input-group-append>
                    </b-form-group>
                    <b-col cols="12" sm="auto" class="px-0 ml-sm-2">
                        <CreateCommunityModal  @close="apiGetCommunities"/>
                    </b-col>
                </b-row>
            </b-col>
            <b-col cols="12" class="mt-3">
                <div  class="boxlist-card py-5">
                    <vue-element-loading :active="loading" size="80" 
                    background-color="rgba(255, 255, 255, 0.3)" 
                    color="#ede7dd" />
                    <!-- thead-class="d-none" -->
                    <b-table 
                        ref="table" v-if="communities.length !== 0" 
                        show-details :items="communities || []" 
                        :fields="tableFields" hover
                        responsive :busy="loading" :striped="false"
                        :bordered="false" :borderless="false" :outlined="false" empty-filtered-text="ไม่พบข้อมูล"
                        :small="false" stacked="md">
                        <template #cell(id)="data">
                            {{ data.index + 1 + (pagination.currentPage - 1) * pagination.limit }}
                        </template>

                        <template #cell(name)="data">
                            <div class="d-flex justify-content-start align-items-center" >
                                <b-col cols="auto" class="mr-2">
                                    <b-avatar :src="data.item.profile_image"
                                        v-if="data && data.item && data.item.profile_image">
                                    </b-avatar>
                                    <b-avatar :src="data.item.profile_image" v-else> </b-avatar>
                                    <img v-if="data.item.source == 'facebook'" src="@/assets/Facebook.png" class="social-img" />
                                    <img v-if="data.item.source == 'twitter'" src="@/assets/Twitter.png" class="social-img" />
                                    <img v-if="data.item.source == 'pantip'" src="@/assets/board.png" class="social-img" />
                                    <img v-if="data.item.source == 'blockdit'" src="@/assets/Blockdit.png" class="social-img" />
                                    <img v-if="data.item.source == 'instagram'" src="@/assets/Instagram.png" class="social-img" />
                                    <img v-if="data.item.source == 'youtube'" src="@/assets/Youtube.png" class="social-img" />
                                    <img v-if="data.item.source == 'news'" src="@/assets/News.png" class="social-img" />
                                    <img v-if="data.item.source == 'tiktok'" src="@/assets/Tiktok.png" class="social-img" />
                                    <img v-if="data.item.source == 'threads'" src="@/assets/Threads.png" class="social-img" />
                                <!-- <a :href="data.item.link_original" target="_blank" class="mx-2 text-truncate d-inline-block"
                                    style="color: #2c3e50 !important;">
                                    {{ data.item.uid }}
                                </a> -->
                                </b-col>
                                <!-- <span class="text-truncate d-sm-none d-lg-block w-auto">
                                    {{ data.item.name || data.item.uid }}
                                </span>
                                <span class="text-truncate d-none d-sm-inline-block d-lg-none" style="max-width: 100px;">
                                    {{ data.item.name || data.item.uid }}
                                </span> -->
                                <a :href="data.item.link_original" target="_blank" class="text-truncate d-sm-none d-lg-block w-auto"
                                    style="color: #2c3e50 !important;">
                                   {{ data.item.name || data.item.uid }}
                                </a>
                                <a :href="data.item.link_original" target="_blank" class="text-truncate d-none d-sm-inline-block d-lg-none"
                                    style="color: #2c3e50 !important;">
                                   {{ data.item.name || data.item.uid }}
                                </a>
                            </div>
                        </template>

                        <template #cell(followers)="data">
                            <span class="small"> {{ formatNumber(data.item.followers) }}</span>
                        </template>
                        <template #cell(insert_timestamp)="data">
                            <span class="small"> {{ formatDate(data.item.insert_timestamp) }}</span>
                        </template>
                        <template #cell(bot_timestamp)="data" v-if="username === 'adminatapy'">
                            <span v-if="data.item.latest_bot_update" class="small"> {{ formatBotDate(data.item.latest_bot_update) }}</span>
                            <span v-else class="small"> - </span>
                        </template>

                        <template #cell(group_type)="data">
                            <b-badge pill 
                                :style="data.item.group_type === 'private' 
                                ? { backgroundColor: '#fed06ea4', color: '#2c3e50' } 
                                : { backgroundColor: '#C0ECF8', color: '#2c3e50' }"
                                class="text-capitalize text-truncate">{{ data.item.group_type }}
                            </b-badge>
                        </template>
                        <template #cell(status)="data" v-if="username === 'adminatapy'">
                            <!-- v-if="data.item.group_type === 'private'" -->
                            <b-row class="align-items-center justify-content-center text-truncate "
                                :class="data.item.group_status === 'done' || data.item.group_type === 'public' ? 'text-success' : 'text-danger'"
                            >
                                <b-icon icon="dot" scale="3" 
                                    :variant="data.item.group_status === 'done'|| data.item.group_type === 'public' ? 'success' : 'danger'"></b-icon>
                                <span v-if="data.item.group_status === 'done' || data.item.group_type === 'public'">เข้ากลุ่มแล้ว</span>
                                <span v-else>รอเข้ากลุ่ม</span>
                                <!-- {{data.item.group_status}} -->
                            </b-row>
                        </template>

                        <template #cell(action)="data">
                            <b-row class="m-0 justify-content-end align-items-center">
                                <span v-if="username == 'adminatapy'" class="fas fa-pen px-3" v-b-tooltip.hover title="แก้ไขข้อมูล"
                                    @click="data.toggleDetails" size="sm"></span>
                                <span class="fas fa-list-ul text-info" v-b-tooltip.hover title="ดูรายละเอียด" size="sm"
                                    @click="linkToProfile(data.item)"></span>
                                <span class="fas fa-trash text-danger px-3" v-b-tooltip.hover title="ลบกลุ่ม"
                                    @click="deleteGroup(data.item)" size="sm"></span>
                            </b-row>
                        </template>
                        <!-- แถวรายละเอียด -->
                        <template #row-details="row">
                            <b-card class="text-left" style="max-height:400px;overflow-y:auto;">
                                <ProfileEdit 
                                    type="community"
                                    :item="row.item" 
                                    
                                    @close="row.toggleDetails()"
                                    @updated="apiGetCommunities()"
                                />
                            </b-card>
                        </template>
                    </b-table>
                    <b-col v-else class="text-center text-secondary">
                        - ไม่พบข้อมูล -
                    </b-col>
                </div>
                <b-col cols="12" class="pt-3">
                    <b-pagination 
                        v-model="pagination.currentPage"
                        :total-rows="pagination.totalCount" 
                        :per-page="pagination.limit" 
                        align="center" class="my-2"
                        @input="onPageChange" 
                    />
                </b-col>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import CreateCommunityModal from './modals/_CreateCommunityModal.vue';
import ProfileEdit from './_ProfileEdit.vue';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default {
    components: {
        CreateCommunityModal,
        ProfileEdit
    },
    data() {
        return {
            loading: false,
            search: '',
            groupType: null,
            pagination: {
                totalCount: 0,
                totalPages: 1,
                currentPage: 1,
                limit: 10
            },
            options: [
                // { text: 'ทั้งหมด', value: null },
                { text: 'กลุ่มปิด', value: 'private' },
                { text: 'กลุ่มสาธารณะ', value: 'public' }
            ],
            fields: [
                { key: 'id', label: 'ลำดับ' },
                { key: 'name', label: 'ชื่อกลุ่ม' },
                // { key: 'source', label: 'แหล่งที่มา' },
                { key: 'followers', label: 'สมาชิก' },
                { key: 'insert_timestamp', label: 'อัพเดตล่าสุด' },
                { key: 'bot_timestamp', label: 'เก็บล่าสุด' },
                { key: 'group_type', label: '' },
                { key: 'status', label: '' },
                { key: 'action', label: '' }
            ],
            communities: [],
            // influencerTypes: [],
            username: "",
        }
    },
    computed: {
        tableFields() {
            let hidden = [];

            if (this.username !== 'adminatapy') {
                hidden = ['bot_timestamp', 'status']; // กำหนด column ที่ต้องซ่อน
            }

            return this.fields.filter(f => !hidden.includes(f.key));
        }
    },
    methods: {
        formatNumber(num) {
            if (num == null) {
                return '0';
            }
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            }
            if (num >= 1000) {
                return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
            }
            return num.toString();
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
        onPageChange(page) {
            this.pagination.currentPage = page;
            this.apiGetCommunities();
        },
        checkSearch() {
            if (this.search.trim() === '') {
                this.apiGetCommunities();
            }
        },
        onSearch() {
            this.pagination.currentPage = 1;
            this.apiGetCommunities();
        },
        // formatDate(dateStr) {
        //     const date = new Date(dateStr);
        //     const day = String(date.getDate()).padStart(2, '0');
        //     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        //     const year = date.getFullYear();

        //     let hours = date.getHours();
        //     const minutes = String(date.getMinutes()).padStart(2, '0');
        //     const seconds = String(date.getSeconds()).padStart(2, '0');

        //     const ampm = hours >= 12 ? 'PM' : 'AM';
        //     hours = hours % 12 || 12; // Convert 0 -> 12
        //     const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;

        //     return `${day}/${month}/${year} , ${formattedTime}`;
        // },
        formatDate(dateStr) {
            const date = new Date(dateStr);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const year = date.getFullYear();

            const hours = String(date.getHours()).padStart(2, '0'); // 24-hour format
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            const formattedTime = `${hours}:${minutes}:${seconds}`;

            return `${day}/${month}/${year} , ${formattedTime}`;
        },
        formatBotDate(dateStr) {
            const date = new Date(dateStr);
            // ✅ ใช้ UTC เพื่อไม่ให้บวกเวลาเพิ่ม
            const day = String(date.getUTCDate()).padStart(2, '0');
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const year = date.getUTCFullYear();

            const hours = String(date.getUTCHours()).padStart(2, '0');
            const minutes = String(date.getUTCMinutes()).padStart(2, '0');
            const seconds = String(date.getUTCSeconds()).padStart(2, '0');

            return `${day}/${month}/${year} , ${hours}:${minutes}:${seconds}`;
        },
        async getPreview() {
            const url = 'https://www.facebook.com/groups/jjookklong3';
        
            try {
                let img = `https://graph.facebook.com/${url}/picture?type=large`;
                console.log("data === ", img);

            } catch (error) {
                console.error("Error fetching preview:", error);
            }
            
        },
        async deleteGroup(item) {
            Swal.fire({
                title:'คุณแน่ใจหรือไม่?',
                text: 'คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ใช่, เลิกการติดตามเลย!',
                cancelButtonText: 'ยกเลิก',
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    const iconContent = document.querySelector('.swal2-icon-content');
                    if (iconContent) iconContent.style.display = 'none';
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log("item === ", item);
                    this.apiDeleteMonitor(item._id);
                } else {
                    Swal.fire({
                            title: "ยกเลิก",
                            text: "ยกเลิกเรียบร้อย",
                            icon: "error",
                            showConfirmButton: false,
                            timer: 2000
                    });
                }
            })
        },
        async apiDeleteMonitor(id) {
            console.log("item id === ", id);
            const config = {
                    method: "delete",
                    url: `https://api2.cognizata.com/api/v2/monitor/deleteMonitor/${id}`,
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },
                };

                this.axios(config)
                    .then((response) => {
                        this.apiGetCommunities();
                        Swal.fire({
                            title: 'สำเร็จ',
                            text: 'ลบกลุ่มเรียบร้อยแล้ว',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 2000
                        });
                        
                    })
                    .catch((error) => {
                        console.error(error);
                        Swal.fire('ผิดพลาด', 'ไม่สามารถลบกลุ่มได้', 'error');
                    });
        },
        async apiGetCommunities() {
            this.loading = true;
            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/monitor/getMonitor",
                params: {
                    type: 'group',
                    page: this.pagination.currentPage,
                    limit: this.pagination.limit,
                    search: this.search,
                    group_type: this.groupType === null ? '' : this.groupType
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            this.axios(config)
                .then((response) => {
                    const resData = response.data;
                    this.communities = resData.data || [];
                    this.pagination = resData.pagination || {};
                    this.loading = false;
                })
                .catch((error) => {
                    this.loading = false;
                    this.data = [];
                    console.error(error);
                });
        },
       
    },
    async mounted() {
        this.username = localStorage.getItem("username");
        await this.apiGetCommunities();
        await this.getPreview();
    },
    watch: {
        groupType() {
            this.pagination.currentPage = 1;
            this.search = null;
            this.apiGetCommunities();
        }
    },
}
</script>
<style scoped>
.social-img {
    position: absolute;
    width: 25px;
    bottom: 0%;
    left: 20%;
    /* margin-top: 15px; */
    /* left: 9%; */
}

.boxlist-card {
    border: 0px;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
    border-radius: 15px;
    min-height: 400px;
}
</style>