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
                    <b-form-input v-model="filterRules.searchQuery" 
                    placeholder="ค้นหาด้วยชื่อบัญชี หรือ url ..."></b-form-input>
                </b-form-group>
                <div>
                    <label class="mb-2 d-block">เพศ</label>
                    <b-button-group class="w-100" style="gap: 5px;">
                        <b-button
                            :variant="isSelected( filterRules.genders,'male') ? 'info' : 'outline-info'"
                            @click="toggleGender('male')"
                        >
                            ชาย
                        </b-button>
        
                        <b-button
                            :variant="isSelected( filterRules.genders,'female') ? 'female' : 'outline-female'"
                            @click="toggleGender('female')"
                        >
                            หญิง
                        </b-button>
                        <b-button
                            :variant="isSelected( filterRules.genders,'lgbtq+') ? 'danger' : 'outline-danger'"
                            @click="toggleGender('lgbtq+')"
                        >
                            lgbtq+
                        </b-button>
        
                        <b-button
                            :variant="isSelected( filterRules.genders,'other') ? 'secondary' : 'outline-secondary'"
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
                            :variant="isSelected(filterRules.influencerLevel,'top_star') ? 'info' : 'outline-info'"
                            @click="toggleGender('top_star')"
                        >
                            Top Star
                        </b-button>
        
                        <b-button
                            style="font-size: 14px;"
                            class="px-1"
                            :variant="isSelected(filterRules.influencerLevel,'macro') ? 'info' : 'outline-info'"
                            @click="toggleGender('macro')"
                        >
                            Macro
                        </b-button>
                        <b-button
                            style="font-size: 14px;"
                            class="px-1"
                            :variant="isSelected(filterRules.influencerLevel,'micro') ? 'info' : 'outline-info'"
                            @click="toggleGender('micro')"
                        >
                            Micro
                        </b-button>
        
                        <b-button
                            style="font-size: 14px;"
                            class="px-1"
                            :variant="isSelected(filterRules.influencerLevel,'nano') ?'info' : 'outline-info'"
                            @click="toggleGender('nano')"
                        >
                            Nano
                        </b-button>
                        <b-button
                            style="font-size: 14px;"
                            class="px-1"
                            :variant="isSelected(filterRules.influencerLevel,'end_user') ?'info' : 'outline-info'"
                            @click="toggleGender('end_user')"
                        >
                            End User
                        </b-button>
                    </b-button-group>
                </div>
                <div>
                    <label for="followers" class="mt-2">ผู้ติดตาม</label>
                    <vue-slider
                        class="px-0"
                        v-model="filterRules.followers"
                        :min="0"
                        :max="10"
                        :interval="1"
                        :enable-cross="false"
                        :dot-size="18"
                        :height="6"
                        :contained="true"
                        :lazy="true"
                        :process-style="{ backgroundColor: '#17a2b8' }"
                        :dot-style="{ backgroundColor: '#17a2b8', border: 'none' }"
                    />
                </div>
                <div>
                    <label for="followers" class="mt-2">ช่วงอายุ</label>
                    <vue-slider
                        class="px-0"
                        v-model="filterRules.followers"
                        :min="0"
                        :max="10"
                        :interval="1"
                        :enable-cross="false"
                        :dot-size="18"
                        :height="6"
                        :contained="true"
                        :lazy="true"
                        :process-style="{ backgroundColor: '#17a2b8' }"
                        :dot-style="{ backgroundColor: '#17a2b8', border: 'none' }"
                    />
                </div>
                <b-form-group label="หมวดหมู่ Influencer">
                    <b-form-select v-model="filterRules.category" :options="categories"></b-form-select>
                </b-form-group>
                <b-form-group label="ประเภทธุรกิจ">
                    <b-form-select v-model="filterRules.department" :options="departmentTypes"></b-form-select>
                </b-form-group>
                <b-form-group label="ลักษณะบัญชี">
                    <b-form-select v-model="filterRules.species" :options="speciesTypes"></b-form-select>
                </b-form-group>
                <b-form-group label="จังหวัด">
                    <b-form-select v-model="filterRules.selectedBusinessType" :options="businessTypes"></b-form-select>
                </b-form-group>
                <b-form-group label="อำเภอ">
                    <b-form-select v-model="filterRules.selectedBusinessType" :options="businessTypes"></b-form-select>
                </b-form-group>
                <b-form-group label="ตำบล">
                    <b-form-select v-model="filterRules.selectedBusinessType" :options="businessTypes"></b-form-select>
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
                    <b-form-input v-model="filterRules.searchQuery" 
                    placeholder="ค้นหาด้วยชื่อบัญชี หรือ url ..."></b-form-input>
                </b-form-group>
                <div>
                    <label class="mb-2 d-block">เพศ</label>
                    <b-button-group class="w-100" style="gap: 5px;">
                        <b-button
                            :variant="isSelected( filterRules.genders,'male') ? 'info' : 'outline-info'"
                            @click="toggleGender('male')"
                        >
                            ชาย
                        </b-button>
        
                        <b-button
                            :variant="isSelected( filterRules.genders,'female') ? 'female' : 'outline-female'"
                            @click="toggleGender('female')"
                        >
                            หญิง
                        </b-button>
                        <b-button
                            :variant="isSelected( filterRules.genders,'lgbtq+') ? 'danger' : 'outline-danger'"
                            @click="toggleGender('lgbtq+')"
                        >
                            lgbtq+
                        </b-button>
        
                        <b-button
                            :variant="isSelected( filterRules.genders,'other') ? 'secondary' : 'outline-secondary'"
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
                            :variant="isSelected(filterRules.influencerLevel,'top_star') ? 'info' : 'outline-info'"
                            @click="toggleGender('top_star')"
                        >
                            Top Star
                        </b-button>
        
                        <b-button
                            style="font-size: 14px;"
                            class="px-1"
                            :variant="isSelected(filterRules.influencerLevel,'macro') ? 'info' : 'outline-info'"
                            @click="toggleGender('macro')"
                        >
                            Macro
                        </b-button>
                        <b-button
                            style="font-size: 14px;"
                            class="px-1"
                            :variant="isSelected(filterRules.influencerLevel,'micro') ? 'info' : 'outline-info'"
                            @click="toggleGender('micro')"
                        >
                            Micro
                        </b-button>
        
                        <b-button
                            style="font-size: 14px;"
                            class="px-1"
                            :variant="isSelected(filterRules.influencerLevel,'nano') ?'info' : 'outline-info'"
                            @click="toggleGender('nano')"
                        >
                            Nano
                        </b-button>
                        <b-button
                            style="font-size: 14px;"
                            class="px-1"
                            :variant="isSelected(filterRules.influencerLevel,'end_user') ?'info' : 'outline-info'"
                            @click="toggleGender('end_user')"
                        >
                            End User
                        </b-button>
                    </b-button-group>
                </div>
                <div>
                    <label for="followers" class="mt-2">ผู้ติดตาม</label>
                    <vue-slider
                        class="px-0"
                        v-model="filterRules.followers"
                        :min="0"
                        :max="10"
                        :interval="1"
                        :enable-cross="false"
                        :dot-size="18"
                        :height="6"
                        :contained="true"
                        :lazy="true"
                        :process-style="{ backgroundColor: '#17a2b8' }"
                        :dot-style="{ backgroundColor: '#17a2b8', border: 'none' }"
                    />
                </div>
                <div>
                    <label for="followers" class="mt-2">ช่วงอายุ</label>
                    <vue-slider
                        class="px-0"
                        v-model="filterRules.followers"
                        :min="0"
                        :max="10"
                        :interval="1"
                        :enable-cross="false"
                        :dot-size="18"
                        :height="6"
                        :contained="true"
                        :lazy="true"
                        :process-style="{ backgroundColor: '#17a2b8' }"
                        :dot-style="{ backgroundColor: '#17a2b8', border: 'none' }"
                    />
                </div>
                <b-form-group label="หมวดหมู่ Influencer">
                    <b-form-select v-model="filterRules.category" :options="categories"></b-form-select>
                </b-form-group>
                <b-form-group label="ประเภทธุรกิจ">
                    <b-form-select v-model="filterRules.department" :options="departmentTypes"></b-form-select>
                </b-form-group>
                <b-form-group label="ลักษณะบัญชี">
                    <b-form-select v-model="filterRules.species" :options="speciesTypes"></b-form-select>
                </b-form-group>
                <b-form-group label="จังหวัด">
                    <b-form-select v-model="filterRules.selectedBusinessType" :options="businessTypes"></b-form-select>
                </b-form-group>
                <b-form-group label="อำเภอ">
                    <b-form-select v-model="filterRules.selectedBusinessType" :options="businessTypes"></b-form-select>
                </b-form-group>
                <b-form-group label="ตำบล">
                    <b-form-select v-model="filterRules.selectedBusinessType" :options="businessTypes"></b-form-select>
                </b-form-group>
                <div class="d-flex w-100 justify-content-between mt-2" style="gap: 10px;">
                    <b-button class="col" size="sm" variant="info" @click="applyFilters">Apply</b-button>
                    <b-button class="col" size="sm" variant="warning" style="background-color: #fdd071;" @click="resetFilters">Reset</b-button>
                </div>
            </b-form>
        </div>
    </div>
</template>
<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
export default {
    components: {
        VueSlider
    },
    props: {
        showHeader: {
            type: Boolean,
            default:true
        }
    },
    data() {
        return {
            businessTypes: [],
            filterRules: {
                source:null,
                searchQuery: "",
                category: null,
                department: null,
                species: null,
                followers: [3, 5],
                influencerLevel:[],
                genders: [],
                location: null
            },
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
        };
    },
    methods: {
        toggleGender(gender) {
            const index = this.filterRules.genders.indexOf(gender)
            if (index === -1) {
                this.filterRules.genders.push(gender) // ยังไม่เลือก → เพิ่ม
            } else {
                this.filterRules.genders.splice(index, 1) // เลือกอยู่ → เอาออก
            }
        },
        isSelected(data,gender) {
            return data.includes(gender)
            // return this.filterRules.genders.includes(gender)
        },
        toggleInfluLevel(level) {
            const index = this.filterRules.influencerLevel.indexOf(level)
            if (index === -1) {
                this.filterRules.influencerLevel.push(level) // ยังไม่เลือก → เพิ่ม
            } else {
                this.filterRules.influencerLevel.splice(index, 1) // เลือกอยู่ → เอาออก
            }
        },
        // isSelected(gender) {
        //     return this.filterRules.genders.includes(gender)
        // },
        applyFilters() {
            // Emit the filter criteria to the parent component
            this.$emit("filter-applied", {
                search: this.searchQuery,
                category: this.category,
            });
        },
        resetFilters() {
            // Reset the filter criteria
            this.searchQuery = "";
            this.category = null;
            // Emit the reset event to the parent component
            this.$emit("filter-applied", {
                search: "",
                category: null,
            });
        },
        // opanFilter() {
        //     this.$emit('openfilter')
        // }
    },
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