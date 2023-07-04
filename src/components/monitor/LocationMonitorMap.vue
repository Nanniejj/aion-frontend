<template>
  <div style="width: 100%; height: 100%;">
    {{ getMaxMinMap }}
    {{ getMapdata }}
    <longdo-map>
      <longdo-map-polygon
        v-for="loc in locs"
        :key="loc"
        :location="loc.location"
        :lineWidth="1"
        :lineColor="'rgba(0, 0, 0, 1)'"
        :fillColor="loc.fillColor"
        :title="`เขต ${loc.section}: 30 Posts`"
      />
    </longdo-map>
  </div>
</template>

<script>
import mapData from "./mapdata.json";
import { mapGetters } from "vuex";

function hexToArray(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ]
    : null;
}

function ArrayToHex(rgb) {
  return (
    "#" +
    ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)
  );
}

function interpolateColor(color1, color2, factor) {
  color1 = this.hexToArray(color1);
  color2 = this.hexToArray(color2);
  if (arguments.length < 3) {
    factor = 0.5;
  }
  var result = color1.slice();
  for (var i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return this.ArrayToHex(result);
}

function getFactor(value, min, max) {
  return (value - min) / (max - min);
}

export default {
  computed: {
    ...mapGetters(["getMaxMinMap", "getMapdata"])
  },
  props: {
    id_province: String
  },
  watch: {
    id_province(val) {
      console.log("val", val, this.id_province);
      // this.getColor()
    }
  },
  data() {
    const importantPoly = mapData.data
      .filter(v => v.province_geocode)
      .map(v => ({
        poly: v.multipolygon,
        province: v.province_geocode,
        section: v.ward_no
      }));
    return {
      locs: importantPoly
    };
  },
  methods: {},
  async mounted() {
    this.locs = this.locs.map(v => {
      let tmpLocs = window.longdo.Util.overlayFromWkt(v.poly)
        .map(v => v.location())
        .flat();
      // console.log(v.province_geocode, v.section);
      return {
        ...v,
        location: tmpLocs,
        fillColor:
          v.province == this.id_province && v.section == 3
            ? "rgba(0, 255, 0, 0.4)"
            : "rgba(255, 0, 0, 0.1)" && v.province == this.id_province
            ? "rgba(255, 0, 0, 0.1)"
            : "rgba(0, 0, 0, 0.1)"
      };
    });
  }
};
</script>
