<template>
    <div  class="">
        <vue-element-loading 
            :active="getLoadPostTab" class="h-100" size="80" 
            background-color="rgba(255, 255, 255, 0.3)"
            color="#b6ac9a" 
        />

        
        <div id="total-post" class="pt-5">
            <!-- header  -->
            <div class="col-12 px-0 h6 text-left">
                <div class="row m-0 align-content-center">
                    <div class="col-auto pl-0"> 
                        <img v-if="source == 'twitter'" src="@/assets/Twitter.png"
                            class="social-imgs" />
                        <img v-if="source == 'facebook'" src="@/assets/Facebook.png" class="social-imgs" />
                        <img v-if="source == 'pantip'" src="@/assets/board.png" class="social-imgs" />
                        <img v-if="source == 'blockdit'" src="@/assets/Blockdit.png" class="social-imgs" />
                        <img v-if="source == 'instagram'" src="@/assets/Instagram.png" class="social-imgs" />
                        <img v-if="source == 'youtube'" src="@/assets/Youtube.png" class="social-imgs" />
                        <img v-if="source == 'news'" src="@/assets/News.png" class="social-imgs" />
                        <img v-if="source == 'tiktok'" src="@/assets/Tiktok.png" class="social-imgs" />
                        <img v-if="source == 'threads'" src="@/assets/Threads.png" class="social-imgs" />
                        <b-avatar text="All" size="35" style="background-color: #fed16e;"
                            v-if="source == 'all'"></b-avatar>
                    </div>
                    <div class="col pl-0 ">
                        <div v-if="keyWord">
                            <span v-if="keyWord == ''">All</span>
                            <span v-else>{{ keyWord }}</span>
                            <span style="color: #4c412d;" class="px-2">({{ total | numFormat }})</span>
                            <i @click="resetKeyWord" style="cursor: pointer;" class="fa fa-close text-danger cursor-pointer"></i>
                        </div>
                        <!-- <div v-else-if="tabTitle == 'hashtagTab'">
                            <span v-if="keyWord == ''"> All</span>
                            <span v-else>#{{ keyWord }}</span>
                        </div> -->
                        <div v-else class="h-100">
                            <span>โพสต์ทั้งหมด</span>
                            <span style="color: #4c412d;" class="px-2">({{ total | numFormat }})</span>
                        </div>
                    </div>
                    <div class="col-12 col-sm-auto col-md-4 mt-3 mt-sm-0 px-0 text-right d-flex">
                        <!-- วันที่ : {{ start }} - {{ end }} -->
                        <b-form-select 
                            v-if="this.$route.query.type === 'hashtaglist'" 
                            class="mr-3" id="source-select" 
                            v-model="source" :options="sourceOptions"
                            @change="exportSource"
                        ></b-form-select>
                        <date-picker
                            v-model="valueDate"
                            type="date"
                            range
                            placeholder="เลือกช่วงเวลา"
                            size="sm"
                            :disabled-date="(date) => date >= new Date()"
                            value-type="format"
                            format="YYYY-MM-DD"
                            @change="checkDateRange()"
                            id="date-domain"
                            class="w-100">
                            {{ valueDate }}
                        </date-picker>
                    </div>
                </div>
                <hr />
            </div>
            <!-- filter -->
            <b-form-group label="" v-slot="{ ariaDescribedby }">
                <b-row>
                    <b-col sm="12" md="" class="">
                        <b-form-radio-group v-model="selected" :options="options" :aria-describedby="ariaDescribedby"
                        name="radio-inline" class="mt-1 mb-2 text-left"></b-form-radio-group>
                    </b-col>
                    <b-col sm="12" md="4" class="text-right pl-0 pr-2">
                        <b-form-select v-model="selectedSort" :options="optionSort" size="sm" style="height: 34px;" class=""
                        ></b-form-select>
                    </b-col>
                </b-row>
            </b-form-group>
            <!-- time line -->
            <!-- <b-col cols="12" class="p-0">
                <b-row class="m-0">
                    <span>Timeline </span>
                    <b-col cols="12" class="px-0">
                        <Timeline :timelineItems="posts"/>
                    </b-col>
                </b-row>
            </b-col> -->
            
            <!-- card post -->
             <div v-if="posts.length !== 0">
                <div v-for="(post,index) in posts" :key="'post- '+ index"  class="col-12 mb-4 px-0">
                    <b-card header="Light" footer="Light" header-tag="header" footer-tag="footer">
                        <!-- card header  -->
                        <template #header>
                            <div class="row">
                                <div class="col-auto">
                                    <b-avatar v-if="post.profile_image" :src="post.profile_image" size="3rem"></b-avatar>
                                    <b-avatar v-else src="https://placekitten.com/300/300" size="3rem"></b-avatar>
                                    <span class="left">
                                        <img v-if="post.source == 'twitter'" src="@/assets/Twitter.png"
                                            class="social-img" />
                                        <img v-if="post.source == 'facebook'" src="@/assets/Facebook.png"
                                            class="social-img" />
                                        <img v-if="post.source == 'news'" src="@/assets/News.png" class="social-img" />
                                        <img v-if="post.source == 'pantip'" src="@/assets/Pantip.png"
                                            class="social-img" />
                                        <img v-if="post.source == 'instagram'" src="@/assets/Instagram.png"
                                            class="social-img" />
                                        <img v-if="post.source == 'youtube'" src="@/assets/Youtube.png"
                                            class="social-img" />
                                        <img v-if="post.source == 'blockdit'" src="@/assets/Blockdit.png"
                                            class="social-img" />
                                        <img v-if="post.source == 'tiktok'" src="@/assets/Tiktok.png"
                                            class="social-img" />
                                        <img v-if="post.source == 'threads'" src="@/assets/Threads.png"
                                            class="social-img" />
                                    </span>
                                </div>
                                <div class="col-12 col-sm">
                                    <div class="d-flex align-center">
                                        <span class="h6 font-weight-bold pr-2">{{ post.account_name }}</span>
                                        <a v-bind:href="post.url_post" class="fa fa-external-link text-info" target="_blank"></a>
                                    </div>
                                    <div class="text-left font-weight-light small" v-if="post.date">
                                        {{ post.date.split("T")[0] }} |
                                        {{ post.date.split("T")[1] }}
                                    </div>
                                </div>
                                <div class="col-auto">
                                    <SentimentButton :sentiment="post.sentiment"/>
                                </div>
                            </div>
                        </template>
        
                        <!-- card body  -->
                        <b-card-text>
                            <p v-if="post.full_text" class="text-left" style="font-size: 16px;">
                                <span  :class="{'truncate-text-3': !post.showAll}">
                                    {{ post.full_text }}
                                </span>
                                <span v-if="post.full_text.length > 450 && !post.showAll" @click="post.showAll = true" style="cursor: pointer;" class="text-info ">อ่านต่อ</span>
                                <span v-if="post.full_text.length > 450 && post.showAll" @click="post.showAll = false" style="cursor: pointer;" class="text-info ">ย่อบทความ</span>
                            </p>
        
                            <!-- image  -->
                            <div v-if="post.photos && post.source !== 'tiktok'" class="mb-4">
                                <div >
                                    <div v-if="post.photos.length == 1" class="p-20">
                                    <img class="images1" v-for="(image, i) in post.photos" :src="image"
                                        @click="openGallery(i, post.photos)" :key="`images1-${i}`" />
                                    </div>
        
                                    <div v-else-if="post.photos.length == 2" class="p-20">
                                        <img class="images2" v-for="(image, i) in post.photos" :src="image"
                                            @click="openGallery(i, post.photos)" :key="`ฺB-${i}`" onerror="this.style.display='none'" />
                                    </div>
                                    <div v-else-if="post.photos.length == 3" class="p-20">
                                    <img class="images3" v-for="(image, i) in post.photos" :src="image"
                                        @click="openGallery(i, post.photos)" :key="`C-${i}`" onerror="this.style.display='none'" />
                                    </div>
                                    <div v-else class="position-relative p-20 col2">
                                        <div v-for="(image, i) in post.photos.slice(0, 4)" :key="`D-${i}`" class="position-relative ">
                                            <img
                                            class="images4"
                                            :src="image"
                                            @click="openGallery(i, post.photos)"
                                            @error="hideOnError($event)"
                                        />
        
                                        <div
                                            v-if="i === 3 && post.photos.length > 4"
                                            class="overlay-more"
                                            @click="openGallery(3, post.photos)"
                                        >
                                            +{{ post.photos.length - 4 }}
                                        </div>
                                        </div>
                                    </div>
                                    <!-- <div v-else class="p-20 col2">
                                        <img class="images4" v-for="(image, i) in post.photos.slice(0, 4)" :src="image"
                                            @click="onClick(i, post.photos)" :key="`D-${i}`" onerror="this.style.display='none'" />
                                    <div
                                            v-if="i === 3 && post.photos.length > 4"
                                            class="overlay-more"
                                            @click="openGallery(3, post.photos)"
                                            >
                                            +{{ post.photos.length - 4 }}
                                        </div>
                                    </div> -->
                                </div>
                                <VueGallerySlideshow v-if="dataPhoto.length !== 0" :images="dataPhoto" :index="index" @close="closeGallery()"/>
                            </div>
                        </b-card-text>
                        
                        <!-- domain tags  -->
                        <div class="text-left">
                            <span style="font-size: small;" v-if="filterDomain(post.domain).length !== 0">
                                domain tags :
                            </span>
                            <span v-for="(name, i) in filterDomain(post.domain)" :key="i" class="mx-1 py-2">
                                <b-badge pill variant="light" style="color: #2c3e50;
                                background-color: #ddddddad !important;">
                                {{ name }}
                                </b-badge>
                            </span>
                        </div>
                        <!-- card footer  -->
                        <template #footer>
                            <div class="text-left md-font">
                                <span v-b-tooltip.hover title="Engagement" v-if="post.source == 'pantip'">
                                    <span style="font-size:14px;">Engages </span>
                                    {{ (post.engagement + post.comments_count)| numFormat }}
                                </span>
        
                                <!-- engagement -->
                                <span v-b-tooltip.hover title="Engagement" v-else>
                                    <span style="font-size:14px;">Engages </span>{{ post.engagement | numFormat }}
                                </span>
        
                                <!-- comments -->
                                <!-- <b-badge variant="light" style="font-size: 14px;color: #2c3e50; background-color: #ddddddad !important;"> -->
                                    <span v-b-toggle="'btn'+ post._id" id="box-reaction" v-b-tooltip.hover title="Comments">
                                
                                        <i class="fas fa-comment mr-2" :aria-expanded="visible ? 'true' : 'false'" style="cursor: pointer"></i>
                            
                                        <span class="md-font " v-if="post.comments_count && post.source == 'news'">
                                            {{ post.comments.comments.length | numFormat }}&nbsp;
                                        </span>
                                        <span v-else class="md-font">{{ post.comments_count | numFormat }}&nbsp;</span>
                                    </span>
                                <!-- </b-badge> -->
                                <span v-if="post.source == 'facebook'" class="px-1 ml-2" id="box-reaction">
                                    <i class="far fa-thumbs-up" />
                                    <span v-if="post.likes_count !== '0' && post.likes_count" v-b-tooltip.hover title="Like">
                                            
                                            {{ post.likes_count | numFormat }}
                                    </span>
                                    <span v-else>
                                        0
                                    </span>
                                </span>
        
                                <!-- twitter -->
                                <span v-if="
                                post.source !== 'facebook' &&
                                post.source !== 'youtube'
                                ">
                                <span v-if="
                                    post.retweets_count !== '0' &&
                                    post.retweets_count
                                " id="box-reaction" v-b-tooltip.hover title="Retweet">
                                    <i class="fal fa-retweet"></i>
                                    {{ post.retweets_count | numFormat }}
                                </span>
                                <span v-if="
                                    post.likes_count !== '0' && post.likes_count
                                " id="box-reaction" v-b-tooltip.hover title="Like">
                                    <i class="fa fa-heart"></i>
                                    {{ post.likes_count | numFormat }}
                                </span>
                                <span v-if="
                                    post.shares_count !== '0' && post.shares_count
                                " id="box-reaction" v-b-tooltip.hover title="Share">
                                    <i class="fa fa-share"></i>
                                    {{ post.shares_count | numFormat }}
                                </span>
                                <span v-if="
                                    post.views_count !== '0' && post.views_count
                                " id="box-reaction" v-b-tooltip.hover title="View">
                                    <i class="fas fa-eye"></i>
                                    {{ post.views_count | numFormat }}
                                </span>
                                </span>
                                <!-- reaction-->
                                <span v-if="post.reaction">
                                <span v-if="post.reaction != ''">
                                    <!-- pt -->
                                    <span v-if="post.reaction.Good">
                                    <span v-if="post.reaction.Good !== '0'" id="box-reaction" v-b-tooltip.hover
                                        title="Good Content">
                                        <i class="fa fa-plus"></i>
                                        <span class="md-font">
                                        {{ post.reaction.Good | numFormat }}
                                        </span>
                                    </span>
                                    </span>
                                    <span v-if="post.reaction.Horror">
                                    <span v-if="post.reaction.Horror !== '0'" id="box-reaction" v-b-tooltip.hover title="Horror">
                                        <img v-if="post.reaction.Horror !== '0'" src="@/assets/horror.png" id="emoji" />
                                        <span class="md-font" v-if="post.reaction.Horror !== '0'">
                                        {{ post.reaction.Horror | numFormat }}
                                        </span>
                                    </span>
                                    </span>
                                    <!-- pt -->
                                    <!-- fb -->
        
                                    <span v-if="post.reaction.Likes">
                                        <span v-if="post.reaction.Likes !== '0'" id="box-reaction" v-b-tooltip.hover title="Like">
                                            <img v-if="post.reaction.Likes !== '0'" src="@/assets/fb_like.png" id="emoji" />
                                            <span class="md-font" v-if="post.reaction.Likes !== '0'">
                                            {{ post.reaction.Likes | numFormat }}
                                            </span>
                                        </span>
                                    </span>
        
                                    <span v-if="post.reaction.like">
                                        <span v-if="post.reaction.like !== '0'" id="box-reaction" v-b-tooltip.hover title="Like">
                                            <img v-if="post.reaction.like !== '0'" src="@/assets/fb_like.png" id="emoji" />
                                            <span class="md-font" v-if="post.reaction.like !== '0'">
                                            {{ post.reaction.like | numFormat }}
                                            </span>
                                        </span>
                                    </span>
        
                                    <span v-if="post.reaction.share">
                                    <span v-if="post.reaction.share !== '0'" id="box-reaction" v-b-tooltip.hover title="Share">
                                        <i class="fa fa-share" v-if="post.reaction.share !== '0'"></i>
                                        <span class="md-font" v-if="post.reaction.share !== '0'">
                                        {{ post.reaction.share | numFormat }}
                                        </span>
                                    </span>
                                    </span>
        
                                    <span v-if="post.reaction.shares">
                                    <span v-if="post.reaction.shares !== '0'" id="box-reaction" v-b-tooltip.hover title="Share">
                                        <i class="fa fa-share" v-if="post.reaction.shares !== '0'"></i>
                                        <span class="md-font" v-if="post.reaction.shares !== '0'">
                                        {{ post.reaction.shares | numFormat }}
                                        </span>
                                    </span>
                                    </span>
        
                                    <span v-if="post.reaction.Love">
                                    <span v-if="post.reaction.Love !== '0'" id="box-reaction" v-b-tooltip.hover title="Love">
                                        <img v-if="post.reaction.Love !== '0'" src="@/assets/love.png" id="emoji" />
                                        <span class="md-font" v-if="post.reaction.Love !== '0'">
                                        {{ post.reaction.Love | numFormat }}
                                        </span>
                                    </span>
                                    </span>
        
                                    <span v-if="post.reaction.Wow">
                                    <span v-if="post.reaction.Wow !== '0'" id="box-reaction" v-b-tooltip.hover title="Wow">
                                        <img v-if="post.reaction.Wow !== '0'" src="@/assets/wow.png" id="emoji" />
                                        <span class="md-font" v-if="post.reaction.Wow !== '0'">
                                        {{ post.reaction.Wow | numFormat }}
                                        </span>
                                    </span>
                                    </span>
        
                                    <span v-if="post.reaction.Haha">
                                    <span v-if="post.reaction.Haha !== '0'" id="box-reaction" v-b-tooltip.hover title="Haha">
                                        <img v-if="post.reaction.Haha !== '0'" src="@/assets/haha.png" id="emoji" />
                                        <span class="md-font" v-if="post.reaction.Haha !== '0'">
                                        {{ post.reaction.Haha | numFormat }}
                                        </span>
                                    </span>
                                    </span>
        
                                    <span v-if="post.reaction.Sad">
                                    <span v-if="post.reaction.Sad !== '0'" id="box-reaction" v-b-tooltip.hover title="Sad">
                                        <img v-if="post.reaction.Sad !== '0'" src="@/assets/sad.png" id="emoji" />
                                        <span class="md-font" v-if="post.reaction.Sad !== '0'">
                                        {{ post.reaction.Sad | numFormat }}
                                        </span>
                                    </span>
                                    </span>
        
                                    <span v-if="post.reaction.Angry">
                                    <span v-if="post.reaction.Angry !== '0'" id="box-reaction" v-b-tooltip.hover title="Angry">
                                        <img v-if="post.reaction.Angry !== '0'" src="@/assets/angry.png" id="emoji" />
                                        <span class="md-font" v-if="post.reaction.Angry !== '0'">
                                        {{ post.reaction.Angry | numFormat }}
                                        </span>
                                    </span>
                                    </span>
                                    <span v-if="post.reaction.Hug">
                                    <span v-if="post.reaction.Hug !== '0'" id="box-reaction" v-b-tooltip.hover title="Hug">
                                        <img v-if="post.reaction.Hug !== '0'" src="@/assets/hug.png" id="emoji" />
                                        <span class="md-font" v-if="post.reaction.Hug !== '0'">
                                        {{ post.reaction.Hug | numFormat }}
                                        </span>
                                    </span>
                                    </span>
        
                                    <!-- yt -->
                                    <span v-if="post.reaction.view_count" v-b-tooltip.hover title="Views">
                                    <span v-if="post.reaction.view_count !== ''" id="box-reaction"><i class="fas fa-eye"></i>
                                        <span class="md-font" v-if="post.reaction.view_count !== ''">
                                        {{ post.reaction.view_count | numFormat }}
                                        </span>
                                    </span>
                                    </span>
                                    <span v-if="post.reaction.likes">
                                    <span v-if="post.reaction.likes !== '0'" id="box-reaction" v-b-tooltip.hover title="Like">
                                        <img v-if="post.reaction.likes !== '0'" /><i class="far fa-thumbs-up"></i>
                                        <span class="md-font" v-if="post.reaction.likes !== '0'">
                                        {{ post.reaction.likes | numFormat }}
                                        </span>
                                    </span>
                                    </span>
        
                                    <span v-if="post.reaction.dislikes">
                                    <span v-if="post.reaction.dislikes !== '0'" id="box-reaction" v-b-tooltip.hover
                                        title="Dislike">
                                        <i class="far fa-thumbs-down"></i>
                                        <span class="md-font">
                                        {{ post.reaction.dislikes | numFormat }}
                                        </span>
                                    </span>
                                    </span>
                                    <!-- end yt -->
                                </span>
                                </span>
                            </div>
        
        
                            <!-- comment content -->
                            <b-collapse :id="'btn'+ post._id" class="mt-2" v-if="post.comments && post.comments.length">
                                <b-card id="cmt-card" class="text-left">
                                <span v-if="post.source == 'news' && post.comments">
                                    <div v-for="(cmtn, inx) in post.comments.comments" :key="inx">
                                    <b-row>
                                        <b-col lg="1">
                                        <img :src="cmtn.pictureUrl" id="img-cmt" @error="setAltImg" />
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
                                    <div v-for="(cmt, i) in post.comments" :key="i">
                                    <b-row>
                                        <b-col lg="1">
                                            <a :href="'https://www.youtube.com/' + cmt.author_link" target="_blank"
                                                v-if="post.source == 'youtube'">
                                                <img :src="cmt.photo" id="img-cmt" v-if="cmt.photo" />
                                                <b-avatar v-else loading="lazy" v-else style="height: 32px;"></b-avatar>
                                            </a>
                                            <a :href="cmt.url" target="_blank" v-else>
                                                <img :src="cmt.photo" id="img-cmt" v-bind:href="cmt.url" v-if="cmt.photo" />
                                                <b-avatar v-else loading="lazy" v-else style="height: 32px;"></b-avatar>
                                            </a>
        
                                            <span> </span>
                                        </b-col>
                                        <b-col lg="11">
                                        <div>
                                            <a :href="'https://www.youtube.com/' + cmt.author_link" target="_blank"
                                            v-if="post.source == 'youtube'">
                                            <span v-if="post.source == 'youtube'" class="bold">
                                                {{ cmt.author }}</span></a>
                                            <a :href="cmt.url" target="_blank" v-else>
                                            <span class="bold text-info"> {{ cmt.username }}</span></a>
                                            <span v-if="post.source == 'youtube' && cmt.time" class="font-weight-light"
                                            id="cmt-time">{{ cmt.time.split("T")[0] }} |
                                            {{ cmt.time.split("T")[1] }}</span>
                                            <span v-else class="font-weight-light" id="cmt-time">{{
                                            cmt.time
                                            }}</span>
                                        </div>
        
                                        <div v-if="post.source == 'youtube'" class="font-weight-light">
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
                </div>
            </div>
            <div v-if="posts.length === 0 && !getLoadPostTab" style="min-height: 200px;" class="align-content-center text-secondary">
                ไม่มีรายการโพสต์
            </div>
        </div>

        <b-pagination 
            v-model="currentPage"
            :total-rows="totalRows" 
            :per-page="perPage" 
            align="center" class="my-2"
            @input="onPageChange" 
        />
    </div>
</template>
<script>

// import Highlighter from "vue-highlight-words";
// import VueGallerySlideshow from "vue-gallery-slideshow";
import moment from "moment";
import SentimentButton from "./_SentimentButton.vue";
import VueGallerySlideshow from "vue-gallery-slideshow";
// import "@justinribeiro/lite-tiktok";
import { debounce } from 'lodash';
// import Timeline from "../_Timeline.vue";
export default {
    components: {
        SentimentButton,
        VueGallerySlideshow,
        // Highlighter,
        // Timeline
    },
    props: {
        source: {
            type: String,
            default: null
        },
        start: {
            type: String,
            default: null
        },  
        end: {
            type: String,
            default: null
        }, 
        tabTitle: {
            type: String,
            default: null
        },
        keyWord: {
            type: String,
            default: ''
        },
        isBottom: {
            type: Boolean,
            default: false
        },
        topDomain: {
            type: Array,
            // required: true,
            default: () => [] // ✅ ทั้ง type และ default เป็น Array
        },
        // keyWord: {
        //     type: String,
        //     default:""
        // }
    },
    
    data() {
        // const today = moment();
        // const past7Days = moment().subtract(6, 'days'); // รวมวันนี้ = 7 วัน
        return {
            currentPage: 1,
            totalRows:0,
            perPage:10,
            offset: 0,
            platform: null,
            getLoadPostTab: false,
            selected: null,
            selectedSort: "",
            valueDate: this.startAndEnd,
            // valueDate: [past7Days.format('YYYY-MM-DD'), today.format('YYYY-MM-DD')],
            // start_date: "",
            // end_date: "",
            dataPost: [],
            total: null,
            posts: [],
            index: null,
            dataPhoto: [],
            visible: false,
            options: [
                { text: "Positive", value: 1 },
                { text: "Neutral", value: 0 },
                { text: "Negative", value: -1 },
                { text: "ทั้งหมด", value: null },
            ],
            optionSort: [
                { value: "", text: " โพสต์ล่าสุด" },
                { value: "descend", text: "โพสต์เริ่มต้น" },
                { value: "engagement", text: "Engagement" },
            ],
            sourceOptions: [
                { value: 'all', text: 'All Platform' },
                { value: 'facebook', text: 'Facebook' },
                { value: 'twitter', text: 'X' },
                { value: 'pantip', text: 'Board' },
                { value: 'news', text: 'News' },
                { value: 'youtube', text: 'YouTube' },
                { value: 'instagram', text: 'Instagram' },
                { value: 'blockdit', text: 'Blockdit' },
                { value: 'tiktok', text: 'Tiktok' },
                { value: 'threads', text: 'Threads' }
            ]
        };
    },
    computed: {
        startAndEnd() {
            // if (!this.start || !this.end) return [null, null]; // ป้องกัน undefined
            // console.log("startAndEnd in tab post");
            
            return [this.start, this.end];
        }
    },
    created() {
        this.valueDate = [this.start, this.end]
        // this.checkDateRange();
        // this.apiUserPosts()
    },
    methods: {
        exportSource() {
            this.$emit('update-source',this.source )
        },
        onPageChange(){
            console.log("current page : ", this.currentPage);
            this.offset = (this.currentPage - 1) * 10
            this.apiUserPosts()

            // Scroll ไปที่ element id="total-post"
            this.$nextTick(() => {
                const el = document.getElementById('total-post');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                }
            });
        },
        resetKeyWord() {
            this.keyWord = ""
            this.apiUserPosts()
        },
        filterDomain(post_domain) {
            if (!this.topDomain || this.topDomain.length === 0) {
                return post_domain;
            }
            const topDomainNames = this.topDomain.map(d => d.t_domain);
            // console.log("topDomainNames === ", topDomainNames);
            
            let filter = post_domain.filter(domain => topDomainNames.includes(domain));
            // console.log(filter);
            
            return filter;
        },
        openGallery(i, data) {
            // console.log("openGallery ==== ",data);
            // console.log("index ==== ",i);
            this.index = i;
            this.dataPhoto = data;
        },
        closeGallery() {
            this.index = null;
            this.dataPhoto = [];
        },
        checkDateRange() {
            const startDate = moment(this.valueDate[0]);
            const endDate = moment(this.valueDate[1]);

            const diffDays = endDate.diff(startDate, 'days');

            if (diffDays > 31) {
                alert('กรุณาเลือกช่วงเวลาที่ไม่เกิน 1 เดือน หรือ 31 วัน');
                this.valueDate[1] = startDate.add(31, 'days').format('YYYY-MM-DD');
            }else{
                this.selectDate(); // Call your existing method
                // this.apiUserPosts();
            }
        },
        selectDate() {
            // console.log(this.valueDate[0], this.valueDate[1]);
            if (this.valueDate.length == 0) {
                this.start = "";
                this.end = "";
            } else {
                this.start = this.valueDate[0] ;
                this.end = this.valueDate[1];
                this.$emit('update:start', this.valueDate[0]);
                this.$emit('update:end', this.valueDate[1]);
               
            }
            this.$store.commit("setSDateProfile", this.start);
            this.$store.commit("setEDateProfile", this.end);
            this.$store.commit("setArrDateProfile", this.valueDate);
        },
       
        apiUserPosts() {
            console.log('apiUserPosts called');

            const isHashtagList = this.$route.query.type === 'hashtaglist';
            this.getLoadPostTab = true;
            const targetApi = 'https://api2.cognizata.com/api/v2/userposts/getSentimentdetail/';
            const hashtagApi = 'https://api2.cognizata.com/api/v2/userposts/getSentimentDetailDomain/';
            const config = {
                method: "get",
                url: isHashtagList ? hashtagApi : targetApi,
                //url: "https://api.cognizata.com/api/v1/getsentimentdetail/",
                params: {
                    // account: this.$route.query.uid,
                    ...(isHashtagList ? { hashtags: this.$route.query.uid } : { account: this.$route.query.uid }),
                     ...(this.source !== 'all' ? { source: this.source } : {}), // ✅ ลบ key ถ้า source = 'all'
                    // source: this.$route.query.source,
                    ...(this.keyWord ? { query: this.keyWord } : {}), // ✅ ใส่ query เฉพาะเมื่อมีค่า
                    sort_by: this.selectedSort,
                    sentiment: this.selected,
                    offset: this.offset,
                    start_date: this.start+ "T00:00:00",
                    end_date:this.end + "T23:59:59"
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            this.axios(config)
            .then((response) => {
                // console.log(response);
                
                const newData = response.data?.data || [];
                this.total = response.data?.count || 0;
                this.totalRows = response.data?.count || 0;
                this.getLoadPostTab = false;

                // กรองเอาโพสต์ใหม่ที่ยังไม่มีใน this.posts
                const existingIds = this.posts.map(post => post._id); // สมมุติว่าใช้ _id เป็นตัวระบุ
                const filteredNewPosts = newData.filter(post => !existingIds.includes(post._id));
                if (response.data.has_next) {
                    this.offset = response.data.next_offset
                }
                // เพิ่ม showAll = false แล้วรวมกับ posts เดิม
                const newPostsWithFlag = newData.map(post => ({
                    ...post,
                    showAll: false,
                }));

                // this.posts = [...this.posts, ...newPostsWithFlag];
                this.posts =  newPostsWithFlag;
                this.$emit('totalPost', this.total);
            })
            .catch((error) => {
                this.getLoadPostTab = false;
                this.posts = [];
                // console.error(error);
            });
        },  
    },
    mounted() {
        this.platform = this.source; 
        if (this.$route.query.type !== 'targetlist') {
            this.valueDate = [this.start, this.end];
            this.selectDate();
            this.apiUserPosts();
        }
    },
    watch: {
        source: {
            handler(newVal, oldVal) {
            const isTargetList = this.$route.query.type === 'targetlist'

            if (isTargetList) {
                // ✅ ถ้าเป็น targetlist → ห้ามว่าง
                if (newVal && oldVal) {
                    this.apiUserPosts()
                }
            } else {
                console.log('hashtag case');
                
                // ✅ กรณีปกติ เหมือนเดิม
                if (newVal !== oldVal || oldVal === undefined) {
                    this.apiUserPosts()
                }
            }
            },
            // immediate: true // หรือใช้เงื่อนไขเหมือนด้านบนก็ได้
        },
        startAndEnd: {
            handler([newStart, newEnd], [oldStart, oldEnd]) {
                // if (newStart !== oldStart && newEnd !== oldEnd) {
                //     console.log("watch startAndEnd old tab post : ", oldStart, oldEnd);
                //     console.log("watch startAndEnd new tab post : ", newStart, newEnd);
                //     // this.checkDateRange();
                // }
                this.valueDate = [newStart, newEnd];
                this.apiUserPosts();
            },
            immediate: true
        },
        keyWord(newVal) {
            if (newVal) {
                this.offset = 0
                this.currentPage = 1
                this.apiUserPosts()
            }
        },
        selectedSort(newVal,oldVal) {
            if (newVal !== oldVal) {
                this.offset = 0
                this.currentPage = 1
                this.apiUserPosts()
            }
        },
        selected(newVal,oldVal) {
            if (newVal !== oldVal) {
                this.offset = 0
                this.currentPage = 1
                this.apiUserPosts()
            }
        }

    },

};
</script>
<style scoped>
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

.social-imgs {
    width: 35px;
}
.col2 {
  column-count: 2;
  /* width: 85%; */
  width: 504px;
  margin: auto;
}
.test-scroll {
    max-height: 530px;
    overflow-y: auto;
    position: relative;
}
.left{
    position: absolute;
    bottom: 0px;
    left: 50px;
    /* top: 90px; */
}
.social-img {
    width: 30px;
}
.truncate-text-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.img-grid {
  width: 100%;
  height: 350px;
  object-fit: cover;
}

.images1 {
    width: 504px;
    /* width: 100%; */
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
  /* width: 253.5px; */
  width: 100%;
  height: 142px;
  object-fit: cover;
  background-size: contain;
  cursor: pointer;
  margin: 2px;
  border-radius: 16px;
  border: 1px solid #eaeff3;
}
.overlay-more {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 100%;
    height: 142px;
    border-radius: 16px;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    font-weight: bold;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* border-radius: 5px; */
    cursor: pointer;
}
/* xs */
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
  .overlay-more{
    width: 100%;
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
@media only screen and (min-width: 761px) and (max-width: 1200px) {
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
    width: 100%;
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
