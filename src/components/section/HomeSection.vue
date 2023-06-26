<template>
  <div id="overflow-page">
    <div class="row justify-content-end colorbg">
      <div>
        <i
          class="txt-icon fas fa-user-circle"
          style="margin-left: 10px; font-size: 24px; color: rgb(190, 188, 188)"
        ></i
        ><span id="user" class="ml-1 mr-2">{{ username }}</span>
      </div>
      <div class="txt-lo" data-toggle="modal" data-target="#myModal">
        <a style="color: rgb(190, 188, 188); margin-top: -2rem">Logout</a>
      </div>
    </div>
    <div id="content" class="box-con">
      <b-container class="w-100">
        <b-row class="pt-lg-5 p-lg-5" align-h="center">
          <b-col lg="12" @click="toAion">
            <Transition :duration="550">
              <div class="box-logo1">
                <img src="@/assets/Aion.png" alt="logo" class="img-logo1" />
              </div>
            </Transition>
          </b-col>

          <b-col lg="12" @click="toMion" v-if="role">
            <div class="box-logo2">
              <img src="@/assets/Mion.png" alt="logo" class="img-logo2" />
            </div>
          </b-col>
          <b-col lg="12" v-else>
            <div class="box-logo3 overlay">
              <img src="@/assets/Mion.png" alt="logo" class="img-logo3" />
            </div>
          </b-col>
          <!-- <img src="@/assets/minion.png" alt="logo" class="" /><img src="@/assets/minion.png" alt="logo" class="" /><img src="@/assets/minion.png" alt="logo" class="" /><img src="@/assets/minion.png" alt="logo" class="" /> -->
        </b-row>
      </b-container>

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
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      role: false,
    };
  },
  methods: {
    toAion() {
      localStorage.setItem("section", "toAion");
      this.$router.push("domain");
    },
    toMion() {
      // this.$store.commit("setToSection", "toMion");
      localStorage.setItem("section", "toMion");
      this.$router.push("feed");
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
  created() {
    this.username = localStorage.getItem("username");
    this.role = JSON.parse(localStorage.getItem("roleMion"));
    localStorage.removeItem("section");
  },
};
</script>

<style scoped>
.txt-lo {
  margin-bottom: 5px;
  margin-right: 15px;
  cursor: pointer;
}
.txt-icon {
  margin-left: 10px;
  font-size: 26px;
  color: rgb(190, 188, 188);
  vertical-align: bottom !important;
}
#user {
  background: rgb(190, 188, 188);
  padding: 0px 10px;
  border-radius: 14px;
  color: white;
  font-weight: 500;
  vertical-align: top !important;
}
.colorbg {
  padding: 20px;
  background-color: #ffffff;
}
.img-logo1 {
  width: 250px;
}
.img-logo2 {
  width: 250px;
}
.img-logo3 {
  width: 250px;
  opacity: 0.363;
  position: relative;
  z-index: 1;
}
.box-con {
  display: flex;
  justify-content: center;
  align-items: center;
}
.box-logo1 {
  width: 60%;
  height: 200px;
  text-align: center;
  margin: auto;
  padding: 20px 20px;
  border-radius: 20px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 50px;
  cursor: pointer;
}
.box-logo2 {
  width: 60%;
  text-align: center;
  margin: auto;
  height: 200px;
  padding: 20px 20px;
  border-radius: 20px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 50px;
  cursor: pointer;
  /* border: 1px solid #fdd071; */
}
.box-logo3 {
  width: 60%;
  text-align: center;
  margin: auto;
  height: 200px;
  padding: 20px 20px;
  border-radius: 20px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 50px;
  cursor: no-drop;
  /* box-shadow: rgba(164, 164, 168, 0.274) 0px 30px 60px -12px inset, rgba(131, 129, 129, 0.3) 0px 18px 36px -18px inset; */
}
.overlay {
  width: 60%;
  height: 200px;
  position: relative;
  background-color: rgba(0, 0, 0, 0.116);
  z-index: 2;
}
.box-logo1:hover {
  border: 3px solid #fdd071;
  box-shadow: rgba(0, 0, 0, 0.2) 0px -50px 36px -28px inset;
}
.box-logo2:hover {
  border: 3px solid #5679a5;
  box-shadow: rgba(0, 0, 0, 0.2) 0px -50px 36px -28px inset;
}
#content {
  max-width: 100%;
  margin: auto;
  background-color: #ffffff;
  /* background-image: url("~@/assets/BG-Aion.jpg");
  background-repeat: no-repeat;
  background-size: cover; */
  min-height: 100vh;
  padding: 0;
}
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .img-logo1 {
    width: 120px;
  }
  .img-logo2 {
    width: 120px;
  }
  .img-logo3 {
    width: 120px;
  }
  .box-logo1 {
    width: 100%;
    height: 150px;
  }
  .box-logo2 {
    width: 100%;
    height: 150px;
  }
  .box-logo3 {
    width: 100%;
    height: 150px;
  }
  .overlay {
    width: 100%;
    height: 150px;
    position: relative;
    background-color: rgba(0, 0, 0, 0.116);
    z-index: 2;
  }
}
</style>
