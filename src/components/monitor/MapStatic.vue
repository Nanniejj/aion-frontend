<template>
  <div>
    <vue-element-loading
      :active="getLoadMapStatic"
      size="80"
      background-color="rgba(255, 255, 255, 0.2)"
      color="#b6ac9a"
    />

    <div class="text-left">
      <span class="h5 mr-4 d-inline-block">Statistics</span>
    </div>
    <span
      class="mt-3 mb-3 box-domain"
      v-if="getMapStatic && getMapStatic.static"
    >
      <b-row class="w-100">
        <!-- stat -->

        <b-col lg="6" align-self="center">
          <b-row cols="2" class="font-icon mb-3" cols-lg="3" cols-md="3">
            <b-col>
              <b-row>
                <b-col cols="auto"
                  ><i class="far fa-comments fa-2x d-inline" />
                </b-col>
                <b-col cols="auto">
                  <div class="text-icon">
                    <b>{{
                      (getMapStatic.static.comments_count +
                        getMapStatic.static.totalPost)
                        | numFormat
                    }}</b>
                    <br />
                    Messages
                  </div>
                </b-col>
              </b-row>
            </b-col>

            <b-col>
              <b-row>
                <b-col cols="auto"
                  ><i class="fa fa-paper-plane fa-2x d-inline" />
                </b-col>
                <b-col cols="auto">
                  <div class="text-icon">
                    <b>{{ getMapStatic.static.totalPost | numFormat }}</b>
                    <br />
                    Posts
                  </div>
                </b-col>
              </b-row>
            </b-col>

            <b-col>
              <b-row>
                <b-col cols="auto"
                  ><i class="far fa-comment fa-2x d-inline" />
                </b-col>
                <b-col cols="auto">
                  <div class="text-icon">
                    <b>{{
                      getMapStatic.static.comments_count | numFormat
                    }}</b>
                    <br />
                    Comments
                  </div>
                </b-col>
              </b-row>
            </b-col>
            <b-col>
              <b-row>
                <b-col cols="auto"><i class="fas fa-users fa-2x"></i> </b-col>
                <b-col cols="auto">
                  <div class="text-icon">
                    <b>
                      {{ getMapStatic.static.totalAccount | numFormat }} </b
                    ><br />
                    Users
                  </div>
                </b-col>
              </b-row>
            </b-col>
            <b-col>
              <b-row>
                <b-col cols="auto"
                  ><i class="far fa-thumbs-up fa-2x"></i>
                </b-col>
                <b-col cols="auto">
                  <div class="text-icon">
                    <b>{{ getMapStatic.static.engagement | numFormat }}</b>
                    <br />
                    Engages
                  </div>
                </b-col>
              </b-row>
            </b-col>
            <b-col>
              <b-row>
                <b-col cols="auto"><i class="fas fa-retweet fa-2x"></i> </b-col>
                <b-col cols="auto">
                  <div class="text-icon">
                    <b
                      >{{
                        getMapStatic.static.retweets_count | numFormat
                      }} </b
                    ><br />
                    Retweet
                  </div>
                </b-col>
              </b-row>
            </b-col>

            <!-- <b-col>
                <b-row>
                  <b-col cols="auto"><i class="fas fa-heart fa-2x"></i> </b-col>
                  <b-col cols="auto">
                    <div class="text-icon">
                      <b>{{ getMapStatic.static.likes_count | numFormat }}</b> <br />
                      Likes
                    </div>
                  </b-col>
                </b-row>
              </b-col> -->

            <b-col class="avg">
              <b-row>
                <b-col cols="auto"
                  ><i class="fas fa-comment-dots fa-2x"></i>
                </b-col>
                <b-col cols="auto">
                  <div class="text-icon">
                    <b>{{ getMapStatic.static.avgComment | numFormat }}</b>
                    <br />
                    Average Comments /Day
                  </div>
                </b-col>
              </b-row>
            </b-col>

            <b-col class="avg">
              <b-row>
                <b-col cols="auto"
                  ><i class="fas fa-chart-line fa-2x"></i>
                </b-col>
                <b-col cols="auto">
                  <div class="text-icon">
                    <b>{{ getMapStatic.static.avgEngage | numFormat }}</b>
                    <br />
                    Average Engages /Day
                  </div>
                </b-col>
              </b-row>
            </b-col>
            <b-col cols="auto">
              <b-row> </b-row>
            </b-col>
          </b-row>

          <!-- sentiment bar -->
          <b-row cols="1">
            <b-col class="mb-1">
              <b-row class="v-cen">
                <b-col cols="auto">
                  <i
                    class="far fa-smile fa-2x d-inline"
                    style="color:#5bb44a;"
                  ></i>
                </b-col>
                <b-col>
                  <b-progress id="barpos" height="20px">
                    <b-progress-bar
                      :value="getMapStatic.static.valpos"
                    ></b-progress-bar
                    ><span class="lbvp bold"
                      >{{
                        getMapStatic.static.positiveSentiment | numFormat
                      }}
                      posts</span
                    >
                  </b-progress>
                </b-col>
              </b-row>
            </b-col>

            <b-col class="mb-1">
              <b-row class="v-cen">
                <b-col cols="auto">
                  <i
                    class="far fa-meh fa-2x d-inline"
                    style="color: #f7b019;"
                  ></i>
                </b-col>
                <b-col>
                  <b-progress id="bar" height="20px">
                    <b-progress-bar
                      :value="getMapStatic.static.val"
                    ></b-progress-bar
                    ><span class="lbv bold"
                      >{{
                        getMapStatic.static.neutralSentiment | numFormat
                      }}
                      posts</span
                    >
                  </b-progress>
                </b-col>
              </b-row>
            </b-col>

            <b-col class="mb-1">
              <b-row class="v-cen">
                <b-col cols="auto">
                  <i
                    class="far fa-frown-open fa-2x d-inline"
                    style="color:#f06964;"
                  ></i>
                </b-col>
                <b-col>
                  <b-progress id="barnag" height="20px">
                    <b-progress-bar
                      :value="getMapStatic.static.valnag"
                    ></b-progress-bar>
                    <span class="lbvn bold"
                      >{{
                        getMapStatic.static.negativeSentiment | numFormat
                      }}
                      posts</span
                    >
                  </b-progress>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
        <b-col lg="6" class=" text-left">
          <MapPlatformChart />
        </b-col>
      </b-row>
    </span>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import MapChart from "./MapChart.vue";
import BarChart from "../chart/BarChart.vue";
import MapPlatformChart from "./MapPlatformChart.vue";

export default {
  components: { MapChart, BarChart, MapPlatformChart },
  computed: {
    ...mapGetters(["getMapStatic",'getLoadMapStatic']),
    barChart() {
      let sum =
        this.getMapStatic.static.positiveSentiment +
        this.getMapStatic.static.neutralSentiment +
        this.getMapStatic.static.negativeSentiment;
      this.valpos = (this.getMapStatic.static.positiveSentiment * 100) / sum;
      this.val = (this.getMapStatic.static.neutralSentiment * 100) / sum;
      this.valnag = (this.getMapStatic.static.negativeSentiment * 100) / sum;
      return {};
    },
  },
  data() {
    return {
      valpos: 0,
      valnag: 0,
      val: 0,
      dataStat: [],
      avgComment: 0,
      avgEngage: 0,
    };
  },
};
</script>
<style scoped>
.onedate,
.twodate {
  left: -14px;
  position: relative;
}
.progress {
  font-size: 14px;
  background-color: #e9ecef00;
}
.lbvn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: rgb(240, 105, 100);
  text-align: center;
  margin-left: 8px;
  min-width: fit-content;
}
.lbv {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: rgb(231, 171, 41);
  text-align: center;
  margin-left: 8px;
  min-width: fit-content;
}
.lbvp {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #5bb44a;
  text-align: center;
  margin-left: 8px;
  min-width: fit-content;
}
#barpos .progress-bar {
  background-color: #5bb44a;
  border-radius: 10px;
}
#bar .progress-bar {
  background-color: rgb(254, 208, 110);
  border-radius: 10px;
}
#barnag .progress-bar {
  background-color: rgb(240, 105, 100);
  border-radius: 10px;
}
.v-cen {
  align-items: center;
  justify-content: center;
}
.icon-sen {
  width: 33px;
}
.row-cols-2 > * {
  margin: 10px 0px;
}
div.col.avg {
  flex: 0 0 50% !important;
  max-width: 50% !important;
}
.text-icon {
  line-height: 17px;
}
.col-auto {
  padding: 5px 2px 5px 5px;
}
.box-domain {
  width: 100%;
  height: auto;
  padding: 20px 20px;
  border-radius: 7px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}
@media only screen and (min-width: 0px) and (max-width: 990px) {
  .font-icon {
    font-size: small;
  }
}
</style>
