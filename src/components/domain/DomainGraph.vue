<template>
  <div class="mt-4">
    <!-- <iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/5Zlwu2g4rzTNfyu28L1bWv?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
    <iframe style="border-radius:12px" src="https://open.spotify.com/track/5Zlwu2g4rzTNfyu28L1bWv?si=71c2e60ee36243f0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe> -->
    <!-- https://open.spotify.com/track/5Zlwu2g4rzTNfyu28L1bWv?si=71c2e60ee36243f0 -->

    <b-row>
      <b-col lg="8" class="text-left">
        <div class="mb-sm-4">
          <span class="h5 mr-3">Post</span>
          <span id="domain-tag" class="">{{ getClickDomain }}</span>
        </div>
        <div class="text-right my-3 mb-8">
          <!-- {{ selectFilter }} -->
          <b-row align-h="end">
            <b-col cols="auto" class="" vertical="center">
              <i class="fa fa-sliders fa-2x my-1"> </i>
            </b-col>
            <b-col cols="" sm="" md="3" class="mx-2 p-0 mb-2">
              <v-select
                v-model="select"
                :options="options"
                placeholder="filter"
                label="text"
              >
              </v-select
            ></b-col>
            <b-col cols="" sm="" md="3" class="mx-2 p-0 mb-2">
              <v-select
                v-model="selectFilter"
                :options="optionsFilter"
                placeholder="filter"
                label="text"
              >
              </v-select
            ></b-col>
          </b-row>
        </div>

        <LineChartFilter :typeChart="selectFilter" :label="select" />
        <!-- <LineChart /> -->
      </b-col>
      <b-col lg="4">
        <div class="h5 text-left ">
          <span class="d-inline-block mr-3">Total Post</span>
          <div class="d-inline-block">
            <div v-if="startd === endd" class="text-left onedate">
              <i class="far fa-calendar-alt"></i> {{ startd }}
            </div>
            <div v-else class="text-left twodate">
              <i class="far fa-calendar-alt"></i> {{ startd }} - {{ endd }}
            </div>
          </div>
        </div>
        <BarChart />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { mapGetters } from "vuex";

// import LineChart from "@/components/chart/LineChart.vue";
import BarChart from "@/components/chart/BarChart.vue";
import LineChartFilter from "../chart/LineChartFilter.vue";
import moment from "moment";
export default {
  watch: {
    getArrDate: function() {
      this.startd = this.getSdateDm.slice(0, 10);
      this.endd = this.getEdateDm.slice(0, 10);
    },
  },
  components: {
    // LineChart,
    BarChart,
    vSelect,
    LineChartFilter,
  },
  computed: {
    ...mapGetters(["getClickDomain", "getSdateDm", "getEdateDm", "getArrDate"]),
  },
  data() {
    return {
      optionsFilter: [
        "domain",
        "platform",
        "sentiment",
        // "subdomain",
        // "keyword",
      ],
      selectFilter: "domain",
      select: "posts",
      options: ["posts", "comments", "messages", "engages", "views"],
      startd: "",
      endd: "",
      filter: 0,
    };
  },
  created() {
    this.startd = moment(new Date())
      .format()
      .slice(0, 10);
    this.endd = moment(new Date())
      .format()
      .slice(0, 10);
  },
};
</script>

<style scoped>
#domain-tag {
  padding: 2px 10px;
  border-radius: 10px;
  background: #fed16e;
  box-shadow: 2px 2px 4px 0 rgb(0 0 0 / 20%);
  /* font-weight: 600; */
}
/* #search-input {
  box-sizing: border-box;
  background-image: url("@/assets/search_icon.png");
  background-position: 5% 10px;
  background-repeat: no-repeat;
  padding: 7px 20px 7px 45px;
  border: none;
  text-align: center;
} */
.btn-secondary {
  color: #4c412b;
  background-color: #83704900;
  border-color: #4c412b;
}
.fa-sliders {
  color: #4c412b;
  font-size: 28px;
}
.active {
  background: rgb(243, 16, 0) !important;
}
</style>
