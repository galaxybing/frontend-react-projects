'use strict';

// import configActions from './config';
const mainActions = require('./main');

module.exports = {
  // ...configActions,
  ...mainActions, // 针对 module.exports = {
};
