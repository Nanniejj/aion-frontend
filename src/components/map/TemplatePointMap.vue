<template>
  <div>
    <b-row>
      <b-col lg="12">
        <section id="date-picker" class="mt-3 mb-3">
          เลือกวันที่
          <date-picker
            v-model="valueDate"
            type="date"
            placeholder=""
            range
            size="md"
            value-type="format"
            format="YYYY-MM-DD"
            :disabled-date="(date) => date >= new Date()"
            @change="selectData()"
          ></date-picker>
        </section> </b-col
    ></b-row>
    <b-row>
      <b-col lg="12">
        <l-map style="height: 600px" :zoom="zoom" :center="center">
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
          <l-marker
            :lat-lng="[13.7278956, 100.524123499999]"
            @click="showAlert('กรุงเทพมหานคร')"
            ><l-popup>กรุงเทพมหานคร</l-popup
            ><l-tooltip>กรุงเทพมหานคร</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[8.0862997, 98.9062834999999]"
            @click="showAlert('กระบี่')"
            ><l-popup>กระบี่</l-popup><l-tooltip>กระบี่</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[14.0227797, 99.5328114999999]"
            @click="showAlert('กาญจนบุรี')"
            ><l-popup>กาญจนบุรี</l-popup
            ><l-tooltip>กาญจนบุรี</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[16.4314078, 103.5058755]"
            @click="showAlert('กาฬสินธุ์')"
            ><l-popup>กาฬสินธุ์</l-popup
            ><l-tooltip>กาฬสินธุ์</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[16.4827798, 99.5226617999999]"
            @click="showAlert('กำแพงเพชร')"
            ><l-popup>กำแพงเพชร</l-popup
            ><l-tooltip>กำแพงเพชร</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[16.4419355, 102.8359921]"
            @click="showAlert('ขอนแก่น')"
            ><l-popup>ขอนแก่น</l-popup><l-tooltip>ขอนแก่น</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[12.61134, 102.103854599999]"
            @click="showAlert('จันทบุรี')"
            ><l-popup>จันทบุรี</l-popup
            ><l-tooltip>จันทบุรี</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[13.6904194, 101.077959599999]"
            @click="showAlert('ฉะเชิงเทรา')"
            ><l-popup>ฉะเชิงเทรา</l-popup
            ><l-tooltip>ฉะเชิงเทรา</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[13.3611431, 100.9846717]"
            @click="showAlert('ชลบุรี')"
            ><l-popup>ชลบุรี</l-popup><l-tooltip>ชลบุรี</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[15.1851971, 100.125125]"
            @click="showAlert('ชัยนาท')"
            ><l-popup>ชัยนาท</l-popup><l-tooltip>ชัยนาท</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[15.8068173, 102.0315027]"
            @click="showAlert('ชัยภูมิ')"
            ><l-popup>ชัยภูมิ</l-popup><l-tooltip>ชัยภูมิ</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[10.4930496, 99.1800198999999]"
            @click="showAlert('ชุมพร')"
            ><l-popup>ชุมพร</l-popup><l-tooltip>ชุมพร</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[19.9071656, 99.830955]"
            @click="showAlert('เชียงราย')"
            ><l-popup>เชียงราย</l-popup
            ><l-tooltip>เชียงราย</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[18.7877477, 98.9931311]"
            @click="showAlert('เชียงใหม่')"
            ><l-popup>เชียงใหม่</l-popup
            ><l-tooltip>เชียงใหม่</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[7.5593851, 99.6110065]"
            @click="showAlert('ตรัง')"
            ><l-popup>ตรัง</l-popup><l-tooltip>ตรัง</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[12.2427563, 102.517473399999]"
            @click="showAlert('ตราด')"
            ><l-popup>ตราด</l-popup><l-tooltip>ตราด</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[16.8839901, 99.1258497999999]"
            @click="showAlert('ตาก')"
            ><l-popup>ตาก</l-popup><l-tooltip>ตาก</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[14.2069466, 101.2130511]"
            @click="showAlert('นครนายก')"
            ><l-popup>นครนายก</l-popup><l-tooltip>นครนายก</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[13.8199206, 100.0621676]"
            @click="showAlert('นครปฐม')"
            ><l-popup>นครปฐม</l-popup><l-tooltip>นครปฐม</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[17.392039, 104.769550799999]"
            @click="showAlert('นครพนม')"
            ><l-popup>นครพนม</l-popup><l-tooltip>นครพนม</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[14.9798997, 102.097769299999]"
            @click="showAlert('นคราชสีมา')"
            ><l-popup>นคราชสีมา</l-popup
            ><l-tooltip>นคราชสีมา</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[8.4303975, 99.9631219]"
            @click="showAlert('นครศรีธรรมราช')"
            ><l-popup>นครศรีธรรมราช</l-popup
            ><l-tooltip>นครศรีธรรมราช</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[15.6930072, 100.122559499999]"
            @click="showAlert('นครสวรรค์')"
            ><l-popup>นครสวรรค์</l-popup
            ><l-tooltip>นครสวรรค์</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[13.8621125, 100.514352799999]"
            @click="showAlert('นนทบุรี')"
            ><l-popup>นนทบุรี</l-popup><l-tooltip>นนทบุรี</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[6.4254607, 101.825314299999]"
            @click="showAlert('นราธิวาส')"
            ><l-popup>นราธิวาส</l-popup
            ><l-tooltip>นราธิวาส</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[18.7756318, 100.7730417]"
            @click="showAlert('น่าน')"
            ><l-popup>น่าน</l-popup><l-tooltip>น่าน</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[14.9930017, 103.1029191]"
            @click="showAlert('บุรีรัมย์')"
            ><l-popup>บุรีรัมย์</l-popup
            ><l-tooltip>บุรีรัมย์</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[14.0208391, 100.525027599999]"
            @click="showAlert('ปทุมธานี')"
            ><l-popup>ปทุมธานี</l-popup
            ><l-tooltip>ปทุมธานี</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[11.812367, 99.7973270999999]"
            @click="showAlert('ประจวบคีรีขันธ์')"
            ><l-popup>ประจวบคีรีขันธ์</l-popup
            ><l-tooltip>ประจวบคีรีขันธ์</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[14.0509704, 101.372743899999]"
            @click="showAlert('ปราจีนบุรี')"
            ><l-popup>ปราจีนบุรี</l-popup
            ><l-tooltip>ปราจีนบุรี</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[6.86948439999999, 101.250482599999]"
            @click="showAlert('ปัตตานี')"
            ><l-popup>ปัตตานี</l-popup><l-tooltip>ปัตตานี</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[14.3532128, 100.568959899999]"
            @click="showAlert('พระนครศรีอยุธยา')"
            ><l-popup>พระนครศรีอยุธยา</l-popup
            ><l-tooltip>พระนครศรีอยุธยา</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[19.1664789, 99.9019419]"
            @click="showAlert('พะเยา')"
            ><l-popup>พะเยา</l-popup><l-tooltip>พะเยา</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[8.4407456, 98.5193031999999]"
            @click="showAlert('พังงา')"
            ><l-popup>พังงา</l-popup><l-tooltip>พังงา</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[7.6166823, 100.074023099999]"
            @click="showAlert('พัทลุง')"
            ><l-popup>พัทลุง</l-popup><l-tooltip>พัทลุง</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[16.4429516, 100.348232899999]"
            @click="showAlert('พิจิตร')"
            ><l-popup>พิจิตร</l-popup><l-tooltip>พิจิตร</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[16.8298048, 100.2614915]"
            @click="showAlert('พิษณุโลก')"
            ><l-popup>พิษณุโลก</l-popup
            ><l-tooltip>พิษณุโลก</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[13.1111601, 99.9391306999999]"
            @click="showAlert('เพชรบุรี')"
            ><l-popup>เพชรบุรี</l-popup
            ><l-tooltip>เพชรบุรี</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[16.4189807, 101.155092599999]"
            @click="showAlert('เพชรบูรณ์')"
            ><l-popup>เพชรบูรณ์</l-popup
            ><l-tooltip>เพชรบูรณ์</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[18.1445774, 100.1402831]"
            @click="showAlert('แพร่')"
            ><l-popup>แพร่</l-popup><l-tooltip>แพร่</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[7.9810496, 98.3638823999999]"
            @click="showAlert('ภูเก็ต')"
            ><l-popup>ภูเก็ต</l-popup><l-tooltip>ภูเก็ต</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[16.1850896, 103.302646099999]"
            @click="showAlert('มหาสารคาม')"
            ><l-popup>มหาสารคาม</l-popup
            ><l-tooltip>มหาสารคาม</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[16.542443, 104.720915099999]"
            @click="showAlert('มุกดาหาร')"
            ><l-popup>มุกดาหาร</l-popup
            ><l-tooltip>มุกดาหาร</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[19.2990643, 97.9656225999999]"
            @click="showAlert('แม่ฮ่องสอน')"
            ><l-popup>แม่ฮ่องสอน</l-popup
            ><l-tooltip>แม่ฮ่องสอน</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[15.792641, 104.1452827]"
            @click="showAlert('ยโสธร')"
            ><l-popup>ยโสธร</l-popup><l-tooltip>ยโสธร</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[6.541147, 101.280394699999]"
            @click="showAlert('ยะลา')"
            ><l-popup>ยะลา</l-popup><l-tooltip>ยะลา</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[16.0538196, 103.652003599999]"
            @click="showAlert('ร้อยเอ็ด')"
            ><l-popup>ร้อยเอ็ด</l-popup
            ><l-tooltip>ร้อยเอ็ด</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[9.9528702, 98.6084640999999]"
            @click="showAlert('ระนอง')"
            ><l-popup>ระนอง</l-popup><l-tooltip>ระนอง</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[12.6833115, 101.237429499999]"
            @click="showAlert('ระยอง')"
            ><l-popup>ระยอง</l-popup><l-tooltip>ระยอง</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[13.5282893, 99.8134211]"
            @click="showAlert('ราชบุรี')"
            ><l-popup>ราชบุรี</l-popup><l-tooltip>ราชบุรี</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[14.7995081, 100.6533706]"
            @click="showAlert('ลพบุรี')"
            ><l-popup>ลพบุรี</l-popup><l-tooltip>ลพบุรี</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[18.2888404, 99.4908739999999]"
            @click="showAlert('ลำปาง')"
            ><l-popup>ลำปาง</l-popup><l-tooltip>ลำปาง</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[18.5744606, 99.0087221]"
            @click="showAlert('ลำพูน')"
            ><l-popup>ลำพูน</l-popup><l-tooltip>ลำพูน</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[17.4860232, 101.7223002]"
            @click="showAlert('เลย')"
            ><l-popup>เลย</l-popup><l-tooltip>เลย</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[15.1186009, 104.322009499999]"
            @click="showAlert('ศรีสะเกษ')"
            ><l-popup>ศรีสะเกษ</l-popup
            ><l-tooltip>ศรีสะเกษ</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[17.1545995, 104.1348365]"
            @click="showAlert('สกลนคร')"
            ><l-popup>สกลนคร</l-popup><l-tooltip>สกลนคร</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[7.1756004, 100.614346999999]"
            @click="showAlert('สงขลา')"
            ><l-popup>สงขลา</l-popup><l-tooltip>สงขลา</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[6.6238158, 100.0673744]"
            @click="showAlert('สตูล')"
            ><l-popup>สตูล</l-popup><l-tooltip>สตูล</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[13.5990961, 100.5998319]"
            @click="showAlert('สมุทรปราการ')"
            ><l-popup>สมุทรปราการ</l-popup
            ><l-tooltip>สมุทรปราการ</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[13.4098217, 100.0022645]"
            @click="showAlert('สมุทรสงคราม')"
            ><l-popup>สมุทรสงคราม</l-popup
            ><l-tooltip>สมุทรสงคราม</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[13.5475216, 100.274395599999]"
            @click="showAlert('สมุทรสาคร')"
            ><l-popup>สมุทรสาคร</l-popup
            ><l-tooltip>สมุทรสาคร</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[13.824038, 102.0645839]"
            @click="showAlert('สระแก้ว')"
            ><l-popup>สระแก้ว</l-popup><l-tooltip>สระแก้ว</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[14.5289154, 100.9101421]"
            @click="showAlert('สระบุรี')"
            ><l-popup>สระบุรี</l-popup><l-tooltip>สระบุรี</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[14.8936253, 100.3967314]"
            @click="showAlert('สิงห์บุรี')"
            ><l-popup>สิงห์บุรี</l-popup
            ><l-tooltip>สิงห์บุรี</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[17.0055573, 99.8263712]"
            @click="showAlert('สุโขทัย')"
            ><l-popup>สุโขทัย</l-popup><l-tooltip>สุโขทัย</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[14.4744892, 100.117712799999]"
            @click="showAlert('สุพรรณบุรี')"
            ><l-popup>สุพรรณบุรี</l-popup
            ><l-tooltip>สุพรรณบุรี</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[9.1382389, 99.3217482999999]"
            @click="showAlert('สุราษฎร์ธานี')"
            ><l-popup>สุราษฎร์ธานี</l-popup
            ><l-tooltip>สุราษฎร์ธานี</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[14.882905, 103.4937107]"
            @click="showAlert('สุรินทร์')"
            ><l-popup>สุรินทร์</l-popup
            ><l-tooltip>สุรินทร์</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[17.8782803, 102.7412638]"
            @click="showAlert('หนองคาย')"
            ><l-popup>หนองคาย</l-popup><l-tooltip>หนองคาย</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[17.2218247, 102.4260368]"
            @click="showAlert('หนองบัวลำภู')"
            ><l-popup>หนองบัวลำภู</l-popup
            ><l-tooltip>หนองบัวลำภู</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[14.5896054, 100.455052]"
            @click="showAlert('อ่างทอง')"
            ><l-popup>อ่างทอง</l-popup><l-tooltip>อ่างทอง</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[15.8656783, 104.6257774]"
            @click="showAlert('อำนาจเจริญ')"
            ><l-popup>อำนาจเจริญ</l-popup
            ><l-tooltip>อำนาจเจริญ</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[17.4138413, 102.7872325]"
            @click="showAlert('อุดรธานี')"
            ><l-popup>อุดรธานี</l-popup
            ><l-tooltip>อุดรธานี</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[17.6200886, 100.0992942]"
            @click="showAlert('อุตรดิตถ์')"
            ><l-popup>อุตรดิตถ์</l-popup
            ><l-tooltip>อุตรดิตถ์</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[15.3835001, 100.024552699999]"
            @click="showAlert('อุทัยธานี')"
            ><l-popup>อุทัยธานี</l-popup
            ><l-tooltip>อุทัยธานี</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[15.2286861, 104.8564217]"
            @click="showAlert('อุบลราชธานี')"
            ><l-popup>อุบลราชธานี</l-popup
            ><l-tooltip>อุบลราชธานี</l-tooltip></l-marker
          >
          <l-marker
            :lat-lng="[18.3609104, 103.646446299999]"
            @click="showAlert('บึงกาฬ')"
            ><l-popup>บึงกาฬ</l-popup><l-tooltip>บึงกาฬ</l-tooltip></l-marker
          >
        </l-map></b-col
      ></b-row
    >
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from "vue2-leaflet";
import moment from "moment";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip,
  },
  data() {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 6,
      center: [13.7278956, 100.52412349999997],
      markerLatLng: [13.7278956, 100.52412349999997],
      valueDate: [
        moment(new Date())
          .subtract(7, "d")
          .format()
          .slice(0, 10) + "T00:00:00.000Z",
        moment(new Date())
          .format()
          .slice(0, 10) + "T23:59:59.000Z",
      ],
      country_select_name: "",
    };
  },
  methods: {
    selectData() {
      console.log(this.valueDate[0], this.valueDate[1]);
      if (this.valueDate[0] == null) {
        var todaye =
          moment(new Date())
            .format()
            .slice(0, 10) + "T23:59:59.000Z";
        var todayend = new Date(todaye);
        todayend.setDate(todayend.getDate() - 6);
        this.start_date =
          moment(todayend)
            .format()
            .slice(0, 10) + "T00:00:00.000Z";
        this.end_date =
          moment(new Date())
            .format()
            .slice(0, 10) + "T23:59:59.000Z";

        //  var todaye = moment(new Date()).format().slice(0, 10) + "T23:59:59";
        // var todayend = new Date(todaye);
        // todayend.setDate(todayend.getDate() - 6);
        // var todays = moment(todayend).format().slice(0, 10) + "T00:00:00";
      } else {
        this.start_date = this.valueDate[0] + "T00:00:00.000Z";
        this.end_date = this.valueDate[1] + "T23:59:59.000Z";
      }

      this.$store.dispatch("fetchMapWithDatePostList", {
        country_name: this.country_select_name,
        startdate: this.start_date,
        enddate: this.end_date,
      });
    },
    showAlert(x) {
      // alert("Click!"+x+"  "+JSON.stringify(this.getMapPostList));
      // alert("start date="+this.valueDate[0])
      // alert("end date="+this.valueDate[1])
      if (this.valueDate[0] == null) {
        var todaye = moment(new Date())
          .format()
          .slice(0, 10);
        var todayend = new Date(todaye);
        todayend.setDate(todayend.getDate() - 6);
        this.start_date = moment(todayend)
          .format()
          .slice(0, 10);
        this.end_date = moment(new Date())
          .format()
          .slice(0, 10);
      } else {
        this.start_date = this.valueDate[0];
        this.end_date = this.valueDate[1];
      }
      this.country_select_name = x;
      this.$store.dispatch("fetchMapWithDatePostList", {
        country_name: this.country_select_name,
        startdate: this.start_date,
        enddate: this.end_date,
      });
    },
  },
  created() {
    this.country_select_name = "กรุงเทพมหานคร";
    this.$store.dispatch("fetchMapWithDatePostList", {
      country_name: this.country_select_name,
      startdate: this.valueDate[0],
      enddate: this.valueDate[1],
    });
  },
  computed: {
    ...mapGetters(["getMapPostList"]),
  },
};
</script>
