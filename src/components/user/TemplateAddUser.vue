<template>
  <div>
    <button class="btn btn-add" @click="openModal()">
      <i class="fa fa-plus" /> <span style="font-size:16px;"> เพิ่มบัญชี </span>
    </button>

    <vue-modaltor
      :visible="open"
      @hide="hideModal()"
      :animation-panel="'modal-slide-top'"
      :resize-width="{ 3000: '40%', 992: '50%', 768: '90%' }"
    >
      <b-container fluid>
        <h5><b>เพิ่มบัญชีผู้ใช้งาน</b></h5>
        <hr />
        <b-row class="my-1">
          <b-col sm="12"
            ><span style="white-space: nowrap;"
              >คำแนะนำ : กรุณาใส่ชื่อ Username ที่ต้องการ</span
            ></b-col
          >
          <b-col sm="12"
            ><span style="white-space: nowrap;">{{
              this.getAddUserStatus
            }}</span></b-col
          >
          <b-col sm="12">
            <br />
            <label for="input-small1"
              ><b>Username </b> <span class="h5 text-danger">*</span></label
            >
          </b-col>
          <b-col sm="12">
            <b-form-input
              id="input-small1"
              placeholder=""
              v-model="user.username"
            ></b-form-input>
          </b-col>
        </b-row>

        <b-row class="my-1">
          <b-col sm="12">
            <label for="input-small1"
              ><b>Password </b><span class="h5 text-danger">*</span></label
            >
          </b-col>
          <b-col sm="12">
            <b-form-input
              id="input-small1"
              placeholder=""
              v-model="user.password"
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row class="my-1">
          <b-col sm="12">
            <label for="input-small1"
              ><b>Email </b><span class="h5 text-danger">*</span></label
            >
          </b-col>
          <b-col sm="12">
            <b-form-input
              id="input-small1"
              placeholder=""
              v-model="user.email"
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row v-if="usernameproject == 'adminatapy'">
          <b-col cols="12">
            <label for="input-small1"
              ><b>Group </b><span class="h5 text-danger">*</span></label
            >
            <!-- {{ getProjectList }} -->
            <v-select
              v-if="getProjectList"
              :options="getProjectList"
              label="projectname"
              :reduce="(option) => option.projectname"
              v-model="projectnameselected"
            ></v-select>
          </b-col>
        </b-row>
        <b-row class="my-1">
          <b-col sm="12">
            <label for="input-small1"><b>ชื่อ </b></label>
          </b-col>
          <b-col sm="12">
            <b-form-input
              id="input-small1"
              placeholder=""
              v-model="user.name"
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row class="my-1">
          <b-col sm="12">
            <label for="input-small1"><b>นามสกุล </b></label>
          </b-col>
          <b-col sm="12">
            <b-form-input
              id="input-small1"
              placeholder=""
              v-model="user.lastname"
            ></b-form-input>
          </b-col>
        </b-row>

        <b-row class="my-1">
          <b-col sm="12">
            <label for="input-small1"><b>บริษัท/หน่วย </b></label>
          </b-col>
          <b-col sm="12">
            <b-form-input
              id="input-small1"
              placeholder=""
              v-model="user.company"
            ></b-form-input>
          </b-col>
        </b-row>

        <!-- <b-row class="my-1">
            <b-col sm="12">
              <label for="input-small1"><b>Email </b></label>
            </b-col>
            <b-col sm="12">
              <b-form-input id="input-small1" placeholder="" v-model="user.email"></b-form-input>
    
            </b-col>
          </b-row> -->

        <b-row class="my-1">
          <b-col sm="12">
            <label for="input-small1"><b>สิทธิ์ </b></label>
          </b-col>
          <b-col sm="12">
            <div>
              <input
                type="radio"
                value="user"
                id="user"
                name="permit"
                v-model="user.role"
              />
              <label for="user">User</label>
            </div>
            <div>
              <input
                type="radio"
                value="admin"
                id="admin"
                name="permit"
                v-model="user.role"
              />
              <label for="admin">Admin</label>
            </div>
          </b-col>
        </b-row>

        <b-row class="my-1">
          <b-col sm="12" style="text-align:right;">
            <br />
            <b-button class="btn btn-close" size="sm" @click="hideModal()"
              >ปิดหน้าต่าง</b-button
            >
            <b-button class="btn btn-save" size="sm" @click="submitform()"
              >บันทึก</b-button
            >
          </b-col>
        </b-row>
      </b-container>
    </vue-modaltor>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    projectUser: {
      type: Object,
    },
    usernameproject: { type: String },
    userAll: {
      type: Boolean,
    },
  },
  data() {
    return {
      open: false,
      projectnameselected: "",
      user: {
        username: "",
        password: "",
        name: "",
        lastname: "",
        company: "",
        role: "user",
        email: "",
      },
    };
  },
  methods: {
    onChangenProject() {
      this.$store.dispatch("fetchTemplateProjectOne", {
        projectname: this.projectnameselected,
      });
    },
    submitform() {
      let projectU;
      if (this.usernameproject == "adminatapy") {
        projectU = {projectname:this.projectnameselected}
      } else {
        projectU = this.projectUser;
      }
      console.log("projectname", this.projectUser);
      this.$store.dispatch("addUser", {
        data: this.user,
        project: projectU,
        usernameproject: this.usernameproject ,
      });
      console.log("Save data employee");
      this.open = false;
    },
    hideModal() {
      this.open = false;
    },
    openModal() {
      this.user.username = "";
      this.user.password = "";
      this.user.name = "";
      this.user.lastname = "";
      this.user.company = "";
      this.user.email = "";
      this.user.role = "user";
      this.$store.dispatch("statusUser", "");
      this.open = true;
    },
  },
  created() {
    this.$store.dispatch("fetchTemplateProject");
  },
  computed: {
    ...mapGetters(["getAddUserStatus", "getProjectList"]),
  },
  mounted() {},
};
</script>

<style scoped>
.btn-close {
  color: #f8f9fa;
  background-color: #4c412b;
  border-color: #4c412b;
  box-shadow: 1px 1px 3px #666666;
}
.btn-save:hover {
  background: #fed16e;
  border-color: #fed16e;
}
.btn-save {
  background: #ede7dd;
  border-color: #ede7dd;
  color: #4c412b;
  box-shadow: 1px 1px 3px #666666;
}
td {
  vertical-align: middle;
}
.btn-add:hover {
  background-color: #504b3c;
  color: white;
}
.btn-add:hover .fa-plus {
  background-color: #504b3c;
}
.btn-add {
  background-color: #ede7dd;
  color: #504b3c;
  padding: 8px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 25px;
  box-shadow: 1px 1px 3px #666666;
}

@media only screen and (min-width: 0px) and (max-width: 600px) {
  .btn-add {
    margin: auto;
    display: block;
    margin-top: 20px;
  }
}
</style>
