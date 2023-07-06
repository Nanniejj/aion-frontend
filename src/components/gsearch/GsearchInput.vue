<template>
  <b-container>
    <!-- <b-row align-h="center">
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
     </b-row> -->
    <b-row align-h="center">
      <b-col sm="10" md="10" lg="10">
        <b-input-group class="mt-3">
          <b-form-input
            v-model="text"
            placeholder="Enter keywords"
            style="border-radius: 7px;"
            class="md-font"
            id="input"
          ></b-form-input>
          <b-input-group-append>
            <button
              type="button"
              class="btn btn-default"
              style="padding-top: 2px;"
              @click="submit"
            >
              <span id="submit" class="md-font">ค้นหา</span>
            </button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
    <GsearchResult v-if="getSubmitGsearch" />
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import GsearchResult from "@/components/gsearch/GsearchResult.vue";
export default {
  components: {
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
  methods: {
    submit: function() {
      //this.submited = true;
      this.$store.commit("setSubmitGsearch", true);
    },
  },
  computed: {
    ...mapGetters(["getSelected", "getSubmitGsearch"]),
  },
};
</script>

<style scoped>
#input {
  box-sizing: border-box;
  background-image: url("@/assets/search_icon.png");
  background-position: 14px 10px;
  background-repeat: no-repeat;
  padding: 7px 20px 7px 45px;
  border: none;
  background-color: #ede7dd;
  text-align: center;
  border-radius: 7px;
}
</style>
