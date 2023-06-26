<template>
  <div>
    <div class="text-left">
      <span v-if="getHashtagFeed" class="h5 bold">#{{getHashtagFeed}} </span>
      <span v-else class="h5 bold">All Posts </span>
      <div class="d-inline-block">
        <div v-if="startd === endd" class="text-left onedate">
          <i class="far fa-calendar-alt"></i> {{ startd }}
        </div>
        <div v-else class="text-left twodate">
          <i class="far fa-calendar-alt"></i> {{ startd }} - {{ endd }}
        </div>
      </div>
    </div>
    <hr />
    <div>
      <b-row>
        <b-col cols="4" class="m-auto my-1">
          <h5 class="text-lg-left text-md-left">Monitor</h5>
        </b-col>
        <b-col cols="8" class="text-lg-right text-md-right my-1">
          <span id="post-comment">
            <i class="far fa-paper-plane" />

            <b>
              <span v-if="getCountPostFeed !== 0">
                {{ getCountPostFeed | numFormat }} </span
              ><span v-else> 0 </span></b
            >
            โพสต์
          </span>
        </b-col>
      </b-row>
    </div>
    <PostFeed />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PostFeed from "@/components/feed/PostFeed.vue";
export default {
  watch: {
    getArrFeed: function () {
      this.startd = this.getSdateFeed.slice(0, 10);
      this.endd = this.getEdateFeed.slice(0, 10);
    },
  },
  components: {
    PostFeed,
  },
  computed: {
    ...mapGetters([
      "getSdateFeed",
      "getEdateFeed",
      "setStatusFeed",
      "getArrFeed",
      "getCountPostFeed",
      "getHashtagFeed"
    ]),
  },
  data() {
    return {
      startd: "",
      endd: "",
    };
  },
  created() {
    this.startd = this.getSdateFeed.slice(0, 10);
    this.endd = this.getEdateFeed.slice(0, 10);
  },
};
</script>

<style>
</style>