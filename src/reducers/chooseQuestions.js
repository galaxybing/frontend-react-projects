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

function chooseQuestions(state: Config = initialState, action: Action) {
  if (action.type === 'chooseQuestions/showModal') {
    return { ...state, ...action.payload, visible: true };
  }
  
  if (action.type === 'chooseQuestions/hideModal') {
    return { ...state, visible: false, isRandomQuestionsList: false };
  }
  
  if (action.type === 'chooseQuestions/isRandomQuestions') {
    const { isRandomQuestionsList } = action.payload;
    return { ...state, isRandomQuestionsList };
  }
  
  if (action.type === 'chooseQuestions/save') {
    const { questionsList, questionsQuery } = action.payload;
    return { ...state, questionsList, questionsQuery };
  }
  
  return state;
}
module.exports = chooseQuestions;
