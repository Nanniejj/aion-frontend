<template>
    
    <b-card
        style=""
        class="bg-light custom-card-img "
        tag="article"
        :header-class="['p-0']"
        :body-class="['p-0']"
        img-alt="Image"
        img-left
    >
        <!-- <template #header>
            <img
                style="width: 200px;"
                v-if="!editable"
                :src="checkImage()"
                alt="Image"
                class="img-top w-100 rounded"
            />
        </template> -->
        <!-- card body -->
        <b-row>
            <b-col v-if="!editable" cols="4" class="pr-0">
                <b-card-img :src="checkImage()" alt="Image" class="rounded-0"></b-card-img>
            </b-col>
            <b-col class="">
            <b-card-body class="py-0 px-2">
                <b-card-text>
                    <b-row v-if="editable" class="my-2 mx-0">
                        <b-col cols="12" class="pb-2">
                            <b-row class="d-flex justify-content-between p-0">
                                <b-col class="text-secondary d-flex p-0 align-items-center">
                                    <i class="fa fa-user mr-1"/>
                                    ชื่อบัญชี :
                                </b-col>
                                <div class="col-12 px-0" >
                                    <b-form-input
                                        size="sm"
                                        class="input"
                                        placeholder="ระบุชื่อบัญชี"
                                        v-model="selectedData.name"
                                        @input="exportData"
                                    />
                                </div>
                            </b-row>
                        </b-col>
                        <b-col cols="12" class="pb-2">
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
                                
                                <div class="col-12 px-0">
                                    <b-form-select
                                        size="sm"
                                        class="input"
                                        :options="[{ value: null, text: 'ลักษณะของบัญชี' }, ...speciesTypes]"
                                        v-model="selectedData.species"
                                        @change="exportData"
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
                                <div  class="col-12 px-0">
                                    <b-form-select
                                        size="sm"
                                        class="input"
                                        :options="influConditions"
                                        v-model="selectedData.influencer_condition"
                                        placeholder="เลือกเงื่อนไข Influencer"
                                        @change="exportData"
                                    />
                                </div>
                            </b-row>
                        </b-col>
            
                        <b-col v-if="selectedData.influencer_condition !== 'none'" cols="12" class="pb-2 mr-2">
                            <b-row class="p-0">
                                <b-col class="text-secondary d-flex p-0 align-items-center">
                                    <i class="fa fa-tag mr-1" />
                                    หมวดหมู่ Influencer :
                                </b-col>
                                <div class="col-12 px-0">
                                    <!-- <b-form-select
                                        size="sm"
                                        class="input"
                                        :options="[{ value: null, text: 'เลือกหมวดหมู่' }, ...influencerTypes]"
                                        v-model="selectedData.influencer_type"
                                        placeholder="เลือกหมวดหมู่"
                                        @change="exportData"
                                    /> -->
                                    <Multiselect
                                        v-model="selectedData.influencer_type"
                                        :options="influencerTypes"
                                        :multiple="true"
                                        :taggable="true"
                                        label="text"
                                        track-by="value"
                                        placeholder="เลือกหมวดหมู่"
                                        @input="exportData"
                                    />
                                        <!-- :reduce="item => item.value"
                                        @input="addTag" -->
                                        <!-- @input="exportData" -->
                                </div>
                            </b-row>
                        </b-col>
            
                        <b-col cols="12" class="pb-2 mr-2">
                            <b-row class="p-0">
                                <b-col class="text-secondary d-flex p-0 align-items-center">
                                    <i class="fa fa-tag mr-1" />
                                    ประเภทธุรกิจ :
                                </b-col>
                                <div class="col-12 px-0">
                                    <b-form-select
                                        size="sm"
                                        class="input"
                                        :options="[{ value: null, text: 'เลือกหมวดหมู่' }, ...departmentTypes]"
                                        v-model="selectedData.department"
                                        placeholder="เลือกหมวดหมู่"
                                        @change="exportData"
                                    />
                                </div>
                            </b-row>
                        </b-col>
                       
                        <b-col cols="12" class="pb-2">
                            <b-row class="p-0 justify-content-between">
                                <b-col cols="9" class="text-secondary d-flex p-0 align-items-center ">
                                    <i class="fas fa-robot mr-1" />
                                    <span class="text-truncate d-inline-block">
                                        ระดับความถี่ในการเก็บข้อมูล 
                                        <i
                                            v-if="editable"
                                            class="fa fa-exclamation-circle mx-1 text-info"
                                            v-b-tooltip.hover
                                            title="ระดับ 1 = ความถี่ต่ำ,ระดับ 2 = ความถี่ปานกลาง,ระดับ 3 = ความถี่สูง"
                                            style="font-size: 14px; cursor: pointer;"
                                        ></i> :
                                    </span>
                                </b-col>
                                <div class="col-12 px-0">
                                    <b-form-select
                                        size="sm"
                                        class="input"
                                        :options="[1,2,3]"
                                        v-model="selectedData.bot_level"
                                        placeholder="เลือกระดับ"
                                        @change="exportData"
                                    />
                                </div>
                            </b-row>
                        </b-col>
            
                        <b-col cols="12" class="pb-2">
                            <b-row class="d-flex justify-content-between p-0">
                                <b-col class="text-secondary d-flex p-0 align-items-center">
                                    <i v-if="selectedData.sex === 'female'" class="fa fa-venus" />
                                    <i v-else-if="selectedData.sex === 'male'" class="fa fa-mars" />
                                    <i v-else class="fa fa-neuter mr-1" />
                                    เพศ :
                                </b-col>
                                <div class="col-12 px-0">
                                    <b-form-select
                                        size="sm"
                                        class="input"
                                        :options="genders"
                                        @change="exportData"
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
                                
                                <b-form-spinbutton
                                    v-model="selectedData.age" 
                                    min="1" max="100" 
                                    @change="exportData"
                                    @keypress="onlyNumber"
                                ></b-form-spinbutton>
                            </b-row>
                        </b-col>
            
                        <b-col cols="12" class="pb-2">
                            <b-row class="d-flex justify-content-between p-0">
                                <b-col class="text-secondary d-flex p-0 align-items-center">
                                    <i class="fa fa-map-marker mr-1"/>
                                    จังหวัด :
                                </b-col>
                                <div class="col-12 px-0">
                                    <b-form-select
                                        size="sm"
                                        class="input"
                                        :options="[{ value: null, text: 'เลือกจังหวัด',disabled: true  }, ...provinces]"
                                        placeholder="เลือกจังหวัด"
                                        v-model="selectedProvince"
                                        @change="getLocation"
                                    />
                                </div>
                            </b-row>
                        </b-col>
                        <b-col cols="12" class="pb-2">
                            <b-row class="d-flex justify-content-between p-0">
                                <b-col class="text-secondary d-flex p-0 align-items-center">
                                    <i class="fa fa-map-marker mr-1"/>
                                    อำเภอ :
                                </b-col>
                                <div class="col-12 px-0">
                                    <b-form-select
                                        size="sm"
                                        class="input"
                                        :options="[{ value: null, text: 'เลือกอำเภอ',disabled: true  }, ...districts]"
                                        placeholder="เลือกอำเภอ"
                                        v-model="selectedDistrict"
                                        @change="getLocation"
                                    />
                                </div>
                            </b-row>
                        </b-col>
                        <b-col cols="12" class="pb-2">
                            <b-row class="d-flex justify-content-between p-0">
                                <b-col class="text-secondary d-flex p-0 align-items-center">
                                    <i class="fa fa-map-marker mr-1"/>
                                    ตำบล :
                                </b-col>
                                <div class="col-12 px-0">
                                    <b-form-select
                                        size="sm"
                                        class="input"
                                        :options="[{ value: null, text: 'เลือกตำบล',disabled: true  }, ...subDistricts]"
                                        placeholder="เลือกตำบล"
                                        v-model="selectedSubDistrict"
                                        @change="getLocation"
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
                                
                                <b-form-input
                                    type="text"
                                    v-model="selectedData.follower"
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
                                <b-form-input
                                    type="text"
                                    v-model="selectedData.following"
                                    @keypress="onlyNumber"
                                    placeholder="กรอกจำนวน account ที่กำลังติดตาม (เฉพาะตัวเลข)"
                                />
                            </b-row>
                        </b-col>
                        <!-- location : {{ selectedData.location }} -->
                        <!-- <hr class="w-100" />
            
                        <b-col cols="12" class="pb-2">
                            <b-row class="d-flex justify-content-between p-0">
                                <b-col class="text-secondary d-flex p-0 align-items-center">
                                    <i class="fa fa-envelope mr-1"/>
                                    e-mail :
                                </b-col>
                                <b-col v-if="!editable" cols="auto font-weight-bold">
                                    <span v-if="selectedData.email">
                                        {{ selectedData.email }}
                                    </span>
                                    <span v-else> - </span>
                                </b-col>
                                <div v-else class="col-12 px-0" >
                                    <b-form-input
                                        size="sm"
                                        class="input"
                                        placeholder="Enter email"
                                        v-model="selectedData.email"
                                    />
                                </div>
                            </b-row>
                        </b-col> -->
                        <!-- <b-col cols="12" class="pb-2">
                            <b-row class="d-flex justify-content-between p-0">
                                <b-col class="text-secondary d-flex p-0 align-items-center">
                                    <i class="fa fa-phone mr-1"/>
                                    เบอร์โทร :
                                </b-col>
                                <b-col v-if="!editable" cols="auto font-weight-bold">
                                    <span v-if="selectedData.phone">
                                        {{ selectedData.phone }}
                                    </span>
                                    <span v-else> - </span>
                                </b-col>
                                <div v-else class="col-12 px-0" >
                                    <b-form-input
                                        size="sm"
                                        class="input"
                                        placeholder="Enter phone number"
                                        v-model="selectedData.phone"
                                    />
                                </div>
                            </b-row>
                        </b-col> -->
                    </b-row>
                    <b-row v-else class="mb-2 mx-0">
                        <b-col cols="12" class="pb-2">
                            <b-row class=" justify-content-between p-0">
                                <b-col class="d-flex flex-wrap align-items-center px-0 pt-1" style="font-size: 18px;">
                                   <b class="mr-2">
                                        {{ selectedData.name ? selectedData.name : 'ไม่ระบุชื่อบัญชี' }}
                                   </b>
                                   <div class="col-auto px-0 mt-2">
                                       <b-badge v-if="selectedData.species" variant="info" class="text-capitalize text-truncate" pill>{{ getSpeciesName(selectedData.species) }}</b-badge>
                                   </div>
                                </b-col>
                                <div class="col-auto px-0" style="">
                                    <span style="background-color: lightpink;" v-if="selectedData.sex === 'female'" class="sex-custom-card px-2 pt-0">
                                        หญิง
                                        <!-- <i  class="fa fa-venus" /> -->
                                    </span>
                                    <span style="background-color: lightblue;" v-else-if="selectedData.sex === 'male'" class="sex-custom-card px-2 pt-0">
                                        ชาย
                                        <!-- <i class="fa fa-mars"/> -->
                                    </span>
                                    <span v-else-if="selectedData.sex === 'lgbtq+'" class="sex-custom-card bg-pride px-2 pt-0">
                                        lgbtq+
                                        <!-- <i class="fa fa-mars"/> -->
                                    </span>
                                    <span v-else class="sex-custom-card px-1 pt-0 bg-secondary text-white">
                                        ไม่ระบุเพศ
                                        <!-- <i class="fa fa-neuter mr-1" /> -->
                                    </span>
                                </div>
                            </b-row>
                        </b-col>
                        <b-col cols="12" class="pb-0 px-0">
                            <!-- <b-row class="text-left text-truncate m-0 p-0 text-capitalize flex-wrap" style="font-size: 18px;"> -->
                                <span v-if="selectedData.department" class="text-left text-truncate m-0 p-0 text-capitalize flex-wrap" style="font-size: 18px;">
                                    {{ selectedData.department ? this.getDepartmentTypesName(selectedData.department) : 'ไม่ระบุประเภทธุรกิจ' }}
                                </span>
                                <div v-if="selectedData.influencer_type" class="col-auto px-0 mt-2">
                                    <b-badge v-for="item in selectedData.influencer_type" :key="item.value" 
                                    variant="warning" 
                                    style="background-color: #fed06ea4; color: #2c3e50;"
                                    class="text-capitalize text-truncate mr-2" pill>{{ item.text }}</b-badge>
                                </div>
                                   
                                <span v-else class="text-secondary">
                                    {{ selectedData.influencer_condition ? getInfluConditionName(selectedData.influencer_condition) : 'ไม่ระบุประเภท Influencer/ธุรกิจ' }}
                                </span>
                            <!-- </b-row> -->
                        </b-col>
                        <b-col cols="12" class="pb-2">
                            <b-row class="d-flex justify-content-between p-0">
                                <span class="text-14px text-secondary">
                                    {{ getInfluConditionName(selectedData.influencer_condition) }}
                                </span>
                            </b-row>
                        </b-col>
                        <hr class="col-12 p-0 mb-2 mt-0" />
                        <b-col cols="12" class="pb-2">
                            <b-row class="d-flex p-0">
                                <b-col cols="6" class="px-0 pr-4">
                                    <span class="font-weight-bold ">
                                        {{ selectedData.followers ? selectedData.followers : 'ไม่ระบุ' }}
                                    </span>
                                    <span class=" text-secondary text-14px">
                                        Followers
                                    </span>
                                </b-col> 
                                <b-col cols="6" class="px-0">
                                    <span class="font-weight-bold ">
                                        {{ selectedData.following ? selectedData.following : 'ไม่ระบุ' }}
                                    </span>
                                    <span class=" text-secondary text-14px">
                                        Following
                                    </span>
                                </b-col>
                            </b-row>
                        </b-col>
                        <div class="col-12 px-0">
                            <div class="d-flex text-truncate text-14px">
                                <i class="fas fa-map-marker-alt mr-2 text-info" />
                                <span class="text-secondary mr-1">{{ selectedData.province ? selectedData.province : 'ไม่ระบุ'}}</span>
                                <span v-if="selectedData.district" class="text-secondary mr-1">, {{ selectedData.district ? selectedData.district : '' }}</span>
                                <span v-if="selectedData.sub_district" class="text-secondary text-truncate d-inline-block">, {{ selectedData.sub_district ? selectedData.sub_district : '' }}</span>
                            </div>
                        </div>
                        <div class="col-12 px-0 pt-2">
                            <div class="d-flex flex-wrap" style="gap: 0.3rem;">
                                <b-badge v-if="selectedData.age" variant="light" class="text-capitalize text-truncate p-2">
                                   อายุ  {{ selectedData.age }} ปี
                                </b-badge>
                                <b-badge v-else variant="light" class="text-capitalize text-truncate p-2">
                                   ไม่ระบุอายุ
                                </b-badge>
                                <b-badge v-if="selectedData.bot_level" variant="light" class="text-capitalize text-truncate p-2">
                                    ระดับความถี่ในการเก็บข้อมูล{{ getBotLevel(selectedData.bot_level) }}
                                </b-badge>
                                <b-badge v-else variant="light" class="text-capitalize text-truncate p-2">
                                   ไม่ระบุระดับความถี่ในการเก็บข้อมูล
                                </b-badge>
                            </div>
                        </div>
                    </b-row>
                </b-card-text>
            </b-card-body>
            </b-col>
        </b-row>
        <!-- เพิ่ม footer ตรงนี้ -->
        <!-- <template #footer>
            <div v-if="!editable" class="d-flex justify-content-end">
                <b-button variant="info" @click="editProfile">
                    <i class="fa fa-edit mr-1"></i> แก้ไขข้อมูล
                </b-button>
            </div>
            <div v-else class="d-flex justify-content-between">
                <b-button variant="danger" @click="editProfile">
                    <i class="fa fa-times mr-1"></i> ยกเลิก
                </b-button>
                <b-button variant="success" @click="editProfile">
                    <i class="fa fa-save mr-1"></i> บันทึก
                </b-button>
            </div>
        </template> -->
    </b-card>
</template>
<script>
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
export default {
    components: {
        Multiselect
    },
    props:{
        editable:{
            type: Boolean,
            default: false
        },
        // source:{
        //     type: String,
        //     default:''
        // },
        targetInfo:{
            type:Object,
            default: () => ({})
        },
        provinces: {
            type: Array,
            default: () => ([])
        },
        influencerTypes: {
            type: Array,
            default: () => ([])
        },

    },
    data() {
        return {
            img:require('@/assets/1.png'),
            showImage: true,
            load: false,
            data: [],
            profile: null,
            category: 'domain',
            test : [],
            // editable: false,
            // selectedData: {  
            //     key: 'account',
            //     source:this.source,
            //     species:null, 
            //     sex: null,
            //     age: null, 
            //     influencer_type: null, 
            //     influencer_condition: null, 
            //     location: null, 
            //     province: null,
            //     bot_level: 1,
            //     name: null
            // },
            selectedData: {
                // key: 'account',
                // source: this.source,
                // bot_level: 1,
                // location: null,
                
                followers: null,
                following: null,
                department: null,
                species: null,
                profile_image: null,
                ...this.targetInfo
            },
            selectedProvince: null,
            selectedDistrict: null,
            selectedSubDistrict: null,
            oldProvince: null,
            oldDistrict: null,
            // provinces: [],
            districts: [],
            subDistricts: [],
            genders: [
                {text: 'เลือกเพศ', value:null,  disabled: true },
                {text: 'ไม่ระบุ', value:'other'},
                {text: 'ชาย', value:'male'},
                {text: 'หญิง', value:'female'},
                {text: 'LGBTQ+', value:'lgbtq+'},
            ],
            topDomain: [],
            topHashtags: [],
            posts:[],
            speciesTypes:[
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
            influConditions:[
                {text: 'เลือกระดับ Influencer', value: null,  disabled: true },
                {text: 'ผู้มีอิทธิพลจากยอดติดตาม', value:'follower'},
                {text: 'ผู้มีอิทธิพลจากโพส', value:'impact'},
                {text: 'คนทั่วไป', value:'none'},
                // {text: 'ผู้ติดตามมากกว่า 1 ล้านคน', value:'top_star'},
                // {text: 'ผู้ติดตามมากกว่า 1 แสน - 1 ล้านคน', value:'macro'},
                // {text: 'ผู้ติดตามมากกว่า 1 หมื่น - 1 แสนคน', value:'micro'},
                // {text: 'ผู้ติดตามมากกว่า 1 พัน - 1 หมื่นคน', value:'nano'},
                // {text: 'ผู้ติดตามมากกว่า 100 - 1 พันคน', value:'end_user'},
                // {text: 'อื่น ๆ', value:'post_engagement'},
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
        }
    },
    methods: {
        addTag (tag) {
            console.log("tag input:", tag);
            // const newId = Date.now()
            // const newItem = { value: newId, text: tag }
            // this.influencerTypes.push(newItem)
            // this.selectedData.influencer_type.push(newItem)
        },
        checkImage() {
            if (this.selectedData.profile_image) {
                // this.img = this.selectedData.profile_image;
                return this.selectedData.profile_image;
                // this.showImage = true;
            } else {
                return this.img;
                // this.img = 'https://pbs.twimg.com/profile_images/1322289162775457792/L4OM9vhp_normal.jpg';
                // this.showImage = false;
            }
        },
        onlyNumber(e) {
            const char = String.fromCharCode(e.keyCode);
            if (!/[0-9]/.test(char) && e.key !== 'Backspace') {
                e.preventDefault();
            }
        },
        // sanitizeNumber(setItem) {
        // // ป้องกัน paste หรือ drag/drop ตัวอักษร
        //     setItem = setItem.replace(/[^0-9]/g, '');
        // },
        async mapTargetInfoToSelectedData() {
            const location = this.selectedData.location;

            if (location) {
                const locationStr = location.toString(); // แปลงเลขเป็น string
                const len = locationStr.length;

                if (len === 2) {
                this.selectedProvince = locationStr.substring(0, 2);
                this.selectedDistrict = null;
                this.selectedSubDistrict = null;
                } else if (len === 4) {
                this.selectedProvince = locationStr.substring(0, 2);
                this.selectedDistrict = locationStr.substring(0, 4);
                this.selectedSubDistrict = null;
                } else if (len === 6) {
                this.selectedProvince = locationStr.substring(0, 2);
                this.selectedDistrict = locationStr.substring(0, 4);
                this.selectedSubDistrict = locationStr.substring(0, 6);
                } else {
                // รูปแบบไม่ถูกต้อง
                this.selectedProvince = null;
                this.selectedDistrict = null;
                this.selectedSubDistrict = null;
                }

                this.oldProvince = this.selectedProvince;
                this.oldDistrict = this.selectedDistrict;

                console.log(this.selectedProvince, '/', this.selectedDistrict, '/', this.selectedSubDistrict);

                if (this.selectedProvince) {
                this.districts = await this.apiGetDistrict(this.selectedProvince);
                }

                if (this.selectedDistrict) {
                this.subDistricts = await this.apiGetSubDistrict(this.selectedDistrict);
                }
            }
        },
        getSpeciesName(id) {
            return this.speciesTypes.find(item => item.value === id).text
        },
        getBotLevel(label) {
            switch (label) {
                case 1:
                    return 'ต่ำ';
                case 2:
                    return 'กลาง';
                case 3:
                    return 'สูง';
                default:
                    return 'ไม่ระบุระดับ';
            }

        },
        getInfluencerTypeName(id) {
            console.log(id);
            let text = this.influencerTypes.find(item => item.value === id).text;
            console.log(text);
            return text ? text : 'ไม่ระบุหมวดหมู่ Influencer';
        },
        getInfluConditionName(id) {
            const found = this.influConditions.find(item => item.value === id);
            return found ? found.text : 'ไม่ระบุเงื่อนไข Influencer';
        },
        getDepartmentTypesName(id) {
            const found = this.departmentTypes.find(item => item.value === id);
            return found ? found.text : 'ไม่ระบุประเภทธุรกิจ';
        },
        getLocationName() {
            let location_id = this.selectedData.location.toString().padStart(6, '0');
            let province_id = location_id.substring(0, 2);
            let district_id = location_id.substring(0, 4);  
            let subDistrict_id = location_id.substring(0, 6);
            this.selectedData.province =  this.provinces.find(item => item.value === province_id).text
            this.selectedData.district =  this.districts.find(item => item.value === district_id).text
            this.selectedData.sub_district =  this.subDistricts.find(item => item.value === subDistrict_id).text
            // this.exportData();
        },
        async getLocation() {
            // ตรวจสอบว่า province เปลี่ยนไหม
            if (this.selectedProvince !== this.oldProvince) {
                this.oldProvince = this.selectedProvince;
                this.districts = await this.apiGetDistrict(this.selectedProvince);
                
                // เคลียร์ district และ subDistrict เพราะ province เปลี่ยน
                this.selectedDistrict = null;
                this.selectedSubDistrict = null;
                this.subDistricts = [];

                this.updateLocation();
                return; // ไม่ต้องโหลดตำบลเพราะอำเภอยังไม่ถูกเลือก
            }

            // ตรวจสอบว่า district เปลี่ยนไหม
            if (this.selectedDistrict !== this.oldDistrict) {
                this.oldDistrict = this.selectedDistrict;
                this.subDistricts = await this.apiGetSubDistrict(this.selectedDistrict);
                
                // เคลียร์ subDistrict เพราะอำเภอเปลี่ยน
                this.selectedSubDistrict = null;
            }
            this.updateLocation();
            // this.exportData();
        },
        updateLocation() {
            if (this.selectedSubDistrict) {
                this.selectedData.location = this.selectedSubDistrict;
                this.selectedData.province =  this.provinces.find(item => item.value === this.selectedProvince).text
                this.selectedData.district =  this.districts.find(item => item.value === this.selectedDistrict).text
                this.selectedData.sub_district =  this.subDistricts.find(item => item.value === this.selectedSubDistrict).text
            } else if (this.selectedDistrict) {
                this.selectedData.location = this.selectedDistrict;
                this.selectedData.province =  this.provinces.find(item => item.value === this.selectedProvince).text
                this.selectedData.district =  this.districts.find(item => item.value === this.selectedDistrict).text
                this.selectedData.sub_district =  null; // ถ้าไม่มีตำบล
            } else if (this.selectedProvince) {
                this.selectedData.location = this.selectedProvince;
                this.selectedData.province =  this.provinces.find(item => item.value === this.selectedProvince).text
                this.selectedData.district =  null; // ถ้าไม่มีอำเภอ
                this.selectedData.sub_district =  null; // ถ้าไม่มีตำบล
            } else {
                this.selectedData.location = null; // ถ้าไม่มีอะไรเลย
                this.selectedData.province =  null; // ถ้าไม่มีจังหวัด
                this.selectedData.district =  null; // ถ้าไม่มีอำเภอ
                this.selectedData.sub_district =  null; // ถ้าไม่มีตำบล
            }
            console.log('selectedData.location', this.selectedData.location);
            // this.getLocationName();
            this.exportData();
        },
        getGenderTh(gender) {
            return this.genders.find(item => item.value === gender).text
        },
        editProfile() {
            this.editable = !this.editable;

            // console.log('editable ', this.editable);
        },
        exportData() {
            console.log("data : ", this.selectedData);
            if (this.selectedData.influencer_condition =='none') {
                this.selectedData.influencer_type = []
            }
            // this.mapTargetInfoToSelectedData();
            delete this.selectedData.editable;
            this.$emit('update:targetInfo', this.selectedData)
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
        async getPreview() {
            const url = this.selectedData.url;
            const fallbackImage = require('@/assets/1.png');
            const fallbackUserImage = require('@/assets/user.svg');
             
            // ตรวจว่าเป็นลิงก์ Facebook หรือไม่
            const isFacebook = url.includes('facebook.com');

            if (isFacebook) {
                // พยายามแยก page ID หรือ slug จาก URL
                try {
                    const parts = url.split('/');
                    let pageId = parts[parts.length - 1] || parts[parts.length - 2];
                    pageId = pageId.split('?')[0]; // ตัด query ออก

                    this.img = `https://graph.facebook.com/${pageId}/picture?type=large`;
                    console.log("Facebook image ==", this.img);
                    this.selectedData.profile_image = this.img;
                } catch (err) {
                    console.warn("ไม่สามารถแยก page ID จาก Facebook URL ได้", err);
                    this.img = fallbackImage;
                }
                // try {
                //     const parts = url.split('/');
                //     let pageId = parts[parts.length - 1] || parts[parts.length - 2];
                //     pageId = pageId.split('?')[0];

                //     // ตรวจสอบว่าเป็น Page จริงหรือไม่
                //     const checkUrl = `https://graph.facebook.com/${pageId}?fields=id,name,category`;
                //     const res = await fetch(checkUrl);
                //     const data = await res.json();

                //     if (data.category) {
                //         // ✅ เป็นเพจ → ใช้ภาพจาก Graph API
                //         this.img = `https://graph.facebook.com/${pageId}/picture?type=large`;
                //         console.log("✅ Facebook Page Image ==", this.img);
                //         this.selectedData.profile_image = this.img;
                //     } else {
                //         // ❌ ไม่ใช่เพจ
                //         console.warn("❌ ไม่ใช่เพจ หรือไม่มี category:", data);
                //         this.img = fallbackUserImage;
                //         this.selectedData.profile_image = null;
                //     }
                //     } catch (err) {
                //     console.warn("❌ ไม่สามารถตรวจสอบ Facebook Page ได้:", err);
                //     this.img = fallbackUserImage;
                //     this.selectedData.profile_image = null;
                // }
            } else {
                // กรณีทั่วไป ใช้ Microlink
                try {
                const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
                const data = await res.json();

                if (data.status === "success") {
                    const previews = {
                        title: data.data.publisher === "X" 
                            ? this.cleanAuthor(data.data.author)
                            : data.data.title,
                        description: data.data.description,
                        image: data.data.image?.url || "",
                        site: data.data.publisher || "Unknown",
                        url,
                    };
                    
                    this.img = data.data.image?.url || fallbackImage;
                    console.log("Microlink previews ==== ", previews);
                    this.selectedData.profile_image = data.data.image?.url || null;
                    if (this.selectedData.source === 'news') {
                        this.selectedData.name = 
                            previews.title === "Just a moment..."
                                ? this.getNewsName(previews.site)
                                : this.getNewsName(previews.title);
                    } else {
                        this.selectedData.name = this.extractName(previews.title);
                    }
                    this.selectedData.followers =  previews.description
                        ? this.extractFollowers(previews.description)
                        : null;
                } else {
                    this.img = fallbackImage;
                    this.selectedData.profile_image = null
                }
                } catch (error) {
                    console.error("Error fetching preview:", error);
                    this.img = fallbackImage;
                }
            }
            this.exportData();
        },
        getNewsName(str) {
            if (!str) return "";
            let result = str.trim();

            // เอาเฉพาะก่อน |, :, - (ถ้ามี)
            result = result.split("|")[0]
                    .split(":")[0]
                    .split("-")[0]
                    .trim();

            // ถ้ามี .com ให้ตัดออก
            result = result.replace(/\.com$/i, "").trim();
            return result;
        },
        cleanAuthor(author) {
            if (!author) return "";

            // ลบข้อความในวงเล็บ () ทั้งหมด
            return author.replace(/\s*\([^)]*\)/g, "").trim();
        },
        extractName(title) {
            // ดึงชื่อก่อน (@username)
            const match = title.match(/^(.*?)\s*\(@/);
            let name = match ? match[1].trim() : title;

            // ลบ emoji / icon ออก
            name = name.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "");

            // ลบ " on X" ถ้ามี
            name = name.replace(/\s+on X$/, "");
            // ตัดเว้นวรรคเกินออก
            return name.trim();
        },
        extractFollowers(description) {
            if (!description) return null;
            // หาเลขก่อนคำว่า Followers.
            const match = description.match(/(\d+(?:,\d+)*)\s+Followers\./i);

            if (match) {
                // ลบ comma ออกแล้วแปลงเป็นตัวเลข
                return parseInt(match[1].replace(/,/g, ""), 10);
            }
            
            return null;
        }
    },
    async mounted() {
        this.mapTargetInfoToSelectedData();
        this.getPreview();
    },  
}
</script>
<style scoped>
.custom-card-img img {
  /* width: 150px !important;  */
  height: 220px !important;
  width: 100% !important;
  /* image-rendering: auto; ป้องกันภาพแตก */
  object-fit: cover; 
  display: block;
  /* margin: 0 auto; จัดกลาง */
}
.sex-custom-card{
    /* background-color: #fed06ea4;  */
    color: #2c3e50;
    border-bottom-left-radius: 10px; 
    border-bottom-right-radius: 10px;
}
.bg-pride {
  background: linear-gradient(
    to right,
    rgba(228, 3, 3, 0.2),    /* Red */
    rgba(255, 140, 0, 0.2),  /* Orange */
    rgba(255, 237, 0, 0.2),  /* Yellow */
    rgba(0, 128, 38, 0.2),   /* Green */
    rgba(0, 77, 255, 0.2),   /* Blue */
    rgba(117, 7, 135, 0.2)   /* Purple */
  );
  /* color: white;  */
  color: #2c3e50;
}
.text-14px {
    font-size: 14px;
}
.text-12px {
    font-size: 12px;
}
.scrollable-body {
  /* max-height: 400px; ปรับตามความสูงที่ต้องการให้ scroll */
  overflow-y: auto;
}
.max-h-350px {
    max-height: 350px;
}

/* lg - xl */
/* @media only screen and (min-width: 0px) and (max-width: 576px) {
   
} */
</style>