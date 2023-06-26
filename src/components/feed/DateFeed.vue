<template>
  <div>
    <span id="box-date" class="text-lg-right">
      <b-row>
        <b-col lg="12">
          <b-form-radio-group
            v-model="selected"
            :options="options"
            class="mb-3 d-inline mi"
            value-field="item"
            text-field="name"
            disabled-field="notEnabled"
          ></b-form-radio-group>

          <date-picker
            v-model="valueDate"
            type="date"
            range
            placeholder="เลือกช่วงเวลา"
            size="md"
            :disabled-date="(date) => date >= new Date()"
            value-type="format"
            format="YYYY-MM-DD"
            @change="selectData()"
            >{{ valueDate }}</date-picker
          >
        </b-col>
      </b-row>
    </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  watch: {
    selected() {
      this.selectData();
    },
  },
  computed: {
    ...mapGetters(["getSdateFeed", "getEdateFeed", "setStatusFeed"]),
  },
  data() {
    return {
      start_date: "",
      end_date: "",
      valueDate: [
        moment(new Date())
          .format()
          .slice(0, 10),
        moment(new Date())
          .format()
          .slice(0, 10),
      ],
      selected: true,
      options: [
        { item: true, name: "วันที่ระบบเก็บโพสต์" },
        { item: "", name: "วันที่โพสต์" },
      ],
    };
  },
  methods: {
    selectData() {
      //console.log(this.valueDate[0], this.valueDate[1]);
      if (this.valueDate[0] == null) {
        this.start_date =
          moment(new Date())
            .format()
            .slice(0, 10) + "T00:00:00";
        this.end_date =
          moment(new Date())
            .format()
            .slice(0, 10) + "T23:59:59";
      } else {
        this.start_date = this.valueDate[0] + "T00:00:00";
        this.end_date = this.valueDate[1] + "T23:59:59";
      }

      this.$store.commit("setSdateFeed", this.start_date);
      this.$store.commit("setEdateFeed", this.end_date);
      this.$store.commit("setArrFeed", this.valueDate);
      this.$store.commit("setStatusFeed", this.selected);

      this.$store.dispatch("fetchWordCloud", {
        domain: "all",
        monitor: true,
        start_date: this.start_date,
        end_date: this.end_date,
        dashboard: this.selected,
      });
    },
  },
  created() {
    let s =
      moment(new Date())
        .format()
        .slice(0, 10) + "T00:00:00";
    let e =
      moment(new Date())
        .format()
        .slice(0, 10) + "T23:59:59";
    this.$store.commit("setSdateFeed", s);
    this.$store.commit("setEdateFeed", e);
    this.$store.commit("setStatusFeed", this.selected);
  },
};
</script>

<style scoped>
.mx-input:hover,
.mx-input:focus {
  border-color: #fed16e !important;
}
#box-date {
  width: 100%;
  height: auto;
  border-radius: 7px;
  /* box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%); */
  display: block;
}
</style>
