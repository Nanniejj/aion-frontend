<template>
  <div>
    <!-- {{heightword}} -->
    <vue-element-loading
      :active="getLoadPostTab"
      size="80"
      background-color="rgba(255, 255, 255, 0.3)"
      color="#b6ac9a"
    />
    <div>
      <!-- {{heightword.data[0].Keywords}} -->
      <div class="h5 text-left bold" v-if="api !== 'location'">
        <div v-if="tabs == 'domainTab'">
          <span v-if="dh == ''">All</span>
          <span v-else>{{ dh }}</span>
        </div>
        <div v-if="tabs == 'hashtagTab'">
          <span v-if="dh == ''"> All</span>
          <span v-else>#{{ dh }}</span>
        </div>
        <hr />
      </div>
      <b-form-group label="" v-slot="{ ariaDescribedby }">
        <b-row>
          <b-col sm="12" md="6">
            <b-form-radio-group
              v-model="selected"
              :options="options"
              :aria-describedby="ariaDescribedby"
              name="radio-inline"
              class="mt-1 mb-2 text-left ml-2"
              @change="selectSentiment"
            ></b-form-radio-group>
          </b-col>
          <b-col sm="12" md="6" class="text-right">
            <b-form-select
              v-model="selectedSort"
              :options="optionSort"
              size="sm"
              class="mb-2 select-sort"
              @change="selectSort"
            ></b-form-select>
          </b-col>
        </b-row>
      </b-form-group>
    </div>
    <!-- {{getPostAllMonitor}} -->
    <div id="profile-page" v-if="getPostAllMonitor.length != 0">
      <!-- Highlight -->
      <b-form-checkbox
        switch
        size="lg"
        class="text-right"
        v-model="checked"
        v-if="pageCheck == 'Domain'"
      >
        <span :style="myStyle" v-if="checked" class="box-hl pl-2 pr-2"
          >Highlight</span
        >
        <span v-else class="box-hl pl-2 pr-2">Highlight</span>
      </b-form-checkbox>
      <b-form-checkbox
        switch
        size="lg"
        class="text-right"
        v-model="checked"
        v-if="api == 'location' && pageMenu !== 'domain'"
      >
        <span :style="myStyle" v-if="checked" class="box-hl pl-2 pr-2"
          >Highlight</span
        >
        <span v-else class="box-hl pl-2 pr-2">Highlight</span>
      </b-form-checkbox>
      <!-- {{getPostAllMonitor[1]}} -->
      <b-card
        class="mb-4"
        style="border: none"
        id="box-content"
        footer-tag="footer"
        header-tag="header"
        v-for="(profilePost, k) in getPostAllMonitor"
        :key="k"
      >
        <template #header v-if="profilePost">
          <b-row>
            <b-col
              md="12"
              v-if="
                getProfileData && profilePost.account_name && api == 'profile'
              "
            >
              <div
                v-if="
                  getProfileData.toLowerCase() !==
                    profilePost.account_name.toLowerCase() &&
                    profilePost.source == 'twitter'
                "
                class="text-left mb-1 box-retweet"
              >
                <i class="fa fa-retweet" /> {{ getProfileData }} Retweet
              </div>
            </b-col>
            <b-col class="align-start col-lg-auto w-auto" sm="auto" lg="auto">
              <span class="left">
                <span v-if="profilePost.profile_image">
                  <b-avatar
                    @error="setAltImg"
                    size="47px"
                    :src="profilePost.profile_image"
                    loading="lazy"
                    class="imgpro"
                    v-if="profilePost.source != 'blockdit'"
                  ></b-avatar>
                  <b-avatar
                    @error="setAltImg"
                    size="47px"
                    :src="profilePost.profile_image"
                    loading="lazy"
                    v-else
                  ></b-avatar>
                </span>
                <span v-else>
                  <b-avatar
                    @error="setAltImg"
                    size="47px"
                    :src="profilePost.photos"
                    loading="lazy"
                    class="imgpro"
                    v-if="profilePost.source == 'tiktok'"
                  ></b-avatar>
                  <b-avatar size="45px" v-else></b-avatar>
                </span>
                <img
                  v-if="profilePost.source == 'twitter'"
                  src="@/assets/Twitter.png"
                  class="social-img"
                />
                <img
                  v-else-if="profilePost.source == 'facebook'"
                  src="@/assets/Facebook.png"
                  class="social-img"
                />
                <img
                  v-if="profilePost.source == 'news'"
                  src="@/assets/News.png"
                  class="social-img"
                />
                <img
                  v-if="profilePost.source == 'pantip'"
                  src="@/assets/Pantip.png"
                  class="social-img"
                />
                <img
                  v-if="profilePost.source == 'instagram'"
                  src="@/assets/Instagram.png"
                  class="social-img"
                />
                <img
                  v-if="profilePost.source == 'youtube'"
                  src="@/assets/Youtube.png"
                  class="social-img"
                />
                <img
                  v-if="profilePost.source == 'blockdit'"
                  src="@/assets/Blockdit.png"
                  class="social-img"
                />
                <img
                  v-if="profilePost.source == 'tiktok'"
                  src="@/assets/Tiktok.png"
                  class="social-img"
                />
              </span>
            </b-col>
            <b-col class="align-start w-auto" sm="8" lg="auto">
              <span id="txt-name">
                <span
                  ><b> {{ profilePost.account_name }} </b></span
                >
                <a
                  v-bind:href="profilePost.url_post"
                  class="fa fa-external-link"
                  target="_blank"
                ></a
              ></span>
              <div class="font-weight-light small" v-if="profilePost.date">
                {{ profilePost.date.split("T")[0] }} |
                {{ profilePost.date.split("T")[1] }}
              </div>
            </b-col>
            <b-col class="text-md-right" sm="12" lg="" md="">
              <div class="mt-1">
                <img class="images1 d-none" :src="profilePost.snapshot" />
                <i
                  v-if="profilePost.snapshot"
                  class="fas fa-camera mr-2"
                  @click="onClick(0, [profilePost.snapshot])"
                />
                <span v-if="profilePost.user_sentiment">
                  <span
                    v-if="
                      profilePost.user_sentiment[objId] == 0 ||
                        profilePost.user_sentiment[objId]
                    "
                  >
                    <b-button-group
                      size="sm"
                      id="btn-group"
                      v-if="profilePost.user_sentiment[objId] == 1"
                    >
                      <b-button
                        id="btn-pos"
                        :style="btnPosStyle"
                        @click="getTheSelected(k, 1, profilePost.uid)"
                        >Positive</b-button
                      >
                      <b-button
                        id="btn-nue"
                        @click="getTheSelected(k, 0, profilePost.uid)"
                        >Neutral</b-button
                      >
                      <b-button
                        id="btn-neg"
                        @click="getTheSelected(k, -1, profilePost.uid)"
                        >Negative</b-button
                      >
                    </b-button-group>
                    <b-button-group
                      size="sm"
                      id="btn-group"
                      v-if="profilePost.user_sentiment[objId] == 0"
                    >
                      <b-button
                        id="btn-pos"
                        @click="getTheSelected(k, 1, profilePost.uid)"
                        >Positive</b-button
                      >
                      <b-button
                        id="btn-nue"
                        :style="btnNeuStyle"
                        @click="getTheSelected(k, 0, profilePost.uid)"
                        >Neutral</b-button
                      >
                      <b-button
                        id="btn-neg"
                        @click="getTheSelected(k, -1, profilePost.uid)"
                        >Negative</b-button
                      >
                    </b-button-group>
                    <b-button-group
                      size="sm"
                      id="btn-group"
                      v-if="profilePost.user_sentiment[objId] == -1"
                    >
                      <b-button
                        id="btn-pos"
                        @click="getTheSelected(k, 1, profilePost.uid)"
                        >Positive</b-button
                      >
                      <b-button
                        id="btn-nue"
                        @click="getTheSelected(k, 0, profilePost.uid)"
                        >Neutral</b-button
                      >
                      <b-button
                        id="btn-neg"
                        :style="btnNegStyle"
                        @click="getTheSelected(k, -1, profilePost.uid)"
                        >Negative</b-button
                      >
                    </b-button-group>
                  </span>
                  <span v-else>
                    <b-button-group
                      size="sm"
                      id="btn-group"
                      v-if="profilePost.sentiment == 1"
                    >
                      <b-button
                        id="btn-pos"
                        :style="btnPosStyle"
                        @click="getTheSelected(k, 1, profilePost.uid)"
                        >Positive</b-button
                      >
                      <b-button
                        id="btn-nue"
                        @click="getTheSelected(k, 0, profilePost.uid)"
                        >Neutral</b-button
                      >
                      <b-button
                        id="btn-neg"
                        @click="getTheSelected(k, -1, profilePost.uid)"
                        >Negative</b-button
                      >
                    </b-button-group>
                    <b-button-group
                      size="sm"
                      id="btn-group"
                      v-if="profilePost.sentiment == 0"
                    >
                      <b-button
                        id="btn-pos"
                        @click="getTheSelected(k, 1, profilePost.uid)"
                        >Positive</b-button
                      >
                      <b-button
                        id="btn-nue"
                        :style="btnNeuStyle"
                        @click="getTheSelected(k, 0, profilePost.uid)"
                        >Neutral</b-button
                      >
                      <b-button
                        id="btn-neg"
                        @click="getTheSelected(k, -1, profilePost.uid)"
                        >Negative</b-button
                      >
                    </b-button-group>
                    <b-button-group
                      size="sm"
                      id="btn-group"
                      v-if="profilePost.sentiment == -1"
                    >
                      <b-button
                        id="btn-pos"
                        @click="getTheSelected(k, 1, profilePost.uid)"
                        >Positive</b-button
                      >
                      <b-button
                        id="btn-nue"
                        @click="getTheSelected(k, 0, profilePost.uid)"
                        >Neutral</b-button
                      >
                      <b-button
                        id="btn-neg"
                        :style="btnNegStyle"
                        @click="getTheSelected(k, -1, profilePost.uid)"
                        >Negative</b-button
                      >
                    </b-button-group>
                  </span>
                </span>
                <span v-else>
                  <b-button-group
                    size="sm"
                    id="btn-group"
                    v-if="profilePost.sentiment == 1"
                  >
                    <b-button
                      id="btn-pos"
                      :style="btnPosStyle"
                      @click="getTheSelected(k, 1, profilePost.uid)"
                      >Positive</b-button
                    >
                    <b-button
                      id="btn-nue"
                      @click="getTheSelected(k, 0, profilePost.uid)"
                      >Neutral</b-button
                    >
                    <b-button
                      id="btn-neg"
                      @click="getTheSelected(k, -1, profilePost.uid)"
                      >Negative</b-button
                    >
                  </b-button-group>
                  <b-button-group
                    size="sm"
                    id="btn-group"
                    v-if="profilePost.sentiment == 0"
                  >
                    <b-button
                      id="btn-pos"
                      @click="getTheSelected(k, 1, profilePost.uid)"
                      >Positive</b-button
                    >
                    <b-button
                      id="btn-nue"
                      :style="btnNeuStyle"
                      @click="getTheSelected(k, 0, profilePost.uid)"
                      >Neutral</b-button
                    >
                    <b-button
                      id="btn-neg"
                      @click="getTheSelected(k, -1, profilePost.uid)"
                      >Negative</b-button
                    >
                  </b-button-group>
                  <b-button-group
                    size="sm"
                    id="btn-group"
                    v-if="profilePost.sentiment == -1"
                  >
                    <b-button
                      id="btn-pos"
                      @click="getTheSelected(k, 1, profilePost.uid)"
                      >Positive</b-button
                    >
                    <b-button
                      id="btn-nue"
                      @click="getTheSelected(k, 0, profilePost.uid)"
                      >Neutral</b-button
                    >
                    <b-button
                      id="btn-neg"
                      :style="btnNegStyle"
                      @click="getTheSelected(k, -1, profilePost.uid)"
                      >Negative</b-button
                    >
                  </b-button-group>
                </span>
              </div>
            </b-col>
          </b-row>
        </template>
        <b-row>
          <b-col md="12"> </b-col>
          <b-col lg="12">
            <div v-if="pageCheck == 'Domain'" class="box-contents">
              <Highlighter
                class="my-highlight"
                :style="{
                  textAlign: 'justify',
                  fontSize: '17px',
                  padding: '10px',
                }"
                highlightClassName="highlight2"
                :searchWords="highlightText(profilePost.full_text)"
                :autoEscape="true"
                :textToHighlight="
                  profilePost.read
                    ? profilePost.full_text.slice(0, 450)
                    : profilePost.full_text
                "
              />
              <div
                v-if="profilePost.full_text.length > 450"
                @click="profilePost.read = !profilePost.read"
                id="readmore"
              >
                <span v-if="profilePost.read == true">... อ่านต่อ</span
                ><span v-else>ย่อบทความ</span>
              </div>
            </div>
            <div
              v-else-if="api == 'location' && pageMenu !== 'domain'"
              class="box-contents"
            >
              <Highlighter
                class="my-highlight"
                :style="{
                  textAlign: 'left',
                  fontSize: '17px',
                  padding: '10px',
                }"
                highlightClassName="highlight2"
                :searchWords="highlightText2"
                :autoEscape="true"
                :textToHighlight="
                  profilePost.read
                    ? profilePost.full_text.slice(0, 450)
                    : profilePost.full_text
                "
              />
              <div
                v-if="profilePost.full_text.length > 450"
                @click="profilePost.read = !profilePost.read"
                id="readmore"
              >
                <span v-if="profilePost.read == true">... อ่านต่อ</span
                ><span v-else>ย่อบทความ</span>
              </div>
            </div>
            <div v-else>
              <div
                id="txt-cmt"
                class="font-weight-normal"
                v-if="profilePost.full_text"
              >
                <read-more
                  more-str="อ่านต่อ"
                  :text="profilePost.full_text"
                  link="#"
                  less-str="ย่อบทความ"
                  :max-chars="450"
                ></read-more>
                <!-- {{ profilePost.full_text }} -->
              </div>
            </div>
          </b-col>
          <b-col>
            <div v-if="profilePost.source == 'tiktok' && profilePost.uid">
              <lite-tiktok :videoid="profilePost.uid"></lite-tiktok>

              <!-- <iframe
                width="auto"
                height="750"
                :src="'https://www.tiktok.com/embed/v2/' + profilePost.uid"
                allowfullscreen
              ></iframe> -->
            </div>
            <div
              id="photo-grid"
              v-if="profilePost.photos && profilePost.source !== 'tiktok'"
              class="mb-4"
            >
              <!-- {{typeof(profilePost.photos)}} -->
              <div
                v-if="
                  profilePost.photos && typeof profilePost.photos == 'string'
                "
              >
                <img
                  class="images1"
                  :src="profilePost.photos"
                  @click="onClick(0, [profilePost.photos])"
                  onerror="this.style.display='none'"
                />
              </div>
              <div v-else>
                <div v-if="profilePost.photos.length == 1" class="p-20">
                  <img
                    class="d-none images1"
                    v-for="(image, i) in profilePost.photos"
                    :src="profilePost.photos"
                    @click="onClick(i, profilePost.photos)"
                    :key="i"
                  />
                  <img
                    class="images1"
                    v-for="(image, i) in profilePost.photos"
                    :src="profilePost.photos"
                    @click="onClick(i, profilePost.photos)"
                    :key="`A-${i}`"
                    onerror="this.style.display='none'"
                  />
                </div>
                <div v-else-if="profilePost.photos.length == 2" class="p-20">
                  <img
                    class="images2"
                    v-for="(image, i) in profilePost.photos"
                    :src="image"
                    @click="onClick(i, profilePost.photos)"
                    :key="`ฺB-${i}`"
                    onerror="this.style.display='none'"
                  />
                </div>
                <div v-else-if="profilePost.photos.length == 3" class="p-20">
                  <img
                    class="images3"
                    v-for="(image, i) in profilePost.photos"
                    :src="image"
                    @click="onClick(i, profilePost.photos)"
                    :key="`C-${i}`"
                    onerror="this.style.display='none'"
                  />
                </div>
                <div v-else class="p-20 col2">
                  <img
                    class="images4"
                    v-for="(image, i) in profilePost.photos.slice(0, 4)"
                    :src="image"
                    @click="onClick(i, profilePost.photos)"
                    :key="`D-${i}`"
                    onerror="this.style.display='none'"
                  />
                  <div
                    v-if="profilePost.photos.length > 4"
                    id="picmore"
                    @click="onClick(3, profilePost.photos)"
                    onerror="this.style.display='none'"
                  >
                    +{{ profilePost.photos.length - 4 }}
                  </div>
                </div>
              </div>
              <vue-gallery-slideshow
                :images="dataPhoto"
                :index="index"
                @close="index = null"
              ></vue-gallery-slideshow>
            </div>
          </b-col>
        </b-row>
        <template #footer>
          <div class="text-left md-font">
            <span
              v-b-tooltip.hover
              title="Engagement"
              v-if="profilePost.source == 'pantip'"
            >
              <span style="font-size:14px;">Engages </span>
              {{
                (profilePost.engagement + profilePost.comments_count)
                  | numFormat
              }}
            </span>

            <span v-b-tooltip.hover title="Engagement" v-else>
              <span style="font-size:14px;">Engages </span
              >{{ profilePost.engagement | numFormat }}
            </span>

            <span
              v-b-toggle="'btn' + page + k"
              id="box-reaction"
              v-b-tooltip.hover
              title="Comments"
            >
              <i
                class="fas fa-comment"
                :aria-expanded="visible ? 'true' : 'false'"
                style="cursor: pointer"
              >
              </i>
              <span
                class="md-font"
                v-if="
                  profilePost.comments_count && profilePost.source == 'news'
                "
              >
                {{ profilePost.comments.comments.length | numFormat }}&nbsp;
              </span>
              <span v-else class="md-font">
                {{ profilePost.comments_count | numFormat }}&nbsp;</span
              >
              <!-- <span  class="md-font" v-if="profilePost.comments_count==''&&profilePost.source == 'twitter'"> 0 </span> -->
            </span>

            <!------------- engages-------------- -->
            <!-- <span
              id="box-reaction"
              v-b-tooltip.hover
              title="Engagement"
              v-if="profilePost.source == 'pantip'"
              style="float:right;"
            >
              <span style="font-size:14px;"
                >Engages
                {{
                  (profilePost.engagement + profilePost.comments_count)
                    | numFormat
                }}</span
              >
            </span> -->
            <!-- <span
              id="box-reaction"
              v-b-tooltip.hover
              title="Engagement"
              v-else
              style="float:right;"
            >
              <span style="font-size:14px;"
                >Engages {{ profilePost.engagement | numFormat }}</span
              >
            </span> -->

            <!-- twitter -->
            <span v-if="profilePost.source == 'twitter'">
              <span
                v-if="
                  profilePost.retweets_count !== '0' &&
                    profilePost.retweets_count
                "
                id="box-reaction"
                v-b-tooltip.hover
                title="Retweet"
              >
                <i class="fal fa-retweet"></i>
                {{ profilePost.retweets_count | numFormat }}
              </span>
              <span
                v-if="
                  profilePost.likes_count !== '0' && profilePost.likes_count
                "
                id="box-reaction"
                v-b-tooltip.hover
                title="Like"
              >
                <i class="fa fa-heart"></i>
                {{ profilePost.likes_count | numFormat }}
              </span>
            </span>

            <span v-if="profilePost.source == 'facebook'">
              <span
                v-if="
                  profilePost.likes_count !== '0' && profilePost.likes_count
                "
                id="box-reaction"
                v-b-tooltip.hover
                title="Like"
              >
                <i class="far fa-thumbs-up" />
                {{ profilePost.likes_count | numFormat }}
              </span>
            </span>
            <!-- share blockdit -->
            <!-- <span
              v-if="
                profilePost.source == 'blockdit' &&
                  profilePost.engagement !== '0'
              "
            >
              <span id="box-reaction" v-b-tooltip.hover title="Share">
                <i class="fa fa-share"></i>
                <span class="md-font">
                  {{ profilePost.engagement | numFormat }}
                </span>
              </span>
            </span> -->
            <!-- reaction-->
            <span v-if="profilePost.reaction">
              <span v-if="profilePost.reaction != ''">
                <!-- pt -->
                <span v-if="profilePost.reaction.Good">
                  <span
                    v-if="profilePost.reaction.Good !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Good Content"
                  >
                    <i class="fa fa-plus"></i>
                    <span class="md-font">
                      {{ profilePost.reaction.Good | numFormat }}
                    </span>
                  </span>
                </span>
                <span v-if="profilePost.reaction.Horror">
                  <span
                    v-if="profilePost.reaction.Horror !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Horror"
                  >
                    <img
                      v-if="profilePost.reaction.Horror !== '0'"
                      src="@/assets/horror.png"
                      id="emoji"
                    />
                    <span
                      class="md-font"
                      v-if="profilePost.reaction.Horror !== '0'"
                    >
                      {{ profilePost.reaction.Horror | numFormat }}
                    </span>
                  </span>
                </span>
                <!-- pt -->
                <!-- fb -->

                <span v-if="profilePost.reaction.Likes">
                  <span
                    v-if="profilePost.reaction.Likes !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Like"
                  >
                    <img
                      v-if="profilePost.reaction.Likes !== '0'"
                      src="@/assets/fb_like.png"
                      id="emoji"
                    />
                    <span
                      class="md-font"
                      v-if="profilePost.reaction.Likes !== '0'"
                    >
                      {{ profilePost.reaction.Likes | numFormat }}
                    </span>
                  </span>
                </span>

                <span v-if="profilePost.reaction.like">
                  <span
                    v-if="profilePost.reaction.like !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Like"
                  >
                    <img
                      v-if="profilePost.reaction.like !== '0'"
                      src="@/assets/fb_like.png"
                      id="emoji"
                    />
                    <span
                      class="md-font"
                      v-if="profilePost.reaction.like !== '0'"
                    >
                      {{ profilePost.reaction.like | numFormat }}
                    </span>
                  </span></span
                >

                <span v-if="profilePost.reaction.share">
                  <span
                    v-if="profilePost.reaction.share !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Share"
                  >
                    <i
                      class="fa fa-share"
                      v-if="profilePost.reaction.share !== '0'"
                    ></i>
                    <span
                      class="md-font"
                      v-if="profilePost.reaction.share !== '0'"
                    >
                      {{ profilePost.reaction.share | numFormat }}
                    </span>
                  </span>
                </span>

                <span v-if="profilePost.reaction.shares">
                  <span
                    v-if="profilePost.reaction.shares !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Share"
                  >
                    <i
                      class="fa fa-share"
                      v-if="profilePost.reaction.shares !== '0'"
                    ></i>
                    <span
                      class="md-font"
                      v-if="profilePost.reaction.shares !== '0'"
                    >
                      {{ profilePost.reaction.shares | numFormat }}
                    </span>
                  </span>
                </span>

                <span v-if="profilePost.reaction.Love">
                  <span
                    v-if="profilePost.reaction.Love !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Love"
                  >
                    <img
                      v-if="profilePost.reaction.Love !== '0'"
                      src="@/assets/love.png"
                      id="emoji"
                    />
                    <span
                      class="md-font"
                      v-if="profilePost.reaction.Love !== '0'"
                    >
                      {{ profilePost.reaction.Love | numFormat }}
                    </span>
                  </span>
                </span>

                <span v-if="profilePost.reaction.Wow">
                  <span
                    v-if="profilePost.reaction.Wow !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Wow"
                  >
                    <img
                      v-if="profilePost.reaction.Wow !== '0'"
                      src="@/assets/wow.png"
                      id="emoji"
                    />
                    <span
                      class="md-font"
                      v-if="profilePost.reaction.Wow !== '0'"
                    >
                      {{ profilePost.reaction.Wow | numFormat }}
                    </span>
                  </span>
                </span>

                <span v-if="profilePost.reaction.Haha">
                  <span
                    v-if="profilePost.reaction.Haha !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Haha"
                  >
                    <img
                      v-if="profilePost.reaction.Haha !== '0'"
                      src="@/assets/haha.png"
                      id="emoji"
                    />
                    <span
                      class="md-font"
                      v-if="profilePost.reaction.Haha !== '0'"
                    >
                      {{ profilePost.reaction.Haha | numFormat }}
                    </span>
                  </span>
                </span>

                <span v-if="profilePost.reaction.Sad">
                  <span
                    v-if="profilePost.reaction.Sad !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Sad"
                  >
                    <img
                      v-if="profilePost.reaction.Sad !== '0'"
                      src="@/assets/sad.png"
                      id="emoji"
                    />
                    <span
                      class="md-font"
                      v-if="profilePost.reaction.Sad !== '0'"
                    >
                      {{ profilePost.reaction.Sad | numFormat }}
                    </span>
                  </span>
                </span>

                <span v-if="profilePost.reaction.Angry">
                  <span
                    v-if="profilePost.reaction.Angry !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Angry"
                  >
                    <img
                      v-if="profilePost.reaction.Angry !== '0'"
                      src="@/assets/angry.png"
                      id="emoji"
                    />
                    <span
                      class="md-font"
                      v-if="profilePost.reaction.Angry !== '0'"
                    >
                      {{ profilePost.reaction.Angry | numFormat }}
                    </span>
                  </span>
                </span>
                <span v-if="profilePost.reaction.Hug">
                  <span
                    v-if="profilePost.reaction.Hug !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Hug"
                  >
                    <img
                      v-if="profilePost.reaction.Hug !== '0'"
                      src="@/assets/hug.png"
                      id="emoji"
                    />
                    <span
                      class="md-font"
                      v-if="profilePost.reaction.Hug !== '0'"
                    >
                      {{ profilePost.reaction.Hug | numFormat }}
                    </span>
                  </span>
                </span>

                <!-- yt -->
                <span
                  v-if="profilePost.reaction.view_count"
                  v-b-tooltip.hover
                  title="Views"
                >
                  <span
                    v-if="profilePost.reaction.view_count !== ''"
                    id="box-reaction"
                    ><i class="fas fa-eye"></i>
                    <span
                      class="md-font"
                      v-if="profilePost.reaction.view_count !== ''"
                    >
                      {{ profilePost.reaction.view_count | numFormat }}
                    </span>
                  </span>
                </span>
                <span v-if="profilePost.reaction.likes">
                  <span
                    v-if="profilePost.reaction.likes !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Like"
                  >
                    <img v-if="profilePost.reaction.likes !== '0'" /><i
                      class="far fa-thumbs-up"
                    ></i>
                    <span
                      class="md-font"
                      v-if="profilePost.reaction.likes !== '0'"
                    >
                      {{ profilePost.reaction.likes | numFormat }}
                    </span>
                  </span>
                </span>

                <span v-if="profilePost.reaction.dislikes">
                  <span
                    v-if="profilePost.reaction.dislikes !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Dislike"
                  >
                    <i class="far fa-thumbs-down"></i>
                    <span class="md-font">
                      {{ profilePost.reaction.dislikes | numFormat }}
                    </span>
                  </span>
                </span>
                <!-- end yt -->
              </span>
            </span>
          </div>
          <!-- comment content -->
          <b-collapse
            :id="'btn' + page + k"
            class="mt-2"
            v-if="
              profilePost.source !== 'facebook' &&
                profilePost.source !== 'twitter'
            "
          >
            <b-card id="cmt-card" class="text-left">
              <span v-if="profilePost.source == 'news' && profilePost.comments">
                <div
                  v-for="(cmtn, inx) in profilePost.comments.comments"
                  :key="inx"
                >
                  <b-row>
                    <b-col lg="1">
                      <img
                        :src="cmtn.pictureUrl"
                        id="img-cmt"
                        @error="setAltImg"
                      />
                    </b-col>
                    <b-col lg="11">
                      <div>
                        <span class="bold">{{ cmtn.displayName }}</span>
                        <span class="font-weight-light" id="cmt-time">{{
                          cmtn.time
                        }}</span>
                      </div>

                      <div v-for="(text, i) in cmtn.contents" :key="i">
                        {{ text.extData.content }}
                      </div>
                    </b-col>
                  </b-row>
                  <hr />
                </div>
              </span>
              <span v-else>
                <div v-for="(cmt, i) in profilePost.comments" :key="i">
                  <b-row>
                    <b-col lg="1">
                      <a
                        :href="cmt.url"
                        target="_blank"
                        v-if="profilePost.source == 'pantip'"
                      >
                        <img
                          :src="cmt.profile_image"
                          id="img-cmt"
                          v-bind:href="cmt.url"
                      /></a>
                      <a
                        :href="'https://www.youtube.com/' + cmt.author_link"
                        target="_blank"
                        v-if="profilePost.source == 'youtube'"
                      >
                        <img :src="cmt.photo" id="img-cmt"
                      /></a>

                      <!-- <img v-if="profilePost.source=='news'" :src="cmt.comments.pictureUrl" id="img-cmt"> -->
                      <span> </span>
                    </b-col>
                    <b-col lg="11">
                      <div>
                        <a :href="cmt.url" target="_blank">
                          <span
                            v-if="profilePost.source == 'pantip'"
                            class="bold"
                          >
                            {{ cmt.username }}</span
                          ></a
                        >
                        <a
                          :href="'https://www.youtube.com/' + cmt.author_link"
                          target="_blank"
                          v-if="profilePost.source == 'youtube'"
                        >
                          <span
                            v-if="profilePost.source == 'youtube'"
                            class="bold"
                          >
                            {{ cmt.author }}</span
                          ></a
                        >
                        <span
                          v-if="profilePost.source == 'pantip' && cmt.time"
                          class="font-weight-light"
                          id="cmt-time"
                          >{{ cmt.time }}</span
                        >
                        <span
                          v-if="profilePost.source == 'youtube' && cmt.time"
                          class="font-weight-light"
                          id="cmt-time"
                          >{{ cmt.time.split("T")[0] }} |
                          {{ cmt.time.split("T")[1] }}</span
                        >
                      </div>
                      <div
                        v-if="profilePost.source == 'pantip'"
                        class="font-weight-light"
                      >
                        {{ cmt.content }}
                      </div>
                      <div
                        v-if="profilePost.source == 'youtube'"
                        class="font-weight-light"
                      >
                        {{ cmt.text }}
                      </div>
                    </b-col>
                  </b-row>
                  <hr />
                </div>
              </span>
            </b-card>
          </b-collapse>
        </template>
      </b-card>
      <infinite-loading
        v-if="isInfinite"
        spinner="spiral"
        :identifier="infiniteId"
        @infinite="infiniteScroll"
      ></infinite-loading>
    </div>

    <div v-else>
      <b-card class="font-weight-normal">
        <br />
        ไม่พบข้อมูล
      </b-card>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Highlighter from "vue-highlight-words";
import VueGallerySlideshow from "vue-gallery-slideshow";
import moment from "moment";
import "@justinribeiro/lite-tiktok";
export default {
  components: {
    VueGallerySlideshow,
    Highlighter,
  },
  props: {
    domainKeyword:{
      type: String,
    },
    crawdash:{
      type: String,
    },
    menu: {
      type: String,
    },
    pageMenu: {
      type: String,
    },
    statusLocat: {
      type: Boolean,
    },
    changwats: {
      type: String,
    },
    amphoes: {
      type: Array,
    },
    users: {
      type: String,
    },
    api: {
      type: String,
    },
    tabs: {
      type: String,
    },
    dh: {
      type: String,
    },
    btn: {
      type: Boolean,
    },
    dateLocat: {
      type: Array,
    },
  },
  watch: {
    domainKeyword(val){
      this.page = 0;
      this.isInfinite = true;
      this.infiniteScroll();
    },
    crawdash(val) {
      console.log('crawdash',val);
      this.crawdash = val;
      this.page = 0;
      this.isInfinite = true;
      this.infiniteScroll();
    },
    dh: function(newVal, oldVal) {
      // watch it
      console.log("Prop changed: ", newVal, " | was: ", oldVal);
      this.page = 0;
      this.isInfinite = true;
      this.infiniteScroll();
    },
    statusLocat: function(newVal, oldVal) {
      // watch it
      console.log("Prop changed: ", newVal, " | was: ", oldVal);
      this.page = 0;
      this.isInfinite = true;
      this.infiniteScroll();
    },
    changwats: function(newVal, oldVal) {
      console.log("Prop changed: ", newVal, " | was: ", oldVal);
      // this.page = 0;
      // this.isInfinite = true;
      // this.infiniteScroll();
    },
    btn() {
      this.page = 0;
      this.isInfinite = true;
      this.infiniteScroll();
    },
    amphoes: function(newVal, oldVal) {
      console.log("Prop changed amphoes: ", newVal, " | was: ", oldVal);
      // this.page = 0;
      // this.isInfinite = true;
      // this.infiniteScroll();
    },
    users: function(newVal, oldVal) {
      console.log("Prop changed: ", newVal, " | was: ", oldVal);
      // this.page = 0;
      // this.isInfinite = true;
      // this.infiniteScroll();
    },
    getSocialDomain: function(newVal, oldVal) {
      // watch it
      console.log("Prop changed: ", newVal, " | was: ", oldVal);
      this.page = 0;
      this.isInfinite = true;
      this.infiniteScroll();
    },
    getArrDate: function() {
      this.page = 0;
      this.selectedSort = "";
      this.selected = "";
      this.isInfinite = true;
      this.infiniteScroll();
    },
    getArrDateProfile() {
      this.page = 0;
      this.selectedSort = "";
      this.selected = "";
      this.isInfinite = true;
      this.infiniteScroll();
    },
    getArrDateHashtag() {
      this.page = 0;
      this.selectedSort = "";
      this.selected = "";
      this.isInfinite = true;
      this.infiniteScroll();
    },
  },
  data() {
    return {

      objId: "",
      andkey: [],
      arrword: [],
      myStyle: {
        backgroundColor: "#f7dca2",
      },
      checked: true,
      pageCheck: "",
      heightword: [],
      btnPosStyle: {
        backgroundColor: "#54c69d",
        color: "#ffffff",
        borderColor: "#54c69d",
      },
      btnNeuStyle: {
        backgroundColor: "#3a86ad",
        color: "#ffffff",
        borderColor: "#3a86ad",
      },
      btnNegStyle: {
        backgroundColor: "#f7776a",
        color: "#ffffff",
        borderColor: "#f7776a",
      },
      dataPost: [],
      sdate: "",
      edate: "",
      default_avatar: "user.svg",
      visible: false,
      index: null,
      dataPhoto: [],
      text: "",
      page: 0,
      infiniteId: +new Date(),
      isInfinite: true,
      dm: "",
      ht: "",
      selected: "",
      selectedSort: "",
      options: [
        { text: "Positive", value: "1" },
        { text: "Neutral", value: "0" },
        { text: "Negative", value: "-1" },
        { text: "ทั้งหมด", value: "" },
      ],
      optionSort: [
        { value: "", text: " โพสต์ล่าสุด" },
        { value: "descend", text: "โพสต์เริ่มต้น" },
        { value: "engagement", text: "Engagement" },
      ],
    };
  },
  computed: {
    ...mapGetters([
      "getProfileMonitor",
      "getProfileData",
      "getTabStatus",
      "getPostAllMonitor",
      "getTopData",
      "getTopHash",
      "getHashtagData",
      "getLoadStatus",
      "getClickDomain",
      "getPostAllMonitor",
      "getSocialDomain",
      "getSdateDm",
      "getEdateDm",
      "getArrDate",
      "getSocialPlatform",
      "getDomainArr",
      "getLoadPostTab",
      "getArrDateProfile",
      "getSDateProfile",
      "getEDateProfile",
      "getSDateHt",
      "getEDateHt",
      "getArrDateHashtag",
      "getValSource",
    ]),
    domainName() {
      var d = this.dm;
      if (d == "") {
        var data = this.getProfileMonitor.topfive;
        var dmn;

        for (let i = 0, len = data.length; i < len; i++) {
          dmn += data[i].name + ",";
          d = dmn.replace("undefined", "");
        }
      } else {
        d = this.dm;
      }
      return d;
    },
    highlightText2() {
      var word = [];
      let jw = this.changwats.split(",");
      let am = this.amphoes;
      console.log("this.amphoes", this.amphoes, jw);
      if (this.checked) {
        word = jw.concat(am);
      }
      console.log("wordddd", word);
      return word;
    },
  },
  methods: {
    accountName(post, i) {
      var axios = require("axios");
      // console.log("เข้า", post.source);
      var config = {
        method: "get",
        url:
          "https://api2.cognizata.com/api/v2/object/translateuid?uid=" +
          post.account_name,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      axios(config)
        .then((response) => {
          console.log("Object.keys", Object.keys(response.data).length, i);
          if (Object.keys(response.data).length) {
            // this.accName = response.data.name;
            this.getPostAllMonitor[i].account_name = response.data.name;
            // console.log(
            //   "เข้ามี",
            //   post.source,
            //   response.data.name,this.getPostAllMonitor[i].account_name
            // );
          } else {
            // this.accName = post.account_name;
            // this.getPostAllMonitor[i].account_name = post.account_name;
            // console.log(
            //   "เข้าว่าง",
            //   post.source,
            //   response.data.name,this.getPostAllMonitor[i].account_name
            // );
            return;
          }
        })
        .catch((error) => {
          // this.accName = post.account_name;
          console.log(error);
        });
      // console.log('oldgetPostAllMonitor',this.getPostAllMonitor[i].account_name ,i);
      // this.getPostAllMonitor[i].account_name =pname
      // console.log('New getPostAllMonitor',this.getPostAllMonitor[i].account_name,i);
      // this.getPostAllMonitor[i]['acount_name']
      // console.log("return", pname);
      return this.getPostAllMonitor[i].account_name;
    },
    highlightText(full_text) {
      var word = [];
      if (this.checked) {
        word.push(...this.heightword);
        if (this.domainKeyword) {
          word.push(this.domainKeyword);
        }
        if (this.andkey.length) {
          this.andkey.forEach(function(key) {
            // console.log("keyyyy", k, key, key.length);
            if (
              key.length == 2 &&
              full_text.includes(key[0]) &&
              full_text.includes(key[1])
            ) {
              // console.log("เข้าสอง");
              // console.log("full_text", full_text, key, word.concat(key));
              word.push(...key);
            }

            if (
              key.length == 3 &&
              full_text.includes(key[0]) &&
              full_text.includes(key[1]) &&
              full_text.includes(key[2])
            ) {
              word.push(...key);
            }
            if (
              key.length == 4 &&
              full_text.includes(key[0]) &&
              full_text.includes(key[1]) &&
              full_text.includes(key[2]) &&
              full_text.includes(key[3])
            ) {
              word.push(...key);
            }
          });

          //  console.log("key+addkey", word);
        }
      }
      return word;
    },
    getTheSelected(k, v, uid) {
      console.log(
        "this.getPostAllMonitor.sentiment",
        this.getPostAllMonitor[k].sentiment
      );
      var err;
      if (v == 1) {
        err = "Positive";
      } else if (v == 0) {
        err = "Neutral";
      } else {
        err = "Negative";
      }
      this.$confirm("คุณต้องการเปลี่ยน Sentiment เป็น " + err + " ?").then(
        () => {
          const encoded = encodeURI(uid);
          var _this = this;
          var config = {
            method: "get",
            url:
              "https://api2.cognizata.com/api/v2/userposts/change_sentiment_word?uid=" +
              encoded +
              "&sentiment=" +
              v,
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          };
          this.axios(config)
            .then(function(response) {
              console.log(response);
              if (_this.selected == "") {
                if (v == 1) {
                  _this.getPostAllMonitor[k].sentiment = 1;
                  _this.getPostAllMonitor[k].user_sentiment[_this.objId] = 1;
                } else if (v == 0) {
                  _this.getPostAllMonitor[k].sentiment = 0;
                  _this.getPostAllMonitor[k].user_sentiment[_this.objId] = 0;
                } else {
                  _this.getPostAllMonitor[k].sentiment = -1;
                  _this.getPostAllMonitor[k].user_sentiment[_this.objId] = -1;
                }
              } else {
                if (v == _this.selected) {
                  _this.getPostAllMonitor[k].sentiment = v;
                  _this.getPostAllMonitor[k].user_sentiment[_this.objId] = v;
                } else {
                  _this.getPostAllMonitor.splice(k, 1);
                }
              }
            })
            .catch(function(response) {
              console.log("errrrrrr", response.message);
            });
          // if (v != this.getPostAllMonitor[k].sentiment) {
          //   this.$store.dispatch("editSentimentPost", {
          //     sentiment: v,
          //     uid: encoded,
          //   });
          //   if (this.selected == "") {
          //     if (v == 1) {
          //       this.getPostAllMonitor[k].sentiment = 1;
          //     } else if (v == 0) {
          //       this.getPostAllMonitor[k].sentiment = 0;
          //     } else {
          //       this.getPostAllMonitor[k].sentiment = -1;
          //     }
          //   } else {
          //     this.getPostAllMonitor.splice(k, 1);
          //   }
          //   this.$fire({
          //     title: "แก้ไขสำเร็จ",
          //     type: "success",
          //     showConfirmButton: false,
          //     timer: 1000,
          //   });
          // } else {
          //   this.$alert("Sentiment เป็น " + err + " แล้ว!").then(() => {});
          // }
        }
      );
    },
    setAltImg(event) {
      event.target.src = this.default_avatar;
    },
    onClick(i, data) {
      // console.log(data);
      this.index = i;
      this.dataPhoto = data;
    },
    async infiniteScroll(acc, sort, offset, sentiment) {
      acc = this.getProfileData;
      sort = this.selectedSort;
      offset = this.page;
      sentiment = this.selected;
      if (this.getHashtagData) {
        var hashtag = this.getHashtagData.replace("#", "");
      }

      var payload;
      var rt;
      console.log("this.getValSource", this.getValSource);
      if (this.getValSource == "twitter") {
        rt = true;
      } else {
        rt = "";
      }
      if (this.api == "profile") {
        // Profile
        if (this.tabs == "domainTab") {
          // have not sentiment
          if (sentiment != "") {
            payload = {
              account: acc,
              sort_by: sort,
              offset: offset,
              domain: this.dh,
              sentiment: sentiment,
              retweet: rt,
              start_date: this.getSDateProfile,
              end_date: this.getEDateProfile,
              source: this.getValSource,
            };
          } else {
            //  have  sentiment
            payload = {
              account: acc,
              sort_by: sort,
              offset: offset,
              domain: this.dh,
              retweet: rt,
              start_date: this.getSDateProfile,
              end_date: this.getEDateProfile,
              source: this.getValSource,
            };
          }
        } else if (this.tabs == "hashtagTab") {
          if (sentiment != "") {
            payload = {
              account: acc,
              sort_by: sort,
              offset: offset,
              hashtag: this.dh,
              sentiment: sentiment,
              retweet: rt,
              start_date: this.getSDateProfile,
              end_date: this.getEDateProfile,
              source: this.getValSource,
            };
          } else {
            payload = {
              account: acc,
              sort_by: sort,
              offset: offset,
              hashtag: this.dh,
              retweet: rt,
              start_date: this.getSDateProfile,
              end_date: this.getEDateProfile,
              source: this.getValSource,
            };
          }
          //All post
        } else {
          if (sentiment != "") {
            //  have  sentiment
            payload = {
              account: acc,
              sort_by: sort,
              offset: offset,
              sentiment: sentiment,
              start_date: this.getSDateProfile,
              end_date: this.getEDateProfile,
              source: this.getValSource,
            };
          } else {
            //  have not sentiment
            payload = {
              account: acc,
              sort_by: sort,
              offset: offset,
              start_date: this.getSDateProfile,
              end_date: this.getEDateProfile,
              source: this.getValSource,
            };
          }
        }
      } else if (this.api == "hashtag") {
        // Hahtag
        if (this.tabs == "domainTab") {
          if (sentiment != "") {
            console.log("sentiment", sentiment);
            //  have  sentiment
            payload = {
              hashtag: hashtag,
              sort_by: sort,
              offset: offset,
              sentiment: sentiment,
              domain: this.dh,
              start_date: this.getSDateHt,
              end_date: this.getEDateHt,
              source: this.getValSource,
            };
          } else {
            payload = {
              hashtag: hashtag,
              sort_by: sort,
              offset: offset,
              domain: this.dh,
              start_date: this.getSDateHt,
              end_date: this.getEDateHt,
              source: this.getValSource,
            };
            console.log("onsentiment", sentiment);
          }
        } else {
          if (sentiment != "") {
            payload = {
              hashtag: hashtag,
              sort_by: sort,
              offset: offset,
              sentiment: sentiment,
              start_date: this.getSDateHt,
              end_date: this.getEDateHt,
              source: this.getValSource,
            };
          } else {
            //  have  sentiment
            payload = {
              hashtag: hashtag,
              sort_by: sort,
              offset: offset,
              start_date: this.getSDateHt,
              end_date: this.getEDateHt,
              source: this.getValSource,
            };
          }
        }
      } else {
        //Domian Menu
        if (this.pageMenu == "domain") {
          let sc, domains, dash;

          console.log("keyword1", this.domainKeyword, this.getClickDomain);
          if (this.menu == "platform") {
            sc = this.getSocialPlatform;
            domains = this.getDomainArr;
            dash = this.crawdash;
          } else {
            sc = this.getSocialDomain;
            domains = this.getClickDomain;
            dash = "";
          }
          //console.log("domain");
          if (this.getSdateDm) {
            this.sdate = this.getSdateDm;
            this.edate = this.getEdateDm;
          } else {
            this.sdate =
              moment(new Date())
                .format()
                .slice(0, 10) + "T00:00:00";
            this.edate =
              moment(new Date())
                .format()
                .slice(0, 10) + "T23:59:59";
          }

          if (sentiment === "") {
            payload = {
              start_date: this.sdate,
              end_date: this.edate,
              source: sc,
              sort_by: sort,
              domain: domains,
              offset: offset,
              dashboard: dash,
            };
          } else {
            //  have  sentiment
            payload = {
              start_date: this.sdate,
              end_date: this.edate,
              source: sc,
              sentiment: sentiment,
              sort_by: sort,
              domain: domains,
              offset: offset,
              dashboard: dash,
            };
          }
          if ( this.domainKeyword) {
              // console.log("keyword2",  this.domainKeyword);
              payload.querySearch =  this.domainKeyword;
            }
        } else {
          if (this.statusLocat == true) {
            // let sdateLocat =this.dateLocat[0].slice(0, 16);
            // let edateLocat =this.dateLocat[1].slice(0, 16);
            this.statusLocat == false;
            if (sentiment === "") {
              payload = {
                account: this.users,
                sort_by: sort,
                offset: offset,
                query: this.changwats + "," + this.amphoes,
                // start_date:sdateLocat,
                // end_date:edateLocat
              };
              if (this.amphoes.length) {
                console.log("this.amphoes", this.amphoes);
                payload.query = this.amphoes;
              }
            } else {
              //  have  sentiment
              payload = {
                account: this.users,
                sort_by: sort,
                offset: offset,
                sentiment: sentiment,
                query: this.changwats,
                // start_date:sdateLocat,
                // end_date:edateLocat
              };
              if (this.amphoes.length) {
                console.log("this.amphoes", this.amphoes);
                payload.query = this.amphoes;
              }
            }
          }
        }
      }

      //  Global Fetch data
      var checkApi;
      if (this.api == "location") {
        if (this.pageMenu == "domain") {
          checkApi = "fetchAllPostDomain";
        } else {
          checkApi = "fetchLocation";
        }
      } else {
        checkApi = "fetchPostAll";
      }
      let temp = await this.$store.dispatch(checkApi, payload);
      if (temp && temp.length === 0) {
        this.isInfinite = false;
      }
      this.page += 10;
      this.infiniteId += 1;
      console.log(this.page);
    },
    selectSort() {
      this.page = 0;
      this.isInfinite = true;
      this.infiniteScroll();
    },
    selectSentiment() {
      this.page = 0;
      this.isInfinite = true;
      this.infiniteScroll();
    },
  },
  mounted() {
    console.log("getClickDomain", this.getClickDomain);
    this.$emitter.on("domainKeyword2", async (val) => {
      if (this.getClickDomain) {
        this.page = 0;
        this.isInfinite = true;

        if (val) {
          this.domainKeyword = val;
          await this.infiniteScroll();
          console.log("emitter", val);
        } else {
          this.domainKeyword = val;
          await this.infiniteScroll();
        }
      }
    });
  },
  async created() {
    this.objId = localStorage.getItem("objId");
    // this.$store.dispatch("fetchListIssue");
    // this.$emitter.on("crawdash", async (val) => {
    //   this.crawdash = val;
    //   this.page = 0;
    //   await this.infiniteScroll();
    //   console.log("emitter", val);
    // });

    console.log("page", this.$route);
    if (this.$route.name === "Domain") {
      this.pageCheck = this.$route.name;
      await this.axios
        .get(
          "https://api2.cognizata.com/api/v2/object/check_sentiment_word?domain=" +
            this.getClickDomain
        )
        .then((response) => (this.arrword = response.data[0]));

      var k = this.arrword.Keywords;
      var ka = this.arrword.and_keywords;
      let result = ka.map((key) => {
        return key.split("+");
      });
      this.andkey = result;
      this.heightword = k;
    }

    // if (this.$route.name === "Platform") {
    //   this.pageCheck = this.$route.name;
    //   const arrdomain = localStorage.getItem('domainArr');
    //   this.axios
    //     .get(
    //       "https://api2.cognizata.com/api/v2/object/check_sentiment_word?domain=" +
    //        arrdomain
    //     )
    //     .then((response) => (this.heightword = response.data[0].Keywords));
    // }

    this.$store.commit("setSdateDm", null);
    this.$store.commit("setEdateDm", null);
    await this.infiniteScroll();
  },
  destroyed() {
    this.$store.commit("setPostAllMonitor", "");
  },
};
</script>

<style scoped>
.box-hl {
  border-radius: 10px;
}

.highlight2 {
  background-color: #f7dca2;
  padding: 0 2px;
}
#btn-neg,
#btn-nue,
#btn-pos {
  color: #636465;
  background-color: #ddd;
  border-color: #ddd;
}
.box-retweet {
  color: rgb(91, 112, 131);
  margin-left: 5px;
}
.fa-camera {
  margin-left: 5px;
  text-decoration: none;
  padding: 6px 7px;
  border-radius: 20px;
  background: #ccc;
  color: #696d71;
  font-size: 22px;
  vertical-align: bottom;
}
.fa-camera:hover {
  background: #696d71;
  color: #ccc;
  cursor: pointer;
}
#emoji {
  width: 20px;
}
#txt-cmt {
  padding: 8px 2px !important;
}
#profile-page {
  padding: 0px !important;
}
#picmore {
  background: #000000c7;
  color: white;
  padding: 5px 20px;
  font-size: 20px;
  margin: -44px;
  z-index: 1;
  position: relative;
  /* width: 68px; */
  float: right;
  cursor: pointer;
}
.col2 {
  column-count: 2;
  width: 504px;
  margin: auto;
}
.img-grid {
  width: 100%;
  height: 350px;
  object-fit: cover;
}
.images1 {
  width: 504px;
  height: 283.5px;
  object-fit: cover;
  background-size: contain;
  cursor: pointer;
  margin: 2px;
  border-radius: 16px;
  border: 1px solid #eaeff3;
}
.images2 {
  width: 253.5px;
  height: 283.5px;
  object-fit: cover;
  background-size: contain;
  cursor: pointer;
  margin: 2px;
  border-radius: 16px;
  border: 1px solid #eaeff3;
}
.images3 {
  width: 253.5px;
  height: 283.5px;
  object-fit: cover;
  background-size: contain;
  cursor: pointer;
  margin: 2px;
  border-radius: 16px;
  border: 1px solid #eaeff3;
}
.images3:nth-child(2) {
  height: 141.5px;
  position: absolute;
}
.images3:nth-child(3) {
  height: 141.5px;
  bottom: 23px;
  position: relative;
  bottom: -72px;
}
.images4 {
  width: 253.5px;
  height: 142px;
  object-fit: cover;
  background-size: contain;
  cursor: pointer;
  margin: 2px;
  border-radius: 16px;
  border: 1px solid #eaeff3;
}

#box-reaction {
  background: #ddddddad;
  color: #2c3e50;
  border-radius: 7px;
  padding-right: 5px;
  padding-left: 5px;
  padding-top: 3px;
  padding-bottom: 3px;
  margin-left: 4px;
}
.imgp {
  z-index: 2;
  position: relative;
  width: 45px;
  height: 45px;
}
.user-img {
  border-radius: 50%;
  position: relative;
  top: 0px;
  width: 45px;
  height: 45px;
}

.img-size {
  width: 30px;
}

#profile-page {
  padding: 10px;
}
#statuspost {
  text-align: end;
}
.select-sort {
  width: 80%;
}
.tab-content > .active {
  display: block;
  height: 80vh !important;
  overflow: auto !important;
}
a {
  color: #2c3e50;
  text-decoration: none;
  background-color: transparent;
}
.card-body {
  min-height: 7rem;
}
#tab-cards {
  border: none !important;
}
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: white;
}

/* Handle */
::-webkit-scrollbar-thumb {
  padding-right: 2px;
  background: #f1f1f1;
}
#content > div > div > div.col-lg-9 {
  overflow: auto;
}

#box-content {
  width: -webkit-fill-available;
  background-color: #ede7dd00;
  /* border-radius: 20px; */
  /* padding-top: 10px; */
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%);
  /* border: 1px solid #ede7dd !important; */
  /* border-bottom: 3px solid #4c412b; */
}
#inf {
  text-align: left;
  display: block;
  margin: auto;
  width: fit-content;
  margin-bottom: 30px;
}
#title-inf {
  color: #4e432d;
  /* background: #ede7dd; */
  padding: 15px;
  width: 80%;
  margin: auto;
  border-radius: 15px;
  margin-bottom: 0px;
}
#txt-inf {
  width: 26px;
  display: inline-block;
  background: #4e432d;
  text-align: center;
  margin-bottom: 5px;
  margin-right: 12px;
  border-radius: 50%;
  color: white;
}
#txt-act {
  background: #ede7dd;
  color: #6c757d;
  padding: 3px 10px;
  border-radius: 10px;
}
.fa-link {
  color: #4c412b;
}
.fa-link:hover {
  color: #fed16e;
  text-decoration: none;
}
#txt-cmt {
  text-align: justify;
  padding: 10px 20px;
}
#id-k {
  margin: auto;
  display: block;
  text-align: end;
  color: #c5baba;
}
#txt-name {
  vertical-align: super;
}
#img-inf {
  border-radius: 50%;
  position: relative;
  top: 3px;
  height: 46px;
}
.social-img {
  width: 35px;
  /* margin-top: -5px; */
  margin-left: -8px;
}
#space {
  margin-left: 10px;
}
@media only screen and (min-width: 0px) and (max-width: 760px) {
  .box-hl {
    font-size: 16px;
    font-weight: 600;
  }
  #picmore {
    margin: -42px;
    margin-right: -1px;
  }
  .col2 {
    column-count: 2;
    width: 92%;
    margin: auto;
    column-gap: 4px;
  }
  .images4 {
    width: 100%;
  }
  .images3 {
    width: 46%;
  }
  .images2 {
    width: 46%;
  }
  .images1 {
    width: 92%;
    height: 283.5px;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .select-sort {
    width: 100% !important;
  }
  .col {
    padding: 0px !important;
  }
  .b-avatar {
    width: 38px !important;
    height: 38px !important;
  }
  .social-img {
    width: 31px;
    /* margin-top: -5px; */
    margin-left: -8px;
  }
  .user-img {
    width: 38px;
    height: 38px;
  }
  #cmt-time {
    float: none;
    display: block;
    color: #7b7d7f;
    font-size: small;
  }
  .card-text {
    font-size: 4vw;
  }
  .card-body {
    min-height: 8rem;
  }
  .card-text {
    padding: 0px 0px;
  }
  #img-inf {
    font-size: 38px;
    border-radius: 50%;
    position: relative;
    top: 3px;
    height: 38px;
  }
}
</style>
