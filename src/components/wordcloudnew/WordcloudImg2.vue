<!-- wordcloud new -->
<template>
  <div class="px-1 px-lg-5">

    <div class="text-left">
      <span class="h5 mr-3 d-inline-block">Wordcloud / Hashtagcloud</span>
      <div class="d-inline-block">
        <div v-if="startd === endd" class="text-left onedate">
          <i class="far fa-calendar-alt"></i> {{ startd }}
        </div>
        <div v-else class="text-left twodate">
          <i class="far fa-calendar-alt"></i> {{ startd }} - {{ endd }}
        </div>
      </div>
    </div>

    <div class="mt-3 mb-3">
      <b-row class="w-100">
        <b-col class="text-left" lg="12">

          <!-- ✅ component ยิง API ของตัวเอง โดยรับ filter (start/end/domain_id/monitor)
               มาจาก WordcloudMenu ผ่าน $route.query -->
          <WordCloudD3
            :token="token"
            :domain-id="domainId"
            :start="start"
            :end="end"
            :monitor="monitor"
            :limit="50"
            :min-font="20"
            :max-font="180"
            :disableRotate="false"
            @select="onSelectWord"
          />
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import WordCloudD3 from "./WordCloudD3.vue";

export default {
  components: { WordCloudD3 },
  props: {
    // ✅ รับ filter ตรงจาก parent ก็ได้ (เช่น WordcloudImg3 ที่ฟัง filters-changed)
    activeTab: { type: String, default: "word" },
  },
  computed: {
    token() {
      return localStorage.getItem("token") || "";
    },

    // ✅ ดึงค่าจาก query string ที่ WordcloudMenu set ไว้ตอนกด "ค้นหา"
    domainId() {
      const q = this.$route.query.domain_id;
      return q && q !== "" ? q : 1;
    },
    start() {
      return this.$route.query.start || this.todayStart;
    },
    end() {
      return this.$route.query.end || this.todayEnd;
    },
    monitor() {
      return this.$route.query.monitor || "";
    },

    startd() {
      return String(this.start).slice(0, 10);
    },
    endd() {
      return String(this.end).slice(0, 10);
    },
  },
  data() {
    return {
      todayStart: "",
      todayEnd: "",
    };
  },
  mounted() {
    this.todayStart = moment(new Date()).format().slice(0, 10) + "T00:00:00";
    this.todayEnd = moment(new Date()).format().slice(0, 10) + "T23:59:59";
  },
  methods: {
    onSelectWord({ data }) {
      // ✅ ส่งออกเป็นคำ/แฮชแท็ก (string) เหมือนพฤติกรรมเดิม ให้ใช้กับ WordPost ได้ตรง ๆ
      const word = data?.name ?? data?.text ?? data?.key ?? "";
      this.$emit("select", word);
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
  font-family: "Kanit", "TH Sarabun New", sans-serif;
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

.onedate,
.twodate {
  font-family: "Kanit", "TH Sarabun New", sans-serif;
}

@media only screen and (min-width: 0px) and (max-width: 991px) {
}
</style>