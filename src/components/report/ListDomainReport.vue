<template>
  <div>
    <b-container>
      <div class="h5 text-left my-3">
        Domain <span class="small"> (posts) </span>
      </div>
      <b-list-group class="scroll-list"  >
        <b-list-group-item
        @click="clickDomainAll()"
          button
          class="d-flex justify-content-between align-items-center"
        >
          All Posts
          <div>
            <!-- <span class="badge">{{ getStatReport.stats.totalPost | numFormat }}</span> -->
          </div>
        </b-list-group-item>
        <b-list-group-item
        @click="clickDomain(item.domain)"
          button
          class="d-flex justify-content-between align-items-center"
          v-for="item in getStatReport.domains"
          :key="item.postcnt"
        >
        <div v-if="item.domain!=='none'"> {{ item.domain }}</div>
        <div v-else > ไม่มี Domain</div>
          <div>
            <span class="badge">{{ item.count | numFormat }}</span>
          </div>
        </b-list-group-item>
      </b-list-group>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters([
      "getDateReport","getStatReport"
    ]),
  },
  data() {
    return {
      items: [
        { domain: "การเมือง", postcnt: "14" },
        { domain: "สถาบัน", postcnt: "10" },
        { domain: "ชุมนุม", postcnt: "8" },
        { domain: "กองทัพ", postcnt: "6" },
      ],
    };
  },
  methods:{
    clickDomainAll(){
      this.$store.commit('setDomainReport', '')
    },
    clickDomain(domain){
      console.log('domain ,',domain);
    if (domain.length==0) {
      domain='none'
    } 
      this.$store.commit('setDomainReport', domain)
    }
  }
 
};
</script>

<style scoped>
.scroll-list{
  max-height: 400px;
    overflow: auto;
}
.badge {
  font-size: 14px;
  color: #fff;
  padding: 5px 9px;
  background-color: #5679a5;
  border-radius: 15px;
  min-width: 35px;
}
.list-group-item-action:focus,
.list-group-item-action:hover {
  z-index: 1;
  color: #5679a5;
  text-decoration: none;
  background-color: #ffffff;
  font-weight: 700;
}
button:focus {
  outline: 5px auto #5679a5;
}
</style>
