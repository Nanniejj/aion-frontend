<template>
  <div>

    <div class="p-1" v-if="datachart && datachart.totals">
      <b-card class="card-platform">
        <b-row align-v="start" class="stat-sm">
          <b-col cols="12" sm="12" md="6">
            <b-row class="small">
              <b-col cols="auto" md="">
                <div><i class="far fa-comments "></i>
                  <span class="h6 bold"> {{
                    numFormat(datachart.totals.message_sum || 0 | numFormat) }}</span>
                </div> messages
              </b-col>
              <b-col cols="auto" md="">
                <div><i class="far fa-paper-plane "></i>
                  <span class="h6 bold"> {{
                    numFormat(datachart.totals.posts || 0 | numFormat) }}</span>
                </div> posts
              </b-col>
              <b-col cols="auto" md="">
                <div> <i class="far fa-comment " aria-hidden="true"></i>
                  <span class="h6 bold"> {{
                    numFormat((datachart.totals.message_sum - datachart.totals.posts) || 0 | numFormat) }}</span>
                </div>
                comments
              </b-col>
             
              <b-col cols="auto" md="">
                <div> <i class="far fa-eye "></i>
                  <span class="h6 bold"> {{
                    numFormat(datachart.totals.views_sum || 0 | numFormat) }}</span>
                </div> views
              </b-col>
              <b-col cols="auto" md="">
                <div> <i class="fas fa-share-alt "></i>
                  <span class="h6 bold"> {{
                    numFormat(datachart.totals.shares_sum || 0 | numFormat) }}</span>
                </div> shares
              </b-col>
               <b-col cols="auto" md="">
                <div> <i class="fas fa-chart-line "></i>
                  <span class="h6 bold"> {{
                    numFormat(datachart.totals.engagement_sum || 0 | numFormat) }}</span>
                </div> engages
              </b-col>
            </b-row>
            <SentimentBar :positive="datachart.totals.positiveSentiment || 0"
              :neutral="datachart.totals.neutralSentiment || 0" :negative="datachart.totals.negativeSentiment || 0"
              class="py-2 stm-sm" />
          </b-col>
          <b-col cols="12" sm="12" md="6">
            <!-- <div class="small text-left mb-2"> <span class="bold h6">Platform</span> (posts)</div> -->
            <b-row cols="9" class="mx-auto sm-pf">
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
                      </div>
                      <div class="small-sub p-0">({{ pct(datachart.totals.facebook) }})</div>
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
                      <div class="small-sub p-0">({{ pct(datachart.totals.twitter) }})</div>
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
                      <div class="small-sub p-0">({{ pct(datachart.totals.instagram) }})</div>

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
                      <div class="small-sub p-0">({{ pct(datachart.totals.pantip) }})</div>
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
                      <div class="small-sub p-0">({{ pct(datachart.totals.youtube) }})</div>
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
                      <div class="small-sub p-0">({{ pct(datachart.totals.news) }})</div>
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
                      <div class="small-sub p-0">({{ pct(datachart.totals.tiktok) }})</div>
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
                      <div class="small-sub p-0">({{ pct(datachart.totals.blockdit) }})</div>

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
                      <div class="small-sub p-0">({{ pct(datachart.totals.threads) }})</div>

                    </div>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <PlatformBarChart :platform="datachart.totals" class="py-0 platform-box" />

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
  computed: {
    totalPlatformPosts() {
      const t = (this.datachart?.totals) || {};
      // รวมเฉพาะแพลตฟอร์มที่แสดงด้านล่าง
      const keys = ["facebook", "twitter", "instagram", "pantip", "youtube", "news", "tiktok", "blockdit", "threads"];
      return keys.reduce((sum, k) => sum + (Number(t[k]) || 0), 0);
    }
  },
  methods: {
    numFormat(n) {
      if (!n) return 0;
      if (n < 1e3) return n;
      if (n < 1e6) return (n / 1e3).toFixed(2) + "K";
      if (n < 1e9) return (n / 1e6).toFixed(2) + "M";
      if (n < 1e12) return (n / 1e9).toFixed(2) + "B";
      return (n / 1e12).toFixed(2) + "T";
    },
    pct(n) {
      const total = this.totalPlatformPosts || 0;
      if (!total) return "0%";
      return ((Number(n) || 0) * 100 / total).toFixed(2) + "%";
    }
  },
}
</script>
<style scoped>
.h6 {
  font-size: 14px;
  font-weight: bold;
}
.small-sub {
  font-size: x-small;
}

.card-platform {
  margin-bottom: 18px;
  border-radius: 15px;
  border: 0px solid rgba(0, 0, 0, .125) !important;
  /* box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2); */
  box-shadow: 0 .125rem .25rem rgba(0, 0, 0, 0.13) !important;
}

.img-issue {
  width: 24px;
  height: 24px;
}
 .col-12  {
    padding-left: 5px !important;
    padding-right: 5px !important;
  }
.col-auto{
   padding-left: 5px !important;
    padding-right: 5px !important;
}
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .card-body {
    flex: 1 1 auto;
    min-height: 1px;
    padding-bottom:0px;
}
  .platform-box{
  position: relative;
  top: -15px;
}
  #chart>div>div:nth-child(1)>div>div>div>div>div.row.stat-sm.align-items-start>div.col-md-5.col-12>div.row.small>div>div>span {
    font-size: 14px;
  }

  div.small.text-left.mb-2>span {
    font-size: 14px;
  }

  .sm-pf .col-12 {
    zoom: 80%;
    padding-left: 5px !important;
    padding-right: 5px !important;
  }

  .stat-sm .col-auto {
    /* zoom: 90%; */
    margin: auto;
    padding-left: 5px !important;
    padding-right: 5px !important;
  }

  .stm-sm {
    zoom: 75%;
  }
  #chart > div > div:nth-child(1) > div > div > div > div > div > div.col-sm-12.col-md-7.col-12{
    padding-left: 8px;
     padding-right: 8px;
  }
}
</style>
