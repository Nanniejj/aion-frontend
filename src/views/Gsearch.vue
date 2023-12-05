<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />

    <div id="content">
      <vue-element-loading
        :active="getLoadStatus"
        :is-full-screen="true"
        size="80"
        background-color="rgba(0, 0, 0, 0.3)"
        color="#fff"
        spinner="bar-fade-scale"
      />
      <h1 class="title">Gsearch</h1>
      <b-container>
        <b-row align-h="center">
          <b-col sm="12" md="8" lg="8">
            <b-form-group>
              <b-form-radio-group
                v-model="select_radio"
                :options="options_date"
                name="buttons2"
                class="md-font"
              ></b-form-radio-group>
            </b-form-group>
          </b-col>
        </b-row>

        <GsearchResult :select_radios="select_radio" />
      </b-container>
    </div>
  </div>
</template>

<script>
import HomeNav from "@/components/HomeNav.vue";
import GsearchResult from "@/components/gsearch/GsearchResult.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    HomeNav,
    GsearchResult,
  },
  data: function() {
    return {
      text: null,
      select_radio: "day",
      options_date: [
        { text: "ย้อนหลัง 1 วัน", value: "day" },
        { text: "ย้อนหลัง 1 สัปดาห์", value: "week" },
      ],
    };
  },
  computed: {
    ...mapGetters([
      "getSelected",
      "getDateChoice",
      "getGsearch",
      "getSubmitGsearch",
      "getLoadStatus",
      "getRoleMion"
    ]),
  },

  created() {
    //this.$store.dispatch("fetchGsearch")
    //this.$store.dispatch("fetchGsearch",{date:this.select_radio,keyword:this.keyGsearch});
  },
};
</script>

<style scoped>
* {
  font-family: "Prompt", "FontAwesome", sans-serif;
}

#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
}
#navHome {
  z-index: 1;
}

.text {
  background-color: #ede7dd;
  width: 550px;
  height: 30pt;
  border-radius: 3pt;
  margin: auto;
}
.domain {
  margin-top: 20pt;
  margin-left: -31rem;
  margin-bottom: 10pt;
}

.form-control {
  margin: auto;
}

.date {
  margin-top: 20pt;
  margin-left: 39.3rem;
  margin-bottom: 10pt;
}

.dropdown-toggle {
  color: #4c412b;
  background-color: #ede7dd;
  border-color: transparent;
}

.dropdown-toggle::after {
  margin-left: 7em;
}
.btn-primary:not(:disabled):not(.disabled).active,
.btn-primary:not(:disabled):not(.disabled):active,
.show > .btn-primary.dropdown-toggle {
  color: #4c412b;
  background-color: #ede7dd;
  border-color: transparent;
}

.show > .btn-primary.dropdown-toggle:focus {
  box-shadow: none !important;
}

.btn-primary:focus {
  box-shadow: none !important;
}

.submit {
  width: 70%;
  background-color: white;
  color: gray;
  border-color: #fed16e !important;
  border-radius: 9px;
  font-weight: bold;
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  #overflow-page {
    overflow: hidden;
  }
}
@media only screen and (min-width: 950px) and (max-width: 1150px) {
  .date {
    margin-top: 20pt;
    margin-left: 11.5rem;
    margin-bottom: 10pt;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
}
</style>
