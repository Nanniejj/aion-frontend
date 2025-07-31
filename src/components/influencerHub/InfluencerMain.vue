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
            <InfluencerList :filters="filters" />
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
            filters: {
                search: '',
                category: null,
            },
            // followers: ""
        };
    },
    methods: {
        applyFilters(filters) {
            // Handle the applied filters here
            this.filters = filters;
            console.log('Filters applied:', filters);
        },
        // printWindow() {
        //     window.print();
        // }
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