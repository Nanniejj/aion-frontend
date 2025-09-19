<template>
    <div>
        <!-- {{getListMonitorProfile.targetlist.length}} -->
        <button class="btn btn-add mt-3 mt-xl-0 w-100" @click="open = true">
            <i class="fa fa-plus" />
            <span style="font-size: 16px">
                เพิ่มกลุ่ม
            </span>
        </button>

        <vue-modaltor :visible="open" @hide="hideModal" :animation-panel="'modal-slide-top'"
            :resize-width="{ 3000: '80%', 1350: '80%', 768: '90%' }">
            <!-- :resize-width="{ 3000: '50%', 1350: '80%', 768: '90%' }" -->
            <!-- :resize-width="{ 3000: '99%', 1350: '90%', 768: '90%' }" -->
            <div>
                <h5><b>เพิ่มกลุ่มบัญชี</b></h5>
                <hr />
            </div>

            <!-- body -->
            <b-row class="my-1 mx-0">
                <b-col sm="12" class="px-0">
                    <div>
                        <b-alert show
                        >ตัวอย่างการใส่ข้อมูล <br/>
                        การเพิ่มกลุ่ม<b> ต้องเพิ่ม url ของ group เท่านั้น และไม่ต้องใส่ www.</b>
                        เช่น https://www.facebook.com/groups ให้ใส่ <b>https://facebook.com/groups/...</b></b-alert
                        >
                    </div>
                </b-col>
                <b-col sm="12" class="px-0" style="min-height: 400px;">
                    <label class="mt-3" for="textarea-default"><b>url บัญชี ({{ communities.length }})</b></label>
                    <!-- :disabled="!selectSource" -->
                    <b-form-tags
                        input-id="tags-pills"
                        v-model="communities"
                        tag-variant="light"
                        tag-pills
                        size="md"
                        placeholder="Enter เพื่อเพิ่มบัญชี"
                        :tag-validator="validator"
                        @input="onTagsInput"
                        @tag-state="onTagState"
                        separator=" ,;"
                        remove-on-delete
                />
                    <!-- <div class="col-12 px-0" v-if="communities.length">

                   
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
                </div> -->
                </b-col>
            </b-row>

            <!-- footer -->
            <b-row class="m-0  justify-content-end mt-3">
                <b-col cols="auto">
                    <b-button @click="clear" size="sm" variant="outline-danger">
                        <i class="fa fa-eraser" aria-hidden="true"></i>
                        clear
                    </b-button>
                </b-col>
                <b-col cols="auto">
                    <b-button class="btn btn-save" size="sm">
                        บันทึก
                    </b-button>
                </b-col>
            </b-row>
        </vue-modaltor>
    </div>
</template>

<script>
// import CardInput from "./_CardInput.vue";
import Swal from 'sweetalert2'
export default {
    components: {

    },
    props: {

    },

    data() {
        return {
            open: false,
            validTags: [],
            invalidTags: [],
            duplicateTags: [],
            communities: [],
            targetLists:[],
            platforms: {
                facebook: [],
                // tiktok: [],
                // youtube: [],
                // instagram: [],
                // twitter: [],
                // pantip: [],
                // blockdit: [],
                // threads:[],
                // news:[]
            },
        }
    },
    methods: {
        hideModal() {
            this.open = false;
        },
        handleList() {

        },
        clear() {
            this.communities = [];
        },
        validator(tag) {
            // ❌ จำกัดไม่เกิน 100 รายการ
            if (this.communities.length >= 100) {
                Swal.fire({
                icon: 'warning',
                title: "เพิ่มได้สูงสุด 100 เป้าหมาย",
                showConfirmButton: false,
                timer: 2000
                });
                return false;
            }

            // ✅ ตรวจว่าเป็น URL ที่ถูกต้อง

            return true;
        },
        onTagState(valid, invalid, duplicate) {
            this.validTags = valid;
            this.invalidTags = invalid;
            this.duplicateTags = duplicate; 
        },
        normalizeUrl(url) {
            if (!/^https?:\/\//i.test(url)) url = "https://" + url;
            let u = new URL(url);
            let parts = u.hostname.split(".");
            let hostname = parts.slice(-2).join(".");
            let normalized = `https://${hostname}${u.pathname}`;
            if (normalized.endsWith("/") && u.pathname !== "/") normalized = normalized.slice(0, -1);
            return normalized;
        },
        isFacebookGroupUrl(url) {
            if (!/^https?:\/\//i.test(url)) url = "https://" + url;
            let u = new URL(url);
            let parts = u.hostname.split(".");
            let hostname = parts.slice(-2).join(".");
            return hostname === "facebook.com" && /^\/groups\/[0-9A-Za-z\.]+/.test(u.pathname);
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

            // ✨ 2. แยก tag ที่ valid / invalid
            const validTags = normalizedTags.filter(tag => this.isFacebookGroupUrl(tag));
            const invalidTags = normalizedTags.filter(tag => !this.isFacebookGroupUrl(tag));

            // 🚨 แจ้งผู้ใช้ถ้ามี tag ที่ไม่ใช่ Facebook Group
            if (invalidTags.length > 0) {
                Swal.fire({
                    icon: "warning",
                    title: "บาง URL ไม่ใช่ Facebook Group",
                    html: invalidTags.join("<br>"),
                    showConfirmButton: true,
                    didOpen: () => {
                        const iconContent = document.querySelector('.swal2-icon-content');
                        if (iconContent) iconContent.style.display = 'none';
                    }
                });
            }

            // 🚫 จำกัดไม่เกิน 100
            let limitedTags = validTags;
            if (validTags.length > 100) {
                Swal.fire({
                icon: "warning",
                title: "เพิ่มได้สูงสุด 100 เป้าหมาย",
                showConfirmButton: false,
                timer: 2000,
                });
                limitedTags = validTags.slice(0, 100);
            }

            // ✨ 3. Sync addTarget
            this.communities = limitedTags;
            console.log(limitedTags);

            // ✨ 4. map เป็น object พร้อมระบุ source (platform)
            const newEntries = limitedTags.map(tag => {
                const platform = this.detectPlatformName(tag);
                return {
                url: tag,
                source: platform,
                editable: false,
                bot_level: 1,
                name: null,
                key: "account",
                target_type: "group",
                };
            });

            // ✅ 5. ล้างค่าเก่าใน platforms
            Object.keys(this.platforms).forEach(p => {
                this.platforms[p] = [];
            });

            // ✅ 6. เพิ่ม entry แยกตาม platform โดยไม่ซ้ำ
            const addUnique = (platformArray, entry) => {
                if (!platformArray.some(e => e.url === entry.url)) {
                platformArray.push(entry);
                }
            };

            newEntries.forEach(entry => {
                const platform = entry.source;
                if (platform && this.platforms[platform]) {
                addUnique(this.platforms[platform], entry);
                }
            });

            // ✅ 7. รวมสมาชิกทุก platform
            this.targetLists = Object.values(this.platforms)
                .flat()
                .filter((item, index, self) => index === self.findIndex(e => e.url === item.url));
        },

        async apiAddCommunity() {
            let rawData = {
                "data": this.handleList(this.communities)
            }
            console.log(this.communities);
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
                    Swal.fire({
                        title: 'บันทึกไม่สำเสร็จ',
                        text: error,
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

    },
};
</script>

<style scoped>
.card-target:hover {
    border: 2px solid #17a2b8;
    box-shadow: 10px 10px 15px rgba(23, 162, 184, 0.6);
    /* กรอบเรืองแสงสีน้ำเงิน */
    cursor: pointer;
}

.card-target.is-selected {
    border: 2px solid #17a2b8;
    /* ขอบสีฟ้าเมื่ออยู่ใน newTargets */
    box-shadow: 0 0 12px rgba(23, 162, 184, 0.6);
}

.platform-imgs {
    width: 25px;
}

.dashed-border {
    border: 1px dashed #ccc;
    /* เส้นประสีเทา */
    border-radius: 6px;
    /* (ถ้าอยากได้มุมโค้ง) */
    padding: 8px;
    /* เพิ่มระยะห่างด้านใน */
}

.add-btn {
    background: linear-gradient(90deg, #FDD071 0%, #ffbcbc 100%);
    border: none;
    color: #776167;
    /* ให้ตัวอักษรอ่านง่าย */
    font-weight: bold;
}

.modal-body-scrollable {
    /* min-height: 45vh;
    max-height: 45vh; */
    max-width: 95vw;
    overflow-y: auto;
    /* ให้ scroll เฉพาะแนวตั้ง */
    overflow-x: hidden;
    /* ❌ ปิดการ scroll แนวนอน */
    padding-left: 10px;
    padding-right: 10px;
    box-sizing: border-box;
    /* เผื่อขนาด scrollbar */
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
</style>
