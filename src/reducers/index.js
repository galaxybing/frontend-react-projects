'use strict';

var { combineReducers } = require('redux');
import { routerReducer } from 'react-router-redux';
/*
function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    // istanbul ignore next
    case LOCATION_CHANGE:
      return state.merge({
        locationBeforeTransitions: action.payload,
      });
    default:
      return state;
  }
}
*/
module.exports = combineReducers({
    config: require('./config'),
    main: require('./main'),
    router: routerReducer //将 reducer 声明到 store 里面的 router 键
});
