const Promise = require('es6-promise').polyfill();
if (!window.Promise) {
  window.Promise = Promise;
}
import axios from 'axios';
import objectAssign from 'object-assign';
var apiConfig = require('./api.js');
export { apiConfig };

import warning from '../core/_utils/warning';

export function saveCache(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getCache(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function clearCacheByKey(key) {
  localStorage.removeItem(key);
}

/** @数组去重
 * 遍历数组对象，将多次出现的元素移除，并返回新组装的数组对象
 * 
 * 如果传入第 2 个参数（索引名称），则按指定名称移除元素重复，其他重复不变更
 *
 * @param    {array}   arr         数组
 * @param    {?string}  arr_index  索引名称
 * 
 * @returns  array
 *
 * @date     
 * @author   galaxyw<wangyh@317hu.com>
 */
export function arrayReduceRepeat(arr, key) {
  /*
messageCustomerOptionList = messageCustomerOptionList.sort();// 默认字符串
for (var i = 0; i < messageCustomerOptionList.length - 1; i++) {
  if (messageCustomerOptionList[i] == messageCustomerOptionList[i + 1]) {
    messageCustomerOptionList[i] = -1;
  }
}
messageCustomerOptionList = messageCustomerOptionList.filter((s)=>s!==-1)
   */

  let listData = arr,
    obj = {},
    result = [];
  if (key) {
    for (var i = 0; i < listData.length; i++) {
      if (!obj[listData[i][key]]) { // 判定为 false 则执行下面赋值
        result.push(listData[i]);
        obj[listData[i][key]] = true; // 设置状态为 true
      }
    }
  } else {
    for (var i = 0; i < listData.length; i++) {
      if (!obj[listData[i]]) {
        result.push(listData[i]);
        obj[listData[i]] = 1;
      }
    }
  }

  return result;
}


/** @引用类型对象深拷贝
 * 遍历对象广度，并返回新对象
 *
 * @param    {array}   data
 * 
 * @returns  {object}  result
 *
 * @date     
 * @author   galaxyw<galaxybing@gmail.com>
 */

export function deepClone(data) {
  warning(
    false, 
    `工具函数 deepClone 即将迁移，推荐 import deepClone from '../core/_utils/deepClone'; 引用方式`
  );
  /**
   * 返回的类型字符串表示
   */
  var getType = function(obj) {
    var toString = Object.prototype.toString; // 返回对应类型的构造函数字符串形式
    var map = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
      '[object Object]': 'object'
    };
    if (obj instanceof Element) {
      return 'element';
    }
    return map[toString.call(obj)];
  }
  
  /**
   * 根据数据值类型
   * 返回 数组|对象|简单数据
   */
  var setDefaultValue = function(val){
    var type = getType(val);
    var temp;
    if (type === 'array') {
      temp = [];
    } else if (type === 'object') {
      temp = {};
    } else {
      //不再具有下一层次
      temp = val;// 如函数
    }
    return temp;
  }
  
  var obj = setDefaultValue(data);
  var originQueue = [data];
  var copyQueue = [obj];

  // 以下两个队列用来保存复制过程中访问过的对象，以此来避免对象环的问题（对象的某个属性值是对象本身）
  var visitQueue = [];
  var copyVisitQueue = [];

  while (originQueue.length > 0) {
    var _data = originQueue.shift();
    var _obj = copyQueue.shift();
    visitQueue.push(_data);
    copyVisitQueue.push(_obj);
    for (var key in _data) {
      var _value = _data[key]
      
      if (typeof _value !== 'object') {
        _obj[key] = _value; // 直接拷贝赋值
      } else {
        // 使用indexOf可以发现数组中是否存在相同的对象(实现indexOf的难点就在于对象比较)
        var index = visitQueue.indexOf(_value);
        if (index >= 0) {
          _obj[key] = copyVisitQueue[index];
        }
        originQueue.push(_value); // 延长源数据树 进一步循环遍历

        // 生成目标对象数据树
        // _obj[key] = {};
        // 拷贝类型区分
        _obj[key] = setDefaultValue(_value);

        copyQueue.push(_obj[key]); // 依赖 引用类型值引用地址一致
      }
    }
  }
  return obj;
}


export function checkIn() {
  window.location.href = `${apiConfig['loginConfig']}`;
}

export function localApiConfig() {
  return apiConfig
}

export function run(query) {
  warning(
    false, 
    `run 函数即将迁移，推荐 import request from '../core/_utils/request'; 引用方式`
  );
  let {
    url,
    options,
    api
  } = query;
  let headers = {},
    params, body = options.data;
  let cancel, optionConfig = {
    'withCredentials': true,
    'responseType': 'json',
    'data': {}
  };
  if (options) { // && options.method !== 'GET'
    if (api.split('_')[0] === 'www' || api.split('_')[0] === 'mock') {
      params = typeof body == 'string' ? body : (typeof body == 'undefined' ? '' : Object.keys(body).map(function(k) {
        let val = body[k];
        if (!val) {
          return encodeURIComponent(k) + '='
        }
        return encodeURIComponent(k) + '=' + encodeURIComponent(typeof val === 'string' ? val : JSON.stringify(val))
      }).join('&'));
      headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };
    } else { // 针对原有的老接口调用，使用的 Content-Type 消息头
      params = body;
      headers = {
        'Content-Type': 'application/json'
      };
    }

    // if((options.method=='GET' || options.method == 'PUT')&&params){
    //  后端接口如果未针对 PUT 请求传参作处理时，需要拼接传参形式
    if (options.method == 'GET' && params) {
      url += '?' + params;
    }
  } else {
    params = body
  }

  /* 处理 mock 时 cookie 跨域问题： */
  if (api.split('_')[0] === 'mock') {
    options.withCredentials = false;
  }
  options.data = params;
  options.headers = headers;
  objectAssign(optionConfig, options);

  return axios(apiConfig[api] + url, optionConfig)
    .then((response) => response.data)
    .catch(() => {
      checkIn(); // 登录状态已过期，请重新登录 谢谢！
    });

}