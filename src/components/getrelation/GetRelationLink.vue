<template>
  <b-col sm="12" md="12" lg="12">
          
          <b-row style="padding: 2em;">
            <!-- <b-col v-if="showData == false">
              <div style="margin: auto;" class="md-font"> ไม่พบข้อมูล </div>
            </b-col> -->
            <b-col ><!-- v-if="showData == true" -->
              <div>
                <div>
                  Force
                  <input class="slider" type="range" min="10" max="5000" v-model="force" />
                  {{ options2.force }}
                  <br />
                  <br />
                  <!--Node size
                  <input type="range" min="1" max="40" v-model="nodeSize" />
                  {{ options2.nodeSize }}-->
                  <d3-network
                    :net-nodes="getRelationPostNode"
                    :net-links="getRelationPostLink"
                    :options="options2"
                  />
                </div>
              </div>
            </b-col>
          </b-row>
        </b-col>
</template>

<script>
import D3Network from 'vue-d3-network'
import { mapGetters,mapActions } from "vuex";
export default {
components:{
    D3Network
},
data() {
    return {
     nodes: [],
      links: [],
      nodeSize: 20,
      resizeListener: true,
      nodeLabels: true,
      linkWidth: 1,
      linkLabels: true,
      force: 900,
      showData: false,
      settings: {
        strokeColor: "black",
        width: 100,
        svgWigth: 960,
        svgHeight: 600,
        radius: 10
      },
    }
},
computed:{
    ...mapGetters(["getRelationPostLink","getRelationPostNode"]),
    ...mapActions(['fetchRelationPostLink']),
    options2() {
      return {
        nodeSize: this.nodeSize,
        resizeListener: true,
        nodeLabels: true,
        linkWidth: 1,
        linkLabels: true,
        force: this.force,
      };
    }
},
methods: { 
  // reloadData(){
  //     this.$store.dispatch("fetchRelationPostLink");   
  //      this.$store.dispatch("fetchRelationPost"); 
  //  }
},
}

</script>

<style  scoped>
.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 25px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  background: #4CAF50;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  background: #4CAF50;
  cursor: pointer;
}
</style>>
