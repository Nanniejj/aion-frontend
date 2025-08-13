<template lang="">
    <b-card 
        bg-variant="white"
        class="mb-3 border-0" 
        header-bg-variant="white"
        header-class="text-left border-0 pt-0 px-0 px-lg-3"
        body-class="p-0 scroll-body"
    >
        <template #header>
            <span class="mb-0 text-capitalize">All influencer accounts</span>
            (<span style="font-size: 18px;" class="font-weight-bold text-info px-2 text-bold">{{ total }}</span>)
        </template>
        <b-card-text style="" >
            <b-row cols="1" cols-md="2" cols-xl="3" v-if="influencers && influencers.length !== 0" class="m-0">
                <b-col 
                    v-for="(influencer, index) in influencers" :key="index"
                    class="mb-3"
                >
                    <InfluencerCard :influencer="influencer" />
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
        };
    },
    methods: {
       
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