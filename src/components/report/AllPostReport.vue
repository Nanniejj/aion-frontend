<template>
  <div id="targetprofile" class="mb-5">
    <div class="mt-5 p-1">
      <b-row class="mb-1">
        <b-col md="8" lg="8" class="m-auto my-1">
          
          <h5 class="bold text-lg-left text-md-left" v-if="getDomainReport=='none'">ไม่มี Domain</h5>
          <h5 class="bold text-lg-left text-md-left" v-else-if="getDomainReport">{{getDomainReport}}</h5>
          <h5 class="bold text-lg-left text-md-left" v-else>All Posts</h5>
        </b-col>
        <b-col md="4" lg="4" class="text-lg-right my-1">
          <span id="post-comment">
            <i class="far fa-paper-plane" />

            <b>
              <span v-if="getPostAllReprot.length !== 0">
                {{ getCntReport | numFormat }} </span
              ><span v-else> 0 </span></b
            >
            โพสต์
          </span>
        </b-col>
      </b-row>

      <b-row>
        <b-col sm="12" md="6">
          <b-form-radio-group
            v-model="selected"
            :options="options"
            name="radio-inline"
            class="mt-1 mb-2 text-left ml-2 mi"
            @change="selectSentiment"
          ></b-form-radio-group>
        </b-col>
        <b-col sm="12" md="6" class="text-right">
          <b-form-select
            v-model="sort"
            :options="optionSort"
            size="sm"
            class="mb-2 select-sort"
            @change="selectSort"
          ></b-form-select>
        </b-col>
      </b-row>
    </div>

    <div>
      <vue-element-loading
        :active="getLoadPostTab"
        size="80"
        background-color="rgba(255, 255, 255, 0.5)"
        color="#fbf7f6"
      />
      <!-- Highlight -->
      <b-form-checkbox
        switch
        size="lg"
        class="text-right mb-2 mi"
        v-model="checked"
      >
        <span :style="myStyle" v-if="checked" class="box-hl pl-2 pr-2"
          >Highlight</span
        >
        <span v-else class="box-hl pl-2 pr-2">Highlight</span>
      </b-form-checkbox>
      <div v-if="getPostAllReprot.length == 0" class="md-font">
        <b-card>
          <div class="mt-3">ไม่พบข้อมูล</div>
        </b-card>
      </div>
      <b-card
        no-body
        class="overflow-hidden"
        header-tag="header"
        footer-tag="footer"
        style="max-width: 100%; margin-bottom: 30px"
        v-for="(datas, k) in paginate"
        :key="k"
      >
        <template #header>
          <b-row>
            <b-col style="text-align: initial; display: contents">
              <span v-if="datas.profile_image">
                <b-avatar
                  @error="user"
                  size="47px"
                  :src="datas.profile_image"
                  loading="lazy"
                  class="imgpro"
                  v-if="datas.source != 'blockdit'"
                ></b-avatar>
                <b-avatar
                  @error="user"
                  size="47px"
                  :src="datas.profile_image"
                  loading="lazy"
                  v-else
                ></b-avatar>
              </span>
              <span v-else> <b-avatar size="45px"></b-avatar></span>
              <img
                v-if="datas.source === 'twitter'"
                :src="imgtw"
                class="social-img"
              />
              <img
                v-if="datas.source === 'facebook'"
                :src="imgfb"
                class="social-img"
              />
              <img
                v-if="datas.source === 'pantip'"
                :src="imgpt"
                class="social-img"
              />
              <img
                v-if="datas.source === 'youtube'"
                :src="imgyt"
                class="social-img"
              />
              <img
                v-if="datas.source === 'news'"
                :src="imgnw"
                class="social-img"
              />
              <img
                v-if="datas.source === 'instagram'"
                :src="imgig"
                class="social-img"
              />
              <img
                v-if="datas.source === 'blockdit'"
                :src="imgbd"
                class="social-img"
              />
              <img
                v-if="datas.source === 'tiktok'"
                src="@/assets/Tiktok.png"
                class="social-img"
              />
            </b-col>
            <b-col style="text-align: initial">
              <!-- {{username(datas.account_name)}} -->
              <span v-if="datas.source !== 'twitter'" id="user-name">
                <a
                  v-if="datas.url_post != undefined && datas.url_post != ''"
                  v-bind:href="datas.url_post"
                  target="_blank"
                >
                  <b style="text-decoration: none; color: #2c3e50"
                    >{{ datas.account_name }}
                  </b>
                  <i class="fa fa-external-link" />
                </a>
              </span>
              <span v-else id="user-name">
                <a
                  v-bind:href="
                    'https://twitter.com/' +
                      datas.account_name +
                      '/status/' +
                      datas.uid
                  "
                  target="_blank"
                >
                  <b style="text-decoration: none; color: #2c3e50">{{
                    datas.account_name
                  }}</b>
                  <i class="fa fa-external-link" />
                </a>
              </span>
              <!-- Time -->
              <div id="text-date" style="text-align: start" class="md-font">
                <span v-if="datas.date"
                  >{{ datas.date.split("T")[0] }} |
                  {{ datas.date.split("T")[1] }}</span
                >
              </div>
            </b-col>
            <b-col sm="12" md="4">
              <div>
                <img class="images1 d-none" :src="datas.snapshot" />
                <i
                  v-if="datas.snapshot"
                  class="fas fa-camera mr-2"
                  @click="onClick(0, [datas.snapshot])"
                />
                <span v-if="datas.user_sentiment">
                  <span
                    v-if="
                      datas.user_sentiment[objId] == 0 ||
                        datas.user_sentiment[objId]
                    "
                  >
                    <b-button-group
                      size="sm"
                      id="btn-group"
                      v-if="datas.user_sentiment[objId] == 1"
                    >
                      <b-button
                        id="btn-pos"
                        :style="btnPosStyle"
                        @click="getTheSelected(k, 1, datas.uid)"
                        >Positive</b-button
                      >
                      <b-button
                        id="btn-nue"
                        @click="getTheSelected(k, 0, datas.uid)"
                        >Neutral</b-button
                      >
                      <b-button
                        id="btn-neg"
                        @click="getTheSelected(k, -1, datas.uid)"
                        >Negative</b-button
                      >
                    </b-button-group>
                    <b-button-group
                      size="sm"
                      id="btn-group"
                      v-if="datas.user_sentiment[objId] == 0"
                    >
                      <b-button
                        id="btn-pos"
                        @click="getTheSelected(k, 1, datas.uid)"
                        >Positive</b-button
                      >
                      <b-button
                        id="btn-nue"
                        :style="btnNeuStyle"
                        @click="getTheSelected(k, 0, datas.uid)"
                        >Neutral</b-button
                      >
                      <b-button
                        id="btn-neg"
                        @click="getTheSelected(k, -1, datas.uid)"
                        >Negative</b-button
                      >
                    </b-button-group>
                    <b-button-group
                      size="sm"
                      id="btn-group"
                      v-if="datas.user_sentiment[objId] == -1"
                    >
                      <b-button
                        id="btn-pos"
                        @click="getTheSelected(k, 1, datas.uid)"
                        >Positive</b-button
                      >
                      <b-button
                        id="btn-nue"
                        @click="getTheSelected(k, 0, datas.uid)"
                        >Neutral</b-button
                      >
                      <b-button
                        id="btn-neg"
                        :style="btnNegStyle"
                        @click="getTheSelected(k, -1, datas.uid)"
                        >Negative</b-button
                      >
                    </b-button-group>
                  </span>
                  <span v-else>
                    <b-button-group
                      size="sm"
                      id="btn-group"
                      v-if="datas.sentiment == 1"
                    >
                      <b-button
                        id="btn-pos"
                        :style="btnPosStyle"
                        @click="getTheSelected(k, 1, datas.uid)"
                        >Positive</b-button
                      >
                      <b-button
                        id="btn-nue"
                        @click="getTheSelected(k, 0, datas.uid)"
                        >Neutral</b-button
                      >
                      <b-button
                        id="btn-neg"
                        @click="getTheSelected(k, -1, datas.uid)"
                        >Negative</b-button
                      >
                    </b-button-group>
                    <b-button-group
                      size="sm"
                      id="btn-group"
                      v-if="datas.sentiment == 0"
                    >
                      <b-button
                        id="btn-pos"
                        @click="getTheSelected(k, 1, datas.uid)"
                        >Positive</b-button
                      >
                      <b-button
                        id="btn-nue"
                        :style="btnNeuStyle"
                        @click="getTheSelected(k, 0, datas.uid)"
                        >Neutral</b-button
                      >
                      <b-button
                        id="btn-neg"
                        @click="getTheSelected(k, -1, datas.uid)"
                        >Negative</b-button
                      >
                    </b-button-group>
                    <b-button-group
                      size="sm"
                      id="btn-group"
                      v-if="datas.sentiment == -1"
                    >
                      <b-button
                        id="btn-pos"
                        @click="getTheSelected(k, 1, datas.uid)"
                        >Positive</b-button
                      >
                      <b-button
                        id="btn-nue"
                        @click="getTheSelected(k, 0, datas.uid)"
                        >Neutral</b-button
                      >
                      <b-button
                        id="btn-neg"
                        :style="btnNegStyle"
                        @click="getTheSelected(k, -1, datas.uid)"
                        >Negative</b-button
                      >
                    </b-button-group>
                  </span>
                </span>
                <span v-else>
                  <b-button-group
                    size="sm"
                    id="btn-group"
                    v-if="datas.sentiment == 1"
                  >
                    <b-button
                      id="btn-pos"
                      :style="btnPosStyle"
                      @click="getTheSelected(k, 1, datas.uid)"
                      >Positive</b-button
                    >
                    <b-button
                      id="btn-nue"
                      @click="getTheSelected(k, 0, datas.uid)"
                      >Neutral</b-button
                    >
                    <b-button
                      id="btn-neg"
                      @click="getTheSelected(k, -1, datas.uid)"
                      >Negative</b-button
                    >
                  </b-button-group>
                  <b-button-group
                    size="sm"
                    id="btn-group"
                    v-if="datas.sentiment == 0"
                  >
                    <b-button
                      id="btn-pos"
                      @click="getTheSelected(k, 1, datas.uid)"
                      >Positive</b-button
                    >
                    <b-button
                      id="btn-nue"
                      :style="btnNeuStyle"
                      @click="getTheSelected(k, 0, datas.uid)"
                      >Neutral</b-button
                    >
                    <b-button
                      id="btn-neg"
                      @click="getTheSelected(k, -1, datas.uid)"
                      >Negative</b-button
                    >
                  </b-button-group>
                  <b-button-group
                    size="sm"
                    id="btn-group"
                    v-if="datas.sentiment == -1"
                  >
                    <b-button
                      id="btn-pos"
                      @click="getTheSelected(k, 1, datas.uid)"
                      >Positive</b-button
                    >
                    <b-button
                      id="btn-nue"
                      @click="getTheSelected(k, 0, datas.uid)"
                      >Neutral</b-button
                    >
                    <b-button
                      id="btn-neg"
                      :style="btnNegStyle"
                      @click="getTheSelected(k, -1, datas.uid)"
                      >Negative</b-button
                    >
                  </b-button-group>
                </span>
              </div>
            </b-col>
          </b-row>
        </template>
        <b-row no-gutters>
          <b-col lg="12">
            <b-card-body>
              <b-card-text class="box-contents">
                <Highlighter
                  class="my-highlight md-font"
                  :style="{
                    textAlign: 'left',
                    fontSize: '17px',
                    padding: '10px',
                  }"
                  highlightClassName="highlight4"
                  :searchWords="highlightText(datas.full_text)"
                  :autoEscape="true"
                  :textToHighlight="
                    datas.read ? datas.full_text.slice(0, 450) : datas.full_text
                  "
                ></Highlighter>

                <div
                  v-if="datas.full_text.length > 450"
                  @click="datas.read = !datas.read"
                  id="readmore"
                >
                  <span v-if="datas.read == true">... อ่านต่อ</span
                  ><span v-else>ย่อบทความ</span>
                </div>
                <!-- </read-more> -->
              </b-card-text>
            </b-card-body>
          </b-col>
          <b-col>
            <div v-if="datas.source == 'tiktok'">
              <iframe
                width="auto"
                height="750"
                :src="'https://www.tiktok.com/embed/v2/' + datas.uid"
                allowfullscreen
              ></iframe>
            </div>
            <div
              id="photo-grid"
              v-if="
                datas.photos !== null &&
                  datas.photos &&
                  datas.photos != '' &&
                  datas.photos != '' &&
                  datas.source !== 'tiktok'
              "
              class="mb-4"
            >
              <div v-if="typeof datas.photos == 'string'">
                <img
                  class="images1"
                  :src="datas.photos"
                  @click="onClick(0, [datas.photos])"
                  onerror="this.style.display='none'"
                />
              </div>
              <div v-else>
                <div v-if="datas.photos.length == 1" class="p-20">
                  <img
                    class="d-none images1"
                    v-for="(image, i) in datas.photos"
                    :src="datas.photos"
                    @click="onClick(i, datas.photos)"
                    :key="i"
                  />
                  <img
                    class="images1"
                    v-for="(image, i) in datas.photos"
                    :src="datas.photos"
                    @click="onClick(i, datas.photos)"
                    :key="`A-${i}`"
                    onerror="this.style.display='none'"
                  />
                </div>
                <div v-else-if="datas.photos.length == 2" class="p-20">
                  <img
                    class="images2"
                    v-for="(image, i) in datas.photos"
                    :src="image"
                    @click="onClick(i, datas.photos)"
                    :key="`B-${i}`"
                    onerror="this.style.display='none'"
                  />
                </div>
                <div v-else-if="datas.photos.length == 3" class="p-20">
                  <img
                    class="images3"
                    v-for="(image, i) in datas.photos"
                    :src="image"
                    @click="onClick(i, datas.photos)"
                    :key="`C-${i}`"
                    onerror="this.style.display='none'"
                  />
                </div>
                <div v-else class="p-20 col2">
                  <img
                    class="images4"
                    v-for="(image, i) in datas.photos.slice(0, 4)"
                    :src="image"
                    @click="onClick(i, datas.photos)"
                    :key="`D-${i}`"
                    onerror="this.style.display='none'"
                  />
                  <div
                    v-if="datas.photos.length > 4"
                    id="picmore"
                    @click="onClick(3, datas.photos)"
                    onerror="this.style.display='none'"
                  >
                    +{{ datas.photos.length - 4 }}
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
          <div class="comment-img">
            <!-- popover user comment -->
            <popover
              :name="'foo' + k"
              id="foo"
              v-if="datas.source !== 'facebook' && datas.source !== 'twitter'"
            >
              <div class="text-center">
                <i class="fa fa-user-circle" aria-hidden="true"></i>
                <div id="bg-user">account name</div>
              </div>

              <div v-if="datas.comment == ''" class="text-center">
                ไม่มีลิสต์รายชื่อ account
              </div>
              <div v-if="datas.comment == undefined" class="text-center">
                ไม่มีลิสต์รายชื่อ account
              </div>
              <!-- <div v-for=" comment_tw in datas.retweet_obj"><span >{{comment_tw}}</span></div> -->
              <div id="scroll">
                <div v-if="datas.comment !== undefined">
                  <!-- <div v-if="datas.source == 'twitter'">
                        <i class="fas fa-comment"></i> reply
                        | <i class="fal fa-retweet"></i> retweet</div>   -->
                  <div v-for="comment in datas.comment" :key="comment">
                    <!-- fb -->
                    <a
                      id="user-link"
                      v-if="datas.source === 'facebook'"
                      v-bind:href="'https://facebook.com//' + comment.id"
                      target="_blank"
                    >
                      <i class="fa fa-user-circle-o" />
                      {{ comment.display_name }}</a
                    >

                    <!-- tw -->
                    <span v-if="datas.source === 'twitter'">
                      <span v-if="comment.post_type == 'reply'">
                        <a
                          id="user-link"
                          v-bind:href="
                            'https://twitter.com/' + comment.account_name
                          "
                          target="_blank"
                        >
                          <i class="fas fa-comment"></i>
                          <img v-bind:src="comment.photo" id="img-user" />
                          {{ comment.account_name }}</a
                        >
                      </span>
                      <span v-if="comment.post_type == 'retweet'">
                        <a
                          id="user-link"
                          v-bind:href="
                            'https://twitter.com/' + comment.account_name
                          "
                          target="_blank"
                        >
                          <i class="fal fa-retweet"></i>
                          <img v-bind:src="comment.photo" id="img-user" />
                          {{ comment.account_name }}</a
                        >
                      </span>
                    </span>
                    <!-- news -->
                    <!-- <a id ="user-link" v-if="datas.source === 'news'" v-bind:href="'https://pantip.com//' + comment.account_name" target="_blank">
                      <i class="fa fa-user-circle-o"/> {{comment.account_name}}</a> -->

                    <!-- IG -->
                    <a
                      id="user-link"
                      v-if="datas.source === 'instagram'"
                      v-bind:href="
                        'https://www.instagram.com//' + comment.owner.id
                      "
                      target="_blank"
                    >
                      <img
                        v-bind:src="comment.owner.profile_pic_url"
                        id="img-user"
                      />
                      {{ comment.owner.username }}</a
                    >

                    <!-- pt -->
                    <a
                      id="user-link"
                      v-if="datas.source === 'pantip'"
                      v-bind:href="
                        'https://pantip.com//profile/' + comment.username
                      "
                      target="_blank"
                    >
                      <img v-bind:src="comment.photo" id="img-user" />
                      {{ comment.username }}</a
                    >
                    <!-- yt -->
                    <a
                      id="user-link"
                      v-if="datas.source === 'youtube'"
                      v-bind:href="
                        'https://www.youtube.com/' + comment.author_link
                      "
                      target="_blank"
                    >
                      <img v-bind:src="comment.photo" id="img-user" />
                      {{ comment.author }}</a
                    >
                  </div>
                </div>

                <!-- <div v-if="datas.comment==''" class="text-center">ไม่มีลิสต์รายชื่อ account</div> -->
              </div>
            </popover>
            <span>
              <i
                class="fas fa-comment"
                v-b-toggle="'btn' + offset + k"
                :aria-expanded="visible ? 'true' : 'false'"
                style="cursor: pointer"
              >
              </i>
              <span
                class="md-font"
                v-if="datas.comments_count && datas.source == 'news'"
              >
                {{ datas.comments.comments.length | numFormat }}&nbsp;
              </span>
              <span v-else class="md-font">
                {{ datas.comments_count | numFormat }}&nbsp;</span
              >
              <!-- <span  class="md-font" v-if="datas.comments_count==''&&datas.source == 'twitter'"> 0 </span> -->
            </span>

            <!-- twitter -->
            <span v-if="datas.source == 'twitter'">
              <span
                v-if="datas.retweets_count !== '0' && datas.retweets_count"
                id="box-reaction"
                v-b-tooltip.hover
                title="Retweet"
              >
                <i class="fal fa-retweet"></i>
                {{ datas.retweets_count | numFormat }}
              </span>
              <span
                v-if="datas.likes_count !== '0' && datas.likes_count"
                id="box-reaction"
                v-b-tooltip.hover
                title="Like"
              >
                <i class="fa fa-heart"></i> {{ datas.likes_count | numFormat }}
              </span>
            </span>
            <!-- share blockdit -->
            <span v-if="datas.source == 'blockdit' && datas.engagement">
              <span id="box-reaction" v-b-tooltip.hover title="Share">
                <i class="fa fa-share"></i>
                <span class="md-font">
                  {{ datas.engagement | numFormat }}
                </span>
              </span>
            </span>
            <!-- reaction-->
            <span v-if="datas.reaction">
              <span v-if="datas.reaction != ''">
                <!-- pt -->
                <span v-if="datas.reaction.Good">
                  <span
                    v-if="datas.reaction.Good !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Good Content"
                  >
                    <i class="fa fa-plus"></i>
                    <span class="md-font">
                      {{ datas.reaction.Good | numFormat }}
                    </span>
                  </span>
                </span>
                <span v-if="datas.reaction.Horror">
                  <span
                    v-if="datas.reaction.Horror !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Horror"
                  >
                    <img
                      v-if="datas.reaction.Horror !== '0'"
                      src="@/assets/horror.png"
                      id="emoji"
                    />
                    <span class="md-font" v-if="datas.reaction.Horror !== '0'">
                      {{ datas.reaction.Horror | numFormat }}
                    </span>
                  </span>
                </span>
                <!-- pt -->
                <!-- fb -->
                <span v-if="datas.reaction.Likes">
                  <span
                    v-if="datas.reaction.Likes !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Like"
                  >
                    <img
                      v-if="datas.reaction.Likes !== '0'"
                      src="@/assets/fb_like.png"
                      id="emoji"
                    />
                    <span class="md-font" v-if="datas.reaction.Likes !== '0'">
                      {{ datas.reaction.Likes | numFormat }}
                    </span>
                  </span>
                </span>

                <span v-if="datas.reaction.like">
                  <span
                    v-if="datas.reaction.like !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Like"
                  >
                    <img
                      v-if="datas.reaction.like !== '0'"
                      src="@/assets/fb_like.png"
                      id="emoji"
                    />
                    <span class="md-font" v-if="datas.reaction.like !== '0'">
                      {{ datas.reaction.like | numFormat }}
                    </span>
                  </span></span
                >

                <span v-if="datas.reaction.share">
                  <span
                    v-if="datas.reaction.share !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Share"
                  >
                    <i
                      class="fa fa-share"
                      v-if="datas.reaction.share !== '0'"
                    ></i>
                    <span class="md-font" v-if="datas.reaction.share !== '0'">
                      {{ datas.reaction.share | numFormat }}
                    </span>
                  </span>
                </span>
                <span v-if="datas.reaction.shares">
                  <span
                    v-if="datas.reaction.shares !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Share"
                  >
                    <i
                      class="fa fa-share"
                      v-if="datas.reaction.shares !== '0'"
                    ></i>
                    <span
                      class="md-font"
                      v-if="datas.reaction.shares !== '0'"
                    >
                      {{ datas.reaction.shares | numFormat }}
                    </span>
                  </span>
                </span>

                <span v-if="datas.reaction.Love">
                  <span
                    v-if="datas.reaction.Love !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Love"
                  >
                    <img
                      v-if="datas.reaction.Love !== '0'"
                      src="@/assets/love.png"
                      id="emoji"
                    />
                    <span class="md-font" v-if="datas.reaction.Love !== '0'">
                      {{ datas.reaction.Love | numFormat }}
                    </span>
                  </span>
                </span>

                <span v-if="datas.reaction.Wow">
                  <span
                    v-if="datas.reaction.Wow !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Wow"
                  >
                    <img
                      v-if="datas.reaction.Wow !== '0'"
                      src="@/assets/wow.png"
                      id="emoji"
                    />
                    <span class="md-font" v-if="datas.reaction.Wow !== '0'">
                      {{ datas.reaction.Wow | numFormat }}
                    </span>
                  </span>
                </span>

                <span v-if="datas.reaction.Haha">
                  <span
                    v-if="datas.reaction.Haha !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Haha"
                  >
                    <img
                      v-if="datas.reaction.Haha !== '0'"
                      src="@/assets/haha.png"
                      id="emoji"
                    />
                    <span class="md-font" v-if="datas.reaction.Haha !== '0'">
                      {{ datas.reaction.Haha | numFormat }}
                    </span>
                  </span>
                </span>

                <span v-if="datas.reaction.Sad">
                  <span
                    v-if="datas.reaction.Sad !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Sad"
                  >
                    <img
                      v-if="datas.reaction.Sad !== '0'"
                      src="@/assets/sad.png"
                      id="emoji"
                    />
                    <span class="md-font" v-if="datas.reaction.Sad !== '0'">
                      {{ datas.reaction.Sad | numFormat }}
                    </span>
                  </span>
                </span>

                <span v-if="datas.reaction.Angry">
                  <span
                    v-if="datas.reaction.Angry !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Angry"
                  >
                    <img
                      v-if="datas.reaction.Angry !== '0'"
                      src="@/assets/angry.png"
                      id="emoji"
                    />
                    <span class="md-font" v-if="datas.reaction.Angry !== '0'">
                      {{ datas.reaction.Angry | numFormat }}
                    </span>
                  </span>
                </span>
                <span v-if="datas.reaction.Hug">
                  <span
                    v-if="datas.reaction.Hug !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Hug"
                  >
                    <img
                      v-if="datas.reaction.Hug !== '0'"
                      src="@/assets/hug.png"
                      id="emoji"
                    />
                    <span class="md-font" v-if="datas.reaction.Hug !== '0'">
                      {{ datas.reaction.Hug | numFormat }}
                    </span>
                  </span>
                </span>

                <!-- yt -->
                <span
                  v-if="datas.reaction.view_count"
                  v-b-tooltip.hover
                  title="Views"
                >
                  <span
                    v-if="datas.reaction.view_count !== ''"
                    id="box-reaction"
                    ><i class="fas fa-eye"></i>
                    <span
                      class="md-font"
                      v-if="datas.reaction.view_count !== ''"
                    >
                      {{ datas.reaction.view_count | numFormat }}
                    </span>
                  </span>
                </span>
                <span v-if="datas.reaction.likes">
                  <span
                    v-if="datas.reaction.likes !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Like"
                  >
                    <img v-if="datas.reaction.likes !== '0'" /><i
                      class="far fa-thumbs-up"
                    ></i>
                    <span class="md-font" v-if="datas.reaction.likes !== '0'">
                      {{ datas.reaction.likes | numFormat }}
                    </span>
                  </span>
                </span>

                <span v-if="datas.reaction.dislikes">
                  <span
                    v-if="datas.reaction.dislikes !== '0'"
                    id="box-reaction"
                    v-b-tooltip.hover
                    title="Dislike"
                  >
                    <i class="far fa-thumbs-down"></i>
                    <span class="md-font">
                      {{ datas.reaction.dislikes | numFormat }}
                    </span>
                  </span>
                </span>
                <!-- end yt -->
              </span>
            </span>
            <!-- comment content -->
            <b-collapse
              :id="'btn' + offset + k"
              class="mt-2"
              v-if="datas.source !== 'facebook' && datas.source !== 'twitter'"
            >
              <b-card id="cmt-card">
                <span v-if="datas.source == 'news' && datas.comments">
                  <div
                    v-for="(cmtn, inx) in datas.comments.comments"
                    :key="inx"
                  >
                    <b-row>
                      <b-col lg="1">
                        <img :src="cmtn.pictureUrl" id="img-cmt" />
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
                  <div v-for="(cmt, i) in datas.comments" :key="i">
                    <b-row>
                      <b-col lg="1">
                        <img
                          v-if="datas.source == 'pantip'"
                          :src="cmt.profile_image"
                          id="img-cmt"
                        />
                        <img
                          v-if="datas.source == 'youtube'"
                          :src="cmt.photo"
                          id="img-cmt"
                        />

                        <!-- <img v-if="datas.source=='news'" :src="cmt.comments.pictureUrl" id="img-cmt"> -->
                        <span> </span>
                      </b-col>
                      <b-col lg="11">
                        <div>
                          <span v-if="datas.source == 'pantip'" class="bold">{{
                            cmt.username
                          }}</span>
                          <span v-if="datas.source == 'youtube'" class="bold">{{
                            cmt.author
                          }}</span>
                          <span
                            v-if="datas.source == 'pantip'&&cmt.time"
                            class="font-weight-light"
                            id="cmt-time"
                            >{{ cmt.time }}</span
                          >
                          <span
                            v-if="datas.source == 'youtube'&&cmt.time"
                            class="font-weight-light"
                            id="cmt-time"
                            >{{ cmt.time.split("T")[0] }} |
                            {{ cmt.time.split("T")[1] }}</span
                          >
                          <!-- <span v-if="cmt.time" class="font-weight-light" id="cmt-time">
                   {{new Date(cmt.time).split("T")[0] }} |
                  {{new Date( cmt.time).split("T")[1] }}
                  </span>  -->
                        </div>
                        <div v-if="datas.source == 'pantip'">
                          {{ cmt.content }}
                        </div>
                        <div v-if="datas.source == 'youtube'">
                          {{ cmt.text }}
                        </div>
                      </b-col>
                    </b-row>
                    <hr />
                  </div>
                </span>
              </b-card>
            </b-collapse>
          </div>
        </template>
      </b-card>
    </div>
    <ul class="pagination" v-if="getPostAllReprot.length != 0">
      <li class="page-item" v-for="pageNumber in totalPages" :key="pageNumber">
        <span
          v-if="
            Math.abs(pageNumber - currentPage) < 3 ||
              pageNumber == totalPages ||
              pageNumber == 1
          "
        >
          <a
            class="page-link md-font"
            v-bind:key="pageNumber"
            href="#targetprofile"
            @click="setPage(pageNumber)"
            :class="{
              current: currentPage === pageNumber,
              last:
                pageNumber == totalPages &&
                Math.abs(pageNumber - currentPage) > 3,
              first: pageNumber == 1 && Math.abs(pageNumber - currentPage) > 3,
            }"
            >{{ pageNumber }}</a
          ></span
        >
      </li>
    </ul>
    <input
      type="number"
      class="form-control md-font"
      v-model="gotopage"
      id="setpage"
      style="width: 150px"
      v-if="getPostAllReprot.length != 0"
    />

    <span v-if="getPostAllReprot.length != 0">
      <button type="button" class="btn btn-default" @click="page()">
        <span id="submit" class="md-font">Go to Page</span>
      </button>
    </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Highlighter from "vue-highlight-words";
import VueGallerySlideshow from "vue-gallery-slideshow";
// import moment from "moment";

export default {
  props: {
    checkpost: {
      type: Boolean,
    },
    querySearch: {
      type: String,
      default: "",
    },
    // social: {
    //   type: String,
    //   default: "facebook,twitter,news,pantip,instagram,youtube",
    // },
    type: {
      type: String,
      default: "daily",
    },
    sentimentWord: {
      type: Number,
    },
  },
  watch: {
   async getDomainReport() {
      this.offset = 0;
      this.currentPage = 1;
      this.page = 0;
      this.getData(
        this.acc,
        this.getDomainReport,
        this.social,
        this.date,
        this.offset,
        this.sort,
        this.selected
      );
      
     await this.axios
      .get(
        "https://api2.cognizata.com/api/v2/object/check_sentiment_word?domain=" +this.getDomainReport
          
      )
      .then((response) => (this.arrword = response.data[0]));
    var k = this.arrword.Keywords;
    var ka = this.arrword.and_keywords;
    let result = ka.map((key) => {
      return key.split("+");
    });
    this.andkey = result;
    this.heightword = k;
    },
    
  },
  data() {
    return {
      acc: "",
      social: "",
      date: null,
      domain: "",
      dataIssue: [],
      objId: "",
      arrword: [],
      myStyle: {
        backgroundColor: "#7a9dc9ab",
      },
      checked: true,
      andkey: [],
      heightword: [],
      visible: false,
      index: null,
      dataPhoto: [],
      currentImageFather: null,
      overlayActiveFather: false,
      start_date: "",
      end_date: "",
      valueDate: "",
      offset: 0,
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
      imageLink: this.$hostname + "/static/Account/images/snapshot/",
      currentPage: 1,
      itemsPerPage: 10,
      resultCount: 0,
      length: 5,
      //length:5, //change this for items per page too
      sort: "",
      count: "",
      has_next: "",
      gotopage: "",
      img: "",
      imgtw: require("@/assets/Twitter.png"),
      imgfb: require("@/assets/Facebook.png"),
      imgpt: require("@/assets/Pantip.png"),
      imgig: require("@/assets/Instagram.png"),
      imgnw: require("@/assets/News.png"),
      imgyt: require("@/assets/Youtube.png"),
      imgbd: require("@/assets/Blockdit.png"),
      user: require("@/assets/user.svg"),
      selectedStm: this.status,
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
  components: {
    Highlighter,
    VueGallerySlideshow,
  },
  computed: {
    ...mapGetters([
      "getSocialIssue",
      "getSelectIssue",
      "getDateIssue",
      "getStatusSearch",
      "getDateReport",
      "getPostAllReprot",
      "getCntReport",
      "getLoadPostTab",
      "getDomainReport",
      "getReportDomainPf"
    ]),

    paginate() {
      var data = this.getPostAllReprot;
      var count = this.getCntReport;
      var currentPage = this.currentPage;
      var totalPages = this.totalPages;
      //var resultCount = this.resultCount;

      if (!data || count != count) {
        return;
      }
      //resultCount = count
      if (currentPage >= totalPages) {
        currentPage = totalPages;
      }
      // console.log("data2", data);
      return data;
    },
    totalPages: function() {
      var itemsPerPage = this.itemsPerPage;
      var count = this.getCntReport;
      var length;
      if (count < 10) {
        length = 10;
      } else {
        length = count;
      }
      var xs = Math.ceil(length / itemsPerPage);
      // console.log("total page:", xs);
      return xs;
    },
  },
  methods: {
    selectSort() {
        this.offset = 0;
      this.currentPage = 1;
      this.page = 0;
      this.getData(
        this.acc,
        this.getDomainReport,
        this.social,
        this.date,
        this.offset,
        this.sort,
        this.selected
      );
    },
    selectSentiment() {
      this.offset = 0;
      this.currentPage = 1;
      this.page = 0;
      this.getData(
        this.acc,
        this.getDomainReport,
        this.social,
        this.date,
        this.offset,
        this.sort,
        this.selected
      );
      
    },
    getData(acc, domain, social, date, offset, sort) {
      this.$store.dispatch("fetchPostAllReport", {
        account: acc,
        source: social,
        domain: domain,
        start_date: date[0],
        end_date: date[1],
        offset: offset,
        sort_by: sort,
        sentiment: this.selected,
        // dashboard: true,
      });
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
        return word;
      } else {
        return word;
      }
      // return word;
    },
    onClick(i, data) {
      // console.log(data);
      this.index = i;
      this.dataPhoto = data;
    },
    clickImage(index) {
      this.currentImageFather = index;
      this.overlayActiveFather = true;
    },


    page() {
      var pageNumber;
      if (
        parseInt(this.gotopage) >
          Math.ceil(this.getCntReport / 10) ||
        this.gotopage.includes("-")
      ) {
        alert("Wrong number");
        pageNumber = 1;
      } else {
        pageNumber = parseInt(this.gotopage);
      }
      this.setPage(pageNumber);
      this.gotopage = "";
      // console.log(pageNumber);
    },
    setPage: function(pageNumber) {
      this.currentPage = pageNumber;
      // console.log(this.currentPage);
      //console.log("page num:",typeof(pageNumber));
      //Call new data from api here
      if (this.currentPage > 1) {
        this.offset = 10 * (this.currentPage - 1);
        // console.log("offset : ", this.offset);
      } else {
        this.offset = 0;
      }  
      this.getData(
        this.acc,
        this.getDomainReport,
        this.social,
        this.date,
        this.offset,
        this.sort,
        this.selected
      );

    },
    tabactive() {
      document.getElementById("eltab1").style.borderColor = "#fed16e";
      document.getElementById("eltab2").style.borderColor = "#4c412b";
      document.getElementById("eltab3").style.borderColor = "#4c412b";
      this.offset = 0;
      this.sort = "";
      this.currentPage = 1;
      this.pageApi(this.sort, this.offset, this.querySearch);
      // this.offset=0
      // this.$store.dispatch("fetchSentimentPost",{type:this.getDateChoice,source:this.social,sentiment:this.status,sort_by:"",offset:this.offset});
    },
    tab2() {
      document.getElementById("eltab1").style.borderColor = "#4c412b";
      document.getElementById("eltab3").style.borderColor = "#4c412b";
      document.getElementById("eltab2").style.borderColor = "#fed16e";
      this.offset = 0;
      this.currentPage = 1;
      this.sort = "descend";
      this.pageApi(this.sort, this.offset, this.querySearch);
      // this.offset=0
      // this.$store.dispatch("fetchSentimentPost",{type:this.getDateChoice,source:this.social,sentiment:this.status,sort_by:'descend',offset:this.offset});
    },
    tab3() {
      document.getElementById("eltab1").style.borderColor = "#4c412b";
      document.getElementById("eltab2").style.borderColor = "#4c412b";
      document.getElementById("eltab3").style.borderColor = "#fed16e";
      this.offset = 0;
      this.currentPage = 1;
      this.sort = "engagement";
      this.pageApi(this.sort, this.offset, this.querySearch);
      //   this.offset=0
      // this.$store.dispatch("fetchSentimentPost",{type:this.getDateChoice,source:this.social,sentiment:this.status,sort_by:'engagement',offset:this.offset});
    },
    getTheSelected(k, v, uid) {
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
            .then(function() {
              // console.log(response);
              let se = _this.selected.toLocaleString();
              if (se == "") {
                if (v == 1) {
                  _this.getPostAllReprot[k].sentiment = 1;
                  _this.getPostAllReprot[k].user_sentiment[_this.objId] = 1;
                } else if (v == 0) {
                  _this.getPostAllReprot[k].sentiment = 0;
                  _this.getPostAllReprot[k].user_sentiment[_this.objId] = 0;
                } else {
                  _this.getPostAllReprot[k].sentiment = -1;
                  _this.getPostAllReprot[k].user_sentiment[_this.objId] = -1;
                }
              } else {
                // console.log("in 1");
                if (v == _this.selected) {
                  // console.log("in 11");
                  _this.getPostAllReprot[k].sentiment = v;
                  _this.getPostAllReprot[k].user_sentiment[_this.objId] = v;
                } else {
                  // console.log("in 12");
                  _this.getPostAllReprot.splice(k, 1);
                }
              }
            })
            .catch(function(response) {
              console.log("errrrrrr", response.message);
            });
          // if (v !== this.getPostAllReprot[k].sentiment) {
          //   this.$store.dispatch("editSentimentPost", {
          //     sentiment: v,
          //     uid: uid,
          //   });
          //   if (this.selected == "") {
          //     if (v == 1) {
          //       this.getPostAllReprot[k].sentiment = 1;
          //     } else if (v == 0) {
          //       this.getPostAllReprot[k].sentiment = 0;
          //     } else {
          //       this.getPostAllReprot[k].sentiment = -1;
          //     }
          //   } else {
          //     this.getPostAllReprot.splice(k, 1);
          //   }
          //   // this.getPostAllReprot.splice(k, 1);
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
  },
 destroyed(){
   this.$store.commit('setDomainReport',"")
 },
  async created() {
    this.objId = localStorage.getItem("objId");
    let offset = this.offset;
    let sort = this.sort;
    this.acc = localStorage.getItem("uidReport");
    this.date = localStorage.getItem("dateReport").split(",");
    this.social = localStorage.getItem("sourceReport");
    this.domain = "";
    this.getData(this.acc, this.domain, this.social, this.date, offset, sort);
    if (this.getReportDomainPf) {
      // console.log('this.getReportDomainPf',this.getReportDomainPf);
     await this.axios
      .get(
        "https://api2.cognizata.com/api/v2/object/check_sentiment_word?domain=" +this.getReportDomainPf
          
      )
      .then((response) => (this.arrword = response.data[0]));
    var k = this.arrword.Keywords;
    var ka = this.arrword.and_keywords;
    let result = ka.map((key) => {
      return key.split("+");
    });
    this.andkey = result;
    this.heightword = k;
    // console.log("result", result);
    }
     
  },
};
</script>

<style scoped>
.box-hl {
  border-radius: 10px;
}
.highlight4 {
  background-color: #7a9dc9ab;
  padding: 0 2px;
}
.all {
  background-color: #fed16e;
  color: white;
  width: 80px;
  padding: 7px;
}
p {
  margin-bottom: 0rem;
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
.fa-external-link {
  margin-left: 5px;
  text-decoration: none;
  padding: 6px 6px;
  border-radius: 20px;
  color: #2c3e50;
}
.fa-external-link:hover {
  background: #ccc;
  color: #696d71;
  cursor: pointer;
}
#export-btn {
  margin: 0px 20px;
  color: #495057;
  background-color: #e9ecef;
  border-color: #e9ecef;
  border-radius: 9px;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 20%);
}
#export-btn:hover {
  color: white;
  background-color: #495057;
  border-color: #495057;
}
.highlight-search {
  background-color: #fed16e;
  padding: 0 2px;
}
.highlight1 {
  background-color: #f7776a;
  padding: 0 2px;
}

.highlight2 {
  background-color: #54c69d;
  padding: 0 2px;
}

.highlight3 {
  background-color: #3a86ad;
  padding: 0 2px;
}
.form-control {
  background-color: #ede7dd;
  display: inline;
}
.pagination {
  margin-top: 30px;
  -webkit-box-pack: center;
  justify-content: center;
}

.current {
  color: white;
  background-color: #5679a5;
}
/* ul {
  padding: 0;
  list-style-type: none;
} */
li {
  display: inline;
  /* margin: 5px 5px; */
}

a.first::after {
  content: "...";
}

a.last::before {
  content: "...";
}

#btn-pos,
#btn-nue,
#btn-neg {
  color: #636465;
  background-color: #dddddd;
  border-color: #dddddd;
}
#btn-pos:hover {
  background-color: #cbc9c9;
  border-color: #cbc9c9;
  color: #636465;
}
#btn-neg:hover {
  background-color: #cbc9c9;
  border-color: #cbc9c9;
  color: #636465;
}
#btn-nue:hover {
  background-color: #cbc9c9;
  border-color: #cbc9c9;
  color: #636465;
}
.img-thumbnail {
  height: 240px;
  object-fit: cover;
  width: fit-content;
  cursor: pointer;
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
#post-comment {
  margin-left: 12px;
}
.modal {
  background-color: #ffffff00 !important;
}
.modal-header {
  border-bottom: none;
}
.modal-dialog {
  position: relative;
  width: auto;
  margin: 0;
  pointer-events: none;
  padding-top: 30px;
}
#img-popup {
  max-width: 90vw;
  height: auto;
  max-height: 90vh;
}
.close {
  float: right;
  font-size: 1.5rem;
  font-weight: bolder;
  line-height: 1;
  color: #ffffff;
  text-shadow: 0 1px 0 #616569;
  margin-left: 90%;
  opacity: 1;
  padding: 20px 0px;
}
.close span {
  background: #5453538c;
  padding: 5px 14px;
  border-radius: 50px;
}
.close span :hover {
  background: #545353c4;
}
.modal-dialog {
  max-width: none;
}
.modal-content {
  width: 100vw;
  margin: 0;
  background: transparent;
  border: none;
}
#img-user {
  width: 28px;
  border-radius: 50%;
  margin-bottom: 3px;
}
#scroll {
  min-height: auto;
  max-height: 200px;
  overflow: auto;
  overflow-x: hidden;
}
#user-link {
  color: #2c3e5a;
  margin-left: 45px;
  white-space: nowrap;
}
#user-link:hover {
  color: #2c3e50;
  background: #efebeb;
  padding-left: 10px;
  border-radius: 20px;
  padding-right: 10px;
  text-decoration: none;
  font-weight: bold;
}
#user-link:hover .fa-user-circle-o {
  font-weight: 900;
}
#bg-user {
  background: #ffffff;
  color: #2c3e5a;
  padding: 1px;
  padding-left: 10px;
  padding-right: 10px;
  width: 80%;
  border-radius: 6px;
  margin: auto;
  border: 1.5px solid;
  margin-bottom: 8px;
}
.fa-user-circle {
  font-size: 30px;
}
.fa-comment {
  font-size: 17px;
}
.fa-comment:hover {
  color: #fed16e;
}
.vue-popover.dropdown-position-top:before {
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #fff;
  bottom: -6px;
  left: calc(50% - 136px);
  filter: drop-shadow(0px 2px 2px rgba(52, 73, 94, 0.1));
}
#foo {
  width: 300px !important;
  z-index: 2 !important;
  left: unset !important;
  top: unset !important;
  bottom: 45px;
  max-height: 300px;
}
#bg-user {
  background: #ffffff;
  color: #2c3e5a;
  padding: 1px;
  padding-left: 10px;
  padding-right: 10px;
  width: 80%;
  border-radius: 6px;
  margin: auto;
  border: 1.5px solid;
  margin-bottom: 8px;
}
#emoji {
  width: 27px;
}
.comment-img {
  text-align: start;
}
.card-body {
  min-height: 6rem;
}
.card-text {
  text-align: justify;
  padding: 0px 10px;
}
.card-text:last-child {
  margin-top: 10px;
}
#tab-post {
  text-align: initial;
  padding-right: 50px;
  margin: auto;
}
.fa-facebook-official,
.fa-facebook-square {
  font-size: 42px;
  color: #4967aa;
  margin-right: 10px;
  vertical-align: middle;
}

.card-img {
  padding: 10px;
}
.card-footer {
  text-align: initial;
}

.user-img {
  width: 46px;
  z-index: 1;
  position: relative;
  border-radius: 50%;
  box-shadow: 2px 1px 4px #888888;
  height: 46px;
  display: inline-block;
  margin-left: 10px;
}
.social-img {
  width: 35px;
  margin-top: 6px;
  margin-left: -7px;
  height: 35px;
}
card-img,
.card-img-bottom,
.card-img-top {
  width: 100%;
  object-fit: cover;
}
.fa-sort-amount-down-alt {
  font-size: 28px;
  color: #4c412b;
}
.fa-sort-amount-down-alt:before {
  position: relative;
  bottom: -14px;
}
#all-eltab {
  border-bottom: 10px solid #4c412b;
}
#eltab1,
#eltab2,
#eltab3 {
  cursor: pointer;
  text-align: center;
  padding-right: 10px;
}
#eltab1 {
  outline-style: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-color: transparent;
  border-bottom: 10px solid #fed16e;
}
#eltab2,
#eltab3 {
  outline-style: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-color: transparent;
  border-bottom: 10px solid #4c412b;
}
#title-tab {
  padding-right: 5px;
}

#tab-view {
  text-align: end;
  /* padding-left: 50px; */
}
#tab-all {
  margin-top: 30px;
  margin-bottom: 30px;
}
@media only screen and (min-width: 0px) and (max-width: 1050px) {
  .col-sm-7 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  .col-sm-5 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  #tab-post {
    text-align: center;
    padding-right: 15px;
    margin-top: 20px;
  }
  #tab-view {
    text-align: center;
    padding-left: 0px;
  }
  #overflow-page {
    overflow: hidden;
  }
  #btn-sentiment > div {
    white-space: nowrap !important;
  }
  #btn-sentiment[data-v-1037f9aa] {
    right: -16%;
    position: relative;
    z-index: 1;
  }
  #text-date {
    white-space: nowrap;
  }
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  .all {
    padding: 10px !important;
  }
}
@media only screen and (min-width: 375px) and (max-width: 815px) {
  .card-text {
    font-size: 2vw;
  }
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
  .card-text {
    font-size: 4vw;
  }
  .card-body {
    min-height: 8rem;
  }
  .card-text {
    padding: 0px 0px;
  }
  .social-img {
    width: 31px;
    margin-top: 6px;
    margin-left: -9px;
    height: 31px;
  }
  .user-img {
    width: 38px;
    height: 38px;
    margin-left: 10px;
  }
  .modal-body {
    padding: 0rem;
  }
  .close {
    padding: 20px 0px;
    margin-left: 84%;
  }
  #emoji {
    width: 20px;
  }
  #tab-view {
    padding-left: 0;
    text-align: center;
    margin-bottom: 31px;
  }
  #eltab1,
  #eltab2,
  #eltab3 {
    padding-right: 0px;
  }
  #all-eltab {
    font-size: 3.6vw;
  }
  .fa-sort-amount-down-alt:before {
    display: none;
  }
  #tab-post {
    margin-top: 25px;
    font-size: 3.6vw;
  }
  #tab-post {
    text-align: center;
    padding-right: 15px;
  }
  #tab-all {
    margin-top: 0px;
    margin-bottom: 0px;
  }
  #btn-sentiment {
    margin-top: 5px;
  }
  h1,
  .h1 {
    font-size: 1.5rem;
  }

  #content
    > div.container
    > div:nth-child(3)
    > div
    > header
    > div
    > div.btn-edit.col-sm
    > button {
    font-size: 3.5vw !important;
    font-weight: bold;
  }
  .social[data-v-00911447] {
    font-size: x-large;
  }
  #img-title {
    width: 50px;
    display: block;
    margin: auto;
    margin-bottom: 5px;
  }
  .all {
    width: 50px;
    display: block;
    margin: auto;
    margin-bottom: 5px;
  }
}
</style>
