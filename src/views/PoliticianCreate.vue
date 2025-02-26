<!-- หน้านี้ไม่ได้ใช้แล้ว กลายเป็น pop up แทน -->
<template>
    <div>
      <HomeNav />
      <CreateCandidatesHead />
      <CreateCandidatesPosts />
    </div>
  </template>
  
  <script>
  import HomeNav from "@/components/HomeNav.vue";
  import CreateCandidatesHead from "@/components/politician/CreateCandidatesHead.vue";
  import CreateCandidatesPosts from "@/components/politician/CreateCandidatesPost.vue";
  
  export default {
    name: "CreateCandidates",
    components: {
      HomeNav,
      CreateCandidatesHead,
      CreateCandidatesPosts
    },
    data() {
      return {
        
      };
    },
  };
  </script>
  