<template>
  <div>
    <b-container>
      <div>
        <div class="text-right">
          <div class="d-inline-block mt-2 mb-1">
            <div v-if="startd === endd" class="text-left onedate">
              <i class="far fa-calendar-alt"></i> {{ startd }}
            </div>
            <div v-else class="text-left twodate">
              <i class="far fa-calendar-alt"></i> {{ startd }} - {{ endd }}
            </div>
          </div>
        </div>
        <b-row v-if="getStatReport && getStatReport.stats">
          <b-col sm align-self="center" class="my-1">
            
            <span>
              <span v-if="getStatReport.stats.profile_image">
                <!-- <span v-if="setAltImg"> -->
                <b-avatar
                  @error="setAltImg"
                  size="70px"
                  :src="getStatReport.stats.profile_image"
                  loading="lazy"
                  class="imgpro shadow-sm rounded badge-light rounded-circle"
                ></b-avatar>
              </span>
              <span v-else>
                <b-avatar
                  class="imgpro shadow-sm rounded badge-light rounded-circle"
                  size="70px"
                ></b-avatar
              ></span>

              <span class="left">
                <img
                  v-if="getStatReport.stats.source == 'twitter'"
                  src="@/assets/Twitter.png"
                  class="social-img"
                />
                <img
                  v-else-if="getStatReport.stats.source == 'facebook'"
                  src="@/assets/Facebook.png"
                  class="social-img"
                />
                <img
                  v-if="getStatReport.stats.source == 'news'"
                  src="@/assets/News.png"
                  class="social-img"
                />
                <img
                  v-if="getStatReport.stats.source == 'pantip'"
                  src="@/assets/Pantip.png"
                  class="social-img"
                />
                <img
                  v-if="getStatReport.stats.source == 'instagram'"
                  src="@/assets/Instagram.png"
                  class="social-img"
                />
                <img
                  v-if="getStatReport.stats.source == 'youtube'"
                  src="@/assets/Youtube.png"
                  class="social-img"
                />
                <img
                  v-if="getStatReport.stats.source == 'blockdit'"
                  src="@/assets/Blockdit.png"
                  class="social-img"
                />
                <img
                  v-if="getStatReport.stats.source == 'tiktok'"
                  src="@/assets/Tiktok.png"
                  class="social-img"
                />
              </span>
            </span>

            <div class="my-3">
              <!-- {{getStatReport.stats.account_url}} -->
              <a
                v-bind:href="getStatReport.stats.account_url"
                target="_blank"
                style="color: #2c3e50"
              >
                <span class="lim-text h5" v-if="nameyt&&getStatReport.stats.source=='youtube'">
                {{nameyt}} </span
                >
                <span class="lim-text h5" v-else>
                  {{ getStatReport.stats.account_name }} <i class="fa fa-external-link"/></span
                >

                <span></span>
                <!-- <i class="fa fa-external-link"/> -->
              </a>
            </div>
          </b-col>
          <b-col align-self="center" sm>
            <b-card class="py-3 my-1">
              <vue-element-loading
                :active="getLoadReportStat"
                size="80"
                background-color="rgba(255, 255, 255, 0.3)"
                color="#fbf7f6"
              />
              <div>Posts</div>
              <div class="num-text">
                {{ getStatReport.stats.totalPost | numFormat }}
              </div>
            </b-card>
          </b-col>
          <b-col align-self="center" sm>
            <b-card class="py-3 my-1">
              <vue-element-loading
                :active="getLoadReportStat"
                size="80"
                background-color="rgba(255, 255, 255, 0.3)"
                color="#fbf7f6"
              />
              <div>Engagement</div>
              <div class="num-text">
                {{ getStatReport.stats.engagement | numFormat }}
              </div>
            </b-card>
          </b-col>
          <b-col align-self="center" sm>
            <b-card class="py-3 my-1">
              <vue-element-loading
                :active="getLoadReportStat"
                size="80"
                background-color="rgba(255, 255, 255, 0.3)"
                color="#fbf7f6"
              />
              <div>Follower</div>
              <div class="num-text">
                {{ getStatReport.stats.follower | numFormat }}
              </div>
            </b-card>
          </b-col>
        </b-row>
      </div>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["getDateReport", "getStatReport", "getLoadReportStat"]),
  },
  watch: {
    getDateReport() {
      this.startd = this.getDateReport[0].slice(0, 10);
      this.endd = this.getDateReport[1].slice(0, 10);
    },
  },
  data() {
    return {
      nameyt: "",
      startd: "",
      endd: "",
      link_original: "https://twitter.com/Thipong_U/",
      default_avatar: "user.svg",
      source: "twitter",
    };
  },
  methods: {
    setAltImg(event) {
      event.target.src = this.default_avatar;
    },
  },
  mounted() {
    this.nameyt = localStorage.getItem("nameReport");
  },
  created() {
      let date = localStorage.getItem("dateReport").split(",");
    this.startd = date[0].slice(0, 10);
    this.endd = date[1].slice(0, 10);
  },
};
</script>

<style scoped>
.fa-external-link{
  font-size: 15px;
}
.b-avatar.imgpro.badge-secondary {
  color: #5e666d !important;
  background-color: #ddddddad !important;
  font-weight: bold;
}
.lim-text {
  width: 280px;
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: break-word;
  overflow: hidden;
}
.num-text {
  font-size: 25px;
}
.card {
  border: 0px solid rgba(0, 0, 0, 0.125);
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
  border-radius: 7px;
  text-align: left;
}
.box-profile {
  width: 100%;
  height: auto;
  padding: 20px 0px;
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  /* display: flex;
  align-items: center;
  justify-content: center; */
}
.social-img {
  width: 50px;
  margin-left: -12px;
  margin-top: 19px;
  z-index: 0;
  position: relative;
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .b-avatar.imgpro.badge-secondary {
    width: 70px !important;
    height: 70px !important;
  }
}
</style>
