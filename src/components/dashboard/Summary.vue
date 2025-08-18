<template>
  <b-col sm="12" md="12" lg="12">
    <div class="" id="sumboxsum">
      <!-- <vue-element-loading
            :active="getLoadStatus"
            size="80"
            background-color="rgba(255, 255, 255, 0.8)"
            color="#b6ac9a"
          /> -->
      <!-- {{ dataSum.all }}
      {{ dataSum.summary }} -->
      <br class="prt" />
      <b-row class="comment-post mt-3 " v-if="dataSum.all">
        <b-col sm="6" md="" cols="6">
          <div class="bg-box-stat">
            <div>
              <i class="fa fa-comments fa-2x" style="font-size: 25px;" /> <span
                class="text-uppercase text-sub dp">Messages</span>
            </div>
            <div class="md-font"></div>
            <div class="total-all">
              <div class="h4 bold mb-0 dp ">
                <b-row>
                  <b-col class="border-right" style="border-left: 0px solid #9e9e9e !important">
                    <div style="font-size:small;font-weight: 400;" class="text-sub">รายวัน</div>
                    <div v-b-tooltip.top :title="(dataSum.summary.total_message) | numFormat"> {{
                      formatCash(dataSum.summary.total_message||0) }} </div>
                    <!-- <div style="font-size:small;font-weight: 400;">Messages</div> -->
                  </b-col>
                  <b-col>
                    <div style="font-size:small;font-weight: 400;" class="text-sub">ค่าสะสม</div>
                    <div v-b-tooltip.bottom :title="(dataSum.all.total_message) | numFormat" class="text-sub"> {{
                      formatCash(dataSum.all.total_message) }}</div>
                    <!-- <div style="font-size:small;font-weight: 400;">Messages</div> -->
                  </b-col>
                </b-row>




              </div>
              <span class="prt">Messages : </span>
              <span class="small mt-0 p-0 prt">
                {{ (dataSum.all.total_message) | numFormat }}</span>
            </div>
          </div>
          <!-- <span class="dp" style="color:#6e6149">Messages
            <div class="small d-none" style="font-size: x-small;color:#4c412b ;">
              ( posts + comments )
            </div>
          </span> -->
        </b-col>

        <b-col sm="6" md="" cols="6">
          <div class="bg-box-stat">
            <i class="fa fa-paper-plane" style="font-size: 25px;" /> <span class="text-uppercase text-sub dp"> POSTS</span>
            <div class="md-font"></div>
            <div class="total-all h4 bold mb-0 dp">
              <b-row>
                <b-col class="border-right" style="border-left: 0px solid #9e9e9e !important">
                  <div style="font-size:small;font-weight: 400;" class="text-sub">รายวัน</div>
                  <div v-b-tooltip.top :title="(dataSum.summary.total_post) | numFormat"> {{
                    formatCash(dataSum.summary.total_post) }} </div>
                </b-col>
                <b-col>
                  <div style="font-size:small;font-weight: 400;" class="text-sub">ค่าสะสม</div>
                  <div v-b-tooltip.bottom :title="(dataSum.all.total_post) | numFormat" class="text-sub"> {{
                    formatCash(dataSum.all.total_post) }}</div>
                </b-col>
              </b-row>

              <!-- <div class="" v-b-tooltip.top :title="dataSum.summary.total_post | numFormat">{{
              formatCash(dataSum.summary.total_post) }}</div>
            <div class=" text-sub" v-b-tooltip.bottom :title="dataSum.all.total_post | numFormat">{{
              formatCash(dataSum.all.total_post) }}</div> -->
              <span class="prt ">Posts : {{ dataSum.all.total_post | numFormat }} </span>
            </div>
          </div>
          <!-- <span class="dp">Posts </span> -->
        </b-col>

        <b-col cols="6" sm="6" md="">
          <div class="bg-box-stat">
            <div><i class="fa fa-comment fa-2x" style="font-size: 25px;" /> <span
                class="text-uppercase text-sub dp">Comments</span></div>
            <div class="total-all h4 bold mb-0 dp">
              <b-row>
                <b-col class="border-right" style="border-left: 0px solid #9e9e9e !important">
                  <div style="font-size:small;font-weight: 400;" class="text-sub">รายวัน</div>
                  <div v-b-tooltip.top :title="(dataSum.summary.total_comment) | numFormat"> {{
                    formatCash(dataSum.summary.total_comment) }} </div>

                </b-col>
                <b-col>
                  <div style="font-size:small;font-weight: 400;" class="text-sub">ค่าสะสม</div>
                  <div v-b-tooltip.bottom :title="(dataSum.all.total_comment) | numFormat" class="text-sub"> {{
                    formatCash(dataSum.all.total_comment) }}</div>

                </b-col>
              </b-row>
              <!-- <div class="" v-b-tooltip.top :title="dataSum.summary.total_comment | numFormat">{{
              formatCash(dataSum.summary.total_comment) }}</div>
            <div class=" text-sub" v-b-tooltip.bottom :title="dataSum.all.total_comment | numFormat">{{
              formatCash(dataSum.all.total_comment) }}</div> -->
             </div>  
             <span class="prt">Comments :{{ dataSum.all.total_comment | numFormat }} </span>
           
          </div>
          <!-- <span class="dp">Comments</span> -->
        </b-col>
        <b-col cols="6" sm="6" md="">
          <div class="bg-box-stat">
            <div><i class="fa fa-users fa-2x" style="font-size: 25px;" /> <span
                class="text-uppercase text-sub dp">Users</span> </div>
            <div class="h4 bold mb-0 dp">
              <b-row >
                <b-col class="border-right" style="border-left: 0px solid #9e9e9e !important" >
                  <div style="font-size:small;font-weight: 400;" class="text-sub">รายวัน</div>
                  <div v-b-tooltip.top :title="(dataSum.summary.total_user) | numFormat"> {{
                    formatCash(dataSum.summary.total_user) }} </div>

                </b-col>
                <b-col >
                  <div style="font-size:small;font-weight: 400;" class="text-sub">ค่าสะสม</div>
                  <div v-b-tooltip.bottom :title="(dataSum.all.total_user) | numFormat" class="text-sub"> {{
                    formatCash(dataSum.all.total_user) }}</div>

                </b-col>
              </b-row>

              <!-- <div v-b-tooltip.top :title="dataSum.summary.total_user | numFormat">{{
              formatCash(dataSum.summary.total_user) }}</div>
            <div class="text-sub" v-b-tooltip.bottom :title="dataSum.all.total_user | numFormat">{{
              formatCash(dataSum.all.total_user) }}
            </div> -->
            </div>
         
              <span class="prt">Users : {{ dataSum.all.total_user | numFormat }} </span>
       
          </div>
          <!-- <span class="dp">Users</span> -->
        </b-col>
      </b-row>


      
      <br class="prt" />
    </div>
  </b-col>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: { dataSum: { type: Object } },
  computed: {
    ...mapGetters([
      "getSummary",
      "getSumFacebook",
      "getSumTwitter",
      "getSumPantip",
      "getSumYoutube",
      "getSumNews",
      "getSumInstagram",
    ]),
    sumPost() {
      var a = [
        this.getSumFacebook.post,
        this.getSumTwitter.post,
        this.getSumPantip.post,
        this.getSumYoutube.post,
        this.getSumNews.post,
      ];
      var sum = a.reduce(function (a, b) {
        return a + b;
      }, 0);
      return sum;
    },
    sumComment() {
      var a = [
        this.getSumFacebook.comment,
        this.getSumTwitter.comment,
        this.getSumPantip.comment,
        this.getSumYoutube.comment,
        this.getSumNews.comment,
      ];
      var sum = a.reduce(function (a, b) {
        return a + b;
      }, 0);
      return sum;
    },
    sumUser() {
      var a = [
        this.getSumFacebook.users,
        this.getSumTwitter.users,
        this.getSumPantip.users,
        this.getSumYoutube.users,
        this.getSumNews.users,
      ];
      var sum = a.reduce(function (a, b) {
        return a + b;
      }, 0);
      return sum;
    },
  },
  methods: {
    formatCash(n) {
      if (n < 1e3) return n;
      if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
      if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
      if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
      if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
    },
  },
  created() {
    var items = [
      { name: "Edward", value: 21 },
      { name: "Sharpe", value: 37 },
      { name: "And", value: 45 },
      { name: "The", value: -12 },
      { name: "Magnetic", value: 13 },
      { name: "Zeros", value: 37 },
      { name: "Z", value: 137 },
      { name: "Zss", value: 1366667 },
    ];

    // sort by value
    items.sort(function (a, b) {
      return b.value - a.value;
    });


    const shots = [
      { id: 1, amount: 2 },
      { id: 2, amount: 4 },
      { id: 3, amount: 52 },
      { id: 4, amount: 36 },
      { id: 5, amount: 13 },
      { id: 6, amount: 33 },
    ];

    shots.reduce(
      (acc, shot) => (acc = acc > shot.amount ? acc : shot.amount),
      0
    );


    var arr = [1, 2, 3];
    var max = arr.reduce(function (a, b) {
      return Math.max(a, b);
    });

  },
};
</script>

<style scoped>
.bg-box-stat {
  border: 1px solid #6f5b37b8;
  /* background: linear-gradient(to bottom, #f8f6f1 0%, #f2eee4 100%); */
  padding-top: 15px;
  padding-bottom: 15px;
  border-radius: 20px;
  margin: 2px 0px;
  min-height: 100%;
}

.text-sub {
  color: #68645c
}

.h4,
.border-left {
  color: #68645c;
}

.fa {
  color: #fdd786;
  background: linear-gradient(to bottom, #f5dba3 0%, #e3b348 100%);
  -webkit-background-clip: text;
  -moz-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.border-left {
  border-left: 0px solid #9e9e9e !important;
}

.border-right {
  border-left: 1px solid #9e9e9e !important;
}

#tt-sum {
  /* color:#4c412b ; */
  display: -webkit-inline-box;
}

#sumboxsum {
  padding-top: 10px;
  width: 100%;
  background-color: transparent;
  padding-bottom: 10px;
  display: block;
  margin: auto;
  border-radius: 26px;
}

.socialogo-sum {
  width: 20%;
  margin-bottom: 15px;
  margin-top: 15px;
  display: -webkit-inli-box;
}

.sum-right {
  text-align: start;
}

@media only screen and (max-width: 1150px) {
  .box .tooltiptext {
    width: 45em;
  }
}

@media only screen and (min-width: 1150px) and (max-width: 1750px) {
  .box .tooltiptext {
    width: 55em;
  }
}

@media only screen and (min-width: 0px) and (max-width: 941px) {
  .box .tooltiptext {
    width: 28em;
  }
}

@media only screen and (min-width: 820px) and (max-width: 990px) {
  .md-font {
    font-size: 1.5vw !important;
  }
}

@media only screen and (min-device-width: 770px) and (max-width: 850px) {
  .md-font {
    font-size: 2.2vw !important;
  }
}

@media only screen and (min-device-width: 768px) and (max-device-width: 1000px) {
  .md-font {
    font-size: 2vw !important;
  }
}

@media only screen and (min-width: 375px) and (max-width: 815px) {
  .box .tooltiptext {
    width: auto !important;
  }

  .md-font {
    font-size: 1.7vw !important;
  }
}

@media only screen and (min-width: 0px) and (max-width: 800px) {
  .bg-box-stat {
  margin: 2px 0px;
}

  #sumboxsum > div:nth-child(2) > div{
     padding: 5px 5px !important;
  }
  .border-right {
  border: 0px solid #9e9e9e !important;

  }
.comment-post{
  zoom:75% 
}
  .box .tooltiptext {
    width: auto !important;
  }
#sumboxsum .col {
 padding: 0px !important;
}
  #sumboxsum {
    min-height: unset !important;
    padding-top: 0px;
    padding-bottom: 0px;
  }

  .md-font {
    font-size: 3.5vw !important;
  }

  .border-left {
    border-left: none !important;
  }

  .total-all {
    /* font-size: 10pt; */
    font-weight: bold;
  }

  .comment-post {
    font-size: small;
  }

  .mx-datepicker-range {
    width: 100%;
  }

  .justify-content-end {
    margin: auto;
  }

  #date-picker {
    margin: unset !important;
  }
}
</style>
