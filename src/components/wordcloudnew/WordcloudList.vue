<template>
    <div class="px-1 px-lg-5">
        <div class="my-3">
            <div class="text-left">
                <span class="h5 mr-3 d-inline-block">TOP 10 <span class="h6 d-none">Wordcloud /
                        Hashtagcloud</span></span>
                <span class="small text-grey">(จำนวนครั้งที่พบ)</span>
            </div>

            <b-row class="px-3">
                <b-col cols="12" md="6">
                     <div class="h6 text-left mt-2">Wordcloud</div>
                    <SentimentTopChart :chartData="getWordCloud.data.wordcloud.data.slice(0, 10)"
                        v-if="getWordCloud.data && getWordCloud.data.wordcloud && getWordCloud.data.wordcloud.data" />
                    <!-- <div class="h6 text-left mt-2">Wordcloud</div> -->
                    <div v-if="getWordCloud.data && getWordCloud.data.wordcloud && getWordCloud.data.wordcloud.data">
                        <div v-for="(word, k) in getWordCloud.data.wordcloud.data.slice(0, 10)" :key="'w-' + k"
                            class="my-2">
                            <b-button block pill variant="warning" :pressed="keyword === word.name" size=""
                                @click="clickWord(word, getWordCloud.data.wordcloud.data.slice(0, 10))">
                                <span class="label-clip"> {{ word.name }} </span>
                                <span class="small"> ({{ word.total | numFormat }})</span>
                            </b-button>
                        </div>
                    </div>
                </b-col>

                <b-col cols="12" md="6">
                    <div class="h6 text-left mt-2">Hashtagcloud</div>
                    <SentimentTopChart :chartData="getWordCloud.data.hashtag.data.slice(0, 10)"
                        v-if="getWordCloud.data && getWordCloud.data.hashtag && getWordCloud.data.hashtag.data" />

                    <div v-if="getWordCloud.data && getWordCloud.data.hashtag && getWordCloud.data.hashtag.data">
                        <div v-for="(word, k) in getWordCloud.data.hashtag.data.slice(0, 10)" :key="'h-' + k"
                            class="my-2">
                            <b-button block pill variant="warning" :pressed="keyword === word.name"
                                @click="clickWord(word, getWordCloud.data.hashtag.data.slice(0, 10))">
                                <span class="label-clip"> {{ word.name }}</span>
                                <span class="small"> ({{ word.total | numFormat }})</span>
                            </b-button>
                        </div>
                    </div>
                </b-col>
                <b-col cols="12" md="4">

                </b-col>
            </b-row>
        </div>

        <WordcloudStat :words="keyword" v-if="keyword" />


    </div>
</template>

<script>
import { mapGetters } from "vuex";
import WordcloudStat from "./WordcloudStat";
import SentimentTopChart from "./SentimentTopChart";

export default {
    components: {
        WordcloudStat,
        SentimentTopChart
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
            "getSelectedMonitor"
        ]),
    },
    data() {
        return {
            keyword: "",
            dataFromAPI: ""
        }
    },
    methods: {
        clickWord(word, data) {
             this.$emitter.emit("sendKeyword", word.name);
            this.keyword = (this.keyword === word.name) ? "" : word.name;
            this.dataFromAPI = data
            // this.$store.dispatch("fetchSentiment2", {
            //     start_date: this.getWordCloudStartDate,
            //     end_date: this.getWordCloudEndDate,
            //     //keywords: this.getKeywords,
            //     // domain: domainarr,
            //     querySearch: word.name,
            //     monitor: this.getSelectedMonitor,
            //     //social: x,
            //     // social:this.socialname
            // });
        }
    }
}
</script>
<style>
.label-clip {
    display: inline-block;
    max-width: 90%;
    /* ปรับตามดีไซน์ */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: bottom;
}

.btn-warning {
    color: #3b3838;
    background-color: #fcf0d2;
    border-color: #ffce61;
}

.btn-warning:hover {
    color: #212529;
    background-color: #fed16e;
    border-color: #fed16e;
}

.btn-warning:not(:disabled):not(.disabled).active,
.btn-warning:not(:disabled):not(.disabled):active,
.show>.btn-warning.dropdown-toggle {
    background-color: #fed16e !important;
    border-color: #fed16e;
}

.box-domain {
    width: 100%;
    height: auto;
    padding: 20px 0px;
    border-radius: 7px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>