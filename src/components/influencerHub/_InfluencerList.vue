<template lang="">
    <b-card 
        bg-variant="white"
        class="mb-3 border-0" 
        header-bg-variant="white"
        header-class="text-left border-0 pt-0 px-0 px-lg-3"
        body-class="p-0"
    >
        <template #header>
            <span class="mb-0 text-capitalize">All influencer accounts</span>
            (<span style="font-size: 18px;" class="font-weight-bold text-info px-2 text-bold">{{ total }}</span>)
        </template>
        <b-card-text >
            <b-row cols="1" cols-md="2" cols-xl="3" v-if="influencers && influencers.length !== 0" class="m-0">
                <b-col 
                    v-for="(influencer, index) in influencers" :key="index"
                    class="mb-4 pr-0"
                >
                    <InfluencerCard 
                        :influencer="influencer"
                        :influencerTypes="getInfluencerType(influencer.influencer_type)"
                    />
                </b-col>
            </b-row>
            <b-row v-else class="justify-content-center text-secondary mt-5">
                ไม่พบข้อมูล
            </b-row>
        </b-card-text>
        
    </b-card>
</template>
<script>
import InfluencerCard from './_InfluencerCard.vue';
export default {
    components: {
        InfluencerCard,
    },
    props: {
        influencers: {
            type: Array,
            default: () => ([])
        },
        filters: {
            type: Object,
            default: () => ({})
        },
        total:{
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            //
            provinces: [],
            districts: [],
            subDistricts: [],
            influencerTypes:[]
        };
    },
    methods: {
        getInfluencerType(items) {
            if (!Array.isArray(items)) return []; // เช็คก่อนว่า items เป็น array
            const result = this.influencerTypes.filter(obj =>
                items.includes(obj.value)
            );
            return result;
        },
        async apiGetProvinces() {
            this.load = true;
            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/location/getProvinces",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            this.axios(config)
            .then((response) => {
                let result = response.data.data || [];
                
                this.provinces = result.map(province => ({
                    text: province.name_th,
                    value: province.id
                }));
                
                // this.profile = response.data?.profile
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
                let result = response.data || [];
                this.icon = result;
                this.influencerTypes = result.map(type => ({
                    value: type.id,
                    text: type.name
                }));
                this.load = false;
            })
            .catch((error) => {
                this.load = false;
                console.error(error);
            });
        },
        
    },
    async mounted() {
        this.apiGetInfluencerType();
        this.apiGetProvinces();

    }
}
</script>
<style scoped>

.scroll-body{
    /* max-height: 750px; md */
    max-height: 850px;
    overflow-y: auto; 
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: #ffffff transparent;
}
@media only screen and (min-width: 0px) and (max-width: 760px){
    .scroll-body{
        max-height: 78vh;
    }
}
@media only screen and (min-width: 761px) and (max-width: 1023px){
    .scroll-body{
        max-height: 59vh;
    }
}
/* @media only screen and (min-width: 1200px){
    .scroll-body{
        max-height: 100vh;
    }
} */
</style>