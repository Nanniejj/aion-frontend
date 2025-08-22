<template>
    <div class="py-3 mt-3">
        <b-row cols="2" class="align-items-center mb-3 mx-0" align-h="between">
            <b-col cols="12" md="auto" class="">
                <div class="d-flex flex-wrap justify-content-start align-items-center">
                    <b-avatar text="All" size="45" style="background-color: #fed16e;"></b-avatar>
                    <div class="col-auto bold align-content-center" style="font-size: 20px;">
                        {{ data.length.toLocaleString() }} รายการ
                    </div>
                </div>
            </b-col>
            <b-col cols="12" md="auto">
                <div class="d-flex flex-wrap justify-content-end align-items-center">
                    <!-- <CreateMonitor class="col col-md-auto px-0" :class="{'w-100':type == 'hashtaglist'}" :tabsMonitor="type" @close="reload"/> -->
                    <b-form-group label-for="search-input" class="mt-3 mt-xl-0 mr-lg-2 px-0 mb-0">
                        <b-input-group-append>
                            <b-form-input id="search-input" @input="checkSearch" v-model="search" placeholder="ค้นหา"
                                class="mr-2"></b-form-input>
                            <b-button variant="info" pill :pressed="false" @click="onSearch()"
                                class="shadow-r px-4">ค้นหา</b-button>
                        </b-input-group-append>
                    </b-form-group>
                    <CreateGroup @close="reload"/>
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
            <b-table v-if="data.length !== 0" show-details :items="data || []" :fields="fields" hover responsive :busy="load"
                :head-variant="headVariant" :table-variant="tableVariant" :striped="striped" :bordered="bordered"
                :borderless="borderless" :outlined="outlined" empty-filtered-text="ไม่พบข้อมูล" :small="small"
                
                thead-class="d-none" stacked="md">
                <template #cell(id)="data">
                    {{ data.index + 1 + (currentPage - 1) * perPage }}
                </template>
                <template #cell(name)="data">
                    <div class="d-flex justify-content-start align-items-center">
                        {{ data.item.group_name }}
                    </div>
                </template>

                <template #cell(source)="data">
                    <!-- {{ data.item.targetlist }} -->
                    <b-avatar-group size="40px">
                        <b-avatar v-for="(target, index) in data.item.targetlist" :key="index" :src="target.image">
                            <img @click="openLink(target.link_original)" v-if="target.source == 'facebook'" src="@/assets/Facebook.png" class="social-img" />
                            <img @click="openLink(target.link_original)" v-if="target.source == 'twitter'" src="@/assets/Twitter.png" class="social-img" />
                            <img @click="openLink(target.link_original)" v-if="target.source == 'pantip'" src="@/assets/board.png" class="social-img" />
                            <img @click="openLink(target.link_original)" v-if="target.source == 'blockdit'" src="@/assets/Blockdit.png" class="social-img" />
                            <img @click="openLink(target.link_original)" v-if="target.source == 'instagram'" src="@/assets/Instagram.png" class="social-img" />
                            <img @click="openLink(target.link_original)" v-if="target.source == 'youtube'" src="@/assets/Youtube.png" class="social-img" />
                            <img @click="openLink(target.link_original)" v-if="target.source == 'news'" src="@/assets/News.png" class="social-img" />
                            <img @click="openLink(target.link_original)" v-if="target.source == 'tiktok'" src="@/assets/Tiktok.png" class="social-img" />
                            <img @click="openLink(target.link_original)" v-if="target.source == 'threads'" src="@/assets/Threads.png" class="social-img" />
                        </b-avatar>
                    </b-avatar-group>
                </template>
                <template #cell(type)="data">
                    <b-badge variant="warning" style="background-color: #fed06ea4; color: #2c3e50;"
                        class="text-capitalize text-truncate">{{ data.item.group_type }}
                    </b-badge>
                </template>

                <template #cell(action)="data">
                    
                    <span class="fas fa-user-edit text-custom" v-b-tooltip.hover
                        title="แก้ไขกลุ่ม" @click="handleClick(data)" size="sm"></span>
                    <span class="fas fa-list-ul text-info" v-b-tooltip.hover title="ดูรายละเอียด" size="sm"
                    @click="linkToProfile(data.item)"></span>
                    <span class="fas fa-trash text-danger" v-b-tooltip.hover
                        title="ลบกลุ่ม" @click="deleteGroup(data.item.group_id)" size="sm"></span>
                    
                </template>
                <template #row-details="data">
                    <!-- {{ data.toggleDetails }} -->
                    <!-- <b-card class="text-left" style="max-height:300px;overflow-y:auto;"> -->
                    <b-row cols="1" cols-md="2" class="mx-0">
                        <b-col class="p-0 border-right">
                            <b-row v-if="data.item.targetlist && data.item.targetlist.length !== 0" class="bold my-2 mx-0 px-0">
                                รายชื่อบัญชีในกลุ่ม {{ data.item.targetlist.length }} รายการ
                            </b-row>
                            <b-row cols="1" cols-lg="1" cols-xl="2" class="m-0">
                                <b-col class="h-auto pl-0 pr-2 mb-2" v-for="target in data.item.targetlist" :key="target.id" >
                                    <b-card bg-variant="white" text-variant=""
                                        class="h-100" body-class="px-2 pt-0 pb-2"
                                    >
                                        <b-card-text class="h-100">
                                            <!-- <b-row class="m-0 justify-content-end">
                                                <i class="fa fa-close text-danger" @click="deleteTarget(target)" style="font-size:14px;cursor: pointer;"></i>
                                            </b-row> -->
                                            <b-row class="m-0 flex-nowrap h-100">
                                                <b-col cols="auto" class="p-0">
                                                    <b-avatar rounded="bottom" :src="target.profile_image" v-if="target && target.profile_image">
                                                    </b-avatar>
                                                    <b-avatar rounded="bottom" :src="target.profile_image" v-else> </b-avatar>
                                                </b-col>
                                                <b-col class="text-left p-2 w-50">
                                                    <!-- <b-row class="m-0"> -->
                                                        <span>{{ target.name || target.uid }}</span>
                                                        <!-- {{ target.source }} -->
                                                        
                                                    <!-- </b-row> -->
                                                    <a class="text-truncate d-block" 
                                                        href="#" 
                                                        @click.prevent="openLink(target.link_original)">
                                                        {{ target.link_original }}
                                                    </a>
                                                </b-col>
                                                <b-col cols="auto" class="p-0 text-right">
                                                    <b-row cols="1" class="m-0 h-100 justify-content-end">
                                                        <b-col class="px-1 py-0">
                                                            <i class="fa fa-close text-danger" @click="apiDeleteTarget(data.item.group_id,target._id)" style="font-size:14px;cursor: pointer;"></i>
                                                        </b-col>
                                                        <b-col align-self="end" class="p-0 text-right">
                                                            <b-avatar class="" size="25px" :src="target.image">
                                                                <img @click="openLink(target.link_original)" v-if="target.source == 'facebook'" src="@/assets/Facebook.png" class="platform-imgs" />
                                                                <img @click="openLink(target.link_original)" v-if="target.source == 'twitter'" src="@/assets/Twitter.png" class="platform-imgs" />
                                                                <img @click="openLink(target.link_original)" v-if="target.source == 'pantip'" src="@/assets/board.png" class="platform-imgs" />
                                                                <img @click="openLink(target.link_original)" v-if="target.source == 'blockdit'" src="@/assets/Blockdit.png" class="platform-imgs" />
                                                                <img @click="openLink(target.link_original)" v-if="target.source == 'instagram'" src="@/assets/Instagram.png" class="platform-imgs" />
                                                                <img @click="openLink(target.link_original)" v-if="target.source == 'youtube'" src="@/assets/Youtube.png" class="platform-imgs" />
                                                                <img @click="openLink(target.link_original)" v-if="target.source == 'news'" src="@/assets/News.png" class="platform-imgs" />
                                                                <img @click="openLink(target.link_original)" v-if="target.source == 'tiktok'" src="@/assets/Tiktok.png" class="platform-imgs" />
                                                                <img @click="openLink(target.link_original)" v-if="target.source == 'threads'" src="@/assets/Threads.png" class="platform-imgs" />
                                                            </b-avatar>
                                                        </b-col>
                                                    </b-row>
                                                </b-col>
                                            </b-row>
                                        </b-card-text>
                                    </b-card>
                                </b-col>
                            </b-row>
                            <hr v-if="(newTargets.length > 0) && (data.item.targetlist.length !== 0)">
                            <b-col cols="12" class="p-0">
                                <b-row v-if="newTargets.length > 0" class="bold my-2 mx-0 px-0">
                                    <b-col class="p-0 text-left">
                                        รายชื่อบัญชีใหม่ {{ newTargets.length }} รายการ
                                    </b-col>
                                    <b-col class="d-flex justify-content-end">
                                        <b-button class="mr-2" variant="success" @click="confirmAddTargets()">
                                            <i class="fa fa-save"></i>
                                        </b-button>
                                        <b-button variant="danger" @click="newTargets = []">
                                            <i class="fa fa-times"></i>
                                        </b-button>
                                    </b-col>
                                </b-row>
                                <b-row cols="1" class="m-0 pr-3">
                                    <b-card v-for="(target,index) in newTargets" :key="target.id" 
                                        bg-variant="white" text-variant=""
                                        class="mb-2" body-class="px-2 pt-0 pb-2"
                                        
                                    >
                                    <b-card-text class="h-100">
                                        
                                        <b-row class="m-0 flex-nowrap h-100">
                                            <b-col cols="auto" class="p-0">
                                                <b-avatar rounded="bottom" :src="target.profile_image" v-if="target && target.profile_image">
                                                </b-avatar>
                                                <b-avatar rounded="bottom" :src="target.profile_image" v-else> </b-avatar>
                                            </b-col>
                                            <b-col class="text-left p-2 w-50">
                                                <span>{{ target.name || target.uid }}</span>
                                                    
                                                <div class="d-flex">
                                                    <a @click.prevent="openLink(target.link_original)" class="text-truncate d-block text-info">
                                                        {{ target.link_original }}
                                                    </a>
                                                </div>
                                            </b-col>
                                            <b-col cols="auto" class="p-0 text-right">
                                                <b-row cols="1" class="m-0 h-100 justify-content-end">
                                                    <b-col class="px-1 py-0">
                                                        <i class="fa fa-close text-danger" @click="deleteNewTarget(index)" style="font-size:14px;cursor: pointer;"></i>
                                                    </b-col>
                                                    <b-col align-self="end" class="p-0 text-right">
                                                        <b-avatar class="" size="25px" :src="target.image">
                                                            <img @click="openLink(target.link_original)" v-if="target.source == 'facebook'" src="@/assets/Facebook.png" class="platform-imgs" />
                                                            <img @click="openLink(target.link_original)" v-if="target.source == 'twitter'" src="@/assets/Twitter.png" class="platform-imgs" />
                                                            <img @click="openLink(target.link_original)" v-if="target.source == 'pantip'" src="@/assets/board.png" class="platform-imgs" />
                                                            <img @click="openLink(target.link_original)" v-if="target.source == 'blockdit'" src="@/assets/Blockdit.png" class="platform-imgs" />
                                                            <img @click="openLink(target.link_original)" v-if="target.source == 'instagram'" src="@/assets/Instagram.png" class="platform-imgs" />
                                                            <img @click="openLink(target.link_original)" v-if="target.source == 'youtube'" src="@/assets/Youtube.png" class="platform-imgs" />
                                                            <img @click="openLink(target.link_original)" v-if="target.source == 'news'" src="@/assets/News.png" class="platform-imgs" />
                                                            <img @click="openLink(target.link_original)" v-if="target.source == 'tiktok'" src="@/assets/Tiktok.png" class="platform-imgs" />
                                                            <img @click="openLink(target.link_original)" v-if="target.source == 'threads'" src="@/assets/Threads.png" class="platform-imgs" />
                                                        </b-avatar>
                                                    </b-col>
                                                </b-row>
                                            </b-col>
                                        </b-row>
                                    </b-card-text>
                                </b-card>
                                </b-row>
                            </b-col>
                        </b-col>

                        <b-col class="pr-0 mt-3 mt-md-0">
                            <b-col cols="12" class="p-0">
                                <b-row class="m-0 mb-2">
                                    <b-col cols="auto" class="d-flex pl-0 text-info justify-content-between align-items-center">
                                        <span>รายชื่อบัญชีที่แนะนำ</span>
                                    </b-col>
                                    <b-col cols="" class="p-0 d-flex justify-content-end">
                                        <b-form-input v-model="searchTarget" placeholder="ค้นหา"
                                            class="" ></b-form-input>
                                            <b-button size="sm" variant="info" pill :pressed="false" @click="apiMonitorList"
                                            class="shadow-r ml-2">
                                            <div class="d-flex align-items-center">
                                                <i class="fa fa-search mr-2"></i> ค้นหา
                                            </div>
                                            </b-button>
                                    </b-col>
                                </b-row>
                            </b-col>
                            <vue-element-loading :active="loadTargets" size="80" background-color="rgba(255, 255, 255, 0.3)" color="#ede7dd" />
                            <b-row cols="1" cols-lg="1" cols-xl="2" class="m-0 body-scrollable">
                                <b-col v-for="target in targetLists" :key="target.id" class="h-auto pl-0 pr-2 mb-2">
                                    <b-card
                                        bg-variant="white" text-variant=""
                                        class="mb-2 h-100" body-class="px-2 pt-0 pb-2"
                                        @click="handleNewTarget(target)"
                                    >
                                        <b-card-text class="h-100">
                                            <!-- <b-row class="m-0 justify-content-end">
                                                <i class="fa fa-close text-danger" @click="deleteTarget(target)" style="font-size:14px;cursor: pointer;"></i>
                                            </b-row> -->
                                            <b-row class="m-0 flex-nowrap h-100">
                                                <b-col cols="auto" class="p-0">
                                                    <b-avatar rounded="bottom" :src="target.profile_image" v-if="target && target.profile_image">
                                                    </b-avatar>
                                                    <b-avatar rounded="bottom" :src="target.profile_image" v-else> </b-avatar>
                                                </b-col>
                                                <b-col class="text-left p-2 w-50">
                                                    <!-- <b-row class="m-0"> -->
                                                    <span>{{ target.name || target.uid }}</span>
                                                        <!-- {{ target.source }} -->
                                                        
                                                    <!-- </b-row> -->
                                                    <div class="d-flex">
                                                        <a @click.prevent="openLink(target.link_original)" class="text-truncate d-block text-info">
                                                            {{ target.link_original }}
                                                        </a>
                                                    </div>
                                                </b-col>
                                                <b-col cols="auto" class="p-0 text-right">
                                                    <b-row cols="1" class="m-0 h-100 justify-content-end">
                                                        <!-- <b-col class="px-1 py-0">
                                                            <i class="fas fa-plus-square text-info" @click="apiAddTarget(data.item.group_id,target._id)" style="font-size:14px;cursor: pointer;"></i>
                                                        </b-col> -->
                                                        <b-col align-self="end" class="p-0 text-right">
                                                            <b-avatar class="" size="25px" :src="target.image">
                                                                <img @click="openLink(target.link_original)" v-if="target.source == 'facebook'" src="@/assets/Facebook.png" class="platform-imgs" />
                                                                <img @click="openLink(target.link_original)" v-if="target.source == 'twitter'" src="@/assets/Twitter.png" class="platform-imgs" />
                                                                <img @click="openLink(target.link_original)" v-if="target.source == 'pantip'" src="@/assets/board.png" class="platform-imgs" />
                                                                <img @click="openLink(target.link_original)" v-if="target.source == 'blockdit'" src="@/assets/Blockdit.png" class="platform-imgs" />
                                                                <img @click="openLink(target.link_original)" v-if="target.source == 'instagram'" src="@/assets/Instagram.png" class="platform-imgs" />
                                                                <img @click="openLink(target.link_original)" v-if="target.source == 'youtube'" src="@/assets/Youtube.png" class="platform-imgs" />
                                                                <img @click="openLink(target.link_original)" v-if="target.source == 'news'" src="@/assets/News.png" class="platform-imgs" />
                                                                <img @click="openLink(target.link_original)" v-if="target.source == 'tiktok'" src="@/assets/Tiktok.png" class="platform-imgs" />
                                                                <img @click="openLink(target.link_original)" v-if="target.source == 'threads'" src="@/assets/Threads.png" class="platform-imgs" />
                                                            </b-avatar>
                                                        </b-col>
                                                    </b-row>
                                                </b-col>
                                            </b-row>
                                        </b-card-text>
                                    </b-card>
                                </b-col>
                            </b-row>
                            <b-col cols="12" align-self="end">
                                <b-pagination v-model="currentPageTarget" :total-rows="totalRowsTarget" :per-page="perPageTarget" align="center" class="my-2"
                                @input="onPageChangeTargets"/>
                            </b-col>
                        </b-col>
                    </b-row>
                </template>
            </b-table>
            <div v-if="data.length === 0 && !load">
                ไม่พบข้อมูล
            </div>
        </div>

        <!-- {{ currentPage }} -->
        
        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="center" class="my-2"
            @input="onPageChange" />
    </div>
</template>



<script>
// import ImportPlatform from "./ImportPlatform.vue";
import CreateMonitor from "@/components/monitorlist/CreateMonitor.vue";
import CreateGroup from "./CreateGroup.vue";
// import MissingTargets from "./MissingTargets.vue";
// import { load } from "@syncfusion/ej2-vue-maps";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
// import { h } from "vue";
// import { mapGetters } from "vuex";
export default {
    components: {
        CreateMonitor,
        CreateGroup,
        // ImportPlatform,
        // MissingTargets,
    },
    props: {
        type: String
    },
    data() {
        return {
            // openRowId: null, // เก็บ ID ของแถวที่เปิดอยู่
            load: false,
            loadTargets: false,
            allData: [],  // เก็บข้อมูลทั้งหมด
            data: [],
            missingTargets: {},
            search: '',
            searchTarget: '',
            debounceTimeout: null,
            currentPage: 1,
            totalRows: 0,
            perPage: 10,
            currentPageTarget: 1,
            totalRowsTarget: 0,
            perPageTarget: 10,
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
            targetLists: [],
            newTargets: [],
            selectedGroup:{}
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
        deleteNewTarget(index) {
            this.newTargets.splice(index, 1);
        },
        handleNewTarget(item) {
            let newItem = item

            // เช็คว่ามีอยู่แล้วหรือยัง
            const exists = this.newTargets.some(t => 
                t.link_original === newItem.link_original && t.source === newItem.source
            );

            if (!exists) {
                this.newTargets.push(newItem);
            } else {
                // จะ alert หรือ return อย่างเดียวก็ได้
                console.warn("ข้อมูลนี้มีอยู่แล้ว:", newItem);
            }
        },
        handleClick(data) {
            data.toggleDetails()
            this.setSelectedGroup(data.item)
        },
        async setSelectedGroup(item) {
            this.searchTarget = item.group_name || '';
            this.selectedGroup = item;
            await this.apiMonitorList();
            // console.log("this.selectedGroup ==== ",this.selectedGroup);
        },
        openLink(url) {
            if (url) {
                window.open(url, "_blank"); // เปิดในแท็บใหม่
            }
        },
        checkSearch() {
            if (!this.search) {
                this.apiMonitorGroupList();
            }
        },
        onSearch() {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                this.currentPage = 1; // รีเซ็ตกลับหน้าแรก
                this.apiMonitorGroupList();
            }, 500);
        },
        onPageChange(page) {
            this.currentPage = page;
            this.apiMonitorGroupList();
        },
        onPageChangeTargets(page) {
            this.currentPageTarget = page;
            this.apiMonitorList();
        },
        linkToProfile(item) {
            const routeData = this.$router.resolve({
                name: "GroupProfile",
                query: {
                    id: item.group_id,
                    // uid: item.uid?.replace('#', ''),  // ลบ '#' ออกถ้ามี
                    // source: item.source,
                    // type: this.type
                },
            });
            window.open(routeData.href, "_blank"); // เปิดลิงก์ในหน้าต่างใหม่
        },
        reload() {
            // console.log("reloadddddd");

            // this.$emit('setReface')
            this.apiMonitorGroupList()
        },
        transformToTarget(data) {
            return data.map(item => ({
                URL: item.link_original,
                source: item.source
            }))
        },
        confirmAddTargets() {
            if (this.newTargets.length > 0) {
                Swal.fire({
                    title: 'ยืนยันการเพิ่มเป้าหมาย',
                    text: `คุณต้องการเพิ่มเป้าหมาย ${this.newTargets.length} รายการนี้หรือไม่?`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'เพิ่ม',
                    cancelButtonText: 'ยกเลิก',
                    didOpen: () => {
                        const iconContent = document.querySelector('.swal2-icon-content');
                        if (iconContent) iconContent.style.display = 'none';
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        let newTargets = this.transformToTarget(this.newTargets);
                        this.apiAddTarget(newTargets);
                    }
                });
            } else {
                Swal.fire('ไม่มีเป้าหมายใหม่', 'กรุณาเลือกเป้าหมายก่อนเพิ่ม', 'info');
            }
        },
        async apiAddTarget(newTargets) {
            this.load = true;
            const config = {
                method: "put",
                url: `https://api2.cognizata.com/api/v2/monitor/putTargetlist`,
                data: {
                    group_id: this.selectedGroup.group_id,
                    target: newTargets
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };
            console.log("apiAddTarget config", config);

            this.axios(config)
                .then((response) => {
                    this.load = false;
                    Swal.fire({
                        title: 'สำเร็จ',
                        text: 'เพิ่มเป้าหมายเรียบร้อยแล้ว',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 2000
                    });
                    this.apiMonitorGroupList();
                })
                .catch((error) => {
                    this.load = false;
                    console.error(error);
                    Swal.fire('ผิดพลาด', 'ไม่สามารถเพิ่มเป้าหมายได้', 'error');
                });
        },
        async apiDeleteTarget(group_id, target_id) {
            const result = await Swal.fire({
                title: 'ยืนยันการลบเป้าหมาย',
                text: "คุณต้องการลบเป้าหมายนี้หรือไม่?",
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
                    url: `https://api2.cognizata.com/api/v2/monitor/deleteTargetlist`,
                    data: {
                        group_id: group_id,
                        targetlist_id: target_id
                    },
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
                            text: 'ลบเป้าหมายเรียบร้อยแล้ว',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 2000
                        });
                        this.newTargets = [];
                        this.apiMonitorGroupList();
                    })
                    .catch((error) => {
                        this.load = false;
                        console.error(error);
                        Swal.fire('ผิดพลาด', 'ไม่สามารถลบเป้าหมายได้', 'error');
                    });
            }
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
        async apiMonitorList() {
            this.loadTargets = true;
            // console.log('apiMonitorList ===',this.currentPage);

            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/monitor/getMonitor",
                params: {
                    type: 'targetlist',
                    page: this.currentPageTarget,
                    limit: this.perPageTarget,
                    search: this.searchTarget,
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            this.axios(config)
                .then((response) => {
                    const resData = response.data;
                    this.targetLists = resData.data || [];
                    this.totalRowsTarget = resData.pagination?.totalCount || this.targetLists.length;
                    // console.log(this.totalRows);
                    // console.log(this.currentPage);                
                    // this.currentPage = resData.pagination?.currentPage || 1;
                    this.loadTargets = false;
                    // if (this.filters.type) {
                    //     this.$emit('total', this.totalRows)
                    // }
                })
                .catch((error) => {
                    this.loadTargets = false;
                    this.data = [];
                    console.error(error);
                });
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
.body-scrollable {
    /* min-height: 70vh; */
    max-height: 50vh;
    /* max-width: 95vw; */
    overflow-y: auto;
    /* ให้ scroll เฉพาะแนวตั้ง */
    overflow-x: hidden;
    /* ❌ ปิดการ scroll แนวนอน */
    /* padding-left: 10px; */
    padding-right: 10px;
    box-sizing: border-box;
    /* เผื่อขนาด scrollbar */
}
.text-custom {
  background: linear-gradient(90deg, #e8acac  0%,  #e9c068 50%);
  -webkit-background-clip: text; /* สำหรับ Chrome, Safari */
  -webkit-text-fill-color: transparent; /* ทำให้สีตัวอักษรโปร่งใสเพื่อให้ gradient แสดง */
  background-clip: text; /* สำหรับ Firefox */
  color: transparent; /* fallback */
}
.swal2-icon.swal2-warning::before {
    content: "" !important;
}

.social-imgs {
    width: 35px;
}
.platform-imgs {
    width:25px;
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
    width: 45px;
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
</style>