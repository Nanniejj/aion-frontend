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
                    v-if=" topHashtags && topHashtags.length !== 0">
                <span class="h5 font-weight-bold">Top5 Hashtags</span>
                <hr class="mb-0" />
                <div id="top-content" class="text-left">
                    <div
                        class="border-bottom p-3"
                        v-for="(hashtag, k) in topHashtags"
                        :key="k"
                        @click="selectDomain(hashtag.hashtag)"
                    >
                    {{ k + 1 }}. {{ hashtag.hashtag }}
                    <div class="font-weight-normal small text-secondary">
                        {{ hashtag.count | numFormat }} posts
                    </div>
                    </div>
                </div>
                </b-card>
                <b-card v-else>
                <span class="h5 font-weight-bold">Top5 Hashtags</span>
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
import TabPost from '@/components/profile/TabPost.vue';
import ProfileWordCloud from "./_ProfileWordCloud";


export default {
    components: {
        TabPost, ProfileWordCloud
    },
    props: {
        wordcloud_image: {
            type: String,
        },
        topHashtags: {
            type: Array,
            // required: true,
            default: () => [] // ✅ ทั้ง type และ default เป็น Array
        },
        
    },
    computed: {
        wordData() {
            const max = Math.max(...this.dataHashtagCloud.map(w => w.total));
            return this.dataHashtagCloud.map(w => {
                const dominantSentiment = w.count.reduce((maxItem, item) =>
                    item.count > maxItem.count ? item : maxItem
                );
                return {
                    text: w.name,
                    score: w.score,
                    size: Math.round((w.total / max) * 50 + 10),
                    sentiment: dominantSentiment.sentiment,  // ✅ เพิ่ม sentiment ที่เด่นสุด
                    count: dominantSentiment.count
                };
            });
        }
    },
    data() {
        return {
            loading: false,
            dataHashtagCloud:[],
            wordcloud_images: [],
        }
    },
    methods: {
        apiGetProfileHashtagCloud() {
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
                    
                    this.dataHashtagCloud = (response.data.hashtag || []);
                    // this.dataHashtagCloud = (response.data.hashtag || []).slice(0,50);
                    // this.dataWordCloud = response.data.wordcloud;
                    console.log("dataHashtagCloud ====== ",this.dataHashtagCloud);
                    this.calculateScores();
                    this.loading = false;
                })
                .catch((error) => {
                    this.loading = false;
                    console.error(error);
            });
        },
        calculateScores() {
            this.dataHashtagCloud.forEach((word, index) => {
                let pos = 0, neg = 0;

                word.count.forEach(item => {
                if (item.sentiment === 1) pos = item.count;
                else if (item.sentiment === -1) neg = item.count;
                });

                // คำนวณ score แล้วเก็บไว้ใน wordData[index].score
                this.dataHashtagCloud[index].score = pos - neg;
            });

            console.log("Hashtag with score:", this.dataHashtagCloud);
        },
        getWordCloudImage() {
            this.load = true;
            const config = {
                method: "get",
                url: "https://api.cognizata.com/api/v1/getMonitor/",
                params: {
                    query: this.$route.query.uid.replace(/^#/, ''),
                    api_type: "hashtag",
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
            console.log(config.params);
            
            this.axios(config)
            .then((response) => {
                this.wordcloud_images = response.data.wordcloud_images || [];
                console.log('this.wordcloud_images ', this.wordcloud_images);
                this.load = false;
            })
            .catch((error) => {
                this.load = false;
                console.error(error);
            });
        },
    },
    mounted() {
        // this.apiGetProfileHashtagCloud()
        // this.getWordCloudImage();
    }
} 
    
</script>

<style scoped>
.card-body {
    min-height: 32rem;
}
#img-wordcloud{
  width:100% !important;
}
.p-3:hover{
  background: rgb(0 0 0 / 3%);
  cursor: pointer;
}
#box-profile{
    width: 100%;
    height: auto;
    display: block;
    padding: 20px 0px;
    padding-bottom: 0px;
   border-radius: 7px;
   border: 1px solid rgba(0,0,0,0.1);
   /* box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); */
}
.select-sort{
  width: 80%;
}
@media (max-width: 1200px){
.col-lg-8 {
    flex: 0 0 100%;
    max-width: 100%;
}
.col-lg-4 {
   flex: 0 0 100%;
    max-width: 100%;
}

} 
</style>