<template>
  <div class="tg-app" :class="{ 'dark': isDark, 'light': !isDark }">
    <back-to-top bottom="150px" right="50px">
      <button type="button" class="btn btn-to-top">
        <i class="fa fa-chevron-up"></i>
      </button>
    </back-to-top>

    <!-- TOP NAV -->
    <div class="topnav">
      <div class="topnav-brand">
        <div class="tg-logo">
          <i class="fa fa-telegram" aria-hidden="true" style="font-size: 40px;color: #38bdf8;"></i>
        </div>
        <div class="text-left">
          <div class="brand-text">Telegram Feed Monitor</div>
          <div class="brand-sub">Cambodia Government Channels</div>
        </div>
      </div>
      <button class="theme-toggle-btn" @click="isDark = !isDark" :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
        <span v-if="isDark">☀️ Light</span>
        <span v-else>🌙 Dark</span>
      </button>
    </div>

    <div class="page-wrap">
      <!-- STAT CARDS -->
      <div class="stat-grid">
        <div class="stat-card orange">
          <div class="stat-icon">📨</div>
          <div class="stat-label">Total Posts</div>
          <div class="stat-value">{{ posts.length }}</div>
          <div class="stat-sub">across all channels</div>
        </div>
        <div class="stat-card pink">
          <div class="stat-icon">📡</div>
          <div class="stat-label">Channels</div>
          <div class="stat-value">{{ uniqueAccounts }}</div>
          <div class="stat-sub">active accounts</div>
        </div>
        <div class="stat-card amber">
          <div class="stat-icon">❤️</div>
          <div class="stat-label">Total Engagement</div>
          <div class="stat-value">{{ totalEngagement.toLocaleString() }}</div>
          <div class="stat-sub">combined reactions</div>
        </div>
        <div class="stat-card coral">
          <div class="stat-icon">🏆</div>
          <div class="stat-label">Top Post</div>
          <div class="stat-value">{{ topPost.engagement.toLocaleString() }}</div>
          <div class="stat-sub">{{ topPost.shortAccount }}</div>
        </div>
        <div class="stat-card sage">
          <div class="stat-icon">📸</div>
          <div class="stat-label">Total Photos</div>
          <div class="stat-value">{{ totalPhotos }}</div>
          <div class="stat-sub">media attachments</div>
        </div>
        <div class="stat-card sky">
          <div class="stat-icon">📊</div>
          <div class="stat-label">Avg Engagement</div>
          <div class="stat-value">{{ avgEngagement }}</div>
          <div class="stat-sub">per post</div>
        </div>
      </div>

      <!-- CHANNEL BREAKDOWN -->
      <b-card class="breakdown-card mb-3" no-body>
        <b-card-body>
          <div class="breakdown-title text-left">
            Channel Engagement Breakdown
            <div style="font-weight: 200;font-size: small;"> สรุปยอด Engagement รายช่อง</div>
          </div>
          <div v-for="ch in channelStats" :key="ch.name" class="channel-row">
            <div class="channel-dot" :style="{ background: ch.color }"></div>
            <div class="channel-name-sm">{{ ch.shortName }}</div>
            <b-progress :value="ch.pct" max="100" class="channel-progress flex-grow-1"
              :style="{ '--bar-color': ch.color }" />
            <div class="channel-eng-count">{{ ch.engagement.toLocaleString() }}</div>
            <b-badge variant="light" class="channel-posts-badge">{{ ch.posts }} posts</b-badge>
          </div>
        </b-card-body>
      </b-card>

      <!-- MAIN LAYOUT -->
      <b-row>
        <!-- SIDEBAR -->
        <b-col cols="12" md="3" class="mb-3 mb-md-0">
          <!-- Date Range -->
          <b-card class="sidebar-card mb-3" no-body>
            <b-card-body>
              <div class="sidebar-title">📅 Date Range</div>
              <div class="date-range-info">
                <div>From: <strong>{{ dateRange.from }}</strong></div>
                <div class="mt-1">To: <strong>{{ dateRange.to }}</strong></div>
              </div>
            </b-card-body>
          </b-card>

          <!-- Filter -->
          <b-card class="sidebar-card mb-3" no-body>
            <b-card-body>
              <div class="sidebar-title">🔍 Filter by Channel</div>
              <button class="filter-btn" :class="{ active: selectedChannel === 'all' }"
                @click="selectedChannel = 'all'">
                <span class="filter-dot" style="background:#f7a23e"></span>
                All Channels
                <b-badge pill variant="warning" class="ml-auto filter-count-badge">{{ posts.length }}</b-badge>
              </button>
              <button v-for="ch in channelStats" :key="ch.name" class="filter-btn"
                :class="{ active: selectedChannel === ch.name }" @click="selectedChannel = ch.name">
                <span class="filter-dot" :style="{ background: ch.color }"></span>
                {{ ch.shortName }}
                <b-badge pill variant="light" class="ml-auto filter-count-badge">{{ ch.posts }}</b-badge>
              </button>
            </b-card-body>
          </b-card>

          <!-- Sort -->
          <b-card class="sidebar-card" no-body>
            <b-card-body>
              <div class="sidebar-title"><i class="fa fa-filter" aria-hidden="true"></i> Sort by</div>
              <b-form-group class="mb-0 text-left">
                <b-form-radio-group v-model="sortBy" :options="sortOptions" stacked class="sort-radio-group" />
              </b-form-group>
            </b-card-body>
          </b-card>
        </b-col>

        <!-- FEED -->
        <b-col cols="12" md="9">
          <div class="text-right mb-3">
            <span class="feed-eng-total text-right h6">
              <span><strong>{{ filteredPosts.length }} </strong><span class="small">Posts</span></span> |
              <span><strong>{{ filteredEngagement.toLocaleString() }}</strong> <span class="small">Engagement</span></span>
            </span>
          </div>

          <transition-group name="fade" tag="div">
            <b-card v-for="post in filteredPosts" :key="post.uid" no-body class="post-card mb-3"
              :class="getCardClass(post.account_name)">
              <b-card-body class="p-3">

                <!-- Account Header -->
                <div class="post-top">
                  <div class="avatar-wrap">
                    <img v-if="post.account_profile_image" :src="post.account_profile_image"
                      class="avatar-img"
                      :style="{ 'border-color': getColor(post.account_name) }"
                      @error="$event.target.style.display='none'" />
                    <div class="avatar" :style="{ background: getColor(post.account_name) }">
                      {{ getInitials(post.account_name || post.sender_name) }}
                    </div>
                  </div>
                  <div class="post-meta flex-grow-1">
                    <div class="d-flex align-items-center flex-wrap">
                      <span class="post-acct mr-2">{{ post.account_name || post.sender_name || 'Unknown' }}</span>
                      <b-badge :variant="getBadgeVariant(post.account_name)" class="post-channel-badge">{{
                        getChannelLabel(post.account_name) }}</b-badge>
                      <b-badge v-if="post.sender_name && post.sender_name !== post.account_name"
                        variant="secondary" class="post-channel-badge ml-1" style="font-size:0.62rem">
                        via {{ post.sender_name.slice(0, 18) }}
                      </b-badge>
                    </div>
                    <div class="post-time text-right">🕐 {{ formatDate(post.date) }}</div>
                  </div>
                </div>

                <!-- Text -->
                <div v-if="post.full_text" class="post-text">
                  {{ getDisplayText(post) }}
                  <b-link v-if="post.full_text.length > 260" class="read-more-link d-block mt-1"
                    @click="toggle(post.uid)">
                    {{ expandedPosts[post.uid] ? '▲ ย่อลง' : '▼ อ่านเพิ่ม' }}
                  </b-link>
                </div>
                <div v-else class="no-text">📷 Media only post</div>

                <!-- Photos -->
                <div v-if="post.photos && post.photos.length" class="photo-row">
                  <a v-for="(url, idx) in post.photos.slice(0, 5)" :key="url + idx" class="photo-thumb" :href="url"
                    target="_blank" rel="noopener">
                    <img :src="url" @error="$event.target.parentElement.style.display='none'" />
                  </a>
                  <div v-if="post.photos.length > 5" class="photo-chip photo-more">
                    +{{ post.photos.length - 5 }}
                  </div>
                </div>

                <!-- Footer -->
                <div class="post-footer">
                  <div class="eng-wrap">
                    <span class="eng-heart">♥</span>
                    <span class="eng-num">{{ post.engagement.toLocaleString() }}</span>
                    <span class="eng-label">eng.</span>
                    <b-progress :value="getEngPct(post.engagement)" max="100" class="eng-mini-bar ml-2" />
                  </div>
                  <div class="d-flex gap-2">
                    <b-badge v-if="post.vdo_embedded && post.vdo_embedded.length" variant="light" class="media-badge ml-1">
                      🎬 {{ post.vdo_embedded.length }}
                    </b-badge>
                  </div>
                </div>

              </b-card-body>
            </b-card>
          </transition-group>

          <div v-if="filteredPosts.length === 0" class="empty-state">
            <div style="font-size:3rem">📭</div>
            <p class="mt-3">No posts for this filter</p>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
const POSTS = [
    {
        "uid": "peer=-1782078279_timestamp=1771166170",
        "source": "telegram",
        "account_url": "https://t.me/spmhunsen",
        "account_name": "Samdech Hun Sen of Cambodia",
        "account_peer_id": "-1782078279",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1782078279",
        "sender_name": "HENG Sour",
        "sender_peer_id": "-1923463878",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1923463878",
        "full_text": "រាជធានីភ្នំពេញ មានឱកាសការងារជូនបងប្អូនប្រជាពលរដ្ឋ ជាពិសេសអតីតពលករដែលវិលត្រឡប់មកកម្ពុជាវិញ ចំនួន ២៦,៨៥៦ កន្លែង\n\n#MLVT #HENGSour #NEA",
        "date": "2026-02-15T21:36:10+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1782078279_timestamp=1771166170_index=0"],
        "vdo_embedded": null,
        "engagement": 1237
    },
    {
        "uid": "peer=-1782078279_timestamp=1771206835",
        "source": "telegram",
        "account_url": "https://t.me/spmhunsen",
        "account_name": "Samdech Hun Sen of Cambodia",
        "account_peer_id": "-1782078279",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1782078279",
        "sender_name": "Samdech Hun Sen of Cambodia",
        "sender_peer_id": "-1782078279",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1782078279",
        "full_text": "វឌ្ឍនភាព នៃការស្ថាបនាកំណាត់ផ្លូវលេខ1534 ដើម្បីលើកកម្ពស់សេវាដឹកជញ្ជូន និងការតភ្ជាប់\n\nConnect with Samdech Hun Sen : \nFacebook\nTelegram\nTikTok\nTwitter \nYouTube\nInstagram \nWebsite",
        "date": "2026-02-16T08:53:55+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1782078279_timestamp=1771206835_index=0"],
        "vdo_embedded": null,
        "engagement": 1163
    },
    {
        "uid": "peer=-1782078279_timestamp=1771214605",
        "source": "telegram",
        "account_url": "https://t.me/spmhunsen",
        "account_name": "Samdech Hun Sen of Cambodia",
        "account_peer_id": "-1782078279",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1782078279",
        "sender_name": "Samdech Hun Sen of Cambodia",
        "sender_peer_id": "-1782078279",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1782078279",
        "full_text": "បទយកការណ៍៖ សក្ដានុពល និងភាពរីកចម្រើននៃតំបន់ភូមិសាស្ត្រខាងត្បូងរាជធានីភ្នំពេញ\n\nConnect with Samdech Hun Sen : \nFacebook\nTelegram\nTikTok\nTwitter \nYouTube\nInstagram \nWebsite",
        "date": "2026-02-16T11:03:25+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1782078279_timestamp=1771214605_index=0"],
        "vdo_embedded": null,
        "engagement": 1346
    },
    {
        "uid": "peer=-1782078279_timestamp=1771239589",
        "source": "telegram",
        "account_url": "https://t.me/spmhunsen",
        "account_name": "Samdech Hun Sen of Cambodia",
        "account_peer_id": "-1782078279",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1782078279",
        "sender_name": "Samdech Hun Sen of Cambodia",
        "sender_peer_id": "-1782078279",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1782078279",
        "full_text": "សម្តេចអគ្គមហាសេនាបតីតេជោ ហ៊ុន សែន ប្រធានព្រឹទ្ធសភានៃព្រះរាជាណាចក្រកម្ពុជា ផ្ញើសារលិខិតជូនពរជូន ឯកឧត្តមបណ្ឌិត ធន់ វឌ្ឍនា អនុប្រធានទី២ ព្រឹទ្ធសភា ក្នុងឱកាសខួបចម្រើនជន្មាយុ នាថ្ងៃទី១៩ ខែកុម្ភៈ ឆ្នាំ២០២៦។\n\nConnect with Samdech Hun Sen : \nFacebook\nTelegram\nTikTok\nTwitter \nYouTube\nInstagram \nWebsite",
        "date": "2026-02-16T17:59:49+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1782078279_timestamp=1771239589_index=0"],
        "vdo_embedded": null,
        "engagement": 1184
    },
    {
        "uid": "peer=-1782078279_timestamp=1771249630",
        "source": "telegram",
        "account_url": "https://t.me/spmhunsen",
        "account_name": "Samdech Hun Sen of Cambodia",
        "account_peer_id": "-1782078279",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1782078279",
        "sender_name": "Samdech Thipadei Hun Manet, Prime Minister of Cambodia",
        "sender_peer_id": "-1367360638",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1367360638",
        "full_text": "គណៈប្រតិភូរាជរដ្ឋាភិបាលកម្ពុជាបានមកដល់សហរដ្ឋអាមេរិកប្រកបដោយសុវត្ថិភាព ដោយបានការទទួលស្វាគមន៍ពីសំណាក់ ឯកអគ្គរាជទូតកម្ពុជា ប្រចាំសហរដ្ឋអាមេរិក និងឯកអគ្គរាជទូត និងតំណាងអចិន្ត្រៃយ៍កម្ពុជា ប្រចាំអង្គការសហប្រជាជាតិ។\n\nUSA, Monday morning, 16 February 2026",
        "date": "2026-02-16T20:47:10+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1782078279_timestamp=1771249630_index=0","https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1782078279_timestamp=1771249630_index=1","https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1782078279_timestamp=1771249630_index=2"],
        "vdo_embedded": null,
        "engagement": 1978
    },
    {
        "uid": "peer=-1782078279_timestamp=1771296682",
        "source": "telegram",
        "account_url": "https://t.me/spmhunsen",
        "account_name": "Samdech Hun Sen of Cambodia",
        "account_peer_id": "-1782078279",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1782078279",
        "sender_name": "Samdech Hun Sen of Cambodia",
        "sender_peer_id": "-1782078279",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1782078279",
        "full_text": "សម្តេចអគ្គមហាសេនាបតីតេជោ ហ៊ុន សែន ប្រធានព្រឹទ្ធសភានៃព្រះរាជាណាចក្រកម្ពុជា អនុញ្ញាតឱ្យ ឯកឧត្តម Saichay Kommasith អនុរដ្ឋមន្ត្រីក្រសួងការពារប្រទេស និងជាប្រធានអគ្គសេនាធិការកងទ័ព នៃសាធារណរដ្ឋប្រជាធិបតេយ្យប្រជាមានិតឡាវ ចូលជួបសម្តែងការគួរសម នៅវិមានសាមគ្គីភាព រាជធានីភ្នំពេញ។",
        "date": "2026-02-17T09:51:22+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1782078279_timestamp=1771296682_index=0","https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1782078279_timestamp=1771296682_index=1"],
        "vdo_embedded": null,
        "engagement": 1755
    },
    {
        "uid": "peer=-1782078279_timestamp=1771312944",
        "source": "telegram",
        "account_url": "https://t.me/spmhunsen",
        "account_name": "Samdech Hun Sen of Cambodia",
        "account_peer_id": "-1782078279",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1782078279",
        "sender_name": "Samdech Hun Sen of Cambodia",
        "sender_peer_id": "-1782078279",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1782078279",
        "full_text": "វីដេអូ៖ សម្តេចអគ្គមហាសេនាបតីតេជោ ហ៊ុន សែន ប្រធានព្រឹទ្ធសភានៃព្រះរាជាណាចក្រកម្ពុជា អនុញ្ញាតឱ្យ ឯកឧត្តម ឧត្ដមសេនីយ៍ឯក Saichay Kommasith ចូលជួបសម្តែងការគួរសម នៅវិមានសាមគ្គីភាព រាជធានីភ្នំពេញ។",
        "date": "2026-02-17T14:22:24+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1782078279_timestamp=1771312944_index=0"],
        "vdo_embedded": null,
        "engagement": 1614
    },
    {
        "uid": "peer=-1782078279_timestamp=1771388986",
        "source": "telegram",
        "account_url": "https://t.me/spmhunsen",
        "account_name": "Samdech Hun Sen of Cambodia",
        "account_peer_id": "-1782078279",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1782078279",
        "sender_name": "Samdech Hun Sen of Cambodia",
        "sender_peer_id": "-1782078279",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1782078279",
        "full_text": "ខ្ញុំទទួលបានរូបថតមួយសន្លឹកដែល\nឯកឧត្តម លី ស៊ានឡុង អតីតនាយករដ្ឋមន្ត្រីសិង្ហបុរីបង្ហោះរំលឹកខួប១០ឆ្នាំនៃការប្រជុំអាស៊ាន-អាមេរិក(17.2.2016.17.2.2026)\nដែលអតីតប្រធានាធិបតីអាមេរិក\nបារ៉ាក់ អូបាម៉ាធ្វើជាម្ចាស់ផ្ទះ។",
        "date": "2026-02-18T11:29:46+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1782078279_timestamp=1771388986_index=0"],
        "vdo_embedded": null,
        "engagement": 1696
    },
    {
        "uid": "peer=-1782078279_timestamp=1771395571",
        "source": "telegram",
        "account_url": "https://t.me/spmhunsen",
        "account_name": "Samdech Hun Sen of Cambodia",
        "account_peer_id": "-1782078279",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1782078279",
        "sender_name": "Samdech Hun Sen of Cambodia",
        "sender_peer_id": "-1782078279",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1782078279",
        "full_text": "សម្តេចតេជោ ហ៊ុន សែន បានផ្ញើសារសួរសុខទុក្ខដល់ អតីតនាយករដ្ឋមន្ត្រីសឹង្ហបុរី Lee Hsien Loong និងអតីតមេដឹកនាំផ្សេងទៀត និងបានរំលឹកថាមេដឹកនាំអាស៊ានកាលពី១០ ឆ្នាំមុន ស្រលាញ់រាប់អានគ្នាខ្លាំងណាស់",
        "date": "2026-02-18T13:19:31+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1782078279_timestamp=1771395571_index=0"],
        "vdo_embedded": null,
        "engagement": 1660
    },
    {
        "uid": "peer=-1782078279_timestamp=1771418618",
        "source": "telegram",
        "account_url": "https://t.me/spmhunsen",
        "account_name": "Samdech Hun Sen of Cambodia",
        "account_peer_id": "-1782078279",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1782078279",
        "sender_name": "Samdech Hun Sen of Cambodia",
        "sender_peer_id": "-1782078279",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1782078279",
        "full_text": "ក្រុមការងារសប្បុរសធម៌សម្តេចពុក ហ៊ុន សែន សម្តេចម៉ែ ប៊ុន រ៉ានី សហការជាមួយក្រសួងបរិស្ថាន អាជ្ញាធរខេត្ត កំពង់ធំ ក្រចេះ ស្ទឹងត្រែង ព្រះវិហារ និងបណ្ដាញសហគមន៍ព្រៃឡង់ទាំង៤ខេត្តប្រារព្ធពិធី \'បុណ្យព្រៃឡង់ក្រោមម្លប់សន្តិភាព\' នៅស្រុកសណ្ដាន់ ខេត្តកំពង់ធំ",
        "date": "2026-02-18T19:43:38+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1782078279_timestamp=1771418618_index=0"],
        "vdo_embedded": null,
        "engagement": 1486
    },
    {
        "uid": "peer=-2392498313_timestamp=1771471370",
        "source": "telegram",
        "account_url": "https://t.me/senate_of_cambodia",
        "account_name": "Senate of Cambodia",
        "account_peer_id": "-2392498313",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-2392498313",
        "sender_name": "Senate of Cambodia",
        "sender_peer_id": "-2392498313",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-2392498313",
        "full_text": "",
        "date": "2026-02-19T10:22:50+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-2392498313_timestamp=1771471370_index=0","https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-2392498313_timestamp=1771471370_index=1","https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-2392498313_timestamp=1771471370_index=2"],
        "vdo_embedded": null,
        "engagement": 0
    },
    {
        "uid": "peer=-2392498313_timestamp=1771471371",
        "source": "telegram",
        "account_url": "https://t.me/senate_of_cambodia",
        "account_name": "Senate of Cambodia",
        "account_peer_id": "-2392498313",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-2392498313",
        "sender_name": "Senate of Cambodia",
        "sender_peer_id": "-2392498313",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-2392498313",
        "full_text": "ឯកឧត្តម លី សារី អញ្ជើញជួបសំណេះសំណាលជាមួយថ្នាក់ដឹកនាំ ប្រជាពលរដ្ឋ  និងគោរពវិញ្ញាណក្ខន្ធសពប្រជាពលរដ្ឋ នៅខេត្តកំពត",
        "date": "2026-02-19T10:22:51+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-2392498313_timestamp=1771471371_index=0","https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-2392498313_timestamp=1771471371_index=1"],
        "vdo_embedded": null,
        "engagement": 4
    },
    {
        "uid": "peer=-2392498313_timestamp=1771481226",
        "source": "telegram",
        "account_url": "https://t.me/senate_of_cambodia",
        "account_name": "Senate of Cambodia",
        "account_peer_id": "-2392498313",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-2392498313",
        "sender_name": "Senate of Cambodia",
        "sender_peer_id": "-2392498313",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-2392498313",
        "full_text": "គណៈកម្មការទី៩ព្រឹទ្ធសភា អញ្ជើញចុះឈ្វេងយល់អំពីការអនុវត្តច្បាប់នៅក្រសួងសាធារណការនិងដឹកជញ្ជូន",
        "date": "2026-02-19T13:07:06+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-2392498313_timestamp=1771481226_index=0","https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-2392498313_timestamp=1771481226_index=1"],
        "vdo_embedded": null,
        "engagement": 4
    },
    {
        "uid": "peer=-2392498313_timestamp=1771485131",
        "source": "telegram",
        "account_url": "https://t.me/senate_of_cambodia",
        "account_name": "Senate of Cambodia",
        "account_peer_id": "-2392498313",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-2392498313",
        "sender_name": "Senate of Cambodia",
        "sender_peer_id": "-2392498313",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-2392498313",
        "full_text": "គណៈកម្មការទី២ព្រឹទ្ធសភា អញ្ជើញប្រគល់ធុងទឹក និងថ្នាំលាបការពាររមាស់ ជូនទៅអង្គភាពការពារជួរមុខ",
        "date": "2026-02-19T14:12:11+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-2392498313_timestamp=1771485131_index=0","https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-2392498313_timestamp=1771485131_index=1"],
        "vdo_embedded": null,
        "engagement": 6
    },
    {
        "uid": "peer=-2392498313_timestamp=1771491199",
        "source": "telegram",
        "account_url": "https://t.me/senate_of_cambodia",
        "account_name": "Senate of Cambodia",
        "account_peer_id": "-2392498313",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-2392498313",
        "sender_name": "Senate of Cambodia",
        "sender_peer_id": "-2392498313",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-2392498313",
        "full_text": "សម្តេចរាជបុត្រីព្រះអនុជ នរោត្តម អរុណរស្មី សព្វព្រះហឫទ័យទទួលជួប និងលៀងអាហារថ្ងៃត្រង់ជូនលោកជំទាវ Teo Lay Cheng ឯកអគ្គរដ្ឋទូតវិសាមញ្ញ និងពេញសមត្ថភាព នៃប្រទេសសិង្ហបុរី ប្រចាំកម្ពុជា",
        "date": "2026-02-19T15:53:19+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-2392498313_timestamp=1771491199_index=0"],
        "vdo_embedded": null,
        "engagement": 2
    },
    {
        "uid": "peer=-2392498313_timestamp=1771492393",
        "source": "telegram",
        "account_url": "https://t.me/senate_of_cambodia",
        "account_name": "Senate of Cambodia",
        "account_peer_id": "-2392498313",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-2392498313",
        "sender_name": "Senate of Cambodia",
        "sender_peer_id": "-2392498313",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-2392498313",
        "full_text": "ឯកឧត្ដម អន ស៊ុំ និងឯកឧត្តម ឈើយ ចាន់ណា អញ្ជើញចូលរួមពិធីគោរពវិញ្ញាណក្ខន្ធសពឯកឧត្ដម សុខ ខឿន",
        "date": "2026-02-19T16:13:13+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-2392498313_timestamp=1771492393_index=0","https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-2392498313_timestamp=1771492393_index=1"],
        "vdo_embedded": null,
        "engagement": 0
    },
    {
        "uid": "peer=-1367360638_timestamp=1771168189",
        "source": "telegram",
        "account_url": "https://t.me/Dr_Hunmanetofcambodia",
        "account_name": "Samdech Thipadei Hun Manet, Prime Minister of Cambodia",
        "account_peer_id": "-1367360638",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1367360638",
        "sender_name": "Samdech Thipadei Hun Manet, Prime Minister of Cambodia",
        "sender_peer_id": "-1367360638",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1367360638",
        "full_text": "",
        "date": "2026-02-15T22:09:49+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1367360638_timestamp=1771168189_index=0","https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1367360638_timestamp=1771168189_index=1","https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1367360638_timestamp=1771168189_index=2"],
        "vdo_embedded": null,
        "engagement": 2984
    },
    {
        "uid": "peer=-1367360638_timestamp=1771201904",
        "source": "telegram",
        "account_url": "https://t.me/Dr_Hunmanetofcambodia",
        "account_name": "Samdech Thipadei Hun Manet, Prime Minister of Cambodia",
        "account_peer_id": "-1367360638",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1367360638",
        "sender_name": "Samdech Thipadei Hun Manet, Prime Minister of Cambodia",
        "sender_peer_id": "-1367360638",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1367360638",
        "full_text": "វីដេអូសង្ខេបសកម្មភាពរបស់ សម្តេចមហាបវរធិបតី ហ៊ុន ម៉ាណែត នាយករដ្ឋមន្ត្រី នៃព្រះរាជាណាចក្រកម្ពុជា ពីថ្ងៃទី៩-១៥ កុម្ភៈ ២០២៦",
        "date": "2026-02-16T07:31:44+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1367360638_timestamp=1771201904_index=0"],
        "vdo_embedded": null,
        "engagement": 2894
    },
    {
        "uid": "peer=-1367360638_timestamp=1771249533",
        "source": "telegram",
        "account_url": "https://t.me/Dr_Hunmanetofcambodia",
        "account_name": "Samdech Thipadei Hun Manet, Prime Minister of Cambodia",
        "account_peer_id": "-1367360638",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1367360638",
        "sender_name": "Samdech Thipadei Hun Manet, Prime Minister of Cambodia",
        "sender_peer_id": "-1367360638",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1367360638",
        "full_text": "គណៈប្រតិភូរាជរដ្ឋាភិបាលកម្ពុជាបានមកដល់សហរដ្ឋអាមេរិកប្រកបដោយសុវត្ថិភាព ដោយបានការទទួលស្វាគមន៍ពីសំណាក់ ឯកអគ្គរាជទូតកម្ពុជា ប្រចាំសហរដ្ឋអាមេរិក\n\nUSA, Monday morning, 16 February 2026\n\n#ហ៊ុនម៉ាណែត #Hunmanet #កម្ពុជា #cambodia",
        "date": "2026-02-16T20:45:33+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1367360638_timestamp=1771249533_index=0","https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1367360638_timestamp=1771249533_index=1"],
        "vdo_embedded": null,
        "engagement": 3387
    },
    {
        "uid": "peer=-1367360638_timestamp=1771425925",
        "source": "telegram",
        "account_url": "https://t.me/Dr_Hunmanetofcambodia",
        "account_name": "Samdech Thipadei Hun Manet, Prime Minister of Cambodia",
        "account_peer_id": "-1367360638",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1367360638",
        "sender_name": "Samdech Thipadei Hun Manet, Prime Minister of Cambodia",
        "sender_peer_id": "-1367360638",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1367360638",
        "full_text": "តាងនាមរាជរដ្ឋាភិបាល នៃព្រះរាជាណាចក្រកម្ពុជា ខ្ញុំនិងភរិយា សូមអបអរសាទរ និងសូមជូននូវពរជ័យ សិរីសួស្ដី សុភមង្គល ជូនដល់បងប្អូនម៉ូស្លីមកម្ពុជា ទាំងក្នុង និង ក្រៅប្រទេស ដែលនឹងចូលបួសខែរ៉ម៉ាឌន",
        "date": "2026-02-18T21:45:25+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1367360638_timestamp=1771425925_index=0","https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1367360638_timestamp=1771425925_index=1"],
        "vdo_embedded": null,
        "engagement": 2711
    },
    {
        "uid": "peer=-1367360638_timestamp=1771429563",
        "source": "telegram",
        "account_url": "https://t.me/Dr_Hunmanetofcambodia",
        "account_name": "Samdech Thipadei Hun Manet, Prime Minister of Cambodia",
        "account_peer_id": "-1367360638",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1367360638",
        "sender_name": "Samdech Thipadei Hun Manet, Prime Minister of Cambodia",
        "sender_peer_id": "-1367360638",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1367360638",
        "full_text": "វីដេអូ៖សារពិសេសរបស់ សម្តេចមហាបវរធិបតី ហ៊ុន ម៉ាណែត នាយករដ្ឋមន្ត្រីនៃព្រះរាជាណាចក្រកម្ពុជា អបអរសាទរ និងជូនពរជ័យ ខ្មែរម៉ូស្លីមទាំងក្នុង និងក្រៅប្រទេស ដែលនឹងចូលបួសខែរ៉ម៉ាឌន។",
        "date": "2026-02-18T22:46:03+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1367360638_timestamp=1771429563_index=0"],
        "vdo_embedded": null,
        "engagement": 2676
    },
    {
        "uid": "peer=-1367360638_timestamp=1771461597",
        "source": "telegram",
        "account_url": "https://t.me/Dr_Hunmanetofcambodia",
        "account_name": "Samdech Thipadei Hun Manet, Prime Minister of Cambodia",
        "account_peer_id": "-1367360638",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1367360638",
        "sender_name": "Samdech Thipadei Hun Manet, Prime Minister of Cambodia",
        "sender_peer_id": "-1367360638",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1367360638",
        "full_text": "ជួបជាមួយ ឯកឧត្ដមឯកអគ្គរដ្ឋទូត Jamieson Greer តំណាងពាណិជ្ជកម្មសហរដ្ឋអាមេរិក ក្នុងជំនួបសម្ដែងការគួរសម និងពិភាក្សាការងារ។\n\nUSA, Wednesday afternoon, 18 February 2026",
        "date": "2026-02-19T07:39:57+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1367360638_timestamp=1771461597_index=0","https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1367360638_timestamp=1771461597_index=1"],
        "vdo_embedded": null,
        "engagement": 2933
    },
    {
        "uid": "peer=-2221924419_timestamp=1770976427",
        "source": "telegram",
        "account_url": "https://t.me/modgovkhm",
        "account_name": "ក្រសួងការពារជាតិ Ministry of National Defence",
        "account_peer_id": "-2221924419",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-2221924419",
        "sender_name": "ក្រសួងការពារជាតិ Ministry of National Defence",
        "sender_peer_id": "-2221924419",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-2221924419",
        "full_text": "Press Release - H.E. Lieutenant General Maly Socheata, Spokeswoman of the Ministry of National Defence of the Kingdom of Cambodia: At 2:05 p.m. on Friday, February 13, 2026, His Excellency General ROMEO S. BRAWNER JR., Chief of Staff of the Armed Forces of the Philippines, observed the border situation at the Boeung Trakuan Border Checkpoint in Thma Puok District, Banteay Meanchey Province, following the ceasefire.",
        "date": "2026-02-13T16:53:47+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-2221924419_timestamp=1770976427_index=0","https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-2221924419_timestamp=1770976427_index=1"],
        "vdo_embedded": null,
        "engagement": 117
    },
    {
        "uid": "peer=-2221924419_timestamp=1770985412",
        "source": "telegram",
        "account_url": "https://t.me/modgovkhm",
        "account_name": "ក្រសួងការពារជាតិ Ministry of National Defence",
        "account_peer_id": "-2221924419",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-2221924419",
        "sender_name": "ក្រសួងការពារជាតិ Ministry of National Defence",
        "sender_peer_id": "-2221924419",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-2221924419",
        "full_text": "Press Release - At 2:55 p.m. on Friday, February 13, 2026, the Cambodia Liaison Group (CLG) and the ASEAN Observer Team (AOT) accompanied the delegation led by General ROMEO S. BRAWNER JR. on a visit to Cambodian displaced civilians currently residing in the Wat Kdol camp. The camp's current population stands at 1,520 families, totaling 5,735 individuals.",
        "date": "2026-02-13T19:23:32+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-2221924419_timestamp=1770985412_index=0"],
        "vdo_embedded": null,
        "engagement": 177
    },
    {
        "uid": "peer=-2221924419_timestamp=1771313469",
        "source": "telegram",
        "account_url": "https://t.me/modgovkhm",
        "account_name": "ក្រសួងការពារជាតិ Ministry of National Defence",
        "account_peer_id": "-2221924419",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-2221924419",
        "sender_name": "ក្រសួងការពារជាតិ Ministry of National Defence",
        "sender_peer_id": "-2221924419",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-2221924419",
        "full_text": "ឯកឧត្តម នាយឧត្តមសេនីយ៍ ទៀ សីហា ឧបនាយករដ្ឋមន្ត្រី រដ្ឋមន្ត្រីក្រសួងការពារជាតិ ទួលស្វាគមន៍ ឯកឧត្តម ឧត្តមសេនីយ៍ឯក សាយចៃ គុមម៉ាក់ស៊ីត ចូលជួបសម្តែងការគួរសម ដែលប្រព្រឹត្តទៅ ទីស្តីការក្រសួងការពារជាតិ។",
        "date": "2026-02-17T14:31:09+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-2221924419_timestamp=1771313469_index=0","https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-2221924419_timestamp=1771313469_index=1"],
        "vdo_embedded": null,
        "engagement": 184
    },
    {
        "uid": "peer=-1210141606_timestamp=1771036411",
        "source": "telegram",
        "account_url": "https://t.me/MFAICNews",
        "account_name": "MFAIC (Cambodia)-NEWS",
        "account_peer_id": "-1210141606",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1210141606",
        "sender_name": "MFAIC (Cambodia)-NEWS",
        "sender_peer_id": "-1210141606",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1210141606",
        "full_text": "On the morning of 13 February 2026, His Excellency KAN Pharidh, Secretary of State of the Ministry of Foreign Affairs, received a courtesy call from His Excellency Igor Driesmans, Ambassador of the European Union to Cambodia. Both sides exchanged views on how to further strengthen bilateral cooperation between Cambodia and the EU.",
        "date": "2026-02-14T09:33:31+00:00",
        "photos": [],
        "vdo_embedded": null,
        "engagement": 9
    },
    {
        "uid": "peer=-1210141606_timestamp=1771051422",
        "source": "telegram",
        "account_url": "https://t.me/MFAICNews",
        "account_name": "MFAIC (Cambodia)-NEWS",
        "account_peer_id": "-1210141606",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1210141606",
        "sender_name": "MFAIC (Cambodia)-NEWS",
        "sender_peer_id": "-1210141606",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1210141606",
        "full_text": "The Outcome of the Second Session of Bilateral Consultations between the Ministry of Foreign Affairs and International Cooperation of the Kingdom of Cambodia and Global Affairs Canada",
        "date": "2026-02-14T13:43:42+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1210141606_timestamp=1771051422_index=0"],
        "vdo_embedded": null,
        "engagement": 11
    },
    {
        "uid": "peer=-1210141606_timestamp=1771083352",
        "source": "telegram",
        "account_url": "https://t.me/MFAICNews",
        "account_name": "MFAIC (Cambodia)-NEWS",
        "account_peer_id": "-1210141606",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1210141606",
        "sender_name": "MFAIC (Cambodia)-NEWS",
        "sender_peer_id": "-1210141606",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1210141606",
        "full_text": "On the evening of 14 February 2026, Deputy PM PRAK Sokhonn led a delegation to prepare and accompany Samdech Moha Borvor Thipadei HUN Manet, Prime Minister of Cambodia, to attend the Inaugural Meeting of the Board of Peace on 19 February 2026 at the Donald J. Trump U.S. Institute of Peace in Washington, D.C.",
        "date": "2026-02-14T22:35:52+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1210141606_timestamp=1771083352_index=0"],
        "vdo_embedded": null,
        "engagement": 11
    },
    {
        "uid": "peer=-1210141606_timestamp=1771328911",
        "source": "telegram",
        "account_url": "https://t.me/MFAICNews",
        "account_name": "MFAIC (Cambodia)-NEWS",
        "account_peer_id": "-1210141606",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1210141606",
        "sender_name": "MFAIC (Cambodia)-NEWS",
        "sender_peer_id": "-1210141606",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1210141606",
        "full_text": "On 17 February 2026, His Excellency Kan Pharidh received a courtesy call from Mrs. Dorsa NAZEMI SALMAN, the newly appointed Head of Mission of the ICRC in Cambodia. Both sides focused on ICRC cooperation and issues concerning displaced civilians along the Cambodia-Thailand border.",
        "date": "2026-02-17T18:48:31+00:00",
        "photos": [],
        "vdo_embedded": null,
        "engagement": 17
    },
    {
        "uid": "peer=-1210141606_timestamp=1771411847",
        "source": "telegram",
        "account_url": "https://t.me/MFAICNews",
        "account_name": "MFAIC (Cambodia)-NEWS",
        "account_peer_id": "-1210141606",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1210141606",
        "sender_name": "MFAIC (Cambodia)-NEWS",
        "sender_peer_id": "-1210141606",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1210141606",
        "full_text": "Statement: Phnom Penh to host the 20th Francophonie Summit in November 2026. This historic event will bring together heads of state and representatives of member nations of the Organisation internationale de la Francophonie (OIF).",
        "date": "2026-02-18T17:50:47+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1210141606_timestamp=1771411847_index=0"],
        "vdo_embedded": null,
        "engagement": 17
    },
    {
        "uid": "peer=-1210141606_timestamp=1771426701",
        "source": "telegram",
        "account_url": "https://t.me/MFAICNews",
        "account_name": "MFAIC (Cambodia)-NEWS",
        "account_peer_id": "-1210141606",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1210141606",
        "sender_name": "MFAIC (Cambodia)-NEWS",
        "sender_peer_id": "-1210141606",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1210141606",
        "full_text": "On 18 February 2026, H.E. Chhay Sinarith briefed members of the diplomatic corps in Phnom Penh on the Royal Government of Cambodia's ongoing efforts to combat cybercrime and online scams.",
        "date": "2026-02-18T21:58:21+00:00",
        "photos": [],
        "vdo_embedded": null,
        "engagement": 13
    },
    {
        "uid": "peer=-1394225118_timestamp=1771469543",
        "source": "telegram",
        "account_url": "https://t.me/oa_channel",
        "account_name": "Open Authority (OA)",
        "account_peer_id": "-1394225118",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1394225118",
        "sender_name": "Open Authority (OA)",
        "sender_peer_id": "-1394225118",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1394225118",
        "full_text": "ក្រោយបទសម្ភាសរបស់សម្ដេចធិបតី ជាមួយ Reuters, អ្នកនាំពាក្យកងទ័ពថៃ នៅព្រឹកនេះនិយាយថា «ការដាក់ទូកុងតឺន័រ និងបន្លាលួសនៅក្នុងតំបន់មួយចំនួន គឺជាវិធានការបណ្តោះអាសន្ន»\n\nកាសែត The Nation ចុះថ្ងៃទី១៩ ខែកុម្ភៈ ឆ្នាំ២០២៦",
        "date": "2026-02-19T09:52:23+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1394225118_timestamp=1771469543_index=0"],
        "vdo_embedded": null,
        "engagement": 257
    },
    {
        "uid": "peer=-1394225118_timestamp=1771412203",
        "source": "telegram",
        "account_url": "https://t.me/oa_channel",
        "account_name": "Open Authority (OA)",
        "account_peer_id": "-1394225118",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1394225118",
        "sender_name": "Open Authority (OA)",
        "sender_peer_id": "-1394225118",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1394225118",
        "full_text": "ក្រសួងការបរទេសកម្ពុជា៖ នៅខែវិច្ឆិកា ឆ្នាំ២០២៦ រាជធានីភ្នំពេញនឹងធ្វើជាម្ចាស់ផ្ទះនៃកិច្ចប្រជុំកំពូលហ្វ្រង់កូហ្វូនី លើកទី២០",
        "date": "2026-02-18T17:56:43+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1394225118_timestamp=1771412203_index=0"],
        "vdo_embedded": null,
        "engagement": 138
    },
    {
        "uid": "peer=-1394225118_timestamp=1771463562",
        "source": "telegram",
        "account_url": "https://t.me/oa_channel",
        "account_name": "Open Authority (OA)",
        "account_peer_id": "-1394225118",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1394225118",
        "sender_name": "Open Authority (OA)",
        "sender_peer_id": "-1394225118",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1394225118",
        "full_text": "សេចក្តីជូនដំណឹង ជ្រើសរើសពលទាហានថ្មីបំពេញក្របខ័ណ្ឌបណ្ដាកងឯកភាព ចំណុះកងទ័ពជើងគោក",
        "date": "2026-02-19T08:12:42+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1394225118_timestamp=1771463562_index=0"],
        "vdo_embedded": null,
        "engagement": 134
    },
    {
        "uid": "peer=-1394225118_timestamp=1771476689",
        "source": "telegram",
        "account_url": "https://t.me/oa_channel",
        "account_name": "Open Authority (OA)",
        "account_peer_id": "-1394225118",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1394225118",
        "sender_name": "Open Authority (OA)",
        "sender_peer_id": "-1394225118",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1394225118",
        "full_text": "នាយកដ្ឋានប្រឆាំងបទល្មើសបច្ចេកវិទ្យា បានធ្វើការអប់រំណែនាំមន្រ្តីដែលបានប្រើប្រាស់ពាក្យពេចន៍មិនសមរម្យដាក់ពលរដ្ឋដែលរងគ្រោះកម្ចីអនឡាញ រួចហើយ។",
        "date": "2026-02-19T11:51:29+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1394225118_timestamp=1771476689_index=0"],
        "vdo_embedded": null,
        "engagement": 86
    },
    {
        "uid": "peer=-1394225118_timestamp=1771482910",
        "source": "telegram",
        "account_url": "https://t.me/oa_channel",
        "account_name": "Open Authority (OA)",
        "account_peer_id": "-1394225118",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1394225118",
        "sender_name": "Open Authority (OA)",
        "sender_peer_id": "-1394225118",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1394225118",
        "full_text": "ដំណឹងល្អ! ក្រសួងមហាផ្ទៃ ដាក់ឱ្យប្រើប្រាស់ជាផ្លូវការប្រព័ន្ធទទួលពាក្យបណ្តឹងអនឡាញ\n\nតំណភ្ជាប់: https://css-gdin.interior.gov.kh/home",
        "date": "2026-02-19T13:35:10+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1394225118_timestamp=1771482910_index=0"],
        "vdo_embedded": null,
        "engagement": 87
    },
    {
        "uid": "peer=-1210973108_timestamp=1771138834",
        "source": "telegram",
        "account_url": "https://t.me/royalcambodianarmy",
        "account_name": "Royal Cambodian Army",
        "account_peer_id": "-1210973108",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1210973108",
        "sender_name": "Samdech Thipadei Hun Manet, Prime Minister of Cambodia",
        "sender_peer_id": "-1367360638",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1367360638",
        "full_text": "លោកជំទាវបណ្ឌិត ពេជ ចន្ទមុន្នី ហ៊ុនម៉ាណែត បានបន្តអញ្ជើញសួរសុខវីរកងទ័ពដែលបានរងរបួសដល់មានពិការភាពកំពុងសម្រាកព្យាបាលនៅផ្ទះ។",
        "date": "2026-02-15T14:00:34+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1210973108_timestamp=1771138834_index=0","https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1210973108_timestamp=1771138834_index=1"],
        "vdo_embedded": null,
        "engagement": 23
    },
    {
        "uid": "peer=-1210973108_timestamp=1771327278",
        "source": "telegram",
        "account_url": "https://t.me/royalcambodianarmy",
        "account_name": "Royal Cambodian Army",
        "account_peer_id": "-1210973108",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1210973108",
        "sender_name": "Royal Cambodian Army",
        "sender_peer_id": "-1210973108",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1210973108",
        "full_text": "ភ្នំពេញ ថ្ងៃអង្គារ ទី១៧ ខែកុម្ភៈ ឆ្នាំ២០២៦ - កិច្ចប្រជុំក្រមការងារកងទ័ពជើងគោកលើកទី៣ (3 RCA-IA-AAST) ដែលភាគីកម្ពុជាជាម្ចាស់ផ្ទះ រវាងកងទ័ពជើងគោក នៃកងយោធពលខេមរភូមិន្ទ និងកងទ័ពជើងគោក នៃសាធារណរដ្ឋឥណ្ឌា",
        "date": "2026-02-17T18:21:18+00:00",
        "photos": [],
        "vdo_embedded": null,
        "engagement": 14
    },
    {
        "uid": "peer=-1210973108_timestamp=1771396313",
        "source": "telegram",
        "account_url": "https://t.me/royalcambodianarmy",
        "account_name": "Royal Cambodian Army",
        "account_peer_id": "-1210973108",
        "account_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1210973108",
        "sender_name": "Royal Cambodian Army",
        "sender_peer_id": "-1210973108",
        "sender_profile_image": "https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/profile_images/-1210973108",
        "full_text": "ភ្នំពេញ ថ្ងៃពុធ ទី១៨ ខែកុម្ភៈ ឆ្នាំ២០២៦ - ឯកឧត្តម នាយឧត្តមសេនីយ៍ មៅ សុផាន់ អគ្គមេបញ្ជាការរងនៃកងយោធពលខេមរភូមិន្ទ មេបញ្ជាការកងទ័ពជើងគោក បានទទួលជួបសម្តែងការគួរសម និងពិភាក្សាការងារជាមួយ GM. AKAASH JOHAR អគ្គនាយកនៃកិច្ចសហប្រតិបត្តិការអន្តរជាតិ កងទ័ពជើងគោក នៃសាធារណរដ្ឋឥណ្ឌា",
        "date": "2026-02-18T13:31:53+00:00",
        "photos": ["https://aioncdn.ams3.cdn.digitaloceanspaces.com/telegram/photos/peer=-1210973108_timestamp=1771396313_index=0"],
        "vdo_embedded": null,
        "engagement": 9
    }
]

const ACCOUNT_COLORS = {
  'Senate of Cambodia': '#38bdf8',
  'Samdech Thipadei Hun Manet, Prime Minister of Cambodia': '#f472b6',
  'Samdech Hun Sen of Cambodia': '#4ade80',
  'ក្រសួងការពារជាតិ Ministry of National Defence': '#fb923c',
  'MFAIC (Cambodia)-NEWS': '#a78bfa',
  'Open Authority (OA)': '#fbbf24',
  'Royal Cambodian Army': '#34d399',
}

export default {
  name: 'TelegramGroup',
  data() {
    return {
      posts: POSTS,
      isDark: true,
      selectedChannel: 'all',
      sortBy: 'date_desc',
      expandedPosts: {},
      sortOptions: [
        { value: 'date_desc', text: '🕐 Latest first' },
        { value: 'date_asc', text: '🕐 Oldest first' },
        { value: 'eng_desc', text: '🔥 Most engaged' },
        { value: 'eng_asc', text: '📉 Least engaged' },
        { value: 'photos_desc', text: '📸 Most photos' },
      ],
    }
  },
  computed: {
    uniqueAccounts() {
      return [...new Set(this.posts.map(p => p.account_name).filter(Boolean))].length
    },
    totalEngagement() {
      return this.posts.reduce((s, p) => s + p.engagement, 0)
    },
    totalPhotos() {
      return this.posts.reduce((s, p) => s + (p.photos ? p.photos.length : 0), 0)
    },
    avgEngagement() {
      return Math.round(this.totalEngagement / this.posts.length).toLocaleString()
    },
    maxEngagement() {
      return Math.max(...this.posts.map(p => p.engagement))
    },
    topPost() {
      const p = [...this.posts].sort((a, b) => b.engagement - a.engagement)[0]
      return { ...p, shortAccount: this.getShortName(p.account_name) }
    },
    channelStats() {
      const names = [...new Set(this.posts.map(p => p.account_name).filter(Boolean))]
      const totalsByName = names.map(n => {
        const eng = this.posts.filter(p => p.account_name === n).reduce((s, p) => s + p.engagement, 0)
        const postsCount = this.posts.filter(p => p.account_name === n).length
        return { name: n, eng, posts: postsCount }
      })
      const maxEng = Math.max(...totalsByName.map(x => x.eng)) || 1
      return totalsByName.map(x => ({
        name: x.name,
        shortName: this.getShortName(x.name),
        color: ACCOUNT_COLORS[x.name] || '#94a3b8',
        posts: x.posts,
        engagement: x.eng,
        pct: Math.round((x.eng / maxEng) * 100),
      })).sort((a, b) => b.engagement - a.engagement)
    },
    dateRange() {
      const dates = this.posts.map(p => new Date(p.date)).sort((a, b) => a - b)
      const fmt = d => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      return { from: fmt(dates[0]), to: fmt(dates[dates.length - 1]) }
    },
    filteredPosts() {
      let res = [...this.posts]
      if (this.selectedChannel !== 'all') res = res.filter(p => p.account_name === this.selectedChannel)
      switch (this.sortBy) {
        case 'date_desc': res.sort((a, b) => new Date(b.date) - new Date(a.date)); break
        case 'date_asc': res.sort((a, b) => new Date(a.date) - new Date(b.date)); break
        case 'eng_desc': res.sort((a, b) => b.engagement - a.engagement); break
        case 'eng_asc': res.sort((a, b) => a.engagement - b.engagement); break
        case 'photos_desc': res.sort((a, b) => (b.photos ? b.photos.length : 0) - (a.photos ? a.photos.length : 0)); break
      }
      return res
    },
    filteredEngagement() {
      return this.filteredPosts.reduce((s, p) => s + p.engagement, 0)
    },
  },
  methods: {
    getColor(name) { return ACCOUNT_COLORS[name] || '#94a3b8' },
    getShortName(name) {
      if (!name) return 'Unknown'
      if (name === 'Senate of Cambodia') return 'Senate'
      if (name.includes('Hun Manet')) return 'PM Hun Manet'
      if (name.includes('Hun Sen')) return 'Samdech Hun Sen'
      if (name.includes('National Defence')) return 'Natl. Defence'
      if (name.includes('MFAIC')) return 'MFAIC'
      if (name.includes('Open Authority')) return 'Open Authority'
      if (name.includes('Royal Cambodian')) return 'Royal Army'
      return name.slice(0, 16)
    },
    getInitials(name) {
      if (!name) return '?'
      return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    },
    getCardClass(name) {
      if (name === 'Senate of Cambodia') return 'border-senate'
      if (name && name.includes('Hun Manet')) return 'border-manet'
      if (name && name.includes('Hun Sen')) return 'border-hunsen'
      if (name && name.includes('National Defence')) return 'border-defence'
      if (name && name.includes('MFAIC')) return 'border-mfaic'
      if (name && name.includes('Open Authority')) return 'border-oa'
      if (name && name.includes('Royal Cambodian')) return 'border-army'
      return 'border-default'
    },
    getBadgeVariant(name) {
      if (name === 'Senate of Cambodia') return 'info'
      if (name && name.includes('Hun Manet')) return 'danger'
      if (name && name.includes('Hun Sen')) return 'success'
      return 'secondary'
    },
    getChannelLabel(name) {
      if (name === 'Senate of Cambodia') return 'Senate'
      if (name && name.includes('Hun Manet')) return 'PM Office'
      if (name && name.includes('Hun Sen')) return 'Former PM'
      if (name && name.includes('National Defence')) return 'Defence'
      if (name && name.includes('MFAIC')) return 'Foreign Affairs'
      if (name && name.includes('Open Authority')) return 'OA Channel'
      if (name && name.includes('Royal Cambodian')) return 'Army'
      return 'Gov'
    },
    formatDate(d) {
      return new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
    getDisplayText(post) {
      if (!post.full_text) return ''
      if (this.expandedPosts[post.uid] || post.full_text.length <= 260) return post.full_text
      return post.full_text.slice(0, 260) + '…'
    },
    toggle(uid) { this.$set(this.expandedPosts, uid, !this.expandedPosts[uid]) },
    getEngPct(eng) { return Math.round(eng / this.maxEngagement * 100) },
  },
}
</script>

<style scoped>
/* ══════════════════════════════════════════
   THEME TOGGLE BUTTON
══════════════════════════════════════════ */
.theme-toggle-btn {
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.35);
  color: #38bdf8;
  border-radius: 20px;
  padding: 7px 16px;
  font-family: 'Sarabun', sans-serif;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.light .theme-toggle-btn {
  background: rgba(56, 189, 248, 0.08);
  border-color: #0ea5e9;
  color: #0284c7;
}
.theme-toggle-btn:hover {
  background: rgba(56, 189, 248, 0.22);
  transform: scale(1.04);
}

/* ══════════════════════════════════════════
   DARK THEME
══════════════════════════════════════════ */
.dark.tg-app {
  font-family: 'Sarabun', sans-serif;
  background: #0d1117;
  min-height: 100vh;
  color: #e6edf3;
  transition: background 0.3s, color 0.3s;
}
.dark .topnav {
  background: linear-gradient(135deg, #161b22 0%, #1c2128 100%);
  border-bottom: 1px solid #30363d;
  padding: 14px 32px;
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 100;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}
.dark .tg-logo {
  background: rgba(56,189,248,0.1);
  border: 1px solid rgba(56,189,248,0.2);
}
.dark .brand-text { color: #e6edf3; }
.dark .brand-sub  { color: #8b949e; }
.dark .stat-card {
  background: #161b22; border: 1px solid #30363d;
}
.dark .stat-label { color: #8b949e; }
.dark .stat-value { color: #ffffff; }
.dark .stat-sub   { color: #484f58; }
.dark .stat-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
.dark .breakdown-card,
.dark .sidebar-card { background: #161b22 !important; border: 1px solid #30363d !important; }
.dark .breakdown-title { color: #8b949e; }
.dark .channel-name-sm { color: #c9d1d9; }
.dark .channel-progress { background: #21262d !important; }
.dark .channel-eng-count { color: #8b949e; }
.dark .channel-posts-badge { color: #8b949e !important; background: #21262d !important; }
.dark .sidebar-title { color: #8b949e; }
.dark .filter-btn { color: #c9d1d9; }
.dark .filter-btn:hover { background: #21262d; }
.dark .filter-btn.active { background: #21262d; color: #ffffff; border: 1px solid #30363d; }
.dark .filter-count-badge { background: #21262d !important; color: #8b949e !important; }
.dark .sort-radio-group >>> .custom-control-label { color: #c9d1d9; }
.dark .date-range-info { color: #8b949e; }
.dark .date-range-info strong { color: #e6edf3; }
.dark .feed-eng-total { color: #8b949e; }
.dark .feed-eng-total strong { color: #e6edf3; }
.dark .post-card { background: #161b22 !important; border: 1px solid #30363d !important; }
.dark .post-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.5) !important; border-color: #388bfd !important; }
.dark .post-acct  { color: #e6edf3; }
.dark .post-time  { color: #484f58; }
.dark .post-text  { color: #c9d1d9; background: #0d1117; border: 1px solid #21262d; }
.dark .no-text    { color: #484f58; }
.dark .photo-thumb { border: 1px solid #30363d; background: #0d1117; }
.dark .photo-chip { background: #21262d; border: 1px solid #30363d; }
.dark .photo-more { color: #8b949e; }
.dark .post-footer { border-top: 1px solid #21262d; }
.dark .eng-num  { color: #ffffff; }
.dark .eng-label{ color: #484f58; }
.dark .eng-mini-bar { background: #21262d !important; }
.dark .eng-mini-bar >>> .progress-bar { background: linear-gradient(to right, #38bdf8, #f472b6) !important; }
.dark .media-badge { background: #21262d !important; color: #8b949e !important; }
.dark .empty-state { color: #484f58; }
.dark .btn-to-top { background-color: #38bdf8; border-color: #38bdf8; color: #0d1117; box-shadow: 0 4px 16px rgba(56,189,248,0.3); }
.dark .btn-to-top:hover { background-color: #0ea5e9; border-color: #0ea5e9; }
.dark .channel-progress >>> .progress-bar { background-color: var(--bar-color, #38bdf8) !important; }
.dark .read-more-link { color: #38bdf8 !important; }

/* ══════════════════════════════════════════
   LIGHT THEME
══════════════════════════════════════════ */
.light.tg-app {
  font-family: 'Sarabun', sans-serif;
  background: #f3f6fa;
  min-height: 100vh;
  color: #1a202c;
  transition: background 0.3s, color 0.3s;
}
.light .topnav {
  background: linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%);
  border-bottom: 1px solid #d1dce8;
  padding: 14px 32px;
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 100;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
.light .tg-logo {
  background: rgba(2,132,199,0.08);
  border: 1px solid rgba(2,132,199,0.2);
}
.light .brand-text { color: #1a202c; }
.light .brand-sub  { color: #64748b; }
.light .stat-card {
  background: #ffffff;
  border: 1px solid #d1dce8;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
.light .stat-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
.light .stat-label { color: #64748b; }
.light .stat-value { color: #0f172a; }
.light .stat-sub   { color: #94a3b8; }
.light .breakdown-card,
.light .sidebar-card { background: #ffffff !important; border: 1px solid #d1dce8 !important; box-shadow: 0 1px 4px rgba(0,0,0,0.05) !important; }
.light .breakdown-title { color: #475569; }
.light .channel-name-sm { color: #334155; }
.light .channel-progress { background: #e2e8f0 !important; }
.light .channel-progress >>> .progress-bar { background-color: var(--bar-color, #0ea5e9) !important; }
.light .channel-eng-count { color: #475569; }
.light .channel-posts-badge { color: #64748b !important; background: #f1f5f9 !important; }
.light .sidebar-title { color: #475569; }
.light .filter-btn { color: #334155; }
.light .filter-btn:hover { background: #f1f5f9; }
.light .filter-btn.active { background: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd; font-weight: 600; }
.light .filter-count-badge { background: #f1f5f9 !important; color: #64748b !important; }
.light .sort-radio-group >>> .custom-control-label { color: #334155; }
.light .date-range-info { color: #64748b; }
.light .date-range-info strong { color: #1a202c; }
.light .feed-eng-total { color: #64748b; }
.light .feed-eng-total strong { color: #1a202c; }
.light .post-card {
  background: #ffffff !important;
  border: 1px solid #d1dce8 !important;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05) !important;
}
.light .post-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important; border-color: #0ea5e9 !important; }
.light .post-acct  { color: #0f172a; }
.light .post-time  { color: #94a3b8; }
.light .post-text  { color: #334155; background: #f8fafc; border: 1px solid #e2e8f0; }
.light .no-text    { color: #94a3b8; }
.light .photo-thumb { border: 1px solid #d1dce8; background: #f8fafc; }
.light .photo-chip { background: #f1f5f9; border: 1px solid #d1dce8; }
.light .photo-more { color: #64748b; }
.light .post-footer { border-top: 1px solid #e2e8f0; }
.light .eng-heart { color: #f43f5e; }
.light .eng-num   { color: #0f172a; }
.light .eng-label { color: #94a3b8; }
.light .eng-mini-bar { background: #e2e8f0 !important; }
.light .eng-mini-bar >>> .progress-bar { background: linear-gradient(to right, #0ea5e9, #f472b6) !important; }
.light .media-badge { background: #f1f5f9 !important; color: #64748b !important; }
.light .empty-state { color: #94a3b8; }
.light .btn-to-top { background-color: #0284c7; border-color: #0284c7; color: #fff; box-shadow: 0 4px 16px rgba(2,132,199,0.25); }
.light .btn-to-top:hover { background-color: #0369a1; border-color: #0369a1; }
.light .read-more-link { color: #0284c7 !important; }
.light .avatar { color: #fff; }

/* ══════════════════════════════════════════
   SHARED STRUCTURAL STYLES
══════════════════════════════════════════ */
.topnav-brand { display: flex; align-items: center; gap: 12px; }
.tg-logo { width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.page-wrap { max-width: 1180px; margin: 0 auto; padding: 28px 20px 60px; }
.stat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px; margin-bottom: 24px; }
.stat-card { border-radius: 12px; padding: 18px 20px; border-top: 3px solid transparent; transition: transform 0.2s, box-shadow 0.2s; }
.stat-card:hover { transform: translateY(-3px); }
.stat-card.orange { border-top-color: #f97316; }
.stat-card.pink   { border-top-color: #f472b6; }
.stat-card.amber  { border-top-color: #fbbf24; }
.stat-card.coral  { border-top-color: #fb7185; }
.stat-card.sage   { border-top-color: #4ade80; }
.stat-card.sky    { border-top-color: #38bdf8; }
.stat-icon { font-size: 1.4rem; margin-bottom: 8px; }
.stat-label { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.stat-value { font-family: 'IBM Plex Mono', monospace; font-size: 1.5rem; font-weight: 600; line-height: 1; }
.stat-sub { font-size: 0.72rem; margin-top: 4px; }
.breakdown-card { border-radius: 12px !important; }
.breakdown-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px; }
.channel-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.channel-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.channel-name-sm { font-size: 0.82rem; font-weight: 500; width: 140px; flex-shrink: 0; }
.channel-progress { height: 8px !important; border-radius: 4px; }
.channel-eng-count { font-family: 'IBM Plex Mono', monospace; font-size: 0.78rem; width: 60px; text-align: right; flex-shrink: 0; }
.channel-posts-badge { font-size: 0.7rem; border-radius: 10px; flex-shrink: 0; }
.sidebar-card { border-radius: 12px !important; }
.sidebar-title { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
.filter-btn { width: 100%; text-align: left; background: transparent; border: none; padding: 8px 10px; border-radius: 8px; font-family: 'Sarabun', sans-serif; font-size: 0.84rem; cursor: pointer; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; transition: background 0.15s; }
.filter-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.filter-count-badge { font-size: 0.7rem !important; border-radius: 10px; }
.sort-radio-group >>> .custom-control-label { font-size: 0.84rem; cursor: pointer; }
.sort-radio-group >>> .custom-radio { margin-bottom: 4px; }
.date-range-info { font-size: 0.8rem; }
.feed-eng-total { font-size: 15px; }
.post-card { border-radius: 12px !important; border-left: 4px solid transparent !important; transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s; }
.border-senate   { border-left-color: #38bdf8 !important; }
.border-manet    { border-left-color: #f472b6 !important; }
.border-hunsen   { border-left-color: #4ade80 !important; }
.border-defence  { border-left-color: #fb923c !important; }
.border-mfaic    { border-left-color: #a78bfa !important; }
.border-oa       { border-left-color: #fbbf24 !important; }
.border-army     { border-left-color: #34d399 !important; }
.border-default  { border-left-color: #94a3b8 !important; }
.post-top { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
.avatar-wrap { position: relative; width: 42px; height: 42px; flex-shrink: 0; }
.avatar-img { width: 42px; height: 42px; border-radius: 50%; object-fit: cover; border: 2px solid; position: absolute; top: 0; left: 0; z-index: 2; }
.avatar { width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'IBM Plex Mono', monospace; font-size: 0.78rem; font-weight: 600; position: absolute; top: 0; left: 0; }
.dark .avatar { color: #0d1117; }
.post-meta { min-width: 0; }
.post-acct { font-weight: 700; font-size: 0.87rem; }
.post-channel-badge { font-size: 0.68rem !important; }
.post-time { font-size: 0.74rem; margin-top: 3px; }
.post-text { font-size: 0.875rem; line-height: 1.7; border-radius: 8px; padding: 12px 14px; text-align: left; margin-bottom: 10px; white-space: pre-line; }
.read-more-link { font-size: 0.78rem !important; text-align: center; }
.no-text { font-size: 0.82rem; font-style: italic; margin-bottom: 10px; }
.photo-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
.photo-thumb { width: 62px; height: 62px; border-radius: 8px; overflow: hidden; display: inline-flex; }
.photo-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity 0.2s; }
.photo-thumb:hover img { opacity: 0.85; }
.photo-chip { border-radius: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; }
.photo-more { font-size: 0.7rem; font-weight: 700; font-family: 'IBM Plex Mono', monospace; }
.post-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 10px; margin-top: 4px; }
.eng-wrap { display: flex; align-items: center; gap: 6px; }
.eng-heart { color: #f472b6; }
.eng-num { font-family: 'IBM Plex Mono', monospace; font-size: 0.9rem; font-weight: 600; }
.eng-label { font-size: 0.74rem; }
.eng-mini-bar { width: 70px !important; height: 5px !important; border-radius: 3px; }
.media-badge { font-size: 0.72rem !important; border-radius: 10px; }
.empty-state { text-align: center; padding: 60px 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter, .fade-leave-to { opacity: 0; }
.btn-to-top { width: 60px; height: 60px; padding: 10px 16px; border-radius: 50%; font-size: 22px; line-height: 22px; }
.btn-to-top:hover { }
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .vue-back-to-top { right: 14px !important; }
  .btn-to-top { width: 50px; height: 50px; padding: 10px 13px; }
  .topnav { padding: 12px 16px; }
}
</style>