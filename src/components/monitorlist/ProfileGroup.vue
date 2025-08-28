<template>
    <div>
         <!-- avatar  -->
        <b-row class="mx-0 mb-5">
            <b-col lg="4" class="px-0 pr-lg-3">
                <div class="gradient-bg h-100 p-2" style="">
                    <b-avatar class="shadow-sm rounded badge-light rounded-circle"
                        size="140px">
                        <i class="fa fa-group" style="font-size:48px"></i>
                    </b-avatar>
                    <b-col v-if="groupDetails" class="text-center px-0">
                        <h4 class="mt-2 mb-0">{{ groupDetails.group_name || 'N/A' }}</h4>
                        <p v-if="groupDetails.targetlist" class="mb-1 text-muted" style="font-size: 0.9rem;">
                            <!-- ประเภท: {{ groupDetails.category || 'N/A' }} <br>
                            แพลตฟอร์ม: {{ groupDetails.source || 'N/A' }} <br> -->
                            จำนวนสมาชิก: {{ groupDetails.targetlist.length || 'N/A' }} บัญชี
                        </p>
                    </b-col>
                </div>
            </b-col>
            <b-col lg="8" class="text-left px-0">
                <h5 class="font-weight-bold text-info p-0">Platform</h5>
                <b-row cols="2" cols-sm="3" cols-lg="4" cols-xl="6" class="h-75 align-items-center">
                    <b-col v-for="target in groupDetails.targetlist" :key="target.id" class="px-0 mb-3">
                        <b-row class="m-0 text-center align-items-center">
                            <b-col cols="12" class="px-1 mb-2">
                               <b-avatar :src="target.image">
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
                            </b-col>
                            <b-col>
                                {{ target.name || target.uid || 'N/A' }}
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>     

        <!-- time line -->
        <b-row class="m-0">
            <b-col cols="12" class="px-0">
                <b-row class="justify-content-between align-items-center mb-3 mx-0">
                    <b-col cols="auto" class="px-0">
                        <h4 class="mb-0">Posts Timeline</h4>
                    </b-col>
                    <b-col cols="auto" class="px-0">
                        <b-row class="m-0">
                            <b-col cols="auto" class="px-0 pt-2">
                                <date-picker
                                    v-model="valueDate"
                                    type="date"
                                    range
                                    placeholder="เลือกช่วงเวลา"
                                    size="sm"
                                    :disabled-date="(date) => date >= new Date()"
                                    value-type="format"
                                    format="YYYY-MM-DD"
                                    @change="checkDateRange()"
                                    id="date-domain"
                                    class="">
                                    {{ valueDate }}
                                </date-picker>
                            </b-col>
                            <b-col cols="auto" class="pr-0 pt-2">
                                <div class="text-center">
                                    เรียงจาก :
                                    <b-button class="sort-btn" @click="toggleSort" pill size="sm">
                                        {{ selectedSort === 'desc' ? 'ใหม่ → เก่า' : 'เก่า → ใหม่' }}
                                    </b-button>
                                </div>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </b-col>
            <b-col cols="12" class="px-0">
                <vue-element-loading 
                    :active="loading" class="h-100" size="80" 
                    background-color="rgba(255, 255, 255, 0.3)"
                    color="#b6ac9a" 
                />
                <Timeline :timelineItems="posts" />
                <!-- page: {{ page }}, totalPage: {{ totalPage }}, total Posts: {{ total_posts }}, posts length: {{ posts.length }} -->
                <b-col v-if="totalPage > 1" class="p-0">
                    <b-row v-if="page !== totalPage && (total_posts > posts.length)" @click="onPageChange" class="justify-content-md-center align-items-center my-3 mx-0">
                        <div class="text-center">
                            <b-button class="sort-btn" pill size="sm">
                                ดูเพิ่มเติม
                            </b-button>
                        </div>
                    </b-row>
                    <b-row v-else @click="resetPage" class="justify-content-center align-items-center my-3 mx-0">
                        <div class="text-center">
                            <b-button class="sort-btn" pill size="sm">
                                ย่อ timeline
                            </b-button>
                        </div>
                    </b-row>
                </b-col>
            </b-col>
        </b-row>
    </div>
</template>
<script>
import Swal from 'sweetalert2'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import moment from "moment";
import Timeline from "./_Timeline.vue"
import { post } from 'jquery';
export default {
    components: {
        Timeline,
    },
    data() {
        const today = moment();
        const past7Days = moment().subtract(6, 'days'); // รวมวันนี้ = 7 วัน
        return {
            valueDate: [past7Days.format('YYYY-MM-DD'), today.format('YYYY-MM-DD')],
            selectedSource: null,
            sentiment: null,
            selectedSort: "desc",
            totalPage: null,
            total_posts: 0,
            limit: 10,
            page: 1,
            posts: [],
            lastParamsSnapshot: null, // เก็บ params ล่าสุด
            loading: false,
            groupDetails:{}
        }
    },
    methods: {
        onPageChange() {
            this.page = this.page + 1;
            console.log("current page : ", this.page);
            // this.limit = (this.page - 1) * 10
            this.apiGetPost()

            // Scroll ไปที่ element id="total-post"
            this.$nextTick(() => {
                const el = document.getElementById('total-post');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                }
            });
        },
        resetPage() {
            this.page = 1;
            this.posts = [];
            this.apiGetPost();
        },
        checkDateRange() {
            if (!this.valueDate || this.valueDate.length < 2) return;

            const start = new Date(this.valueDate[0]);
            const end = new Date(this.valueDate[1]);

            // คำนวณจำนวนวันต่างกัน
            const diffTime = Math.abs(end - start);
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            if (diffDays > 7) {
                alert("เลือกช่วงเวลาได้ไม่เกิน 7 วัน");
                this.valueDate = []; // reset ค่า
            }else {
                console.log('check');
                
                this.page = 1; // reset page
                this.apiGetPost();
            }
        },
        toggleSort() {
            this.selectedSort = this.selectedSort === "asc" ? "desc" : "asc";
            this.apiGetPost();
        },
        handleSource(source) {
            this.selectedSource = source;
        },
        // async apiGetPost() {
        //     try {
        //         const config = {
        //             method: "get",
        //             url: "https://api2.cognizata.com/api/v2/monitor/getGroupPost",
        //             params: {
        //                 group_id: this.$route.query.id,
        //                 ...(this.selectedSource ? { source: this.selectedSource } : {}),
        //                 page: this.page,
        //                 sort_by: this.selectedSort,
        //                 sentiment: this.selected,
        //                 limit: this.limit,
        //                 from: this.valueDate[0],
        //                 to: this.valueDate[1]
        //                 // from: this.start+ "T00:00:00",
        //                 // to: this.end + "T23:59:59"
        //             },
        //             headers: {
        //                 Authorization: "Bearer " + localStorage.getItem("token"),
        //                 "Content-Type": "application/json",
        //             },
        //         };
        //         console.log(config);

        //         this.axios(config).then(response => {
        //             console.log('Posts fetched successfully:', response.data);
        //         const newPosts =  response.data.posts.map(post => ({
        //             ...post,
        //             showAll: false,
        //         }));
        //         this.posts = [ ...this.posts, ...newPosts];
        //         this.page = response.data.current_page;
        //         this.limit = response.data.limit;
        //         this.total = response.data.total;
        //         }).catch(error => {
        //         console.error('Error fetching posts:', error);
        //         });

        //     } catch (error) {
        //         console.error('Error fetching posts:', error);
        //         throw error;
        //     }
        // }
        async apiGetPost() {
            try {
                // สร้าง params ใหม่
                const params = {
                    group_id: this.$route.query.id,
                    ...(this.selectedSource ? { source: this.selectedSource } : {}),
                    sort_by: this.selectedSort,
                    sentiment: this.selected,
                    from: this.valueDate[0],
                    to: this.valueDate[1]
                };

                // ตรวจสอบว่า params เปลี่ยนหรือไม่ (ไม่รวม page และ limit)
                const paramsChanged = JSON.stringify(params) !== JSON.stringify(this.lastParamsSnapshot);

                if (paramsChanged) {
                    this.posts = []; // ลบสมาชิกเดิม
                    this.page = 1;   // reset page
                }

                // เก็บ snapshot ของ params ล่าสุด (ยกเว้น page, limit)
                this.lastParamsSnapshot = { ...params };

                const config = {
                    method: "get",
                    url: "https://api2.cognizata.com/api/v2/monitor/getGroupPost",
                    params: {
                    ...params,
                    page: this.page,
                    limit: this.limit,
                    },
                    headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                    },
                };
                if (this.page <= this.totalPage || this.totalPage === null) {
                    this.loading = true;
                    
                    const response = await this.axios(config);
                    const newPosts = response.data.posts.map(post => ({
                        ...post,
                        showAll: false,
                    }));
        
                    // เพิ่มสมาชิกใหม่
                    this.posts = [...this.posts, ...newPosts];
                    this.page = response.data.current_page;
                    this.limit = response.data.limit;
                    this.total = response.data.total;
                    this.totalPage = response.data.total_pages;
                    this.total_posts = response.data.total_posts;
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
                throw error;
            }finally {
                this.loading = false;
            }
        },
        async getGroupDetail() {
            this.loading = true;
            // console.log('apiMonitorGroupList ===',this.currentPage);

            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/monitor/monitorGroupName",
                params: {
                    search: this.$route.query.name,
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            this.axios(config)
                .then((response) => {
                    const resData = response.data;
                    console.log(resData);
                    this.groupDetails = resData.data[0] || {};
                    this.loading = false;
                })
                .catch((error) => {
                    this.loading = false;
                    // this.data = [];
                    console.error(error);
                });
        },

    },
    async mounted() {
        await this.apiGetPost();
        await this.getGroupDetail();
        console.log(this.$route.query.name);
    },
}
</script>

<style scoped>
    .social-img {
        width: 45px;
    }
    .gradient-bg {
        background: linear-gradient(90deg, #fed06ea4, #ffe6e6);
    }
    .sort-btn{
        background: linear-gradient(90deg,#FDD071 0%, #ffbcbc 100%);
        border: none;
        color: #2c3e50; /* ให้ตัวอักษรอ่านง่าย */
        font-weight: bold;
    }
</style>