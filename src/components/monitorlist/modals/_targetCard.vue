<template>
    <b-card bg-variant="white" text-variant=""
        class="h-100 border-0" body-class="p-2"
        style="border-radius:30px"
    >
        <b-card-text class="h-100">
            <!-- <b-row class="m-0 justify-content-end">
                <i class="fa fa-close text-danger" @click="deleteTarget(target)" style="font-size:14px;cursor: pointer;"></i>
            </b-row> -->
            <b-row class="m-0 flex-nowrap h-100">
                <b-col cols="auto" class="p-2">
                    <b-avatar :src="target.profile_image" v-if="target && target.profile_image">
                    </b-avatar>
                    <b-avatar :src="target.profile_image" v-else> </b-avatar>
                    <b-col class="p-0 text-right">
                    <b-avatar class="position-absolute" style="top: -20px;left: -10px;" size="25px" :src="target.image">
                        <img @click="openLink(target.link_original)" v-if="target.source == 'facebook'" src="@/assets/Facebook.png" class="platform-imgs" />
                        <img @click="openLink(target.link_original)" v-if="target.source == 'twitter'" src="@/assets/Twitter.png" class="platform-imgs" />
                        <img @click="openLink(target.link_original)" v-if="target.source == 'pantip'" src="@/assets/board.png" class="platform-imgs" />
                        <img @click="openLink(target.link_original)" v-if="target.source == 'blockdit'" src="@/assets/Blockdit.png" class="platform-imgs" />
                        <img @click="openLink(target.link_original)" v-if="target.source == 'instagram'" src="@/assets/Instagram.png" class="platform-imgs" />
                        <img @click="openLink(target.link_original)" v-if="target.source == 'youtube'" src="@/assets/Youtube.png" class="platform-imgs" />
                        <img @click="openLink(target.link_original)" v-if="target.source == 'news'" src="@/assets/News.png" class="platform-imgs" />
                        <img @click="openLink(target.link_original)" v-if="target.source == 'tiktok'" src="@/assets/Tiktok.png" class="platform-imgs" />
                        <img @click="openLink(target.link_original)" v-if="target.source == 'threads'" src="@/assets/Threads.png" class="platform-imgs" />
                    </b-avatar>
                </b-col>
                </b-col>
                <b-col class="text-left px-2 w-50">
                    <!-- <b-row class="m-0"> -->
                        <span>{{ target.name || target.uid }}</span>
                        <!-- {{ target.source }} -->

                    <!-- </b-row> -->
                    <a class="text-truncate text-info d-block" 
                        href="#" 
                        @click.prevent="openLink(target.link_crawl)">
                        {{ target.link_crawl || target.url}}
                    </a>
                </b-col>
                <b-col cols="auto" class="p-0 text-right">
                    <b-row cols="1" class="m-0 h-100 justify-content-end">
                        <b-col align-self="center" v-if="showDeleteButton" class="px-2 py-0">
                            <i 
                                v-b-tooltip.hover
                                title="ลบสมาชิกนี้"  
                                class="fa fa-close text-danger" 
                                @click="deletedTarget()" 
                                style="font-size:24px;cursor: pointer;"
                            ></i>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-card-text>
    </b-card>
</template>
<script>
export default {
    props: {
        target: {
            type: Object,
            default: () => {}
        },
        showDeleteButton: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        deletedTarget() {
            this.$emit('delete-target')
        },
        openLink(url) {
            if (!url) return;
            // ถ้าไม่มี http/https ให้เติม http:// ให้ก่อน
            if (!/^https?:\/\//i.test(url)) {
                url = 'https://' + url;
            }

            // เปิดลิงก์ในแท็บใหม่ และป้องกัน window.opener
            window.open(url, '_blank', 'noopener,noreferrer');
        },
    }
}
</script>
<style scoped>
    .platform-imgs {
        width:25px;
    }   
</style>