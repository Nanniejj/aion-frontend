<template lang="">
    <b-card 
        bg-variant="white"
        class="mb-3 border-0" 
        header-bg-variant="white"
        header-class="text-left border-0 pt-0 px-0 px-lg-3"
        body-class="p-0 scroll-body"
    >
        <template #header>
            <span class="mb-0 text-capitalize text-secondary">All influencer accounts</span>
            (<span style="font-size: 18px;" class="font-weight-bold text-info px-2 text-bold">{{ influencers.length }}</span>)
        </template>
        <b-card-text style="">
            <b-row class="m-0">
                <b-col 
                    cols="12" md="6" xl="4" 
                    v-for="(influencer, index) in influencers" :key="index"
                    class="px-0 pl-md-3 mb-3 "
                >
                    <InfluencerCard :influencer="influencer" />
                </b-col>
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
        filters: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            influencers: [
                // Sample data, replace with actual influencer data
                { id: 1, name: 'Influencer 1', category: 'Category 1' },
                { id: 2, name: 'Influencer 2', category: 'Category 2' },
                { id: 3, name: 'Influencer 3', category: 'Category 3' },
                { id: 4, name: 'Influencer 4', category: 'Category 1' },
                { id: 5, name: 'Influencer 5', category: 'Category 2' },
                { id: 6, name: 'Influencer 6', category: 'Category 3' },
                { id: 7, name: 'Influencer 7', category: 'Category 1' },
                { id: 8, name: 'Influencer 8', category: 'Category 2' },
                { id: 9, name: 'Influencer 9', category: 'Category 3' },
            ]
        };
    },
    methods: {
        // You can define methods to handle the influencer list logic here
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