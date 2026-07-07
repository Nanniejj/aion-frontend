<template>
  <div class="px-1 px-lg-5">
    <b-toast id="my-toast2" no-close-button auto-hide-delay="1500">
      <div class="text-center">
        <i class="fa fa-arrow-down" /> เลื่อนลงเพื่อดูข้อมูล
      </div>
    </b-toast>

    <div class="my-3 box-spot-bg py-3">
      <b-row class="align-items-center px-3">
        <b-col cols="12" md>
          <div class="text-left">
            <span class="h4 mr-3 d-inline-block bold mb-0">TOP 10</span>
            <span class="small text-grey">(จำนวนครั้งที่พบ)</span>
          </div>
        </b-col>
      </b-row>

      <!-- ================= MOBILE (single by tab) ================= -->
      <div class="d-lg-none px-3">
        <!-- WORD TAB -->
        <div v-if="activeTab === 'word'">
          <div class="h6 text-left mt-2 d-flex align-items-center">
            <span>Words</span>
            <button
              v-if="excludedWordsCount > 0"
              type="button"
              class="wc-list-reset-badge ml-2"
              @click="resetExcludedList('word')"
            >
              ซ่อนไว้ {{ excludedWordsCount }} คำ · เอากลับมา
            </button>
          </div>

          <SentimentTopChart
            v-if="view === 'chart' && wordTop10.length"
            :items="wordChartItems"
            :limit="10"
            order="desc"
            labelMode="count"
            chartId="word"
            :activeKey="selected.chart === 'word' ? selected.key : null"
            @row-click="onChartRowClick"
          />

          <div v-else-if="wordTop10.length">
            <div v-for="(word, k) in wordTop10" :key="'mw-' + k" class="my-2 d-flex align-items-center wc-list-row">
              <b-button
                block
                pill
                variant="warning"
                :pressed="keyword === word.name"
                @click="clickWord(word.name, wordTop10, 'word')"
                class="flex-grow-1 mb-0 mr-2"
              >
                <span class="label-clip">{{ word.name }}</span>
                <span class="small"> ({{ word.total | numFormat }})</span>
              </b-button>
              <button
                type="button"
                class="wc-list-hide-btn"
                title="ซ่อนคำนี้"
                @click.stop="hideItem('word', word.name)"
              >×</button>
            </div>
          </div>

          <div v-else-if="isLoading" class="py-3 text-center text-muted small"><vue-element-loading :active="isLoading" size="50" background-color="rgba(255,255,255,0)"
                    color="#17a2b891" /></div>
          <div v-else class="py-3 text-center text-muted small">ไม่พบข้อมูล Wordcloud</div>
        </div>

        <!-- HASH TAB -->
        <div v-else>
          <div class="h6 text-left mt-2 d-flex align-items-center">
            <span>Hashtags</span>
            <button
              v-if="excludedTagsCount > 0"
              type="button"
              class="wc-list-reset-badge ml-2"
              @click="resetExcludedList('hash')"
            >
              ซ่อนไว้ {{ excludedTagsCount }} แท็ก · เอากลับมา
            </button>
          </div>

          <SentimentTopChart
            v-if="view === 'chart' && hashTop10.length"
            :items="hashChartItems"
            :limit="10"
            order="desc"
            labelMode="count"
            chartId="hash"
            :activeKey="selected.chart === 'hash' ? selected.key : null"
            @row-click="onChartRowClick"
          />

          <div v-else-if="hashTop10.length">
            <div v-for="(word, k) in hashTop10" :key="'mh-' + k" class="my-2 d-flex align-items-center wc-list-row">
              <b-button
                block
                pill
                variant="warning"
                :pressed="keyword === word.name"
                @click="clickWord(word.name, hashTop10, 'hash')"
                class="flex-grow-1 mb-0 mr-2"
              >
                <span class="label-clip">{{ word.name }}</span>
                <span class="small"> ({{ word.total | numFormat }})</span>
              </b-button>
              <button
                type="button"
                class="wc-list-hide-btn"
                title="ซ่อนแท็กนี้"
                @click.stop="hideItem('hash', word.name)"
              >×</button>
            </div>
          </div>


          <div v-else-if="isLoading" class="py-3 text-center text-muted small"><vue-element-loading :active="isLoading" size="50" background-color="rgba(255,255,255,0)"
                    color="#17a2b891" /></div>
          <div v-else class="py-3 text-center text-muted small">ไม่พบข้อมูล Hashtagcloud</div>
        </div>
      </div>

      <!-- ================= DESKTOP (two columns) ================= -->
      <b-row class="px-3 d-none d-lg-flex">
        <b-col cols="12" lg="6">
          <div class="h6 text-left mt-2 d-flex align-items-center">
            <span>Words</span>
            <button
              v-if="excludedWordsCount > 0"
              type="button"
              class="wc-list-reset-badge ml-2"
              @click="resetExcludedList('word')"
            >
              ซ่อนไว้ {{ excludedWordsCount }} คำ · เอากลับมา
            </button>
          </div>

          <SentimentTopChart
            v-if="view === 'chart' && wordTop10.length"
            :items="wordChartItems"
            :limit="10"
            order="desc"
            labelMode="count"
            chartId="word"
            :activeKey="selected.chart === 'word' ? selected.key : null"
            @row-click="onChartRowClick"
          />

          <div v-else-if="wordTop10.length">
            <div v-for="(word, k) in wordTop10" :key="'w-' + k" class="my-2 d-flex align-items-center wc-list-row">
              <b-button
                block
                pill
                variant="warning"
                :pressed="keyword === word.name"
                @click="clickWord(word.name, wordTop10, 'word')"
                class="flex-grow-1 mb-0 mr-2"
              >
                <span class="label-clip">{{ word.name }}</span>
                <span class="small"> ({{ word.total | numFormat }})</span>
              </b-button>
              <button
                type="button"
                class="wc-list-hide-btn"
                title="ซ่อนคำนี้"
                @click.stop="hideItem('word', word.name)"
              >×</button>
            </div>
          </div>

          <div v-else-if="isLoading" class="py-3 text-center text-muted small"><vue-element-loading :active="isLoading" size="50" background-color="rgba(255,255,255,0)"
                    color="#17a2b891" /></div>
          <div v-else class="py-3 text-center text-muted small">ไม่พบข้อมูล Wordcloud</div>
        </b-col>

        <b-col cols="12" lg="6">
          <div class="h6 text-left mt-2 d-flex align-items-center">
            <span>Hashtags</span>
            <button
              v-if="excludedTagsCount > 0"
              type="button"
              class="wc-list-reset-badge ml-2"
              @click="resetExcludedList('hash')"
            >
              ซ่อนไว้ {{ excludedTagsCount }} แท็ก · เอากลับมา
            </button>
          </div>

          <SentimentTopChart
            v-if="view === 'chart' && hashTop10.length"
            :items="hashChartItems"
            :limit="10"
            order="desc"
            labelMode="count"
            chartId="hash"
            :activeKey="selected.chart === 'hash' ? selected.key : null"
            @row-click="onChartRowClick"
          />

          <div v-else-if="hashTop10.length">
            <div v-for="(word, k) in hashTop10" :key="'h-' + k" class="my-2 d-flex align-items-center wc-list-row">
              <b-button
                block
                pill
                variant="warning"
                :pressed="keyword === word.name"
                @click="clickWord(word.name, hashTop10, 'hash')"
                class="flex-grow-1 mb-0 mr-2"
              >
                <span class="label-clip">{{ word.name }}</span>
                <span class="small"> ({{ word.total | numFormat }})</span>
              </b-button>
              <button
                type="button"
                class="wc-list-hide-btn"
                title="ซ่อนแท็กนี้"
                @click.stop="hideItem('hash', word.name)"
              >×</button>
            </div>
          </div>

          <div v-else-if="isLoading" class="py-3 text-center text-muted small"><vue-element-loading :active="isLoading" size="50" background-color="rgba(255,255,255,0)"
                    color="#17a2b891" /></div>
          <div v-else class="py-3 text-center text-muted small">ไม่พบข้อมูล Hashtagcloud</div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import SentimentTopChart from "./SentimentTopChart.vue";

export default {
  components: { SentimentTopChart },
  props: {
    activeTab: { type: String, default: "word" },

    // ✅ ไม่ยิง API เองแล้ว — รับข้อมูลจาก parent ที่ fetch มาครั้งเดียว แล้วส่งลงมาทั้ง
    // WordcloudImg2 และ WordcloudList พร้อมกัน การันตีว่าทั้งคู่เห็นข้อมูลชุดเดียวกันเป๊ะ
    apiData: { type: Object, default: null },
    isLoading: { type: Boolean, default: false },

    // ✅ ใช้ระบุ domain สำหรับ key ของ localStorage ที่เก็บรายการ "ซ่อนไว้"
    // ต้องเป็นค่าเดียวกับที่ WordCloudFull ใช้ (prop domain-id) เพื่อให้ซิงก์กันได้ถูกต้อง
    domainId: { type: [String, Number], default: null },
  },
  computed: {
    resolvedDomainId() {
      if (this.domainId !== null && this.domainId !== undefined && this.domainId !== "") {
        return this.domainId;
      }
      const q = this.$route?.query?.domain_id;
      return q && q !== "" ? q : "";
    },
    _excludeStorageKey() {
      return `wc_excluded::${String(this.resolvedDomainId)}`;
    },

    excludedWordsCount() {
      return Object.keys(this.excludedWords).length;
    },
    excludedTagsCount() {
      return Object.keys(this.excludedTags).length;
    },

    // ✅ อ่านตรงจาก prop apiData ที่ parent ยิงมาครั้งเดียว (โครงสร้างเดียวกับที่ WordCloudFull ใช้)
    wordItemsRaw() {
      if (!this.apiData) return [];
      if (Array.isArray(this.apiData)) return this.apiData;
      return (
        this.apiData?.wordCloud ||
        this.apiData?.data?.wordcloud?.data ||
        this.apiData?.items ||
        []
      );
    },
    hashItemsRaw() {
      if (!this.apiData) return [];
      if (Array.isArray(this.apiData)) return [];
      return (
        this.apiData?.hashtags ||
        this.apiData?.data?.hashtag?.data ||
        []
      );
    },

    wordTop10() {
      const list = Array.isArray(this.wordItemsRaw) ? this.wordItemsRaw : [];
      return list.filter((w) => !this.excludedWords[this._normKey(w.name)]).slice(0, 10);
    },
    hashTop10() {
      const list = Array.isArray(this.hashItemsRaw) ? this.hashItemsRaw : [];
      return list.filter((w) => !this.excludedTags[this._normKey(w.name)]).slice(0, 10);
    },

    wordChartItems() {
      return (this.wordTop10 || []).map(w => {
        const { pos, neu, neg, total } = this.pickSentimentCounts(w);
        return {
          uid: w.name,
          name: w.name,
          count: total,
          positiveSentiment: pos,
          neutralSentiment: neu,
          negativeSentiment: neg,
          source: "wordcloud"
        };
      });
    },
    hashChartItems() {
      return (this.hashTop10 || []).map(w => {
        const { pos, neu, neg, total } = this.pickSentimentCounts(w);
        return {
          uid: w.name,
          name: w.name,
          count: total,
          positiveSentiment: pos,
          neutralSentiment: neu,
          negativeSentiment: neg,
          source: "hashtag"
        };
      });
    }
  },
  data() {
    return {
      keyword: "",
      dataFromAPI: "",
      view: "chart",

      selected: {
        chart: null,
        key: null
      },

      excludedWords: {},
      excludedTags: {},
    };
  },
  watch: {
    resolvedDomainId() {
      this.loadExcluded();
    },
  },
  mounted() {
    this.loadExcluded();

    this._onExternalExcludedChanged = (payload) => {
      if (!payload || String(payload.domainId) !== String(this.resolvedDomainId)) return;
      if (payload.source === "list") return;
      this.loadExcluded();
    };
    this.$root.$on("wc-excluded-changed", this._onExternalExcludedChanged);
  },
  beforeDestroy() {
    if (this._onExternalExcludedChanged) {
      this.$root.$off("wc-excluded-changed", this._onExternalExcludedChanged);
    }
  },
  methods: {
    pickSentimentCounts(w) {
      const arr = Array.isArray(w?.count) ? w.count : [];
      let pos = 0, neu = 0, neg = 0;
      for (const x of arr) {
        const s = Number(x?.sentiment);
        const c = Number(x?.count || 0);
        if (s === 1) pos += c;
        else if (s === 0) neu += c;
        else if (s === -1) neg += c;
      }
      const totalFromArr = pos + neu + neg;
      const total = Number(w?.total ?? totalFromArr ?? 0);
      return { pos, neu, neg, total };
    },

    _normKey(text) {
      return String(text || "").trim().toLowerCase();
    },

    loadExcluded() {
      this.excludedWords = {};
      this.excludedTags = {};
      try {
        const raw = localStorage.getItem(this._excludeStorageKey);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        this.excludedWords = parsed?.words || {};
        this.excludedTags = parsed?.tags || {};
      } catch (e) { }
    },

    persistExcluded() {
      try {
        localStorage.setItem(
          this._excludeStorageKey,
          JSON.stringify({ words: this.excludedWords, tags: this.excludedTags })
        );
      } catch (e) { }
    },

    hideItem(kind, name) {
      const key = this._normKey(name);
      if (!key) return;

      const map = kind === "word" ? this.excludedWords : this.excludedTags;
      this.$set(map, key, true);
      this.persistExcluded();

      if (this.selected.key === name) {
        this.selected.chart = null;
        this.selected.key = null;
      }

      this.$root.$emit("wc-excluded-changed", {
        domainId: String(this.resolvedDomainId),
        kind: kind === "word" ? "words" : "tags",
        key,
        source: "list",
      });
    },

    resetExcludedList(kind) {
      if (kind === "word") this.excludedWords = {};
      else this.excludedTags = {};
      this.persistExcluded();

      this.$root.$emit("wc-excluded-changed", {
        domainId: String(this.resolvedDomainId),
        kind: kind === "word" ? "words" : "tags",
        source: "list",
      });
    },

    onChartRowClick({ name, key, chartId }) {
      const isSame = this.selected.chart === chartId && this.selected.key === key;

      this.selected.chart = isSame ? null : chartId;
      this.selected.key = isSame ? null : key;

      if (!isSame) {
        this.keyword = name;
        this.$emit("select-word", name);
        this.$bvToast.show("my-toast2");
      }
    },

    clickWord(name, data, chartId = null) {
      this.dataFromAPI = data;
      this.keyword = name;

      const cid = chartId || (this.activeTab === "word" ? "word" : "hash");

      this.selected.chart = cid;
      this.selected.key = name;

      this.$emit("select-word", name);
      this.$bvToast.show("my-toast2");
    }
  }
};
</script>

<style scoped>
.box-spot-bg {
  background: linear-gradient(to top, #b8d3d3a4, #eadff8);
  border-radius: 11px;
  border: 0px;
  margin-bottom: 10px;
  min-height: 75px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

.label-clip {
  display: inline-block;
  max-width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
}

.btn-warning {
  color: #3b3838;
  background-color: #fcf0d2;
  border-color: #ffce61;
}

.btn-warning:hover {
  color: #212529;
  background-color: #fed16e;
  border-color: #fed16e;
}

.btn-warning:not(:disabled):not(.disabled).active,
.btn-warning:not(:disabled):not(.disabled):active,
.show > .btn-warning.dropdown-toggle {
  background-color: #fed16e !important;
  border-color: #fed16e;
}

.btn-sw {
  transform: scale(0.85);
  transform-origin: top right;
}

.wc-list-row {
  gap: 0;
}

.wc-list-hide-btn {
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: #fdeceb;
  color: #b3261e;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.wc-list-hide-btn:hover {
  background: #f8c9c6;
  color: #7a1a14;
}

.wc-list-reset-badge {
  border: none;
  border-radius: 999px;
  background: rgba(20, 20, 20, 0.75);
  color: #fff;
  font-size: 11px;
  font-weight: 400;
  padding: 3px 10px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.wc-list-reset-badge:hover {
  background: rgba(20, 20, 20, 0.92);
}

@media (max-width: 800px) {
  .btn-sw {
    transform: scale(0.78);
    transform-origin: top right;
  }
}
</style>