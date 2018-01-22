import type { Action, /* ThunkAction */ } from '../actions/types';

export type Config = {
  wifiNetwork: string;
};

const initialState: Config = {
    res: {},
    wifiNetwork: 'wifi'
};

function main(state: Config = initialState, action: Action) {
    if(action.type==='SET_ECODE_PIC'){
        return {
            ...state,
            ecodePic: action.data.ecodePic
        }
    }
  if(action.type==='LOAD_SITE_INDEX'){
      let res = action.res;
      if(!res.data.list){
          return {
              res: res.data,
              list: [],
              end: true,
          };
      }else{
          return {
              res: res.data,
              list: res.data.list,
              end: false,
          };
      }

  }
  
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
