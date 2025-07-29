<template>
    <div v-if="data" class="px-4">
        <vue-element-loading :active="load" size="80" background-color="rgba(255, 255, 255, 0.3)" color="#ede7dd" />
        <b-row class="boxlist-card" md="10" no-gutters>

            <b-col cols="auto" lg="">
                <b-card class="text-center card-item">

                    <b-row>
                        <b-col>
                            <div class="mb-2">
                                <b-avatar text="All" size="45" style="background-color: #fed16e;"></b-avatar>
                            </div>

                            <div class="h5 mb-0">
                                {{ data.totalCount || 0 | numFormat }}</div>
                            <div class="small">users</div>
                        </b-col>

                    </b-row>
                </b-card>
            </b-col>
            <b-col v-for="(item, index) in data.aggregatedData || []" :key="index" cols="auto" lg="">
                <b-card class=" text-center card-item">
                    <b-row>
                        <b-col>
                            <div class="d-flex align-items-center justify-content-center mb-2">
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

                            <div><span class="h5 mb-0  "> {{ item.count || 0 | numFormat }} </span></div>
                            <div class="small">users</div>
                        </b-col>
                    </b-row>


                </b-card>
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

}

.card-item {
    border: 0px;
    border-radius: 15px;
}

.card-item {
    border: 0px;
}

.boxlist-card {

    border: 0px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
    border-radius: 15px;
    /* height: 100px; */
}
</style>