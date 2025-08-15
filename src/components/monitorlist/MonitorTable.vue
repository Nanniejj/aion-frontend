<template>
    <div class="py-3 mt-3">
        <b-row cols="2" class="align-items-center mb-3" align-h="between">
            <b-col cols="12" lg=""  class="mt-3">
                <div class="row w-100 m-0 align-items-center">
                    <div v-if="type === 'targetlist'" class="col-auto pl-0"> <img v-if="filters.source == 'twitter'" src="@/assets/Twitter.png"
                            class="social-imgs" />
                        <img v-if="filters.source == 'facebook'" src="@/assets/Facebook.png" class="social-imgs" />
                        <img v-if="filters.source == 'pantip'" src="@/assets/board.png" class="social-imgs" />
                        <img v-if="filters.source == 'blockdit'" src="@/assets/Blockdit.png" class="social-imgs" />
                        <img v-if="filters.source == 'instagram'" src="@/assets/Instagram.png" class="social-imgs" />
                        <img v-if="filters.source == 'youtube'" src="@/assets/Youtube.png" class="social-imgs" />
                        <img v-if="filters.source == 'news'" src="@/assets/News.png" class="social-imgs" />
                        <img v-if="filters.source == 'tiktok'" src="@/assets/Tiktok.png" class="social-imgs" />
                        <img v-if="filters.source == 'threads'" src="@/assets/Threads.png" class="social-imgs" />
                        <b-avatar text="All" size="35" style="background-color: #fed16e;"
                            v-if="filters.source == ''"></b-avatar>
                    </div>
                    <div v-if="type === 'hashtaglist'" class="col-auto"> 
                        <b-row class="d-flex align-content-center">
                            <b-avatar text="All" size="55" style="background-color: #fed16e;"
                                v-if="filters.source == ''">
                            </b-avatar>
                            <div class="col-auto bold align-content-center" style="font-size: 20px;">
                                {{ totalRows.toLocaleString() }} รายการ
                            </div>
                        </b-row>
                    </div>

                    <b-form-select v-if="type === 'targetlist'" class="col col-lg-3 mr-3" id="source-select" v-model="filters.source" :options="sourceOptions"
                    ></b-form-select>
                    <div class="col-12 col-sm-auto d-flex px-0 mt-3 mt-sm-0 ml-sm-auto">
                        <ImportPlatform class="col mr-3 px-0" v-if="type == 'targetlist'" @close="reload"/>
                        <CreateMonitor class="col-auto px-0" :class="{'w-100':type == 'hashtaglist'}" :tabsMonitor="type" @close="reload"/>
                    </div>
                </div>
            </b-col>
            <!-- <b-col class="w-100" style="height: 2px; background: #fed16e;"></b-col> -->
            <!-- <div class="h-25 d-inline-block bg-info" style="width: 120px;"></div> -->
            <b-col cols="12" lg="auto"  class="d-flex mt-3">
                <b-form-group label-for="search-input" class="mb-0">
                    <b-input-group-append>
                        <b-form-input id="search-input" @input="checkSearch" v-model="search" placeholder="ค้นหา"
                            class="w-100 mr-2"></b-form-input>
                        <b-button variant="info" pill :pressed="false" @click="onSearch()" class="shadow-r px-4">ค้นหา</b-button>
                    </b-input-group-append>
                </b-form-group>
                <b-col>
                    <!-- <MissingTargets :missingTargets="missingTargets"/> -->
                    <!-- <b-avatar variant="primary" icon="people-fill" size="40px"></b-avatar>
                    <b-badge
                        pill
                        variant="warning"
                        style="background: #fed16e;color: #fed16e;position: absolute; top: 20px; right: 10px; transform: translate(0%, 0%);"
                    >
                        .
                    </b-badge> -->
                </b-col>
            </b-col>
        </b-row>

        <b-form inline class="mb-3 d-none">
            <b-form-group label-for="search-input" class="mr-3">
                <b-form-input id="search-input" @input="checkSearch" v-model="search" placeholder="ค้นหา"></b-form-input>
            </b-form-group>

            <!-- <b-form-group label="ประเภท:" label-for="type-select" class="mr-3">
                <b-form-select id="type-select" v-model="filters.type" :options="typeOptions"
                    class="mr-2"></b-form-select>
            </b-form-group> -->


            <b-form-select id="source-select" v-model="filters.source" :options="sourceOptions"
                style="width: 100px;"></b-form-select>

        </b-form>

        <div  class="boxlist-card py-3">
            <br>
             <vue-element-loading :active="load" size="80" 
            background-color="rgba(255, 255, 255, 0.3)" 
            color="#ede7dd" />
            <b-table 
                v-if="data.length !== 0"
                :items="data || []" 
                :fields="fields" 
                hover responsive 
                :busy="load" 
                :head-variant="headVariant"
                :table-variant="tableVariant" 
                :striped="striped" 
                :bordered="bordered" 
                :borderless="borderless"
                :outlined="outlined" 
                empty-filtered-text="ไม่พบข้อมูล"
                :small="small" thead-class="d-none" stacked="md"
            >
                <!-- <template #empty>
                    <div class="text-center text-muted">ไม่มีข้อมูล</div>
                </template> -->
                <template #cell(id)="data">
                    {{ data.index + 1 + (currentPage - 1) * 10 }}
                </template>
                <template #cell(name)="data">
                    <div class="d-flex justify-content-start align-items-center" >
                        <span v-if="type == 'targetlist'" class="mr-2">
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
                <!-- <template #cell(link)="data">
                    <a :href="data.item.link_original" target="_blank">{{ data.item.uid }}</a>
                </template> -->
                <template #cell(source)="data">
                    
                    <div v-if="type == 'targetlist'" class="small d-flex align-items-center pr-0 w-auto"
                        :class="{' bg-link': type == 'targetlist'}"
                    >
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
                            style="color: #2c3e50 !important;" v-if="type == 'targetlist' && load == false">
                            {{ data.item.uid }}
                        </a>
                    </div>
                   
                </template>
                <template #cell(insert_timestamp)="data">
                    <span class="small"> {{ formatDate(data.item.insert_timestamp) }}</span>
                </template>

                <template #cell(action)="data">
                    <span v-if="type === 'targetlist'" class="fas fa-user-alt-slash text-danger" v-b-tooltip.hover title="เลิกติดตาม" size="sm"
                        @click="delProfile(data.item)"></span>
                    <span v-if="type === 'hashtaglist'" 
                    class="fas fa-trash text-danger" v-b-tooltip.hover title="ลบแฮชแท็ก" size="sm"
                        @click="delHashtag(data.item,data.index)"></span>
                    <!-- <i class="fas fa-user-check"></i><i class="fas fa-user-plus"></i> -->
                    <span class="fas fa-list-ul text-info" v-b-tooltip.hover title="ดูข้อมูลส่วนตัว" size="sm"
                        @click="linkToProfile(data.item)"></span>
                    <!-- <span class="fas fa-list-ul text-info" v-b-tooltip.hover 
                        title="ดูข้อมูลส่วนตัว" size="sm"
                    ></span> -->
                </template>
                
            </b-table>
            <div v-if="data.length === 0 && !load">
                ไม่พบข้อมูล
            </div>
        </div>

        <!-- {{ currentPage }} -->
        <b-pagination 
            v-model="currentPage"
            :total-rows="totalRows" 
            :per-page="perPage" 
            align="center" class="my-2"
            @input="onPageChange" 
        />
    </div>
</template>



<script>
import ImportPlatform from "./ImportPlatform.vue";
import CreateMonitor from "@/components/monitorlist/CreateMonitor.vue";
import MissingTargets from "./MissingTargets.vue";
// import { load } from "@syncfusion/ej2-vue-maps";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
// import { mapGetters } from "vuex";
export default {
    components: {
        CreateMonitor,
        ImportPlatform,
        MissingTargets,
    },
    props: {
        type: String
    },
    data() {
        return {
            load: false,
            allData: [],  // เก็บข้อมูลทั้งหมด
            data: [],
            missingTargets:{},
            totalRows: 0,
            search: '',
            debounceTimeout: null,
            currentPage: 1,
            perPage: 10,
            filters: {
                type: '',
                source: ''
            },
            fields: [
                { key: 'id', label: 'name' },
                { key: 'name', label: 'name' },
                { key: 'source', label: 'source' },
                // { key: 'link', label: 'ลิงก์เพจ' },
                { key: 'insert_timestamp', label: 'เวลาล่าสุด' },
                { key: 'action', label: '' }
            ],
            typeOptions: [
                { value: '', text: 'ทั้งหมด' },
                { value: 'targetlist', text: 'Target List' },
                { value: 'hashtaglist', text: 'Hashtag List' }
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
            ]
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
            this.apiMonitorList();
        },
        filters: {
            deep: true,
            handler() {
                console.log("handler === ",this.currentPage);
                this.apiMonitorList();
            }
        }
    },
    methods: {
        checkSearch() {
            if (!this.search) {
                this.apiMonitorList();
            }
        },
        onSearch() {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                this.currentPage = 1; // รีเซ็ตกลับหน้าแรก
                this.apiMonitorList();
            }, 500);
        },
        onPageChange(page) {
            // sessionStorage.setItem("monitor_currentPage", page); // ✅ บันทึก currentPage
            this.currentPage = page;
            this.apiMonitorList();
        },
        linkToProfile(item) {
            // console.log(item);
            // sessionStorage.setItem("monitor_currentPage", this.currentPage);
            // console.log("linkToProfile === ",this.currentPage);
            // this.$router.push({
            //     name: "MonitorProfile",
            //     query: {
            //         id: item._id,
            //         uid: item.uid,
            //         source: item.source,
            //         type: this.type
            //     },
            // });
            const routeData = this.$router.resolve({
                name: "MonitorProfile",
                query: {
                    id: item._id,
                    uid: item.uid?.replace('#', ''),  // ลบ '#' ออกถ้ามี
                    source: item.source,
                    type: this.type
                },
            });
            window.open(routeData.href, "_blank"); // เปิดลิงก์ในหน้าต่างใหม่
        },
        reload() {
            console.log("reloadddddd");
            
            this.$emit('setReface')
            this.apiMonitorList()
        },
        async delProfile(item) {
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
                // buttonsStyling: false, // ต้องมี ถ้าใช้ Bootstrap เอง
                allowEscapeKey: false,
                didOpen: () => {
                    const iconContent = document.querySelector('.swal2-icon-content');
                    if (iconContent) iconContent.style.display = 'none';
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    this.$store.dispatch("DeleteMonitor", {
                        account: item.uid,
                        source: item.source,
                    }).then(() => {
                        Swal.fire({
                            title: "เลิกติดตามแล้ว!",
                            text: "เลิกติดตามเรียบร้อย'",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 2000
                        });
                        // Swal.fire('เลิกติดตามแล้ว!', 'เลิกติดตามเรียบร้อย', 'success');
                        // this.data = this.data.filter(data => data.uid !== item.uid);
                        this.apiMonitorList();
                        this.$emit('setReface')
                    });
                    // Swal.fire('เลิกติดตามแล้ว!', 'เลิกติดตามเรียบร้อย', 'success')
                    // this.data = [];
                    // this.data = this.data.filter( data => item.uid !== data.uid);
                    // this.apiMonitorList();
                } else {
                    // Swal.fire('ยกเลิก', 'ยกเลิกเรียบร้อย', 'error')
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
        async delHashtag(item,index) {
            Swal.fire({
                title:'คุณแน่ใจหรือไม่?',
                text: 'คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ใช่, เลิกการติดตามเลย!',
                cancelButtonText: 'ยกเลิก',
                // customClass: {
                //     confirmButton: 'btn btn-success',
                //     cancelButton: 'btn btn-danger'
                // },
                showConfirmButton: true,
                
                allowOutsideClick: false,
                // buttonsStyling: false, // ต้องมี ถ้าใช้ Bootstrap เอง
                allowEscapeKey: false,
                didOpen: () => {
                    const iconContent = document.querySelector('.swal2-icon-content');
                    if (iconContent) iconContent.style.display = 'none';
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    var hashtag = item.uid.replace("#", "");
                    console.log(hashtag,item.source,index);
                    
                    this.$store.dispatch("DeleteMonitor", {
                        hashtag: hashtag,
                        source: item.source,
                        index: index,
                    }).then(() => {
                        Swal.fire({
                            title: "เลิกติดตามแล้ว!",
                            text: "เลิกติดตามเรียบร้อย'",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 2000
                        });
                        // Swal.fire('เลิกติดตามแล้ว!', 'เลิกติดตามเรียบร้อย', 'success');
                        this.apiMonitorList();
                        this.$emit('setReface')
                    });
                } else {
                    // Swal.fire('ยกเลิก', 'ยกเลิกเรียบร้อย', 'error')
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
        async apiMonitorList() {
            this.load = true;
            console.log('apiMonitorList ===',this.currentPage);
            
            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/monitor/getMonitor",
                params: {
                    type: this.filters.type || undefined,
                    // source: this.filters.source || undefined,
                     ...(this.filters.type === 'targetlist' && { source: this.filters.source || undefined }),
                    page: this.currentPage,
                    limit: this.perPage,
                    search:this.search
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
                this.totalRows = resData.pagination?.totalCount || this.data.length;
                console.log(this.totalRows);
                console.log(this.currentPage);                
                // this.currentPage = resData.pagination?.currentPage || 1;
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
        async getMissingTargets() {
             const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/monitor/getMissingUrls",
                
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            try {
                const res = await this.axios(config);
                const result = res.data?.data || [];
                this.missingTargets = result
                console.log("this.missingTargets ==== ",this.missingTargets);
                

                // this.allSubdomainData = subdomains; // เก็บทั้ง subdomain และ objects ไว้ใช้ต่อ

            } catch (error) {
                console.error(error);
            }
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
        await this.getMissingTargets();
    }
};


</script>

<style scoped>
.swal2-icon.swal2-warning::before {
    content: "" !important;
}
.social-imgs {
    width: 35px;
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
    width: 30px;
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