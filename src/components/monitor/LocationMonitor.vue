<template>
  <div class="pr-lg-5 pl-lg-5">
    <b-row>
      <b-col md="6" lg="6" class="p-2">
        <v-select
          multiple
          :options="nameRegion"
          v-model="select_Region"
          placeholder="เลือกภูมิภาค"
          @input="regions()"
          id="search-input"
          class="my-0"
          label="text"
        >
        </v-select>
      </b-col>
      <b-col md="6" lg="6" class="p-2">
        <v-select
          multiple
          :options="dataChagwats"
          v-model="select_changwats"
          @input="changWats()"
          :disabled="isDisabled1"
          id="search-input"
          placeholder="เลือกจังหวัด"
          label="name"
          class="my-0"
        >
        </v-select>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6" lg="6" class="p-2">
        <v-select
          multiple
          :options="dataAmphoes"
          v-model="select_amphoes"
          id="search-inputd"
          :disabled="isDisabled"
          placeholder="เลือกเขต"
          class="my-0 gg"
        ></v-select>
      </b-col>
      <b-col md="6" lg="6" class="p-2">
        <b-input-group class="mb-2 my-0">
          <b-input-group-prepend is-text>
            <i class="fa fa-user" aria-hidden="true"></i>
          </b-input-group-prepend>
          <b-form-input
            type="text"
            placeholder="ชื่อบัญชี"
            size="md"
            v-model="username"
          ></b-form-input>
        </b-input-group>
      </b-col>
    </b-row>
    <b-alert show variant="danger" class="w-100 p-1" v-if="alert">กรุณาเลือกจังหวัด</b-alert>
    <div class="text-right">
      <b-button @click="submit" id="search-btn"  variant="warning" :disabled="isDisabled">
        ค้นหา</b-button
      >
    </div>

    <div v-if="showData == true" class="mt-3">
      <vue-element-loading
        :active="getLoadLocation"
        size="80"
        background-color="rgba(255, 255, 255, 0.3)"
        color="#fbf7f6"
      />
      <b-row class="mt-4" v-if="cw">
        <b-col lg="8" class="m-auto my-1">
          <h5 class="bold text-lg-left">
            <i class="fas fa-map-marker-alt" /> {{ cw }}
            <span v-if="am">/ {{ am.toString() }} </span>
            <span
              v-if="uname"
              class="font-weight-light small m-3"
              id="bg-user"
              ><i class="fa fa-user" /> {{ uname }}</span
            >
          </h5>
        </b-col>
        <b-col lg="4" class="text-lg-right my-1">
          <span id="post-comment">
            <i class="far fa-paper-plane" />
            <b> {{ getLocationCount | numFormat }} </b> โพสต์
          </span>
        </b-col>
      </b-row>

      <hr class="m-1 mb-3" v-if="select_changwats" />
      <b-row>
        <b-col class="center m-auto p-0">
          <div class="mb-5" id="hbox">
            <!-- <TabPost /> -->
            <TabPost
              :tabs="'PostTab'"
              :api="'location'"
              :changwats="cw"
              :amphoes="am"
              :users="username"
              :statusLocat="apiAble"
              :btn="btnstatus"
            />
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import TabPost from "@/components/profile/TabPost.vue";
import { mapGetters } from "vuex";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  data() {
    return {
      uname:"",
      alert: false,
      cw: "",
      am: "",
      cwdata: "",
      btnstatus: false,
      showData: false,
      changwats_name: "",
      options: [],
      dataAmphoes: [],
      dataChagwats: [],
      idx: "",
      select_Region: "",
      select_amphoes: "",
      select_changwats: "",
      username: "",
      apiAble: false,
      nameRegion: [
        { value: ["0", "1", "2", "3", "58", "59"], text: "กรุงเทพและปริมลฑล" },
        {
          value: [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "12",
            "14",
            "15",
            "16",
            "58",
            "59",
          ],
          text: "ภาคกลาง",
        },
        {
          value: ["47", "48", "49", "51", "52", "53", "54"],
          text: "ภาคกลางตอนบน",
        },
        {
          value: [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "16",
            "58",
            "59",
            "60",
          ],
          text: "ภาคกลางตอนล่าง",
        },
        {
          value: ["38", "39", "40", "41", "42", "43", "44", "45", "46"],
          text: "ภาคเหนือ",
        },
        {
          value: [
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
            "29",
            "30",
            "31",
            "32",
            "33",
            "34",
            "35",
            "36",
            "37",
          ],
          text: "ภาคอีสาน",
        },
        {
          value: [
            "63",
            "64",
            "65",
            "66",
            "67",
            "68",
            "69",
            "70",
            "71",
            "72",
            "73",
            "74",
            "75",
            "76",
          ],
          text: "ภาคใต้",
        },
        { value: ["50", "55", "56", "61", "62"], text: "ภาคตะวันตก" },
        {
          value: ["10", "11", "12", "13", "14", "15", "17"],
          text: "ภาคตะวันออก",
        },
      ],
    };
  },
  components: {
    TabPost,
    vSelect,
  },
  computed: {
    ...mapGetters([
      "getChangwats",
      "getAmphoes",
      "getLocationCount",
      "getCwIndex",
      "getLoadStatus",
      "getLoadLocation",
    ]),
    isDisabled: function () {
      var select_changwats = this.select_changwats;
      return !select_changwats;
    },
    isDisabled1: function () {
      var select_Region = this.select_Region;
      return !select_Region;
    },
    // Reg() {
    //   let data = this.changwats_name;
    //   if (data) {
    //     return;
    //   } else {
    //     data = this.cwdata;
    //   }
    //   return data;
    // },
  },
  methods: {
    submit() {
      if (this.select_changwats == "") {
        this.alert = true;
      } else {
        this.alert = false;
      }
      this.showData = true;
      this.btnstatus = !this.btnstatus;
      this.cw = this.changwats_name;
      this.am = this.select_amphoes
      this.uname =this.username;
      console.log("this.select_changwats", this.select_changwats);
    },
    searchLocation() {},
    regions() {
      if ( this.select_Region=="") {
        this.select_changwats =""
      }
      //  this.apiAble = true;
      let regid = Object.keys(this.select_Region).map((key) => {
        let n = this.select_Region[key].value;
        return n;
      });
      let temp = regid.join();
      temp = temp.split(",");
      const uniqueArr = Array.from(new Set(temp));

      let result = uniqueArr.map((key) => {
        return this.getChangwats[key];
      });
      this.dataChagwats = result;

      let result2 = Object.keys(this.dataChagwats).map((key) => {
        return this.dataChagwats[key].name;
      });
      this.cwdata = result2.toString();
    },
    changWats() {
      this.apiAble = true;
      this.select_amphoes = "";

      let result_Am = Object.keys(this.getAmphoes).map((key) => {
        return this.getAmphoes[key];
      });

      this.changwats_name = Object.keys(this.select_changwats).map((key) => {
        return this.select_changwats[key].name;
      });
      this.changwats_name = this.changwats_name.toString();
      console.log(" this.changwats_name", this.changwats_name);
      let changwats_id = Object.keys(this.select_changwats).map((key) => {
        return { changwats_id: this.select_changwats[key].id };
      });
      // console.log("this.select_changwats.id", changwats_id);

      const arr1 = result_Am;
      const arr2 = changwats_id;
      const intersection = arr1.filter((item1) =>
        arr2.some((item2) => item1.changwat_id === item2.changwats_id)
      );
      // console.log("intersection", intersection);

      let results = Object.keys(intersection).map((key) => {
        return intersection[key].name.th;
      });
      console.log("reg", results);
      this.dataAmphoes = results;
    },
  },
};
</script>

<style scoped>
#search-btn {
  background: #fed16ebf;
}
#search-btn:hover {
  background: rgb(243, 190, 76);
}
.vs__dropdown-menu {
  z-index: 9999999 !important;
}
#bg-user {
  background: #e9ecef;
  padding: 1px 10px;
  border-radius: 20px;
}
#hbox {
  height: 100vh;
  width: 95%;
  margin: auto;
}
.btn-primary {
  color: #fff;
  background-color: #4c412b;
  border-color: #4c412b;
}

.form-control {
  display: block;
  height: calc(1.5em + 0.75rem + -1px);
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  #bg-user {
    display: inline-block;
    padding: 4px 10px;
  }
}
</style>
