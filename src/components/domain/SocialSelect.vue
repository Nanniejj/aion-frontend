<template>
  <div class="mt-3">
    <span id="box-domain" class="mt-3 mb-3">
      <b-row cols="auto" class="m-auto">
        <!-- d-contents -->
        <b-col cols="6" md="3" lg="auto"
          ><a
            :id="'eltab1' + idx"
            tabindex="0"
            @click="allActive('eltab1' + idx, '', 'i1' + idx)"
          >
            <b-icon icon="check" :id="'i1' + idx"></b-icon>All</a
          ></b-col
        >
        <b-col cols="6" sm="6" md="3" lg="auto"
          ><a
            :id="'eltab2' + idx"
            tabindex="0"
            @click="allActive('eltab2' + idx, 'facebook', 'i2' + idx)"
          >
            <b-icon icon="check" :id="'i2' + idx" />Facebook</a
          ></b-col
        >
        <b-col cols="6" md="3" lg="auto"
          ><a
            :id="'eltab3' + idx"
            tabindex="0"
            @click="allActive('eltab3' + idx, 'twitter', 'i3' + idx)"
          >
            <b-icon icon="check" :id="'i3' + idx" />X</a
          ></b-col
        >
        <b-col cols="6" sm="6" md="3" lg="auto"
          ><a
            :id="'eltab4' + idx"
            tabindex="0"
            @click="allActive('eltab4' + idx, 'pantip', 'i4' + idx)"
          >
            <b-icon icon="check" :id="'i4' + idx" />Board</a
          ></b-col
        >
        <b-col cols="6" sm="6" md="3" lg="auto"
          ><a
            :id="'eltab5' + idx"
            tabindex="0"
            @click="allActive('eltab5' + idx, 'news', 'i5' + idx)"
          >
            <b-icon icon="check" :id="'i5' + idx" />News</a
          ></b-col
        >
        <b-col cols="6" sm="6" md="3" lg="auto"
          ><a
            :id="'eltab6' + idx"
            tabindex="0"
            @click="allActive('eltab6' + idx, 'youtube', 'i6' + idx)"
          >
            <b-icon icon="check" :id="'i6' + idx" />Youtube</a
          ></b-col
        >
        <b-col cols="6" sm="6" md="3" lg="auto"
          ><a
            :id="'eltab7' + idx"
            tabindex="0"
            @click="allActive('eltab7' + idx, 'instagram', 'i7' + idx)"
          >
            <b-icon icon="check" :id="'i7' + idx" />Instagram</a
          ></b-col
        >
        <b-col cols="6" sm="6" md="3" lg="auto"
          ><a
            :id="'eltab8' + idx"
            tabindex="0"
            @click="allActive('eltab8' + idx, 'blockdit', 'i8' + idx)"
          >
            <b-icon icon="check" :id="'i8' + idx" />Blockdit</a
          ></b-col
        >

        <b-col cols="6" sm="6" md="3" lg="auto"
          ><a
            :id="'eltab9' + idx"
            tabindex="0"
            @click="allActive('eltab9' + idx, 'tiktok', 'i9' + idx)"
          >
            <b-icon icon="check" :id="'i9' + idx" />Tiktok</a
          ></b-col
        >
        <b-col cols="6" sm="6" md="3" lg="auto"
          ><a
            :id="'eltab10' + idx"
            tabindex="0"
            @click="allActive('eltab10' + idx, 'threads', 'i10' + idx)"
          >
            <b-icon icon="check" :id="'i10' + idx" />Threads</a
          ></b-col
        >
      </b-row>
    </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters([
      "getClickDomain",
      "getSdateDm",
      "getEdateDm",
      "getArrDate",
      "getQuerySearch",
      "getWordCloudHashtag",
    ]),
  },
  watch: {
    getArrDate: function(newVal, oldVal) {
      // watch it
      console.log("Prop changed: ", newVal, " | was: ", oldVal);
      this.allActive("eltab11", "", "i11");
      //this.allActive('eltab12', '', 'i12')
    },
    getQuerySearch() {
      this.allActive("eltab11", "", "i11");
    },
    getWordCloudHashtag() {
      this.allActive("eltab11", "", "i11");
    },
  },

  props: {
    tabsocial: {
      type: String,
    },
  },
  data() {
    return {
      check: false,
      idx: 1,
    };
  },
  methods: {
    allActive(ele, social, check) {
      console.log(ele, social, check, this.idx);
      var active = ele;
      var a, b, c, d, e, f, g, bd, tt,td;
      a = "eltab1" + this.idx;
      b = "eltab2" + this.idx;
      c = "eltab3" + this.idx;
      d = "eltab4" + this.idx;
      e = "eltab5" + this.idx;
      f = "eltab6" + this.idx;
      g = "eltab7" + this.idx;
      bd = "eltab8" + this.idx;
      tt = "eltab9" + this.idx;
      td = "eltab10" + this.idx;

      var h, i, j, k, l, m, n, o, p,q;
      h = "i1" + this.idx;
      i = "i2" + this.idx;
      j = "i3" + this.idx;
      k = "i4" + this.idx;
      l = "i5" + this.idx;
      m = "i6" + this.idx;
      n = "i7" + this.idx;
      o = "i8" + this.idx;
      p = "i9" + this.idx;
      q = "i10" + this.idx;

      if (this.tabsocial == "post") {
        this.$store.commit("setSocialDomain", social);
      }
      if (this.tabsocial == "postword") {
        this.$store.commit("setWordCloudSocial", social);
      }

      if (this.tabsocial == "posthash") {
        this.$store.commit("setHashtagSocial", social);
      }

      if (this.tabsocial == "feed") {
        console.log("ddddddddddddddddd");
        this.$store.commit("setSocialFeed", social);
      }
      //  if (this.tabsocial=='issue') {
      //    this.$store.commit('setSocialIssue',social)
      //  }
      //underline
      document.getElementById(a).style.borderColor = "#ffffff00";
      document.getElementById(b).style.borderColor = "#ffffff00";
      document.getElementById(c).style.borderColor = "#ffffff00";
      document.getElementById(d).style.borderColor = "#ffffff00";
      document.getElementById(e).style.borderColor = "#ffffff00";
      document.getElementById(f).style.borderColor = "#ffffff00";
      document.getElementById(g).style.borderColor = "#ffffff00";
      document.getElementById(bd).style.borderColor = "#ffffff00";
      document.getElementById(tt).style.borderColor = "#ffffff00";
      document.getElementById(td).style.borderColor = "#ffffff00";
      if (this.tabsocial == "feed") {
        document.getElementById(active).style.borderColor = "#fed16e";
      } else {
        document.getElementById(active).style.borderColor = "#fed16e";
      }

      //check
      document.getElementById(h).style.color = "#ffffff00";
      document.getElementById(i).style.color = "#ffffff00";
      document.getElementById(j).style.color = "#ffffff00";
      document.getElementById(k).style.color = "#ffffff00";
      document.getElementById(l).style.color = "#ffffff00";
      document.getElementById(m).style.color = "#ffffff00";
      document.getElementById(n).style.color = "#ffffff00";
      document.getElementById(o).style.color = "#ffffff00";
      document.getElementById(p).style.color = "#ffffff00";
      document.getElementById(q).style.color = "#ffffff00";
      //change
      document.getElementById(check).style.color = "#2c3e50";
    },
  },
  mounted(){
 if (this.tabsocial == "feed") {
      document.getElementById("eltab11").style.borderColor = "#fed16e";
    } else {
      document.getElementById("eltab11").style.borderColor = "#fed16e";
    }
  },
  created() {
    this.idx = 1;
  },
  destroyed() {
    console.log("setSocialDomain");
    this.$store.commit("setSocialDomain", "");
    this.$store.commit("setSocialFeed", "");
  },
};
</script>

<style scoped>
#box-domain {
  width: 100%;
  height: auto;
  padding: 20px 0px;
  border-radius: 7px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
#all-eltab {
  border-bottom: 5px solid #ffffff00;
}
#eltab11,
#eltab21,
#eltab31,
#eltab41,
#eltab51,
#eltab61,
#eltab71,
#eltab81,
#eltab91 ,#eltab101{
  cursor: pointer;
  text-align: center;
  margin: 0px 10px;
  line-height: 30px;
}

#eltab11 {
  outline-style: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-color: transparent;
  border-bottom: 5px solid #fed06e00;
}
#eltab21,
#eltab31,
#eltab41,
#eltab51,
#eltab61,
#eltab71,
#eltab81,
#eltab91 ,#eltab101{
  outline-style: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-color: transparent;
  border-bottom: 5px solid #ffffff00;
}
#i21,
#i31,
#i41,
#i51,
#i61,
#i71,
#i81,
#i91,#i101 {
  color: #ffffff00;
}

#eltab12,
#eltab22,
#eltab32,
#eltab42,
#eltab52,
#eltab62,
#eltab72,
#eltab82,
#eltab92,#eltab102 {
  cursor: pointer;
  text-align: center;
  margin: 0px 10px;
  line-height: 30px;
}
#eltab12 {
  outline-style: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-color: transparent;
  border-bottom: 5px solid #fed16e;
}
#eltab22,
#eltab32,
#eltab42,
#eltab52,
#eltab62,
#eltab72,
#eltab82,
#eltab92 ,#eltab102{
  outline-style: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-color: transparent;
  border-bottom: 5px solid #ffffff00;
}
#i22,
#i32,
#i42,
#i52,
#i62,
#i72,
#i82,
#i92,#i102 {
  color: #ffffff00;
}

.col-lg-auto {
  display: contents;
  font-size: 17px;
}
.col-md-3 {
  display: contents;
}
.col-sm-6 {
  display: contents;
}
@media (max-width: 1220px) {
  #eltab1,
  #eltab2,
  #eltab3,
  #eltab4,
  #eltab5,
  #eltab6,
  #eltab7 {
    margin: 0px 7px;
  }
}
@media (max-width: 1150px) {
  #eltab1,
  #eltab2,
  #eltab3,
  #eltab4,
  #eltab5,
  #eltab6,
  #eltab7 {
    margin: 0px 1px;
  }
  .col-6 {
    display: contents;
    font-size: 16px;
    padding: 10px;
  }
}
@media (max-width: 980px) {
  #eltab1,
  #eltab2,
  #eltab3,
  #eltab4,
  #eltab5,
  #eltab6,
  #eltab7 {
    margin: 0px 6px;
  }
}
@media (max-width: 780px) {
  #eltab1,
  #eltab2,
  #eltab3,
  #eltab4,
  #eltab5,
  #eltab6,
  #eltab7 {
    margin: 0px 3px;
  }
}
@media (max-width: 630px) {
  #eltab11,
  #eltab21,
  #eltab31,
  #eltab41,
  #eltab51,
  #eltab61,
  #eltab71,
  #eltab81,
  #eltab91, #eltab101 {
    cursor: pointer;
    text-align: center;
    margin: 0px 2px;
    line-height: 30px;
  }
  #eltab1,
  #eltab2,
  #eltab3,
  #eltab4,
  #eltab5,
  #eltab6,
  #eltab7 {
    cursor: pointer;
    text-align: center;
    margin: 0px 5px;
    line-height: 20px;
  }
  .col-6 {
    display: contents;
    font-size: 14px;
    padding: 10px;
  }
  #box-domain {
    width: 100%;
    height: auto;
    padding: 0px 5px;
    border-radius: 7px;
    box-shadow: 0 4px 8px 0 rgba(255, 250, 250, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
