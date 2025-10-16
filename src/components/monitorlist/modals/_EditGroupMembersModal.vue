<template>
    <div>
        <vue-modaltor :visible="openModal" @hide="hideModal" :animation-panel="'modal-slide-top'"
        :resize-width="{ 3000: '100%', 1350: '100%', 768: '100%' }"
        >
            <div>
                <h5><b>แก้ไขบัญชีในกลุ่ม</b></h5>
                <hr />
            </div>
            <!-- <div>
                <b-alert show>การเลือกประเภทของกลุ่มบัญชี <br />
                    ประเภท<b>กลุ่ม</b>: จัดกลุ่มบัญชีที่ทำ<b>กิจกรรมคล้ายกัน</b>,
                    ประเภท<b>บุคคล</b>: จัดกลุ่มบัญชีที่เป็น<b>บุคคลเดียวกัน</b>แต่คนละ platform, 
                    ประเภท<b>องค์กร</b>: จัดกลุ่มบัญชีที่เป็น<b>องค์กรเดียวกัน</b>แต่คนละ platform
                </b-alert>
            </div> -->
            <!-- body -->
            <b-row cols="1" class="my-1 mx-0" :class="showTargetLists ? 'row-cols-lg-3' : 'row-cols-lg-2'">
                <!-- create new Groups dashed-border-->
                <b-col class="p-0 border-right">
                    <b-row v-if="selectedGroup.targetlist && selectedGroup.targetlist.length !== 0" class="bold my-2 mx-0 px-0">
                        รายชื่อบัญชีในกลุ่ม {{ selectedGroup.targetlist.length }} รายการ
                    </b-row>
                    <b-row cols="1" cols-lg="1" cols-xl="1" class="m-0 modal-body-scrollable" style="max-height:65vh;">
                        <b-col class="h-auto pl-0 pr-2 mb-2" v-for="target in selectedGroup.targetlist" :key="target.id" >
                            <target-card :target="target" @delete-target="confirmDeleteTarget(target._id)"/>
                        </b-col>
                    </b-row>
                    <!-- <hr/> -->
                </b-col>
                <b-col>
                    <b-row class="bold my-2 mx-0 px-0">
                        <b-col class="p-0 text-left">
                            เพิ่มบัญชีใหม่ {{ newTargets.length }} รายการ
                        </b-col>
                    </b-row>
                    <b-row class="m-0 mb-2 justify-content-between align-items-center">
                        <b-col class="p-0">
                             <!-- <b-col cols="auto" class="px-0 text-info">
                                 <span>เพิ่มบัญชีที่ไม่อยู่ใน monitor</span>
                             </b-col> -->
                            <b-alert show>
                                <b-icon icon="info-circle" class="" variant="info"></b-icon> 
                                <small>
                                    การเพิ่มบัญชีที่<b>ไม่มีใน monitor</b>
                                    สามารถ<b>เพิ่มหลาย url พร้อมกันได้</b> โดย
                                    <b>เว้นวรรคระหว่าง url</b> หรือ คั่นด้วย<b>เครื่องหมาย , </b>แล้ว <b>Enter หรือ กดปุ่มadd</b> เพื่อเพิ่มบัญชี<br/>
                                    <b>ตัวอย่าง </b> https://www.facebook.com/..., https://www.facebook.com/..
                                </small>
                            </b-alert>
                        </b-col>
                    </b-row>
                    
                    <b-row class="m-0 mb-2 mr-2">
                        <b-form-tags
                            input-id="tags-pills"
                            v-model="addTarget"
                            tag-variant="light"
                            tag-pills
                            size="md"
                            placeholder="เพิ่ม url แล้ว Enter เพื่อเพิ่มบัญชี"
                            separator=" ,;"
                            remove-on-delete
                            @input="onTagsInput"
                        />
                    </b-row>
                    <b-col class="text-right p-0">
                        <b-button @click="showTargetLists = !showTargetLists" pill variant="info" size="sm">
                           <span v-if="!showTargetLists">แสดงบัญชีจาก monitor</span> 
                           <span v-else>ซ่อนบัญชีจาก monitor</span> 
                        </b-button>
                    </b-col>

                    <hr v-if="(newTargets.length > 0) && (selectedGroup.targetlist.length !== 0)">
                    <b-col cols="12" class="p-0 " >
                        <b-row cols="1" class="m-0 pr-3 modal-body-scrollable" style="max-height: 40vh;">
                            <target-card v-for="(target,index) in newTargets" :key="target.id" 
                                :target="target" 
                                @delete-target="removeTargetList(target)"
                                class="mb-2"
                            />
                        </b-row>
                    </b-col>
                </b-col>

                <!-- show targetlist -->
                <b-col v-if="showTargetLists" class="">
                    
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
                    <b-row cols="1" class="m-0 modal-body-scrollable" style="max-height: 60vh;">
                        <b-col class="mb-2 px-2" v-for="target in targetLists" :key="target.id" >
                            <b-card
                                bg-variant="white" text-variant=""
                                class="card-target mb-2 h-100" body-class="px-2 pt-0 pb-2"
                                @click="handleTargetList(target)"
                                :class="{ 'is-selected' : isTargetSelected(target) }"
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
                                                <a @click.prevent="openLink(target.link_crawl)" class="text-truncate d-block text-info">
                                                    {{ target.link_crawl }}
                                                </a>
                                            </div>
                                        </b-col>
                                        <b-col cols="auto" class="p-0 text-right">
                                            <b-row cols="1" class="m-0 h-100 justify-content-end">
                                                <b-col align-self="end" class="p-0 text-right">
                                                    <b-avatar class="" size="25px" :src="target.image">
                                                        <img @click="openLink(target.link_crawl)" v-if="target.source == 'facebook'" src="@/assets/Facebook.png" class="platform-imgs" />
                                                        <img @click="openLink(target.link_crawl)" v-if="target.source == 'twitter'" src="@/assets/Twitter.png" class="platform-imgs" />
                                                        <img @click="openLink(target.link_crawl)" v-if="target.source == 'pantip'" src="@/assets/board.png" class="platform-imgs" />
                                                        <img @click="openLink(target.link_crawl)" v-if="target.source == 'blockdit'" src="@/assets/Blockdit.png" class="platform-imgs" />
                                                        <img @click="openLink(target.link_crawl)" v-if="target.source == 'instagram'" src="@/assets/Instagram.png" class="platform-imgs" />
                                                        <img @click="openLink(target.link_crawl)" v-if="target.source == 'youtube'" src="@/assets/Youtube.png" class="platform-imgs" />
                                                        <img @click="openLink(target.link_crawl)" v-if="target.source == 'news'" src="@/assets/News.png" class="platform-imgs" />
                                                        <img @click="openLink(target.link_crawl)" v-if="target.source == 'tiktok'" src="@/assets/Tiktok.png" class="platform-imgs" />
                                                        <img @click="openLink(target.link_crawl)" v-if="target.source == 'threads'" src="@/assets/Threads.png" class="platform-imgs" />
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
                    <b-button @click="apiAddTarget()" class="btn btn-save" size="sm">
                        บันทึก
                    </b-button>
                </b-col>
            </b-row>
        </vue-modaltor>
    </div>
</template>

<script>
// import CardInput from "./_CardInput.vue";
import TargetCard from './_targetCard.vue';
import Swal from 'sweetalert2'
export default {
    components: {
        // CardInput,
        TargetCard,
    },
    props: {
        openModal: {
            type: Boolean,
            default: false
        },
        selectedGroup: {
            type: Object,
            default:() => ({})
        }
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
            showTargetLists:false,
            // selectedGroup: {},
            newGroups: { name: "", group_type: null, targets: [] },
            addTarget: [],
            // prevAddTarget: [],
            newTargets:[],
            newTarget: {link_crawl: "", source: null},
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
        openLink(url) {
            if (!url) return;
            // ถ้าไม่มี http/https ให้เติม http:// ให้ก่อน
            if (!/^https?:\/\//i.test(url)) {
                url = 'https://' + url;
            }

            // เปิดลิงก์ในแท็บใหม่ และป้องกัน window.opener
            window.open(url, '_blank', 'noopener,noreferrer');
        },
        removeTrailingSlash(url) {
            // return url.endsWith('/') ? url.slice(0, -1) : url;
            if (!url) return url;

            try {
                // ลบส่วน #anchor ถ้ามี
                url = url.split('#')[0];

                // จัดการกรณี profile.php?id=xxxxx
                url = url.replace(/profile\.php\?id=([0-9]+)/, '$1');

                // ลบ / ท้ายสุด ถ้ามี
                if (url.endsWith('/')) {
                    url = url.slice(0, -1);
                }

                return url;
            } catch (e) {
                console.error('Error in removeTrailingSlash:', e);
                return url;
            }
        },
        formatTargets(targets) {
           return targets.map(url => {
                return {
                    url: url,
                    source: this.detectPlatform(url)
                };
            });
        },
        detectPlatform(url) {
            if (url.includes("facebook.com")) return 'facebook';
            if (url.includes("tiktok.com")) return 'tiktok';
            if (url.includes("youtube.com") || url.includes("youtu.be")) return 'youtube';
            if (url.includes("instagram.com")) return 'instagram';
            if (url.includes("twitter.com") || url.includes("x.com")) return 'twitter';
            if (url.includes("pantip.com")) return 'pantip';
            if (url.includes("blockdit.com")) return 'blockdit';
            if (url.includes("threads.com")) return 'threads';
            return 'news';
        },
        isTargetSelected(target) {
            // console.log(target);
            
            const inNewTargets = this.newTargets?.some(t => t.url === target.link_crawl || t.uid === target.uid);
            const inSelectedGroup = this.selectedGroup?.targetlist?.some(t => t.link_crawl === target.link_crawl);
            return inNewTargets || inSelectedGroup;
            // return this.newTargets.some(t => t.url === target.url || t.uid === target.uid);
        },
        removeTargetList(target) {
             if (!this.selectedGroup || !this.newTargets) return;

            // ลบ item ที่ uid ตรงกัน
            this.newTargets = this.newTargets.filter(t => t.url !== target.url);

            // console.log("หลังลบ target:", this.newTargets);
        },
        handleTargetList(target) {
            // console.log("handleTargetList target === ", target);

            let newTarget = {
                profile_image: target.profile_image || null,
                name: target.name || null,
                uid: target.uid || null,
                url: target.link_crawl,
                source: target.source
            };

            // ✅ ตรวจสอบซ้ำทั้งใน newTargets และ selectedGroup.targetlist
            const inNewTargets = this.newTargets?.some(
                t => t.url === newTarget.url && t.source === newTarget.source
            );

            // const inSelectedGroup = this.selectedGroup.targetlist?.some(
            //     t => t.url === newTarget.url && t.source === newTarget.source
            // );
            const inSelectedGroup = this.selectedGroup.targetlist?.some(
                t => (t.link_crawl === newTarget.url) &&
                    t.source === newTarget.source
            );

            // 👉 ถ้าอยู่ในที่ใดที่หนึ่ง ให้ถือว่าซ้ำ
            const isExist = inNewTargets || inSelectedGroup;
            // console.log("inNewTargets == ", inNewTargets);
            // console.log("inSelectedGroup == ", inSelectedGroup);
            // console.log("isExist == ", isExist);
            
            if (!isExist) {
                this.newTargets.push(newTarget);
                // console.log("เพิ่มใหม่", this.newTargets);
            } else {
                // console.log("มีอยู่แล้ว ไม่เพิ่ม", newTarget);
                Swal.fire({
                    title: 'เพิ่มสมาชิกบัญชีนี้แล้ว',
                    text: 'กรุณากรอกรายละเอียดสมาชิกอื่น',
                    icon: 'error',
                    customClass: {
                        confirmButton: 'btn btn-danger'
                    },
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    buttonsStyling: false
                });
            }
        },
        handleNewTarge() {
            // regex ตรวจสอบ url (เริ่มต้นด้วย http:// หรือ https://)
            const urlPattern = /^(https?:\/\/)([\w.-]+)(:\d+)?(\/.*)?$/i;

            if (
                !this.newTarget.link_crawl ||
                this.newTarget.link_crawl.trim() === "" ||
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
            } else if (!urlPattern.test(this.newTarget.link_crawl.trim())) {
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
                this.newTarget = { link_crawl: "", source: null };
            }
        },
        // onTagsInput() {
           
        //     // ตัด www. และ / ตัวท้าย
        //     this.addTarget = this.addTarget.map(url => this.removeTrailingSlash(url.replace("www.", "")));
            
        //     // จัดรูปแบบเป็น { url, source }
        //     let targets = this.formatTargets(this.addTarget);
        //     // console.log("target formatted === ", targets);

        //     // เพิ่มลง selectedGroup.targets
        //     targets.forEach(target => {
        //         // สร้าง object สำหรับ handleTargetList
        //         const newTarget = {
        //             profile_image: null,
        //             name: null,
        //             uid: null,
        //             link_crawl: target.url,
        //             source: target.source
        //         };
        //         this.handleTargetList(newTarget);
        //         this.addTarget = []
        //     });
            
        // },
        onTagsInput() {
            // regex ตรวจสอบ url (เริ่มต้นด้วย http:// หรือ https://)
            const urlPattern = /^(https?:\/\/)([\w.-]+)(:\d+)?(\/.*)?$/i;

            // ตัด www. และ / ตัวท้าย แล้วกรองเฉพาะลิงก์ที่ถูกต้องเท่านั้น
            this.addTarget = this.addTarget
                .map(url => this.removeTrailingSlash(url.replace("www.", "")))
                .filter(url => urlPattern.test(url.trim()));

            // ถ้าไม่มีลิงก์ที่ถูกต้องเลย
            if (this.addTarget.length === 0) {
                Swal.fire({
                    title: 'ไม่มีลิงก์ที่ถูกต้อง',
                    text: 'กรุณากรอก URL ที่ขึ้นต้นด้วย http:// หรือ https://',
                    icon: 'error',
                    customClass: {
                        confirmButton: 'btn btn-danger'
                    },
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    buttonsStyling: false
                });
                return;
            }

            // จัดรูปแบบเป็น { url, source }
            const targets = this.formatTargets(this.addTarget);

            // เพิ่มลง selectedGroup.targets
            targets.forEach(target => {
                const newTarget = {
                    profile_image: null,
                    name: null,
                    uid: null,
                    link_crawl: target.url,
                    source: target.source
                };
                this.handleTargetList(newTarget);
            });

            // เคลียร์ค่า addTarget หลังจากเพิ่มเสร็จ
            this.addTarget = [];
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
            // console.log(group, index);
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
                targets: this.newGroups.targets,
                showMember: true
            });
            this.newGroups = { name: "", group_type: null, targets: [] };
        },
        clear() {
            this.newTargets = [];
            //this.groups = [];
            //this.selectedGroup = {};
        },
        hideModal() {
            this.clear();
            // this.addGroup = false;
            // this.openModal = false;
            this.$emit("close");
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
        confirmDeleteTarget(target_id) {
            // console.log(target_id);
            Swal.fire({
                title: 'ยืนยันการลบสมาชิก',
                text: "คุณต้องการลบสมาชิกคนนี้หรือไม่?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'ลบ',
                cancelButtonText: 'ยกเลิก',
                didOpen: () => {
                    const iconContent = document.querySelector('.swal2-icon-content');
                    if (iconContent) iconContent.style.display = 'none';
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    this.apiDeleteTarget(target_id);
                    // this.toggleDetails(data);
                }
            });
        },
        reFormatTargets(data) {
            return data.map(item => ({
                URL: item.url,
                source: item.source
            }));
        },
        async apiAddTarget() {
            this.load = true;
            const config = {
                method: "put",
                url: `https://api2.cognizata.com/api/v2/monitor/putTargetlist`,
                data: {
                    group_id: this.selectedGroup.group_id,
                    target: this.reFormatTargets(this.newTargets)
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };
            // console.log("apiAddTarget config", config);

            this.axios(config)
                .then((response) => {
                    this.load = false;
                    Swal.fire({
                        title: 'สำเร็จ',
                        text: 'เพิ่มเป้าหมายเรียบร้อยแล้ว',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 2000
                    });
                    this.newTargets = [];
                    this.hideModal();
                    this.$emit('update-group');
                    // this.apiMonitorGroupList();
                })
                .catch((error) => {
                    this.load = false;
                    console.error(error);
                    Swal.fire('ผิดพลาด', 'ไม่สามารถเพิ่มเป้าหมายได้', 'error');
                });
        },
        async apiDeleteTarget(target_id) {
            console.log("_id == ", target_id);
            
            this.load = true;
            const config = {
                method: "delete",
                url: `https://api2.cognizata.com/api/v2/monitor/deleteTargetlist`,
                data: {
                    group_id: this.selectedGroup.group_id,
                    targetlist_id: target_id
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            this.axios(config)
                .then((response) => {
                    this.load = false;
                    Swal.fire({
                        title: 'สำเร็จ',
                        text: 'ลบเป้าหมายเรียบร้อยแล้ว',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 2000
                    });
                    this.newTargets = [];
                    if (this.selectedGroup && Array.isArray(this.selectedGroup.targetlist)) {
                        this.selectedGroup.targetlist = this.selectedGroup.targetlist.filter(
                            t => t._id !== target_id // ลบ item ที่ตรง _id
                        );
                        } else {
                        console.warn('selectedGroup หรือ targetLists ยังไม่ถูกกำหนดค่า');
                        }
                    // this.hideModal();
                    this.$emit('update-group');
                    // this.apiMonitorGroupList();
                })
                .catch((error) => {
                    this.load = false;
                    console.error(error);
                    Swal.fire('ผิดพลาด', 'ไม่สามารถลบเป้าหมายได้', 'error');
                });

        },
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
