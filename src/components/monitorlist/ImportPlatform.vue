<template>
    <span>
        <button class="btn btn-add mt-0 d-inline w-100" @click="open = true">
            <i class="fa fa-file-import" />
            <span style="font-size: 16px">
                import CSV
            </span>
        </button>
        <vue-modaltor :visible="open" @hide="hideModal" :animation-panel="'modal-slide-top'"
            :resize-width="{ 3000: '80%', 1350: '80%', 768: '90%' }" class="">
            <b-row class="justify-content-between px-3">
                <h5><b>เพิ่มบัญชี</b></h5>
            </b-row>
            <hr class="mx-0" />

            <!-- body -->
            <div class="col-12 modal-body-scrollable px-0">
                <div class="my-3 mb-5" v-if="facebook.length">
                    <b>Facebook ({{ facebook.length }})</b>
                    <hr />
                    <div class="row m-0">
                        <div class="col-12 col-lg-6 py-2 px-0 px-sm-2" v-for="(item, i) in facebook"
                            :key="'facebook- ' + i">
                            <div class="row m-0">
                                <a :href="item.url" target="_blank" class="col text-truncate d-inline-block px-0"
                                    style="width: 100px;">
                                    {{ i + 1 }}. {{ item.url }}
                                </a>

                                <b-button class="col-auto" variant="info" v-if="!item.editable"
                                    @click="toggleEdited(item)">
                                    <i class="fa fa-edit"></i>
                                </b-button>

                                <div class="col-auto pl-0" v-else>
                                    <b-button class="mr-2" variant="success" @click="toggleEdited(item)">
                                        <i class="fa fa-save"></i>
                                    </b-button>
                                    <b-button variant="danger" @click="toggleEdited(item)">
                                        <i class="fa fa-times"></i>
                                    </b-button>
                                </div>
                                <div class="col-12 mt-3 p-0">
                                    <!-- {{ item }} -->
                                    <CardInput class="" :provinces="provinces" :country="country" :influencerTypes="influencerTypes"
                                        :targetInfo="item" source="facebook" :editable="item.editable"
                                        @update:targetInfo="(data) => handleLabelData(data, item)" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="my-3 mb-5" v-if="twitter.length">
                    <b>Twitter ({{ twitter.length }})</b>
                    <hr />
                    <div class="row m-0">
                        <div class="col-12 col-lg-6 py-2 px-0 px-sm-2" v-for="(item, i) in twitter"
                            :key="'twitter- ' + i">
                            <div class="row m-0">
                                <a :href="item.url" target="_blank" class="col text-truncate d-inline-block px-0"
                                    style="width: 100px;">
                                    {{ i + 1 }}. {{ item.url }}
                                </a>

                                <b-button class="col-auto" variant="info" v-if="!item.editable"
                                    @click="toggleEdited(item)">
                                    <i class="fa fa-edit"></i>
                                </b-button>

                                <div class="col-auto" v-else>
                                    <b-button class="mr-2" variant="success" @click="toggleEdited(item)">
                                        <i class="fa fa-save"></i>
                                    </b-button>
                                    <b-button variant="danger" @click="toggleEdited(item)">
                                        <i class="fa fa-times"></i>
                                    </b-button>
                                </div>
                                <div class="col-12 mt-3 p-0">

                                    <CardInput class="" :targetInfo="item" :provinces="provinces" :country="country"
                                        :influencerTypes="influencerTypes" source="twitter" :editable="item.editable"
                                        @update:targetInfo="(data) => handleLabelData(data, item)" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="my-3 mb-5" v-if="instagram.length">
                    <b>Instagram ({{ instagram.length }})</b>
                    <hr />
                    <div class="row m-0">
                        <div class="col-12 col-lg-6 py-2 px-0 px-sm-2" v-for="(item, i) in instagram"
                            :key="'instagram- ' + i">
                            <div class="row m-0">
                                <a :href="item.url" target="_blank" class="col text-truncate d-inline-block px-0"
                                    style="width: 100px;">
                                    {{ i + 1 }}. {{ item.url }}
                                </a>

                                <b-button class="col-auto" variant="info" v-if="!item.editable"
                                    @click="toggleEdited(item)">
                                    <i class="fa fa-edit"></i>
                                </b-button>

                                <div class="col-auto" v-else>
                                    <b-button class="mr-2" variant="success" @click="toggleEdited(item)">
                                        <i class="fa fa-save"></i>
                                    </b-button>
                                    <b-button variant="danger" @click="toggleEdited(item)">
                                        <i class="fa fa-times"></i>
                                    </b-button>
                                </div>
                                <div class="col-12 mt-3 p-0">

                                    <CardInput class="" :targetInfo="item" :provinces="provinces" :country="country"
                                        :influencerTypes="influencerTypes" source="instagram" :editable="item.editable"
                                        @update:targetInfo="(data) => handleLabelData(data, item)" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="my-3 mb-5" v-if="tiktok.length">
                    <b>Tiktok ({{ tiktok.length }})</b>
                    <hr />
                    <div class="row m-0">
                        <div class="col-12 col-lg-6 py-2 px-0 px-sm-2" v-for="(item, i) in tiktok" :key="'tiktok- ' + i">
                            <div class="row m-0">
                                <a :href="item.url" target="_blank" class="col text-truncate d-inline-block px-0"
                                    style="width: 100px;">
                                    {{ i + 1 }}. {{ item.url }}
                                </a>

                                <b-button class="col-auto" variant="info" v-if="!item.editable"
                                    @click="toggleEdited(item)">
                                    <i class="fa fa-edit"></i>
                                </b-button>

                                <div class="col-auto" v-else>
                                    <b-button class="mr-2" variant="success" @click="toggleEdited(item)">
                                        <i class="fa fa-save"></i>
                                    </b-button>
                                    <b-button variant="danger" @click="toggleEdited(item)">
                                        <i class="fa fa-times"></i>
                                    </b-button>
                                </div>
                                <div class="col-12 mt-3 p-0">

                                    <CardInput class="" :targetInfo="item" :provinces="provinces" :country="country"
                                        :influencerTypes="influencerTypes" source="tiktok" :editable="item.editable"
                                        @update:targetInfo="(data) => handleLabelData(data, item)" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="my-3 mb-5" v-if="youtube.length">
                    <b>Youtube({{ youtube.length }})</b>
                    <hr />
                    <div class="row m-0">
                        <div class="col-12 col-lg-6 py-2 px-0 px-sm-2" v-for="(item, i) in youtube"
                            :key="'youtube- ' + i">
                            <div class="row m-0">
                                <a :href="item.url" target="_blank" class="col text-truncate d-inline-block px-0"
                                    style="width: 100px;">
                                    {{ i + 1 }}. {{ item.url }}
                                </a>

                                <b-button class="col-auto" variant="info" v-if="!item.editable"
                                    @click="toggleEdited(item)">
                                    <i class="fa fa-edit"></i>
                                </b-button>

                                <div class="col-auto" v-else>
                                    <b-button class="mr-2" variant="success" @click="toggleEdited(item)">
                                        <i class="fa fa-save"></i>
                                    </b-button>
                                    <b-button variant="danger" @click="toggleEdited(item)">
                                        <i class="fa fa-times"></i>
                                    </b-button>
                                </div>
                                <div class="col-12 mt-3 p-0">

                                    <CardInput class="" :targetInfo="item" :provinces="provinces" :country="country"
                                        :influencerTypes="influencerTypes" source="youtube" :editable="item.editable"
                                        @update:targetInfo="(data) => handleLabelData(data, item)" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="my-3 mb-5" v-if="pantip.length">
                    <b>Pantip({{ pantip.length }})</b>
                    <hr />
                    <div class="row m-0">
                        <div class="col-12 col-lg-6 py-2 px-0" v-for="(item, i) in pantip" :key="'pantip- ' + i">
                            <div class="row m-0">
                                <a :href="item.url" target="_blank" class="col text-truncate d-inline-block px-0"
                                    style="width: 100px;">
                                    {{ i + 1 }}. {{ item.url }}
                                </a>

                                <b-button class="col-auto" variant="info" v-if="!item.editable"
                                    @click="toggleEdited(item)">
                                    <i class="fa fa-edit"></i>
                                </b-button>

                                <div class="col-auto" v-else>
                                    <b-button class="mr-2" variant="success" @click="toggleEdited(item)">
                                        <i class="fa fa-save"></i>
                                    </b-button>
                                    <b-button variant="danger" @click="toggleEdited(item)">
                                        <i class="fa fa-times"></i>
                                    </b-button>
                                </div>
                                <div class="col-12 mt-3 p-0">

                                    <CardInput class="" :targetInfo="item" :provinces="provinces" :country="country"
                                        :influencerTypes="influencerTypes" source="pantip" :editable="item.editable"
                                        @update:targetInfo="(data) => handleLabelData(data, item)" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="my-3 mb-5" v-if="blockdit.length">
                    <b>Blockdit({{ blockdit.length }})</b>
                    <hr />
                    <div class="row m-0">
                        <div class="col-12 col-lg-6 py-2 px-0 px-sm-2" v-for="(item, i) in blockdit"
                            :key="'blockdit- ' + i">
                            <div class="row m-0">
                                <a :href="item.url" target="_blank" class="col text-truncate d-inline-block px-0"
                                    style="width: 100px;">
                                    {{ i + 1 }}. {{ item.url }}
                                </a>

                                <b-button class="col-auto" variant="info" v-if="!item.editable"
                                    @click="toggleEdited(item)">
                                    <i class="fa fa-edit"></i>
                                </b-button>

                                <div class="col-auto" v-else>
                                    <b-button class="mr-2" variant="success" @click="toggleEdited(item)">
                                        <i class="fa fa-save"></i>
                                    </b-button>
                                    <b-button variant="danger" @click="toggleEdited(item)">
                                        <i class="fa fa-times"></i>
                                    </b-button>
                                </div>
                                <div class="col-12 mt-3 p-0">
                                    <CardInput :targetInfo="item" :provinces="provinces" :country="country"
                                        :influencerTypes="influencerTypes" source="blockdit" :editable="item.editable"
                                        @update:targetInfo="(data) => handleLabelData(data, item)" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- {{ targetLists }} -->
            </div>

            <!-- footer -->
            <b-row class="my-1">

                <b-col sm="12" style="text-align: right">
                    <!-- <br />
                <b-button class="btn btn-close mr-2" @click="hideModal()"
                    >ปิดหน้าต่าง</b-button
                >
    
                <div class="d-inline "> 
                    <b-button
                    variant="success"
                    class="btn btn-save"
                    :loading="true"
                    @click="addRowTarget()"
                    :disabled="
                        facebook.length == 0 &&
                        tiktok.length == 0 &&
                        youtube.length == 0 &&
                        instagram.length == 0 &&
                        twitter.length == 0 &&
                        pantip.length == 0 &&
                        blockdit.length == 0||loading
                    "
                    ><vue-element-loading
                    :active="loading"
                    size="45"
                    background-color="rgba(255, 255, 255, 0.4)"
                    color="#b6ac9a"
                    />บันทึก
                    </b-button>
                </div> -->
                    <div class="text-right mt-2">
                        <span class="text-right mt-2 mr-2" v-if="
                            facebook.length ||
                            tiktok.length ||
                            youtube.length ||
                            instagram.length ||
                            twitter.length ||
                            pantip.length ||
                            blockdit.length
                        ">

                            <b-button variant="success" class="btn btn-save mt-2" :loading="true" @click="confirmSave()"
                                :disabled="facebook.length == 0 &&
                                    tiktok.length == 0 &&
                                    youtube.length == 0 &&
                                    instagram.length == 0 &&
                                    twitter.length == 0 &&
                                    pantip.length == 0 &&
                                    blockdit.length == 0 || loading
                                    "><vue-element-loading :active="loading" size="45" background-color="rgba(255, 255, 255, 0.4)"
                                    color="#b6ac9a" />บันทึก
                            </b-button>
                        </span>

                        <b-button @click="clear" variant="outline-danger" class="mr-2  mt-2 ">
                            <i class="fa fa-eraser" aria-hidden="true"></i>
                            clear</b-button>
                        <b-button @click="downloadCSVFromPublicFile('aion_target_url_with_label_xlsx.xlsx')"
                            variant="outline-info" class="mr-2  mt-2 ">
                            <i class="fa fa-download" aria-hidden="true"></i>
                            ตัวอย่างไฟล์</b-button>
                        <input id="fileInput" type="file" class="d-none" @input="handleFileUpload"
                            accept=".csv, .xls, .xlsx" />

                        <label for="fileInput" class="btn-import mb-0 mt-2">
                            <i class="fas fa-file-import"></i> import CSV
                        </label>
                    </div>
                </b-col>
            </b-row>
        </vue-modaltor>
    </span>
</template>
<script>
import Papa from "papaparse";
import * as XLSX from "xlsx"; // เพิ่มส่วนนี้
import CardInput from "./_CardInput.vue";
import Swal from 'sweetalert2'
export default {
    components: {
        CardInput
    },
    data() {
        return {
            loading: false,
            open: false,
            // editProfile: false,
            urls: [],
            facebook: [],
            tiktok: [],
            youtube: [],
            instagram: [],
            twitter: [],
            pantip: [],
            blockdit: [],
            targetLists: [],
            provinces: [],
            country: [],
            influencerTypes: [],
            districts: [],
            subDistricts: [],
            speciesTypes: [
                { text: 'บุคคลทั่วไป', value: 'people' },
                { text: 'ดารา / นักแสดง / ศิลปิน', value: 'actor' },
                { text: 'ผู้เชี่ยวชาญ', value: 'expert' },
                { text: 'นักการเมือง/ พรรคการเมือง', value: 'political' },
                { text: 'สัตว์เลี้ยง', value: 'pet' },
                { text: 'แบรนด์ / ร้านค้า', value: 'brand' },
                { text: 'องค์กร / บริษัท', value: 'company' },
                { text: 'บัญชีอัตโนมัติ / บอท / AI', value: 'bot' },
                { text: 'ตัวละครในจินตนาการ / การ์ตูน / หนัง', value: 'fictional' },
                { text: 'เด็ก / ทารก', value: 'kid' },
                { text: 'คู่รัก / ครอบครัว', value: 'family' },
                { text: 'สัตว์ธรรมชาติ / สัตว์ป่า', value: 'wild_animal' },
                { text: 'ไม่ระบุ', value: 'none' }
            ],
            influConditions: [
                { text: 'เลือกระดับ Influencer', value: null, disabled: true },
                { text: 'ผู้มีอิทธิพลจากยอดติดตาม', value: 'follower' },
                { text: 'ผู้มีอิทธิพลจากโพส', value: 'impact' },
                { text: 'คนทั่วไป', value: 'none' },
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

            ]
        };
    },
    methods: {
        getPlatformFromUrl(url) {
            try {
                const host = new URL(url).hostname.replace("www.", "");

                if (host === "youtube.com") return "youtube";
                if (host === "facebook.com") return "facebook";
                if (host === "instagram.com") return "instagram";
                if (host === "tiktok.com") return "tiktok";
                if (host === "twitter.com") return "twitter";
                if (host === "x.com") return "twitter";
                if (host === "pantip.com") return "pantip";
                if (host === "blockdit.com") return "blockdit";

                return null;
            } catch {
                return null;
            }
        },

        handleLabelData(data, itemPlatform) {
            // console.log(data);
            // คัดลอกทุก key จาก data ไปยัง itemPlatform (รวมทั้งเพิ่ม key ใหม่)
            Object.keys(data).forEach(key => {
                itemPlatform[key] = data[key];
            });
            // console.log('itemPlatform ==== ',itemPlatform);
            this.checkLableData(itemPlatform)
        },
        checkLableData(item) {
            // console.log("check === ", item);

            // ถ้าไม่มี url → false ทันที
            if (!item.url || item.url.trim() === '') {
                return false;
            }

            // สร้างสำเนา object โดยไม่รวม url และ key ที่ไม่ต้องพิจารณา (เช่น key, editable)
            const checkKeys = Object.keys(item).filter(key =>
                key !== 'url' && key !== 'key' && key !== 'editable' && key !== 'bot_level' && key !== 'source'
            );

            // ถ้ามี field อื่นที่ไม่เป็น null หรือไม่ว่าง → return true
            const hasOtherValue = checkKeys.some(key => {
                const val = item[key];
                return val !== null && val !== '' && val !== undefined;
            });

            return hasOtherValue;
        },
        toggleEdited(item) {
            item.editable = !item.editable
        },
        downloadCSVFromPublicFile(filename) {
            // console.log("filename ==== ",filename);

            // fetch("/" + filename)
            //     .then((response) => response.text())
            //     .then((csv) => {
            //         // เพิ่ม BOM เพื่อรองรับภาษาไทยใน Excel
            //         const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });

            //         const url = URL.createObjectURL(blob);
            //         const link = document.createElement("a");
            //         link.setAttribute("href", url);
            //         link.setAttribute("download", filename || "data.csv");
            //         document.body.appendChild(link);
            //         link.click();
            //         document.body.removeChild(link);
            //     })
            //     .catch((error) =>
            //         console.error("เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์ CSV:", error)
            //     );
            fetch("/" + filename)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.blob(); // ✅ ใช้ blob แทน text
                })
                .then((blob) => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.setAttribute("href", url);
                    link.setAttribute("download", filename || "download.xlsx"); // ให้ชื่อไฟล์ตรง
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
                .catch((error) => {
                    console.error("เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์:", error);
                });
        },
        clear() {
            this.facebook = [];
            this.tiktok = [];
            this.youtube = [];
            this.instagram = [];
            this.twitter = [];
            this.pantip = [];
            this.blockdit = [];
            this.targetLists = [];
            const inputElement = document.getElementById("fileInput");
            if (inputElement) {
                inputElement.value = null;
            }
        },
        cleanedText(text) {
            return text.replace(/^(อ\. |ต\. |แขวง |เขต )/, ''); // ลบเฉพาะถ้าอยู่ต้นคำ
        },
        // async checkLocation(item) {
        //     // console.log("checkLocation === ", item);
        //     let province = item.province? (this.provinces.find(p => p.text === item.province)?.value || null): null
        //     // console.log("province === ", province);
        //     if (province) {
        //         let amphure = await this.apiGetDistrict(province);
        //         if (item.district) {
        //             let curren_district = this.cleanedText(item.district);
        //             // console.log("item.district === ", item.district);
        //             let district = curren_district ? (amphure.find(d => d.text === curren_district)?.value || null) : null;
        //             // console.log("district === ", district);
        //             let tumbon = await this.apiGetSubDistrict(district);
        //             // console.log("tumbon === ", tumbon);
        //             if (item.sub_district) {
        //                 let curren_sub_district = this.cleanedText(item.sub_district);
        //                 // console.log("item.sub_district === ", item.sub_district);
        //                 let subDistrict = curren_sub_district ? (tumbon.find(s => s.text === curren_sub_district)?.value || null) : null;
        //                 // console.log("subDistrict === ", subDistrict);
        //                return subDistrict ? subDistrict : null;
        //             } else {
        //                 return district
        //             }
        //         }else {
        //             return province
        //         }
        //     }

        //     return null;
        // },
        async checkLocation(item) {
            let provinceId = null;
            let districtId = null;
            let subDistrictId = null;

            // 1) Province
            if (item.province) {
                const province = this.provinces.find(p => p.text === item.province);
                provinceId = province ? province.value : null;
            }

            // ไม่มีจังหวัด → return ทั้งหมดเป็น null
            if (!provinceId) {
                return [null, null, null];
            }

            // 2) District
            let amphure = await this.apiGetDistrict(provinceId);

            if (item.district) {
                const cleanDistrict = this.cleanedText(item.district);
                const district = amphure.find(d => d.text === cleanDistrict);
                districtId = district ? district.value : null;
            }

            // ไม่มี district → return แค่ province
            if (!districtId) {
                return [provinceId, null, null];
            }

            // 3) Subdistrict
            let tumbon = await this.apiGetSubDistrict(districtId);

            if (item.sub_district) {
                const cleanSubDistrict = this.cleanedText(item.sub_district);
                const subDistrict = tumbon.find(s => s.text === cleanSubDistrict);
                subDistrictId = subDistrict ? subDistrict.value : null;
            }

            return [provinceId, districtId, subDistrictId];
        },
        async addRowTarget() {
            this.loading = true;
            const promises = [];

            if (this.facebook.length) {
                promises.push(
                    this.$store.dispatch("CreateMonitor", {
                        source: "facebook",
                        account: this.facebook,
                    })
                );
            }
            if (this.twitter.length) {
                promises.push(
                    this.$store.dispatch("CreateMonitor", {
                        source: "twitter",
                        account: this.twitter,
                    })
                );
            }
            if (this.youtube.length) {
                promises.push(
                    this.$store.dispatch("CreateMonitor", {
                        source: "youtube",
                        account: this.youtube,
                    })
                );
            }
            if (this.instagram.length) {
                promises.push(
                    this.$store.dispatch("CreateMonitor", {
                        source: "instagram",
                        account: this.instagram,
                    })
                );
            }
            if (this.pantip.length) {
                promises.push(
                    this.$store.dispatch("CreateMonitor", {
                        source: "pantip",
                        account: this.pantip,
                    })
                );
            }
            if (this.blockdit.length) {
                promises.push(
                    this.$store.dispatch("CreateMonitor", {
                        source: "blockdit",
                        account: this.blockdit,
                    })
                );
            }
            if (this.tiktok.length) {
                promises.push(
                    this.$store.dispatch("CreateMonitor", {
                        source: "tiktok",
                        account: this.tiktok,
                    })
                );
            }

            try {
                await Promise.all(promises);
                this.showAlert("เพิ่มบัญชีเรียบร้อย!");
                this.loading = false;
                this.clear();
                // promises = []
                this.hideModal();
            } catch (error) {
                this.showAlert("เกิดข้อผิดพลาด: " + error.message);
            }
        },
        collectAllTargets() {
            let cleanedFacebook = this.facebook.map(({ editable, influencer_type, url, ...rest }) => ({
                ...rest,
                influencer_type: influencer_type.map(item => item.value),
                URL: url
            }));
            let cleanedTiktok = this.tiktok.map(({ editable, influencer_type, url, ...rest }) => ({
                ...rest,
                influencer_type: influencer_type.map(item => item.value),
                URL: url
            }));
            let cleanedYoutube = this.youtube.map(({ editable, influencer_type, url, ...rest }) => ({
                ...rest,
                influencer_type: influencer_type.map(item => item.value),
                URL: url
            }));
            let cleanedInstagram = this.instagram.map(({ editable, influencer_type, url, ...rest }) => ({
                ...rest,
                influencer_type: influencer_type.map(item => item.value),
                URL: url
            }));
            let cleanedTwitter = this.twitter.map(({ editable, influencer_type, url, ...rest }) => ({
                ...rest,
                influencer_type: influencer_type.map(item => item.value),
                URL: url
            }));
            let cleanedPantip = this.pantip.map(({ editable, influencer_type, url, ...rest }) => ({
                ...rest,
                influencer_type: influencer_type.map(item => item.value),
                URL: url
            }));
            let cleanedBlockdit = this.blockdit.map(({ editable, influencer_type, url, ...rest }) => ({
                ...rest,
                influencer_type: influencer_type.map(item => item.value),
                URL: url
            }));
            this.targetLists = [
                ...cleanedFacebook,
                ...cleanedTiktok,
                ...cleanedYoutube,
                ...cleanedInstagram,
                ...cleanedTwitter,
                ...cleanedPantip,
                ...cleanedBlockdit
            ];
            // console.log(this.targetLists);

        },
        confirmSave() {
            this.collectAllTargets();
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
                    this.apiAddTargets();
                    // Swal.fire('บันทึกแล้ว!', 'ข้อมูลของคุณถูกบันทึกเรียบร้อย', 'success')
                } else {
                    Swal.fire('ยกเลิก', 'ยกเลิกการบันทึกข้อมูลเรียบร้อย', 'error')
                }
            })
        },
        async apiAddTargets() {
            // this.collectAllTargets();
            let rawData = {
                "data": this.targetLists
            }
            // console.log(this.targetLists);
            // console.log("raw === ", rawData);
            const config = {
                method: "post",
                url: "https://api2.cognizata.com/api/v2/monitor/targetandhashtag",
                data: rawData,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };
            // console.log(config);
            this.axios(config)
                .then((response) => {
                    // console.log(response);
                    let result = response.data || [];

                    // this.load = false;
                    this.clear();
                    this.hideModal();
                    this.$emit("close");
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
                    // this.load = false;
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
        showAlert(message) {
            alert(message);
        },
        simplifyFacebookURL(originalURL) {
            // Match the numeric ID in the URL
            const regex = /(\d{15,})/; // Adjust the number 15 if you expect different lengths of numeric IDs
            const match = originalURL.match(regex);

            if (match) {
                const userID = match[1];
                const newURL = `https://facebook.com/${userID}`;
                return newURL;
            } else {
                return originalURL;
            }
        },

        // handleFileUpload(event) {
        //     const file = event.target.files[0];
        //     if (!file) return;

        //     Papa.parse(file, {
        //         header: true,
        //         skipEmptyLines: true,
        //         dynamicTyping: true,

        //         complete: (result) => {
        //         // ✅ Trim ช่องว่างใน field name
        //         const headers = result.meta.fields.map(f => f.trim());
        //         const requiredFields = ["url"];
        //         const missingFields = requiredFields.filter(f => !headers.includes(f));
        //         if (missingFields.length > 0) {
        //             alert(`CSV ต้องมีฟิลด์: ${missingFields.join(", ")}`);
        //             return;
        //         }

        //         // ✅ กรองเฉพาะ URL ที่เกี่ยวข้อง และจัดการรูปแบบ
        //         const validRows = result.data
        //             .filter((row) => {
        //             const url = row.url;
        //             return (
        //                 typeof url === "string" &&
        //                 (
        //                 url.includes("tiktok") ||
        //                 url.includes("blockdit") ||
        //                 url.includes("facebook") ||
        //                 url.includes("twitter") ||
        //                 url.includes("pantip") ||
        //                 url.includes("instagram") ||
        //                 url.includes("youtube")
        //                 ) &&
        //                 !url.includes("vt.tiktok.com") &&
        //                 !url.includes("facebook.com/share/") &&
        //                 !url.includes("fb.watch") &&
        //                 !url.includes("m.facebook.com")
        //             );
        //             })
        //             .map((row) => {
        //             let url =  row.url;

        //             // ✅ ปรับรูปแบบ URL
        //             if (url.includes("facebook")) {
        //                 url = this.simplifyFacebookURL(url);
        //             }

        //             url = url
        //                 .replace("profile.php?id=", "")
        //                 .replace("profile.php/?id=", "")
        //                 .split("?")[0]
        //                 .split("/status/")[0]
        //                 .split("&")[0]
        //                 .replace("x.com", "twitter.com")
        //                 .replace("https://www.youtube.com", "https://youtube.com")
        //                 .replace("mobile.", "")
        //                 .replace("web.", "")
        //                 .replace("https://www.instagram.com", "https://instagram.com")
        //                 .replace("www.facebook.com", "facebook.com")
        //                 .split("/posts/")[0];

        //                 return {
        //                     key: 'account',
        //                     bot_level: 1,
        //                     name: row.targetname,
        //                     url:row.url,
        //                     sex: row.sex,
        //                     age: row.age,
        //                     province: row.province,
        //                     location: row.province
        //                     ? (this.provinces.find(p => p.text === row.province)?.value || null)
        //                     : null
        //                 };
        //             });

        //         // ✅ ลบ URL ที่ซ้ำกัน
        //         const uniqueByUrl = Object.values(
        //             validRows.reduce((acc, row) => {
        //             acc[row.url] = row;
        //             return acc;
        //             }, {})
        //         );

        //         // ✅ แยกแต่ละ platform + ใส่ editable: false
        //         const platforms = ["twitter", "facebook", "tiktok", "instagram", "youtube", "pantip", "blockdit"];
        //         platforms.forEach(platform => {
        //             this[platform] = uniqueByUrl
        //             .filter(r => r.url.includes(platform))
        //             .map(r => ({ ...r, editable: false, source: platform }));
        //         });

        //         console.log("✅ Twitter:", this.twitter);
        //         console.log("✅ Facebook:", this.facebook);
        //         console.log("✅ Blockdit:", this.blockdit);
        //         }
        //     });
        // },
        async handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            const fileName = file.name.toLowerCase();
            console.log("File name:", fileName);
            const processData = async (rawData) => {
                const headers = Object.keys(rawData[0]).map(f => f.trim());
                const requiredFields = ["url"];
                const missingFields = requiredFields.filter(f => !headers.includes(f));
                if (missingFields.length > 0) {
                    alert(`CSV/XLSX ต้องมีฟิลด์: ${missingFields.join(", ")}`);
                    return;
                }

                const validRows = await Promise.all(
                    rawData
                        .filter((row) => {
                            const url = row.url;
                            return (
                                typeof url === "string" &&
                                (
                                    url.includes("tiktok") ||
                                    url.includes("blockdit") ||
                                    url.includes("facebook") ||
                                    url.includes("twitter") ||
                                    url.includes("x.com") ||
                                    url.includes("pantip") ||
                                    url.includes("instagram") ||
                                    url.includes("youtube")
                                ) &&
                                !url.includes("vt.tiktok.com") &&
                                !url.includes("facebook.com/share/") &&
                                !url.includes("fb.watch") &&
                                !url.includes("m.facebook.com")
                            );
                        })
                        .map(async (row) => {
                            let url = row.url;

                            if (url.includes("facebook")) {
                                url = this.simplifyFacebookURL(url);
                            }

                            url = url
                                .replace("profile.php?id=", "")
                                .replace("profile.php/?id=", "")
                                .split("?")[0]
                                .split("/status/")[0]
                                .split("&")[0]
                                // .replace("x.com", "twitter.com")
                                .replace("https://www.youtube.com", "https://youtube.com")
                                .replace("mobile.", "")
                                .replace("web.", "")
                                .replace("https://www.instagram.com", "https://instagram.com")
                                .replace("www.facebook.com", "facebook.com")
                                .split("/posts/")[0];

                            const location = row.province ? await this.checkLocation(row) : null;
                            console.log("row ====", row.followers);
                            return {
                                key: 'account',
                                bot_level: 1,
                                name: row.targetname,
                                url: url,
                                sex: row.sex,
                                age: row.age ? row.age : null,
                                province: row.province,
                                country: row.country || null,
                                species: this.speciesTypes.find(s => s.text === row.species)?.value || null,
                                influencer_condition: row.influencer_condition,
                                influencer_type: this.influencerTypes.find(i => i.text === row.influencer_type)
                                    ? [this.influencerTypes.find(i => i.text === row.influencer_type)]
                                    : [],
                                department: this.departmentTypes.find(d => d.text === row.department)?.value || null,
                                district: row.district
                                    ? (row.district.replace(/^(อ\. |เขต |)/, '') || null)
                                    : null,
                                sub_district: row.sub_district
                                    ? (row.sub_district.replace(/^(ต\. |แขวง |)/, '') || null)
                                    : null,
                                location: location,
                                followers: row.followers ?? null,
                                following: row.following ?? null
                            };
                        })
                );

                const uniqueByUrl = Object.values(
                    validRows.reduce((acc, row) => {
                        acc[row.url] = row;
                        return acc;
                    }, {})
                );
                    console.log("uniqueByUrl === ", uniqueByUrl);
                    
                const platforms = ["twitter", "facebook", "tiktok", "instagram", "youtube", "pantip", "blockdit"];

                platforms.forEach(platform => {
                this[platform] = uniqueByUrl
                    .map(r => ({ ...r })) // clone ก่อน
                    .filter(r => this.getPlatformFromUrl(r.url) === platform)
                    .map(r => ({
                    ...r,
                    editable: false,
                    source: platform
                    }));
                });

                console.log("✅ Twitter:", this.twitter);
                console.log("✅ Facebook:", this.facebook);
                console.log("✅ Blockdit:", this.blockdit);
            };

            if (fileName.endsWith(".csv")) {
                Papa.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    dynamicTyping: true,
                    complete: async (result) => {
                        await processData(result.data);
                    }
                });
            } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const workbook = XLSX.read(e.target.result, { type: "binary" });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
                    await processData(jsonData);
                };
                reader.readAsBinaryString(file);
            } else {
                alert("รองรับเฉพาะไฟล์ .csv หรือ .xlsx เท่านั้น");
            }
        },
        hideModal() {
            this.open = false;
            this.clear();
            //this.$emit("close");
        },
        extractPageIdFromFacebookUrl(url) {
            const parts = url.split("/");
            const lastPart = parts[parts.length - 1];
            const id = lastPart.split("-").pop();
            return id;
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
        async apiGetCountry() {
            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/monitor/getCountry",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            this.axios(config)
                .then((response) => {
                    let result = response.data.data || [];
                    this.country = result;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        async apiGetDistrict(id) {
            try {
                const config = {
                    method: "get",
                    url: "https://api2.cognizata.com/api/v2/location/getAmphures",
                    params: { province_id: id },
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },
                };

                const response = await this.axios(config);
                const result = response.data.data || [];

                return result.map(district => ({
                    text: district.name_th,
                    value: district.id
                }));
            } catch (error) {
                console.error("apiGetDistrict error:", error);
                return [];
            }


        },
        async apiGetSubDistrict(id) {
            // this.load = true;
            try {
                const config = {
                    method: "get",
                    url: "https://api2.cognizata.com/api/v2/location/getTambons",
                    params: { amphure_id: id },
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },
                };

                const response = await this.axios(config);
                const result = response.data.data || [];

                return result.map(subDistrict => ({
                    text: subDistrict.name_th,
                    value: subDistrict.id
                }));
            } catch (error) {
                console.error("apiGetDistrict error:", error);
                return [];
            }

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
                    // console.log(response);
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
        }
    },
    async mounted() {
        await this.apiGetProvinces();
        await this.apiGetCountry();
        // await this.apiGetDistrict();
        // await this.apiGetSubDistrict();
        await this.apiGetInfluencerType();
    }
};
</script>
<style scoped>
.btn-import {
    background-color: #FFDEED;
    color: #504b3c;
    border-radius: 5px;
    padding: 5px 5px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    cursor: pointer;
    height: 38px;
    /* border: 1px #4c412b solid; */
}

.btn-import:hover {
    color: #ffffff;
    background-color: #4c412b;
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

.column-container {
    column-count: 2;
    line-break: anywhere;
}

.column-item {
    display: inline-block;
    width: 300px;
    /* ให้แต่ละรายการเต็มคอลัมน์ */
}

.modal-vue--content-panel.space-content {
    /* width: 100%; */
}

@media only screen and (min-width: 0px) and (max-width: 600px) {
    .column-container {
        column-count: 1;
        line-break: anywhere;
    }

    .btn-add {
        margin-top: 20px;
    }
}

.modal-body-scrollable {
    max-height: 60vh;
    /* กำหนดความสูงสูงสุด */
    overflow-y: auto;
    /* ให้ scroll เฉพาะแนวตั้ง */
    overflow-x: hidden;
    /* ❌ ปิดการ scroll แนวนอน */
    padding-right: 10px;

    box-sizing: border-box;
    /* เผื่อขนาด scrollbar */
}

/* สำหรับ Chrome, Safari, Edge */
.modal-body-scrollable::-webkit-scrollbar {
    width: 6px;
    /* << ขนาดความกว้างของ scrollbar แนวตั้ง */
}

.modal-body-scrollable {
    scrollbar-width: thin;
    /* ทำให้ scrollbar บางลง */
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
    /* สี scrollbar และ track */
}
</style>