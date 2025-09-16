<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />

  <TimelineMain/>
  </div>
</template>

<script>
import HomeNav from "@/components/HomeNav.vue";
import { mapGetters } from "vuex";
import TimelineMain from "@/components/timeline/TimelineMain.vue";
import "vue-select/dist/vue-select.css";
import moment from "moment";
export default {
components:{
TimelineMain
}

};
</script>

<style scoped>
.mx-datepicker-range {
  width: 100% !important;
}

* {
  font-family: "Prompt", "FontAwesome", sans-serif;
}

#navHome {
  z-index: 1;
}

.container {
  max-width: 1200px;
}

/* ปรับหน้าตาเล็กน้อย */
.b-form-group {
  min-width: 220px;
}

.btn-to-top {
  width: 60px;
  height: 60px;
  padding: 10px 16px;
  border-radius: 50%;
  font-size: 22px;
  line-height: 22px;
  background-color: #fed16e;
  border-color: #fed16e;
  color: #fff;
  box-shadow: 2px 1px 4px #888888;
}

.btn-to-top:hover {
  background-color: #f7c24e;
  border-color: #f7c24e;
  color: #fff;
}

.mx-input {
  display: inline-block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 38.5px !important;
  ;
  padding: 6px 30px;
  padding-left: 10px;
  font-size: 14px;
  line-height: 1.4;
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, .0);
}

@media only screen and (min-width: 0) and (max-width:1100px) {
  .checkbox-v {
    zoom: 85%
  }
}

/* จอมือถือ */
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .vue-back-to-top {
    right: 14px !important;
  }

  .btn-to-top {
    width: 50px;
    height: 50px;
    padding: 10px 13px;

  }

  #overflow-page>div.container.my-3>div.card.mb-3.shadow-sm>div>form>div.row.mt-2.justify-content-end {
    zoom: 87% !important;
    width: 100% !important;
  }

  .checkbox-v {
    zoom: 85%
  }
}
</style>
