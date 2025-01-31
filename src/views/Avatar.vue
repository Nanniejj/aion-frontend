<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />

    <div id="content">
      <h1 class="title">Avatar</h1>
      <div>
        <vue-element-loading
          :active="getLoadStatus"
          size="80"
          background-color="rgba(255, 255, 255, 0.3)"
          color="#b6ac9a"
        />
        <div>
          <AvatarUser v-if="getShowUser" />
          <div v-if="!getShowUser"><AvatarTeam v-if="getShowManage" /></div>
          <div v-if="!getShowManage">
            <div
              class="row justify-content-end d-inline-block float-right my-2 mb-3"
            >
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
                  @change="checkDateRange()"
                  id="date-domain"
                  >{{ valueDate }}</date-picker
                >
              </section>
              <i
                class="fas fa-print fa-2x d-inline ml-2 mr-2"
                style="cursor: pointer"
                @click="printWindow()"
              ></i>
            </div>
            <div class="d-inline-block float-left">
              <b-row align-v="center" class="bg-row">
                <b-col cols="">
                  <span v-if="getAvatarSource">
                    <img
                      v-if="getAvatarSource === 'twitter'"
                      :src="imgtw"
                      class="social-img"/>
                    <img
                      v-if="getAvatarSource === 'facebook'"
                      :src="imgfb"
                      class="social-img"/>
                    <img
                      v-if="getAvatarSource === 'pantip'"
                      :src="imgpt"
                      class="social-img"/>
                    <img
                      v-if="getAvatarSource === 'youtube'"
                      :src="imgyt"
                      class="social-img"/>
                    <img
                      v-if="getAvatarSource === 'news'"
                      :src="imgnw"
                      class="social-img"/>
                    <img
                      v-if="getAvatarSource === 'instagram'"
                      :src="imgig"
                      class="social-img"/>
                    <img
                      v-if="getAvatarSource === 'blockdit'"
                      :src="imgbd"
                      class="social-img"/>
                    <img
                      v-if="getAvatarSource === 'tiktok'"
                      src="@/assets/Tiktok.png"
                      class="social-img"/>
                    <img
                      v-if="getAvatarSource === 'threads'"
                      src="@/assets/Threads.png"
                      class="social-img"
                  /></span>
                  
                </b-col>
                <!-- <b-col>
                  <b-form-select
          v-model="selected"
          :options="options"
          @change="selectChange(selected)"
        ></b-form-select>
                </b-col> -->
                <b-col cols="">
                  <div
                    v-if="valueDate && valueDate[0] === valueDate[1]"
                    class="text-left onedate"
                  >
                    <i class="far fa-calendar-alt"></i> {{ valueDate[0] }}
                  </div>
                  <div v-else class="text-left twodate">
                    <i class="far fa-calendar-alt"></i> {{ valueDate[0] }} -
                    {{ valueDate[1] }}
                  </div>
                </b-col>
              </b-row>
            </div>
          </div>
          <br />
        </div>

        <AvatarStatic v-if="!getShowManage" class="mt-2" />
        <b-row>
          <b-col sm="12" md="6"> <AvatarPostChart v-if="!getShowManage" style="width: 100%;"/></b-col>
          <b-col sm="12" md="6" > <AvatarEngageChart v-if="!getShowManage" style="width: 100%;"/></b-col>
        </b-row>
        <!-- <AvatarPostChart v-if="!getShowManage" />
        <AvatarEngageChart v-if="!getShowManage" /> -->
        <AvatarTable v-if="!getShowManage" />
        <!-- <AvatarDate/> -->
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URL } from "@/common/config";
import HomeNav from "@/components/HomeNav.vue";
import { mapGetters } from "vuex";
import AvatarTop5 from "@/components/avatar/AvatarTop5.vue";
import AvatarTable from "@/components/avatar/AvatarTable.vue";
import AvatarChart from "@/components/avatar/AvatarChart.vue";
import AvatarTeam from "@/components/avatar/AvatarTeam.vue";
import AvatarUser from "@/components/avatar/AvatarUser.vue";
import moment from "moment";
import AvatarEngageChart from "../components/avatar/AvatarEngageChart.vue";
import AvatarStatic from "../components/avatar/AvatarStatic.vue";
import AvatarPostChart from "../components/avatar/AvatarPostChart.vue";
export default {
  components: {
    HomeNav,
    AvatarTop5,
    AvatarTable,
    AvatarChart,
    AvatarTeam,
    AvatarUser,
    AvatarEngageChart,
    AvatarStatic,
    AvatarPostChart,
  },
  computed: {
    ...mapGetters([
      "getSelected",
      "getAvatar",
      "getLoadStatus",
      "getShowManage",
      "getShowUser",
      "getToSection",
      "getDataListAvatar",
      "getAvatarSource",
    ]),
  },
  watch: {
    getAvatarSource() {
      this.selectData();
    },
  },
  data: function() {
    return {
      imgtw: require("@/assets/Twitter.png"),
      imgfb: require("@/assets/Facebook.png"),
      imgpt: require("@/assets/board.png"),
      imgig: require("@/assets/Instagram.png"),
      imgnw: require("@/assets/News.png"),
      imgyt: require("@/assets/Youtube.png"),
      imgbd: require("@/assets/Blockdit.png"),
      start_date: "",
      end_date: " ",
      valueDate: [
        moment(new Date())
          .format()
          .slice(0, 10),
        moment(new Date())
          .format()
          .slice(0, 10),
      ],
      selectedTab: false,
    };
  },
  methods: {
    checkDateRange() {
      const startDate = moment(this.valueDate[0]);
      const endDate = moment(this.valueDate[1]);

      const diffDays = endDate.diff(startDate, "days");

      if (diffDays > 31) {
        alert("กรุณาเลือกช่วงเวลาที่ไม่เกิน 1 เดือน หรือ 31 วัน");
        this.valueDate[1] = startDate.add(31, "days").format("YYYY-MM-DD");
      } else {
        this.selectData(); // Call your existing method
      }
    },
    goAvatarTeam() {
      // this.$router.push({ name: "AvatarTeam" });
      this.$store.commit("setShowManage", true);
    },
    printWindow: function() {
      try {
        window.print();
      } catch (err) {
        console.log(err);
      }
    },
    selectData() {
      if (this.valueDate[0] != null) {
        console.log(this.valueDate[0], this.valueDate[1]);
        this.start_date = this.valueDate[0] + "T00:00:00";
        this.end_date = this.valueDate[1] + "T23:59:59";
        this.$store.commit("setRageStartdate", this.start_date);
        this.$store.commit("setRageEnddate", this.end_date);
        this.$store.dispatch("fetchListAvatar", {
          start: this.start_date,
          end: this.end_date,
          source: this.getAvatarSource,
        });
        // this.$store.dispatch("fetchAvatar",{start_date:this.start_date,end_date:this.end_date});
      } else {
        let today = moment(new Date())
          .format()
          .slice(0, 10);
        this.start_date = today + "T00:00:00";
        this.end_date = today + "T23:59:59";
        // this.$store.dispatch("fetchAvatar",{start_date:this.start_date,end_date:this.end_date});
        this.$store.dispatch("fetchListAvatar", {
          start: this.start_date,
          end: this.end_date,
          source: "twitter",
        });
      }
    },
    tab() {
      if (this.selectedTab) {
        this.selectedTab = false;
        document.getElementById("text-table").style.backgroundColor =
          "rgba(254, 209, 110, 0.452)";
        document.getElementById("text-chart").style.backgroundColor = "#fff0";
        document.getElementById("scroll").style.display = "block";
        console.log("log1");
      } else {
        this.selectedTab = true;
        document.getElementById("text-chart").style.backgroundColor =
          "rgba(254, 209, 110, 0.452)";
        document.getElementById("text-table").style.backgroundColor = "#fff0";
        document.getElementById("scroll").style.display = "none";
      }
    },
    exportscsv: function() {
      var token = "1e1fb0d554057e4b6e8cbd8a73954291627ae5a3";
      const AuthStr = "Token " + token;
      var data = JSON.stringify({
        date: this.valueDate,
        data_json: JSON.stringify({ department: this.getAvatar }),
      });

      var config = {
        method: "post",
        url: API_URL + "/v1/download/avatar/csv/",
        headers: {
          Authorization: AuthStr,
          "Content-Type": "application/json",
        },
        responseType: "blob",
        data: data,
      };

      axios(config)
        .then(function(response) {
          //console.log(response)
          let today = new Date();
          let blob = new Blob([response.data], {
            type: "application/force-download",
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download =
            "avatar_twitter_" +
            today
              .toDateString()
              .split(" ")
              .join("_") +
            ".xlsx";
          link.click();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    exportcsv: function() {
      this.$store.dispatch("fetchCsvAvatar", {
        date: this.valueDate,
        data_json: this.getAvatar,
      });
    },
    reloadData() {
      this.$store.dispatch("fetchAvatar", {
        start_date: this.start_date,
        end_date: this.end_date,
      });
    },
  },

  mounted() {
    let today = moment(new Date())
      .format()
      .slice(0, 10);
    this.start_date = today + "T00:00:00";
    this.$store.commit("setRageStartdate", this.start_date);
    this.end_date = today + "T23:59:59";
    this.$store.commit("setRageEnddate", this.end_date);
    //this.$store.dispatch("fetchAvatar",{date:this.valueDate});
    // this.$store.dispatch('fetchListAvatar',{start:  this.start_date,end:this.end_date,source:"twitter"})
    this.$store.dispatch("fetchListAvatar", {
      start: this.start_date,
      end: this.end_date,
      source: "twitter",
    });
  },
};
</script>

<style scoped>
.bg-row {
  background-color: #e4e4e4;
  padding: 0px 0px;
  border-radius: 18px;
  box-shadow: rgba(14, 63, 126, 0.06) 0px 0px 0px 1px,
    rgba(42, 51, 70, 0.03) 0px 1px 1px -0.5px,
    rgba(42, 51, 70, 0.04) 0px 2px 2px -1px,
    rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px,
    rgba(42, 51, 70, 0.03) 0px 5px 5px -2.5px,
    rgba(42, 51, 70, 0.03) 0px 10px 10px -5px,
    rgba(42, 51, 70, 0.03) 0px 24px 24px -8px;
}
.onedate,
.twodate {
  width: max-content;
  background-color: #e4e4e4;
  padding: 0px 15px;
  font-size: 15px;
}
.social-img {
  width: 45px;
  display: inline-block;
}
#text-chart {
  font-size: 1.25rem;
  color: #4c412b;
  background: transparent;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 6px;
}
#text-table {
  font-size: 1.25rem;
  min-height: 1.5rem;
  vertical-align: bottom;
  margin-right: 10px;
  color: #4c412b;
  background: rgba(254, 209, 110, 0.452);
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 6px;
}
.custom-switch {
  display: -webkit-inline-box;
}
#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
}

.btn-outline-secondary {
  color: #ffffff !important;
  background-color: #fed16e !important;
  border-color: #fed16e !important;
}
.btn-primary:not(:disabled):not(.disabled).active,
.btn-primary:not(:disabled):not(.disabled):active,
.show > .btn-primary.dropdown-toggle {
  color: #4c412b;
  background-color: #ede7dd;
  width: 125px;
  border-color: transparent;
}

.show > .btn-primary.dropdown-toggle:focus {
  box-shadow: none !important;
}

.btn-primary:focus {
  box-shadow: none !important;
}

#submit {
  font-weight: bold;
  color: #4e432d;
  border: 2px solid #fed16e;
  line-height: 1;
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color: #fed16e;
  padding: 0.6rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  box-shadow: 3px 4px 4px #888888;
}

#submit:hover {
  background-color: #fed16e;
  color: white;
}

.btn.focus,
.btn:focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0);
}
.h-ava {
  /* height: 75em; */
  overflow-y: hidden;
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .bg-row {
    zoom: 80%;
    margin-bottom: 20px;
  }
  #content > div.row.justify-content-end {
    margin: auto;
    margin-right: unset !important;
  }
  #content > div.row.justify-content-end > button {
    margin: auto;
    margin-bottom: 20px;
  }
  #date-picker {
    margin-top: 20px;
  }
}
</style>
