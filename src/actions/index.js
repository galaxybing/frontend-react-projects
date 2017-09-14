'use strict';

const configActions = require('./config');
const mainActions = require('./main');

module.exports = {
  ...configActions,
  ...mainActions,
};
