<template>
  <div style="width: 85%" class="m-auto">
        <DateFeed class="mb-3"/>
    <b-row class="box-tw">
      <b-col lg="4" >
        <TopHashFeed class="mb-3"/>
      </b-col>
      <b-col lg="8">
        <WordCloudFeed class="mb-3 text-center" />
      </b-col>
    </b-row>

    <AllPostFeed />
  </div>
</template>

<script>
import AllPostFeed from "@/components/feed/AllPostFeed.vue";
import WordCloudFeed from "@/components/feed/WordCloudFeed.vue";
import TopHashFeed from "@/components/feed/TopHashFeed.vue";
import DateFeed from "@/components/feed/DateFeed.vue";
export default {
  components: {
    AllPostFeed,
    WordCloudFeed,
    TopHashFeed,
    DateFeed
  },
};
</script>

<style scoped>
.box-tw{
  height: auto;
}

</style>