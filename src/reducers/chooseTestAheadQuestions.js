'use strict';

import type { Action, ThunkAction } from '../actions/types';

export type Config = {
    Network: string;
};

const initialState: Config = {
    visible: false,
    questionsList: [],
    questionsQuery: {},
    isRandomQuestionsList: false,
    payTypeModalVisible: false,
}

function chooseTestAheadQuestions(state: Config = initialState, action: Action) {
  if (action.type === 'chooseTestAheadQuestions/showModal') {
    return { ...state, ...action.payload, visible: true };
  }
  
  if (action.type === 'chooseTestAheadQuestions/hideModal') {
    return { ...state, visible: false, isRandomQuestionsList: false };
  }
  
  if (action.type === 'chooseTestAheadQuestions/isRandomQuestions') {
    const { isRandomQuestionsList } = action.payload;
    return { ...state, isRandomQuestionsList };
  }
  
  if (action.type === 'chooseTestAheadQuestions/save') {
    const { questionsList, questionsQuery } = action.payload;
    return { ...state, questionsList, questionsQuery };
  }
  
  return state;
}
module.exports = chooseTestAheadQuestions;
