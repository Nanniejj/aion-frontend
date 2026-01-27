<template>
    <!-- <div id="content"> -->
    <div class="container" style="min-height: 100vh;padding-left: 15px;">
        <back-to-top bottom="50px" right="50px">
            <button type="button" class="btn btn-to-top">
                <i class="fa fa-chevron-up"></i>
            </button>
        </back-to-top>
        <b-row class="mx-0">
            <b-col class="d-contents pl-0">
                <h1 class="title ml-0 pl-0">Ranking</h1>
            </b-col>
            <b-col md="auto" class="text-right px-0">
                <span class="bold md-font"> </span>
                <div class="p-4 px-0 my-0 text-sm-center text-lg-right">
                    <span class="shadow-sm p-2 mb-3 bg-white rounded bold mr-2">
                        <span>Today</span>
                        {{ new Intl.DateTimeFormat("en-AU").format() }}
                    </span>
                    <span class="pt-3"><i class="fa fa-print align-middle" @click="printWindow"></i></span>
                </div>
            </b-col>
        </b-row>
        <b-row class="bg-filter mx-0">
            <b-card v-if="showFilters" header-tag="header" footer="Card Footer" footer-tag="footer"
                class="transparent-card w-100 border-0" style="background-color: transparent;" body-class="pt-0">
                <template #header>
                    <b-row>
                        <b-col>
                            <h4 class="mb-0 bg-transparent text-left">
                                <i class='fas fa-filter'></i>
                                Filter
                            </h4>
                        </b-col>
                        <b-col>
                            <div class="position-relative text-right filter-btn">
                                <b-button :disabled="loading" size="sm" :variant="showFilters ? 'info' : 'outline-info'"
                                    @click="showFilters = !showFilters" pill class="d-inline-flex align-items-center">
                                    <i class="fas fa-sliders mr-2"></i>
                                    <span v-if="showFilters" class="small">Hide</span>
                                    <span v-else class="small">Show</span>
                                </b-button>
                            </div>
                        </b-col>
                    </b-row>
                </template>
                <b-card-text class="bg-white p-3 text-left " style="border: 2px solid #decff0;border-radius: 11px;">
                    <b-row class="mx-0 mb-2">
                        <b-col cols="12" md="" class="d-flex align-items-center px-0 px-md-3">
                            <b-col cols="" class="px-0">
                                <div class="text-left bold">Platform</div>
                                <!-- <b-form-select class="" id="source-select" v-model="select_source"
                                    :options="sourceOptions"></b-form-select> -->
                                <v-select multiple :disabled="loading" :options="sourceOptions" v-model="select_source"
                                    class="subdomain" label="text" :reduce="d => d.value" placeholder="เลือก Platform">
                                    <!-- ตัวเลือกใน dropdown -->
                                    <template #option="{ text, value }">
                                        {{ text }}
                                        <!-- {{ subdomain_name }} - ({{ domain_name }}) -->
                                    </template>

                                    <!-- ตัวที่ถูกเลือกแล้ว -->
                                    <template #selected-option="{ text, value }">
                                        <b-col cols="auto" class="pl-0 pr-1 py-1">
                                            <img v-if="value == 'twitter'" src="@/assets/Twitter.png"
                                                class="social-imgs" />
                                            <img v-if="value == 'facebook'" src="@/assets/Facebook.png"
                                                class="social-imgs" />
                                            <img v-if="value == 'pantip'" src="@/assets/board.png"
                                                class="social-imgs" />
                                            <img v-if="value == 'blockdit'" src="@/assets/Blockdit.png"
                                                class="social-imgs" />
                                            <img v-if="value == 'instagram'" src="@/assets/Instagram.png"
                                                class="social-imgs" />
                                            <img v-if="value == 'youtube'" src="@/assets/Youtube.png"
                                                class="social-imgs" />
                                            <img v-if="value == 'news'" src="@/assets/News.png" class="social-imgs" />
                                            <img v-if="value == 'tiktok'" src="@/assets/Tiktok.png"
                                                class="social-imgs" />
                                            <img v-if="value == 'threads'" src="@/assets/Threads.png"
                                                class="social-imgs" />
                                            <b-avatar v-if="value === null" text="All" size="25"
                                                style="background-color: #fed16e;"></b-avatar>

                                        </b-col>
                                        {{ text }}
                                        <!-- {{ subdomain_name }} ({{ domain_name }}) -->
                                    </template>
                                </v-select>
                            </b-col>
                            <!-- </b-row> -->
                        </b-col>
                        <b-col cols="12" md="" class="px-0 px-md-3 ">
                            <div class="text-left bold">Date</div>
                            <date-picker v-model="valueDate" type="date" range placeholder="เลือกช่วงเวลา" size="md"
                                :disabled="loading" value-type="format" format="YYYY-MM-DD"
                                @change="checkDateRange()">{{ valueDate }}
                            </date-picker>
                        </b-col>
                    </b-row>
                    <b-row class="mx-0">
                        <b-col cols="12" md="" class="px-0 px-md-3 mb-2">
                            <div class="text-left bold">Domain</div>
                            <v-select multiple :disabled="loading" class="" :options="domainOptions"
                                v-model="select_domain" @input="subdomain" label="name" id="search-input"
                                :reduce="d => d.id" placeholder="เลือก Domain">
                            </v-select>
                        </b-col>
                        <b-col cols="12" md="" class="px-0 px-md-3 mb-2">
                            <div class="text-left bold">Subdomain</div>
                            <!-- <v-select multiple :options="subDomainOptions" 
                                v-model="select_subdomain"
                                id="search-input" class="subdomain" 
                                label="subdomain_name" :disabled="isDisabled"
                                :reduce="d => d.subdomain_id"
                                placeholder="เลือก SubDomain"></v-select> -->
                            <v-select multiple :options="subDomainOptions" v-model="select_subdomain" class="subdomain"
                                label="subdomain_name" :reduce="d => d.subdomain_id" :disabled="isDisabled || loading"
                                placeholder="เลือก SubDomain">
                                <!-- ตัวเลือกใน dropdown -->
                                <template #option="{ subdomain_name, domain_name }">
                                    {{ subdomain_name }} - ({{ domain_name }})
                                </template>

                                <!-- ตัวที่ถูกเลือกแล้ว -->
                                <template #selected-option="{ subdomain_name, domain_name }">
                                    {{ subdomain_name }} ({{ domain_name }})
                                </template>
                            </v-select>

                        </b-col>
                    </b-row>
                </b-card-text>
                <!-- <b-button href="#" variant="primary">Go somewhere</b-button> -->
                <template #footer>
                    <div class="d-flex justify-content-end w-100">
                        <b-button @click="submitform()" :disabled="isDisabled || loading" size="sm" variant="info"
                            class="mr-3 text-uppercase">Apply</b-button>
                        <b-button @click="resetform()" :disabled="isDisabled || loading" size="sm"
                            variant="outline-info" class="text-uppercase">reset</b-button>
                    </div>
                </template>
            </b-card>
            <b-card v-else class="transparent-card w-100 border-0" style="background-color: transparent;"
                body-class="pt-0">
                <template #header>
                    <b-row>
                        <b-col>
                            <h4 class="mb-0 bg-transparent text-left">
                                <i class='fas fa-filter'></i>
                                Filter
                            </h4>
                        </b-col>
                        <b-col>
                            <div class="position-relative text-right filter-btn">
                                <b-button :disabled="loading" size="sm" :variant="showFilters ? 'info' : 'outline-info'"
                                    @click="showFilters = !showFilters" pill class="d-inline-flex align-items-center">
                                    <i class="fas fa-sliders mr-2"></i>
                                    <span v-if="showFilters" class="small">Hide</span>
                                    <span v-else class="small">Show</span>
                                </b-button>
                            </div>
                        </b-col>
                    </b-row>
                </template>
                <b-card-text class="text-left">
                    <b-row class="m-0" style="gap: 10px;">
                        <b-col cols="auto"
                            class="tag-filter px-2 py-1 align-self-center d-flex flex-wrap align-items-center">
                            <!-- กรณี All Platform -->
                            <template v-if="isAllPlatform">
                                <b-avatar text="All" size="30" class="mr-2" style="background-color: #fed16e;" />
                                <span>All Platform</span>
                            </template>

                            <!-- กรณีเลือกบาง platform -->
                            <template v-else>
                                <span v-for="(s, index) in normalizedSource" :key="s"
                                    class="d-inline-flex align-items-center mr-2">
                                    <img :src="require(`@/assets/${iconMap[s]}`)" class="social-img mr-1" />
                                    <span>{{ s }}</span>
                                    <span v-if="index < normalizedSource.length - 1">,</span>
                                </span>
                            </template>
                        </b-col>


                        <b-col cols="auto" class="tag-filter p-2 h-auto align-self-center">
                            <i class='fas fa-calendar-alt'></i>
                            <!-- <b-icon icon="calendar-date" class="mr-1"></b-icon> -->
                            <span class="" v-if="valueDate">
                                {{ valueDate[0] }} - {{ valueDate[1] }}</span>
                            <span class="" v-else> กรุณาเลือกช่วงเวลา</span>
                        </b-col>
                        <b-col v-if="select_domain && select_domain.length > 0" cols="auto"
                            class="tag-filter p-2 h-auto align-self-center">
                            <span class="bold"><i class='fa fa-list-alt'></i> domain</span> :
                            <!-- {{ select_domain.toString() }} -->
                            {{ selectedDomainNames }}
                        </b-col>
                        <b-col v-if="select_subdomain && select_subdomain.length > 0" cols="auto"
                            class="tag-filter p-2 h-auto align-self-center">
                            <span class="bold"><i class='fas fa-tags'></i> subdomain</span> :
                            <!-- {{select_subdomain.toString() }} -->
                            {{ selectedSubdomainNames }}
                        </b-col>
                    </b-row>
                </b-card-text>
            </b-card>
        </b-row>
        <!-- {{ loading }} -->
        <b-row class="py-3 mx-0">
            <b-col cols="12" class="text-left px-0 mb-3">
                <div v-if="loading" style="min-height: 300px;position: relative;">
                    <vue-element-loading :active="loading" size="60" background-color="rgba(255, 255, 255, 0.1)"
                        spinner="line-scale" color="#7cd1dc" />
                </div>
                <div v-if="dataCharts && !isDisabled && !loading">
                    <RankingOverviewChart v-if="isReadyToShowChart" :domainId="domainIdString"
                        :subdomainId="subdomainIdString" :start="valueDate[0]" :end="valueDate[1]"
                        :dataVersion="dataVersion" :source="apiSource" />
                </div>
            </b-col>
            <b-col v-if="dataCharts && !isDisabled && !loading" cols="12" class="text-left px-0">
                <RankingDailyChart :rawData="dataCharts" :isSubdomain="isSubdomain" :dataVersion="dataVersion" />
            </b-col>
            <b-col v-if="dataCharts && !isDisabled && !loading" cols="12" class="px-0 mt-3">
                <div v-if="loadingDomain || loadingSubdomain || loadingObject" style="min-height: 300px;position: relative;">
                    <vue-element-loading :active="loading" size="60" background-color="rgba(255, 255, 255, 0.1)"
                        spinner="line-scale" color="#7cd1dc" />
                </div>
                <RankingWords
                    v-else
                    :domains="domainCountData"
                    :subdomains="subdomainCountData"
                    :objects="objectCountData"
                    :start="valueDate[0]+'T00:00:00'"
                    :end="valueDate[1]+'T23:59:59'"
                />
            </b-col>
        </b-row>

    </div>
</template>

<script>
import "vue-select/dist/vue-select.css";
import { mapGetters } from "vuex";
import moment from "moment";
// import ColumnChart from "../chart/ColumnChart.vue";

import RankingTab from "@/components/ranking/RankingTab.vue";
import RankingDailyChart from "./RankingDailyChart.vue";
import RankingOverviewChart from "./RankingOverviewChart.vue";
import RankingWords from "./RankingWords.vue"; 
export default {
    components: { RankingTab, RankingDailyChart, RankingOverviewChart,RankingWords },

    data: function () {
        return {
            loading: false,
            loadingDomain: false,
            loadingSubdomain: false,
            loadingObject: false,
            dropdownloading: false,
            showFilters: true,
            dmy: "",
            options: [
                { id: "day", value: "Today" },
                { id: "week", value: "Last week" },
                { id: "month", value: "1 month" },
            ],
            sourceOptions: [
                { value: null, text: 'All Platform' },
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
            iconMap: {
                facebook: 'Facebook.png',
                twitter: 'Twitter.png',
                pantip: 'board.png',
                news: 'News.png',
                youtube: 'Youtube.png',
                instagram: 'Instagram.png',
                blockdit: 'Blockdit.png',
                tiktok: 'Tiktok.png',
                threads: 'Threads.png'
            },
            domainOptions: [],
            subDomainOptions: [],
            dataCharts: null,
            dataVersion: 0,
            type_selected: "day",
            select_domain: [],
            select_subdomain: [],
            objectsstatname: [],
            select_source: [null],
            tab_selected_detail_social: "all",
            // tab_selected_social: "all",
            selected: 0,
            social: "news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads",
            datearrs: null,
            datearre: null,
            valueDate: [this.datearre, this.datearrs],
            domainCountData:[],
            subdomainCountData:[],
            objectCountData:[],
        };
    },
    computed: {
        isReadyToShowChart() {
            return (
                !!this.domainIdString &&
                Array.isArray(this.valueDate) &&
                this.valueDate.length === 2 &&
                !!this.valueDate[0] &&
                !!this.valueDate[1]
            )
        },
        normalizedSource() {
            if (!this.select_source || this.select_source.length === 0) return []
            return this.select_source.filter(v => v !== null)
        },

        isSubdomain() {
            return this.select_subdomain?.length > 0
        },
        isAllPlatform() {
            return this.select_source?.length === 1 && this.select_source[0] === null
        },
        domainIdString() {
            return Array.isArray(this.select_domain) && this.select_domain.length
                ? this.select_domain.join(',')
                : null

        },
        subdomainIdString() {
            return Array.isArray(this.select_subdomain) && this.select_subdomain.length
                ? this.select_subdomain.join(',')
                : null

        },
        selectedSubdomainNames() {
            if (!this.select_subdomain || !this.subDomainOptions) return "";
            return this.subDomainOptions
                .filter(opt => this.select_subdomain.includes(opt.subdomain_id))
                .map(opt => opt.subdomain_name)
                .join(", ");
        },
        selectedDomainNames() {
            if (!this.select_domain || !this.domainOptions) return "";
            return this.domainOptions
                .filter(opt => this.select_domain.includes(opt.id))
                .map(opt => opt.name)
                .join(", ");
        },
        isDisabled() {
            return (!Array.isArray(this.select_domain) || this.select_domain.length === 0) && !this.dropdownloading
        },
        apiSource() {
            // กรณี All Platform
            if (
                Array.isArray(this.select_source) &&
                this.select_source.length === 1 &&
                this.select_source[0] === null
            ) {
                return 'news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads'
            }

            // กรณีเลือกบาง platform
            if (this.select_source?.length) {
                return this.select_source.join(',')
            }

            return null
        },
        // ...mapGetters([
        //     "getWordCloudStartDate",
        //     "getWordCloudEndDate",
        //     "getSubDomainRanking",
        //     "getDomainRanking",
        //     "getShowSubDomainRanking",
        //     "getSubmitRanking",
        //     "getRanking",
        //     "getSocial",
        //     "getShowRankTab",
        //     "getToSection",
        // ]),
    },
    methods: {
        checkDateRange() {
            const startDate = moment(this.valueDate[0]);
            const endDate = moment(this.valueDate[1]);

            const diffDays = endDate.diff(startDate, 'days');

            if (diffDays > 31) {
                alert('กรุณาเลือกช่วงเวลาที่ไม่เกิน 1 เดือน หรือ 31 วัน');
                this.valueDate[1] = startDate.add(31, 'days').format('YYYY-MM-DD');
            } else {
                this.selectData(); // Call your existing method
            }
        },
        printWindow: function () {
            try {
                window.print();
            } catch (err) {
                console.log(err);
            }
        },
        onOptionsChange: function () {
            this.$store.commit("changeDataChoice", { choice: this.type_selected });
        },
        selectData() {
            // console.log(this.valueDate[0], this.valueDate[1]);
            if (this.valueDate[0] == null) {
                var todaye =
                    moment(new Date())
                        .format()
                        .slice(0, 10) + "T23:59:59";
                var todayend = new Date(todaye);
                todayend.setDate(todayend.getDate() - 6);
                this.start_date =
                    moment(todayend)
                        .format()
                        .slice(0, 10) + "T00:00:00";
                this.end_date =
                    moment(new Date())
                        .format()
                        .slice(0, 10) + "T23:59:59";

                //  var todaye = moment(new Date()).format().slice(0, 10) + "T23:59:59";
                // var todayend = new Date(todaye);
                // todayend.setDate(todayend.getDate() - 6);
                // var todays = moment(todayend).format().slice(0, 10) + "T00:00:00";
            } else {
                this.start_date = this.valueDate[0] + "T00:00:00";
                this.end_date = this.valueDate[1] + "T23:59:59";
            }

            this.$store.commit("setWordCloudStartDate", this.start_date);
            this.$store.commit("setWordCloudEndDate", this.end_date);

            // this.$store.dispatch("fetchSentimentStat", {
            //   start_date: this.start_date,
            //   end_date: this.end_date,
            // });
        },
        dateFormat() {
            var d = new Date().toLocaleDateString();
            var dd = d.split("/");
            this.dmy = dd[1] + "/" + dd[0] + "/" + dd[2];
            return this.dmy;
        },
        async submitform() {
            this.apiGetRanking();
            this.apiGetSubdomainCount();
            this.apiGetObjectCount();
            this.apiGetDomainCount();
        },
        resetform() {
            this.valueDate = [this.datearre, this.datearrs];
            this.select_source = [null];
            this.select_domain = [];
            this.select_subdomain = [];
            this.dataCharts = null;
            // this.getranking();
            // this.valueDate[1] = this.datearrs;
        },
        subdomain: function () {
            this.select_subdomain = "";
            this.dataCharts = null;
            this.apiGetSubDomains();
        },
        async apiGetDomains() {
            this.dropdownloading = true;
            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/domain/getDomainlist",
                // params: {
                //     name: this.search
                // },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            this.axios(config)
                .then((response) => {
                    const resData = response.data;
                    this.domainOptions = resData.data || [];
                    // this.totalRows = resData.pagination?.totalCount || this.data.length;
                    this.totalCount = resData.totalCount || this.domainOptions.length;
                    this.dropdownloading = false;
                    // this.$emit('updated')

                })
                .catch((error) => {
                    this.dropdownloading = false;
                    this.domainOptions = [];
                    console.error(error);
                });
        },
        async apiGetSubDomains() {
            this.dropdownloading = true;
            // console.log('apiMonitorList ===',this.currentPage);

            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/domain/getSubdomainlist",
                params: {
                    domain_id: this.select_domain?.length
                        ? this.select_domain.join(',')
                        : ''
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            this.axios(config)
                .then((response) => {
                    const resData = response.data;

                    this.subDomainOptions = resData.data || [];
                    // console.log(this.subDomainOptions);
                    // this.totalRows = resData.pagination?.totalCount || this.data.length;
                    // this.totalCount = resData.totalCount || this.subDomainOptions.length;
                    this.dropdownloading = false;
                    // this.$emit('updated')

                })
                .catch((error) => {
                    this.dropdownloading = false;
                    this.subDomainOptions = [];
                    console.error(error);
                });
        },
        async apiGetRanking() {
            this.loading = true
            this.showFilters = false
            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/ranking/getRanking",
                params: {
                    domain_id: this.select_domain?.length
                        ? this.select_domain.join(',')
                        : '',
                    ...(this.select_subdomain?.length && {
                        subdomain_id: this.select_subdomain.join(',')
                    }),
                    ...(this.apiSource && {
                        source: this.apiSource
                    }),
                    start: this.valueDate[0] + 'T00:00:00',
                    end: this.valueDate[1] + 'T23:59:59',
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            }

            try {
                const response = await this.axios(config)
                this.dataCharts = response.data || {}

                // ✅ สำคัญมาก
                this.dataVersion++

            } catch (error) {
                console.error(error)
            } finally {
                this.loading = false
            }
        },
        async apiGetDomainCount() {
            this.loadingDomain = true
            this.showFilters = false
            try {
                // this.chartOptions = {
                //     ...this.chartOptions,
                //     noData: { text: "Loading..." }
                // };
                this.domainCountData = [];
                const res = await this.axios.get(
                    `https://api2.cognizata.com/api/v2/ranking/getDomainCount`,
                    {
                        params: {
                            domain_id: this.select_domain?.length
                                ? this.select_domain.join(',')
                                : '',
                            start: this.valueDate[0] + 'T00:00:00',
                            end: this.valueDate[1] + 'T23:59:59',
                            ...(this.apiSource && {
                                source: this.apiSource
                            }),
                        },
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token")
                        }
                    }
                );
                this.domainCountData = res?.data?.data || [];
                // this.updateDomainChart();
                // this.chartOptionsSubdomain = {
                //     ...this.chartOptionsSubdomain,
                //     noData: { text: "" }
                // };
            } catch (err) {
                this.domainCountData = [];
                console.error("loadSubdomainChart error:", err);
            }finally {
                this.loadingDomain = false
            }
        },
        async apiGetSubdomainCount() {
            this.loadingSubdomain = true
            this.showFilters = false
            try {
                this.subdomainCountData = [];
                const res = await this.axios.get(
                    `https://api2.cognizata.com/api/v2/ranking/getSubdomainCount`,
                    {
                        params: {
                            domain_id: this.select_domain?.length
                                ? this.select_domain.join(',')
                                : '',
                            ...(this.select_subdomain?.length && {
                                subdomain_id: this.select_subdomain.join(',')
                            }),
                            limit: 10,
                            start: this.valueDate[0] + 'T00:00:00',
                            end: this.valueDate[1] + 'T23:59:59',
                            ...(this.apiSource && {
                                source: this.apiSource
                            }),
                        },
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token")
                        }
                    }
                );
                // this.subdomainCountData = res.data.data;
                const list = res?.data?.data || [];
                this.subdomainCountData = list.length ? list.slice(0, 10) : [];
            } catch (err) {
                this.subdomainCountData = [];
                console.error("loadSubdomainChart error:", err);
            }finally {
                this.loadingSubdomain = false
            }
        },
        async apiGetObjectCount() {
            this.loadingObject = true
            this.showFilters = false
            try {
                // this.chartOptions = {
                //     ...this.chartOptions,
                //     noData: { text: "Loading..." }
                // };
                let social = this.apiSource == 'news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads' ? null : this.apiSource;
                this.objectCountData = [];
                const params = {
                    domain_id: this.select_domain?.length
                        ? this.select_domain.join(',')
                        : '',
                    ...(this.select_subdomain?.length && {
                        subdomain_id: this.select_subdomain.join(',')
                    }),
                    limit: 10,
                    start: this.valueDate[0] + 'T00:00:00',
                    end: this.valueDate[1] + 'T23:59:59',
                    ...(social && {
                        source: social
                    }),
                }

                // ลำดับความสำคัญ: subdomain_idText > subdomainId
                // if (Array.isArray(this.select_subdomain) && this.subdomain_idText.length > 0) {
                //     params.subdomain_id = this.subdomain_idText.join(',')
                // } else if (this.subdomainId) {
                //     params.subdomain_id = this.subdomainId
                // }
                const res = await this.axios.get(
                    "https://api2.cognizata.com/api/v2/ranking/getObjectCount",
                    {
                        params,
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token")
                        }
                    }
                )
                this.objectCountData = res?.data?.data || [];
                // this.updateDomainChart();
                // this.chartOptionsSubdomain = {
                //     ...this.chartOptionsSubdomain,
                //     noData: { text: "" }
                // };
            } catch (err) {
                this.objectCountData = [];
                console.error("loadSubdomainChart error:", err);
            }finally {
                this.loadingObject = false
            }
        },
    },
    created: function () {
        this.domain = this.select_domain;
        // this.$store.dispatch("fetchDomainRanking");

        this.$nextTick(function () {
            this.dateFormat();
            var currentTime = new Date();
            currentTime.setDate(currentTime.getDate() - 6);
            this.datearrs = moment(new Date())
                .format()
                .slice(0, 10);
            this.datearre = moment(currentTime)
                .format()
                .slice(0, 10);
            var todaye =
                moment(new Date())
                    .format()
                    .slice(0, 10) + "T23:59:59";
            var todayend = new Date(todaye);
            todayend.setDate(todayend.getDate() - 6);
            var todays =
                moment(todayend)
                    .format()
                    .slice(0, 10) + "T00:00:00";
            this.$store.commit("setWordCloudStartDate", todays);
            this.$store.commit("setWordCloudEndDate", todaye);
            this.valueDate = [this.datearre, this.datearrs];
        });
    },
    destroyed() {
        this.$store.commit("setShowRankTab", false);
    },
    mounted() {
        this.apiGetDomains();
    },
    watch: {
        select_source(newVal) {
            if (!Array.isArray(newVal)) return

            // ถ้าเลือก platform อื่น → เอา null ออก
            if (newVal.length > 1 && newVal.includes(null)) {
                this.select_source = newVal.filter(v => v !== null)
                return
            }

            // ถ้าลบหมด → กลับเป็น All
            if (newVal.length === 0) {
                this.select_source = [null]
            }
        }
    }
};
</script>

<style scoped>
.tag-filter {
    background-color: #fcf9ff;
    border-radius: 20px;
}

::v-deep .vs__selected-options .vs__selected {
    background-color: #ebdaff;
    color: #2c3e50;
    border-radius: 15px;
}

.mx-datepicker-range {
    width: 100% !important;
}

.social-imgs {
    width: 25px;
}

.social-img {
    /* padding: 5px; */
    width: 30px;
    margin-left: 0px;
}

.text-uppercase {
    text-transform: uppercase !important;
}

.transparent-card .card-header {
    background-color: transparent !important;
    border-bottom: none;
    /* ถ้าไม่ต้องการเส้น */
}

.bg-filter {
    /* height: 30vh; */
    width: 100%;
    border-radius: 11px;
    background-color: #b8d3d3a4;
    background-image:
        radial-gradient(circle farthest-corner at top left,
            #decff0 0%,
            rgba(225, 243, 97, 0) 50%),
        radial-gradient(circle farthest-side at top right,
            #ffdbea 10%,
            rgba(181, 176, 177, 0) 20%),
        radial-gradient(circle farthest-corner at bottom right,
            #decff0 0%,
            rgba(204, 104, 119, 0) 50%),
        radial-gradient(circle farthest-corner at bottom left,
            #ffdbea 10%,
            rgba(155, 221, 240, 0) 20%),
        radial-gradient(ellipse at bottom center,
            #b8d3d3a4 0%,
            rgba(254, 43, 0, 0) 80%);
}

.vue-back-to-top {
    right: 65px !important;
}

.btn-to-top {
    width: 60px;
    height: 60px;
    padding: 10px 16px;
    border-radius: 50%;
    font-size: 22px;
    line-height: 22px;
    background-color: #fed16e;
    border-color: #fed16e;
    color: #fff;
    box-shadow: 2px 1px 4px #888888;
}

.btn-to-top:hover {
    background-color: #f7c24e;
    border-color: #f7c24e;
    color: #fff;
}

.fa-print {
    font-size: 25px;
    cursor: pointer;
}

#date-picker {
    width: fit-content;
}

.gtxt {
    color: #808084;
}

.box-small {
    line-height: 28px;
    padding: 2px 10px;
    border-radius: 7px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

h5 {
    font-size: larger;
}

.allsel {
    display: block;
    color: white;
    text-align: center;
    padding: 8px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.box-domain {
    width: 100%;
    height: auto;
    min-height: 270px;
    padding: 20px 20px;
    border-radius: 7px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    display: grid;
    align-items: center;
    justify-content: center;
}

.box-r {
    display: block !important;
}

#export-btn {
    margin: 0px 20px;
    color: #495057;
    background-color: #e9ecef;
    border-color: #e9ecef;
    border-radius: 9px;
    box-shadow: 0 2px 5px 0 rgb(0 0 0 / 20%);
}

#export-btn:hover {
    color: white;
    background-color: #495057;
    border-color: #495057;
}

/* button {
    background-color: #f0f0f0;
    border: solid 1px #bbb;
    padding: 10px;
    font-size: 15px;
    border-radius: 5px;
} */

#switch {
    display: -webkit-inline-box;
    margin-bottom: 20px;
}

.custom-switch.b-custom-control-lg,
.input-group-lg .custom-switch {
    padding-left: 3.8125rem;
}


#content {
    max-width: 93%;
    margin: auto;
    background: white;
    min-height: 100vh;
    padding: 0;
}

.circle-size {
    padding-left: 1.2rem;
    padding-right: 1.1rem;
}

.imgsocial {
    width: 40px;
}

.gray {
    color: #543506d1 !important;
}

#all a {
    color: white !important;
}

.all {
    background-color: #fed16e;
    color: white;
    width: 40px;
    padding-top: 0.3rem;
    padding-bottom: 0;
    border-radius: 50%;
}

.nav {
    pointer-events: none;
    opacity: 0.3;
}

#menu ul {
    list-style-type: none;
    margin: auto;
    padding: 0;
    overflow: hidden;
    display: inline;
    margin-bottom: 30px;
}

#menu li {
    cursor: pointer;
}

#menu li a {
    display: block;
    color: white;
    text-align: center;
    padding: 7px;
    text-decoration: none;
}

#menu li {
    display: -webkit-inline-box;
    margin: 0px;
}

#menu li:hover {
    background-color: #dddddd;
}

.dropdown-toggle {
    color: #4c412b;
    width: 80%;
    background-color: #ede7dd;
    border-color: transparent;
    cursor: pointer;
}

.dropdown-toggle::after {
    margin-left: 7em;
}

.btn-primary:not(:disabled):not(.disabled).active,
.btn-primary:not(:disabled):not(.disabled):active,
.show>.btn-primary.dropdown-toggle {
    color: #4c412b;
    background-color: #ede7dd;
    width: 80%;
    border-color: transparent;
}

.show>.btn-primary.dropdown-toggle:focus {
    box-shadow: none !important;
}

.btn-primary:focus {
    box-shadow: none !important;
}

.submit {
    margin-top: 20px;
    width: auto;
    background-color: white;
    color: gray;
    border-color: #fed16e !important;
    border-radius: 9px;
    font-weight: bold;
    cursor: pointer;
}

.submit:hover {
    background-color: #ddd;
}

.detail {
    margin-left: -17rem;
    margin-top: 400px;
}

.number {
    margin-left: -0.4rem;
    font-weight: bold;
}

.word {
    margin-left: -0.2rem;
    font-weight: bold;
}

.word:hover {
    color: #543506fc !important;
}

a {
    color: #543506fc !important;
}

.pointer {
    cursor: pointer;
}

.listf {
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
}

.lists {
    background-color: #ede7dd;
}

.list {
    height: 25px;
    font-size: 13pt;
    padding-top: 0;
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
}

.paddingtb {
    padding-left: 11.3rem;
}

.list-group {
    width: 600px;
    margin: auto;
    margin-top: 30px;
}

.text-end {
    text-align: end;
}

.text-start {
    text-align: start;
}

.sub-doc {
    font-size: 12pt;
}

.yellow {
    color: #8b5f3d;
}

.cardChart {
    padding: 10px;
    border-radius: 12px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    margin: auto;
    margin-top: 3rem;
    margin-bottom: 3rem;
}

.tablename {
    font-size: 20pt;
    margin-bottom: 20pt;
    font-weight: bold;
}

.date {
    text-align: end;
}

.margin-10 {
    margin-top: 10px;
}

.margin-25 {
    margin-top: 25pt;
}

.top10 {
    font-size: 18pt;
    font-weight: bold;
}

.datetxt {
    font-size: 14pt;
}

.col-chart {
    margin-left: 3rem;
}

#chart-list .list-group {
    width: 350px;
    margin-left: 10rem;
    margin-top: 30px;
    padding-bottom: 3rem;
}

.col-sm-3 {
    margin: 0;
    padding: 0;
}

.legend {
    margin-top: 1.8rem;
    font-size: 11pt;
    font-weight: bold;
    color: black;
}

.legend a {
    color: #8b5f3d;
    margin-left: 3px;
}

.legend-bottom {
    padding-left: 250px;
    color: black;
    padding-bottom: 20px;
}

.legend-bottom span {
    margin-left: 30px;
}

.legend-bottom span img {
    width: 30px;
}

.mx-input {
    display: inline-block;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    height: 34px;
    padding: 6px 30px;
    padding-left: 10px;
    font-size: 14px;
    line-height: 1.4;
    color: #555;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
    box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
}

.mx-icon-calendar,
.mx-icon-clear {
    position: absolute;
    top: 50%;
    right: 8px;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    font-size: 16px;
    line-height: 1;
    color: rgba(0, 0, 0, 0.5);
    vertical-align: middle;
}

@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
    #overflow-page {
        overflow: hidden;
    }

    #menu li a[data-v-4a130b48] {
        padding: 5px;
    }

    .all {
        padding: 5px !important;
    }
}

@media only screen and (min-width: 0px) and (max-width: 990px) {
    .box-domain {
        width: 100%;
        height: auto;
    }
}

@media only screen and (min-width: 950px) and (max-width: 1150px) {
    #menu li a {
        display: block;
        color: white;
        text-align: center;
        padding: 8px;
        text-decoration: none;
    }

    #menu ul {
        list-style-type: none;
        margin: auto;
        padding: 0;
        overflow: hidden;
        width: auto;
        margin-bottom: 30px;
    }

    #menu li[data-v-4a130b48] {
        float: left;
        width: auto;
    }

    #chart-list .list-group {
        width: 350px;
        margin-left: -15rem;
        margin-top: 350px;
    }

    #bar-chart .col-chart {
        margin-left: 0.9rem;
    }

    #overflow-page {
        overflow: hidden;
    }
}

@media only screen and (min-width: 0px) and (max-width: 600px) {
    .container {
        padding-left: 40px;
    }

    .box-domain {
        padding: 20px 13px;
    }

    .p-4 {
        padding-left: 4px !important;
        padding-right: 4px !important;
    }

    .btn-to-top {
        width: 47px;
        height: 47px;
        padding: 10px 10px;
        border-radius: 50%;
        font-size: 22px;
        line-height: 22px;
    }

    .vue-back-to-top {
        bottom: 50px !important;
        right: 17px !important;
    }

    .all {
        height: 30px;
        width: 30px;
    }

    .imgsocial {
        width: 30px !important;
    }

    #menu li a {
        padding: 2px;
    }

    .d-contents {
        display: contents !important;
    }

    .fa-print {
        font-size: 20px;
        margin-right: 5px;
    }

    #overflow-page {
        overflow: hidden;
    }

    #rank-col {
        flex: 0 0 100%;
        max-width: 100%;
    }

    #content>div.container>div:nth-child(2)>div:nth-child(2)>div>div>div.row.justify-content-center>div {
        margin: 5px;
    }

    .tablename {
        font-size: 14pt;
    }

    #content>div.container>div:nth-child(2)>div:nth-child(2)>div>div>div:nth-child(1)>div:nth-child(1) {
        width: 100vw;
    }

    .col {
        width: 100vw;
    }

    .col-5 {
        flex: 0 0 80%;
        max-width: 80%;
    }

    .title {
        font-size: 5vw !important;
    }

    .mx-input {
        display: inline-block;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 40%;
        height: 34px;
        padding: 6px 30px;
        padding-left: 10px;
        font-size: 14px;
        line-height: 1.4;
        color: #555;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        -webkit-box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
        box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
        margin-right: 50%;
    }

    .mx-icon-calendar,
    .mx-icon-clear {
        position: absolute;
        top: 50%;
        right: 8px;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        font-size: 16px;
        line-height: 1;
        color: rgba(0, 0, 0, 0.5);
        vertical-align: middle;
        margin-right: 55%;
    }

    .imgsocial {
        width: 40px;
    }

    #menu li {
        display: -webkit-inline-box;
        margin: 0px !important;
    }

    .mx-datepicker-range {
        width: 270px;
    }

    .rounded {
        font-size: small;
    }
}

@media print {
    #export-btn {
        display: none;
    }
}
</style>
