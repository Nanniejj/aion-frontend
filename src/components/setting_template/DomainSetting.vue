<template>
  <div class="ml-lg-5 mr-lg-5 ml-md-3 mr-md-3 ml-sm-3 mr-sm-3">
    <div class="prt h3">Domain List</div>
    <b-row cols="2" cols-sm="2" cols-md="3" cols-lg="4" class="m-auto">
      <b-col v-for="(domain, k) in getDomainSetting" :key="k">
        <span
          id="box-domain"
          class="mt-3 mb-3 h5"
          @click="toDomainStat(domain)"
        >
          <vue-element-loading
            :active="getLoadStatus"
            size="80"
            background-color="rgba(255, 255, 255, 0.8)"
            color="#b6ac9a"
          />
          {{ domain.name }}
        </span>
      </b-col>
      <b-col>
        <span id="box-domain" class="mt-3 mb-3" @click="toTemplate"
          ><i class="fas fa-plus fa-2x"></i
        ></span>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import VueElementLoading from "vue-element-loading";
export default {
  components: {
    VueElementLoading,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getDomainSetting", "getLoadStatus"]),
  },
  methods: {
    toTemplate() {
      this.$router.push({
        name: "TemplateSetting",
      });
    },
    toDomainStat(domain) {
      console.log(domain);
      localStorage.setItem("updated_until", domain.updated_until);
      this.$store.commit("setPushDomainStat", true);
      this.$store.commit("setClickDomain", domain.name);
    },
  },
  mounted() {
    this.$store.dispatch("apiDomainSetting");

    // let obj = {
    //   _id: ObjectId("6049b05556b7043831ba8d79"),
    //   uid: "https://www.khaosod.co.th/politics/news_7971892",
    //   account_name: "khaosod",
    //   comments: null,
    //   comments_count: null,
    //   retweets_count: null,
    //   date: ISODate("2023-11-20T11:51:00.000Z"),
    //   engagement: null,
    //   full_text:
    //     "บิ๊กดุง มีข่าวดี กู้เรือหลวงสุโขทัย ชี้เลือกบริษัทกู้เรืออยู่ในขั้นตอนสุดท้าย คาดหากเป็นไปได้จะนำเรือขึ้นมาช่วง มี.ค.-เม.ย.67 เมื่อวันที่ 20 พ.ย.2566 ที่กองบัญชาการกองทัพเรือ (บก.ทร.) พล.ร.อ.อะดุง พันธุ์เอี่ยม ผบ.ทร. กล่าวถึงความคืบหน้าการกู้เรือหลวงสุโขทัยที่อับปางในวันที่ 18 ธ.ค.2565 ว่า เป็นขั้นตอนที่ยากมาก เพราะเรือหลวงสุโขทัยจมที่ความลึก 50 เมตร ซึ่งการจะนำเรือรบที่มีความลึกในระดับ 50 เมตรขึ้นมาทั้งลำ และต้องอยู่ในสภาพที่สมบรูณ์ที่สุด ไม่ใช่เรื่องง่าย “กองทัพเรือต้องการนำเรือขึ้น มาในสภาพสมบูรณ์ที่สุด เพราะเป็นวัตถุพยาน เพื่อนำมาปิดคดี ดังนั้น บริษัทที่เข้าประมูล ต้องมีใบอนุญาตต่างๆ มากมาย ซึ่งขณะนี้น่าจะได้คำตอบที่ดี” ผบ.ทร. กล่าว ผบ.ทร. กล่าวอีกว่า หากเป็นไปตามไทม์ไลน์ คาดว่าจะเสนอให้ผบ.ทสส. อนุมัติ จัดจ้างบริษัทที่จะทำการกู้เรือ ในช่วงเดือนธ.ค.นี้ และจะเริ่มกระบวนการกู้เรือต่อไป หากสิ่งศักดิ์สิทธิ์มีจริง ขอให้เรือหลวงสุโขทัยขึ้นมาในช่วงต้นปีหน้า ช่วงเดือนมี.ค.-เม.ย.67 ทั้งนี้ หลังจากนำเรือขึ้นมาแล้วจะดำเนินการอย่างไรต่อนั้น กองทัพเรือจะพิจารณาในขั้นตอนต่อไป เมื่อถามว่ามีความคืบหน้าขั้นตอนการประมูลของบริษัทที่จะมากู้เรือนั้น ผบ.ทร. กล่าวว่า ใกล้เสร็จสิ้นแล้ว เหลือเพียงขั้นตอนสุดท้าย ส่วนการสอบสวนคดีนี้ ยืนยันต้องจบในยุคนี้ เพราะเสนาธิการทหารเรือ คนก่อนทำสำนวนไว้แล้ว ว่าเรือสุโขทัยประสบอุบัติเหตุในจุดใดบ้างของเรือ เมื่อนำเรือขึ้นมาแล้วจะตอบโจทย์ ตามข้อสันนิษฐานในสำนวนคดี ถ้าใช่ตรงตามนั้นก็เป็นอันว่าจบ และจะทราบว่าเรือจมเพราะอะไร",
    //   likes_count: null,
    //   person: [],
    //   photos: ['https://www.khaosod.co.th/wpapp/uploads/2023/11/%E0%B8%97%E0%B8%A3.jpg'],
    //   post_type: "post",
    //   reaction: {
    //     like: 0,
    //     share: 0,
    //   },
    //   snapshot: "",
    //   source: "news",
    //   url_post:
    //     "https://www.khaosod.co.th/politics/news_7971892",
    //     processed: false  
    // };
  },
};
</script>
<style scoped>
#box-domain {
  width: 100%;
  height: 150px;
  padding: 20px 0px;
  border-radius: 7px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
#box-domain:hover {
  background: #fed16e;
  cursor: pointer;
}
@media only screen and (min-width: 0px) and (max-width: 600px) {
  #box-domain {
    height: 100px;
    margin: auto;
    font-size: large;
    padding: 2px;
  }
}
</style>
