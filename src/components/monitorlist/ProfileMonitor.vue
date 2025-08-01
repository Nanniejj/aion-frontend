<template>
    <b-row class="m-0">
        <!-- profile details -->
        <b-col cols="12" md="5" lg="5" xl="4" class="h-100 mb-4 px-0 pr-md-2">
            <b-card
                style="max-height: 600px;"
                class="shadow"
                tag="article"
                :header-class="['p-0 mb-custom']"
                :body-class="['scrollable-body max-h-500px py-0']"
            >
                <!-- กำหนด header แบบมีพื้นหลังไล่ระดับ -->
                <template #header>
                    <div class="gradient-bg" style="height: 135px;">
                        <b-row v-if="profile" class="m-0">
                            <b-col class="pt-3">
                                <!-- {{ profile }} -->
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
                                <div v-if="!editable" class="h6 py-2">
                                    <a v-if="type == 'hashtaglist'" class="" v-bind:href="profile.link_original" target="_blank"
                                        style="color: #2c3e50"> 
                                        <span class="h5">
                                            {{ profile.name || profile.uid }}

                                        </span>
                                        <i class="fa fa-external-link text-info" v-if="type == 'targetlist'" /><br>
                                        ({{ totalPost | numFormat }} posts)
                                    </a> 
                                    <a v-else class="" v-bind:href="profile.link_original" target="_blank"
                                        style="color: #2c3e50"> 
                                            {{ data.account_name || profile.name || profile.uid }}
                                        <i class="fa fa-external-link text-info" v-if="type == 'targetlist'" />
                                    </a> 
                                </div>
                                <div v-if="!editable">
                                    <b-badge v-if="profile.species" variant="info" class="mr-1 text-capitalize" pill>{{ profile.species }}</b-badge>
                                    <!-- <span v-if="profile.influencer_type">
                                        <b-badge v-for="item in profile.influencer_type" :key="item" class="mr-2" style="background-color: #fed06ea4; color: #2c3e50;" pill>
                                            {{ getTypeName(item) }}
                                        </b-badge>
                                    </span> -->
                                </div>
                            </b-col>
                        </b-row>
                    </div>
                </template>

                <!-- card body -->
                <b-row v-if="type !== 'hashtaglist'" class="my-2 mx-0">
                    <b-col v-if="editable" cols="12" class="pb-2">
                        <b-row class="d-flex justify-content-between p-0">
                            <b-col class="text-secondary d-flex p-0 align-items-center">
                                <i class="fa fa-user mr-1"/>
                                ชื่อบัญชี :
                            </b-col>
                            <b-col v-if="!editable" cols="auto font-weight-bold">
                                <span v-if="profile.name">
                                    {{ profile.name }}
                                </span>
                                <span v-else> - </span>
                            </b-col>
                            <div v-else class="col-12 px-0" >
                                <b-form-input
                                    size="sm"
                                    class="input"
                                    placeholder="ระบุชื่อบัญชี"
                                    v-model="selectedData.name"
                                />
                            </div>
                        </b-row>
                    </b-col>
                    <b-col v-if="editable" cols="12" class="pb-2">
                        <b-row class="d-flex justify-content-between p-0">
                            <b-col class="text-secondary d-flex p-0 align-items-center">
                                <i class="fas fa-image mr-1"/>
                                url ที่อยู่รูปโปรไฟล์  
                                <i
                                    v-if="editable"
                                    class="fa fa-exclamation-circle mx-1 text-info"
                                    v-b-tooltip.hover
                                    title="คลิกขวาที่รูปโปรไฟล์ เลือก 'คัดลอกที่อยู่รูปภาพ' หรือ 'Copy image address' แล้ววางที่นี่"
                                    style="font-size: 14px; cursor: pointer;"
                                ></i> :
                            </b-col>
                            <div class="col-12 px-0" >
                                <b-form-input
                                    size="sm"
                                    class="input"
                                    placeholder="ระบุที่อยู่รูปโปรไฟล์"
                                    v-model="selectedData.profile_image"
                                    @input="exportData"
                                />
                            </div>
                        </b-row>
                    </b-col>
                    <b-col cols="12" class="pb-2">
                        <b-row class="p-0">
                            <b-col class="text-secondary d-flex p-0 align-items-center">
                                <i class="fas fa-address-card mr-1" />
                                ลักษณะของบัญชี :
                            </b-col>
                            <b-col v-if="!editable" cols="auto" class="font-weight-bold">
                                <span v-if="profile.species">
                                    {{ getSpeciesName(profile.species) }}
                                </span>
                                <span v-else>-</span>
                            </b-col>
                            <div v-else class="col-12 px-0">
                                <b-form-select
                                    size="sm"
                                    class="input"
                                    :options="[{ value: null, text: 'เลือกลักษณะของอินฟลูเอนเซอร์' }, ...speciesTypes]"
                                    v-model="selectedData.species"
                                    placeholder="เลือกหมวดหมู่"
                                />
                            </div>
                        </b-row>
                    </b-col>
                    <b-col cols="12" class="pb-2">
                        <b-row class="p-0">
                            <b-col class="text-secondary d-flex p-0 align-items-center">
                                <i class="fas fa-award mr-1" />
                                เงื่อนไข Influencer :
                            </b-col>
                            <b-col v-if="!editable" cols="auto font-weight-bold">
                                <span v-if="profile.influencer_condition">
                                    {{ getInfluConditions(profile.influencer_condition) }}
                                </span>
                                <span v-else>-</span>
                            </b-col>
                            <div v-else class="col-12 px-0">
                                <b-form-select
                                    size="sm"
                                    class="input"
                                    :options="influConditions"
                                    v-model="selectedData.influencer_condition"
                                    placeholder="เลือกระดับ Influencer"
                                />
                            </div>
                        </b-row>
                    </b-col>

                    <b-col cols="12" class="pb-2">
                        <b-row class="p-0">
                            <b-col class="text-secondary text-left d-flex p-0 align-items-center">
                                <i class="fa fa-tag mr-1" />
                                หมวดหมู่ของ Influencer :
                            </b-col>
                            <b-col v-if="!editable" cols="auto" class="text-left font-weight-bold">
                                <span v-if="profile.influencer_type">
                                    <!-- <span v-if="profile.influencer_type"> -->
                                    <b-badge v-for="item in profile.influencer_type" :key="'type - '+item"  class="mr-1" style="background-color: #fed06ea4; color: #2c3e50;" pill>
                                        {{  getTypeName(item) }}
                                    </b-badge>
                                    <!-- </span> -->
                                    <!-- {{ getTypeName(profile.influencer_type) }} -->
                                </span>
                                <span v-else>-</span>
                            </b-col>
                            <div v-else class="col-12 px-0">
                                <!-- <b-form-select
                                    size="sm"
                                    class="input"
                                    :options="[{ value: null, text: 'เลือกหมวดหมู่' }, ...influencerTypes]"
                                    v-model="profile.influencer_type"
                                    placeholder="เลือกหมวดหมู่"
                                /> -->
                                <Multiselect
                                    v-model="selectedData.influencer_type"
                                    :options="influencerTypes"
                                    :multiple="true"
                                    :taggable="true"
                                    label="text"
                                    track-by="value"
                                    placeholder="เลือกหมวดหมู่"
                                />
                                    <!-- @input="exportData" -->
                            </div>
                        </b-row>
                    </b-col>
                    <!-- <b-col cols="12" class="pb-2">
                        <b-row class="p-0">
                            <b-col class="text-secondary d-flex p-0 align-items-center">
                                <i class="fa fa-tag mr-1" />
                                ประเภทธุรกิจ :
                            </b-col>
                            <b-col v-if="!editable" cols="auto font-weight-bold">
                                <span v-if="profile.influencer_type">
                                    {{ getTypeName(profile.influencer_type) }}
                                </span>
                                <span v-else>-</span>
                            </b-col>
                            <div v-else class="col-12 px-0">
                                <b-form-select
                                    size="sm"
                                    class="input"
                                    :options="[{ value: null, text: 'เลือกหมวดหมู่' }, ...influencerTypes]"
                                    v-model="profile.influencer_type"
                                    placeholder="เลือกหมวดหมู่"
                                />
                            </div>
                        </b-row>
                    </b-col> -->
                    
                    <b-col v-if="editable" cols="12" class="pb-2">
                        <b-row class="p-0">
                            <b-col class="text-secondary d-flex p-0 align-items-center">
                                <i class="fas fa-robot mr-1" />
                                ระดับความถี่ในการเก็บข้อมูล
                                <i
                                    class="fa fa-exclamation-circle mx-1 text-info"
                                    v-b-tooltip.hover
                                    title="ระดับ 1 = ความถี่ต่ำ,ระดับ 2 = ความถี่ปานกลาง,ระดับ 3 = ความถี่สูง"
                                    style="font-size: 14px; cursor: pointer;"
                                ></i> :
                            </b-col>
                            <b-col v-if="!editable" cols="auto font-weight-bold">{{ profile.bot_level }}</b-col>
                            <div v-else class="col-12 px-0">
                                <b-form-select
                                    size="sm"
                                    class="input"
                                    :options="[1,2,3]"
                                    v-model="selectedData.bot_level"
                                    placeholder="เลือกระดับ"
                                />
                            </div>
                        </b-row>
                    </b-col>
                    <b-col cols="12" class="pb-2">
                        <b-row class="d-flex justify-content-between p-0">
                            <b-col class="text-secondary d-flex p-0 align-items-center">
                                <i v-if="profile.sex === 'female'" class="fa fa-venus" />
                                <i v-else-if="profile.sex === 'male'" class="fa fa-mars" />
                                <i v-else class="fa fa-neuter mr-1" />
                                เพศ :
                            </b-col>
                            <b-col v-if="!editable" cols="auto font-weight-bold">
                                <span v-if="profile.sex">
                                    {{ getsexTh(profile.sex) }}
                                </span>
                                <span v-else> - </span>
                            </b-col>
                            <div v-else class="col-12 px-0">
                                <b-form-select
                                    size="sm"
                                    class="input"
                                    :options="sexs"
                                    v-model="selectedData.sex"
                                    placeholder="เลือกเพศ"
                                />
                            </div>
                        </b-row>
                    </b-col>
                    <b-col cols="12" class="pb-2">
                        <b-row class="d-flex justify-content-between p-0">
                            <b-col class="text-secondary d-flex p-0 align-items-center">
                                <i class="fa fa-birthday-cake mr-1"/>
                                อายุ :
                            </b-col>
                            <b-col v-if="!editable" cols="auto font-weight-bold">
                                <span v-if="profile.age">
                                    {{ profile.age }} ปี
                                </span>
                                <span v-else>-</span>
                            </b-col>
                            <b-form-spinbutton v-else id="demo-sb" v-model="profile.age" min="0" max="100"></b-form-spinbutton>
                        </b-row>
                    </b-col>
                    <b-col cols="12" class="pb-2">
                        <b-row class="d-flex justify-content-between p-0">
                            <b-col class="text-secondary d-flex p-0 align-items-center">
                                <i class="fa fa-map-marker mr-1"/>
                                จังหวัด :
                            </b-col>
                            <b-col v-if="!editable"  cols="auto font-weight-bold">
                                    <span v-if="profile.province">
                                    {{ profile.province }}
                                </span>
                                <span v-else>-</span>
                            </b-col>
                            <div v-else class="col-12 px-0">
                                <b-form-select
                                    size="sm"
                                    class="input"
                                    :options="[{ value: null, text: 'เลือกจังหวัด' }, ...provinces]"
                                    placeholder="เลือกจังหวัด"
                                    v-model="selectedData.location"
                                    @change="getProvinceName(profile.location)"
                                />
                            </div>
                        </b-row>
                    </b-col>
                    <b-col cols="12" class="pb-2">
                        <b-row class="d-flex justify-content-between p-0">
                            <b-col class="text-secondary d-flex p-0 align-items-center">
                                <i class="fa fas fa-users mr-1"/>
                                ผู้ติดตาม :
                            </b-col>
                            <b-col v-if="!editable" cols="auto font-weight-bold">
                                <span v-if="profile && profile.followers">
                                    {{ profile.followers }}
                                </span>
                                <span v-else> - </span>
                            </b-col>
                            <b-form-input
                                v-else 
                                type="text"
                                v-model="selectedData.followers"
                                @keypress="onlyNumber"
                                placeholder="กรอกจำนวนผู้ติดตาม (เฉพาะตัวเลข)"
                            />
                        </b-row>
                    </b-col>
                    <b-col cols="12" class="pb-2">
                        <b-row class="d-flex justify-content-between p-0">
                            <b-col class="text-secondary d-flex p-0 align-items-center">
                                <i class="fa fas fa-star mr-1"/>
                                กำลังติดตาม :
                            </b-col>
                            <b-col v-if="!editable" cols="auto font-weight-bold">
                                <span v-if="profile.following">
                                    {{ profile.following }}
                                </span>
                                <span v-else> - </span>
                            </b-col>
                            <b-form-input
                                v-else 
                                type="text"
                                v-model="selectedData.following"
                                @keypress="onlyNumber"
                                placeholder="กรอกจำนวน account ที่กำลังติดตาม (เฉพาะตัวเลข)"
                            />
                        </b-row>
                    </b-col>
                </b-row>

                    <!-- เพิ่ม footer ตรงนี้ -->
                <template v-if="type !== 'hashtaglist'" #footer>
                    <div v-if="!editable" class="d-flex justify-content-end">
                        <b-button variant="info" @click="editProfile()">
                            <i class="fa fa-edit mr-1"></i> แก้ไขข้อมูล
                        </b-button>
                    </div>
                    <div v-else class="d-flex justify-content-between">
                        <b-button variant="danger" @click="editProfile()">
                            <i class="fa fa-times mr-1"></i> ยกเลิก
                        </b-button>
                        <b-button variant="success" @click="confirmUpdate()">
                            <i class="fa fa-save mr-1"></i> บันทึก
                        </b-button>
                    </div>
                    <!-- {{ profile }} -->
                </template>
            </b-card>
        </b-col>

        <!-- tap -->
        <b-col cols="12" md="7" lg="7" xl="8" class="px-0 px-md-3">
            <b-card 
                class="h-100 boxlist-card"
                header-tag="nav"
                style="min-height: 600px;" 
                ref="scrollBox"
                @scroll="handleScroll" 
                :header-class="['px-0 mx-0 pt-0 bg-transparent']"
                :body-class="['px-0']"
            >
                <template #header>
                    <b-nav card-header tabs v-model="category">
                        <b-nav-item 
                            :active="category === 'domain'" 
                            @click="category = 'domain'"
                        >Top Domain</b-nav-item>
                        <b-nav-item 
                            :active="category === 'hashtags'" 
                            @click="category = 'hashtags'" 
                            >Top Hashtags</b-nav-item>
                        <b-nav-item 
                            :active="category === 'posts'" 
                            @click="category = 'posts'" 
                        >
                            Posts
                        </b-nav-item>
                    </b-nav>
                </template>

                <b-card-text  v-if="category === 'domain'">
                    <div
                        class="scrollable-body tab-body-height "
                        style=""
                        @scroll="handleScroll"
                    >
                        <TabDomain 
                            :load="load"
                            :wordcloud_image="wordcloud_images.words"
                            :topDomain="topDomain" 
                            @update-keyword="(data) => setKeyWord(data)"
                        />
                        <div class="col-12 mt-5">
                            <TabPost 
                                :topDomain="topDomain" 
                                :isBottom="alreadyAtBottom"
                                :keyWord="keyWord"
                                @totalPost="data =>totalPost = data"
                            />
                        </div>
                    </div>
                </b-card-text>
                <b-card-text v-if="category === 'hashtags'">
                    <div
                        class="scrollable-body pl-2 tab-body-height "
                        style=""
                        @scroll="handleScroll"
                    >
                        <TabHashtag 
                            :wordcloud_image="wordcloud_images.hashtag"
                            :topHashtags="topHashtags"
                            @update-keyword="(data) => setKeyWord(data)"
                        />
                        <div class="col-12 mt-5">
                            <TabPost 
                                :topDomain="topDomain" 
                                :isBottom="alreadyAtBottom"
                                :keyWord="keyWord"
                            />
                        </div>
                    </div>
                </b-card-text>
                <b-card-text v-if="category === 'posts'" class="">
                    <div
                        class="scrollable-body pl-2 tab-body-height "
                        style=""
                        @scroll="handleScroll"
                        >
                        <TabPost 
                            :topDomain="topDomain" 
                            :isBottom="alreadyAtBottom"
                        />
                    </div>
                </b-card-text>
            </b-card>
        </b-col>
    </b-row>
</template>
<script>
import TabDomain from "./profileTabs/_TabDomain.vue"
import TabHashtag from "./profileTabs/_TabHashtag.vue"
import TabPost from "./profileTabs/_TabPost.vue"
import Swal from 'sweetalert2'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
export default {
    components: {
        TabDomain,
        TabHashtag,
        TabPost,
        Multiselect
    },
    data() {
        return {
            alreadyAtBottom: false,
            type:this.$route.query.type,
            default_avatar: "user.svg",
            load: false,
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
        }
    },
    methods: {
        // async checkImage(url) {
        //     console.log("กำลังเช็ค", url);
        //     return new Promise((resolve) => {
        //         const img = new Image();
        //         img.onload = () => {
        //             console.log("✅ โหลดได้:", url);
        //             resolve(url);
        //         };
        //         img.onerror = () => {
        //             console.log("❌ โหลดไม่ได้, ใช้ default:", '/images/user.svg');
        //             resolve('/images/user.svg');
        //         };
        //         img.src = url;
        //     })
        // },
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
            return this.sexs.find(item => item.value === sex).text
        },
        getTypeName(id) {
            return this.influencerTypes.find(item => item.value === id).text
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
            return this.speciesTypes.find(item => item.value === id).text
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
            this.load = true;
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
                this.load = false;
            })
            .catch((error) => {
                this.load = false;
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