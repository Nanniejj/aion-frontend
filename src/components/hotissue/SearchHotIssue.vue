<template>
  <div>
    <b-row align-h="center">
      <!-- {{getStatusSearch}} -->
      <!-- {{ select_issue }}{{ getListIssue }} -->
      <b-col sm="12" md="6" lg="4">
        <div class="text-left">Date</div>
        <section
          id="date-picker"
          class="d-inline position-relative align-bottom"
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
            class="my-1"
            >{{ valueDate }}</date-picker
          >
        </section>
      </b-col>
      <b-col sm="12" md="6" lg="4">
        <div class="text-left">Issue</div>
        <v-select
          multiple
          :options="getListIssue"
          v-model="select_issue"
          id="search-input"
          class="subdomain my-1"
          placeholder="Select Issue"
          @input="clickIssue"
        ></v-select>
      </b-col>
      <b-col sm="12" md="6" lg="4">
        <div class="text-left">Social</div>
        <v-select
          multiple
          :options="itemSocial"
          v-model="select_social"
          id="search-input"
          class="subdomain my-1"
          placeholder="Select Platform"
          @input="clickSocial"
        ></v-select>
      </b-col>

      <b-col>
        <b-button
          variant="warning"
          id="btn-sch"
          class="ml-3 mt-3"
          @click="searchIssue"
          >ค้นหา</b-button
        >
      </b-col>
    </b-row>
    <hr class="m-3 mt-5" />
  </div>
</template>

<script>
import "vue-select/dist/vue-select.css";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  computed: {
    ...mapGetters(["getDataIssue", "getListIssue", "getStatusSearch"]),
  },
  data() {
    return {
      select_social: [],
      select_issue: [],
      keyword: "",
      valueDate: [
        moment(new Date())
          .format()
          .slice(0, 10),
        moment(new Date())
          .format()
          .slice(0, 10),
      ],
      itemSocial: [
        "All",
        "facebook",
        "twitter",
        "pantip",
        "news",
        "youtube",
        "instagram",
        "blockdit",
        "tiktok",
      ],
    };
  },
  methods: {
    clickSocial(){
      const result = this.select_social.filter((word) => word == "All");
      let rs = String(result);
      if (rs == "All") {
        if (this.select_social[0]=='All'&&this.select_social.length >= 2) {
          this.select_social = this.select_social.slice(1)
        } else {
          this.select_social = ["All"];
        }
      }
      // console.log('this.select_social',this.select_social);
    },
    clickIssue() {
      const result = this.select_issue.filter((word) => word == "All");
      let rs = String(result);

      if (rs == "All") {
        if (this.select_issue[0]=='All'&&this.select_issue.length >= 2) {
          this.select_issue = this.select_issue.slice(1)
        } else {
          this.select_issue = ["All"];
        }
      }
      // console.log("issue", this.select_issue );
    },
    searchIssue() {
      let issue, social;
      if (this.select_issue.includes("All")) {
        issue = localStorage.getItem("issue").split(",");
      } else {
        issue = this.select_issue;
      }
      if (this.select_social.includes("All")) {
        social = [
          "facebook",
          "twitter",
          "pantip",
          "news",
          "youtube",
          "instagram",
          "blockdit",
          "tiktok",
        ];
      } else {
        social = this.select_social;
      }
      this.$store.commit("setStatusSearch", {
        source: social,
        keyword: issue,
        date: this.valueDate,
      });
      this.$store.commit("setSocialIssue", social);
      this.$store.commit("setSelectIssue", issue);
      this.$store.commit("setDateIssue", this.valueDate);
    },
    getDataTable() {
      const axios = require("axios").default;
      var config = {
        method: "get",
        url: "https://api2.cognizata.com/api/v2/userposts/getHotissue",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      axios(config)
        .then((response) => {
          this.$store.commit("setDataIssue", response.data);
          let arr = response.data.map((result) => {
            return result.name;
          });
          this.$store.commit("setListIssue", arr);
          //  localStorage.setItem("issue",arr)
          this.select_issue = arr;
        })
        .catch(function(error) {
          this.$fire({
            title: "กรุณาลองอีกครั้ง",
            type: "error",
            showConfirmButton: false,
            timer: 1000,
          });
          console.log(error);
        });
    },
  },
  created() {
    // this.getDataTable();
    let arris = localStorage.getItem("issue").split(",");
    console.log("arris", ["All", ...arris]);

    this.select_issue = ["All"];
    this.select_social = ["All"];
    this.$store.dispatch("fetchListIssue");
  },
};
</script>

<style scoped>
.mx-datepicker-range {
  width: -webkit-fill-available;
}
#btn-sch {
  background-color: #fed16ebf;
  border-radius: 7px;
}
#btn-sch:hover {
  background: rgb(243, 190, 76);
}
#input {
  box-sizing: border-box;
  background-image: url("/search_icon.png");
  background-position: 14px 10px;
  background-repeat: no-repeat;
  padding: 7px 20px 7px 45px;
  border: none;
  background-color: #ddddddc7;
  text-align: center;
  border-radius: 7px;
}
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .mx-datepicker-range {
    width: -webkit-fill-available !important;
  }
}
</style>
