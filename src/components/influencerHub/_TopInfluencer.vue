<template>
    <!-- <div class="col-12 px-0"> -->
        
    <div class="position-relative py-3 px-2 mb-5">
        <!-- ปุ่มซ้าย -->
        <b-button
            pill
            variant="warning"
            class="position-absolute"
            style="background-color: #fdd071; left: 0; top: 50%; transform: translateY(-50%); z-index: 1;"
            @click="scrollLeft"
            v-if="showLeft"
        >
            <span style="font-size: 24px !important;">
                ‹
            </span>
        </b-button>
    
        <!-- Container ที่ scroll ได้ -->
        <div
            ref="scrollContainer"
            class="d-flex overflow-auto scroll-container"
            style="scroll-behavior: smooth;"
        >
        <div
            v-for="(card, i) in cards"
            :key="i"
            class="flex-shrink-0"
            style="width: 300px; margin-right: 16px;"
        >
            <InfluencerCard/>
            <!-- <b-card
            :title="card.title"
            :img-src="card.img"
            img-alt="จังหวัด"
            img-top
            >
            <b-card-text>
                {{ card.text }}
            </b-card-text>
            <template #footer>
                <small class="text-muted">{{ card.footer }}</small>
            </template>
            </b-card> -->
        </div>
        </div>
    
        <!-- ปุ่มขวา -->
        <b-button
            pill
            variant="warning"
            class="position-absolute"
            style="background-color: #fdd071;right: 0; top: 50%; transform: translateY(-50%); z-index: 1;"
            @click="scrollRight"
            v-if="showRight"
        >
            <span style="font-size: 24px !important;">
                ›
            </span>
        </b-button>
    </div>
    <!-- </div> -->
</template>
<script>
import InfluencerCard from './_InfluencerCard.vue';
export default {
    components: {
        InfluencerCard
    },
    data() {
        return {
            cards: [
                {
                    title: "อุบลราชธานี",
                    img: "https://picsum.photos/300/200?random=1",
                    text: "154,878 engagement • 354 Post • 257 Users",
                    footer: "ปัญหาในพื้นที่"
                },
                {
                    title: "สุรินทร์",
                    img: "https://picsum.photos/300/200?random=2",
                    text: "192,608 engagement • 289 Post • 171 Users",
                    footer: "ปัญหาในพื้นที่"
                },
                {
                    title: "ศรีสะเกษ",
                    img: "https://picsum.photos/300/200?random=3",
                    text: "148,100 engagement • 180 Post • 126 Users",
                    footer: "ปัญหาในพื้นที่"
                },
                {
                    title: "บุรีรัมย์",
                    img: "https://picsum.photos/300/200?random=4",
                    text: "130,000 engagement • 150 Post • 100 Users",
                    footer: "ปัญหาในพื้นที่"
                },
                {
                    title: "ศรีสะเกษ",
                    img: "https://picsum.photos/300/200?random=3",
                    text: "148,100 engagement • 180 Post • 126 Users",
                    footer: "ปัญหาในพื้นที่"
                },
                {
                    title: "บุรีรัมย์",
                    img: "https://picsum.photos/300/200?random=4",
                    text: "130,000 engagement • 150 Post • 100 Users",
                    footer: "ปัญหาในพื้นที่"
                },
            ],
            showLeft: true,
            showRight: true
        };
    },
    methods: {
        scrollLeft() {
            this.$refs.scrollContainer.scrollLeft -= 320; // scroll left by 1 card + margin
        },
        scrollRight() {
            this.$refs.scrollContainer.scrollLeft += 320; // scroll right by 1 card + margin
        },
        checkScroll() {
            const container = this.$refs.scrollContainer;
            this.showLeft = container.scrollLeft > 0;
            this.showRight =
            container.scrollLeft + container.offsetWidth < container.scrollWidth - 5;
        }
    },
    computed: {
        cardStyle() {
            // Responsive: ปรับขนาดการ์ดตามหน้าจอ
            return {
            width: '85vw',
            maxWidth: '300px',
            marginRight: '16px'
            };
        }
    },
    // mounted() {
    //     // this.checkScroll();
    //     window.addEventListener("resize", this.checkScroll);
    // },
    // beforeDestroy() {
    //     window.removeEventListener("resize", this.checkScroll);
    // }, 
}
</script>
<style scoped>
    /* Scroll container custom scrollbar */
    .scroll-container::-webkit-scrollbar {
    height: 6px; /* ลดความสูง scrollbar */
    }

    .scroll-container::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 10px;
    }

    .scroll-container::-webkit-scrollbar-track {
    background-color: transparent;
    }

    /* Firefox (ใช้ scrollbar-width แทน) */
    .scroll-container {
        scrollbar-width: thin;
        scrollbar-color: #ffffff transparent;
    }
</style>