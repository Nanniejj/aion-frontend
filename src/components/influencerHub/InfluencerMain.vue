<template>
  <div style="width: 85%; margin: auto;">
    <b-row class="m-0 justify-content-between">
        <b-col md="auto" class="col d-contents px-0">
            <h1 class="title m-0">Influencer Hub</h1>
        </b-col>
        <b-col cols="auto" md="auto" class="px-0">
            <div class="py-4 my-0">
                <span class="shadow-sm p-2 mb-3 bg-white rounded bold mr-2">
                    <span>Today</span>
                    {{ new Intl.DateTimeFormat("en-AU").format() }}
                </span>
                <span class="pt-3"
                    ><i class="fa fa-print align-middle" @click="printWindow()"></i
                ></span>
            </div>
        </b-col>
    </b-row>
    <!-- Recommended -->
    <!-- <div class="col-12 px-0">
        <div class="row m-0">
            <div class="px-0 bold text-lg-left text-md-left text-sm-center h5 col-sm mt-5">
                Recommended Influencers 
            </div>
        </div>
        <TopInfluencer/>
    </div> -->

    <b-row class="m-0 mb-3" style="">
        <div class="col-12 px-0">
            <div class="px-0 bold text-lg-left text-md-left text-sm-center h5 col-sm mt-5 mb-lg-5">
                Our KOLs & Influencers
            </div>
        </div>
        <div class="col-12 col-lg-4 col-xl-3 px-0 pr-md-3">
            <FilterInfluencer @filter-applied="applyFilters" />
        </div>
        <div class="col-12 col-lg-8 col-xl-9 px-0">
            <b-row class="h-100">
                <b-col>
                    <InfluencerList 
                        :total="totalRows"
                        :influencers="influencers" 
                        :filters="filters"
                        :provinces="provinces"
                        :districts="districts"
                        :subDistricts="subDistricts"
                    />
                </b-col>
                <b-col cols="12" align-self="end" class="">
                    <b-pagination 
                        v-model="currentPage"
                        :total-rows="totalRows" 
                        :per-page="perPage" 
                        align="center" class="my-2"
                        @input="onPageChange" 
                    />
                </b-col>
            </b-row>
        </div>
    </b-row>

    <!-- mobile filter display -->
    <b-sidebar id="sidebar-1" title="Filter" shadow width="350px">
        <div class="px-3 py-2">
            <FilterInfluencer :showHeader="false" @filter-applied="applyFilters" />
        </div>
    </b-sidebar>
  </div>
</template>
<script>
import FilterInfluencer from './_FilterInfluencer.vue';
import InfluencerList from './_InfluencerList.vue';
import TopInfluencer from './_TopInfluencer.vue';
export default {
    components: {
        FilterInfluencer,
        InfluencerList,
        TopInfluencer
    },
    data() {
        return {
            currentPage: 1,
            totalRows: null,
            perPage: 6,
            loading: false,
            filters: {
                search: '',
                category: null,
            },
            influencers: [],
            provinces: [],
            districts: [],
            subDistricts: [],
            influencerTypes:[]
            // followers: ""
        };
    },
    methods: {
        onPageChange() {
            this.apiGetInfluencer();
        },
        applyFilters(filters) {
            // Handle the applied filters here
            this.filters = filters;
            console.log('Filters applied:', filters);
        },
        async apiGetInfluencer(){
            try {
                this.loading = true;
                const config = {
                    method: "get",
                    url: "https://api2.cognizata.com/api/v2/monitor/monitorInfluencer",
                    params: {
                        page: this.currentPage,
                        limit: this.perPage
                    },
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },
                };

                const response = await this.axios(config);
                const result = response.data.data || [];
                console.log("res ==== ",response);
                
                this.influencers = result
                this.currentPage = response.data.page;
                this.perPage = response.data.limit;
                this.totalRows = response.data.total;
                console.log(this.influencers);
                
            } catch (error) {
                console.error("apiGetInfluencers error:", error);
                this.influencers = [];
            }
        },
        async apiGetProvinces() {
            this.load = true;
            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/location/getProvinces",
                // params: {
                //     type: this.$route.query.type,
                //     source: this.$route.query.source,
                //     id: this.$route.query.uid,
                // },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            this.axios(config)
            .then((response) => {
                let result = response.data.data || [];
                console.log(result);
                
                this.provinces = result.map(province => ({
                    text: province.name_th,
                    value: province.id
                }));
                console.log('this.provinces ', this.provinces);
                
                // this.profile = response.data?.profile
                // console.log('this.profile ', this.profile);
                this.load = false;
            })
            .catch((error) => {
                this.load = false;
                console.error(error);
            });
        },
        async apiGetDistrict(id) {
            try {
                const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/location/getAmphures",
                params: { province_id: id },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
                };

                const response = await this.axios(config);
                const result = response.data.data || [];

                this.districts =  result.map(district => ({
                    text: district.name_th,
                    value: district.id
                }));
                console.log(this.districts);
                
            } catch (error) {
                console.error("apiGetDistrict error:", error);
                this.districts =  [];
            }
        },
        async apiGetSubDistrict(id) {
            try {
                const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/location/getTambons",
                params: { amphure_id: id },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
                };

                const response = await this.axios(config);
                const result = response.data.data || [];

                this.subDistricts = result.map(subDistrict => ({
                    text: subDistrict.name_th,
                    value: subDistrict.id
                }));

                console.log(this.subDistricts);
                
            } catch (error) {
                console.error("apiGetDistrict error:", error);
                this.subDistricts = [];
            }
            
        },
        async apiGetInfluencerType() {
            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/monitor/getInfluencerType",
                
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            this.axios(config)
            .then((response) => {
                // console.log(response);
                let result = response.data || [];
                this.icon = result;
                this.influencerTypes = result.map(type => ({
                    value: type.id,
                    text: type.name
                }));
                // this.provinces = result.map(province => ({
                //     text: province.name_th,
                //     value: province.id
                // }));
                // console.log(this.icon);
                
                // console.log('this.influencerTypes ===== ', this.influencerTypes);
                // this.influencerTypes.map(type => ({
                //     value: type._id,     // หรือ type.id ก็ได้ ขึ้นกับ backend
                //     text: type.name
                // }));
                // this.profile = response.data?.profile
                // console.log('this.profile ', this.profile);
                this.load = false;
            })
            .catch((error) => {
                this.load = false;
                console.error(error);
            });
        },
    },
    async mounted() {
        await this.apiGetInfluencer();
    }
}
</script>
<style scoped>
    .py-4{
       padding-top: 20px; 
       padding-bottom: 20px; 
    }
    @media only screen and (min-width: 0px) and (max-width: 600px){
        .rounded {
            font-size: small;
        }
    }
</style>