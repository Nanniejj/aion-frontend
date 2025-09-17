<template>
    <div>
        <!-- {{getListMonitorProfile.targetlist.length}} -->
        <!-- <button class="btn btn-add mt-0 w-100" @click="open = true">
            <i class="fa fa-plus" />
            <span style="font-size: 16px">
                เพิ่มกลุ่ม
            </span>
        </button> -->

        <vue-modaltor :visible="openModal" @hide="hideModal" :animation-panel="'modal-slide-top'"
            :resize-width="{ 3000: '50%', 1350: '80%', 768: '90%' }"
        >
            <!-- :resize-width="{ 3000: '80%', 1350: '80%', 768: '90%' }" -->
            <!-- :resize-width="{ 3000: '99%', 1350: '90%', 768: '90%' }" -->
            <b-col cols="12" class="p-0">
                <h5 class="m-0 fs-5 fs-sm-4 fs-md-3">กลุ่ม<span>{{ groupName }}</span></h5>
                <span>จำนวนสมาชิก : {{ targetlist.length }} บัญชี</span>
                <hr />
            </b-col>


            <!-- body -->
            <b-row cols="2" cols-sm="3" cols-md="4" class="m-0 modal-body-scrollable p-0">
                <!-- create new Groups dashed-border-->
                <b-col v-for="target in targetlist" :key="target.id" class="px-0 mb-3">
                    <b-row class="m-0 text-center align-items-center">
                        <b-col cols="12" class="px-1 mb-2">
                            <b-avatar style="cursor: pointer;" :src="target.image">
                                <img @click="linkToProfile(target)" v-if="target.source == 'facebook'" src="@/assets/Facebook.png" class="social-img" />
                                <img @click="linkToProfile(target)" v-if="target.source == 'twitter'" src="@/assets/Twitter.png" class="social-img" />
                                <img @click="linkToProfile(target)" v-if="target.source == 'pantip'" src="@/assets/board.png" class="social-img" />
                                <img @click="linkToProfile(target)" v-if="target.source == 'blockdit'" src="@/assets/Blockdit.png" class="social-img" />
                                <img @click="linkToProfile(target)" v-if="target.source == 'instagram'" src="@/assets/Instagram.png" class="social-img" />
                                <img @click="linkToProfile(target)" v-if="target.source == 'youtube'" src="@/assets/Youtube.png" class="social-img" />
                                <img @click="linkToProfile(target)" v-if="target.source == 'news'" src="@/assets/News.png" class="social-img" />
                                <img @click="linkToProfile(target)" v-if="target.source == 'tiktok'" src="@/assets/Tiktok.png" class="social-img" />
                                <img @click="linkToProfile(target)" v-if="target.source == 'threads'" src="@/assets/Threads.png" class="social-img" />
                            </b-avatar>
                            
                        </b-col>
                        <b-col class="text-truncate">
                            {{ target.name || target.uid || 'N/A' }}
                        </b-col>
                    </b-row>
                </b-col>
                    
            </b-row>

            <!-- footer -->
            <!-- <b-row class="m-0 justify-content-end">
                <b-col cols="auto">
                    <b-button @click="clear" size="sm" variant="outline-danger">
                        <i class="fa fa-eraser" aria-hidden="true"></i>
                        clear
                    </b-button>

                </b-col>
                <b-col cols="auto">
                    <b-button :disabled="!readyToSave" @click="addNewGroup" class="btn btn-save" size="sm">
                        บันทึก
                    </b-button>
                </b-col>
            </b-row> -->
        </vue-modaltor>
    </div>
</template>

<script>

// import CardInput from "./_CardInput.vue";

import Swal from 'sweetalert2'
export default {
    components: {
        // CardInput
    },
    props: {
        openModal: {
            type: Boolean,
            default: false
        },
        targetlist: {
            type: Array,
            default: () => ([])
        },
        groupName: {
            type: String,
            default: ''
        }
    },

    computed: {
        readyToSave() {
            return this.groups.every(item => item.name && item.group_type) && this.groups.length > 0;
        }
    },
    data() {
        return {
            selectedGroups: {},
            newGroups: { name: "", group_type: null },
            groups: [],
            targetLists: [],
            open: false,
            totalRows: 0,
            currentPage: 1,
            perPage: 10,
            search: '',
            options: [
                { value: null, text: 'ระบุประเภท' },
                { value: "group", text: 'กลุ่ม' },
                { value: "person", text: 'บุคคล' },
                { value: "organization", text: 'องค์กร' },
            ]
        };
    },
    methods: {
        linkToProfile(item) {
            const routeData = this.$router.resolve({
                name: "MonitorProfile",
                query: {
                    id: item._id,
                    uid: item.uid?.replace('#', ''),  // ลบ '#' ออกถ้ามี
                    source: item.source,
                    type: 'targetlist'
                },
            });
            window.open(routeData.href, "_blank"); // เปิดลิงก์ในหน้าต่างใหม่
        },
        state(name) {
            const trimmedName = name.trim()
            // ยังไม่ได้กรอกอะไร → ยังไม่ validate
            if (trimmedName.length === 0) {
                return false
            }
            return true
        },
        stateType(type) {
            if (!type) {
                return false
            }
            return true
        },
        invalidFeedback(name) {
            if (name.trim().length === 0) {
                return "Please enter your group name."
            }
            return ""
        },
        deleteGroup(index) {
            this.groups.splice(index, 1);
        },
        addGroup() {
            this.groups.push(
            {
                name: this.newGroups.name,
                group_type: this.newGroups.group_type
            });
            this.newGroups = { name: "", group_type: null };
        },
        clear() {
            this.groups = [];
        },
        hideModal() {
            // this.addGroup = false;
            // this.openModal = false;
            this.$emit("close");
        },
    },
    async mounted() {30
        // await this.apiMonitorList();
    },
};
</script>

<style scoped>
    .modal-body-scrollable {
        /* min-height: 70vh; */
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
    .social-img {
        width: 45px;
    }
    .gradient-bg {
        background: linear-gradient(90deg, #fed06ea4, #ffe6e6);
    }
    .sort-btn{
        background: linear-gradient(90deg,#FDD071 0%, #ffbcbc 100%);
        border: none;
        color: #2c3e50; /* ให้ตัวอักษรอ่านง่าย */
        font-weight: bold;
    }
</style>
