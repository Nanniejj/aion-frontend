<template>
     <v-network-graph 
    :nodes="nodes"
    :edges="edges"
    :layouts="layouts"
    :configs="configs"
  >
 <defs>
      <!--
        Define the path for clipping the face image.
        To change the size of the applied node as it changes,
        add the `clipPathUnits="objectBoundingBox"` attribute
        and specify the relative size (0.0~1.0).
      -->
      <clipPath id="faceCircle" clipPathUnits="objectBoundingBox">
        <circle cx="0.5" cy="0.5" r="0.5" />
      </clipPath>
    </defs>

    <!-- Replace the node component -->
    <template #override-node="{ nodeId, scale, config, ...slotProps }">
      <!-- circle for filling background -->
      <circle
        class="face-circle"
        :r="config.radius * scale"
        fill="#ffffff"
        v-bind="slotProps"
      />
      <!--
        The base position of the <image /> is top left. The node's
        center should be (0,0), so slide it by specifying x and y.
      -->
      <image
        class="face-picture"
        :x="-config.radius * scale"
        :y="-config.radius * scale"
        :width="config.radius * scale * 2"
        :height="config.radius * scale * 2"
        :xlink:href="`${nodes[nodeId].face}`"
        clip-path="url(#faceCircle)"
      />
      <!-- circle for drawing stroke -->
      <circle
        class="face-circle"
        :r="config.radius * scale"
        fill="none"
        stroke="#808080"
        :stroke-width="1 * scale"
        v-bind="slotProps"
      />
    </template>
  </v-network-graph>

</template>
<script>
import { defineComponent,reactive, ref } from "vue"
import * as vNG from "v-network-graph"
import {
  ForceLayout,
} from "v-network-graph/lib/force-layout"
export default defineComponent({
     name: 'TodoItem',
  setup() {

    const nodes = reactive({
//   node1: { name: "User 1", face: "https://pbs.twimg.com/profile_images/1544992668266074112/Eo0EtSoD_400x400.jpg" },
//   node2: { name: "User 2", face: "0700202.png" },
//   node3: { name: "User 3", face: "0037725.png" },
//   node4: { name: "User 4", face: "0062138.png" },
//   node5: { name: "User 5", face: "0103755.png" },
//   node6: { name: "User 6", face: "0092035.png" },
node1: { name: 'ingshin', face: 'https://pbs.twimg.com/profile_images/1511518080777977858/Klm3Jowl_400x400.jpg' },
node2: { name: 'VoiceTVOfficial', face: 'https://pbs.twimg.com/profile_images/1541999054380335106/qF7964l0_400x400.jpg' },
node3: { name: 'PheuThaiParty', face: 'https://pbs.twimg.com/profile_images/1542771774752169984/zxlGFI7E_400x400.jpg' },
node4: { name: 'arnonnampa', face: 'https://pbs.twimg.com/profile_images/1506188425/pumisak0_400x400.jpg' },
node5: { name: 'johnwinyu', face: 'https://pbs.twimg.com/profile_images/804547362794242048/iO0eWnVK_400x400.jpg' },
node6: { name: 'paritchi', face: 'https://pbs.twimg.com/profile_images/1558998023472312321/EQ9DGym7_400x400.jpg' },
node7: { name: 'AmaratJeab', face: 'https://pbs.twimg.com/profile_images/1525764845156438016/ggkS045g_400x400.jpg' },
node8: { name: 'RangsimanRome', face: 'https://pbs.twimg.com/profile_images/1548214818804748288/2pZZNrOh_400x400.jpg' },
node9: { name: 'somsakjeam', face: 'https://pbs.twimg.com/profile_images/2268382506/171no63xaygwierepzrk_400x400.jpeg' },
node10: { name: 'PavinKyoto', face: 'https://pbs.twimg.com/profile_images/964174137429118976/r-_On2DA_400x400.jpg' },
node11: { name: 'wirojlak', face: 'https://pbs.twimg.com/profile_images/1548901111930621952/T7oh8-ku_400x400.jpg' },
node12: { name: 'Thalufah', face: 'https://pbs.twimg.com/profile_images/1551955606109835266/-MTbBQBk_400x400.jpg' },
node13: { name: 'iLawFX', face: 'https://pbs.twimg.com/profile_images/1417347047879970817/PsoMySIQ_400x400.jpg' },
node14: { name: 'tanawatofficial', face: 'https://pbs.twimg.com/profile_images/1239832797625212928/VrWLLX3Z_400x400.jpg' },
node15: { name: 'MayWongCNA', face: 'https://pbs.twimg.com/profile_images/1018562929388445696/kpQTrVr1_400x400.jpg' },
node16: { name: 'ThammasatUFTD', face: 'https://pbs.twimg.com/profile_images/1416672531008786432/JxUk0IAs_400x400.jpg' },
node17: { name: 'yingcheep', face: 'https://pbs.twimg.com/profile_images/1428723342844973056/0ZRsAJs5_400x400.jpg' },
node18: { name: 'mike_rayong', face: 'https://pbs.twimg.com/profile_images/1530193770918006784/E2ohuWbu_400x400.jpg' },
node19: { name: 'nuling', face: 'https://pbs.twimg.com/profile_images/378800000191844097/ca62c084c2d5c67001594264b91542ed_400x400.jpeg' },
node20: { name: 'NuttaaBow', face: 'https://pbs.twimg.com/profile_images/1047512587171053569/ceCWBIBZ_400x400.jpg' },
node21: { name: 'Pita_MFP', face: 'https://pbs.twimg.com/profile_images/1548599088249049088/_Kzxu_xt_400x400.jpg' },
node22: { name: 'Pannika_FWP', face: 'https://pbs.twimg.com/profile_images/1241415434559078401/Smp0VH1U_400x400.jpg' },
node23: { name: 'Thanathorn_FWP', face: 'https://pbs.twimg.com/profile_images/1308002082654314496/JIiAdJF5_400x400.jpg' },
node24: { name: 'kovitw1', face: 'https://pbs.twimg.com/profile_images/1114819127942639616/1_zp1914_400x400.jpg' },
node25: { name: 'prachatai', face: 'https://pbs.twimg.com/profile_images/807035173665533952/so4Bam9y_400x400.jpg' },
node26: { name: 'madmax68176958', face: 'https://pbs.twimg.com/profile_images/1552675759927398401/dGvvDJOJ_400x400.jpg' },
node27: { name: 'PravitR', face: 'https://pbs.twimg.com/profile_images/895117122891689984/kgmSFy9S_400x400.jpg' },
node28: { name: 'Ten_Nattawut', face: 'https://pbs.twimg.com/profile_images/1396727657555914757/zF9L4kIG_400x400.jpg' },
node29: { name: 'YDFD2020', face: 'https://pbs.twimg.com/profile_images/1305510085175644160/-xi9mk3n_400x400.jpg' },
node30: { name: 'Attaponbuapat', face: 'https://pbs.twimg.com/profile_images/1230902605536059399/8TpmfGdo_400x400.jpg' },
node31: { name: 'BadStudent_', face: 'https://pbs.twimg.com/profile_images/1531951519956107265/Y4w1k-Wy_400x400.jpg' },
node32: { name: 'Mindpatsrvl', face: 'https://pbs.twimg.com/profile_images/1305865424127565830/G-9zTKoq_400x400.jpg' },
node33: { name: 'jatupt', face: 'https://pbs.twimg.com/profile_images/1420604686013399040/ZGucmC11_400x400.jpg' },
node34: { name: 'PanusayaS', face: 'https://pbs.twimg.com/profile_images/1557448152566808576/SlFEpYZB_400x400.jpg' },
node35: { name: 'charoenpura', face: 'https://pbs.twimg.com/profile_images/1341007926144602114/D4p0kqK3_400x400.jpg' },
node36: { name: 'Nattacha_mfp', face: 'https://pbs.twimg.com/profile_images/1497929707261939713/ngxlYfab_400x400.jpg' },
node37: { name: 'KhunPleum', face: 'https://pbs.twimg.com/profile_images/1438387423348621314/UYRtlG-J_400x400.jpg' },
node38: { name: 'chadchart_trip', face: 'https://pbs.twimg.com/profile_images/1510047235614343171/SBc-lkax_400x400.jpg' },
node39: { name: 'j_sindhuprai', face: 'https://pbs.twimg.com/profile_images/1534490112880365568/9vLnFUWw_400x400.jpg' },
node40: { name: 'Baworndet24761', face: 'https://pbs.twimg.com/profile_images/1524017183021535232/5h_nXzL__400x400.jpg' },
node41: { name: 'BeerChayapa', face: 'https://pbs.twimg.com/profile_images/1544992668266074112/Eo0EtSoD_400x400.jpg' },
node42: { name: 'dinmydream', face: 'https://pbs.twimg.com/profile_images/1505726334764732416/BHpU1sgC_400x400.jpg' },
node43: { name: 'JJINGPratchaya', face: 'https://pbs.twimg.com/profile_images/1521430899476164608/WXh6T470_400x400.jpg' },
node44: { name: 'treechadalive', face: 'https://pbs.twimg.com/profile_images/1504637313825251329/-CKYOap6_400x400.jpg' },
node45: { name: 'SuthareeW', face: 'https://pbs.twimg.com/profile_images/1374967283584409601/jYwZvpHY_400x400.jpg' },
node46: { name: 'weeranan', face: 'https://pbs.twimg.com/profile_images/1542638833199591424/1YAWw-YK_400x400.jpg' },
node47: { name: 'aim_theerarat', face: 'https://pbs.twimg.com/profile_images/1504632317586804741/KSI1nbf__400x400.jpg' },
node48: { name: 'bluesherbet_', face: 'https://pbs.twimg.com/profile_images/1495276553827090432/k1QlnOJb_400x400.jpg' },
node49: { name: 'fuxsuxlux', face: 'https://pbs.twimg.com/profile_images/430713345822294016/NawoSGNj_400x400.jpeg' },
node50: { name: 'moui', face: 'https://pbs.twimg.com/profile_images/1499106778574831621/lCB6H8Kt_400x400.png' },
node51: { name: 'Cookie97020934', face: 'https://pbs.twimg.com/profile_images/1554883323272368130/0iu4_wC3_400x400.jpg' },
node52: { name: 'junifactcheck', face: 'https://pbs.twimg.com/profile_images/1458126668720005124/5W5_QwEc_400x400.jpg' },
node53: { name: 'EakaratTkn', face: 'https://pbs.twimg.com/profile_images/1208391776148557826/BYnnDYBP_400x400.jpg' },
node54: { name: 'meVnus', face: 'https://pbs.twimg.com/profile_images/1085941185951100929/fVpldwhv_400x400.jpg' },
node55: { name: 'ThaiEnquirer', face: 'https://pbs.twimg.com/profile_images/1544148112637194240/2wi7V7CF_400x400.jpg' },
node56: { name: 'Thammas59237142', face: 'https://pbs.twimg.com/profile_images/1515133007429980160/bYyTXlcb_400x400.jpg' },
node57: { name: 'somsakjeam112', face: 'https://pbs.twimg.com/profile_images/1420170366379462657/PKb8SJbI_400x400.jpg' },
node58: { name: 'Banaranamaprang', face: 'https://pbs.twimg.com/profile_images/1453194359361343491/l-TeNQng_400x400.jpg' },
node59: { name: 'Pinkzaa_Zaa', face: 'https://pbs.twimg.com/profile_images/1543278581039542272/NhQMUrwX_400x400.jpg' },
node60: { name: 'Tong2482191', face: 'https://pbs.twimg.com/profile_images/1447769911678226444/Eb8M-Yuu_400x400.jpg' },
node61: { name: 'bonnadol', face: 'https://pbs.twimg.com/profile_images/1333684678721630208/o4AmNktU_400x400.jpg' },
node62: { name: 'political_drama', face: 'https://pbs.twimg.com/profile_images/1447818795733553158/BK_EvQcu_400x400.jpg' },
node63: { name: 'ThaksinsLife', face: 'https://pbs.twimg.com/profile_images/3717493121/e9be26276578772cd207ef9cf371a4de_400x400.jpeg' },
node64: { name: 'topazine', face: 'https://pbs.twimg.com/profile_images/1509817487487299590/zDxaGyRh_400x400.jpg' },
node65: { name: 'BenchaMFP', face: 'https://pbs.twimg.com/profile_images/1159025777783914497/kwISBxEF_400x400.jpg' },
node66: { name: '2Khunm', face: 'https://pbs.twimg.com/profile_images/1556252185268142080/RabGu5mx_400x400.jpg' },
node67: { name: '404NOTF65767728', face: 'https://pbs.twimg.com/profile_images/1519986564855918592/rd4nJxXB_400x400.jpg' },
node68: { name: 'ATIKIT14', face: 'https://pbs.twimg.com/profile_images/1410646570211500039/vGgBBMpl_400x400.jpg' },
node69: { name: 'GiJOE2538', face: 'https://pbs.twimg.com/profile_images/1518831133395365889/-ZFxTlrw_400x400.jpg' },
node70: { name: 'koogkaii', face: 'https://pbs.twimg.com/profile_images/1552168465758183424/XlpuPLfB_400x400.jpg' },
node71: { name: 'ray78918', face: 'https://pbs.twimg.com/profile_images/1261282534458982400/RmlOiaY7_400x400.jpg' },
node72: { name: 'TarotYouuuu', face: 'https://pbs.twimg.com/profile_images/1243580440302292992/HOX_0NZ-_400x400.jpg' },
node73: { name: 'tigeryellowlive', face: 'https://pbs.twimg.com/profile_images/1514085014241259520/Uo1-e6XK_400x400.jpg' },
node74: { name: 'vnomenon', face: 'https://pbs.twimg.com/profile_images/1554195175546953728/VNetWYEq_400x400.jpg' },
node75: { name: 'wNh1qrimDiSkTFW', face: 'https://pbs.twimg.com/profile_images/1026471644607307776/CFFIDXwF_400x400.jpg' },
node76: { name: 'MarcielScot', face: 'https://pbs.twimg.com/profile_images/1345812001788870656/8jHRlktm_400x400.jpg' },
node77: { name: 'CasterGTroy1', face: 'https://pbs.twimg.com/profile_images/1269107279518822401/aV9_AzFX_400x400.jpg' },
node78: { name: 'iLawclub', face: 'https://pbs.twimg.com/profile_images/1544594958149369856/vny5OwFW_400x400.jpg' },
node79: { name: 'ManushyaFdn', face: 'https://pbs.twimg.com/profile_images/1542842841944055808/pxAtljGR_400x400.png' },
node80: { name: 'Ryn_writes', face: 'https://pbs.twimg.com/profile_images/1557317101345710081/FQ5NNbn8_400x400.jpg' },
node81: { name: 'TSererak', face: 'https://pbs.twimg.com/profile_images/1317540960344199169/u16OzAGj_400x400.jpg' },
node82: { name: 'Jummajum1', face: 'https://pbs.twimg.com/profile_images/1477908332694233090/hCbfH3dS_400x400.jpg' },
node83: { name: 'Sulovebossss', face: 'https://pbs.twimg.com/profile_images/1521845175219236865/RK8wVcI8_400x400.jpg' },
node84: { name: 'MFPThailand', face: 'https://pbs.twimg.com/profile_images/1548876994414161920/4XVEZPap_400x400.jpg' },
node85: { name: 'tisanachoonhav2', face: 'https://pbs.twimg.com/profile_images/1535509486516940801/ezxW2I12_400x400.jpg' },
node86: { name: 'selfcircled', face: 'https://pbs.twimg.com/profile_images/1552983991460167682/V3QarMFW_400x400.jpg' },
node87: { name: 'natlamborghini1', face: 'https://pbs.twimg.com/profile_images/1181571880572145666/CjiFVvXi_400x400.jpg' },
node88: { name: 'sakaojaiOOM', face: 'https://pbs.twimg.com/profile_images/1439564401133043718/obT5ue3e_400x400.jpg' },
node89: { name: 'DoubleSsine', face: 'https://pbs.twimg.com/profile_images/1541766662302859264/DAul5SCW_400x400.jpg' },
node90: { name: 'prachatai_en', face: 'https://pbs.twimg.com/profile_images/807035479543586816/vIHvCAIy_400x400.jpg' },
node91: { name: 'stephffart', face: 'https://pbs.twimg.com/profile_images/1509388252221902849/U8Vk8tTT_400x400.jpg' },
node92: { name: 'KarayamaTH', face: 'https://pbs.twimg.com/profile_images/1377577155379429380/LmVF8Abx_400x400.jpg' },
node93: { name: 'base_thai', face: 'https://pbs.twimg.com/profile_images/878138126891220992/4GvuA4YU_400x400.jpg' },
node94: { name: 'KhaosodEnglish', face: 'https://pbs.twimg.com/profile_images/818319616023764993/9j3JkLza_400x400.jpg' },
node95: { name: 'ArmTeerapol', face: 'https://pbs.twimg.com/profile_images/1222409404248518656/Ck-JUDGk_400x400.jpg' },
node96: { name: 'korporporsor', face: 'https://pbs.twimg.com/profile_images/1352529002066452481/WQ7LL6yB_400x400.jpg' },
node97: { name: 'teabhoky', face: 'https://pbs.twimg.com/profile_images/1461367126808150023/5HH-c9W9_400x400.jpg' },
node98: { name: 'EnLAWTHAI', face: 'https://pbs.twimg.com/profile_images/1404792359049601028/L2tfoe_I_400x400.jpg' },
node99: { name: 'aorwiki', face: 'https://pbs.twimg.com/profile_images/1358395112326197250/EX7twigg_400x400.jpg' },
node100: { name: 't_047bkk', face: 'https://pbs.twimg.com/profile_images/1420975486310653956/w4u7mTTQ_400x400.jpg' },
node101: { name: 'weeeedpung', face: 'https://pbs.twimg.com/profile_images/1517524215393832960/THArQJ58_400x400.jpg' },
node102: { name: 'lawyerJammy', face: 'https://pbs.twimg.com/profile_images/1541449129406373888/MEVHFQtw_400x400.jpg' },
node103: { name: 'TanwarinS_MFP', face: 'https://pbs.twimg.com/profile_images/1554032664755052544/iGPd-i_N_400x400.jpg' },
node104: { name: 'karnnikro', face: 'https://pbs.twimg.com/profile_images/1515578947995459587/e9E3qLJb_400x400.jpg' },
node105: { name: 'nitipon_mfp', face: 'https://pbs.twimg.com/profile_images/1458997270032969734/c2g-evDa_400x400.jpg' },
node106: { name: 'BangkokPostNews', face: 'https://pbs.twimg.com/profile_images/1306147118441050112/9w10mPR1_400x400.jpg' },
node107: { name: 'castby9arm', face: 'https://pbs.twimg.com/profile_images/1365879828285652993/aqmB4ilJ_400x400.jpg' },
node108: { name: 'Incognito_me', face: 'https://pbs.twimg.com/profile_images/378800000852690729/ada9d3fd8b078f5427c07bd946526c50_400x400.png' },
node109: { name: 'pawinpawin', face: 'https://pbs.twimg.com/profile_images/1380573498280706048/ctuSU-dw_400x400.jpg' },
node110: { name: 'sunsernr', face: 'https://pbs.twimg.com/profile_images/1140672324896612363/xqMhdZ--_400x400.jpg' },
node111: { name: 'Woody754', face: 'https://pbs.twimg.com/profile_images/1478048208794238976/xwLCHFd9_400x400.jpg' },
node112: { name: 'icyremy', face: 'https://pbs.twimg.com/profile_images/467030789381574657/YQUgwq20_400x400.jpeg' },
node113: { name: 'PheuThaiFC', face: 'https://pbs.twimg.com/profile_images/1542773024046272513/JfQygGle_400x400.jpg' },
node114: { name: 'Wanniwat11', face: 'https://pbs.twimg.com/profile_images/1539196739868995584/2VFSAKRC_400x400.jpg' },
node115: { name: 'YimVisaradee', face: 'https://pbs.twimg.com/profile_images/1323497917693353994/i55pXrvJ_400x400.jpg' },
node116: { name: 'FreeYOUTHth', face: 'https://pbs.twimg.com/profile_images/1409883070577221635/Lf9K6YcN_400x400.jpg' },


})
    const edges = reactive({
//   edge1: { source: "node1", target: "node2" },
//   edge2: { source: "node2", target: "node3" },
//   edge3: { source: "node2", target: "node4" },
//   edge4: { source: "node4", target: "node5" },
//   edge5: { source: "node4", target: "node6" },
edge1: { source: 'node1', target: 'node40' },
edge2: { source: 'node1', target: 'node41' },
edge3: { source: 'node1', target: 'node42' },
edge4: { source: 'node1', target: 'node43' },
edge5: { source: 'node1', target: 'node3' },
edge6: { source: 'node1', target: 'node44' },
edge7: { source: 'node2', target: 'node45' },
edge8: { source: 'node2', target: 'node46' },
edge9: { source: 'node3', target: 'node47' },
edge10: { source: 'node3', target: 'node40' },
edge11: { source: 'node4', target: 'node46' },
edge12: { source: 'node5', target: 'node48' },
edge13: { source: 'node5', target: 'node49' },
edge14: { source: 'node5', target: 'node50' },
edge15: { source: 'node6', target: 'node51' },
edge16: { source: 'node6', target: 'node52' },
edge17: { source: 'node7', target: 'node53' },
edge18: { source: 'node7', target: 'node54' },
edge19: { source: 'node7', target: 'node55' },
edge20: { source: 'node8', target: 'node40' },
edge21: { source: 'node8', target: 'node56' },
edge22: { source: 'node9', target: 'node57' },
edge23: { source: 'node10', target: 'node58' },
edge24: { source: 'node10', target: 'node59' },
edge25: { source: 'node10', target: 'node60' },
edge26: { source: 'node11', target: 'node61' },
edge27: { source: 'node11', target: 'node54' },
edge28: { source: 'node11', target: 'node62' },
edge29: { source: 'node11', target: 'node63' },
edge30: { source: 'node11', target: 'node64' },
edge31: { source: 'node12', target: 'node13' },
edge32: { source: 'node13', target: 'node65' },
edge33: { source: 'node14', target: 'node66' },
edge34: { source: 'node14', target: 'node67' },
edge35: { source: 'node14', target: 'node68' },
edge36: { source: 'node14', target: 'node51' },
edge37: { source: 'node14', target: 'node69' },
edge38: { source: 'node14', target: 'node70' },
edge39: { source: 'node14', target: 'node71' },
edge40: { source: 'node14', target: 'node72' },
edge41: { source: 'node14', target: 'node73' },
edge42: { source: 'node14', target: 'node74' },
edge43: { source: 'node14', target: 'node75' },
edge44: { source: 'node15', target: 'node76' },
edge45: { source: 'node16', target: 'node77' },
edge46: { source: 'node16', target: 'node78' },
edge47: { source: 'node16', target: 'node79' },
edge48: { source: 'node16', target: 'node55' },
edge49: { source: 'node16', target: 'node46' },
edge50: { source: 'node17', target: 'node13' },
edge51: { source: 'node17', target: 'node80' },
edge52: { source: 'node18', target: 'node71' },
edge53: { source: 'node19', target: 'node71' },
edge54: { source: 'node19', target: 'node73' },
edge55: { source: 'node19', target: 'node81' },
edge56: { source: 'node20', target: 'node82' },
edge57: { source: 'node20', target: 'node83' },
edge58: { source: 'node21', target: 'node40' },
edge59: { source: 'node21', target: 'node54' },
edge60: { source: 'node21', target: 'node84' },
edge61: { source: 'node21', target: 'node63' },
edge62: { source: 'node21', target: 'node85' },
edge63: { source: 'node21', target: 'node64' },
edge64: { source: 'node22', target: 'node86' },
edge65: { source: 'node24', target: 'node87' },
edge66: { source: 'node24', target: 'node88' },
edge67: { source: 'node25', target: 'node89' },
edge68: { source: 'node25', target: 'node52' },
edge69: { source: 'node25', target: 'node90' },
edge70: { source: 'node25', target: 'node91' },
edge71: { source: 'node26', target: 'node92' },
edge72: { source: 'node27', target: 'node93' },
edge73: { source: 'node27', target: 'node94' },
edge74: { source: 'node27', target: 'node91' },
edge75: { source: 'node28', target: 'node95' },
edge76: { source: 'node28', target: 'node40' },
edge77: { source: 'node28', target: 'node39' },
edge78: { source: 'node28', target: 'node96' },
edge79: { source: 'node28', target: 'node3' },
edge80: { source: 'node28', target: 'node97' },
edge81: { source: 'node28', target: 'node73' },
edge82: { source: 'node29', target: 'node98' },
edge83: { source: 'node30', target: 'node64' },
edge84: { source: 'node30', target: 'node46' },
edge85: { source: 'node33', target: 'node99' },
edge86: { source: 'node33', target: 'node12' },
edge87: { source: 'node33', target: 'node100' },
edge88: { source: 'node33', target: 'node101' },
edge89: { source: 'node34', target: 'node102' },
edge90: { source: 'node34', target: 'node87' },
edge91: { source: 'node34', target: 'node71' },
edge92: { source: 'node34', target: 'node55' },
edge93: { source: 'node34', target: 'node101' },
edge94: { source: 'node34', target: 'node46' },
edge95: { source: 'node35', target: 'node103' },
edge96: { source: 'node36', target: 'node104' },
edge97: { source: 'node36', target: 'node105' },
edge98: { source: 'node36', target: 'node11' },
edge99: { source: 'node37', target: 'node50' },
edge100: { source: 'node38', target: 'node106' },
edge101: { source: 'node38', target: 'node40' },
edge102: { source: 'node38', target: 'node107' },
edge103: { source: 'node38', target: 'node108' },
edge104: { source: 'node38', target: 'node109' },
edge105: { source: 'node38', target: 'node110' },
edge106: { source: 'node38', target: 'node111' },
edge107: { source: 'node39', target: 'node47' },
edge108: { source: 'node39', target: 'node58' },
edge109: { source: 'node39', target: 'node42' },
edge110: { source: 'node39', target: 'node112' },
edge111: { source: 'node39', target: 'node96' },
edge112: { source: 'node39', target: 'node113' },
edge113: { source: 'node39', target: 'node114' },
edge114: { source: 'node39', target: 'node115' },
edge115: { source: 'node22', target: 'node116' },
edge116: { source: 'node25', target: 'node116' },
edge117: { source: 'node13', target: 'node116' },
edge118: { source: 'node14', target: 'node116' },
edge119: { source: 'node18', target: 'node116' },
edge120: { source: 'node29', target: 'node116' },
edge121: { source: 'node34', target: 'node116' },
edge122: { source: 'node78', target: 'node116' },
edge123: { source: 'node10', target: 'node116' },
edge124: { source: 'node27', target: 'node116' },
edge125: { source: 'node15', target: 'node13' },
edge126: { source: 'node1', target: 'node20' },


})
const layouts = ref({
//   nodes: {
//     node0: {
//       x: 0,
//       y: 0,
//       fixed: true, 
//     },
//   },
})


const configs = reactive(
  vNG.defineConfigs({
    view: {
      layoutHandler: new ForceLayout({
        positionFixedByDrag: false,
        positionFixedByClickWithAltKey: true,

      }),
      
    },
    node: {
    selectable: true,
      normal: {
        color: n => (n.id === "node0" ? "#ff0000" : "#4466cc"),
        radius: 20,
      },
      hover: {
      radius: 30,
    },
      label: {
        visible: true,
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: 12,
      },
    },
  })
)

// buildNetwork(20, nodes, edges)

    return { nodes, edges ,layouts,configs}
  },
})


</script>
<style scoped>

.face-circle,
.face-picture {
  transition: all 0.1s linear;
}

.face-picture {
  pointer-events: none;
}
</style>