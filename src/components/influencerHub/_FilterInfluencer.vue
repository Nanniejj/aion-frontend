<template>
    <div class="row m-0">
        <div v-if="showHeader" class="col-12 d-flex justify-content-between p-0">
            <span class="text-left font-weight-bold" style="font-size: 18px;">Filters</span>
            <b-button v-b-toggle.sidebar-1 variant="light" 
            class="border-0 py-1 text-info" style="background: transparent;">
                <i class="fa fa-sliders"/>
            </b-button>
        </div>
        <div class="col-12 px-0">
            <b-form v-if="!showHeader" class="text-left px-0">
                <b-form-group label="Platform">
                    <div class="row m-0">
                        <div class="col-auto pl-0"> 
                            <img v-if="filterRules.source == 'twitter'" src="@/assets/Twitter.png" class="social-imgs" />
                            <img v-if="filterRules.source == 'facebook'" src="@/assets/Facebook.png" class="social-imgs" />
                            <img v-if="filterRules.source == 'pantip'" src="@/assets/board.png" class="social-imgs" />
                            <img v-if="filterRules.source == 'blockdit'" src="@/assets/Blockdit.png" class="social-imgs" />
                            <img v-if="filterRules.source == 'instagram'" src="@/assets/Instagram.png" class="social-imgs" />
                            <img v-if="filterRules.source == 'youtube'" src="@/assets/Youtube.png" class="social-imgs" />
                            <img v-if="filterRules.source == 'news'" src="@/assets/News.png" class="social-imgs" />
                            <img v-if="filterRules.source == 'tiktok'" src="@/assets/Tiktok.png" class="social-imgs" />
                            <img v-if="filterRules.source == 'threads'" src="@/assets/Threads.png" class="social-imgs" />
                            <b-avatar text="All" size="35" style="background-color: #fed16e;"
                                v-if="!filterRules.source"></b-avatar>
                        </div>
                        <div class="col px-0">
                            <b-form-select v-model="filterRules.source" :options="sourceOptions"></b-form-select>
                        </div>
                    </div>
                </b-form-group>
                <b-form-group label="ค้นหา">
                    <b-form-input v-model="filterRules.search" 
                    placeholder="ค้นหาด้วยชื่อบัญชี หรือ url ..."></b-form-input>
                </b-form-group>
                <div>
                    <label class="mb-2 d-block">เพศ</label>
                    <b-button-group class="w-100" style="gap: 5px;">
                        <b-button
                            :variant="isSelected( filterRules.sex,'male') ? 'info' : 'outline-info'"
                            @click="toggleGender('male')"
                        >
                            ชาย
                        </b-button>
        
                        <b-button
                            :variant="isSelected( filterRules.sex,'female') ? 'female' : 'outline-female'"
                            @click="toggleGender('female')"
                        >
                            หญิง
                        </b-button>
                        <b-button
                            :variant="isSelected( filterRules.sex,'lgbtq+') ? 'danger' : 'outline-danger'"
                            @click="toggleGender('lgbtq+')"
                        >
                            lgbtq+
                        </b-button>
        
                        <b-button
                            :variant="isSelected( filterRules.sex,'other') ? 'secondary' : 'outline-secondary'"
                            @click="toggleGender('other')"
                        >
                            ไม่ระบุ
                        </b-button>
                    </b-button-group>
                </div>
                <div>
                    <label class="mt-2 d-block">ระดับ Influencer</label>
                    <b-button-group class="w-100" style="gap: 5px;">
                        <b-button
                            style="font-size: 14px;"
                            class="px-1"
                            :variant="influencerLevel === 'top star' ? 'info' : 'outline-info'"
                            @click="toggleInfluencerLevel('top star')"
                        >
                            Top Star
                        </b-button>
        
                        <b-button
                            style="font-size: 14px;"
                            class="px-1"
                            :variant="influencerLevel === 'macro' ? 'info' : 'outline-info'"
                             @click="toggleInfluencerLevel('macro')"
                        >
                            Macro
                        </b-button>
                        <b-button
                            style="font-size: 14px;"
                            class="px-1"
                            :variant="influencerLevel === 'micro' ? 'info' : 'outline-info'"
                            @click="toggleInfluencerLevel('micro')"
                        >
                            Micro
                        </b-button>
        
                        <b-button
                            style="font-size: 14px;"
                            class="px-1"
                            :variant="influencerLevel === 'nano' ?'info' : 'outline-info'"
                            @click="toggleInfluencerLevel('nano')"
                        >
                            Nano
                        </b-button>
                        <b-button
                            style="font-size: 14px;"
                            class="px-1"
                            :variant="influencerLevel === 'end user' ?'info' : 'outline-info'"
                            @click="toggleInfluencerLevel('end user')"
                        >
                            End User
                        </b-button>
                    </b-button-group>
                    <b-row class="m-0">
                        <b-col v-if="influencerLevel && influencerLevel === 'top star' " class="px-0 py-3 text-info">
                            ผู้ติดตามมากกว่า {{ followers[0] | numFormat  }} คน
                            <i @click="resetFollowers" style="cursor: pointer;" class="fa fa-close text-danger cursor-pointer"></i>
                        </b-col>
                        <b-col v-if="influencerLevel && influencerLevel !== 'top star' " class="px-0 py-3 text-info">
                            ผู้ติดตาม {{ followers[0] | numFormat  }} - {{ followers[1] | numFormat }} คน
                            <i @click="resetFollowers" style="cursor: pointer;" class="fa fa-close text-danger cursor-pointer"></i>
                        </b-col>
                    </b-row>
                </div>
                <div>
                    <label for="followers" class="mt-2">ผู้ติดตาม</label>
                    <vue-slider
                        class="px-0"
                        v-model="followers"
                        :min="100"
                        :max="999999999"
                        :interval="1"
                        :enable-cross="false"
                        :dot-size="18"
                        :height="6"
                        :contained="true"
                        :lazy="true"
                        :process-style="{ backgroundColor: '#17a2b8' }"
                        :dot-style="{ backgroundColor: '#17a2b8', border: 'none' }"
                    />
                    <b-form-checkbox
                        class="my-2"
                        v-model="resetFollower"
                        @change="onResetFollowers"
                        >
                        ไม่จำกัดช่วงผู้ติดตาม
                    </b-form-checkbox>
                </div>
                <div>
                    <label for="followers" class="mt-2">ช่วงอายุ</label>
                    <vue-slider
                        class="px-0"
                        v-model="filterRules.age"
                        :min="0"
                        :max="100"
                        :interval="1"
                        :enable-cross="false"
                        :dot-size="18"
                        :height="6"
                        :contained="true"
                        :lazy="true"
                        :process-style="{ backgroundColor: '#17a2b8' }"
                        :dot-style="{ backgroundColor: '#17a2b8', border: 'none' }"
                    />
                    <b-form-checkbox
                        class="my-2"
                        v-model="resetAge"
                        @change="onResetAge"
                        >
                        ไม่จำกัดช่วงอายุ
                    </b-form-checkbox>
                </div>
                <b-form-group label="หมวดหมู่ Influencer">
                    <!-- <b-form-select v-model="filterRules.category" :options="categories"></b-form-select> -->
                    <Multiselect
                        v-model="selectedTypes"
                        :options="influencerTypes"
                        :multiple="true"
                        :taggable="true"
                        label="text"
                        track-by="value"
                        placeholder="เลือกหมวดหมู่"
                        @input="updateInfluencerType"
                    />
                </b-form-group>
                <b-form-group label="ประเภทธุรกิจ">
                    <b-form-select v-model="filterRules.department" :options="departmentTypes"></b-form-select>
                </b-form-group>
                <b-form-group label="ลักษณะบัญชี">
                    <b-form-select v-model="filterRules.species" :options="speciesTypes"></b-form-select>
                </b-form-group>
                <b-form-group label="จังหวัด">
                    <b-form-select 
                        placeholder="เลือกจังหวัด"
                        class="input"
                        v-model="selectedProvince" 
                        :options="[{ value: null, text: 'เลือกจังหวัด',disabled: true  }, ...provinces]"
                        @change="apiGetDistrict(selectedProvince)"
                    ></b-form-select>
                </b-form-group>
                <b-form-group label="อำเภอ">
                    <b-form-select 
                    v-model="selectedDistrict"
                    :disabled="!selectedProvince" 
                    :options="[{ value: null, text: 'เลือกอำเภอ',disabled: true  }, ...districts]"
                    @change="apiGetSubDistrict(selectedDistrict)"
                    ></b-form-select>
                </b-form-group>
                <b-form-group label="ตำบล">
                    <b-form-select 
                    v-model="selectedSubdistrict"
                    :disabled="!selectedDistrict"  
                    :options="[{ value: null, text: 'เลือกตำบล',disabled: true  }, ...subDistricts]"
                ></b-form-select>
                </b-form-group>
                <div class="d-flex w-100 justify-content-between mt-2" style="gap: 10px;">
                    <b-button class="col" size="sm" variant="info" @click="applyFilters">Apply</b-button>
                    <b-button class="col" size="sm" variant="warning" style="background-color: #fdd071;" @click="resetFilters">Reset</b-button>
                </div>
            </b-form>
            <b-form v-else class="text-left px-0 d-none d-lg-block">
                <b-form-group label="Platform">
                    <div class="row m-0">
                        <div class="col-auto pl-0"> 
                            <img v-if="filterRules.source == 'twitter'" src="@/assets/Twitter.png" class="social-imgs" />
                            <img v-if="filterRules.source == 'facebook'" src="@/assets/Facebook.png" class="social-imgs" />
                            <img v-if="filterRules.source == 'pantip'" src="@/assets/board.png" class="social-imgs" />
                            <img v-if="filterRules.source == 'blockdit'" src="@/assets/Blockdit.png" class="social-imgs" />
                            <img v-if="filterRules.source == 'instagram'" src="@/assets/Instagram.png" class="social-imgs" />
                            <img v-if="filterRules.source == 'youtube'" src="@/assets/Youtube.png" class="social-imgs" />
                            <img v-if="filterRules.source == 'news'" src="@/assets/News.png" class="social-imgs" />
                            <img v-if="filterRules.source == 'tiktok'" src="@/assets/Tiktok.png" class="social-imgs" />
                            <img v-if="filterRules.source == 'threads'" src="@/assets/Threads.png" class="social-imgs" />
                            <b-avatar text="All" size="35" style="background-color: #fed16e;"
                                v-if="!filterRules.source"></b-avatar>
                        </div>
                        <div class="col px-0">
                            <b-form-select v-model="filterRules.source" :options="sourceOptions"></b-form-select>
                        </div>
                    </div>
                </b-form-group>
                <b-form-group label="ค้นหา">
                    <b-form-input v-model="filterRules.search" 
                    placeholder="ค้นหาด้วยชื่อบัญชี หรือ url ..."></b-form-input>
                </b-form-group>
                <div>
                    <label class="mb-2 d-block">เพศ</label>
                    <b-button-group class="w-100" style="gap: 5px;">
                        <b-button
                            :variant="isSelected( filterRules.sex,'male') ? 'info' : 'outline-info'"
                            @click="toggleGender('male')"
                        >
                            ชาย
                        </b-button>
        
                        <b-button
                            :variant="isSelected( filterRules.sex,'female') ? 'female' : 'outline-female'"
                            @click="toggleGender('female')"
                        >
                            หญิง
                        </b-button>
                        <b-button
                            :variant="isSelected( filterRules.sex,'lgbtq+') ? 'danger' : 'outline-danger'"
                            @click="toggleGender('lgbtq+')"
                        >
                            lgbtq+
                        </b-button>
        
                        <b-button
                            :variant="isSelected( filterRules.sex,'other') ? 'secondary' : 'outline-secondary'"
                            @click="toggleGender('other')"
                        >
                            ไม่ระบุ
                        </b-button>
                    </b-button-group>
                </div>
                <div>
                    <label class="mt-2 d-block">ระดับ Influencer</label>
                    <b-button-group class="w-100" style="gap: 5px;">
                        <b-button
                            style="font-size: 14px;"
                            class="px-1"
                            :variant="influencerLevel === 'top star' ? 'info' : 'outline-info'"
                            @click="toggleInfluencerLevel('top star')"
                        >
                            Top Star
                        </b-button>
        
                        <b-button
                            style="font-size: 14px;"
                            class="px-1"
                            :variant="influencerLevel === 'macro' ? 'info' : 'outline-info'"
                             @click="toggleInfluencerLevel('macro')"
                        >
                            Macro
                        </b-button>
                        <b-button
                            style="font-size: 14px;"
                            class="px-1"
                            :variant="influencerLevel === 'micro' ? 'info' : 'outline-info'"
                            @click="toggleInfluencerLevel('micro')"
                        >
                            Micro
                        </b-button>
        
                        <b-button
                            style="font-size: 14px;"
                            class="px-1"
                            :variant="influencerLevel === 'nano' ?'info' : 'outline-info'"
                            @click="toggleInfluencerLevel('nano')"
                        >
                            Nano
                        </b-button>
                        <b-button
                            style="font-size: 14px;"
                            class="px-1"
                            :variant="influencerLevel === 'end user' ?'info' : 'outline-info'"
                            @click="toggleInfluencerLevel('end user')"
                        >
                            End User
                        </b-button>
                    </b-button-group>
                    <b-row class="m-0">
                        <b-col v-if="influencerLevel && influencerLevel === 'top star' " class="px-0 py-3 text-info">
                            ผู้ติดตามมากกว่า {{ followers[0] | numFormat  }} คน
                            <i @click="resetFollowers" style="cursor: pointer;" class="fa fa-close text-danger cursor-pointer"></i>
                        </b-col>
                        <b-col v-if="influencerLevel && influencerLevel !== 'top star' " class="px-0 py-3 text-info">
                            ผู้ติดตาม {{ followers[0] | numFormat  }} - {{ followers[1] | numFormat }} คน
                            <i @click="resetFollowers" style="cursor: pointer;" class="fa fa-close text-danger cursor-pointer"></i>
                        </b-col>
                    </b-row>
                </div>
                <div>
                    <label for="followers" class="mt-2">ผู้ติดตาม</label>
                    <vue-slider
                        class="px-0"
                        v-model="followers"
                        :min="100"
                        :max="999999999"
                        :interval="1"
                        :enable-cross="false"
                        :dot-size="18"
                        :height="6"
                        :contained="true"
                        :lazy="true"
                        :process-style="{ backgroundColor: '#17a2b8' }"
                        :dot-style="{ backgroundColor: '#17a2b8', border: 'none' }"
                    />
                    <b-form-checkbox
                        class="my-2"
                        v-model="resetFollower"
                        @change="onResetFollowers"
                        >
                        ไม่จำกัดช่วงผู้ติดตาม
                    </b-form-checkbox>
                </div>
                <div>
                    <label for="followers" class="mt-2">ช่วงอายุ</label>
                    <vue-slider
                        class="px-0"
                        v-model="filterRules.age"
                        :min="0"
                        :max="100"
                        :interval="1"
                        :enable-cross="false"
                        :dot-size="18"
                        :height="6"
                        :contained="true"
                        :lazy="true"
                        :process-style="{ backgroundColor: '#17a2b8' }"
                        :dot-style="{ backgroundColor: '#17a2b8', border: 'none' }"
                    />
                    <b-form-checkbox
                        class="my-2"
                        v-model="resetAge"
                        @change="onResetAge"
                        >
                        ไม่จำกัดช่วงอายุ
                    </b-form-checkbox>
                </div>
                <b-form-group label="หมวดหมู่ Influencer">
                    <Multiselect
                        v-model="selectedTypes"
                        :options="influencerTypes"
                        :multiple="true"
                        :taggable="true"
                        label="text"
                        track-by="value"
                        placeholder="เลือกหมวดหมู่"
                       @input="updateInfluencerType"
                    />
                    <!-- <b-form-select v-model="filterRules.category" :options="categories"></b-form-select> -->
                </b-form-group>
                <b-form-group label="ประเภทธุรกิจ">
                    <b-form-select v-model="filterRules.department" :options="departmentTypes"></b-form-select>
                </b-form-group>
                <b-form-group label="ลักษณะบัญชี">
                    <b-form-select v-model="filterRules.species" :options="speciesTypes"></b-form-select>
                </b-form-group>
                <b-form-group label="จังหวัด">
                    <b-form-select 
                        placeholder="เลือกจังหวัด"
                        class="input"
                        v-model="selectedProvince" 
                        :options="[{ value: null, text: 'เลือกจังหวัด',disabled: true  }, ...provinces]"
                        @change="apiGetDistrict(selectedProvince)"
                    ></b-form-select>
                </b-form-group>
                <b-form-group label="อำเภอ">
                    <b-form-select 
                        v-model="selectedDistrict" 
                        :disabled="!selectedProvince" 
                        :options="[{ value: null, text: 'เลือกอำเภอ',disabled: true  }, ...districts]"
                        @change="apiGetSubDistrict(selectedDistrict)"
                        ></b-form-select>
                    </b-form-group>
                <b-form-group label="ตำบล">
                    <b-form-select 
                        v-model="selectedSubdistrict" 
                        :disabled="!selectedDistrict" 
                        :options="[{ value: null, text: 'เลือกตำบล',disabled: true  }, ...subDistricts]"
                    ></b-form-select>
                </b-form-group>
                <div class="d-flex w-100 justify-content-between mt-2" style="gap: 10px;">
                    <b-button class="col" size="sm" variant="info" @click="applyFilters">Apply</b-button>
                    <b-button class="col" size="sm" variant="warning" style="background-color: #fdd071;" @click="resetFilters">Reset</b-button>
                </div>
            </b-form>
            <!-- {{ filterRules }} -->
        </div>
    </div>
</template>
<script>
import VueSlider from 'vue-slider-component'
import Multiselect from 'vue-multiselect'
import 'vue-slider-component/theme/default.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'
export default {
    components: {
        VueSlider,
        Multiselect
    },
    props: {
        showHeader: {
            type: Boolean,
            default:true
        }
    },
    data() {
        return {
            resetAge: true,
            resetFollower: true,
            businessTypes: [],
            selectedTypes:null,
            selectedProvince:null,
            selectedDistrict:null,
            selectedSubdistrict: null,
            followers: [],
            filterRules: {
                source:null,
                search: "",
                // category: null,
                department: null,
                species: null,
                age: [],
                followers: [],
                sex: [],
                location: [],
                influencer_type:[]
            },
            influencerLevel: '',
            departmentTypes:[
                { text: "เลือกประเภทธุรกิจ", value: null },
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
                { text: "สังคม / องค์กรไม่แสวงกำไร", value: "nonprofit" }
            ],
            categories: [
                { value: null, text: "All Categories" },
                { value: "category1", text: "Category 1" },
                { value: "category2", text: "Category 2" },
                { value: "category3", text: "Category 3" },
            ],
            speciesTypes: [
                { value: null, text: "เลือกลักษณะบัญชี" },
                { text: 'บุคคลทั่วไป', value: 'people' },
                { text: 'ดารา / นักแสดง / ศิลปิน', value: 'actor' },
                { text: 'ผู้เชี่ยวชาญ', value: 'expert' },
                { text: 'นักการเมือง/ พรรคการเมือง', value: 'political' },
                { text: 'สัตว์เลี้ยง', value: 'pet' },
                { text: 'แบรนด์ / ร้านค้า', value: 'brand' },
                { text: 'องค์กร / บริษัท', value: 'company' },
                { text: 'บัญชีอัตโนมัติ / บอท / AI', value: 'bot' },
                { text: 'ตัวละครในจินตนาการ / การ์ตูน/หนัง',value: 'fictional' },
                { text: 'เด็ก / ทารก', value: 'kid' },
                { text: 'คู่รัก / ครอบครัว', value: 'family' },
                { text: 'สัตว์ธรรมชาติ / สัตว์ป่า', value: 'wild_animal' },
                { text: 'ไม่ระบุ', value: 'none' }
            ],
            sourceOptions: [
                { value: null, text: 'All Platform' },
                { value: 'facebook', text: 'Facebook' },
                { value: 'twitter', text: 'X' },
                { value: 'pantip', text: 'Board' },
                { value: 'news', text: 'News' },
                { value: 'youtube', text: 'YouTube' },
                { value: 'instagram', text: 'Instagram' },
                { value: 'blockdit', text: 'Blockdit' },
                { value: 'tiktok', text: 'Tiktok' },
                { value: 'threads', text: 'Threads' }
            ],
            provinces: [],
            districts: [],
            subDistricts: [],
            influencerTypes:[]
        };
    },
    computed: {
        location: {
            get() {
            if (!this.selectedProvince && !this.selectedDistrict && !this.selectedSubdistrict) {
                return [];
            }
            return [
                this.selectedProvince,
                this.selectedDistrict,
                this.selectedSubdistrict
            ].filter(v => v != null);
            },
            set(newVal) {
            this.filterRules.location = newVal;
            }
        }
    },
    methods: {
        onResetAge() {
            if (this.resetAge) {
                // ถ้า checkbox ถูกติ๊ก → รีเซ็ตเป็น array ว่าง
                this.filterRules.age = [];
            } else {
                this.filterRules.age = [0,100];
            }
        },
        onResetFollowers() {
            if (this.resetFollower) {
                // ถ้า checkbox ถูกติ๊ก → รีเซ็ตเป็น array ว่าง
                this.followers = [];
                this.filterRules.followers = [];
                this.influencerLevel = null;
            } else {
                this.followers = [0, 900000000];
                this.influencerLevel = null;
            }
        },
        resetFollowers() {
            this.influencerLevel = null;
            this.filterRules.followers = [];
            this.applyFilters();
        },
        toggleInfluencerLevel(level) {
             if (this.influencerLevel === level) {
                // คลิกซ้ำ → รีเซ็ต
                this.influencerLevel = null;
                this.filterRules.followers = null;
            } else {
                // เลือกตัวใหม่
                this.influencerLevel = level;
                this.filterRules.followers = level;
                this.setFollowersByLevel(level);
                // this.resetFollower = false;
            }
            console.log("filter rules === ", this.filterRules);
        },
        setFollowersByLevel(level) {
            switch (level) {
                case 'top star':
                    this.followers = [100000] // มากกว่า 1 ล้าน
                    // this.followers = [1000001, Infinity] // มากกว่า 1 ล้าน
                    break
                case 'macro':
                    this.followers = [100001, 1000000] // 1 แสน ถึง 1 ล้าน
                    break
                case 'micro':
                    this.followers = [10001, 100000] // 1 หมื่น ถึง 1 แสน
                    break
                case 'nano':
                    this.followers = [1001, 10000] // 1 พัน ถึง 1 หมื่น
                    break
                case 'end user':
                    this.followers = [101, 1000] // 100 ถึง 1 พัน
                    break
                default:
                this.followers = [] // เคลียร์ถ้าไม่ได้เลือก
                break
            }
            console.log("filter ==== ", this.filterRules);
            
        },
        updateInfluencerType(selected) {
            // แปลง array ของ object → array ของ value
            this.filterRules.influencer_type = selected.map(item => item.value);
        },
        updateFilterLocation() {
            this.location = this.location; // trigger setter → อัปเดต filterRules.location
        },
        async apiGetProvinces() {
            this.load = true;
            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/location/getProvinces",
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
        async apiGetDistrict(id) {
            this.selectedDistrict = null;
            this.selectedSubdistrict = null;
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

                this.districts =  result.map(district => ({
                    text: district.name_th,
                    value: district.id
                }));
                console.log(this.districts);
                
            } catch (error) {
                console.error("apiGetDistrict error:", error);
                this.districts =  [];
            }
        },
        async apiGetSubDistrict(id) {
            this.selectedSubdistrict = null;
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

                this.subDistricts = result.map(subDistrict => ({
                    text: subDistrict.name_th,
                    value: subDistrict.id
                }));

                console.log(this.subDistricts);
                
            } catch (error) {
                console.error("apiGetDistrict error:", error);
                this.subDistricts = [];
            }
            
        },
        async apiGetInfluencerType() {
            // this.load = true;
            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/monitor/getInfluencerType",
                
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            this.axios(config)
            .then((response) => {
                // console.log(response);
                let result = response.data || [];
                this.icon = result;
                this.influencerTypes = result.map(type => ({
                    value: type.id,
                    text: type.name
                }));
                
                console.log(this.icon);
                
                console.log('this.influencerTypes ===== ', this.influencerTypes);
                
            })
            .catch((error) => {
                this.load = false;
                console.error(error);
            });
        },
        toggleGender(gender) {
            const index = this.filterRules.sex.indexOf(gender)
            if (index === -1) {
                this.filterRules.sex.push(gender) // ยังไม่เลือก → เพิ่ม
            } else {
                this.filterRules.sex.splice(index, 1) // เลือกอยู่ → เอาออก
            }
        },
        isSelected(data,gender) {
            return data.includes(gender)
        },
        handleFilter() {
            if (this.followers && this.followers.length > 0) {
                this.filterRules.followers = this.followers;
            } else {
                this.filterRules.followers = [];
            }
        },
        applyFilters() {
            this.handleFilter();
            // Emit the filter criteria to the parent component
            this.$emit("filter-applied", this.filterRules);
        },
        resetFilters() {
            // Reset the filter criteria
            this.selectedTypes = null;
            this.selectedProvince = null;
            this.selectedDistrict = null;
            this.selectedSubdistrict = null;
            this.resetAge = true;
            this.filterRules = {
                source: null,
                search: "",
                // category: null,
                department: null,
                species: null,
                age: [],
                followers: [],
                influencerLevel: null,
                sex: [],
                location: [],
                influencer_type: []
            };
            // Emit the reset event to the parent component
            this.$emit("filter-applied",  this.filterRules);
        },
    },
    watch: {
        // ทุกครั้งที่ตัวเลือกเปลี่ยน ให้ location (computed) อัปเดต filterRules.location
        selectedProvince: 'updateFilterLocation',
        selectedDistrict: 'updateFilterLocation',
        selectedSubdistrict: 'updateFilterLocation'
    },
    async mounted() {
        await this.apiGetInfluencerType();
        await this.apiGetProvinces();
    }
};
</script>
<style scoped>
.form-group {
    margin-bottom: 5px !important;
}
.social-imgs {
    width: 35px;
}
.btn-female {
    color: #212529;
    background-color: rgb(248, 197, 197);
    border-color: rgb(248, 197, 197);
}
.btn-outline-female {
    color: rgb(179, 139, 139);
    border-color: rgb(179, 139, 139);
}

</style>