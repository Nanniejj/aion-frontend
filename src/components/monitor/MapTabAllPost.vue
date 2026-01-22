<template lang="">
  <div>
    <div >
      <MapStatic/>
    </div>
    <MapLocationPost />
  </div>
</template>
<script>
import MapStatic from "./MapStatic.vue";
import MapLocationPost from "./MapLocationPost.vue";

export default {
  components: {
    MapLocationPost,MapStatic
  },
};
</script>
<style scoped>
  .container {
    width: 100%;
    padding-right: 0px;
    padding-left: 0px;
  }
</style>
