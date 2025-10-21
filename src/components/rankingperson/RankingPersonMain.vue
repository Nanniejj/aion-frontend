<template>
  <div>
    <!-- ให้ RankingFilter ทำงานแบบ v-model (Vue 2 ใช้ prop:value + @input) -->
    <RankingFilter v-model="filters" />

    <!-- ส่งค่าไปยังลูก ๆ ตามต้องการ -->
    <PodiumTop3
      :from="filters.from"
      :to="filters.to"
      :source="filters.sourceOne"   
      :names="filters.names"
      :sentiment="filters.sentiment"
      :limit="filters.limit"
      :refreshSec="0"
    />

    <!-- <TopRankingTable :filters="filters" /> -->

    <!-- หรือส่งแยกเป็น props ให้ TopUserRanking -->
    <TopUserRanking
      :from="filters.from"
      :to="filters.to"
      :source="filters.sourceOne"
      :sentiment="filters.sentiment"
      :names="filters.names"
      :limit="filters.limit"
    />
  </div>
</template>

<script>
import RankingFilter from "@/components/rankingperson/RankingFilter.vue";
import TopRankingTable from "@/components/rankingperson/TopRankingTable.vue";
import PodiumTop3 from "@/components/rankingperson/PodiumTop3.vue";
import TopUserRanking from "@/components/rankingperson/TopRanking.vue";

export default {
  components: { RankingFilter, TopRankingTable, PodiumTop3, TopUserRanking },
  data() {
    return {
      // ค่าตั้งต้น (จะถูกอัปเดตเมื่อ RankingFilter เปลี่ยน)
      filters: {
      from: '2025-10-01T00:00:00.000Z',
      to: '2025-10-01T23:59:59.999Z',
        source: [null],           
        sourceOne: 'facebook',   
      sentiment: [-1, 0, 1],   
       names: [],
        limit: 20,
        sort_by: 'recent'
      }
    }
  }
}
</script>
