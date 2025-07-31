<template>
    <!-- Card body -->
    <div class="text-center mt-3 pl-lg-3 pr-lg-3">
        <b-row class="m-0">
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
                <b-card v-if="!wordcloud_image && !loading">
                    <span class="h5 font-weight-bold">WordCloud</span>
                    <hr class="">
                    <div class="font-weight-normal">
                        <br>
                        ไม่พบข้อมูล
                    </div>
                </b-card>
                <ProfileWordCloud 
                    v-else
                    :wordcloud_image="wordcloud_image"
                    :words="wordData" 
                    :width="600" 
                    :height="400" 
                />
            </b-col>
            <!-- <b-col md="12" lg="12" class="font-weight-bold mb-5">
                <div
                    class="scrollable-body pl-2"
                    style="max-height: 500px;"
                    >
                    <TabPost />
                </div>
            </b-col> -->
        </b-row>
        <div class="mt-3"></div>
    </div>
</template>

<script>
import TabPost from "./_TabPost.vue";
import ProfileWordCloud from "./_ProfileWordCloud";
export default {
    components: {
        TabPost,
        ProfileWordCloud,
    },
    props: {
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
            loading: false,
            getLoadingStatus2: false,
            dataWordCloud: [],
            wordcloud_images: [],
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
        
    },
    computed: {
        wordData() {
            const max = Math.max(...this.dataWordCloud.map(w => w.total));

            const minSize = 10;
            const maxSize = 80;
            
            const scale = (value) => {
                return Math.round((value / max) * (maxSize - minSize) + minSize);
            };

            return this.dataWordCloud.map(w => {
                const dominantSentiment = w.count.reduce((maxItem, item) =>
                item.count > maxItem.count ? item : maxItem
                );

                return {
                    text: w.name,
                    score: w.score,
                    size: scale(w.total), // ✅ ขนาดอยู่ในช่วง 20-80px ตามค่า total
                    sentiment: dominantSentiment.sentiment,
                    count: dominantSentiment.count
                };
            });
        }
    },
    mounted() {
       
        // this.apiGetProfileWordCloud();
        // this.getWordCloudImage();
    }
};
</script>

<style scoped>
.card-body {
  min-height: 32rem;
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