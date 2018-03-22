import { routerReducer } from 'react-router-redux';
import config from './config';
/*
// function routeReducer(state = routeInitialState, action) {
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

var { combineReducers } = require('redux');

module.exports = combineReducers({
  config,
  main: require('./main'),
  // user,
  router: routerReducer //将 reducer 声明到 store 里面的 router 键
});
