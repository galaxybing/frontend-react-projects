'use strict';
const Promise = require('es6-promise').polyfill();
if (!window.Promise) {
  window.Promise = Promise;
}
// import querystring from 'querystring';
// import 'isomorphic-fetch';// 针对 ios 10.3.1（不含）以下版本？？及ie
import axios from 'axios'; 
import objectAssign from 'object-assign';
import apiConfig from './api.js';

export function saveCache(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getCache(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function clearCacheByKey(key) {
  localStorage.removeItem(key);
}

export function run(query) {
  let { url, options, api } = query;
  let headers = {}, body = options.data;
  
  if (options && options.method !== 'GET') {
    let params = typeof body == 'string' ? body : Object.keys(body).map(
            function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(body[k]) }
        ).join('&');
    headers = {
      //'content-type': 'application/json' // 配置为该内容类型时，使之成为了复杂请求形式；即，跨域发起 POST 请求时，会导致二次请求？？所以，使用下面的
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    options.data = params;
  };
  
  let cancel;
  let optionConfig = {
    withCredentials: false,
    responseType: 'json',
    data: {},
    // cancelToken: new CancelToken(function (cancelCallback) {cancel = cancelCallback;}),
  };
  
  objectAssign(optionConfig, options);
  return axios(apiConfig[api]+url, optionConfig) // 虽然是使用 XMLHttpRequest ，但它却是基于 Pormise API;所以后面是可以使用 then()
                            // 1）XMLHttpRequest http-request 所以它是可以修复华为手机百度浏览器中，发送请求失败的问题！
                            // 2）实现更为丰富的请求队列控制方法
                            // 3）不必再引入垫片代码： import 'isomorphic-fetch';
}
