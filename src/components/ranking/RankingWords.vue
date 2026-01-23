<template>
    <div class="my-3 box-spot-bg py-3">
        <b-row class="align-items-center px-3">
            <b-col  md>
                <div class="text-left">
                    <span class="h4 mr-3 d-inline-block bold mb-0">TOP 10</span>
                    <span class="small text-grey">(จำนวนครั้งที่พบ)</span>
                </div>
            </b-col>
            <b-col cols="12" md="auto" class="pt-2 pt-md-0">
                <b-button-group size="sm" class="w-100">
                <b-button
                    v-for="m in modes"
                    :key="m.value"
                    :variant="mode === m.value ? 'info' : 'outline-info'"
                    @click="mode = m.value"
                >
                    {{ m.label }}
                </b-button>
            </b-button-group>
            </b-col>
        </b-row>
        <b-row class="px-3 mt-3 mx-0">
            <b-col cols="12" md="4" class="px-0 pb-3 px-md-2 pb-md-0">
                <div class="text-left h6 bold">หัวเรื่อง <span class="small">(Domain)</span></div>
                <TopWordCard :items="domains" type="domain" :mode="mode" @select-item="onSelectItem"/>
            </b-col>

            <b-col cols="12" md="4" class="px-0 px-md-2">
                <div class="text-left h6 bold">หมวดหมู่ <span class="small">(Subdomain)</span></div>
                <TopWordCard :items="subdomains" type="subdomain" :mode="mode" @select-item="onSelectItem"/>
            </b-col>

            <b-col cols="12" md="4" class="px-0 px-md-2">
                <div class="text-left h6 bold">ประเด็น <span class="small">(Object)</span></div>
                <TopWordCard :items="objects" type="object" :mode="mode" @select-item="onSelectItem"/>
            </b-col>
        </b-row>
        <!-- {{ selectedWord }} -->
    </div>
</template>
<script>
import TopWordCard from "./TopWordCard.vue";
export default {
    components: { TopWordCard },
    props: {
        domains: {
            type: Array,
            required: true,
        },
        subdomains: {
            type: Array,
            required: true,
        },
        objects: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            selectedWord: null,
            mode: "post",
            modes: [
                { value: "post", label: "Posts" },
                { value: "sentiment", label: "Sentiments" },
                { value: "platform", label: "Platforms" },
            ],
            // domains: [{ "domain_id": 1, "domain_name": "การเมือง", "count": 57467, "positive": 22948, "neutral": 22023, "negative": 12496, "platform": { "instagram": 2389, "tiktok": 3988, "blockdit": 468, "facebook": 24577, "youtube": 3779, "pantip": 335, "news": 7358, "twitter": 14391, "threads": 182 } }, { "domain_id": 4, "domain_name": "กองทัพบก", "count": 9811, "positive": 3599, "neutral": 3654, "negative": 2558, "platform": { "facebook": 4857, "instagram": 316, "tiktok": 469, "twitter": 1909, "youtube": 466, "pantip": 134, "threads": 11, "news": 1540, "blockdit": 109 } }, { "domain_id": 2, "domain_name": "สถาบัน", "count": 7530, "positive": 3476, "neutral": 2762, "negative": 1292, "platform": { "threads": 27, "twitter": 1572, "youtube": 763, "pantip": 28, "tiktok": 496, "blockdit": 87, "facebook": 3715, "instagram": 190, "news": 652 } }],
            // subdomains: [{ "domain_id": 1, "domain_name": "การเมือง", "subdomain_id": 2, "name": "พรรคการเมือง", "count": 40692, "positive": 17900, "neutral": 13905, "negative": 8887, "platform": { "youtube": 3084, "threads": 125, "news": 3097, "facebook": 17923, "tiktok": 3159, "twitter": 11296, "pantip": 133, "instagram": 1727, "blockdit": 148 } }, { "domain_id": 1, "domain_name": "การเมือง", "subdomain_id": 1, "name": "บุคคล", "count": 12305, "positive": 4750, "neutral": 4736, "negative": 2819, "platform": { "facebook": 4654, "instagram": 784, "news": 1681, "pantip": 51, "threads": 51, "tiktok": 1335, "twitter": 2773, "youtube": 939, "blockdit": 37 } }, { "domain_id": 1, "domain_name": "การเมือง", "subdomain_id": 3, "name": "นโยบายรัฐบาล", "count": 10614, "positive": 5366, "neutral": 3703, "negative": 1545, "platform": { "blockdit": 312, "threads": 27, "facebook": 4828, "youtube": 145, "news": 3192, "instagram": 498, "tiktok": 377, "twitter": 1090, "pantip": 145 } }, { "domain_id": 1, "domain_name": "การเมือง", "subdomain_id": 890, "name": "กระทรวง", "count": 9968, "positive": 3206, "neutral": 4987, "negative": 1775, "platform": { "tiktok": 797, "twitter": 899, "facebook": 3751, "instagram": 571, "youtube": 148, "threads": 26, "news": 3589, "blockdit": 115, "pantip": 72 } }, { "domain_id": 1, "domain_name": "การเมือง", "subdomain_id": 324, "name": "แคนดิเดตนายกฯ", "count": 7650, "positive": 2616, "neutral": 3019, "negative": 2015, "platform": { "youtube": 692, "tiktok": 600, "facebook": 2938, "news": 1133, "instagram": 478, "threads": 32, "blockdit": 31, "twitter": 1712, "pantip": 34 } }, { "domain_id": 1, "domain_name": "การเมือง", "subdomain_id": 4, "name": "นโยบายเร่งด่วน", "count": 7346, "positive": 2280, "neutral": 3153, "negative": 1913, "platform": { "instagram": 398, "youtube": 376, "twitter": 1424, "facebook": 3268, "news": 1366, "threads": 20, "tiktok": 377, "blockdit": 54, "pantip": 63 } }, { "domain_id": 4, "domain_name": "กองทัพบก", "subdomain_id": 20, "name": "ประเด็นเฝ้าระวัง", "count": 6336, "positive": 2078, "neutral": 1959, "negative": 2299, "platform": { "pantip": 102, "instagram": 217, "youtube": 311, "twitter": 1544, "blockdit": 94, "news": 1148, "threads": 9, "facebook": 2661, "tiktok": 250 } }, { "domain_id": 2, "domain_name": "สถาบัน", "subdomain_id": 8, "name": "ประเด็นเฝ้าระวัง", "count": 4445, "positive": 1897, "neutral": 1725, "negative": 823, "platform": { "tiktok": 364, "youtube": 448, "instagram": 94, "twitter": 863, "facebook": 2237, "threads": 11, "pantip": 13, "news": 370, "blockdit": 45 } }, { "domain_id": 2, "domain_name": "สถาบัน", "subdomain_id": 55, "name": "บุคคล", "count": 3660, "positive": 1992, "neutral": 1465, "negative": 203, "platform": { "pantip": 9, "youtube": 634, "instagram": 66, "tiktok": 344, "news": 215, "threads": 8, "blockdit": 42, "twitter": 477, "facebook": 1865 } }, { "domain_id": 2, "domain_name": "สถาบัน", "subdomain_id": 842, "name": "เทิดทูนสถาบันกษัตริย์", "count": 3176, "positive": 1960, "neutral": 896, "negative": 320, "platform": { "youtube": 282, "blockdit": 23, "pantip": 5, "instagram": 67, "news": 245, "tiktok": 184, "twitter": 604, "threads": 16, "facebook": 1750 } }, { "domain_id": 1, "domain_name": "การเมือง", "subdomain_id": 5, "name": "ประเด็นเฝ้าระวัง", "count": 3117, "positive": 1009, "neutral": 944, "negative": 1164, "platform": { "youtube": 100, "twitter": 697, "facebook": 1543, "tiktok": 131, "threads": 6, "news": 452, "instagram": 132, "blockdit": 31, "pantip": 25 } }, { "domain_id": 4, "domain_name": "กองทัพบก", "subdomain_id": 891, "name": "บุคคลสำคัญ", "count": 2700, "positive": 1355, "neutral": 1262, "negative": 83, "platform": { "youtube": 47, "threads": 2, "twitter": 212, "instagram": 90, "news": 312, "facebook": 1835, "blockdit": 4, "pantip": 3, "tiktok": 195 } }, { "domain_id": 4, "domain_name": "กองทัพบก", "subdomain_id": 19, "name": "การช่วยเหลือประชาชน", "count": 1642, "positive": 840, "neutral": 560, "negative": 242, "platform": { "instagram": 39, "twitter": 234, "tiktok": 105, "pantip": 2, "blockdit": 10, "news": 77, "facebook": 1048, "youtube": 127 } }, { "domain_id": 2, "domain_name": "สถาบัน", "subdomain_id": 1298, "name": "โครงการในพระราชดำริ", "count": 448, "positive": 298, "neutral": 141, "negative": 9, "platform": { "pantip": 1, "youtube": 9, "threads": 2, "blockdit": 10, "twitter": 27, "tiktok": 42, "instagram": 14, "news": 51, "facebook": 292 } }, { "domain_id": 4, "domain_name": "กองทัพบก", "subdomain_id": 18, "name": "ยทโธปกรณ์", "count": 444, "positive": 104, "neutral": 267, "negative": 73, "platform": { "news": 133, "tiktok": 9, "pantip": 32, "twitter": 24, "youtube": 22, "facebook": 198, "threads": 1, "blockdit": 14, "instagram": 11 } }, { "domain_id": 2, "domain_name": "สถาบัน", "subdomain_id": 809, "name": "ยกเลิก112", "count": 304, "positive": 36, "neutral": 156, "negative": 112, "platform": { "youtube": 5, "tiktok": 14, "twitter": 79, "instagram": 13, "facebook": 137, "news": 51, "blockdit": 3, "threads": 2 } }, { "domain_id": 2, "domain_name": "สถาบัน", "subdomain_id": 11, "name": "ข้าราชบริพาร", "count": 235, "positive": 33, "neutral": 154, "negative": 48, "platform": { "instagram": 18, "facebook": 94, "twitter": 32, "youtube": 21, "news": 46, "tiktok": 16, "blockdit": 3, "threads": 5 } }, { "domain_id": 2, "domain_name": "สถาบัน", "subdomain_id": 12, "name": "ทรัพย์สิน", "count": 166, "positive": 33, "neutral": 15, "negative": 118, "platform": { "news": 6, "tiktok": 6, "twitter": 61, "pantip": 3, "facebook": 83, "instagram": 1, "blockdit": 5, "youtube": 1 } }, { "domain_id": 1, "domain_name": "การเมือง", "subdomain_id": 1132, "name": "สว", "count": 130, "positive": 41, "neutral": 35, "negative": 54, "platform": { "youtube": 5, "instagram": 13, "blockdit": 2, "news": 36, "tiktok": 8, "facebook": 40, "twitter": 26 } }, { "domain_id": 2, "domain_name": "สถาบัน", "subdomain_id": 9, "name": "วันสำคัญ", "count": 94, "positive": 44, "neutral": 40, "negative": 10, "platform": { "threads": 1, "youtube": 3, "facebook": 60, "tiktok": 2, "news": 11, "twitter": 8, "blockdit": 6, "pantip": 1, "instagram": 2 } }, { "domain_id": 4, "domain_name": "กองทัพบก", "subdomain_id": 807, "name": "ปฎิรูปกองทัพ", "count": 74, "positive": 33, "neutral": 17, "negative": 24, "platform": { "tiktok": 1, "facebook": 28, "blockdit": 2, "instagram": 2, "pantip": 1, "youtube": 2, "twitter": 29, "news": 9 } }, { "domain_id": 2, "domain_name": "สถาบัน", "subdomain_id": 13, "name": "หน่วยงานในสังกัด-ขึ้นตรง", "count": 53, "positive": 9, "neutral": 42, "negative": 2, "platform": { "facebook": 31, "blockdit": 8, "tiktok": 12, "instagram": 1, "twitter": 1 } }],
            // objects: [
            //     {
            //         "object_id": 7120, "name": "พรรคประชาชน", "domain_id": 1, "domain_name": "การเมือง", "subdomain_id": 2, "subdomain_name": "พรรคการเมือง", "count": 15326, "positive": 5727, "neutral": 5237, "negative": 4362, "platform": { "youtube": 786, "facebook": 7031, "tiktok": 1108, "threads": 40, "twitter": 5003, "news": 754, "instagram": 516, "blockdit": 24, "pantip": 64 }
            //     },
            //     {
            //         "object_id": 55, "name": "พรรคเพื่อไทย", "domain_id": 1, "domain_name": "การเมือง", "subdomain_id": 2, "subdomain_name": "พรรคการเมือง", "count": 11612, "positive": 5147, "neutral": 4210, "negative": 2255, "platform": { "news": 838, "threads": 37, "pantip": 31, "blockdit": 37, "instagram": 549, "twitter": 3787, "facebook": 4266, "youtube": 1131, "tiktok": 936 }
            //     },
            //     {
            //         "object_id": 54, "name": "พรรคภูมิใจไทย", "domain_id": 1, "domain_name": "การเมือง", "subdomain_id": 2, "subdomain_name": "พรรคการเมือง", "count": 9134, "positive": 3314, "neutral": 3797, "negative": 2023, "platform": { "threads": 35, "pantip": 33, "tiktok": 723, "youtube": 825, "instagram": 528, "blockdit": 43, "twitter": 2018, "news": 1278, "facebook": 3651 }
            //     },
            //     {
            //         "object_id": 68, "name": "พัฒนาเศรษฐกิจ", "domain_id": 1, "domain_name": "การเมือง", "subdomain_id": 3, "subdomain_name": "นโยบายรัฐบาล", "count": 6897, "positive": 3883, "neutral": 2051, "negative": 963, "platform": { "pantip": 102, "facebook": 2963, "youtube": 73, "news": 2339, "threads": 10, "instagram": 353, "twitter": 547, "blockdit": 265, "tiktok": 245 }
            //     },
            //     {
            //         "object_id": 6824, "name": "ท่องเที่ยวทั่วไป", "domain_id": 32, "domain_name": "การท่องเที่ยวประเทศไทย", "subdomain_id": 106, "subdomain_name": "กระแสการท่องเที่ยวในประเทศ", "count": 4983, "positive": 1834, "neutral": 2425, "negative": 724, "platform": { "blockdit": 91, "youtube": 236, "news": 899, "pantip": 65, "threads": 22, "tiktok": 330, "instagram": 270, "twitter": 525, "facebook": 2545 }
            //     },
            //     {
            //         "object_id": 1440, "name": "อนุทิน ชาญวีรกูล", "domain_id": 1, "domain_name": "การเมือง", "subdomain_id": 324, "subdomain_name": "แคนดิเดตนายกฯ", "count": 4698, "positive": 1309, "neutral": 2011, "negative": 1378, "platform": { "pantip": 9, "news": 797, "tiktok": 341, "youtube": 575, "instagram": 301, "blockdit": 17, "twitter": 1169, "facebook": 1462, "threads": 27 }
            //     },
            //     {
            //         "object_id": 549, "name": "เลือกตั้ง", "domain_id": 1, "domain_name": "การเมือง", "subdomain_id": 4, "subdomain_name": "นโยบายเร่งด่วน", "count": 4529, "positive": 838, "neutral": 2212, "negative": 1479, "platform": { "instagram": 235, "facebook": 1820, "tiktok": 272, "twitter": 1007, "youtube": 296, "news": 846, "pantip": 18, "threads": 13, "blockdit": 22 }
            //     },
            //     {
            //         "object_id": 59, "name": "พรรคประชาธิปัตย์", "domain_id": 1, "domain_name": "การเมือง", "subdomain_id": 2, "subdomain_name": "พรรคการเมือง", "count": 3405, "positive": 1542, "neutral": 1389, "negative": 474, "platform": { "pantip": 19, "youtube": 170, "tiktok": 162, "blockdit": 9, "news": 438, "threads": 11, "twitter": 518, "facebook": 1864, "instagram": 214 }
            //     },
            //     {
            //         "object_id": 57, "name": "พรรคก้าวไกล", "domain_id": 1, "domain_name": "การเมือง", "subdomain_id": 2, "subdomain_name": "พรรคการเมือง", "count": 3193, "positive": 1451, "neutral": 953, "negative": 789, "platform": { "blockdit": 18, "pantip": 40, "threads": 1, "news": 386, "tiktok": 155, "instagram": 137, "twitter": 841, "facebook": 1489, "youtube": 126 }
            //     },
            //     {
            //         "object_id": 7121, "name": "พรรคกล้าธรรม", "domain_id": 1, "domain_name": "การเมือง", "subdomain_id": 2, "subdomain_name": "พรรคการเมือง", "count": 3186, "positive": 1346, "neutral": 1332, "negative": 508, "platform": { "twitter": 515, "news": 453, "facebook": 1554, "blockdit": 8, "threads": 10, "instagram": 201, "youtube": 166, "pantip": 26, "tiktok": 253 }
            //     }
            // ],

        };
    },
    methods: {
        onSelectItem(item) {
           console.log(item);
           this.selectedWord = item;
        },
    },
}
</script>
<style scoped>
.box-spot-bg {
    background: linear-gradient(to top, #b8d3d3a4, #eadff8);
    border-radius: 11px;
    border: 0px;
    margin-bottom: 10px;
    min-height: 75px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
</style>