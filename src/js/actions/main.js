'use strict';
import type { Action, ThunkAction } from './types';
const Parse = require('../store/parse');
//require("babel-polyfill");
module.exports = {
    ecodePicCheck: (source)=>{
        return async (dispatch, getState)=>{
            let results= await Parse.run({method: 'login/checkIn', body: source});
            return results;
            /*
             * 或者直接触发存储状态变化
             *
             * Parse.run().then(()=>{
                dispatch({type:"LOAD_SITE_INDEX", action: data}); //
            })
             */
        }
    }
};
