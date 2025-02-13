<template>
  <div>
    <SocialSelect :tabsocial="'feed'" />
    <!-- {{ select_domain }}{{ select_subdomain }} -->
    <b-row>
      <b-col sm>
        <v-select
          class="mb-3"
          :options="getDomain"
          v-model="select_domain"
          @input="subdomain"
          id="input-domain"
          placeholder="เลือก Domain"
        >
        </v-select>
      </b-col>
      <b-col sm>
        <!-- multi-select -->
        <v-select
          multiple
          :options="getShowSubDomainRanking"
          v-model="select_subdomain"
          id="input-subdomain"
          class="subdomain"
          :disabled="isDisabled"
          placeholder="เลือก SubDomain"
        ></v-select>
      </b-col>
      <b-col cols="auto" class="mt-2 mt-lg-0 mt-md-0">
        <b-button
          @click="submitform"
          id="btn-submit"
          variant=""
          :disabled="isDisabled"
          class="text-sm-right"
        >
          submit
        </b-button>
      </b-col>
    </b-row>
    <b-form-group label="" v-slot="{ ariaDescribedby }">
      <b-row class="mt-2">
        <b-col sm="12" md="6">
          <b-form-radio-group
            v-model="selected"
            :options="options"
            :aria-describedby="ariaDescribedby"
            name="radio-inline"
            class="mt-1 mb-2 text-left ml-2 mi"
            @change="selectSentiment"
          ></b-form-radio-group>
        </b-col>
        <b-col sm="12" md="6" class="text-right">
          <!-- <div class="mt-3">
            Selected: <strong>{{ status }}</strong>
          </div> -->
          <b-form-select
            v-model="selectedSort"
            :options="optionSort"
            size="sm"
            class="mb-2 select-sort"
            @change="selectSort"
          ></b-form-select>
        </b-col>
        <div class="w-100 text-right d-inline">
          <span class="text-right pr-3 d-inline">
            <b-form-checkbox id="checkbox-1" v-model="status" name="checkbox-1">
              อ่านแล้ว
            </b-form-checkbox>
          </span>
          <!-- Highlight -->
          <b-form-checkbox
            switch
            size="md"
            class="text-right mb-2 d-inline mr-3"
            v-model="checked"
          >
            <span :style="myStyle" v-if="checked" class="box-hl pl-2 pr-2"
              >Highlight</span
            >
            <span v-else class="box-hl pl-2 pr-2">Highlight</span>
          </b-form-checkbox>
        </div>
      </b-row>
    </b-form-group>
    <!-- <div v-for="(item, i) in list" :key="i" class="box-post">{{ item }} </div> -->
    <div class="box-post container">
      <b-card
        class="mb-4"
        style="border: none"
        id="box-content"
        footer-tag="footer"
        header-tag="header"
        v-for="(profilePost, k) in list"
        :key="profilePost.url_post"
      >
        <vue-element-loading
          :active="getLoadFeed"
          size="80"
          background-color="rgba(255, 255, 255, 0.4)"
          color="#b6ac9a"
        />
        <template #header v-if="profilePost">
          <b-row>
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
                <span v-else> <b-avatar size="45px"></b-avatar></span>
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
                <img
                  v-if="profilePost.source == 'threads'"
                  src="@/assets/Threads.png"
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
                  v-if="
                    profilePost.url_post &&
                      profilePost.url_post.includes('mbasic')
                  "
                  v-bind:href="profilePost.url_post.replace('mbasic.', '')"
                  class="fa fa-external-link"
                  target="_blank"
                ></a>
                <a
                  v-else
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
            <!-- <div>
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
              </div>
            </div> -->
            <b-card-text class="box-contents">
              <Highlighter
                class="my-highlight md-font"
                :style="{
                  textAlign: 'left',
                  fontSize: '17px',
                  padding: '10px',
                }"
                highlightClassName="highlight4"
                :searchWords="highlightText(profilePost.full_text)"
                :autoEscape="true"
                :textToHighlight="
                  profilePost.read
                    ? profilePost.full_text.slice(0, 450)
                    : profilePost.full_text
                "
              ></Highlighter>

              <div
                v-if="profilePost.full_text.length > 450"
                @click="profilePost.read = !profilePost.read"
                id="readmore"
              >
                <span v-if="profilePost.read == true">... อ่านต่อ</span
                ><span v-else>ย่อบทความ</span>
              </div>
              <!-- </read-more> -->
            </b-card-text>
          </b-col>
          <b-col>
            <div v-if="profilePost.source == 'tiktok' && profilePost.uid">
              <a v-bind:href="profilePost.url_post" target="_blank">
                <lite-tiktok
                  :videoid="profilePost.uid"
                  style=" pointer-events: none; "
                ></lite-tiktok
              ></a>

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
              <div v-if="typeof profilePost.photos == 'string'">
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
        <div
          class="text-left ai-box mt-2"
          v-if="profilePost && profilePost.ocr && username == 'adminatapy'"
          style="font-size: 15px;font-weight: 500;"
        >
          <div v-for="(text, idx) in profilePost.ocr">
            <!-- {{ postDomain.ocr.face[].person_name /postDomain.ocr.face[].confidence >) }} -->
            <div v-if="text.text_sort && text.text_sort.length">
              <b-avatar
                size="18px"
                style="font-size: 12px;background-color:#8b8787;"
                class="mr-1"
                >{{ idx + 1 }}
              </b-avatar>
              <b-icon icon="textarea-t" scale="1.3"></b-icon> OCR :
              {{ text.text_sort[0] }}
            </div>
            <div v-if="text.face">
              <span v-for="(face, idx) in text.face">
                <span v-if="face.confidence > 0.8" class="mr-2 mt-1">
                  <span
                    style="background: #e5e5e5;
    padding: 0px 6px;
    border-radius: 13px;"
                  >
                    <b-icon icon="person-bounding-box" scale="1"></b-icon>
                    {{ face.person_name.replace("_", " ") }}
                    <span
                      v-b-tooltip.hover
                      :title="'ค่า confidence'"
                      class="small"
                      >({{
                        parseFloat((face.confidence * 100).toFixed(2))
                      }}%)</span
                    ></span
                  ></span
                >
              </span>
            </div>
          </div>
        </div>
        <div
          v-if="
            profilePost &&
              profilePost.location &&
              profilePost.location.length &&
              username == 'adminatapy'
          "
          class="text-left ai-box mt-3 text-small "
          style="font-size: 13px;font-weight: 500; color: #2c3e50;"
        >
          <i
            class="fa fa-map-marker mr-1"
            aria-hidden="true"
            style="font-size: 15px;"
          ></i>
          <span
            v-for="(geo, k) in filterNumbers(profilePost.location)"
            :key="k"
            class="mr-1"
            style="border: 1px solid #2c3e505e  ;padding: 0px 5px;display: inline-flex;text-align: center;
    border-radius: 33px;
"
          >
            <!-- {{ geo.toString() }} -->
            <span v-if="geo.toString() && geo.toString().length == 2">
              {{ matchGeocode(geo).name_th }}
            </span>
            <span v-if="geo.toString() && geo.toString().length == 4">
              {{ matchGeocode(geo.toString().substring(0, 2)).name_th }}
              {{
                geo.toString().substring(0, 2) == "10"
                  ? " ข." + matchGeocode(geo).name_th
                  : " อ." + matchGeocode(geo).name_th
              }}
            </span>
            <span v-if="geo.toString() && geo.toString().length == 6">
              {{ matchGeocode(geo.toString().substring(0, 2)).name_th }}
              {{
                geo.toString().substring(0, 2) == "10"
                  ? " ข." + matchGeocode(geo).name_th
                  : " อ." + matchGeocode(geo).name_th
              }}
              {{
                geo.toString().substring(0, 2) == "10"
                  ? "แขวง" + matchGeocode(geo).name_th
                  : "ต." + matchGeocode(geo).name_th
              }}
            </span>
          </span>
        </div>
        <div
          class="text-left ai-box mt-2"
          v-if="
            profilePost && profilePost.face_detect && username == 'adminatapy'
          "
          style="font-size: 15px;font-weight: 500;"
        >
          <div v-if="profilePost.face_detect && profilePost.person_name.length">
            <span v-for="(face, idx) in profilePost.person_name">
              <span class="mr-2 mt-1" v-if="face">
                <span
                  style="background: #e5e5e5;
    padding: 0px 6px;
    border-radius: 13px;"
                >
                  <b-icon icon="person-bounding-box" scale="1"></b-icon>
                  {{ face }}
                </span></span
              >
            </span>
          </div>
        </div>
        <template #footer>
          <div class="text-left">
            <!------------- engages-------------- -->
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
              :aria-expanded="visible ? 'true' : 'false'"
              style="cursor: pointer"
              id="box-reaction"
              v-b-tooltip.hover
              title="Comments"
            >
              <i class="fas fa-comment"> </i>
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

            <!-- twitter -->
            <span
              v-if="
                profilePost.source !== 'facebook' &&
                  profilePost.source !== 'youtube'
              "
            >
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
              <span
                v-if="
                  profilePost.shares_count !== '0' && profilePost.shares_count
                "
                id="box-reaction"
                v-b-tooltip.hover
                title="Share"
              >
                <i class="fa fa-share"></i>
                {{ profilePost.shares_count | numFormat }}
              </span>
              <span
                v-if="
                  profilePost.views_count !== '0' && profilePost.views_count
                "
                id="box-reaction"
                v-b-tooltip.hover
                title="View"
              >
                <i class="fas fa-eye"></i>
                {{ profilePost.views_count | numFormat }}
              </span>
            </span>
            <!-- share blockdit -->
            <span
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
            </span>
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
            <!-- read me -->
            <span class="float-right">
              <PopupReport
                v-if="
                  objId == '62a6f013526cf841a30e3078' ||
                    objId == '60a4a73eca07b83ecad0e71c' ||
                    objId == '60a4a746ca07b83ecad0e71d' ||
                    objId == '60a4a74cca07b83ecad0e71e' ||
                    objId == '60a4a752ca07b83ecad0e71f' ||
                    objId == '60a4a758ca07b83ecad0e720' ||
                    objId == '64a2727f6bce4a4d32d67116' ||
                    objId == '64a273076bce4a4d32d67120' ||
                    objId == '64a273d46bce4a4d32d67128' ||
                    objId == '64a273ff6bce4a4d32d6712e' ||
                    objId == '64a2743f6bce4a4d32d67134' ||
                    objId == '66346cb971596a3509b36292' ||
                    objId == '66346d6071596a3509b36293' ||
                    objId == '66346d7771596a3509b36294' ||
                    objId == '6673e8240c150aaaef7681a8' ||
                    objId == '66346e33a388ecdd884d647b' ||
                    objId == '66346e68a388ecdd884d6490' ||
                    objId == '66346ea7a388ecdd884d64a0'
                "
                :datareport="[
                  k,
                  profilePost.sentiment,
                  profilePost.uid,
                  'open',
                ]"
                :uidpost="profilePost.uid"
              />
              <!-- <PopupReport
                :datareport="[
                  k,
                  profilePost.sentiment,
                  profilePost.uid,
                  'open',
                ]"
                :uidpost="profilePost.uid"
                data-toggle="tooltip"
                data-html="true"
                v-b-tooltip.hover.top.html
                :title="getHoverTextReport"
              /> -->
              <span v-if="profilePost.user_sentiment">
                <span
                  id="box-read"
                  v-if="
                    profilePost.user_sentiment[objId] == 0 ||
                      profilePost.user_sentiment[objId]
                  "
                >
                  <i class="fa-solid fa-book-open"></i> อ่านแล้ว</span
                >
                <span
                  v-else
                  class="box-noread"
                  data-toggle="tooltip"
                  data-html="true"
                  variant="light"
                  v-b-tooltip.hover.top.html
                  :title="getHoverText"
                  @click="
                    getTheSelected(
                      k,
                      profilePost.sentiment,
                      profilePost.uid,
                      'open'
                    )
                  "
                >
                  <i class="fa-solid fa-book"></i> ยังไม่อ่าน</span
                >
              </span>
              <span
                v-else
                class="box-noread"
                data-html="true"
                variant="light"
                v-b-tooltip.hover.top.html
                :title="getHoverText"
                @click="
                  getTheSelected(
                    k,
                    profilePost.sentiment,
                    profilePost.uid,
                    'open'
                  )
                "
                ><i class="fa-solid fa-book"></i> ยังไม่อ่าน</span
              >
            </span>
          </div>
          <!-- comment content -->
          <b-collapse
            :id="'btn' + page + k"
            class="mt-2"
            v-if="profilePost.comments && profilePost.comments.length"
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
                        :href="'https://www.youtube.com/' + cmt.author_link"
                        target="_blank"
                        v-if="profilePost.source == 'youtube'"
                      >
                        <img :src="cmt.photo" id="img-cmt"
                      /></a>
                      <a :href="cmt.url" target="_blank" v-else>
                        <img :src="cmt.photo" id="img-cmt" v-bind:href="cmt.url"
                      /></a>

                      <!-- <img v-if="profilePost.source=='news'" :src="cmt.comments.pictureUrl" id="img-cmt"> -->
                      <span> </span>
                    </b-col>
                    <b-col lg="11">
                      <div>
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
                        <a :href="cmt.url" target="_blank" v-else>
                          <span class="bold"> {{ cmt.username }}</span></a
                        >
                        <span
                          v-if="profilePost.source == 'youtube' && cmt.time"
                          class="font-weight-light"
                          id="cmt-time"
                          >{{ cmt.time.split("T")[0] }} |
                          {{ cmt.time.split("T")[1] }}</span
                        >
                        <span v-else class="font-weight-light" id="cmt-time">{{
                          cmt.time
                        }}</span>
                      </div>

                      <div
                        v-if="profilePost.source == 'youtube'"
                        class="font-weight-light"
                      >
                        {{ cmt.text }}
                      </div>
                      <div v-else class="font-weight-light">
                        {{ cmt.content }}
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
      <div v-if="list.length == 0 && isInfinite == false">
        <b-card class="font-weight-normal">
          <br />
          ไม่พบข้อมูล
        </b-card>
      </div>
      <infinite-loading
        v-if="isInfinite"
        spinner="spiral"
        :identifier="infiniteId"
        @infinite="infiniteScroll"
      ></infinite-loading>
      <!-- <infinite-loading @infinite="infiniteHandler"></infinite-loading> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import "vue-select/dist/vue-select.css";
import Highlighter from "vue-highlight-words";
import VueGallerySlideshow from "vue-gallery-slideshow";
import SocialSelect from "@/components/domain/SocialSelect.vue";
import PopupReport from "@/components/feed/PopupReport.vue";
import "@justinribeiro/lite-tiktok";
import provinces from "@/components/map/provinces.json";
import districts from "@/components/map/districts.json";
import subdistricts from "@/components/map/subdistricts.json";
// import moment from "moment";
export default {
  components: {
    VueGallerySlideshow,
    SocialSelect,
    Highlighter,
    PopupReport,
  },
  watch: {
    getDataReportLine() {
      this.getTheSelected(
        this.getDataReportLine[0],
        this.getDataReportLine[1],
        this.getDataReportLine[2],
        this.getDataReportLine[3]
      );
    },
    getHashtagFeed() {
      console.log(
        "HashtagFeed--------------------------------------",
        this.getHashtagFeed
      );
      this.page = 0;
      this.isInfinite = true;
      this.infiniteScroll();
    },
    async status() {
      console.log("Status-----------------------------------------");
      this.page = 0;
      this.isInfinite = true;
      await this.infiniteScroll();
      console.log("status----end-----");
    },
    getStatusFeed() {
      console.log("getStatusFeed");
      this.page = 0;
      this.isInfinite = true;
      this.infiniteScroll();
    },
    getArrFeed() {
      console.log("getArrFeed");
      this.page = 0;
      this.isInfinite = true;
      this.infiniteScroll();
    },
    getSocialFeed() {
      console.log("getSocialFeed");
      this.page = 0;
      this.isInfinite = true;
      this.infiniteScroll();
    },
  },
  computed: {
    ...mapGetters([
      "getSocialFeed",
      "getLoadFeed",
      "getSdateFeed",
      "getEdateFeed",
      "getArrFeed",
      "getStatusFeed",
      "getDomainRanking",
      "getShowSubDomainRanking",
      "getDataReportLine",
      "getHashtagFeed",
    ]),
    getDomain() {
      let arr = ["All", "All Domain"];
      let arr2 = localStorage.getItem("domainArr");
      arr2 = arr2.split(",");
      return arr.concat(arr2);
    },
    isDisabled() {
      var select_dm = this.select_domain;
      return !select_dm;
    },
    getHoverText() {
      let result = "คลิกเพื่อทำสัญลักษณ์ <b>เปิดอ่าน</b>";

      return result;
    },
    getHoverTextReport() {
      let result = "คลิกเพื่อส่ง <b>Line Notify</b>";

      return result;
    },
  },
  data() {
    return {
      arrword: [],
      myStyle: {
        backgroundColor: "#f7dca2",
      },
      checked: true,
      andkey: [],
      heightword: [],
      arrDomain: "",
      select_domain: "",
      select_subdomain: "",
      showRead: "",
      objId: "",
      status: false,
      infiniteId: +new Date(),
      isInfinite: true,
      noData: false,
      page: 0,
      list: [],
      username: "",
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
      selected: "",
      selectedSort: "",
      dataPost: [],
      sdate: "",
      edate: "",
      default_avatar: "user.svg",
      visible: false,
      index: null,
      dataPhoto: [],
      text: "",
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

  methods: {
    filterNumbers(numbers) {
      // Create a copy of the numbers array and sort by length
      const filtered = [...numbers].sort(
        (a, b) => a.toString().length - b.toString().length
      );

      for (let i = 0; i < filtered.length; i++) {
        for (let j = i + 1; j < filtered.length; j++) {
          const num1 = filtered[i].toString();
          const num2 = filtered[j].toString();

          // If num1 matches the start of num2, remove num1
          if (num2.startsWith(num1)) {
            filtered.splice(i, 1); // Remove num1
            i--; // Adjust index after removal
            break; // Restart the inner loop
          }
        }
      }

      return filtered; // Return filtered array
    },
    matchGeocode(geocode) {
      const geocodeStr = geocode.toString(); // แปลง geocode เป็น string
      let found = null;

      // กรองข้อมูลตามความยาว geocode
      if (geocodeStr.length === 2) {
        found = provinces[geocodeStr];
      } else if (geocodeStr.length === 4) {
        found = districts[geocodeStr];
      } else if (geocodeStr.length === 6) {
        found = subdistricts[geocodeStr];
      }

      // Return the found location or a fallback message
      return found || { geocode: geocodeStr, message: "ไม่พบข้อมูล" };
    },
    highlightText(full_text) {
      var word = [];
      if (this.checked) {
        word.push(...this.heightword);
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
    submitform() {
      this.page = 0;
      this.isInfinite = true;
      this.infiniteScroll();
    },
    subdomain() {
      this.select_subdomain = "";
      if (this.select_domain == "All") {
        this.select_subdomain = "All";
        this.$store.commit("setSubDomainRanking", []);
      } else if (this.select_domain == "All Domain") {
        this.select_subdomain = "All SubDomain";
        this.$store.commit("setSubDomainRanking", []);
      } else {
        this.$store.dispatch("fetchSubDomainRanking", {
          domain: this.select_domain,
        });
      }
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
    getTheSelected(k, v, uid, read) {
      console.log("this.list.sentiment", this.list[k].sentiment);
      console.log("k", k);
      var err;
      if (v == 1) {
        err = "Positive";
      } else if (v == 0) {
        err = "Neutral";
      } else {
        err = "Negative";
      }
      let msg;
      if (read == "open") {
        msg = "คุณต้องการทำสัญลักษณ์เปิดอ่านโพสต์ ?";
      } else {
        msg = "คุณต้องการเปลี่ยน Sentiment เป็น " + err + " ?";
      }
      this.$confirm(msg).then(() => {
        console.log("sen", v);
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
            if (_this.status == true) {
              if (_this.selected == "") {
                console.log("เข้าาาาาาาาา");
                let objIndex = _this.list.findIndex(
                  (obj) => obj.uid == _this.list[k].uid
                );
                // console.log("objIndex", _this.list[objIndex]);
                _this.list[objIndex]["user_sentiment"] =
                  response.data.user_sentiment;

                //   _this.list[k].user_sentiment[_this.objId] = v;
                console.log("Object", _this.list);
                _this.infiniteScroll();
              } else {
                if (v == _this.selected) {
                  console.log("เข้าาาาาาาาา2");
                  let objIndex = _this.list.findIndex(
                    (obj) => obj.uid == _this.list[k].uid
                  );
                  _this.list[objIndex]["user_sentiment"] =
                    response.data.user_sentiment;
                  _this.infiniteScroll();
                } else {
                  // console.log('ตัด1');
                  _this.list.splice(k, 1);
                }

                //   _this.list[k].user_sentiment[_this.objId] == v;
                // console.log("Object", _this.list);
              }
            } else {
              //  console.log('ตัด2');
              _this.list.splice(k, 1);
              _this.$fire({
                title: "จัดเก็บในหมวดอ่านแล้ว",
                type: "info",
                showConfirmButton: false,
                timer: 1500,
              });
            }
            // _this.infiniteScroll();
          })
          .catch(function(response) {
            console.log("errrrrrr", response.message);
          });
        // this.list.splice(k, 1);
        console.log("Object2", this.list);
        if (this.selected == "") {
          console.log('this.selected == ""');
          if (v == 1) {
            this.list[k].sentiment = 1;
            this.list[k].user_sentiment[this.objId] = 1;
          } else if (v == 0) {
            this.list[k].sentiment = 0;
            this.list[k].user_sentiment[this.objId] = 0;
          } else {
            this.list[k].sentiment = -1;
            this.list[k].user_sentiment[this.objId] = -1;
          }
          // } else {
          //   console.log('this.selected == ""', this.selected);

          //   if (v == this.selected) {
          //     return;
          //   } else {
          //      console.log('ตัด3');
          //     this.list.splice(k, 1);
          //   }
          //  } else {
          //    if (this.list[k].sentiment ==this.selected) {
          //       return
          //    } else {
          //        this.list.splice(k, 1);
          //    }

          //  }
        }
        this.$fire({
          title: "แก้ไขสำเร็จ",
          type: "success",
          showConfirmButton: false,
          timer: 1000,
        });
        // } else {
        //   this.$alert("Sentiment เป็น " + err + " แล้ว!").then(() => {});
        // }
      });
    },
    setAltImg(event) {
      event.target.src = this.default_avatar;
    },
    onClick(i, data) {
      // console.log(data);
      this.index = i;
      this.dataPhoto = data;
    },
    async infiniteScroll() {
      if (this.page == 0) {
        const arrdomain = localStorage.getItem("domainArr");
        let domain2 = this.select_domain;
        let sub2 = "";
        if (
          this.select_subdomain !== "" &&
          this.select_subdomain.length !== 0
        ) {
          if (
            this.select_domain == "All" ||
            this.select_domain == "All Domain"
          ) {
            sub2 = "";
          } else {
            sub2 = "&subdomain=" + this.select_subdomain;
          }
        }

        if (domain2 == "All" || domain2 == "" || domain2 == "All Domain") {
          // console.log('เข้าDomain',arrdomain);
          domain2 = arrdomain;
        }
        await this.axios
          .get(
            "https://api2.cognizata.com/api/v2/object/check_sentiment_word?domain=" +
              domain2 +
              sub2,
            {
              check_sentiment_word: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
              },
            }
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
      // let today = moment(new Date()).format().slice(0, 10);
      this.sdate = "&start_date=" + this.getSdateFeed;
      this.edate = "&end_date=" + this.getEdateFeed;
      this.$store.commit("setLoadFeed", true);
      let data;
      let stm = "",
        src = "",
        dash = "",
        domain = "",
        hash = "",
        sub = "";
      if (this.getHashtagFeed) {
        hash = "&hashtag=" + this.getHashtagFeed;
      }
      if (this.selected !== "") {
        stm = "&sentiment=" + this.selected;
      }
      if (this.getSocialFeed !== "") {
        src = "&source=" + this.getSocialFeed;
      }
      if (this.getStatusFeed !== "") {
        dash = "&dashboard=" + this.getStatusFeed;
      }
      if (this.select_domain !== "") {
        if (this.select_domain == "All") {
          domain = "";
        } else if (this.select_domain == "All Domain") {
          let arr2 = localStorage.getItem("domainArr");
          // arr2 = arr2.split(",");
          domain = "&domain=" + arr2;
        } else {
          domain = "&domain=" + this.select_domain;
        }
      }
      if (
        this.select_subdomain &&
        this.select_subdomain !== "" &&
        this.select_subdomain.length !== 0
      ) {
        if (this.select_domain == "All" || this.select_domain == "All Domain") {
          sub = "";
        } else {
          sub = "&subdomain=" + this.select_subdomain;
        }
      }
      console.log("pageAPI", this.page);
      var config = {
        method: "get",
        url:
          "https://api.cognizata.com/api/v1/getsentimentdetail/?monitor=true&offset=" +
          this.page +
          stm +
          "&sort_by=" +
          this.selectedSort +
          src +
          this.sdate +
          this.edate +
          dash +
          domain +
          sub +
          hash,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      var _this = this;
      var _page = this.page;
      await this.axios(config).then((response) => {
        _this.$store.commit("setLoadFeed", false);
        _this.$store.commit("setCountPostFeed", response.data.count);
        var post = response.data.data;
        var pair = { read: true };
        var posts = post.map((result) => {
          return { ...result, ...pair };
        });

        data = posts;
        var resObject;

        if (_this.status == true) {
          if (_this.selected == "") {
            resObject = posts;
          } else {
            resObject = posts;
          }
        } else {
          let data2 = posts.filter(function(creature) {
            return creature.user_sentiment == undefined;
          });
          let data = posts.filter(function(creature) {
            return creature.user_sentiment;
          });

          let res2 = data.filter(function(creature) {
            return creature.user_sentiment[_this.objId] == undefined;
          });

          let temp = [];
          //if user change sentiment = temp
          temp.push(...res2, ...data2);
          resObject = temp;
        }

        // console.log("this.page", _page);
        if (_page === 0) {
          _this.list = resObject;
        } else {
          console.log("push");
          _this.list.push(...resObject);
        }
        // console.log("aquaticCreatures", resObject);
        // return _this.list;
      });
      //  console.log("his.list.length", this.list.length ,data);
      if (data.length === 0) {
        this.isInfinite = false;
      }
      this.page += 10;
      //  console.log("loop+10",  this.page);
      this.infiniteId += 1;
    },
  },

  created() {
    this.username = localStorage.getItem("username");
    this.objId = localStorage.getItem("objId");
    this.$store.commit("setHashtagFeed", "");
  },
};
</script>
<style scoped>
.highlight4 {
  background-color: #f7dca2;
  padding: 0 2px;
}
.custom-control {
  display: inline !important;
}
.vs__dropdown-toggle {
  height: 35px !important;
  overflow: hidden !important;
}
#btn-submit {
  background: #f3ab0f;
  padding: 4px 11px;
  color: #fffff4;
}
#btn-submit:hover {
  background: #fed16e;
}
.box-noread {
  cursor: pointer;
  background: #d9b3b38f;
  color: #cd5151;
  border-radius: 7px;
  padding-right: 5px;
  padding-left: 5px;
  padding-top: 3px;
  padding-bottom: 3px;
  margin-left: 4px;
}
.box-post {
  padding: 5px;
  display: block;
  height: 100vh !important;
  overflow: auto !important;
}
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
#box-read {
  background: #b3d7d98f;
  color: #459383;
  border-radius: 7px;
  padding-right: 5px;
  padding-left: 5px;
  padding-top: 3px;
  padding-bottom: 3px;
  margin-left: 4px;
}
#box-report {
  background: #aeebfd8f;
  color: #1d87b9;
  border-radius: 7px;
  padding-right: 5px;
  padding-left: 5px;
  padding-top: 3px;
  padding-bottom: 3px;
  margin-left: 4px;
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
  .box-noread {
    font-size: small;
  }
  #box-read {
    font-size: small;
  }
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
