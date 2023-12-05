<template>
  <span>
    <span
      class="fas fa-list-ul"
      v-b-tooltip.hover
      title="การจัดการบัญชี"
      size="sm"
      @click="openModal(items)"
    ></span>
    <vue-modaltor
      :visible="open"
      @hide="hideModal"
      :animation-panel="'modal-slide-top'"
      :resize-width="{ 3000: '80%', 992: '50%', 768: '90%' }"
    >
      <b-container fluid>
        <!-- {{ items.token }} -->
        <h5><b>การจัดการบัญชี</b></h5>
        <hr />
        <b-card class="my-3">
          <h5>
            <i class="fa fa-users-cog" aria-hidden="true"></i>
            <b> ข้อมูลและการจัดการกลุ่ม</b>
          </h5>
          <b-row>
            <b-col cols="12" md="2" class="bold py-2">
              username
            </b-col>
            <b-col cols="12" md="10" class="py-2">
              {{ items.username }}
            </b-col>
            <b-col cols="12" md="2" class="bold py-2">
              email
            </b-col>
            <b-col cols="12" md="10" class="py-2">
              {{ items.email }}
            </b-col>
            <b-col cols="12" md="2" class="bold py-2">
              Group
            </b-col>
            <b-col cols="12" md="10" class="py-2">
              <!-- {{ items.projectname }} -->
              <v-select
                v-on:input="onChangenProject()"
                :options="optionProject"
                v-model="projectnameselected"
              ></v-select>
            </b-col>
            <b-col cols="12" md="2" class="bold py-2">
              Domain
            </b-col>
            <b-col cols="12" md="10" class="py-2">
              <b-button
                v-b-toggle.collapse-1
                variant="warning"
                block
                class="btn-slide"
                size="sm"
              >
                <b-icon icon="eye-fill" aria-hidden="true" class="mr-2">
                </b-icon>
                Domain
              </b-button>
              <b-collapse id="collapse-1" class="mt-2">
                <b-card
                  style="max-height: 200px;
    text-align: left;
    overflow: auto;"
                >
                  {{ getProjectOneDomainName }}
                </b-card>
              </b-collapse>
            </b-col>
            <b-col cols="12" md="2" class="bold py-2">
              Hashtag
            </b-col>
            <b-col cols="12" md="10" class="py-2">
              <b-button
                v-b-toggle.collapse-2
                variant="warning"
                block
                class="btn-slide"
                size="sm"
              >
                <b-icon icon="eye-fill" aria-hidden="true" class="mr-2">
                </b-icon>
                Hashtag
              </b-button>
              <b-collapse id="collapse-2" class="mt-2">
                <b-card
                  style="max-height: 200px;
    text-align: left;
    overflow: auto;"
                >
                  {{ getProjectOneHashtag }}
                </b-card>
              </b-collapse>
            </b-col>
          </b-row>
        </b-card>
        <b-card v-if="items.token" >
          <b-card-text >
            <h5>
              <i class="fa fa-laptop" aria-hidden="true"></i> <b> Device</b>
            </h5>
            <div v-if="items.token && items.token.length">
              <div v-for="(device, k) in items.token" :key="k" class="my-2">
                <b-row
                 
                >
                  <b-col cols="12" md="6"  v-b-toggle="'collapse-' + device.id + k"
                  :aria-expanded="visible ? 'true' : 'false'">
                    <div>
                      <span class="mr-3">{{ k + 1 }}</span>
                      {{ device.useragentText }}
                    </div>
                  </b-col>
                  <b-col cols="12" md="4"  v-b-toggle="'collapse-' + device.id + k"
                  :aria-expanded="visible ? 'true' : 'false'">
                    {{ dateTime(device.lastUsed) }}
                    <div class="small text-muted">
                      ใช้งานเมื่อ {{ compareDate(device.lastUsed) }} ที่แล้ว
                    </div>
                  </b-col>
                  <b-col>
                    <span class="ml-3 mr-3">
                      <span
                        class="fas fa-trash-alt"
                        v-b-tooltip.hover
                        title="ลบ device"
                        size="sm"
                        v-on:click="delDevice(device.id)"
                        style="cursor: pointer;"
                      ></span
                    ></span>
                  </b-col>
                </b-row>
                <b-row>
                  <b-collapse :id="'collapse-' + device.id + k" class="mt-2">
                    <b-card>
                      <div class="small text-muted px-4">
                        {{ device.useragent }}
                      </div>
                      <div class="small  px-4">IP : {{ device.ip }}</div>
                    </b-card>
                  </b-collapse>
                </b-row>
                <hr
                  class="my-2"
                  v-if="
                    deviceName && deviceName.length && deviceName.length > 1
                  "
                />
              </div>
            </div>
            <div v-else class="my-3 ">
              ไม่พบข้อมูล
            </div>
          </b-card-text>
        </b-card>

        <b-row class="my-1">
          <b-col sm="12" style="text-align:right;">
            <br />
            <b-button class="btn btn-close" size="sm" @click="hideModal()"
              >ปิดหน้าต่าง</b-button
            >
            <b-button class="btn btn-save mx-2" size="sm" @click="submitform()"
              >บันทึก</b-button
            >
          </b-col>
        </b-row>
      </b-container>
    </vue-modaltor>
  </span>
</template>

<script>
import moment from "moment";
import "vue-select/dist/vue-select.css";
import { mapGetters } from "vuex";
export default {
  props: {
    items: { type: Object },
  },
  data() {
    return {
      visible: false,
      open: false,
      optionProject: [],
      projectnameselected: "",
      deviceName: ["device01", "device02", "device03"],
      user: {
        _id: "",
        username: "",
      },
    };
  },
  methods: {
    delDevice(tokenid) {
      this.$confirm("คุณต้องการลบ device นี้ ?").then(() => {
        const axios = require("axios").default;
        var config = {
          method: "post",
          url: "https://api2.cognizata.com/api/v2/user/removeToken",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          data: { tokenid: tokenid },
        };
        axios(config)
          .then((response) => {
            // this.dataItems=response.data
            this.$store.dispatch("fetchLoggedDevice");
            console.log("response", response.data);
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
      }).catch(() => console.log('cancel'));
    },
    submitform() {
      console.log(" >>>" + JSON.stringify({ userlist: this.user._id }));
      console.log(
        " >>>" + JSON.stringify({ projectname: this.projectnameselected })
      );
      this.$store.dispatch("addNameToProject", {
        projectname: this.projectnameselected,
        userid: this.user._id,
      });
      this.hideModal();
    },
    hideModal() {
      this.open = false;
    },
    onChangenProject() {
      this.$store.dispatch("fetchTemplateProjectOne", {
        projectname: this.projectnameselected,
      });
    },
    openModal(item) {
      // console.log(item)
      this.user._id = item._id;
      this.user.username = item.username;
      this.projectnameselected = item.projectname;
      this.$store.dispatch("fetchTemplateProjectOne", {
        projectname: this.projectnameselected,
      });
      this.open = true;
      var array = [];
      this.getProjectList.forEach(function(itemx) {
        array.push(itemx.projectname);
      });
      this.optionProject = array;
    },
    dateTime(lastused) {
      var then = moment(lastused).format("DD/MM/YYYY HH:mm:ss");
      return then;
    },
    compareDate(lastused) {
      var now = new Date();
      var then = moment(lastused);
      // console.log("now", now, "then", then);
      var ms = moment(now, "DD/MM/YYYY HH:mm:ss").diff(
        moment(then, "DD/MM/YYYY HH:mm:ss")
      );
      var d = moment.duration(ms);
      let txtd,
        txth,
        txtm = "",
        txts = "";
      if (d.days() > 0) {
        txtd = String(d.days()) + "วัน ";
        // console.log("txtd", txtd);
      } else {
        txtd = "";
      }
      if (d.hours() > 0) {
        txth = String(d.hours()) + "ชั่วโมง ";
      } else {
        txth = "";
      }
      if (d.minutes() > 0) {
        txtm = String(d.minutes()) + "นาที ";
      } else {
        txtm = "";
      }

      if (
        d.days() == 0 &&
        d.hours() == 0 &&
        d.minutes() == 0 &&
        d.seconds() > 0
      ) {
        txts = String(d.seconds()) + "วินาที ";
      } else {
        txts = "";
      }

      let txttime = txtd + txth + txtm + txts;

      return txttime;
    },
  },
  computed: {
    ...mapGetters([
      "getProjectList",
      "getProjectOneDomainName",
      "getProjectOneHashtag",
    ]),
  },
  mounted() {},
  created() {
    this.$store.dispatch("fetchTemplateProject");
  },
};
</script>

<style scoped>
* {
  color: #2c3e50;
}
.fa-list-ul {
  background: #fed16ebf;
  padding: 10px;
  border-radius: 50%;
  box-shadow: 1px 1px 3px #666666;
  margin: 7px 5px;
  color: #4c412b;
}
.fa-trash-alt {
  color: #4c412b;
}
.btn-slide {
  background: #ede7dd00;
  border-color: #ede7dd;
}
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
