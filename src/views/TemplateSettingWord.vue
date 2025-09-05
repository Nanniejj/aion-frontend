<template>
    <div id="overflow-page">
        <HomeNav id="navHome" />
        <!-- <vue-element-loading :active="getLoadStatus" :is-full-screen="true" size='80' 
        background-color='rgba(0, 0, 0, 0.3)' color='#fff' spinner="bar-fade-scale" /> -->
        <div id="content">
            <b-container fluid id="tp-size">
                <h1 class="text-left title m-0">Setting</h1>
                <b-row class="m-0 py-0 justify-content-between">
                    <b-col cols="" class="px-0">
                        <h4 class="title-domain ml-0 d-flex flex-nowarp align-items-center" style="margin-left: 0px !important;"><router-link :to="{name:'TemplateSetting'}">จัดการ Domain </router-link > <i class="fas fa-angle-right"/>
                        <router-link :to="{name:'TemplateSettingSubDomain'}"> SubDomain </router-link > 
                        <i class="fas fa-angle-right"/> <span id="active">Word</span> </h4> 
                    </b-col>
                    <b-col cols="auto" sm="auto" class="mb-3 text-right px-0">
                        <i class="fa fa-print" @click="printWindow()" style="font-size:25px;cursor: pointer;"/>
                    </b-col>
                </b-row>
                <b-row v-if="suggestionKeywrords.length !== 0" class="m-0 py-2 mb-3">
                    <b-col cols="12" class="text-left px-0">
                        <h5 class="title-domain ml-0" style="margin-left: 0px !important;">keyword ที่แนะนำ</h5>
                    </b-col>
                    <b-col cols="12" class="px-0">
                        <b-row class="m-0">
                            <b-col cols="auto" class="pl-0 px-1 mb-2" v-for="(keyword,index) in suggestionKeywrords" :key="index + keyword">
                                <div @click="copyToClipboard(keyword)" class="bage-keyword" v-b-tooltip.hover title="คลิกเพื่อ 'คัดลอก' ">
                                    {{ keyword }}
                                </div>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </b-container>
            <TemplateWord />
        </div>
    </div>
</template>

<script>
import HomeNav from '@/components/HomeNav.vue';
import TemplateWord from '@/components/template/TemplateWord.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    HomeNav,TemplateWord,
    
  },
  data: function() {
      return {
        suggestionKeywrords:[]
    };
  },
  computed: {
    ...mapGetters(['getSelected','getListSubDomain','getListWord','getSubDomainName','getLoadStatus','getDomainId']),
  },
  methods: {
    printWindow: function() {
      try {
        window.print();
      } catch (err) {
        console.log(err);
      }
      },
    copyToClipboard(text) {
      if (navigator.clipboard && window.isSecureContext) {
        // วิธีใหม่ (modern browsers)
        navigator.clipboard.writeText(text).then(() => {
          this.$bvToast.toast("คัดลอกแล้ว: " + text, {
            title: "สำเร็จ",
            variant: "success",
            solid: true,
            autoHideDelay: 1000 
          });
        });
      } else {
        // วิธี fallback
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = 0;
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
          document.execCommand("copy");
          this.$bvToast.toast("คัดลอกแล้ว: " + text, {
            title: "สำเร็จ",
            variant: "success",
            solid: true,
            autoHideDelay: 1000 
          });
        } catch (err) {
          console.error("ไม่สามารถคัดลอก", err);
        }
        document.body.removeChild(textarea);
      }
    },
    async apiGetSuggestionKeywrords() {
        this.loadWord = true
        try {
            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/aiservice/getSuggestionKewrords",
                params: { domain_id: this.getDomainId },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };
            const response = await this.axios(config);
            this.loadWord = false;
            if (response && response.data && response.data.length > 0) {
                console.log("res === ", response);
                let data = response.data[0];
                this.suggestionKeywrords = data.keywords;
                console.log(data);
            } else {
                console.log("No data found");
                this.suggestionKeywrords = []
            }
            
        } catch (error) {
            this.loadWord = false
            this.suggestionKeywrords = []
            console.error("Error fetching API:", error);
        }
    },
    },
    async mounted() {
        this.apiGetSuggestionKeywrords();
  }
};
</script>

<style scoped>
#tp-size {
  width: 85%;
}
#export-btn{
  margin: 0px 20px;
  color: #495057;
  background-color: #e9ecef;
  border-color: #e9ecef;
  border-radius: 9px;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 20%);  
}
#export-btn:hover{
  color: white;
    background-color: #495057;
    border-color:  #495057;
}
button {
  background-color: #f0f0f0;
  border: solid 1px #bbb;
  padding: 10px;
  font-size: 15px;
  border-radius: 5px;
}
#active{
   text-decoration: underline;
}
.title-domain a{
  cursor: pointer;
  color: #2c3e50;
}
.title-domain{
    text-align: start;
    margin-left: 12%;
    margin-bottom: 20px !important;
}
* {
  font-family: 'Prompt', 'FontAwesome', sans-serif;
}

#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
}
#navHome {
  z-index: 1;
}


.text {
  background-color: #ede7dd;
  width: 550px;
  height: 30pt;
  border-radius: 3pt;
  margin: auto;
}
.domain {
  margin-top: 20pt;
  margin-left: -31rem;
  margin-bottom: 10pt;
}

.form-control {
  margin: auto;
}

.date {
  margin-top: 20pt;
  margin-left: 39.3rem;
  margin-bottom: 10pt;
}

.dropdown-toggle {
  color: #4c412b;
  background-color: #ede7dd;
  border-color: transparent;
}

.dropdown-toggle::after {
  margin-left: 7em;
}
.btn-primary:not(:disabled):not(.disabled).active,
.btn-primary:not(:disabled):not(.disabled):active,
.show > .btn-primary.dropdown-toggle {
  color: #4c412b;
  background-color: #ede7dd;
  border-color: transparent;
}

.show > .btn-primary.dropdown-toggle:focus {
  box-shadow: none !important;
}

.btn-primary:focus {
  box-shadow: none !important;
}

.submit {
  width: 70%;
  background-color: white;
  color: gray;
  border-color: #fed16e !important;
  border-radius: 9px;
  font-weight: bold;
}
.bage-keyword{
    background-color: rgb(213, 246, 250);
    /* padding: 10px;
    padding-right: 20px;
    padding-left: 20px;
    border-radius: 10px;
    cursor: pointer; */
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 6px 12px;
    /* background: #2c3e50;
    color: #bef7fe; */
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    position: relative;
    overflow: hidden;
    transition: all 0.5s ease;
    font-weight:normal ;
}
/* เอฟเฟกต์ข้อความ */
.bage-keyword span {
  position: relative;
  z-index: 2;
}

/* เลเยอร์ไฟ holographic */
.bage-keyword::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    0deg,
    transparent,
    transparent 30%,
    rgba(0, 255, 255, 0.3)
  );
  transform: rotate(-45deg);
  transition: all 0.5s ease;
  opacity: 0;
}

/* hover effect */
.bage-keyword:hover {
  transform: scale(1.05);
  background: #2c3e50;
  color: #bef7fe;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
}

.bage-keyword:hover::before {
  opacity: 1;
  transform: rotate(-45deg) translateY(100%);
}

/* กดคัดลอกแล้ว */
.bage-keyword.copied {
  background: #0ff !important;
  color: #000 !important;
  box-shadow: 0 0 20px #0ff;
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  #overflow-page {
    overflow: hidden;
  }
}
@media only screen and (min-width: 950px) and (max-width: 1150px) {
  .date {
    margin-top: 20pt;
    margin-left: 11.5rem;
    margin-bottom: 10pt;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
}
</style>
