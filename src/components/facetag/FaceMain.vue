<template lang="">
  <div>
    <b-container class="mt-2">
      <!-- <StepDetect class="mb-3"/> -->
      <div class="text-right mb-3">
        <b-button
          v-show="showAddFace == false"
          @click="toAddFace"
          variant="warning"
        >
          <i class="fas fa-plus"></i> เพิ่มภาพใบหน้า</b-button
        >
      </div>
      <DropZone v-if="showAddFace == true" />
      <FaceTable v-if="showAddFace == false" class="d-none"/>
    </b-container>
  </div>
</template>
<script>
import DropZone from "@/components/facetag/DropZone.vue";
import StepDetect from "@/components/facetag/StepDetect.vue";
import FaceTable from "./FaceTable.vue";
export default {
  components: {
    DropZone,
    StepDetect,
    FaceTable,
  },
  data() {
    return {
      showAddFace: false,
    };
  },
methods: {
    toAddFace(){
    
        this.showAddFace = !this.showAddFace

    }
},
  mounted() {
    this.$emitter.on("closeAddFace", (val) => {
      this.showAddFace = val;
    });
  },
};
</script>
<style scoped>
.btn-warning {
  color: #fff;
  background-color: #4c412d;
  border-color: #4c412d;
  box-shadow: 1px 1px 3px #666666;
}
</style>
