'use strict';
import type { Action, ThunkAction } from './types';
const request = require('../core/_utils/request');

module.exports = {
  login : (source) => (dispatch, getState) => {
    // request
    dispatch({
      type: 'USER_LOGGING_IN'
    });
    setTimeout(() => {
      dispatch({
        type: 'USER_LOGGED_IN',
        data: source
      })
    }, 3000);
  },
  loginOut : (source) => (dispatch, getState) => {
    dispatch({
      type: 'USER_LOGGED_OUT'
    })
  }
}
