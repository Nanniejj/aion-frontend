import { RelationPostService } from '@/common/api.services';
export default {
    state: {
        dataRelation:[],
        tableGetRelation:[],
        dataRelationLink:[],
        dataRelationNode:[],
        showData: false,
    },
    getters: {
    getInfPostList: (state) => {
        return state.tableGetRelation;
      },
      getRelationPost: (state) => {
        return state.dataRelation;
      },
      getRelationPostLink: (state) => {
        return state.dataRelationLink;
      },
      getRelationPostNode: (state) => {
        return state.dataRelationNode;
      },
     
    },
    mutations: {
      changeDataChoice: (state, payload) => {
        state.dateChoice = payload.choice;
      },
      setRelationPost(state, payload){
        state.dataRelation=payload;
      },
      setRelationPostLink(state, payload){
        state.dataRelationLink=payload;
      }, 
      setRelationPostNode(state, payload){
        state.dataRelationNode=payload;
      }
    },
    actions: {
        async fetchRelationPost({commit}) {
          //commit('setLoadStatus', true );
            try {
              const res = await RelationPostService.getRelationPost();
              commit('setRelationPost', res.data);
             // commit('setLoadStatus', false );
              //console.log( res.data.table);
            } catch (error) {
              console.log(error.response);
            }
          },
          async fetchRelationPostLink({commit}) {
            commit('setLoadStatus', true );
            try {
              const res = await RelationPostService.getRelationPostLink();
              //commit('setRelationPostLink', res.data);

              //Node
              var nodes = []
              for (i = 0, len = res.data.nodes.length; i < len; i++) {
                if(res.data.nodes[i].id != null){
                  var a1 = ['id','name',"_size","svgSym"]
                  var id = res.data.nodes[i].id
                  var name = res.data.nodes[i].name
                  var size = res.data.nodes[i].count*5;
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
              commit('setRelationPostNode', nodes);

              //Link
              var links=[]
              for (var i = 0, len = res.data.links.length; i < len; i++) {
                if(res.data.links[i].target == null || res.data.links[i].source == res.data.links[i].target){  
                    return
                }else {
                  var a2 = ['sid','tid','name']
                  var sid = res.data.links[i].source
                  var tid = res.data.links[i].target
                  var namelink = res.data.links[i].caption;
                  // var color = 'red'
                  var obj2 = {};
                  obj2[a2[0]] = sid;
                  obj2[a2[1]] = tid;
                  obj2[a2[2]] = namelink;
                  links.push(obj2);
                }
              }
              commit('setRelationPostLink', links);
              commit('setLoadStatus', false );
            } catch (error) {
              console.log(error.response);
            }
          },
    }
    
  };
  