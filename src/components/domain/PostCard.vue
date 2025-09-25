<template>
    <b-col cols="12" class="mt-4 text-center">
        <div class="cards">
            <!-- การ์ด -->
            <b-card v-for="(postDomain, k) in cards" :key="k" 
            class="custom-card" 
            :class="{
                'card--current': currentIndex === k,
                'card--next': nextIndex === k,
                'card--out': outIndex === k
            }">
                <template #header v-if="postDomain">
                    <b-row>
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
                        <b-col class="align-start px-2 px-md-3 w-auto" sm="8" lg="auto">
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
                        <b-col class="text-md-right" sm="12" lg="" md="">
                            <button
                                class="btn p-0 border-0 bg-transparent"
                                @click="getTheSelected(k, 1, postDomain.uid)"
                                >
                            <b-avatar button class="mr-2" :variant="postDomain.sentiment === 1 ? 'success' : 'secondary'"
                                icon="emoji-smile" size="34" @click="getTheSelected(k, 1, postDomain.uid)" />
                            </button>
                            <button>
                                <b-avatar button class="mr-2" :variant="postDomain.sentiment === 0 ? 'primary' : 'secondary'"
                                icon="emoji-neutral" size="34" @click="getTheSelected(k, 0, postDomain.uid)" />
                            </button>
                            <button>
                                <b-avatar button :variant="postDomain.sentiment === -1 ? 'danger' : 'secondary'" icon="emoji-frown"
                                size="34" @click="getTheSelected(k, -1, postDomain.uid)" />
                            </button>
                        </b-col>
                    </b-row>
                </template>

                <template #footer>
                    <b-row class="">
                        <b-col class="text-left md-font" style="position: relative;">
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
                                <i class="fas fa-comment" :aria-expanded="visible ? 'true' : 'false'"
                                    style="cursor: pointer">
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
                                        <span v-if="postDomain.reaction.Good !== '0'" id="box-reaction"
                                            v-b-tooltip.hover title="Good Content">
                                            <i class="fa fa-plus"></i>
                                            <span class="md-font">
                                                {{ postDomain.reaction.Good | numFormat }}
                                            </span>
                                        </span>
                                    </span>
                                    <span v-if="postDomain.reaction.Horror">
                                        <span v-if="postDomain.reaction.Horror !== '0'" id="box-reaction"
                                            v-b-tooltip.hover title="Horror">
                                            <img v-if="postDomain.reaction.Horror !== '0'" src="@/assets/horror.png"
                                                id="emoji" />
                                            <span class="md-font" v-if="postDomain.reaction.Horror !== '0'">
                                                {{ postDomain.reaction.Horror | numFormat }}
                                            </span>
                                        </span>
                                    </span>
                                    <!-- pt -->
                                    <!-- fb -->

                                    <span v-if="postDomain.reaction.Likes">
                                        <span v-if="postDomain.reaction.Likes !== '0'" id="box-reaction"
                                            v-b-tooltip.hover title="Like">
                                            <img v-if="postDomain.reaction.Likes !== '0'" src="@/assets/fb_like.png"
                                                id="emoji" />
                                            <span class="md-font" v-if="postDomain.reaction.Likes !== '0'">
                                                {{ postDomain.reaction.Likes | numFormat }}
                                            </span>
                                        </span>
                                    </span>

                                    <span v-if="postDomain.reaction.like">
                                        <span v-if="postDomain.reaction.like !== '0'" id="box-reaction"
                                            v-b-tooltip.hover title="Like">
                                            <img v-if="postDomain.reaction.like !== '0'" src="@/assets/fb_like.png"
                                                id="emoji" />
                                            <span class="md-font" v-if="postDomain.reaction.like !== '0'">
                                                {{ postDomain.reaction.like | numFormat }}
                                            </span>
                                        </span></span>

                                    <span v-if="postDomain.reaction.shares">
                                        <span v-if="postDomain.reaction.shares !== '0'" id="box-reaction"
                                            v-b-tooltip.hover title="Share">
                                            <i class="fa fa-share" v-if="postDomain.reaction.shares !== '0'"></i>
                                            <span class="md-font" v-if="postDomain.reaction.shares !== '0'">
                                                {{ postDomain.reaction.shares | numFormat }}
                                            </span>
                                        </span>
                                    </span>

                                    <span v-if="postDomain.reaction.share">
                                        <span v-if="postDomain.reaction.share !== '0'" id="box-reaction"
                                            v-b-tooltip.hover title="Share">
                                            <i class="fa fa-share" v-if="postDomain.reaction.share !== '0'"></i>
                                            <span class="md-font" v-if="postDomain.reaction.share !== '0'">
                                                {{ postDomain.reaction.share | numFormat }}
                                            </span>
                                        </span>
                                    </span>

                                    <span v-if="postDomain.reaction.Love">
                                        <span v-if="postDomain.reaction.Love !== '0'" id="box-reaction"
                                            v-b-tooltip.hover title="Love">
                                            <img v-if="postDomain.reaction.Love !== '0'" src="@/assets/love.png"
                                                id="emoji" />
                                            <span class="md-font" v-if="postDomain.reaction.Love !== '0'">
                                                {{ postDomain.reaction.Love | numFormat }}
                                            </span>
                                        </span>
                                    </span>

                                    <span v-if="postDomain.reaction.Wow">
                                        <span v-if="postDomain.reaction.Wow !== '0'" id="box-reaction" v-b-tooltip.hover
                                            title="Wow">
                                            <img v-if="postDomain.reaction.Wow !== '0'" src="@/assets/wow.png"
                                                id="emoji" />
                                            <span class="md-font" v-if="postDomain.reaction.Wow !== '0'">
                                                {{ postDomain.reaction.Wow | numFormat }}
                                            </span>
                                        </span>
                                    </span>

                                    <span v-if="postDomain.reaction.Haha">
                                        <span v-if="postDomain.reaction.Haha !== '0'" id="box-reaction"
                                            v-b-tooltip.hover title="Haha">
                                            <img v-if="postDomain.reaction.Haha !== '0'" src="@/assets/haha.png"
                                                id="emoji" />
                                            <span class="md-font" v-if="postDomain.reaction.Haha !== '0'">
                                                {{ postDomain.reaction.Haha | numFormat }}
                                            </span>
                                        </span>
                                    </span>

                                    <span v-if="postDomain.reaction.Sad">
                                        <span v-if="postDomain.reaction.Sad !== '0'" id="box-reaction" v-b-tooltip.hover
                                            title="Sad">
                                            <img v-if="postDomain.reaction.Sad !== '0'" src="@/assets/sad.png"
                                                id="emoji" />
                                            <span class="md-font" v-if="postDomain.reaction.Sad !== '0'">
                                                {{ postDomain.reaction.Sad | numFormat }}
                                            </span>
                                        </span>
                                    </span>

                                    <span v-if="postDomain.reaction.Angry">
                                        <span v-if="postDomain.reaction.Angry !== '0'" id="box-reaction"
                                            v-b-tooltip.hover title="Angry">
                                            <img v-if="postDomain.reaction.Angry !== '0'" src="@/assets/angry.png"
                                                id="emoji" />
                                            <span class="md-font" v-if="postDomain.reaction.Angry !== '0'">
                                                {{ postDomain.reaction.Angry | numFormat }}
                                            </span>
                                        </span>
                                    </span>
                                    <span v-if="postDomain.reaction.Hug">
                                        <span v-if="postDomain.reaction.Hug !== '0'" id="box-reaction" v-b-tooltip.hover
                                            title="Hug">
                                            <img v-if="postDomain.reaction.Hug !== '0'" src="@/assets/hug.png"
                                                id="emoji" />
                                            <span class="md-font" v-if="postDomain.reaction.Hug !== '0'">
                                                {{ postDomain.reaction.Hug | numFormat }}
                                            </span>
                                        </span>
                                    </span>

                                    <!-- yt -->
                                    <span v-if="postDomain.reaction.view_count" v-b-tooltip.hover title="Views">
                                        <span v-if="postDomain.reaction.view_count !== ''" id="box-reaction"><i
                                                class="fas fa-eye"></i>
                                            <span class="md-font" v-if="postDomain.reaction.view_count !== ''">
                                                {{ postDomain.reaction.view_count | numFormat }}
                                            </span>
                                        </span>
                                    </span>
                                    <span v-if="postDomain.reaction.likes">
                                        <span v-if="postDomain.reaction.likes !== '0'" id="box-reaction"
                                            v-b-tooltip.hover title="Like">
                                            <img v-if="postDomain.reaction.likes !== '0'" /><i
                                                class="far fa-thumbs-up"></i>
                                            <span class="md-font" v-if="postDomain.reaction.likes !== '0'">
                                                {{ postDomain.reaction.likes | numFormat }}
                                            </span>
                                        </span>
                                    </span>

                                    <span v-if="postDomain.reaction.dislikes">
                                        <span v-if="postDomain.reaction.dislikes !== '0'" id="box-reaction"
                                            v-b-tooltip.hover title="Dislike">
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
                                <span v-b-toggle="'ocr-text' + page + k" id="box-summarize" v-b-tooltip.hover
                                    title="OCR" class=" btn-ocr"
                                    v-if="postDomain && postDomain.photos_text && postDomain.photos_text[0] && postDomain.photos_text[0].text">
                                    <img width="25" height="25"
                                        src="https://img.icons8.com/sf-regular/50/printed-ocr.png" alt="printed-ocr"
                                        style="filter: brightness(0) invert(1);" />
                                    <span class="md-font">
                                        OCR
                                    </span>
                                </span>
                                <span v-b-toggle="'summarize' + page + k" id="box-summarize" v-b-tooltip.hover
                                    title="comments analysis" v-if="postDomain.summarize">
                                    <img width="22" height="22"
                                        src="https://img.icons8.com/ios-filled/50/sparkling--v1.png" alt="sparkling"
                                        style="filter: brightness(0) invert(1);" />
                                    <span class="md-font">
                                        Analysis
                                    </span>
                                </span>
                            </div>
                        </b-col>
                    </b-row>
                </template>
            </b-card>

            <!-- ปุ่มซ้าย -->
            <b-button variant="warning" style="background-color: #fed16e;" class="arrow-btn left" @click="prevCard">
                ‹
            </b-button>

            <!-- ปุ่มขวา -->
            <b-button variant="warning" style="background-color: #fed16e;" class="arrow-btn right" @click="nextCard">
                ›
            </b-button>
        </div>
    </b-col>
</template>

<script>
export default {
    name: "CommentCardsWithArrows",
    props: {
        cards: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            // cards: [
            //     { title: "Comment Card 1", text: "ข้อความการ์ดที่ 1" },
            //     { title: "Comment Card 2", text: "ข้อความการ์ดที่ 2" },
            //     { title: "Comment Card 3", text: "ข้อความการ์ดที่ 3" },
            //     { title: "Comment Card 4", text: "ข้อความการ์ดที่ 4" }
            // ],
            currentIndex: 0,
            nextIndex: 1,
            outIndex: null
        };
    },
    methods: {
        setCurrent(index) {
            if (index === this.currentIndex) return;
            this.outIndex = this.currentIndex;
            this.currentIndex = index;
            this.nextIndex = (this.currentIndex + 1) % this.cards.length;
            setTimeout(() => (this.outIndex = null), 600);
        },
        nextCard() {
            const newIndex = (this.currentIndex + 1) % this.cards.length;
            this.setCurrent(newIndex);
        },
        prevCard() {
            const newIndex =
                (this.currentIndex - 1 + this.cards.length) % this.cards.length;
            this.setCurrent(newIndex);
        }
    }
};
</script>

<style>
.social-img {
    width: 35px;
    /* margin-top: -5px; */
    margin-left: -8px;
}

.cards {
    position: relative;
    /* width: 320px;
    margin: auto; */
    height: 300px;
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

.arrow-btn.left {
    left: -20px;
}

.arrow-btn.right {
    right: -20px;
}

/* การ์ด */
.custom-card {
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: pointer;
    transition: transform 0.6s, opacity 0.6s;
    border-radius: 20px;
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%);
}

/* การ์ดที่เป็น current */
.card--current {
    z-index: 3;
    transform: translateY(0) scale(1);
}

/* การ์ดถัดไป */
.card--next {
    z-index: 2;
    /* transform: translateY(20px) scale(0.95); */
    opacity: 0.9;
}

/* การ์ดที่ออก */
.card--out {
    z-index: 1;
    transform: translateY(-100%) rotate(-10deg);
    opacity: 0;
}
</style>
