'use strict';
//require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');// 针对 ios 10.3.1（不含）以下版本？？及ie
//const logError = require('logError');

import type { ThunkAction } from '../actions/types';
const storage = window.localStorage;


async function loadFetchQueryAwait(query) {/* 强制同步请求，返回的是最终数据格式 */
    let { method, body }= query;
    method = `http://localhost/${method}`;
    // 处理传参数据
    if(typeof body == 'string'){
        if(body.indexOf('=')<0){
            body = JSON.parse(body);
        };
    }
    var params = typeof body == 'string' ? body : Object.keys(body).map(
            function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(body[k]) }
        ).join('&');
    let results = await fetch(method,{
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        }).then(function(response){
            return response;
        })
        .then(function(response) {
            return response.json(); // ----- 直接返回解析的结果
        });
    if(results.state=="token"){
        alert("请使用微信进行登录吧～");
    }
    /*
    * ----------------------------------------- 直接返回解析的结果，然后使用回调函数实现异步
    */
    return (
        results
    )

}

function loadFetchQuery(query) {/* 异步请求，返回的是 Promise 对象 */
    let {method, body, methodType, hostType}= query;
    method = `http://localhost/${method}`;
    // 处理传参数据
    if(typeof body == 'string'){
        if(body.indexOf('=')<0){
            body = JSON.parse(body);
        };
    }
    var params = typeof body == 'string' ? body : Object.keys(body).map(
            function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(body[k]) }
        ).join('&');
    /*
    return new Promise((resolve, reject) => {
        fetch(method, {
            method: "POST",
            body: params,
            async: false,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
    	.then(function(response) {
            return response.json();
    	}).then(function(res){
            resolve(res);
            //引用
            // let results = await Parse.run({hostType: "comment", method: `auth/auth`, body: {code: source,}});
        });
    });
    */
    return fetch(method, {
        method: "POST",
        body: params,
        async: false,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    }).then(function(response) {
        return response.json();
	});
}

function getFetchQuery(query) {
    var {method, body, methodType, hostType}= query;
    // 处理传参数据
    if(typeof body == 'string'){
        if(body.indexOf('=')<0){
            body = JSON.parse(body);
        };
    }
    var params = typeof body == 'string' ? body : Object.keys(body).map(
            function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(body[k]) }
        ).join('&');
    method = `http://localhost/${method}?${params}`;
    return new Promise((resolve, reject) => {
        fetch(method,{
            method: 'GET',
            async: false,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
    	.then(function(response) {
            return response.json();// return this.text().then(JSON.parse);
    	}).then(function(res){
            resolve(res);
        });
    });

}

module.exports = {
    run: loadFetchQuery,
    runAwait: (url, query) => loadFetchQueryAwait(url, query),
    runQuery: (url, query, method) => getFetchQuery(url, query, method),
};
/*
var globalObject = typeof self === "undefined" ? global : self;
 module.exports = globalObject.fetch.bind(globalObject);
 */
