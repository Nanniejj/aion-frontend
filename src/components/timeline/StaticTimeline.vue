<template>
  <div>

    <div class="p-1" v-if="datachart && datachart.totals">
      <!-- {{ datachart.totals }} -->
      <b-card class="card-platform">
        <!-- <div class="text-left text-tt mb-2 h6 " style="letter-spacing: 1.5px;">Total <span class="h5 bold">{{
                    datachart.totals.posts||0|numFormat }}</span> 
                    Posts</div> -->

        <b-row align-v="start">
          <b-col cols="12" md="5">
            <!-- {{ datachart.total }} -->
            <b-row class="small">
              <b-col cols="12" md="">
                <div><i class="far fa-comments "></i>
                  <span class="h6 bold"> {{
                    numFormat(datachart.totals.message_sum || 0 | numFormat) }}</span>
                </div> messages
              </b-col>
              <b-col cols="12" md="">
                <div><i class="far fa-paper-plane "></i>
                  <span class="h6 bold"> {{
                    numFormat(datachart.totals.posts || 0 | numFormat) }}</span>
                </div> posts
              </b-col>
              <b-col cols="12" md="">
                <div> <i class="far fa-comment " aria-hidden="true"></i>
                  <span class="h6 bold"> {{
                    numFormat((datachart.totals.message_sum - datachart.totals.posts) || 0 | numFormat) }}</span>
                </div>
                comments
              </b-col>
              <b-col cols="12" md="">
                <div> <i class="fas fa-chart-line "></i>
                  <span class="h6 bold"> {{
                    numFormat(datachart.totals.engagement_sum || 0 | numFormat) }}</span>
                </div> Engages
              </b-col>
            </b-row>
            <SentimentBar :positive="datachart.totals.positiveSentiment || 0"
              :neutral="datachart.totals.neutralSentiment || 0" :negative="datachart.totals.negativeSentiment || 0"
              class="py-2" />
          </b-col>
          <b-col>
            <div class="small text-left mb-2"> <span class="bold h6">Total Platform</span> (posts)</div>
            <b-row cols="9" class="mx-auto">
              <!-- Facebook -->
              <b-col>
                <b-row>
                  <b-col cols="12">
                    <div class="text-center">
                      <div class="h3">
                        <img src="@/assets/cfb.png" class="img-issue" />
                        <!-- {{ datachart.totals.facebook | numFormat}} -->
                      </div>
                      <div class="small">
                        {{ numFormat(datachart.totals.facebook | numFormat) }}
                        <!-- <span style="font-size: small;letter-spacing: 1.5px;">posts</span> -->
                      </div>

                    </div>
                  </b-col>
                </b-row>
              </b-col>

              <!-- Twitter -->
              <b-col>
                <b-row>
                  <b-col cols="12">
                    <div class="text-center">
                      <div class="h3">
                        <img src="@/assets/ctw.png" class="img-issue" />
                        <!-- {{ datachart.totals.facebook | numFormat}} -->
                      </div>
                      <div class="small">
                        {{ numFormat(datachart.totals.twitter | numFormat) }}
                        <!-- <span style="font-size: small;letter-spacing: 1.5px;">posts</span> -->
                      </div>

                    </div>
                  </b-col>
                </b-row>
              </b-col>

              <!-- Instagram -->
              <b-col>
                <b-row>
                  <b-col cols="12">
                    <div class="text-center">
                      <div class="h3">
                        <img src="@/assets/cig.png" class="img-issue" />
                      </div>
                      <div class="small">
                        {{ numFormat(datachart.totals.instagram | numFormat) }}
                        <!-- <span style="font-size: small;letter-spacing: 1.5px;">posts</span> -->
                      </div>

                    </div>
                  </b-col>
                </b-row>
              </b-col>

              <!-- Pantip -->
              <b-col>
                <b-row>
                  <b-col cols="12">
                    <div class="text-center">
                      <div class="h3">
                        <img src="@/assets/cpt.png" class="img-issue" />
                      </div>
                      <div class="small">
                        {{ numFormat(datachart.totals.pantip | numFormat) }}
                        <!-- <span style="font-size: small;letter-spacing: 1.5px;">posts</span> -->
                      </div>

                    </div>
                  </b-col>
                </b-row>
              </b-col>

              <!-- YouTube -->
              <b-col>
                <b-row>
                  <b-col cols="12">
                    <div class="text-center">
                      <div class="h3">
                        <img src="@/assets/cyt.png" class="img-issue" />
                      </div>
                      <div class="small">
                        {{ numFormat(datachart.totals.youtube | numFormat) }}
                        <!-- <span style="font-size: small;letter-spacing: 1.5px;">posts</span> -->
                      </div>

                    </div>
                  </b-col>
                </b-row>
              </b-col>

              <!-- News -->
              <b-col>
                <b-row>
                  <b-col cols="12">
                    <div class="text-center">
                      <div class="h3">
                        <img src="@/assets/cn.png" class="img-issue" />
                      </div>
                      <div class="small">
                        {{ numFormat(datachart.totals.news | numFormat) }}
                        <!-- <span style="font-size: small;letter-spacing: 1.5px;">posts</span> -->
                      </div>

                    </div>
                  </b-col>
                </b-row>
              </b-col>

              <!-- TikTok -->
              <b-col>
                <b-row>
                  <b-col cols="12">
                    <div class="text-center">
                      <div class="h3">
                        <img src="@/assets/tt.png" class="img-issue" />
                      </div>
                      <div class="small">
                        {{ numFormat(datachart.totals.tiktok | numFormat) }}
                        <!-- <span style="font-size: small;letter-spacing: 1.5px;">posts</span> -->
                      </div>
                    </div>
                  </b-col>
                </b-row>
              </b-col>

              <!-- Blockdit -->
              <b-col>
                <b-row>
                  <b-col cols="12">
                    <div class="text-center">
                      <div class="h3">
                        <img src="@/assets/Block.png" class="img-issue" />
                      </div>
                      <div class="small">
                        {{ numFormat(datachart.totals.blockdit | numFormat) }}
                        <!-- <span style="font-size: small;letter-spacing: 1.5px;">posts</span> -->
                      </div>
                    </div>
                  </b-col>
                </b-row>
              </b-col>

              <!-- Threads -->
              <b-col>
                <b-row>
                  <b-col cols="12">
                    <div class="text-center">
                      <div class="h3">
                        <img src="@/assets/ctd.png" class="img-issue" />
                      </div>
                      <div class="small">
                        {{ numFormat(datachart.totals.threads | numFormat) }}
                        <!-- <span style="font-size: small;letter-spacing: 1.5px;">posts</span> -->
                      </div>
                    </div>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <PlatformBarChart :platform="datachart.totals" class="py-0 " />

          </b-col>
        </b-row>
        <!-- <PlatformBarChart :platform="datachart.totals" class="py-0 " /> -->
        <b-row cols="9" class="mx-auto d-none">
          <!-- Facebook -->
          <b-col>
            <b-row>
              <b-col cols="12">
                <div class="text-center">
                  <div class="h3">
                    <img src="@/assets/cfb.png" class="img-issue" />
                    <!-- {{ datachart.totals.facebook | numFormat}} -->
                  </div>
                  <div class="small">
                    {{ datachart.totals.facebook | numFormat }}
                    <!-- <span style="font-size: small;letter-spacing: 1.5px;">posts</span> -->
                  </div>

                </div>
              </b-col>
            </b-row>
          </b-col>

          <!-- Twitter -->
          <b-col>
            <b-row>
              <b-col cols="12">
                <div class="text-center">
                  <div class="h3">
                    <img src="@/assets/ctw.png" class="img-issue" />
                    <!-- {{ datachart.totals.facebook | numFormat}} -->
                  </div>
                  <div class="small">
                    {{ datachart.totals.twitter | numFormat }}
                    <!-- <span style="font-size: small;letter-spacing: 1.5px;">posts</span> -->
                  </div>

                </div>
              </b-col>
            </b-row>
          </b-col>

          <!-- Instagram -->
          <b-col>
            <b-row>
              <b-col cols="12">
                <div class="text-center">
                  <div class="h3">
                    <img src="@/assets/cig.png" class="img-issue" />
                  </div>
                  <div class="small">
                    {{ datachart.totals.instagram | numFormat }}
                    <!-- <span style="font-size: small;letter-spacing: 1.5px;">posts</span> -->
                  </div>

                </div>
              </b-col>
            </b-row>
          </b-col>

          <!-- Pantip -->
          <b-col>
            <b-row>
              <b-col cols="12">
                <div class="text-center">
                  <div class="h3">
                    <img src="@/assets/cpt.png" class="img-issue" />
                  </div>
                  <div class="small">
                    {{ datachart.totals.pantip | numFormat }}
                    <!-- <span style="font-size: small;letter-spacing: 1.5px;">posts</span> -->
                  </div>

                </div>
              </b-col>
            </b-row>
          </b-col>

          <!-- YouTube -->
          <b-col>
            <b-row>
              <b-col cols="12">
                <div class="text-center">
                  <div class="h3">
                    <img src="@/assets/cyt.png" class="img-issue" />
                  </div>
                  <div class="small">
                    {{ datachart.totals.youtube | numFormat }}
                    <!-- <span style="font-size: small;letter-spacing: 1.5px;">posts</span> -->
                  </div>

                </div>
              </b-col>
            </b-row>
          </b-col>

          <!-- News -->
          <b-col>
            <b-row>
              <b-col cols="12">
                <div class="text-center">
                  <div class="h3">
                    <img src="@/assets/cn.png" class="img-issue" />
                  </div>
                  <div class="small">
                    {{ datachart.totals.news | numFormat }}
                    <!-- <span style="font-size: small;letter-spacing: 1.5px;">posts</span> -->
                  </div>

                </div>
              </b-col>
            </b-row>
          </b-col>

          <!-- TikTok -->
          <b-col>
            <b-row>
              <b-col cols="12">
                <div class="text-center">
                  <div class="h3">
                    <img src="@/assets/tt.png" class="img-issue" />
                  </div>
                  <div class="small">
                    {{ datachart.totals.tiktok | numFormat }}
                    <!-- <span style="font-size: small;letter-spacing: 1.5px;">posts</span> -->
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-col>

          <!-- Blockdit -->
          <b-col>
            <b-row>
              <b-col cols="12">
                <div class="text-center">
                  <div class="h3">
                    <img src="@/assets/Block.png" class="img-issue" />
                  </div>
                  <div class="small">
                    {{ datachart.totals.blockdit | numFormat }}
                    <!-- <span style="font-size: small;letter-spacing: 1.5px;">posts</span> -->
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-col>

          <!-- Threads -->
          <b-col>
            <b-row>
              <b-col cols="12">
                <div class="text-center">
                  <div class="h3">
                    <img src="@/assets/ctd.png" class="img-issue" />
                  </div>
                  <div class="small">
                    {{ datachart.totals.threads | numFormat }}
                    <!-- <span style="font-size: small;letter-spacing: 1.5px;">posts</span> -->
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-card>



    </div>


  </div>
</template>
<script>
import SentimentBar from "@/components/domain/SentimentBar.vue";
import PlatformBarChart from "@/components/chart/PlatformBarChartIcon.vue";
export default {
  props: { datachart: { type: Object, default: () => ({}) } },
  components: {
    SentimentBar, PlatformBarChart
  },
  methods: {
    numFormat(n) {
      if (!n) return 0;
      if (n < 1e3) return n;
      if (n < 1e6) return (n / 1e3).toFixed(1) + "K";
      if (n < 1e9) return (n / 1e6).toFixed(1) + "M";
      if (n < 1e12) return (n / 1e9).toFixed(1) + "B";
      return (n / 1e12).toFixed(1) + "T";
    },
  },
}
</script>
<style scoped>
.card-platform {

  margin-bottom: 18px;
  border-radius: 15px;
  border: 0px solid rgba(0, 0, 0, .125) !important;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);
}

.img-issue {
  width: 24px;
  height: 24px;
}
</style>