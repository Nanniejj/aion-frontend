<template >
    <div class="ml-lg-5 mr-lg-5 ml-md-3 mr-md-3 ml-sm-3 mr-sm-3 p-3">
        <WordcloudMenu/>
        <WordcloudImg/>
        <WordcloudList/>
        <WordPost/>
    </div>
</template>
<script>
import WordcloudMenu from "./WordcloudMenu";
import WordcloudImg from "./WordcloudImg";
import WordcloudList from "./WordcloudList";
import WordPost from "./WordPost";
export default {
    components:{
        WordcloudMenu,WordcloudImg,WordcloudList,WordPost
    }
}
</script>
<style >
    
</style>