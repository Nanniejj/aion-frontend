<template>
    <div class="my-3">
        <div v-if="timelineItems.length" class="timeline-container" >

            <!-- เส้นตรงกลาง -->
            <div class="timeline-line"></div>

            <div v-for="(item, index) in timelineItems" :key="index" class="timeline-item pt-3"
                :class="index % 2 === 0 ? 'left' : 'right'">

                <!-- จุด -->
                <div class="timeline-dot" :class="'bg-info'" v-b-tooltip.hover="'engagement: ' + (item.engagement ? item.engagement.toLocaleString() : '0')"
                >
                <!-- :style="{
                    width: dotSize(item.engagement) + 'px',
                    height: dotSize(item.engagement) + 'px',
                    top: dotSize(item.engagement) > 25 ? '-10px' : '0px',
                    right: index % 2 === 0 ? '-' + (dotSize(item.engagement) / 2) + 'px' : 'auto',
                    left: index % 2 === 1 ? '-' + (dotSize(item.engagement) / 2) + 'px' : 'auto'
                }" -->
                    <i class='fas fa-chart-line'></i>
                    <div>
                        {{ formatNumber(item.engagement) }}
                    </div>
                </div>
                <!-- วันที่ + เวลา -->
                <!-- <hr class=""> -->
                <b-row :class="index % 2 === 0 ? 'justify-content-md-end' : ''" class=" m-0 px-0 pb-2" style="font-size: 18px;">
                    <b-col cols="auto" class="date-bg align-self-end" style="width: fit-content;">
                        <i class='fas fa-calendar-day'></i>
                        <span>
                            {{ formatDate(item.date) }}
                        </span>
                    </b-col>
                </b-row>
                <!-- card -->
                <b-card class="timeline-card" 
                    header-class="d-flex align-items-center p-2"
                    body-class="p-1"
                    footer-class="p-2 timeline-footer"
                    header-bg-variant="transparent" 
                    :class="{
                        'no-top-right-radius': index % 2 === 0,
                        'no-top-left-radius': index % 2 === 1
                    }"
                    style="min-height: 200px;"
                >
                    <template #header>
                        <!-- <b-row v-if="type === 'group' " class="m-0 align-items-center">
                            <b-col cols="auto" class="p-0 text-left">
                                <b-avatar v-bind:href="item.account_url" size="45px" :src="item.image">
                                    <img v-if="item.profile_image"  :src="item.profile_image" class="platform-imgs" />
                                    
                                </b-avatar>
                            </b-col>
                            <b-col class="mb-0 text-info text-left">
                                <a class="d-flex align-items-center text-info justify-content-center mx-1" v-bind:href="item.url_post" target="_blank"> 
                                    {{ item.account_name }}
                                    <i class="fa fa-external-link mx-1"/>
                                </a> 
                            </b-col>
                        </b-row> -->
                        <b-row class="m-0 align-items-center">
                            <b-col cols="auto" class="p-0 text-left">
                                <b-avatar v-bind:href="item.account_url" class="" size="45px" :src="item.profile_image">
                                </b-avatar>
                                <img v-if="item.source == 'facebook'" src="@/assets/Facebook.png" class="platform-imgs" />
                                <img v-if="item.source == 'twitter'" src="@/assets/Twitter.png" class="platform-imgs" />
                                <img v-if="item.source == 'pantip'" src="@/assets/board.png" class="platform-imgs" />
                                <img v-if="item.source == 'blockdit'" src="@/assets/Blockdit.png" class="platform-imgs" />
                                <img v-if="item.source == 'instagram'" src="@/assets/Instagram.png" class="platform-imgs" />
                                <img v-if="item.source == 'youtube'" src="@/assets/Youtube.png" class="platform-imgs" />
                                <img v-if="item.source == 'news'" src="@/assets/News.png" class="platform-imgs" />
                                <img v-if="item.source == 'tiktok'" src="@/assets/Tiktok.png" class="platform-imgs" />
                                <img v-if="item.source == 'threads'" src="@/assets/Threads.png" class="platform-imgs" />
                            </b-col>
                            <b-col class="mb-0 text-info text-left">
                                <!-- <a v-bind:href="item.account_url" class="text-info">
                                </a> -->
                                <a class="d-flex align-items-center text-info justify-content-center mx-1" v-bind:href="item.url_post" target="_blank"> 
                                    {{ item.account_name }}
                                    <i class="fa fa-external-link mx-1"/>
                                </a> 
                            </b-col>
                        </b-row>
                        <!-- <b-button v-if="!isThai(item.full_text)" 
                            class="zigzag-btn p-2"  
                            @click="translateToThai(item.full_text)" size="sm">
                           <img width="25" height="25" src="https://img.icons8.com/?size=100&id=ISUnogtpbXDv&format=png" />
                            
                        </b-button> -->
                        
                        <!-- <b-icon :icon="item.icon" font-scale="1.5" class="mr-2"></b-icon> -->
                    </template>
                    <b-card-text class="p-1">
                        <p v-if="item.full_text" class="text-left" style="font-size: 16px;">
                            <!-- <span>
                                {{ item.showAll ? item.full_text : item.full_text.substring(0, 200) }}
                            </span> -->
                            <span>
                                <Highlighter
                                class="my-highlight md-font"
                                highlightClassName="highlight2"
                                :searchWords="keywordArray"
                                :autoEscape="true"
                                :textToHighlight="item.showAll ? item.full_text.replace('...___...','').replace('.#.##.', '') : item.full_text.replace('...___...','').replace('.#.##.', '').substring(0, 200)"
                                />
                            </span>
                            <span 
                                v-if="item.full_text.length > 200 && !item.showAll" 
                                @click="item.showAll = true" 
                                style="cursor: pointer;" 
                                class="text-info"
                            >
                                ...อ่านต่อ
                            </span>
                            <br />
                            <span 
                                v-if="item.full_text.length > 200 && item.showAll" 
                                @click="item.showAll = false" 
                                style="cursor: pointer;" 
                                class="text-info"
                            >
                                ย่อบทความ
                            </span>
                        </p>
                        <div v-if="item.photos && item.photos.length && item.source !=='tiktok'" class="d-block d-md-none text-center">
                            <img class="item-image w-100" style="border-radius: 16px;"  :src="item.photos[0]"/>
                        </div>
                    </b-card-text>
                    <template #footer>
                        <b-row class="justify-content-between m-0">
                            <b-col class="px-2 text-left">
                                <div class=" text-left d-block small mt-1 text-muted" style="font-size: 14px;">
                                    <span class="d-inline-block box-link ml-2">
                                    <i class="fas fa-chart-line"></i>
                                    <span>
                                        {{ item.engagement | numFormat }} </span>
                                    </span>
                                    <span class="d-inline-block box-link ml-2">
                                    <i class="fa fa-thumbs-up " aria-hidden="true"></i>
                                    {{ item.likes_count | numFormat }} </span>

                                    <!-- {{item}} -->
                                    <span class="d-inline-block box-link ml-2">
                                    <i class="fa fa-comment" aria-hidden="true"></i>
                                    <span>
                                        {{ item.comments_count | numFormat }} </span>
                                    </span>
                                    <span v-if="item.retweets_count" class="d-inline-block box-link ml-2">
                                    <i class="fal fa-retweet"></i>
                                    {{ item.retweets_count | numFormat }}
                                    </span>
                                    <span v-if="item.shares_count" class="d-inline-block box-link ml-2">
                                    <i class="fa fa-share"></i>
                                    {{ item.shares_count | numFormat }}
                                    </span>
                                    <span v-if="item.views_count" class="d-inline-block box-link ml-2">
                                    <i class="fas fa-eye"></i>
                                    {{ item.views_count | numFormat }}
                                    </span>
                                    <!-- emotes -->
                                    <span v-if="item.emotes">
                                        <span v-if="item.emotes.loves" class="d-inline-block box-link ml-2">
                                            ❤️ {{ item.emotes.loves | numFormat }}
                                        </span>
                                        <span v-if="item.emotes.wows" class="d-inline-block box-link ml-2">
                                            😮 {{ item.emotes.wows | numFormat }}
                                        </span>
                                        <span v-if="item.emotes.hahas" class="d-inline-block box-link ml-2">
                                            😂 {{ item.emotes.hahas | numFormat }}
                                        </span>
                                        <span v-if="item.emotes.sads" class="d-inline-block box-link ml-2">
                                            😢 {{ item.emotes.sads | numFormat }}
                                        </span>
                                        <span v-if="item.emotes.angries" class="d-inline-block box-link ml-2">
                                            😡 {{ item.emotes.angries | numFormat }}
                                        </span>
                                        <span v-if="item.emotes.cares" class="d-inline-block box-link ml-2">
                                            🤗 {{ item.emotes.cares | numFormat }}
                                        </span>
                                    </span>
                                </div>
                            </b-col>
                            <b-col class="px-2 text-right">
                                <b-avatar variant="success" icon="emoji-smile" v-if="item.sentiment === 1" size="34" />
                                <b-avatar variant="primary" icon="emoji-neutral" v-if="item.sentiment === 0" size="34" />
                                <b-avatar variant="danger" icon="emoji-frown" v-if="item.sentiment === -1" size="34" />
                            </b-col>
                        </b-row>
                    </template>
                </b-card>
                <div :class="index % 2 === 0 ? 'left' : 'right'" class="pt-2 item-image-container d-none d-md-block">
                    
                    <hr class="mt-0 bg-info-to-warning"/>
                    <img v-if="item.photos && item.photos.length && item.source !=='tiktok'" class="mt-4 mb-0 item-image" :src="item.photos[0]" 
                        :class="{
                            'no-top-right-radius mr-3': index % 2 === 1,
                            'no-top-left-radius ml-3': index % 2 === 0
                        }"
                        @click="openGallery(index, item.photos)"
                    />
                </div>
            </div>
        </div>
        
        <VueGallerySlideshow  :images="dataPhoto" :index="photoIndex" @close="closeGallery()"/>
        <!-- <div v-else class="text-center text-muted mt-5">
            <p>ไม่พบข้อมูลโพสต์ในช่วงเวลาที่เลือก</p>
        </div> -->
        <!-- FAB -->
        <b-button
            v-show="showFabButton && !disableFabButton"
            variant="warning"
            class="fab"
            @click="scrollToTop"
            style="background-color: #fed06ea4;"
        >
            <i class="fas fa-arrow-up"></i>
        </b-button>
    </div>
</template>

<script>
import VueGallerySlideshow from "vue-gallery-slideshow";
import Highlighter from "vue-highlight-words";

export default {
    components: {
        VueGallerySlideshow,
        Highlighter
    },
    props: {
        keyword: {
            type: String,
            default: null
        },
        disableFabButton: {
            type: Boolean,
            default: false
        },
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
        timelineItems: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            dataPhoto:[],
            photoIndex : null,
            type: null,
            showFabButton: false,
            currentPage: 1,
            totalRows:0,
            perPage:10,
            offset: 0,
            valueDate: [],
            sortOrder: "asc", // ค่าเริ่มต้น: เก่า → ใหม่
            minDotSize: 18, // ขนาดต่ำสุด (px)
            maxDotSize: 40, // ขนาดสูงสุด (px)
            // timelineItems:[]
        };
    },
    computed: {
        startAndEnd() {
            return [this.start, this.end];
        },
        keywordArray() {
            if (!this.keyword) return []
            // ตัดช่องว่างหลายอันและ , แล้วกรองคำว่างออก
            return this.keyword
                .split(/[ ,]+/)   // ✅ แยกด้วย space หรือ comma
                .filter(k => k.trim() !== "")
        }
    },
    mounted() {
        window.addEventListener("scroll", this.handleScroll);
        this.type = this.$route.query.groupType
    },
    beforeDestroy() {
        window.removeEventListener("scroll", this.handleScroll);
    },
    methods: {
        openGallery(i, data) {
            console.log("openGallery ==== ",data);
            console.log("index ==== ",i);
            this.photoIndex = 0;
            this.dataPhoto = data;
        },
        closeGallery() {
            this.photoIndex = null;
            this.dataPhoto = [];
        },
        isThai(text) {
            // ตรวจสอบว่ามีตัวอักษรไทยอย่างน้อย 1 ตัวหรือไม่
            const thaiRegex = /[\u0E00-\u0E7F]/;
            console.log(thaiRegex.test(text));
            
            return thaiRegex.test(text);
        },
        async translateToThai(text) {
            // try {
            //     const res = await fetch("https://libretranslate.com/translate", {
            //         method: "POST",
            //         body: JSON.stringify({
            //             q: "",
            //             source: "auto",
            //             target: "en",
            //             format: "text",
            //             alternatives: 3,
            //             api_key: ""
            //         }),
            //         headers: { "Content-Type": "application/json" }
            //     });

            //     console.log("Translated:", res.data.translatedText);
            // } catch (err) {
            //     console.error("Translate error:", err.response ? err.response.status : err.message);
            // }
        },
        formatNumber(num) {
            if (num == null) {
                return '0';
            }
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            }
            if (num >= 1000) {
                return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
            }
            return num.toString();
        },
        toggleSort() {
            this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
        },
        formatDate(date) {
            return new Intl.DateTimeFormat("th-TH", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
                timeZone: "UTC"   // คุมไม่ให้ปรับตาม timezone เครื่อง
            }).format(new Date(date));
        },
        dotSize(engagement) {
            // map engagement เป็นขนาด dot
            const minEng = 10;   // ค่าต่ำสุดของ engagement
            const maxEng = 500;  // ค่าสูงสุดของ engagement
            let size = ((engagement - minEng) / (maxEng - minEng)) * (this.maxDotSize - this.minDotSize) + this.minDotSize;
            return Math.max(this.minDotSize, Math.min(this.maxDotSize, size)); // จำกัดช่วง
        },
        handleScroll() {
            // ถ้า scroll เกิน 700px ค่อยโชว์ปุ่ม
            this.showFabButton = window.scrollY > 700;
        },
        scrollToTop() {
            const el = document.getElementById("timeline-container");
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          
        }
    }
};
</script>

<style scoped>
.highlight2 {
  background-color: #FDD071;
  padding: 0 2px;
}
.zigzag-btn {
    height: 40px;
    width: 40px;
    border: none;
    border-radius: 50%;
    background: linear-gradient(90deg,#FDD071 0%, #ffbcbc 100%);
    transition: clip-path 0.3s ease, background 0.3s ease;
    padding: 5px 15px;
}

/* hover แล้วเป็นขอบหยักรอบด้าน */
.zigzag-btn:hover {
    border-color: 1px solid #f8aa02;
    box-shadow: 0 0 5px #f8aa02, 0 0 10px #fdd171ad, 0 0 15px #fdd1716b;
  /* background: #e9ecef; */
  /* clip-path: path("M50,0 C55,10,65,10,70,0 C80,5,85,15,80,25 C90,30,90,40,80,45 C85,55,80,65,70,60 C65,70,55,70,50,60 C45,70,35,70,30,60 C20,65,15,55,20,45 C10,40,10,30,20,25 C15,15,20,5,30,0 C35,10,45,10,50,0 Z"); */
}
.date-bg {
    border-radius: 20px;
    color: #ffffff;
    background: linear-gradient(90deg,#17a2b8 30%, #24d6da 100%);
}
.fab {
  position: fixed;
  bottom: 20px;
  right: 60px;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  z-index: 1050;
  font-size: 20px;
}
.timeline-footer {
  /* background-color: #fed06ea4 !important; */
}
.item-image {
    width: 200px;
    max-width: 400px;          /* ให้กว้างเท่ากับสูง เพื่อทำเป็นวงกลม */
    min-height: 200px;
    max-height: 210px;
    object-fit: cover;     /* ให้ภาพเต็มวงกลมโดยไม่บิด */
    border-radius: 20px;    
    border: 2px solid #eaeff3;
    cursor: pointer;
    margin: 2px;
    display: block;        /* ป้องกันการมี inline-gap */
}
.platform-imgs{
    right: -10px;
    bottom: 0;
    width: 25px;
    position: absolute;
}
.sort-btn{
    background: linear-gradient(90deg,#FDD071 0%, #ffbcbc 100%);
    border: none;
    color: #2c3e50; /* ให้ตัวอักษรอ่านง่าย */
    font-weight: bold;
}
.bg-info-to-warning {
  height: 2px;
  border: none;
  background: linear-gradient(90deg, #17a2b8 0%, #FDD071 50%, #17a2b8 100%);
}
.sort-btn:hover {
  opacity: 0.9;
}
.timeline-card.no-top-right-radius {
  border-top-right-radius: 0 !important;
}
.timeline-card.no-top-left-radius {
  /* border-top-right-radius: 20px !important; */
  border-top-left-radius: 0 !important;
}
.item-image.no-top-right-radius {
  border-top-right-radius: 0 !important;
  margin-left: auto;
  /* margin-right: 40px; */
}
.item-image.no-top-left-radius {
  border-top-left-radius: 0 !important;
}

.timeline-container {
    position: relative;
    width: 100%;
    /* max-width: 900px; */
    margin: auto;
    padding-bottom: 40px;
}

.timeline-line {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    background: #dee2e6;
    transform: translateX(-50%);

}

.timeline-item {
    position: relative;
    width: 50%;
    /* padding-top: 40px; */
    /* padding: 10px 10px 10px 10px; */
}

.timeline-item.left {
    left: 0;
    text-align: right;
    padding-right: 50px;
    padding-bottom: 50px;
}
.right.item-image-container {
    position: absolute;
    width: 100%;
    left: -100%;
    top: 20px;
    /* padding: 20px; */
} 
.left.item-image-container {
    position: absolute;
    width: 100%;
    right: -100%;
    top: 20px;
    border-top-right-radius: 0 !important;
    margin-bottom: 20px;
}
.timeline-item.right {
    left: 50%;
    /* top: -150px; */
    text-align: left;
    padding-left: 50px;
    padding-bottom: 50px;
}
.timeline-dot {
    align-content: center;
    text-align: center;
    color: #eaeff3;
    border-radius: 50%;
    position: absolute;
    top: 0px;
    z-index: 2;
    width: 60px;
    height: 60px;
    /* padding: 10px; */
    /* padding-left: 2px;
    padding-right: 2px; */
}

.timeline-item.left .timeline-dot {
    right: -25px;
}

.timeline-item.right .timeline-dot {
    left: -25px;
}

.timeline-card {
    /* border: 2px solid #dee2e6; */
    border-radius: 20px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
}


/* สำหรับหน้าจอมือถือ */
@media (max-width: 767px) {
    .timeline-dot {
        left: -30px !important; /* หรือลบค่า left ออก */
    }
    .timeline-item {
        /* padding-top: 20px; */
        width: 100%;
    }
    .timeline-line {
        left: 20px; /* ปรับให้ชิดซ้ายตามต้องการ */
        transform: none; /* ลบ translateX */
    }
    .timeline-dot {
        left: 20px; 
        transform: none; 
    }
    .timeline-item.left{
        margin-top: 0px;
        padding-right: 0px;
        text-align: left;
        left: 20px; 
        right: auto;
        padding-left: 50px;
        padding-bottom: 20px;
    }
    .timeline-item.right {
        /* ปรับให้ item ทั้งหมดอยู่ด้านขวา timeline-line */
        margin-top: 0px;
        left: 20px; 
        right: auto;
        padding-left: 50px;
        padding-bottom: 20px;
    }
    .timeline-item.left .timeline-dot {
        left: -9px;
    }
    .timeline-card.no-top-right-radius {
        border-top-right-radius: 20px !important;
        border-top-left-radius: 0 !important;
    }
    .item-image{
        width: 100%;
        /* height: auto; */
    }
}

</style>
