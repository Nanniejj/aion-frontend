<template>
    <div v-if="data" class="p-2 bg-custom boxlist-card" style="border-top-left-radius: 0;" >
        <vue-element-loading :active="load" size="80" background-color="rgba(255, 255, 255, 0.3)" color="#ede7dd" />
        <b-row cols="4" cols-md="5" cols-lg="10" class="px-3">
            <b-col xl="" class="p-1">
                <!-- <b-card class="text-center card-item shadow-sm" :body-class="['p-2 w-auto']"> -->
                    <div class="row align-items-center py-1 h-100 card-item shadow-sm justify-content-center m-0">
                        <div class="col-auto">
                            <b-avatar class="d-md-none" size="25" text="All" style="background-color: #fed16e;"></b-avatar>
                            <b-avatar class="d-none d-md-block" size="45" text="All" style="background-color: #fed16e;"></b-avatar>
                        </div>
                        <!-- <div class="col-12 h5 mb-0 font-weight-bold">
                            {{ data.totalCount || 0 | numFormat }}
                        </div> -->
                        <!-- <div class="col-auto small px-0">users</div> -->
                        <div class="col-12 h5 mb-0 font-weight-bold px-0">  {{ data.totalCount || 0 | numFormat }}</div>
                        <div class="col-auto  small px-0">users</div>
                    </div>
                <!-- </b-card> -->
            </b-col>
            <b-col xl="" class="p-1" 
                v-for="(item, index) in data.aggregatedData || []" 
                :key="index">
                <!-- <b-card class=" text-center card-item shadow-sm h-100" :body-class="['p-1 ']"> -->
                    <div class="row align-items-center py-1 h-100 card-item shadow-sm justify-content-center m-0">
                        <div class="col-auto">
                            <img v-if="item.source == 'twitter'" src="@/assets/Twitter.png" class="social-img" />
                            <img v-if="item.source == 'facebook'" src="@/assets/Facebook.png" class="social-img" />
                            <img v-if="item.source == 'pantip'" src="@/assets/board.png" class="social-img" />
                            <img v-if="item.source == 'blockdit'" src="@/assets/Blockdit.png" class="social-img" />
                            <img v-if="item.source == 'instagram'" src="@/assets/Instagram.png"
                                class="social-img" />
                            <img v-if="item.source == 'youtube'" src="@/assets/Youtube.png" class="social-img" />
                            <img v-if="item.source == 'news'" src="@/assets/News.png" class="social-img" />
                            <img v-if="item.source == 'tiktok'" src="@/assets/Tiktok.png" class="social-img" />
                            <img v-if="item.source == 'threads'" src="@/assets/Threads.png" class="social-img" />
                        </div>
                        <div class="col-12 h5 mb-0 font-weight-bold px-0"> {{ item.count || 0 | numFormat }}</div>
                        <div class="col-auto  small px-0">users</div>
                    </div>
                <!-- </b-card> -->
            </b-col>
        </b-row>
    </div>
</template>

<script>
export default {
    props: {
        type: String
    },
    watch: {
        type(val) {
            console.log(val);
            this.apiMonitor()
        }
    },
    data() {
        return {
            load: false,
            data: null
        }
    },
    methods: {
        apiMonitor() {

            this.load = true;

            var config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/monitor/getMonitorlist",
                params: {
                    type: this.type,

                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };
            this.axios(config)
                .then((response) => {
                    this.data = response.data
                    // console.log(response);
                    this.load = false;

                })
                .catch((error) => {
                    this.load = false;
                    console.log(error);
                });

        }
    },
    mounted() {
        this.apiMonitor()
    },
}
</script>
<style scoped>
.social-img {
    width: 45px;
    /* height: 45px; */
}

.gap-custom {
  gap: 10px; /* หรือเปลี่ยนตามต้องการ */
}
.card-item {
    /* border: 0px;
    border-radius: 15px; */
    background: rgba(255, 255, 255, 0.3);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.9) !important;
}

.card-item {
    width: 100%;
    /* border: 0px; */
}

.boxlist-card {

    /* border: 0px; */
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
    /* border-radius: 15px; */
    border-radius: .3rem;
    /* height: 100px; */
}
.g-10{
    gap: 5px;
}
.bg-custom{
    /* background: #17A3B8CE; */
    /* background: linear-gradient(90deg, #ede7dd 50%, #FDD071 20%); */
    background: linear-gradient(127deg,#ffe6e6 40%, #FDD071 100%);
}
.shadow-inner{
    box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.261) inset;
}
/* xs */
@media only screen and (min-width: 0px) and (max-width: 575px) {
    .social-img {
        width: 25px;
    }
    /* .card-item{
        width: 99px;
    } */
}
/* sm */
@media only screen and (min-width: 576px) and (max-width: 767px) {
    .social-img {
        width: 25px;
    }
    /* .card-item{
        width: 95px;
    } */
}
/* md */
/* @media only screen and (min-width: 768px) and (max-width: 991px) {
    .card-item{
        width: 85px;
    }
} */
/* lg */
/* @media (min-width: 992px)and (max-width: 1310px) {
    .card-item{
        width: 100px;
    }
} */
/* extra */
/* @media (min-width: 992px)and (max-width: 1200px) {
    .card-item{
        width: 102px;
    }
} */
</style>