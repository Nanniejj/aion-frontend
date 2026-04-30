<template>
  <div class="homenav">
    <div class="row colorbg" style="padding-top: 2%">
      <router-link to="/platform" id="logo-home">
        <img src="@/assets/Aion.png" class="imgab" />
      </router-link>
    </div>

    <div class="row justify-content-end colorbg align-items-center">
      <i class="txt-icon fas fa-user-circle" style="margin-left: 10px; font-size: 24px; color: #fed16e"></i>
      <span id="user" class="ml-1 mr-2">{{ username }}</span>

      <div class="txt-lo" data-toggle="modal" data-target="#myModal">
        <a style="color: #fed16e; margin-top: -2rem">Logout</a>
      </div>
    </div>

    <!-- ============================ PHONE NAV ============================ -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light" id="nav-phone">
      <a class="navbar-brand"></a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto" id="nav-bar">
          <li class="nav-item" id="li-nav">
            <router-link to="/domain" tag="p" exact>
              <a class="nav-link">
                <img src="../assets/Dashboard.png" alt="logo" class="img-nav" />
                <strong>Domain</strong>
              </a>
            </router-link>
          </li>

          <li class="nav-item" id="li-nav">
            <router-link to="/platform" tag="p" exact>
              <a class="nav-link">
                <img src="../assets/Sentiment.png" alt="logo" class="img-nav" />
                <strong>Platform</strong>
              </a>
            </router-link>
          </li>

          <li class="nav-item" id="li-nav">
            <router-link to="/wordcloud" tag="p">
              <a class="nav-link">
                <img src="../assets/Wordcloud.png" alt="logo" class="img-nav" />
                <strong>Wordcloud</strong>
              </a>
            </router-link>
          </li>

          <!-- <li class="nav-item" id="li-nav">
            <router-link to="/ranking" tag="p">
              <a class="nav-link">
                <img src="../assets/Ranking.png" alt="logo" class="img-nav" />
                <strong>Ranking</strong>
              </a>
            </router-link>
          </li> -->

          <!-- Ranking (dropdown; Domain/Person) -->
          <li class="nav-item dropdown" id="li-nav">
            <a class="nav-link dropdown-toggle" id="navbarDropdownRankingPhone" role="button" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false" tag="p"
              :class="{ 'router-link-exact-active': isActiveRanking }">
              <img src="../assets/Ranking.png" alt="logo" class="img-nav" />
              <strong>Ranking</strong>
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdownRankingPhone">
              <router-link to="/ranking" class="dropdown-item" :class="{ dropdownStyle: $route.path === '/ranking' }"
                id="nav-router">
                <center><strong>Ranking</strong></center>
              </router-link>

              <router-link to="/personranking" class="dropdown-item"
                :class="{ dropdownStyle: $route.path === '/personranking' }" id="nav-router">
                <center><strong>Person Ranking</strong> <span class="small"> (beta)</span></center>
              </router-link>
            </div>
          </li>


          <li class="nav-item" id="li-nav">
            <router-link to="/map" tag="p">
              <a class="nav-link">
                <img src="../assets/mapx.png" alt="logo" class="img-nav" style="margin-bottom: 8px" />
                <strong>Map</strong><span class="small"> (beta)</span>
              </a>
            </router-link>
          </li>

          <!-- Influencer -->
          <li class="nav-item dropdown" id="li-nav">
            <a class="nav-link dropdown-toggle" id="navbarDropdownInfluencerPhone" role="button" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false" tag="p"
              :class="{ 'router-link-exact-active': isActiveInfluencer }">
              <img src="@/assets/Influ.png" alt="logo" class="img-nav" />
              <strong>Influencer</strong>
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdownInfluencerPhone">
              <router-link to="/influencertop" class="dropdown-item"
                :class="{ dropdownStyle: $route.path === '/influencertop' }" id="nav-router">
                <center><strong>Top Influencer</strong></center>
              </router-link>

              <router-link to="/influencerHub" class="dropdown-item"
                :class="{ dropdownStyle: $route.path === '/influencerHub' }" id="nav-router">
                <center><strong>Influencer Hub</strong></center>
              </router-link>
            </div>
          </li>

          <!-- Hot Issue (now dropdown, default click → /timeline) -->
          <li class="nav-item dropdown" id="li-nav">
            <a class="nav-link dropdown-toggle" id="navbarDropdownHotPhone" role="button" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false" tag="p"
              :class="{ 'router-link-exact-active': isPathHotIssue }">
              <img src="@/assets/Evaluation.png" alt="logo" class="img-nav" />
              <!-- <img src="../assets/Hotissue.png" alt="logo" class="img-nav" /> -->
              <strong>Search</strong><span class="small"> </span>
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdownHotPhone">
              <router-link to="/timeline" class="dropdown-item" :class="{ dropdownStyle: $route.path === '/timeline' }"
                id="nav-router">
                <center><strong>Timeline</strong><span class="small"> (beta)</span></center>
              </router-link>
              <!-- <router-link to="/imagesearch" class="dropdown-item"
                :class="{ dropdownStyle: $route.path === '/imagesearch' }" id="nav-router">
                <center><strong>Image</strong><span class="small"> (beta)</span></center>
              </router-link> -->
              <router-link to="/hotissue" class="dropdown-item" :class="{ dropdownStyle: $route.path === '/hotissue' }"
                id="nav-router">
                <center><strong>Hot Issue</strong></center>
              </router-link>
            </div>
          </li>


          <!-- Monitor (moved Avatar here, removed Timeline) -->
          <li class="nav-item dropdown" id="li-nav">
            <a class="nav-link dropdown-toggle" id="navbarDropdownMonitorPhone" role="button" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false" tag="p"
              :class="{ 'router-link-exact-active': isActiveMonitor }">
              <img src="../assets/monitor.png" alt="logo" class="img-nav" />
              <strong>Monitor</strong>
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdownMonitorPhone">
              <router-link to="/monitorlist" class="dropdown-item"
                :class="{ dropdownStyle: $route.path === '/monitorlist' }" id="nav-router">
                <center><strong>Monitor</strong></center>
              </router-link>
              <router-link to="/feed" class="dropdown-item d-none" :class="{ dropdownStyle: $route.path === '/feed' }"
                id="nav-router">
                <center><strong>Feed</strong></center>
              </router-link>
              <router-link to="/report" class="dropdown-item d-none"
                :class="{ dropdownStyle: $route.path === '/report' }" id="nav-router">
                <center><strong>Report</strong></center>
              </router-link>
              <router-link to="/avatar" class="dropdown-item" :class="{ dropdownStyle: $route.path === '/avatar' }"
                id="nav-router">
                <center><strong>Avatar</strong></center>
              </router-link>
            </div>
          </li>


          <!-- Keyword (hidden) -->
          <li class="nav-item d-none" id="li-nav">
            <router-link to="/keyword" tag="p">
              <a class="nav-link">
                <img src="../assets/keyword2.png" alt="logo" class="img-nav" style="margin-bottom: 8px" />
                <strong>Keyword</strong>
                <span class="small"> </span>
              </a>
            </router-link>
          </li>

          <!-- Evaluation now only Gsearch -->
          <li class="nav-item dropdown d-none" id="li-nav">
            <a class="nav-link dropdown-toggle" id="navbarDropdownEvalPhone" role="button" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false" tag="p"
              :class="{ 'router-link-exact-active': isActiveEvaluation }">
              <img src="../assets/Evaluation.png" alt="logo" class="img-nav" />
              <strong>Evaluation</strong>
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdownEvalPhone">
              <router-link to="/gsearch" class="dropdown-item" :class="{ dropdownStyle: $route.path === '/gsearch' }"
                id="nav-router">
                <center><strong>Gsearch</strong></center>
              </router-link>
            </div>
          </li>

          <li class="nav-item" id="li-nav">
            <router-link to="/setting" tag="p">
              <a class="nav-link">
                <img src="../assets/Setting.png" alt="logo" class="img-nav" style="margin-bottom: 8px" />
                <strong>Setting</strong>
              </a>
            </router-link>
          </li>

          <li class="nav-item" id="li-nav" v-if="seen">
            <router-link to="/templateusermanagement" tag="p">
              <a class="nav-link">
                <img src="../assets/userx.png" alt="logo" class="img-nav" style="margin-bottom: 8px" />
                <strong>User Management</strong>
              </a>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- ============================ DESKTOP NAV ============================ -->
    <b-navbar toggleable="sm" type="light" variant="light" id="nav-desktop">
      <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>
      <b-collapse id="nav-text-collapse" is-nav
        class="navbar navbar-expand-sm bg-light navbar-light justify-content-center">
        <b-navbar-nav>
          <b-nav-item id="nav-con1">
            <router-link to="/domain" tag="p" exact>
              <a class="nav-link">
                <img src="@/assets/Dashboard.png" alt="logo" class="img-nav" />
                <a class="nav-link titlenav">
                  <strong>Domain</strong>
                </a>
              </a>
            </router-link>
          </b-nav-item>

          <b-nav-item id="nav-con1">
            <router-link to="/platform" tag="p" exact>
              <a class="nav-link">
                <img src="@/assets/Sentiment.png" alt="logo" class="img-nav" />
                <a class="nav-link titlenav">
                  <strong>Platform</strong>
                </a>
              </a>
            </router-link>
          </b-nav-item>

          <b-nav-item id="nav-con2">
            <router-link to="/wordcloud" tag="p">
              <a class="nav-link">
                <img src="@/assets/Wordcloud.png" alt="logo" class="img-nav" />
                <a class="nav-link titlenav">
                  <strong>Wordcloud</strong>
                </a>
              </a>
            </router-link>
          </b-nav-item>

          <!-- <b-nav-item id="nav-con1">
            <router-link to="/ranking" tag="p">
              <a class="nav-link">
                <img src="@/assets/Ranking.png" alt="logo" class="img-nav" />
                <a class="nav-link titlenav">
                  <strong>Ranking</strong>
                </a>
              </a>
            </router-link>
          </b-nav-item> -->
          <!-- Ranking (dropdown; Domain/Person) -->
          <b-nav-item id="nav-con1">
            <b-nav-item-dropdown no-caret id="dp-color" class="">
              <template slot="button-content">
                <a class="nav-link" data-toggle="tab" tag="p" :class="{ 'router-link-exact-active': isActiveRanking }"
                  style="padding: 0">
                  <img src="@/assets/Ranking.png" alt="logo" class="img-nav" />
                  <a class="nav-link titlenav">
                    <strong>Ranking</strong>
                  </a>
                </a>
              </template>

              <b-dropdown-item to="/ranking">
                <router-link to="/ranking" tag="a" :style="dropdownStyle"
                  :class="{ dropdownStyle: $route.path === '/ranking' }" id="dp-txt">Ranking</router-link>
              </b-dropdown-item>

              <b-dropdown-item to="/personranking">
                <router-link to="/personranking" tag="a" :style="dropdownStyle"
                  :class="{ dropdownStyle: $route.path === '/personranking' }" id="dp-txt">Person Ranking <span
                    class="small">
                    (beta)</span></router-link>
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-nav-item>

          <b-nav-item id="nav-con1">
            <router-link to="/map" tag="p">
              <a class="nav-link">
                <img src="@/assets/mapx.png" alt="logo" class="img-nav" />
                <a class="nav-link titlenav">
                  <strong>Map</strong><span class="small"> (beta)</span>
                </a>
              </a>
            </router-link>
          </b-nav-item>

          <!-- Influencer -->
          <b-nav-item id="nav-con1">
            <b-nav-item-dropdown no-caret id="dp-color" class="">
              <template slot="button-content">
                <a class="nav-link" data-toggle="tab" tag="p" style="padding: 0">
                  <img src="@/assets/Influ.png" alt="logo" class="img-nav" />
                  <a class="nav-link titlenav">
                    <strong>Influencer</strong>
                  </a>
                </a>
              </template>

              <b-dropdown-item to="/influencertop">
                <router-link to="/influencertop" tag="a" :style="dropdownStyle"
                  :class="{ dropdownStyle: $route.path === '/influencertop' }" id="dp-txt">Top Influencer</router-link>
              </b-dropdown-item>

              <b-dropdown-item to="/influencerHub">
                <router-link to="/influencerHub" tag="a" :style="dropdownStyle"
                  :class="{ dropdownStyle: $route.path === '/influencerHub' }" id="dp-txt">Influencer Hub</router-link>
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-nav-item>



          <!-- Hot Issue (dropdown; button click → /timeline) -->
          <b-nav-item id="nav-con1">
            <b-nav-item-dropdown no-caret id="dp-color" class="">
              <template slot="button-content">
                <a class="nav-link" data-toggle="tab" tag="p" :class="{ 'router-link-exact-active': isPathHotIssue }"
                  style="padding: 0">
                  <!-- <img src="@/assets/Hotissue.png" alt="logo" class="img-nav" /> -->
                  <img src="@/assets/Evaluation.png" alt="logo" class="img-nav" />
                  <a class="nav-link titlenav">
                    <strong>Search</strong><span class="small"> </span>
                  </a>
                </a>
              </template>

              <b-dropdown-item to="/timeline">
                <router-link to="/timeline" tag="a" :style="dropdownStyle"
                  :class="{ dropdownStyle: $route.path === '/timeline' }" id="dp-txt">Timeline</router-link>
                <span class="small"> (beta)</span>
              </b-dropdown-item>

              <!-- <b-dropdown-item to="/imagesearch">
                <router-link to="/imagesearch" tag="a" :style="dropdownStyle"
                  :class="{ dropdownStyle: $route.path === '/imagesearch' }" id="dp-txt">Image</router-link>
                <span class="small"> (beta)</span>
              </b-dropdown-item> -->


              <b-dropdown-item to="/hotissue">
                <router-link to="/hotissue" tag="a" :style="dropdownStyle"
                  :class="{ dropdownStyle: $route.path === '/hotissue' }" id="dp-txt">Hot Issue</router-link>
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-nav-item>

          <!-- Monitor (moved Avatar here, removed Timeline) -->
          <b-nav-item id="nav-con1">
            <b-nav-item-dropdown no-caret id="dp-color" class="">
              <template slot="button-content">
                <a class="nav-link" data-toggle="tab" tag="p" :class="{ 'router-link-exact-active': isActiveMonitor }"
                  style="padding: 0">
                  <img src="@/assets/monitor.png" alt="logo" class="img-nav" />
                  <a class="nav-link titlenav">
                    <strong>Monitor</strong>
                  </a>
                </a>
              </template>

              <b-dropdown-item to="/monitorlist">
                <router-link to="/monitorlist" tag="a" :style="dropdownStyle"
                  :class="{ dropdownStyle: $route.path === '/monitorlist' }" id="dp-txt">Monitor</router-link>
              </b-dropdown-item>

              <b-dropdown-item to="/feed" class="d-none">
                <router-link to="/feed" tag="a" :style="dropdownStyle"
                  :class="{ dropdownStyle: $route.path === '/feed' }" id="dp-txt">Feed</router-link>
              </b-dropdown-item>

              <b-dropdown-item to="/report" class="d-none">
                <router-link to="/report" tag="a" :style="dropdownStyle"
                  :class="{ dropdownStyle: $route.path === '/report' }" id="dp-txt">Report</router-link>
              </b-dropdown-item>

              <b-dropdown-item to="/avatar">
                <router-link to="/avatar" tag="a" :style="dropdownStyle"
                  :class="{ dropdownStyle: $route.path === '/avatar' }" id="dp-txt">Avatar</router-link>
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-nav-item>


          <!-- Keyword (hidden) -->
          <b-nav-item id="nav-con1" class="d-none">
            <router-link to="/keyword" tag="p">
              <a class="nav-link">
                <img src="@/assets/keyword2.png" alt="logo" class="img-nav" />
                <a class="nav-link titlenav">
                  <strong>Keyword</strong><span class="small"> </span>
                </a>
              </a>
            </router-link>
          </b-nav-item>

          <!-- Evaluation now only Gsearch -->
          <b-nav-item id="nav-con1" class="d-none">
            <b-nav-item-dropdown no-caret id="dp-color" class="">
              <template slot="button-content">
                <a class="nav-link" data-toggle="tab" tag="p"
                  :class="{ 'router-link-exact-active': isActiveEvaluation }" style="padding: 0">
                  <img src="@/assets/Evaluation.png" alt="logo" class="img-nav" />
                  <a class="nav-link titlenav">
                    <strong>Evaluation</strong>
                  </a>
                </a>
              </template>
              <b-dropdown-item to="/gsearch">
                <router-link to="/gsearch" tag="a" :style="dropdownStyle"
                  :class="{ dropdownStyle: $route.path === '/gsearch' }" id="dp-txt">Gsearch</router-link>
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-nav-item>

          <b-nav-item id="nav-con1">
            <router-link to="/setting" tag="p">
              <a class="nav-link">
                <img src="@/assets/Setting.png" alt="logo" class="img-nav" />
                <a class="nav-link titlenav">
                  <strong>Setting</strong>
                </a>
              </a>
            </router-link>
          </b-nav-item>

          <b-nav-item id="nav-con1" v-if="seen">
            <router-link to="/templateusermanagement" tag="p">
              <a class="nav-link">
                <img src="@/assets/userx.png" alt="logo" class="img-nav" />
                <a class="nav-link titlenav">
                  <strong>User Management</strong>
                </a>
              </a>
            </router-link>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div class="content">
      <router-view></router-view>
    </div>

    <!-- Modal -->
    <div class="modal fade md-font" id="myModal" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header" style="margin-right: 10px">
            <h4 class="modal-title md-font mt-2">Logout</h4>
            <button type="button" class="close" data-dismiss="modal">
              &times;
            </button>
          </div>
          <div class="modal-body">
            <p class="md-font">Are you sure to logout?.</p>
          </div>
          <div class="mt-2 mb-2">
            <button type="button" class="btn btn-default md-font m-2" v-on:click="ConfirmLogout()" data-dismiss="modal"
              style="background-color: #fed16e">
              Yes
            </button>
            <button type="button" class="btn btn-default md-font" data-dismiss="modal"
              style="background-color: #f7776a">
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "homenav",
  data() {
    return {
      msg: "HomeNav",
      username: "",
      seen: false,
      allStyle: { pointerEvents: "all" },
      dropdownStyle: {
        borderBottom: "0px solid #4c412b",
        fontWeight: "bold",
      },
    };
  },
  computed: {
    ...mapGetters(["getToSection"]),
    isActiveRanking() {
      return this.$route.path === "/ranking" || this.$route.path === "/personranking";
    },
    // กลุ่ม Influencer (สำหรับ active class ที่ปุ่ม dropdown)
    isActiveInfluencer() {
      return this.$route.path === "/influencertop" || this.$route.path === "/influencerHub";
    },

    // กลุ่ม Monitor: Monitor/Feed/Report/Avatar (timeline ถูกย้ายออก)
    isActiveMonitor() {
      return (
        this.$route.path === "/monitor" ||
        this.$route.path === "/monitorlist" ||
        this.$route.path === "/feed" ||
        this.$route.path === "/report" ||
        this.$route.path === "/avatar"
      );
    },

    // กลุ่ม Evaluation: ตอนนี้เหลือเฉพาะ Gsearch
    isActiveEvaluation() {
      return this.$route.path === "/gsearch";
    },

    // ใช้เช็คว่าตอนนี้อยู่หน้า hotissue หรือไม่ (รองรับชื่อ route ไม่แน่นอน)
    isPathHotIssue() {
      return this.$route.path === "/hotissue" || this.$route.path === "/timeline" || this.$route.path === "/imagesearch";
    },
  },
  methods: {
    showLoading() {
      this.allStyle.pointerEvents = "none";
    },
    stopLoading() {
      this.allStyle.pointerEvents = "all";
    },
    ConfirmLogout() {
      this.$store.commit("setLogout");
      localStorage.removeItem("section");
      localStorage.removeItem("valmonitor");
      localStorage.removeItem("domainArr");
      localStorage.removeItem("issue");
      localStorage.removeItem("roleMion");
      localStorage.removeItem("tabMonitor");
      this.$store.commit("setListProfile", {
        targetlist: [],
        hashtaglist: [],
        summary: {
          target: {
            facebook: 0,
            twitter: 0,
            pantip: 0,
            news: 0,
            instagram: 0,
            youtube: 0,
          },
          hashtag: {
            facebook: 0,
            twitter: 0,
            pantip: 0,
            news: 0,
            instagram: 0,
            youtube: 0,
          },
        },
      });
      this.$router.push("login");
    },
  },
  created() {
    this.$store.commit("setToSection", localStorage.getItem("section"));
    this.username = localStorage.getItem("username");
    const reftokenOpt = localStorage.getItem("reftokenOpt");
    if (reftokenOpt === "admin") this.seen = true;
  },
};
</script>

<style scoped>
.fa-home {
  font-size: 25px;
  color: #4c412d !important;
}

.imgab2 {
  margin: auto;
  width: 130px;
  height: auto;
  margin-top: 0;
  margin-bottom: 0;
}

.txt-icon {
  margin-left: 10px;
  font-size: 26px;
  color: rgb(254, 209, 110);
  vertical-align: bottom !important;
}

#user {
  background: #fed16e;
  padding: 0px 10px;
  border-radius: 14px;
  color: white;
  font-weight: 500;
  vertical-align: top !important;
}

#user2 {
  background: #fed16e;
  padding: 0px 10px;
  border-radius: 14px;
  color: white;
  font-weight: 500;
  vertical-align: top !important;
}

#logo-home {
  width: 100%;
  border-bottom: 0px solid #4c412b !important;
  cursor: pointer;
}

#nav-router.router-link-exact-active {
  border-bottom: 0px solid #4c412b !important;
}

#nav-router {
  width: 100%;
}

.dropdown-toggle::after {
  margin-left: 0.255em !important;
}

#nav-phone {
  display: none;
}

.txt-lo {
  margin-bottom: 5px;
  margin-right: 15px;
  cursor: pointer;
}

.img-nav {
  width: 30px;
}

.itemsty:active {
  background-color: #ede7dd !important;
}

.imgab {
  margin: auto;
  width: 130px;
  height: auto;
  margin-top: 0;
  margin-bottom: 0;
}

.user {
  margin-bottom: -2rem;
  margin-left: 15rem;
}

.bg-light {
  padding-bottom: 0;
  padding-top: 0;
  background-color: #ede7dd !important;
}

a {
  color: #504b3c;
}

.colorbg {
  background-color: #fff;
  margin: 0;
}

/* .content {
  max-width: 93%;
  margin: auto;
  background: white;
 min-height: 100vh; 
  padding: 0;
} */

.topnav {
  overflow: hidden;
}

.topnav li {
  float: left;
  display: block;
  color: black;
  text-align: center;
  text-decoration: none;
  font-size: 17px;
}

.topnav li:hover {
  opacity: 1;
}

.topnav p:hover {
  border-bottom: 3px solid #4c412b;
}

.router-link-exact-active {
  opacity: 5;
  border-bottom: 3px solid #4c412b;
  text-decoration: none;
}

.titlenav {
  font-size: 10pt;
  text-decoration: none;
}

#dp-txt {
  font-size: 10pt;
}

.dropdown-content {
  font-size: 11pt;
  font-family: "Prompt", "FontAwesome", sans-serif;
  display: none;
  position: absolute;
  background-color: #ede7dd;
  padding-top: 10px;
  padding-bottom: 20px;
  min-height: 45px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  margin-top: 12px;
  margin-bottom: 12px;
  padding: 12px 20px;
  text-decoration: none;
}

.dropdown-content a:hover {
  color: #afacac;
  text-shadow: 2px 2px #d0cdcda1;
}

.dropdownStyle {
  color: #afacac !important;
  text-shadow: 2px 2px #d0cdcda1 !important;
}

@media only screen and (min-width: 0px) and (max-width: 1100px) {
  .navbar-expand-sm .navbar-collapse {
    zoom: 80% !important;
  }
}

@media only screen and (min-width: 0px) and (max-width: 800px) {
  #nav-desktop {
    display: none !important;
  }

  #nav-phone {
    display: flex;
    padding: 9px;
  }

  .router-link-exact-active {
    width: 50%;
    display: inline-block;
  }

  .img-nav {
    width: 8vw !important;
    margin-right: 20px;
    display: inline-block;
  }

  .nav-link {
    display: unset;
  }
}

@media only screen and (min-width: 0px) and (max-width: 600px) {
  .nav-link {
    display: unset;
  }

  .imgab {
    margin-top: 10%;
  }

  .row.colorbg {
    padding-top: 5%;
  }

  .navbar-toggler {
    font-size: 3vw !important;
  }

  .navbar {
    padding-bottom: 10px;
  }

  .titlenav {
    font-size: 3.5vw !important;
    display: inline-block;
    margin-left: 20px;
  }

  .img-nav {
    width: 8vw !important;
    margin-right: 20px;
    display: inline-block;
  }

  #dp-txt {
    font-size: 3vw !important;
    text-align: center;
    display: block;
  }

  #dp-color {
    min-width: 18rem;
  }

  .nav-link {
    padding: 4px;
  }

  #li-nav {
    margin-bottom: 20px;
  }

  .line-nav {
    display: none;
  }

  #nav-desktop {
    display: none !important;
  }

  #nav-phone {
    display: flex;
    padding: 9px;
  }

  .router-link-exact-active {
    width: 60%;
    display: inline-block;
  }

  .nav-link {
    display: unset;
  }
}

@media print {
  .colorbg {
    display: none;
  }
}
</style>
