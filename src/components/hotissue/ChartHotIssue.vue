<template>
  <div class="mb-2">
    <vue-element-loading
          :active="getLoadPostIssue"
          size="80"
          background-color="rgba(255, 255, 255, 0.5)"
          color="#b6ac9a"
        />

    <b-row class="my-3 ">
      <b-col class="my-2">
        <b-card class="card-issue my-1">
          <div class="text-left text-tt ">Total</div>
          <div class="num-tt">{{ datachart.totalMassage | numFormat }}</div>
          <div class="sub-tt">messages</div>
        </b-card>
      </b-col>
      <b-col md="8" class="my-2">
        <b-card class="card-issue my-1" style="width: 100%;">
          <b-row>
            <b-col class="border-right px-5">
              <div class="text-left text-tt ">Posts</div>
              <div class="num-tt">
                {{ datachart.count[0].total | numFormat }}
              </div>
              <div class="sub-tt">messages</div></b-col
            >
            <b-col class="px-5">
              <div class="text-left text-tt ">Comments</div>
              <div class="num-tt">
                {{ datachart.totalComments | numFormat }}
              </div>
              <div class="sub-tt">messages</div></b-col
            >
          </b-row>
        </b-card>
      </b-col>
      <!-- <b-col  >
        <b-card class="card-issue my-1">
      
        </b-card>
      </b-col> -->
    </b-row>

    <b-row class="my-auto box-issuechart">
      <b-col md="6" class="my-auto">
        <div class="text-left text-tt my-2">Platform / Messages</div>

        <b-row cols="2" cols-md="3" cols-sm="2" class="mx-auto">
          <!-- Facebook -->
          <b-col class="my-2">
            <b-row>
              <b-col cols="12">
                <div class="text-md-left">
                  <div class="h3">
                    <img src="@/assets/cfb.png" class="img-issue" />
                    {{ datachart.platform_counts.facebook_sum | numFormat }}
                  </div>
                  <div class="h6">
                    {{ datachart.platform_counts.facebook | numFormat }}
                    <span style="font-size: small;letter-spacing: 1.5px;"
                      >posts</span
                    >
                  </div>
                  <div class="h6">
                    {{
                      datachart.platform_counts.facebook_comments | numFormat
                    }}
                    <span style="font-size: small;letter-spacing: 1.5px;">
                      comments</span
                    >
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-col>

          <!-- Twitter -->
          <b-col class="my-2">
            <b-row>
              <b-col cols="12">
                <div class="text-md-left">
                  <div class="h3">
                    <img src="@/assets/ctw.png" class="img-issue" />
                    {{ datachart.platform_counts.twitter_sum | numFormat }}
                  </div>
                  <div class="h6">
                    {{ datachart.platform_counts.twitter | numFormat }}
                    <span style="font-size: small;letter-spacing: 1.5px;"
                      >posts</span
                    >
                  </div>
                  <div class="h6">
                    {{ datachart.platform_counts.twitter_comments | numFormat }}
                    <span style="font-size: small;letter-spacing: 1.5px;">
                      comments</span
                    >
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-col>

          <!-- Instagram -->
          <b-col class="my-2">
            <b-row>
              <b-col cols="12">
                <div class="text-md-left">
                  <div class="h3">
                    <img src="@/assets/cig.png" class="img-issue" />
                    {{ datachart.platform_counts.instagram_sum | numFormat }}
                  </div>
                  <div class="h6">
                    {{ datachart.platform_counts.instagram | numFormat }}
                    <span style="font-size: small;letter-spacing: 1.5px;"
                      >posts</span
                    >
                  </div>
                  <div class="h6">
                    {{
                      datachart.platform_counts.instagram_comments | numFormat
                    }}
                    <span style="font-size: small;letter-spacing: 1.5px;"
                      >comments</span
                    >
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-col>

          <!-- Pantip -->
          <b-col class="my-2">
            <b-row>
              <b-col cols="12">
                <div class="text-md-left">
                  <div class="h3">
                    <img src="@/assets/cpt.png" class="img-issue" />
                    {{ datachart.platform_counts.pantip_sum | numFormat }}
                  </div>
                  <div class="h6">
                    {{ datachart.platform_counts.pantip | numFormat }}
                    <span style="font-size: small;letter-spacing: 1.5px;"
                      >posts</span
                    >
                  </div>
                  <div class="h6">
                    {{ datachart.platform_counts.pantip_comments | numFormat }}
                    <span style="font-size: small;letter-spacing: 1.5px;"
                      >comments</span
                    >
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-col>

          <!-- YouTube -->
          <b-col class="my-2">
            <b-row>
              <b-col cols="12">
                <div class="text-md-left">
                  <div class="h3">
                    <img src="@/assets/cyt.png" class="img-issue" />
                    {{ datachart.platform_counts.youtube_sum | numFormat }}
                  </div>
                  <div class="h6">
                    {{ datachart.platform_counts.youtube | numFormat }}
                    <span style="font-size: small;letter-spacing: 1.5px;"
                      >posts</span
                    >
                  </div>
                  <div class="h6">
                    {{ datachart.platform_counts.youtube_comments | numFormat }}
                    <span style="font-size: small;letter-spacing: 1.5px;"
                      >comments</span
                    >
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-col>

          <!-- News -->
          <b-col class="my-2">
            <b-row>
              <b-col cols="12">
                <div class="text-md-left">
                  <div class="h3">
                    <img src="@/assets/cn.png" class="img-issue" />
                    {{ datachart.platform_counts.news_sum | numFormat }}
                  </div>
                  <div class="h6">
                    {{ datachart.platform_counts.news | numFormat }}
                    <span style="font-size: small;letter-spacing: 1.5px;"
                      >posts</span
                    >
                  </div>
                  <div class="h6">
                    {{ datachart.platform_counts.news_comments | numFormat }}
                    <span style="font-size: small;letter-spacing: 1.5px;"
                      >comments</span
                    >
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-col>

          <!-- TikTok -->
          <b-col class="my-2">
            <b-row>
              <b-col cols="12">
                <div class="text-md-left">
                  <div class="h3">
                    <img src="@/assets/tt.png" class="img-issue" />
                    {{ datachart.platform_counts.tiktok_sum | numFormat }}
                  </div>
                  <div class="h6">
                    {{ datachart.platform_counts.tiktok | numFormat }}
                    <span style="font-size: small;letter-spacing: 1.5px;"
                      >posts</span
                    >
                  </div>
                  <div class="h6">
                    {{ datachart.platform_counts.tiktok_comments | numFormat }}
                    <span style="font-size: small;letter-spacing: 1.5px;"
                      >comments</span
                    >
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-col>

          <!-- Blockdit -->
          <b-col class="my-2">
            <b-row>
              <b-col cols="12">
                <div class="text-md-left">
                  <div class="h3">
                    <img src="@/assets/Block.png" class="img-issue" />
                    {{ datachart.platform_counts.blockdit_sum | numFormat }}
                  </div>
                  <div class="h6">
                    {{ datachart.platform_counts.blockdit | numFormat }}
                    <span style="font-size: small;letter-spacing: 1.5px;"
                      >posts</span
                    >
                  </div>
                  <div class="h6">
                    {{
                      datachart.platform_counts.blockdit_comments | numFormat
                    }}
                    <span style="font-size: small;letter-spacing: 1.5px;"
                      >comments</span
                    >
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-col>

          <!-- Threads -->
          <b-col class="my-2">
            <b-row>
              <b-col cols="12">
                <div class="text-md-left">
                  <div class="h3">
                    <img src="@/assets/ctd.png" class="img-issue" />
                    {{ datachart.platform_counts.threads_sum | numFormat }}
                  </div>
                  <div class="h6">
                    {{ datachart.platform_counts.threads | numFormat }}
                    <span style="font-size: small;letter-spacing: 1.5px;"
                      >posts</span
                    >
                  </div>
                  <div class="h6">
                    {{ datachart.platform_counts.threads_comments | numFormat }}
                    <span style="font-size: small;letter-spacing: 1.5px;"
                      >comments</span
                    >
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-col>
        </b-row></b-col
      >
      <b-col md="6" class="my-auto">
        <apexchart
          type="bar"
          height="400"
          :options="chartOptions"
          :series="series"
          id="chart-domain"
        ></apexchart
      ></b-col>
    </b-row>

    <!-- {{ datachart }} -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VueApexCharts from "vue-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    datachart: {
      type: Object,
      required: true,
    },

    social: {
      type: String,
      default:
        "news,twitter,facebook,youtube,tiktok,blockdit,instagram,pantip,threads",
    },
    type: {
      type: String,
      default: "daily",
    },
  },

  watch: {
    getStatusSearch() {
      this.$nextTick(() => {
        this.updateChart();
      });
    },
    datachart: {
      handler() {
        this.updateChart();
      },
      deep: true,
    },
  },
  data() {
    return {
      series: [
        {
          name: "Posts",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: "Comments",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
      chartOptions: {
        colors: ["#dc54b1", "#36BA98"],
        chart: {
          redrawOnParentResize: true,
          type: "bar",
          height: 400,
          fontFamily: "Prompt, FontAwesome, sans-serif",
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: true,
          },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: "14px", // Adjust the font size for y-axis labels
            },
          },
        },
        fill: {
          opacity: 1,
        },
        grid: {
          xaxis: {
            lines: {
              show: false,
            },
          },
          yaxis: {
            lines: {
              show: false,
            },
          },
        },
      },
    };
  },
  computed: {
    ...mapGetters([
      "getLoadAllPostIssue",
      "getSocialIssue",
      "getSelectIssue",
      "getDateIssue",
      "getStatusSearch",
      "getChartDataIssue",
      "getLoadPostIssue"
    ]),
  },
  methods: {
    updateChart() {
      const seriesdata = this.datachart.platform_counts;
      let series = [
        {
          name: "Posts",
          data: [
            seriesdata.facebook,
            seriesdata.twitter,
            seriesdata.instagram,
            seriesdata.pantip,
            seriesdata.youtube,
            seriesdata.news,
            seriesdata.tiktok,
            seriesdata.blockdit,
            seriesdata.threads,
          ],
        },
        {
          name: "Comments",
          data: [
            seriesdata.facebook_comments,
            seriesdata.twitter_comments,
            seriesdata.instagram_comments,
            seriesdata.pantip_comments,
            seriesdata.youtube_comments,
            seriesdata.news_comments,
            seriesdata.tiktok_comments,
            seriesdata.blockdit_comments,
            seriesdata.threads_comments,
          ],
        },
      ];
      this.series = series;

      this.chartOptions = {
        colors: ["#dc54b1", "#36BA98"],
        xaxis: {
          labels: {
            formatter: (value) => {
              return Number(value).toLocaleString();
            },
          },
        },
        chart: {
          redrawOnParentResize: true,
          type: "bar",
          height: 400,
          stacked: true,
          fontFamily: "Prompt, FontAwesome, sans-serif",
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: true,
          },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: "14px", // Adjust the font size for y-axis labels
            },
          },
        },
        dataLabels: {
          style: {
            fontSize: "13px",
            colors: ["#000"],
          },
          textAnchor: "middle",
          enabled: true,
          formatter: (value) => {
            return value > 0 ? Number(value).toLocaleString() : "";
          },
          total: {
            enabled: true,
            style: {
              fontSize: "13px",
            },
          },
          
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadiusApplication: "end",
            borderRadiusWhenStacked: "last",
            dataLabels: {
              enabled: true,
              formatter: function(value, { seriesIndex, dataPointIndex, w }) {
                return value.toLocaleString();
              },
              style: {
                fontSize: "12px",
                colors: ["#304758"],
              },
              offsetX: 0,
              offsetY: -5,
              total: {
                enabled: true,
                formatter: function(w) {
                  return w.globals.seriesTotals
                    .reduce((a, b) => a + b, 0)
                    .toLocaleString();
                },
                style: {
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#373d3f",
                },
              },
            },
          },
        },
        xaxis: {
          categories: [
            "facebook",
            "twitter",
            "instagram",
            "pantip",
            "youtube",
            "news",
            "tiktok",      
            "blockdit",
            "threads",
          ],
          style: {
            fontSize: "18px",
            // colors: ["#000"],
          },
        },

        fill: {
          opacity: 1,
        },
        grid: {
          xaxis: {
            lines: {
              show: false,
            },
          },
          yaxis: {
            lines: {
              show: false,
            },
          },
        },
        
      };
    },
  },
  mounted() {
    this.updateChart();
  },
};
</script>

<style scoped>

.sub-tt {
  color: #818b95;
  letter-spacing: 1.5px;
}
.num-tt {
  font-size: 35px;
  letter-spacing: 2px;
}

.text-tt {
  letter-spacing: 3px;
  /* text-align: left; */
  font-size: 16px;
  font-weight: 600;
}
.card-issue {
  background-color: #e5e8eb4f;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em,
    rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em,
    rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
  border-radius: 20px;
  border: 0px;
  height: 100%;
  margin-bottom: 10px;
}
.fa,
.fas {
  color: rgb(117, 114, 105) !important;
}
.img-issue {
  width: 28px;
}
@media only screen and (min-width: 0px) and (max-width: 1100px) {
  .box-issuechart .col-md-6{
  flex: 0 0 100%;
  max-width: 100%;
}}
@media only screen and (min-width: 0px) and (max-width: 800px) {
  .card-issue {
    zoom: 70%;
  }
  .h3 {
    font-size: 18px !important;
    font-weight: 600 !important;
  }
  .h6 {
    font-size: 15px !important;
    /* font-weight: 600  !important; */
  }
}
</style>
<style>

</style>