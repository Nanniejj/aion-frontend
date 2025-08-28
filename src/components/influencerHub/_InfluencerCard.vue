<template lang="">
    <b-card 
        :img-src="influencer.profile_image" 
        img-alt="ไม่มีข้อมูลรูปภาพ" 
        img-top
        body-class="text-left p-0"
        img-top-class="rounded-top"
        class="overflow-hidden h-100 p-3 rounded-3"
        footer-bg-variant="white"
        footer-border-variant="white"
        footer-class="border-0 p-0 text-left"
        style="cursor:pointer; border-radius: 2.25rem;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .2);"
        @click="linkToProfile()"
    >
        <div class="bg-custom position-absolute" style="top:10px;left:5px;">
            <b-col cols="auto" class="p-2"> 
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
        
        <b-row  class="m-0 justify-content-between">
            <b-col cols="auto" class="d-flex px-0 mt-1">
                <span style="font-size:18px;" class="font-weight-bold text-truncate mb-0 mr-1">
                    {{ influencer.name || influencer.uid  }}
                </span>
                <span v-if="influencer.age" class="text-secondary">({{influencer.age}} ปี)</span>
            </b-col>
            <b-col cols="auto" class="px-0 mt-1"> 
                <b-badge v-if="influencer.species" class="mr-2 badge-custom" pill>
                    {{ getSpeciesName(influencer.species) }}
                </b-badge>
                <b-badge v-if="influencer.sex" pill :class="'badge-' + influencer.sex">{{ getSexText(influencer.sex) }}</b-badge>
            </b-col>
            <b-col cols="12" v-if="influencer.department" style="font-size:14px"  class="text-secondary px-0">
                {{ getDepartmentType(influencer.department) }} 
            </b-col>
        </b-row>
        <b-row class="m-0 my-2">
            <b-col v-if="provinceName || districtName || subDistrictName" class="d-flex px-0" style="font-size: 14px">
                <i class="fa fa-map-marker mr-2" style="color: #fed06ea4;"/>
                <span >
                    {{ provinceName }} {{ `, ${districtName}` }} {{ `, ${subDistrictName}` }}
                </span>
                <!-- <span v-else class="text-secondary" style="font-size: 13px">ไม่ระบุพื้นที่</span> -->
            </b-col>
        </b-row>
        <b-card-text>
            <b-row cols="2" align-v="end" class="my-3 mx-0">
                <b-col class="text-center">
                    <div v-b-tooltip.hover="'ผู้ติดตาม: ' + (influencer.followers ? influencer.followers.toLocaleString() : '0')"   class="bold text-info" style="font-size:18px;">{{ formatNumber(influencer.followers) }}</div>
                    <div style="font-size:14px;">Followers</div>
                </b-col>
                <b-col class="text-center border-left">
                    <div v-b-tooltip.hover="'กำลังติดตาม: ' + (influencer.followings ? influencer.followings.toLocaleString() : '0')"  class="bold text-info" style="font-size:18px;">{{ formatNumber(influencer.followings) }}</div>
                    <div style="font-size:14px;">Following</div>
                </b-col>
            </b-row>
        </b-card-text>
        <template #footer>
            <div class=" mt-2">
                <b-badge style="background-color:#fed06ea4 !important;" class="mr-2" v-for="(item, index) in influencerTypes" :key="index" pill variant="light" >
                    {{ item.text }}
                </b-badge>
            </div>
        </template>
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
    .badge-male {
        color: #17a2b8; /* สี info */
        border: 1px solid #17a2b8;
        background-color: transparent;
    }
    .badge-female {
        color: #ffbcbc; /* สี info */
        border: 1px solid #ffbcbc;
        background-color: transparent;
    }
    /* .badge-lgbtq+ {
        color: #ffbcbc; 
        border: 1px solid #ffbcbc;
        background-color: transparent;
    } */
    .badge-custom{
        color: #2c3e50;
        background: linear-gradient(90deg,#FDD071  0%,  #ffbcbc 100%);
    }
    .bg-custom{
        background-color: rgb(255, 255, 255);
        border-bottom-left-radius: 50%;
        border-bottom-right-radius: 50%;
        border-top-left-radius: 50%;
        border-top-right-radius: 50%;
        z-index: 2;
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
        width: 55px;
    }

    .card-img, .card-img-bottom, .card-img-top {
        flex-shrink: 0;
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 1.25rem;
        
    }

    .card-body {
        padding-top:30px;
        z-index: 1;
  
    }
</style>