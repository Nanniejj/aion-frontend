<template>
  <div>
    <div class="box-filter">
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
            label="name"
            v-model="select_amphoes"
            @input="selectTumbon()"
            id="search-inputd"
            :disabled="isDisabled"
            placeholder="เลือกอำเภอ (เขต)"
            class="my-0 gg"
          ></v-select>
        </b-col>

        <b-col md="6" lg="6" class="p-2">
          <v-select
            multiple
            :options="dataTumbon"
            label="subdistrict_name_th"
            v-model="select_tumbon"
            id="search-inputd"
            :disabled="isDisabled"
            placeholder="เลือกตำบล (แขวง)"
            class="my-0 gg"
          ></v-select>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6" lg="6" class="p-2">
          <b-input-group class="mb-2 my-0">
            <b-input-group-prepend is-text>
              <i class="fa fa-pen mr-2" aria-hidden="true"></i> keyword
            </b-input-group-prepend>
            <b-form-tags
              input-id="tags-pills"
              v-model="addKeyword"
              tag-variant="light"
              tag-pills
              size="md"
              placeholder="Enter เพื่อพิมพ์คำใหม่"
              remove-on-delete
              :disabled="!select_changwats.length"
            ></b-form-tags>
          </b-input-group>
        </b-col>
        <b-col md="6" lg="6" class="p-2">
          <b-row>
            <b-col md="9" lg="9" class="m-0">
              <section id="date-picker" class="d-inline-block w-100">
                <date-picker
                  id="date-map"
                  style="width: 100% !important;height:40px"
                  v-model="valueDate"
                  type="date"
                  range
                  @change="checkDateRange"
                  placeholder="เลือกช่วงเวลา"
                  :disabled-date="(date) => date >= new Date()"
                  value-type="format"
                  format="YYYY-MM-DD"
                  >{{ valueDate }}</date-picker
                >
              </section>
            </b-col>
            <b-col md="3" lg="3">
              <div class="text-right">
                <b-button
                  @click="submit"
                  id="search-btn"
                  variant="warning"
                  block
                  :disabled="!select_Region.length && !loadStat"
                >
                  ค้นหา</b-button
                >
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <!-- <b-alert show variant="danger" class="w-100 p-1" v-if="alert"
        >กรุณาเลือกจังหวัด</b-alert
      > -->
    </div>

    <div style="height: 65vh;" class="mb-5">
      <div class="menu-map">
        <div class="btn-map">
          <b-button size="sm" @click="showFilter = !showFilter">
            <i class="fa fa-search"></i> FILTER
          </b-button>
        </div>

        <div class="box-filter2" v-if="showFilter">
          <div
            class="h5 float-right"
            style="cursor: pointer;"
            @click="showFilter = false"
          >
            X
          </div>
          <div class="h5 mt-2">FILTER</div>
          <b-row>
            <b-col md="12" lg="12" class="p-2">
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
            <b-col md="12" lg="12" class="p-2">
              <!-- {{ select_amphoes }} -->
              <!-- {{ select_changwats }} -->
              <!-- {{ dataChagwats }} -->
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
            <b-col md="12" lg="12" class="p-2">
              <v-select
                multiple
                :options="dataAmphoes"
                label="name"
                v-model="select_amphoes"
                @input="selectTumbon()"
                id="search-inputd"
                :disabled="isDisabled"
                placeholder="เลือกอำเภอ (เขต)"
                class="my-0 gg"
              ></v-select>
            </b-col>

            <b-col md="12" lg="12" class="p-2">
              <v-select
                multiple
                :options="dataTumbon"
                label="subdistrict_name_th"
                v-model="select_tumbon"
                id="search-inputd"
                :disabled="isDisabled"
                placeholder="เลือกตำบล (แขวง)"
                class="my-0 gg"
              ></v-select>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="12" lg="12" class="p-2">
              <b-input-group class="mb-2 my-0">
                <b-input-group-prepend is-text>
                  <i class="fa fa-search mr-2" aria-hidden="true"></i> keyword
                </b-input-group-prepend>
                <b-form-tags
                  input-id="tags-pills"
                  v-model="addKeyword"
                  tag-variant="light"
                  tag-pills
                  size="sm"
                  placeholder="Enter เพื่อพิมพ์คำใหม่"
                  remove-on-delete
                  :disabled="!select_Region.length"
                ></b-form-tags>
              </b-input-group>
            </b-col>
            <b-col md="12" lg="12" class="p-2">
              <section id="date-picker" class="d-inline-block w-100">
                <date-picker
                  id="date-map"
                  style="width: 100% !important;height:40px"
                  v-model="valueDate"
                  type="date"
                  range
                  placeholder="เลือกช่วงเวลา"
                  :disabled-date="(date) => date >= new Date()"
                  value-type="format"
                  format="YYYY-MM-DD"
                  @change="checkDateRange"
                  >{{ valueDate }}</date-picker
                >
              </section>
            </b-col>

            <b-col md="12" lg="12">
              <div class="text-right">
                <b-button
                  @click="submit"
                  id="search-btn"
                  variant="warning"
                  block
                  :disabled="!select_Region.length && !loadStat"
                >
                  <b-spinner
                    small
                    v-show="loadStat"
                    style="width: 1rem; height: 1rem;"
                  ></b-spinner>
                  ค้นหา</b-button
                >
              </div>
            </b-col>
          </b-row>
          <!-- <b-alert show variant="danger" class="w-100 p-1" v-if="alert"
            >กรุณาเลือกจังหวัด</b-alert
          > -->
        </div>
      </div>
      <div style="height:100%;">
        <vue-element-loading
          :active="loadStat"
          size="80"
          background-color="rgba(255, 255, 255, 0.2)"
          color="#b6ac9a"
        />
        <MapLocation
          :code_id="code_id"
          class="mb-10 d-block"
          :sdate="start_date"
          :edate="end_date"
          :keyword="keyword"
          :typeMap="typeMap"
        />
      </div>
      <!-- <Map :id_province="idcw" :id_khet="idkt" :key="componentKey" class="mt-3" /> -->
    </div>

    <div v-if="showData == true" class="" style="margin-top: 110px;">
      <div>
        <MapChart
          :code_id="code_id"
          :hgt="chartHeight"
          :sdate="start_date"
          :edate="end_date"
          :keyword="keyword"
          :typeMap="typeMap"
        />
      </div>

      <b-row class="mt-4" v-if="select_Region && select_Region.length">
        <b-col lg="12" class="m-auto my-1">
          <h5 class="bold text-lg-left" style="line-break: anywhere">
            <i class="fas fa-map-marker-alt" />
            <span v-if="cw"> {{ cw }}</span>
            <span v-else> {{ rgtext.toString() }} </span>
            <span v-if="am && am.length">/ {{ am.toString() }} </span>
            <span v-if="tb && tb.length">/ {{ tb.toString() }} </span>

            <span
              v-if="keyword && keyword.length"
              class="font-weight-light  m-3"
              id="bg-user"
              ><i class="fa fa-search" /> {{ keyword.toString() }}</span
            >
          </h5>
        </b-col>
      </b-row>

      <hr class="m-1 mb-3" v-if="select_changwats" />
      <div>
        <MapStatic />
      </div>
      <b-row>
        <b-col class="center m-auto p-0">
          <!-- <vue-element-loading
            :active="getLoadMapPost"
            size="80"
            background-color="rgba(255, 255, 255, 0.2)"
            color="#b6ac9a"
          /> -->
          <div class="mb-5">
            <MapLocationPost
              :keyword="keyword"
              :loc="locPost"
              :sdate="start_date"
              :edate="end_date"
              :typeMap="typeMap"
            />
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import MapChart from "./MapChart.vue";
import TabPost from "@/components/profile/TabPost.vue";
import Map from "@/components/monitor/LocationMonitorMap.vue";
import MapLocation from "./MapLocation.vue";
import { mapGetters } from "vuex";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import geocode from "./geocode.json";
import MapLocationPost from "./MapLocationPost.vue";
import moment from "moment";
import MapStatic from "./MapStatic.vue";
import Color from "colorjs.io";
import { API_V2_URL } from "@/common/config";
export default {
  data() {
    return {
      typeMap: "",
      rgtext: "",
      chartHeight: 0,
      loadStat: false,
      // showMenu:false,
      showFilter: true,
      start_date: "",
      end_date: "",
      valueDate: [
        moment(new Date())
          .format()
          .slice(0, 10),
        moment(new Date())
          .format()
          .slice(0, 10),
      ],
      locPost: [],
      addKeyword: [],
      keyword: [],
      code_id: [],
      select_tumbon: "",
      dataTumbon: [],
      idkt: "",
      mapData: [],
      componentKey: 0,
      idcw: "",
      uname: "",
      alert: false,
      cw: "",
      am: "",
      tb: "",
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
            // "10",
            // "12",
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
        {
          value: [
            "10",
            "81",
            "71",
            "46",
            "62",
            "40",
            "22",
            "24",
            "20",
            "18",
            "36",
            "86",
            "57",
            "50",
            "92",
            "23",
            "63",
            "26",
            "73",
            "48",
            "30",
            "80",
            "60",
            "12",
            "96",
            "55",
            "38",
            "31",
            "13",
            "77",
            "25",
            "94",
            "14",
            "56",
            "82",
            "93",
            "66",
            "65",
            "76",
            "67",
            "54",
            "83",
            "44",
            "49",
            "58",
            "35",
            "95",
            "45",
            "85",
            "21",
            "70",
            "16",
            "52",
            "51",
            "42",
            "33",
            "47",
            "90",
            "91",
            "11",
            "75",
            "74",
            "27",
            "19",
            "17",
            "64",
            "72",
            "84",
            "32",
            "43",
            "39",
            "15",
            "37",
            "41",
            "53",
            "61",
            "34",
          ],
          text: "ทุกจังหวัด",
          // val:'all'
        },
      ],
    };
  },
  components: {
    TabPost,
    vSelect,
    Map,
    MapLocation,
    MapLocationPost,
    MapStatic,
    MapChart,
  },
  computed: {
    ...mapGetters([
      "getLocationPost",
      "getChangwats",
      "getAmphoes",
      "getLocationCount",
      "getCwIndex",
      "getLoadStatus",
      "getLoadLocation",
      "getLoadMapPost",
    ]),
    charth() {
      let code_id = [];
      let val = 0;
      if (this.select_tumbon.length) {
        code_id = this.select_tumbon;
      } else if (this.select_amphoes.length) {
        code_id = this.select_amphoes;
      } else if (this.select_changwats.length) {
        code_id = this.select_changwats;
      } else {
        code_id = this.dataChagwats;
      }
      let data = code_id.slice(0, 10);
      // console.log("data.length", data.length);
      if (data.length) {
        val = 100 + data.length * 30;
      }
      return val;
    },

    isDisabled: function() {
      var select_changwats = this.select_changwats;
      return !select_changwats;
    },
    isDisabled1: function() {
      var select_Region = this.select_Region;
      return !select_Region;
    },
  },
  methods: {
    checkDateRange() {
      const startDate = moment(this.valueDate[0]);
      const endDate = moment(this.valueDate[1]);

      const diffDays = endDate.diff(startDate, 'days');
console.log('diffDays',diffDays);

      if (diffDays > 1) {
        alert('กรุณาเลือกช่วงเวลาที่ไม่เกิน 2 วัน');
        this.valueDate[0] = startDate.add(2, 'days').format('YYYY-MM-DD');
      }
    },
    getColors(posval, neuval, negval) {
      let red = new Color("#ff040469");
      let blue = new Color("#fed16e94");
      let green = new Color("#27aa13a1");
      let rb = red.range(blue);
      let bg = blue.range(green);
      function getColor(pos, neg, neu) {
        let percent = (pos + neu / 2) / (pos + neg + neu);
        percent = percent * 2 - 1;
        // console.log(percent);
        if (posval == 0 && neuval == 0 && negval == 0) {
          return "#0000004e";
        } else {
          if (percent >= 0) {
            return bg(percent)
              .to("hsl")
              .toString();
          } else {
            return rb(0.4 + percent)
              .to("hsl")
              .toString();
          }
        }
      }
      let color = getColor(posval, negval, neuval);
      // console.log("color", color);
      return color;
    },
    apiLocationStat(payload) {
      //"http://localhost:3000" + "/api/v2/userposts/getLocationStat"
      //     url: API_V2_URL + "/api/v2/userposts/getLocationStat",
      this.loadStat = true;
      this.$store.commit("setLoadMapStat", true);
      var config = {
        method: "get",
        url: API_V2_URL + "/api/v2/userposts/getLocationStat",
        params: payload,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };

      this.axios(config)
        .then(async (res) => {
          // commit("setLoadMapStat", false);
          console.log("datastat", res.data);
          let data = [...res.data.result];
          data.map((x) => {
            x.color = this.getColors(
              x.positiveSentiment,
              x.neutralSentiment,
              x.negativeSentiment
            );
          });
          // let arr = await Promise.all(
          //   data.map(async (x) => {
          //     x.loc = await this.getLocationApi(x);
          //     return x; // ส่งค่า x กลับเพื่อให้ Promise.all ได้รับค่าเป็น Promise ที่ resolve ด้วยค่า x
          //   })
          // );
          // console.log("api", arr);
          this.$emitter.emit("callApiMap", data);
          this.loadStat = false;
        })
        .catch((error) => {
          // commit("setLoadMapStat", false);
          this.loadStat = false;
          alert("โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
          console.log(error);
        });
    },
    async getLocationApi(val) {
      var keyword = val.name;
      var area = val.id;
      var apiKey = "ee3f741c3f4b32e012e0948d5c3e8c7e";
      var url = `${API_V2_URL}/api/v2/userposts/getLongdoMapLocation?keyword=${keyword}&area=${area}&span=10km&limit=10&key=${apiKey}`;
      var config = {
        method: "get",
        url: url,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      try {
        const response = await this.axios(config);
        let location = response.data.data[0];
        console.log("response", response.data.data[0]);
        return location;
      } catch (error) {
        console.error("Error:", error);
        return null; // หรือให้รีเทิร์นค่าที่ต้องการในกรณีที่เกิดข้อผิดพลาด
      }
    },
    selectTumbon() {
      this.select_tumbon = [];
      // let khet_id = this.select_amphoes.map((x) => {
      //   console.log('xxx',x.khet_id,IG);
      //   let result_Am = IG.filter((g) => {
      //     console.log("result_Am", g[x.khet_id]);
      //   });
      //   console.log(result_Am);
      // });
      let khet_id = [...this.select_amphoes].map((x) => x.khet_id);
      let geo = geocode.filter((i) => khet_id.includes(i.district_id));
      // const filteredData = IG.filter(item => data1.includes(item[x]));
      this.dataTumbon = geo;
      console.log("select_tumbon", geo, this.select_amphoes);
    },
    submit() {
      // this.componentKey += 1;
      this.cw = "";
      this.am = "";
      this.tb = "";
      this.rgtext = "";
      this.changwats_name = "";
      this.chartHeight = this.charth;
      this.$emitter.emit(
        "checkPlatform",
        "news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads"
      );
      if (this.valueDate[0] == null) {
        this.start_date =
          moment(new Date())
            .format()
            .slice(0, 10) + "T00:00:00";
        this.end_date =
          moment(new Date())
            .format()
            .slice(0, 10) + "T23:59:59";
      } else {
        this.start_date = this.valueDate[0] + "T00:00:00";
        this.end_date = this.valueDate[1] + "T23:59:59";
      }

      if (this.select_changwats == "") {
        this.alert = true;
      } else {
        this.alert = false;
      }
      this.showData = true;
      this.btnstatus = !this.btnstatus;
      this.rgtext = [...this.select_Region].map((x) => x.text);
      this.cw = this.changwats_name;
      this.am = [...this.select_amphoes].map((x) => x.name);
      this.tb = [...this.select_tumbon].map((x) => x.subdistrict_name_th);
      this.uname = this.username;
      let arr_changwat = this.select_changwats;
      let arr_khet = [...this.select_amphoes].map((x) => {
        x.id = x.khet_id;
        return { id: x.khet_id, name: x.name };
      });
      let arr_tumbon = [...this.select_tumbon].map((x) => {
        return { id: x.subdistrict_id, name: x.subdistrict_name_th };
      });
      if (this.select_tumbon.length) {
        this.typeMap = "subdistrict";
        this.code_id = arr_tumbon;
      } else if (this.select_amphoes.length) {
        this.typeMap = "district";
        this.code_id = arr_khet;
      } else if (this.select_changwats.length) {
        this.typeMap = "province";
        this.code_id = arr_changwat;
      } else {
        if (this.select_Region.length) {
          this.typeMap = "province";
          this.code_id = this.dataChagwats;
        }
      }
      this.keyword = this.addKeyword;
      // console.log("code_id", this.code_id);
      this.locPost = [...this.code_id].map((x) => x.name);
      // console.log("locPost", this.locPost);
      let strLoc = JSON.stringify([...this.code_id]);
      console.log("strLoc", this.code_id);
      this.apiLocationStat({
        start: this.start_date,
        end: this.end_date,
        location: strLoc,
        keyword: String(this.addKeyword),
        sentiment: "1,0,-1",
        type:this.typeMap,
        source:
          "news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads",
      });
      // this.$store.dispatch("apiLocationStat", {
      //   start: this.start_date,
      //   end: this.end_date,
      //   location: strLoc,
      //   keyword: String(this.addKeyword),
      //   sentiment: "0,1,-1",
      //   source:
      //     "news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads",
      // });
      this.$store.dispatch("apiMapStatic", {
        start: this.start_date,
        end: this.end_date,
        location: String(this.locPost),
        keyword: String(this.addKeyword),
        sort_by: "",
        sentiment: "1,0,-1",
        type:this.typeMap,
        source:
          "news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads",
      });

      this.$store.dispatch("apiLocationPost", {
        start: this.start_date,
        end: this.end_date,
        location: String(this.locPost),
        keyword: String(this.addKeyword),
        sort_by: "",
        sentiment: "1,0,-1",
        type:this.typeMap,
        source:
          "news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads",
      });

      // this.forceRerender();
      // console.log("this.select_changwats", this.select_changwats, this.idcw);
    },
    regions() {
      if (this.select_Region == "") {
        this.select_changwats = "";
        this.select_amphoes = "";
        this.select_tumbon = "";
      }
      let result2;
      console.log("this.select_Region.length", this.select_Region);
      let filter = [...this.select_Region].filter(
        (d) => d.text == "ทุกจังหวัด"
      );
      if (filter.length > 0) {
        this.select_Region = filter;
      }

      console.log(filter);
      if (
        this.select_Region &&
        this.select_Region[0] &&
        this.select_Region[0].value.length !== 77
      ) {
        //  this.apiAble = true;
        let regid = Object.keys(this.select_Region).map((key) => {
          let n = this.select_Region[key].value;
          return n;
        });

        console.log("red", regid);
        let temp = regid.join();
        temp = temp.split(",");
        const uniqueArr = Array.from(new Set(temp));

        let result = uniqueArr.map((key) => {
          return [...this.getChangwats][key];
        });
        this.dataChagwats = result;
        console.log("dataChagwats", this.getChangwats);

        result2 = Object.keys(this.dataChagwats).map((key) => {
          return this.dataChagwats[key].name;
        });
      }
      if (this.select_Region[0].value.length == 77) {
        this.dataChagwats = [...this.getChangwats];
        this.select_changwats = [...this.getChangwats];
      }
      this.cwdata = result2.toString();
    },
    changWats() {
      this.apiAble = true;
      this.select_amphoes = "";
      // console.log('this.getAmphoes',this.getAmphoes);
      let result_Am = Object.keys(this.getAmphoes).map((key) => {
        this.getAmphoes[key].khet_id = key;
        return this.getAmphoes[key];
      });
      console.log("result_Am", result_Am);

      this.changwats_name = Object.keys(this.select_changwats).map((key) => {
        return this.select_changwats[key].name;
      });
      this.changwats_name = this.changwats_name.toString();
      console.log(" this.changwats_name", this.changwats_name);
      let changwats_id = Object.keys(this.select_changwats).map((key) => {
        return { changwats_id: this.select_changwats[key].id };
      });

      const arr1 = result_Am;
      const arr2 = changwats_id;
      this.idcw = changwats_id[0].changwats_id;
      const intersection = arr1.filter((item1) =>
        arr2.some((item2) => item1.changwat_id === item2.changwats_id)
      );
      console.log("intersection", this.idcw[0].changwats_id, arr1);

      let results = Object.keys(intersection).map((key) => {
        // console.log("intersection2", intersection);
        return {
          name: intersection[key].name.th,
          khet_id: intersection[key].khet_id,
        };
      });
      console.log("reg", results);
      this.dataAmphoes = results;
    },
    reRender() {
      this.$forceUpdate();
    },
    forceRerender() {
      this.componentKey += 1;
    },
  },
};
</script>
<style>
.vs__selected-options {
  overflow: auto;
  max-height: 50px;
}
</style>

<style scoped>
.mx-input {
  height: 38px;
}
.box-filter {
  display: none;
}
.input-group-text {
  font-size: 14px;
}
.btn-secondary {
  border-radius: 7px;
  color: #4c412d;
  background-color: #fed06ee1;
  border-color: #fed16edb;
  box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px,
    rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
}
.btn-map {
  margin-bottom: 20px;
  position: absolute;
  z-index: 99;
  margin: 5px 150px;
}

.box-filter2 {
  border-radius: 20px;
  margin-bottom: 20px;

  padding: 20px 30px 30px 30px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  position: absolute;
  z-index: 99;
  background: rgba(255, 255, 255, 0.856);
  width: 377px;
  margin: 45px 51px;
}
.box-filter {
  border-radius: 20px;
  margin-bottom: 20px;
  padding: 30px 40px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}
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
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .menu-map {
    display: none;
  }
  .box-filter {
    display: block;
  }
}
</style>
