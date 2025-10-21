<template>
    <b-card no-body class="podium-card overflow-hidden">
        <!-- header -->
        <div class="podium-header d-flex justify-content-between align-items-center px-3 pt-3">
            <div class="title">
                <div class="h6 mb-0 text-white">Top 5 Personalities</div>
                <small class="text-white-50">บุคคลที่ถูกกล่าวถึง 5 อันดับ</small>
            </div>
            <div class="timer badge badge-light">⏱ {{ remainingText }}</div>
        </div>

        <!-- body / podium -->
        <div class="podium-body px-2 pb-4 pt-2">
            <div class="d-flex justify-content-center align-items-end podium-stage flex-wrap">
                <!-- 4th -->
                <div class="podium-col fourth text-center mx-1 mx-sm-2">
                    <div class="avatar-wrap sm">
                        <img :src="(it4 && it4.avatar) ? it4.avatar : defaultAvatar" class="avatar sm">
                    </div>
                    <div class="name w-100">{{ (it4 && it4.name) ? it4.name : '—' }}</div>
                    <div class="score" v-if="it4">{{ formatNumber(it4.mentions) }} Posts</div>
                    <div class="stand stand-4">4</div>
                </div>
                <!-- 2nd -->
                <div class="podium-col second text-center mx-1 mx-sm-2">
                    <div class="avatar-wrap">
                        <img :src="(it2 && it2.avatar) ? it2.avatar : defaultAvatar" class="avatar">
                    </div>
                    <div class="name">{{ (it2 && it2.name) ? it2.name : '—' }}</div>
                    <div class="score" v-if="it2">{{ formatNumber(it2.mentions) }} Posts</div>
                    <div class="stand stand-2">2</div>
                </div>

                <!-- 1st -->
                <div class="podium-col first text-center mx-1 mx-sm-2">
                    <div class="avatar-wrap crown">
                        <img :src="(it1 && it1.avatar) ? it1.avatar : defaultAvatar" class="avatar">
                        <div class="crown-ico">👑</div>
                    </div>
                    <div class="name">{{ (it1 && it1.name) ? it1.name : '—' }}</div>
                    <div class="score" v-if="it1">{{ formatNumber(it1.mentions) }} Posts</div>
                    <div class="stand stand-1">1</div>
                </div>

                <!-- 3rd -->
                <div class="podium-col third text-center mx-1 mx-sm-2">
                    <div class="avatar-wrap">
                        <img :src="(it3 && it3.avatar) ? it3.avatar : defaultAvatar" class="avatar">
                    </div>
                    <div class="name">{{ (it3 && it3.name) ? it3.name : '—' }}</div>
                    <div class="score" v-if="it3">{{ formatNumber(it3.mentions) }} Posts</div>
                    <div class="stand stand-3">3</div>
                </div>

                <!-- 5th -->
                <div class="podium-col fifth text-center mx-1 mx-sm-2">
                    <div class="avatar-wrap sm">
                        <img :src="(it5 && it5.avatar) ? it5.avatar : defaultAvatar" class="avatar sm">
                    </div>
                    <div class="name">{{ (it5 && it5.name) ? it5.name : '—' }}</div>
                    <div class="score" v-if="it5">{{ formatNumber(it5.mentions) }} Posts</div>
                    <div class="stand stand-5">5</div>
                </div>

            </div>
        </div>

        <b-alert show variant="danger" v-if="error" class="mb-0 rounded-0">
            โหลดข้อมูลล้มเหลว: {{ error }}
        </b-alert>
    </b-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'PodiumTop5',
  props: {
    apiBase: { type: String, default: 'https://api2.cognizata.com' },
    endpoint: { type: String, default: '/api/v2/facerecognition/getFacePersonTop' },
    from: { type: String },
    to: { type: String },
    source: { type: [String, null] },
    sentiment: { type: [String, Number, Array, null] }, 
    names: { type: Array },
    limit: { type: Number, default: 20 },
    refreshSec: { type: Number, default: 0 }
  },
  data() {
    return {
      list: [],
      error: null,
      timer: null,
      defaultAvatar: 'https://ui-avatars.com/api/?background=random&name=?'
    }
  },
  computed: {
    sorted() {
      return (this.list || []).slice().sort((a, b) => (b.mentions || 0) - (a.mentions || 0))
    },
    it1() { return this.sorted[0] || null },
    it2() { return this.sorted[1] || null },
    it3() { return this.sorted[2] || null },
    it4() { return this.sorted[3] || null },
    it5() { return this.sorted[4] || null },
    remainingText() {
      if (!this.to) return '—'
      const end = new Date(this.to).getTime()
      if (isNaN(end)) return '—'
      const now = Date.now()
      let ms = Math.max(0, end - now)
      const d = Math.floor(ms / 86400000); ms -= d * 86400000
      const h = Math.floor(ms / 3600000); ms -= h * 3600000
      const m = Math.floor(ms / 60000)
      return `${d}d ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m`
    }
  },
  watch: {
    from: 'fetchData',
    to: 'fetchData',
    source: 'fetchData',
    sentiment: { handler: 'fetchData', deep: true },
    names: { handler: 'fetchData', deep: true },
    limit: 'fetchData'
  },
  mounted() {
    this.fetchData()
    if (this.refreshSec > 0) this.timer = setInterval(this.fetchData, this.refreshSec * 1000)
  },
  beforeDestroy() { if (this.timer) clearInterval(this.timer) },
  methods: {
    buildUrl() {
      const url = new URL(this.endpoint, this.apiBase)
      if (this.from) url.searchParams.set('from', this.from)
      if (this.to) url.searchParams.set('to', this.to)
      if (this.source) url.searchParams.set('source', this.source)
      if (this.sentiment !== null && this.sentiment !== undefined) {
        const s = Array.isArray(this.sentiment) ? this.sentiment.join(',') : String(this.sentiment)
        url.searchParams.set('sentiment', s)
      }
      if (this.names && this.names.length) url.searchParams.set('name', this.names.join(','))
      if (this.limit) url.searchParams.set('limit', String(this.limit))
      return url.toString()
    },
    async fetchData() {
      try {
        this.error = null
        const url = this.buildUrl()
        const { data } = await axios.get(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // ให้เหมือนอีกไฟล์
        })
        const list = Array.isArray(data) ? data : (data && (data.data || data.items)) || []
        this.list = list.map(this.normalizeItem)
      } catch (e) {
        this.error = e?.message || 'ไม่สามารถดึงข้อมูลได้'
        this.list = []
      }
    },
    normalizeItem(raw = {}) {
      const name = raw.person_name || raw.name || 'ไม่ทราบชื่อ'
      const mentions = pickNum(raw.mentions, raw.total, raw.count, raw.posts, raw.value)
      const avatar = raw.image_paths[0] || null
      return { name, mentions, avatar }
      function pickNum(...nums){ for (const n of nums){ const v=Number(n); if(!isNaN(v)) return v } return 0 }
    },
    formatNumber(n) { return new Intl.NumberFormat().format(n || 0) }
  }
}
</script>


<style scoped>
.podium-card {
    background: linear-gradient(180deg, #8159ff, #7a63ff, #7c74ff);
    border: none;
    border-radius: 18px;
    color: #fff;
}

.podium-header .title .h6 {
    font-weight: 700;
}

.podium-header .timer {
    font-weight: 600;
    border-radius: 999px;
    padding: 6px 10px;
}

.podium-body {
    position: relative;
}

.podium-stage {
    padding-bottom: 50px !important;
    /* min-height: 200px;  */
}

/* columns */
.podium-col {
    width: 18%;
    margin: 0 auto 8px;
    /* margin-right: auto; */
}

.podium-col.first {
    transform: translateY(-8px);
}

.podium-col.second {
    transform: translateY(20px);
}

.podium-col.third {
    transform: translateY(36px);
}

.podium-col.fourth {
    transform: translateY(40px);
}

.podium-col.fifth {
    transform: translateY(40px);
}

.avatar-wrap {
    width: 88px;
    height: 88px;
    border-radius: 999px;
    background: rgba(255, 255, 255, .18);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 8px;
    position: relative;
    box-shadow: 0 8px 18px rgba(0, 0, 0, .15) inset, 0 6px 12px rgba(0, 0, 0, .08);
}

.avatar-wrap.sm {
    width: 72px;
    height: 72px;
}

.avatar {
    width: 76px;
    height: 76px;
    border-radius: 999px;
    object-fit: cover;
    background: #eee;
}

.avatar.sm {
    width: 62px;
    height: 62px;
}

.crown-ico {
    position: absolute;
    top: -14px;
    right: 31px;
    font-size: 22px;
}

.name {
    font-weight: 500;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.score {
    font-size: 12px;
    opacity: .95;
    margin-bottom: 8px;
}

/* stands */
.stand {
    width: 80%;
    margin: 0 auto;
    border-radius: 16px;
    color: #fff;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 16px rgba(0, 0, 0, .2);
}

.stand-1 {
    background: #f0f2ff;
    color: #644fff;
    height: 45px;
    font-size: 38px;
}

.stand-2 {
    background: #e6e8ff;
    color: #6854ff;
    height: 40px;
    font-size: 34px;
}

.stand-3 {
    background: #dcdfff;
    color: #6a56ff;
    height: 40px;
    font-size: 28px;
}

.stand-4 {
    background: #d2d6ff;
    color: #6f5bff;
    height: 40px;
    font-size: 24px;
}

.stand-5 {
    background: #d2d6ff;
    color: #6f5bff;
    height: 40px;
    font-size: 24px;
}

/* responsive */
@media (max-width: 520px) {
    .podium-col {
        width: 92px;
    }

    .avatar-wrap {
        width: 80px;
        height: 80px;
    }

    .avatar {
        width: 68px;
        height: 68px;
    }

    .avatar-wrap.sm {
        width: 66px;
        height: 66px;
    }

    .avatar.sm {
        width: 45px;
        height: 45px;
    }

    .stand-1 {
        height: 45px;
        font-size: 34px;
    }

    .stand-2 {
        height: 42px;
        font-size: 30px;
    }

    .stand-3 {
        height: 30px;
        font-size: 26px;
    }

    .stand-4,
    .stand-5 {
        height: 20px;
        font-size: 22px;
    }
}
</style>
