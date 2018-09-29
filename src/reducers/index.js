'use strict';

var { combineReducers } = require('redux');
import { routerReducer } from 'react-router-redux';
/*
function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    // istanbul ignore next
    case LOCATION_CHANGE:
      return state.merge({
        locationBeforeTransitions: action.payload,
      });
    default:
      return state;
  }
}
*/
module.exports = combineReducers({
  config: require('./config'),
  main: require('./main'),
  user: require('./user'),
  insertQuestions: require('./insertQuestions'),
  trainings: require('./trainings'),
  course: require('./course'),
  courseDetails: require('./courseDetails'),
  chooseQuestions: require('./chooseQuestions'),
  chooseTestAheadQuestions: require('./chooseTestAheadQuestions'),
  filtrate: require('./filtrate'),
  createExamPaper: require('./createExamPaper'), // 随堂测试
  trainingsManage: require('./trainingsManage'), // 培训管理 发布课程
  filter: require('./filter'),
  courseTestAhead: require('./courseTestAhead'), // 课前评估 试题
  router: routerReducer //将 reducer 声明到 store 里面的 router 键
});
