<template>
    <b-col class="text-left px-0 pl-lg-3">    
        <!-- <b-card-text class="my-2"> -->
        <b-row class="py-2 mx-0">
            <b-col class="px-0 text-capitalize text-info d-flex align-content-center">
               <b-row class="bold my-2 mx-0">
                    <i class="fas fa-pen"></i>
                    <span class="ml-2">
                        แก้ไขข้อมูล
                    </span>
                </b-row>
            </b-col>
            <b-col cols="auto" class="px-0">
                <div class="d-flex justify-content-between" style="gap: 10px;">
                    <b-button variant="success" @click="confirmUpdate()">
                        <i class="fa fa-save mr-1"></i>
                    </b-button>
                    <b-button variant="danger" @click="editProfile()">
                        <i class="fa fa-times mr-1"></i>
                    </b-button>
                </div>
            </b-col>
        </b-row>
        <div class="col-12 px-0 pb-3">
            <b-row cols="1" cols-sm="1" cols-md="2" class="mx-0">
                <b-col class="px-0 px-md-1 mb-2">
                    <b-row class="w-100 m-0">
                        <b-col class="text-secondary d-flex p-0 align-items-center">
                            <i class="fa fa-user mr-1"/>
                            ชื่อบัญชี :
                        </b-col>
                        <div class="col-12 px-0" >
                            <b-form-input
                                size="sm"
                                class="input"
                                placeholder="ระบุชื่อบัญชี"
                                v-model="profile.name"
                            />
                        </div>
                    </b-row>
                </b-col>

                <b-col class="px-0 px-md-1 mb-2">
                    <b-row class="w-100 m-0">
                        <b-col class="text-secondary d-flex p-0 align-items-center">
                            <i class="fas fa-image mr-1"/>
                            url ที่อยู่รูปโปรไฟล์  
                            <i
                                
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
                                v-model="profile.profile_image"
                            />
                        </div>
                    </b-row>
                </b-col>

                <b-col class="px-0 px-md-1 mb-2">
                    <b-row class="w-100 m-0">
                        <b-col class="text-secondary d-flex p-0 align-items-center">
                            <i class="fas fa-address-card mr-1" />
                            ลักษณะของบัญชี :
                        </b-col>
                        <div class="col-12 px-0">
                            <b-form-select
                                size="sm"
                                class="input"
                                :options="[{ value: null, text: 'เลือกลักษณะของอินฟลูเอนเซอร์' }, ...speciesTypes]"
                                v-model="profile.species"
                                placeholder="เลือกหมวดหมู่"
                            />
                        </div>
                    </b-row>
                </b-col>

                <b-col class="px-0 px-md-1 mb-2">
                    <b-row class="w-100 m-0">
                        <b-col class="text-secondary d-flex p-0 align-items-center">
                            <i class="fas fa-award mr-1" />
                            เงื่อนไข Influencer :
                        </b-col>
                        
                        <div class="col-12 px-0">
                            <b-form-select
                                size="sm"
                                class="input"
                                :options="influConditions"
                                v-model="profile.influencer_condition"
                                placeholder="เลือกระดับ Influencer"
                            />
                        </div>
                    </b-row>
                </b-col>
                <b-col class="px-0 px-md-1 mb-2">
                    <b-row class="w-100 m-0">
                        <b-col class="text-secondary d-flex p-0 align-items-center">
                            <i class="fa fa-tag mr-1" />
                            ประเภทธุรกิจ :
                        </b-col>
                        <div class="col-12 px-0">
                            <b-form-select
                                size="sm"
                                class="input"
                                :options="[{ value: null, text: 'เลือกหมวดหมู่' }, ...departmentTypes]"
                                v-model="profile.department"
                                placeholder="เลือกหมวดหมู่"
                            />
                        </div>
                    </b-row>
                </b-col>
                <b-col class="px-0 px-md-1 mb-2">
                    <b-row class="w-100 m-0">
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
                        <div class="col-12 px-0">
                            <b-form-select
                                size="sm"
                                class="input"
                                :options="[1,2,3]"
                                v-model="profile.bot_level"
                                placeholder="เลือกระดับ"
                            />
                        </div>
                    </b-row>
                </b-col>

                <b-col class="px-0 px-md-1 mb-2">
                    <b-row class="w-100 m-0">
                        <b-col class="text-secondary d-flex p-0 align-items-center">
                            <i v-if="profile.sex === 'female'" class="fa fa-venus" />
                            <i v-else-if="profile.sex === 'male'" class="fa fa-mars" />
                            <i v-else class="fa fa-neuter mr-1" />
                            เพศ :
                        </b-col>
                        <div class="col-12 px-0">
                            <b-form-select
                                size="sm"
                                class="input"
                                :options="sexs"
                                v-model="profile.sex"
                                placeholder="เลือกเพศ"
                            />
                        </div>
                    </b-row>
                </b-col>

                <b-col class="px-0 px-md-1 mb-2">
                    <b-row class="w-100 m-0">
                        <b-col class="text-secondary d-flex p-0 align-items-center">
                            <i class="fa fa-birthday-cake mr-1"/>
                            อายุ :
                        </b-col>
                        
                        <b-form-spinbutton id="demo-sb" size="sm" v-model="profile.age" min="0" max="100"></b-form-spinbutton>
                    </b-row>
                </b-col>

                <!-- <b-col class="px-0 px-md-1 mb-2">
                    <b-row class="w-100 m-0">
                        <b-col class="text-secondary d-flex p-0 align-items-center">
                            <i class="fa fa-map-marker mr-1"/>
                            จังหวัด :
                        </b-col>
                        
                        <div class="col-12 px-0">
                            <b-form-select
                                size="sm"
                                class="input"
                                :options="[{ value: null, text: 'เลือกจังหวัด' }, ...provinces]"
                                placeholder="เลือกจังหวัด"
                                v-model="province_id"
                                @change="apiGetDistrict(province_id)"
                            />
                        </div>
                    </b-row>
                </b-col> -->

                <!-- <b-col class="px-0 px-md-1 mb-2">
                    <b-row class="w-100 m-0">
                        <b-col class="text-secondary d-flex p-0 align-items-center">
                            <i class="fa fa-map-marker mr-1"/>
                            อำเภอ :
                        </b-col>
                        
                        <div class="col-12 px-0">
                            <b-form-select
                                :disabled="!province_id"
                                size="sm"
                                class="input"
                                :options="[{ value: null, text: 'เลือกอำเภอ' }, ...districts]"
                                placeholder="เลือกอำเภอ"
                                v-model="district_id"
                                @change="apiGetSubDistrict(district_id)"
                            />
                        </div>
                    </b-row>
                </b-col> -->

                <!-- <b-col class="px-0 px-md-1 mb-2">
                    <b-row class="w-100 m-0">
                        <b-col class="text-secondary d-flex p-0 align-items-center">
                            <i class="fa fa-map-marker mr-1"/>
                            ตำบล :
                        </b-col>
                        
                        <div class="col-12 px-0">
                            <b-form-select
                                :disabled="!district_id"
                                size="sm"
                                class="input"
                                :options="[{ value: null, text: 'เลือกตำบล' }, ...subDistricts]"
                                placeholder="เลือกตำบล"
                                v-model="subDistrict_id"
                            />
                        </div>
                    </b-row>
                </b-col> -->
                
                <b-col class="px-0 px-md-1 mb-2">
                    <b-row class="w-100 m-0">
                        <b-col class="text-secondary d-flex p-0 align-items-center">
                            <i class="fa fas fa-users mr-1"/>
                            ผู้ติดตาม :
                        </b-col>
                        
                        <b-form-input
                            size="sm"
                            type="text"
                            v-model="profile.followers"
                            @keypress="onlyNumber"
                            placeholder="กรอกจำนวนผู้ติดตาม (เฉพาะตัวเลข)"
                        />
                    </b-row>
                </b-col>

                <!-- <b-col class="px-0 px-md-1 mb-2">
                    <b-row class="w-100 m-0">
                        <b-col class="text-secondary d-flex p-0 align-items-center">
                            <i class="fa fas fa-star mr-1"/>
                            กำลังติดตาม :
                        </b-col>
                        
                        <b-form-input
                            size="sm"
                            type="text"
                            v-model="profile.following"
                            @keypress="onlyNumber"
                            placeholder="กรอกจำนวน account ที่กำลังติดตาม (เฉพาะตัวเลข)"
                        />
                    </b-row>
                </b-col> -->

            </b-row>
            <b-col cols="12" class="px-0 px-md-1 pb-3">
                <b-row class="w-100 m-0">
                    <b-col class="text-secondary text-left d-flex p-0 align-items-center">
                        <i class="fa fa-tag mr-1" />
                        หมวดหมู่ของ Influencer :
                    </b-col>
                    <div class="col-12 px-0">
                        <Multiselect
                            v-model="profile.influencer_type"
                            :options="influencerTypes"
                            :multiple="true"
                            :taggable="true"
                            label="text"
                            track-by="value"
                            placeholder="เลือกหมวดหมู่"
                        />
                    </div>
                </b-row>
            </b-col>
        </div>
        <!-- </b-card-text> -->
    </b-col>
</template>
<script>
import Swal from 'sweetalert2'
import Multiselect from 'vue-multiselect'

export default {
    components: { Multiselect },
    props: {
        // profile: {
        //     type: Object,
        //     required: true
        // },
        influencerTypes: {
            type: Array,
            required: true
        },
    },
    data() {
        return {
            editable: false,
            profile: {
                _id: null,
                species: null,
                profile_image: null,
                followers: null,
                following: null,
                influencer_type: null
            },
            province_id: null,
            district_id: null,
            subDistrict_id: null,
            sexs: [
                { value: null, text: 'ไม่ระบุเพศ' },
                { value: 'male', text: 'ชาย' },
                { value: 'female', text: 'หญิง' },
                { value: 'other', text: 'อื่นๆ' }
            ],
            speciesTypes:[
                { text: 'บุคคลทั่วไป', value: 'people' },
                { text: 'ดารา / นักแสดง / ศิลปิน', value: 'actor' },
                { text: 'ผู้เชี่ยวชาญ', value: 'expert' },
                { text: 'สัตว์เลี้ยง', value: 'pet' },
                { text: 'แบรนด์ / ร้านค้า', value: 'brand' },
                { text: 'องค์กร / บริษัท', value: 'company' },
                { text: 'หน่วยงานราชการ', value: 'government' },
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
        }
    },
    methods: {
        apiUpdateProflie() {
            // this.handleLocation();
            this.load = true;
            let rawData = {
                "data": [{
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
                    profile_image: this.selectedData.profile_image,
                    department: this.selectedData.department
                }]
            };
            // console.log("data ==== ", rawData);
            
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
                let result = response.data || [];

                this.load = false;
                this.editProfile();
                Swal.fire({
                    title: 'บันทึกแล้ว!',
                    text: 'ข้อมูลของคุณถูกบันทึกเรียบร้อย',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 3000,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    buttonsStyling: false
                });
                this.apiMonitorProfile();
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
    }
}
</script>


<style scoped>
    
</style>