<template>
    <!-- Card body -->
    <div class="text-center mt-3 pl-lg-3 pr-lg-3">
        <b-row cols="2" class="m-0">
            <b-col md="12" lg="4" class="font-weight-bold px-0 pr-xl-3">
                <vue-element-loading
                    :active="loading"
                    size="80"
                    background-color="rgba(255,255,255, 0.5)"
                    color="#fff"
                    spinner="bar-fade-scale"
                />
                <b-card 
                    id="box-profile" 
                    :body-class="['pt-2']"
                    v-if=" topDomain && topDomain.length !== 0">
                <span class="h5 font-weight-bold">Top5 Domain</span>
                <hr class="mb-0" />
                <div id="top-content" class="text-left">
                    <div
                    class="border-bottom p-3"
                    v-for="(domain, k) in topDomain"
                    :key="k"
                    @click="selectDomain(domain.t_domain)"
                    >
                    {{ k + 1 }}. {{ domain.t_domain }}
                    <div class="font-weight-normal small text-secondary">
                        {{ domain.count | numFormat }} posts
                    </div>
                    </div>
                </div>
                </b-card>
                <b-card v-else>
                <span class="h5 font-weight-bold">Top5 Domain</span>
                <hr class="mb-0" />
                <div class="font-weight-normal text-secondary">
                    <br />
                    ไม่พบข้อมูล
                </div>
                </b-card>
            </b-col>

            <b-col md="12" lg="8" class="font-weight-bold mt-3 mt-xl-0 px-0">
                <vue-element-loading
                    :active="loading"
                    size="80"
                    class="mt-3 mt-xl-0 h-100"
                    background-color="rgba(0,0,0, 0.05)"
                    color="#fff"
                    spinner="bar-fade-scale"
                />
                <div class="text-left">
                    <b-button-group class="mb-2">
                    <b-button :variant="type === 'domain' ? 'info' : 'outline-info'"
                        @click="type = 'domain'" size="sm">
                        <i class="fa fa-pie-chart" aria-hidden="true"></i>
                        Domain
                    </b-button>
                    <b-button :variant="type === 'hashtag' ? 'info' : 'outline-info'"
                        @click="type = 'hashtag'" size="sm">
                        <i class="fa fas fa-hashtag" aria-hidden="true"></i>
                        Hashtag
                    </b-button>
                    </b-button-group>
                </div>
                <apexchart 
                    :key="chartKey"
                    type="pie" 
                    height="450"
                    width="100%"
                    :options="chartOptions" 
                    :series="series"
                />
            </b-col>
            
        </b-row>
        <div class="mt-3"></div>
    </div>
</template>

<script>
import TabPost from "./_TabPost.vue";
import ProfileWordCloud from "./_ProfileWordCloud";
import VueApexCharts from 'vue-apexcharts';
export default {
    components: {
        TabPost,
        ProfileWordCloud,
        VueApexCharts
    },
    props: {
        load: {
            type : Boolean,
            default: false
        },
        wordcloud_image: {
            type: String,
        },
        topDomain: {
            type: Array,
            // required: true,
            default: () => [] // ✅ ทั้ง type และ default เป็น Array
        },
        // wordCloud: {
        //     type: Array,
        //     required: true,
        //     default: () => [] // ✅ ทั้ง type และ default เป็น Array
        // }
    },
 
    data() {
        return {
            dm: "",
            type:'domain',
            chartKey: 0, // เปลี่ยน key เมื่ออยากให้กราฟ re-render
            loading: true,
            getLoadingStatus2: false,
            dataWordCloud: [],
            wordcloud_images: [],
            series: [],
            chartOptions: {
                labels: [],
                toolbar: {
                    show: false
                },
                legend: {
                    // show: false
                    position: 'bottom'
                },
                chart: {
                    toolbar: {
                        show: true, // ✅ เปิด toolbar
                        tools: {
                        download: true, // ✅ เปิดปุ่มดาวน์โหลด
                        selection: false,
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                        reset: false
                        }
                    }
                },
                colors:["#e6ba59","#40A578","#725CAD","#F075AA","#368ab6","#ea7668","#9ABF80","#71C0BB","#34495e"],
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 300
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            }
        };
    },
    methods: {
        selectDomain(domain) {
           this.$emit('update-keyword', domain) 
        },
        getWordCloudImage() {
            this.loading = true;
            const config = {
                method: "get",
                url: "https://api.cognizata.com/api/v1/getMonitor/",
                params: {
                    query: this.$route.query.uid,
                    api_type: "account",
                    top_type: "domain",
                    // type: this.$route.query.type,
                    // source: this.$route.query.source,
                    // id: this.$route.query.id,
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };
            console.log("word ",this.loading);
            
            this.axios(config)
            .then((response) => {
                this.wordcloud_images = response.data.wordcloud_images || [];
                console.log('this.wordcloud_images ', this.wordcloud_images);
                this.loading = false;
            })
            .catch((error) => {
                this.loading = false;
                console.error(error);
            });
        },
        apiGetProfileWordCloud() {
            this.loading = true;
            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/monitor/getProfileWordCloud",
                params: {
                    type: this.$route.query.type,
                    source: this.$route.query.source,
                    id: this.$route.query.id,
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            this.axios(config)
                .then((response) => {
                    
                    // this.dataWordCloud = (response.data.wordcloud || []);
                    this.dataWordCloud = (response.data.wordcloud || []).slice(0,50);
                    // this.dataWordCloud = response.data.wordcloud;
                    console.log("dataWordCloud ====== ", this.dataWordCloud);
                    this.calculateScores();
                    this.loading = false;
                })
                .catch((error) => {
                    this.loading = false;
                    console.error(error);
                });
        },
        calculateScores() {
            this.dataWordCloud.forEach((word, index) => {
                let pos = 0, neg = 0;

                word.count.forEach(item => {
                if (item.sentiment === 1) pos = item.count;
                else if (item.sentiment === -1) neg = item.count;
                });

                // คำนวณ score แล้วเก็บไว้ใน wordData[index].score
                this.dataWordCloud[index].score = pos - neg;
            });

            console.log("wordData with score:", this.dataWordCloud);
        },
        updateChartFromTopDomain() {
            if (this.topDomain && this.topDomain.length > 0) {
                this.series = this.topDomain.map(item => item.count);
                this.chartOptions = {
                ...this.chartOptions,
                labels: this.topDomain.map(item => item.t_domain)
                };
                this.chartKey += 1; // 🔁 Trigger render
            } else {
                this.series = [];
                this.chartOptions = {
                ...this.chartOptions,
                labels: []
                };
                this.chartKey += 1; // 🔁 Trigger render
            }
        }
        
    },
    
    watch: {
        topDomain: {
            handler() {
            this.updateChartFromTopDomain(); // อัปเดตเมื่อ topDomain เปลี่ยน
            },
            immediate: true, // ✅ ให้รันทันทีตอนเริ่มด้วย
            deep: true
        }
    },
    mounted() {
        this.loading = this.load
        // this.updateChartFromTopDomain();
        // this.apiGetProfileWordCloud();
        // this.getWordCloudImage();
    }
};
</script>

<style scoped>
.card-body {
  /* min-height: 32rem; */
}
#img-wordcloud {
  width: 100% !important;
}
.p-3:hover {
  background: rgb(0 0 0 / 3%);
  cursor: pointer;
}
#box-profile {
  width: 100%;
  height: 100%;
  display: block;
  /* margin-top: 1rem; */
  /* padding: 20px 0px; */
  padding-bottom: 0px;
  border-radius: 7px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  /* box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); */
}
.select-sort {
  width: 80%;
}
@media (max-width: 1200px) {
  .col-lg-8 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  .col-lg-4 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  @media only screen and (min-width: 0px) and (max-width: 600px) {
    .card-body {
      min-height: auto !important;
    }
  }
}
</style>