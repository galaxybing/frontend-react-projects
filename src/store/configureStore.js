import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
// import { createLogger } from 'redux-logger';
import { /* ConnectedRouter,*/ routerMiddleware, /* push, */ } from 'react-router-redux';
import promiseMiddleware from 'redux-promise-middleware';
const createHistory = require('history').createBrowserHistory

const boz = require('../../config').BOZ;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
 
// 配置自定义的中间件

const history = createHistory();

// var promise = require('./promise');
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
  // middleware.push(createLogger());
}
var createWeSiteStore = applyMiddleware( ...middleware );

const loadInitializingState = () => { // 获取 持久化的数据对象
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined
    } else {
      const state = JSON.parse(serializedState);
      const version = boz[`env`];
      if (state.config && state.config.version !== version ) {
        return undefined
      } else {
        return state
      }
    }
  } catch (err) {
    return undefined
  }
}

function configureStore(onComplete: ?() => void) {
  // 1) createStore 接受第二个参数，表示 State 的最初状态。这通常是服务器给出的。
  // 2) 如果 createStore 方法已经接受整个应用的初始状态（ initializingState ）作为参数，那样的话，applyMiddleware就是第三个参数了。不然就是第二个参数
  const store = createStore(reducers, /* loadInitializingState(), */ composeEnhancers(createWeSiteStore));
  return store;
}
module.exports = {
  history,
  configureStore: configureStore,
};
