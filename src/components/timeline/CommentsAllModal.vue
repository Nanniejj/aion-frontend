<template>
  <b-modal v-model="showProxy" size="lg" title="ความคิดเห็นทั้งหมด" hide-footer scrollable class="py-5 popup-comment">
    <div v-if="filteredAll.length">
      <div v-for="(c, i) in filteredAll" :key="c.id || i" class="d-flex align-items-start mb-3">
        <b-avatar v-if="c.photo" :src="c.photo" size="38" :class="c.is_top_fan ? 'story-ring' : ''" />
        <div class="ml-2 flex-grow-1">
          <div class="d-flex align-items-center flex-wrap">
            <a v-if="c.username" :href="c.url_comment || c.url" target="_blank"
              class="font-weight-bold name-ellipsis-1 small">
              {{ c.username }}
            </a>
            <a v-else :href="c.author_link ? ('https://www.youtube.com' + c.author_link) : '#'" target="_blank"
              class="font-weight-bold name-ellipsis-1 small">
              {{ c.author || 'Unknown' }}
            </a>

            <span v-if="c.is_top_fan" class="ml-2 small topfan">
              <b-avatar icon="star-fill" size="18" class="icon-bg"></b-avatar>
              TOP FAN
            </span>

            <span class="ml-2 small text-muted" style="font-size: 11px;">
              {{ formatDate(c.time) }} {{ formatTime(c.time) }}
            </span>
          </div>

          <div class="small message-box px-3 py-1 mt-1" v-if="c.content || c.text">
            {{ c.content || c.text }}
            <span v-if="c.reaction || c.vote" class="reaction-box ml-2">
              <template v-if="c.reaction">
                <b-iconstack font-scale="1">
                  <b-icon stacked icon="hand-thumbs-up" variant="dark" scale="1" shift-h="0.35"
                    shift-v="-0.10"></b-icon>
                  <b-icon stacked icon="suit-heart-fill" scale="0.6" shift-h="8" shift-v="6" variant="danger"></b-icon>
                </b-iconstack>
                <span class="small bold"> {{ c.reaction }} </span>
              </template>
              <template v-else-if="c.vote">
                <b-icon icon="hand-thumbs-up" variant="dark" scale="1"></b-icon>
                <span class="small bold"> {{ c.vote }} </span>
              </template>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-muted small">ไม่พบความคิดเห็น</div>
  </b-modal>
</template>

<script>
import moment from "moment";
import "moment/locale/th";

export default {
  name: "CommentsAllModal",
  // รองรับ v-model แบบ classic: v-model="showAllComments"
  props: {
    value: { type: Boolean, default: false },           // <-- v-model
    comments: { type: Array, default: () => [] },
    accountName: { type: String, default: "" },
    filterMode: { type: String, default: "topComments" } // ใช้ตัวเดียวกับสวิตช์ด้านนอก
  },
  computed: {
    showProxy: {
      get() { return this.value; },
      set(v) { this.$emit("input", v); }
    },
    filteredAll() {
      // ตัดคอมเมนต์ของเจ้าของโพสต์ออก เหมือนลิสต์ด้านล่าง
      const base = (this.comments || []).filter(x => x.username !== this.accountName);
      if (this.filterMode === "topFans") return base.filter(x => x.is_top_fan);
      return base; // topComments = ทั้งหมด (ให้ backend จัดอันดับมาแล้ว)
    }
  },
  methods: {
    formatDate(date) {
      const d = moment(date).subtract(7, "hours");
      return moment(d).format("ll")||d
    },
    formatTime(date) {
      return (date || "").slice(11, 16)||d
    }
  }
};
</script>

<style scoped>
.topfan {
  background: #f9ebcc;
  border-radius: 10px;
  padding: 5px;
  font-size: x-small;
  text-wrap-mode: nowrap;
}

.story-ring {
  display: inline-flex;
  padding: 3px;
  border-radius: 50%;
  background: conic-gradient(#feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5);
}

.icon-bg {
  background: linear-gradient(70deg, #3F5EFB 0%, #FC466B 80%, #FCC246 100%);
  color: #fff;
}

.message-box {
  color: #374757;
  background: #f2f2f2;
  border-radius: 10px;
  padding: 10px;
  width: fit-content;
  max-width: 100%;
}

.reaction-box {
  background: #fff;
  padding: 2px 4px;
  border-radius: 10px;
  text-wrap-mode: nowrap;
}

.name-ellipsis-1 {
  display: block;
  max-width: 180px;
  overflow: hidden;
  white-space: nowrap;
  color:#56a7b6;
  text-overflow: ellipsis;
}

</style>
<style >
.modal-title{
   font-size: 17px !important;
      line-height: 2.5 !important;
}
</style>