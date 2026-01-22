<template>
  <div>
    <!-- {{ getTopPostDomain }} -->
    <div v-if="getTopPostDomain && getTopPostDomain.length">
      <!-- {{ getTopPostDomain }} -->
      <!-- Highlight -->
      <b-form-checkbox switch size="lg" class="text-right" v-model="checked" v-if="pageCheck == 'Domain'">
        <span :style="myStyle" v-if="checked" class="box-hl pl-2 pr-2">Highlight</span>
        <span v-else class="box-hl pl-2 pr-2">Highlight</span>
      </b-form-checkbox>

      <!-- <span > -->
        <!-- <b-row 
          class="my-3"
          style=""
          id="scrollbar"
        > -->
            <b-col cols="12" class="px-0 position-relative mt-3" style="min-height: 250px;">
                <!-- การ์ด -->
                <b-card v-for="(postDomain, k) in getTopPostDomain" :key="k"
                body-class="" 
                class="custom-card" 
                :class="{
                    'card--current': currentIndex === k,
                    'card--next': nextIndex === k,
                    'card--out': outIndex === k,
                    'd-none': currentIndex !== k && nextIndex !== k && outIndex !== k
                }">
                    <template #header v-if="postDomain">
                        <b-row class="">
                            <b-col cols="12" sm="auto" class="text-left pr-0 position-relative d-inline-block">
                                <!-- ไอคอนใหญ่ -->
                                <i class="fas fa-crown" 
                                    style="font-size: 40px;"
                                    :style="{
                                        color: k == 0 ? '#F2B100' : k == 1 ? '#999999' : k == 2 ? '#8C4B00' : '#d1d1d1',
                                    }"
                                ></i>
                                <!-- ตัวเลขเล็กทับด้านบนขวา -->
                                <span style="
                                    position: absolute;
                                    top: 15px;
                                    left: 28px;
                                    color: white;
                                    font-size: 14px;
                                    font-weight: bold;
                                    border-radius: 50%;
                                    padding: 2px 6px;
                                ">{{ k+1 }}</span>
                            </b-col>
                            <b-col class="align-start pr-0 col-lg-auto w-auto" sm="auto" lg="auto">
                                <span class="left">
                                    <span v-if="postDomain.profile_image">
                                        <b-avatar @error="setAltImg" size="47px" :src="postDomain.profile_image"
                                            loading="lazy" class="imgpro" v-if="postDomain.source != 'blockdit'"></b-avatar>
                                        <b-avatar @error="setAltImg" size="47px" :src="postDomain.profile_image"
                                            loading="lazy" v-else></b-avatar>
                                    </span>
                                    <span v-else>
                                        <b-avatar @error="setAltImg" size="47px" :src="postDomain.photos" loading="lazy"
                                            class="imgpro" v-if="postDomain.source == 'tiktok'"></b-avatar>
                                        <b-avatar size="45px" v-else></b-avatar>
                                    </span>
                                    <img v-if="postDomain.source == 'twitter'" src="@/assets/Twitter.png"
                                        class="social-img" />
                                    <img v-else-if="postDomain.source == 'facebook'" src="@/assets/Facebook.png"
                                        class="social-img" />
                                    <img v-if="postDomain.source == 'news'" src="@/assets/News.png" class="social-img" />
                                    <span v-if="postDomain.source == 'pantip'">
                                        <img v-if="postDomain.platform == 'dek-d'" src="@/assets/dekd.png"
                                            class="social-img" />
                                        <img v-else-if="postDomain.platform == 'lemon8'" src="@/assets/lemon8.png"
                                            class="social-img" />
                                        <img v-else-if="postDomain.platform == 'reddit'" src="@/assets/reddit.png" class="social-img" />
                                        <img v-else src="@/assets/Pantip.png" class="social-img" />
                                    </span>
                                    <img v-if="postDomain.source == 'instagram'" src="@/assets/Instagram.png"
                                        class="social-img" />
                                    <img v-if="postDomain.source == 'youtube'" src="@/assets/Youtube.png"
                                        class="social-img" />
                                    <img v-if="postDomain.source == 'blockdit'" src="@/assets/Blockdit.png"
                                        class="social-img" />
                                    <img v-if="postDomain.source == 'tiktok'" src="@/assets/Tiktok.png"
                                        class="social-img" />
                                    <img v-if="postDomain.source == 'threads'" src="@/assets/Threads.png"
                                        class="social-img" />
                                </span>
                            </b-col>
                            <b-col class="align-start mt-2 mt-md-0 pr-0 w-auto" sm="auto" lg="auto">
                                <span id="txt-name">
                                    <!-- {{accountName(postDomain.account_name,postDomain.source)}} -->
                                    <span><b> {{ postDomain.account_name }} </b></span>
                                    <a v-if="
                                        postDomain.url_post &&
                                        postDomain.url_post.includes('mbasic')
                                    " v-bind:href="postDomain.url_post.replace('mbasic.', '')" class="fa fa-external-link"
                                        target="_blank"></a>
                                    <a v-else v-bind:href="postDomain.url_post" class="fa fa-external-link"
                                        target="_blank"></a></span>
                                <div class="font-weight-light small" v-if="postDomain.date">
                                    {{ postDomain.date.split("T")[0] }} |
                                    {{ postDomain.date.split("T")[1] }}
                                </div>
                            </b-col>
                            <b-col class="mt-2 mt-md-0 pl-0 d-flex align-items-center justify-content-center justify-content-sm-end" cols="12" sm="" lg="" md="">
                                <b-avatar button class="mr-2" :variant="postDomain.sentiment === 1 ? 'success' : 'secondary'"
                                    icon="emoji-smile" size="34" @click="getTheSelected(k, 1, postDomain.uid)"/>
                                <b-avatar button class="mr-2" :variant="postDomain.sentiment === 0 ? 'primary' : 'secondary'"
                                    icon="emoji-neutral" size="34" @click="getTheSelected(k, 0, postDomain.uid)"/>
                                <b-avatar button :variant="postDomain.sentiment === -1 ? 'danger' : 'secondary'" icon="emoji-frown"
                                    size="34" @click="getTheSelected(k, -1, postDomain.uid)"/>
                            </b-col>
                        </b-row>
                        <!-- <b-row>
                        <b-col class="align-start col-lg-auto w-auto" sm="auto" lg="auto">
                            <span class="left">
                            <span v-if="postDomain.profile_image">
                                <b-avatar @error="setAltImg" size="47px" :src="postDomain.profile_image" loading="lazy"
                                class="imgpro" v-if="postDomain.source != 'blockdit'"></b-avatar>
                                <b-avatar @error="setAltImg" size="47px" :src="postDomain.profile_image" loading="lazy"
                                v-else></b-avatar>
                            </span>
                            <span v-else>
                                <b-avatar @error="setAltImg" size="47px" :src="postDomain.photos" loading="lazy" class="imgpro"
                                v-if="postDomain.source == 'tiktok'"></b-avatar>
                                <b-avatar size="45px" v-else></b-avatar>
                            </span>
                            <img v-if="postDomain.source == 'twitter'" src="@/assets/Twitter.png" class="social-img" />
                            <img v-else-if="postDomain.source == 'facebook'" src="@/assets/Facebook.png" class="social-img" />
                            <img v-if="postDomain.source == 'news'" src="@/assets/News.png" class="social-img" />
                            <span v-if="postDomain.source == 'pantip'">
                                <img v-if="postDomain.platform == 'dek-d'" src="@/assets/dekd.png" class="social-img" />
                                <img v-else-if="postDomain.platform == 'lemon8'" src="@/assets/lemon8.png" class="social-img" />
                                <img v-else src="@/assets/Pantip.png" class="social-img" />
                            </span>
                            <img v-if="postDomain.source == 'instagram'" src="@/assets/Instagram.png" class="social-img" />
                            <img v-if="postDomain.source == 'youtube'" src="@/assets/Youtube.png" class="social-img" />
                            <img v-if="postDomain.source == 'blockdit'" src="@/assets/Blockdit.png" class="social-img" />
                            <img v-if="postDomain.source == 'tiktok'" src="@/assets/Tiktok.png" class="social-img" />
                            <img v-if="postDomain.source == 'threads'" src="@/assets/Threads.png" class="social-img" />
                            </span>
                        </b-col>
                        <b-col class="align-start w-auto" sm="8" lg="auto">
                            <span id="txt-name">
                            <span><b> {{ postDomain.account_name }} </b></span>
                            <a v-if="
                                postDomain.url_post &&
                                postDomain.url_post.includes('mbasic')
                            " v-bind:href="postDomain.url_post.replace('mbasic.', '')" class="fa fa-external-link"
                                target="_blank"></a>
                            <a v-else v-bind:href="postDomain.url_post" class="fa fa-external-link"
                                target="_blank"></a></span>
                            <div class="font-weight-light small" v-if="postDomain.date">
                            {{ postDomain.date.split("T")[0] }} |
                            {{ postDomain.date.split("T")[1] }}
                            </div>
                        </b-col>
                        <b-col class="text-md-right" sm="12" lg="" md="">
                            <img class="images1 d-none" :src="postDomain.snapshot" />
                            <i v-if="postDomain.snapshot" class="fas fa-camera mr-2"
                            @click="onClick(0, [postDomain.snapshot])" />
                            <span v-if="postDomain.user_sentiment">
                            <span v-if="
                                postDomain.user_sentiment[objId] == 0 ||
                                postDomain.user_sentiment[objId]
                            ">
                                <b-button-group size="sm" id="btn-group" v-if="postDomain.user_sentiment[objId] == 1">
                                <b-button id="btn-pos" :style="btnPosStyle"
                                    @click="getTheSelected(k, 1, postDomain.uid)">Positive</b-button>
                                <b-button id="btn-nue" @click="getTheSelected(k, 0, postDomain.uid)">Neutral</b-button>
                                <b-button id="btn-neg" @click="getTheSelected(k, -1, postDomain.uid)">Negative</b-button>
                                </b-button-group>
                                <b-button-group size="sm" id="btn-group" v-if="postDomain.user_sentiment[objId] == 0">
                                <b-button id="btn-pos" @click="getTheSelected(k, 1, postDomain.uid)">Positive</b-button>
                                <b-button id="btn-nue" :style="btnNeuStyle"
                                    @click="getTheSelected(k, 0, postDomain.uid)">Neutral</b-button>
                                <b-button id="btn-neg" @click="getTheSelected(k, -1, postDomain.uid)">Negative</b-button>
                                </b-button-group>
                                <b-button-group size="sm" id="btn-group" v-if="postDomain.user_sentiment[objId] == -1">
                                <b-button id="btn-pos" @click="getTheSelected(k, 1, postDomain.uid)">Positive</b-button>
                                <b-button id="btn-nue" @click="getTheSelected(k, 0, postDomain.uid)">Neutral</b-button>
                                <b-button id="btn-neg" :style="btnNegStyle"
                                    @click="getTheSelected(k, -1, postDomain.uid)">Negative</b-button>
                                </b-button-group>
                            </span>
                            <span v-else>
                                <b-button-group size="sm" id="btn-group" v-if="postDomain.sentiment == 1">
                                <b-button id="btn-pos" :style="btnPosStyle"
                                    @click="getTheSelected(k, 1, postDomain.uid)">Positive</b-button>
                                <b-button id="btn-nue" @click="getTheSelected(k, 0, postDomain.uid)">Neutral</b-button>
                                <b-button id="btn-neg" @click="getTheSelected(k, -1, postDomain.uid)">Negative</b-button>
                                </b-button-group>
                                <b-button-group size="sm" id="btn-group" v-if="postDomain.sentiment == 0">
                                <b-button id="btn-pos" @click="getTheSelected(k, 1, postDomain.uid)">Positive</b-button>
                                <b-button id="btn-nue" :style="btnNeuStyle"
                                    @click="getTheSelected(k, 0, postDomain.uid)">Neutral</b-button>
                                <b-button id="btn-neg" @click="getTheSelected(k, -1, postDomain.uid)">Negative</b-button>
                                </b-button-group>
                                <b-button-group size="sm" id="btn-group" v-if="postDomain.sentiment == -1">
                                <b-button id="btn-pos" @click="getTheSelected(k, 1, postDomain.uid)">Positive</b-button>
                                <b-button id="btn-nue" @click="getTheSelected(k, 0, postDomain.uid)">Neutral</b-button>
                                <b-button id="btn-neg" :style="btnNegStyle"
                                    @click="getTheSelected(k, -1, postDomain.uid)">Negative</b-button>
                                </b-button-group>
                            </span>
                            </span>
                            <span v-else>
                            <b-button-group size="sm" id="btn-group" v-if="postDomain.sentiment == 1">
                                <b-button id="btn-pos" :style="btnPosStyle"
                                @click="getTheSelected(k, 1, postDomain.uid)">Positive</b-button>
                                <b-button id="btn-nue" @click="getTheSelected(k, 0, postDomain.uid)">Neutral</b-button>
                                <b-button id="btn-neg" @click="getTheSelected(k, -1, postDomain.uid)">Negative</b-button>
                            </b-button-group>
                            <b-button-group size="sm" id="btn-group" v-if="postDomain.sentiment == 0">
                                <b-button id="btn-pos" @click="getTheSelected(k, 1, postDomain.uid)">Positive</b-button>
                                <b-button id="btn-nue" :style="btnNeuStyle"
                                @click="getTheSelected(k, 0, postDomain.uid)">Neutral</b-button>
                                <b-button id="btn-neg" @click="getTheSelected(k, -1, postDomain.uid)">Negative</b-button>
                            </b-button-group>
                            <b-button-group size="sm" id="btn-group" v-if="postDomain.sentiment == -1">
                                <b-button id="btn-pos" @click="getTheSelected(k, 1, postDomain.uid)">Positive</b-button>
                                <b-button id="btn-nue" @click="getTheSelected(k, 0, postDomain.uid)">Neutral</b-button>
                                <b-button id="btn-neg" :style="btnNegStyle"
                                @click="getTheSelected(k, -1, postDomain.uid)">Negative</b-button>
                            </b-button-group>
                            </span>
                        </b-col>
                        </b-row> -->
                    </template>
                    <b-row class="m-0">
                        <b-col cols="12" lg="auto" class="px-0 pr-lg-3">
                            <b-row class="mx-0">
                                <!-- <template v-if="postDomain.photos.length === 3">
                                    <b-col cols="6" lg="6" class="pr-0 mb-2 mb-lg-0">
                                        <b-img class="fixed-img-big" :src="postDomain.photos[0]" alt="Big image" fluid></b-img>
                                    </b-col>
    
                                    <b-col cols="6" lg="6" class="">
                                        <b-row class="mb-3 mx-0">
                                            <b-col cols="12" class="px-0 text-left">
                                                <b-img class="fixed-img-small" :src="postDomain.photos[1]" alt="Top small" fluid></b-img>
                                            </b-col>
                                        </b-row>
                                        <b-row class="mx-0">
                                            <b-col cols="12" class="px-0 text-left">
                                                <b-img class="fixed-img-small" :src="postDomain.photos[2]" alt="Bottom small" fluid></b-img>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </template> -->
                                <!-- กรณีมี 2 รูป -->
                                <!-- <template v-else-if="postDomain.photos.length === 2">
                                    <b-col class="pl-0" cols="6" v-for="(photo, index) in postDomain.photos" :key="index">
                                        <b-img class="fixed-img-small" :src="photo" :alt="'Image ' + (index + 1)" fluid></b-img>
                                    </b-col>
                                </template> -->

                                <!-- กรณีมี 1 รูป -->
                                <template>
                                    <b-col cols="12" class="px-0">
                                        <!-- class="fixed-img-big" -->
                                        <b-img class="fixed-img-big" rounded :src="postDomain.photos[0]" cover alt="Cover image"></b-img>
                                    </b-col>
                                    <!-- <b-col cols="auto" class="position-absolute w-100" style="bottom: 10px; right: 10px !important;">
                                        <span v-b-toggle="'ocr-text' + page + k" id="box-summarize" v-b-tooltip.hover title="OCR"
                                            class=" btn-ocr"
                                            v-if="postDomain && postDomain.photos_text && postDomain.photos_text[0] && postDomain.photos_text[0].text">
                                            <img width="25" height="25" src="https://img.icons8.com/sf-regular/50/printed-ocr.png"
                                                alt="printed-ocr" style="filter: brightness(0) invert(1);" />
                                            <span class="md-font">
                                                OCR
                                            </span>
                                        </span>
                                    </b-col> -->
                                </template>
                            </b-row>
                            <!-- <b-img left src="https://picsum.photos/125/125/?image=58" alt="Left image"></b-img> -->
                        <!-- <div v-if="postDomain.source == 'tiktok' && postDomain.uid" class="">
                            <a v-bind:href="postDomain.url_post" target="_blank">
                            <img :src="postDomain.photos && postDomain.photos[0]" onerror="this.style.display='none'"
                                style="height:450px;border-radius: 10px;" class="my-3" />
                            </a>
                        </div>
                        <div id="photo-grid" v-if="postDomain.photos && postDomain.source !== 'tiktok'" class="mb-4">
                            
                            <div v-if="typeof postDomain.photos == 'string'">
                            <img class="images1" :src="postDomain.photos" @click="onClick(0, [postDomain.photos])"
                                onerror="this.style.display='none'" />
                            </div>
                            <div v-else>
                            <div v-if="postDomain.photos.length == 1" class="p-20">
                                <img class="d-none images1" v-for="(image, i) in postDomain.photos" :src="postDomain.photos"
                                @click="onClick(i, postDomain.photos)" :key="i" />
                                <img class="images1" v-for="(image, i) in postDomain.photos" :src="postDomain.photos"
                                @click="onClick(i, postDomain.photos)" :key="`A-${i}`" onerror="this.style.display='none'" />
                            </div>
                            <div v-else-if="postDomain.photos.length == 2" class="p-20">
                                <img class="images2" v-for="(image, i) in postDomain.photos" :src="image"
                                @click="onClick(i, postDomain.photos)" :key="`ฺB-${i}`" onerror="this.style.display='none'" />
                            </div>
                            <div v-else-if="postDomain.photos.length == 3" class="p-20">
                                <img class="images3" v-for="(image, i) in postDomain.photos" :src="image"
                                @click="onClick(i, postDomain.photos)" :key="`C-${i}`" onerror="this.style.display='none'" />
                            </div>
                            <div v-else class="p-20 col2">
                                <img class="images4" v-for="(image, i) in postDomain.photos.slice(0, 4)" :src="image"
                                @click="onClick(i, postDomain.photos)" :key="`D-${i}`" onerror="this.style.display='none'" />
                                <div v-if="postDomain.photos.length > 4" id="picmore" @click="onClick(3, postDomain.photos)"
                                onerror="this.style.display='none'">
                                +{{ postDomain.photos.length - 4 }}
                                </div>
                            </div>
                            </div>
                            <vue-gallery-slideshow :images="dataPhoto" :index="index"
                            @close="index = null"></vue-gallery-slideshow>
                        </div> -->
                        </b-col>
                        <b-col cols="12" lg="" class="px-0">
                            <div v-if="postDomain && postDomain.title" class="title-news text-left my-2">
                                {{ postDomain.title }}
                            </div>

                            <div id="txt-cmt" class="font-weight-normal" v-if="postDomain.full_text">
                                <div class="box-contents" style="scrollbar-width: thin;" 
                                    :style="{
                                    maxHeight: !postDomain.read && postDomain.full_text.length > 450 ? '200px' : 'none',
                                    overflowY: !postDomain.read && postDomain.full_text.length > 450 ? 'auto' : 'visible'
                                    }"
                                >
                                    <Highlighter class="my-highlight" :style="{
                                        textAlign: 'justify',
                                        fontSize: '17px',
                                        padding: '10px',
                                    }" highlightClassName="highlight2" :searchWords="highlightText(postDomain.full_text)"
                                        :autoEscape="true" :textToHighlight="postDomain.read
                                        ? postDomain.full_text.slice(0, 450)
                                        : postDomain.full_text
                                        " />
                                </div>
                                <div v-if="postDomain.full_text.length > 450" @click="postDomain.read = !postDomain.read"
                                    id="readmore" class="text-right">
                                    <span v-if="postDomain.read == true" >... อ่านต่อ</span>
                                    <span v-else>ย่อบทความ</span>
                                </div>
                            </div>
                        </b-col>
                    </b-row>
                    <div class="text-left ai-box mt-2"
                        v-if="postDomain && postDomain.photos_text && postDomain.photos_text.length"
                        style="font-size: 15px;font-weight: 500;">
                        <div v-for="(text, idx) in postDomain.photos_text">

                        <div v-if="text.face">
                            <span v-for="(face, idx) in text.face">
                            <span class="mr-2 mt-1">
                                <span style="background: #e5e5e5;
                            padding: 0px 6px;
                            border-radius: 13px;">
                                <b-icon icon="person-bounding-box" scale="1"></b-icon>
                                {{ face.person_name }}
                                <span v-b-tooltip.hover :title="'ค่า confidence'" class="small">({{
                                    parseFloat((face.confidence * 100).toFixed(2))
                                }}%)</span></span></span>
                            </span>
                        </div>
                        </div>
                    </div>
                    <div class="text-left ai-box mt-2" v-if="postDomain && postDomain.ocr && username == 'adminatapy'"
                        style="font-size: 15px;font-weight: 500;">
                        <div v-for="(text, idx) in postDomain.ocr">
                        <div v-if="text.text_sort && text.text_sort.length">
                            <b-avatar size="18px" style="font-size: 12px;background-color:#8b8787;" class="mr-1">{{ idx + 1 }}
                            </b-avatar>
                            <b-icon icon="textarea-t" scale="1.3"></b-icon> OCR :
                            {{ text.text_sort[0] }}
                        </div>
                        <div v-if="text.face">
                            <span v-for="(face, idx) in text.face">
                            <span v-if="face.confidence > 0.8" class="mr-2 mt-1">
                                <span style="background: #e5e5e5;
                                padding: 0px 6px;
                                border-radius: 13px;">
                                <b-icon icon="person-bounding-box" scale="1"></b-icon>
                                {{ face.person_name.replace("_", " ") }}
                                <span v-b-tooltip.hover :title="'ค่า confidence'" class="small">({{
                                    parseFloat((face.confidence * 100).toFixed(2))
                                }}%)</span></span></span>
                            </span>
                        </div>
                        </div>
                    </div>
                    <div v-if="
                        postDomain &&
                        postDomain.location &&
                        postDomain.location.length
                    " class="text-left ai-box mt-3 text-small " style="font-size: 13px;font-weight: 500; color: #2c3e50;">
                        <i class="fa fa-map-marker mr-1" aria-hidden="true" style="font-size: 15px;"></i>
                        <span v-for="(geo, k) in filterNumbers(postDomain.location)" :key="k" class="mr-1" style="border: 1px solid #2c3e505e  ;padding: 0px 5px;display: inline-flex;text-align: center;
                            border-radius: 33px;
                        ">
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
                    <div class="text-left ai-box mt-2" v-if="postDomain && postDomain.face_detect && username == 'adminatapy'"
                        style="font-size: 15px;font-weight: 500;">
                        <div v-if="postDomain.face_detect && postDomain.person_name && postDomain.person_name.length">
                        <span v-for="(face, idx) in postDomain.person_name" :key="idx">
                            <span class="mr-2 mt-1" v-if="face">
                            <span style="background: #e5e5e5;
                                    padding: 0px 6px;
                                    border-radius: 13px;">
                                <b-icon icon="person-bounding-box" scale="1"></b-icon>
                                {{ face }}
                            </span>
                            </span>
                        </span>
                        </div>
                    </div>
                    <template #footer>
                        <div class="text-left md-font" style="position: relative;">
                        <!------------- engages-------------- -->
                        <span v-b-tooltip.hover title="Engagement" v-if="postDomain.source == 'pantip'">
                            <span style="font-size:14px;">Engages </span>
                            {{
                            (postDomain.engagement + postDomain.comments_count)
                            | numFormat
                            }}
                        </span>

                        <span v-b-tooltip.hover title="Engagement" v-else>
                            <span style="font-size:14px;">Engages </span>{{ postDomain.engagement | numFormat }}
                        </span>

                        <span v-b-toggle="'btn' + page + k" id="box-reaction" v-b-tooltip.hover title="Comments">
                            <i class="fas fa-comment" :aria-expanded="visible ? 'true' : 'false'" style="cursor: pointer">
                            </i>
                            <span class="md-font" v-if="
                            postDomain.comments_count && postDomain.source == 'news'
                            ">
                            {{
                                postDomain.comments.comments.length | numFormat
                            }}&nbsp;
                            </span>
                            <span v-else class="md-font">
                            {{ postDomain.comments_count | numFormat }}&nbsp;</span>
                            <!-- <span  class="md-font" v-if="postDomain.comments_count==''&&postDomain.source == 'twitter'"> 0 </span> -->
                        </span>

                        <!-- twitter -->
                        <span v-if="
                            postDomain.source !== 'facebook' &&
                            postDomain.source !== 'youtube'
                        ">
                            <span v-if="
                            postDomain.retweets_count !== '0' &&
                            postDomain.retweets_count
                            " id="box-reaction" v-b-tooltip.hover title="Retweet">
                            <i class="fal fa-retweet"></i>
                            {{ postDomain.retweets_count | numFormat }}
                            </span>
                            <span v-if="
                            postDomain.likes_count !== '0' && postDomain.likes_count
                            " id="box-reaction" v-b-tooltip.hover title="Like">
                            <i class="fa fa-heart"></i>
                            {{ postDomain.likes_count | numFormat }}
                            </span>
                            <span v-if="
                            postDomain.shares_count !== '0' &&
                            postDomain.shares_count
                            " id="box-reaction" v-b-tooltip.hover title="Share">
                            <i class="fa fa-share"></i>
                            {{ postDomain.shares_count | numFormat }}
                            </span>
                            <span v-if="
                            postDomain.views_count !== '0' && postDomain.views_count
                            " id="box-reaction" v-b-tooltip.hover title="View">
                            <i class="fas fa-eye"></i>
                            {{ postDomain.views_count | numFormat }}
                            </span>
                        </span>
                        <!-- share blockdit -->
                        <!-- <span
                            v-if="
                            postDomain.source == 'blockdit' &&
                                postDomain.engagement !== '0'
                            "
                        >
                            <span id="box-reaction" v-b-tooltip.hover title="Share">
                            <i class="fa fa-share"></i>
                            <span class="md-font">
                                {{ postDomain.engagement | numFormat }}
                            </span>
                            </span>
                        </span> -->
                        <span v-if="
                            postDomain.likes_count !== '0' &&
                            postDomain.likes_count &&
                            postDomain.source == 'facebook'
                        " id="box-reaction" v-b-tooltip.hover title="Like">
                            <i class="far fa-thumbs-up" />
                            {{ postDomain.likes_count | numFormat }}
                        </span>
                        <!-- reaction-->
                        <span v-if="postDomain.reaction">
                            <span v-if="postDomain.reaction != ''">
                            <!-- pt -->
                            <span v-if="postDomain.reaction.Good">
                                <span v-if="postDomain.reaction.Good !== '0'" id="box-reaction" v-b-tooltip.hover
                                title="Good Content">
                                <i class="fa fa-plus"></i>
                                <span class="md-font">
                                    {{ postDomain.reaction.Good | numFormat }}
                                </span>
                                </span>
                            </span>
                            <span v-if="postDomain.reaction.Horror">
                                <span v-if="postDomain.reaction.Horror !== '0'" id="box-reaction" v-b-tooltip.hover
                                title="Horror">
                                <img v-if="postDomain.reaction.Horror !== '0'" src="@/assets/horror.png" id="emoji" />
                                <span class="md-font" v-if="postDomain.reaction.Horror !== '0'">
                                    {{ postDomain.reaction.Horror | numFormat }}
                                </span>
                                </span>
                            </span>
                            <!-- pt -->
                            <!-- fb -->

                            <span v-if="postDomain.reaction.Likes">
                                <span v-if="postDomain.reaction.Likes !== '0'" id="box-reaction" v-b-tooltip.hover title="Like">
                                <img v-if="postDomain.reaction.Likes !== '0'" src="@/assets/fb_like.png" id="emoji" />
                                <span class="md-font" v-if="postDomain.reaction.Likes !== '0'">
                                    {{ postDomain.reaction.Likes | numFormat }}
                                </span>
                                </span>
                            </span>

                            <span v-if="postDomain.reaction.like">
                                <span v-if="postDomain.reaction.like !== '0'" id="box-reaction" v-b-tooltip.hover title="Like">
                                <img v-if="postDomain.reaction.like !== '0'" src="@/assets/fb_like.png" id="emoji" />
                                <span class="md-font" v-if="postDomain.reaction.like !== '0'">
                                    {{ postDomain.reaction.like | numFormat }}
                                </span>
                                </span></span>

                            <span v-if="postDomain.reaction.shares">
                                <span v-if="postDomain.reaction.shares !== '0'" id="box-reaction" v-b-tooltip.hover
                                title="Share">
                                <i class="fa fa-share" v-if="postDomain.reaction.shares !== '0'"></i>
                                <span class="md-font" v-if="postDomain.reaction.shares !== '0'">
                                    {{ postDomain.reaction.shares | numFormat }}
                                </span>
                                </span>
                            </span>

                            <span v-if="postDomain.reaction.share">
                                <span v-if="postDomain.reaction.share !== '0'" id="box-reaction" v-b-tooltip.hover
                                title="Share">
                                <i class="fa fa-share" v-if="postDomain.reaction.share !== '0'"></i>
                                <span class="md-font" v-if="postDomain.reaction.share !== '0'">
                                    {{ postDomain.reaction.share | numFormat }}
                                </span>
                                </span>
                            </span>

                            <span v-if="postDomain.reaction.Love">
                                <span v-if="postDomain.reaction.Love !== '0'" id="box-reaction" v-b-tooltip.hover title="Love">
                                <img v-if="postDomain.reaction.Love !== '0'" src="@/assets/love.png" id="emoji" />
                                <span class="md-font" v-if="postDomain.reaction.Love !== '0'">
                                    {{ postDomain.reaction.Love | numFormat }}
                                </span>
                                </span>
                            </span>

                            <span v-if="postDomain.reaction.Wow">
                                <span v-if="postDomain.reaction.Wow !== '0'" id="box-reaction" v-b-tooltip.hover title="Wow">
                                <img v-if="postDomain.reaction.Wow !== '0'" src="@/assets/wow.png" id="emoji" />
                                <span class="md-font" v-if="postDomain.reaction.Wow !== '0'">
                                    {{ postDomain.reaction.Wow | numFormat }}
                                </span>
                                </span>
                            </span>

                            <span v-if="postDomain.reaction.Haha">
                                <span v-if="postDomain.reaction.Haha !== '0'" id="box-reaction" v-b-tooltip.hover title="Haha">
                                <img v-if="postDomain.reaction.Haha !== '0'" src="@/assets/haha.png" id="emoji" />
                                <span class="md-font" v-if="postDomain.reaction.Haha !== '0'">
                                    {{ postDomain.reaction.Haha | numFormat }}
                                </span>
                                </span>
                            </span>

                            <span v-if="postDomain.reaction.Sad">
                                <span v-if="postDomain.reaction.Sad !== '0'" id="box-reaction" v-b-tooltip.hover title="Sad">
                                <img v-if="postDomain.reaction.Sad !== '0'" src="@/assets/sad.png" id="emoji" />
                                <span class="md-font" v-if="postDomain.reaction.Sad !== '0'">
                                    {{ postDomain.reaction.Sad | numFormat }}
                                </span>
                                </span>
                            </span>

                            <span v-if="postDomain.reaction.Angry">
                                <span v-if="postDomain.reaction.Angry !== '0'" id="box-reaction" v-b-tooltip.hover
                                title="Angry">
                                <img v-if="postDomain.reaction.Angry !== '0'" src="@/assets/angry.png" id="emoji" />
                                <span class="md-font" v-if="postDomain.reaction.Angry !== '0'">
                                    {{ postDomain.reaction.Angry | numFormat }}
                                </span>
                                </span>
                            </span>
                            <span v-if="postDomain.reaction.Hug">
                                <span v-if="postDomain.reaction.Hug !== '0'" id="box-reaction" v-b-tooltip.hover title="Hug">
                                <img v-if="postDomain.reaction.Hug !== '0'" src="@/assets/hug.png" id="emoji" />
                                <span class="md-font" v-if="postDomain.reaction.Hug !== '0'">
                                    {{ postDomain.reaction.Hug | numFormat }}
                                </span>
                                </span>
                            </span>

                            <!-- yt -->
                            <span v-if="postDomain.reaction.view_count" v-b-tooltip.hover title="Views">
                                <span v-if="postDomain.reaction.view_count !== ''" id="box-reaction"><i class="fas fa-eye"></i>
                                <span class="md-font" v-if="postDomain.reaction.view_count !== ''">
                                    {{ postDomain.reaction.view_count | numFormat }}
                                </span>
                                </span>
                            </span>
                            <span v-if="postDomain.reaction.likes">
                                <span v-if="postDomain.reaction.likes !== '0'" id="box-reaction" v-b-tooltip.hover title="Like">
                                <img v-if="postDomain.reaction.likes !== '0'" /><i class="far fa-thumbs-up"></i>
                                <span class="md-font" v-if="postDomain.reaction.likes !== '0'">
                                    {{ postDomain.reaction.likes | numFormat }}
                                </span>
                                </span>
                            </span>

                            <span v-if="postDomain.reaction.dislikes">
                                <span v-if="postDomain.reaction.dislikes !== '0'" id="box-reaction" v-b-tooltip.hover
                                title="Dislike">
                                <i class="far fa-thumbs-down"></i>
                                <span class="md-font">
                                    {{ postDomain.reaction.dislikes | numFormat }}
                                </span>
                                </span>
                            </span>
                            <!-- end yt -->
                            </span>
                        </span>
                        <div class="float-right">
                            <span v-b-toggle="'ocr-text' + page + k" id="box-summarize" v-b-tooltip.hover title="OCR"
                            class=" btn-ocr"
                            v-if="postDomain && postDomain.photos_text && postDomain.photos_text[0] && postDomain.photos_text[0].text">
                            <img width="25" height="25" src="https://img.icons8.com/sf-regular/50/printed-ocr.png"
                                alt="printed-ocr" style="filter: brightness(0) invert(1);" />
                            <span class="md-font">
                                OCR
                            </span>
                            </span>
                            <span v-b-toggle="'summarize' + page + k" id="box-summarize" v-b-tooltip.hover
                            title="comments analysis" v-if="postDomain.summarize">
                            <img width="22" height="22" src="https://img.icons8.com/ios-filled/50/sparkling--v1.png"
                                alt="sparkling" style="filter: brightness(0) invert(1);" />
                            <span class="md-font">
                                Analysis
                            </span>
                            </span>
                        </div>
                        </div>

                        <b-collapse 
                        @shown="onShown('ocr-text' + page + k)"
                        @hidden="onHidden('ocr-text' + page + k)"
                        :id="'ocr-text' + page + k" class="mt-2" v-if="postDomain && postDomain.photos_text">
                        <b-card id="cmt-card" class="text-left" style="max-height: 300px;overflow-y: scroll;">
                            <div v-for="(text, idx) in postDomain.photos_text">

                            <div v-if="text && text.text && text.text.length">
                                <div class="bold my-2">
                                <img width="25" height="25" src="https://img.icons8.com/sf-regular/50/printed-ocr.png" />
                                OCR
                                </div>
                                <div class="mt-1 px-2 pb-3">

                                <div v-html="formatOCR(text.text)" class="rich"></div>
                                <!-- <div v-html="formatSummarize(postDomain.summarize)"></div> -->
                                </div>
                            </div>
                            </div>
                        </b-card>
                        </b-collapse>
                        
                        <b-collapse 
                        @shown="onShown('summarize' + page + k)"
                        @hidden="onHidden('summarize' + page + k)"
                        :id="'summarize' + page + k" class="mt-2"
                        v-if="postDomain.summarize && postDomain.summarize.length">
                        <b-card id="cmt-card" class="text-left" style="max-height: 300px;overflow-y: scroll;">
                            <div>
                                <div class="bold my-2">
                                    <img width="22" height="22" src="https://img.icons8.com/ios/50/sparkling.png" />
                                    Comments Analysis
                                </div>
                                <div v-if="postDomain.summarize_chart">
                                    <SummarizeCommentChart :series="handleSeries(postDomain.summarize_chart)"/>
                                </div>
                                <div v-html="formatSummarize(postDomain.summarize)"></div>
                            </div>
                        </b-card>
                        </b-collapse>
                        <!-- comment content -->
                        <b-collapse 
                        @shown="onShown('btn' + page + k)"
                        @hidden="onHidden('btn' + page + k)"
                        :id="'btn' + page + k" class="mt-2"
                        v-if="postDomain.comments && postDomain.comments.length">
                        <b-card id="cmt-card" class="text-left">
                            <span v-if="postDomain.source == 'news' && postDomain.comments">
                            <div v-for="(cmtn, inx) in postDomain.comments.comments" :key="inx">
                                <b-row>
                                <b-col lg="1">
                                    <img :src="cmtn.pictureUrl" id="img-cmt" @error="setAltImg"/>
                                </b-col>
                                <b-col lg="11">
                                    <div>
                                    <span class="bold">{{ cmtn.displayName }}</span>
                                    <span class="font-weight-light" id="cmt-time">
                                        {{cmtn.time}}
                                    </span>
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
                            <div v-for="(cmt, i) in postDomain.comments" :key="i">
                                <b-row>
                                <b-col lg="1">
                                    <a :href="'https://www.youtube.com/' + cmt.author_link
                                    " target="_blank" v-if="postDomain.source == 'youtube'">
                                    <img :src="cmt.photo" id="img-cmt" v-if="cmt.photo" />
                                    <b-avatar v-else loading="lazy" v-else style="height: 32px;"></b-avatar>

                                    </a>
                                    <a :href="cmt.url" target="_blank" v-else>
                                    <img :src="cmt.photo" id="img-cmt" v-bind:href="cmt.url" v-if="cmt.photo" />
                                    <b-avatar v-else loading="lazy" v-else style="height: 32px;"></b-avatar>
                                    </a>

                                    <!-- <img v-if="postDomain.source=='news'" :src="cmt.comments.pictureUrl" id="img-cmt"> -->
                                    <span> </span>
                                </b-col>
                                <b-col lg="11">
                                    <div>
                                    <a :href="'https://www.youtube.com/' + cmt.author_link
                                        " target="_blank" v-if="postDomain.source == 'youtube'">
                                        <span v-if="postDomain.source == 'youtube'" class="bold">
                                        {{ cmt.author }}</span></a>
                                    <a :href="cmt.url" target="_blank" v-else>
                                        <span class="bold"> {{ cmt.username }}</span></a>
                                    <span v-if="
                                        postDomain.source == 'youtube' && cmt.time
                                    " class="font-weight-light" id="cmt-time">{{ cmt.time.split("T")[0] }} |
                                        {{ cmt.time.split("T")[1] }}</span>
                                    <span v-else class="font-weight-light" id="cmt-time">{{ cmt.time }}</span>
                                    </div>

                                    <div v-if="postDomain.source == 'youtube'" class="font-weight-light">
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
            </b-col>
        <!-- </b-row> -->
         <b-button variant="warning" style="background-color: transparent;border: none;" 
            class="arrow-btn left" @click="prevCard">
            <i class="fa fa-chevron-left "></i>
        </b-button>
        <b-button variant="warning" style="background-color: transparent;border: none;" 
            class="arrow-btn right " @click="nextCard">
            <i class="fa fa-chevron-right "></i>
        </b-button>
        
      <!-- </span> -->
       <!-- new post card -->
        <!-- <PostCard :cards="getTopPostDomain"/> -->
    </div>
    <div v-else>
      <span> ไม่พบข้อมูล</span>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import VueGallerySlideshow from "vue-gallery-slideshow";
import { mapGetters } from "vuex";
import Highlighter from "vue-highlight-words";
import moment from "moment";
import provinces from "@/components/map/provinces.json";
import districts from "@/components/map/districts.json";
import subdistricts from "@/components/map/subdistricts.json";

import PostCard from './PostCard.vue';
import Swal from 'sweetalert2'
import SummarizeCommentChart from "../chart/SummarizeCommentChart.vue";
export default {
  components: { VueGallerySlideshow, Highlighter, SummarizeCommentChart, PostCard },
  props: {
    tpyeCard: {
      type: String,
    },
  },
  data() {
    return {
        visibleIndex: null,
        textToHighlight: "",
        accName: "",
        objId: "",
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
        andkey: [],
        arrword: [],
        myStyle: {
            backgroundColor: "#f7dca2",
        },
        checked: true,
        pageCheck: "",
        heightword: [],
        dataPost: null,
        sdate: "",
        edate: "",
        visible: false,
        index: null,
        dataPhoto: [],
        text: "",
        page: 0,
        imageLink: this.$hostname + "/static/Account/images/snapshot/",
        default_avatar: "user.svg",
        currentIndex: 0,
        nextIndex: 1,
        outIndex: null,
        touchStartX: 0, // เก็บจุดเริ่มสัมผัส
        touchEndX: 0 ,   // เก็บจุดปล่อยนิ้ว
        collapseStates: {} 
    };
  },
  computed: {
    ...mapGetters([
      "getDomain",
      "getLoadStatus",
      "getClickDomain",
      "getPostAllMonitor",
      "getProfileData",
      "getTopPostDomain",
      "getAllPostDomain",
      "getNamePlatform",
      "getDomainArr",
      "getClickDomainId"
    ]),
  },
    methods: {
        onShown(key) {
            this.$set(this.collapseStates, key, true)
        },
        onHidden(key) {
            this.$set(this.collapseStates, key, false)
        },
        closeAllCollapse() {
            Object.keys(this.collapseStates).forEach(key => {
            if (this.collapseStates[key] === true) {
                this.$root.$emit('bv::toggle::collapse', key) // ปิดเฉพาะที่เปิดอยู่
            }
            })
        },
        handleTouchStart(e) {
            this.touchStartX = e.changedTouches[0].screenX;
        },
        handleTouchEnd(e) {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        },
        handleSwipe() {
            const swipeDistance = this.touchEndX - this.touchStartX;

            if (swipeDistance > 50) {
            // เลื่อนขวา → ไปการ์ดก่อนหน้า
            this.prevCard();
            } else if (swipeDistance < -50) {
            // เลื่อนซ้าย → ไปการ์ดถัดไป
            this.nextCard();
            }
        },
        setCurrent(index) {
            if (index === this.currentIndex) return;
            this.outIndex = this.currentIndex;
            this.currentIndex = index;
            this.nextIndex = (this.currentIndex + 1) % this.getTopPostDomain.length;
            setTimeout(() => (this.outIndex = null), 600);
        },
        nextCard() {
            this.closeAllCollapse();
            const newIndex = (this.currentIndex + 1) % this.getTopPostDomain.length;
            this.setCurrent(newIndex);
        },
        prevCard() {
            this.closeAllCollapse();
            const newIndex =
                (this.currentIndex - 1 + this.getTopPostDomain.length) % this.getTopPostDomain.length;
            this.setCurrent(newIndex);
        },
    toggleShow(i) {
      this.visibleIndex = this.visibleIndex === i ? null : i;
    },
    handleSeries(objData) {
      const keys = ["agree", "disagree", "neutral"];
        let obj = {}
      if (objData) {
          obj = objData;
      } else {
          // สุ่มค่าเริ่มต้น
          let arr = Array.from({ length: keys.length }, () => Math.random());
    
    
          // ผลรวมทั้งหมด
          const sum = arr.reduce((a, b) => a + b, 0);
    
          // แปลงเป็นเปอร์เซนต์รวม 100
          arr = arr.map(x => +(x / sum * 100).toFixed(1));
    
          // ปรับตัวสุดท้ายให้รวมเท่ากับ 100
          const total = arr.reduce((a, b) => a + b, 0);
          arr[arr.length - 1] += +(100 - total).toFixed(1);
    
          // สร้าง object ()
          obj = {
            agree: arr[0],
            disagree: arr[1],
            neutral: arr[2]
          };
      }
      console.log(obj);
      // return array ตามลำดับ [agree, disagree, neutral]
      return [obj.agree, obj.disagree, obj.neutral];
    },
    formatOCR(text) {
      if (!text) return ''
      let s = String(text).trim()

      // 1) แปลง backslash-newline ให้เป็น newline จริง
      //    ครอบคลุมทั้ง \\r\\n, \\n, \\r
      s = s.replace(/\\r\\n|\\n|\\r/g, '\n')
  
      // 2) เคลียร์อักขระแปลกจาก OCR ที่ทำให้หัวข้อพัง
      s = s.replace(/\u200B|\uFEFF|\u00A0/g, ' ')

      // 3) ปรับ bullet จาก OCR ให้เป็น Markdown มาตรฐาน
      s = s.replace(/^\s*[•▪●–—-]\s+/gm, '- ')

      // 4) แปลง Markdown → HTML
      const rawHtml = marked.parse(s, { gfm: true, breaks: true })

      // 5) sanitize
      return DOMPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: [
          // 'h1','h2','h3','h4','h5','h6',
          'p', 'br', 'ul', 'ol', 'li',
          'strong', 'em', 'a', 'blockquote',
          'code', 'pre', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
        ],
        ALLOWED_ATTR: { a: ['href', 'title', 'target', 'rel'] }
      })
    }
    ,
    formatSummarize(text) {
      // console.log('text', text);

      if (!text) return '';
      // this.getChartLable(text);
      const paragraphs = text.split(/\n\n+/).map(p =>
        `<p style="margin: 0 0 6px; line-height: 1.4;">${p.replace(/\n/g, '<br>')}</p>`
      );
      return paragraphs.join('');
    },
 filterNumbers(numbers) {
      // ✅ PRE-PROCESS
      const filtered = [
        ...new Set(
          (numbers || [])
            .map(n => String(n).trim())
            // ❌ ตัด 7 หลักทิ้ง
            .filter(s => /^\d+$/.test(s) && s.length !== 7)
        )
      ].sort((a, b) => a.length - b.length);

      // ✅ LOGIC เดิม
      for (let i = 0; i < filtered.length; i++) {
        for (let j = i + 1; j < filtered.length; j++) {
          const num1 = filtered[i];
          const num2 = filtered[j];

          // If num1 matches the start of num2, remove num1
          if (num2.startsWith(num1)) {
            filtered.splice(i, 1);
            i--;
            break;
          }
        }
      }

      return filtered;
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
    getTheSelected(k, v, uid) {
        console.log("getTheSelected ===== ", k, v, uid);
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
            .then(function (response) {
              console.log(response);

              if (v == 1) {
                _this.getTopPostDomain[k].sentiment = 1;
                _this.getTopPostDomain[k].user_sentiment[_this.objId] = 1;
              } else if (v == 0) {
                _this.getTopPostDomain[k].sentiment = 0;
                _this.getTopPostDomain[k].user_sentiment[_this.objId] = 0;
              } else {
                _this.getTopPostDomain[k].sentiment = -1;
                _this.getTopPostDomain[k].user_sentiment[_this.objId] = -1;
              }
            })
            .catch(function (response) {
              console.log("errrrrrr", response.message);
            });
        }
      ).catch(() => {
          // ผู้ใช้กด Cancel
            Swal.fire({
                title: 'ยกเลิก',
                text: 'ยกเลิกการบันทึกข้อมูลเรียบร้อย',
                icon: 'error',
                timer: 1000,             // ปิดอัตโนมัติหลัง 1 วินาที
                showConfirmButton: false  // ไม่แสดงปุ่มยืนยัน
            });
            console.log("ผู้ใช้ยกเลิกการเปลี่ยนแปลง sentiment");
        });
    },
    highlightText(full_text) {
      var word = [];
      if (this.checked) {
        word.push(...this.heightword);
        if (this.andkey.length) {
          this.andkey.forEach(function (key) {

            if (
              key.length == 2 &&
              full_text.includes(key[0]) &&
              full_text.includes(key[1])
            ) {


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


        }
      }
      return word;
    },
    setAltImg(event) {
      event.target.src = this.default_avatar;
    },
    onClick(i, data) {
      console.log(data);
      this.index = i;
      this.dataPhoto = data;
    },
  },
  destroyed() {
    this.$store.commit("setTopPostDomain", "");
  },
  async created() {
    this.username = localStorage.getItem("username");
    this.objId = localStorage.getItem("objId");
    this.sdate =
      moment(new Date())
        .format()
        .slice(0, 10) + "T00:00:00";
    this.edate =
      moment(new Date())
        .format()
        .slice(0, 10) + "T23:59:59";
    if (this.$route.name == "Domain") {
      this.$store.dispatch("fetchTopPostDomain", {
        start_date: this.sdate,
        end_date: this.edate,
        // source: "twitter",
        // sentiment: this.status,
        sort_by: "engagement",
        offset: 0,
        domain: this.getClickDomainId,
      });
    } else {
      this.$store.commit("setTopPostDomain", "");
      this.$store.dispatch("fetchPostDomain", {
        start_date: this.sdate,
        end_date: this.edate,
        source: this.getNamePlatform,
        // sentiment: this.status,
        sort_by: "engagement",
        offset: 0,
        // domain: "All",
        // dashboard: true,
      });
    }

    if (this.$route.name === "Domain") {
      this.pageCheck = this.$route.name;
      await this.axios
        .get(
          "https://api2.cognizata.com/api/v2/object/check_sentiment_word?domain_id=" +
          this.getClickDomainId
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
  },
};
</script>

<style scoped>
.fixed-img-big {
  /* width: 100%; */
  width: 200px; 
  height: 200px;
  object-fit: cover; /* ครอบเต็มกรอบโดยไม่บิดภาพ */
}

.fixed-img-small {
  width: 100px; /* กำหนดความกว้างคงที่ */
  height: 200px; /* ครึ่งหนึ่งของภาพใหญ่ หรือปรับตามต้องการ */
  object-fit: cover;
}
.card-header {
    background-color: white;
    /* border-bottom: none;
    padding-bottom: 0;  */
    border-top-right-radius: 20px !important;
    border-top-left-radius: 20px !important;
}

/* ปุ่มลูกศร */
.arrow-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
    font-size: 20px;
    width: 40px;
    height: 40px;
    padding: 0;
    z-index: 5;
}
.arrow-btn:hover {
    background-color: #f7dca2 !important; /* สีตอน hover */
    cursor: pointer;
}
.arrow-btn.left {
    left: -20px;
}

.arrow-btn.right {
    right: -20px;
}

/* การ์ด */
.custom-card {
    position: relative;
    width: 100%;
    /* max-width: 600px; */
    /* height: 400px; */
    margin: auto;
    perspective: 1000px;
}

.custom-card .b-collapse {
    max-height: none;
    overflow: visible;
}
/* การ์ดที่เป็น current */
.card--current {
    z-index: 3;
    transform: translateY(0) scale(1);
}

/* การ์ดถัดไป */
.card--next {
    position: absolute;
    z-index: 2;
    transform: translateY(20px) scale(0.95);
    opacity: 0;
}

/* การ์ดที่ออก */
.card--out {
    position: absolute;
    z-index: 1;
    transform: translateY(-100%) rotate(-10deg);
    opacity: 0;
}
.rich .p {
  margin: 0 0 6px;
  line-height: 1.4;
}

.summary-text {
  line-height: 1.4;
  /* ลดจากปกติ (1.6–1.8) */
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

.box-hl {
  border-radius: 10px;
}

.highlight2 {
  background-color: #f7dca2;
  padding: 0 2px;
}

.badge-light {
  color: #5e666d;
  background-color: #ddddddad !important;
  font-weight: bold;
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

.btn-grad {
  background-image: linear-gradient(to right, #2b5876 0%, #4e4376 51%, #2b5876 100%)
}

.btn-grad {
  margin: 10px;
  padding: 15px 45px;
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  display: block;
}

.btn-grad:hover {
  background-position: right center;
  /* change the direction of the change here */
  color: #fff;
  text-decoration: none;
}


#box-summarize {
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  /* background-image: linear-gradient(to right, #7cccb8 0%, #1185c9  51%, #4b9ed4  100%); */
  background-image: linear-gradient(to right, #56a7b6 0%, #6d5fa0 51%, #4b9ed4 100%);
  border-radius: 12px;
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 3px;
  padding-bottom: 3px;
  margin-left: 4px;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  position: relative;
  top: -3px;
}

#box-summarize:hover {
  background-image: linear-gradient(to right, #d8cb16 0%, #8474be 70%, #2b5876 100%);
  background-position: right center;
  color: #fff;
  text-decoration: none;
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

.tab-content>.active {
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
  min-height: 13rem;
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

#content>div>div>div.col-lg-9 {
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

#photo-grid {
  width: 100%;
}

@media only screen and (min-width: 0px) and (max-width: 990px) {
  .num {
    text-align: end;
    position: relative;
    top: 13px;
  }

  .mb-4,
  .my-4 {
    margin-bottom: 0 !important;
  }
  .fixed-img-big{
    width: 100%; 
    height: 200px;
  }
}

@media only screen and (min-width: 0px) and (max-width: 760px) {
    .btn-ocr {
    right: 100px !important;
    top: -52px !important;
  }

  #box-summarize {
    /* display: grid;
   width: 50px;
   height: 50px; */
    float: none !important;
    text-align: right !important;
    width: fit-content;
    position: absolute;
    right: -8px;
    top: -50px;
    /* border-radius: 50%; */
    /* border: 2px solid #fff; */
    box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
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
