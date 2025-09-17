<template lang="">
    <div class="py-3 mt-3">
        <b-row cols="2" class="align-items-center mb-3 mx-0" align-h="between">
            <b-col cols="12" md="auto" class="">
                <div class="d-flex flex-wrap justify-content-start align-items-center">
                    <b-avatar text="All" size="45" style="background-color: #fed16e;"></b-avatar>
                    <div class="col-auto bold align-content-center" style="font-size: 20px;">
                        123 Communities
                    </div>
                    <b-form-group class="d-block d-lg-none align-items-center mb-0" v-slot="{ ariaDescribedby }">
                        <b-form-radio-group
                            id="radio-group-2"
                            v-model="selected"
                            :aria-describedby="ariaDescribedby"
                            name="radio-sub-component"
                        >
                            <b-form-radio v-for="item in options" :key="'item - ' + item.text" :value="item.value">{{item.text}}</b-form-radio>
                        </b-form-radio-group>
                    </b-form-group>
                </div>
            </b-col>
            <b-col cols="12" sm="" lg="auto">
                <div class="d-flex flex-wrap justify-content-end align-items-center">
                    <b-form-group class="d-none d-lg-block align-items-center mb-0" v-slot="{ ariaDescribedby }">
                        <b-form-radio-group
                            id="radio-group-2"
                            v-model="selected"
                            :aria-describedby="ariaDescribedby"
                            name="radio-sub-component"
                        >
                            <b-form-radio v-for="item in options" :key="'item - ' + item.text" :value="item.value">{{item.text}}</b-form-radio>
                        </b-form-radio-group>
                    </b-form-group>
                    <!-- <CreateMonitor class="col col-md-auto px-0" :class="{'w-100':type == 'hashtaglist'}" :tabsMonitor="type" @close="reload"/> -->
                    <b-form-group label-for="search-input" class="mt-3 mt-xl-0 mr-md-2 px-0 mb-0 ">
                        <b-input-group-append>
                            <b-form-input id="search-input" @input="checkSearch" v-model="search" placeholder="ค้นหา"
                                class="mr-2"></b-form-input>
                            <b-button variant="info" pill :pressed="false" @click="onSearch()"
                                class="shadow-r px-4">ค้นหา</b-button>
                        </b-input-group-append>
                    </b-form-group>
                    <b-col cols="12" sm="" class="px-0 ml-sm-2">
                        <CreateCommunityModal />
                    </b-col>
                </div>
            </b-col>
            <b-col cols="12" class="mt-3">
                <div  class="boxlist-card pb-1">
                <!-- <br> -->
                <vue-element-loading :active="load" size="80" 
                background-color="rgba(255, 255, 255, 0.3)" 
                color="#ede7dd" />
                    <b-table
                        v-if="communities.length !== 0"
                        show-details
                        :items="communities"
                        hover
                        responsive
                        :busy="load"
                        :striped="true"
                        :bordered="false"
                        empty-filtered-text="ไม่พบข้อมูล"
                        stacked="md"
                        headless
                    >
                        <!-- ลำดับ -->
                        <template #cell(no)="data">
                            {{ data.index + 1 + (currentPage - 1) * perPage }}
                        </template>

                        <!-- ชื่อ Community -->
                        <template #cell(name)="data">
                        <b-col class="text-left text-truncate">
                            {{ data.item.name }}
                        </b-col>
                        </template>

                        <!-- จำนวนสมาชิก -->
                        <template #cell(members)="data">
                        {{ data.item.members.toLocaleString() }} คน
                        </template>

                        <!-- ผู้ดูแล (array) -->
                        <template #cell(admins)="data">
                        <b-avatar-group size="32px">
                            <b-avatar
                                v-for="(admin, index) in data.item.admins"
                                :key="index"
                                variant="info"
                                :text="admin.charAt(0).toUpperCase()"
                                v-b-tooltip.hover
                                :title="admin"
                            />
                            </b-avatar-group>
                        </template>

                        <!-- ประเภท -->
                        <template #cell(type)="data">
                        <b-badge :variant="data.item.type === 'public' ? 'success' : 'warning'">
                            {{ data.item.type }}
                        </b-badge>
                        </template>

                        <!-- Platform -->
                        <template #cell(platform)="data">
                        <img
                            v-if="data.item.platform === 'Facebook'"
                            src="@/assets/Facebook.png"
                            class="social-imgs"
                        />
                        <!-- <img
                            v-else-if="data.item.platform === 'Discord'"
                            src="@/assets/Discord.png"
                            class="social-img"
                        />
                        <img
                            v-else-if="data.item.platform === 'LinkedIn'"
                            src="@/assets/Linkedin.png"
                            class="social-img"
                        /> -->
                        <span v-else>{{ data.item.platform }}</span>
                        </template>

                        <!-- จำนวนโพสต์ -->
                        <template #cell(posts)="data">
                        {{ data.item.posts }}
                        </template>

                        <!-- จำนวนเอนเกจเมนต์ -->
                        <template #cell(engagements)="data">
                            {{ data.item.engagements }}
                        </template>

                        <!-- โลเคชั่น -->
                        <template #cell(location)="data">
                        {{ data.item.location }}
                        </template>

                        <!-- Action -->
                        <template #cell(action)="data">
                        <span
                            class="fas fa-list-ul text-info px-2"
                            v-b-tooltip.hover
                            title="ดูรายละเอียด"
                            @click="toggleDetails(data)"
                        ></span>
                        </template>

                    
                </b-table>
            </div>
            </b-col>

        </b-row>
    </div>
</template>
<script>
import CreateCommunityModal from './_CreateCommunityModal.vue';
export default {
    components: {
        CreateCommunityModal
    },
    data() {
        return {
            search: '',
            selected: 'all',
            currentPage: 1,
            options: [
                { text: 'ทั้งหมด', value: 'all' },
                { text: 'กลุ่มปิด', value: 'private' },
                { text: 'กลุ่มสาธารณะ', value: 'public' }
            ],
            fields: [
                { key: "no", label: "ลำดับ" },
                { key: "name", label: "ชื่อ Community" },
                { key: "members", label: "จำนวนสมาชิก" },
                { key: "admins", label: "ผู้ดูแล" },
                { key: "type", label: "ประเภท" },
                { key: "platform", label: "แพลตฟอร์ม" },
                { key: "posts", label: "จำนวนโพสต์" },
                { key: "engagements", label: "จำนวนเอนเกจเมนต์" },
                { key: "location", label: "โลเคชั่น" }
            ],
            communities: [
                {
                    name: "Vue.js Developers Thailand",
                    members: 15000,
                    admins: ["Somchai", "Aom", "Krit"],
                    type: "public",
                    platform: "Facebook",
                    posts: 1200,
                    engagements: 35000,
                    location: "Bangkok, Thailand"
                },
                {
                    name: "Web Dev Freelancers",
                    members: 8200,
                    admins: ["Nok", "Preecha"],
                    type: "private",
                    platform: "Discord",
                    posts: 500,
                    engagements: 12000,
                    location: "Chiang Mai, Thailand"
                },
                {
                    name: "Digital Marketing Hub",
                    members: 22000,
                    admins: ["May", "Ton", "Beer"],
                    type: "public",
                    platform: "Facebook",
                    posts: 2000,
                    engagements: 68000,
                    location: "Bangkok, Thailand"
                },
                {
                    name: "AI & Machine Learning SEA",
                    members: 11000,
                    admins: ["Alice", "Bob"],
                    type: "public",
                    platform: "LinkedIn",
                    posts: 900,
                    engagements: 25000,
                    location: "Singapore"
                }
            ]
        }
    },
    methods: {
        checkSearch() {

        },

    },
}
</script>
<style scoped>
.social-imgs {
    width: 35px;
}

.boxlist-card {

    border: 0px;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
    border-radius: 15px;
    min-height: 400px;
}
</style>