'use strict';
import type { Action, ThunkAction } from './types';
const storage = window.localStorage;
const Parse = require('../store/parse');
module.exports = {
    loadConfig: ():ThunkAction =>{
        //let url = ('http://'+location.host+location.pathname);
        return (dispatch, getState) => {
            dispatch({type:'LOADED_CONFIG_DATA'});
        }
    },
    loadAuth: ()=>{
      var url = window.location.href;
    },
    loginCodeCheck: (source)=>{
        //return async ()=>{ /* 调用时需要 this.props.dispatch(),它是一个返回函数的 Action Creator */
            // let results= await Parse.run({method: 'login/getCode', body: source});
            /* 可以直接执行：action，返回 Promise 对象 */
            let results= Parse.run({method: 'login/getCode', body: source});
            return results;//
        //}
    },
    // 返回 Promise 对象, 如果引用了 redux-promise 中间件：
    //(dispatch, postTitle) => new Promise(function (resolve, reject) {})
    loginCheck: (source)=>{
        return async (dispatch)=>{
            let results= await Parse.run({method: 'login/mobileLogin', body: source});
            return results;
        }
    },
};
