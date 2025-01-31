<template>
  <div class="mt-4">
    <!-- {{ getAvatarSource }} -->
    <b-row class="mb-3">
      <b-col md="6" class="my-1">
        <b-form-group
          label-for="filter-input"
          label-cols-sm="0"
          label-align-sm="right"
          label-size="md"
          class="mb-0"
        >
          <b-input-group size="md">
            <b-form-input
              id="filter-input"
              v-model="filterTw"
              type="search"
              placeholder="ค้นหา"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="" class="my-1">
        <b-form-select
          v-model="selected"
          :options="options"
          @change="selectChange(selected)"
        ></b-form-select>
      </b-col>
      <b-col class="my-1" md="">
        <button
          class="btn btn-add pl-3 pr-3 font-weight-bold"
          @click="goAvatarTeam"
        >
          <i class="fas fa-user-cog " />
          <span style="font-size:16px;"> การจัดการ Avatar </span>
        </button>
        <!-- <CreateMonitor class="text-right" :tabsMonitor="'tabAvatar'" /> -->
      </b-col>
    </b-row>
    <b-table
      v-if="
        getDataListAvatar &&
          getDataListAvatar.avatar &&
          getDataListAvatar.avatar.length
      "
      :filter="filterTw"
      responsive
      :items="getDataListAvatar.avatar"
      :fields="selcectFields"
      head-variant="dark"
      class="text-break"
      id="tb-profile"
      stacked="lg"
    >
      <template #cell(id)="row">
        {{ row.index + 1 + 20 * (currentPage - 1) }}
      </template>
      <template #cell(postCount)="row">
        {{ row.value | numFormat }}
      </template>
      <template #cell(viewsCountSum)="row">
        {{ row.value | numFormat }}
      </template>
      <template #cell(retweetsCountSum)="row">
        {{ row.value | numFormat }}
      </template>
      <template #cell(likesCountSum)="row">
        {{ row.value | numFormat }}
      </template>
      <template #cell(engagementSum)="row">
        {{ row.value | numFormat }}
      </template>
      <template #cell(topHashtags)="row">
        <div v-if="row.item.topHashtags.length">
          <div v-for="(hashtag, k) in row.item.topHashtags">
            {{ k + 1 }} {{ hashtag.hashtag }}
          </div>
        </div>
        <div v-else>
          ไม่พบข้อมูล #
        </div>
      </template>
      <template #cell(active)="row">
        <div id="btn-active">
          <div>{{ row.item.activeAccountsCount | numFormat }}</div>
          <b-button
            size="sm"
            @click="row.toggleDetails"
            id="btn-show"
            class="ml-3"
          >
            {{ row.detailsShowing ? "Hide" : "Show" }} User
          </b-button>
        </div>
      </template>
      <template #row-details="rows">
        <div v-if="rows.item" class="user-card">
          <b-table
            id="user-table"
            :bordered="false"
            :borderless="true"
            :items="rows.item.data"
            :fields="fields"
            stacked="lg"
            class="text-left"
          >
            <template #cell(id)="row">
              <span style="color:#aeb0b3;">{{ row.index + 1 }}</span>
            </template>
            <template #cell(account_name)="row">
              <span v-if="row.item.profile_image">
                <img :src="row.item.profile_image" id="profile-pic" />
              </span>
              <span v-else>
                <b-avatar class="mr-3"></b-avatar>
              </span>

              {{ row.value }}
            </template>
            <template #cell(engagement)="row">
              {{ row.value | numFormat }}
            </template>
            <template #cell(urls)="row">
              {{ row.value.length | numFormat }}
            </template>
            <template #cell(retweets_count)="row">
              {{ row.value | numFormat }}
            </template>
            <template #cell(likes_count)="row">
              {{ row.value | numFormat }}
            </template>
            <!-- <template #cell(likes_count)="row">
              {{ row.value | numFormat }}
            </template> -->
            <template #cell(view)="row">
              <span
                class="fas fa-list-ul float-right"
                v-b-tooltip.hover
                title="ดูข้อมูล"
                size="sm"
                @click="
                  open = true;
                  info(row.item, rows.item.name,rows.item.team);
                "
              ></span>
            </template>
            <template #cell(hashtags)="row">
              <div v-if="row.value.length">
                <div v-for="(tag, i) in row.value" :key="i">{{ tag }}</div>
              </div>
              <div v-else>
                -
              </div>
            </template>
          </b-table>
        </div>
        <div v-else>
          ไม่พบข้อมูล
        </div>
      </template>
    </b-table>
    <div v-else> <b-card class="py-5">ไม่พบข้อมูล</b-card>  </div>
    <b-row class="mt-5 text-center mb-4">
      <b-col sm="7" md="6" class="my-1 m-auto " id="page">
        <b-pagination
          v-model="currentPage"
          :total-rows="this.totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
          v-if="
        getDataListAvatar &&
          getDataListAvatar.avatar &&
          getDataListAvatar.avatar.length
      "
        ></b-pagination>
      </b-col>
    </b-row>
    <!-- ----------------------------------------------Info modal--------------------------------------------- -->
    <vue-modaltor
      :visible="open"
      @hide="hideModal"
      :resize-width="{ 3500: '70%', 1500: '70%', 992: '70%', 768: '90%' }"
      :animation-panel="'modal-slide-top'"
      class="hei-popup"
    >
      <b-container fluid>
        <!-- {{ dataInfo }} -->
        <div
          v-if="
              dataInfo &&
              dataInfo._id &&
              dataInfo._id.source
          "
        >
          <!-- {{ dataInfo._id.source}} -->
          <div class="hh">
            <a :href="dataInfo.account_url" target="_blank" id="acclink">
              <span class="bold h5">
                <span v-if="dataInfo.profile_image"
                  ><img :src="dataInfo.profile_image" id="profile-pic-1"/>
                  <span v-if="dataInfo && dataInfo._id && dataInfo._id.source">
                    <img
                      v-if="dataInfo._id.source === 'twitter'"
                      :src="imgtw"
                      class="social-img"/>
                    <img
                      v-if="dataInfo._id.source === 'facebook'"
                      :src="imgfb"
                      class="social-img"/>
                    <img
                      v-if="dataInfo._id.source === 'pantip'"
                      :src="imgpt"
                      class="social-img"/>
                    <img
                      v-if="dataInfo._id.source === 'youtube'"
                      :src="imgyt"
                      class="social-img"/>
                    <img
                      v-if="dataInfo._id.source === 'news'"
                      :src="imgnw"
                      class="social-img"/>
                    <img
                      v-if="dataInfo._id.source === 'instagram'"
                      :src="imgig"
                      class="social-img"/>
                    <img
                      v-if="dataInfo._id.source === 'blockdit'"
                      :src="imgbd"
                      class="social-img"/>
                    <img
                      v-if="dataInfo._id.source === 'tiktok'"
                      src="@/assets/Tiktok.png"
                      class="social-img"/>
                    <img
                      v-if="dataInfo._id.source === 'threads'"
                      src="@/assets/Threads.png"
                      class="social-img"/></span
                ></span>
                <span v-else><b-avatar class="mr-3"></b-avatar></span>
                {{ dataInfo.account_name }}
              </span>
              <i class="fa fa-external-link mr-2" />
            </a>
            <span class="h6">
              <b-badge id="box-team">{{ dataInfo.team }}</b-badge></span
            >
          </div>
          <!-- <hr /> -->
          <b-row
            class="text-center"
            cols="2"
            cols-sm="2"
            cols-md="2"
            cols-lg="4"
          >
            <!-- <b-col>
              <div>
                <i class="fa fa-users" style="color: rgb(100, 103, 105);"></i>
              </div>
              <div>
                <b>{{ dataInfo.follower | numFormat }}</b> Followers
              </div>
            </b-col> -->
            <b-col>
              <div>
                <i
                  class="fa fa-paper-plane"
                  style="color: #2a3a8f;"
                ></i>
              </div>
              <div v-if="dataInfo.urls && dataInfo.urls.length">
                <b>{{ dataInfo.urls.length | numFormat }}</b> Posts
              </div>
            </b-col>
            <b-col>
              <div>
                <i class="fa fa-comment" style="color:#45a5df;"></i>
              </div>
              <div v-if="dataInfo ">
                <b>{{ dataInfo.comments_count | numFormat }}</b> comments
              </div>
            </b-col>
            <b-col v-if="dataInfo._id.source === 'tiktok'">
              <div>
                <i class="fa fa-eye" style="color: #673ab7;"></i>
              </div>
              <div>
                <b>{{ dataInfo.views_count | numFormat }}</b> Likes
              </div>
            </b-col>
            <b-col  v-if="dataInfo._id.source === 'twitter'">
              <div>
                <i class="fa fa-retweet" style="color:rgb(23, 191, 99);"></i>
              </div>
              <div>
                <b>{{ dataInfo.retweets_count | numFormat }}</b> Reposts
              </div>
            </b-col>
            <b-col  v-else>
              <div>
                <i class="fa fa-share" style="color:rgb(23, 191, 99);"></i>
              </div>
              <div>
                <b>{{ dataInfo.shares_count | numFormat }}</b> Shares
              </div>
            </b-col>
            <b-col>
              <div>
                <i class="fa fa-heart" style="color: rgb(224, 36, 94);"></i>
              </div>
              <div>
                <b>{{ dataInfo.likes_count | numFormat }}</b> Likes
              </div>
            </b-col>
          </b-row>
          <div class="pl-3">
            <div class="bold mt-3 ">
              Hashtags
              <span class="small"
                >( total :
                <b>{{ getSortedHashtags(dataHash).length | numFormat }}</b>
                hashtags )</span
              >
            </div>
            <!-- {{ getSortedHashtags(dataHash) }} -->
            <div id="col-hash" v-if="getSortedHashtags(dataHash).length">
              <div
                v-for="(hash, k) in getSortedHashtags(dataHash)"
                :key="k"
                class="text-left"
              >
                {{ k + 1 }}. {{ hash }}
              </div>
            </div>
            <div v-else>ไม่พบข้อมูล Hashtag</div>

            <div class="mt-3 bold">
              Posts
              <span class="small" v-if="dataInfo.urls && dataInfo.urls.length"
                >( total : <b>{{ dataInfo.urls.length | numFormat }}</b> tweets
                )</span
              >
            </div>
            <span v-if="dataInfo.urls && dataInfo.urls.length">
              <div v-for="(post, k) in dataInfo.urls" :key="k">
                <a id="box-links" class="mt-2" :href="post.replace('mbasic.','')" target="_blank">
                  <span>{{ k + 1 }}. </span>
                  {{ post.replace('mbasic.',"") }}
                  <i class="fa fa-external-link"
                /></a>
              </div>
            </span>
            <span v-else>ไม่พบข้อมูล</span>
          </div>
        </div>
      </b-container>
    </vue-modaltor>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
//import CreateMonitor from '@/components/monitor/CreateMonitor.vue';
export default {
  components: {
    // CreateMonitor,
  },
  watch: {
   
    getDataListAvatar: {
      handler(val) {
        console.log("val", val);
      },
      deep: true,
    },
    totalRows: function(newVal, oldVal) {
      // watch it
      console.log("Prop changed: ", newVal, " | was: ", oldVal);
    },
  },
  data: function() {
    return {
      imgtw: require("@/assets/Twitter.png"),
      imgfb: require("@/assets/Facebook.png"),
      imgpt: require("@/assets/board.png"),
      imgig: require("@/assets/Instagram.png"),
      imgnw: require("@/assets/News.png"),
      imgyt: require("@/assets/Youtube.png"),
      imgbd: require("@/assets/Blockdit.png"),
      teamShow: "",
      uidLink: [],
      teamName: "",
      dataHash: [],
      open: false,
      dataInfo: "",
      fields: [
        { key: "id", label: "#" },
        { key: "account_name", label: "Account" },
        { key: "urls", label: "Posts" },
        { key: "retweets_count", label: "Reposts" },
        { key: "likes_count", label: "Likes" },
        { key: "engagement", label: "Engages" },
        { key: "view", label: "" },
      ],
      selected: "twitter",
      options: [
        { value: "twitter", text: "Twitter" },
        { value: "facebook", text: "Facebook" },
        { value: "instagram", text: "Instagram" },
        { value: "tiktok", text: "Tiktiok" },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 20,
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filterTw: null,
      filterFb: null,
      filterOn: [],
      FieldsTwitter: [
        { key: "id", label: "#" },
        { key: "team", label: "Team" },
        { key: "totalAccountsCount", label: "Accounts" },
        { key: "postCount", label: "Posts" },
        { key: "commentsCountSum", label: "Comments" },
        { key: "retweetsCountSum", label: "Reposts" },
        { key: "likesCountSum", label: "Likes" },
        { key: "engagementSum", label: "Engages" },
        { key: "topHashtags", label: "#Top3" },
        { key: "active", label: "Active" },
      ],
      FieldsFacebook: [
        { key: "id", label: "#" },
        { key: "team", label: "Team" },
        { key: "totalAccountsCount", label: "Accounts" },
        { key: "postCount", label: "Posts" },
        { key: "commentsCountSum", label: "Comments" },
        { key: "sharesCountSum", label: "Shares" },
        { key: "likesCountSum", label: "Likes" },
        { key: "engagementSum", label: "Engages" },
        { key: "topHashtags", label: "#Top3" },
        { key: "active", label: "Active" },
      ],
      FieldsTiktok: [
        { key: "id", label: "#" },
        { key: "team", label: "Team" },
        { key: "totalAccountsCount", label: "Accounts" },
        { key: "postCount", label: "Posts" },
        { key: "commentsCountSum", label: "Comments" },
        { key: "viewsCountSum", label: "Views" },
        { key: "sharesCountSum", label: "Shares" },
        { key: "likesCountSum", label: "Likes" },
        { key: "engagementSum", label: "Engages" },
       
        { key: "topHashtags", label: "#Top3" },
        { key: "active", label: "Active" },
      ],
      empData: "ไม่พบข้อมูล",
    };
  },
  computed: {
    ...mapGetters([
      "getAvatar",
      "getSummaryAvatar",
      "getDataListAvatar",
      "getAvatarSource",
    ]),
    total() {
      var row = this.totalRows;
      row = this.getDataListAvatar.avatar.length;
      return row;
    },
    selcectFields() {
      let f = [];
      if (this.selected == "twitter") {
        f = this.FieldsTwitter;
        
      this.$store.commit("setAvatarSource", this.selected );
      } 
      if (this.selected == "facebook") {
        f = this.FieldsFacebook;
        this.$store.commit("setAvatarSource", this.selected );
      }
      if (this.selected == "instagram") {
        f = this.FieldsFacebook;
        this.$store.commit("setAvatarSource", this.selected );
      }
      if (this.selected == "tiktok") {
        f = this.FieldsTiktok;
        this.$store.commit("setAvatarSource", this.selected );
      }
      return f
    },
  },
  methods: {
    getSortedHashtags(hashtags) {
      // สร้าง object เพื่อเก็บจำนวนความถี่ของแต่ละ hashtag
      const hashtagFrequency = {};

      // นับความถี่ของแต่ละ hashtag
      hashtags.forEach((group) => {
        group.forEach((hashtag) => {
          if (hashtagFrequency[hashtag]) {
            hashtagFrequency[hashtag]++;
          } else {
            hashtagFrequency[hashtag] = 1;
          }
        });
      });

      // สร้าง array ของ [hashtag, frequency]
      const sortedHashtags = Object.entries(hashtagFrequency)
        .sort((a, b) => b[1] - a[1]) // เรียงลำดับความถี่จากมากไปน้อย
        .map((entry) => entry[0]); // ดึงค่า hashtag ออกมา

      return sortedHashtags;
    },
    info(item, team,data) {
      this.teamName = team;
      this.dataInfo = {...item,team:data};
      var duplicates = item.hashtags;
      //  console.log('duplicates',duplicates);
      var unique = duplicates.filter(function(elem, pos) {
        return duplicates.indexOf(elem) == pos;
      });
      this.dataHash = unique;
      var uid = item.uid;
      var uid_unique = uid.filter(function(elem, pos) {
        return uid.indexOf(elem) == pos;
      });
      this.uidLink = uid_unique;
    },
    goAvatarTeam() {
      // this.$router.push({ name: "AvatarTeam" });
      this.$store.commit("setShowManage", true);
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering

      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    selectChange(val) {
      this.currentPage = 1;
      console.log("val", val);

      this.$store.commit("setAvatarSource", val);
    },
    hideModal() {
      this.open = false;
    },
  },
  mounted() {
    // this.$store.commit("setAvatarSource", this.selected )
    // this.$store.dispatch('fetchListAvatar')
  },
};
</script>
<style scoped>
.social-img {
  width: 35px;
  position: relative;
  right: 21px;
  bottom: -10px;
}
#profile-pic {
  width: 40px;
  border-radius: 50%;
}
#profile-pic-1 {
  width: 50px;
  border-radius: 50%;
}
.user-card {
  max-height: 500px;
  overflow: auto;
}
a#acclink {
  color: #2c3e50;
}
#box-team {
  font-size: 85%;
  font-weight: bold;
  padding: 0.4em 0.5em;
  color: #2c3e50 !important;
  background-color: #fed16e8a !important;
}
#box-links {
  line-break: anywhere;
  font-size: 90%;
  font-weight: normal;
  padding: 0.1em 0.5em;
  color: #2c3e50 !important;
  background-color: #9ad9fb00 !important;
  display: initial;
  cursor: pointer;
}
#box-links:hover {
  font-weight: bold;
  color: #2c3e50 !important;
  background-color: #fed16e8a !important;
  border-radius: 20px;
  text-decoration: none;
}
.fa-list-ul:hover {
  background: #4c412b;
  color: white;
}
.fa-list-ul {
  background: #fed16e8a;
  padding: 7px;
  border-radius: 50%;
  box-shadow: 1px 1px 3px #666666;
  margin: 0px 5px;
  color: #4c412b;
  width: 32px;
  height: 30px;
  cursor: pointer;
}
#col-hash {
  column-count: 3;
}
#view-btn:hover {
  background: #504b3c;
  cursor: pointer;
}
#btn-active {
  display: inline-flex;
}
#btn-show {
  color: #504b3c;
  background-color: #ede7dd;
  border-color: #ede7dd;
  box-shadow: 1px 1px 4px #666666;
}
.user-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #ffffff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.5rem;
}
#user-table {
  width: 100%;
}

.btn-add:hover {
  background-color: #504b3c;
  color: white;
}
.btn-add:hover .fa-user-cog {
  background-color: #504b3c;
}
.btn-add {
  background-color: #ede7dd;
  color: #504b3c;
  padding: 8px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 25px;
  box-shadow: 1px 1px 3px #666666;
}

#filter-input {
  box-sizing: border-box;
  background-image: url("@/assets/search_icon.png");
  background-position: 94% 10px;
  background-repeat: no-repeat;
  padding: 7px 20px 7px 45px;
  border: none;
  text-align: center;
  background: #ddddddc7;
  border-radius: 5px;
}
#next {
  display: unset !important;
}
#next-btn > span.fas.fa-caret-right.size.md-font {
  display: unset !important;
}
#today-btn {
  white-space: nowrap;
}
#my-table > tbody > tr > span {
  text-align: left;
}
table {
  border-collapse: collapse;
  width: 100%;
}

tbody tr td:nth-child(7) {
  /*the first cell in each tr*/
  text-align: left;
}

.table thead th {
  border-bottom: none !important;
}
.table th,
.table td {
  border-top: none;
}
#title-table > th:nth-child(1) {
  border-top-left-radius: 20px;
}
#title-table > th:nth-child(7) {
  border-top-right-radius: 20px;
}
#title-table {
  background-color: #ede7dd;
  color: #4e432d;
}
.table-hover tbody tr:hover {
  color: #4e432d;
  background-color: rgb(237 231 221 / 38%);
}
#scroll > table > tbody > tr {
  border-bottom: 1px solid #ede7dd;
}
.table thead th {
  vertical-align: middle;
}
#text-chart {
  font-size: 1.25rem;
  color: #4c412b;
  background: transparent;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 6px;
}
.table {
  /* width: 80%; */
  color: #2c3e50;
  margin: auto;
}
#text-table {
  font-size: 1.25rem;
  min-height: 1.5rem;
  vertical-align: bottom;
  margin-right: 10px;
  color: #4c412b;
  background: rgba(254, 209, 110, 0.452);
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 6px;
}
.custom-switch {
  display: -webkit-inline-box;
}
#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
}

.btn-outline-secondary {
  color: #ffffff !important;
  background-color: #fed16e !important;
  border-color: #fed16e !important;
}

.date-current {
  padding-left: 10px;
  width: 180px;
  display: table-cell;
  vertical-align: middle;
  text-align: start;
}

.line-middle {
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #6c757d;
  line-height: 0.1em;
  margin: 10px 0 20px;
}

.line-middle span {
  background: #fff;
}
.break-word {
  word-break: break-all;
}
.margin {
  margin: auto;
}

.total {
  font-size: 22pt;
  font-weight: bold;
}

.subtotal {
  font-size: 16pt;
  font-weight: bold;
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  /*  width: 16rem; */
  margin-left: 15px;
  display: flexbox;
  margin-left: 30px !important;
}

.socialogo {
  width: 60px;
}

.strike {
  word-wrap: break-word;
  width: 60%;
  display: block;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
}

.strike > span {
  position: relative;
  display: inline-block;
}

.strike > span:before,
.strike > span:after {
  content: "";
  position: absolute;
  top: 50%;
  width: 9999px;
  height: 3px;
  background: #ddd;
}

.strike > span:before {
  right: 100%;
  margin-right: 15px;
}

.strike > span:after {
  width: 9999px;
  left: 100%;
  margin-left: 15px;
}

.f-dot-text {
  margin-left: -10.8rem;
  margin-top: 12rem;
}

.s-dot-text {
  margin-left: -13.4rem;
}

.scrolling-wrapper {
  overflow-x: scroll;
  width: 80%;
  height: 610px;
  margin: auto;
  margin-top: 0;
}

/* width */
::-webkit-scrollbar {
  height: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 20px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 20px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.btn-primary:not(:disabled):not(.disabled).active,
.btn-primary:not(:disabled):not(.disabled):active,
.show > .btn-primary.dropdown-toggle {
  color: #4c412b;
  background-color: #ede7dd;
  width: 125px;
  border-color: transparent;
}

.show > .btn-primary.dropdown-toggle:focus {
  box-shadow: none !important;
}

.btn-primary:focus {
  box-shadow: none !important;
}

#submit {
  font-weight: bold;
  color: #4e432d;
  border: 2px solid #fed16e;
  line-height: 1;
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color: #fee2a5;
  padding: 0.6rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  box-shadow: 3px 4px 4px #888888;
}

#submit:hover {
  background-color: #fed16e;
  color: white;
}

.btn.focus,
.btn:focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0);
}
.h-ava {
  /* height: 75em; */
  overflow-y: hidden;
}

@media only screen and (max-width: 1150px) {
  .f-dot-text {
    margin-left: -67rem;
    margin-top: 40rem;
  }

  .s-dot-text {
    margin-left: -45.4rem;
    margin-top: -2rem;
  }

  .dot-text {
    margin-left: 0rem;
    margin-top: -2rem;
  }
}

@media only screen and (min-width: 0px) and (max-width: 600px) {
  .f-dot-text {
    margin-left: -26rem;
    margin-top: 42rem;
  }

  .s-dot-text {
    margin-left: -11rem;
    margin-top: -2rem;
  }

  .dot-text {
    margin-left: 0rem;
    margin-top: -2rem;
  }

  .scrolling-wrapper {
    height: auto;
  }

  .strike {
    width: 80px;
    word-wrap: break-word;
  }
  #date-btn {
    padding-bottom: 30px;
    white-space: nowrap;
  }
  hr {
    display: none;
  }
  #today-col {
    margin-left: -3%;
  }
  #previous {
    vertical-align: revert !important;
  }
  #next {
    display: unset !important;
    vertical-align: revert !important;
  }
  #next-btn > span.fas.fa-caret-right.size.md-font {
    display: unset !important;
    vertical-align: unset !important;
  }
  #container-date {
    width: 90% !important;
    margin: revert !important;
  }
  /* #next-btn {
    position: absolute;
    left: -17px;
    top: 6px;
  } */
  /* #pre-icon {
    margin-left: -23px;
  }
  #previous {
    left: 34px;
    position: absolute;
    bottom: 34px;
  } */
  #today-btn {
    white-space: nowrap;
    margin-left: -4px;
  }
  #date-icon {
    margin-top: 20px;
  }
  #container-date {
    padding-bottom: 30px;
  }
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  .table.b-table.b-table-stacked-md {
    display: block;
    width: 90%;
  }
  #today-btn {
    white-space: nowrap;
  }
  #previous {
    vertical-align: unset !important;
  }
  /* #pre-icon {
    top: 6px;
    position: absolute;
    left: 54px;
  }
  #previous {
    top: 0px;
    position: absolute;
    left: 62px;
  } */
}
@media only screen and (min-width: 0px) and (max-width: 1050px) {
  #btn-active {
    display: block;
  }
}
@media only screen and (min-width: 0px) and (max-width: 1300px) {
  .table {
    width: 97% !important;
  }
}
@media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (orientation: portrait) {
  #pre-icon {
    top: -3px;
  }
  #previous {
    left: 69px;
  }
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  .table[data-v-5811d9ee] {
    width: 90%;
  }
}
@media only screen and (min-device-width: 414px) and (max-device-width: 736px) and (orientation: portrait) {
  #pre-icon {
    top: -3px;
  }
  #previous {
    left: 40px;
  }
}
@media only screen and (min-device-width: 411px) and (max-device-width: 731px) and (orientation: portrait) {
  #pre-icon {
    top: -3px;
  }
  #previous {
    left: 40px;
  }
}
@media only screen and (min-width: 0px) and (max-width: 900px) {
  .table[data-v-5811d9ee] {
    width: 93%;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  .user-card {
    max-height: none;
    overflow: unset;
  }
  .table.b-table.b-table-stacked-md {
    display: block;
    width: 90%;
  }

  #title-table > th:nth-child(1) {
    left: 0px;
    display: revert;
    background: #e0d8ca;
  }
  #title-table {
    background-color: #ede7dd;
    color: #4e432d;
  }
  table {
    position: relative;
    width: 85vw;
    overflow: hidden;
    border-collapse: collapse;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }
  /*thead*/
  thead {
    position: relative;
    display: block; /*seperates the header from the body allowing it to be positioned*/
    width: 85vw;
    overflow: visible;
  }
  thead th {
    min-width: 120px;
    height: 32px;
  }
  thead th:nth-child(1) {
    /*first cell in the header*/
    position: relative;
    display: block; /*seperates the first cell in the header from the header*/
  }
  tbody {
    position: relative;
    display: block; /*seperates the tbody from the header*/
    width: 85vw;
    height: 400px;
    overflow: scroll;
  }
  tbody td:nth-child(7) {
    min-width: 200px;
  }
  #title-table > th:nth-child(7) {
    min-width: 200px;
  }
  tbody td {
    background-color: white;
    min-width: 120px;
    border-bottom: 1px solid #b7ad9b;
  }
  tbody tr td:nth-child(1) {
    /*the first cell in each tr*/
    position: relative;
    display: block; /*seperates the first column from the tbody*/
    background-color: #ede7dd;
    display: revert;
  }
  /*  #scroll{
  overflow: scroll;
  min-height:70vh;
  padding: 20px; 
}*/
  .table thead th {
    white-space: nowrap;
  }
  #content > div.row.justify-content-end {
    margin: auto;
    margin-right: unset !important;
  }
  #content > div.row.justify-content-end > button {
    margin: auto;
    margin-bottom: 20px;
  }
  #col-hash {
    column-count: 1;
  }
  #acclink > span.h5 {
    font-size: unset;
  }
  #acclink > span {
    font-size: unset;
  }
  #box-links:hover {
    background-color: #fed06e00 !important;
  }
  div.modal-vue-panel.modal-slide-top.modal-vue-show
    > div.modal-vue--content.space-content
    > div
    > div
    > div
    > div.pl-3 {
    padding-left: 0px !important;
  }
}
</style>
