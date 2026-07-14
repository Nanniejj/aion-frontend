<template>
  <div class="px-1 ">
    <div class="text-left">
      <span class="h5 mr-3 d-inline-block">Wordcloud / Hashtagcloud</span>
{{ getSdateDm }} {{ getEdateDm }} {{ setArrDate }}
      <div v-if="start && end" class="d-inline-block">
        <div v-if="startd === endd" class="text-left onedate">
          <i class="far fa-calendar-alt"></i> {{ startd }}
        </div>
        <div v-else class="text-left twodate">
          <i class="far fa-calendar-alt"></i> {{ startd }} - {{ endd }}
        </div>
      </div>
    </div>

    <div class="mt-1 mb-1 ">
      <!-- {{getNamePlatform}} -->
      <!-- ✅ component นี้ไม่ยิง API เองแล้ว — รับ data/isLoading/error มาจาก parent ล้วนๆ
           parent ยิง API ที่ไหนก็ได้ แล้วส่ง response เข้ามาตรงนี้ -->
      <WordCloudD3 :data="data" :is-loading="isLoading" :error="error" :limit="limit" :min-font="minFont"
        :max-font="maxFont" :letter-spacing="letterSpacing" :disable-rotate="disableRotate"
        :active-tab="activeTabMobile" :storage-key="storageKey" @select="onSelectWord"
        @exclude="$emit('exclude', $event)" @exclude-reset="$emit('exclude-reset', $event)" @retry="$emit('retry')" />
    </div>
  </div>
</template>

<script>
import moment from "moment";
import WordCloudD3 from "./WordCloudD3.vue";
import { mapGetters } from "vuex";
import { del } from "vue";
export default {
  name: "Wordcloud",

  components: {
    WordCloudD3,
  },

  props: {
    // ✅ ข้อมูลจาก API — parent ยิงเองแล้วส่งเข้ามา (เหมือน response เดิมของ getWordCloud)
    data: { type: [Object, Array], default: null },
    isLoading: { type: Boolean, default: false },
    error: { type: String, default: "" },

    // ✅ แค่ไว้โชว์ช่วงวันที่ด้านบน + ใช้ต่อ query ตอนเปิดแท็บโพสต์ใหม่ด้วย
    start: { type: String, default: "" },
    end: { type: String, default: "" },

    activeTab: {
      type: String,
      default: "word",
    },

    limit: { type: Number, default: 40 },
    minFont: { type: Number, default: 20 },
    maxFont: { type: Number, default: 130 },
    letterSpacing: { type: Number, default: 1.6 },
    disableRotate: { type: Boolean, default: true },

    // ✅ ใช้แยก namespace คำที่ถูกซ่อนไว้ (localStorage) เวลาเอา component นี้ไปใช้หลายที่/หลาย context
    storageKey: { type: String, default: "default" },

    // ✅ ชื่อ route ปลายทางของหน้าแสดงโพสต์ (เผื่อแต่ละที่ที่เอา Wordcloud ไปใช้ อยากชี้ไปคนละหน้า)
    postRouteName: { type: String, default: "WordCloudPage" },
  },

  data() {
    return {
      // ✅ คุมว่ามือถือโชว์ฝั่งไหน: "word" | "hash" — ใช้ prop activeTab เป็นค่าเริ่มต้น
      //    ไม่มีผลกับ desktop (WordCloudD3 ใช้ d-lg-block โชว์คู่กันเสมอ)
      activeTabMobile: this.activeTab || "word",
    };
  },
  destroyed() {
    this.$store.commit('setDataWordcloud', [])
    this.$store.commit('setLoadDataWordcloud', false)
  },
  computed: {
    ...mapGetters(["getClickDomain", "getSdateDm","setArrDate", "getEdateDm", "getClickDomainId", "getSourceNews", "getNamePlatform"]),

    startd() {
      return String(this.start).slice(0, 10);
    },
    endd() {
      return String(this.end).slice(0, 10);
    },
  },

  watch: {
    // ✅ ถ้า parent เปลี่ยน prop activeTab จากภายนอก ให้ sync เข้ามาที่ state ภายในด้วย
    activeTab(val) {
      if (val && val !== this.activeTabMobile) this.activeTabMobile = val;
    },
  },

  methods: {
    onSelectWord({ kind, text, data }) {
      const fallback = data?.name ?? data?.text ?? data?.key ?? "";
      const word = (text || fallback).toString().trim();
      if (!word) return;

      this.openPostTab(kind, word);

      this.$emit("select", word);
    },

    openPostTab(kind, word) {
      const isTag = kind === "tags";

      // ✅ ใช้วันที่ตาม filter ปัจจุบัน (prop start/end ที่ parent ส่งเข้ามา)
      //    fallback เป็นย้อนหลัง 7 วันถึงวันนี้ เฉพาะกรณีไม่มีค่า filter ส่งมา
      const hasFilterRange = this.start && this.end;
      const filterStart = hasFilterRange ? moment(this.start) : moment().subtract(6, "days");
      const filterEnd = hasFilterRange ? moment(this.end) : moment();

      const sdate = filterStart.format("YYYY-MM-DD") + "T00:00:00";
      const edate = filterEnd.format("YYYY-MM-DD") + "T23:59:59";

      let source = this.getNamePlatform == "all" ? "news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads,telegram" : this.getNamePlatform || "";
      const query = {
        // ✅ word -> querySearch , hashtag -> hashtags (ไม่ต้องมี # นำหน้า)
        ...(isTag
          ? { hashtags: word.replace(/^#/, "") }
          : { querySearch: word }),

        // ✅ พารามเดิมติดไปด้วยทั้งหมดตามที่ต้องการ
        domain_id: this.getClickDomainId || "",

        start: this.getSdateDm || sdate || "",
        end: this.getEdateDm || edate || "",
        source_news: this.getSourceNews || "",
        source: source,
        // monitor: this.$route?.query?.monitor || "",
      };
      console.log("openPostTab query", query, this.getClickDomainId, this.getSdateDm, this.getEdateDm, this.getSourceNews, this.getNamePlatform);


      if (this.$route?.query?.monitor) {
        query.monitor = this.$route.query.monitor;

      }
      if (this.$route?.query?.type) {
        query.type = this.$route.query.type;
        if (this.$route.query.type == "targetlist") {
          console.log(this.$route.query.type);

          query.account = this.$route.query.id;
        }
        // delete query.start;
        // delete query.end;

      }
      // if (this.$route?.query?.start) {
      //   query.start = this.getSdateDm || this.sdate || "",
      //   query.end = this.getEdateDm || this.edate || ""
      // }else {
      //   query.start = this.sdate || "",
      //   query.end = this.edate || ""
      //   console.log('query.start ',query.start,this.edate  );
      // }

      if (this.$route?.query?.id) {
        query.id = this.$route.query.id;

      }
      // ตัด key ที่ค่าว่างทิ้ง กัน URL รก
      Object.keys(query).forEach((k) => {
        if (query[k] === "" || query[k] == null) delete query[k];
      });

      const routeData = this.$router.resolve({
        name: "WordcloudPage",
        query,
      });



      window.open(routeData.href, "_blank");


    },
  },
};
</script>

<style scoped>
.card-tt {
  width: fit-content;
  padding: 3px 15px;
  border-radius: 7px;
  box-shadow: 0 3px 4px 0 rgb(0 0 0 / 20%);
  background: #fbf7f6;
  /* font-family: "Kanit", "TH Sarabun New", sans-serif; */
}

.box-domain {
  width: 100%;
  height: auto;
  padding: 20px 0px;
  border-radius: 7px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>