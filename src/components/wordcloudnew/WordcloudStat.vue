<template>
    <div>
        <div class="text-left">
            <div class="h5">
                {{ words }}
                <!-- <span class="small" v-if="getWordCloudStartDate">{{ getWordCloudStartDate.split('T')[0] }}</span> -->
                <span class="small float-right" v-if="getWordCloudStartDate">
                    <i class="fa fa-calendar" />
                    <span v-if="getWordCloudStartDate == getWordCloudStartDate"> {{ getWordCloudStartDate.split('T')[0]
                    }}
                    </span>
                    <span v-else> {{ getWordCloudStartDate.split('T')[0] }} - {{ getWordCloudStartDate.split('T')[0] }}
                    </span>
                </span>
                <hr>

            </div>
            <div>
                <span class="h5 mr-3 d-inline-block">Statics <span class="h6"></span></span>
            </div>
        </div>

        {{ getWordCloudDomain }}
        {{ getWordCloudStartDate }}{{ getWordCloudEndDate }}
        {{ data }} {{ dataSentiment }}
        <Sentimentv2 :chartData="dataSentiment" v-if="dataSentiment" />
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import Sentimentv2 from "../chart/Sentimentv2.vue";
export default {
    components: {
        Sentimentv2
    },
    props: {
        words: { type: String, default: "" }
    },
    watch: {
        words(name) {
            console.log(name);
            let payload = {
                start_date: this.getWordCloudStartDate,
                end_date: this.getWordCloudEndDate,
                monitor: this.getSelectedMonitor,
                querySearch: name,
                domain: this.getWordCloudDomain,
                source: this.platform

                // domain:this.
            }
            console.log('payload', payload);

            this.fetchSentiment(payload)

        }
    },
    computed: {
        ...mapGetters([
            "getClickDomain",
            "getWordCloud",
            "getWordCloudImg",
            "getWordCloudHash",
            "getLoadWordCloud",
            "getSdateDm",
            "getEdateDm",
            "getArrDate",
            "getClickDomainId",
            "getWordCloudStartDate",
            "getWordCloudEndDate",
            "getSelectedMonitor",
            "getWordCloudDomain"
        ]),
    },
    data() {
        return {
            platform: 'news,twitter,facebook,youtube,blockdit,instagram,pantip,threads,tiktok',
            data: null,
            dataSentiment: null,
        }
    },
    methods: {
        async fetchSentiment(payload) {
            try {
                const params = new URLSearchParams();

                // API ใช้ชื่อพารามฯ start/end
                params.set("start", payload.start_date);
                params.set("end", payload.end_date);

                if (payload?.monitor) params.set("monitor", payload.monitor);

                if (payload?.domain && payload.domain.length) {
                    // ถ้าเป็น array จะ join เป็น comma
                    params.set(
                        "domain",
                        Array.isArray(payload.domain) ? payload.domain.join(",") : payload.domain
                    );
                }

                // ถ้าขึ้นต้นด้วย # ให้ใช้ hashtag แทน querySearch
                const q = (payload?.querySearch || "").trim();
                if (q) {
                    if (q.startsWith("#")) {
                        params.set("hashtag", q.replace(/^#+/, "")); // ตัด # ออก
                    } else {
                        params.set("querySearch", q);
                    }
                }

                if (payload?.source) params.set("source", payload.source);

                const response = await this.axios.get(
                    "https://api2.cognizata.com/api/v2/userposts/getSentimentStat",
                    {
                        params,
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                            "Content-Type": "application/json",
                        },
                    }
                );

                const res = Array.isArray(response.data) ? response.data[0] || {} : {};

                const all = {
                    negative: res.negativeSentiment || 0,
                    neutral: res.neutralSentiment || 0,
                    positive: res.positiveSentiment || 0,
                };
                this.dataSentiment = all
                return {
                    sentiment: all,
                    detail: res,
                    raw: response.data,
                };
            } catch (err) {
                console.error("fetchSentiment error:", err);
                throw err;
            }
        },
    },
}

</script>
<style></style>