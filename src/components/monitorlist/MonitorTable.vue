<template>
    <div class="p-3 mt-3">
        <b-row>
            <b-col>
                <div class="d-flex  py-3">

                    <span class="mr-2"> <img v-if="filters.source == 'twitter'" src="@/assets/Twitter.png"
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
                            v-if="filters.source == ''"></b-avatar></span>

                    <!-- <b-icon icon="filter" font-scale="2.5"></b-icon> -->
                    <b-form-select id="source-select" v-model="filters.source" :options="sourceOptions"
                        style="width:200px;"></b-form-select>
                </div>
            </b-col>
            <b-col>
                <b-form-group label-for="search-input">
                    <b-input-group-append>
                        <b-form-input id="search-input" v-model="search" placeholder="ค้นหา"
                            class="mr-2"></b-form-input>
                        <b-button variant="info" pill :pressed="false" class="shadow-r">ค้นหา</b-button>
                    </b-input-group-append>
                </b-form-group>
            </b-col>

        </b-row>
        <b-form inline class="mb-3 d-none">
            <b-form-group label-for="search-input" class="mr-3">
                <b-form-input id="search-input" v-model="search" placeholder="ค้นหา"></b-form-input>
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
            <b-table :items="filteredData" :fields="fields" hover responsive :busy="load" :head-variant="headVariant"
                :table-variant="tableVariant" :striped="striped" :bordered="bordered" :borderless="borderless"
                :outlined="outlined" :small="small" thead-class="d-none"    stacked="md">
                <template #cell(id)="data">

                    {{ data.index + 1 + (currentPage - 1) * 10 }}

                </template>
                <template #cell(name)="data">
                    <div class="text-left ml-2">
                        <span v-if="type == 'targetlist'">
                            <b-avatar :src="data.item.profile_image"
                                v-if="data && data.item && data.item.profile_image">
                            </b-avatar>
                            <b-avatar :src="data.item.profile_image" v-else> </b-avatar></span>
                        {{ data.item.name || data.item.uid }}
                    </div>
                </template>
                <template #cell(link)="data">
                    <a :href="data.item.link_original" target="_blank">{{ data.item.uid }}</a>
                </template>
                <template #cell(source)="data">
                    <div class="text-left bg-link">
                        <div class="small" style="width: auto;">
                            <img v-if="data.item.source == 'twitter'" src="@/assets/Twitter.png" class="social-img" />
                            <img v-if="data.item.source == 'facebook'" src="@/assets/Facebook.png" class="social-img" />
                            <img v-if="data.item.source == 'pantip'" src="@/assets/board.png" class="social-img" />
                            <img v-if="data.item.source == 'blockdit'" src="@/assets/Blockdit.png" class="social-img" />
                            <img v-if="data.item.source == 'instagram'" src="@/assets/Instagram.png"
                                class="social-img" />
                            <img v-if="data.item.source == 'youtube'" src="@/assets/Youtube.png" class="social-img" />
                            <img v-if="data.item.source == 'news'" src="@/assets/News.png" class="social-img" />
                            <img v-if="data.item.source == 'tiktok'" src="@/assets/Tiktok.png" class="social-img" />
                            <img v-if="data.item.source == 'threads'" src="@/assets/Threads.png" class="social-img" />
                            <a :href="data.item.link_original" target="_blank" class="ml-2"
                                style="color: #2c3e50 !important;" v-if="type == 'targetlist' && load == false">{{
                                    data.item.uid }}</a>
                        </div>
                    </div>
                </template>
                <template #cell(insert_timestamp)="data">
                    <span class="small"> {{ formatDate(data.item.insert_timestamp) }}</span>
                </template>

                <template #cell(action)="data">
                    <span class="fas fa-user-alt-slash" v-b-tooltip.hover title="เลิกติดตาม" size="sm"
                        @click="delProfile(data.item, row.index)"></span>
                    <!-- <i class="fas fa-user-check"></i><i class="fas fa-user-plus"></i> -->
                    <span class="fas fa-list-ul" v-b-tooltip.hover title="ดูข้อมูลส่วนตัว" size="sm"
                        @click="linkToProfile(data.item)"></span>
                </template>
            </b-table>

        </div>
        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="center" class="my-2"
            @input="onPageChange" />

    </div>
</template>



<script>
export default {
    props: {
        type: String
    },
    data() {
        return {
            load: false,
            data: [],
            totalRows: 0,
            search: '',
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
            return this.data.filter(item =>
                item.name.toLowerCase().includes(keyword)
            );
        }
    },
    watch: {
        type(val) {
            this.filters.type = val;
            this.currentPage = 1;
            this.apiMonitorList();
        },
        filters: {
            deep: true,
            handler() {
                this.currentPage = 1;
                this.apiMonitorList();
            }
        }
    },
    methods: {
        onPageChange(page) {
            this.currentPage = page;
            this.apiMonitorList();
        },

        linkToProfile(item) {
            console.log(item);
            this.$router.push({
                name: "MonitorProfile",
                query: { uid: item.uid, source: item.source, type: this.type },
            });
        },

        apiMonitorList() {
            this.load = true;

            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/monitor/getMonitor",
                params: {
                    type: this.filters.type || undefined,
                    source: this.filters.source || undefined,
                    page: this.currentPage,
                    limit: this.perPage
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
                    this.currentPage = resData.pagination?.currentPage || 1;
                    this.load = false;
                })
                .catch((error) => {
                    this.load = false;
                    console.error(error);
                });
        }
        ,
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
    mounted() {
        this.filters.type = this.type;
        this.apiMonitorList();
    }
};


</script>
<style scoped>
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
    /* height: 100px; */
}
</style>