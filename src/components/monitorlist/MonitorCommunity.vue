<template>
    <div class="py-3 mt-3">
        <b-row cols="2" class="align-items-center mb-3 mx-0" align-h="between">
            <b-col cols="12" md="" class="pr-0">
                <div class="d-flex flex-wrap justify-content-between align-items-center">
                    <b-row class="m-0">
                        <b-avatar text="All" size="45" style="background-color: #fed16e;"></b-avatar>
                        <div class="col-auto bold align-content-center" style="font-size: 20px;">
                            {{pagination.totalCount | numFormat }} Communities
                        </div>
                    </b-row>
                    <b-form-group class="align-items-center mb-0" v-slot="{ ariaDescribedby }">
                        <b-form-radio-group
                            id="radio-group-2"
                            v-model="selected"
                            :aria-describedby="ariaDescribedby"
                            name="radio-sub-component"
                        >
                            <b-form-radio v-for="item in options" :key="'item - ' + item.text" :value="item.value">{{item.text}}</b-form-radio>
                        </b-form-radio-group>
                    </b-form-group>
                </div>
            </b-col>
            <b-col cols="12" sm="" lg="auto">
                <div class="d-flex flex-wrap justify-content-end align-items-center">
                    <b-form-group label-for="search-input" class="mt-3 mt-xl-0 mr-md-2 px-0 mb-0 ">
                        <b-input-group-append>
                            <b-form-input id="search-input" v-model="search" placeholder="ค้นหา"
                                class="mr-2"></b-form-input>
                            <b-button variant="info" pill :pressed="false" @click="onSearch()"
                                class="shadow-r px-4">ค้นหา</b-button>
                        </b-input-group-append>
                    </b-form-group>
                    <b-col cols="12" sm="" class="px-0 ml-sm-2">
                        <CreateCommunityModal />
                    </b-col>
                </div>
            </b-col>
            <b-col cols="12" class="mt-3">
                <div  class="boxlist-card py-5">
                <vue-element-loading :active="loading" size="80" 
                background-color="rgba(255, 255, 255, 0.3)" 
                color="#ede7dd" />
                <b-table ref="table" v-if="communities.length !== 0" show-details :items="communities || []" :fields="fields" hover
                responsive :busy="loading" :striped="false"
                :bordered="false" :borderless="false" :outlined="false" empty-filtered-text="ไม่พบข้อมูล"
                :small="false" thead-class="d-none" stacked="md">
                <template #cell(id)="data">
                    {{ data.index + 1 + (pagination.currentPage - 1) * pagination.limit }}
                </template>

                <template #cell(name)="data">
                    <div class="d-flex justify-content-start align-items-center" >
                        <span class="mr-2">
                            <b-avatar :src="data.item.profile_image"
                                v-if="data && data.item && data.item.profile_image">
                            </b-avatar>
                            <b-avatar :src="data.item.profile_image" v-else> </b-avatar>
                        </span>
                        <span class="text-truncate d-sm-none d-lg-block w-auto">
                            {{ data.item.name || data.item.uid }}
                        </span>
                        <span class="text-truncate d-none d-sm-inline-block d-lg-none" style="max-width: 100px;">
                            {{ data.item.name || data.item.uid }}
                        </span>
                    </div>
                </template>
                <template #cell(source)="data">
                    
                    <div class="small d-flex align-items-center pr-0 w-auto">
                        <img v-if="data.item.source == 'facebook'" src="@/assets/Facebook.png" class="social-img" />
                        <img v-if="data.item.source == 'twitter'" src="@/assets/Twitter.png" class="social-img" />
                        <img v-if="data.item.source == 'pantip'" src="@/assets/board.png" class="social-img" />
                        <img v-if="data.item.source == 'blockdit'" src="@/assets/Blockdit.png" class="social-img" />
                        <img v-if="data.item.source == 'instagram'" src="@/assets/Instagram.png" class="social-img" />
                        <img v-if="data.item.source == 'youtube'" src="@/assets/Youtube.png" class="social-img" />
                        <img v-if="data.item.source == 'news'" src="@/assets/News.png" class="social-img" />
                        <img v-if="data.item.source == 'tiktok'" src="@/assets/Tiktok.png" class="social-img" />
                        <img v-if="data.item.source == 'threads'" src="@/assets/Threads.png" class="social-img" />
                        <a :href="data.item.link_original" target="_blank" class="mx-2 text-truncate d-inline-block"
                            style="color: #2c3e50 !important;">
                            {{ data.item.uid }}
                        </a>
                    </div>
                </template>
                <template #cell(insert_timestamp)="data">
                    <span class="small"> {{ formatDate(data.item.insert_timestamp) }}</span>
                </template>
                <template #cell(group_type)="data">
                    <b-badge variant="info" pill 
                        :style="data.item.group_type === 'private' 
                        ? { backgroundColor: '#fed06ea4', color: '#2c3e50' } 
                        : {}"
                        class="text-capitalize text-truncate">{{ data.item.group_type }}
                    </b-badge>
                </template>

                <template #cell(action)="data">
                    <span class="fas fa-pen px-2 text-warning" v-b-tooltip.hover title="แก้ไขกลุ่ม"
                        @click="openEditGroup(data.item)" size="sm"></span>
                    <span class="fas fa-list-ul text-info pr-2" v-b-tooltip.hover title="ดูรายละเอียด" size="sm"
                        @click="linkToProfile(data.item)"></span>
                    <span class="fas fa-trash text-danger" v-b-tooltip.hover title="ลบกลุ่ม"
                        @click="deleteGroup(data.item)" size="sm"></span>
                </template>
            </b-table>
            </div>
            </b-col>
        </b-row>
    </div>
</template>
<script>
import CreateCommunityModal from './_CreateCommunityModal.vue';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
export default {
    components: {
        CreateCommunityModal
    },
    data() {
        return {
            loading: false,
            search: '',
            selected: 'all',
            pagination: {
                totalCount: 0,
                totalPages: 1,
                currentPage: 1,
                limit: 10
            },
            // currentPage: 1,
            // perPage: 10,
            options: [
                { text: 'ทั้งหมด', value: 'all' },
                { text: 'กลุ่มปิด', value: 'private' },
                { text: 'กลุ่มสาธารณะ', value: 'public' }
            ],
            fields: [
                { key: 'id', label: 'No.' },
                { key: 'name', label: 'name' },
                { key: 'source', label: 'source' },
                { key: 'insert_timestamp', label: 'เวลาล่าสุด' },
                { key: 'group_type', label: '' },
                { key: 'action', label: '' }
            ],
            communities: [
                {
                    name: "Vue.js Developers Thailand",
                    members: 15000,
                    admins: ["Somchai", "Aom", "Krit"],
                    type: "public",
                    platform: "Facebook",
                    posts: 1200,
                    engagements: 35000,
                    location: "Bangkok, Thailand"
                },
                {
                    name: "Web Dev Freelancers",
                    members: 8200,
                    admins: ["Nok", "Preecha"],
                    type: "private",
                    platform: "Discord",
                    posts: 500,
                    engagements: 12000,
                    location: "Chiang Mai, Thailand"
                },
                {
                    name: "Digital Marketing Hub",
                    members: 22000,
                    admins: ["May", "Ton", "Beer"],
                    type: "public",
                    platform: "Facebook",
                    posts: 2000,
                    engagements: 68000,
                    location: "Bangkok, Thailand"
                },
                {
                    name: "AI & Machine Learning SEA",
                    members: 11000,
                    admins: ["Alice", "Bob"],
                    type: "public",
                    platform: "LinkedIn",
                    posts: 900,
                    engagements: 25000,
                    location: "Singapore"
                }
            ]
        }
    },
    methods: {
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
        await this.apiGetCommunities()
    }
}
</script>
<style scoped>
.social-img {
    width: 35px;
}

.boxlist-card {
    border: 0px;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
    border-radius: 15px;
    min-height: 400px;
}
</style>