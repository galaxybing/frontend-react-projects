'use strict';

// const configActions = require('./config');
import config from './config';
const mainActions = require('./main');

module.exports = {
  ...config,
  ...mainActions,
};
