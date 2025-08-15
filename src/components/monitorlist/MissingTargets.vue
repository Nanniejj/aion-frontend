<template>
  <div>
    <!-- {{getListMonitorProfile.targetlist.length}} -->
    <button class="btn btn-info mt-0 w-100 rounded-circle p-0" @click="open = true">
        <b-avatar variant="info" icon="people-fill" size="40px"></b-avatar>
        <b-badge
            pill
            variant="warning"
            style="background: #fed16e;color: #fed16e;position: absolute; top: 20px; right: 10px; transform: translate(0%, 0%);"
        >
            .
        </b-badge>
    </button>

    <vue-modaltor
        :visible="open"
        @hide="hideModal"
        :animation-panel="'modal-slide-top'"
        :resize-width="{ 3000: '99%', 1350: '90%', 768: '90%' }"
    >
      <!-- :resize-width="{ 3000: '80%', 1350: '80%', 768: '90%' }" -->
        <div>
            <h5><b>ตรวจสอบบัญชี</b></h5>
            <hr />
        </div>
        
        
        <!-- body -->
        <b-row class="my-1 modal-body-scrollable">
           {{ missingTargets }}
            
        </b-row>

        <!-- footer -->
        <b-row class="my-1">
            <b-col sm="12" style="text-align: right">
            <br />
            <b-button size="sm" variant="outline-danger" class="mr-2">
                <i class="fa fa-eraser" aria-hidden="true"></i>
                clear
            </b-button>
            
            <b-button
                class="btn btn-save"
                size="sm"
            >บันทึก</b-button>
            </b-col>
        </b-row>
    </vue-modaltor>
  </div>
</template>

<script>
// import { type } from 'colorjs.io/types/src/util';

import CardInput from "./_CardInput.vue";
import Swal from 'sweetalert2'
export default {
    components:{
        CardInput
    },
    props: {
        missingTargets: {
            type: Object,
            default:() => ({})
        }
    },
   
    created() {
        // ค่าเริ่มต้น object → string สำหรับใช้แสดง
        // this.addTarget = this.targetLists.map(item => item.text);
    },
    data() {
        return {
            
            open: false,
            
        };
    },
    methods: {
        
        hideModal() {
            this.open = false;
            // this.$emit("close");
        },
        
    },
    async mounted() {
        this.username = localStorage.getItem("username");
        if (this.username == "adminatapy") {
            this.options.push({ value: "news", text: "News" });
        }

        // if (this.addTarget.length === 0) {
        //     this.targetLists = []
        // }
        await this.apiGetProvinces();
        await this.apiGetInfluencerType();
    },
    // watch() {
    //     addTarget: {
            
    //     }
    // }
};
</script>

<style scoped>
.modal-body-scrollable {
    min-height: 75vh;
    max-height: 75vh;
    max-width: 90vw;         
    overflow-y: auto;         /* ให้ scroll เฉพาะแนวตั้ง */
    overflow-x: hidden;       /* ❌ ปิดการ scroll แนวนอน */
    padding-left: 10px;
    padding-right: 10px;
    box-sizing: border-box;   /* เผื่อขนาด scrollbar */
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
