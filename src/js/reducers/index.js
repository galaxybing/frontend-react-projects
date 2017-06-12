'use strict';

var { combineReducers } = require('redux');
import { routerReducer } from 'react-router-redux';

module.exports = combineReducers({
    config: require('./config'),
    main: require('./main'),
    router: routerReducer // Add the reducer to store on the `router` key
});
