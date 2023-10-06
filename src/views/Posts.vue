<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
    <div id="content">
    <Post />
    </div>
  </div>
</template>
<script>
import Post from "../components/post/Post.vue";
import HomeNav from '@/components/HomeNav.vue';
export default {
  components: {
    Post,HomeNav
  },
};
</script>
<style>
#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
  padding-bottom: 40px;
}
#navHome {
  z-index: 1;
}

</style>
