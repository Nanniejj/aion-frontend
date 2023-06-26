<template>
  <div id="content">
    <h1 class="title">Influencer Link</h1>

    <div class="mx-auto box-date mb-3 text-left">
      <img src="@/assets/Twitter.png" class="social-img mr-2" />
      <span v-if="start === end" class="text-left onedate">
        <i class="far fa-calendar-alt"></i> {{ start }}
      </span>
      <span v-else class="text-left twodate">
        <i class="far fa-calendar-alt"></i> {{ start }} - {{ end }}
      </span>
    </div>

    <iframe
      src="http://128.199.73.147:8077/test"
      class="if-link"
      scrolling="no"
      frameBorder="0"
    >
    </iframe>
    <!-- <Link/> -->
    <!-- <div class="container">
      <b-row>
        <b-col sm="12" md="12" lg="12">
          <b-row align-h="center">
            <b-col align-self="center">
              <div class="select2 md-font" style="text-align: center">
                เลือกช่องการค้นหา
              </div>
            </b-col>
          </b-row>
          <b-row align-h="center" style="margin-top: 1em">
            <b-col cols="2" align-self="center">
              <a v-on:click="twitter()" id="tw" style="cursor: pointer"
                ><img src="@/assets/Twitter.png" class="imgsocial"
              /></a>
            </b-col>
            <b-col cols="2" align-self="center">
              <a v-on:click="facebook()" id="fb" class="navp"
                ><img src="@/assets/Facebook.png" class="imgsocial"
              /></a>
            </b-col>
          </b-row>
          <b-row style="margin-top: 1em">
            <b-col>
              <i style="color: #a94442" class="md-font">{{ notice }}</i>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <div id="input">
                <div id="input1">
                  <textarea
                    class="form-control valinput md-font"
                    style="width: 100%"
                    rows="5"
                    id="valinput1"
                    v-model="list_name"
                  ></textarea>
                </div>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <button type="button" class="btn btn-default" @click="submit()">
                <span id="submit" class="md-font">Submit</span>
              </button>
              <InfluencerLinkTab v-if="getSubmitInfluencerLink" />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div> -->
    <b-modal id="my-modal2" hide-footer title="แจ้งเตือน" class="md-font">
      <div class="d-block text-center">
        <p class="md-font">กรุณากรอกข้อมูล</p>
      </div>
      <b-button
        class="mt-3 md-font"
        variant="outline-danger"
        block
        @click="$bvModal.hide('my-modal2')"
        style="width: 40%;margin: auto;"
        >Close Me</b-button
      >
    </b-modal>
    <alertErr />
  </div>
</template>

<script>
import $ from "jquery";
import alertErr from "@/components/alert_err.vue";
import { mapGetters } from "vuex";
import moment from "moment";
// import InfluencerLinkTab from "@/components/influencer/InfluencerLinkTab.vue";
// import Link from "@/components/influencer/Link.vue";

export default {
  components: {
    // InfluencerLinkTab,
    alertErr,
    // Link
  },
  data: function() {
    return {
      start: null,
      end: null,
      notice:
        "กรอกรายชื่อทั้งหมดลงในกล่องข้อความ คั่นแต่ละรายชื่อด้วยการ enter",
      showData: false,
      nodeSize: 20,
      resizeListener: true,
      nodeLabels: true,
      linkWidth: 1,
      linkLabels: true,
      force: 900,
      list_name: null,
      datatxt: [],
      count: 1,
    };
  },
  computed: {
    ...mapGetters([
      "getDataInfluencerLink",
      "getLinksInfluencerLink",
      "getNodesInfluencerLink",
      "getSubmitInfluencerLink",
    ]),
    options2() {
      return {
        nodeSize: this.nodeSize,
        resizeListener: true,
        nodeLabels: true,
        linkWidth: 1,
        linkLabels: true,
        force: this.force,
      };
    },
  },
  methods: {
    submit: function() {
      this.datatxt = [];
      // var _this = this
      console.log("000000000000000", this.datatxt);
      var i;
      for (i = 1; i < this.count + 1; i++) {
        var a = $("#valinput" + i)
          .val()
          .split("\n");
        this.datatxt = a;
        console.log("1111000000000000", a);
      }
      const influencer = this.datatxt;
      // this.list_name = []
      //this.submited = true;
      if (this.list_name == null) {
        this.$bvModal.show("my-modal2");
      } else {
        this.$store.commit("setSubmitInfluencerLink", true);
        // fetchInfluencerLink
        this.$store.dispatch("fetchInfluencerLink", {
          influencer: influencer,
          source: "twitter",
        });
      }
    },
    facebook() {
      document.getElementById("tw").style.opacity = "0.3";
      document.getElementById("fb").style.opacity = "1";
    },
    twitter() {
      document.getElementById("tw").style.opacity = "1";
      document.getElementById("fb").style.opacity = "0.3";
    },
  },
  created() {
    this.start = moment(new Date())
      .format()
      .slice(0, 10);
    this.end = moment(new Date())
      .format()
      .slice(0, 10);
  },
};
</script>

<style scoped>
.social-img{
  width: 50px;
  text-align: left;
}
.box-date{
  width: 80%;
}
.navp {
  opacity: 0.3;
}
.navp:hover {
  opacity: 1;
}

#table-rlt {
  margin-bottom: 50px;
}
#td-text {
  padding-left: 30%;
}
.fa-plus {
  color: #549f8f;
}
.fa-plus:hover {
  color: #4c412b;
}
.fa-minus {
  color: #549f8f;
}
.fa-minus:hover {
  color: #4c412b;
}
#table-rlt > tbody > tr > td.lg-font.linksdata {
  text-align: left !important;
}
#loading-links {
  position: unset;
  left: unset;
  top: unset;
  z-index: 1;
  width: unset;
  height: unset;
  margin: unset;
  width: 100px;
  height: 100px;
  pointer-events: none;
  overflow: hidden;
}
.fa.fa-share-alt {
  color: #4c412b;
  font-size: 25px;
  display: block;
  margin-bottom: 5px;
}

.link-label {
  fill: purple;
  transform: translate(0, 0.5em);
  font-size: 0.9em;
}

#table-rlt th,
#table-rlt tr td {
  border: 2px solid #5da294;
}
#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
}

table.footer_margin {
  margin-bottom: 50px;
}
#btn-show {
  background-color: #ffd57f;
  width: 15%;
  padding: 9px;
  border-radius: 16px;
  margin-bottom: 50px;
}
#btn-show:hover {
  background-color: #f7e2a3;
}
.spinner-border {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  width: 150px;
  height: 150px;
  margin: -75px 0 0 -75px;
  width: 120px;
  height: 120px;
  pointer-events: none;
  overflow: hidden;
}

#content > div.container > div:nth-child(5) {
  padding: 0em;
}
#submit-btn {
  margin-bottom: 50px;
}
#linkloading.linkshowloading {
  display: block;
  overflow: hidden;
}
#linkloading {
  display: none;
}
#loading-links {
  color: #4c412b;
}

ul {
  margin: 0 auto;
  width: 100%;
  text-align: center;
}
li {
  list-style: none;
  display: inline-block;
  color: white;
}

.navp {
  opacity: 0.3;
}
.navp:hover {
  opacity: 1;
}

table {
  border-collapse: collapse;
  width: 80%;
  margin: auto;
}

th,
td {
  text-align: center;
  padding: 8px;
}

/* tr:nth-child(even) { */
/*background-color: #f2f2f2;*/
/* }  */

.select2 {
  font-weight: bold;
  /*  margin-left: 9%;*/
  margin: auto;
  margin-bottom: 10px;
  font-size: 18px;
  /*  text-align: start;*/
}
.select {
  margin: auto;
  /*text-align: start;
    margin-left: 9%;*/
}
.drop {
  color: #4c412b;
  background-color: #ede7dd;
  width: 125px;
  border-color: transparent;
}

.dropdown-toggle {
  width: 80%;
  color: #4c412b;
  background-color: #ede7dd;
  border-color: transparent;
  cursor: pointer;
}

.dropdown-toggle::after {
  margin-left: 7em;
}
.btn-primary:not(:disabled):not(.disabled).active,
.btn-primary:not(:disabled):not(.disabled):active,
.show > .btn-primary.dropdown-toggle {
  color: #4c412b;
  width: 80%;
  background-color: #ede7dd;
  border-color: transparent;
}

.show > .btn-primary.dropdown-toggle:focus {
  box-shadow: none !important;
}

.btn-primary:focus {
  box-shadow: none !important;
}

#submit {
  font-weight: bold;
  color: #ddd;
  border: 2px solid #fed16e;
  line-height: 1;
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color: transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
}
#submit:hover {
  background-color: #fed16e;
  color: white;
}

.btn.focus,
.btn:focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0);
}

.imgsocial {
  width: 40px;
}
.imguser {
  border-radius: 50%;
  position: relative;
  z-index: 1;
}
#icon-sc {
  margin-left: -40px;
  margin-top: 5px;
}
#menu {
  padding-top: 22px;
}

#menu ul {
  list-style-type: none;
  /* margin-left: 2.5%;*/
  padding: 0;
  overflow: hidden;
  /*width: 700px;*/
}

/* #menu li {
  float: left;
} */

#menu li a {
  display: block;
  color: white;
  text-align: center;
  padding: 9px;
  text-decoration: none;
}

#menu li[data-v-0804f336] {
  float: left;
  width: 100px;
}

#menu li:hover {
  background-color: #dddddd;
}

.all {
  background-color: #fed16e;
  color: white;
  width: 80px;
  padding-top: 0.3rem;
  padding-bottom: 0;
}

.node-label {
  font-size: 0.5em;
}

.loadtext {
  margin-top: 10px;
  color: #4c412b;
  margin-bottom: 70px;
}

@media only screen and (min-width: 1150px) and (max-width: 1750px) {
  .select2 {
    margin-left: -10.52%;
    margin-bottom: 10px;
    font-size: 18px;
  }
}
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .imgsocial {
    width: 5vw !important;
  }
  .md-font {
    font-size: 1.5vw !important;
  }
  table {
    width: 100%;
  }
  #btn-show[data-v-17d1fff8] {
    width: 45%;
  }
}
/* ipad */
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  #navHome {
    overflow: hidden;
  }
  table {
    width: 95%;
  }
  #row-user {
    flex: 0 0 20%;
    max-width: 20%;
  }
  .md-font[data-v-17d1fff8] {
    font-size: 1.7vw !important;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  #table-rlt > tr:nth-child(1) > th:nth-child(2) {
    width: 15vw;
  }
  #table-rlt > tr:nth-child(1) > th:nth-child(1) {
    width: 35vw;
  }
  #table-rlt > thead > tr > th:nth-child(2) {
    width: 15vw;
  }
  #table-rlt > thead > tr > th:nth-child(1) {
    width: 35vw;
  }
  .md-font {
    font-size: 3.5vw !important;
  }
  .spinner-border {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    margin: -75px 0 0 -55px;
    width: 90px;
    height: 90px;
  }
  #submit-btn {
    margin-left: -31px;
    margin-bottom: 20px;
  }
  #tw {
    margin-left: 10%;
  }
  table {
    width: 100%;
  }
  #content > div.container > div:nth-child(5) {
    padding: unset !important;
  }
  #content
    > div.container
    > div:nth-child(5)
    > div.col-12
    > table
    > tr
    > div
    > div:nth-child(3) {
    flex: 0 0 65%;
    max-width: 65%;
  }
  #content
    > div.container
    > div:nth-child(5)
    > div.col-12
    > table
    > tr
    > div
    > div.col-3 {
    flex: 0 0 35%;
    max-width: 35%;
  }
  #icon-sc {
    margin-right: -68px;
    margin-top: -70px;
    margin-left: unset;
  }
  .imgsocial {
    width: 10vw !important;
  }
  #content
    > div.container
    > div:nth-child(5)
    > div.col-12
    > table
    > tr
    > div
    > div:nth-child(4) {
    flex: 0 0 100%;
    max-width: 100%;
  }
  #content
    > div.container
    > div:nth-child(5)
    > div.col-12
    > table
    > tr
    > div
    > div:nth-child(4) {
    margin-top: -35px;
  }
  #score-row {
    margin-top: 15px;
  }
  #score-tag {
    position: absolute;
    left: -100px;
  }
  #score-data {
    margin-left: 82px;
  }
  #table-rlt {
    table-layout: fixed;
    width: 100%;
  }
  #row-name {
    margin-bottom: 20px;
  }
  .linksdata {
    font-size: 3.5vw !important;
  }
  #btn-show[data-v-17d1fff8] {
    width: 60%;
  }
  .fa.fa-share-alt[data-v-17d1fff8] {
    display: unset;
  }
  #td-text {
    padding-left: 0;
  }
}

@media only screen and (max-width: 500px) and (min-width: 400px) {
  #icon-sc[data-v-17d1fff8] {
    margin-left: -107px;
    margin-top: 5px;
    margin-bottom: 20px;
  }
}

@media only screen and (min-width: 700px) and (max-width: 800px) {
  table {
    width: 100%;
  }
}
@media only screen and (min-width: 500px) and (max-width: 590px) {
  table {
    width: 100%;
  }
  .imgsocial {
    width: 8vw !important;
  }
  #icon-sc[data-v-17d1fff8] {
    margin-right: 0;
    margin-top: 0;
    margin-left: -40px;
  }
}
@media only screen and (max-width: 800px) and (min-width: 0px) {
  .title {
    font-size: 5vw !important;
  }
  .imguser[data-v-0da41e60] {
    width: 12vw !important;
  }
}
</style>
