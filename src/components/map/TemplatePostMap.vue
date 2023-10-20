<template>
  <div class="mb-5">
    <div v-if="getMapPostList && getMapPostList.length">
      <vue-element-loading
        :active="getLoadMap"
        size="80"
        background-color="rgba(255, 255, 255, 0.5)"
        color="#b6ac9a"
      />
      <div class="text-left mt-4 mb-2">
        <i class="fa fa-map-marker" style="font-size:20px"></i> <span class="bold h5 ml-2">{{getMapCountry}}</span>
      </div>
      <b-card-group
        v-for="item in this.getMapPostList"
        :key="item.twid"
        deck
        class="mt-2"
      >
        <b-card>
          <template #header>
            <h6 class="mb-0 textleft">
              <span class="bold"> {{ item.area }} </span>&nbsp;{{
                item.twaccountname
              }}
              &nbsp; {{ item.twdatetime.split("T")[0] }}
              {{ item.twdatetime.split("T")[1].split(".")[0] }}&nbsp;
              <a
                v-bind:href="
                  'https://twitter.com/' +
                    item.twaccountname +
                    '/status/' +
                    item.twid
                "
                class="fa fa-external-link"
                target="_blank"
              ></a>
            </h6>
          </template>
          <b-card-text class="textleft"
            >{{ item.twcontent }} {{ item.twreply }} {{ item.twretweet }}
            {{ item.twlike }}
          </b-card-text>
          <b-card-text class="textleft">
            <i class="fa fa-comment"></i> {{ item.twreply }}&nbsp;
            <i class="fa fa-retweet" /> {{ item.twretweet }} &nbsp;<i
              class="fa fa-heart"
            ></i>
            {{ item.twlike }}
          </b-card-text>
        </b-card>
      </b-card-group>
    </div>
    <div v-else class="mt-3">
      <vue-element-loading
        :active="getLoadMap"
        size="80"
        background-color="rgba(255, 255, 255, 0.5)"
        color="#b6ac9a"
      />
      <b-card class="pt-3 pb-3">
        <div v-if="getLoadMap">Loading</div>
        <div v-else>ไม่พบข้อมูล</div>
      </b-card>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  components: {},
  methods: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getMapPostList", "getLoadMap","getMapCountry"]),
  },
};
</script>
<style scoped>
.textleft {
  text-align: left;
}
</style>
