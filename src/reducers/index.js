'use strict';

var { combineReducers } = require('redux');
import { routerReducer } from 'react-router-redux';
module.exports = combineReducers({
  config: require('./config'),
  main: require('./main'),
  user: require('./user'),
  router: routerReducer //将 reducer 声明到 store 里面的 router 键
});
