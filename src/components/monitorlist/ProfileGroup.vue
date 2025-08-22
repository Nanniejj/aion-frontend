<template>
    <div>
        <!-- avatar  -->
        <b-row class="m-0">
           
        </b-row>        

        <!-- time line -->
        <b-row class="m-0">
            <b-col cols="12" class="px-0">
                <b-row class="justify-content-between align-items-center mb-3 mx-0">
                    <b-col cols="auto" class="px-0">
                        <h4 class="mb-0">Posts Timeline</h4>
                    </b-col>
                    <b-col cols="auto" class="px-0">
                        <b-row>
                            <b-col cols="auto" class="px-0">
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
                            <b-col cols="auto" class="pr-0">
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
                <Timeline :timelineItems="posts" />
            </b-col>
        </b-row>
    </div>
</template>
<script>
import Swal from 'sweetalert2'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import moment from "moment";
import Timeline from "./_Timeline.vue"
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
            limit: 10,
            page: 1,
            posts: []

        }
    },
    methods: {
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
        async apiGetPost() {
            try {
                const config = {
                    method: "get",
                    url: "https://api2.cognizata.com/api/v2/monitor/getGroupPost",
                    params: {
                        group_id: this.$route.query.id,
                        ...(this.selectedSource ? { source: this.selectedSource } : {}),
                        page: this.page,
                        sort_by: this.selectedSort,
                        sentiment: this.selected,
                        limit: this.limit,
                        from: this.valueDate[0],
                        to: this.valueDate[1]
                        // from: this.start+ "T00:00:00",
                        // to: this.end + "T23:59:59"
                    },
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },
                };
                console.log(config);

                 this.axios(config).then(response => {
                    console.log('Posts fetched successfully:', response.data);
                    this.posts = response.data.posts;
                    this.page = response.data.page;
                     this.limit = response.data.limit;
                    this.total = response.data.total;
                 }).catch(error => {
                    console.error('Error fetching posts:', error);
                 });

            } catch (error) {
                console.error('Error fetching posts:', error);
                throw error;
            }
        }
    },
    async mounted() {
       await this.apiGetPost();
    },
}
</script>

<style scoped>
    .sort-btn{
        background: linear-gradient(90deg,#FDD071 0%, #ffbcbc 100%);
        border: none;
        color: #2c3e50; /* ให้ตัวอักษรอ่านง่าย */
        font-weight: bold;
    }
</style>