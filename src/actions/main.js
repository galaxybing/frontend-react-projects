'use strict';
import type { Action, ThunkAction } from './types';
const Parse = require('../store/parse');

module.exports = {
  common: (source)=>{
    return async (dispatch, getState)=>{
      let results= await Parse.run({method: 'login/checkIn', body: source});
      return results;
      /** 或者直接触发存储状态变化
        * Parse.run().then(()=>{
        *  dispatch({type:"LOAD_SITE_INDEX", action: data});
        * })
       */
    }
  },
  vedioListAndUrlQuery: ()=>{
    return (dispatch)=>{
      return Parse.run({method: 'privilege-web/privilege/privilegeWeb/vedioListAndUrlQuery', body: {}});
    }
  }
};
