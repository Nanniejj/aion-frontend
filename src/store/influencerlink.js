import { InfluencerLinkService } from "@/common/api.services";
export default {
  state: {
    submit: false,
    linksdata: [],
    data: [
      // {
      //   rank: 1,
      //   score: 0.00313835716993212,
      //   users: {
      //     username: "krutewly",
      //     display_name: "KruTew",
      //   },
      // },
      // {
      //   rank: 2,
      //   score: 0.0025166461692388564,
      //   users: {
      //     username: "junifactcheck",
      //     display_name: "june",
      //   },
      // },
      // {
      //   rank: 3,
      //   score: 0.002176899617279835,
      //   users: {
      //     username: "wirojlak",
      //     display_name: "Wiroj 77",
      //   },
      // },
      // {
      //   rank: 4,
      //   score: 0.0020156402988805843,
      //   users: {
      //     username: "js100radio",
      //     display_name: "JS100",
      //   },
      // },
      // {
      //   rank: 5,
      //   score: 0.0016866478271228775,
      //   users: {
      //     username: "sorkorlao",
      //     display_name: "ซ้อขอเล่า ~ เมาท์เท่าที่รู้",
      //   },
      // },
      // {
      //   rank: 6,
      //   score: 0.0012380058793647949,
      //   users: {
      //     username: "BLACKPINK",
      //     display_name: "BLACKPINKOFFICIAL",
      //   },
      // },
      // {
      //   rank: 7,
      //   score: 0.0011139564584922964,
      //   users: {
      //     username: "PravitR",
      //     display_name: "Pravit Rojanaphruk",
      //   },
      // },
      // {
      //   rank: 8,
      //   score: 0.0010375672491267048,
      //   users: {
      //     username: "TheShadeYT",
      //     display_name: "The Shade",
      //   },
      // },
      // {
      //   rank: 9,
      //   score: 0.0010371171505544061,
      //   users: {
      //     username: "MatichonOnline",
      //     display_name: "Matichon Online",
      //   },
      // },
      // {
      //   rank: 10,
      //   score: 0.000983766171357942,
      //   users: {
      //     username: "joe_black317",
      //     display_name: "joe black",
      //   },
      // },
    ],
    links: [
      // {
      //   "source": "political_drama",
      //   "target": [
      //     {
      //       "name": "PravitR",
      //       "weight": 2
      //     },
      //     {
      //       "name": "Sulovebossss",
      //       "weight": 1
      //     },
      //     {
      //       "name": "motorwars",
      //       "weight": 2
      //     }
      //   ],
      //   "showing": false
      // },
      // {
      //   "source": "Sulovebossss",
      //   "target": [
      //     {
      //       "name": "motorwars",
      //       "weight": 4
      //     },
      //     {
      //       "name": "TichilaThaipbs",
      //       "weight": 1
      //     },
      //     {
      //       "name": "ThaiPBSNews",
      //       "weight": 1
      //     }
      //   ],
      //   "showing": false
      // },
      // {
      //   "source": "fm91trafficpro",
      //   "target": [
      //     {
      //       "name": "Vanuthaset91",
      //       "weight": 2
      //     },
      //   ],
      //   "showing": false
      // },
      // {
      //   "source": "motorwars",
      //   "target": [
      //     {
      //       "name": "ThaiPBSNews",
      //       "weight": 1
      //     },

      //   ],
      //   "showing": false
      // },
      // {
      //   "source": "js100radio",
      //   "target": [

      //     {
      //       "name": "Vanuthaset91",
      //       "weight": 1
      //     }
      //   ],
      //   "showing": false
      // },
      // {
      //   "source": "PravitR",
      //   "target": [
      //   ],
      //   "showing": false
      // },
      // {
      //   "source": "joe_black317",
      //   "target": [
      //   ],
      //   "showing": false
      // },
      // {
      //   "source": "SiameseFat",
      //   "target": [
      //     {
      //       "name": "cumkom",
      //       "weight": 7
      //     }
      //   ],
      //   "showing": false
      // },
      // {
      //   "source": "ThaiPBSNews",
      //   "target": [
      //     {
      //       "name": "TichilaThaipbs",
      //       "weight": 3
      //     }
      //   ],
      //   "showing": false
      // },
      // {
      //   "source": "cumkom",
      //   "target": [
      //     {
      //       "name": "js100radio",
      //       "weight": 1
      //     },
      //     {
      //       "name": "SiameseFat",
      //       "weight": 4
      //     },
      //     {
      //       "name": "rrunggone",
      //       "weight": 1
      //     },
      //     {
      //       "name": "YahomAKA",
      //       "weight": 3
      //     }
      //   ],
      //   "showing": false
      // },
      // {
      //   "source": "charoenpura",
      //   "target": [

      //   ],
      //   "showing": false
      // },
      // {
      //   "source": "ANI",
      //   "target": [

      //   ],
      //   "showing": false
      // },
      // {
      //   "source": "allaboutfuzz",
      //   "target": [
      //     {
      //       "name": "rrunggone",
      //       "weight": 4
      //     },
      //     {
      //       "name": "RsmlP",
      //       "weight": 5
      //     }
      //   ],
      //   "showing": false
      // },
      // {
      //   "source": "sorkorlao",
      //   "target": [
      //   ],
      //   "showing": false
      // },
      // {
      //   "source": "toyubomm",
      //   "target": [

      //     {
      //       "name": "joe_black317",
      //       "weight": 2
      //     }
      //   ],
      //   "showing": false
      // },
      // {
      //   "source": "YahomAKA",
      //   "target": [

      //     {
      //       "name": "cumkom",
      //       "weight": 6
      //     }
      //   ],
      //   "showing": false
      // },
      // {
      //   "source": "pruetthigon",
      //   "target": [
      //     {
      //       "name": "sorkorlao",
      //       "weight": 1
      //     }
      //   ],
      //   "showing": false
      // },
      // {
      //   "source": "RsmlP",
      //   "target": [
      //     {
      //       "name": "allaboutfuzz",
      //       "weight": 1
      //     },
      //     {
      //       "name": "rrunggone",
      //       "weight": 1
      //     }
      //   ],
      //   "showing": false
      // },
      // {
      //   "source": "rrunggone",
      //   "target": [
      //     {
      //       "name": "allaboutfuzz",
      //       "weight": 1
      //     },
      //     {
      //       "name": "RsmlP",
      //       "weight": 2
      //     }
      //   ],
      //   "showing": false
      // },
      // {
      //   "source": "TichilaThaipbs",
      //   "target": [
      //     {
      //       "name": "ThaiPBSNews",
      //       "weight": 5
      //     }
      //   ],
      //   "showing": false
      // },
      // {
      //   "source": "Vanuthaset91",
      //   "target": [
      //     {
      //       "name": "fm91trafficpro",
      //       "weight": 2
      //     },
      //     {
      //       "name": "js100radio",
      //       "weight": 1
      //     }
      //   ],
      //   "showing": false
      // }
  ],
    nodes: [
      // { id: "armypr_news", count: 10, name: "Royal Thai Army" },
      // { id: "Army4PR", count: 10, name: "กองทัพภาคที่ 4" },
      // { id: "political_drama", count: 10, name: "เฮฮาการเมือง" },
      // { id: "Thairath_News", count: 10, name: "Thairath_News" },
      // { id: "Sulovebossss", count: 10, name: "🚦°สลิ่มพลเมืองดาวพลูโต°🚦" },
      // { id: "fm91trafficpro", count: 10, name: "FM91 Trafficpro" },
      // { id: "motorwars", count: 10, name: "pone poyepoloye" },
      // { id: "nuttha_MFP", count: 10, name: "ณัฐวุฒิ บัวประทุม" },
      // { id: "ManushyaFdn", count: 10, name: "Manushya Foundation" },
      // { id: "js100radio", count: 10, name: "JS100" },
      // { id: "PravitR", count: 10, name: "Pravit Rojanaphruk" },
      // { id: "joe_black317", count: 10, name: "joe black" },
      // { id: "cnew888", count: 10, name: "คุณพี่อยู่จังหวัดอะไรค๊าาา 🤍🕊" },
      // { id: "SiameseFat", count: 10, name: "𝐌" },
      // { id: "RichardBarrow", count: 10, name: "Richard Barrow in Thailand" },
      // { id: "ThaiPBSNews", count: 10, name: "Thai PBS News" },
      // { id: "cumkom", count: 10, name: "Cumคม 😷" },
      // {
      //   id: "charoenpura",
      //   count: 10,
      //   name: "ITRC 😼กล้ามากกกกกกที่จะไม่กลับไปรักเธอ!",
      // },
      // { id: "kittiadul", count: 10, name: "ก.อสังหา" },
      // { id: "BLACKPINK", count: 5 },
      // { id: "RangsimanRome", count: 10, name: "Rangsiman Rome" },
      // { id: "Offchainon", count: 10, name: "OFF CHAINON" },
      // { id: "narendramodi", count: 10, name: "Narendra Modi" },
      // { id: "ANI", count: 10, name: "ANI" },
      // { id: "Investingcom", count: 10, name: "Investing.com" },
      // { id: "allaboutfuzz", count: 10, name: "พี่เม่น" },
      // { id: "sorkorlao", count: 10, name: "ซ้อขอเล่า ~ เมาท์เท่าที่รู้" },
      // { id: "toyubomm", count: 10, name: "เซเลปหม่อมสามหยอยเป็นราษฎร®" },
      // { id: "ThaiEnquirer", count: 10, name: "Thai Enquirer" },
      // { id: "BTS_twt", count: 10, name: "방탄소년단" },
      // { id: "YahomAKA", count: 10, name: "หอมชื่นจิต สบายใจ😷⚙️" },
      // { id: "pruetthigon", count: 10, name: "#️⃣ République de Thaïlande |||" },
      // { id: "chartgaga", count: 10, name: "Lady Gaga Charts" },
      // { id: "weareoneEXO", count: 10, name: "EXO" },
      // { id: "LG_Views", count: 10, name: "Lady Gaga Views" },
      // { id: "PPTVHD36", count: 10, name: "PPTV HD 36" },
      // { id: "peckpalit", count: 10, name: "Peck Palit" },
      // { id: "RsmlP", count: 10, name: "จป. เด็กตลาด" },
      // { id: "rrunggone", count: 10, name: "รุ้งกร" },
      // { id: "TichilaThaipbs", count: 10, name: "Tichila thaipbs" },
      // { id: "GOT7Official", count: 10, name: "GOT7" },
      // { id: "Vanuthaset91", count: 10, name: "Roong Official" },
    ],
  },
  getters: {
    getDataInfluencerLink: (state) => {
      return state.data;
    },
    getLinksInfluencerLink: (state) => {
      return state.links;
    },
    getLinksDataInfluencerLink: (state) => {
      return state.linksdata;
    },
    getNodesInfluencerLink: (state) => {
      return state.nodes;
    },
    getSubmitInfluencerLink: (state) => {
      return state.submit;
    },
    getNodeLink: (state) => {
      let arr = []
      state.links.map( (item) => {
        item.target.map( (target) => {
          arr.push({'sid':item.source,'tid':target.name})
        })
      })
      return arr
    }
  },
  mutations: {
    setSubmitInfluencerLink: (state, payload) => {
      state.submit = payload;
    },
    setNodesInfluencerLink: (state, payload) => {
      state.nodes = payload;
    },
    setLinksDataInfluencerLink: (state, payload) => {
      state.linksdata = payload;
    },
    setLinksInfluencerLink: (state, payload) => {
      state.links = payload;
    },
    changeDataChoice: (state, payload) => {
      state.dateChoice = payload.choice;
    },
  },
  actions: {
    async fetchInfluencerLink({ commit }, payload) {
      commit('setLoadStatus',true)
      try {
        const res = await InfluencerLinkService.getInfluencerLink(payload);
        // commit("setLinksTop", res.data.links);
        // console.log("5555", res.data);
        //Node
        var nodes = [];
        for (i = 0, len = res.data.nodes.length; i < len; i++) {
          if (res.data.nodes[i].id != null) {
            var a1 = ["id", "name", "size", "svgSym"];
            var id = res.data.nodes[i].id;
            var name = res.data.nodes[i].name;
            var size = res.data.nodes[i].count * 5;
            // var classnode = 'classnode'
            var svgSym = `<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg"><image href="${res.data.nodes[i].image}" height="50" width="50"/></svg>`;

            var obj1 = {};
            obj1[a1[0]] = id;
            obj1[a1[1]] = name;
            obj1[a1[2]] = size;
            obj1[a1[3]] = svgSym;
            //obj1[a1[2]] = classnode;
            nodes.push(obj1);
          }
        }
        commit("setNodesInfluencerLink", nodes);
        //commit('setLoadStatus', false );
        // console.log("links", res.data.links.length);
        //Linkdata
        var linksdata = [];
        for (var i = 0, len = res.data.links.length; i < len; i++) {
          var a = ["source", "target", "weight", "source_img", "target_img"];
          var source = res.data.links[i].source;
          var target2 = res.data.links[i].target;
          var source_img = res.data.links[i].source_img;
          var target_img = res.data.links[i].target_img;
          var weight = res.data.links[i].weight;
          var obj = {};
          obj[a[0]] = source;
          obj[a[1]] = target2;
          obj[a[2]] = weight;
          obj[a[3]] = source_img;
          obj[a[4]] = target_img;
          obj["showing"] = false;
          linksdata.push(obj);
        }

        let target = {};
        let tempsource = {};

        res.data.links.map((item) => {
          tempsource[item.source] = item.source_img;
        });

        res.data.links.map((item) => {
          if (target[item.source]) {
            target[item.source] = [
              ...target[item.source],
              {
                name: item.target,
                weight: item.weight,
                target_img: item.target_img,
              },
            ];
          } else {
            target[item.source] = [
              {
                name: item.target,
                weight: item.weight,
                target_img: item.target_img,
              },
            ];
          }
        });

        let result = Object.keys(target).map((key) => {
          return {
            source: key,
            target: target[key],
            showing: false,
            source_img: tempsource[key],
          };
        });
        console.log(result);

        commit("setLinksDataInfluencerLink", result);
        //commit('setLoadStatus', false );
        //Link
        var links = [];
        for (i = 0, len = res.data.links.length; i < len; i++) {
          // if(res.data.links[i].target == null || res.data.links[i].source == res.data.links[i].target){
          //   console.log('ifffffff');
          //   return
          // } else {
          var a2 = ["sid", "tid", "name"];
          var sid = res.data.links[i].source;
          var tid = res.data.links[i].target;
          name = res.data.links[i].weight;
          // var color = 'red'
          var obj2 = {};
          obj2[a2[0]] = sid;
          obj2[a2[1]] = tid;
          obj2[a2[2]] = name;
          //obj2[a2[2]] = color;
          links.push(obj2);
          //console.log(obj2);
          // }
          // console.log("vsfdvfdsv");
        }
        commit("setLinksInfluencerLink", links);
        commit('setLoadStatus', false );
      } catch (error) {
        console.log(error.response);
      }
    },
  },
};
