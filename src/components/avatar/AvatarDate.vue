<template>
  <div>
      <b-container id="container-date" style="padding-bottom:50px">
        <b-row>
          <b-col cols="3">
            <span v-on:click="previousDay()" id="date-btn">
              <span
                class="fas fa-caret-left size md-font"
                id="pre-icon"
                style="cursor: pointer"
              ></span>
              <span
                class="break-word md-font"
                style="
                  display: table-cell;
                  vertical-align: middle;
                  cursor: pointer;
                  font-weight: bold;
                "
                id="previous"
                >{{ lastday }}</span
              >
            </span></b-col
          >
          <b-col cols="2"><hr style="border-color: black" /></b-col>
          <b-col cols="2" id="today-col">
            <span
              style="font-weight: bold"
              class="break-word md-font"
              id="today-btn"
              >{{ today }}</span
            >
            <b-form-datepicker
              class="md-font"
              id="date-icon"
              v-model="today"
              size="sm"

              button-only
              button-variant="Secondary"
              selected-variant="success"
              right
              locale="en-US"
              aria-controls="example-input"
              @context="onContext"
            ></b-form-datepicker>
          </b-col>
          <b-col cols="2" v-if="next != ''" style="border-color: black"
            ><hr
          /></b-col>
          <b-col cols="3" id="date-btn">
            <span v-on:click="nextDay()" id="next-btn">
              <span
                class="break-word md-font"
                id="next"
                :style="divChart"
                >{{ next }} </span
              >
               <span
                class="fas fa-caret-right size md-font"
                :style="divChart"
                style="cursor: pointer"
              ></span>
            </span>
          </b-col>
        </b-row>
      </b-container>
      </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    data: function() {
    return {
      divChart: {
        cursor: "pointer",
        pointerEvents: "none",
        visibility: "hidden",
        display: "table-cell",
        verticalAlign: "middle",
        fontWeight: "bold",
      },
       today: "",
      previous: "Lastweek",
      lastday: "",
      next: "",
      date: "",
      day: "",
      month: "",
      year: "",
    };
  },
  methods:{
onContext(){
     let newdate = new Date(this.today)
     newdate.setDate(newdate.getDate() + 1)
     this.next=newdate.toISOString().slice(0,10)
     newdate.setDate(newdate.getDate() -2)
     this.lastday=newdate.toISOString().slice(0,10)
     if(this.lastd == this.lastday){
        this.divChart.pointerEvents = "none";
        this.divChart.visibility = "hidden";
      }
      else{
        this.divChart.pointerEvents = "auto";
        this.divChart.visibility = "visible";
      }
    },
    nextDay(){
      let newdate = new Date(this.today)
      newdate.setDate(newdate.getDate() + 1)
      this.today = newdate.toISOString().slice(0,10)
      newdate.setDate(newdate.getDate() + 1)
      this.next = newdate.toISOString().slice(0,10)
      newdate.setDate(newdate.getDate() - 2)
      this.lastday = newdate.toISOString().slice(0,10)
      if(this.today == this.lastd){
        this.divChart.pointerEvents = "none";
        this.divChart.visibility = "hidden";
      }
      else{
        this.divChart.pointerEvents = "auto";
        this.divChart.visibility = "visible";
      }

    },
    previousDay(){
      let newdate = new Date(this.today)
      newdate.setDate(newdate.getDate() - 1)
      this.today = newdate.toISOString().slice(0,10)
      newdate.setDate(newdate.getDate() - 1)
      this.lastday = newdate.toISOString().slice(0,10)
      newdate.setDate(newdate.getDate() + 2)
      this.next = newdate.toISOString().slice(0,10)
    },
    
  },
computed: {
    ...mapGetters(["getAvatar"]),
  },
  beforeMount() {
  

    var day = new Date();
    var date = day.getDate();
    var month = day.getMonth();
    var year = day.getFullYear();
    var full = "Today " + date + "/" + (month + 1) + "/" + year;
    var date2 = new Date();
    var last3 = new Date(date2.getTime() - 1 * 24 * 60 * 60 * 1000);
    console.log(last3);
   
    // date format
    var last3_m = last3.getMonth() + 1;
    if (last3_m < 10) {
      last3_m = "0" + String(last3_m);
    }

    var last3_d = last3.getDate();
    if (last3_d < 10) {
      last3_d = "0" + String(last3_d);
    }
    this.lastday = last3.getFullYear() + "-" + last3_m + "-" + last3_d;
    // this.lastday = (last3.getFullYear())  + "-" + (last3.getMonth()+1) + "-" + (last3.getDate())

    this.date = full;
    // console.log(typeof(month))
    month = month + 1;
    if (month < 10) {
      month = "0" + String(month);
    }

    if (date < 10) {
      date = "0" + String(date);
    }
    //console.log(month);
    this.today = year + "-" + month + "-" + date;
    
    //check button hidden
    this.lastd= this.lastday;

    //console.log("lastbefore",this.lastday);
    this.day = date;
    this.month = month;
    this.year = year;
 
  },
   mounted() {
     console.log(this.today);
  this.$store.dispatch("fetchAvatar",{date:this.today});    
  },

};
</script>

<style scoped>



</style>