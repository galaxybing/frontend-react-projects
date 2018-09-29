'use strict';

import type { Action, ThunkAction } from '../actions/types';

export type Config = {
    Network: string;
};

const initialState: Config = {
    "profile": {},
    "menuList": [],
    "topNavRest": {}
};

function main(state: Config = initialState, action: Action) {
    if (action.type === 'GET_ADMIN_INFO') {
        return {
            ...state,
            ...action.data,
        }
    }
    if (action.type === 'GET_TOP_NAV_INFO') {
        return {
            ...state,
            ...action.data,
        }
    }
    if (action.type === 'GET_PRIVILEGE_MENU') {
        return {
            ...state,
            ...action.data,
        }
    }
    return state;
}

module.exports = main;
