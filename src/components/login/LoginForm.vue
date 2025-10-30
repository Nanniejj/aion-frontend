<template>
  <b-container>
    <b-row align-h="center">
      <b-col align-self="center">
        <div class="card md-font">
          <b-row>
            <b-col style="margin-top: 5vw">
              <!-- เว้นว่างสำหรับ future tabs -->
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <div class="tab-content">
                <div id="signin" class="container tab-pane active">
                  <br />
                  <form @submit.prevent="login">
                    <b-row align-h="center">
                      <b-col cols="10" align-self="center">
                        <b-form-group>
                          <b-form-input
                            type="text"
                            class="form-control inputform md-font"
                            name="username"
                            v-model="username"
                            placeholder="Username"
                            :disabled="isLoading"
                            autocomplete="username"
                          />
                        </b-form-group>
                      </b-col>
                    </b-row>

                    <b-row align-h="center">
                      <b-col cols="10" align-self="center">
                        <b-form-group>
                          <b-form-input
                            type="password"
                            class="form-control inputform md-font"
                            name="password"
                            v-model.trim="password"
                            placeholder="Password"
                            :disabled="isLoading"
                            autocomplete="current-password"
                          />
                        </b-form-group>

                        <b-alert
                          :show="alertShow"
                          variant="danger"
                          class="pt-1 pb-1"
                        >
                          username or password is invalid
                        </b-alert>
                      </b-col>
                    </b-row>

                    <b-row align-h="center">
                      <b-col cols="10" align-self="center">
                        <b-row>
                          <b-col align-self="center" cols="6">
                            <label style="text-align: start; display: block">
                              <b-form-checkbox
                                id="checkbox-1"
                                v-model="check"
                                name="checkbox-1"
                                value="check"
                                unchecked-value="uncheck"
                                :disabled="isLoading"
                              >
                                <strong>Remember me</strong>
                              </b-form-checkbox>
                            </label>
                          </b-col>
                          <b-col align-self="center" cols="6">
                            <div style="text-align: end">
                              <strong>forget your password</strong>
                            </div>
                          </b-col>
                        </b-row>
                      </b-col>
                    </b-row>

                    <b-row align-h="center">
                      <b-col cols="8" align-self="center">
                        <b-button
                          type="submit"
                          class="submit md-font"
                          variant="primary"
                          block
                          :disabled="isLoading"
                        >
                          <!-- <b-spinner
                            v-if="isLoading"
                            small
                            class="mr-2"
                            label="Loading"
                          /> -->
                          {{ isLoading ? 'Logging in...' : 'Login' }}
                        </b-button>
                      </b-col>
                    </b-row>
                  </form>
                </div>
              </div>
            </b-col>
          </b-row>

          <br />
        </div>
      </b-col>
    </b-row>

    <b-modal id="my-modal2" class="md-font" v-model="modalShow2">
      <div class="d-block text-center mt-3">
        <i class="fas fa-exclamation-circle fa-3x mb-2"></i>
        <p class="md-font">ระบบไม่สามารถใช้งานได้ในขณะนี้</p>
      </div>
      <b-button
        class="mt-3 md-font"
        variant="outline-danger"
        block
        @click="modalShow2 = false"
        style="width: 40%; margin: auto"
      >
        Close
      </b-button>
    </b-modal>
  </b-container>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "Login",
  computed: {
    ...mapGetters(["getToken"]),
  },
  data() {
    return {
      alertShow: false,
      modalShow2: false,
      check: false,
      username: "",
      password: "",
      result: "",
      isLoading: false, // สถานะโหลดปุ่ม
    };
  },
  methods: {
    async login() {
      if (this.isLoading) return; // ป้องกันกดซ้ำ
      this.alertShow = false;

      const config = {
        method: "post",
        url: "https://api2.cognizata.com/api/auth/login",
        // url: "http://127.0.0.1:3000/api/auth/login",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          username: this.username.trim(),
          password: this.password.trim(),
        },
      };

      this.isLoading = true;
      try {
        const { data } = await axios(config);

        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("reftoken", data.refreshToken);
        localStorage.setItem("reftokenOpt", data.reftokenOpt);

        const objId = data.accessToken.split(".");
        const decodedData = atob(objId[1]);
        const obj = JSON.parse(decodedData);

        localStorage.setItem("objId", obj.id);
        localStorage.setItem("username", obj.username);
        localStorage.setItem("roleMion", obj.mion);
        localStorage.setItem("projectId", obj.projectid);

        this.$store.commit("setPushDomainStat", false);
        const mi = JSON.parse(localStorage.getItem("roleMion"));
        this.$store.commit("setRoleMion", mi);
        this.$store.commit("setShowIntro", true);

        this.$router.push({ name: "Domain" });
      } catch (err) {
        console.log("errrrrrr", err?.message || err);
        if (err?.response?.status === 422 || err?.message?.includes("422")) {
          this.alertShow = true;
        } else {
          this.modalShow2 = true;
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.fa-exclamation-circle {
  color: #dc3545;
}
.modal-header {
  padding: 1rem 2rem !important;
}
.form-control.is-valid {
  background-image: none !important;
}

.border {
  border-radius: 0px;
  border-color: #fed16e !important;
}

.tab {
  width: 50%;
  text-align: center;
  font-weight: bold;
}

.forget {
  text-align: end;
}

.card {
  margin: auto;
  border: 0ch;
}

a {
  color: black;
}

.nav-pills .nav-link.active,
.nav-pills .show > .nav-link {
  color: #fff;
  background-color: #fed16e;
  border-radius: 0;
}

.submit {
  width: 100%;
  background-color: white;
  color: gray;
  border-color: #fed16e !important;
  border-radius: 9px;
  font-weight: bold;
}

.btn-primary:not(:disabled):not(.disabled).active,
.btn-primary:not(:disabled):not(.disabled):active,
.show > .btn-primary.dropdown-toggle {
  color: #fff;
  background-color: #fed16e;
  border-color: #fed16e;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0);
}

.btn:focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0);
}
.inputform {
  border-radius: 0;
  border-bottom: 1px solid black;
  border-top: 0;
  border-left: 0;
  border-right: 0;
}

.form-control:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0);
}

.footer {
  margin-top: 60px;
  text-align: center;
  color: gray;
}
.bg {
  margin: auto;
  background-color: #fff;
  height: 100vh;
  overflow: auto;
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .text-title {
    font-size: medium;
  }
  .footer {
    margin-top: 60px !important;
    padding: 15px;
  }
}
</style>
