<template>
  <div>
<div class="map-wrapper">
    <h2 v-if="province" class="province-title">{{province.state}}</h2>
    <div v-if="currentProvince" class="province-info">
      <h3 class="text-center">{{currentProvince.state}}</h3>
      <ul>
        <li>cartodb_id: {{currentProvince.cartodb_id}}</li>
        <li>slug: {{currentProvince.slug}}</li>
      </ul>
    </div>
    <svg></svg>
  </div>
  <div class="container">
    <p>Reference</p>
    <ul>
      <li><a href="https://bl.ocks.org/john-guerra/43c7656821069d00dcbc">https://bl.ocks.org/john-guerra/43c7656821069d00dcbc</a></li>
    </ul>
  </div>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
 data: function () {
    return {
         province: undefined,
        currentProvince: undefined,
    };
  },
 
  methods: {
    selectProvince(province) {
      this.province = province;
    },
    openInfo(province) {
        console.log(province);
      this.currentProvince = province;
    },
    closeInfo() {
      this.currentProvince = undefined;
    },
    
  },

mounted()  {
    // Set svg width & height
    console.log(d3);
// let centered = undefined;
const mapCenter = {
  lat: 1.4,
  lng: 117.5
};
const size = {
  height: 700,
  width: d3.select('.map-wrapper').node().getBoundingClientRect().width,  
};

const color = d3.scaleLinear()
  .domain([1, 20])
  .clamp(true)
  .range(['#08304b', '#08304b']);

const projection = d3.geoEquirectangular()
  .scale(1400)
  .center([mapCenter.lng, mapCenter.lat])
  .translate([size.width / 2, size.height / 2]);

const path = d3.geoPath()
  .projection(projection);

const svg = d3.select('svg')
  .attr('width', size.width)
  .attr('height', size.height);

// Add background
svg.append('rect')
  .attr('class', 'background')
  .attr('width', size.width)
  .attr('height', size.height)
//   .on('click', clicked);

const g = svg.append('g');

// const effectLayer = g.append('g')
//   .classed('effect-layer', true);
const mapLayer = g.append('g')
  .classed('map-layer', true);
 
// Load map data
const geoJsonUrl = 'https://raw.githubusercontent.com/superpikar/indonesia-geojson/master/indonesia.geojson';
d3.json(geoJsonUrl, function(error, mapData) {
    console.log(error);
  var features = mapData.features;

  // Update color scale domain based on data
  color.domain([0, d3.max(features)]);

  // Draw each province as a path
  mapLayer.selectAll('path')
      .data(features)
    .enter().append('path') 
      .attr('d', path)
      .attr('vector-effect', 'non-scaling-stroke')
      console.log('mapLayer',mapLayer);
    //   .style('fill', fillFn)
    //   .on('mouseover', mouseover)
    //   .on('mouseout', mouseout)
    //   .on('click', clicked);
});

// function clicked(d) {
//   var x, y, k;

//   // Compute centroid of the selected path
//   if (d && centered !== d) {
//     var centroid = path.centroid(d);
//     x = centroid[0];
//     y = centroid[1];
//     k = 4;
//     centered = d;
//     this.openInfo(d.properties);
//   } else {
//     x = size.width / 2;
//     y = size.height / 2;
//     k = 1;
//     centered = null;
//     this.closeInfo();
//   }

//   // Highlight the clicked province
//   mapLayer.selectAll('path')
//     .style('fill', function(d){
//       return centered && d===centered ? '#D5708B' : fillFn(d);
//   });

//   // Zoom
//   g.transition()
//     .duration(750)
//     .attr('transform', 'translate(' + size.width / 2 + ',' + size.height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');
// }

// function mouseover(d){
//   // Highlight hovered province
//   d3.select(this).style('fill', '#1483ce');
//   if(d) {
//     this.selectProvince(d.properties);
//   }
// }

// function mouseout(d){
//   this.selectProvince(undefined);
//   console.log(d);
//   // Reset province color
//   mapLayer.selectAll('path')
//     .style('fill', (d) => {
//       return centered && d===centered ? '#D5708B' : fillFn(d);
//     });
// }

// // Get province name length
// function nameLength(d){
//   const n = nameFn(d);
//   return n ? n.length : 0;
// }

// // Get province name
// function nameFn(d){
//   return d && d.properties ? d.properties.name : null;
// }

// // Get province color
// function fillFn(d){
//   return color(nameLength(d));
// }
}

}
</script>

<style scoped>

  .province-title {
    position: absolute;
    top: 50px;
    left: 150px;
    color: white;
  }
  .province-info {
    background: white;
    position: absolute;
    top: 150px;
    right: 20px;
    height: 400px;
    width: 300px;
  }
  .background {
    fill: #021019;
    pointer-events: all;
  }
  .map-layer {
    fill: #08304b;
    stroke: #021019;
    stroke-width: 1px;
  }

</style>