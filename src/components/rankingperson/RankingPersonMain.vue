<template>
  <div>
    <div class="container">
    <div class="h2 bold text-left mt-3 mt-md-4">Person Ranking</div>
    <RankingFilter v-model="filters" @input="onFilterReady" />

    <template v-if="isReady">
      <PodiumTop3 :from="filters.from" :to="filters.to" :source="filters.source" :names="filters.names"
        :sentiment="filters.sentiment" :limit="10" :refreshSec="0"  :full_text="filters.full_text" />

      <TopUserRanking :from="filters.from" :to="filters.to" :source="filters.source" :sentiment="filters.sentiment"
        :names="filters.names" :limit="filters.limit" :full_text="filters.full_text" />
    </template>
</div>
  </div>
</template>

<script>
import RankingFilter from "@/components/rankingperson/RankingFilter.vue";
import PodiumTop3 from "@/components/rankingperson/PodiumTop3.vue";
import TopUserRanking from "@/components/rankingperson/TopRanking.vue";

export default {
  components: { RankingFilter, PodiumTop3, TopUserRanking },
  data() {
    return {
      // เริ่มด้วย {} หลีกเลี่ยง null เพื่อไม่ชน type check
      filters: {},
      isReady: false,
    };
  },
  methods: {
    onFilterReady(payload) {
      // จะถูกเรียกครั้งแรกจาก RankingFilter.mounted() -> emitFilters()
      this.filters = payload;
      if (!this.isReady) this.isReady = true;
    },
  },
};
</script>
<style scoped>
@media (max-width: 800px) {
  .h2 {
    font-size: 18px
  }
}
</style>