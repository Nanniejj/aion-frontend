<template>
  <div>
    <b-col sm="12" md="12" lg="12">
      <b-row style="padding: 2em">
        <b-col>
          <div>
            <div>
              Force
              <input
                class="slider"
                type="range"
                min="10"
                max="10000"
                v-model="force"
              />
              {{ parseInt(options2.force).toLocaleString() }}
              <!-- <input type="range" min="10" max="10000" v-model="force" />
              {{ options2.force }} -->
              <d3-network
                :net-nodes="getNodesInfluencerLink"
                :net-links="getLinksInfluencerLink"
                :options="options2"
              />
            </div>
          </div>
        </b-col>
      </b-row>
    </b-col>
    <b-row>
      <b-col cols="" class="table-responsive">
        <table
          class="table table-hover"
          style="margin-top: 20px; border: 2px solid #5da294"
          id="table-rlt"
        >
          <thead>
            <tr>
              <th class="md-font">ACCOUNT</th>
              <th class="md-font">COUNT</th>
              <th class="md-font">RELATION</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in getLinksDataInfluencerLink"
              v-bind:key="index"
              @click="item.showing = !item.showing"
              style="cursor: pointer"
            >
              <td
                style="
                  vertical-align: baseline;
                  font-weight: 1000;
                  font-size: large;
                "
                class="lg-font linksdata"
              >
                <i type="button" class="fa fa-plus" :hidden="item.showing" />
                <i type="button" class="fa fa-minus" :hidden="!item.showing" />
                <!-- <span id="td-text">{{ item.source }}</span> -->
                <img
                  v-if="item.source_img"
                  :src="item.source_img"
                  class="imguser"
                />
                <img v-else src="@/assets/Twitter.png" class="imguser" />
                <a
                  style="word-break: break-all"
                  class="md-font"
                  v-bind:href="'https://twitter.com/' + item.source"
                  >  @{{ item.source }}</a
                >
              </td>
              <td class="md-font linksdata">
                <span v-if="item.showing">
                  <span v-if="item.target.length === 0">ไม่พบข้อมูล</span>
                  <span
                    v-else
                    v-for="(target, index) in item.target"
                    :key="index"
                    >{{ target.weight }} <br
                  /></span>
                </span>
              </td>
              <td class="md-font linksdata">
                <span v-if="item.showing">
                  <span v-if="item.target.length === 0">ไม่พบข้อมูล</span>
                  <span
                    v-else
                    v-for="(target, index) in item.target"
                    :key="index"
                    >
                    <!-- {{ target.name }}  -->
                    <img
                      v-if="target.target_img"
                      :src="target.target_img"
                      class="imguser" />
                    <img v-else src="@/assets/Twitter.png" class="imguser" />
                    <a
                      style="word-break: break-all"
                      class="md-font"
                      v-bind:href="'https://twitter.com/' + target.name"
                      >  @{{ target.name }}</a
                    >
                    <br/>
                  </span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import D3Network from "vue-d3-network";

export default {
  data: function () {
    return {
      showData: false,
      nodeSize: 20,
      resizeListener: true,
      nodeLabels: true,
      linkWidth: 1,
      linkLabels: true,
      force: 900,
    };
  },
  components: {
    D3Network,
  },
  mounted() {
    console.log("########", this.getNodeLink);
  },
  computed: {
    ...mapGetters([
      "getDataInfluencerLink",
      "getLinksDataInfluencerLink",
      "getLinksInfluencerLink",
      "getNodesInfluencerLink",
      "getNodeLink",
    ]),
    options2() {
      return {
        nodeSize: this.nodeSize,
        resizeListener: true,
        nodeLabels: true,
        linkWidth: 1,
        linkLabels: true,
        force: this.force,
      };
    },
  },
}
</script>

<style scoped>
input[type="range"] {
  width: -webkit-fill-available;
}
.slider.slider-horizontal {
  width: 1200px !important;
}
.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 25px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  -webkit-transition: opacity 0.2s;
  transition: opacity 0.2s;
}
.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  background: #4caf50;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  background: #4caf50;
  cursor: pointer;
}
#table-rlt {
  margin-bottom: 50px;
  table-layout: fixed;
}
#td-text {
  padding-left: 10%;
}
.fa-plus {
  color: #549f8f;
}
.fa-plus:hover {
  color: #4c412b;
}
.fa-minus {
  color: #549f8f;
}
.fa-minus:hover {
  color: #4c412b;
}
#table-rlt > tbody > tr > td.lg-font.linksdata {
  text-align: left !important;
}
#table-rlt th,
#table-rlt tr td {
  border: 2px solid #5da294;
}
table.footer_margin {
  margin-bottom: 50px;
}
.table {
  border-collapse: collapse;
  width: 80%;
  margin: auto;
}
.imguser {
  border-radius: 50%;
  position: relative;
  z-index: 1;
  width: 50px;
  height: 50px;
  margin-left: 3% !important ;
}
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .imgsocial {
    width: 5vw !important;
  }
  .md-font {
    font-size: 1.5vw !important;
  }
  table {
    width: 100%;
  }
  #btn-show[data-v-17d1fff8] {
    width: 45%;
  }
}
/* ipad */
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  #navHome {
    overflow: hidden;
  }
  table {
    width: 95%;
  }
  #row-user {
    flex: 0 0 20%;
    max-width: 20%;
  }
  .md-font[data-v-17d1fff8] {
    font-size: 1.7vw !important;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .fa-plus {
    margin-left: -3%;
  }
  #table-rlt > tr:nth-child(1) > th:nth-child(2) {
    width: 15vw;
  }
  #table-rlt > tr:nth-child(1) > th:nth-child(1) {
    width: 35vw;
  }
  #table-rlt > thead > tr > th:nth-child(2) {
    width: 15vw;
  }
  #table-rlt > thead > tr > th:nth-child(1) {
    width: 35vw;
  }
  .md-font {
    font-size: 3.5vw !important;
  }
  .spinner-border {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    margin: -75px 0 0 -55px;
    width: 90px;
    height: 90px;
  }
  #submit-btn {
    margin-left: -31px;
    margin-bottom: 20px;
  }
  #fb-icon {
    width: 10vw !important;
  }
  #tw-icon {
    width: 10vw !important;
  }
  table {
    width: 100%;
  }
  #content > div.container > div:nth-child(5) {
    padding: unset !important;
  }
  #content
    > div.container
    > div:nth-child(5)
    > div.col-12
    > table
    > tr
    > div
    > div:nth-child(3) {
    flex: 0 0 65%;
    max-width: 65%;
  }
  #content
    > div.container
    > div:nth-child(5)
    > div.col-12
    > table
    > tr
    > div
    > div.col-3 {
    flex: 0 0 35%;
    max-width: 35%;
  }
  #icon-sc {
    margin-right: -68px;
    margin-top: -70px;
    margin-left: unset;
  }
  .imgsocial {
    width: 10vw !important;
  }
  #content
    > div.container
    > div:nth-child(5)
    > div.col-12
    > table
    > tr
    > div
    > div:nth-child(4) {
    flex: 0 0 100%;
    max-width: 100%;
  }
  #content
    > div.container
    > div:nth-child(5)
    > div.col-12
    > table
    > tr
    > div
    > div:nth-child(4) {
    margin-top: -35px;
  }
  #score-row {
    margin-top: 15px;
  }
  #score-tag {
    position: absolute;
    left: -100px;
  }
  #score-data {
    margin-left: 82px;
  }
  #table-rlt {
    table-layout: fixed;
    width: 100%;
  }
  #row-name {
    margin-bottom: 20px;
  }
  .linksdata {
    font-size: 3.5vw !important;
  }
  #btn-show[data-v-17d1fff8] {
    width: 60%;
  }
  .fa.fa-share-alt[data-v-17d1fff8] {
    display: unset;
  }
  #td-text {
    padding-left: 3px;
  }
}

@media only screen and (max-width: 500px) and (min-width: 400px) {
  #icon-sc[data-v-17d1fff8] {
    margin-left: -107px;
    margin-top: 5px;
    margin-bottom: 20px;
  }
}

@media only screen and (min-width: 700px) and (max-width: 800px) {
  table {
    width: 100%;
  }
}
@media only screen and (min-width: 500px) and (max-width: 590px) {
  table {
    width: 100%;
  }
  .imgsocial {
    width: 8vw !important;
  }
  #icon-sc[data-v-17d1fff8] {
    margin-right: 0;
    margin-top: 0;
    margin-left: -40px;
  }
}
</style>