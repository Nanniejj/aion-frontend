<template>
    <div>
        <!-- avatar  -->
        <b-row class="m-0">
            <b-col md="4" class="px-0 pr-lg-3">
                <div class="gradient-bg h-100" style="">
                    <b-row v-if="profile" class="m-0">
                        <b-col class="py-3">
                            <span>
                                <b-avatar v-if="type == 'hashtaglist'" text="#" class="shadow-sm rounded badge-light rounded-circle"
                                    size="140px">
                                </b-avatar>
                                <b-avatar v-else size="140px" class="p-1 bg-white border border-light shadow">
                                    <span v-if="data.profile_image">
                                        <b-avatar 
                                            :src="data.profile_image"
                                            @error="setAltImg"
                                            size="120px" 
                                            loading="lazy"
                                            class="shadow-sm rounded badge-light rounded-circle shadow"
                                        >
                                            <!-- <img
                                                :src="data.profile_image"
                                                @error="setAltImg"
                                                class="shadow-sm rounded badge-light rounded-circle shadow"
                                                style="object-fit: cover;"
                                                loading="lazy"
                                            /> -->
                                        </b-avatar>
                                    </span>
                                    <span v-else>
                                        <b-avatar class="shadow-sm rounded badge-light rounded-circle"
                                            size="120px">
                                        </b-avatar>
                                    </span>
                                </b-avatar>
                                <span class="left">
                                    <img v-if="profile.source == 'twitter'" src="@/assets/Twitter.png"
                                        class="social-img" />
                                    <img v-else-if="profile.source == 'facebook'" src="@/assets/Facebook.png"
                                        class="social-img" />
                                    <img v-if="profile.source == 'news'" src="@/assets/News.png" class="social-img" />
                                    <img v-if="profile.source == 'pantip'" src="@/assets/Pantip.png"
                                        class="social-img" />
                                    <img v-if="profile.source == 'instagram'" src="@/assets/Instagram.png"
                                        class="social-img" />
                                    <img v-if="profile.source == 'youtube'" src="@/assets/Youtube.png"
                                        class="social-img" />
                                    <img v-if="profile.source == 'blockdit'" src="@/assets/Blockdit.png"
                                        class="social-img" />
                                    <img v-if="profile.source == 'tiktok'" src="@/assets/Tiktok.png"
                                        class="social-img" />
                                    <img v-if="profile.source == 'threads'" src="@/assets/Threads.png"
                                        class="social-img" />
                                </span>
                            </span>
                            <div class="h6 py-2">
                                <a v-if="type == 'hashtaglist'" class="" v-bind:href="profile.link_original" target="_blank"
                                    style="color: #2c3e50"> 
                                    <h4 class="py-2" v-if="type === 'hashtaglist'">{{ profile.uid}}</h4>
                                    <i class="fa fa-external-link text-info" v-if="type == 'targetlist'" /><br>
                                    ({{ totalPost | numFormat }} posts)
                                </a> 
                                <a v-else class="" v-bind:href="profile.link_original" target="_blank"
                                    style="color: #2c3e50"> 
                                       <h4 class="py-2">{{ profile.name || profile.uid || data.account_name}}</h4>
                                    <i class="fa fa-external-link text-info" v-if="type == 'targetlist'" />
                                </a> 
                            </div>
                        </b-col>
                    </b-row>
                </div>
            </b-col>
            <b-col md="8" class="text-left px-0 pl-lg-3">
                <!-- <h4 class="py-2" v-if="type === 'hashtaglist'">{{ profile.uid}}</h4>
                <h4 class="py-2" v-else>{{ profile.name || profile.uid || data.account_name}}</h4> -->

                <!-- <b-badge v-if="profile.species" variant="info" class="mr-1 text-capitalize" pill>{{ getSpeciesName(profile.species) }}</b-badge>
                <b-badge v-if="profile.department" class="mr-2" style="background-color: #fed06ea4; color: #2c3e50;" pill>
                    {{ getDepartmentType(profile.department) }}
                </b-badge> -->
                
                <b-card-text v-if="type !== 'hashtaglist'" class="my-2">
                    <b-row class="py-2">
                        <b-col class="text-capitalize text-info d-flex align-content-center">
                            <i v-if="editable" class="fa fas fa-pen mr-1"></i>
                            <h5 class="font-weight-bold">about me</h5>
                        </b-col>
                        <b-col cols="auto">
                            <div v-if="!editable" class="d-flex justify-content-end">
                                <b-button variant="info" @click="editProfile()" size="small">
                                    <i class="fa fa-edit mr-1"></i> แก้ไขข้อมูล
                                </b-button>
                            </div>
                            <div v-else class="d-flex justify-content-between" style="gap: 10px;">
                                <b-button variant="success" @click="confirmUpdate()">
                                    <i class="fa fa-save mr-1"></i> บันทึก
                                </b-button>
                                <b-button variant="danger" @click="editProfile()">
                                    <i class="fa fa-times mr-1"></i> ยกเลิก
                                </b-button>
                            </div>
                        </b-col>
                    </b-row>
                    <div class="col-12">
                        <b-row >
                            <b-col cols="12 mb-2 px-0">
                                <b-badge v-if="profile.species" variant="info" class="mr-1 text-capitalize" pill>{{ getSpeciesName(profile.species) }}</b-badge>
                                <b-badge v-if="profile.department" class="mr-2" style="background-color: #fed06ea4; color: #2c3e50;" pill>
                                    {{ getDepartmentType(profile.department) }}
                                </b-badge>
                            </b-col>
                            <b-col cols="12" class="text-left">
                                <b-row cols="2"  cols-sm="2" class="">
                                    <b-col class="my-2">
                                        <b-row class="">
                                            <b-col cols="auto">
                                                <i class="fas fa-transgender-alt fa-2x d-inline" style="color: #fed06ea4;"/>
                                            </b-col>
                                            <b-col cols="auto">
                                            <div class="text-icon text-center">
                                                <b>{{ getsexTh(profile.sex) }}</b>
                                            </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                    <b-col class="my-2">
                                        <b-row class="">
                                            <b-col cols="auto">
                                                <i class="fa fa-birthday-cake fa-2x d-inline" style="color: #fed06ea4;"/>
                                            </b-col>
                                            <b-col cols="auto">
                                                <div class="text-icon text-center">
                                                    <b>{{ profile.age ? `${profile.age} ปี` : 'ไม่ระบุอายุ' }}</b>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                    <b-col class="my-2">
                                        <b-row class="">
                                            <b-col cols="auto">
                                                <i class="fa fas fa-users fa-2x d-inline" style="color: #fed06ea4;"/>
                                            </b-col>
                                            <b-col cols="auto">
                                            <div class="text-icon text-center">
                                                <b>{{ profile.followers| numFormat }}</b>
                                                Followers
                                            </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                    <b-col class="my-2">
                                        <b-row class="">
                                            <b-col cols="auto">
                                                <i class="fa fas fa-star fa-2x d-inline" style="color: #fed06ea4;"/>
                                            </b-col>
                                            <b-col cols="auto">
                                                <div class="text-icon text-center">
                                                    <b>{{ profile.following| numFormat }}</b>
                                                    Following
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </b-row>
                            </b-col>
                            
                            <b-col cols="12" class="my-2">
                               <b-row class="">
                                    <b-col cols="auto">
                                        <i class="fa fa-map-marker fa-2x d-inline" style="color: #fed06ea4;"/>
                                    </b-col>
                                    <b-col cols="auto">
                                    <div v-if="profile.province" class="text-icon text-center">
                                        <b>{{ profile.province }}</b>
                                    </div>
                                    <div v-else class="text-icon text-center">
                                        <b>ไม่ระบุพื้นที่</b>
                                    </div>
                                    </b-col>
                                </b-row>
                            </b-col> 
                        </b-row>
                    </div>
                    
                    <!-- {{ profile }} -->
                </b-card-text>
            </b-col>
        </b-row>
        <!-- {{ profile }} -->
        <!-- influencer type -->
        <b-row v-if="profile.influencer_type && profile.influencer_type.length !== 0" class="my-5 mx-0">
            <div class="col-12">
                <h5 class="text-center font-weight-bold py-2">หมวดหมู่ Influencer</h5>
            </div>
            <div class="col-12">
                <b-row cols="1" cols-sm="3" cols-lg="6" class="px-2 py-3 w-100" style="background-color: #fed06ea4; border-radius: 90px;">
                    <b-col v-for="(item, index) in profile.influencer_type" :key="index">
                        <b-row>
                            <b-col cols="12">
                                <b-avatar icon="people-fill" size="6rem"></b-avatar>
                            </b-col>
                            <b-col cols="12">
                            <div class="text-icon">
                                {{ getInfluencerTypeName(item) }}
                            </div>
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col v-for="(item, index) in profile.influencer_type" :key="index">
                        <b-row>
                            <b-col cols="12">
                                <b-avatar icon="people-fill" size="6rem"></b-avatar>
                            </b-col>
                            <b-col cols="12">
                            <div class="text-icon">
                                {{ getInfluencerTypeName(item) }}
                            </div>
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col >
                        <b-row>
                            <b-col cols="12">
                                <b-avatar icon="people-fill" size="6rem"></b-avatar>
                            </b-col>
                            <b-col cols="12">
                            <div class="text-icon">
                                Messages
                            </div>
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col>
                        <b-row>
                            <b-col cols="12">
                                <b-avatar :text="`+${profile.influencer_type.length}`" size="6rem"></b-avatar>
                            </b-col>
                            <b-col cols="" class="px-0">
                                More
                                <!-- <div class="text-icon">
                                    Messages
                                </div> -->
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </div>
        </b-row>

        <!-- woldCloud -->
        <b-row class="my-5 mx-0">
            <!-- <div class="col-12">
                <h5 class="font-weight-bold py-2">Word Cloud</h5>
            </div> -->
            <div class="col-12">
                <b-row cols="1" cols-md="2">
                    <b-col class="p-3">
                        <ProfileWordCloud 
                            :loading="loadWordCloud"
                            title="Word Cloud Domain"
                            :wordcloud_image="wordcloud_images.words"
                            :width="600" 
                            :height="400" 
                        />
                    </b-col>
                    <b-col class="p-3">
                        <ProfileWordCloud 
                            :loading="loadWordCloud"
                            title="Word Cloud Hashtag"
                            :wordcloud_image="wordcloud_images.hashtag"
                            :width="600" 
                            :height="400" 
                        />
                    </b-col>
                </b-row>
            </div>
        </b-row>

        <!-- posts -->
        <TabPost 
            :topDomain="topDomain" 
            :isBottom="alreadyAtBottom"
            :keyWord="keyWord"
            @totalPost="data =>totalPost = data"
        />
    </div>
</template>
<script>
import TabDomain from "./profileTabs/_TabDomain.vue"
import TabHashtag from "./profileTabs/_TabHashtag.vue"
import TabPost from "./profileTabs/_TabPost.vue"
import Swal from 'sweetalert2'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

import ProfileWordCloud from './profileTabs/_ProfileWordCloud.vue'
export default {
    components: {
        TabDomain,
        TabHashtag,
        TabPost,
        Multiselect,
        ProfileWordCloud
    },
    data() {
        return {
            alreadyAtBottom: false,
            type:this.$route.query.type,
            default_avatar: "user.svg",
            load: false,
            loadWordCloud: false,
            loadPost: false,
            data: [],
            profile: {},
            totalPost: 0,
            category: 'domain',
            account_name: null,
            editable: false,
            selectedData: {
                species: null,
                influencer_type:[],
                influencer_condition: null,
                sex: null,
                age: null,
                location: null,
                province: null,
                followers: null,
                following: null,
                bot_level: 1,
                email: '',
                phone:'' , 
                name: '', 
                profile_image: null
            },
            selectedProvince: 10,
            provinces: [],
            sexs: [
                {text: 'ไม่ระบุ', value:'other'},
                {text: 'ชาย', value:'male'},
                {text: 'หญิง', value:'female'},
                {text: 'LGBTQ+', value:'lgbtq+'},
            ],
            topDomain: [],
            topHashtags: [],
            posts:[],
            influencerTypes:[],
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
            ],
            influConditions: [
                {text: 'เลือกระดับ Influencer', value: null,  disabled: true },
                {text: 'ผู้มีอิทธิพลจากยอดติดตาม', value:'follower'},
                {text: 'ผู้มีอิทธิพลจากโพส', value:'impact'},
                {text: 'คนทั่วไป', value:'none'},
                // {text: 'เลือกระดับ Influencer', value: null},
                // {text: 'ผู้ติดตามมากกว่า 1 ล้านคน', value:'topStar'},
                // {text: 'ผู้ติดตามมากกว่า 1 แสน - 1 ล้านคน', value:'macro'},
                // {text: 'ผู้ติดตามมากกว่า 1 หมื่น - 1 แสนคน', value:'micro'},
                // {text: 'ผู้ติดตามมากกว่า 1 พัน - 1 หมื่นคน', value:'nano'},
                // {text: 'ผู้ติดตามมากกว่า 1 - 1 พันคน', value:'endUser'},
            ],
            // dataHashtagCloud:[],
            // dataWordCloud: [],
            wordcloud_images: [],
            keyWord: null,
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
                
            ]
        }
    },
    methods: {
        setKeyWord(word) {
            this.keyWord = word;
        },
        onlyNumber(e) {
            const char = String.fromCharCode(e.keyCode);
            if (!/[0-9]/.test(char)) {
            e.preventDefault();
            }
        },
        handleScroll(event) {
            const el = event.target;
            const bottom = el.scrollTop + el.clientHeight;
            const isBottom = bottom >= el.scrollHeight - 10;

            // ถ้าเลื่อนถึงล่างสุด และยังไม่เคย log
            if (isBottom && !this.alreadyAtBottom) {
                console.log("isAtBottom : true");
                this.alreadyAtBottom = true;

            // ถ้ามีโหลด data ก็เรียกได้ที่นี่
            // this.fetchMorePosts();
            }

            // ถ้าหลุดจากล่างสุดแล้ว reset flag
            if (!isBottom && this.alreadyAtBottom) {
                this.alreadyAtBottom = false;
            }
        },
        checkProfile() {
            if (this.profile) {
                const p = this.profile;
                this.selectedData = {
                    species: p.species ?? null,
                    influencer_type: Array.isArray(p.influencer_type)
                        ? p.influencer_type.map(id =>
                            this.influencerTypes.find(item => item.value === id)
                        ).filter(Boolean) // กรอง null เผื่อหาไม่เจอ
                        : [],
                    influencer_condition: p.influencer_condition ?? null,
                    sex: p.sex ?? null,
                    age: p.age ?? null,
                    location: p.location ?? null,
                    province: p.province ?? null,
                    bot_level: p.bot_level ?? 1,
                    email: p.email ?? '',
                    phone: p.phone ?? '',
                    name: p.name ?? '',
                    followers: p.followers ?? null,
                    following: p.following ?? null,
                    profile_image: this.data.profile_image ?? null
                };
            }
            // console.log("seleted ==== ", this.selectedData);
            
        },
        formatPhone(value) {
            const cleaned = value.replace(/\D/g, '').substring(0, 10);

            if (cleaned.length >= 7) {
            return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
            } else if (cleaned.length >= 4) {
            return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
            }
            return cleaned;
        },
        editProfile() {
            this.editable = !this.editable;
            this.checkProfile()
            console.log('editable ', this.editable);
        },
        getProvinceName(id) {
            this.profile.province =  this.provinces.find(item => item.value === id).text
        },
        getsexTh(sex) {
            const found =  this.sexs.find(item => item.value === sex)
            return found ? found.text : 'ไม่ระบุเพศ';
        },
        getInfluencerTypeName(id) {
            const found = this.influencerTypes.find(item => item.value === id)
            return found ? found.text : '-';
        },
        getInfluConditions(value) {
            console.log(value);
            if (value == null) {
                return '-';
            }
            const found = this.influConditions.find(item => item.value === value);
            console.log(found);
            
            return found ? found.text : '-';
        },
        getSpeciesName(id) {
            let found =  this.speciesTypes.find(item => item.value === id)
             return found ? found.text : '-';
        },
        getDepartmentType(id) {
            let found =  this.departmentTypes.find(item => item.value === id)
             return found ? found.text : '-';
        },
        confirmUpdate() {
            Swal.fire({
                title: 'คุณแน่ใจหรือไม่?',
                text: 'คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ใช่, บันทึกเลย!',
                cancelButtonText: 'ยกเลิก',
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    const iconContent = document.querySelector('.swal2-icon-content');
                    if (iconContent) iconContent.style.display = 'none';
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    this.apiUpdateProflie()
                    // Swal.fire('บันทึกแล้ว!', 'ข้อมูลของคุณถูกบันทึกเรียบร้อย', 'success')
                } else {
                    Swal.fire('ยกเลิก', 'ยกเลิกการบันทึกข้อมูลเรียบร้อย', 'error')
                }
            })
        },
        setAltImg(event) {
            event.target.src = this.default_avatar;
        },
        getWordCloudImage() {
            this.loadWordCloud = true;
            const config = {
                method: "get",
                url: "https://api.cognizata.com/api/v1/getMonitor/",
                params: {
                    query: this.$route.query.uid.replace(/^#/, ''),
                    api_type: this.$route.query.type?.toLowerCase() === 'targetlist' ? 'account' : 'hashtag',
                    top_type: "domain",

                    // type: this.$route.query.type,
                    source: this.$route.query.source,
                    // id: this.$route.query.id,
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };
            console.log(config.params);
            
            this.axios(config)
            .then((response) => {
                this.wordcloud_images = response.data.wordcloud_images || [];
                console.log('this.wordcloud_images ', this.wordcloud_images);
                this.loadWordCloud = false;
            })
            .catch((error) => {
                this.loadWordCloud = false;
                console.error(error);
            });
        },
        async apiMonitorProfile() {
            this.load = true;
            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/monitor/getProfile",
                params: {
                    type: this.$route.query.type,
                    source: this.$route.query.source,
                    id: this.$route.query.id,
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            this.axios(config)
            .then(async (response) => {
                this.data = response.data || [];
                console.log('this.data ', this.data);
                // this.data.profile_image = await this.checkImage(response.data.profile_image);
                // console.log("image === ",this.data.profile_image);
            
                this.profile = response.data?.profile
                if (!('followers' in this.profile)) {
                    this.profile.followers = null; // หรือใส่ 0 ก็ได้
                }
                if (!('following' in this.profile)) {
                    this.profile.following = null; // หรือใส่ 0 ก็ได้
                }
                this.topDomain = response.data?.topDomain
                this.topHashtags = response.data?.topHashtag
                console.log('this.profile ', this.profile);
                this.checkProfile();
                this.load = false;
            })
            .catch((error) => {
                this.load = false;
                console.error(error);
            });
        },
        apiGetProvinces() {
            this.load = true;
            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/location/getProvinces",
                // params: {
                //     type: this.$route.query.type,
                //     source: this.$route.query.source,
                //     id: this.$route.query.uid,
                // },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            this.axios(config)
            .then((response) => {
                let result = response.data.data || [];
                console.log(result);
                
                this.provinces = result.map(province => ({
                    text: province.name_th,
                    value: province.id
                }));
                console.log('this.provinces ', this.provinces);

                // this.profile = response.data?.profile
                // console.log('this.profile ', this.profile);
                this.load = false;
            })
            .catch((error) => {
                this.load = false;
                console.error(error);
            });
        },
        apiGetInfluencerType() {
            this.load = true;
            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/monitor/getInfluencerType",
                // params: {
                //     type: this.$route.query.type,
                //     source: this.$route.query.source,
                //     id: this.$route.query.uid,
                // },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            this.axios(config)
            .then((response) => {
                // console.log(response);
                let result = response.data || [];
                
                this.influencerTypes = result.map(type => ({
                    value: type.id,
                    text: type.name
                }));
                // this.provinces = result.map(province => ({
                //     text: province.name_th,
                //     value: province.id
                // }));
                console.log('this.influencerTypes ===== ', this.influencerTypes);
                // this.influencerTypes.map(type => ({
                //     value: type._id,     // หรือ type.id ก็ได้ ขึ้นกับ backend
                //     text: type.name
                // }));
                // this.profile = response.data?.profile
                // console.log('this.profile ', this.profile);
                this.load = false;
            })
            .catch((error) => {
                this.load = false;
                console.error(error);
            });
        },
        apiUpdateProflie() {
            this.load = true;
            let rawData = {
                "data": [{
                    // type: this.$route.query.type,
                    // "uid": "test0122"
                    // "URL": "https://www.facebook.com/12345678912",
                    // "target_type":"pageList",
                    _id: this.$route.query.id,
                    key: this.$route.query.type === 'targetlist'? 'account': this.$route.query.type === 'hashtaglist'? 'hashtag': '',
                    source:this.$route.query.source,
                    species:this.selectedData.species, 
                    sex: this.selectedData.sex,
                    age: this.selectedData.age === 0 ? null : this.selectedData.age, 
                    influencer_type: this.selectedData.influencer_type.map(item => item.value), 
                    influencer_condition: this.selectedData.influencer_condition, 
                    location: this.selectedData.location, 
                    province: this.selectedData.province,
                    bot_level: this.selectedData.bot_level,
                    name: this.selectedData.name,
                    followers : this.selectedData.followers,
                    following: this.selectedData.following,
                    profile_image : this.selectedData.profile_image
                }]
            };
            console.log("data ==== ", rawData);
            
            const config = {
                method: "put",
                url: "https://api2.cognizata.com/api/v2/monitor/updatetargetandhashtag",
                data: rawData,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            this.axios(config)
            .then((response) => {
                console.log(response);
                let result = response.data || [];
                
                this.load = false;
                this.editProfile();
                Swal.fire({
                    title: 'บันทึกแล้ว!',
                    text: 'ข้อมูลของคุณถูกบันทึกเรียบร้อย',
                    icon: 'success',
                    confirmButtonText: 'ตกลง',
                    customClass: {
                        confirmButton: 'btn btn-success'
                    },
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    buttonsStyling: false
                });
                this.apiMonitorProfile();
            })
            .catch((error) => {
                this.load = false;
                // console.error(error);
                Swal.fire({
                    title: 'บันทึกไม่สำเสร็จ',
                    text:  error,
                    icon: 'error',
                    confirmButtonText: 'ตกลง',
                    customClass: {
                    confirmButton: 'btn btn-danger'
                    },
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    buttonsStyling: false
                })
            });
        },
    },
    mounted() {
        this.apiMonitorProfile();
        this.apiGetProvinces();
        this.apiGetInfluencerType();
        this.getWordCloudImage();
    },
}
</script>

<style scoped>
.swal2-icon::before {
  content: none !important;
}
.mb-custom{
    margin-bottom: 90px;
}
.max-h-400px {
    max-height: 350px;
}
.max-h-500px{
    max-height: 530px;
}
.scrollable-body {
  /* max-height: 400px; ปรับตามความสูงที่ต้องการให้ scroll */
  overflow-y: auto;
  overflow-x: hidden;   /* ปิด scroll แนวนอน */
  margin-left: 5px;

}
.gradient-bg {
    /* min-height: 150px; */
    background: linear-gradient(90deg, #fed06ea4, #ffe6e6);
    color: white;
}
.user-img {
    width: 70px;
    border-radius: 50%;
    z-index: 2;
    position: relative;
}

.imgp {
    z-index: 2;
    position: relative;
}

.social-img {
    width: 50px;
    margin-left: -30px;
    margin-top: 10px;
    z-index: 0;
    position: relative;
}

.left{
    position: absolute;
    /* bottom: 0px; */
    top: 90px;
}
.social-img {
    width: 40px;
}

.boxlist-card {
    border: 0px;
    /* box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; */
    border-radius: 15px;
    /* height: 100px; */
}
.tab-body-height {
    max-height: 550px;
    overflow-y: auto;
}
@media only screen and (min-width: 0px) and (max-width: 760px) {
    

}
</style>