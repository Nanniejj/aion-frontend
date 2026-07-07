<template>
  <div>
    <!-- 
      ครอบ component โพสต์ (เอกสารที่ 1) ไว้ในหน้าเปล่าๆ หน้าเดียว
      สำหรับเปิดในแท็บใหม่จาก wordcloud โดยเฉพาะ
      ⚠️ แก้ import path/ชื่อ component ด้านล่างให้ตรงกับไฟล์จริงของคุณ (เอกสารที่ 1)
      b-con
    -->
      <b-container>
        <back-to-top bottom="50px" right="50px">
          <button type="button" class="btn btn-to-top">
            <i class="fa fa-chevron-up"></i>
          </button>
        </back-to-top>
    <WordcloudPost :query-search="querySearchProp" class="mt-3" />
        </b-container>
  </div>
</template>

<script>
// ⚠️ ปรับ path นี้ให้ตรงกับตำแหน่งไฟล์จริงของ component ในเอกสารที่ 1
import WordcloudPost from "@/components/domain/WordcloudPost.vue"; // ปรับ path ให้ตรงกับที่คุณวางไฟล์จริง
export default {
  name: "WordcloudPage",
  components: { WordcloudPost },
  computed: {
    // ✅ รองรับทั้ง 2 แบบ: word -> querySearch, hashtag -> hashtags
    // ถ้าเป็น hashtag จะเติม "#" นำหน้าให้ เพราะ logic เดิมใน component โพสต์
    // (isHashtag = rawKeyword.startsWith("#")) ใช้ตัวนี้แยกว่าเป็น hashtag หรือ keyword
    querySearchProp() {
      const { hashtags, querySearch } = this.$route.query;
      if (hashtags) return "#" + hashtags;
      return querySearch || "";
    },
  },
};
</script>

<style scoped>
#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
}

</style>