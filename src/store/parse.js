'use strict';
const Promise = require('es6-promise').polyfill();
if (!window.Promise) {
  window.Promise = Promise;
}
import axios from 'axios'; 
import objectAssign from 'object-assign';

var apiConfig = require('./api.js');

export { apiConfig };

export function saveCache(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getCache(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function clearCacheByKey(key) {
  localStorage.removeItem(key);
}

export function arrayReduceRepeat(arr, key){
  /*
messageCustomerOptionList = messageCustomerOptionList.sort();// 默认字符串
for (var i = 0; i < messageCustomerOptionList.length - 1; i++) {
  if (messageCustomerOptionList[i] == messageCustomerOptionList[i + 1]) {
    messageCustomerOptionList[i] = -1;
  }
}
messageCustomerOptionList = messageCustomerOptionList.filter((s)=>s!==-1)
   */
  
  let listData = arr, obj = {}, result = [];
  if(key){
    for(var i = 0; i < listData.length; i++){
      if(!obj[listData[i][key]]){
       result.push(listData[i]);
       obj[listData[i][key]] = 1;
      }
    }
  }else{
    for(var i = 0; i < listData.length; i++){
      if(!obj[listData[i]]){
       result.push(listData[i]);
       obj[listData[i]] = 1;
      }
    }
  }
  
  return result;
}

export function checkIn(){
  window.location.href = `${apiConfig['loginConfig']}`;
}

export function localApiConfig(){
  return apiConfig
}

/*
 * 一）定义接口类型：
 * www_form_urlencoded_nurseTrainApi| mock_nurseTrainApi | nurseTrainApi
 * 
 * 二）支持的请求类型：
 * const Parse = require('../store/parse');
 * 1.发起Get请求：
 * Parse.run({
        url: '/nurse-train-web/nursetrain/web/read/standard/train/user/v2.5.9/allUserInfo',
        options: {
            method: 'GET',
            data
        },
        api: 'www_form_urlencoded_nurseTrainApi'
    });
 *
 * 2. 发起Post请求：
 * Parse.run({
        url: '/nurse-train-web/nursetrain/web/write/standardTrain/v2.5.9/basicTrainPlan',
        options: {
            method: 'POST',
            data
        },
        api: 'www_form_urlencoded_nurseTrainApi'
    });
  *
  * 3.发起Put请求：
  * Parse.run({
        url: '/nurse-train-web/nursetrain/web/write/standardTrain/v2.5.9/updateBasicTrainPlan',
        options: {
            method: 'PUT',
            data
        },
        api: 'www_form_urlencoded_nurseTrainApi'
    });
  *
  * 4.发起Delete请求：
  * Parse.run({
        url: `/nurse-train-web/nursetrain/web/write/standardTrain/v2.5.9/trainPlan/${id}`,
        options: {
            method: 'DELETE',
            data: {}
        },
        api: 'www_form_urlencoded_nurseTrainApi'
    });
 */
export function run(query) {
  let { url, options, api } = query;
  let headers = {}, params, body = options.data;
  let cancel, optionConfig = {
    'withCredentials': true,
    'responseType': 'json',
    'data': {}
  };
  if(options){ // && options.method !== 'GET'
    if(api.split('_')[0]==='www' || api.split('_')[0]==='mock'){
      params = typeof body == 'string' ? body : (typeof body == 'undefined' ? '': Object.keys(body).map(function(k){
        return encodeURIComponent(k) + '=' + encodeURIComponent(JSON.stringify(body[k]))
      }).join('&'));
      headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };
    }else{ // 针对原有的老接口调用，使用的 Content-Type 消息头
      params = body;
      headers = {
        'Content-Type': 'application/json'
      };
    }
    if(options.method=='GET'&&params){
      url += '?'+params;
    }
  } else {
    params = body
  }
  
  /* 处理 mock 时 cookie 跨域问题： */
  if(api.split('_')[0]==='mock'){
    options.withCredentials = false;
  }
  options.data = params;
  options.headers = headers;
  objectAssign(optionConfig, options);
  
  return axios(apiConfig[api]+url, optionConfig)
          .then((response)=> response.data)
          .catch(()=>{
            checkIn(); // 登录状态已过期，请重新登录 谢谢！
          });
  
}
