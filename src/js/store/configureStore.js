'use strict';

import { applyMiddleware, createStore } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
var thunkMiddleware = require('redux-thunk').default; // Note on 2.x Update
var promise = require('./promise');
var array = require('./array');
var analytics = require('./analytics');
var reducers = require('../reducers');

var history = createHistory();
var routerHistoryMiddleware = routerMiddleware(history);

// apply our middleware for navigating
var createWeSiteStore = applyMiddleware(routerHistoryMiddleware, thunkMiddleware, promise, array, analytics );

function configureStore(onComplete: ?() => void) {
  // 1) createStore 接受第二个参数，表示 State 的最初状态。这通常是服务器给出的。
  // 2) 如果 createStore 方法已经接受整个应用的初始状态作为参数，那样的话，applyMiddleware就是第三个参数了。不然就是第二个参数
  const store = createStore(reducers, createWeSiteStore);
  return store;
}
module.exports = configureStore;
