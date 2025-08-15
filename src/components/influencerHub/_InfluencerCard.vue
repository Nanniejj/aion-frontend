<template lang="">
    <b-card 
        :img-src="influencer.profile_image" 
        img-alt="Image" img-top
        body-class="rounded-bottom text-left pb-3 px-3"
        img-top-class="rounded-top"
        overlay
        class="overflow-hidden h-100"
        style="cursor:pointer;"
        @click="linkToProfile()"
    >
        <div class="bg-custom position-absolute" :class="'bg-' + influencer.source"  style="top:-180px">
            <b-col cols="auto" class="p-1"> 
                <div class="bg-white rounded-circle">
                    <img v-if="influencer.source == 'twitter'" src="@/assets/Twitter.png" class="social-imgs" />
                    <img v-if="influencer.source == 'facebook'" src="@/assets/Facebook.png" class="social-imgs" />
                    <img v-if="influencer.source == 'pantip'" src="@/assets/board.png" class="social-imgs" />
                    <img v-if="influencer.source == 'blockdit'" src="@/assets/Blockdit.png" class="social-imgs" />
                    <img v-if="influencer.source == 'instagram'" src="@/assets/Instagram.png" class="social-imgs" />
                    <img v-if="influencer.source == 'youtube'" src="@/assets/Youtube.png" class="social-imgs" />
                    <img v-if="influencer.source == 'news'" src="@/assets/News.png" class="social-imgs" />
                    <img v-if="influencer.source == 'tiktok'" src="@/assets/Tiktok.png" class="social-imgs" />
                    <img v-if="influencer.source == 'threads'" src="@/assets/Threads.png" class="social-imgs" />
                </div>
            </b-col>
        </div>
        <!-- <div class=" mt-2 position-absolute" style="top:5px">
            <b-badge style="background-color:#ffe6e6 !important;" class="mr-2" v-for="(item, index) in influencerTypes" :key="index" pill variant="light" >
                {{ item.text }}
            </b-badge>
        </div> -->
        <b-row  class="py-3 justify-content-between">
            <b-col cols="auto" class="d-flex pr-0">
                <h5 class="font-weight-bold text-truncate mb-0 mr-1">
                    {{ influencer.name || influencer.uid  }}
                </h5>
                <span v-if="influencer.age" class="text-secondary">({{influencer.age}} ปี)</span>
                <!-- <span v-else class="text-secondary" style="forn-size:14px">ไม่ระบุอายุ</span> -->
                
                <!-- <div class="d-flex align-items-center text-secondary" style="font-size: 14px">
                    <i class="fa fa-tag mr-2"/>
                    <span v-if="influencer.department">{{ getDepartmentType(influencer.department) }}</span>
                    <span v-else>ไม่ระบุประเภทธุรกิจ</span>
                </div> -->
                <!-- {{influencer.source}} -->
            </b-col>
            <b-col cols="auto" class=""> 
                <b-badge v-if="influencer.species" class="mr-2" style="background-color: #fed06ea4; color: #2c3e50;" pill>
                    {{ getSpeciesName(influencer.species) }}
                </b-badge>
                <b-badge v-if="influencer.sex" pill variant="info">{{ getSexText(influencer.sex) }}</b-badge>
            </b-col>
            <b-col cols="12" v-if="influencer.department" style="font-size:14px"  class="text-secondary">
                {{ getDepartmentType(influencer.department) }} 
            </b-col>
        </b-row>

        <b-card-text>
            <b-row cols="2" class="mb-3">
                <b-col class="text-center">
                    <div v-b-tooltip.hover="'ผู้ติดตาม: ' + (influencer.followers ? influencer.followers.toLocaleString() : '0')"   class="bold" style="font-size:18px;">{{ formatNumber(influencer.followers) }}</div>
                    <div style="font-size:14px;">Followers</div>
                </b-col>
                <b-col class="text-center">
                    <div v-b-tooltip.hover="'กำลังติดตาม: ' + (influencer.followings ? influencer.followings.toLocaleString() : '0')"  class="bold" style="font-size:18px;">{{ formatNumber(influencer.followings) }}</div>
                    <div style="font-size:14px;">Following</div>
                </b-col>
            </b-row>
            <b-row align-v="end" class="m-0">
                <b-col class="d-flex px-0" style="font-size: 14px">
                    <i class="fa fa-map-marker mr-2" style="color: #fed06ea4;"/>
                    <span v-if="provinceName || districtName || subDistrictName">
                        {{ subDistrictName }} {{ districtName }} {{ provinceName }}
                    </span>
                    <span v-else class="text-secondary" style="font-size: 13px">ไม่ระบุพื้นที่</span>
                </b-col>
            </b-row>
            <div class=" mt-2">
                <b-badge style="background-color:#ffe6e6 !important;" class="mr-2" v-for="(item, index) in influencerTypes" :key="index" pill variant="light" >
                    {{ item.text }}
                </b-badge>
            </div>
        </b-card-text>
    </b-card>
</template>
<script>

export default {
    props: {
        influencer: {
            type: Object,
            // required: true
        },
        influencerTypes: {
            type: Array,
            default: () => ([])
        },
    },
    data() {
        return {
            provinceName: null,
            districtName: null,
            subDistrictName: null,
            sexs: [
                {text: 'ไม่ระบุเพศ', value:'other'},
                {text: 'ชาย', value:'male'},
                {text: 'หญิง', value:'female'},
                {text: 'LGBTQ+', value:'lgbtq+'},
            ],
            departmentTypes: [
                { text: "อุตสาหกรรมและการผลิต", value: "manufacturing" },
                { text: "การค้าและค้าปลีก", value: "retail" },
                { text: "การเงินและการธนาคาร", value: "finance" },
                { text: "การแพทย์และสาธารณสุข", value: "healthcare" },
                { text: "ก่อสร้างและอสังหาริมทรัพย์", value: "construction" },
                { text: "ขนส่งและโลจิสติกส์", value: "logistics" },
                { text: "เทคโนโลยีสารสนเทศ (IT)", value: "it" },
                { text: "การศึกษา", value: "education" },
                { text: "สื่อสาร / โฆษณา / การตลาด", value: "media_marketing" },
                { text: "อาหารและเครื่องดื่ม", value: "food_beverage" },
                { text: "การท่องเที่ยวและโรงแรม", value: "tourism" },
                { text: "บันเทิงและสันทนาการ", value: "entertainment" },
                { text: "กฎหมายและที่ปรึกษา", value: "legal_consulting" },
                { text: "ความงาม / สุขภาพ / ไลฟ์สไตล์", value: "lifestyle" },
                { text: "สังคม / องค์กรไม่แสวงกำไร", value: "nonprofit" },
                
            ],
            speciesTypes:[
                { text: 'บุคคลทั่วไป', value: 'people' },
                { text: 'ดารา / นักแสดง / ศิลปิน', value: 'actor' },
                { text: 'ผู้เชี่ยวชาญ', value: 'expert' },
                { text: 'สัตว์เลี้ยง', value: 'pet' },
                { text: 'แบรนด์ / ร้านค้า', value: 'brand' },
                { text: 'องค์กร / บริษัท', value: 'company' },
                { text: 'บัญชีอัตโนมัติ / บอท / AI', value: 'bot' },
                { text: 'ตัวละครในจินตนาการ / การ์ตูน / หนัง', value: 'fictional' },
                { text: 'เด็ก / ทารก', value: 'kid' },
                { text: 'คู่รัก / ครอบครัว', value: 'family' },
                { text: 'สัตว์ธรรมชาติ / สัตว์ป่า', value: 'wild_animal' },
                { text: 'ไม่ระบุ', value: 'nolabel' }
            ]
        }
    },
    methods: {
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
        linkToProfile() {
            const routeData = this.$router.resolve({
                name: "MonitorProfile",
                query: {
                    id: this.influencer._id,
                    uid: this.influencer.uid?.replace('#', ''),  // ลบ '#' ออกถ้ามี
                    source: this.influencer.source,
                    type: 'targetlist'
                },
            });
            window.open(routeData.href, "_blank"); // เปิดลิงก์ในหน้าต่างใหม่
        },
        getSexText(val) {
            console.log(val);
            if (!val) {
                return 'ไม่ระบุเพศ'
            } else {
                let sex = this.sexs.find(item => item.value === val)
                return sex.text
            }
        },
        getDepartmentType(id) {
            let found =  this.departmentTypes.find(item => item.value === id)
            return found ? found.text : '';
        },
        getSpeciesName(id) {
            let found =  this.speciesTypes.find(item => item.value === id)
             return found ? found.text : '-';
        },
        async getProvinceNameById(id) {
            try {
                const config = {
                    method: "get",
                    url: "https://api2.cognizata.com/api/v2/location/getProvinces",
                    params: { id: id },
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },
                };
                const response = await this.axios(config);
                let result = response.data.data[0] || [];
                console.log("procince === ",result.name_th);
                return result.name_th;
            }catch (error) {
                console.error("apiGetInfluencers error:", error);
                return null;
                // this.influencers = [];
            }
            // finally {
            //     this.loading = false; // จะทำงานเสมอ ไม่ว่าผลจะ success หรือ error
            // }
        },
        async getDistrictNameById(id) {
            try {
                const config = {
                    method: "get",
                    url: "https://api2.cognizata.com/api/v2/location/getAmphures",
                    params: { id: id },
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },
                };
                const response = await this.axios(config);
                let result = response.data.data[0] || [];
                console.log("procince === ",result.name_th);
                return result.name_th;
            }catch (error) {
                console.error("apiGetInfluencers error:", error);
                return null;
                // this.influencers = [];
            }
            // finally {
            //     this.loading = false; // จะทำงานเสมอ ไม่ว่าผลจะ success หรือ error
            // }
        },
        async getSubDistrictNameById(id) {
            try {
                const config = {
                    method: "get",
                    url: "https://api2.cognizata.com/api/v2/location/getTambons",
                    params: { id: id },
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },
                };
                const response = await this.axios(config);
                let result = response.data.data[0] || [];
                console.log("procince === ",result.name_th);
                return result.name_th;
            }catch (error) {
                console.error("apiGetInfluencers error:", error);
                return null;
                // this.influencers = [];
            }
            // finally {
            //     this.loading = false; // จะทำงานเสมอ ไม่ว่าผลจะ success หรือ error
            // }
        },
    },
    watch: {
        'influencer.location': {
            immediate: true,
            async handler(newVal) {
            if (Array.isArray(newVal) && newVal.length > 0) {
                this.provinceName = await this.getProvinceNameById(newVal[0]) || '';
                this.districtName = newVal[1] ? await this.getDistrictNameById(newVal[1]) : '';
                this.subDistrictName = newVal[2] ? await this.getSubDistrictNameById(newVal[2]) : '';
            } else {
                this.provinceName = '';
                this.districtName = '';
                this.subDistrictName = '';
            }
            }
        }
    }

}
</script>
<style scoped>
    .bg-custom{
        background-color: aliceblue;
        border-bottom-left-radius: 50%;
        border-bottom-right-radius: 50%;
        /* padding-left: 10px;
        padding-right: 10px;
        padding-bottom: 5px; */
    }
    .bg-twitter    { background-color: #595a5b; } /* ฟ้า Twitter */
    .bg-facebook   { background-color: #438afe; } /* น้ำเงิน Facebook */
    .bg-pantip     { background-color: #521d85; } /* ม่วง Pantip */
    .bg-blockdit   { background-color: #336db6; } /* เทาเข้ม Blockdit */
    .bg-instagram  { background: linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4); }
    .bg-youtube    { background-color: #ef464a; } /* แดง YouTube */
    .bg-news       { background-color: #f1a839; } /* ส้ม News */
    .bg-tiktok     { background-color: #3f2e4c; } /* ดำ TikTok */
    .bg-threads    { background-color: #000000; } /* ดำ Threads */

    .social-imgs {
        width: 45px;
    }

    .card-img, .card-img-bottom, .card-img-top {
        flex-shrink: 0;
        width: 100%;
        height: 210px;
        object-fit: cover;
        
    }

    .card-body {
        backdrop-filter: blur(12px);
        position: relative;
        margin-top: -30px;
        box-shadow: none !important;
        text-shadow: none !important;
        background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0) 0%,      /* โปร่งใสด้านบน */
            rgba(255, 255, 255, 0.4) 40%,   /* เริ่มขาวขึ้น */
            rgba(255, 255, 255, 0.8) 60%,  /* ขาวเกือบทึบ */
            rgba(255, 255, 255, 1) 90%     /* ขาวทึบด้านล่าง */
        );
        padding-top:30px;
        z-index: 1;
    
    }
</style>