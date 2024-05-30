<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
    <!-- <vue-element-loading :active="getLoadStatus" :is-full-screen="true" size='80' 
    background-color='rgba(0, 0, 0, 0.3)' color='#fff' spinner="bar-fade-scale" /> -->
    <div id="content">
      <b-container fluid id="tp-size">
        <div class="d-flex">
          <h1 class="title ">Setting</h1>

          <div
            class="h4 mb-3 float-right d-flex mt-3 box-menu-monitor"
            style="position:relative;margin-left: auto; margin-right: 0;"
          >
            <div
              class="mr-3 icon-monitor1"
              @click="$router.push({ name: 'FaceRecognition' })"
            >
              <b-iconstack font-scale="2">
                <b-icon stacked icon="circle"></b-icon>
                <!-- <img
                  src="../assets/monitor.png"
                  alt="logo"
                  class="img-nav"
                  style="margin-bottom: 8px;width: 40px;"
                /> -->
                <b-icon stacked icon="person-bounding-box" scale="0.5"></b-icon>
              </b-iconstack>
              <div class="d-blocktext-center h6  my-2" >
                Face Recognition
              </div>
            </div>
            <div
              class="mr-3 icon-monitor1"
              @click="$router.push({ name: 'SearchKeywordSetting' })"
            >
              <b-iconstack font-scale="2">
                <b-icon stacked icon="circle"></b-icon>
                <b-icon stacked icon="search" scale="0.5"></b-icon>
              </b-iconstack>
              <div class="d-block h6 text-center my-2">
                Search Keyword
              </div>
            </div>
          </div>
        </div>
        <b-container >
        <b-row>
            <b-col class="text-left">
              <h4 class=""><a>จัดการ Domain</a></h4>
            </b-col>
            <b-col class="text-right">
              <i
                class="fa fa-print"
                @click="printWindow()"
                style="font-size:25px;cursor: pointer;"
              />
            </b-col>
          </b-row>
        </b-container>
        <div>
         
        </div>
        <TemplateDomain />
      </b-container>
    </div>
  </div>
</template>

<script>
import HomeNav from "@/components/HomeNav.vue";
import TemplateDomain from "@/components/template/TemplateDomain2.vue";
import { mapGetters } from "vuex";
// import TemplateSearchKeyword from '../components/template/TemplateSearchKeyword.vue';
// import TemplateDomain from '../components/setting_template/DomainSetting.vue'
export default {
  components: {
    HomeNav,
    TemplateDomain,
    // TemplateSearchKeyword
  },
  data: function() {
    return {};
  },
  computed: {
    ...mapGetters([
      "getSelected",
      "getListSubDomain",
      "getListWord",
      "getLoadStatus",
      "getToSection",
    ]),
  },
  methods: {
    printWindow: function() {
      try {
        window.print();
      } catch (err) {
        console.log(err);
      }
    },
    print() {
      // Pass the element id here
      this.$htmlToPaper("content");
    },
  },
};
</script>

<style scoped>

.icon-monitor1,
.icon-monitor2 {
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 20px;
}
/* .b-icon.bi:hover {
    display: inline-block;
    overflow: visible;
    vertical-align: -0.15em;
    background: #fed06ea4;
    border-radius: 50%;
} */
.icon-monitor1:hover .h6 {
  color: #4c412b;
  font-weight: bold;
}
.icon-monitor2:hover .h6 {
  color: #4c412b;
  font-weight: bold;
}
.icon-monitor1:hover .b-icon.bi {
  color: #4c412b;
  background-color: #fed06ea4;
  border-radius: 50%;
  -webkit-transition: 0.3s ease-in-out;
  transition: 0.3s ease-in-out;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.icon-monitor2:hover .b-icon.bi {
  color: #4c412b;
  background-color: #fed06ea4;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.export-btn {
  margin: 0px 20px;
  color: #495057;
  background-color: #e9ecef;
  border-color: #e9ecef;
  border-radius: 9px;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 20%);
}
#export-btn {
  margin: 0px 20px;
  color: #495057;
  background-color: #e9ecef;
  border-color: #e9ecef;
  border-radius: 9px;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 20%);
}
#export-btn:hover {
  color: white;
  background-color: #495057;
  border-color: #495057;
}
button {
  background-color: #f0f0f0;
  border: solid 1px #bbb;
  padding: 10px;
  font-size: 15px;
  border-radius: 5px;
}
.title-domain {
  text-align: start;
  margin-left: 12%;
  margin-bottom: 20px !important;
}
* {
  font-family: "Prompt", "FontAwesome", sans-serif;
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
