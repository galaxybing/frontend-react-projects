'use strict';

var { combineReducers } = require('redux');
import { routerReducer } from 'react-router-redux';
module.exports = combineReducers({
    main: require('./main'),
    router: routerReducer //将 reducer 声明到 store 里面的 router 键
});
