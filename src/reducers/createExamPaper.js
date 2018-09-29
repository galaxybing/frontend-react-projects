'use strict';

import type { Action, ThunkAction } from '../actions/types';
import { QUESTION_TYPE } from '../constants';
import Service from '../actions/createExamPaper';

export type Config = {
  Network: string;
};
const initialState: Config = {
  examPeperDetail: {},
  chooseTestModalVisible: false,
  createExamModalVisible: false,
  questionModalVisible: false,
  editQuestionModalVisible: false,
  clearTestModalVisible: false,
  questionsQuery: {},
  exerciseClassifyList: [],
  chooseQuestionsList: [],
  currentQuestionIndex: 0,
  currentQuestion: {},
  questionList: [],
  curTestType: null,
  clearTypeNum: null,
  selectedAllQuestionsMap: new Map([]),
  questionsListMap: new Map([]),
  totalNum: 0,
  questionsScoreMap: new Map([]),
  totalScore: 0,
  questionModalType: 'create',
  checkedQuestionItemMap: new Map([]),  // render页面CheckBox选中
  chooseQuestionsModalVisible: false,  // 添加试题弹框
}

function createExamPaper(state: Config = initialState, action: Action) {
  /*
  if (action.type === 'createExamPaper/save') {
    return {
      ...state,
      ...action.payload,
    }
  }
  */

  // 选择试题（保存）
  if (action.type === 'createExamPaper/saveQuestionsListForChoose') {
    const { selectedList, curSelectedList } = action.payload;
    const { questionsListMap, selectedAllQuestionsMap, curTestType } = state;
    if (questionsListMap.size === 0) {
      QUESTION_TYPE.map(item => questionsListMap.set(item.id, []));
    }
    const questionList = questionsListMap.get(curTestType);
    questionList.push.apply(questionList, [...curSelectedList.values()]);
    questionsListMap.set(curTestType, questionList);
    selectedAllQuestionsMap.set(curTestType, selectedList);
    return { ...state, selectedAllQuestionsMap, questionsListMap, chooseQuestionsModalVisible: false };
  }

  // 删除试题(2.6.2)
  if (action.type === 'createExamPaper/deleteQuestionByType') {
    const { type } = action.payload;
    const { checkedQuestionItemMap, questionsListMap, selectedAllQuestionsMap } = state;
    const selectedQuestionsMap = selectedAllQuestionsMap.get(type) || new Map();  // 当前操作的试题类型Map
    const checkedQuestion = checkedQuestionItemMap.get(type);
    const questionList = questionsListMap.get(type);
    const questionListByType = [];
    for (const item of questionList) {
      if (checkedQuestion && checkedQuestion.indexOf(item.templateExerciseId || item.id) < 0) {
        questionListByType[questionListByType.length] = item;
      }
    }
    // 删除时同步清掉添加试题弹框中已选的试题id，以便可以再次选择
    if (checkedQuestion) {
      questionsListMap.set(type, questionListByType);
      checkedQuestionItemMap.set(type, []);
      for (const item of checkedQuestion) {
        selectedQuestionsMap.delete(item);
      }
      selectedAllQuestionsMap.set(type, selectedQuestionsMap);
    }
    return { ...state, checkedQuestionItemMap, questionsListMap, selectedAllQuestionsMap };
  }

  // 保存复选框选中的试题（2.6.2)
  if (action.type === 'createExamPaper/saveCheckedQuestion') {
    const { questionList, type } = action.payload;
    const { checkedQuestionItemMap } = state;
    checkedQuestionItemMap.set(type, questionList);
    return { ...state, checkedQuestionItemMap };
  }
  
  // 随堂测试中的数据，从这里获取
  if (action.type === 'createExamPaper/saveEditPaperData') {
    const { examPeperDetail, selectedAllQuestionsMap, questionsListMap, questionsScoreMap } = action.payload;
    return {
      ...state, examPeperDetail, selectedAllQuestionsMap, questionsListMap, questionsScoreMap
    }
  }


  if (action.type === 'createExamPaper/saveTypeNum') {
    const { curTestType } = action.payload;
    return { ...state, curTestType };
  }
  
  if (action.type === 'createExamPaper/saveOtherData') {
    return { ...state, ...action.payload };
  }
  
  if (action.type === 'createExamPaper/saveTotalValue') {
    const { totalNum, totalScore, exerciseDOList } = action.payload;
    return {...state,   /* 供提交数据时使用： */ totalNum, totalScore, exerciseDOList}
  }

  if (action.type === 'createExamPaper/resetState') {
    // 不可以直接 返回? initialState ，变量会被篡改
    return {
      examPeperDetail: {},
      chooseTestModalVisible: false,
      createExamModalVisible: false,
      questionModalVisible: false,
      editQuestionModalVisible: false,
      clearTestModalVisible: false,
      questionsQuery: {},
      exerciseClassifyList: [],
      chooseQuestionsList: [],
      currentQuestionIndex: 0,
      currentQuestion: {},
      questionList: [],
      curTestType: null,
      clearTypeNum: null,
      selectedAllQuestionsMap: new Map([]),
      questionsListMap: new Map([]),
      questionsScoreMap: new Map([]),
      questionModalType: 'create',
      checkedQuestionItemMap: new Map([]),  // render页面CheckBox选中
      chooseQuestionsModalVisible: false,  // 添加试题弹框
    }
  }

  return state;
}

module.exports = createExamPaper;