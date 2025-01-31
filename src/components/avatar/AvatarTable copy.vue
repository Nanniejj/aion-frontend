<template>
  <div>
    <div class="table" v-if="getSummaryAvatar">
      <b-row class="mb-3">
        <b-col lg="6" class="my-1">
          <b-form-group
            label-for="filter-input"
            label-cols-sm="0"
            label-align-sm="right"
            label-size="md"
            class="mb-0"
          >
            <b-input-group size="md">
              <b-form-input
                v-if="selected == 'twActive'"
                id="filter-input"
                v-model="filterTw"
                type="search"
                placeholder="ค้นหา"
              ></b-form-input>
              <b-form-input
                v-else
                id="filter-input"
                v-model="filterFb"
                type="search"
                placeholder="ค้นหา"
              ></b-form-input>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col lg="2" class="my-1">
          <b-form-select
            v-model="selected"
            :options="options"
            @change="selectChange"
          ></b-form-select>
        </b-col>
        <b-col class="my-1">
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
      <b-row
        class="mb-4 mt-4"
        cols="2"
        cols-md="4"
        cols-lg="4"
        v-if="selected == 'twActive'"
      >
        <b-col>
          <i class="fa fa-twitter"></i>
          <div>
            <b>{{ getSummaryAvatar.twitter.tweet | numFormat }}</b> Tweets
          </div>
        </b-col>
        <b-col>
          <i class="fa fa-retweet"></i>
          <div>
            <b>{{ getSummaryAvatar.twitter.retweet | numFormat }}</b> Retweets
          </div>
        </b-col>
        <b-col>
          <i class="fas fa-reply"></i>
          <div>
            <b>{{ getSummaryAvatar.twitter.reply | numFormat }}</b> Reply
          </div>
        </b-col>
        <b-col>
          <i class="fas fa-heart"></i>
          <div>
            <b>{{ getSummaryAvatar.twitter.favourites | numFormat }}</b> Likes
          </div>
        </b-col>
        <!-- <b-col>
          <i class="fas fa-quote-right"></i>
         <div><b>{{getSummaryAvatar.twitter.quote |numFormat}}</b> quote</div>
       </b-col> -->
      </b-row>
      <b-row class="mb-4 mt-4" v-else cols="3" cols-md="3" cols-lg="3">
        <b-col>
          <i class="fa fa-facebook"></i>
          <div>
            <b>{{ getSummaryAvatar.facebook.post | numFormat }}</b> Posts
          </div>
        </b-col>
        <b-col>
          <i class="fa fa-comments"></i>
          <div>
            <b>{{ getSummaryAvatar.facebook.comment | numFormat }}</b> Comments
          </div>
        </b-col>
        <b-col>
          <i class="fas fa-share"></i>
          <div>
            <b>{{ getSummaryAvatar.facebook.share | numFormat }}</b> Share
          </div>
        </b-col>
      </b-row>
    </div>
    <div v-if="getAvatar && getAvatar.length != 0">
      <!-- --------------------------twitter table-------------------------------------------------------------- -->
      <b-table
        v-if="selected == 'twActive'"
        responsive
        :items="getAvatar"
        :fields="FieldsTwitter"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filterTw"
        :filter-included-fields="filterOn"
        :empty-filtered-text="empData"
        stacked="lg"
        show-empty
        small
        @filtered="onFiltered"
        head-variant="dark"
        class="text-break"
        id="tb-profile"
      >
        <template #cell(id)="row">
          {{ row.index + 1 + 20 * (currentPage - 1) }}
        </template>
        <template #cell(name)="row">
          <b>{{ row.item.name }}</b>
        </template>
        <template #cell(total_account)="row">
          {{ row.item.twitter.total_account | numFormat }}
        </template>
        <template #cell(active)="row">
          <div id="btn-active">
            <div>{{ row.item.twitter.total_account_active | numFormat }}</div>
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
          <div v-if="rows.item.twitter.export_data.length" class="user-card">
            <b-table
              id="user-table"
              :bordered="false"
              :borderless="true"
              :items="rows.item.twitter.export_data"
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
              <template #cell(follower)="row">
                {{ row.value | numFormat }}
              </template>
              <template #cell(tweet)="row">
                {{ row.value | numFormat }}
              </template>
              <template #cell(retweet)="row">
                {{ row.value | numFormat }}
              </template>
              <template #cell(likes_count)="row">
                {{ row.value | numFormat }}
              </template>
              <template #cell(view)="row">
                <span
                  class="fas fa-list-ul float-right"
                  v-b-tooltip.hover
                  title="ดูข้อมูล"
                  size="sm"
                  @click="
                    open = true;
                    info(row.item, rows.item.name);
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
        <template #cell(tweet)="row">
          {{ row.item.twitter.tweet | numFormat }}
        </template>
        <template #cell(retweet)="row">
          {{ row.item.twitter.retweet | numFormat }}
        </template>
        <template #cell(reply)="row">
          {{ row.item.twitter.reply | numFormat }}
        </template>
        <template #cell(likes)="row">
          {{ row.item.twitter.favourites | numFormat }}
        </template>
        <template #cell(top3_hashtag)="row">
          <div v-if="row.item.twitter.top3_hashtag.name != ''">
            <span v-if="row.item.twitter.top3_hashtag.name[0]"
              ><b>1 </b>{{ row.item.twitter.top3_hashtag.name[0] }}</span
            >
            <br /><span v-if="row.item.twitter.top3_hashtag.name[1]"
              ><b>2 </b>{{ row.item.twitter.top3_hashtag.name[1] }}</span
            >
            <br /><span v-if="row.item.twitter.top3_hashtag.name[2]"
              ><b>3 </b>{{ row.item.twitter.top3_hashtag.name[2] }}
            </span>
          </div>
          <div v-else style="color:#83878a;">ไม่มี #Top3</div>
        </template>
      </b-table>

      <!-- -----------------------------------facebook table---------------------------------------------------- -->

      <b-table
        hover
        v-else
        responsive
        :items="getAvatar"
        :fields="FieldsFacebook"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filterFb"
        :filter-included-fields="filterOn"
        :empty-filtered-text="empData"
        stacked="lg"
        show-empty
        small
        @filtered="onFiltered"
        head-variant="dark"
        class="text-break"
        id="tb-profile"
      >
        >

        <template #cell(id)="row">
          {{ row.index + 1 + (currentPage - 1) * currentPage * 10 }}
        </template>
        <template #cell(name)="row">
          <b>{{ row.item.name }}</b>
        </template>
        <template #cell(total_account)="row">
          {{ row.item.facebook.total_account | numFormat }}
        </template>
        <template #cell(post)="row">
          {{ row.item.facebook.post | numFormat }}
        </template>
        <template #cell(comment)="row">
          {{ row.item.facebook.comment | numFormat }}
        </template>
        <template #cell(share)="row">
          {{ row.item.facebook.share | numFormat }}
        </template>
      </b-table>
      <!-- paginate -->
      <b-row class="mt-5 text-center mb-4">
        <b-col
          sm="7"
          md="6"
          class="my-1 m-auto "
          id="page"
          v-if="filterTw || filterFb"
        >
          <b-pagination
            v-model="currentPage"
            :total-rows="this.totalRows"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0"
          ></b-pagination>
        </b-col>
        <b-col sm="7" md="6" class="my-1 m-auto " id="page" v-else>
          <b-pagination
            v-model="currentPage"
            :total-rows="getAvatar.length"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0"
          ></b-pagination>
        </b-col>
      </b-row>
    </div>

    <!-- ----------------------------------------------Info modal--------------------------------------------- -->
    <vue-modaltor
      :visible="open"
      @hide="hideModal"
      :resize-width="{ 3500: '50%', 1500: '70%', 992: '70%', 768: '90%' }"
      :animation-panel="'modal-slide-top'"
      class="hei-popup"
    >
      <b-container fluid>
        <div v-if="selected == 'twActive'">
          <div class="hh">
            <a
              :href="'https://twitter.com/' + dataInfo.account_name"
              target="_blank"
              id="acclink"
            >
              <span class="bold h5">
                <span v-if="dataInfo.profile_image"
                  ><img :src="dataInfo.profile_image" id="profile-pic"
                /></span>
                <span v-else><b-avatar class="mr-3"></b-avatar></span>
                {{ dataInfo.account_name }}
              </span>
              <i class="fa fa-external-link mr-2" />
            </a>
            <span class="h6">
              <b-badge id="box-team">{{ teamName }}</b-badge></span
            >
          </div>
          <hr />
          <b-row
            class="text-center"
            cols="2"
            cols-sm="2"
            cols-md="2"
            cols-lg="4"
          >
            <b-col>
              <div>
                <i class="fa fa-users" style="color: rgb(100, 103, 105);"></i>
              </div>
              <div>
                <b>{{ dataInfo.follower | numFormat }}</b> Followers
              </div>
            </b-col>
            <b-col>
              <div>
                <i class="fa fa-twitter" style="color: rgb(29, 161, 242);"></i>
              </div>
              <div>
                <b>{{ dataInfo.tweet | numFormat }}</b> Tweets
              </div>
            </b-col>
            <b-col>
              <div>
                <i class="fa fa-retweet" style="color:rgb(23, 191, 99);"></i>
              </div>
              <div>
                <b>{{ dataInfo.retweet | numFormat }}</b> Retweets
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
                >( total : <b>{{ dataHash.length | numFormat }}</b> hashtags
                )</span
              >
            </div>
            <div id="col-hash" v-if="dataHash.length">
              <div v-for="(hash, k) in dataHash" :key="k" class="text-left">
                {{ k + 1 }}. {{ hash }}
              </div>
            </div>
            <div v-else>ไม่พบข้อมูล Hashtag</div>

            <div class="mt-3 bold">
              Tweets
              <span class="small"
                >( total : <b>{{ uidLink.length | numFormat }}</b> tweets
                )</span
              >
            </div>
            <span v-if="uidLink.length">
              <div v-for="(post, k) in uidLink" :key="k">
                <a
                  id="box-links"
                  class="mt-2"
                  :href="
                    'https://twitter.com/' +
                      dataInfo.account_name +
                      '/status/' +
                      post
                  "
                  target="_blank"
                >
                  <span>{{ k + 1 }}. </span>
                  https://twitter.com/{{ dataInfo.account_name }}/status/{{
                    post
                  }}
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
    totalRows: function(newVal, oldVal) {
      // watch it
      console.log("Prop changed: ", newVal, " | was: ", oldVal);
    },
  },
  data: function() {
    return {
      teamShow: "",
      uidLink: [],
      teamName: "",
      dataHash: [],
      open: false,
      dataInfo: "",
      fields: [
        { key: "id", label: "#" },
        { key: "account_name", label: "Account" },
        "follower",
        "tweet",
        "retweet",
        { key: "likes_count", label: "Likes" },
        { key: "view", label: "" },
      ],
      selected: "twActive",
      options: [
        { value: "twActive", text: "Twitter" },
        { value: "fbActive", text: "Facebook" },
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
        { key: "name", label: "Team" },
        { key: "total_account", label: "Accounts" },
        { key: "tweet", label: "Tweets" },
        { key: "retweet", label: "Retweets" },
        { key: "reply", label: "Reply" },
        { key: "likes", label: "Likes" },
        { key: "top3_hashtag", label: "#Top3" },
        { key: "active", label: "Active" },
      ],
      FieldsFacebook: [
        { key: "id", label: "#" },
        { key: "name", label: "Team" },
        { key: "total_account", label: "Accounts" },
        { key: "post", label: "Posts" },
        { key: "comment", label: "Comments" },
        { key: "share", label: "Share" },
        //{ key: 'favourites', label: 'favourites', sortable: true, },
      ],
      empData: "ไม่พบข้อมูล",
    };
  },
  computed: {
    ...mapGetters(["getAvatar", "getSummaryAvatar"]),
    total() {
      var row = this.totalRows;
      row = this.getAvatar.length;
      return row;
    },
  },
  methods: {
    info(item, team) {
      this.teamName = team;
      this.dataInfo = item;
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
    selectChange() {
      this.currentPage = 1;
    },
    hideModal() {
      this.open = false;
    },
  },
};
</script>
<style scoped>
#profile-pic {
  width: 40px;
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
  background: #fed16e8a ;
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
  width: 80%;
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
