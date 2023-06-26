<template>
  <div class="homenav">
    <div class="row colorbg" style="padding-top: 2%">
      <router-link to="/platform" id="logo-home">
        <img src="@/assets/Aion.png" class="imgab" />
      </router-link>
    </div>

    <div class="row justify-content-end colorbg">
      <div>
        <i
          class="txt-icon fas fa-user-circle"
          style="margin-left: 10px; font-size: 24px; color: #fed16e"
        ></i
        ><span id="user" class="ml-1 mr-2">{{ username }}</span>
      </div>
      <div class="txt-lo" data-toggle="modal" data-target="#myModal">
        <a style="color: #fed16e; margin-top: -2rem">Logout</a>
      </div>
    </div>

    <!------------------------------------------------ phone ver. ---------------------------------------------------------- -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light" id="nav-phone">
      <a class="navbar-brand" href="#"></a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto" id="nav-bar">
          <li class="nav-item" id="li-nav">
            <router-link to="/home" tag="p" exact
              ><a class="nav-link">
                <img src="../assets/home.png" alt="logo" class="img-nav" />
                <strong>Home</strong></a
              ></router-link
            >
            <!-- <hr class="line-nav"> -->
          </li>
          <li class="nav-item" id="li-nav" >
            <router-link to="/domain" tag="p" exact
              ><a class="nav-link"
                ><img
                  src="../assets/Dashboard.png"
                  alt="logo"
                  class="img-nav"
                /><strong>Domain</strong></a
              ></router-link
            >
            <!-- <hr class="line-nav"> -->
          </li>
          <li class="nav-item" id="li-nav" >
            <router-link to="/platform" tag="p" exact
              ><a class="nav-link"
                ><img
                  src="../assets/Sentiment.png"
                  alt="logo"
                  class="img-nav"
                /><strong>Platform</strong></a
              ></router-link
            >
            <!-- <hr class="line-nav"> -->
          </li>
          <li class="nav-item" id="li-nav">
            <router-link to="/wordcloud" tag="p"
              ><a class="nav-link"
                ><img
                  src="../assets/Wordcloud.png"
                  alt="logo"
                  class="img-nav"
                /><strong>Wordcloud</strong></a
              ></router-link
            >
            <!-- <hr class="line-nav"> -->
          </li>
          <li class="nav-item" id="li-nav">
            <router-link to="/ranking" tag="p"
              ><a class="nav-link"
                ><img
                  src="../assets/Ranking.png"
                  alt="logo"
                  class="img-nav"
                /><strong>Ranking</strong></a
              ></router-link
            >
          </li>
          <li class="nav-item" id="li-nav" >
            <router-link to="/influencertop" tag="p"
              ><a class="nav-link"
                ><img
                  src="@/assets/Influ.png"
                  alt="logo"
                  class="img-nav"
                /><strong>Influencer</strong></a
              ></router-link
            >
          </li>
        

          <li class="nav-item" id="li-nav" >
            <router-link to="/hotissue" tag="p"
              ><a class="nav-link"
                ><img
                  src="../assets/Hotissue.png"
                  alt="logo"
                  class="img-nav"
                  style="margin-bottom: 8px"
                /><strong>Hot Issue </strong>
                <span class="small"> (beta)</span></a
              ></router-link
            >
          </li>
          <li class="nav-item" id="li-nav" >
            <router-link to="/monitor" tag="p"
              ><a class="nav-link"
                ><img
                  src="../assets/monitor.png"
                  alt="logo"
                  class="img-nav"
                  style="margin-bottom: 8px"
                /><strong>Monitor</strong></a
              ></router-link
            >
          </li>
          <li class="nav-item" id="li-nav" >
            <router-link to="/templatesetting" tag="p"
              ><a class="nav-link"
                ><img
                  src="../assets/Setting.png"
                  alt="logo"
                  class="img-nav"
                  style="margin-bottom: 8px"
                /><strong>Setting</strong></a
              ></router-link
            >
          </li>
          <li
            class="nav-item"
            id="li-nav"
            v-if="seen"
          >
            <router-link to="/templateusermanagement" tag="p"
              ><a class="nav-link"
                ><img
                  src="../assets/userx.png"
                  alt="logo"
                  class="img-nav"
                  style="margin-bottom: 8px"
                /><strong>User Management</strong></a
              ></router-link
            >
          </li>
        </ul>
      </div>
    </nav>
    <!-- -------------------------------------------------------- -->

    <!-- navbar -->
    <b-navbar toggleable="sm" type="light" variant="light" id="nav-desktop">
      <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>
      <b-collapse
        id="nav-text-collapse"
        is-nav
        class="
          navbar navbar-expand-sm
          bg-light
          navbar-light
          justify-content-center
        "
      >
        <b-navbar-nav>
          <b-nav-item id="nav-con1">
            <router-link to="/home" tag="p" exact>
              <a class="nav-link">
                <img src="@/assets/home.png" alt="logo" class="img-nav" />
                <a class="nav-link titlenav">
                  <strong>Home</strong>
                </a>
              </a>
            </router-link>
          </b-nav-item>
          <b-nav-item id="nav-con1" >
            <router-link to="/domain" tag="p" exact>
              <a class="nav-link">
                <img src="@/assets/Dashboard.png" alt="logo" class="img-nav" />
                <a class="nav-link titlenav">
                  <strong>Domain</strong>
                </a>
              </a>
            </router-link>
          </b-nav-item>
          <b-nav-item id="nav-con1" >
            <router-link to="/platform" tag="p" exact>
              <a class="nav-link">
                <img src="@/assets/Sentiment.png" alt="logo" class="img-nav" />
                <a class="nav-link titlenav">
                  <strong>Platform</strong>
                </a>
              </a>
            </router-link>
          </b-nav-item>
          <b-nav-item id="nav-con2" >
            <router-link to="/wordcloud" tag="p">
              <a class="nav-link">
                <img src="@/assets/Wordcloud.png" alt="logo" class="img-nav" />
                <a class="nav-link titlenav">
                  <strong>Wordcloud</strong>
                </a>
              </a>
            </router-link>
          </b-nav-item>
          <b-nav-item id="nav-con1" >
            <router-link to="/ranking" tag="p">
              <a class="nav-link">
                <img src="@/assets/Ranking.png" alt="logo" class="img-nav" />
                <a class="nav-link titlenav">
                  <strong>Ranking</strong>
                </a>
              </a>
            </router-link>
          </b-nav-item>
          <!-- <b-nav-item id="nav-con3">
            <router-link to="/home/clustering" tag="p">
              <a class="nav-link">
                <img src="@/assets/Clustering.png" alt="logo" class="img-nav" />
                <a class="nav-link titlenav">
                  <strong>Clustering</strong>
                </a>
              </a>
            </router-link>
          </b-nav-item>-->
          <b-nav-item id="nav-con1" >
            <router-link to="/influencertop" tag="p">
              <a class="nav-link">
                <img src="@/assets/Influ.png" alt="logo" class="img-nav" />
                <a class="nav-link titlenav">
                  <strong>Influencer</strong>
                </a>
              </a>
            </router-link>
          </b-nav-item>
          <!-- <b-nav-item>
            <b-nav-item-dropdown no-caret menu-class="item-css" id="nav-con1">
              <template slot="button-content">
                <a
                  class="nav-link"
                  :class="{ 'router-link-exact-active': isActive2 }"
                  style="padding: 0;"
                >
                  <img src="@/assets/Infurncer.png" alt="logo" class="img-nav" />
                  <a class="nav-link titlenav">
                    <strong>Influencer</strong>
                  </a>
                </a>
              </template>
              <b-dropdown-item>
                <router-link
                  to="/influencertop"
                  tag="a"
                  :style="dropdownStyle"
                  :class="{ dropdownStyle: isActive6 }"
                  id="dp-txt"
                >Top Influencer</router-link>
              </b-dropdown-item>
               <b-dropdown-item>
                <router-link
                  to="/influencerlink"
                  tag="a"
                  :style="dropdownStyle"
                  :class="{ dropdownStyle: isActive7 }"
                  id="dp-txt"
                >Influencer Link</router-link>
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-nav-item> -->
          <!-- <b-nav-item id="nav-con4">
            <router-link to="/home/link" tag="p">
              <a class="nav-link">
                <img src="@/assets/Newslink.png" alt="logo" class="img-nav" />
                <a class="nav-link titlenav">
                  <strong>News Link</strong>
                </a>
              </a>
            </router-link>
          </b-nav-item> 
          <b-nav-item id="nav-con1">
            <router-link to="/gsearch" tag="p">
              <a class="nav-link">
                <img src="@/assets/Evaluation.png" alt="logo" class="img-nav" />
                <a class="nav-link titlenav">
                  <strong>Gsearch</strong>
                </a>
              </a>
            </router-link>
          </b-nav-item>-->

          
         

          <b-nav-item id="nav-con1" >
            <router-link to="/hotissue" tag="p">
              <a class="nav-link">
                <img src="@/assets/Hotissue.png" alt="logo" class="img-nav" />
                <a class="nav-link titlenav">
                  <strong>Hot Issue</strong><span class="small"> (beta)</span>
                </a>
              </a>
            </router-link>
          </b-nav-item>

          <b-nav-item id="nav-con1" >
            <router-link to="/monitor" tag="p">
              <a class="nav-link">
                <img src="@/assets/monitor.png" alt="logo" class="img-nav" />
                <a class="nav-link titlenav">
                  <strong>Monitor</strong>
                </a>
              </a>
            </router-link>
          </b-nav-item>

          <b-nav-item id="nav-con1" >
            <router-link to="/templatesetting" tag="p">
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
        <!-- Modal content-->
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
            <button
              type="button"
              class="btn btn-default md-font m-2"
              v-on:click="ConfirmLogout()"
              data-dismiss="modal"
              style="background-color: #fed16e"
            >
              Yes
            </button>
            <button
              type="button"
              class="btn btn-default md-font"
              data-dismiss="modal"
              style="background-color: #f7776a"
            >
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

  methods: {
    showLoading: function() {
      this.allStyle.pointerEvents = "none";
    },
    stopLoading: function() {
      this.allStyle.pointerEvents = "all";
    },
    ConfirmLogout() {
      this.$store.commit("setLogout");
      localStorage.removeItem("section");
      localStorage.removeItem("valmonitor");
      localStorage.removeItem("domainArr");
      localStorage.removeItem("issue");
      localStorage.removeItem("roleMion");
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
  computed: {
    ...mapGetters(["getToSection"]),
    isActive() {
      return (
        this.$route.name === "Avatar" ||
        this.$route.name === "Gsearch" ||
        this.$route.name === "Getrelation" ||
        this.$route.name === "trend" ||
        this.$route.name === "campaign"
      );
    },
    // isActive2() {
    //   return (
    //     this.$route.name === "influencertop" ||
    //     this.$route.name === "influencerlink"
    //   );
    // },
    isActive3() {
      return this.$route.name === "trend";
    },
    isActive4() {
      return this.$route.name === "Gsearch";
    },
    isActive5() {
      return this.$route.name === "Avatar";
    },
    isActive6() {
      return this.$route.name === "influencertop";
    },
    isActive7() {
      return this.$route.name === "influencerlink";
    },
    isActive8() {
      return this.$route.name === "campaign";
    },
    isActive9() {
      return this.$route.name === "Getrelation";
    },
  },
  created() {
    this.$store.commit("setToSection", localStorage.getItem("section"));
    this.username = localStorage.getItem("username");
    var reftokenOpt = localStorage.getItem("reftokenOpt");
    if (reftokenOpt == "admin") this.seen = true;
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
  background: #5679a5;
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
