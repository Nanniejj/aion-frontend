<template>
  <div>
    <!-- {{getListMonitorProfile.targetlist.length}} -->
    <button class="btn btn-add mt-0" @click="open = true">
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
      :resize-width="{ 3000: '40%', 1350: '70%', 768: '90%' }"
    >
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
        <b-row class="my-1">
            <b-col sm="12">
            <span v-if="tabsMonitor == 'hashtaglist'">
                คำแนะนำ : กรุณาเลือกแหล่งข้อมูลออนไลน์และใส่แฮชแท็กที่ต้องการ</span
            >
            <span v-else-if="tabsMonitor == 'tabKeyword'">
                คำแนะนำ : กรุณาเลือกแหล่งข้อมูลออนไลน์และใส่ keyword
                ที่ต้องการ</span
            >
            <span v-else>
                คำแนะนำ : กรุณาเลือกแหล่งข้อมูลออนไลน์และใส่บัญชีที่ต้องการ</span
            >
            </b-col>
            <b-col sm="12">
            <br />
            <div v-if="tabsMonitor == 'hashtaglist'">
                <b-alert show
                >ตัวอย่างการใส่ข้อมูล <br />ใส่คำที่ต้องการโดย<b> ไม่ต้องใส่ #</b>
                เช่น #การเมือง ให้ใส่ <b>การเมือง</b></b-alert
                >
                <b-form-select
                v-model="selectSourceHash"
                :options="optionsHash"
                @change="resetHashtagList()"
                ></b-form-select>
            </div>
            <div v-else-if="tabsMonitor == 'tabKeyword'">
                <b-alert show
                >ตัวอย่างการใส่ข้อมูล <br />ใส่คำ keyword ที่ต้องการ เช่น การเมือง
                </b-alert>
                <b-form-select
                v-model="selectSourceKeyword"
                :options="optionsKeyword"
                ></b-form-select>
            </div>
            <div v-else>
                <b-alert v-if="selectSource == 'twitter'" show
                >ตัวอย่างการใส่ข้อมูล <br />
                https://twitter.com/username</b-alert
                >
                <b-alert v-else-if="selectSource == 'facebook'" show
                >ตัวอย่างการใส่ข้อมูล <br />
                https://facebook.com/username</b-alert
                >
                <b-alert v-else-if="selectSource == 'instagram'" show
                >ตัวอย่างการใส่ข้อมูล <br />
                https://instagram.com/username</b-alert
                >
                <b-alert v-else-if="selectSource == 'youtube'" show
                >ตัวอย่างการใส่ข้อมูล <br />
                https://youtube.com/username</b-alert
                >
                <b-alert v-else-if="selectSource == 'pantip'" show
                >ตัวอย่างการใส่ข้อมูล <br />
                https://pantip.com/profile/2116489 (หมายเลขสมาชิก)</b-alert
                >
                <b-alert v-else-if="selectSource == 'news'" show
                >ตัวอย่างการใส่ข้อมูล <br />
                ใส่ URL ของ Digital News เช่น https://dailynews.co.th/</b-alert
                >
                <b-alert v-else-if="selectSource == 'blockdit'" show
                >ตัวอย่างการใส่ข้อมูล <br />
                เช่น https://www.blockdit.com/username <br />
                หรือ https://www.blockdit.com/users/id</b-alert
                >
                <b-alert v-else-if="selectSource == 'tiktok'" show
                >ตัวอย่างการใส่ข้อมูล <br />
                เช่น https://www.tiktok.com/@username
                </b-alert>
                <b-alert v-else-if="selectSource == 'threads'" show
                >ตัวอย่างการใส่ข้อมูล <br />
                เช่น https://www.threads.net/@ch7hd
                </b-alert>
                <b-form-select
                    v-if="$route.name == 'Avatar'"
                    v-model="selectSource"
                    :options="optionsAV"
                    ></b-form-select>
                    <b-form-select
                    v-else
                    v-model="selectSource"
                    :options="options"
                    @change="resetTargetList()"
                ></b-form-select>
            </div>
            </b-col>
            <!--------------------------------------------------profile --------------------------------------------------------------->
            <b-col sm="12" class="" v-if="tabsMonitor == 'targetlist'">
                <label class="mt-4" for="textarea-default"><b>url บัญชี</b></label>
                <b-form-tags
                   :disabled="!selectSource"
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
                    <div class="col-12 px-0 pt-3">
                        <b>รายชื่อเป้าหมาย ({{ addTarget.length }})</b>
                    </div>
                    <hr class="my-2"/>
                    <div class="row justify-content-between mb-3 mx-0" v-for="(item, i) in targetLists" :key="'target- ' +i">
                        
                        <div class="col d-sm-none text-truncate px-0" style="max-width: 300px;">
                            {{ i + 1 }}. {{ item.url }}
                        </div>
                        <div class="col d-none d-sm-block text-truncate w-100 px-0" style="">
                            {{ i + 1 }}. {{ item.url }}
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
                            <!-- {{ item }} -->
                            <!-- v-if="checkLableData(item)|| item.editable" -->
                            <CardInput 
                                :targetInfo="item"
                                :provinces="provinces"
                                :influencerTypes="influencerTypes"
                                source="blockdit"
                                :editable="item.editable" 
                                @update:targetInfo="(data) => handleLabelData(data,item)"
                            />
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
            <!--------------------------------------------------addKeyword --------------------------------------------------------------->
            <b-col sm="12" v-else-if="tabsMonitor == 'tabKeyword'">
            <label class="mt-4" for="textarea-default"><b>keyword</b></label>
            <b-form-input
                id="input-default"
                v-model="addKeyword"
                :disabled="!selectSourceKeyword"
                placeholder="กรุณากรอก keyword"
            ></b-form-input>
            <!-- <b-form-tags
                input-id="tags-pills"
                v-model="addKeyword"
                tag-variant="light"
                tag-pills
                size="md"
                placeholder="Enter เพื่อเพิ่ม keyword"
                remove-on-delete
            ></b-form-tags> -->
            </b-col>
            <!--------------------------------------------------avatar --------------------------------------------------------------->
            <b-col sm="12" v-else>
            <label class="mt-4" for="textarea-default"><b>ชื่อทีม</b></label>
            <b-form-input
                id="input-default"
                v-model="selectTeam"
                :disabled="!selectSource"
                placeholder="กรุณาใส่ชื่อทีม"
            ></b-form-input>
            <!-- <b-form-select v-model="selectTeam" :disabled='!selectSource' :options="optionsTeam" ></b-form-select> -->
            <label class="mt-4" for="textarea-default"><b>ชื่อบัญชี</b></label>
            <b-form-tags
                input-id="tags-pills"
                :disabled="!selectTeam"
                v-model="addAvatar"
                tag-variant="light"
                tag-pills
                size="md"
                remove-on-delete
                placeholder="Enter เพื่อเพิ่มบัญชี"
                :tag-validator="validator"
                @tag-state="onTagState"
                separator=" ,;"
            ></b-form-tags>
            </b-col>
        </b-row>

        <!-- footer -->
        <b-row class="my-1">
            <b-col sm="12" style="text-align: right">
            <br />
            <b-button class="btn btn-close mr-2" size="sm" @click="hideModal()"
                >ปิดหน้าต่าง</b-button
            >
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
        // onTagsInput(tags) {
        //     console.log("add === ", tags);
        //     if (this.tabsMonitor === 'targetlist') {
        //         // กรอง tags ที่ยังไม่มีใน targetLists (ไม่ซ้ำ url)
        //         const newTags = tags.filter(tag =>
        //             !this.targetLists.some(item => item.url === tag)
        //         );
    
        //         // แปลง newTags เป็น object แล้วเพิ่มเข้า targetLists
        //         const newEntries = newTags.map(tag => ({
        //             url: tag,
        //             source: this.selectSource,
        //             editable: false,
        //             bot_level: 1,
        //             name: null,
        //             key: this.tabsMonitor === 'targetlist'
        //             ? 'account'
        //             : this.tabsMonitor === 'hashtaglist'
        //                 ? 'hashtag'
        //                 : null
        //         }));
        //         // รวมรายการเก่า + ใหม่
        //         this.targetLists = [...this.targetLists, ...newEntries];
        //     } else if (this.tabsMonitor === 'hashtaglist') {
        //         const newTags = tags.filter(tag =>
        //             !this.hashtagLists.some(item => item.uid === tag)
        //         );
    
        //         // แปลง newTags เป็น object แล้วเพิ่มเข้า hashtagLists
        //         const newEntries = newTags.map(tag => ({
        //             uid: tag,
        //             source: this.selectSourceHash,
        //             editable: false,
        //             bot_level: 1,
        //             // name: null,
        //             key: this.tabsMonitor === 'targetlist'
        //             ? 'account'
        //             : this.tabsMonitor === 'hashtaglist'
        //                 ? 'hashtag'
        //                 : null
        //         }));
        //         // รวมรายการเก่า + ใหม่
        //         this.hashtagLists = [...this.hashtagLists, ...newEntries];
        //     }

        // },
        onTagsInput(tags) {
            // 1. Normalize tags → ตัด www และ / ท้าย
            const normalizedTags = tags.map(tag =>
                tag.replace("://www.", "://").replace(/\/+$/, '')
            );

            // 2. Sync ค่าใน addTarget (กำจัด tag ซ้ำ/ผิดรูปแบบ)
            this.addTarget = normalizedTags;

            if (this.tabsMonitor === 'targetlist') {
                // 🔥 ลบรายการที่ถูกลบออกจาก addTarget
                this.targetLists = this.targetLists.filter(item =>
                normalizedTags.includes(item.url.replace("://www.", "://").replace(/\/+$/, ''))
                );

                // ✅ หา tags ที่ยังไม่มีใน targetLists
                const newTags = normalizedTags.filter(tag =>
                !this.targetLists.some(item =>
                    item.url.replace("://www.", "://").replace(/\/+$/, '') === tag
                )
                );

                // สร้าง object ใหม่
                const newEntries = newTags.map(tag => ({
                url: tag,
                source: this.selectSource,
                editable: false,
                bot_level: 1,
                name: null,
                key: this.tabsMonitor === 'targetlist'
                    ? 'account'
                    : this.tabsMonitor === 'hashtaglist'
                    ? 'hashtag'
                    : null
                }));

                // รวมกับของเดิม
                this.targetLists = [...this.targetLists, ...newEntries];

            } else if (this.tabsMonitor === 'hashtaglist') {
                // 🔥 ลบรายการที่ถูกลบออกจาก addTarget
                this.hashtagLists = this.hashtagLists.filter(item =>
                normalizedTags.includes(item.uid.replace("://www.", "://").replace(/\/+$/, ''))
                );

                // ✅ หา tags ที่ยังไม่มีใน hashtagLists
                const newTags = normalizedTags.filter(tag =>
                !this.hashtagLists.some(item =>
                    item.uid.replace("://www.", "://").replace(/\/+$/, '') === tag
                )
                );

                // สร้าง object ใหม่
                const newEntries = newTags.map(tag => ({
                uid: tag,
                source: this.selectSourceHash,
                editable: false,
                bot_level: 1,
                key: this.tabsMonitor === 'targetlist'
                    ? 'account'
                    : this.tabsMonitor === 'hashtaglist'
                    ? 'hashtag'
                    : null
                }));

                // รวมกับของเดิม
                this.hashtagLists = [...this.hashtagLists, ...newEntries];
            }
        },
        toggleEdited(item) {
            item.editable = !item.editable
        },
        formatTag(tag) {
            return tag.replace("://www.", "://").replace(/\/+$/, '');
        },
        validator(tag) {
            // const normalizedTag = tag.replace("://www.", "://");
            // if (this.selectSource == "twitter") {
            //     return tag.includes("https://twitter.com/");
            // } else if (this.selectSource == "facebook") {
            //     return tag.includes("https://facebook.com/");
            // } else if (this.selectSource == "instagram") {
            //     return tag.includes("https://instagram.com/");
            // } else if (this.selectSource == "youtube") {
            //     return tag.includes("https://youtube.com/");
            // } else if (this.selectSource == "tiktok") {
            //     return tag.includes("https://www.tiktok.com/@");
            // } else if (this.selectSource == "threads") {
            //     return tag.includes("https://www.threads.net/");
            // } else {
            //     return tag;
            // }
            const normalizedTag = tag.replace("://www.", "://");
            if (this.selectSource === "twitter") {
                return normalizedTag.includes("https://twitter.com/");
            } else if (this.selectSource === "facebook") {
                return normalizedTag.includes("https://facebook.com/");
            } else if (this.selectSource === "instagram") {
                return normalizedTag.includes("https://instagram.com/");
            } else if (this.selectSource === "youtube") {
                return normalizedTag.includes("https://youtube.com/");
            } else if (this.selectSource === "tiktok") {
                return normalizedTag.includes("https://tiktok.com/@");
            } else if (this.selectSource === "threads") {
                return normalizedTag.includes("https://threads.net/");
            } else {
                return false;
            }
        },
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
                influencer_type: influencer_type.map(item => item.value)
            }));
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
                    confirmButtonText: 'ตกลง',
                    customClass: {
                        confirmButton: 'btn btn-success'
                    },
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
::v-deep(.b-form-tag) {
  max-width: 250px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border: 1px solid #ccc !important;
}
</style>
