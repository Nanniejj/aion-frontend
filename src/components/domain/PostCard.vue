<template>
    <b-col cols="12" class="mt-4 text-center">
        <div class="cards">
            <!-- การ์ด -->
            <b-card v-for="(postDomain, k) in cards" :key="k" 
                class="custom-card" :class="{
                    'card--current': currentIndex === k,
                    'card--next': nextIndex === k,
                    'card--out': outIndex === k
                }" 
                
            >
                <template #header v-if="postDomain">
                    <b-row>
                        <b-col class="align-start pr-0 col-lg-auto w-auto" sm="auto" lg="auto">
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
                            <b-avatar
                                class="mr-2"
                                :variant="postDomain.sentiment === 1 ? 'success' : 'secondary'"
                                icon="emoji-smile"
                                size="34"
                            />
                            <b-avatar
                                class="mr-2"
                                :variant="postDomain.sentiment === 0 ? 'primary' : 'secondary'"
                                icon="emoji-neutral"
                                size="34"
                            />
                            <b-avatar
                                :variant="postDomain.sentiment === -1 ? 'danger' : 'secondary'"
                                icon="emoji-frown"
                                size="34"
                            />
                        </b-col>
                    </b-row>
                </template>

                <template #footer>
                    <b-row>
                        <b-col class="text-left" cols="6">
                            <b-icon icon="chat-left-text" class="mr-1"></b-icon>{{ postDomain.comment_count || 0 }}
                            <b-icon icon="hand-thumbs-up" class="mx-3"></b-icon>{{ postDomain.like_count || 0 }}
                            <b-icon icon="arrow-repeat" class="mr-1"></b-icon>{{ postDomain.share_count || 0 }}
                        </b-col>
                        <!-- <b-col class="text-right" cols="6">
                            <b-icon icon="eye" class="mr-1"></b-icon>{{ postDomain.view_count || 0 }}
                        </b-col> -->
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
