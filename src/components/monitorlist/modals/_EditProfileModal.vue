<template>
    <div>
        <!-- {{getListMonitorProfile.targetlist.length}} -->
        <!-- <button class="btn btn-add mt-0 w-100" @click="open = true">
            <i class="fa fa-plus" />
            <span style="font-size: 16px">
                เพิ่มกลุ่ม
            </span>
        </button> -->

        <vue-modaltor :visible="openModal" @hide="closeEdit" :animation-panel="'modal-slide-top'"
            :resize-width="{ 3000: '70%', 1350: '90%', 768: '90%' }"
        >
            <!-- :resize-width="{ 3000: '80%', 1350: '80%', 768: '90%' }" -->
            <!-- :resize-width="{ 3000: '99%', 1350: '90%', 768: '90%' }" -->
            <div>
                <h5><b>แก้ไขรายละเอียด Profile</b></h5>
                <hr />
            </div>


            <!-- body -->
            <b-row class="my-1 ">
                <b-col class="text-left px-0">    
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
                        <!-- <b-col cols="auto" class="px-0">
                            <div class="d-flex justify-content-between" style="gap: 10px;">
                                <b-button size="sm" variant="success" @click="confirmUpdate()">
                                    <i class="fa fa-save mr-1"></i>
                                </b-button>
                                <b-button size="sm" variant="danger" @click="closeEdit()">
                                    <i class="fa fa-times mr-1"></i>
                                </b-button>
                            </div>
                        </b-col> -->
                    </b-row>
                    <div class="col-12 px-0 pb-3">
                        <b-row cols="1" cols-md="2" cols-lg="4" class="mx-0">
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

                            <b-col v-if="type === 'target'" class="px-0 px-md-1 mb-2">
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
                            <b-col v-if="type === 'community'" class="px-0 px-md-1 mb-2">
                                <b-row class="w-100 m-0">
                                    <b-col class="text-secondary d-flex p-0 align-items-center">
                                        <i class="fas fa-address-card mr-1" />
                                        ประเภท community :
                                    </b-col>
                                    <div class="col-12 px-0">
                                        <b-form-select
                                            size="sm"
                                            class="input"
                                            :options="[
                                                { value: null, text: 'เลือกประเภทของ community'},
                                                { value: 'public', text: 'กลุ่มสาธารณะ' },
                                                { value: 'private', text: 'กลุ่มปิด' },
                                            ]"
                                            v-model="profile.group_type"
                                            placeholder="เลือกประเภทของ community"
                                        />
                                    </div>
                                </b-row>
                            </b-col>
                            <b-col class="px-0 px-md-1 mb-2">
                                <b-row class="w-100 m-0">
                                    <b-col class="text-secondary d-flex p-0 align-items-center">
                                        <i class="fas fa-robot mr-1" />
                                        ความถี่การเก็บข้อมูล
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
                                            :options="[
                                                {value:1 , text:'ความถี่ต่ำ'},
                                                {value:2 , text:'ความถี่ปานกลาง'},
                                                {value:3 , text:'ความถี่สูง'},
                                            ]"
                                            v-model="profile.bot_level"
                                            placeholder="เลือกระดับ"
                                        />
                                    </div>
                                </b-row>
                            </b-col>
                            <b-col v-if="type === 'community'" class="px-0 px-md-1 mb-2">
                                <b-row class="w-100 m-0">
                                    <b-col class="text-secondary d-flex p-0 align-items-center">
                                        <i class="fa fa-group mr-1" />
                                        สถานะการเข้าร่วมกลุ่ม :
                                    </b-col>
                                    <div class="col-12 px-0">
                                        <b-form-select
                                            size="sm"
                                            class="input"
                                            :options="[{text:'เลือกสถานะกลุ่ม', value:null},{ text:'รอเข้ากลุ่ม',value:'wait'},{text:'เข้ากลุ่มแล้ว',value:'done'}]"
                                            v-model="profile.group_status"
                                            placeholder="เลือกระดับ"
                                        />
                                    </div>
                                </b-row>
                            </b-col>
                            <b-col v-if="type === 'target'" class="px-0 px-md-1 mb-2">
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
                                        />
                                    </div>
                                </b-row>
                            </b-col>      
                            <b-col v-if="profile.species === 'brand' || profile.species === 'company' || profile.species === 'government'" class="px-0 px-md-1 mb-2">
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

                            <b-col v-if="type === 'target'" class="px-0 px-md-1 mb-2">
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
                            <b-col v-if="profile.species === 'people' || profile.species === 'actor' || profile.species === 'expert' || profile.species === 'political'" class="px-0 px-md-1 mb-2">
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

                            <b-col v-if="profile.species === 'people' || profile.species === 'actor' || profile.species === 'expert' || profile.species === 'political'" class="px-0 px-md-1 mb-2">
                                <b-row class="w-100 m-0">
                                    <b-col class="text-secondary d-flex p-0 align-items-center">
                                        <i class="fa fa-birthday-cake mr-1"/>
                                        อายุ :
                                    </b-col>
                                    
                                    <b-form-spinbutton id="demo-sb" size="sm" v-model="profile.age" min="0" max="100"></b-form-spinbutton>
                                </b-row>
                            </b-col>
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

                            <b-col class="px-0 px-md-1 mb-2">
                                <b-row class="w-100 m-0">
                                    <b-col class="text-secondary d-flex p-0 align-items-center">
                                        <i class="fa fas fa-star mr-1"/>
                                        กำลังติดตาม :
                                    </b-col>
                                    
                                    <b-form-input
                                        size="sm"
                                        type="text"
                                        v-model="profile.followings"
                                        @keypress="onlyNumber"
                                        placeholder="กรอกจำนวน account ที่กำลังติดตาม (เฉพาะตัวเลข)"
                                    />
                                </b-row>
                            </b-col>
                            
                        </b-row>
                        <b-col v-if="profile.influencer_condition === 'follower' || profile.influencer_condition === 'impact'" cols="12" class="px-0 px-md-1 pb-3">
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
                        <b-col>
                            <b-row class="text-info bold pl-2 pt-2">
                                ที่อยู่ 
                            </b-row>
                            <b-row cols="1" cols-md="2" cols-lg="4">
                            <b-col class="px-0 px-md-1 mb-2">
                                <b-row class="w-100 m-0">
                                    <b-col class="text-secondary d-flex p-0 align-items-center">
                                        <i class="fa fa-map-marker mr-1"/>
                                        ประเทศ :
                                    </b-col>
                                    
                                    <div class="col-12 px-0">
                                        <b-form-select
                                            size="sm"
                                            class="input"
                                            :options="[{ country_code_num: null, country_name_th: 'เลือกประเทศ' }, ...country]"
                                            v-model="country_id"
                                            value-field="country_code_num"
                                            text-field="country_name_th"
                                        />
                                    </div>
                                </b-row>
                            </b-col>
                            <b-col v-if="country_id === 764" class="px-0 px-md-1 mb-2">
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
                            </b-col>

                            <b-col v-if="country_id === 764" class="px-0 px-md-1 mb-2">
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
                            </b-col>

                            <b-col v-if="country_id === 764" class="px-0 px-md-1 mb-2">
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
                            </b-col>
                            </b-row>
                        </b-col>
                    </div>
                    <!-- </b-card-text> -->
                </b-col>
            </b-row>

            <!-- footer -->
            <b-row class="m-0 justify-content-end">
                <!-- <b-col cols="auto">
                    <b-button @click="clear" size="sm" variant="outline-danger">
                        <i class="fa fa-eraser" aria-hidden="true"></i>
                        clear
                    </b-button>

                </b-col> -->
                <b-col cols="auto" class="px-0">
                    <b-button @click="apiUpdateProfile()" class="btn btn-save" size="sm">
                        บันทึก
                    </b-button>
                </b-col>
            </b-row>
        </vue-modaltor>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
import Multiselect from 'vue-multiselect'
import speciesTypes from "../dataJson/speciesTypes.json"
import departmentTypes from "../dataJson/departmentTypes.json"
import influConditions from "../dataJson/influConditions.json"
import sexsType from "../dataJson/sexsType.json"
export default {
    components: { Multiselect },
    props: {
        openModal: {
            type: Boolean,
            default: false
        },
        item: {
            type: Object,
            default : () => {}
            // required: true
        },
        // influencerTypes: {
        //     type: Array,
        //     required: true
        // },
        type: {
            type: String,
            default: 'target'
        }
    },
    data() {
        return {
            editable: false,
            profile: {
                _id: null,
                species: null,
                profile_image: null,
                followers: null,
                followings: null,
                influencer_type: null,
                influencer_condition: null,
                department: null,
                bot_level: null,
                name: null,
            },
            country_id: null,
            province_id: null,
            district_id: null,
            subDistrict_id: null,
            selectedProvince: null,
            selectedDistrict: null,
            selectedSubDistrict: null,
            province_name: null,
            influencerTypes: [],
            country : [],
            provinces: [],
            districts: [],
            subDistricts:[],
            sexs: sexsType,
            speciesTypes:speciesTypes,
            influConditions: influConditions,
            departmentTypes: departmentTypes,
        }
    },
    computed: {
        location() {
            return [this.province_id, this.district_id, this.subDistrict_id].filter(v => v != null)
        }
    },
    methods: {
        onlyNumber(e) {
            const char = String.fromCharCode(e.keyCode);
            if (!/[0-9]/.test(char) && e.key !== 'Backspace') {
                e.preventDefault();
            }
        },
        closeEdit() {
            this.$emit('close');
        },
        confirmUpdate() {
            Swal.fire({
                title: 'ยืนยันการแก้ไขข้อมูล?',
                text: "คุณต้องการบันทึกการแก้ไขข้อมูลใช่หรือไม่",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ใช่, บันทึกการแก้ไข',
                cancelButtonText: 'ยกเลิก',
                customClass: {
                    confirmButton: 'btn btn-success mr-3',
                    cancelButton: 'btn btn-danger'
                },
                didOpen: () => {
                    const iconContent = document.querySelector('.swal2-icon-content');
                    if (iconContent) iconContent.style.display = 'none';
                },
                buttonsStyling: false,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log("update profile === ", this.profile);
                    this.apiUpdateProfile();
                }
            })
        },
        async checkLocation() {
            if (!this.profile.location || this.profile.location.length === 0 || typeof this.profile.location === "string") {
                // console.log("ไม่มีข้อมูล location");
                this.province_id = null;
                this.district_id = null;
                this.subDistrict_id = null;
                this.selectedProvince = null;
                this.selectedDistrict = null;
                this.selectedSubDistrict = null;
                return; // ออกจากฟังก์ชันทันที
            }
            const location = this.profile.location;
            // console.log("location ==== ", location);
            // กำหนดค่าพร้อมตรวจว่ามีข้อมูลครบหรือไม่
            this.province_id = location.length >= 1 ? location[0] : null;
            // ถ้ามี province_id → โหลดอำเภอ
            if (this.province_id) {
                this.selectedProvince = await this.getProvinceNameById(this.province_id);
                this.profile.province = this.selectedProvince;
                await this.apiGetDistrict(this.province_id);
                this.district_id = location.length >= 2 ? location[1] : null;
                if (this.district_id) {
                    this.selectedDistrict = await this.getDistrictNameById(this.district_id);
                }
            }

            // ถ้ามี district_id → โหลดตำบล
            if (this.district_id) {
                await this.apiGetSubDistrict(this.district_id); // คุณต้องมีฟังก์ชันนี้
                this.subDistrict_id = location.length >= 3 ? location[2] : null;
                if (this.subDistrict_id) {
                    this.selectedSubDistrict = await this.getSubDistrictNameById(this.subDistrict_id);
                }
            }
        },
        async getProvinceNameById(id) {
            try {
                const config = {
                    method: "get",
                    url: "https://api2.cognizata.com/api/v2/location/getProvinces",
                    params: { id: id },
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },
                };
                const response = await this.axios(config);
                let result = response.data.data[0] || [];
                // console.log("procince === ",result.name_th);
                return result.name_th;
            }catch (error) {
                // console.error("apiGetInfluencers error:", error);
                return null;
                // this.influencers = [];
            }
            // finally {
            //     this.loading = false; // จะทำงานเสมอ ไม่ว่าผลจะ success หรือ error
            // }
        },
        async getDistrictNameById(id) {
            try {
                const config = {
                    method: "get",
                    url: "https://api2.cognizata.com/api/v2/location/getAmphures",
                    params: { id: id },
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },
                };
                const response = await this.axios(config);
                let result = response.data.data[0] || [];
                // console.log("procince === ",result.name_th);
                return result.name_th;
            }catch (error) {
                // console.error("apiGetInfluencers error:", error);
                return null;
                // this.influencers = [];
            }
            // finally {
            //     this.loading = false; // จะทำงานเสมอ ไม่ว่าผลจะ success หรือ error
            // }
        },
        async getSubDistrictNameById(id) {
            try {
                const config = {
                    method: "get",
                    url: "https://api2.cognizata.com/api/v2/location/getTambons",
                    params: { id: id },
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },
                };
                const response = await this.axios(config);
                let result = response.data.data[0] || [];
                // console.log("procince === ",result.name_th);
                return result.name_th;
            }catch (error) {
                // console.error("apiGetInfluencers error:", error);
                return null;
                // this.influencers = [];
            }
            // finally {
            //     this.loading = false; // จะทำงานเสมอ ไม่ว่าผลจะ success หรือ error
            // }
        },
        apiGetCountry() {
            this.province_id = null;
            this.district_id = null;
            this.subDistrict_id = null;
            this.load = true;
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
                // console.log(result);
                this.country = result;
                // this.provinces = result.map(province => ({
                //     text: province.name_th,
                //     value: province.id
                // }));
                // console.log('this.provinces ', this.provinces);
                
                // this.profile = response.data?.profile
                // console.log('this.profile ', this.profile);
                this.load = false;
            })
            .catch((error) => {
                this.load = false;
                // console.error(error);
            });
        },
        apiGetProvinces() {
            this.district_id = null;
            this.subDistrict_id = null;
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
                // console.log(result);
                
                this.provinces = result.map(province => ({
                    text: province.name_th,
                    value: province.id
                }));
                // console.log('this.provinces ', this.provinces);
                
                // this.profile = response.data?.profile
                // console.log('this.profile ', this.profile);
                this.load = false;
            })
            .catch((error) => {
                this.load = false;
                // console.error(error);
            });
        },
        async apiGetDistrict(id) {
            this.province_name = await this.getProvinceNameById(this.province_id);
            this.subDistrict_id = null;
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
                // console.log(this.districts);
                
            } catch (error) {
                // console.error("apiGetDistrict error:", error);
                this.districts =  [];
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

                this.subDistricts = result.map(subDistrict => ({
                    text: subDistrict.name_th,
                    value: subDistrict.id
                }));

                // console.log(this.subDistricts);
                
            } catch (error) {
                // console.error("apiGetDistrict error:", error);
                this.subDistricts = [];
            }
            
        },

        apiGetInfluencerType() {
            this.load = true;
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
                this.influencerTypes = result.map(type => ({
                    value: type.id,
                    text: type.name
                }));
                this.load = false;
            })
            .catch((error) => {
                this.load = false;
                // console.error(error);
            });
        },
        apiUpdateProfile() {
            // this.handleLocation();
            // this.load = true;
            let rawData = {
                "data": [{
                    key: "account",
                    _id: this.profile._id,
                    source:this.profile.source,
                    group_type: this.profile.group_type,
                    name: this.profile.name,
                    profile_image: this.profile.profile_image,
                    species:this.profile.species, 
                    sex: this.profile.sex,
                    age: this.profile.age === 0 ? null : this.profile.age, 
                    influencer_type: Array.isArray(this.profile.influencer_type)
                    ? this.profile.influencer_type.map(item => item.value)
                    : [], 
                    influencer_condition: this.profile.influencer_condition, 
                    location: this.location,
                    country: this.country_id,
                    province: this.province_name,
                    followers : this.profile.followers,
                    followings: this.profile.followings,
                    department: this.profile.department,
                    bot_level: this.profile.bot_level,
                    group_status: this.profile.group_status,

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
                let result = response.data || [];
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
                
                this.$emit('updated');
            })
            .catch((error) => {
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
        this.apiGetInfluencerType();
        this.apiGetCountry();
        this.apiGetProvinces();
        
    },
    watch: {
        province_id(newVal) {
            this.district_id = null;
            this.apiGetDistrict(newVal);
        },
        openModal() {
            if(this.openModal){
                this.profile = {
                    ...this.item,
                    influencer_type: Array.isArray(this.item.influencer_type)
                    ? this.item.influencer_type
                        .map(id => this.influencerTypes.find(item => item.value === id))
                        .filter(Boolean)
                    : []
                };
                this.country_id = this.profile.country ? this.profile.country.code_num : null;
                this.checkLocation()
                console.log("profile edit in edit modal === ", this.profile);
            } else {
                // this.profile = null
            }
        }
    }
}
</script>



<style scoped>
.dashed-border {
    border: 1px dashed #ccc;
    /* เส้นประสีเทา */
    border-radius: 6px;
    /* (ถ้าอยากได้มุมโค้ง) */
    padding: 8px;
    /* เพิ่มระยะห่างด้านใน */
}

.modal-body-scrollable {
    min-height: 70vh;
    max-height: 70vh;
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
