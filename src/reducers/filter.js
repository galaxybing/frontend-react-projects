'use strict';

import type { Action, ThunkAction } from '../actions/types';

export type Config = {
  Network: string;
};

const initialState: Config = {
  publicLevelList: [],
  publicDepartmentList: [],
  publicSubjectList: [],
  sourceList: [],
  isLoaded: false
}

function filter(state: Config = initialState, action: Action) {
  if (action.type === 'filter/save') {
    return {
      ...state,
      ...action.payload,
    }
  }
  return state;
}
module.exports = filter;
