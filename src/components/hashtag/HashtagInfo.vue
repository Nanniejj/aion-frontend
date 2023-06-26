<template>
  <div>
    <vue-element-loading
      :active="getLoadStatus2"
      size="80"
      background-color="rgba(255,255,255, 0.5)"
      color="#fff"
      spinner="bar-fade-scale"
    />
    <div id="box-hashtag">
      <b-row>
        <b-col lg="12">
          <div class="mb-3">
            <i class="fa fa-hashtag fa-3x" />
            <span>
              <img
                v-if="getValSource == 'twitter'"
                src="@/assets/Twitter.png"
                class="social-img"
              />
              <img
                v-else-if="getValSource == 'facebook'"
                src="@/assets/Facebook.png"
                class="social-img"
              />
              <img
                v-if="getValSource == 'news'"
                src="@/assets/News.png"
                class="social-img"
              />
              <img
                v-if="getValSource == 'pantip'"
                src="@/assets/Pantip.png"
                class="social-img"
              />
              <img
                v-if="getValSource == 'instagram'"
                src="@/assets/Instagram.png"
                class="social-img"
              />
              <img
                v-if="getValSource == 'youtube'"
                src="@/assets/Youtube.png"
                class="social-img"
              />
              <img
                v-if="getValSource == 'blockdit'"
                src="@/assets/Blockdit.png"
                class="social-img"
              />
              <img
                v-if="getValSource == 'tiktok'"
                src="@/assets/Tiktok.png"
                class="social-img"
              />
            </span>
          </div>
        </b-col>
        <b-col lg="12">
          <div class="h3">{{ getHashtagData }}</div>
          <div>
            <vue-element-loading
              :active="getLoadStatus2"
              size="80"
              background-color="rgba(255,255,255, 0.5)"
              color="#fff"
              spinner=""
            />
            {{ getCnt2 | numFormat }} โพสต์
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    k: {
      type: Number,
    },
  },
  data() {
    return {
      cnt: 0,
    };
  },
  computed: {
    ...mapGetters([
      "getHashtagData",
      "getProfileMonitor",
      "getLocationCount",
      "getCountPost",
      "getLoadStatus2",
      "getCnt",
      "getCnt2",
      "getValSource",
    ]),
  },
};
</script>

<style scoped>
.social-img {
  width: 50px;
  right: 15px;
  position: relative;
  /* text-align: center; */
}
.fa-hashtag {
  padding: 12px;
  border-radius: 50%;
  color: #4c412b;
  background: #ede7dd;
  width: 75px;
  height: 75px;
}
#box-hashtag {
  width: 100%;
  display: block;
  padding: 20px 0px;
  border-radius: 7px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
</style>
