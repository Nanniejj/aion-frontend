<template>
  <div class="ml-3 mr-3 col-lg-10 col-md-11 m-auto">
    <SearchHotIssue />
    <div class="text-right my-3 mb-8 d-none">
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

    <!-- <LineChartFilterIssue :typeChart="selectFilter" :label="select"/> -->
    <ChartHotIssue :datachart="getChartDataIssue" />
    <AddHotIssue class="btn-his" />

    <b-row class="mt-3">
      <b-col lg="4" md="4" sm>
        <div class="text-left ml-2">
          <span class="h5 font-weight-bold">Top 10 #Hashtag</span>
        </div>
        <TopHashtagIssue class="htop" />
      </b-col>
      <b-col lg="8" md="8" sm>
        <div class="text-left ml-2">
          <span class="h5 font-weight-bold">Top 10 Posts</span>
        </div>

        <TopPostIssue class="htop" />
      </b-col>
    </b-row>
    <!-- <SocialSelect :tabsocial="'issue'" />    -->
    <AllPostIssue />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

// import SocialSelect from "@/components/domain/SocialSelect.vue";
import SearchHotIssue from "@/components/hotissue/SearchHotIssue.vue";
import AddHotIssue from "@/components/hotissue/AddHotIssue.vue";
import TopHashtagIssue from "@/components/hotissue/TopHashtagIssue.vue";
import TopPostIssue from "@/components/hotissue/TopPostIssue.vue";
import AllPostIssue from "@/components/hotissue/AllPostIssue.vue";
import ChartHotIssue from "./ChartHotIssue.vue";
import LineChartFilterIssue from "./LineChartFilterIssue.vue";
export default {
  components: {
    SearchHotIssue,
    AddHotIssue,
    TopHashtagIssue,
    TopPostIssue,
    AllPostIssue,
    ChartHotIssue,
    LineChartFilterIssue,
    // SocialSelect
  },
  computed: {
    ...mapGetters([
      "getLoadAllPostIssue",
      "getSocialIssue",
      "getSelectIssue",
      "getDateIssue",
      "getStatusSearch",
      "getChartDataIssue",
    ]),
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
    };
  },
};
</script>

<style scoped>
.htop {
  height: 650px;
  overflow: scroll;
  padding: 10px;
}
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .btn-his {
    zoom: 85%;
  }
}
</style>
