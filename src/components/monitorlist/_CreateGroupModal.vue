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
        :resize-width="{ 3000: '80%', 1350: '80%', 768: '90%' }"
        >
        <!-- :resize-width="{ 3000: '50%', 1350: '80%', 768: '90%' }" -->
            <!-- :resize-width="{ 3000: '99%', 1350: '90%', 768: '90%' }" -->
            <div>
                <h5><b>เพิ่มกลุ่มบัญชี</b></h5>
                <hr />
            </div>
            <div>
                <b-alert show>การเลือกประเภทของกลุ่มบัญชี <br />
                    ประเภท<b>กลุ่ม</b>: จัดกลุ่มบัญชีที่ทำ<b>กิจกรรมคล้ายกัน</b>,
                    ประเภท<b>บุคคล</b>: จัดกลุ่มบัญชีที่เป็น<b>บุคคลเดียวกัน</b>แต่คนละ platform, 
                    ประเภท<b>องค์กร</b>: จัดกลุ่มบัญชีที่เป็น<b>องค์กรเดียวกัน</b>แต่คนละ platform
                </b-alert>
            </div>
            <!-- body -->
            <b-row cols="1" cols-xl="2" class="my-1 mx-0">
                <!-- create new Groups dashed-border-->
                <b-col class="px-0">
                    <b-row class="m-0 mb-2 text-right">
                        <b-col>
                            <b-button variant="info" @click="addGroup" class="">
                                <i class="fa fa-plus mr-1" />
                                <span>เพิ่มกลุ่ม</span>
                            </b-button>
                        </b-col>
                    </b-row>
                    <!-- {{ targetLists }} -->
                    <b-row v-if="groups.length > 0" cols="1" class="m-0 modal-body-scrollable" style="max-height: 65vh;">
                        <b-col v-for="(group, index) in groups" :key="index" class="mb-2 px-0">
                            <b-card 
                                bg-variant="white" text-variant="" 
                                class="card-target mb-2"
                                :class="[{
                                    'is-selected': group === selectedGroup
                                }]"
                                
                            >
                                <b-card-text>
                                    <b-row class="m-0 justify-content-end">
                                        <i class="fa fa-close text-danger" @click="deleteGroup(group, index)" style="font-size:24px;cursor: pointer;"></i>
                                    </b-row>
                                    <b-row class="align-items-center m-0">
                                        <b-col cols="12" sm="auto" class="text-center mb-2 px-0">
                                            <b-avatar :text="index + 1" style="background-color: #fed16e;"></b-avatar>
                                        </b-col>
                                        <b-col cols="12" sm="" class="px-0 px-md-2">
                                            <b-row cols="1" cols-sm="2" class="m-0">
                                                <b-col class="px-0  px-sm-2">
                                                    <b-form-group id="fieldset-1" label="ชื่อกลุ่ม" label-for="input-1"
                                                        :invalid-feedback="invalidFeedback(group.name)"
                                                        :state="state(group.name)">
                                                        <b-form-input id="input-1"  @click.stop v-model="group.name" trim></b-form-input>
                                                    </b-form-group>
                                                </b-col>
                                                <b-col @click.stop class="px-0">
                                                    <b-form-group label="ประเภท" label-for="type-select">
                                                        <b-form-select v-model="group.group_type"
                                                            :options="options" class="mb-3" value-field="value"
                                                            text-field="text" disabled-field="notEnabled"
                                                            :state="stateType(group.group_type)"></b-form-select>
                                                    </b-form-group>
                                                </b-col>
                                            </b-row>
                                        </b-col>
                                    </b-row>
                                    <b-row v-if="selectedGroup !== group" class="m-0 justify-content-end">
                                        <b-button size="sm" pill :pressed="false" @click="setSelectedGroup(group)"
                                            class="shadow-r ml-2 add-btn">
                                            <div class="d-flex align-items-center">
                                                <i class="fa fa-user-plus mr-2"></i> เพิ่มสมาชิกกลุ่ม
                                            </div>
                                        </b-button>
                                    </b-row>
                                    <hr/>
                                    <b-row v-if="selectedGroup == group && Object.keys(selectedGroup).length > 0" class="m-0 mb-2 justify-content-between align-items-center">
                                        <b-col cols="auto" class="px-0 text-info">
                                            <span>เพิ่มบัญชีที่ไม่อยู่ใน monitor</span>
                                        </b-col>
                                    </b-row>
                                    <b-row v-if="selectedGroup == group && Object.keys(selectedGroup).length > 0" class="m-0 mb-2">
                                        <b-col class="px-0">
                                            <b-form-group label="URL">
                                                <b-form-input 
                                                    v-model="newTarget.link_original"
                                                    type="url"
                                                    placeholder="Enter URL"
                                                    required
                                                    pattern="https?://.+"
                                                ></b-form-input>
                                            </b-form-group>
                                        </b-col>
                                        <b-col class="pr-0">
                                            <b-form-group label="platform" label-for="type-select">
                                                <b-form-select aria-atomic="false" v-model="newTarget.source"
                                                    :options="sourceOptions" class="" value-field="value"
                                                    text-field="text" disabled-field="notEnabled"
                                                ></b-form-select>
                                            </b-form-group>
                                        </b-col>
                                    </b-row>
                                    <b-col v-if="selectedGroup == group && Object.keys(selectedGroup).length > 0" cols="12" class="p-0 text-right">
                                        <b-button variant="info" :disabled="!newTarget.link_original || !newTarget.source" size="sm" pill :pressed="false" @click="handleNewTarge"
                                            class="shadow-r ml-2 ">
                                            <div class="d-flex align-items-center">
                                                เพิ่มบัญชี
                                            </div>
                                        </b-button>
                                    </b-col>
                                    <!-- <b-row v-else class="m-0 justify-content-end">
                                        <b-button size="sm" v-b-tooltip.hover title="บันทึกร่าง" variant="success" :pressed="false" @click="saveDraft(group)"
                                            class="shadow-r mr-2">
                                            <div class="d-flex align-items-center">
                                                <i class="fa fa-save"></i>
                                            </div>
                                        </b-button>
                                        <b-button size="sm" v-b-tooltip.hover title="ยกเลิก" variant="danger" :pressed="false" @click="deleteDraft(group)"
                                            class="shadow-r ">
                                            <div class="d-flex align-items-center">
                                                <i class="fa fa-close"></i>
                                            </div>
                                        </b-button>
                                    </b-row> -->
                                </b-card-text>
                                <template #footer>
                                    <div>
                                        <b-row class="d-flex p-0 pb-2">
                                            <b-col>สมาชิกในกลุ่ม ({{ (group.targets.length || 0) | numFormat }})</b-col>
                                            <!-- <b-col v-if="group.show && group.targets" @click="group.show = false" class="text-right text-info">
                                                ซ่อน {{ group.show }}
                                            </b-col>
                                            <b-col v-if="!group.show && group.targets" @click="group.show = true" class="text-right text-info">
                                                แสดง {{ group.show }}
                                            </b-col> -->
                                        </b-row>
                                        <b-row cols="1" class="m-0">
                                            <b-col class="mb-2 px-2" v-for="target in group.targets" :key="target.id" >
                                                <b-card
                                                    bg-variant="white" text-variant=""
                                                    class="card-target mb-2 h-100" body-class="px-2 pt-0 pb-2"
                                                >
                                                    <b-card-text class="h-100">
                                                        <b-row class="m-0 flex-nowrap h-100">
                                                            <b-col cols="auto" class="p-0">
                                                                <b-avatar rounded="bottom" :src="target.profile_image" v-if="target && target.profile_image">
                                                                </b-avatar>
                                                                <b-avatar rounded="bottom" :src="target.profile_image" v-else> </b-avatar>
                                                            </b-col>
                                                            <b-col class="text-left p-2 w-50">
                                                                <span>{{ target.name || target.uid }}</span>
                                                                <div class="d-flex">
                                                                    <a @click.prevent="openLink(target.url)" class="text-truncate d-block text-info">
                                                                        {{ target.url }}
                                                                    </a>
                                                                </div>
                                                            </b-col>
                                                            <b-col cols="auto" class="p-0 text-right">
                                                                <b-row cols="1" class="m-0 h-100 justify-content-end">
                                                                    <b-col align-self="end" class="p-0 text-right">
                                                                        <b-avatar class="" size="25px" :src="target.image">
                                                                            <img @click="openLink(target.url)" v-if="target.source == 'facebook'" src="@/assets/Facebook.png" class="platform-imgs" />
                                                                            <img @click="openLink(target.url)" v-if="target.source == 'twitter'" src="@/assets/Twitter.png" class="platform-imgs" />
                                                                            <img @click="openLink(target.url)" v-if="target.source == 'pantip'" src="@/assets/board.png" class="platform-imgs" />
                                                                            <img @click="openLink(target.url)" v-if="target.source == 'blockdit'" src="@/assets/Blockdit.png" class="platform-imgs" />
                                                                            <img @click="openLink(target.url)" v-if="target.source == 'instagram'" src="@/assets/Instagram.png" class="platform-imgs" />
                                                                            <img @click="openLink(target.url)" v-if="target.source == 'youtube'" src="@/assets/Youtube.png" class="platform-imgs" />
                                                                            <img @click="openLink(target.url)" v-if="target.source == 'news'" src="@/assets/News.png" class="platform-imgs" />
                                                                            <img @click="openLink(target.url)" v-if="target.source == 'tiktok'" src="@/assets/Tiktok.png" class="platform-imgs" />
                                                                            <img @click="openLink(target.url)" v-if="target.source == 'threads'" src="@/assets/Threads.png" class="platform-imgs" />
                                                                        </b-avatar>
                                                                    </b-col>
                                                                </b-row>
                                                            </b-col>
                                                        </b-row>
                                                    </b-card-text>
                                                </b-card>
                                            </b-col>
                                        </b-row>
                                    </div>
                                </template>
                            </b-card>
                        </b-col>
                    </b-row>
                    <b-row v-else class="m-0 justify-content-center align-items-center dashed-border" style="height: 50vh;">
                        <b-col class="text-center">
                            <span class="text-muted">- กรุณากดปุ่ม <span class="text-info">"เพิ่มกลุ่ม"</span> เพื่อสร้างกลุ่ม -</span>
                        </b-col>
                    </b-row>
                </b-col>

                <!-- show targetlist -->
                <b-col v-if="selectedGroup && Object.keys(selectedGroup).length > 0" class="">
                    
                    <b-row class="m-0 mb-2">
                        <b-col cols="auto" class="d-flex pl-0 text-info justify-content-between align-items-center">
                            <span>รายชื่อบัญชีใน monitor ที่แนะนำ</span>
                        </b-col>
                        <b-col class="p-0 d-flex justify-content-end">
                            <b-form-input v-model="search" placeholder="ค้นหา" class="" ></b-form-input>
                            <b-button size="sm" variant="info" pill :pressed="false" @click="apiMonitorList"
                                class="shadow-r ml-2">
                                <div class="d-flex align-items-center">
                                    <i class="fa fa-search mr-2"></i> ค้นหา
                                </div>
                            </b-button>
                        </b-col>
                    </b-row>
                    <b-row cols="1" class="m-0 modal-body-scrollable" style="max-height: 50vh;">
                        <b-col class="mb-2 px-2" v-for="target in targetLists" :key="target.id" >
                            <b-card
                                bg-variant="white" text-variant=""
                                class="card-target mb-2 h-100" body-class="px-2 pt-0 pb-2"
                                @click="handleTargetList(target)"
                            >
                                <b-card-text class="h-100">
                                    <b-row class="m-0 flex-nowrap h-100">
                                        <b-col cols="auto" class="p-0">
                                            <b-avatar rounded="bottom" :src="target.profile_image" v-if="target && target.profile_image">
                                            </b-avatar>
                                            <b-avatar rounded="bottom" :src="target.profile_image" v-else> </b-avatar>
                                        </b-col>
                                        <b-col class="text-left p-2 w-50">
                                            <span>{{ target.name || target.uid }}</span>
                                            <div class="d-flex">
                                                <a @click.prevent="openLink(target.link_original)" class="text-truncate d-block text-info">
                                                    {{ target.link_original }}
                                                </a>
                                            </div>
                                        </b-col>
                                        <b-col cols="auto" class="p-0 text-right">
                                            <b-row cols="1" class="m-0 h-100 justify-content-end">
                                                <b-col align-self="end" class="p-0 text-right">
                                                    <b-avatar class="" size="25px" :src="target.image">
                                                        <img @click="openLink(target.link_original)" v-if="target.source == 'facebook'" src="@/assets/Facebook.png" class="platform-imgs" />
                                                        <img @click="openLink(target.link_original)" v-if="target.source == 'twitter'" src="@/assets/Twitter.png" class="platform-imgs" />
                                                        <img @click="openLink(target.link_original)" v-if="target.source == 'pantip'" src="@/assets/board.png" class="platform-imgs" />
                                                        <img @click="openLink(target.link_original)" v-if="target.source == 'blockdit'" src="@/assets/Blockdit.png" class="platform-imgs" />
                                                        <img @click="openLink(target.link_original)" v-if="target.source == 'instagram'" src="@/assets/Instagram.png" class="platform-imgs" />
                                                        <img @click="openLink(target.link_original)" v-if="target.source == 'youtube'" src="@/assets/Youtube.png" class="platform-imgs" />
                                                        <img @click="openLink(target.link_original)" v-if="target.source == 'news'" src="@/assets/News.png" class="platform-imgs" />
                                                        <img @click="openLink(target.link_original)" v-if="target.source == 'tiktok'" src="@/assets/Tiktok.png" class="platform-imgs" />
                                                        <img @click="openLink(target.link_original)" v-if="target.source == 'threads'" src="@/assets/Threads.png" class="platform-imgs" />
                                                    </b-avatar>
                                                </b-col>
                                            </b-row>
                                        </b-col>
                                    </b-row>
                                </b-card-text>
                            </b-card>
                        </b-col>
                    </b-row>
                    <b-col cols="12" align-self="end">
                        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="center" class="my-2"
                        @input="onPageChange"/>
                    </b-col>
                </b-col>
                <b-col v-else >
                    <b-row  class="m-0 justify-content-center align-items-center" style="min-height:40vh;">
                        <b-col class="text-center mt-5">
                            <span class="text-muted">- กรุณาเลือกกลุ่มก่อนเพิ่มสมาชิก -</span>
                        </b-col>
                    </b-row>
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
                    <b-button :disabled="!readyToSave" @click="addNewGroup" class="btn btn-save" size="sm">
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
        // CardInput
    },
    props: {
        // missingTargets: {
        //     type: Object,
        //     default:() => ({})
        // }
    },

    computed: {
        readyToSave() {
            return this.groups.every(item => item.name && item.group_type) && this.groups.length > 0;
        },
    },
    data() {
        return {
            selectedGroup: {},
            newGroups: { name: "", group_type: null, targets: [] },
            newTarget: {link_original: "", source: null},
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
        };
    },
    methods: {
        handleTargetList(target) {
            let newTarget = {
                profile_image: target.profile_image || null,
                name: target.name || null,
                uid : target.uid || null,
                url: target.link_original,
                source : target.source
            }
           
            let isExist = this.selectedGroup.targets.some(
                t => t.url === newTarget.url && t.source === newTarget.source
            );

            if (!isExist) {
                this.selectedGroup.targets.push(newTarget);
                console.log("เพิ่มใหม่", this.selectedGroup.targets);
            } else {
                console.log("มีอยู่แล้ว ไม่เพิ่ม", newTarget);
                Swal.fire({
                    title: 'เพิ่มสมาชิกบัญชีนี้แล้ว',
                    text:  'กรุณากรอกรายละเอียดสมาชิกอื่น',
                    icon: 'error',
                    customClass: {
                        confirmButton: 'btn btn-danger'
                    },
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    buttonsStyling: false
                })
            }
        },
        handleNewTarge() {
            // regex ตรวจสอบ url (เริ่มต้นด้วย http:// หรือ https://)
            const urlPattern = /^(https?:\/\/)([\w.-]+)(:\d+)?(\/.*)?$/i;

            if (
                !this.newTarget.link_original ||
                this.newTarget.link_original.trim() === "" ||
                !this.newTarget.source
            ) {
                Swal.fire({
                title: 'กรุณากรอกรายละเอียดสมาชิก',
                text: 'กรุณากรอกรายละเอียดสมาชิกก่อนกดปุ่มเพิ่ม',
                icon: 'error',
                customClass: {
                    confirmButton: 'btn btn-danger'
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                buttonsStyling: false
                });
            } else if (!urlPattern.test(this.newTarget.link_original.trim())) {
                Swal.fire({
                title: 'URL ไม่ถูกต้อง',
                text: 'กรุณากรอก URL ที่ขึ้นต้นด้วย http:// หรือ https://',
                icon: 'error',
                customClass: {
                    confirmButton: 'btn btn-danger'
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                buttonsStyling: false
                });
            } else {
                this.handleTargetList(this.newTarget);
                this.newTarget = { link_original: "", source: null };
            }
        },
        setSelectedGroup(group) {
            if (!group.name || group.name.trim() === "" || !group.group_type) {
                Swal.fire({
                    title: 'กรุณากรอกรายละเอียดกลุ่ม',
                    text:  'กรุณากรอกรายละเอียดกลุ่มก่อนเพิ่มสมาชิก',
                    icon: 'error',
                    customClass: {
                        confirmButton: 'btn btn-danger'
                    },
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    buttonsStyling: false
                })
                // return;
            } else {
                if (this.selectedGroup === group) {
                    group.show = false;
                    this.selectedGroup = {};
                } else {
                    group.show = true;
                    this.selectedGroup = group;
                }
            }
        },
        saveDraft(group) {
            group = this.selectedGroup
            this.selectedGroup = {};
        },
        deleteDraft(group) {
            console.log(group);
            group.targets = []
            this.selectedGroup = {};
        },
        onPageChange(page) {
            this.currentPage = page;
            this.apiMonitorList();
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
                return "กรุณาตั้งชื่อกลุ่ม"
            }
            return ""
        },
        deleteGroup(group, index) {
            console.log(group, index);
            if (this.selectedGroup === group) {
                this.selectedGroup = {};
            }
            
            this.groups.splice(index, 1);
        },
        addGroup() {
            this.groups.push(
            {
                name: this.newGroups.name,
                group_type: this.newGroups.group_type,
                targets: this.newGroups.targets
            });
            this.newGroups = { name: "", group_type: null, targets: [] };
        },
        clear() {
            this.groups = [];
            this.selectedGroup = {};
        },
        hideModal() {
            // this.addGroup = false;
            this.open = false;
            // this.$emit("close");
        },
        cleanGroups(groups) {
            return groups.map(group => {
                return {
                ...group,
                targets: group.targets.map(target => {
                    const { profile_image, name, uid, url, ...rest } = target; // ตัด key ที่ไม่ต้องการออก
                    return {
                        ...rest,
                        URL: url // เปลี่ยนชื่อ key
                    };
                })
                };
            });
        },
        async apiMonitorList() {
            this.load = true;
            // console.log('apiMonitorList ===',this.currentPage);
            
            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/monitor/getMonitor",
                params: {
                    type: 'targetlist',
                    page: this.currentPage,
                    limit: this.perPage,
                    search: this.search,
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            this.axios(config)
            .then((response) => {
                const resData = response.data;
                this.targetLists = resData.data || [];
                this.totalRows = resData.pagination?.totalCount || this.targetLists.length;
                this.load = false;
            })
            .catch((error) => {
                this.load = false;
                this.targetLists = [];
                console.error(error);
            });
        },
        async addNewGroup() {
            let rawData = {
                "data": this.cleanGroups(this.groups)
            }
            // console.log(list);
            console.log("raw === ", rawData);
            const config = {
                method: "post",
                url: "https://api2.cognizata.com/api/v2/monitor/postGroupName",
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
                this.clear();
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
        }
    },
    async mounted() {
        await this.apiMonitorList();
    },
};
</script>

<style scoped>
.card-target:hover {
    border: 2px solid #17a2b8;
    box-shadow: 10px 10px 15px rgba(23, 162, 184, 0.6); /* กรอบเรืองแสงสีน้ำเงิน */
    cursor: pointer;
}
.card-target.is-selected {
  border: 2px solid #17a2b8; /* ขอบสีฟ้าเมื่ออยู่ใน newTargets */
  box-shadow: 0 0 12px rgba(23, 162, 184, 0.6);
}
.platform-imgs {
    width:25px;
}
.dashed-border {
    border: 1px dashed #ccc;
    /* เส้นประสีเทา */
    border-radius: 6px;
    /* (ถ้าอยากได้มุมโค้ง) */
    padding: 8px;
    /* เพิ่มระยะห่างด้านใน */
}
.add-btn{
    background: linear-gradient(90deg,#FDD071 0%, #ffbcbc 100%);
    border: none;
    color: #776167; /* ให้ตัวอักษรอ่านง่าย */
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
