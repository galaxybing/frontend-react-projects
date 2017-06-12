'use strict';
const initialState = {
    res: {},
};

function main(state = initialState, action) {
  if(action.type==='LOAD_SITE_INDEX_MORE'){
      let res = action.res;
      if(!res.data.list){
          return {
               ...state,
              res: res.data,
              list: state.list,
              end: true,
          };
      }else{
          return {
              ...state,
              res: res.data,
              list: (state.list).concat(res.data.list),
              end: false,
          };
      }

  }
  return state;
}

module.exports = main;
