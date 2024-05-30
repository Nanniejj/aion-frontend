<template>
  <div>
    <!-- {{getProfileMonitor.profile.length}} -->
    <vue-element-loading
      :active="getLoadStatus2"
      size="80"
      background-color="rgba(255,255,255, 0.5)"
      color="#fff"
      spinner="bar-fade-scale"
    />

    <b-card id="box-profile">
      <!-- {{ getProfileMonitor.profile.length}}{{getProfileMonitor}} -->
      <div v-if="getProfileMonitor.profile.length">
        <span v-for="(pf, k) in getProfileMonitor.profile" :key="k">
          <span v-if="pf.source == getValSource">
            <span>
              <span v-if="pf.profile_image">
                <b-avatar
                  @error="setAltImg"
                  size="70px"
                  :src="pf.profile_image"
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
                  v-if="getValSource == 'twitter'"
                  src="@/assets/Twitter.png"
                  class="social-img"
                />
                <img
                  v-else-if="getValSource == 'facebook'"
                  src="@/assets/Facebook.png"
                  class="social-img"
                />
                <img
                  v-if="getValSource == 'news'"
                  src="@/assets/News.png"
                  class="social-img"
                />
                <img
                  v-if="getValSource == 'pantip'"
                  src="@/assets/Pantip.png"
                  class="social-img"
                />
                <img
                  v-if="getValSource == 'instagram'"
                  src="@/assets/Instagram.png"
                  class="social-img"
                />
                <img
                  v-if="getValSource == 'youtube'"
                  src="@/assets/Youtube.png"
                  class="social-img"
                />
                <img
                  v-if="getValSource == 'blockdit'"
                  src="@/assets/Blockdit.png"
                  class="social-img"
                />
                <img
                  v-if="getValSource == 'tiktok'"
                  src="@/assets/Tiktok.png"
                  class="social-img"
                />
                <img
                  v-if="getValSource == 'threads'"
                  src="@/assets/Threads.png"
                  class="social-img"
                />
              </span>
            </span>
            <div class="text-center mt-3" v-if="getProfileMonitor">
              <p class="d-block mb-3 h5 bold">
                <a
                  v-bind:href="pf.link_original"
                  target="_blank"
                  style="color: #2c3e50"
                >
                  <span v-if="pf.name">{{ pf.name }} </span>
                  <span v-else> {{ pf.uid }} </span>
                  <i class="fa fa-external-link" />
                </a>
              </p>
              <b-button
                variant="outline-success"
                pill
                v-if="getToLinkProfile == 'Monitor'"
                >ติดตามแล้ว</b-button
              >
              <!-- <b-button size="sm">ติดตาม</b-button> -->
              <div class="box-info">
                <hr style="width: 100%" />
                <div class="mt-3 text-left font-weight-bold">Profile</div>
                <p class="d-block mb-1 text-left" v-if="pf.uid">
                  {{ pf.uid }}
                </p>
                <hr style="width: 100%" />
                <b-row class="mt-3 text-left">
                  <b-col
                    ><p class="d-block mb-1 text-left">
                      <i class="fa fa-user" /> ผู้ติดตาม
                    </p></b-col
                  >
                  <b-col cols="auto">
                    <p class="d-block mb-1 text-right" v-if="pf.followers">
                      {{ pf.followers | numFormat }}
                    </p>
                    <p class="d-block mb-1 text-right" v-else>-</p>
                  </b-col>
                </b-row>
                <!-- <hr style="width:100%"> -->
                <b-row class="mt-1">
                  <b-col
                    ><p class="d-block mb-1 text-left">
                      <i class="fas fa-user-friends" /> กำลังติดตาม
                    </p></b-col
                  >
                  <b-col cols="auto"
                    ><p class="d-block mb-1 text-right" v-if="pf.following">
                      {{ pf.following | numFormat }}
                    </p>
                    <p class="d-block mb-1 text-right" v-else>-</p>
                  </b-col>
                </b-row>
                <!-- <hr style="width:100%"> -->
                <b-row class="mt-1 text-left">
                  <b-col
                    ><p class="d-block mb-1 text-left">
                      <i class="fa fa-paper-plane" /> จำนวนโพสต์
                    </p></b-col
                  >
                  <b-col cols="auto"
                    ><p class="d-block mb-1 text-right">
                      {{ getCountPost | numFormat }}
                    </p></b-col
                  >
                </b-row>
                <!-- <hr style="width:100%"> -->

                <hr style="width: 100%" />
                <div class="mt-3 text-left font-weight-bold">Description</div>
                <hr style="width: 100%" />
                <b-button
                  class="mb-3 d-block"
                  size="sm"
                  @click="enableEditing(k)"
                  pill
                  variant="outline-secondary"
                >
                  <i class="fas fa-edit" /> แก้ไข</b-button
                >
                <b-row class="mt-1 d-none">
                  <b-col cols="auto"
                    ><p class="d-block mb-1 text-left">
                      <i class="fa fa-user"></i> Name
                    </p></b-col
                  >
                  <b-col>
                    <div v-if="!editing" class="d-block mb-1 text-right">
                      <p v-if="pf.name">
                        {{ pf.name }}
                      </p>
                      <p v-else>-</p>
                    </div>
                    <div v-if="editing">
                      <b-form-input
                        size="sm"
                        v-model="tempName"
                        class="input"
                      />
                    </div>
                  </b-col>
                </b-row>

                <b-row class="mt-1 d-none">
                  <b-col cols="auto"
                    ><p class="d-block mb-1 text-left">
                      <i class="fa fa-id-card"></i> Id
                    </p></b-col
                  >
                  <b-col>
                    <div v-if="!editing" class="d-block mb-1 text-right">
                      <p v-if="pf.id">
                        {{ pf.id }}
                      </p>
                      <p v-else>-</p>
                    </div>
                    <div v-if="editing">
                      <b-form-input size="sm" v-model="tempId" class="input" />
                    </div>
                  </b-col>
                </b-row>

                <b-row class="mt-1">
                  <b-col cols="auto"
                    ><p class="d-block mb-1 text-left">
                      <i class="fa fa-envelope" /> E-mail
                    </p></b-col
                  >
                  <b-col>
                    <div v-if="!editing" class="d-block mb-1 text-right">
                      <p v-if="pf.email">
                        {{ pf.email }}
                      </p>
                      <p v-else>-</p>
                    </div>
                    <div v-if="editing">
                      <b-form-input
                        size="sm"
                        v-model="tempEmail"
                        class="input"
                      />
                    </div>
                  </b-col>
                </b-row>

                <b-row class="mt-1 d-none">
                  <b-col cols="auto"
                    ><p class="d-block mb-1 text-left">
                      <i class="fa fa-address-book" aria-hidden="true"></i>
                      Address
                    </p></b-col
                  >
                  <b-col>
                    <div v-if="!editing" class="d-block mb-1 text-right">
                      <p v-if="pf.address">
                        {{ pf.address }}
                      </p>
                      <p v-else>-</p>
                    </div>
                    <div v-if="editing">
                      <b-form-input
                        size="sm"
                        v-model="tempAdds"
                        class="input"
                      />
                    </div>
                  </b-col>
                </b-row>

                <b-row class="mt-1 mb-1">
                  <b-col cols="auto"
                    ><p class="d-block mb-1 text-left">
                      <i class="fa fa-phone-alt" /> Tel.
                    </p></b-col
                  >
                  <b-col>
                    <div v-if="!editing" class="d-block mb-1 text-right">
                      <p v-if="pf.telnumber">
                        {{ pf.telnumber }}
                      </p>
                      <p v-else>-</p>
                    </div>
                    <div v-if="editing">
                      <b-form-input size="sm" v-model="tempTel" class="input" />
                    </div>
                  </b-col>
                </b-row>
                <div v-if="editing" class="m-auto text-right">
                  <span class="mt-2"
                    ><b-button
                      size="sm"
                      @click="disableEditing"
                      class="m-1"
                      pill
                      variant="outline-danger"
                    >
                      Cancel
                    </b-button>
                    <b-button
                      size="sm"
                      @click="saveEdit(k)"
                      class="m-1"
                      pill
                      variant="outline-success"
                    >
                      Save
                    </b-button></span
                  >
                </div>
              </div>
              <div class="mt-3"></div>
            </div>
          </span>
        </span>
      </div>
      <div v-else>
        <span v-if="getNoMonitor">
          <span v-if="getNoMonitor.profile_image">
            <b-avatar
              @error="setAltImg"
              size="70px"
              :src="getNoMonitor.profile_image"
              loading="lazy"
              class="shadow-sm rounded badge-light rounded-circle"
            ></b-avatar>
          </span>
          <span v-else>
            <b-avatar
              size="70px"
              class="shadow-sm rounded badge-light rounded-circle"
            ></b-avatar
          ></span>
          <span class="left">
            <img
              v-if="getNoMonitor.source == 'twitter'"
              src="@/assets/Twitter.png"
              class="social-img"
            />
            <img
              v-else-if="getNoMonitor.source == 'facebook'"
              src="@/assets/Facebook.png"
              class="social-img"
            />
            <img
              v-if="getNoMonitor.source == 'news'"
              src="@/assets/News.png"
              class="social-img"
            />
            <img
              v-if="getNoMonitor.source == 'pantip'"
              src="@/assets/Pantip.png"
              class="social-img"
            />
            <img
              v-if="getNoMonitor.source == 'instagram'"
              src="@/assets/Instagram.png"
              class="social-img"
            />
            <img
              v-if="getNoMonitor.source == 'youtube'"
              src="@/assets/Youtube.png"
              class="social-img"
            />
          </span>
          <p class="d-block mb-3 h5 bold">
            <a
              v-bind:href="getNoMonitor.url_post"
              target="_blank"
              style="color: #2c3e50"
            >
              <span>{{ getNoMonitor.account_name }} </span>

              <i class="fa fa-external-link" />
            </a>
          </p>
          <div class="small">ไม่พบข้อมูลโปรไฟล์ในระบบ</div>
          <!-- <b-button variant="outline-danger" pill>ยังไม่ได้ติดตาม</b-button> -->
          <div class="box-info">
            <hr style="width: 100%" />
            <div class="mt-3 text-left font-weight-bold">Profile</div>
            <hr style="width: 100%" />
            <b-row class="mt-3 text-left">
              <b-col
                ><p class="d-block mb-1 text-left">
                  <i class="fa fa-user" /> ผู้ติดตาม
                </p></b-col
              >
              <b-col cols="auto">
                <p class="d-block mb-1 text-right" v-if="getNoMonitor.follower">
                  {{ getNoMonitor.follower | numFormat }}
                </p>
                <p class="d-block mb-1 text-right" v-else>-</p>
              </b-col>
            </b-row>
            <!-- <hr style="width:100%"> -->
            <b-row class="mt-1">
              <b-col
                ><p class="d-block mb-1 text-left">
                  <i class="fas fa-user-friends" /> กำลังติดตาม
                </p></b-col
              >
              <b-col cols="auto"
                ><p
                  class="d-block mb-1 text-right"
                  v-if="getNoMonitor.following"
                >
                  {{ getNoMonitor.following | numFormat }}
                </p>
                <p class="d-block mb-1 text-right" v-else>-</p>
              </b-col>
            </b-row>
            <!-- <hr style="width:100%"> -->
            <b-row class="mt-1 text-left">
              <b-col
                ><p class="d-block mb-1 text-left">
                  <i class="fa fa-paper-plane" /> จำนวนโพสต์
                </p></b-col
              >
              <b-col cols="auto"
                ><p class="d-block mb-1 text-right">
                  -
                  <!-- {{ getCnt | numFormat }} -->
                </p></b-col
              >
            </b-row>
          </div>
          <!-- {{getNoMonitor}} -->
        </span>
      </div>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      value: "click",
      tempAdds: null,
      tempTel: null,
      tempEmail: null,
      tempName: null,
      tempLname: null,
      tempId: null,
      editing: false,
      default_avatar: "user.svg",
    };
  },
  computed: {
    ...mapGetters([
      "getDomainName",
      "getProfileMonitor",
      "getProfileData",
      "getLoadStatus2",
      "getPostAllMonitor",
      "getLocationCount",
      "getCountPost",
      "getNoMonitor",
      "getValSource",
      "getCnt",
      "getToLinkProfile",
    ]),
    // handleError(image) {
    // image.src = this.default_avatar;
    // return image.src
    //   }
  },
  methods: {
    setAltImg(event) {
      event.target.src = this.default_avatar;
    },
    enableEditing: function(k) {
      this.tempTel = this.getProfileMonitor.profile[k].telnumber;
      this.tempEmail = this.getProfileMonitor.profile[k].email;
      // this.tempName = this.getProfileMonitor.profile[k].name;
      // this.tempId = this.getProfileMonitor.profile[k].idcard;
      // this.tempAdds = this.getProfileMonitor.profile[k].address;
      this.editing = true;
    },
    disableEditing: function() {
      this.tempTel = null;
      this.tempEmail = null;
      // this.tempName = null;
      // this.tempId = null;
      // this.tempAdds = null;
      this.editing = false;
    },
    saveEdit: function(k) {
      console.log("nummm", k);
      // However we want to save it to the database

      this.getProfileMonitor.profile[k].email = this.tempEmail;
      this.getProfileMonitor.profile[k].telnumber = this.tempTel;
      // this.getProfileMonitor.profile[k].name = this.tempName;
      // this.getProfileMonitor.profile[k].idcard =this.tempId;
      // this.getProfileMonitor.profile[k].address =this.tempAdds;
      this.$store.dispatch("EditDescription", {
        uid: this.getProfileMonitor.profile[k].uid,
        source: this.getValSource,
        target: this.getProfileMonitor.profile[k].link_original,
        email: this.getProfileMonitor.profile[k].email,
        telno: this.getProfileMonitor.profile[k].telnumber,
      });
      this.disableEditing();
    },
  },
  destroyed() {
    console.log("อออออออออกกกกกกกก");
    this.$store.commit("setNoMonitor", "");
    // this.$store.commit("setProfileMonitor",[]);
    this.$store.commit("setCnt", "");
    localStorage.setItem("valmonitor", "");
  },
  created() {
    if (this.getValSource) {
      localStorage.setItem("valSource", this.getValSource);
    } else {
      this.$store.commit("setValSource", localStorage.getItem("valSource"));
    }

    if (this.getNoMonitor) {
      console.log("เข้า");
      localStorage.setItem("valmonitor", JSON.stringify(this.getNoMonitor));
    } else {
      console.log("ออก");
      this.$store.commit("setNoMonitor", localStorage.getItem("valmonitor"));
    }
  },
  mounted() {
    let x = {
      posts: 0,
      profile: [
        {
          link_crawl: "-",
          link_original: "-",
          source: this.getValSource,
          uid: "user",
          followers: 0,
          following: 0,
          likes: 0,
          name: "user",
          profile_image: require("@/assets/user.svg"),
          tweets_count: 0,
          email: "",
          telnumber: "",
          crawling_number: "False",
          number_update: "False",
        },
      ],
    };
    this.$store.commit("setCountPost", 0);
    this.$store.commit("setProfileMonitor", x);
    console.log("ddddddd", this.getProfileMonitor);
  },
};
</script>

<style scoped>
.b-avatar.imgpro.badge-secondary {
  color: #5e666d !important;
  background-color: #ddddddad !important;
  font-weight: bold;
}
.nnn {
  display: block;
  width: 20px;
  background-color: violet;
}
.user-img {
  width: 70px;
  border-radius: 50%;
  z-index: 2;
  position: relative;
}
.imgp {
  z-index: 2;
  position: relative;
}
.social-img {
  width: 50px;
  margin-left: -12px;
  margin-top: 19px;
  z-index: 0;
  position: relative;
}
.card {
  border: 0px solid rgba(0, 0, 0, 0.125);
}
/* .btn-secondary {
    color: #f8f9fa;
    background-color: #4c412b;
    border-color: #4c412b;
} */
/* .btn-outline {
    color: #ffc107;
    border-color: #ffc107;
}
.btn-outline:hover {
    color: #fff;
    border-color: #ffc107;
    background-color: #ffc107;
} */
.box-info {
  padding: 0px 30px;
}
.fa-user-circle {
  vertical-align: middle;
}
#box-profile {
  width: 100%;
  height: auto;
  min-height: 120px;
  display: block;
  padding: 20px 0px;
  border-radius: 7px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
/* @media (max-width: 1200px){
#box-profile {
    width: 100%;
    height: auto;
    display: block;
    padding: 20px 0px;
    border-radius: 20px;
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%);
    margin-top: 35px;
}
} */
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .b-avatar.imgpro.badge-secondary {
    width: 70px !important;
    height: 70px !important;
  }
  #box-profile {
    width: 100%;
    height: auto;
    display: block;
    padding: 20px 0px;
    border-radius: 20px;
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%);
    margin-top: 35px;
  }
  .tabs {
    margin-top: 15px;
  }
}
</style>
