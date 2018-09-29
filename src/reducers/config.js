'use strict';

import type { Action, ThunkAction } from '../actions/types';
const storage = window.localStorage;

export type Config = {
  wifiNetwork: string;
};

const initialState: Config = {
    wifiNetwork: 'wifi',
    baseURL: "",
};

function config(state: Config = initialState, action) {
  if (action.type === 'LOADED_CONFIG_DATA') {
    return {
      ...state,
      tokenVerified: true,
    };
  }
  if (action.type === 'LOGIN_ID_NAME') {
    return {
      id: action.data.id,
      name: encodeURIComponent(action.data.name),
    }
  }
  if (action.type === 'SET_ROUTER_BASENAME') {
    return {
      ...state,
      basename: action.data
    }
  }
  return state;
}

module.exports = config;
