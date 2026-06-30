<template>
  <b-card class="mb-3 shadow-sm card-post">
    <div class="d-flex">
      <!-- Avatar -->
      <b-avatar :src="avatar" size="72" class="mr-3 flex-shrink-0" />

      <div class="flex-grow-1">
        <!-- Header: ชื่อผู้ใช้ + แพลตฟอร์ม -->
        <div class="d-flex align-items-center mb-1">
          <strong class="mr-2">{{ username }}</strong>
          <b-badge :variant="platformVariant" class="text-uppercase mr-2">
            <span class="mr-1" v-if="platformIcon">{{ platformIcon }}</span>{{ platform }}
          </b-badge>

          <b-badge v-if="status" variant="success" class="mr-2">
            <span class="dot dot--green mr-1"></span>{{ status }}
          </b-badge>

          <b-button
            v-if="link"
            size="sm"
            variant="outline-secondary"
            class="ml-auto"
            :href="link"
            target="_blank"
          >
            Go to link
          </b-button>
        </div>

        <!-- เนื้อหาโพสต์ -->
        <p class="mb-2 text-body">
          {{ content }}
        </p>

        <!-- รูปภาพ/สื่อ -->
        <b-img
          v-if="image"
          :src="image"
          fluid
          rounded
          class="mb-2"
          alt="post media"
        />

        <!-- Footer: เวลา -->
        <small class="text-muted">
          {{ time }}
        </small>
      </div>

    </div>
  </b-card>
</template>

<script>
export default {
  name: 'CardPost',
  props: {
    avatar: { type: String, default: '' },
    username: { type: String, default: '' },
    platform: { type: String, default: 'Facebook' }, // Facebook | X | Instagram | Pantip | Youtube | News | Tiktok | Blockdit | Threads
    content:  { type: String, default: '' },
    time:     { type: String, default: '' }, // e.g. '16.06.25 09:00'
    link:     { type: String, default: '' },
    image:    { type: String, default: '' },
    status:   { type: String, default: '' } // e.g. 'Succeed'
  },
  computed: {
    platformVariant () {
      const map = {
        Facebook: 'primary',
        X: 'dark',
        Instagram: 'danger',
        Pantip: 'purple',
        Youtube: 'danger',
        News: 'secondary',
        Tiktok: 'dark',
        Blockdit: 'info',
        Threads: 'secondary'
      }
      return map[this.platform] || 'secondary'
    },
    platformIcon () {
      // ใช้ emoji/ตัวอักษรแทนไอคอน เพื่อความเบา (ปรับได้)
      const map = {
        Facebook: '📘',
        X: '✖️',
        Instagram: '📸',
        Pantip: '💬',
        Youtube: '▶️',
        News: '📰',
        Tiktok: '🎵',
        Blockdit: '🧩',
        Threads: '🧵'
      }
      return map[this.platform] || ''
    }
  }
}
</script>

<style scoped>
.card-post {
  border-radius: 14px;
}
.dot {
  display:inline-block; width:8px; height:8px; border-radius:50%;
}
.dot--green { background:#27ae60; }
</style>
