<template lang="">
    <div class="px-5">
        
    <div class="my-3  ">
       <div class="text-left">
      <span class="h5 mr-3 d-inline-block">TOP 10 <span class="h6">Wordcloud / Hashtagcloud</span></span></div>
        <!-- {{getWordCloud.data.wordcloud.data}} -->
        <b-row class="px-3">
            <b-col>
         
                <div v-if="getWordCloud.data&&getWordCloud.data.wordcloud&&getWordCloud.data.wordcloud.data">
                    <div v-for="( word,k ) in getWordCloud.data.wordcloud.data.slice(0,10)" class="my-2">
                      <b-button block  pill variant="warning" > {{word.name}} <span class="small"> ({{word.total | numFormat}})</span></b-button> 
                    </div>
                    
                </div>
            </b-col>
             <b-col>
                <div v-if="getWordCloud.data&&getWordCloud.data.hashtag&&getWordCloud.data.hashtag.data">
                    <div v-for="( word,k ) in getWordCloud.data.hashtag.data.slice(0,10)" class="my-2">
                       <b-button block  pill variant="warning"> {{word.name}} <span class="small"> ({{word.total | numFormat}})</span></b-button> 
                    </div>
                    
                </div>
                 
            </b-col>
        </b-row>
    </div></div>
</template>
<script>
import { mapGetters } from "vuex";
export default {

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
            "getClickDomainId"
        ]),
    }
}
</script>
<style>
.btn-warning {
    color: #3b3838;
    background-color: #fdf4db;
    border-color: #ffce61;
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