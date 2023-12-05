<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
    <!-- <vue-element-loading :active="getLoadStatus" :is-full-screen="true" size='80' 
    background-color='rgba(0, 0, 0, 0.3)' color='#fff' spinner="bar-fade-scale" /> -->
    <div id="content" >
  <b-container fluid id="tp-size" >
      <h1 class="title">Setting</h1>
      <h4 class="title-domain" ><a >จัดการ Domain</a> </h4>
      <div class="mb-3 text-right">
        <button id="export-btn" @click="printWindow()">
          <i class="fa fa-print fa-2x" /> 
          <b> Print</b>
        </button>
      </div>
      <TemplateDomain />
  </b-container>
    </div>
   
  </div>
  
</template>

<script>
import HomeNav from '@/components/HomeNav.vue';
import TemplateDomain from '@/components/template/TemplateDomain2.vue';
import { mapGetters } from 'vuex';
// import TemplateDomain from '../components/setting_template/DomainSetting.vue'
export default {
  components: {
    HomeNav,TemplateDomain,
    
  },
  data: function() {
    return {};
  },
  computed: {
    ...mapGetters(['getSelected','getListSubDomain','getListWord','getLoadStatus',"getToSection"]),
  },
  methods:{
    printWindow: function() {
      try {
        window.print();
      } catch (err) {
        console.log(err);
      }
    },
     print () {
     // Pass the element id here
      this.$htmlToPaper('content');
    },
  }
};
</script>

<style scoped>
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
