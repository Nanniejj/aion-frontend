<template>
  <div
    class="mt-4 d-block"
    v-if="
      (getDataListAvatar && getDataListAvatar.stat) ||
        (getDataListAvatar && getDataListAvatar.avatar)
    "
  >
    <b-row class="my-5" style="width: 100% !important;" >
      <b-col cols="12" sm="12" md="3" class="my-2">
        <b-card class="card-avatar px-2">
          <div class="text-tt text-left">TEAM</div>
          <b-row>
            <b-col>
              <div class="sub-tt">all</div>
              <div class="num-tt">
                {{ getDataListAvatar.allTeam || 0 | numFormat }}
              </div>
            </b-col>
            <b-col
              ><div class="sub-tt">active</div>
              <div class="num-tt">
                {{ getDataListAvatar.activeTeam || 0 | numFormat }}
              </div>
            </b-col>
          </b-row>
          <hr class="my-3" />
          <div class="text-tt text-left">ACCOUNTS</div>
          <b-row>
            <b-col>
              <div class="sub-tt">all</div>
              <div class="num-tt">
                {{ getDataListAvatar.stat.totalAccountsCount || 0 | numFormat }}
              </div>
            </b-col>
            <b-col
              ><div class="sub-tt">active</div>
              <div class="num-tt">
                {{
                  getDataListAvatar.stat.activeAccountsCount || 0 | numFormat
                }}
              </div>
            </b-col>
          </b-row>
        </b-card>
      </b-col>

      <b-col cols="12" sm="12" md="" class="my-2" >
        <b-card class="card-avatar px-2">
          <div class="text-tt text-left ">TOTAL</div>
          <b-row >
            <b-col>
              <div class="sub-tt">posts</div>
              <div class="num-tt">
                {{ getDataListAvatar.stat.postCount || 0 | numFormat }}
              </div>
            </b-col>
            <b-col>
              <div class="sub-tt">engages</div>
              <div class="num-tt">
                {{ getDataListAvatar.stat.engagementSum || 0 | numFormat }}
              </div>
            </b-col>
            <b-col>
              <div class="sub-tt">comments</div>
              <div class="num-tt">
                {{ getDataListAvatar.stat.commentsCountSum || 0 | numFormat }}
              </div>
            </b-col>
            <b-col>
              <div class="sub-tt">likes</div>
              <div class="num-tt">
                {{ getDataListAvatar.stat.likesCountSum || 0 | numFormat }}
              </div>
            </b-col>
            <b-col>
              <div v-if="getDataListAvatar.stat.retweetsCountSum">
                <div class="sub-tt">reposts</div>
                <div class="num-tt">
                  {{ getDataListAvatar.stat.retweetsCountSum || 0 | numFormat }}
                </div>
              </div>
              <!-- <div v-if="getDataListAvatar.stat.retweetsCountSum">
              <div> reposts </div>
              <div>
                {{ getDataListAvatar.stat.retweetsCountSum || 0 | numFormat }}
              </div></div> -->
            </b-col>
            <b-col cols="12">
              <hr class="my-3" />
              <div class="text-tt text-left my-2">TOP5 HASHTAG</div>
              <b-card-text>
                <div
                  class="text-left"
                  style="display: ruby;"
                  v-if="
                    getDataListAvatar.stat &&
                      getDataListAvatar.stat.topHashtags &&
                      getDataListAvatar.stat.topHashtags.length
                  "
                >
                  <div
                    class="mx-2 my-2 box-tag"
                    v-for="(hashtag, i) in getDataListAvatar.stat.topHashtags"
                    :key="i"
                  >
                    <b-avatar size="19" style="background-color:#4e432d ;">{{
                      i + 1
                    }}</b-avatar>
                    {{ hashtag.hashtag }} ({{ hashtag.count || 0 | numFormat }})
                  </div>
                </div>
                <div v-else class="text-left" style="display: ruby;">
                  ไม่พบข้อมูล
                </div>
              </b-card-text>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["getAvatar", "getSummaryAvatar", "getDataListAvatar"]),
  },
  data() {
    return {
      stat: {
        totalEngagement: 29,
        totalCommentsCount: 0,
        totalLikesCount: 17,
        totalRetweetsCount: 12,
        totalPostsCount: 11,
        totalActiveAccountsCount: 8,
        totalAccountsCount: 177,
        overallTopHashtags: [
          { hashtag: "#โน้สอุดม", count: 5 },
          { hashtag: "#ม็อบ9พฤษภา", count: 2 },
          { hashtag: "#ม็อบ9พฤษภาคม", count: 2 },
        ],
      },
    };
  },
  filters: {
    numFormat(value) {
      return new Intl.NumberFormat().format(value);
    },
  },
};
</script>

<style scoped>
.box-tag {
  background-color: #818b951e;
  padding: 3px 10px;
  border-radius: 12px;
}
.sub-tt {
  color: #818b95;
  letter-spacing: 2px;
}
.card-avatar {
  background-color: #e5e8eb4f;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em,
    rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em,
    rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
  border-radius: 20px;
  border: 0px;
  height: 100%;
  margin-bottom: 10px;
}
.num-tt {
  font-size: 35px;
  letter-spacing: 1px;
}
.text-tt {
  letter-spacing: 3px;
  /* text-align: left; */
  font-size: 16px;
  font-weight: 600;
}
@media only screen and (min-width: 0px) and (max-width: 700px) {
.bg-row{
    zoom: 80%;
  }
  .row{
    margin: auto;
  }
  .card-body {
    zoom: 70%;
  }
  .num-tt {
  font-size: 28px;
  letter-spacing: 1px;
}
}
</style>
