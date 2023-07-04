<template>
  <div style="width: 100%; height: 100%;">
    <longdo-map>
      <longdo-map-polygon
        v-for="(loc, i) in locs"
        :key="i"
        :location="loc.location"
        :lineWidth="1"
        :lineColor="'rgba(0, 0, 0, 1)'"
        :fillColor="loc.newColor || loc.fillColor"
        :title="loc.title"
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
  color1 = hexToArray(color1);
  color2 = hexToArray(color2);
  if (arguments.length < 3) {
    factor = 0.5;
  }
  var result = color1.slice();
  for (var i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return ArrayToHex(result);
}

function getFactor(value, min, max) {
  return (value - min) / (max - min);
}

export default {
  computed: {
    ...mapGetters(["getMaxMinMap", "getMapdata"])
  },
  props: {
    id_province: String,
    id_khet: String
  },
  watch: {
    id_province(val) {
      console.log("val province", val, this.id_province);
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
    console.log(getFactor, interpolateColor);
    console.log("val province4", this.getMapdata);
    this.locs = this.locs.map(v => {
      let tmpLocs = window.longdo.Util.overlayFromWkt(v.poly)
        .map(v => v.location())
        .flat();
      let newColor = null;
      let title = "";

      let tmpData = this.getMapdata.find(x => parseInt(x.khet) == v.section);
      if (tmpData && v.province == this.id_province) {
        const factor = getFactor(
          tmpData.count,
          this.getMaxMinMap.min,
          this.getMaxMinMap.max
        );
        newColor = interpolateColor("#00ff00", "#ff0000", factor) + "50";
        title = `${tmpData.name}: ${tmpData.count} Posts`;
        console.log(tmpData);
        console.log(newColor);
      }
      return {
        ...v,
        location: tmpLocs,
        fillColor:
          v.province == this.id_province
            ? "rgba(255, 0, 0, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
        newColor,
        title
      };
    });
  }
};
</script>
