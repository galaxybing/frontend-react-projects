'use strict';
import type { Action, ThunkAction } from './types';
const storage = window.localStorage;
const Parse = require('../store/parse');

export function logout() {
  return {
    type: 'USER_LOGGED_OUT'
  }
}




