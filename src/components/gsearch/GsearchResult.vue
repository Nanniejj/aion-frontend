<template>
  <div>
    <b-container>
      <b-row align-h="center">
        <b-col sm="10" md="10" lg="10">
          <b-input-group class="mt-3">
            <b-form-input
              v-model="keyGsearch"
              placeholder="Enter keywords"
              style="border-radius: 7px;"
              class="md-font"
              id="input"
            ></b-form-input>
            <b-input-group-append>
              <button
                :disabled="!keyGsearch"
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
    </b-container>
    <b-container v-if="getSubmitGsearch">
      <b-row align-h="center">
        <b-col sm="10" md="10" lg="10">
          <b-card style="border:none; ">
            <div v-if="getGsearch.length != 0">
              <div
                v-for="(data, k) in getGsearch"
                :key="k"
                style="text-align: start;margin-top: 1em;"
                class="md-font"
                id="box-content"
              >
                <div>
                  <span id="id-title">{{ k + 1 }}</span>
                  <p>
                    <i class="fa fa-pencil" aria-hidden="true" />
                    <span id="title"><b> Title </b> </span><br />
                    <a
                      id="link"
                      v-bind:href="data.url.substring(7)"
                      target="_blank"
                      ><span>{{ data.text }}</span></a
                    >
                  </p>
                  <i class="fa fa-link" aria-hidden="true"><b> Link </b></i
                  ><br />
                  <a
                    id="link"
                    v-bind:href="data.url.substring(7)"
                    target="_blank"
                  >
                    <span>{{ data.url.substring(7) }} </span></a
                  >
                </div>
              </div>
            </div>
            <div v-if="getGsearch.length == 0" class="md-font">ไม่พบข้อมูล</div>
          </b-card>
        </b-col>
      </b-row>
      <b-row align-h="center" style="padding-bottom:50px">
        <b-col sm="5" md="5" lg="5">
          <button
            type="button"
            class="btn btn-default"
            style="margin-top: 29px;"
            @click="copyText"
            v-clipboard:copy="datas_str"
          >
            <span id="submit" class="md-font">คัดลอกข้อความ</span>
          </button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    select_radios: {
      type: String,
      default: "daily",
    },
  },
  data() {
    return {
      keyGsearch: "",
      datas_str: "",
      text: null,
    };
  },
  methods: {
    copyText: function() {
      this.datas_str = "";
      for (var i = 0; i < this.getGsearch.length; i++) {
        this.datas_str +=
          i +
          1 +
          ".)" +
          " Title : " +
          this.getGsearch[i].text +
          " Link : " +
          this.getGsearch[i].url.substring(7) +
          "\n \n";
      }
      console.log(this.datas_str);
      return this.datas_str;
    },
    submit: function() {
      //this.submited = true;
      this.$store.commit("setSubmitGsearch", true);
      this.$store.dispatch("fetchGsearch", {
        date: this.select_radios,
        keyword: this.keyGsearch,
      });
      //this.copyText()
    },
  },
  computed: {
    ...mapGetters(["getGsearch", "getSubmitGsearch"]),
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
#link {
  color: #2c3e50;
  font-weight: 500;
}
#link:hover {
  color: #4c412b;
  font-weight: 700;
  text-decoration: none;
}
#id-title {
  margin: auto;
  display: block;
  text-align: end;
  color: #c5baba;
}
.fa-pencil,
.fa-link {
  color: #4c412b;
}
#title {
  color: #4c412b;
}
#box-content {
  width: -webkit-fill-available;
  background-color: #ede7dd61;
  padding: 20px;
  border-radius: 20px;
  padding-top: 10px;
  border: 1px solid#4c412bad;
  border-bottom: 3px solid #4c412b;
}
.card-body {
  /* background-color: #ede7dd; */
  padding: 0;
}
.card {
  margin-top: 20px;
}

#submit {
  font-weight: bold;
  color: #fed16e;
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
  cursor: pointer;
}

#submit:hover {
  background-color: #fed16e;
  color: white;
}

.my-buttons .custom-control-input:checked ~ .custom-control-label::before {
  color: #fff !important;
  border-color: #ffc107 !important;
  background-color: #ffc107 !important;
}
</style>
