<template>
    <div class="my-3">
        <!-- ปุ่มสลับเรียง -->
        <!-- <b-row class="justify-content-between align-items-center mb-3 mx-0">
            <b-col cols="auto">
                <h4 class="mb-0">Posts Timeline</h4>
            </b-col>
            <div class="text-center">
                เรียงจาก :
                <b-button class="sort-btn" @click="toggleSort" pill size="sm">
                    {{ sortOrder === 'asc' ? 'ใหม่ → เก่า' : 'เก่า → ใหม่' }}
                </b-button>
            </div>
        </b-row> -->

        <div v-if="timelineItems.length" class="timeline-container" >

            <!-- เส้นตรงกลาง -->
            <div class="timeline-line"></div>

            <div v-for="(item, index) in sortedTimeline" :key="index" class="timeline-item"
                :class="index % 2 === 0 ? 'left' : 'right'">
                <div class="timeline-dot" :class="'bg-info'" v-b-tooltip.hover="'engagement: ' + (item.engagement ? item.engagement.toLocaleString() : '0')"
                    :style="{ width: dotSize(item.engagement) + 'px', height: dotSize(item.engagement) + 'px' }"
                ></div>

                <!-- footer-bg-variant="white" footer-border-variant="white" -->
                <b-card class="timeline-card" 
                    header-class="d-flex align-items-center p-2"
                    body-class="p-1"
                    header-bg-variant="white" header-border-variant="white" 
                    :class="{
                        'no-top-right-radius': index % 2 === 0,
                        'no-top-left-radius': index % 2 === 1
                    }"
                >
                    <template #header>
                        <!-- <b-icon :icon="item.icon" font-scale="1.5" class="mr-2"></b-icon> -->
                        <h6 class="mb-0 text-info">{{ item.title }}</h6>
                    </template>
                    <b-card-text class="p-1">
                    </b-card-text>
                    <template #footer>
                        <b-row>
                            <b-col class="p-0 text-left">
                                {{ item.source }}
                            </b-col>
                            <b-col cols="auto" class="p-0">
                                <b-badge pill variant="warning" style="background-color:#fed06ea4 !important;">
                                    <!-- <p class="my-1">{{ item.text }}</p> -->
                                    <small class="text-muted">
                                        <i class='fas fa-calendar-day'></i>
                                        {{ formatDate(item.date) }}
                                    </small>
                                </b-badge>
                            </b-col>
                        </b-row>
                    </template>
                </b-card>
            </div>
        </div>
        <b-row v-if="timelineItems.length" class="justify-content-center align-items-center mt-3 mx-0">
            <!-- <b-col cols="auto">
                <h4 class="mb-0">Posts Timeline</h4>
            </b-col> -->
            <div class="text-center">
                <b-button class="sort-btn" pill size="sm">
                    ดูเพิ่มเติม
                </b-button>
            </div>
        </b-row>
        <div v-else class="text-center text-muted mt-5">
            <p>ไม่พบข้อมูลโพสต์ในช่วงเวลาที่เลือก</p>
        </div>
    </div>
</template>

<script>
export default {
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
        timelineItems: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            currentPage: 1,
            totalRows:0,
            perPage:10,
            offset: 0,
            valueDate: [],
            sortOrder: "asc", // ค่าเริ่มต้น: เก่า → ใหม่
            minDotSize: 18, // ขนาดต่ำสุด (px)
            maxDotSize: 40, // ขนาดสูงสุด (px)
            // timelineItems:[]
            // timelineItems: [
            //     {
            //         "_id": "6885d1f33195697758b724fb",
            //         "source": "youtube",
            //         "uid": "https://www.youtube.com/watch?v=rONmdMgRM8E",
            //         "account_id": "62bdad3ae23655723a1fafbc",
            //         "account_name": "PPTV HD 36",
            //         "account_url": "https://www.youtube.com/@PPTVHD36",
            //         "cluster": [
            //             "สถานการณ์ชายแดนไทยกัมพูชา",
            //             "บุคคล",
            //             "ช่อง 3",
            //             "ทหารกัมพูชาร้องเพลงชาติ"
            //         ],
            //         "comments": [
            //             {
            //                 "cid": "/@user-wp2do4ny8f",
            //                 "author": "@user-wp2do4ny8f",
            //                 "author_link": "/@user-wp2do4ny8f",
            //                 "time": "2025-07-27T12:12:31+00:00",
            //                 "text": "อย่าจบง่ายๆเอาให้มันกราบตรีนไทยอีกรอบก่อน ครั้งก่อนร้องไห้ ครั้งนี้มันจะได้จดจำไปอีกนาน มันสั่งสมอาวุธครั้งหน้าไทยจะลำบาก",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_lSxERKmuXpC-ZC9j7fDJwYA7IckYaELucXUsk6JqJMNWOrJkgdwEv1hl_g-6nsJoGqnQ=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "17"
            //             },
            //             {
            //                 "cid": "/@it-s_My_Love",
            //                 "author": "@it-s_My_Love",
            //                 "author_link": "/@it-s_My_Love",
            //                 "time": "2025-07-27T12:12:31+00:00",
            //                 "text": "หยุดกี่โมง...ล่าสุดยังเห็นยิงถล่มนาชาวบ้านอยู่เลย",
            //                 "photo": "https://yt3.ggpht.com/KwwT0t9XO9F71jqTJccmTwGUxjOtE2tR2bwCRrCnW9SQZMIW978BTHW2J1KETKs4-lCA6AFt8A=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "56"
            //             },
            //             {
            //                 "cid": "/@ThailandAmulet-",
            //                 "author": "@ThailandAmulet-",
            //                 "author_link": "/@ThailandAmulet-",
            //                 "time": "2025-07-27T13:12:31+00:00",
            //                 "text": "สนับสนุนให้ไทยเพิ่มการโจมตี",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_kZHleW4wop_eMo2zUW8o2bgawVGq_VNyYC6CzcSZQWCCQ=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "7"
            //             },
            //             {
            //                 "cid": "/@oden5463",
            //                 "author": "@oden5463",
            //                 "author_link": "/@oden5463",
            //                 "time": "2025-07-27T12:12:31+00:00",
            //                 "text": "1.กัมพูชาต้องยอมเข้ามาขอเจรจาเองเท่านั้น 2.หากยุติแล้วทรัมป์ต้องพิจารณาลดภาษีให้ไทยด้วย ถ้าไม่ได้ตามนี้ ก็ลุยต่อไป",
            //                 "photo": "https://yt3.ggpht.com/H_dr-HFoebma9ZnlJbB3Tmgsc1k6Ob6nUFsOI7xejfNKyUya8D0ABaUF4HeznuC265yHWUkdfQ=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "22"
            //             },
            //             {
            //                 "cid": "/@Voidbreakerrt",
            //                 "author": "@Voidbreakerrt",
            //                 "author_link": "/@Voidbreakerrt",
            //                 "time": "2025-07-27T12:12:31+00:00",
            //                 "text": "ตอนแรกไทยหยุดยิง แต่เขรมมันเปิดไทยมาก่อน ตอน ตี 4.30",
            //                 "photo": "https://yt3.ggpht.com/y-Cvz3jFRYcbDCXCxStnoGT8Sy78m7SHXAzK75U8q_A1JzlnlU6hWogUWUUQziwyGhBZRa__Qy0=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "35"
            //             },
            //             {
            //                 "cid": "/@%E0%B8%AE%E0%B8%B4%E0%B8%A7%E0%B8%81%E0%B8%B2%E0%B8%A2%E0%B8%AE%E0%B8%B4%E0%B8%A7%E0%B9%83%E0%B8%88",
            //                 "author": "@ฮิวกายฮิวใจ",
            //                 "author_link": "/@%E0%B8%AE%E0%B8%B4%E0%B8%A7%E0%B8%81%E0%B8%B2%E0%B8%A2%E0%B8%AE%E0%B8%B4%E0%B8%A7%E0%B9%83%E0%B8%88",
            //                 "time": "2025-07-27T12:12:31+00:00",
            //                 "text": "ต้องร่าง MOU ใหม่ขึ้นมา และยกเลิก MOUอันเก่า เพราะรบกันแบบนี้แล้ว ข้อตกลงทั้งหมดย่อมยกเลิกไปโดยปริยาย  อย่าให้ครั้งนี้เสียเปล่า",
            //                 "photo": "https://yt3.ggpht.com/aij2NPHjsA6M4bofUY9FbCaW8Ur7NhvyfxMaZsnqLxtpG690QmSpYzYuhrrHcDFrcj9Oiky5mg=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "14"
            //             },
            //             {
            //                 "cid": "/@KabCon-e9e",
            //                 "author": "@KabCon-e9e",
            //                 "author_link": "/@KabCon-e9e",
            //                 "time": "2025-07-27T12:12:31+00:00",
            //                 "text": "ล้างบางมันเลยไม่งั้นไม่จบ",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_kvlWfpFiGDsOuWN8WC7fbTg_M3GnIyZoNdq97hjvUJDaKXfd4Br8mhKtbUbhXvgfORVQ=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "16"
            //             },
            //             {
            //                 "cid": "/@hmpdnews8488",
            //                 "author": "@hmpdnews8488",
            //                 "author_link": "/@hmpdnews8488",
            //                 "time": "2025-07-27T12:12:31+00:00",
            //                 "text": "เขมรมันเปิดก่อนทุกเช้า เอาตรงไหนมาหยุด",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_nari9FnSxqnZYOmVCBDYtEom_9Ng6L04kU9eXJ0bw=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "19"
            //             },
            //             {
            //                 "cid": "/@%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%9B%E0%B8%B4%E0%B8%A2%E0%B8%B0%E0%B8%A8%E0%B8%B1%E0%B8%81%E0%B8%94%E0%B8%B4%E0%B9%8C%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7%E0%B8%9E%E0%B8%B4%E0%B8%A5%E0%B8%B2",
            //                 "author": "@นายปิยะศักดิ์แก้วพิลา",
            //                 "author_link": "/@%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%9B%E0%B8%B4%E0%B8%A2%E0%B8%B0%E0%B8%A8%E0%B8%B1%E0%B8%81%E0%B8%94%E0%B8%B4%E0%B9%8C%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7%E0%B8%9E%E0%B8%B4%E0%B8%A5%E0%B8%B2",
            //                 "time": "2025-07-27T13:51:31+00:00",
            //                 "text": "ฮุนเซนฮุนมาเนตไม่น่าเชื่อถือแล้ว.ปากบอกเห็นด้วยหยุดยิงเช้ามามันยิงก่อนทุกที",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_kSgzsn-PaGdvyWXb6AMhFa1gscZpG84RXiatevNLqmSu1hqWQ=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "1"
            //             },
            //             {
            //                 "cid": "/@%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%AA%E0%B8%B4%E0%B8%97%E0%B8%98%E0%B8%B4%E0%B9%8C%E0%B8%AD%E0%B8%B0%E0%B8%A3%E0%B8%B4%E0%B8%81%E0%B8%B8%E0%B8%A5",
            //                 "author": "@ประสิทธิ์อะริกุล",
            //                 "author_link": "/@%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%AA%E0%B8%B4%E0%B8%97%E0%B8%98%E0%B8%B4%E0%B9%8C%E0%B8%AD%E0%B8%B0%E0%B8%A3%E0%B8%B4%E0%B8%81%E0%B8%B8%E0%B8%A5",
            //                 "time": "2025-07-27T13:12:31+00:00",
            //                 "text": "หยุดทำไมเอาให้ราบแล้วค่อยเจรจา",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_l1Ei_UOn3gRmgfSr7yz9KSSKyCjd8q_rgy03IhZBNtW-WLHx4=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "3"
            //             },
            //             {
            //                 "cid": "/@kitaanat",
            //                 "author": "@kitaanat",
            //                 "author_link": "/@kitaanat",
            //                 "time": "2025-07-27T12:12:31+00:00",
            //                 "text": "คนกลับคำคือใครกันแน่",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_mdMPJJXb5K7K685qy41sfE2g8B0QexkgCSQGvWFWA=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "13"
            //             },
            //             {
            //                 "cid": "/@%E3%82%B7%E3%82%B7-j1w",
            //                 "author": "@シシ-j1w",
            //                 "author_link": "/@%E3%82%B7%E3%82%B7-j1w",
            //                 "time": "2025-07-27T13:12:31+00:00",
            //                 "text": "ต้องให้เขมรมันมาขอเจรจาเอง",
            //                 "photo": "https://yt3.ggpht.com/PYsoh7eZujsAH-cX7nOFfR_H5Kg4xTEuu3aRoLn6QE0IiE42Uwm9byoYv0MmIq0uTNhH7LPyLqI=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "2"
            //             },
            //             {
            //                 "cid": "/@%E0%B9%82%E0%B8%AD%E0%B9%87%E0%B8%95%E0%B9%80%E0%B8%AD%E0%B8%B2%E0%B8%8A%E0%B8%B5%E0%B8%A7%E0%B8%B4%E0%B8%95%E0%B8%A3%E0%B8%AD%E0%B8%94%E0%B9%84%E0%B8%9B%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B9%86%E0%B9%86",
            //                 "author": "@โอ็ตเอาชีวิตรอดไปวันๆๆ",
            //                 "author_link": "/@%E0%B9%82%E0%B8%AD%E0%B9%87%E0%B8%95%E0%B9%80%E0%B8%AD%E0%B8%B2%E0%B8%8A%E0%B8%B5%E0%B8%A7%E0%B8%B4%E0%B8%95%E0%B8%A3%E0%B8%AD%E0%B8%94%E0%B9%84%E0%B8%9B%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B9%86%E0%B9%86",
            //                 "time": "2025-07-27T12:12:31+00:00",
            //                 "text": "แค่น้ำลายไม่ใช้พ่อมันไม่ฟังหลอก",
            //                 "photo": "https://yt3.ggpht.com/aKB8iTnwe_jOjAkob1UkqM1XRAGjUyp47Aeo8l2kj-VKBK0VnvTBFb6ds_Zqxhkkz-3azM4Uf-A=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "5"
            //             },
            //             {
            //                 "cid": "/@%E0%B9%82%E0%B8%88%E0%B8%A3%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B8%A2%E0%B8%A1",
            //                 "author": "@โจรกระเทียม",
            //                 "author_link": "/@%E0%B9%82%E0%B8%88%E0%B8%A3%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B8%A2%E0%B8%A1",
            //                 "time": "2025-07-27T12:12:31+00:00",
            //                 "text": "หยุดที่ไหนตกแถวบ้านวันละ30กว่าลูกวันนี้ตังแต่ตี4ยิงมา10กว่าลูกแล้ว",
            //                 "photo": "https://yt3.ggpht.com/ECTH1xv4xDiz7FK7wAvdMRq--I9Uq52PfZGFzro1HP_KAjVkOV0HZ9EJQwPHYsPXclc9CdwTnm8=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "6"
            //             },
            //             {
            //                 "cid": "/@Somphod-ye6lm",
            //                 "author": "@Somphod-ye6lm",
            //                 "author_link": "/@Somphod-ye6lm",
            //                 "time": "2025-07-27T12:12:31+00:00",
            //                 "text": "พ่อใหญ่ทรัมป์เห็นหรือยังว่าเขมรไว้ใจไม่ได้  ปากบอกหยุดยิง แต่ยิงไม่หยุด",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_kSGfJDEc-ehaGCvwnyuNBr8kfhML-Yew76Nj8hUUSrrke4-fZIU5cLYjQMy1xZcxRHzA=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "6"
            //             },
            //             {
            //                 "cid": "/@lls1102",
            //                 "author": "@lls1102",
            //                 "author_link": "/@lls1102",
            //                 "time": "2025-07-27T12:12:31+00:00",
            //                 "text": "อย่าพึ่งเจรจา ต้องยึดพื้นที่คืนก่อน \n*ถึงแม้จะเจรจา แผ่นดินที่ไทยยึดกลับมา ก็ต้องเป็นของไทยถาวร ห้ามเจรจาให้มันเป็นพื้นที่พิพาทอีก เช่นภูมะเขือ ช่องยก และ 4ปราสาท ต้องเป็นของไทยถาวรเท่านี้น ถึงจะเริ่มเจรจา มันจะไม่เป็นพื้นที่พิพาทอีกต่อไป",
            //                 "photo": "https://yt3.ggpht.com/pn8KEv8VDtza9gPZSKaq4YoRWifu3duT13e9YxCmMhuB4LKKmz00doA1xPmVhV1GkIFusLz_=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "3"
            //             },
            //             {
            //                 "cid": "/@pang_napatsaorn",
            //                 "author": "@pang_napatsaorn",
            //                 "author_link": "/@pang_napatsaorn",
            //                 "time": "2025-07-27T12:12:31+00:00",
            //                 "text": "โอ๊ย..จะให้หยุดยิงเหรอ มันถล่มยิงเราขนาดนี้ไม่หยุดๆๆ.. แล้วมาพูดว่าอย่ากลับคำ พูดได้ไงวะ..ไม่ต้องคุยกับมันแล้ว ไม่มีประโยชน์ และทหารก็ทำหน้าที่อย่างเต็มกำลังดีอยู่แล้ว..",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_l43GHyPtOh1wdrToj3OytCEl9mcJ2cCP7K9UU3urCtgTXb=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "3"
            //             },
            //             {
            //                 "cid": "/@OppoOppo-pf5zo",
            //                 "author": "@OppoOppo-pf5zo",
            //                 "author_link": "/@OppoOppo-pf5zo",
            //                 "time": "2025-07-27T12:12:31+00:00",
            //                 "text": "ถ้ารัฐบาลไทยยอม..แล้วพื้นที่ละทั้งปราสาทด้วย\nจะตกลงอย่างไร..หรือไอ้ภูมิธรรมยกให้กัมพูชาไปแล้ว",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_nnR-GHImwMyfM0okuL1QjZuYUErnIzlS8pM2fjLw=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "2"
            //             },
            //             {
            //                 "cid": "/@deathbe5t576",
            //                 "author": "@deathbe5t576",
            //                 "author_link": "/@deathbe5t576",
            //                 "time": "2025-07-27T13:12:31+00:00",
            //                 "text": "คุยไหม่ เอา1ต่อ25000เเปบเวียดนาม",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_kdApIDXYjd1lwSkWcL5suNd01VCrLvdp8O1CSaqm2f5w=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "2"
            //             },
            //             {
            //                 "cid": "/@%E0%B8%AA%E0%B8%B4%E0%B8%A3%E0%B8%B4%E0%B9%82%E0%B8%A3%E0%B8%88%E0%B8%99%E0%B9%8C%E0%B8%9E%E0%B8%B4%E0%B8%A1%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B9%8D%E0%B8%B2",
            //                 "author": "@สิริโรจน์พิมานคํา",
            //                 "author_link": "/@%E0%B8%AA%E0%B8%B4%E0%B8%A3%E0%B8%B4%E0%B9%82%E0%B8%A3%E0%B8%88%E0%B8%99%E0%B9%8C%E0%B8%9E%E0%B8%B4%E0%B8%A1%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B9%8D%E0%B8%B2",
            //                 "time": "2025-07-27T12:12:31+00:00",
            //                 "text": "อธิปไตย กับการค้าคนล่ะเรื่อง....อย่าส่งต่อปัญหาสู่รุ่นลูกรุ่นหลาน. เอาให้จบจากเหตุการนี้",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_lDbPA3AdsJo_ytTd2kUyLKeBbBuSv5LgPV6jRJpxlqT_FbErQ=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "3"
            //             }
            //         ],
            //         "comments_count": 401,
            //         "created_on": "2025-07-27T07:12:32.877Z",
            //         "date": "2025-07-27T11:24:05.000Z",
            //         "domain": [
            //             "ช่องข่าว",
            //             "เขมร(บุคคล)",
            //             "ทหารกัมพูชาร้องเพลงชาติ",
            //             "สถานการณ์ชายแดนไทยกัมพูชา"
            //         ],
            //         "domain_id": [
            //             393,
            //             196,
            //             427
            //         ],
            //         "engagement": 793,
            //         "followers": 8230000,
            //         "frequencies": [
            //             {
            //                 "word": "ฮุน มา เนต",
            //                 "count": 1
            //             },
            //             {
            //                 "word": "ทรัมป์",
            //                 "count": 1
            //             },
            //             {
            //                 "word": "ไทย",
            //                 "count": 1
            //             },
            //             {
            //                 "word": "27 ก . ค . 68",
            //                 "count": 1
            //             }
            //         ],
            //         "full_text": "\"ฮุน มาเนต\"รับข้อเสนอหยุดยิง\"ทรัมป์\"ยินดีไทยเห็นด้วย แต่ขออย่ากลับคำ| ทันข่าวสุดสัปดาห์ | 27 ก.ค.68",
            //         "hashtags": [],
            //         "last_update": "2025-07-27T07:12:32.877Z",
            //         "likes_count": 392,
            //         "metadata": {
            //             "processedBy": [
            //                 "http://10.0.8.100:8800/preprocess",
            //                 "http://10.0.8.100:8080/sentiment"
            //             ]
            //         },
            //         "object_id": [
            //             7538,
            //             7612,
            //             6696
            //         ],
            //         "photos": [
            //             "http://i.ytimg.com/vi/rONmdMgRM8E/hqdefault.jpg"
            //         ],
            //         "post_type": "post",
            //         "processed": true,
            //         "profile_image": "https://yt3.ggpht.com/-mWnxGBf0YTpEDLLVr2bopcwWrA1QADtxCDBI-rDvB0ab8FaBdcSPodsM8hV1Ip9JbK0TGY5UIo=s48-c-k-c0x00ffffff-no-rj",
            //         "reaction": {
            //             "likes": 392,
            //             "dislikes": 0,
            //             "view_count": 25453
            //         },
            //         "sentiment": 0,
            //         "subdomain": [
            //             "บุคคล",
            //             "ทหารกัมพูชาร้องเพลงชาติ",
            //             "ช่องทีวี",
            //             "สถานการณ์ชายแดนไทยกัมพูชา"
            //         ],
            //         "subdomain_id": [
            //             1650,
            //             1715,
            //             1010
            //         ],
            //         "title": "\"ฮุน มาเนต\"รับข้อเสนอหยุดยิง\"ทรัมป์\"ยินดีไทยเห็นด้วย แต่ขออย่ากลับคำ| ทันข่าวสุดสัปดาห์ | 27 ก.ค.68",
            //         "url_post": "https://www.youtube.com/watch?v=rONmdMgRM8E",
            //         "views_count": 25453
            //     },
            //     {
            //         "_id": "6885d2503195697758b7432e",
            //         "uid": "https://www.youtube.com/watch?v=rm6_KwhXPts",
            //         "source": "youtube",
            //         "account_id": "62bdad3ae23655723a1fafbc",
            //         "account_name": "PPTV HD 36",
            //         "account_url": "https://www.youtube.com/@PPTVHD36",
            //         "cluster": [
            //             "ช่อง 3"
            //         ],
            //         "comments": [
            //             {
            //                 "cid": "/@auushowkaze",
            //                 "author": "@auushowkaze",
            //                 "author_link": "/@auushowkaze",
            //                 "time": "2025-07-27T12:14:02+00:00",
            //                 "text": "น่าเห็นใจนะครับ..หวังว่าอังเคิลจะได้หลับแบบไม่ต้องตื่นในเร็ววันนี้นะครับ",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_mhHNM5c54daM3GlRWcaChRaCo8lsIJDlbtEeEjqZg=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "25"
            //             },
            //             {
            //                 "cid": "/@barbertik",
            //                 "author": "@barbertik",
            //                 "author_link": "/@barbertik",
            //                 "time": "2025-07-27T12:14:02+00:00",
            //                 "text": "อังเคิลนอนบนที่นอนนุ่มๆพักบ้างนะ เดียวได้พักในที่แคบๆนะมันอึดอัด",
            //                 "photo": "https://yt3.ggpht.com/P1JLvKIyxl85_oL9yTpCDgoN8sYu8RrDmW5FBtd1Mfjc08cOAT3ChaJals3sM9oz4l8j5SQ50do=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "16"
            //             },
            //             {
            //                 "cid": "/@%E0%B8%81%E0%B8%A4%E0%B8%A8%E0%B8%81%E0%B8%A3%E0%B8%99%E0%B8%A7%E0%B8%A5%E0%B9%83%E0%B8%A2-%E0%B8%909%E0%B8%A1",
            //                 "author": "@กฤศกรนวลใย-ฐ9ม",
            //                 "author_link": "/@%E0%B8%81%E0%B8%A4%E0%B8%A8%E0%B8%81%E0%B8%A3%E0%B8%99%E0%B8%A7%E0%B8%A5%E0%B9%83%E0%B8%A2-%E0%B8%909%E0%B8%A1",
            //                 "time": "2025-07-27T12:14:02+00:00",
            //                 "text": "ยมทูตคอยอยู่ข้างบนแล้วค่ะ",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_kb8d9MQcHiggmCBAHVEPHRB94fVm1iFLop1vtYP3Gy7YGzDIs=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "23"
            //             },
            //             {
            //                 "cid": "/@JACKJACK-qb2eq",
            //                 "author": "@JACKJACK-qb2eq",
            //                 "author_link": "/@JACKJACK-qb2eq",
            //                 "time": "2025-07-27T12:14:02+00:00",
            //                 "text": "ฮุนเซนยังไม่ได้นอน เดี๋ยวจะได้นอนยาวๆเลยจร้า นอนหลับแบบไม่ตื่นอ่ะครับ",
            //                 "photo": "https://yt3.ggpht.com/5XwidHGGGDgTjdpeA5lgHYAB-Y5yIOibhvYw9rfY3SGZ2dycCySRdA3PnTh6vns3pY_AysO8t0o=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "14"
            //             },
            //             {
            //                 "cid": "/@Pranee-l7v",
            //                 "author": "@Pranee-l7v",
            //                 "author_link": "/@Pranee-l7v",
            //                 "time": "2025-07-27T12:14:02+00:00",
            //                 "text": "นอนยาวไปเลย",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_lRyZkwPw0x7IAtIsr3h8RD7OLQiMj64AT9z9wg5IdKOvALoEa8EA9SKI35G023QyLAFA=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "6"
            //             },
            //             {
            //                 "cid": "/@innkhongim3000",
            //                 "author": "@innkhongim3000",
            //                 "author_link": "/@innkhongim3000",
            //                 "time": "2025-07-27T12:14:02+00:00",
            //                 "text": "ในบ้านนั่นแหละขอแค่ไข่สามลูก ให้บ้านฮุน    จบ",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_lPpIK2TVaMdn4AijekyATynz7PUTT-e1GYk2x4odM=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "7"
            //             },
            //             {
            //                 "cid": "/@bluekitwarriorpath",
            //                 "author": "@bluekitwarriorpath",
            //                 "author_link": "/@bluekitwarriorpath",
            //                 "time": "2025-07-27T12:14:02+00:00",
            //                 "text": "เรียกมันว่า สมเด็จ ทำไม มันคือ อาชญากร",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_lnkuw3bbMwy2TUYScy_MOCkM8oqoFTEwioAjXXHEvSjfk=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "7"
            //             },
            //             {
            //                 "cid": "/@We-h4w",
            //                 "author": "@We-h4w",
            //                 "author_link": "/@We-h4w",
            //                 "time": "2025-07-27T13:14:02+00:00",
            //                 "text": "ต้องประกาศให้ประชาชนชาวเขมรออกนอกพื้นที่สู้รบ ถ้าไม่ยอมออกถ้าตายแสดงว่ายินยอมเองไม่ต้องรับผิดชอบ",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_k07C8cEHpI5auruvkwImfIrwe0s6yyY-gfU-t6jZn7oUcCHxA0uYVJIKe0IVT3hgGJ8fY=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "3"
            //             },
            //             {
            //                 "cid": "/@%E0%B8%8A%E0%B8%A5%E0%B8%B4%E0%B8%95-%E0%B8%A25%E0%B8%8A",
            //                 "author": "@ชลิต-ย5ช",
            //                 "author_link": "/@%E0%B8%8A%E0%B8%A5%E0%B8%B4%E0%B8%95-%E0%B8%A25%E0%B8%8A",
            //                 "time": "2025-07-27T12:14:02+00:00",
            //                 "text": "รมต.ต่างประเทศอย่าช้านะ แถลงสถานการณ์วันละ3-4เวลาให้ชาวโลกรับรู้",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_nJcEDcr38Q0KjSJL5pfRfVjF7ZgvVghIfq2LfLG8ZgL_PJsmY=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "4"
            //             },
            //             {
            //                 "cid": "/@%E0%B8%A0%E0%B8%B9%E0%B8%A2%E0%B8%A8%E0%B8%A7%E0%B8%B1%E0%B8%92%E0%B8%99%E0%B9%8C%E0%B8%9E%E0%B8%B1%E0%B8%8A%E0%B8%A3%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7-%E0%B8%8B5%E0%B8%8C",
            //                 "author": "@ภูยศวัฒน์พัชรพระแก้ว-ซ5ฌ",
            //                 "author_link": "/@%E0%B8%A0%E0%B8%B9%E0%B8%A2%E0%B8%A8%E0%B8%A7%E0%B8%B1%E0%B8%92%E0%B8%99%E0%B9%8C%E0%B8%9E%E0%B8%B1%E0%B8%8A%E0%B8%A3%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7-%E0%B8%8B5%E0%B8%8C",
            //                 "time": "2025-07-27T12:14:02+00:00",
            //                 "text": "พักผ่อนหน่อนน่ะท่านฮุน  ตายตอนนี้จะสะบายเกินไป  รออยู่ดูความพินาศตระกูลฮุนก่อน ค่อยตุย",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_kb8d9MQcHiggmCBAHVEPHRB94fVm1iFLop1vtYP3Gy7YGzDIs=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "2"
            //             },
            //             {
            //                 "cid": "/@%E0%B8%9B%E0%B8%B9%E0%B8%95%E0%B8%B4%E0%B8%99%E0%B9%82%E0%B8%A2%E0%B9%89",
            //                 "author": "@ปูตินโย้",
            //                 "author_link": "/@%E0%B8%9B%E0%B8%B9%E0%B8%95%E0%B8%B4%E0%B8%99%E0%B9%82%E0%B8%A2%E0%B9%89",
            //                 "time": "2025-07-27T13:38:02+00:00",
            //                 "text": "ฮุนเซนต้องชดใช้​ ด้วยชีวิต​",
            //                 "photo": "https://yt3.ggpht.com/IX7EjR4CVV27X8H02vuZi2LhDwCcUWNBrsGMBS9eXWo3n40GumW2-ywkXZqr_VYPKKm7CrfoKqo=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "1"
            //             },
            //             {
            //                 "cid": "/@bunnnn-m4o",
            //                 "author": "@bunnnn-m4o",
            //                 "author_link": "/@bunnnn-m4o",
            //                 "time": "2025-07-27T12:14:02+00:00",
            //                 "text": "รอนอนทีเดียวเลยวุ้น",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_ncWjF6ELdgcuIjcujQyuEZTAeeGPZ80mMWsDh6pOqDtSqYtvfyOWPvp61gMoyzrzthrw=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "3"
            //             },
            //             {
            //                 "cid": "/@natthaphatsamphao6386",
            //                 "author": "@natthaphatsamphao6386",
            //                 "author_link": "/@natthaphatsamphao6386",
            //                 "time": "2025-07-27T12:14:02+00:00",
            //                 "text": "ถ้าถึง 5 วันไม่น่ารอดดูแล้ว",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_kcTLwlTjnt0mv2OOvLFwAJS0b_WPIl7SBf5d7VC4w=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "8"
            //             },
            //             {
            //                 "cid": "/@%E0%B8%A7%E0%B9%88%E0%B8%B2%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A2%E0%B8%95%E0%B8%A3%E0%B8%B5%E0%B8%93%E0%B8%A3%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%A4%E0%B8%97%E0%B8%98%E0%B8%B4%E0%B9%8C%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7%E0%B9%80",
            //                 "author": "@ว่าที่ร้อยตรีณรงค์ฤทธิ์แก้วเ",
            //                 "author_link": "/@%E0%B8%A7%E0%B9%88%E0%B8%B2%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A2%E0%B8%95%E0%B8%A3%E0%B8%B5%E0%B8%93%E0%B8%A3%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%A4%E0%B8%97%E0%B8%98%E0%B8%B4%E0%B9%8C%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7%E0%B9%80",
            //                 "time": "2025-07-27T12:14:02+00:00",
            //                 "text": "ฮุนเซนใกล้ตายยังนอนบ้างนะ",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_lwyMEgUIld7y_xGJrp0cd7mNqQQ_loJYdTr09Y78c=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "4"
            //             },
            //             {
            //                 "cid": "/@%E0%B8%AB%E0%B8%B2%E0%B8%AB%E0%B8%A2%E0%B8%B1%E0%B8%87%E0%B8%AD%E0%B8%B0",
            //                 "author": "@หาหยังอะ",
            //                 "author_link": "/@%E0%B8%AB%E0%B8%B2%E0%B8%AB%E0%B8%A2%E0%B8%B1%E0%B8%87%E0%B8%AD%E0%B8%B0",
            //                 "time": "2025-07-27T12:14:02+00:00",
            //                 "text": "สภาพแบบนี้อีกไม่นานได้นอนติดเตียง นึกถึงความเลวที่ได้ทำไว้",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_kRdiwgGASa43GPYT-c3Z6MApteJOGOBXuLd7u6TpOt2CJm9iQ6p6u16RMmQYwe-Tke3g=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "10"
            //             },
            //             {
            //                 "cid": "/@%E0%B8%A1%E0%B8%99%E0%B8%8A%E0%B8%B1%E0%B8%A2%E0%B8%AD%E0%B8%B4%E0%B8%99%E0%B8%97%E0%B8%B4%E0%B8%AA%E0%B8%B2%E0%B8%A3",
            //                 "author": "@มนชัยอินทิสาร",
            //                 "author_link": "/@%E0%B8%A1%E0%B8%99%E0%B8%8A%E0%B8%B1%E0%B8%A2%E0%B8%AD%E0%B8%B4%E0%B8%99%E0%B8%97%E0%B8%B4%E0%B8%AA%E0%B8%B2%E0%B8%A3",
            //                 "time": "2025-07-27T12:14:02+00:00",
            //                 "text": "?เบาหวานขึ้นเลยนะฮุน",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_k_iHRN_l0TsKsAqRXBnKvUhZMHXsLhXvCXgVIQHJzdJTRw7Wt_G9XEs4chamQySZQzjQ=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": ""
            //             },
            //             {
            //                 "cid": "/@mysuperzzzzz3410",
            //                 "author": "@mysuperzzzzz3410",
            //                 "author_link": "/@mysuperzzzzz3410",
            //                 "time": "2025-07-27T13:15:02+00:00",
            //                 "text": "พักผ่อนบ้าง uncle หลานคิดถึง",
            //                 "photo": "https://yt3.ggpht.com/y36NsvX64mICfUPqDZdMaMbbq3In69l7_7bsHxmihbbjgP_CTnmu28LZz8F2igvidxjgt2QeQg=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "1"
            //             },
            //             {
            //                 "cid": "/@cvv9384",
            //                 "author": "@cvv9384",
            //                 "author_link": "/@cvv9384",
            //                 "time": "2025-07-27T12:14:02+00:00",
            //                 "text": "หน้าฮุนจะแบกโลกอะรัยขนาดนั้น",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_ldQNCJoqb2ACiWS5tI0fa5OHsUN-DbrYZMr0kII7wBc0yO3d9TcCxQjkS5SREDdYZ3kA=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "2"
            //             },
            //             {
            //                 "cid": "/@%E0%B8%A7%E0%B8%B4%E0%B8%A1%E0%B8%B8%E0%B8%95%E0%B8%AD%E0%B8%B9%E0%B9%88%E0%B8%A1%E0%B8%B2%E0%B8%A5%E0%B8%B2",
            //                 "author": "@วิมุตอู่มาลา",
            //                 "author_link": "/@%E0%B8%A7%E0%B8%B4%E0%B8%A1%E0%B8%B8%E0%B8%95%E0%B8%AD%E0%B8%B9%E0%B9%88%E0%B8%A1%E0%B8%B2%E0%B8%A5%E0%B8%B2",
            //                 "time": "2025-07-27T12:14:02+00:00",
            //                 "text": "เก่งมากครับ",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_lPzwNJIwW1k0s0Pq5m5acZMdMZ1WQ2bze8T2FvmSmc-8rjJdg=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": ""
            //             },
            //             {
            //                 "cid": "/@dancw7389",
            //                 "author": "@dancw7389",
            //                 "author_link": "/@dancw7389",
            //                 "time": "2025-07-27T14:09:02+00:00",
            //                 "text": "55555 นอนน้อย กินน้อยด้วย สื่อฯ เข้าใจพาดหัว",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_kIhgn7njLbAr1mLvmBnfeoCfiRc3Hjw2-hv0ulL8THTzY=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": ""
            //             }
            //         ],
            //         "comments_count": 167,
            //         "created_on": "2025-07-27T07:14:05.137Z",
            //         "date": "2025-07-27T11:15:09.000Z",
            //         "domain": [
            //             "ช่องข่าว"
            //         ],
            //         "domain_id": [
            //             196
            //         ],
            //         "engagement": 360,
            //         "followers": 8230000,
            //         "frequencies": [
            //             {
            //                 "word": "ฮุน เซน",
            //                 "count": 1
            //             },
            //             {
            //                 "word": "27 ก . ค . 68",
            //                 "count": 1
            //             }
            //         ],
            //         "full_text": "นอนน้อย เปิดภาพ\"ฮุน เซน\"บัญชาการรบ 3 วันติด | ทันข่าวสุดสัปดาห์ | 27 ก.ค.68",
            //         "hashtags": [],
            //         "last_update": "2025-07-27T07:14:05.137Z",
            //         "likes_count": 193,
            //         "metadata": {
            //             "processedBy": [
            //                 "http://10.0.8.100:8800/preprocess",
            //                 "http://10.0.8.100:8080/sentiment"
            //             ]
            //         },
            //         "object_id": [
            //             6696
            //         ],
            //         "photos": [
            //             "http://i.ytimg.com/vi/rm6_KwhXPts/hqdefault.jpg"
            //         ],
            //         "post_type": "post",
            //         "processed": true,
            //         "profile_image": "https://yt3.ggpht.com/-mWnxGBf0YTpEDLLVr2bopcwWrA1QADtxCDBI-rDvB0ab8FaBdcSPodsM8hV1Ip9JbK0TGY5UIo=s48-c-k-c0x00ffffff-no-rj",
            //         "reaction": {
            //             "likes": 193,
            //             "dislikes": 0,
            //             "view_count": 10217
            //         },
            //         "sentiment": 0,
            //         "subdomain": [
            //             "ช่องทีวี"
            //         ],
            //         "subdomain_id": [
            //             1010
            //         ],
            //         "title": "นอนน้อย เปิดภาพ\"ฮุน เซน\"บัญชาการรบ 3 วันติด | ทันข่าวสุดสัปดาห์ | 27 ก.ค.68",
            //         "url_post": "https://www.youtube.com/watch?v=rm6_KwhXPts",
            //         "views_count": 10217
            //     },
            //     {
            //         "_id": "6885d27b3195697758b74e24",
            //         "source": "youtube",
            //         "uid": "https://www.youtube.com/watch?v=fL21ePKlNwM",
            //         "account_id": "62bdad3ae23655723a1fafbc",
            //         "account_name": "PPTV HD 36",
            //         "account_url": "https://www.youtube.com/@PPTVHD36",
            //         "cluster": [
            //             "ธงชาติไทย",
            //             "ช่อง 3",
            //             "ทหารกัมพูชาร้องเพลงชาติ",
            //             "กัมพูชา",
            //             "การสู้รบ"
            //         ],
            //         "comments": [
            //             {
            //                 "cid": "/@%E0%B8%8A%E0%B8%B2%E0%B8%8D%E0%B8%8A%E0%B8%B1%E0%B8%A2%E0%B8%9A%E0%B8%B1%E0%B8%A7%E0%B9%80%E0%B8%A3%E0%B8%B7%E0%B8%AD%E0%B8%87",
            //                 "author": "@ชาญชัยบัวเรือง",
            //                 "author_link": "/@%E0%B8%8A%E0%B8%B2%E0%B8%8D%E0%B8%8A%E0%B8%B1%E0%B8%A2%E0%B8%9A%E0%B8%B1%E0%B8%A7%E0%B9%80%E0%B8%A3%E0%B8%B7%E0%B8%AD%E0%B8%87",
            //                 "time": "2025-07-27T12:14:47+00:00",
            //                 "text": "ฝากถึงนักข่าว ไปบอกทหารไทย ช่วยล้อมรั้วที่ปราสาทเลย",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_lFC6K7yirG9M_GxpnK_9Yd45HWtRoHq79rwsvyKiQ=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "1"
            //             },
            //             {
            //                 "cid": "/@%E0%B8%97%E0%B8%99%E0%B8%B1%E0%B8%97%E0%B8%8A%E0%B8%B2%E0%B8%82%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B8%B5",
            //                 "author": "@ทนัทชาขันตี",
            //                 "author_link": "/@%E0%B8%97%E0%B8%99%E0%B8%B1%E0%B8%97%E0%B8%8A%E0%B8%B2%E0%B8%82%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B8%B5",
            //                 "time": "2025-07-27T12:14:47+00:00",
            //                 "text": "",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_lFFW-nj60JfhTG590s75U0dWxzJiGsU07Mq2tqA7-t2yj2XpI=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "2"
            //             },
            //             {
            //                 "cid": "/@suporninthat3897",
            //                 "author": "@suporninthat3897",
            //                 "author_link": "/@suporninthat3897",
            //                 "time": "2025-07-27T12:14:47+00:00",
            //                 "text": "ขอโทษครับ หมายถึงช่องอานม้าจุดนี้ก่อนที่จะยิงกัน มันเป็นพื้นที่ของเขมรหราครับ หรือว่าเขมรยึดเอาไปตั้งเป็นฐานทัพของมันครับ",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_n-ipYGNyWfz12ONyTS5rSab8KjOyO2zchxWqeHFrPUeLIIa2HS4OmlreGaAFKDd_6j1g=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": ""
            //             },
            //             {
            //                 "cid": "/@%E0%B8%AA%E0%B8%B8%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B8%9B%E0%B8%B2%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%99",
            //                 "author": "@สุนทรปาระเน",
            //                 "author_link": "/@%E0%B8%AA%E0%B8%B8%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B8%9B%E0%B8%B2%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%99",
            //                 "time": "2025-07-27T12:14:47+00:00",
            //                 "text": "อยู่ดีๆไม่ว่าดี",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_lclbRtFWYhWZ-Kmny64HrzqCwzbAohpmfFhVvMOE4=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": ""
            //             },
            //             {
            //                 "cid": "/@%E0%B9%80%E0%B9%80%E0%B8%A7%E0%B8%A7-%E0%B8%9A9%E0%B8%AE",
            //                 "author": "@เเวว-บ9ฮ",
            //                 "author_link": "/@%E0%B9%80%E0%B9%80%E0%B8%A7%E0%B8%A7-%E0%B8%9A9%E0%B8%AE",
            //                 "time": "2025-07-27T12:14:47+00:00",
            //                 "text": "🇹🇭🫡",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_lqZZRWVeH6XqGcG2ZzeqBwu4JEmbDI7YNnRMhtqBHk1FvxA0I=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "1"
            //             },
            //             {
            //                 "cid": "/@SABu-g2f",
            //                 "author": "@SABu-g2f",
            //                 "author_link": "/@SABu-g2f",
            //                 "time": "2025-07-27T12:14:47+00:00",
            //                 "text": "สุดยอดครับทหารไทย",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_ln-9HYXgytSDFQbDRDb_rgH6bzytH6hE2dknWeVZrk6K8go1x19Eeds3jB779sjKtoDw=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": "4"
            //             },
            //             {
            //                 "cid": "/@Moon-rj3rm",
            //                 "author": "@Moon-rj3rm",
            //                 "author_link": "/@Moon-rj3rm",
            //                 "time": "2025-07-27T12:14:47+00:00",
            //                 "text": "มันกลัวตรงปอยเปตทำไมไม่ถล่มที่นั่นตึก25ชั้นสักลูก",
            //                 "photo": "https://yt3.ggpht.com/XJrAFAGNEgh-6MBXLlg7Nr8aUOD0xTHKjA5gUb3Q3SVugB4Z9tAu8zDZ2RseVv0NBMplGRZJOw=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": ""
            //             }
            //         ],
            //         "comments_count": 9,
            //         "created_on": "2025-07-27T07:14:48.606Z",
            //         "date": "2025-07-27T11:15:02.000Z",
            //         "domain": [
            //             "วันธงชาติไทย",
            //             "จชตและชายแดน",
            //             "ทหารกัมพูชาร้องเพลงชาติ",
            //             "ประจำวัน กัมพูชา",
            //             "ช่องข่าว"
            //         ],
            //         "domain_id": [
            //             393,
            //             230,
            //             88,
            //             196
            //         ],
            //         "engagement": 105,
            //         "followers": 8230000,
            //         "frequencies": [
            //             {
            //                 "word": "เขมร",
            //                 "count": 1
            //             },
            //             {
            //                 "word": "27 ก . ค . 68",
            //                 "count": 1
            //             }
            //         ],
            //         "full_text": "ธงชาติไทยสะบัด! ยึดช่องอานม้า คืนจากเขมร | ทันข่าวสุดสัปดาห์ | 27 ก.ค.68",
            //         "hashtags": [],
            //         "last_update": "2025-07-27T07:14:48.606Z",
            //         "likes_count": 96,
            //         "metadata": {
            //             "processedBy": [
            //                 "http://10.0.8.100:8800/preprocess",
            //                 "http://10.0.8.100:8080/sentiment"
            //             ]
            //         },
            //         "object_id": [
            //             1370,
            //             6937,
            //             7538,
            //             6696
            //         ],
            //         "photos": [
            //             "http://i.ytimg.com/vi/fL21ePKlNwM/hqdefault.jpg"
            //         ],
            //         "post_type": "post",
            //         "processed": true,
            //         "profile_image": "https://yt3.ggpht.com/-mWnxGBf0YTpEDLLVr2bopcwWrA1QADtxCDBI-rDvB0ab8FaBdcSPodsM8hV1Ip9JbK0TGY5UIo=s48-c-k-c0x00ffffff-no-rj",
            //         "reaction": {
            //             "likes": 96,
            //             "dislikes": 0,
            //             "view_count": 3295
            //         },
            //         "sentiment": 0,
            //         "subdomain": [
            //             "ชายแดนกัมพูชา",
            //             "การสู้รบ",
            //             "#วันธงชาติไทย",
            //             "ทหารกัมพูชาร้องเพลงชาติ",
            //             "ช่องทีวี"
            //         ],
            //         "subdomain_id": [
            //             1113,
            //             236,
            //             1650,
            //             1010
            //         ],
            //         "title": "ธงชาติไทยสะบัด! ยึดช่องอานม้า คืนจากเขมร | ทันข่าวสุดสัปดาห์ | 27 ก.ค.68",
            //         "url_post": "https://www.youtube.com/watch?v=fL21ePKlNwM",
            //         "views_count": 3295
            //     },
            //     {
            //         "_id": "6885d34b3195697758b78d2f",
            //         "source": "youtube",
            //         "uid": "https://www.youtube.com/watch?v=iWwFH5rr0K0",
            //         "account_id": "62bdad3ae23655723a1fafbc",
            //         "account_name": "PPTV HD 36",
            //         "account_url": "https://www.youtube.com/@PPTVHD36",
            //         "cluster": [
            //             "ข่าวปลอมเกี่ยวกับโรคระบาด",
            //             "โรงพยาบาลและคลินิก",
            //             "กัมพูชา",
            //             "การสู้รบ",
            //             "ทหารกัมพูชาร้องเพลงชาติ",
            //             "ข่าวปลอมด้านสุขภาพ",
            //             "ช่อง 3"
            //         ],
            //         "comments": [
            //             {
            //                 "cid": "/@PPT25-o5j",
            //                 "author": "@PPT25-o5j",
            //                 "author_link": "/@PPT25-o5j",
            //                 "time": "2025-07-27T12:18:15+00:00",
            //                 "text": "ไม่ต้องรายงานความเคลื่อนไหวในไทยก็ได้ค่ะ เดี๋ยวมันรู้หมด",
            //                 "photo": "https://yt3.ggpht.com/ytc/AIdro_kPnWgPdaEneGRS_lHThnRi4WowEiydFJHvz_TIJ-uZt0uKxLt_qjIlJRs-UBamd5r2HA=s88-c-k-c0x00ffffff-no-rj",
            //                 "vote": ""
            //             }
            //         ],
            //         "comments_count": 3,
            //         "created_on": "2025-07-27T07:18:16.673Z",
            //         "date": "2025-07-27T11:07:51.000Z",
            //         "domain": [
            //             "ความมั่นคง",
            //             "ช่องข่าว",
            //             "จชตและชายแดน",
            //             "ทหารกัมพูชาร้องเพลงชาติ",
            //             "รพ.เซนต์หลุยส์",
            //             "ประจำวัน กัมพูชา"
            //         ],
            //         "domain_id": [
            //             196,
            //             230,
            //             63,
            //             393,
            //             398
            //         ],
            //         "engagement": 20,
            //         "followers": 8230000,
            //         "frequencies": [
            //             {
            //                 "word": "รพ.ละหานทราย",
            //                 "count": 1
            //             },
            //             {
            //                 "word": "27 ก . ค . 68",
            //                 "count": 1
            //             }
            //         ],
            //         "full_text": "ย้ายผู้ป่วย รพ.ละหานทรายหวั่นโดนปืนใหญ่เขมร | ทันข่าวสุดสัปดาห์ | 27 ก.ค.68",
            //         "hashtags": [],
            //         "last_update": "2025-07-27T07:18:16.673Z",
            //         "likes_count": 17,
            //         "metadata": {
            //             "processedBy": [
            //                 "http://10.0.8.100:8800/preprocess",
            //                 "http://10.0.8.100:8080/sentiment"
            //             ]
            //         },
            //         "object_id": [
            //             7538,
            //             822,
            //             7559,
            //             821,
            //             6937,
            //             6696
            //         ],
            //         "photos": [
            //             "http://i.ytimg.com/vi/iWwFH5rr0K0/hqdefault.jpg"
            //         ],
            //         "post_type": "post",
            //         "processed": true,
            //         "profile_image": "https://yt3.ggpht.com/-mWnxGBf0YTpEDLLVr2bopcwWrA1QADtxCDBI-rDvB0ab8FaBdcSPodsM8hV1Ip9JbK0TGY5UIo=s48-c-k-c0x00ffffff-no-rj",
            //         "reaction": {
            //             "likes": 17,
            //             "dislikes": 0,
            //             "view_count": 903
            //         },
            //         "sentiment": 0,
            //         "subdomain": [
            //             "ทั่วไป",
            //             "ชายแดนกัมพูชา",
            //             "ช่องทีวี",
            //             "ปัญหาข่าวปลอม (Fake News)",
            //             "ทหารกัมพูชาร้องเพลงชาติ",
            //             "การสู้รบ"
            //         ],
            //         "subdomain_id": [
            //             174,
            //             1650,
            //             1656,
            //             1010,
            //             1113
            //         ],
            //         "title": "ย้ายผู้ป่วย รพ.ละหานทรายหวั่นโดนปืนใหญ่เขมร | ทันข่าวสุดสัปดาห์ | 27 ก.ค.68",
            //         "url_post": "https://www.youtube.com/watch?v=iWwFH5rr0K0",
            //         "views_count": 903
            //     },
            //     // { title: "Title 1", text: "Lorem ipsum...", icon: "search", color: "bg-purple", bg: "bg-purple text-white", date: "2024-08-10", engagement: 120 },
            //     // { title: "Title 2", text: "Lorem ipsum...", icon: "house-door", color: "bg-warning", bg: "bg-warning text-dark", date: "2024-07-22", engagement: 50 },
            //     // { title: "Title 3", text: "Lorem ipsum...", icon: "envelope", color: "bg-info", bg: "bg-info text-white", date: "2024-08-15", engagement: 250 },
            //     // { title: "Title 4", text: "Lorem ipsum...", icon: "people", color: "bg-danger", bg: "bg-danger text-white", date: "2024-06-05", engagement: 1000 },
            //     // { title: "Title 5", text: "Lorem ipsum...", icon: "telephone", color: "bg-success", bg: "bg-success text-white", date: "2024-09-01", engagement: 500 }
            // ]
        };
    },
    computed: {
        startAndEnd() {
            return [this.start, this.end];
        },
        sortedTimeline() {
            return [...this.timelineItems].sort((a, b) => {
                if (this.sortOrder === "asc") {
                    return new Date(a.date) - new Date(b.date); // เก่า → ใหม่
                } else {
                    return new Date(b.date) - new Date(a.date); // ใหม่ → เก่า
                }
            });
        }
    },
    methods: {
        toggleSort() {
            this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "short",
                day: "numeric"
            });
        },
        dotSize(engagement) {
            // map engagement เป็นขนาด dot
            const minEng = 10;   // ค่าต่ำสุดของ engagement
            const maxEng = 500;  // ค่าสูงสุดของ engagement
            let size = ((engagement - minEng) / (maxEng - minEng)) * (this.maxDotSize - this.minDotSize) + this.minDotSize;
            return Math.max(this.minDotSize, Math.min(this.maxDotSize, size)); // จำกัดช่วง
        },
        apiUserPosts() {
            const isHashtagList = this.$route.query.type === 'hashtaglist';
            this.getLoadPostTab = true;
            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/userposts/getSentimentdetail/",
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
                console.log(response);
                
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
                console.error(error);
            });
        }, 
    }
};
</script>

<style scoped>
.sort-btn{
    background: linear-gradient(90deg,#FDD071 0%, #ffbcbc 100%);
    border: none;
    color: #2c3e50; /* ให้ตัวอักษรอ่านง่าย */
    font-weight: bold;
}
.sort-btn:hover {
  opacity: 0.9;
}
.no-top-right-radius {
  border-top-right-radius: 0 !important;
}
.no-top-left-radius {
  /* border-top-right-radius: 20px !important; */
  border-top-left-radius: 0 !important;
}

.timeline-container {
    position: relative;
    width: 100%;
    max-width: 900px;
    margin: auto;
    padding-bottom: 40px;
}

.timeline-line {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #dee2e6;
    transform: translateX(-50%);
}

.timeline-item {
    position: relative;
    width: 50%;
    padding: 40px 40px;
}

.timeline-item.left {
    left: 0;
    text-align: right;
}

.timeline-item.right {
    left: 50%;
    text-align: left;
}

/* .timeline-dot {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    position: absolute;
    top: 30px;
    z-index: 2;
} */
.timeline-dot {
    border-radius: 50%;
    position: absolute;
    top: 30px;
    z-index: 2;
    /* right: -10%; */
    /* left: 50%; */
    /* transform: translateX(-50%); */
}

.timeline-item.left .timeline-dot {
    right: -9px;
}

.timeline-item.right .timeline-dot {
    left: -9px;
}

.timeline-card {
    /* border: 0px; */
    border-radius: 20px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
}

/* custom color */
/* .bg-purple {
    background-color: #9c27b0 !important;
} */
</style>
