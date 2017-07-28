'use strict';

import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { ConnectedRouter, routerMiddleware, push, } from 'react-router-redux';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* 
 * 1) ConnectedRouter 配置 
 * 2) routerReducer 配置 /reducers/index.js 
*  3) push 的使用方式：store.dispatch(push('/foo'))
 */
 
// 配置自定义的中间件
import createHistory from 'history/createBrowserHistory';
const history = createHistory();

// var promise = require('./promise');
import promiseMiddleware from 'redux-promise-middleware';
var promise = promiseMiddleware();

var array = require('./array');
var analytics = require('./analytics');
var reducers = require('../reducers');

var middleware = [
  routerMiddleware(history),
  thunkMiddleware,
  promise,
  array,
  analytics
];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}
var createWeSiteStore = applyMiddleware( ...middleware );

function configureStore(onComplete: ?() => void) {
  // 1) createStore 接受第二个参数，表示 State 的最初状态。这通常是服务器给出的。
  // 2) 如果 createStore 方法已经接受整个应用的初始状态作为参数，那样的话，applyMiddleware就是第三个参数了。不然就是第二个参数
  const store = createStore(reducers, composeEnhancers(createWeSiteStore));
  return store;
}
module.exports = {
  history,
  configureStore: configureStore,
};
