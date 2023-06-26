<template>
  <div id="overflow-page">
    <HomeNav id="navHome" />
     <vue-element-loading :active="getLoadStatus" :is-full-screen="true" size='80' 
    background-color='rgba(0, 0, 0, 0.3)' color='#fff' spinner="bar-fade-scale" />
    <div id="content">
      <h1 class="title">Relation Post</h1>
      <b-col sm="12" md="12" lg="12">
          <b-row align-h="center">
            <b-col align-self="center">
              <div class="select2 md-font" style="text-align: center">
                เลือกช่องการค้นหา
              </div>
            </b-col> 
          </b-row>
          <b-row align-h="center" style="margin-top:1em">
            <b-col cols="2" align-self="center">
              <a v-on:click="twitter()" id="img-twitter" class="navp" style="cursor: pointer;"><img src="../assets/Twitter.png" class="imgsocial"></a>
            </b-col>
          </b-row>
          <div class="row justify-content-center">
            <button type="button" class="btn btn-default" @click="reloadData">
              <span id="submit" class="md-font">Reload Data</span>
            </button>
          </div>
        </b-col>
        <GetRelationLink/>
       <GetRelationList/> 
    </div>
  </div>
</template>

<script>
import HomeNav from '@/components/HomeNav.vue';
import GetRelationList from '@/components/getrelation/GetRelationList.vue';
import GetRelationLink from '@/components/getrelation/GetRelationLink.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    HomeNav,GetRelationList,GetRelationLink
    
  },
  data: function() {
    return {};
  },
  computed: {
    ...mapGetters(['getSelected',"getRelationPost",'getRelationPostLink','getLoadStatus']),
  },
  methods: { 
  reloadData(){
     this.$store.dispatch("fetchRelationPost"); 
      this.$store.dispatch("fetchRelationPostLink");   
   }
},
  created() { 
  this.$store.dispatch("fetchRelationPost"); 
  this.$store.dispatch("fetchRelationPostLink");    
  },
};
</script>

<style scoped>
.imgsocial {
    width:40px;
}
* {
  font-family: 'Prompt', 'FontAwesome', sans-serif;
}

#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
}
#navHome {
  z-index: 1;
}



.text {
  background-color: #ede7dd;
  width: 550px;
  height: 30pt;
  border-radius: 3pt;
  margin: auto;
}
.domain {
  margin-top: 20pt;
  margin-left: -31rem;
  margin-bottom: 10pt;
}

.form-control {
  margin: auto;
}

.date {
  margin-top: 20pt;
  margin-left: 39.3rem;
  margin-bottom: 10pt;
}

.dropdown-toggle {
  color: #4c412b;
  background-color: #ede7dd;
  border-color: transparent;
}

.dropdown-toggle::after {
  margin-left: 7em;
}
.btn-primary:not(:disabled):not(.disabled).active,
.btn-primary:not(:disabled):not(.disabled):active,
.show > .btn-primary.dropdown-toggle {
  color: #4c412b;
  background-color: #ede7dd;
  border-color: transparent;
}

.show > .btn-primary.dropdown-toggle:focus {
  box-shadow: none !important;
}

.btn-primary:focus {
  box-shadow: none !important;
}

.submit {
  width: 70%;
  background-color: white;
  color: gray;
  border-color: #fed16e !important;
  border-radius: 9px;
  font-weight: bold;
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  #overflow-page {
    overflow: hidden;
  }
}
@media only screen and (min-width: 950px) and (max-width: 1150px) {
  .date {
    margin-top: 20pt;
    margin-left: 11.5rem;
    margin-bottom: 10pt;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
}
</style>
