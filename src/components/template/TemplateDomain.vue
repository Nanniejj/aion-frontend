<template>
  <div class="container" style="width: 85%;margin: auto;">
    <vue-element-loading
      :active="getLoadStatus"
      size="80"
      background-color="rgba(255, 255, 255, 0.4)"
      color="#b6ac9a"
    />
    <div class="row">
      <div class="col-8">
        <input
          type="text"
          class="form-control md-font"
          placeholder="ค้นหา"
          id="search-input"
          v-model="filter"
        />
      </div>

      <div class="col-4" style="text-align: end;">
        <router-link to="#" target="_blank">
          <button class="btn btn-add">
            <i class="fa fa-plus" /><span style="font-size:16px;">
              เพิ่ม Domain
            </span>
          </button></router-link
        >
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>ชื่อ Domain</th>
          <th>สถานะ</th>
          <th>การจัดการ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in filteredRows" :key="`employee-${index}`">
          <td v-html="highlightMatches(row.no)"></td>
          <td
            v-html="highlightMatches(...row.employees)"
            @click="routerLinkToDetails"
            style="cursor:pointer;"
          ></td>
          <td>
            <span
              ><i class="fa fa-circle" style="color:#8cc751;" /> แสดงผล</span
            >
          </td>
          <td>
            <span
              class="fa fa-pencil"
              type="button"
              @click="routerLinkToDetails"
            >
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      link: this.$hostname + "/home/templatesetting",
      allStyle: { pointerEvents: "all" },
      searchQuery: "",
      filter: "",
      rows: [
        { no: "1", employees: ["การเมือง"] },
        {
          no: "2",
          employees: ["ชุมนุม"],
        },
        {
          no: "3",
          employees: ["สถาบัน"],
        },
      ],
    };
  },
  methods: {
    routerLinkToDetails() {
      // this.$router.push({ path:'/home/templatesetting'});
    },
    remove(index) {
      this.$confirm("คุณต้องการลบ Template ?").then(() => {
        //this.sentiment="1"
        this.rows.splice(index, 1);
      });
    },
    highlightMatches(text) {
      const matchExists = text
        .toLowerCase()
        .includes(this.filter.toLowerCase());
      if (!matchExists) return text;

      const re = new RegExp(this.filter, "ig");
      return text.replace(
        re,
        (matchedText) => `<strong>${matchedText}</strong>`
      );
    },
  },
  computed: {
    ...mapGetters(["getLoadStatus"]),
    filteredRows() {
      return this.rows.filter((row) => {
        const employees = row.employees.toString().toLowerCase();
        const no = row.no.toLowerCase();
        const searchTerm = this.filter.toLowerCase();

        return no.includes(searchTerm) || employees.includes(searchTerm);
      });
    },
  },
};
</script>

<style scoped>
.fa-plus {
  background: white;
  padding: 5px 7px;
  border-radius: 50%;
}
.fa-pencil {
  background: #ede7dd;
  padding: 10px;
  border-radius: 50%;
  box-shadow: 1px 1px 3px #666666;
}
.fa-pencil:hover {
  background: #4c412b;
  color: white;
}
#content {
  max-width: 93%;
  margin: auto;
  background: white;
  min-height: 100vh;
  padding: 0;
}
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  margin-top: 40px !important;
}

td,
th {
  border-bottom: 1px solid#504b3c9e;
  text-align: left;
  padding: 8px;
  color: #504b3c;
  padding-bottom: 15px;
  padding-top: 15px;
}

th {
  background-color: #ede7dd;
  border: none;
  color: #504b3c;
  text-align: center;
}
#content > div > table > tbody > tr:hover {
  background: #d8d3cb40;
}
#content > div > table > tbody > tr > td {
  text-align: center;
}
#content > div > table > thead > tr > th:nth-child(1) {
  border-top-left-radius: 18px;
  text-align: center;
  border-right: 3px solid white;
}
#content > div > table > thead > tr > th:nth-child(2) {
  text-align: center;
}
/* #content > div > table > thead > tr > th:nth-child(2){
   border-top-right-radius: 18px;
       text-align: center;
} */
#content > div > table > thead > tr > th:nth-child(4) {
  border-top-right-radius: 18px;
  text-align: center;
}
.form-control {
  width: 50% !important;
  border-radius: 15px;
  text-align: end;
  background-color: #dddddd9c;
}
.btn-add:hover {
  background-color: #504b3c;
  color: white;
}
.btn-add:hover .fa-plus {
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
#search-input {
  box-sizing: border-box;
  background-image: url("@/assets/search_icon.png");
  background-position: 94% 10px;
  background-repeat: no-repeat;
  padding: 7px 20px 7px 45px;
  border: none;
  text-align: center;
}

.nav {
  opacity: 0.3;
}
.nav:hover {
  opacity: 1;
}

@media only screen and (min-width: 1150px) and (max-width: 1750px) {
  .select2 {
    margin-left: -10.52%;
    margin-bottom: 10px;
    font-size: 18px;
  }
}

@media only screen and (min-width: 0) and (max-width: 1150px) {
  .select2 {
    margin-left: -10.52%;
    margin-bottom: 10px;
    font-size: 18px;
  }
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  #overflow-page {
    overflow: hidden;
  }
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  #overflow-page {
    overflow: hidden;
  }
  #search-input {
    background-position: 13px 6px;
  }
  #page {
    margin-bottom: 50px !important;
  }
}
</style>
