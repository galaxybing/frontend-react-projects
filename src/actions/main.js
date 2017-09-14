'use strict';
import type { Action, ThunkAction } from './types';
const Parse = require('../store/parse');

module.exports = {
<<<<<<< HEAD
  checkedQuery: ()=>{
    return (dispatch)=>{
      return Parse.run({url: 'checkCode', options: {
        method: 'POST',
        data: { userName: 'wangyh@317hu.com' }
      }, api: 'baseComponentApi'})
=======
  common: (source)=>{
    return async (dispatch, getState)=>{
      let results= await Parse.run({method: 'login/checkIn', body: source});
      return results;
      /** 或者直接触发存储状态变化
        * Parse.run().then(()=>{
        *  dispatch({type:"LOAD_SITE_INDEX", action: data});
        * })
       */
>>>>>>> master
    }
  }
};
