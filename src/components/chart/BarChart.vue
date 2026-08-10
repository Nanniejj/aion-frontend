<template>
  <div id="chart" class="mt-3">
    <span class="box-domain">
      <div class="header-row">
        <div class="title-text" v-if="$route.name == 'Report'">Total Posts</div>
        <!-- <div class="title-text" v-else>Total Post</div> -->
      </div>

      <div class="platform-list" v-if="displayRows.length">
        <div
          v-for="(item, index) in displayRows"
          :key="item.source"
          class="platform-row"
        >
          <div class="icon-col">
            <img :src="item.icon" :alt="item.source" class="platform-icon" />
          </div>

          <div class="bar-col">
            <div class="bar-wrap">
              <div
                class="bar-fill"
                :style="{
                  width: getBarWidth(item.count),
                  backgroundColor: item.color
                }"
              ></div>
            </div>
          </div>

          <div class="value-col">
            <span class="value-text">
              {{ formatNumber(item.count) }} posts <span class="small"> ({{ item.percent }}%)</span> 
            </span>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">Loading...</div>
    </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import axios from "axios";
import cfb from "@/assets/cfb.png";
import ctw from "@/assets/ctw.png";
import cboard from "@/assets/cboard.png";
import cn from "@/assets/cn.png";
import cyt from "@/assets/cyt.png";
import cig from "@/assets/cig.png";
import cblock from "@/assets/Block.png";
import ctt from "@/assets/tt.png";
import ctd from "@/assets/ctd.png";
import ctg from "@/assets/ctg.png";

export default {
  name: "TotalPostsBySource",
  data() {
    return {
      rawData: [],
      total: 0,
      range: "",
      // debounce + cancel state, ไม่เกี่ยวกับ render เลยไม่จำเป็นต้องเป็น reactive
      // แต่เก็บไว้ใน data() ก็ใช้งานได้ปกติ
      _updateTimer: null,
      _abortController: null,
      platformConfig: [
        {
          source: "facebook",
          label: "Facebook",
          icon: cfb,
          color: "#5B8DEF",
        },
        {
          source: "twitter",
          label: "Twitter/X",
          icon: ctw,
          color: "#8A8A8A",
        },
        {
          source: "pantip",
          label: "Pantip",
          icon: cboard,
          color: "#6F49A7",
        },
        {
          source: "news",
          label: "News",
          icon: cn,
          color: "#E9B152",
        },
        {
          source: "youtube",
          label: "YouTube",
          icon: cyt,
          color: "#F06464",
        },
        {
          source: "instagram",
          label: "Instagram",
          icon: cig,
          color: "#FFA06A",
        },
        {
          source: "blockdit",
          label: "Blockdit",
          icon: cblock,
          color: "#4B78B8",
        },
        {
          source: "tiktok",
          label: "TikTok",
          icon: ctt,
          color: "#6E5A80",
        },
        {
          source: "threads",
          label: "Threads",
          icon: ctd,
          color: "#E05A97",
        },
        {
          source: "telegram",
          label: "Telegram",
          icon: ctg,
          color: "#2DA5E1",
        },
      ],
    };
  },

  computed: {
    ...mapGetters([
      "getClickDomain",
      "getSdateDm",
      "getEdateDm",
      "getArrDate",
      "getDateReport",
      "getClickDomainId",
      "getSourceNews",
    ]),

    displayRows() {
      const sourceMap = this.rawData.reduce((acc, item) => {
        acc[item.source] = item.count;
        return acc;
      }, {});

      return this.platformConfig.map((platform) => {
        const count = sourceMap[platform.source] || 0;
        const percent =
          this.total > 0 ? ((count / this.total) * 100).toFixed(1) : "0.0";

        return {
          ...platform,
          count,
          percent,
        };
      });
    },
  },

  // ใช้ watcher เดี่ยว ๆ ตามเดิม แต่ทุกตัวเรียกผ่าน queueUpdate()
  // เพื่อรวม trigger ที่ยิงพร้อมกันให้เหลือ request เดียว
  watch: {
    getArrDate() {
      this.queueUpdate();
    },
    getDateReport() {
      this.queueUpdate();
    },
    getClickDomainId() {
      this.queueUpdate();
    },
    getSdateDm() {
      this.queueUpdate();
    },
    getEdateDm() {
      this.queueUpdate();
    },
    getSourceNews() {
      this.queueUpdate();
    },
  },

  methods: {
    formatNumber(val) {
      return Number(val || 0).toLocaleString();
    },

    getBarWidth(count) {
      const max = Math.max(...this.displayRows.map((item) => item.count), 0);
      if (!max) return "0%";
      return `${(count / max) * 100}%`;
    },

    getApiUrl() {
      let date;
      let startrp;
      let endrp;

      if (this.$route.name === "Report") {
        date = localStorage.getItem("dateReport").split(",");
        startrp = "start=" + date[0];
        endrp = "&end=" + date[1];

        return (
          "https://api2.cognizata.com/api/v2/userposts/getTotalPostsTarget?" +
          startrp +
          endrp
        );
      }

      let sdate = "";
      let edate = "";

      if (this.getSdateDm || this.getEdateDm) {
        sdate = "&start=" + this.getSdateDm;
        edate = "&end=" + this.getEdateDm;
      } else {
        const today = moment(new Date()).format().slice(0, 10);
        sdate = "&start=" + today + "T00:00:00";
        edate = "&end=" + today + "T23:59:59";
      }

      const sourceNewsParam = this.getSourceNews ? `&source_news=${this.getSourceNews}` : "";
      return (
        "https://api2.cognizata.com/api/v2/userposts/getTotalPosts?domain_id=" +
        this.getClickDomainId +
        sdate +
        edate +
        sourceNewsParam
      );
    },

    // รวม trigger ที่ยิงมาพร้อม ๆ กันจาก watcher หลายตัว (เช่น domain_id, sdate, edate,
    // source_news เปลี่ยนพร้อมกันตอน user submit filter) ให้เหลือ updateChart() แค่ครั้งเดียว
    queueUpdate() {
      clearTimeout(this._updateTimer);
      this._updateTimer = setTimeout(() => {
        this.updateChart();
      }, 150);
    },

    async updateChart() {
      // ✅ เดิมใช้ axios.CancelToken (deprecated) — พอ .cancel() ตอนมี request ใหม่มาแทรก
      // บางครั้ง axios เวอร์ชันที่ใช้อยู่จะ throw TypeError จากภายในของมันเอง
      // ("Cannot read properties of undefined (reading 'status')" ที่เจอใน console)
      // แทนที่จะ reject เป็น Cancel error ปกติ ทำให้ axios.isCancel(error) เช็คไม่เจอ
      // แล้วโค้ดด้านล่างเข้าใจผิดว่าเป็น error จริง ไปเคลียร์ rawData/total ทิ้งทั้งที่แค่ยกเลิกเอง
      // เปลี่ยนมาใช้ AbortController (มาตรฐานปัจจุบัน ไม่ deprecated) แทน ปัญหานี้จะไม่เกิดขึ้นอีก
      if (this._abortController) {
        this._abortController.abort();
      }
      this._abortController = new AbortController();

      try {
        const urlapi = this.getApiUrl();

        const config = {
          method: "get",
          url: urlapi,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          signal: this._abortController.signal,
        };

        const response = await this.axios(config);
        const data = Array.isArray(response.data) ? response.data : [];

        this.rawData = data;
        this.total = data.reduce((sum, item) => sum + (item.count || 0), 0);
        this.range = `${this.getSdateDm || ""} - ${this.getEdateDm || ""}`;
      } catch (error) {
        // ✅ เช็คทุกรูปแบบที่ axios ใช้บอกว่า request ถูกยกเลิกเอง (คนละเวอร์ชัน/คนละ API กันมีชื่อไม่เหมือนกัน)
        // กันไม่ให้ "การยกเลิก request เก่าเพราะมี request ใหม่กว่ามาแทน" ถูกนับเป็น error จริง
        const isCanceled =
          axios.isCancel(error) ||
          error?.name === "CanceledError" ||
          error?.code === "ERR_CANCELED" ||
          error?.name === "AbortError";
        if (isCanceled) {
          return;
        }
        console.error("updateChart error:", error);
        this.rawData = [];
        this.total = 0;
      }
    },
  },

  async created() {
    await this.updateChart();
  },

  beforeDestroy() {
    clearTimeout(this._updateTimer);
    if (this._abortController) {
      this._abortController.abort();
    }
    this.rawData = [];
    this.total = 0;
  },
};
</script>

<style scoped>
.box-domain {
  width: 100%;
  height: auto;
  padding: 20px;
  border-radius: 7px;
  box-shadow: 0 4px 7px 0 rgb(0 0 0 / 20%);
  display: block;
  background: #fff;
}

.header-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.title-text {
  font-size: 16px;
  font-weight: 600;
}

.platform-list {
  margin-top: 10px;
}

.platform-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 5px;
}

.icon-col {
  width: 30px;
  min-width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.platform-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
  display: block;
}

.bar-col {
  flex: 1;
  min-width: 120px;
}

.bar-wrap {
  width: 100%;
  height: 28px;
  background: transparent;
  border-radius: 8px;
  position: relative;
  overflow: visible;
}

.bar-fill {
  height: 100%;
  border-radius:7px;
  min-width: 2px;
  transition: width 0.35s ease;
}

.value-col {
  min-width: 150px;
  text-align: left;
}

.value-text {
  font-size: 12px;
  font-weight: 600;

  line-height: 1.2;
  white-space: nowrap;
}

.empty-state {
  padding: 20px 0;
  font-size: 14px;
  color: #777;
}

@media only screen and (max-width: 991px) {
  .platform-row {
    gap: 10px;
  }

  .value-col {
    min-width: 120px;
  }

  .value-text {
    font-size: 13px;
  }
}

@media only screen and (max-width: 768px) {
  .platform-row {
    align-items: center;
  }

  .icon-col {
    width: 32px;
    min-width: 32px;
  }

  .platform-icon {
    width: 32px;
    height: 32px;
  }

  .bar-wrap {
    height: 28px;
  }

  .value-col {
    min-width: 105px;
  }

  .value-text {
    font-size: 12px;
  }
}
</style>