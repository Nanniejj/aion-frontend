<template>
  <div>
    <HomeNav />
    <SettingHead />
    <!-- ส่ง Subdomains ให้ SubdomainCard -->
    <SubdomainCard :subdomains="domains[0].subdomains" />
  </div>
</template>

<script>
import HomeNav from "@/components/HomeNav.vue";
import SettingHead from "@/components/setting_page/SettingHead.vue";
import SubdomainCard from "@/components/setting_page/SubdomainCard.vue";

export default {
  name: "Setting",
  components: {
    HomeNav,
    SettingHead,
    SubdomainCard,
  },
  data() {
    return {
      domains: [
        {
          // domain_id: 1,
          // domain_name: "การเมือง",
          // subdomains: [
          //   {
          //     subdomain_id: 1,
          //     subdomain_name: "บุคคล",
          //     objects: [
          //       {
          //         object_id: 2,
          //         object_name: "ประวิตร วงษ์สุวรรณ",
          //         "keywords": [
          //               "บิ๊กป้อม",
          //               "ลุงป้อม",
          //               "ป้อมจอมแอก",
          //               "ไอ้ป้อมจอมแอก",
          //               "ป้อมจอมแอ็ก",
          //               "ไอ้ป้อมจอมแอ็ก",
          //               "พลเอกประวิตร วงษ์สุวรรณ",
          //               "พล.อ. ประวิตร วงษ์สุวรรณ",
          //               "รองนายก",
          //               "รองนายกรัฐมนตรี",
          //               "ประวิตร",
          //               "นาฬิกาเพื่อน",
          //               "ประวิตร วงษ์สุวรรณ"
          //           ],
          //         and_keywords: ["ป้อม+ประวิตร"],
          //       },
          //       {
          //         object_id: 3,
          //         object_name: "สมคิด จาตุศรีพิทักษ์",
          //         keywords: ["สมคิด จาตุศรีพิทักษ์", "รองนายกฯ สมคิด"],
          //         and_keywords: [],
          //       },
                
                
          //     ],
          //   },
          // ],
        },
      ],
    };
  },
};

</script>
