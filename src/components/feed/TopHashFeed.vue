<template>
  <div>
      <!-- {{getWordCloud.data.hashtag.data.length}}
      {{getLoadFeedWC}} -->
    <b-card id="box-profile" v-if="getWordCloud.data&&getWordCloud.data.hashtag" class="flex-fill">
      <vue-element-loading
        :active="getLoadFeedWC"
        size="80"
        background-color="rgba(255, 255, 255, 0.3)"
        color="#fbf7f6"
      />
      <span class="h5 font-weight-bold">Top5 Hashtag</span>
      <hr class="mb-0" />
      <!-- {{getHashtagFeed}} -->
      <div id="top-content" class="text-left" v-if="getWordCloud.data.hashtag.data.length">
         <div
          class="border-bottom p-3"
          @click="selectHashtag('')"
        >
        All Posts
        </div>
        <div
          class="border-bottom p-3"
          v-for="(topHashtag, k) in getWordCloud.data.hashtag.data.slice(0, 5)"
          :key="k"
          @click="selectHashtag(topHashtag.name)"
        >
          {{ k + 1 }} {{ topHashtag.name }}  
          <span class="small float-right">{{ topHashtag.total }} posts</span>
        </div>
       

      </div>
      <div class="font-weight-normal" v-else>
        <br />
        ไม่พบข้อมูล
      </div>
    </b-card>
    <b-card v-else>
      <vue-element-loading
        :active="getLoadFeedWC"
        size="80"
        background-color="rgba(255, 255, 255, 0.3)"
        color="#fbf7f6"
      />
      <span class="h5 font-weight-bold">Top5 Hashtag</span>
      <hr class="mb-0" />
      <div class="font-weight-normal">
        <br />
        Loading...
      </div>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
 computed: {
    ...mapGetters(["getWordCloud","getLoadFeedWC","getHashtagFeed"]),
    },
    data() {
        return {
            topHash:""
        }
    },
  methods:{
    selectHashtag(hashtag){
      this.$store.commit("setHashtagFeed",hashtag.replace("#",""))
    }
  }
};
</script>

<style scoped>
.card-body {
    min-height: 32rem;
    
}
.border-bottom{
  cursor: pointer;
}
.border-bottom:hover{
background-color: rgba(122, 157, 201, 0.2);
}
#box-profile{
  width: 100%;
    display: flex;
    padding-bottom: 0px;
   border-radius: 7px;
   border: 1px solid rgba(0,0,0,0.1);
   /* box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); */
}

@media only screen and (min-width: 0px) and (max-width: 600px)
{
.card-body{
    min-height: auto !important;
}}
</style>