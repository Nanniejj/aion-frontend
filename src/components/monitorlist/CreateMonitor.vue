<template>
  <div>
    <!-- {{getListMonitorProfile.targetlist.length}} -->
    <button class="btn btn-add mt-0 w-100" @click="open = true">
      <i class="fa fa-plus" />
      <span style="font-size: 16px" v-if="tabsMonitor == 'targetlist'">
        เพิ่มบัญชี
      </span>
      <span style="font-size: 16px" v-else-if="tabsMonitor == 'hashtaglist'">
        เพิ่มแฮชแท็ก
      </span>
      <span style="font-size: 16px" v-else-if="tabsMonitor == 'tabKeyword'">
        เพิ่ม keyword
      </span>
      <span style="font-size: 16px" v-else> เพิ่มบัญชี Avatar</span>
    </button>

    <vue-modaltor
        :visible="open"
        @hide="hideModal"
        :animation-panel="'modal-slide-top'"
        :resize-width="{ 3000: '80%', 1350: '90%', 768: '90%' }"
    >
      <!-- :resize-width="{ 3000: '80%', 1350: '80%', 768: '90%' }" -->
        <div v-if="tabsMonitor == 'targetlist'">
            <h5><b>เพิ่มบัญชี</b></h5>
            <hr />
        </div>
        <div v-else-if="tabsMonitor == 'hashtaglist'">
            <h5><b>เพิ่มแฮชแท็ก</b></h5>
            <hr />
        </div>
        <div v-else-if="tabsMonitor == 'tabKeyword'">
            <h5><b>เพิ่ม Keyword</b></h5>
            <hr />
        </div>
        <div v-else>
            <h5><b>เพิ่มบัญชี Avatar</b></h5>
            <hr />
        </div>
        
        <!-- body -->
        <b-row class="m-0 modal-body-scrollable aling-items-start">
            <!-- <b-col sm="12">
                <span v-if="tabsMonitor == 'hashtaglist'">
                    คำแนะนำ : กรุณาเลือกแหล่งข้อมูลออนไลน์และใส่แฮชแท็กที่ต้องการ</span
                >
                <span v-else-if="tabsMonitor == 'tabKeyword'">
                    คำแนะนำ : กรุณาเลือกแหล่งข้อมูลออนไลน์และใส่ keyword
                    ที่ต้องการ</span
                >
                <span v-else>
                    คำแนะนำ : กรุณาเลือกแหล่งข้อมูลออนไลน์และใส่บัญชีที่ต้องการ
                    <span class="text-danger bold" style="font-size: 18px;">สูงสุด 100 บัญชี</span>
                </span>
            </b-col> -->
            <b-col v-if="tabsMonitor == 'hashtaglist'" sm="12" class="px-0">
                <div>
                    <b-alert show
                    >ตัวอย่างการใส่ข้อมูล <br />ใส่คำที่ต้องการโดย<b> ไม่ต้องใส่ #</b>
                    เช่น #การเมือง ให้ใส่ <b>การเมือง</b></b-alert
                    >
                </div>
            </b-col>
            <!--------------------------------------------------profile --------------------------------------------------------------->
            <b-col sm="12" class="px-0" v-if="tabsMonitor == 'targetlist'">
                <label class="mt-3" for="textarea-default"><b>url บัญชี ({{ addTarget.length }})</b></label>
                <!-- :disabled="!selectSource" -->
                <b-form-tags
                    input-id="tags-pills"
                    v-model="addTarget"
                    tag-variant="light"
                    tag-pills
                    size="md"
                    placeholder="Enter เพื่อเพิ่มบัญชี"
                    :tag-validator="validator"
                    :tag-formatter="formatTag" 
                    @input="onTagsInput"
                    @tag-state="onTagState"
                    separator=" ,;"
                    remove-on-delete
                />
                <!-- {{ targetLists }} -->
                <div class="col-12 px-0" v-if="addTarget.length">

                    <!-- {{ facebook }} -->
                    <div class="col-12 px-0 pt-3" v-for="(platform, platformName) in platforms" :key="platformName" v-if="platform.length">
                        <div v-if="platform.length" >
                            <b class="mb-2 text-capitalize">{{ platformName }} ({{ platform.length }})</b>
                            <hr class="my-2"/>
                            <b-row cols="1" lg-cols="2" xl-cols="2">
                                <b-col xs="12" lg="6" class="" v-for="(item, i) in platform" :key="'target- ' +i">
                                    <b-row class="justify-content-between mb-3 mx-0">
                                        <a :href="item.url" target="_blank" rel="noopener noreferrer" 
                                        class="col d-sm-none text-truncate px-0" 
                                        style="max-width: 300px;">
                                            {{ i + 1 }}. {{ item.url }}
                                        </a>
                                        <a :href="item.url" target="_blank" rel="noopener noreferrer" class="col d-none d-sm-block text-truncate w-100 px-0" style="">
                                            {{ i + 1 }}. {{ item.url }}
                                        </a>
                                        
                                        <b-button class="col-auto" variant="info" v-if="!item.editable" @click="toggleEdited(item)">
                                            <i class="fa fa-edit"></i>
                                        </b-button>
                                        
                                        <div class="col-auto d-flex pl-1 pr-0" v-else>
                                            <b-button class="mr-2" variant="success" @click="toggleEdited(item)">
                                                <i class="fa fa-save"></i>
                                            </b-button>
                                            <b-button variant="danger" @click="toggleEdited(item)">
                                                <i class="fa fa-times"></i>
                                            </b-button>
                                        </div>
                                        <div class="col-12 mt-3 p-0">
                                            <CardInput 
                                                :targetInfo="item"
                                                :provinces="provinces"
                                                :influencerTypes="influencerTypes"
                                                source="blockdit"
                                                :editable="item.editable" 
                                                @update:targetInfo="(data) => handleLabelData(data,item)"
                                            />
                                        </div>
                                    </b-row>
                                </b-col>
                            </b-row>
                        </div>
                    </div>
                </div>
            </b-col>
            <!--------------------------------------------------hashtag --------------------------------------------------------------->
            <b-col sm="12" v-else-if="tabsMonitor == 'hashtaglist'">
                <label class="mt-4" for="textarea-default"><b>ชื่อแฮชแท็ก</b></label>
                <b-form-tags
                    input-id="tags-pills"
                    v-model="addHashtag"
                    tag-variant="light"
                    tag-pills
                    size="md"
                    placeholder="Enter เพื่อเพิ่มแฮชแท็ก"
                    remove-on-delete
                    separator=" ,;"
                    :tag-formatter="(tag) => tag"
                    @input="onTagsInput"
                ></b-form-tags>
                <!-- <div class="col-12 px-0" v-if="addHashtag.length">
                    <div class="col-12 px-0 pt-3">
                        <b>รายการแฮชแท็ก ({{ addHashtag.length }})</b>
                    </div>
                    <hr class="my-2"/>
                    <div class="row justify-content-between mb-3 mx-0" v-for="(item, i) in hashtagLists" :key="'hashtag- ' +i">
                        
                        <div class="col d-sm-none text-truncate px-0" style="max-width: 300px;">
                            {{ i + 1 }}. #{{ item.uid }}
                        </div>
                        <div class="col d-none d-sm-block text-truncate w-100 px-0" style="">
                            {{ i + 1 }}. #{{ item.uid }}
                        </div>
                        
                        <b-button class="col-auto" variant="info" v-if="!item.editable" @click="toggleEdited(item)">
                            <i class="fa fa-edit"></i>
                        </b-button>
                        
                        <div class="col-auto d-flex pl-1 pr-0" v-else>
                            <b-button class="mr-2" variant="success" @click="toggleEdited(item)">
                                <i class="fa fa-save"></i>
                            </b-button>
                            <b-button variant="danger" @click="toggleEdited(item)">
                                <i class="fa fa-times"></i>
                            </b-button>
                        </div>
                        <div class="col-12 mt-3 p-0">
                            <CardInput 
                                v-if="checkLableData(item) || item.editable"
                                :targetInfo="item"
                                :provinces="provinces"
                                :influencerTypes="influencerTypes"
                                source="blockdit"
                                :editable="item.editable" 
                                @update:targetInfo="(data) => handleLabelData(data,item)"
                            />
                        </div>
                    </div>
                </div> -->
            </b-col>
            
        </b-row>

        <!-- footer -->
        <b-row class="my-1">
            <b-col sm="12" style="text-align: right">
            <br />
            <b-button v-if="targetLists !== [] || hashtagLists !== []" @click="clear" size="sm" variant="outline-danger" class="mr-2">
                <i class="fa fa-eraser" aria-hidden="true"></i>
                clear
            </b-button>
            <b-button
                class="btn btn-save"
                size="sm"
                @click="confirmSave(targetLists)"
                v-if="tabsMonitor == 'targetlist'"
                :disabled="addTarget.length == 0"
                >บันทึก Target</b-button
            >
            <b-button
                class="btn btn-save"
                size="sm"
                @click="confirmSave(hashtagLists)"
                v-else-if="tabsMonitor == 'hashtaglist'"
                :disabled="addHashtag.length == 0"
                >บันทึก</b-button
            >
            <b-button
                class="btn btn-save"
                size="sm"
                @click="addRowTarget()"
                v-else-if="tabsMonitor == 'tabKeyword'"
                :disabled="addKeyword.length == 0"
                >บันทึก</b-button
            >
            <b-button
                class="btn btn-save"
                size="sm"
                @click="addRowTarget()"
                v-else
                :disabled="addAvatar.length == 0"
                >บันทึก</b-button
            >
            </b-col>
        </b-row>
    </vue-modaltor>
  </div>
</template>

<script>
// import { type } from 'colorjs.io/types/src/util';
import { mapGetters } from "vuex";
import CardInput from "./_CardInput.vue";
import Swal from 'sweetalert2'
export default {
    components:{
        CardInput
    },
    props: {
        tabsMonitor: {
            type: String,
        },
    },
    computed: {
        
        ...mapGetters(["getAddDomain", "getListMonitorProfile", "getUpdateTable"]),
    },
    created() {
        // ค่าเริ่มต้น object → string สำหรับใช้แสดง
        this.addTarget = this.targetLists.map(item => item.text);
    },
    data() {
        return {
            selectSourceKeyword: "twitter",
            selectSourceHash: "twitter",
            addKeyword: "",
            addHashtag: [],
            platforms: {
                facebook: [],
                tiktok: [],
                youtube: [],
                instagram: [],
                twitter: [],
                pantip: [],
                blockdit: [],
                threads:[],
                news:[]
            },
            platformText: {
                facebook: 'Facebook',
                tiktok: 'TikTok',
                youtube: 'YouTube',
                instagram: 'Instagram',
                twitter: 'Twitter (X)',
                pantip: 'Pantip',
                blockdit: 'Blockdit',
                threads: 'Threads'
            },
            targetLists:[],
            hashtagLists:[],
            addTarget: [],
            addAvatar: [],
            selectTeam: null,
            selectSource: null,
            open: false,
            addDomain: "",
            optionsTeam: [
                { value: null, text: "กรุณาเลือกทีม", disabled: true },
                { value: "teamtest", text: "teamtest" },
                { value: true, text: "เพิ่มทีมใหม่" },
            ],
            options: [
                { value: null, text: "กรุณาเลือก source", disabled: true },
                { value: "facebook", text: "Facebook" },
                { value: "twitter", text: "Twitter" },
                { value: "youtube", text: "Youtube" },
                { value: "instagram", text: "Instagram" },
                // { value: "news", text: "News" },
                { value: "pantip", text: "Pantip" },
                { value: "blockdit", text: "Blockdit" },
                { value: "tiktok", text: "Tiktok" },
                { value: "threads", text: "Threads" },
            ],
            optionsAV: [
                { value: null, text: "กรุณาเลือก source", disabled: true },
                { value: "twitter", text: "Twitter" },
                { value: "facebook", text: "Facebook" },
                // { value: "youtube", text: "Youtube" },
                { value: "instagram", text: "Instagram" },
                // { value: "news", text: "News" },
                // { value: "pantip", text: "Pantip" },
                // { value: "blockdit", text: "Blockdit" },
                { value: "tiktok", text: "Tiktok" },
            ],
            optionsHash: [
                { value: null, text: "กรุณาเลือก source", disabled: true },
                { value: "facebook", text: "Facebook" },
                { value: "twitter", text: "Twitter" },
                { value: "youtube", text: "Youtube" },
                { value: "instagram", text: "Instagram" },
                { value: "news", text: "News" },
                { value: "pantip", text: "Pantip" },
                { value: "blockdit", text: "Blockdit" },
                { value: "tiktok", text: "Tiktok" },
            ],
            optionsKeyword: [
                { value: null, text: "กรุณาเลือก source", disabled: true },
                { value: "twitter", text: "Twitter" },
                // { value: "tiktok", text: "Tiktok" },
            ],
            provinces: [],
            influencerTypes:[]
        };
    },
    methods: {
        clear() {
            this.resetHashtagList();
            this.resetTargetList();
        },
        handleLabelData(data, itemPlatform) {
            console.log("data === ",data);
            // คัดลอกทุก key จาก data ไปยัง itemPlatform (รวมทั้งเพิ่ม key ใหม่)
            Object.keys(data).forEach(key => {
                itemPlatform[key] = data[key];
            });
            // console.log('itemPlatform ==== ',itemPlatform);
            this.checkLableData(itemPlatform)
        },
        checkLableData(item) {
            console.log("check === ", item);
            
            // ถ้าไม่มี url → false ทันที
            if (!item.url || item.url.trim() === '') {
            return false;
            }

            // สร้างสำเนา object โดยไม่รวม url และ key ที่ไม่ต้องพิจารณา (เช่น key, editable)
            const checkKeys = Object.keys(item).filter(key =>
                key !== 'url' && key !== 'key' && key !== 'editable' && key !== 'bot_level'&& key !== 'source'
            );

            // ถ้ามี field อื่นที่ไม่เป็น null หรือไม่ว่าง → return true
            const hasOtherValue = checkKeys.some(key => {
            const val = item[key];
            return val !== null && val !== '' && val !== undefined;
            });

            return hasOtherValue;
        },
        normalizeUrl(url) {
            let result = url.trim();
            // ✅ แปลง Facebook profile.php?id=... → facebook.com/ID
            const fbProfileMatch = result.match(/^(https:\/\/(www\.)?facebook\.com)\/profile\.php\?id=([^/&?#]+)/);
            if (fbProfileMatch) {
                result = `${fbProfileMatch[1]}/${fbProfileMatch[3]}`;
            }

            // ✅ ตัด / ท้าย
            result = result.replace(/\/+$/, '');

            // ✅ เช็ค platform
            const platform = this.detectPlatformName(result);

            // ✅ ถ้าไม่ใช่ news → ตัด www.
            if (platform !== 'news') {
                result = result.replace(/^(https?:\/\/)?(www\.)?/, (match, protocol) => {
                return protocol || ''; // เก็บ http:// หรือ https:// ไว้ถ้ามี
                });
            }
            return result;
        },
        detectPlatformName(tag) {
            if (tag.includes("facebook.com")) return 'facebook';
            if (tag.includes("tiktok.com")) return 'tiktok';
            if (tag.includes("youtube.com") || tag.includes("youtu.be")) return 'youtube';
            if (tag.includes("instagram.com")) return 'instagram';
            if (tag.includes("twitter.com") || tag.includes("x.com")) return 'twitter';
            if (tag.includes("pantip.com")) return 'pantip';
            if (tag.includes("blockdit.com")) return 'blockdit';
            if (tag.includes("threads.com")) return 'threads';
            return 'news';
        },
        onTagsInput(tags) {
            // ✨ 1. Normalize URLs
            let normalizedTags = tags.map(tag => this.normalizeUrl(tag));

            // 🚫 จำกัดไม่เกิน 100
            if (normalizedTags.length > 100) {
                Swal.fire({
                icon: 'warning',
                title: "เพิ่มได้สูงสุด 100 เป้าหมาย",
                showConfirmButton: false,
                didOpen: () => {
                    const iconContent = document.querySelector('.swal2-icon-content');
                    if (iconContent) iconContent.style.display = 'none';
                },
                timer: 2000
                });
                normalizedTags = normalizedTags.slice(0, 100);
            }

            
            if (this.tabsMonitor === 'targetlist') {
                // ✨ 2. Sync addTarget
                this.addTarget = normalizedTags;
                console.log(normalizedTags);
                
                // ✨ 3. map เป็น object พร้อมระบุ source (platform)
                const newEntries = normalizedTags.map(tag => {
                    const platform = this.detectPlatformName(tag); // ✅ ใช้ helper ด้านล่าง
                    return {
                        url: tag,
                        source: platform, // เก็บชื่อ platform ลงใน object
                        editable: false,
                        bot_level: 1,
                        name: null,
                        key: this.tabsMonitor === 'targetlist'
                            ? 'account'
                            : this.tabsMonitor === 'hashtaglist'
                            ? 'hashtag'
                            : null
                    };
                });
    
                // ✅ 4. ล้างค่าเก่าใน platforms
                Object.keys(this.platforms).forEach(p => {
                    this.platforms[p] = [];
                });
    
                // ✅ 5. เพิ่ม entry แยกตาม platform โดยไม่ซ้ำ
                const addUnique = (platformArray, entry) => {
                    if (!platformArray.some(e => e.url === entry.url)) {
                    platformArray.push(entry);
                    }
                };
    
                // ✅ 6. แยกแต่ละ entry ลง platform ที่ถูกต้อง
                newEntries.forEach(entry => {
                    const platform = entry.source;
                    if (platform && this.platforms[platform]) {
                    addUnique(this.platforms[platform], entry);
                    }
                });
    
                // ✅ 7. รวมสมาชิกทุก platform
                this.targetLists = Object.values(this.platforms)
                .flat() // รวม array ย่อยทั้งหมดเป็น array เดียว
                .filter((item, index, self) =>
                    // ป้องกันซ้ำซ้อนตาม url
                    index === self.findIndex(e => e.url === item.url)
                );
                // this.targetLists = Array.from(uniqueMap.values());

            } else if (this.tabsMonitor === 'hashtaglist') {
                console.log('addHashtag === ',this.addHashtag);
                const newEntries = this.addHashtag.map(tag => {
                    // const platform = this.detectPlatformName(tag); // ✅ ใช้ helper ด้านล่าง
                    return {
                    uid: tag,
                    // source: platform, // เก็บชื่อ platform ลงใน object
                    // editable: false,
                    bot_level: 1,
                    // name: null,
                    key: this.tabsMonitor === 'targetlist'
                        ? 'account'
                        : this.tabsMonitor === 'hashtaglist'
                        ? 'hashtag'
                        : null
                    };
                });
                console.log('newEntries === ',newEntries);
                this.hashtagLists = newEntries;
            }
        },
        toggleEdited(item) {
            item.editable = !item.editable
        },
        formatTag(tag) {
            return tag
                .replace(/^https?:\/\/(www\.)?/, '') // ตัด http://, https:// และ www.
                .replace(/\/+$/, '');                // ตัด / ท้ายสุด
        },
        validator(tag) {
            // ❌ จำกัดไม่เกิน 100 รายการ
            if (this.addTarget.length >= 100) {
                Swal.fire({
                icon: 'warning',
                title: "เพิ่มได้สูงสุด 100 เป้าหมาย",
                showConfirmButton: false,
                timer: 2000
                });
                return false;
            }

            // ✅ ตรวจว่าเป็น URL ที่ถูกต้อง
            let urlObj;
            try {
                urlObj = new URL(tag.trim());
                const isValidProtocol = ['http:', 'https:'].includes(urlObj.protocol);
                const hasDot = urlObj.hostname.includes('.');
                if (!isValidProtocol || !hasDot) throw new Error();
            } catch (e) {
                // Swal.fire({
                // icon: 'error',
                // title: 'URL ไม่ถูกต้อง',
                // text: 'กรุณาใส่ลิงก์ให้ถูกต้อง เช่น https://facebook.com/xxx',
                // showConfirmButton: true
                // });
                return false;
            }

            // ✅ อนุญาตเฉพาะแพลตฟอร์มที่กำหนด
            // const allowedHosts = [
            //     'facebook.com', 'www.facebook.com',
            //     'tiktok.com', 'www.tiktok.com',
            //     'youtube.com', 'www.youtube.com', 'youtu.be',
            //     'instagram.com', 'www.instagram.com',
            //     'twitter.com', 'www.twitter.com', 'x.com', 'www.x.com',
            //     'pantip.com', 'www.pantip.com',
            //     'blockdit.com', 'www.blockdit.com',
            //     'www.threads.com'
            // ];

            // const hostname = urlObj.hostname.toLowerCase();
            // const isAllowed = allowedHosts.some(domain => hostname.endsWith(domain));

            // if (!isAllowed) {
            //     Swal.fire({
            //     icon: 'error',
            //     title: 'ไม่รองรับแพลตฟอร์มนี้',
            //     text: 'กรุณาใช้ลิงก์จาก Facebook, Tiktok, Youtube, Instagram, Twitter, Pantip, Threads หรือ Blockdit เท่านั้น',
            //     showConfirmButton: true
            //     });
            //     return false;
            // }
            return true;
        },
        // validator(tag) {
        //     // const normalizedTag = tag.replace("://www.", "://");
        //     // if (this.selectSource == "twitter") {
        //     //     return tag.includes("https://twitter.com/");
        //     // } else if (this.selectSource == "facebook") {
        //     //     return tag.includes("https://facebook.com/");
        //     // } else if (this.selectSource == "instagram") {
        //     //     return tag.includes("https://instagram.com/");
        //     // } else if (this.selectSource == "youtube") {
        //     //     return tag.includes("https://youtube.com/");
        //     // } else if (this.selectSource == "tiktok") {
        //     //     return tag.includes("https://www.tiktok.com/@");
        //     // } else if (this.selectSource == "threads") {
        //     //     return tag.includes("https://www.threads.net/");
        //     // } else {
        //     //     return tag;
        //     // }
        //     const normalizedTag = tag.replace("://www.", "://");
        //     if (this.selectSource === "twitter") {
        //         return normalizedTag.includes("https://twitter.com/");
        //     } else if (this.selectSource === "facebook") {
        //         return normalizedTag.includes("https://facebook.com/");
        //     } else if (this.selectSource === "instagram") {
        //         return normalizedTag.includes("https://instagram.com/");
        //     } else if (this.selectSource === "youtube") {
        //         return normalizedTag.includes("https://youtube.com/");
        //     } else if (this.selectSource === "tiktok") {
        //         return normalizedTag.includes("https://tiktok.com/@");
        //     } else if (this.selectSource === "threads") {
        //         return normalizedTag.includes("https://threads.net/");
        //     } else {
        //         return false;
        //     }
        // },
        onTagState(valid, invalid, duplicate) {
            this.validTags = valid;
            this.invalidTags = invalid;
            this.duplicateTags = duplicate;
            // console.log(valid);        
        },
        async addRowTarget() {
            if (this.tabsMonitor == "tabProfile") {
                // await this.$store.dispatch("CreateMonitor", {
                //     source: this.selectSource,
                //     account: this.addTarget,
                // });
            } else if (this.tabsMonitor == "hashtaglist") {
                // await this.$store.dispatch("CreateMonitor", {
                //     source: this.selectSourceHash,
                //     hashtag: this.addHashtag,
                // });
            } else if (this.tabsMonitor == "tabKeyword") {
                await this.$store.dispatch("CreateKeyword", {
                source: this.selectSourceKeyword,
                keyword: this.addKeyword,
                });
            } else {
                await this.$store.dispatch("CreateAvatar", {
                source: this.selectSource,
                account: this.addAvatar,
                team: this.selectTeam,
                avatar: true,
                });
            }
            this.addHashtag = [];
            this.addTarget = [];
            this.addAvatar = [];
            this.addKeyword = "";
            this.open = false;
            if (this.tabsMonitor !== "tabKeyword") {
                await this.$store.dispatch("fatchListMonitorUpdate", "test");
            }
        },
        async apiGetProvinces() {
            // this.load = true;
            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/location/getProvinces",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };
            // console.log("length ==== ",this.provinces.length);
            
            // if (this.provinces.length === 0) {
                this.axios(config)
                .then((response) => {
                    let result = response.data.data || [];
                    this.provinces = result.map(province => ({
                        text: province.name_th,
                        value: province.id
                    }));
                    // console.log('this.provinces ', this.provinces);
                    this.load = false;
                    // if (this.provinces.length !== 0) {
                    //     this.mapTargetInfoToSelectedData();
                    // }
                })
                .catch((error) => {
                    // this.load = false;
                    console.error(error);
                });
            // }
            // console.log("length ==== ",this.provinces.length);
            // if (this.provinces.length !== 0) {
            //     await this.mapTargetInfoToSelectedData();
            // }

        },
        async apiGetInfluencerType() {
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
                console.log(response);
                let result = response.data || [];
                
                this.influencerTypes = result.map(type => ({
                    value: type.id,
                    text: type.name
                }));
                
                this.load = false;
            })
            .catch((error) => {
                this.load = false;
                console.error(error);
            });
        },
        hideModal() {
            this.open = false;
            this.resetTargetList();
            this.resetHashtagList();
            // this.$emit("close");
        },
        resetTargetList() {
            this.targetLists = [];
            this.addTarget = [];
        },
        resetHashtagList() {
            this.hashtagLists = [];
            this.addHashtag = [];
        },
        collectAllTargets(list) { 

            let cleanLists = list.map(({ editable, url, influencer_type, ...rest })=> ({
                ...rest,
                URL: url,
                influencer_type: influencer_type ? influencer_type.map(item => item.value) : null
            }));
            // console.log("cleanLists",cleanLists);
            
            return cleanLists
            // this.targetLists = this.targetLists.map(({ editable, url, ...rest })=> ({
            //     ...rest,
            //     URL: url}));
        },
        confirmSave(list) {
            // this.collectAllTargets(ta);
            Swal.fire({
                title: 'คุณแน่ใจหรือไม่?',
                // text: 'คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้!',
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
                    // this.collectAllTargets(list)
                    
                    this.apiAddTargets(list);
                    // Swal.fire('บันทึกแล้ว!', 'ข้อมูลของคุณถูกบันทึกเรียบร้อย', 'success')
                } else {
                    Swal.fire('ยกเลิก', 'ยกเลิกการบันทึกข้อมูลเรียบร้อย', 'error')
                }
            })
        },
        async apiAddTargets(list) {
            // this.collectAllTargets();
            let rawData = {
                "data": this.collectAllTargets(list)
            }
            console.log(list);
            console.log("raw === ", rawData);
            const config = {
                method: "post",
                url: "https://api2.cognizata.com/api/v2/monitor/targetandhashtag",
                data: rawData,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };
            console.log(config);
            this.axios(config)
            .then((response) => {
                console.log(response);
                let result = response.data || [];
                
                // this.load = false;
                this.resetTargetList();
                this.$emit("close");
                this.hideModal();
                Swal.fire({
                    title: 'บันทึกแล้ว!',
                    text: 'ข้อมูลของคุณถูกบันทึกเรียบร้อย',
                    icon: 'success',
                    // confirmButtonText: 'ตกลง',
                    // customClass: {
                    //     confirmButton: 'btn btn-success'
                    // },
                    showConfirmButton: false,
                    timer: 3000,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    buttonsStyling: false
                });
            })
            .catch((error) => {
                this.load = false;
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
    async mounted() {
        this.username = localStorage.getItem("username");
        if (this.username == "adminatapy") {
            this.options.push({ value: "news", text: "News" });
        }

        // if (this.addTarget.length === 0) {
        //     this.targetLists = []
        // }
        await this.apiGetProvinces();
        await this.apiGetInfluencerType();
    },
    // watch() {
    //     addTarget: {
            
    //     }
    // }
};
</script>

<style scoped>
.modal-body-scrollable {
    /* min-height: 65vh; */
    max-height: 60vh;         
    overflow-y: auto;         /* ให้ scroll เฉพาะแนวตั้ง */
    overflow-x: hidden;       /* ❌ ปิดการ scroll แนวนอน */
    padding-right: 10px;
    box-sizing: border-box;   /* เผื่อขนาด scrollbar */
}

.btn-close {
  color: #f8f9fa;
  background-color: #4c412b;
  border-color: #4c412b;
  box-shadow: 1px 1px 3px #666666;
}
.btn-save:hover {
  background: #fed16e;
  border-color: #fed16e;
}
.btn-save {
  background: #FFDEED;
  border-color: #FFDEED;
  color: #4c412b;
  box-shadow: 1px 1px 3px #666666;
}
td {
  vertical-align: middle;
}
.btn-add:hover {
  background-color: #504b3c;
  color: white;
}
.btn-add:hover .fa-plus {
  background-color: #504b3c;
}
.btn-add {
  background-color: #ffe6e6;
  color: #504b3c;
  padding: 8px;
  padding-top: 5px;
  padding-bottom: 5px;
  /* border-radius: 25px; */
  box-shadow: 1px 1px 3px #666666;
}

@media only screen and (min-width: 0px) and (max-width: 600px) {
  .btn-add {
    margin-top: 20px;
  }
}
/* ::v-deep(.vue-modaltor__panel) {
  width: 100% !important;
  height: 100vh !important; 
  max-width: 100% !important;
  max-height: 100vh !important;
  margin: 0 !important;
  border-radius: 0 !important;
  display: flex;
  flex-direction: column;
} */
</style>
