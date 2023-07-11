<template>
  <div>
    <vue-modaltor
      :visible="open"
      @hide="hideModal"
      :animation-panel="'modal-slide-top'"
      :resize-width="{ 3000: '80%', 992: '50%', 768: '90%' }"
    >
      <b-container fluid>
        <!-- {{ items }} -->
        <h5><b>การจัดการ Group</b></h5>
        <hr />
        <b-row>
          <b-col cols="2" class="bold py-2">
            username
          </b-col>
          <b-col cols="10" class="py-2">
            {{ items.username }}
          </b-col>
          <b-col cols="2" class="bold py-2">
            email
          </b-col>
          <b-col cols="10" class="py-2">
            {{ items.email }}
          </b-col>
          <b-col cols="2" class="bold py-2">
            Group
          </b-col>
          <b-col cols="10" class="py-2">
            <!-- {{ items.projectname }} -->
            <v-select
              v-on:input="onChangenProject()"
              :options="optionProject"
              v-model="projectnameselected"
            ></v-select>
          </b-col>
        </b-row>
        <b-row class="my-2">
          <b-col sm="12" style="text-align:left;">
            <h6 class="bold">Domain</h6>
          </b-col>
          <b-col
            sm="12"
            style="max-height: 200px;
    text-align: left;
    overflow: auto;"
          >
            {{ this.getProjectOneDomainName }}
          </b-col>
        </b-row>
        <b-row class="my-2">
          <b-col sm="12" style="text-align:left;">
            <h6 class="bold">Hashtag</h6>
          </b-col>
          <b-col
            sm="12"
            style="max-height: 200px;
    text-align: left;
    overflow: auto;"
          >
            {{ this.getProjectOneHashtag }}
          </b-col>
        </b-row>
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
  </div>
</template>

<script>
import "vue-select/dist/vue-select.css";
import { mapGetters } from "vuex";
export default {
  props: {
    items: { type: Object },
  },
  data() {
    return {
      open: false,
      optionProject: [],
      projectnameselected: "",
      user: {
        _id: "",
        username: "",
      },
    };
  },
  methods: {
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
  },
  computed: {
    ...mapGetters([
      "getProjectList",
      "getProjectOneDomainName",
      "getProjectOneHashtag",
    ]),
  },
  created() {
    this.$store.dispatch("fetchTemplateProject");
  },
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
