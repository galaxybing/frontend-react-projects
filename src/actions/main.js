'use strict';
import type { Action, ThunkAction } from './types';
const Parse = require('../store/parse');

module.exports = {
  checkedQuery: ()=>{
    return (dispatch)=>{
      return Parse.run({url: 'checkCode', options: {
        method: 'POST',
        data: { userName: 'wangyh@317hu.com' }
      }, api: 'baseComponentApi'})
    }
  }
};
