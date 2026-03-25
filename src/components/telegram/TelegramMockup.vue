<template>
  <div class="tg-feed-wrapper">
    <!-- Header -->
    <div class="feed-header mb-4">
      <div class="d-flex align-items-center">
        <div class="tg-icon-wrap mr-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </div>
        <div>
          <h4 class="mb-0 feed-title">Telegram Feed</h4>
          <small class="text-muted">{{ totalPosts }} posts · {{ uniqueAccounts }} channels</small>
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <b-tabs v-model="activeTab" pills class="mb-4 filter-tabs">
      <b-tab title="All Posts" />
      <b-tab v-for="acc in accountList" :key="acc.id" :title="acc.shortName" />
    </b-tabs>

    <!-- Sort & Stats Bar -->
    <b-row class="mb-3 align-items-center">
      <b-col cols="auto">
        <b-form-select v-model="sortBy" :options="sortOptions" size="sm" class="sort-select" />
      </b-col>
      <b-col class="text-right">
        <b-badge variant="light" class="stat-badge mr-2">
          <span class="text-muted">Total Engagement:</span>
          <strong class="ml-1">{{ totalEngagement.toLocaleString() }}</strong>
        </b-badge>
      </b-col>
    </b-row>

    <!-- Post Cards -->
    <transition-group name="fade-slide" tag="div">
      <b-card
        v-for="post in filteredPosts"
        :key="post.uid"
        class="tg-post-card mb-3"
        no-body
      >
        <b-card-body class="p-3">
          <!-- Account Header -->
          <div class="d-flex align-items-start mb-3">
            <div class="avatar-circle mr-3" :style="{ background: getAccountColor(post.account_name) }">
              {{ getInitials(post.account_name) }}
            </div>
            <div class="flex-grow-1">
              <div class="d-flex align-items-center justify-content-between flex-wrap">
                <div>
                  <span class="account-name">{{ post.account_name }}</span>
                  <b-badge :variant="getAccountBadgeVariant(post.account_name)" class="ml-2 badge-channel">
                    {{ getChannelLabel(post.account_name) }}
                  </b-badge>
                </div>
                <small class="text-muted post-time">
                  <b-icon icon="clock" class="mr-1" />
                  {{ formatDate(post.date) }}
                </small>
              </div>
              <a :href="post.account_url" target="_blank" class="account-url">
                <b-icon icon="link45deg" class="mr-1" />{{ post.account_url.replace('https://web.telegram.org/k/#', 'ID: ') }}
              </a>
            </div>
          </div>

          <!-- Post Text -->
          <div v-if="post.full_text" class="post-text mb-3">
            <div :class="{ collapsed: !expandedPosts[post.uid] && post.full_text.length > 280 }">
              {{ expandedPosts[post.uid] || post.full_text.length <= 280 ? post.full_text : post.full_text.slice(0, 280) + '...' }}
            </div>
            <b-link
              v-if="post.full_text.length > 280"
              class="read-more-link"
              @click="toggleExpand(post.uid)"
            >
              {{ expandedPosts[post.uid] ? 'Show less ▲' : 'Read more ▼' }}
            </b-link>
          </div>

          <!-- No Text Placeholder -->
          <div v-else class="no-text-placeholder mb-3">
            <b-icon icon="images" class="mr-2" /> Media only post
          </div>

          <!-- Photo Count -->
          <div v-if="post.photos && post.photos.length > 0" class="photo-strip mb-3">
            <div class="photo-thumb" v-for="(p, i) in post.photos.slice(0, 5)" :key="i">
              <b-icon icon="image" />
            </div>
            <div v-if="post.photos.length > 5" class="photo-thumb more-photos">
              +{{ post.photos.length - 5 }}
            </div>
          </div>

          <!-- Footer: Engagement -->
          <div class="d-flex align-items-center justify-content-between post-footer">
            <div class="d-flex align-items-center engagement-bar">
              <b-icon icon="heart-fill" class="text-danger mr-1" />
              <span class="engagement-count">{{ post.engagement.toLocaleString() }}</span>
              <span class="text-muted ml-1 small">engagements</span>
            </div>
            <div class="d-flex align-items-center">
              <span v-if="post.photos.length > 0" class="media-chip mr-2">
                <b-icon icon="image" class="mr-1" />{{ post.photos.length }} photo{{ post.photos.length > 1 ? 's' : '' }}
              </span>
              <span v-if="post.vdo_embedded.length > 0" class="media-chip">
                <b-icon icon="play-circle" class="mr-1" />{{ post.vdo_embedded.length }} video{{ post.vdo_embedded.length > 1 ? 's' : '' }}
              </span>
            </div>
          </div>
        </b-card-body>
      </b-card>
    </transition-group>

    <!-- Empty State -->
    <div v-if="filteredPosts.length === 0" class="empty-state text-center py-5">
      <b-icon icon="inbox" font-scale="3" class="text-muted mb-3" />
      <p class="text-muted">No posts found</p>
    </div>
  </div>
</template>

<script>
const RAW_DATA = [
  {uid:"peer=-2392498313_timestamp=1771424874",source:"telegram",account_url:"https://web.telegram.org/k/#-2392498313",account_name:"Senate of Cambodia",date:"2026-02-18 21:27:54",photos:["a","b"],vdo_embedded:[],engagement:5,full_text:"គណៈប្រតិភូគណៈកម្មការទី៨ព្រឹទ្ធសភា អញ្ជើញចុះជួបសំណេះសំណាលជាមួយតំណាងរោងចក្រអារ៉ូម៉ា សឹកសេស ហ្គាម៉ិន ឯ.ក \n=======\nក្នុងអំឡុងពេលបំពេញបេសកកម្មនៅខេត្តកំពង់ស្ពឺ នាថ្ងៃត្រង់ថ្ងៃពុធ ២កើត ខែផល្គុន ឆ្នាំម្សាញ់ សប្តស័ក ពុទ្ធសករាជ ២៥៦៩ ត្រូវនឹងថ្ងៃទី១៨ ខែកុម្ភៈ ឆ្នាំ២០២៦ គណៈប្រតិភូគណៈកម្មការ ដែលស្ថិតនៅឃុំទំព័រមាស ស្រុកសំរោងទង ខេត្តកំពង់ស្ពឺ ដើម្បីឈ្វេងយល់ពីខ្សែចង្វាក់ផលិតកម្មវាយនភ័ណ្ឌកាត់ដេរ លក្ខខណ្ឌការងារ បច្ចេកទេសផលិត និងសុខសុវត្ថិភាពកម្មករនិយោជិត។"},
  {uid:"peer=-2392498313_timestamp=1771467842",source:"telegram",account_url:"https://web.telegram.org/k/#-2392498313",account_name:"Senate of Cambodia",date:"2026-02-19 09:24:02",photos:["a","b","c"],vdo_embedded:[],engagement:2,full_text:"សម្តេចរាជបុត្រីព្រះអនុជ នរោត្តម អរុណរស្មី សព្វព្រះហឫទ័យអនុញ្ញាតជូនឯកឧត្តម ឯកអគ្គរដ្ឋទូតវិសាមញ្ញ និងពេញសមត្ថភាព នៃសាធារណរដ្ឋឥណ្ឌូណេស៊ី ប្រចាំកម្ពុជា ចូលជួបថ្វាយបង្គំលា"},
  {uid:"peer=-2392498313_timestamp=1771469611",source:"telegram",account_url:"https://web.telegram.org/k/#-2392498313",account_name:"Senate of Cambodia",date:"2026-02-19 09:53:31",photos:["a","b","c","d","e","f"],vdo_embedded:[],engagement:2,full_text:"ឯកឧត្តម យស ផានីត្តា អញ្ជើញដឹកនាំកិច្ចប្រជុំផ្ទៃក្នុងគណៈកម្មការទី២ព្រឹទ្ធសភា\n=======\nគណៈកម្មការសេដ្ឋកិច្ច ហិរញ្ញវត្ថុ និងសវនកម្ម នៃព្រឹទ្ធសភា (គណៈកម្មការទី២) បានរៀបចំកិច្ចប្រជុំផ្ទៃក្នុងគណៈកម្មការ"},
  {uid:"peer=-2392498313_timestamp=1771471369",source:"telegram",account_url:"https://web.telegram.org/k/#-2392498313",account_name:"Senate of Cambodia",date:"2026-02-19 10:22:49",photos:["a","b","c","d","e","f","g","h","i","j"],vdo_embedded:[],engagement:0,full_text:""},
  {uid:"peer=-2392498313_timestamp=1771471370",source:"telegram",account_url:"https://web.telegram.org/k/#-2392498313",account_name:"Senate of Cambodia",date:"2026-02-19 10:22:50",photos:["a","b","c","d","e","f"],vdo_embedded:[],engagement:1,full_text:"ឯកឧត្តម លី សារី អញ្ជើញជួបសំណេះសំណាលជាមួយថ្នាក់ដឹកនាំ ប្រជាពលរដ្ឋ និងគោរពវិញ្ញាណក្ខន្ធសពប្រជាពលរដ្ឋ នៅខេត្តកំពត"},
  {uid:"peer=-1367360638_timestamp=1771168188",source:"telegram",account_url:"https://web.telegram.org/k/#-1367360638",account_name:"Samdech Thipadei Hun Manet, Prime Minister of Cambodia",date:"2026-02-15 22:09:48",photos:["a","b","c","d","e"],vdo_embedded:[],engagement:2974,full_text:""},
  {uid:"peer=-1367360638_timestamp=1771201903",source:"telegram",account_url:"https://web.telegram.org/k/#-1367360638",account_name:"Samdech Thipadei Hun Manet, Prime Minister of Cambodia",date:"2026-02-16 07:31:43",photos:["a"],vdo_embedded:[],engagement:2884,full_text:"វីដេអូសង្ខេបសកម្មភាពរបស់ សម្តេចមហាបវរធិបតី ហ៊ុន ម៉ាណែត នាយករដ្ឋមន្ត្រី នៃព្រះរាជាណាចក្រកម្ពុជា ពីថ្ងៃទី៩-១៥ កុម្ភៈ ២០២៦"},
  {uid:"peer=-1367360638_timestamp=1771249532",source:"telegram",account_url:"https://web.telegram.org/k/#-1367360638",account_name:"Samdech Thipadei Hun Manet, Prime Minister of Cambodia",date:"2026-02-16 20:45:32",photos:["a","b","c","d","e","f","g","h","i"],vdo_embedded:[],engagement:3376,full_text:"គណៈប្រតិភូរាជរដ្ឋាភិបាលកម្ពុជាបានមកដល់សហរដ្ឋអាមេរិកប្រកបដោយសុវត្ថិភាព ដោយបានការទទួលស្វាគមន៍ពីសំណាក់ ឯកអគ្គរាជទូតកម្ពុជា ប្រចាំសហរដ្ឋអាមេរិក The Royal Government of Cambodia delegation arrived safely at the United States of America."},
  {uid:"peer=-1367360638_timestamp=1771425924",source:"telegram",account_url:"https://web.telegram.org/k/#-1367360638",account_name:"Samdech Thipadei Hun Manet, Prime Minister of Cambodia",date:"2026-02-18 21:45:24",photos:["a","b","c","d","e","f","g","h","i"],vdo_embedded:[],engagement:615,full_text:"ជូនពរ ខែរ៉ម៉ាឌន - Ramadan Mubarak message from the Prime Minister"},
  {uid:"peer=-1367360638_timestamp=1771429562",source:"telegram",account_url:"https://web.telegram.org/k/#-1367360638",account_name:"Samdech Thipadei Hun Manet, Prime Minister of Cambodia",date:"2026-02-18 22:46:02",photos:["a"],vdo_embedded:[],engagement:585,full_text:"វីដេអូ៖សារពិសេសរបស់ សម្តេចមហាបវរធិបតី ហ៊ុន ម៉ាណែត នាយករដ្ឋមន្ត្រីនៃព្រះរាជាណាចក្រកម្ពុជា"},
  {uid:"peer=-1367360638_timestamp=1771461596",source:"telegram",account_url:"https://web.telegram.org/k/#-1367360638",account_name:"Samdech Thipadei Hun Manet, Prime Minister of Cambodia",date:"2026-02-19 07:39:56",photos:["a","b","c","d","e","f","g","h"],vdo_embedded:[],engagement:668,full_text:"ជួបជាមួយ ឯកឧត្ដមឯកអគ្គរដ្ឋទូត Jamieson Greer តំណាងពាណិជ្ជកម្មសហរដ្ឋអាមេរិក Meeting with Ambassador Jamieson Greer, United States Trade Representative."},
  {uid:"peer=-1782078279_timestamp=1771166169",source:"telegram",account_url:"https://web.telegram.org/k/#-1782078279",account_name:"Samdech Hun Sen of Cambodia",date:"2026-02-15 21:36:09",photos:["a"],vdo_embedded:[],engagement:1234,full_text:"រាជធានីភ្នំពេញ មានឱកាសការងារជូនបងប្អូនប្រជាពលរដ្ឋ ជាពិសេសអតីតពលករដែលវិលត្រឡប់មកកម្ពុជាវិញ ចំនួន ២៦,៨៥៦ កន្លែង"},
  {uid:"peer=-1782078279_timestamp=1771206834",source:"telegram",account_url:"https://web.telegram.org/k/#-1782078279",account_name:"Samdech Hun Sen of Cambodia",date:"2026-02-16 08:53:54",photos:["a"],vdo_embedded:[],engagement:1152,full_text:"វឌ្ឍនភាព នៃការស្ថាបនាកំណាត់ផ្លូវលេខ1534 ដើម្បីលើកកម្ពស់សេវាដឹកជញ្ជូន និងការតភ្ជាប់"},
  {uid:"peer=-1782078279_timestamp=1771214604",source:"telegram",account_url:"https://web.telegram.org/k/#-1782078279",account_name:"Samdech Hun Sen of Cambodia",date:"2026-02-16 11:03:24",photos:["a"],vdo_embedded:[],engagement:1330,full_text:"បទយកការណ៍៖ សក្ដានុពល និងភាពរីកចម្រើននៃតំបន់ភូមិសាស្ត្រខាងត្បូងរាជធានីភ្នំពេញ"},
  {uid:"peer=-1782078279_timestamp=1771239588",source:"telegram",account_url:"https://web.telegram.org/k/#-1782078279",account_name:"Samdech Hun Sen of Cambodia",date:"2026-02-16 17:59:48",photos:["a"],vdo_embedded:[],engagement:1170,full_text:"សម្តេចអគ្គមហាសេនាបតីតេជោ ហ៊ុន សែន ប្រធានព្រឹទ្ធសភានៃព្រះរាជាណាចក្រកម្ពុជា ផ្ញើសារលិខិតជូនពរ"},
  {uid:"peer=-1782078279_timestamp=1771249629",source:"telegram",account_url:"https://web.telegram.org/k/#-1782078279",account_name:"Samdech Hun Sen of Cambodia",date:"2026-02-16 20:47:09",photos:["a","b","c","d","e","f","g","h","i"],vdo_embedded:[],engagement:1964,full_text:"គណៈប្រតិភូរាជរដ្ឋាភិបាលកម្ពុជាបានមកដល់សហរដ្ឋអាមេរិក The Royal Government of Cambodia delegation arrived safely at the USA."},
  {uid:"peer=-1782078279_timestamp=1771296681",source:"telegram",account_url:"https://web.telegram.org/k/#-1782078279",account_name:"Samdech Hun Sen of Cambodia",date:"2026-02-17 09:51:21",photos:["a","b","c","d","e","f","g","h","i","j"],vdo_embedded:[],engagement:1739,full_text:"សម្តេចអគ្គមហាសេនាបតីតេជោ ហ៊ុន សែន ប្រធានព្រឹទ្ធសភា អនុញ្ញាតឱ្យ ឯកឧត្តម Saichay Kommasith ចូលជួបសម្តែងការគួរសម"},
  {uid:"peer=-1782078279_timestamp=1771312943",source:"telegram",account_url:"https://web.telegram.org/k/#-1782078279",account_name:"Samdech Hun Sen of Cambodia",date:"2026-02-17 14:22:23",photos:["a"],vdo_embedded:[],engagement:1587,full_text:"វីដេអូ៖ សម្តេចអគ្គមហាសេនាបតីតេជោ ហ៊ុន សែន ប្រធានព្រឹទ្ធសភា អនុញ្ញាតឱ្យ Saichay Kommasith ចូលជួបសម្តែងការគួរសម"},
  {uid:"peer=-1782078279_timestamp=1771388985",source:"telegram",account_url:"https://web.telegram.org/k/#-1782078279",account_name:"Samdech Hun Sen of Cambodia",date:"2026-02-18 11:29:45",photos:["a"],vdo_embedded:[],engagement:1643,full_text:"ខ្ញុំទទួលបានរូបថតមួយសន្លឹក - Lee Hsien Loong shared an ASEAN-US Summit photo memory from 10 years ago."},
  {uid:"peer=-1782078279_timestamp=1771395570",source:"telegram",account_url:"https://web.telegram.org/k/#-1782078279",account_name:"Samdech Hun Sen of Cambodia",date:"2026-02-18 13:19:30",photos:["a"],vdo_embedded:[],engagement:1586,full_text:"សម្តេចតេជោ ហ៊ុន សែន បានផ្ញើសារសួរសុខទុក្ខដល់ Lee Hsien Loong and other former ASEAN leaders"},
  {uid:"peer=-1782078279_timestamp=1771418617",source:"telegram",account_url:"https://web.telegram.org/k/#-1782078279",account_name:"Samdech Hun Sen of Cambodia",date:"2026-02-18 19:43:37",photos:["a"],vdo_embedded:[],engagement:1254,full_text:"ក្រុមការងារសប្បុរសធម៌សម្តេចពុក ហ៊ុន សែន - Prey Lang Forest conservation festival held in Kampong Thom province."}
]

export default {
  name: 'TelegramFeed',
  data() {
    return {
      posts: RAW_DATA,
      activeTab: 0,
      sortBy: 'date_desc',
      expandedPosts: {},
      sortOptions: [
        { value: 'date_desc', text: '🕐 Latest First' },
        { value: 'date_asc', text: '🕐 Oldest First' },
        { value: 'engagement_desc', text: '🔥 Most Engaged' },
        { value: 'engagement_asc', text: '📉 Least Engaged' },
      ],
      accountColors: {
        'Senate of Cambodia': '#1a73e8',
        'Samdech Thipadei Hun Manet, Prime Minister of Cambodia': '#e53935',
        'Samdech Hun Sen of Cambodia': '#2e7d32',
      },
    }
  },
  computed: {
    uniqueAccounts() {
      return [...new Set(this.posts.map(p => p.account_name))].length
    },
    totalPosts() {
      return this.posts.length
    },
    totalEngagement() {
      return this.filteredPosts.reduce((s, p) => s + p.engagement, 0)
    },
    accountList() {
      const names = [...new Set(this.posts.map(p => p.account_name))]
      return names.map((name, i) => ({
        id: i,
        name,
        shortName: this.getShortName(name),
      }))
    },
    filteredPosts() {
      let result = [...this.posts]
      if (this.activeTab > 0) {
        const selectedAccount = this.accountList[this.activeTab - 1].name
        result = result.filter(p => p.account_name === selectedAccount)
      }
      switch (this.sortBy) {
        case 'date_desc': result.sort((a, b) => new Date(b.date) - new Date(a.date)); break
        case 'date_asc': result.sort((a, b) => new Date(a.date) - new Date(b.date)); break
        case 'engagement_desc': result.sort((a, b) => b.engagement - a.engagement); break
        case 'engagement_asc': result.sort((a, b) => a.engagement - b.engagement); break
      }
      return result
    },
  },
  methods: {
    getInitials(name) {
      return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    },
    getShortName(name) {
      if (name === 'Senate of Cambodia') return 'Senate'
      if (name.includes('Hun Manet')) return 'PM Manet'
      if (name.includes('Hun Sen')) return 'Hun Sen'
      return name.slice(0, 10)
    },
    getAccountColor(name) {
      return this.accountColors[name] || '#607d8b'
    },
    getAccountBadgeVariant(name) {
      if (name === 'Senate of Cambodia') return 'primary'
      if (name.includes('Hun Manet')) return 'danger'
      return 'success'
    },
    getChannelLabel(name) {
      if (name === 'Senate of Cambodia') return 'Senate'
      if (name.includes('Hun Manet')) return 'PM Office'
      return 'Former PM'
    },
    formatDate(dateStr) {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
    toggleExpand(uid) {
      this.$set(this.expandedPosts, uid, !this.expandedPosts[uid])
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');

.tg-feed-wrapper {
  font-family: 'IBM Plex Sans', sans-serif;
  max-width: 780px;
  margin: 0 auto;
  padding: 24px 16px;
  background: #f4f6fa;
  min-height: 100vh;
}

/* Header */
.feed-header {
  background: linear-gradient(135deg, #0088cc 0%, #005f99 100%);
  border-radius: 16px;
  padding: 20px 24px;
  color: white;
  box-shadow: 0 4px 20px rgba(0,136,204,0.3);
}
.tg-icon-wrap {
  background: rgba(255,255,255,0.2);
  border-radius: 12px;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.feed-title {
  font-weight: 600;
  font-size: 1.25rem;
  color: white;
}

/* Tabs */
.filter-tabs >>> .nav-pills .nav-link {
  color: #555;
  border-radius: 20px;
  font-size: 0.85rem;
  padding: 6px 14px;
  transition: all 0.2s;
}
.filter-tabs >>> .nav-pills .nav-link.active {
  background: #0088cc;
  color: white;
  box-shadow: 0 2px 8px rgba(0,136,204,0.35);
}

/* Sort & Stats */
.sort-select {
  border-radius: 20px;
  border: 1.5px solid #dde2ec;
  font-size: 0.85rem;
  color: #333;
  background: white;
}
.stat-badge {
  border: 1.5px solid #dde2ec;
  background: white;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 0.84rem;
}

/* Post Cards */
.tg-post-card {
  border: none;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  transition: transform 0.2s, box-shadow 0.2s;
  background: white;
}
.tg-post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(0,0,0,0.12);
}

/* Avatar */
.avatar-circle {
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  font-family: 'IBM Plex Mono', monospace;
  letter-spacing: -0.5px;
}
.account-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1a1a2e;
  line-height: 1.2;
}
.badge-channel {
  font-size: 0.72rem;
  border-radius: 10px;
  font-weight: 500;
}
.account-url {
  font-size: 0.75rem;
  color: #0088cc;
  text-decoration: none;
  font-family: 'IBM Plex Mono', monospace;
}
.account-url:hover { text-decoration: underline; }
.post-time {
  font-size: 0.78rem;
  white-space: nowrap;
}

/* Post Text */
.post-text {
  font-size: 0.9rem;
  color: #333;
  line-height: 1.65;
  white-space: pre-line;
  background: #f8f9fc;
  border-radius: 10px;
  padding: 12px 14px;
  border-left: 3px solid #0088cc;
}
.read-more-link {
  font-size: 0.8rem;
  color: #0088cc;
  cursor: pointer;
  display: block;
  margin-top: 6px;
  text-decoration: none;
}
.no-text-placeholder {
  color: #aaa;
  font-size: 0.85rem;
  font-style: italic;
}

/* Photos Strip */
.photo-strip {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.photo-thumb {
  width: 40px;
  height: 40px;
  background: #e8f4fd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0088cc;
  font-size: 1rem;
  border: 1.5px solid #d0e8f8;
}
.more-photos {
  font-size: 0.75rem;
  font-weight: 600;
  color: #555;
  background: #eee;
  border-color: #ddd;
}

/* Footer */
.post-footer {
  border-top: 1px solid #f0f0f0;
  padding-top: 10px;
  margin-top: 4px;
}
.engagement-count {
  font-weight: 700;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.9rem;
  color: #1a1a2e;
}
.media-chip {
  background: #f0f4ff;
  color: #3b5bdb;
  border-radius: 12px;
  font-size: 0.77rem;
  padding: 3px 10px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
}

/* Empty State */
.empty-state { color: #aaa; }

/* Transitions */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>