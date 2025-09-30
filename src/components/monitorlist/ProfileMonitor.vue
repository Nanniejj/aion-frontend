<template>
    <div>
        <!-- avatar  -->
        <b-row v-if="type === 'hashtaglist'" class="m-0">
            <b-col xl="4" class="px-0 pr-xl-3">
                <div class="gradient-bg h-100">
                    <b-row v-if="profile" class="m-0">
                        <b-col class="py-3">
                            <span>
                                <b-avatar v-if="type == 'hashtaglist'" style="color: #776167;" text="#" class="shadow-sm rounded badge-light rounded-circle"
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
                                        </b-avatar>
                                    </span>
                                    <span v-else>
                                        <b-avatar class="shadow-sm rounded badge-light rounded-circle"
                                            size="120px">
                                        </b-avatar>
                                    </span>
                                </b-avatar>
                                <span v-if="selectedSource" class="left">
                                    <img v-if="selectedSource == 'twitter'" src="@/assets/Twitter.png"
                                        class="social-img" />
                                    <img v-else-if="selectedSource == 'facebook'" src="@/assets/Facebook.png"
                                        class="social-img" />
                                    <img v-if="selectedSource == 'news'" src="@/assets/News.png" class="social-img" />
                                    <img v-if="selectedSource == 'pantip'" src="@/assets/Pantip.png"
                                        class="social-img" />
                                    <img v-if="selectedSource == 'instagram'" src="@/assets/Instagram.png"
                                        class="social-img" />
                                    <img v-if="selectedSource == 'youtube'" src="@/assets/Youtube.png"
                                        class="social-img" />
                                    <img v-if="selectedSource == 'blockdit'" src="@/assets/Blockdit.png"
                                        class="social-img" />
                                    <img v-if="selectedSource == 'tiktok'" src="@/assets/Tiktok.png"
                                        class="social-img" />
                                    <img v-if="selectedSource == 'threads'" src="@/assets/Threads.png"
                                        class="social-img" />
                                </span>
                                <span v-if="selectedSource === 'all'" class="left">
                                    <b-avatar class="" size="45" text="All" style="background-color: #fed16e;left: -30px;"></b-avatar>
                                </span>
                            </span>
                            <div class="h6 py-2">
                                <a v-if="type == 'hashtaglist'" class="" v-bind:href="profile.link_original" target="_blank"
                                    style="color: #776167;"> 
                                    <h4 class="py-2 text-truncate" v-if="type === 'hashtaglist'">{{ profile.uid}}</h4>
                                    ({{ totalPost | numFormat }} posts)
                                </a> 
                                <a v-else class="d-flex align-items-center justify-content-center" v-bind:href="profile.link_original" target="_blank"
                                    style="color: #776167;"> 
                                    <h4 v-if="profile.target_type === 'group'" class="py-2 mb-0 text-truncate">{{ profile.name || profile.uid }}</h4>
                                    <h4 v-else class="py-2 mb-0 text-truncate">{{ profile.name || data.account_name || profile.uid }}</h4>
                                    <i class="fa fa-external-link text-info mx-1" v-if="type == 'targetlist'" />
                                </a> 
                            </div>

                            <b-col v-if="type == 'hashtaglist'">
                                <date-picker
                                    v-model="valueDate"
                                    type="date"
                                    range
                                    placeholder="เลือกช่วงเวลา"
                                    size="sm"
                                    :disabled-date="(date) => date >= new Date()"
                                    value-type="format"
                                    format="YYYY-MM-DD"
                                    id="date-domain"
                                    class="w-100"
                                    @change="checkDateRange()"
                                >
                                    {{ valueDate }}
                                </date-picker>
                                <b-button v-if="selectedSource !== 'all'" variant="info" pill :pressed="false" @click="resetSource" class="shadow-r px-4 my-4">All Platform</b-button>
                            </b-col>
                        </b-col>
                        <b-col v-if="type == 'targetlist'" cols="12" class="my-2 px-4">
                            <b-row style="color: #776167;" v-if="province_id || district_id || subDistrict_id" class="m-0 justify-content-center">
                                <b-col cols="auto" class="px-0">
                                    <i class="fa fa-map-marker d-inline"/>
                                </b-col>
                                <b-col cols="auto" class="text-truncate text-left">
                                    <span v-if="province_id" class="text-icon text-center text-truncate d-inline-block">
                                        <b>{{ selectedProvince }}</b>
                                    </span>
                                    <span v-if="district_id" class="text-icon text-center text-truncate d-inline-block">
                                        <b>, {{ selectedDistrict }}</b>
                                    </span>
                                    <span v-if="subDistrict_id" class="text-icon text-center text-truncate d-inline-block">
                                        <b>, {{  selectedSubDistrict }}</b>
                                    </span>
                                    <span v-if="!province_id && !district_id && !subDistrict_id" class="text-icon text-center">
                                        <b>ไม่ระบุพื้นที่</b>
                                    </span>
                                </b-col>
                            </b-row>
                        </b-col> 
                    </b-row>
                </div>
            </b-col>
            <b-col xl="8" class="text-left px-0 pl-lg-3">
                <b-card-text v-if="type === 'hashtaglist'" class="my-2">
                    <HashtagBarChar 
                        :start="valueDate[0]"
                        :end="valueDate[1]"
                        @update-source="(data) => setHashtagSource(data)"
                        @totalPost="(data) => totalPost = data"
                    />
                </b-card-text>
                <b-card-text v-if="type !== 'hashtaglist'" class="my-2">
                    <b-row class="py-2 mx-0">
                        <b-col class="px-0 text-capitalize text-info d-flex align-content-center">
                            <i v-if="editable" class="fa fas fa-pen mr-1"></i>
                            <h5 class="font-weight-bold">Details</h5>
                        </b-col>
                        <b-col cols="auto" class="px-0">
                            <div v-if="!editable" class="d-flex justify-content-end">
                                <b-button variant="info" @click="editProfile()" size="small">
                                    <i class="fa fa-edit mr-1"></i> แก้ไขข้อมูล
                                </b-button>
                            </div>
                            <div v-else class="d-flex justify-content-between" style="gap: 10px;">
                                <b-button variant="success" @click="confirmUpdate()">
                                    <i class="fa fa-save mr-1"></i>
                                </b-button>
                                <b-button variant="danger" @click="editProfile()">
                                    <i class="fa fa-times mr-1"></i>
                                </b-button>
                            </div>
                        </b-col>
                    </b-row>
                    <div v-if="!editable" class="col-12">
                        <b-row >
                            <b-col cols="12 mb-2 px-0">
                                <b-badge v-if="profile.species" variant="info" class="mr-1 text-capitalize" pill>{{ getSpeciesName(profile.species) }}</b-badge>
                                <b-badge v-if="profile.department" class="mr-2" style="background-color: #fed06ea4; color: #2c3e50;" pill>
                                    {{ getDepartmentType(profile.department) }}
                                </b-badge>
                            </b-col>
                            <b-col cols="12" class="text-left">
                                <b-row cols="2" cols-sm="4" class="">
                                    <b-col class="my-2">
                                        <b-row class="justify-content-center">
                                            <b-col cols="12" class="text-center">
                                                <i class="fa fas fa-users fa-2x d-inline" style="color: #fed06ea4;"/>
                                            </b-col>
                                            <b-col cols="12">
                                                <div class="text-icon text-center">
                                                    <b style="font-size: 20px;">{{ profile.followers| numFormat }}</b>
                                                </div>
                                            </b-col>
                                            Followers
                                        </b-row>
                                    </b-col>
                                    <b-col class="my-2">
                                        <b-row class="justify-content-center text-center">
                                            <b-col cols="12">
                                                <i class="fa fas fa-star fa-2x d-inline" style="color: #fed06ea4;"/>
                                            </b-col>
                                            <b-col cols="12">
                                                <div class="text-icon text-center">
                                                    <b style="font-size: 20px;">{{ profile.following| numFormat }}</b>
                                                </div>
                                            </b-col>
                                            Following
                                        </b-row>
                                    </b-col>
                                    <b-col class="my-2">
                                        <b-row class="justify-content-center text-center">
                                            <b-col cols="12">
                                                <i class="fas fa-transgender-alt fa-2x d-inline" style="color: #fed06ea4;"/>
                                            </b-col>
                                            <b-col cols="12">
                                                <div class="text-icon text-center">
                                                    <b>{{ getsexTh(profile.sex) }}</b>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                    <b-col class="my-2">
                                        <b-row class="justify-content-center text-center">
                                            <b-col cols="12">
                                                <i class="fa fa-birthday-cake fa-2x d-inline" style="color: #fed06ea4;"/>
                                            </b-col>
                                            <b-col cols="12">
                                                <div class="text-icon text-center">
                                                    <b>{{ profile.age ? `${profile.age} ปี` : 'ไม่ระบุอายุ' }}</b>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </b-row>
                            </b-col>
                            
                            <!-- influencer type -->
                            <b-row v-if="profile.influencer_type && profile.influencer_type.length !== 0" class="m-0 w-100 ">
                                <div class="col-12 pt-3">
                                    <b-row cols="1" cols-sm="2" cols-lg="4" class="px-5 py-3 w-100" style="background-color: #fed06ea4; border-radius: 90px;">
                                        <b-col v-for="(item, index) in profile.influencer_type.length > 4 
                                            ? profile.influencer_type.slice(0, 3) 
                                            : profile.influencer_type.slice(0, 4)"
                                            :key="index"
                                        >
                                            <b-row class="text-center">
                                                <b-col cols="12" class="" >
                                                    <b-avatar v-if="getIcon(item).startsWith('fa-')" size="4rem" style="background-color: #17a2b8;">
                                                        <i class="fas" :class="getIcon(item)" style="font-size: 2rem;"></i>
                                                    </b-avatar>

                                                    <!-- ถ้าไม่ใช่ fa- ให้ใช้แบบ icon ปกติ -->
                                                    <b-avatar v-else :icon="getIcon(item)" style="background-color: #17a2b8;" size="4rem"></b-avatar>
                                                    <!-- <b-avatar :icon="getIcon(item)" size="6rem"></b-avatar> -->
                                                </b-col>
                                                <b-col cols="12">
                                                    <div class="text-icon" style="font-size: 13px;">
                                                        {{ getInfluencerTypeName(item) }}
                                                    </div>
                                                </b-col>
                                            </b-row>
                                        </b-col>
                                        
                                        <b-col v-if="profile.influencer_type && profile.influencer_type.length > 4">
                                            <b-row class="text-center">
                                                <b-col cols="12">
                                                    <b-avatar :text="`+${profile.influencer_type.length - 3}`" size="4rem"></b-avatar>
                                                </b-col>
                                                <b-col cols="" class="px-0">
                                                    More
                                                    <!-- <div class="text-icon">
                                                        Messages
                                                    </div> -->
                                                </b-col>
                                            </b-row>
                                        </b-col>
                                    </b-row>
                                </div>
                            </b-row>
                        </b-row>
                    </div>
                    <div v-else class="col-12 px-0">
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
                                            v-model="selectedData.name"
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
                                            v-model="selectedData.species"
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
                                            v-model="selectedData.department"
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
                                            v-model="selectedData.bot_level"
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
                                            v-model="selectedData.sex"
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
                                    
                                    <b-form-spinbutton id="demo-sb" size="sm" v-model="selectedData.age" min="0" max="100"></b-form-spinbutton>
                                </b-row>
                            </b-col>

                            <b-col class="px-0 px-md-1 mb-2">
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

                            <b-col class="px-0 px-md-1 mb-2">
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

                            <b-col class="px-0 px-md-1 mb-2">
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
                            
                            <b-col class="px-0 px-md-1 mb-2">
                                <b-row class="w-100 m-0">
                                    <b-col class="text-secondary d-flex p-0 align-items-center">
                                        <i class="fa fas fa-users mr-1"/>
                                        ผู้ติดตาม :
                                    </b-col>
                                    
                                    <b-form-input
                                        size="sm"
                                        type="text"
                                        v-model="selectedData.followers"
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
                                        v-model="selectedData.following"
                                        @keypress="onlyNumber"
                                        placeholder="กรอกจำนวน account ที่กำลังติดตาม (เฉพาะตัวเลข)"
                                    />
                                </b-row>
                            </b-col>

                        </b-row>
                        <b-col cols="12" class="px-0 px-md-1 mb-2">
                            <b-row class="w-100 m-0">
                                <b-col class="text-secondary text-left d-flex p-0 align-items-center">
                                    <i class="fa fa-tag mr-1" />
                                    หมวดหมู่ของ Influencer :
                                </b-col>
                                <div class="col-12 px-0">
                                    <Multiselect
                                        v-model="selectedData.influencer_type"
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
                </b-card-text>
            </b-col>
        </b-row> 
        <b-row v-else>
            <b-col cols="12" sm="auto" class="px-3">
                <b-avatar size="140px" class="p-1 bg-white border border-light shadow">
                    <span v-if="data.profile_image">
                        <b-avatar 
                            :src="data.profile_image"
                            @error="setAltImg"
                            size="140px" 
                            loading="lazy"
                            class="shadow-sm rounded badge-light rounded-circle shadow"
                        >
                        </b-avatar>
                    </span>
                    <span v-else>
                        <b-avatar class="shadow-sm rounded badge-light rounded-circle"
                            size="140px">
                        </b-avatar>
                    </span>
                </b-avatar>
                <b-col cols="auto" v-if="selectedSource" class="right">
                    <img v-if="selectedSource == 'twitter'" src="@/assets/Twitter.png"
                        class="social-img" />
                    <img v-else-if="selectedSource == 'facebook'" src="@/assets/Facebook.png"
                        class="social-img" />
                    <img v-if="selectedSource == 'news'" src="@/assets/News.png" class="social-img" />
                    <img v-if="selectedSource == 'pantip'" src="@/assets/Pantip.png"
                        class="social-img" />
                    <img v-if="selectedSource == 'instagram'" src="@/assets/Instagram.png"
                        class="social-img" />
                    <img v-if="selectedSource == 'youtube'" src="@/assets/Youtube.png"
                        class="social-img" />
                    <img v-if="selectedSource == 'blockdit'" src="@/assets/Blockdit.png"
                        class="social-img" />
                    <img v-if="selectedSource == 'tiktok'" src="@/assets/Tiktok.png"
                        class="social-img" />
                    <img v-if="selectedSource == 'threads'" src="@/assets/Threads.png"
                        class="social-img" />
                </b-col>
            </b-col>
            <b-col>
                <b-row class="justify-content-center justify-content-sm-start">
                    <b-col cols="auto">
                        <a style="color: #2c3e50;" class="align-items-center" v-bind:href="profile.link_original" target="_blank"> 
                            <h5 v-if="profile.target_type === 'group'" class="py-2 mb-0 bold">
                                {{ profile.name || profile.uid }}
                                <i class="fa fa-external-link text-info mx-1"/>
                            </h5>
                            <h5 v-else class="py-2 mb-0 bold">
                                {{ profile.name || data.account_name || profile.uid }}
                                <i class="fa fa-external-link text-info mx-1"/>
                            </h5>
                        </a> 
                    </b-col>
                    <b-col cols="12" class="text-sm-left">
                        <b-badge v-if="profile.species" class="mr-2 badge-custom" pill>
                            {{ getSpeciesName(profile.species) }}
                        </b-badge>
                        <b-badge v-if="profile.sex" pill :class="'badge-' + profile.sex">{{ getsexTh(profile.sex) }}</b-badge>
                    </b-col>
                    <b-col cols="12" class="mt-1">
                        <b-row class="justify-content-center justify-content-sm-start">
                            <b-col cols="auto">
                                <span class="text-info bold" style="font-size: 18px;">{{ formatNumber(profile.followers) }}</span> Followers
                            </b-col>
                            <b-col cols="auto">
                                <span class="text-info bold" >{{ formatNumber(profile.followings) }}</span> Following
                            </b-col>
                        </b-row>
                    </b-col>
                    
                    <b-col class="mt-1 text-left" v-if="profile.influencer_type && profile.influencer_type.length !== 0">
                        <b-badge 
                            v-for="(item, index) in profile.influencer_type"
                            :key="index" variant="warning" class="mx-1"
                            style="background-color: #fed16e;"
                        >
                            <b-row class="text-center m-0 align-item-center">
                                <b-col cols="auto" class="px-0" >
                                    <!-- <b-avatar v-if="getIcon(item).startsWith('fa-')" style="background-color: #17a2b8;"> -->
                                        <i class="fas" v-if="getIcon(item).startsWith('fa-')" :class="getIcon(item)"></i>
                                    <!-- </b-avatar> -->

                                    <!-- <b-avatar v-else :icon="getIcon(item)"></b-avatar> -->
                                     <b-icon  v-else :icon="getIcon(item)" aria-hidden="true"></b-icon>
                                </b-col>
                                <b-col class="px-1">
                                    <div class="text-icon" style="font-size: 13px;">
                                        {{ getInfluencerTypeName(item) }}
                                    </div>
                                </b-col>
                            </b-row>
                        </b-badge>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>       

        <!-- woldCloud -->
        <b-row class="my-5 mx-0">
            <!-- <div class="col-12">
                <h5 class="font-weight-bold py-2">Word Cloud</h5>
            </div> -->
            <div class="col-12">
                <b-row cols="1" cols-md="2">
                    <b-col class="pr-md-3 px-0">
                        <ProfileWordCloud 
                            :source="selectedSource"
                            :loading="loadWordCloud"
                            title="Word Cloud Domain"
                            :wordcloud_image="wordcloud_images.words"
                            :width="600" 
                            :height="400" 
                        />
                    </b-col>
                    <b-col class="pl-md-3 pt-3 pt-md-0 px-0">
                        <ProfileWordCloud 
                            :source="selectedSource"
                            :loading="loadWordCloud"
                            title="Word Cloud Hashtag"
                            :wordcloud_image="wordcloud_images.hashtag"
                            :width="600" 
                            :height="400" 
                        />
                    </b-col>
                </b-row>
            </div>
        </b-row>

        <!-- Top Domain & hashtag  -->
        <!-- <b-row class="mt-5 mx-0">
            <b-col class="px-0">
                <TabDomain 
                    :source="selectedSource"
                    :load="load"
                    :topDomain="topDomain"
                    :topHashtag="topHashtags" 
                    @update-keyword="(data) => setKeyWord(data)"
                    @select-chart="(data) => setKeyWord(data)"
                />
            </b-col>
        </b-row> -->

        <!-- time line v-if="type === 'hashtaglist'" -->
        <b-row id="timeline-container" class="m-0">
            <!-- Filters Card -->
            <b-col cols="12" class="px-0">
                <b-card class="mb-3 shadow-sm" style="border-radius: 20px;">
                    <h5 class="text-left">Filter</h5>
                    <b-form @submit.prevent="onSearch()">
                    <b-row>
                        <b-col cols="12" md="7">
                            <b-row class="m-0">
                                <b-form-group label="" label-for="kw" class="flex-grow-1">
                                    <b-form-input id="kw" v-model.trim="search"
                                    placeholder="Enter keyword"/>
                                </b-form-group>
                                <b-button type="submit" variant="info" 
                                class="ml-2 px-2 mb-3" :disabled="loading">
                                    ค้นหา keyword
                                </b-button>
                            </b-row>
                        </b-col>

                        <b-col cols="12" md="5">
                        
                        <b-form-group class="pr-md-3 checkbox-v">
                            <b-form-radio-group v-model="selected" :options="sentimentOptions" />
                        </b-form-group>
                        </b-col>


                        <b-col cols="12" md="4">
                            <b-form-select 
                                v-model="selectedSource" 
                                class="mb-2" 
                                :options="sourceOptions" 
                                :disabled="type === 'targetlist'"
                            />
                        </b-col>

                        <b-col cols="12" md="4">

                        <b-form-select v-model="selectedSort" class="mb-2" :options="[
                            { value: 'descend', text:'โพสต์เก่าสุด' },
                            { value: '', text: 'โพสต์ล่าสุด' },
                            { value: 'engagement', text: 'Engagement' },
                        ]" />

                        </b-col>
                        <b-col cols="12" md="4">
                        <section id="date-picker">
                            <date-picker v-model="valueDate" 
                            type="date" range 
                            placeholder="เลือกช่วงเวลา" 
                            class="w-100" size="sm"
                            :disabled-date="(date) => date >= new Date()" value-type="format" format="YYYY-MM-DD"
                            @change="checkDateRange()" id="date-domain">{{ valueDate }}</date-picker>
                        </section>
                        </b-col>                                                                                                                      
                    </b-row>
                    <b-row align-h="end" class="mt-2" justify="center">
                        <b-col cols="auto" md="auto">
                        <div>
                            <div class="align-self-end mb-3">
                            <!-- <b-button type="submit" variant="info" 
                                class="mr-2 px-4" :disabled="loading">
                                ค้นหา
                            </b-button> -->
                            <b-button variant="outline-secondary" 
                                @click="resetFilters" :disabled="loading">
                                ล้างค่า
                            </b-button>
                            </div>
                        </div>
                        </b-col>
                    </b-row>

                    </b-form>
                </b-card>
            </b-col>
            <!-- <b-col cols="12" class="px-0">
                <b-row class="justify-content-between align-items-center mb-3 mx-0">
                    <b-col cols="12" sm="auto" class="text-left px-0">
                        <h4 class="mb-0">Posts Timeline</h4>
                    </b-col>
                    <b-col cols="12" sm="" class="px-0">
                        <b-row cols="2" class="m-0 w-100 justify-content-sm-end align-items-center" style="gap: 10px;">
                            <b-col sm="auto" class="align-self-end px-0 pt-2">
                                <date-picker
                                    v-model="valueDate"
                                    type="date"
                                    range
                                    placeholder="เลือกช่วงเวลา"
                                    size="sm"
                                    :disabled-date="(date) => date >= new Date()"
                                    value-type="format"
                                    format="YYYY-MM-DD"
                                    id="date-domain"
                                    class="w-100"
                                >
                                    
                                    {{ valueDate }}
                                </date-picker>
                            </b-col>
                            <b-col cols="auto" class="px-0 pt-2 text-center">
                               
                                    <span class="d-none d-md-inline">
                                        เรียงจาก :
                                    </span>
                                    <b-button class="sort-btn" @click="toggleSort" pill size="sm">
                                        {{ selectedSort === 'descend' ? 'เก่า → ใหม่' : 'ใหม่ → เก่า' }}
                                    </b-button>
                                
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </b-col> -->
            <b-col v-if="type === 'hashtaglist'" cols="12" class="px-0 py-2 rounde-lg" :style="{ backgroundColor: !showTimeline ? '#EBFDFF' : '' }">
                <b-row class="m-0 justify-contents-between aling-items-center">
                    <b-col data-v-633a0eda="" class="text-left"> 
                        ทั้งหมด <b data-v-633a0eda="">{{totalTimelinePost || 0 | numFormat}}</b> โพสต์
                    </b-col>
                    <b-col data-v-633a0eda="" class="text-right text-info"> 
                        <b-button v-if="!showTimeline" variant="info" @click="showTimeline = !showTimeline">
                            แสดง timeline
                        </b-button>
                        <b-button v-else variant="outline-info" @click="showTimeline = !showTimeline">
                            ซ่อน timeline
                        </b-button>
                    </b-col>
                </b-row>
            </b-col>
            <b-col v-if="type === 'hashtaglist' && showTimeline" cols="12" class="px-0">
                <Timeline :timelineItems="timelinePosts" :keyword="search"  :disableFabButton="true"/>
                <vue-element-loading 
                    :active="loading" class="h-100" size="80" 
                    background-color="rgba(255, 255, 255, 0.3)"
                    color="#b6ac9a" 
                />
                <b-col v-if="timelinePosts.length > 0 && (next_offset || offset > 0)" class="p-0">
                    <b-row v-if="(timelinePosts.length < totalTimelinePost)" @click="viewMore" class="justify-content-md-center align-items-center my-3 mx-0">
                        <div class="text-center">
                            <b-button class="sort-btn" pill size="sm">
                                ดูเพิ่มเติม
                            </b-button>
                        </div>
                    </b-row>
                    <b-row v-else @click="resetView" class="justify-content-md-center align-items-center my-3 mx-0">
                        <div class="text-center">
                            <b-button class="sort-btn" pill size="sm">
                                ย่อ timeline
                            </b-button>
                        </div>
                    </b-row>
                </b-col>
            </b-col>
        </b-row>

        <!-- posts -->
        <TabPost 
            :source="selectedSource"
            :start="valueDate[0]"
            :end="valueDate[1]"
            :topDomain="topDomain" 
            :isBottom="alreadyAtBottom"
            :keyWord="keyWord"
            :sentiment="selected"
            :sortBy="selectedSort"
            @totalPost="data =>totalPost = data"
            @update:start="data => valueDate = [data, valueDate[1]]"
            @update:end="data => valueDate = [valueDate[0], data]"
            @update-source="data => setHashtagSource(data)"
        />
    </div>
</template>
<script>
import TabDomain from "./profileTabs/_TabDomain.vue"
import TabHashtag from "./profileTabs/_TabHashtag.vue"
import TabPost from "./profileTabs/_TabPost.vue"
import Swal from 'sweetalert2'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import moment from "moment";

import ProfileWordCloud from './profileTabs/_ProfileWordCloud.vue'
import HashtagBarChar from "../chart/HashtagBarChar.vue"
import Timeline from "./_Timeline.vue"

export default {
    components: {
        TabDomain,
        TabHashtag,
        Timeline,
        TabPost,
        Multiselect,
        ProfileWordCloud,
        HashtagBarChar
    },
    data() {
        const today = moment();
        const past7Days = moment().subtract(6, 'days'); // รวมวันนี้ = 7 วัน
        return {
            showTimeline : true,
            showTimelineFilter : true,
            valueDate: [past7Days.format('YYYY-MM-DD'), today.format('YYYY-MM-DD')],
            selectedSource:'all',
            alreadyAtBottom: false,
            type:this.$route.query.type,
            default_avatar: "user.svg",
            load: false,
            loadWordCloud: false,
            loadPost: false,
            data: [],
            profile: {},
            totalPost: 0,
            category: 'domain',
            account_name: null,
            editable: false,
            province_id:null,
            district_id:null,
            subDistrict_id:null,
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
                profile_image: null,
                department: null

            },
            selectedProvince: null,
            selectedDistrict: null,
            selectedSubDistrict: null,
            provinces: [],
            districts:[],
            subDistricts:[],
            sexs: [
                {text: 'ไม่ระบุ', value:'other'},
                {text: 'ชาย', value:'male'},
                {text: 'หญิง', value:'female'},
                {text: 'LGBTQ+', value:'lgbtq+'},
            ],
            topDomain: [],
            topHashtags: [],
            posts: [],
            timelinePosts: [],
            selected: null,
            selectedSort: '',
            loading: false,
            influencerTypes:[],
            speciesTypes:[
                { text: 'บุคคลทั่วไป', value: 'people' },
                { text: 'นักการเมือง', value: 'politician' },
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
            wordcloud_images: [],
            icon:[],
            keyWord: null,
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

            offset: 0,
            next_offset: null,
            totalTimelinePost: 0,
            search: null,
            sentimentOptions: [
                { text: "All", value: null },
                { text: "Positive", value: "1" },
                { text: "Neutral", value: "0" },
                { text: "Negative", value: "-1" }
            ],
            sourceOptions: [
                { value: 'all', text: "All Platform" },
                { value: "facebook", text: "Facebook" },
                { value: "twitter", text: "X" },
                { value: "pantip", text: "Board" },
                { value: "news", text: "News" },
                { value: "youtube", text: "YouTube" },
                { value: "instagram", text: "Instagram"},
                { value: "blockdit", text: "Blockdit"},
                { value: "tiktok", text: "Tiktok" },
                { value: "threads", text: "Threads" }
            ],
            formFilters: {
                sentiment: ["1", "0", "-1"],
                keyword: "",
                view_mode: "posts",
                source: null,
                sort_by: 'desc',
                limit: 50,
                page: 1,
                hashtags: [],
            },
            
        }
    },
    methods: {
        resetFilters() {
            this.timelinePosts = [];
            this.offset = 0;
            this.search = '';
            this.selectedSort = '';
            this.selected = null;

            this.keyWord = '';
            // กำหนดช่วงวันที่ย้อนหลัง 7 วันถึงวันนี้
            const today = moment().format('YYYY-MM-DD');
            const past7Days = moment().subtract(6, 'days').format('YYYY-MM-DD');
            this.valueDate = [past7Days, today]; 
            console.log(this.valueDate);
            if (this.type === 'hashtaglist') {
                this.selectedSource = 'all';
            }
            this.apiTimelineUserPosts();
        },
        formatNumber(num) {
           if (num == null) {
                return '0';
            }
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            }
            if (num >= 1000) {
                return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
            }
            return num.toString();
        },
        async onSearch() {
            this.timelinePosts = [];
            this.offset = 0;
            this.keyWord = this.search;
            if (this.type === 'hashtaglist') {
                await this.apiTimelineUserPosts();
                this.getWordCloudImage();
            }
            console.log('this.timelinePosts ==== ', this.timelinePosts);
            
           
        },
        viewMore() {
            // this.offset += this.limit;
            this.offset = this.next_offset;
            this.apiTimelineUserPosts();
        },
        updateFilterLocation() {
            this.location = this.location; // trigger setter → อัปเดต filterRules.location
        },
        async checkLocation() {
            if (!this.selectedData.location || this.selectedData.location.length === 0 || typeof this.selectedData.location === "string") {
                // console.log("ไม่มีข้อมูล location");
                this.province_id = null;
                this.district_id = null;
                this.subDistrict_id = null;
                this.selectedProvince = null;
                this.selectedDistrict = null;
                this.selectedSubDistrict = null;
                return; // ออกจากฟังก์ชันทันที
            }
            const location = this.selectedData.location;
            // console.log("location ==== ", location);
            // กำหนดค่าพร้อมตรวจว่ามีข้อมูลครบหรือไม่
            this.province_id = location.length >= 1 ? location[0] : null;
            // ถ้ามี province_id → โหลดอำเภอ
            if (this.province_id) {
                this.selectedProvince = await this.getProvinceNameById(this.province_id);
                this.selectedData.province = this.selectedProvince;
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
        handleLocation() {
            if (this.subDistrict_id) {
                this.selectedData.location = this.subDistrict_id;
                this.getProvinceName(this.province_id);
            } else
             if (this.district_id) {
                this.selectedData.location = this.district_id;
                this.getProvinceName(this.province_id);
            }else
            if (this.province_id) {
                this.selectedData.location = this.province_id;
                // if (this.selectedData.province) {
                    
                // }
                this.getProvinceName(this.selectedData.location);
            }
            else {
                this.selectedData.location = null;
            }
            // console.log("selectedData.location === ",  this.selectedData.location);
            
        },
        checkDateRange() {
            const startDate = moment(this.valueDate[0]);
            const endDate = moment(this.valueDate[1]);

            const diffDays = endDate.diff(startDate, 'days');

            if (diffDays > 31) {
                alert('กรุณาเลือกช่วงเวลาที่ไม่เกิน 1 เดือน หรือ 31 วัน');
                this.valueDate[1] = startDate.add(31, 'days').format('YYYY-MM-DD');
            } else {
                this.onSearch();
                // this.offset = 0;
                // this.timelinePosts = [];
                // this.apiTimelineUserPosts();
                
                
                // this.selectDate(); // Call your existing method
            }
        },
        setHashtagSource(source) {
            this.selectedSource = source
            // this.apiMonitorProfile();
            this.offset = 0;
            this.timelinePosts = [];
            this.apiTimelineUserPosts();
            this.getWordCloudImage();
        },
        resetSource() {
            this.selectedSource = 'all'
            
            // this.apiMonitorProfile();
            this.offset = 0;
            this.timelinePosts = [];
            this.apiTimelineUserPosts();
            this.getWordCloudImage();
        },
        setKeyWord(word) {
            this.keyWord = word;
            this.$nextTick(() => {
                const el = document.getElementById('total-post');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                }
            });
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
                // console.log("isAtBottom : true");
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
                    profile_image: this.data.profile_image ?? null,
                    department: p.department ?? null
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
            // console.log('edit/able ', this.editable);
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
        getIcon(id) {
            const found = this.icon.find(item => item.id === id);
            // console.log("found === ",found);
            
            return found && found.icon ? found.icon : "people-fill";
        },
        getsexTh(sex) {
            const found =  this.sexs.find(item => item.value === sex)
            return found ? found.text : 'ไม่ระบุเพศ';
        },
        getInfluencerTypeName(id) {
            const found = this.influencerTypes.find(item => item.value === id)
            return found ? found.text : '-';
        },
        getInfluConditions(value) {
            // console.log(value);
            if (value == null) {
                return '-';
            }
            const found = this.influConditions.find(item => item.value === value);
            // console.log(found);
            
            return found ? found.text : '-';
        },
        getSpeciesName(id) {
            let found =  this.speciesTypes.find(item => item.value === id)
             return found ? found.text : '-';
        },
        getDepartmentType(id) {
            let found =  this.departmentTypes.find(item => item.value === id)
             return found ? found.text : '-';
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
        async getWordCloudImage() {
            this.loadWordCloud = true;
            const isHashtagList = this.$route.query.type === 'hashtaglist';
            let params = {}
            if (isHashtagList) {
                params= {
                    // start_date:"2025-09-05T00:00:00",
                    // end_date: "2025-09-05T23:59:59",
                    start_date: this.valueDate[0]+ "T00:00:00",
                    end_date: this.valueDate[1] + "T23:59:59",
                    ...(this.selectedSource !== 'all' && { source: this.selectedSource }),
                    ...(isHashtagList ? { hashtag: this.$route.query.uid } : { domain: this.$route.query.uid }),
                    // hashtag:this.$route.query.uid.replace(/^#/, ''),
                }
            } else {
                params = {
                    query: this.$route.query.uid.replace(/^#/, ''),
                    api_type: this.$route.query.type?.toLowerCase() === 'targetlist' ? 'account' : 'hashtag',
                    top_type: "domain",
                    source: this.selectedSource,
                    // type: this.$route.query.type,
                    // start_date: this.valueDate[0]+ "T00:00:00",
                    // end_date: this.valueDate[1] + "T23:59:59",
                    // source: this.$route.query.source,
                    // id: this.$route.query.id,
                }
            }
            const config = {
                method: "get",
                url: "https://api.cognizata.com/api/v1/getwordcloud/",
                params: params,
                // params: {
                //     query: this.$route.query.uid.replace(/^#/, ''),
                //     api_type: this.$route.query.type?.toLowerCase() === 'targetlist' ? 'account' : 'hashtag',
                //     top_type: this.$route.query.type?.toLowerCase() === 'targetlist' ? 'domain' : 'hashtag',
                //     // type: this.$route.query.type,
                //     source: this.selectedSource,
                //     // source: this.$route.query.source,
                //     // id: this.$route.query.id,
                // },
                
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };
            // console.log(config.params);
            
            this.axios(config)
            .then((response) => {
                this.wordcloud_images = response.data.img || [];
                // console.log('this.wordcloud_images ', this.wordcloud_images);
                this.loadWordCloud = false;
            })
            .catch((error) => {
                this.loadWordCloud = false;
                // console.error(error);
            });
        },
        async apiMonitorProfile() {
            this.load = true;
            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/monitor/getProfile",
                params: {
                    type: this.$route.query.type,
                    source: this.selectedSource,
                    // source: this.$route.query.source,
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
                // console.log('this.data ', this.data);
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
                // console.log('this.profile ', this.profile);
                this.checkProfile();
                this.checkLocation();
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
            this.selectedProvince = await this.getProvinceNameById(this.province_id);
            this.selectedData.province = this.selectedProvince;
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
                this.icon = result;
                this.influencerTypes = result.map(type => ({
                    value: type.id,
                    text: type.name
                }));
                // this.provinces = result.map(province => ({
                //     text: province.name_th,
                //     value: province.id
                // }));
                // console.log(this.icon);
                
                // console.log('this.influencerTypes ===== ', this.influencerTypes);
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
                // console.error(error);
            });
        },
        apiUpdateProflie() {
            // this.handleLocation();
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
                // console.log(response);
                let result = response.data || [];
                
                this.load = false;
                this.editProfile();
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
        async apiTimelineUserPosts() {
            // console.log('apiTimelineUserPosts called');
            const isHashtagList = this.$route.query.type === 'hashtaglist';
            const targetApi = 'https://api2.cognizata.com/api/v2/userposts/getSentimentdetail/';
            const hashtagApi = 'https://api2.cognizata.com/api/v2/userposts/getSentimentDetailDomain/';
            this.loading = true;
            const config = {
                method: "get",
                url: isHashtagList ? hashtagApi : targetApi,
                // url: "https://api2.cognizata.com/api/v2/userposts/getSentimentDetailDomain/",
                //url: "https://api.cognizata.com/api/v1/getsentimentdetail/",
                params: {
                    // account: this.$route.query.uid,
                    // querySearch: this.search,
                    ...(isHashtagList ? { hashtags: this.$route.query.uid } : { account: this.$route.query.uid }),
                    ...(this.selectedSource !== 'all' ? { source: this.selectedSource } : {}), // ✅ ลบ key ถ้า source = 'all'
                    ...(this.keyWord ? { querySearch: this.keyWord } : {}), // ✅ ใส่ query เฉพาะเมื่อมีค่า
                    sort_by: this.selectedSort,
                    sentiment: this.selected,
                    offset: this.offset,
                    start_date: this.valueDate[0]+ "T00:00:00",
                    end_date:this.valueDate[1] + "T23:59:59"
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            this.axios(config)
            .then((response) => {
                // console.log(response);
                
                const newData = response.data?.data || [];
                // this.total = response.data?.count || 0;
                this.totalTimelinePost = response.data?.count || 0;
                this.loading = false;
                this.next_offset = response.data.next_offset || null;
                // กรองเอาโพสต์ใหม่ที่ยังไม่มีใน this.timelinePosts
                if (response.data.next_offset) {
                    this.offset = response.data.next_offset
                }
                // เพิ่ม showAll = false แล้วรวมกับ posts เดิม
                const newPostsWithFlag = newData.map(post => ({
                    ...post,
                    showAll: false,
                }));

                this.timelinePosts = [...this.timelinePosts, ...newPostsWithFlag];
                // this.timelinePosts =  newPostsWithFlag;
                // this.$emit('totalPost', this.total);
            })
            .catch((error) => {
                this.loading = false;
                this.timelinePosts = [];
                // console.error(error);
            });
        }, 
        toggleSort() {
            this.selectedSort = this.selectedSort === "" ? "descend" : "";
            this.timelinePosts = [];
            this.offset = 0;
            this.apiTimelineUserPosts();
        },
        resetView() {
            this.timelinePosts = [];
            this.offset = 0;
            this.apiTimelineUserPosts();
        }
    },
    async mounted() {
        if (this.$route.query.type === 'targetlist') {
            this.profile.uid = this.$route.query.uid
            this.selectedSource = this.$route.query.source;
            // await this.apiTimelineUserPosts();
            // await this.getWordCloudImage();
        }else if (this.$route.query.type === 'hashtaglist') {
            this.selectedSource = 'all'
            await this.apiTimelineUserPosts();
        }
        await this.apiMonitorProfile();
        this.apiGetProvinces();
        this.apiGetInfluencerType();
        await this.getWordCloudImage();
        // await this.apiTimelineUserPosts();
        // console.log('this.selectedSource ==== ',this.selectedSource);
    },
    computed: {
        location: {
            get() {
            if (!this.province_id && !this.district_id && !this.subDistrict_id) {
                return [];
            }
            return [
                this.province_id,
                this.district_id,
                this.subDistrict_id
            ].filter(v => v != null);
            },
            set(newVal) {
                this.selectedData.location = newVal;
            }
        }
    },
    watch: {
        // ทุกครั้งที่ตัวเลือกเปลี่ยน ให้ location (computed) อัปเดต filterRules.location
        province_id: 'updateFilterLocation',
        district_id: 'updateFilterLocation',
        subDistrict_id: 'updateFilterLocation',
        selected: {
            handler(newVal) {
                if (this.type === 'hashtaglist') {
                    this.onSearch();
                }
            }
        },
        selectedSort:{
            handler(newVal) {
                if (this.type === 'hashtaglist') {
                    this.onSearch();
                }
            }
        },
        selectedSource: {
            handler(newVal) {
                if (this.type === 'hashtaglist') {
                    this.onSearch();
                }
            }
        }
        // valueDate: {
        //     deep: true, // เฝ้าการเปลี่ยนแปลงภายใน array
        //     handler(newVal, oldVal) {
        //         console.log("valueDate timeline changed:", newVal);
        //         if (newVal !== oldVal) {
        //             // this.timelinePosts = [];
        //             // this.offset = 0;
        //             const startDate = moment(this.valueDate[0]);
        //             const endDate = moment(this.valueDate[1]);

        //             const diffDays = endDate.diff(startDate, 'days');

        //             if (diffDays > 31) {
        //                 alert('กรุณาเลือกช่วงเวลาที่ไม่เกิน 1 เดือน หรือ 31 วัน');
        //                 this.valueDate[1] = startDate.add(31, 'days').format('YYYY-MM-DD');
        //             } else {
        //                 this.offset = 0;
        //                 this.timelinePosts = [];
        //                 if (this.type === 'hashtaglist') {
        //                     // this.onSearch();
        //                     // this.apiTimelineUserPosts();
        //                 }
        //                 this.getWordCloudImage();
        //                 // this.selectDate(); // Call your existing method
        //             }
        //         }
        //         // this.checkDateRange()
        //     }
        // }
    },
}
</script>

<style scoped>

.badge-male {
    color: #17a2b8; /* สี info */
    border: 1px solid #17a2b8;
    background-color: transparent;
}
.badge-female {
    color: #d29090; /* สี info */
    border: 1px solid #ffbcbc;
    background-color: transparent;
}
.badge-custom{
    color: #2c3e50;
    background: linear-gradient(90deg,#FDD071  0%,  #ffbcbc 100%);
}
.sort-btn{
    background: linear-gradient(90deg,#FDD071 0%, #ffbcbc 100%);
    border: none;
    color: #2c3e50; /* ให้ตัวอักษรอ่านง่าย */
    font-weight: bold;
}
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
    /* color: white; */
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
    /* bottom: 10%; */
    /* right: 5%; */
    top: 90px;
}
.right{
    position: absolute;
    bottom: 10%; 
    right: 0px;
};
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
.mx-datepicker-range {
    width: 100%!important;
}
@media only screen and (min-width: 0px) and (max-width: 450px) {
    .right{
        right: 20%;
    }

}
@media only screen and (min-width: 451px) and (max-width: 575px) {
    .right{
        right: 30%;
    }

}
@media only screen and (min-width: 0px) and (max-width: 800px){
    .mx-datepicker-range {
        width: 100%!important;
    }

}


@media only screen and (min-width: 768px) and (max-width: 1200px){
.mx-datepicker-range {
    width: 185px !important;
}

}
</style>