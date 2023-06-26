<template>
  <div>
    <vue-modaltor
      :visible="open"
      @hide="hideModal"
      :animation-panel="'modal-slide-top'"
      :resize-width="{ 3000: '80%', 992: '50%', 768: '90%' }"
    >
      <v-select v-on:input="onChangenProject()" :options="optionProject" v-model="projectnameselected" ></v-select>

      <b-container fluid>
        <h5><b>Edit Userx</b></h5>
        <hr />

        <b-row class="my-1">
                    <b-col sm="12" style="text-align:left;">
<h5>Domain Name</h5>
          </b-col>
          <b-col sm="12" style="text-align:left;">
{{this.getProjectOneDomainName}}
          </b-col>
        </b-row>
        <b-row class="my-1">
                    <b-col sm="12" style="text-align:left;">
<h5>Hashtag</h5>
          </b-col>
          <b-col sm="12" style="text-align:left;">
{{this.getProjectOneHashtag}}
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

import "vue-select/dist/vue-select.css";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      open: false,
      optionProject: [],
      projectnameselected:"",
      user: {
        _id: "",
        username: "",
      },
    };
  },
  methods: {

    submitform() {

          console.log(" >>>"+JSON.stringify({userlist:this.user._id}))
          console.log(" >>>"+JSON.stringify({projectname:this.projectnameselected}))
          this.$store.dispatch("addNameToProject",{projectname:this.projectnameselected,userid:this.user._id});
          this.hideModal();

    },
    hideModal() {
      this.open = false;
    },
    onChangenProject(){
      this.$store.dispatch("fetchTemplateProjectOne",{projectname:this.projectnameselected});

    },
    openModal(item) {
      // console.log(item)
      this.user._id = item._id;
      this.user.username = item.username;
      this.projectnameselected = item.projectname;
      this.$store.dispatch("fetchTemplateProjectOne",{projectname:this.projectnameselected});
      this.open = true;
      var array = [];
      this.getProjectList.forEach(function(itemx) {
        array.push(itemx.projectname);
      });
      this.optionProject = array;
    },
  },
  computed: {
    ...mapGetters(["getProjectList","getProjectOneDomainName","getProjectOneHashtag"]),
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
