<template>
    <div>
        <!-- {{getListMonitorProfile.targetlist.length}} -->
        <button class="btn btn-add mt-0 w-100" @click="open = true">
            <i class="fa fa-plus" />
            <span style="font-size: 16px">
                เพิ่มกลุ่ม
            </span>
        </button>

        <vue-modaltor :visible="open" @hide="hideModal" :animation-panel="'modal-slide-top'"
            :resize-width="{ 3000: '50%', 1350: '80%', 768: '90%' }"
        >
            <!-- :resize-width="{ 3000: '80%', 1350: '80%', 768: '90%' }" -->
            <!-- :resize-width="{ 3000: '99%', 1350: '90%', 768: '90%' }" -->
            <div>
                <h5><b>เพิ่มกลุ่มบัญชี</b></h5>
                <hr />
            </div>


            <!-- body -->
            <b-row class="my-1 ">
                <!-- create new Groups dashed-border-->
                <b-col class="modal-body-scrollable ">
                    <!-- {{ targetLists }} -->
                    <b-row v-if="groups.length > 0" cols="1" class="m-0">
                        <b-col v-for="(group, index) in groups" :key="index" class="mb-2">
                            <b-card bg-variant="white" text-variant="" class="mb-2">
                                <b-card-text>
                                    <b-row class="m-0 justify-content-end">
                                        <i class="fa fa-close text-danger" @click="deleteGroup(index)" style="font-size:24px;cursor: pointer;"></i>
                                    </b-row>
                                    <b-row class="align-items-center m-0">
                                        <b-col cols="auto" class="p-0">
                                            <b-avatar icon="people-fill" size="4rem" style="background-color: #fed16e;"></b-avatar>
                                        </b-col>
                                        <b-col >
                                            <b-row>
                                                <b-col>
                                                    <b-form-group id="fieldset-1" label="ชื่อกลุ่ม" label-for="input-1"
                                                        valid-feedback="Thank you!" :invalid-feedback="invalidFeedback(group.name)"
                                                        :state="state(group.name)">
                                                        <b-form-input id="input-1" v-model="group.name" trim></b-form-input>
                                                    </b-form-group>
                                                </b-col>
                                                <b-col>
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
                                </b-card-text>
                                <!-- <b-button href="#" variant="primary">สร้างกลุ่ม</b-button> -->
                            </b-card>
                        </b-col>
                    </b-row>
                    <b-row class="m-0 text-center">
                        <b-col>
                            <b-button variant="info" @click="addGroup" class="">
                                <i class="fa fa-plus mr-1" />
                                <span>เพิ่มกลุ่ม</span>
                            </b-button>
                        </b-col>
                    </b-row>
                </b-col>
                <!-- show targetlist -->
                <!-- <b-col class="">
                    <b-row class="m-0 mb-2">
                        <b-col cols="12" class="d-flex text-info justify-content-between align-items-center">
                            <span>รายชื่อบัญชีที่แนะนำ</span>
                        </b-col>
                    </b-row>
                    <b-row class="m-0">
                        <b-col class="modal-body-scrollable">
                            <b-card v-for="target in targetLists" :key="target.id" bg-variant="white" text-variant=""
                                class="mb-2">
                                <b-card-text>
                                    <b-row class="align-items-center m-0">
                                        <b-col cols="auto" class="p-0">
                                            <b-avatar :src="target.profile_image" v-if="target && target.profile_image">
                                            </b-avatar>
                                            <b-avatar :src="target.profile_image" v-else> </b-avatar>
                                        </b-col>
                                        <b-col>
                                            <span>{{ target.name || target.uid }}</span>
                                        </b-col>
                                    </b-row>
                                </b-card-text>
                            </b-card>
                        </b-col>
                    </b-row>
                </b-col> -->
            </b-row>

            <!-- footer -->
            <b-row class="m-0 justify-content-end">
                <b-col cols="auto">
                    <!-- <br /> -->
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
            this.open = false;
            // this.$emit("close");
        },
        
        async addNewGroup() {
            let rawData = {
                "data": this.groups
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
        // await this.apiMonitorList();
    },
};
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

/* ::v-deep(.vue-modaltor__panel) {
  width: 100% !important;
  height: 100vh !important; 
  max-width: 100% !important;
  max-height: 100vh !important;
  margin: 0 !important;
  border-radius: 0 !important;
  display: flex;
  flex-direction: column;
} */
</style>
