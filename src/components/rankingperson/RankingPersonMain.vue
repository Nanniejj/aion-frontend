<template>
  <div>
    <RankingFilter v-model="filters" @input="onFilterReady" />

    <template v-if="isReady">
      <PodiumTop3
        :from="filters.from"
        :to="filters.to"
        :source="filters.source"      
        :names="filters.names"
        :sentiment="filters.sentiment"
        :limit="filters.limit"
        :refreshSec="0"
      />

      <TopUserRanking
        :from="filters.from"
        :to="filters.to"
        :source="filters.source"      
        :sentiment="filters.sentiment"
        :names="filters.names"
        :limit="filters.limit"
      />
    </template>
   
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
