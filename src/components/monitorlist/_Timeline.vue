<template>
    <div class="my-3">
        <div v-if="timelineItems.length" class="timeline-container" >

            <!-- เส้นตรงกลาง -->
            <div class="timeline-line"></div>

            <div v-for="(item, index) in timelineItems" :key="index" class="timeline-item"
                :class="index % 2 === 0 ? 'left' : 'right'">

                <!-- จุด -->
                <div class="timeline-dot" :class="'bg-info'" v-b-tooltip.hover="'engagement: ' + (item.engagement ? item.engagement.toLocaleString() : '0')"
                :style="{
                    width: dotSize(item.engagement) + 'px',
                    height: dotSize(item.engagement) + 'px',
                    top: dotSize(item.engagement) > 25 ? '-10px' : '0px',
                    right: index % 2 === 0 ? '-' + (dotSize(item.engagement) / 2) + 'px' : 'auto',
                    left: index % 2 === 1 ? '-' + (dotSize(item.engagement) / 2) + 'px' : 'auto'
                }"
                ></div>
                <!-- วันที่ + เวลา -->
                <!-- <hr class=""> -->
                <b-col cols="auto" class="px-0 pb-2 text-info" style="font-size: 18px;">
                    <i class='fas fa-calendar-day'></i>
                    <span>
                        {{ formatDate(item.date) }}
                    </span>
                </b-col>
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
                        <b-row class="m-0 align-items-center">
                            <b-col cols="auto" class="p-0 text-left">
                                <b-avatar class="" size="45px" :src="item.image">
                                    <img v-if="item.source == 'facebook'" src="@/assets/Facebook.png" class="platform-imgs" />
                                    <img v-if="item.source == 'twitter'" src="@/assets/Twitter.png" class="platform-imgs" />
                                    <img v-if="item.source == 'pantip'" src="@/assets/board.png" class="platform-imgs" />
                                    <img v-if="item.source == 'blockdit'" src="@/assets/Blockdit.png" class="platform-imgs" />
                                    <img v-if="item.source == 'instagram'" src="@/assets/Instagram.png" class="platform-imgs" />
                                    <img v-if="item.source == 'youtube'" src="@/assets/Youtube.png" class="platform-imgs" />
                                    <img v-if="item.source == 'news'" src="@/assets/News.png" class="platform-imgs" />
                                    <img v-if="item.source == 'tiktok'" src="@/assets/Tiktok.png" class="platform-imgs" />
                                    <img v-if="item.source == 'threads'" src="@/assets/Threads.png" class="platform-imgs" />
                                </b-avatar>
                            </b-col>
                            <b-col class="mb-0 text-info text-left">{{ item.account_name }}</b-col>
                        </b-row>
                        <!-- <b-icon :icon="item.icon" font-scale="1.5" class="mr-2"></b-icon> -->
                    </template>
                    <b-card-text class="p-1">
                        <p v-if="item.full_text" class="text-left" style="font-size: 16px;">
                            <span>
                                {{ item.showAll ? item.full_text : item.full_text.substring(0, 200) }}
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
                        <div v-if="item.photos.length && item.source !=='tiktok'" class="d-block d-md-none text-center">
                            <img class="post-image w-100" style="border-radius: 16px;"  :src="item.photos[0]"/>
                        </div>
                    </b-card-text>
                    <template #footer>
                        <b-row class="justify-content-between m-0">
                            <b-col class="p-0 text-left">
                                <span v-b-tooltip.hover title="Engagement">
                                    <span style="font-size:14px;">Engages </span> : {{ item.engagement | numFormat }}
                                </span>
                            </b-col>
                        </b-row>
                    </template>
                </b-card>
                <div :class="index % 2 === 0 ? 'left' : 'right'" class="pt-2 post-image-container d-none d-md-block">
                    
                    <hr class="mt-0 bg-info-to-warning"/>
                    <img v-if="item.photos.length && item.source !=='tiktok'" class="mt-4 mb-0 post-image" :src="item.photos[0]" 
                        :class="{
                            'no-top-right-radius mr-3': index % 2 === 1,
                            'no-top-left-radius ml-3': index % 2 === 0
                        }"
                    />
                </div>
            </div>
        </div>
        
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
export default {
    props: {
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
    },
    mounted() {
        window.addEventListener("scroll", this.handleScroll);
    },
    beforeDestroy() {
        window.removeEventListener("scroll", this.handleScroll);
    },
    methods: {
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
.post-image {
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
.platform-imgs {
    width: 45px;
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
.post-image.no-top-right-radius {
  border-top-right-radius: 0 !important;
  margin-left: auto;
  /* margin-right: 40px; */
}
.post-image.no-top-left-radius {
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
    padding-right: 30px;
    padding-bottom: 50px;
}
.right.post-image-container {
    position: absolute;
    width: 100%;
    left: -100%;
    top: 0%;
    /* padding: 20px; */
} 
.left.post-image-container {
    position: absolute;
    width: 100%;
    right: -100%;
    top: 0%;
    border-top-right-radius: 0 !important;
    margin-bottom: 20px;
}
.timeline-item.right {
    left: 50%;
    /* top: -150px; */
    text-align: left;
    padding-left: 30px;
    padding-bottom: 50px;
}
.timeline-dot {
    border-radius: 50%;
    position: absolute;
    top: 0px;
    z-index: 2;
    /* padding-left: 2px;
    padding-right: 2px; */
}

.timeline-item.left .timeline-dot {
    right: -9px;
}

.timeline-item.right .timeline-dot {
    left: -9px;
}

.timeline-card {
    /* border: 2px solid #dee2e6; */
    border-radius: 20px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
}


/* สำหรับหน้าจอมือถือ */
@media (max-width: 767px) {
    .timeline-dot {
        left: -9px !important; /* หรือลบค่า left ออก */
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
    .post-image{
        max-width: 100%;
        /* height: auto; */
    }
}
</style>
