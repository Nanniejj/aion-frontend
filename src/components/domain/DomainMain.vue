<template>
  <div>
    <DomainBackBar />
    <div class="ml-lg-5 mr-lg-5 ml-md-3 mr-md-3 ml-sm-3 mr-sm-3 p-3">
      <DomainGraph class="mt-1" />
      <StaticDomain class="mt-3"/>
      <DomainCloud class="mt-5"/>
      <TopUser class="mt-5" />
      <TopPostDomain class="mt-5" />
      <AllPostDomain class="mt-5"/>
    </div>
  </div>
</template>

<script>
import DomainBackBar from "@/components/domain/DomainBackBar.vue";
import DomainGraph from "@/components/domain/DomainGraph.vue";
import StaticDomain from "@/components/domain/StaticDomain.vue";
import DomainCloud from "@/components/domain/DomainCloud.vue";
import TopPostDomain from "@/components/domain/TopPostDomain.vue";
import AllPostDomain from "@/components/domain/AllPostDomain.vue";
import TopUser from "@/components/domain/TopUser.vue";
export default {
  components: {
    DomainBackBar,
    DomainGraph,
    StaticDomain,
    DomainCloud,
    TopPostDomain,
    AllPostDomain,
    TopUser,
  },
  methods: {},
};
</script>

<style scoped>
/* .container, .container-lg, .container-md, .container-sm, .container-xl {
    max-width: 1350px;
} */
#active {
  text-decoration: underline;
}
.title-domain a {
  cursor: pointer;
  color: #2c3e50;
}
.title-domain {
  cursor: pointer;
  text-align: start;
  margin-left: 12%;
  margin-bottom: 20px !important;
}
@media only screen and (min-width: 0px) and(max-width:600px) {
}
</style>