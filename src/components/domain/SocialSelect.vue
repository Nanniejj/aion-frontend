<template>
  <div
    class="social-tab-bar position-relative d-flex align-items-center my-2"
    :class="{ 'is-overflowing': isOverflowing }"
  >
    <b-button
      v-show="showLeftArrow"
      variant="light"
      class="arrow-btn arrow-btn-left p-0 d-flex align-items-center justify-content-center"
      aria-label="Scroll left"
      @click="scrollTabs(-1)"
    >
      <i class="fas fa-chevron-left"></i>
    </b-button>

    <div
      ref="scrollWrap"
      class="scroll-wrap flex-fill"
      @scroll="updateScrollState"
    >
      <div
        ref="scrollInner"
        class="scroll-inner d-inline-flex align-items-center"
      >
        <b-button
          v-for="p in platforms"
          :key="p.key"
          variant="light"
          class="tab-btn d-inline-flex align-items-center"
          :class="{ active: activeSocial === p.key }"
          @click="setActive(p.key)"
        >
          <span class="platform-icon" :style="{ background: p.bg, color: p.color }">
            <i :class="p.iconClass"></i>
          </span>

          <span class="tab-label">{{ p.label }}</span>
          <span class="active-dot"></span>
        </b-button>
      </div>
    </div>

    <b-button
      v-show="showRightArrow"
      variant="light"
      class="arrow-btn arrow-btn-right p-0 d-flex align-items-center justify-content-center"
      aria-label="Scroll right"
      @click="scrollTabs(1)"
    >
      <i class="fas fa-chevron-right"></i>
    </b-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const PLATFORMS = [
  {
    key: '',
    label: 'All',
    bg: '#eef0fb',
    color: '#4c5bce',
    iconClass: 'fas fa-globe'
  },
  {
    key: 'facebook',
    label: 'Facebook',
    bg: '#e7f1fd',
    color: '#1877f2',
    iconClass: 'fab fa-facebook-f'
  },
  {
    key: 'twitter',
    label: 'X',
    bg: '#f0f0f0',
    color: '#111111',
    iconClass: 'fab fa-x-twitter'
  },
  {
    key: 'pantip',
    label: 'Board',
    bg: '#f3edfb',
    color: '#7c3d8b',
    iconClass: 'fas fa-comments'
  },
  {
    key: 'news',
    label: 'News',
    bg: '#fde8e6',
    color: '#c0392b',
    iconClass: 'fas fa-newspaper'
  },
  {
    key: 'youtube',
    label: 'YouTube',
    bg: '#ffe8e8',
    color: '#ff0000',
    iconClass: 'fab fa-youtube'
  },
  {
    key: 'instagram',
    label: 'Instagram',
    bg: '#fceef8',
    color: '#c13584',
    iconClass: 'fab fa-instagram'
  },
  {
    key: 'blockdit',
    label: 'Blockdit',
    bg: '#f0f0f0',
    color: '#444444',
    iconClass: 'fas fa-th-large'
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    bg: '#f0f0f0',
    color: '#111111',
    iconClass: 'fab fa-tiktok'
  },
  {
    key: 'threads',
    label: 'Threads',
    bg: '#f0f0f0',
    color: '#111111',
    iconClass: 'fab fa-threads'
  },
  {
    key: 'telegram',
    label: 'Telegram',
    bg: '#e8f6fd',
    color: '#2ca5e0',
    iconClass: 'fab fa-telegram-plane'
  }
]

const COMMIT_MAP = {
  post: 'setSocialDomain',
  postword: 'setWordCloudSocial',
  posthash: 'setHashtagSocial',
  feed: 'setSocialFeed'
}

const SCROLL_STEP = 180
const DESKTOP_BREAKPOINT = 1024

export default {
  name: 'SocialTabFilter',

  props: {
    tabsocial: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      platforms: PLATFORMS,
      activeSocial: '',
      isDesktop: false,
      isOverflowing: false,
      atStart: true,
      atEnd: false,
      resizeObserver: null
    }
  },

  computed: {
    ...mapGetters(['getArrDate', 'getQuerySearch', 'getWordCloudHashtag','getSourceNews']),

    showLeftArrow() {
      return this.isDesktop && this.isOverflowing && !this.atStart
    },

    showRightArrow() {
      return this.isDesktop && this.isOverflowing && !this.atEnd
    }
  },

  watch: {
    getArrDate() {
      this.resetActive()
    },
    getQuerySearch() {
      this.resetActive()
    },
    getSourceNews() {
      this.resetActive()
    },
    getWordCloudHashtag() {
      this.resetActive()
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.refreshScrollState()
      this.initResizeObserver()
    })

    window.addEventListener('resize', this.handleResize)
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)

    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }

    this.$store.commit('setSocialDomain', '')
    this.$store.commit('setSocialFeed', '')
  },

  methods: {
    setActive(key) {
      this.activeSocial = key

      const mutation = COMMIT_MAP[this.tabsocial]
      if (mutation) {
        this.$store.commit(mutation, key)
      }

      this.$nextTick(() => {
        this.scrollActiveIntoView()
        this.refreshScrollState()
      })
    },

    resetActive() {
      this.activeSocial = ''
      this.$nextTick(() => {
        this.refreshScrollState()
      })
    },

    scrollTabs(dir) {
      const el = this.$refs.scrollWrap
      if (!el) return

      el.scrollBy({
        left: dir * SCROLL_STEP,
        behavior: 'smooth'
      })

      setTimeout(() => {
        this.refreshScrollState()
      }, 250)
    },

    scrollActiveIntoView() {
      const wrap = this.$refs.scrollWrap
      if (!wrap) return

      const activeEl = wrap.querySelector('.tab-btn.active')
      if (!activeEl) return

      activeEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      })
    },

    updateScrollState() {
      const el = this.$refs.scrollWrap
      if (!el) return

      const maxScrollLeft = Math.max(0, el.scrollWidth - el.clientWidth)
      this.atStart = el.scrollLeft <= 2
      this.atEnd = el.scrollLeft >= maxScrollLeft - 2
    },

    updateOverflowState() {
      const wrap = this.$refs.scrollWrap
      const inner = this.$refs.scrollInner
      if (!wrap || !inner) return

      this.isOverflowing = inner.scrollWidth > wrap.clientWidth + 2
    },

    updateViewport() {
      if (typeof window === 'undefined') return
      this.isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT
    },

    refreshScrollState() {
      this.updateViewport()
      this.updateOverflowState()
      this.updateScrollState()
    },

    handleResize() {
      this.$nextTick(() => {
        this.refreshScrollState()
      })
    },

    initResizeObserver() {
      if (typeof ResizeObserver === 'undefined') return

      const wrap = this.$refs.scrollWrap
      const inner = this.$refs.scrollInner
      if (!wrap || !inner) return

      this.resizeObserver = new ResizeObserver(() => {
        this.refreshScrollState()
      })

      this.resizeObserver.observe(wrap)
      this.resizeObserver.observe(inner)
    }
  }
}
</script>

<style scoped>
.social-tab-bar {
  min-width: 0;
  background: #ffffff;
  border: 1px solid #e4e4e4;
  border-radius: 14px;
  padding: 7px 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.scroll-wrap {
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  padding: 0px 20px;
}

.scroll-wrap::-webkit-scrollbar {
  display: none;
}

.scroll-inner {
  gap: 5px;
  min-width: max-content;
  padding: 2px 0;
}

.tab-btn {
  flex-shrink: 0;
  gap: 6px;
  padding: 5px 12px 5px 6px !important;
  border-radius: 999px !important;
  border: 1px solid #e8e8e8 !important;
  background: #f7f7f7 !important;
  cursor: pointer;
  font-size: 13px;
  font-weight: 400;
  color: #666 !important;
  white-space: nowrap;
  line-height: 1;
  user-select: none;
  box-shadow: none !important;
  outline: none !important;
}

.tab-btn:hover {
  border-color: #c0c0c0 !important;
  background: #efefef !important;
  color: #111 !important;
}

.tab-btn.active {
  background: #fff7cc !important;      /* เหลืองอ่อน */
  border-color: #ffd54f !important;    /* เหลือง */
  color: #b8860b !important;           /* ตัวหนังสือโทนเหลืองเข้ม */
  font-weight: 500;
  box-shadow: 0 1px 4px rgba(255, 193, 7, 0.25) !important;
}

.platform-icon {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 11px;
}

.tab-label {
  line-height: 1;
}

.active-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #a975e4;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.15s;
}

.tab-btn.active .active-dot {
  opacity: 1;
}

.arrow-btn {
  position: absolute;
  top: 50%;
  z-index: 5;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  border-radius: 999px !important;
  border: 1px solid #d0d0d0 !important;
  background: rgba(255, 255, 255, 0.664) !important;
  color: #444 !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12) !important;
  min-width: 30px;
}

.arrow-btn-left {
  left: 2px;
}

.arrow-btn-right {
  right: 2px;
}

@media (max-width: 1023px) {
  /* .arrow-btn {
    display: none !important;
  } */

  .social-tab-bar {
    padding: 6px;
    border-radius: 12px;
  }

  .tab-btn {
    font-size: 12px;
    padding: 5px 10px 5px 5px !important;
  }

  .platform-icon {
    width: 18px;
    height: 18px;
    font-size: 10px;
  }
}
</style>