<template>
  <div style="width: 100%; height: 100%;">
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
export default {
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
  mounted() {
    this.locs = this.locs.map(v => {
      let tmpLocs = window.longdo.Util.overlayFromWkt(v.poly)
        .map(v => v.location())
        .flat();
      console.log(v.province_geocode, v.section);
      return {
        ...v,
        location: tmpLocs,
        fillColor:
          v.province == "10" && v.section == 10
            ? "rgba(0, 255, 0, 0.4)"
            : "rgba(255, 0, 0, 0.1)"
      };
    });
  }
};
</script>
