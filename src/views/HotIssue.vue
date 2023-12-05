<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
     <div id="content"  >
       <!-- <h1 class="title">Hot Issue</h1> -->
        <b-row >
        <b-col class="text-left"  cols="sm"> <h1 class="title">Hot Issue</h1></b-col>
         <b-col class="text-lg-right mt-sm-4 mt-md-4 mt-lg-4 mr-lg-2">
        <section
          id="date-picker"
          class="d-none position-relative align-bottom"
        >
          <date-picker
            v-model="valueDate"
            type="date"
            range
            placeholder="เลือกช่วงเวลา"
            size="sm"
            :disabled-date="(date) => date >= new Date()"
            value-type="format"
            format="YYYY-MM-DD"
            @change="selectData()"
            id="date-domain"
            >{{ valueDate }}</date-picker
          >
        </section>
        <i
          class="fas fa-print fa-2x d-inline ml-2"
          style="cursor: pointer"
          @click="printWindow()"
        ></i>
      </b-col>
        </b-row>
        <MainHotIssue class="pb-5"/>
        <!-- <b-col><i class="fas fa-print fa-2x" @click="printWindow()"></i></b-col> -->
  </div>
  </div>
</template>

<script>
import HomeNav from "@/components/HomeNav.vue";
import MainHotIssue from "@/components/hotissue/MainHotIssue.vue";
import moment from "moment";
import { mapGetters } from "vuex";

export default {
  components: {
    HomeNav,
    MainHotIssue
  },
  data() {
    return {
      valueDate: [
        moment(new Date()).format().slice(0, 10),
        moment(new Date()).format().slice(0, 10),
      ],
    }
  },
  computed: {
    ...mapGetters(["getLoadStatus", "getToSection"]),
  }
}
</script>
<style scoped>
.title {
    text-align: start;
    margin-left: 12%;
    padding-top: 20px;
    padding-bottom: 5px;
    margin-bottom: 5px;
    font-weight: bolder;
}
.fa-print {
  font-size: 27px;
}
#date-picker > div > div > input {
  width: 50% !important;
}
.mx-input-wrapper {
  width: 50% !important;
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
  .fa-print{
    font-size: 25px;
  }
}
</style>