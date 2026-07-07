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

    <!-- ✅ Mobile toggle: เลือกดู Words หรือ Hashtags ทีละอัน (desktop ไม่โชว์ ปุ่มนี้ เพราะเห็นคู่กันอยู่แล้ว) -->
    <!-- <div class="d-lg-none mb-2">
      <div class="float-right">
        <b-button-group size="sm" class="btn-group">
          <b-button :variant="activeTabMobile === 'word' ? 'info' : 'outline-info'"
            @click="activeTabMobile = 'word'">
            Words
          </b-button>
          <b-button :variant="activeTabMobile === 'hash' ? 'info' : 'outline-info'"
            @click="activeTabMobile = 'hash'">
            Hashtags
          </b-button>
        </b-button-group>
      </div>
    </div> -->

    <div class="mt-3 mb-3 pa-1">
      <!-- ✅ เรียก API v2 ครั้งเดียวใน component นี้ (fetchWordCloud) แล้วส่ง apiData เดียวกัน
           ลงไปให้ WordCloudD3 ผ่าน external-api-data/external-loading (ไม่เปลี่ยนพฤติกรรมนี้)
           active-tab ควบคุมแค่ฝั่งไหนโชว์บนมือถือ ไม่กระทบการ fetch ใดๆ -->
      <WordCloudD3
        :token="token"
        :domain-id="domainId"
        :start="start"
        :end="end"
        :monitor="monitor"
        :limit="40"
        :min-font="20"
        :max-font="130"
        :letter-spacing="1.6" 
        :disableRotate="true"
        :active-tab="activeTabMobile"
        :external-api-data="(externalApiData !== null && externalApiData !== undefined) ? externalApiData : wordCloudData"
        :external-loading="externalFetch ? externalLoading : ((externalApiData !== null && externalApiData !== undefined) ? externalLoading : isLoadingWordCloud)"
        :external-fetch="externalFetch"
        @select="onSelectWord"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import WordCloudD3 from "./WordCloudD3.vue";

export default {
  name: "WordcloudNew",

  components: {
    WordCloudD3,
  },

  props: {
    activeTab: {
      type: String,
      default: "word",
    },
    // ✅ ถ้า parent ที่สูงกว่านี้อีกชั้นอยาก fetch เองแล้วส่งข้อมูลลงมา ก็ทำได้ผ่าน props นี้
    // ถ้าไม่ส่งมา component นี้จะ fetch เอง (ดู usingOwnFetch)
    externalApiData: { type: Object, default: null },
    externalLoading: { type: Boolean, default: false },
    // parent will perform fetching and pass data down
    externalFetch: { type: Boolean, default: false },
    letterSpacing: { type: Number, default: 0 },
  },

  data() {
    const today = moment(new Date()).format().slice(0, 10);

    return {
      todayStart: `${today}T00:00:00`,
      todayEnd: `${today}T23:59:59`,

      // ✅ คุมว่ามือถือโชว์ฝั่งไหน: "word" | "hash" — ใช้ prop activeTab เป็นค่าเริ่มต้น
      //    ไม่มีผลกับ desktop (WordCloudD3 ใช้ d-lg-block โชว์คู่กันเสมอ)
      activeTabMobile: this.activeTab || "word",

      // ✅ ข้อมูลที่ fetch เองครั้งเดียวตรงนี้ (ใช้เมื่อไม่ได้รับ externalApiData จาก parent)
      wordCloudData: null,
      isLoadingWordCloud: false,
      wordCloudError: "",
      _cancelSource: null,
      _lastFetchKey: "",
    };
  },

  computed: {
    token() {
      return localStorage.getItem("token") || "";
    },

    // ✅ ถ้า parent ส่ง externalApiData มาให้ ใช้อันนั้นแทนการ fetch เอง (กันยิงซ้ำ)
    usingOwnFetch() {
      return (!this.externalFetch) && (this.externalApiData === null || this.externalApiData === undefined);
    },

    domainId() {
      const q = this.$route.query.domain_id;
      return q && q !== "" ? q : null;
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

    fetchKey() {
      return `${String(this.domainId)}|${String(this.start)}|${String(this.end)}|${String(this.monitor)}`;
    },
  },

  watch: {
    fetchKey: {
      immediate: true,
      handler() {
        if (this.usingOwnFetch) this.fetchWordCloud();
      },
    },
    // ✅ ถ้า parent เปลี่ยน prop activeTab จากภายนอก ให้ sync เข้ามาที่ state ภายในด้วย
    activeTab(val) {
      if (val && val !== this.activeTabMobile) this.activeTabMobile = val;
    },
  },

  methods: {
    // wordcloud2.js วาดคำเป็น string เดียวด้วย fillText ไม่มี option letter-spacing ตรงๆ
// เลยต้องแทรกอักขระเว้นวรรคบางๆ (hair space) คั่นตัวอักษรเอง
// ⚠️ ต้องข้ามสระ/วรรณยุกต์ไทยที่เป็น combining mark ไม่งั้นจะหลุดลอยจากพยัญชนะที่ควบอยู่
spacedText(str) {
  if (!this.letterSpacing || !str) return str;
  const THAI_COMBINING = /[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/;
  const gap = "\u200A".repeat(this.letterSpacing);
  const chars = Array.from(str);
  let out = "";
  for (let i = 0; i < chars.length; i++) {
    out += chars[i];
    const next = chars[i + 1];
    if (next && !THAI_COMBINING.test(next)) out += gap;
  }
  return out;
},
    async fetchWordCloud() {
      this.wordCloudError = "";

      if (!this.token) {
        this.wordCloudError = "ไม่พบ token";
        return;
      }
      if (!this.domainId) {
        this.wordCloudData = null;
        return;
      }

      const key = this.fetchKey;

      if (this._cancelSource) this._cancelSource.cancel("Cancelled due to new request");
      this._cancelSource = axios.CancelToken.source();

      this.isLoadingWordCloud = true;
      try {
        const params = { domain_id: this.domainId, start: this.start, end: this.end };
        if (this.monitor) params.monitor = this.monitor;

        const res = await axios.request({
          method: "GET",
          url: "https://api2.cognizata.com/api/v2/wordcloud/getWordCloud",
          params,
          headers: { Authorization: `Bearer ${this.token}` },
          cancelToken: this._cancelSource.token,
        });

        this.wordCloudData = res.data;
        this._lastFetchKey = key;
      } catch (err) {
        if (axios.isCancel(err)) return;
        this.wordCloudError =
          (err.response && err.response.data && err.response.data.message) ||
          err.message ||
          "โหลดข้อมูลไม่สำเร็จ";
      } finally {
        this.isLoadingWordCloud = false;
      }
    },

    onSelectWord({ data }) {
      const word = data?.name ?? data?.text ?? data?.key ?? "";
      this.$emit("select", word);
    },
  },

  beforeDestroy() {
    if (this._cancelSource) {
      try {
        this._cancelSource.cancel("Component destroyed");
      } catch (e) { }
    }
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



.btn-group {
  transform: scale(0.8);
  transform-origin: top right;
}
</style>