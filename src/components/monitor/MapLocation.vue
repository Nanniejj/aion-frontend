<!-- src/components/MapComponent.vue -->
<template>
  <div style="height: 100%;" class="mb-5">
    <div id="map2"></div>
    <div id="label-color"></div>
    <div class="mt-1">
      <span class="float-left">
        <i class="fas fa-smile" style="font-size: 22px;color:#5bb44a;"></i>
      </span>
      <span class="">
        <i class="fas fa-meh" style="font-size: 22px;color: #fed06e;"></i
      ></span>
      <span class="float-right ">
        <i class="fas fa-frown-open" style="font-size: 22px;color: #f06964;"></i
      ></span>
    </div>
    <div class="text-center ">
      <span class="float-left" style="font-size: 15px;color:#5bb44a;"
        >positive</span
      >
      <span style="font-size: 15px;color: #f5a700;">neutral</span>
      <span class="float-right " style="font-size: 15px;color: #f06964;"
        >negative</span
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import IG from "./geocode.json";
import Color from "colorjs.io";
import { API_V2_URL } from "@/common/config";
export default {
  props: {
    typeMap: {
      type: String,
    },
    code_id: {
      type: Array,
      default: [],
    },
    sdate: {
      type: String,
    },
    edate: {
      type: String,
    },
    keyword: {
      type: Array,
    },
  },
  data() {
    return {};
  },

  components: {},
  watch: {
    // code_id(val) {
    //   console.log("val", val);
    // },
  },
  computed: {
    ...mapGetters(["getLocationStat"]),
  },

  methods: {
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
        if (posval == 0 && negval == 0 && negval == 0) {
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
    async getLocationApi(val) {
      // this.getColorLabel();
      if (val) {
        console.log("val5555", val);
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
      }
    },
    async selectMap(val, locat) {
      // delete object1
      var object1 = null;

      let code = [...val].map((x) => x.id);
      const map2 = new longdo.Map({
        placeholder: document.getElementById("map2"),
      });

      if (locat && locat.lon) {
        if (val.length > 50) {
          map2.location({ lon: 100, lat: 14 }, true);
        } else {
          map2.location({ lon: locat.lon, lat: locat.lat }, true);
        }
      }

      // // changwat __ / khet 10__ / 10____ tumbon
      // const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

      val.map(async (loc) => {
        // await sleep(500)
        object1 = new longdo.Overlays.Object(loc.id, "IG", {
          lineColor: loc.color,
          fillColor: loc.color,
          clickable: true,
          popup: {
            title: loc.name,
            loadDetail: updateDetail,
            // html: ,
            detail: `<div  class="text-left" id="popup-map" style="cursor:pointer" >
                <div class="bold text-center"> <span class="text-sub bold"> Total : ${loc.count.toLocaleString()} posts</span> </div>
                <div class="my-1 text-sub">  <i class="fas fa-smile" style="font-size: 22px;color:#5bb44a;"></i> ${loc.positiveSentiment.toLocaleString()} posts</div>
                <div class="my-1 text-sub">   <i class="fas fa-meh" style="font-size: 22px;color: #fed06e;"></i> ${loc.neutralSentiment.toLocaleString()} posts</div>
                <div class="my-1 text-sub">  <i class="fas fa-frown-open" style="font-size: 22px;color: #f06964;"></i> ${loc.negativeSentiment.toLocaleString()} posts</div>
                </div>`,

            size: { width: 200, height: 200 },
            closable: true,
            // loadHtml: this.toAllPost(loc),
          },
          label: `<div class="bold text-center" style='font-size: medium; color: #322929;background: #ffffffb8;padding: 7px 7px;border-radius: 50%;'>
                ${loc.count.toLocaleString()}
                </div>`,
          labelOptions: {
            title: loc.count + " posts",
            icon: {
              html: `<div class="bold" style='font-size: medium; color: #322929;background: #ffffffb8;padding: 7px 7px;border-radius: 50%;'>
                ${loc.count.toLocaleString()}
                </div>`,
              offset: { x: 5, y: 10 },
            },
          },
        });
        // let _this = this;
        let payload = {
          start: this.sdate,
          end: this.edate,
          location: String(loc.name),
          keyword: String(this.keyword),
          sort_by: "",
          sentiment: "1,0,-1",
          source:
            "news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads",
          type: this.typeMap,
        };
        let _this = this;
        function updateDetail(element) {
          element.addEventListener("click", () => {
            localStorage.setItem("mappost", JSON.stringify(payload));
            const routeData = _this.$router.resolve({
              name: "MapPost",
            });
            window.open(routeData.href, "_blank");
          });
        }
        map2.Overlays.load(object1);
      });

      // this.$store.commit("setLoadMapStat", false);
      if (code && code[0].length == 2) {
        map2.zoom(7, true);
      }
      if (code && code[0].length == 4) {
        map2.zoom(12, true);
      }
      if (code && code[0].length == 6) {
        map2.zoom(13, true);
      }
    },

    initMap(val) {
      this.$nextTick(() => {
        let created = document.getElementById("map2");
        if (created && longdo) {
          const map2 = new longdo.Map({
            placeholder: document.getElementById("map2"),
          });
          map2.location({ lon: 100, lat: 14 }, true);
          // map2.zoom(6, true);
          // changwat __ / khet 10__ / 10____ tumbon
          var object1 = new longdo.Overlays.Object(val, "IG");

          map2.Overlays.load(object1);
          map2.zoom(7, true);
        }
      });
    },
  },
  async mounted() {
    this.initMap();
    this.$emitter.on("callApiMap", async (val) => {
      // this.initMap();
      let x = this.code_id[this.code_id.length - 1];
      let loc = await this.getLocationApi(x);
      console.log("valmap", val);
      await this.selectMap(val, loc);
      // console.log("callApiMap", stat);
    });
  },
};
</script>

<style scoped>
#label-color {
  width: 100%;
  height: 30px;
  background-image: linear-gradient(to right, #27aa13a1, #fed16e94, #ff040469);
  background-color: #ebe8e1;
}
#map2 {
  height: 100%;
}
</style>
<style>
.text-sub {
  font-size: 13.5px;
  /* font-weight: 600; */
}
.ldmap_placeholder .ldmap_frame .ldmap_popup_detail {
  width: 150px !important;
  max-height: 175px !important;
  min-height: 70px !important;
}

.popup-map {
  background: #ffffffec;
  width: 80px;
  height: auto;
  min-height: 70px;
  border-radius: 16px;
  padding: 10px;
}
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .text-sub {
    font-size: 10.5px;
    /* font-weight: 600; */
  }
  .ldmap_placeholder .ldmap_selectable {
    user-select: text;
    -webkit-user-select: text;
    -ms-user-select: text;
    -webkit-touch-callout: default;
    box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px,
      rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
  }
  .ldmap_placeholder .ldmap_popup_mini {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: auto !important;
    background: #fff;
    border-top: 2px solid #2a97eb;
    display: none;
    z-index: 12;
    overflow-y: auto;
  }
}
</style>
